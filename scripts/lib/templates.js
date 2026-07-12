// قوالب صفحات التفاصيل (تُستهلك من scripts/prerender.js) — القسم 7.3 و7.6 و7.8
import { renderLessonLangBlock, renderMarkdownArticle, escapeHtml } from "../../assets/js/render-core.js";
import { niveauLabel, filiereLabel, isSecondaire, NIVEAUX, FILIERES } from "../../assets/js/taxonomy.js";
import { renderBreadcrumb } from "./partials.js";

const DUREE_LABEL = (min) => `<span data-lang="ar">${min} د</span><span data-lang="fr">${min} min</span>`;

// يضمّن SVG حرفيا (وليس <img src>) حتى يعمل تبديل data-lang عبر CSS الصفحة (القسم 14.2هـ) —
// مستند <img> معزول عن تنسيقات الصفحة الأصلية. يتراجع لـ <img> عادي للصور غير SVG أو عند غياب deps.svgInliner.
function imageMarkup(src, alt, deps, extraAttrs = "") {
  if (/\.svg$/i.test(src) && deps && deps.svgInliner) {
    const svg = deps.svgInliner(src);
    if (svg) return svg;
  }
  return `<img src="/${src}" alt="${escapeHtml(alt)}" loading="lazy" ${extraAttrs} />`;
}

