'use client'

import Link from 'next/link'
import { useState } from 'react'

type Dimension = 'D' | 'I' | 'S' | 'C'

interface Question {
  text: string
  dimension: Dimension
}

const QUESTIONS: Question[] = [
  // Dominance — direct, results-oriented, decisive, competitive
  { text: 'I prefer to take charge and lead when working in a group.', dimension: 'D' },
  { text: 'I am comfortable making quick decisions under pressure.', dimension: 'D' },
  { text: 'I enjoy challenges and see obstacles as things to overcome.', dimension: 'D' },
  { text: 'I am direct and get straight to the point in conversations.', dimension: 'D' },
  { text: 'I would rather make a bold decision and be wrong than not decide at all.', dimension: 'D' },
  { text: 'I am driven by results more than relationships.', dimension: 'D' },
  { text: 'I am competitive and dislike losing.', dimension: 'D' },
  // Influence — enthusiastic, optimistic, collaborative, persuasive
  { text: 'I energise the room and enjoy being around people.', dimension: 'I' },
  { text: 'I find it easy to persuade others to my point of view.', dimension: 'I' },
  { text: 'I am known as an enthusiastic and positive person.', dimension: 'I' },
  { text: 'I enjoy collaborating and brainstorming ideas with others.', dimension: 'I' },
  { text: 'I build rapport with new people very quickly.', dimension: 'I' },
  { text: 'I prefer talking through ideas rather than writing them down.', dimension: 'I' },
  { text: 'I get excited by new opportunities and possibilities.', dimension: 'I' },
  // Steadiness — patient, reliable, calm, supportive
  { text: 'I prefer a stable, predictable environment over constant change.', dimension: 'S' },
  { text: 'I am patient and take time to listen to others carefully.', dimension: 'S' },
  { text: 'I am loyal and committed to the people and organisations I care about.', dimension: 'S' },
  { text: 'I work at a steady pace rather than rushing.', dimension: 'S' },
  { text: 'I find it hard to say no when someone needs my help.', dimension: 'S' },
  { text: 'I prefer to finish one thing before starting the next.', dimension: 'S' },
  { text: 'I value harmony and try to avoid unnecessary conflict.', dimension: 'S' },
  // Conscientiousness — analytical, accurate, systematic, quality-focused
  { text: 'I pay close attention to accuracy and quality in my work.', dimension: 'C' },
  { text: 'I prefer to have all the facts before making a decision.', dimension: 'C' },
  { text: 'I follow established rules and procedures carefully.', dimension: 'C' },
  { text: 'I am systematic and think through problems step by step.', dimension: 'C' },
  { text: 'I set high standards for myself and others.', dimension: 'C' },
  { text: 'I prefer working independently over working in groups.', dimension: 'C' },
  { text: 'I like having a clear plan with well-defined expectations.', dimension: 'C' },
]

const SCALE = [
  { label: 'Strongly Disagree', value: 1 },
  { label: 'Disagree', value: 2 },
  { label: 'Neutral', value: 3 },
  { label: 'Agree', value: 4 },
  { label: 'Strongly Agree', value: 5 },
]

const DIMENSION_INFO: Record<
  Dimension,
  { label: string; full: string; color: string; bar: string; bg: string; tagline: string }
> = {
  D: {
    label: 'D',
    full: 'Dominance',
    color: 'text-rose-400',
    bar: 'bg-rose-500',
    bg: 'bg-rose-500/10 border-rose-500/30',
    tagline: 'Direct, decisive, and results-driven',
  },
  I: {
    label: 'I',
    full: 'Influence',
    color: 'text-amber-400',
    bar: 'bg-amber-500',
    bg: 'bg-amber-500/10 border-amber-500/30',
    tagline: 'Enthusiastic, persuasive, and people-oriented',
  },
  S: {
    label: 'S',
    full: 'Steadiness',
    color: 'text-emerald-400',
    bar: 'bg-emerald-500',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    tagline: 'Patient, loyal, and team-focused',
  },
  C: {
    label: 'C',
    full: 'Conscientiousness',
    color: 'text-sky-400',
    bar: 'bg-sky-500',
    bg: 'bg-sky-500/10 border-sky-500/30',
    tagline: 'Analytical, systematic, and quality-driven',
  },
}

const STYLE_DESCRIPTIONS: Record<
  Dimension,
  { strengths: string; challenges: string; description: string }
