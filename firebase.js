import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, signInAnonymously, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getFirestore, doc, setDoc, addDoc, collection, query, orderBy, where, getDocs, getDoc, updateDoc, deleteDoc, onSnapshot, serverTimestamp, runTransaction, writeBatch } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

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

// Secondary Firebase App instance dedicated purely to user creation (prevents session hijacking)
let secondaryApp = (typeof getApps === 'function' ? getApps() : []).find(a => a && a.name === "AccountCreation");
if (!secondaryApp) {
    try {
        secondaryApp = initializeApp(firebaseConfig, "AccountCreation");
    } catch(e) {
        secondaryApp = (typeof getApps === 'function' ? getApps() : []).find(a => a && a.name === "AccountCreation") || app;
    }
}
const secondaryAuth = getAuth(secondaryApp);

window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseSecondaryAuth = secondaryAuth;

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

        // 5. Wrap claim in a Firestore transaction to eliminate race conditions (Fix 3)
        const teamRef = doc(db, 'simGames', gId, 'teams', matchedTeam.id);
        const claimResult = await runTransaction(db, async function(transaction) {
            const freshTeamSnap = await transaction.get(teamRef);
            if (!freshTeamSnap.exists()) {
                throw new Error('team_not_found');
            }
            const freshData = freshTeamSnap.data();
            const freshMembers = freshData.members || {};
            const freshMember = freshMembers[matchedRole];
            if (!freshMember) {
                throw new Error('role_not_found');
            }
            if (freshMember.claimedByUid && freshMember.claimedByUid !== currentUid) {
                return { ok: false, error: 'already_claimed' };
            }
            if (!freshMember.claimedByUid) {
                const updatedMembers = { ...freshMembers };
                updatedMembers[matchedRole] = {
                    ...freshMember,
                    claimedByUid: currentUid
                };
                transaction.update(teamRef, {
                    members: updatedMembers
                });
            }
            return {
                ok: true,
                teamName: freshData.name,
                teamColor: freshData.color,
                nationId: freshData.nationId || null,
                memberName: freshMember.name
            };
        });

        if (!claimResult.ok && claimResult.error === 'already_claimed') {
            return {
                ok: false,
                error: 'already_claimed',
                message: 'هذا الرمز تم استخدامه بالفعل من قبل جهاز آخر.'
            };
        }

        return {
            ok: true,
            gameId: gId,
            teamId: matchedTeam.id,
            teamName: claimResult.teamName || matchedTeam.name,
            teamColor: claimResult.teamColor || matchedTeam.color,
            nationId: claimResult.nationId !== undefined ? claimResult.nationId : (matchedTeam.nationId || null),
            role: matchedRole,
            memberName: claimResult.memberName || matchedMember.name,
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

// ──────────────────────────────────────────────────────────────
// Nation Simulation — Stage 3: Centralized Season Resolution & Collections
// ──────────────────────────────────────────────────────────────

// Centralized Season Resolution Lock (with 20s stale recovery)
window.firebaseTryClaimSeasonResolution = async function(gameId) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        const gameRef = doc(db, 'simGames', gId);
        const myUid = auth.currentUser ? auth.currentUser.uid : ('anon_' + Date.now());

        const result = await runTransaction(db, async function(transaction) {
            const gameSnap = await transaction.get(gameRef);
            if (!gameSnap.exists()) {
                return { claimed: false, error: 'game_not_found' };
            }
            const data = gameSnap.data();
            const lock = data.resolvingSeasonLock;
            if (lock && lock.uid) {
                let claimedAtMs = 0;
                if (lock.claimedAt) {
                    if (typeof lock.claimedAt.toMillis === 'function') {
                        claimedAtMs = lock.claimedAt.toMillis();
                    } else if (typeof lock.claimedAt.seconds === 'number') {
                        claimedAtMs = lock.claimedAt.seconds * 1000;
                    } else if (typeof lock.claimedAt === 'number') {
                        claimedAtMs = lock.claimedAt;
                    } else if (typeof lock.claimedAt === 'string') {
                        claimedAtMs = Date.parse(lock.claimedAt) || 0;
                    }
                }
                const nowMs = Date.now();
                // If lock is still fresh (< 20 seconds old), cannot claim
                if (nowMs - claimedAtMs < 20000) {
                    return { claimed: false, lockHeldBy: lock.uid };
                }
            }
            // Lock is free or stale (>20s) -> claim it
            transaction.update(gameRef, {
                resolvingSeasonLock: {
                    uid: myUid,
                    claimedAt: serverTimestamp()
                }
            });
            return { claimed: true, uid: myUid };
        });
        return result;
    } catch(e) {
        console.error('Failed to claim season resolution lock:', e);
        return { claimed: false, error: e.message || String(e) };
    }
};

window.firebaseReleaseSeasonResolution = async function(gameId) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        await updateDoc(doc(db, 'simGames', gId), {
            resolvingSeasonLock: { uid: null, claimedAt: null }
        });
        return { ok: true };
    } catch(e) {
        console.error('Failed to release season resolution lock:', e);
        return { ok: false, error: e.message || String(e) };
    }
};

// Fresh Fetchers for Season Resolution
window.firebaseFetchAllNations = async function(gameId) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        const snap = await getDocs(collection(db, 'simGames', gId, 'nations'));
        const nations = {};
        snap.docs.forEach(function(d) {
            nations[d.id] = { id: d.id, ...d.data() };
        });
        return nations;
    } catch(e) {
        console.error('Failed to fetch all nations:', e);
        return {};
    }
};

window.firebaseFetchAllCaravans = async function(gameId) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        const snap = await getDocs(collection(db, 'simGames', gId, 'caravans'));
        return snap.docs.map(function(d) { return { id: d.id, ...d.data() }; });
    } catch(e) {
        console.error('Failed to fetch all caravans:', e);
        return [];
    }
};

window.firebaseFetchAllScouts = async function(gameId) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        const snap = await getDocs(collection(db, 'simGames', gId, 'scouts'));
        return snap.docs.map(function(d) { return { id: d.id, ...d.data() }; });
    } catch(e) {
        console.error('Failed to fetch all scouts:', e);
        return [];
    }
};

