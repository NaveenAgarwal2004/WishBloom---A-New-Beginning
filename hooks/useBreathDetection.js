'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Custom hook for detecting breath/blowing using microphone
 * @returns {Object} - { isBlowing, error, requestPermission, hasPermission }
 */
export function useBreathDetection() {
  const [isBlowing, setIsBlowing] = useState(false)
  const [error, setError] = useState(null)
  const [hasPermission, setHasPermission] = useState(false)
  const [supported, setSupported] = useState(true)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const streamRef = useRef(null)
  const animationFrameRef = useRef(null)

  const requestPermission = useCallback(async () => {
    try {
      // Check if browser supports AudioContext
      if (!window.AudioContext && !window.webkitAudioContext) {
        setError('Your browser does not support audio detection')
        setSupported(false)
        return
      }

      // Request microphone access
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('No microphone found. Please connect a microphone.')
        setSupported(false)
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Create audio context and analyzer
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      const context = new AudioContextClass()
      const source = context.createMediaStreamSource(stream)
      const analyser = context.createAnalyser()

      analyser.fftSize = 2048
      analyser.smoothingTimeConstant = 0.8
      source.connect(analyser)

      audioContextRef.current = context
      analyserRef.current = analyser
      setHasPermission(true)
      setError(null)

      // Start analysis loop
      const analyze = () => {
        if (!analyserRef.current) return

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
        analyserRef.current.getByteFrequencyData(dataArray)

        // Analyze low frequencies (0-500Hz) for breath detection
        // This range captures the sound of blowing/breath
        const lowFreqSlice = dataArray.slice(0, 10)
        const lowFreqSum = lowFreqSlice.reduce((sum, val) => sum + val, 0)
        const avgAmplitude = lowFreqSum / 10

        // Threshold for detecting blowing (adjust if needed)
        // Higher values = less sensitive, Lower values = more sensitive
        const BLOW_THRESHOLD = 180
        setIsBlowing(avgAmplitude > BLOW_THRESHOLD)

        animationFrameRef.current = requestAnimationFrame(analyze)
      }

      analyze()
    } catch (err) {
      console.error('Error accessing microphone:', err)
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone access denied. Please enable it in your browser settings.')
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone.')
        setSupported(false)
      } else {
        setError('Could not access microphone. Please check your browser settings.')
      }
      setHasPermission(false)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cancel animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      // Stop all audio tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }

      // Close audio context
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  return {
    isBlowing,
    error,
    requestPermission,
    hasPermission,
    supported,
    // Fallback: simulate a blow event in environments without mic
    simulateBlow: (durationMs = 800) => {
      setIsBlowing(true)
      setTimeout(() => setIsBlowing(false), durationMs)
    }
  }
}
