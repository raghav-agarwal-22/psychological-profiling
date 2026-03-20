import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL ?? 'https://innermind.app'
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/about', '/assessment', '/archetypes/', '/upgrade', '/privacy', '/terms', '/p/', '/compare'],
        disallow: [
          '/dashboard',
          '/profile/',
          '/coach',
          '/admin',
          '/journal',
          '/insights',
          '/teams',
          '/adaptive',
          '/auth/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
