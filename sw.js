const CACHE_VERSION = "v1.0.2";
const CACHE_NAME = `attrack-${CACHE_VERSION}`;

/* ---------- 1️⃣ INSTALL ---------- */
self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll([
        "./",
        "./index.html",
        "./manifest.json",
        "./icon-192.png",
        "./icon-512.png"
      ])
    )
  );
});

/* ---------- 2️⃣ ACTIVATE ---------- */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

/* ---------- 3️⃣ FETCH ---------- */
self.addEventListener("fetch", event => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match("./index.html")
    );
    return;
  }
});
