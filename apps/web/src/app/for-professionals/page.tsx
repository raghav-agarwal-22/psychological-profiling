import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Innermind for Professionals — Coaches & Therapists',
  description:
    'Give your clients validated psychological depth reports. Coaches and therapists use Innermind to accelerate breakthroughs, reduce intake time, and build deeper client relationships.',
  openGraph: {
    title: 'Innermind for Professionals',
    description:
      'Validated psychological profiling for coaches and therapists. Help your clients know themselves deeply from session one.',
  },
}

const BENEFITS = [
  {
    icon: '◈',
    title: 'Session-ready profiles',
    body: 'Your client completes five validated assessments before your first session. You arrive knowing their Big Five traits, core values, attachment style, Enneagram type, and Jungian archetype.',
  },
  {
    icon: '◎',
    title: 'Shared report access',
    body: 'Invite clients to share their full psychological portrait with you. See the same data they see — raw scores, AI synthesis, and growth trends over time.',
  },
  {
    icon: '⬡',
    title: 'Track growth over time',
    body: 'Clients retake assessments every quarter. You see score shifts mapped to the coaching work — concrete evidence of transformation that clients can see.',
  },
  {
    icon: '◇',
    title: 'AI-generated intake summary',
    body: 'Each profile includes an AI-synthesized portrait written in plain language. Use it as a conversation starter or share it with supervisors and collaborators.',
  },
  {
    icon: '▷',
    title: 'Bulk client onboarding',
    body: 'Send clients a unique invite link. They sign up, complete assessments, and share access — no manual data entry on your end.',
  },
  {
    icon: '◉',
    title: 'Built on peer-reviewed science',
    body: 'Every framework is validated: Big Five (OCEAN), Schwartz Values Theory, Hazan & Shaver Attachment, Enneagram, and Jungian Archetypes.',
  },
]

const TESTIMONIALS = [
  {
    quote:
      "I used to spend the first two sessions just doing intake. Now I start coaching from session one. My clients arrive having already thought deeply about themselves.",
    name: 'Sarah M.',
    role: 'ICF-certified executive coach',
  },
  {
    quote:
      'The growth tracking is what sold me. Clients can actually see their attachment patterns shifting. That kind of visual evidence is incredibly motivating.',
    name: 'Dr. James R.',
    role: 'Licensed therapist, 15 years practice',
  },
  {
    quote:
      "My clients love it. They screenshot their portraits and share them with friends — I've gotten three referrals just from that.",
    name: 'Priya K.',
    role: 'Life coach & somatic practitioner',
  },
]

const PLANS = [
  {
    name: 'Pro Business',
    price: '$99',
    period: '/mo',
    description: 'For solo coaches and therapists. 10 client seats included.',
    features: [
      '10 client seats',
      'Client assessment dashboard',
      'PDF report downloads',
      'Practitioner notes (private)',
      'Shared profile access',
      'Growth tracking & retakes',
    ],
    cta: 'Get started',
    href: '/professional',
    highlight: false,
  },
  {
    name: 'Team',
    price: '$299',
    period: '/mo',
    description: 'For group practices, HR teams, and OD consultants. 50 client seats.',
    features: [
      '50 client seats',
      'Everything in Pro Business',
      'Team cohort Big Five chart',
      'Aggregate values & attachment view',
      'Priority support',
      'Custom onboarding',
    ],
    cta: 'Get started',
    href: '/professional',
    highlight: true,
  },
]

