        document.addEventListener('DOMContentLoaded', () => {
            const params = new URLSearchParams(window.location.search);
            const courseCode = params.get('course')
            const courseNameElement = document.getElementById('course-name');
            const courseMap = {
                'read_audiogram': 'How to read an audiogram',
                'basic_assessment': 'Basic audiological assessment',
                'tympanometry': 'Tympanometry'
            };

            if (courseCode && courseMap[courseCode]) {
                courseNameElement.textContent = courseMap[courseCode];
            } else {
                courseNameElement.textContent = 'A Course (No specific course selected)';
            }
        });
    