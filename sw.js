// QVLLEN BOOTH — Service Worker
// Güncelleme: CACHE_VERSION artırılınca tüm eski cache silinir, yeni içerik yüklenir
const CACHE_VERSION = 'v7';
const CACHE = 'qvllen-booth-' + CACHE_VERSION;

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  'https://cdn.jsdelivr.net/npm/@msgpack/msgpack@3/dist/msgpack.min.js',
];

// ── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', e => {
  self.skipWaiting(); // Beklemeden hemen devral — yeni SW anında aktif
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled(PRECACHE.map(url => cache.add(url)))
    )
  );
});

// ── Activate: Eski cache'leri sil, tüm tabları devral ────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', e => {
  const { request } = e;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // CDN & fonts → Cache-First (değişmez içerik)
  const isExternalStatic =
    url.hostname.endsWith('cdn.jsdelivr.net') ||
    url.hostname.endsWith('fonts.gstatic.com') ||
    url.hostname.endsWith('fonts.googleapis.com');

  if (isExternalStatic) {
    e.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(res => {
          if (res.ok) caches.open(CACHE).then(c => c.put(request, res.clone()));
          return res;
        });
      })
    );
    return;
  }

  // App dosyaları → Network-First (online'da her zaman taze, offline'da cache)
  e.respondWith(
    fetch(request, { cache: 'no-store' })
      .then(res => {
        if (res.ok) caches.open(CACHE).then(c => c.put(request, res.clone()));
        return res;
      })
      .catch(() =>
        caches.match(request).then(cached => cached || Response.error())
      )
  );
});
