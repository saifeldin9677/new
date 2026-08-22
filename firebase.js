import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getFirestore, doc, setDoc, addDoc, collection, query, orderBy, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

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

window.firebaseCreateSession = async function(sessionCode, config) {
    try {
        await setDoc(doc(db, 'quizSessions', sessionCode), {
            createdAt: serverTimestamp(),
            active: true,
            config: config || null
        });
        return true;
    } catch(e) { console.error('Failed to create session:', e); return false; }
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