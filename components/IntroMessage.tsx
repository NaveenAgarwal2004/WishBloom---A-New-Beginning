'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface IntroMessageProps {
  message: string
}

/**
 * Intro message card with washi tape and pressed flower decorations
 */
export default function IntroMessage({ message }: IntroMessageProps) {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    // Only set to true after mount to avoid hydration issues
    const timer = setTimeout(() => setIsClient(true), 0)
    return () => clearTimeout(timer)
  }, [])

  if (!message) return null

  const paragraphs = message.split('\n\n').filter(p => p.trim())
  
  const firstParagraph = paragraphs[0] || ''
  const firstLetter = isClient ? firstParagraph.charAt(0) : ''
  const restOfFirst = isClient ? firstParagraph.slice(1) : firstParagraph

  return (
    <section id="intro-message" className="py-16 md:py-24 px-4 md:px-8">
      <motion.article
        className="relative max-w-3xl mx-auto bg-warmCream-50 rounded-2xl shadow-medium p-8 md:p-16 border-2 border-warmCream-300"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute -top-4 left-12 w-32 h-8 bg-rosePetal/40 rounded-sm shadow-md" style={{ transform: 'rotate(2deg)' }} />
        <div className="absolute -top-4 right-12 w-32 h-8 bg-lavenderPress/40 rounded-sm shadow-md" style={{ transform: 'rotate(-1deg)' }} />

        <div className="relative z-10">
          <p className="text-body-xl md:text-body-lg font-body text-warmCream-700 leading-loose mb-6">
            {isClient && firstLetter && (
              <span className="float-left text-9xl font-heading font-bold text-fadedGold leading-none mr-3 mt-2">
                {firstLetter}
              </span>
            )}
            {restOfFirst}
          </p>

          {paragraphs.slice(1).map((paragraph, index) => (
            <p key={index} className="text-body-xl md:text-body-lg font-body text-warmCream-700 leading-loose mb-6">
              {paragraph}
            </p>
          ))}
        </div>

        <svg 
          className="absolute bottom-4 right-4 opacity-30"
          width="64" 
          height="64" 
          viewBox="0 0 64 64"
        >
          <circle cx="32" cy="32" r="8" fill="#D4859D" />
          <ellipse cx="32" cy="20" rx="6" ry="10" fill="#D4859D" opacity="0.8" />
          <ellipse cx="44" cy="32" rx="10" ry="6" fill="#D4859D" opacity="0.8" />
          <ellipse cx="32" cy="44" rx="6" ry="10" fill="#D4859D" opacity="0.8" />
          <ellipse cx="20" cy="32" rx="10" ry="6" fill="#D4859D" opacity="0.8" />
        </svg>
      </motion.article>
    </section>
  )
}