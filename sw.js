const CACHE_VERSION = "v5";
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
    event.respondWith(caches.match("./index.html"));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});

/* ---------- 4️⃣ NOTIFICATION CLICK ---------- */
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then(clientList => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow("./");
      })
  );
});

/* ---------- 5️⃣ OPTIONAL HELPER ---------- */
function showReminder(title, body) {
  return self.registration.showNotification(title, {
    body,
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    vibrate: [100, 50, 100]
  });
}
