const CACHE_NAME = 'guess-game-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 1. 安裝階段：將資源存入快取
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('正在預先快取靜態資源');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // 強制讓等待中的 Service Worker 立即生效
  self.skipWaiting();
});

// 2. 激活階段：清理舊版本的快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('正在刪除舊快取:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. 攔截請求：優先從快取抓取資料，沒網路才抓線上版
self.addEventListener('fetch', (event) => {
  // 排除 Firebase 的 API 請求，只快取本地靜態資源
  if (event.request.url.includes('firebaseio.com') || event.request.url.includes('googleapis')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
