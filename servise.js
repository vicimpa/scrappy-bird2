self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open("v1-data")
      .then(function (cache) {
        const urlsToCache = ["/index.html", "/dist/index.js"];
        cache.addAll(urlsToCache);
      })
      .catch(console.warn)
  );
});

self.addEventListener("activate", event => {
  var cacheKeeplist = ["v1-data"];
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (cacheKeeplist.indexOf(key) === -1) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});