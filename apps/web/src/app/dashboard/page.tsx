'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

interface Session {
  id: string
  title: string | null
  status: string
  startedAt: string
  completedAt: string | null
  createdAt: string
  _count: { assessments: number }
}

interface Profile {
  id: string
  summary: string
  dimensions: Record<string, { normalized: number }>
  archetypes: string[]
  strengths: string[]
  generatedAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }

    Promise.all([
      api.get<{ sessions: Session[] }>('/api/sessions', token),
      api.get<{ profile: Profile }>('/api/profiles', token).catch(() => ({ profile: null })),
    ])
      .then(([sessionsData, profileData]) => {
        setSessions(sessionsData.sessions)
        setProfile(profileData.profile)
      })
      .catch(() => {
        router.push('/auth/login')
      })
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="font-serif text-3xl text-stone-100">Your journey</h1>
        <Link
          href="/assessment"
          className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
        >
          New assessment
        </Link>
      </div>

      {profile && (
        <div className="mb-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-2xl">◎</span>
            <h2 className="font-serif text-xl text-stone-100">Current profile</h2>
          </div>
          <p className="mb-4 text-stone-400 leading-relaxed">{profile.summary}</p>
          {profile.archetypes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.archetypes.map((a) => (
                <span
                  key={a}
                  className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-300"
                >
                  {a}
                </span>
              ))}
            </div>
          )}
          <Link
            href={`/profile/latest`}
            className="mt-4 inline-block text-sm text-amber-400 hover:text-amber-300"
          >
            View full profile →
          </Link>
        </div>
      )}

      <div>
        <h2 className="mb-4 font-serif text-xl text-stone-200">Past sessions</h2>
        {sessions.length === 0 ? (
          <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-8 text-center text-stone-400">
            No sessions yet.{' '}
            <Link href="/assessment" className="text-amber-400 hover:text-amber-300">
              Start your first assessment.
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-xl border border-stone-800 bg-stone-900/50 px-5 py-4"
              >
                <div>
                  <p className="text-stone-200">{session.title ?? 'Assessment session'}</p>
                  <p className="text-xs text-stone-500">
                    {new Date(session.createdAt).toLocaleDateString()} ·{' '}
                    {session._count.assessments} assessment
                    {session._count.assessments !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      session.status === 'COMPLETED'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {session.status === 'COMPLETED' ? 'Complete' : 'In progress'}
                  </span>
                  {session.status === 'COMPLETED' && (
                    <Link
                      href={`/profile/${session.id}`}
                      className="text-xs text-stone-400 hover:text-stone-200"
                    >
                      View results →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
