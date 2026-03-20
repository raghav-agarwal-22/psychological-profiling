'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { Suspense } from 'react'
import { posthog } from '@/lib/posthog'
import { trackAssessmentComplete } from '@/lib/ads'

const ARCHETYPE_PHRASES = [
  'The Architect',
  'The Explorer',
  'The Sage',
  'The Visionary',
  'The Nurturer',
  'The Strategist',
  'The Empath',
  'The Pioneer',
]

const MILESTONE_MESSAGES: Record<number, string> = {
  25: 'Your personality dimensions are starting to take shape…',
  50: 'Halfway there — your archetype is forming',
  75: 'Almost there — one last push to see yourself clearly',
}

interface Question {
  id: string
  text: string
  dimension: string
  reverse_scored: boolean
}

interface Assessment {
  id: string
}

interface TemplateInfo {
  title: string
  description: string | null
  type: string
}

const LIKERT_LABELS = [
  { value: 1, label: 'Strongly\nDisagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly\nAgree' },
]

const TYPE_DURATION: Record<string, string> = {
  BIG_FIVE: '10–15 minutes',
  VALUES_INVENTORY: '5–8 minutes',
}

const TYPE_OUTCOME: Record<string, string> = {
  BIG_FIVE: 'Your personality archetype, dimension scores across the Big Five, personal strengths, and growth areas.',
  VALUES_INVENTORY: 'Your ranked value profile, core values, and the value tensions that shape your decisions.',
}

const TYPE_ICONS: Record<string, string> = {
  BIG_FIVE: '◎',
  VALUES_INVENTORY: '◈',
}

