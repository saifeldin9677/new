'use strict';
// Tests for sw.js and index.html. Node only, no dependencies.
// Run from the project root:  node tests/unit/sw-and-index.test.js
// sw.js is loaded in an isolated vm context with a fake Cache Storage and a
// fake network, so its install, activate and fetch logic runs without a browser.
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var ROOT = path.resolve(__dirname, '..', '..');
var SW_SOURCE = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
var INDEX_HTML = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
var ORIGIN = 'https://site.test';

// ---------- tiny test harness ----------
var tests = [];

function test(name, fn) {
    tests.push({ name: name, fn: fn });
}

function assertEqual(actual, expected, label) {
    var a = JSON.stringify(actual);
    var e = JSON.stringify(expected);
    if (a !== e) {
        throw new Error((label || 'values differ') + ': expected ' + e + ' but got ' + a);
    }
}

function assertTrue(condition, label) {
    if (!condition) throw new Error(label);
}

function flush() {
    return new Promise(function(resolve) { setImmediate(resolve); });
}

async function runAll() {
    var passed = 0;
    var failed = 0;
    for (var i = 0; i < tests.length; i++) {
        var number = (i + 1 < 10 ? '0' : '') + (i + 1);
        try {
            await tests[i].fn();
            passed++;
            console.log('PASS ' + number + ' ' + tests[i].name);
        } catch (err) {
            failed++;
            console.log('FAIL ' + number + ' ' + tests[i].name);
            console.log('     ' + String(err && err.message ? err.message : err).split('\n')[0]);
        }
    }
    console.log('RESULT sw-and-index: ' + passed + ' passed, ' + failed + ' failed');
    process.exitCode = failed === 0 ? 0 : 1;
}

// ---------- fake service worker environment ----------
function fakeResponse(body, ok) {
    return {
        ok: ok !== false,
        body: body,
        clone: function() { return fakeResponse(body, ok); }
    };
}

function loadServiceWorker(options) {
    options = options || {};
    var handlers = {};
    var stores = {};
    var calls = { added: [] };
    var network = { offline: !!options.offline, bodies: {} };

    function toUrl(input) {
        return new URL(typeof input === 'string' ? input : input.url, ORIGIN + '/sw.js');
    }

    function lookup(list, input, ignoreSearch) {
        var wanted = toUrl(input);
        for (var i = 0; i < list.length; i++) {
            var entry = new URL(list[i].href);
            var same = ignoreSearch
                ? entry.origin + entry.pathname === wanted.origin + wanted.pathname
                : entry.href === wanted.href;
            if (same) return list[i].response;
        }
        return undefined;
    }

    function store(name, input, response) {
        var href = toUrl(input).href;
        stores[name] = (stores[name] || []).filter(function(entry) { return entry.href !== href; });
        stores[name].push({ href: href, response: response });
    }

    function makeCache(name) {
        return {
            add: function(url) {
                calls.added.push(url);
                if ((options.failAdd || []).indexOf(url) !== -1) {
                    return Promise.reject(new Error('add failed for ' + url));
                }
                store(name, url, fakeResponse('precached ' + url));
                return Promise.resolve();
            },
            put: function(request, response) {
                store(name, request, response);
                return Promise.resolve();
            }
        };
    }

    var cacheStorage = {
        open: function(name) {
            stores[name] = stores[name] || [];
            return Promise.resolve(makeCache(name));
        },
        keys: function() {
            return Promise.resolve(Object.keys(stores));
        },
        delete: function(name) {
            var existed = Object.prototype.hasOwnProperty.call(stores, name);
            delete stores[name];
            return Promise.resolve(existed);
        },
        match: function(input, matchOptions) {
            var ignoreSearch = !!(matchOptions && matchOptions.ignoreSearch);
            var names = Object.keys(stores);
            for (var i = 0; i < names.length; i++) {
                var hit = lookup(stores[names[i]], input, ignoreSearch);
                if (hit) return Promise.resolve(hit);
            }
            return Promise.resolve(undefined);
        }
    };

    var sandbox = {
        URL: URL,
        console: { log: function() {}, warn: function() {}, error: function() {} },
        caches: cacheStorage,
        fetch: function(request) {
            if (network.offline) return Promise.reject(new TypeError('offline'));
            var pathname = toUrl(request).pathname;
            if (Object.prototype.hasOwnProperty.call(network.bodies, pathname)) {
                return Promise.resolve(fakeResponse(network.bodies[pathname]));
            }
            return Promise.resolve(fakeResponse('', false));
        },
        self: {
            location: { origin: ORIGIN },
            skipWaiting: function() {},
            clients: { claim: function() { return Promise.resolve(); } },
            addEventListener: function(type, handler) { handlers[type] = handler; }
        }
    };
    var context = vm.createContext(sandbox);
    vm.runInContext(SW_SOURCE, context, { filename: 'sw.js' });

    function waitForEvent(type) {
        var waits = [];
        handlers[type]({ waitUntil: function(promise) { waits.push(promise); } });
        return Promise.all(waits);
    }

    return {
        calls: calls,
        readGlobal: function(name) {
            return JSON.parse(vm.runInContext('JSON.stringify(' + name + ')', context));
        },
        seed: function(cacheName, pathname, body) {
            store(cacheName, ORIGIN + pathname, fakeResponse(body));
        },
        setNetwork: function(pathname, body) {
            network.bodies[pathname] = body;
        },
        storeNames: function() {
            return Object.keys(stores).sort();
        },
        runInstall: function() { return waitForEvent('install'); },
        runActivate: function() { return waitForEvent('activate'); },
        dispatchFetch: async function(url, init) {
            init = init || {};
            var request = { url: url, method: init.method || 'GET', mode: init.mode || 'no-cors' };
            var pending = null;
            handlers.fetch({
                request: request,
                respondWith: function(promise) { pending = Promise.resolve(promise); }
            });
            if (!pending) return { handled: false };
            var response = await pending;
            await flush();
            return { handled: true, response: response };
        }
    };
}

