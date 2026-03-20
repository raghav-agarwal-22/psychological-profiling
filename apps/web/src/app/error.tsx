'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center px-6 py-32 text-center">
      <span className="text-6xl">◈</span>
      <h1 className="mt-6 font-serif text-4xl text-stone-100">Something went wrong</h1>
      <p className="mt-4 max-w-md text-stone-400">
        An unexpected error occurred. This has been logged and we&apos;ll look into it.
      </p>
      <div className="mt-8 flex gap-4">
        <button onClick={reset} className="rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-950 hover:bg-amber-400">
          Try again
        </button>
        <Link href="/dashboard" className="rounded-xl border border-stone-700 px-6 py-3 text-sm text-stone-300 hover:border-stone-600">
          Dashboard
        </Link>
      </div>
    </div>
  )
}
