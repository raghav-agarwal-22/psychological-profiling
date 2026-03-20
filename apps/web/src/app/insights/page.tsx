'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { GrowthChart } from '@/components/GrowthChart'

interface DimensionScore {
  normalized: number
  raw: number
  responseCount: number
}

interface HistoryProfile {
  id: string
  version: number
  summary: string
  dimensions: Record<string, DimensionScore>
  archetypes: string[]
  generatedAt: string
  rawOutput: { templateType?: string } | null
}

const FRAMEWORK_LABELS: Record<string, string> = {
  BIG_FIVE: 'Big Five',
  VALUES_INVENTORY: 'Values Inventory',
  ATTACHMENT_STYLE: 'Attachment Style',
  LIGHT_DARK_TRIAD: 'Light / Dark Triad',
  ENNEAGRAM: 'Enneagram',
  JUNGIAN_ARCHETYPES: 'Jungian Archetypes',
}

const FRAMEWORK_ICONS: Record<string, string> = {
  BIG_FIVE: '◎',
  VALUES_INVENTORY: '◈',
  ATTACHMENT_STYLE: '◉',
  LIGHT_DARK_TRIAD: '◑',
  ENNEAGRAM: '◬',
  JUNGIAN_ARCHETYPES: '◆',
}

export default function InsightsPage() {
  const router = useRouter()
  const [profilesByType, setProfilesByType] = useState<Record<string, HistoryProfile[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeType, setActiveType] = useState<string | null>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }

    api
      .get<{ profiles: HistoryProfile[] }>('/api/profiles/history', token)
      .then((d) => {
        // Group profiles by templateType
        const grouped: Record<string, HistoryProfile[]> = {}
        for (const profile of d.profiles) {
          const type = (profile.rawOutput as { templateType?: string } | null)?.templateType ?? 'UNKNOWN'
          if (!grouped[type]) grouped[type] = []
          grouped[type]!.push(profile)
        }
        setProfilesByType(grouped)

        // Default to the framework with the most retakes
        const types = Object.keys(grouped)
        if (types.length > 0) {
          const mostRetakes = types.reduce((a, b) =>
            (grouped[a]?.length ?? 0) >= (grouped[b]?.length ?? 0) ? a : b,
          )
          setActiveType(mostRetakes)
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load data'))
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" />
        <p className="text-stone-500">Loading growth data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-stone-400">{error}</p>
        <Link href="/dashboard" className="mt-4 text-amber-400 hover:text-amber-300">
          Back to dashboard
        </Link>
      </div>
    )
  }

  const frameworkTypes = Object.keys(profilesByType)
  const hasData = frameworkTypes.length > 0

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20">
          <span className="text-xl">◈</span>
        </div>
        <h1 className="font-serif text-3xl text-stone-100">Growth Insights</h1>
        <p className="mt-2 text-sm text-stone-400">
          Track how your psychological dimensions evolve across assessment retakes.
        </p>
      </div>

      {!hasData ? (
        <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-10 text-center">
          <p className="mb-1 text-stone-300">No assessment history yet.</p>
          <p className="mb-6 text-sm text-stone-500">
            Complete your first assessment to start tracking growth.
          </p>
          <Link
            href="/assessment"
            className="inline-block rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
          >
            Take an assessment
          </Link>
        </div>
      ) : (
        <>
          {/* Framework tabs */}
          {frameworkTypes.length > 1 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {frameworkTypes.map((type) => {
                const count = profilesByType[type]?.length ?? 0
                const label = FRAMEWORK_LABELS[type] ?? type.replace(/_/g, ' ')
                const icon = FRAMEWORK_ICONS[type] ?? '◎'
                return (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      activeType === type
                        ? 'bg-amber-500 text-stone-950'
                        : 'border border-stone-700 bg-stone-900 text-stone-400 hover:border-stone-600 hover:text-stone-200'
                    }`}
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-xs ${
                        activeType === type
                          ? 'bg-stone-950/30 text-stone-700'
                          : 'bg-stone-800 text-stone-500'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Growth chart for active framework */}
          {activeType && profilesByType[activeType] && (
            <GrowthChart
              profiles={profilesByType[activeType]!}
              frameType={activeType}
            />
          )}

          {/* Per-framework summary cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {frameworkTypes.map((type) => {
              const typeProfiles = profilesByType[type] ?? []
              const latest = typeProfiles[0]
              const label = FRAMEWORK_LABELS[type] ?? type.replace(/_/g, ' ')
              const icon = FRAMEWORK_ICONS[type] ?? '◎'
              const lastDate = latest
                ? new Date(latest.generatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : null

              return (
                <div
                  key={type}
                  className="rounded-2xl border border-stone-800 bg-stone-900/50 p-5"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{icon}</span>
                      <span className="text-sm font-medium text-stone-200">{label}</span>
                    </div>
                    <span className="text-xs text-stone-500">
                      {typeProfiles.length} take{typeProfiles.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {latest && (
                    <div className="space-y-1.5">
                      {Object.entries(latest.dimensions ?? {})
                        .slice(0, 4)
                        .map(([dim, score]) => (
                          <div key={dim} className="flex items-center justify-between gap-3">
                            <span className="truncate text-xs text-stone-500">
                              {dim
                                .split('_')
                                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                                .join(' ')}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="h-1 w-20 overflow-hidden rounded-full bg-stone-800">
                                <div
                                  className="h-full rounded-full bg-amber-500"
                                  style={{ width: `${Math.round(score.normalized * 100)}%` }}
                                />
                              </div>
                              <span className="w-8 text-right text-xs tabular-nums text-stone-400">
                                {Math.round(score.normalized * 100)}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    {lastDate && (
                      <span className="text-xs text-stone-600">Last: {lastDate}</span>
                    )}
                    <Link
                      href={`/assessment?type=${encodeURIComponent(type)}`}
                      className="ml-auto rounded-lg border border-stone-700 px-3 py-1 text-xs font-medium text-stone-400 transition-colors hover:border-stone-600 hover:text-stone-200"
                    >
                      Retake
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <Link
              href="/assessment"
              className="inline-block rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
            >
              Take a new assessment
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
