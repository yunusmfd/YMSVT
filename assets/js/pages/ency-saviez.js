import { fetchManifest, showSkeleton, showError, escapeHtml } from "../list-page.js";

function card(sv) {
  return `<a class="card card-link le-saviez-vous" href="/encyclopedie/saviez-vous/${sv.id}/" style="margin:0">
    <span class="le-saviez-vous-icon" aria-hidden="true">💡</span>
    <p><span data-lang="ar">${escapeHtml(sv.texte.ar)}</span><span data-lang="fr">${escapeHtml(sv.texte.fr)}</span></p>
  </a>`;
}
async function init() {
  const grid = document.querySelector("[data-saviez-grid]");
  if (!grid) return;
  showSkeleton(grid, 6);
  try {
    const manifest = await fetchManifest();
    grid.innerHTML = manifest.encyclopedia.saviezVous.map(card).join("") || `<p class="state-empty">—</p>`;
  } catch (e) {
    showError(grid, init);
  }
}
document.addEventListener("DOMContentLoaded", init);
