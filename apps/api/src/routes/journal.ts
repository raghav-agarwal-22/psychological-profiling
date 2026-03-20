import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '@innermind/db'
import { requireAuth } from '../lib/auth.js'
import { sendMilestoneJournalEmail } from '../services/email.js'

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

    // Fire milestone email after 3rd journal entry (fire-and-forget)
    prisma.journalEntry.count({ where: { userId: req.user.userId } }).then(async (count) => {
      if (count !== 3) return
      const alreadySent = await prisma.onboardingEmail.findUnique({
        where: { userId_emailType: { userId: req.user.userId, emailType: 'milestone_journal_3' } },
      })
      if (alreadySent) return
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: {
          email: true,
          name: true,
          profiles: {
            where: { isLatest: true },
            take: 1,
            select: { archetypes: true },
          },
        },
      })
      if (!user) return
      const archetypeName = (user.profiles[0]?.archetypes as Array<{ name: string }> | null)?.[0]?.name ?? 'your archetype'
      await prisma.onboardingEmail.create({
        data: { userId: req.user.userId, emailType: 'milestone_journal_3' },
      })
      await sendMilestoneJournalEmail(user.email, user.name, archetypeName)
    }).catch((err) => console.error('[milestone] journal_3 error:', err))

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
