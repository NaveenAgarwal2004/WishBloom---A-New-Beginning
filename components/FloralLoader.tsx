'use client'

import { motion } from 'framer-motion'

interface FloralLoaderProps {
  size?: number
  message?: string
}

/**
 * Floral Loader Component
 * Beautiful SVG flower animation that matches the "pressed flower" aesthetic
 * Animation sequence: Draw → Bloom → Breathe
 */
export default function FloralLoader({ size = 120, message = 'Loading...' }: FloralLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      {/* Animated Flower */}
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="text-fadedGold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Center of flower */}
        <motion.circle
          cx="50"
          cy="50"
          r="10"
          fill="currentColor"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.8,
            ease: [0.34, 1.56, 0.64, 1], // Bouncy easing
          }}
        />

        {/* Petals - 8 petals in a circular pattern */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 360) / 8
          const delay = i * 0.1

          return (
            <g key={i}>
              {/* Draw effect using pathLength */}
              <motion.ellipse
                cx="50"
                cy="25"
                rx="10"
                ry="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.9"
                transform={`rotate(${angle} 50 50)`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.85 }}
                transition={{
                  pathLength: { duration: 0.6, delay, ease: 'easeOut' },
                  opacity: { duration: 0.3, delay },
                }}
              />
              {/* Fill the petal after drawing */}
              <motion.ellipse
                cx="50"
                cy="25"
                rx="10"
                ry="22"
                fill="currentColor"
                opacity="0"
                transform={`rotate(${angle} 50 50)`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.75, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: delay + 0.6,
                  ease: 'easeOut',
                }}
              />
            </g>
          )
        })}

        {/* Outer decorative ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.3"
          strokeDasharray="4 4"
          initial={{ pathLength: 0, rotate: 0 }}
          animate={{ 
            pathLength: 1,
            rotate: 360,
          }}
          transition={{
            pathLength: { duration: 1.5, ease: 'easeInOut' },
            rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
          }}
        />
      </motion.svg>

      {/* Breathing animation on the entire flower */}
      <motion.div
        className="absolute"
        style={{ width: size, height: size }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5, // Start breathing after drawing is complete
        }}
      />

      {/* Loading message */}
      <motion.p
        className="text-body font-body text-warmCream-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {message}
      </motion.p>

      {/* Subtle floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-fadedGold/30"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  )
}
