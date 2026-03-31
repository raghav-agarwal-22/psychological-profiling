import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Affiliate Program — Innermind',
  description:
    'Earn 30% recurring commission for every Pro subscriber you refer to Innermind. Built for coaches, therapists, and psychology educators who already recommend self-discovery tools.',
  openGraph: {
    title: 'Innermind Affiliate Program — 30% Recurring Commission',
    description:
      'Earn 30% recurring commission on every Pro subscription you refer. No cap. No expiry. Built for coaches, therapists, and psychology educators.',
  },
}

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Apply and get your link',
    body: 'Fill out a short form. We review within 24 hours. Once approved, you get a unique referral link and a personal affiliate dashboard.',
  },
  {
    step: '02',
    title: 'Share with your audience',
    body: 'Add your link to newsletters, social posts, course materials, or client onboarding emails. Innermind converts well to anyone interested in self-knowledge.',
  },
  {
    step: '03',
    title: 'Earn every month',
    body: 'You earn 30% of every Pro subscription payment from referred users — for as long as they stay subscribed. No caps, no expiry windows.',
  },
  {
    step: '04',
    title: 'Get paid monthly',
    body: 'Commissions are calculated on the 1st and paid within 5 business days via Stripe. Minimum payout threshold: $25.',
  },
]

const BENEFITS = [
  {
    icon: '◈',
    title: '30% recurring commission',
    body: 'Not a one-time fee — you earn every renewal. A user on annual Pro ($149/yr) earns you $44.70/yr in perpetuity.',
  },
  {
    icon: '◎',
    title: 'Real-time affiliate dashboard',
    body: 'See click-throughs, conversions, active subscribers, and pending earnings — updated in real time.',
  },
  {
    icon: '⬡',
    title: '90-day cookie window',
    body: 'If someone clicks your link and subscribes within 90 days, the referral is credited to you. No rushing required.',
  },
  {
    icon: '◇',
    title: 'Custom link + landing page',
    body: 'Your referral link can include a personal message or promo code. We can co-create a landing page for high-volume affiliates.',
  },
  {
    icon: '▷',
    title: 'Converts to your existing audience',
    body: "If you already talk about Big Five, Enneagram, attachment, or shadow work — Innermind is a natural fit. No cold pitching required.",
  },
  {
    icon: '◉',
    title: 'Marketing assets included',
    body: 'We provide graphics, copy snippets, email templates, and a product demo walkthrough for your newsletter or course.',
  },
]

const FAQ = [
  {
    q: 'Who qualifies for the affiliate program?',
    a: 'Coaches, therapists, psychology educators, content creators in the self-development space, and anyone with an audience interested in personality psychology. We review each application manually.',
  },
  {
    q: 'How much does Pro cost, and what do I earn?',
    a: "Innermind Pro is $19/month or $149/year. You earn 30% per payment — that's $5.70/month or $44.70/year per active subscriber you referred.",
  },
  {
    q: 'When does the commission start?',
    a: 'Commissions begin the moment a referred user subscribes to Pro. There is no trial period deduction.',
  },
  {
    q: 'What happens if a user cancels and resubscribes?',
    a: 'If the same user resubscribes within 90 days, the referral is still credited to you. After 90 days of inactivity, the attribution resets.',
  },
  {
    q: 'Is there a limit to how much I can earn?',
    a: 'No cap. The more subscribers you refer, the more you earn — indefinitely.',
  },
  {
    q: 'Can I use my link for paid advertising?',
    a: "You may not run paid ads that directly compete with Innermind's own paid keywords or brand terms. General interest psychology content is fine. When in doubt, ask us.",
  },
  {
    q: 'How do I track my referrals?',
    a: 'Your affiliate dashboard shows every click, signup, conversion, and payment in real time. You\'ll also receive a monthly email summary.',
  },
  {
    q: 'What if I use Innermind with my clients too?',
    a: "Great — you can be both a professional user and an affiliate. Your own client usage is tracked separately from referral commissions.",
  },
]

