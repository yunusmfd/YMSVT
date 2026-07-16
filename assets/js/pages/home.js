import { fetchSection, renderGrid, showSkeleton, showError, escapeHtml } from "../list-page.js";

const ICON_SHARE =`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><line x1="8.3" y1="10.7" x2="15.7" y2="6.3"/><line x1="8.3" y1="13.3" x2="15.7" y2="17.7"/></svg>`;

const DOMAINE_LABEL = {
  genetique: { ar: "وراثة", fr: "Génétique" },
  cytologie: { ar: "خلية", fr: "Cytologie" },
  physiologie: { ar: "فيزيولوجيا", fr: "Physiologie" },
  ecologie: { ar: "بيئة", fr: "Écologie" },
  biomol: { ar: "جزيئي", fr: "Biol. moléculaire" },
  geologie: { ar: "جيولوجيا", fr: "Géologie" },
  microbiologie: { ar: "مجهري", fr: "Microbiologie" },
  botanique: { ar: "نبات", fr: "Botanique" },
  zoologie: { ar: "حيوان", fr: "Zoologie" },
  taxonomie: { ar: "تصنيف", fr: "Taxonomie" },
};

function leconCard(l) {
  const spec = l.domaine_specialite;
  const badge = spec && DOMAINE_LABEL[spec] ? DOMAINE_LABEL[spec] : null;
  return `<a class="card card-link lesson-card" href="${l.url}" data-item>
    ${
      l.vignette
        ? `<span class="lesson-card-img-wrap">
      <img src="/${l.vignette}" alt="${escapeHtml(l.titre.ar)}" loading="lazy" width="480" height="270" />
      ${badge ? `<span class="lesson-card-badge" data-spec="${spec}"><span data-lang="ar">${badge.ar}</span><span data-lang="fr">${badge.fr}</span></span>` : ""}
    </span>`
        : ""
    }
    <div class="lesson-card-body">
      <div class="lesson-card-meta">
        <span>${l.niveau.toUpperCase()}</span>
        ${l.duree ? `<span class="lesson-card-sep" aria-hidden="true">•</span><span><span data-lang="ar">${l.duree} د</span><span data-lang="fr">${l.duree} MIN</span></span>` : ""}
      </div>
      <h3 class="lesson-card-title"><span data-lang="ar">${escapeHtml(l.titre.ar)}</span><span data-lang="fr">${escapeHtml(l.titre.fr)}</span></h3>
      ${
        l.description && (l.description.ar || l.description.fr)
          ? `<p class="lesson-card-desc"><span data-lang="ar">${escapeHtml(l.description.ar)}</span><span data-lang="fr">${escapeHtml(l.description.fr)}</span></p>`
          : ""
      }
    </div>
  </a>`;
}

function shareText(lang, texte) {
  return lang === "fr" ? texte.fr : texte.ar;
}

function renderSaviezFeatured(container, item) {
  if (!item) return;
  const url = `${window.location.origin}/encyclopedie/saviez-vous/${item.id}/`;
  container.innerHTML = `<div class="saviez-featured">
    <span class="saviez-quotemark" aria-hidden="true">&ldquo;</span>
    <div class="saviez-body">
      <span class="saviez-eyebrow"><span data-lang="ar">هل تعلم؟</span><span data-lang="fr">Le saviez-vous ?</span></span>
      <p class="saviez-quote"><span data-lang="ar">${escapeHtml(item.texte.ar)}</span><span data-lang="fr">${escapeHtml(item.texte.fr)}</span></p>
      <div class="saviez-actions">
        <button class="saviez-share" type="button" data-saviez-share>
          ${ICON_SHARE}<span data-lang="ar">مشاركة المعلومة</span><span data-lang="fr">Partager le fait</span>
        </button>
        <a class="saviez-link" href="${`/encyclopedie/saviez-vous/${item.id}/`}"><span data-lang="ar">اقرأ المزيد</span><span data-lang="fr">En savoir plus</span></a>
      </div>
    </div>
  </div>`;

  const shareBtn = container.querySelector("[data-saviez-share]");
  shareBtn.addEventListener("click", async () => {
    const lang = document.documentElement.getAttribute("lang") === "fr" ? "fr" : "ar";
    const text = shareText(lang, item.texte);
    if (navigator.share) {
      try {
        await navigator.share({ text, url });
        return;
      } catch (e) {
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      shareBtn.classList.add("is-copied");
      setTimeout(() => shareBtn.classList.remove("is-copied"), 1500);
    } catch (e) {
      /* clipboard indisponible — pas d'action de repli nécessaire */
    }
  });
}

async function init() {
  const latestGrid = document.querySelector("[data-latest-lecons]");
  const saviezContainer = document.querySelector("[data-saviez-featured]");

  if (latestGrid) showSkeleton(latestGrid, 3);

  try {
    // حمولة صغيرة مخصّصة للرئيسية (أحدث 3 دروس + معلومة واحدة) بدل جلب كامل الدروس/الموسوعة
    const home = await fetchSection("home");

    if (latestGrid) {
      if (!renderGrid(latestGrid, home.lecons || [], (l) => leconCard(l))) {
        latestGrid.innerHTML = `<p class="state-empty">—</p>`;
      }
    }

    if (saviezContainer) {
      const items = home.saviezVous || [];
      if (items.length) renderSaviezFeatured(saviezContainer, items[0]);
    }
  } catch (e) {
    if (latestGrid) showError(latestGrid, init);
  }
}

document.addEventListener("DOMContentLoaded", init);
