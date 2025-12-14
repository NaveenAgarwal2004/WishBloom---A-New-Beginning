'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import { useMobile } from '@/hooks/use-mobile'
import type { IGuestbookEntry } from '@/models/WishBloom'
import type { GuestbookColor } from '@/schemas/guestbook.schema'

interface GuestbookSectionProps {
  wishbloomId: string
}

// Color mapping for sticky notes
const COLOR_STYLES: Record<GuestbookColor, { bg: string; border: string; text: string }> = {
  rosePetal: { bg: 'bg-rosePetal/30', border: 'border-rosePetal/60', text: 'text-rosePetal' },
  sunsetAmber: { bg: 'bg-sunsetAmber/30', border: 'border-sunsetAmber/60', text: 'text-sunsetAmber' },
  driedSage: { bg: 'bg-driedSage/30', border: 'border-driedSage/60', text: 'text-driedSage' },
  lavenderPress: { bg: 'bg-lavenderPress/30', border: 'border-lavenderPress/60', text: 'text-lavenderPress' },
}

/**
 * Generate deterministic rotation for each note based on ID
 */
function getRotation(id: string): number {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const base = (hash % 100) / 100 // 0-1 range
  return base * 4 - 2 // -2 to +2 degrees
}

/**
 * Individual Guestbook Note Card
 */