export function lessonDetailBody({ lecon, unite, deps, prevLecon, nextLecon, track, siblings = [], uniteUrl }) {
  const { sectionsHtml: sectionsAr, tocHtml: tocAr, quizHtml: quizAr } = renderLessonLangBlock(lecon, "ar", deps);
  const { sectionsHtml: sectionsFr, tocHtml: tocFr, quizHtml: quizFr } = renderLessonLangBlock(lecon, "fr", deps);

  const niveauTxt = niveauLabel(lecon.niveau, "ar");
  const niveauTxtFr = niveauLabel(lecon.niveau, "fr");
  const filiereTxt = track && FILIERES[track] ? FILIERES[track].ar : "";
  const filiereTxtFr = track && FILIERES[track] ? FILIERES[track].fr : "";
  const uniteTxt = unite.titre.ar;
  const uniteTxtFr = unite.titre.fr;
  const uHref = uniteUrl || `/lecons/${track}/${unite.slug}/`;

  const breadcrumb = renderBreadcrumb(
    [
      { ar: "الدروس", fr: "Leçons", href: "/lecons/" },
      { ar: niveauTxt, fr: niveauTxtFr, href: `/lecons/#${lecon.niveau}` },
      { ar: uniteTxt, fr: uniteTxtFr, href: uHref },
    ],
    lecon.titre.ar,
    lecon.titre.fr
  );

  const prevHtml = prevLecon
    ? `<a class="lesson-nav-prev" href="${prevLecon.url}"><span class="lesson-nav-dir">← <span data-lang="ar">السابق</span><span data-lang="fr">Précédent</span></span><span class="lesson-nav-t"><span data-lang="ar">${prevLecon.titre.ar}</span><span data-lang="fr">${prevLecon.titre.fr}</span></span></a>`
    : `<span></span>`;
  const nextHtml = nextLecon
    ? `<a class="lesson-nav-next" href="${nextLecon.url}"><span class="lesson-nav-dir"><span data-lang="ar">التالي</span><span data-lang="fr">Suivant</span> →</span><span class="lesson-nav-t"><span data-lang="ar">${nextLecon.titre.ar}</span><span data-lang="fr">${nextLecon.titre.fr}</span></span></a>`
    : `<span></span>`;

  // قائمة "دروس هذه الوحدة" — الوحدة تضم عدة دروس (القسم 3.3)؛ الدرس الحالي مميّز
  const uniteLessonsHtml =
    siblings.length > 1
      ? `<aside class="unit-lessons no-print" aria-label="دروس الوحدة">
      <div class="unit-lessons-head">
        <span class="eyebrow"><span data-lang="ar">دروس الوحدة</span><span data-lang="fr">Leçons de l'unité</span></span>
        <a href="${uHref}"><span data-lang="ar">${uniteTxt}</span><span data-lang="fr">${uniteTxtFr}</span> · ${siblings.length}</a>
      </div>
      <ol class="unit-lessons-list">
        ${siblings
          .map(
            (s) => `<li class="${s.id === lecon.id ? "is-current" : ""}">
          <a href="${s.url}"><span class="unit-lesson-num">${s.ordre}</span><span data-lang="ar">${s.titre.ar}</span><span data-lang="fr">${s.titre.fr}</span></a>
        </li>`
          )
          .join("")}
      </ol>
    </aside>`
      : "";

  return `
<div class="progress-bar-top" data-progress-bar></div>
<div class="container" style="padding-top:var(--sp-5)">
  ${breadcrumb}

  <div class="lesson-info-bar">
    <div class="item"><strong data-lang="ar">المستوى</strong><strong data-lang="fr">Niveau</strong>${niveauTxt ? `<span data-lang="ar">${niveauTxt}</span><span data-lang="fr">${niveauTxtFr}</span>` : ""}</div>
    ${isSecondaire(lecon.niveau) ? `<div class="item"><strong data-lang="ar">السلك</strong><strong data-lang="fr">Cycle</strong><span data-lang="ar">الثانوي التأهيلي</span><span data-lang="fr">Secondaire qualifiant</span></div>` : ""}
    ${filiereTxt ? `<div class="item"><strong data-lang="ar">المسلك</strong><strong data-lang="fr">Filière</strong><span data-lang="ar">${filiereTxt}</span><span data-lang="fr">${filiereTxtFr}</span></div>` : ""}
    <div class="item"><strong data-lang="ar">الوحدة</strong><strong data-lang="fr">Unité</strong><a href="${uHref}"><span data-lang="ar">${uniteTxt}</span><span data-lang="fr">${uniteTxtFr}</span></a></div>
    <div class="item"><strong data-lang="ar">الدورة</strong><strong data-lang="fr">Semestre</strong><span data-lang="ar">${lecon.dorra === 1 ? "الأولى" : "الثانية"}</span><span data-lang="fr">${lecon.dorra}</span></div>
    <div class="item"><strong data-lang="ar">المدة</strong><strong data-lang="fr">Durée</strong>${DUREE_LABEL(lecon.duree_estimee_min)}</div>
  </div>

  <h1><span data-lang="ar">${lecon.titre.ar}</span><span data-lang="fr">${lecon.titre.fr}</span></h1>

  <div class="lesson-layout">
    <aside class="lesson-toc" aria-label="فهرس المحاور">
      <button class="btn btn-ghost btn-sm toc-mobile-toggle" data-toc-mobile-toggle aria-expanded="false" style="display:none">
        <span data-lang="ar">محاور الدرس</span><span data-lang="fr">Sommaire</span>
      </button>
      <div data-toc-list>
        <div data-lang="ar">${tocAr}</div>
        <div data-lang="fr">${tocFr}</div>
      </div>
      ${uniteLessonsHtml}
    </aside>
    <div data-lesson-content data-content-src="" data-lecon-id="${lecon.id}">
      <div data-lang="ar">${sectionsAr}${quizAr}</div>
      <div data-lang="fr">${sectionsFr}${quizFr}</div>
    </div>
  </div>

  <div class="lesson-nav no-print">
    ${prevHtml}
    <button class="btn btn-ghost btn-sm" onclick="window.print()"><span data-lang="ar">🖨️ طباعة / تنزيل PDF</span><span data-lang="fr">🖨️ Imprimer / PDF</span></button>
    ${nextHtml}
  </div>
</div>`;
}

