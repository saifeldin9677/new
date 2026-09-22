import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getFirestore, doc, setDoc, addDoc, collection, query, orderBy, getDocs, getDoc, updateDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC_o_-C7NFeTQwFb-kZRCI59HnTc2DDTUA",
    authDomain: "lepidos-map.firebaseapp.com",
    projectId: "lepidos-map",
    storageBucket: "lepidos-map.firebasestorage.app",
    messagingSenderId: "262733147860",
    appId: "1:262733147860:web:2d6b7f0a7712a56c011541",
    measurementId: "G-KC56R3GJJJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDb = db;

// --- Step 1a: Teacher Auth Helpers ---
window.firebaseTeacherSignIn = async function(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { ok: true, uid: userCredential.user.uid };
    } catch(e) {
        console.warn('Teacher sign-in failed:', e);
        return { ok: false, error: e.message || String(e) };
    }
};

window.firebaseTeacherSignOut = async function() {
    try {
        await signOut(auth);
        return { ok: true };
    } catch(e) {
        console.warn('Teacher sign-out failed:', e);
        return { ok: false, error: e.message || String(e) };
    }
};

window.firebaseOnAuthChange = function(callback) {
    return onAuthStateChanged(auth, callback);
};

window.firebaseCheckIsTeacher = async function(uid) {
    try {
        if (!uid) return false;
        const snap = await getDoc(doc(db, 'teachers', uid));
        return snap.exists();
    } catch(e) {
        console.warn('Check is teacher failed:', e);
        return false; // Fail closed, never fail open
    }
};

// --- Step 1b: Session Questions Reader (Cross-device support) ---
window.firebaseGetSessionQuestions = async function(sessionCode) {
    try {
        if (!sessionCode) return [];
        const code = sessionCode.toUpperCase();
        const snap = await getDoc(doc(db, 'quizSessions', code, 'quizContent', 'questions'));
        if (snap.exists()) {
            const data = snap.data();
            return Array.isArray(data?.questions) ? data.questions : [];
        }
        return [];
    } catch(e) {
        console.warn('Failed to get session questions:', e);
        return [];
    }
};

// --- Step 1c: Session Creator (Separates metadata from quiz content) ---
window.firebaseCreateSession = async function(sessionCode, config) {
    try {
        const code = sessionCode.toUpperCase();
        await setDoc(doc(db, 'quizSessions', code), {
            createdAt: serverTimestamp(),
            active: true,
            config: {
                title: config?.title ?? null,
                topic: config?.topic ?? null,
                numQuestions: config?.numQuestions ?? null,
                className: config?.className ?? null
                // deliberately NO customQuestions / correctAnswer here
            }
        });

        if (Array.isArray(config?.customQuestions) && config.customQuestions.length > 0) {
            await setDoc(doc(db, 'quizSessions', code, 'quizContent', 'questions'), {
                questions: config.customQuestions,
                createdAt: serverTimestamp()
            });
        }

        return true;
    } catch(e) {
        console.error('Failed to create session:', e);
        return false;
    }
};

window.firebaseSaveQuizResult = async function(sessionCode, studentName, score, total, timeTaken, answers) {
    try {
        await addDoc(collection(db, 'quizSessions', sessionCode.toUpperCase(), 'results'), {
            sessionCode: sessionCode.toUpperCase(),
            studentName: studentName,
            score: score,
            total: total,
            timeTaken: timeTaken || null,
            answers: answers || [],
            completedAt: serverTimestamp()
        });
        return true;
    } catch(e) { console.error('Failed to save result:', e); return false; }
};

