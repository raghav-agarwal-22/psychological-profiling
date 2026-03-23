import type { FastifyInstance } from 'fastify'
import Stripe from 'stripe'
import { prisma } from '@innermind/db'
import {
  sendDay1ArchetypeEmail,
  sendDay3InsightTeaserEmail,
  sendDay5SocialProofEmail,
  sendDay7ProOfferEmail,
  sendWaitlistLaunchEmail,
} from '../services/email.js'

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

    // UTM attribution: distribution of utm_source among paid users
    const paidUsersWithUtm = await prisma.user.findMany({
      where: { subscriptionTier: { in: ['pro', 'essential'] } },
      select: { utmSource: true },
    })
    const utmCounts: Record<string, number> = {}
    for (const u of paidUsersWithUtm) {
      const src = u.utmSource ?? '(direct)'
      utmCounts[src] = (utmCounts[src] ?? 0) + 1
    }
    const utmAttribution = Object.entries(utmCounts)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)

    // MRR timeline: first paid date per user → daily MRR accumulation
    const firstPaidUsers = await prisma.user.findMany({
      where: { firstPaidAt: { not: null } },
      select: { firstPaidAt: true, subscriptionInterval: true },
      orderBy: { firstPaidAt: 'asc' },
    })
    const PRO_MONTHLY = 19
    let runningMrr = 0
    const mrrTimeline = firstPaidUsers.map((u) => {
      const contribution = u.subscriptionInterval === 'annual'
        ? Math.round((PRO_MONTHLY * 12) / 12) // annuals contribute same monthly
        : PRO_MONTHLY
      runningMrr += contribution
      return {
        date: u.firstPaidAt!.toISOString().slice(0, 10),
        mrr: runningMrr,
      }
    })

    // Days since first paid customer
    const firstPaidAt = firstPaidUsers[0]?.firstPaidAt ?? null
    const daysSinceLaunch = firstPaidAt
      ? Math.floor((Date.now() - firstPaidAt.getTime()) / (1000 * 60 * 60 * 24))
      : null

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
      utmAttribution,
      mrrTimeline,
      daysSinceLaunch,
      firstPaidAt: firstPaidAt?.toISOString() ?? null,
    })
  })

  // POST /api/admin/drip/run — send Day1/3/5/7 onboarding drip emails
  // Designed to be called daily by Railway cron: 0 9 * * *
  server.post('/drip/run', async (_req, reply) => {
    const WEB_URL = process.env.WEB_URL ?? 'http://localhost:3000'
    const UPGRADE_URL = `${WEB_URL}/billing`

    const now = new Date()
    const dayMs = 24 * 60 * 60 * 1000

    // Each drip window: users created between [minDays, maxDays) ago
    const dripWindows = [
      { emailType: 'day1_archetype',    minDays: 1, maxDays: 2 },
      { emailType: 'day3_insight_teaser', minDays: 3, maxDays: 4 },
      { emailType: 'day5_social_proof',  minDays: 5, maxDays: 6 },
      { emailType: 'day7_pro_offer',     minDays: 7, maxDays: 8 },
    ] as const

    const results: { emailType: string; sent: number; skipped: number }[] = []

    for (const window of dripWindows) {
      const createdBefore = new Date(now.getTime() - window.minDays * dayMs)
      const createdAfter  = new Date(now.getTime() - window.maxDays * dayMs)

      // Find users in the window who haven't received this email yet
      const alreadySent = await prisma.onboardingEmail.findMany({
        where: { emailType: window.emailType },
        select: { userId: true },
      })
      const alreadySentIds = new Set(alreadySent.map((r) => r.userId))

      const users = await prisma.user.findMany({
        where: {
          createdAt: { gte: createdAfter, lt: createdBefore },
          emailDigestOptIn: true,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          profiles: {
            where: { isLatest: true },
            take: 1,
            select: { id: true, archetypes: true, dimensions: true },
          },
          _count: {
            select: { assessments: { where: { status: 'COMPLETED' } } },
          },
        },
      })

      let sent = 0
      let skipped = 0

      for (const user of users) {
        if (alreadySentIds.has(user.id)) { skipped++; continue }

        const profile = user.profiles[0]
        const archetypeName = (profile?.archetypes as string[] | undefined)?.[0] ?? 'The Explorer'
        const dimensions = (profile?.dimensions ?? {}) as Record<string, number>
        const topTrait = Object.entries(dimensions).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Openness'
        const profileUrl = profile ? `${WEB_URL}/profile/${profile.id}` : `${WEB_URL}/assessments`
        const completedFrameworks = user._count.assessments

        try {
          if (window.emailType === 'day1_archetype') {
            await sendDay1ArchetypeEmail(
              user.email,
              user.name,
              archetypeName,
              'The archetype that shapes your deepest patterns',
              `As the ${archetypeName}, you bring a distinct lens to everything you do — how you lead, how you connect, and where your growth edge lies.`,
              topTrait,
              profileUrl,
            )
          } else if (window.emailType === 'day3_insight_teaser') {
            await sendDay3InsightTeaserEmail(user.email, user.name, archetypeName, topTrait, UPGRADE_URL)
          } else if (window.emailType === 'day5_social_proof') {
            await sendDay5SocialProofEmail(user.email, user.name, archetypeName, profileUrl, UPGRADE_URL)
          } else if (window.emailType === 'day7_pro_offer') {
            await sendDay7ProOfferEmail(
              user.email,
              user.name,
              archetypeName,
              topTrait,
              completedFrameworks,
              UPGRADE_URL,
              `${WEB_URL}/dashboard`,
            )
          }

          await prisma.onboardingEmail.create({
            data: { userId: user.id, emailType: window.emailType },
          })
          sent++
        } catch (err) {
          server.log.warn({ err, userId: user.id, emailType: window.emailType }, 'Drip email send failed')
          skipped++
        }
      }

      results.push({ emailType: window.emailType, sent, skipped })
    }

    return reply.send({ ok: true, results })
  })

  // GET /api/admin/notify-list — CSV export of pre-launch email subscribers
  server.get('/notify-list', async (_req, reply) => {
    const rows = await prisma.notifyList.findMany({
      orderBy: { createdAt: 'asc' },
      select: { email: true, source: true, createdAt: true },
    })

    const csv = [
      'email,source,created_at',
      ...rows.map((r) => `${r.email},${r.source},${r.createdAt.toISOString()}`),
    ].join('\n')

    return reply
      .header('Content-Type', 'text/csv')
      .header('Content-Disposition', 'attachment; filename="notify-list.csv"')
      .send(csv)
  })

  // GET /api/admin/waitlist.csv — CSV export of degraded_synthesis waitlist
  server.get('/waitlist.csv', async (_req, reply) => {
    const rows = await prisma.notifyList.findMany({
      where: { source: 'degraded_synthesis' },
      orderBy: { createdAt: 'asc' },
      select: { email: true, createdAt: true },
    })

    const csv = [
      'email,joined_at',
      ...rows.map((r) => `${r.email},${r.createdAt.toISOString()}`),
    ].join('\n')

    return reply
      .header('Content-Type', 'text/csv')
      .header('Content-Disposition', 'attachment; filename="waitlist.csv"')
      .send(csv)
  })

  // POST /api/admin/waitlist/blast — send launch email to all degraded_synthesis waitlist entries
  server.post('/waitlist/blast', async (req, reply) => {
    const WEB_URL = process.env.WEB_URL ?? 'http://localhost:3000'
    const startUrl = `${WEB_URL}/assessment`

    const entries = await prisma.notifyList.findMany({
      where: { source: 'degraded_synthesis' },
      select: { email: true },
    })

    let sent = 0
    let failed = 0

    for (const entry of entries) {
      try {
        await sendWaitlistLaunchEmail(entry.email, startUrl)
        sent++
      } catch (err) {
        req.log.warn({ err, email: entry.email }, 'Waitlist blast email failed')
        failed++
      }
    }

    return reply.send({ ok: true, sent, failed, total: entries.length })
  })
}
