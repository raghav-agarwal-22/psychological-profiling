'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { track } from '@/lib/analytics'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export default function ReferralRedirectPage() {
  const router = useRouter()
  const params = useParams()
  const code = params['code'] as string

  useEffect(() => {
    if (code) {
      // Store the referral code in localStorage so the verify flow can pick it up
      localStorage.setItem('innermind_referral_code', code)
      // Track the click in PostHog
      track('referral_link_clicked', { code })
      // Track the click server-side (fire-and-forget, don't block redirect)
      fetch(`${API_URL}/api/affiliates/track-click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      }).catch(() => {/* ignore tracking errors */})
    }
    router.replace(`/invite/${encodeURIComponent(code ?? '')}`)
  }, [code, router])

  return (
    <div className="flex items-center justify-center py-24">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" />
    </div>
  )
}
