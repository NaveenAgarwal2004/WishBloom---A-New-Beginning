import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Edit3, Image as ImageIcon, Mail, Sparkles, Eye, Share2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'How WishBloom Works — Birthday Memory Book in 6 Steps',
  description: 'Learn how to make an interactive online memory book. Simple 6-step creation wizard for collaborative birthday gifts, wishes, and candle blowing.',
  keywords: [
    'free birthday memory book online',
    'birthday gift ideas',
    'digital scrapbook birthday',
    'online birthday card maker',
    'birthday memory book creator'
  ],
  openGraph: {
    title: 'How WishBloom Works — Birthday Memory Book in 6 Steps',
    description: 'Learn how to make an interactive online memory book. Simple 6-step creation wizard for collaborative birthday gifts, wishes, and candle blowing.',
    url: 'https://wishblooms.in/how-it-works',
    siteName: 'WishBloom',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How WishBloom Works — Birthday Memory Book in 6 Steps',
    description: 'Learn how to make an interactive online memory book. Simple 6-step creation wizard for collaborative birthday gifts, wishes, and candle blowing.',
  },
  alternates: {
    canonical: 'https://wishblooms.in/how-it-works',
  },
}

export default function HowItWorksPage() {
  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Create a Free Birthday Memory Book Online',
    description: 'A step-by-step guide to creating a collaborative, interactive birthday memory book on WishBloom.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Step 1: Enter Recipient Info',
        text: "Enter the birthday person's name, their age, a creative age description, and a heartfelt intro message. This sets the stage for the entire digital scrapbook, letting them know right away that this isn't just a generic card, but a story crafted specifically for them. It establishes the warm, personal tone that will carry through every page.",
      },
      {
        '@type': 'HowToStep',
        name: 'Step 2: Add Memory Cards',
        text: "Create beautiful memory cards by adding dates, titles, short stories, optional photos, and mood tags like 'nostalgic' or 'funny'. Memories are the heart of any relationship, and organizing them this way helps weave a rich tapestry of your shared history. It reminds the recipient of the specific, beautiful moments that define your connection.",
      },
      {
        '@type': 'HowToStep',
        name: 'Step 3: Add Personal Letters',
        text: "Gather and add longer, letter-style messages from friends and family members. A thoughtful letter provides a space for deep appreciation and reflection that quick text messages simply can't capture. It gives everyone a chance to express exactly what the birthday person means to them in a dedicated, lasting format.",
      },
      {
        '@type': 'HowToStep',
        name: 'Step 4: Add Wishes & Quotes',
        text: "Sprinkle in shorter, punchy content like inside jokes, favorite quotes, or poetic birthday wishes. These quick snippets add rhythm and joy to the reading experience, balancing the longer letters with moments of levity and instant smiles. They act as the perfect celebratory confetti throughout the memory book.",
      },
      {
        '@type': 'HowToStep',
        name: 'Step 5: Preview Your Book',
        text: "Take a moment to preview the full WishBloom in all its pressed-flower botanical glory before hitting publish. This ensures every photo is placed perfectly and every word lands exactly as intended. It gives you the confidence that you're delivering a polished, emotionally resonant gift that looks absolutely stunning.",
      },
      {
        '@type': 'HowToStep',
        name: 'Step 6: Share and Celebrate',
        text: "Generate a unique, shareable link and send it to the birthday person, who can open it instantly without any sign-ups or apps. When they reach the end of the book, they are greeted by interactive digital candles that they can actually blow out using their device's microphone. It transforms a digital link into a tangible, celebratory moment they'll never forget.",
      },
    ],
  }

  const steps = [
    {
      icon: <Edit3 className="w-8 h-8 text-mossGreen" />,
      title: 'Step 1: The Introduction',
      description: "Enter the birthday person's name, their age, a creative age description, and a heartfelt intro message. This sets the stage for the entire digital scrapbook, letting them know right away that this isn't just a generic card, but a story crafted specifically for them. It establishes the warm, personal tone that will carry through every page.",
    },
    {
      icon: <ImageIcon className="w-8 h-8 text-burntSienna" />,
      title: 'Step 2: Curate Memories',
      description: "Create beautiful memory cards by adding dates, titles, short stories, optional photos, and mood tags like 'nostalgic' or 'funny'. Memories are the heart of any relationship, and organizing them this way helps weave a rich tapestry of your shared history. It reminds the recipient of the specific, beautiful moments that define your connection.",
    },
    {
      icon: <Mail className="w-8 h-8 text-fadedGold" />,
      title: 'Step 3: Gather Letters',
      description: "Gather and add longer, letter-style messages from friends and family members. A thoughtful letter provides a space for deep appreciation and reflection that quick text messages simply can't capture. It gives everyone a chance to express exactly what the birthday person means to them in a dedicated, lasting format.",
    },
    {
      icon: <Sparkles className="w-8 h-8 text-rosePetal" />,
      title: 'Step 4: Wishes & Quotes',
      description: "Sprinkle in shorter, punchy content like inside jokes, favorite quotes, or poetic birthday wishes. These quick snippets add rhythm and joy to the reading experience, balancing the longer letters with moments of levity and instant smiles. They act as the perfect celebratory confetti throughout the memory book.",
    },
    {
      icon: <Eye className="w-8 h-8 text-mossGreen" />,
      title: 'Step 5: The Final Preview',
      description: "Take a moment to preview the full WishBloom in all its pressed-flower botanical glory before hitting publish. This ensures every photo is placed perfectly and every word lands exactly as intended. It gives you the confidence that you're delivering a polished, emotionally resonant gift that looks absolutely stunning.",
    },
    {
      icon: <Share2 className="w-8 h-8 text-sepiaInk" />,
      title: 'Step 6: Share the Magic',
      description: "Generate a unique, shareable link and send it to the birthday person, who can open it instantly without any sign-ups or apps. When they reach the end of the book, they are greeted by interactive digital candles that they can actually blow out using their device's microphone. It transforms a digital link into a tangible, celebratory moment they'll never forget.",
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      
      <main className="min-h-screen bg-warmCream-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-body font-body text-warmCream-700 hover:text-sepiaInk transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>

          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-warmCream-200 shadow-soft">
            <header className="mb-16 text-center">
              <h1 className="text-h2 md:text-h1 font-heading font-bold text-sepiaInk mb-4">
                How WishBloom Works
              </h1>
              <p className="text-body-lg font-body text-warmCream-700 max-w-2xl mx-auto">
                Creating a collaborative birthday memory book is an act of love. Here is how you can build a beautiful, interactive gift in six simple steps.
              </p>
            </header>

            <div className="space-y-8 mb-16">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-6 p-8 bg-warmCream-50 rounded-2xl border border-warmCream-200 hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-white rounded-full border border-warmCream-200 shadow-sm">
                    {step.icon}
                  </div>
                  <div>
                    <h2 className="text-h4 font-heading text-sepiaInk mb-3">{step.title}</h2>
                    <p className="text-body font-body text-warmCream-700 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center p-10 bg-gradient-to-r from-warmCream-100 to-rosePetal/10 rounded-2xl border border-warmCream-200">
              <h2 className="text-h3 font-heading text-sepiaInk mb-4">Ready to start creating?</h2>
              <p className="text-body font-body text-warmCream-700 mb-8 max-w-xl mx-auto">
                Join others who have created beautiful digital scrapbooks. It's 100% free and requires no registration.
              </p>
              <Link 
                href="/create"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-mossGreen text-white rounded-full text-lg font-heading hover:bg-mossGreen/90 transition-all shadow-soft hover:shadow-lg hover:-translate-y-1"
              >
                Create a WishBloom Now
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
