'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useMobile } from '@/hooks/use-mobile'
import type { IMemory } from '@/models/WishBloom'

// Type for tag colors
type TagType = 'love' | 'milestone' | 'nostalgic' | 'celebration' | 'funny'

interface TagColors {
  bg: string
  border: string
  text: string
}

// Tag color mapping
const TAG_COLORS: Record<TagType, TagColors> = {
  love: { bg: 'bg-rosePetal/20', border: 'border-rosePetal/60', text: 'text-rosePetal' },
  milestone: { bg: 'bg-sunsetAmber/20', border: 'border-sunsetAmber/60', text: 'text-sunsetAmber' },
  nostalgic: { bg: 'bg-lavenderPress/20', border: 'border-lavenderPress/60', text: 'text-lavenderPress' },
  celebration: { bg: 'bg-driedSage/20', border: 'border-driedSage/60', text: 'text-driedSage' },
  funny: { bg: 'bg-dustyIndigo/20', border: 'border-dustyIndigo/60', text: 'text-dustyIndigo' },
}

// Sepia-toned blur placeholder (matches warmCream background)
const BLUR_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAG0lEQVQIW2P4//8/AxJgYmBg+A8SRxZgQOMDAFa/BAXJvbRDAAAAAElFTkSuQmCC'

/**
 * Calculate deterministic rotation based on ID to avoid hydration mismatch
 */
function getRotation(id: string, type: 'standard' | 'featured' | 'quote'): number {
  // Create a deterministic hash from the ID
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const base = (hash % 100) / 100 // 0-1 range
  
  if (type === 'featured') {
    return base * 24 - 12 // -12 to +12
  } else if (type === 'quote') {
    return base * 20 - 10 // -10 to +10
  } else {
    return base * 16 - 8 // -8 to +8
  }
}

interface MemoryCardComponentProps {
  memory: IMemory
  rotation: number
  index: number
}

/**
 * Standard Memory Card (60% of cards) - Phase 2 Enhanced
 */
