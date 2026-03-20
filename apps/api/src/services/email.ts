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

  const html = await render(
    React.createElement(MagicLinkEmail, {
      magicLinkUrl,
      productName: PRODUCT_NAME,
      tagline: TAGLINE,
    }),
  )

  try {
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