// Batched Write for Single-Device Resolution Results
window.firebaseResolveSeasonBatch = async function(gameId, payload) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        const batch = writeBatch(db);
        const gameRef = doc(db, 'simGames', gId);

        // Update game doc with new season and year
        const gameUpdate = {
            seasonIdx: payload.seasonIdx,
            year: payload.year,
            currentSeasonStartedAt: serverTimestamp()
        };
        batch.update(gameRef, gameUpdate);

        // Update all nations
        if (payload.nations) {
            Object.keys(payload.nations).forEach(function(nId) {
                const nRef = doc(db, 'simGames', gId, 'nations', nId);
                const nData = JSON.parse(JSON.stringify(payload.nations[nId]));
                batch.set(nRef, nData, { merge: true });
            });
        }

        // Update remaining / ongoing caravans
        if (payload.caravans) {
            payload.caravans.forEach(function(c) {
                const cRef = doc(db, 'simGames', gId, 'caravans', c.id);
                batch.set(cRef, c, { merge: true });
            });
        }

        // Delete completed / arrived caravans
        if (payload.completedCaravanIds) {
            payload.completedCaravanIds.forEach(function(cId) {
                const cRef = doc(db, 'simGames', gId, 'caravans', cId);
                batch.delete(cRef);
            });
        }

        // Log events (only shared events, no spies)
        if (payload.newEvents && Array.isArray(payload.newEvents)) {
            payload.newEvents.forEach(function(evText) {
                const evId = 'ev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
                const evRef = doc(db, 'simGames', gId, 'eventsLog', evId);
                batch.set(evRef, {
                    id: evId,
                    text: evText,
                    createdAt: serverTimestamp()
                });
            });
        }

        await batch.commit();
        return { ok: true };
    } catch(e) {
        console.error('Failed to resolve season batch:', e);
        return { ok: false, error: e.message || String(e) };
    }
};

// Caravans Management
window.firebaseCreateSimCaravan = async function(gameId, caravanData) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        const cId = caravanData.id || ('c_' + Date.now());
        const payload = JSON.parse(JSON.stringify(caravanData));
        payload.id = cId;
        payload.createdAt = serverTimestamp();
        await setDoc(doc(db, 'simGames', gId, 'caravans', cId), payload);
        return { ok: true, id: cId };
    } catch(e) {
        console.error('Failed to create caravan:', e);
        return { ok: false, error: e.message || String(e) };
    }
};

window.firebaseUpdateSimCaravan = async function(gameId, caravanId, caravanData) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        const payload = JSON.parse(JSON.stringify(caravanData));
        await updateDoc(doc(db, 'simGames', gId, 'caravans', caravanId), payload);
        return { ok: true };
    } catch(e) {
        console.error('Failed to update caravan:', e);
        return { ok: false, error: e.message || String(e) };
    }
};

// Scouts Management
window.firebaseCreateSimScout = async function(gameId, scoutData) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        const sId = scoutData.id || ('scout_' + Date.now());
        const payload = JSON.parse(JSON.stringify(scoutData));
        payload.id = sId;
        payload.createdAt = serverTimestamp();
        await setDoc(doc(db, 'simGames', gId, 'scouts', sId), payload);
        return { ok: true, id: sId };
    } catch(e) {
        console.error('Failed to create scout:', e);
        return { ok: false, error: e.message || String(e) };
    }
};

// Captured Spies Management (Restricted Visibility)
window.firebaseCaptureSpy = async function(gameId, spyData) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        const spyId = spyData.id || ('spy_' + Date.now());
        const payload = {
            id: spyId,
            originNationId: spyData.originNationId || spyData.originNation,
            originTeamId: spyData.originTeamId || null,
            captorNationId: spyData.captorNationId || spyData.captorNation,
            captorTeamId: spyData.captorTeamId || null,
            name: spyData.name,
            status: spyData.status || "محتجز بغرفة التحقيق",
            detectedInCircle: spyData.detectedInCircle || "الدائرة الداخلية (0 - 30 كم)",
            createdAt: serverTimestamp()
        };
        await setDoc(doc(db, 'simGames', gId, 'capturedSpies', spyId), payload);
        return { ok: true, id: spyId };
    } catch(e) {
        console.error('Failed to record captured spy:', e);
        return { ok: false, error: e.message || String(e) };
    }
};

window.firebaseUpdateCapturedSpy = async function(gameId, spyId, updateData) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        await updateDoc(doc(db, 'simGames', gId, 'capturedSpies', spyId), updateData);
        return { ok: true };
    } catch(e) {
        console.error('Failed to update captured spy:', e);
        return { ok: false, error: e.message || String(e) };
    }
};

// Events Log
window.firebaseLogSimEvent = async function(gameId, text) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        const evId = 'ev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        await setDoc(doc(db, 'simGames', gId, 'eventsLog', evId), {
            id: evId,
            text: text,
            createdAt: serverTimestamp()
        });
        return { ok: true, id: evId };
    } catch(e) {
        console.error('Failed to log event:', e);
        return { ok: false, error: e.message || String(e) };
    }
};

// Subcollections Real-Time Listeners
window.firebaseListenSimCaravans = function(gameId, onUpdate, onError) {
    const gId = String(gameId).trim().toUpperCase();
    return onSnapshot(collection(db, 'simGames', gId, 'caravans'), function(snap) {
        if (typeof onUpdate === 'function') {
            const list = snap.docs.map(function(d) { return { id: d.id, ...d.data() }; });
            onUpdate(list);
        }
    }, function(err) {
        if (typeof onError === 'function') onError(err);
        else console.warn('Listen sim caravans error:', err);
    });
};

window.firebaseListenSimScouts = function(gameId, onUpdate, onError) {
    const gId = String(gameId).trim().toUpperCase();
    return onSnapshot(collection(db, 'simGames', gId, 'scouts'), function(snap) {
        if (typeof onUpdate === 'function') {
            const list = snap.docs.map(function(d) { return { id: d.id, ...d.data() }; });
            onUpdate(list);
        }
    }, function(err) {
        if (typeof onError === 'function') onError(err);
        else console.warn('Listen sim scouts error:', err);
    });
};

