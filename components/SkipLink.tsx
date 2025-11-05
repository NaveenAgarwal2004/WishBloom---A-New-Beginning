'use client'

/**
 * Skip to Main Content Link
 * Allows keyboard users to skip navigation and go directly to main content
 */
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-burntSienna focus:text-warmCream-50 focus:rounded-lg focus:shadow-dramatic focus:outline-none focus:ring-2 focus:ring-fadedGold focus:ring-offset-2"
    >
      Skip to main content
    </a>
  )
}