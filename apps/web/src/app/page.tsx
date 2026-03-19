import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-24">
      <div className="max-w-2xl text-center">
        {/* Logo mark */}
        <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20">
          <span className="text-3xl">◎</span>
        </div>

        <h1 className="mb-6 font-serif text-5xl font-medium tracking-tight text-stone-100 sm:text-6xl">
          Know yourself{' '}
          <span className="text-amber-400">deeply.</span>
        </h1>

        <p className="mb-10 text-lg text-stone-400 leading-relaxed">
          Innermind combines psychology, reflection, and symbolic wisdom to help you
          navigate life with more clarity, meaning, and agency.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-8 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
          >
            Begin your journey
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center rounded-xl border border-stone-700 px-8 py-3 text-sm font-medium text-stone-300 transition-colors hover:border-stone-500 hover:text-stone-100"
          >
            Learn more
          </Link>
        </div>
      </div>

      {/* Feature grid */}
      <div className="mt-24 grid max-w-4xl gap-6 sm:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6"
          >
            <div className="mb-3 text-2xl">{feature.icon}</div>
            <h3 className="mb-2 font-serif text-lg text-stone-100">{feature.title}</h3>
            <p className="text-sm text-stone-400 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const features = [
  {
    icon: '🧠',
    title: 'Deep Assessment',
    description:
      'AI-guided assessments that adapt to your responses, surfacing patterns you might not see yourself.',
  },
  {
    icon: '✦',
    title: 'Symbolic Wisdom',
    description:
      'Your profile woven with Jungian archetypes, values frameworks, and metaphors that resonate.',
  },
  {
    icon: '🌱',
    title: 'Longitudinal Growth',
    description:
      'Track how you evolve over time. Your profile deepens with every reflection and session.',
  },
]
