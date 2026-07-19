const CACHE_NAME = 'caderneta-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/main.css',
  './css/theme.css',
  './css/components.css',
  './css/dashboard.css',
  './css/forms.css',
  './css/responsive.css',
  './src/core/config.js',
  './src/core/db.js',
  './src/core/store.js',
  './src/core/sync.js',
  './src/utils/format.js',
  './src/utils/id.js',
  './src/utils/validators.js',
  './src/features/accounts.js',
  './src/features/cards.js',
  './src/features/categories.js',
  './src/features/transactions.js',
  './src/features/budgets.js',
  './src/features/goals.js',
  './src/features/debts.js',
  './src/features/recurring.js',
  './src/features/reports.js',
  './src/ui/notifications.js',
  './src/ui/charts.js',
  './src/ui/components.js',
  './src/ui/dashboard.js',
  './src/app.js',
  './src/main.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then(response => {
    if (response) return response;
    return fetch(e.request).catch(() => { if (e.request.mode === 'navigate') return caches.match('./index.html'); });
  }));
});
