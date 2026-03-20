'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { api, ApiError } from '@/lib/api'
import { getToken } from '@/lib/auth'

// ─── Types ────────────────────────────────────────────────────────────────────

interface PublicProfile {
  id: string
  summary: string
  dimensions: Record<string, { normalized: number }>
  archetypes: string[]
  shareToken: string | null
  generatedAt: string
}

interface TeamMember {
  id: string
  userId: string
  role: string
  joinedAt: string
  user: {
    id: string
    name: string | null
    email: string
    avatarUrl: string | null
  }
  publicProfile: PublicProfile | null
}

interface Team {
  id: string
  name: string
  slug: string
  ownerId: string
  subscriptionStatus: string
  createdAt: string
  members: TeamMember[]
}

interface CompatibilityEntry {
  score: number
  dimensions: Record<string, { scoreA: number; scoreB: number; overlap: number }>
}

interface CompatibilityData {
  members: { userId: string; name: string; profileId: string }[]
  matrix: Record<string, CompatibilityEntry>
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Avatar({ name, avatarUrl }: { name: string | null; avatarUrl: string | null }) {
  const initials = (name ?? '?')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

  if (avatarUrl) {
    return <img src={avatarUrl} alt={name ?? ''} className="h-9 w-9 rounded-full object-cover" />
  }

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-700 text-xs font-semibold text-stone-300">
      {initials}
    </div>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const colour =
    score >= 80
      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
      : score >= 60
        ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
        : 'border-stone-700 bg-stone-800 text-stone-400'

  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colour}`}>
      {score}%
    </span>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function TeamDetailPage() {
  const params = useParams<{ teamId: string }>()
  const teamId = params.teamId
  const router = useRouter()

  const [team, setTeam] = useState<Team | null>(null)
  const [compatibility, setCompatibility] = useState<CompatibilityData | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Invite modal state
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteResult, setInviteResult] = useState<{ message: string; inviteLink?: string } | null>(null)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [showInviteModal, setShowInviteModal] = useState(false)

  // Leave team state
  const [leaveLoading, setLeaveLoading] = useState(false)

  const fetchData = useCallback(async () => {
    const token = getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }

    try {
      // Decode user from token (JWT payload is base64 encoded)
      const payloadB64 = token.split('.')[1]
      if (payloadB64) {
        try {
          const payload = JSON.parse(atob(payloadB64)) as { userId: string }
          setCurrentUserId(payload.userId)
        } catch {
          // ignore decode errors
        }
      }

      const [teamData, compatData] = await Promise.allSettled([
        api.get<{ team: Team }>(`/api/teams/${teamId}`, token),
        api.get<CompatibilityData>(`/api/teams/${teamId}/compatibility`, token),
      ])

      if (teamData.status === 'fulfilled') {
        setTeam(teamData.value.team)
      } else {
        throw teamData.reason
      }

      if (compatData.status === 'fulfilled') {
        setCompatibility(compatData.value)
      }
      // Compatibility failing (no public profiles) is non-fatal
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setError('You do not have access to this team.')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load team')
      }
    } finally {
      setLoading(false)
    }
  }, [teamId, router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviteError(null)
    setInviteResult(null)
    const token = getToken()
    if (!token) return

    setInviteLoading(true)
    try {
      const result = await api.post<{ message: string; inviteLink?: string }>(
        `/api/teams/${teamId}/invite`,
        { email: inviteEmail },
        token,
      )
      setInviteResult(result)
      setInviteEmail('')
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : 'Failed to send invite')
    } finally {
      setInviteLoading(false)
    }
  }

  async function handleLeave() {
    if (!confirm('Are you sure you want to leave this team?')) return
    const token = getToken()
    if (!token) return

    setLeaveLoading(true)
    try {
      await api.del(`/api/teams/${teamId}/leave`, token)
      router.push('/teams')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to leave team')
      setLeaveLoading(false)
    }
  }

  // ── Render states ──────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" />
      </div>
    )
  }

  if (error || !team) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link
          href="/teams"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-300"
        >
          ← Back to teams
        </Link>
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-400">
          {error ?? 'Team not found.'}
        </div>
      </div>
    )
  }

  const isOwner = team.ownerId === currentUserId

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Back + actions */}
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/teams"
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-300"
        >
          ← Back to teams
        </Link>
        <div className="flex items-center gap-2">
          {(isOwner || team.members.find((m) => m.userId === currentUserId)?.role === 'admin') && (
            <button
              onClick={() => {
                setShowInviteModal(true)
                setInviteResult(null)
                setInviteError(null)
              }}
              className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition-colors hover:border-stone-600 hover:text-stone-100"
            >
              Invite member
            </button>
          )}
          {!isOwner && (
            <button
              onClick={handleLeave}
              disabled={leaveLoading}
              className="rounded-xl border border-rose-500/20 px-4 py-2 text-sm font-semibold text-rose-400 transition-colors hover:border-rose-500/40 hover:bg-rose-500/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {leaveLoading ? 'Leaving…' : 'Leave team'}
            </button>
          )}
        </div>
      </div>

      {/* Team header */}
      <div className="mb-10">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10">
          <span className="text-2xl text-amber-400">◎</span>
        </div>
        <h1 className="font-serif text-3xl text-stone-100">{team.name}</h1>
        <p className="mt-1 text-sm text-stone-500">
          {team.members.length} {team.members.length === 1 ? 'member' : 'members'}
        </p>
      </div>

      {/* Members section */}
      <section className="mb-10">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-stone-500">
          Members
        </h2>
        <div className="space-y-3">
          {team.members.map((member) => {
            const displayName = member.user.name ?? member.user.email
            const joinedDate = new Date(member.joinedAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
            return (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-2xl border border-stone-800 bg-stone-900/60 px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={member.user.name} avatarUrl={member.user.avatarUrl} />
                  <div>
                    <p className="text-sm font-semibold text-stone-100">{displayName}</p>
                    <p className="text-xs text-stone-500">
                      Joined {joinedDate}
                      {member.role !== 'member' && (
                        <span className="ml-1.5 rounded-full bg-stone-800 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-stone-400">
                          {member.role}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                {member.publicProfile ? (
                  <span className="text-xs text-emerald-500">Profile shared</span>
                ) : (
                  <span className="text-xs text-stone-600">No public profile</span>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Compatibility map */}
      <section>
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-widest text-stone-500">
          Compatibility map
        </h2>
        <p className="mb-5 text-xs text-stone-600">
          Based on public profiles. Members must share their profile to appear here.
        </p>

        {compatibility && compatibility.members.length >= 2 ? (
          <div className="space-y-3">
            {compatibility.members.map((memberA, i) =>
              compatibility.members.slice(i + 1).map((memberB) => {
                const key = `${memberA.userId}:${memberB.userId}`
                const entry = compatibility.matrix[key]
                if (!entry) return null
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-2xl border border-stone-800 bg-stone-900/60 px-5 py-4"
                  >
                    <div className="flex items-center gap-2 text-sm text-stone-300">
                      <span className="font-semibold">{memberA.name}</span>
                      <span className="text-stone-600">×</span>
                      <span className="font-semibold">{memberB.name}</span>
                    </div>
                    <ScoreBadge score={entry.score} />
                  </div>
                )
              }),
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-stone-800 bg-stone-900/40 px-6 py-10 text-center">
            <p className="text-sm text-stone-500">
              At least two members need to have a public profile for compatibility scores to appear.
            </p>
            <Link
              href="/profile"
              className="mt-4 inline-block text-sm font-semibold text-amber-400 hover:text-amber-300"
            >
              Share your profile →
            </Link>
          </div>
        )}
      </section>

      {/* Invite modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-stone-800 bg-stone-900 p-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-serif text-xl text-stone-100">Invite a member</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-stone-500 transition-colors hover:text-stone-300"
              >
                ✕
              </button>
            </div>

            {inviteResult ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-400">
                  {inviteResult.message}
                </div>
                {inviteResult.inviteLink && (
                  <div>
                    <p className="mb-1.5 text-xs text-stone-500">Invite link (copy and share):</p>
                    <code className="block break-all rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-xs text-amber-300">
                      {inviteResult.inviteLink}
                    </code>
                  </div>
                )}
                <button
                  onClick={() => {
                    setInviteResult(null)
                    setInviteEmail('')
                  }}
                  className="text-sm text-stone-400 underline hover:text-stone-200"
                >
                  Invite another
                </button>
              </div>
            ) : (
              <form onSubmit={handleInvite} className="space-y-5">
                {inviteError && (
                  <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-400">
                    {inviteError}
                  </div>
                )}
                <div>
                  <label
                    htmlFor="invite-email"
                    className="mb-1.5 block text-sm font-medium text-stone-300"
                  >
                    Email address
                  </label>
                  <input
                    id="invite-email"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    required
                    className="w-full rounded-xl border border-stone-700 bg-stone-800 px-4 py-3 text-sm text-stone-100 placeholder-stone-600 outline-none transition-colors focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 rounded-xl border border-stone-700 py-2.5 text-sm text-stone-400 transition-colors hover:border-stone-600 hover:text-stone-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviteLoading || !inviteEmail.trim()}
                    className="flex-1 rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {inviteLoading ? 'Sending…' : 'Send invite'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
