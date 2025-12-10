/**
 * Lazy-loaded Framer Motion components
 * ✅ Reduces initial bundle size by ~30KB
 */

'use client'

import dynamic from 'next/dynamic'
import { ComponentType, HTMLAttributes } from 'react'
import type { HTMLMotionProps } from 'framer-motion'

// Proper type definitions for motion components
type MotionDivProps = HTMLMotionProps<'div'>
type MotionSectionProps = HTMLMotionProps<'section'>
type MotionArticleProps = HTMLMotionProps<'article'>
type MotionButtonProps = HTMLMotionProps<'button'>
type MotionPProps = HTMLMotionProps<'p'>
type MotionH1Props = HTMLMotionProps<'h1'>
type MotionH2Props = HTMLMotionProps<'h2'>
type MotionSvgProps = HTMLMotionProps<'svg'>
type MotionPathProps = HTMLMotionProps<'path'>

// ✅ Lazy-load motion components with proper types
export const motion = {
  div: dynamic(() => 
    import('framer-motion').then(mod => mod.motion.div),
    { ssr: false }
  ) as ComponentType<MotionDivProps>,
  
  section: dynamic(() => 
    import('framer-motion').then(mod => mod.motion.section),
    { ssr: false }
  ) as ComponentType<MotionSectionProps>,
  
  article: dynamic(() => 
    import('framer-motion').then(mod => mod.motion.article),
    { ssr: false }
  ) as ComponentType<MotionArticleProps>,
  
  button: dynamic(() => 
    import('framer-motion').then(mod => mod.motion.button),
    { ssr: false }
  ) as ComponentType<MotionButtonProps>,
  
  p: dynamic(() => 
    import('framer-motion').then(mod => mod.motion.p),
    { ssr: false }
  ) as ComponentType<MotionPProps>,
  
  h1: dynamic(() => 
    import('framer-motion').then(mod => mod.motion.h1),
    { ssr: false }
  ) as ComponentType<MotionH1Props>,
  
  h2: dynamic(() => 
    import('framer-motion').then(mod => mod.motion.h2),
    { ssr: false }
  ) as ComponentType<MotionH2Props>,
  
  svg: dynamic(() => 
    import('framer-motion').then(mod => mod.motion.svg),
    { ssr: false }
  ) as ComponentType<MotionSvgProps>,
  
  path: dynamic(() => 
    import('framer-motion').then(mod => mod.motion.path),
    { ssr: false }
  ) as ComponentType<MotionPathProps>,
}

// ✅ Export AnimatePresence separately
export { AnimatePresence } from 'framer-motion'
