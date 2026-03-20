import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { Resend } from 'resend'
import { prisma } from '@innermind/db'
import { requireAuth } from '../lib/auth.js'

const resend = new Resend(process.env.RESEND_API_KEY ?? 'dev-placeholder')
const FROM_ADDRESS = process.env.EMAIL_FROM ?? 'noreply@innermind.app'

const COMMISSION_RATE = 0.20 // 20%
const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL ?? 'http://localhost:3000'

function generateAffiliateCode(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 6)
    .padEnd(4, 'x')
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `${base}${suffix}`
}

const applyBodySchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  websiteUrl: z.string().url(),
  audienceDesc: z.string().min(10).max(1000),
  audienceSize: z.number().int().positive().optional(),
})

// Exported so billing.ts can call it on invoice.payment_succeeded
export async function logAffiliateCommission(
  userId: string,
  stripeInvoiceId: string,
  amountCents: number, // the invoice amount in cents
): Promise<void> {
  // Find if this user was referred by an affiliate
  const referral = await prisma.affiliateReferral.findUnique({
    where: { userId },
    include: { affiliate: { select: { id: true, status: true } } },
  })
  if (!referral || referral.affiliate.status !== 'approved') return

  // Skip if we already logged a commission for this invoice
  const existing = await prisma.affiliateCommission.findUnique({
    where: { stripeInvoiceId },
  })
  if (existing) return

  const commissionCents = Math.floor(amountCents * COMMISSION_RATE)

  await prisma.affiliateCommission.create({
    data: {
      affiliateId: referral.affiliateId,
      referralId: referral.id,
      amountCents: commissionCents,
      stripeInvoiceId,
      status: 'pending',
    },
  })
}

