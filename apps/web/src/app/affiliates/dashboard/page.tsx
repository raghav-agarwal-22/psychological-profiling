'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

interface CommissionEntry {
  id: string
  amountCents: number
  status: 'pending' | 'paid'
  paidAt: string | null
  createdAt: string
}

interface DashboardData {
  referralCode: string
  referralUrl: string
  stats: {
    totalClicks: number
    totalReferrals: number
    activeSubscribers: number
    pendingEarningsCents: number
    paidEarningsCents: number
  }
  recentCommissions: CommissionEntry[]
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AffiliateDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [status, setStatus] = useState<'loading' | 'unauthenticated' | 'not_affiliate' | 'pending' | 'rejected' | 'ready'>('loading')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('innermind_token')
    if (!token) {
      setStatus('unauthenticated')
      return
    }

    // Check affiliate status first
    fetch(`${API_URL}/api/affiliates/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((me: { isAffiliate?: boolean; status?: string }) => {
        if (!me.isAffiliate) { setStatus('not_affiliate'); return }
        if (me.status === 'pending') { setStatus('pending'); return }
        if (me.status === 'rejected') { setStatus('rejected'); return }

        // Approved — load full dashboard
        return fetch(`${API_URL}/api/affiliates/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((r) => r.json())
          .then((d: DashboardData) => { setData(d); setStatus('ready') })
      })
      .catch(() => setStatus('not_affiliate'))
  }, [])

  async function copyLink() {
    if (!data) return
    await navigator.clipboard.writeText(data.referralUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (status === 'loading') {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="mb-6 text-stone-400">Sign in to access your affiliate dashboard.</p>
        <Link href="/auth/login" className="rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-stone-950 hover:bg-amber-400">
          Sign in →
        </Link>
      </div>
    )
  }

  if (status === 'not_affiliate') {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="mb-3 font-serif text-2xl text-stone-100">You're not an affiliate yet</h1>
        <p className="mb-6 text-stone-400">Apply to join the affiliate program and earn 20% recurring commission.</p>
        <Link href="/affiliates/apply" className="rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-stone-950 hover:bg-amber-400">
          Apply now →
        </Link>
      </div>
    )
  }

  if (status === 'pending') {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10">
          <span className="text-xl text-amber-400">◎</span>
        </div>
        <h1 className="mb-3 font-serif text-2xl text-stone-100">Application under review</h1>
        <p className="text-stone-400">We review applications within 24 hours. You'll receive an email with your referral link once approved.</p>
      </div>
    )
  }

  if (status === 'rejected') {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="mb-3 font-serif text-2xl text-stone-100">Application not approved</h1>
        <p className="mb-6 text-stone-400">Your application wasn't approved at this time. Questions? Email us at hello@innermind.app.</p>
        <Link href="/" className="rounded-xl bg-stone-800 px-6 py-2.5 text-sm font-semibold text-stone-200 hover:bg-stone-700">
          Back to Innermind
        </Link>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="mb-1 font-serif text-3xl text-stone-100">Affiliate dashboard</h1>
        <p className="text-sm text-stone-500">20% recurring commission · Paid monthly</p>
      </div>

      {/* Referral link */}
      <div className="mb-8 rounded-2xl border border-stone-700 bg-stone-900/60 p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-stone-500">Your referral link</p>
        <div className="flex items-center gap-3">
          <code className="flex-1 overflow-hidden text-ellipsis rounded-lg bg-stone-800 px-3 py-2 text-sm text-amber-300">
            {data.referralUrl}
          </code>
          <button
            onClick={copyLink}
            className="shrink-0 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-stone-950 transition-colors hover:bg-amber-400"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="mt-2 text-xs text-stone-600">Share this link in your newsletter, bio, or with clients. 90-day attribution cookie.</p>
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total clicks', value: data.stats.totalClicks.toLocaleString() },
          { label: 'Referrals', value: data.stats.totalReferrals.toLocaleString() },
          { label: 'Active subscribers', value: data.stats.activeSubscribers.toLocaleString() },
          { label: 'Pending earnings', value: formatCents(data.stats.pendingEarningsCents) },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-stone-800 bg-stone-900/40 p-4">
            <p className="mb-1 text-xs text-stone-500">{stat.label}</p>
            <p className="font-serif text-2xl text-stone-100">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Paid summary */}
      <div className="mb-8 rounded-xl border border-stone-800 bg-stone-900/40 p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-stone-500">Total paid out</p>
          <p className="font-serif text-2xl text-stone-100">{formatCents(data.stats.paidEarningsCents)}</p>
        </div>
        <p className="text-xs text-stone-600 max-w-xs text-right">
          Commissions are calculated on the 1st of each month and paid within 5 business days. Minimum payout $25.
        </p>
      </div>

      {/* Commission history */}
      <div>
        <h2 className="mb-4 text-sm font-semibold text-stone-300">Commission history</h2>
        {data.recentCommissions.length === 0 ? (
          <div className="rounded-xl border border-stone-800 bg-stone-900/40 p-8 text-center text-sm text-stone-500">
            No commissions yet. Share your referral link to start earning.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-stone-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-900/60">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentCommissions.map((c, i) => (
                  <tr key={c.id} className={i < data.recentCommissions.length - 1 ? 'border-b border-stone-800/50' : ''}>
                    <td className="px-4 py-3 text-stone-400">{formatDate(c.createdAt)}</td>
                    <td className="px-4 py-3 font-medium text-stone-200">{formatCents(c.amountCents)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        c.status === 'paid'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {c.status === 'paid' ? `Paid ${c.paidAt ? formatDate(c.paidAt) : ''}` : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
