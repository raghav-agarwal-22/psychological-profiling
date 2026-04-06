'use client'

import Link from 'next/link'
import { useState } from 'react'
import { QuizUpgradeCard } from '@/components/QuizUpgradeCard'
import { RelatedQuizzes } from '@/components/RelatedQuizzes'
import { QuizEmailCapture } from '@/components/QuizEmailCapture'
import { track } from '@/lib/analytics'

type AttachmentType = 'secure' | 'anxious' | 'avoidant' | 'disorganized'

interface Question {
  text: string
  options: { text: string; type: AttachmentType }[]
}

const QUESTIONS: Question[] = [
  {
    text: "When a close person doesn't respond to your message quickly, you...",
    options: [
      { text: "Feel fine — they're probably just busy", type: 'secure' },
      { text: "Start to worry they're upset with you", type: 'anxious' },
      { text: "Barely notice — you don't rely on quick replies", type: 'avoidant' },
      { text: 'Feel anxious but also push the thought away', type: 'disorganized' },
    ],
  },
  {
    text: 'In relationships, you typically feel...',
    options: [
      { text: 'Comfortable with closeness and able to depend on others', type: 'secure' },
      { text: 'Like you want more closeness than the other person gives', type: 'anxious' },
      { text: 'More comfortable keeping emotional distance', type: 'avoidant' },
      { text: 'Uncertain — you want connection but it also feels risky', type: 'disorganized' },
    ],
  },
  {
    text: 'When someone becomes very close to you, you...',
    options: [
      { text: 'Feel good — deep bonds are something you value', type: 'secure' },
      { text: 'Feel relieved but still worry about losing them', type: 'anxious' },
      { text: 'Start feeling a little suffocated or confined', type: 'avoidant' },
      { text: 'Feel conflicted — drawn in but also wanting to flee', type: 'disorganized' },
    ],
  },
  {
    text: 'After an argument with someone you care about, you...',
    options: [
      { text: 'Address it calmly and move forward', type: 'secure' },
      { text: 'Worry intensely until the relationship feels stable again', type: 'anxious' },
      { text: 'Need space and prefer to move on without deep discussion', type: 'avoidant' },
      { text: 'Oscillate between wanting to reconnect and pulling away', type: 'disorganized' },
    ],
  },
  {
    text: 'Your need for alone time in relationships is...',
    options: [
      { text: 'Balanced — you enjoy both togetherness and solitude', type: 'secure' },
      { text: "Low — you'd rather be with your person than alone", type: 'anxious' },
      { text: 'High — solitude recharges you and independence matters', type: 'avoidant' },
      { text: 'Complicated — sometimes you crave it, sometimes it frightens you', type: 'disorganized' },
    ],
  },
  {
    text: 'When you need emotional support, you typically...',
    options: [
      { text: 'Reach out comfortably and ask for what you need', type: 'secure' },
      { text: 'Reach out but worry about being "too much"', type: 'anxious' },
      { text: 'Handle it alone rather than burden someone else', type: 'avoidant' },
      { text: 'Want help but struggle to ask — or push it away when offered', type: 'disorganized' },
    ],
  },
  {
    text: 'The idea of complete vulnerability with a partner feels...',
    options: [
      { text: "Natural — it's part of what closeness means", type: 'secure' },
      { text: "Necessary but terrifying — what if they use it against you?", type: 'anxious' },
      { text: 'Unnecessary or uncomfortable — you prefer to keep some walls up', type: 'avoidant' },
      { text: 'Both deeply desired and deeply unsafe at the same time', type: 'disorganized' },
    ],
  },
  {
    text: 'When a relationship ends, you...',
    options: [
      { text: 'Grieve, process, and eventually move forward', type: 'secure' },
      { text: 'Struggle to let go and replay what went wrong', type: 'anxious' },
      { text: 'Move on relatively quickly by focusing on yourself', type: 'avoidant' },
      { text: "Feel relief mixed with grief — it's confusing and painful", type: 'disorganized' },
    ],
  },
  {
    text: 'In friendships, you tend to...',
    options: [
      { text: 'Maintain close, consistent connections over time', type: 'secure' },
      { text: 'Invest heavily and worry when the bond feels unequal', type: 'anxious' },
      { text: 'Keep most friendships at a comfortable distance', type: 'avoidant' },
      { text: 'Have intense bonds that sometimes collapse unexpectedly', type: 'disorganized' },
    ],
  },
  {
    text: 'Your ideal relationship has...',
    options: [
      { text: 'Mutual trust, openness, and space to be yourselves', type: 'secure' },
      { text: 'Constant reassurance and deep emotional fusion', type: 'anxious' },
      { text: 'Clear boundaries, independence, and no pressure to merge', type: 'avoidant' },
      { text: "Intensity and depth, but you're not sure it's safe to want that", type: 'disorganized' },
    ],
  },
]

