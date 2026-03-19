import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: {
    default: 'Innermind — Know Yourself Deeply',
    template: '%s | Innermind',
  },
  description:
    'The most thoughtful platform for self-understanding — combining psychology, reflection, and symbolic wisdom to help you navigate life with clarity, meaning, and agency.',
  keywords: ['psychology', 'self-understanding', 'personality', 'reflection', 'growth'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-stone-950 text-stone-100 antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
