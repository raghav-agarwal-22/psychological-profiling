import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import crypto from 'node:crypto'
import Stripe from 'stripe'
import PDFDocument from 'pdfkit'
import { prisma } from '@innermind/db'
import { requireAuth } from '../lib/auth.js'

const isProduction = process.env.NODE_ENV === 'production'

function requireEnv(name: string, fallback: string): string {
  const value = process.env[name]
  if (!value || value === fallback) {
    if (isProduction) {
      throw new Error(`[professional] Missing required environment variable: ${name}`)
    }
    return fallback
  }
  return value
}

const stripe = new Stripe(requireEnv('STRIPE_SECRET_KEY', 'sk_test_placeholder'), {
  apiVersion: '2026-02-25.clover',
})

const WEB_URL = process.env.WEB_URL ?? 'http://localhost:3000'

const PROFESSIONAL_PRICE_IDS = {
  starter_monthly: requireEnv('STRIPE_PROFESSIONAL_STARTER_MONTHLY', 'price_professional_starter_monthly_placeholder'),
  starter_annual: requireEnv('STRIPE_PROFESSIONAL_STARTER_ANNUAL', 'price_professional_starter_annual_placeholder'),
  unlimited_monthly: requireEnv('STRIPE_PROFESSIONAL_UNLIMITED_MONTHLY', 'price_professional_unlimited_monthly_placeholder'),
  unlimited_annual: requireEnv('STRIPE_PROFESSIONAL_UNLIMITED_ANNUAL', 'price_professional_unlimited_annual_placeholder'),
} as const

const SEAT_LIMITS: Record<string, number> = {
  starter: 10,
  unlimited: 50,
}

const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(100),
  tier: z.enum(['starter', 'unlimited']).default('starter'),
  interval: z.enum(['monthly', 'annual']).default('monthly'),
})

const createTrialWorkspaceSchema = z.object({
  name: z.string().min(1).max(100),
})

const demoRequestSchema = z.object({
  fullName: z.string().min(1).max(100),
  email: z.string().email(),
  role: z.string().min(1),
  practiceSize: z.string().min(1),
  useCase: z.string().min(1),
})

const inviteClientSchema = z.object({
  email: z.string().email(),
  name: z.string().max(100).optional(),
})

const updateNotesSchema = z.object({
  notes: z.string().max(10000),
})

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + crypto.randomBytes(3).toString('hex')
}

async function sendProfessionalInviteEmail(
  to: string,
  practitionerName: string,
  inviteUrl: string,
): Promise<void> {
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY ?? 'dev-placeholder')
  const from = process.env.EMAIL_FROM ?? 'noreply@innermindhealing.com'

  await resend.emails.send({
    from,
    to,
    subject: `${practitionerName} wants to understand you better`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#1c1917;color:#e7e5e4;border-radius:12px;">
        <h2 style="color:#fbbf24;margin-bottom:8px;">You've been invited to Innermind</h2>
        <p style="color:#a8a29e;margin-bottom:24px;">${practitionerName} uses Innermind to build a deeper psychological understanding of the people they work with.</p>
        <p style="margin-bottom:24px;">They've invited you to complete a short, research-backed psychological assessment. Your responses stay private — you control what you share.</p>
        <a href="${inviteUrl}" style="display:inline-block;background:#fbbf24;color:#1c1917;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Accept invite →</a>
        <p style="color:#78716c;font-size:12px;margin-top:32px;">This invite expires in 7 days. If you didn't expect this, you can safely ignore it.</p>
      </div>
    `,
  })
}

async function sendTrialWelcomeEmail(to: string, practitionerName: string, workspaceId: string): Promise<void> {
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY ?? 'dev-placeholder')
  const from = process.env.EMAIL_FROM ?? 'noreply@innermindhealing.com'

  await resend.emails.send({
    from,
    to,
    subject: 'Your Innermind workspace is ready — invite your first client',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#1c1917;color:#e7e5e4;border-radius:12px;">
        <h2 style="color:#fbbf24;margin-bottom:8px;">Your workspace is ready</h2>
        <p style="color:#a8a29e;margin-bottom:16px;">Hi ${practitionerName},</p>
        <p style="margin-bottom:16px;">Your Innermind professional workspace is live. You have <strong style="color:#fbbf24;">14 days</strong> to explore — no credit card needed.</p>
        <p style="margin-bottom:24px;"><strong>Start here:</strong> Invite your first client and they'll complete 5 validated assessments. You'll have a full psychological portrait waiting before your first session.</p>
        <a href="${WEB_URL}/professional/${workspaceId}" style="display:inline-block;background:#fbbf24;color:#1c1917;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Go to your workspace →</a>
        <p style="color:#78716c;font-size:12px;margin-top:32px;">Questions? Reply to this email — we read every message.</p>
      </div>
    `,
  })
}

