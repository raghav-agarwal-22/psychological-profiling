import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Enneagram Test — Instant Type Results | Innermind',
  description:
    'Take our free 36-question Enneagram personality test. Discover your Enneagram type and wing instantly. Based on the 9 core personality types — no signup required.',
  openGraph: {
    title: 'Free Enneagram Test — Instant Type Results | Innermind',
    description:
      'Take our free 36-question Enneagram personality test. Discover your Enneagram type and wing instantly. Based on the 9 core personality types — no signup required.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Enneagram Test — Instant Type Results | Innermind',
    description:
      'Take our free 36-question Enneagram personality test. Discover your Enneagram type and wing instantly. Based on the 9 core personality types — no signup required.',
  },
}

export default function EnneagramLayout({ children }: { children: React.ReactNode }) {
  return children
}
