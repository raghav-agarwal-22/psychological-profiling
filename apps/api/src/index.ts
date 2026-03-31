import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'

import { healthRoutes } from './routes/health.js'
import { authRoutes } from './routes/auth.js'
import { sessionRoutes } from './routes/sessions.js'
import { assessmentRoutes } from './routes/assessments.js'
import { profileRoutes } from './routes/profiles.js'
import { insightRoutes } from './routes/insights.js'
import { templateRoutes } from './routes/templates.js'
import { userRoutes } from './routes/users.js'
import { shareRoutes } from './routes/share.js'
import { compareRoutes } from './routes/compare.js'
import { coachRoutes } from './routes/coach.js'
import { digestRoutes } from './routes/digest.js'
import { adminRoutes } from './routes/admin.js'
import { billingRoutes } from './routes/billing.js'
import { teamRoutes } from './routes/teams.js'
import { referralRoutes } from './routes/referrals.js'
import { journalRoutes } from './routes/journal.js'
import { adaptiveRoutes } from './routes/adaptive.js'
import { onboardingRoutes } from './routes/onboarding.js'
import { affiliateRoutes } from './routes/affiliates.js'
import { anonymousRoutes } from './routes/anonymous.js'
import { dripRoutes, resendWebhookRoutes } from './routes/drip.js'
import { notifyRoutes } from './routes/notify.js'
import { professionalRoutes } from './routes/professional.js'
import { testimonialRoutes } from './routes/testimonials.js'
import { newsletterRoutes } from './routes/newsletter.js'

const PORT = Number(process.env.API_PORT ?? 3001)
const HOST = process.env.API_HOST ?? '0.0.0.0'
const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-in-production'

const server = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport:
      process.env.NODE_ENV !== 'production'
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined,
  },
})

// ─── Plugins ─────────────────────────────────────────────────────────────────

await server.register(cors, {
  origin:
    process.env.NODE_ENV === 'production'
      ? [process.env.WEB_URL ?? 'https://innermindhealing.com']
      : true,
  credentials: true,
})

await server.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
})

await server.register(jwt, {
  secret: JWT_SECRET,
  sign: { expiresIn: '7d' },
})

// ─── Raw body parser (needed for Stripe webhook signature verification) ───────

server.addContentTypeParser('application/json', { parseAs: 'buffer' }, function (req, body, done) {
  try {
    const str = (body as Buffer).toString()
    const json = str.length > 0 ? JSON.parse(str) : {}
    ;(req as unknown as { rawBody: Buffer }).rawBody = body as Buffer
    done(null, json)
  } catch (err) {
    done(err as Error, undefined)
  }
})

// ─── Routes ──────────────────────────────────────────────────────────────────

await server.register(healthRoutes, { prefix: '/api' })
await server.register(authRoutes, { prefix: '/api/auth' })
await server.register(sessionRoutes, { prefix: '/api/sessions' })
await server.register(assessmentRoutes, { prefix: '/api/assessments' })
await server.register(profileRoutes, { prefix: '/api/profiles' })
await server.register(insightRoutes, { prefix: '/api/insights' })
await server.register(templateRoutes, { prefix: '/api/templates' })
await server.register(userRoutes, { prefix: '/api/users' })
await server.register(shareRoutes, { prefix: '/api/share' })
await server.register(compareRoutes, { prefix: '/api/compare' })
await server.register(coachRoutes, { prefix: '/api/coach' })
await server.register(digestRoutes, { prefix: '/api/digest' })
await server.register(onboardingRoutes, { prefix: '/api/onboarding' })
await server.register(adminRoutes, { prefix: '/api/admin' })
await server.register(billingRoutes, { prefix: '/api/billing' })
await server.register(teamRoutes, { prefix: '/api/teams' })
await server.register(referralRoutes, { prefix: '/api/referrals' })
await server.register(journalRoutes, { prefix: '/api/journal' })
await server.register(adaptiveRoutes, { prefix: '/api/adaptive' })
await server.register(affiliateRoutes, { prefix: '/api/affiliates' })
await server.register(anonymousRoutes, { prefix: '/api/anon' })
await server.register(dripRoutes, { prefix: '/api/drip' })
await server.register(resendWebhookRoutes, { prefix: '/api/webhooks' })
await server.register(notifyRoutes, { prefix: '/api/users' })
await server.register(professionalRoutes, { prefix: '/api/professional' })
await server.register(testimonialRoutes, { prefix: '/api/testimonials' })
await server.register(newsletterRoutes, { prefix: '/api/newsletter' })

// ─── Start ───────────────────────────────────────────────────────────────────

try {
  await server.listen({ port: PORT, host: HOST })
  server.log.info(`Innermind API running at http://${HOST}:${PORT}`)
  if (!process.env.ANTHROPIC_API_KEY) {
    server.log.warn('ANTHROPIC_API_KEY is not set — AI profile synthesis is disabled. Users will receive template-based profiles until the key is provided.')
  }
} catch (err) {
  server.log.error(err)
  process.exit(1)
}

export { server }
