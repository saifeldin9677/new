/**
 * Stage 1: Permanent Multi-Tenant Account System
 * Handles Super Admin, Admin, IT Staff, Teacher, and Student workflows.
 * Integrates with secondary Firebase Auth instance for session-hijack-free creation.
 */
(function() {
    'use strict';

    var state = {
        currentUser: null,
        currentOrg: null,
        activeClassId: null,
        isExpiredDemo: false,
        orgUsers: [],
        organizationsList: []
    };

    var roleTitles = {
        superAdmin: 'المسؤول العام للمنصة (Super Admin)',
        admin: 'مدير المنظمة (Admin)',
        itStaff: 'مسؤول تقنية المعلومات (IT Staff)',
        teacher: 'معلم (Teacher)',
        student: 'طالب (Student)'
    };

    var tierTitles = {
        demo: 'تجريبي (Demo)',
        individual: 'فردي (Individual)',
        institutional: 'مؤسسي (Institutional)'
    };

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    async function refreshAccountProfile() {
        if (typeof window.firebaseAccountGetProfile !== 'function') return;
        try {
            var res = await window.firebaseAccountGetProfile();
            if (res && (res.ok || res.isExpiredDemo)) {
                if (res.user) {
                    state.currentUser = res.user;
                }
                if (res.org) {
                    state.currentOrg = res.org;
                }
                state.isExpiredDemo = !!res.isExpiredDemo;

                if (state.currentUser && state.currentUser.role === 'teacher') {
                    var classes = state.currentUser.classIds || [];
                    if (!state.activeClassId || !classes.includes(state.activeClassId)) {
                        state.activeClassId = classes[0] || 'default-class';
                    }
                }

                if (state.currentUser && state.currentUser.orgId && !state.isExpiredDemo) {
                    await loadOrgUsers(state.currentUser.orgId);
                }
                if (state.currentUser && state.currentUser.role === 'superAdmin') {
                    await loadAllOrganizations();
                }
            } else {
                state.currentUser = null;
                state.currentOrg = null;
                state.isExpiredDemo = false;
                state.orgUsers = [];
            }
        } catch(e) {
            console.warn('Error refreshing account profile:', e);
        }
        updateAccountBadge();
        renderAccountModalContent();
    }

    async function loadOrgUsers(orgId) {
        if (typeof window.firebaseListOrgUsers !== 'function') return;
        try {
            var res = await window.firebaseListOrgUsers(orgId);
            if (res && res.ok) {
                state.orgUsers = res.users || [];
            }
        } catch(e) {
            console.warn('Error loading org users:', e);
        }
    }

    async function loadAllOrganizations() {
        if (typeof window.firebaseListOrganizations !== 'function') return;
        try {
            var res = await window.firebaseListOrganizations();
            if (res && res.ok) {
                state.organizationsList = res.organizations || [];
            }
        } catch(e) {
            console.warn('Error loading organizations list:', e);
        }
    }

    function updateAccountBadge() {
        var btn = document.getElementById('accountSystemBtn');
        if (!btn) return;
        var label = btn.querySelector('.tool-label');
        if (!label) return;

        if (state.currentUser) {
            var roleShort = state.currentUser.role === 'superAdmin' ? 'المسؤول' :
                           (state.currentUser.role === 'admin' ? 'المدير' :
                           (state.currentUser.role === 'itStaff' ? 'التقنية' :
                           (state.currentUser.role === 'teacher' ? 'المعلم' : 'الطالب')));
            label.textContent = state.currentUser.displayName ? (state.currentUser.displayName + ' (' + roleShort + ')') : roleShort;
            btn.style.color = '#38bdf8';
        } else {
            label.textContent = 'الحسابات';
            btn.style.color = '';
        }
    }

    function openAccountModal() {
        var overlay = document.getElementById('accountSystemOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
            refreshAccountProfile();
        }
    }

    function closeAccountModal() {
        var overlay = document.getElementById('accountSystemOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    function showCredentialDisplayModal(creds) {
        var credModal = document.getElementById('accountCredentialModal');
        if (!credModal) return;
        
        var body = document.getElementById('accountCredentialModalBody');
        if (body) {
            body.innerHTML = `
                <div style="background:rgba(15,23,42,0.95);border:1px solid #334155;border-radius:12px;padding:20px;text-align:right;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;border-bottom:1px solid #334155;padding-bottom:8px;">
                        <h4 style="margin:0;color:#38bdf8;font-size:1.1rem;">🔑 بيانات الحساب الجديد</h4>
                        <span style="font-size:0.8rem;background:rgba(56,189,248,0.2);color:#38bdf8;padding:2px 8px;border-radius:4px;">${escapeHtml(roleTitles[creds.role] || creds.role)}</span>
                    </div>
                    <p style="font-size:0.85rem;color:#94a3b8;margin-bottom:14px;">يرجى نسخ وحفظ هذه البيانات ومشاركتها مع صاحب الحساب مباشرة؛ لن تظهر كلمة المرور مرة أخرى!</p>
                    
                    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px;">
                        <div style="display:flex;justify-content:space-between;background:rgba(30,41,59,0.7);padding:8px 12px;border-radius:6px;">
                            <span style="color:#cbd5e1;font-weight:600;">الاسم:</span>
                            <span style="color:#f8fafc;font-weight:700;">${escapeHtml(creds.displayName || creds.username)}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;background:rgba(30,41,59,0.7);padding:8px 12px;border-radius:6px;">
                            <span style="color:#cbd5e1;font-weight:600;">اسم المستخدم:</span>
                            <span id="credUsernameVal" style="color:#38bdf8;font-weight:700;font-family:monospace;direction:ltr;">${escapeHtml(creds.username)}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;background:rgba(30,41,59,0.7);padding:8px 12px;border-radius:6px;">
                            <span style="color:#cbd5e1;font-weight:600;">كلمة المرور:</span>
                            <span id="credPasswordVal" style="color:#fbbf24;font-weight:700;font-family:monospace;direction:ltr;">${escapeHtml(creds.password)}</span>
                        </div>
                        ${creds.classId ? `
                        <div style="display:flex;justify-content:space-between;background:rgba(30,41,59,0.7);padding:8px 12px;border-radius:6px;">
                            <span style="color:#cbd5e1;font-weight:600;">الفصل الدراسي:</span>
                            <span style="color:#e2e8f0;">${escapeHtml(creds.classId)}</span>
                        </div>` : ''}
                    </div>

                    <div style="display:flex;gap:10px;">
                        <button type="button" id="copyCredsBtn" class="quiz-submit-btn" style="flex:1;background:#0284c7;">
                            📋 نسخ بيانات الدخول
                        </button>
                        <button type="button" id="closeCredModalBtn" class="btn btn-secondary" style="padding:8px 16px;">
                            إغلاق
                        </button>
                    </div>
                </div>
            `;

            var copyBtn = document.getElementById('copyCredsBtn');
            if (copyBtn) {
                copyBtn.onclick = function() {
                    var copyText = `بيانات تسجيل الدخول إلى المنصة التعليمية:\nاسم المستخدم: ${creds.username}\nكلمة المرور: ${creds.password}` + (creds.classId ? `\nالفصل: ${creds.classId}` : '');
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(copyText).then(function() {
                            copyBtn.textContent = '✅ تم النسخ بنجاح!';
                            setTimeout(function() { copyBtn.textContent = '📋 نسخ بيانات الدخول'; }, 2000);
                        });
                    }
                };
            }

            var closeBtn = document.getElementById('closeCredModalBtn');
            if (closeBtn) {
                closeBtn.onclick = function() {
                    credModal.style.display = 'none';
                };
            }
        }
        credModal.style.display = 'flex';
    }

    function renderAccountModalContent() {
        var container = document.getElementById('accountSystemModalBody');
        if (!container) return;

        if (state.isExpiredDemo) {
            renderDashboard(container);
            return;
        }

        if (!state.currentUser) {
            renderLoginForm(container);
        } else {
            renderDashboard(container);
        }
    }

    function renderLoginForm(container) {
        container.innerHTML = `
            <div style="max-width:440px;margin:0 auto;padding:10px;">
                <div style="text-align:center;margin-bottom:20px;">
                    <div style="font-size:2.5rem;margin-bottom:8px;">🏛️</div>
                    <h3 style="margin:0;font-size:1.3rem;color:#f8fafc;">تسجيل الدخول للنظام المؤسسي</h3>
                    <p style="margin:4px 0 0;font-size:0.85rem;color:#94a3b8;">للمسؤولين والمعلمين والطلاب وفرق التقنية</p>
                </div>

                <form id="accountLoginForm" onsubmit="return false;" style="display:flex;flex-direction:column;gap:14px;">
                    <div class="worksheet-form-group">
                        <label for="accountUsernameInput" style="font-size:0.9rem;color:#cbd5e1;font-weight:600;">اسم المستخدم:</label>
                        <input type="text" id="accountUsernameInput" class="quiz-input" placeholder="اسم المستخدم (مثل a-xxxxxx أو t-xxxxxx)" required autocomplete="username" style="direction:ltr;text-align:right;">
                    </div>

                    <div class="worksheet-form-group">
                        <label for="accountPasswordInput" style="font-size:0.9rem;color:#cbd5e1;font-weight:600;">كلمة المرور:</label>
                        <input type="password" id="accountPasswordInput" class="quiz-input" placeholder="••••••••" required autocomplete="current-password" style="direction:ltr;text-align:right;">
                    </div>

                    <div id="accountLoginErrorMsg" style="display:none;color:#ef4444;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);padding:10px 14px;border-radius:8px;font-size:0.85rem;"></div>

                    <button type="submit" id="accountLoginSubmitBtn" class="quiz-submit-btn" style="width:100%;margin-top:6px;">
                        تسجيل الدخول
                    </button>
                </form>
            </div>
        `;

        var form = document.getElementById('accountLoginForm');
        var errEl = document.getElementById('accountLoginErrorMsg');
        var submitBtn = document.getElementById('accountLoginSubmitBtn');

        if (form) {
            form.onsubmit = async function(e) {
                e.preventDefault();
                errEl.style.display = 'none';
                submitBtn.disabled = true;
                submitBtn.textContent = 'جارٍ تسجيل الدخول...';

                var uName = (document.getElementById('accountUsernameInput').value || '').trim();
                var pass = (document.getElementById('accountPasswordInput').value || '').trim();

                try {
                    var res = await window.firebaseAccountSignIn(uName, pass);
                    if (res && res.ok) {
                        await refreshAccountProfile();
                    } else {
                        errEl.textContent = (res && res.message) ? res.message : 'فشل تسجيل الدخول.';
                        errEl.style.display = 'block';
                    }
                } catch(err) {
                    errEl.textContent = 'خطأ في الاتصال: ' + (err.message || String(err));
                    errEl.style.display = 'block';
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'تسجيل الدخول';
                }
            };
        }
    }

    function renderDashboard(container) {
        var u = state.currentUser || { displayName: 'مستخدم تجريبي', username: 'demo-user', role: 'demo' };
        var o = state.currentOrg;

        var html = `
            <div style="display:flex;flex-direction:column;gap:18px;">
                <!-- Profile Header Card -->
                <div style="background:rgba(30,41,59,0.8);border:1px solid #334155;border-radius:12px;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
                    <div>
                        <div style="display:flex;align-items:center;gap:10px;">
                            <h3 style="margin:0;font-size:1.2rem;color:#f8fafc;">${escapeHtml(u.displayName || u.username)}</h3>
                            <span style="background:rgba(56,189,248,0.2);color:#38bdf8;padding:2px 8px;border-radius:6px;font-size:0.75rem;font-weight:700;">
                                ${escapeHtml(roleTitles[u.role] || u.role)}
                            </span>
                        </div>
                        <div style="margin-top:6px;font-size:0.85rem;color:#94a3b8;display:flex;gap:14px;flex-wrap:wrap;">
                            <span>اسم المستخدم: <strong style="color:#e2e8f0;font-family:monospace;direction:ltr;display:inline-block;">${escapeHtml(u.username)}</strong></span>
                            ${o ? `<span>المنظمة: <strong style="color:#e2e8f0;">${escapeHtml(o.name)}</strong> (${escapeHtml(tierTitles[o.tier] || o.tier)})</span>` : ''}
                            ${(o && o.adminCount) ? `<span>عدد المسؤولين: <strong style="color:#e2e8f0;">${o.adminCount}</strong></span>` : ''}
                        </div>
                    </div>
                    <div>
                        <button type="button" id="accountSignOutBtn" class="btn btn-secondary" style="background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);color:#fca5a5;font-size:0.85rem;padding:6px 14px;border-radius:8px;">
                            تسجيل الخروج
                        </button>
                    </div>
                </div>

                <!-- Expired Demo Banner -->
                ${state.isExpiredDemo ? `
                    <div id="demoExpiredBanner" style="background:rgba(239,68,68,0.15);border:1px solid #ef4444;color:#fca5a5;padding:14px 18px;border-radius:10px;text-align:right;">
                        <h4 style="margin:0 0 6px 0;color:#f87171;font-size:1rem;">⚠️ انتهت صلاحية الحساب التجريبي لهذه المنظمة</h4>
                        <p style="margin:0;font-size:0.85rem;">تم إيقاف صلاحيات القراءة والعمليات الحية للمنظمة. يرجى التواصل مع إدارة النظام لترقية المنظمة إلى باقة فردية أو مؤسسية.</p>
                    </div>
                ` : ''}
        `;

        if (!state.isExpiredDemo) {
            if (u.role === 'superAdmin') {
                html += renderSuperAdminPanel();
            } else if (u.role === 'admin') {
                html += renderAdminPanel();
            } else if (u.role === 'itStaff') {
                html += renderITStaffPanel();
            } else if (u.role === 'teacher') {
                html += renderTeacherPanel();
            } else if (u.role === 'student') {
                html += renderStudentPanel();
            }
        }

        html += `</div>`;
        container.innerHTML = html;

        var signOutBtn = document.getElementById('accountSignOutBtn');
        if (signOutBtn) {
            signOutBtn.onclick = async function() {
                await window.firebaseAccountSignOut();
                state.currentUser = null;
                state.currentOrg = null;
                state.isExpiredDemo = false;
                state.orgUsers = [];
                updateAccountBadge();
                renderAccountModalContent();
            };
        }

        attachDashboardEventHandlers();
    }

    function renderSuperAdminPanel() {
        return `
            <div style="background:rgba(15,23,42,0.6);border:1px solid #334155;border-radius:12px;padding:18px;">
                <h4 style="margin:0 0 14px 0;color:#38bdf8;font-size:1.05rem;">🏛️ إنشاء منظمة جديدة (Organization Provisioning)</h4>
                
                <form id="createOrgForm" onsubmit="return false;" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:12px;margin-bottom:16px;">
                    <div class="worksheet-form-group">
                        <label style="font-size:0.85rem;color:#cbd5e1;">اسم المنظمة / المدرسة:</label>
                        <input type="text" id="newOrgName" class="quiz-input" placeholder="ثانوية الأندلس النموذجية" required>
                    </div>
                    <div class="worksheet-form-group">
                        <label style="font-size:0.85rem;color:#cbd5e1;">فئة المنظمة (Tier):</label>
                        <select id="newOrgTier" class="quiz-select">
                            <option value="demo">تجريبي (Demo - محدد الصلاحية)</option>
                            <option value="individual">فردي (Individual - معلم مستقل)</option>
                            <option value="institutional" selected>مؤسسي (Institutional - مدرسة/جامعة)</option>
                        </select>
                    </div>
                    <div class="worksheet-form-group" id="demoDaysGroup" style="display:none;">
                        <label style="font-size:0.85rem;color:#cbd5e1;">مدة التجربة (أيام):</label>
                        <input type="number" id="newOrgDemoDays" class="quiz-input" value="7" min="1" max="90">
                    </div>
                    <div class="worksheet-form-group">
                        <label style="font-size:0.85rem;color:#cbd5e1;">اسم مسؤول المنظمة (Admin):</label>
                        <input type="text" id="newAdminDisplayName" class="quiz-input" placeholder="أ. عبد الرحمن" required>
                    </div>
                    <div class="worksheet-form-group">
                        <label style="font-size:0.85rem;color:#cbd5e1;">اسم مستخدم المسؤول:</label>
                        <div style="display:flex;gap:6px;">
                            <input type="text" id="newAdminUsername" class="quiz-input" placeholder="a-xxxxxx" required style="direction:ltr;">
                            <button type="button" id="genAdminCredsBtn" class="btn btn-secondary" style="font-size:0.75rem;padding:4px 8px;">توليد 🎲</button>
                        </div>
                    </div>
                    <div class="worksheet-form-group">
                        <label style="font-size:0.85rem;color:#cbd5e1;">كلمة مرور المسؤول:</label>
                        <input type="text" id="newAdminPassword" class="quiz-input" placeholder="كلمة المرور" required style="direction:ltr;">
                    </div>
                    <div style="grid-column:1 / -1;">
                        <div id="createOrgError" style="display:none;color:#ef4444;background:rgba(239,68,68,0.15);padding:8px 12px;border-radius:6px;font-size:0.85rem;margin-bottom:8px;"></div>
                        <button type="submit" id="submitCreateOrgBtn" class="quiz-submit-btn" style="width:100%;">
                            تدشين المنظمة وإنشاء حساب مسؤولها الأول
                        </button>
                    </div>
                </form>

                <h4 style="margin:20px 0 10px 0;color:#cbd5e1;font-size:1rem;">قائمة المنظمات المسجلة (${state.organizationsList.length})</h4>
                <div style="max-height:260px;overflow-y:auto;border:1px solid #334155;border-radius:8px;">
                    <table style="width:100%;border-collapse:collapse;text-align:right;font-size:0.85rem;">
                        <thead>
                            <tr style="background:rgba(30,41,59,0.9);color:#94a3b8;border-bottom:1px solid #334155;">
                                <th style="padding:8px 12px;">اسم المنظمة</th>
                                <th style="padding:8px 12px;">الفئة</th>
                                <th style="padding:8px 12px;">المسؤولين</th>
                                <th style="padding:8px 12px;">تاريخ الإنشاء</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${state.organizationsList.map(org => `
                                <tr style="border-bottom:1px solid #1e293b;">
                                    <td style="padding:8px 12px;font-weight:600;color:#f8fafc;">${escapeHtml(org.name)}</td>
                                    <td style="padding:8px 12px;"><span style="background:rgba(56,189,248,0.15);color:#38bdf8;padding:2px 6px;border-radius:4px;font-size:0.75rem;">${escapeHtml(tierTitles[org.tier] || org.tier)}</span></td>
                                    <td style="padding:8px 12px;color:#cbd5e1;">${org.adminCount || 1}</td>
                                    <td style="padding:8px 12px;color:#94a3b8;">${org.createdAt ? new Date(org.createdAt).toLocaleDateString('ar-EG') : 'الآن'}</td>
                                </tr>
                            `).join('') || `<tr><td colspan="4" style="padding:14px;text-align:center;color:#64748b;">لا توجد منظمات مسجلة بعد.</td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function renderAdminPanel() {
        return `
            <div style="background:rgba(15,23,42,0.6);border:1px solid #334155;border-radius:12px;padding:18px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                    <h4 style="margin:0;color:#38bdf8;font-size:1.05rem;">👥 إدارة منسوبي المنظمة</h4>
                    <span style="font-size:0.85rem;color:#cbd5e1;">عدد المسؤولين الحاليين: <strong id="adminCountDisplay" style="color:#fbbf24;">${state.currentOrg ? (state.currentOrg.adminCount || 1) : 1}</strong></span>
                </div>

                <!-- Add Member Form -->
                <form id="adminAddMemberForm" onsubmit="return false;" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:10px;background:rgba(30,41,59,0.5);padding:14px;border-radius:8px;margin-bottom:18px;border:1px solid #334155;">
                    <div class="worksheet-form-group">
                        <label style="font-size:0.8rem;color:#cbd5e1;">الدور المطلوب:</label>
                        <select id="adminNewMemberRole" class="quiz-select">
                            <option value="admin">مسؤول إضافي (Admin)</option>
                            <option value="itStaff" selected>مسؤول تقنية (IT Staff)</option>
                            <option value="teacher">معلم (Teacher)</option>
                            <option value="student">طالب (Student)</option>
                        </select>
                    </div>
                    <div class="worksheet-form-group">
                        <label style="font-size:0.8rem;color:#cbd5e1;">الاسم الكامل:</label>
                        <input type="text" id="adminNewMemberName" class="quiz-input" placeholder="الاسم" required>
                    </div>
                    <div class="worksheet-form-group">
                        <label style="font-size:0.8rem;color:#cbd5e1;">اسم المستخدم:</label>
                        <div style="display:flex;gap:4px;">
                            <input type="text" id="adminNewMemberUsername" class="quiz-input" placeholder="اسم المستخدم" required style="direction:ltr;">
                            <button type="button" id="adminGenCredsBtn" class="btn btn-secondary" style="font-size:0.75rem;padding:4px 6px;">توليد 🎲</button>
                        </div>
                    </div>
                    <div class="worksheet-form-group">
                        <label style="font-size:0.8rem;color:#cbd5e1;">كلمة المرور:</label>
                        <input type="text" id="adminNewMemberPassword" class="quiz-input" placeholder="كلمة المرور" required style="direction:ltr;">
                    </div>
                    <div style="grid-column:1 / -1;">
                        <div id="adminAddMemberError" style="display:none;color:#ef4444;background:rgba(239,68,68,0.15);padding:6px 10px;border-radius:6px;font-size:0.85rem;margin-bottom:6px;"></div>
                        <button type="submit" id="adminSubmitNewMemberBtn" class="quiz-submit-btn" style="width:100%;padding:8px;">
                            إنشاء الحساب وحفظه
                        </button>
                    </div>
                </form>

                <!-- Members List -->
                <h5 style="margin:12px 0 8px 0;color:#cbd5e1;">أعضاء المنظمة (${state.orgUsers.length})</h5>
                <div style="max-height:280px;overflow-y:auto;border:1px solid #334155;border-radius:8px;">
                    <table style="width:100%;border-collapse:collapse;text-align:right;font-size:0.85rem;">
                        <thead>
                            <tr style="background:rgba(30,41,59,0.9);color:#94a3b8;border-bottom:1px solid #334155;">
                                <th style="padding:8px 12px;">الاسم</th>
                                <th style="padding:8px 12px;">اسم المستخدم</th>
                                <th style="padding:8px 12px;">الدور</th>
                                <th style="padding:8px 12px;">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${state.orgUsers.map(user => `
                                <tr style="border-bottom:1px solid #1e293b;" id="user-row-${escapeHtml(user.uid)}">
                                    <td style="padding:8px 12px;font-weight:600;color:#f8fafc;">${escapeHtml(user.displayName || user.username)}</td>
                                    <td style="padding:8px 12px;font-family:monospace;direction:ltr;text-align:right;color:#38bdf8;">${escapeHtml(user.username)}</td>
                                    <td style="padding:8px 12px;"><span style="background:rgba(56,189,248,0.15);color:#38bdf8;padding:2px 6px;border-radius:4px;font-size:0.75rem;">${escapeHtml(roleTitles[user.role] || user.role)}</span></td>
                                    <td style="padding:8px 12px;">
                                        <button type="button" class="btn btn-secondary delete-user-btn" data-uid="${escapeHtml(user.uid)}" data-role="${escapeHtml(user.role)}" style="background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.3);color:#fca5a5;padding:3px 8px;font-size:0.75rem;">
                                            حذف
                                        </button>
                                    </td>
                                </tr>
                            `).join('') || `<tr><td colspan="4" style="padding:14px;text-align:center;color:#64748b;">لا يوجد أعضاء في المنظمة.</td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function renderITStaffPanel() {
        return `
            <div style="background:rgba(15,23,42,0.6);border:1px solid #334155;border-radius:12px;padding:18px;">
                <h4 style="margin:0 0 14px 0;color:#38bdf8;font-size:1.05rem;">💻 إدارة الحسابات التعليمية (IT Staff)</h4>
                
                <form id="itProvisionForm" onsubmit="return false;" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:10px;background:rgba(30,41,59,0.5);padding:14px;border-radius:8px;margin-bottom:18px;border:1px solid #334155;">
                    <div class="worksheet-form-group">
                        <label style="font-size:0.8rem;color:#cbd5e1;">الدور المطلوب:</label>
                        <select id="itNewRole" class="quiz-select">
                            <option value="teacher" selected>معلم (Teacher)</option>
                            <option value="student">طالب (Student)</option>
                        </select>
                    </div>
                    <div class="worksheet-form-group">
                        <label style="font-size:0.8rem;color:#cbd5e1;">الاسم الكامل:</label>
                        <input type="text" id="itNewName" class="quiz-input" placeholder="الاسم" required>
                    </div>
                    <div class="worksheet-form-group">
                        <label style="font-size:0.8rem;color:#cbd5e1;">اسم المستخدم:</label>
                        <div style="display:flex;gap:4px;">
                            <input type="text" id="itNewUsername" class="quiz-input" placeholder="اسم المستخدم" required style="direction:ltr;">
                            <button type="button" id="itGenCredsBtn" class="btn btn-secondary" style="font-size:0.75rem;padding:4px 6px;">توليد 🎲</button>
                        </div>
                    </div>
                    <div class="worksheet-form-group">
                        <label style="font-size:0.8rem;color:#cbd5e1;">كلمة المرور:</label>
                        <input type="text" id="itNewPassword" class="quiz-input" placeholder="كلمة المرور" required style="direction:ltr;">
                    </div>
                    <div class="worksheet-form-group" id="itClassIdsGroup">
                        <label style="font-size:0.8rem;color:#cbd5e1;">الفصول الدراسية (مفصولة بفاصلة):</label>
                        <input type="text" id="itClassIdsInput" class="quiz-input" value="grade-9a, grade-9b" placeholder="grade-9a, grade-9b">
                    </div>
                    <div style="grid-column:1 / -1;">
                        <div id="itProvisionError" style="display:none;color:#ef4444;background:rgba(239,68,68,0.15);padding:6px 10px;border-radius:6px;font-size:0.85rem;margin-bottom:6px;"></div>
                        <button type="submit" id="itSubmitBtn" class="quiz-submit-btn" style="width:100%;padding:8px;">
                            إنشاء الحساب التعليمي
                        </button>
                    </div>
                </form>

                <h5 style="margin:12px 0 8px 0;color:#cbd5e1;">المعلمون والطلاب المسجلون</h5>
                <div style="max-height:260px;overflow-y:auto;border:1px solid #334155;border-radius:8px;">
                    <table style="width:100%;border-collapse:collapse;text-align:right;font-size:0.85rem;">
                        <thead>
                            <tr style="background:rgba(30,41,59,0.9);color:#94a3b8;border-bottom:1px solid #334155;">
                                <th style="padding:8px 12px;">الاسم</th>
                                <th style="padding:8px 12px;">اسم المستخدم</th>
                                <th style="padding:8px 12px;">الدور</th>
                                <th style="padding:8px 12px;">الفصول</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${state.orgUsers.filter(u => ['teacher', 'student'].includes(u.role)).map(user => `
                                <tr style="border-bottom:1px solid #1e293b;">
                                    <td style="padding:8px 12px;font-weight:600;color:#f8fafc;">${escapeHtml(user.displayName || user.username)}</td>
                                    <td style="padding:8px 12px;font-family:monospace;direction:ltr;text-align:right;color:#38bdf8;">${escapeHtml(user.username)}</td>
                                    <td style="padding:8px 12px;"><span style="background:rgba(56,189,248,0.15);color:#38bdf8;padding:2px 6px;border-radius:4px;font-size:0.75rem;">${escapeHtml(roleTitles[user.role] || user.role)}</span></td>
                                    <td style="padding:8px 12px;color:#cbd5e1;">${escapeHtml(user.classIds ? user.classIds.join(', ') : (user.classId || '—'))}</td>
                                </tr>
                            `).join('') || `<tr><td colspan="4" style="padding:14px;text-align:center;color:#64748b;">لا يوجد معلمون أو طلاب مسجلون بعد.</td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function renderTeacherPanel() {
        var u = state.currentUser;
        var classes = (u.classIds && u.classIds.length > 0) ? u.classIds : ['grade-9a', 'grade-9b'];
        var currentClass = state.activeClassId || classes[0];

        var classStudents = state.orgUsers.filter(s => s.role === 'student' && s.classId === currentClass);

        return `
            <div style="background:rgba(15,23,42,0.6);border:1px solid #334155;border-radius:12px;padding:18px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
                    <h4 style="margin:0;color:#38bdf8;font-size:1.05rem;">👨‍🏫 لوحة المعلم وإدارة الفصول الدراسية</h4>
                    
                    <div style="display:flex;align-items:center;gap:8px;">
                        <label for="teacherClassSelect" style="font-size:0.85rem;color:#cbd5e1;font-weight:600;">الفصل النشط:</label>
                        <select id="teacherClassSelect" class="quiz-select" style="min-width:140px;padding:4px 8px;font-weight:700;color:#38bdf8;">
                            ${classes.map(c => `
                                <option value="${escapeHtml(c)}" ${c === currentClass ? 'selected' : ''}>${escapeHtml(c)}</option>
                            `).join('')}
                        </select>
                    </div>
                </div>

                <!-- Add Student to Current Class -->
                <form id="teacherAddStudentForm" onsubmit="return false;" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:10px;background:rgba(30,41,59,0.5);padding:14px;border-radius:8px;margin-bottom:18px;border:1px solid #334155;">
                    <div class="worksheet-form-group">
                        <label style="font-size:0.8rem;color:#cbd5e1;">اسم الطالب:</label>
                        <input type="text" id="teacherStudentName" class="quiz-input" placeholder="اسم الطالب" required>
                    </div>
                    <div class="worksheet-form-group">
                        <label style="font-size:0.8rem;color:#cbd5e1;">اسم المستخدم:</label>
                        <div style="display:flex;gap:4px;">
                            <input type="text" id="teacherStudentUsername" class="quiz-input" placeholder="s-xxxxxx" required style="direction:ltr;">
                            <button type="button" id="teacherGenStudentCredsBtn" class="btn btn-secondary" style="font-size:0.75rem;padding:4px 6px;">توليد 🎲</button>
                        </div>
                    </div>
                    <div class="worksheet-form-group">
                        <label style="font-size:0.8rem;color:#cbd5e1;">كلمة المرور:</label>
                        <input type="text" id="teacherStudentPassword" class="quiz-input" placeholder="كلمة المرور" required style="direction:ltr;">
                    </div>
                    <div style="grid-column:1 / -1;">
                        <div id="teacherAddStudentError" style="display:none;color:#ef4444;background:rgba(239,68,68,0.15);padding:6px 10px;border-radius:6px;font-size:0.85rem;margin-bottom:6px;"></div>
                        <button type="submit" id="teacherSubmitStudentBtn" class="quiz-submit-btn" style="width:100%;padding:8px;">
                            إضافة طالب إلى فصل (${escapeHtml(currentClass)})
                        </button>
                    </div>
                </form>

                <!-- Students Roster for Current Class -->
                <div style="display:flex;justify-content:space-between;align-items:center;margin:12px 0 8px 0;">
                    <h5 style="margin:0;color:#cbd5e1;">قائمة طلاب فصل (${escapeHtml(currentClass)}) - [${classStudents.length} طلاب]</h5>
                </div>
                <div style="max-height:240px;overflow-y:auto;border:1px solid #334155;border-radius:8px;">
                    <table style="width:100%;border-collapse:collapse;text-align:right;font-size:0.85rem;">
                        <thead>
                            <tr style="background:rgba(30,41,59,0.9);color:#94a3b8;border-bottom:1px solid #334155;">
                                <th style="padding:8px 12px;">اسم الطالب</th>
                                <th style="padding:8px 12px;">اسم المستخدم</th>
                                <th style="padding:8px 12px;">الفصل</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${classStudents.map(s => `
                                <tr style="border-bottom:1px solid #1e293b;">
                                    <td style="padding:8px 12px;font-weight:600;color:#f8fafc;">${escapeHtml(s.displayName || s.username)}</td>
                                    <td style="padding:8px 12px;font-family:monospace;direction:ltr;text-align:right;color:#38bdf8;">${escapeHtml(s.username)}</td>
                                    <td style="padding:8px 12px;color:#cbd5e1;">${escapeHtml(s.classId || currentClass)}</td>
                                </tr>
                            `).join('') || `<tr><td colspan="3" style="padding:14px;text-align:center;color:#64748b;">لا يوجد طلاب في هذا الفصل بعد.</td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function renderStudentPanel() {
        var u = state.currentUser;
        return `
            <div style="background:rgba(15,23,42,0.6);border:1px solid #334155;border-radius:12px;padding:24px;text-align:center;">
                <div style="font-size:3rem;margin-bottom:12px;">🎓</div>
                <h3 style="margin:0 0 8px 0;color:#f8fafc;">مرحباً بك يا ${escapeHtml(u.displayName || u.username)}!</h3>
                <p style="color:#94a3b8;font-size:0.9rem;margin:0 0 16px 0;">أنت مسجل كطالب في المنصة التعليمية ضمن فصلك الدراسي.</p>

                <div style="display:inline-flex;gap:20px;background:rgba(30,41,59,0.8);padding:14px 24px;border-radius:10px;border:1px solid #334155;text-align:right;">
                    <div>
                        <div style="font-size:0.8rem;color:#94a3b8;">الفصل الدراسي:</div>
                        <div style="font-size:1.1rem;color:#38bdf8;font-weight:700;">${escapeHtml(u.classId || 'غير محدد')}</div>
                    </div>
                    <div style="border-right:1px solid #475569;margin:0 8px;"></div>
                    <div>
                        <div style="font-size:0.8rem;color:#94a3b8;">حالة الحساب:</div>
                        <div style="font-size:1.1rem;color:#4ade80;font-weight:700;">نشط 🟢</div>
                    </div>
                </div>
            </div>
        `;
    }

    function attachDashboardEventHandlers() {
        // Super Admin: Create Organization
        var createOrgForm = document.getElementById('createOrgForm');
        var orgTierSelect = document.getElementById('newOrgTier');
        var demoDaysGroup = document.getElementById('demoDaysGroup');
        var genAdminBtn = document.getElementById('genAdminCredsBtn');

        if (orgTierSelect && demoDaysGroup) {
            orgTierSelect.onchange = function() {
                demoDaysGroup.style.display = this.value === 'demo' ? 'block' : 'none';
            };
        }

        if (genAdminBtn) {
            genAdminBtn.onclick = function() {
                var creds = window.firebaseGenerateCredentials('admin');
                var uInput = document.getElementById('newAdminUsername');
                var pInput = document.getElementById('newAdminPassword');
                if (uInput) uInput.value = creds.username;
                if (pInput) pInput.value = creds.password;
            };
        }

        if (createOrgForm) {
            createOrgForm.onsubmit = async function(e) {
                e.preventDefault();
                var errEl = document.getElementById('createOrgError');
                var submitBtn = document.getElementById('submitCreateOrgBtn');
                errEl.style.display = 'none';
                submitBtn.disabled = true;

                var name = document.getElementById('newOrgName').value.trim();
                var tier = document.getElementById('newOrgTier').value;
                var demoDays = parseInt(document.getElementById('newOrgDemoDays')?.value || '7', 10);
                var adminName = document.getElementById('newAdminDisplayName').value.trim();
                var adminUser = document.getElementById('newAdminUsername').value.trim();
                var adminPass = document.getElementById('newAdminPassword').value.trim();

                var orgData = {
                    name: name,
                    tier: tier,
                    demoExpiresAt: tier === 'demo' ? (Date.now() + demoDays * 86400000) : null
                };
                var adminData = {
                    displayName: adminName,
                    username: adminUser,
                    password: adminPass
                };

                var res = await window.firebaseCreateOrganization(orgData, adminData);
                submitBtn.disabled = false;
                if (res && res.ok) {
                    showCredentialDisplayModal({
                        role: 'admin',
                        displayName: adminName,
                        username: adminUser,
                        password: adminPass
                    });
                    await refreshAccountProfile();
                } else {
                    errEl.textContent = (res && res.message) ? res.message : 'فشل إنشاء المنظمة.';
                    errEl.style.display = 'block';
                }
            };
        }

        // Admin: Add Member & Remove Admin
        var adminAddMemberForm = document.getElementById('adminAddMemberForm');
        var adminRoleSelect = document.getElementById('adminNewMemberRole');
        var adminGenBtn = document.getElementById('adminGenCredsBtn');

        if (adminGenBtn) {
            adminGenBtn.onclick = function() {
                var role = adminRoleSelect ? adminRoleSelect.value : 'itStaff';
                var creds = window.firebaseGenerateCredentials(role);
                var uInput = document.getElementById('adminNewMemberUsername');
                var pInput = document.getElementById('adminNewMemberPassword');
                if (uInput) uInput.value = creds.username;
                if (pInput) pInput.value = creds.password;
            };
        }

        if (adminAddMemberForm) {
            adminAddMemberForm.onsubmit = async function(e) {
                e.preventDefault();
                var errEl = document.getElementById('adminAddMemberError');
                var submitBtn = document.getElementById('adminSubmitNewMemberBtn');
                errEl.style.display = 'none';
                submitBtn.disabled = true;

                var role = document.getElementById('adminNewMemberRole').value;
                var displayName = document.getElementById('adminNewMemberName').value.trim();
                var username = document.getElementById('adminNewMemberUsername').value.trim();
                var password = document.getElementById('adminNewMemberPassword').value.trim();

                var res = await window.firebaseAccountCreateUser({
                    username: username,
                    password: password,
                    role: role,
                    orgId: state.currentUser.orgId,
                    displayName: displayName
                });
                submitBtn.disabled = false;

                if (res && res.ok) {
                    showCredentialDisplayModal({
                        role: role,
                        displayName: displayName,
                        username: username,
                        password: password
                    });
                    await refreshAccountProfile();
                } else {
                    errEl.textContent = (res && res.message) ? res.message : 'فشل إنشاء الحساب.';
                    errEl.style.display = 'block';
                }
            };
        }

        // Admin: Delete user buttons
        var deleteBtns = document.querySelectorAll('.delete-user-btn');
        deleteBtns.forEach(function(btn) {
            btn.onclick = async function() {
                var uid = this.getAttribute('data-uid');
                var role = this.getAttribute('data-role');

                if (role === 'admin') {
                    if (state.currentOrg && state.currentOrg.adminCount <= 1) {
                        alert('لا يمكن حذف آخر مسؤول في المنظمة. يجب أن تضم المنظمة مسؤولاً واحداً على الأقل.');
                        return;
                    }
                    var conf = confirm('هل أنت متأكد من حذف هذا المسؤول؟');
                    if (!conf) return;
                    var res = await window.firebaseRemoveAdmin(state.currentUser.orgId, uid);
                    if (res && res.ok) {
                        await refreshAccountProfile();
                    } else {
                        alert((res && res.message) ? res.message : 'فشل حذف المسؤول.');
                    }
                } else {
                    var conf = confirm('هل أنت متأكد من حذف هذا الحساب؟');
                    if (!conf) return;
                    var res = await window.firebaseDeleteAccountUser(state.currentUser.orgId, uid);
                    if (res && res.ok) {
                        await refreshAccountProfile();
                    } else {
                        alert((res && res.message) ? res.message : 'فشل حذف الحساب.');
                    }
                }
            };
        });

        // IT Staff: Provision Form
        var itProvisionForm = document.getElementById('itProvisionForm');
        var itRoleSelect = document.getElementById('itNewRole');
        var itGenBtn = document.getElementById('itGenCredsBtn');
        var itClassGroup = document.getElementById('itClassIdsGroup');

        if (itRoleSelect && itClassGroup) {
            itRoleSelect.onchange = function() {
                itClassGroup.style.display = this.value === 'teacher' ? 'block' : 'none';
            };
        }

        if (itGenBtn) {
            itGenBtn.onclick = function() {
                var role = itRoleSelect ? itRoleSelect.value : 'teacher';
                var creds = window.firebaseGenerateCredentials(role);
                var uInput = document.getElementById('itNewUsername');
                var pInput = document.getElementById('itNewPassword');
                if (uInput) uInput.value = creds.username;
                if (pInput) pInput.value = creds.password;
            };
        }

        if (itProvisionForm) {
            itProvisionForm.onsubmit = async function(e) {
                e.preventDefault();
                var errEl = document.getElementById('itProvisionError');
                var submitBtn = document.getElementById('itSubmitBtn');
                errEl.style.display = 'none';
                submitBtn.disabled = true;

                var role = document.getElementById('itNewRole').value;
                var displayName = document.getElementById('itNewName').value.trim();
                var username = document.getElementById('itNewUsername').value.trim();
                var password = document.getElementById('itNewPassword').value.trim();
                var rawClasses = (document.getElementById('itClassIdsInput')?.value || '').trim();
                var classIds = rawClasses ? rawClasses.split(',').map(s => s.trim()).filter(Boolean) : null;

                var res = await window.firebaseAccountCreateUser({
                    username: username,
                    password: password,
                    role: role,
                    orgId: state.currentUser.orgId,
                    displayName: displayName,
                    classIds: classIds,
                    classId: role === 'student' ? (classIds ? classIds[0] : 'grade-9a') : null
                });
                submitBtn.disabled = false;

                if (res && res.ok) {
                    showCredentialDisplayModal({
                        role: role,
                        displayName: displayName,
                        username: username,
                        password: password,
                        classId: role === 'student' ? (classIds ? classIds[0] : 'grade-9a') : null
                    });
                    await refreshAccountProfile();
                } else {
                    errEl.textContent = (res && res.message) ? res.message : 'فشل إنشاء الحساب.';
                    errEl.style.display = 'block';
                }
            };
        }

        // Teacher: Class Switcher & Add Student
        var classSelect = document.getElementById('teacherClassSelect');
        if (classSelect) {
            classSelect.onchange = function() {
                state.activeClassId = this.value;
                renderDashboard(document.getElementById('accountSystemModalBody'));
            };
        }

        var teacherAddStudentForm = document.getElementById('teacherAddStudentForm');
        var teacherGenBtn = document.getElementById('teacherGenStudentCredsBtn');

        if (teacherGenBtn) {
            teacherGenBtn.onclick = function() {
                var creds = window.firebaseGenerateCredentials('student');
                var uInput = document.getElementById('teacherStudentUsername');
                var pInput = document.getElementById('teacherStudentPassword');
                if (uInput) uInput.value = creds.username;
                if (pInput) pInput.value = creds.password;
            };
        }

        if (teacherAddStudentForm) {
            teacherAddStudentForm.onsubmit = async function(e) {
                e.preventDefault();
                var errEl = document.getElementById('teacherAddStudentError');
                var submitBtn = document.getElementById('teacherSubmitStudentBtn');
                errEl.style.display = 'none';
                submitBtn.disabled = true;

                var displayName = document.getElementById('teacherStudentName').value.trim();
                var username = document.getElementById('teacherStudentUsername').value.trim();
                var password = document.getElementById('teacherStudentPassword').value.trim();
                var targetClass = state.activeClassId || 'grade-9a';

                var res = await window.firebaseAccountCreateUser({
                    username: username,
                    password: password,
                    role: 'student',
                    orgId: state.currentUser.orgId,
                    displayName: displayName,
                    teacherId: state.currentUser.uid,
                    classId: targetClass
                });
                submitBtn.disabled = false;

                if (res && res.ok) {
                    showCredentialDisplayModal({
                        role: 'student',
                        displayName: displayName,
                        username: username,
                        password: password,
                        classId: targetClass
                    });
                    await refreshAccountProfile();
                } else {
                    errEl.textContent = (res && res.message) ? res.message : 'فشل إنشاء حساب الطالب.';
                    errEl.style.display = 'block';
                }
            };
        }
    }

    function initAccountSystem() {
        var accountBtn = document.getElementById('accountSystemBtn');
        if (accountBtn) {
            accountBtn.addEventListener('click', openAccountModal);
        }

        var closeBtn = document.getElementById('accountSystemCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeAccountModal);
        }

        var overlay = document.getElementById('accountSystemOverlay');
        if (overlay) {
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) closeAccountModal();
            });
        }

        // Listen for auth state changes
        if (typeof window.firebaseOnAuthChange === 'function') {
            window.firebaseOnAuthChange(function(user) {
                refreshAccountProfile();
            });
        }

        // Expose public API
        window.accountSystem = {
            open: openAccountModal,
            close: closeAccountModal,
            getState: function() { return state; },
            refresh: refreshAccountProfile,
            switchClass: function(classId) {
                state.activeClassId = classId;
                renderAccountModalContent();
            },
            showCredentialsModal: showCredentialDisplayModal
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAccountSystem);
    } else {
        initAccountSystem();
    }
})();
