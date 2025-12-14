'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, Lock, User, Sparkles, ArrowRight, CheckCircle } from 'lucide-react'
import { APP_CONFIG } from '@/config/constants'

/**
 * 🌸 WishBloom Sign-Up Page
 * Beautiful registration experience with email/password
 */
export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Handle sign-up submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Call signup API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to create account')
        setIsLoading(false)
        return
      }

      // Account created successfully
      setSuccess(true)

      // Automatically sign in the user
      setTimeout(async () => {
        await signIn('credentials', {
          email,
          password,
          callbackUrl: '/dashboard',
        })
      }, 1500)
    } catch {
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  // Handle Google OAuth sign-up
  const handleGoogleSignUp = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warmCream-50 via-rosePetal/10 to-lavenderMist/20 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mb-6"
          >
            <CheckCircle size={80} className="text-mossGreen mx-auto" />
          </motion.div>
          <h2 className="text-h2 font-heading font-bold text-sepiaInk mb-4">
            Welcome to WishBloom! 🌸
          </h2>
          <p className="text-body font-body text-warmCream-700 mb-2">
            Your account has been created successfully.
          </p>
          <p className="text-body-sm font-body text-warmCream-600">
            Signing you in...
          </p>
        </motion.div>
      </div>
    )
  }

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
        className="relative w-full max-w-md"
      >
        {/* Card Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-warmCream-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-fadedGold/20 to-rosePetal/20 p-8 text-center border-b border-warmCream-200">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-4"
            >
              <div className="text-6xl">🌸</div>
            </motion.div>
            <h1 className="text-h3 font-heading font-bold text-sepiaInk mb-2">
              Join {APP_CONFIG.APP_NAME}
            </h1>
            <p className="text-body font-body text-warmCream-700">
              Create an account to start preserving memories
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-body-sm font-body text-red-700 text-center">
                {error}
              </p>
            </motion.div>
          )}

          {/* Form */}
          <div className="p-8">
            {/* Google Sign-Up */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignUp}
              className="w-full mb-6 p-4 bg-white border-2 border-warmCream-300 rounded-xl 
                       hover:border-fadedGold hover:shadow-lg transition-all duration-300
                       flex items-center justify-center gap-3 font-heading font-semibold text-sepiaInk"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </motion.button>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-warmCream-300" />
              </div>
              <div className="relative flex justify-center text-caption">
                <span className="px-4 bg-white text-warmCream-600 font-body">or sign up with email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-body-sm font-heading font-semibold text-sepiaInk mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-warmCream-500" size={18} />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                    placeholder="Your Name"
                    className="w-full pl-11 pr-4 py-3 border-2 border-warmCream-300 rounded-xl
                             focus:border-fadedGold focus:outline-none focus:ring-2 focus:ring-fadedGold/20
                             disabled:opacity-50 disabled:cursor-not-allowed
                             font-body text-sepiaInk placeholder-warmCream-400
                             transition-all duration-200"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-body-sm font-heading font-semibold text-sepiaInk mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-warmCream-500" size={18} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    placeholder="your@email.com"
                    className="w-full pl-11 pr-4 py-3 border-2 border-warmCream-300 rounded-xl
                             focus:border-fadedGold focus:outline-none focus:ring-2 focus:ring-fadedGold/20
                             disabled:opacity-50 disabled:cursor-not-allowed
                             font-body text-sepiaInk placeholder-warmCream-400
                             transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-body-sm font-heading font-semibold text-sepiaInk mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-warmCream-500" size={18} />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    placeholder="At least 8 characters"
                    minLength={8}
                    className="w-full pl-11 pr-4 py-3 border-2 border-warmCream-300 rounded-xl
                             focus:border-fadedGold focus:outline-none focus:ring-2 focus:ring-fadedGold/20
                             disabled:opacity-50 disabled:cursor-not-allowed
                             font-body text-sepiaInk placeholder-warmCream-400
                             transition-all duration-200"
                  />
                </div>
                <p className="text-caption text-warmCream-600 mt-1 font-body">
                  Must be at least 8 characters long
                </p>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 p-4 bg-gradient-to-r from-fadedGold to-fadedGold/90
                         hover:from-fadedGold/90 hover:to-fadedGold
                         text-white font-heading font-bold rounded-xl
                         shadow-lg hover:shadow-xl
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-300
                         flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="animate-spin" size={20} />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={20} />
                  </>
                )}
              </motion.button>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-warmCream-50 p-6 text-center border-t border-warmCream-200">
            <p className="text-body-sm font-body text-warmCream-700">
              Already have an account?{' '}
              <Link
                href="/auth/signin"
                className="text-fadedGold hover:text-fadedGold/80 font-semibold underline transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <Link
            href="/"
            className="text-body-sm font-body text-warmCream-700 hover:text-sepiaInk transition-colors"
          >
            ← Back to home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}