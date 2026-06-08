import { monitoring } from './monitoring'

export function measureRenderTime(componentName: string): () => void {
  if (import.meta.env.PROD) return () => {}
  const start = performance.now()
  return () => {
    const duration = performance.now() - start
    if (duration > 100) {
      // eslint-disable-next-line no-console -- dev-only perf diagnostic (PROD da ishlamaydi)
      console.warn(`[Perf] ${componentName} rendered in ${duration.toFixed(1)}ms`)
    }
  }
}

export function reportWebVitals() {
  if ('performance' in window && 'getEntriesByType' in performance) {
    const paint = performance.getEntriesByType('paint')
    paint.forEach(entry => {
      monitoring.captureMessage(`Web Vital: ${entry.name} = ${entry.startTime.toFixed(1)}ms`, 'info')
    })
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const last = entries[entries.length - 1]
      monitoring.captureMessage(`LCP: ${last.startTime.toFixed(1)}ms`, 'info')
    })
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
    const fidObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        monitoring.captureMessage(`FID: ${(entry as PerformanceEventTiming).processingStart.toFixed(1)}ms`, 'info')
      })
    })
    fidObserver.observe({ type: 'first-input', buffered: true })
  }
}
