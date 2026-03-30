import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllSlugs, getPost, getRelatedPosts } from '../posts'
import { EmailCaptureBlock } from '@/components/EmailCaptureBlock'

// Blog posts are statically generated at build time; revalidate daily for new posts
export const revalidate = 86400

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
      url: `https://innermind.app/blog/${post.slug}`,
      siteName: 'Innermind',
      images: [
        {
          url: 'https://innermind.app/og-image.png',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: ['https://innermind.app/og-image.png'],
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

interface RelatedAssessment {
  label: string
  title: string
  description: string
  href: string
  icon: string
}

const relatedAssessments: Record<string, RelatedAssessment> = {
  'what-is-big-five-personality-test': {
    label: 'Take the free Big Five test',
    title: 'Measure your Big Five personality',
    description: 'Get your OCEAN scores across all five dimensions in 10–15 minutes. Free, instant results.',
    href: '/quiz/big-five',
    icon: '◎',
  },
  'big-five-vs-mbti': {
    label: 'Take the free Big Five test',
    title: 'Try the science-backed alternative',
    description: 'Take the Big Five — the gold standard of personality science — and see how it compares to MBTI.',
    href: '/quiz/big-five',
    icon: '◎',
  },
  'attachment-styles-explained': {
    label: 'Take the free attachment test',
    title: 'Discover your attachment style',
    description: 'Are you secure, anxious, avoidant, or disorganized? Find out in 5 minutes — free, instant results.',
    href: '/quiz/attachment-style',
    icon: '◉',
  },
  'enneagram-vs-big-five': {
    label: 'Take both free tests',
    title: 'Get your Enneagram type and Big Five scores',
    description: 'Innermind gives you both free — and synthesizes them into one coherent portrait.',
    href: '/quiz/enneagram',
    icon: '◑',
  },
  'the-12-jungian-archetypes': {
    label: 'Discover your archetypes',
    title: 'Find your Jungian archetypes',
    description: 'Your psychological portrait includes Jungian archetypes alongside four other frameworks.',
    href: '/assessment',
    icon: '◈',
  },
  'schwartz-values-inventory': {
    label: 'Take the assessment',
    title: 'Measure your core values',
    description: 'Get your Schwartz Values Inventory scores — what actually drives your decisions.',
    href: '/assessment',
    icon: '◈',
  },
  'enneagram-attachment-style': {
    label: 'Take both free tests',
    title: 'Get your Enneagram type and attachment style',
    description: 'Take the free Enneagram quiz and attachment style test — then see how they interact.',
    href: '/quiz/enneagram',
    icon: '◑',
  },
  'dark-triad-personality-traits': {
    label: 'Take the free Dark Triad test',
    title: 'Measure your Dark Triad traits',
    description: 'Get your narcissism, Machiavellianism, and psychopathy scores — science-based, free assessment.',
    href: '/quiz/dark-triad',
    icon: '◎',
  },
  'introvert-vs-extrovert': {
    label: 'Take the free Big Five test',
    title: 'Get your full Extraversion profile',
    description: 'Discover exactly where you fall on the introvert–extrovert spectrum with your OCEAN scores.',
    href: '/quiz/big-five',
    icon: '◎',
  },
  'shadow-work-jung': {
    label: 'Discover your archetypes',
    title: 'Explore your Jungian archetype profile',
    description: 'Your psychological portrait includes Jungian archetypes alongside Big Five, values, attachment style, and Enneagram.',
    href: '/assessment',
    icon: '◈',
  },
  'personality-and-career': {
    label: 'Take the free DISC test',
    title: 'Map your behavioral style to career strengths',
    description: 'Get your DISC profile — Dominance, Influence, Steadiness, Compliance — and see how it shapes your work style.',
    href: '/quiz/disc',
    icon: '◎',
  },
  'neuroscience-of-personality': {
    label: 'Take your free assessment',
    title: 'Discover your biological personality substrate',
    description: 'Five validated frameworks synthesized into one portrait — your starting point for understanding who you are.',
    href: '/assessment',
    icon: '◎',
  },
  'free-big-five-personality-test-online': {
    label: 'Take the free Big Five test',
    title: 'Get your OCEAN scores in 10 minutes',
    description: 'Measure your Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism — free, instant results.',
    href: '/quiz/big-five',
    icon: '◎',
  },
  'free-enneagram-test-with-results': {
    label: 'Take the free Enneagram test',
    title: 'Find your Enneagram type instantly',
    description: 'Discover your core type, wing, and growth direction — no email required.',
    href: '/quiz/enneagram',
    icon: '◑',
  },
  'free-16-personality-types-test': {
    label: 'Take the free 16 types test',
    title: 'Discover your MBTI-style type',
    description: 'Find out if you are INTJ, ENFP, INFJ, or one of the other 13 types — free with instant results.',
    href: '/quiz/16-types',
    icon: '◎',
  },
  'free-dark-triad-test-online': {
    label: 'Take the free Dark Triad test',
    title: 'Measure your Dark Triad traits',
    description: 'Get your narcissism, Machiavellianism, and psychopathy scores — science-based, free assessment.',
    href: '/quiz/dark-triad',
    icon: '◈',
  },
  'free-attachment-style-test-online': {
    label: 'Take the free attachment test',
    title: 'Discover your attachment style',
    description: 'Are you secure, anxious, avoidant, or disorganized? Find out in 5 minutes — free, instant results.',
    href: '/quiz/attachment-style',
    icon: '◉',
  },
  'which-personality-test-is-most-accurate': {
    label: 'Start with the most accurate test',
    title: 'Take the Big Five — the gold standard',
    description: 'The most scientifically validated personality test. Get your scores across five dimensions in 10 minutes.',
    href: '/quiz/big-five',
    icon: '◎',
  },
  'personality-test-for-self-discovery': {
    label: 'Begin your self-discovery',
    title: 'Take five assessments, get one portrait',
    description: 'Big Five, Enneagram, attachment style, 16 types, and values — synthesized by AI into one psychological portrait.',
    href: '/assessment',
    icon: '◎',
  },
  'enneagram-vs-16-personalities': {
    label: 'Take both tests',
    title: 'Get your Enneagram type and 16 types result',
    description: 'See how your motivations (Enneagram) and cognitive preferences (16 types) interact.',
    href: '/quiz/enneagram',
    icon: '◑',
  },
  'best-free-personality-tests-2026': {
    label: 'Take the #1 ranked test',
    title: 'Start with the Big Five personality test',
    description: 'Ranked #1 for scientific accuracy — get your OCEAN scores free in 10 minutes.',
    href: '/quiz/big-five',
    icon: '◎',
  },
  'how-to-find-your-personality-type': {
    label: 'Start finding your type',
    title: 'Take the Big Five as your first step',
    description: 'The recommended starting point — measure your five fundamental personality dimensions, then build from there.',
    href: '/quiz/big-five',
    icon: '◎',
  },
  'how-to-use-psychology-to-understand-yourself': {
    label: 'Start your self-discovery',
    title: 'Take five frameworks at once',
    description: 'Big Five, Enneagram, attachment style, values, and archetypes — synthesized by AI into one portrait.',
    href: '/assessment',
    icon: '◎',
  },
  'can-your-personality-change': {
    label: 'Get your baseline',
    title: 'Measure where you are now',
    description: 'Take the Big Five test and track how your scores shift over time.',
    href: '/quiz/big-five',
    icon: '◎',
  },
  'psychology-tools-for-personal-growth': {
    label: 'Try all the tools',
    title: 'Take five free personality tests',
    description: 'Big Five, Enneagram, attachment style, DISC, and more — all free with instant results.',
    href: '/quizzes',
    icon: '◎',
  },
  'enneagram-type-1': {
    label: 'Take the free Enneagram test',
    title: 'Find your Enneagram type',
    description: 'Discover your core type, wing, and growth direction — no email required.',
    href: '/quiz/enneagram',
    icon: '◑',
  },
  'enneagram-type-2': {
    label: 'Take the free Enneagram test',
    title: 'Find your Enneagram type',
    description: 'Discover your core type, wing, and growth direction — no email required.',
    href: '/quiz/enneagram',
    icon: '◑',
  },
  'enneagram-type-3': {
    label: 'Take the free Enneagram test',
    title: 'Find your Enneagram type',
    description: 'Discover your core type, wing, and growth direction — no email required.',
    href: '/quiz/enneagram',
    icon: '◑',
  },
  'enneagram-type-4': {
    label: 'Take the free Enneagram test',
    title: 'Find your Enneagram type',
    description: 'Discover your core type, wing, and growth direction — no email required.',
    href: '/quiz/enneagram',
    icon: '◑',
  },
  'enneagram-type-5': {
    label: 'Take the free Enneagram test',
    title: 'Find your Enneagram type',
    description: 'Discover your core type, wing, and growth direction — no email required.',
    href: '/quiz/enneagram',
    icon: '◑',
  },
  'enneagram-type-6': {
    label: 'Take the free Enneagram test',
    title: 'Find your Enneagram type',
    description: 'Discover your core type, wing, and growth direction — no email required.',
    href: '/quiz/enneagram',
    icon: '◑',
  },
  'enneagram-type-7': {
    label: 'Take the free Enneagram test',
    title: 'Find your Enneagram type',
    description: 'Discover your core type, wing, and growth direction — no email required.',
    href: '/quiz/enneagram',
    icon: '◑',
  },
  'enneagram-type-8': {
    label: 'Take the free Enneagram test',
    title: 'Find your Enneagram type',
    description: 'Discover your core type, wing, and growth direction — no email required.',
    href: '/quiz/enneagram',
    icon: '◑',
  },
  'enneagram-type-9': {
    label: 'Take the free Enneagram test',
    title: 'Find your Enneagram type',
    description: 'Discover your core type, wing, and growth direction — no email required.',
    href: '/quiz/enneagram',
    icon: '◑',
  },
  'free-personality-test-accurate': {
    label: 'Take the most accurate test',
    title: 'Take the Big Five — the gold standard',
    description: 'The most scientifically validated personality test. Free, instant results in 10 minutes.',
    href: '/quiz/big-five',
    icon: '◎',
  },
  'attachment-style-quiz': {
    label: 'Take the free attachment test',
    title: 'Discover your attachment style',
    description: 'Are you secure, anxious, avoidant, or disorganized? Find out in 5 minutes — free.',
    href: '/quiz/attachment-style',
    icon: '◉',
  },
  'anxious-attachment-style': {
    label: 'Take the free attachment test',
    title: 'Find out if you have anxious attachment',
    description: 'A 5-minute quiz that identifies your attachment pattern — secure, anxious, avoidant, or disorganized.',
    href: '/quiz/attachment-style',
    icon: '◉',
  },
  'avoidant-attachment-style': {
    label: 'Take the free attachment test',
    title: 'Find out if you have avoidant attachment',
    description: 'A 5-minute quiz that identifies your attachment pattern — secure, anxious, avoidant, or disorganized.',
    href: '/quiz/attachment-style',
    icon: '◉',
  },
  'am-i-an-introvert': {
    label: 'Take the free Big Five test',
    title: 'Measure your Extraversion score',
    description: 'The Big Five gives you a precise Extraversion score — not a binary introvert/extrovert label.',
    href: '/quiz/big-five',
    icon: '◎',
  },
  'what-is-your-love-language-quiz': {
    label: 'Take the free love languages quiz',
    title: 'Find your love language',
    description: 'Discover how you give and receive love — Words, Acts, Gifts, Time, or Touch.',
    href: '/quiz/love-language',
    icon: '◉',
  },
  'five-love-languages-explained': {
    label: 'Take the free love languages quiz',
    title: 'Discover your love language',
    description: 'A short quiz that identifies your primary love language — free, instant results.',
    href: '/quiz/love-language',
    icon: '◉',
  },
  'disc-personality-assessment-guide': {
    label: 'Take the free DISC test',
    title: 'Get your DISC profile',
    description: 'Find out your Dominance, Influence, Steadiness, and Compliance scores — free, instant results.',
    href: '/quiz/disc',
    icon: '◎',
  },
  'innermind-vs-16personalities': {
    label: 'Take the free 16 types test',
    title: 'Try the 16 types test yourself',
    description: 'Find your MBTI-style type — INTJ, ENFP, INFJ, and 13 more. Free with instant results.',
    href: '/quiz/16-types',
    icon: '◎',
  },
  'entj-entp-compatibility': {
    label: 'Take the free 16 types test',
    title: 'Find your 16 personality type',
    description: 'Discover your cognitive function stack and see which types you are most compatible with.',
    href: '/quiz/16-types',
    icon: '◎',
  },
  'infj-infp-compatibility': {
    label: 'Take the free 16 types test',
    title: 'Find your 16 personality type',
    description: 'Discover your cognitive function stack and see which types you are most compatible with.',
    href: '/quiz/16-types',
    icon: '◎',
  },
  'famous-people-personality-types': {
    label: 'Take the free 16 types test',
    title: 'Find your 16 personality type',
    description: 'Discover your type — INTJ, ENFP, INFJ, and 13 more. Free with instant results.',
    href: '/quiz/16-types',
    icon: '◎',
  },
  'mbti-types-in-fiction': {
    label: 'Take the free 16 types test',
    title: 'Find your 16 personality type',
    description: 'Which fictional character shares your type? Find your cognitive function stack — free.',
    href: '/quiz/16-types',
    icon: '◎',
  },
  'attachment-style-and-personality-type': {
    label: 'Take both free tests',
    title: 'Get your attachment style and 16 types result',
    description: 'See how your relational patterns and cognitive type interact — both free, instant results.',
    href: '/quiz/attachment-style',
    icon: '◉',
  },
  'big-five-conscientiousness-career': {
    label: 'Take the free Big Five test',
    title: 'Get your Conscientiousness score',
    description: 'Find out exactly where you fall on the Conscientiousness dimension — and how it predicts career outcomes.',
    href: '/quiz/big-five',
    icon: '◎',
  },
  'jungian-archetypes-in-culture': {
    label: 'Discover your archetypes',
    title: 'Find your Jungian archetypes',
    description: 'Your full psychological portrait maps which of the 12 archetypes are most active in your psychology.',
    href: '/assessment',
    icon: '◈',
  },
  'enneagram-type-8-leadership': {
    label: 'Take the free Enneagram test',
    title: 'Find your Enneagram type',
    description: 'Discover your core type, wing, and leadership style — free, instant results.',
    href: '/quiz/enneagram',
    icon: '◑',
  },
  'enneagram-stress-response': {
    label: 'Take the free Enneagram test',
    title: 'Find your Enneagram type',
    description: 'Discover how your type responds to stress — and what your growth direction is.',
    href: '/quiz/enneagram',
    icon: '◑',
  },
  'schwartz-values-relationships': {
    label: 'Take the full assessment',
    title: 'Map your core values',
    description: 'Your Schwartz Values profile reveals what actually drives your decisions and relationship patterns.',
    href: '/assessment',
    icon: '◈',
  },
  'personality-change-research': {
    label: 'Get your baseline',
    title: 'Measure where you are now',
    description: 'Take the Big Five and track your personality changes over time with longitudinal scoring.',
    href: '/quiz/big-five',
    icon: '◎',
  },
  'what-is-moral-foundations-theory': {
    label: 'Explore your full profile',
    title: 'Discover how values shape your psychology',
    description: 'Your full psychological portrait includes Schwartz Values alongside Big Five, Enneagram, attachment, and archetypes.',
    href: '/assessment',
    icon: '◈',
  },
  'moral-foundations-test': {
    label: 'Take the full assessment',
    title: 'Go deeper than moral foundations',
    description: 'Your full portrait connects moral foundations to Big Five traits, values, and personality type.',
    href: '/assessment',
    icon: '◈',
  },
  'liberal-conservative-moral-psychology': {
    label: 'Explore your values',
    title: 'Understand the psychology behind your views',
    description: 'Your Big Five traits and Schwartz Values profile shape your moral psychology — discover yours.',
    href: '/quiz/big-five',
    icon: '◎',
  },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const WEB_URL = 'https://innermind.app'

export default function BlogPostPage({ params }: Props) {
  const post = getPost(params.slug)
  if (!post) notFound()

  const related = relatedAssessments[post.slug]
  const relatedPosts = getRelatedPosts(post.slug)
  const postUrl = `${WEB_URL}/blog/${post.slug}`

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { '@type': 'Organization', name: 'Innermind', url: WEB_URL },
    publisher: {
      '@type': 'Organization',
      name: 'Innermind',
      url: WEB_URL,
      logo: { '@type': 'ImageObject', url: `${WEB_URL}/icon.png` },
    },
    url: postUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    keywords: post.keywords.join(', '),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: WEB_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${WEB_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
    ],
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

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

      {/* Email capture */}
      <EmailCaptureBlock variant="blog" />

      {/* Related assessment CTA */}
      {related && (
        <div className="mt-12 rounded-2xl border border-stone-700 bg-stone-900/60 p-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-500">
            Related assessment
          </p>
          <div className="flex items-start gap-4">
            <span className="mt-0.5 text-2xl text-amber-400">{related.icon}</span>
            <div className="flex-1">
              <h3 className="mb-1 font-serif text-lg font-medium text-stone-100">{related.title}</h3>
              <p className="mb-4 text-sm text-stone-400 leading-relaxed">{related.description}</p>
              <Link
                href={related.href}
                className="inline-flex items-center rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-stone-950 hover:bg-amber-400 transition"
              >
                {related.label} →
              </Link>
            </div>
          </div>
        </div>
      )}

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

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-16 border-t border-stone-800 pt-12">
          <h2 className="mb-6 font-serif text-xl font-medium text-stone-100">More in {post.category}</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {relatedPosts.map((rp) => (
              <Link
                key={rp.slug}
                href={`/blog/${rp.slug}`}
                className="group rounded-xl border border-stone-800 bg-stone-900/40 p-4 transition-colors hover:border-stone-700"
              >
                <p className="mb-1.5 text-xs text-stone-500">{rp.readingTime} min read</p>
                <p className="text-sm font-medium text-stone-200 leading-snug group-hover:text-stone-100 transition-colors line-clamp-3">
                  {rp.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Back link */}
      <div className="mt-8 text-center">
        <Link href="/blog" className="text-sm text-stone-500 hover:text-stone-300 transition">
          ← Back to all posts
        </Link>
      </div>
    </div>
  )
}
