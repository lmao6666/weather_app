//pro práci offline a ukládání do cache

const CACHE_NAME = 'cache';
const cacheAssets = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/icon-192.png',
  '/icon-512.png'
];

const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

self.addEventListener('install', event => {
  console.log("Service Worker installed");
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Precaching static assets");
      return cache.addAll(cacheAssets); // Předcacheování souborů
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.url.startsWith(WEATHER_API_URL)) {
    // Cacheování API odpovědí
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return fetch(event.request)
          .then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
          .catch(() => {
            return cache.match(event.request).then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              } else {
                return new Response(JSON.stringify({
                  message: "Jste offline a nemáme žádná uložená data"
                }), {
                  headers: { 'Content-Type': 'application/json' }
                });
              }
            });
          });
      })
    );
  } else {
    // Pro jiné požadavky než API odpovídáme ze sítě nebo z cache
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});