// Drip sequence routes:
//   POST /api/drip/process    — internal cron trigger (protected by CRON_SECRET)
//   POST /api/webhooks/resend — Resend webhook for email open/click tracking → PostHog

import type { FastifyInstance } from 'fastify'
import { processAllDripEmails, processAnnualConversionEmails } from '../lib/drip-sequence.js'

const CRON_SECRET = process.env.CRON_SECRET ?? ''
const POSTHOG_API_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? ''
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com'

async function capturePosthogEvent(
  distinctId: string,
  event: string,
  properties: Record<string, unknown>,
): Promise<void> {
  if (!POSTHOG_API_KEY) return
  try {
    await fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: POSTHOG_API_KEY, distinct_id: distinctId, event, properties }),
    })
  } catch {
    // non-critical
  }
}

export async function dripRoutes(server: FastifyInstance) {
  // POST /api/drip/process — cron trigger
  // Called by Railway Cron, an external scheduler, or admin.
  // Protected by Authorization: Bearer <CRON_SECRET>.
  server.post('/process', async (req, reply) => {
    if (!CRON_SECRET) {
      return reply.status(503).send({ error: 'Drip processing not configured (CRON_SECRET missing)' })
    }

    const authHeader = (req.headers.authorization as string | undefined) ?? ''
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }

    server.log.info('[drip] Processing drip sequence batch')

    const [onboardingResult, annualResult] = await Promise.all([
      processAllDripEmails(),
      processAnnualConversionEmails(),
    ])

    const result = {
      onboarding: onboardingResult,
      annualConversion: annualResult,
      processed: onboardingResult.processed + annualResult.processed,
      sent: onboardingResult.sent + annualResult.sent,
      errors: onboardingResult.errors + annualResult.errors,
    }

    server.log.info({ result }, '[drip] Batch complete')
    return reply.send({ ok: true, ...result })
  })
}

export async function resendWebhookRoutes(server: FastifyInstance) {
  // POST /api/webhooks/resend — Resend webhook
  // Resend sends email lifecycle events here (opened, clicked, bounced).
  // We forward email_opened and email_clicked to PostHog.
  server.post('/resend', async (req, reply) => {
    const body = req.body as Record<string, unknown>
    const type = body?.type as string | undefined
    const data = body?.data as Record<string, unknown> | undefined

    if (!type || !data) {
      return reply.status(400).send({ error: 'Invalid payload' })
    }

    // Tags are attached to outgoing emails as { name, value } pairs.
    // We expect { userId: "...", emailDay: "1" } tags.
    const tags = (data.tags as Record<string, string> | undefined) ?? {}
    const userId = tags['userId'] ?? (data.userId as string | undefined)
    const emailDay = tags['emailDay'] ?? (data.emailDay as string | undefined)

    if (type === 'email.opened' && userId) {
      await capturePosthogEvent(userId, 'email_opened', {
        email_id: data.email_id,
        subject: data.subject,
        email_day: emailDay ? Number(emailDay) : null,
      })
    }

    if (type === 'email.clicked' && userId) {
      const clickData = data as Record<string, unknown>
      await capturePosthogEvent(userId, 'email_clicked', {
        email_id: data.email_id,
        subject: data.subject,
        email_day: emailDay ? Number(emailDay) : null,
        cta_url: (clickData.click as Record<string, unknown> | undefined)?.url ?? clickData.link,
      })
    }

    if (type === 'email.bounced' && userId) {
      server.log.warn({ userId, email_id: data.email_id }, '[email] Bounce detected')
      // Future: flag user for suppression in DB
    }

    return reply.status(200).send({ ok: true })
  })
}
