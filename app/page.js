'use client'

import Hero from '@/components/Hero'
import IntroMessage from '@/components/IntroMessage'
import MemoryGallery from '@/components/MemoryGallery'
import MessagesSection from '@/components/MessagesSection'
import CelebrationSection from '@/components/CelebrationSection'
import Footer from '@/components/Footer'
import { sampleWishBloom } from '@/lib/sampleData'

/**
 * Main WishBloom View Page
 * Displays the complete birthday memory experience
 */
export default function App() {
  return (
    <main className="min-h-screen bg-warmCream-100">
      {/* Hero Section */}
      <Hero 
        recipientName={sampleWishBloom.recipientName}
        age={sampleWishBloom.age}
        creativeAgeDescription={sampleWishBloom.creativeAgeDescription}
      />

      {/* Intro Message */}
      <IntroMessage message={sampleWishBloom.introMessage} />

      {/* Memory Gallery */}
      <MemoryGallery memories={sampleWishBloom.memories} />

      {/* Messages Section */}
      <MessagesSection messages={sampleWishBloom.messages} />

      {/* Celebration Section with Cake, Confetti & Wishes */}
      <CelebrationSection 
        age={sampleWishBloom.age}
        celebrationWishPhrases={sampleWishBloom.celebrationWishPhrases}
        contributors={sampleWishBloom.contributors}
      />

      {/* Footer with easter egg */}
      <Footer 
        contributors={sampleWishBloom.contributors}
        createdDate={sampleWishBloom.createdDate}
      />
    </main>
  )
}