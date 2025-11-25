'use client'

import { motion } from 'framer-motion'
import type { IMessage } from '@/models/WishBloom'

interface MessageCardProps {
  message: IMessage
  index: number
}

/**
 * Letter Type Message Card
 */
function LetterCard({ message, index }: MessageCardProps) {
  // Split content into paragraphs
  const paragraphs = message.content.split('\n\n').filter((p: string) => p.trim())
  
  // Random coffee stain (30% chance)
  const hasCoffeeStain = index % 3 === 0

  return (
    <motion.article
      className="relative bg-warmCream-50 shadow-high p-8 md:p-16 border-l-4 border-rosePetal/60"
      style={{
        background: 'repeating-linear-gradient(transparent, transparent 31px, rgba(235, 224, 211, 0.5) 31px, rgba(235, 224, 211, 0.5) 33px)'
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px", amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
      {/* Decorative tape at top corners */}
      <div className="absolute -top-4 left-12 w-32 h-10 bg-sunsetAmber/60 shadow-md" style={{ transform: 'rotate(-2deg)' }} />
      <div className="absolute -top-4 right-12 w-32 h-10 bg-lavenderPress/60 shadow-md" style={{ transform: 'rotate(2deg)' }} />

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

      {/* Body paragraphs */}
      <div className="space-y-6 mb-12">
        {paragraphs.map((paragraph: string, i: number) => (
          <motion.p
            key={i}
            className="text-body-xl font-body text-warmCream-800 leading-loose"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
          >
            {paragraph}
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
