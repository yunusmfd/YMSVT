import { fetchManifest, showSkeleton, showError, escapeHtml } from "../list-page.js";

function card(g) {
  return `<a class="card card-link" href="/encyclopedie/geologie-maroc/${g.id}/">
    ${g.image ? `<img src="/${g.image}" alt="${escapeHtml(g.titre.ar)}" loading="lazy" width="480" height="270" />` : ""}
    <span class="chip chip-secondary">🌍 <span data-lang="ar">${escapeHtml(g.region.ar)}</span><span data-lang="fr">${escapeHtml(g.region.fr)}</span></span>
    <h4 style="margin-top:var(--sp-3)"><span data-lang="ar">${escapeHtml(g.titre.ar)}</span><span data-lang="fr">${escapeHtml(g.titre.fr)}</span></h4>
  </a>`;
}

async function init() {
  const grid = document.querySelector("[data-geologie-maroc-grid]");
  if (!grid) return;
  showSkeleton(grid, 4);
  try {
    const manifest = await fetchManifest();
    grid.innerHTML = manifest.encyclopedia.geologieMaroc.map(card).join("") || `<p class="state-empty">—</p>`;
  } catch (e) {
    showError(grid, init);
  }
}
document.addEventListener("DOMContentLoaded", init);
