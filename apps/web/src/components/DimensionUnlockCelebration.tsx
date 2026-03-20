'use client'

import { useEffect, useState } from 'react'

interface Props {
  dimensionName: string
  isComplete?: boolean
  onDismiss?: () => void
}

export function DimensionUnlockCelebration({ dimensionName, isComplete = false, onDismiss }: Props) {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    // Small delay for mount animation
    const t = setTimeout(() => setVisible(true), 50)
    // Auto-dismiss after 4s (or 3s for regular, 5s for complete)
    const autoTimeout = setTimeout(() => dismiss(), isComplete ? 5000 : 3500)
    return () => {
      clearTimeout(t)
      clearTimeout(autoTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete])

  function dismiss() {
    setExiting(true)
    setTimeout(() => {
      setVisible(false)
      onDismiss?.()
    }, 300)
  }

  if (!visible && !exiting) return null

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        visible && !exiting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div
        className={`flex items-center gap-3 rounded-xl border px-5 py-3 shadow-2xl backdrop-blur-sm ${
          isComplete
            ? 'border-emerald-500/50 bg-emerald-950/90 text-emerald-200'
            : 'border-indigo-500/40 bg-zinc-900/95 text-zinc-100'
        }`}
      >
        <span className="text-lg">{isComplete ? '🎉' : '✨'}</span>
        <div>
          {isComplete ? (
            <>
              <p className="text-sm font-semibold text-emerald-300">Portrait Complete</p>
              <p className="text-xs text-emerald-400/80">All 5 dimensions unlocked — your full psychological portrait is ready.</p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold">{dimensionName} unlocked</p>
              <p className="text-xs text-zinc-400">Your portrait just got deeper.</p>
            </>
          )}
        </div>
        <button
          onClick={dismiss}
          className="ml-2 text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
