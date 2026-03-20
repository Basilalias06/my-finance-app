const CACHE_NAME = 'fintrack-v2';
const STATIC_ASSETS = [
  'index.html',
  'Login.html',
  'Signup.html',
  'Offline.html',
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
  'manifest.json',
  'fintrack-data.js',
  'fintrack-sync.js',
  'fintrack-auth.js',
  'fintrack-ui.js',
  'fintrack-validation.js',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.protocol === 'chrome-extension:' || url.protocol === 'data:') return;

  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => event.request.mode === 'navigate' ? caches.match('Offline.html') : caches.match('MainMenu.html')))
    );
    return;
  }

  event.respondWith(
    fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match(event.request).then(cached => cached || caches.match('Offline.html')))
  );
});

self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(self.registration.showNotification(data.title || 'FinTrack', {
    body: data.body || '',
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-192.png',
    tag: data.tag || 'fintrack',
    data: { url: data.url || 'MainMenu.html' }
  }));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url || 'MainMenu.html'));
});
