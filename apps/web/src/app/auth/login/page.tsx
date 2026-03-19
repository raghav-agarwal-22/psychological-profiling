'use client'

import { useState, type FormEvent } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_URL}/api/auth/magic-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')

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
      <div className="flex flex-col items-center justify-center px-6 py-24">
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
    <div className="flex flex-col items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="text-3xl">◎</span>
          <h1 className="mt-4 font-serif text-3xl text-stone-100">Welcome back</h1>
          <p className="mt-2 text-stone-400">Enter your email to receive a sign-in link.</p>
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
    </div>
  )
}
