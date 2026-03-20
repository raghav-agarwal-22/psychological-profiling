'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function LaunchPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/notify-list/count`)
      .then((r) => r.json())
      .then((d) => { if (d.count) setCount(d.count) })
      .catch(() => {})
  }, [])


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || loading) return
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/notify-list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'launch_page' }),
      })
      const data = await res.json()
      if (data.count) setCount(data.count)
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(245,158,11,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-stone-700/60 bg-stone-900/60 px-4 py-1.5 text-xs text-stone-400">
          <span className="text-amber-400">◎</span>
          <span>Coming to Product Hunt soon</span>
        </div>

        {/* Headline */}
        <div>
          <h1 className="mb-4 font-serif text-4xl font-medium tracking-tight text-stone-100 sm:text-5xl">
            The AI that builds your<br />psychological portrait
          </h1>
          <p className="text-base text-stone-400 leading-relaxed">
            Five validated psychology frameworks — Big Five, Schwartz Values, Attachment Style,
            Enneagram, and Jungian Archetypes — synthesized by AI into one portrait of who you are.
          </p>
        </div>

        {/* Social proof count */}
        {count !== null && count > 0 && (
          <p className="text-sm text-stone-500">
            <span className="font-semibold text-amber-400">{count.toLocaleString()}</span> people already waiting
          </p>
        )}

        {/* Email capture */}
        {submitted ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-8 py-6">
            <span className="text-2xl">◎</span>
            <p className="font-serif text-lg text-stone-100">You&apos;re on the list.</p>
            <p className="text-sm text-stone-400">
              We&apos;ll send you a heads-up the day we launch. No spam, ever.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="h-12 flex-1 rounded-xl border border-stone-700 bg-stone-900 px-4 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-500/60"
            />
            <button
              type="submit"
              disabled={loading}
              className="h-12 shrink-0 rounded-xl bg-amber-500 px-7 text-sm font-semibold text-stone-950 hover:bg-amber-400 disabled:opacity-60"
            >
              {loading ? 'Saving…' : 'Notify me on launch day →'}
            </button>
          </form>
        )}

        {/* PH upvote nudge */}
        <a
          href="https://www.producthunt.com/upcoming/innermind"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-stone-500 underline-offset-2 hover:text-stone-300 hover:underline"
        >
          <span>▲</span>
          Follow us on Product Hunt to get notified
        </a>

        {/* CTA to try it now */}
        <div className="border-t border-stone-800 pt-6 w-full">
          <p className="mb-3 text-xs text-stone-600">
            Don&apos;t want to wait? The app is live.
          </p>
          <Link
            href="/assessment"
            className="inline-flex items-center justify-center rounded-xl border border-stone-700 px-6 py-2.5 text-sm font-medium text-stone-300 hover:border-stone-500 hover:text-stone-100"
          >
            Take your free assessment now →
          </Link>
        </div>
      </div>
    </div>
  )
}
