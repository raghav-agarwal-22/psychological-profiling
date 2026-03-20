'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

interface Insight {
  id: string
  title: string
  body: string
  type: string
}

interface BillingStatus {
  tier: string
  interval: string | null
  isPaid: boolean
}

type OfferState = 'idle' | 'loading' | 'success' | 'error'

function capturePosthog(event: string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const ph = (window as unknown as Record<string, unknown>)['posthog'] as
    | { capture: (event: string, props?: unknown) => void }
    | undefined
  ph?.capture(event, properties)
}

export default function CancelSavePage() {
  const router = useRouter()
  const [insights, setInsights] = useState<Insight[]>([])
  const [billing, setBilling] = useState<BillingStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [pauseState, setPauseState] = useState<OfferState>('idle')
  const [discountState, setDiscountState] = useState<OfferState>('idle')
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.replace('/auth/login?redirect=/cancel-save')
      return
    }

    Promise.all([
      api.get<{ tier: string; interval: string | null; isPaid: boolean }>('/api/billing/status', token),
      api.get<{ insights: Insight[] }>('/api/insights?limit=3', token),
    ])
      .then(([billingData, insightData]) => {
        setBilling(billingData)
        if (!billingData.isPaid) {
          router.replace('/account')
          return
        }
        setInsights(insightData.insights.slice(0, 3))
        capturePosthog('cancellation_save_viewed')
      })
      .catch(() => router.replace('/account'))
      .finally(() => setLoading(false))
  }, [router])

  async function handlePause() {
    const token = getToken()
    if (!token) return
    setPauseState('loading')
    try {
      await api.post('/api/billing/pause', {}, token)
      setPauseState('success')
      capturePosthog('cancellation_save_accepted_pause')
    } catch {
      setPauseState('error')
    }
  }

  async function handleDiscount() {
    const token = getToken()
    if (!token) return
    setDiscountState('loading')
    try {
      await api.post('/api/billing/retention-discount', {}, token)
      setDiscountState('success')
      capturePosthog('cancellation_save_accepted_discount')
    } catch {
      setDiscountState('error')
    }
  }

  async function handleCancel() {
    const token = getToken()
    if (!token) return
    capturePosthog('cancellation_save_declined')
    setPortalLoading(true)
    try {
      const res = await api.post<{ url: string }>('/api/billing/portal', {}, token)
      window.location.href = res.url
    } catch {
      setPortalLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-stone-800/50" />
          ))}
        </div>
      </main>
    )
  }

  if (pauseState === 'success') {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-10">
          <div className="mb-4 text-4xl">⏸</div>
          <h1 className="mb-3 font-serif text-2xl font-medium text-stone-100">
            Subscription paused
          </h1>
          <p className="mb-6 text-stone-400">
            Your subscription is paused for 30 days. You&apos;ll keep access until your current period ends,
            then billing resumes automatically.
          </p>
          <Link
            href="/dashboard"
            className="inline-block rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
          >
            Back to dashboard
          </Link>
        </div>
      </main>
    )
  }

  if (discountState === 'success') {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-10">
          <div className="mb-4 text-4xl">🎉</div>
          <h1 className="mb-3 font-serif text-2xl font-medium text-stone-100">
            50% off applied
          </h1>
          <p className="mb-6 text-stone-400">
            Your next month is 50% off. We&apos;re glad you&apos;re staying — your profile keeps growing with you.
          </p>
          <Link
            href="/dashboard"
            className="inline-block rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
          >
            Back to dashboard
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      {/* Header */}
      <div className="mb-10 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-stone-500">
          Before you go
        </p>
        <h1 className="mb-3 font-serif text-3xl font-medium text-stone-100">
          Your psychological profile is still growing
        </h1>
        <p className="text-stone-400">
          Here&apos;s what you&apos;ve uncovered about yourself — and two ways to stay.
        </p>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="mb-10 space-y-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="rounded-xl border border-stone-800 bg-stone-900/60 p-5"
            >
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-500/70">
                {insight.type.replace(/_/g, ' ')}
              </p>
              <p className="text-sm font-medium text-stone-200">{insight.title}</p>
              {insight.body && (
                <p className="mt-1 line-clamp-2 text-xs text-stone-500">{insight.body}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Offer cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {/* Pause offer */}
        <div className="flex flex-col rounded-2xl border border-stone-700 bg-stone-900/60 p-6">
          <div className="mb-2 text-2xl">⏸</div>
          <h2 className="mb-1 font-serif text-lg font-medium text-stone-100">Need a break?</h2>
          <p className="mb-5 flex-1 text-sm text-stone-400">
            Pause your subscription for a month. No charges, no data lost. Resume whenever you&apos;re ready.
          </p>
          <button
            onClick={handlePause}
            disabled={pauseState === 'loading'}
            className="w-full rounded-lg border border-stone-600 bg-stone-800 px-4 py-2.5 text-sm font-medium text-stone-200 transition-colors hover:bg-stone-700 disabled:opacity-50"
          >
            {pauseState === 'loading' ? 'Pausing…' : 'Pause for a month'}
          </button>
          {pauseState === 'error' && (
            <p className="mt-2 text-center text-xs text-red-400">Something went wrong. Try again.</p>
          )}
        </div>

        {/* Discount offer */}
        <div className="flex flex-col rounded-2xl border border-amber-500/40 bg-amber-500/5 p-6">
          <div className="mb-2 text-2xl">💛</div>
          <h2 className="mb-1 font-serif text-lg font-medium text-stone-100">Stay at half price</h2>
          <p className="mb-5 flex-1 text-sm text-stone-400">
            Get 50% off your next month — on us. Keep building your psychological portrait.
          </p>
          <button
            onClick={handleDiscount}
            disabled={discountState === 'loading'}
            className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400 disabled:opacity-50"
          >
            {discountState === 'loading' ? 'Applying…' : 'Stay at 50% off'}
          </button>
          {discountState === 'error' && (
            <p className="mt-2 text-center text-xs text-red-400">Something went wrong. Try again.</p>
          )}
        </div>
      </div>

      {/* Cancel anyway */}
      <div className="text-center">
        <button
          onClick={handleCancel}
          disabled={portalLoading}
          className="text-sm text-stone-600 underline-offset-2 transition-colors hover:text-stone-400 hover:underline disabled:opacity-50"
        >
          {portalLoading ? 'Opening portal…' : 'No thanks, cancel anyway'}
        </button>
      </div>
    </main>
  )
}
