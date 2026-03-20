'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { archetypeNameToSlug } from '@/lib/archetypes'
import { posthog } from '@/lib/posthog'
import { GrowthChart } from '@/components/GrowthChart'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

interface DimensionScore {
  normalized: number
  raw: number
  responseCount: number
}

interface RawOutput {
  templateType?: string
  reflectionPrompts?: string[]
  narrative?: {
    // Big Five fields
    archetype?: string
    values?: string[]
    blind_spots?: string[]
    strengths?: string[]
    // Values fields
    narrative?: string
    valueRankings?: string[]
    coreValues?: string[]
    tensions?: Array<{ value1: string; value2: string; description: string }>
    // Attachment fields
    attachmentStyle?: string
    relationshipStrengths?: string[]
    growthEdges?: string[]
    anxietyLevel?: string
    avoidanceLevel?: string
    // Triad fields
    lightScore?: number
    darkScore?: number
    dominantLight?: string
    dominantDark?: string
    interpretation?: string
    integrationGuidance?: string
    atBest?: string[]
    watchFor?: string[]
    // Enneagram fields
    primaryType?: number
    wing?: number
    typeName?: string
    wingName?: string
    coreFear?: string
    coreDesire?: string
    coreWound?: string
    growthPath?: string
    stressArrow?: number
    securityArrow?: number
    atWorst?: string[]
  }
}

interface Profile {
  id: string
  summary: string
  dimensions: Record<string, DimensionScore>
  archetypes: string[]
  values: string[]
  blindSpots: string[]
  strengths: string[]
  version: number
  generatedAt: string
  isPublic: boolean
  shareToken: string | null
  rawOutput: RawOutput
}

interface GrowthRecommendation {
  title: string
  description: string
  category: 'relationships' | 'career' | 'emotional' | 'self-awareness' | 'wellbeing'
  scoreBasis: string
  actionStep: string
}

const BIG_FIVE_LABELS: Record<string, string> = {
  openness: 'Openness',
  conscientiousness: 'Conscientiousness',
  extraversion: 'Extraversion',
  agreeableness: 'Agreeableness',
  neuroticism: 'Neuroticism',
}

const BIG_FIVE_COLORS: Record<string, string> = {
  openness: 'bg-violet-500',
  conscientiousness: 'bg-blue-500',
  extraversion: 'bg-amber-500',
  agreeableness: 'bg-emerald-500',
  neuroticism: 'bg-rose-500',
}

const VALUES_LABELS: Record<string, string> = {
  achievement: 'Achievement',
  benevolence: 'Benevolence',
  conformity: 'Conformity',
  hedonism: 'Hedonism',
  power: 'Power',
  security: 'Security',
  self_direction: 'Self-Direction',
  stimulation: 'Stimulation',
  universalism: 'Universalism',
}

const VALUES_COLORS: Record<string, string> = {
  achievement: 'bg-amber-500',
  benevolence: 'bg-emerald-500',
  conformity: 'bg-blue-400',
  hedonism: 'bg-pink-500',
  power: 'bg-rose-500',
  security: 'bg-cyan-500',
  self_direction: 'bg-violet-500',
  stimulation: 'bg-orange-500',
  universalism: 'bg-teal-500',
}

const ATTACHMENT_LABELS: Record<string, string> = {
  anxiety: 'Attachment Anxiety',
  avoidance: 'Attachment Avoidance',
}

const ATTACHMENT_COLORS: Record<string, string> = {
  anxiety: 'bg-rose-500',
  avoidance: 'bg-indigo-500',
}

const ATTACHMENT_STYLE_LABELS: Record<string, string> = {
  secure: 'Secure',
  anxious: 'Anxious / Preoccupied',
  avoidant: 'Dismissive-Avoidant',
  fearful: 'Fearful-Avoidant',
}

const ATTACHMENT_STYLE_COLORS: Record<string, string> = {
  secure: 'bg-emerald-500/10 ring-emerald-500/20 text-emerald-400',
  anxious: 'bg-amber-500/10 ring-amber-500/20 text-amber-400',
  avoidant: 'bg-indigo-500/10 ring-indigo-500/20 text-indigo-400',
  fearful: 'bg-rose-500/10 ring-rose-500/20 text-rose-400',
}

const TRIAD_LABELS: Record<string, string> = {
  kantianism: 'Kantianism',
  humanism: 'Humanism',
  faith_in_humanity: 'Faith in Humanity',
  narcissism: 'Narcissism',
  machiavellianism: 'Machiavellianism',
  psychopathy: 'Psychopathy',
}

