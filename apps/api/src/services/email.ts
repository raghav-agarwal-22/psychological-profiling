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
import { AnnualUpgradeEmail } from '../emails/AnnualUpgradeEmail.js'
import { Day30ReAssessmentEmail } from '../emails/Day30ReAssessmentEmail.js'
import { MilestoneJournalEmail } from '../emails/MilestoneJournalEmail.js'
import { MilestoneShareEmail } from '../emails/MilestoneShareEmail.js'
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

// ─── Annual Conversion ────────────────────────────────────────────────────────

// Monthly price: $12/mo. Annual: $10/mo ($120/year). Savings: $24 (2 months free).
const MONTHLY_PRICE = '$12'
const ANNUAL_PRICE = '$10'
const ANNUAL_SAVINGS = '24'

export async function sendAnnualUpgradeEmail(
  email: string,
  userName: string | null,
  daysSinceSubscribed: number,
  upgradeUrl: string,
): Promise<void> {
  if (process.env.SKIP_EMAIL === 'true') {
    console.info(`[email] SKIP_EMAIL=true — annual upgrade (day ${daysSinceSubscribed}) for ${email}`)
    return
  }

  const html = await render(
    React.createElement(AnnualUpgradeEmail, {
      userName,
      upgradeUrl,
      daysSinceSubscribed,
      monthlySavings: ANNUAL_SAVINGS,
      annualPrice: ANNUAL_PRICE,
      monthlyPrice: MONTHLY_PRICE,
    }),
  )

  const subjectByDay =
    daysSinceSubscribed <= 14
      ? `Lock in your rate for a year — save 2 months free`
      : daysSinceSubscribed <= 21
        ? `3 weeks in — save $${ANNUAL_SAVINGS} by switching to annual`
        : `Last reminder: 2 months free if you switch to annual`

  await getResend().emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: subjectByDay,
    html,
    text: `Hi${userName ? ` ${userName}` : ''},\n\nYou've been on Innermind for ${daysSinceSubscribed} days. Switch to annual and save 2 months free ($${ANNUAL_SAVINGS}/year).\n\nSwitch now: ${upgradeUrl}\n\n— The ${PRODUCT_NAME} team`,
  })
}

// ─── Day 30 Re-Assessment ─────────────────────────────────────────────────────

