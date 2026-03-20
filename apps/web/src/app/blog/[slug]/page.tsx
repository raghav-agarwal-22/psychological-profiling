import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllSlugs, getPost } from '../posts'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost(params.slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

function renderMarkdown(content: string): string {
  return content
    .trim()
    .replace(/^## (.+)$/gm, '<h2 class="mt-10 mb-4 font-serif text-2xl font-medium text-stone-100">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="mt-8 mb-3 font-serif text-xl font-medium text-stone-200">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-stone-100">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic text-stone-300">$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-amber-400 underline underline-offset-2 hover:text-amber-300">$1</a>')
    .replace(/^\| (.+) \|$/gm, (_match: string, row: string) => {
      const cells = row.split(' | ')
      const isHeader = false
      const tag = isHeader ? 'th' : 'td'
      return `<tr>${cells.map((c: string) => `<${tag} class="border border-stone-700 px-4 py-2 text-stone-300 text-sm">${c}</${tag}>`).join('')}</tr>`
    })
    .replace(/(<tr>.*<\/tr>\n?)+/gs, (match: string) => `<div class="overflow-x-auto my-6"><table class="w-full border-collapse">${match}</table></div>`)
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-stone-300 leading-relaxed">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/gs, (match: string) => `<ul class="my-4 space-y-1">${match}</ul>`)
    .replace(/\n\n([^<\n][^\n]+)/g, '\n\n<p class="my-4 text-stone-300 leading-relaxed">$1</p>')
    .replace(/^([^<\n][^\n]+)$/gm, '<p class="my-4 text-stone-300 leading-relaxed">$1</p>')
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

export default function BlogPostPage({ params }: Props) {
  const post = getPost(params.slug)
  if (!post) notFound()

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm text-stone-500">
        <Link href="/blog" className="hover:text-stone-300 transition">Blog</Link>
        <span>›</span>
        <span className="text-stone-400">{post.category}</span>
      </div>

      {/* Header */}
      <header className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${categoryColors[post.category] ?? 'text-stone-400 bg-stone-800'}`}
          >
            {post.category}
          </span>
          <span className="text-xs text-stone-500">{post.readingTime} min read</span>
          <span className="text-xs text-stone-500">{formatDate(post.publishedAt)}</span>
        </div>
        <h1 className="mb-4 font-serif text-3xl font-medium text-stone-100 leading-tight sm:text-4xl">
          {post.title}
        </h1>
        <p className="text-lg text-stone-400 leading-relaxed">{post.description}</p>
      </header>

      {/* Content */}
      <article
        className="prose-invert"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
      />

      {/* CTA */}
      <div className="mt-16 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center">
        <h2 className="mb-3 font-serif text-xl font-medium text-stone-100">
          Discover your psychological portrait
        </h2>
        <p className="mb-5 text-stone-400">
          Five validated frameworks — Big Five, Schwartz Values, Attachment Style, Enneagram, and
          Jungian Archetypes — synthesized by AI into one portrait.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-8 py-3 text-sm font-semibold text-stone-950 hover:bg-amber-400 transition"
        >
          Take your free assessment →
        </Link>
      </div>

      {/* Back link */}
      <div className="mt-8 text-center">
        <Link href="/blog" className="text-sm text-stone-500 hover:text-stone-300 transition">
          ← Back to all posts
        </Link>
      </div>
    </div>
  )
}
