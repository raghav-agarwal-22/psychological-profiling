'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

interface Team {
  id: string
  name: string
  slug: string
  memberCount: number
  role: string
  createdAt: string
}

export default function TeamsPage() {
  const router = useRouter()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }

    api
      .get<{ teams: Team[] }>('/api/teams/my', token)
      .then((data) => setTeams(data.teams))
      .catch((err) => setError(err.message ?? 'Failed to load teams'))
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-stone-100">Teams</h1>
          <p className="mt-1 text-sm text-stone-400">
            Collaborate and explore compatibility with your group.
          </p>
        </div>
        <Link
          href="/teams/new"
          className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
        >
          Create a team
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-400">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!error && teams.length === 0 && (
        <div className="flex flex-col items-center rounded-2xl border border-stone-800 bg-stone-900/40 px-8 py-16 text-center">
          <span className="mb-4 text-4xl text-stone-600">◎</span>
          <h2 className="mb-2 font-serif text-xl text-stone-200">No teams yet</h2>
          <p className="mb-6 max-w-sm text-sm text-stone-500">
            Create a team to share profiles and explore psychological compatibility with colleagues,
            friends, or your partner.
          </p>
          <Link
            href="/teams/new"
            className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
          >
            Create your team
          </Link>
        </div>
      )}

      {/* Team list */}
      {teams.length > 0 && (
        <div className="space-y-3">
          {teams.map((team) => (
            <Link
              key={team.id}
              href={`/teams/${team.id}`}
              className="group flex items-center justify-between rounded-2xl border border-stone-800 bg-stone-900/60 px-6 py-5 transition-colors hover:border-stone-700 hover:bg-stone-900"
            >
              <div>
                <p className="font-semibold text-stone-100 group-hover:text-amber-400 transition-colors">
                  {team.name}
                </p>
                <p className="mt-0.5 text-xs text-stone-500">
                  {team.memberCount} {team.memberCount === 1 ? 'member' : 'members'} &middot;{' '}
                  <span className="capitalize">{team.role}</span>
                </p>
              </div>
              <span className="text-stone-600 transition-colors group-hover:text-stone-400">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
