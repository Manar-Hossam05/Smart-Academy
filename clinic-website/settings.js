document.addEventListener('DOMContentLoaded', () => {
    // --- 1. تشغيل الإشعارات ---
    const trigger = document.getElementById('notif-trigger');
    const notifWindow = document.getElementById('notif-window');

    if (trigger && notifWindow) {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            notifWindow.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            notifWindow.classList.remove('active');
        });
        
        notifWindow.addEventListener('click', (e) => {
            e.stopPropagation(); // يمنع قفل القائمة لو دوستي جوه الإشعارات نفسها
        });
    }

    // --- 2. تعديل بيانات الملف الشخصي ---
    const editBtn = document.querySelector('.edit-btn');
    const dataContainer = document.getElementById('data-container');
    const adminNameDisplay = document.getElementById('admin-name-display');

    if (editBtn && dataContainer) {
        editBtn.addEventListener('click', function() {
            const isEditing = this.classList.contains('saving-mode');

            if (!isEditing) {
                const infoItems = dataContainer.querySelectorAll('.info-item p');
                infoItems.forEach(p => {
                    const currentText = p.innerText;
                    p.innerHTML = `<input type="text" value="${currentText}" class="edit-input">`;
                });

                this.innerHTML = '<i class="fas fa-save"></i> حفظ البيانات';
                this.classList.add('saving-mode');
                this.style.background = '#22c55e';
                this.style.color = '#fff';
            } else {
                const inputs = dataContainer.querySelectorAll('.edit-input');
                
                // تحديث الاسم تحت الصورة من أول Input
                if (inputs.length > 0) {
                    adminNameDisplay.innerText = inputs[0].value;
                }

                inputs.forEach(input => {
                    const parent = input.parentElement;
                    parent.innerText = input.value;
                });

                this.innerHTML = '<i class="fas fa-edit"></i> تعديل البيانات';
                this.classList.remove('saving-mode');
                this.style.background = '#f4f7fe';
                this.style.color = '#4318ff';
                alert("تم تحديث البيانات بنجاح ✅");
            }
        });
    }

    // --- 3. تغيير الصورة من الجهاز ---
    const imageUpload = document.getElementById('imageUpload');
    const profileImg = document.getElementById('profile-img');

    if (imageUpload && profileImg) {
        imageUpload.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => profileImg.src = e.target.result;
                reader.readAsDataURL(file);
            }
        });
    }

    // --- 4. تحديث كلمة المرور ---
    const savePassBtn = document.getElementById('save-pass-btn');
    if (savePassBtn) {
        savePassBtn.addEventListener('click', function() {
            const currentPass = document.getElementById('current-pass').value;
            const newPass = document.getElementById('new-pass').value;

            if (!currentPass || !newPass) {
                alert("من فضلك أدخلي كلمة المرور الحالية والجديدة ⚠️");
                return;
            }

            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحديث...';
            setTimeout(() => {
                alert("تم تغيير كلمة المرور بنجاح ✅");
                this.innerHTML = 'تحديث كلمة المرور';
                document.getElementById('current-pass').value = "";
                document.getElementById('new-pass').value = "";
            }, 1500);
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const menuLinks = document.querySelectorAll('.menu-link');
    const tabs = document.querySelectorAll('.tab-content');

    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // 1. تغيير شكل الرابط النشط
            menuLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');

            // 2. إخفاء كل الأقسام
            tabs.forEach(tab => tab.style.display = 'none');

            // 3. إظهار القسم المطلوب فقط
            const target = this.getAttribute('data-target');
            document.getElementById(target).style.display = 'block';
        });
    });
});