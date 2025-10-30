/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        sepiaInk: '#7A5C47',
        fadedGold: '#D4A373',
        pressedLeaf: '#4A5F4C',
        burntSienna: '#A0522D',
        deepPlum: '#4A2C3B',
        warmCream: {
          50: '#FFFDF9',
          100: '#FBF7F0',
          200: '#F4EDE4',
          300: '#EBE0D3',
          400: '#DFD0BC',
          500: '#C9B79C',
          600: '#9B8B7E',
          700: '#6B5D52',
          800: '#4A3F37',
          900: '#2B2520',
        },
        rosePetal: '#D4859D',
        lavenderPress: '#A88BC7',
        driedSage: '#8FA582',
        sunsetAmber: '#E6A957',
        dustyIndigo: '#6B6B9B',
        fadedRose: '#C97B84',
        mossGreen: '#4A6741',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'Georgia', 'serif'],
        accent: ['var(--font-accent)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', '"Courier New"', 'monospace'],
      },
      fontSize: {
        'display': ['120px', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }],
        'h1': ['72px', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' }],
        'h2': ['56px', { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '600' }],
        'h3': ['40px', { lineHeight: '1.3', fontWeight: '600' }],
        'h4': ['32px', { lineHeight: '1.4', fontWeight: '500' }],
        'h5': ['24px', { lineHeight: '1.5', fontWeight: '500' }],
        'h6': ['20px', { lineHeight: '1.5', fontWeight: '600' }],
        'body-xl': ['22px', { lineHeight: '1.8' }],
        'body-lg': ['20px', { lineHeight: '1.8' }],
        'body': ['18px', { lineHeight: '1.8' }],
        'body-sm': ['16px', { lineHeight: '1.7' }],
        'caption': ['14px', { lineHeight: '1.6' }],
        'micro': ['10px', { lineHeight: '1.4', letterSpacing: '0.05em', textTransform: 'uppercase' }],
      },
      boxShadow: {
        'subtle': '0px 4px 12px rgba(43, 37, 32, 0.12), 0px 2px 6px rgba(43, 37, 32, 0.08)',
        'medium': '0px 8px 24px rgba(43, 37, 32, 0.16), 0px 4px 12px rgba(43, 37, 32, 0.12)',
        'high': '0px 16px 48px rgba(43, 37, 32, 0.24), 0px 8px 24px rgba(43, 37, 32, 0.16)',
        'dramatic': '0px 32px 64px rgba(43, 37, 32, 0.32), 0px 16px 32px rgba(43, 37, 32, 0.24)',
        'colored-rose': '0px 8px 24px rgba(201, 123, 132, 0.3)',
        'colored-gold': '0px 8px 24px rgba(212, 163, 115, 0.3)',
        'colored-green': '0px 8px 24px rgba(74, 103, 65, 0.3)',
        'colored-lavender': '0px 8px 24px rgba(168, 139, 199, 0.3)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'gentle-sway': {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        'float-up': {
          '0%': { transform: 'translateY(0) scale(0.8)', opacity: '0' },
          '10%': { opacity: '1', transform: 'translateY(-10vh) scale(1)' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-100vh) scale(1.1)', opacity: '0' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(60px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bloom-in': {
          '0%': { opacity: '0', transform: 'scale(0.7) rotate(-15deg)' },
          '60%': { transform: 'scale(1.05) rotate(2deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'gentle-sway': 'gentle-sway 4s ease-in-out infinite',
        'float-up': 'float-up 8s linear infinite',
        'fade-in-up': 'fade-in-up 0.8s ease-out',
        'bloom-in': 'bloom-in 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
      transitionTimingFunction: {
        'bloom': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'dramatic': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    }
  },
  plugins: [import("tailwindcss-animate")],
}
