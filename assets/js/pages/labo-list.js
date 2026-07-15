import { fetchSection, showSkeleton, showError, escapeHtml } from "../list-page.js";
import { initFilters } from "../filters.js";

const TYPE_BADGE = {
  interactif: { icon: "🔬", ar: "تفاعلي", fr: "Interactif", cls: "chip-primary" },
  video: { icon: "🎬", ar: "فيديو", fr: "Vidéo", cls: "chip-accent" },
  animation: { icon: "✏️", ar: "رسوم متحركة", fr: "Animation", cls: "chip-secondary" },
};

function card(exp) {
  const b = TYPE_BADGE[exp.type];
  return `<a class="card card-link" href="/labo-virtuel/${exp.id}/" data-item data-type="${exp.type}">
    ${exp.vignette ? `<img src="/${exp.vignette}" alt="${escapeHtml(exp.titre.ar)}" loading="lazy" width="400" height="225" />` : ""}
    <span class="chip ${b.cls}">${b.icon} <span data-lang="ar">${b.ar}</span><span data-lang="fr">${b.fr}</span></span>
    <h4 style="margin-top:var(--sp-3)"><span data-lang="ar">${escapeHtml(exp.titre.ar)}</span><span data-lang="fr">${escapeHtml(exp.titre.fr)}</span></h4>
  </a>`;
}

async function init() {
  const grid = document.querySelector("[data-labo-grid]");
  if (!grid) return;
  showSkeleton(grid, 6);
  try {
    const virtualLab = await fetchSection("virtual-lab");
    grid.innerHTML = virtualLab.map(card).join("");
    initFilters();
  } catch (e) {
    showError(grid, init);
  }
}

document.addEventListener("DOMContentLoaded", init);
