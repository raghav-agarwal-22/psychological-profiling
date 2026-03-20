import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import crypto from 'node:crypto'
import { prisma } from '@innermind/db'
import { requireAuth } from '../lib/auth.js'
import { sendMagicLink, sendWelcomeEmail } from '../services/email.js'

const requestMagicLinkSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
})

const verifyMagicLinkSchema = z.object({
  token: z.string().min(1),
  ref: z.string().max(100).optional(),
})

export async function authRoutes(server: FastifyInstance) {
  // POST /api/auth/magic-link — request a magic link
  server.post('/magic-link', async (req, reply) => {
    const body = requestMagicLinkSchema.safeParse(req.body)
    if (!body.success) {
      return reply.status(400).send({ error: 'Invalid request', issues: body.error.issues })
    }

    const { email, name } = body.data

    // Upsert user
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name },
    })

    // Generate token (secure random)
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    await prisma.magicLinkToken.create({
      data: { token, userId: user.id, expiresAt },
    })

    const isDev = process.env.NODE_ENV !== 'production'
    const magicLinkUrl = `${process.env.WEB_URL ?? 'http://localhost:3000'}/auth/verify?token=${token}`

    server.log.info({ email, token: isDev ? token : '[redacted]' }, 'Magic link generated')

    await sendMagicLink(email, magicLinkUrl)

    return reply.send({
      message: 'Magic link sent',
      ...(isDev ? { devToken: token, devMagicLinkUrl: magicLinkUrl } : {}),
    })
  })

  // POST /api/auth/verify — verify a magic link token
  server.post('/verify', async (req, reply) => {
    const body = verifyMagicLinkSchema.safeParse(req.body)
    if (!body.success) {
      return reply.status(400).send({ error: 'Invalid request' })
    }

    const { token, ref } = body.data

    const magicLink = await prisma.magicLinkToken.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!magicLink || magicLink.usedAt || magicLink.expiresAt < new Date()) {
      return reply.status(401).send({ error: 'Invalid or expired token' })
    }

    // Mark token as used
    await prisma.magicLinkToken.update({
      where: { id: magicLink.id },
      data: { usedAt: new Date() },
    })

    // Store referral code if provided and user hasn't been referred yet
    if (ref && !magicLink.user.referredByCode) {
      await prisma.user.update({
        where: { id: magicLink.user.id },
        data: { referredByCode: ref },
      })
    }

    // Send welcome email if this is the user's first login (no prior tokens used)
    const priorUsedTokens = await prisma.magicLinkToken.count({
      where: { userId: magicLink.user.id, usedAt: { not: null }, id: { not: magicLink.id } },
    })
    const alreadySentWelcome = await prisma.onboardingEmail.count({
      where: { userId: magicLink.user.id, emailType: 'welcome' },
    })
    if (priorUsedTokens === 0 && alreadySentWelcome === 0) {
      // Fire-and-forget welcome email
      sendWelcomeEmail(magicLink.user.email, magicLink.user.name).catch((err) =>
        server.log.error({ err }, '[email] Failed to send welcome email'),
      )
      await prisma.onboardingEmail.create({
        data: { userId: magicLink.user.id, emailType: 'welcome' },
      })
    }

    // Sign JWT
    const jwt = await reply.jwtSign({
      userId: magicLink.user.id,
      email: magicLink.user.email,
    })

    return reply.send({ token: jwt, user: { id: magicLink.user.id, email: magicLink.user.email, name: magicLink.user.name } })
  })

  // GET /api/auth/me — get current user
  server.get('/me', { preHandler: requireAuth }, async (req, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true, name: true, avatarUrl: true, timezone: true, createdAt: true },
    })

    if (!user) {
      return reply.status(404).send({ error: 'User not found' })
    }

    return reply.send({ user })
  })
}