function versionNumber(cacheName) {
    var match = /-v(\d+)$/.exec(cacheName);
    assertTrue(match !== null, 'no version number in ' + cacheName);
    return Number(match[1]);
}

function scriptSources() {
    var sources = [];
    var pattern = /<script[^>]*\ssrc="([^"]+)"/g;
    var match;
    while ((match = pattern.exec(INDEX_HTML)) !== null) {
        sources.push(match[1].split('?')[0]);
    }
    return sources;
}

// ---------- cache names and pre-cache list ----------
test('the three cache names carry one and the same version number', function() {
    var sw = loadServiceWorker();
    var names = ['LEPIDOS_CACHE_VERSION', 'LEPIDOS_CACHE_PRECACHE', 'LEPIDOS_CACHE_RUNTIME'].map(function(name) {
        return sw.readGlobal(name);
    });
    var numbers = names.map(versionNumber);
    assertTrue(numbers[0] === numbers[1] && numbers[1] === numbers[2], 'cache names disagree: ' + JSON.stringify(names));
});

test('the cache version is 40 or higher (the set of cached files changed)', function() {
    var name = loadServiceWorker().readGlobal('LEPIDOS_CACHE_VERSION');
    assertTrue(versionNumber(name) >= 40, 'cache version is ' + name + ' but must be lepidos-v40 or higher');
});

test('PRECACHE_URLS lists both shared engine files once and keeps the older entries', function() {
    var list = loadServiceWorker().readGlobal('PRECACHE_URLS');
    ['./shared/geo-engine.js', './shared/accounts-core.js'].forEach(function(url) {
        assertEqual(list.filter(function(item) { return item === url; }).length, 1, url + ' occurrences');
    });
    ['./', './index.html', './app.js', './data.js', './account-system.js', './firebase.js', './vendor/d3.min.js'].forEach(function(url) {
        assertTrue(list.indexOf(url) !== -1, 'no longer listed: ' + url);
    });
    assertEqual(list.length, new Set(list).size, 'number of duplicate entries');
});

// ---------- install and activate ----------
test('install pre-caches both shared engine files', async function() {
    var sw = loadServiceWorker();
    await sw.runInstall();
    assertTrue(sw.calls.added.indexOf('./shared/geo-engine.js') !== -1, 'geo-engine.js was not pre-cached');
    assertTrue(sw.calls.added.indexOf('./shared/accounts-core.js') !== -1, 'accounts-core.js was not pre-cached');
});

test('install still finishes when one pre-cache entry fails', async function() {
    var sw = loadServiceWorker({ failAdd: ['./boot.js'] });
    await sw.runInstall();
    assertTrue(sw.calls.added.indexOf('./index.html') !== -1, 'entries after the failing one were not attempted');
});