async function sendDemoConfirmationEmail(to: string, fullName: string, practiceSize: string): Promise<void> {
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY ?? 'dev-placeholder')
  const from = process.env.EMAIL_FROM ?? 'noreply@innermindhealing.com'

  const includeCalendly = ['6–20 practitioners', '20+ practitioners'].includes(practiceSize)

  await resend.emails.send({
    from,
    to,
    subject: "Here's your Innermind demo",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#1c1917;color:#e7e5e4;border-radius:12px;">
        <h2 style="color:#fbbf24;margin-bottom:8px;">Thanks, ${fullName}</h2>
        <p style="color:#a8a29e;margin-bottom:24px;">Here's your walkthrough of Innermind for practitioners.</p>
        <p style="margin-bottom:8px;"><strong>5-minute product walkthrough:</strong></p>
        <p style="margin-bottom:24px;color:#a8a29e;">See the client invite flow, assessment dashboard, and PDF report in action. (Video link coming soon — reply to this email for a live walkthrough.)</p>
        <a href="${WEB_URL}/professional" style="display:inline-block;background:#fbbf24;color:#1c1917;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-bottom:24px;">Start your free 14-day trial →</a>
        ${includeCalendly ? '<p style="color:#a8a29e;margin-top:16px;">For a live 30-minute walkthrough with our team, reply to this email and we\'ll set up time.</p>' : ''}
        <p style="color:#78716c;font-size:12px;margin-top:32px;">No credit card required to start your trial.</p>
      </div>
    `,
  })
}

export async function professionalRoutes(server: FastifyInstance) {
  // POST /api/professional/workspaces — create workspace + Stripe Checkout
  server.post('/workspaces', { preHandler: requireAuth }, async (req, reply) => {
    const body = createWorkspaceSchema.safeParse(req.body)
    if (!body.success) {
      return reply.status(400).send({ error: 'Invalid request', issues: body.error.issues })
    }

    const { name, tier, interval } = body.data
    const userId = req.user.userId

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, stripeCustomerId: true },
    })
    if (!user) return reply.status(404).send({ error: 'User not found' })

    const priceKey = `${tier}_${interval}` as keyof typeof PROFESSIONAL_PRICE_IDS
    const priceId = PROFESSIONAL_PRICE_IDS[priceKey]

    // Create (or reuse) Stripe customer
    let customerId = user.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email })
      customerId = customer.id
      await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId: customerId } })
    }

    // Create the workspace DB record first
    const workspace = await prisma.team.create({
      data: {
        name,
        slug: slugify(name),
        ownerId: userId,
        type: 'professional',
        professionalTier: tier,
        seatLimit: SEAT_LIMITS[tier] ?? 3,
        subscriptionStatus: 'inactive',
        stripeCustomerId: customerId,
        members: {
          create: {
            userId,
            role: 'owner',
            inviteStatus: 'accepted',
          },
        },
      },
    })

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${WEB_URL}/professional/${workspace.id}?checkout=success`,
      cancel_url: `${WEB_URL}/professional`,
      metadata: { workspaceId: workspace.id, tier, interval },
    })

    return reply.send({ workspaceId: workspace.id, checkoutUrl: session.url })
  })

  // POST /api/professional/workspaces/trial — create trial workspace (no payment required)
  server.post('/workspaces/trial', { preHandler: requireAuth }, async (req, reply) => {
    const body = createTrialWorkspaceSchema.safeParse(req.body)
    if (!body.success) {
      return reply.status(400).send({ error: 'Invalid request', issues: body.error.issues })
    }

    const userId = req.user.userId
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    })
    if (!user) return reply.status(404).send({ error: 'User not found' })

    const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)

    const workspace = await prisma.team.create({
      data: {
        name: body.data.name,
        slug: slugify(body.data.name),
        ownerId: userId,
        type: 'professional',
        professionalTier: 'starter',
        seatLimit: 3,
        subscriptionStatus: 'trial',
        trialEndsAt,
        members: {
          create: {
            userId,
            role: 'owner',
            inviteStatus: 'accepted',
          },
        },
      },
    })

    try {
      await sendTrialWelcomeEmail(user.email, user.name ?? user.email, workspace.id)
    } catch (err) {
      server.log.error({ err }, '[professional] Failed to send trial welcome email')
    }

    return reply.status(201).send({ workspaceId: workspace.id })
  })

  // POST /api/professional/demo-request — async demo request
  server.post('/demo-request', async (req, reply) => {
    const body = demoRequestSchema.safeParse(req.body)
    if (!body.success) {
      return reply.status(400).send({ error: 'Invalid request', issues: body.error.issues })
    }

    const { fullName, email, role, practiceSize, useCase } = body.data

    try {
      await sendDemoConfirmationEmail(email, fullName, practiceSize)
    } catch (err) {
      server.log.error({ err, email }, '[professional] Failed to send demo confirmation email')
      return reply.status(500).send({ error: 'Failed to send demo email' })
    }

    return reply.status(201).send({ ok: true })
  })

  // GET /api/professional/workspaces — list practitioner workspaces
  server.get('/workspaces', { preHandler: requireAuth }, async (req, reply) => {
    const workspaces = await prisma.team.findMany({
      where: { ownerId: req.user.userId, type: 'professional' },
      include: {
        members: {
          select: { id: true, inviteStatus: true, inviteEmail: true, userId: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return reply.send({ workspaces })
  })

  // GET /api/professional/workspaces/:id — workspace detail with clients
  server.get<{ Params: { id: string } }>('/workspaces/:id', { preHandler: requireAuth }, async (req, reply) => {
    const workspace = await prisma.team.findFirst({
      where: { id: req.params.id, ownerId: req.user.userId, type: 'professional' },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                profiles: {
                  orderBy: { generatedAt: 'desc' },
                  take: 1,
                  select: { id: true, summary: true, archetypes: true, generatedAt: true },
                },
              },
            },
          },
        },
      },
    })

    if (!workspace) return reply.status(404).send({ error: 'Workspace not found' })

    const clientCount = workspace.members.filter((m) => m.role !== 'owner').length

    const trialDaysLeft = workspace.trialEndsAt
      ? Math.max(0, Math.ceil((workspace.trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : null

    return reply.send({
      workspace: {
        ...workspace,
        clientCount,
        seatsRemaining: workspace.seatLimit - clientCount,
        trialDaysLeft,
      },
    })
  })

  // POST /api/professional/workspaces/:id/clients — invite client
  server.post<{ Params: { id: string } }>('/workspaces/:id/clients', { preHandler: requireAuth }, async (req, reply) => {
    const body = inviteClientSchema.safeParse(req.body)
    if (!body.success) {
      return reply.status(400).send({ error: 'Invalid request', issues: body.error.issues })
    }

    const workspace = await prisma.team.findFirst({
      where: { id: req.params.id, ownerId: req.user.userId, type: 'professional' },
      include: {
        members: { where: { role: { not: 'owner' } } },
        owner: { select: { name: true, email: true } },
      },
    })

    if (!workspace) return reply.status(404).send({ error: 'Workspace not found' })

    const isTrial = workspace.subscriptionStatus === 'trial'
    const isActive = workspace.subscriptionStatus === 'active'

    if (!isTrial && !isActive) {
      return reply.status(402).send({ error: 'Active subscription or trial required to invite clients' })
    }

    // Check trial has not expired
    if (isTrial && workspace.trialEndsAt && workspace.trialEndsAt < new Date()) {
      return reply.status(402).send({ error: 'Trial has expired. Upgrade to invite more clients.' })
    }

    const clientCount = workspace.members.length
    if (clientCount >= workspace.seatLimit) {
      return reply.status(402).send({ error: `Seat limit reached (${workspace.seatLimit}). Upgrade your plan to invite more clients.` })
    }

    const { email } = body.data

    // Check if already invited
    const existing = await prisma.teamMember.findFirst({
      where: { teamId: workspace.id, inviteEmail: email },
    })
    if (existing) {
      return reply.status(409).send({ error: 'Client already invited' })
    }

    const inviteToken = crypto.randomBytes(32).toString('hex')

    const member = await prisma.teamMember.create({
      data: {
        teamId: workspace.id,
        inviteEmail: email,
        inviteToken,
        inviteStatus: 'pending',
        invitedAt: new Date(),
        role: 'client',
      },
    })

    const inviteUrl = `${WEB_URL}/professional/accept-invite?token=${inviteToken}`
    const practitionerName = workspace.owner.name ?? workspace.owner.email

    try {
      await sendProfessionalInviteEmail(email, practitionerName, inviteUrl)
    } catch (err) {
      server.log.error({ err, email }, '[professional] Failed to send invite email')
    }

    return reply.status(201).send({ member: { id: member.id, inviteEmail: email, inviteStatus: 'pending' } })
  })

  // GET /api/professional/workspaces/:id/clients — list clients
  server.get<{ Params: { id: string } }>('/workspaces/:id/clients', { preHandler: requireAuth }, async (req, reply) => {
    const workspace = await prisma.team.findFirst({
      where: { id: req.params.id, ownerId: req.user.userId, type: 'professional' },
    })
    if (!workspace) return reply.status(404).send({ error: 'Workspace not found' })

    const members = await prisma.teamMember.findMany({
      where: { teamId: workspace.id, role: 'client' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            profiles: {
              orderBy: { generatedAt: 'desc' },
              take: 1,
              select: { id: true, summary: true, archetypes: true, generatedAt: true },
            },
          },
        },
      },
    })

    return reply.send({ clients: members })
  })

  // DELETE /api/professional/workspaces/:id/clients/:clientId — remove client
  server.delete<{ Params: { id: string; clientId: string } }>('/workspaces/:id/clients/:clientId', { preHandler: requireAuth }, async (req, reply) => {
    const workspace = await prisma.team.findFirst({
      where: { id: req.params.id, ownerId: req.user.userId, type: 'professional' },
    })
    if (!workspace) return reply.status(404).send({ error: 'Workspace not found' })

    const member = await prisma.teamMember.findFirst({
      where: { id: req.params.clientId, teamId: workspace.id },
    })
    if (!member) return reply.status(404).send({ error: 'Client not found' })

    await prisma.teamMember.delete({ where: { id: req.params.clientId } })

    return reply.send({ ok: true })
  })

  // PATCH /api/professional/workspaces/:id/clients/:clientId — update notes
  server.patch<{ Params: { id: string; clientId: string } }>('/workspaces/:id/clients/:clientId', { preHandler: requireAuth }, async (req, reply) => {
    const body = updateNotesSchema.safeParse(req.body)
    if (!body.success) {
      return reply.status(400).send({ error: 'Invalid request' })
    }

    const workspace = await prisma.team.findFirst({
      where: { id: req.params.id, ownerId: req.user.userId, type: 'professional' },
    })
    if (!workspace) return reply.status(404).send({ error: 'Workspace not found' })

    const member = await prisma.teamMember.update({
      where: { id: req.params.clientId },
      data: { practitionerNotes: body.data.notes },
    })

    return reply.send({ member })
  })

  // GET /api/professional/workspaces/:id/clients/:clientId/report — download PDF report
  server.get<{ Params: { id: string; clientId: string } }>('/workspaces/:id/clients/:clientId/report', { preHandler: requireAuth }, async (req, reply) => {
    const workspace = await prisma.team.findFirst({
      where: { id: req.params.id, ownerId: req.user.userId, type: 'professional' },
    })
    if (!workspace) return reply.status(404).send({ error: 'Workspace not found' })

    const member = await prisma.teamMember.findFirst({
      where: { id: req.params.clientId, teamId: workspace.id, inviteStatus: 'accepted' },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            profiles: {
              orderBy: { generatedAt: 'desc' },
              take: 1,
              select: {
                id: true,
                summary: true,
                archetypes: true,
                dimensions: true,
                blindSpots: true,
                generatedAt: true,
              },
            },
          },
        },
      },
    })

    if (!member?.user) return reply.status(404).send({ error: 'Client not found or has not accepted invite' })
    const { user } = member
    const profile = user.profiles[0]
    if (!profile) return reply.status(404).send({ error: 'Client has not completed any assessments yet' })

    const clientName = user.name ?? user.email
    const doc = new PDFDocument({ margin: 50, size: 'A4' })
    const chunks: Buffer[] = []
    doc.on('data', (chunk: Buffer) => chunks.push(chunk))

    await new Promise<void>((resolve) => {
      doc.on('end', resolve)

      // Header
      doc.fontSize(9).fillColor('#b87333').text('INNERMIND PSYCHOLOGICAL PORTRAIT', { align: 'center' })
      doc.moveDown(0.3)
      doc.fontSize(22).fillColor('#1c1917').font('Helvetica-Bold').text(clientName, { align: 'center' })
      doc.moveDown(0.2)
      doc.fontSize(10).fillColor('#78716c').font('Helvetica').text(
        `Generated ${new Date(profile.generatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · Prepared by ${workspace.name}`,
        { align: 'center' },
      )

      doc.moveDown(0.5)
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#e7e5e0').stroke()
      doc.moveDown(0.8)

      // Archetypes
      if (profile.archetypes && (profile.archetypes as string[]).length > 0) {
        doc.fontSize(8).fillColor('#b87333').font('Helvetica-Bold').text('PRIMARY ARCHETYPES')
        doc.moveDown(0.3)
        doc.fontSize(13).fillColor('#1c1917').font('Helvetica-Bold').text((profile.archetypes as string[]).join('  ·  '))
        doc.moveDown(0.8)
      }

      // Psychological summary
      doc.fontSize(8).fillColor('#b87333').font('Helvetica-Bold').text('PSYCHOLOGICAL PORTRAIT')
      doc.moveDown(0.3)
      doc.fontSize(10).fillColor('#292524').font('Helvetica').text(profile.summary, { lineGap: 4 })
      doc.moveDown(0.8)

      // Blind spots
      if (profile.blindSpots) {
        const bs = profile.blindSpots as { title?: string; description?: string }[]
        if (Array.isArray(bs) && bs.length > 0) {
          doc.fontSize(8).fillColor('#b87333').font('Helvetica-Bold').text('BLIND SPOTS & GROWTH EDGES')
          doc.moveDown(0.3)
          for (const spot of bs) {
            doc.fontSize(10).fillColor('#292524').font('Helvetica-Bold').text(spot.title ?? '', { continued: false })
            doc.fontSize(9).fillColor('#57534e').font('Helvetica').text(spot.description ?? '', { lineGap: 3 })
            doc.moveDown(0.4)
          }
        }
      }

      // Practitioner notes
      if (member.practitionerNotes) {
        doc.moveDown(0.3)
        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#e7e5e0').stroke()
        doc.moveDown(0.5)
        doc.fontSize(8).fillColor('#b87333').font('Helvetica-Bold').text('PRACTITIONER NOTES (PRIVATE)')
        doc.moveDown(0.3)
        doc.fontSize(9).fillColor('#57534e').font('Helvetica').text(member.practitionerNotes, { lineGap: 3 })
      }

      // Footer
      const footerY = doc.page.height - 60
      doc.moveTo(50, footerY).lineTo(545, footerY).strokeColor('#e7e5e0').stroke()
      doc.fontSize(8).fillColor('#a8a29e').text('Confidential — prepared for practitioner use only. innermindhealing.com', 50, footerY + 10, { align: 'center' })

      doc.end()
    })

    const pdfBuffer = Buffer.concat(chunks)
    const filename = `${clientName.replace(/[^a-z0-9]/gi, '_')}_innermind_profile.pdf`

    reply
      .header('Content-Type', 'application/pdf')
      .header('Content-Disposition', `attachment; filename="${filename}"`)
      .send(pdfBuffer)
  })

  // GET /api/professional/accept-invite — accept client invite
  server.get<{ Querystring: { token: string } }>('/accept-invite', { preHandler: requireAuth }, async (req, reply) => {
    const { token } = req.query

    const member = await prisma.teamMember.findUnique({
      where: { inviteToken: token },
      include: { team: { select: { name: true, ownerId: true } } },
    })

    if (!member || member.inviteStatus === 'accepted') {
      return reply.status(400).send({ error: 'Invalid or already used invite token' })
    }

    await prisma.teamMember.update({
      where: { id: member.id },
      data: {
        userId: req.user.userId,
        inviteStatus: 'accepted',
        inviteToken: null,
      },
    })

    return reply.send({ ok: true, workspaceName: member.team.name })
  })

  // GET /api/professional/workspaces/:id/clients/:clientId/profile — client profile (practitioner view)
  server.get<{ Params: { id: string; clientId: string } }>('/workspaces/:id/clients/:clientId/profile', { preHandler: requireAuth }, async (req, reply) => {
    const workspace = await prisma.team.findFirst({
      where: { id: req.params.id, ownerId: req.user.userId, type: 'professional' },
    })
    if (!workspace) return reply.status(404).send({ error: 'Workspace not found' })

    const member = await prisma.teamMember.findFirst({
      where: { id: req.params.clientId, teamId: workspace.id, inviteStatus: 'accepted' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            profiles: {
              orderBy: { generatedAt: 'desc' },
              take: 5,
              select: {
                id: true,
                summary: true,
                archetypes: true,
                dimensions: true,
                blindSpots: true,
                generatedAt: true,
              },
            },
          },
        },
      },
    })

    if (!member || !member.user) {
      return reply.status(404).send({ error: 'Client not found or has not accepted invite' })
    }

    return reply.send({
      client: {
        id: member.id,
        email: member.user.email,
        name: member.user.name,
        notes: member.practitionerNotes,
        profiles: member.user.profiles,
      },
    })
  })
}
