'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { posthog } from '@/lib/posthog'

interface AdaptiveQuestion {
  id: string
  text: string
  dimension: string
  type: 'open_ended' | 'likert'
  reverse_scored: boolean
}

interface GenerateResponse {
  sessionId: string
  assessmentId: string
  templateId: string
  questions: AdaptiveQuestion[]
  title: string
  description: string
  sourceFramework: string
}

interface EligibilityResponse {
  eligible: boolean
  reason?: string
  sourceProfileId?: string
  frameworkType?: string
  profileSummary?: string
  profileId?: string
}

const LIKERT_LABELS = [
  { value: 1, label: 'Strongly\nDisagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly\nAgree' },
]

const FRAMEWORK_LABELS: Record<string, string> = {
  BIG_FIVE: 'Big Five',
  VALUES_INVENTORY: 'Values Inventory',
  ATTACHMENT_STYLE: 'Attachment Style',
  LIGHT_DARK_TRIAD: 'Light / Dark Triad',
  ENNEAGRAM: 'Enneagram',
  JUNGIAN_ARCHETYPES: 'Jungian Archetypes',
}

function AdaptiveFlow() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sourceProfileId = searchParams.get('profileId')

  type Phase = 'checking' | 'intro' | 'generating' | 'questions' | 'submitting' | 'done' | 'error'
  const [phase, setPhase] = useState<Phase>('checking')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [eligibility, setEligibility] = useState<EligibilityResponse | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [assessmentId, setAssessmentId] = useState<string | null>(null)
  const [questions, setQuestions] = useState<AdaptiveQuestion[]>([])
  const [title, setTitle] = useState<string>('Adaptive Deep-Dive')
  const [sourceFramework, setSourceFramework] = useState<string>('')

  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, number | string>>({})
  const [textInput, setTextInput] = useState('')

  // Check eligibility on load
  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }

    api
      .get<EligibilityResponse>('/api/adaptive/eligibility', token)
      .then((data) => {
        setEligibility(data)
        if (!data.eligible) {
          if (data.profileId) {
            // Already have an adaptive profile
            router.push(`/profile/${data.profileId}`)
          } else {
            setPhase('error')
            setErrorMsg(data.reason ?? 'Not eligible for adaptive assessment')
          }
          return
        }
        setPhase('intro')
        setSourceFramework(data.frameworkType ?? '')
      })
      .catch((err) => {
        setPhase('error')
        setErrorMsg(err instanceof Error ? err.message : 'Failed to check eligibility')
      })
  }, [router])

  const handleGenerate = useCallback(async () => {
    const token = getToken()
    if (!token || !eligibility?.sourceProfileId) return

    const profileId = sourceProfileId ?? eligibility.sourceProfileId
    setPhase('generating')

    try {
      const data = await api.post<GenerateResponse>(
        '/api/adaptive/generate',
        { sourceProfileId: profileId },
        token,
      )
      setSessionId(data.sessionId)
      setAssessmentId(data.assessmentId)
      setQuestions(data.questions)
      setTitle(data.title)
      setSourceFramework(data.sourceFramework)
      setCurrentIndex(0)
      setResponses({})
      setPhase('questions')

      posthog.capture('adaptive_assessment_started', { framework: data.sourceFramework })
    } catch (err) {
      setPhase('error')
      setErrorMsg(err instanceof Error ? err.message : 'Failed to generate questions')
    }
  }, [eligibility, sourceProfileId])

  const currentQuestion = questions[currentIndex]
  const isLikert = currentQuestion?.type === 'likert'
  const currentAnswer = currentQuestion ? responses[currentQuestion.id] : undefined
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0

  const handleLikertAnswer = (value: number) => {
    if (!currentQuestion) return
    setResponses((prev) => ({ ...prev, [currentQuestion.id]: value }))
  }

  const handleNext = useCallback(async () => {
    if (!currentQuestion) return

    // Commit text input for open-ended questions
    if (!isLikert) {
      if (!textInput.trim()) return
      setResponses((prev) => ({ ...prev, [currentQuestion.id]: textInput.trim() }))
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
      setTextInput('')
      return
    }

    // Last question — submit
    const token = getToken()
    if (!token || !sessionId || !assessmentId) return

    const finalResponses = isLikert
      ? responses
      : { ...responses, [currentQuestion.id]: textInput.trim() }

    setPhase('submitting')
    try {
      const { profile } = await api.post<{ profile: { id: string } }>(
        '/api/adaptive/complete',
        { sessionId, assessmentId, responses: finalResponses },
        token,
      )
      posthog.capture('adaptive_assessment_completed', { framework: sourceFramework })
      router.push(`/profile/${profile.id}`)
    } catch (err) {
      setPhase('error')
      setErrorMsg(err instanceof Error ? err.message : 'Failed to submit assessment')
    }
  }, [currentQuestion, isLikert, textInput, currentIndex, questions.length, sessionId, assessmentId, responses, sourceFramework, router])

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1)
      // Restore text for previous open-ended
      const prevQ = questions[currentIndex - 1]
      if (prevQ?.type === 'open_ended') {
        setTextInput(String(responses[prevQ.id] ?? ''))
      } else {
        setTextInput('')
      }
    }
  }

  // Phases
  if (phase === 'checking') {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" />
        <p className="text-stone-500">Checking eligibility...</p>
      </div>
    )
  }

  if (phase === 'error') {
    const isNoAssessment = errorMsg?.toLowerCase().includes('complete a base') || errorMsg?.toLowerCase().includes('assessment first')
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="mb-2 text-stone-300">{errorMsg ?? 'Something went wrong'}</p>
        {isNoAssessment ? (
          <Link href="/assessment" className="mt-4 inline-block text-amber-400 hover:text-amber-300">
            Take a base assessment first →
          </Link>
        ) : (
          <Link href="/dashboard" className="mt-4 inline-block text-amber-400 hover:text-amber-300">
            ← Back to dashboard
          </Link>
        )}
      </div>
    )
  }

  if (phase === 'intro') {
    const frameworkLabel = FRAMEWORK_LABELS[sourceFramework] ?? sourceFramework.replace(/_/g, ' ')
    return (
      <div className="mx-auto max-w-xl px-6 py-20">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20">
            <span className="text-3xl">◈</span>
          </div>
          <h1 className="font-serif text-4xl text-stone-100">Adaptive Deep-Dive</h1>
          <p className="mt-3 leading-relaxed text-stone-400">
            Personalized follow-up questions crafted by AI specifically for your{' '}
            <span className="text-stone-200">{frameworkLabel}</span> profile.
          </p>
        </div>

        {eligibility?.profileSummary && (
          <div className="mt-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-5">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-stone-500">
              Based on your profile
            </p>
            <p className="text-sm leading-relaxed text-stone-400">
              {eligibility.profileSummary}
              {eligibility.profileSummary.length >= 200 ? '…' : ''}
            </p>
          </div>
        )}

        <div className="mt-8 space-y-3">
          <div className="flex items-start gap-3 rounded-xl border border-stone-800 bg-stone-900/50 px-5 py-4">
            <span className="mt-0.5 text-amber-500">◎</span>
            <div>
              <p className="text-sm font-medium text-stone-200">Personalized to you</p>
              <p className="text-sm text-stone-500">
                Claude analyzes your {frameworkLabel} scores and crafts 10 questions targeting your unique patterns.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-stone-800 bg-stone-900/50 px-5 py-4">
            <span className="mt-0.5 text-amber-500">⏱</span>
            <div>
              <p className="text-sm font-medium text-stone-200">Takes about 8–12 minutes</p>
              <p className="text-sm text-stone-500">
                Mix of 1–5 rating scales and two open reflection prompts.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-stone-800 bg-stone-900/50 px-5 py-4">
            <span className="mt-0.5 text-amber-500">✦</span>
            <div>
              <p className="text-sm font-medium text-stone-200">Deep narrative synthesis</p>
              <p className="text-sm text-stone-500">
                Receive key psychological patterns, growth edges, and an integration theme unique to your responses.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={handleGenerate}
            className="rounded-xl bg-amber-500 px-10 py-3.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
          >
            Generate my personalized questions
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'generating') {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500/30 border-t-amber-500" />
        </div>
        <h2 className="font-serif text-2xl text-stone-200">Claude is reading your profile...</h2>
        <p className="mt-3 text-sm text-stone-500">
          Generating 10 personalized questions based on your unique patterns. This takes about 15 seconds.
        </p>
      </div>
    )
  }

  if (phase === 'submitting') {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500/30 border-t-amber-500" />
        </div>
        <h2 className="font-serif text-2xl text-stone-200">Generating your deep-dive profile...</h2>
        <p className="mt-3 text-sm text-stone-500">
          Claude is synthesizing your responses into a narrative. This takes about 20 seconds.
        </p>
      </div>
    )
  }

  // Questions phase
  if (!currentQuestion) return null

  const canProceed = isLikert ? currentAnswer !== undefined : textInput.trim().length > 0

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-stone-500">{title}</span>
          <span className="text-xs text-stone-500">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-stone-800">
          <div
            className="h-full rounded-full bg-amber-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-stone-800 px-3 py-1">
          <span className="text-xs text-stone-400">
            {currentQuestion.dimension.replace(/_/g, ' ')}
          </span>
          {currentQuestion.type === 'open_ended' && (
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
              reflection
            </span>
          )}
        </div>
        <h2 className="font-serif text-2xl leading-relaxed text-stone-100">
          {currentQuestion.text}
        </h2>
      </div>

      {/* Answer */}
      {isLikert ? (
        <div className="grid grid-cols-5 gap-2">
          {LIKERT_LABELS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleLikertAnswer(value)}
              className={`flex flex-col items-center gap-2 rounded-xl border py-4 transition-all ${
                currentAnswer === value
                  ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/30'
                  : 'border-stone-800 bg-stone-900/50 hover:border-stone-700 hover:bg-stone-900'
              }`}
            >
              <span
                className={`text-lg font-bold tabular-nums ${
                  currentAnswer === value ? 'text-amber-400' : 'text-stone-400'
                }`}
              >
                {value}
              </span>
              <span
                className={`text-center text-[10px] leading-tight whitespace-pre-line ${
                  currentAnswer === value ? 'text-stone-300' : 'text-stone-600'
                }`}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Write your reflection here..."
            rows={5}
            className="w-full resize-none rounded-xl border border-stone-700 bg-stone-900/50 px-4 py-3 text-sm text-stone-200 placeholder-stone-600 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
          />
          <p className="mt-2 text-right text-xs text-stone-600">{textInput.length} chars</p>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="rounded-xl border border-stone-700 px-5 py-2.5 text-sm text-stone-400 transition-colors hover:border-stone-600 hover:text-stone-200 disabled:opacity-30"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="rounded-xl bg-amber-500 px-7 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400 disabled:opacity-40"
        >
          {currentIndex === questions.length - 1 ? 'Complete deep-dive' : 'Next'}
        </button>
      </div>
    </div>
  )
}

export default function AdaptivePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" />
        </div>
      }
    >
      <AdaptiveFlow />
    </Suspense>
  )
}
