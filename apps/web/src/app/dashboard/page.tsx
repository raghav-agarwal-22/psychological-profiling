'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

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
    generatedAt: string
  } | null
  deltas: Record<string, number> | null
}

const DIMENSION_LABELS: Record<string, string> = {
  openness: 'Openness',
  conscientiousness: 'Conscientiousness',
  extraversion: 'Extraversion',
  agreeableness: 'Agreeableness',
  neuroticism: 'Neuroticism',
}

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
      {positive ? '↑' : '↓'} {label.slice(0, 3)} {positive ? '+' : ''}{value}
    </span>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }

    api
      .get<{ sessions: SessionSummary[] }>('/api/users/me/sessions', token)
      .then((data) => setSessions(data.sessions))
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
                  </div>
                  {session.profile && (
                    <Link
                      href={`/profile/${session.profile.id}`}
                      className="shrink-0 text-xs text-stone-400 hover:text-stone-200"
                    >
                      View results →
                    </Link>
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
