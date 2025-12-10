/**
 * 🌸 WishBloom Animation Utilities
 * 
 * Centralized animation helpers for consistent motion design
 * with accessibility support (prefers-reduced-motion)
 */

import React from 'react'

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Get animation duration based on user preferences
 */
export function getAnimationDuration(defaultDuration: number): number {
  return prefersReducedMotion() ? 0.01 : defaultDuration
}

/**
 * Typewriter effect hook for text animation
 * Hooks now called unconditionally at top level
 */
export function useTypewriter(text: string, speed: number = 30) {
  const [displayText, setDisplayText] = React.useState('')
  const [isComplete, setIsComplete] = React.useState(false)
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    // Handle SSR case
    if (typeof window === 'undefined') {
      setDisplayText(text)
      setIsComplete(true)
      return
    }

    // Skip animation if user prefers reduced motion
    if (prefersReducedMotion()) {
      setDisplayText(text)
      setIsComplete(true)
      return
    }

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else {
      setIsComplete(true)
    }
  }, [currentIndex, text, speed])

  return { displayText, isComplete }
}

/**
 * Motion-safe animation variants for Framer Motion
 */
export const motionSafeVariants = {
  // Fade in animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  // Slide up animations
  slideUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -40 },
  },
  
  // Slide down animations
  slideDown: {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
  },
  
  // Scale animations
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  
  // Bloom animation (WishBloom signature)
  bloom: {
    initial: { opacity: 0, scale: 0.7, rotate: -15 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    exit: { opacity: 0, scale: 0.7, rotate: 15 },
  },
}

/**
 * Get motion-safe transition configuration
 */
export function getMotionSafeTransition(transition: Record<string, unknown>) {
  if (prefersReducedMotion()) {
    return {
      duration: 0.01,
      delay: 0,
    }
  }
  return transition
}

/**
 * Stagger children animation with motion safety
 */
export function getStaggerVariants(delayPerChild: number = 0.1) {
  const actualDelay = prefersReducedMotion() ? 0 : delayPerChild
  
  return {
    container: {
      animate: {
        transition: {
          staggerChildren: actualDelay,
        },
      },
    },
    item: motionSafeVariants.slideUp,
  }
}
