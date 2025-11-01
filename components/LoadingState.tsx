'use client'

import { motion } from 'framer-motion'

interface LoadingStateProps {
  message?: string
  size?: 'small' | 'medium' | 'large'
  fullScreen?: boolean
}

export default function LoadingState({
  message = 'Loading...',
  size = 'medium',
  fullScreen = false,
}: LoadingStateProps) {
  const sizes = {
    small: 'w-16 h-16',
    medium: 'w-32 h-32',
    large: 'w-48 h-48',
  }

  const textSizes = {
    small: 'text-body',
    medium: 'text-body-lg',
    large: 'text-h6',
  }

  const container = fullScreen
    ? 'fixed inset-0 bg-warmCream-100 flex items-center justify-center z-50'
    : 'flex flex-col items-center justify-center py-12'

  return (
    <div className={container}>
      <motion.div
        className={`${sizes[size]} mx-auto mb-6`}
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {/* Pressed flower loading animation */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Center */}
          <motion.circle
            cx="50"
            cy="50"
            r="12"
            fill="#D4A373"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />

          {/* Petals */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8
            return (
              <motion.ellipse
                key={i}
                cx="50"
                cy="25"
                rx="8"
                ry="18"
                fill="#D4859D"
                opacity="0.85"
                transform={`rotate(${angle} 50 50)`}
                animate={{
                  opacity: [0.85, 0.5, 0.85],
                  ry: [18, 20, 18],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            )
          })}
        </svg>
      </motion.div>

      <motion.p
        className={`${textSizes[size]} font-body text-warmCream-700 text-center`}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {message}
      </motion.p>

      {/* Subtle decorative dots */}
      <motion.div
        className="flex gap-2 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-fadedGold"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}

// Skeleton loading for cards
export function SkeletonCard() {
  return (
    <div className="bg-warmCream-200 rounded-xl p-6 animate-pulse">
      <div className="h-4 bg-warmCream-300 rounded w-3/4 mb-4" />
      <div className="h-3 bg-warmCream-300 rounded w-full mb-2" />
      <div className="h-3 bg-warmCream-300 rounded w-5/6 mb-2" />
      <div className="h-3 bg-warmCream-300 rounded w-4/6" />
    </div>
  )
}

// Loading overlay for inline operations
export function LoadingOverlay({ message = 'Processing...' }: { message?: string }) {
  return (
    <div className="absolute inset-0 bg-warmCream-100/90 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
      <LoadingState message={message} size="small" />
    </div>
  )
}