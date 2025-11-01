'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

/**
 * Confetti component with 300-500 particles
 * @param {number} particleCount - Number of particles (default 400)
 */
export default function Confetti({ particleCount = 400 }) {
  // Generate particles with random properties
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      type: ['petal', 'circle', 'heart', 'leaf', 'star'][Math.floor(Math.random() * 5)],
      color: ['#D4859D', '#A88BC7', '#8FA582', '#E6A957', '#C97B84', '#6B6B9B'][Math.floor(Math.random() * 6)],
      size: 12 + Math.random() * 16, // 12-28px
      x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
      y: -100 - Math.random() * 100,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 720,
      scale: 0.7 + Math.random() * 0.6,
      duration: 5 + Math.random() * 4, // 5-9 seconds
      drift: (Math.random() - 0.5) * 100,
      delay: Math.random() * 0.3,
    }))
  }, [particleCount])

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]" data-testid="confetti-active">
      {particles.map((particle) => {
        const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800

        return (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
            }}
            initial={{
              y: particle.y,
              x: particle.x,
              opacity: 1,
              rotate: 0,
              scale: particle.scale,
              rotateX: 0,
              rotateY: 0,
            }}
            animate={{
              y: windowHeight + 100,
              x: particle.x + Math.sin(Date.now() * 0.001 + particle.id) * particle.drift,
              opacity: [1, 1, 1, 0.8, 0],
              rotate: particle.rotation + particle.rotationSpeed,
              rotateX: [0, 180, 360],
              rotateY: [0, 180, 360],
              scale: [particle.scale, particle.scale, particle.scale * 0.7],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: 'linear',
              opacity: { times: [0, 0.1, 0.7, 0.9, 1] },
            }}
          >
            {/* Render particle based on type */}
            {particle.type === 'petal' && (
              <svg viewBox="0 0 24 32" fill="none" className="w-full h-full">
                <ellipse cx="12" cy="16" rx="11" ry="15" fill={particle.color} opacity="0.9" />
              </svg>
            )}
            {particle.type === 'circle' && (
              <div
                className="w-full h-full rounded-full"
                style={{ backgroundColor: particle.color, opacity: 0.9 }}
              />
            )}
            {particle.type === 'heart' && (
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill={particle.color}
                  opacity="0.9"
                />
              </svg>
            )}
            {particle.type === 'leaf' && (
              <svg viewBox="0 0 16 24" fill="none" className="w-full h-full">
                <ellipse cx="8" cy="12" rx="7" ry="11" fill={particle.color} opacity="0.9" />
                <line x1="8" y1="1" x2="8" y2="23" stroke={particle.color} strokeWidth="1.5" opacity="0.7" />
              </svg>
            )}
            {particle.type === 'star' && (
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill={particle.color}
                  opacity="0.9"
                />
              </svg>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