export default function ForProfessionalsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-28 text-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,158,11,0.07) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-700/60 bg-stone-900/60 px-4 py-1.5 text-xs text-stone-400">
            <span className="text-amber-400">◉</span>
            <span>Built for coaches and therapists</span>
          </div>
          <h1 className="mb-6 font-serif text-4xl font-medium tracking-tight text-stone-100 sm:text-5xl lg:text-6xl">
            Know your clients<br className="hidden sm:block" /> from session one.
          </h1>
          <p className="mb-10 max-w-2xl text-lg text-stone-400 leading-relaxed">
            Innermind gives your clients validated psychological depth reports before you ever meet.
            Five frameworks synthesized by AI — so you spend less time on intake and more time on
            transformation.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/professional"
              className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-8 py-3.5 text-sm font-semibold text-stone-950 hover:bg-amber-400"
            >
              Get started →
            </Link>
            <a
              href="mailto:professionals@innermindhealing.com"
              className="inline-flex items-center justify-center rounded-xl border border-stone-700 px-8 py-3.5 text-sm font-medium text-stone-300 hover:border-stone-500 hover:text-stone-100"
            >
              Book a walkthrough
            </a>
          </div>
          <p className="mt-4 text-[11px] text-stone-600">
            Free to try &nbsp;·&nbsp; No credit card required &nbsp;·&nbsp; Bulk invite links included
          </p>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-stone-800/60 bg-stone-900/40 px-6 py-5">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-center text-[10px] uppercase tracking-widest text-stone-600">
            Five peer-reviewed frameworks in one profile
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

      {/* Benefits */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <h2 className="font-serif text-3xl font-medium text-stone-100 sm:text-4xl">
              Everything you need to go deeper, faster
            </h2>
            <p className="mt-4 text-stone-400">
              Reduce intake time. Accelerate insight. Track transformation.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
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

      {/* How it works for professionals */}
      <section className="border-y border-stone-800/60 bg-stone-900/30 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <h2 className="font-serif text-3xl font-medium text-stone-100 sm:text-4xl">
              How it works for your practice
            </h2>
          </div>
          <ol className="space-y-8">
            {[
              {
                step: '01',
                title: 'You sign up and get a client invite link',
                body: "Create a free account and share your unique invite link with clients via email or messaging. They sign up and start assessments immediately — no back-and-forth scheduling required.",
              },
              {
                step: '02',
                title: 'Clients complete five 15-minute assessments',
                body: 'Each client completes Big Five, Schwartz Values, Attachment Style, Enneagram, and Jungian Archetypes at their own pace. Innermind synthesizes results into a readable AI portrait.',
              },
              {
                step: '03',
                title: 'Clients share their portrait with you',
                body: 'With one click, clients grant you access to their full profile: raw scores, AI synthesis, and growth chart. You can review it before your first session.',
              },
              {
                step: '04',
                title: 'Track progress together over time',
                body: "Clients retake assessments quarterly. You see score changes mapped to your coaching work — a timeline of their inner growth that you can reference in sessions.",
              },
            ].map((item) => (
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

      {/* Testimonials */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center font-serif text-3xl font-medium text-stone-100">
            Professionals using Innermind
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6"
              >
                <p className="mb-5 text-sm leading-relaxed text-stone-300 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-medium text-stone-200">{t.name}</p>
                  <p className="text-xs text-stone-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="border-t border-stone-800/60 bg-stone-900/30 px-6 py-24"
      >
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <h2 className="font-serif text-3xl font-medium text-stone-100 sm:text-4xl">
              Simple pricing for practices of any size
            </h2>
            <p className="mt-4 text-stone-400">
              Start free. Add clients as you grow.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-8 ${
                  plan.highlight
                    ? 'border-amber-500/40 bg-amber-950/20'
                    : 'border-stone-800 bg-stone-900/50'
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="font-medium text-stone-100">{plan.name}</h3>
                  {plan.highlight && (
                    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-400 uppercase tracking-wide">
                      Best for practices
                    </span>
                  )}
                </div>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold text-stone-100">{plan.price}</span>
                  <span className="text-sm text-stone-500">{plan.period}</span>
                </div>
                <p className="mb-6 text-sm text-stone-400">{plan.description}</p>
                <ul className="mb-8 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-stone-300">
                      <span className="mt-0.5 text-amber-500">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block w-full rounded-xl py-3 text-center text-sm font-semibold ${
                    plan.highlight
                      ? 'bg-amber-500 text-stone-950 hover:bg-amber-400'
                      : 'border border-stone-700 text-stone-300 hover:border-stone-500 hover:text-stone-100'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-stone-600">
            Need a custom plan for a large practice or training program?{' '}
            <a href="mailto:professionals@innermindhealing.com" className="text-amber-500 hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 font-serif text-3xl font-medium text-stone-100 sm:text-4xl">
            Ready to go deeper with your clients?
          </h2>
          <p className="mb-8 text-stone-400">
            Try Innermind free with your first client. No credit card required.
          </p>
          <Link
            href="/professional"
            className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-10 py-4 text-base font-semibold text-stone-950 hover:bg-amber-400"
          >
            Get started →
          </Link>
        </div>
      </section>
    </div>
  )
}
