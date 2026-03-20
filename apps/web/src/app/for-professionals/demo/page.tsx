'use client'

import { useState } from 'react'
import Link from 'next/link'
import { api, ApiError } from '@/lib/api'

const ROLE_OPTIONS = [
  'Executive coach',
  'Life coach',
  'Therapist / counselor',
  'HR manager',
  'OD consultant',
  'Team leader',
  'Other',
]

const PRACTICE_SIZE_OPTIONS = [
  'Just me (solo)',
  '2–5 practitioners',
  '6–20 practitioners',
  '20+ practitioners',
]

const USE_CASE_OPTIONS = [
  'Client intake acceleration',
  'Team psychological profiling',
  'Coaching program intake',
  'Research / academic',
  'Other',
]

export default function DemoRequestPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    role: '',
    practiceSize: '',
    useCase: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await api.post('/api/professional/demo-request', form)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <div className="mb-4 text-4xl">◎</div>
        <h1 className="mb-3 font-serif text-2xl font-medium text-stone-100">Check your inbox</h1>
        <p className="mb-8 text-stone-400">
          We'll send the demo to <strong className="text-stone-200">{form.email}</strong> within 2 minutes.
        </p>
        <Link
          href="/professional"
          className="inline-block rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
        >
          Or start your free trial now →
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <div className="mb-10">
        <Link href="/for-professionals" className="mb-6 inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-300">
          ← For professionals
        </Link>
        <h1 className="mb-3 font-serif text-3xl font-medium text-stone-100">See Innermind in action</h1>
        <p className="text-stone-400">
          We'll send you a 5-minute walkthrough of the client invite flow, assessment dashboard, and PDF reports.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-stone-400">Full name</label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => set('fullName', e.target.value)}
            placeholder="Dr. Sarah Smith"
            required
            className="w-full rounded-lg bg-stone-800 px-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-stone-400">Work email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="you@practice.com"
            required
            className="w-full rounded-lg bg-stone-800 px-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-stone-400">Your role</label>
          <select
            value={form.role}
            onChange={(e) => set('role', e.target.value)}
            required
            className="w-full rounded-lg bg-stone-800 px-4 py-2.5 text-sm text-stone-100 outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Select your role…</option>
            {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-stone-400">Practice size</label>
          <select
            value={form.practiceSize}
            onChange={(e) => set('practiceSize', e.target.value)}
            required
            className="w-full rounded-lg bg-stone-800 px-4 py-2.5 text-sm text-stone-100 outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Select practice size…</option>
            {PRACTICE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-stone-400">Primary use case</label>
          <select
            value={form.useCase}
            onChange={(e) => set('useCase', e.target.value)}
            required
            className="w-full rounded-lg bg-stone-800 px-4 py-2.5 text-sm text-stone-100 outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Select use case…</option>
            {USE_CASE_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-amber-500 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400 disabled:opacity-50"
        >
          {submitting ? 'Sending…' : 'Send me the demo →'}
        </button>

        <p className="text-center text-xs text-stone-600">
          Ready to start now?{' '}
          <Link href="/professional" className="text-stone-400 hover:text-stone-200 underline">
            Start your free 14-day trial
          </Link>
        </p>
      </form>
    </main>
  )
}
