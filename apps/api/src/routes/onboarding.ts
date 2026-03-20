import type { FastifyInstance } from 'fastify'
import { prisma } from '@innermind/db'
import {
  sendAssessmentNudgeEmail,
  sendDeepDiveNudgeEmail,
  sendProUpgradeEmail,
  sendProfileRevealEmail,
} from '../services/email.js'

const ONBOARDING_SECRET = process.env.ONBOARDING_SECRET ?? process.env.DIGEST_SECRET ?? 'onboarding-dev-secret'

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000)
}

// ─── Route ───────────────────────────────────────────────────────────────────

export async function onboardingRoutes(server: FastifyInstance) {
  // POST /api/onboarding/run — trigger onboarding email sequence (protected, cron-callable)
  server.post('/run', async (req, reply) => {
    const auth = req.headers.authorization
    if (!auth || auth !== `Bearer ${ONBOARDING_SECRET}`) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }

    const now = new Date()
    const results = {
      assessment_nudge: 0,
      deep_dive: 0,
      pro_upgrade: 0,
    }

    // ── Day 2: assessment nudge — user hasn't started any assessment ────────
    const nudgeCandidates = await prisma.user.findMany({
      where: {
        createdAt: { lte: daysAgo(2) },
        assessments: { none: {} },
        onboardingEmails: { none: { emailType: 'assessment_nudge' } },
        emailDigestOptIn: true,
      },
      select: { id: true, email: true, name: true },
      take: 100,
    })

    for (const user of nudgeCandidates) {
      try {
        await sendAssessmentNudgeEmail(user.email, user.name)
        await prisma.onboardingEmail.create({
          data: { userId: user.id, emailType: 'assessment_nudge' },
        })
        results.assessment_nudge++
      } catch (err) {
        server.log.error({ err, userId: user.id }, '[onboarding] assessment_nudge failed')
      }
    }

    // ── Day 7: deep dive nudge — user has at least one profile ────────────
    const deepDiveCandidates = await prisma.user.findMany({
      where: {
        createdAt: { lte: daysAgo(7) },
        profiles: { some: {} },
        onboardingEmails: { none: { emailType: 'deep_dive' } },
        emailDigestOptIn: true,
      },
      select: { id: true, email: true, name: true },
      take: 100,
    })

    for (const user of deepDiveCandidates) {
      try {
        await sendDeepDiveNudgeEmail(user.email, user.name)
        await prisma.onboardingEmail.create({
          data: { userId: user.id, emailType: 'deep_dive' },
        })
        results.deep_dive++
      } catch (err) {
        server.log.error({ err, userId: user.id }, '[onboarding] deep_dive failed')
      }
    }

    // ── Day 14: pro upgrade — free-tier users who've been around 14+ days ──
    const upgradeCandidates = await prisma.user.findMany({
      where: {
        createdAt: { lte: daysAgo(14) },
        subscriptionTier: 'free',
        onboardingEmails: { none: { emailType: 'pro_upgrade' } },
        emailDigestOptIn: true,
      },
      select: { id: true, email: true, name: true },
      take: 100,
    })

    for (const user of upgradeCandidates) {
      try {
        await sendProUpgradeEmail(user.email, user.name)
        await prisma.onboardingEmail.create({
          data: { userId: user.id, emailType: 'pro_upgrade' },
        })
        results.pro_upgrade++
      } catch (err) {
        server.log.error({ err, userId: user.id }, '[onboarding] pro_upgrade failed')
      }
    }

    server.log.info({ results }, '[onboarding] sequence run complete')

    return reply.send({ ok: true, sent: results, timestamp: now.toISOString() })
  })

  // POST /api/onboarding/profile-reveal — called after a profile is generated
  server.post('/profile-reveal', async (req, reply) => {
    const auth = req.headers.authorization
    if (!auth || auth !== `Bearer ${ONBOARDING_SECRET}`) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }

    const body = req.body as { userId?: string; profileId?: string; framework?: string }
    if (!body?.userId || !body?.profileId || !body?.framework) {
      return reply.status(400).send({ error: 'userId, profileId, and framework are required' })
    }

    const { userId, profileId, framework } = body

    // Only send once
    const already = await prisma.onboardingEmail.findUnique({
      where: { userId_emailType: { userId, emailType: 'profile_reveal' } },
    })
    if (already) {
      return reply.send({ ok: true, skipped: true, reason: 'already_sent' })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true, emailDigestOptIn: true },
    })
    if (!user || !user.emailDigestOptIn) {
      return reply.send({ ok: true, skipped: true, reason: 'user_not_found_or_opted_out' })
    }

    await sendProfileRevealEmail(user.email, user.name, profileId, framework)
    await prisma.onboardingEmail.create({
      data: { userId, emailType: 'profile_reveal' },
    })

    return reply.send({ ok: true, sent: true })
  })
}