function GuestbookNote({ entry, index }: { entry: IGuestbookEntry; index: number }) {
  const rotation = useMemo(() => getRotation(entry.id), [entry.id])
  const colorStyle = COLOR_STYLES[entry.color]
  const { play } = useSoundEffects()
  const isMobile = useMobile()
  const cardRotation = isMobile ? 0 : rotation

  return (
    <motion.article
      className={`relative break-inside-avoid mb-6 p-6 rounded-xl shadow-soft-lift hover:shadow-natural border-2 ${colorStyle.bg} ${colorStyle.border} cursor-default group transition-shadow duration-300`}
      style={{ transform: `rotate(${cardRotation}deg)` }}
      initial={{ opacity: 0, y: 20, rotate: cardRotation }}
      animate={{ opacity: 1, y: 0, rotate: cardRotation }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ 
        y: -4, 
        rotate: 0, 
        scale: 1.02,
        boxShadow: '0px 12px 24px rgba(122, 92, 71, 0.2)'
      }}
      onMouseEnter={() => !isMobile && play('paper-rustle')}
      data-testid={`guestbook-note-${entry.id}`}
    >
      {/* Washi tape at top */}
      <div 
        className={`absolute -top-3 left-1/4 w-20 h-8 ${colorStyle.text} opacity-40 rounded-sm shadow-sm`}
        style={{ transform: 'rotate(-3deg)' }}
        aria-hidden="true"
      />

      {/* Message */}
      <p className="text-body-sm font-body text-warmCream-800 leading-relaxed mb-4 font-medium">
        "{entry.message}"
      </p>

      {/* Signature */}
      <div className="border-t-2 border-warmCream-300 pt-3">
        <p className={`font-accent italic text-body-sm font-semibold ${colorStyle.text}`}>
          — {entry.name}
        </p>
        <time className="text-caption font-mono text-warmCream-600 block mt-1">
          {new Date(entry.createdAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </time>
      </div>

      {/* Paper texture overlay */}
      <div className="absolute inset-0 opacity-10 rounded-xl pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <filter id={`paper-gb-${entry.id}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </defs>
          <rect width="100%" height="100%" filter={`url(#paper-gb-${entry.id})`} />
        </svg>
      </div>
    </motion.article>
  )
}

/**
 * Sign Guestbook Form Modal
 */
function SignGuestbookModal({ wishbloomId, onSuccess }: { wishbloomId: string; onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    color: 'rosePetal' as GuestbookColor,
  })
  const { play } = useSoundEffects()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          wishbloomId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to sign guestbook')
      }

      play('soft-chime')
      toast.success('Your message has been added! 🌸')
      setFormData({ name: '', message: '', color: 'rosePetal' })
      setOpen(false)
      onSuccess()
    } catch (error) {
      play('error')
      toast.error(error instanceof Error ? error.message : 'Failed to sign guestbook')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-gradient-to-r from-burntSienna to-fadedGold hover:from-fadedGold hover:to-burntSienna text-warmCream-50 font-heading font-semibold text-body-lg px-8 py-6 rounded-2xl shadow-colored-gold transition-all duration-300 hover:shadow-dramatic hover:scale-105"
          data-testid="sign-guestbook-button"
        >
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Sign the Guestbook
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-paper-texture-prominent border-2 border-warmCream-400 shadow-dramatic">
        <DialogHeader>
          <DialogTitle className="text-h4 font-heading font-bold text-sepiaInk mb-2">
            Leave Your Mark
          </DialogTitle>
          <DialogDescription className="text-body-sm text-warmCream-700 font-body">
            Share a birthday wish or memory on this digital sticky note
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-body font-body font-semibold text-sepiaInk">
              Your Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Jane Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              maxLength={50}
              className="bg-warmCream-50 border-2 border-warmCream-400 focus:border-burntSienna text-body font-body"
              data-testid="guestbook-name-input"
            />
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-body font-body font-semibold text-sepiaInk">
              Your Message
            </Label>
            <Textarea
              id="message"
              placeholder="Happy Birthday! May all your wishes bloom..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              maxLength={300}
              rows={4}
              className="bg-warmCream-50 border-2 border-warmCream-400 focus:border-burntSienna text-body font-body resize-none"
              data-testid="guestbook-message-input"
            />
            <p className="text-caption text-warmCream-600 text-right">
              {formData.message.length}/300
            </p>
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <Label className="text-body font-body font-semibold text-sepiaInk">
              Note Color
            </Label>
            <div className="flex gap-3">
              {(['rosePetal', 'sunsetAmber', 'driedSage', 'lavenderPress'] as GuestbookColor[]).map((color) => {
                const style = COLOR_STYLES[color]
                const isSelected = formData.color === color
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`flex-1 h-16 rounded-xl border-3 transition-all duration-200 ${style.bg} ${
                      isSelected 
                        ? `${style.border} border-4 scale-105 shadow-medium` 
                        : 'border-warmCream-300 hover:border-warmCream-400 hover:scale-102'
                    }`}
                    aria-label={`Select ${color} color`}
                    data-testid={`color-${color}`}
                  >
                    {isSelected && (
                      <svg className="w-6 h-6 mx-auto text-warmCream-800" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-burntSienna to-fadedGold hover:from-fadedGold hover:to-burntSienna text-warmCream-50 font-heading font-semibold text-body py-6 rounded-xl shadow-colored-gold transition-all duration-300 hover:shadow-high disabled:opacity-50"
            data-testid="submit-guestbook-button"
          >
            {loading ? 'Signing...' : 'Sign Guestbook'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Main Guestbook Section Component
 * Phase 4.2: Displays visitor messages in a masonry layout
 */
export default function GuestbookSection({ wishbloomId }: GuestbookSectionProps) {
  const [entries, setEntries] = useState<IGuestbookEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  // Fetch guestbook entries
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch(`/api/guestbook?wishbloomId=${wishbloomId}`)
        const data = await response.json()

        if (data.success) {
          setEntries(data.entries || [])
        }
      } catch (error) {
        console.error('Failed to fetch guestbook entries:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEntries()
  }, [wishbloomId, refreshKey])

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1)
  }

  if (loading) {
    return (
      <section className="py-16 px-4 bg-warmCream-100" data-testid="guestbook-section">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-warmCream-300 rounded w-64 mx-auto mb-4" />
            <div className="h-6 bg-warmCream-300 rounded w-96 mx-auto" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-warmCream-100 to-warmCream-200" data-testid="guestbook-section">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            className="text-h2 md:text-h1 font-heading font-bold text-sepiaInk mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Visitor Tags
          </motion.h2>
          <motion.p
            className="text-body-lg md:text-body-xl font-body text-warmCream-700 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            A collection of birthday wishes from friends, family, and well-wishers
          </motion.p>

          {/* Sign Guestbook Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SignGuestbookModal wishbloomId={wishbloomId} onSuccess={handleSuccess} />
          </motion.div>
        </div>

        {/* Guestbook Entries - Masonry Layout */}
        {entries.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
            <AnimatePresence>
              {entries.map((entry, index) => (
                <GuestbookNote key={entry.id} entry={entry} index={index} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <svg className="w-24 h-24 mx-auto text-warmCream-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-body-lg font-body text-warmCream-600 mb-6">
              Be the first to sign the guestbook!
            </p>
            <SignGuestbookModal wishbloomId={wishbloomId} onSuccess={handleSuccess} />
          </motion.div>
        )}
      </div>
    </section>
  )
}
