// Service Worker for Courier Connect PWA
// Handles offline caching, push notifications, and background sync

const CACHE_NAME = 'courier-connect-v1';
const urlsToCache = [
  '/',
  '/delivery',
  '/courier/jobs',
  '/manifest.json',
];

// Install event - cache static assets
globalThis.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
  // Activate immediately
  globalThis.skipWaiting();
});

// Activate event - clean up old caches
globalThis.addEventListener('activate', (event) => {
  const cacheWhitelist = new Set([CACHE_NAME]);

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.has(cacheName)) {
            return caches.delete(cacheName);
          }
          return undefined;
        })
      );
    })
  );
  // Take control of all pages immediately
  return globalThis.clients.claim();
});

// Fetch event - serve from cache, fallback to network
globalThis.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then((networkResponse) => {
          // Check if valid response
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          // Clone the response
          const responseToCache = networkResponse.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return networkResponse;
        });
      })
  );
});

// Push notification event
globalThis.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title || 'Courier Connect';
  const options = {
    body: data.body || 'You have a new notification',
    icon: data.icon || '/icon-192x192.png',
    badge: data.badge || '/badge-72x72.png',
    data: data.data || {},
    tag: data.tag || 'default',
    vibrate: [200, 100, 200],
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [
      { action: 'open', title: 'Open' },
      { action: 'close', title: 'Close' }
    ],
  };

  event.waitUntil(
    globalThis.registration.showNotification(title, options)
  );
});

// Notification click event
globalThis.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Open the app or focus existing window
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise, open a new window
        if (clients.openWindow) {
          const url = event.notification.data?.url || '/courier/jobs';
          return clients.openWindow(url);
        }
      })
  );
});
