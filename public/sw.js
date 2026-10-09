// Service Worker for 100% Offline Capability
const CACHE_NAME = 'star-solutions-3d-v1';
const DYNAMIC_CACHE = 'star-solutions-dynamic-v1';

// Static assets to cache immediately upon installation
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/icons.svg',
  '/manifest.json'
];

// Install event: Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching core offline app shell');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== DYNAMIC_CACHE) {
            console.log('[SW] Deleting legacy cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: Cache-First strategy with Network Fallback & Dynamic Caching
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests or chrome-extension URLs
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') return;

  // Strategy for HTML documents: Network First, Fallback to Cache
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('/index.html');
          });
        })
    );
    return;
  }

  // Strategy for 3D Models (GLTF/BIN/Textures), Fonts, Audio, JS, CSS: Cache First, fallback to Network
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached asset immediately
        // Asynchronously update dynamic cache in background if online
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {/* Ignore network errors offline */});

        return cachedResponse;
      }

      // Not in cache: fetch from network and dynamically cache
      return fetch(request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
            // Still return opaque response for third-party CDNs like Google Fonts / GitHub GLTF
            if (networkResponse && (url.hostname.includes('github') || url.hostname.includes('gstatic') || url.hostname.includes('googleapis'))) {
              const responseClone = networkResponse.clone();
              caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, responseClone));
            }
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // If offline and request is an image or 3D asset, return fallback if available
          if (request.headers.get('accept')?.includes('image')) {
            return caches.match('/favicon.svg');
          }
        });
    })
  );
});
