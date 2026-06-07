const CACHE_NAME = 'todo-v2'; // Make sure this is bumped!
const ASSETS = ['index.html', 'manifest.json'];

self.addEventListener('install', e => {
  // Forces the waiting service worker to become the active service worker immediately
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

// NEW SECTION: Cleans up old caches immediately when the version bumps
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // Forces the new service worker to take control immediately
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(response => response || fetch(e.request)));
});