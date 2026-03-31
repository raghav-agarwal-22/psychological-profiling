#!/usr/bin/env node
/**
 * Revenue Dashboard Generator
 *
 * Fetches live metrics from the Innermind admin API and writes
 * marketing/revenue-dashboard.md with updated numbers.
 *
 * Usage:
 *   node scripts/generate-revenue-dashboard.mjs
 *   API_URL=https://api.innermindhealing.com ADMIN_SECRET=xxx node scripts/generate-revenue-dashboard.mjs
 *
 * Designed to run as a daily cron on Railway:
 *   node scripts/generate-revenue-dashboard.mjs && git commit -am "chore: daily revenue dashboard update"
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const API_URL = process.env.API_URL ?? 'http://localhost:3001'
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'admin-dev-secret'

const ARR_GOAL = 100_000
const PRO_PRICE = 19
const DAYS_TO_GOAL = 60

async function fetchJson(path) {
  const res = await fetch(`${API_URL}/api/admin${path}`, {
    headers: { Authorization: `Bearer ${ADMIN_SECRET}` },
  })
  if (!res.ok) throw new Error(`${path} → ${res.status}: ${await res.text()}`)
  return res.json()
}

function bar(pct, width = 30) {
  const filled = Math.round((pct / 100) * width)
  return '█'.repeat(Math.max(0, filled)) + '░'.repeat(Math.max(0, width - filled))
}

function formatCurrency(n) {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

function formatPct(n) {
  return `${n.toFixed(1)}%`
}

async function main() {
  console.log(`Fetching metrics from ${API_URL}…`)

  const [revenue, funnel] = await Promise.all([
    fetchJson('/revenue'),
    fetchJson('/funnel'),
  ])

  const now = new Date()
  const today = now.toISOString().slice(0, 10)

  // ── Derived metrics ──────────────────────────────────────────────────────
  const mrr = revenue.mrr
  const arr = revenue.arr
  const arrProgress = revenue.arrProgress
  const totalUsers = revenue.subscriptionDistribution.total
  const proUsers = revenue.subscriptionDistribution.pro
  const trialUsers = revenue.subscriptionDistribution.trial
  const freeUsers = revenue.subscriptionDistribution.free
  const conversionRate = revenue.conversionRate
  const churnRate = revenue.monthlyChurnRate
  const ltv = revenue.estimatedLtv
  const newMrr = revenue.newMrr
  const churnedMrr = revenue.churnedMrr
  const netMrr = revenue.netMrr
  const daysSinceLaunch = revenue.daysSinceLaunch ?? 0

  // 60-day MRR projection: simple compound growth
  // If no paying users yet, use target growth rate implied by milestones
  const TARGET_MONTH1_MRR = 1330  // 70 users
  const TARGET_MONTH2_MRR = 4750  // 250 users
  const TARGET_MONTH3_MRR = 8333  // 440 users

  let projectedMrr60d = mrr
  let growthNote = ''
  if (mrr > 0 && revenue.mrrTimeline.length >= 2) {
    // Extrapolate from recent growth
    const timeline = revenue.mrrTimeline
    const recent = timeline.slice(-7)
    if (recent.length >= 2) {
      const dailyGrowthAvg = (recent[recent.length - 1].mrr - recent[0].mrr) / Math.max(recent.length - 1, 1)
      projectedMrr60d = mrr + dailyGrowthAvg * (DAYS_TO_GOAL - daysSinceLaunch)
      growthNote = `based on last ${recent.length}-day avg (+${formatCurrency(dailyGrowthAvg)}/day)`
    }
  } else if (mrr === 0) {
    projectedMrr60d = 0
    growthNote = 'pre-revenue — no projection available yet'
  }

  const gapToGoal = Math.max(0, ARR_GOAL - arr)
  const usersNeeded = Math.ceil(gapToGoal / 12 / PRO_PRICE)

  // Funnel conversion rates
  const signups = funnel.steps[0]?.count ?? 0
  const completedAssessment = funnel.steps[2]?.count ?? 0
  const converted = funnel.steps[5]?.count ?? 0
  const overallConversion = funnel.overallConversion ?? 0
  const assessmentCompletion = signups > 0 ? Math.round((completedAssessment / signups) * 1000) / 10 : 0

  // Last 7-day conversion: users who signed up in last 7d and converted
  // (approximation: newProLast7d / newUsersLast7d not directly available, use 30d rate)
  const conversionLast7d = conversionRate // best proxy from DB

  // ── UTM attribution ──────────────────────────────────────────────────────
  const utmTable = revenue.utmAttribution?.length > 0
    ? revenue.utmAttribution.slice(0, 5).map(
        (u) => `| ${u.source} | ${u.count} | ${proUsers > 0 ? Math.round((u.count / proUsers) * 100) : 0}% |`
      ).join('\n')
    : '| (no paid users yet) | — | — |'

  // ── MRR timeline ────────────────────────────────────────────────────────
  const timelineRows = revenue.mrrTimeline?.length > 0
    ? revenue.mrrTimeline.slice(-10).map(
        (t) => `| ${t.date} | ${formatCurrency(t.mrr)} |`
      ).join('\n')
    : '| — | Pre-revenue |'

  // ── Milestone progress ───────────────────────────────────────────────────
  const milestones = [
    { label: 'Month 1 target', target: TARGET_MONTH1_MRR, days: 30 },
    { label: 'Month 2 target', target: TARGET_MONTH2_MRR, days: 60 },
    { label: '$100k ARR target', target: Math.round(ARR_GOAL / 12), days: 90 },
  ].map((m) => {
    const pct = m.target > 0 ? Math.min(100, Math.round((mrr / m.target) * 100)) : 0
    return `| ${m.label} | ${formatCurrency(m.target)}/mo | ${pct}% | ${bar(pct, 20)} |`
  }).join('\n')

  // ── Build report ─────────────────────────────────────────────────────────
  const report = `# Innermind Revenue Dashboard
> Auto-generated on ${today} · Source: \`/api/admin/revenue\` + \`/api/admin/funnel\`
> Data source: ${revenue.stripeDataAvailable ? 'Stripe (live)' : 'Database estimates (Stripe not configured)'}

---

## Current State

| Metric | Value |
|--------|-------|
| **MRR** | ${formatCurrency(mrr)} |
| **ARR** | ${formatCurrency(arr)} |
| **ARR goal progress** | ${formatPct(arrProgress)} (${formatCurrency(arr)} / ${formatCurrency(ARR_GOAL)}) |
| **Paying users** | ${proUsers} paid + ${trialUsers} trialing |
| **Total registered users** | ${totalUsers} |
| **Free → paid conversion** | ${formatPct(conversionRate)} |
| **Monthly churn rate** | ${churnRate > 0 ? formatPct(churnRate) : 'N/A (no churn data yet)'} |
| **Estimated LTV** | ${formatCurrency(ltv)} |
| **Days since first payment** | ${daysSinceLaunch > 0 ? daysSinceLaunch : 'Pre-revenue'} |

### ARR Progress to $100k Goal

\`\`\`
${bar(arrProgress, 50)} ${formatPct(arrProgress)}
${formatCurrency(arr)} of ${formatCurrency(ARR_GOAL)} ARR
\`\`\`

---

## MRR Movement (Last 30 Days)

| Metric | Value |
|--------|-------|
| New MRR | ${formatCurrency(newMrr)} |
| Churned MRR | ${formatCurrency(churnedMrr)} |
| Net New MRR | ${formatCurrency(netMrr)} |
| New Pro users (30d) | ${revenue.newProLast30Days} |
| Cancelled (30d) | ${revenue.cancelledLast30Days} |

---

## 60-Day Projection

| Metric | Value |
|--------|-------|
| Projected MRR (day 60) | ${formatCurrency(projectedMrr60d)} |
| Projection basis | ${growthNote || 'extrapolated from growth curve'} |
| Gap to $100k ARR | ${formatCurrency(gapToGoal)} ARR = ${formatCurrency(Math.round(gapToGoal / 12))}/mo MRR |
| Additional users needed | ~${usersNeeded} paying users |

### Milestone Tracker

| Milestone | Target | Progress | |
|-----------|--------|----------|--|
${milestones}

---

## Conversion Funnel

| Stage | Users | Rate |
|-------|-------|------|
| Signed up | ${funnel.steps[0]?.count ?? 0} | 100% |
| Started assessment | ${funnel.steps[1]?.count ?? 0} | ${formatPct(funnel.steps[1]?.conversionFromPrev ?? 0)} |
| Completed assessment | ${funnel.steps[2]?.count ?? 0} | ${formatPct(assessmentCompletion)} overall |
| Profile generated | ${funnel.steps[3]?.count ?? 0} | ${formatPct(funnel.steps[3]?.conversionFromPrev ?? 0)} |
| Started trial | ${funnel.steps[4]?.count ?? 0} | ${formatPct(funnel.steps[4]?.conversionFromPrev ?? 0)} |
| Converted to paid | ${funnel.steps[5]?.count ?? 0} | ${formatPct(funnel.steps[5]?.conversionFromPrev ?? 0)} |

**Overall free → paid: ${formatPct(overallConversion)}** (target: >5%)

---

## MRR Timeline

| Date | Running MRR |
|------|-------------|
${timelineRows}

---

## Acquisition Attribution (Paid Users)

| UTM Source | Users | % of Paid |
|------------|-------|-----------|
${utmTable}

---

## At-Risk Subscribers

${revenue.atRiskSubscribers?.length > 0
  ? '| User | Expires |\n|------|---------|' +
    revenue.atRiskSubscribers.map((u) => `\n| ${u.email} | ${u.expiresAt?.slice(0, 10)} |`).join('')
  : '_No subscribers expiring in the next 7 days._'}

---

## Targets

| Period | MRR Target | Users | Status |
|--------|------------|-------|--------|
| Month 1 (day 30) | $1,330 | 70 | ${mrr >= 1330 ? '✅' : '⏳'} |
| Month 2 (day 60) | $4,750 | 250 | ${mrr >= 4750 ? '✅' : '⏳'} |
| Month 3 (day 90) | $8,333 | 440 | ${mrr >= 8333 ? '✅' : '⏳'} |
| $100k ARR | $8,333/mo | 440 | ${arr >= 100000 ? '✅' : '⏳'} |

---

_To regenerate: \`node scripts/generate-revenue-dashboard.mjs\`_
_For live Stripe data, ensure \`STRIPE_SECRET_KEY\` is set in the API environment._
`

  const outPath = path.join(__dirname, '..', 'marketing', 'revenue-dashboard.md')
  fs.writeFileSync(outPath, report, 'utf8')
  console.log(`✅ Dashboard written to marketing/revenue-dashboard.md`)
  console.log(`   MRR: ${formatCurrency(mrr)} | ARR: ${formatCurrency(arr)} | Users: ${proUsers} paid / ${totalUsers} total`)
  console.log(`   Conversion: ${formatPct(conversionRate)} | Churn: ${churnRate > 0 ? formatPct(churnRate) : 'N/A'}`)
}

main().catch((err) => {
  console.error('Failed to generate dashboard:', err.message)
  process.exit(1)
})
