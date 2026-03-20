import type { FastifyInstance } from 'fastify'
import { prisma } from '@innermind/db'
import { requireAuth } from '../lib/auth.js'
import { randomUUID } from 'crypto'

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
        dimensions: true,
        archetypes: true,
        rawOutput: true,
        generatedAt: true,
        createdAt: true,
      },
    })
    return reply.send({ profiles })
  })

  // GET /api/profiles/history/by-type?type=BIG_FIVE — all profiles for a given framework, newest first
  server.get<{ Querystring: { type?: string } }>('/history/by-type', async (req, reply) => {
    const { type } = req.query as { type?: string }
    if (!type) {
      return reply.status(400).send({ error: 'Query param type is required' })
    }

    const profiles = await prisma.profile.findMany({
      where: {
        userId: req.user.userId,
        rawOutput: { path: ['templateType'], equals: type },
      },
      orderBy: { generatedAt: 'desc' },
      select: {
        id: true,
        version: true,
        isLatest: true,
        summary: true,
        dimensions: true,
        archetypes: true,
        generatedAt: true,
        rawOutput: true,
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

  // PATCH /api/profiles/:id/share — toggle public sharing for a profile
  server.patch<{ Params: { id: string }; Body: { isPublic?: boolean } }>(
    '/:id/share',
    async (req, reply) => {
      const existing = await prisma.profile.findFirst({
        where: { id: req.params.id, userId: req.user.userId },
      })
      if (!existing) {
        return reply.status(404).send({ error: 'Profile not found' })
      }

      const makePublic = req.body?.isPublic !== false
      const shareToken =
        makePublic ? (existing.shareToken ?? randomUUID()) : existing.shareToken

      const updated = await prisma.profile.update({
        where: { id: req.params.id },
        data: {
          isPublic: makePublic,
          shareToken: makePublic ? shareToken : existing.shareToken,
        },
        select: { id: true, isPublic: true, shareToken: true },
      })

      const webUrl = process.env.WEB_URL ?? 'http://localhost:3000'
      const shareUrl = updated.shareToken ? `${webUrl}/p/${updated.shareToken}` : null

      return reply.send({
        profile: {
          id: updated.id,
          isPublic: updated.isPublic,
          shareToken: updated.shareToken,
          shareUrl,
        },
      })
    },
  )
}
