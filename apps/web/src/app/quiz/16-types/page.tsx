'use client'

import Link from 'next/link'
import { useState } from 'react'
import { QuizUpgradeCard } from '@/components/QuizUpgradeCard'
import { RelatedQuizzes } from '@/components/RelatedQuizzes'

type Dimension = 'EI' | 'SN' | 'TF' | 'JP'

interface Question {
  text: string
  dimension: Dimension
  // 'first' = agree means E, S, T, or J — 'second' = agree means I, N, F, or P
  direction: 'first' | 'second'
}

const QUESTIONS: Question[] = [
  // E/I
  { text: 'I feel energized after spending time with groups of people.', dimension: 'EI', direction: 'first' },
  { text: 'I prefer thinking through problems alone rather than talking them out.', dimension: 'EI', direction: 'second' },
  { text: 'I like meeting new people and making connections.', dimension: 'EI', direction: 'first' },
  { text: 'I need quiet time to recharge after social events.', dimension: 'EI', direction: 'second' },
  // S/N
  { text: 'I prefer concrete facts over abstract theories.', dimension: 'SN', direction: 'first' },
  { text: 'I enjoy thinking about future possibilities more than present realities.', dimension: 'SN', direction: 'second' },
  { text: 'I trust experience more than imagination.', dimension: 'SN', direction: 'first' },
  { text: 'I often think about what could be rather than what is.', dimension: 'SN', direction: 'second' },
  // T/F
  { text: 'I make decisions based on logic rather than emotions.', dimension: 'TF', direction: 'first' },
  { text: 'I prioritize harmony over being right.', dimension: 'TF', direction: 'second' },
  { text: 'I value fairness over compassion in difficult decisions.', dimension: 'TF', direction: 'first' },
  { text: "When someone is upset I focus more on their feelings than the facts.", dimension: 'TF', direction: 'second' },
  // J/P
  { text: 'I prefer having a clear plan rather than keeping options open.', dimension: 'JP', direction: 'first' },
  { text: 'I often start projects without finishing them.', dimension: 'JP', direction: 'second' },
  { text: 'I feel uncomfortable with last-minute changes.', dimension: 'JP', direction: 'first' },
  { text: 'I work best close to deadlines with pressure.', dimension: 'JP', direction: 'second' },
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
  { label: string; first: string; second: string; color: string; bar: string; bg: string }
> = {
  EI: {
    label: 'Energy',
    first: 'Extraversion',
    second: 'Introversion',
    color: 'text-amber-400',
    bar: 'bg-amber-500',
    bg: 'bg-amber-500/10 border-amber-500/30',
  },
  SN: {
    label: 'Perception',
    first: 'Sensing',
    second: 'Intuition',
    color: 'text-violet-400',
    bar: 'bg-violet-500',
    bg: 'bg-violet-500/10 border-violet-500/30',
  },
  TF: {
    label: 'Decisions',
    first: 'Thinking',
    second: 'Feeling',
    color: 'text-sky-400',
    bar: 'bg-sky-500',
    bg: 'bg-sky-500/10 border-sky-500/30',
  },
  JP: {
    label: 'Lifestyle',
    first: 'Judging',
    second: 'Perceiving',
    color: 'text-emerald-400',
    bar: 'bg-emerald-500',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
  },
}

interface TypeInfo {
  name: string
  description: string
  famous: string[]
  color: string
  bar: string
  bg: string
}

const SIXTEEN_TYPES: Record<string, TypeInfo> = {
  INTJ: {
    name: 'The Architect',
    description:
      'You are strategic, independent, and driven by a vision of how things ought to be. With a rare combination of imagination and decisiveness, you naturally develop long-range plans and hold high standards for yourself and others. You see inefficiency as intolerable and are relentlessly focused on improvement.',
    famous: ['Elon Musk', 'Nikola Tesla', 'Friedrich Nietzsche'],
    color: 'text-violet-400',
    bar: 'bg-violet-500',
    bg: 'bg-violet-500/10 border-violet-500/30',
  },
  INTP: {
    name: 'The Logician',
    description:
      'You are a quiet, analytical thinker who prizes logic above all else. You love exploring abstract ideas and building mental models of how things work. Others may find you reserved, but internally you are generating a constant stream of theories, questioning assumptions, and searching for universal truths.',
    famous: ['Albert Einstein', 'Charles Darwin', 'Bill Gates'],
    color: 'text-sky-400',
    bar: 'bg-sky-500',
    bg: 'bg-sky-500/10 border-sky-500/30',
  },
  ENTJ: {
    name: 'The Commander',
    description:
      'You are a natural leader — bold, decisive, and determined to achieve your goals. You have an extraordinary ability to see potential, organize people and resources, and drive toward results. Others respect your confidence, though you may need to slow down to make sure no one gets left behind.',
    famous: ['Steve Jobs', 'Margaret Thatcher', 'Napoleon Bonaparte'],
    color: 'text-rose-400',
    bar: 'bg-rose-500',
    bg: 'bg-rose-500/10 border-rose-500/30',
  },
  ENTP: {
    name: 'The Debater',
    description:
      'You are a quick, ingenious thinker who loves to challenge ideas and explore possibilities. You thrive on debate, dislike routine, and often see solutions others miss. You can argue multiple sides of any issue — not because you are insincere, but because you genuinely enjoy the intellectual workout.',
    famous: ['Thomas Edison', 'Mark Twain', 'Sacha Baron Cohen'],
    color: 'text-amber-400',
    bar: 'bg-amber-500',
    bg: 'bg-amber-500/10 border-amber-500/30',
  },
  INFJ: {
    name: 'The Advocate',
    description:
      'You are the rarest of the 16 types — idealistic yet practical, creative yet disciplined. You have a deep sense of purpose and a clear vision of how to make the world better. You feel deeply for others and are quietly determined to act on your values, even at great personal cost.',
    famous: ['Martin Luther King Jr.', 'Nelson Mandela', 'Oprah Winfrey'],
    color: 'text-emerald-400',
    bar: 'bg-emerald-500',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
  },
  INFP: {
    name: 'The Mediator',
    description:
      'You are guided by your values and a deep sense of what is authentic and true. You are imaginative and empathetic, always searching for meaning beneath the surface. Though quiet and reserved, you are passionate about the things that matter to you and have a rare gift for understanding others.',
    famous: ['J.R.R. Tolkien', 'William Shakespeare', 'Princess Diana'],
    color: 'text-pink-400',
    bar: 'bg-pink-500',
    bg: 'bg-pink-500/10 border-pink-500/30',
  },
  ENFJ: {
    name: 'The Protagonist',
    description:
      'You are a charismatic and inspiring leader who genuinely cares about the growth of others. You have a natural ability to see the best in people and motivate them to reach their potential. You are warm, decisive, and deeply committed to making a positive impact on the world around you.',
    famous: ['Barack Obama', 'Oprah Winfrey', 'Maya Angelou'],
    color: 'text-teal-400',
    bar: 'bg-teal-500',
    bg: 'bg-teal-500/10 border-teal-500/30',
  },
  ENFP: {
    name: 'The Campaigner',
    description:
      'You are enthusiastic, imaginative, and energized by possibility. You see life as a rich tapestry of connections and meaning, and you have a gift for inspiring others with your vision and passion. Deeply curious and empathetic, you are always looking for the deeper pattern beneath the surface.',
    famous: ['Robin Williams', 'Walt Disney', 'Ellen DeGeneres'],
    color: 'text-orange-400',
    bar: 'bg-orange-500',
    bg: 'bg-orange-500/10 border-orange-500/30',
  },
  ISTJ: {
    name: 'The Logistician',
    description:
      'You are responsible, thorough, and dependable — a cornerstone of any team or community. You have a strong sense of duty and are committed to meeting your obligations. You prefer structure and tradition, and others rely on you to handle important matters with care and precision.',
    famous: ['George Washington', 'Angela Merkel', 'Warren Buffett'],
    color: 'text-slate-400',
    bar: 'bg-slate-500',
    bg: 'bg-slate-500/10 border-slate-500/30',
  },
  ISFJ: {
    name: 'The Defender',
    description:
      'You are warm, dedicated, and always ready to protect the people you care about. You have an excellent memory for details about others and work hard behind the scenes to maintain harmony. You are often underestimated — quietly powerful and deeply loyal to those who matter to you.',
    famous: ['Mother Teresa', 'Kate Middleton', 'Jimmy Carter'],
    color: 'text-cyan-400',
    bar: 'bg-cyan-500',
    bg: 'bg-cyan-500/10 border-cyan-500/30',
  },
  ESTJ: {
    name: 'The Executive',
    description:
      'You are organized, structured, and committed to maintaining order. You have strong opinions about how things should be done and the willpower to see it through. You are a natural administrator — direct, dependable, and excellent at bringing people together around a shared plan.',
    famous: ['Judge Judy', 'Henry Ford', 'Sonia Sotomayor'],
    color: 'text-indigo-400',
    bar: 'bg-indigo-500',
    bg: 'bg-indigo-500/10 border-indigo-500/30',
  },
  ESFJ: {
    name: 'The Consul',
    description:
      'You are popular, caring, and highly attuned to the needs of those around you. You find satisfaction in making others happy and working toward social harmony. You are loyal and warm, and you put tremendous effort into maintaining your relationships and fulfilling your responsibilities.',
    famous: ['Taylor Swift', 'Jennifer Garner', 'Bill Clinton'],
    color: 'text-fuchsia-400',
    bar: 'bg-fuchsia-500',
    bg: 'bg-fuchsia-500/10 border-fuchsia-500/30',
  },
  ISTP: {
    name: 'The Virtuoso',
    description:
      'You are a bold and practical experimenter who masters many kinds of tools. You love to explore how things work and are at your best when solving immediate, hands-on problems. You are independent and direct, and you have a talent for staying calm under pressure.',
    famous: ['Clint Eastwood', 'Amelia Earhart', 'Bruce Lee'],
    color: 'text-lime-400',
    bar: 'bg-lime-500',
    bg: 'bg-lime-500/10 border-lime-500/30',
  },
  ISFP: {
    name: 'The Adventurer',
    description:
      'You are a flexible and charming artist who experiences the world through your senses. You live in the present moment and have a deep appreciation for beauty, people, and experiences. You are spontaneous and warm, and you express your creativity through your actions rather than your words.',
    famous: ['Frida Kahlo', 'Michael Jackson', 'Marilyn Monroe'],
    color: 'text-rose-400',
    bar: 'bg-rose-500',
    bg: 'bg-rose-500/10 border-rose-500/30',
  },
  ESTP: {
    name: 'The Entrepreneur',
    description:
      'You are smart, energetic, and perceptive — always in the thick of the action. You love living on the edge and bring a refreshing boldness to any group. You are observant and pragmatic, and you have a remarkable ability to read people and situations in real time.',
    famous: ['Donald Trump', 'Ernest Hemingway', 'Madonna'],
    color: 'text-yellow-400',
    bar: 'bg-yellow-500',
    bg: 'bg-yellow-500/10 border-yellow-500/30',
  },
  ESFP: {
    name: 'The Entertainer',
    description:
      'You are spontaneous, energetic, and enthusiastic — life is never boring around you. You love people, excitement, and new experiences, and you have a natural ability to captivate and inspire those around you. You live fully in the present and bring warmth and joy wherever you go.',
    famous: ['Marilyn Monroe', 'Elvis Presley', 'Jamie Oliver'],
    color: 'text-amber-400',
    bar: 'bg-amber-500',
    bg: 'bg-amber-500/10 border-amber-500/30',
  },
}

type DimScores = Record<Dimension, { first: number; count: number }>

function computeType(scores: DimScores): string {
  const dims: Dimension[] = ['EI', 'SN', 'TF', 'JP']
  return dims
    .map((dim) => {
      const pct = scores[dim].count === 0 ? 50 : (scores[dim].first / (scores[dim].count * 5)) * 100
      // EI: pct >= 50 → E, else I
      // SN: pct >= 50 → S, else N
      // TF: pct >= 50 → T, else F
      // JP: pct >= 50 → J, else P
      const pairs: Record<Dimension, [string, string]> = {
        EI: ['E', 'I'],
        SN: ['S', 'N'],
        TF: ['T', 'F'],
        JP: ['J', 'P'],
      }
      return pct >= 50 ? pairs[dim][0] : pairs[dim][1]
    })
    .join('')
}

function getDimPct(scores: DimScores, dim: Dimension): number {
  if (scores[dim].count === 0) return 50
  return Math.round((scores[dim].first / (scores[dim].count * 5)) * 100)
}

export default function SixteenTypesQuiz() {
  const [started, setStarted] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [scores, setScores] = useState<DimScores>({
    EI: { first: 0, count: 0 },
    SN: { first: 0, count: 0 },
    TF: { first: 0, count: 0 },
    JP: { first: 0, count: 0 },
  })
  const [done, setDone] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)

  function handleAnswer(value: number) {
    const q = QUESTIONS[currentQ]
    const effectiveValue = q.direction === 'first' ? value : 6 - value
    const newScores = {
      ...scores,
      [q.dimension]: {
        first: scores[q.dimension].first + effectiveValue,
        count: scores[q.dimension].count + 1,
      },
    }
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
    setScores({
      EI: { first: 0, count: 0 },
      SN: { first: 0, count: 0 },
      TF: { first: 0, count: 0 },
      JP: { first: 0, count: 0 },
    })
    setDone(false)
    setEmail('')
    setEmailSubmitted(false)
  }

  // Landing screen
  if (!started) {
    const dims: Dimension[] = ['EI', 'SN', 'TF', 'JP']
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Quiz',
      name: 'Free 16 Personality Types Test',
      description: 'A free 16-question personality type test based on Jungian cognitive functions. Discover your type from INFJ to ESTP with instant results and detailed descriptions. No signup required.',
      url: 'https://innermind.app/quiz/16-types',
      educationalLevel: 'beginner',
      timeRequired: 'PT3M',
      numberOfQuestions: 16,
      about: { '@type': 'Thing', name: '16 Personality Types (Jungian Typology)' },
      author: { '@type': 'Organization', name: 'Innermind', url: 'https://innermind.app' },
      provider: { '@type': 'Organization', name: 'Innermind', url: 'https://innermind.app' },
    }

    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4 py-16">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="max-w-xl w-full text-center space-y-8">
          <div className="space-y-2">
            <p className="text-violet-400 text-sm font-medium tracking-widest uppercase">Free Quiz</p>
            <h1 className="text-4xl font-bold tracking-tight">Free 16 Personality Types Test</h1>
            <p className="text-white/60 text-lg mt-4">
              16 questions. Instant results. No signup required.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 text-left">
            {dims.map((dim) => {
              const d = DIMENSION_INFO[dim]
              return (
                <div key={dim} className={`rounded-xl border p-4 flex items-center gap-4 ${d.bg}`}>
                  <div className={`w-2 h-8 rounded-full ${d.bar} flex-shrink-0`} />
                  <div>
                    <p className={`font-semibold text-sm ${d.color}`}>{d.label}</p>
                    <p className="text-white/50 text-xs mt-0.5">{d.first} vs {d.second}</p>
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
            Based on Jungian cognitive functions. Discover your type from INFJ to ESTP. Takes about 3 minutes.
          </p>
        </div>
      </div>
    )
  }

  // Results screen
  if (done) {
    const typeCode = computeType(scores)
    const typeInfo = SIXTEEN_TYPES[typeCode] ?? SIXTEEN_TYPES['INFP']
    const dims: Dimension[] = ['EI', 'SN', 'TF', 'JP']

    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full space-y-8">
          {/* Type hero */}
          <div className={`rounded-2xl border p-8 text-center space-y-3 ${typeInfo.bg}`}>
            <p className="text-white/40 text-sm uppercase tracking-widest">Your Personality Type</p>
            <div className={`text-6xl font-black tracking-tight ${typeInfo.color}`}>{typeCode}</div>
            <div className={`text-xl font-semibold ${typeInfo.color}`}>{typeInfo.name}</div>
            <p className="text-white/70 text-sm leading-relaxed">{typeInfo.description}</p>
          </div>

          {/* Famous people */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Famous {typeCode}s</p>
            <div className="flex flex-wrap gap-2">
              {typeInfo.famous.map((name) => (
                <span
                  key={name}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium ${typeInfo.bg} ${typeInfo.color}`}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Dimension breakdown */}
          <div className="space-y-3">
            <p className="text-white/40 text-xs uppercase tracking-widest">Your Dimension Scores</p>
            {dims.map((dim) => {
              const d = DIMENSION_INFO[dim]
              const pct = getDimPct(scores, dim)
              const dominant = pct >= 50 ? d.first : d.second
              const dominantPct = pct >= 50 ? pct : 100 - pct
              return (
                <div key={dim} className={`rounded-xl border p-4 ${d.bg}`}>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className={`font-semibold text-sm ${d.color}`}>{dominant}</span>
                    <span className={`text-lg font-bold ${d.color}`}>{dominantPct}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/60 mb-2">
                    <span>{d.first}</span>
                    <div className="flex-1 bg-white/10 rounded-full h-2">
                      <div
                        className={`${d.bar} h-2 rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span>{d.second}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Upsell / email capture */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <p className="text-white/60 text-sm">
              Your 16 personality type is just one dimension of who you are.
            </p>
            <p className="text-white font-medium">
              Innermind goes deeper — AI synthesis connecting your 16-type result to Big Five, Enneagram, attachment style, and Jungian archetypes.
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
            quizName="16 Types"
            teaserText="Your cognitive function stack is just one dimension. See how your type connects to your Big Five traits, attachment style, Enneagram motivations, and core values in a full AI-synthesized portrait."
            freeItems={[
              'Your 4-letter type (e.g. INFJ)',
              'Cognitive function stack overview',
              'Generic type description',
            ]}
            proItems={[
              'How your type shows up differently under stress',
              'Your inferior function — the source of most blind spots',
              'Type × attachment style: your relational wiring',
              'Leadership gaps and communication recommendations',
              'Career alignment beyond the generic list',
              'Full 7-framework AI portrait with unlimited coach access',
            ]}
          />

          <RelatedQuizzes currentQuiz="16-types" />

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
  const dim = DIMENSION_INFO[question.dimension]

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

        {/* Dimension badge */}
        <div className="flex justify-center">
          <span className={`text-xs font-medium tracking-widest uppercase ${dim.color} px-3 py-1 rounded-full border ${dim.bg}`}>
            {dim.first} vs {dim.second}
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
