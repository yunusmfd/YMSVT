import { fetchManifest, showSkeleton, showError, escapeHtml } from "../list-page.js";

function card(s) {
  return `<a class="card card-link" href="/encyclopedie/scientifiques/${s.id}/" style="text-align:center">
    ${s.photo ? `<img src="/${s.photo}" alt="${escapeHtml(s.nom.ar)}" loading="lazy" style="border-radius:50%;aspect-ratio:1/1;width:100%" width="150" height="150" />` : `<div style="border-radius:50%;aspect-ratio:1/1;background:var(--bg-alt)"></div>`}
    <h4 style="margin-top:var(--sp-3)"><span data-lang="ar">${escapeHtml(s.nom.ar)}</span><span data-lang="fr">${escapeHtml(s.nom.fr)}</span></h4>
    <p class="mono" style="font-size:var(--fs-12)">${s.periode || ""}</p>
  </a>`;
}

async function init() {
  const grid = document.querySelector("[data-scientifiques-grid]");
  if (!grid) return;
  showSkeleton(grid, 5);
  try {
    const manifest = await fetchManifest();
    grid.innerHTML = manifest.encyclopedia.scientifiques.map(card).join("") || `<p class="state-empty">—</p>`;
  } catch (e) {
    showError(grid, init);
  }
}
document.addEventListener("DOMContentLoaded", init);
