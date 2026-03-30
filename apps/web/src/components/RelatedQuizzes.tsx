'use client'

import Link from 'next/link'

interface Quiz {
  slug: string
  name: string
  tagline: string
  color: string
}

interface RelatedPost {
  slug: string
  title: string
  description: string
}

const ALL_QUIZZES: Quiz[] = [
  { slug: 'big-five', name: 'Big Five (OCEAN)', tagline: 'The gold standard of personality science', color: 'violet' },
  { slug: 'attachment-style', name: 'Attachment Style', tagline: 'How you bond in relationships', color: 'sky' },
  { slug: 'enneagram', name: 'Enneagram', tagline: 'Your core motivations and growth path', color: 'amber' },
  { slug: 'dark-triad', name: 'Dark Triad', tagline: 'Your shadow traits measured', color: 'red' },
  { slug: '16-types', name: '16 Personality Types', tagline: 'Your cognitive function stack', color: 'emerald' },
  { slug: 'love-language', name: '5 Love Languages', tagline: 'How you give and receive love', color: 'rose' },
  { slug: 'disc', name: 'DISC Profile', tagline: 'Your behavioral style at work', color: 'teal' },
  { slug: 'eq', name: 'Emotional Intelligence', tagline: 'Your EQ across 5 dimensions', color: 'orange' },
  { slug: 'riasec', name: 'Holland Code (RIASEC)', tagline: 'Career interests and work style', color: 'indigo' },
]

const RELATED_POSTS: Record<string, RelatedPost[]> = {
  'big-five': [
    {
      slug: 'what-is-big-five-personality-test',
      title: 'What Is the Big Five Personality Test?',
      description: 'The science behind OCEAN — how it works and what your scores actually predict.',
    },
    {
      slug: 'big-five-vs-mbti',
      title: 'Big Five vs MBTI: Which Is More Accurate?',
      description: 'An honest comparison of the two most well-known personality frameworks.',
    },
    {
      slug: 'neuroscience-of-personality',
      title: 'The Neuroscience of Personality',
      description: 'What biology reveals about where your Big Five traits come from.',
    },
  ],
  '16-types': [
    {
      slug: 'free-16-personality-types-test',
      title: 'Free 16 Personality Types Test: Full Guide',
      description: 'What the 16 types measure, how they are scored, and what the research says.',
    },
    {
      slug: 'big-five-vs-mbti',
      title: 'Big Five vs MBTI: Which Is More Accurate?',
      description: 'How the 16 types compare to the gold standard of personality science.',
    },
    {
      slug: 'enneagram-vs-16-personalities',
      title: 'Enneagram vs 16 Personalities: Key Differences',
      description: 'Two popular personality systems — what each one actually measures.',
    },
  ],
  'attachment-style': [
    {
      slug: 'attachment-styles-explained',
      title: 'Attachment Styles Explained',
      description: 'The science of secure, anxious, avoidant, and disorganized attachment.',
    },
    {
      slug: 'anxious-attachment-style',
      title: 'Anxious Attachment Style: Signs & Patterns',
      description: 'What anxious attachment looks like in relationships and how it develops.',
    },
    {
      slug: 'enneagram-attachment-style',
      title: 'Enneagram and Attachment Style',
      description: 'How your core type and relational blueprint interact.',
    },
  ],
  'dark-triad': [
    {
      slug: 'dark-triad-personality-traits',
      title: 'Dark Triad Personality Traits Explained',
      description: 'What narcissism, Machiavellianism, and psychopathy actually mean — and how they overlap.',
    },
    {
      slug: 'what-is-big-five-personality-test',
      title: 'What Is the Big Five Personality Test?',
      description: 'How Dark Triad traits map onto Agreeableness and Conscientiousness in OCEAN.',
    },
    {
      slug: 'personality-and-career',
      title: 'Personality and Career',
      description: 'How your trait profile shapes career fit and working style.',
    },
  ],
  disc: [
    {
      slug: 'disc-personality-assessment-guide',
      title: 'DISC Personality Assessment: Complete Guide',
      description: 'What Dominance, Influence, Steadiness, and Compliance measure — and how to use your results.',
    },
    {
      slug: 'personality-and-career',
      title: 'Personality and Career',
      description: 'How trait profiles predict career fit, leadership style, and team dynamics.',
    },
    {
      slug: 'what-is-big-five-personality-test',
      title: 'What Is the Big Five Personality Test?',
      description: 'How DISC compares to the most scientifically validated personality model.',
    },
  ],
  enneagram: [
    {
      slug: 'enneagram-vs-big-five',
      title: 'Enneagram vs Big Five: What Each Reveals',
      description: 'Two powerful frameworks — how they complement each other.',
    },
    {
      slug: 'enneagram-attachment-style',
      title: 'Enneagram and Attachment Style',
      description: 'Your core motivations plus your relational blueprint — read together.',
    },
    {
      slug: 'enneagram-stress-response',
      title: 'Enneagram Stress Response',
      description: 'How each type behaves under pressure and what triggers each type\'s defenses.',
    },
  ],
  eq: [
    {
      slug: 'attachment-styles-explained',
      title: 'Attachment Styles Explained',
      description: 'How early relational patterns shape your emotional intelligence today.',
    },
    {
      slug: 'how-to-use-psychology-to-understand-yourself',
      title: 'How to Use Psychology to Understand Yourself',
      description: 'A practical guide to applying validated frameworks to your life.',
    },
    {
      slug: 'personality-and-career',
      title: 'Personality and Career',
      description: 'How emotional intelligence and trait profiles shape career outcomes.',
    },
  ],
  'love-language': [
    {
      slug: 'five-love-languages-explained',
      title: 'The Five Love Languages Explained',
      description: 'What each love language reveals about how you connect with others.',
    },
    {
      slug: 'attachment-styles-explained',
      title: 'Attachment Styles Explained',
      description: 'How attachment patterns interact with the way you give and receive love.',
    },
    {
      slug: 'enneagram-attachment-style',
      title: 'Enneagram and Attachment Style',
      description: 'Your motivations and relational blueprint — the deeper layer beneath love languages.',
    },
  ],
}