window.firebaseGetResultsForSession = async function(sessionCode) {
    try {
        const q = query(collection(db, 'quizSessions', sessionCode.toUpperCase(), 'results'), orderBy('completedAt', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(function(d) { return { id: d.id, ...d.data() }; });
    } catch(e) { console.error('Failed to fetch results:', e); return []; }
};

// ──────────────────────────────────────────────────────────────
// Nation Simulation — Stage 1: Multiplayer Foundation
// ──────────────────────────────────────────────────────────────

// Anonymous Auth for Students / Devices
window.firebaseSignInAnonymous = async function() {
    try {
        if (auth.currentUser) {
            return { ok: true, uid: auth.currentUser.uid };
        }
        const userCredential = await signInAnonymously(auth);
        return { ok: true, uid: userCredential.user.uid };
    } catch(e) {
        console.warn('Anonymous sign-in failed:', e);
        return { ok: false, error: e.message || String(e) };
    }
};

// Client-side SHA-256 Join Code Hasher (avoids storing plaintext codes in Firestore)
window.firebaseHashJoinCode = async function(rawCode) {
    if (!rawCode) return '';
    const clean = String(rawCode).trim().toUpperCase();
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle && typeof window.crypto.subtle.digest === 'function') {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(clean);
            const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
        } catch(e) {}
    }
    // Pure JS SHA-256 fallback for non-secure origins / headless test contexts
    function rightRotate(value, amount) { return (value >>> amount) | (value << (32 - amount)); }
    var mathPow = Math.pow, maxWord = mathPow(2, 32), lengthProperty = 'length';
    var i, j, result = '', words = [], asciiBitLength = clean[lengthProperty] * 8;
    var hash = [], k = [], primeCounter = 0, isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
            hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
            k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
        }
    }
    var clean_ascii = clean + '\x80';
    while ((clean_ascii[lengthProperty] % 64) - 56) clean_ascii += '\x00';
    for (i = 0; i < clean_ascii[lengthProperty]; i++) {
        j = clean_ascii.charCodeAt(i);
        words[i >> 2] |= j << (((3 - i) % 4) * 8);
    }
    words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
    words[words[lengthProperty]] = asciiBitLength;
    for (j = 0; j < words[lengthProperty];) {
        var w = words.slice(j, j += 16), oldHash = hash;
        hash = hash.slice(0, 8);
        for (i = 0; i < 64; i++) {
            var w15 = w[i - 15], w2 = w[i - 2];
            var s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
            var s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
            w[i] = (i < 16) ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0;
            var ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
            var maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
            var temp1 = (hash[7] + (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)) + ch + k[i] + w[i]) | 0;
            var temp2 = ((rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22)) + maj) | 0;
            hash = [(temp1 + temp2) | 0].concat(hash);
            hash[4] = (hash[4] + temp1) | 0;
        }
        for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
    }
    for (i = 0; i < 8; i++) {
        for (var b = 3; b >= 0; b--) {
            var byte = (hash[i] >> (b * 8)) & 255;
            result += (byte < 16 ? '0' : '') + byte.toString(16);
        }
    }
    return result;
};

// Create a new Multiplayer Game Document (Teacher)
window.firebaseCreateSimGame = async function(gameId, config) {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) return { ok: false, error: 'not_authenticated', message: 'المعلم غير مسجل الدخول' };
        const gId = String(gameId).trim().toUpperCase();
        await setDoc(doc(db, 'simGames', gId), {
            teacherId: currentUser.uid,
            status: 'setup',
            gamePace: config?.gamePace || 'weekly_semester',
            seasonDuration: Number(config?.seasonDuration) || 604800,
            seasonIdx: 0,
            year: Number(config?.year) || 1250,
            currentSeasonStartedAt: serverTimestamp(),
            createdAt: serverTimestamp()
        });
        return { ok: true, gameId: gId };
    } catch(e) {
        console.error('Failed to create sim game:', e);
        return { ok: false, error: e.message || String(e) };
    }
};

// Batch create or set Teams for a Game
window.firebaseCreateSimTeams = async function(gameId, teamsData) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        for (const t of teamsData) {
            const teamRef = doc(db, 'simGames', gId, 'teams', t.id);
            await setDoc(teamRef, {
                name: t.name,
                color: t.color || '#3b82f6',
                nationId: t.nationId || null,
                members: t.members
            });
        }
        return { ok: true };
    } catch(e) {
        console.error('Failed to create sim teams:', e);
        return { ok: false, error: e.message || String(e) };
    }
};

