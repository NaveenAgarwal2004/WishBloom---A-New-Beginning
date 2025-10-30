import { Cormorant_Garamond, Spectral, EB_Garamond, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { AudioProvider } from '@/context/AudioContext'

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

export const metadata = {
  title: 'WishBloom - Pressed Flower Birthday Memories',
  description: "Create beautiful, interactive birthday memory books. Preserve and share life's most precious moments in a digital pressed flower scrapbook.",
  keywords: 'birthday, memories, gift, scrapbook, pressed flowers',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${cormorantGaramond.variable} ${spectral.variable} ${ebGaramond.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <AudioProvider>
          {children}
        </AudioProvider>
      </body>
    </html>
  )
}
