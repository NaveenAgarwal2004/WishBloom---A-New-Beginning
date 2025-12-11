
import localFont from 'next/font/local'
import './globals.css'
import { AudioProvider } from '@/context/AudioContext'
import type { Metadata, Viewport } from 'next'
import { WebVitals } from './web-vitals'
import SkipLink from '@/components/SkipLink'
import { Toaster } from '@/components/ui/toaster'
import Providers from '@/components/Providers'
import Navigation from '@/components/Navigation'
import { Analytics } from '@vercel/analytics/next'

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
  themeColor: '#FDFBF7',
}

// ✅ Clean metadata object (no more deprecated viewport key)
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: 'WishBloom - Pressed Flower Birthday Memories',
  description:
    'Create beautiful, interactive birthday memory books. Preserve and share memories with pressed flowers aesthetic.',
  keywords: ['birthday', 'memories', 'gift', 'scrapbook', 'pressed flowers'],

  // ✅ Google Search Console Verification
  verification: {
    google: 'Oii_nGFCUPfTxOYY2MLI2g9KHQ12O4LDV7BS1JJct9c',
  },
  
  // ✅ Part 10: PWA Manifest
  manifest: '/manifest.json',
  
  // ✅ Mobile Web App configuration (replaces deprecated apple-mobile-web-app-capable)
  other: {
    'mobile-web-app-capable': 'yes',
  },
  
  // ✅ Apple Web App configuration
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'WishBloom',
  },
  
  // ✅ PWA Application Name
  applicationName: 'WishBloom',
  
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
  
  // ✅ Part 10: Additional PWA icons
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
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
        <Providers>
          <Navigation />
          {/* ✅ AudioProvider now safely runs client-side */}
          <AudioProvider>
            {children}
          </AudioProvider>
          <Toaster />
        </Providers>
        <WebVitals />
        {/* ✅ Only load Vercel Analytics in production */}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}