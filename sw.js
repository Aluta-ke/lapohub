const CACHE_NAME = "lapohub-v1";
const PRECACHE = ["/", "/assets/lapo.css", "/assets/lapo.js", "/assets/logo.svg", "/favicon-192.png"];

self.addEventListener("install", function (event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function (cache) { return cache.addAll(PRECACHE); }));
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (key) { return key !== CACHE_NAME; }).map(function (key) { return caches.delete(key); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request).then(function (response) { return response; }).catch(function () {
      return caches.match(event.request).then(function (cached) { return cached || caches.match("/"); });
    })
  );
});
