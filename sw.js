const LEPIDOS_CACHE_VERSION = 'lepidos-v2';
const LEPIDOS_CACHE_PRECACHE = 'lepidos-precache-v2';
const LEPIDOS_CACHE_RUNTIME = 'lepidos-runtime-v2';

const PRECACHE_URLS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './data.js',
    './manifest.json',
    './admin-boundaries-data.json',
    './admin-name-translations.json',
    './icon-192.png',
    './icon-512.png'
];

const RUNTIME_ORIGINS = [
    'https://cdn.jsdelivr.net',
    'https://cdnjs.cloudflare.com',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.gstatic.com'
];

self.addEventListener('install', function(event) {
    self.skipWaiting();
    event.waitUntil(
        caches.open(LEPIDOS_CACHE_PRECACHE).then(function(cache) {
            return cache.addAll(PRECACHE_URLS);
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.filter(function(key) {
                    return key.startsWith('lepidos-') && key !== LEPIDOS_CACHE_PRECACHE && key !== LEPIDOS_CACHE_RUNTIME;
                }).map(function(key) {
                    return caches.delete(key);
                })
            );
        }).then(function() {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', function(event) {
    var request = event.request;
    if (request.method !== 'GET') return;

    var url = new URL(request.url);

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).then(function(response) {
                if (response && response.ok) return response;
                return caches.match('./index.html');
            }).catch(function() {
                return caches.match('./index.html');
            })
        );
        return;
    }

    var isSameOrigin = url.origin === self.location.origin;
    var isRuntime = RUNTIME_ORIGINS.indexOf(url.origin) !== -1;
    if (!isSameOrigin && !isRuntime) return;

    // App shell (own HTML/CSS/JS): network-first so deploys reach users
    // immediately; the cached copy is the offline fallback. The pre-cache
    // is refreshed on every successful fetch.
    var isAppShell = isSameOrigin && /(index\.html|style\.css|app\.js|data\.js|sw\.js)$/.test(url.pathname);
    if (isAppShell) {
        event.respondWith(
            fetch(request).then(function(response) {
                if (response && response.ok) {
                    var copy = response.clone();
                    caches.open(LEPIDOS_CACHE_PRECACHE).then(function(cache) {
                        cache.put(request, copy);
                    });
                }
                return response;
            }).catch(function() {
                return caches.match(request);
            })
        );
        return;
    }

    event.respondWith(
        caches.match(request).then(function(cached) {
            var refresh = fetch(request).then(function(response) {
                if (response && response.ok) {
                    var copy = response.clone();
                    var cacheName = isSameOrigin ? LEPIDOS_CACHE_PRECACHE : LEPIDOS_CACHE_RUNTIME;
                    caches.open(cacheName).then(function(cache) {
                        cache.put(request, copy);
                    });
                }
                return response;
            }).catch(function() {
                return cached;
            });
            return cached || refresh;
        })
    );
});
