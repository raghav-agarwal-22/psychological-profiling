'use client'

import Link from 'next/link'
import { useState } from 'react'
import { QuizUpgradeCard } from '@/components/QuizUpgradeCard'
import { RelatedQuizzes } from '@/components/RelatedQuizzes'

type Dimension =
  | 'selfAwareness'
  | 'selfRegulation'
  | 'motivation'
  | 'empathy'
  | 'socialSkills'

interface Question {
  text: string
  dimension: Dimension
}

const QUESTIONS: Question[] = [
  // Self-Awareness (6 questions)
  { text: 'I can identify my emotions accurately as I experience them.', dimension: 'selfAwareness' },
  { text: 'I understand how my moods affect my thoughts and behaviour.', dimension: 'selfAwareness' },
  { text: 'I am aware of my personal strengths and limitations.', dimension: 'selfAwareness' },
  { text: 'I reflect on what drives my reactions to situations.', dimension: 'selfAwareness' },
  { text: 'I notice when my emotions are influencing my decisions.', dimension: 'selfAwareness' },
  { text: 'I have a clear sense of my own values and priorities.', dimension: 'selfAwareness' },

  // Self-Regulation (6 questions)
  { text: 'I can calm myself down when I feel anxious or upset.', dimension: 'selfRegulation' },
  { text: 'I think before acting when I am feeling a strong emotion.', dimension: 'selfRegulation' },
  { text: 'I can control impulsive feelings and disruptive behaviours.', dimension: 'selfRegulation' },
  { text: 'I adapt well when circumstances change unexpectedly.', dimension: 'selfRegulation' },
  { text: 'I maintain my composure even under significant pressure.', dimension: 'selfRegulation' },
  { text: 'I take responsibility for my actions rather than blaming others.', dimension: 'selfRegulation' },

  // Motivation (6 questions)
  { text: 'I set challenging goals and work hard to achieve them.', dimension: 'motivation' },
  { text: 'I stay committed to my goals even when progress is slow.', dimension: 'motivation' },
  { text: 'I find intrinsic satisfaction in doing my work well.', dimension: 'motivation' },
  { text: 'I remain optimistic and persistent after setbacks.', dimension: 'motivation' },
  { text: 'I am driven by a deeper purpose beyond external rewards.', dimension: 'motivation' },
  { text: 'I take initiative rather than waiting to be told what to do.', dimension: 'motivation' },

  // Empathy (6 questions)
  { text: 'I can sense how others are feeling even when they do not say it.', dimension: 'empathy' },
  { text: 'I genuinely try to understand other people\'s perspectives.', dimension: 'empathy' },
  { text: 'I listen carefully to understand, not just to respond.', dimension: 'empathy' },
  { text: 'I notice when someone is uncomfortable in a social situation.', dimension: 'empathy' },
  { text: 'I adjust my communication based on others\' emotional state.', dimension: 'empathy' },
  { text: 'I feel concern when I see others struggling or in pain.', dimension: 'empathy' },

  // Social Skills (6 questions)
  { text: 'I find it easy to build rapport with new people.', dimension: 'socialSkills' },
  { text: 'I handle disagreements constructively without damaging relationships.', dimension: 'socialSkills' },
  { text: 'I can inspire and influence others toward a shared goal.', dimension: 'socialSkills' },
  { text: 'I communicate clearly and adapt my style to my audience.', dimension: 'socialSkills' },
  { text: 'I collaborate well and help bring out the best in teams.', dimension: 'socialSkills' },
  { text: 'I manage conflict effectively and find workable solutions.', dimension: 'socialSkills' },
]

const SCALE = [
  { label: 'Strongly Disagree', value: 1 },
  { label: 'Disagree', value: 2 },
  { label: 'Neutral', value: 3 },
  { label: 'Agree', value: 4 },
  { label: 'Strongly Agree', value: 5 },
]

const DIMENSIONS: Record<
  Dimension,
  {
    label: string
    subtitle: string
    color: string
    bar: string
    bg: string
    high: string
    low: string
    description: string
  }
