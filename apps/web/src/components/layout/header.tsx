import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-800 bg-stone-950/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-xl transition-opacity group-hover:opacity-80">◎</span>
          <span className="font-serif text-lg font-medium text-stone-100">Innermind</span>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-6 sm:flex">
          <Link
            href="/about"
            className="text-sm text-stone-400 transition-colors hover:text-stone-100"
          >
            About
          </Link>
          <Link
            href="/teams"
            className="text-sm text-stone-400 transition-colors hover:text-stone-100"
          >
            Teams
          </Link>
          <Link
            href="/journal"
            className="text-sm text-stone-400 transition-colors hover:text-stone-100"
          >
            Journal
          </Link>
          <Link
            href="/auth/login"
            className="text-sm text-stone-400 transition-colors hover:text-stone-100"
          >
            Sign in
          </Link>
          <Button asChild size="sm">
            <Link href="/auth/login">Begin journey</Link>
          </Button>
        </nav>

        {/* Mobile nav */}
        <Link
          href="/auth/login"
          className="flex items-center text-sm font-medium text-amber-400 sm:hidden"
        >
          Sign in
        </Link>
      </div>
    </header>
  )
}
