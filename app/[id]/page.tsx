import { notFound } from 'next/navigation'
import WishBloomView from './WishBloomView'
import ErrorBoundary from '@/components/ErrorBoundary'

interface WishBloomPageProps {
  params: {
    id: string
  }
}

/**
 * Dynamic route for viewing WishBlooms
 */
export default async function WishBloomPage({ params }: WishBloomPageProps) {
  const { id } = params

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  
  const response = await fetch(`${baseUrl}/api/wishblooms/${id}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    notFound()
  }

  const data = await response.json()

  if (!data.success || !data.wishbloom) {
    notFound()
  }

  return (
    <ErrorBoundary>
      <WishBloomView wishbloom={data.wishbloom} />
    </ErrorBoundary>
  )
}