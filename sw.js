// QVLLEN BOOTH — Service Worker
// CACHE_VERSION değişince tüm eski cache silinir. Her deploy'da artır.
const CACHE_VERSION = 'v14';
const CACHE = 'qvllen-booth-' + CACHE_VERSION;
const BEATS_CACHE = 'qvllen-beats-v1';

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
];

// ── Install: skipWaiting → bekleme yok, anında devral ────────────────────────
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled(PRECACHE.map(url => cache.add(url)))
    )
  );
});

// ── Activate: eski cache'leri sil, tüm tabları devral ────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE && k !== BEATS_CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', e => {
  const { request } = e;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Beat library MP3'leri → Cache-First (lazy, immutable; precache'e dahil değil)
  if (url.pathname.includes('/assets/beats/')) {
    e.respondWith(
      caches.open(BEATS_CACHE).then(cache =>
        cache.match(request).then(cached => cached || fetch(request).then(res => {
          if (res.ok) cache.put(request, res.clone());
          return res;
        }).catch(() => cached || Response.error()))
      )
    );
    return;
  }

  // CDN & Google Fonts → Cache-First (değişmez içerik, versiyon sabit)
  if (
    url.hostname.endsWith('cdn.jsdelivr.net') ||
    url.hostname.endsWith('fonts.gstatic.com') ||
    url.hostname.endsWith('fonts.googleapis.com')
  ) {
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

  // App dosyaları → Network-First + HTTP cache bypass
  // cache:'no-store' → GitHub Pages CDN veya tarayıcı cache'i atlar
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
