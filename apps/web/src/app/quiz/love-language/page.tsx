'use client'

import Link from 'next/link'
import { useState } from 'react'
import { QuizUpgradeCard } from '@/components/QuizUpgradeCard'

type LoveLanguage = 'words' | 'acts' | 'gifts' | 'time' | 'touch'

interface Question {
  text: string
  type: LoveLanguage
}

const QUESTIONS: Question[] = [
  // Words of Affirmation
  { text: 'Hearing "I love you" or "I appreciate you" genuinely makes my day.', type: 'words' },
  { text: 'A heartfelt compliment from someone I care about means more to me than a gift.', type: 'words' },
  { text: 'I feel most loved when people express their feelings for me out loud.', type: 'words' },
  { text: 'Written notes or texts of encouragement lift my spirits significantly.', type: 'words' },
  { text: 'When someone praises my work or character, I feel deeply seen and valued.', type: 'words' },

  // Acts of Service
  { text: 'When someone does a task for me without being asked, I feel deeply cared for.', type: 'acts' },
  { text: 'I notice and appreciate it when people take burdens off my plate.', type: 'acts' },
  { text: 'Someone helping me with chores or errands feels more loving than words.', type: 'acts' },
  { text: 'I feel loved when people follow through on what they say they will do for me.', type: 'acts' },
  { text: 'Actions that make my life easier communicate love better than any gift.', type: 'acts' },

  // Receiving Gifts
  { text: 'A thoughtful gift — even something small — makes me feel genuinely remembered.', type: 'gifts' },
  { text: 'I attach sentimental value to physical tokens and keep them for a long time.', type: 'gifts' },
  { text: 'When someone brings me something back from a trip, it touches me deeply.', type: 'gifts' },
  { text: 'The effort someone puts into selecting a gift matters a lot to me.', type: 'gifts' },
  { text: 'Receiving an unexpected present is one of the most meaningful gestures I can think of.', type: 'gifts' },

  // Quality Time
  { text: 'Having someone\'s undivided attention is one of the greatest gifts they can give me.', type: 'time' },
  { text: 'I feel disconnected when the people I love are distracted during our time together.', type: 'time' },
  { text: 'Shared experiences matter more to me than material things.', type: 'time' },
  { text: 'A long, uninterrupted conversation makes me feel closer to someone than almost anything.', type: 'time' },
  { text: 'When someone carves out dedicated time just for me, I feel truly valued.', type: 'time' },

  // Physical Touch
  { text: 'A hug or pat on the back from someone I care about instantly makes me feel better.', type: 'touch' },
  { text: 'Physical closeness — sitting near someone, holding hands — communicates warmth to me.', type: 'touch' },
  { text: 'I feel connected and reassured through casual, affectionate physical contact.', type: 'touch' },
  { text: 'The absence of physical touch in a relationship makes me feel emotionally distant.', type: 'touch' },
  { text: 'A comforting hand on my shoulder during a hard moment speaks louder than any words.', type: 'touch' },
]

const SCALE = [
  { label: 'Not at all like me', value: 1 },
  { label: 'Mostly unlike me', value: 2 },
  { label: 'Somewhat like me', value: 3 },
  { label: 'Mostly like me', value: 4 },
  { label: 'Very much like me', value: 5 },
]

const LANGUAGE_INFO: Record<
  LoveLanguage,
  { name: string; shortName: string; color: string; bar: string; bg: string; description: string; tagline: string }
