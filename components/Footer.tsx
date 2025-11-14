'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { IContributor } from '@/models/WishBloom'

interface FooterProps {
  contributors: IContributor[]
  createdDate: string
}

/**
 * Footer with signature easter egg
 */
export default function Footer({ contributors, createdDate }: FooterProps) {
  const [showSignatures, setShowSignatures] = useState(false)

  return (
    <footer className="relative bg-gradient-to-b from-warmCream-200 to-warmCream-300 border-t-2 border-fadedGold/30 py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-16 text-center md:text-left mb-16">
          <div>
            <h4 className="text-h6 font-heading font-bold text-sepiaInk mb-4">
              Pressed & Preserved
            </h4>
            <p className="text-body-sm text-warmCream-700 font-body mb-2">
              Created with love on {new Date(createdDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <p className="text-body-sm text-warmCream-700 font-body mb-4">
              {contributors.length} heart{contributors.length !== 1 ? 's' : ''} contributed
            </p>
            
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-fadedGold" />
              <svg className="w-8 h-8 text-fadedGold" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="4" fill="currentColor" />
                <ellipse cx="16" cy="10" rx="3" ry="5" fill="currentColor" opacity="0.8" />
                <ellipse cx="22" cy="16" rx="5" ry="3" fill="currentColor" opacity="0.8" />
                <ellipse cx="16" cy="22" rx="3" ry="5" fill="currentColor" opacity="0.8" />
                <ellipse cx="10" cy="16" rx="5" ry="3" fill="currentColor" opacity="0.8" />
              </svg>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-fadedGold" />
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center gap-3 justify-center mb-4">
              <svg className="w-10 h-10 text-pressedLeaf" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="6" fill="currentColor" />
                <ellipse cx="20" cy="12" rx="5" ry="7" fill="currentColor" opacity="0.85" />
                <ellipse cx="28" cy="20" rx="7" ry="5" fill="currentColor" opacity="0.85" />
                <ellipse cx="20" cy="28" rx="5" ry="7" fill="currentColor" opacity="0.85" />
                <ellipse cx="12" cy="20" rx="7" ry="5" fill="currentColor" opacity="0.85" />
              </svg>
              <span className="text-h5 font-heading font-bold text-sepiaInk">WishBloom</span>
            </div>
            <p className="text-body font-accent italic text-warmCream-700 mb-4">
              Preserving memories, one bloom at a time
            </p>
          </div>

          <div className="text-center md:text-right">
            <p className="text-micro text-warmCream-600/70 font-body mb-2">
              © 2025 WISHBLOOM · MADE WITH 💛
            </p>
          </div>
        </div>

        <motion.div className="text-center pt-8 border-t border-fadedGold/20">
          <motion.button
            className="text-caption text-warmCream-600/60 hover:text-fadedGold font-accent italic cursor-pointer transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSignatures(!showSignatures)}
          >
            {showSignatures ? '△ Hide signatures' : '▽ Signed by all who love you...'}
          </motion.button>

          <AnimatePresence>
            {showSignatures && (
              <motion.div
                className="relative min-h-[200px] bg-warmCream-100/50 rounded-2xl p-12 mt-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.6 }}
              >
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
                        <svg className="inline-block w-5 h-5 text-rosePetal opacity-60" viewBox="0 0 20 20">
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
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </footer>
  )
}