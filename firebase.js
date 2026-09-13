import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getFirestore, doc, setDoc, addDoc, collection, query, orderBy, getDocs, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

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

console.log('Firebase initialized for project:', firebaseConfig.projectId);