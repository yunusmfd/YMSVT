import { fetchSection, showError, escapeHtml } from "../list-page.js";
import { initFlashcards } from "../flashcards.js";
import { t } from "../i18n.js";
import { ICON_DOCUMENT } from "../icons.js";

function resumeCard(r) {
  return `<a class="card card-link" href="/revision/resumes/${r.id}/">
    <span class="card-icon-lg" aria-hidden="true">${ICON_DOCUMENT}</span>
    <h4 style="margin-top:var(--sp-3)"><span data-lang="ar">${escapeHtml(r.titre.ar)}</span><span data-lang="fr">${escapeHtml(r.titre.fr)}</span></h4>
  </a>`;
}

function carteCard(c) {
  return `<div class="card" data-lightbox-trigger data-src="/${c.image}" data-title="${escapeHtml(c.titre.ar)}">
    <img src="/${c.image}" alt="${escapeHtml(c.titre.ar)}" loading="lazy" />
    <h4 style="margin-top:var(--sp-3)"><span data-lang="ar">${escapeHtml(c.titre.ar)}</span><span data-lang="fr">${escapeHtml(c.titre.fr)}</span></h4>
    <a class="btn btn-ghost btn-sm" href="/${c.image}" download style="margin-top:var(--sp-2)"><span data-lang="ar">تنزيل</span><span data-lang="fr">Télécharger</span></a>
  </div>`;
}

function flashcardHtml(f) {
  return `<div class="flashcard" data-flashcard tabindex="0" role="button" aria-label="flashcard">
    <div class="flashcard-inner">
      <div class="flashcard-face flashcard-front"><span data-lang="ar">${escapeHtml(f.question.ar)}</span><span data-lang="fr">${escapeHtml(f.question.fr)}</span></div>
      <div class="flashcard-face flashcard-back"><span data-lang="ar">${escapeHtml(f.reponse.ar)}</span><span data-lang="fr">${escapeHtml(f.reponse.fr)}</span></div>
    </div>
  </div>`;
}

function quizDocHtml(q) {
  const questions = q.questions
    .map(
      (item, i) => `<div class="quiz-question">
      <span class="chip">${item.type}</span>
      <p><strong>${i + 1}. <span data-lang="ar">${escapeHtml(item.enonce.ar)}</span><span data-lang="fr">${escapeHtml(item.enonce.fr)}</span></strong></p>
      <button class="btn btn-ghost btn-sm" data-reveal-answer><span data-lang="ar">عرض الجواب النموذجي</span><span data-lang="fr">Voir la réponse modèle</span></button>
      <div class="quiz-justification" hidden><span data-lang="ar">${escapeHtml(item.reponse_modele.ar)}</span><span data-lang="fr">${escapeHtml(item.reponse_modele.fr)}</span></div>
    </div>`
    )
    .join("");
  return `<div class="card" style="margin-bottom:var(--sp-5)">
    <h3><span data-lang="ar">${escapeHtml(q.titre.ar)}</span><span data-lang="fr">${escapeHtml(q.titre.fr)}</span></h3>
    ${q.document && q.document.type === "image" ? `<img src="/${q.document.src}" alt="" loading="lazy" style="margin:var(--sp-4) 0" />` : ""}
    ${questions}
  </div>`;
}

const SOUS_TYPE_LABEL = {
  mahali: { ar: "امتحان محلي", fr: "Examen local" },
  jihawi: { ar: "امتحان جهوي", fr: "Examen régional" },
  watani: { ar: "امتحان وطني", fr: "Examen national" },
};

function examCard(e) {
  const typeLabel = e.type === "fard" ? { ar: "فرض", fr: "Devoir" } : SOUS_TYPE_LABEL[e.sous_type] || { ar: "امتحان", fr: "Examen" };
  return `<div class="card">
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:var(--sp-3)">
      <span class="chip chip-primary"><span data-lang="ar">${typeLabel.ar}</span><span data-lang="fr">${typeLabel.fr}</span></span>
      <span class="chip">${e.niveau.toUpperCase()}${e.filiere ? " · " + e.filiere.toUpperCase() : ""}</span>
      <span class="chip"><span data-lang="ar">الدورة ${e.dorra}</span><span data-lang="fr">Semestre ${e.dorra}</span></span>
    </div>
    <h4><span data-lang="ar">${escapeHtml(e.titre.ar)}</span><span data-lang="fr">${escapeHtml(e.titre.fr)}</span></h4>
    <p class="mono" style="font-size:var(--fs-12)">${e.annee_scolaire}</p>
    <div style="display:flex;gap:var(--sp-2);margin-top:var(--sp-3)">
      <a class="btn btn-primary btn-sm" href="/${e.fichier_pdf}" download><span data-lang="ar">تحميل</span><span data-lang="fr">Télécharger</span></a>
      ${e.corrige_pdf ? `<a class="btn btn-ghost btn-sm" href="/${e.corrige_pdf}" download><span data-lang="ar">التصحيح</span><span data-lang="fr">Corrigé</span></a>` : ""}
    </div>
  </div>`;
}

