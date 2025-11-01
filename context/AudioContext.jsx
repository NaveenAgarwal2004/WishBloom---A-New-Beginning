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
    const audio = new Audio('/audio/background-music.mp3')
    audio.loop = true
    audio.volume = volume
    audioRef.current = audio

    // Handle loading errors gracefully
    const handleError = () => {
      // Silently handle - music is optional
    }
    audio.addEventListener('error', handleError)

    // Preload sound effects
    const soundConfig = {
      'candle-blow': 'wav',
      'confetti-pop': 'wav',
      'success-chime': 'mp3'
    };

    const loadedSounds = {}
    Object.entries(soundConfig).forEach(([name, ext]) => {
      const soundAudio = new Audio(`/audio/${name}.${ext}`)
      soundAudio.preload = 'auto'
      soundAudio.volume = 0.7
      soundAudio.addEventListener('error', () => {
        // Silently handle - sound effects are optional
      })
      loadedSounds[name] = soundAudio
    })
    soundsRef.current = loadedSounds

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

    // Cleanup function
    return () => {
      // Clean up event listeners
      audio.removeEventListener('error', handleError)
      document.removeEventListener('click', startMusic)
      document.removeEventListener('touchstart', startMusic)

      // Stop and clean up main audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current.src = ''
        audioRef.current.load() // Release resources
      }

      // Stop and clean up sound effects
      Object.values(soundsRef.current).forEach(soundAudio => {
        soundAudio.pause()
        soundAudio.currentTime = 0
        soundAudio.src = ''
        soundAudio.load() // Release resources
      })

      // Clear refs
      audioRef.current = null
      soundsRef.current = {}
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