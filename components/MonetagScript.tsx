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

function isAdAllowed(pathname: string | null): boolean {
  // During SSR/initial hydration, if pathname is null, allow by default
  if (!pathname) return true

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

  // Don't render anything if the route is not allowed
  if (!isAdAllowed(pathname)) {
    return null
  }

  return (
    <>
      {/* In-Page Push (Banner) — Zone 11946408 */}
      <Script
        id="monetag-inpage-push"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(s){s.dataset.zone='11946408',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));`,
        }}
      />

      {/* Vignette Banner — Zone 11946529 */}
      <Script
        id="monetag-vignette"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(s){s.dataset.zone='11946529',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));`,
        }}
      />
    </>
  )
}
