'use client'

import Hero from '@/components/Hero'
import IntroMessage from '@/components/IntroMessage'
import MemoryGallery from '@/components/MemoryGallery'
import MessagesSection from '@/components/MessagesSection'
import CelebrationSection from '@/components/CelebrationSection'
import Footer from '@/components/Footer'
import MusicControl from '@/components/MusicControl'
import HomepageHero from '@/components/HomepageHero'
import { sampleWishBloom } from '@/lib/sampleData'

/**
 * Main WishBloom View Page
 * Displays the complete birthday memory experience
 */
export default function App() {
  const webAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'WishBloom',
    'url': 'https://wishblooms.in',
    'applicationCategory': 'LifestyleApplication',
    'operatingSystem': 'Web',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'INR',
    },
    'description': 'Create a free collaborative birthday memory book online. Friends add their favorite memories and photos, you press publish, and the birthday person receives a living scrapbook via a single link.',
    'featureList': [
      'collaborative memory books',
      'photo uploads',
      'microphone candle blowing',
      'pressed flower aesthetic',
      'shareable link',
      'no signup to view',
    ],
    'creator': {
      '@type': 'Person',
      'name': 'Naveen Agarwal',
      'url': 'https://github.com/NaveenAgarwal2004',
    },
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'What is WishBloom?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'WishBloom is a free online birthday memory book creator. It allows you to gather memories, photos, letters, and wishes from friends and family to create a beautiful, interactive digital scrapbook with a pressed flower aesthetic.',
        },
      },
      {
        '@type': 'Question',
        'name': 'Is WishBloom free?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, WishBloom is 100% free to use. There are no paid plans, hidden charges, or premium features locked behind paywalls. You can create, edit, and share memory books without spending a cent.',
        },
      },
      {
        '@type': 'Question',
        'name': 'How do friends add their memories?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'When you create a WishBloom, you can share a contributor link with friends. They can write letters, upload photos, share memories, and add birthday wishes directly to the scrapbook, all without needing to register or download an app.',
        },
      },
      {
        '@type': 'Question',
        'name': 'Do viewers need an account to see a WishBloom?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'No, viewers and birthday recipients do not need an account or sign up to view a WishBloom. Simply open the shared link on any phone or desktop browser to enjoy the interactive scrapbook.',
        },
      },
      {
        '@type': 'Question',
        'name': 'What is the candle-blowing feature?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'WishBloom includes a unique, microphone-based interactive candle blowing feature. The birthday recipient can blow into their device microphone to extinguish the digital candles on their birthday cake, or press a manual blow button.',
        },
      },
      {
        '@type': 'Question',
        'name': 'How is WishBloom different from Kudoboard?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Unlike Kudoboard, which has a very limited free tier and requires payment for larger boards, WishBloom is completely free with no limits on contributors or posts. WishBloom also features a premium \'Pressed & Preserved\' botanical flower aesthetic and interactive candle blowing, making the birthday surprise truly memorable.',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <MusicControl />

      <main id="main-content" className="min-h-screen bg-warmCream-100 pt-16 pb-bottom-nav md:pb-0">
        <HomepageHero />
        
        <div id="demo-section" className="border-t border-warmCream-200">
          <div className="bg-warmCream-200/50 py-6 text-center border-b border-warmCream-300">
            <h2 className="text-body-lg font-heading italic text-sepiaInk">
              Below is a live interactive preview of a WishBloom birthday scrapbook
            </h2>
          </div>
          
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
        </div>
      </main>
    </>
  )
}