// اختبار QCM ختامي: تصحيح فوري + تبرير نصي لكل سؤال (القسم 7.3.5)
// النتيجة تُحفظ محليا فقط في nova-svt:quiz:{مسار الدرس} — فضاء الطالب بدون خادم (القسم 3.6)
export function initQuiz() {
  const questions = document.querySelectorAll("[data-quiz-question]");
  if (!questions.length) return;
  let correctCount = 0;
  let totalAnswered = 0;

  questions.forEach((questionEl, qIndex) => {
    const correctIndex = Number(questionEl.getAttribute("data-correct"));
    const options = questionEl.querySelectorAll(".quiz-option");
    const justification = questionEl.querySelector(".quiz-justification");
    let answered = false;

    options.forEach((opt, idx) => {
      opt.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        totalAnswered++;
        if (idx === correctIndex) correctCount++;
        options.forEach((o, i) => {
          o.disabled = true;
          if (i === correctIndex) o.classList.add("correct");
          else if (i === idx) o.classList.add("incorrect");
        });
        if (justification) justification.hidden = false;
        // إظهار السؤال التالي فقط بعد الإجابة على الحالي (سؤالا بعد سؤال بدل ظهورها دفعة واحدة)
        const next = questionEl.nextElementSibling;
        if (next && next.hasAttribute("data-quiz-question")) next.hidden = false;
        if (totalAnswered === questions.length) saveResult(correctCount, questions.length);
      });
    });
  });
}

function saveResult(score, total) {
  try {
    const key = `nova-svt:quiz:${window.location.pathname}`;
    localStorage.setItem(key, JSON.stringify({ score, total, date: new Date().toISOString() }));
  } catch (e) {
    /* تجاهل صامت */
  }
}
