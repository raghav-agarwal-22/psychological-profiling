'use client'

import Link from 'next/link'
import { useState } from 'react'
import { QuizUpgradeCard } from '@/components/QuizUpgradeCard'
import { RelatedQuizzes } from '@/components/RelatedQuizzes'
import { QuizEmailCapture } from '@/components/QuizEmailCapture'
import { track } from '@/lib/analytics'

type Trait = 'narcissism' | 'machiavellianism' | 'psychopathy'

interface Question {
  text: string
  trait: Trait
}

const QUESTIONS: Question[] = [
  // Narcissism
  { text: 'I tend to want prestige and status more than most people.', trait: 'narcissism' },
  { text: 'I feel that I am more special than others.', trait: 'narcissism' },
  { text: 'I enjoy being admired by the people around me.', trait: 'narcissism' },
  { text: 'I am good at influencing people to get what I want.', trait: 'narcissism' },
  { text: 'I like to be the centre of attention.', trait: 'narcissism' },
  { text: 'I expect special treatment in most situations.', trait: 'narcissism' },
  { text: 'I find it easy to talk people into things.', trait: 'narcissism' },
  // Machiavellianism
  { text: 'I am willing to use deception to get what I want.', trait: 'machiavellianism' },
  { text: 'I think most people can be influenced if you know how.', trait: 'machiavellianism' },
  { text: 'I keep information to myself to use it to my advantage.', trait: 'machiavellianism' },
  { text: 'I try to maintain control in any situation.', trait: 'machiavellianism' },
  { text: 'I enjoy using clever strategy to get my way.', trait: 'machiavellianism' },
  { text: 'I believe it is smart to keep your cards close to your chest.', trait: 'machiavellianism' },
  { text: 'I rarely reveal the real reason I did something.', trait: 'machiavellianism' },
  // Psychopathy
  { text: 'I tend not to feel strong remorse for my actions.', trait: 'psychopathy' },
  { text: 'I can remain calm in high-pressure situations that stress others.', trait: 'psychopathy' },
  { text: 'I tend to find it hard to empathise with others.', trait: 'psychopathy' },
  { text: 'I take risks and enjoy the rush of excitement.', trait: 'psychopathy' },
  { text: "I find it difficult to feel others' pain deeply.", trait: 'psychopathy' },
  { text: 'I sometimes act on impulse without thinking things through.', trait: 'psychopathy' },
  { text: 'I can influence others without feeling guilty about it.', trait: 'psychopathy' },
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
  {
    label: string
    color: string
    bar: string
    bg: string
    description: (pct: number) => string
  }
> = {
  narcissism: {
    label: 'Narcissism',
    color: 'text-amber-400',
    bar: 'bg-amber-500',
    bg: 'bg-amber-500/10 border-amber-500/30',
    description: (pct) => {
      if (pct >= 65)
        return `Your Narcissism score of ${pct}% is above average. You likely have a strong sense of self-worth, enjoy recognition, and may have high expectations of others. At elevated levels, this can create friction in close relationships.`
      if (pct <= 35)
        return `Your Narcissism score of ${pct}% is below average. You tend to be modest, other-oriented, and may underplay your own achievements — sometimes to a fault.`
      return `Your Narcissism score of ${pct}% is in the typical range. Most people carry some degree of self-promotion and desire for recognition — you're no different.`
    },
  },
  machiavellianism: {
    label: 'Machiavellianism',
    color: 'text-rose-400',
    bar: 'bg-rose-500',
    bg: 'bg-rose-500/10 border-rose-500/30',
    description: (pct) => {
      if (pct >= 65)
        return `Your Machiavellianism score of ${pct}% is above average. You tend to be strategic, calculating, and comfortable playing the long game. You're willing to use information asymmetry to your advantage.`
      if (pct <= 35)
        return `Your Machiavellianism score of ${pct}% is below average. You tend to be transparent, direct, and guided by principle over strategy — which builds deep trust.`
      return `Your Machiavellianism score of ${pct}% is in the typical range. You're capable of strategic thinking when needed without being primarily motivated by manipulation.`
    },
  },
  psychopathy: {
    label: 'Psychopathy',
    color: 'text-violet-400',
    bar: 'bg-violet-500',
    bg: 'bg-violet-500/10 border-violet-500/30',
    description: (pct) => {
      if (pct >= 65)
        return `Your Psychopathy score of ${pct}% is above average. You tend to be cool under pressure, impulsive at times, and may find deep emotional empathy less natural. This can be an asset in high-stakes environments.`
      if (pct <= 35)
        return `Your Psychopathy score of ${pct}% is below average. You are highly empathic, feel remorse acutely, and tend to be cautious about risk. You may absorb others' emotions strongly.`
      return `Your Psychopathy score of ${pct}% is in the typical range. You balance empathy with emotional regulation, and can stay calm without being detached.`
    },
  },
}

type Scores = Record<Trait, number>
type Counts = Record<Trait, number>

function getTraitScore(raw: number, count: number): number {
  if (count === 0) return 0
  return Math.round((raw / (count * 5)) * 100)
}

function getDarkTriadProfile(n: number, m: number, p: number): { title: string; summary: string } {
  const avg = (n + m + p) / 3
  if (avg >= 65) {
    return {
      title: 'The Strategist',
      summary:
        'You score high across multiple dark triad dimensions. You are perceptive about power dynamics, rarely surprised by human behaviour, and tend to think several moves ahead. These traits, when channelled constructively, can drive exceptional leadership and resilience.',
    }
  }
  if (n >= 65 && m < 50 && p < 50) {
    return {
      title: 'The Visionary',
      summary:
        'Your narcissistic traits are your most prominent feature. You have a strong sense of self and personal destiny. You seek recognition and status, and you have the charisma to attract it.',
    }
  }
  if (m >= 65 && n < 50 && p < 50) {
    return {
      title: 'The Operator',
      summary:
        'Machiavellianism is your dominant trait. You are patient, strategic, and skilled at reading situations and people. You rarely tip your hand and play a long game effortlessly.',
    }
  }
  if (p >= 65 && n < 50 && m < 50) {
    return {
      title: 'The Thrill-Seeker',
      summary:
        'Psychopathic traits are your standout feature. You are fearless, impulsive, and action-oriented. You process stress differently than most and can perform when others freeze.',
    }
  }
  if (avg <= 30) {
    return {
      title: 'The Empath',
      summary:
        'You score low across all dark triad traits. You are deeply empathic, guided by principle, and highly transparent. You may find strategic social environments draining.',
    }
  }
  return {
    title: 'The Pragmatist',
    summary:
      'You have a balanced Dark Triad profile — present in each dimension but not extreme in any. You can be strategic when needed, self-promoting when appropriate, and emotionally regulated under pressure.',
  }
}

export default function DarkTriadQuiz() {
  const [started, setStarted] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [scores, setScores] = useState<Scores>({ narcissism: 0, machiavellianism: 0, psychopathy: 0 })
  const [counts, setCounts] = useState<Counts>({ narcissism: 0, machiavellianism: 0, psychopathy: 0 })
  const [done, setDone] = useState(false)

  function handleAnswer(value: number) {
    const trait = QUESTIONS[currentQ].trait
    const newScores = { ...scores, [trait]: scores[trait] + value }
    const newCounts = { ...counts, [trait]: counts[trait] + 1 }
    setScores(newScores)
    setCounts(newCounts)

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      track('quiz_completed', { quiz_type: 'dark-triad' })
      setDone(true)
    }
  }

  function handleRetake() {
    setStarted(false)
    setCurrentQ(0)
    setScores({ narcissism: 0, machiavellianism: 0, psychopathy: 0 })
    setCounts({ narcissism: 0, machiavellianism: 0, psychopathy: 0 })
    setDone(false)
  }

  // Landing screen
  if (!started) {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Quiz',
      name: 'Dark Triad Personality Test',
      description: 'A free 21-question Dark Triad test measuring Narcissism, Machiavellianism, and Psychopathy. Based on subclinical research (Paulhus & Williams, 2002). Non-judgmental and research-based. No signup required.',
      url: 'https://innermindhealing.com/quiz/dark-triad',
      educationalLevel: 'beginner',
      timeRequired: 'PT3M',
      numberOfQuestions: 21,
      about: { '@type': 'Thing', name: 'Dark Triad (Narcissism, Machiavellianism, Psychopathy)' },
      author: { '@type': 'Organization', name: 'Innermind', url: 'https://innermindhealing.com' },
      provider: { '@type': 'Organization', name: 'Innermind', url: 'https://innermindhealing.com' },
    }

    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4 py-16">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="max-w-xl w-full text-center space-y-8">
          <div className="space-y-3">
            <p className="text-rose-400 text-sm font-medium tracking-widest uppercase">Free Quiz</p>
            <h1 className="text-4xl font-bold tracking-tight">Dark Triad Personality Test</h1>
            <p className="text-white/60 text-lg mt-4">
              21 questions. Instant results. Non-judgmental, research-based.
            </p>
            <p className="text-white/40 text-sm">
              Everyone has subclinical dark triad traits. This test measures where you fall on the spectrum — not whether you&apos;re &ldquo;good&rdquo; or &ldquo;bad&rdquo;.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 text-left">
            {(Object.entries(TRAITS) as [Trait, (typeof TRAITS)[Trait]][]).map(([key, t]) => (
              <div key={key} className={`rounded-xl border p-4 flex items-center gap-4 ${t.bg}`}>
                <div className={`w-2 h-8 rounded-full ${t.bar} flex-shrink-0`} />
                <div>
                  <p className={`font-semibold text-sm ${t.color}`}>{t.label}</p>
                  <p className="text-white/50 text-xs mt-0.5">
                    {key === 'narcissism' && 'Self-importance, entitlement, and desire for admiration'}
                    {key === 'machiavellianism' && 'Strategic thinking, deception, and long-term planning'}
                    {key === 'psychopathy' && 'Emotional detachment, impulsivity, and risk tolerance'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => { track('quiz_started', { quiz_type: 'dark-triad' }); setStarted(true) }}
            className="w-full bg-rose-600 hover:bg-rose-500 transition-colors text-white font-semibold py-4 rounded-xl text-lg"
          >
            Start the Test &rarr;
          </button>

          <p className="text-white/30 text-xs">
            Based on subclinical dark triad research (Paulhus &amp; Williams, 2002). Takes about 3 minutes.
          </p>
        </div>
      </div>
    )
  }

  // Results screen
  if (done) {
    const traitOrder: Trait[] = ['narcissism', 'machiavellianism', 'psychopathy']
    const percentages = traitOrder.map((t) => ({
      trait: t,
      pct: getTraitScore(scores[t], counts[t]),
    }))
    const nPct = getTraitScore(scores.narcissism, counts.narcissism)
    const mPct = getTraitScore(scores.machiavellianism, counts.machiavellianism)
    const pPct = getTraitScore(scores.psychopathy, counts.psychopathy)
    const profile = getDarkTriadProfile(nPct, mPct, pPct)
    const shareText = `I scored ${nPct}% Narcissism, ${mPct}% Machiavellianism, and ${pPct}% Psychopathy on the Dark Triad test. My profile: "${profile.title}"`

    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full space-y-8">
          <div className="text-center space-y-2">
            <p className="text-white/40 text-sm uppercase tracking-widest">Your Dark Triad Profile</p>
            <h1 className="text-3xl font-bold text-rose-400">{profile.title}</h1>
            <p className="text-white/50 text-sm">Scored 0–100 per dimension</p>
          </div>

          {/* Context banner */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs text-center">
              Most people score between 20–40% on each dimension. These traits exist on a spectrum — everyone has some.
            </p>
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
                  <p className="text-white/60 text-xs leading-relaxed">{t.description(pct)}</p>
                </div>
              )
            })}
          </div>

          {/* Profile summary */}
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 space-y-3">
            <p className="text-rose-400 text-xs font-medium tracking-widest uppercase">Overall Profile</p>
            <h2 className="text-xl font-bold text-white">{profile.title}</h2>
            <p className="text-white/70 text-sm leading-relaxed">{profile.summary}</p>
          </div>

          {/* Share hook */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
            <p className="text-white/60 text-sm font-medium">Compare your results with friends</p>
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

          {/* Upsell / email capture */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <p className="text-white/60 text-sm">
              Your Dark Triad scores are one lens on your psychology.
            </p>
            <p className="text-white font-medium">
              Discover how they connect to your Big Five personality, attachment style, Enneagram type, and Jungian archetypes — synthesised by AI into a full psychological portrait.
            </p>

            <QuizEmailCapture quizType="dark-triad" />

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
            quizName="Dark Triad"
            teaserText="Your Dark Triad scores reveal your shadow traits — but how do they interact with your Big Five personality, attachment style, and core values? The full AI portrait reveals the complete picture of your psychological makeup."
            freeItems={[
              '3 dark trait percentages (N, M, P)',
              'Your archetype label',
              'No context on what drives these traits',
            ]}
            proItems={[
              'What fuels your dark traits — the psychology beneath the scores',
              'Shadow integration: how to channel these traits productively',
              'Dark triad × attachment style interaction analysis',
              'Behavioral patterns and triggers under stress',
              'Personalized self-awareness and growth map',
              'Full 7-framework AI portrait with coach access',
            ]}
          />

          <RelatedQuizzes currentQuiz="dark-triad" />

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
              className="bg-rose-500 h-2 rounded-full transition-all duration-300"
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
                className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-rose-500/50 rounded-xl px-5 py-4 text-white/80 hover:text-white transition-all duration-150 flex items-center gap-4"
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
