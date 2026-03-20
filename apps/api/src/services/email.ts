import { Resend } from 'resend'
import { render } from '@react-email/render'
import { MagicLinkEmail } from '../emails/MagicLinkEmail.js'
import { WeeklyDigestEmail } from '../emails/WeeklyDigestEmail.js'
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
