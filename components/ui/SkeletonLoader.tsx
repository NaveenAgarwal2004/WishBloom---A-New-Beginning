'use client'

import { motion } from 'framer-motion'

interface SkeletonLoaderProps {
  className?: string
  variant?: 'text' | 'card' | 'image' | 'circular'
}

/**
 * Skeleton loader with paper texture theme
 */
export default function SkeletonLoader({ 
  className = '', 
  variant = 'text' 
}: SkeletonLoaderProps) {
  const baseClasses = 'bg-warmCream-300 animate-pulse'
  
  const variantClasses = {
    text: 'h-4 rounded',
    card: 'h-48 rounded-xl',
    image: 'aspect-video rounded-lg',
    circular: 'rounded-full',
  }

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Paper texture overlay */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <defs>
            <filter id="skeleton-paper">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </defs>
          <rect width="100%" height="100%" filter="url(#skeleton-paper)" />
        </svg>
      </div>
    </motion.div>
  )
}

/**
 * Memory Card Skeleton
 */
export function MemoryCardSkeleton() {
  return (
    <div className="relative bg-warmCream-200 rounded-xl p-6 md:p-10 shadow-medium border-2 border-warmCream-400">
      <div className="space-y-4">
        <SkeletonLoader className="w-32" variant="text" />
        <SkeletonLoader className="w-full h-64" variant="image" />
        <SkeletonLoader className="w-3/4 h-6" variant="text" />
        <SkeletonLoader className="w-full h-4" variant="text" />
        <SkeletonLoader className="w-full h-4" variant="text" />
        <SkeletonLoader className="w-2/3 h-4" variant="text" />
      </div>
    </div>
  )
}

/**
 * Message Card Skeleton
 */
export function MessageCardSkeleton() {
  return (
    <div className="relative bg-warmCream-50 shadow-high p-8 md:p-16">
      <div className="space-y-6">
        <SkeletonLoader className="w-48 h-8" variant="text" />
        <div className="space-y-4">
          <SkeletonLoader className="w-full h-4" variant="text" />
          <SkeletonLoader className="w-full h-4" variant="text" />
          <SkeletonLoader className="w-5/6 h-4" variant="text" />
        </div>
        <div className="flex justify-end">
          <SkeletonLoader className="w-32 h-6" variant="text" />
        </div>
      </div>
    </div>
  )
}