> = {
  words: {
    name: 'Words of Affirmation',
    shortName: 'Words',
    color: 'text-violet-400',
    bar: 'bg-violet-500',
    bg: 'bg-violet-500/10 border-violet-500/30',
    tagline: 'Verbal expressions of love and appreciation',
    description:
      'You feel most loved through spoken and written words. Compliments, "I love you", expressions of gratitude, and notes of encouragement fill your emotional tank. Criticism cuts deep, and silence can feel like withdrawal of love. The right words at the right moment are profoundly meaningful to you.',
  },
  acts: {
    name: 'Acts of Service',
    shortName: 'Acts of Service',
    color: 'text-emerald-400',
    bar: 'bg-emerald-500',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    tagline: 'Actions that reduce burdens and show care',
    description:
      'For you, love is something you see demonstrated — not just heard. When someone takes initiative to help you, follows through on commitments, or eases your load without being asked, it signals deep care. Laziness, broken promises, or people who "say but don\'t do" feel particularly hurtful to you.',
  },
  gifts: {
    name: 'Receiving Gifts',
    shortName: 'Gifts',
    color: 'text-amber-400',
    bar: 'bg-amber-500',
    bg: 'bg-amber-500/10 border-amber-500/30',
    tagline: 'Thoughtful tokens that say "I was thinking of you"',
    description:
      'This is not about materialism — it\'s about the symbolism. A gift is a tangible, visible sign that someone thought of you. You treasure meaningful objects and remember gifts for years. When someone forgets an important occasion or gives a thoughtless gift, it registers as a failure of love itself.',
  },
  time: {
    name: 'Quality Time',
    shortName: 'Quality Time',
    color: 'text-sky-400',
    bar: 'bg-sky-500',
    bg: 'bg-sky-500/10 border-sky-500/30',
    tagline: 'Undivided attention and shared presence',
    description:
      'You crave focused, intentional time with the people you love — no phones, no distractions, just genuine presence. Shared activities and deep conversations are how you bond. Being cancelled on, or spending time with someone who is physically there but emotionally absent, feels especially painful to you.',
  },
  touch: {
    name: 'Physical Touch',
    shortName: 'Physical Touch',
    color: 'text-rose-400',
    bar: 'bg-rose-500',
    bg: 'bg-rose-500/10 border-rose-500/30',
    tagline: 'Physical closeness and affectionate contact',
    description:
      'Physical presence and touch are your primary language for both giving and receiving love. Hugs, hand-holding, a reassuring hand on the shoulder — these communicate safety, warmth, and connection more powerfully than words. Physical neglect or coldness in a relationship leaves you feeling isolated and unloved.',
  },
}

const LANGUAGE_ORDER: LoveLanguage[] = ['words', 'acts', 'gifts', 'time', 'touch']

type Scores = Record<LoveLanguage, number>

