'use client'

import { createContext, useContext, useState, useRef, useEffect } from 'react'

const AudioContext = createContext(null)

/**
 * Audio Context Provider
 * Provides background music and sound effects
 */
export function AudioProvider({ children }) {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [volume, setVolume] = useState(0.08)
  const audioRef = useRef(null)
  const soundsRef = useRef({})

  useEffect(() => {
    // Create audio element for background music
    audioRef.current = new Audio('/audio/background-music.mp3')
    audioRef.current.loop = true
    audioRef.current.volume = volume

    // Handle loading errors gracefully
    audioRef.current.addEventListener('error', () => {
      // Silently handle - music is optional
    })

    // Preload sound effects
    const soundConfig = {
      'candle-blow': 'wav',
      'confetti-pop': 'wav',
      'success-chime': 'mp3'
    }
    Object.entries(soundConfig).forEach(([name, ext]) => {
      const audio = new Audio(`/audio/${name}.${ext}`)
      audio.preload = 'auto'
      audio.volume = 0.7
      audio.addEventListener('error', () => {
        // Silently handle - sound effects are optional
      })
      soundsRef.current[name] = audio
    })

    // Auto-start background music on page load (user interaction required by browsers)
    const startMusic = () => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => setIsMusicPlaying(true))
          .catch(e => {
            console.log('Auto-play failed (user interaction required):', e)
          })
      }
      document.removeEventListener('click', startMusic)
      document.removeEventListener('touchstart', startMusic)
    }

    // Listen for first user interaction to start music
    document.addEventListener('click', startMusic)
    document.addEventListener('touchstart', startMusic)

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
      Object.values(soundsRef.current).forEach(audio => {
        audio.pause()
        audio.src = ''
      })
      document.removeEventListener('click', startMusic)
      document.removeEventListener('touchstart', startMusic)
    }
  }, [])

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const toggleMusic = () => {
    if (!audioRef.current) return

    if (isMusicPlaying) {
      audioRef.current.pause()
      setIsMusicPlaying(false)
    } else {
      audioRef.current.play()
        .then(() => setIsMusicPlaying(true))
        .catch(e => {
          console.log('Play failed (user interaction may be required):', e)
        })
    }
  }

  const playSound = (soundName) => {
    // Try preloaded sound first
    const preloadedSound = soundsRef.current[soundName]
    if (preloadedSound && preloadedSound.readyState >= 2) {
      // Only play if audio is loaded (readyState >= 2 means HAVE_CURRENT_DATA or better)
      preloadedSound.currentTime = 0
      preloadedSound.play().catch(e => {
        // Silently fail - audio is optional
      })
      return
    }

    // If no preloaded sound available, just skip (audio is optional)
    // This prevents errors when audio files are missing
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
      setVolume: updateVolume 
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