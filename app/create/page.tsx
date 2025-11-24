'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronLeft } from 'lucide-react'
import useWishBloomStore from '@/store/useWishBloomStore'
import Step1Info from './steps/Step1Info'
import Step2Memories from './steps/Step2Memories'
import Step3Messages from './steps/Step3Messages'
import Step4Wishes from './steps/Step4Wishes'
import Step5Preview from './steps/Step5Preview'
import Step6Publish from './steps/Step6Publish'
import { useMobile } from '@/hooks/use-mobile'
import { useAutoSave } from '@/hooks/useAutoSave'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function CreatePage() {
  const currentStep = useWishBloomStore((state) => state.currentStep)
  
  const [isMounted, setIsMounted] = useState(false)
  const isMobileView = useMobile()
  
  // ✅ Part 10: Auto-save hook
  const { isAutoSaving, lastSaved } = useAutoSave()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const steps = [
    { step: 1, label: 'Info', component: Step1Info },
    { step: 2, label: 'Memories', component: Step2Memories },
    { step: 3, label: 'Messages', component: Step3Messages },
    { step: 4, label: 'Wishes', component: Step4Wishes },
    { step: 5, label: 'Preview', component: Step5Preview },
    { step: 6, label: 'Publish', component: Step6Publish },
  ]

  const CurrentStepComponent = steps.find((s) => s.step === currentStep)?.component || Step1Info

  if (!isMounted) return <div className="min-h-screen bg-warmCream-50" />

  // 📱 MOBILE LAYOUT: Standard Flow (Sticky Header)
  // This relies on native body scrolling, which handles the keyboard perfectly.
  if (isMobileView) {
    return (
      <div className="min-h-dvh bg-warmCream-50 flex flex-col">
        {/* 1. Sticky Header */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-warmCream-200 px-4 py-3 pt-safe">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="icon" className="-ml-2 text-sepiaInk">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <div className="flex flex-col items-center">
              <span className="font-heading font-bold text-lg text-sepiaInk leading-none">
                Create
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-warmCream-600 uppercase tracking-widest">
                  Step {currentStep} of 6
                </span>
                {/* ✅ Part 10: Auto-save indicator */}
                {!isAutoSaving && lastSaved && (
                  <span className="text-[9px] text-mossGreen font-mono">
                    • Saved
                  </span>
                )}
                {isAutoSaving && (
                  <span className="text-[9px] text-fadedGold font-mono animate-pulse">
                    • Saving...
                  </span>
                )}
              </div>
            </div>
            <div className="w-10" /> {/* Balance spacer */}
          </div>
          
          {/* Progress Bar (Integrated into Header) */}
          <div className="absolute bottom-0 left-0 h-1 w-full bg-warmCream-200">
            <motion.div 
              className="h-full bg-burntSienna"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / 6) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </header>

        {/* 2. Content Area
            - flex-1: Pushes footer down if content is short
            - pb-32: Adds huge padding at the bottom so you can always scroll 
              past the keyboard to see the "Next" button.
        */}
        <main className="flex-1 px-5 py-6 pb-40">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <CurrentStepComponent />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    )
  }

  // 💻 DESKTOP LAYOUT (Unchanged)
  return (
    <main className="min-h-screen bg-gradient-to-b from-warmCream-100 to-rosePetal/10 py-16 px-4 md:px-8">
      <div className="text-center mb-12">
        <h1 className="text-h1 md:text-display font-heading font-bold text-sepiaInk mb-4">
          Create a WishBloom
        </h1>
        <p className="text-body-lg font-body text-warmCream-700">
          Preserve memories, one bloom at a time
        </p>
        {/* ✅ Part 10: Desktop auto-save indicator */}
        <div className="mt-4 min-h-[20px]">
          {!isAutoSaving && lastSaved && (
            <p className="text-caption font-mono text-mossGreen">
              ✓ Saved
            </p>
          )}
          {isAutoSaving && (
            <p className="text-caption font-mono text-fadedGold animate-pulse">
              Saving...
            </p>
          )}
        </div>
      </div>

      {/* Steps Progress Bar */}
      {currentStep < 6 && (
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex items-center justify-between">
            {steps.slice(0, 5).map((item, index) => (
              <div key={item.step} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                   <div
                    className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center font-heading font-bold text-h6 transition-all ${
                      currentStep === item.step
                        ? 'bg-fadedGold text-white scale-110'
                        : currentStep > item.step
                        ? 'bg-mossGreen text-white'
                        : 'bg-warmCream-300 text-warmCream-600'
                    }`}
                  >
                    {currentStep > item.step ? <Check size={24} /> : item.step}
                  </div>
                  <span className="text-caption md:text-body-sm font-body mt-2 text-center">
                    {item.label}
                  </span>
                </div>
                {index < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      currentStep > item.step ? 'bg-mossGreen' : 'bg-warmCream-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <CurrentStepComponent />
        </motion.div>
      </AnimatePresence>
    </main>
  )
}