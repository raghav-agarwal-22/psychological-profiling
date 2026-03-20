'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

interface AffiliateApplication {
  id: string
  email: string
  name: string
  websiteUrl: string
  audienceDesc: string
  audienceSize: number | null
  status: 'pending' | 'approved' | 'rejected'
  referralCode: string
  totalClicks: number
  createdAt: string
  _count: { referrals: number; commissions: number }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-400',
  approved: 'bg-emerald-500/10 text-emerald-400',
  rejected: 'bg-rose-500/10 text-rose-400',
}

export default function AdminAffiliatesPage() {
  const [applications, setApplications] = useState<AffiliateApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const token = typeof window !== 'undefined' ? localStorage.getItem('innermind_token') : null

  async function load() {
    if (!token) { setError('Not authenticated'); setLoading(false); return }
    try {
      const res = await fetch(`${API_URL}/api/affiliates/admin/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Forbidden or failed to load')
      const data = await res.json() as { applications: AffiliateApplication[] }
      setApplications(data.applications)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function approve(id: string) {
    if (!token) return
    setActionLoading(id)
    try {
      const res = await fetch(`${API_URL}/api/affiliates/admin/${id}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to approve')
      setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status: 'approved' } : a))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed')
    } finally {
      setActionLoading(null)
    }
  }

  async function reject(id: string) {
    if (!token) return
    setActionLoading(id)
    try {
      const res = await fetch(`${API_URL}/api/affiliates/admin/${id}/reject`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to reject')
      setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status: 'rejected' } : a))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed')
    } finally {
      setActionLoading(null)
    }
  }

  const pending = applications.filter((a) => a.status === 'pending')
  const rest = applications.filter((a) => a.status !== 'pending')

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="text-rose-400">{error}</p>
        <Link href="/admin" className="mt-4 inline-block text-sm text-stone-500 hover:text-stone-300">← Admin</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/admin" className="mb-2 inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-300">← Admin dashboard</Link>
          <h1 className="font-serif text-3xl text-stone-100">Affiliate applications</h1>
        </div>
        <div className="text-right text-sm text-stone-500">
          <p>{pending.length} pending · {applications.filter((a) => a.status === 'approved').length} approved</p>
        </div>
      </div>

      {/* Pending queue */}
      {pending.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-amber-400">Pending review</h2>
          <div className="space-y-4">
            {pending.map((app) => (
              <div key={app.id} className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-stone-100">{app.name}</p>
                    <p className="text-sm text-stone-400">{app.email}</p>
                    <a href={app.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-400 hover:text-amber-300">
                      {app.websiteUrl}
                    </a>
                  </div>
                  <span className="shrink-0 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-400">
                    Pending
                  </span>
                </div>
                <p className="mb-3 text-sm text-stone-400 leading-relaxed">{app.audienceDesc}</p>
                <div className="mb-4 flex gap-4 text-xs text-stone-500">
                  {app.audienceSize && <span>Audience: {app.audienceSize.toLocaleString()}</span>}
                  <span>Applied {formatDate(app.createdAt)}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => approve(app.id)}
                    disabled={actionLoading === app.id}
                    className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
                  >
                    {actionLoading === app.id ? 'Processing…' : 'Approve & send link'}
                  </button>
                  <button
                    onClick={() => reject(app.id)}
                    disabled={actionLoading === app.id}
                    className="rounded-lg border border-stone-700 px-4 py-1.5 text-xs font-semibold text-stone-400 transition-colors hover:border-stone-500 hover:text-stone-200 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pending.length === 0 && (
        <div className="mb-10 rounded-xl border border-stone-800 bg-stone-900/40 p-6 text-center text-sm text-stone-500">
          No pending applications
        </div>
      )}

      {/* All affiliates */}
      {rest.length > 0 && (
        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone-500">All affiliates</h2>
          <div className="overflow-hidden rounded-xl border border-stone-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-900/60">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Clicks</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Referrals</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {rest.map((app, i) => (
                  <tr key={app.id} className={i < rest.length - 1 ? 'border-b border-stone-800/50' : ''}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-stone-200">{app.name}</p>
                      <p className="text-xs text-stone-500">{app.email}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-stone-400">{app.referralCode}</td>
                    <td className="px-4 py-3 text-stone-400">{app.totalClicks}</td>
                    <td className="px-4 py-3 text-stone-400">{app._count.referrals}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[app.status] ?? ''}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
