import { fetchSection, showSkeleton, showError, escapeHtml } from "../list-page.js";

function card(r) {
  return `<a class="card card-link" href="/encyclopedie/roches-mineraux/${r.id}/">
    ${r.image ? `<img src="/${r.image}" alt="${escapeHtml(r.nom.ar)}" loading="lazy" width="480" height="270" />` : ""}
    <span class="chip"><span data-lang="ar">${escapeHtml(r.type.ar)}</span><span data-lang="fr">${escapeHtml(r.type.fr)}</span></span>
    <h4 style="margin-top:var(--sp-3)"><span data-lang="ar">${escapeHtml(r.nom.ar)}</span><span data-lang="fr">${escapeHtml(r.nom.fr)}</span></h4>
  </a>`;
}

async function init() {
  const grid = document.querySelector("[data-roches-grid]");
  if (!grid) return;
  showSkeleton(grid, 4);
  try {
    const encyclopedia = await fetchSection("encyclopedia");
    grid.innerHTML = encyclopedia.rochesMineraux.map(card).join("") || `<p class="state-empty">—</p>`;
  } catch (e) {
    showError(grid, init);
  }
}
document.addEventListener("DOMContentLoaded", init);
