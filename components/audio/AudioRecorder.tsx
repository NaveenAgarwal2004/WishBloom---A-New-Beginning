'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Play, Trash2, Upload, Loader2, Check, AlertCircle } from 'lucide-react'
import { FILE_LIMITS, ERROR_MESSAGES } from '@/config/constants'

interface AudioRecorderProps {
  onAudioUploaded: (url: string) => void
  existingAudioUrl?: string
  onAudioRemoved?: () => void
}

type RecorderState = 'idle' | 'recording' | 'reviewing' | 'uploading' | 'uploaded'

export default function AudioRecorder({ onAudioUploaded, existingAudioUrl, onAudioRemoved }: AudioRecorderProps) {
  const [state, setState] = useState<RecorderState>(existingAudioUrl ? 'uploaded' : 'idle')
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string>(existingAudioUrl || '')
  const [error, setError] = useState<string>('')
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioPreviewRef = useRef<HTMLAudioElement>(null)

  // Check if MediaRecorder is supported
  const isSupported = typeof window !== 'undefined' && 'MediaRecorder' in window

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const startRecording = async () => {
    if (!isSupported) {
      setError(ERROR_MESSAGES.MICROPHONE_NOT_SUPPORTED)
      return
    }

    try {
      setError('')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Create MediaRecorder with preferred mime type
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/webm' // Fallback

      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType })
        setAudioBlob(blob)
        setState('reviewing')
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
        
        // Clear timer
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
      }

      mediaRecorder.start()
      setState('recording')
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1
          // Auto-stop at max duration
          if (newTime >= FILE_LIMITS.AUDIO_MAX_DURATION_SECONDS) {
            stopRecording()
          }
          return newTime
        })
      }, 1000)

    } catch (err) {
      console.error('Error accessing microphone:', err)
      if (err instanceof Error && err.name === 'NotAllowedError') {
        setError(ERROR_MESSAGES.MICROPHONE_PERMISSION_DENIED)
      } else {
        setError('Failed to access microphone. Please check your permissions.')
      }
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
  }

  const playRecording = () => {
    if (audioPreviewRef.current && audioBlob) {
      const url = URL.createObjectURL(audioBlob)
      audioPreviewRef.current.src = url
      audioPreviewRef.current.play()
    }
  }

  const deleteRecording = () => {
    setAudioBlob(null)
    setAudioUrl('')
    setRecordingTime(0)
    setState('idle')
    if (onAudioRemoved) onAudioRemoved()
  }

  const uploadRecording = async () => {
    if (!audioBlob) return

    // Check file size
    if (audioBlob.size > FILE_LIMITS.AUDIO_MAX_SIZE_BYTES) {
      setError(ERROR_MESSAGES.AUDIO_FILE_TOO_LARGE)
      return
    }

    setState('uploading')
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', audioBlob, `voice-message-${Date.now()}.webm`)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Upload failed')
      }

      setAudioUrl(data.url)
      setState('uploaded')
      onAudioUploaded(data.url)
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload audio')
      setState('reviewing')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!isSupported) {
    return (
      <div className="bg-warmCream-100 border-2 border-warmCream-300 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-fadedRose flex-shrink-0 mt-0.5" />
          <p className="text-body-sm text-warmCream-700">
            Audio recording is not supported in your browser. Please use a modern browser like Chrome, Firefox, or Safari.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Audio Preview (hidden) */}
      <audio ref={audioPreviewRef} className="hidden" />

      {/* Error Display */}
      {error && (
        <div className="bg-fadedRose/20 border border-fadedRose rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-fadedRose flex-shrink-0 mt-0.5" />
          <p className="text-body-sm text-fadedRose font-medium">{error}</p>
        </div>
      )}

      {/* Idle State */}
      {state === 'idle' && (
        <button
          onClick={startRecording}
          type="button"
          className="w-full px-6 py-4 bg-gradient-to-r from-lavenderPress to-rosePetal text-warmCream-50 rounded-lg font-body font-semibold hover:shadow-colored-purple transition-all flex items-center justify-center gap-2"
        >
          <Mic className="w-5 h-5" />
          Start Recording
        </button>
      )}

      {/* Recording State */}
      {state === 'recording' && (
        <div className="bg-fadedRose/10 border-2 border-fadedRose rounded-lg p-6">
          <div className="flex flex-col items-center gap-4">
            {/* Pulsing red dot */}
            <div className="relative">
              <div className="w-16 h-16 bg-fadedRose rounded-full flex items-center justify-center">
                <Mic className="w-8 h-8 text-warmCream-50" />
              </div>
              <div className="absolute inset-0 w-16 h-16 bg-fadedRose rounded-full animate-ping opacity-75" />
            </div>

            {/* Timer */}
            <div className="text-center">
              <p className="text-h4 font-heading font-bold text-sepiaInk mb-1">
                {formatTime(recordingTime)}
              </p>
              <p className="text-caption text-warmCream-700">
                Recording... (Max {FILE_LIMITS.AUDIO_MAX_DURATION_SECONDS}s)
              </p>
            </div>

            {/* Stop Button */}
            <button
              onClick={stopRecording}
              type="button"
              className="px-8 py-3 bg-sepiaInk text-warmCream-50 rounded-lg font-body font-semibold hover:bg-sepiaInk/90 transition-all flex items-center gap-2"
            >
              <Square className="w-5 h-5" />
              Stop Recording
            </button>
          </div>
        </div>
      )}

      {/* Reviewing State */}
      {state === 'reviewing' && audioBlob && (
        <div className="bg-warmCream-100 border-2 border-warmCream-300 rounded-lg p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-mossGreen">
              <Check className="w-6 h-6" />
              <p className="text-h6 font-heading font-semibold">Recording Complete</p>
            </div>

            <p className="text-body-sm text-warmCream-700">
              Duration: {formatTime(recordingTime)} • Size: {(audioBlob.size / 1024).toFixed(0)} KB
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full">
              <button
                onClick={playRecording}
                type="button"
                className="flex-1 px-4 py-3 bg-mossGreen text-warmCream-50 rounded-lg font-body font-semibold hover:shadow-colored-green transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Play
              </button>
              <button
                onClick={deleteRecording}
                type="button"
                className="px-4 py-3 bg-fadedRose/20 text-fadedRose rounded-lg font-body font-semibold hover:bg-fadedRose/30 transition-all flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={uploadRecording}
              type="button"
              className="w-full px-6 py-3 bg-gradient-to-r from-burntSienna to-fadedGold text-warmCream-50 rounded-lg font-body font-semibold hover:shadow-colored-gold transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Upload Voice Message
            </button>
          </div>
        </div>
      )}

      {/* Uploading State */}
      {state === 'uploading' && (
        <div className="bg-warmCream-100 border-2 border-warmCream-300 rounded-lg p-6">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-fadedGold animate-spin" />
            <p className="text-h6 font-heading font-semibold text-sepiaInk">
              Uploading...
            </p>
          </div>
        </div>
      )}

      {/* Uploaded State */}
      {state === 'uploaded' && audioUrl && (
        <div className="bg-mossGreen/10 border-2 border-mossGreen/30 rounded-lg p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-mossGreen">
              <Check className="w-6 h-6" />
              <p className="text-h6 font-heading font-semibold">Voice Message Added!</p>
            </div>

            {/* Audio player */}
            <audio 
              controls 
              src={audioUrl} 
              className="w-full max-w-md"
              style={{
                filter: 'sepia(30%) saturate(90%) hue-rotate(-10deg)',
              }}
            />

            {/* Remove button */}
            <button
              onClick={deleteRecording}
              type="button"
              className="px-4 py-2 bg-fadedRose/20 text-fadedRose rounded-lg font-body text-body-sm font-semibold hover:bg-fadedRose/30 transition-all flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Remove Voice Message
            </button>
          </div>
        </div>
      )}

      {/* Info Text */}
      {state === 'idle' && (
        <p className="text-caption text-warmCream-600 text-center">
          Add a personal voice greeting to your message (max {FILE_LIMITS.AUDIO_MAX_DURATION_SECONDS / 60} minutes)
        </p>
      )}
    </div>
  )
}
