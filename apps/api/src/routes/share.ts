import type { FastifyInstance } from 'fastify'
import { prisma } from '@innermind/db'

export async function shareRoutes(server: FastifyInstance) {
  // GET /api/share/:shareToken — public, no auth required
  server.get<{ Params: { shareToken: string } }>('/:shareToken', async (req, reply) => {
    const profile = await prisma.profile.findFirst({
      where: { shareToken: req.params.shareToken, isPublic: true },
    })
    if (!profile) {
      return reply.status(404).send({ error: 'Profile not found or not public' })
    }
    return reply.send({ profile })
  })
}
