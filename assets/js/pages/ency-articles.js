import { fetchManifest, showSkeleton, showError, escapeHtml } from "../list-page.js";

function card(a) {
  return `<a class="card card-link" href="/encyclopedie/articles/${a.id}/">
    ${a.image_cover ? `<img src="/${a.image_cover}" alt="${escapeHtml(a.titre.ar)}" loading="lazy" width="400" height="225" />` : ""}
    <span class="chip">${a.categorie || ""}</span>
    <h4 style="margin-top:var(--sp-3)"><span data-lang="ar">${escapeHtml(a.titre.ar)}</span><span data-lang="fr">${escapeHtml(a.titre.fr)}</span></h4>
    <p class="mono" style="font-size:var(--fs-12)">${a.date || ""}</p>
  </a>`;
}

async function init() {
  const grid = document.querySelector("[data-articles-grid]");
  if (!grid) return;
  showSkeleton(grid, 6);
  try {
    const manifest = await fetchManifest();
    grid.innerHTML = manifest.encyclopedia.articles.map(card).join("") || `<p class="state-empty">—</p>`;
  } catch (e) {
    showError(grid, init);
  }
}
document.addEventListener("DOMContentLoaded", init);
