'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { track } from '@/lib/analytics'

export function ExitIntentModal() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem('exitIntentShown')) return

    let idleTimer: ReturnType<typeof setTimeout> | null = null

    function show() {
      if (sessionStorage.getItem('exitIntentShown')) return
      sessionStorage.setItem('exitIntentShown', '1')
      setVisible(true)
      track('exit_intent_triggered', {})
    }

    function resetIdle() {
      if (idleTimer) clearTimeout(idleTimer)
      idleTimer = setTimeout(show, 45_000)
    }

    // Desktop: mouse exits top of viewport
    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0) show()
    }

    document.addEventListener('mouseleave', handleMouseLeave)

    // Mobile: idle for 45s
    const isMobile = /Mobi|Android/i.test(navigator.userAgent)
    if (isMobile) {
      resetIdle()
      window.addEventListener('touchstart', resetIdle)
      window.addEventListener('scroll', resetIdle)
    }

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (idleTimer) clearTimeout(idleTimer)
      if (isMobile) {
        window.removeEventListener('touchstart', resetIdle)
        window.removeEventListener('scroll', resetIdle)
      }
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
      onClick={() => setVisible(false)}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-stone-700 bg-stone-950 p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setVisible(false)}
          className="absolute right-4 top-4 text-stone-500 hover:text-stone-300 transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10">
          <span className="text-xl text-amber-400">◎</span>
        </div>

        <h2 className="mb-2 font-serif text-2xl text-stone-100">
          Get your free psychological snapshot
        </h2>
        <p className="mb-6 text-sm text-stone-400 leading-relaxed">
          Takes 3 minutes, no card needed. Discover your Big Five, attachment style, and more — synthesised by AI into a single coherent portrait.
        </p>

        <Link
          href="/assessment"
          onClick={() => {
            setVisible(false)
            track('exit_intent_cta_clicked', {})
          }}
          className="block w-full rounded-xl bg-amber-500 py-3 text-center text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
        >
          Start free →
        </Link>

        <button
          onClick={() => setVisible(false)}
          className="mt-3 block w-full text-center text-xs text-stone-600 hover:text-stone-400 transition-colors"
        >
          No thanks, I'll skip it
        </button>
      </div>
    </div>
  )
}
