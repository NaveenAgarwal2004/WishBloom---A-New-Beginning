'use client'

import { ArrowLeft } from 'lucide-react'
import useWishBloomStore from '@/store/useWishBloomStore'
import Hero from '@/components/Hero'
import IntroMessage from '@/components/IntroMessage'
import MemoryGallery from '@/components/MemoryGallery'
import MessagesSection from '@/components/MessagesSection'

export default function Step5Preview() {
  const store = useWishBloomStore()

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-h2 font-heading font-bold text-sepiaInk mb-4">
          Preview Your WishBloom
        </h2>
        <p className="text-body text-warmCream-700">
          Review everything before publishing
        </p>
      </div>

      {/* Preview */}
      <div className="bg-warmCream-100 rounded-2xl overflow-hidden shadow-dramatic mb-8">
        <Hero
          recipientName={store.recipientName}
          age={store.age || undefined}
          creativeAgeDescription={store.creativeAgeDescription}
        />
        <IntroMessage message={store.introMessage} />
        <MemoryGallery memories={store.memories} />
        <MessagesSection messages={store.messages} />
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => store.previousStep()}
          type="button"
          className="px-8 py-4 bg-warmCream-300 text-warmCream-800 rounded-xl text-h6 font-heading font-semibold hover:bg-warmCream-400 transition-all flex items-center gap-2"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <button
          onClick={() => store.nextStep()}
          type="button"
          className="px-12 py-6 bg-gradient-to-r from-burntSienna to-fadedGold text-warmCream-50 rounded-2xl text-h5 font-heading font-bold shadow-dramatic hover:shadow-colored-gold transition-all"
        >
          Publish WishBloom ✨
        </button>
      </div>
    </div>
  )
}