export async function affiliateRoutes(server: FastifyInstance) {
  // POST /api/affiliates/apply — submit affiliate application (public)
  server.post('/apply', async (req, reply) => {
    const parsed = applyBodySchema.safeParse(req.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid request', issues: parsed.error.issues })
    }

    const { name, email, websiteUrl, audienceDesc, audienceSize } = parsed.data

    // Check for duplicate application
    const existing = await prisma.affiliate.findUnique({ where: { email } })
    if (existing) {
      return reply.status(409).send({ error: 'An application from this email already exists' })
    }

    // Generate unique referral code
    let referralCode = generateAffiliateCode(name)
    let attempts = 0
    while (await prisma.affiliate.findUnique({ where: { referralCode } })) {
      referralCode = generateAffiliateCode(name)
      if (++attempts > 10) referralCode = `aff${Date.now().toString(36).toUpperCase()}`
    }

    // Check if applicant is already a user — link the account
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } })

    await prisma.affiliate.create({
      data: {
        email,
        name,
        websiteUrl,
        audienceDesc,
        audienceSize,
        referralCode,
        userId: user?.id ?? null,
      },
    })

    return reply.status(201).send({ ok: true, message: 'Application submitted. We review within 24 hours.' })
  })

  // GET /api/affiliates/me — get affiliate status for current user (auth required)
  server.get('/me', { preHandler: requireAuth }, async (req, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { email: true },
    })
    if (!user) return reply.status(404).send({ error: 'User not found' })

    const affiliate = await prisma.affiliate.findFirst({
      where: { OR: [{ userId: req.user.userId }, { email: user.email }] },
      select: { status: true, referralCode: true },
    })

    if (!affiliate) return reply.send({ isAffiliate: false })

    return reply.send({
      isAffiliate: true,
      status: affiliate.status,
      referralCode: affiliate.status === 'approved' ? affiliate.referralCode : null,
      referralUrl: affiliate.status === 'approved'
        ? `${WEB_URL}/?ref=${affiliate.referralCode}`
        : null,
    })
  })

  // GET /api/affiliates/dashboard — full dashboard data (approved affiliates only)
  server.get('/dashboard', { preHandler: requireAuth }, async (req, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { email: true },
    })
    if (!user) return reply.status(404).send({ error: 'User not found' })

    const affiliate = await prisma.affiliate.findFirst({
      where: { OR: [{ userId: req.user.userId }, { email: user.email }] },
    })

    if (!affiliate) return reply.status(404).send({ error: 'No affiliate account found' })
    if (affiliate.status !== 'approved') {
      return reply.status(403).send({ error: 'Affiliate account not yet approved', status: affiliate.status })
    }

    // Counts
    const totalReferrals = await prisma.affiliateReferral.count({
      where: { affiliateId: affiliate.id },
    })

    // Active subscribers (referred users who are still Pro)
    const referredUserIds = await prisma.affiliateReferral.findMany({
      where: { affiliateId: affiliate.id },
      select: { userId: true },
    })
    const activeSubscribers = await prisma.user.count({
      where: { id: { in: referredUserIds.map((r) => r.userId) }, subscriptionTier: 'pro' },
    })

    // Commissions
    const commissions = await prisma.affiliateCommission.findMany({
      where: { affiliateId: affiliate.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    const pendingCents = commissions
      .filter((c) => c.status === 'pending')
      .reduce((sum, c) => sum + c.amountCents, 0)
    const paidCents = commissions
      .filter((c) => c.status === 'paid')
      .reduce((sum, c) => sum + c.amountCents, 0)

    return reply.send({
      referralCode: affiliate.referralCode,
      referralUrl: `${WEB_URL}/?ref=${affiliate.referralCode}`,
      stats: {
        totalClicks: affiliate.totalClicks,
        totalReferrals,
        activeSubscribers,
        pendingEarningsCents: pendingCents,
        paidEarningsCents: paidCents,
      },
      recentCommissions: commissions.map((c) => ({
        id: c.id,
        amountCents: c.amountCents,
        status: c.status,
        paidAt: c.paidAt,
        createdAt: c.createdAt,
      })),
    })
  })

  // POST /api/affiliates/track-click — increment click counter (public, idempotent)
  server.post('/track-click', async (req, reply) => {
    const parsed = z.object({ code: z.string().min(1) }).safeParse(req.body)
    if (!parsed.success) return reply.status(400).send({ error: 'Invalid request' })

    await prisma.affiliate.updateMany({
      where: { referralCode: parsed.data.code, status: 'approved' },
      data: { totalClicks: { increment: 1 } },
    })

    return reply.send({ ok: true })
  })

  // ─── Admin routes ────────────────────────────────────────────────────────────

  // GET /api/affiliates/admin/applications — list all applications
  server.get('/admin/applications', { preHandler: requireAuth }, async (req, reply) => {
    const adminUser = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { email: true },
    })
    const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim())
    if (!adminUser || !adminEmails.includes(adminUser.email)) {
      return reply.status(403).send({ error: 'Forbidden' })
    }

    const applications = await prisma.affiliate.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        websiteUrl: true,
        audienceDesc: true,
        audienceSize: true,
        status: true,
        referralCode: true,
        totalClicks: true,
        createdAt: true,
        _count: { select: { referrals: true, commissions: true } },
      },
    })

    return reply.send({ applications })
  })

  // POST /api/affiliates/admin/:id/approve — approve affiliate
  server.post('/admin/:id/approve', { preHandler: requireAuth }, async (req, reply) => {
    const adminUser = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { email: true },
    })
    const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim())
    if (!adminUser || !adminEmails.includes(adminUser.email)) {
      return reply.status(403).send({ error: 'Forbidden' })
    }

    const { id } = req.params as { id: string }
    const affiliate = await prisma.affiliate.update({
      where: { id },
      data: { status: 'approved' },
    })

    // Send approval email with referral link
    const referralUrl = `${WEB_URL}/?ref=${affiliate.referralCode}`
    const dashboardUrl = `${WEB_URL}/affiliates/dashboard`
    try {
      await resend.emails.send({
        from: FROM_ADDRESS,
        to: affiliate.email,
        subject: "You're approved — here's your Innermind affiliate link",
        html: `
          <p>Hi ${affiliate.name},</p>
          <p>You've been approved as an Innermind affiliate.</p>
          <p><strong>Your referral link:</strong> <a href="${referralUrl}">${referralUrl}</a></p>
          <p>Share this link in your newsletter, social posts, or with clients. You'll earn 20% recurring commission on every Pro subscription.</p>
          <p><a href="${dashboardUrl}">View your affiliate dashboard →</a></p>
          <p>Questions? Just reply to this email.</p>
          <p>— The Innermind team</p>
        `,
      })
    } catch (err) {
      server.log.error({ err }, '[affiliates] Failed to send approval email')
    }

    return reply.send({ ok: true, referralCode: affiliate.referralCode })
  })

  // POST /api/affiliates/admin/:id/reject — reject affiliate
  server.post('/admin/:id/reject', { preHandler: requireAuth }, async (req, reply) => {
    const adminUser = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { email: true },
    })
    const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim())
    if (!adminUser || !adminEmails.includes(adminUser.email)) {
      return reply.status(403).send({ error: 'Forbidden' })
    }

    const { id } = req.params as { id: string }
    await prisma.affiliate.update({ where: { id }, data: { status: 'rejected' } })

    return reply.send({ ok: true })
  })
}
