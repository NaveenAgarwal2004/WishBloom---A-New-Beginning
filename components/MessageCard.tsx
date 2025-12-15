'use client'

import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { IMessage } from '@/models/WishBloom'

interface MessageCardProps {
  message: IMessage
  index: number
}

/**
 * Typewriter effect hook for text animation
 */
function useTypewriter(text: string, speed: number = 30) {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    // Skip animation if user prefers reduced motion
    if (shouldReduceMotion) {
      setDisplayText(text)
      setIsComplete(true)
      return
    }

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex))
        currentIndex++
      } else {
        setIsComplete(true)
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, shouldReduceMotion])

  return { displayText, isComplete }
}

/**
 * Letter Type Message Card with Typewriter Effect
 */
function LetterCard({ message, index }: MessageCardProps) {
  const [isInView, setIsInView] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  
  // Split content into paragraphs
  const paragraphs = message.content.split('\n\n').filter((p: string) => p.trim())
  
  // Typewriter effect for first paragraph only (performance optimization)
  const firstParagraph = paragraphs[0] || ''
  const { displayText: typedText, isComplete } = useTypewriter(
    isInView ? firstParagraph : '', 
    25
  )
  
  // Random coffee stain (30% chance)
  const hasCoffeeStain = index % 3 === 0

  return (
    <motion.article
      className="relative bg-paper-texture shadow-elevated p-8 md:p-16 border-l-4 border-rosePetal/60 hover-lift"
      style={{
        background: 'repeating-linear-gradient(transparent, transparent 31px, rgba(235, 224, 211, 0.5) 31px, rgba(235, 224, 211, 0.5) 33px)'
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: shouldReduceMotion ? 0.01 : 0.5, 
          delay: shouldReduceMotion ? 0 : index * 0.1, 
          ease: "easeOut" 
        }
      }}
      onViewportEnter={() => setIsInView(true)}
      viewport={{ once: true, margin: "-50px", amount: 0.3 }}
    >
      {/* Decorative tape at top corners - Enhanced visibility */}
      <div 
        className="absolute -top-4 left-12 w-32 h-10 bg-gradient-to-br from-sunsetAmber/70 to-sunsetAmber/50 shadow-md" 
        style={{ transform: 'rotate(-2deg)' }} 
        aria-hidden="true"
      />
      <div 
        className="absolute -top-4 right-12 w-32 h-10 bg-gradient-to-br from-lavenderPress/70 to-lavenderPress/50 shadow-md" 
        style={{ transform: 'rotate(2deg)' }} 
        aria-hidden="true"
      />

      {/* Optional coffee stain */}
      {hasCoffeeStain && (
        <div className="absolute top-20 right-20 w-24 h-24 rounded-full bg-burntSienna/10 blur-sm" />
      )}

      {/* Date stamp */}
      <div className="absolute top-6 right-6 text-caption font-mono text-warmCream-600 px-3 py-1 bg-warmCream-200 rounded">
        {new Date(message.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </div>

      {/* Greeting */}
      {message.greeting && (
        <p className="text-h5 font-body font-semibold text-sepiaInk mb-6">
          {message.greeting}
        </p>
      )}

      {/* Body paragraphs with typewriter effect on first paragraph */}
      <div className="space-y-6 mb-12">
        {paragraphs.map((paragraph: string, i: number) => (
          <motion.p
            key={i}
            className={`text-body-xl font-body text-warmCream-800 leading-loose ${
              i === 0 && !isComplete && !shouldReduceMotion ? 'typewriter-cursor' : ''
            }`}
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.6, delay: shouldReduceMotion ? 0 : i * 0.15 }}
          >
            {i === 0 && !shouldReduceMotion ? typedText : paragraph}
          </motion.p>
        ))}
      </div>

      {/* Closing and signature */}
      <div className="text-right mt-12 space-y-2">
        {message.closing && (
          <p className="text-body-lg font-accent italic text-fadedGold">
            {message.closing}
          </p>
        )}
        <p className="text-h6 font-accent italic text-sepiaInk">
          &mdash; {message.signature}
        </p>
      </div>

      {/* Postscript */}
      {message.postscript && (
        <div className="mt-8 pl-8 border-l-2 border-fadedGold/40">
          <p className="text-body font-body text-warmCream-700 italic">
            {message.postscript}
          </p>
        </div>
      )}

      {/* Phase 5: Voice Message */}
      {message.audioUrl && (
        <div className="mt-8 pt-6 border-t-2 border-warmCream-300">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-lavenderPress" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <p className="text-body-sm font-body font-semibold text-sepiaInk">
              Voice Message
            </p>
          </div>
          <audio 
            controls 
            src={message.audioUrl}
            className="w-full max-w-md"
            style={{
              filter: 'sepia(30%) saturate(90%) hue-rotate(-10deg)',
            }}
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {/* Small floral accent */}
      <svg className="absolute bottom-4 left-4 w-12 h-12 text-rosePetal opacity-30" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="6" fill="currentColor" />
        <ellipse cx="24" cy="14" rx="4" ry="8" fill="currentColor" opacity="0.8" />
        <ellipse cx="34" cy="24" rx="8" ry="4" fill="currentColor" opacity="0.8" />
        <ellipse cx="24" cy="34" rx="4" ry="8" fill="currentColor" opacity="0.8" />
        <ellipse cx="14" cy="24" rx="8" ry="4" fill="currentColor" opacity="0.8" />
      </svg>
    </motion.article>
  )
}

/**
 * Poem Type Message Card
 */
function PoemCard({ message, index }: MessageCardProps) {
  // Split content into lines
  const lines = message.content.split('\n').filter((l: string) => l.trim())

  return (
    <motion.article
      className="relative bg-gradient-to-br from-lavenderPress/15 to-rosePetal/15 rounded-2xl p-8 md:p-16 shadow-medium border-2 border-lavenderPress/50"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px", amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
    >
      {/* Giant decorative quote */}
      <span className="absolute -top-12 -left-8 text-lavenderPress/20 font-heading font-bold leading-none pointer-events-none" style={{ fontSize: '180px' }}>
        &ldquo;
      </span>

      {/* Poem title */}
      {message.title && (
        <h3 className="relative z-10 text-h4 font-heading font-semibold text-sepiaInk text-center mb-8">
          {message.title}
        </h3>
      )}

      {/* Poem lines */}
      <div className="relative z-10 space-y-4 mb-8">
        {lines.map((line: string, i: number) => (
          <motion.p
            key={i}
            className="text-h6 font-accent italic text-warmCream-800 leading-relaxed text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
          >
            {line}
          </motion.p>
        ))}
      </div>

      {/* Attribution */}
      <p className="text-body-lg font-accent italic text-fadedGold text-center">
        &mdash; {message.signature}
      </p>

      {/* Decorative line ornament */}
      <svg className="mx-auto mt-6" width="128" height="24" viewBox="0 0 128 24">
        <line x1="0" y1="12" x2="50" y2="12" stroke="#A88BC7" strokeWidth="2" />
        <circle cx="64" cy="12" r="6" fill="#A88BC7" />
        <line x1="78" y1="12" x2="128" y2="12" stroke="#A88BC7" strokeWidth="2" />
      </svg>

      {/* Phase 5: Voice Message */}
      {message.audioUrl && (
        <div className="relative z-10 mt-8 pt-6 border-t-2 border-lavenderPress/30">
          <div className="flex items-center justify-center gap-2 mb-3">
            <svg className="w-5 h-5 text-lavenderPress" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <p className="text-body-sm font-body font-semibold text-sepiaInk">
              Voice Message
            </p>
          </div>
          <div className="flex justify-center">
            <audio 
              controls 
              src={message.audioUrl}
              className="max-w-md"
              style={{
                filter: 'sepia(30%) saturate(90%) hue-rotate(-10deg)',
              }}
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      )}
    </motion.article>
  )
}

/**
 * Main Message Card component
 */
export default function MessageCard({ message, index }: MessageCardProps) {
  if (message.type === 'poem') {
    return <PoemCard message={message} index={index} />
  }
  
  return <LetterCard message={message} index={index} />
}