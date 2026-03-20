'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api, ApiError } from '@/lib/api'
import { getToken, clearToken } from '@/lib/auth'

interface UserMe {
  id: string
  email: string
  name: string | null
  subscriptionTier: string
  trialEndsAt: string | null
  stripeCustomerId: string | null
  createdAt: string
}

interface DigestPrefs {
  emailDigestOptIn: boolean
  lastDigestSentAt: string | null
}

const TIER_LABELS: Record<string, string> = {
  free: 'Free',
  essential: 'Essential',
  pro: 'Pro',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserMe | null>(null)
  const [digestPrefs, setDigestPrefs] = useState<DigestPrefs | null>(null)
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
  const [portalError, setPortalError] = useState<string | null>(null)
  const [digestError, setDigestError] = useState<string | null>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.replace('/auth/login?redirect=/account')
      return
    }

    Promise.all([
      api.get<{ user: UserMe }>('/api/auth/me', token),
      api.get<DigestPrefs>('/api/users/me/digest-preferences', token),
    ])
      .then(([meRes, digestRes]) => {
        setUser(meRes.user)
        setDigestPrefs(digestRes)
      })
      .catch(() => {
        router.replace('/auth/login?redirect=/account')
      })
      .finally(() => setLoading(false))
  }, [router])

  async function handlePortal() {
    const token = getToken()
    if (!token) return
    setPortalLoading(true)
    setPortalError(null)
    try {
      const res = await api.post<{ url: string }>('/api/billing/portal', {}, token)
      window.location.href = res.url
    } catch {
      setPortalError('Could not open billing portal. Please try again.')
      setPortalLoading(false)
    }
  }

  async function handleDigestToggle() {
    const token = getToken()
    if (!token || !digestPrefs) return
    const newValue = !digestPrefs.emailDigestOptIn
    setDigestPrefs((prev) => prev ? { ...prev, emailDigestOptIn: newValue } : prev)
    setDigestError(null)
    try {
      await api.patch('/api/users/me/digest-preferences', { emailDigestOptIn: newValue }, token)
    } catch {
      setDigestPrefs((prev) => prev ? { ...prev, emailDigestOptIn: !newValue } : prev)
      setDigestError('Failed to save preference. Please try again.')
    }
  }

  function handleSignOut() {
    clearToken()
    router.push('/')
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-8 font-serif text-2xl font-medium text-stone-100">◎ Account Settings</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-stone-800/50" />
          ))}
        </div>
      </main>
    )
  }

  if (!user) return null

  const tier = user.subscriptionTier ?? 'free'
  const isPaid = tier !== 'free'
  const isTrialing =
    tier === 'pro' && user.trialEndsAt && new Date(user.trialEndsAt) > new Date()

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-8 font-serif text-2xl font-medium text-stone-100">◎ Account Settings</h1>

      <div className="space-y-4">
        {/* Profile */}
        <section className="rounded-xl border border-stone-800 bg-stone-900/60 p-6">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone-500">
            Profile
          </h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-400">Email</span>
              <span className="text-sm text-stone-100">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-400">Member since</span>
              <span className="text-sm text-stone-100">{formatDate(user.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-400">User ID</span>
              <span className="font-mono text-xs text-stone-600">{user.id}</span>
            </div>
          </div>
        </section>

        {/* Subscription */}
        <section className="rounded-xl border border-stone-800 bg-stone-900/60 p-6">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone-500">
            Subscription
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-stone-100">
                  Plan: {TIER_LABELS[tier] ?? tier}
                </span>
                {isPaid && (
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                    ✓
                  </span>
                )}
              </div>
              {isTrialing && user.trialEndsAt && (
                <p className="mt-1 text-xs text-stone-500">
                  Trial ends {new Date(user.trialEndsAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              )}
            </div>
            <div>
              {isPaid ? (
                <div className="text-right">
                  <button
                    onClick={handlePortal}
                    disabled={portalLoading}
                    className="rounded-lg bg-stone-800 px-4 py-2 text-sm text-stone-300 transition-colors hover:bg-stone-700 disabled:opacity-50"
                  >
                    {portalLoading ? 'Loading…' : 'Manage subscription →'}
                  </button>
                  {portalError && (
                    <p className="mt-1.5 text-xs text-red-400">{portalError}</p>
                  )}
                </div>
              ) : (
                <Link
                  href="/upgrade"
                  className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
                >
                  Upgrade to Pro →
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-xl border border-stone-800 bg-stone-900/60 p-6">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone-500">
            Notifications
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-200">Weekly digest</p>
              {digestPrefs?.lastDigestSentAt && (
                <p className="mt-0.5 text-xs text-stone-600">
                  Last sent {formatDate(digestPrefs.lastDigestSentAt)}
                </p>
              )}
              {digestError && <p className="mt-1 text-xs text-red-400">{digestError}</p>}
            </div>
            <button
              onClick={handleDigestToggle}
              disabled={digestPrefs === null}
              aria-pressed={digestPrefs?.emailDigestOptIn ?? false}
              className={`relative h-6 w-11 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:opacity-50 ${
                digestPrefs?.emailDigestOptIn ? 'bg-amber-500' : 'bg-stone-700'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  digestPrefs?.emailDigestOptIn ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="rounded-xl border border-stone-800 bg-stone-900/60 p-6">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone-500">
            Danger Zone
          </h2>
          <button
            onClick={handleSignOut}
            className="rounded-lg border border-stone-700 px-4 py-2 text-sm text-stone-400 transition-colors hover:border-red-800 hover:text-red-400"
          >
            Sign out
          </button>
        </section>
      </div>
    </main>
  )
}