export default function LoveLanguageQuiz() {
  const [started, setStarted] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [scores, setScores] = useState<Scores>({ words: 0, acts: 0, gifts: 0, time: 0, touch: 0 })
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

  function handleShare() {
    const sorted = LANGUAGE_ORDER.map((l) => ({ type: l, score: scores[l] })).sort((a, b) => b.score - a.score)
    const primary = LANGUAGE_INFO[sorted[0].type]
    const text = `My primary love language is ${primary.name}. What's yours? Take the free quiz →`
    const url = `${window.location.origin}/quiz/love-language`
    if (navigator.share) {
      navigator.share({ title: 'My Love Language Result', text, url }).catch(() => null)
    } else {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
      window.open(twitterUrl, '_blank', 'noopener,noreferrer')
    }
  }

  function handleRetake() {
    setStarted(false)
    setCurrentQ(0)
    setScores({ words: 0, acts: 0, gifts: 0, time: 0, touch: 0 })
    setDone(false)
    setEmail('')
    setEmailSubmitted(false)
  }

  // Landing screen
  if (!started) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full text-center space-y-8">
          <div className="space-y-2">
            <p className="text-violet-400 text-sm font-medium tracking-widest uppercase">Free Quiz</p>
            <h1 className="text-4xl font-bold tracking-tight">What Is Your Love Language?</h1>
            <p className="text-white/60 text-lg mt-4">
              25 questions. Instant results. No signup required.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 text-left">
            {LANGUAGE_ORDER.map((key) => {
              const lang = LANGUAGE_INFO[key]
              return (
                <div key={key} className={`rounded-xl border p-4 flex items-center gap-4 ${lang.bg}`}>
                  <div className={`w-2 h-10 rounded-full ${lang.bar} flex-shrink-0`} />
                  <div>
                    <p className={`font-semibold text-sm ${lang.color}`}>{lang.name}</p>
                    <p className="text-white/50 text-xs mt-0.5">{lang.tagline}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <button
            onClick={() => setStarted(true)}
            className="w-full bg-violet-600 hover:bg-violet-500 transition-colors text-white font-semibold py-4 rounded-xl text-lg"
          >
            Start the Quiz &rarr;
          </button>

          <p className="text-white/30 text-xs">
            Based on Dr. Gary Chapman&apos;s Five Love Languages framework. Takes about 3 minutes.
          </p>
        </div>
      </div>
    )
  }

  // Results screen
  if (done) {
    const maxPossible = 25 // 5 questions × max score 5
    const sorted = LANGUAGE_ORDER.map((l) => ({ type: l, score: scores[l] })).sort((a, b) => b.score - a.score)
    const primary = sorted[0]
    const secondary = sorted[1]
    const primaryInfo = LANGUAGE_INFO[primary.type]
    const secondaryInfo = LANGUAGE_INFO[secondary.type]

    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full space-y-8">

          {/* Primary result hero */}
          <div className={`rounded-2xl border p-8 text-center space-y-3 ${primaryInfo.bg}`}>
            <p className="text-white/40 text-sm uppercase tracking-widest">Your Primary Love Language</p>
            <h1 className={`text-3xl font-black tracking-tight ${primaryInfo.color}`}>
              {primaryInfo.name}
            </h1>
            <p className="text-white/60 text-sm">{primaryInfo.tagline}</p>
          </div>

          {/* Primary description */}
          <div className={`rounded-2xl border p-6 ${primaryInfo.bg}`}>
            <p className="text-white/80 leading-relaxed">{primaryInfo.description}</p>
          </div>

          {/* Secondary language callout */}
          <div className={`rounded-xl border p-4 flex items-start gap-4 ${secondaryInfo.bg}`}>
            <div className={`w-1.5 rounded-full self-stretch ${secondaryInfo.bar} flex-shrink-0`} />
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Secondary Language</p>
              <p className={`font-semibold text-sm ${secondaryInfo.color}`}>{secondaryInfo.name}</p>
              <p className="text-white/50 text-xs mt-0.5">{secondaryInfo.tagline}</p>
            </div>
          </div>

          {/* Score breakdown */}
          <div className="space-y-3">
            <p className="text-white/40 text-xs uppercase tracking-widest">All Language Scores</p>
            {sorted.map(({ type, score }) => {
              const info = LANGUAGE_INFO[type]
              const pct = Math.round((score / maxPossible) * 100)
              return (
                <div key={type} className="flex items-center gap-3">
                  <div className={`w-2 h-7 rounded-full ${info.bar} flex-shrink-0`} />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-white/50 mb-1">
                      <span>{info.name}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div
                        className={`${info.bar} h-1.5 rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Share button */}
          <button
            onClick={handleShare}
            className={`w-full border font-semibold py-3 rounded-xl text-sm transition-colors ${primaryInfo.bg} ${primaryInfo.color} hover:opacity-80`}
          >
            Share My Result
          </button>

          {/* Email capture / upsell */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <p className="text-white/60 text-sm">
              Your love language is just one piece of your relational psychology.
            </p>
            <p className="text-white font-medium">
              Innermind connects your love language to your attachment style, Enneagram type, Big Five traits, and core values — synthesised by AI into a full relational portrait.
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
            quizName="Love Languages"
            teaserText="Your love language explains how you give and receive love — but your attachment style, personality traits, and Enneagram type explain why. Get the full picture with an AI-powered psychological portrait."
            freeItems={[
              'Your primary love language',
              'A brief explanation',
              'No connection to your attachment or relationship history',
            ]}
            proItems={[
              'Why you have this love language — traced to attachment history',
              'Love language × attachment style: your relational needs map',
              'Compatibility patterns with other types and Enneagram combinations',
              'Communication guide for your specific combination',
              'Relationship growth recommendations personalized to you',
              'Full 7-framework AI portrait with unlimited coach access',
            ]}
          />

          <button
            onClick={handleRetake}
            className="w-full text-white/40 hover:text-white/60 text-sm transition-colors py-3 min-h-[44px]"
          >
            Retake the quiz
          </button>
        </div>
      </div>
    )
  }

  // Quiz screen
  const question = QUESTIONS[currentQ]
  const langInfo = LANGUAGE_INFO[question.type]
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

        {/* Category badge */}
        <div className="flex justify-center">
          <span className={`text-xs font-medium tracking-widest uppercase ${langInfo.color} px-3 py-1 rounded-full border ${langInfo.bg}`}>
            {langInfo.name}
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