> = {
  selfAwareness: {
    label: 'Self-Awareness',
    subtitle: 'Understanding your own emotions',
    color: 'text-violet-400',
    bar: 'bg-violet-500',
    bg: 'bg-violet-500/10 border-violet-500/30',
    high: 'highly attuned to your inner emotional world and personal values',
    low: 'still developing your ability to identify and reflect on your emotions',
    description:
      'Self-awareness is the foundation of emotional intelligence — the ability to recognise your emotions, understand how they affect your thinking, and maintain an accurate sense of your strengths and limits.',
  },
  selfRegulation: {
    label: 'Self-Regulation',
    subtitle: 'Managing your emotional responses',
    color: 'text-sky-400',
    bar: 'bg-sky-500',
    bg: 'bg-sky-500/10 border-sky-500/30',
    high: 'skilled at managing disruptive impulses and staying composed under pressure',
    low: 'sometimes reactive under stress or when managing strong emotions',
    description:
      'Self-regulation is your capacity to manage disruptive emotions and impulses, think before you act, adapt to change, and take responsibility for your behaviour — even in difficult situations.',
  },
  motivation: {
    label: 'Motivation',
    subtitle: 'Drive, optimism, and persistence',
    color: 'text-amber-400',
    bar: 'bg-amber-500',
    bg: 'bg-amber-500/10 border-amber-500/30',
    high: 'intrinsically driven, optimistic, and persistent in the face of setbacks',
    low: 'still cultivating the inner drive that sustains effort beyond external reward',
    description:
      'Emotional motivation reflects your ability to pursue goals with energy and persistence, stay optimistic in the face of failure, and be guided by an inner sense of purpose rather than external validation.',
  },
  empathy: {
    label: 'Empathy',
    subtitle: 'Reading and feeling others\' emotions',
    color: 'text-rose-400',
    bar: 'bg-rose-500',
    bg: 'bg-rose-500/10 border-rose-500/30',
    high: 'deeply attuned to others\' emotional states and genuinely compassionate',
    low: 'still building your ability to sense and respond to others\' feelings',
    description:
      'Empathy is the ability to read emotional cues, understand other people\'s perspectives, and genuinely feel concern for them. It forms the bridge between your inner emotional world and your relationships.',
  },
  socialSkills: {
    label: 'Social Skills',
    subtitle: 'Building and managing relationships',
    color: 'text-emerald-400',
    bar: 'bg-emerald-500',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    high: 'adept at building relationships, influencing others, and navigating social complexity',
    low: 'developing the interpersonal skills to lead, collaborate, and manage conflict well',
    description:
      'Social skills translate emotional intelligence into effective action — building rapport, communicating clearly, resolving conflict, and inspiring and influencing others toward shared goals.',
  },
}

type Scores = Record<Dimension, number>
type Counts = Record<Dimension, number>

const DIMENSION_ORDER: Dimension[] = [
  'selfAwareness',
  'selfRegulation',
  'motivation',
  'empathy',
  'socialSkills',
]

function getDimScore(raw: number, count: number): number {
  if (count === 0) return 50
  return Math.round((raw / (count * 5)) * 100)
}

function getOverallEQ(scores: Scores, counts: Counts): number {
  const total = DIMENSION_ORDER.reduce((sum, d) => sum + getDimScore(scores[d], counts[d]), 0)
  return Math.round(total / DIMENSION_ORDER.length)
}

function getEQLabel(overall: number): { title: string; summary: string } {
  if (overall >= 85) {
    return {
      title: 'Exceptional EQ',
      summary:
        'You demonstrate a high level of emotional intelligence across all five dimensions. You are self-aware, regulated, and deeply attuned to others — qualities that drive exceptional leadership, meaningful relationships, and resilience under pressure.',
    }
  }
  if (overall >= 70) {
    return {
      title: 'High EQ',
      summary:
        'Your emotional intelligence is well-developed. You are generally self-aware, manage your reactions effectively, and can read and influence people with skill. Most interactions are enriched by your emotional attunement.',
    }
  }
  if (overall >= 55) {
    return {
      title: 'Developing EQ',
      summary:
        'You have a solid emotional foundation with clear areas of strength, alongside dimensions where you are still growing. With intentional practice, you can build a more complete and integrated EQ profile.',
    }
  }
  return {
    title: 'Building EQ',
    summary:
      'Your emotional intelligence is at an early stage of development. This is simply a starting point — EQ is one of the most learnable of all human capacities, and awareness of these gaps is itself the first step.',
  }
}

function getDimDescription(dimension: Dimension, pct: number): string {
  const d = DIMENSIONS[dimension]
  if (pct >= 65) return `Your ${d.label} score of ${pct}% suggests you are ${d.high}.`
  if (pct <= 40) return `Your ${d.label} score of ${pct}% suggests you are ${d.low}.`
  return `Your ${d.label} score of ${pct}% is in the moderate range — a blend of strength and opportunity for growth.`
}

