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
 *   🚫 /[id]/*        — personal WishBloom memory books (most critical)
 *   🚫 /create/*      — creation flow
 *   🚫 /dashboard/*   — admin dashboard
 *   🚫 /auth/*        — sign in / sign up
 *   🚫 /api/*         — API routes
 *   🚫 /offline       — PWA offline page
 */

// ── Monetag Ad Zone Configuration ─────────────────────────────────────────
// 1. In-Page Push (Banner) — "Dreamy" tag — Zone: 11946408
const INPAGE_PUSH_ZONE = '11946408'
const INPAGE_PUSH_SRC  = 'https://nap5k.com/tag.min.js'

// 2. Vignette Banner — Zone: 11946529
const VIGNETTE_ZONE = '11946529'
const VIGNETTE_SRC  = 'https://n6wxm.com/vignette.min.js'
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

  // Everything else (e.g. /[id] — the WishBloom viewer) is blocked by default
  return false
}

export default function MonetagScript() {
  const pathname = usePathname()

  // Don't render anything if the route is not explicitly allowed
  if (!isAdAllowed(pathname)) {
    return null
  }

  return (
    <>
      {/* In-Page Push (Banner) — "Dreamy" tag */}
      <Script
        src={INPAGE_PUSH_SRC}
        data-zone={INPAGE_PUSH_ZONE}
        strategy="lazyOnload"
        id="monetag-inpage-push"
      />

      {/* Vignette Banner */}
      <Script
        src={VIGNETTE_SRC}
        data-zone={VIGNETTE_ZONE}
        strategy="lazyOnload"
        id="monetag-vignette"
      />
    </>
  )
}
