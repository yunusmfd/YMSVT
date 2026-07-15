import { fetchSection, showSkeleton, showError, escapeHtml } from "../list-page.js";

const REGNE_LABEL = { animal: { ar: "حيوان", fr: "Animal" }, vegetal: { ar: "نبات", fr: "Végétal" } };

function card(o) {
  const r = REGNE_LABEL[o.regne];
  return `<a class="card card-link" href="/encyclopedie/organismes/${o.id}/">
    ${o.image ? `<img src="/${o.image}" alt="${escapeHtml(o.nom.ar)}" loading="lazy" width="480" height="270" />` : ""}
    ${r ? `<span class="chip chip-spec" data-spec="${o.regne === "animal" ? "zoologie" : "botanique"}"><span data-lang="ar">${r.ar}</span><span data-lang="fr">${r.fr}</span></span>` : ""}
    <h4 style="margin-top:var(--sp-3)"><span data-lang="ar">${escapeHtml(o.nom.ar)}</span><span data-lang="fr">${escapeHtml(o.nom.fr)}</span></h4>
    ${o.nom_scientifique ? `<p class="mono" style="font-size:var(--fs-12);font-style:italic">${escapeHtml(o.nom_scientifique)}</p>` : ""}
  </a>`;
}

async function init() {
  const grid = document.querySelector("[data-organismes-grid]");
  if (!grid) return;
  showSkeleton(grid, 4);
  try {
    const encyclopedia = await fetchSection("encyclopedia");
    grid.innerHTML = encyclopedia.organismes.map(card).join("") || `<p class="state-empty">—</p>`;
  } catch (e) {
    showError(grid, init);
  }
}
document.addEventListener("DOMContentLoaded", init);
