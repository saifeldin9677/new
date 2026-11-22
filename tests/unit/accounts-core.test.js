'use strict';
// Unit tests for shared/accounts-core.js. Node only, no dependencies.
// Run from the project root:  node tests/unit/accounts-core.test.js
// The module is loaded in an isolated vm context with a fake clock, so the
// 6 second Firebase wait is tested instantly and deterministically.
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var ROOT = path.resolve(__dirname, '..', '..');
var MODULE_PATH = path.join(ROOT, 'shared', 'accounts-core.js');
var SOURCE = fs.readFileSync(MODULE_PATH, 'utf8');

// ---------- tiny test harness ----------
var tests = [];

function test(name, fn) {
    tests.push({ name: name, fn: fn });
}

function assertEqual(actual, expected, label) {
    // JSON comparison on purpose: objects created inside the vm context have a
    // different prototype than objects created in this file.
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
    console.log('RESULT accounts-core: ' + passed + ' passed, ' + failed + ' failed');
    process.exitCode = failed === 0 ? 0 : 1;
}

// ---------- fake clock ----------
function makeClock(options) {
    var useHandleObjects = !!(options && options.handleObjects);
    var now = 1000000;
    var nextId = 1;
    var timers = [];
    var clock = {
        scheduled: 0,
        unrefCalls: 0,
        now: function() { return now; },
        setTimeout: function(fn, ms) {
            var id = nextId++;
            clock.scheduled++;
            timers.push({ id: id, at: now + (ms || 0), fn: fn });
            if (!useHandleObjects) return id;
            return { id: id, unref: function() { clock.unrefCalls++; } };
        },
        clearTimeout: function() {},
        advance: async function(ms) {
            var target = now + ms;
            await flush();
            for (;;) {
                timers.sort(function(a, b) { return (a.at - b.at) || (a.id - b.id); });
                if (timers.length === 0 || timers[0].at > target) break;
                var timer = timers.shift();
                if (timer.at > now) now = timer.at;
                timer.fn();
                await flush();
            }
            now = target;
            await flush();
        }
    };
    return clock;
}

// ---------- module under test ----------
function loadCore(clock) {
    var sandbox = {
        console: { log: function() {}, warn: function() {}, error: function() {} },
        setTimeout: clock.setTimeout,
        clearTimeout: clock.clearTimeout,
        Date: { now: clock.now }
    };
    var context = vm.createContext(sandbox);
    vm.runInContext(SOURCE, context, { filename: 'shared/accounts-core.js' });
    return context.LepidosAccounts;
}

function makeHost(clock) {
    var host = {
        bindCount: 0,
        authCallback: null,
        makeFirebaseAvailable: function() {
            host.firebaseOnAuthChange = function(callback) {
                host.bindCount++;
                host.authCallback = callback;
                return function unsubscribe() {};
            };
        },
        firebaseAppearsAfter: function(ms) {
            clock.setTimeout(function() { host.makeFirebaseAvailable(); }, ms);
        },
        fire: async function(authUser) {
            if (!host.authCallback) throw new Error('the module never called firebaseOnAuthChange');
            await host.authCallback(authUser);
        }
    };
    return host;
}

function profileFor(user) {
    return async function() { return { ok: true, user: user, org: null }; };
}

// A core that already has Firebase and a signed-in user with the given profile.
async function signedInCore(user) {
    var clock = makeClock();
    var host = makeHost(clock);
    host.makeFirebaseAvailable();
    host.firebaseAccountGetProfile = profileFor(user);
    var core = loadCore(clock).createInstance(host);
    var ready = core.whenReady();
    await clock.advance(0);
    await host.fire({ uid: user.uid });
    await ready;
    return core;
}

// A core with a fake clock and a host where Firebase is NOT available yet.
function newSession(clockOptions) {
    var clock = makeClock(clockOptions);
    var host = makeHost(clock);
    host.firebaseAccountGetProfile = profileFor({ uid: 'u1', role: 'teacher' });
    var core = loadCore(clock).createInstance(host);
    return { clock: clock, host: host, core: core };
}

var ROLE_ORDER = ['student', 'teacher', 'itStaff', 'admin', 'superAdmin'];

