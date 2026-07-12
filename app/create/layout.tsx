import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create a Birthday Memory Book Online Free | WishBloom',
  description: 'Build a collaborative birthday scrapbook in minutes. Add pages for memories, letters, and quotes, and let friends upload photos. 100% free with no registration.',
  keywords: [
    'free birthday memory book online',
    'birthday gift ideas',
    'digital scrapbook birthday',
    'online birthday card maker',
    'birthday memory book creator'
  ],
  openGraph: {
    title: 'Create a Birthday Memory Book Online Free | WishBloom',
    description: 'Build a collaborative birthday scrapbook in minutes. Add pages for memories, letters, and quotes, and let friends upload photos. 100% free with no registration.',
    url: 'https://wishblooms.in/create',
    siteName: 'WishBloom',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create a Birthday Memory Book Online Free | WishBloom',
    description: 'Build a collaborative birthday scrapbook in minutes. Add pages for memories, letters, and quotes, and let friends upload photos. 100% free with no registration.',
  },
  alternates: {
    canonical: 'https://wishblooms.in/create',
  },
}

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
