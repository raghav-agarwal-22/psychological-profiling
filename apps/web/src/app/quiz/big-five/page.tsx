'use client'

import Link from 'next/link'
import { useState } from 'react'
import { QuizUpgradeCard } from '@/components/QuizUpgradeCard'

type Trait = 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism'

interface Question {
  text: string
  trait: Trait
}

const QUESTIONS: Question[] = [
  // Openness
  { text: 'I enjoy trying new experiences.', trait: 'openness' },
  { text: 'I have a vivid imagination.', trait: 'openness' },
  { text: 'I enjoy thinking about abstract ideas.', trait: 'openness' },
  { text: 'I am interested in art, music, or culture.', trait: 'openness' },
  // Conscientiousness
  { text: 'I keep my belongings organised.', trait: 'conscientiousness' },
  { text: 'I follow through on my plans.', trait: 'conscientiousness' },
  { text: 'People would describe me as reliable.', trait: 'conscientiousness' },
  { text: 'I pay close attention to detail.', trait: 'conscientiousness' },
  // Extraversion
  { text: 'I feel energised when I am around other people.', trait: 'extraversion' },
  { text: 'I enjoy being the centre of attention.', trait: 'extraversion' },
  { text: 'I find it easy to start conversations with strangers.', trait: 'extraversion' },
  { text: 'I am talkative in social situations.', trait: 'extraversion' },
  // Agreeableness
  { text: 'I care deeply about others\' feelings.', trait: 'agreeableness' },
  { text: 'I try to avoid conflict with others.', trait: 'agreeableness' },
  { text: 'I tend to trust people.', trait: 'agreeableness' },
  { text: 'I help others without expecting anything back.', trait: 'agreeableness' },
  // Neuroticism
  { text: 'I worry about things often.', trait: 'neuroticism' },
  { text: 'I get stressed easily.', trait: 'neuroticism' },
  { text: 'My mood changes frequently.', trait: 'neuroticism' },
  { text: 'I am sensitive to criticism.', trait: 'neuroticism' },
]

const SCALE = [
  { label: 'Strongly Disagree', value: 1 },
  { label: 'Disagree', value: 2 },
  { label: 'Neutral', value: 3 },
  { label: 'Agree', value: 4 },
  { label: 'Strongly Agree', value: 5 },
]

const TRAITS: Record<
  Trait,
  { label: string; color: string; bar: string; bg: string; high: string; low: string }
> = {
  openness: {
    label: 'Openness',
    color: 'text-violet-400',
    bar: 'bg-violet-500',
    bg: 'bg-violet-500/10 border-violet-500/30',
    high: 'highly curious, creative, and open to new ideas',
    low: 'practical, grounded, and preferring the familiar',
  },
  conscientiousness: {
    label: 'Conscientiousness',
    color: 'text-emerald-400',
    bar: 'bg-emerald-500',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    high: 'organised, reliable, and disciplined',
    low: 'flexible, spontaneous, and adaptable',
  },
  extraversion: {
    label: 'Extraversion',
    color: 'text-amber-400',
    bar: 'bg-amber-500',
    bg: 'bg-amber-500/10 border-amber-500/30',
    high: 'sociable, energetic, and outgoing',
    low: 'reflective, reserved, and independent',
  },
  agreeableness: {
    label: 'Agreeableness',
    color: 'text-sky-400',
    bar: 'bg-sky-500',
    bg: 'bg-sky-500/10 border-sky-500/30',
    high: 'cooperative, trusting, and compassionate',
    low: 'direct, competitive, and objective',
  },
  neuroticism: {
    label: 'Neuroticism',
    color: 'text-rose-400',
    bar: 'bg-rose-500',
    bg: 'bg-rose-500/10 border-rose-500/30',
    high: 'emotionally sensitive and prone to stress',
    low: 'calm, stable, and emotionally resilient',
  },
}

type Scores = Record<Trait, number>
type Counts = Record<Trait, number>

function getTraitScore(raw: number, count: number): number {
  if (count === 0) return 50
  return Math.round((raw / (count * 5)) * 100)
}

function getDescription(trait: Trait, pct: number): string {
  const t = TRAITS[trait]
  const level = pct >= 60 ? 'high' : pct <= 40 ? 'low' : 'moderate'
  if (level === 'high') return `Your ${t.label} score of ${pct}% suggests you are ${t.high}.`
  if (level === 'low') return `Your ${t.label} score of ${pct}% suggests you tend to be ${t.low}.`
  return `Your ${t.label} score of ${pct}% places you in the middle range — a blend of both tendencies.`
}

