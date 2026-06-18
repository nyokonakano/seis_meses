const CACHE = 'para-elis-v1';

const PRECACHE = [
  '.',
  'index.html',
  'manifest.json',
  'css/style.css',
  'css/animations.css',
  'css/responsive.css',
  'js/stars.js',
  'js/password.js',
  'js/counter.js',
  'js/album.js',
  'js/letters.js',
  'js/quiz.js',
  'js/future-letters.js',
  'js/finale.js',
  'js/navigation.js',
  'js/app.js',
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
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== location.origin) return;

  const isStatic = /\.(css|js|json|svg|woff2?)$/i.test(url.pathname);

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request).then(response => {
        if (isStatic && response.ok) {
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