// صفحة فهرس الوحدة — تعرض كل دروس الوحدة مرتّبة (القسم 3.3: الوحدة تضم عدة دروس)
export function uniteDetailBody({ group }) {
  const { unite, track, lecons } = group;
  const niveauTxt = niveauLabel(unite.niveau, "ar");
  const niveauTxtFr = niveauLabel(unite.niveau, "fr");
  const filiereTxt = FILIERES[track] ? FILIERES[track].ar : "";
  const filiereTxtFr = FILIERES[track] ? FILIERES[track].fr : "";

  const breadcrumb = renderBreadcrumb(
    [
      { ar: "الدروس", fr: "Leçons", href: "/lecons/" },
      { ar: niveauTxt, fr: niveauTxtFr, href: `/lecons/#${unite.niveau}` },
    ],
    unite.titre.ar,
    unite.titre.fr
  );

  const cards = lecons
    .map(
      (it) => `<a class="unit-lesson-card card-link" href="${it.url}">
      <span class="unit-lesson-card-num">${it.ordre}</span>
      <span class="unit-lesson-card-body">
        <span class="unit-lesson-card-title"><span data-lang="ar">${it.lecon.titre.ar}</span><span data-lang="fr">${it.lecon.titre.fr}</span></span>
        <span class="unit-lesson-card-meta mono">${it.lecon.duree_estimee_min} <span data-lang="ar">د</span><span data-lang="fr">min</span></span>
      </span>
      <span class="unit-lesson-card-arrow" aria-hidden="true">←</span>
    </a>`
    )
    .join("");

  return `
<div class="container" style="padding-top:var(--sp-6);max-width:840px">
  ${breadcrumb}
  <span class="chip">${filiereTxt ? `<span data-lang="ar">${filiereTxt}</span><span data-lang="fr">${filiereTxtFr}</span>` : `<span data-lang="ar">${niveauTxt}</span><span data-lang="fr">${niveauTxtFr}</span>`} · <span data-lang="ar">الدورة ${unite.dorra || 1}</span><span data-lang="fr">Semestre ${unite.dorra || 1}</span></span>
  <h1 style="margin-top:var(--sp-3)"><span data-lang="ar">${unite.titre.ar}</span><span data-lang="fr">${unite.titre.fr}</span></h1>
  <p class="unit-count mono"><span aria-hidden="true">📚</span> ${lecons.length} <span data-lang="ar">دروس في هذه الوحدة</span><span data-lang="fr">leçons dans cette unité</span></p>
  <div class="unit-lessons-cards">${cards}</div>
</div>`;
}

const ARTICLE_KIND_CRUMB = {
  article: { ar: "الموسوعة", fr: "Encyclopédie", href: "/encyclopedie/" },
  blog: { ar: "المدونة", fr: "Blog", href: "/blog/" },
  resume: { ar: "المراجعة", fr: "Révision", href: "/revision/" },
};

