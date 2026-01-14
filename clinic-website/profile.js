
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
    const db = firebase.firestore();
    const storage = firebase.storage();

    // تحميل بيانات المستخدم
    // auth.onAuthStateChanged(async user => {
        // if (!user) {
            // window.location.href = "login.html";
            // return;
        // }

        const docRef = db.collection("users").doc(user.uid);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const data = docSnap.data();
            document.getElementById("name").innerText = data.name;
            document.getElementById("email").innerText = data.email;
            document.getElementById("role").innerText = data.role;
            if (data.photoURL) {
                document.getElementById("profilePic").src = data.photoURL;
            }
        }
    // });

    // تغيير الصورة
    document.getElementById("imageInput").addEventListener("change", async function() {
        const file = this.files[0];
        if (!file) return;

        const user = auth.currentUser;
        const storageRef = storage.ref(`profileImages/${user.uid}.jpg`);

        // رفع الصورة
        await storageRef.put(file);

        // الحصول على رابط الصورة
        const downloadURL = await storageRef.getDownloadURL();

        // تحديث الصورة في الصفحة
        document.getElementById("profilePic").src = downloadURL;

        // تخزين الرابط في Firestore
        await db.collection("users").doc(user.uid).update({
            photoURL: downloadURL
        });

        alert("Profile photo updated successfully!");
    });

    // زر تسجيل الخروج
    document.getElementById("logoutBtn").addEventListener("click", () => {
        auth.signOut().then(() => {
            window.location.href = "login.html";
        });
    });
