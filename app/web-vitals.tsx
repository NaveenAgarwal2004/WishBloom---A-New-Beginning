'use client'

import { useEffect } from 'react'
import { getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals'
import { reportWebVitals } from '@/lib/performance'

export function WebVitals() {
  useEffect(() => {
    // Track all Web Vitals
    getCLS(reportWebVitals)
    getFCP(reportWebVitals)
    getFID(reportWebVitals)
    getLCP(reportWebVitals)
    getTTFB(reportWebVitals)
  }, [])

  return null
}