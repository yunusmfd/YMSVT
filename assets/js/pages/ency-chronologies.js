import { fetchSection, showSkeleton, showError, escapeHtml } from "../list-page.js";
import { ICON_CALENDAR } from "../icons.js";

function card(c) {
  return `<a class="card card-link" href="/encyclopedie/chronologies/${c.id}/">
    <span class="card-icon-lg" aria-hidden="true">${ICON_CALENDAR}</span>
    <h4 style="margin-top:var(--sp-3)"><span data-lang="ar">${escapeHtml(c.titre.ar)}</span><span data-lang="fr">${escapeHtml(c.titre.fr)}</span></h4>
    <p class="mono" style="font-size:var(--fs-12)">${c.nbEvenements} <span data-lang="ar">أحداث</span><span data-lang="fr">événements</span></p>
  </a>`;
}
async function init() {
  const grid = document.querySelector("[data-chronologies-grid]");
  if (!grid) return;
  showSkeleton(grid, 3);
  try {
    const encyclopedia = await fetchSection("encyclopedia");
    grid.innerHTML = encyclopedia.chronologies.map(card).join("") || `<p class="state-empty">—</p>`;
  } catch (e) {
    showError(grid, init);
  }
}
document.addEventListener("DOMContentLoaded", init);
