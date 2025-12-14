/**
 * 🔊 useSoundEffects Hook
 * 
 * Provides easy access to sound effects throughout the app
 * Integrates with AudioContext and respects global mute state
 */

import { useAudio } from '@/context/AudioContext'
import { useCallback } from 'react'

type SoundEffectName = 
  | 'paper-rustle'
  | 'candle-blow'
  | 'confetti-pop'
  | 'success-chime'
  | 'step-complete'

/**
 * Hook to play sound effects with mute state awareness
 */
export function useSoundEffects() {
  const { playSound, audioReady } = useAudio()

  /**
   * Play a sound effect
   * Respects global mute toggle and audio ready state
   * 
   * IMPLEMENTATION NOTE: We use AudioContext's playSound directly now
   * since paper-rustle was added to the AudioContext provider
   */
  const play = useCallback((soundName: SoundEffectName) => {
    if (!audioReady) return

    // Map custom sound names to actual audio files
    const soundMap: Record<SoundEffectName, 'candle-blow' | 'confetti-pop' | 'success-chime' | 'paper-rustle'> = {
      'paper-rustle': 'paper-rustle',
      'candle-blow': 'candle-blow',
      'confetti-pop': 'confetti-pop',
      'success-chime': 'success-chime',
      'step-complete': 'success-chime', // Alias for step completion - uses success-chime
    }

    const actualSound = soundMap[soundName]
    
    // All sounds now handled by AudioContext's playSound
    // which properly manages preloading and volume
    if (actualSound === 'success-chime' || actualSound === 'paper-rustle' || actualSound === 'candle-blow' || actualSound === 'confetti-pop') {
      playSound(actualSound)
    }
  }, [audioReady, playSound])

  return {
    play,
    audioReady,
  }
}
