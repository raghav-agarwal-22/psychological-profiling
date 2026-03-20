'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { getToken } from '@/lib/auth'

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'For Professionals', href: '/for-professionals' },
  { label: 'Journal', href: '/journal' },
  { label: 'Insights', href: '/insights' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsLoggedIn(!!getToken())
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-stone-800 bg-stone-950/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
          <span className="text-xl transition-opacity group-hover:opacity-80">◎</span>
          <span className="font-serif text-lg font-medium text-stone-100">Innermind</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-stone-400 transition-colors hover:text-stone-100"
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-stone-400 transition-colors hover:text-stone-100"
              >
                Dashboard
              </Link>
              <Link
                href="/account"
                className="text-sm text-stone-400 transition-colors hover:text-stone-100"
              >
                Account
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm text-stone-400 transition-colors hover:text-stone-100"
              >
                Sign in
              </Link>
              <Button asChild size="sm">
                <Link href="/auth/login">Start free →</Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile: hamburger button */}
        <button
          className="flex items-center justify-center rounded-lg p-2 text-stone-400 transition-colors hover:bg-stone-800 hover:text-stone-100 sm:hidden"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div className="border-t border-stone-800 bg-stone-950 px-6 py-4 sm:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm text-stone-300 transition-colors hover:bg-stone-800/60 hover:text-stone-100"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-stone-800 pt-3">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block rounded-lg px-3 py-2.5 text-sm text-stone-300 transition-colors hover:bg-stone-800/60 hover:text-stone-100"
                    onClick={() => setMobileOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/account"
                    className="block rounded-lg px-3 py-2.5 text-sm text-stone-300 transition-colors hover:bg-stone-800/60 hover:text-stone-100"
                    onClick={() => setMobileOpen(false)}
                  >
                    Account
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block rounded-lg px-3 py-2.5 text-sm text-stone-300 transition-colors hover:bg-stone-800/60 hover:text-stone-100"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/login"
                    className="mt-2 block rounded-xl bg-amber-500 px-4 py-2.5 text-center text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
                    onClick={() => setMobileOpen(false)}
                  >
                    Start free →
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