export default function AffiliatePage() {
  return (
    <main className="min-h-screen bg-stone-950 text-stone-300">
      {/* Hero */}
      <section className="px-6 pb-24 pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-xs uppercase tracking-widest text-amber-500/70">
            Affiliate Program
          </p>
          <h1 className="font-serif text-4xl font-medium leading-tight text-stone-100 sm:text-5xl lg:text-6xl">
            Earn 30% recurring commission
            <br />
            <span className="text-amber-400">for every subscriber you refer</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-stone-400">
            Innermind is a psychological profiling platform built for people serious about
            self-understanding. If your audience cares about personality psychology, self-development,
            or inner work — you already know exactly who to share it with.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/affiliates/apply"
              className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-8 py-3.5 text-sm font-medium text-stone-900 transition-colors hover:bg-amber-400"
            >
              Apply to the program
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-xl border border-stone-700 px-8 py-3.5 text-sm font-medium text-stone-300 hover:border-stone-500 hover:text-stone-100"
            >
              See how it works
            </a>
          </div>
          <p className="mt-4 text-[11px] text-stone-600">
            Free to join &nbsp;·&nbsp; 90-day cookie window &nbsp;·&nbsp; Paid monthly via Stripe
            &nbsp;·&nbsp;{' '}
            <Link href="/affiliates/dashboard" className="text-stone-500 hover:text-stone-400 underline underline-offset-2">
              Affiliate login →
            </Link>
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-stone-800/60 bg-stone-900/40 px-6 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { stat: '30%', label: 'Recurring commission rate' },
              { stat: '$0', label: 'Cost to join' },
              { stat: '90 days', label: 'Cookie attribution window' },
              { stat: 'Monthly', label: 'Payment schedule' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="font-serif text-2xl font-medium text-amber-400">{item.stat}</p>
                <p className="mt-1 text-xs text-stone-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <h2 className="font-serif text-3xl font-medium text-stone-100 sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-stone-400">From application to your first payout in four steps.</p>
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

      {/* Benefits */}
      <section className="border-y border-stone-800/60 bg-stone-900/30 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <h2 className="font-serif text-3xl font-medium text-stone-100 sm:text-4xl">
              Everything you need to promote confidently
            </h2>
            <p className="mt-4 text-stone-400">
              We built the program for people who recommend things they believe in — not cold affiliates.
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

      {/* Earnings calculator */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-10">
            <div className="mb-8 text-center">
              <h2 className="font-serif text-3xl font-medium text-stone-100">
                What could you earn?
              </h2>
              <p className="mt-3 text-stone-400">
                Based on 30% commission on Innermind Pro ($149/yr or $19/mo).
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  referrals: '10 subscribers',
                  annual: '$447/yr',
                  monthly: '$57/mo',
                  label: 'Micro audience',
                },
                {
                  referrals: '50 subscribers',
                  annual: '$2,235/yr',
                  monthly: '$285/mo',
                  label: 'Active newsletter',
                },
                {
                  referrals: '200 subscribers',
                  annual: '$8,940/yr',
                  monthly: '$1,140/mo',
                  label: 'Large community',
                },
              ].map((tier) => (
                <div
                  key={tier.label}
                  className="rounded-xl border border-stone-700/50 bg-stone-950/50 p-6 text-center"
                >
                  <p className="text-xs uppercase tracking-widest text-stone-500">{tier.label}</p>
                  <p className="mt-2 text-sm text-stone-400">{tier.referrals}</p>
                  <p className="mt-4 font-serif text-3xl font-medium text-amber-400">{tier.annual}</p>
                  <p className="mt-1 text-xs text-stone-500">{tier.monthly} recurring</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-stone-600">
              Estimates based on annual Pro plan at $149/yr. Actual earnings depend on your conversion rate.
            </p>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="border-y border-stone-800/60 bg-stone-900/30 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <h2 className="font-serif text-3xl font-medium text-stone-100 sm:text-4xl">
              Built for people in the psychology space
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                title: 'Coaches & therapists',
                body: "You already recommend self-discovery tools to clients. Innermind is the platform that synthesizes five frameworks at once — it's a natural fit for your intake process and your referral link.",
              },
              {
                title: 'Psychology educators & course creators',
                body: "If you teach Big Five, Enneagram, or shadow work, Innermind gives your students a hands-on tool that applies the frameworks you teach. Add your affiliate link to your course materials.",
              },
              {
                title: 'Newsletter writers & content creators',
                body: "Your subscribers already care about self-understanding. Innermind has a free tier with no credit card required — a low-barrier recommendation that earns ongoing commission.",
              },
              {
                title: 'Podcast hosts & community leaders',
                body: "Inner work, identity, and psychology are highly engaged niches. Innermind demo episodes and community posts consistently drive high-intent sign-ups.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6"
              >
                <h3 className="mb-2 font-medium text-stone-100">{item.title}</h3>
                <p className="text-sm leading-relaxed text-stone-400">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-14 text-center">
            <h2 className="font-serif text-3xl font-medium text-stone-100 sm:text-4xl">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-6">
            {FAQ.map((item) => (
              <div key={item.q} className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
                <h3 className="mb-2 font-medium text-stone-100">{item.q}</h3>
                <p className="text-sm leading-relaxed text-stone-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-stone-800/60 bg-stone-900/30 px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-medium text-stone-100 sm:text-4xl">
            Ready to apply?
          </h2>
          <p className="mt-4 text-stone-400">
            Applications are reviewed within 24 hours. Once approved, you get your link instantly.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/affiliates/apply"
              className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-8 py-3.5 text-sm font-medium text-stone-900 transition-colors hover:bg-amber-400"
            >
              Apply to the program
            </Link>
            <Link
              href="/affiliates/dashboard"
              className="inline-flex items-center justify-center rounded-xl border border-stone-700 px-8 py-3.5 text-sm font-medium text-stone-300 hover:border-stone-500 hover:text-stone-100"
            >
              View your dashboard →
            </Link>
          </div>
          <p className="mt-4 text-[11px] text-stone-600">
            Questions? Email us at&nbsp;
            <a href="mailto:affiliates@innermindhealing.com" className="text-stone-500 hover:text-stone-400">
              affiliates@innermindhealing.com
            </a>
          </p>
        </div>
      </section>
    </main>
  )
}
