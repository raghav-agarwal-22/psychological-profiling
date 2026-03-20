import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin — Innermind',
  robots: 'noindex',
}

interface AssessmentBreakdown {
  type: string
  count: number
}

interface RecentUser {
  id: string
  email: string
  createdAt: string
}

interface Metrics {
  totals: {
    users: number
    completedSessions: number
    completedAssessments: number
    profiles: number
    coachConversations: number
  }
  assessmentsByType: AssessmentBreakdown[]
  recentUsers: RecentUser[]
  signupsLast30Days: { createdAt: string; _count: { id: number } }[]
}

interface AtRiskSubscriber {
  id: string
  email: string
  expiresAt: string
}

interface FunnelStep {
  label: string
  count: number
  dropoffRate: number
  conversionFromPrev: number
}

interface FunnelMetrics {
  steps: FunnelStep[]
  overallConversion: number
  currentlyTrialing: number
}

interface RevenueMetrics {
  mrr: number
  arr: number
  subscriptionDistribution: {
    pro: number
    free: number
    total: number
    proPercent: number
  }
  conversionRate: number
  newUsersLast30Days: number
  newProLast30Days: number
  monthlyChurnRate: number
  cancelledLast30Days: number
  estimatedLtv: number
  atRiskSubscribers: AtRiskSubscriber[]
  stripeDataAvailable: boolean
  utmAttribution: { source: string; count: number }[]
  mrrTimeline: { date: string; mrr: number }[]
  daysSinceLaunch: number | null
  firstPaidAt: string | null
}

