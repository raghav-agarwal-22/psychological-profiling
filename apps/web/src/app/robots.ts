import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL ?? 'https://innermind.app'
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/assessment', '/archetypes/', '/p/', '/compare'],
        disallow: ['/dashboard', '/profile/', '/coach', '/admin'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
