import { fetchSection, showSkeleton, showError, showEmpty, escapeHtml } from "../list-page.js";
import { t } from "../i18n.js";

const DOMAINE_LABEL = {
  genetique: { ar: "وراثة", fr: "Génétique" }, cytologie: { ar: "خلية", fr: "Cytologie" },
  physiologie: { ar: "فيزيولوجيا", fr: "Physiologie" }, ecologie: { ar: "بيئة", fr: "Écologie" },
  biomol: { ar: "جزيئي", fr: "Biol. moléc." }, geologie: { ar: "جيولوجيا", fr: "Géologie" },
  microbiologie: { ar: "مجهري", fr: "Microbio." }, botanique: { ar: "نبات", fr: "Botanique" },
  zoologie: { ar: "حيوان", fr: "Zoologie" }, taxonomie: { ar: "تصنيف", fr: "Taxonomie" },
};

// أيقونات SVG أصلية موحّدة (24×24، stroke currentColor) — متطابقة أسلوبيا مع scripts/lib/icons.js
const svg = (paths) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const ICON_PLAY = svg(`<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5 3.5-5 3.5z"/>`);
const ICON_CLOCK = svg(`<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/>`);
const ICON_CHEVRON = svg(`<polyline points="6 9 12 15 18 9"/>`);

// أيقونة صندوق الوحدة تُشتقّ من التخصص الغالب في دروسها لتنويع الهوية البصرية للوحدات
const UNIT_ICONS = {
  leaf: svg(`<path d="M5 19c8 0 13-5 14-14C10 6 5 11 5 19z"/><path d="M5 19c2-4 5-7 9-9"/>`),
  rock: svg(`<path d="M5 18l1.6-6.4a2 2 0 0 1 1.7-1.5l2.2-.3 2-3a2 2 0 0 1 2.7-.5l3 1.9a2 2 0 0 1 .9 2l-.6 3.4a2 2 0 0 1-1 1.4L14 17"/><path d="M5 18h14"/>`),
  bio: svg(`<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.4"/><circle cx="8" cy="8.5" r="1"/><circle cx="16.2" cy="15" r="1.2"/><circle cx="15.5" cy="8" r="0.9"/>`),
  layers: svg(`<polygon points="12 3 21 8.5 12 14 3 8.5 12 3"/><polyline points="3 14.5 12 20 21 14.5"/><polyline points="3 11.3 12 16.8 21 11.3"/>`),
  person: svg(`<circle cx="12" cy="7.5" r="3.5"/><path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5"/>`),
  book: svg(`<path d="M12 6.5C10.5 5 8 4.5 4.5 5v12c3.5-.5 6 0 7.5 1.5"/><path d="M12 6.5C13.5 5 16 4.5 19.5 5v12c-3.5-.5-6 0-7.5 1.5"/><line x1="12" y1="6.5" x2="12" y2="18.5"/>`),
};
const SPEC_ICON = {
  ecologie: "leaf", botanique: "leaf", zoologie: "person",
  geologie: "rock", taxonomie: "layers", biomol: "layers", genetique: "layers",
  cytologie: "bio", physiologie: "bio", microbiologie: "bio",
};

function dominantSpec(lecons) {
  const count = {};
  for (const l of lecons) {
    if (l.domaine_specialite) count[l.domaine_specialite] = (count[l.domaine_specialite] || 0) + 1;
  }
  let best = "", max = 0;
  for (const [spec, n] of Object.entries(count)) {
    if (n > max) { max = n; best = spec; }
  }
  return best;
}

// مدة إجمالية (دقائق) → صيغة مقروءة بكل لغة (مثال: "2 س و 10 د" / "2 h 10 min")
function totalDuree(min, lang) {
  const h = Math.floor(min / 60), m = min % 60;
  if (lang === "fr") return h && m ? `${h} h ${m} min` : h ? `${h} h` : `${m} min`;
  return h && m ? `${h} س و ${m} د` : h ? `${h} س` : `${m} د`;
}

function card(l, index) {
  const spec = l.domaine_specialite;
  const badge = spec && DOMAINE_LABEL[spec] ? DOMAINE_LABEL[spec] : null;
  const num = l.ordreInUnite || index + 1;
  return `<a class="lecons-card" href="${l.url}" data-item data-niveau="${l.niveau}" data-filiere="${l.filiere}">
    <div class="lecons-card-media">
      ${l.vignette ? `<img src="/${l.vignette}" alt="${escapeHtml(l.titre.ar)}" loading="lazy" width="480" height="270" />` : ""}
      ${badge ? `<span class="lesson-card-badge" data-spec="${spec}"><span data-lang="ar">${badge.ar}</span><span data-lang="fr">${badge.fr}</span></span>` : ""}
      ${l.duree ? `<span class="lecons-card-duration">${ICON_CLOCK}<span data-lang="ar">${l.duree} د</span><span data-lang="fr">${l.duree} min</span></span>` : ""}
    </div>
    <div class="lecons-card-body">
      <span class="lecons-card-caption"><span data-lang="ar">الدرس ${num}</span><span data-lang="fr">Leçon ${num}</span></span>
      <h4 class="lecons-card-title"><span data-lang="ar">${escapeHtml(l.titre.ar)}</span><span data-lang="fr">${escapeHtml(l.titre.fr)}</span></h4>
    </div>
  </a>`;
}

