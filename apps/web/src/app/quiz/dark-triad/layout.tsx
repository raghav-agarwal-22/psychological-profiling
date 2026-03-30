import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dark Triad Personality Test — Free, Instant, Scientific | Innermind',
  description:
    'Measure your subclinical Narcissism, Machiavellianism, and Psychopathy. Free 21-question Dark Triad test with instant results. Non-judgmental, research-based.',
  openGraph: {
    title: 'Dark Triad Personality Test — Free, Instant, Scientific | Innermind',
    description:
      'Measure your subclinical Narcissism, Machiavellianism, and Psychopathy. Free 21-question Dark Triad test with instant results. Non-judgmental, research-based.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dark Triad Personality Test — Free, Instant, Scientific | Innermind',
    description:
      'Measure your subclinical Narcissism, Machiavellianism, and Psychopathy. Free 21-question Dark Triad test with instant results. Non-judgmental, research-based.',
  },
}

export default function DarkTriadLayout({ children }: { children: React.ReactNode }) {
  return children
}
