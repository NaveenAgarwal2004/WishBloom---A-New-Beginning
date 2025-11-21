'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Loader2, Sparkles } from 'lucide-react'
import useWishBloomStore from '@/store/useWishBloomStore'
import FloralLoader from '@/components/FloralLoader'

export default function Step6Publish() {
  const router = useRouter()
  const store = useWishBloomStore()
  const { data: session } = useSession()

  const [publishing, setPublishing] = useState(false)
  const [publishError, setPublishError] = useState<string | null>(null)
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null)

  const [emailForm, setEmailForm] = useState({
    recipientEmail: '',
    customMessage: '',
  })
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handlePublish = async () => {
    setPublishing(true)
    setPublishError(null)

    try {
      const response = await fetch('/api/wishblooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: store.recipientName,
          age: store.age,
          creativeAgeDescription: store.creativeAgeDescription,
          introMessage: store.introMessage,
          createdBy: store.createdBy,
          memories: store.memories,
          messages: store.messages,
          celebrationWishPhrases: store.celebrationWishPhrases,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const fullUrl = `${window.location.origin}/${data.wishbloom.uniqueUrl}`
        setPublishedUrl(fullUrl)
      } else {
        setPublishError(data.error || 'Failed to publish')
      }
    } catch (error) {
      setPublishError('Failed to publish. Please try again.')
      console.error('Publish error:', error)
    } finally {
      setPublishing(false)
    }
  }

  const handleSendEmail = async () => {
    if (!emailForm.recipientEmail) {
      alert('Please enter recipient email')
      return
    }

    setSendingEmail(true)

    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: emailForm.recipientEmail,
          recipientName: store.recipientName,
          wishbloomUrl: publishedUrl,
          senderName: store.createdBy.name,
          customMessage: emailForm.customMessage,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setEmailSent(true)
      } else {
        alert('Failed to send email: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      alert('Failed to send email. Please try again.')
      console.error('Email error:', error)
    } finally {
      setSendingEmail(false)
    }
  }

  // Auto-publish on mount
  useEffect(() => {
    if (!publishing && !publishedUrl && !publishError) {
      handlePublish()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Loading State - Using FloralLoader (Part 7)
  if (publishing) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <FloralLoader size={140} message="Creating Your WishBloom..." />
        <motion.p
          className="text-body font-body text-warmCream-700 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Pressing the flowers, preserving the memories ✨
        </motion.p>
      </div>
    )
  }

  // Error State
  if (publishError) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <h2 className="text-h2 font-heading font-bold text-fadedRose mb-4">
          Oops! Something went wrong
        </h2>
        <p className="text-body font-body text-warmCream-700 mb-8">
          {publishError}
        </p>
        <button
          onClick={handlePublish}
          className="px-8 py-4 bg-burntSienna text-warmCream-50 rounded-xl text-h6 font-heading font-semibold hover:shadow-colored-gold transition-all"
        >
          Try Again
        </button>
      </div>
    )
  }

  // Success State
  if (publishedUrl) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-h1 font-heading font-bold text-sepiaInk mb-4">
            ✨ WishBloom Created! ✨
          </h2>
          <p className="text-body-lg font-body text-warmCream-700">
            Your beautiful memory collection is ready to share
          </p>
        </div>

        {/* Sign Up Prompt for Anonymous Users */}
        {!session && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-fadedGold to-burntSienna text-white rounded-2xl p-8 mb-8 shadow-dramatic"
          >
            <div className="flex items-start gap-4">
              <Sparkles size={32} className="flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-h5 font-heading font-bold mb-3">
                  🎉 Want to save this WishBloom?
                </h3>
                <p className="text-body font-body mb-6 text-warmCream-50">
                  Create a free account to save this WishBloom to your dashboard and access all your creations anytime!
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => router.push('/auth/signup')}
                    className="px-6 py-3 bg-white text-fadedGold rounded-lg font-heading font-bold hover:shadow-lg transition-all"
                  >
                    Create Free Account
                  </button>
                  <button
                    onClick={() => router.push('/api/auth/signin?callbackUrl=/dashboard')}
                    className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-heading font-semibold hover:bg-white/10 transition-all"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Published URL */}
        <div className="bg-warmCream-50 rounded-2xl p-8 border-4 border-fadedGold/60 shadow-dramatic mb-8">
          <label className="text-body-sm font-body font-semibold text-sepiaInk mb-3 block">
            Your Unique WishBloom URL
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={publishedUrl}
              readOnly
              className="flex-1 bg-white border-2 border-warmCream-300 rounded-lg px-4 py-3 text-body font-mono outline-none"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(publishedUrl)
                alert('Link copied to clipboard!')
              }}
              className="px-6 py-3 bg-mossGreen text-warmCream-50 rounded-lg font-body font-semibold hover:shadow-colored-green transition-all"
            >
              Copy Link
            </button>
          </div>
        </div>

        {/* Email notification */}
        <div className="bg-warmCream-50 rounded-2xl p-8 border-2 border-warmCream-300 mb-8">
          <h3 className="text-h5 font-heading font-bold text-sepiaInk mb-4">
            Send to Recipient
          </h3>
          {!emailSent ? (
            <div className="space-y-4">
              <div>
                <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={emailForm.recipientEmail}
                  onChange={(e) =>
                    setEmailForm({ ...emailForm, recipientEmail: e.target.value })
                  }
                  className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
                  placeholder="emma@example.com"
                />
              </div>
              <div>
                <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">
                  Personal Message (optional)
                </label>
                <textarea
                  value={emailForm.customMessage}
                  onChange={(e) =>
                    setEmailForm({ ...emailForm, customMessage: e.target.value })
                  }
                  maxLength={300}
                  rows={3}
                  className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none resize-none"
                  placeholder="Add a personal note..."
                />
              </div>
              <button
                onClick={handleSendEmail}
                disabled={sendingEmail}
                className="px-6 py-3 bg-burntSienna text-warmCream-50 rounded-lg font-body font-semibold hover:shadow-colored-gold transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {sendingEmail ? <Loader2 size={20} className="animate-spin" /> : null}
                {sendingEmail ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✔️</div>
              <p className="text-body-lg font-body text-mossGreen font-semibold">
                Email sent successfully!
              </p>
            </div>
          )}
        </div>

        {/* Share & View buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => window.open(publishedUrl, '_blank')}
            className="px-8 py-4 bg-gradient-to-r from-burntSienna to-fadedGold text-warmCream-50 rounded-xl text-h6 font-heading font-bold shadow-dramatic hover:shadow-colored-gold transition-all"
          >
            View WishBloom ✨
          </button>
          <button
            onClick={() => {
              store.resetStore()
              router.push('/')
            }}
            className="px-8 py-4 bg-warmCream-300 text-warmCream-800 rounded-xl text-h6 font-heading font-semibold hover:bg-warmCream-400 transition-all"
          >
            Create Another
          </button>
        </div>
      </div>
    )
  }

  return null
}