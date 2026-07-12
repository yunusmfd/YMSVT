// نقطة الدخول المشتركة لكل الصفحات (نافبار/بحث/لغة/ثيم) — منطق خاص بكل صفحة يُحمَّل بشكل منفصل (القسم 11.2)
import { initTheme } from "./theme.js";
import { initLang } from "./lang.js";
import { initNav } from "./nav.js";
import { initSearch } from "./search.js";
import { initGlossaryTooltips } from "./glossary-tooltip.js";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initLang();
  initNav();
  initSearch();
  initGlossaryTooltips();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/assets/js/sw.js").catch(() => {
      /* تجاهل صامت — الموقع يعمل بدون Service Worker أيضا */
    });
  });
}
