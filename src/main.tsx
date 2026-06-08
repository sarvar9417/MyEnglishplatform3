import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { initTheme } from './utils/theme'
import { monitoring, setMonitoringProvider } from './lib/monitoring'
import { createSentryProvider, initSentry } from './lib/sentryProvider'

initTheme()

// Yangi deploy'dan keyin eski chunk preload xatosi bo'lsa — sahifani yangilaymiz
window.addEventListener('vite:preloadError', () => {
  const last = Number(sessionStorage.getItem('lastChunkReload') || 0)
  if (Date.now() - last > 10_000) {
    sessionStorage.setItem('lastChunkReload', String(Date.now()))
    window.location.reload()
  }
})

const dsn = import.meta.env.VITE_SENTRY_DSN
if (dsn && typeof dsn === 'string') {
  initSentry(dsn)
  setMonitoringProvider(createSentryProvider())
}

// ─── Register Service Worker (production only) ────────────────────────────
if ('serviceWorker' in navigator) {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Dev mode: unregister any existing service worker to avoid stale cache issues
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => reg.unregister())
    })
  } else {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        monitoring.captureMessage('Service worker registration failed', 'warn')
      })
    })
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
