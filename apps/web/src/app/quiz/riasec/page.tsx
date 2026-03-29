'use client'

import Link from 'next/link'
import { useState } from 'react'
import { QuizUpgradeCard } from '@/components/QuizUpgradeCard'

type RIASECType = 'R' | 'I' | 'A' | 'S' | 'E' | 'C'

interface Question {
  text: string
  type: RIASECType
}

const QUESTIONS: Question[] = [
  // Realistic — practical, physical, hands-on, mechanical
  { text: 'I enjoy working with tools, machines, or physical equipment.', type: 'R' },
  { text: 'I prefer outdoor activities and working with my hands.', type: 'R' },
  { text: 'I like building or repairing things around the house.', type: 'R' },
  { text: 'I am comfortable reading technical manuals and diagrams.', type: 'R' },
  { text: 'I prefer practical tasks over abstract or theoretical ones.', type: 'R' },
  { text: 'I enjoy physical work that produces a tangible result.', type: 'R' },
  // Investigative — analytical, intellectual, scientific, curious
  { text: 'I enjoy solving complex problems and puzzles.', type: 'I' },
  { text: 'I like to research and analyse data before drawing conclusions.', type: 'I' },
  { text: 'I am curious about how the natural world works.', type: 'I' },
  { text: 'I enjoy reading scientific articles or academic research.', type: 'I' },
  { text: 'I prefer to understand things deeply rather than accept surface answers.', type: 'I' },
  { text: 'I enjoy laboratory or experimental work.', type: 'I' },
  // Artistic — creative, expressive, original, independent
  { text: 'I enjoy expressing myself through art, writing, or music.', type: 'A' },
  { text: 'I value originality and dislike rigid rules or routines.', type: 'A' },
  { text: 'I am drawn to creative projects that allow for self-expression.', type: 'A' },
  { text: 'I enjoy visiting museums, galleries, or attending performances.', type: 'A' },
  { text: 'I often see things from an unconventional or imaginative angle.', type: 'A' },
  { text: 'I prefer open-ended tasks over structured, step-by-step procedures.', type: 'A' },
  // Social — helpful, cooperative, empathetic, people-oriented
  { text: 'I enjoy helping others learn or develop new skills.', type: 'S' },
  { text: 'I find it easy to empathise with people in difficult situations.', type: 'S' },
  { text: 'I prefer working in teams over working alone.', type: 'S' },
  { text: 'I am drawn to roles that involve counselling or supporting others.', type: 'S' },
  { text: 'I care deeply about social issues and community wellbeing.', type: 'S' },
  { text: 'I get energy from meaningful conversations and human connection.', type: 'S' },
  // Enterprising — ambitious, persuasive, leadership-oriented, competitive
  { text: 'I enjoy leading projects and influencing others towards a goal.', type: 'E' },
  { text: 'I am comfortable taking risks to achieve big outcomes.', type: 'E' },
  { text: 'I enjoy selling ideas, products, or solutions to others.', type: 'E' },
  { text: 'I thrive in competitive environments where results are measured.', type: 'E' },
  { text: 'I am energised by entrepreneurial or start-up challenges.', type: 'E' },
  { text: 'I prefer setting strategy over executing routine tasks.', type: 'E' },
  // Conventional — organised, detail-oriented, structured, data-driven
  { text: 'I enjoy organising files, data, and information systematically.', type: 'C' },
  { text: 'I prefer clear rules, procedures, and well-defined expectations.', type: 'C' },
  { text: 'I am accurate and careful with numbers and financial records.', type: 'C' },
  { text: 'I like following established processes rather than improvising.', type: 'C' },
  { text: 'I enjoy administrative or clerical work that keeps things in order.', type: 'C' },
  { text: 'I find satisfaction in completing checklists and hitting targets precisely.', type: 'C' },
]

const SCALE = [
  { label: 'Strongly Disagree', value: 1 },
  { label: 'Disagree', value: 2 },
  { label: 'Neutral', value: 3 },
  { label: 'Agree', value: 4 },
  { label: 'Strongly Agree', value: 5 },
]

const TYPE_INFO: Record<
  RIASECType,
  { label: string; full: string; color: string; bar: string; bg: string; tagline: string; emoji: string }
