'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBreathDetection } from '@/hooks/useBreathDetection'
import { useAudio } from '@/context/AudioContext'

/**
 * CakeComponent with animated candles and flames
 * Supports both breath detection and manual blowing
 * @param {number} candleCount - Number of candles (default 25)
 * @param {function} onCandlesBlow - Callback when candles are blown out
 */
export default function CakeComponent({ candleCount = 25, onCandlesBlow }) {
  const [flamesLit, setFlamesLit] = useState(true)
  const [blowCount, setBlowCount] = useState(0)
  const [isShaking, setIsShaking] = useState(false)
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false)
  
  const { isBlowing, error, requestPermission, hasPermission, supported, simulateBlow } = useBreathDetection()
  const { playSound } = useAudio()

  // Limit candles to 10 for visual clarity
  const displayCandles = Math.min(candleCount, 10)
  const spacing = 140 / (displayCandles - 1)

  const handleBlow = () => {
    if (!flamesLit) {
      // Relight candles
      setFlamesLit(true)
      return
    }

    // Blow out candles
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 300)
    setFlamesLit(false)
    setBlowCount(prev => prev + 1)

    // Play sound effect
    playSound('candle-blow')

    // Call parent callback
    setTimeout(() => {
      if (onCandlesBlow) onCandlesBlow()
    }, 500)
  }

  // Handle breath detection
  useEffect(() => {
    if (isBlowing && flamesLit) {
      setTimeout(() => handleBlow(), 0)
    }
  }, [isBlowing, flamesLit])

  const handleEnableBreathDetection = async () => {
    setShowPermissionPrompt(false)
    await requestPermission()
  }

  return (
    <div className="relative max-w-2xl mx-auto">
      {/* Shake animation container */}
      <motion.div
        animate={isShaking ? {
          x: [-2, 2, -2, 2, 0],
          transition: { duration: 0.3 }
        } : {}}
      >
        {/* Cake SVG */}
        <svg
          viewBox="0 0 600 400"
          className="w-full h-auto drop-shadow-2xl"
        >
          {/* Flame gradient definition */}
          <defs>
            <linearGradient id="flameGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#E6A957" />
              <stop offset="50%" stopColor="#D4A373" />
              <stop offset="100%" stopColor="#FFFACD" />
            </linearGradient>
          </defs>

          {/* Plate/base */}
          <ellipse cx="300" cy="350" rx="200" ry="30" fill="#D4C0AB" opacity="0.6" />

          {/* Bottom layer */}
          <rect x="150" y="250" width="300" height="100" fill="#F4EDE4" stroke="#7A5C47" strokeWidth="3" rx="8" />
          {/* Frosting highlight */}
          <path d="M 150 250 Q 300 240, 450 250" fill="#E8D5C4" opacity="0.6" />
          {/* Frosting drips */}
          <path
            d="M 150 250 Q 170 260, 180 250 Q 200 260, 220 250 Q 240 260, 260 250 Q 280 260, 300 250 Q 320 260, 340 250 Q 360 260, 380 250 Q 400 260, 420 250 Q 440 260, 450 250"
            stroke="#D4A373"
            strokeWidth="4"
            fill="none"
          />

          {/* Middle layer */}
          <rect x="180" y="180" width="240" height="80" fill="#EBE0D3" stroke="#7A5C47" strokeWidth="3" rx="8" />
          {/* Frosting drips */}
          <path
            d="M 180 180 Q 200 190, 220 180 Q 240 190, 260 180 Q 280 190, 300 180 Q 320 190, 340 180 Q 360 190, 380 180 Q 400 190, 420 180"
            stroke="#D4A373"
            strokeWidth="3"
            fill="none"
          />

          {/* Top layer */}
          <rect x="210" y="120" width="180" height="70" fill="#F9F6F1" stroke="#7A5C47" strokeWidth="3" rx="8" />

          {/* Decorative pressed flowers on cake */}
          <circle cx="270" cy="300" r="14" fill="#D4859D" opacity="0.7" />
          <circle cx="330" cy="290" r="12" fill="#A88BC7" opacity="0.7" />
          <circle cx="220" cy="310" r="13" fill="#8FA582" opacity="0.7" />
          <circle cx="380" cy="305" r="12" fill="#E6A957" opacity="0.7" />
          <circle cx="300" cy="230" r="14" fill="#C97B84" opacity="0.7" />

          {/* Candles */}
          {Array.from({ length: displayCandles }).map((_, i) => {
            const xPos = 230 + i * spacing
            const randomFlicker = 0.2 + (i * 0.1) % 0.4

            return (
              <g key={i} transform={`translate(${xPos}, 90)`}>
                {/* Candle stick */}
                <rect x="-4" y="0" width="8" height="30" fill="#6B5D52" rx="2" />
                {/* Wick */}
                <line x1="0" y1="0" x2="0" y2="-5" stroke="#4A3F37" strokeWidth="1.5" />

                {/* Flame (if lit) */}
                {flamesLit && (
                  <AnimatePresence>
                    <motion.g
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.12 }}
                    >
                      {/* Main flame */}
                      <motion.ellipse
                        cx={0}
                        cy={-12}
                        rx={6}
                        ry={14}
                        fill="url(#flameGradient)"
                        animate={{
                          ry: [14, 16, 12, 15, 14],
                          opacity: [1, 0.9, 1, 0.95, 1],
                          rx: [6, 6.5, 5.5, 6.2, 6]
                        }}
                        transition={{
                          duration: 0.8 + randomFlicker,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                      />
                      {/* Inner glow */}
                      <motion.ellipse
                        cx={0}
                        cy={-10}
                        rx={3}
                        ry={6}
                        fill="#FFFACD"
                        opacity={0.8}
                        animate={{
                          ry: [6, 7, 5, 6.5, 6],
                          opacity: [0.8, 1, 0.7, 0.9, 0.8]
                        }}
                        transition={{
                          duration: 0.6 + randomFlicker,
                          repeat: Infinity
                        }}
                      />
                    </motion.g>
                  </AnimatePresence>
                )}

                {/* Smoke (if not lit) */}
                {!flamesLit && (
                  <AnimatePresence>
                    <motion.path
                      d="M0,-5 Q3,-20 0,-35 Q-3,-50 0,-65"
                      stroke="#9B8B7E"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{
                        pathLength: 1,
                        opacity: [0, 0.6, 0.4, 0],
                        y: [0, -20]
                      }}
                      transition={{
                        duration: 2.5,
                        delay: i * 0.08,
                        ease: 'easeOut'
                      }}
                    />
                  </AnimatePresence>
                )}
              </g>
            )
          })}
        </svg>
      </motion.div>

      {/* Blow Button */}
      <motion.button
        className={`mt-12 mx-auto block px-16 py-6 rounded-2xl text-h5 font-heading font-bold shadow-dramatic transition-all ${
          flamesLit
            ? 'bg-gradient-to-r from-burntSienna to-fadedGold text-warmCream-50'
            : 'bg-warmCream-300 text-warmCream-700'
        }`}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBlow}
      >
        {flamesLit ? '💨 Blow the Candles' : '🕯️ Relight & Wish Again'}
      </motion.button>

      {/* Breath Detection Toggle */}
      {!hasPermission && !error && supported && (
        <motion.button
          className="mt-4 mx-auto block px-8 py-3 rounded-xl text-body font-body bg-warmCream-200 text-warmCream-700 hover:bg-warmCream-300 transition-colors"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEnableBreathDetection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          🎤 Enable Breath Detection (Blow Into Mic!)
        </motion.button>
      )}

      {/* Breath Detection Status */}
      {hasPermission && (
        <motion.p
          className="text-caption font-body text-fadedGold text-center mt-3 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          ✨ Microphone active - Blow to extinguish candles!
        </motion.p>
      )}

      {/* Error Message */}
      {error && (
        <motion.p
          className="text-caption font-body text-burntSienna text-center mt-3 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}

      {/* Fallback simulate if mic unsupported */}
      {!supported && (
        <motion.button
          className="mt-4 mx-auto block px-8 py-3 rounded-xl text-body font-body bg-warmCream-200 text-warmCream-700 hover:bg-warmCream-300 transition-colors"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => simulateBlow()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          💨 Simulate Blow (No Microphone)
        </motion.button>
      )}

      {/* Success Message */}
      {!flamesLit && (
        <AnimatePresence>
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <h3 className="text-h3 font-heading font-bold text-fadedGold mb-2">
              ✨ Wish Granted! ✨
            </h3>
            <p className="text-body-lg font-accent italic text-warmCream-700">
              May all your dreams bloom
            </p>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Easter Egg Hint */}
      {blowCount >= 2 && blowCount < 3 && (
        <motion.p
          className="text-caption font-body text-warmCream-600 text-center mt-4 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          One more blow reveals something special...
        </motion.p>
      )}
    </div>
  )
}
