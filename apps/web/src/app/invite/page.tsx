'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { track } from '@/lib/analytics'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

interface ReferralData {
  code: string
  referralUrl: string
  referralsCount: number
  pendingRewards: number
}

export default function InvitePage() {
  const router = useRouter()
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
      router.replace('/auth/login')
      return
    }

    api
      .get<ReferralData>('/api/referrals/my-link', token)
      .then((res) => setData(res))
      .catch(() => router.replace('/auth/login'))
      .finally(() => setLoading(false))
  }, [router])

  function handleCopy() {
    if (!data) return
    navigator.clipboard.writeText(data.referralUrl).then(() => {
      setCopied(true)
      track('referral_link_copied', { code: data.code, source: 'invite_page' })
      setTimeout(() => setCopied(false), 2000)
    })
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!inviteEmail) return
    const token = getToken()
    if (!token) return
    setInviteSending(true)
    setInviteError(null)
    try {
      await api.post('/api/referrals/invite', { email: inviteEmail }, token)
      setInviteSent(true)
      setInviteEmail('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send invite'
      setInviteError(message)
    } finally {
      setInviteSending(false)
    }
  }

  function buildTwitterUrl() {
    if (!data) return '#'
    const text = encodeURIComponent(
      'I use Innermind to understand my psychology — Big Five, Jungian Archetypes, Attachment Style and more. Join me and get 7 days Pro free:',
    )
    const url = encodeURIComponent(data.referralUrl)
    return `https://twitter.com/intent/tweet?text=${text}&url=${url}`
  }

  function buildWhatsAppUrl() {
    if (!data) return '#'
    const text = encodeURIComponent(
      `I use Innermind to understand my psychology. Join me and get 7 days Pro free: ${data.referralUrl}`,
    )
    return `https://wa.me/?text=${text}`
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" />
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <div className="mx-auto max-w-2xl px-6 py-16">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10">
            <span className="text-2xl">◎</span>
          </div>
          <h1 className="mb-3 font-serif text-4xl text-stone-100">Invite friends</h1>
          <p className="text-stone-400">
            Share Innermind with people you care about.{' '}
            <span className="text-amber-400 font-medium">You both get 1 month Pro free.</span>
          </p>
        </div>

        {/* Referral link card */}
        <div className="mb-6 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
            Your invite link
          </p>
          <div className="flex items-center gap-3">
            <code className="flex-1 truncate rounded-xl border border-stone-700 bg-stone-800/60 px-4 py-2.5 text-sm text-amber-400">
              {data.referralUrl}
            </code>
            <button
              onClick={handleCopy}
              className="rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-semibold text-stone-950 hover:bg-amber-400 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 text-center">
            <p className="mb-1 text-3xl font-serif text-amber-400">{data.referralsCount}</p>
            <p className="text-xs text-stone-500">Friends invited</p>
          </div>
          <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 text-center">
            <p className="mb-1 text-3xl font-serif text-amber-400">{data.pendingRewards}</p>
            <p className="text-xs text-stone-500">Months earned</p>
          </div>
        </div>

        {/* Email invite form */}
        <div className="mb-6 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
          <h2 className="mb-4 font-serif text-lg text-stone-100">Invite by email</h2>
          <form onSubmit={handleInvite} className="flex gap-3">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="friend@example.com"
              required
              className="flex-1 rounded-xl border border-stone-700 bg-stone-800/60 px-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
            />
            <button
              type="submit"
              disabled={inviteSending || !inviteEmail}
              className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-stone-950 hover:bg-amber-400 disabled:opacity-50 transition-colors"
            >
              {inviteSending ? 'Sending…' : 'Send invite'}
            </button>
          </form>
          {inviteSent && (
            <p className="mt-3 text-xs text-emerald-400">Invite sent! Your friend will receive an email shortly.</p>
          )}
          {inviteError && (
            <p className="mt-3 text-xs text-red-400">{inviteError}</p>
          )}
        </div>

        {/* Social share */}
        <div className="mb-6 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
          <h2 className="mb-4 font-serif text-lg text-stone-100">Share on social</h2>
          <div className="flex gap-3">
            <a
              href={buildTwitterUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-stone-700 bg-stone-800/60 px-4 py-2.5 text-sm text-stone-300 hover:border-stone-600 hover:text-stone-100 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X
            </a>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-stone-700 bg-stone-800/60 px-4 py-2.5 text-sm text-stone-300 hover:border-stone-600 hover:text-stone-100 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.549 4.1 1.505 5.826L.057 23.492a.5.5 0 0 0 .613.613l5.666-1.448A11.947 11.947 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.905 0-3.68-.515-5.197-1.408l-.373-.218-3.861.987.988-3.861-.218-.373A9.944 9.944 0 0 1 2 12C2 6.478 6.478 2 12 2s10 4.478 10 10-4.478 10-10 10z" />
              </svg>
              Share on WhatsApp
            </a>
          </div>
        </div>

        {/* How it works */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
          <h2 className="mb-5 font-serif text-lg text-stone-100">How it works</h2>
          <ol className="space-y-4">
            {[
              { step: '1', label: 'Share your link', desc: 'Send your unique invite link to a friend.' },
              { step: '2', label: 'Friend signs up', desc: 'They create an account using your link and get 7 days Pro free.' },
              { step: '3', label: 'Both get rewarded', desc: 'Once they sign up, you both receive 1 month Pro free.' },
            ].map(({ step, label, desc }) => (
              <li key={step} className="flex items-start gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-xs font-semibold text-amber-400">
                  {step}
                </span>
                <div>
                  <p className="text-sm font-medium text-stone-200">{label}</p>
                  <p className="text-xs text-stone-500">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 text-center">
          <Link href="/dashboard" className="text-sm text-stone-500 hover:text-stone-400 transition-colors">
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