> = {
  R: {
    label: 'R',
    full: 'Realistic',
    color: 'text-orange-400',
    bar: 'bg-orange-500',
    bg: 'bg-orange-500/10 border-orange-500/30',
    tagline: 'Practical, hands-on, and technically skilled',
    emoji: '🔧',
  },
  I: {
    label: 'I',
    full: 'Investigative',
    color: 'text-sky-400',
    bar: 'bg-sky-500',
    bg: 'bg-sky-500/10 border-sky-500/30',
    tagline: 'Analytical, curious, and research-driven',
    emoji: '🔬',
  },
  A: {
    label: 'A',
    full: 'Artistic',
    color: 'text-pink-400',
    bar: 'bg-pink-500',
    bg: 'bg-pink-500/10 border-pink-500/30',
    tagline: 'Creative, expressive, and original',
    emoji: '🎨',
  },
  S: {
    label: 'S',
    full: 'Social',
    color: 'text-emerald-400',
    bar: 'bg-emerald-500',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    tagline: 'Helpful, empathetic, and people-focused',
    emoji: '🤝',
  },
  E: {
    label: 'E',
    full: 'Enterprising',
    color: 'text-amber-400',
    bar: 'bg-amber-500',
    bg: 'bg-amber-500/10 border-amber-500/30',
    tagline: 'Ambitious, persuasive, and leadership-oriented',
    emoji: '🚀',
  },
  C: {
    label: 'C',
    full: 'Conventional',
    color: 'text-violet-400',
    bar: 'bg-violet-500',
    bg: 'bg-violet-500/10 border-violet-500/30',
    tagline: 'Organised, detail-oriented, and structured',
    emoji: '📊',
  },
}

const TYPE_DESCRIPTIONS: Record<
  RIASECType,
  { description: string; strengths: string; challenges: string; careers: string[] }
> = {
  R: {
    description:
      'You are a natural builder and problem-solver who thrives when working with the physical world. You prefer tasks that have a clear, tangible outcome — whether that is constructing something, operating machinery, or perfecting a craft. Theory takes a back seat to hands-on action.',
    strengths: 'Technical skill, physical dexterity, mechanical aptitude, practical problem-solving',
    challenges: 'Abstract or theoretical tasks, large social or verbal demands, open-ended creativity',
    careers: ['Engineer', 'Electrician', 'Carpenter', 'Mechanic', 'Chef', 'Architect', 'Farmer', 'Pilot', 'Surgeon'],
  },
  I: {
    description:
      'You are an intellectual explorer driven by curiosity and the desire to understand how things work. You love digging into data, running experiments, and building mental models of the world. You are most alive when wrestling with a genuinely hard question.',
    strengths: 'Analytical thinking, independent research, systematic investigation, intellectual depth',
    challenges: 'Repetitive routine tasks, high-pressure sales or persuasion, managing large social groups',
    careers: ['Scientist', 'Doctor', 'Researcher', 'Pharmacist', 'Data Analyst', 'Economist', 'Psychologist', 'Software Engineer'],
  },
  A: {
    description:
      'You are a creative spirit who expresses your inner world through art, writing, design, or performance. You resist rigid structure and thrive on originality. Your ability to perceive beauty and communicate emotion is your greatest gift.',
    strengths: 'Creativity, originality, aesthetic sensibility, expressive communication',
    challenges: 'Highly structured environments, routine administrative work, quantitative analysis',
    careers: ['Graphic Designer', 'Writer', 'Musician', 'Photographer', 'Art Director', 'UX Designer', 'Filmmaker', 'Architect'],
  },
  S: {
    description:
      'You are a natural helper whose purpose is found in the growth and wellbeing of others. You listen deeply, connect easily, and feel genuine satisfaction when you see someone you have supported succeed. Community and collaboration are not obligations — they are your energy source.',
    strengths: 'Empathy, communication, teaching, conflict resolution, community building',
    challenges: 'Purely technical or isolated work, highly competitive environments, working without human interaction',
    careers: ['Teacher', 'Nurse', 'Counsellor', 'Social Worker', 'HR Manager', 'Therapist', 'Community Organiser', 'Coach'],
  },
  E: {
    description:
      'You are a natural leader and influencer who thrives on vision, persuasion, and results. You see the big picture, rally others behind it, and push through obstacles with competitive energy. You are most alive when something real is at stake.',
    strengths: 'Leadership, negotiation, strategic thinking, high-stakes decision-making, motivation',
    challenges: 'Detailed analytical or scientific work, highly structured routine tasks, passive or support roles',
    careers: ['Entrepreneur', 'Sales Manager', 'Lawyer', 'Politician', 'Marketing Director', 'Real Estate Agent', 'Executive', 'Consultant'],
  },
  C: {
    description:
      'You are a meticulous organiser who creates order out of complexity. You thrive in environments with clear rules, defined processes, and measurable outcomes. Your precision and reliability make you the person everyone depends on to get the details right.',
    strengths: 'Organisation, accuracy, data management, process adherence, reliability',
    challenges: 'Ambiguous or creative tasks, highly social roles, rapid unplanned change',
    careers: ['Accountant', 'Financial Analyst', 'Auditor', 'Database Administrator', 'Office Manager', 'Actuary', 'Compliance Officer', 'Logistics Coordinator'],
  },
}