async function fetchMetrics(): Promise<Metrics | null> {
  const apiUrl = process.env.API_URL ?? 'http://localhost:3001'
  const adminSecret = process.env.ADMIN_SECRET ?? 'admin-dev-secret'
  try {
    const res = await fetch(`${apiUrl}/api/admin/metrics`, {
      headers: { Authorization: `Bearer ${adminSecret}` },
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function fetchFunnel(): Promise<FunnelMetrics | null> {
  const apiUrl = process.env.API_URL ?? 'http://localhost:3001'
  const adminSecret = process.env.ADMIN_SECRET ?? 'admin-dev-secret'
  try {
    const res = await fetch(`${apiUrl}/api/admin/funnel`, {
      headers: { Authorization: `Bearer ${adminSecret}` },
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function fetchRevenue(): Promise<RevenueMetrics | null> {
  const apiUrl = process.env.API_URL ?? 'http://localhost:3001'
  const adminSecret = process.env.ADMIN_SECRET ?? 'admin-dev-secret'
  try {
    const res = await fetch(`${apiUrl}/api/admin/revenue`, {
      headers: { Authorization: `Bearer ${adminSecret}` },
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

function MetricCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 text-center">
      <p className="text-3xl font-light text-stone-100">{value.toLocaleString()}</p>
      <p className="mt-1 text-sm text-stone-500">{label}</p>
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatAssessmentType(type: string) {
  return type
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function formatCurrency(value: number) {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`
  }
  return `$${value.toFixed(0)}`
}

// $100k ARR goal milestones
const ARR_MILESTONES = [
  { label: 'Month 1', mrrTarget: 1330, userTarget: 70 },
  { label: 'Month 2', mrrTarget: 4750, userTarget: 250 },
  { label: 'Month 3 — $100k ARR', mrrTarget: 8333, userTarget: 440 },
]
const ARR_GOAL = 100_000

function ArrGoalTracker({ revenue }: { revenue: RevenueMetrics }) {
  const currentArr = revenue.arr
  const currentMrr = revenue.mrr
  const proUsers = revenue.subscriptionDistribution.pro
  const progressPct = Math.min(Math.round((currentArr / ARR_GOAL) * 1000) / 10, 100)

  return (
    <div className="mb-12">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="font-serif text-xl text-stone-200">$100k ARR Goal</h2>
        <span className="rounded-full border border-emerald-800/40 bg-emerald-950/30 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-emerald-500/80">
          {progressPct}% there
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-3xl font-light text-emerald-400">${currentArr.toLocaleString()}</p>
            <p className="mt-1 text-sm text-stone-500">Current ARR</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-light text-stone-400">${ARR_GOAL.toLocaleString()}</p>
            <p className="mt-1 text-sm text-stone-500">Goal</p>
          </div>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-stone-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-stone-600">
          <span>$0</span>
          <span>$25k</span>
          <span>$50k</span>
          <span>$75k</span>
          <span>$100k</span>
        </div>
      </div>

      {/* Monthly milestones */}
      <div className="grid gap-4 sm:grid-cols-3">
        {ARR_MILESTONES.map((m, i) => {
          const mrrHit = currentMrr >= m.mrrTarget
          const usersHit = proUsers >= m.userTarget
          const done = mrrHit && usersHit
          const mrrPct = Math.min(Math.round((currentMrr / m.mrrTarget) * 100), 100)
          const usersPct = Math.min(Math.round((proUsers / m.userTarget) * 100), 100)
          return (
            <div
              key={i}
              className={`rounded-2xl border p-5 ${done ? 'border-emerald-800/40 bg-emerald-950/20' : 'border-stone-800 bg-stone-900/50'}`}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className={`text-sm font-medium ${done ? 'text-emerald-400' : 'text-stone-300'}`}>
                  {m.label}
                </p>
                {done && (
                  <span className="text-xs text-emerald-500">✓ Hit</span>
                )}
              </div>
              <div className="space-y-2">
                <div>
                  <div className="mb-1 flex justify-between text-xs text-stone-500">
                    <span>MRR</span>
                    <span className="tabular-nums">
                      {formatCurrency(currentMrr)} / {formatCurrency(m.mrrTarget)}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-stone-800">
                    <div
                      className={`h-full rounded-full ${mrrHit ? 'bg-emerald-500' : 'bg-indigo-500/70'}`}
                      style={{ width: `${mrrPct}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs text-stone-500">
                    <span>Pro users</span>
                    <span className="tabular-nums">
                      {proUsers} / {m.userTarget}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-stone-800">
                    <div
                      className={`h-full rounded-full ${usersHit ? 'bg-emerald-500' : 'bg-indigo-500/70'}`}
                      style={{ width: `${usersPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Required growth callout */}
      {currentArr < ARR_GOAL && (
        <div className="mt-4 rounded-xl border border-amber-900/30 bg-amber-950/20 px-5 py-4">
          <p className="text-sm text-amber-400/80">
            Need <strong className="text-amber-300">{440 - proUsers} more Pro users</strong> to reach
            $100k ARR run rate. Free→Pro conversion target: <strong className="text-amber-300">&gt;5%</strong>.
            Churn target: <strong className="text-amber-300">&lt;5%/mo</strong>.
          </p>
        </div>
      )}
    </div>
  )
}

export default async function AdminPage() {
  const [metrics, revenue, funnel] = await Promise.all([fetchMetrics(), fetchRevenue(), fetchFunnel()])

  if (!metrics) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-8 text-center">
          <p className="text-lg text-red-400">Failed to load metrics.</p>
          <p className="mt-2 text-sm text-stone-500">
            Check that the API is running and ADMIN_SECRET is configured correctly.
          </p>
        </div>
      </div>
    )
  }

  const { totals, assessmentsByType, recentUsers } = metrics

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Page header */}
      <div className="mb-10">
        <p className="text-[10px] uppercase tracking-widest text-amber-500/70">Internal</p>
        <h1 className="mt-1 font-serif text-4xl font-medium text-stone-100">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-stone-500">
          Live metrics — refreshes every 60 seconds via ISR.
        </p>
      </div>

      {/* ARR Goal Tracker */}
      {revenue && <ArrGoalTracker revenue={revenue} />}

      {/* Revenue section */}
      {revenue && (
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="font-serif text-xl text-stone-200">Revenue</h2>
            {!revenue.stripeDataAvailable && (
              <span className="rounded-full border border-amber-800/40 bg-amber-950/30 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-amber-500/70">
                DB estimates — Stripe not configured
              </span>
            )}
          </div>

          {/* Key revenue metrics */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 text-center">
              <p className="text-3xl font-light text-emerald-400">{formatCurrency(revenue.mrr)}</p>
              <p className="mt-1 text-sm text-stone-500">MRR</p>
            </div>
            <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 text-center">
              <p className="text-3xl font-light text-emerald-400">{formatCurrency(revenue.arr)}</p>
              <p className="mt-1 text-sm text-stone-500">ARR</p>
            </div>
            <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 text-center">
              <p className="text-3xl font-light text-stone-100">{formatCurrency(revenue.estimatedLtv)}</p>
              <p className="mt-1 text-sm text-stone-500">Est. LTV</p>
            </div>
            <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 text-center">
              <p className="text-3xl font-light text-stone-100">{revenue.monthlyChurnRate}%</p>
              <p className="mt-1 text-sm text-stone-500">Monthly Churn</p>
            </div>
          </div>

          {/* Subscription distribution + conversion */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Plan distribution */}
            <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
              <p className="mb-4 text-sm font-medium text-stone-400">Plan Distribution</p>
              <div className="space-y-3">
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-stone-300">Pro</span>
                    <span className="tabular-nums text-stone-100">
                      {revenue.subscriptionDistribution.pro} ({revenue.subscriptionDistribution.proPercent}%)
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-stone-800">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${revenue.subscriptionDistribution.proPercent}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-stone-300">Free</span>
                    <span className="tabular-nums text-stone-100">
                      {revenue.subscriptionDistribution.free} ({100 - revenue.subscriptionDistribution.proPercent}%)
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-stone-800">
                    <div
                      className="h-full rounded-full bg-stone-600"
                      style={{ width: `${100 - revenue.subscriptionDistribution.proPercent}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 border-t border-stone-800 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">New users (30d)</span>
                  <span className="tabular-nums text-stone-300">{revenue.newUsersLast30Days}</span>
                </div>
                <div className="mt-1 flex justify-between text-sm">
                  <span className="text-stone-500">New pro (30d)</span>
                  <span className="tabular-nums text-stone-300">{revenue.newProLast30Days}</span>
                </div>
                <div className="mt-1 flex justify-between text-sm">
                  <span className="text-stone-500">Free→Pro conversion</span>
                  <span className="tabular-nums text-stone-300">{revenue.conversionRate}%</span>
                </div>
              </div>
            </div>

            {/* At-risk subscribers */}
            <div className="lg:col-span-2 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
              <p className="mb-4 text-sm font-medium text-stone-400">
                At-Risk Subscribers
                <span className="ml-2 text-stone-500 font-normal">(renewing within 7 days)</span>
              </p>
              {revenue.atRiskSubscribers.length === 0 ? (
                <p className="text-sm text-stone-500">No subscribers expiring soon.</p>
              ) : (
                <ul className="divide-y divide-stone-800/60">
                  {revenue.atRiskSubscribers.map((sub) => (
                    <li key={sub.id} className="flex items-center justify-between py-2.5">
                      <span className="truncate text-sm text-stone-300">{sub.email}</span>
                      <span className="ml-4 shrink-0 text-xs text-amber-500">
                        {new Date(sub.expiresAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MRR Timeline + UTM Attribution */}
      {revenue && (revenue.mrrTimeline.length > 0 || revenue.utmAttribution.length > 0) && (
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="font-serif text-xl text-stone-200">Revenue Attribution</h2>
            {revenue.daysSinceLaunch !== null && (
              <span className="rounded-full border border-stone-700 bg-stone-800/50 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-stone-400">
                Day {revenue.daysSinceLaunch} since first payment
              </span>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* MRR Timeline */}
            {revenue.mrrTimeline.length > 0 && (
              <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
                <p className="mb-4 text-sm font-medium text-stone-400">MRR Growth (days since launch)</p>
                <div className="space-y-1.5">
                  {revenue.mrrTimeline.map((point, i) => {
                    const maxMrr = revenue.mrrTimeline[revenue.mrrTimeline.length - 1]?.mrr ?? 1
                    const barWidth = maxMrr > 0 ? (point.mrr / maxMrr) * 100 : 0
                    const dayNum = revenue.firstPaidAt
                      ? Math.floor((new Date(point.date).getTime() - new Date(revenue.firstPaidAt).getTime()) / (1000 * 60 * 60 * 24))
                      : i
                    return (
                      <div key={point.date} className="flex items-center gap-2">
                        <span className="w-12 shrink-0 text-right text-[10px] tabular-nums text-stone-500">
                          D{dayNum}
                        </span>
                        <div className="flex-1 overflow-hidden rounded-full bg-stone-800 h-1.5">
                          <div
                            className="h-full rounded-full bg-emerald-500/70"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                        <span className="w-14 shrink-0 text-right text-[10px] tabular-nums text-emerald-400">
                          ${point.mrr}/mo
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* UTM Attribution */}
            {revenue.utmAttribution.length > 0 && (
              <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
                <p className="mb-4 text-sm font-medium text-stone-400">Acquisition Channel (paid users)</p>
                <div className="space-y-3">
                  {revenue.utmAttribution.map((row) => {
                    const total = revenue.utmAttribution.reduce((s, r) => s + r.count, 0)
                    const pct = total > 0 ? Math.round((row.count / total) * 100) : 0
                    return (
                      <div key={row.source}>
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="text-stone-300">{row.source}</span>
                          <span className="tabular-nums text-stone-100">
                            {row.count} <span className="text-stone-500">({pct}%)</span>
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-stone-800">
                          <div
                            className="h-full rounded-full bg-indigo-500/70"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Conversion Funnel */}
      {funnel && (
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="font-serif text-xl text-stone-200">Conversion Funnel</h2>
            <span className="rounded-full border border-stone-700 bg-stone-800/50 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-stone-400">
              Overall {funnel.overallConversion}% free→pro
            </span>
          </div>
          <div className="overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/50">
            <div className="divide-y divide-stone-800/60">
              {funnel.steps.map((step, i) => {
                const maxCount = funnel.steps[0]?.count ?? 1
                const barWidth = maxCount > 0 ? (step.count / maxCount) * 100 : 0
                const isLast = i === funnel.steps.length - 1
                return (
                  <div key={step.label} className="px-5 py-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-800 text-[10px] font-medium text-stone-400">
                          {i + 1}
                        </span>
                        <span className="text-sm text-stone-300">{step.label}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm tabular-nums">
                        <span className="text-stone-100">{step.count.toLocaleString()}</span>
                        {i > 0 && (
                          <span className={`text-xs ${step.conversionFromPrev >= 50 ? 'text-emerald-500' : step.conversionFromPrev >= 20 ? 'text-amber-500' : 'text-red-500'}`}>
                            {step.conversionFromPrev}% from prev
                          </span>
                        )}
                        {!isLast && step.dropoffRate > 0 && (
                          <span className="text-xs text-stone-500">
                            -{step.dropoffRate}% drop
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-stone-800">
                      <div
                        className={`h-full rounded-full transition-all ${isLast ? 'bg-emerald-500' : 'bg-indigo-500/70'}`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Trial Funnel Summary */}
      {funnel && (() => {
        const trialStep = funnel.steps.find((s) => s.label === 'Started trial')
        const convertedStep = funnel.steps.find((s) => s.label === 'Converted to paid')
        const trialConversionRate = trialStep && convertedStep && trialStep.count > 0
          ? Math.round((convertedStep.count / trialStep.count) * 1000) / 10
          : 0
        const trialConversionTarget = 30
        return (
          <div className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <h2 className="font-serif text-xl text-stone-200">Trial Funnel</h2>
              <span className={`rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${trialConversionRate >= trialConversionTarget ? 'border-emerald-800/40 bg-emerald-950/30 text-emerald-500/80' : trialConversionRate >= 15 ? 'border-amber-800/40 bg-amber-950/30 text-amber-500/80' : 'border-red-800/40 bg-red-950/30 text-red-500/80'}`}>
                Target: {trialConversionTarget}% trial→paid
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 text-center">
                <p className="text-3xl font-light text-stone-100">{trialStep?.count ?? 0}</p>
                <p className="mt-1 text-sm text-stone-500">Trials started (all time)</p>
              </div>
              <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 text-center">
                <p className="text-3xl font-light text-amber-400">{funnel.currentlyTrialing}</p>
                <p className="mt-1 text-sm text-stone-500">Currently trialing</p>
              </div>
              <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 text-center">
                <p className="text-3xl font-light text-emerald-400">{convertedStep?.count ?? 0}</p>
                <p className="mt-1 text-sm text-stone-500">Converted to paid</p>
              </div>
              <div className={`rounded-2xl border p-6 text-center ${trialConversionRate >= trialConversionTarget ? 'border-emerald-800/40 bg-emerald-950/10' : trialConversionRate >= 15 ? 'border-amber-800/40 bg-amber-950/10' : 'border-red-800/40 bg-red-950/10'}`}>
                <p className={`text-3xl font-light ${trialConversionRate >= trialConversionTarget ? 'text-emerald-400' : trialConversionRate >= 15 ? 'text-amber-400' : 'text-red-400'}`}>
                  {trialConversionRate}%
                </p>
                <p className="mt-1 text-sm text-stone-500">Trial→paid conversion</p>
                {trialConversionRate < 15 && (
                  <p className="mt-2 text-xs text-red-400/70">Below 15% threshold — escalate</p>
                )}
              </div>
            </div>
          </div>
        )
      })()}

      {/* Metric cards */}
      <div className="mb-4">
        <h2 className="font-serif text-xl text-stone-200">Usage</h2>
      </div>
      <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <MetricCard value={totals.users} label="Total Users" />
        <MetricCard value={totals.completedSessions} label="Completed Sessions" />
        <MetricCard value={totals.completedAssessments} label="Completed Assessments" />
        <MetricCard value={totals.profiles} label="Profiles Generated" />
        <MetricCard value={totals.coachConversations} label="Coach Conversations" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Assessment breakdown */}
        <div>
          <h2 className="mb-4 font-serif text-xl text-stone-200">Assessment Breakdown</h2>
          <div className="overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/50">
            {assessmentsByType.length === 0 ? (
              <p className="p-6 text-sm text-stone-500">No completed assessments yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-800">
                    <th className="px-5 py-3 text-left font-medium text-stone-400">Type</th>
                    <th className="px-5 py-3 text-right font-medium text-stone-400">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {assessmentsByType.map((row, i) => (
                    <tr
                      key={row.type}
                      className={i < assessmentsByType.length - 1 ? 'border-b border-stone-800/60' : ''}
                    >
                      <td className="px-5 py-3 text-stone-300">{formatAssessmentType(row.type)}</td>
                      <td className="px-5 py-3 text-right tabular-nums text-stone-100">
                        {row.count.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Affiliate program */}
        <div>
          <h2 className="mb-4 font-serif text-xl text-stone-200">Affiliate Program</h2>
          <a
            href="/admin/affiliates"
            className="flex items-center justify-between rounded-2xl border border-stone-800 bg-stone-900/50 px-5 py-4 transition-colors hover:border-stone-600"
          >
            <div>
              <p className="text-sm font-semibold text-stone-200">Manage affiliate applications</p>
              <p className="mt-0.5 text-xs text-stone-500">Review applications, approve partners, and manage commissions</p>
            </div>
            <span className="text-stone-500">→</span>
          </a>
        </div>

        {/* Recent signups */}
        <div>
          <h2 className="mb-4 font-serif text-xl text-stone-200">Recent Signups</h2>
          <div className="overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/50">
            {recentUsers.length === 0 ? (
              <p className="p-6 text-sm text-stone-500">No users yet.</p>
            ) : (
              <ul className="divide-y divide-stone-800/60">
                {recentUsers.map((user) => (
                  <li key={user.id} className="flex items-center justify-between px-5 py-3">
                    <span className="truncate text-sm text-stone-300">{user.email}</span>
                    <span className="ml-4 shrink-0 text-xs text-stone-500">
                      {formatDate(user.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
