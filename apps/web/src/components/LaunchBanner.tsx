'use client'

import { useState } from 'react'
import Link from 'next/link'

export function LaunchBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  if (dismissed) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || loading) return
    setLoading(true)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/notify-list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'landing_banner' }),
      })
      setSubmitted(true)
    } catch {
      // silently fail — not critical
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative z-50 flex items-center justify-between gap-4 border-b border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-amber-400 font-medium">
          Launching on Product Hunt soon
        </span>
        {submitted ? (
          <span className="text-stone-400">You&apos;re on the list — we&apos;ll notify you.</span>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="h-7 rounded-md border border-stone-700 bg-stone-900 px-2.5 text-xs text-stone-200 placeholder-stone-600 outline-none focus:border-amber-500/60"
            />
            <button
              type="submit"
              disabled={loading}
              className="h-7 rounded-md bg-amber-500 px-3 text-xs font-semibold text-stone-950 hover:bg-amber-400 disabled:opacity-60"
            >
              {loading ? '…' : 'Notify me'}
            </button>
          </form>
        )}
        <Link href="/launch" className="text-xs text-stone-500 underline underline-offset-2 hover:text-stone-300">
          Learn more
        </Link>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss banner"
        className="shrink-0 text-stone-500 hover:text-stone-300"
      >
        ✕
      </button>
    </div>
  )
}
