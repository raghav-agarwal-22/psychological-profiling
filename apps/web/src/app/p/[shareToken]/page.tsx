import type { Metadata } from 'next'
import Link from 'next/link'
import { archetypeNameToSlug } from '@/lib/archetypes'
import { ShareProfileButton } from '@/components/ShareProfileButton'

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

interface Props {
  params: { shareToken: string }
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

async function fetchProfile(shareToken: string): Promise<Profile | null> {
  const apiUrl = process.env.API_URL ?? 'http://localhost:3001'
  try {
    const res = await fetch(`${apiUrl}/api/share/${shareToken}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.profile ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profile = await fetchProfile(params.shareToken)

  if (!profile) {
    return {
      title: 'Profile Not Found',
      description: 'This profile is not available.',
    }
  }

  const archetype = profile.archetypes[0] ?? 'Psychological Profile'
  const firstSentence = profile.summary.split(/[.!?]/)[0]?.trim() ?? profile.summary

  const ogImageUrl = `/p/${params.shareToken}/opengraph-image`

  return {
    title: `${archetype} — Psychological Profile`,
    description: firstSentence,
    robots: { index: true, follow: true },
    openGraph: {
      title: `${archetype} — Psychological Profile`,
      description: firstSentence,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${archetype} — Psychological Profile` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${archetype} — Psychological Profile`,
      description: firstSentence,
      images: [ogImageUrl],
    },
  }
}

export default async function PublicProfilePage({ params }: Props) {
  const profile = await fetchProfile(params.shareToken)

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-stone-400">This profile is not available or has been made private.</p>
        <Link href="/" className="mt-4 text-amber-400 hover:text-amber-300">
          Discover your own profile →
        </Link>
      </div>
    )
  }

  const dimensionEntries = Object.entries(profile.dimensions)

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* View-only badge + share */}
      <div className="mb-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <span className="rounded-full border border-stone-700 bg-stone-900 px-4 py-1.5 text-xs text-stone-400">
          View only — shared profile
        </span>
        <ShareProfileButton archetype={profile.archetypes[0] ?? 'Innermind Profile'} />
      </div>

      {/* Archetype header */}
      {profile.archetypes.length > 0 && (
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20">
            <span className="text-3xl">◎</span>
          </div>
          <h1 className="font-serif text-4xl text-stone-100">{profile.archetypes[0]}</h1>
          <p className="mt-2 text-stone-500">Psychological archetype</p>
          <Link
            href={`/archetypes/${archetypeNameToSlug(profile.archetypes[0])}`}
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-300"
          >
            <span>Explore this archetype</span>
            <span>→</span>
          </Link>
        </div>
      )}

      {/* Summary */}
      <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
        <h2 className="mb-3 font-serif text-xl text-stone-200">Narrative</h2>
        <p className="leading-relaxed text-stone-400">{profile.summary}</p>
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
      <div className="mt-10 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 text-center">
        <p className="mb-1 font-serif text-lg text-stone-200">Discover your own profile</p>
        <p className="mb-4 text-sm text-stone-400">
          Understand your psychology through science-backed assessments and AI-powered insights.
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
        >
          Try InnermindApp
        </Link>
      </div>
    </div>
  )
}
