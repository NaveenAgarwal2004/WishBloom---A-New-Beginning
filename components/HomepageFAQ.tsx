'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'What is WishBloom?',
    answer:
      'WishBloom is a free online birthday memory book creator. You gather photos, heartfelt messages, and memories from friends and family — WishBloom turns them into a beautiful interactive digital scrapbook with a pressed flower aesthetic. The birthday person opens it via one shared link. No app, no account, no cost.',
  },
  {
    question: 'Is WishBloom really free?',
    answer:
      'Yes — 100% free, with no catches. There are no paid plans, no contributor limits, no upgrade prompts, and no features locked behind a paywall. You can create, edit, and share as many memory books as you like without paying anything.',
  },
  {
    question: 'How do friends add their memories?',
    answer:
      'When you create a WishBloom, you get a contributor link to share with friends and family. Anyone with the link can add their own memories, upload photos, write letters, and leave wishes — all without creating an account or downloading an app.',
  },
  {
    question: 'Does the birthday person need to sign up to view it?',
    answer:
      'No. The birthday recipient just opens the shared link in any browser on their phone or laptop. No account, no download, no sign-up required. They can enjoy the full interactive scrapbook immediately.',
  },
  {
    question: 'How is WishBloom different from Kudoboard?',
    answer:
      'Unlike Kudoboard, WishBloom is completely free with no limits on contributors or content. WishBloom also has a distinctive pressed flower aesthetic and an interactive microphone-powered candle-blowing moment, making the birthday experience genuinely memorable rather than just a digital card.',
  },
  {
    question: 'What is the candle-blowing feature?',
    answer:
      'WishBloom includes a unique interactive moment where the birthday person can blow into their device microphone to extinguish digital birthday candles — just like a real birthday. There is also a manual button for those who prefer not to use the microphone.',
  },
]

export default function HomepageFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section
      className="bg-warmCream-50 py-20 px-4 md:px-8 border-t border-warmCream-200"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-caption font-mono text-warmCream-500 uppercase tracking-widest mb-3">
            Questions & Answers
          </p>
          <h2
            id="faq-heading"
            className="text-h2 md:text-h1 font-heading font-bold text-sepiaInk"
          >
            Frequently Asked Questions
          </h2>
          <svg
            className="mx-auto mt-4"
            width="120"
            height="8"
            viewBox="0 0 120 8"
            aria-hidden="true"
          >
            <path
              d="M 5 5 Q 30 2, 60 4 T 115 5"
              stroke="#D4A373"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* FAQ accordion */}
        <div className="space-y-3" role="list">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                role="listitem"
                className="bg-white/70 backdrop-blur-sm border border-warmCream-200 rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-shadow duration-300"
              >
                <button
                  id={`faq-btn-${index}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  className="w-full flex items-center justify-between gap-4 px-7 py-6 text-left group cursor-pointer"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <h3 className="text-body-lg md:text-h5 font-heading font-semibold text-sepiaInk group-hover:text-burntSienna transition-colors leading-snug">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-warmCream-100 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <ChevronDown
                      size={18}
                      className="text-fadedGold"
                    />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-btn-${index}`}
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="px-7 pb-6 text-body font-body text-warmCream-700 leading-relaxed border-t border-warmCream-100 pt-4">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
