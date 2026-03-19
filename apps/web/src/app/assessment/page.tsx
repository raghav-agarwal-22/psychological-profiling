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
}

export default function AssessmentPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState<string | null>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }

    api
      .get<{ templates: Template[] }>('/api/templates')
      .then((d) => setTemplates(d.templates))
      .catch(() => router.push('/auth/login'))
      .finally(() => setLoading(false))
  }, [router])

  async function startAssessment(template: Template) {
    const token = getToken()
    if (!token) return router.push('/auth/login')

    setStarting(template.id)
    try {
      // Create session
      const { session } = await api.post<{ session: { id: string } }>(
        '/api/sessions',
        { title: template.title },
        token,
      )

      // Create assessment within session
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
          Each assessment takes 5–10 minutes and reveals a different facet of your inner life.
        </p>
      </div>

      <div className="space-y-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 transition-colors hover:border-stone-700"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="font-serif text-xl text-stone-100">{template.title}</h2>
                <p className="mt-2 text-sm text-stone-400 leading-relaxed">
                  {template.description ?? typeDescriptions[template.type] ?? ''}
                </p>
              </div>
              <button
                onClick={() => startAssessment(template)}
                disabled={starting === template.id}
                className="shrink-0 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400 disabled:opacity-50"
              >
                {starting === template.id ? 'Starting…' : 'Begin'}
              </button>
            </div>
          </div>
        ))}

        {templates.length === 0 && (
          <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-8 text-center text-stone-400">
            No assessments available yet.
          </div>
        )}
      </div>
    </div>
  )
}
