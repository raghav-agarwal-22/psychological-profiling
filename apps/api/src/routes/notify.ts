import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '@innermind/db'

const subscribeSchema = z.object({
  email: z.string().email(),
  source: z.string().max(50).optional(),
})

export async function notifyRoutes(server: FastifyInstance) {
  // GET /api/users/notify-list/count — public, returns subscriber count for social proof
  server.get('/notify-list/count', async (_req, reply) => {
    const count = await prisma.notifyList.count()
    return reply.send({ count })
  })

  // POST /api/users/notify-list — public, no auth required
  server.post('/notify-list', {
    config: { rateLimit: { max: 5, timeWindow: '1 minute' } },
  }, async (req, reply) => {
    const body = subscribeSchema.safeParse(req.body)
    if (!body.success) {
      return reply.status(400).send({ error: 'Invalid email' })
    }

    const { email, source = 'prelaunch_notify' } = body.data

    await prisma.notifyList.upsert({
      where: { email },
      update: {},
      create: { email, source },
    })

    const count = await prisma.notifyList.count()
    return reply.send({ success: true, count })
  })
}
