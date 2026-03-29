'use client'

import Link from 'next/link'

interface QuizUpgradeCardProps {
  quizName: string
  /** Brief description of what the full portrait reveals beyond this quiz */
  teaserText: string
  /** What the free quiz showed them (2-3 items) */
  freeItems?: string[]
  /** What the full portrait reveals (4-6 items) */
  proItems?: string[]
}

const DEFAULT_FREE_ITEMS = [
  'A single framework snapshot',
  'Surface-level trait labels',
  'Generic text descriptions',
]

const DEFAULT_PRO_ITEMS = [
  'AI synthesis across 7 frameworks',
  'How your traits interact and conflict',
  'Your shadow side and blind spots',
  'Core wounds and growth edges',
  'Relationship and communication patterns',
  'Career alignment and purpose mapping',
]

export function QuizUpgradeCard({
  quizName,
  teaserText,
  freeItems = DEFAULT_FREE_ITEMS,
  proItems = DEFAULT_PRO_ITEMS,
}: QuizUpgradeCardProps) {
  return (
    <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-b from-violet-950/40 to-[#0a0a0f] overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 text-center border-b border-white/5">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-400 mb-2">
          You&apos;ve seen your {quizName} result
        </p>
        <h3 className="text-xl font-bold text-white leading-snug">
          This is 1 of 7 layers in your full portrait
        </h3>
        <p className="mt-2 text-sm text-white/50 max-w-sm mx-auto leading-relaxed">
          {teaserText}
        </p>
      </div>

      {/* Comparison table */}
      <div className="grid grid-cols-2 divide-x divide-white/5">
        {/* Free column */}
        <div className="px-4 py-5 space-y-3">
          <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">
            This free quiz
          </p>
          {freeItems.map((item) => (
            <div key={item} className="flex items-start gap-2">
              <span className="text-white/20 mt-0.5 flex-shrink-0">&#x2713;</span>
              <span className="text-white/40 text-xs leading-snug">{item}</span>
            </div>
          ))}
        </div>

        {/* Pro column */}
        <div className="px-4 py-5 space-y-3 bg-violet-950/20">
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-3">
            Full AI portrait
          </p>
          {proItems.map((item) => (
            <div key={item} className="flex items-start gap-2">
              <span className="text-violet-400 mt-0.5 flex-shrink-0">&#x2713;</span>
              <span className="text-white/80 text-xs leading-snug">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Urgency + CTA */}
      <div className="px-6 py-5 border-t border-white/5 space-y-3">
        <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>2,400+ people completed their full profile this month</span>
        </div>

        <Link
          href="/assessment"
          className="block w-full text-center bg-violet-600 hover:bg-violet-500 transition-colors text-white font-semibold py-3 rounded-xl text-sm"
        >
          Unlock Your Full Psychological Portrait &rarr;
        </Link>

        <Link
          href="/upgrade"
          className="block w-full text-center text-white/40 hover:text-white/60 text-xs transition-colors py-1"
        >
          See plans from $12/mo
        </Link>
      </div>
    </div>
  )
}
