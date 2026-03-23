import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Attachment Style Quiz — Free, Instant Results | Innermind',
  description:
    'Take our free 10-question attachment style quiz and discover if you are Secure, Anxious, Avoidant, or Disorganized. Instant results, no signup required.',
  openGraph: {
    title: 'Attachment Style Quiz — Free, Instant Results | Innermind',
    description:
      'Take our free 10-question attachment style quiz and discover if you are Secure, Anxious, Avoidant, or Disorganized. Instant results, no signup required.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Attachment Style Quiz — Free, Instant Results | Innermind',
    description:
      'Take our free 10-question attachment style quiz and discover if you are Secure, Anxious, Avoidant, or Disorganized. Instant results, no signup required.',
  },
}

export default function AttachmentStyleLayout({ children }: { children: React.ReactNode }) {
  return children
}