> = {
  D: {
    description:
      'You are action-oriented and thrive on accomplishment. You take initiative, push through obstacles, and have a strong drive to reach your goals. In teams you are the person who moves things forward — but can sometimes move too fast for others.',
    strengths: 'Bold decisions, taking initiative, cutting through noise to results',
    challenges: 'Impatience, overlooking others\' feelings, tendency to bulldoze',
  },
  I: {
    description:
      'You are a natural connector who brings energy, optimism, and enthusiasm to everything you touch. You inspire others and love to collaborate. Your ability to read a room and build rapport makes you a powerful communicator and motivator.',
    strengths: 'Building relationships, inspiring teams, communicating vision',
    challenges: 'Following through on details, staying focused, over-promising',
  },
  S: {
    description:
      'You are the steady heartbeat of any team. Reliable, calm under pressure, and deeply loyal, you create stability for everyone around you. You listen before you speak and follow through on every commitment you make.',
    strengths: 'Dependability, active listening, maintaining team cohesion',
    challenges: 'Embracing change, asserting your own needs, saying no',
  },
  C: {
    description:
      'You are a precision thinker who thrives on getting things right. You dig deep into data, follow structured processes, and hold yourself and others to a high standard. Your thoroughness and objectivity make you invaluable in complex, high-stakes work.',
    strengths: 'Accuracy, systematic analysis, maintaining quality standards',
    challenges: 'Analysis paralysis, perfectionism, opening up emotionally',
  },
}

interface ComboInfo {
  title: string
  description: string
}

const DISC_COMBINATIONS: Record<string, ComboInfo> = {
  D: { title: 'The Driver', description: 'Pure Drive: relentlessly focused on results. You move fast, decide quickly, and expect the same from others.' },
  I: { title: 'The Inspirer', description: 'Pure Influence: you live for connection and enthusiasm. The room lights up when you walk in.' },
  S: { title: 'The Supporter', description: 'Pure Steadiness: calm, dependable, and deeply loyal. You are the anchor people turn to in turbulent times.' },
  C: { title: 'The Analyst', description: 'Pure Conscientiousness: precise, thorough, and principled. You do not cut corners — ever.' },
  DI: { title: 'The Trailblazer', description: 'You combine bold ambition with magnetic charisma. You set the vision and inspire people to follow.' },
  ID: { title: 'The Trailblazer', description: 'Your enthusiasm is turbocharged by drive. You persuade boldly and move fast on your best ideas.' },
  DS: { title: 'The Achiever', description: 'You push hard for results while keeping people with you. Focused and persistent without burning bridges.' },
  SD: { title: 'The Achiever', description: 'Your steady reliability is backed by a quiet determination to get things done.' },
  DC: { title: 'The Perfectionist', description: 'You demand excellence — from yourself first. High standards, bold execution, no room for error.' },
  CD: { title: 'The Perfectionist', description: 'You pair analytical precision with a strong drive to act. You think before you leap — then leap decisively.' },
  IS: { title: 'The Collaborator', description: 'You are warm, encouraging, and team-first. People trust you because you genuinely care about them.' },
  SI: { title: 'The Collaborator', description: 'Your calm warmth is energised by genuine enthusiasm for people. A trusted confidant and motivator.' },
  IC: { title: 'The Influencer-Analyst', description: 'You blend social energy with intellectual depth. You can inspire the room and then back it up with data.' },
  CI: { title: 'The Influencer-Analyst', description: 'Your analytical mind is complemented by real people skills. You persuade through evidence and warmth.' },
  SC: { title: 'The Thoughtful Expert', description: 'Patient and precise: you take your time, get it right, and never over-promise. Quiet but formidably competent.' },
  CS: { title: 'The Thoughtful Expert', description: 'Your systematic rigour is softened by genuine care for people. You produce excellent work without leaving anyone behind.' },
}

type DimScores = Record<Dimension, number>

function getDimPct(scores: DimScores, dim: Dimension): number {
  const qCount = QUESTIONS.filter((q) => q.dimension === dim).length
  if (qCount === 0) return 0
  return Math.round((scores[dim] / (qCount * 5)) * 100)
}

