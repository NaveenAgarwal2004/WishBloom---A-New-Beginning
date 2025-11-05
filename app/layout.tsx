import { Cormorant_Garamond, Spectral, EB_Garamond, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { AudioProvider } from '@/context/AudioContext'
import type { Metadata } from 'next'
import { WebVitals } from './web-vitals'
import SkipLink from '@/components/SkipLink'

// Font setup
const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
  display: 'swap',
})

const spectral = Spectral({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
})

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['italic'],
  variable: '--font-accent',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-mono',
  display: 'swap',
})

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
        <AudioProvider>
          {children}
        </AudioProvider>
        <WebVitals />
      </body>
    </html>
  )
}