document.addEventListener('DOMContentLoaded', () => {
    const usersGrid = document.getElementById('users-grid');
    const userCountElement = document.getElementById('user-count');

    // افترضي أن هذه هي البيانات القادمة من الداتابيز (يمكنك مسحها وجعل المصفوفة [] فارغة)
    const students = []; 

    if (students.length === 0) {
        usersGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users-slash" style="font-size: 50px; margin-bottom: 15px; opacity: 0.3;"></i>
                <p>لا يوجد طلاب مسجلون حالياً في المنصة.</p>
            </div>
        `;
        userCountElement.innerText = "0";
    } else {
        // لو في بيانات، هنا بنرسم الكروت (يمكنك إضافة منطق الرسم هنا لاحقاً)
        userCountElement.innerText = students.length;
    }
});