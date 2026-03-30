import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Big Five Personality Test — Instant Results | Innermind',
  description:
    'Take our free 20-question Big Five personality test. Discover your Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism scores instantly.',
  openGraph: {
    title: 'Free Big Five Personality Test — Instant Results | Innermind',
    description:
      'Take our free 20-question Big Five personality test. Discover your Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism scores instantly.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Big Five Personality Test — Instant Results | Innermind',
    description:
      'Take our free 20-question Big Five personality test. Discover your Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism scores instantly.',
  },
}

export default function BigFiveLayout({ children }: { children: React.ReactNode }) {
  return children
}
