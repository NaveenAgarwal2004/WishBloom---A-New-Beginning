'use client'

import Hero from '@/components/Hero'
import IntroMessage from '@/components/IntroMessage'
import MemoryGallery from '@/components/MemoryGallery'
import MessagesSection from '@/components/MessagesSection'
import CelebrationSection from '@/components/CelebrationSection'
import Footer from '@/components/Footer'
import MusicControl from '@/components/MusicControl'
import { sampleWishBloom } from '@/lib/sampleData'

/**
 * Main WishBloom View Page
 * Displays the complete birthday memory experience
 */
export default function App() {
  return (
    <>
      <MusicControl />
      
      <main id="main-content" className="min-h-screen bg-warmCream-100">
        <Hero 
          recipientName={sampleWishBloom.recipientName}
          age={sampleWishBloom.age}
          creativeAgeDescription={sampleWishBloom.creativeAgeDescription}
        />

        <IntroMessage message={sampleWishBloom.introMessage} />

        <MemoryGallery memories={sampleWishBloom.memories} />

        <MessagesSection messages={sampleWishBloom.messages} />

        <CelebrationSection 
          age={sampleWishBloom.age}
          celebrationWishPhrases={sampleWishBloom.celebrationWishPhrases}
          contributors={sampleWishBloom.contributors}
        />

        <Footer 
          contributors={sampleWishBloom.contributors}
          createdDate={sampleWishBloom.createdDate}
        />
      </main>
    </>
  )
}