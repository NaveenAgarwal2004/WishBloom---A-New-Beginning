'use client'

import Hero from '@/components/Hero'
import IntroMessage from '@/components/IntroMessage'
import MemoryGallery from '@/components/MemoryGallery'
import MessagesSection from '@/components/MessagesSection'
import CelebrationSection from '@/components/CelebrationSection'
import Footer from '@/components/Footer'

/**
 * Client component for viewing a WishBloom
 */
export default function WishBloomView({ wishbloom }) {
  // Validate wishbloom data
  if (!wishbloom) {
    return (
      <main className="min-h-screen bg-warmCream-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-h2 font-heading font-bold text-sepiaInk mb-4">
            WishBloom Not Found
          </h1>
          <p className="text-body text-warmCream-700">
            This WishBloom may have been removed or doesn't exist.
          </p>
        </div>
      </main>
    )
  }

  // Calculate contributors from memories and messages
  const contributorMap = new Map()
  
  if (wishbloom.createdBy) {
    contributorMap.set(wishbloom.createdBy.id, wishbloom.createdBy)
  }

  wishbloom.memories?.forEach(mem => {
    if (mem.contributor && mem.contributor.id) {
      contributorMap.set(mem.contributor.id, mem.contributor)
    }
  })

  wishbloom.messages?.forEach(msg => {
    if (msg.contributor && msg.contributor.id) {
      contributorMap.set(msg.contributor.id, msg.contributor)
    }
  })

  const contributors = Array.from(contributorMap.values())

  return (
    <main className="min-h-screen bg-warmCream-100">
      <Hero 
        recipientName={wishbloom.recipientName || 'Friend'}
        age={wishbloom.age}
        creativeAgeDescription={wishbloom.creativeAgeDescription}
      />

      {wishbloom.introMessage && (
        <IntroMessage message={wishbloom.introMessage} />
      )}

      {wishbloom.memories && wishbloom.memories.length > 0 && (
        <MemoryGallery memories={wishbloom.memories} />
      )}

      {wishbloom.messages && wishbloom.messages.length > 0 && (
        <MessagesSection messages={wishbloom.messages} />
      )}

      <CelebrationSection 
        age={wishbloom.age || 25}
        celebrationWishPhrases={wishbloom.celebrationWishPhrases || []}
        contributors={contributors}
      />

      <Footer 
        contributors={contributors}
        createdDate={wishbloom.createdDate || new Date().toISOString()}
      />
    </main>
  )
}