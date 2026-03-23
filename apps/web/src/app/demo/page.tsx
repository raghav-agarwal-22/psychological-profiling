import type { Metadata } from 'next'
import Link from 'next/link'
import { archetypeNameToSlug } from '@/lib/archetypes'

export const metadata: Metadata = {
  title: 'Free Psychological Profile Demo — Innermind',
  description:
    'Explore a sample AI-generated psychological profile combining Big Five, Enneagram, attachment styles and Jungian archetypes.',
  openGraph: {
    title: 'Free Psychological Profile Demo — Innermind',
    description:
      'Explore a sample AI-generated psychological profile combining Big Five, Enneagram, attachment styles and Jungian archetypes.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Psychological Profile Demo — Innermind',
    description:
      'Explore a sample AI-generated psychological profile combining Big Five, Enneagram, attachment styles and Jungian archetypes.',
  },
}

const DEMO_PROFILE = {
  name: 'Alex',
  archetype: 'The Seeker',
  enneagram: 'Type 4w5 — The Bohemian Intellectual',
  attachment: 'Secure with avoidant tendencies',
  summary:
    'Alex moves through the world as a thoughtful observer, drawn to ideas and experiences that crack open the familiar and reveal something truer underneath. There is a quiet intensity here — a person who feels deeply but processes privately, who builds trust slowly and offers loyalty completely once that threshold is crossed. The tension between a craving for connection and a need for solitude is not a flaw but a feature: it keeps Alex honest, introspective, and perpetually curious about the gap between who they are and who they might become.',
  dimensions: [
    { key: 'openness', label: 'Openness', pct: 87, color: 'bg-violet-500' },
    { key: 'conscientiousness', label: 'Conscientiousness', pct: 62, color: 'bg-blue-500' },
    { key: 'extraversion', label: 'Extraversion', pct: 41, color: 'bg-amber-500' },
    { key: 'agreeableness', label: 'Agreeableness', pct: 73, color: 'bg-emerald-500' },
    { key: 'neuroticism', label: 'Neuroticism', pct: 38, color: 'bg-rose-500' },
  ],
  strengths: [
    'Deep capacity for empathy and emotional attunement',
    'Original thinking that connects disparate ideas',
    'Sustained focus when genuinely engaged',
    'Authentic self-expression in creative work',
  ],
  blindSpots: [
    'Can withdraw when vulnerability feels risky',
    'Prone to over-idealising people before knowing them fully',
    'Difficulty asking for help when overwhelmed',
    'May intellectualise emotions rather than process them',
  ],
  values: ['Creativity', 'Autonomy', 'Authenticity', 'Depth', 'Growth', 'Meaning'],
}

export default function DemoPage() {
  const profile = DEMO_PROFILE

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* Demo banner */}
      <div className="mb-8 flex flex-col items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/8 px-6 py-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-sm text-stone-300">
          <span className="font-medium text-amber-400">Sample profile</span> — this is a demonstration of what your Innermind report looks like.
        </p>
        <Link
          href="/"
          className="shrink-0 rounded-xl bg-amber-500 px-5 py-2 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
        >
          Start your free assessment →
        </Link>
      </div>

      {/* Archetype header */}
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20">
          <span className="text-3xl">◎</span>
        </div>
        <h1 className="font-serif text-4xl text-stone-100">{profile.archetype}</h1>
        <p className="mt-2 text-stone-500">Jungian archetype</p>
        <Link
          href={`/archetypes/${archetypeNameToSlug(profile.archetype)}`}
          className="mt-3 inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-300"
        >
          <span>Explore this archetype</span>
          <span>→</span>
        </Link>
      </div>

      {/* Enneagram + Attachment row */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-5">
          <h2 className="mb-1 font-serif text-lg text-stone-200">Enneagram</h2>
          <p className="text-sm text-stone-400">{profile.enneagram}</p>
        </div>
        <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-5">
          <h2 className="mb-1 font-serif text-lg text-stone-200">Attachment style</h2>
          <p className="text-sm text-stone-400">{profile.attachment}</p>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
        <h2 className="mb-3 font-serif text-xl text-stone-200">Narrative</h2>
        <p className="leading-relaxed text-stone-400">{profile.summary}</p>
      </div>

      {/* Big Five scores */}
      <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
        <h2 className="mb-5 font-serif text-xl text-stone-200">Personality dimensions</h2>
        <div className="space-y-4">
          {profile.dimensions.map(({ key, label, pct, color }) => (
            <div key={key}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm text-stone-300">{label}</span>
                <span className="text-sm font-medium text-stone-400">{pct}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-stone-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths + Growth areas */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
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
      </div>

      {/* Values */}
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

      {/* CTA */}
      <div className="mt-10 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 text-center">
        <p className="mb-1 font-serif text-lg text-stone-200">Get your own profile</p>
        <p className="mb-4 text-sm text-stone-400">
          Understand your psychology through science-backed assessments and AI-powered insights.
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
        >
          Start your free assessment →
        </Link>
      </div>
    </div>
  )
}
