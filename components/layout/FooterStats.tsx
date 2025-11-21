'use client'

import { useEffect, useState } from 'react'

/**
 * Client Component: FooterStats
 * 
 * Displays dynamic statistics about WishBlooms created
 * Fetches count from API endpoint for real-time updates
 * 
 * Used in Footer to replace static placeholder text
 */
export default function FooterStats() {
  const [bloomCount, setBloomCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchBloomCount() {
      try {
        const response = await fetch('/api/stats/blooms')
        const data = await response.json()
        
        if (data.success) {
          setBloomCount(data.count)
        } else {
          setError(true)
        }
      } catch (err) {
        console.error('FooterStats: Failed to fetch bloom count', err)
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBloomCount()
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <p className="text-body-sm text-warmCream-700/70 font-body animate-pulse">
        Loading...
      </p>
    )
  }

  // Error state - graceful fallback
  if (error || bloomCount === null) {
    return (
      <p className="text-body-sm text-warmCream-700/70 font-body">
        Preserving memories, one bloom at a time
      </p>
    )
  }

  // No blooms yet
  if (bloomCount === 0) {
    return (
      <p className="text-body-sm text-warmCream-700/70 font-body">
        Start creating beautiful memories today
      </p>
    )
  }

  // Success state - show count
  return (
    <p className="text-body-sm text-warmCream-700/70 font-body">
      Powering <span className="font-semibold text-fadedGold">{bloomCount}</span>{' '}
      {bloomCount === 1 ? 'memory' : 'memories'} and counting! 🌸
    </p>
  )
}
