// 7-day onboarding drip sequence processor.
// Called by the /api/drip/process cron endpoint.
//
// Drip schedule (offsets from user.createdAt):
//   Day 1 (+24h): Archetype education — requires ≥1 completed assessment, skip Pro users
//   Day 3 (+72h): Insight teaser — free users only
//   Day 5 (+120h): Social proof — free users only
//   Day 7 (+168h): Pro offer — free users only
//
// OnboardingEmail.emailType keys:
//   drip_day1, drip_day3, drip_day5, drip_day7
//   drip_suppressed (inserted for all remaining days when user upgrades to Pro)

import { prisma } from '@innermind/db'
import {
  sendDay1ArchetypeEmail,
  sendDay3InsightTeaserEmail,
  sendDay5SocialProofEmail,
  sendDay7ProOfferEmail,
  sendDay30ReAssessmentEmail,
  sendAnnualUpgradeEmail,
} from '../services/email.js'
import { getArchetypeMetadata, getTopBigFiveTrait } from './archetypes.js'

const WEB_URL = process.env.WEB_URL ?? 'http://localhost:3000'
const POSTHOG_API_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? ''
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com'

async function capturePosthogEvent(userId: string, event: string, properties: Record<string, unknown>): Promise<void> {
  if (!POSTHOG_API_KEY) return
  try {
    await fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: POSTHOG_API_KEY, distinct_id: userId, event, properties }),
    })
  } catch {
    // non-critical — don't block email sends
  }
}

const DRIP_DAYS = [
  { emailType: 'drip_day1', offsetHours: 24, maxOffsetHours: 7 * 24 },
  { emailType: 'drip_day3', offsetHours: 72, maxOffsetHours: 10 * 24 },
  { emailType: 'drip_day5', offsetHours: 120, maxOffsetHours: 12 * 24 },
  { emailType: 'drip_day7', offsetHours: 168, maxOffsetHours: 21 * 24 },
  { emailType: 'drip_day30', offsetHours: 720, maxOffsetHours: 37 * 24 },
] as const

type DripEmailType = 'drip_day1' | 'drip_day3' | 'drip_day5' | 'drip_day7' | 'drip_day30'

interface DripResult {
  userId: string
  emailType: DripEmailType
  sent: boolean
  reason?: string
}

export async function processAllDripEmails(): Promise<{ processed: number; sent: number; errors: number }> {
  const now = new Date()
  let processed = 0
  let sent = 0
  let errors = 0

  for (const { emailType, offsetHours, maxOffsetHours } of DRIP_DAYS) {
    const minCreatedAt = new Date(now.getTime() - maxOffsetHours * 60 * 60 * 1000)
    const maxCreatedAt = new Date(now.getTime() - offsetHours * 60 * 60 * 1000)

    // Find users in the eligibility window who haven't received this email yet
    const eligible = await prisma.user.findMany({
      where: {
        createdAt: { gte: minCreatedAt, lte: maxCreatedAt },
        emailDigestOptIn: true,
        onboardingEmails: { none: { emailType } },
      },
      select: {
        id: true,
        email: true,
        name: true,
        subscriptionTier: true,
        createdAt: true,
        profiles: {
          where: { isLatest: true },
          take: 1,
          select: { id: true, archetypes: true, dimensions: true },
        },
        assessments: {
          where: { status: 'COMPLETED' },
          take: 1,
          select: { id: true },
        },
      },
    })

    for (const user of eligible) {
      processed++
      try {
        const result = await sendDripEmail(user, emailType)
        if (result.sent) sent++
      } catch (err) {
        errors++
        console.error(`[drip] Failed to send ${emailType} to ${user.id}:`, err)
      }
    }
  }

  return { processed, sent, errors }
}

type UserRecord = {
  id: string
  email: string
  name: string | null
  subscriptionTier: string
  profiles: Array<{ id: string; archetypes: unknown; dimensions: unknown }>
  assessments: Array<{ id: string }>
}

