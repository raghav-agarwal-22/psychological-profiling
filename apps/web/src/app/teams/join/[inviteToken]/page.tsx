'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { api, ApiError } from '@/lib/api'
import { getToken } from '@/lib/auth'

interface Team {
  id: string
  name: string
}

export default function JoinTeamPage() {
  const params = useParams<{ inviteToken: string }>()
  const inviteToken = params.inviteToken
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [team, setTeam] = useState<Team | null>(null)
  const [joined, setJoined] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push(`/auth/login?redirect=/teams/join/${inviteToken}`)
      return
    }

    api
      .post<{ message: string; team: Team }>(`/api/teams/join/${inviteToken}`, {}, token)
      .then((data) => {
        setTeam(data.team)
        setJoined(true)
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 200) {
          // Already a member — this shouldn't happen but guard anyway
          setJoined(true)
        } else {
          setError(err instanceof Error ? err.message : 'Failed to join team')
        }
      })
      .finally(() => setLoading(false))
  }, [inviteToken, router])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" />
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
      {joined && team ? (
        <>
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
            <span className="text-2xl text-emerald-400">✓</span>
          </div>
          <h1 className="mb-2 font-serif text-2xl text-stone-100">You've joined {team.name}</h1>
          <p className="mb-8 text-sm text-stone-400">
            Welcome to the team. You can now explore shared profiles and compatibility.
          </p>
          <Link
            href={`/teams/${team.id}`}
            className="rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
          >
            Go to team →
          </Link>
        </>
      ) : (
        <>
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10">
            <span className="text-2xl text-rose-400">✕</span>
          </div>
          <h1 className="mb-2 font-serif text-2xl text-stone-100">Unable to join team</h1>
          <p className="mb-8 text-sm text-rose-400">{error}</p>
          <Link
            href="/teams"
            className="text-sm font-semibold text-amber-400 hover:text-amber-300"
          >
            Back to teams →
          </Link>
        </>
      )}
    </div>
  )
}
