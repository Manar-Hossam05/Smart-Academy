let currentLesson = 0;
let currentQuestion = 0;
let userAnswers = [];
document.addEventListener('DOMContentLoaded', function() {
    const selectedCourse = localStorage.getItem('selectedCourseName'); 
    const nameDisplay = document.getElementById('course-name-display');
    nameDisplay.innerText = selectedCourse || "Fundamentals of Audiovestibular Medicine";

    // استعادة التقدم
    const savedProgress = localStorage.getItem('unlockedUntil');
    if (savedProgress) {
        for (let i = 1; i <= savedProgress; i++) {
            const item = document.getElementById('L' + i);
            if (item) {
                item.classList.remove('locked');
                item.querySelector('i').className = 'fas fa-check-circle';
                item.setAttribute('onclick', `changeLesson(${i})`);
            }
        }
    }
});
const courseData = [
    {
        // الدرس الأول
        title: "Lesson 1: What is Audiovestibular Medicine?", 
        video: "https://www.youtube.com/embed/رابط_الفيديو_هنا", // حطي هنا رابط الفيديو
        pdf: "materials/lesson1.pdf", // رابط ملف الـ PDF
        questions: [
            { 
                q: "1. Audiovestibular Medicine is best described as a specialty that primarily focuses on:", 
                options: [
                    "A. Ear surgery", 
                    "B. Functional evaluation of hearing and balance", 
                    "C. Psychiatric assessment of tinnitus", 
                    "D. Pure audiology only"
                ], 
                correct: 1 
            },
            {
                q:"2. A key distinguishing feature of AVM is that it is:",
                options:[
                    "A. Organ-based",
                    "B. Only concerned with peripheral disorders",
                    "C. Symptom-based and integrative",
                    "D. Focused on surgical management"
                ],
                correct: 2
            },
            {
                q: "3. Which of the following is MOST typical of AVM practice?",
                options: [
                    "A. Treatment of middle ear infections",
                    "B. Functional testing such as ABR, VEMP, vHIT",
                    "C. Performing mastoid surgeries",
                    "D. Neuroimaging interpretation only"
                ],
                correct: 1
            },
            {
                q: "4. A patient with dizziness, hearing fluctuation, and tinnitus is best managed by:",
                options :[
                    "A. Orthopedic surgeon",
                    "B. Ophthalmologist",
                    "C. Audiovestibular specialist",
                    "D. Dermatologist"
                ],
                correct : 2
            },
            {
                q: "5. The multidisciplinary nature of AVM includes collaboration with all EXCEPT:",
                options:[
                    "A. Neurologists",
                    "B. Physiotherapists",
                    "C. Psychologists",
                    "D. Cardiothoracic surgeons"
                ],
                correct :3
            },
        ]
    },
    {
        // الدرس الثاني
        title: "clinical workflow in AVM", 
        video: "https://www.youtube.com/embed/رابط_الفيديو_2", 
        pdf: "materials/lesson2.pdf",
        questions: [
            { q: "1.Which step in AVM workflow most strongly predicts the likely diagnosis before testing?",
                 options: ["a.Otoscopic inspection for structural ear abnormalities",
                           "b.Targeted functional examination including history-driven bedside vestibular and hearing assessment",
                           "c.Caloric testing for lateral semicircular canal function",
                           "d.MRI of the inner ear and central pathways"
                        ], 
                 correct: 1 },

             { q:"2.A patient has vertigo triggered only by lying back and turning to the right. The most important next step is:",
                options:["a.MRI of the posterior fossa to rule out central causes",
                          "b.Dix–Hallpike maneuver to confirm positional benign paroxysmal positional vertigo (BPPV)",
                           "c.Comprehensive ENG including calorics and spontaneous nystagmus testing",
                            "d.Auditory brainstem response (ABR) to evaluate retrocochlear pathology"
                        ],
                 correct:1
             },
             {
                q:"3.Caloric weakness with normal vHIT suggests:",
                options:["a.Central vestibular lesion affecting brainstem pathways",
                         "b.Chronic or compensated unilateral vestibular hypofunction (peripheral lesion)",
                         "c.Superior semicircular canal dehiscence presenting with hyperactive vestibular responses",
                         "d.Normal variation or age-related vestibular asymmetry"
                ],
                correct:1
             },
             {
                q:"4.Which is NOT part of AVM workflow?",
                options:["a.Pattern recognition of auditory and vestibular symptom.",
                         "b.Assessment of systemic risk factors that may influence hearing or balance",
                         "c.Tympanostomy tube insertion for middle ear disease",
                         "d.Comprehensive functional investigations including audiometry, VEMP, vHIT, and ABR"
                ],
                correct:2
             },
             {
                q:"5.The integration step in AVM primarily involves:",
                options:["a.Performing additional diagnostic tests to confirm initial findings",
                         "b.Synthesizing clinical history, symptom patterns, and functional test results to reach a working diagnosis",
                         "c.Initiating pharmacological therapy based solely on symptom severity",
                         "d.Planning surgical intervention based on isolated test results"
                ],
                correct:1
             },
        ]
    },
    {
        // الدرس الثالث
        title: "Lesson 3: anatomy quick revision", 
        video: "https://www.youtube.com/embed/رابط_الفيديو_3", 
        pdf: "materials/lesson3.pdf",
        questions: [
            { q: "1.High-frequency hearing is encoded at the?", 
                options: ["a.Apex of cochlea",
                          "b.Base of cochlea",
                          "c.Apical part of the basilar membrane ",
                          "d.Helicotrema region of the cochlea"
                ], 
                correct: 1 },
                {
                    q:"2.cVEMP primarily evaluates the function of the:",
                    options:["a.Utricle",
                             "b.Saccule",
                             "c.Lateral semicircular canal",
                             "d.Cochlea"
                    ],
                    correct:1
                },
                {
                    q:"3.Posterior canal BPPV corresponds to which type of nystagmus?",
                    options:["a.Down-beating",
                             "b.Horizontal direction-changing",
                             "c.Torsional upbeat ",
                             "d.Vertical pure upbeat"
                    ],
                    correct:2
                },
                {
                    q:"4.Damage to outer hair cells results first in reduced:",
                    options:["a.ABR wave V",
                             "b.OAE responses",
                             "c.cVEMP amplitude",
                             "d.Tympanometry admittance"
                    ],
                    correct:1
                },
                {
                    q:"5.Superior division vestibular neuritis affects all EXCEPT:",
                    options:["a.Utricle",
                             "b.Lateral SCC",
                             "c.Anterior SCC",
                             "d.Saccule"
                    ],
                    correct:3
                },
        ]
    },
    {
        // الدرس الرابع
        title: "Lesson 4: vestibular physiology and reflexes", 
        video: "https://www.youtube.com/embed/رابط_الفيديو_4", 
        pdf: "materials/lesson4.pdf",
        questions: [
            { q: "1. The primary function of the vestibulo-ocular reflex is to:",
                 options: ["A. Maintain posture",
                           "B. Stabilize vision during head movement",
                           "C. Control neck muscles",
                           "D. Detect gravity"
                 ],
                  correct: 1 },
                  {
                    q:"2. Which structure detects linear acceleration?",
                    options:["A. Semicircular canals",
                             "B. Cochlea",
                             "C. Otolith organs",
                             "D. Inferior colliculus"
                    ],
                    correct:2
                  },
                  {
                    q:"3. Oscillopsia is most commonly due to:",
                    options:["A. Hyperacusis",
                             "B. VOR dysfunction",
                             "C. Otitis media",
                             "D. Facial nerve palsy"
                    ],
                    correct:1
                  },
                  {
                    q:"4. Vestibular compensation primarily depends on:",
                    options:["A. Hair cell regeneration",
                             "B. Central neural adaptation",
                             "C. Surgical correction",
                             "D. Medication alone"
                    ],
                    correct:1
                  },
                  {
                    q:"5. cVEMP reflects the integrity of which reflex?",
                    options:["A. Vestibulo-ocular",
                             "B. Vestibulo-spinal",
                             "C. Vestibulo-collic",
                             "D. Visual-vestibular"
                    ],
                    correct:2
                  },
        ]
    },
    {
        // الدرس الخامس
        title: "Lesson 5: central auditory and vestibular pathways", 
        video: "https://www.youtube.com/embed/رابط_الفيديو_5", 
        pdf: "materials/lesson5.pdf",
        questions: [
            { q: "1. Lesions above the cochlear nuclei typically produce:",
                 options: ["A. Complete ipsilateral hearing loss",
                           "B. Partial hearing deficits with preserved OAE",
                           "C. Profound bilateral hearing loss",
                           "D. No auditory symptoms"
                 ], 
                correct: 1 },
                {
                    q:"2. The vestibulo-ocular reflex involves which of the following pathway sequence?",
                    options:["A. Otolith → cerebellum → VSR",
                             "B. SCC → vestibular nuclei → ocular motor nuclei → eye muscles",
                             "C. Cochlea → auditory cortex → eye muscles",
                             "D. Visual cortex → vestibular nuclei → VOR"
                    ],
                    correct:1
                },
                {
                    q:"3. cVEMP tests the function of which pathway?",
                    options:["A. Otolith → inferior vestibular nerve → vestibular nuclei → SCM",
                             "B. SCC → ocular nuclei → extraocular muscles",
                             "C. Cochlea → cochlear nerve → cortex",
                             "D. Cerebellum → vestibular nuclei → gaze stabilization"
                    ],
                    correct:0
                },
                {
                    q:"4. Central vestibular lesions are suggested by all EXCEPT:",
                    options:["A. Direction-changing nystagmus",
                              "B. Severe rotational vertigo",
                              "C. Vertical nystagmus",
                              "D. Dysmetria or ataxia"
                    ],
                    correct:1
                },
                {
                    q:"5. Brainstem vestibular nuclei integrate inputs from:",
                    options:["A. SCCs only",
                             "B. Otolith organs only",
                             "C. SCCs, otoliths, cerebellum, and visual system",
                             "D. Cochlea only"
                    ],
                    correct:2
                },
        ]
    },
    {
        // الدرس السادس والأخير
        title: "Lesson 6:integration and clinical patterns", 
        video: "https://www.youtube.com/embed/رابط_الفيديو_6", 
        pdf: "materials/lesson6.pdf",
        questions: [
            { q: "1. Normal vHIT with reduced caloric response suggests:", 
                options: ["A. Central lesion",
                          "B. Otolith dysfunction",
                          "C. Peripheral vestibular loss",
                          "D. Normal vestibular function"
                ],
                 correct: 2 },
                 {
                    q:"2. Which finding is MOST suggestive of a central vestibular disorder?",
                    options:["A. Severe nausea",
                            "B. Positive head impulse test",
                            "C. Direction-changing nystagmus",
                            "D. Episodic vertigo"
                    ],
                    correct:2
                 },
                 {
                    q:"3. Poor speech discrimination with normal PTA indicates:",
                    options:["A. Presbycusis",
                             "B. Conductive hearing loss",
                              "C. Auditory neuropathy",
                              "D. Otitis media"
                    ],
                    correct:2
                 },
                 {
                    q:"4. The most important factor in vestibular compensation is:",
                    options:["A. Hair cell regeneration",
                              "B. Central neural plasticity",
                              "C. Medication duration",
                              "D. Surgical correction"
                    ],
                    correct:1
                 },
                 {
                    q:"5. Sudden unilateral SNHL should be managed as:",
                    options:["A. Benign condition",
                              "B. Routine follow-up",
                               "C. Emergency",
                               "D. Age-related change"
                            ],
                            correct:2
                 },
        ]
    }
];
// دالة تغيير الدرس عند الضغط عليه في القائمة
function changeLesson(index) {
    currentLesson = index;
    const lesson = courseData[index];
    document.getElementById('lesson-title').innerText = lesson.title;
    document.getElementById('main-video').src = lesson.video;
    document.getElementById('pdf-link').href = lesson.pdf;

    // تحديث زرار الكويز
    const finishKey = `finished_quiz_lesson_${index}`;
    const quizBtn = document.querySelector('.btn-quiz');   
    if (localStorage.getItem(finishKey)) {
        quizBtn.innerText = "Exam Submitted ✅";
        quizBtn.style.backgroundColor = "#28a745";
        quizBtn.style.cursor = "not-allowed";
        quizBtn.onclick = null;
    } else {
        quizBtn.innerText = "Start MCQ";
        quizBtn.style.backgroundColor = "#27ae60";
        quizBtn.style.cursor = "pointer";
        quizBtn.onclick = openQuiz;
    }
}

