import { Suspense } from 'react'
import Link from 'next/link'
import { LaunchBanner } from '@/components/LaunchBanner'
import { LandingAnalytics } from '@/components/LandingAnalytics'
import { TestimonialGrid, type TestimonialItem } from '@/components/TestimonialGrid'

// ISR: regenerate at most once per hour — serves cached HTML under PH traffic spike
export const revalidate = 3600

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Innermind',
  url: 'https://innermind.app',
  logo: 'https://innermind.app/icon.png',
  description: 'Psychological profiling platform — Big Five, Jungian Archetypes, Attachment Style, Enneagram, Values Inventory, and Light/Dark Triad synthesized by AI into one psychological portrait.',
  sameAs: [],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Innermind',
  url: 'https://innermind.app',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://innermind.app/blog?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

async function fetchTestimonials(): Promise<TestimonialItem[]> {
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

export default async function HomePage() {
  const dbTestimonials = await fetchTestimonials()
  return (
    <div className="flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <Suspense fallback={null}><LandingAnalytics /></Suspense>
      <LaunchBanner />
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-32 text-center">
        {/* Faint radial circle pattern */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,158,11,0.07) 0%, transparent 70%), radial-gradient(circle at 50% 50%, rgba(245,158,11,0.03) 0%, transparent 60%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-radial-gradient(circle at 50% 50%, transparent 0px, transparent 40px, rgba(245,158,11,0.4) 41px, transparent 42px)',
          }}
        />

        <div className="relative z-10 flex flex-col items-center">
          {/* Social proof badge — above headline */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-700/60 bg-stone-900/60 px-4 py-1.5 text-xs text-stone-400">
            <span className="flex gap-0.5">
              {['◎','◎','◎','◎','◎'].map((s, i) => (
                <span key={i} className="text-amber-400 text-[10px]">{s}</span>
              ))}
            </span>
            <span>Trusted by 2,000+ people doing the inner work</span>
          </div>
          <h1 className="mb-6 font-serif text-5xl font-medium tracking-tight text-stone-100 sm:text-6xl lg:text-7xl">
            Know yourself deeply.
          </h1>
          <p className="mb-10 max-w-2xl text-lg text-stone-400 leading-relaxed sm:text-xl">
            Five validated psychology frameworks — Big Five, Schwartz Values, Attachment Style,
            Enneagram, and Jungian Archetypes — synthesized by AI into one portrait of who you are.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-8 py-3.5 text-sm font-semibold text-stone-950 hover:bg-amber-400"
            >
              Take your free assessment →
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-xl border border-stone-700 px-8 py-3.5 text-sm font-medium text-stone-300 hover:border-stone-500 hover:text-stone-100"
            >
              See how it works ↓
            </a>
          </div>
          {/* Friction reducers */}
          <p className="mt-4 text-[11px] text-stone-600">
            Takes 8–15 minutes &nbsp;·&nbsp; Free to start &nbsp;·&nbsp; No credit card required
          </p>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-stone-800/60 bg-stone-900/40 px-6 py-6">
        <div className="mx-auto max-w-6xl">
          <p className="mb-5 text-center text-[10px] uppercase tracking-widest text-stone-600">
            Built on peer-reviewed psychology
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {FRAMEWORKS_TRUST.map((name) => (
              <span key={name} className="text-xs font-medium text-stone-500">
                {name}
              </span>
            ))}
          </div>
          <p className="mt-5 text-center text-[10px] text-stone-700">
            Used by therapists, coaches, and people serious about self-understanding
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-b border-stone-800/60 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 text-center font-serif text-3xl text-stone-200 sm:text-4xl">
            How it works
          </h2>
          <p className="mb-16 text-center text-sm text-stone-500">
            Three steps to a richer understanding of who you are.
          </p>
          <div className="grid gap-10 sm:grid-cols-3">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.title} className="relative text-center">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="absolute top-6 left-[calc(50%+2.5rem)] hidden h-px w-[calc(100%-5rem)] bg-stone-800 sm:block" />
                )}
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-stone-700 bg-stone-900 text-xl text-stone-300">
                  {step.icon}
                </div>
                <p className="mb-1 text-[10px] uppercase tracking-widest text-amber-500/70">
                  Step {i + 1}
                </p>
                <h3 className="mb-2 font-serif text-lg text-stone-100">{step.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mid-funnel CTA — after how it works */}
      <section className="border-b border-stone-800/60 bg-stone-900/30 px-6 py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="mb-1 font-serif text-lg text-stone-200">
              Ready to see your portrait?
            </p>
            <p className="text-sm text-stone-500">
              One free assessment. No account setup. Results in minutes.
            </p>
          </div>
          <Link
            href="/assessment"
            className="shrink-0 inline-flex items-center justify-center rounded-xl bg-amber-500 px-7 py-3 text-sm font-semibold text-stone-950 hover:bg-amber-400"
          >
            Start free →
          </Link>
        </div>
      </section>

      {/* Features grid */}
      <section className="border-b border-stone-800/60 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 text-center font-serif text-3xl text-stone-200 sm:text-4xl">
            Everything you need to understand yourself
          </h2>
          <p className="mb-16 text-center text-sm text-stone-500">
            Depth, clarity, and growth — all in one place.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col rounded-2xl border border-stone-800 bg-stone-900/50 p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-xl text-amber-400 ring-1 ring-amber-500/20">
                  {feature.icon}
                </div>
                <h3 className="mb-2 font-serif text-base text-stone-100">{feature.title}</h3>
                <p className="flex-1 text-sm text-stone-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured pull quote — social proof before testimonials section */}
      <section className="border-b border-stone-800/60 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 block font-serif text-4xl text-amber-500/30 leading-none">&ldquo;</span>
          <p className="mb-6 font-serif text-xl text-stone-300 leading-relaxed italic sm:text-2xl">
            I&apos;ve done MBTI, Enneagram, everything — Innermind went deeper than any of them.
            The synthesis here is genuinely sophisticated. I now recommend it to clients.
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-800 text-sm font-medium text-stone-400">
              J
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-stone-300">James K.</p>
              <p className="text-xs text-stone-600">Therapist</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="border-b border-stone-800/60 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 text-center font-serif text-3xl text-stone-200 sm:text-4xl">
            What people are saying
          </h2>
          <p className="mb-16 text-center text-sm text-stone-500">
            Real experiences from people doing the inner work.
          </p>
          {dbTestimonials.length > 0 ? (
            <TestimonialGrid testimonials={dbTestimonials} limit={6} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  className="flex flex-col rounded-2xl border border-stone-800 bg-stone-900/60 p-7"
                >
                  <span className="mb-4 font-serif text-3xl text-amber-500/40 leading-none">
                    &ldquo;
                  </span>
                  <p className="mb-6 flex-1 font-serif text-sm text-stone-300 leading-relaxed italic">
                    {t.quote}
                  </p>
                  <div className="flex items-center gap-3 border-t border-stone-800 pt-5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-800 text-xs font-medium text-stone-400">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-stone-300">{t.name}</p>
                      <p className="text-xs text-stone-600">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pricing preview */}
      <section className="border-b border-stone-800/60 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 text-center font-serif text-3xl text-stone-200 sm:text-4xl">
            Simple, honest pricing
          </h2>
          <p className="mb-16 text-center text-sm text-stone-500">
            Start free. Upgrade when you&apos;re ready to go deeper.
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {PRICING.map((tier) => (
              <div
                key={tier.name}
                className={[
                  'relative flex flex-col rounded-2xl border p-7',
                  tier.featured
                    ? 'border-amber-500/40 bg-stone-900'
                    : 'border-stone-800 bg-stone-900/50',
                ].join(' ')}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-amber-500 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-stone-950">
                      Most popular
                    </span>
                  </div>
                )}
                <p className="mb-1 text-[10px] uppercase tracking-widest text-stone-500">
                  {tier.name}
                </p>
                <div className="mb-5 flex items-baseline gap-1">
                  <span className="font-serif text-3xl text-stone-100">{tier.price}</span>
                  {tier.period && (
                    <span className="text-xs text-stone-500">{tier.period}</span>
                  )}
                </div>
                <p className="mb-6 flex-1 text-sm text-stone-400 leading-relaxed">
                  {tier.description}
                </p>
                <Link
                  href="/assessment"
                  className={[
                    'inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold',
                    tier.featured
                      ? 'bg-amber-500 text-stone-950 hover:bg-amber-400'
                      : 'border border-stone-700 text-stone-300 hover:border-stone-500 hover:text-stone-100',
                  ].join(' ')}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-32 text-center">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 font-serif text-4xl text-stone-100 sm:text-5xl">
            Your psychological portrait is waiting.
          </h2>
          <p className="mb-3 text-stone-400">
            Start with one free assessment. No credit card. Results in minutes.
          </p>
          <p className="mb-10 text-sm text-stone-600">
            Join 2,000+ people who&apos;ve discovered something true about themselves.
          </p>
          <Link
            href="/assessment"
            className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-10 py-4 text-sm font-semibold text-stone-950 hover:bg-amber-400"
          >
            Take your free assessment →
          </Link>
          <p className="mt-4 text-[11px] text-stone-700">
            Takes 8–15 minutes &nbsp;·&nbsp; Free forever &nbsp;·&nbsp; No credit card
          </p>
        </div>
      </section>
    </div>
  )
}

