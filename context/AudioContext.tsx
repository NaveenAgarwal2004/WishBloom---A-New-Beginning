'use client'

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react'

interface AudioContextType {
  isMusicPlaying: boolean
  volume: number
  toggleMusic: () => void
  playSound: (soundName: 'candle-blow' | 'confetti-pop' | 'success-chime' | 'paper-rustle') => void
  setVolume: (volume: number) => void
  audioReady: boolean
}

const AudioContext = createContext<AudioContextType | null>(null)

interface AudioProviderProps {
  children: ReactNode
}

/**
 * Audio Context Provider
 * Lazy-loads audio after page interactive
 */
export function AudioProvider({ children }: AudioProviderProps) {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.08)
  const [audioReady, setAudioReady] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const soundsRef = useRef<Record<string, HTMLAudioElement>>({})

  // Lazy-load audio after page is interactive
  useEffect(() => {
    if (typeof window === 'undefined') return

    const loadAudio = () => {
      // Create audio element for background music
      const audio = new Audio('/audio/background-music.mp3')
      audio.loop = true
      audio.volume = volume
      audio.preload = 'none'
      
      audioRef.current = audio

      // Handle loading errors gracefully
      const handleError = () => {
        console.log('Audio not available - continuing without music')
      }
      audio.addEventListener('error', handleError)

      // Preload sound effects (small files)
      const soundConfig: Record<string, string> = {
        'candle-blow': 'wav',
        'confetti-pop': 'wav',
        'success-chime': 'mp3',
        'paper-rustle': 'mp3', // New sound
      }

      const loadedSounds: Record<string, HTMLAudioElement> = {}
      Object.entries(soundConfig).forEach(([name, ext]) => {
        const soundAudio = new Audio(`/audio/${name}.${ext}`)
        soundAudio.preload = 'auto'
        soundAudio.volume = name === 'paper-rustle' ? 0.3 : 0.7 // Paper rustle is subtle
        soundAudio.addEventListener('error', () => {
          console.log(`Sound ${name} not available`)
        })
        loadedSounds[name] = soundAudio
      })
      soundsRef.current = loadedSounds

      setAudioReady(true)

      return () => {
        audio.removeEventListener('error', handleError)
      }
    }

    // Load audio AFTER page is fully interactive
    if (document.readyState === 'complete') {
      loadAudio()
    } else {
      window.addEventListener('load', loadAudio)
      return () => window.removeEventListener('load', loadAudio)
    }
  }, [volume])

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current.src = ''
        audioRef.current.load()
      }

      Object.values(soundsRef.current).forEach(soundAudio => {
        soundAudio.pause()
        soundAudio.currentTime = 0
        soundAudio.src = ''
        soundAudio.load()
      })

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

  const playSound = (soundName: 'candle-blow' | 'confetti-pop' | 'success-chime' | 'paper-rustle') => {
    if (!audioReady) return

    const preloadedSound = soundsRef.current[soundName]
    if (preloadedSound && preloadedSound.readyState >= 2) {
      preloadedSound.currentTime = 0
      preloadedSound.play().catch(e => {
        console.log('Sound play failed:', e)
      })
    }
  }

  const updateVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolumeState(clampedVolume)
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

export function useAudio(): AudioContextType {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider')
  }
  return context
}
