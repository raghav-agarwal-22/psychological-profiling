'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api, ApiError } from '@/lib/api'
import { getToken } from '@/lib/auth'

interface Workspace {
  id: string
  name: string
  professionalTier: string
  seatLimit: number
  subscriptionStatus: string
  members: { id: string; inviteStatus: string }[]
}

export default function ProfessionalPage() {
  const router = useRouter()
  const [workspaces, setWorkspaces] = useState<Workspace[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [tier, setTier] = useState<'starter' | 'unlimited'>('starter')
  const [interval, setInterval] = useState<'monthly' | 'annual'>('monthly')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.replace('/auth/login?redirect=/professional')
      return
    }
    api.get<{ workspaces: Workspace[] }>('/api/professional/workspaces', token)
      .then((res) => {
        setWorkspaces(res.workspaces)
        if (res.workspaces.length === 1) {
          router.replace(`/professional/${res.workspaces[0]!.id}`)
        }
      })
      .catch(() => setWorkspaces([]))
      .finally(() => setLoading(false))
  }, [router])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const token = getToken()
    if (!token || !name.trim()) return
    setCreating(true)
    setError(null)
    try {
      const res = await api.post<{ workspaceId: string; checkoutUrl: string | null }>(
        '/api/professional/workspaces',
        { name: name.trim(), tier, interval },
        token,
      )
      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl
      } else {
        router.push(`/professional/${res.workspaceId}`)
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create workspace')
      setCreating(false)
    }
  }

  const TIER_PRICES = {
    starter: { monthly: '$29', annual: '$290' },
    unlimited: { monthly: '$79', annual: '$790' },
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="h-64 animate-pulse rounded-xl bg-stone-800/50" />
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      {/* Value prop header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-serif text-3xl font-medium text-stone-100">Innermind for Practitioners</h1>
        <p className="text-stone-400">
          Invite clients to complete validated psychological assessments. Understand them from session one.
        </p>
      </div>

      {workspaces && workspaces.length > 0 ? (
        <div className="space-y-4">
          {workspaces.map((ws) => (
            <Link
              key={ws.id}
              href={`/professional/${ws.id}`}
              className="block rounded-xl border border-stone-800 bg-stone-900/60 p-6 transition-colors hover:border-stone-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-stone-100">{ws.name}</p>
                  <p className="mt-0.5 text-sm text-stone-500 capitalize">{ws.professionalTier} plan · {ws.members.filter((m) => m.inviteStatus === 'accepted').length} clients</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${ws.subscriptionStatus === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-stone-700 text-stone-400'}`}>
                  {ws.subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </Link>
          ))}
          <button
            onClick={() => setShowCreate(true)}
            className="mt-4 w-full rounded-xl border border-dashed border-stone-700 py-4 text-sm text-stone-500 transition-colors hover:border-stone-500 hover:text-stone-300"
          >
            + New workspace
          </button>
        </div>
      ) : (
        /* Pricing / create CTA */
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Starter */}
            <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-6">
              <h3 className="mb-1 font-semibold text-stone-100">Starter</h3>
              <p className="mb-3 text-sm text-stone-400">Up to 3 clients. Perfect for individual practitioners.</p>
              <p className="mb-6 text-2xl font-bold text-stone-100">$29<span className="text-sm font-normal text-stone-500"> / month</span></p>
              <button
                onClick={() => { setTier('starter'); setShowCreate(true) }}
                className="w-full rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
              >
                Get started →
              </button>
            </div>
            {/* Unlimited */}
            <div className="rounded-xl border border-amber-500/30 bg-stone-900/60 p-6">
              <h3 className="mb-1 font-semibold text-stone-100">Unlimited</h3>
              <p className="mb-3 text-sm text-stone-400">Unlimited clients. For growing practices.</p>
              <p className="mb-6 text-2xl font-bold text-stone-100">$79<span className="text-sm font-normal text-stone-500"> / month</span></p>
              <button
                onClick={() => { setTier('unlimited'); setShowCreate(true) }}
                className="w-full rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
              >
                Get started →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create workspace modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-stone-800 bg-stone-950 p-6">
            <h2 className="mb-6 font-serif text-xl text-stone-100">Create workspace</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-stone-400">Workspace name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Smith's Practice"
                  className="w-full rounded-lg bg-stone-800 px-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-400">Plan</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as 'starter' | 'unlimited')}
                    className="w-full rounded-lg bg-stone-800 px-3 py-2.5 text-sm text-stone-100 outline-none"
                  >
                    <option value="starter">Starter (3 clients)</option>
                    <option value="unlimited">Unlimited</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-400">Billing</label>
                  <select
                    value={interval}
                    onChange={(e) => setInterval(e.target.value as 'monthly' | 'annual')}
                    className="w-full rounded-lg bg-stone-800 px-3 py-2.5 text-sm text-stone-100 outline-none"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual (save 17%)</option>
                  </select>
                </div>
              </div>
              <p className="text-sm text-stone-400">
                {TIER_PRICES[tier][interval]} / {interval === 'monthly' ? 'month' : 'year'} · You'll be redirected to checkout.
              </p>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 rounded-lg border border-stone-700 py-2.5 text-sm text-stone-400 transition-colors hover:text-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400 disabled:opacity-50"
                >
                  {creating ? 'Creating…' : 'Continue to checkout →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