const CODE_TITLES: Record<string, string> = {
  RI: 'The Technical Investigator',
  IR: 'The Applied Scientist',
  RA: 'The Craftsman-Creator',
  AR: 'The Design Engineer',
  RS: 'The Practical Supporter',
  SR: 'The Hands-On Helper',
  RE: 'The Field Leader',
  ER: 'The Operations Boss',
  RC: 'The Technical Administrator',
  CR: 'The Precision Technician',
  IA: 'The Creative Intellectual',
  AI: 'The Intellectual Artist',
  IS: 'The Scientific Helper',
  SI: 'The Research Counsellor',
  IE: 'The Strategic Analyst',
  EI: 'The Data-Driven Leader',
  IC: 'The Research Organiser',
  CI: 'The Analytical Administrator',
  AS: 'The Expressive Educator',
  SA: 'The Empathetic Creator',
  AE: 'The Creative Entrepreneur',
  EA: 'The Visionary Leader',
  AC: 'The Design Organiser',
  CA: 'The Structured Creator',
  SE: 'The Social Entrepreneur',
  ES: 'The People-First Leader',
  SC: 'The Supportive Administrator',
  CS: 'The Organised Helper',
  EC: 'The Business Leader',
  CE: 'The Strategic Organiser',
}

type TypeScores = Record<RIASECType, number>

function getTypePct(scores: TypeScores, type: RIASECType): number {
  const qCount = QUESTIONS.filter((q) => q.type === type).length
  if (qCount === 0) return 0
  return Math.round((scores[type] / (qCount * 5)) * 100)
}

function computeHollandCode(scores: TypeScores): { primary: RIASECType; secondary: RIASECType; code: string } {
  const types: RIASECType[] = ['R', 'I', 'A', 'S', 'E', 'C']
  const sorted = types.slice().sort((a, b) => getTypePct(scores, b) - getTypePct(scores, a))
  const primary = sorted[0]
  const secondary = sorted[1]
  return { primary, secondary, code: `${primary}${secondary}` }
}