function computeDiscProfile(scores: DimScores): { primary: Dimension; secondary: Dimension | null; code: string } {
  const dims: Dimension[] = ['D', 'I', 'S', 'C']
  const sorted = dims.slice().sort((a, b) => getDimPct(scores, b) - getDimPct(scores, a))
  const primary = sorted[0]
  const secondaryPct = getDimPct(scores, sorted[1])
  const primaryPct = getDimPct(scores, primary)
  // Only show secondary if it is within 15 points and above 50%
  const secondary = secondaryPct >= 50 && primaryPct - secondaryPct <= 25 ? sorted[1] : null
  const code = secondary ? `${primary}${secondary}` : primary
  return { primary, secondary, code }
}

export default function DISCQuiz() {
  const [started, setStarted] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [scores, setScores] = useState<DimScores>({ D: 0, I: 0, S: 0, C: 0 })
  const [done, setDone] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)

  function handleAnswer(value: number) {
    const dim = QUESTIONS[currentQ].dimension
    const newScores = { ...scores, [dim]: scores[dim] + value }
    setScores(newScores)

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      setDone(true)
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setEmailLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
      await fetch(`${apiUrl}/api/auth/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setEmailSubmitted(true)
    } catch {
      setEmailSubmitted(true)
    } finally {
      setEmailLoading(false)
    }
  }

  function handleRetake() {
    setStarted(false)
    setCurrentQ(0)
    setScores({ D: 0, I: 0, S: 0, C: 0 })
    setDone(false)
    setEmail('')
    setEmailSubmitted(false)
  }

  // ── Landing screen ───────────────────────────────────────────────────────────
  if (!started) {
    const dims: Dimension[] = ['D', 'I', 'S', 'C']
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full text-center space-y-8">
          <div className="space-y-2">
            <p className="text-violet-400 text-sm font-medium tracking-widest uppercase">Free Quiz</p>
            <h1 className="text-4xl font-bold tracking-tight">Free DISC Personality Test</h1>
            <p className="text-white/60 text-lg mt-4">
              28 questions. Instant results. No signup required.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 text-left">
            {dims.map((dim) => {
              const d = DIMENSION_INFO[dim]
              return (
                <div key={dim} className={`rounded-xl border p-4 flex items-center gap-4 ${d.bg}`}>
                  <div className={`w-10 h-10 rounded-full ${d.bar} flex items-center justify-center text-white font-black text-lg flex-shrink-0`}>
                    {dim}
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${d.color}`}>{d.full}</p>
                    <p className="text-white/50 text-xs mt-0.5">{d.tagline}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <button
            onClick={() => setStarted(true)}
            className="w-full bg-violet-600 hover:bg-violet-500 transition-colors text-white font-semibold py-4 rounded-xl text-lg"
          >
            Start the Test &rarr;
          </button>

          <p className="text-white/30 text-xs">
            Based on the validated DISC behavioural model. Used in workplaces worldwide. Takes about 4 minutes.
          </p>
        </div>
      </div>
    )
  }

  // ── Results screen ───────────────────────────────────────────────────────────
  if (done) {
    const dims: Dimension[] = ['D', 'I', 'S', 'C']
    const { primary, secondary, code } = computeDiscProfile(scores)
    const primaryInfo = DIMENSION_INFO[primary]
    const primaryStyle = STYLE_DESCRIPTIONS[primary]
    const combo = DISC_COMBINATIONS[code] ?? DISC_COMBINATIONS[primary]

    const dPct = getDimPct(scores, 'D')
    const iPct = getDimPct(scores, 'I')
    const sPct = getDimPct(scores, 'S')
    const cPct = getDimPct(scores, 'C')

    const shareText = `My DISC profile is "${combo.title}" (${code}) — D:${dPct}% I:${iPct}% S:${sPct}% C:${cPct}%. Take the free DISC test:`

    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full space-y-8">

          {/* Profile hero */}
          <div className={`rounded-2xl border p-8 text-center space-y-3 ${primaryInfo.bg}`}>
            <p className="text-white/40 text-sm uppercase tracking-widest">Your DISC Profile</p>
            <div className={`text-6xl font-black tracking-tight ${primaryInfo.color}`}>{code}</div>
            <div className={`text-xl font-semibold ${primaryInfo.color}`}>{combo.title}</div>
            <p className="text-white/70 text-sm leading-relaxed">{combo.description}</p>
          </div>

          {/* Bar charts */}
          <div className="space-y-4">
            <p className="text-white/40 text-xs uppercase tracking-widest">Your Dimension Scores</p>
            {dims.map((dim) => {
              const d = DIMENSION_INFO[dim]
              const pct = getDimPct(scores, dim)
              const isPrimary = dim === primary
              const isSecondary = secondary !== null && dim === secondary
              return (
                <div key={dim} className={`rounded-xl border p-5 ${d.bg}`}>
                  <div className="flex justify-between items-baseline mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-base ${d.color}`}>{d.full}</span>
                      {isPrimary && (
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${d.bg} ${d.color}`}>
                          Primary
                        </span>
                      )}
                      {isSecondary && (
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${d.bg} ${d.color}`}>
                          Secondary
                        </span>
                      )}
                    </div>
                    <span className={`text-xl font-bold ${d.color}`}>{pct}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                    <div
                      className={`${d.bar} h-2 rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-white/60 text-xs leading-relaxed">{STYLE_DESCRIPTIONS[dim].description}</p>
                </div>
              )
            })}
          </div>

          {/* Strengths & challenges for primary style */}
          <div className={`rounded-2xl border p-6 space-y-4 ${primaryInfo.bg}`}>
            <p className={`text-xs font-medium tracking-widest uppercase ${primaryInfo.color}`}>
              {primaryInfo.full} Style — Strengths & Challenges
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Core Strengths</p>
                <p className="text-white/80 text-sm leading-relaxed">{primaryStyle.strengths}</p>
              </div>
              <div className="h-px bg-white/10" />
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Watch Out For</p>
                <p className="text-white/80 text-sm leading-relaxed">{primaryStyle.challenges}</p>
              </div>
            </div>
          </div>

          {/* Share hook */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
            <p className="text-white/60 text-sm font-medium">Compare your DISC style with your team</p>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ text: shareText, url: window.location.href })
                } else {
                  navigator.clipboard.writeText(`${shareText} ${window.location.href}`)
                }
              }}
              className="w-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium py-3 rounded-lg text-sm transition-colors"
            >
              Share My Results
            </button>
          </div>

          {/* Upsell / email capture */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <p className="text-white/60 text-sm">
              Your DISC profile captures how you behave — but not the full depth of who you are.
            </p>
            <p className="text-white font-medium">
              Innermind connects your DISC style with your Big Five, Enneagram type, attachment pattern, and Jungian archetypes — synthesised by AI into a complete psychological portrait.
            </p>

            {!emailSubmitted ? (
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email me my full results"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-violet-500"
                />
                <button
                  type="submit"
                  disabled={emailLoading || !email}
                  className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 transition-colors text-white font-semibold py-3 rounded-lg"
                >
                  {emailLoading ? 'Saving...' : 'Email me my results'}
                </button>
              </form>
            ) : (
              <p className="text-emerald-400 text-sm font-medium">
                We&apos;ll send you your full profile when Innermind launches.
              </p>
            )}

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-xs">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <Link
              href="/assessment"
              className="block w-full text-center bg-white text-black font-semibold py-3 rounded-lg hover:bg-white/90 transition-colors"
            >
              Get Your Full Psychological Portrait &rarr;
            </Link>
          </div>

          <button
            onClick={handleRetake}
            className="w-full text-white/40 hover:text-white/60 text-sm transition-colors"
          >
            Retake the test
          </button>
        </div>
      </div>
    )
  }

  // ── Quiz screen ──────────────────────────────────────────────────────────────
  const question = QUESTIONS[currentQ]
  const dim = DIMENSION_INFO[question.dimension]
  const progress = (currentQ / QUESTIONS.length) * 100

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full space-y-8">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-white/40">
            <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5">
            <div
              className="bg-violet-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Dimension badge */}
        <div className="flex justify-center">
          <span className={`text-xs font-medium tracking-widest uppercase ${dim.color} px-3 py-1 rounded-full border ${dim.bg}`}>
            {dim.full}
          </span>
        </div>

        {/* Question */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold leading-relaxed text-center">{question.text}</h2>

          <div className="space-y-3">
            {SCALE.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/50 rounded-xl px-5 py-4 text-white/80 hover:text-white transition-all duration-150 flex items-center gap-4"
              >
                <span className={`w-6 h-6 rounded-full border-2 border-white/20 flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                  {option.value}
                </span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
