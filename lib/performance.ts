/**
 * Performance Monitoring Utilities
 * For tracking Web Vitals and custom metrics
 */

import { logger } from './logger'

export type Metric = {
  id: string
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  entries: PerformanceEntry[]
}

// Web Vitals thresholds
const THRESHOLDS = {
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
}

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS]
  if (!threshold) return 'good'

  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(metric: Metric) {
  const { name, value, rating, id } = metric

  logger.info(`Web Vital: ${name}`, {
    metric: name,
    value: Math.round(value),
    rating,
    id,
  })

  // Send to analytics service (e.g., Google Analytics, Vercel Analytics)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', name, {
      value: Math.round(value),
      metric_id: id,
      metric_value: value,
      metric_delta: metric.delta,
      metric_rating: rating,
    })
  }

  // Send to custom analytics endpoint
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/analytics/vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        value: Math.round(value),
        rating,
        id,
        timestamp: Date.now(),
      }),
    }).catch((err) => logger.error('Failed to send web vitals', err))
  }
}

/**
 * Track custom performance metrics
 */
export function measurePerformance(name: string, fn: () => void | Promise<void>) {
  const start = performance.now()

  const finish = () => {
    const duration = performance.now() - start
    logger.debug(`Performance: ${name}`, { duration: Math.round(duration) })

    // Mark as poor if over 1 second
    if (duration > 1000) {
      logger.warn(`Slow operation: ${name}`, { duration: Math.round(duration) })
    }
  }

  const result = fn()

  if (result instanceof Promise) {
    return result.finally(finish)
  } else {
    finish()
    return result
  }
}

/**
 * Get current performance metrics
 */
export function getPerformanceMetrics() {
  if (typeof window === 'undefined') return null

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  const paint = performance.getEntriesByType('paint')

  return {
    // Navigation timing
    dns: Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
    tcp: Math.round(navigation.connectEnd - navigation.connectStart),
    ttfb: Math.round(navigation.responseStart - navigation.requestStart),
    download: Math.round(navigation.responseEnd - navigation.responseStart),
    domInteractive: Math.round(navigation.domInteractive),
    domComplete: Math.round(navigation.domComplete),
    loadComplete: Math.round(navigation.loadEventEnd - navigation.loadEventStart),

    // Paint timing
    fcp: paint.find((entry) => entry.name === 'first-contentful-paint')?.startTime,
    
    // Resource timing
    resourceCount: performance.getEntriesByType('resource').length,
  }
}

/**
 * Monitor long tasks (>50ms)
 */
export function monitorLongTasks() {
  if (typeof window === 'undefined' || !(window as any).PerformanceObserver) return

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        logger.warn('Long task detected', {
          duration: Math.round(entry.duration),
          startTime: Math.round(entry.startTime),
        })
      }
    })

    observer.observe({ entryTypes: ['longtask'] })
  } catch (e) {
    // Long task API not supported
  }
}

/**
 * Monitor layout shifts (CLS)
 */
export function monitorLayoutShifts() {
  if (typeof window === 'undefined' || !(window as any).PerformanceObserver) return

  let clsValue = 0
  let clsEntries: PerformanceEntry[] = []

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          const firstSessionEntry = clsEntries[0]
          const lastSessionEntry = clsEntries[clsEntries.length - 1]

          if (
            clsEntries.length === 0 ||
            entry.startTime - lastSessionEntry.startTime < 1000
          ) {
            clsEntries.push(entry)
            clsValue += (entry as any).value
          } else {
            // New session
            clsEntries = [entry]
            clsValue = (entry as any).value
          }

          if (clsValue > 0.1) {
            logger.warn('High CLS detected', {
              value: clsValue.toFixed(4),
              entries: clsEntries.length,
            })
          }
        }
      }
    })

    observer.observe({ type: 'layout-shift', buffered: true })
  } catch (e) {
    // Layout shift API not supported
  }
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return

  // Monitor long tasks
  monitorLongTasks()

  // Monitor layout shifts
  monitorLayoutShifts()

  // Log performance metrics on page load
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const metrics = getPerformanceMetrics()
        if (metrics) {
          logger.info('Page performance metrics', metrics)
        }
      }, 0)
    })
  }
}