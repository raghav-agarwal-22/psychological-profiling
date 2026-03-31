/**
 * Monthly AI insight email processor.
 *
 * Sends a personalized, AI-generated insight to all paid users with a completed profile.
 * Run on the 1st of each month at 9am UTC via Railway cron:
 *   Schedule: 0 9 1 * *
 *   Command:  curl -X POST $API_URL/api/digest/monthly -H "Authorization: Bearer $CRON_SECRET"
 *
 * Cost: ~200 tokens/user with claude-haiku-4-5-20251001 ≈ $0.60 per 1000 users/month
 */

import Anthropic from '@anthropic-ai/sdk'
import { render } from '@react-email/render'
import { Resend } from 'resend'
import * as React from 'react'
import { prisma } from '@innermind/db'
import { MonthlyInsightEmail } from '../emails/MonthlyInsightEmail.js'

const resend = new Resend(process.env.RESEND_API_KEY ?? 'dev-placeholder')
const FROM_ADDRESS = process.env.EMAIL_FROM ?? 'noreply@innermindhealing.com'
const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL ?? 'http://localhost:3000'

const BATCH_SIZE = 10
const BATCH_DELAY_MS = 200

interface Dimension {
  name: string
  score: number
}

interface Archetype {
  name: string
}

async function generateInsight(
  archetypeName: string,
  dimensions: Dimension[],
): Promise<{ insight: string; growthTip: string }> {
  const client = new Anthropic()

  // Find lowest scoring Big Five dimension for growth tip
  const sortedDimensions = [...dimensions].sort((a, b) => a.score - b.score)
  const lowestDimension = sortedDimensions[0]

  const dimensionSummary = dimensions
    .map((d) => `${d.name}: ${Math.round(d.score * 100)}%`)
    .join(', ')

  const prompt = `You are a psychologist writing a personalized monthly growth insight for a user of Innermind, a psychological profiling platform.

User profile:
- Primary archetype: ${archetypeName}
- Assessment dimensions: ${dimensionSummary}
- Growth focus: ${lowestDimension?.name ?? 'openness'} (lowest dimension)

Write a response with exactly two parts:

INSIGHT: Write 2-3 sentences of a personalized psychological insight for this month. Connect their archetype to a real pattern they might be experiencing right now. Be specific, warm, and grounded — not generic. Do not start with "As a".

GROWTH_TIP: Write one concrete, actionable thing they can do this month to develop their ${lowestDimension?.name ?? 'lowest'} dimension. Make it specific and practical (e.g. a specific exercise, conversation, or practice). 1-2 sentences max.

Format exactly as:
INSIGHT: [your insight here]
GROWTH_TIP: [your tip here]`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0]?.type === 'text' ? message.content[0].text : ''

  const insightMatch = text.match(/INSIGHT:\s*(.+?)(?=\nGROWTH_TIP:|$)/s)
  const tipMatch = text.match(/GROWTH_TIP:\s*(.+?)$/s)

  return {
    insight: insightMatch?.[1]?.trim() ?? 'Keep exploring your psychological landscape — each assessment deepens your self-understanding.',
    growthTip: tipMatch?.[1]?.trim() ?? 'Set aside 10 minutes this week to journal about a pattern you have noticed in yourself.',
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export interface MonthlyInsightResult {
  processed: number
  sent: number
  errors: number
}

export async function processMonthlyInsights(): Promise<MonthlyInsightResult> {
  const now = new Date()
  const monthKey = `monthly_insight_${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}`
  const monthLabel = now.toLocaleString('en-US', { month: 'long' })

  let processed = 0
  let sent = 0
  let errors = 0

  // Query eligible users: paid + opted-in + has a completed profile
  const users = await prisma.user.findMany({
    where: {
      subscriptionTier: { not: 'free' },
      emailDigestOptIn: true,
      onboardingEmails: { none: { emailType: monthKey } },
      profiles: {
        some: { isLatest: true },
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
      profiles: {
        where: { isLatest: true },
        take: 1,
        select: { archetypes: true, dimensions: true },
      },
    },
  })

  // Process in batches
  for (let i = 0; i < users.length; i += BATCH_SIZE) {
    const batch = users.slice(i, i + BATCH_SIZE)

    await Promise.all(
      batch.map(async (user) => {
        processed++
        try {
          const profile = user.profiles[0]
          if (!profile) return

          const archetypes = profile.archetypes as Archetype[] | null
          const dimensions = profile.dimensions as Dimension[] | null
          const archetypeName = archetypes?.[0]?.name ?? 'Explorer'
          const dimensionList = dimensions ?? []

          if (process.env.SKIP_EMAIL === 'true') {
            console.info(`[monthly-insight] SKIP_EMAIL=true — would send to ${user.email}`)
            await prisma.onboardingEmail.create({
              data: { userId: user.id, emailType: monthKey },
            })
            sent++
            return
          }

          const { insight, growthTip } = await generateInsight(archetypeName, dimensionList)

          const insightsUrl = `${WEB_URL}/insights`
          const html = await render(
            React.createElement(MonthlyInsightEmail, {
              userName: user.name,
              monthLabel,
              archetypeName,
              aiInsight: insight,
              growthTip,
              insightsUrl,
            }),
          )

          await resend.emails.send({
            from: FROM_ADDRESS,
            to: user.email,
            subject: `Your ${monthLabel} growth insight${user.name ? `, ${user.name.split(' ')[0]}` : ''}`,
            html,
            text: `Hi${user.name ? ` ${user.name}` : ''},\n\n${insight}\n\nThis month: ${growthTip}\n\nContinue your journey: ${insightsUrl}\n\n— The Innermind team`,
          })

          // Record send to prevent duplicates
          await prisma.onboardingEmail.create({
            data: { userId: user.id, emailType: monthKey },
          })

          sent++
        } catch (err) {
          errors++
          console.error(`[monthly-insight] Failed for user ${user.id}:`, err)
        }
      }),
    )

    // Delay between batches to avoid rate limits
    if (i + BATCH_SIZE < users.length) {
      await sleep(BATCH_DELAY_MS)
    }
  }

  return { processed, sent, errors }
}
