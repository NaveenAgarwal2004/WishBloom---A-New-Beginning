import React from 'react';

export type LogoVariant = 'editorial' | 'blossom' | 'modern' | 'vintage';

interface LogoProps {
  className?: string;
  variant?: LogoVariant;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({
  className = '',
  variant = 'editorial',
  size = 'md',
}: LogoProps) {
  // Dimensions
  const sizes = {
    sm: { icon: 20, text: 'text-base' },
    md: { icon: 26, text: 'text-xl' },
    lg: { icon: 34, text: 'text-2xl' },
  };

  const currentSize = sizes[size];

  // VARIANT 1: EDITORIAL LUXURY (Paperless Post / Kinfolk vibe)
  // Single-line art wildflower + Uppercase wide tracking
  if (variant === 'editorial') {
    return (
      <div className={`flex items-center gap-3 group select-none ${className}`}>
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-sepiaInk group-hover:scale-105 transition-transform duration-300"
        >
          {/* Continuous Line Art Wildflower */}
          <path
            d="M16 29C16 22 15 15 16 11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M16 11C14 7 10 7 10 10.5C10 14 16 14 16 11Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M16 11C18 7 22 7 22 10.5C22 14 16 14 16 11Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M16 11C14.5 5 17.5 3 19 4.5C20.5 6 18 10 16 11Z"
            stroke="#D4AF37"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M15.5 19C12 18 10 15 11.5 14C13 13 15 16.5 15.5 18.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M16.5 16C20 15 22 12 20.5 11C19 10 17 13.5 16.5 15.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="16" cy="11" r="1.5" fill="#D4AF37" />
        </svg>
        <span className="font-heading font-semibold tracking-[0.22em] uppercase text-sepiaInk text-sm sm:text-base">
          Wish<span className="font-normal text-amber-700">Bloom</span>
        </span>
      </div>
    );
  }

  // VARIANT 2: BLOSSOM MONOGRAM (Geometric Minimalist Organic)
  // Four-petal geometry + Bold Title Case Kerning
  if (variant === 'blossom') {
    return (
      <div className={`flex items-center gap-2.5 group select-none ${className}`}>
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="group-hover:rotate-45 transition-transform duration-500 ease-out"
        >
          {/* 4 Organic Petals around golden core */}
          <circle cx="16" cy="9" r="5" fill="#E8C5C5" fillOpacity="0.8" />
          <circle cx="16" cy="23" r="5" fill="#E8C5C5" fillOpacity="0.8" />
          <circle cx="9" cy="16" r="5" fill="#D9A0A0" fillOpacity="0.8" />
          <circle cx="23" cy="16" r="5" fill="#D9A0A0" fillOpacity="0.8" />
          {/* Inner accent diamond */}
          <rect
            x="13"
            y="13"
            width="6"
            height="6"
            rx="1"
            transform="rotate(45 16 16)"
            fill="#5C5346"
          />
          <circle cx="16" cy="16" r="2" fill="#D4AF37" />
        </svg>
        <span className={`font-heading font-bold ${currentSize.text} tracking-tight text-sepiaInk`}>
          WishBloom<span className="text-amber-600 text-xs inline-block align-top ml-0.5">✦</span>
        </span>
      </div>
    );
  }

  // VARIANT 3: MODERN MINIMALIST SANS & BOTANICAL (Clean Tech-Indie)
  // Clean Lotus Bud + Modern Sans/Serif Hybrid
  if (variant === 'modern') {
    return (
      <div className={`flex items-center gap-2.5 group select-none ${className}`}>
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="group-hover:scale-110 transition-transform duration-300"
        >
          {/* Sleek Lotus/Tulip Bud Outline */}
          <path
            d="M16 6C16 6 10 12 10 19C10 23.5 12.5 26 16 26C19.5 26 22 23.5 22 19C22 12 16 6 16 6Z"
            stroke="#5C5346"
            strokeWidth="1.75"
            fill="#FDFBF7"
          />
          <path
            d="M16 6C16 6 19 13 16 21C13 13 16 6 16 6Z"
            fill="#C98B8B"
            fillOpacity="0.5"
            stroke="#8B5E3C"
            strokeWidth="1.25"
          />
          <circle cx="16" cy="20" r="1.5" fill="#D4AF37" />
        </svg>
        <span className="font-heading font-bold text-xl sm:text-2xl tracking-tight text-sepiaInk">
          Wish<span className="font-light text-warmCream-800">bloom</span>
        </span>
      </div>
    );
  }

  // VARIANT 4: VINTAGE PRESSED FLORAL (Classic Scrapbook)
  // Detailed floral flourish + Classic Serif
  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      <svg
        width={currentSize.icon}
        height={currentSize.icon}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="group-hover:scale-105 transition-transform duration-300"
      >
        <path
          d="M16 27V12M16 12C14 9 10 9 9 11.5C8 14 12 15.5 16 12ZM16 12C18 9 22 9 23 11.5C24 14 20 15.5 16 12ZM16 12C16 8 13.5 5 16 4C18.5 5 16 8 16 12Z"
          stroke="#8B5E3C"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="16" cy="12" r="2" fill="#D4AF37" />
        <path
          d="M16 20C12 19 10 17 12 16C14 15 16 18 16 20Z"
          fill="#8A9A7B"
          fillOpacity="0.6"
          stroke="#5C6B4D"
          strokeWidth="1.2"
        />
      </svg>
      <span className="font-heading text-xl sm:text-2xl tracking-tight text-sepiaInk">
        <span className="font-bold">Wish</span>
        <span className="font-normal italic text-amber-800 ml-0.5">Bloom</span>
      </span>
    </div>
  );
}
