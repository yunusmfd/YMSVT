import { fetchManifest, showSkeleton, showError, escapeHtml } from "../list-page.js";

function card(g) {
  return `<div class="card" data-lightbox-trigger data-src="/${g.image}" data-title="${escapeHtml(g.titre.ar)}">
    <img src="/${g.image}" alt="${escapeHtml(g.titre.ar)}" loading="lazy" />
    <h4 style="margin-top:var(--sp-3)"><span data-lang="ar">${escapeHtml(g.titre.ar)}</span><span data-lang="fr">${escapeHtml(g.titre.fr)}</span></h4>
  </div>`;
}

async function init() {
  const grid = document.querySelector("[data-galerie-grid]");
  const lightbox = document.querySelector("[data-lightbox]");
  const lightboxImg = document.querySelector("[data-lightbox-img]");
  if (!grid) return;
  showSkeleton(grid, 6);
  try {
    const manifest = await fetchManifest();
    grid.innerHTML = manifest.encyclopedia.galerie.map(card).join("") || `<p class="state-empty">—</p>`;

    grid.querySelectorAll("[data-lightbox-trigger]").forEach((el) => {
      el.addEventListener("click", () => {
        lightboxImg.src = el.getAttribute("data-src");
        lightboxImg.alt = el.getAttribute("data-title");
        lightbox.hidden = false;
      });
    });
    lightbox.addEventListener("click", () => (lightbox.hidden = true));
  } catch (e) {
    showError(grid, init);
  }
}
document.addEventListener("DOMContentLoaded", init);
