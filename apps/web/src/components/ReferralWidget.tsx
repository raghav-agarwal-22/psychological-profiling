'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

interface ReferralData {
  code: string
  referralUrl: string
  referralsCount: number
  pendingRewards: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export default function ReferralWidget() {
  const [data, setData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteSending, setInviteSending] = useState(false)
  const [inviteSent, setInviteSent] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)

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

  async function handleInvite(e: FormEvent) {
    e.preventDefault()
    const token = getToken()
    if (!token || !inviteEmail.trim()) return
    setInviteSending(true)
    setInviteError(null)
    try {
      const res = await fetch(`${API_URL}/api/referrals/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error ?? 'Failed to send invite')
      }
      setInviteSent(true)
      setInviteEmail('')
      setTimeout(() => setInviteSent(false), 4000)
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : 'Failed to send invite')
    } finally {
      setInviteSending(false)
    }
  }

  if (loading) return null
  if (!data) return null

  return (
    <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-amber-400 text-lg leading-none">✦</span>
        <h2 className="font-serif text-xl text-stone-200">Invite friends, get 1 month free</h2>
      </div>

      <p className="mb-4 text-sm text-stone-400 leading-relaxed">
        Both you and your friend get <span className="font-semibold text-amber-300">1 month Pro free</span> when they complete an assessment using your link.
      </p>

      {/* Email invite form */}
      <form onSubmit={handleInvite} className="mb-4 flex gap-2">
        <input
          type="email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          placeholder="friend@example.com"
          required
          className="flex-1 rounded-xl border border-stone-700 bg-stone-800/60 px-3 py-2.5 text-sm text-stone-200 placeholder-stone-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
        <button
          type="submit"
          disabled={inviteSending}
          className="shrink-0 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-stone-950 transition-colors hover:bg-amber-400 disabled:opacity-50"
        >
          {inviteSending ? 'Sending…' : inviteSent ? 'Sent!' : 'Send invite'}
        </button>
      </form>
      {inviteError && <p className="mb-3 text-xs text-rose-400">{inviteError}</p>}

      {/* Referral link */}
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-800/60 px-3 py-2.5">
        <span className="flex-1 truncate text-xs text-stone-400 font-mono">
          {data.referralUrl}
        </span>
        <button
          onClick={handleCopy}
          className="shrink-0 rounded-lg border border-stone-600 bg-stone-700 px-3 py-1.5 text-xs font-semibold text-stone-200 transition-colors hover:bg-stone-600"
        >
          {copied ? 'Copied!' : 'Copy link'}
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
        <p className="text-sm text-stone-600">No referrals yet — invite a friend to get started.</p>
      )}
    </div>
  )
}
