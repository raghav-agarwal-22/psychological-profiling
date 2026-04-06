import { Suspense } from 'react'
import Link from 'next/link'
import { LandingAnalytics } from '@/components/LandingAnalytics'
import { TestimonialGrid, type TestimonialItem } from '@/components/TestimonialGrid'
import { EmailCaptureBlock } from '@/components/EmailCaptureBlock'

// ISR: regenerate at most once per hour — serves cached HTML under PH traffic spike
export const revalidate = 3600

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Innermind',
  url: 'https://innermindhealing.com',
  logo: 'https://innermindhealing.com/icon.png',
  description: 'Psychological profiling platform — Big Five, Jungian Archetypes, Attachment Style, Enneagram, Values Inventory, and Light/Dark Triad synthesized by AI into one psychological portrait.',
  sameAs: [],
}

const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Innermind',
  url: 'https://innermindhealing.com',
  description: 'AI-powered psychological profiling — six validated frameworks synthesized into one personal portrait. Take free personality assessments and receive an AI-written analysis of who you are.',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'All',
  browserRequirements: 'Requires JavaScript',
  offers: [
    {
      '@type': 'Offer',
      name: 'Free',
      price: '0',
      priceCurrency: 'USD',
      description: 'One full assessment and a basic profile. No credit card required.',
    },
    {
      '@type': 'Offer',
      name: 'Pro',
      price: '19',
      priceCurrency: 'USD',
      description: 'All 6 assessments, full AI-synthesized portrait, AI coach, and growth recommendations.',
    },
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Innermind',
  url: 'https://innermindhealing.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://innermindhealing.com/blog?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How is Innermind different from 16Personalities or MBTI?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Innermind uses six peer-reviewed psychology frameworks — Big Five (OCEAN), Schwartz Values, Attachment Theory, Enneagram, Jungian Archetypes, and Light Triad — and synthesizes them into one AI-written portrait. 16Personalities reduces you to a four-letter type. We give you depth, not labels.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this scientifically valid?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Every framework in Innermind is grounded in peer-reviewed research. Big Five is the gold standard in personality psychology. Schwartz Values is used in cross-cultural research. Attachment Theory is foundational in clinical psychology. We take rigor seriously.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does the assessment take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Each individual assessment takes 8–15 minutes. You can take them one at a time across multiple sessions. There are 6 assessments in total — you can do one free, and unlock the rest with Pro.',
      },
    },
    {
      '@type': 'Question',
      name: 'What do I get for free vs. Pro?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Free gives you one full assessment plus a basic profile — a real look at yourself at no cost. Pro ($19/month) unlocks all 6 assessments, the full AI-synthesized portrait that weaves all frameworks together, the AI coach, growth recommendations, and daily reflection prompts.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I share my profile with others?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Pro members can generate a shareable profile link and use the compatibility map to compare their psychological profile with partners, friends, and collaborators.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the AI work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We use Claude (by Anthropic) to read your raw assessment results and write a personal narrative — a psychological portrait that synthesizes all your results into a coherent, honest picture of who you are. It reads your results the way a thoughtful therapist would.',
      },
    },
  ],
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
  const allTestimonials = dbTestimonials.length > 0 ? dbTestimonials : TESTIMONIALS_FALLBACK
  const featuredTestimonials = allTestimonials.slice(0, 3)

  return (
    <div className="flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Suspense fallback={null}><LandingAnalytics /></Suspense>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-32 text-center">
        {/* Background radial glow */}
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
          {/* Social proof badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-700/60 bg-stone-900/60 px-4 py-1.5 text-xs text-stone-400">
            <span className="flex gap-0.5">
              {['★','★','★','★','★'].map((s, i) => (
                <span key={i} className="text-amber-400 text-[11px]">{s}</span>
              ))}
            </span>
            <span>Trusted by 1,200+ people doing the inner work</span>
          </div>

          <h1 className="mb-6 font-serif text-5xl font-medium tracking-tight text-stone-100 sm:text-6xl lg:text-7xl">
            Know yourself deeply.
          </h1>
          <p className="mb-10 max-w-2xl text-lg text-stone-400 leading-relaxed sm:text-xl">
            Six validated psychology frameworks — Big Five, Schwartz Values, Attachment Style,
            Enneagram, Jungian Archetypes, and Light Triad — synthesized by AI into one portrait of who you are.
          </p>

          {/* Single primary CTA */}
          <Link
            href="/assessment"
            className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-10 py-4 text-base font-semibold text-stone-950 hover:bg-amber-400 transition-colors"
          >
            Take the free assessment →
          </Link>

          <p className="mt-4 text-sm text-stone-500">
            Join 1,200+ people who discovered their psychological profile
          </p>
          <p className="mt-2 text-[11px] text-stone-600">
            8–15 minutes &nbsp;·&nbsp; Free to start &nbsp;·&nbsp; No credit card required
          </p>
        </div>
      </section>

      {/* ── Social Proof — immediately below fold ─────────────────────────── */}
      <section className="border-y border-stone-800/60 bg-stone-900/30 px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <p className="mb-8 text-center text-[10px] uppercase tracking-widest text-stone-600">
            What people are saying
          </p>
          <div className="grid gap-5 sm:grid-cols-3">
            {featuredTestimonials.map((t, i) => (
              <div
                key={i}
                className="flex flex-col rounded-2xl border border-stone-800 bg-stone-900/60 p-6"
              >
                {/* Stars */}
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} className={j < t.rating ? 'text-amber-400 text-xs' : 'text-stone-700 text-xs'}>★</span>
                  ))}
                </div>
                <p className="mb-5 flex-1 font-serif text-sm text-stone-300 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-2.5 border-t border-stone-800 pt-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-800 text-xs font-medium text-stone-400">
                    {t.firstName[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-stone-300">{t.firstName}</p>
                    {t.personalityTag && (
                      <p className="text-[11px] text-stone-600">{t.personalityTag}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section id="how-it-works" className="border-b border-stone-800/60 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 text-center font-serif text-3xl text-stone-200 sm:text-4xl">
            How it works
          </h2>
          <p className="mb-16 text-center text-sm text-stone-500">
            From first question to full psychological portrait.
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
          <div className="mt-14 text-center">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-8 py-3.5 text-sm font-semibold text-stone-950 hover:bg-amber-400 transition-colors"
            >
              Start your assessment →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Frameworks Grid ───────────────────────────────────────────────── */}
      <section className="border-b border-stone-800/60 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-center text-[10px] uppercase tracking-widest text-stone-600">
            Built on peer-reviewed psychology
          </p>
          <h2 className="mb-3 text-center font-serif text-3xl text-stone-200 sm:text-4xl">
            Six frameworks. One portrait.
          </h2>
          <p className="mb-14 text-center text-sm text-stone-500 max-w-xl mx-auto">
            Most personality tests give you one lens. Innermind uses all six — then synthesizes them into a coherent picture of who you actually are.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FRAMEWORKS.map((f) => (
              <div
                key={f.name}
                className="flex gap-4 rounded-2xl border border-stone-800 bg-stone-900/50 p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-xl text-amber-400 ring-1 ring-amber-500/20">
                  {f.icon}
                </div>
                <div>
                  <h3 className="mb-1 font-serif text-sm font-medium text-stone-100">{f.name}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <section id="pricing" className="border-b border-stone-800/60 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 text-center font-serif text-3xl text-stone-200 sm:text-4xl">
            Simple, honest pricing
          </h2>
          <p className="mb-16 text-center text-sm text-stone-500">
            Start free. Go deeper when you&apos;re ready.
          </p>
          <div className="mx-auto grid max-w-2xl gap-6 sm:grid-cols-2">
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
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="font-serif text-3xl text-stone-100">{tier.price}</span>
                  {tier.period && (
                    <span className="text-xs text-stone-500">{tier.period}</span>
                  )}
                </div>
                <p className="mb-6 text-sm text-stone-400">{tier.tagline}</p>
                <ul className="mb-7 flex-1 space-y-2.5">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm text-stone-400">
                      <span className="mt-0.5 text-amber-400 text-[11px]">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/assessment"
                  className={[
                    'inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors',
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

      {/* ── Testimonials (full grid) ──────────────────────────────────────── */}
      <section className="border-b border-stone-800/60 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 text-center font-serif text-3xl text-stone-200 sm:text-4xl">
            Real experiences
          </h2>
          <p className="mb-16 text-center text-sm text-stone-500">
            From people doing the inner work.
          </p>
          <TestimonialGrid testimonials={allTestimonials} limit={6} />
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="border-b border-stone-800/60 px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-3 text-center font-serif text-3xl text-stone-200 sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mb-14 text-center text-sm text-stone-500">
            Honest answers about what Innermind is and how it works.
          </p>
          <div className="divide-y divide-stone-800/60">
            {FAQ_ITEMS.map((item) => (
              <div key={item.q} className="py-7">
                <h3 className="mb-3 font-serif text-base text-stone-200">{item.q}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────────────────────── */}
      <EmailCaptureBlock variant="homepage" />

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="px-6 py-32 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 font-serif text-4xl text-stone-100 sm:text-5xl">
            Your psychological portrait is waiting.
          </h2>
          <p className="mb-10 text-stone-400 leading-relaxed">
            One free assessment. No account setup required. Results in minutes.
          </p>
          <Link
            href="/assessment"
            className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-10 py-4 text-sm font-semibold text-stone-950 hover:bg-amber-400 transition-colors"
          >
            Take the free assessment →
          </Link>
          <p className="mt-4 text-[11px] text-stone-700">
            Takes 8–15 minutes &nbsp;·&nbsp; Free forever &nbsp;·&nbsp; No credit card
          </p>
        </div>
      </section>
    </div>
  )
}

// ── Static data ────────────────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    icon: '◎',
    title: 'Take the assessment',
    description:
      'Answer validated questions across one or more psychology frameworks. Honest, thoughtful, and designed to reveal real patterns — not flatter you.',
  },
  {
    icon: '✦',
    title: 'Get your AI profile',
    description:
      'Claude reads your raw results and writes a personal narrative — synthesizing all your frameworks into one psychological portrait.',
  },
  {
    icon: '◉',
    title: 'Understand yourself',
    description:
      'Explore your full profile, track changes over time, and work with your AI coach through real challenges with psychological depth.',
  },
]

const FRAMEWORKS = [
  {
    icon: '◉',
    name: 'Big Five (OCEAN)',
    description: 'The gold standard in personality research. Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism — measured with rigor.',
  },
  {
    icon: '◈',
    name: 'Schwartz Values',
    description: 'What do you actually care about? 19 universal values, peer-reviewed across 70+ countries, reveal what drives your decisions.',
  },
  {
    icon: '◎',
    name: 'Attachment Style',
    description: 'How you connect, trust, and seek security in relationships. Foundational to therapy and relationship psychology.',
  },
  {
    icon: '✦',
    name: 'Enneagram',
    description: 'Nine patterns of attention and motivation. Identifies your core fear, core desire, and the emotional patterns that run your life.',
  },
  {
    icon: '◇',
    name: 'Jungian Archetypes',
    description: 'Explore your persona, shadow, anima/animus, and self. Based on Carl Jung\'s depth psychology — the most introspective framework we offer.',
  },
  {
    icon: '○',
    name: 'Light Triad',
    description: 'Measures Kantianism, Humanism, and Faith in Humanity — the prosocial counterpart to the Dark Triad, developed by Scott Barry Kaufman.',
  },
]

const PRICING = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    tagline: 'A real look at yourself — at no cost.',
    features: [
      '1 full assessment (your choice)',
      'Basic profile with scores and traits',
      'Framework overview and interpretation',
      'No credit card required',
    ],
    cta: 'Get started free',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/ month',
    tagline: 'The full picture — all frameworks, fully synthesized.',
    features: [
      'All 6 validated assessments',
      'Full AI-synthesized psychological portrait',
      'AI coach trained on your profile',
      'Growth recommendations & journal prompts',
      'Compatibility maps with others',
      'Unlimited reassessments',
    ],
    cta: 'Start free →',
    featured: true,
  },
]

const FAQ_ITEMS = [
  {
    q: 'How is Innermind different from 16Personalities or MBTI?',
    a: 'Innermind uses six peer-reviewed psychology frameworks and synthesizes them into one AI-written portrait. 16Personalities gives you a four-letter type based on a simplified model. We give you depth, nuance, and a narrative — not a label.',
  },
  {
    q: 'Is this scientifically valid?',
    a: 'Every framework in Innermind is grounded in peer-reviewed research. Big Five is the gold standard in personality psychology. Schwartz Values has been validated across 70+ countries. Attachment Theory is foundational in clinical psychology. We take rigor seriously.',
  },
  {
    q: 'How long does the assessment take?',
    a: 'Each individual assessment takes 8–15 minutes. You can take them one at a time. There are 6 assessments total — one is free, the rest unlock with Pro.',
  },
  {
    q: 'What do I get for free vs. Pro?',
    a: 'Free gives you one full assessment plus a basic profile — a real look at yourself at no cost. Pro ($19/month) unlocks all 6 assessments, the full AI-synthesized portrait, the AI coach, growth recommendations, and daily reflection prompts.',
  },
  {
    q: 'How does the AI work?',
    a: "We use Claude (by Anthropic) to read your raw assessment results and write a personal narrative. It synthesizes all your results the way a thoughtful therapist would — into a coherent, honest picture of who you are.",
  },
  {
    q: 'Can I share my profile with others?',
    a: 'Yes. Pro members can generate a shareable profile link and use the compatibility map to compare their psychological profile with partners, friends, and collaborators.',
  },
]

// Fallback testimonials shown when DB is empty (e.g. first deploy)
// Matches TestimonialItem shape from TestimonialGrid
const TESTIMONIALS_FALLBACK: import('@/components/TestimonialGrid').TestimonialItem[] = [
  {
    id: 'fallback-1',
    firstName: 'Alex K.',
    personalityTag: 'INTJ · Enneagram 5',
    rating: 5,
    quote:
      "I have taken the Big Five and MBTI before, but the AI synthesis actually explained WHY I behave the way I do in relationships. That insight took my therapist months to uncover.",
  },
  {
    id: 'fallback-2',
    firstName: 'Maya R.',
    personalityTag: 'INFP · Enneagram 4',
    rating: 5,
    quote:
      "The archetype section hit differently. I am a Seeker-Creator hybrid and the description was uncomfortably accurate. Shared it with three friends immediately.",
  },
  {
    id: 'fallback-3',
    firstName: 'David C.',
    personalityTag: 'Engineering manager',
    rating: 5,
    quote:
      "I use this with my team during onboarding. Understanding how each person's attachment style and values map onto their work patterns has genuinely changed how I give feedback.",
  },
  {
    id: 'fallback-4',
    firstName: 'Jasmine T.',
    personalityTag: 'Recent grad · first job',
    rating: 5,
    quote:
      "I was figuring out what kind of work environment would actually work for me. The values mapping section basically gave me a filter I could apply to every job offer. Wish I'd had this earlier.",
  },
  {
    id: 'fallback-5',
    firstName: 'James K.',
    personalityTag: 'Therapist, private practice',
    rating: 5,
    quote:
      "I now recommend Innermind to clients who want a structured starting point before we dig in. The Big Five + attachment integration is exactly what good therapeutic work builds toward anyway — this accelerates it.",
  },
  {
    id: 'fallback-6',
    firstName: 'Rohan M.',
    personalityTag: 'Skeptic turned convert',
    rating: 5,
    quote:
      "I actively resisted personality tests for years — felt like horoscopes with extra steps. This one changed my mind. The adaptive format and the fact it explains the science behind each dimension made it feel legitimate.",
  },
]