const colorBorder: Record<string, string> = {
  violet: 'border-violet-500/30 hover:border-violet-400/50',
  sky: 'border-sky-500/30 hover:border-sky-400/50',
  amber: 'border-amber-500/30 hover:border-amber-400/50',
  red: 'border-red-500/30 hover:border-red-400/50',
  emerald: 'border-emerald-500/30 hover:border-emerald-400/50',
  rose: 'border-rose-500/30 hover:border-rose-400/50',
  teal: 'border-teal-500/30 hover:border-teal-400/50',
  orange: 'border-orange-500/30 hover:border-orange-400/50',
  indigo: 'border-indigo-500/30 hover:border-indigo-400/50',
}

interface RelatedQuizzesProps {
  /** Slug of the current quiz (to exclude it) */
  currentQuiz: string
  /** Max quizzes to show */
  limit?: number
}

export function RelatedQuizzes({ currentQuiz, limit = 3 }: RelatedQuizzesProps) {
  const related = ALL_QUIZZES.filter((q) => q.slug !== currentQuiz).slice(0, limit)
  const relatedPosts = RELATED_POSTS[currentQuiz] ?? []

  return (
    <div className="mt-8 space-y-6">
      {/* Related quizzes */}
      <div>
        <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wider mb-4 text-center">
          Explore More Quizzes
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {related.map((quiz) => (
            <Link
              key={quiz.slug}
              href={`/quiz/${quiz.slug}`}
              className={`block rounded-xl border ${colorBorder[quiz.color]} bg-stone-900/50 p-4 transition-all hover:bg-stone-900`}
            >
              <p className="text-sm font-semibold text-stone-100">{quiz.name}</p>
              <p className="text-xs text-stone-500 mt-1">{quiz.tagline}</p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-3">
          <Link href="/quizzes" className="text-xs text-stone-500 hover:text-stone-300 transition-colors">
            See all 9 free quizzes &rarr;
          </Link>
        </div>
      </div>

      {/* Related blog posts */}
      {relatedPosts.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wider mb-4 text-center">
            Learn More
          </h3>
          <div className="space-y-2">
            {relatedPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block rounded-xl border border-stone-800/60 bg-stone-900/30 px-4 py-3 transition-all hover:bg-stone-900/60 hover:border-stone-700 group"
              >
                <p className="text-sm font-medium text-stone-300 group-hover:text-stone-100 transition-colors leading-snug">
                  {post.title}
                </p>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed group-hover:text-stone-500 transition-colors">
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
