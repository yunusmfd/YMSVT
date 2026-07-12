import { fetchManifest, showSkeleton, showError, escapeHtml } from "../list-page.js";
import { initFilters } from "../filters.js";

function card(l) {
  return `<a class="card card-link" href="${l.url}" data-item data-niveau="${l.niveau}" data-filiere="${l.filiere}">
    <span class="chip">${l.niveau.toUpperCase()}</span> ${l.domaine_specialite ? `<span class="chip chip-spec" data-spec="${l.domaine_specialite}">${l.domaine_specialite}</span>` : ""}
    <h4 style="margin-top:var(--sp-3)"><span data-lang="ar">${escapeHtml(l.titre.ar)}</span><span data-lang="fr">${escapeHtml(l.titre.fr)}</span></h4>
    <p style="font-size:var(--fs-14)"><span data-lang="ar">${escapeHtml(l.unite.ar)}</span><span data-lang="fr">${escapeHtml(l.unite.fr)}</span></p>
    <p class="mono" style="font-size:var(--fs-12)">${l.duree} <span data-lang="ar">د</span><span data-lang="fr">min</span></p>
  </a>`;
}

async function init() {
  const grid = document.querySelector("[data-lecons-grid]");
  if (!grid) return;
  showSkeleton(grid, 6);
  try {
    const manifest = await fetchManifest();
    grid.innerHTML = manifest.lecons.map(card).join("");
    initFilters();

    // فتح المستوى مباشرة من الرابط المرساة (#2bac مثلا) القادم من "أنا في..." بالرئيسية
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const chip = document.querySelector(`[data-filter-key="niveau"] [data-filter-value="${hash}"]`);
      if (chip) chip.click();
    }
  } catch (e) {
    showError(grid, init);
  }
}

document.addEventListener("DOMContentLoaded", init);
