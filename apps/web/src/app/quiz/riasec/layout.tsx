import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Holland Code (RIASEC) Career Interest Test — Instant Results | Innermind',
  description:
    'Take our free 36-question Holland Code (RIASEC) career interest test. Discover your Realistic, Investigative, Artistic, Social, Enterprising, and Conventional scores with instant career suggestions. No signup required.',
  openGraph: {
    title: 'Free Holland Code (RIASEC) Career Interest Test — Instant Results | Innermind',
    description:
      'Take our free 36-question Holland Code (RIASEC) career interest test. Discover your Realistic, Investigative, Artistic, Social, Enterprising, and Conventional scores with instant career suggestions. No signup required.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Holland Code (RIASEC) Career Interest Test — Instant Results | Innermind',
    description:
      'Take our free 36-question Holland Code (RIASEC) career interest test. Discover your Realistic, Investigative, Artistic, Social, Enterprising, and Conventional scores with instant career suggestions. No signup required.',
  },
}

export default function RiasecLayout({ children }: { children: React.ReactNode }) {
  return children
}
