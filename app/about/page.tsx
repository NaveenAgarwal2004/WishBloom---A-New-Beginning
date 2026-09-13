import { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/Footer'
import { ArrowLeft, Github, Mail, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Why I Built WishBloom — A Free Birthday Memory Book for Everyone',
  description: 'WishBloom is a free birthday memory book creator built by Naveen Agarwal. No paid plans. No app. Just a beautiful, collaborative scrapbook you can send to someone you love.',
  keywords: [
    'free birthday memory book online',
    'birthday gift ideas',
    'digital scrapbook birthday',
    'online birthday card maker',
    'birthday memory book creator'
  ],
  openGraph: {
    title: 'Why I Built WishBloom — A Free Birthday Memory Book for Everyone',
    description: 'WishBloom is a free birthday memory book creator. No paid plans. No app. Just a beautiful, collaborative scrapbook you can send to someone you love.',
    url: 'https://wishblooms.in/about',
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
    title: 'Why I Built WishBloom — A Free Birthday Memory Book for Everyone',
    description: 'WishBloom is a free birthday memory book creator. No paid plans. No app. Just a beautiful, collaborative scrapbook you can send to someone you love.',
    images: ['https://wishblooms.in/og-image.png'],
  },
  alternates: {
    canonical: 'https://wishblooms.in/about',
  },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-warmCream-50 pt-20 pb-12 pb-bottom-nav md:pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-body font-body text-warmCream-700 hover:text-sepiaInk transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </Link>

        <article className="space-y-10">

          {/* Page Header */}
          <header className="text-center pb-8 border-b border-warmCream-200">
            <h1 className="text-h2 md:text-h1 font-heading font-bold text-sepiaInk mb-3">
              About WishBloom
            </h1>
            <p className="text-body font-body text-warmCream-600 italic">
              A birthday gift that actually means something.
            </p>
          </header>

          {/* Section 1: What WishBloom Does */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-5">What is WishBloom?</h2>
            <div className="space-y-4 text-body font-body text-warmCream-800 leading-relaxed">
              <p>
                WishBloom is a free online birthday memory book creator. You fill a short five-step wizard — the recipient's name and intro, a collection of memory cards with photos and stories, personal letters from friends, a wishes section for poems and quotes, and a final preview — and WishBloom stitches everything together into one beautiful, shareable scrapbook.
              </p>
              <p>
                The person receiving it doesn't need an account, doesn't need to download an app, and doesn't need to do anything except open the link. When they do, they're greeted by their memories, their people's words, and — my favourite part — a set of birthday candles they can actually blow out using their device's microphone. Or tap a button if they'd rather not. Either way, it's their moment.
              </p>
              <p>
                The whole aesthetic is built around pressed and preserved botanical flowers — warm cream paper, sepia ink, faded gold accents. It's deliberately different from the glossy, generic look of most digital card tools. I wanted it to feel like something you found tucked inside an old book, not something that came out of a Canva template.
              </p>
            </div>
          </section>

          {/* Section 2: Who Built It */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-5">Who built this?</h2>
            <div className="space-y-4 text-body font-body text-warmCream-800 leading-relaxed">
              <p>
                I'm Naveen Agarwal — a BCA graduate from Jaipur, Rajasthan. I built WishBloom because a close friend's birthday was coming up and I wanted to do something more meaningful than texting a GIF. I looked for a free, collaborative tool that could gather messages from a small group and present them nicely. Everything I found was either too expensive for what it did, too limited in the free tier, or just not very thoughtful in its design.
              </p>
              <p>
                So I built it myself. What started as a weekend project kept growing — the candle feature, the photo memory cards, the full publishing pipeline. It's been a learning experience in Next.js, MongoDB, Cloudinary, and honestly, in what people actually want when they sit down to celebrate someone they care about.
              </p>
              <p>
                WishBloom runs on Next.js with the App Router, stores memory books in MongoDB, handles photo uploads through Cloudinary, and is deployed on Vercel. The whole codebase is open source.
              </p>
              <div className="mt-6 pt-5 border-t border-warmCream-200">
                <a
                  href="https://github.com/NaveenAgarwal2004/WishBloom---A-New-Beginning"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-sepiaInk text-white rounded-full font-heading text-body-sm hover:bg-sepiaInk/90 transition-colors"
                >
                  <Github size={18} />
                  View source code on GitHub
                  <ExternalLink size={14} className="opacity-60" />
                </a>
              </div>
            </div>
          </section>

          {/* Section 3: What Makes WishBloom Different */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-5">What makes WishBloom different?</h2>
            <div className="space-y-5 text-body font-body text-warmCream-800 leading-relaxed">
              <p>
                A few things matter to me that I don't see elsewhere.
              </p>
              <div className="space-y-4 pl-4 border-l-2 border-warmCream-300">
                <div>
                  <p className="font-heading text-sepiaInk mb-1">Free, actually.</p>
                  <p>Not "free for three contributors and then pay." Not "free to create but paid to download." WishBloom has no paid plans, no upgrade prompts, and no feature gates. I'm a student who built this because the problem was worth solving, not because I needed a subscription business.</p>
                </div>
                <div>
                  <p className="font-heading text-sepiaInk mb-1">Genuinely collaborative.</p>
                  <p>Anyone can contribute — photos, letters, wishes — without creating an account. You just share the contributor link. The person receiving the book also needs no account. The barrier to participation is as low as I could make it.</p>
                </div>
                <div>
                  <p className="font-heading text-sepiaInk mb-1">The candle moment.</p>
                  <p>Most digital birthday experiences are passive — you look at something, you close the tab. WishBloom has one interactive moment: the birthday person can blow out their candles using their microphone. It's a small thing, but it makes the experience feel like an actual celebration rather than a slide deck.</p>
                </div>
                <div>
                  <p className="font-heading text-sepiaInk mb-1">A visual identity that feels considered.</p>
                  <p>Pressed flowers, botanical textures, cream and sepia. It's not for everyone, but if you want a birthday gift that doesn't look like it came out of the same template as everyone else's, WishBloom has a real point of view.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Contact / Feedback */}
          <section className="bg-gradient-to-br from-rosePetal/10 to-warmCream-100 rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">Get in touch</h2>
            <div className="space-y-4 text-body font-body text-warmCream-800 leading-relaxed">
              <p>
                If you used WishBloom and something didn't work, I want to know. If you have an idea for a feature, I'm genuinely interested. If you just want to say it was nice — that means a lot too.
              </p>
              <p>
                The best way to reach me is by email. No support ticket system, no chatbot — just a direct message.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <a
                  href="mailto:agarwalnaveen9001@gmail.com"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-sepiaInk border border-warmCream-300 rounded-full font-heading hover:bg-warmCream-50 transition-colors"
                >
                  <Mail size={18} />
                  agarwalnaveen9001@gmail.com
                </a>
                <a
                  href="https://www.instagram.com/wishblooms.in"
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-pink-700 border border-warmCream-300 rounded-full font-heading hover:bg-warmCream-50 transition-colors"
                >
                  <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  @wishblooms.in
                </a>
                <Link
                  href="https://wishblooms.in/create"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-mossGreen text-white rounded-full font-heading hover:bg-mossGreen/90 transition-colors"
                >
                  Try WishBloom free →
                </Link>
              </div>
            </div>
          </section>

        </article>
      </div>
      <Footer />
    </main>
  )
}
