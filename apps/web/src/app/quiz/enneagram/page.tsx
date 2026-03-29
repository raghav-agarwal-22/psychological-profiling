'use client'

import Link from 'next/link'
import { useState } from 'react'
import { QuizUpgradeCard } from '@/components/QuizUpgradeCard'

type EnneaType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

interface Question {
  text: string
  type: EnneaType
}

const QUESTIONS: Question[] = [
  // Type 1 — Reformer
  { text: 'I have a strong sense of right and wrong.', type: 1 },
  { text: 'I notice flaws others overlook.', type: 1 },
  { text: 'I hold myself to very high standards.', type: 1 },
  { text: 'I find it hard to relax when things are imperfect.', type: 1 },
  // Type 2 — Helper
  { text: 'I genuinely enjoy helping others.', type: 2 },
  { text: 'I am very attuned to other people\'s needs.', type: 2 },
  { text: 'I feel good when others need me.', type: 2 },
  { text: 'I sometimes neglect my own needs to help others.', type: 2 },
  // Type 3 — Achiever
  { text: 'I am driven to succeed.', type: 3 },
  { text: 'I adapt my image to what others expect.', type: 3 },
  { text: 'I work very hard to reach my goals.', type: 3 },
  { text: 'I care about how others perceive me.', type: 3 },
  // Type 4 — Individualist
  { text: 'I feel different from most people.', type: 4 },
  { text: 'I am drawn to melancholy and longing.', type: 4 },
  { text: 'I search for depth and authenticity.', type: 4 },
  { text: 'I have an intense inner emotional life.', type: 4 },
  // Type 5 — Investigator
  { text: 'I prefer observing to participating.', type: 5 },
  { text: 'I need lots of alone time to recharge.', type: 5 },
  { text: 'I protect my privacy carefully.', type: 5 },
  { text: 'I am comfortable with abstract and complex ideas.', type: 5 },
  // Type 6 — Loyalist
  { text: 'I seek security and reassurance from others.', type: 6 },
  { text: 'I am suspicious of authority figures.', type: 6 },
  { text: 'I am very loyal to those I trust.', type: 6 },
  { text: 'I anticipate problems before they occur.', type: 6 },
  // Type 7 — Enthusiast
  { text: 'I like to keep my options open.', type: 7 },
  { text: 'I strongly prefer positive experiences.', type: 7 },
  { text: 'I get bored easily with routines.', type: 7 },
  { text: 'I jump between projects and interests frequently.', type: 7 },
  // Type 8 — Challenger
  { text: 'I am direct and confrontational when needed.', type: 8 },
  { text: 'I like being in control of situations.', type: 8 },
  { text: 'I protect those who are weaker than me.', type: 8 },
  { text: 'I do not back down from conflict.', type: 8 },
  // Type 9 — Peacemaker
  { text: 'I avoid conflict whenever possible.', type: 9 },
  { text: 'I can easily see all sides of a situation.', type: 9 },
  { text: 'I often go along with what others want.', type: 9 },
  { text: 'I feel content and easygoing most of the time.', type: 9 },
]

const SCALE = [
  { label: 'Not at all like me', value: 1 },
  { label: 'Mostly unlike me', value: 2 },
  { label: 'Somewhat like me', value: 3 },
  { label: 'Mostly like me', value: 4 },
  { label: 'Very much like me', value: 5 },
]

const TYPE_INFO: Record<
  EnneaType,
  { name: string; color: string; bar: string; bg: string; description: string }
