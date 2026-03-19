import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-28 text-center">
        <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20">
          <span className="text-3xl">◎</span>
        </div>
        <h1 className="mb-5 font-serif text-5xl font-medium tracking-tight text-stone-100 sm:text-6xl">
          Understand yourself.{' '}
          <span className="text-amber-400">Deeply.</span>
        </h1>
        <p className="mb-10 max-w-xl text-lg text-stone-400 leading-relaxed">
          Science-backed psychological assessments with AI-powered insights.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-8 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
          >
            Start for free
          </Link>
          <Link
            href="/assessment"
            className="inline-flex items-center justify-center rounded-xl border border-stone-700 px-8 py-3 text-sm font-medium text-stone-300 transition-colors hover:border-stone-500 hover:text-stone-100"
          >
            Browse assessments
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-stone-800/60 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center font-serif text-3xl text-stone-200">
            How it works
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.title} className="relative text-center">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="absolute top-6 left-[calc(50%+2rem)] hidden h-px w-[calc(100%-4rem)] bg-stone-800 sm:block" />
                )}
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-stone-700 bg-stone-900 text-xl">
                  {step.icon}
                </div>
                <p className="text-[10px] uppercase tracking-widest text-amber-500/70">
                  Step {i + 1}
                </p>
                <h3 className="mt-1 font-serif text-lg text-stone-100">{step.title}</h3>
                <p className="mt-2 text-sm text-stone-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment frameworks */}
      <section className="border-t border-stone-800/60 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-3 text-center font-serif text-3xl text-stone-200">
            Assessment frameworks
          </h2>
          <p className="mb-12 text-center text-sm text-stone-500">
            Grounded in peer-reviewed psychology research.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {FRAMEWORKS.map((fw) => (
              <div
                key={fw.title}
                className="flex flex-col rounded-2xl border border-stone-800 bg-stone-900/50 p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-800 text-lg text-stone-300">
                    {fw.icon}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-stone-100">{fw.title}</h3>
                    <span className="rounded-full border border-stone-700 px-2 py-0.5 text-[10px] text-stone-500">
                      ~{fw.duration}
                    </span>
                  </div>
                </div>
                <p className="flex-1 text-sm text-stone-400 leading-relaxed">{fw.description}</p>
                <Link
                  href="/assessment"
                  className="mt-5 inline-flex items-center text-xs font-medium text-amber-400 hover:text-amber-300"
                >
                  Start assessment →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-t border-stone-800/60 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center font-serif text-3xl text-stone-200">
            What people say
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6"
              >
                <p className="mb-5 text-sm text-stone-400 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-800 text-xs text-stone-400">
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
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-stone-800/60 px-6 py-24 text-center">
        <h2 className="mb-4 font-serif text-4xl text-stone-100">
          Ready to know yourself?
        </h2>
        <p className="mb-8 text-stone-500">Free. No credit card required.</p>
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-10 py-3.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
        >
          Begin your journey
        </Link>
      </section>
    </div>
  )
}

const HOW_IT_WORKS = [
  {
    icon: '📋',
    title: 'Take the assessment',
    description: 'Answer thoughtfully crafted questions at your own pace.',
  },
  {
    icon: '✦',
    title: 'Get your profile',
    description: 'Receive an AI-generated narrative with deep psychological insight.',
  },
  {
    icon: '🌱',
    title: 'Share & grow',
    description: 'Track how your profile evolves over time and share with others.',
  },
]

const FRAMEWORKS = [
  {
    icon: '◎',
    title: 'Big Five Personality',
    duration: '10–15 min',
    description:
      'Explore the five fundamental dimensions of your personality: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism — the gold standard in personality research.',
  },
  {
    icon: '◈',
    title: 'Schwartz Values Inventory',
    duration: '5–8 min',
    description:
      'Discover what truly motivates you across 9 universal value dimensions — from Self-Direction and Universalism to Security and Hedonism — based on Schwartz\'s foundational research.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Alex R.',
    role: 'Product designer',
    quote:
      'The narrative profile was surprisingly accurate. It named things about me I hadn\'t put into words.',
  },
  {
    name: 'Jordan M.',
    role: 'Software engineer',
    quote:
      'I\'ve taken the Big Five before but the AI synthesis here is a level above anything else I\'ve tried.',
  },
  {
    name: 'Sam T.',
    role: 'Coach & facilitator',
    quote:
      'I recommend Innermind to all my clients as a starting point for self-reflection work.',
  },
]
