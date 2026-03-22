import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '@innermind/db'
import { requireAuth } from '../lib/auth.js'
import { sendReferralInviteEmail, sendReferralRewardNotificationEmail } from '../services/email.js'

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

  // Check yearly referral cap (12 rewarded referrals per year)
  const yearAgo = new Date()
  yearAgo.setFullYear(yearAgo.getFullYear() - 1)
  const rewardedThisYear = await prisma.referral.count({
    where: { referrerId: referrer.id, status: 'rewarded', completedAt: { gte: yearAgo } },
  })
  if (rewardedThisYear >= 12) return

  // Create the referral record
  await prisma.referral.create({
    data: {
      referrerId: referrer.id,
      referredUserId: userId,
      status: 'rewarded',
      rewardGranted: true,
      completedAt: new Date(),
    },
  })

  // Grant 1 month free Pro to the referrer
  const referrerUser = await prisma.user.findUnique({
    where: { id: referrer.id },
    select: { email: true, name: true, subscriptionTier: true, subscriptionExpiresAt: true },
  })
  if (referrerUser) {
    const base =
      referrerUser.subscriptionExpiresAt && referrerUser.subscriptionExpiresAt > new Date()
        ? referrerUser.subscriptionExpiresAt
        : new Date()
    const newExpiry = new Date(base)
    newExpiry.setDate(newExpiry.getDate() + 30)
    await prisma.user.update({
      where: { id: referrer.id },
      data: {
        subscriptionTier: 'pro',
        subscriptionExpiresAt: newExpiry,
      },
    })

    // Fetch referred user's name for the notification
    const referredUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    })

    // Fire-and-forget reward notification email
    sendReferralRewardNotificationEmail(referrerUser.email, referrerUser.name, referredUser?.name ?? null).catch(
      (err) => console.error('[referral] reward notification email error:', err),
    )
  }

  const message = `Referral reward: 1 month Pro granted to referrer ${referrer.id} (referred user ${userId} completed assessment)`
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

  // POST /api/referrals/invite — send referral invite email to a friend
  server.post('/invite', async (req, reply) => {
    const parsed = z.object({ email: z.string().email() }).safeParse(req.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid email address' })
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, referralCode: true },
    })
    if (!user) return reply.status(404).send({ error: 'User not found' })

    let referralCode = user.referralCode
    if (!referralCode) {
      referralCode = generateReferralCode(user.id)
      await prisma.user.update({ where: { id: user.id }, data: { referralCode } })
    }

    const webUrl = process.env.WEB_URL ?? 'http://localhost:3000'
    const referralUrl = `${webUrl}/auth/signup?ref=${encodeURIComponent(referralCode)}`

    await sendReferralInviteEmail(parsed.data.email, user.name, referralUrl)

    // Track pending referral (best-effort, ignore duplicates)
    await prisma.referral.create({
      data: { referrerId: user.id, referredEmail: parsed.data.email, status: 'pending' },
    }).catch(() => {})

    return reply.send({ ok: true })
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
