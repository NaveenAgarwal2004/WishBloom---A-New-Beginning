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
        recipientName={wishbloom.recipientName}
        age={wishbloom.age}
        creativeAgeDescription={wishbloom.creativeAgeDescription}
      />

      <IntroMessage message={wishbloom.introMessage} />

      <MemoryGallery memories={wishbloom.memories || []} />

      <MessagesSection messages={wishbloom.messages || []} />

      <CelebrationSection 
        age={wishbloom.age}
        celebrationWishPhrases={wishbloom.celebrationWishPhrases || []}
        contributors={contributors}
      />

      <Footer 
        contributors={contributors}
        createdDate={wishbloom.createdDate}
      />
    </main>
  )
}
