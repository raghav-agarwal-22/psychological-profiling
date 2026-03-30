import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free 16 Personality Types Test — Instant Results | Innermind',
  description:
    'Discover your 16 personality type with our free test. Get instant results for all 16 types including INFJ, ENFP, INTJ, INFP and more — no signup required.',
  openGraph: {
    title: 'Free 16 Personality Types Test — Instant Results | Innermind',
    description:
      'Discover your 16 personality type with our free test. Get instant results for all 16 types including INFJ, ENFP, INTJ, INFP and more — no signup required.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free 16 Personality Types Test — Instant Results | Innermind',
    description:
      'Discover your 16 personality type with our free test. Get instant results for all 16 types including INFJ, ENFP, INTJ, INFP and more — no signup required.',
  },
}

export default function SixteenTypesLayout({ children }: { children: React.ReactNode }) {
  return children
}
