import { fetchSection, showError, escapeHtml } from "../list-page.js";

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

function emptyMsg() {
  const lang = document.documentElement.getAttribute("lang") === "fr" ? "fr" : "ar";
  return `<p class="state-empty">${lang === "fr" ? "Rien pour ce choix pour l'instant." : "لا يوجد محتوى لهذا الاختيار بعد."}</p>`;
}

function isThanawi(niveau) {
  return niveau && !["1ac", "2ac", "3ac"].includes(niveau);
}

// ========== 1) قسم "الفروض" — مستوى + مسلك (عند الاقتضاء) + دورة ==========
function initFardSection(exams) {
  const panel = document.querySelector('[data-exsection-panel="fard"]');
  if (!panel) return;

  const niveauSelect = panel.querySelector('[data-revision-filter="ex-fard-niveau"]');
  const filiereSelect = panel.querySelector('[data-revision-filter="ex-fard-filiere"]');
  const filiereGroup = panel.querySelector('[data-filter-key="ex-fard-filiere-group"]');
  const dorraSelect = panel.querySelector('[data-revision-filter="ex-fard-dorra"]');
  const grid = panel.querySelector("[data-exams-fard-grid]");
  const emptyState = panel.querySelector("[data-exams-fard-empty]");

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

// ========== 2) قسم "الامتحانات" — 3AC (محلي/جهوي) و2BAC (وطني حسب المسلك) فقط ==========
function initImtihanSection(exams) {
  const panel = document.querySelector('[data-exsection-panel="imtihan"]');
  if (!panel) return;

  const niveauTabs = panel.querySelector("[data-exams-imtihan-niveau]");
  const panel3ac = panel.querySelector('[data-exams-imtihan-panel="3ac"]');
  const panel2bac = panel.querySelector('[data-exams-imtihan-panel="2bac"]');
  const grid3ac = panel.querySelector("[data-exams-imtihan-3ac-grid]");
  const grid2bac = panel.querySelector("[data-exams-imtihan-2bac-grid]");
  const filiere2bacSelect = panel.querySelector("[data-exams-imtihan-2bac-filiere]");

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

  niveauTabs.querySelectorAll("[data-exams-imtihan-niveau-value]").forEach((btn) => {
    btn.addEventListener("click", () => {
      niveauTabs.querySelectorAll("[data-exams-imtihan-niveau-value]").forEach((b) => b.setAttribute("aria-selected", "false"));
      btn.setAttribute("aria-selected", "true");
      const v = btn.getAttribute("data-exams-imtihan-niveau-value");
      panel3ac.hidden = v !== "3ac";
      panel2bac.hidden = v !== "2bac";
    });
  });
}

function initSectionTabs() {
  const tabs = document.querySelector("[data-exams-section]");
  if (!tabs) return;
  tabs.querySelectorAll("[data-exsection-value]").forEach((btn) => {
    btn.addEventListener("click", () => {
      tabs.querySelectorAll("[data-exsection-value]").forEach((b) => b.setAttribute("aria-selected", "false"));
      btn.setAttribute("aria-selected", "true");
      const v = btn.getAttribute("data-exsection-value");
      document.querySelectorAll("[data-exsection-panel]").forEach((p) => (p.hidden = p.getAttribute("data-exsection-panel") !== v));
    });
  });
}

async function init() {
  const root = document.querySelector("[data-exams-section]");
  if (!root) return;
  try {
    const exams = await fetchSection("exams");
    initSectionTabs();
    initFardSection(exams);
    initImtihanSection(exams);
  } catch (e) {
    showError(document.querySelector("[data-exams-fard-grid]"), init);
  }
}

document.addEventListener("DOMContentLoaded", init);
