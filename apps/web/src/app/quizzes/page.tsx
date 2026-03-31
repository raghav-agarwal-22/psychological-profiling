import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Free Personality Quizzes — Innermind',
  description:
    'Take free, science-backed personality quizzes: Big Five, Attachment Style, Enneagram, Dark Triad, 16 Types, Love Language, DISC, and Emotional Intelligence. Instant results.',
  alternates: { canonical: '/quizzes' },
}

const quizzes = [
  {
    slug: 'big-five',
    name: 'Big Five (OCEAN)',
    description: 'The gold standard of personality science. Measures Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism.',
    questions: 20,
    time: '3 min',
    color: 'violet',
  },
  {
    slug: 'attachment-style',
    name: 'Attachment Style',
    description: 'Discover your relational pattern: Secure, Anxious, Avoidant, or Disorganized. Understand how you bond in close relationships.',
    questions: 20,
    time: '3 min',
    color: 'sky',
  },
  {
    slug: 'enneagram',
    name: 'Enneagram',
    description: 'Find your core type among 9 personality patterns. The Enneagram reveals your deepest motivations and growth path.',
    questions: 36,
    time: '5 min',
    color: 'amber',
  },
  {
    slug: 'dark-triad',
    name: 'Dark Triad',
    description: 'Measure your levels of Narcissism, Machiavellianism, and Psychopathy. Everyone has these traits — discover where you fall.',
    questions: 27,
    time: '4 min',
    color: 'red',
  },
  {
    slug: '16-types',
    name: '16 Personality Types',
    description: 'Discover your cognitive function stack and four-letter type. Based on Jungian cognitive functions, not MBTI binaries.',
    questions: 16,
    time: '3 min',
    color: 'emerald',
  },
  {
    slug: 'love-language',
    name: '5 Love Languages',
    description: 'Find out how you give and receive love: Words of Affirmation, Acts of Service, Gifts, Quality Time, or Physical Touch.',
    questions: 25,
    time: '4 min',
    color: 'rose',
  },
  {
    slug: 'disc',
    name: 'DISC Profile',
    description: 'Measure your behavioral style across Dominance, Influence, Steadiness, and Conscientiousness. Used by 50M+ professionals.',
    questions: 28,
    time: '4 min',
    color: 'teal',
  },
  {
    slug: 'eq',
    name: 'Emotional Intelligence (EQ)',
    description: 'Assess your emotional intelligence: self-awareness, self-regulation, motivation, empathy, and social skills.',
    questions: 30,
    time: '5 min',
    color: 'orange',
  },
  {
    slug: 'riasec',
    name: 'Holland Code (RIASEC)',
    description: 'Discover your career interests across 6 types: Realistic, Investigative, Artistic, Social, Enterprising, Conventional.',
    questions: 36,
    time: '5 min',
    color: 'indigo',
  },
]

const colorMap: Record<string, string> = {
  violet: 'border-violet-500/40 hover:border-violet-400',
  sky: 'border-sky-500/40 hover:border-sky-400',
  amber: 'border-amber-500/40 hover:border-amber-400',
  red: 'border-red-500/40 hover:border-red-400',
  emerald: 'border-emerald-500/40 hover:border-emerald-400',
  rose: 'border-rose-500/40 hover:border-rose-400',
  teal: 'border-teal-500/40 hover:border-teal-400',
  orange: 'border-orange-500/40 hover:border-orange-400',
  indigo: 'border-indigo-500/40 hover:border-indigo-400',
}

const badgeMap: Record<string, string> = {
  violet: 'bg-violet-500/10 text-violet-400',
  sky: 'bg-sky-500/10 text-sky-400',
  amber: 'bg-amber-500/10 text-amber-400',
  red: 'bg-red-500/10 text-red-400',
  emerald: 'bg-emerald-500/10 text-emerald-400',
  rose: 'bg-rose-500/10 text-rose-400',
  teal: 'bg-teal-500/10 text-teal-400',
  orange: 'bg-orange-500/10 text-orange-400',
  indigo: 'bg-indigo-500/10 text-indigo-400',
}

export default function QuizzesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Free Personality Quizzes — Innermind',
    description: 'Free, science-backed personality quizzes with instant results.',
    url: 'https://innermindhealing.com/quizzes',
    hasPart: quizzes.map((q) => ({
      '@type': 'Quiz',
      name: q.name,
      description: q.description,
      url: `https://innermindhealing.com/quiz/${q.slug}`,
      numberOfQuestions: q.questions,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-400 mb-4">
            100% Free &middot; Instant Results
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-stone-100 sm:text-5xl">
            Free Personality Quizzes
          </h1>
          <p className="mt-4 text-lg text-stone-400 max-w-2xl mx-auto">
            Explore 9 science-backed assessments. Each quiz takes 3-5 minutes and gives you instant, detailed results. No account required.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quizzes.map((quiz) => (
            <Link
              key={quiz.slug}
              href={`/quiz/${quiz.slug}`}
              className={`group block rounded-xl border ${colorMap[quiz.color]} bg-stone-900/50 p-6 transition-all hover:bg-stone-900`}
            >
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-semibold text-stone-100 group-hover:text-white transition-colors">
                  {quiz.name}
                </h2>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeMap[quiz.color]}`}>
                  {quiz.questions}q &middot; {quiz.time}
                </span>
              </div>
              <p className="mt-2 text-sm text-stone-400 leading-relaxed">
                {quiz.description}
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-stone-300 group-hover:text-amber-400 transition-colors">
                Take the quiz &rarr;
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center rounded-2xl border border-stone-800 bg-stone-900/50 p-8">
          <h2 className="text-2xl font-bold text-stone-100">Want the Complete Picture?</h2>
          <p className="mt-2 text-stone-400 max-w-lg mx-auto">
            Individual quizzes are powerful. But the real insight comes when AI connects the patterns
            across all your results into one unified psychological portrait.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-950 hover:bg-amber-400 transition-colors"
            >
              Get Your Full AI Portrait
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center justify-center rounded-lg border border-stone-700 px-6 py-3 text-sm font-semibold text-stone-200 hover:bg-stone-800 transition-colors"
            >
              Compare with Other Tests
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
