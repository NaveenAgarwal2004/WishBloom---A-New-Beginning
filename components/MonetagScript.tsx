'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'

/**
 * Monetag Ad Script — Conditional Route Guard
 *
 * Ads ONLY show on public informational pages:
 *   ✅ /              — homepage
 *   ✅ /blog          — blog index
 *   ✅ /blog/*        — individual blog posts
 *   ✅ /about
 *   ✅ /how-it-works
 *   ✅ /contact
 *   ✅ /privacy
 *   ✅ /terms
 *
 * Ads are BLOCKED on:
 *   🚫 /[id]/*        — personal WishBloom memory books (most important)
 *   🚫 /create/*      — creation flow
 *   🚫 /dashboard/*   — admin dashboard
 *   🚫 /auth/*        — sign in / sign up
 *   🚫 /api/*         — API routes
 *   🚫 /offline       — PWA offline page
 *
 * To activate:
 * 1. Replace MONETAG_VERIFICATION_CODE with your site verification code from Monetag dashboard
 * 2. Replace MONETAG_SCRIPT_URL with your unique script URL from Monetag dashboard
 * 3. Uncomment the <Script> block below
 */

// ── Replace these with your actual Monetag values ──────────────────────────
const MONETAG_SCRIPT_URL = 'REPLACE_WITH_YOUR_MONETAG_SCRIPT_URL'
// Example: 'https://cdn.monetag.com/tag.min.js?z=1234567'
// ───────────────────────────────────────────────────────────────────────────

/** Routes where ads are explicitly allowed */
const AD_ALLOWED_PATHS = [
  '/',
  '/blog',
  '/about',
  '/how-it-works',
  '/contact',
  '/privacy',
  '/terms',
]

/** Route prefixes that are always blocked, regardless of what follows */
const AD_BLOCKED_PREFIXES = [
  '/dashboard',
  '/create',
  '/auth',
  '/api',
  '/offline',
]

function isAdAllowed(pathname: string): boolean {
  // Block if path starts with any protected prefix
  if (AD_BLOCKED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return false
  }

  // Allow exact matches (home, about, etc.)
  if (AD_ALLOWED_PATHS.includes(pathname)) {
    return true
  }

  // Allow /blog/* (individual posts)
  if (pathname.startsWith('/blog/')) {
    return true
  }

  // Everything else (e.g. /[id] — the WishBloom viewer) is blocked
  return false
}

export default function MonetagScript() {
  const pathname = usePathname()

  // Don't render anything if the route is not explicitly allowed
  if (!isAdAllowed(pathname)) {
    return null
  }

  // Don't render if the script URL hasn't been configured yet
  if (!MONETAG_SCRIPT_URL || MONETAG_SCRIPT_URL.startsWith('REPLACE_')) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[MonetagScript] Script URL not configured. Set MONETAG_SCRIPT_URL.')
    }
    return null
  }

  return (
    <Script
      src={MONETAG_SCRIPT_URL}
      strategy="lazyOnload"     // Load after page is interactive — protects LCP/TBT
      data-cfasync="false"       // Required by Monetag to bypass Cloudflare async
      id="monetag-script"
    />
  )
}