export function articleDetailBody({ article, kind = "article", relatedHtml = "", deps }) {
  const crumb = ARTICLE_KIND_CRUMB[kind] || ARTICLE_KIND_CRUMB.article;
  const htmlAr = article.bodyAr ? renderMarkdownArticle(article.bodyAr, "ar", deps) : "";
  const htmlFr = article.bodyFr ? renderMarkdownArticle(article.bodyFr, "fr", deps) : "";
  const printBtn = kind === "resume" ? `<button class="btn btn-ghost btn-sm no-print" onclick="window.print()" style="margin-bottom:var(--sp-5)">🖨️ <span data-lang="ar">طباعة</span><span data-lang="fr">Imprimer</span></button>` : "";
  return `
<div class="container" style="padding-top:var(--sp-5);max-width:760px">
  ${renderBreadcrumb([crumb], article.titre_ar, article.titre_fr)}
  ${article.image_cover ? `<img src="/${article.image_cover}" alt="${escapeHtml(article.titre_ar)}" loading="lazy" style="border-radius:var(--radius-lg);margin-bottom:var(--sp-5)" width="1200" height="630" />` : ""}
  ${article.categorie || article.date ? `<p class="eyebrow" style="color:var(--accent)">${article.categorie || ""} ${article.categorie && article.date ? "·" : ""} ${article.date || ""}</p>` : ""}
  <h1><span data-lang="ar">${article.titre_ar}</span><span data-lang="fr">${article.titre_fr || ""}</span></h1>
  ${article.auteur ? `<p class="eyebrow" data-lang="ar">${article.auteur}</p><p class="eyebrow" data-lang="fr">${article.auteur}</p>` : ""}
  ${printBtn}
  <div class="article-body" data-lang="ar">${htmlAr || `<p class="lang-missing-note">هذا المحتوى غير متوفر بعد بالعربية.</p>`}</div>
  <div class="article-body" data-lang="fr">${htmlFr || `<p class="lang-missing-note">Ce contenu n'est pas encore disponible en français.</p>`}</div>
  ${relatedHtml}
</div>`;
}

export function glossaireDetailBody(term) {
  return `
<div class="container" style="padding-top:var(--sp-5);max-width:680px">
  ${renderBreadcrumb([{ ar: "الموسوعة", fr: "Encyclopédie", href: "/encyclopedie/" }, { ar: "المعجم", fr: "Glossaire", href: "/encyclopedie/glossaire/" }], term.terme.ar, term.terme.fr)}
  <span class="chip chip-accent">🔤 <span data-lang="ar">مصطلح معجمي</span><span data-lang="fr">Terme</span></span>
  <h1><span data-lang="ar">${term.terme.ar}</span><span data-lang="fr">${term.terme.fr}</span></h1>
  <p style="font-size:var(--fs-18)"><span data-lang="ar">${term.definition.ar}</span><span data-lang="fr">${term.definition.fr}</span></p>
  ${
    term.voir_aussi && term.voir_aussi.length
      ? `<div style="margin-top:var(--sp-6)"><h3 data-lang="ar">انظر أيضا</h3><h3 data-lang="fr">Voir aussi</h3>
    <div style="display:flex;gap:var(--sp-2);flex-wrap:wrap">${term.voir_aussi.map((id) => `<a class="chip" href="/encyclopedie/glossaire/${id}/">${id}</a>`).join("")}</div></div>`
      : ""
  }
</div>`;
}

export function scientifiqueDetailBody(sci) {
  return `
<div class="container" style="padding-top:var(--sp-5);max-width:680px">
  ${renderBreadcrumb([{ ar: "الموسوعة", fr: "Encyclopédie", href: "/encyclopedie/" }, { ar: "علماء", fr: "Scientifiques", href: "/encyclopedie/scientifiques/" }], sci.nom.ar, sci.nom.fr)}
  ${sci.photo ? `<img src="/${sci.photo}" alt="${escapeHtml(sci.nom.ar)}" loading="lazy" style="border-radius:50%;width:160px;height:160px;object-fit:cover;margin-bottom:var(--sp-4)" width="160" height="160" />` : ""}
  <h1><span data-lang="ar">${sci.nom.ar}</span><span data-lang="fr">${sci.nom.fr}</span></h1>
  <p class="eyebrow"><bdi dir="ltr">${sci.periode || ""}</bdi></p>
  <p style="font-size:var(--fs-18)"><span data-lang="ar">${sci.resume.ar}</span><span data-lang="fr">${sci.resume.fr}</span></p>
  ${
    sci.contributions
      ? `<h3 data-lang="ar">أبرز المساهمات</h3><h3 data-lang="fr">Contributions majeures</h3>
    <ul data-lang="ar">${sci.contributions.ar.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}</ul>
    <ul data-lang="fr">${sci.contributions.fr.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}</ul>`
      : ""
  }
</div>`;
}

export function decouverteDetailBody(dec) {
  return `
<div class="container" style="padding-top:var(--sp-5);max-width:680px">
  ${renderBreadcrumb([{ ar: "الموسوعة", fr: "Encyclopédie", href: "/encyclopedie/" }, { ar: "اكتشافات", fr: "Découvertes", href: "/encyclopedie/decouvertes/" }], dec.titre.ar, dec.titre.fr)}
  <span class="chip chip-secondary">${dec.annee}</span>
  <h1><span data-lang="ar">${dec.titre.ar}</span><span data-lang="fr">${dec.titre.fr}</span></h1>
  <p style="font-size:var(--fs-18)"><span data-lang="ar">${dec.resume.ar}</span><span data-lang="fr">${dec.resume.fr}</span></p>
  ${
    dec.scientifiques_lies && dec.scientifiques_lies.length
      ? `<div style="display:flex;gap:var(--sp-2);flex-wrap:wrap;margin-top:var(--sp-4)">${dec.scientifiques_lies
          .map((id) => `<a class="chip" href="/encyclopedie/scientifiques/${id}/">${id}</a>`)
          .join("")}</div>`
      : ""
  }
</div>`;
}

export function chronologieDetailBody(chr) {
  const items = chr.evenements
    .map(
      (e) => `<div class="timeline-item"><span class="year">${e.annee}</span>
      <h4><span data-lang="ar">${e.titre.ar}</span><span data-lang="fr">${e.titre.fr}</span></h4>
      <p><span data-lang="ar">${e.description.ar}</span><span data-lang="fr">${e.description.fr}</span></p></div>`
    )
    .join("");
  return `
<div class="container" style="padding-top:var(--sp-5)">
  ${renderBreadcrumb([{ ar: "الموسوعة", fr: "Encyclopédie", href: "/encyclopedie/" }, { ar: "خطوط زمنية", fr: "Chronologies", href: "/encyclopedie/chronologies/" }], chr.titre.ar, chr.titre.fr)}
  <h1><span data-lang="ar">${chr.titre.ar}</span><span data-lang="fr">${chr.titre.fr}</span></h1>
  <div class="timeline">${items}</div>
</div>`;
}

export function saviezVousDetailBody(item) {
  return `
<div class="container" style="padding-top:var(--sp-5);max-width:600px;text-align:center">
  ${renderBreadcrumb([{ ar: "الموسوعة", fr: "Encyclopédie", href: "/encyclopedie/" }, { ar: "هل تعلم؟", fr: "Le saviez-vous", href: "/encyclopedie/saviez-vous/" }], "هل تعلم؟", "Le saviez-vous ?")}
  <div class="le-saviez-vous">
    <span class="le-saviez-vous-icon">💡</span>
    <p style="font-size:var(--fs-20)"><span data-lang="ar">${item.texte.ar}</span><span data-lang="fr">${item.texte.fr}</span></p>
    ${item.lien_article ? `<a href="/encyclopedie/articles/${item.lien_article}/"><span data-lang="ar">اقرأ المزيد ←</span><span data-lang="fr">Lire la suite ←</span></a>` : ""}
  </div>
</div>`;
}

export function galerieDetailBody(item, deps) {
  const legendes = item.legendes
    .map((l, i) => `<li><span data-lang="ar">${i + 1}. ${l.ar}</span><span data-lang="fr">${i + 1}. ${l.fr}</span></li>`)
    .join("");
  return `
<div class="container" style="padding-top:var(--sp-5);max-width:820px">
  ${renderBreadcrumb([{ ar: "الموسوعة", fr: "Encyclopédie", href: "/encyclopedie/" }, { ar: "المعرض", fr: "Galerie", href: "/encyclopedie/galerie/" }], item.titre.ar, item.titre.fr)}
  <h1><span data-lang="ar">${item.titre.ar}</span><span data-lang="fr">${item.titre.fr}</span></h1>
  <div style="border-radius:var(--radius-lg);overflow:hidden">${imageMarkup(item.image, item.titre.ar, deps)}</div>
  <ul style="margin-top:var(--sp-4)">${legendes}</ul>
  ${
    item.lecons_liees && item.lecons_liees.length
      ? `<div style="margin-top:var(--sp-5)"><h3 data-lang="ar">الدروس المرتبطة</h3><h3 data-lang="fr">Leçons liées</h3>
    <div style="display:flex;gap:var(--sp-2);flex-wrap:wrap">${item.lecons_liees.map((id) => `<span class="chip">${id}</span>`).join("")}</div></div>`
      : ""
  }
</div>`;
}
