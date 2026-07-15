import { fetchSection, showSkeleton, showError, showEmpty, escapeHtml } from "../list-page.js";

function card(g) {
  return `<a class="card card-link" href="/encyclopedie/glossaire/${g.id}/">
    <h4><span data-lang="ar">${escapeHtml(g.terme.ar)}</span><span data-lang="fr">${escapeHtml(g.terme.fr)}</span></h4>
    <p style="font-size:var(--fs-14)"><span data-lang="ar">${escapeHtml(truncate(g.definition.ar))}</span><span data-lang="fr">${escapeHtml(truncate(g.definition.fr))}</span></p>
  </a>`;
}
function truncate(s) {
  return s && s.length > 90 ? s.slice(0, 90) + "…" : s;
}

async function init() {
  const grid = document.querySelector("[data-glossaire-grid]");
  const alphabetWrap = document.querySelector("[data-glossaire-alphabet]");
  const searchInput = document.querySelector("[data-glossaire-search]");
  if (!grid) return;
  showSkeleton(grid, 6);
  try {
    const encyclopedia = await fetchSection("encyclopedia");
    const lang = document.documentElement.getAttribute("lang") || "ar";
    const terms = [...encyclopedia.glossaire].sort((a, b) => (a.terme[lang] || a.terme.ar).localeCompare(b.terme[lang] || b.terme.ar, "ar"));

    const letters = [...new Set(terms.map((t) => (t.terme.ar || "")[0]))];
    alphabetWrap.innerHTML =
      `<button class="tab" data-letter="" aria-selected="true"><span data-lang="ar">الكل</span><span data-lang="fr">Tout</span></button>` +
      letters.map((l) => `<button class="tab" data-letter="${l}" aria-selected="false">${l}</button>`).join("");

    function render(list) {
      if (!list.length) {
        showEmpty(grid, "لا توجد مصطلحات مطابقة.", "Aucun terme correspondant.");
        return;
      }
      grid.innerHTML = list.map(card).join("");
    }
    render(terms);

    alphabetWrap.querySelectorAll("[data-letter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        alphabetWrap.querySelectorAll("[data-letter]").forEach((b) => b.setAttribute("aria-selected", "false"));
        btn.setAttribute("aria-selected", "true");
        const letter = btn.getAttribute("data-letter");
        render(letter ? terms.filter((t) => (t.terme.ar || "")[0] === letter) : terms);
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const q = searchInput.value.trim().toLowerCase();
        render(terms.filter((t) => (t.terme.ar + t.terme.fr).toLowerCase().includes(q)));
      });
    }
  } catch (e) {
    showError(grid, init);
  }
}
document.addEventListener("DOMContentLoaded", init);