// Student Join: Lookup Team/Role by Hashed Code and Claim Slot with anonymous UID
window.firebaseLookupAndClaimJoinCode = async function(gameId, rawJoinCode) {
    try {
        if (!gameId || !rawJoinCode) {
            return { ok: false, error: 'missing_params', message: 'يرجى إدخال رمز اللعبة ورمز الانضمام الشخصي.' };
        }
        const gId = String(gameId).trim().toUpperCase();

        // 1. Ensure signed-in anonymously
        let currentUid = auth.currentUser ? auth.currentUser.uid : null;
        if (!currentUid) {
            const authRes = await window.firebaseSignInAnonymous();
            if (!authRes.ok) {
                return { ok: false, error: 'auth_failed', message: 'تعذر الاتصال بمزود المصادقة السحابي.' };
            }
            currentUid = authRes.uid;
        }

        // 2. Hash the raw join code
        const hashed = await window.firebaseHashJoinCode(rawJoinCode);

        // 3. Verify game exists
        const gameSnap = await getDoc(doc(db, 'simGames', gId));
        if (!gameSnap.exists()) {
            return { ok: false, error: 'game_not_found', message: 'لم يتم العثور على لعبة نشطة بهذا الرمز (' + gId + ').' };
        }

        // 4. Fetch teams and search members client-side
        const teamsSnap = await getDocs(collection(db, 'simGames', gId, 'teams'));
        if (teamsSnap.empty) {
            return { ok: false, error: 'no_teams', message: 'لا توجد فرق مضافة إلى هذه اللعبة بعد.' };
        }

        let matchedTeam = null;
        let matchedRole = null;
        let matchedMember = null;

        for (const teamDoc of teamsSnap.docs) {
            const tData = teamDoc.data();
            const mems = tData.members || {};
            for (const rKey of ['leader', 'military', 'intelligence', 'economy', 'planner']) {
                const m = mems[rKey];
                if (m && m.joinCodeHash === hashed) {
                    matchedTeam = { id: teamDoc.id, ...tData };
                    matchedRole = rKey;
                    matchedMember = m;
                    break;
                }
            }
            if (matchedTeam) break;
        }

        if (!matchedTeam || !matchedRole || !matchedMember) {
            return { ok: false, error: 'invalid_code', message: 'رمز الانضمام غير صحيح. تحقق من الأحرف المدخلة.' };
        }

        // 5. Check claiming lock
        if (matchedMember.claimedByUid && matchedMember.claimedByUid !== currentUid) {
            return {
                ok: false,
                error: 'already_claimed',
                message: 'هذا الرمز تم استخدامه بالفعل من قبل جهاز آخر.'
            };
        }

        // 6. Write claimedByUid if not claimed yet
        if (!matchedMember.claimedByUid) {
            const updatedMembers = { ...matchedTeam.members };
            updatedMembers[matchedRole] = {
                ...matchedMember,
                claimedByUid: currentUid
            };
            await updateDoc(doc(db, 'simGames', gId, 'teams', matchedTeam.id), {
                members: updatedMembers
            });
            matchedMember.claimedByUid = currentUid;
        }

        return {
            ok: true,
            gameId: gId,
            teamId: matchedTeam.id,
            teamName: matchedTeam.name,
            teamColor: matchedTeam.color,
            nationId: matchedTeam.nationId || null,
            role: matchedRole,
            memberName: matchedMember.name,
            uid: currentUid
        };
    } catch(e) {
        console.error('Failed to lookup/claim join code:', e);
        return { ok: false, error: e.message || String(e), message: 'حدث خطأ غير متوقع: ' + (e.message || String(e)) };
    }
};

// Check if an existing stored session is still valid for this UID
window.firebaseCheckSimSession = async function(gameId, teamId, role) {
    try {
        if (!gameId || !teamId || !role) return { valid: false };
        const gId = String(gameId).trim().toUpperCase();
        let currentUid = auth.currentUser ? auth.currentUser.uid : null;
        if (!currentUid) {
            const authRes = await window.firebaseSignInAnonymous();
            if (!authRes.ok) return { valid: false };
            currentUid = authRes.uid;
        }
        const snap = await getDoc(doc(db, 'simGames', gId, 'teams', teamId));
        if (!snap.exists()) return { valid: false };
        const tData = snap.data();
        const mem = tData.members && tData.members[role];
        if (mem && mem.claimedByUid === currentUid) {
            return {
                valid: true,
                gameId: gId,
                teamId: teamId,
                teamName: tData.name,
                teamColor: tData.color,
                nationId: tData.nationId || null,
                role: role,
                memberName: mem.name,
                uid: currentUid
            };
        }
        return { valid: false };
    } catch(e) {
        return { valid: false, error: e };
    }
};

