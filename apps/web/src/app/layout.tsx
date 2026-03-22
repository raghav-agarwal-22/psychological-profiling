import type { Metadata, Viewport } from 'next'
import { Inter, Lora } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PWAInit } from '@/components/pwa/PWAInit'
import { PostHogProvider } from '@/components/PostHogProvider'
import { GoogleTagManagerHead, GoogleTagManagerBody } from '@/components/GoogleTagManager'
import { MetaPixelScript } from '@/components/MetaPixel'
import { ConversionTracking } from '@/components/ConversionTracking'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${lora.variable}`}>
      <head>
        <GoogleTagManagerHead />
        {/* MetaPixelScript moved to body (uses next/script afterInteractive) */}
        {/* Resource hints — establish connections to analytics domains early */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="preconnect" href="https://us.i.posthog.com" />
        <link rel="dns-prefetch" href="https://us.i.posthog.com" />
      </head>
      <body className="flex min-h-screen flex-col bg-stone-950 text-stone-100 antialiased">
        <GoogleTagManagerBody />
        <MetaPixelScript />
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
          <ConversionTracking />
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
