import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free DISC Personality Test — Instant Results | Innermind',
  description:
    'Take our free 28-question DISC personality test. Discover your Dominance, Influence, Steadiness, and Conscientiousness scores and get your personalised DISC profile instantly.',
  openGraph: {
    title: 'Free DISC Personality Test — Instant Results | Innermind',
    description:
      'Take our free 28-question DISC personality test. Discover your Dominance, Influence, Steadiness, and Conscientiousness scores and get your personalised DISC profile instantly.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free DISC Personality Test — Instant Results | Innermind',
    description:
      'Take our free 28-question DISC personality test. Discover your Dominance, Influence, Steadiness, and Conscientiousness scores and get your personalised DISC profile instantly.',
  },
}

export default function DISCLayout({ children }: { children: React.ReactNode }) {
  return children
}