function StandardMemoryCard({ memory, rotation, index }: MemoryCardComponentProps) {
  const isMobile = useMobile()
  const cardRotation = isMobile ? 0 : rotation
  
  return (
    <motion.article
      className="relative bg-paper-texture-prominent rounded-xl p-6 md:p-10 shadow-natural hover:shadow-elevated border-2 border-warmCream-400 cursor-pointer group overflow-hidden transition-shadow duration-300"
      style={{ transform: `rotate(${cardRotation}deg)` }}
      initial={{ opacity: 0, y: 40, rotate: cardRotation }}
      whileInView={{ opacity: 1, y: 0, rotate: cardRotation }}
      viewport={{ once: true, margin: "-50px", amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ 
        y: -12, 
        rotate: 0, 
        scale: 1.03, 
        boxShadow: '0px 32px 64px rgba(43, 37, 32, 0.32), 0px 16px 32px rgba(43, 37, 32, 0.24)',
        borderColor: '#D4A373'
      }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Decorative washi tape corner glow - Enhanced */}
      <div className="absolute -top-3 -right-3 w-24 h-24 bg-gradient-to-br from-rosePetal/60 to-lavenderPress/60 rounded-full blur-xl opacity-70 group-hover:opacity-90 transition-opacity" aria-hidden="true" />
      
      {/* Paper clip (30% chance) - More visible */}
      {index % 3 === 0 && (
        <svg className="absolute -top-4 right-8 w-12 h-12 opacity-50 group-hover:opacity-70 transition-opacity" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="#7A5C47" strokeWidth="2.5"/>
        </svg>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-micro font-mono font-semibold text-burntSienna tracking-wider">
          MEMORY {String(index + 1).padStart(2, '0')}
        </span>
        <div className="h-px flex-1 bg-warmCream-400" />
      </div>

      {/* Date */}
      <time className="text-caption font-mono text-warmCream-600 block mb-3">
        {new Date(memory.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </time>

      {/* Image if present - Phase 2 Enhanced */}
      {memory.imageUrl && (
        <div className="relative mb-6 -mx-6 md:-mx-10">
          <div className="relative w-full h-64">
            <Image
              src={memory.imageUrl}
              alt={memory.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover shadow-medium group-hover:shadow-elevated transition-shadow duration-300"
              style={{ clipPath: 'polygon(3% 2%, 98% 0%, 97% 98%, 1% 97%)' }}
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
          </div>
          {/* Photo corner tapes - More prominent */}
          <div className="absolute top-2 left-2 w-20 h-10 bg-gradient-to-br from-sunsetAmber/80 to-sunsetAmber/60 shadow-md group-hover:shadow-lg transition-shadow" style={{ transform: 'rotate(-45deg)' }} aria-hidden="true" />
          <div className="absolute top-2 right-2 w-20 h-10 bg-gradient-to-br from-rosePetal/80 to-rosePetal/60 shadow-md group-hover:shadow-lg transition-shadow" style={{ transform: 'rotate(45deg)' }} aria-hidden="true" />
        </div>
      )}

      {/* Title */}
      <h3 className="text-h4 md:text-h5 font-heading font-semibold text-sepiaInk mb-3 group-hover:text-burntSienna transition-colors">
        {memory.title}
      </h3>

      {/* Description */}
      <p className="text-body font-body text-warmCream-700 leading-loose line-clamp-5 mb-6">
        {memory.description}
      </p>

      {/* Tags */}
      {memory.tags && memory.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {memory.tags.map((tag, i) => {
            const colors = TAG_COLORS[tag as TagType] || TAG_COLORS.love
            return (
              <span
                key={i}
                className={`px-3 py-1 rounded-full border-2 text-caption font-body font-semibold ${colors.bg} ${colors.border} ${colors.text}`}
              >
                {tag}
              </span>
            )
          })}
        </div>
      )}

      {/* Footer */}
      <div className="border-t-2 border-warmCream-300 pt-4 flex justify-between items-center">
        <span className="font-accent italic text-fadedGold text-body-sm">
          &mdash; {memory.contributor.name}
        </span>
      </div>

      {/* Paper texture overlay */}
      <div className="absolute inset-0 opacity-10 rounded-xl pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <filter id={`paper-${memory.id}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </defs>
          <rect width="100%" height="100%" filter={`url(#paper-${memory.id})`} />
        </svg>
      </div>
    </motion.article>
  )
}

/**
 * Featured Memory Card (15% of cards)
 */
function FeaturedMemoryCard({ memory, rotation, index }: MemoryCardComponentProps) {
  const isMobile = useMobile()
  const cardRotation = isMobile ? 0 : rotation
  
  return (
    <motion.article
      className="relative col-span-2 row-span-2 bg-warmCream-50 rounded-2xl p-8 md:p-16 shadow-dramatic border-4 border-fadedGold/60 cursor-pointer group z-20 overflow-hidden"
      style={{ transform: `rotate(${cardRotation}deg)` }}
      initial={{ opacity: 0, y: 40, scale: 0.95, rotate: cardRotation }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotate: cardRotation }}
      viewport={{ once: true, margin: "-50px", amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.02, 
        rotate: 0, 
        boxShadow: '0px 8px 24px rgba(212, 163, 115, 0.3)'
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Large decorative floral watermark */}
      <svg className="absolute bottom-8 right-8 w-48 h-48 opacity-15" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="30" fill="#D4A373" />
        <ellipse cx="100" cy="50" rx="25" ry="45" fill="#D4A373" opacity="0.8" />
        <ellipse cx="150" cy="100" rx="45" ry="25" fill="#D4A373" opacity="0.8" />
        <ellipse cx="100" cy="150" rx="25" ry="45" fill="#D4A373" opacity="0.8" />
        <ellipse cx="50" cy="100" rx="45" ry="25" fill="#D4A373" opacity="0.8" />
      </svg>

      {/* Featured badge */}
      <div className="absolute -top-4 left-12 px-6 py-2 bg-gradient-to-r from-burntSienna to-fadedGold text-warmCream-50 rounded-full shadow-colored-gold">
        <span className="text-micro font-mono font-bold tracking-widest">FEATURED MEMORY</span>
      </div>

      {/* Washi tape strips at top */}
      <div className="absolute -top-4 right-20 w-40 h-10 bg-gradient-to-r from-rosePetal/70 to-lavenderPress/70 rounded-sm shadow-md" style={{ transform: 'rotate(3deg)' }} />
      <div className="absolute -top-3 right-32 w-40 h-10 bg-gradient-to-r from-sunsetAmber/70 to-driedSage/70 rounded-sm shadow-md" style={{ transform: 'rotate(-2deg)' }} />

      {/* Image first */}
      {memory.imageUrl && (
        <div className="relative mb-8">
          <div className="relative w-full h-96">
            <Image
              src={memory.imageUrl}
              alt={memory.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 66vw"
              className="object-cover rounded-2xl shadow-high"
              style={{ clipPath: 'polygon(2% 1%, 99% 0%, 98% 99%, 1% 98%)' }}
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
          </div>
          {/* 4 photo corners */}
          <div className="absolute top-0 left-0 w-24 h-12 bg-rosePetal/80 shadow-md" style={{ transform: 'rotate(-45deg)', transformOrigin: 'top left' }} />
          <div className="absolute top-0 right-0 w-24 h-12 bg-sunsetAmber/80 shadow-md" style={{ transform: 'rotate(45deg)', transformOrigin: 'top right' }} />
          <div className="absolute bottom-0 left-0 w-24 h-12 bg-lavenderPress/80 shadow-md" style={{ transform: 'rotate(45deg)', transformOrigin: 'bottom left' }} />
          <div className="absolute bottom-0 right-0 w-24 h-12 bg-mossGreen/80 shadow-md" style={{ transform: 'rotate(-45deg)', transformOrigin: 'bottom right' }} />
        </div>
      )}

      {/* Date */}
      <time className="text-body-sm font-mono text-warmCream-600 block mb-4">
        {new Date(memory.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </time>

      {/* Title */}
      <h3 className="text-h2 md:text-h1 font-heading font-bold text-sepiaInk mb-4">
        {memory.title}
      </h3>

      {/* Hand-drawn underline */}
      <svg className="mb-6" width="200" height="12" viewBox="0 0 200 12">
        <path d="M 5 8 Q 50 4, 100 6 T 195 8" stroke="#D4A373" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>

      {/* Description */}
      <p className="text-body-xl font-body text-warmCream-800 leading-loose mb-8">
        {memory.description}
      </p>

      {/* Tags - larger */}
      {memory.tags && memory.tags.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-8">
          {memory.tags.map((tag, i) => {
            const colors = TAG_COLORS[tag as TagType] || TAG_COLORS.love
            return (
              <span
                key={i}
                className={`px-4 py-2 rounded-full border-2 text-body-sm font-body font-semibold ${colors.bg} ${colors.border} ${colors.text}`}
              >
                {tag}
              </span>
            )
          })}
        </div>
      )}

      {/* Footer */}
      <div className="border-t-2 border-fadedGold/30 pt-6">
        <span className="font-accent italic text-fadedGold text-body-lg">
          &mdash; {memory.contributor.name}
        </span>
      </div>
    </motion.article>
  )
}

/**
 * Quote Memory Card (10% of cards)
 */
function QuoteMemoryCard({ memory, rotation, index }: MemoryCardComponentProps) {
  const isMobile = useMobile()
  const cardRotation = isMobile ? 0 : rotation
  
  return (
    <motion.article
      className="relative bg-gradient-to-br from-lavenderPress/20 to-rosePetal/20 rounded-xl p-8 md:p-12 shadow-medium border-2 border-lavenderPress/40 cursor-pointer group overflow-hidden"
      style={{ transform: `rotate(${cardRotation}deg)` }}
      initial={{ opacity: 0, y: 40, scale: 0.95, rotate: cardRotation }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotate: cardRotation }}
      viewport={{ once: true, margin: "-50px", amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.05, 
        rotate: 0, 
        boxShadow: '0px 8px 24px rgba(168, 139, 199, 0.3)'
      }}
      whileTap={{ scale: 0.97 }}
    >
      {/* HUGE opening quote mark */}
      <span className="absolute -top-8 -left-8 text-lavenderPress/30 font-heading font-bold leading-none" style={{ fontSize: '160px' }}>
        &ldquo;
      </span>

      {/* Quote text */}
      <div className="relative z-10">
        <p className="text-h5 md:text-h4 font-body font-medium text-warmCream-800 text-center leading-relaxed mb-6">
          {memory.description}
        </p>

        {/* Attribution */}
        <p className="text-body font-accent italic text-fadedGold text-center">
          &mdash; {memory.contributor.name}
        </p>
      </div>

      {/* Small decorative ornament */}
      <svg className="mx-auto mt-6" width="64" height="16" viewBox="0 0 64 16">
        <line x1="0" y1="8" x2="24" y2="8" stroke="#A88BC7" strokeWidth="2" />
        <circle cx="32" cy="8" r="4" fill="#A88BC7" />
        <line x1="40" y1="8" x2="64" y2="8" stroke="#A88BC7" strokeWidth="2" />
      </svg>
    </motion.article>
  )
}

interface MemoryCardProps {
  memory: IMemory
  index: number
}

/**
 * Main Memory Card component that renders the appropriate type
 */
export default function MemoryCard({ memory, index }: MemoryCardProps) {
  // Calculate deterministic rotation based on memory ID to avoid hydration mismatch
  const rotation = getRotation(memory.id, memory.type)

  if (memory.type === 'featured') {
    return <FeaturedMemoryCard memory={memory} rotation={rotation} index={index} />
  }

  if (memory.type === 'quote') {
    return <QuoteMemoryCard memory={memory} rotation={rotation} index={index} />
  }

  return <StandardMemoryCard memory={memory} rotation={rotation} index={index} />
}
