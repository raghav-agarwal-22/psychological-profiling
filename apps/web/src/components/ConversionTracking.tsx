'use client'

/**
 * ConversionTracking — client component that fires ad conversion events
 * based on URL params. Mount once in layout; handles:
 *   /dashboard?upgraded=1  → purchase conversion
 *   /dashboard?upgraded=1&plan=pro → with plan name
 */
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackPurchase } from '@/lib/ads'

// Pro plan monthly price in cents
const PLAN_VALUES: Record<string, number> = {
  pro: 1900,
  professional: 4900,
}

export function ConversionTracking() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Purchase conversion: fired when Stripe redirects back with ?upgraded=1
    if (pathname === '/dashboard' && searchParams?.get('upgraded') === '1') {
      const plan = searchParams.get('plan') ?? 'pro'
      const value = PLAN_VALUES[plan] ?? PLAN_VALUES.pro
      trackPurchase(plan, value)
    }
  }, [pathname, searchParams])

  return null
}
