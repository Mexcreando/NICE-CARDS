self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('flashcards-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/app.js',
        '/manifest.json',
        'images/icon-192x192.png',
        'images/icon-512x512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
