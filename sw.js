const CACHE_VERSION = "v1.0.1";
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
/* ---------- 4️⃣ NOTIFICATIONS ---------- */

// Handle notification click (opens the app)
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then(clientList => {
      if (clientList.length > 0) return clientList[0].focus();
      return clients.openWindow("./");
    })
  );
});

// Example function to show a notification (can be called via Push API or logic)
function showReminder(title, body) {
  self.registration.showNotification(title, {
    body: body,
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    vibrate: [100, 50, 100]
  });
}
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});

