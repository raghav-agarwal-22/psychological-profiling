'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

interface ReferralData {
  code: string
  referralUrl: string
  referralsCount: number
  pendingRewards: number
}

export default function ReferralWidget() {
  const [data, setData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }
    api
      .get<ReferralData>('/api/referrals/my-link', token)
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleCopy() {
    if (!data?.referralUrl) return
    try {
      await navigator.clipboard.writeText(data.referralUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable
    }
  }

  if (loading) return null
  if (!data) return null

  return (
    <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-amber-400 text-lg leading-none">✦</span>
        <h2 className="font-serif text-xl text-stone-200">Share Innermind</h2>
      </div>

      <p className="mb-4 text-sm text-stone-400 leading-relaxed">
        Both you and your friend get <span className="font-semibold text-amber-300">1 month Pro free</span> when they complete an assessment using your link.
      </p>

      {/* Referral link */}
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-800/60 px-3 py-2.5">
        <span className="flex-1 truncate text-sm text-stone-300 font-mono">
          {data.referralUrl}
        </span>
        <button
          onClick={handleCopy}
          className="shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-stone-950 transition-colors hover:bg-amber-400"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Stats */}
      {data.referralsCount > 0 ? (
        <p className="text-sm text-stone-400">
          <span className="font-semibold text-stone-200">{data.referralsCount}</span>{' '}
          {data.referralsCount === 1 ? 'friend has' : 'friends have'} joined via your link
          {data.pendingRewards > 0 && (
            <span className="ml-2 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
              {data.pendingRewards} reward{data.pendingRewards !== 1 ? 's' : ''} granted
            </span>
          )}
        </p>
      ) : (
        <p className="text-sm text-stone-600">No referrals yet — share your link to get started.</p>
      )}
    </div>
  )
}
