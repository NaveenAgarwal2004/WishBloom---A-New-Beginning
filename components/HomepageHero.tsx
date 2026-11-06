'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { APP_CONFIG } from '@/config/constants'

export default function HomepageHero() {
  return (
    <section className="bg-gradient-to-b from-warmCream-50 to-warmCream-100 pt-20 pb-16 px-4 md:px-8 text-center border-b border-warmCream-200">
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-h2 md:text-h1 font-heading font-bold text-sepiaInk mb-6 animate-fade-in-up"
        >
          Create a Free Birthday Memory Book Online
        </h1>
        
        <p
          className="text-body-lg md:text-h6 font-body text-warmCream-700 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]"
        >
          The thoughtful virtual birthday gift for long-distance friends and loved ones. Collect photos and heartfelt notes into a collaborative pressed-flower scrapbook — complete with candles they can blow out through their microphone. Free, private, and no app needed.
        </p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="/create">
            <Button size="lg" className="bg-mossGreen hover:bg-mossGreen/90 text-white rounded-full px-8 py-6 text-lg font-heading shadow-soft hover:shadow-lg transition-all duration-300">
              Create a WishBloom Now
            </Button>
          </Link>

          <p className="mt-4 text-xs md:text-sm font-body text-warmCream-700/80 italic flex items-center justify-center gap-2 flex-wrap">
            <span>🌸 Over {APP_CONFIG.COMMUNITY_STATS.MEMORIES_COUNT} memories preserved</span>
            <span className="hidden sm:inline text-warmCream-400" aria-hidden="true">•</span>
            <span>100% Free</span>
            <span className="hidden sm:inline text-warmCream-400" aria-hidden="true">•</span>
            <span>No signup needed to view</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
