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
      ? [process.env.WEB_URL ?? 'https://innermind.app']
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
await server.register(adminRoutes, { prefix: '/api/admin' })
await server.register(billingRoutes, { prefix: '/api/billing' })
await server.register(teamRoutes, { prefix: '/api/teams' })
await server.register(referralRoutes, { prefix: '/api/referrals' })

// ─── Start ───────────────────────────────────────────────────────────────────

try {
  await server.listen({ port: PORT, host: HOST })
  server.log.info(`Innermind API running at http://${HOST}:${PORT}`)
} catch (err) {
  server.log.error(err)
  process.exit(1)
}

export { server }