// ---------- API and hasRole ----------
test('module loads with require() in Node and exposes the public API', function() {
    var api = require(MODULE_PATH);
    ['createInstance', 'whenReady', 'getCurrentUser', 'getInstitution', 'hasRole', 'requireRole',
     'onAuthChange', 'getTeacherStudents', 'isExpiredDemo', 'signOut', 'refresh'].forEach(function(name) {
        assertEqual(typeof api[name], 'function', 'api.' + name);
    });
});

test('hasRole is false for every role when nobody is signed in', function() {
    var clock = makeClock();
    var core = loadCore(clock).createInstance(makeHost(clock));
    assertEqual(core.hasRole('student'), false, 'student');
    assertEqual(core.hasRole('teacher'), false, 'teacher');
    assertEqual(core.hasRole(['superAdmin', 'student']), false, 'array');
});

test('hasRole: a higher known role passes every lower gate (itStaff and admin pass teacher)', async function() {
    for (var i = 0; i < ROLE_ORDER.length; i++) {
        var core = await signedInCore({ uid: 'u' + i, role: ROLE_ORDER[i] });
        for (var j = 0; j < ROLE_ORDER.length; j++) {
            assertEqual(core.hasRole(ROLE_ORDER[j]), i >= j, ROLE_ORDER[i] + ' asking for ' + ROLE_ORDER[j]);
        }
    }
});

test('hasRole: a legacy standalone teacher passes the teacher gate but not itStaff', async function() {
    var core = await signedInCore({ uid: 'L1', role: 'student', isLegacyStandaloneTeacher: true });
    assertEqual(core.hasRole('teacher'), true, 'teacher');
    assertEqual(core.hasRole('student'), true, 'student');
    assertEqual(core.hasRole('itStaff'), false, 'itStaff');
});

test('hasRole: an array passes when any known role in it is satisfied', async function() {
    var core = await signedInCore({ uid: 't1', role: 'teacher' });
    assertEqual(core.hasRole(['admin', 'teacher']), true, 'admin or teacher');
    assertEqual(core.hasRole(['admin', 'superAdmin']), false, 'admin or superAdmin');
    assertEqual(core.hasRole([]), false, 'empty array');
});

test('hasRole: an unknown role name never grants access', async function() {
    var core = await signedInCore({ uid: 's1', role: 'student' });
    assertEqual(core.hasRole('teacherr'), false, 'misspelled role');
    assertEqual(core.hasRole('Teacher'), false, 'wrong case');
    assertEqual(core.hasRole('anything'), false, 'unknown name');
});

test('hasRole: a missing or malformed role argument never grants access', async function() {
    var core = await signedInCore({ uid: 's1', role: 'student' });
    [undefined, null, '', 0, 42, {}, true].forEach(function(bad) {
        assertEqual(core.hasRole(bad), false, 'argument ' + JSON.stringify(bad));
    });
});

test('hasRole: unknown names inside an array are ignored, known names still count', async function() {
    var student = await signedInCore({ uid: 's1', role: 'student' });
    assertEqual(student.hasRole(['typo']), false, 'only a typo');
    assertEqual(student.hasRole(['typo', 'teacher']), false, 'typo plus teacher, for a student');
    var teacher = await signedInCore({ uid: 't1', role: 'teacher' });
    assertEqual(teacher.hasRole(['typo', 'teacher']), true, 'typo plus teacher, for a teacher');
});

test('hasRole: inherited object property names are not roles', async function() {
    var core = await signedInCore({ uid: 's1', role: 'student' });
    ['constructor', '__proto__', 'toString', 'hasOwnProperty', 'valueOf'].forEach(function(name) {
        assertEqual(core.hasRole(name), false, name);
    });
});

test('hasRole: a signed-in user with an unknown role (expired demo) passes no gate', async function() {
    var core = await signedInCore({ uid: 'd1', role: 'demo' });
    ROLE_ORDER.forEach(function(name) {
        assertEqual(core.hasRole(name), false, 'demo asking for ' + name);
    });
});

// ---------- requireRole ----------
test('requireRole: signed out gives unauthenticated', function() {
    var clock = makeClock();
    var core = loadCore(clock).createInstance(makeHost(clock));
    assertEqual(core.requireRole('student'), { ok: false, reason: 'unauthenticated' }, 'result');
});