window.firebaseListenSimCapturedSpies = function(gameId, onUpdate, onError) {
    const gId = String(gameId).trim().toUpperCase();
    return onSnapshot(collection(db, 'simGames', gId, 'capturedSpies'), function(snap) {
        if (typeof onUpdate === 'function') {
            const list = snap.docs.map(function(d) { return { id: d.id, ...d.data() }; });
            onUpdate(list);
        }
    }, function(err) {
        if (typeof onError === 'function') onError(err);
        else console.warn('Listen sim captured spies error:', err);
    });
};

window.firebaseListenSimEvents = function(gameId, onUpdate, onError) {
    const gId = String(gameId).trim().toUpperCase();
    const q = query(collection(db, 'simGames', gId, 'eventsLog'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, function(snap) {
        if (typeof onUpdate === 'function') {
            const list = snap.docs.map(function(d) { return { id: d.id, ...d.data() }; });
            onUpdate(list);
        }
    }, function(err) {
        if (typeof onError === 'function') onError(err);
    });
};

// Expedition Requests (Stage 5: Military Support Request System)
window.firebaseCreateExpeditionRequest = async function(gameId, hostNationId, hostTeamId, senderNationId, senderTeamId) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        const reqId = hostNationId;
        const payload = {
            id: reqId,
            hostNationId: hostNationId,
            hostTeamId: hostTeamId,
            senderNationId: senderNationId,
            senderTeamId: senderTeamId,
            status: "pending_request",
            troopType: null,
            troopCount: null,
            foodBurden: null,
            senderConsumptionRelief: null,
            requestedAt: serverTimestamp(),
            respondedAt: null,
            expulsionNoticeAt: null,
            expulsionDeadline: null,
            resolvingUid: null,
            resolvingClaimedAt: null
        };
        await setDoc(doc(db, 'simGames', gId, 'expeditionRequests', reqId), payload);
        return { ok: true, id: reqId };
    } catch(e) {
        console.error('Failed to create expedition request:', e);
        return { ok: false, error: e.message || String(e) };
    }
};

window.firebaseUpdateExpeditionRequest = async function(gameId, requestId, updateData) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        const payload = { ...updateData };
        await updateDoc(doc(db, 'simGames', gId, 'expeditionRequests', requestId), payload);
        return { ok: true };
    } catch(e) {
        console.error('Failed to update expedition request:', e);
        return { ok: false, error: e.message || String(e) };
    }
};

window.firebaseListenSimExpeditionRequests = function(gameId, onUpdate, onError) {
    const gId = String(gameId).trim().toUpperCase();
    return onSnapshot(collection(db, 'simGames', gId, 'expeditionRequests'), function(snap) {
        if (typeof onUpdate === 'function') {
            const list = snap.docs.map(function(d) { return { id: d.id, ...d.data() }; });
            onUpdate(list);
        }
    }, function(err) {
        if (typeof onError === 'function') onError(err);
        else console.warn('Listen sim expedition requests error:', err);
    });
};

window.firebaseTryClaimExpulsionResolution = async function(gameId, requestId) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        const reqRef = doc(db, 'simGames', gId, 'expeditionRequests', requestId);
        const myUid = auth.currentUser ? auth.currentUser.uid : ('anon_' + Date.now());

        const result = await runTransaction(db, async function(transaction) {
            const reqSnap = await transaction.get(reqRef);
            if (!reqSnap.exists()) {
                return { claimed: false, error: 'request_not_found' };
            }
            const data = reqSnap.data();
            if (data.status !== 'expulsion_notice') {
                return { claimed: false, error: 'already_resolved', status: data.status };
            }
            const lockUid = data.resolvingUid;
            const lockClaimedAt = data.resolvingClaimedAt;

            if (lockUid) {
                let claimedAtMs = 0;
                if (lockClaimedAt) {
                    if (typeof lockClaimedAt.toMillis === 'function') {
                        claimedAtMs = lockClaimedAt.toMillis();
                    } else if (typeof lockClaimedAt.seconds === 'number') {
                        claimedAtMs = lockClaimedAt.seconds * 1000;
                    } else if (typeof lockClaimedAt === 'number') {
                        claimedAtMs = lockClaimedAt;
                    } else if (typeof lockClaimedAt === 'string') {
                        claimedAtMs = Date.parse(lockClaimedAt) || 0;
                    }
                }
                const nowMs = Date.now();
                if (nowMs - claimedAtMs < 20000) {
                    return { claimed: false, lockHeldBy: lockUid };
                }
            }
            transaction.update(reqRef, {
                resolvingUid: myUid,
                resolvingClaimedAt: serverTimestamp()
            });
            return { claimed: true, uid: myUid };
        });
        return result;
    } catch(e) {
        console.error('Failed to claim expulsion resolution lock:', e);
        return { claimed: false, error: e.message || String(e) };
    }
};

window.firebaseReleaseExpulsionResolution = async function(gameId, requestId) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        await updateDoc(doc(db, 'simGames', gId, 'expeditionRequests', requestId), {
            resolvingUid: null,
            resolvingClaimedAt: null
        });
        return { ok: true };
    } catch(e) {
        console.error('Failed to release expulsion resolution lock:', e);
        return { ok: false, error: e.message || String(e) };
    }
};

// Clean up all caravans, scouts, captured spies, and expedition requests in Firestore for a game (Batch Delete)
window.firebaseCleanSimulationSubcollections = async function(gameId) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        const batch = writeBatch(db);
        let count = 0;

        const [caravansSnap, scoutsSnap, spiesSnap, expeditionsSnap, missionsSnap] = await Promise.all([
            getDocs(collection(db, 'simGames', gId, 'caravans')),
            getDocs(collection(db, 'simGames', gId, 'scouts')),
            getDocs(collection(db, 'simGames', gId, 'capturedSpies')),
            getDocs(collection(db, 'simGames', gId, 'expeditionRequests')),
            getDocs(collection(db, 'simGames', gId, 'scoutMissions'))
        ]);

        caravansSnap.docs.forEach(function(docSnap) {
            batch.delete(docSnap.ref);
            count++;
        });
        scoutsSnap.docs.forEach(function(docSnap) {
            batch.delete(docSnap.ref);
            count++;
        });
        spiesSnap.docs.forEach(function(docSnap) {
            batch.delete(docSnap.ref);
            count++;
        });
        expeditionsSnap.docs.forEach(function(docSnap) {
            batch.delete(docSnap.ref);
            count++;
        });
        missionsSnap.docs.forEach(function(docSnap) {
            batch.delete(docSnap.ref);
            count++;
        });

        if (count > 0) {
            await batch.commit();
        }
        return { ok: true, deletedCount: count };
    } catch(e) {
        console.error('Failed to clean simulation subcollections:', e);
        return { ok: false, error: e.message || String(e) };
    }
};

