'use client'

import { useState } from 'react'
import Link from 'next/link'

export interface DimensionProgressData {
  count: number
  total: number
  completed: string[]
  nextRecommended: string | null
  qualityLabel: string
  qualityTier: 'nascent' | 'developing' | 'complete'
}

const DIMENSION_ORDER = [
  'BIG_FIVE',
  'JUNGIAN_ARCHETYPES',
  'ATTACHMENT_STYLE',
  'ENNEAGRAM',
  'VALUES_INVENTORY',
] as const

const DIMENSION_META: Record<string, {
  name: string
  shortName: string
  description: string
  duration: string
}> = {
  BIG_FIVE: {
    name: 'Personality Foundation',
    shortName: 'Foundation',
    description: 'Your core trait architecture — openness, conscientiousness, extraversion, agreeableness, neuroticism.',
    duration: '10–15 min',
  },
  JUNGIAN_ARCHETYPES: {
    name: 'Identity & Myth',
    shortName: 'Identity',
    description: 'Your archetypal identity layer — who you are at a story level, and what lives in your shadow.',
    duration: '5–8 min',
  },
  ATTACHMENT_STYLE: {
    name: 'Relationship Blueprint',
    shortName: 'Relationships',
    description: 'How you attach, seek safety, and show up in close relationships.',
    duration: '3–5 min',
  },
  ENNEAGRAM: {
    name: 'Core Motivation',
    shortName: 'Motivation',
    description: 'The fear and desire engine beneath your behavior — your type, wing, and growth arrows.',
    duration: '8–12 min',
  },
  VALUES_INVENTORY: {
    name: 'Purpose & Ethics',
    shortName: 'Purpose',
    description: 'What you fundamentally care about — your core value clusters and the tensions between them.',
    duration: '5–8 min',
  },
}

interface Props {
  progress: DimensionProgressData
  compact?: boolean
  className?: string
}

export function DimensionsProgress({ progress, compact = false, className = '' }: Props) {
  const [openTooltip, setOpenTooltip] = useState<string | null>(null)

  const tierColor = {
    nascent: 'text-zinc-500',
    developing: 'text-amber-400',
    complete: 'text-emerald-400',
  }[progress.qualityTier]

  if (compact) {
    return (
      <div className={`flex items-center gap-2 text-sm ${className}`}>
        <span className="text-zinc-400">{progress.count}/{progress.total} dimensions</span>
        {progress.nextRecommended && (
          <Link
            href="/assessment"
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Add {DIMENSION_META[progress.nextRecommended]?.shortName ?? 'next'} layer →
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className={`rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-zinc-300">Your Portrait Dimensions</span>
        <span className={`text-sm font-semibold ${tierColor}`}>
          {progress.count} of {progress.total}
        </span>
      </div>

      {/* Dot progress bar */}
      <div className="flex items-start gap-4 mb-4 overflow-x-auto pb-1">
        {DIMENSION_ORDER.map((type) => {
          const meta = DIMENSION_META[type]
          const isComplete = progress.completed.includes(type)
          const isTooltipOpen = openTooltip === type

          return (
            <div key={type} className="flex flex-col items-center gap-1.5 flex-shrink-0 relative">
              <button
                onClick={() => setOpenTooltip(isTooltipOpen ? null : type)}
                className={`w-7 h-7 rounded-full border-2 transition-all duration-200 flex items-center justify-center text-xs font-bold ${
                  isComplete
                    ? 'bg-indigo-500 border-indigo-400 text-white hover:bg-indigo-400'
                    : 'bg-zinc-800 border-zinc-600 text-zinc-500 hover:border-zinc-400'
                }`}
                title={isComplete ? `${meta?.name} — completed` : `${meta?.name} — locked`}
              >
                {isComplete ? '●' : '○'}
              </button>
              <span className={`text-[10px] text-center leading-tight max-w-[60px] ${
                isComplete ? 'text-zinc-300' : 'text-zinc-600'
              }`}>
                {meta?.shortName}
              </span>

              {/* Tooltip */}
              {isTooltipOpen && !isComplete && meta && (
                <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10 w-52 rounded-lg border border-zinc-700 bg-zinc-900 p-3 shadow-xl">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-zinc-400">🔒</span>
                    <span className="text-sm font-medium text-zinc-200">{meta.name}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mb-2 leading-relaxed">{meta.description}</p>
                  <p className="text-xs text-zinc-500 mb-2">Takes ~{meta.duration}</p>
                  <Link
                    href="/assessment"
                    className="block w-full text-center text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded px-2 py-1.5 transition-colors"
                    onClick={() => setOpenTooltip(null)}
                  >
                    Take Assessment →
                  </Link>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* CTA */}
      {progress.nextRecommended && progress.count < progress.total && (
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
          <span className="text-xs text-zinc-500">
            Next: <span className="text-zinc-300">{DIMENSION_META[progress.nextRecommended]?.name}</span>
          </span>
          <Link
            href="/assessment"
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            + Add dimension →
          </Link>
        </div>
      )}

      {progress.count === progress.total && (
        <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
          <span className="text-emerald-400 text-xs">✓</span>
          <span className="text-xs text-emerald-400 font-medium">Complete portrait — all 5 dimensions active</span>
        </div>
      )}

      {/* Quality label */}
      <p className={`text-xs mt-2 ${tierColor}`}>{progress.qualityLabel}</p>
    </div>
  )
}