export default function BigFiveQuiz() {
  const [started, setStarted] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [scores, setScores] = useState<Scores>({
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0,
  })
  const [counts, setCounts] = useState<Counts>({
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0,
  })
  const [done, setDone] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)

  function handleAnswer(value: number) {
    const trait = QUESTIONS[currentQ].trait
    const newScores = { ...scores, [trait]: scores[trait] + value }
    const newCounts = { ...counts, [trait]: counts[trait] + 1 }
    setScores(newScores)
    setCounts(newCounts)

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
    setScores({ openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 })
    setCounts({ openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 })
    setDone(false)
    setEmail('')
    setEmailSubmitted(false)
  }

  // Landing screen
  if (!started) {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Quiz',
      name: 'Free Big Five Personality Test (OCEAN)',
      description: 'A free 20-question Big Five (OCEAN) personality test. Measure your Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism with instant results. No signup required.',
      url: 'https://innermind.app/quiz/big-five',
      educationalLevel: 'beginner',
      timeRequired: 'PT3M',
      numberOfQuestions: 20,
      about: { '@type': 'Thing', name: 'Big Five Personality Traits (OCEAN)' },
      author: { '@type': 'Organization', name: 'Innermind', url: 'https://innermind.app' },
      provider: { '@type': 'Organization', name: 'Innermind', url: 'https://innermind.app' },
    }

    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4 py-16">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="max-w-xl w-full text-center space-y-8">
          <div className="space-y-2">
            <p className="text-violet-400 text-sm font-medium tracking-widest uppercase">Free Quiz</p>
            <h1 className="text-4xl font-bold tracking-tight">Free Big Five Personality Test</h1>
            <p className="text-white/60 text-lg mt-4">
              20 questions. Instant results. No signup required.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 text-left">
            {(Object.entries(TRAITS) as [Trait, typeof TRAITS[Trait]][]).map(([key, t]) => (
              <div key={key} className={`rounded-xl border p-4 flex items-center gap-4 ${t.bg}`}>
                <div className={`w-2 h-8 rounded-full ${t.bar} flex-shrink-0`} />
                <div>
                  <p className={`font-semibold text-sm ${t.color}`}>{t.label}</p>
                  <p className="text-white/50 text-xs mt-0.5">How {t.high.split(',')[0]}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStarted(true)}
            className="w-full bg-violet-600 hover:bg-violet-500 transition-colors text-white font-semibold py-4 rounded-xl text-lg"
          >
            Start the Test &rarr;
          </button>

          <p className="text-white/30 text-xs">
            Based on the validated Big Five (OCEAN) personality model. Takes about 3 minutes.
          </p>
        </div>
      </div>
    )
  }

  // Results screen
  if (done) {
    const traitOrder: Trait[] = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']
    const percentages = traitOrder.map((t) => ({
      trait: t,
      pct: getTraitScore(scores[t], counts[t]),
    }))

    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full space-y-8">
          <div className="text-center space-y-2">
            <p className="text-white/40 text-sm uppercase tracking-widest">Your Big Five Results</p>
            <h1 className="text-3xl font-bold">Your Personality Profile</h1>
            <p className="text-white/50 text-sm">OCEAN model — scored from 0–100</p>
          </div>

          {/* Bar charts */}
          <div className="space-y-4">
            {percentages.map(({ trait, pct }) => {
              const t = TRAITS[trait]
              return (
                <div key={trait} className={`rounded-xl border p-5 ${t.bg}`}>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className={`font-semibold text-sm ${t.color}`}>{t.label}</span>
                    <span className={`text-xl font-bold ${t.color}`}>{pct}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                    <div
                      className={`${t.bar} h-2 rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-white/60 text-xs leading-relaxed">{getDescription(trait, pct)}</p>
                </div>
              )
            })}
          </div>

          {/* Upsell / email capture */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <p className="text-white/60 text-sm">
              Your Big Five is just one piece of your psychological makeup.
            </p>
            <p className="text-white font-medium">
              Your full profile includes an AI synthesis connecting all 5 traits, plus Enneagram type, attachment style, Jungian archetypes, and core values.
            </p>

            {!emailSubmitted ? (
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email me my full results"
                  autoComplete="email"
                  inputMode="email"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-violet-500 min-h-[44px]"
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

          <QuizUpgradeCard
            quizName="Big Five"
            teaserText="Your OCEAN scores reveal your trait profile — but how do they interact with your attachment style, core values, and deeper motivations? The full AI portrait connects the dots across 7 frameworks to show you the complete picture."
            freeItems={[
              '5 trait scores (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism)',
              'Single-sentence trait descriptions',
              'One framework — no cross-model context',
            ]}
            proItems={[
              'How your Big Five traits drive career and relationship patterns',
              'Trait conflict analysis (e.g. high Openness + high Neuroticism)',
              'Cross-framework synthesis: Enneagram, Attachment, DISC + 4 more',
              'Shadow traits and psychological blind spots',
              'Personalized growth path based on your specific trait profile',
              'AI portrait written in your own psychological language',
            ]}
          />

          <button
            onClick={handleRetake}
            className="w-full text-white/40 hover:text-white/60 text-sm transition-colors py-3 min-h-[44px]"
          >
            Retake the test
          </button>
        </div>
      </div>
    )
  }

  // Quiz screen
  const question = QUESTIONS[currentQ]
  const progress = (currentQ / QUESTIONS.length) * 100
  const t = TRAITS[question.trait]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center px-4 pt-10 pb-16">
      <div className="max-w-xl w-full space-y-8">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-white/40">
            <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-violet-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Trait badge */}
        <div className="flex justify-center">
          <span className={`text-xs font-medium tracking-widest uppercase ${t.color} px-3 py-1 rounded-full border ${t.bg}`}>
            {t.label}
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
                <span className={`w-6 h-6 rounded-full border-2 border-white/20 flex items-center justify-center text-xs font-bold flex-shrink-0 ${t.bar} bg-opacity-0`}>
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
