import { AudioProvider } from '@/context/AudioContext'

/**
 * Layout for individual WishBloom view pages (/[id])
 * AudioProvider is scoped here so audio files only load on actual WishBloom pages,
 * not on every page of the site (homepage, blog, etc.)
 */
export default function WishBloomViewLayout({ children }: { children: React.ReactNode }) {
  return <AudioProvider>{children}</AudioProvider>
}
