
const CACHE_NAME = 'task-timer-cache-v1.1'; // Increment version for updates
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx', // This will be the bundled JS in a production build
  '/assets/logoss.svg',
  // Add other static assets like CSS files if they are external
  // Add CDN URLs
  'https://cdn.tailwindcss.com',
  'https://esm.sh/react@^19.1.0/',
  'https://esm.sh/react@^19.1.0',
  'https://esm.sh/react-dom@^19.1.0/',
  'https://esm.sh/react-dom@^19.1.0/server'
  // Add other esm.sh imports if any become direct imports in HTML or other JS
];

// Install event: Cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Use addAll which fetches and caches.
        // For URLs that might fail (like CDNs if offline during first install),
        // consider caching them individually and not failing the whole install.
        // However, for core app functionality, these CDNs are critical.
        return cache.addAll(urlsToCache.map(url => new Request(url, { mode: 'cors' })))
          .catch(error => {
            console.error('Failed to cache one or more URLs during install:', error);
            // Optionally, re-throw to fail SW install if core assets didn't cache
            // throw error; 
          });
      })
  );
  self.skipWaiting(); // Activate new service worker immediately
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Take control of uncontrolled clients
});

// Fetch event: Serve from cache or fetch from network
self.addEventListener('fetch', event => {
  // Only handle GET requests for caching
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Cache hit - return response
        if (cachedResponse) {
          return cachedResponse;
        }

        // Not in cache - fetch from network
        return fetch(event.request).then(
          networkResponse => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
              return networkResponse;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        ).catch(error => {
          console.error('Fetch failed; returning offline page instead.', error);
          // Optionally, return a custom offline fallback page if specific assets fail.
          // For a single page app, if '/' (index.html) is cached, it should mostly work.
          // if (event.request.mode === 'navigate') {
          //   return caches.match('/'); // Return the main app shell
          // }
          // For other assets, just let the browser handle the error (e.g. broken image icon)
        });
      })
  );
});
