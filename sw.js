// QVLLEN BOOTH — Service Worker
// Güncelleme: cache adını CACHE_VERSION ile artır
const CACHE_VERSION = 'v2';
const CACHE = 'qvllen-booth-' + CACHE_VERSION;

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  'https://cdn.jsdelivr.net/npm/@msgpack/msgpack@3/dist/msgpack.min.js',
];

// ── Install: App shell'i önceden cache'le ────────────────────────────────────
self.addEventListener('install', e => {
  self.skipWaiting(); // Hemen aktif ol, eski SW'yi bekletme
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      // allSettled: tek hata tüm cache işlemini iptal etmez
      Promise.allSettled(PRECACHE.map(url => cache.add(url)))
    )
  );
});

// ── Activate: Eski cache'leri temizle ────────────────────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys.filter(k => k !== CACHE).map(k => caches.delete(k))
        )
      )
      .then(() => self.clients.claim()) // Tüm open tab'ları anında kontrol al
  );
});

// ── Fetch: 3 katmanlı caching stratejisi ────────────────────────────────────
self.addEventListener('fetch', e => {
  const { request } = e;

  // Yalnızca GET isteklerini yönet
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 1. CDN & Google Fonts → Cache-First (değişmez içerik)
  const isExternalStatic =
    url.hostname.endsWith('cdn.jsdelivr.net') ||
    url.hostname.endsWith('fonts.gstatic.com') ||
    url.hostname.endsWith('fonts.googleapis.com');

  if (isExternalStatic) {
    e.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(res => {
          if (res.ok) {
            caches.open(CACHE).then(c => c.put(request, res.clone()));
          }
          return res;
        });
      })
    );
    return;
  }

  // 2. App HTML & assets → Network-First, cache fallback
  //    Güncellemeler anında kullanıcıya ulaşsın;
  //    çevrimdışıysa cache'ten sun
  e.respondWith(
    fetch(request)
      .then(res => {
        if (res.ok) {
          caches.open(CACHE).then(c => c.put(request, res.clone()));
        }
        return res;
      })
      .catch(() =>
        caches.match(request).then(cached => cached || Response.error())
      )
  );
});