test('requireRole: a student asking for a typo or for teacher gets insufficient_role', async function() {
    var core = await signedInCore({ uid: 's1', role: 'student' });
    assertEqual(core.requireRole('teacherr'), { ok: false, reason: 'insufficient_role' }, 'typo');
    assertEqual(core.requireRole('teacher'), { ok: false, reason: 'insufficient_role' }, 'teacher');
});

test('requireRole: a teacher asking for teacher gets ok and the sanitized user', async function() {
    var core = await signedInCore({ uid: 't1', role: 'teacher' });
    var result = core.requireRole(['teacher']);
    assertEqual(result.ok, true, 'ok');
    assertEqual(result.user.uid, 't1', 'uid');
    assertEqual(result.user.role, 'teacher', 'role');
});

// ---------- Firebase binding and the wait ----------
test('whenReady binds Firebase once and resolves only after the first auth callback', async function() {
    var s = newSession();
    s.host.makeFirebaseAvailable();
    var settled = false;
    var ready = s.core.whenReady().then(function(value) { settled = true; return value; });
    s.core.whenReady();
    s.core.whenReady();
    await s.clock.advance(100);
    assertEqual(s.host.bindCount, 1, 'bind count');
    assertEqual(settled, false, 'resolved before any auth callback');
    await s.host.fire({ uid: 'u1' });
    var value = await ready;
    assertEqual(value.user.uid, 'u1', 'resolved user');
    assertEqual(s.host.bindCount, 1, 'bind count after the callback');
});

test('Firebase that appears within the wait window is picked up', async function() {
    var s = newSession();
    s.host.firebaseAppearsAfter(100);
    s.core.whenReady();
    await s.clock.advance(99);
    assertEqual(s.host.bindCount, 0, 'bound too early');
    await s.clock.advance(60);
    assertEqual(s.host.bindCount, 1, 'bind count');
});

test('whenReady resolves signed-out after 6000 ms without Firebase, and not before', async function() {
    var s = newSession();
    var settled = false;
    var ready = s.core.whenReady().then(function(value) { settled = true; return value; });
    await s.clock.advance(5900);
    assertEqual(settled, false, 'resolved before the timeout');
    await s.clock.advance(200);
    assertEqual(settled, true, 'still pending after the timeout');
    assertEqual(await ready, { user: null, org: null }, 'resolved value');
});

test('Firebase that arrives after the 6 s timeout is still bound and signs the user in', async function() {
    var s = newSession();
    s.host.firebaseAppearsAfter(10000);
    var ready = s.core.whenReady();
    await s.clock.advance(6100);
    assertEqual(await ready, { user: null, org: null }, 'value at the timeout');
    assertEqual(s.host.bindCount, 0, 'bound before Firebase existed');
    await s.clock.advance(4600);
    assertEqual(s.host.bindCount, 1, 'Firebase appeared but was never bound');
    await s.host.fire({ uid: 'u1' });
    assertEqual(s.core.getCurrentUser().uid, 'u1', 'signed-in user');
    assertEqual(s.core.hasRole('teacher'), true, 'teacher gate');
});

test('listeners registered before the timeout hear about a late sign-in', async function() {
    var s = newSession();
    var heard = [];
    s.core.onAuthChange(function(user) { heard.push(user ? user.uid : null); });
    s.core.whenReady();
    await s.clock.advance(6100);
    s.host.firebaseAppearsAfter(1000);
    await s.clock.advance(2000);
    await s.host.fire({ uid: 'u1' });
    assertEqual(heard, ['u1'], 'listener calls');
});

test('after the timeout Firebase is checked slowly: 1 to 40 checks in the next 6 seconds', async function() {
    var s = newSession();
    s.core.whenReady();
    await s.clock.advance(6100);
    var before = s.clock.scheduled;
    await s.clock.advance(6000);
    var checks = s.clock.scheduled - before;
    assertTrue(checks >= 1 && checks <= 40, 'checks in 6 s after the timeout: ' + checks);
});

test('background checks use unref so a Node process can still exit', async function() {
    var s = newSession({ handleObjects: true });
    s.core.whenReady();
    await s.clock.advance(5000);
    assertEqual(s.clock.unrefCalls, 0, 'unref calls before the timeout');
    await s.clock.advance(2000);
    assertTrue(s.clock.unrefCalls > 0, 'no unref call was made after the timeout');
});

runAll();
