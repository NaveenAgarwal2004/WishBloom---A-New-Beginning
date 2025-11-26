'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { IContributor } from '@/models/WishBloom'

interface FooterSignaturesProps {
  contributors: IContributor[]
}

/**
 * Client Component: FooterSignatures
 * 
 * Interactive signature easter egg with framer-motion animations
 * Extracted from Footer to allow server component architecture
 */
export default function FooterSignatures({ contributors }: FooterSignaturesProps) {
  const [showSignatures, setShowSignatures] = useState(false)

  return (
    <motion.div className="text-center pt-8 border-t border-fadedGold/20">
      <motion.button
        className="text-caption text-warmCream-600/60 hover:text-fadedGold font-accent italic cursor-pointer transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowSignatures(!showSignatures)}
        aria-label={showSignatures ? 'Hide contributor signatures' : 'Show contributor signatures'}
      >
        {showSignatures ? '△ Hide signatures' : '▽ Signed by all who love you...'}
      </motion.button>

      <AnimatePresence>
        {showSignatures && (
          <motion.div
            className="relative bg-warmCream-100/50 rounded-2xl p-6 md:p-12 mt-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.6 }}
            role="region"
            aria-label="Contributor signatures"
          >
            {/* Mobile View: 2-column grid */}
            <div className="md:hidden grid grid-cols-2 gap-3">
              {contributors.map((contributor, i) => (
                <motion.div
                  key={contributor.id}
                  className="bg-warmCream-200/50 rounded-lg px-4 py-3 flex items-center gap-2 justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <span className="text-body-sm font-accent italic text-fadedGold truncate">
                    {contributor.name}
                  </span>
                  {i % 3 === 0 && (
                    <svg className="inline-block w-4 h-4 text-rosePetal opacity-60 flex-shrink-0" viewBox="0 0 20 20" aria-hidden="true">
                      <circle cx="10" cy="10" r="3" fill="currentColor" />
                      <ellipse cx="10" cy="6" rx="2" ry="3" fill="currentColor" opacity="0.8" />
                      <ellipse cx="14" cy="10" rx="3" ry="2" fill="currentColor" opacity="0.8" />
                      <ellipse cx="10" cy="14" rx="2" ry="3" fill="currentColor" opacity="0.8" />
                      <ellipse cx="6" cy="10" rx="3" ry="2" fill="currentColor" opacity="0.8" />
                    </svg>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Desktop View: Scattered absolute positioning */}
            <div className="hidden md:block relative min-h-[200px]">
              {contributors.map((contributor, i) => {
                const positions = [
                  { left: '10%', top: '20%' },
                  { left: '30%', top: '40%' },
                  { left: '50%', top: '25%' },
                  { left: '70%', top: '45%' },
                  { left: '20%', top: '60%' },
                  { left: '60%', top: '70%' },
                  { left: '80%', top: '30%' },
                  { left: '40%', top: '75%' },
                ]
                const position = positions[i % positions.length]
                const rotation = (Math.random() - 0.5) * 8

                return (
                  <motion.div
                    key={contributor.id}
                    className="absolute whitespace-nowrap flex items-center gap-2"
                    style={{
                      left: position.left,
                      top: position.top,
                      transform: `rotate(${rotation}deg)`,
                    }}
                    initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
                    animate={{ opacity: 1, scale: 1, rotate: rotation }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    <span className="text-h6 font-accent italic text-fadedGold">
                      {contributor.name}
                    </span>
                    {i % 3 === 0 && (
                      <svg className="inline-block w-5 h-5 text-rosePetal opacity-60" viewBox="0 0 20 20" aria-hidden="true">
                        <circle cx="10" cy="10" r="3" fill="currentColor" />
                        <ellipse cx="10" cy="6" rx="2" ry="3" fill="currentColor" opacity="0.8" />
                        <ellipse cx="14" cy="10" rx="3" ry="2" fill="currentColor" opacity="0.8" />
                        <ellipse cx="10" cy="14" rx="2" ry="3" fill="currentColor" opacity="0.8" />
                        <ellipse cx="6" cy="10" rx="3" ry="2" fill="currentColor" opacity="0.8" />
                      </svg>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
