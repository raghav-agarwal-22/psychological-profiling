'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { posthog } from '@/lib/posthog'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

function BlurredProfilePreview() {
  return (
    <div className="relative w-full max-w-sm rounded-2xl border border-stone-700/60 bg-stone-900/80 p-6 shadow-2xl">
      {/* Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-stone-950/60 backdrop-blur-[2px]">
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-center">
          <p className="text-xs font-medium text-amber-400">Complete your assessment to reveal this</p>
        </div>
      </div>

      {/* Profile content (visible but blurred behind overlay) */}
      <div className="space-y-5">
        {/* Archetype header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 text-lg">◎</div>
          <div>
            <div className="h-4 w-32 rounded bg-stone-600 blur-sm" />
            <div className="mt-1.5 h-3 w-20 rounded bg-stone-700 blur-sm" />
          </div>
        </div>

        {/* Big Five bars */}
        <div className="space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">Personality Dimensions</p>
          {[
            { label: 'Openness', pct: 82 },
            { label: 'Conscientiousness', pct: 67 },
            { label: 'Extraversion', pct: 44 },
            { label: 'Agreeableness', pct: 71 },
            { label: 'Neuroticism', pct: 38 },
          ].map(({ label, pct }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-28 text-xs text-stone-400">{label}</span>
              <div className="flex-1 rounded-full bg-stone-800">
                <div
                  className="h-1.5 rounded-full bg-amber-500/70"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-8 text-right text-xs text-stone-500">{pct}</span>
            </div>
          ))}
        </div>

        {/* Strengths */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-stone-500">Core Strengths</p>
          <div className="flex flex-wrap gap-2">
            {['Strategic thinking', 'Deep focus', 'Curiosity', 'Autonomy'].map((s) => (
              <span
                key={s}
                className="rounded-full border border-stone-700 bg-stone-800 px-3 py-1 text-xs text-stone-300 blur-[3px]"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Narrative excerpt */}
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded bg-stone-700 blur-sm" />
          <div className="h-3 w-5/6 rounded bg-stone-700 blur-sm" />
          <div className="h-3 w-4/5 rounded bg-stone-700 blur-sm" />
          <div className="h-3 w-full rounded bg-stone-700 blur-sm" />
          <div className="h-3 w-3/4 rounded bg-stone-700 blur-sm" />
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    posthog.capture('login_page_viewed')
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    posthog.capture('login_submitted', { email_domain: email.split('@')[1] })

    try {
      const res = await fetch(`${API_URL}/api/auth/magic-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')

      posthog.capture('magic_link_requested')

      // In dev, the API returns devMagicLinkUrl — auto-redirect
      if (data.devMagicLinkUrl) {
        window.location.href = data.devMagicLinkUrl
        return
      }

      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
        <div className="w-full max-w-md text-center">
          <span className="text-4xl">✉️</span>
          <h1 className="mt-4 font-serif text-3xl text-stone-100">Check your email</h1>
          <p className="mt-3 text-stone-400">
            We sent a sign-in link to <span className="text-stone-200">{email}</span>. It expires
            in 15 minutes.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-4xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
        {/* Left: form */}
        <div className="w-full max-w-md lg:flex-1">
          <div className="mb-8">
            <span className="text-3xl">◎</span>
            <h1 className="mt-4 font-serif text-3xl text-stone-100">Start your free assessment</h1>
            <p className="mt-2 text-stone-400">
              Enter your email — we&apos;ll send you a secure link. No password needed.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-8">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-stone-300">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  suppressHydrationWarning
                  className="w-full rounded-xl border border-stone-700 bg-stone-800/50 px-4 py-3 text-stone-100 placeholder-stone-500 transition-colors focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400 disabled:opacity-50"
              >
                {loading ? 'Sending…' : 'Send sign-in link'}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-stone-500">
              No password needed. We&apos;ll email you a secure link.
            </p>
          </div>
        </div>

        {/* Right: blurred profile preview */}
        <div className="hidden w-full max-w-sm flex-col items-center gap-4 lg:flex">
          <p className="text-sm font-medium text-stone-400">Your portrait is 8 minutes away</p>
          <BlurredProfilePreview />
        </div>

        {/* Mobile: preview strip */}
        <div className="w-full lg:hidden">
          <p className="mb-3 text-center text-sm font-medium text-stone-400">Your portrait is 8 minutes away</p>
          <div className="overflow-hidden rounded-xl">
            <div className="scale-90 origin-top">
              <BlurredProfilePreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
