import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PWAInit } from '@/components/pwa/PWAInit'

export const viewport: Viewport = {
  themeColor: '#0c0a09',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'Innermind — Know Yourself Deeply',
    template: '%s | Innermind',
  },
  description:
    'The most thoughtful platform for self-understanding — combining psychology, reflection, and symbolic wisdom to help you navigate life with clarity, meaning, and agency.',
  keywords: ['psychology', 'self-understanding', 'personality', 'reflection', 'growth'],
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Innermind',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-stone-950 text-stone-100 antialiased">
        <PWAInit />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