// دالة فتح نافذة الأسئلة
function openQuiz() {
    const finishKey = `finished_quiz_lesson_${currentLesson}`;
    if (localStorage.getItem(finishKey)) {
        alert("You have already submitted this exam once.");
        return; 
    }
    currentQuestion = 0;
    userAnswers = new Array(courseData[currentLesson].questions.length).fill(null);  
    
    document.getElementById('quiz-body').innerHTML = `
        <p id="quiz-progress"></p>
        <h3 id="question-text"></h3>
        <div id="options-container" class="options-grid"></div>
        <div id="quiz-nav" style="margin-top:20px; padding:10px; text-align:center;"></div>
    `;
    
    document.getElementById('quiz-modal').style.display = 'flex';
    loadQuestion();
}

// دالة تحميل السؤال الحالي داخل الـ Modal
function loadQuestion() {
    const qData = courseData[currentLesson].questions[currentQuestion];
    const totalQs = courseData[currentLesson].questions.length;
    
    document.getElementById('quiz-progress').innerText = `Question ${currentQuestion + 1} of ${totalQs}`;
    document.getElementById('question-text').innerText = qData.q; 
    const container = document.getElementById('options-container');
    container.innerHTML = ''; 

    qData.options.forEach((opt, i) => {
        const optionWrapper = document.createElement('div');
        optionWrapper.className = `option-item ${userAnswers[currentQuestion] === i ? 'selected' : ''}`; 
        optionWrapper.innerHTML = `
            <div class="custom-checkbox">
                ${userAnswers[currentQuestion] === i ? '<i class="fas fa-check"></i>' : ''}
            </div>
            <span class="option-text">${opt}</span>
        `;    
        optionWrapper.onclick = () => {
            userAnswers[currentQuestion] = i; 
            loadQuestion(); 
        };
        container.appendChild(optionWrapper);
    });
    renderNavigation(totalQs);
}

