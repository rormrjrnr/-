// 만시간의 노력 - 10,000시간·훈련 성장 일지 캐시
const CACHE = 'bodyguard-police-v07-effort-20261103';
const ASSETS = [
  './', './index.html', './manifest.webmanifest?v=effort-v07-20261103',
  './icon-192.png?v=effort-v07-20261103',
  './icon-512.png?v=effort-v07-20261103'
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(names => Promise.all(
      names.filter(name => name.startsWith('bodyguard-police-') && name !== CACHE)
        .map(name => caches.delete(name))
    )),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  // Always check the network first so a changed icon/manifest does not stay stale.
  event.respondWith(
    fetch(request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        event.waitUntil(caches.open(CACHE).then(cache => cache.put(request, copy)));
      }
      return response;
    }).catch(async () => (await caches.match(request)) || Response.error())
  );
});
