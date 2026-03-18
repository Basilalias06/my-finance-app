// FinTrack Service Worker v1.0
const CACHE_NAME = 'fintrack-v1';
const STATIC_ASSETS = [
  'MainMenu.html',
  'AllTransactions.html',
  'AddTransaction.html',
  'Accounts.html',
  'Reports.html',
  'Settings.html',
  'Goals.html',
  'Budgets.html',
  'Recurring.html',
  'Calendar.html',
  'DebtTracker.html',
  'SplitExpense.html',
  'Onboarding.html',
  'fintrack-data.js',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching static assets');
      // Cache local assets reliably; external CDN assets best-effort
      const localAssets = STATIC_ASSETS.filter(url => !url.startsWith('http'));
      const externalAssets = STATIC_ASSETS.filter(url => url.startsWith('http'));
      return cache.addAll(localAssets).then(() => {
        return Promise.allSettled(
          externalAssets.map(url =>
            cache.add(url).catch(err => console.warn('[SW] Could not cache:', url, err))
          )
        );
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => {
          console.log('[SW] Deleting old cache:', key);
          return caches.delete(key);
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch event - cache-first for local, network-first for remote
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip chrome-extension and data URLs
  if (url.protocol === 'chrome-extension:' || url.protocol === 'data:') return;

  // For local HTML/JS files: cache-first strategy
  if (url.origin === self.location.origin || !url.href.startsWith('http')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          }
          return response;
        }).catch(() => {
          // Return offline fallback for HTML requests
          if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match('MainMenu.html');
          }
        });
      })
    );
    return;
  }

  // For CDN resources: stale-while-revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(event.request).then(cached => {
        const fetchPromise = fetch(event.request).then(response => {
          if (response && response.status === 200) {
            cache.put(event.request, response.clone());
          }
          return response;
        }).catch(() => null);
        return cached || fetchPromise;
      })
    )
  );
});

// Background sync for offline transactions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-transactions') {
    console.log('[SW] Background sync: transactions');
    // Future: sync to remote backend
  }
});

// Push notifications
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  self.registration.showNotification(data.title || 'FinTrack', {
    body: data.body || '',
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-192.png',
    tag: data.tag || 'fintrack',
    data: { url: data.url || 'MainMenu.html' }
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || 'MainMenu.html')
  );
});
