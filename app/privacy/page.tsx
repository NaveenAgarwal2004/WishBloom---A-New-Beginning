import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | WishBloom',
  description: 'Learn how WishBloom protects and handles your personal information',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-warmCream-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-body font-body text-warmCream-700 hover:text-sepiaInk transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-h1 font-heading text-sepiaInk mb-4">
            Privacy Policy
          </h1>
          <p className="text-body-lg font-body text-warmCream-700 italic">
            Your memories are precious. Here&apos;s how we protect them.
          </p>
          <p className="text-caption font-body text-warmCream-600 mt-2">
            Last Updated: December 2024
          </p>
        </header>

        {/* Content */}
        <article className="prose prose-lg max-w-none space-y-8">
          {/* Introduction */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">Welcome to WishBloom</h2>
            <p className="text-body-sm italic text-warmCream-600 mt-4">
              At WishBloom, we believe in creating beautiful digital memories while respecting your privacy. 
              This Privacy Policy explains how we collect, use, protect, and share information about you when 
              you use our platform to create and share birthday memory experiences.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">Information We Collect</h2>
            
            <h3 className="text-h5 font-heading text-fadedGold mt-6 mb-3">Information You Provide</h3>
            <ul className="space-y-2 text-body font-body text-warmCream-700">
              <li><strong>Account Information:</strong> Name, email address, and password when you create an account</li>
              <li><strong>WishBloom Content:</strong> Photos, messages, letters, poems, and other content you upload or create</li>
              <li><strong>Contributor Information:</strong> Names and emails of people you invite to contribute</li>
              <li><strong>Recipient Information:</strong> Names and details about birthday recipients</li>
            </ul>

            <h3 className="text-h5 font-heading text-fadedGold mt-6 mb-3">Automatically Collected Information</h3>
            <ul className="space-y-2 text-body font-body text-warmCream-700">
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the platform</li>
              <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
              <li><strong>Cookies:</strong> We use essential cookies for authentication and preferences</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">How We Use Your Information</h2>
            <ul className="space-y-3 text-body font-body text-warmCream-700">
              <li>✨ To create and display your WishBloom memory experiences</li>
              <li>🔐 To authenticate your account and maintain security</li>
              <li>📧 To send notifications when collaborators add memories</li>
              <li>🛠️ To improve our platform and develop new features</li>
              <li>🤝 To provide customer support</li>
              <li>⚖️ To comply with legal obligations</li>
            </ul>
          </section>

          {/* Data Storage and Security */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">Data Storage and Security</h2>
            <div className="space-y-4 text-body font-body text-warmCream-700">
              <p>
                <strong>Where We Store Your Data:</strong> Your WishBloom data is stored securely on MongoDB Atlas 
                servers. Images are hosted on Cloudinary&apos;s secure CDN infrastructure.
              </p>
              <p>
                <strong>Security Measures:</strong> We implement industry-standard security measures including:
              </p>
              <ul className="space-y-2 ml-6">
                <li>🔒 Encrypted data transmission (HTTPS/TLS)</li>
                <li>🔑 Password hashing using bcrypt</li>
                <li>🛡️ Rate limiting to prevent abuse</li>
                <li>🚨 Regular security audits</li>
                <li>🔐 Secure authentication via NextAuth.js</li>
              </ul>
              <p className="text-body-sm italic text-warmCream-600 mt-4">
                While we implement strong security measures, no method of transmission over the Internet is 100% secure. 
                We cannot guarantee absolute security.
              </p>
            </div>
          </section>

          {/* Sharing Your Information */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">Sharing Your Information</h2>
            <p className="text-body font-body text-warmCream-700 mb-4">
              We do not sell your personal information. We may share your information only in these limited circumstances:
            </p>
            <ul className="space-y-3 text-body font-body text-warmCream-700">
              <li><strong>With Your Consent:</strong> When you share a WishBloom link, recipients can view that specific content</li>
              <li><strong>Service Providers:</strong> Cloudinary (image hosting), MongoDB Atlas (database), Brevo (email notifications)</li>
              <li><strong>Legal Requirements:</strong> If required by law, court order, or government request</li>
              <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          {/* Your Rights and Choices */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">Your Rights and Choices</h2>
            <div className="space-y-4 text-body font-body text-warmCream-700">
              <p>You have the following rights regarding your personal information:</p>
              <ul className="space-y-3">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data (right to be forgotten)</li>
                <li><strong>Export:</strong> Download your WishBloom content and data</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails (we only send essential notifications)</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, contact us at{' '}
                <a href="mailto:agarwalnaveen9001@gmail.com" className="text-fadedGold hover:text-burntSienna underline">
                  agarwalnaveen9001@gmail.com
                </a>
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">Children&apos;s Privacy</h2>
            <p className="text-body font-body text-warmCream-700">
              WishBloom is not intended for children under 13. We do not knowingly collect personal information from 
              children under 13. If you believe we have collected information from a child under 13, please contact us 
              immediately, and we will delete it.
            </p>
          </section>

          {/* Cookies and Tracking */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">Cookies and Tracking</h2>
            <p className="text-body font-body text-warmCream-700 mb-4">
              We use essential cookies to:
            </p>
            <ul className="space-y-2 text-body font-body text-warmCream-700">
              <li>🔐 Keep you logged in</li>
              <li>💾 Remember your preferences</li>
              <li>📊 Analyze site performance (via Vercel Analytics)</li>
            </ul>
            <p className="text-body font-body text-warmCream-700 mt-4">
              You can control cookies through your browser settings. However, disabling cookies may affect site functionality.
            </p>
          </section>

          {/* International Users */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">International Users</h2>
            <p className="text-body font-body text-warmCream-700">
              WishBloom is operated from India. If you access our service from outside India, your information may be 
              transferred to and processed in India. By using WishBloom, you consent to this transfer.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">Changes to This Policy</h2>
            <p className="text-body font-body text-warmCream-700">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by email 
              or by posting a notice on our website. Your continued use of WishBloom after changes are posted constitutes 
              acceptance of the updated policy.
            </p>
          </section>

          {/* Contact Us */}
          <section className="bg-gradient-to-br from-rosePetal/10 to-lavenderMist/10 rounded-2xl p-8 border border-fadedGold/30 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">Contact Us</h2>
            <p className="text-body font-body text-warmCream-700 mb-4">
              If you have questions about this Privacy Policy or how we handle your data, please reach out:
            </p>
            <div className="space-y-2 text-body font-body text-warmCream-700">
              <p><strong>Email:</strong> <a href="mailto:agarwalnaveen9001@gmail.com" className="text-fadedGold hover:text-burntSienna underline">agarwalnaveen9001@gmail.com</a></p>
              <p><strong>Project:</strong> WishBloom - A New Beginning</p>
            </div>
          </section>
        </article>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-warmCream-200 text-center">
          <p className="text-body-sm font-body text-warmCream-600">
            By using WishBloom, you agree to our{' '}
            <Link href="/terms" className="text-fadedGold hover:text-burntSienna underline">
              Terms of Service
            </Link>
            {' '}and this Privacy Policy.
          </p>
        </footer>
      </div>
    </main>
  )
}