export async function sendDay30ReAssessmentEmail(
  email: string,
  userName: string | null,
  archetypeName: string,
  topTrait: string,
  assessmentUrl: string,
  profileUrl: string,
  subjectVariant: 'a' | 'b',
): Promise<void> {
  if (process.env.SKIP_EMAIL === 'true') {
    console.info(`[email] SKIP_EMAIL=true — day30 re-assessment for ${email}`)
    return
  }

  const html = await render(
    React.createElement(Day30ReAssessmentEmail, {
      userName,
      archetypeName,
      topTrait,
      assessmentUrl,
      profileUrl,
    }),
  )

  const subject =
    subjectVariant === 'a' ? 'A month in — how have you changed?' : 'Your 30-day personality check-in'

  await getResend().emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject,
    html,
    text: `Hi${userName ? ` ${userName}` : ''},\n\nA month ago, you discovered you're the ${archetypeName} with high ${topTrait}. A lot can change in 30 days — retake the Big Five to see how.\n\nRetake now: ${assessmentUrl}\n\n— The ${PRODUCT_NAME} team`,
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

// ─── Milestone: 3rd Journal Entry ─────────────────────────────────────────────

export async function sendMilestoneJournalEmail(
  toEmail: string,
  userName: string | null,
  archetypeName: string,
): Promise<void> {
  if (process.env.SKIP_EMAIL === 'true') {
    console.info(`[email] SKIP_EMAIL=true — milestone_journal_3 to ${toEmail}`)
    return
  }

  const webUrl = process.env.NEXT_PUBLIC_WEB_URL ?? 'http://localhost:3000'
  const insightsUrl = `${webUrl}/insights`

  const html = await render(
    React.createElement(MilestoneJournalEmail, { userName, archetypeName, insightsUrl }),
  )

  await getResend().emails.send({
    from: FROM_ADDRESS,
    to: toEmail,
    subject: 'You have been reflecting — here is what we noticed',
    html,
    text: `Hi${userName ? ` ${userName}` : ''},\n\nYou just wrote your third journal entry. As a ${archetypeName}, reflection is how you integrate experience.\n\nSee your growth chart: ${insightsUrl}\n\n— The ${PRODUCT_NAME} team`,
  })
}

// ─── Milestone: First Profile Share ───────────────────────────────────────────

export async function sendMilestoneShareEmail(
  toEmail: string,
  userName: string | null,
  archetypeName: string,
  topTraits: string[],
  shareToken: string,
): Promise<void> {
  if (process.env.SKIP_EMAIL === 'true') {
    console.info(`[email] SKIP_EMAIL=true — milestone_share_first to ${toEmail}`)
    return
  }

  const webUrl = process.env.NEXT_PUBLIC_WEB_URL ?? 'http://localhost:3000'
  const assessmentUrl = `${webUrl}/assessment`
  const profileUrl = `${webUrl}/p/${shareToken}`

  const html = await render(
    React.createElement(MilestoneShareEmail, {
      userName,
      archetypeName,
      topTraits,
      assessmentUrl,
      profileUrl,
    }),
  )

  await getResend().emails.send({
    from: FROM_ADDRESS,
    to: toEmail,
    subject: 'Your profile is live — here is what makes you unique',
    html,
    text: `Hi${userName ? ` ${userName}` : ''},\n\nYour psychological portrait is now public. Top traits: ${topTraits.slice(0, 3).join(', ')}.\n\nExplore more assessments: ${assessmentUrl}\n\n— The ${PRODUCT_NAME} team`,
  })
}

// ─── Referral: Reward granted notification ────────────────────────────────────

export async function sendReferralRewardNotificationEmail(
  toEmail: string,
  referrerName: string | null,
  refereeName: string | null,
): Promise<void> {
  if (process.env.SKIP_EMAIL === 'true') {
    console.info(`[email] SKIP_EMAIL=true — referral reward notification to ${toEmail}`)
    return
  }

  const webUrl = process.env.NEXT_PUBLIC_WEB_URL ?? 'http://localhost:3000'
  const dashboardUrl = `${webUrl}/dashboard`
  const hi = referrerName ? `Hi ${referrerName},` : 'Hi,'
  const friendLabel = refereeName ?? 'Your friend'

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="background:#1c1917;color:#d6d3d1;font-family:Georgia,serif;margin:0;padding:40px 24px;">
  <div style="max-width:520px;margin:0 auto;">
    <div style="margin-bottom:32px;">
      <span style="font-size:24px;color:#f59e0b;">◎</span>
      <span style="font-size:13px;color:#78716c;letter-spacing:0.08em;margin-left:10px;">innermind</span>
    </div>
    <h1 style="font-size:26px;font-weight:700;color:#f5f5f4;margin:0 0 16px;">${hi}</h1>
    <p style="font-size:16px;color:#a8a29e;line-height:1.6;margin:0 0 24px;">
      ${friendLabel} just completed their psychological assessment using your referral link.
      You've earned <strong style="color:#f59e0b;">1 month of Pro free</strong> — added to your account automatically.
    </p>
    <a href="${dashboardUrl}" style="display:inline-block;background:#f59e0b;color:#1c1917;font-family:sans-serif;font-size:14px;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;">
      View your dashboard →
    </a>
    <p style="font-size:13px;color:#57534e;margin-top:32px;line-height:1.5;">
      Keep sharing your referral link — you can earn up to 12 months free Pro per year.<br>
      Find your link at <a href="${dashboardUrl}" style="color:#78716c;">${dashboardUrl}</a>
    </p>
    <p style="font-size:12px;color:#44403c;margin-top:24px;">— The ${PRODUCT_NAME} team</p>
  </div>
</body>
</html>`

  await getResend().emails.send({
    from: FROM_ADDRESS,
    to: toEmail,
    subject: `${friendLabel} completed their assessment — you earned 1 month Pro free`,
    html,
    text: `${hi}\n\n${friendLabel} just completed their psychological assessment using your referral link. You've earned 1 month of Pro free — added to your account automatically.\n\nView your dashboard: ${dashboardUrl}\n\n— The ${PRODUCT_NAME} team`,
  })
}
