import type { Metadata } from 'next'
import Link from 'next/link'

interface DimensionScore {
  normalized: number
}

interface ProfileData {
  id: string
  summary: string
  dimensions: Record<string, DimensionScore>
  archetypes: string[]
  values: string[]
  strengths: string[]
  blindSpots: string[]
  shareToken: string | null
  generatedAt: string
}

interface OverlapEntry {
  scoreA: number
  scoreB: number
  overlap: number
}

interface CompatibilityNarrative {
  overallNarrative: string
  whatWorks: string[]
  watchFor: string[]
  complementaryStrengths: string
  growthOpportunities: string
}

interface CompareResult {
  profileA: ProfileData
  profileB: ProfileData
  overlapScores: Record<string, OverlapEntry>
  compatibilityScore: number
  narrative: CompatibilityNarrative
}

const DIMENSION_LABELS: Record<string, string> = {
  // Big Five
  openness: 'Openness',
  conscientiousness: 'Conscientiousness',
  extraversion: 'Extraversion',
  agreeableness: 'Agreeableness',
  neuroticism: 'Neuroticism',
  // Values
  achievement: 'Achievement',
  benevolence: 'Benevolence',
  conformity: 'Conformity',
  hedonism: 'Hedonism',
  power: 'Power',
  security: 'Security',
  self_direction: 'Self-Direction',
  stimulation: 'Stimulation',
  universalism: 'Universalism',
  // Attachment
  anxiety: 'Attachment Anxiety',
  avoidance: 'Attachment Avoidance',
}

const COLORS_A = 'bg-violet-500'
const COLORS_B = 'bg-amber-500'

