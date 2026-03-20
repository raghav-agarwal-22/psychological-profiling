import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Innermind — Know Yourself Deeply',
    short_name: 'Innermind',
    description:
      'The most thoughtful platform for self-understanding — combining psychology, reflection, and symbolic wisdom.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#0c0a09',
    theme_color: '#0c0a09',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['education', 'lifestyle', 'health'],
  }
}
