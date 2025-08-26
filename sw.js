/**
 * NexusRank Pro - FINAL Service Worker
 * Production-ready, no errors, supports offline & PWA
 */

const CACHE_NAME = 'nexusrank-pro-v2.0.0';
const API_CACHE_NAME = 'nexusrank-api-v2.0.0';

// ✅ Static files to cache
const STATIC_CACHE_FILES = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/manifest.json',
  '/sw.js',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/pages/about.html',
  '/pages/contact.html',
  '/pages/privacy.html',
  '/pages/terms.html',
  '/pages/cookie-policy.html'
];

// ✅ Cacheable API endpoints (non-AI)
const CACHEABLE_API_PATTERNS = [
  /\/health$/,
  /\/status$/
];

// Install event — cache static files
self.addEventListener('install', event => {
  console.log('[SW] Installing Service Worker v2.0.0');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_CACHE_FILES);
      })
      .then(() => {
        console.log('[SW] All static assets cached');
        return self.skipWaiting(); // Activate immediately
      })
      .catch(err => {
        console.error('[SW] Cache installation failed:', err);
      })
  );
});

// Activate event — clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating Service Worker v2.0.0');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME && key !== API_CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
  event.waitUntil(self.clients.claim()); // Take control immediately
});

// Fetch event — route requests
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET or chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Route requests
  if (isStaticResource(url)) {
    event.respondWith(handleStaticResource(request));
  } else if (isAPIRequest(url)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else {
    event.respondWith(fetch(request));
  }
});

// ✅ Is static resource?
function isStaticResource(url) {
  const pathname = url.pathname;
  return (
    pathname === '/' ||
    pathname.endsWith('.html') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.json') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.gif') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.woff') ||
    pathname.endsWith('.woff2') ||
    pathname.endsWith('.ttf')
  );
}

// ✅ Is API request?
function isAPIRequest(url) {
  return url.pathname.startsWith('/ai/') ||
         url.pathname.startsWith('/api/') ||
         url.pathname === '/health';
}

// ✅ Is navigation request?
function isNavigationRequest(request) {
  return request.mode === 'navigate' ||
         (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));
}

// ✅ Handle static resources (cache-first)
async function handleStaticResource(request) {
  try {
    const cached = await caches.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Static fetch failed:', error);
    throw error;
  }
}

// ✅ Handle API requests (network-first)
async function handleAPIRequest(request) {
  const url = new URL(request.url);

  // AI endpoints: always network
  if (url.pathname.startsWith('/ai/')) {
    try {
      return await fetch(request);
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: 'AI service unavailable. You are offline.',
        offline: true
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Health/status: cache with TTL
  if (CACHEABLE_API_PATTERNS.some(p => p.test(url.pathname))) {
    try {
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(API_CACHE_NAME);
        const headers = new Headers(response.headers);
        headers.set('sw-cache-timestamp', Date.now().toString());
        const cachedResponse = new Response(response.clone().body, {
          status: response.status,
          statusText: response.statusText,
          headers
        });
        cache.put(request, cachedResponse);
      }
      return response;
    } catch (error) {
      const cached = await caches.match(request);
      const timestamp = cached?.headers.get('sw-cache-timestamp');
      const age = Date.now() - parseInt(timestamp || '0');
      if (cached && age < 5 * 60 * 1000) {
        return cached;
      }
      throw error;
    }
  }

  return fetch(request);
}

// ✅ Handle navigation (network-first, fallback to cache)
async function handleNavigationRequest(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;

    const index = await caches.match('/index.html');
    if (index) return index;

    return new Response(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Offline - NexusRank Pro</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #000;
            color: #fff;
            text-align: center;
            padding: 2rem;
            margin: 0;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .offline-icon {
            font-size: 4rem;
            color: #00ffff;
          }
          h1 {
            color: #00ffff;
            margin: 1rem 0;
          }
          p {
            color: #cccccc;
            margin: 0 0 1.5rem;
          }
          .retry-btn {
            background: #00ffff;
            color: #000;
            border: none;
            padding: 1rem 2rem;
            border-radius: 8px;
            font-weight: bold;
            font-size: 1rem;
            cursor: pointer;
            transition: transform 0.2s;
          }
          .retry-btn:hover {
            transform: translateY(-2px);
          }
        </style>
      </head>
      <body>
        <div class="offline-container">
          <div class="offline-icon">🚀</div>
          <h1>You're Offline</h1>
          <p>Some features may not be available without internet.</p>
          <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
        </div>
      </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } });
  }
}

// ✅ Message handling (for app control)
self.addEventListener('message', event => {
  switch (event.data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'CLEAR_CACHE':
      caches.keys().then(keys => {
        keys.forEach(key => caches.delete(key));
      });
      break;
    default:
      console.log('[SW] Unknown message type:', event.data.type);
  }
});

console.log('[SW] Service Worker v2.0.0 loaded and ready');
