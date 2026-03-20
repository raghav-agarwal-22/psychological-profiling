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

  // GET /api/admin/funnel — conversion funnel: signup → assessment → profile → trial → pro
  server.get('/funnel', async (_req, reply) => {
    const now = new Date()
    const [
      totalUsers,
      usersStartedAssessment,
      usersCompletedAssessment,
      usersWithProfile,
      usersStartedTrial,
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
      // Trial users = those who ever had a trialEndsAt set (currently trialing or converted)
      prisma.user.count({
        where: { trialEndsAt: { not: null } },
      }),
      prisma.user.count({ where: { subscriptionTier: 'pro' } }),
    ])

    const pct = (num: number, denom: number) =>
      denom > 0 ? Math.round((num / denom) * 1000) / 10 : 0

    // Currently trialing (not yet paid)
    const currentlyTrialing = await prisma.user.count({
      where: { subscriptionTier: 'pro', trialEndsAt: { gte: now } },
    })
    const paidPro = proUsers - currentlyTrialing

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
          label: 'Started trial',
          count: usersStartedTrial,
          dropoffRate: pct(usersWithProfile - usersStartedTrial, usersWithProfile),
          conversionFromPrev: pct(usersStartedTrial, usersWithProfile),
        },
        {
          label: 'Converted to paid',
          count: paidPro,
          dropoffRate: pct(usersStartedTrial - paidPro, usersStartedTrial),
          conversionFromPrev: pct(paidPro, usersStartedTrial),
        },
      ],
      overallConversion: pct(proUsers, totalUsers),
      currentlyTrialing,
    })
  })

  // GET /api/admin/cohorts — weekly cohort retention (last 8 weeks)
  server.get('/cohorts', async (_req, reply) => {
    const now = new Date()
    const eightWeeksAgo = new Date(now.getTime() - 8 * 7 * 24 * 60 * 60 * 1000)

    // Get all users from last 8 weeks with their subscription status
    const users = await prisma.user.findMany({
      where: { createdAt: { gte: eightWeeksAgo } },
      select: {
        id: true,
        createdAt: true,
        subscriptionTier: true,
        trialEndsAt: true,
      },
    })

    // Group into weekly cohorts (week 0 = most recent)
    const cohorts: Record<string, { total: number; pro: number; trial: number; weekLabel: string }> = {}

    for (const user of users) {
      const msAgo = now.getTime() - user.createdAt.getTime()
      const weekNum = Math.floor(msAgo / (7 * 24 * 60 * 60 * 1000))
      const cohortDate = new Date(now.getTime() - (weekNum + 1) * 7 * 24 * 60 * 60 * 1000)
      const key = `W${weekNum}`

      if (!cohorts[key]) {
        cohorts[key] = {
          total: 0,
          pro: 0,
          trial: 0,
          weekLabel: cohortDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        }
      }

      cohorts[key].total++
      if (user.subscriptionTier === 'pro') {
        if (user.trialEndsAt && user.trialEndsAt > now) {
          cohorts[key].trial++
        } else {
          cohorts[key].pro++
        }
      }
    }

    const result = Object.entries(cohorts)
      .sort(([a], [b]) => {
        // Sort by week number descending (most recent first)
        return parseInt(b.slice(1)) - parseInt(a.slice(1))
      })
      .map(([key, data]) => ({
        cohort: key,
        weekLabel: data.weekLabel,
        signups: data.total,
        paidPro: data.pro,
        trialing: data.trial,
        conversionRate: data.total > 0 ? Math.round(((data.pro + data.trial) / data.total) * 1000) / 10 : 0,
        paidConversionRate: data.total > 0 ? Math.round((data.pro / data.total) * 1000) / 10 : 0,
      }))

    return reply.send({ cohorts: result })
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
    // Pro plan is $19/month
    const PRO_PRICE_MONTHLY = 19
    if (!stripeDataAvailable) {
      mrr = proUsers * PRO_PRICE_MONTHLY
    }

    // New MRR: subscriptions started in last 30 days
    // Churned MRR: subscriptions cancelled in last 30 days
    let newMrr = 0
    let churnedMrr = 0

    if (stripe && stripeDataAvailable) {
      try {
        const [newSubs, cancelledSubsWithPrice] = await Promise.all([
          stripe.subscriptions.list({
            status: 'active',
            limit: 100,
            created: { gte: Math.floor(thirtyDaysAgo.getTime() / 1000) },
            expand: ['data.items.data.price'],
          }),
          stripe.subscriptions.list({
            status: 'canceled',
            limit: 100,
            created: { gte: Math.floor(thirtyDaysAgo.getTime() / 1000) },
            expand: ['data.items.data.price'],
          }),
        ])

        newMrr = newSubs.data.reduce((sum, sub) => {
          const item = sub.items.data[0]
          if (!item) return sum
          const price = item.price
          const amount = price.unit_amount ?? 0
          const interval = price.recurring?.interval
          if (interval === 'month') return sum + amount
          if (interval === 'year') return sum + Math.round(amount / 12)
          return sum
        }, 0) / 100

        churnedMrr = cancelledSubsWithPrice.data.reduce((sum, sub) => {
          const item = sub.items.data[0]
          if (!item) return sum
          const price = item.price
          const amount = price.unit_amount ?? 0
          const interval = price.recurring?.interval
          if (interval === 'month') return sum + amount
          if (interval === 'year') return sum + Math.round(amount / 12)
          return sum
        }, 0) / 100
      } catch {
        // Fallback to DB estimates
        newMrr = newProLast30Days * PRO_PRICE_MONTHLY
        churnedMrr = cancelledLast30Days * PRO_PRICE_MONTHLY
      }
    } else {
      newMrr = newProLast30Days * PRO_PRICE_MONTHLY
      churnedMrr = cancelledLast30Days * PRO_PRICE_MONTHLY
    }

    const netMrr = newMrr - churnedMrr

    const arr = mrr * 12
    const ARR_GOAL = 100000
    const arrProgress = Math.min(Math.round((arr / ARR_GOAL) * 1000) / 10, 100)

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

    // Count trial users
    const trialUsers = await prisma.user.count({
      where: {
        subscriptionTier: 'pro',
        trialEndsAt: { gte: new Date() },
      },
    })

    return reply.send({
      mrr: Math.round(mrr * 100) / 100,
      arr: Math.round(arr * 100) / 100,
      arrGoal: ARR_GOAL,
      arrProgress,
      newMrr: Math.round(newMrr * 100) / 100,
      churnedMrr: Math.round(churnedMrr * 100) / 100,
      netMrr: Math.round(netMrr * 100) / 100,
      subscriptionDistribution: {
        pro: proUsers,
        free: freeUsers,
        total: totalUsers,
        proPercent: conversionRate,
        trial: trialUsers,
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
