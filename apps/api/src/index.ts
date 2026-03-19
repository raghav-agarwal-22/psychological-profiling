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

// ─── Routes ──────────────────────────────────────────────────────────────────

await server.register(healthRoutes, { prefix: '/api' })
await server.register(authRoutes, { prefix: '/api/auth' })
await server.register(sessionRoutes, { prefix: '/api/sessions' })
await server.register(assessmentRoutes, { prefix: '/api/assessments' })
await server.register(profileRoutes, { prefix: '/api/profiles' })
await server.register(insightRoutes, { prefix: '/api/insights' })

// ─── Start ───────────────────────────────────────────────────────────────────

try {
  await server.listen({ port: PORT, host: HOST })
  server.log.info(`Innermind API running at http://${HOST}:${PORT}`)
} catch (err) {
  server.log.error(err)
  process.exit(1)
}

export { server }
