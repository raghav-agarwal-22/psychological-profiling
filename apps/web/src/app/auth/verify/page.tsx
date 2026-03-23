'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { posthog } from '@/lib/posthog'
import { track } from '@/lib/analytics'
import { trackSignup } from '@/lib/ads'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

function VerifyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setStatus('error')
      setError('No token provided.')
      return
    }

    // Read affiliate attribution cookie (set by middleware on ?ref= visits)
    const affiliateRef = document.cookie
      .split('; ')
      .find((c) => c.startsWith('innermind_affiliate_ref='))
      ?.split('=')[1]

    // Read user referral code from localStorage (set by /ref/[code] redirect page)
    const userReferralCode = localStorage.getItem('innermind_referral_code') ?? undefined
    const ref = affiliateRef ?? userReferralCode

    fetch(`${API_URL}/api/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, ref }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem('innermind_token', data.token)
          if (userReferralCode) {
            track('referral_signup', { code: userReferralCode })
          }
          localStorage.removeItem('innermind_referral_code')
          posthog.capture('auth_completed')
          trackSignup()
          setStatus('success')
          setTimeout(() => router.push('/dashboard'), 800)
        } else {
          throw new Error(data.error ?? 'Verification failed')
        }
      })
      .catch((err) => {
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Verification failed')
      })
  }, [searchParams, router])

  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
      {status === 'verifying' && (
        <>
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" />
          <p className="text-stone-400">Verifying your sign-in link…</p>
        </>
      )}
      {status === 'success' && (
        <>
          <span className="text-4xl">✓</span>
          <p className="mt-3 text-stone-300">Signed in! Redirecting…</p>
        </>
      )}
      {status === 'error' && (
        <>
          <span className="text-4xl">✗</span>
          <p className="mt-3 text-stone-300">{error}</p>
          <a href="/auth/login" className="mt-4 text-amber-400 hover:text-amber-300">
            Back to login
          </a>
        </>
      )}
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-24"><div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" /></div>}>
      <VerifyContent />
    </Suspense>
  )
}