async function fetchComparison(a: string, b: string): Promise<CompareResult | null> {
  const apiUrl = process.env.API_URL ?? 'http://localhost:3001'
  try {
    const res = await fetch(`${apiUrl}/api/compare?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return null
    return res.json() as Promise<CompareResult>
  } catch {
    return null
  }
}

function overlapColor(overlap: number): string {
  if (overlap >= 80) return 'text-emerald-400'
  if (overlap >= 60) return 'text-amber-400'
  return 'text-rose-400'
}

function compatibilityLabel(score: number): string {
  if (score >= 80) return 'Highly aligned'
  if (score >= 65) return 'Well matched'
  if (score >= 50) return 'Complementary'
  return 'Contrasting'
}

interface Props {
  searchParams: { a?: string; b?: string }
}

export async function generateMetadata({ searchParams: _searchParams }: Props): Promise<Metadata> {
  return {
    title: 'Profile Compatibility — Innermind',
    description: 'See how two psychological profiles align across personality, values, and attachment dimensions.',
  }
}

export default async function ComparePage({ searchParams }: Props) {
  const { a, b } = searchParams

  if (!a || !b) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-stone-700 bg-stone-900 text-2xl">
          ⇌
        </div>
        <h1 className="mb-3 font-serif text-3xl text-stone-100">Compatibility Map</h1>
        <p className="mb-2 text-stone-400 leading-relaxed">
          See how two psychological profiles align across personality, values, and attachment dimensions.
        </p>
        <p className="mb-8 text-sm text-stone-500">
          Complete your assessment, then share your profile link — recipients can generate a comparison view.
        </p>
        <Link
          href="/assessment"
          className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-8 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
        >
          Start your assessment →
        </Link>
        <p className="mt-4 text-xs text-stone-600">Already have a profile? <Link href="/dashboard" className="text-amber-500 hover:text-amber-400">Go to dashboard →</Link></p>
      </div>
    )
  }

  const data = await fetchComparison(a, b)

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-stone-400">
          One or both profiles are not available or have not been made public.
        </p>
        <Link href="/" className="mt-4 inline-block text-amber-400 hover:text-amber-300">
          Try Innermind →
        </Link>
      </div>
    )
  }

  const { profileA, profileB, overlapScores, compatibilityScore, narrative } = data
  const dimensionKeys = Object.keys(overlapScores)

  const webUrl = process.env.NEXT_PUBLIC_WEB_URL ?? 'http://localhost:3000'
  const compareUrl = `${webUrl}/compare?a=${a}&b=${b}`

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20">
          <span className="text-2xl">⇌</span>
        </div>
        <h1 className="font-serif text-3xl text-stone-100">Compatibility Map</h1>
        <p className="mt-2 text-stone-500">Side-by-side psychological profile comparison</p>
      </div>

      {/* Compatibility score */}
      <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-6 text-center">
        <p className="mb-1 text-sm text-stone-500">Overall compatibility</p>
        <div className={`font-serif text-5xl font-light ${overlapColor(compatibilityScore)}`}>
          {compatibilityScore}
          <span className="ml-1 text-2xl opacity-60">/ 100</span>
        </div>
        <p className="mt-2 text-sm text-stone-400">{compatibilityLabel(compatibilityScore)}</p>
      </div>

      {/* Profile headers */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
          <div className="mb-1 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-violet-500" />
            <span className="text-xs text-stone-400">Person A</span>
          </div>
          {profileA.archetypes[0] && (
            <p className="font-serif text-lg text-stone-200">{profileA.archetypes[0]}</p>
          )}
          <p className="mt-1 line-clamp-2 text-xs text-stone-500">{profileA.summary}</p>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="mb-1 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-xs text-stone-400">Person B</span>
          </div>
          {profileB.archetypes[0] && (
            <p className="font-serif text-lg text-stone-200">{profileB.archetypes[0]}</p>
          )}
          <p className="mt-1 line-clamp-2 text-xs text-stone-500">{profileB.summary}</p>
        </div>
      </div>

      {/* Dimension comparison */}
      {dimensionKeys.length > 0 && (
        <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
          <h2 className="mb-5 font-serif text-xl text-stone-200">Dimension breakdown</h2>
          <div className="mb-3 flex items-center gap-4 text-xs text-stone-500">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-6 rounded-full bg-violet-500" /> Person A
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-6 rounded-full bg-amber-500" /> Person B
            </span>
          </div>
          <div className="space-y-5">
            {dimensionKeys.map((key) => {
              const entry = overlapScores[key]!
              const label = DIMENSION_LABELS[key.toLowerCase()] ?? key
              return (
                <div key={key}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm text-stone-300">{label}</span>
                    <span className={`text-xs font-medium ${overlapColor(entry.overlap)}`}>
                      {entry.overlap}% overlap
                    </span>
                  </div>
                  {/* Person A bar */}
                  <div className="mb-1 h-2 w-full overflow-hidden rounded-full bg-stone-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${COLORS_A} opacity-80`}
                      style={{ width: `${entry.scoreA}%` }}
                    />
                  </div>
                  {/* Person B bar */}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-stone-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${COLORS_B} opacity-80`}
                      style={{ width: `${entry.scoreB}%` }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-stone-600">
                    <span>{entry.scoreA}</span>
                    <span>{entry.scoreB}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* AI Compatibility narrative */}
      <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
        <h2 className="mb-4 font-serif text-xl text-stone-200">Compatibility narrative</h2>
        <p className="leading-relaxed text-stone-400">{narrative.overallNarrative}</p>
      </div>

      {/* What works + Watch for */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <h2 className="mb-3 font-serif text-lg text-stone-200">What works</h2>
          <ul className="space-y-2">
            {narrative.whatWorks.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-stone-400">
                <span className="mt-0.5 text-emerald-500">✦</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <h2 className="mb-3 font-serif text-lg text-stone-200">Watch for</h2>
          <ul className="space-y-2">
            {narrative.watchFor.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-stone-400">
                <span className="mt-0.5 text-amber-500">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Complementary strengths + Growth opportunities */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-5">
          <h3 className="mb-2 text-sm font-medium text-stone-300">Complementary strengths</h3>
          <p className="text-sm leading-relaxed text-stone-400">{narrative.complementaryStrengths}</p>
        </div>
        <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-5">
          <h3 className="mb-2 text-sm font-medium text-stone-300">Growth opportunities</h3>
          <p className="text-sm leading-relaxed text-stone-400">{narrative.growthOpportunities}</p>
        </div>
      </div>

      {/* Values comparison */}
      {(profileA.values.length > 0 || profileB.values.length > 0) && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-5">
            <h3 className="mb-3 text-sm font-medium text-stone-300">Person A — core values</h3>
            <div className="flex flex-wrap gap-1.5">
              {profileA.values.map((v) => (
                <span
                  key={v}
                  className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-xs text-violet-300"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-5">
            <h3 className="mb-3 text-sm font-medium text-stone-300">Person B — core values</h3>
            <div className="flex flex-wrap gap-1.5">
              {profileB.values.map((v) => (
                <span
                  key={v}
                  className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs text-amber-300"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Share this comparison */}
      <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-5">
        <h3 className="mb-2 text-sm font-medium text-stone-300">Share this comparison</h3>
        <p className="mb-3 text-xs text-stone-500">Anyone with this link can view this compatibility map.</p>
        <code className="block break-all rounded-lg bg-stone-800 px-3 py-2 text-xs text-stone-400">
          {compareUrl}
        </code>
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 text-center">
        <p className="mb-1 font-serif text-lg text-stone-200">Discover your own profile</p>
        <p className="mb-4 text-sm text-stone-400">
          Understand your psychology through science-backed assessments and AI-powered insights.
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
        >
          Try Innermind
        </Link>
      </div>
    </div>
  )
}
