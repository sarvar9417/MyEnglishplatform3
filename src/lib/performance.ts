import { monitoring } from './monitoring'

export function measureRenderTime(componentName: string): () => void {
  const start = performance.now()
  return () => {
    const duration = performance.now() - start
    if (duration > 100) {
      monitoring.captureMessage(`[Perf] ${componentName} rendered in ${duration.toFixed(1)}ms`, 'warn')
    }
  }
}

/** Track all Core Web Vitals — LCP, FID, CLS, FCP */
export function reportWebVitals() {
  if (typeof performance === 'undefined') return

  // FCP / FP
  if ('getEntriesByType' in performance) {
    const paint = performance.getEntriesByType('paint')
    paint.forEach(entry => {
      monitoring.captureMessage(`Web Vital: ${entry.name} = ${entry.startTime.toFixed(1)}ms`, 'info')
    })
  }

  // LCP (Largest Contentful Paint)
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const last = entries[entries.length - 1]
      monitoring.captureMessage(`LCP: ${last.startTime.toFixed(1)}ms`, 'info')
    })
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
  } catch { /* unsupported browser */ }

  // FID (First Input Delay)
  try {
    const fidObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        const delay = (entry as PerformanceEventTiming).processingStart - entry.startTime
        monitoring.captureMessage(`FID: ${delay.toFixed(1)}ms`, 'info')
      })
    })
    fidObserver.observe({ type: 'first-input', buffered: true })
  } catch { /* unsupported browser */ }

  // CLS (Cumulative Layout Shift)
  try {
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const clsEntry = entry as unknown as { hadRecentInput: boolean; value: number }
        if (!clsEntry.hadRecentInput) {
          clsValue += clsEntry.value
        }
      }
    })
    clsObserver.observe({ type: 'layout-shift', buffered: true })

    // Report final CLS when page visibility changes to hidden
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && clsValue > 0) {
        clsObserver.disconnect()
        monitoring.captureMessage(`CLS: ${clsValue.toFixed(3)}`, 'info', {
          clsEntries: 1,
          url: location.href,
        })
      }
    }, { once: true })
  } catch { /* unsupported browser */ }
}
