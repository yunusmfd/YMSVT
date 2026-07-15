import { fetchSection, showSkeleton, showError, escapeHtml } from "../list-page.js";

function item(d) {
  return `<a class="timeline-item card-link" href="/encyclopedie/decouvertes/${d.id}/" style="border-inline-start:3px solid var(--primary);padding-inline-start:var(--sp-4);margin-bottom:var(--sp-5);display:block">
    <span class="year">${d.annee}</span>
    <h4><span data-lang="ar">${escapeHtml(d.titre.ar)}</span><span data-lang="fr">${escapeHtml(d.titre.fr)}</span></h4>
  </a>`;
}

async function init() {
  const list = document.querySelector("[data-decouvertes-list]");
  if (!list) return;
  showSkeleton(list, 4);
  try {
    const encyclopedia = await fetchSection("encyclopedia");
    const sorted = [...encyclopedia.decouvertes].sort((a, b) => b.annee - a.annee);
    list.innerHTML = sorted.map(item).join("") || `<p class="state-empty">—</p>`;
  } catch (e) {
    showError(list, init);
  }
}
document.addEventListener("DOMContentLoaded", init);
