import dynamic from 'next/dynamic'
import LoadingState from '@/components/LoadingState'

/**
 * Dynamically imported heavy components
 * This reduces initial bundle size and improves performance
 */

// Celebration section with confetti and animations
export const CelebrationSection = dynamic(
  () => import('@/components/CelebrationSection'),
  {
    loading: () => <LoadingState message="Preparing celebration..." />,
    ssr: false, // Disable SSR for animation-heavy component
  }
)

// Confetti component (heavy animation library)
export const Confetti = dynamic(() => import('@/components/Confetti'), {
  ssr: false,
})

// Wishes float animation
export const WishesFloat = dynamic(() => import('@/components/WishesFloat'), {
  ssr: false,
})

// Cake component with breath detection
export const CakeComponent = dynamic(() => import('@/components/CakeComponent'), {
  loading: () => <LoadingState message="Lighting the candles..." size="small" />,
  ssr: false,
})

// Music control (audio context)
export const MusicControl = dynamic(() => import('@/components/MusicControl'), {
  ssr: false, // Audio needs client-side only
})

// Memory gallery (can be heavy with many images)
export const MemoryGallery = dynamic(() => import('@/components/MemoryGallery'), {
  loading: () => (
    <div className="py-16">
      <LoadingState message="Loading memories..." />
    </div>
  ),
})

// Messages section
export const MessagesSection = dynamic(() => import('@/components/MessagesSection'), {
  loading: () => (
    <div className="py-16">
      <LoadingState message="Loading messages..." />
    </div>
  ),
})