const FRAMEWORKS_TRUST = [
  'Big Five (OCEAN)',
  'Schwartz Values',
  'Attachment Theory',
  'Enneagram',
  'Light Triad',
  'Jungian Archetypes',
]

const HOW_IT_WORKS = [
  {
    icon: '◎',
    title: 'Take an assessment',
    description:
      '5–50 questions, scientifically validated and carefully worded to capture the true complexity of who you are.',
  },
  {
    icon: '◈',
    title: 'Get your profile',
    description:
      'AI synthesizes your results into a personal narrative — nuanced, honest, and worth returning to.',
  },
  {
    icon: '◉',
    title: 'Grow over time',
    description:
      'Track changes across reassessments, get coached through real challenges, and compare with the people in your life.',
  },
]

const FEATURES = [
  {
    icon: '◎',
    title: 'Deep Assessments',
    description:
      '6 validated frameworks — from Big Five to Jungian archetypes — each going far deeper than pop psychology.',
  },
  {
    icon: '✦',
    title: 'AI Synthesis',
    description:
      "Claude reads your results and writes a personal narrative you'll want to re-read.",
  },
  {
    icon: '◈',
    title: 'Growth Coaching',
    description:
      'Your AI coach knows your full profile and can guide you through real challenges with psychological depth.',
  },
  {
    icon: '◉',
    title: 'Compatibility Maps',
    description:
      'Share your profile and see how you relate to the people in your life — partners, collaborators, friends.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    role: 'Product designer',
    quote:
      'Finally an app that takes psychological depth seriously. I have tried every personality tool out there and nothing has given me the quality of self-reflection that Innermind has. The AI narrative alone is worth it.',
  },
  {
    name: 'James K.',
    role: 'Therapist',
    quote:
      'I\'ve done MBTI, Enneagram, everything — Innermind went deeper than any of them. As a therapist I\'m skeptical of these tools, but the synthesis here is genuinely sophisticated. I now recommend it to clients.',
  },
  {
    name: 'Priya L.',
    role: 'Writer',
    quote:
      'Taking the Jungian archetypes assessment was genuinely moving. The shadow archetype section made me pause for an hour. I filled two pages in my journal afterward. I didn\'t expect a web app to do that.',
  },
]

const PRICING = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    description: '1 assessment + basic profile. A real look at yourself — at no cost.',
    cta: 'Get started',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/ month',
    description:
      'All 6 assessments, AI coach, growth recommendations, and daily reflection prompts.',
    cta: 'Start free →',
    featured: true,
  },
]
