'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function ReferralRedirectPage() {
  const router = useRouter()
  const params = useParams()
  const code = params['code'] as string

  useEffect(() => {
    if (code) {
      // Store the referral code in localStorage so the verify flow can pick it up
      localStorage.setItem('innermind_referral_code', code)
    }
    router.replace(`/auth/login?ref=${encodeURIComponent(code ?? '')}`)
  }, [code, router])

  return (
    <div className="flex items-center justify-center py-24">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" />
    </div>
  )
}
