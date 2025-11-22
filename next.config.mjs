/**
 * 🌸 WishBloom Production Configuration
 * Combines security hardening, performance optimization, and production best practices
 * Security & DevOps Hardening - COMPLETE
 * 
 * @type {import('next').NextConfig}
 */

// Import bundle analyzer for production analysis
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/**
 * Content Security Policy for WishBloom
 * ✅ Part 8: Protects against XSS, clickjacking, and code injection attacks
 */
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://cdnjs.cloudflare.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https: blob:;
  font-src 'self' data:;
  media-src 'self' data: blob:;
  connect-src 'self' https://va.vercel-scripts.com https://*.mongodb.net https://*.cloudinary.com https://*.upstash.io;
  frame-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, ' ')
  .trim()

const nextConfig = {
  reactStrictMode: true,

  // ✅ ESLint flat config support - Disable during builds, run separately via npm run lint
  eslint: {
    ignoreDuringBuilds: true, // Use standalone 'npm run lint' instead to avoid ESLint 9 compatibility issues with Next.js build
  },

  // ✅ Image optimization for performance
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp'], // Modern formats first
    
    // Mobile-first responsive image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Lazy loading and caching
    minimumCacheTTL: 60,
    
    // SVG security
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ✅ Experimental features for better performance
  experimental: {
    serverComponentsExternalPackages: ['mongodb', 'mongoose'],
    optimizeCss: true, // Optimize CSS in production
  },

  // ✅ Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // Keep error and warn logs
    } : false,
  },

  // ✅ Optimized webpack configuration
  webpack(config, { dev, isServer }) {
    if (dev) {
      config.watchOptions = {
        poll: 2000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.git', '**/.next'],
      }
    }
    
    // Production build optimizations
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk for node_modules
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20
            },
            // Common chunk for shared components
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true
            },
            // Framer Motion in separate chunk (heavy animation library)
            framer: {
              name: 'framer',
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              priority: 30
            }
          }
        }
      }
    }
    
    return config
  },

  // ✅ On-demand entry optimization
  onDemandEntries: {
    maxInactiveAge: 25000,
    pagesBufferLength: 2,
  },

  // ✅ Part 8: Comprehensive Security Headers + Performance Headers
  async headers() {
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
      .split(',')
      .map(origin => origin.trim())

    return [
      // API CORS headers
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: allowedOrigins[0],
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
      // Font caching optimization
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
      // Global security and performance headers
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
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
            value: 'DENY',
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
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(self), geolocation=()',
          },
          {
            key: 'Link',
            value: '<https://res.cloudinary.com>; rel=preconnect',
          },
        ],
      },
    ]
  },

  // ✅ URL redirects
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

export default withBundleAnalyzer(nextConfig)
