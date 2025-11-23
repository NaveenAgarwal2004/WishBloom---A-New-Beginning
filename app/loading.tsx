import FloralLoader from '@/components/FloralLoader'

/**
 * Global loading state for page transitions
 * Displays the floral loader during navigation between pages
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-warmCream-100 to-rosePetal/10 flex items-center justify-center animate-pulse">
      <FloralLoader size={140} message="Loading your WishBloom..." />
    </div>
  )
}
