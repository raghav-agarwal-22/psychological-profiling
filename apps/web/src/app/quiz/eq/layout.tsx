import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Emotional Intelligence (EQ) Test — Instant Results | Innermind',
  description:
    'Take our free 30-question Emotional Intelligence test based on Daniel Goleman\'s EQ model. Measure your Self-Awareness, Self-Regulation, Motivation, Empathy, and Social Skills. Instant results, no signup required.',
  openGraph: {
    title: 'Free Emotional Intelligence (EQ) Test — Instant Results | Innermind',
    description:
      'Take our free 30-question Emotional Intelligence test based on Daniel Goleman\'s EQ model. Measure your Self-Awareness, Self-Regulation, Motivation, Empathy, and Social Skills. Instant results, no signup required.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Emotional Intelligence (EQ) Test — Instant Results | Innermind',
    description:
      'Take our free 30-question Emotional Intelligence test based on Daniel Goleman\'s EQ model. Measure your Self-Awareness, Self-Regulation, Motivation, Empathy, and Social Skills. Instant results, no signup required.',
  },
}

export default function EQLayout({ children }: { children: React.ReactNode }) {
  return children
}
