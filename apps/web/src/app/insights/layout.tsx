import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Growth Insights',
  description:
    'Track your psychological growth over time across multiple frameworks. Visualise how your personality, values, and attachment patterns evolve across reassessments.',
  robots: { index: false, follow: true },
}

export default function InsightsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
