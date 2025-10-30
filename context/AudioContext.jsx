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

  useEffect(() => {
    // Create audio element for background music
    audioRef.current = new Audio('/audio/background-music.mp3')
    audioRef.current.loop = true
    audioRef.current.volume = volume

    // Load music preference from localStorage
    if (typeof window !== 'undefined') {
      const savedPref = localStorage.getItem('wishbloom_music')
      if (savedPref === 'true' && audioRef.current) {
        audioRef.current.play().catch(e => console.log('Autoplay prevented:', e))
        setIsMusicPlaying(true)
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  const toggleMusic = () => {
    if (!audioRef.current) return

    if (isMusicPlaying) {
      audioRef.current.pause()
      setIsMusicPlaying(false)
      if (typeof window !== 'undefined') {
        localStorage.setItem('wishbloom_music', 'false')
      }
    } else {
      audioRef.current.play().catch(e => console.log('Play failed:', e))
      setIsMusicPlaying(true)
      if (typeof window !== 'undefined') {
        localStorage.setItem('wishbloom_music', 'true')
      }
    }
  }

  const playSound = (soundName) => {
    try {
      const sound = new Audio(`/audio/${soundName}.mp3`)
      sound.volume = 0.7
      sound.play().catch(e => console.log('Sound play failed:', e))
    } catch (error) {
      console.error('Error playing sound:', error)
    }
  }

  const updateVolume = (newVolume) => {
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  return (
    <AudioContext.Provider value={{ isMusicPlaying, volume, toggleMusic, playSound, setVolume: updateVolume }}>
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
