
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_S3qWEjoTd1rD0i7JurMtDPIPtgV3dM4",
  authDomain: "clinic-website-71cf6.firebaseapp.com",
  projectId: "clinic-website-71cf6",
  storageBucket: "clinic-website-71cf6.firebasestorage.app",
  messagingSenderId: "897109443664",
  appId: "1:897109443664:web:531dc1ab2108c30df93d55",
  measurementId: "G-Q0HNXTCPFH"
};
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore(); 

  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const loginBtn = document.getElementById('login-btn');
  const signupBtn = document.getElementById('signup-btn');
  const loginError = document.getElementById('login-error');
  const signupError = document.getElementById('signup-error');
  const showSignup = document.getElementById('show-signup');
  const showLogin = document.getElementById('show-login');
  const langSelect = document.getElementById('language-select');
  const elements = document.querySelectorAll('[data-en], [data-ar]');
  const body = document.body;

  showSignup.onclick = () => { loginForm.style.display='none'; signupForm.style.display='block'; };
  showLogin.onclick = () => { signupForm.style.display='none'; loginForm.style.display='block'; };

  const setLanguage = (lang) => {
    body.setAttribute('dir', lang==='ar'?'rtl':'ltr');
    elements.forEach(el=>{
      const text = el.getAttribute(`data-${lang}`);
      if(text) el.textContent=text;
      const ph = el.getAttribute(`data-${lang}-placeholder`);
      if(ph) el.placeholder=ph;
    });
    langSelect.value=lang;
    localStorage.setItem('userLanguage', lang);
  };
  setLanguage(localStorage.getItem('userLanguage')||'en');
  langSelect.addEventListener('change',(e)=>setLanguage(e.target.value));

signupBtn.onclick = () => {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const role = document.getElementById('user-role').value;
    const username = document.getElementById('signup-name').value;
    signupError.textContent = '';

    auth.createUserWithEmailAndPassword(email,password)
      .then(userCredential => {
          const user = userCredential.user;
          // حفظ البيانات في Firestore
          db.collection('users').doc(user.uid).set({
              username: username,
              role: role
          })
          .then(() => {
              window.location.href = role === 'admin' ? 'admin_dashboard.html' : 'Home.html';
          });
      })
      .catch(err=>{ signupError.textContent = err.message; });
};


// loginBtn.onclick = () => {
//     const email = document.getElementById('login-email').value;
//     const password = document.getElementById('login-password').value;
//     loginError.textContent = '';

//     auth.signInWithEmailAndPassword(email,password)
//       .then(userCredential => {
//           const user = userCredential.user;
//           // جلب الـ role من Firestore
//           db.collection('users').doc(user.uid).get()
//             .then(doc => {
//                 if(doc.exists){
//                     const role = doc.data().role;
//                     window.location.href = role === 'admin' ? 'admin_dashboard.html' : 'Home.html';
//                 } else {
//                     loginError.textContent = "User role not found!";
//                 }
//             });
//       })
//       .catch(err => { loginError.textContent = err.message; });
// };

loginBtn.onclick = () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  loginError.textContent = '';

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      console.log('User UID:', user.uid); // Should print UID

db.collection('artifacts')
  .doc('default-app-id')
  .collection('users')
  .doc(user.uid)
  .get()
  .then(doc => {
    if (doc.exists) {
      const role = doc.data().role;
      window.location.href = role === 'admin' ? 'admin_dashboard.html' : 'Home.html';
    } else {
      loginError.textContent = "User role not found!";
    }
  });

    //   db.collection('users').doc(user.uid).get()
    //     .then(doc => {
    //       console.log('Doc exists:', doc.exists, 'Data:', doc.data()); // Debug
    //       if (doc.exists) {
    //         const role = doc.data().role;
    //         window.location.href = role === 'admin' ? 'admin_dashboard.html' : 'Home.html';
    //       } else {
    //         loginError.textContent = "User role not found!";
    //       }
    //     }).catch(err => {
    //       console.log('Firestore error:', err);
    //       loginError.textContent = err.message;
    //     });

    })
    .catch(err => { loginError.textContent = err.message; });
};

const passwordInput = document.getElementById('login-password');
document.querySelectorAll('.togglePassword').forEach(icon => {
  icon.addEventListener('click', () => {
    const input = icon.previousElementSibling;
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
  });
});
