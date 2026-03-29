const CACHE_NAME = 'temenos-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap'
];

// ── INSTALL ──────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE ─────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ── FETCH (offline-first for app shell) ──────────────────────────────
self.addEventListener('fetch', event => {
  // Don't intercept API calls
  if (event.request.url.includes('anthropic.com')) return;
  if (event.request.url.includes('fonts.googleapis.com')) return;

  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request)
        .then(response => {
          if (response && response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
      ).catch(() => caches.match('/index.html'))
  );
});

// ── NOTIFICATIONS ─────────────────────────────────────────────────────
self.addEventListener('message', event => {
  const { type, payload } = event.data || {};

  if (type === 'SCHEDULE_FAST_END') {
    const { endTime, cardName, moonName } = payload;
    const delay = endTime - Date.now();
    if (delay <= 0) return;

    // Schedule the fast-end notification
    setTimeout(() => {
      self.registration.showNotification('Temenos — Fast Complete', {
        body: `Your fast is complete. ${cardName} · ${moonName}`,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'fast-end',
        renotify: true,
        requireInteraction: true,
        actions: [
          { action: 'open', title: 'Open Temenos' }
        ],
        data: { url: '/' }
      });
    }, delay);
  }

  if (type === 'SCHEDULE_FAST_START') {
    const { startTime, cardName, moonName } = payload;
    const delay = startTime - Date.now();
    if (delay <= 0) return;

    setTimeout(() => {
      self.registration.showNotification('Temenos — Fast begins', {
        body: `The fast window opens. ${cardName} · ${moonName}`,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'fast-start',
        renotify: true,
        data: { url: '/' }
      });
    }, delay);
  }

  if (type === 'NOTIFY_NOW') {
    const { title, body } = payload;
    self.registration.showNotification(title, {
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'temenos-now',
      data: { url: '/' }
    });
  }
});

// ── NOTIFICATION CLICK ────────────────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow('/');
      })
  );
});
