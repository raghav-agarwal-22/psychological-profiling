import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Pro Access for Coaches & Therapists — Innermind Early Advocate Program',
  description:
    'We\'re giving 20 coaches and therapists free lifetime Pro access to Innermind. Know your clients psychologically before session one. Apply for early advocate access.',
  openGraph: {
    title: 'Innermind Early Advocate Program for Coaches & Therapists',
    description:
      'Free lifetime Pro access for 20 coaches and therapists who try Innermind with their clients. Five validated psychological frameworks synthesized by AI.',
  },
}

const WHAT_YOU_GET = [
  {
    icon: '◈',
    title: 'Client portraits before session one',
    body: 'Your clients complete five validated assessments (Big Five, Schwartz Values, Attachment Style, Enneagram, Jungian Archetypes) and you receive an AI-synthesized psychological portrait before you ever meet.',
  },
  {
    icon: '◎',
    title: 'Shared profile access',
    body: 'Clients share their full profile with you — raw scores, AI synthesis, and growth tracking over time. One click, no friction.',
  },
  {
    icon: '⬡',
    title: 'Growth tracking over time',
    body: 'Clients retake assessments quarterly. You see score shifts mapped to your work together — concrete evidence of transformation.',
  },
  {
    icon: '◇',
    title: 'Bulk client invite links',
    body: 'Send a single link and clients onboard themselves. No manual data entry, no back-and-forth scheduling.',
  },
  {
    icon: '▷',
    title: 'Free lifetime Pro access',
    body: 'As an early advocate, your Pro account is free — forever. We want honest feedback, not payment.',
  },
  {
    icon: '◉',
    title: 'Direct line to the founder',
    body: 'You get Rishi\'s personal email. Your feedback shapes what we build next for practitioners.',
  },
]

const WHAT_WE_ASK = [
  'Use Innermind with at least 3 clients',
  'Share honest feedback after 30 days (just a few sentences)',
  'Recommend it to your network if it fits — only when it genuinely does',
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Apply below',
    body: 'Fill in your name, email, and a line about your practice. We review every application personally.',
  },
  {
    step: '02',
    title: 'Get your advocate account',
    body: "We'll activate your free Pro account and send a personalized onboarding email within 24 hours.",
  },
  {
    step: '03',
    title: 'Invite your clients',
    body: 'You get a unique invite link. Clients sign up, complete assessments, and share access — no manual work for you.',
  },
  {
    step: '04',
    title: 'Give us feedback',
    body: 'After 30 days, we\'ll ask for a few honest sentences. That\'s it. Your Pro access stays free either way.',
  },
]

