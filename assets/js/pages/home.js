import { fetchManifest, renderGrid, showSkeleton, showError, escapeHtml } from "../list-page.js";

function leconCard(l) {
  return `<a class="card card-link" href="${l.url}" data-item>
    ${l.vignette ? `<img src="/${l.vignette}" alt="${escapeHtml(l.titre.ar)}" loading="lazy" width="480" height="270" />` : ""}
    <span class="chip">${l.niveau.toUpperCase()}</span>
    <h4 style="margin-top:var(--sp-3)"><span data-lang="ar">${escapeHtml(l.titre.ar)}</span><span data-lang="fr">${escapeHtml(l.titre.fr)}</span></h4>
    <p style="font-size:var(--fs-14)"><span data-lang="ar">${escapeHtml(l.unite.ar)}</span><span data-lang="fr">${escapeHtml(l.unite.fr)}</span></p>
  </a>`;
}

function encyclopediaCard(type, item, lang) {
  const TYPE_ICON = { articles: "📰", scientifiques: "🧑‍🔬", decouvertes: "💡", glossaire: "🔤", chronologies: "📅", saviezVous: "✨", galerie: "🖼️" };
  const title = item.titre || item.nom || item.terme || { ar: "هل تعلم؟", fr: "Le saviez-vous ?" };
  const routeType = type === "saviezVous" ? "saviez-vous" : type;
  return `<a class="card card-link" href="/encyclopedie/${routeType}/${item.id}/" data-item>
    <span aria-hidden="true" style="font-size:var(--fs-24)">${TYPE_ICON[type]}</span>
    <h4 style="margin-top:var(--sp-2)"><span data-lang="ar">${escapeHtml(title.ar)}</span><span data-lang="fr">${escapeHtml(title.fr || title.ar)}</span></h4>
  </a>`;
}

async function init() {
  const lang = document.documentElement.getAttribute("lang") || "ar";
  const latestGrid = document.querySelector("[data-latest-lecons]");
  const encyGrid = document.querySelector("[data-ency-scroller]");
  const tabs = document.querySelectorAll("[data-home-tab]");

  if (latestGrid) showSkeleton(latestGrid, 3);

  try {
    const manifest = await fetchManifest();

    function renderForNiveau(niveau) {
      const items = manifest.lecons.filter((l) => l.niveau === niveau).slice(0, 3);
      if (!renderGrid(latestGrid, items, (l) => leconCard(l))) {
        latestGrid.innerHTML = `<p class="state-empty">—</p>`;
      }
    }
    renderForNiveau("2bac");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
        tab.setAttribute("aria-selected", "true");
        renderForNiveau(tab.getAttribute("data-home-tab"));
      });
    });

    if (encyGrid) {
      const items = [];
      for (const type of Object.keys(manifest.encyclopedia)) {
        const first = manifest.encyclopedia[type][0];
        if (first) items.push(encyclopediaCard(type, first, lang));
      }
      encyGrid.innerHTML = items.join("") || `<p class="state-empty">—</p>`;
    }
  } catch (e) {
    if (latestGrid) showError(latestGrid, init);
  }
}

document.addEventListener("DOMContentLoaded", init);