test('activate removes the old v39 caches, keeps the current ones and foreign caches', async function() {
    var sw = loadServiceWorker();
    var precache = sw.readGlobal('LEPIDOS_CACHE_PRECACHE');
    var runtime = sw.readGlobal('LEPIDOS_CACHE_RUNTIME');
    ['lepidos-v39', 'lepidos-precache-v39', 'lepidos-runtime-v39', precache, runtime, 'other-app-cache'].forEach(function(name) {
        sw.seed(name, '/x.js', 'x');
    });
    await sw.runActivate();
    var left = sw.storeNames();
    assertEqual(left.indexOf('lepidos-precache-v39'), -1, 'old precache cache is still present');
    assertEqual(left.indexOf('lepidos-runtime-v39'), -1, 'old runtime cache is still present');
    assertTrue(left.indexOf(precache) !== -1 && left.indexOf(runtime) !== -1, 'a current cache was deleted');
    assertTrue(left.indexOf('other-app-cache') !== -1, 'a foreign cache was deleted');
});

// ---------- fetch strategies ----------
test('shared engine files are network-first: the fresh copy wins', async function() {
    var files = ['/shared/geo-engine.js', '/shared/accounts-core.js'];
    for (var i = 0; i < files.length; i++) {
        var sw = loadServiceWorker();
        sw.seed(sw.readGlobal('LEPIDOS_CACHE_PRECACHE'), files[i], 'OLD');
        sw.setNetwork(files[i], 'NEW');
        var out = await sw.dispatchFetch(ORIGIN + files[i] + '?v=2026-11-19');
        assertEqual(out.handled, true, files[i] + ' handled');
        assertEqual(out.response.body, 'NEW', files[i] + ' response body');
    }
});

test('shared engine files fall back to the cached copy when offline', async function() {
    var sw = loadServiceWorker({ offline: true });
    sw.seed(sw.readGlobal('LEPIDOS_CACHE_PRECACHE'), '/shared/accounts-core.js', 'CACHED');
    var out = await sw.dispatchFetch(ORIGIN + '/shared/accounts-core.js?v=2026-11-19');
    assertEqual(out.response.body, 'CACHED', 'offline body');
});

test('controls: app.js stays network-first and a vendor file stays cache-first', async function() {
    var sw = loadServiceWorker();
    var precache = sw.readGlobal('LEPIDOS_CACHE_PRECACHE');
    sw.seed(precache, '/app.js', 'OLD APP');
    sw.setNetwork('/app.js', 'NEW APP');
    sw.seed(precache, '/vendor/d3.min.js', 'OLD D3');
    sw.setNetwork('/vendor/d3.min.js', 'NEW D3');
    var app = await sw.dispatchFetch(ORIGIN + '/app.js?v=1');
    assertEqual(app.response.body, 'NEW APP', 'app.js body');
    var d3 = await sw.dispatchFetch(ORIGIN + '/vendor/d3.min.js');
    assertEqual(d3.response.body, 'OLD D3', 'vendor body');
});

test('controls: other methods and foreign origins are ignored, navigation falls back offline', async function() {
    var sw = loadServiceWorker({ offline: true });
    sw.seed(sw.readGlobal('LEPIDOS_CACHE_PRECACHE'), '/index.html', 'SHELL');
    assertEqual((await sw.dispatchFetch(ORIGIN + '/app.js', { method: 'POST' })).handled, false, 'POST handled');
    assertEqual((await sw.dispatchFetch('https://example.org/x.js')).handled, false, 'foreign origin handled');
    var nav = await sw.dispatchFetch(ORIGIN + '/', { mode: 'navigate' });
    assertEqual(nav.response.body, 'SHELL', 'offline navigation body');
});

// ---------- index.html ----------
test('index.html loads shared/accounts-core.js once, with the new version tag', function() {
    var tags = INDEX_HTML.match(/<script[^>]*src="shared\/accounts-core\.js[^"]*"[^>]*>/g) || [];
    assertEqual(tags.length, 1, 'number of accounts-core script tags');
    assertEqual(tags[0], '<script src="shared/accounts-core.js?v=2026-11-19">', 'script tag');
});

test('index.html keeps the script order: firebase, boot, data, geo-engine, accounts-core, app, gate, account-system', function() {
    var wanted = ['firebase.js', 'boot.js', 'data.js', 'shared/geo-engine.js', 'shared/accounts-core.js',
                  'app.js', 'teacher-auth-gate.js', 'account-system.js'];
    var found = scriptSources().filter(function(src) { return wanted.indexOf(src) !== -1; });
    assertEqual(found, wanted, 'script order');
});

test('every local script tag in index.html is pre-cached by the service worker', function() {
    var list = loadServiceWorker().readGlobal('PRECACHE_URLS');
    var missing = scriptSources().filter(function(src) {
        return !/^(https?:)?\/\//.test(src) && list.indexOf('./' + src) === -1;
    });
    assertEqual(missing, [], 'scripts missing from PRECACHE_URLS');
});

runAll();
