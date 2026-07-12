/*
  محرك العرض من جهة المتصفح — Fallback فقط (القسم 12.2.1، نقطة 5).
  المسار الأساسي: الصفحات تصل مُصيَّرة مسبقا (scripts/prerender.js) وممتلئة فعليا.
  هذا الملف يتدخّل فقط إذا لاحظ أن حاوية المحتوى فارغة (مثلا فتح الصفحة دون المرور بخط بناء Netlify) —
  عندها يجلب JSON مباشرة ويستدعي نفس دوال render-core.js المستخدمة وقت البناء، فلا يوجد منطق عرض مكرر.
*/
import { renderLessonLangBlock, escapeHtml } from "./render-core.js";
import { initQuiz } from "./quiz.js";
import { initScrollspy, initReadingProgress } from "./scrollspy.js";

async function getDeps(lecon) {
  const glossaryIndex = await fetch("/glossary-index.json")
    .then((r) => r.json())
    .catch(() => ({}));

  // يجلب مسبقا نص كل ملفات SVG المشار إليها في بلوكات "image"، ويبني دالة بحث متزامنة
  // منها (نفس منطق svgInliner من جهة Node، القسم 14.2هـ) — التضمين المباشر ضروري لعمل
  // تبديل data-lang عبر CSS الصفحة، بخلاف <img src> المعزول عن تنسيقات الصفحة.
  const svgPaths = new Set();
  (lecon.sections || []).forEach((s) => (s.blocs || []).forEach((b) => {
    if (b.type === "image" && /\.svg$/i.test(b.src)) svgPaths.add(b.src);
  }));
  const svgMap = {};
  await Promise.all(
    [...svgPaths].map((src) =>
      fetch(`/${src}`)
        .then((r) => (r.ok ? r.text() : null))
        .then((text) => (svgMap[src] = text))
        .catch(() => (svgMap[src] = null))
    )
  );
  const svgInliner = (src) => svgMap[src] || null;

  return { marked: window.marked, DOMPurify: window.DOMPurify, glossaryIndex, svgInliner };
}

export async function hydrateLessonIfEmpty() {
  const container = document.querySelector("[data-lesson-content]");
  if (!container) return;
  const alreadyFilled = container.querySelector("[data-lesson-section]");
  if (alreadyFilled) {
    // المحتوى وصل مصيَّرا مسبقا بالفعل — فقط فعّل التفاعلية
    initQuiz();
    initScrollspy();
    initReadingProgress();
    return;
  }

  const src = container.getAttribute("data-content-src");
  if (!src) return;
  try {
    const lecon = await fetch(src).then((r) => r.json());
    const deps = await getDeps(lecon);
    ["ar", "fr"].forEach((lang) => {
      const { sectionsHtml, quizHtml } = renderLessonLangBlock(lecon, lang, deps);
      const wrap = document.createElement("div");
      wrap.setAttribute("data-lang", lang);
      wrap.innerHTML = sectionsHtml + quizHtml;
      container.appendChild(wrap);
    });
  } catch (e) {
    container.innerHTML = `<p class="state-error">${escapeHtml("تعذّر تحميل محتوى الدرس. تحقق من الاتصال ثم أعد المحاولة.")}</p>`;
  }
  initQuiz();
  initScrollspy();
  initReadingProgress();
}

document.addEventListener("DOMContentLoaded", hydrateLessonIfEmpty);
