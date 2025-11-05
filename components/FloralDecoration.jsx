'use client'

import { motion } from 'framer-motion'

/**
 * Reusable floral decoration SVG component
 * @param {Object} props
 * @param {string} props.className - Additional classes
 * @param {number} props.size - Size in pixels (default 200)
 * @param {string} props.color - Color (default rosePetal)
 * @param {boolean} props.animate - Whether to animate (default true)
 */
export default function FloralDecoration({ 
  className = '', 
  size = 200, 
  color = '#D4859D',
  animate = true 
}) {
  const MotionSvg = animate ? motion.svg : 'svg'
  
  const animationProps = animate ? {
    initial: { scale: 0, rotate: -30 },
    animate: { scale: 1, rotate: -15 },
    transition: { duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }
  } : {}

  // ✅ FIX: Ensure size is a valid positive number
  const validSize = typeof size === 'number' && size > 0 ? size : 200

  return (
    <MotionSvg
      width={validSize}
      height={validSize}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...animationProps}
    >
      {/* Center circle */}
      <circle cx="100" cy="100" r="20" fill={color} opacity="0.9" />
      
      {/* ✅ FIX: All petals now have explicit numeric rx and ry values */}
      <ellipse cx="100" cy="60" rx={18} ry={35} fill={color} opacity="0.85" />
      <ellipse cx="140" cy="100" rx={35} ry={18} fill={color} opacity="0.85" />
      <ellipse cx="100" cy="140" rx={18} ry={35} fill={color} opacity="0.85" />
      <ellipse cx="60" cy="100" rx={35} ry={18} fill={color} opacity="0.85" />
      
      {/* ✅ FIX: Diagonal petals with explicit numeric values and proper transforms */}
      <ellipse cx="130" cy="70" rx={25} ry={15} fill={color} opacity="0.8" transform="rotate(45 130 70)" />
      <ellipse cx="130" cy="130" rx={25} ry={15} fill={color} opacity="0.8" transform="rotate(-45 130 130)" />
      <ellipse cx="70" cy="130" rx={25} ry={15} fill={color} opacity="0.8" transform="rotate(45 70 130)" />
      <ellipse cx="70" cy="70" rx={25} ry={15} fill={color} opacity="0.8" transform="rotate(-45 70 70)" />
    </MotionSvg>
  )
}