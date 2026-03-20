import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PWAInit } from '@/components/pwa/PWAInit'
import { PostHogProvider } from '@/components/PostHogProvider'

export const viewport: Viewport = {
  themeColor: '#0c0a09',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_WEB_URL ?? 'https://innermind.app'),
  title: {
    default: 'Innermind — Know Yourself Deeply',
    template: '%s | Innermind',
  },
  description:
    "The world's most thoughtful platform for self-understanding. Science-backed psychological assessments with AI-powered insights — combining the Big Five, Schwartz Values, and more to help you navigate life with clarity and meaning.",
  keywords: [
    'psychology',
    'self-understanding',
    'personality assessment',
    'Big Five personality',
    'Schwartz values',
    'psychological profiling',
    'AI insights',
    'self-reflection',
    'personal growth',
    'mental wellness',
  ],
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Innermind',
  },
  openGraph: {
    siteName: 'Innermind',
    type: 'website',
    locale: 'en_US',
    title: 'Innermind — Know Yourself Deeply',
    description:
      "The world's most thoughtful platform for self-understanding. Science-backed psychological assessments with AI-powered insights.",
    url: process.env.NEXT_PUBLIC_WEB_URL ?? 'https://innermind.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Innermind — Know Yourself Deeply',
    description:
      "The world's most thoughtful platform for self-understanding. Science-backed psychological assessments with AI-powered insights.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Innermind',
              description:
                "The world's most thoughtful platform for self-understanding. Science-backed psychological assessments with AI-powered insights.",
              url: 'https://innermind.app',
              applicationCategory: 'LifestyleApplication',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                description: 'Free tier available',
              },
            }),
          }}
        />
        <PWAInit />
        <Suspense>
          <PostHogProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </PostHogProvider>
        </Suspense>
      </body>
    </html>
  )
}
