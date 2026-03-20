import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '@innermind/db'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_ADDRESS = process.env.EMAIL_FROM ?? 'noreply@innermind.app'
const DIGEST_SECRET = process.env.DIGEST_SECRET ?? 'digest-dev-secret'

// ─── Types ───────────────────────────────────────────────────────────────────

interface GrowthRecommendation {
  title: string
  description: string
  category: string
  scoreBasis: string
  actionStep: string
}

interface GrowthRecommendationsPayload {
  recommendations: GrowthRecommendation[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDigestDate(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).trimEnd() + '…'
}

function isOlderThan6Days(date: Date | null): boolean {
  if (!date) return true
  const sixDaysMs = 6 * 24 * 60 * 60 * 1000
  return Date.now() - date.getTime() > sixDaysMs
}

// ─── Email builder ───────────────────────────────────────────────────────────

interface DigestEmailData {
  userName: string | null
  topRecommendation: GrowthRecommendation | null
  daysSinceLastAssessment: number | null
  synthesisSnippet: string | null
  dashboardUrl: string
  date: Date
}

function buildDigestHtml(data: DigestEmailData): string {
  const { userName, topRecommendation, daysSinceLastAssessment, synthesisSnippet, dashboardUrl, date } = data
  const greeting = userName ? `Hi ${userName}` : 'Hi there'
  const dateStr = formatDigestDate(date)

  const recommendationBlock = topRecommendation
    ? `
          <tr>
            <td style="padding:0 0 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e4dc;border-radius:10px;overflow:hidden;">
                <tr>
                  <td style="background:#fefcf8;padding:20px 24px;">
                    <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;color:#b45309;">This week&apos;s focus</p>
                    <p style="margin:0 0 8px;font-size:16px;font-weight:600;color:#111111;">${topRecommendation.title}</p>
                    <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#555555;">${topRecommendation.description}</p>
                    <table cellpadding="0" cellspacing="0" style="border-left:3px solid #f59e0b;padding-left:12px;">
                      <tr>
                        <td>
                          <p style="margin:0;font-size:13px;line-height:1.5;color:#444444;"><strong style="color:#b45309;">Action step:</strong> ${topRecommendation.actionStep}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
    : ''

  const assessmentBlock = daysSinceLastAssessment !== null
    ? `
          <tr>
            <td style="padding:0 0 24px;">
              <p style="margin:0;font-size:14px;color:#666666;">
                ${
                  daysSinceLastAssessment === 0
                    ? 'You completed an assessment today — great work staying engaged.'
                    : daysSinceLastAssessment < 7
                      ? `You last completed an assessment <strong>${daysSinceLastAssessment} day${daysSinceLastAssessment !== 1 ? 's' : ''} ago</strong>.`
                      : daysSinceLastAssessment < 30
                        ? `It&apos;s been <strong>${daysSinceLastAssessment} days</strong> since your last assessment. A fresh one might surface new patterns.`
                        : `It&apos;s been <strong>${daysSinceLastAssessment} days</strong> since your last assessment. You may have grown in ways worth measuring.`
                }
              </p>
            </td>
          </tr>`
    : ''

  const synthesisBlock = synthesisSnippet
    ? `
          <tr>
            <td style="padding:0 0 24px;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;color:#78716c;">From your synthesis</p>
              <p style="margin:0;font-size:14px;line-height:1.7;color:#555555;font-style:italic;">&ldquo;${synthesisSnippet}&rdquo;</p>
            </td>
          </tr>`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Innermind week &mdash; ${dateStr}</title>
</head>
<body style="margin:0;padding:0;background:#f5f4f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f4f0;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:14px;box-shadow:0 1px 6px rgba(0,0,0,0.06);overflow:hidden;max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="background:#0f0f0f;padding:28px 36px;">
              <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">Innermind</p>
              <p style="margin:5px 0 0;font-size:12px;color:#888888;">Your weekly digest &mdash; ${dateStr}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 36px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0">

                <!-- Greeting -->
                <tr>
                  <td style="padding:0 0 24px;">
                    <h1 style="margin:0 0 8px;font-size:22px;font-weight:600;color:#111111;letter-spacing:-0.3px;">${greeting},</h1>
                    <p style="margin:0;font-size:15px;line-height:1.6;color:#555555;">Here&apos;s your personalized Innermind summary for the week.</p>
                  </td>
                </tr>

                ${recommendationBlock}
                ${assessmentBlock}
                ${synthesisBlock}

                <!-- CTA -->
                <tr>
                  <td style="padding:0 0 8px;" align="center">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="border-radius:10px;background:#0f0f0f;">
                          <a href="${dashboardUrl}" style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:-0.1px;">Open your dashboard &rarr;</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px 28px;border-top:1px solid #f0ece4;">
              <p style="margin:0;font-size:12px;color:#aaaaaa;line-height:1.6;">
                You&apos;re receiving this because you opted into the weekly digest.
                Visit your <a href="${dashboardUrl}" style="color:#888888;">dashboard</a> to manage your email preferences.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function buildDigestText(data: DigestEmailData): string {
  const { userName, topRecommendation, daysSinceLastAssessment, synthesisSnippet, dashboardUrl, date } = data
  const greeting = userName ? `Hi ${userName}` : 'Hi there'
  const dateStr = formatDigestDate(date)

  const lines: string[] = [
    `Innermind — Your weekly digest`,
    `${dateStr}`,
    ``,
    `${greeting},`,
    ``,
    `Here's your personalized Innermind summary for the week.`,
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

// ─── Route ───────────────────────────────────────────────────────────────────

export async function digestRoutes(server: FastifyInstance) {
  // POST /api/digest/send — trigger digest send (protected by DIGEST_SECRET)
  server.post('/send', async (req, reply) => {
    // Authenticate via Bearer token
    const authHeader = req.headers['authorization'] ?? ''
    if (authHeader !== `Bearer ${DIGEST_SECRET}`) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }

    const dashboardUrl = `${process.env.WEB_URL ?? 'http://localhost:3000'}/dashboard`
    const now = new Date()

    // Fetch all opted-in users who are due for a digest
    const users = await prisma.user.findMany({
      where: {
        emailDigestOptIn: true,
        email: { not: undefined },
      },
      select: {
        id: true,
        email: true,
        name: true,
        synthesis: true,
        growthRecommendations: true,
        lastDigestSentAt: true,
        assessments: {
          where: { status: 'COMPLETED' },
          orderBy: { completedAt: 'desc' },
          take: 1,
          select: { completedAt: true },
        },
      },
    })

    let sent = 0
    let skipped = 0
    const errors: string[] = []

    for (const user of users) {
      // Rate-limit: only send if never sent or last sent > 6 days ago
      if (!isOlderThan6Days(user.lastDigestSentAt)) {
        skipped++
        continue
      }

      // Build email data
      const topRecommendation: GrowthRecommendation | null = (() => {
        if (!user.growthRecommendations) return null
        const payload = user.growthRecommendations as unknown as GrowthRecommendationsPayload
        const recs = payload?.recommendations
        return Array.isArray(recs) && recs.length > 0 ? (recs[0] as GrowthRecommendation) : null
      })()

      const lastAssessment = user.assessments[0]
      const daysSinceLastAssessment: number | null = lastAssessment?.completedAt
        ? Math.floor((now.getTime() - lastAssessment.completedAt.getTime()) / 86400000)
        : null

      const synthesisSnippet: string | null = user.synthesis
        ? truncate(user.synthesis.trim(), 150)
        : null

      const emailData: DigestEmailData = {
        userName: user.name,
        topRecommendation,
        daysSinceLastAssessment,
        synthesisSnippet,
        dashboardUrl,
        date: now,
      }

      const subject = `Your Innermind week — ${formatDigestDate(now)}`

      // Send email
      if (process.env.SKIP_EMAIL === 'true') {
        server.log.info({ userId: user.id, email: user.email }, '[digest] SKIP_EMAIL=true — skipping send')
      } else {
        try {
          await resend.emails.send({
            from: FROM_ADDRESS,
            to: user.email,
            subject,
            html: buildDigestHtml(emailData),
            text: buildDigestText(emailData),
          })
        } catch (err) {
          server.log.error({ userId: user.id, err }, '[digest] Failed to send email via Resend')
          errors.push(user.id)
          continue
        }
      }

      // Update lastDigestSentAt
      await prisma.user.update({
        where: { id: user.id },
        data: { lastDigestSentAt: now },
      })

      sent++
    }

    return reply.send({
      ok: true,
      sent,
      skipped,
      errors: errors.length > 0 ? errors : undefined,
    })
  })
}

// ─── Schema validation ────────────────────────────────────────────────────────

export const patchDigestPreferencesSchema = z.object({
  emailDigestOptIn: z.boolean(),
})
