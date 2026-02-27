const CACHE_NAME = 'zt-guess-v1';
const assets = ['./', './index.html', 'https://unpkg.com/vue@3/dist/vue.global.js', 'https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(assets)));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
