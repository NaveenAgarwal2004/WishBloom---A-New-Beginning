'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import MemoryCard from './MemoryCard'
import FloralDecoration from './FloralDecoration'
import { useMobile } from '@/hooks/use-mobile'
import type { IMemory } from '@/models/WishBloom'

interface MemoryGalleryProps {
  memories: IMemory[]
}

const INITIAL_VISIBLE_COUNT = 12
const LOAD_MORE_INCREMENT = 12

export default function MemoryGallery({ memories }: MemoryGalleryProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)
  const isMobile = useMobile()
  
  // Slice memories to only show visible count
  const visibleMemories = memories.slice(0, visibleCount)
  const hasMore = visibleCount < memories.length
  
  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + LOAD_MORE_INCREMENT, memories.length))
  }

  return (
    <section className="relative py-16 md:py-32 bg-gradient-to-b from-warmCream-100 via-driedSage/5 to-warmCream-100 px-4 md:px-8">
      {/* Background decorative florals */}
      <FloralDecoration 
        className="absolute top-20 left-0 opacity-10 animate-gentle-sway"
        size={256}
        color="#8FA582"
        animate={false}
      />
      <FloralDecoration 
        className="absolute bottom-40 right-0 opacity-10 animate-gentle-sway"
        size={192}
        color="#D4859D"
        animate={false}
      />

      {/* Section header */}
      <div className="text-center mb-16 md:mb-24 max-w-4xl mx-auto">
        <motion.h2
          className="text-h1 md:text-display font-heading font-bold text-sepiaInk mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Moments We&apos;ve Pressed & Preserved
        </motion.h2>

        {/* Decorative underline */}
        <motion.svg
          className="mx-auto mb-6"
          width="300"
          height="20"
          viewBox="0 0 300 20"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <motion.path
            d="M 10 12 Q 75 6, 150 10 T 290 12"
            stroke="#D4A373"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </motion.svg>

        <motion.p
          className="text-body-lg font-body italic text-warmCream-700"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Each memory is a petal in your story
        </motion.p>
      </div>

      {/* Masonry grid */}
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-auto">
          {visibleMemories.map((memory, index) => {
            // Dynamic styling based on type
            let gridClass = ''
            
            if (memory.type === 'featured') {
              gridClass = 'md:col-span-2 md:row-span-2'
            } else if (memory.type === 'quote') {
              gridClass = ''
            } else {
              gridClass = ''
            }

            // Stagger effect with margin (desktop only)
            let marginTop = 0
            if (!isMobile) {
              if (index % 3 === 1) marginTop = 40
              if (index % 3 === 2) marginTop = -20
            }

            return (
              <div 
                key={memory.id} 
                className={gridClass}
                style={{ marginTop: !isMobile ? `${marginTop}px` : '0px' }}
              >
                <MemoryCard memory={memory} index={index} />
              </div>
            )
          })}
        </div>
      </div>

      {/* Load More Button */}
      {hasMore && (
        <motion.div 
          className="flex justify-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.button
            onClick={handleLoadMore}
            className="group px-8 py-4 bg-burntSienna text-warmCream-50 rounded-xl text-body-lg font-heading font-semibold shadow-medium hover:shadow-high transition-all duration-300 flex items-center gap-3"
            whileHover={{ 
              scale: 1.05, 
              y: -4,
              boxShadow: '0px 16px 48px rgba(160, 82, 45, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
            data-testid="load-more-memories-button"
          >
            <span>Turn the Page</span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </motion.div>
      )}

      {/* Showing count indicator */}
      {memories.length > INITIAL_VISIBLE_COUNT && (
        <motion.p 
          className="text-center mt-8 text-caption font-mono text-warmCream-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Showing {visibleCount} of {memories.length} memories
        </motion.p>
      )}
    </section>
  )
}
