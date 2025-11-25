'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import FloralDecoration from './FloralDecoration'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface HeroProps {
  recipientName: string
  age?: number
  creativeAgeDescription?: string
}

export default function Hero({ recipientName, creativeAgeDescription }: HeroProps) {
  const router = useRouter()
  
  // Parallax effect: Track scroll position
  const { scrollY } = useScroll()
  
  // Create parallax transforms for background elements
  // Background moves slower (0-150px) while foreground moves normally
  const yBgRight = useTransform(scrollY, [0, 500], [0, 150])
  const yBgLeft = useTransform(scrollY, [0, 500], [0, 100])
  
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-warmCream-100 to-rosePetal/10 overflow-hidden px-4 md:px-8 py-16 md:py-32">
      {/* Parallax Background Florals */}
      <motion.div
        className="absolute -top-20 -right-20 md:top-0 md:right-0 opacity-40"
        style={{ y: yBgRight }}
      >
        <FloralDecoration 
          size={400}
          color="#D4859D"
        />
      </motion.div>
      
      <motion.div
        className="absolute top-8 left-8 opacity-25"
        style={{ y: yBgLeft }}
      >
        <FloralDecoration 
          size={120}
          color="#A88BC7"
        />
      </motion.div>
      
      {/* Paper texture overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <filter id="paper-texture">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </defs>
          <rect width="100%" height="100%" filter="url(#paper-texture)" />
        </svg>
      </div>

      {/* Main Content (no parallax - moves with scroll normally) */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        <motion.h1
          className="font-heading font-bold text-sepiaInk mb-8"
          style={{ fontSize: 'clamp(48px, 10vw, 120px)' }}
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {recipientName}
        </motion.h1>

        <motion.svg
          className="mx-auto mb-12"
          width="400"
          height="20"
          viewBox="0 0 400 20"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.path
            d="M 10 15 Q 100 5, 200 10 T 390 15"
            stroke="#D4A373"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
        </motion.svg>

        {creativeAgeDescription && (
          <motion.p
            className="text-h4 md:text-h3 font-body text-warmCream-700 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {creativeAgeDescription}
          </motion.p>
        )}

        <motion.button
          className="px-12 py-6 bg-burntSienna text-warmCream-50 rounded-xl text-h5 md:text-h4 font-heading font-semibold shadow-dramatic transition-all duration-300"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          whileHover={{ 
            scale: 1.05, 
            y: -8, 
            rotate: -1,
            boxShadow: '0px 8px 24px rgba(212, 163, 115, 0.3)'
          }}
          whileTap={{ scale: 0.95 }}
          data-testid="cta-create-button"
          onClick={() => router.push('/create')}
        >
          Explore Your Memories ✨
        </motion.button>

        <div className="mt-4">
          <Link href="/create" data-testid="cta-create-link" className="underline text-fadedGold text-body">
            Start creating →
          </Link>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-fadedGold">
            <path d="M12 5v14m0 0l-7-7m7 7l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </div>
    </section>
  )
}
