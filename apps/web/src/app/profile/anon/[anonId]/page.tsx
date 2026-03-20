'use client'

import { useEffect, useState, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { setToken } from '@/lib/auth'
import { posthog } from '@/lib/posthog'

interface AnonSessionData {
  anonSessionId: string
  templateType: string
  archetypeName: string | null
  isComplete: boolean
  isClaimed: boolean
  summaryTeaser: string | null
}

function AnonProfileContent() {
  const params = useParams()
  const router = useRouter()
  const anonId = params.anonId as string

  const [data, setData] = useState<AnonSessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [guestToken, setGuestToken] = useState<string | null>(null)

  // Email gate state
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [claiming, setClaiming] = useState(false)
  const [claimError, setClaimError] = useState<string | null>(null)
  const [showNameField, setShowNameField] = useState(false)

  useEffect(() => {
    const token = sessionStorage.getItem(`anonToken_${anonId}`)
    if (!token) {
      router.push('/assessment')
      return
    }
    setGuestToken(token)

    api.get<AnonSessionData>(`/api/anon/sessions/${anonId}`, undefined, token)
      .then((d) => {
        setData(d)
        if (!d.isComplete) {
          // Assessment not done yet — send back
          router.push('/assessment')
        }
        if (d.isClaimed) {
          // Already claimed — redirect to dashboard
          router.push('/dashboard')
        }
      })
      .catch(() => router.push('/assessment'))
      .finally(() => setLoading(false))
  }, [anonId, router])

  async function handleClaim(e: React.FormEvent) {
    e.preventDefault()
    if (!guestToken || !data) return

    setClaiming(true)
    setClaimError(null)

    try {
      const { token, profileId } = await api.post<{ token: string; profileId: string }>(
        '/api/anon/claim',
        { anonSessionId: anonId, guestToken, email, name: name || undefined },
      )

      posthog.capture('profile_email_gate_conversion', {
        framework: data.templateType,
        archetypeName: data.archetypeName,
      })

      setToken(token)
      // Clean up the anon token from sessionStorage
      sessionStorage.removeItem(`anonToken_${anonId}`)

      router.push(`/profile/${profileId}?reveal=true`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      if (msg.includes('already claimed')) {
        setClaimError('This profile has already been claimed. Please log in.')
      } else {
        setClaimError(msg)
      }
      setClaiming(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" />
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      {/* Teaser header */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 ring-2 ring-amber-500/20">
          <span className="text-4xl">◎</span>
        </div>
        <p className="mb-1 text-[11px] uppercase tracking-widest text-amber-500/70">
          Your profile is ready
        </p>
        <h1 className="font-serif text-4xl text-stone-100">
          {data.archetypeName ?? 'Your Archetype'}
        </h1>
        <p className="mt-3 text-stone-400 leading-relaxed">
          {data.summaryTeaser
            ? `${data.summaryTeaser}…`
            : 'Your psychological portrait has been generated.'}
        </p>

        {/* Blurred/teased section */}
        <div className="relative mt-6 overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/50 p-6 text-left">
          <div className="space-y-3 blur-sm select-none" aria-hidden="true">
            <div className="h-4 w-3/4 rounded bg-stone-700" />
            <div className="h-4 w-full rounded bg-stone-700" />
            <div className="h-4 w-5/6 rounded bg-stone-700" />
            <div className="h-4 w-2/3 rounded bg-stone-700" />
            <div className="h-4 w-4/5 rounded bg-stone-700" />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-stone-950/60 backdrop-blur-[2px]">
            <span className="text-lg">🔒</span>
            <p className="text-sm font-medium text-stone-300">Enter your email to unlock your full portrait</p>
          </div>
        </div>
      </div>

      {/* Email gate form */}
      <div className="rounded-2xl border border-amber-500/20 bg-stone-900/80 p-7">
        <h2 className="mb-1 font-serif text-xl text-stone-100">Unlock your full profile</h2>
        <p className="mb-6 text-sm text-stone-400">
          Free forever. No credit card. Save your portrait and track your growth over time.
        </p>

        <form onSubmit={handleClaim} className="space-y-4">
          {showNameField && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-stone-400">
                Your name (optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-stone-700 bg-stone-800/50 px-4 py-3 text-sm text-stone-100 placeholder-stone-600 focus:border-amber-500/50 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-stone-400">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                // Show name field once email is started
                if (!showNameField && e.target.value.length > 3) setShowNameField(true)
              }}
              placeholder="you@example.com"
              required
              autoFocus
              className="w-full rounded-xl border border-stone-700 bg-stone-800/50 px-4 py-3 text-sm text-stone-100 placeholder-stone-600 focus:border-amber-500/50 focus:outline-none"
            />
          </div>

          {claimError && (
            <p className="text-sm text-red-400">{claimError}</p>
          )}

          <button
            type="submit"
            disabled={claiming || !email}
            className="w-full rounded-xl bg-amber-500 py-3.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400 disabled:opacity-50"
          >
            {claiming ? 'Saving your profile…' : 'Unlock my full portrait →'}
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] text-stone-600">
          Already have an account?{' '}
          <a href="/auth/login" className="text-stone-500 hover:text-stone-400 underline underline-offset-2">
            Sign in
          </a>
        </p>
      </div>

      {/* Trust signals */}
      <div className="mt-6 flex items-center justify-center gap-6 text-[11px] text-stone-600">
        <span>◎ No credit card</span>
        <span>◎ Free forever</span>
        <span>◎ Your data, your privacy</span>
      </div>
    </div>
  )
}

export default function AnonProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" />
        </div>
      }
    >
      <AnonProfileContent />
    </Suspense>
  )
}
