/* global clients */
// ─── EnglishPath Service Worker ────────────────────────────────────────────
// Handles push notifications, offline caching, and App Shell.

const CACHE_NAME = 'englishpath-v3'
const STATIC_CACHE = 'englishpath-static-v1'
const API_CACHE = 'englishpath-api-v1'

// Assets to pre-cache during install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-512.png',
  '/apple-touch-icon.png',
  '/manifest.json',
]

// ─── Install: pre-cache critical assets ────────────────────────────────────

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch(() => {
        // Silently ignore failed pre-cache items (e.g., if offline on first install)
      })
    })
  )
  self.skipWaiting()
})

// ─── Activate: clean old caches ─────────────────────────────────────────────

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== STATIC_CACHE && key !== API_CACHE)
          .map((key) => caches.delete(key))
      )
    })
  )
  self.clients.claim()
})

// ─── Fetch strategy ────────────────────────────────────────────────────────

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip non-origin requests (CDN, Google Fonts, Supabase API, etc.)
  if (!url.origin.startsWith(self.location.origin)) {
    return
  }

  // Bypass cache in development (localhost) so Vite HMR works correctly
  if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') {
    return
  }

  // Skip Supabase API calls — they need fresh data
  if (url.pathname.startsWith('/api/')) {
    return handleApiRequest(event)
  }

  // Static assets (JS, CSS, images, fonts) — Cache First
  if (
    url.pathname.match(/\.(js|css|svg|png|jpg|jpeg|gif|webp|woff2?|ttf|eot|ico)$/) ||
    url.pathname.startsWith('/assets/')
  ) {
    return event.respondWith(cacheFirst(request, STATIC_CACHE))
  }

  // App Shell (HTML navigation) — Network First, fallback to cache
  if (request.mode === 'navigate' || url.pathname === '/') {
    return event.respondWith(networkFirst(request, CACHE_NAME))
  }

  // Everything else (API calls, etc.) — Network First
  event.respondWith(networkFirst(request, CACHE_NAME))
})

// ─── Cache strategies ──────────────────────────────────────────────────────

/**
 * Cache First — serve from cache, fetch in background for next time.
 * Ideal for static assets that rarely change.
 */
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request)
  if (cached) {
    // Fire-and-forget: update cache in background
    fetchAndCache(request, cacheName).catch(() => {})
    return cached
  }
  return fetchAndCache(request, cacheName)
}

/**
 * Network First — try network, fall back to cache.
 * Ideal for HTML pages and dynamic content.
 */
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request)
    if (response.status === 200) {
      const clone = response.clone()
      caches.open(cacheName).then((cache) => cache.put(request, clone)).catch(() => {})
    }
    return response
  } catch {
    const cached = await caches.match(request)
    if (cached) return cached
    // Offline fallback page
    if (request.mode === 'navigate') {
      const fallback = await caches.match('/')
      return fallback || new Response('Offline', { status: 503 })
    }
    return new Response('Offline', { status: 503 })
  }
}

/**
 * Fetch and cache a resource.
 */
async function fetchAndCache(request, cacheName) {
  const response = await fetch(request)
  if (response.status === 200) {
    const clone = response.clone()
    caches.open(cacheName).then((cache) => cache.put(request, clone)).catch(() => {})
  }
  return response
}

/**
 * API requests — stale-while-revalidate for GET, network-only for mutations.
 */
async function handleApiRequest(event) {
  const { request } = event
  const cached = await caches.match(request)

  const fetchPromise = fetch(request).then((response) => {
    if (response.status === 200) {
      const clone = response.clone()
      caches.open(API_CACHE).then((cache) => cache.put(request, clone)).catch(() => {})
    }
    return response
  }).catch(() => cached || new Response(JSON.stringify({ error: 'Offline' }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' },
  }))

  event.respondWith(cached || fetchPromise)
}

// ─── Notification click: open the app and navigate ─────────────────────────

self.addEventListener('notificationclick', (event) => {
  const notification = event.notification
  notification.close()

  const urlToOpen = notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          client.focus()
          if (client.navigate) client.navigate(urlToOpen)
          return
        }
      }
      if (clients.openWindow) {
        clients.openWindow(urlToOpen)
      }
    })
  )
})