> = {
  1: {
    name: 'The Reformer',
    color: 'text-amber-400',
    bar: 'bg-amber-500',
    bg: 'bg-amber-500/10 border-amber-500/30',
    description:
      'You are principled, purposeful, and self-disciplined. You have an inner critic that pushes you toward your high standards — and an abiding sense that things could always be better. At your best, you channel this into wise, ethical leadership.',
  },
  2: {
    name: 'The Helper',
    color: 'text-rose-400',
    bar: 'bg-rose-500',
    bg: 'bg-rose-500/10 border-rose-500/30',
    description:
      'You are caring, interpersonally sensitive, and generous. You thrive when you feel needed and appreciated, and you naturally sense what others require. At your best, you give unconditionally without losing yourself.',
  },
  3: {
    name: 'The Achiever',
    color: 'text-orange-400',
    bar: 'bg-orange-500',
    bg: 'bg-orange-500/10 border-orange-500/30',
    description:
      'You are adaptable, excelling, and driven. You set ambitious goals and reshape your image to succeed in any arena. At your best, you inspire others through your authentic accomplishments and leadership.',
  },
  4: {
    name: 'The Individualist',
    color: 'text-violet-400',
    bar: 'bg-violet-500',
    bg: 'bg-violet-500/10 border-violet-500/30',
    description:
      'You are expressive, dramatic, and self-absorbed in the search for meaning. You feel different from others and long for what feels missing. At your best, you channel your depth into profound creativity and empathy.',
  },
  5: {
    name: 'The Investigator',
    color: 'text-sky-400',
    bar: 'bg-sky-500',
    bg: 'bg-sky-500/10 border-sky-500/30',
    description:
      'You are perceptive, innovative, and secretive. You need deep understanding before you act, and you carefully guard your inner world. At your best, you become a visionary thinker with penetrating insight.',
  },
  6: {
    name: 'The Loyalist',
    color: 'text-emerald-400',
    bar: 'bg-emerald-500',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    description:
      'You are committed, security-oriented, and engaging. You build loyal bonds and are alert to threats — real or imagined. At your best, you become deeply reliable and courageous in the face of fear.',
  },
  7: {
    name: 'The Enthusiast',
    color: 'text-yellow-400',
    bar: 'bg-yellow-500',
    bg: 'bg-yellow-500/10 border-yellow-500/30',
    description:
      'You are spontaneous, versatile, and scattered. You chase stimulation and possibilities to avoid pain. At your best, you combine joy and focus into grounded appreciation and remarkable productivity.',
  },
  8: {
    name: 'The Challenger',
    color: 'text-red-400',
    bar: 'bg-red-500',
    bg: 'bg-red-500/10 border-red-500/30',
    description:
      'You are self-confident, decisive, and confrontational. You assert yourself in the world and protect those you care about. At your best, you become a heroic, magnanimous leader who uses your power for others.',
  },
  9: {
    name: 'The Peacemaker',
    color: 'text-teal-400',
    bar: 'bg-teal-500',
    bg: 'bg-teal-500/10 border-teal-500/30',
    description:
      'You are receptive, reassuring, and agreeable. You see all sides and avoid conflict at the cost of your own priorities. At your best, you bring deep acceptance, stability, and healing presence to those around you.',
  },
}

