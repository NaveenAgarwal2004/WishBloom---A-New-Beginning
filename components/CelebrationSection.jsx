'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CakeComponent from './CakeComponent'
import Confetti from './Confetti'
import WishesFloat from './WishesFloat'

/**
 * CelebrationSection - The grand finale with cake, confetti, and wishes
 */
export default function CelebrationSection({ age, celebrationWishPhrases, contributors }) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [showWishes, setShowWishes] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)

  const handleCandlesBlow = () => {
    // Show confetti immediately
    setShowConfetti(true)
    
    // Show wishes after 0.5s
    setTimeout(() => setShowWishes(true), 500)
    
    // Show thank you card after 2s
    setTimeout(() => setShowThankYou(true), 2000)
    
    // Hide confetti after 5s
    setTimeout(() => setShowConfetti(false), 5000)
    
    // Hide wishes after 8s
    setTimeout(() => setShowWishes(false), 8000)
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-sunsetAmber/20 via-rosePetal/15 to-lavenderPress/15 py-16 md:py-32 px-4 md:px-8 overflow-hidden">
      {/* Celebration hero */}
      <div className="text-center mb-12 md:mb-20 max-w-4xl mx-auto">
        <motion.p
          className="text-body-lg font-accent italic text-fadedGold mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          And now...
        </motion.p>
        
        <motion.h2
          className="font-heading font-bold bg-gradient-to-r from-burntSienna via-fadedGold to-rosePetal bg-clip-text text-transparent mb-6"
          style={{ fontSize: 'clamp(48px, 8vw, 96px)' }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          animate={{ scale: [1, 1.02, 1] }}
        >
          Let's Celebrate!
        </motion.h2>

        {/* Decorative underlines */}
        <motion.svg
          className="mx-auto mb-6"
          width="500"
          height="40"
          viewBox="0 0 500 40"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.path
            d="M 20 25 Q 125 15, 250 20 T 480 25"
            stroke="#E6A957"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          <motion.path
            d="M 30 30 Q 130 22, 250 25 T 470 30"
            stroke="#D4859D"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
        </motion.svg>

        <motion.p
          className="text-h4 font-body font-semibold text-warmCream-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Make a wish, blow out the candles ✨
        </motion.p>
      </div>

      {/* Cake */}
      <CakeComponent candleCount={age} onCandlesBlow={handleCandlesBlow} />

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && <Confetti particleCount={400} />}
      </AnimatePresence>

      {/* Wishes floating */}
      <AnimatePresence>
        {showWishes && <WishesFloat wishes={celebrationWishPhrases} />}
      </AnimatePresence>

      {/* Thank You Card */}
      <motion.div
        className="max-w-3xl mx-auto mt-16 md:mt-32 px-4 md:px-8"
        initial={{ opacity: 0, y: 60 }}
        animate={{
          opacity: showThankYou ? 1 : 0,
          y: showThankYou ? 0 : 60,
        }}
        transition={{ duration: 1, delay: 2 }}
      >
        <article className="relative bg-warmCream-50 border-4 border-fadedGold/70 rounded-3xl p-8 md:p-16 shadow-dramatic text-center">
          {/* Decorative tape corners */}
          <div className="absolute -top-5 left-20 w-40 h-12 bg-rosePetal/70 shadow-lg" style={{ transform: 'rotate(-3deg)' }} />
          <div className="absolute -top-5 right-20 w-40 h-12 bg-lavenderPress/70 shadow-lg" style={{ transform: 'rotate(3deg)' }} />

          <h3 className="text-h2 md:text-h1 font-heading font-bold text-sepiaInk mb-6">
            From All of Us to You
          </h3>

          <p className="text-body-xl md:text-body-lg font-body text-warmCream-800 leading-loose max-w-2xl mx-auto mb-6">
            This collection of memories, messages, and love has been gathered from everyone who holds you dear. Each word written, each moment shared, each wish whispered—they all bloom from hearts that are grateful to know you.
          </p>

          <p className="text-body-lg font-body text-warmCream-700 italic mb-8">
            You are loved beyond measure, today and always.
          </p>

          {/* Contributors */}
          <div className="pt-8 border-t-2 border-fadedGold/30">
            <p className="text-caption text-warmCream-600 font-body tracking-wide uppercase mb-4">
              With Love From
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {contributors.map((contributor, i) => (
                <motion.span
                  key={contributor.id}
                  className="text-h6 font-accent italic text-fadedGold"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 2.5 + i * 0.1 }}
                >
                  {contributor.name}
                  {i < contributors.length - 1 && (
                    <span className="mx-2 text-fadedGold/50">•</span>
                  )}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Large decorative flower */}
          <motion.svg
            className="mx-auto mt-12 w-24 h-24 text-fadedGold"
            viewBox="0 0 100 100"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 3, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <circle cx="50" cy="50" r="12" fill="currentColor" />
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * 360) / 8
              return (
                <ellipse
                  key={i}
                  cx="50"
                  cy="30"
                  rx="8"
                  ry="18"
                  fill="currentColor"
                  opacity="0.85"
                  transform={`rotate(${angle} 50 50)`}
                />
              )
            })}
          </motion.svg>
        </article>
      </motion.div>
    </section>
  )
}
