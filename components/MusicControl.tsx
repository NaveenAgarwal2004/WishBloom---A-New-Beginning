'use client'

import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { useAudio } from '@/context/AudioContext'

// No props interface needed - component has no props
export default function MusicControl() {
  const { isMusicPlaying, toggleMusic } = useAudio()

  return (
    <motion.button
      className="fixed top-8 right-8 z-50 w-14 h-14 rounded-full bg-warmCream-200/80 backdrop-blur-sm border-2 border-fadedGold/40 shadow-medium flex items-center justify-center"
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleMusic}
      title={isMusicPlaying ? 'Music On' : 'Music Off'}
      aria-label={isMusicPlaying ? 'Pause background music' : 'Play background music'}
    >
      <motion.div
        key={isMusicPlaying ? 'on' : 'off'}
        initial={{ scale: 0, rotate: 180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: -180 }}
        transition={{ duration: 0.3 }}
      >
        {isMusicPlaying ? (
          <Volume2 size={24} className="text-fadedGold" />
        ) : (
          <VolumeX size={24} className="text-warmCream-600" />
        )}
      </motion.div>
    </motion.button>
  )
}
