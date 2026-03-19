import Link from 'next/link'

const links = [
  { label: 'About', href: '/about' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
]

export function Footer() {
  return (
    <footer className="border-t border-stone-800 bg-stone-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="text-sm">◎</span>
          <span className="font-serif text-sm text-stone-400">
            Innermind — Know Yourself Deeply
          </span>
        </div>

        <nav className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-stone-500 transition-colors hover:text-stone-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-stone-600">
          &copy; {new Date().getFullYear()} Innermind
        </p>
      </div>
    </footer>
  )
}