function getStrengthsAndGrowth(
  percentages: { dimension: Dimension; pct: number }[],
): { strengths: Dimension[]; growth: Dimension[] } {
  const sorted = [...percentages].sort((a, b) => b.pct - a.pct)
  return {
    strengths: sorted.slice(0, 2).map((x) => x.dimension),
    growth: sorted.slice(-2).map((x) => x.dimension),
  }
}

export default function EQQuiz() {
  const [started, setStarted] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [scores, setScores] = useState<Scores>({
    selfAwareness: 0,
    selfRegulation: 0,
    motivation: 0,
    empathy: 0,
    socialSkills: 0,
  })
  const [counts, setCounts] = useState<Counts>({
    selfAwareness: 0,
    selfRegulation: 0,
    motivation: 0,
    empathy: 0,
    socialSkills: 0,
  })
  const [done, setDone] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)

  function handleAnswer(value: number) {
    const dimension = QUESTIONS[currentQ].dimension
    const newScores = { ...scores, [dimension]: scores[dimension] + value }
    const newCounts = { ...counts, [dimension]: counts[dimension] + 1 }
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
    setScores({ selfAwareness: 0, selfRegulation: 0, motivation: 0, empathy: 0, socialSkills: 0 })
    setCounts({ selfAwareness: 0, selfRegulation: 0, motivation: 0, empathy: 0, socialSkills: 0 })
    setDone(false)
    setEmail('')
    setEmailSubmitted(false)
  }

  // Landing screen
  if (!started) {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Quiz',
      name: 'Free Emotional Intelligence (EQ) Test',
      description:
        'A free 30-question Emotional Intelligence test based on Daniel Goleman\'s EQ model. Measure your Self-Awareness, Self-Regulation, Motivation, Empathy, and Social Skills with instant results. No signup required.',
      url: 'https://innermind.app/quiz/eq',
      educationalLevel: 'beginner',
      timeRequired: 'PT4M',
      numberOfQuestions: 30,
      about: { '@type': 'Thing', name: 'Emotional Intelligence (EQ) — Goleman Model' },
      author: { '@type': 'Organization', name: 'Innermind', url: 'https://innermind.app' },
      provider: { '@type': 'Organization', name: 'Innermind', url: 'https://innermind.app' },
    }

    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4 py-16">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="max-w-xl w-full text-center space-y-8">
          <div className="space-y-2">
            <p className="text-teal-400 text-sm font-medium tracking-widest uppercase">Free Quiz</p>
            <h1 className="text-4xl font-bold tracking-tight">Free Emotional Intelligence Test</h1>
            <p className="text-white/60 text-lg mt-4">
              30 questions. Instant results. No signup required.
            </p>
            <p className="text-white/40 text-sm">
              Based on Daniel Goleman&apos;s five-dimension EQ model — the gold standard in emotional intelligence research.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 text-left">
            {DIMENSION_ORDER.map((key) => {
              const d = DIMENSIONS[key]
              return (
                <div key={key} className={`rounded-xl border p-4 flex items-center gap-4 ${d.bg}`}>
                  <div className={`w-2 h-8 rounded-full ${d.bar} flex-shrink-0`} />
                  <div>
                    <p className={`font-semibold text-sm ${d.color}`}>{d.label}</p>
                    <p className="text-white/50 text-xs mt-0.5">{d.subtitle}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <button
            onClick={() => setStarted(true)}
            className="w-full bg-teal-600 hover:bg-teal-500 transition-colors text-white font-semibold py-4 rounded-xl text-lg"
          >
            Start the Test &rarr;
          </button>

          <p className="text-white/30 text-xs">
            Based on Goleman&apos;s Emotional Intelligence model (1995). Takes about 4 minutes.
          </p>
        </div>
      </div>
    )
  }

  // Results screen
  if (done) {
    const percentages = DIMENSION_ORDER.map((d) => ({
      dimension: d,
      pct: getDimScore(scores[d], counts[d]),
    }))
    const overall = getOverallEQ(scores, counts)
    const eqLabel = getEQLabel(overall)
    const { strengths, growth } = getStrengthsAndGrowth(percentages)

    const shareText = `I scored ${overall}% on the Emotional Intelligence test (${eqLabel.title}). My top EQ strength: ${DIMENSIONS[strengths[0]].label}.`

    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full space-y-8">

          {/* Overall EQ hero */}
          <div className="text-center space-y-3">
            <p className="text-white/40 text-sm uppercase tracking-widest">Your EQ Score</p>
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="10"
                />
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke="rgb(20 184 166)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - overall / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-4xl font-black text-teal-400">{overall}</span>
                <span className="block text-white/40 text-xs">/ 100</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-teal-400">{eqLabel.title}</h1>
          </div>

          {/* EQ summary */}
          <div className="rounded-2xl border border-teal-500/30 bg-teal-500/10 p-6 space-y-2">
            <p className="text-teal-400 text-xs font-medium tracking-widest uppercase">Overall Profile</p>
            <p className="text-white/80 text-sm leading-relaxed">{eqLabel.summary}</p>
          </div>

          {/* Dimension bar charts */}
          <div className="space-y-4">
            <p className="text-white/40 text-xs uppercase tracking-widest">Dimension Breakdown</p>
            {percentages.map(({ dimension, pct }) => {
              const d = DIMENSIONS[dimension]
              return (
                <div key={dimension} className={`rounded-xl border p-5 ${d.bg}`}>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className={`font-semibold text-sm ${d.color}`}>{d.label}</span>
                    <span className={`text-xl font-bold ${d.color}`}>{pct}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                    <div
                      className={`${d.bar} h-2 rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-white/60 text-xs leading-relaxed mb-2">
                    {getDimDescription(dimension, pct)}
                  </p>
                  <p className="text-white/40 text-xs leading-relaxed">{d.description}</p>
                </div>
              )
            })}
          </div>

          {/* Strengths & Growth areas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2">
              <p className="text-emerald-400 text-xs font-medium tracking-widest uppercase">Your Strengths</p>
              {strengths.map((d) => (
                <p key={d} className="text-white/70 text-sm font-medium">{DIMENSIONS[d].label}</p>
              ))}
            </div>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2">
              <p className="text-amber-400 text-xs font-medium tracking-widest uppercase">Growth Areas</p>
              {growth.map((d) => (
                <p key={d} className="text-white/70 text-sm font-medium">{DIMENSIONS[d].label}</p>
              ))}
            </div>
          </div>

          {/* Share hook */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
            <p className="text-white/60 text-sm font-medium">Compare your EQ with friends</p>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ text: shareText, url: window.location.href })
                } else {
                  navigator.clipboard.writeText(`${shareText}\n\nTake the test: ${window.location.href}`)
                }
              }}
              className="w-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium py-3 rounded-lg text-sm transition-colors"
            >
              Share My Results
            </button>
          </div>

          {/* Email capture / upsell */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <p className="text-white/60 text-sm">
              Your EQ score is one dimension of your psychological makeup.
            </p>
            <p className="text-white font-medium">
              Discover how your emotional intelligence connects to your Big Five personality, attachment style, Enneagram type, and Jungian archetypes — synthesised by AI into a complete psychological portrait.
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
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-teal-500 min-h-[44px]"
                />
                <button
                  type="submit"
                  disabled={emailLoading || !email}
                  className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 transition-colors text-white font-semibold py-3 rounded-lg"
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
            quizName="EQ"
            teaserText="Your emotional intelligence scores show where you stand — but your full portrait explains why you score this way and gives you a personalized growth plan rooted in your personality, attachment style, and core psychology."
            freeItems={[
              'EQ scores across 5 dimensions',
              'Generic high/low descriptions',
              'No explanation of underlying causes',
            ]}
            proItems={[
              'What limits your EQ — specific patterns traced to your personality',
              'EQ × Big Five: why you score this way',
              'Your emotional regulation blind spots and triggers',
              'Personalized EQ growth plan for your profile',
              'How your EQ affects relationships and career outcomes',
              'Full 7-framework AI portrait with unlimited coach access',
            ]}
          />

          <RelatedQuizzes currentQuiz="eq" />

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
  const d = DIMENSIONS[question.dimension]
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
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Dimension badge */}
        <div className="flex justify-center">
          <span className={`text-xs font-medium tracking-widest uppercase ${d.color} px-3 py-1 rounded-full border ${d.bg}`}>
            {d.label}
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
                className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-teal-500/50 rounded-xl px-5 py-4 text-white/80 hover:text-white transition-all duration-150 flex items-center gap-4"
              >
                <span className="w-6 h-6 rounded-full border-2 border-white/20 flex items-center justify-center text-xs font-bold flex-shrink-0">
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