// Teacher Reset Capability: Regenerate a single member's join code hash & clear claimedByUid
window.firebaseRegenerateMemberCode = async function(gameId, teamId, role, newHash) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        const teamRef = doc(db, 'simGames', gId, 'teams', teamId);
        const snap = await getDoc(teamRef);
        if (!snap.exists()) return { ok: false, error: 'team_not_found' };
        const data = snap.data();
        const members = { ...data.members };
        if (!members[role]) return { ok: false, error: 'role_not_found' };
        members[role] = {
            ...members[role],
            joinCodeHash: newHash,
            claimedByUid: null
        };
        await updateDoc(teamRef, { members: members });
        return { ok: true };
    } catch(e) {
        console.error('Failed to regenerate member code:', e);
        return { ok: false, error: e.message || String(e) };
    }
};

// Assign Nation Territory to Team and Sync Initial Nation Object
window.firebaseAssignTeamNation = async function(gameId, teamId, nationId, nationData) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        await updateDoc(doc(db, 'simGames', gId, 'teams', teamId), {
            nationId: nationId
        });
        const nationPayload = JSON.parse(JSON.stringify(nationData));
        nationPayload.ownerTeamId = teamId;
        await setDoc(doc(db, 'simGames', gId, 'nations', nationId), nationPayload);
        return { ok: true };
    } catch(e) {
        console.error('Failed to assign team nation:', e);
        return { ok: false, error: e.message || String(e) };
    }
};

// Live Nation Mirror Sync (Debounced mutations)
window.firebaseSyncNation = async function(gameId, nationId, nationData) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        const nationPayload = JSON.parse(JSON.stringify(nationData));
        await setDoc(doc(db, 'simGames', gId, 'nations', nationId), nationPayload, { merge: true });
        return { ok: true };
    } catch(e) {
        console.error('Failed to sync nation:', e);
        return { ok: false, error: e.message || String(e) };
    }
};

// Real-Time Listeners (onSnapshot)
window.firebaseListenSimGame = function(gameId, onUpdate, onError) {
    const gId = String(gameId).trim().toUpperCase();
    return onSnapshot(doc(db, 'simGames', gId), function(snap) {
        if (snap.exists() && typeof onUpdate === 'function') {
            onUpdate({ id: snap.id, ...snap.data() });
        }
    }, function(err) {
        if (typeof onError === 'function') onError(err);
        else console.warn('Listen sim game error:', err);
    });
};

window.firebaseListenSimTeams = function(gameId, onUpdate, onError) {
    const gId = String(gameId).trim().toUpperCase();
    return onSnapshot(collection(db, 'simGames', gId, 'teams'), function(snap) {
        if (typeof onUpdate === 'function') {
            const list = snap.docs.map(function(d) { return { id: d.id, ...d.data() }; });
            onUpdate(list);
        }
    }, function(err) {
        if (typeof onError === 'function') onError(err);
        else console.warn('Listen sim teams error:', err);
    });
};

window.firebaseListenSimNations = function(gameId, onUpdate, onError) {
    const gId = String(gameId).trim().toUpperCase();
    return onSnapshot(collection(db, 'simGames', gId, 'nations'), function(snap) {
        if (typeof onUpdate === 'function') {
            const list = snap.docs.map(function(d) { return { id: d.id, ...d.data() }; });
            onUpdate(list);
        }
    }, function(err) {
        if (typeof onError === 'function') onError(err);
        else console.warn('Listen sim nations error:', err);
    });
};

// Season Clock Advance in Firestore
window.firebaseAdvanceSimSeason = async function(gameId, updateData) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        const payload = {
            seasonIdx: updateData.seasonIdx,
            year: updateData.year,
            currentSeasonStartedAt: serverTimestamp()
        };
        if (updateData.status) payload.status = updateData.status;
        await updateDoc(doc(db, 'simGames', gId), payload);
        return { ok: true };
    } catch(e) {
        console.error('Failed to advance season in firestore:', e);
        return { ok: false, error: e.message || String(e) };
    }
};

console.log('Firebase initialized for project:', firebaseConfig.projectId);