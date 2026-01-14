const firebaseConfig = {
  apiKey: "AIzaSyD_S3qWEjoTd1rD0i7JurMtDPIPtgV3dM4",
  authDomain: "clinic-website-71cf6.firebaseapp.com",
  projectId: "clinic-website-71cf6",
  storageBucket: "clinic-website-71cf6.firebasestorage.app",
  messagingSenderId: "897109443664",
  appId: "1:897109443664:web:531dc1ab2108c30df93d55",
  measurementId: "G-Q0HNXTCPFH"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const hiddenSections = [document.getElementById('courses-list'), document.getElementById('features-section')];
const langSelect = document.getElementById('language-select');
const elements = document.querySelectorAll('[data-en],[data-ar]');
const body = document.body;

function handleLogin(){
    window.location.href = 'login.html';
}

function handleLogout(){
    auth.signOut().then(()=> updateAuthState(localStorage.getItem('userLanguage')||'en'));
}

function updateAuthState(lang) {
    const authButton = document.getElementById('auth-button');
    const adminBtn = document.getElementById('admin-dashboard-btn');
    const isLoggedIn = !!auth.currentUser;

    if (isLoggedIn) {
        authButton.textContent = lang === 'ar' ? 'تسجيل الخروج' : 'Logout';
        authButton.onclick = handleLogout;
        
        // خلي السطر ده كدة عشان يظهر لأي حد مسجل دخول دلوقتي وتشوفيه
        adminBtn.style.display = 'inline-block'; 
        
        hiddenSections.forEach(sec => sec.style.display = 'block');
    } else {
        authButton.textContent = lang === 'ar' ? 'تسجيل الدخول / إنشاء حساب' : 'Login / Register';
        authButton.onclick = handleLogin;
        adminBtn.style.display = 'none'; 
        hiddenSections.forEach(sec => sec.style.display = 'none');
    }
}

function setLanguage(lang){
    body.className = lang==='ar'?'rtl':'';
    elements.forEach(el=>{
        if(lang==='ar' && el.dataset.ar) el.textContent = el.dataset.ar;
        else if(el.dataset.en) el.textContent = el.dataset.en;
    });
    localStorage.setItem('userLanguage', lang);
}

langSelect.addEventListener('change', e => setLanguage(e.target.value));
auth.onAuthStateChanged(()=> updateAuthState(localStorage.getItem('userLanguage')||'en'));

setLanguage(localStorage.getItem('userLanguage')||'en');
const aboutLink = document.getElementById('about-link');
const aboutSection = document.getElementById('about-section');
const closeAbout = document.getElementById('close-about');

aboutLink.addEventListener('click', e => {
    e.preventDefault(); // تمنع الصفحة من التحرك لفوق
    aboutSection.style.display = 'block';
    aboutSection.scrollIntoView({behavior: 'smooth'});
});

closeAbout.addEventListener('click', e => {
    e.preventDefault();
    aboutSection.style.display = 'none';
});
  const myAccBtn = document.getElementById("myAccount");

  myAccBtn.addEventListener("click", () => {
    window.location.href = "profile.html";
  });
document.addEventListener("DOMContentLoaded", function () {
    const myAccBtn = document.getElementById("myAccount");

    if (myAccBtn) {
        myAccBtn.addEventListener("click", function (event) {
            event.preventDefault();
            window.location.href = "profile.html";
        });
    }
});
