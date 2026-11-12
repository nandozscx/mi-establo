const CACHE_NAME = 'mi-establo-v5';
const APP_SHELL = ['./', './index.html', './manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Usa Promise.all con catch individual para que si un archivo falta, no rompa todo
      return Promise.all(
        APP_SHELL.map(url => cache.add(url).catch(() => null))
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Solo intercepta cuando el usuario recarga la app (navegación)
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('./index.html'))
    );
  }
  // Para imágenes, CSS y JS, deja que el navegador las maneje directamente (más rápido)
});