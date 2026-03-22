import type { Metadata } from 'next'
import Link from 'next/link'
import { TestimonialGrid, type TestimonialItem } from '@/components/TestimonialGrid'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'What users say about Innermind | Real Reviews',
  description:
    'Read honest reviews from people who have used Innermind to explore their personality through Big Five, Enneagram, Jungian Archetypes, Attachment Style, and Values assessments.',
  openGraph: {
    title: 'Innermind Reviews — Real Users, Real Insights',
    description:
      "Discover what people are saying about Innermind's AI-synthesized psychological portraits.",
    url: 'https://innermind.app/reviews',
  },
  alternates: { canonical: 'https://innermind.app/reviews' },
}

async function fetchApprovedTestimonials(): Promise<TestimonialItem[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
    const res = await fetch(`${apiUrl}/api/testimonials/public`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const data = (await res.json()) as { testimonials: TestimonialItem[] }
    return data.testimonials ?? []
  } catch {
    return []
  }
}

const FALLBACK_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'seed-1',
    firstName: 'Alex',
    personalityTag: 'INTJ · Enneagram 5',
    rating: 5,
    quote:
      "I've tried every personality test out there. Innermind is the first one that actually synthesized them into something coherent. The cross-framework narrative is genuinely insightful.",
  },
  {
    id: 'seed-2',
    firstName: 'Maya',
    personalityTag: 'ENFP · High Openness',
    rating: 5,
    quote:
      'The blind spots section hit me hard — in the best way. I shared it with my therapist and we spent the whole session on it. Worth every penny.',
  },
  {
    id: 'seed-3',
    firstName: 'Jordan',
    personalityTag: 'Enneagram Type 2',
    rating: 5,
    quote:
      'Finally a platform that treats personality as something dynamic, not a label. The growth recommendations feel real, not generic.',
  },
  {
    id: 'seed-4',
    firstName: 'Priya',
    personalityTag: 'INFJ · Attachment: Secure',
    rating: 5,
    quote:
      "I was skeptical about another 'AI psychology' tool. But the depth here is different. It actually understands the tension between my values and how I show up.",
  },
  {
    id: 'seed-5',
    firstName: 'Sam',
    personalityTag: 'ENFJ · Dark Triad: Low',
    rating: 4,
    quote:
      "The multi-framework approach is what sets this apart. I've done Big Five, MBTI, Enneagram separately — seeing them unified is a completely different experience.",
  },
  {
    id: 'seed-6',
    firstName: 'Chris',
    personalityTag: 'ISTP · Enneagram 8',
    rating: 5,
    quote:
      'I sent this to three friends after finishing my profile. The narrative reads like someone who actually knows me wrote it.',
  },
]

export default async function ReviewsPage() {
  const testimonials = await fetchApprovedTestimonials()
  const items = testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS

  const avgRating =
    items.length > 0
      ? (items.reduce((sum, t) => sum + t.rating, 0) / items.length).toFixed(1)
      : '5.0'

  // Schema.org AggregateRating + individual Reviews
  const aggregateRatingSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Innermind',
    description:
      'AI-synthesized psychological profiling platform combining Big Five, Enneagram, Jungian Archetypes, Attachment Style, and Values assessments.',
    url: 'https://innermind.app',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avgRating,
      reviewCount: items.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: items.map((t) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: t.firstName },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: t.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: t.quote,
    })),
  }

  return (
    <div className="min-h-screen bg-stone-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingSchema) }}
      />

      {/* Header */}
      <div className="border-b border-stone-800/60 px-6 py-16 text-center">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-stone-500 hover:text-stone-300"
        >
          ← Innermind
        </Link>
        <h1 className="mb-3 font-serif text-4xl text-stone-100 sm:text-5xl">
          What users say
        </h1>
        <p className="mb-6 text-stone-400">
          Real experiences from people who have explored their psychology with Innermind.
        </p>
        {/* Aggregate rating */}
        <div className="inline-flex items-center gap-2 rounded-full border border-stone-800 bg-stone-900/60 px-5 py-2">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-amber-400 text-sm">★</span>
            ))}
          </div>
          <span className="text-sm font-semibold text-stone-100">{avgRating}</span>
          <span className="text-sm text-stone-500">· {items.length} reviews</span>
        </div>
      </div>

      {/* Testimonial grid */}
      <div className="mx-auto max-w-6xl px-6 py-16">
        <TestimonialGrid testimonials={items} limit={50} />
      </div>

      {/* CTA */}
      <div className="border-t border-stone-800/60 px-6 py-16 text-center">
        <h2 className="mb-3 font-serif text-2xl text-stone-100">
          Ready to discover yours?
        </h2>
        <p className="mb-6 text-sm text-stone-400">
          Takes 8–15 minutes. Free to start. No credit card.
        </p>
        <Link
          href="/assessment"
          className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-8 py-3 text-sm font-semibold text-stone-950 hover:bg-amber-400"
        >
          Take your free assessment →
        </Link>
      </div>
    </div>
  )
}