const TRIAD_COLORS: Record<string, string> = {
  kantianism: 'bg-teal-500',
  humanism: 'bg-emerald-500',
  faith_in_humanity: 'bg-cyan-500',
  narcissism: 'bg-rose-500',
  machiavellianism: 'bg-orange-500',
  psychopathy: 'bg-red-700',
}

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const profileId = params.profileId as string

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [sharing, setSharing] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [, setShareToken] = useState<string | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [downloadingPDF, setDownloadingPDF] = useState(false)

  // History / retake state
  interface HistoryProfile {
    id: string
    version: number
    summary: string
    dimensions: Record<string, DimensionScore>
    generatedAt: string
  }
  const [historyProfiles, setHistoryProfiles] = useState<HistoryProfile[]>([])

  // Compare modal
  const [showCompareModal, setShowCompareModal] = useState(false)
  const [comparingShare, setComparingShare] = useState(false)
  const [compareTokenInput, setCompareTokenInput] = useState('')
  const [compareShareUrl, setCompareShareUrl] = useState<string | null>(null)
  const [compareShareToken, setCompareShareToken] = useState<string | null>(null)
  const [compareCopied, setCompareCopied] = useState(false)

  const [synthesis, setSynthesis] = useState<string | null>(null)
  const [synthesisGeneratedAt, setSynthesisGeneratedAt] = useState<string | null>(null)
  const [synthesisLoading, setSynthesisLoading] = useState(false)
  const [synthesisStreaming, setSynthesisStreaming] = useState(false)
  const [synthesisError, setSynthesisError] = useState<string | null>(null)
  const synthesisRef = useRef<HTMLDivElement>(null)

  // Growth recommendations state
  const [recommendations, setRecommendations] = useState<GrowthRecommendation[] | null>(null)
  const [recommendationsGeneratedAt, setRecommendationsGeneratedAt] = useState<string | null>(null)
  const [recommendationsLoading, setRecommendationsLoading] = useState(false)
  const [recommendationsError, setRecommendationsError] = useState<string | null>(null)

  // Journal state
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)
  const [journalText, setJournalText] = useState('')
  const [journalSaving, setJournalSaving] = useState(false)
  const [journalSaved, setJournalSaved] = useState(false)
  const [journalError, setJournalError] = useState<string | null>(null)
  const [savedEntries, setSavedEntries] = useState<Array<{ id: string; body: string; prompt: string | null; createdAt: string }>>([])

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }

    const endpoint =
      profileId === 'latest'
        ? '/api/profiles'
        : `/api/profiles/${profileId}`

    api
      .get<{ profile: Profile }>(endpoint, token)
      .then((d) => {
        setProfile(d.profile)
        posthog.capture('profile_viewed', { profileId: d.profile?.id })
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load profile'))
      .finally(() => setLoading(false))

    // Load cached synthesis
    api
      .get<{ synthesis: string; generatedAt: string }>('/api/users/me/synthesis', token)
      .then((d) => {
        setSynthesis(d.synthesis)
        setSynthesisGeneratedAt(d.generatedAt)
      })
      .catch(() => {
        // No synthesis yet — that's fine, we'll show a generate button
      })

    // Load journal entries for this profile
    api
      .get<{ entries: Array<{ id: string; body: string; prompt: string | null; profileId: string | null; createdAt: string }> }>('/api/users/me/journal', token)
      .then((d) => {
        // Filter to entries for this specific profile (after profile loads we'll filter)
        setSavedEntries(d.entries)
      })
      .catch(() => {})

    // Load profile history for retake delta (loaded after profile resolves)
    api
      .get<{ profile: Profile }>(endpoint, token)
      .then((d) => {
        const templateType = d.profile?.rawOutput?.templateType
        if (templateType) {
          const tok = getToken()
          if (!tok) return
          api
            .get<{ profiles: HistoryProfile[] }>(`/api/profiles/history/by-type?type=${encodeURIComponent(templateType)}`, tok)
            .then((h) => setHistoryProfiles(h.profiles))
            .catch(() => {})
        }
      })
      .catch(() => {})

    // Load cached recommendations (generate if none exist)
    api
      .get<{ recommendations: { recommendations: GrowthRecommendation[] }; generatedAt: string }>('/api/users/me/recommendations', token)
      .then((d) => {
        setRecommendations(d.recommendations.recommendations)
        setRecommendationsGeneratedAt(d.generatedAt)
      })
      .catch(() => {
        // No cached recommendations — auto-generate on first load
        const tok = getToken()
        if (!tok) return
        setRecommendationsLoading(true)
        api
          .post<{ recommendations: { recommendations: GrowthRecommendation[] }; generatedAt: string }>(
            '/api/users/me/recommendations/generate',
            {},
            tok,
          )
          .then((d) => {
            setRecommendations(d.recommendations.recommendations)
            setRecommendationsGeneratedAt(d.generatedAt)
          })
          .catch((err) => {
            setRecommendationsError(err instanceof Error ? err.message : 'Failed to generate recommendations')
          })
          .finally(() => setRecommendationsLoading(false))
      })
  }, [profileId, router])

  const handleRegenerateRecommendations = async () => {
    const token = getToken()
    if (!token) return
    setRecommendationsLoading(true)
    setRecommendationsError(null)
    try {
      const d = await api.post<{ recommendations: { recommendations: GrowthRecommendation[] }; generatedAt: string }>(
        '/api/users/me/recommendations/generate',
        {},
        token,
      )
      setRecommendations(d.recommendations.recommendations)
      setRecommendationsGeneratedAt(d.generatedAt)
    } catch (err) {
      setRecommendationsError(err instanceof Error ? err.message : 'Failed to regenerate recommendations')
    } finally {
      setRecommendationsLoading(false)
    }
  }

  const handleGenerateSynthesis = async () => {
    const token = getToken()
    if (!token) return
    setSynthesisLoading(true)
    setSynthesisError(null)
    setSynthesis('')
    setSynthesisStreaming(true)

    try {
      const res = await fetch(`${API_URL}/api/users/me/synthesis/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Failed to generate synthesis' }))
        setSynthesisError(body.error ?? 'Failed to generate synthesis')
        setSynthesis(null)
        return
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) return

      let text = ''
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        text += chunk
        setSynthesis(text)
        synthesisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }

      setSynthesisGeneratedAt(new Date().toISOString())
    } catch (err) {
      setSynthesisError(err instanceof Error ? err.message : 'Failed to generate synthesis')
    } finally {
      setSynthesisLoading(false)
      setSynthesisStreaming(false)
    }
  }

  const ensureShared = async (): Promise<{ shareToken: string; shareUrl: string } | null> => {
    const token = getToken()
    if (!token || !profile) return null
    // Already shared
    if (compareShareToken && compareShareUrl) return { shareToken: compareShareToken, shareUrl: compareShareUrl }
    if (profile.isPublic && profile.shareToken) {
      const url = `${window.location.origin}/p/${profile.shareToken}`
      setCompareShareToken(profile.shareToken)
      setCompareShareUrl(url)
      return { shareToken: profile.shareToken, shareUrl: url }
    }
    const data = await api.patch<{ profile: { isPublic: boolean; shareToken: string; shareUrl: string } }>(
      `/api/profiles/${profile.id}/share`,
      {},
      token,
    )
    setCompareShareToken(data.profile.shareToken)
    setCompareShareUrl(data.profile.shareUrl)
    return { shareToken: data.profile.shareToken, shareUrl: data.profile.shareUrl }
  }

  const handleShare = async () => {
    const token = getToken()
    if (!token || !profile) return
    setSharing(true)
    try {
      const data = await api.patch<{ profile: { isPublic: boolean; shareToken: string; shareUrl: string } }>(
        `/api/profiles/${profile.id}/share`,
        {},
        token,
      )
      setShareUrl(data.profile.shareUrl)
      setShareToken(data.profile.shareToken)
      setShowShareModal(true)
    } finally {
      setSharing(false)
    }
  }

  const handleOpenCompare = async () => {
    setComparingShare(true)
    try {
      await ensureShared()
      setShowCompareModal(true)
    } finally {
      setComparingShare(false)
    }
  }

  const handleCompareGo = () => {
    if (!compareTokenInput.trim() || !compareShareToken) return
    // Accept either a full URL or a bare token
    const raw = compareTokenInput.trim()
    const tokenMatch = raw.match(/\/p\/([^/?#]+)/) ?? raw.match(/([a-f0-9-]{32,})/)
    const theirToken = tokenMatch ? tokenMatch[1] : raw
    window.location.href = `/compare?a=${encodeURIComponent(compareShareToken)}&b=${encodeURIComponent(theirToken ?? raw)}`
  }

  const handleRevokeShare = async () => {
    const token = getToken()
    if (!token || !profile) return
    await api.patch(`/api/profiles/${profile.id}/share`, { isPublic: false }, token)
    setShareUrl(null)
    setShowShareModal(false)
  }

  const handleCopy = async () => {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadPDF = async () => {
    if (!profile) return
    setDownloadingPDF(true)
    try {
      const [{ pdf }, { ProfileDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/components/ProfilePDF'),
      ])
      // Filter journal entries for this profile
      const profileEntries = savedEntries.filter(
        (e) => (e as unknown as { profileId?: string }).profileId === profile.id
      )
      const doc = <ProfileDocument profile={profile} synthesis={synthesis} journalEntries={profileEntries} />
      const blob = await pdf(doc).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const slug = profile.archetypes[0]
        ? profile.archetypes[0].toLowerCase().replace(/\s+/g, '-')
        : 'profile'
      a.download = `innermind-${slug}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDownloadingPDF(false)
    }
  }

  const handleSaveJournal = async () => {
    const token = getToken()
    if (!token || !journalText.trim() || !profile) return
    setJournalSaving(true)
    setJournalError(null)
    try {
      const result = await api.post<{ entry: { id: string; body: string; prompt: string | null; createdAt: string } }>(
        '/api/users/me/journal',
        { body: journalText.trim(), profileId: profile.id, prompt: selectedPrompt ?? undefined },
        token,
      )
      setSavedEntries((prev) => [result.entry, ...prev])
      setJournalText('')
      setSelectedPrompt(null)
      setJournalSaved(true)
      setTimeout(() => setJournalSaved(false), 3000)
    } catch (err) {
      setJournalError(err instanceof Error ? err.message : 'Failed to save entry')
    } finally {
      setJournalSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" />
        <p className="text-stone-500">Loading your profile…</p>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-stone-400">{error ?? 'Profile not found.'}</p>
        <Link href="/assessment" className="mt-4 text-amber-400 hover:text-amber-300">
          Take an assessment →
        </Link>
      </div>
    )
  }

  const isValuesProfile = profile.rawOutput?.templateType === 'VALUES_INVENTORY'
  const isAttachmentProfile = profile.rawOutput?.templateType === 'ATTACHMENT_STYLE'
  const isTriadProfile = profile.rawOutput?.templateType === 'LIGHT_DARK_TRIAD'
  const isEnneagramProfile = profile.rawOutput?.templateType === 'ENNEAGRAM'
  const valuesNarrative = profile.rawOutput?.narrative
  const attachmentStyle = isAttachmentProfile ? (profile.archetypes[0] ?? null) : null
  const attachmentNarrative = isAttachmentProfile ? profile.rawOutput?.narrative : null
  const triadNarrative = isTriadProfile ? profile.rawOutput?.narrative : null
  const enneagramNarrative = isEnneagramProfile ? profile.rawOutput?.narrative : null
  const dimensionEntries = Object.entries(profile.dimensions)

  // For values profiles: sort dimensions by score descending
  const sortedValueEntries = isValuesProfile
    ? [...dimensionEntries].sort(([, a], [, b]) => {
        const aScore = typeof a === 'object' ? a.normalized : Number(a)
        const bScore = typeof b === 'object' ? b.normalized : Number(b)
        return bScore - aScore
      })
    : dimensionEntries

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* Header */}
      {isEnneagramProfile ? (
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20">
            <span className="text-3xl">◑</span>
          </div>
          <h1 className="font-serif text-4xl text-stone-100">
            {enneagramNarrative?.typeName
              ? `Type ${enneagramNarrative.primaryType}: ${enneagramNarrative.typeName}`
              : profile.archetypes[0] ?? 'Enneagram'}
          </h1>
          {enneagramNarrative?.wing && enneagramNarrative?.wingName && (
            <p className="mt-1 text-stone-500">
              with a {enneagramNarrative.wing} wing — {enneagramNarrative.wingName}
            </p>
          )}
          <p className="mt-2 text-stone-600 text-sm">Enneagram of Personality</p>
        </div>
      ) : isTriadProfile ? (
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/10 to-rose-500/10 ring-1 ring-stone-700/30">
            <span className="text-3xl">◐</span>
          </div>
          <h1 className="font-serif text-4xl text-stone-100">Light & Dark Triad</h1>
          <p className="mt-2 text-stone-500">Your position on the prosocial–antagonistic spectrum</p>
          {triadNarrative?.lightScore !== undefined && triadNarrative?.darkScore !== undefined && (
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
                <span className="text-sm text-stone-400">Light: <span className="font-semibold text-teal-400">{triadNarrative.lightScore}/100</span></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                <span className="text-sm text-stone-400">Dark: <span className="font-semibold text-rose-400">{triadNarrative.darkScore}/100</span></span>
              </div>
            </div>
          )}
        </div>
      ) : isAttachmentProfile ? (
        <div className="mb-10 text-center">
          <div className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl ring-1 ${attachmentStyle ? ATTACHMENT_STYLE_COLORS[attachmentStyle] : 'bg-stone-800/10 ring-stone-700/20'}`}>
            <span className="text-3xl">◉</span>
          </div>
          <h1 className="font-serif text-4xl text-stone-100">
            {attachmentStyle ? ATTACHMENT_STYLE_LABELS[attachmentStyle] ?? attachmentStyle : 'Attachment Style'}
          </h1>
          <p className="mt-2 text-stone-500">Your relational blueprint</p>
        </div>
      ) : isValuesProfile ? (
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/10 ring-1 ring-teal-500/20">
            <span className="text-3xl">◈</span>
          </div>
          <h1 className="font-serif text-4xl text-stone-100">Your Values</h1>
          <p className="mt-2 text-stone-500">Schwartz Basic Human Values</p>
        </div>
      ) : profile.archetypes.length > 0 ? (
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20">
            <span className="text-3xl">◎</span>
          </div>
          <h1 className="font-serif text-4xl text-stone-100">{profile.archetypes[0]}</h1>
          <p className="mt-2 text-stone-500">Your psychological archetype</p>
          <Link
            href={`/archetypes/${archetypeNameToSlug(profile.archetypes[0])}`}
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-300"
          >
            <span>Explore this archetype</span>
            <span>→</span>
          </Link>
        </div>
      ) : null}

      {/* Summary */}
      <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
        <h2 className="mb-3 font-serif text-xl text-stone-200">
          {isAttachmentProfile ? 'Your relational narrative' : isValuesProfile ? 'Your value landscape' : isTriadProfile ? 'Your spectrum portrait' : isEnneagramProfile ? 'Your type portrait' : 'Your narrative'}
        </h2>
        <p className="text-stone-400 leading-relaxed">{profile.summary}</p>
        {isValuesProfile && valuesNarrative?.narrative && (
          <p className="mt-4 text-stone-400 leading-relaxed">{valuesNarrative.narrative}</p>
        )}
        {isAttachmentProfile && attachmentNarrative?.narrative && (
          <p className="mt-4 text-stone-400 leading-relaxed">{attachmentNarrative.narrative}</p>
        )}
        {isTriadProfile && triadNarrative?.interpretation && (
          <p className="mt-4 text-stone-400 leading-relaxed">{triadNarrative.interpretation}</p>
        )}
        {isEnneagramProfile && (enneagramNarrative?.coreFear || enneagramNarrative?.coreDesire) && (
          <div className="mt-5 space-y-2 rounded-xl bg-stone-800/40 p-4">
            {enneagramNarrative.coreFear && (
              <div className="flex gap-3">
                <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-rose-500 pt-0.5 w-20">Core Fear</span>
                <span className="text-sm text-stone-400">{enneagramNarrative.coreFear}</span>
              </div>
            )}
            {enneagramNarrative.coreDesire && (
              <div className="flex gap-3">
                <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-violet-400 pt-0.5 w-20">Core Desire</span>
                <span className="text-sm text-stone-400">{enneagramNarrative.coreDesire}</span>
              </div>
            )}
            {enneagramNarrative.coreWound && (
              <div className="flex gap-3">
                <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-stone-500 pt-0.5 w-20">Core Wound</span>
                <span className="text-sm text-stone-400">{enneagramNarrative.coreWound}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Values profile: ranked list with core values highlighted */}
      {isValuesProfile && sortedValueEntries.length > 0 && (
        <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
          <h2 className="mb-1 font-serif text-xl text-stone-200">Value rankings</h2>
          <p className="mb-5 text-xs text-stone-500">Ranked highest to lowest expression</p>
          <div className="space-y-4">
            {sortedValueEntries.map(([key, score], index) => {
              const label = VALUES_LABELS[key.toLowerCase()] ?? key
              const color = VALUES_COLORS[key.toLowerCase()] ?? 'bg-stone-400'
              const pct = typeof score === 'object' ? score.normalized : Number(score)
              const isCoreValue = index < 3
              return (
                <div key={key}>
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 text-right text-xs text-stone-600">{index + 1}.</span>
                      <span className={`text-sm ${isCoreValue ? 'font-semibold text-stone-100' : 'text-stone-300'}`}>
                        {label}
                      </span>
                      {isCoreValue && (
                        <span className="rounded-full border border-teal-700 bg-teal-950/50 px-2 py-0.5 text-[10px] font-medium text-teal-400">
                          core
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-stone-400">{pct}</span>
                  </div>
                  <div className="ml-7 h-2 w-full overflow-hidden rounded-full bg-stone-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${color} ${isCoreValue ? 'opacity-100' : 'opacity-50'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Enneagram growth path */}
      {isEnneagramProfile && enneagramNarrative?.growthPath && (
        <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
          <h2 className="mb-3 font-serif text-xl text-stone-200">Growth path</h2>
          <p className="text-stone-400 leading-relaxed">{enneagramNarrative.growthPath}</p>
          {enneagramNarrative.stressArrow && enneagramNarrative.securityArrow && (
            <div className="mt-4 flex gap-6">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="text-xs text-stone-500">Stress → Type {enneagramNarrative.stressArrow}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-stone-500">Security → Type {enneagramNarrative.securityArrow}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Triad dimensions */}
      {isTriadProfile && dimensionEntries.length > 0 && (
        <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
          <h2 className="mb-1 font-serif text-xl text-stone-200">Spectrum dimensions</h2>
          <p className="mb-5 text-xs text-stone-500">Light Triad (prosocial) and Dark Triad (antagonistic) scores</p>
          <div className="mb-4 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-600">Light Triad</p>
          </div>
          <div className="mb-6 space-y-4">
            {['kantianism', 'humanism', 'faith_in_humanity'].map((key) => {
              const score = profile.dimensions[key]
              if (!score) return null
              const label = TRIAD_LABELS[key] ?? key
              const color = TRIAD_COLORS[key] ?? 'bg-teal-400'
              const pct = typeof score === 'object' ? score.normalized : Number(score)
              return (
                <div key={key}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm text-stone-300">{label}</span>
                    <span className="text-sm font-medium text-stone-400">{pct}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-stone-800">
                    <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mb-4 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-700">Dark Triad</p>
          </div>
          <div className="space-y-4">
            {['narcissism', 'machiavellianism', 'psychopathy'].map((key) => {
              const score = profile.dimensions[key]
              if (!score) return null
              const label = TRIAD_LABELS[key] ?? key
              const color = TRIAD_COLORS[key] ?? 'bg-rose-400'
              const pct = typeof score === 'object' ? score.normalized : Number(score)
              return (
                <div key={key}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm text-stone-300">{label}</span>
                    <span className="text-sm font-medium text-stone-400">{pct}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-stone-800">
                    <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Triad integration guidance */}
      {isTriadProfile && triadNarrative?.integrationGuidance && (
        <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
          <h2 className="mb-3 font-serif text-xl text-stone-200">Integration guidance</h2>
          <p className="text-stone-400 leading-relaxed">{triadNarrative.integrationGuidance}</p>
        </div>
      )}

      {/* Attachment dimensions */}
      {isAttachmentProfile && dimensionEntries.length > 0 && (
        <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
          <h2 className="mb-1 font-serif text-xl text-stone-200">Attachment dimensions</h2>
          <p className="mb-5 text-xs text-stone-500">Higher scores indicate stronger expression of each pattern</p>
          <div className="space-y-4">
            {dimensionEntries.map(([key, score]) => {
              const label = ATTACHMENT_LABELS[key.toLowerCase()] ?? key
              const color = ATTACHMENT_COLORS[key.toLowerCase()] ?? 'bg-stone-400'
              const pct = typeof score === 'object' ? score.normalized : Number(score)
              return (
                <div key={key}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm text-stone-300">{label}</span>
                    <span className="text-sm font-medium text-stone-400">{pct}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-stone-800">
                    <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Big Five scores */}
      {!isValuesProfile && !isAttachmentProfile && !isTriadProfile && !isEnneagramProfile && dimensionEntries.length > 0 && (
        <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
          <h2 className="mb-5 font-serif text-xl text-stone-200">Personality dimensions</h2>
          <div className="space-y-4">
            {dimensionEntries.map(([key, score]) => {
              const label = BIG_FIVE_LABELS[key.toLowerCase()] ?? key
              const color = BIG_FIVE_COLORS[key.toLowerCase()] ?? 'bg-stone-400'
              const pct = typeof score === 'object' ? score.normalized : Number(score)
              return (
                <div key={key}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm text-stone-300">{label}</span>
                    <span className="text-sm font-medium text-stone-400">{pct}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-stone-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Values tensions */}
      {isValuesProfile && valuesNarrative?.tensions && valuesNarrative.tensions.length > 0 && (
        <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
          <h2 className="mb-1 font-serif text-xl text-stone-200">Value tensions</h2>
          <p className="mb-5 text-xs text-stone-500">Competing motivations that create growth opportunities</p>
          <div className="space-y-4">
            {valuesNarrative.tensions.map((tension, i) => (
              <div key={i} className="rounded-xl border border-stone-700 bg-stone-800/50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-200">
                  <span className="capitalize">{VALUES_LABELS[tension.value1] ?? tension.value1}</span>
                  <span className="text-stone-600">⟷</span>
                  <span className="capitalize">{VALUES_LABELS[tension.value2] ?? tension.value2}</span>
                </div>
                <p className="text-sm text-stone-400 leading-relaxed">{tension.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths + Growth areas (Big Five and Attachment) */}
      {!isValuesProfile && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          {profile.strengths.length > 0 && (
            <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-5">
              <h2 className="mb-3 font-serif text-lg text-stone-200">
                {isAttachmentProfile ? 'Relationship strengths' : 'Strengths'}
              </h2>
              <ul className="space-y-1.5">
                {profile.strengths.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-stone-400">
                    <span className="mt-0.5 text-emerald-500">✦</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {profile.blindSpots.length > 0 && (
            <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-5">
              <h2 className="mb-3 font-serif text-lg text-stone-200">
                {isAttachmentProfile ? 'Growth edges' : 'Growth areas'}
              </h2>
              <ul className="space-y-1.5">
                {profile.blindSpots.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-stone-400">
                    <span className="mt-0.5 text-amber-500">→</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Core values (Big Five only — values profile uses ranked list, attachment uses strengths) */}
      {!isValuesProfile && !isAttachmentProfile && profile.values.length > 0 && (
        <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-5">
          <h2 className="mb-3 font-serif text-lg text-stone-200">Core values</h2>
          <div className="flex flex-wrap gap-2">
            {profile.values.map((v) => (
              <span
                key={v}
                className="rounded-full border border-stone-700 bg-stone-800 px-3 py-1 text-xs text-stone-300"
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI Synthesis */}
      <div ref={synthesisRef} className="mb-8 rounded-2xl border border-stone-700 bg-gradient-to-br from-stone-900 to-stone-900/50 p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl text-stone-200">Your synthesis</h2>
            <p className="mt-0.5 text-xs text-stone-500">
              {synthesisGeneratedAt
                ? `Generated ${new Date(synthesisGeneratedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                : 'Cross-framework narrative powered by AI'}
            </p>
          </div>
          <button
            onClick={handleGenerateSynthesis}
            disabled={synthesisLoading}
            className="shrink-0 rounded-xl border border-stone-700 bg-stone-800 px-4 py-2 text-xs font-semibold text-stone-300 transition-colors hover:border-stone-600 hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {synthesisLoading ? 'Generating…' : synthesis ? 'Regenerate' : 'Generate'}
          </button>
        </div>

        {synthesisError && (
          <p className="text-sm text-rose-400">{synthesisError}</p>
        )}

        {!synthesis && !synthesisLoading && !synthesisError && (
          <p className="text-sm text-stone-500">
            Generate a unified narrative that weaves together all your assessment results — Big Five personality, values, attachment style, and any other frameworks you&apos;ve completed — into one coherent self-portrait.
          </p>
        )}

        {synthesis && (
          <div className="space-y-3">
            {synthesis.split('\n\n').filter(Boolean).map((para, i) => (
              <p key={i} className={`leading-relaxed text-stone-300 ${synthesisStreaming && i === synthesis.split('\n\n').filter(Boolean).length - 1 ? 'after:animate-pulse after:content-["▋"] after:text-amber-400 after:ml-0.5' : ''}`}>
                {para}
              </p>
            ))}
          </div>
        )}

        <p className="mt-4 text-[10px] text-stone-600">Generated by AI based on your assessments · Regeneration limited to once per hour</p>
      </div>

      {/* Reflection Journal */}
      {(() => {
        const prompts = profile.rawOutput?.reflectionPrompts ?? []
        const profileEntries = savedEntries.filter((e) =>
          (e as unknown as { profileId?: string }).profileId === profile.id
        )
        return (
          <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
            <div className="mb-5">
              <h2 className="font-serif text-xl text-stone-200">Reflect on your results</h2>
              <p className="mt-0.5 text-xs text-stone-500">Bridge the gap between scores and lived experience</p>
            </div>

            {/* Prompts */}
            {prompts.length > 0 && (
              <div className="mb-5 space-y-2">
                {prompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedPrompt(selectedPrompt === prompt ? null : prompt)
                      setJournalText('')
                    }}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                      selectedPrompt === prompt
                        ? 'border-amber-500/40 bg-amber-500/10 text-stone-200'
                        : 'border-stone-700 bg-stone-800/50 text-stone-400 hover:border-stone-600 hover:text-stone-300'
                    }`}
                  >
                    <span className="mr-2 text-amber-500/60">◆</span>
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Journal textarea */}
            <div>
              {selectedPrompt && (
                <p className="mb-2 text-xs text-amber-400/80 italic">&ldquo;{selectedPrompt}&rdquo;</p>
              )}
              <textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder={prompts.length > 0 ? 'Select a prompt above or write freely…' : 'Write your reflection…'}
                rows={5}
                className="w-full resize-none rounded-xl border border-stone-700 bg-stone-800/50 px-4 py-3 text-sm text-stone-300 placeholder-stone-600 outline-none transition-colors focus:border-amber-500/40 focus:ring-0"
              />
              <div className="mt-2 flex items-center justify-between gap-4">
                <span className="text-xs text-stone-600">{journalText.length} / 10000</span>
                <div className="flex items-center gap-3">
                  {journalSaved && (
                    <span className="text-xs text-emerald-400">Saved ✓</span>
                  )}
                  {journalError && (
                    <span className="text-xs text-rose-400">{journalError}</span>
                  )}
                  <button
                    onClick={handleSaveJournal}
                    disabled={journalSaving || !journalText.trim()}
                    className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-stone-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {journalSaving ? 'Saving…' : 'Save entry'}
                  </button>
                </div>
              </div>
            </div>

            {/* Saved entries for this profile */}
            {profileEntries.length > 0 && (
              <div className="mt-6 space-y-3">
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Your reflections</p>
                {profileEntries.map((entry) => (
                  <div key={entry.id} className="rounded-xl border border-stone-700 bg-stone-800/40 p-4">
                    {entry.prompt && (
                      <p className="mb-1.5 text-[11px] text-amber-400/70 italic">{entry.prompt}</p>
                    )}
                    <p className="text-sm text-stone-300 leading-relaxed whitespace-pre-wrap">{entry.body}</p>
                    <p className="mt-2 text-[10px] text-stone-600">
                      {new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })()}

      {/* Growth Recommendations */}
      {(() => {
        const CATEGORY_COLORS: Record<string, string> = {
          relationships: 'border-rose-500/20 bg-rose-500/5 text-rose-300',
          career: 'border-blue-500/20 bg-blue-500/5 text-blue-300',
          emotional: 'border-violet-500/20 bg-violet-500/5 text-violet-300',
          'self-awareness': 'border-amber-500/20 bg-amber-500/5 text-amber-300',
          wellbeing: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300',
        }
        return (
          <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl text-stone-200">Growth recommendations</h2>
                {recommendationsGeneratedAt && (
                  <p className="mt-0.5 text-xs text-stone-500">
                    Generated {new Date(recommendationsGeneratedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                )}
              </div>
              <button
                onClick={handleRegenerateRecommendations}
                disabled={recommendationsLoading}
                className="shrink-0 rounded-xl border border-stone-700 bg-stone-800 px-4 py-2 text-xs font-semibold text-stone-300 transition-colors hover:border-stone-600 hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {recommendationsLoading ? 'Generating…' : 'Regenerate'}
              </button>
            </div>

            {recommendationsError && (
              <p className="mb-4 rounded-xl border border-rose-800/30 bg-rose-950/20 px-4 py-3 text-sm text-rose-400">
                {recommendationsError}
              </p>
            )}

            {recommendationsLoading && !recommendations && (
              <div className="flex items-center gap-3 py-6 text-stone-500">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-stone-600 border-t-amber-500" />
                <span className="text-sm">Generating personalised recommendations…</span>
              </div>
            )}

            {recommendations && recommendations.length > 0 && (
              <div className="space-y-4">
                {recommendations.map((rec, i) => {
                  const categoryClass = CATEGORY_COLORS[rec.category] ?? 'border-stone-500/20 bg-stone-500/5 text-stone-300'
                  return (
                    <div key={i} className="rounded-xl border border-stone-700 bg-stone-800/40 p-4">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-stone-100">{rec.title}</p>
                        <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${categoryClass}`}>
                          {rec.category.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="mb-2 text-sm text-stone-400 leading-relaxed">{rec.description}</p>
                      <p className="mb-3 text-xs text-stone-600 italic">{rec.scoreBasis}</p>
                      <div className="rounded-lg border border-amber-500/15 bg-amber-500/5 px-3 py-2">
                        <p className="text-xs text-amber-300/90">
                          <span className="font-semibold text-amber-400">This week: </span>
                          {rec.actionStep}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })()}

      {/* History: Changes since last assessment */}
      {historyProfiles.length > 1 && (() => {
        const current = historyProfiles[0]
        const previous = historyProfiles[1]
        if (!current || !previous) return null

        const deltas: Array<{ dim: string; delta: number }> = []
        for (const [key, currScore] of Object.entries(current.dimensions)) {
          const prevScore = previous.dimensions[key]
          if (prevScore !== undefined) {
            const d = Math.round((currScore.normalized - prevScore.normalized) * 100)
            deltas.push({ dim: key, delta: d })
          }
        }
        const hasChanges = deltas.some((d) => d.delta !== 0)

        return (
          <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
            <h2 className="mb-1 font-serif text-xl text-stone-200">Changes since last assessment</h2>
            <p className="mb-5 text-xs text-stone-500">
              Compared to your assessment on{' '}
              {new Date(previous.generatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
            {!hasChanges ? (
              <p className="text-sm text-stone-500 italic">No significant changes detected.</p>
            ) : (
              <div className="space-y-3">
                {deltas.map(({ dim, delta }) => {
                  const label = dim.charAt(0).toUpperCase() + dim.slice(1).replace(/_/g, ' ')
                  const positive = delta > 0
                  const neutral = delta === 0
                  return (
                    <div key={dim} className="flex items-center justify-between gap-4">
                      <span className="text-sm text-stone-400">{label}</span>
                      <span
                        className={`text-sm font-semibold tabular-nums ${
                          neutral
                            ? 'text-stone-500'
                            : positive
                              ? 'text-emerald-400'
                              : 'text-rose-400'
                        }`}
                      >
                        {neutral ? '— 0' : positive ? `▲ +${delta}` : `▼ ${delta}`}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
            <p className="mt-4 text-xs text-stone-600">
              {historyProfiles.length} assessment{historyProfiles.length !== 1 ? 's' : ''} total for this framework
            </p>
          </div>
        )
      })()}

      {/* Growth Chart */}
      {historyProfiles.length >= 2 && (
        <div className="mb-8">
          <GrowthChart
            profiles={historyProfiles}
            frameType={profile.rawOutput?.templateType}
          />
          <div className="mt-3 text-right">
            <Link href="/insights" className="text-xs text-amber-400 hover:text-amber-300">
              View full growth insights →
            </Link>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href={`/assessment${profile.rawOutput?.templateType ? `?type=${encodeURIComponent(profile.rawOutput.templateType)}` : ''}`}
          className="rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
        >
          Retake this assessment
        </Link>
        <button
          onClick={handleShare}
          disabled={sharing}
          className="rounded-xl border border-stone-700 bg-stone-900 px-6 py-2.5 text-sm font-semibold text-stone-200 transition-colors hover:border-stone-600 hover:bg-stone-800 disabled:opacity-50"
        >
          {sharing ? 'Generating link…' : 'Share Profile'}
        </button>
        <button
          onClick={handleOpenCompare}
          disabled={comparingShare}
          className="rounded-xl border border-stone-700 bg-stone-900 px-6 py-2.5 text-sm font-semibold text-stone-200 transition-colors hover:border-stone-600 hover:bg-stone-800 disabled:opacity-50"
        >
          {comparingShare ? 'Preparing…' : 'Compare with someone'}
        </button>
        <button
          onClick={handleDownloadPDF}
          disabled={downloadingPDF}
          className="rounded-xl border border-stone-700 bg-stone-900 px-6 py-2.5 text-sm font-semibold text-stone-200 transition-colors hover:border-stone-600 hover:bg-stone-800 disabled:opacity-50"
        >
          {downloadingPDF ? 'Generating PDF…' : 'Download PDF'}
        </button>
        <Link href="/dashboard" className="text-sm text-stone-400 hover:text-stone-200">
          Back to dashboard
        </Link>
      </div>

      {/* Share modal */}
      {showShareModal && shareUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-stone-800 bg-stone-900 p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-serif text-xl text-stone-100">Share your profile</h3>
                <p className="mt-1 text-sm text-stone-400">
                  Anyone with this link can view your profile.
                </p>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-stone-500 transition-colors hover:text-stone-300"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-800 px-3 py-2">
              <span className="flex-1 truncate text-sm text-stone-300">{shareUrl}</span>
              <button
                onClick={handleCopy}
                className="shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-stone-950 transition-colors hover:bg-amber-400"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <button
              onClick={handleRevokeShare}
              className="w-full rounded-xl border border-rose-800/50 bg-rose-950/30 px-4 py-2.5 text-sm text-rose-400 transition-colors hover:bg-rose-950/50 hover:text-rose-300"
            >
              Revoke sharing
            </button>
          </div>
        </div>
      )}

      {/* Compare modal */}
      {showCompareModal && compareShareToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-stone-800 bg-stone-900 p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-serif text-xl text-stone-100">Compare with someone</h3>
                <p className="mt-1 text-sm text-stone-400">
                  Share your profile link, then enter theirs.
                </p>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="text-stone-500 transition-colors hover:text-stone-300"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <p className="mb-1.5 text-xs text-stone-500">Your profile link</p>
              <div className="flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-800 px-3 py-2">
                <span className="flex-1 truncate text-sm text-stone-300">
                  {compareShareUrl ?? `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${compareShareToken}`}
                </span>
                <button
                  onClick={async () => {
                    const url = compareShareUrl ?? `${window.location.origin}/p/${compareShareToken}`
                    await navigator.clipboard.writeText(url)
                    setCompareCopied(true)
                    setTimeout(() => setCompareCopied(false), 2000)
                  }}
                  className="shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-stone-950 transition-colors hover:bg-amber-400"
                >
                  {compareCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <p className="mb-1.5 text-xs text-stone-500">Their profile link or share token</p>
              <input
                type="text"
                value={compareTokenInput}
                onChange={(e) => setCompareTokenInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCompareGo()}
                placeholder="Paste their link or token…"
                className="w-full rounded-xl border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-500/50"
              />
            </div>

            <button
              onClick={handleCompareGo}
              disabled={!compareTokenInput.trim()}
              className="w-full rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400 disabled:opacity-40"
            >
              View compatibility map →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
