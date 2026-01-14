// active-course.js

function checkCode() {
    const codeInput = document.getElementById('code');
    const errorElement = document.getElementById('error');
    const btn = document.getElementById('activate-btn');

    // إعادة ضبط الرسائل
    errorElement.innerText = "";

    if (codeInput.value.trim() === "") {
        errorElement.innerText = "لطفاً، أدخل الكود أولاً لتتمكن من التفعيل ⚠️";
        return;
    }

    // تأثير ضغط الزر
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> جاري التحقق...';
    btn.style.opacity = "0.7";
    btn.disabled = true;

    // محاكاة الاتصال بالسيرفر (سيتم ربطه لاحقاً بالداتا بيز)
    setTimeout(() => {
        // لنفترض أن كود التفعيل التجريبي هو 2026
        if (codeInput.value === "2026") {
            alert("مبروك! تم تفعيل الكورس بنجاح ✅");
            window.location.href = "dashboard.html"; // يوجهه للوحة التحكم
        } else {
            errorElement.innerText = "عذراً، هذا الكود غير صحيح أو منتهي الصلاحية ❌";
            btn.innerHTML = '<span class="btn-text">تفعيل الكورس الآن</span> <i class="fas fa-arrow-left"></i>';
            btn.style.opacity = "1";
            btn.disabled = false;
        }
    }, 1500);
}
