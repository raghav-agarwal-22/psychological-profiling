'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api, ApiError } from '@/lib/api'
import { getToken } from '@/lib/auth'

function AcceptInviteInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'needs_auth'>('loading')
  const [workspaceName, setWorkspaceName] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setErrorMsg('Invalid invite link')
      return
    }

    const authToken = getToken()
    if (!authToken) {
      setStatus('needs_auth')
      return
    }

    api.get<{ ok: boolean; workspaceName: string }>(`/api/professional/accept-invite?token=${token}`, authToken)
      .then((res) => {
        setWorkspaceName(res.workspaceName)
        setStatus('success')
      })
      .catch((err) => {
        setStatus('error')
        setErrorMsg(err instanceof ApiError ? err.message : 'Invalid or expired invite')
      })
  }, [token, router])

  if (status === 'loading') {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-6">
        <p className="text-stone-400">Accepting invite…</p>
      </main>
    )
  }

  if (status === 'needs_auth') {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <div className="text-4xl mb-6">◎</div>
        <h1 className="mb-3 font-serif text-2xl text-stone-100">You've been invited</h1>
        <p className="mb-8 text-stone-400">Sign in or create an account to accept this invite and take your assessment.</p>
        <a
          href={`/auth/login?redirect=/professional/accept-invite?token=${token}`}
          className="rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-950 hover:bg-amber-400"
        >
          Sign in to continue →
        </a>
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="mb-3 font-serif text-2xl text-stone-100">Invalid invite</h1>
        <p className="mb-8 text-stone-400">{errorMsg}</p>
        <a href="/" className="text-sm text-stone-400 hover:text-stone-200">Go home →</a>
      </main>
    )
  }

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="text-4xl mb-6">◎</div>
      <h1 className="mb-3 font-serif text-2xl text-stone-100">You're in!</h1>
      <p className="mb-8 text-stone-400">
        You've been added to <strong className="text-stone-200">{workspaceName}</strong>. Take your psychological assessment to get started.
      </p>
      <button
        onClick={() => router.push('/dashboard')}
        className="rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-950 hover:bg-amber-400"
      >
        Take assessment →
      </button>
    </main>
  )
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<main className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" /></main>}>
      <AcceptInviteInner />
    </Suspense>
  )
}
