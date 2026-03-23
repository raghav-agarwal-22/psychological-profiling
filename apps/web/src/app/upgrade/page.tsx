'use client'

import React, { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { posthog } from '@/lib/posthog'
import { track } from '@/lib/analytics'
import { TestimonialSnippet } from '@/components/TestimonialSnippet'

const FREE_FEATURES = [
  'Big Five personality assessment',
  'Basic psychological profile',
  'Personal dashboard',
  'Public profile share link',
]

const PRO_FEATURES = [
  'All 6 assessment frameworks',
  'Full AI-synthesised psychological portrait',
  'Values Inventory assessment',
  'Attachment Style assessment',
  'Enneagram assessment',
  'Light & Dark Triad assessment',
  'Full archetype breakdown',
  'AI coach chat (unlimited)',
  'AI growth recommendations',
  'Personalised daily prompts',
  'Adaptive deep-dive assessment',
  'Compatibility mapping',
  'Journal (unlimited)',
  'PDF export of your report',
  'Weekly digest email',
]

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

type Interval = 'monthly' | 'annual'

const PRICES: Record<Interval, { display: string; monthly: string; save?: string }> = {
  monthly: { display: '$19', monthly: '$19/mo' },
  annual: { display: '$144', monthly: '$12/mo', save: 'Save $84/yr' },
}

function UpgradeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cancelled = searchParams.get('cancelled') === '1'

  const [interval, setInterval] = useState<Interval>('monthly')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasTrial, setHasTrial] = useState(true)
  const [paywallVariant, setPaywallVariant] = useState<'control' | 'urgency_cta'>('control')
  const [countdown, setCountdown] = useState(15 * 60) // 15 minutes in seconds
  const countdownRef = useRef<number | null>(null)
  const [annualNudgeDismissed, setAnnualNudgeDismissed] = useState(false)
  const autoFlippedRef = useRef(false)
  const monthlyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const ctaVariant = posthog.getFeatureFlag('upgrade-cta-copy')
    const pwVariant = posthog.getFeatureFlag('paywall_variant')
    const resolvedPwVariant = pwVariant === 'urgency_cta' ? 'urgency_cta' : 'control'
    setPaywallVariant(resolvedPwVariant)
    posthog.capture('upgrade_page_viewed', {
      ab_upgrade_cta_copy: typeof ctaVariant === 'string' ? ctaVariant : 'control',
      ab_paywall_variant: resolvedPwVariant,
    })
    track('paywall_hit', { section: 'upgrade_page', source: 'upgrade_page', ab_variant: resolvedPwVariant })
    // Default to annual if the feature flag is enabled
    const intervalDefault = posthog.getFeatureFlag('upgrade-interval-default')
    if (intervalDefault === 'annual') setInterval('annual')
    const token = localStorage.getItem('innermind_token')
    if (token) {
      fetch(`${API_URL}/api/billing/status`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((d: { isPaid?: boolean }) => {
          if (d.isPaid) setHasTrial(false)
        })
        .catch(() => {/* ignore */})
    }
  }, [])

  // Countdown timer for urgency_cta variant
  useEffect(() => {
    if (paywallVariant !== 'urgency_cta') return
    countdownRef.current = window.setInterval(() => {
      setCountdown((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [paywallVariant])

  useEffect(() => {
    if (cancelled) setError('Payment was cancelled. You can try again whenever you are ready.')
  }, [cancelled])

  // Auto-flip to annual after 10s on monthly view
  useEffect(() => {
    if (interval === 'monthly' && !autoFlippedRef.current) {
      monthlyTimerRef.current = setTimeout(() => {
        if (!autoFlippedRef.current) {
          autoFlippedRef.current = true
          setInterval('annual')
          track('annual_auto_flip', {})
        }
      }, 10_000)
    } else {
      if (monthlyTimerRef.current) {
        clearTimeout(monthlyTimerRef.current)
        monthlyTimerRef.current = null
      }
    }
    return () => {
      if (monthlyTimerRef.current) clearTimeout(monthlyTimerRef.current)
    }
  }, [interval])

  async function handleUpgrade() {
    setLoading(true)
    setError(null)
    posthog.capture('upgrade_cta_clicked', { tier: 'pro', interval, ab_paywall_variant: paywallVariant })
    track('upgrade_clicked', { tier: 'pro', interval, ab_variant: paywallVariant })
    try {
      const token = localStorage.getItem('innermind_token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      const res = await fetch(`${API_URL}/api/billing/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tier: 'pro', interval }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as { error?: string }).error ?? 'Failed to start checkout')
      }

      const data = (await res.json()) as { url: string }
      if (data.url) {
        track('checkout_started', { tier: 'pro', interval, ab_variant: paywallVariant })
        window.location.href = data.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10">
          <span className="text-2xl text-amber-400">◎</span>
        </div>
        <h1 className="mb-3 font-serif text-4xl text-stone-100">
          Unlock your full psychological profile
        </h1>
        {hasTrial && (
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5">
            <span className="text-amber-400 text-sm font-semibold">7-day free trial</span>
            <span className="text-stone-500 text-xs">· No charge until day 8</span>
          </div>
        )}
        <p className="mx-auto max-w-xl text-base text-stone-400 leading-relaxed">
          Go deeper with all six assessment frameworks, AI-powered coaching, and personalised
          growth tools.
        </p>
      </div>

      {/* Billing interval toggle */}
      <div className="mb-10 flex items-center justify-center">
        <div className="inline-flex rounded-xl border border-stone-700 bg-stone-900/60 p-1">
          <button
            onClick={() => setInterval('monthly')}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${
              interval === 'monthly'
                ? 'bg-stone-700 text-stone-100'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => { setInterval('annual'); autoFlippedRef.current = true }}
            className={`relative rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${
              interval === 'annual'
                ? 'bg-stone-700 text-stone-100'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Annual
            <span className="absolute -top-2.5 -right-1.5 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
              SAVE 37%
            </span>
          </button>
        </div>
      </div>

      {/* Annual nudge sticky banner — shown when monthly is selected */}
      {interval === 'monthly' && !annualNudgeDismissed && (
        <div className="sticky top-4 z-10 mb-8 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/8 px-5 py-3 shadow-lg shadow-emerald-900/20 transition-all">
          <div>
            <p className="text-sm font-semibold text-emerald-300">Switch to annual and save $84/year</p>
            <p className="mt-0.5 text-xs text-stone-400">$19/mo vs <span className="font-semibold text-emerald-400">$12/mo</span> billed annually</p>
          </div>
          <div className="ml-4 flex shrink-0 items-center gap-3">
            <button
              onClick={() => { setInterval('annual'); autoFlippedRef.current = true; track('annual_nudge_clicked', {}) }}
              className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-stone-950 transition-colors hover:bg-emerald-400"
            >
              Switch
            </button>
            <button
              onClick={() => setAnnualNudgeDismissed(true)}
              className="text-stone-600 hover:text-stone-400 transition-colors text-xs"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Urgency CTA — paywall_variant: urgency_cta */}
      {paywallVariant === 'urgency_cta' && (
        <div className="mb-8 flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/8 px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-amber-300">Limited time: 40% off your first month</p>
            <p className="mt-0.5 text-xs text-stone-400">Discount auto-applied at checkout. No code needed.</p>
          </div>
          <div className="ml-4 shrink-0 text-right">
            <p className="font-mono text-lg font-bold text-amber-400">
              {String(Math.floor(countdown / 60)).padStart(2, '0')}:{String(countdown % 60).padStart(2, '0')}
            </p>
            <p className="text-[10px] text-stone-500">remaining</p>
          </div>
        </div>
      )}

      {/* Cancelled banner */}
      {cancelled && (
        <div className="mb-8 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-300">
          Payment was cancelled — no charge was made. You can upgrade any time below.
        </div>
      )}

      {/* Error banner */}
      {error && !cancelled && (
        <div className="mb-8 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-400">
          {error}
        </div>
      )}

      {/* Pricing cards */}
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Free tier */}
        <div className="flex flex-col rounded-2xl border border-stone-700 bg-stone-900/60 p-6">
          <div className="mb-5">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-stone-500">
              Free
            </p>
            <div className="flex items-end gap-1.5">
              <span className="font-serif text-4xl text-stone-100">$0</span>
              <span className="mb-1 text-sm text-stone-500">/ month</span>
            </div>
            <p className="mt-2 text-xs text-stone-500">Always free. No credit card required.</p>
          </div>

          <ul className="mb-7 flex-1 space-y-2.5">
            {FREE_FEATURES.map((feat) => (
              <li key={feat} className="flex items-start gap-2.5 text-sm text-stone-400">
                <span className="mt-0.5 shrink-0 text-stone-600">✓</span>
                {feat}
              </li>
            ))}
          </ul>

          <Link
            href="/dashboard"
            className="block rounded-xl border border-stone-700 py-2.5 text-center text-sm font-semibold text-stone-400 transition-colors hover:border-stone-600 hover:text-stone-200"
          >
            Continue with Free
          </Link>
        </div>

        {/* Pro tier */}
        <div className="relative flex flex-col rounded-2xl border border-amber-500/40 bg-amber-500/5 p-6 shadow-lg shadow-amber-500/5">
          {/* Popular badge */}
          <div className="absolute -top-3 right-6">
            <span className="rounded-full border border-amber-500/40 bg-amber-500 px-3 py-0.5 text-xs font-semibold text-stone-950">
              Most popular
            </span>
          </div>

          <div className="mb-5">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
              Pro
            </p>
            <div className="flex items-end gap-1.5">
              <span className="font-serif text-4xl text-stone-100">
                {PRICES[interval].display}
              </span>
              <span className="mb-1 text-sm text-stone-500">
                {interval === 'annual' ? '/ year' : '/ month'}
              </span>
            </div>
            <p className="mt-1 text-xs text-stone-500">
              {interval === 'annual'
                ? `${PRICES.annual.monthly} · ${PRICES.annual.save}`
                : hasTrial
                ? '7-day free trial, then $19/mo.'
                : 'Cancel anytime.'}
            </p>
          </div>

          <ul className="mb-7 flex-1 space-y-2.5">
            {PRO_FEATURES.map((feat) => (
              <li key={feat} className="flex items-start gap-2.5 text-sm text-stone-300">
                <span className="mt-0.5 shrink-0 text-amber-400">✓</span>
                {feat}
              </li>
            ))}
          </ul>

          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="block w-full rounded-xl bg-amber-500 py-3 text-center text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? 'Redirecting…'
              : hasTrial
              ? 'Start free trial →'
              : 'Upgrade to Pro →'}
          </button>

          <p className="mt-3 text-center text-xs text-stone-600">
            {hasTrial ? 'No charge until day 8 · ' : ''}Secure payment via Stripe
          </p>
        </div>
      </div>

      {/* B2B section */}
      <div className="mt-14">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">For professionals</p>
          <h2 className="mt-2 font-serif text-2xl text-stone-100">Innermind for Practitioners</h2>
          <p className="mt-2 text-sm text-stone-400">Coaches, therapists, and HR teams use Innermind to build richer client understanding.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-6">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-500">Pro Business</p>
            <p className="mb-1 font-serif text-xl text-stone-100">10 client seats</p>
            <p className="mb-4 text-sm text-stone-400">Dashboard, PDF reports, practitioner notes.</p>
            <p className="mb-4 text-2xl font-bold text-stone-100">$99<span className="text-sm font-normal text-stone-500"> / month</span></p>
            <Link href="/professional" className="block w-full rounded-xl border border-amber-500/40 py-2.5 text-center text-sm font-semibold text-amber-400 transition-colors hover:border-amber-400 hover:text-amber-300">
              Set up workspace →
            </Link>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-stone-900/50 p-6">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-500">Team</p>
            <p className="mb-1 font-serif text-xl text-stone-100">50 client seats</p>
            <p className="mb-4 text-sm text-stone-400">Pro Business + team cohort analytics and aggregate views.</p>
            <p className="mb-4 text-2xl font-bold text-stone-100">$299<span className="text-sm font-normal text-stone-500"> / month</span></p>
            <Link href="/professional" className="block w-full rounded-xl bg-amber-500 py-2.5 text-center text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400">
              Set up workspace →
            </Link>
          </div>
        </div>
      </div>

      {/* Social proof — testimonials near CTA */}
      <div className="mt-14">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-stone-600">
          Loved by people doing the inner work
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <TestimonialSnippet
            firstName="James"
            quote="I've done MBTI, Enneagram, everything — Innermind went deeper. I now recommend it to clients."
            rating={5}
            personalityTag="Therapist"
          />
          <TestimonialSnippet
            firstName="Priya"
            quote="The Jungian archetypes section made me pause for an hour. I filled two journal pages."
            rating={5}
            personalityTag="INFJ · Enneagram 4"
          />
        </div>
      </div>

      {/* Trust signals */}
      <div className="mt-14 grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: '◎',
            title: 'Cancel anytime',
            body: 'No lock-in. Cancel your subscription from the billing portal at any time.',
          },
          {
            icon: '◈',
            title: 'Secure checkout',
            body: 'Payments are processed by Stripe. We never store your card details.',
          },
          {
            icon: '◉',
            title: 'Instant access',
            body: hasTrial
              ? 'All features unlock immediately. No charge for 7 days on Pro.'
              : 'Features activate immediately after your payment completes.',
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-stone-800 bg-stone-900/40 p-5"
          >
            <span className="mb-3 block text-lg text-amber-400">{item.icon}</span>
            <p className="mb-1.5 text-sm font-semibold text-stone-200">{item.title}</p>
            <p className="text-xs text-stone-500 leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Innermind Pro',
  description: 'All 6 psychological assessment frameworks synthesized by AI into one coherent portrait. Big Five, Jungian Archetypes, Attachment Style, Enneagram, Values Inventory, and Light/Dark Triad.',
  url: 'https://innermind.app/upgrade',
  brand: { '@type': 'Brand', name: 'Innermind' },
  offers: [
    {
      '@type': 'Offer',
      name: 'Pro Monthly',
      price: '19.00',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://innermind.app/upgrade',
      priceValidUntil: '2027-01-01',
    },
    {
      '@type': 'Offer',
      name: 'Pro Annual',
      price: '149.00',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://innermind.app/upgrade',
      priceValidUntil: '2027-01-01',
    },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '247',
  },
}

export default function UpgradePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <Suspense fallback={<div className="flex h-64 items-center justify-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" /></div>}>
        <UpgradeContent />
      </Suspense>
    </>
  )
}
