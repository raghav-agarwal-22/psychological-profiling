import type { Metadata } from 'next'
import Link from 'next/link'
import { ARCHETYPES, ARCHETYPE_COLORS } from '@/lib/archetypes'

export const metadata: Metadata = {
  title: 'The 12 Jungian Archetypes',
  description:
    'Explore the twelve Jungian archetypes — mythologically-grounded psychological patterns that shape how we think, feel, and move through the world.',
  openGraph: {
    title: 'The 12 Jungian Archetypes | Innermind',
    description:
      'Explore the twelve Jungian archetypes — mythologically-grounded psychological patterns that shape how we think, feel, and move through the world.',
  },
}

export default function ArchetypesIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-5xl text-stone-100">The 12 Archetypes</h1>
        <p className="mt-4 text-lg text-stone-400">
          Jungian psychology maps the psyche through twelve universal patterns — characters that
          appear in every culture's mythology, literature, and dream. Each archetype holds a
          particular energy, strength, and shadow.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ARCHETYPES.map((archetype) => {
          const colorClasses = ARCHETYPE_COLORS[archetype.color] ?? ARCHETYPE_COLORS['stone']
          return (
            <Link
              key={archetype.slug}
              href={`/archetypes/${archetype.slug}`}
              className="group rounded-xl border border-stone-800 bg-stone-900/50 p-5 transition-all hover:border-stone-700 hover:bg-stone-900"
            >
              <div className="mb-3 flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ring-1 ${colorClasses}`}
                >
                  {archetype.symbol}
                </span>
                <h2 className="font-serif text-lg text-stone-100 group-hover:text-white">
                  {archetype.name}
                </h2>
              </div>
              <p className="text-sm italic text-stone-500">{archetype.tagline}</p>
              <p className="mt-2 text-xs text-stone-600">{archetype.description}</p>
            </Link>
          )
        })}
      </div>

      <div className="mt-16 rounded-xl border border-stone-800 bg-stone-900/50 p-8 text-center">
        <p className="mb-4 text-stone-400">
          Discover your dominant archetype through our psychological assessment.
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
