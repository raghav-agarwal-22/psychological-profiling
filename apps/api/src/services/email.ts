import { Resend } from 'resend'
import { render } from '@react-email/render'
import { MagicLinkEmail } from '../emails/MagicLinkEmail.js'
import { WeeklyDigestEmail } from '../emails/WeeklyDigestEmail.js'
import { WelcomeEmail } from '../emails/WelcomeEmail.js'
import { AssessmentNudgeEmail } from '../emails/AssessmentNudgeEmail.js'
import { ProfileRevealEmail } from '../emails/ProfileRevealEmail.js'
import { DeepDiveNudgeEmail } from '../emails/DeepDiveNudgeEmail.js'
import { ProUpgradeEmail } from '../emails/ProUpgradeEmail.js'
import { TrialEndingSoonEmail } from '../emails/TrialEndingSoonEmail.js'
import { ReferralInviteEmail } from '../emails/ReferralInviteEmail.js'
import { Day1ArchetypeEmail } from '../emails/Day1ArchetypeEmail.js'
import { Day3InsightTeaserEmail } from '../emails/Day3InsightTeaserEmail.js'
import { Day5SocialProofEmail } from '../emails/Day5SocialProofEmail.js'
import { Day7ProOfferEmail } from '../emails/Day7ProOfferEmail.js'
import { WeeklyGrowthChallengeEmail } from '../emails/WeeklyGrowthChallengeEmail.js'
import * as React from 'react'

let _resend: Resend | null = null
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY ?? 'dev-placeholder')
  }
  return _resend
}

const FROM_ADDRESS = process.env.EMAIL_FROM ?? 'noreply@innermind.app'
const PRODUCT_NAME = 'Innermind'
const TAGLINE = 'Understand yourself deeply.'

// ─── Magic Link ───────────────────────────────────────────────────────────────

function buildMagicLinkText(magicLinkUrl: string): string {
  return `${PRODUCT_NAME} — ${TAGLINE}

Sign in to ${PRODUCT_NAME}

Click the link below to sign in. This link expires in 15 minutes and can only be used once.

${magicLinkUrl}

If you didn't request this email, you can safely ignore it.
`
}

export async function sendMagicLink(email: string, magicLinkUrl: string): Promise<void> {
  if (process.env.SKIP_EMAIL === 'true') {
    console.info(`[email] SKIP_EMAIL=true — magic link for ${email}: ${magicLinkUrl}`)
    return
  }

  try {
    const html = await render(
      React.createElement(MagicLinkEmail, {
        magicLinkUrl,
        productName: PRODUCT_NAME,
        tagline: TAGLINE,
      }),
    )

    await getResend().emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: `Your ${PRODUCT_NAME} sign-in link`,
      html,
      text: buildMagicLinkText(magicLinkUrl),
    })
  } catch (err) {
    // Log failure but don't surface to caller — avoid leaking email existence
    console.error('[email] Failed to send magic link via Resend:', err)
    console.info(`[email] Fallback — magic link for ${email}: ${magicLinkUrl}`)
  }
}

// ─── Weekly Digest ────────────────────────────────────────────────────────────

interface GrowthRecommendation {
  title: string
  description: string
  category: string
  scoreBasis: string
  actionStep: string
}

interface DigestEmailData {
  userName: string | null
  topRecommendation: GrowthRecommendation | null
  daysSinceLastAssessment: number | null
  synthesisSnippet: string | null
  dashboardUrl: string
  date: Date
}

function buildDigestText(data: DigestEmailData): string {
  const { userName, topRecommendation, daysSinceLastAssessment, synthesisSnippet, dashboardUrl, date } = data
  const greeting = userName ? `Hi ${userName}` : 'Hi there'

  const lines: string[] = [
    `${PRODUCT_NAME} — Your weekly digest`,
    date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
    ``,
    `${greeting},`,
    ``,
    `Here's your personalized ${PRODUCT_NAME} summary for the week.`,
    ``,
  ]

  if (topRecommendation) {
    lines.push(`THIS WEEK'S FOCUS`)
    lines.push(`${topRecommendation.title}`)
    lines.push(`${topRecommendation.description}`)
    lines.push(``)
    lines.push(`Action step: ${topRecommendation.actionStep}`)
    lines.push(``)
  }

  if (daysSinceLastAssessment !== null) {
    if (daysSinceLastAssessment === 0) {
      lines.push(`You completed an assessment today — great work.`)
    } else {
      lines.push(`Days since last assessment: ${daysSinceLastAssessment}`)
    }
    lines.push(``)
  }

  if (synthesisSnippet) {
    lines.push(`FROM YOUR SYNTHESIS`)
    lines.push(`"${synthesisSnippet}"`)
    lines.push(``)
  }

  lines.push(`Open your dashboard: ${dashboardUrl}`)
  lines.push(``)
  lines.push(`You're receiving this because you opted into the weekly digest.`)

  return lines.join('\n')
}

