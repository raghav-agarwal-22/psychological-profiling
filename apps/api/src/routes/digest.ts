import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '@innermind/db'
import { sendWeeklyDigest, type DigestEmailData, type GrowthRecommendation } from '../services/email.js'
import { processMonthlyInsights } from '../lib/monthly-insight.js'

const DIGEST_SECRET = process.env.DIGEST_SECRET ?? 'digest-dev-secret'

// ─── Helpers ─────────────────────────────────────────────────────────────────

interface GrowthRecommendationsPayload {
  recommendations: GrowthRecommendation[]
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).trimEnd() + '…'
}

function isOlderThan6Days(date: Date | null): boolean {
  if (!date) return true
  const sixDaysMs = 6 * 24 * 60 * 60 * 1000
  return Date.now() - date.getTime() > sixDaysMs
}

// ─── Route ───────────────────────────────────────────────────────────────────

export async function digestRoutes(server: FastifyInstance) {
  // POST /api/digest/send — trigger digest send (protected by DIGEST_SECRET)
  server.post('/send', async (req, reply) => {
    // Authenticate via Bearer token
    const authHeader = req.headers['authorization'] ?? ''
    if (authHeader !== `Bearer ${DIGEST_SECRET}`) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }

    const dashboardUrl = `${process.env.WEB_URL ?? 'http://localhost:3000'}/dashboard`
    const now = new Date()

    // Fetch all opted-in users who are due for a digest
    const users = await prisma.user.findMany({
      where: {
        emailDigestOptIn: true,
        email: { not: undefined },
      },
      select: {
        id: true,
        email: true,
        name: true,
        synthesis: true,
        growthRecommendations: true,
        lastDigestSentAt: true,
        assessments: {
          where: { status: 'COMPLETED' },
          orderBy: { completedAt: 'desc' },
          take: 1,
          select: { completedAt: true },
        },
      },
    })

    let sent = 0
    let skipped = 0
    const errors: string[] = []

    for (const user of users) {
      // Rate-limit: only send if never sent or last sent > 6 days ago
      if (!isOlderThan6Days(user.lastDigestSentAt)) {
        skipped++
        continue
      }

      // Build email data
      const topRecommendation: GrowthRecommendation | null = (() => {
        if (!user.growthRecommendations) return null
        const payload = user.growthRecommendations as unknown as GrowthRecommendationsPayload
        const recs = payload?.recommendations
        return Array.isArray(recs) && recs.length > 0 ? (recs[0] as GrowthRecommendation) : null
      })()

      const lastAssessment = user.assessments[0]
      const daysSinceLastAssessment: number | null = lastAssessment?.completedAt
        ? Math.floor((now.getTime() - lastAssessment.completedAt.getTime()) / 86400000)
        : null

      const synthesisSnippet: string | null = user.synthesis
        ? truncate(user.synthesis.trim(), 150)
        : null

      const emailData: DigestEmailData = {
        userName: user.name,
        topRecommendation,
        daysSinceLastAssessment,
        synthesisSnippet,
        dashboardUrl,
        date: now,
      }

      // Send email via React Email template
      if (process.env.SKIP_EMAIL === 'true') {
        server.log.info({ userId: user.id, email: user.email }, '[digest] SKIP_EMAIL=true — skipping send')
      } else {
        try {
          await sendWeeklyDigest(user.email, emailData)
        } catch (err) {
          server.log.error({ userId: user.id, err }, '[digest] Failed to send email via Resend')
          errors.push(user.id)
          continue
        }
      }

      // Update lastDigestSentAt
      await prisma.user.update({
        where: { id: user.id },
        data: { lastDigestSentAt: now },
      })

      sent++
    }

    return reply.send({
      ok: true,
      sent,
      skipped,
      errors: errors.length > 0 ? errors : undefined,
    })
  })

  // POST /api/digest/monthly — trigger monthly AI insight emails (protected by DIGEST_SECRET)
  // Railway cron: 0 9 1 * * (1st of each month, 9am UTC)
  server.post('/monthly', async (req, reply) => {
    const authHeader = req.headers['authorization'] ?? ''
    if (authHeader !== `Bearer ${DIGEST_SECRET}`) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }

    try {
      const result = await processMonthlyInsights()
      return reply.send({ ok: true, ...result })
    } catch (err) {
      server.log.error({ err }, '[digest/monthly] Failed to process monthly insights')
      return reply.status(500).send({ error: 'Internal error' })
    }
  })
}

// ─── Schema validation ────────────────────────────────────────────────────────

export const patchDigestPreferencesSchema = z.object({
  emailDigestOptIn: z.boolean(),
})
