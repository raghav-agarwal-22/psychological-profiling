'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { posthog } from '@/lib/posthog'
import { DimensionsProgress, type DimensionProgressData } from '@/components/DimensionsProgress'

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
  MORAL_FOUNDATIONS: 'Discover how you prioritize the six moral foundations: Care, Fairness, Loyalty, Authority, Sanctity, and Liberty. Based on Jonathan Haidt\'s Moral Foundations Theory.',
}

const typeIcons: Record<string, string> = {
  BIG_FIVE: '◎',
  VALUES_INVENTORY: '◈',
  ATTACHMENT_STYLE: '◉',
  ENNEAGRAM: '◑',
  LIGHT_DARK_TRIAD: '◐',
  MORAL_FOUNDATIONS: '⬡',
}

const typeDuration: Record<string, string> = {
  BIG_FIVE: '10–15 min',
  VALUES_INVENTORY: '5–8 min',
  ATTACHMENT_STYLE: '3–5 min',
  ENNEAGRAM: '8–12 min',
  LIGHT_DARK_TRIAD: '3–5 min',
  MORAL_FOUNDATIONS: '6–9 min',
}

const ANON_ALLOWED = ['BIG_FIVE', 'JUNGIAN_ARCHETYPES']

export default function AssessmentPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState<string | null>(null)
  const [startError, setStartError] = useState<string | null>(null)
  const [isAnon, setIsAnon] = useState(false)
  const [dimensionProgress, setDimensionProgress] = useState<DimensionProgressData | null>(null)

  useEffect(() => {
    // Clean up expired anon tokens
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key?.startsWith('anonToken_')) {
        try {
          const parsed = JSON.parse(localStorage.getItem(key) ?? '') as { expiresAt: number }
          if (parsed.expiresAt <= Date.now()) localStorage.removeItem(key)
        } catch {
          localStorage.removeItem(key!)
        }
      }
    }
  }, [])

  useEffect(() => {
    const token = getToken()
    setIsAnon(!token)

    // Templates are public — no auth needed
    api
      .get<{ templates: Template[] }>('/api/templates')
      .then((d) => setTemplates(d.templates))
      .catch(() => {})
      .finally(() => setLoading(false))

    // Load dimension progress for authenticated users
    if (token) {
      api
        .get<{ profile: unknown; dimensionProgress: DimensionProgressData }>('/api/profiles', token)
        .then((d) => {
          if (d.dimensionProgress) setDimensionProgress(d.dimensionProgress)
        })
        .catch(() => {})
    }
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
      localStorage.setItem(`anonToken_${anonSessionId}`, JSON.stringify({ token: guestToken, expiresAt: Date.now() + 24 * 60 * 60 * 1000 }))
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
    posthog.capture('assessment_selected', {
      framework: template.type,
      isAnon,
    })
    if (isAnon) {
      startAnonymousAssessment(template)
    } else {
      startAuthenticatedAssessment(template)
    }
  }

  // Show all templates to all users; anon users see non-allowed ones as locked
  const visibleTemplates = templates

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Keep h1 visible during load for better LCP */}
        <div className="mb-10 text-center">
          <h1 className="font-serif text-4xl text-stone-100">Choose an assessment</h1>
          <p className="mt-3 text-stone-400">
            Each assessment takes 5–10 minutes and reveals a different facet of your inner life.
          </p>
        </div>
        {/* Skeleton cards — explicit height prevents CLS when real cards load */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl border border-stone-800 bg-stone-900/50" />
          ))}
        </div>
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

      {/* Continue Your Portrait — shown for returning authenticated users */}
      {!isAnon && dimensionProgress && dimensionProgress.count > 0 && dimensionProgress.count < dimensionProgress.total && (() => {
        const NEXT_DIMENSION_META: Record<string, { title: string; subtitle: string; cta: string; templateType: string }> = {
          JUNGIAN_ARCHETYPES: {
            title: 'Jungian Archetypes',
            subtitle: 'Add your archetypal identity layer to see how your personality connects to deeper mythic patterns.',
            cta: 'Add Identity & Myth',
            templateType: 'JUNGIAN_ARCHETYPES',
          },
          ATTACHMENT_STYLE: {
            title: 'Attachment Style',
            subtitle: 'See how your personality shapes your closest connections — and what patterns emerge under stress.',
            cta: 'Add Relationship Blueprint',
            templateType: 'ATTACHMENT_STYLE',
          },
          ENNEAGRAM: {
            title: 'Enneagram',
            subtitle: 'Reveal the fear and desire engine beneath your personality — the motivation behind everything you do.',
            cta: 'Add Core Motivation',
            templateType: 'ENNEAGRAM',
          },
          VALUES_INVENTORY: {
            title: 'Values Inventory',
            subtitle: 'Complete your portrait with a values deep-dive — the non-negotiables that define your purpose.',
            cta: 'Add Purpose & Ethics',
            templateType: 'VALUES_INVENTORY',
          },
        }
        const nextMeta = dimensionProgress.nextRecommended ? NEXT_DIMENSION_META[dimensionProgress.nextRecommended] : null
        return (
          <div className="mb-8 rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-base font-semibold text-stone-200">Continue Your Portrait</h2>
                <p className="text-sm text-stone-400 mt-0.5">
                  You&apos;ve unlocked{' '}
                  <span className="text-indigo-400 font-medium">{dimensionProgress.count} of {dimensionProgress.total} dimensions</span>.
                </p>
              </div>
              <Link
                href="/profile/latest"
                className="shrink-0 text-xs text-stone-500 hover:text-stone-300 transition-colors"
              >
                View portrait →
              </Link>
            </div>

            <DimensionsProgress progress={dimensionProgress} compact className="mb-4" />

            {nextMeta && (() => {
              const nextTemplate = templates.find((t) => t.type === nextMeta.templateType)
              return nextTemplate ? (
                <div className="rounded-lg border border-indigo-500/10 bg-stone-900/40 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-stone-200">Next recommended: {nextMeta.title}</p>
                      <p className="text-xs text-stone-400 mt-1 leading-relaxed">{nextMeta.subtitle}</p>
                    </div>
                    <button
                      onClick={() => handleBegin(nextTemplate)}
                      disabled={starting === nextTemplate.id}
                      className="shrink-0 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
                    >
                      {starting === nextTemplate.id ? 'Starting…' : nextMeta.cta}
                    </button>
                  </div>
                </div>
              ) : null
            })()}
          </div>
        )
      })()}

      {startError && (
        <p className="mb-4 rounded-xl border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">{startError}</p>
      )}

      <div className="space-y-4">
        {visibleTemplates.map((template) => {
          const isLocked = isAnon && !ANON_ALLOWED.includes(template.type)
          return (
            <div
              key={template.id}
              className={`rounded-2xl border p-6 transition-colors ${
                isLocked
                  ? 'border-stone-800/50 bg-stone-900/20 opacity-75'
                  : 'border-stone-800 bg-stone-900/50 hover:border-stone-700'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-1 gap-4">
                  <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${isLocked ? 'bg-stone-800/50 text-stone-600' : 'bg-stone-800 text-stone-300'}`}>
                    {isLocked ? '🔒' : (typeIcons[template.type] ?? '◯')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h2 className={`font-serif text-xl ${isLocked ? 'text-stone-500' : 'text-stone-100'}`}>{template.title}</h2>
                      {typeDuration[template.type] && (
                        <span className="rounded-full border border-stone-700 px-2 py-0.5 text-[10px] text-stone-500">
                          {typeDuration[template.type]}
                        </span>
                      )}
                      {isAnon && !isLocked && (
                        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400">
                          Free
                        </span>
                      )}
                    </div>
                    <p className={`mt-2 text-sm leading-relaxed ${isLocked ? 'text-stone-600' : 'text-stone-400'}`}>
                      {template.description ?? typeDescriptions[template.type] ?? ''}
                    </p>
                  </div>
                </div>
                {isLocked ? (
                  <a
                    href="/auth/login"
                    className="shrink-0 rounded-xl border border-stone-700 px-5 py-2.5 text-sm font-semibold text-stone-400 transition-colors hover:border-stone-600 hover:text-stone-200"
                  >
                    Sign in to unlock
                  </a>
                ) : (
                  <button
                    onClick={() => handleBegin(template)}
                    disabled={starting === template.id}
                    className="shrink-0 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400 disabled:opacity-50"
                  >
                    {starting === template.id ? 'Starting…' : 'Begin'}
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {visibleTemplates.length === 0 && (
          <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-8 text-center text-stone-400">
            No assessments available yet.
          </div>
        )}

        {isAnon && (
          <div className="mt-8 rounded-2xl border border-stone-800/60 bg-stone-900/30 p-5 text-center">
            <p className="text-sm text-stone-500">
              Create a free account to unlock all 6 frameworks and save your results permanently.
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