// ──────────────────────────────────────────────────────────────
// Nation Simulation — Stage 6: Scout Intelligence, Delayed Reports & Pursuit
// ──────────────────────────────────────────────────────────────
window.firebaseCreateScoutMission = async function(gameId, missionData) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        const mId = missionData.id || ('mission_' + Date.now());
        const payload = JSON.parse(JSON.stringify({
            ...missionData,
            id: mId,
            createdAt: missionData.createdAt || Date.now()
        }));
        await setDoc(doc(db, 'simGames', gId, 'scoutMissions', mId), payload);
        return { ok: true, id: mId };
    } catch(e) {
        console.error('Failed to create scout mission:', e);
        return { ok: false, error: e.message || String(e) };
    }
};

window.firebaseUpdateScoutMission = async function(gameId, missionId, updateData) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        const payload = JSON.parse(JSON.stringify(updateData));
        await updateDoc(doc(db, 'simGames', gId, 'scoutMissions', missionId), payload);
        return { ok: true };
    } catch(e) {
        console.error('Failed to update scout mission:', e);
        return { ok: false, error: e.message || String(e) };
    }
};

window.firebaseSetScoutReportData = async function(gameId, missionId, reportData) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        const payload = JSON.parse(JSON.stringify(reportData));
        await setDoc(doc(db, 'simGames', gId, 'scoutMissions', missionId, 'report', 'data'), payload, { merge: true });
        return { ok: true };
    } catch(e) {
        console.error('Failed to set scout report data:', e);
        return { ok: false, error: e.message || String(e) };
    }
};

window.firebaseGetScoutReportData = async function(gameId, missionId) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        const snap = await getDoc(doc(db, 'simGames', gId, 'scoutMissions', missionId, 'report', 'data'));
        if (snap.exists()) {
            return { ok: true, data: snap.data() };
        }
        return { ok: false, error: 'not_found' };
    } catch(e) {
        console.warn('Failed to get scout report data:', e);
        return { ok: false, error: e.code || e.message || String(e) };
    }
};

window.firebaseListenScoutMissions = function(gameId, onUpdate, onError) {
    const gId = String(gameId).trim().toUpperCase();
    return onSnapshot(collection(db, 'simGames', gId, 'scoutMissions'), function(snap) {
        if (typeof onUpdate === 'function') {
            const list = snap.docs.map(function(d) { return { id: d.id, ...d.data() }; });
            onUpdate(list);
        }
    }, function(err) {
        if (typeof onError === 'function') onError(err);
        else console.warn('Listen scout missions error:', err);
    });
};

window.firebaseResolvePursuit = async function(gameId, missionId, arg3, arg4, arg5) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        // Sanitize parameters: remove any caller-injected boolean attempt
        const caravanId = typeof arg3 === 'string' ? arg3 : (typeof arg4 === 'string' ? arg4 : null);
        const scoutId = typeof arg4 === 'string' && arg4 !== caravanId ? arg4 : (typeof arg5 === 'string' ? arg5 : null);
        const spyData = (arg3 && typeof arg3 === 'object') ? arg3 : ((arg4 && typeof arg4 === 'object') ? arg4 : ((arg5 && typeof arg5 === 'object') ? arg5 : null));

        const missionRef = doc(db, 'simGames', gId, 'scoutMissions', missionId);
        const result = await runTransaction(db, async function(transaction) {
            const mDoc = await transaction.get(missionRef);
            if (!mDoc.exists()) {
                throw new Error('Mission not found');
            }
            const data = mDoc.data();
            if (data.pursuitResolved || data.status === 'captured') {
                return { ok: false, alreadyResolved: true };
            }

            // 1. Read the target caravan document fresh inside the transaction
            const effCaravanId = caravanId || data.targetCaravanId;
            let pChance = 0.50;
            let caravanRef = null;
            let cDoc = null;
            if (effCaravanId) {
                caravanRef = doc(db, 'simGames', gId, 'caravans', effCaravanId);
                cDoc = await transaction.get(caravanRef);
                if (cDoc.exists()) {
                    const cData = cDoc.data();
                    const escort = Number(cData.escortCavalry) || 0;
                    if (escort >= 60) pChance = 0.70;
                    else if (escort > 0) pChance = 0.55;
                    else pChance = 0.50;
                }
            }

            // 2. Roll Math.random() < pChance inside the transaction, not before calling it
            const pursuitSuccess = Math.random() < pChance;

            // 3. Write transaction updates
            const updates = {
                pursuitResolved: true,
                pursuitSuccess: pursuitSuccess,
                resolvedAt: Date.now()
            };
            if (pursuitSuccess) {
                updates.status = 'captured';
                transaction.update(missionRef, updates);

                const effScoutId = scoutId || data.scoutId;
                if (effScoutId) {
                    const scoutRef = doc(db, 'simGames', gId, 'scouts', effScoutId);
                    transaction.delete(scoutRef);
                }

                if (spyData && spyData.id) {
                    const spyRef = doc(db, 'simGames', gId, 'capturedSpies', spyData.id);
                    transaction.set(spyRef, spyData);
                }
            } else {
                transaction.update(missionRef, updates);
                if (caravanRef && cDoc && cDoc.exists()) {
                    const cData = cDoc.data();
                    const prevProg = Number(cData.progress) || 0;
                    const newProg = Math.max(0, Math.round((prevProg - 0.15) * 100) / 100);
                    transaction.update(caravanRef, {
                        progress: newProg,
                        status: "تأخرت القافلة بسبب انشغال الحراسة بمطاردة فاشلة"
                    });
                }
            }
            return { ok: true, success: pursuitSuccess, mission: data, pChance };
        });
        return result;
    } catch(e) {
        console.error('Failed to resolve pursuit transaction:', e);
        return { ok: false, error: e.message || String(e) };
    }
};

