'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'

interface Template {
  id: string
  type: string
  title: string
  description: string | null
  version: string
}

const typeDescriptions: Record<string, string> = {
  BIG_FIVE: 'Explore the five fundamental dimensions of your personality: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism.',
  VALUES_INVENTORY: 'Discover what truly motivates you across 9 universal value dimensions — from Self-Direction and Universalism to Security and Hedonism — based on Schwartz\'s foundational values research.',
  ATTACHMENT_STYLE: 'Understand your relational blueprint — how you connect, trust, and seek closeness in relationships. Based on Bowlby and Ainsworth\'s attachment theory.',
  ENNEAGRAM: 'Discover your core Enneagram type and wing — the motivational system that drives your fears, desires, and patterns of growth. Based on the nine-type personality model.',
  LIGHT_DARK_TRIAD: 'Explore where you fall on the light-dark personality spectrum. Measures three prosocial virtues (Kantianism, Humanism, Faith in Humanity) alongside three antagonistic tendencies (Narcissism, Machiavellianism, Psychopathy). Based on Kaufman et al.',
}

const typeIcons: Record<string, string> = {
  BIG_FIVE: '◎',
  VALUES_INVENTORY: '◈',
  ATTACHMENT_STYLE: '◉',
  ENNEAGRAM: '◑',
  LIGHT_DARK_TRIAD: '◐',
}

const typeDuration: Record<string, string> = {
  BIG_FIVE: '10–15 min',
  VALUES_INVENTORY: '5–8 min',
  ATTACHMENT_STYLE: '3–5 min',
  ENNEAGRAM: '8–12 min',
  LIGHT_DARK_TRIAD: '3–5 min',
}

const ANON_ALLOWED = ['BIG_FIVE', 'JUNGIAN_ARCHETYPES']

export default function AssessmentPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState<string | null>(null)
  const [startError, setStartError] = useState<string | null>(null)
  const [isAnon, setIsAnon] = useState(false)

  useEffect(() => {
    const token = getToken()
    setIsAnon(!token)

    // Templates are public — no auth needed
    api
      .get<{ templates: Template[] }>('/api/templates')
      .then((d) => setTemplates(d.templates))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function startAnonymousAssessment(template: Template) {
    setStarting(template.id)
    setStartError(null)
    try {
      const ref = typeof window !== 'undefined' ? (document.cookie.match(/innermind_ref=([^;]+)/)?.[1] ?? undefined) : undefined
      const { anonSessionId, guestToken } = await api.post<{ anonSessionId: string; guestToken: string }>(
        '/api/anon/sessions',
        { templateId: template.id, referralCode: ref },
      )
      sessionStorage.setItem(`anonToken_${anonSessionId}`, guestToken)
      router.push(`/assessment/anon/${anonSessionId}?templateId=${template.id}`)
    } catch (err) {
      setStartError(err instanceof Error ? err.message : 'Failed to start assessment. Please try again.')
      setStarting(null)
    }
  }

  async function startAuthenticatedAssessment(template: Template) {
    const token = getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }

    setStarting(template.id)
    try {
      const { session } = await api.post<{ session: { id: string } }>(
        '/api/sessions',
        { title: template.title },
        token,
      )

      await api.post(
        '/api/assessments',
        { sessionId: session.id, type: template.type, title: template.title },
        token,
      )

      router.push(`/assessment/${session.id}?templateId=${template.id}`)
    } catch {
      setStarting(null)
    }
  }

  function handleBegin(template: Template) {
    if (isAnon) {
      startAnonymousAssessment(template)
    } else {
      startAuthenticatedAssessment(template)
    }
  }

  const visibleTemplates = isAnon
    ? templates.filter((t) => ANON_ALLOWED.includes(t.type))
    : templates

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl text-stone-100">Choose an assessment</h1>
        <p className="mt-3 text-stone-400">
          {isAnon
            ? 'Start free — no account needed. Your profile is revealed after you finish.'
            : 'Each assessment takes 5–10 minutes and reveals a different facet of your inner life.'}
        </p>
        {isAnon && (
          <p className="mt-2 text-sm text-stone-600">
            Want access to all 6 frameworks?{' '}
            <a href="/auth/login" className="text-amber-500 hover:text-amber-400 underline-offset-2 underline">
              Sign in
            </a>
          </p>
        )}
      </div>

      {startError && (
        <p className="mb-4 rounded-xl border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">{startError}</p>
      )}

      <div className="space-y-4">
        {visibleTemplates.map((template) => (
          <div
            key={template.id}
            className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 transition-colors hover:border-stone-700"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-1 gap-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-800 text-lg text-stone-300">
                  {typeIcons[template.type] ?? '◯'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="font-serif text-xl text-stone-100">{template.title}</h2>
                    {typeDuration[template.type] && (
                      <span className="rounded-full border border-stone-700 px-2 py-0.5 text-[10px] text-stone-500">
                        {typeDuration[template.type]}
                      </span>
                    )}
                    {isAnon && (
                      <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400">
                        Free
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-stone-400 leading-relaxed">
                    {template.description ?? typeDescriptions[template.type] ?? ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleBegin(template)}
                disabled={starting === template.id}
                className="shrink-0 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400 disabled:opacity-50"
              >
                {starting === template.id ? 'Starting…' : 'Begin'}
              </button>
            </div>
          </div>
        ))}

        {visibleTemplates.length === 0 && (
          <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-8 text-center text-stone-400">
            No assessments available yet.
          </div>
        )}

        {isAnon && (
          <div className="mt-8 rounded-2xl border border-stone-800/60 bg-stone-900/30 p-5 text-center">
            <p className="text-sm text-stone-500">
              All 5 frameworks (Values, Attachment, Enneagram, Light/Dark Triad) require a free account.
            </p>
            <a
              href="/auth/login"
              className="mt-3 inline-flex items-center gap-1 text-sm text-amber-500 hover:text-amber-400"
            >
              Create your free account →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
