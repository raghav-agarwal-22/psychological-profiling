'use client'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { initPostHog, posthog } from '@/lib/posthog'

/**
 * PostHogPageview — tracks pageviews via useSearchParams (must be inside Suspense).
 * Renders null; does not wrap children so main content renders without blocking.
 */
export function PostHogPageview() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    initPostHog()
  }, [])

  useEffect(() => {
    if (!pathname) return
    let url = window.origin + pathname
    if (searchParams?.toString()) url = url + `?${searchParams.toString()}`
    posthog.capture('$pageview', { $current_url: url })
  }, [pathname, searchParams])

  return null
}

/** @deprecated Use PostHogPageview — kept for compatibility */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
