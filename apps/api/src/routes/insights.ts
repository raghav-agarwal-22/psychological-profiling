import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma, LifeDomain, InsightType } from '@innermind/db'
import { requireAuth } from '../lib/auth.js'

const listInsightsSchema = z.object({
  domain: z.nativeEnum(LifeDomain).optional(),
  type: z.nativeEnum(InsightType).optional(),
  saved: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
})

const updateInsightSchema = z.object({
  isRead: z.boolean().optional(),
  isSaved: z.boolean().optional(),
  reactions: z.record(z.unknown()).optional(),
})

export async function insightRoutes(server: FastifyInstance) {
  server.addHook('preHandler', requireAuth)

  // GET /api/insights — list insights for the current user
  server.get('/', async (req, reply) => {
    const query = listInsightsSchema.safeParse(req.query)
    if (!query.success) {
      return reply.status(400).send({ error: 'Invalid query', issues: query.error.issues })
    }

    const { domain, type, saved, limit, cursor } = query.data

    const insights = await prisma.insight.findMany({
      where: {
        userId: req.user.userId,
        ...(domain ? { domain } : {}),
        ...(type ? { type } : {}),
        ...(saved !== undefined ? { isSaved: saved } : {}),
        ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      select: {
        id: true,
        type: true,
        title: true,
        body: true,
        symbol: true,
        domain: true,
        isRead: true,
        isSaved: true,
        createdAt: true,
      },
    })

    const hasMore = insights.length > limit
    const items = hasMore ? insights.slice(0, limit) : insights
    const nextCursor = hasMore ? items[items.length - 1]?.createdAt.toISOString() : null

    return reply.send({ insights: items, hasMore, nextCursor })
  })

  // GET /api/insights/:id — get a specific insight
  server.get<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const insight = await prisma.insight.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
    })
    if (!insight) {
      return reply.status(404).send({ error: 'Insight not found' })
    }
    return reply.send({ insight })
  })

  // PATCH /api/insights/:id — update insight (mark read, save, react)
  server.patch<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const body = updateInsightSchema.safeParse(req.body)
    if (!body.success) {
      return reply.status(400).send({ error: 'Invalid request', issues: body.error.issues })
    }

    const insight = await prisma.insight.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
    })
    if (!insight) {
      return reply.status(404).send({ error: 'Insight not found' })
    }

    const updated = await prisma.insight.update({
      where: { id: insight.id },
      data: {
        ...(body.data.isRead !== undefined ? { isRead: body.data.isRead } : {}),
        ...(body.data.isSaved !== undefined ? { isSaved: body.data.isSaved } : {}),
        ...(body.data.reactions ? { reactions: body.data.reactions as object } : {}),
      },
    })

    return reply.send({ insight: updated })
  })
}
