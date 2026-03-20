import type { Metadata } from 'next'
import Link from 'next/link'
import { posts } from './posts'

// Blog index: revalidate daily — static content, cache aggressively under PH traffic
export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Blog — Psychology, Self-Understanding & Personal Growth',
  description:
    'Explore the science of personality, attachment, values, and personal growth. Evidence-based guides to understanding yourself more deeply.',
  openGraph: {
    title: 'Innermind Blog — Psychology & Self-Understanding',
    description:
      'Explore the science of personality, attachment, values, and personal growth.',
  },
}

const categoryColors: Record<string, string> = {
  'Personality Science': 'text-amber-400 bg-amber-400/10',
  'Relationships': 'text-rose-400 bg-rose-400/10',
  'Values & Meaning': 'text-emerald-400 bg-emerald-400/10',
  'Depth Psychology': 'text-violet-400 bg-violet-400/10',
  'Personal Growth': 'text-sky-400 bg-sky-400/10',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogPage() {
  const sorted = [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
  const featured = sorted[0]
  const rest = sorted.slice(1)

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Header */}
      <div className="mb-14 text-center">
        <h1 className="mb-4 font-serif text-4xl font-medium text-stone-100 sm:text-5xl">
          The Innermind Blog
        </h1>
        <p className="mx-auto max-w-xl text-stone-400">
          Science-backed writing on personality psychology, self-understanding, relationships, and
          personal growth.
        </p>
      </div>

      {/* Featured post */}
      <Link
        href={`/blog/${featured.slug}`}
        className="group mb-14 block rounded-2xl border border-stone-800 bg-stone-900/50 p-8 transition hover:border-stone-700 hover:bg-stone-900"
      >
        <div className="mb-4 flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${categoryColors[featured.category] ?? 'text-stone-400 bg-stone-800'}`}
          >
            {featured.category}
          </span>
          <span className="text-xs text-stone-500">{featured.readingTime} min read</span>
        </div>
        <h2 className="mb-3 font-serif text-2xl font-medium text-stone-100 group-hover:text-amber-300 transition sm:text-3xl">
          {featured.title}
        </h2>
        <p className="mb-4 text-stone-400 leading-relaxed">{featured.description}</p>
        <span className="text-xs text-stone-500">{formatDate(featured.publishedAt)}</span>
      </Link>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col rounded-xl border border-stone-800 bg-stone-900/40 p-6 transition hover:border-stone-700 hover:bg-stone-900"
          >
            <div className="mb-3 flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[post.category] ?? 'text-stone-400 bg-stone-800'}`}
              >
                {post.category}
              </span>
              <span className="text-xs text-stone-500">{post.readingTime} min</span>
            </div>
            <h3 className="mb-2 font-serif text-lg font-medium text-stone-100 group-hover:text-amber-300 transition leading-snug">
              {post.title}
            </h3>
            <p className="mb-4 flex-1 text-sm text-stone-400 leading-relaxed line-clamp-3">
              {post.description}
            </p>
            <span className="text-xs text-stone-500">{formatDate(post.publishedAt)}</span>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-10 text-center">
        <h2 className="mb-3 font-serif text-2xl font-medium text-stone-100">
          Ready to understand yourself deeply?
        </h2>
        <p className="mb-6 text-stone-400">
          Take five validated assessments and receive an AI-synthesized psychological portrait — free.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-8 py-3 text-sm font-semibold text-stone-950 hover:bg-amber-400 transition"
        >
          Take your free assessment →
        </Link>
      </div>
    </div>
  )
}
