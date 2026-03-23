// Pro subscriber onboarding email sequence processor.
// Called by the /api/drip/process cron endpoint.
//
// Sequence (offsets from user.firstPaidAt or trialStartedAt):
//   Day 2  (+48h): Deep Dive — how to read your profile dimensions
//   Day 5  (+120h): Social Proof — what users like you discovered + attachment feature highlight
//   Day 14 (+336h): Re-engagement — your profile evolves, prompt to retake assessments
//
// OnboardingEmail.emailType keys:
//   pro_welcome  (sent immediately on checkout.session.completed — see billing.ts)
//   pro_day2, pro_day5, pro_day14

import { prisma } from '@innermind/db'
import {
  sendProDeepDiveEmail,
  sendProSocialProofEmail,
  sendProReEngagementEmail,
} from '../services/email.js'
import { getArchetypeMetadata } from './archetypes.js'

const WEB_URL = process.env.WEB_URL ?? 'http://localhost:3000'
const POSTHOG_API_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? ''
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com'

async function capturePosthogEvent(
  userId: string,
  event: string,
  properties: Record<string, unknown>,
): Promise<void> {
  if (!POSTHOG_API_KEY) return
  try {
    await fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: POSTHOG_API_KEY, distinct_id: userId, event, properties }),
    })
  } catch {
    // non-critical
  }
}

const PRO_ONBOARDING_DAYS = [
  { emailType: 'pro_day2', offsetHours: 48, maxOffsetHours: 5 * 24 },
  { emailType: 'pro_day5', offsetHours: 120, maxOffsetHours: 8 * 24 },
  { emailType: 'pro_day14', offsetHours: 336, maxOffsetHours: 17 * 24 },
] as const

type ProEmailType = 'pro_day2' | 'pro_day5' | 'pro_day14'

export async function processProOnboardingEmails(): Promise<{
  processed: number
  sent: number
  errors: number
}> {
  const now = new Date()
  let processed = 0
  let sent = 0
  let errors = 0

  for (const { emailType, offsetHours, maxOffsetHours } of PRO_ONBOARDING_DAYS) {
    const minPaidAt = new Date(now.getTime() - maxOffsetHours * 60 * 60 * 1000)
    const maxPaidAt = new Date(now.getTime() - offsetHours * 60 * 60 * 1000)

    // Find Pro users whose subscription started in the eligibility window
    // Use firstPaidAt (direct subscribers) or trialEndsAt is non-null (trial starters)
    const eligible = await prisma.user.findMany({
      where: {
        subscriptionTier: 'pro',
        emailDigestOptIn: true,
        firstPaidAt: { gte: minPaidAt, lte: maxPaidAt },
        onboardingEmails: { none: { emailType } },
      },
      select: {
        id: true,
        email: true,
        name: true,
        firstPaidAt: true,
        profiles: {
          where: { isLatest: true },
          take: 1,
          select: { id: true, archetypes: true },
        },
      },
    })

    for (const user of eligible) {
      processed++
      try {
        const profile = user.profiles[0]
        const archetypes = profile ? (profile.archetypes as string[]) : []
        const rawArchetypeName = archetypes[0] ?? null
        const archetypeName = rawArchetypeName
          ? getArchetypeMetadata(rawArchetypeName).name
          : null
        const profileId = profile?.id ?? null

        if (emailType === 'pro_day2') {
          await sendProDeepDiveEmail(user.email, user.name, profileId)
        } else if (emailType === 'pro_day5') {
          await sendProSocialProofEmail(user.email, user.name, archetypeName)
        } else if (emailType === 'pro_day14') {
          await sendProReEngagementEmail(user.email, user.name, archetypeName)
        }

        await prisma.onboardingEmail.create({
          data: { userId: user.id, emailType },
        })

        await capturePosthogEvent(user.id, 'pro_onboarding_email_sent', {
          email_type: emailType,
          has_profile: !!profile,
          archetype_name: archetypeName,
        })

        console.info(`[pro-onboarding] Sent ${emailType} to ${user.id}`)
        sent++
      } catch (err) {
        errors++
        console.error(`[pro-onboarding] Failed to send ${emailType} to ${user.id}:`, err)
      }
    }
  }

  return { processed, sent, errors }
}

// Send the immediate pro_welcome email and record it.
// Called directly from the billing webhook — not scheduled.
export async function sendAndRecordProWelcome(
  userId: string,
  email: string,
  userName: string | null,
): Promise<void> {
  // Guard: never send twice
  const alreadySent = await prisma.onboardingEmail.findFirst({
    where: { userId, emailType: 'pro_welcome' },
  })
  if (alreadySent) return

  const { sendProWelcomeEmail } = await import('../services/email.js')
  await sendProWelcomeEmail(email, userName)

  await prisma.onboardingEmail.create({
    data: { userId, emailType: 'pro_welcome' },
  })

  await capturePosthogEvent(userId, 'pro_onboarding_email_sent', { email_type: 'pro_welcome' })
  console.info(`[pro-onboarding] Sent pro_welcome to ${userId}`)
}
