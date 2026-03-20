import type { FastifyInstance } from 'fastify'
import { prisma } from '@innermind/db'
import { requireAuth } from '../lib/auth.js'
import { createHmac, timingSafeEqual } from 'crypto'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

interface DimensionScore {
  normalized: number
}

function computeOverlapScores(
  dimsA: Record<string, DimensionScore>,
  dimsB: Record<string, DimensionScore>,
): Record<string, { scoreA: number; scoreB: number; overlap: number }> {
  const result: Record<string, { scoreA: number; scoreB: number; overlap: number }> = {}
  const sharedKeys = Object.keys(dimsA).filter((k) => k in dimsB)
  for (const key of sharedKeys) {
    const scoreA = dimsA[key]?.normalized ?? 0
    const scoreB = dimsB[key]?.normalized ?? 0
    result[key] = {
      scoreA,
      scoreB,
      overlap: Math.round(100 - Math.abs(scoreA - scoreB)),
    }
  }
  return result
}

function overallCompatibility(overlapScores: Record<string, { overlap: number }>): number {
  const values = Object.values(overlapScores)
  if (values.length === 0) return 0
  return Math.round(values.reduce((sum, v) => sum + v.overlap, 0) / values.length)
}

const INVITE_SECRET =
  process.env.JWT_SECRET ?? 'dev-secret-change-in-production'

interface InviteTokenPayload {
  teamId: string
  email: string
  exp: number
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

function b64url(s: string): string {
  return Buffer.from(s).toString('base64url')
}

function fromB64url(s: string): string {
  return Buffer.from(s, 'base64url').toString('utf8')
}

function signInviteToken(payload: InviteTokenPayload): string {
  const data = b64url(JSON.stringify(payload))
  const sig = createHmac('sha256', INVITE_SECRET).update(data).digest('base64url')
  return `${data}.${sig}`
}

function verifyInviteToken(token: string): InviteTokenPayload {
  const dotIndex = token.lastIndexOf('.')
  if (dotIndex === -1) throw new Error('Invalid token format')
  const data = token.slice(0, dotIndex)
  const sig = token.slice(dotIndex + 1)

  const expectedSig = createHmac('sha256', INVITE_SECRET).update(data).digest('base64url')
  const sigBuf = Buffer.from(sig, 'base64url')
  const expBuf = Buffer.from(expectedSig, 'base64url')

  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    throw new Error('Invalid token signature')
  }

  const payload = JSON.parse(fromB64url(data)) as InviteTokenPayload
  if (payload.exp < Date.now()) {
    throw new Error('Token expired')
  }
  return payload
}

// ─── Route plugin ─────────────────────────────────────────────────────────────