async function sendDripEmail(user: UserRecord, emailType: DripEmailType): Promise<DripResult> {
  const upgradeUrl = `${WEB_URL}/upgrade`
  const dashboardUrl = `${WEB_URL}/dashboard`

  // Day 1: requires at least 1 completed assessment; skip Pro users
  if (emailType === 'drip_day1') {
    if (user.subscriptionTier === 'pro') {
      return { userId: user.id, emailType, sent: false, reason: 'pro_user' }
    }
    if (user.assessments.length === 0) {
      return { userId: user.id, emailType, sent: false, reason: 'no_assessment' }
    }
  }

  // Days 3–7 and Day 30: free users only
  if (emailType !== 'drip_day1' && user.subscriptionTier !== 'free') {
    return { userId: user.id, emailType, sent: false, reason: 'paid_user' }
  }

  // Day 30: requires at least 1 completed assessment (same as Day 1)
  if (emailType === 'drip_day30' && user.assessments.length === 0) {
    return { userId: user.id, emailType, sent: false, reason: 'no_assessment' }
  }

  const profile = user.profiles[0]
  const archetypes = profile ? (profile.archetypes as string[]) : []
  const rawArchetypeName = archetypes[0] ?? 'The Explorer'
  const archetypeMeta = getArchetypeMetadata(rawArchetypeName)

  const dimensions = profile ? (profile.dimensions as Record<string, unknown>) : {}
  const topTrait = getTopBigFiveTrait(dimensions) || 'Openness'
  const completedFrameworks = user.assessments.length
  const profileUrl = profile ? `${WEB_URL}/profile/${profile.id}` : `${WEB_URL}/dashboard`

  if (emailType === 'drip_day1') {
    await sendDay1ArchetypeEmail(
      user.email,
      user.name,
      archetypeMeta.name,
      archetypeMeta.tagline,
      archetypeMeta.description,
      topTrait,
      profileUrl,
    )
  } else if (emailType === 'drip_day3') {
    await sendDay3InsightTeaserEmail(user.email, user.name, archetypeMeta.name, topTrait, upgradeUrl)
  } else if (emailType === 'drip_day5') {
    await sendDay5SocialProofEmail(user.email, user.name, archetypeMeta.name, profileUrl, upgradeUrl)
  } else if (emailType === 'drip_day7') {
    await sendDay7ProOfferEmail(
      user.email,
      user.name,
      archetypeMeta.name,
      topTrait,
      completedFrameworks,
      upgradeUrl,
      dashboardUrl,
    )
  } else if (emailType === 'drip_day30') {
    const subjectVariant: 'a' | 'b' = Math.random() < 0.5 ? 'a' : 'b'
    await sendDay30ReAssessmentEmail(
      user.email,
      user.name,
      archetypeMeta.name,
      topTrait,
      `${WEB_URL}/assessment`,
      profileUrl,
      subjectVariant,
    )
    await capturePosthogEvent(user.id, 'retention_day30_email_sent', { variant: subjectVariant })
  }

  // Record the send to prevent duplicates
  await prisma.onboardingEmail.create({
    data: { userId: user.id, emailType },
  })

  console.info(`[drip] Sent ${emailType} to ${user.id}`)
  return { userId: user.id, emailType, sent: true }
}

// ─── Annual Conversion Sequence ───────────────────────────────────────────────
// Targets monthly subscribers at Day 14, 21, 30 after firstPaidAt.
// Email types: annual_day14, annual_day21, annual_day30
// Skips users already on annual or who have cancelled.

const ANNUAL_CONVERSION_DAYS = [
  { emailType: 'annual_day14', offsetHours: 14 * 24, maxOffsetHours: 17 * 24 },
  { emailType: 'annual_day21', offsetHours: 21 * 24, maxOffsetHours: 24 * 24 },
  { emailType: 'annual_day30', offsetHours: 30 * 24, maxOffsetHours: 35 * 24 },
] as const

type AnnualEmailType = 'annual_day14' | 'annual_day21' | 'annual_day30'

export async function processAnnualConversionEmails(): Promise<{ processed: number; sent: number; errors: number }> {
  const now = new Date()
  let processed = 0
  let sent = 0
  let errors = 0

  for (const { emailType, offsetHours, maxOffsetHours } of ANNUAL_CONVERSION_DAYS) {
    const minFirstPaidAt = new Date(now.getTime() - maxOffsetHours * 60 * 60 * 1000)
    const maxFirstPaidAt = new Date(now.getTime() - offsetHours * 60 * 60 * 1000)

    // Find monthly subscribers in the eligibility window who haven't received this email
    const eligible = await prisma.user.findMany({
      where: {
        firstPaidAt: { gte: minFirstPaidAt, lte: maxFirstPaidAt },
        subscriptionInterval: 'monthly',
        subscriptionTier: { in: ['essential', 'pro'] },
        emailDigestOptIn: true,
        onboardingEmails: { none: { emailType } },
      },
      select: {
        id: true,
        email: true,
        name: true,
        firstPaidAt: true,
      },
    })

    for (const user of eligible) {
      processed++
      try {
        const daysSinceSubscribed = user.firstPaidAt
          ? Math.floor((now.getTime() - user.firstPaidAt.getTime()) / (1000 * 60 * 60 * 24))
          : offsetHours / 24

        await sendAnnualUpgradeEmail(
          user.email,
          user.name,
          daysSinceSubscribed,
          `${WEB_URL}/upgrade?ref=annual_email`,
        )

        await prisma.onboardingEmail.create({
          data: { userId: user.id, emailType },
        })

        console.info(`[drip] Sent ${emailType} to ${user.id}`)
        sent++
      } catch (err) {
        errors++
        console.error(`[drip] Failed to send ${emailType} to ${user.id}:`, err)
      }
    }
  }

  return { processed, sent, errors }
}

// Call this when a user upgrades to Pro to suppress all unsent drip emails.
export async function suppressDripSequence(userId: string): Promise<void> {
  const allDripTypes: DripEmailType[] = ['drip_day1', 'drip_day3', 'drip_day5', 'drip_day7', 'drip_day30']

  // Find which types haven't been sent yet
  const alreadySent = await prisma.onboardingEmail.findMany({
    where: { userId, emailType: { in: allDripTypes } },
    select: { emailType: true },
  })
  const sentTypes = new Set(alreadySent.map((r) => r.emailType))
  const toSuppress = allDripTypes.filter((t) => !sentTypes.has(t))

  if (toSuppress.length === 0) return

  await prisma.onboardingEmail.createMany({
    data: toSuppress.map((emailType) => ({ userId, emailType })),
    skipDuplicates: true,
  })

  console.info(`[drip] Suppressed ${toSuppress.length} pending drip emails for user ${userId}`)
}
