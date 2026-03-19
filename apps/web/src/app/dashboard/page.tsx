'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

interface DimensionScore {
  normalized: number
  raw?: number
  responseCount?: number
}

interface JournalEntry {
  id: string
  body: string
  prompt: string | null
  profileId: string | null
  tags: string[]
  createdAt: string
}

interface SessionSummary {
  id: string
  title: string | null
  templateType: string
  templateTitle: string | null
  completedAt: string | null
  createdAt: string
  profile: {
    id: string
    summary: string
    archetypes: string[]
    dimensions: Record<string, DimensionScore>
    generatedAt: string
  } | null
  deltas: Record<string, number> | null
  deltaObservation: string | null
}

const DIMENSION_LABELS: Record<string, string> = {
  openness: 'Openness',
  conscientiousness: 'Conscientiousness',
  extraversion: 'Extraversion',
  agreeableness: 'Agreeableness',
  neuroticism: 'Neuroticism',
  achievement: 'Achievement',
  benevolence: 'Benevolence',
  conformity: 'Conformity',
  hedonism: 'Hedonism',
  power: 'Power',
  security: 'Security',
  self_direction: 'Self-Direction',
  stimulation: 'Stimulation',
  universalism: 'Universalism',
}

// Distinct colors for chart lines
const DIM_COLORS = [
  '#f59e0b', // amber
  '#60a5fa', // blue
  '#34d399', // emerald
  '#f87171', // red
  '#a78bfa', // violet
  '#fb923c', // orange
  '#38bdf8', // sky
  '#4ade80', // green
  '#e879f9', // fuchsia
]

function DeltaBadge({ dim, value }: { dim: string; value: number }) {
  const label = DIMENSION_LABELS[dim.toLowerCase()] ?? dim
  const positive = value > 0
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${
        positive
          ? 'bg-emerald-500/10 text-emerald-400'
          : 'bg-rose-500/10 text-rose-400'
      }`}
    >
      {positive ? '↑' : '↓'} {label.slice(0, 4)} {positive ? '+' : ''}{value}
    </span>
  )
}

interface ChartSession {
  label: string
  scores: Record<string, number>
}

function ScoreTrendChart({ sessions }: { sessions: ChartSession[] }) {
  if (sessions.length < 2) return null

  const dims = Object.keys(sessions[0].scores)
  const W = 480
  const H = 180
  const PAD_LEFT = 36
  const PAD_RIGHT = 16
  const PAD_TOP = 12
  const PAD_BOTTOM = 28
  const plotW = W - PAD_LEFT - PAD_RIGHT
  const plotH = H - PAD_TOP - PAD_BOTTOM

  const xPos = (i: number) =>
    PAD_LEFT + (i / (sessions.length - 1)) * plotW

  const yPos = (score: number) =>
    PAD_TOP + (1 - score / 100) * plotH

  const yTicks = [0, 25, 50, 75, 100]

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ maxHeight: 180 }}
      aria-label="Score trend chart"
    >
      {/* Grid lines */}
      {yTicks.map((v) => (
        <g key={v}>
          <line
            x1={PAD_LEFT}
            x2={W - PAD_RIGHT}
            y1={yPos(v)}
            y2={yPos(v)}
            stroke="#292524"
            strokeWidth={1}
          />
          <text
            x={PAD_LEFT - 5}
            y={yPos(v) + 4}
            textAnchor="end"
            fontSize={9}
            fill="#78716c"
          >
            {v}
          </text>
        </g>
      ))}

      {/* X-axis labels */}
      {sessions.map((s, i) => (
        <text
          key={i}
          x={xPos(i)}
          y={H - 6}
          textAnchor="middle"
          fontSize={9}
          fill="#78716c"
        >
          {s.label}
        </text>
      ))}

      {/* Dimension lines */}
      {dims.map((dim, di) => {
        const color = DIM_COLORS[di % DIM_COLORS.length]
        const points = sessions.map((s, i) => `${xPos(i)},${yPos(s.scores[dim] ?? 0)}`).join(' ')
        return (
          <g key={dim}>
            <polyline
              points={points}
              fill="none"
              stroke={color}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity={0.85}
            />
            {sessions.map((s, i) => (
              <circle
                key={i}
                cx={xPos(i)}
                cy={yPos(s.scores[dim] ?? 0)}
                r={3}
                fill={color}
                opacity={0.9}
              />
            ))}
          </g>
        )
      })}
    </svg>
  )
}

function ChartLegend({ dimensions }: { dimensions: string[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
      {dimensions.map((dim, i) => (
        <span key={dim} className="flex items-center gap-1.5 text-xs text-stone-400">
          <span
            className="inline-block h-2 w-4 rounded-full"
            style={{ backgroundColor: DIM_COLORS[i % DIM_COLORS.length] }}
          />
          {DIMENSION_LABELS[dim.toLowerCase()] ?? dim}
        </span>
      ))}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function downloadProfilePDF(profileId: string, token: string, archetypes: string[]) {
  const [{ pdf }, { ProfileDocument }, { api }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('@/components/ProfilePDF'),
    import('@/lib/api'),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profileData, journalData, synthesisData] = await Promise.all([
    api.get<{ profile: Record<string, unknown> }>(`/api/profiles/${profileId}`, token),
    api.get<{ entries: Array<{ id: string; body: string; prompt: string | null; profileId: string | null; createdAt: string }> }>('/api/users/me/journal', token).catch(() => ({ entries: [] as Array<{ id: string; body: string; prompt: string | null; profileId: string | null; createdAt: string }> })),
    api.get<{ synthesis: string; generatedAt: string }>('/api/users/me/synthesis', token).catch(() => null),
  ])

  const profileEntries = journalData.entries.filter((e) => e.profileId === profileId)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile = profileData.profile as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc = (ProfileDocument as any)({ profile, synthesis: synthesisData?.synthesis ?? null, journalEntries: profileEntries })
  const blob = await pdf(doc as React.ReactElement).toBlob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const slug = archetypes[0] ? archetypes[0].toLowerCase().replace(/\s+/g, '-') : 'profile'
  a.download = `innermind-${slug}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}

