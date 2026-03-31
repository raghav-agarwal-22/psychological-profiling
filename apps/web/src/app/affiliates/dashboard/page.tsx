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

  function shareOnTwitter() {
    if (!data) return
    const text = encodeURIComponent(
      'I just discovered my psychological profile with Innermind — Big Five, Enneagram, Attachment Style, and more synthesized into one AI portrait. Fascinating stuff:'
    )
    const url = encodeURIComponent(data.referralUrl)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer')
  }

  function shareOnWhatsApp() {
    if (!data) return
    const text = encodeURIComponent(
      `Check out Innermind — it synthesizes 5 psychology frameworks (Big Five, Enneagram, Attachment Style, Schwartz Values, Jungian Archetypes) into a single AI-generated psychological portrait. ${data.referralUrl}`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer')
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
        <p className="mb-6 text-stone-400">Your application wasn't approved at this time. Questions? Email us at hello@innermindhealing.com.</p>
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
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={shareOnTwitter}
            className="flex items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-900 px-3 py-1.5 text-xs font-medium text-stone-300 transition-colors hover:border-stone-500 hover:text-stone-100"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Share on X
          </button>
          <button
            onClick={shareOnWhatsApp}
            className="flex items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-900 px-3 py-1.5 text-xs font-medium text-stone-300 transition-colors hover:border-stone-500 hover:text-stone-100"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Share on WhatsApp
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