function AssessmentFlow() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const sessionId = params.sessionId as string
  const templateId = searchParams.get('templateId')

  const [questions, setQuestions] = useState<Question[]>([])
  const [templateInfo, setTemplateInfo] = useState<TemplateInfo | null>(null)
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const [activeMilestone, setActiveMilestone] = useState<string | null>(null)
  const shownMilestones = useRef<Set<number>>(new Set())
  const milestoneTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [archetypeIndex, setArchetypeIndex] = useState(0)
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clear auto-advance timer on question change or unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current)
    }
  }, [currentIndex])

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }

    if (!templateId) {
      router.push('/assessment')
      return
    }

    Promise.all([
      api.get<{ template: { title: string; description: string | null; type: string; questionBank: Question[] } }>(`/api/templates/${templateId}`),
      api.get<{ assessments: (Assessment & { sessionId: string })[] }>(`/api/assessments`, token),
    ])
      .then(([templateData, assessmentsData]) => {
        const tpl = templateData.template
        setQuestions(tpl.questionBank)
        setTemplateInfo({ title: tpl.title, description: tpl.description, type: tpl.type })

        // Find the assessment that belongs to this session
        const found =
          assessmentsData.assessments.find((a) => a.sessionId === sessionId) ??
          assessmentsData.assessments[0]
        if (found) setAssessment(found)

        // Track assessment started
        posthog.capture('assessment_started', { framework: tpl.type })

        // Show intro only if user hasn't seen it for this template
        const seenKey = `seenIntro_${templateId}`
        if (!localStorage.getItem(seenKey)) {
          setShowIntro(true)
        }
      })
      .catch(() => router.push('/assessment'))
      .finally(() => setLoading(false))
  }, [sessionId, templateId, router])

  const handleBegin = useCallback(() => {
    if (templateId) {
      localStorage.setItem(`seenIntro_${templateId}`, '1')
    }
    setShowIntro(false)
  }, [templateId])

  // Milestone messages at 25%, 50%, 75%
  useEffect(() => {
    if (questions.length === 0 || showIntro) return
    const pct = Math.round((currentIndex / questions.length) * 100)
    const milestone = [25, 50, 75].find(
      (m) => pct >= m && pct < m + Math.ceil(100 / questions.length) + 1,
    )
    if (milestone && !shownMilestones.current.has(milestone)) {
      shownMilestones.current.add(milestone)
      setActiveMilestone(MILESTONE_MESSAGES[milestone])
      if (milestoneTimer.current) clearTimeout(milestoneTimer.current)
      milestoneTimer.current = setTimeout(() => setActiveMilestone(null), 3500)
    }
  }, [currentIndex, questions.length, showIntro])

  // Cycle archetype phrases during analysis
  useEffect(() => {
    if (!analyzing) return
    const id = setInterval(() => {
      setArchetypeIndex((i) => (i + 1) % ARCHETYPE_PHRASES.length)
    }, 1200)
    return () => clearInterval(id)
  }, [analyzing])

  const currentQuestion = questions[currentIndex]
  const progress = questions.length > 0 ? (currentIndex / questions.length) * 100 : 0
  const currentAnswer = currentQuestion ? responses[currentQuestion.id] : undefined

  const handleAnswer = useCallback(
    (value: number) => {
      if (!currentQuestion) return
      setResponses((prev) => ({ ...prev, [currentQuestion.id]: value }))
      // Auto-advance on non-last questions after a brief delay for visual feedback
      if (currentIndex < questions.length - 1) {
        if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current)
        autoAdvanceTimer.current = setTimeout(() => {
          setCurrentIndex((i) => i + 1)
        }, 250)
      }
    },
    [currentQuestion, currentIndex, questions.length],
  )

  const handleNext = useCallback(async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
      return
    }

    if (!assessment) return
    const token = getToken()
    if (!token) return router.push('/auth/login')

    setAnalyzing(true)
    try {
      const responseArray = Object.entries(responses).map(([questionId, value]) => ({
        questionId,
        value,
      }))

      await api.post(`/api/sessions/${sessionId}/responses`, {
        assessmentId: assessment.id,
        responses: responseArray,
      }, token)

      const { profile } = await api.post<{ profile: { id: string } }>(
        `/api/sessions/${sessionId}/complete`,
        {},
        token,
      )

      posthog.capture('assessment_completed', { framework: templateInfo?.type })
      trackAssessmentComplete(templateInfo?.type ?? 'unknown')
      router.push(`/profile/${profile.id}?new=1`)
    } catch {
      setAnalyzing(false)
    }
  }, [currentIndex, questions.length, assessment, responses, sessionId, router])

  const handleBack = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1)
  }, [currentIndex])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" />
      </div>
    )
  }

  // Intro screen
  if (showIntro && templateInfo) {
    const icon = TYPE_ICONS[templateInfo.type] ?? '◯'
    const duration = TYPE_DURATION[templateInfo.type] ?? '5–15 min'
    const outcome = TYPE_OUTCOME[templateInfo.type] ?? 'A detailed psychological profile.'

    return (
      <div className="mx-auto max-w-xl px-6 py-20">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20">
            <span className="text-3xl">{icon}</span>
          </div>
          <h1 className="font-serif text-4xl text-stone-100">{templateInfo.title}</h1>
          {templateInfo.description && (
            <p className="mt-3 text-stone-400 leading-relaxed">{templateInfo.description}</p>
          )}
        </div>

        <div className="mt-10 space-y-3">
          <div className="flex items-start gap-3 rounded-xl border border-stone-800 bg-stone-900/50 px-5 py-4">
            <span className="mt-0.5 text-amber-500">⏱</span>
            <div>
              <p className="text-sm font-medium text-stone-200">Estimated time</p>
              <p className="text-sm text-stone-500">{duration}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-stone-800 bg-stone-900/50 px-5 py-4">
            <span className="mt-0.5 text-amber-500">✦</span>
            <div>
              <p className="text-sm font-medium text-stone-200">What you&apos;ll receive</p>
              <p className="text-sm text-stone-500">{outcome}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-stone-800 bg-stone-900/50 px-5 py-4">
            <span className="mt-0.5 text-amber-500">🧠</span>
            <div>
              <p className="text-sm font-medium text-stone-200">How it works</p>
              <p className="text-sm text-stone-500">
                Rate each statement on a 1–5 scale. Answer honestly — there are no right or wrong answers.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={handleBegin}
            className="rounded-xl bg-amber-500 px-10 py-3.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
          >
            Begin
          </button>
          <p className="mt-3 text-xs text-stone-600">{questions.length} questions total</p>
        </div>
      </div>
    )
  }

  // Analyzing / celebration screen
  if (analyzing) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-32 text-center">
        <div className="relative mb-8">
          {/* Outer pulse ring */}
          <div className="absolute inset-0 -m-3 animate-ping rounded-full border border-amber-500/20" />
          <div className="h-20 w-20 animate-spin rounded-full border-2 border-stone-800 border-t-amber-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">◎</span>
          </div>
        </div>
        <h2 className="font-serif text-3xl text-stone-100">Identifying your archetype…</h2>
        <p className="mt-2 text-lg font-medium text-amber-400/80 transition-all duration-700">
          {ARCHETYPE_PHRASES[archetypeIndex]}
        </p>
        <p className="mt-4 max-w-sm text-stone-500 leading-relaxed text-sm">
          We&apos;re synthesizing your responses into a personalized psychological portrait.
        </p>
        <div className="mt-8 flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-500/60"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center py-24 text-stone-400">
        No questions found.
      </div>
    )
  }

  const isLast = currentIndex === questions.length - 1

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      {/* Milestone banner */}
      {activeMilestone && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-300/90 transition-all duration-500">
          <span className="text-amber-500">✦</span>
          {activeMilestone}
        </div>
      )}

      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex justify-between text-xs text-stone-500">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-800">
          <div
            className="h-full rounded-full bg-amber-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-10 min-h-[8rem]">
        <p className="font-serif text-2xl text-stone-100 leading-relaxed">
          {currentQuestion.text}
        </p>
        <p className="mt-2 text-xs uppercase tracking-wide text-stone-600">
          {currentQuestion.dimension.replace(/_/g, ' ')}
        </p>
      </div>

      {/* Likert scale */}
      <div className="mb-10 grid grid-cols-5 gap-2">
        {LIKERT_LABELS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleAnswer(value)}
            className={`flex flex-col items-center gap-2 rounded-xl border px-2 py-4 text-center transition-all ${
              currentAnswer === value
                ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                : 'border-stone-700 bg-stone-900/50 text-stone-400 hover:border-stone-500 hover:text-stone-200'
            }`}
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold transition-colors ${
                currentAnswer === value
                  ? 'border-amber-500 bg-amber-500 text-stone-950'
                  : 'border-stone-600 text-stone-400'
              }`}
            >
              {value}
            </span>
            <span className="whitespace-pre-line text-xs leading-tight">{label}</span>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="rounded-xl border border-stone-700 px-5 py-2.5 text-sm text-stone-400 transition-colors hover:border-stone-500 hover:text-stone-200 disabled:opacity-30"
        >
          Back
        </button>
        {isLast ? (
          <button
            onClick={handleNext}
            disabled={currentAnswer === undefined}
            className="rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400 disabled:opacity-40"
          >
            Submit
          </button>
        ) : (
          <p className="text-xs text-stone-600">
            {currentAnswer !== undefined ? 'Moving on…' : 'Select an answer'}
          </p>
        )}
      </div>
    </div>
  )
}

export default function AssessmentSessionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" />
        </div>
      }
    >
      <AssessmentFlow />
    </Suspense>
  )
}
