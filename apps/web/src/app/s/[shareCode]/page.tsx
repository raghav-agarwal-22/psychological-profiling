import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ARCHETYPE_BY_NAME } from '@/lib/archetypes'

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
  strengths: string[]
  isPublic: boolean
  shareToken: string | null
}

interface Props {
  params: { shareCode: string }
}

const DIMENSION_LABELS: Record<string, string> = {
  openness: 'Openness',
  conscientiousness: 'Conscientiousness',
  extraversion: 'Extraversion',
  agreeableness: 'Agreeableness',
  neuroticism: 'Neuroticism',
}

async function fetchProfile(shareCode: string): Promise<Profile | null> {
  const apiUrl = process.env.API_URL ?? 'http://localhost:3001'
  try {
    const res = await fetch(`${apiUrl}/api/share/${shareCode}`, {
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
  const profile = await fetchProfile(params.shareCode)

  if (!profile) {
    return { title: 'Profile Not Found', description: 'This profile is not available.' }
  }

  const archetype = profile.archetypes[0] ?? 'Psychological Profile'
  const firstSentence = profile.summary.split(/[.!?]/)[0]?.trim() ?? profile.summary
  const ogImageUrl = `/s/${params.shareCode}/opengraph-image`

  return {
    title: `${archetype} — Discover your psychological portrait`,
    description: `${firstSentence}. Take the assessment and discover your own archetype.`,
    openGraph: {
      title: `${archetype} — Psychological Portrait`,
      description: `${firstSentence}. Discover yours on Innermind.`,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${archetype} — Innermind` }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${archetype} — Psychological Portrait`,
      description: `${firstSentence}. Discover yours on Innermind.`,
      images: [ogImageUrl],
    },
  }
}

export default async function ShareLandingPage({ params }: Props) {
  const profile = await fetchProfile(params.shareCode)

  if (!profile) notFound()

  const archetype = profile.archetypes[0] ?? 'Unknown Archetype'
  const firstSentence = profile.summary.split(/[.!?]/)[0]?.trim() ?? profile.summary

  const archetypeData = ARCHETYPE_BY_NAME[archetype.toLowerCase()]

  const topDimensions = Object.entries(profile.dimensions)
    .map(([key, score]) => ({
      key,
      label: DIMENSION_LABELS[key.toLowerCase()] ?? key,
      value: typeof score === 'object' ? score.normalized : Number(score),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Header */}
      <header className="border-b border-stone-800/50 px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-sm ring-1 ring-amber-500/20">
              ◎
            </div>
            <span className="text-sm font-medium tracking-wide text-stone-400">innermind</span>
          </Link>
          <Link
            href="/assessment?utm_source=share&utm_medium=card"
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-400"
          >
            Discover yours →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Card preview */}
        <div className="mb-12 overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/60 p-8 shadow-2xl">
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-500">
            I am
          </div>
          <h1 className="mb-4 font-serif text-5xl font-bold text-stone-50 md:text-6xl">
            {archetype}
          </h1>
          <p className="mb-8 max-w-xl text-lg leading-relaxed text-stone-400">{firstSentence}</p>

          {/* Trait tags */}
          <div className="flex flex-wrap gap-2">
            {topDimensions.map(({ key, label, value }) => (
              <span
                key={key}
                className="rounded-full border border-amber-500/20 bg-amber-500/8 px-3 py-1 text-sm font-medium text-amber-400"
              >
                {value >= 70 ? 'High' : value >= 40 ? 'Balanced' : 'Low'} {label}
              </span>
            ))}
          </div>
        </div>

        {/* Archetype explanation */}
        {archetypeData && (
          <div className="mb-12">
            <h2 className="mb-3 text-xl font-semibold text-stone-200">About {archetype}</h2>
            <p className="leading-relaxed text-stone-400">{archetypeData.coreTheme}</p>
          </div>
        )}

        {/* Primary CTA */}
        <div className="mb-16 rounded-2xl border border-stone-800 bg-gradient-to-br from-stone-900 to-stone-900/50 p-8 text-center">
          <h2 className="mb-3 text-2xl font-bold text-stone-50">Discover your psychological portrait</h2>
          <p className="mb-6 text-stone-400">
            5 validated frameworks. One integrated portrait. Free to start.
          </p>
          <Link
            href="/assessment?utm_source=share&utm_medium=card"
            className="inline-block rounded-xl bg-amber-500 px-8 py-3 text-base font-semibold text-stone-950 transition hover:bg-amber-400"
          >
            Start your free assessment →
          </Link>
          <p className="mt-4 text-sm text-stone-600">No credit card required</p>
        </div>

        {/* Social proof */}
        <div className="mb-12 text-center">
          <p className="text-sm text-stone-600">
            Join thousands of people who know their psychological blueprint
          </p>
        </div>

        {/* Frameworks bar */}
        <div className="rounded-xl border border-stone-800/50 bg-stone-900/30 p-6">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-stone-600">
            Frameworks included
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-stone-500">
            {['Big Five', 'Enneagram', 'Jungian Archetypes', 'Attachment Style', 'Schwartz Values'].map((f) => (
              <span key={f} className="rounded-full border border-stone-800 px-3 py-1">
                {f}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800/50 px-6 py-8 text-center">
        <p className="text-sm text-stone-700">
          <Link href="/" className="text-stone-500 hover:text-stone-400">
            innermindhealing.com
          </Link>{' '}
          — Science-backed psychological assessments
        </p>
      </footer>
    </div>
  )
}