window.firebaseDeleteSimScout = async function(gameId, scoutId) {
    try {
        const gId = String(gameId).trim().toUpperCase();
        await deleteDoc(doc(db, 'simGames', gId, 'scouts', scoutId));
        return { ok: true };
    } catch(e) {
        console.error('Failed to delete scout:', e);
        return { ok: false, error: e.message || String(e) };
    }
};

// ──────────────────────────────────────────────────────────────
// Account System — Stage 1: Permanent Multi-Tenant Foundation
// ──────────────────────────────────────────────────────────────

window.firebaseToSyntheticEmail = function(username) {
    const clean = String(username || '').toLowerCase().trim().replace(/[^a-z0-9._-]/g, '');
    return `${clean}@accounts.lepidos.internal`;
};

window.firebaseGenerateCredentials = function(role) {
    const prefixMap = {
        admin: 'a-',
        itStaff: 'it-',
        teacher: 't-',
        student: 's-'
    };
    const prefix = prefixMap[role] || 'u-';
    const chars = '23456789abcdefghjkmnpqrstuvwxyz';
    let randomPart = '';
    for (let i = 0; i < 6; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const username = prefix + randomPart;

    const passChars = '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += passChars.charAt(Math.floor(Math.random() * passChars.length));
    }
    return { username, password };
};

window.firebaseAccountCreateUser = async function(params) {
    const { username, password, role, orgId, displayName, classIds, teacherId, classId } = params;
    if (!username || !password || !role) {
        return { ok: false, error: 'missing-parameters', message: 'يرجى إدخال اسم المستخدم وكلمة المرور والدور.' };
    }

    const cleanUsername = String(username).toLowerCase().trim();
    const syntheticEmail = window.firebaseToSyntheticEmail(cleanUsername);

    let newUid;
    try {
        const userCred = await createUserWithEmailAndPassword(secondaryAuth, syntheticEmail, password);
        newUid = userCred.user.uid;
    } catch(err) {
        if (err.code === 'auth/email-already-in-use') {
            return {
                ok: false,
                error: 'username-already-in-use',
                message: 'اسم المستخدم مستخدم بالفعل، يرجى اختيار اسم آخر.'
            };
        }
        return {
            ok: false,
            error: err.code || 'create-auth-failed',
            message: err.message || String(err)
        };
    } finally {
        try {
            await signOut(secondaryAuth);
        } catch(e) {}
    }

    // Write new users/{newUid} Firestore document using the primary app's Firestore reference
    try {
        const creatorUid = auth.currentUser ? auth.currentUser.uid : null;
        const userDocData = {
            role: role,
            orgId: role === 'superAdmin' ? null : orgId,
            username: cleanUsername,
            displayName: displayName || cleanUsername,
            active: true,
            createdAt: serverTimestamp(),
            createdByUid: creatorUid,
            classIds: (role === 'teacher' && Array.isArray(classIds)) ? classIds : null,
            teacherId: (role === 'student') ? (teacherId || creatorUid) : null,
            classId: (role === 'student' && classId) ? classId : null
        };

        if (role === 'admin' && orgId) {
            // When an admin is added to an existing organization, increment adminCount inside a transaction
            const orgRef = doc(db, 'organizations', orgId);
            const userRef = doc(db, 'users', newUid);
            await runTransaction(db, async (transaction) => {
                const orgDoc = await transaction.get(orgRef);
                if (orgDoc.exists()) {
                    const currentCount = Number(orgDoc.data().adminCount) || 1;
                    transaction.update(orgRef, { adminCount: currentCount + 1 });
                }
                transaction.set(userRef, userDocData);
            });
        } else {
            await setDoc(doc(db, 'users', newUid), userDocData);
        }

        return {
            ok: true,
            uid: newUid,
            user: { ...userDocData, uid: newUid }
        };
    } catch(err) {
        console.error('Failed to create user doc in Firestore:', err);
        return {
            ok: false,
            error: err.code || 'firestore-create-failed',
            message: err.message || String(err)
        };
    }
};

