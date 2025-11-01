const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable strict mode to catch issues early
  reactStrictMode: true,

  // Image optimization enabled (removed unoptimized: true)
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  

  // Only use standalone for Docker deployments
  // output: 'standalone',

  experimental: {
    serverComponentsExternalPackages: ['mongodb', 'mongoose'],
  },

  // Optimized webpack config
  webpack(config, { dev }) {
    if (dev) {
      config.watchOptions = {
        poll: 2000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.git', '**/.next'],
      }
    }
    return config
  },

  onDemandEntries: {
    maxInactiveAge: 25000,
    pagesBufferLength: 2,
  },

  // Security headers
  async headers() {
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
      .split(',')
      .map(origin => origin.trim())

    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: allowedOrigins[0], // Use first allowed origin
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PATCH, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/create-memory',
        destination: '/create',
        permanent: true,
      },
    ]
  },
}

module.exports = withBundleAnalyzer(nextConfig)

// module.exports = nextConfig