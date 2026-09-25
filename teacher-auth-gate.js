/**
 * Stage 0 — Teacher Auth Gate + Student Cross-Device Session Sync
 * Intercepts Teacher Hub access with real Firebase Auth verification.
 * Does not modify app.js.
 */
(function() {
    let currentAuthUser = null;
    let isConfirmedTeacher = false;
    let authInitialized = false;

    // 1. Wait for Firebase Auth to become ready on window
    function initAuthListener() {
        if (typeof window.firebaseOnAuthChange === 'function' && typeof window.firebaseCheckIsTeacher === 'function') {
            window.firebaseOnAuthChange(async function(user) {
                currentAuthUser = user;
                if (!user) {
                    isConfirmedTeacher = false;
                    authInitialized = true;
                    return;
                }
                try {
                    let isLegacy = false;
                    if (typeof window.firebaseCheckIsTeacher === 'function') {
                        isLegacy = await window.firebaseCheckIsTeacher(user.uid);
                    }
                    let isAccount = false;
                    if (typeof window.firebaseCheckIsAccountTeacher === 'function') {
                        isAccount = await window.firebaseCheckIsAccountTeacher(user.uid);
                    }
                    isConfirmedTeacher = isLegacy || isAccount;
                } catch(e) {
                    console.warn('Teacher auth check failed:', e);
                    isConfirmedTeacher = false;
                }
                authInitialized = true;
            });
        } else {
            setTimeout(initAuthListener, 50);
        }
    }
    initAuthListener();

    // 2. Capture-phase interception on Teacher Hub button
    function attachTeacherHubGate() {
        const teacherBtn = document.getElementById('teacherHubBtn');
        if (!teacherBtn) {
            setTimeout(attachTeacherHubGate, 100);
            return;
        }

        // Must run in CAPTURE phase to intercept before app.js bubble handler
        teacherBtn.addEventListener('click', function(event) {
            if (isConfirmedTeacher) {
                // Confirmed teacher: let event proceed normally to app.js handler
                return;
            }

            // Not confirmed: block app.js handler from running
            event.stopImmediatePropagation();
            event.preventDefault();
            showTeacherLoginOverlay();
        }, true);
    }

    // 3. UI Login Overlay Handlers
    function showTeacherLoginOverlay() {
        const overlay = document.getElementById('teacherLoginOverlay');
        const errorEl = document.getElementById('teacherLoginErrorMsg');
        const emailInput = document.getElementById('teacherLoginEmailInput');
        const passInput = document.getElementById('teacherLoginPasswordInput');
        if (errorEl) {
            errorEl.style.display = 'none';
            errorEl.textContent = '';
        }
        if (overlay) {
            overlay.style.display = 'flex';
            if (emailInput) {
                emailInput.focus();
            }
        }
    }

    function hideTeacherLoginOverlay() {
        const overlay = document.getElementById('teacherLoginOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    function setupLoginModalHandlers() {
        const form = document.getElementById('teacherLoginForm');
        const submitBtn = document.getElementById('teacherLoginSubmitBtn');
        const closeBtn = document.getElementById('teacherLoginCloseBtn');
        const overlay = document.getElementById('teacherLoginOverlay');
        const errorEl = document.getElementById('teacherLoginErrorMsg');
        const emailInput = document.getElementById('teacherLoginEmailInput');
        const passInput = document.getElementById('teacherLoginPasswordInput');

        if (closeBtn) {
            closeBtn.addEventListener('click', hideTeacherLoginOverlay);
        }

        if (overlay) {
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    hideTeacherLoginOverlay();
                }
            });
        }

        async function handleLoginSubmit(e) {
            if (e) e.preventDefault();
            const email = (emailInput?.value || '').trim();
            const pass = passInput?.value || '';

            if (!email || !pass) {
                if (errorEl) {
                    errorEl.textContent = 'يرجى إدخال البريد الإلكتروني وكلمة المرور.';
                    errorEl.style.display = 'block';
                }
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'جاري التحقق...';
            }
            if (errorEl) {
                errorEl.style.display = 'none';
            }

            try {
                if (typeof window.firebaseTeacherSignIn !== 'function') {
                    throw new Error('خدمة المصادقة غير جاهزة بعد، يرجى المحاولة ثانية.');
                }

                const res = await window.firebaseTeacherSignIn(email, pass);
                if (!res.ok) {
                    if (errorEl) {
                        errorEl.textContent = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
                        errorEl.style.display = 'block';
                    }
                    return;
                }

                // Verify teacher status: either legacy marker or account role == teacher
                let isTeacher = false;
                try {
                    let isLegacy = false;
                    if (typeof window.firebaseCheckIsTeacher === 'function') {
                        isLegacy = await window.firebaseCheckIsTeacher(res.uid);
                    }
                    let isAccount = false;
                    if (typeof window.firebaseCheckIsAccountTeacher === 'function') {
                        isAccount = await window.firebaseCheckIsAccountTeacher(res.uid);
                    }
                    isTeacher = isLegacy || isAccount;
                } catch(e) {
                    console.warn('Teacher check error:', e);
                    isTeacher = false;
                }
                if (!isTeacher) {
                    // Sign back out immediately
                    if (typeof window.firebaseTeacherSignOut === 'function') {
                        await window.firebaseTeacherSignOut();
                    }
                    isConfirmedTeacher = false;
                    currentAuthUser = null;
                    if (errorEl) {
                        errorEl.textContent = 'هذا الحساب غير مسجل كمعلم في المنظومة.';
                        errorEl.style.display = 'block';
                    }
                    return;
                }

                // Verified Teacher!
                isConfirmedTeacher = true;
                hideTeacherLoginOverlay();

                const teacherBtn = document.getElementById('teacherHubBtn');
                if (teacherBtn) {
                    teacherBtn.click();
                }
            } catch(err) {
                console.error('Login error:', err);
                if (errorEl) {
                    errorEl.textContent = err.message || 'حدث خطأ أثناء تسجيل الدخول.';
                    errorEl.style.display = 'block';
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'دخول';
                }
            }
        }

        if (form) {
            form.addEventListener('submit', handleLoginSubmit);
        }
        if (submitBtn) {
            submitBtn.addEventListener('click', handleLoginSubmit);
        }
    }

    // 4. Setup Sign-Out button inside Teacher Hub
    function setupSignOutHandler() {
        const signOutBtn = document.getElementById('teacherSignOutBtn');
        if (signOutBtn) {
            signOutBtn.addEventListener('click', async function() {
                if (typeof window.firebaseTeacherSignOut === 'function') {
                    await window.firebaseTeacherSignOut();
                }
                isConfirmedTeacher = false;
                currentAuthUser = null;
                const hubOverlay = document.getElementById('teacherHubOverlay');
                if (hubOverlay) {
                    hubOverlay.style.display = 'none';
                }
            });
        }
    }

    // 5. Cross-Device Student Assignment Question Sync
    async function syncStudentAssignmentQuestions() {
        const match = (window.location.hash || '').match(/#(?:assignment|quizSession)=([A-Za-z0-9_-]+)/);
        if (!match) return;
        const code = match[1].toUpperCase();

        if (typeof window.firebaseGetSessionQuestions === 'function') {
            try {
                const questions = await window.firebaseGetSessionQuestions(code);
                if (Array.isArray(questions) && questions.length > 0) {
                    const storageKey = 'lepidos_teacher_sessions_v1';
                    let sessions = [];
                    try {
                        sessions = JSON.parse(localStorage.getItem(storageKey) || '[]');
                    } catch(e) {}

                    const existing = sessions.find(s => s && s.code === code);
                    if (existing) {
                        existing.customQuestions = questions;
                    } else {
                        sessions.push({
                            code: code,
                            customQuestions: questions,
                            title: 'واجب صفي'
                        });
                    }
                    localStorage.setItem(storageKey, JSON.stringify(sessions));
                }
            } catch(err) {
                console.warn('Could not sync remote session questions:', err);
            }
        } else {
            setTimeout(syncStudentAssignmentQuestions, 100);
        }
    }

    // Initialize all components
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            attachTeacherHubGate();
            setupLoginModalHandlers();
            setupSignOutHandler();
            syncStudentAssignmentQuestions();
        });
    } else {
        attachTeacherHubGate();
        setupLoginModalHandlers();
        setupSignOutHandler();
        syncStudentAssignmentQuestions();
    }

    window.addEventListener('hashchange', syncStudentAssignmentQuestions);
})();
