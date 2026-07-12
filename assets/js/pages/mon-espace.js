// فضاء الطالب: يُبنى بالكامل من قراءة localStorage فقط — لا خادم، لا حسابات (القسم 3.6)
function init() {
  const quizWrap = document.querySelector("[data-espace-quiz]");
  const prefsWrap = document.querySelector("[data-espace-prefs]");
  if (!quizWrap || !prefsWrap) return;

  const lang = document.documentElement.getAttribute("lang") || "ar";
  let results = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("nova-svt:quiz:")) {
        const data = JSON.parse(localStorage.getItem(key));
        results.push({ path: key.replace("nova-svt:quiz:", ""), ...data });
      }
    }
  } catch (e) {
    results = [];
  }

  if (!results.length) {
    quizWrap.innerHTML = `<p class="state-empty">${lang === "fr" ? "Aucun quiz complété pour l'instant." : "لم تُنهِ أي اختبار بعد."}</p>`;
  } else {
    quizWrap.innerHTML = `<ul>${results
      .map((r) => `<li><a href="${r.path}">${r.path}</a> — ${r.score}/${r.total}</li>`)
      .join("")}</ul>`;
  }

  const theme = localStorage.getItem("nova-svt:theme") || "—";
  const savedLang = localStorage.getItem("nova-svt:lang") || "—";
  prefsWrap.innerHTML = `<ul>
    <li>${lang === "fr" ? "Thème" : "الوضع"}: ${theme}</li>
    <li>${lang === "fr" ? "Langue" : "اللغة"}: ${savedLang}</li>
  </ul>`;
}
document.addEventListener("DOMContentLoaded", init);
