'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // TODO: Log to error tracking service (Sentry, LogRocket, etc.)
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI with WishBloom styling
      return (
        <div className="min-h-screen bg-warmCream-100 flex items-center justify-center px-4">
          <motion.div
            className="max-w-2xl w-full text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative pressed flower */}
            <motion.svg
              className="w-32 h-32 mx-auto mb-8 text-fadedRose opacity-60"
              viewBox="0 0 100 100"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: -15 }}
              transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <circle cx="50" cy="50" r="12" fill="currentColor" />
              {Array.from({ length: 6 }).map((_, i) => {
                const angle = (i * 360) / 6
                return (
                  <ellipse
                    key={i}
                    cx="50"
                    cy="30"
                    rx="8"
                    ry="16"
                    fill="currentColor"
                    opacity="0.8"
                    transform={`rotate(${angle} 50 50)`}
                  />
                )
              })}
            </motion.svg>

            <h1 className="text-h2 font-heading font-bold text-sepiaInk mb-4">
              Something Went Awry
            </h1>

            <p className="text-body-lg font-body text-warmCream-700 leading-loose mb-8">
              A petal has fallen from our collection. We're working to press it back into place.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-8 p-6 bg-warmCream-200 rounded-xl text-left max-w-xl mx-auto">
                <p className="text-body-sm font-mono text-burntSienna mb-2">
                  <strong>Error:</strong> {this.state.error.message}
                </p>
                <pre className="text-caption font-mono text-warmCream-700 overflow-auto max-h-48">
                  {this.state.error.stack}
                </pre>
              </div>
            )}

            <div className="flex gap-4 justify-center mt-8">
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-burntSienna text-warmCream-50 rounded-xl text-h6 font-heading font-semibold hover:shadow-colored-gold transition-all"
              >
                Refresh Page
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="px-8 py-4 bg-warmCream-300 text-warmCream-800 rounded-xl text-h6 font-heading font-semibold hover:bg-warmCream-400 transition-all"
              >
                Return Home
              </button>
            </div>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary