const LEPIDOS_CACHE_VERSION = 'lepidos-v9';
const LEPIDOS_CACHE_PRECACHE = 'lepidos-precache-v9';
const LEPIDOS_CACHE_RUNTIME = 'lepidos-runtime-v9';

const PRECACHE_URLS = [
    './',
    './index.html',
    './style.css',
    './state.js',
    './i18n.js',
    './layers.js',
    './map-core.js',
    './quiz.js',
    './export.js',
    './ui.js',
    './main.js',
    './data.js',
    './manifest.json',
    './admin-boundaries-data.json',
    './admin-name-translations.json',
    './timezone-data.json',
    './countries-110m.json',
    './firebase.js',
    './boot.js',
    './icons.js',
    './vendor/d3.min.js',
    './vendor/d3-geo-projection.min.js',
    './vendor/topojson-client.min.js',
    './vendor/html2canvas.min.js',
    './vendor/jspdf.umd.min.js',
    './icon-192.png',
    './icon-512.png'
];

const RUNTIME_ORIGINS = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.gstatic.com'
];

// Best-effort install: a single missing URL must never stop the worker from
// activating, otherwise the OLD worker (with stale/broken assets) stays in charge.
self.addEventListener('install', function(event) {
    self.skipWaiting();
    event.waitUntil(
        Promise.all(
            PRECACHE_URLS.map(function(url) {
                return caches.open(LEPIDOS_CACHE_PRECACHE).then(function(cache) {
                    return cache.add(url).catch(function() {});
                });
            })
        )
    );
});

// Wipe every lepidos cache from any previous version, then take control.
// The CURRENT version's caches (just created during install) are kept so the
// app shell remains available offline; only stale caches from older
// deployments are removed. This guarantees the next load uses the freshly
// deployed files and can never be served stale/broken copies from an old cache.
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.filter(function(key) {
                    return key.indexOf('lepidos-') === 0 && key !== LEPIDOS_CACHE_PRECACHE && key !== LEPIDOS_CACHE_RUNTIME;
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

    // Same-origin assets (js, css, geodata) are network-first: the app must always
    // pick up the newest deployment instead of an old cached copy.
    if (isSameOrigin) {
        event.respondWith(
            fetch(request).then(function(response) {
                if (response && response.ok) {
                    var copy = response.clone();
                    caches.open(LEPIDOS_CACHE_RUNTIME).then(function(cache) {
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

    // Cross-origin runtime dependencies (fonts, firebase): cache-first, revalidate.
    event.respondWith(
        caches.match(request).then(function(cached) {
            var refresh = fetch(request).then(function(response) {
                if (response && response.ok) {
                    var copy = response.clone();
                    caches.open(LEPIDOS_CACHE_RUNTIME).then(function(cache) {
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