'use client'

import { useState, useEffect } from 'react'
import { posthog } from '@/lib/posthog'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
// Seed offset — shown count = real subscribers + SEED_OFFSET
const SEED_OFFSET = 100

interface WaitlistCaptureProps {
  /** Passed from profile context so we can pre-fill if user is known */
  prefillEmail?: string
}

export function WaitlistCapture({ prefillEmail = '' }: WaitlistCaptureProps) {
  const [email, setEmail] = useState(prefillEmail)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null)

  useEffect(() => {
    fetch(`${API_URL}/api/users/notify-list/count`)
      .then((r) => r.json())
      .then((data: { count: number }) => setWaitlistCount(data.count + SEED_OFFSET))
      .catch(() => setWaitlistCount(SEED_OFFSET))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch(`${API_URL}/api/users/notify-list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'degraded_synthesis' }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as { error?: string }).error ?? 'Failed to join waitlist')
      }

      const data = await res.json() as { count: number }
      setWaitlistCount(data.count + SEED_OFFSET)
      setStatus('success')

      posthog.capture('waitlist_joined', { source: 'degraded_synthesis', email: email.trim() })
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className="mb-8 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-lg leading-none">✦</span>
          <div>
            <p className="text-sm font-semibold text-teal-300">You're on the list</p>
            <p className="mt-1 text-xs text-stone-400">
              We'll email you the moment your AI personality profile is ready. Check back soon — your
              scores are already saved.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-xl leading-none text-amber-400">✦</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-300">
            Your AI-powered profile is almost ready
          </p>
          <p className="mt-1 text-xs text-stone-400">
            We're activating the AI synthesis engine. Join the waitlist and we'll notify you the
            moment your personalized narrative portrait is live — your scores are already saved.
          </p>

          {/* What they'll get */}
          <ul className="mt-3 space-y-1">
            {[
              'Deep narrative portrait of your personality',
              'Archetype identification across all frameworks',
              'Blind spots, strengths & growth edges',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs text-stone-400">
                <span className="text-amber-500/60">→</span>
                {item}
              </li>
            ))}
          </ul>

          {/* Social proof counter */}
          {waitlistCount !== null && (
            <p className="mt-3 text-[11px] text-stone-500">
              Join {waitlistCount.toLocaleString()} others waiting
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-stone-900 transition hover:bg-amber-400 disabled:opacity-50"
            >
              {status === 'loading' ? 'Joining…' : 'Notify me'}
            </button>
          </form>

          {status === 'error' && (
            <p className="mt-2 text-[11px] text-red-400">{errorMsg}</p>
          )}
        </div>
      </div>
    </div>
  )
}
