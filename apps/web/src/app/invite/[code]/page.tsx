'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { track } from '@/lib/analytics'

const FRAMEWORKS = [
  { icon: '◯', label: 'Big Five Personality', desc: 'Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism' },
  { icon: '◎', label: 'Jungian Archetypes', desc: 'Hero, Shadow, Anima/Animus, Self — your mythic patterns' },
  { icon: '◇', label: 'Values Inventory', desc: '10 universal value dimensions ranked to your lived priorities' },
  { icon: '◈', label: 'Attachment Style', desc: 'Secure, Anxious, Avoidant — how you connect in relationships' },
  { icon: '○', label: 'Enneagram', desc: '9 personality types mapping your core motivations and fears' },
  { icon: '✦', label: 'AI Synthesis', desc: 'A unified psychological portrait woven from all five frameworks' },
]

export default function InviteLandingPage() {
  const params = useParams()
  const code = params['code'] as string

  useEffect(() => {
    if (!code) return
    localStorage.setItem('innermind_referral_code', code)
    track('referral_page_viewed', { code })
  }, [code])

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Nav */}
      <div className="border-b border-stone-800/60">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <span className="font-serif text-xl text-stone-100">Innermind</span>
          <Link
            href={`/auth/login?ref=${encodeURIComponent(code ?? '')}`}
            className="text-sm text-stone-400 hover:text-stone-300 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Hero */}
        <div className="mb-14 text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-3xl border border-amber-500/30 bg-amber-500/10">
            <span className="text-3xl">◎</span>
          </div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span className="text-xs font-medium text-amber-400">You have been invited — 7 days Pro free</span>
          </div>
          <h1 className="mb-4 font-serif text-5xl leading-tight text-stone-100">
            Understand who<br />you really are
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-stone-400">
            Innermind is a deep psychological profiling platform. Five science-backed frameworks, synthesised into one coherent portrait of your mind.
          </p>
        </div>

        {/* CTA block */}
        <div className="mb-14 rounded-3xl border border-amber-500/20 bg-amber-500/5 p-8 text-center">
          <p className="mb-2 text-sm font-medium text-amber-400">Your friend invited you</p>
          <p className="mb-6 text-stone-300">
            Start your free assessment now and get{' '}
            <span className="font-semibold text-stone-100">7 days Pro free</span> — no card required.
          </p>
          <Link
            href={`/assessment?ref=${encodeURIComponent(code ?? '')}`}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-8 py-3.5 text-sm font-semibold text-stone-950 hover:bg-amber-400 transition-colors"
          >
            Start your free assessment
            <span aria-hidden="true">→</span>
          </Link>
          <p className="mt-4 text-xs text-stone-600">
            Takes 15 minutes · No card required · Results immediately
          </p>
        </div>

        {/* What you'll get */}
        <div className="mb-14">
          <h2 className="mb-6 text-center font-serif text-2xl text-stone-100">What you will discover</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {FRAMEWORKS.map(({ icon, label, desc }) => (
              <div
                key={label}
                className="rounded-2xl border border-stone-800 bg-stone-900/50 p-5"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-lg text-amber-400">{icon}</span>
                  <p className="text-sm font-medium text-stone-200">{label}</p>
                </div>
                <p className="text-xs leading-relaxed text-stone-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof strip */}
        <div className="mb-14 rounded-2xl border border-stone-800 bg-stone-900/50 p-6 text-center">
          <p className="mb-1 font-serif text-lg text-stone-100">
            "I finally understand why I react the way I do."
          </p>
          <p className="text-xs text-stone-500">— Innermind user, March 2026</p>
        </div>

        {/* Bottom CTAs */}
        <div className="text-center">
          <Link
            href={`/assessment?ref=${encodeURIComponent(code ?? '')}`}
            className="mb-4 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-8 py-3.5 text-sm font-semibold text-stone-950 hover:bg-amber-400 transition-colors"
          >
            Start your free assessment →
          </Link>
          <p className="text-sm text-stone-600">
            Already have an account?{' '}
            <Link
              href={`/auth/login?ref=${encodeURIComponent(code ?? '')}`}
              className="text-stone-400 underline underline-offset-2 hover:text-stone-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
