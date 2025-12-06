import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service | WishBloom',
  description: 'Terms and conditions for using the WishBloom platform',
}

export default function TermsOfServicePage() {
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
            Terms of Service
          </h1>
          <p className="text-body-lg font-body text-warmCream-700 italic">
            Guidelines for creating and sharing beautiful memories
          </p>
          <p className="text-caption font-body text-warmCream-600 mt-2">
            Last Updated: December 2024
          </p>
        </header>

        {/* Content */}
        <article className="prose prose-lg max-w-none space-y-8">
          {/* Introduction */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">Agreement to Terms</h2>
            <p className="text-body font-body text-warmCream-700 leading-relaxed">
              Welcome to WishBloom! By accessing or using our platform, you agree to be bound by these Terms of Service 
              and our Privacy Policy. If you do not agree with any part of these terms, please do not use WishBloom.
            </p>
            <p className="text-body font-body text-warmCream-700 leading-relaxed mt-4">
              WishBloom is a platform for creating, preserving, and sharing heartfelt birthday memory experiences. 
              These terms govern your use of our services.
            </p>
          </section>

          {/* Eligibility */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">Eligibility</h2>
            <p className="text-body font-body text-warmCream-700 leading-relaxed">
              To use WishBloom, you must:
            </p>
            <ul className="space-y-2 text-body font-body text-warmCream-700 mt-4">
              <li>✨ Be at least 13 years of age</li>
              <li>📝 Provide accurate and complete registration information</li>
              <li>🔐 Maintain the security of your account credentials</li>
              <li>🌍 Comply with all applicable laws in your jurisdiction</li>
            </ul>
            <p className="text-body font-body text-warmCream-700 leading-relaxed mt-4">
              By creating an account, you represent that all information you provide is accurate and that you will 
              keep it up to date.
            </p>
          </section>

          {/* Account Responsibilities */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">Account Responsibilities</h2>
            <div className="space-y-4 text-body font-body text-warmCream-700">
              <p><strong>You are responsible for:</strong></p>
              <ul className="space-y-2 ml-6">
                <li>🔒 Maintaining the confidentiality of your password</li>
                <li>👤 All activities that occur under your account</li>
                <li>⚠️ Notifying us immediately of any unauthorized access</li>
                <li>📧 Providing a valid email address for important notifications</li>
              </ul>
              <p className="mt-4 text-body-sm italic text-warmCream-600">
                WishBloom is not liable for any loss or damage arising from your failure to maintain account security.
              </p>
            </div>
          </section>

          {/* User Content and Conduct */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">User Content and Conduct</h2>
            
            <h3 className="text-h5 font-heading text-fadedGold mt-6 mb-3">Your Content</h3>
            <p className="text-body font-body text-warmCream-700">
              You retain all ownership rights to the content you upload to WishBloom (photos, messages, letters, poems). 
              However, by uploading content, you grant WishBloom a worldwide, non-exclusive, royalty-free license to:
            </p>
            <ul className="space-y-2 text-body font-body text-warmCream-700 mt-3">
              <li>💾 Store and display your content</li>
              <li>🔄 Process and optimize images for performance</li>
              <li>📤 Deliver your content to people you share WishBlooms with</li>
              <li>🛠️ Make backups for disaster recovery</li>
            </ul>

            <h3 className="text-h5 font-heading text-fadedGold mt-6 mb-3">Content Guidelines</h3>
            <p className="text-body font-body text-warmCream-700 mb-3">
              <strong>You agree NOT to upload content that:</strong>
            </p>
            <ul className="space-y-2 text-body font-body text-warmCream-700">
              <li>❌ Is illegal, harmful, threatening, abusive, or harassing</li>
              <li>❌ Contains hate speech, discrimination, or violence</li>
              <li>❌ Infringes on others&apos; intellectual property rights</li>
              <li>❌ Contains malware, viruses, or malicious code</li>
              <li>❌ Is pornographic or sexually explicit</li>
              <li>❌ Violates anyone&apos;s privacy rights</li>
              <li>❌ Impersonates any person or entity</li>
            </ul>

            <p className="text-body font-body text-warmCream-700 mt-4">
              <strong>We reserve the right to remove any content that violates these guidelines without notice.</strong>
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">Intellectual Property</h2>
            <div className="space-y-4 text-body font-body text-warmCream-700">
              <p>
                <strong>WishBloom Platform:</strong> All rights, title, and interest in the WishBloom platform 
                (including design, code, features, and branding) are owned by WishBloom or its licensors.
              </p>
              <p>
                <strong>Your Content:</strong> You retain ownership of your uploaded content. We do not claim 
                ownership of your photos, messages, or personal creations.
              </p>
              <p>
                <strong>Third-Party Content:</strong> Some content (fonts, icons) may be licensed from third parties. 
                You may not extract or reuse these assets.
              </p>
            </div>
          </section>

          {/* Prohibited Uses */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">Prohibited Uses</h2>
            <p className="text-body font-body text-warmCream-700 mb-4">
              <strong>You may NOT:</strong>
            </p>
            <ul className="space-y-2 text-body font-body text-warmCream-700">
              <li>🚫 Use automated bots or scrapers</li>
              <li>🚫 Attempt to hack, breach, or circumvent security measures</li>
              <li>🚫 Overload our servers (rate limits apply)</li>
              <li>🚫 Use WishBloom for commercial advertising without permission</li>
              <li>🚫 Create fake accounts or impersonate others</li>
              <li>🚫 Reverse engineer or copy our platform</li>
              <li>🚫 Interfere with other users&apos; enjoyment of the service</li>
            </ul>
          </section>

          {/* Service Availability */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">Service Availability</h2>
            <div className="space-y-4 text-body font-body text-warmCream-700">
              <p>
                <strong>Service Level:</strong> We strive to provide reliable service, but WishBloom is provided &quot;as is&quot; 
                without guarantees of uptime or availability.
              </p>
              <p>
                <strong>Maintenance:</strong> We may perform scheduled maintenance that temporarily interrupts service. 
                We will provide notice when possible.
              </p>
              <p>
                <strong>Modifications:</strong> We reserve the right to modify, suspend, or discontinue any feature at 
                any time with or without notice.
              </p>
            </div>
          </section>

          {/* Data Backup and Loss */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">Data Backup and Loss</h2>
            <p className="text-body font-body text-warmCream-700 leading-relaxed">
              While we implement backup systems and security measures, <strong>we are not responsible for data loss 
              due to technical failures, security breaches, or force majeure events.</strong> We strongly recommend 
              keeping local copies of your important photos and content.
            </p>
          </section>

          {/* Termination */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">Termination</h2>
            <div className="space-y-4 text-body font-body text-warmCream-700">
              <p>
                <strong>By You:</strong> You may delete your account at any time through your account settings or by 
                contacting us. Deletion is permanent and cannot be undone.
              </p>
              <p>
                <strong>By Us:</strong> We may suspend or terminate your account if you:
              </p>
              <ul className="space-y-2 ml-6">
                <li>🚨 Violate these Terms of Service</li>
                <li>🚨 Upload prohibited content</li>
                <li>🚨 Engage in abusive behavior</li>
                <li>🚨 Attempt to compromise platform security</li>
              </ul>
              <p className="mt-4">
                Upon termination, your access to WishBloom will cease, and we may delete your data in accordance with 
                our retention policies.
              </p>
            </div>
          </section>

          {/* Disclaimer of Warranties */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">Disclaimer of Warranties</h2>
            <p className="text-body font-body text-warmCream-700 leading-relaxed">
              WISHBLOOM IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. 
              WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE. USE AT YOUR 
              OWN RISK.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">Limitation of Liability</h2>
            <p className="text-body font-body text-warmCream-700 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WISHBLOOM SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR USE, ARISING 
              OUT OF OR RELATED TO YOUR USE OF THE SERVICE.
            </p>
          </section>

          {/* Indemnification */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">Indemnification</h2>
            <p className="text-body font-body text-warmCream-700 leading-relaxed">
              You agree to indemnify and hold harmless WishBloom from any claims, damages, losses, or expenses 
              (including legal fees) arising from your use of the service, your content, or your violation of these terms.
            </p>
          </section>

          {/* Dispute Resolution */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">Dispute Resolution</h2>
            <div className="space-y-4 text-body font-body text-warmCream-700">
              <p>
                <strong>Governing Law:</strong> These terms are governed by the laws of India, without regard to 
                conflict of law principles.
              </p>
              <p>
                <strong>Resolution Process:</strong> In the event of a dispute, we encourage you to contact us first 
                to seek an informal resolution. If that fails, disputes shall be resolved through binding arbitration 
                in accordance with Indian law.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">Changes to These Terms</h2>
            <p className="text-body font-body text-warmCream-700 leading-relaxed">
              We may update these Terms of Service from time to time. Significant changes will be communicated via 
              email or a prominent notice on the platform. Your continued use after changes are posted constitutes 
              acceptance of the updated terms.
            </p>
          </section>

          {/* Severability */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">Severability</h2>
            <p className="text-body font-body text-warmCream-700 leading-relaxed">
              If any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall 
              remain in full force and effect.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-gradient-to-br from-rosePetal/10 to-lavenderMist/10 rounded-2xl p-8 border border-fadedGold/30 shadow-soft">
            <h2 className="text-h3 font-heading text-sepiaInk mb-4">Contact Us</h2>
            <p className="text-body font-body text-warmCream-700 mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-body font-body text-warmCream-700">
              <p><strong>Email:</strong> <a href="mailto:agarwalnaveen9001@gmail.com" className="text-fadedGold hover:text-burntSienna underline">agarwalnaveen9001@gmail.com</a></p>
              <p><strong>Project:</strong> WishBloom - A New Beginning</p>
            </div>
            <p className="text-body font-body text-warmCream-700 mt-6 italic">
              Thank you for choosing WishBloom to celebrate life&apos;s beautiful moments. We&apos;re honored to help you 
              create lasting memories. 🌸
            </p>
          </section>
        </article>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-warmCream-200 text-center">
          <p className="text-body-sm font-body text-warmCream-600">
            By using WishBloom, you agree to these Terms of Service and our{' '}
            <Link href="/privacy" className="text-fadedGold hover:text-burntSienna underline">
              Privacy Policy
            </Link>.
          </p>
        </footer>
      </div>
    </main>
  )
}
