/**
 * Lepidos Atlas & Nation Simulation — Shared Accounts Core (نواة الحسابات المشتركة)
 * Pure headless session, authentication state, and role management library.
 * Zero DOM manipulation, zero UI code, zero simulation-specific logic.
 * Works in browsers (window.LepidosAccounts) and Node.js environments.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.LepidosAccounts = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {
    'use strict';

    function createAccountsCore(env) {
        var host = env || (typeof window !== 'undefined' ? window : {});

        var _currentUser = null;
        var _currentOrg = null;
        var _isReady = false;
        var _readyPromise = null;
        var _listeners = [];
        var _firebaseUnsub = null;

        // Role hierarchy weights
        var ROLE_RANKS = {
            superAdmin: 100,
            admin: 80,
            itStaff: 60,
            teacher: 40,
            student: 20
        };

        function sanitizeUser(u) {
            if (!u) return null;
            return {
                uid: u.uid || null,
                role: u.role || 'student',
                displayName: u.displayName || u.username || null,
                username: u.username || null,
                orgId: u.orgId || null,
                classId: u.classId || null,
                classIds: Array.isArray(u.classIds) ? u.classIds : (u.classId ? [u.classId] : []),
                teacherId: u.teacherId || null,
                isLegacyStandaloneTeacher: !!u.isLegacyStandaloneTeacher
            };
        }

        function sanitizeOrg(o) {
            if (!o) return null;
            return {
                id: o.id || o.orgId || null,
                name: o.name || null,
                tier: o.tier || 'individual',
                adminCount: typeof o.adminCount === 'number' ? o.adminCount : 1,
                demoExpiresAt: o.demoExpiresAt || null
            };
        }

        function notifyListeners() {
            var userCopy = sanitizeUser(_currentUser);
            var orgCopy = sanitizeOrg(_currentOrg);
            for (var i = 0; i < _listeners.length; i++) {
                try {
                    _listeners[i](userCopy, orgCopy);
                } catch(e) {
                    console.warn('[LepidosAccounts] listener error:', e);
                }
            }
        }

        var _isExpiredDemo = false;

        async function fetchProfileForAuthUser(authUser) {
            // Path 1: Check institutional account profile via firebaseAccountGetProfile
            if (typeof host.firebaseAccountGetProfile === 'function') {
                try {
                    var res = await host.firebaseAccountGetProfile();
                    if (res && (res.ok || res.isExpiredDemo) && res.user) {
                        _currentUser = res.user;
                        _currentOrg = res.org || null;
                        _isExpiredDemo = !!res.isExpiredDemo;
                        return;
                    }
                } catch(e) {
                    console.warn('[LepidosAccounts] firebaseAccountGetProfile error:', e);
                }
            }

            _isExpiredDemo = false;

            if (!authUser) {
                _currentUser = null;
                _currentOrg = null;
                return;
            }

            // Path 2: Check legacy standalone teacher via firebaseCheckIsTeacher
            var isLegacyTeacher = false;
            if (typeof host.firebaseCheckIsTeacher === 'function') {
                try {
                    isLegacyTeacher = await host.firebaseCheckIsTeacher(authUser.uid);
                } catch(e) {
                    isLegacyTeacher = false;
                }
            }

            _currentUser = {
                uid: authUser.uid,
                role: isLegacyTeacher ? 'teacher' : (authUser.role || 'student'),
                displayName: authUser.displayName || null,
                username: authUser.username || null,
                orgId: authUser.orgId || null,
                classId: authUser.classId || null,
                teacherId: authUser.teacherId || null,
                isLegacyStandaloneTeacher: isLegacyTeacher
            };
            _currentOrg = null;
        }

        function waitForFirebase(timeoutMs) {
            return new Promise(function(resolve) {
                var maxWait = timeoutMs || 6000;
                var start = Date.now();

                function check() {
                    if (typeof host.firebaseOnAuthChange === 'function') {
                        resolve(true);
                        return;
                    }
                    if (Date.now() - start >= maxWait) {
                        console.warn('[LepidosAccounts] Timed out waiting for window.firebaseOnAuthChange');
                        resolve(false);
                        return;
                    }
                    setTimeout(check, 25);
                }
                check();
            });
        }

        function initAuthBinding() {
            if (_readyPromise) return _readyPromise;

            _readyPromise = new Promise(async function(resolve) {
                var available = await waitForFirebase(6000);
                if (!available || typeof host.firebaseOnAuthChange !== 'function') {
                    _isReady = true;
                    resolve({ user: null, org: null });
                    return;
                }

                _firebaseUnsub = host.firebaseOnAuthChange(async function(authUser) {
                    await fetchProfileForAuthUser(authUser);
                    _isReady = true;
                    notifyListeners();
                    resolve({ user: sanitizeUser(_currentUser), org: sanitizeOrg(_currentOrg) });
                });
            });

            return _readyPromise;
        }

        // Public API Methods

        function whenReady() {
            return initAuthBinding();
        }

        function getCurrentUser() {
            return sanitizeUser(_currentUser);
        }

        function getInstitution() {
            return sanitizeOrg(_currentOrg);
        }

        function hasRole(roleOrRoles) {
            if (!_currentUser) return false;
            var currentRole = _currentUser.role || 'student';
            var currentRank = ROLE_RANKS[currentRole] || 20;

            // Handle legacy standalone teacher exception
            if (_currentUser.isLegacyStandaloneTeacher && currentRole !== 'teacher') {
                currentRank = Math.max(currentRank, ROLE_RANKS.teacher);
            }

            var targets = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
            for (var i = 0; i < targets.length; i++) {
                var targetRole = targets[i];
                var targetRank = ROLE_RANKS[targetRole] || 20;

                // Exact role match or inherited privilege via hierarchy
                if (currentRole === targetRole) return true;
                if (currentRank >= targetRank) return true;
                if (targetRole === 'teacher' && _currentUser.isLegacyStandaloneTeacher) return true;
            }
            return false;
        }

        function requireRole(allowedRoles) {
            if (!_currentUser) {
                return { ok: false, reason: 'unauthenticated' };
            }
            if (hasRole(allowedRoles)) {
                return { ok: true, user: getCurrentUser() };
            }
            return { ok: false, reason: 'insufficient_role' };
        }

        function onAuthChange(callback) {
            if (typeof callback !== 'function') return function() {};
            _listeners.push(callback);

            // If already initialized, dispatch current state immediately
            if (_isReady) {
                try {
                    callback(sanitizeUser(_currentUser), sanitizeOrg(_currentOrg));
                } catch(e) {
                    console.warn('[LepidosAccounts] immediate listener callback error:', e);
                }
            } else {
                initAuthBinding();
            }

            return function unsubscribe() {
                var idx = _listeners.indexOf(callback);
                if (idx !== -1) {
                    _listeners.splice(idx, 1);
                }
            };
        }

        async function getTeacherStudents(teacherUid) {
            var tUid = teacherUid;
            if (!tUid && _currentUser) tUid = _currentUser.uid;
            if (!tUid) return [];

            if (typeof host.firebaseGetTeacherStudents === 'function') {
                try {
                    return await host.firebaseGetTeacherStudents(tUid);
                } catch(e) {
                    console.warn('[LepidosAccounts] getTeacherStudents failed:', e);
                    return [];
                }
            }
            return [];
        }

        async function signOut() {
            try {
                if (typeof host.firebaseAccountSignOut === 'function') {
                    await host.firebaseAccountSignOut();
                } else if (typeof host.firebaseTeacherSignOut === 'function') {
                    await host.firebaseTeacherSignOut();
                }
            } catch(e) {
                console.warn('[LepidosAccounts] signOut delegate error:', e);
            } finally {
                _currentUser = null;
                _currentOrg = null;
                notifyListeners();
            }
            return { ok: true };
        }

        var _isRefreshing = false;
        async function refresh() {
            if (_isRefreshing) {
                return { user: sanitizeUser(_currentUser), org: sanitizeOrg(_currentOrg) };
            }
            _isRefreshing = true;
            try {
                var authUser;
                if (host.firebaseAuth) {
                    authUser = host.firebaseAuth.currentUser;
                } else {
                    authUser = _currentUser;
                }
                await fetchProfileForAuthUser(authUser);
                notifyListeners();
                return { user: sanitizeUser(_currentUser), org: sanitizeOrg(_currentOrg) };
            } finally {
                _isRefreshing = false;
            }
        }

        return {
            whenReady: whenReady,
            getCurrentUser: getCurrentUser,
            getInstitution: getInstitution,
            hasRole: hasRole,
            requireRole: requireRole,
            onAuthChange: onAuthChange,
            getTeacherStudents: getTeacherStudents,
            isExpiredDemo: function() { return !!_isExpiredDemo; },
            signOut: signOut,
            refresh: refresh
        };
    }

    var defaultInstance = createAccountsCore(typeof window !== 'undefined' ? window : {});
    defaultInstance.createInstance = createAccountsCore;

    return defaultInstance;
}));
