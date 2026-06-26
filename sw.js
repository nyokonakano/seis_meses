const CACHE = 'para-elis-v2';

const PRECACHE = [
  '.',
  'index.html',
  'manifest.json',
  'css/style.css',
  'css/animations.css',
  'css/responsive.css',
  'js/config.js',
  'js/stars.js',
  'js/password.js',
  'js/counter.js',
  'js/album.js',
  'js/letters.js',
  'js/quiz.js',
  'js/future-letters.js',
  'js/finale.js',
  'js/button-animations.js',
  'js/menu.js',
  'js/bottom-nav.js',
  'js/chapter-viewer.js',
  'js/animations.js',
  'js/app.js',
  'data/thoughts.json',
  'data/love-reasons.json',
  'assets/icons/heart.svg',
  'assets/icons/letter.svg',
  'assets/icons/lock.svg',
  'assets/icons/star.svg',
  'assets/icons/icon.svg',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  const isSameOrigin = url.origin === location.origin;
  const isGoogleFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  const isStatic = /\.(css|js|json|svg|woff2?|png|jpg|jpeg|webp|mp3)$/i.test(url.pathname);

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      if (!isSameOrigin && !isGoogleFont) return fetch(request);

      return fetch(request).then(response => {
        if ((isStatic || isGoogleFont) && response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => {
        if (url.pathname.endsWith('.mp3')) return new Response('', { status: 200 });
        return caches.match('index.html');
      });
    })
  );
});
