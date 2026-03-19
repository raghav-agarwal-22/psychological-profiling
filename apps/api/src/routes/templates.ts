import type { FastifyInstance } from 'fastify'
import { prisma } from '@innermind/db'

export async function templateRoutes(server: FastifyInstance) {
  // GET /api/templates — list active assessment templates
  server.get('/', async (_req, reply) => {
    const templates = await prisma.assessmentTemplate.findMany({
      where: { isActive: true },
      select: {
        id: true,
        type: true,
        title: true,
        description: true,
        version: true,
      },
      orderBy: { createdAt: 'asc' },
    })
    return reply.send({ templates })
  })

  // GET /api/templates/:id — get a single template with its question bank
  server.get<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const template = await prisma.assessmentTemplate.findUnique({
      where: { id: req.params.id },
    })
    if (!template || !template.isActive) {
      return reply.status(404).send({ error: 'Template not found' })
    }
    return reply.send({ template })
  })
}
