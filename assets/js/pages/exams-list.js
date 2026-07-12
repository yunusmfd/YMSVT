import { fetchManifest, showSkeleton, showError, escapeHtml } from "../list-page.js";
import { initFilters } from "../filters.js";

function card(e) {
  const typeLabel = e.type === "fard" ? { ar: "فرض", fr: "Devoir" } : { ar: "امتحان", fr: "Examen" };
  return `<div class="card" data-item data-type="${e.type}" data-niveau="${e.niveau}" data-filiere="${e.filiere || ""}" data-dorra="${e.dorra}">
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:var(--sp-3)">
      <span class="chip chip-primary"><span data-lang="ar">${typeLabel.ar}</span><span data-lang="fr">${typeLabel.fr}</span></span>
      <span class="chip">${e.niveau.toUpperCase()}${e.filiere ? " · " + e.filiere.toUpperCase() : ""}</span>
      <span class="chip"><span data-lang="ar">الدورة ${e.dorra}</span><span data-lang="fr">Semestre ${e.dorra}</span></span>
    </div>
    <h4><span data-lang="ar">${escapeHtml(e.titre.ar)}</span><span data-lang="fr">${escapeHtml(e.titre.fr)}</span></h4>
    <p class="mono" style="font-size:var(--fs-12)">${e.annee_scolaire}</p>
    <div style="display:flex;gap:var(--sp-2);margin-top:var(--sp-3)">
      <a class="btn btn-primary btn-sm" href="/${e.fichier_pdf}" download><span data-lang="ar">تحميل الفرض</span><span data-lang="fr">Télécharger</span></a>
      ${e.corrige_pdf ? `<a class="btn btn-ghost btn-sm" href="/${e.corrige_pdf}" download><span data-lang="ar">التصحيح</span><span data-lang="fr">Corrigé</span></a>` : ""}
    </div>
  </div>`;
}

async function init() {
  const grid = document.querySelector("[data-exams-grid]");
  if (!grid) return;
  showSkeleton(grid, 4);
  try {
    const manifest = await fetchManifest();
    const sorted = [...manifest.exams].sort((a, b) => (b.annee_scolaire || "").localeCompare(a.annee_scolaire || ""));
    grid.innerHTML = sorted.map(card).join("");
    initFilters();
  } catch (e) {
    showError(grid, init);
  }
}

document.addEventListener("DOMContentLoaded", init);
