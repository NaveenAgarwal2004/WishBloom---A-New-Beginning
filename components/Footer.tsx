'use client'

import type { IContributor } from '@/models/WishBloom'
import FooterStats from '@/components/layout/FooterStats'
import FooterSignatures from '@/components/layout/FooterSignatures'

interface FooterProps {
  contributors: IContributor[]
  createdDate: string
}

/**
 * Footer Component
 * 
 * Production-ready footer with dynamic stats (client-side fetch) and interactive signatures
 * Refactored for Part 5 - Dynamic Footer Implementation
 * 
 * Architecture:
 * - FooterStats: Client component that fetches bloom count from API
 * - FooterSignatures: Client component with framer-motion animations
 */
export default function Footer({ contributors, createdDate }: FooterProps) {
  return (
    <footer className="relative bg-gradient-to-b from-warmCream-200 to-warmCream-300 border-t-2 border-fadedGold/30 py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-16 text-center md:text-left mb-16">
          {/* Left Column: Creation Info */}
          <div>
            <h4 className="text-h6 font-heading font-bold text-sepiaInk mb-4">
              Pressed & Preserved
            </h4>
            <p className="text-body-sm text-warmCream-700 font-body mb-2">
              Created with love on {new Date(createdDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <p className="text-body-sm text-warmCream-700 font-body mb-4">
              {contributors.length} heart{contributors.length !== 1 ? 's' : ''} contributed
            </p>
            
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-fadedGold" />
              <svg className="w-8 h-8 text-fadedGold" viewBox="0 0 32 32" aria-hidden="true">
                <circle cx="16" cy="16" r="4" fill="currentColor" />
                <ellipse cx="16" cy="10" rx="3" ry="5" fill="currentColor" opacity="0.8" />
                <ellipse cx="22" cy="16" rx="5" ry="3" fill="currentColor" opacity="0.8" />
                <ellipse cx="16" cy="22" rx="3" ry="5" fill="currentColor" opacity="0.8" />
                <ellipse cx="10" cy="16" rx="5" ry="3" fill="currentColor" opacity="0.8" />
              </svg>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-fadedGold" />
            </div>
          </div>

          {/* Center Column: Brand & Dynamic Stats */}
          <div className="text-center">
            <div className="flex items-center gap-3 justify-center mb-4">
              <svg className="w-10 h-10 text-pressedLeaf" viewBox="0 0 40 40" aria-hidden="true">
                <circle cx="20" cy="20" r="6" fill="currentColor" />
                <ellipse cx="20" cy="12" rx="5" ry="7" fill="currentColor" opacity="0.85" />
                <ellipse cx="28" cy="20" rx="7" ry="5" fill="currentColor" opacity="0.85" />
                <ellipse cx="20" cy="28" rx="5" ry="7" fill="currentColor" opacity="0.85" />
                <ellipse cx="12" cy="20" rx="7" ry="5" fill="currentColor" opacity="0.85" />
              </svg>
              <span className="text-h5 font-heading font-bold text-sepiaInk">WishBloom</span>
            </div>
            
            {/* ✅ Dynamic Stats - Client Component with API fetch */}
            <div className="mb-4">
              <FooterStats />
            </div>
          </div>

          {/* Right Column: Copyright */}
          <div className="text-center md:text-right">
            <p className="text-micro text-warmCream-600/70 font-body mb-2">
              © 2025 WISHBLOOM · MADE WITH 💛
            </p>
          </div>
        </div>

        {/* ✅ Interactive Signatures - Client Component */}
        <FooterSignatures contributors={contributors} />
      </div>
    </footer>
  )
}