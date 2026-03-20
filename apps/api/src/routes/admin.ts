import type { FastifyInstance } from 'fastify'
import { prisma } from '@innermind/db'

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'admin-dev-secret'

async function requireAdmin(req: any, reply: any) {
  const auth = req.headers.authorization as string | undefined
  if (auth !== `Bearer ${ADMIN_SECRET}`) {
    return reply.status(401).send({ error: 'Unauthorized' })
  }
}

export async function adminRoutes(server: FastifyInstance) {
  server.addHook('preHandler', requireAdmin)

  // GET /api/admin/metrics
  server.get('/metrics', async (_req, reply) => {
    const [
      totalUsers,
      totalSessions,
      totalAssessments,
      totalProfiles,
      totalCoachConversations,
      assessmentsByType,
      recentUsers,
      signupsLast30Days,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.session.count({ where: { status: 'COMPLETED' } }),
      prisma.assessment.count({ where: { status: 'COMPLETED' } }),
      prisma.profile.count(),
      prisma.coachConversation.count(),
      prisma.assessment.groupBy({
        by: ['type'],
        where: { status: 'COMPLETED' },
        _count: { id: true },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, email: true, createdAt: true },
      }),
      prisma.user.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
        _count: { id: true },
        orderBy: { createdAt: 'asc' },
      }),
    ])

    return reply.send({
      totals: {
        users: totalUsers,
        completedSessions: totalSessions,
        completedAssessments: totalAssessments,
        profiles: totalProfiles,
        coachConversations: totalCoachConversations,
      },
      assessmentsByType: assessmentsByType.map((a) => ({
        type: a.type,
        count: a._count.id,
      })),
      recentUsers,
      signupsLast30Days,
    })
  })
}
