/**
 * 🌸 WishBloom Offline Page
 * PWA & Reliability
 * 
 * Displayed when the user is offline and tries to access a page
 * Maintains the pressed-flower aesthetic with a gentle, reassuring message
 */

'use client'

import FloralDecoration from '@/components/FloralDecoration'

// ✅ Force dynamic rendering to prevent static generation timeout
export const dynamic = 'force-dynamic'

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-warmCream-50 via-warmCream-100 to-rosePetal/5 flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* Floral Decoration - No animation to prevent build timeout */}
        <div className="mb-8 opacity-30">
          <FloralDecoration className="mx-auto" size={180} color="#C8B6A6" animate={false} />
        </div>

        {/* Main Message */}
        <div className="space-y-6">
          <h1 className="text-h2 md:text-h1 font-heading font-bold text-sepiaInk">
            You&apos;re Offline
          </h1>
          
          <div className="space-y-4 text-body-lg font-body text-warmCream-700">
            <p>
              Your memories are safe, just reconnecting to the garden...
            </p>
            
            <p className="text-body font-accent italic text-warmCream-600">
              Please check your internet connection and try again.
            </p>
          </div>

          {/* Connection Status Indicator */}
          <div className="mt-12 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-warmCream-200/50 border border-warmCream-300">
            <div className="w-2 h-2 rounded-full bg-fadedGold animate-pulse" />
            <span className="text-caption font-mono text-warmCream-600 uppercase tracking-wider">
              Waiting for connection
            </span>
          </div>

          {/* Reload Button */}
          <div className="mt-8">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-burntSienna text-white font-body font-semibold text-body transition-all hover:bg-burntSienna/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-burntSienna focus:ring-offset-2 focus:ring-offset-warmCream-50"
            >
              Try Again
            </button>
          </div>
        </div>

        {/* Bottom Decoration - No animation to prevent build timeout */}
        <div className="mt-16 opacity-20">
          <FloralDecoration className="mx-auto" size={150} color="#D4A574" animate={false} />
        </div>

        {/* Subtle Help Text */}
        <p className="mt-8 text-caption font-mono text-warmCream-500 uppercase tracking-widest">
          Your drafts are saved locally
        </p>
      </div>
    </main>
  )
}
