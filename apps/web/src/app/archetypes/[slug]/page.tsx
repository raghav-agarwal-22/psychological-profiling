import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ARCHETYPES, ARCHETYPE_BY_SLUG, ARCHETYPE_COLORS } from '@/lib/archetypes'
import { getArchetypeDeepDive } from '@/lib/archetype-deepdives'

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

  const deepDive = getArchetypeDeepDive(params.slug)

  const colorClasses = ARCHETYPE_COLORS[archetype.color] ?? ARCHETYPE_COLORS['stone']
  const complementaryArchetypes = (deepDive?.complementaryArchetypes ?? archetype.complementaryArchetypes)
    .map((slug) => ARCHETYPE_BY_SLUG[slug])
    .filter(Boolean)
  const shadowArchetypeSlug = deepDive?.shadowArchetype
  const shadowCounterparts = shadowArchetypeSlug
    ? [ARCHETYPE_BY_SLUG[shadowArchetypeSlug]].filter(Boolean)
    : archetype.shadowArchetypes.map((slug) => ARCHETYPE_BY_SLUG[slug]).filter(Boolean)

  // Split deep-dive description into paragraphs for rendering
  const descriptionParagraphs = deepDive
    ? deepDive.description.split('\n\n').filter(Boolean)
    : [archetype.description]

  const shadowParagraphs = deepDive
    ? deepDive.shadowExpression.split('\n\n').filter(Boolean)
    : [archetype.shadowExpression]

  const growthParagraphs = deepDive
    ? deepDive.growthPath.split('\n\n').filter(Boolean)
    : [archetype.growthPath]

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

      {/* Hero */}
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
      </div>

      {/* Description paragraphs */}
      <section className="mb-10 space-y-4">
        {descriptionParagraphs.map((para, i) => (
          <p key={i} className="leading-relaxed text-stone-300">
            {para}
          </p>
        ))}
      </section>

      {/* Core themes as chips */}
      {deepDive && (
        <section className="mb-10">
          <h2 className="mb-4 font-serif text-2xl text-stone-100">Core Themes</h2>
          <div className="flex flex-wrap gap-2">
            {deepDive.coreThemes.map((theme) => (
              <span
                key={theme}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium ${colorClasses}`}
              >
                {theme}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Strengths & Challenges (from base archetype data) */}
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

      {/* Shadow Expression */}
      <section className="mb-10 rounded-xl border border-rose-900/40 bg-rose-950/20 p-6">
        <h2 className="mb-4 font-serif text-xl text-rose-300">Shadow Expression</h2>
        <div className="space-y-3">
          {shadowParagraphs.map((para, i) => (
            <p key={i} className="leading-relaxed text-stone-300">
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* Mythological Roots */}
      <section className="mb-10">
        <h2 className="mb-4 font-serif text-2xl text-stone-100">Mythological Roots</h2>
        {deepDive ? (
          <p className="leading-relaxed text-stone-300">{deepDive.mythologicalRoots}</p>
        ) : (
          <ul className="space-y-3">
            {archetype.mythologicalReferences.map((ref) => (
              <li key={ref} className="flex gap-3 text-stone-300">
                <span className="mt-1 shrink-0 text-stone-500">◎</span>
                <span className="leading-relaxed">{ref}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Famous Examples */}
      <section className="mb-10">
        <h2 className="mb-4 font-serif text-2xl text-stone-100">Famous Examples</h2>
        <div className="flex flex-wrap gap-2">
          {(deepDive?.famousExamples ?? archetype.famousExamples).map((example) => (
            <span
              key={example}
              className="rounded-full border border-stone-700 bg-stone-800 px-3 py-1.5 text-sm text-stone-300"
            >
              {example}
            </span>
          ))}
        </div>
      </section>

      {/* Growth Path */}
      <section className="mb-10 rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-6">
        <h2 className="mb-4 font-serif text-xl text-emerald-300">Growth Path</h2>
        <div className="space-y-3">
          {growthParagraphs.map((para, i) => (
            <p key={i} className="leading-relaxed text-stone-300">
              {para}
            </p>
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
          {shadowCounterparts.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-stone-500">
                Shadow Counterpart
              </h3>
              <div className="space-y-2">
                {shadowCounterparts.map((a) => {
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
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-8 text-center">
        <p className="mb-1 font-serif text-lg text-stone-200">Discover your archetype</p>
        <p className="mb-5 text-sm text-stone-400">
          Take the psychological assessment to find out which archetype you carry — and what it reveals about your strengths, shadows, and growth edge.
        </p>
        <Link
          href="/assessment"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
        >
          Take the Assessment
        </Link>
      </div>
    </div>
  )
}
