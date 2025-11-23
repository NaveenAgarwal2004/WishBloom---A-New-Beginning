'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import useWishBloomStore from '@/store/useWishBloomStore'
import SignInBanner from '@/components/SignInBanner'
import { useIsMobile } from '@/hooks/use-mobile'
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import Step1Info from './steps/Step1Info'
import Step2Memories from './steps/Step2Memories'
import Step3Messages from './steps/Step3Messages'
import Step4Wishes from './steps/Step4Wishes'
import Step5Preview from './steps/Step5Preview'
import Step6Publish from './steps/Step6Publish'

/**
 * ✅ REFACTORED: Simple orchestrator component
 * No form logic, no validation - just renders the correct step
 */
export default function CreatePage() {
  const currentStep = useWishBloomStore((state) => state.currentStep)
  const isMobile = useIsMobile()

  // Step configuration
  const steps = [
    { step: 1, label: 'Info', component: Step1Info },
    { step: 2, label: 'Memories', component: Step2Memories },
    { step: 3, label: 'Messages', component: Step3Messages },
    { step: 4, label: 'Wishes', component: Step4Wishes },
    { step: 5, label: 'Preview', component: Step5Preview },
    { step: 6, label: 'Publish', component: Step6Publish },
  ]

  // Get current step component
  const CurrentStepComponent = steps.find((s) => s.step === currentStep)?.component || Step1Info

  return (
    <main className="min-h-screen bg-gradient-to-b from-warmCream-100 to-rosePetal/10 py-16 px-4 md:px-8 pt-24">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-h1 md:text-display font-heading font-bold text-sepiaInk mb-4">
          Create a WishBloom
        </h1>
        <p className="text-body-lg font-body text-warmCream-700">
          Preserve memories, one bloom at a time
        </p>
      </div>

      {/* Sign In Banner - Only shows for anonymous users */}
      <div className="max-w-4xl mx-auto mb-8">
        <SignInBanner />
      </div>

      {/* Progress Stepper */}
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

      {/* Step Content with Animation - Mobile uses Drawer, Desktop uses inline */}
      {isMobile && currentStep < 6 ? (
        <Drawer open={true} modal={false}>
          <DrawerContent className="max-h-[85vh] overflow-y-auto">
            <DrawerTitle className="sr-only">
              Create WishBloom - Step {currentStep}
            </DrawerTitle>
            <DrawerDescription className="sr-only">
              Fill out the form to create your personalized WishBloom memory collection. Step {currentStep} of 5.
            </DrawerDescription>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="px-4 pb-8 pt-2"
              >
                <CurrentStepComponent />
              </motion.div>
            </AnimatePresence>
          </DrawerContent>
        </Drawer>
      ) : (
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
      )}
    </main>
  )
}