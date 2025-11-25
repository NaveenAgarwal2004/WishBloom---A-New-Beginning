/**
 * 🌸 WishBloom 404 Not Found Page
 * Critical Stability & Hydration Remediation
 * 
 * Standard Next.js not-found page for handling 404 errors
 * Maintains the pressed-flower aesthetic with gentle messaging
 */

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import FloralDecoration from '@/components/FloralDecoration'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-warmCream-50 via-warmCream-100 to-rosePetal/5 flex items-center justify-center px-4 py-16">
      <motion.div
        className="max-w-2xl w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Floral Decoration */}
        <div className="mb-8">
          <FloralDecoration className="mx-auto opacity-40" size={160} color="#C8B6A6" />
        </div>

        {/* Main Message */}
        <div className="space-y-6">
          <h1 className="text-h1 md:text-display font-heading font-bold text-sepiaInk">
            Page Not Found
          </h1>
          
          <div className="space-y-4 text-body-lg font-body text-warmCream-700">
            <p>
              The memory you&apos;re looking for seems to have drifted away like pressed petals in the wind.
            </p>
            
            <p className="text-body font-accent italic text-warmCream-600">
              Let&apos;s help you find your way back to the garden.
            </p>
          </div>

          {/* Return Home Button */}
          <div className="mt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-burntSienna text-white font-body font-semibold text-body transition-all hover:bg-burntSienna/90 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-burntSienna focus:ring-offset-2 focus:ring-offset-warmCream-50"
            >
              Return to Garden
            </Link>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="mt-16 opacity-30">
          <FloralDecoration className="mx-auto" size={140} color="#D4A574" />
        </div>

        {/* Subtle 404 Code */}
        <p className="mt-8 text-caption font-mono text-warmCream-400 uppercase tracking-widest">
          Error 404
        </p>
      </motion.div>
    </div>
  )
}
