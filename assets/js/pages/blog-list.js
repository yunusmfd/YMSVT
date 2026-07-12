import { fetchManifest, showSkeleton, showError, escapeHtml } from "../list-page.js";

function card(p) {
  return `<a class="card card-link" href="${p.url}">
    ${p.image_cover ? `<img src="/${p.image_cover}" alt="${escapeHtml(p.titre.ar)}" loading="lazy" width="400" height="225" />` : ""}
    <span class="chip">${p.categorie || ""}</span>
    <h4 style="margin-top:var(--sp-3)"><span data-lang="ar">${escapeHtml(p.titre.ar)}</span><span data-lang="fr">${escapeHtml(p.titre.fr)}</span></h4>
    <p class="mono" style="font-size:var(--fs-12)">${p.date || ""}</p>
  </a>`;
}

async function init() {
  const grid = document.querySelector("[data-blog-grid]");
  if (!grid) return;
  showSkeleton(grid, 4);
  try {
    const manifest = await fetchManifest();
    grid.innerHTML = manifest.blog.map(card).join("") || `<p class="state-empty">—</p>`;
  } catch (e) {
    showError(grid, init);
  }
}
document.addEventListener("DOMContentLoaded", init);