export default function ForCoachesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-28 text-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,158,11,0.08) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/40 px-4 py-1.5 text-xs text-amber-400">
            <span>◉</span>
            <span>20 spots · Early Advocate Program</span>
          </div>
          <h1 className="mb-6 font-serif text-4xl font-medium tracking-tight text-stone-100 sm:text-5xl lg:text-6xl">
            Free Pro access for<br className="hidden sm:block" /> coaches &amp; therapists.
          </h1>
          <p className="mb-4 max-w-2xl text-lg text-stone-400 leading-relaxed">
            We&rsquo;re giving 20 coaches and therapists <strong className="text-stone-200">free lifetime Pro accounts</strong> to
            try Innermind with their clients. Know your clients psychologically before session one.
            Reduce intake time. Track transformation over time.
          </p>
          <p className="mb-10 max-w-xl text-sm text-stone-500">
            The only ask: use it with 3+ clients and tell us what you think.
          </p>
          <a
            href="mailto:professionals@innermindhealing.com?subject=Early Advocate Application&body=Hi Rishi,%0A%0AMy name is [name] and I work as a [coach/therapist].%0A%0AA bit about my practice: [description]%0A%0AI%27d love to try Innermind with my clients.%0A%0AThanks"
            className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-10 py-4 text-base font-semibold text-stone-950 hover:bg-amber-400"
          >
            Apply for free access →
          </a>
          <p className="mt-4 text-[11px] text-stone-600">
            Free forever &nbsp;·&nbsp; No credit card &nbsp;·&nbsp; 20 spots total
          </p>
        </div>
      </section>

      {/* Social proof banner */}
      <section className="border-y border-stone-800/60 bg-stone-900/40 px-6 py-5">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-center text-[10px] uppercase tracking-widest text-stone-600">
            Five peer-reviewed frameworks synthesized into one portrait
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {['Big Five (OCEAN)', 'Schwartz Values', 'Attachment Style', 'Enneagram', 'Jungian Archetypes'].map(
              (f) => (
                <span key={f} className="text-xs font-medium text-stone-500">
                  {f}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <h2 className="font-serif text-3xl font-medium text-stone-100 sm:text-4xl">
              What you get as an early advocate
            </h2>
            <p className="mt-4 text-stone-400">
              Everything in Pro, free, for life — plus direct access to the founding team.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {WHAT_YOU_GET.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6"
              >
                <div className="mb-3 text-2xl text-amber-500">{b.icon}</div>
                <h3 className="mb-2 font-medium text-stone-100">{b.title}</h3>
                <p className="text-sm leading-relaxed text-stone-400">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we ask */}
      <section className="border-y border-stone-800/60 bg-stone-900/30 px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-8 font-serif text-3xl font-medium text-stone-100">
            What we ask in return
          </h2>
          <ul className="space-y-4">
            {WHAT_WE_ASK.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-left text-stone-300">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-400">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-stone-500">
            That&rsquo;s genuinely it. No required testimonials, no referral quotas, no upsell calls.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <h2 className="font-serif text-3xl font-medium text-stone-100 sm:text-4xl">
              How it works
            </h2>
          </div>
          <ol className="space-y-8">
            {HOW_IT_WORKS.map((item) => (
              <li key={item.step} className="flex gap-6">
                <span className="mt-1 font-mono text-2xl font-bold text-amber-500/40">
                  {item.step}
                </span>
                <div>
                  <h3 className="mb-1 font-medium text-stone-100">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-stone-400">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Who this is for */}
      <section className="border-y border-stone-800/60 bg-stone-900/30 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center font-serif text-3xl font-medium text-stone-100">
            Who this is for
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              'ICF-certified life and executive coaches',
              'Licensed therapists (CBT, IFS, somatic, relational)',
              'Career coaches who use assessments with clients',
              'Psychotherapists in private practice',
              'Coaching program facilitators',
              'Counselors and mental health practitioners',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-stone-800 bg-stone-900/40 p-4">
                <span className="text-amber-500">✓</span>
                <span className="text-sm text-stone-300">{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-stone-500">
            Not sure if you qualify?{' '}
            <a href="mailto:professionals@innermindhealing.com" className="text-amber-500 hover:underline">
              Email us and ask.
            </a>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/40 px-4 py-1.5 text-xs text-amber-400">
            <span>◉</span>
            <span>Limited to 20 practitioners</span>
          </div>
          <h2 className="mb-4 font-serif text-3xl font-medium text-stone-100 sm:text-4xl">
            Ready to try it with your clients?
          </h2>
          <p className="mb-8 text-stone-400 text-sm leading-relaxed max-w-xl mx-auto">
            Email us a line about your practice and we&rsquo;ll activate your free Pro account within 24 hours.
            If you&rsquo;d rather explore first, the full professionals page has more context.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="mailto:professionals@innermindhealing.com?subject=Early Advocate Application&body=Hi Rishi,%0A%0AMy name is [name] and I work as a [coach/therapist].%0A%0AA bit about my practice: [description]%0A%0AI%27d love to try Innermind with my clients.%0A%0AThanks"
              className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-10 py-4 text-base font-semibold text-stone-950 hover:bg-amber-400"
            >
              Apply for free access →
            </a>
            <Link
              href="/for-professionals"
              className="inline-flex items-center justify-center rounded-xl border border-stone-700 px-8 py-3.5 text-sm font-medium text-stone-300 hover:border-stone-500 hover:text-stone-100"
            >
              See full product details
            </Link>
          </div>
          <p className="mt-6 text-[11px] text-stone-600">
            Questions? Email{' '}
            <a href="mailto:professionals@innermindhealing.com" className="text-amber-500 hover:underline">
              professionals@innermindhealing.com
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}
