'use client'

import { useState } from 'react'
import { track } from '@/lib/analytics'

interface QuizEmailCaptureProps {
  quizType: string
}

export function QuizEmailCapture({ quizType }: QuizEmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
      await fetch(`${apiUrl}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      track('quiz_email_captured', { quiz_type: quizType })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <p className="text-emerald-400 text-sm font-medium">
        We&apos;ll send you your full profile when Innermind launches.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email me my full results"
        autoComplete="email"
        inputMode="email"
        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-violet-500 min-h-[44px]"
      />
      <button
        type="submit"
        disabled={loading || !email}
        className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 transition-colors text-white font-semibold py-3 rounded-lg"
      >
        {loading ? 'Saving...' : 'Email me my results'}
      </button>
    </form>
  )
}
