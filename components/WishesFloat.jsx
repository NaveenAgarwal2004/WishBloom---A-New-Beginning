'use client'

import { motion } from 'framer-motion'

/**
 * WishesFloat component - floats wishes up the screen
 * @param {string[]} wishes - Array of wish phrases
 */
export default function WishesFloat({ wishes }) {
  if (!wishes || wishes.length === 0) return null

  const colors = ['#7A5C47', '#D4A373', '#D4859D', '#A88BC7']

  return (
    <div className="fixed inset-0 pointer-events-none z-[90]" data-testid="wishes-active">
      {wishes.map((wish, i) => {
        const color = colors[i % colors.length]
        const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800

        return (
          <motion.div
            key={i}
            className="absolute whitespace-nowrap"
            style={{
              left: `${5 + (i % 3) * 30 + Math.random() * 15}%`,
              bottom: -100,
              color: color,
              textShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
            initial={{
              y: 0,
              opacity: 0,
              scale: 0.8,
              filter: 'blur(4px)',
            }}
            animate={{
              y: -windowHeight - 150,
              x: [0, Math.sin(i * 0.5) * 60, Math.sin(i * 0.5 + 2) * -40, 0],
              opacity: [0, 1, 1, 1, 0],
              scale: [0.8, 1, 1.05, 1, 0.9],
              filter: ['blur(4px)', 'blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(2px)'],
              rotate: [0, 5, -5, 3, 0],
            }}
            transition={{
              duration: 5,
              delay: i * 0.6,
              ease: 'linear',
              opacity: { times: [0, 0.15, 0.4, 0.85, 1] },
              scale: { times: [0, 0.2, 0.5, 0.8, 1] },
            }}
          >
            {/* Glow effect */}
            <div className="relative">
              <span className="absolute inset-0 blur-md opacity-50" style={{ color }}>
                {wish}
              </span>
              <span className="relative z-10 text-h5 font-accent italic font-semibold">
                {wish}
              </span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
