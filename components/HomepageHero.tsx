'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomepageHero() {
  return (
    <section className="bg-gradient-to-b from-warmCream-50 to-warmCream-100 pt-20 pb-16 px-4 md:px-8 text-center border-b border-warmCream-200">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          className="text-h2 md:text-h1 font-heading font-bold text-sepiaInk mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Create a Free Birthday Memory Book Online
        </motion.h1>
        
        <motion.h2
          className="text-body-lg md:text-h6 font-body text-warmCream-700 mb-10 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Collect photos and heartfelt messages from everyone who loves them. 
          Share one beautiful interactive birthday scrapbook — no app, no cost.
        </motion.h2>
        
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="https://wishblooms.in/create">
            <Button size="lg" className="bg-mossGreen hover:bg-mossGreen/90 text-white rounded-full px-8 py-6 text-lg font-heading shadow-soft hover:shadow-lg transition-all duration-300">
              Create a WishBloom Now
            </Button>
          </Link>
        </motion.div>

        <motion.section
          aria-label="What is WishBloom"
          className="mt-6 max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-sm font-body text-warmCream-600 leading-relaxed">
            WishBloom is a free online birthday memory book creator. You collect photos
            and heartfelt messages from friends and family — WishBloom turns them into a
            beautiful interactive digital scrapbook, complete with a pressed flower aesthetic
            and a microphone-powered candle-blowing moment, that the birthday person opens
            via a single shared link. Completely free. No app. No signup needed to view.
          </p>
        </motion.section>
      </div>
    </section>
  )
}
