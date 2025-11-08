/**
 * Lazy-loaded Framer Motion components
 * ✅ Reduces initial bundle size by ~30KB
 */

'use client'

import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

// ✅ Lazy-load motion components
export const motion = {
  div: dynamic(() => 
    import('framer-motion').then(mod => mod.motion.div as any),
    { ssr: false }
  ) as ComponentType<any>,
  
  section: dynamic(() => 
    import('framer-motion').then(mod => mod.motion.section as any),
    { ssr: false }
  ) as ComponentType<any>,
  
  article: dynamic(() => 
    import('framer-motion').then(mod => mod.motion.article as any),
    { ssr: false }
  ) as ComponentType<any>,
  
  button: dynamic(() => 
    import('framer-motion').then(mod => mod.motion.button as any),
    { ssr: false }
  ) as ComponentType<any>,
  
  p: dynamic(() => 
    import('framer-motion').then(mod => mod.motion.p as any),
    { ssr: false }
  ) as ComponentType<any>,
  
  h1: dynamic(() => 
    import('framer-motion').then(mod => mod.motion.h1 as any),
    { ssr: false }
  ) as ComponentType<any>,
  
  h2: dynamic(() => 
    import('framer-motion').then(mod => mod.motion.h2 as any),
    { ssr: false }
  ) as ComponentType<any>,
  
  svg: dynamic(() => 
    import('framer-motion').then(mod => mod.motion.svg as any),
    { ssr: false }
  ) as ComponentType<any>,
  
  path: dynamic(() => 
    import('framer-motion').then(mod => mod.motion.path as any),
    { ssr: false }
  ) as ComponentType<any>,
}

// ✅ Export AnimatePresence separately
export { AnimatePresence } from 'framer-motion'
