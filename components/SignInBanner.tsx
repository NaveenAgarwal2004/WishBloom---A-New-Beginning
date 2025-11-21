'use client'

import { useState } from 'react'
import { X, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

/**
 * Banner encouraging anonymous users to sign in to save their WishBlooms
 */
export default function SignInBanner() {
  const { data: session } = useSession()
  const router = useRouter()
  const [dismissed, setDismissed] = useState(false)

  // Don't show if user is logged in or banner is dismissed
  if (session?.user || dismissed) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-fadedGold/10 to-rosePetal/10 border-2 border-fadedGold/30 rounded-2xl p-4 md:p-6 mb-8 relative">
      {/* Dismiss button */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-warmCream-600 hover:text-sepiaInk transition-colors"
        aria-label="Dismiss banner"
      >
        <X size={20} />
      </button>

      <div className="flex gap-4 items-start pr-8">
        <div className="flex-shrink-0 mt-1">
          <div className="w-10 h-10 rounded-full bg-fadedGold/20 flex items-center justify-center">
            <Info size={20} className="text-fadedGold" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-h6 font-heading font-bold text-sepiaInk mb-2">
            💡 Save Your WishBlooms
          </h3>
          <p className="text-body-sm font-body text-warmCream-700 mb-4">
            You're creating as a guest. Sign in or create an account to save this WishBloom to your dashboard and access it anytime!
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              size="sm"
              onClick={() => router.push('/api/auth/signin?callbackUrl=/create')}
              className="bg-fadedGold hover:bg-fadedGold/90 text-white font-heading font-semibold"
            >
              Sign In
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push('/auth/signup')}
              className="font-heading font-semibold border-fadedGold text-fadedGold hover:bg-fadedGold/10"
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
