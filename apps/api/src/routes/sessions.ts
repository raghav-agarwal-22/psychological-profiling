import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma, SessionStatus } from '@innermind/db'
import { requireAuth } from '../lib/auth.js'

const createSessionSchema = z.object({
  title: z.string().max(200).optional(),
})

export async function sessionRoutes(server: FastifyInstance) {
  server.addHook('preHandler', requireAuth)

  // GET /api/sessions — list sessions for the current user
  server.get('/', async (req, reply) => {
    const sessions = await prisma.session.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        status: true,
        startedAt: true,
        completedAt: true,
        createdAt: true,
        _count: { select: { assessments: true } },
      },
    })
    return reply.send({ sessions })
  })

  // POST /api/sessions — create a new session
  server.post('/', async (req, reply) => {
    const body = createSessionSchema.safeParse(req.body)
    if (!body.success) {
      return reply.status(400).send({ error: 'Invalid request', issues: body.error.issues })
    }

    const session = await prisma.session.create({
      data: {
        userId: req.user.userId,
        title: body.data.title,
        status: SessionStatus.IN_PROGRESS,
      },
    })

    return reply.status(201).send({ session })
  })

  // GET /api/sessions/:id — get a specific session with its assessments
  server.get<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const session = await prisma.session.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
      include: {
        assessments: {
          select: {
            id: true,
            type: true,
            title: true,
            status: true,
            currentStep: true,
            totalSteps: true,
            startedAt: true,
            completedAt: true,
          },
        },
      },
    })
    if (!session) {
      return reply.status(404).send({ error: 'Session not found' })
    }
    return reply.send({ session })
  })

  // POST /api/sessions/:id/complete — mark a session as complete
  server.post<{ Params: { id: string } }>('/:id/complete', async (req, reply) => {
    const session = await prisma.session.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
    })
    if (!session) {
      return reply.status(404).send({ error: 'Session not found' })
    }

    const updated = await prisma.session.update({
      where: { id: session.id },
      data: {
        status: SessionStatus.COMPLETED,
        completedAt: new Date(),
      },
    })

    return reply.send({ session: updated })
  })
}
