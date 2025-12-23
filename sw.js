const CACHE_NAME = "attrack-cache-v3"; // ⬅️ bump this on every release

/* ---------- 1️⃣ INSTALL ---------- */
self.addEventListener("install", event => {
  self.skipWaiting(); // ⬅️ activate immediately

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./manifest.json",
        "./icon-192.png",
        "./icon-512.png"
      ]);
    })
  );
});

/* ---------- 2️⃣ ACTIVATE (THIS IS THE MISSING PART) ---------- */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );

  self.clients.claim(); // ⬅️ take control of open tabs
});

/* ---------- 3️⃣ FETCH ---------- */
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

const CACHE_VERSION = "attrack-v1.0.1"; // 👈 bump when you update
const CACHE_NAME = `${CACHE_VERSION}-cache`;



