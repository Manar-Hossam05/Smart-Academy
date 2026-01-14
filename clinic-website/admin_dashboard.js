import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD_S3qWEjoTd1rD0i7JurMtDPIPtgV3dM4",
    authDomain: "clinic-website-71cf6.firebaseapp.com",
    projectId: "clinic-website-71cf6",
    storageBucket: "clinic-website-71cf6.firebasestorage.app",
    messagingSenderId: "897109443664",
    appId: "1:897109443664:web:531dc1ab2108c30df93d55",
    measurementId: "G-Q0HNXTCPFH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log("JS loaded");

onAuthStateChanged(auth, (user) => { 
    console.log("Auth state changed", user);
    checkAdminStatus(user); 
});

const loadingOverlay = document.getElementById('loadingOverlay');
const unauthorizedMessage = document.getElementById('unauthorizedMessage');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const logoutBtn = document.getElementById('logout-button');
const redirectToLoginBtn = document.getElementById('redirectToLogin');
const menuToggle = document.getElementById('menuToggle');

const totalClientsEl = document.getElementById('totalClients');
const totalCoursesEl = document.getElementById('totalCourses');
const monthlyRevenueEl = document.getElementById('monthlyRevenue');

window.showCustomAlert = (message) => {
    document.getElementById('alertMessage').textContent = message;
    document.getElementById('customAlert').classList.remove('hidden');
};

const fetchAdminStats = () => {
    const statsRef = doc(db, 'admin_stats', 'summary');
    onSnapshot(statsRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            totalClientsEl.textContent = data.totalClients || '0';
            totalCoursesEl.textContent = data.totalCourses || '0';
            monthlyRevenueEl.textContent = data.monthlyRevenue || '0 JOD';
        } else {
            // إنشاء بيانات افتراضية
        }
    });
};

const checkAdminStatus = async (user) => {
    if (!user) {
        loadingOverlay.classList.add('hidden');
        unauthorizedMessage.classList.remove('hidden');
        return;
    }
    try {
        const userDocRef = doc(db, 'artifacts', 'default-app-id', 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const role = userDoc.data().role;
            loadingOverlay.classList.add('hidden');
            if (role !== 'admin') {
                unauthorizedMessage.classList.remove('hidden');
                await signOut(auth);
            } else {
                sidebar.classList.remove('hidden');
                mainContent.classList.remove('hidden');
                fetchAdminStats();
            }
        } else {
            loadingOverlay.classList.add('hidden');
            unauthorizedMessage.classList.remove('hidden');
        }
    } catch (error) {
        console.error(error);
        loadingOverlay.classList.add('hidden');
        unauthorizedMessage.classList.remove('hidden');
    }
};
const handleLogout = async () => {
    try { await signOut(auth); window.location.href = 'login.html'; }
    catch (error) { window.location.href = 'login.html'; }
};

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const logoutBtn = document.querySelector('.btn-logout');
    const toggleTheme = document.getElementById('toggleTheme');

    toggleTheme?.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        toggleTheme.textContent =
            document.body.classList.contains('dark-mode') ? '☀' : '🌙';
    });

    // Action Cards Navigation
    document.getElementById('addCourse')?.addEventListener('click', () => {
        window.location.href = 'add_course.html';
    });

    document.getElementById('manageCourses')?.addEventListener('click', () => {
        window.location.href = 'manage_courses.html';
    });

    document.getElementById('manageClients')?.addEventListener('click', () => {
        window.location.href = 'manage_clients.html';
    });

    onAuthStateChanged(auth, (user) => { checkAdminStatus(user); });
});
