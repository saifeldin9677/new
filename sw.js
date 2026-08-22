const LEPIDOS_CACHE_VERSION = 'lepidos-v4';
const LEPIDOS_CACHE_PRECACHE = 'lepidos-precache-v4';
const LEPIDOS_CACHE_RUNTIME = 'lepidos-runtime-v4';

const PRECACHE_URLS = [
    './',
    './index.html',
    './style.css',
    './boot.js',
    './app.js',
    './data.js',
    './firebase.js',
    './manifest.json',
    './admin-boundaries-data.json',
    './glaciated-areas-data.json',
    './admin-name-translations.json',
    './countries-110m.json',
    './icon-192.png',
    './icon-512.png',
    './vendor/d3.min.js',
    './vendor/d3-geo-projection.min.js',
    './vendor/topojson-client.min.js',
    './vendor/lucide.min.js',
    './vendor/html2canvas.min.js',
    './vendor/jspdf.umd.min.js',
    './fonts/fonts.css',
    './fonts/inter-cyrillic-ext.woff2',
    './fonts/inter-cyrillic.woff2',
    './fonts/inter-greek-ext.woff2',
    './fonts/inter-greek.woff2',
    './fonts/inter-latin-ext.woff2',
    './fonts/inter-latin.woff2',
    './fonts/inter-vietnamese.woff2',
    './fonts/noto-arabic.woff2',
    './fonts/noto-latin-ext.woff2',
    './fonts/noto-latin.woff2',
    './fonts/noto-math.woff2',
    './fonts/noto-symbols.woff2'
];

const RUNTIME_ORIGINS = [
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
                return caches.match(url.pathname).then(function(m) {
                    return m || caches.match(request);
                });
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
