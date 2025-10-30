import { notFound } from 'next/navigation'
import WishBloomView from './WishBloomView'

/**
 * Dynamic route for viewing WishBlooms
 */
export default async function WishBloomPage({ params }) {
  const { id } = params

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/wishblooms/${id}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      notFound()
    }

    const data = await response.json()

    if (!data.success || !data.wishbloom) {
      notFound()
    }

    return <WishBloomView wishbloom={data.wishbloom} />
  } catch (error) {
    console.error('Error fetching WishBloom:', error)
    notFound()
  }
}
