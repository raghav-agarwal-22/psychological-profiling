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

interface ReferralData {
  code: string
  referralUrl: string
  referralsCount: number
  pendingRewards: number
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
  const [referral, setReferral] = useState<ReferralData | null>(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteState, setInviteState] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.replace('/auth/login?redirect=/account')
      return
    }

    Promise.all([
      api.get<{ user: UserMe }>('/api/auth/me', token),
      api.get<DigestPrefs>('/api/users/me/digest-preferences', token),
      api.get<ReferralData>('/api/referrals/my-link', token),
    ])
      .then(([meRes, digestRes, referralRes]) => {
        setUser(meRes.user)
        setDigestPrefs(digestRes)
        setReferral(referralRes)
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

  async function handleCopyLink() {
    if (!referral) return
    await navigator.clipboard.writeText(referral.referralUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    const token = getToken()
    if (!token || !inviteEmail) return
    setInviteState('loading')
    try {
      await api.post('/api/referrals/invite', { email: inviteEmail }, token)
      setInviteState('sent')
      setInviteEmail('')
    } catch {
      setInviteState('error')
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
                  <div className="mt-2 text-right">
                    <Link
                      href="/cancel-save"
                      className="text-xs text-stone-600 underline-offset-2 hover:text-stone-400 hover:underline"
                    >
                      Cancel subscription
                    </Link>
                  </div>
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

        {/* Referral Program */}
        <section className="rounded-xl border border-stone-800 bg-stone-900/60 p-6">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-stone-500">
            Refer a Friend
          </h2>
          <p className="mb-4 text-sm text-stone-400">
            Share your link — your friend gets a 14-day trial, and you both get 1 month Pro free when they subscribe.
          </p>

          {referral && (
            <div className="space-y-4">
              {/* Stats */}
              {referral.referralsCount > 0 && (
                <div className="flex gap-4">
                  <div className="rounded-lg bg-stone-800 px-4 py-2 text-center">
                    <p className="text-lg font-semibold text-stone-100">{referral.referralsCount}</p>
                    <p className="text-xs text-stone-500">referred</p>
                  </div>
                  <div className="rounded-lg bg-stone-800 px-4 py-2 text-center">
                    <p className="text-lg font-semibold text-amber-400">{referral.pendingRewards}</p>
                    <p className="text-xs text-stone-500">converted</p>
                  </div>
                </div>
              )}

              {/* Referral URL copy */}
              <div className="flex items-center gap-2 rounded-lg border border-stone-700 bg-stone-800/50 p-3">
                <code className="flex-1 truncate text-xs text-stone-400">{referral.referralUrl}</code>
                <button
                  onClick={handleCopyLink}
                  className="shrink-0 rounded-md bg-stone-700 px-3 py-1.5 text-xs font-medium text-stone-200 transition-colors hover:bg-stone-600"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Email invite */}
              <form onSubmit={handleInvite} className="flex gap-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="friend@example.com"
                  className="flex-1 rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-stone-100 placeholder-stone-600 focus:border-amber-500/50 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={inviteState === 'loading' || !inviteEmail}
                  className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400 disabled:opacity-50"
                >
                  {inviteState === 'loading' ? 'Sending…' : 'Invite'}
                </button>
              </form>
              {inviteState === 'sent' && (
                <p className="text-xs text-green-400">Invite sent!</p>
              )}
              {inviteState === 'error' && (
                <p className="text-xs text-red-400">Failed to send invite. Try again.</p>
              )}
            </div>
          )}
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
