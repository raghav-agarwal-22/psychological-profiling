
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
  },
  experimental: {
    // Tree-shake large packages to reduce bundle size
    optimizePackageImports: ['recharts', 'lucide-react'],
  },

  // Cache-Control headers for static/marketing pages — critical for PH traffic spike
  async headers() {
    return [
      {
        // Landing page — aggressively cache at CDN, revalidate hourly
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Blog posts — cached for 24h, background revalidation for 7 days
        source: '/blog/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        // Marketing static pages (pricing, about, terms, privacy, for-coaches)
        source: '/(upgrade|about|terms|privacy|for-coaches|for-professionals)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Share pages — public profiles can be cached
        source: '/p/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=3600',
          },
        ],
      },
    ]
  },
}

export default nextConfig
