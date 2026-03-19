'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { Suspense } from 'react'

interface Question {
  id: string
  text: string
  dimension: string
  reverse_scored: boolean
}

interface Assessment {
  id: string
}

const LIKERT_LABELS = [
  { value: 1, label: 'Strongly\nDisagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly\nAgree' },
]

function AssessmentFlow() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const sessionId = params.sessionId as string
  const templateId = searchParams.get('templateId')

  const [questions, setQuestions] = useState<Question[]>([])
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

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

    // Load template questions + find the assessment for this session
    Promise.all([
      api.get<{ template: { questionBank: Question[] } }>(`/api/templates/${templateId}`),
      api.get<{ assessments: Assessment[] }>(`/api/assessments`, token),
    ])
      .then(([templateData, assessmentsData]) => {
        setQuestions(templateData.template.questionBank)
        // Take the most recent assessment (just created for this session)
        const found = assessmentsData.assessments[0]
        if (found) setAssessment(found)
      })
      .catch(() => router.push('/assessment'))
      .finally(() => setLoading(false))
  }, [sessionId, templateId, router])

  const currentQuestion = questions[currentIndex]
  const progress = questions.length > 0 ? ((currentIndex) / questions.length) * 100 : 0
  const currentAnswer = currentQuestion ? responses[currentQuestion.id] : undefined

  const handleAnswer = useCallback(
    (value: number) => {
      if (!currentQuestion) return
      setResponses((prev) => ({ ...prev, [currentQuestion.id]: value }))
    },
    [currentQuestion],
  )

  const handleNext = useCallback(async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
      return
    }

    // Final question — submit all responses then complete
    if (!assessment) return
    const token = getToken()
    if (!token) return router.push('/auth/login')

    setSubmitting(true)
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

      router.push(`/profile/${profile.id}`)
    } catch {
      setSubmitting(false)
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
        <button
          onClick={handleNext}
          disabled={currentAnswer === undefined || submitting}
          className="rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400 disabled:opacity-40"
        >
          {submitting ? 'Generating profile…' : isLast ? 'Submit' : 'Next'}
        </button>
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
