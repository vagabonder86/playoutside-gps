const CACHE_NAME = 'playoutside-gps-v1';
const ASSETS = [
  '/playoutside-gps/',
  '/playoutside-gps/index.html',
  '/playoutside-gps/logo.png',
  '/playoutside-gps/icon-192.png',
  '/playoutside-gps/icon-512.png',
  '/playoutside-gps/manifest.json'
];

// 설치 시 핵심 파일 캐시
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// 이전 버전 캐시 삭제
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// 네트워크 우선, 실패 시 캐시 사용
self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(e.request).catch(function() {
      return caches.match(e.request);
    })
  );
});