const RESULTS: Record<
  AttachmentType,
  { label: string; tagline: string; description: string; color: string; bg: string }
> = {
  secure: {
    label: 'Secure',
    tagline: 'Comfortable with intimacy and independence',
    description:
      "You approach relationships with a healthy balance of closeness and autonomy. You're able to trust others, communicate your needs, and handle conflict without catastrophising. You had — or learned — the experience of reliable, consistent care, and that foundation lets you move through relationships with confidence rather than fear.",
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
  },
  anxious: {
    label: 'Anxious-Preoccupied',
    tagline: 'Craves closeness, fears abandonment',
    description:
      "You long deeply for connection and closeness, but relationships often feel uncertain — like you're always waiting for the other person to pull away. You may seek reassurance more than most, and small signs of distance can feel magnified. This pattern usually traces back to inconsistent early care: connection was available, but not reliably.",
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/30',
  },
  avoidant: {
    label: 'Dismissive-Avoidant',
    tagline: 'Values independence, uncomfortable with closeness',
    description:
      "You prize self-reliance and can feel uncomfortable when relationships demand deep emotional intimacy. This isn't coldness — it's a protective pattern. When closeness felt unsafe or unavailable early on, independence became your solution. You function well alone, but may find that real connection requires you to risk a little more than feels natural.",
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/30',
  },
  disorganized: {
    label: 'Disorganized / Fearful-Avoidant',
    tagline: 'Wants and fears intimacy simultaneously',
    description:
      "You experience a painful push-pull in relationships: you want closeness and feel terrified by it at the same time. This often stems from early experiences where the people you needed for safety were also sources of fear or confusion. The result is a self that both craves and braces against love — making relationships feel simultaneously essential and dangerous.",
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/30',
  },
}

type Scores = Record<AttachmentType, number>