const WING_ORDER: EnneaType[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function getWing(dominantType: EnneaType, scores: Record<EnneaType, number>): EnneaType {
  const idx = WING_ORDER.indexOf(dominantType)
  const left = WING_ORDER[(idx - 1 + 9) % 9]
  const right = WING_ORDER[(idx + 1) % 9]
  return scores[left] >= scores[right] ? left : right
}

export default function EnneagramQuiz() {
  const [started, setStarted] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [scores, setScores] = useState<Record<EnneaType, number>>({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0,
  })
  const [done, setDone] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)

  function handleAnswer(value: number) {
    const type = QUESTIONS[currentQ].type
    const newScores = { ...scores, [type]: scores[type] + value }
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
    setScores({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 })
    setDone(false)
    setEmail('')
    setEmailSubmitted(false)
  }

  // Landing screen
  if (!started) {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Quiz',
      name: 'Free Enneagram Personality Test',
      description: 'A free 36-question Enneagram test. Find your Enneagram type and wing from the 9-type model. Instant results with full type descriptions. No signup required.',
      url: 'https://innermind.app/quiz/enneagram',
      educationalLevel: 'beginner',
      timeRequired: 'PT5M',
      numberOfQuestions: 36,
      about: { '@type': 'Thing', name: 'Enneagram' },
      author: { '@type': 'Organization', name: 'Innermind', url: 'https://innermind.app' },
      provider: { '@type': 'Organization', name: 'Innermind', url: 'https://innermind.app' },
    }

    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4 py-16">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="max-w-xl w-full text-center space-y-8">
          <div className="space-y-2">
            <p className="text-violet-400 text-sm font-medium tracking-widest uppercase">Free Quiz</p>
            <h1 className="text-4xl font-bold tracking-tight">Free Enneagram Personality Test</h1>
            <p className="text-white/60 text-lg mt-4">
              36 questions. Instant results. No signup required.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 text-left max-h-64 overflow-y-auto pr-1">
            {(Object.entries(TYPE_INFO) as [string, typeof TYPE_INFO[EnneaType]][]).map(([num, t]) => (
              <div key={num} className={`rounded-xl border p-3 flex items-center gap-4 ${t.bg}`}>
                <div className={`w-8 h-8 rounded-full ${t.bar} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {num}
                </div>
                <div>
                  <p className={`font-semibold text-sm ${t.color}`}>{t.name}</p>
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
            Based on the Enneagram Institute&#39;s 9-type model. Takes about 5 minutes.
          </p>
        </div>
      </div>
    )
  }

  // Results screen
  if (done) {
    const typeEntries = (Object.entries(scores) as [string, number][]).map(([t, s]) => ({
      type: Number(t) as EnneaType,
      score: s,
    }))
    typeEntries.sort((a, b) => b.score - a.score)
    const dominantType = typeEntries[0].type
    const wing = getWing(dominantType, scores)
    const maxScore = 20 // 4 questions × 5 max
    const info = TYPE_INFO[dominantType]

    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full space-y-8">
          <div className="text-center space-y-2">
            <p className="text-white/40 text-sm uppercase tracking-widest">Your Enneagram Type</p>
            <h1 className="text-4xl sm:text-5xl font-black">
              <span className={info.color}>Type {dominantType}</span>
              <span className="text-white/40 text-3xl font-light">w{wing}</span>
            </h1>
            <p className={`text-xl font-semibold ${info.color}`}>{info.name}</p>
          </div>

          {/* Description */}
          <div className={`rounded-2xl border p-6 ${info.bg}`}>
            <p className="text-white/80 leading-relaxed">{info.description}</p>
          </div>

          {/* Score breakdown */}
          <div className="space-y-3">
            <p className="text-white/40 text-xs uppercase tracking-widest">All Type Scores</p>
            {typeEntries.map(({ type, score }) => {
              const t = TYPE_INFO[type]
              const pct = Math.round((score / maxScore) * 100)
              return (
                <div key={type} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full ${t.bar} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                    {type}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-white/50 mb-1">
                      <span>{t.name}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div
                        className={`${t.bar} h-1.5 rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Upsell / email capture */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <p className="text-white font-medium">
              Your Enneagram type is just one layer of your psychology. Discover how it connects to your Big Five, attachment style, archetypes and values in your full profile.
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
            quizName="Enneagram"
            teaserText="Your Enneagram type reveals your core motivations — but your full psychological portrait shows how those motivations interact with your personality traits, attachment patterns, and value system across 7 frameworks."
            freeItems={[
              'Your dominant Enneagram type + wing',
              'Type description and core desire/fear',
              'No integration or disintegration paths',
            ]}
            proItems={[
              'Your integration & disintegration paths (growth and stress)',
              'Core wound and childhood pattern analysis',
              'Enneagram × Big Five trait interaction',
              'Your type\'s relationship and communication blind spots',
              'Career and purpose alignment for your type',
              'Full 7-framework AI portrait with tritype analysis',
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
  const typeInfo = TYPE_INFO[question.type]
  const progress = (currentQ / QUESTIONS.length) * 100

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

        {/* Type badge */}
        <div className="flex justify-center">
          <span className={`text-xs font-medium tracking-widest uppercase ${typeInfo.color} px-3 py-1 rounded-full border ${typeInfo.bg}`}>
            Type {question.type} · {typeInfo.name}
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
