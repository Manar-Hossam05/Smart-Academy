// دالة حجز الكورس
function bookCourse(courseName) {
    // 1. تخزين اسم الكورس في ذاكرة المتصفح
    localStorage.setItem('selectedCourseName', courseName);
    
    // 2. توجيه الطالب لصفحة التسجيل (Enrollment)
    // ملاحظة: لو عاوزه تروحي للداشبورد علطول غيري اسم الصفحة هنا
    window.location.href = "enrollment.html"; 
}
