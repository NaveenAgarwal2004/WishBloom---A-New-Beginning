'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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
          Collect photos and heartfelt messages from everyone who loves them. 
          Share one beautiful interactive birthday scrapbook — no app, no cost.
        </p>
        
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

        {/* AEO: Top summary block — visible on load, contains internal links for SEO */}
        <section
          aria-label="What is WishBloom — quick summary"
          className="mt-10 max-w-2xl mx-auto bg-white/60 backdrop-blur-sm border border-warmCream-200 rounded-2xl px-7 py-5 text-left shadow-soft"
        >
          <p className="text-body font-body text-sepiaInk leading-relaxed">
            <strong>WishBloom</strong> is a free online birthday memory book creator.
            Share one link — friends add photos, messages, and memories —
            and the birthday person receives a beautiful interactive scrapbook they can open on any device.
            No app, no signup, no cost.{' '}
            <Link href="/how-it-works" className="text-burntSienna hover:underline font-medium">See how it works</Link>
            {' '}or{' '}
            <Link href="/create" className="text-mossGreen hover:underline font-medium">create a free birthday memory book</Link> now.
          </p>
        </section>
      </div>
    </section>
  )
}
