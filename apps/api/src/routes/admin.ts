import type { FastifyInstance } from 'fastify'
import Stripe from 'stripe'
import { prisma } from '@innermind/db'

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'admin-dev-secret'

const stripeKey = process.env.STRIPE_SECRET_KEY ?? ''
const stripeConfigured = stripeKey && !stripeKey.includes('placeholder')
const stripe = stripeConfigured
  ? new Stripe(stripeKey, { apiVersion: '2026-02-25.clover' })
  : null

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

  // GET /api/admin/funnel — conversion funnel: signup → assessment → profile → pro
  server.get('/funnel', async (_req, reply) => {
    const [
      totalUsers,
      usersStartedAssessment,
      usersCompletedAssessment,
      usersWithProfile,
      proUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.assessment.findMany({
        distinct: ['userId'],
        select: { userId: true },
      }).then((r) => r.length),
      prisma.assessment.findMany({
        where: { status: 'COMPLETED' },
        distinct: ['userId'],
        select: { userId: true },
      }).then((r) => r.length),
      prisma.profile.findMany({
        distinct: ['userId'],
        select: { userId: true },
      }).then((r) => r.length),
      prisma.user.count({ where: { subscriptionTier: 'pro' } }),
    ])

    const pct = (num: number, denom: number) =>
      denom > 0 ? Math.round((num / denom) * 1000) / 10 : 0

    return reply.send({
      steps: [
        {
          label: 'Signed up',
          count: totalUsers,
          dropoffRate: 0,
          conversionFromPrev: 100,
        },
        {
          label: 'Started assessment',
          count: usersStartedAssessment,
          dropoffRate: pct(totalUsers - usersStartedAssessment, totalUsers),
          conversionFromPrev: pct(usersStartedAssessment, totalUsers),
        },
        {
          label: 'Completed assessment',
          count: usersCompletedAssessment,
          dropoffRate: pct(usersStartedAssessment - usersCompletedAssessment, usersStartedAssessment),
          conversionFromPrev: pct(usersCompletedAssessment, usersStartedAssessment),
        },
        {
          label: 'Profile generated',
          count: usersWithProfile,
          dropoffRate: pct(usersCompletedAssessment - usersWithProfile, usersCompletedAssessment),
          conversionFromPrev: pct(usersWithProfile, usersCompletedAssessment),
        },
        {
          label: 'Upgraded to Pro',
          count: proUsers,
          dropoffRate: pct(usersWithProfile - proUsers, usersWithProfile),
          conversionFromPrev: pct(proUsers, usersWithProfile),
        },
      ],
      overallConversion: pct(proUsers, totalUsers),
    })
  })

  // GET /api/admin/revenue — subscription and revenue analytics
  server.get('/revenue', async (_req, reply) => {
    const now = Date.now()
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysFromNow = new Date(now + 7 * 24 * 60 * 60 * 1000)

    const [
      totalUsers,
      proUsers,
      freeUsers,
      newUsersLast30Days,
      newProLast30Days,
      atRiskSubscribers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { subscriptionTier: 'pro' } }),
      prisma.user.count({ where: { subscriptionTier: 'free' } }),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.user.count({
        where: { subscriptionTier: 'pro', createdAt: { gte: thirtyDaysAgo } },
      }),
      prisma.user.findMany({
        where: {
          subscriptionTier: 'pro',
          subscriptionExpiresAt: { gte: new Date(), lte: sevenDaysFromNow },
        },
        select: { id: true, email: true, subscriptionExpiresAt: true },
        orderBy: { subscriptionExpiresAt: 'asc' },
      }),
    ])

    // Stripe-derived metrics (when configured with real keys)
    let mrr = 0
    let cancelledLast30Days = 0
    let stripeDataAvailable = false

    if (stripe) {
      try {
        const [activeSubs, cancelledSubs] = await Promise.all([
          stripe.subscriptions.list({
            status: 'active',
            limit: 100,
            expand: ['data.items.data.price'],
          }),
          stripe.subscriptions.list({
            status: 'canceled',
            limit: 100,
            created: { gte: Math.floor(thirtyDaysAgo.getTime() / 1000) },
          }),
        ])

        mrr = activeSubs.data.reduce((sum, sub) => {
          const item = sub.items.data[0]
          if (!item) return sum
          const price = item.price
          const amount = price.unit_amount ?? 0
          const interval = price.recurring?.interval
          if (interval === 'month') return sum + amount
          if (interval === 'year') return sum + Math.round(amount / 12)
          return sum
        }, 0) / 100 // cents → dollars

        cancelledLast30Days = cancelledSubs.data.length
        stripeDataAvailable = true
      } catch {
        // Stripe unavailable — fall through to DB estimates
      }
    }

    // Fallback: DB-based estimates (pre-revenue / dev mode)
    // Use $19/month as placeholder price assumption
    const PRO_PRICE_MONTHLY = 19
    if (!stripeDataAvailable) {
      mrr = proUsers * PRO_PRICE_MONTHLY
    }

    const arr = mrr * 12
    const conversionRate =
      totalUsers > 0 ? Math.round((proUsers / totalUsers) * 1000) / 10 : 0

    // Churn: cancelled last 30d / pro users at start of period (estimate)
    const proAtPeriodStart = Math.max(proUsers - newProLast30Days + cancelledLast30Days, 1)
    const monthlyChurnRate = stripeDataAvailable
      ? Math.round((cancelledLast30Days / proAtPeriodStart) * 1000) / 10
      : 0

    // LTV = avg revenue per user / churn rate (or 12-month assumption if no churn data)
    const avgMonthlyRevenue = proUsers > 0 ? mrr / proUsers : PRO_PRICE_MONTHLY
    const estimatedLtv =
      monthlyChurnRate > 0
        ? Math.round(avgMonthlyRevenue / (monthlyChurnRate / 100))
        : Math.round(avgMonthlyRevenue * 12)

    return reply.send({
      mrr: Math.round(mrr * 100) / 100,
      arr: Math.round(arr * 100) / 100,
      subscriptionDistribution: {
        pro: proUsers,
        free: freeUsers,
        total: totalUsers,
        proPercent: conversionRate,
      },
      conversionRate,
      newUsersLast30Days,
      newProLast30Days,
      monthlyChurnRate,
      cancelledLast30Days,
      estimatedLtv,
      atRiskSubscribers: atRiskSubscribers.map((u) => ({
        id: u.id,
        email: u.email,
        expiresAt: u.subscriptionExpiresAt,
      })),
      stripeDataAvailable,
    })
  })
}
