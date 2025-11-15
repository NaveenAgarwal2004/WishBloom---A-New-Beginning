
import localFont from 'next/font/local'
import './globals.css'
import { AudioProvider } from '@/context/AudioContext'
import type { Metadata, Viewport } from 'next'
import { WebVitals } from './web-vitals'
import SkipLink from '@/components/SkipLink'

// ✅ Self-hosted fonts with Next.js optimization
const cormorantGaramond = localFont({
  src: [
    {
      path: '../public/fonts/cormorant-garamond-400.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/cormorant-garamond-700.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-heading',
  display: 'swap',
  preload: true,
})

const spectral = localFont({
  src: [
    {
      path: '../public/fonts/spectral-400.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/spectral-600.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-body',
  display: 'swap',
  preload: true,
})

const ebGaramond = localFont({
  src: [
    {
      path: '../public/fonts/eb-garamond-400.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/eb-garamond-600.woff2',
      weight: '600',
      style: 'italic',
    },
  ],
  variable: '--font-accent',
  display: 'swap',
  preload: true,
})

const ibmPlexMono = localFont({
  src: [
    {
      path: '../public/fonts/ibm-plex-mono-400.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/ibm-plex-mono-600.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-mono',
  display: 'swap',
  preload: true,
})

// ✅ Move viewport to separate export (Next.js 14.2+ standard)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

// ✅ Clean metadata object (no more deprecated viewport key)
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: 'WishBloom - Pressed Flower Birthday Memories',
  description:
    'Create beautiful, interactive birthday memory books. Preserve and share memories with pressed flowers aesthetic.',
  keywords: ['birthday', 'memories', 'gift', 'scrapbook', 'pressed flowers'],
  openGraph: {
    title: 'WishBloom - Pressed Flower Birthday Memories',
    description: "Preserve and share life's most precious moments",
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    siteName: 'WishBloom',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${cormorantGaramond.variable} ${spectral.variable} ${ebGaramond.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <SkipLink />
        {/* ✅ AudioProvider now safely runs client-side */}
        <AudioProvider>
          {children}
        </AudioProvider>
        <WebVitals />
      </body>
    </html>
  )
}