// تجميع الدروس حسب الوحدة (القسم 3.3) وعرضها كأكورديون: رأس الوحدة (أيقونة + عنوان + عدد الدروس والمدة) ثم شبكة بطاقاتها
function renderAccordion(list) {
  const groups = new Map();
  for (const l of list) {
    const key = l.uniteUrl || l.uniteId;
    if (!groups.has(key)) groups.set(key, { unite: l.unite, niveau: l.niveau, ordre: l.uniteOrdre, lecons: [] });
    groups.get(key).lecons.push(l);
  }
  const ordered = [...groups.values()].sort((a, b) => (a.ordre || 0) - (b.ordre || 0));
  return ordered
    .map((g, i) => {
      g.lecons.sort((a, b) => (a.ordreInUnite || 0) - (b.ordreInUnite || 0));
      const open = i === 0;
      const spec = dominantSpec(g.lecons);
      const icon = UNIT_ICONS[SPEC_ICON[spec]] || UNIT_ICONS.book;
      const total = g.lecons.reduce((s, l) => s + (l.duree || 0), 0);
      const n = g.lecons.length;
      return `<div class="lecons-unit${open ? " is-open" : ""}" data-unit>
      <button class="lecons-unit-head" type="button" aria-expanded="${open}">
        <span class="lecons-unit-icon"${spec ? ` data-spec="${spec}"` : ""}>${icon}</span>
        <span class="lecons-unit-titles">
          <h3 class="lecons-unit-title"><span data-lang="ar">${escapeHtml(g.unite.ar)}</span><span data-lang="fr">${escapeHtml(g.unite.fr)}</span></h3>
          <span class="lecons-unit-meta">
            <span class="lecons-unit-meta-item">${ICON_PLAY}<span data-lang="ar">${n} دروس</span><span data-lang="fr">${n} leçons</span></span>
            ${total ? `<span class="lecons-unit-meta-item">${ICON_CLOCK}<span data-lang="ar">${totalDuree(total, "ar")}</span><span data-lang="fr">${totalDuree(total, "fr")}</span></span>` : ""}
          </span>
        </span>
        <span class="lecons-unit-chevron" aria-hidden="true">${ICON_CHEVRON}</span>
      </button>
      <div class="lecons-unit-content">
        <div class="lecons-unit-grid">${g.lecons.map((l, idx) => card(l, idx)).join("")}</div>
      </div>
    </div>`;
    })
    .join("");
}

// المسلك يُتاح فقط لمستوى ثانوي تأهيلي (القسم 6.3.1)
function isThanawi(niveau) {
  return niveau && !["1ac", "2ac", "3ac"].includes(niveau);
}

function currentLang() {
  return document.documentElement.getAttribute("lang") === "fr" ? "fr" : "ar";
}

async function init() {
  const grid = document.querySelector("[data-lecons-grid]");
  if (!grid) return;
  showSkeleton(grid, 3);
  try {
    const all = await fetchSection("lecons");

    const niveauSelect = document.querySelector('[data-filter-key="niveau"]');
    const filiereSelect = document.querySelector('[data-filter-key="filiere"]');
    const filiereGroup = document.querySelector('[data-filter-key="filiere-group"]');
    const dorraSelect = document.querySelector('[data-filter-key="dorra"]');
    const uniteSelect = document.querySelector('[data-filter-key="unite"]');
    const resetBtn = document.querySelector("[data-filters-reset]");
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
      const filtered = all.filter(
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
      grid.innerHTML = renderAccordion(filtered);
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

    // زر إعادة التعيين: مسح كل الفلاتر وإعادة الحالة الابتدائية
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        state.niveau = state.filiere = state.dorra = state.unite = "";
        niveauSelect.value = "";
        filiereSelect.value = "";
        dorraSelect.value = "";
        filiereGroup.hidden = true;
        populateUnites();
        apply();
      });
    }

    // فتح/طيّ الوحدات (أكورديون) عبر تفويض النقر — المحتوى يُعاد بناؤه عند كل فلترة فلا يمكن ربط مستمع مباشر
    grid.addEventListener("click", (e) => {
      const head = e.target.closest(".lecons-unit-head");
      if (!head) return;
      const unit = head.closest(".lecons-unit");
      const open = unit.classList.toggle("is-open");
      head.setAttribute("aria-expanded", open ? "true" : "false");
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