export async function sendWeeklyDigest(email: string, data: DigestEmailData): Promise<void> {
  if (process.env.SKIP_EMAIL === 'true') {
    console.info(`[email] SKIP_EMAIL=true — digest for ${email}`)
    return
  }

  const html = await render(
    React.createElement(WeeklyDigestEmail, {
      userName: data.userName,
      topRecommendation: data.topRecommendation,
      daysSinceLastAssessment: data.daysSinceLastAssessment,
      synthesisSnippet: data.synthesisSnippet,
      dashboardUrl: data.dashboardUrl,
      date: data.date,
      productName: PRODUCT_NAME,
    }),
  )

  const subject = `Your ${PRODUCT_NAME} week — ${data.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`

  await getResend().emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject,
    html,
    text: buildDigestText(data),
  })
}

// Re-export data types for use in routes
export type { DigestEmailData, GrowthRecommendation }

// ─── Onboarding Sequence ──────────────────────────────────────────────────────

const WEB_URL = process.env.WEB_URL ?? 'http://localhost:3000'

export async function sendWelcomeEmail(email: string, userName: string | null): Promise<void> {
  if (process.env.SKIP_EMAIL === 'true') {
    console.info(`[email] SKIP_EMAIL=true — welcome email for ${email}`)
    return
  }

  const html = await render(
    React.createElement(WelcomeEmail, {
      userName,
      startUrl: `${WEB_URL}/assessments`,
    }),
  )

  await getResend().emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: `Welcome to ${PRODUCT_NAME} — your self-discovery starts now`,
    html,
    text: `Welcome to ${PRODUCT_NAME}!\n\nYour journey to understanding yourself begins with 5 validated psychology frameworks synthesized by AI.\n\nStart your first assessment: ${WEB_URL}/assessments\n\n— The ${PRODUCT_NAME} team`,
  })
}

export async function sendAssessmentNudgeEmail(email: string, userName: string | null): Promise<void> {
  if (process.env.SKIP_EMAIL === 'true') {
    console.info(`[email] SKIP_EMAIL=true — assessment nudge for ${email}`)
    return
  }

  const html = await render(
    React.createElement(AssessmentNudgeEmail, {
      userName,
      assessmentUrl: `${WEB_URL}/assessments`,
    }),
  )

  await getResend().emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: `Your ${PRODUCT_NAME} assessment is waiting — 8 minutes to clarity`,
    html,
    text: `Hi${userName ? ` ${userName}` : ''},\n\nYour psychological portrait is waiting. The Big Five takes 8 minutes.\n\nStart now: ${WEB_URL}/assessments\n\n— The ${PRODUCT_NAME} team`,
  })
}

export async function sendProfileRevealEmail(
  email: string,
  userName: string | null,
  profileId: string,
  completedFramework: string,
): Promise<void> {
  if (process.env.SKIP_EMAIL === 'true') {
    console.info(`[email] SKIP_EMAIL=true — profile reveal for ${email}`)
    return
  }

  const html = await render(
    React.createElement(ProfileRevealEmail, {
      userName,
      profileUrl: `${WEB_URL}/profile/${profileId}`,
      assessmentUrl: `${WEB_URL}/assessments`,
      completedFramework,
    }),
  )

  await getResend().emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: `Your psychological portrait is ready`,
    html,
    text: `Hi${userName ? ` ${userName}` : ''},\n\nYour ${completedFramework} portrait is ready.\n\nView it here: ${WEB_URL}/profile/${profileId}\n\n— The ${PRODUCT_NAME} team`,
  })
}