window.firebaseCreateOrganization = async function(orgData, adminData) {
    try {
        const orgId = orgData.orgId || ('org_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6));
        const tier = orgData.tier || 'individual';
        const demoExpiresAt = tier === 'demo' ? (orgData.demoExpiresAt || (Date.now() + 7 * 86400000)) : null;

        const cleanAdminUsername = String(adminData.username).toLowerCase().trim();
        const adminEmail = window.firebaseToSyntheticEmail(cleanAdminUsername);

        let adminUid;
        try {
            const userCred = await createUserWithEmailAndPassword(secondaryAuth, adminEmail, adminData.password);
            adminUid = userCred.user.uid;
        } catch(err) {
            if (err.code === 'auth/email-already-in-use') {
                return {
                    ok: false,
                    error: 'username-already-in-use',
                    message: 'اسم المستخدم مستخدم بالفعل، يرجى اختيار اسم آخر لمسؤول المنظمة.'
                };
            }
            return {
                ok: false,
                error: err.code || 'create-admin-failed',
                message: err.message || String(err)
            };
        } finally {
            try {
                await signOut(secondaryAuth);
            } catch(e) {}
        }

        const superAdminUid = auth.currentUser ? auth.currentUser.uid : 'superadmin';
        const orgDocData = {
            id: orgId,
            name: orgData.name,
            tier: tier,
            createdAt: serverTimestamp(),
            createdBySuperAdminUid: superAdminUid,
            adminCount: 1,
            demoExpiresAt: demoExpiresAt
        };

        const adminDocData = {
            uid: adminUid,
            role: 'admin',
            orgId: orgId,
            username: cleanAdminUsername,
            displayName: adminData.displayName || cleanAdminUsername,
            active: true,
            createdAt: serverTimestamp(),
            createdByUid: superAdminUid,
            classIds: null,
            teacherId: null,
            classId: null
        };

        const batch = writeBatch(db);
        batch.set(doc(db, 'organizations', orgId), orgDocData);
        batch.set(doc(db, 'users', adminUid), adminDocData);
        await batch.commit();

        return {
            ok: true,
            orgId: orgId,
            org: orgDocData,
            admin: adminDocData
        };
    } catch(err) {
        console.error('Failed to create organization:', err);
        return {
            ok: false,
            error: err.code || 'create-org-failed',
            message: err.message || String(err)
        };
    }
};

window.firebaseRemoveAdmin = async function(orgId, adminUid) {
    try {
        const orgRef = doc(db, 'organizations', orgId);
        const userRef = doc(db, 'users', adminUid);

        const result = await runTransaction(db, async (transaction) => {
            const orgDoc = await transaction.get(orgRef);
            if (!orgDoc.exists()) {
                throw new Error('Organization not found');
            }
            const orgData = orgDoc.data();
            const currentAdminCount = Number(orgData.adminCount) || 1;

            // Refuse if only 1 admin remaining
            if (currentAdminCount <= 1) {
                return {
                    ok: false,
                    refused: true,
                    error: 'cannot-remove-last-admin',
                    message: 'لا يمكن حذف آخر مسؤول في المنظمة. يجب أن تضم المنظمة مسؤولاً واحداً على الأقل.'
                };
            }

            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists()) {
                throw new Error('User not found');
            }
            const userData = userDoc.data();
            if (userData.role !== 'admin' || userData.orgId !== orgId) {
                throw new Error('Target user is not an admin of this organization');
            }

            transaction.delete(userRef);
            transaction.update(orgRef, {
                adminCount: currentAdminCount - 1
            });

            return {
                ok: true,
                newAdminCount: currentAdminCount - 1
            };
        });

        return result;
    } catch(err) {
        console.error('Failed to remove admin:', err);
        return {
            ok: false,
            error: err.code || err.message || String(err),
            message: err.message || String(err)
        };
    }
};

window.firebaseDeleteAccountUser = async function(orgId, uid) {
    try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return { ok: false, error: 'not-found' };
        if (userSnap.data().role === 'admin') {
            return await window.firebaseRemoveAdmin(orgId, uid);
        }
        await deleteDoc(userRef);
        return { ok: true };
    } catch(err) {
        console.error('Failed to delete user:', err);
        return { ok: false, error: err.code || err.message || String(err) };
    }
};

window.firebaseAccountSignIn = async function(username, password) {
    try {
        const syntheticEmail = window.firebaseToSyntheticEmail(username);
        const userCred = await signInWithEmailAndPassword(auth, syntheticEmail, password);
        const uid = userCred.user.uid;

        // Fetch user document from Firestore
        let userData = null;
        try {
            const userSnap = await getDoc(doc(db, 'users', uid));
            if (userSnap.exists()) {
                userData = { uid, ...userSnap.data() };
            }
        } catch(e) {
            console.warn('Could not read user profile:', e);
        }

        // Fetch organization document if applicable
        let orgData = null;
        let isExpiredDemo = false;
        if (userData && userData.orgId) {
            try {
                const orgSnap = await getDoc(doc(db, 'organizations', userData.orgId));
                if (orgSnap.exists()) {
                    orgData = orgSnap.data();
                    if (orgData.tier === 'demo' && orgData.demoExpiresAt && Date.now() >= orgData.demoExpiresAt) {
                        isExpiredDemo = true;
                    }
                }
            } catch(e) {
                // If read failed due to permission-denied on demo expiry
                if (e.code === 'permission-denied' || String(e).includes('permission-denied')) {
                    isExpiredDemo = true;
                }
            }
        }

        return {
            ok: true,
            uid: uid,
            user: userData,
            org: orgData,
            isExpiredDemo: isExpiredDemo,
            message: isExpiredDemo ? 'انتهت صلاحية الحساب التجريبي لهذه المنظمة. يرجى التواصل مع إدارة المنصة للترقية.' : null
        };
    } catch(err) {
        let msg = 'فشل تسجيل الدخول: ' + (err.message || String(err));
        if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
            msg = 'اسم المستخدم أو كلمة المرور غير صحيحة.';
        }
        return {
            ok: false,
            error: err.code || 'sign-in-failed',
            message: msg
        };
    }
};

window.firebaseAccountSignOut = async function() {
    try {
        await signOut(auth);
        return { ok: true };
    } catch(err) {
        return { ok: false, error: err.message || String(err) };
    }
};

window.firebaseAccountGetProfile = async function() {
    if (!auth.currentUser) return { ok: false, error: 'unauthenticated' };
    const uid = auth.currentUser.uid;
    try {
        const userSnap = await getDoc(doc(db, 'users', uid));
        if (!userSnap.exists()) return { ok: false, error: 'user-doc-not-found' };
        const userData = { uid, ...userSnap.data() };

        let orgData = null;
        let isExpiredDemo = false;
        if (userData.orgId) {
            try {
                const orgSnap = await getDoc(doc(db, 'organizations', userData.orgId));
                if (orgSnap.exists()) {
                    orgData = orgSnap.data();
                    if (orgData.tier === 'demo' && orgData.demoExpiresAt && Date.now() >= orgData.demoExpiresAt) {
                        isExpiredDemo = true;
                    }
                }
            } catch(e) {
                if (e.code === 'permission-denied' || String(e).includes('permission-denied')) {
                    isExpiredDemo = true;
                }
            }
        }
        return {
            ok: true,
            user: userData,
            org: orgData,
            isExpiredDemo: isExpiredDemo,
            message: isExpiredDemo ? 'انتهت صلاحية الحساب التجريبي لهذه المنظمة. يرجى التواصل مع إدارة المنصة للترقية.' : null
        };
    } catch(err) {
        const isPerm = err.code === 'permission-denied' || String(err).includes('permission-denied');
        return {
            ok: isPerm,
            error: isPerm ? null : (err.code || 'get-profile-failed'),
            user: (isPerm && auth.currentUser) ? { uid: auth.currentUser.uid, role: 'demo' } : null,
            isExpiredDemo: isPerm,
            message: isPerm ? 'انتهت صلاحية الحساب التجريبي لهذه المنظمة. يرجى التواصل مع إدارة المنصة للترقية.' : (err.message || String(err))
        };
    }
};

