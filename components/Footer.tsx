'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { IContributor } from '@/models/WishBloom'
import FooterStats from '@/components/layout/FooterStats'
import FooterSignatures from '@/components/layout/FooterSignatures'
import { APP_CONFIG } from '@/config/constants'

interface FooterProps {
  contributors?: IContributor[]
  createdDate?: string
}

/**
 * Modern Pressed-Flower Footer Component
 * Includes Navigation Links, Legal Pages, Social Handles, Dynamic Stats, and Signatures
 */
export default function Footer({ contributors = [], createdDate }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-gradient-to-b from-warmCream-100 to-warmCream-200 border-t border-warmCream-300 py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Brand & Tagline */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-block hover:opacity-85 transition-opacity">
              <Image
                src="/wishbloom-logo-transparent.png"
                alt="WishBloom Logo"
                width={160}
                height={50}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-body-sm text-warmCream-700 font-body leading-relaxed">
              {APP_CONFIG.APP_TAGLINE}. Collect photos, heartfelt notes, and letters into a beautiful interactive digital scrapbook.
            </p>
            <div className="pt-2">
              <FooterStats />
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="text-sm font-heading font-bold text-sepiaInk uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-body-sm font-body">
              <li>
                <Link href="/" className="text-warmCream-700 hover:text-sepiaInk transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/create" className="text-warmCream-700 hover:text-sepiaInk transition-colors font-medium">
                  Create a Memory Book ✨
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-warmCream-700 hover:text-sepiaInk transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-warmCream-700 hover:text-sepiaInk transition-colors">
                  Journal & Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-warmCream-700 hover:text-sepiaInk transition-colors">
                  About WishBloom
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Trust */}
          <div>
            <h4 className="text-sm font-heading font-bold text-sepiaInk uppercase tracking-wider mb-4">
              Legal & Trust
            </h4>
            <ul className="space-y-2.5 text-body-sm font-body">
              <li>
                <Link href="/privacy" className="text-warmCream-700 hover:text-sepiaInk transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-warmCream-700 hover:text-sepiaInk transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <span className="text-warmCream-600 text-xs block pt-2">
                  🔒 100% Private & Ad-Free. No app required.
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Media & Connect */}
          <div>
            <h4 className="text-sm font-heading font-bold text-sepiaInk uppercase tracking-wider mb-4">
              Follow Us
            </h4>
            <p className="text-body-sm text-warmCream-700 font-body mb-4">
              Follow our community on social media for birthday inspiration & story highlights!
            </p>

            <div className="flex items-center gap-3">
              {/* Instagram Button */}
              <a
                href={APP_CONFIG.SOCIAL_LINKS.INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-warmCream-50 border border-warmCream-300 text-sepiaInk hover:bg-white hover:border-fadedGold transition-all text-body-sm font-medium shadow-xs group"
                aria-label="WishBloom on Instagram"
              >
                <svg className="w-4 h-4 text-pink-600 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </a>

              {/* Facebook Button */}
              <a
                href={APP_CONFIG.SOCIAL_LINKS.FACEBOOK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-warmCream-50 border border-warmCream-300 text-sepiaInk hover:bg-white hover:border-fadedGold transition-all text-body-sm font-medium shadow-xs group"
                aria-label="WishBloom on Facebook"
              >
                <svg className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.714 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
                </svg>
                Facebook
              </a>
            </div>
          </div>
        </div>

        {/* Optional Creation Date Info (if viewing a specific Memory Book) */}
        {createdDate && (
          <div className="border-t border-warmCream-300/60 pt-6 pb-6 text-center md:text-left text-body-sm text-warmCream-700">
            Created with love on {new Date(createdDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        )}

        {/* Interactive Signatures Component (if contributors exist) */}
        {contributors.length > 0 && (
          <div className="mb-8">
            <FooterSignatures contributors={contributors} />
          </div>
        )}

        {/* Copyright & Sub-footer */}
        <div className="border-t border-warmCream-300 pt-6 text-center text-xs text-warmCream-600 font-body">
          <p>© {currentYear} {APP_CONFIG.APP_NAME} • Made with 💛 by Naveen Agarwal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}