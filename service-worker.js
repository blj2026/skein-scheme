const CACHE_NAME = 'hue-queue-pwa-v8-cache-reset';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  // v68: network-first cache reset. Do not serve old cached app files.
  event.respondWith(
    fetch(request, { cache: 'no-store' }).catch(() => fetch(request).catch(() => caches.match(request)))
  );
});
