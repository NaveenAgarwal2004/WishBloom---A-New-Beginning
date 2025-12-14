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
   */
  const play = useCallback((soundName: SoundEffectName) => {
    if (!audioReady) return

    // Map custom sound names to actual audio files
    const soundMap: Record<SoundEffectName, 'candle-blow' | 'confetti-pop' | 'success-chime' | 'paper-rustle' | 'step-complete'> = {
      'paper-rustle': 'paper-rustle',
      'candle-blow': 'candle-blow',
      'confetti-pop': 'confetti-pop',
      'success-chime': 'success-chime',
      'step-complete': 'success-chime', // Alias for step completion
    }

    const actualSound = soundMap[soundName]
    
    // Use AudioContext's playSound which handles all the audio logic
    if (actualSound === 'paper-rustle') {
      // Paper rustle needs custom handling since it's new
      playPaperRustle()
    } else if (actualSound === 'step-complete') {
      // Step complete is just success-chime at lower volume
      playSound('success-chime')
    } else {
      playSound(actualSound as 'candle-blow' | 'confetti-pop' | 'success-chime')
    }
  }, [audioReady, playSound])

  /**
   * Play paper rustle sound (custom implementation)
   */
  const playPaperRustle = useCallback(() => {
    if (!audioReady) return

    // Create and play paper rustle audio
    const audio = new Audio('/audio/paper-rustle.mp3')
    audio.volume = 0.3 // Subtle, ambient sound
    audio.play().catch(e => {
      // Silently fail if audio doesn't load
      console.log('Paper rustle sound not available:', e)
    })
  }, [audioReady])

  return {
    play,
    audioReady,
  }
}
