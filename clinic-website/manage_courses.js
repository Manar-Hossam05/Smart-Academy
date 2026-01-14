document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('editModal');

    // 1. وظيفة التعديل (تفتح فوراً بدون رسائل)
    document.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.course-card');
            const currentTitle = card.querySelector('h3').innerText;
            const currentDesc = card.querySelector('p').innerText;

            // تعبئة البيانات في النافذة
            document.getElementById('courseTitle').value = currentTitle;
            document.getElementById('courseDesc').value = currentDesc;

            // إظهار النافذة
            modal.style.display = "flex";
        });
    });

    // 2. وظيفة الحذف (أنيميشن احترافي)
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.course-card');
            const courseTitle = card.querySelector('h3').innerText;

            if (confirm(`هل أنتِ متأكدة من حذف كورس: ${courseTitle}؟`)) {
                card.style.transform = 'scale(0.8)';
                card.style.opacity = '0';
                card.style.transition = '0.3s';
                
                setTimeout(() => {
                    card.remove();
                }, 300);
            }
        });
    });
});

// 3. دوال إغلاق النافذة (خارج DOMContentLoaded لتكون Global)
function closeModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) closeModal();
}