'use client'

import React, { useState } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export default function AffiliateApplyPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    websiteUrl: '',
    audienceDesc: '',
    audienceSize: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_URL}/api/affiliates/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          websiteUrl: form.websiteUrl,
          audienceDesc: form.audienceDesc,
          audienceSize: form.audienceSize ? parseInt(form.audienceSize, 10) : undefined,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error((data as { error?: string }).error ?? 'Something went wrong')
      }
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10">
          <span className="text-2xl text-amber-400">◎</span>
        </div>
        <h1 className="mb-3 font-serif text-3xl text-stone-100">Application received</h1>
        <p className="mb-8 text-stone-400">
          We review applications within 24 hours. If approved, you'll receive your unique
          referral link and dashboard access by email.
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-stone-800 px-6 py-2.5 text-sm font-semibold text-stone-200 hover:bg-stone-700"
        >
          Back to Innermind
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      {/* Header */}
      <div className="mb-10">
        <Link href="/affiliates" className="mb-6 inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-300">
          ← Affiliate program
        </Link>
        <h1 className="mb-2 font-serif text-3xl text-stone-100">Apply to become an affiliate</h1>
        <p className="text-sm text-stone-400">
          Takes 2 minutes. We review within 24 hours and send your link immediately on approval.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-400">
            Full name
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Your name"
            className="w-full rounded-xl border border-stone-700 bg-stone-900 px-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:border-amber-500/50 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-400">
            Email address
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-stone-700 bg-stone-900 px-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:border-amber-500/50 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-400">
            Website or profile URL
          </label>
          <input
            type="url"
            required
            value={form.websiteUrl}
            onChange={(e) => setForm((f) => ({ ...f, websiteUrl: e.target.value }))}
            placeholder="https://yoursite.com"
            className="w-full rounded-xl border border-stone-700 bg-stone-900 px-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:border-amber-500/50 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-400">
            Describe your audience
          </label>
          <textarea
            required
            rows={4}
            value={form.audienceDesc}
            onChange={(e) => setForm((f) => ({ ...f, audienceDesc: e.target.value }))}
            placeholder="e.g. I run a newsletter for therapists and coaches interested in evidence-based self-development tools..."
            className="w-full resize-none rounded-xl border border-stone-700 bg-stone-900 px-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:border-amber-500/50 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-400">
            Monthly audience size <span className="text-stone-600 normal-case font-normal">(optional)</span>
          </label>
          <input
            type="number"
            min={0}
            value={form.audienceSize}
            onChange={(e) => setForm((f) => ({ ...f, audienceSize: e.target.value }))}
            placeholder="e.g. 5000"
            className="w-full rounded-xl border border-stone-700 bg-stone-900 px-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:border-amber-500/50 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Submitting…' : 'Submit application →'}
        </button>

        <p className="text-center text-xs text-stone-600">
          By applying you agree to our affiliate program terms. We never share your information.
        </p>
      </form>
    </div>
  )
}
