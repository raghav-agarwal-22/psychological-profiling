'use client'

import Link from 'next/link'

const FRAMEWORKS = [
  { type: 'BIG_FIVE', label: 'Big Five Personality', icon: '◈' },
  { type: 'VALUES_INVENTORY', label: 'Values Inventory', icon: '◉' },
  { type: 'ATTACHMENT_STYLE', label: 'Attachment Style', icon: '◎' },
  { type: 'ENNEAGRAM', label: 'Enneagram', icon: '⬡' },
  { type: 'LIGHT_DARK_TRIAD', label: 'Light Triad', icon: '✦' },
]

interface Props {
  completedTypes: Set<string>
}

export default function ProfileCompletenessWidget({ completedTypes }: Props) {
  const completedCount = FRAMEWORKS.filter((f) => completedTypes.has(f.type)).length
  const total = FRAMEWORKS.length
  const percentage = Math.round((completedCount / total) * 100)

  // Circular progress dimensions
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="font-serif text-xl text-stone-200">Profile completeness</h2>
        {completedCount < total && (
          <Link
            href="/assessment"
            className="shrink-0 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-stone-950 transition-colors hover:bg-amber-400"
          >
            Complete your profile
          </Link>
        )}
      </div>

      <div className="flex items-center gap-6">
        {/* Circular progress */}
        <div className="relative shrink-0">
          <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
            {/* Track */}
            <circle
              cx="36"
              cy="36"
              r={radius}
              fill="none"
              stroke="#292524"
              strokeWidth="6"
            />
            {/* Progress arc */}
            <circle
              cx="36"
              cy="36"
              r={radius}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 36 36)"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-bold text-stone-100">{completedCount}/{total}</span>
            <span className="text-[10px] text-stone-500">{percentage}%</span>
          </div>
        </div>

        {/* Framework rows */}
        <div className="flex-1 space-y-2">
          {FRAMEWORKS.map((fw) => {
            const done = completedTypes.has(fw.type)
            return (
              <div key={fw.type} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`text-base leading-none shrink-0 ${done ? 'text-amber-400' : 'text-stone-600'}`}>
                    {fw.icon}
                  </span>
                  <span className={`truncate text-sm ${done ? 'text-stone-300' : 'text-stone-500'}`}>
                    {fw.label}
                  </span>
                </div>
                {done ? (
                  <span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                    Complete
                  </span>
                ) : (
                  <Link
                    href="/assessment"
                    className="shrink-0 text-xs text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Start →
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
