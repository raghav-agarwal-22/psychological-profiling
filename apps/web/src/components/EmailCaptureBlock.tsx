'use client'

import { useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

interface EmailCaptureBlockProps {
  variant?: 'blog' | 'homepage'
}

export function EmailCaptureBlock({ variant = 'blog' }: EmailCaptureBlockProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Subscribe failed')
      }
      setStatus('success')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
        <p className="text-sm font-medium text-emerald-400">
          Check your inbox — your profile link is on its way.
        </p>
      </div>
    )
  }

  if (variant === 'homepage') {
    return (
      <section className="px-6 py-20">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="mb-2 font-serif text-2xl font-medium text-stone-100">
            Weekly Psychology Insights
          </h2>
          <p className="mb-6 text-sm text-stone-500">
            Join 5,000+ people learning to understand themselves better. One insight every Tuesday.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address..."
              required
              className="flex-1 rounded-xl border border-stone-700 bg-stone-900 px-4 py-2.5 min-h-[44px] text-sm text-stone-200 placeholder-stone-600 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded-xl bg-amber-500 px-6 py-2.5 min-h-[44px] text-sm font-semibold text-stone-950 hover:bg-amber-400 disabled:opacity-60 transition-colors"
            >
              {status === 'loading' ? 'Subscribing…' : 'Subscribe →'}
            </button>
          </form>
          {status === 'error' && (
            <p className="mt-2 text-xs text-red-400">{errorMsg}</p>
          )}
        </div>
      </section>
    )
  }

  // blog variant
  return (
    <div className="mt-12 rounded-2xl border border-stone-700 bg-stone-900/60 p-6">
      <div className="mb-1 text-lg">🧠</div>
      <h3 className="mb-1 font-serif text-lg font-medium text-stone-100">
        Get your free psychological profile
      </h3>
      <p className="mb-4 text-sm text-stone-400 leading-relaxed">
        Discover your Big Five, Enneagram, archetype and what drives you.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address..."
          required
          className="flex-1 rounded-lg border border-stone-700 bg-stone-800 px-4 py-2.5 text-sm text-stone-200 placeholder-stone-600 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-950 hover:bg-amber-400 disabled:opacity-60 transition-colors"
        >
          {status === 'loading' ? 'Starting…' : 'Start Free →'}
        </button>
      </form>
      {status === 'error' && (
        <p className="mt-2 text-xs text-red-400">{errorMsg}</p>
      )}
    </div>
  )
}