export default function RIASECQuiz() {
  const [started, setStarted] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [scores, setScores] = useState<TypeScores>({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 })
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
    setScores({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 })
    setDone(false)
    setEmail('')
    setEmailSubmitted(false)
  }

  // ── Landing screen ───────────────────────────────────────────────────────────
  if (!started) {
    const types: RIASECType[] = ['R', 'I', 'A', 'S', 'E', 'C']
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full text-center space-y-8">
          <div className="space-y-2">
            <p className="text-violet-400 text-sm font-medium tracking-widest uppercase">Free Career Test</p>
            <h1 className="text-4xl font-bold tracking-tight">Free Holland Code Career Test</h1>
            <p className="text-white/60 text-lg mt-4">
              36 questions. Instant results. Discover your RIASEC career type.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 text-left">
            {types.map((type) => {
              const t = TYPE_INFO[type]
              return (
                <div key={type} className={`rounded-xl border p-4 flex items-center gap-4 ${t.bg}`}>
                  <div className={`w-10 h-10 rounded-full ${t.bar} flex items-center justify-center text-white font-black text-base flex-shrink-0`}>
                    {t.emoji}
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${t.color}`}>{t.full} ({type})</p>
                    <p className="text-white/50 text-xs mt-0.5">{t.tagline}</p>
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
            Based on John Holland&apos;s validated theory of career interests. Used by career counsellors worldwide. Takes about 5 minutes.
          </p>
        </div>
      </div>
    )
  }

  // ── Results screen ───────────────────────────────────────────────────────────
  if (done) {
    const types: RIASECType[] = ['R', 'I', 'A', 'S', 'E', 'C']
    const { primary, secondary, code } = computeHollandCode(scores)
    const primaryInfo = TYPE_INFO[primary]
    const primaryDesc = TYPE_DESCRIPTIONS[primary]
    const secondaryInfo = TYPE_INFO[secondary]
    const title = CODE_TITLES[code] ?? `The ${primaryInfo.full} ${secondaryInfo.full}`

    const scoreLines = types.map((t) => `${t}:${getTypePct(scores, t)}%`).join(' ')
    const shareText = `My Holland Code is ${code} — "${title}" (${scoreLines}). Find your career type:`

    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full space-y-8">

          {/* Profile hero */}
          <div className={`rounded-2xl border p-8 text-center space-y-3 ${primaryInfo.bg}`}>
            <p className="text-white/40 text-sm uppercase tracking-widest">Your Holland Code</p>
            <div className={`text-6xl font-black tracking-tight ${primaryInfo.color}`}>{code}</div>
            <div className={`text-xl font-semibold ${primaryInfo.color}`}>{title}</div>
            <p className="text-white/70 text-sm leading-relaxed">
              Your primary interest type is <span className={primaryInfo.color}>{primaryInfo.full}</span> with a strong{' '}
              <span className={secondaryInfo.color}>{secondaryInfo.full}</span> influence.
            </p>
          </div>

          {/* Bar charts */}
          <div className="space-y-4">
            <p className="text-white/40 text-xs uppercase tracking-widest">Your RIASEC Scores</p>
            {types.map((type) => {
              const t = TYPE_INFO[type]
              const pct = getTypePct(scores, type)
              const isPrimary = type === primary
              const isSecondary = type === secondary
              return (
                <div key={type} className={`rounded-xl border p-5 ${t.bg}`}>
                  <div className="flex justify-between items-baseline mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{t.emoji}</span>
                      <span className={`font-bold text-base ${t.color}`}>{t.full}</span>
                      {isPrimary && (
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${t.bg} ${t.color}`}>
                          Primary
                        </span>
                      )}
                      {isSecondary && (
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${t.bg} ${t.color}`}>
                          Secondary
                        </span>
                      )}
                    </div>
                    <span className={`text-xl font-bold ${t.color}`}>{pct}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                    <div
                      className={`${t.bar} h-2 rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-white/60 text-xs leading-relaxed">{TYPE_DESCRIPTIONS[type].description.split('.')[0]}.</p>
                </div>
              )
            })}
          </div>

          {/* Primary type deep-dive */}
          <div className={`rounded-2xl border p-6 space-y-4 ${primaryInfo.bg}`}>
            <p className={`text-xs font-medium tracking-widest uppercase ${primaryInfo.color}`}>
              {primaryInfo.full} Type — Strengths, Challenges & Careers
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Core Strengths</p>
                <p className="text-white/80 text-sm leading-relaxed">{primaryDesc.strengths}</p>
              </div>
              <div className="h-px bg-white/10" />
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Watch Out For</p>
                <p className="text-white/80 text-sm leading-relaxed">{primaryDesc.challenges}</p>
              </div>
              <div className="h-px bg-white/10" />
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Best-Fit Careers</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {primaryDesc.careers.map((career) => (
                    <span
                      key={career}
                      className={`text-xs px-3 py-1 rounded-full border font-medium ${primaryInfo.bg} ${primaryInfo.color}`}
                    >
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Secondary type careers */}
          <div className={`rounded-2xl border p-6 space-y-3 ${secondaryInfo.bg}`}>
            <p className={`text-xs font-medium tracking-widest uppercase ${secondaryInfo.color}`}>
              {secondaryInfo.full} Type — Your Secondary Strength
            </p>
            <p className="text-white/70 text-sm leading-relaxed">{TYPE_DESCRIPTIONS[secondary].description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {TYPE_DESCRIPTIONS[secondary].careers.map((career) => (
                <span
                  key={career}
                  className={`text-xs px-3 py-1 rounded-full border font-medium ${secondaryInfo.bg} ${secondaryInfo.color}`}
                >
                  {career}
                </span>
              ))}
            </div>
          </div>

          {/* Share hook */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
            <p className="text-white/60 text-sm font-medium">Share your Holland Code with friends</p>
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
              Share My Holland Code
            </button>
          </div>

          {/* Upsell / email capture */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <p className="text-white/60 text-sm">
              Your Holland Code reveals your career interests — but not the deeper psychology driving them.
            </p>
            <p className="text-white font-medium">
              Innermind connects your RIASEC profile with your Big Five personality, Enneagram type, attachment style, and Jungian archetypes — synthesised by AI into a complete psychological portrait.
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
            quizName="Holland Code"
            teaserText="Your career interests are shaped by your personality traits, values, and motivations. See how your Holland Code connects to your Big Five, Enneagram, and attachment style in a full AI portrait."
            freeItems={[
              'Your two-letter Holland Code',
              'Career suggestions for your primary type',
              'Static snapshot — no growth or stress context',
            ]}
            proItems={[
              'Holland Code × Big Five career compatibility map',
              'How your Enneagram type shapes your work motivation',
              'Career environments where you will thrive vs. burn out',
              'Blind spots holding you back in your current role',
              'Personalised career-change roadmap for your RIASEC profile',
              'Full 7-framework AI portrait with coach access',
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

  // ── Quiz screen ──────────────────────────────────────────────────────────────
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
            {typeInfo.emoji} {typeInfo.full}
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
