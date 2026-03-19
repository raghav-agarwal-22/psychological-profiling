import type { FastifyInstance } from 'fastify'
import { prisma } from '@innermind/db'

export async function healthRoutes(server: FastifyInstance) {
  server.get('/health', async (_req, reply) => {
    let dbStatus: 'ok' | 'error' = 'ok'
    try {
      await prisma.$queryRaw`SELECT 1`
    } catch {
      dbStatus = 'error'
    }

    const status = dbStatus === 'ok' ? 200 : 503
    return reply.status(status).send({
      status: dbStatus === 'ok' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      version: '0.0.1',
      services: {
        database: dbStatus,
      },
    })
  })
}
