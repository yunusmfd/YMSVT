import { t } from "./i18n.js";

// نافذة البحث المنبثقة (Overlay) — القسم 3.1.2، 3.4، 4.4
let searchIndexCache = null;

async function loadSearchIndex() {
  if (searchIndexCache) return searchIndexCache;
  try {
    const res = await fetch("/search-index.json");
    searchIndexCache = await res.json();
  } catch (e) {
    searchIndexCache = [];
  }
  return searchIndexCache;
}

const TYPE_LABELS = {
  lecon: { ar: "درس", fr: "Leçon" },
  article: { ar: "مقال", fr: "Article" },
  glossaire: { ar: "معجم", fr: "Glossaire" },
  scientifique: { ar: "عالِم", fr: "Scientifique" },
  decouverte: { ar: "اكتشاف", fr: "Découverte" },
  revision: { ar: "مراجعة", fr: "Révision" },
};

export function initSearch() {
  const overlay = document.querySelector("[data-search-overlay]");
  const openBtns = document.querySelectorAll("[data-search-open]");
  const closeBtn = document.querySelector("[data-search-close]");
  const input = document.querySelector("[data-search-input]");
  const resultsWrap = document.querySelector("[data-search-results]");
  if (!overlay || !input || !resultsWrap) return;

  const open = () => {
    overlay.hidden = false;
    input.focus();
    loadSearchIndex();
  };
  const close = () => {
    overlay.hidden = true;
    openBtns[0] && openBtns[0].focus();
  };

  openBtns.forEach((btn) => btn.addEventListener("click", open));
  closeBtn && closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.hidden) close();
  });

  document.querySelectorAll("[data-search-suggestion]").forEach((chip) => {
    chip.addEventListener("click", () => {
      input.value = chip.textContent.trim();
      input.dispatchEvent(new Event("input"));
    });
  });

  let debounce;
  input.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(runSearch, 120);
  });

  async function runSearch() {
    const query = input.value.trim();
    if (!query) {
      resultsWrap.innerHTML = "";
      return;
    }
    const index = await loadSearchIndex();
    const lang = document.documentElement.getAttribute("lang") || "ar";
    const q = query.toLowerCase();
    const matches = index
      .filter((item) => (item.title[lang] || item.title.ar || "").toLowerCase().includes(q) || (item.tags || []).some((tag) => tag.toLowerCase().includes(q)))
      .slice(0, 20);

    if (matches.length === 0) {
      resultsWrap.innerHTML = `<p class="state-empty">${t("search_empty", lang)}</p>`;
      return;
    }
    resultsWrap.innerHTML = matches
      .map(
        (item) => `<a class="search-result-item card-link" href="${item.url}">
          <span>${escapeHtml(item.title[lang] || item.title.ar)}</span>
          <span class="chip">${(TYPE_LABELS[item.type] && TYPE_LABELS[item.type][lang]) || item.type}</span>
        </a>`
      )
      .join("");
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
