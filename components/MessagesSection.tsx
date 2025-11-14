'use client'

import { motion } from 'framer-motion'
import MessageCard from './MessageCard'
import type { IMessage } from '@/models/WishBloom'

interface MessagesSectionProps {
  messages: IMessage[]
}

export default function MessagesSection({ messages }: MessagesSectionProps) {
  // Botanical divider component
  const BotanicalDivider = () => (
    <motion.div
      className="flex items-center justify-center py-12"
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <svg className="w-20 h-20 text-mossGreen opacity-40" viewBox="0 0 80 80">
        {/* Stem */}
        <line x1="40" y1="20" x2="40" y2="60" stroke="currentColor" strokeWidth="2" />
        {/* Leaves */}
        <ellipse cx="30" cy="35" rx="8" ry="12" fill="currentColor" opacity="0.7" transform="rotate(-30 30 35)" />
        <ellipse cx="50" cy="45" rx="8" ry="12" fill="currentColor" opacity="0.7" transform="rotate(30 50 45)" />
        {/* Flower */}
        <circle cx="40" cy="25" r="8" fill="currentColor" />
        <ellipse cx="40" cy="17" rx="5" ry="7" fill="currentColor" opacity="0.8" />
        <ellipse cx="48" cy="25" rx="7" ry="5" fill="currentColor" opacity="0.8" />
        <ellipse cx="40" cy="33" rx="5" ry="7" fill="currentColor" opacity="0.8" />
        <ellipse cx="32" cy="25" rx="7" ry="5" fill="currentColor" opacity="0.8" />
      </svg>
    </motion.div>
  )

  return (
    <section className="py-16 md:py-32 bg-gradient-to-b from-warmCream-100 to-rosePetal/8 px-4 md:px-8">
      {/* Section header */}
      <div className="text-center mb-16 md:mb-24 max-w-4xl mx-auto">
        <motion.h2
          className="text-h1 md:text-display font-heading font-bold text-sepiaInk mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Words We've Saved For You
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="text-body-lg font-accent italic text-warmCream-700"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Letters and verses from the heart
        </motion.p>

        {/* Botanical divider */}
        <div className="flex items-center justify-center gap-8 max-w-2xl mx-auto mt-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-fadedGold to-transparent" />
          <svg className="w-16 h-16 text-fadedGold" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="8" fill="currentColor" />
            <ellipse cx="32" cy="20" rx="6" ry="10" fill="currentColor" opacity="0.8" />
            <ellipse cx="44" cy="32" rx="10" ry="6" fill="currentColor" opacity="0.8" />
            <ellipse cx="32" cy="44" rx="6" ry="10" fill="currentColor" opacity="0.8" />
            <ellipse cx="20" cy="32" rx="10" ry="6" fill="currentColor" opacity="0.8" />
            {/* Stem */}
            <line x1="32" y1="44" x2="32" y2="58" stroke="currentColor" strokeWidth="2" />
          </svg>
          <div className="h-px flex-1 bg-gradient-to-r from-fadedGold via-fadedGold to-transparent" />
        </div>
      </div>

      {/* Message cards */}
      <div className="max-w-4xl mx-auto space-y-20">
        {messages.map((message, index) => (
          <div key={message.id}>
            <MessageCard message={message} index={index} />
            
            {/* Botanical divider between every 2-3 messages */}
            {(index + 1) % 2 === 0 && index < messages.length - 1 && (
              <BotanicalDivider />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
