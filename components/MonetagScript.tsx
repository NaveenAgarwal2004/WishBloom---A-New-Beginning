'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Monetag Ad Script — Route-Guarded DOM Injector
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
  if (!pathname) return false

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

  useEffect(() => {
    // Only inject on allowed public routes
    if (!isAdAllowed(pathname)) {
      return
    }

    // 1. In-Page Push (Banner) — Zone 11946408
    if (!document.getElementById('monetag-inpage-push')) {
      const s1 = document.createElement('script')
      s1.id = 'monetag-inpage-push'
      s1.dataset.zone = '11946408'
      s1.src = 'https://nap5k.com/tag.min.js'
      s1.async = true
      document.body.appendChild(s1)
    }

    // 2. Vignette Banner — Zone 11946529
    if (!document.getElementById('monetag-vignette')) {
      const s2 = document.createElement('script')
      s2.id = 'monetag-vignette'
      s2.dataset.zone = '11946529'
      s2.src = 'https://n6wxm.com/vignette.min.js'
      s2.async = true
      document.body.appendChild(s2)
    }
  }, [pathname])

  return null
}