export default function DashboardPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [downloadingPDF, setDownloadingPDF] = useState<string | null>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }

    Promise.all([
      api.get<{ sessions: SessionSummary[] }>('/api/users/me/sessions', token),
      api.get<{ entries: JournalEntry[] }>('/api/users/me/journal', token).catch(() => ({ entries: [] as JournalEntry[] })),
    ])
      .then(([sessionData, journalData]) => {
        setSessions(sessionData.sessions)
        setJournalEntries(journalData.entries)
      })
      .catch(() => router.push('/auth/login'))
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" />
      </div>
    )
  }

  const latestProfile = sessions.find((s) => s.profile)?.profile ?? null

  // Build per-template chart data (sessions oldest-first)
  const chartsByTemplate = new Map<string, ChartSession[]>()
  for (const session of [...sessions].reverse()) {
    if (!session.profile?.dimensions) continue
    const key = session.templateType
    if (!chartsByTemplate.has(key)) chartsByTemplate.set(key, [])
    const dateLabel = session.completedAt
      ? new Date(session.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : '?'
    const scores: Record<string, number> = {}
    for (const [dim, val] of Object.entries(session.profile.dimensions)) {
      scores[dim] = Math.round(val.normalized * 100) / 100
    }
    chartsByTemplate.get(key)!.push({ label: dateLabel, scores })
  }

  // Templates that have 2+ sessions (can show chart)
  const chartsToShow: Array<{ templateType: string; templateTitle: string; chartSessions: ChartSession[] }> = []
  for (const session of sessions) {
    const key = session.templateType
    const chartSessions = chartsByTemplate.get(key)
    if (chartSessions && chartSessions.length >= 2 && !chartsToShow.find((c) => c.templateType === key)) {
      chartsToShow.push({
        templateType: key,
        templateTitle: session.templateTitle ?? key,
        chartSessions,
      })
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="font-serif text-3xl text-stone-100">Your journey</h1>
        <Link
          href="/assessment"
          className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
        >
          New assessment
        </Link>
      </div>

      {/* Latest profile card */}
      {latestProfile && (
        <div className="mb-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-2xl">◎</span>
            <h2 className="font-serif text-xl text-stone-100">Current profile</h2>
          </div>
          <p className="mb-4 text-stone-400 leading-relaxed">{latestProfile.summary}</p>
          {latestProfile.archetypes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {latestProfile.archetypes.map((a) => (
                <span
                  key={a}
                  className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-300"
                >
                  {a}
                </span>
              ))}
            </div>
          )}
          <Link
            href={`/profile/${latestProfile.id}`}
            className="mt-4 inline-block text-sm text-amber-400 hover:text-amber-300"
          >
            View full profile →
          </Link>
        </div>
      )}

      {/* Score trend charts — one per framework with 2+ sessions */}
      {chartsToShow.length > 0 && (
        <div className="mb-8 space-y-6">
          <h2 className="font-serif text-xl text-stone-200">Score trends</h2>
          {chartsToShow.map(({ templateType, templateTitle, chartSessions }) => {
            const dims = Object.keys(chartSessions[0].scores)
            return (
              <div
                key={templateType}
                className="rounded-2xl border border-stone-800 bg-stone-900/50 p-5"
              >
                <p className="mb-3 text-sm font-medium text-stone-300">{templateTitle}</p>
                <ScoreTrendChart sessions={chartSessions} />
                <ChartLegend dimensions={dims} />
              </div>
            )
          })}
        </div>
      )}

      {/* Journal entries */}
      {journalEntries.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 font-serif text-xl text-stone-200">Your reflections</h2>
          <div className="space-y-3">
            {journalEntries.slice(0, 5).map((entry) => {
              const linkedSession = entry.profileId
                ? sessions.find((s) => s.profile?.id === entry.profileId)
                : null
              return (
                <div
                  key={entry.id}
                  className="rounded-xl border border-stone-800 bg-stone-900/50 px-5 py-4"
                >
                  {entry.prompt && (
                    <p className="mb-1.5 text-xs text-amber-400/70 italic">&ldquo;{entry.prompt}&rdquo;</p>
                  )}
                  <p className="text-sm text-stone-300 leading-relaxed line-clamp-3">{entry.body}</p>
                  <div className="mt-2 flex items-center justify-between gap-4">
                    <p className="text-xs text-stone-600">
                      {new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {linkedSession && (
                        <span className="ml-2 text-stone-700">· {linkedSession.templateTitle ?? 'Assessment'}</span>
                      )}
                    </p>
                    {entry.profileId && (
                      <Link href={`/profile/${entry.profileId}`} className="text-xs text-stone-500 hover:text-stone-300">
                        View profile →
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Session history */}
      <div>
        <h2 className="mb-4 font-serif text-xl text-stone-200">Assessment history</h2>

        {sessions.length === 0 ? (
          <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-12 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
              <span className="text-2xl">◎</span>
            </div>
            <h3 className="mb-2 font-serif text-xl text-stone-200">Start your self-discovery</h3>
            <p className="mb-6 text-stone-400">
              Your completed assessments will appear here. Take your first to build your
              psychological profile.
            </p>
            <Link
              href="/assessment"
              className="inline-block rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
            >
              Take your first assessment →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="rounded-xl border border-stone-800 bg-stone-900/50 px-5 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2 flex-wrap">
                      <p className="text-stone-200 font-medium">
                        {session.templateTitle ?? session.title ?? 'Assessment session'}
                      </p>
                      {session.profile?.archetypes?.[0] && (
                        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs text-amber-300">
                          {session.profile.archetypes[0]}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500">
                      {session.completedAt
                        ? new Date(session.completedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : new Date(session.createdAt).toLocaleDateString()}
                    </p>
                    {/* Delta badges vs previous session for same template */}
                    {session.deltas && Object.keys(session.deltas).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {Object.entries(session.deltas).map(([dim, delta]) => (
                          <DeltaBadge key={dim} dim={dim} value={delta} />
                        ))}
                      </div>
                    )}
                    {/* Claude-generated delta observation */}
                    {session.deltaObservation && (
                      <p className="mt-2 text-xs text-stone-400 italic leading-relaxed">
                        {session.deltaObservation}
                      </p>
                    )}
                  </div>
                  {session.profile && (
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <Link
                        href={`/profile/${session.profile.id}`}
                        className="text-xs text-stone-400 hover:text-stone-200"
                      >
                        View results →
                      </Link>
                      <button
                        onClick={async () => {
                          const token = getToken()
                          if (!token || !session.profile) return
                          setDownloadingPDF(session.profile.id)
                          try {
                            await downloadProfilePDF(session.profile.id, token, session.profile.archetypes ?? [])
                          } finally {
                            setDownloadingPDF(null)
                          }
                        }}
                        disabled={downloadingPDF === session.profile.id}
                        className="text-xs text-stone-500 hover:text-stone-300 disabled:opacity-40"
                      >
                        {downloadingPDF === session.profile.id ? 'Generating…' : '↓ PDF'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
