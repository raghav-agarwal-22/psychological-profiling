import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-32 text-center">
      <span className="text-6xl">◎</span>
      <h1 className="mt-6 font-serif text-4xl text-stone-100">Page not found</h1>
      <p className="mt-4 max-w-md text-stone-400">
        This page doesn&apos;t exist or has moved. Your journey continues elsewhere.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/dashboard" className="rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-950 hover:bg-amber-400">
          Go to Dashboard
        </Link>
        <Link href="/" className="rounded-xl border border-stone-700 px-6 py-3 text-sm text-stone-300 hover:border-stone-600">
          Homepage
        </Link>
      </div>
    </div>
  )
}