export default function AttachmentStyleQuiz() {
  const [started, setStarted] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [scores, setScores] = useState<Scores>({ secure: 0, anxious: 0, avoidant: 0, disorganized: 0 })
  const [result, setResult] = useState<AttachmentType | null>(null)

  function handleAnswer(type: AttachmentType) {
    const newScores = { ...scores, [type]: scores[type] + 1 }
    setScores(newScores)

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      const winner = (Object.keys(newScores) as AttachmentType[]).reduce((a, b) =>
        newScores[a] >= newScores[b] ? a : b
      )
      track('quiz_completed', { quiz_type: 'attachment-style' })
      setResult(winner)
    }
  }

  // Landing screen
  if (!started) {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Quiz',
      name: 'Free Attachment Style Test',
      description: 'A free 10-question attachment style quiz. Discover whether you are Secure, Anxious-Preoccupied, Dismissive-Avoidant, or Disorganized. Instant results, no signup required.',
      url: 'https://innermindhealing.com/quiz/attachment-style',
      educationalLevel: 'beginner',
      timeRequired: 'PT2M',
      numberOfQuestions: 10,
      about: { '@type': 'Thing', name: 'Attachment Theory' },
      author: { '@type': 'Organization', name: 'Innermind', url: 'https://innermindhealing.com' },
      provider: { '@type': 'Organization', name: 'Innermind', url: 'https://innermindhealing.com' },
    }

    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4 py-16">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="max-w-xl w-full text-center space-y-8">
          <div className="space-y-2">
            <p className="text-violet-400 text-sm font-medium tracking-widest uppercase">Free Quiz</p>
            <h1 className="text-4xl font-bold tracking-tight">What Is Your Attachment Style?</h1>
            <p className="text-white/60 text-lg mt-4">
              10 questions. Instant results. No signup required.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {(Object.values(RESULTS)).map((r) => (
              <div key={r.label} className={`rounded-xl border p-4 ${r.bg}`}>
                <p className={`font-semibold text-sm ${r.color}`}>{r.label}</p>
                <p className="text-white/50 text-xs mt-1">{r.tagline}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => { track('quiz_started', { quiz_type: 'attachment-style' }); setStarted(true) }}
            className="w-full bg-violet-600 hover:bg-violet-500 transition-colors text-white font-semibold py-4 rounded-xl text-lg"
          >
            Start the Quiz &rarr;
          </button>

          <p className="text-white/30 text-xs">
            Based on validated attachment theory research. Takes about 2 minutes.
          </p>
        </div>
      </div>
    )
  }

  // Results screen
  if (result) {
    const r = RESULTS[result]
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full space-y-8">
          <div className="text-center space-y-2">
            <p className="text-white/40 text-sm uppercase tracking-widest">Your Attachment Style</p>
            <h1 className={`text-4xl font-bold ${r.color}`}>{r.label}</h1>
            <p className="text-white/60 text-base">{r.tagline}</p>
          </div>

          <div className={`rounded-2xl border p-6 ${r.bg}`}>
            <p className="text-white/80 leading-relaxed">{r.description}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <p className="text-white/60 text-sm">
              Your attachment style is just one piece of your psychological makeup.
            </p>
            <p className="text-white font-medium">
              Discover your full profile — Big Five personality, Enneagram type, Jungian archetypes, and core values — all synthesised by AI into a personalised portrait.
            </p>

            <QuizEmailCapture quizType="attachment-style" />

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-xs">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <Link
              href="/assessment"
              className="block w-full text-center bg-white text-black font-semibold py-3 rounded-lg hover:bg-white/90 transition-colors"
            >
              Take the Full Assessment &rarr;
            </Link>
          </div>

          <QuizUpgradeCard
            quizName="Attachment Style"
            teaserText="Your attachment style shapes how you connect in relationships — but it's only part of the story. See how your attachment patterns interact with your personality traits, values, and deeper motivations in a full AI-synthesized portrait."
            freeItems={[
              'Your attachment category (Secure/Anxious/Avoidant/Disorganized)',
              'A paragraph explanation of your type',
              'No connection to your personality, values, or Enneagram',
            ]}
            proItems={[
              'Why you attach this way — traced to core wound and early patterns',
              'How your attachment shapes every relationship in your life',
              'Attachment × Enneagram interaction for your specific combination',
              'Communication and conflict style recommendations',
              'Your relationship growth path, personalized to your style',
              'Full 7-framework AI portrait with unlimited coach access',
            ]}
          />

          <RelatedQuizzes currentQuiz="attachment-style" />

          <button
            onClick={() => {
              setStarted(false)
              setCurrentQ(0)
              setScores({ secure: 0, anxious: 0, avoidant: 0, disorganized: 0 })
              setResult(null)
            }}
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

        {/* Question */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold leading-relaxed">{question.text}</h2>

          <div className="space-y-3">
            {question.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(option.type)}
                className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/50 rounded-xl px-5 py-4 text-white/80 hover:text-white transition-all duration-150"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
