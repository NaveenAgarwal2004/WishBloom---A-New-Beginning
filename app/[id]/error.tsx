'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('WishBloom view error:', error)
  }, [error])

  return (
    <main className="min-h-screen bg-warmCream-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-h2 font-heading font-bold text-sepiaInk mb-4">
          Oops! Something went wrong
        </h1>
        <p className="text-body text-warmCream-700 mb-8">
          We encountered an error while loading this WishBloom.
        </p>
        <button
          onClick={reset}
          className="px-8 py-4 bg-burntSienna text-warmCream-50 rounded-xl text-h6 font-heading font-semibold hover:shadow-colored-gold transition-all"
        >
          Try Again
        </button>
      </div>
    </main>
  )
}