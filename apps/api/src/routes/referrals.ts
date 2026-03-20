import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '@innermind/db'
import { requireAuth } from '../lib/auth.js'

const applyReferralBodySchema = z.object({
  code: z.string().min(1).max(100),
})

function generateReferralCode(userId: string): string {
  return `user-${userId.slice(0, 8)}`
}

export async function applyReferral(userId: string, referralCode: string, log?: (msg: string) => void): Promise<void> {
  // Find the referrer by code
  const referrer = await prisma.user.findUnique({
    where: { referralCode: referralCode },
    select: { id: true },
  })

  if (!referrer || referrer.id === userId) return

  // Check if a referral record already exists for this referred user
  const existing = await prisma.referral.findFirst({
    where: { referredUserId: userId },
  })

  if (existing) {
    // Already applied — nothing to do
    return
  }

  // Create the referral record
  await prisma.referral.create({
    data: {
      referrerId: referrer.id,
      referredUserId: userId,
      status: 'completed',
      rewardGranted: true,
      completedAt: new Date(),
    },
  })

  const message = `1 month Pro credit granted to referrer ${referrer.id} and referred user ${userId}`
  if (log) {
    log(message)
  } else {
    console.log(message)
  }
}

export async function referralRoutes(server: FastifyInstance) {
  server.addHook('preHandler', requireAuth)

  // GET /api/referrals/my-link — get or create referral link for current user
  server.get('/my-link', async (req, reply) => {
    let user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, referralCode: true },
    })

    if (!user) {
      return reply.status(404).send({ error: 'User not found' })
    }

    // Generate and persist code if the user doesn't have one yet
    if (!user.referralCode) {
      const code = generateReferralCode(user.id)
      user = await prisma.user.update({
        where: { id: user.id },
        data: { referralCode: code },
        select: { id: true, referralCode: true },
      })
    }

    const code = user.referralCode!
    const webUrl = process.env.WEB_URL ?? 'http://localhost:3000'
    const referralUrl = `${webUrl}/auth/signup?ref=${encodeURIComponent(code)}`

    const referralsCount = await prisma.referral.count({
      where: { referrerId: user.id },
    })

    const pendingRewards = await prisma.referral.count({
      where: { referrerId: user.id, status: 'completed', rewardGranted: true },
    })

    return reply.send({
      code,
      referralUrl,
      referralsCount,
      pendingRewards,
    })
  })

  // POST /api/referrals/apply — apply a referral code for the current user
  server.post('/apply', async (req, reply) => {
    const parsed = applyReferralBodySchema.safeParse(req.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid request', issues: parsed.error.issues })
    }

    const { code } = parsed.data

    // Check if this user was already referred
    const alreadyReferred = await prisma.referral.findFirst({
      where: { referredUserId: req.user.userId },
    })
    if (alreadyReferred) {
      return reply.status(409).send({ error: 'Referral already applied for this account' })
    }

    await applyReferral(req.user.userId, code, (msg) => server.log.info(msg))

    return reply.send({ ok: true })
  })
}
