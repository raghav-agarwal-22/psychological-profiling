'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { track } from '@/lib/analytics'

/**
 * Drop this into the landing page (server component) to fire a
 * `landing_page_viewed` event with UTM / affiliate attribution.
 */
export function LandingAnalytics() {
  const searchParams = useSearchParams()

  useEffect(() => {
    track('landing_page_viewed', {
      source: searchParams.get('utm_source') ?? searchParams.get('ref') ?? undefined,
      medium: searchParams.get('utm_medium') ?? undefined,
      campaign: searchParams.get('utm_campaign') ?? undefined,
      affiliate_code: searchParams.get('aff') ?? undefined,
      referral_code: searchParams.get('r') ?? undefined,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
