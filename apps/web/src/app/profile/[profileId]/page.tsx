'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

interface DimensionScore {
  normalized: number
  raw: number
  responseCount: number
}

interface Profile {
  id: string
  summary: string
  dimensions: Record<string, DimensionScore>
  archetypes: string[]
  values: string[]
  blindSpots: string[]
  strengths: string[]
  version: number
  generatedAt: string
  isPublic: boolean
  shareToken: string | null
}

const DIMENSION_LABELS: Record<string, string> = {
  openness: 'Openness',
  conscientiousness: 'Conscientiousness',
  extraversion: 'Extraversion',
  agreeableness: 'Agreeableness',
  neuroticism: 'Neuroticism',
}

const DIMENSION_COLORS: Record<string, string> = {
  openness: 'bg-violet-500',
  conscientiousness: 'bg-blue-500',
  extraversion: 'bg-amber-500',
  agreeableness: 'bg-emerald-500',
  neuroticism: 'bg-rose-500',
}

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const profileId = params.profileId as string

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [sharing, setSharing] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }

    const endpoint =
      profileId === 'latest'
        ? '/api/profiles'
        : `/api/profiles/${profileId}`

    api
      .get<{ profile: Profile }>(endpoint, token)
      .then((d) => setProfile(d.profile))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load profile'))
      .finally(() => setLoading(false))
  }, [profileId, router])

  const handleShare = async () => {
    const token = getToken()
    if (!token || !profile) return
    setSharing(true)
    try {
      const data = await api.patch<{ profile: { isPublic: boolean; shareToken: string; shareUrl: string } }>(
        `/api/profiles/${profile.id}/share`,
        {},
        token,
      )
      setShareUrl(data.profile.shareUrl)
      setShowShareModal(true)
    } finally {
      setSharing(false)
    }
  }

  const handleRevokeShare = async () => {
    const token = getToken()
    if (!token || !profile) return
    await api.patch(`/api/profiles/${profile.id}/share`, { isPublic: false }, token)
    setShareUrl(null)
    setShowShareModal(false)
  }

  const handleCopy = async () => {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" />
        <p className="text-stone-500">Loading your profile…</p>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-stone-400">{error ?? 'Profile not found.'}</p>
        <Link href="/assessment" className="mt-4 text-amber-400 hover:text-amber-300">
          Take an assessment →
        </Link>
      </div>
    )
  }

  const dimensionEntries = Object.entries(profile.dimensions)

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* Archetype header */}
      {profile.archetypes.length > 0 && (
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20">
            <span className="text-3xl">◎</span>
          </div>
          <h1 className="font-serif text-4xl text-stone-100">{profile.archetypes[0]}</h1>
          <p className="mt-2 text-stone-500">Your psychological archetype</p>
        </div>
      )}

      {/* Summary */}
      <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
        <h2 className="mb-3 font-serif text-xl text-stone-200">Your narrative</h2>
        <p className="text-stone-400 leading-relaxed">{profile.summary}</p>
      </div>

      {/* Big Five scores */}
      {dimensionEntries.length > 0 && (
        <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
          <h2 className="mb-5 font-serif text-xl text-stone-200">Personality dimensions</h2>
          <div className="space-y-4">
            {dimensionEntries.map(([key, score]) => {
              const label = DIMENSION_LABELS[key.toLowerCase()] ?? key
              const color = DIMENSION_COLORS[key.toLowerCase()] ?? 'bg-stone-400'
              const pct = typeof score === 'object' ? score.normalized : Number(score)
              return (
                <div key={key}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm text-stone-300">{label}</span>
                    <span className="text-sm font-medium text-stone-400">{pct}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-stone-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Strengths + Growth areas */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {profile.strengths.length > 0 && (
          <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-5">
            <h2 className="mb-3 font-serif text-lg text-stone-200">Strengths</h2>
            <ul className="space-y-1.5">
              {profile.strengths.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-stone-400">
                  <span className="mt-0.5 text-emerald-500">✦</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
        {profile.blindSpots.length > 0 && (
          <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-5">
            <h2 className="mb-3 font-serif text-lg text-stone-200">Growth areas</h2>
            <ul className="space-y-1.5">
              {profile.blindSpots.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-stone-400">
                  <span className="mt-0.5 text-amber-500">→</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Values */}
      {profile.values.length > 0 && (
        <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-5">
          <h2 className="mb-3 font-serif text-lg text-stone-200">Core values</h2>
          <div className="flex flex-wrap gap-2">
            {profile.values.map((v) => (
              <span
                key={v}
                className="rounded-full border border-stone-700 bg-stone-800 px-3 py-1 text-xs text-stone-300"
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/assessment"
          className="rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
        >
          Retake assessment
        </Link>
        <button
          onClick={handleShare}
          disabled={sharing}
          className="rounded-xl border border-stone-700 bg-stone-900 px-6 py-2.5 text-sm font-semibold text-stone-200 transition-colors hover:border-stone-600 hover:bg-stone-800 disabled:opacity-50"
        >
          {sharing ? 'Generating link…' : 'Share Profile'}
        </button>
        <Link href="/dashboard" className="text-sm text-stone-400 hover:text-stone-200">
          Back to dashboard
        </Link>
      </div>

      {/* Share modal */}
      {showShareModal && shareUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-stone-800 bg-stone-900 p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-serif text-xl text-stone-100">Share your profile</h3>
                <p className="mt-1 text-sm text-stone-400">
                  Anyone with this link can view your profile.
                </p>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-stone-500 transition-colors hover:text-stone-300"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-800 px-3 py-2">
              <span className="flex-1 truncate text-sm text-stone-300">{shareUrl}</span>
              <button
                onClick={handleCopy}
                className="shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-stone-950 transition-colors hover:bg-amber-400"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <button
              onClick={handleRevokeShare}
              className="w-full rounded-xl border border-rose-800/50 bg-rose-950/30 px-4 py-2.5 text-sm text-rose-400 transition-colors hover:bg-rose-950/50 hover:text-rose-300"
            >
              Revoke sharing
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
