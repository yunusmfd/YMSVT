// أدوات مشتركة لصفحات القوائم: هيكل تحميل/فراغ/خطأ (القسم 5.2) + جلب manifest.json
import { ICON_WARNING, ICON_SEARCH_EMPTY } from "./icons.js";

export function showSkeleton(container, count = 6) {
  container.innerHTML = Array.from({ length: count }, () => `<div class="skeleton-card"></div>`).join("");
}

export function showError(container, onRetry) {
  const lang = document.documentElement.getAttribute("lang") || "ar";
  container.innerHTML = `<div class="state-error">
    <span class="icon" aria-hidden="true">${ICON_WARNING}</span>
    <p>${lang === "fr" ? "Échec du chargement du contenu." : "تعذّر تحميل المحتوى."}</p>
    <button class="btn btn-ghost btn-sm" data-retry>${lang === "fr" ? "Réessayer" : "إعادة المحاولة"}</button>
  </div>`;
  const btn = container.querySelector("[data-retry]");
  if (btn) btn.addEventListener("click", onRetry);
}

export function showEmpty(container, messageAr, messageFr) {
  const lang = document.documentElement.getAttribute("lang") || "ar";
  container.innerHTML = `<div class="state-empty">
    <span class="icon" aria-hidden="true">${ICON_SEARCH_EMPTY}</span>
    <p>${lang === "fr" ? messageFr : messageAr}</p>
  </div>`;
}

// manifest مقسّم: كل صفحة تجلب قسمها فقط (/manifest/<name>.json) بدل ملف واحد ضخم — القسم 11.2
// الأقسام المتاحة: lecons | exams | virtual-lab | encyclopedia | revision | blog | home
const sectionCache = new Map();
export async function fetchSection(name) {
  if (sectionCache.has(name)) return sectionCache.get(name);
  const res = await fetch(`/manifest/${name}.json`);
  if (!res.ok) throw new Error(`manifest section "${name}" fetch failed`);
  const data = await res.json();
  sectionCache.set(name, data);
  return data;
}

export function renderGrid(container, items, cardFn) {
  if (!items.length) return false;
  container.innerHTML = items.map(cardFn).join("");
  return true;
}

export function escapeHtml(str) {
  return String(str == null ? "" : str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
