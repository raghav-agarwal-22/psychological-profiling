import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ARCHETYPES, ARCHETYPE_BY_SLUG, ARCHETYPE_COLORS } from '@/lib/archetypes'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return ARCHETYPES.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const archetype = ARCHETYPE_BY_SLUG[params.slug]
  if (!archetype) return { title: 'Archetype Not Found' }

  return {
    title: `${archetype.name} — Jungian Archetype`,
    description: `${archetype.tagline}. ${archetype.description}`,
    openGraph: {
      title: `${archetype.name} — Jungian Archetype | Innermind`,
      description: `${archetype.tagline}. ${archetype.description}`,
      images: [{ url: '/og-default.png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${archetype.name} — Jungian Archetype | Innermind`,
      description: `${archetype.tagline}. ${archetype.description}`,
      images: ['/og-default.png'],
    },
  }
}

export default function ArchetypePage({ params }: Props) {
  const archetype = ARCHETYPE_BY_SLUG[params.slug]
  if (!archetype) notFound()

  const colorClasses = ARCHETYPE_COLORS[archetype.color] ?? ARCHETYPE_COLORS['stone']
  const complementaryArchetypes = archetype.complementaryArchetypes
    .map((slug) => ARCHETYPE_BY_SLUG[slug])
    .filter(Boolean)
  const shadowArchetypes = archetype.shadowArchetypes
    .map((slug) => ARCHETYPE_BY_SLUG[slug])
    .filter(Boolean)

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      {/* Back nav */}
      <Link
        href="/archetypes"
        className="mb-10 inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-stone-300"
      >
        <span>←</span>
        <span>All archetypes</span>
      </Link>

      {/* Header */}
      <div className="mb-12 text-center">
        <div
          className={`mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl ring-1 ${colorClasses}`}
        >
          <span className="text-4xl" role="img" aria-label={archetype.name}>
            {archetype.symbol}
          </span>
        </div>
        <h1 className="font-serif text-5xl text-stone-100">{archetype.name}</h1>
        <p className="mt-3 text-lg text-stone-400 italic">{archetype.tagline}</p>
        <p className="mt-4 text-stone-400">{archetype.description}</p>
      </div>

      {/* Core Theme */}
      <section className="mb-10">
        <h2 className="mb-4 font-serif text-2xl text-stone-100">Core Theme</h2>
        <p className="leading-relaxed text-stone-300">{archetype.coreTheme}</p>
      </section>

      {/* Strengths & Challenges */}
      <div className="mb-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-6">
          <h3 className="mb-4 font-medium text-stone-100">Strengths</h3>
          <ul className="space-y-2">
            {archetype.strengths.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm text-stone-400">
                <span className="text-emerald-500">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-6">
          <h3 className="mb-4 font-medium text-stone-100">Challenges</h3>
          <ul className="space-y-2">
            {archetype.challenges.map((c) => (
              <li key={c} className="flex items-center gap-2 text-sm text-stone-400">
                <span className="text-rose-500">◦</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mythological References */}
      <section className="mb-10">
        <h2 className="mb-4 font-serif text-2xl text-stone-100">Mythological Roots</h2>
        <ul className="space-y-3">
          {archetype.mythologicalReferences.map((ref) => (
            <li key={ref} className="flex gap-3 text-stone-300">
              <span className="mt-1 shrink-0 text-stone-500">◎</span>
              <span className="leading-relaxed">{ref}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Shadow Expression */}
      <section className="mb-10 rounded-xl border border-rose-900/40 bg-rose-950/20 p-6">
        <h2 className="mb-3 font-serif text-xl text-rose-300">Shadow Expression</h2>
        <p className="leading-relaxed text-stone-300">{archetype.shadowExpression}</p>
      </section>

      {/* Growth Path */}
      <section className="mb-10 rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-6">
        <h2 className="mb-3 font-serif text-xl text-emerald-300">Growth Path</h2>
        <p className="leading-relaxed text-stone-300">{archetype.growthPath}</p>
      </section>

      {/* Famous Examples */}
      <section className="mb-10">
        <h2 className="mb-4 font-serif text-2xl text-stone-100">Famous Examples</h2>
        <div className="flex flex-wrap gap-2">
          {archetype.famousExamples.map((example) => (
            <span
              key={example}
              className="rounded-full border border-stone-700 bg-stone-800 px-3 py-1 text-sm text-stone-300"
            >
              {example}
            </span>
          ))}
        </div>
      </section>

      {/* Related Archetypes */}
      <section className="mb-12">
        <h2 className="mb-6 font-serif text-2xl text-stone-100">Related Archetypes</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {complementaryArchetypes.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-stone-500">
                Complementary
              </h3>
              <div className="space-y-2">
                {complementaryArchetypes.map((a) => {
                  if (!a) return null
                  const aColor = ARCHETYPE_COLORS[a.color] ?? ARCHETYPE_COLORS['stone']
                  return (
                    <Link
                      key={a.slug}
                      href={`/archetypes/${a.slug}`}
                      className="flex items-center gap-3 rounded-lg border border-stone-800 bg-stone-900/50 px-4 py-3 transition-colors hover:border-stone-700"
                    >
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ring-1 ${aColor}`}
                      >
                        {a.symbol}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-stone-200">{a.name}</div>
                        <div className="text-xs text-stone-500">{a.tagline}</div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
          {shadowArchetypes.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-stone-500">
                Shadow Counterparts
              </h3>
              <div className="space-y-2">
                {shadowArchetypes.map((a) => {
                  if (!a) return null
                  const aColor = ARCHETYPE_COLORS[a.color] ?? ARCHETYPE_COLORS['stone']
                  return (
                    <Link
                      key={a.slug}
                      href={`/archetypes/${a.slug}`}
                      className="flex items-center gap-3 rounded-lg border border-stone-800 bg-stone-900/50 px-4 py-3 transition-colors hover:border-stone-700"
                    >
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ring-1 ${aColor}`}
                      >
                        {a.symbol}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-stone-200">{a.name}</div>
                        <div className="text-xs text-stone-500">{a.tagline}</div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-8 text-center">
        <p className="mb-4 text-stone-400">
          Curious which archetype you carry? Take the psychological assessment to find out.
        </p>
        <Link
          href="/assessment"
          className="inline-flex items-center gap-2 rounded-lg bg-stone-100 px-5 py-2.5 text-sm font-medium text-stone-900 transition-colors hover:bg-white"
        >
          Take the Assessment
        </Link>
      </div>
    </div>
  )
}
