import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '@innermind/db'
import { requireAuth } from '../lib/auth.js'

const createEntrySchema = z.object({
  title: z.string().max(255).optional(),
  body: z.string().min(1, 'Body is required'),
  linkedProfileId: z.string().optional(),
})

export async function journalRoutes(server: FastifyInstance) {
  server.addHook('preHandler', requireAuth)

  // GET /api/journal — list user's journal entries (newest first, limit 20)
  server.get('/', async (req, reply) => {
    const entries = await prisma.journalEntry.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        title: true,
        body: true,
        profileId: true,
        prompt: true,
        tags: true,
        mood: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return reply.send({ entries })
  })

  // POST /api/journal — create new entry
  server.post('/', async (req, reply) => {
    const parsed = createEntrySchema.safeParse(req.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid request', issues: parsed.error.issues })
    }

    const { title, body, linkedProfileId } = parsed.data

    // Validate that the profile belongs to the user if provided
    if (linkedProfileId) {
      const profile = await prisma.profile.findFirst({
        where: { id: linkedProfileId, userId: req.user.userId },
        select: { id: true },
      })
      if (!profile) {
        return reply.status(404).send({ error: 'Profile not found' })
      }
    }

    const entry = await prisma.journalEntry.create({
      data: {
        userId: req.user.userId,
        title: title ?? null,
        body,
        profileId: linkedProfileId ?? null,
      },
      select: {
        id: true,
        title: true,
        body: true,
        profileId: true,
        prompt: true,
        tags: true,
        mood: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return reply.status(201).send({ entry })
  })

  // DELETE /api/journal/:id — delete entry
  server.delete<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const entry = await prisma.journalEntry.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
    })
    if (!entry) {
      return reply.status(404).send({ error: 'Journal entry not found' })
    }

    await prisma.journalEntry.delete({ where: { id: entry.id } })
    return reply.status(204).send()
  })
}
