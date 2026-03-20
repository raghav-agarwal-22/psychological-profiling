import type { FastifyInstance } from 'fastify'
import { prisma } from '@innermind/db'

// Cache DB health check result for 30s to reduce probe pressure
let cachedDbStatus: 'ok' | 'error' = 'ok'
let cacheExpiry = 0

export async function healthRoutes(server: FastifyInstance) {
  // Exempt from global rate limit — Railway probes this every few seconds
  server.get('/health', { config: { rateLimit: false } }, async (_req, reply) => {
    const now = Date.now()
    if (now > cacheExpiry) {
      try {
        await prisma.$queryRaw`SELECT 1`
        cachedDbStatus = 'ok'
      } catch {
        cachedDbStatus = 'error'
      }
      cacheExpiry = now + 30_000
    }

    const status = cachedDbStatus === 'ok' ? 200 : 503
    return reply.status(status).send({
      status: cachedDbStatus === 'ok' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      version: '0.0.1',
      services: {
        database: cachedDbStatus,
      },
    })
  })
}
