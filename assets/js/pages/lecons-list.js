import { fetchManifest, showSkeleton, showError, showEmpty, escapeHtml } from "../list-page.js";

function card(l) {
  return `<a class="card card-link" href="${l.url}" data-item data-niveau="${l.niveau}" data-filiere="${l.filiere}">
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

async function init() {
  const grid = document.querySelector("[data-lecons-grid]");
  if (!grid) return;
  showSkeleton(grid, 6);
  try {
    const manifest = await fetchManifest();
    const all = manifest.lecons;

    // الفلاتر تعمل على مستوى الوحدات هنا: نُعيد الرسم المجمّع عند كل تغيير فلتر
    const filterWrap = document.querySelector("[data-filters]");
    const state = { niveau: "", filiere: "" };

    function apply() {
      let filtered = all.filter((l) => (!state.niveau || l.niveau === state.niveau) && (!state.filiere || l.filiere === state.filiere));
      if (!filtered.length) {
        showEmpty(grid, "لا توجد دروس بعد لهذا الاختيار، جرّب مستوى آخر.", "Aucune leçon pour ce choix, essayez un autre niveau.");
        return;
      }
      grid.innerHTML = renderGrouped(filtered);
    }

    // ربط أزرار الفلاتر (المستوى/المسلك) — منطق مبسّط خاص بهذه الصفحة لأنها تُعيد بناء التجميع
    filterWrap.querySelectorAll('[data-filter-key="niveau"] [data-filter-value]').forEach((btn) => {
      btn.addEventListener("click", () => {
        const v = btn.getAttribute("data-filter-value");
        state.niveau = state.niveau === v ? "" : v;
        filterWrap.querySelectorAll('[data-filter-key="niveau"] [data-filter-value]').forEach((b) => b.setAttribute("aria-selected", String(b === btn && state.niveau === v)));
        // فلتر المسلك يظهر فقط لمستوى ثانوي تأهيلي (القسم 6.3.1)
        const isThanawi = state.niveau && !["1ac", "2ac", "3ac"].includes(state.niveau);
        const filiereGroup = filterWrap.querySelector('[data-filter-key="filiere"]').closest(".filter-group");
        filiereGroup.hidden = !isThanawi;
        if (!isThanawi) {
          state.filiere = "";
          filterWrap.querySelectorAll('[data-filter-key="filiere"] [data-filter-value]').forEach((b) => b.setAttribute("aria-selected", "false"));
        }
        apply();
      });
    });
    filterWrap.querySelectorAll('[data-filter-key="filiere"] [data-filter-value]').forEach((btn) => {
      btn.addEventListener("click", () => {
        const v = btn.getAttribute("data-filter-value");
        state.filiere = state.filiere === v ? "" : v;
        filterWrap.querySelectorAll('[data-filter-key="filiere"] [data-filter-value]').forEach((b) => b.setAttribute("aria-selected", String(b === btn && state.filiere === v)));
        apply();
      });
    });

    apply();

    // فتح المستوى مباشرة من الرابط المرساة (#2bac مثلا) القادم من "أنا في..." بالرئيسية
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const chip = document.querySelector(`[data-filter-key="niveau"] [data-filter-value="${hash}"]`);
      if (chip) chip.click();
    }
  } catch (e) {
    showError(grid, init);
  }
}

document.addEventListener("DOMContentLoaded", init);
