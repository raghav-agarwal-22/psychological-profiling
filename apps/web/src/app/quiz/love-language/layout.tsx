import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Love Language Quiz — Instant Results | Innermind',
  description:
    'Discover your primary love language with our free 25-question quiz. Find out if you score highest in Words of Affirmation, Acts of Service, Receiving Gifts, Quality Time, or Physical Touch. Instant results, no signup required.',
  openGraph: {
    title: 'Free Love Language Quiz — Instant Results | Innermind',
    description:
      'Discover your primary love language with our free 25-question quiz. Find out if you score highest in Words of Affirmation, Acts of Service, Receiving Gifts, Quality Time, or Physical Touch. Instant results, no signup required.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Love Language Quiz — Instant Results | Innermind',
    description:
      'Discover your primary love language with our free 25-question quiz. Find out if you score highest in Words of Affirmation, Acts of Service, Receiving Gifts, Quality Time, or Physical Touch. Instant results, no signup required.',
  },
}

export default function LoveLanguageLayout({ children }: { children: React.ReactNode }) {
  return children
}