function currentLang() {
  return document.documentElement.getAttribute("lang") === "fr" ? "fr" : "ar";
}

function isThanawi(niveau) {
  return niveau && !["1ac", "2ac", "3ac"].includes(niveau);
}

function emptyMsg() {
  const lang = currentLang();
  return `<p class="state-empty">${lang === "fr" ? "Rien pour ce choix pour l'instant." : "لا يوجد محتوى لهذا الاختيار بعد."}</p>`;
}

function wireLightbox() {
  const lightbox = document.querySelector("[data-lightbox]");
  const lightboxImg = document.querySelector("[data-lightbox-img]");
  document.querySelectorAll("[data-lightbox-trigger]").forEach((el) => {
    el.addEventListener("click", () => {
      lightboxImg.src = el.getAttribute("data-src");
      lightboxImg.alt = el.getAttribute("data-title");
      lightbox.hidden = false;
    });
  });
}
function wireReveal() {
  document.querySelectorAll("[data-reveal-answer]").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.nextElementSibling.hidden = false;
      btn.hidden = true;
    });
  });
}

// ========== 1) قسم "مراجعة الدروس" — نفس فلاتر صفحة الدروس (مستوى/مسلك/دورة/وحدة) ==========
function initLeconsSection(rev) {
  const panel = document.querySelector('[data-section-panel="lecons"]');
  if (!panel) return;

  const niveauSelect = panel.querySelector('[data-revision-filter="niveau"]');
  const filiereSelect = panel.querySelector('[data-revision-filter="filiere"]');
  const filiereGroup = panel.querySelector('[data-filter-key="filiere-group"]');
  const dorraSelect = panel.querySelector('[data-revision-filter="dorra"]');
  const uniteSelect = panel.querySelector('[data-revision-filter="unite"]');
  const typeTabs = panel.querySelector("[data-revision-type]");

  const state = { niveau: "", filiere: "", dorra: "", unite: "", type: "resumes" };

  function currentList() {
    return rev[state.type] || [];
  }

  function populateUnites() {
    const scoped = currentList().filter(
      (it) =>
        (!state.niveau || it.niveau === state.niveau) &&
        (!state.filiere || (it.filieres || []).includes(state.filiere)) &&
        (!state.dorra || String(it.dorra) === state.dorra)
    );
    const names = [...new Set(scoped.map((it) => it.unite).filter(Boolean))];
    if (!names.includes(state.unite)) state.unite = "";
    uniteSelect.innerHTML = `<option value="">${t("filter_all", currentLang())}</option>` + names.map((n) => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join("");
    uniteSelect.value = state.unite;
  }

  function apply() {
    const filtered = currentList().filter(
      (it) =>
        (!state.niveau || it.niveau === state.niveau) &&
        (!state.filiere || (it.filieres || []).includes(state.filiere)) &&
        (!state.dorra || String(it.dorra) === state.dorra) &&
        (!state.unite || it.unite === state.unite)
    );
    if (state.type === "resumes") panel.querySelector('[data-revision-panel="resumes"]').innerHTML = filtered.map(resumeCard).join("") || emptyMsg();
    if (state.type === "cartesMentales") panel.querySelector('[data-revision-panel="cartesMentales"]').innerHTML = filtered.map(carteCard).join("") || emptyMsg();
    if (state.type === "flashcards") {
      panel.querySelector('[data-revision-panel="flashcards"] [data-flashcards-grid]').innerHTML = filtered.map(flashcardHtml).join("") || emptyMsg();
      initFlashcards();
    }
    if (state.type === "quizDocuments") panel.querySelector('[data-revision-panel="quizDocuments"]').innerHTML = filtered.map(quizDocHtml).join("") || emptyMsg();
    wireLightbox();
    wireReveal();
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
  typeTabs.querySelectorAll("[data-type-value]").forEach((btn) => {
    btn.addEventListener("click", () => {
      typeTabs.querySelectorAll("[data-type-value]").forEach((b) => b.setAttribute("aria-selected", "false"));
      btn.setAttribute("aria-selected", "true");
      state.type = btn.getAttribute("data-type-value");
      panel.querySelectorAll("[data-revision-panel]").forEach((p) => (p.hidden = p.getAttribute("data-revision-panel") !== state.type));
      populateUnites();
      apply();
    });
  });

  new MutationObserver(() => populateUnites()).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  populateUnites();
  apply();
}

// ========== 2) قسم "الاستعداد للفروض" — فلاتر مستوى/مسلك/دورة على الفروض ==========
function initFroudSection(exams) {
  const panel = document.querySelector('[data-section-panel="froud"]');
  if (!panel) return;

  const niveauSelect = panel.querySelector('[data-revision-filter="fard-niveau"]');
  const filiereSelect = panel.querySelector('[data-revision-filter="fard-filiere"]');
  const filiereGroup = panel.querySelector('[data-filter-key="fard-filiere-group"]');
  const dorraSelect = panel.querySelector('[data-revision-filter="fard-dorra"]');
  const grid = panel.querySelector("[data-fard-grid]");
  const emptyState = panel.querySelector("[data-fard-empty]");

  const state = { niveau: "", filiere: "", dorra: "" };
  const fards = exams.filter((e) => e.type === "fard");

  function apply() {
    const filtered = fards.filter(
      (e) => (!state.niveau || e.niveau === state.niveau) && (!state.filiere || e.filiere === state.filiere) && (!state.dorra || String(e.dorra) === state.dorra)
    );
    grid.innerHTML = filtered.map(examCard).join("");
    emptyState.hidden = filtered.length > 0;
  }

  niveauSelect.addEventListener("change", () => {
    state.niveau = niveauSelect.value;
    filiereGroup.hidden = !isThanawi(state.niveau);
    if (filiereGroup.hidden) {
      state.filiere = "";
      filiereSelect.value = "";
    }
    apply();
  });
  filiereSelect.addEventListener("change", () => {
    state.filiere = filiereSelect.value;
    apply();
  });
  dorraSelect.addEventListener("change", () => {
    state.dorra = dorraSelect.value;
    apply();
  });

  apply();
}

// ========== 3) قسم "الاستعداد للامتحانات" — 3AC (محلي/جهوي) و2BAC (وطني حسب المسلك) فقط ==========
function initImtihanatSection(exams) {
  const panel = document.querySelector('[data-section-panel="imtihanat"]');
  if (!panel) return;

  const niveauTabs = panel.querySelector("[data-imtihan-niveau]");
  const panels3ac = panel.querySelector('[data-imtihan-panel="3ac"]');
  const panels2bac = panel.querySelector('[data-imtihan-panel="2bac"]');
  const grid3ac = panel.querySelector("[data-imtihan-3ac-grid]");
  const grid2bac = panel.querySelector("[data-imtihan-2bac-grid]");
  const filiere2bacSelect = panel.querySelector("[data-imtihan-2bac-filiere]");

  const imtihans3ac = exams.filter((e) => e.niveau === "3ac" && e.type === "imtihan").sort((a, b) => a.dorra - b.dorra);
  const imtihansWatani = exams.filter((e) => e.niveau === "2bac" && e.type === "imtihan" && e.sous_type === "watani");

  grid3ac.innerHTML = imtihans3ac.map(examCard).join("") || emptyMsg();

  function render2bac() {
    const f = filiere2bacSelect.value;
    const filtered = f ? imtihansWatani.filter((e) => e.filiere === f) : imtihansWatani;
    grid2bac.innerHTML = filtered.map(examCard).join("") || emptyMsg();
  }
  filiere2bacSelect.addEventListener("change", render2bac);
  render2bac();

  niveauTabs.querySelectorAll("[data-imtihan-niveau-value]").forEach((btn) => {
    btn.addEventListener("click", () => {
      niveauTabs.querySelectorAll("[data-imtihan-niveau-value]").forEach((b) => b.setAttribute("aria-selected", "false"));
      btn.setAttribute("aria-selected", "true");
      const v = btn.getAttribute("data-imtihan-niveau-value");
      panels3ac.hidden = v !== "3ac";
      panels2bac.hidden = v !== "2bac";
    });
  });
}

// ========== تبديل الأقسام الرئيسية الثلاثة ==========
function initSectionTabs() {
  const tabs = document.querySelector("[data-revision-section]");
  if (!tabs) return;
  tabs.querySelectorAll("[data-section-value]").forEach((btn) => {
    btn.addEventListener("click", () => {
      tabs.querySelectorAll("[data-section-value]").forEach((b) => b.setAttribute("aria-selected", "false"));
      btn.setAttribute("aria-selected", "true");
      const v = btn.getAttribute("data-section-value");
      document.querySelectorAll("[data-section-panel]").forEach((p) => (p.hidden = p.getAttribute("data-section-panel") !== v));
    });
  });
}

async function init() {
  const root = document.querySelector("[data-revision-section]");
  if (!root) return;
  try {
    const [revision, exams] = await Promise.all([fetchSection("revision"), fetchSection("exams")]);
    initSectionTabs();
    initLeconsSection(revision);
    initFroudSection(exams);
    initImtihanatSection(exams);
  } catch (e) {
    showError(document.querySelector('[data-revision-panel="resumes"]'), init);
  }
}
document.addEventListener("DOMContentLoaded", init);
