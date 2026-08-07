const CACHE_NAME = 'italiano-v9';

// App shell (HTML/CSS/JS): cambia seguido durante desarrollo activo. Network-first evita
// el problema recurrente de servir una versión vieja cacheada sin ningún error visible —
// si hay conexión, siempre se pide la versión fresca primero; el cache es solo el
// fallback para cuando no hay red.
const APP_SHELL = [
  '/index.html',
  '/manifest.json',
  '/css/style.css',
  '/js/app.js',
  '/js/srs.js',
  '/js/content.js',
];

// Estáticos: casi no cambian, cache-first está bien (no vale la pena red cada vez).
const STATIC_ASSETS = [
  '/',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll([...APP_SHELL, ...STATIC_ASSETS]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

function isAppShell(pathname) {
  return APP_SHELL.some(p => pathname === p || pathname.endsWith(p));
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  if (isAppShell(url.pathname)) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
