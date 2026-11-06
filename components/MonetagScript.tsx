'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Monetag Ad Script — Blog-Only DOM Injector
 *
 * This component is mounted exclusively via app/blog/layout.tsx.
 * It should NEVER be imported into app/layout.tsx (root) or any
 * non-blog segment layout.
 *
 * The pathname guard below is a defence-in-depth fallback only —
 * structural isolation via Next.js segment layouts is the primary control.
 *
 * Ads are ALLOWED on:
 *   ✅ /blog          — blog index
 *   ✅ /blog/*        — individual blog posts
 *
 * Ads are BLOCKED on (fallback guard):
 *   🚫 /              — homepage (trust-critical: "100% free of ads" promise)
 *   🚫 /[id]/*        — personal WishBloom memory books
 *   🚫 /create/*      — creation flow
 *   🚫 /dashboard/*   — admin dashboard
 *   🚫 /auth/*        — authentication
 *   🚫 /api/*         — API routes
 *   🚫 Everything else not explicitly in the blog allow-list
 */

/** ONLY blog routes are permitted — this is intentionally narrow */
const AD_ALLOWED_PATHS = [
  '/blog',
]

function isAdAllowed(pathname: string | null): boolean {
  if (!pathname) return false

  // Allow /blog (index)
  if (AD_ALLOWED_PATHS.includes(pathname)) return true

  // Allow /blog/* (individual posts)
  if (pathname.startsWith('/blog/')) return true

  // Block everything else — defence-in-depth fallback
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

  }, [pathname])

  return null
}
