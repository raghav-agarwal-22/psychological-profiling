'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

export default function NewTeamPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const token = getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }

    const trimmed = name.trim()
    if (!trimmed) {
      setError('Please enter a team name.')
      return
    }

    setLoading(true)
    try {
      const data = await api.post<{ team: { id: string } }>('/api/teams', { name: trimmed }, token)
      router.push(`/teams/${data.team.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create team')
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      {/* Back link */}
      <Link
        href="/teams"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-300"
      >
        ← Back to teams
      </Link>

      <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-8">
        {/* Icon */}
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10">
          <span className="text-xl text-amber-400">◎</span>
        </div>

        <h1 className="mb-1 font-serif text-2xl text-stone-100">Create a team</h1>
        <p className="mb-8 text-sm text-stone-500">
          Bring your group together to explore shared psychological patterns and compatibility.
        </p>

        {error && (
          <div className="mb-6 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="team-name" className="mb-1.5 block text-sm font-medium text-stone-300">
              Team name
            </label>
            <input
              id="team-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Design Team, Book Club, Our Relationship…"
              maxLength={80}
              required
              className="w-full rounded-xl border border-stone-700 bg-stone-800 px-4 py-3 text-sm text-stone-100 placeholder-stone-600 outline-none transition-colors focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating…' : 'Create team →'}
          </button>
        </form>
      </div>
    </div>
  )
}
