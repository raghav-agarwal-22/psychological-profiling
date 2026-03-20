'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { posthog } from '@/lib/posthog'

const FREE_FEATURES = [
  'Big Five personality assessment',
  'Basic psychological profile',
  'Personal dashboard',
  'Public profile share link',
]

const ESSENTIAL_FEATURES = [
  'Everything in Free',
  'Values Inventory assessment',
  'Attachment Style assessment',
  'Enneagram assessment',
  'Light & Dark Triad assessment',
  'Full archetype breakdown',
  'Growth chart over time',
  'PDF export of your report',
  'Weekly digest email',
  'Journal (up to 30 entries)',
]

const PRO_FEATURES = [
  'Everything in Essential',
  'AI coach chat (unlimited)',
  'AI growth recommendations',
  'Personalized daily prompts',
  'Adaptive deep-dive assessment',
  'Compatibility mapping',
  'Journal (unlimited)',
]

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

type Tier = 'essential' | 'pro'
type Interval = 'monthly' | 'annual'

const PRICES: Record<Tier, Record<Interval, { display: string; monthly: string; save?: string }>> = {
  essential: {
    monthly: { display: '$9', monthly: '$9/mo' },
    annual: { display: '$79', monthly: '$6.58/mo', save: 'Save 27%' },
  },
  pro: {
    monthly: { display: '$19', monthly: '$19/mo' },
    annual: { display: '$149', monthly: '$12.42/mo', save: 'Save 34%' },
  },
}

function UpgradeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cancelled = searchParams.get('cancelled') === '1'

  const [interval, setInterval] = useState<Interval>('monthly')
  const [loadingTier, setLoadingTier] = useState<Tier | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasTrial, setHasTrial] = useState(true)

  useEffect(() => {
    posthog.capture('upgrade_page_viewed')
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

  useEffect(() => {
    if (cancelled) setError('Payment was cancelled. You can try again whenever you are ready.')
  }, [cancelled])

  async function handleUpgrade(tier: Tier) {
    setLoadingTier(tier)
    setError(null)
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
        body: JSON.stringify({ tier, interval }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as { error?: string }).error ?? 'Failed to start checkout')
      }

      const data = (await res.json()) as { url: string }
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoadingTier(null)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
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
            <span className="text-amber-400 text-sm font-semibold">7-day free trial on Pro</span>
            <span className="text-stone-500 text-xs">· No charge until day 8</span>
          </div>
        )}
        <p className="mx-auto max-w-xl text-base text-stone-400 leading-relaxed">
          Go deeper with all five assessment frameworks, AI-powered coaching, and personalised
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
            onClick={() => setInterval('annual')}
            className={`relative rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${
              interval === 'annual'
                ? 'bg-stone-700 text-stone-100'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Annual
            <span className="absolute -top-2.5 -right-1.5 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
              −34%
            </span>
          </button>
        </div>
      </div>

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
      <div className="grid gap-5 sm:grid-cols-3">
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

        {/* Essential tier */}
        <div className="flex flex-col rounded-2xl border border-stone-600 bg-stone-900/60 p-6">
          <div className="mb-5">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-stone-300">
              Essential
            </p>
            <div className="flex items-end gap-1.5">
              <span className="font-serif text-4xl text-stone-100">
                {PRICES.essential[interval].display}
              </span>
              <span className="mb-1 text-sm text-stone-500">
                {interval === 'annual' ? '/ year' : '/ month'}
              </span>
            </div>
            <p className="mt-1 text-xs text-stone-500">
              {interval === 'annual'
                ? `${PRICES.essential.annual.monthly} · ${PRICES.essential.annual.save}`
                : 'Cancel anytime.'}
            </p>
          </div>

          <ul className="mb-7 flex-1 space-y-2.5">
            {ESSENTIAL_FEATURES.map((feat) => (
              <li key={feat} className="flex items-start gap-2.5 text-sm text-stone-300">
                <span className="mt-0.5 shrink-0 text-stone-400">✓</span>
                {feat}
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleUpgrade('essential')}
            disabled={loadingTier !== null}
            className="block w-full rounded-xl border border-stone-500 py-2.5 text-center text-sm font-semibold text-stone-200 transition-colors hover:border-stone-400 hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingTier === 'essential' ? 'Redirecting…' : `Get Essential →`}
          </button>
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
                {PRICES.pro[interval].display}
              </span>
              <span className="mb-1 text-sm text-stone-500">
                {interval === 'annual' ? '/ year' : '/ month'}
              </span>
            </div>
            <p className="mt-1 text-xs text-stone-500">
              {interval === 'annual'
                ? `${PRICES.pro.annual.monthly} · ${PRICES.pro.annual.save}`
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
            onClick={() => handleUpgrade('pro')}
            disabled={loadingTier !== null}
            className="block w-full rounded-xl bg-amber-500 py-3 text-center text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingTier === 'pro'
              ? 'Redirecting…'
              : hasTrial && interval === 'monthly'
              ? 'Start 7-day free trial →'
              : 'Upgrade to Pro →'}
          </button>

          <p className="mt-3 text-center text-xs text-stone-600">
            {hasTrial && interval === 'monthly' ? 'No charge for 7 days · ' : ''}Secure payment via Stripe
          </p>
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

export default function UpgradePage() {
  return (
    <Suspense fallback={<div className="flex h-64 items-center justify-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" /></div>}>
      <UpgradeContent />
    </Suspense>
  )
}
