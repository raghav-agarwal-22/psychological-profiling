import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About — Innermind',
  description: 'Innermind combines psychology, reflection, and symbolic wisdom to help people navigate life with more clarity, meaning, and agency.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {/* Hero */}
      <div className="mb-16 text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20">
          <span className="text-3xl">◎</span>
        </div>
        <h1 className="font-serif text-4xl text-stone-100">About Innermind</h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-400">
          The world's most thoughtful platform for self-understanding.
        </p>
      </div>

      {/* Mission */}
      <div className="mb-12 rounded-2xl border border-stone-800 bg-stone-900/50 p-8">
        <h2 className="mb-4 font-serif text-2xl text-stone-200">Our mission</h2>
        <p className="leading-relaxed text-stone-400">
          Innermind combines psychology, reflection, and symbolic wisdom to help people navigate
          life with more clarity, meaning, and agency. We believe that self-understanding is the
          foundation of a well-lived life — and that modern AI can make deep psychological insight
          accessible to everyone.
        </p>
      </div>

      {/* What we do */}
      <div className="mb-12">
        <h2 className="mb-6 font-serif text-2xl text-stone-200">What we offer</h2>
        <div className="space-y-4">
          {[
            {
              icon: '◎',
              title: 'Science-backed assessments',
              description: 'Big Five personality, Schwartz values, attachment style, Enneagram, and more — built on peer-reviewed psychology research.',
            },
            {
              icon: '◈',
              title: 'AI-powered insights',
              description: 'Claude, Anthropic\'s AI, synthesizes your results into a personal narrative and actionable growth recommendations.',
            },
            {
              icon: '◉',
              title: 'Psychological profiles',
              description: 'A living portrait of your inner world — archetypes, values, strengths, blind spots, and personality dimensions.',
            },
            {
              icon: '⇌',
              title: 'Compatibility mapping',
              description: 'Compare psychological profiles side-by-side to understand how you relate to others.',
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 rounded-xl border border-stone-800 bg-stone-900/30 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-800 text-lg text-stone-300">
                {item.icon}
              </div>
              <div>
                <h3 className="mb-1 font-medium text-stone-200">{item.title}</h3>
                <p className="text-sm leading-relaxed text-stone-400">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Built on */}
      <div className="mb-12 rounded-2xl border border-stone-800 bg-stone-900/50 p-8">
        <h2 className="mb-4 font-serif text-2xl text-stone-200">Built on solid foundations</h2>
        <p className="mb-4 leading-relaxed text-stone-400">
          Every assessment on Innermind is grounded in validated psychological research:
        </p>
        <ul className="space-y-2 text-sm text-stone-400">
          <li className="flex items-start gap-2"><span className="mt-0.5 text-amber-500">✦</span> Big Five (OCEAN) — Costa &amp; McCrae, 1992</li>
          <li className="flex items-start gap-2"><span className="mt-0.5 text-amber-500">✦</span> Schwartz Values Theory — Shalom Schwartz, 1992</li>
          <li className="flex items-start gap-2"><span className="mt-0.5 text-amber-500">✦</span> Attachment Theory — Bowlby &amp; Ainsworth</li>
          <li className="flex items-start gap-2"><span className="mt-0.5 text-amber-500">✦</span> Enneagram — 9-type personality system</li>
          <li className="flex items-start gap-2"><span className="mt-0.5 text-amber-500">✦</span> Light Triad — Kaufman et al., 2019</li>
          <li className="flex items-start gap-2"><span className="mt-0.5 text-amber-500">✦</span> Jungian archetypes — Carl Jung</li>
        </ul>
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center">
        <p className="mb-2 font-serif text-xl text-stone-200">Ready to know yourself?</p>
        <p className="mb-6 text-stone-400">Take your first assessment — free, no credit card required.</p>
        <Link
          href="/auth/login"
          className="inline-block rounded-xl bg-amber-500 px-8 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
        >
          Begin your journey
        </Link>
      </div>
    </div>
  )
}
