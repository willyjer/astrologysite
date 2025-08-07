// Service Worker for AstroAnon - Performance Optimization
// Version 1.0.0

const CACHE_NAME = 'astroanon-v1';
const STATIC_CACHE_NAME = 'astroanon-static-v1';
const DYNAMIC_CACHE_NAME = 'astroanon-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/intro',
  '/birth-form',
  '/qualified-readings',
  // CSS files (Next.js generates these)
  '/_next/static/css/app/layout.css',
  // JS chunks (main application code)
  '/_next/static/chunks/main.js',
  '/_next/static/chunks/pages/_app.js',
  // Fonts
  '/favicon.svg',
  '/favicon.ico'
];

// API routes that should be cached with network-first strategy
const API_ROUTES = [
  '/api/timezone',
  '/api/astrology-chart'
];

// Maximum cache age for different types of resources
const CACHE_DURATION = {
  static: 24 * 60 * 60 * 1000, // 24 hours
  dynamic: 60 * 60 * 1000,     // 1 hour
  api: 30 * 60 * 1000          // 30 minutes
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
  
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete old cache versions
              return cacheName.startsWith('astroanon-') && 
                     !['astroanon-v1', 'astroanon-static-v1', 'astroanon-dynamic-v1'].includes(cacheName);
            })
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
  );
  
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and Chrome extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Handle different types of requests with appropriate strategies
  if (url.pathname.startsWith('/api/')) {
    // API requests: Network-first with cache fallback
    event.respondWith(handleApiRequest(request));
  } else if (url.pathname.startsWith('/_next/static/') || STATIC_ASSETS.includes(url.pathname)) {
    // Static assets: Cache-first with network fallback
    event.respondWith(handleStaticRequest(request));
  } else {
    // Pages: Stale-while-revalidate
    event.respondWith(handlePageRequest(request));
  }
});

// Network-first strategy for API requests
async function handleApiRequest(request) {
  const cacheName = DYNAMIC_CACHE_NAME;
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      // Cache successful responses
      const responseClone = networkResponse.clone();
      const cache = await caches.open(cacheName);
      cache.put(request, responseClone);
      return networkResponse;
    }
    
    // If network fails, try cache
    return await getCachedResponse(request, cacheName);
  } catch (error) {
    console.log('[SW] Network failed for API request, trying cache');
    return await getCachedResponse(request, cacheName);
  }
}

// Cache-first strategy for static assets
async function handleStaticRequest(request) {
  const cacheName = STATIC_CACHE_NAME;
  
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If not in cache, fetch from network and cache
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const responseClone = networkResponse.clone();
      const cache = await caches.open(cacheName);
      cache.put(request, responseClone);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Failed to handle static request:', error);
    return new Response('Asset not available offline', { status: 503 });
  }
}

// Stale-while-revalidate strategy for pages
async function handlePageRequest(request) {
  const cacheName = DYNAMIC_CACHE_NAME;
  
  try {
    // Serve from cache immediately if available
    const cachedResponse = await caches.match(request);
    
    // Always try to update cache in the background
    const networkPromise = fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          const cache = caches.open(cacheName);
          cache.then((c) => c.put(request, responseClone));
        }
        return networkResponse;
      })
      .catch((error) => {
        console.log('[SW] Background update failed:', error);
      });
    
    // Return cached version immediately if available, otherwise wait for network
    return cachedResponse || networkPromise;
  } catch (error) {
    console.error('[SW] Failed to handle page request:', error);
    return new Response('Page not available offline', { status: 503 });
  }
}

// Helper function to get cached response
async function getCachedResponse(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  return new Response('Resource not available offline', { 
    status: 503,
    statusText: 'Service Unavailable'
  });
}

// Background sync for form submissions (if supported)
if ('sync' in self.registration) {
  self.addEventListener('sync', (event) => {
    if (event.tag === 'birth-form-submission') {
      event.waitUntil(handleBackgroundSync());
    }
  });
}

async function handleBackgroundSync() {
  console.log('[SW] Handling background sync');
  // Implementation for offline form submission handling
  // This would be used for birth form submissions when offline
}

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[SW] Service worker loaded successfully');