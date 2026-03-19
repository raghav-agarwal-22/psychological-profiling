export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="text-3xl">◎</span>
          <h1 className="mt-4 font-serif text-3xl text-stone-100">Welcome back</h1>
          <p className="mt-2 text-stone-400">Enter your email to receive a sign-in link.</p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-8">
          {/* Magic link form — client component to be wired up in Phase 1 */}
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-stone-300">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-stone-700 bg-stone-800/50 px-4 py-3 text-stone-100 placeholder-stone-500 transition-colors focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
            >
              Send sign-in link
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-stone-500">
            No password needed. We&apos;ll email you a secure link.
          </p>
        </div>
      </div>
    </main>
  )
}