window.firebaseListOrgUsers = async function(orgId) {
    try {
        const q = query(collection(db, 'users'), where('orgId', '==', orgId));
        const snap = await getDocs(q);
        return {
            ok: true,
            users: snap.docs.map(d => ({ uid: d.id, ...d.data() }))
        };
    } catch(err) {
        return {
            ok: false,
            error: err.code || 'list-users-failed',
            message: err.message || String(err)
        };
    }
};

window.firebaseListOrganizations = async function() {
    try {
        const snap = await getDocs(collection(db, 'organizations'));
        return {
            ok: true,
            organizations: snap.docs.map(d => ({ id: d.id, ...d.data() }))
        };
    } catch(err) {
        return {
            ok: false,
            error: err.code || 'list-orgs-failed',
            message: err.message || String(err)
        };
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// EXPLANATION MODE: RESEARCH SUBMISSION, REVISION & APPROVAL (Stage 2a)
// ══════════════════════════════════════════════════════════════════════════════

window.firebaseSubmitResearch = async function(data) {
    if (!auth.currentUser) return { ok: false, error: 'unauthenticated', message: 'يرجى تسجيل الدخول أولاً.' };
    const uid = auth.currentUser.uid;
    try {
        const userSnap = await getDoc(doc(db, 'users', uid));
        if (!userSnap.exists()) return { ok: false, error: 'user-not-found', message: 'مستند المستخدم غير موجود.' };
        const userData = userSnap.data();
        if (userData.role !== 'student') {
            return { ok: false, error: 'permission-denied', message: 'فقط الطلاب يمكنهم تقديم بحوث جغرافية.' };
        }
        if (!userData.teacherId) {
            return { ok: false, error: 'no-teacher-assigned', message: 'لا يوجد معلم معين لهذا الطالب.' };
        }

        const submissionDoc = {
            studentUid: uid,
            studentDisplayName: data.studentDisplayName || userData.displayName || userData.username || 'طالب',
            teacherId: userData.teacherId,
            orgId: userData.orgId || null,
            title: String(data.title || '').trim(),
            summary: String(data.summary || '').trim(),
            locationName: String(data.locationName || '').trim(),
            coords: Array.isArray(data.coords) ? data.coords.map(Number) : [0, 0],
            citation: String(data.citation || '').trim(),
            sourceUrl: String(data.sourceUrl || '').trim(),
            status: 'submitted',
            teacherFeedback: null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, 'researchSubmissions'), submissionDoc);
        return { ok: true, id: docRef.id, submission: submissionDoc };
    } catch(err) {
        console.error('Failed to submit research:', err);
        return { ok: false, error: err.code || 'submit-failed', message: err.message || String(err) };
    }
};

window.firebaseReviseResearch = async function(submissionId, updateData) {
    if (!auth.currentUser) return { ok: false, error: 'unauthenticated', message: 'يرجى تسجيل الدخول أولاً.' };
    try {
        const subRef = doc(db, 'researchSubmissions', submissionId);
        const patch = {
            title: String(updateData.title || '').trim(),
            summary: String(updateData.summary || '').trim(),
            locationName: String(updateData.locationName || '').trim(),
            coords: Array.isArray(updateData.coords) ? updateData.coords.map(Number) : [0, 0],
            citation: String(updateData.citation || '').trim(),
            sourceUrl: String(updateData.sourceUrl || '').trim(),
            status: 'submitted',
            updatedAt: serverTimestamp()
        };
        await updateDoc(subRef, patch);
        return { ok: true, id: submissionId };
    } catch(err) {
        console.error('Failed to revise research:', err);
        return { ok: false, error: err.code || 'revise-failed', message: err.message || String(err) };
    }
};

window.firebaseReviewResearch = async function(submissionId, reviewStatus, feedback) {
    if (!auth.currentUser) return { ok: false, error: 'unauthenticated', message: 'يرجى تسجيل الدخول أولاً.' };
    try {
        const subRef = doc(db, 'researchSubmissions', submissionId);
        const patch = {
            status: reviewStatus,
            teacherFeedback: (reviewStatus === 'needs_revision') ? (String(feedback || '').trim() || 'يرجى مراجعة البحث وتعديل الملاحظات.') : null,
            updatedAt: serverTimestamp()
        };
        await updateDoc(subRef, patch);
        return { ok: true, id: submissionId, status: reviewStatus };
    } catch(err) {
        console.error('Failed to review research:', err);
        return { ok: false, error: err.code || 'review-failed', message: err.message || String(err) };
    }
};

window.firebaseGetClassApprovedResearch = async function(teacherId) {
    try {
        const q = query(
            collection(db, 'researchSubmissions'),
            where('status', '==', 'approved'),
            where('teacherId', '==', teacherId)
        );
        const snap = await getDocs(q);
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        return { ok: true, submissions: list };
    } catch(err) {
        console.error('Failed to get approved research:', err);
        return { ok: false, error: err.code || 'get-approved-failed', message: err.message || String(err), submissions: [] };
    }
};

window.firebaseGetTeacherReviewQueue = async function(teacherId) {
    try {
        const q = query(
            collection(db, 'researchSubmissions'),
            where('teacherId', '==', teacherId)
        );
        const snap = await getDocs(q);
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        return { ok: true, submissions: list };
    } catch(err) {
        console.error('Failed to get teacher review queue:', err);
        return { ok: false, error: err.code || 'get-queue-failed', message: err.message || String(err), submissions: [] };
    }
};

window.firebaseGetStudentSubmissions = async function(studentUid) {
    try {
        const q = query(
            collection(db, 'researchSubmissions'),
            where('studentUid', '==', studentUid)
        );
        const snap = await getDocs(q);
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        return { ok: true, submissions: list };
    } catch(err) {
        console.error('Failed to get student submissions:', err);
        return { ok: false, error: err.code || 'get-student-submissions-failed', message: err.message || String(err), submissions: [] };
    }
};

// ──────────────────────────────────────────────────────────────
// Explanation Mode: Stage 2b Live Control Handoff & Collaborative Drawing
// ──────────────────────────────────────────────────────────────
window.firebaseInitLiveClass = async function(classId, teacherId) {
    if (!classId) return { ok: false, error: 'no-class-id' };
    try {
        const classRef = doc(db, 'liveClasses', classId);
        const snap = await getDoc(classRef);
        if (!snap.exists()) {
            await setDoc(classRef, {
                teacherId: teacherId || (auth.currentUser ? auth.currentUser.uid : null),
                activeControllerUid: null,
                currentMapView: null,
                updatedAt: serverTimestamp()
            });
        }
        return { ok: true, classId };
    } catch(err) {
        console.error('Failed to init live class:', err);
        return { ok: false, error: err.code || 'init-failed', message: err.message || String(err) };
    }
};

window.firebaseGrantLiveControl = async function(classId, studentUid) {
    if (!classId || !studentUid) return { ok: false, error: 'missing-args' };
    try {
        const classRef = doc(db, 'liveClasses', classId);
        await updateDoc(classRef, {
            activeControllerUid: studentUid,
            updatedAt: serverTimestamp()
        });
        return { ok: true, activeControllerUid: studentUid };
    } catch(err) {
        console.error('Failed to grant control:', err);
        return { ok: false, error: err.code || 'grant-failed', message: err.message || String(err) };
    }
};

window.firebaseRevokeLiveControl = async function(classId) {
    if (!classId) return { ok: false, error: 'no-class-id' };
    try {
        const classRef = doc(db, 'liveClasses', classId);
        await updateDoc(classRef, {
            activeControllerUid: null,
            updatedAt: serverTimestamp()
        });
        return { ok: true, activeControllerUid: null };
    } catch(err) {
        console.error('Failed to revoke control:', err);
        return { ok: false, error: err.code || 'revoke-failed', message: err.message || String(err) };
    }
};

window.firebaseRaiseHand = async function(classId, studentUid, displayName) {
    if (!classId || !studentUid) return { ok: false, error: 'missing-args' };
    try {
        const handRef = doc(db, 'liveClasses', classId, 'handRaises', studentUid);
        await setDoc(handRef, {
            displayName: displayName || 'طالب',
            raisedAt: serverTimestamp()
        });
        return { ok: true };
    } catch(err) {
        console.error('Failed to raise hand:', err);
        return { ok: false, error: err.code || 'raise-failed', message: err.message || String(err) };
    }
};

window.firebaseLowerHand = async function(classId, studentUid) {
    if (!classId || !studentUid) return { ok: false, error: 'missing-args' };
    try {
        const handRef = doc(db, 'liveClasses', classId, 'handRaises', studentUid);
        await deleteDoc(handRef);
        return { ok: true };
    } catch(err) {
        console.error('Failed to lower hand:', err);
        return { ok: false, error: err.code || 'lower-failed', message: err.message || String(err) };
    }
};

window.firebaseUpdateLiveMapView = async function(classId, mapView) {
    if (!classId || !mapView) return { ok: false, error: 'missing-args' };
    try {
        const classRef = doc(db, 'liveClasses', classId);
        await updateDoc(classRef, {
            currentMapView: mapView,
            updatedAt: serverTimestamp()
        });
        return { ok: true };
    } catch(err) {
        console.error('Failed to update map view:', err);
        return { ok: false, error: err.code || 'map-view-failed', message: err.message || String(err) };
    }
};

window.firebaseAddLiveAnnotation = async function(classId, annotationData) {
    if (!classId || !annotationData) return { ok: false, error: 'missing-args' };
    try {
        const annColl = collection(db, 'liveClasses', classId, 'annotations');
        const docRef = await addDoc(annColl, {
            type: annotationData.type || 'highlight',
            authorUid: auth.currentUser ? auth.currentUser.uid : (annotationData.authorUid || null),
            data: annotationData.data || {},
            createdAt: serverTimestamp()
        });
        return { ok: true, id: docRef.id };
    } catch(err) {
        console.error('Failed to add live annotation:', err);
        return { ok: false, error: err.code || 'add-annotation-failed', message: err.message || String(err) };
    }
};

window.firebaseClearLiveAnnotations = async function(classId) {
    if (!classId) return { ok: false, error: 'no-class-id' };
    try {
        const annColl = collection(db, 'liveClasses', classId, 'annotations');
        const snap = await getDocs(annColl);
        if (snap.empty) return { ok: true, count: 0 };
        const batch = writeBatch(db);
        snap.docs.forEach(d => {
            batch.delete(d.ref);
        });
        await batch.commit();
        return { ok: true, count: snap.docs.length };
    } catch(err) {
        console.error('Failed to clear live annotations:', err);
        return { ok: false, error: err.code || 'clear-failed', message: err.message || String(err) };
    }
};

window.firebaseListenLiveClass = function(classId, callback) {
    if (!classId || typeof callback !== 'function') return () => {};
    const classRef = doc(db, 'liveClasses', classId);
    return onSnapshot(classRef, (snap) => {
        if (snap.exists()) {
            callback({ id: snap.id, ...snap.data() });
        } else {
            callback(null);
        }
    }, (err) => {
        console.warn('liveClass listener error:', err);
    });
};

window.firebaseListenLiveHandRaises = function(classId, callback) {
    if (!classId || typeof callback !== 'function') return () => {};
    const handColl = collection(db, 'liveClasses', classId, 'handRaises');
    return onSnapshot(handColl, (snap) => {
        const list = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
        callback(list);
    }, (err) => {
        console.warn('liveHandRaises listener error:', err);
    });
};

window.firebaseListenLiveAnnotations = function(classId, callback) {
    if (!classId || typeof callback !== 'function') return () => {};
    const annColl = collection(db, 'liveClasses', classId, 'annotations');
    return onSnapshot(annColl, (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(list);
    }, (err) => {
        console.warn('liveAnnotations listener error:', err);
    });
};

console.log('Firebase initialized for project:', firebaseConfig.projectId);