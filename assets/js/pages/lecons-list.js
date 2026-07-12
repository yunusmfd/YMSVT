import { fetchManifest, showSkeleton, showError, showEmpty, escapeHtml } from "../list-page.js";
import { t } from "../i18n.js";

function card(l) {
  return `<a class="card card-link" href="${l.url}" data-item data-niveau="${l.niveau}" data-filiere="${l.filiere}">
    ${l.vignette ? `<img src="/${l.vignette}" alt="${escapeHtml(l.titre.ar)}" loading="lazy" width="480" height="270" />` : ""}
    <span class="chip">${l.niveau.toUpperCase()}</span> ${l.domaine_specialite ? `<span class="chip chip-spec" data-spec="${l.domaine_specialite}">${l.domaine_specialite}</span>` : ""}
    <h4 style="margin-top:var(--sp-3)"><span data-lang="ar">${escapeHtml(l.titre.ar)}</span><span data-lang="fr">${escapeHtml(l.titre.fr)}</span></h4>
    <p style="font-size:var(--fs-14)"><span data-lang="ar">${escapeHtml(l.unite.ar)}</span><span data-lang="fr">${escapeHtml(l.unite.fr)}</span></p>
    <p class="mono" style="font-size:var(--fs-12)">${l.duree} <span data-lang="ar">د</span><span data-lang="fr">min</span></p>
  </a>`;
}

// تجميع الدروس حسب الوحدة (القسم 3.3: كل وحدة تضم عدة دروس) — عنوان الوحدة ثم دروسها مرتّبة
function renderGrouped(list) {
  const groups = new Map();
  for (const l of list) {
    const key = l.uniteUrl || l.uniteId;
    if (!groups.has(key)) groups.set(key, { unite: l.unite, url: l.uniteUrl, niveau: l.niveau, ordre: l.uniteOrdre, lecons: [] });
    groups.get(key).lecons.push(l);
  }
  const ordered = [...groups.values()].sort((a, b) => (a.ordre || 0) - (b.ordre || 0));
  return ordered
    .map((g) => {
      g.lecons.sort((a, b) => (a.ordreInUnite || 0) - (b.ordreInUnite || 0));
      return `<div class="unit-group">
      <div class="unit-group-head">
        <h3><span data-lang="ar">${escapeHtml(g.unite.ar)}</span><span data-lang="fr">${escapeHtml(g.unite.fr)}</span></h3>
        <span class="unit-group-count">${g.lecons.length} <span data-lang="ar">دروس</span><span data-lang="fr">leçons</span></span>
        ${g.url ? `<a href="${g.url}"><span data-lang="ar">عرض الوحدة ←</span><span data-lang="fr">Voir l'unité ←</span></a>` : ""}
      </div>
      <div class="grid grid-3">${g.lecons.map(card).join("")}</div>
    </div>`;
    })
    .join("");
}

function currentLang() {
  return document.documentElement.getAttribute("lang") === "fr" ? "fr" : "ar";
}

// المسلك يُتاح فقط لمستوى ثانوي تأهيلي (القسم 6.3.1)
function isThanawi(niveau) {
  return niveau && !["1ac", "2ac", "3ac"].includes(niveau);
}

async function init() {
  const grid = document.querySelector("[data-lecons-grid]");
  if (!grid) return;
  showSkeleton(grid, 6);
  try {
    const manifest = await fetchManifest();
    const all = manifest.lecons;

    const niveauSelect = document.querySelector('[data-filter-key="niveau"]');
    const filiereSelect = document.querySelector('[data-filter-key="filiere"]');
    const filiereGroup = document.querySelector('[data-filter-key="filiere-group"]');
    const dorraSelect = document.querySelector('[data-filter-key="dorra"]');
    const uniteSelect = document.querySelector('[data-filter-key="unite"]');
    const state = { niveau: "", filiere: "", dorra: "", unite: "" };

    // خيارات "الوحدة" تعتمد على بقية الفلاتر الحالية (المستوى/المسلك/الدورة)، فتُعاد بناؤها عند كل تغيير
    function populateUnites() {
      const scoped = all.filter(
        (l) => (!state.niveau || l.niveau === state.niveau) && (!state.filiere || l.filiere === state.filiere) && (!state.dorra || String(l.dorra) === state.dorra)
      );
      const seen = new Map();
      scoped.forEach((l) => {
        if (!seen.has(l.uniteId)) seen.set(l.uniteId, { uniteId: l.uniteId, titre: l.unite, ordre: l.uniteOrdre || 0 });
      });
      const unites = [...seen.values()].sort((a, b) => a.ordre - b.ordre);
      if (!unites.some((u) => u.uniteId === state.unite)) state.unite = "";
      const lang = currentLang();
      uniteSelect.innerHTML =
        `<option value="">${t("filter_all", lang)}</option>` +
        unites.map((u) => `<option value="${u.uniteId}">${escapeHtml(u.titre[lang] || u.titre.ar)}</option>`).join("");
      uniteSelect.value = state.unite;
    }

    function apply() {
      let filtered = all.filter(
        (l) =>
          (!state.niveau || l.niveau === state.niveau) &&
          (!state.filiere || l.filiere === state.filiere) &&
          (!state.dorra || String(l.dorra) === state.dorra) &&
          (!state.unite || l.uniteId === state.unite)
      );
      if (!filtered.length) {
        showEmpty(grid, "لا توجد دروس بعد لهذا الاختيار، جرّب مستوى آخر.", "Aucune leçon pour ce choix, essayez un autre niveau.");
        return;
      }
      grid.innerHTML = renderGrouped(filtered);
    }

    niveauSelect.addEventListener("change", () => {
      state.niveau = niveauSelect.value;
      filiereGroup.hidden = !isThanawi(state.niveau);
      if (filiereGroup.hidden) {
        state.filiere = "";
        filiereSelect.value = "";
      }
      populateUnites();
      apply();
    });
    filiereSelect.addEventListener("change", () => {
      state.filiere = filiereSelect.value;
      populateUnites();
      apply();
    });
    dorraSelect.addEventListener("change", () => {
      state.dorra = dorraSelect.value;
      populateUnites();
      apply();
    });
    uniteSelect.addEventListener("change", () => {
      state.unite = uniteSelect.value;
      apply();
    });

    // تعاد أسماء الوحدات (نص عادي داخل <option>، لا يتبع تبديل data-lang) عند تغيير اللغة
    new MutationObserver(() => populateUnites()).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

    populateUnites();
    apply();

    // فتح المستوى مباشرة من الرابط المرساة (#2bac مثلا) القادم من "أنا في..." بالرئيسية
    const hash = window.location.hash.replace("#", "");
    if (hash && [...niveauSelect.options].some((o) => o.value === hash)) {
      niveauSelect.value = hash;
      niveauSelect.dispatchEvent(new Event("change"));
    }
  } catch (e) {
    showError(grid, init);
  }
}

document.addEventListener("DOMContentLoaded", init);
