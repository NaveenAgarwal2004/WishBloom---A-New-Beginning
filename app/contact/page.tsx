import type { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/Footer'
import { ArrowLeft, Mail, Github, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact WishBloom | Get in Touch',
  description: 'Have a question about WishBloom, a bug to report, or an idea to share? Contact Naveen Agarwal, the creator of WishBloom, directly by email or Instagram.',
  keywords: [
    'contact WishBloom',
    'WishBloom support',
    'birthday memory book help',
    'WishBloom creator',
  ],
  openGraph: {
    title: 'Contact WishBloom | Get in Touch',
    description: 'Have a question, bug report, or idea? Contact the creator of WishBloom directly.',
    url: 'https://wishblooms.in/contact',
    siteName: 'WishBloom',
    type: 'website',
    images: [
      {
        url: 'https://wishblooms.in/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WishBloom — Free Birthday Memory Book Creator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact WishBloom | Get in Touch',
    description: 'Have a question, bug report, or idea? Contact the creator of WishBloom directly.',
    images: ['https://wishblooms.in/og-image.png'],
  },
  alternates: {
    canonical: 'https://wishblooms.in/contact',
  },
}

const contactJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact WishBloom',
  url: 'https://wishblooms.in/contact',
  description: 'Contact Naveen Agarwal, creator of WishBloom, by email or Instagram.',
  publisher: {
    '@type': 'Person',
    name: 'Naveen Agarwal',
    email: 'agarwalnaveen9001@gmail.com',
    url: 'https://wishblooms.in/about',
  },
}

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <main className="min-h-screen bg-warmCream-50 pt-20 pb-12 pb-bottom-nav md:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-body font-body text-warmCream-700 hover:text-sepiaInk transition-colors mb-8"
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </Link>

          <article className="space-y-8">
            {/* Page Header */}
            <header className="text-center pb-8 border-b border-warmCream-200">
              <h1 className="text-h2 md:text-h1 font-heading font-bold text-sepiaInk mb-3">
                Get in Touch
              </h1>
              <p className="text-body font-body text-warmCream-600 italic">
                A real person reads every message.
              </p>
            </header>

            {/* Contact intro */}
            <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
              <h2 className="text-h3 font-heading text-sepiaInk mb-4">How can I help?</h2>
              <div className="space-y-3 text-body font-body text-warmCream-800 leading-relaxed">
                <p>
                  If something didn&apos;t work when you were creating or sharing a WishBloom,
                  I want to know. If you have an idea for a feature, I&apos;m genuinely interested.
                  If you just want to say it worked — that means a lot too.
                </p>
                <p>
                  WishBloom is built and maintained by one person. I respond to every message,
                  usually within 24–48 hours.
                </p>
              </div>
            </section>

            {/* Contact methods */}
            <section className="bg-gradient-to-br from-rosePetal/10 to-warmCream-100 rounded-2xl p-8 border border-warmCream-200 shadow-soft">
              <h2 className="text-h3 font-heading text-sepiaInk mb-6">Contact options</h2>
              <div className="space-y-4">

                {/* Email */}
                <a
                  href="mailto:agarwalnaveen9001@gmail.com"
                  className="flex items-start gap-4 p-4 bg-white/70 rounded-xl border border-warmCream-200 hover:bg-white hover:border-fadedGold/40 hover:shadow-soft transition-all group"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-mossGreen/10 rounded-full flex items-center justify-center group-hover:bg-mossGreen/20 transition-colors">
                    <Mail size={20} className="text-mossGreen" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sepiaInk text-body-sm mb-0.5">Email</p>
                    <p className="text-body-sm font-body text-warmCream-700">agarwalnaveen9001@gmail.com</p>
                    <p className="text-xs font-body text-warmCream-500 mt-1">Best for bug reports, detailed questions, or feedback</p>
                  </div>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/wishblooms.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 bg-white/70 rounded-xl border border-warmCream-200 hover:bg-white hover:border-fadedGold/40 hover:shadow-soft transition-all group"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center group-hover:bg-pink-100 transition-colors">
                    <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sepiaInk text-body-sm mb-0.5">Instagram</p>
                    <p className="text-body-sm font-body text-warmCream-700">@wishblooms.in</p>
                    <p className="text-xs font-body text-warmCream-500 mt-1">DMs open — good for quick questions or sharing your WishBloom</p>
                  </div>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/NaveenAgarwal2004/WishBloom---A-New-Beginning"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 bg-white/70 rounded-xl border border-warmCream-200 hover:bg-white hover:border-fadedGold/40 hover:shadow-soft transition-all group"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-sepiaInk/5 rounded-full flex items-center justify-center group-hover:bg-sepiaInk/10 transition-colors">
                    <Github size={20} className="text-sepiaInk" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="font-heading font-bold text-sepiaInk text-body-sm mb-0.5">GitHub</p>
                      <ExternalLink size={12} className="text-warmCream-400 mb-0.5" />
                    </div>
                    <p className="text-body-sm font-body text-warmCream-700">NaveenAgarwal2004 / WishBloom</p>
                    <p className="text-xs font-body text-warmCream-500 mt-1">Open an issue for bugs or feature requests — open source</p>
                  </div>
                </a>
              </div>
            </section>

            {/* CTA */}
            <div className="text-center pt-2">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-mossGreen text-white rounded-full font-heading hover:bg-mossGreen/90 transition-colors shadow-soft"
              >
                Create a free WishBloom →
              </Link>
            </div>
          </article>
        </div>
        <Footer />
      </main>
    </>
  )
}
