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

export default async function AdminPage() {
  const metrics = await fetchMetrics()

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

      {/* Metric cards */}
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
