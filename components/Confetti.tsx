'use client'

import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'

interface ConfettiProps {
  particleCount?: number
  mode?: 'celebration' | 'fireworks'
  duration?: number
  onComplete?: () => void
}

/**
 * Enhanced Confetti Component using canvas-confetti
 * Supports two modes:
 * - celebration: Gentle confetti burst (used after candle blow)
 * - fireworks: Explosive multi-burst effect (used in FIREWORKS state)
 */
export default function Confetti({ 
  particleCount = 400, 
  mode = 'celebration',
  duration = 5000,
  onComplete
}: ConfettiProps) {
  const animationFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    const myConfetti = confetti.create(undefined, {
      resize: true,
      useWorker: true,
    })

    startTimeRef.current = Date.now()

    if (mode === 'celebration') {
      // Gentle celebration burst - matches WishBloom's soft aesthetic
      const colors = ['#D4859D', '#A88BC7', '#8FA582', '#E6A957', '#C97B84', '#6B6B9B', '#F4EDE4']
      
      // Initial burst
      myConfetti({
        particleCount: particleCount * 0.4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors,
        gravity: 0.8,
        scalar: 1.2,
        drift: 0.5,
        ticks: 300,
      })

      myConfetti({
        particleCount: particleCount * 0.4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors,
        gravity: 0.8,
        scalar: 1.2,
        drift: -0.5,
        ticks: 300,
      })

      // Center burst
      setTimeout(() => {
        myConfetti({
          particleCount: particleCount * 0.2,
          angle: 90,
          spread: 70,
          origin: { x: 0.5, y: 0.5 },
          colors: colors,
          gravity: 0.6,
          scalar: 1,
          ticks: 250,
        })
      }, 150)

    } else if (mode === 'fireworks') {
      // Spectacular fireworks effect - multiple patterns and bursts
      const colors = ['#D4859D', '#A88BC7', '#E6A957', '#C97B84', '#D4A373', '#6B6B9B', '#8FA582']
      
      // Fireworks pattern types
      const patterns = [
        // Pattern 1: Rocket burst (shoots up then explodes)
        (x: number, y: number) => {
          myConfetti({
            particleCount: 80,
            angle: 90,
            spread: 360,
            origin: { x, y },
            colors: colors,
            gravity: 1.2,
            scalar: 1.6,
            drift: 0,
            ticks: 250,
            startVelocity: 35,
            shapes: ['circle', 'square'],
          })
        },
        // Pattern 2: Star burst (radiating outward)
        (x: number, y: number) => {
          const starPoints = 8
          for (let i = 0; i < starPoints; i++) {
            const angle = (360 / starPoints) * i
            myConfetti({
              particleCount: 15,
              angle: angle,
              spread: 30,
              origin: { x, y },
              colors: [colors[i % colors.length]],
              gravity: 0.8,
              scalar: 1.3,
              drift: 0,
              ticks: 200,
              startVelocity: 30,
            })
          }
        },
        // Pattern 3: Cascading waterfall
        (x: number, y: number) => {
          myConfetti({
            particleCount: 100,
            angle: 270,
            spread: 180,
            origin: { x, y },
            colors: colors,
            gravity: 1.5,
            scalar: 1.2,
            drift: 1.5,
            ticks: 300,
            startVelocity: 25,
          })
        },
        // Pattern 4: Ring burst (expands outward in a ring)
        (x: number, y: number) => {
          const ringPoints = 12
          for (let i = 0; i < ringPoints; i++) {
            const angle = (360 / ringPoints) * i
            myConfetti({
              particleCount: 10,
              angle: angle,
              spread: 15,
              origin: { x, y },
              colors: colors,
              gravity: 1,
              scalar: 1.5,
              drift: 0.5,
              ticks: 220,
              startVelocity: 28,
            })
          }
        },
        // Pattern 5: Heart burst (romantic pattern)
        (x: number, y: number) => {
          myConfetti({
            particleCount: 60,
            angle: 90,
            spread: 100,
            origin: { x, y },
            colors: ['#D4859D', '#C97B84', '#E6A957'],
            gravity: 0.9,
            scalar: 1.8,
            drift: 0,
            ticks: 280,
            startVelocity: 30,
            shapes: ['circle'],
          })
        },
      ]
      
      let burstCount = 0
      const maxBursts = 12 // More bursts for longer show
      
      const fireSequence = () => {
        const elapsed = Date.now() - startTimeRef.current
        if (elapsed >= duration || burstCount >= maxBursts) {
          if (onComplete) onComplete()
          return
        }

        // Alternate between different patterns
        const patternIndex = burstCount % patterns.length
        const pattern = patterns[patternIndex]
        
        // Random position for variety
        const x = 0.2 + Math.random() * 0.6  // Keep in central 60%
        const y = 0.2 + Math.random() * 0.3  // Upper 30% of screen

        pattern(x, y)
        burstCount++

        // Schedule next burst with varied timing
        const delay = burstCount % 2 === 0 ? 250 : 400 // Rhythm: fast-slow-fast-slow
        animationFrameRef.current = window.setTimeout(fireSequence, delay)
      }

      // Initial massive burst to start
      myConfetti({
        particleCount: 150,
        angle: 90,
        spread: 360,
        origin: { x: 0.5, y: 0.4 },
        colors: colors,
        gravity: 1,
        scalar: 2,
        drift: 0,
        ticks: 300,
        startVelocity: 45,
      })

      // Start the sequence after initial burst
      setTimeout(fireSequence, 400)
    }

    // Cleanup and call onComplete
    const cleanupTimeout = setTimeout(() => {
      if (animationFrameRef.current) {
        clearTimeout(animationFrameRef.current)
      }
      myConfetti.reset()
      if (onComplete) onComplete()
    }, duration)

    return () => {
      clearTimeout(cleanupTimeout)
      if (animationFrameRef.current) {
        clearTimeout(animationFrameRef.current)
      }
      myConfetti.reset()
    }
  }, [particleCount, mode, duration, onComplete])

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[100]"
      data-testid="confetti-active"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    />
  )
}
