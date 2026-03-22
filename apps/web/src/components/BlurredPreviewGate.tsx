'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { posthog } from '@/lib/posthog'
import { TestimonialSnippet } from './TestimonialSnippet'

interface BlurredPreviewGateProps {
  /** Whether the user is on the blurred variant and is a free-tier user */
  active: boolean
  children: React.ReactNode
  /** Label sent in analytics events to identify which section was gated */
  section: string
  /** Archetype name for personalized copy (e.g. "The Architect") */
  archetypeName?: string
}

/**
 * Wraps a results section with a blur overlay and upgrade CTA when the A/B
 * test variant is 'blurred' and the user has not upgraded.
 *
 * The CTA copy itself is controlled by PostHog feature flag 'blurred-gate-cta':
 *   control   → 'Start 7-day free trial →' (same as variant-a)
 *   variant-a → 'Start 7-day free trial →'
 *   variant-b → 'Try Pro free for 7 days →'
 *
 * Usage: wrap any section you want to gate. When `active` is false (control
 * variant or paid user) the children render normally with no wrapping DOM.
 */
export function BlurredPreviewGate({ active, children, section, archetypeName }: BlurredPreviewGateProps) {
  const [ctaVariant, setCtaVariant] = useState<string>('control')

  useEffect(() => {
    const flag = posthog.getFeatureFlag('blurred-gate-cta')
    if (typeof flag === 'string') setCtaVariant(flag)
  }, [])

  if (!active) return <>{children}</>

  const handleUpgradeClick = () => {
    posthog.capture('ab_upgrade_click', { variant: 'blurred', section, cta_variant: ctaVariant })
  }

  const ctaLabel =
    ctaVariant === 'variant-b'
      ? 'Try Pro free for 7 days →'
      : 'Start 7-day free trial →'

  const headline = archetypeName
    ? `The ${archetypeName.replace(/^The\s+/i, '')} portrait runs deep.`
    : 'Your full portrait runs deeper than you think.'

  const profileLabel = archetypeName
    ? archetypeName.replace(/^The\s+/i, '')
    : 'your profile'

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
        <p className="font-serif text-lg text-stone-100">{headline}</p>
        <ul className="mt-2 mb-4 space-y-1 text-left max-w-xs">
          <li className="text-xs text-stone-400">✦ AI synthesis of all your assessments into one coherent portrait</li>
          <li className="text-xs text-stone-400">✦ Your specific growth edges and blind spots</li>
          <li className="text-xs text-stone-400">✦ Coaching tailored to your {profileLabel} patterns</li>
        </ul>
        <div className="mb-4 w-full max-w-xs">
          <TestimonialSnippet
            firstName="Maya"
            quote="The blind spots section hit me hard — in the best way. I shared it with my therapist and we spent the whole session on it."
            rating={5}
            personalityTag="ENFP"
          />
        </div>
        <Link
          href="/upgrade"
          onClick={handleUpgradeClick}
          className="rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
        >
          {ctaLabel}
        </Link>
        <p className="mt-3 text-xs text-stone-600">No charge until day 8 · Cancel anytime</p>
      </div>
    </div>
  )
}