export async function teamRoutes(server: FastifyInstance) {
  // ── POST /api/teams — create a team ─────────────────────────────────────────
  server.post<{ Body: { name: string } }>('/', { preHandler: requireAuth }, async (req, reply) => {
    const { name } = req.body ?? {}
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return reply.status(400).send({ error: 'Team name is required' })
    }

    const baseSlug = slugify(name)
    if (!baseSlug) {
      return reply.status(400).send({ error: 'Team name must contain at least one letter or digit' })
    }

    // Ensure slug uniqueness by appending a suffix if needed
    let slug = baseSlug
    let attempt = 0
    while (await prisma.team.findUnique({ where: { slug } })) {
      attempt++
      slug = `${baseSlug}-${attempt}`
    }

    const team = await prisma.team.create({
      data: {
        name: name.trim(),
        slug,
        ownerId: req.user.userId,
        members: {
          create: {
            userId: req.user.userId,
            role: 'owner',
          },
        },
      },
      include: {
        members: true,
      },
    })

    return reply.status(201).send({ team })
  })

  // ── GET /api/teams/my — teams the current user belongs to ───────────────────
  server.get('/my', { preHandler: requireAuth }, async (req, reply) => {
    const memberships = await prisma.teamMember.findMany({
      where: { userId: req.user.userId },
      include: {
        team: {
          include: {
            _count: { select: { members: true } },
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    })

    const teams = memberships.map((m) => ({
      ...m.team,
      memberCount: m.team._count.members,
      role: m.role,
    }))

    return reply.send({ teams })
  })

  // ── GET /api/teams/:teamId — team details with members + public profiles ────
  server.get<{ Params: { teamId: string } }>(
    '/:teamId',
    { preHandler: requireAuth },
    async (req, reply) => {
      // Verify requester is a member
      const membership = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: { teamId: req.params.teamId, userId: req.user.userId },
        },
      })
      if (!membership) {
        return reply.status(403).send({ error: 'You are not a member of this team' })
      }

      const team = await prisma.team.findUnique({
        where: { id: req.params.teamId },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatarUrl: true,
                },
              },
            },
            orderBy: { joinedAt: 'asc' },
          },
        },
      })

      if (!team) {
        return reply.status(404).send({ error: 'Team not found' })
      }

      // Attach most recent public profile for each member
      const memberProfiles = await Promise.all(
        team.members.map(async (m) => {
          const profile = await prisma.profile.findFirst({
            where: { userId: m.userId, isPublic: true, isLatest: true },
            select: {
              id: true,
              summary: true,
              dimensions: true,
              archetypes: true,
              shareToken: true,
              generatedAt: true,
            },
            orderBy: { generatedAt: 'desc' },
          })
          return {
            ...m,
            publicProfile: profile ?? null,
          }
        }),
      )

      return reply.send({ team: { ...team, members: memberProfiles } })
    },
  )

  // ── POST /api/teams/:teamId/invite — invite by email ───────────────────────
  server.post<{ Params: { teamId: string }; Body: { email: string } }>(
    '/:teamId/invite',
    { preHandler: requireAuth },
    async (req, reply) => {
      const { email } = req.body ?? {}
      if (!email || typeof email !== 'string') {
        return reply.status(400).send({ error: 'Email is required' })
      }

      // Only team owners or admins can invite
      const membership = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: { teamId: req.params.teamId, userId: req.user.userId },
        },
      })
      if (!membership || !['owner', 'admin'].includes(membership.role)) {
        return reply.status(403).send({ error: 'Only team owners and admins can invite members' })
      }

      const team = await prisma.team.findUnique({ where: { id: req.params.teamId } })
      if (!team) {
        return reply.status(404).send({ error: 'Team not found' })
      }

      // Check if already a member
      const targetUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      })
      if (targetUser) {
        const existing = await prisma.teamMember.findUnique({
          where: { teamId_userId: { teamId: req.params.teamId, userId: targetUser.id } },
        })
        if (existing) {
          return reply.status(409).send({ error: 'User is already a member of this team' })
        }
      }

      // Create a signed invite token (7-day expiry)
      const inviteToken = signInviteToken({
        teamId: req.params.teamId,
        email: email.toLowerCase().trim(),
        exp: Date.now() + SEVEN_DAYS_MS,
      })

      const baseUrl = process.env.WEB_URL ?? 'http://localhost:3000'
      const inviteLink = `${baseUrl}/teams/join/${inviteToken}`

      if (process.env.NODE_ENV !== 'production') {
        // In dev: return the link directly
        return reply.send({
          message: 'Invite link generated (dev mode — no email sent)',
          inviteLink,
        })
      }

      // In prod: send email via Resend
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: 'Innermind <noreply@innermind.app>',
          to: email.toLowerCase().trim(),
          subject: `You've been invited to join "${team.name}" on Innermind`,
          html: `
            <p>You've been invited to join the team <strong>${team.name}</strong> on Innermind.</p>
            <p><a href="${inviteLink}">Accept invitation</a></p>
            <p>This link expires in 7 days.</p>
          `,
        })
        return reply.send({ message: 'Invite email sent' })
      } catch (err) {
        server.log.error(err, 'Failed to send invite email')
        return reply.send({
          message: 'Invite created but email delivery failed',
          inviteLink,
        })
      }
    },
  )

  // ── POST /api/teams/join/:inviteToken — accept invite ──────────────────────
  server.post<{ Params: { inviteToken: string } }>(
    '/join/:inviteToken',
    { preHandler: requireAuth },
    async (req, reply) => {
      let payload: InviteTokenPayload
      try {
        payload = verifyInviteToken(req.params.inviteToken)
      } catch {
        return reply.status(400).send({ error: 'Invalid or expired invite token' })
      }

      const { teamId, email } = payload

      // Verify the token email matches the authenticated user's email
      const user = await prisma.user.findUnique({ where: { id: req.user.userId } })
      if (!user) {
        return reply.status(401).send({ error: 'User not found' })
      }
      if (user.email.toLowerCase() !== email.toLowerCase()) {
        return reply
          .status(403)
          .send({ error: 'This invite was sent to a different email address' })
      }

      const team = await prisma.team.findUnique({ where: { id: teamId } })
      if (!team) {
        return reply.status(404).send({ error: 'Team not found' })
      }

      // Check if already a member
      const existing = await prisma.teamMember.findUnique({
        where: { teamId_userId: { teamId, userId: req.user.userId } },
      })
      if (existing) {
        return reply.status(200).send({ message: 'You are already a member of this team', team })
      }

      await prisma.teamMember.create({
        data: {
          teamId,
          userId: req.user.userId,
          role: 'member',
        },
      })

      return reply.status(201).send({ message: 'Successfully joined the team', team })
    },
  )

  // ── GET /api/teams/:teamId/compatibility — pairwise compatibility matrix ────
  server.get<{ Params: { teamId: string } }>(
    '/:teamId/compatibility',
    { preHandler: requireAuth },
    async (req, reply) => {
      // Verify membership
      const membership = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: { teamId: req.params.teamId, userId: req.user.userId },
        },
      })
      if (!membership) {
        return reply.status(403).send({ error: 'You are not a member of this team' })
      }

      const team = await prisma.team.findUnique({
        where: { id: req.params.teamId },
        include: {
          members: {
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
      })
      if (!team) {
        return reply.status(404).send({ error: 'Team not found' })
      }

      // Fetch the most recent public profile for each member
      const memberProfiles = await Promise.all(
        team.members.map(async (m) => {
          const profile = await prisma.profile.findFirst({
            where: { userId: m.userId, isPublic: true },
            select: { id: true, dimensions: true },
            orderBy: { generatedAt: 'desc' },
          })
          return {
            userId: m.userId,
            name: m.user.name ?? m.user.email,
            profileId: profile?.id ?? null,
            dimensions: profile
              ? (profile.dimensions as unknown as Record<string, DimensionScore>)
              : null,
          }
        }),
      )

      // Only include members who have a public profile
      const eligible = memberProfiles.filter((m) => m.dimensions !== null)

      // Build pairwise matrix
      const matrix: Record<
        string,
        { score: number; dimensions: Record<string, { scoreA: number; scoreB: number; overlap: number }> }
      > = {}

      for (let i = 0; i < eligible.length; i++) {
        for (let j = i + 1; j < eligible.length; j++) {
          const a = eligible[i]!
          const b = eligible[j]!
          const overlapScores = computeOverlapScores(
            a.dimensions!,
            b.dimensions!,
          )
          const score = overallCompatibility(overlapScores)
          const key = `${a.userId}:${b.userId}`
          matrix[key] = { score, dimensions: overlapScores }
        }
      }

      return reply.send({
        members: eligible.map((m) => ({
          userId: m.userId,
          name: m.name,
          profileId: m.profileId,
        })),
        matrix,
      })
    },
  )

  // ── DELETE /api/teams/:teamId/leave — leave a team ─────────────────────────
  server.delete<{ Params: { teamId: string } }>(
    '/:teamId/leave',
    { preHandler: requireAuth },
    async (req, reply) => {
      const membership = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: { teamId: req.params.teamId, userId: req.user.userId },
        },
      })
      if (!membership) {
        return reply.status(404).send({ error: 'You are not a member of this team' })
      }
      if (membership.role === 'owner') {
        return reply
          .status(400)
          .send({ error: 'Team owners cannot leave. Transfer ownership or delete the team first.' })
      }

      await prisma.teamMember.delete({
        where: { teamId_userId: { teamId: req.params.teamId, userId: req.user.userId } },
      })

      return reply.send({ message: 'You have left the team' })
    },
  )
}
