'use client'

import Link from 'next/link'
import { posthog } from '@/lib/posthog'

interface BlurredPreviewGateProps {
  /** Whether the user is on the blurred variant and is a free-tier user */
  active: boolean
  children: React.ReactNode
  /** Label sent in analytics events to identify which section was gated */
  section: string
}

/**
 * Wraps a results section with a blur overlay and upgrade CTA when the A/B
 * test variant is 'blurred' and the user has not upgraded.
 *
 * Usage: wrap any section you want to gate. When `active` is false (control
 * variant or paid user) the children render normally with no wrapping DOM.
 */
export function BlurredPreviewGate({ active, children, section }: BlurredPreviewGateProps) {
  if (!active) return <>{children}</>

  const handleUpgradeClick = () => {
    posthog.capture('ab_upgrade_click', { variant: 'blurred', section })
  }

  return (
    <div className="relative mb-8">
      {/* Blurred content */}
      <div className="pointer-events-none select-none blur-sm opacity-60 saturate-50">
        {children}
      </div>

      {/* Upgrade CTA overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-t from-stone-950/95 via-stone-950/80 to-transparent px-6 py-8 text-center">
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15 ring-1 ring-amber-500/30">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-amber-400"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <p className="font-serif text-lg text-stone-100">Unlock the full picture</p>
        <p className="mt-1 mb-5 max-w-xs text-sm text-stone-400 leading-relaxed">
          Upgrade to Pro to access your complete psychological portrait — synthesis, growth
          recommendations, and reflection journal.
        </p>
        <Link
          href="/upgrade"
          onClick={handleUpgradeClick}
          className="rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
        >
          Upgrade to Pro — $19/mo
        </Link>
        <p className="mt-3 text-xs text-stone-600">Cancel anytime · 7-day money-back guarantee</p>
      </div>
    </div>
  )
}
