// PACA Protocol: Advanced Progressive Web App Service Worker
// Comprehensive offline functionality and intelligent caching

const CACHE_NAME = 'arkana-pwa-v1.0.0';
const STATIC_CACHE = 'arkana-static-v1.0.0';
const DYNAMIC_CACHE = 'arkana-dynamic-v1.0.0';
const API_CACHE = 'arkana-api-v1.0.0';

// Resources to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/_next/static/css/app.css',
  '/_next/static/js/app.js',
];

// API endpoints to cache with strategy
const API_ENDPOINTS = [
  '/api/waves/current',
  '/api/health',
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Network first, fallback to cache
  networkFirst: [
    '/api/',
    '/auth/',
  ],
  
  // Cache first, fallback to network
  cacheFirst: [
    '/_next/static/',
    '/static/',
    '/icons/',
    '/images/',
  ],
  
  // Stale while revalidate
  staleWhileRevalidate: [
    '/',
    '/features',
    '/pricing',
    '/beta',
  ],
  
  // Network only (no cache)
  networkOnly: [
    '/api/admin/',
    '/api/auth/',
    '/api/analytics/',
  ]
};

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName.startsWith('arkana-') && 
              ![CACHE_NAME, STATIC_CACHE, DYNAMIC_CACHE, API_CACHE].includes(cacheName)
            )
            .map(cacheName => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      // Take control of all pages immediately
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-HTTP requests
  if (!url.protocol.startsWith('http')) return;
  
  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') return;
  
  // Skip analytics and external requests
  if (url.hostname.includes('analytics') || 
      url.hostname.includes('gtag') ||
      url.hostname.includes('facebook') ||
      url.hostname.includes('google') ||
      !url.hostname.includes(self.location.hostname)) {
    return;
  }
  
  // Determine cache strategy
  const strategy = getCacheStrategy(url.pathname);
  
  switch (strategy) {
    case 'networkFirst':
      event.respondWith(networkFirst(request));
      break;
    case 'cacheFirst':
      event.respondWith(cacheFirst(request));
      break;
    case 'staleWhileRevalidate':
      event.respondWith(staleWhileRevalidate(request));
      break;
    case 'networkOnly':
      event.respondWith(networkOnly(request));
      break;
    default:
      event.respondWith(staleWhileRevalidate(request));
  }
});

// Cache strategy implementations
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline') || new Response('Offline', { status: 503 });
    }
    
    throw error;
  }
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed for cache-first resource:', error);
    throw error;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const networkPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(error => {
    console.log('[SW] Network failed for stale-while-revalidate:', error);
  });
  
  return cachedResponse || networkPromise;
}

async function networkOnly(request) {
  return fetch(request);
}

// Utility functions
function getCacheStrategy(pathname) {
  for (const [strategy, patterns] of Object.entries(CACHE_STRATEGIES)) {
    if (patterns.some(pattern => pathname.startsWith(pattern))) {
      return strategy;
    }
  }
  return 'staleWhileRevalidate';
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Sync any pending offline actions
    console.log('[SW] Performing background sync...');
    // Implementation would sync offline data
  } catch (error) {
    console.log('[SW] Background sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', event => {
  console.log('[SW] Push notification received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'New update from Arkana',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'arkana-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Open Arkana',
        icon: '/icons/action-open.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/action-dismiss.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Arkana', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', event => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      })
    );
  }
});

console.log('[SW] Service worker script loaded');