// تعديل أزرار التنقل (حذف Previous وتفعيل Submit)
function renderNavigation(totalQs) {
    const navDiv = document.getElementById('quiz-nav');
    navDiv.innerHTML = '';

    if (currentQuestion < totalQs - 1) {
        const nextBtn = document.createElement('button');
        nextBtn.innerText = "Next Question";
        nextBtn.className = "next-btn action-btn"; // استخدمت الكلاسات اللي في الـ CSS عندك
        nextBtn.disabled = userAnswers[currentQuestion] === null;
        nextBtn.onclick = () => { currentQuestion++; loadQuestion(); };
        navDiv.appendChild(nextBtn);
    } else {
        const submitBtn = document.createElement('button');
        submitBtn.innerText = "Submit Exam";
        submitBtn.className = "finish-quiz-btn"; // الكلاس الازرق اللي في الـ CSS
        submitBtn.disabled = userAnswers[currentQuestion] === null;
        submitBtn.onclick = submitQuiz; 
        navDiv.appendChild(submitBtn);
    }
}

function nextQuestion() {
    if (currentQuestion < courseData[currentLesson].questions.length - 1) {
        currentQuestion++;
        loadQuestion();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

// دالة فحص الإجابة
function checkAnswer(choice) {
    const correct = courseData[currentLesson].questions[currentQuestion].correct;
    if (choice === correct) {
        currentQuestion++;
        if (currentQuestion < courseData[currentLesson].questions.length) {
            loadQuestion();
        } else {
            alert("Perfect! Lesson completed and next lesson unlocked.");
            unlockNext();
        }
    } else {
        alert("Incorrect answer. Please review the video and try again!");
    }
}

// دالة فتح الدرس التالي
function unlockNext() {
    const nextIdx = currentLesson + 1; // إذا كنت في الدرس 0، سيفتح الدرس 1
    if (nextIdx < courseData.length) {
        // نبحث عن العنصر في القائمة الجانبية
        const nextItem = document.getElementById('L' + nextIdx);
        
        if (nextItem) {
            nextItem.classList.remove('locked');
            // تغيير الأيقونة من قفل إلى علامة صح أو دائرة
            const icon = nextItem.querySelector('i');
            if(icon) icon.className = 'fas fa-check-circle';
            
            // تفعيل الضغط عليه
            nextItem.setAttribute('onclick', `changeLesson(${nextIdx})`);
            
            // حفظ التقدم في المتصفح
            localStorage.setItem('unlockedUntil', nextIdx);
            
            console.log("Lesson " + nextIdx + " unlocked!");
        } else {
            console.error("Could not find element with ID: L" + nextIdx);
        }
    }
}
function submitQuiz() {
    const questions = courseData[currentLesson].questions;
    let score = 0;
    let feedbackHtml = `<h3>Quiz Results</h3>`;

    questions.forEach((q, index) => {
        const isCorrect = userAnswers[index] === q.correct;
        if (isCorrect) score++;
        
        feedbackHtml += `
            <div class="result-card ${isCorrect ? 'correct-card' : 'wrong-card'}">
                <p><strong>Q${index+1}:</strong> ${q.q}</p>
                <p class="your-ans">Your Answer: <span>${q.options[userAnswers[index]]}</span></p>
                ${!isCorrect ? `<p class="correct-ans">Correct: <span>${q.options[q.correct]}</span></p>` : ''}
            </div>
        `;
    });

    const passed = score >= (questions.length / 2);
    
    // تسجيل إن الكويز خلص فقط لو نجح (أو حسب رغبتك)
    if (passed) {
        localStorage.setItem(`finished_quiz_lesson_${currentLesson}`, "true");
    }

    feedbackHtml += `
        <div class="final-result-footer">
            <h4>Your Score: ${score} / ${questions.length}</h4>
            <p class="${passed ? 'pass-text' : 'fail-text'}">${passed ? 'Congratulations! You Passed.' : 'You need 50% to pass. Please try again.'}</p>
            <button class="finish-quiz-btn" onclick="handleFinish(${passed})">
                ${passed ? 'Finish & Unlock Next' : 'Close & Retry'}
            </button>
        </div>
    `;

    document.getElementById('quiz-body').innerHTML = feedbackHtml;
}

// دالة تنفيذ الأكشن بعد الضغط على الزرار
function handleFinish(passed) {
    if (passed) {
        unlockNext();
    }
    closeQuiz();
    changeLesson(currentLesson); // لتحديث زرار الكويز في الصفحة الرئيسية
}

// دالة جديدة بنضيفها عشان تنفذ الأمرين مع بعض: تفتح الدرس وتقفل الشاشة
function finishAndContinue() {
    unlockNext(); // بتفتح الدرس اللي بعده في القائمة
    closeQuiz();  // بتقفل الـ Modal
}

// دالة مساعدة عشان لو نجح يقفل الـ Modal ويفتح الدرس الجديد
function handlePass() {
    unlockNext();
    closeQuiz();
}
// دالة إغلاق النافذة
function closeQuiz() {
    document.getElementById('quiz-modal').style.display = 'none';
}
