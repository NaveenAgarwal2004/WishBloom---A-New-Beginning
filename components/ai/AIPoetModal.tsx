'use client'

import { useState } from 'react'
import { Sparkles, X, Loader2, Copy, Check } from 'lucide-react'
import { AI_CONSTANTS } from '@/config/constants'

interface AIPoetModalProps {
  isOpen: boolean
  onClose: () => void
  onInsert: (text: string) => void
  recipientName?: string
}

export default function AIPoetModal({ isOpen, onClose, onInsert, recipientName }: AIPoetModalProps) {
  const [relationship, setRelationship] = useState<string>('Friend')
  const [vibe, setVibe] = useState<string>('Sentimental')
  const [generatedText, setGeneratedText] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string>('')
  const [isCopied, setIsCopied] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError('')
    setGeneratedText('')
    setIsCopied(false)

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName,
          relationship,
          vibe,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate message')
      }

      setGeneratedText(data.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleInsert = () => {
    if (generatedText) {
      onInsert(generatedText)
      onClose()
      // Reset state
      setGeneratedText('')
      setError('')
    }
  }

  const handleCopy = async () => {
    if (generatedText) {
      await navigator.clipboard.writeText(generatedText)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="bg-warmCream-50 rounded-2xl shadow-dramatic max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-fadedGold/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-lavenderPress/20 to-rosePetal/20 border-b-2 border-fadedGold/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-fadedGold/20 rounded-lg">
              <Sparkles className="w-6 h-6 text-fadedGold" />
            </div>
            <div>
              <h2 className="text-h5 font-heading font-bold text-sepiaInk">AI Writing Assistant</h2>
              <p className="text-caption text-warmCream-700">Let AI help craft a heartfelt message</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-warmCream-200 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-warmCream-700" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Recipient Name (if available) */}
          {recipientName && (
            <div className="bg-lavenderPress/10 rounded-lg p-4 border border-lavenderPress/30">
              <p className="text-body-sm font-body text-warmCream-700">
                <span className="font-semibold text-sepiaInk">Writing for:</span> {recipientName}
              </p>
            </div>
          )}

          {/* Relationship Selection */}
          <div>
            <label className="text-body-sm font-body font-semibold text-sepiaInk mb-3 block">
              Your Relationship
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AI_CONSTANTS.RELATIONSHIPS.map((rel) => (
                <button
                  key={rel}
                  type="button"
                  onClick={() => setRelationship(rel)}
                  className={`px-4 py-3 rounded-lg font-body text-body-sm font-medium transition-all ${
                    relationship === rel
                      ? 'bg-gradient-to-br from-burntSienna to-fadedGold text-warmCream-50 shadow-colored-gold'
                      : 'bg-warmCream-200 text-warmCream-800 hover:bg-warmCream-300'
                  }`}
                >
                  {rel}
                </button>
              ))}
            </div>
          </div>

          {/* Vibe Selection */}
          <div>
            <label className="text-body-sm font-body font-semibold text-sepiaInk mb-3 block">
              Message Tone
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {AI_CONSTANTS.VIBES.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVibe(v)}
                  className={`px-4 py-3 rounded-lg font-body text-body-sm font-medium transition-all ${
                    vibe === v
                      ? 'bg-gradient-to-br from-mossGreen to-driedSage text-warmCream-50 shadow-colored-green'
                      : 'bg-warmCream-200 text-warmCream-800 hover:bg-warmCream-300'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full px-6 py-4 bg-gradient-to-r from-lavenderPress to-rosePetal text-warmCream-50 rounded-xl text-h6 font-heading font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-colored-purple transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Message
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="bg-fadedRose/20 border border-fadedRose rounded-lg p-4">
              <p className="text-body-sm text-fadedRose font-medium">{error}</p>
            </div>
          )}

          {/* Generated Text Preview */}
          {generatedText && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 border-2 border-fadedGold/40 shadow-medium relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-body font-body text-warmCream-800 leading-relaxed whitespace-pre-wrap">
                      {generatedText}
                    </p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="p-2 hover:bg-warmCream-100 rounded-lg transition-colors flex-shrink-0"
                    aria-label="Copy to clipboard"
                  >
                    {isCopied ? (
                      <Check className="w-5 h-5 text-mossGreen" />
                    ) : (
                      <Copy className="w-5 h-5 text-warmCream-600" />
                    )}
                  </button>
                </div>

                {/* Decorative floral accent */}
                <svg className="absolute bottom-2 right-2 w-8 h-8 text-fadedGold opacity-20" viewBox="0 0 32 32">
                  <circle cx="16" cy="16" r="4" fill="currentColor" />
                  <ellipse cx="16" cy="10" rx="3" ry="5" fill="currentColor" opacity="0.8" />
                  <ellipse cx="22" cy="16" rx="5" ry="3" fill="currentColor" opacity="0.8" />
                  <ellipse cx="16" cy="22" rx="3" ry="5" fill="currentColor" opacity="0.8" />
                  <ellipse cx="10" cy="16" rx="5" ry="3" fill="currentColor" opacity="0.8" />
                </svg>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex-1 px-4 py-3 bg-warmCream-300 text-warmCream-800 rounded-lg font-body font-semibold hover:bg-warmCream-400 disabled:opacity-50 transition-all"
                >
                  Try Again
                </button>
                <button
                  onClick={handleInsert}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-burntSienna to-fadedGold text-warmCream-50 rounded-lg font-body font-semibold hover:shadow-colored-gold transition-all"
                >
                  Insert into Message
                </button>
              </div>
            </div>
          )}

          {/* Help Text */}
          {!generatedText && !isGenerating && (
            <div className="text-center py-4">
              <p className="text-body-sm text-warmCream-600 italic">
                Select your relationship and desired tone, then click generate to create a personalized birthday message.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
