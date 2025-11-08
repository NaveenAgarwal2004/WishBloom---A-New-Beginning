'use client'

import { createContext, useContext, useState, useRef, useEffect } from 'react'

const AudioContext = createContext(null)

/**
 * Audio Context Provider
 * ✅ OPTIMIZED: Lazy-loads audio after page interactive
 */
export function AudioProvider({ children }) {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [volume, setVolume] = useState(0.08)
  const [audioReady, setAudioReady] = useState(false)
  const audioRef = useRef(null)
  const soundsRef = useRef({})

  // ✅ NEW: Lazy-load audio after page is interactive
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return

    const loadAudio = () => {
      // Create audio element for background music
      const audio = new Audio('/audio/background-music.mp3')
      audio.loop = true
      audio.volume = volume
      
      // ✅ FIX: Don't block page load
      audio.preload = 'none' // Changed from 'auto'
      
      audioRef.current = audio

      // Handle loading errors gracefully
      const handleError = () => {
        console.log('Audio not available - continuing without music')
      }
      audio.addEventListener('error', handleError)

      // ✅ Preload sound effects (small files)
      const soundConfig = {
        'candle-blow': 'wav',
        'confetti-pop': 'wav',
        'success-chime': 'mp3'
      }

      const loadedSounds = {}
      Object.entries(soundConfig).forEach(([name, ext]) => {
        const soundAudio = new Audio(`/audio/${name}.${ext}`)
        soundAudio.preload = 'auto' // These are small, OK to preload
        soundAudio.volume = 0.7
        soundAudio.addEventListener('error', () => {
          console.log(`Sound ${name} not available`)
        })
        loadedSounds[name] = soundAudio
      })
      soundsRef.current = loadedSounds

      setAudioReady(true)

      // Cleanup
      return () => {
        audio.removeEventListener('error', handleError)
      }
    }

    // ✅ NEW: Load audio AFTER page is fully interactive
    if (document.readyState === 'complete') {
      // Page already loaded
      loadAudio()
    } else {
      // Wait for page load
      window.addEventListener('load', loadAudio)
      return () => window.removeEventListener('load', loadAudio)
    }
  }, [])

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Stop and clean up main audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current.src = ''
        audioRef.current.load()
      }

      // Stop and clean up sound effects
      Object.values(soundsRef.current).forEach(soundAudio => {
        soundAudio.pause()
        soundAudio.currentTime = 0
        soundAudio.src = ''
        soundAudio.load()
      })

      // Clear refs
      audioRef.current = null
      soundsRef.current = {}
    }
  }, [])

  const toggleMusic = () => {
    if (!audioRef.current || !audioReady) return

    if (isMusicPlaying) {
      audioRef.current.pause()
      setIsMusicPlaying(false)
    } else {
      // Load audio on first play
      if (audioRef.current.preload === 'none') {
        audioRef.current.preload = 'auto'
        audioRef.current.load()
      }
      
      audioRef.current.play()
        .then(() => setIsMusicPlaying(true))
        .catch(e => {
          console.log('Play failed:', e)
        })
    }
  }

  const playSound = (soundName) => {
    if (!audioReady) return

    const preloadedSound = soundsRef.current[soundName]
    if (preloadedSound && preloadedSound.readyState >= 2) {
      preloadedSound.currentTime = 0
      preloadedSound.play().catch(e => {
        console.log('Sound play failed:', e)
      })
    }
  }

  const updateVolume = (newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolume(clampedVolume)
  }

  return (
    <AudioContext.Provider value={{ 
      isMusicPlaying, 
      volume, 
      toggleMusic, 
      playSound, 
      setVolume: updateVolume,
      audioReady 
    }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider')
  }
  return context
}