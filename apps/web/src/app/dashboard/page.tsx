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
  contextTags?: string[]
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

interface GrowthRecommendation {
  title: string
  description: string
  category: 'relationships' | 'career' | 'emotional' | 'self-awareness' | 'wellbeing'
  scoreBasis: string
  actionStep: string
}

interface NudgeEntry {
  frameworkType: string
  frameworkTitle: string
  daysSince: number
  lastAssessedAt: string
  nudgeActive: boolean
}

interface NudgeStatus {
  nudges: NudgeEntry[]
  hasActiveNudge: boolean
}

interface DailyPromptData {
  id: string
  prompt: string
  response: string | null
  date: string
}

const LIFE_PHASE_TAGS = [
  'New relationship',
  'Career transition',
  'Grief',
  'Personal growth',
  'Post-therapy',
  'Life change',
  'Stress period',
  'Recovery',
]

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

  // Reassessment nudge state
  const [nudgeStatus, setNudgeStatus] = useState<NudgeStatus | null>(null)
  const [nudgeDismissed, setNudgeDismissed] = useState(false)

  // Daily prompt state
  const [dailyPrompt, setDailyPrompt] = useState<DailyPromptData | null>(null)
  const [dailyPromptDismissed, setDailyPromptDismissed] = useState(false)
  const [dailyPromptResponse, setDailyPromptResponse] = useState('')
  const [dailyPromptSubmitting, setDailyPromptSubmitting] = useState(false)
  const [dailyPromptSubmitted, setDailyPromptSubmitted] = useState(false)

  // Growth recommendations state
  const [recommendations, setRecommendations] = useState<GrowthRecommendation[] | null>(null)
  const [recommendationsLoading, setRecommendationsLoading] = useState(false)
  const [recommendationsError, setRecommendationsError] = useState<string | null>(null)

  // Email digest preferences state
  const [digestOptIn, setDigestOptIn] = useState<boolean>(true)
  const [digestToggling, setDigestToggling] = useState(false)

  // Onboarding welcome modal
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem('innermind_onboarding_seen')
    if (!seen) setShowWelcome(true)
  }, [])

  function dismissWelcome() {
    localStorage.setItem('innermind_onboarding_seen', '1')
    setShowWelcome(false)
  }

  // Context tags state: which session has the tag picker open
  const [tagPickerOpenFor, setTagPickerOpenFor] = useState<string | null>(null)
  const [sessionTags, setSessionTags] = useState<Record<string, string[]>>({})
  const [savingTagsFor, setSavingTagsFor] = useState<string | null>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }

    Promise.all([
      api.get<{ sessions: SessionSummary[] }>('/api/users/me/sessions', token),
      api.get<{ entries: JournalEntry[] }>('/api/users/me/journal', token).catch(() => ({ entries: [] as JournalEntry[] })),
      api.get<NudgeStatus>('/api/users/me/reassessment-status', token).catch(() => null),
      api.get<DailyPromptData>('/api/users/me/daily-prompt', token).catch(() => null),
      api.get<{ emailDigestOptIn: boolean }>('/api/users/me/digest-preferences', token).catch(() => null),
    ])
      .then(([sessionData, journalData, nudgeData, promptData, digestPrefs]) => {
        setSessions(sessionData.sessions)
        setJournalEntries(journalData.entries)
        if (nudgeData) setNudgeStatus(nudgeData)
        if (promptData) {
          setDailyPrompt(promptData)
          if (promptData.response) setDailyPromptSubmitted(true)
        }
        if (digestPrefs) setDigestOptIn(digestPrefs.emailDigestOptIn)
        // Seed local tags state from fetched sessions
        const tagsMap: Record<string, string[]> = {}
        for (const s of sessionData.sessions) {
          if (s.contextTags && s.contextTags.length > 0) {
            tagsMap[s.id] = s.contextTags
          }
        }
        setSessionTags(tagsMap)

        // Load cached recommendations; auto-generate on first visit
        api.get<{ recommendations: { recommendations: GrowthRecommendation[] }; generatedAt: string }>(
          '/api/users/me/recommendations', token
        )
          .then((d) => setRecommendations(d.recommendations.recommendations))
          .catch(() => {
            if (sessionData.sessions.length > 0) {
              setRecommendationsLoading(true)
              api.post<{ recommendations: { recommendations: GrowthRecommendation[] }; generatedAt: string }>(
                '/api/users/me/recommendations/generate', {}, token
              )
                .then((d) => setRecommendations(d.recommendations.recommendations))
                .catch((err) => setRecommendationsError(err instanceof Error ? err.message : 'Failed to generate'))
                .finally(() => setRecommendationsLoading(false))
            }
          })
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

  const handleToggleTag = async (sessionId: string, tag: string) => {
    const token = getToken()
    if (!token) return
    const current = sessionTags[sessionId] ?? []
    const updated = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag]
    setSessionTags((prev) => ({ ...prev, [sessionId]: updated }))
    setSavingTagsFor(sessionId)
    try {
      await api.patch(`/api/sessions/${sessionId}/tags`, { tags: updated }, token)
    } catch {
      // Revert on error
      setSessionTags((prev) => ({ ...prev, [sessionId]: current }))
    } finally {
      setSavingTagsFor(null)
    }
  }

  const handleRegenerateRecommendations = async () => {
    const token = getToken()
    if (!token) return
    setRecommendationsLoading(true)
    setRecommendationsError(null)
    try {
      const d = await api.post<{ recommendations: { recommendations: GrowthRecommendation[] }; generatedAt: string }>(
        '/api/users/me/recommendations/generate', {}, token
      )
      setRecommendations(d.recommendations.recommendations)
    } catch (err) {
      setRecommendationsError(err instanceof Error ? err.message : 'Failed to regenerate')
    } finally {
      setRecommendationsLoading(false)
    }
  }

  const handleDailyPromptSubmit = async () => {
    if (!dailyPrompt || !dailyPromptResponse.trim()) return
    const token = getToken()
    if (!token) return
    setDailyPromptSubmitting(true)
    try {
      await api.post('/api/users/me/daily-prompt/respond', {
        promptId: dailyPrompt.id,
        response: dailyPromptResponse.trim(),
      }, token)
      setDailyPromptSubmitted(true)
      setDailyPrompt((prev) => prev ? { ...prev, response: dailyPromptResponse.trim() } : prev)
    } catch {
      // silently fail
    } finally {
      setDailyPromptSubmitting(false)
    }
  }

  const handleToggleDigest = async () => {
    const token = getToken()
    if (!token || digestToggling) return
    const next = !digestOptIn
    setDigestOptIn(next)
    setDigestToggling(true)
    try {
      await api.patch('/api/users/me/digest-preferences', { emailDigestOptIn: next }, token)
    } catch {
      // Revert on error
      setDigestOptIn(!next)
    } finally {
      setDigestToggling(false)
    }
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

  const CORE_FRAMEWORKS = [
    { type: 'BIG_FIVE', shortName: 'Personality', icon: '◎' },
    { type: 'VALUES_INVENTORY', shortName: 'Values', icon: '◈' },
    { type: 'ATTACHMENT_STYLE', shortName: 'Attachment', icon: '◉' },
  ] as const

  const completedTypes = new Set(
    sessions
      .filter((s) => s.completedAt)
      .map((s) => s.templateType),
  )
  const completedFrameworks = CORE_FRAMEWORKS.filter((f) => completedTypes.has(f.type)).length

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Onboarding welcome modal */}
      {showWelcome && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-modal-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={dismissWelcome}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-stone-700 bg-stone-950 p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-6 text-center">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10">
                <span className="text-2xl">◎</span>
              </div>
              <h2
                id="welcome-modal-title"
                className="mb-2 font-serif text-3xl text-stone-100"
              >
                Welcome to Innermind
              </h2>
              <p className="text-sm text-stone-400">
                Your journey toward self-understanding starts here.
              </p>
            </div>

            {/* Step cards */}
            <div className="mb-7 grid grid-cols-3 gap-3">
              {[
                {
                  icon: '◎',
                  name: 'Big Five Personality',
                  desc: 'Map your core traits across openness, conscientiousness, and more.',
                },
                {
                  icon: '◈',
                  name: 'Schwartz Values',
                  desc: 'Discover the values that drive your decisions and priorities.',
                },
                {
                  icon: '◉',
                  name: 'Attachment Style',
                  desc: 'Understand how you connect and bond in relationships.',
                },
              ].map((step) => (
                <div
                  key={step.name}
                  className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4 text-center"
                >
                  <div className="mb-2.5 text-2xl text-amber-400">{step.icon}</div>
                  <p className="mb-1.5 text-xs font-semibold text-stone-200 leading-snug">
                    {step.name}
                  </p>
                  <p className="text-[11px] text-stone-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                href="/assessment"
                onClick={dismissWelcome}
                className="inline-block rounded-xl bg-amber-500 px-7 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
              >
                Start my first assessment →
              </Link>
              <div className="mt-3">
                <button
                  onClick={dismissWelcome}
                  className="text-xs text-stone-600 transition-colors hover:text-stone-400"
                >
                  Skip for now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-10 flex items-center justify-between">
        <h1 className="font-serif text-3xl text-stone-100">Your journey</h1>
        <Link
          href="/assessment"
          className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
        >
          New assessment
        </Link>
      </div>

      {/* Daily reflection prompt */}
      {dailyPrompt && !dailyPromptDismissed && (
        <div className="mb-6 rounded-2xl border border-stone-700 bg-stone-900/60 p-5">
          <div className="mb-3 flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="text-lg text-amber-400 leading-none">✦</span>
              <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Today&apos;s reflection</p>
            </div>
            <button
              onClick={() => setDailyPromptDismissed(true)}
              aria-label="Dismiss"
              className="shrink-0 text-stone-600 transition-colors hover:text-stone-400"
            >
              ✕
            </button>
          </div>
          <p className="mb-4 text-sm font-medium text-stone-200 leading-relaxed italic">
            &ldquo;{dailyPrompt.prompt}&rdquo;
          </p>
          {dailyPromptSubmitted ? (
            <div className="rounded-xl border border-emerald-800/30 bg-emerald-950/20 px-4 py-3">
              <p className="text-sm text-emerald-400">
                ✓ Response saved to your journal.
              </p>
              {dailyPrompt.response && (
                <p className="mt-1 text-xs text-stone-400 italic leading-relaxed line-clamp-2">{dailyPrompt.response}</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <textarea
                value={dailyPromptResponse}
                onChange={(e) => setDailyPromptResponse(e.target.value)}
                placeholder="Write your reflection…"
                rows={3}
                className="w-full resize-none rounded-xl border border-stone-700 bg-stone-800/50 px-4 py-3 text-sm text-stone-200 placeholder-stone-600 outline-none transition-colors focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20"
              />
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setDailyPromptDismissed(true)}
                  className="text-xs text-stone-600 hover:text-stone-400"
                >
                  Skip for today
                </button>
                <button
                  onClick={handleDailyPromptSubmit}
                  disabled={!dailyPromptResponse.trim() || dailyPromptSubmitting}
                  className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-stone-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {dailyPromptSubmitting ? 'Saving…' : 'Save reflection'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Coach CTA */}
      {latestProfile && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-stone-800 bg-stone-900/50 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="text-lg text-amber-400 leading-none">◎</span>
            <div>
              <p className="text-sm font-semibold text-stone-200">Talk to your AI coach</p>
              <p className="text-xs text-stone-500">Personalized guidance grounded in your profile</p>
            </div>
          </div>
          <Link
            href="/coach"
            className="shrink-0 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-stone-950 transition-colors hover:bg-amber-400"
          >
            Open coach →
          </Link>
        </div>
      )}

      {/* Reassessment nudge banner */}
      {nudgeStatus?.hasActiveNudge && !nudgeDismissed && (() => {
        const activeNudge = nudgeStatus.nudges.find((n) => n.nudgeActive)
        if (!activeNudge) return null
        return (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-amber-400 text-lg leading-none">◎</span>
              <div>
                <p className="text-sm font-semibold text-stone-100">
                  Time to revisit your {activeNudge.frameworkTitle}
                </p>
                <p className="mt-0.5 text-xs text-stone-400">
                  Your last assessment was {activeNudge.daysSince} day{activeNudge.daysSince !== 1 ? 's' : ''} ago — a fresh perspective may reveal new insights.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Link
                href="/assessment"
                className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-stone-950 transition-colors hover:bg-amber-400"
              >
                Retake assessment
              </Link>
              <button
                onClick={() => setNudgeDismissed(true)}
                aria-label="Dismiss"
                className="text-stone-500 transition-colors hover:text-stone-300"
              >
                ✕
              </button>
            </div>
          </div>
        )
      })()}

      {/* Onboarding progress banner */}
      {completedFrameworks < 3 && (
        <div className="mb-6 rounded-2xl border border-stone-800 bg-stone-900/50 p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-stone-300">Getting started</p>
            <span className="text-xs text-stone-500">{completedFrameworks} of 3 core assessments</span>
          </div>
          <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-stone-800">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-500"
              style={{ width: `${(completedFrameworks / 3) * 100}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {CORE_FRAMEWORKS.map((fw) => (
              <div
                key={fw.type}
                className={`rounded-lg border p-2.5 text-center ${
                  completedTypes.has(fw.type)
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-stone-700 bg-stone-800/50'
                }`}
              >
                <div className="mb-1 text-lg">{fw.icon}</div>
                <p className="text-xs text-stone-400">{fw.shortName}</p>
                {completedTypes.has(fw.type) ? (
                  <p className="text-xs text-emerald-400">&#10003; Done</p>
                ) : (
                  <Link href="/assessment" className="text-xs text-amber-400 hover:text-amber-300">
                    Start →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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

      {/* AI Coach CTA */}
      <Link href="/coach" className="mb-8 block rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 hover:border-amber-500/50 hover:bg-amber-500/10 transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20">
            <span className="text-xl">◈</span>
          </div>
          <div>
            <p className="font-serif text-stone-100">Talk to your coach</p>
            <p className="text-xs text-stone-400">Explore your profile in conversation</p>
          </div>
          <span className="ml-auto text-stone-500">→</span>
        </div>
      </Link>

      {/* Growth recommendations */}
      {(recommendations || recommendationsLoading) && sessions.length > 0 && (() => {
        const CATEGORY_COLORS: Record<string, string> = {
          relationships: 'border-blue-500/20 bg-blue-500/5 text-blue-300',
          career: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300',
          emotional: 'border-violet-500/20 bg-violet-500/5 text-violet-300',
          'self-awareness': 'border-amber-500/20 bg-amber-500/5 text-amber-300',
          wellbeing: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300',
        }
        return (
          <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="font-serif text-xl text-stone-200">Growth recommendations</h2>
              <button
                onClick={handleRegenerateRecommendations}
                disabled={recommendationsLoading}
                className="shrink-0 rounded-xl border border-stone-700 bg-stone-800 px-4 py-2 text-xs font-semibold text-stone-300 transition-colors hover:border-stone-600 hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {recommendationsLoading ? 'Generating…' : 'Regenerate'}
              </button>
            </div>
            {recommendationsError && (
              <p className="mb-4 rounded-xl border border-rose-800/30 bg-rose-950/20 px-4 py-3 text-sm text-rose-400">
                {recommendationsError}
              </p>
            )}
            {recommendationsLoading && !recommendations && (
              <div className="flex items-center gap-3 py-6 text-stone-500">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" />
                <span className="text-sm">Generating personalised recommendations…</span>
              </div>
            )}
            {recommendations && recommendations.length > 0 && (
              <div className="space-y-4">
                {recommendations.map((rec, i) => {
                  const categoryClass = CATEGORY_COLORS[rec.category] ?? 'border-stone-500/20 bg-stone-500/5 text-stone-300'
                  return (
                    <div key={i} className="rounded-xl border border-stone-700 bg-stone-800/40 p-4">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-stone-100">{rec.title}</p>
                        <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${categoryClass}`}>
                          {rec.category.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="mb-2 text-sm text-stone-400 leading-relaxed">{rec.description}</p>
                      <p className="mb-3 text-xs text-stone-600 italic">{rec.scoreBasis}</p>
                      <div className="rounded-lg border border-amber-500/15 bg-amber-500/5 px-3 py-2">
                        <p className="text-xs text-amber-300/90">
                          <span className="font-semibold text-amber-400">This week: </span>
                          {rec.actionStep}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })()}

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
          <div className="rounded-2xl border border-dashed border-stone-700 p-10 text-center">
            <div className="mb-4 text-4xl">◎</div>
            <p className="mb-2 font-serif text-lg text-stone-200">Begin your self-discovery</p>
            <p className="mb-6 text-sm text-stone-500">
              Take your first assessment to generate your psychological profile.
            </p>
            <Link
              href="/assessment"
              className="inline-block rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-stone-950 hover:bg-amber-400"
            >
              Start first assessment
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

                    {/* Life context tags */}
                    <div className="mt-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {(sessionTags[session.id] ?? []).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 rounded-full border border-stone-700 bg-stone-800 px-2.5 py-0.5 text-[11px] text-stone-400"
                          >
                            {tag}
                            <button
                              onClick={() => handleToggleTag(session.id, tag)}
                              disabled={savingTagsFor === session.id}
                              aria-label={`Remove tag ${tag}`}
                              className="ml-0.5 text-stone-600 transition-colors hover:text-stone-300 disabled:opacity-40"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        <button
                          onClick={() =>
                            setTagPickerOpenFor(
                              tagPickerOpenFor === session.id ? null : session.id,
                            )
                          }
                          className="rounded-full border border-stone-700 bg-stone-800/50 px-2.5 py-0.5 text-[11px] text-stone-500 transition-colors hover:border-stone-600 hover:text-stone-300"
                        >
                          + Add context
                        </button>
                      </div>

                      {tagPickerOpenFor === session.id && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {LIFE_PHASE_TAGS.filter(
                            (t) => !(sessionTags[session.id] ?? []).includes(t),
                          ).map((tag) => (
                            <button
                              key={tag}
                              onClick={() => {
                                handleToggleTag(session.id, tag)
                                setTagPickerOpenFor(null)
                              }}
                              disabled={savingTagsFor === session.id}
                              className="rounded-full border border-stone-700 bg-stone-900 px-2.5 py-0.5 text-[11px] text-stone-400 transition-colors hover:border-amber-500/30 hover:bg-amber-500/5 hover:text-amber-300 disabled:opacity-40"
                            >
                              {tag}
                            </button>
                          ))}
                          {LIFE_PHASE_TAGS.every((t) =>
                            (sessionTags[session.id] ?? []).includes(t),
                          ) && (
                            <p className="text-[11px] text-stone-600">All tags added</p>
                          )}
                        </div>
                      )}
                    </div>
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
                      <Link
                        href={`/profile/${session.profile.id}#compare`}
                        className="text-xs text-stone-500 hover:text-stone-300"
                      >
                        ⇌ Compare
                      </Link>
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
