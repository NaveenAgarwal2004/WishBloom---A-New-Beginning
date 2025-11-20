'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertCircle, Home, ArrowLeft } from 'lucide-react'
import { APP_CONFIG } from '@/config/constants'

/**
 * 🌸 WishBloom Custom Error Page
 * Graceful error handling with WishBloom aesthetic
 */
export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  // Get user-friendly error messages
  const getErrorDetails = () => {
    switch (error) {
      case 'Configuration':
        return {
          title: 'Server Configuration Error',
          message: 'There is a problem with the server configuration.',
          suggestion: 'Please contact the administrator.',
        }
      case 'AccessDenied':
        return {
          title: 'Access Denied',
          message: 'You do not have permission to sign in.',
          suggestion: 'Please contact the administrator if you believe this is an error.',
        }
      case 'Verification':
        return {
          title: 'Verification Failed',
          message: 'The verification token has expired or has already been used.',
          suggestion: 'Please try signing in again.',
        }
      case 'OAuthSignin':
        return {
          title: 'OAuth Sign-In Error',
          message: 'Error occurred while trying to sign in with your OAuth provider.',
          suggestion: 'Please try again or use a different sign-in method.',
        }
      case 'OAuthCallback':
        return {
          title: 'OAuth Callback Error',
          message: 'Error occurred during the OAuth callback.',
          suggestion: 'Please try signing in again.',
        }
      case 'OAuthCreateAccount':
        return {
          title: 'Account Creation Error',
          message: 'Could not create an OAuth account.',
          suggestion: 'Please try again or contact support.',
        }
      case 'EmailCreateAccount':
        return {
          title: 'Email Account Creation Error',
          message: 'Could not create an account with this email.',
          suggestion: 'This email might already be in use.',
        }
      case 'Callback':
        return {
          title: 'Callback Error',
          message: 'Error occurred during the authentication callback.',
          suggestion: 'Please try signing in again.',
        }
      case 'OAuthAccountNotLinked':
        return {
          title: 'Account Not Linked',
          message: 'This email is already associated with another account.',
          suggestion: 'Please sign in using your original sign-in method.',
        }
      case 'EmailSignin':
        return {
          title: 'Email Sign-In Error',
          message: 'Unable to send the sign-in email.',
          suggestion: 'Please check your email address and try again.',
        }
      case 'CredentialsSignin':
        return {
          title: 'Invalid Credentials',
          message: 'The email or password you entered is incorrect.',
          suggestion: 'Please check your credentials and try again.',
        }
      case 'SessionRequired':
        return {
          title: 'Session Required',
          message: 'You need to be signed in to access this page.',
          suggestion: 'Please sign in to continue.',
        }
      default:
        return {
          title: 'Authentication Error',
          message: 'An unexpected error occurred during authentication.',
          suggestion: 'Please try again or contact support if the problem persists.',
        }
    }
  }

  const { title, message, suggestion } = getErrorDetails()

  return (
    <div className="min-h-screen bg-gradient-to-br from-warmCream-50 via-rosePetal/10 to-lavenderMist/20 flex items-center justify-center p-4">
      {/* Background Floral Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 bg-rosePetal rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-lavenderMist rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-lg"
      >
        {/* Card Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-warmCream-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-50 to-rosePetal/20 p-8 text-center border-b border-warmCream-200">
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-4 flex justify-center"
            >
              <div className="p-4 bg-red-100 rounded-full">
                <AlertCircle size={48} className="text-red-600" />
              </div>
            </motion.div>
            <h1 className="text-h3 font-heading font-bold text-sepiaInk mb-2">
              {title}
            </h1>
            <p className="text-body font-body text-warmCream-700">
              Something went wrong during authentication
            </p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Error Details */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-body font-body text-red-800 mb-2">
                <strong>What happened:</strong>
              </p>
              <p className="text-body-sm font-body text-red-700">
                {message}
              </p>
            </div>

            {/* Suggestion */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-body font-body text-blue-800 mb-2">
                <strong>What to do:</strong>
              </p>
              <p className="text-body-sm font-body text-blue-700">
                {suggestion}
              </p>
            </div>

            {/* Error Code (for debugging) */}
            {error && (
              <div className="text-center">
                <p className="text-caption font-mono text-warmCream-500">
                  Error code: {error}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Link
                  href="/auth/signin"
                  className="block w-full p-4 bg-gradient-to-r from-fadedGold to-fadedGold/90
                           hover:from-fadedGold/90 hover:to-fadedGold
                           text-white font-heading font-bold rounded-xl text-center
                           shadow-lg hover:shadow-xl
                           transition-all duration-300
                           flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={20} />
                  Try Again
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Link
                  href="/"
                  className="block w-full p-4 bg-white border-2 border-warmCream-300
                           hover:border-fadedGold hover:shadow-lg
                           text-sepiaInk font-heading font-bold rounded-xl text-center
                           transition-all duration-300
                           flex items-center justify-center gap-2"
                >
                  <Home size={20} />
                  Go Home
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-warmCream-50 p-6 text-center border-t border-warmCream-200">
            <p className="text-body-sm font-body text-warmCream-700">
              Need help?{' '}
              <a
                href="mailto:support@wishbloom.com"
                className="text-fadedGold hover:text-fadedGold/80 font-semibold underline transition-colors"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-body-sm font-body text-warmCream-600">
            {APP_CONFIG.APP_NAME} - {APP_CONFIG.APP_TAGLINE}
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