export async function sendDeepDiveNudgeEmail(email: string, userName: string | null): Promise<void> {
  if (process.env.SKIP_EMAIL === 'true') {
    console.info(`[email] SKIP_EMAIL=true — deep dive nudge for ${email}`)
    return
  }

  const html = await render(
    React.createElement(DeepDiveNudgeEmail, {
      userName,
      deepDiveUrl: `${WEB_URL}/assessments`,
      profileUrl: `${WEB_URL}/insights`,
    }),
  )

  await getResend().emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: `Go deeper — ${PRODUCT_NAME}'s AI has questions for you`,
    html,
    text: `Hi${userName ? ` ${userName}` : ''},\n\nReady to go deeper? ${PRODUCT_NAME}'s adaptive AI generates questions tailored to your unique profile.\n\nStart your deep dive: ${WEB_URL}/assessments\n\n— The ${PRODUCT_NAME} team`,
  })
}

export async function sendProUpgradeEmail(email: string, userName: string | null): Promise<void> {
  if (process.env.SKIP_EMAIL === 'true') {
    console.info(`[email] SKIP_EMAIL=true — pro upgrade for ${email}`)
    return
  }

  const html = await render(
    React.createElement(ProUpgradeEmail, {
      userName,
      upgradeUrl: `${WEB_URL}/billing`,
      dashboardUrl: `${WEB_URL}/insights`,
    }),
  )

  await getResend().emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: `Unlock the full ${PRODUCT_NAME} experience`,
    html,
    text: `Hi${userName ? ` ${userName}` : ''},\n\nYou've been using ${PRODUCT_NAME} for 2 weeks. Ready to unlock the full experience?\n\nUpgrade to Pro: ${WEB_URL}/billing\n\n— The ${PRODUCT_NAME} team`,
  })
}

export async function sendTrialEndingSoonEmail(
  email: string,
  userName: string | null,
  daysRemaining: number,
): Promise<void> {
  if (process.env.SKIP_EMAIL === 'true') {
    console.info(`[email] SKIP_EMAIL=true — trial ending soon for ${email} (${daysRemaining}d)`)
    return
  }

  const html = await render(
    React.createElement(TrialEndingSoonEmail, {
      userName,
      daysRemaining,
      billingUrl: `${WEB_URL}/dashboard/billing`,
      dashboardUrl: `${WEB_URL}/dashboard`,
    }),
  )

  await getResend().emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: `Your ${PRODUCT_NAME} Pro trial ends in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`,
    html,
    text: `Hi${userName ? ` ${userName}` : ''},\n\nYour ${PRODUCT_NAME} Pro trial ends in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}. After that, you'll be charged $9/month.\n\nManage your plan: ${WEB_URL}/dashboard/billing\n\n— The ${PRODUCT_NAME} team`,
  })
}

// ─── Drip Sequence (Day 1 / 3 / 5 / 7) ──────────────────────────────────────

export async function sendDay1ArchetypeEmail(
  email: string,
  userName: string | null,
  archetypeName: string,
  archetypeTagline: string,
  archetypeDescription: string,
  topTrait: string,
  profileUrl: string,
): Promise<void> {
  if (process.env.SKIP_EMAIL === 'true') {
    console.info(`[email] SKIP_EMAIL=true — day1 archetype for ${email}`)
    return
  }

  const html = await render(
    React.createElement(Day1ArchetypeEmail, {
      userName,
      archetypeName,
      archetypeTagline,
      archetypeDescription,
      topTrait,
      profileUrl,
    }),
  )

  await getResend().emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: `You are the ${archetypeName} — here's what that really means`,
    html,
    text: `Hi${userName ? ` ${userName}` : ''},\n\nYour dominant Jungian archetype is ${archetypeName} — ${archetypeTagline}.\n\nExplore your full portrait: ${profileUrl}\n\n— The ${PRODUCT_NAME} team`,
  })
}

export async function sendDay3InsightTeaserEmail(
  email: string,
  userName: string | null,
  archetypeName: string,
  topTrait: string,
  upgradeUrl: string,
): Promise<void> {
  if (process.env.SKIP_EMAIL === 'true') {
    console.info(`[email] SKIP_EMAIL=true — day3 insight teaser for ${email}`)
    return
  }

  const html = await render(
    React.createElement(Day3InsightTeaserEmail, {
      userName,
      archetypeName,
      topTrait,
      upgradeUrl,
    }),
  )

  await getResend().emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: `What your ${archetypeName} archetype reveals about your relationships`,
    html,
    text: `Hi${userName ? ` ${userName}` : ''},\n\nYour ${archetypeName} archetype shapes how you connect with others. Here's a deeper look.\n\nSee Pro insights: ${upgradeUrl}\n\n— The ${PRODUCT_NAME} team`,
  })
}

export async function sendDay5SocialProofEmail(
  email: string,
  userName: string | null,
  archetypeName: string,
  profileUrl: string,
  upgradeUrl: string,
): Promise<void> {
  if (process.env.SKIP_EMAIL === 'true') {
    console.info(`[email] SKIP_EMAIL=true — day5 social proof for ${email}`)
    return
  }

  const html = await render(
    React.createElement(Day5SocialProofEmail, {
      userName,
      archetypeName,
      profileUrl,
      upgradeUrl,
    }),
  )

  await getResend().emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: `Others with the ${archetypeName} archetype are discovering this`,
    html,
    text: `Hi${userName ? ` ${userName}` : ''},\n\nPeople like you are using ${PRODUCT_NAME} to understand their blind spots and grow intentionally.\n\nView your profile: ${profileUrl}\n\n— The ${PRODUCT_NAME} team`,
  })
}

export async function sendDay7ProOfferEmail(
  email: string,
  userName: string | null,
  archetypeName: string,
  topTrait: string,
  completedFrameworks: number,
  upgradeUrl: string,
  dashboardUrl: string,
): Promise<void> {
  if (process.env.SKIP_EMAIL === 'true') {
    console.info(`[email] SKIP_EMAIL=true — day7 pro offer for ${email}`)
    return
  }

  const html = await render(
    React.createElement(Day7ProOfferEmail, {
      userName,
      archetypeName,
      topTrait,
      completedFrameworks,
      upgradeUrl,
      dashboardUrl,
    }),
  )

  await getResend().emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: `One week in — unlock the full ${PRODUCT_NAME} experience`,
    html,
    text: `Hi${userName ? ` ${userName}` : ''},\n\nYou've been on ${PRODUCT_NAME} for a week. Ready to go deeper?\n\nUpgrade to Pro: ${upgradeUrl}\n\n— The ${PRODUCT_NAME} team`,
  })
}

// ─── Weekly Growth Challenge ──────────────────────────────────────────────────

export async function sendWeeklyGrowthChallengeEmail(
  email: string,
  userName: string | null,
  archetypeName: string,
  challengeTheme: string,
  challengeText: string,
  profileUrl: string,
  proFeatureTeaser: string,
): Promise<void> {
  if (process.env.SKIP_EMAIL === 'true') {
    console.info(`[email] SKIP_EMAIL=true — weekly growth challenge for ${email}`)
    return
  }

  const html = await render(
    React.createElement(WeeklyGrowthChallengeEmail, {
      userName,
      archetypeName,
      challengeTheme,
      challengeText,
      profileUrl,
      proFeatureTeaser,
    }),
  )

  await getResend().emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: `Your ${archetypeName} growth challenge this week`,
    html,
    text: `Hi${userName ? ` ${userName}` : ''},\n\nThis week's growth challenge for ${archetypeName}s:\n\n${challengeTheme}\n${challengeText}\n\nSee your full portrait: ${profileUrl}\n\n— The ${PRODUCT_NAME} team`,
  })
}

export async function sendReferralInviteEmail(
  toEmail: string,
  referrerName: string | null,
  referralUrl: string,
): Promise<void> {
  if (process.env.SKIP_EMAIL === 'true') {
    console.info(`[email] SKIP_EMAIL=true — referral invite from ${referrerName ?? 'anonymous'} to ${toEmail}`)
    return
  }

  const html = await render(
    React.createElement(ReferralInviteEmail, { referrerName, referralUrl }),
  )

  const senderName = referrerName ?? 'A friend'
  await getResend().emails.send({
    from: FROM_ADDRESS,
    to: toEmail,
    subject: `${senderName} invited you to Innermind — 1 month Pro free`,
    html,
    text: `${senderName} invited you to Innermind.\n\nTake 5 psychology assessments and get an AI-synthesized portrait of who you are. You'll both get 1 month Pro free when you complete your first assessment.\n\nJoin here: ${referralUrl}\n\n— The ${PRODUCT_NAME} team`,
  })
}
