import type { FastifyInstance } from 'fastify'
import { prisma } from '@innermind/db'
import { requireAuth } from '../lib/auth.js'

export async function profileRoutes(server: FastifyInstance) {
  server.addHook('preHandler', requireAuth)

  // GET /api/profiles — get the user's latest profile
  server.get('/', async (req, reply) => {
    const profile = await prisma.profile.findFirst({
      where: { userId: req.user.userId, isLatest: true },
    })
    if (!profile) {
      return reply.status(404).send({ error: 'No profile found. Complete an assessment first.' })
    }
    return reply.send({ profile })
  })

  // GET /api/profiles/history — get all profile versions
  server.get('/history', async (req, reply) => {
    const profiles = await prisma.profile.findMany({
      where: { userId: req.user.userId },
      orderBy: { version: 'desc' },
      select: {
        id: true,
        version: true,
        isLatest: true,
        summary: true,
        generatedAt: true,
        createdAt: true,
      },
    })
    return reply.send({ profiles })
  })

  // GET /api/profiles/:id — get a specific profile version
  server.get<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const profile = await prisma.profile.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
    })
    if (!profile) {
      return reply.status(404).send({ error: 'Profile not found' })
    }
    return reply.send({ profile })
  })
}
