import { fetchManifest, showSkeleton, showError, escapeHtml } from "../list-page.js";

function card(e) {
  return `<a class="card card-link" href="/encyclopedie/experiences-historiques/${e.id}/">
    ${e.image ? `<img src="/${e.image}" alt="${escapeHtml(e.titre.ar)}" loading="lazy" width="480" height="270" />` : ""}
    <span class="chip chip-secondary"><bdi dir="ltr">${e.annee}</bdi></span>
    <h4 style="margin-top:var(--sp-3)"><span data-lang="ar">${escapeHtml(e.titre.ar)}</span><span data-lang="fr">${escapeHtml(e.titre.fr)}</span></h4>
  </a>`;
}

async function init() {
  const grid = document.querySelector("[data-experiences-grid]");
  if (!grid) return;
  showSkeleton(grid, 4);
  try {
    const manifest = await fetchManifest();
    grid.innerHTML = manifest.encyclopedia.experiencesHistoriques.map(card).join("") || `<p class="state-empty">—</p>`;
  } catch (e) {
    showError(grid, init);
  }
}
document.addEventListener("DOMContentLoaded", init);
