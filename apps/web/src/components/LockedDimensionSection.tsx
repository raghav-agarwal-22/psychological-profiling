'use client'

import Link from 'next/link'

interface Props {
  dimensionName: string
  teaseHeadline: string
  teaseLine: string
  duration?: string
  children?: React.ReactNode
}

export function LockedDimensionSection({
  dimensionName,
  teaseHeadline,
  teaseLine,
  duration = '5–8 min',
  children,
}: Props) {
  return (
    <div className="relative rounded-lg border border-zinc-800 bg-zinc-900/30 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800">
        <span className="text-zinc-500">🔒</span>
        <h3 className="text-base font-semibold text-zinc-300">{teaseHeadline}</h3>
      </div>

      {/* Blurred content */}
      <div className="relative px-5 py-4">
        {children ? (
          <div className="blur-sm pointer-events-none select-none opacity-40">
            {children}
          </div>
        ) : (
          <div className="blur-sm pointer-events-none select-none opacity-40 space-y-2">
            <div className="h-3 bg-zinc-700 rounded w-full" />
            <div className="h-3 bg-zinc-700 rounded w-4/5" />
            <div className="h-3 bg-zinc-700 rounded w-3/4" />
            <div className="h-3 bg-zinc-700 rounded w-full mt-2" />
            <div className="h-3 bg-zinc-700 rounded w-2/3" />
          </div>
        )}

        {/* Overlay CTA */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-950/60 backdrop-blur-[2px]">
          <p className="text-sm text-zinc-300 text-center px-6 max-w-sm leading-relaxed">
            {teaseLine}
          </p>
          <div className="flex flex-col items-center gap-1">
            <Link
              href="/assessment"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg px-4 py-2 transition-colors"
            >
              + Unlock {dimensionName}
            </Link>
            <span className="text-xs text-zinc-600">~{duration}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
