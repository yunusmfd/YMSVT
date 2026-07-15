/*
  محرك عرض المحتوى المشترك — القسم 12.2 و12.2.1
  ملف واحد يُستدعى من مكانين بلا تكرار منطق:
   (أ) المتصفح: assets/js/render-engine.js (fetch وقت التصفح — Fallback عند غياب HTML مصيَّر مسبقا)
   (ب) البناء: scripts/prerender.js (Node، وقت النشر عبر Netlify)
  دوال نقية: لا "document"، لا "fs" — تُستقبل مكتبات markdown/sanitize كاعتماديات (Dependency Injection)
  حتى يعمل نفس الكود في المتصفح (marked.min.js/purify.min.js عبر <script> عادي) وفي Node (حزم npm).
*/

// أيقونات خطّية مضمَّنة محليا (لا استيراد من scripts/lib/icons.js) لأن هذا الملف يعمل حرفيا
// في كل من المتصفح (fetch عبر render-engine.js) والبناء (Node عبر prerender.js) دون أي مسار بناء —
// مسار scripts/lib غير متاح وقت التصفح، فتُكرَّر أيقونات صغيرة متّسقة الأسلوب (24×24، stroke 1.6) هنا فقط.
const SVG_ICON = (paths) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

const ENCADRE_ICONS = {
  molahada: SVG_ICON(`<circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16.5"/><circle cx="12" cy="7.8" r="0.6" fill="currentColor" stroke="none"/>`),
  tanbih: SVG_ICON(`<path d="M12 4L21.5 20H2.5z"/><line x1="12" y1="10" x2="12" y2="14.2"/><circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none"/>`),
  qaida: SVG_ICON(`<rect x="3" y="9" width="18" height="6" rx="1.2"/><line x1="7.5" y1="9" x2="7.5" y2="12"/><line x1="11.5" y1="9" x2="11.5" y2="12"/><line x1="15.5" y1="9" x2="15.5" y2="12"/>`),
  istintaj: SVG_ICON(`<line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/>`),
  khoulasa: SVG_ICON(`<rect x="4" y="3" width="16" height="18" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="13" y2="16"/>`),
  maaloumaMouhima: SVG_ICON(`<path d="M9.5 18h5"/><path d="M10.3 21h3.4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.3 1 2.1h5c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>`),
  taarif: SVG_ICON(`<path d="M20 12.2L11.8 20.4a1.6 1.6 0 0 1-2.3 0L3.6 14.5a1.6 1.6 0 0 1 0-2.3L11.8 4h6.6a1.6 1.6 0 0 1 1.6 1.6z"/><circle cx="15.3" cy="8.7" r="1.3"/>`),
};

const ICON_BULB = SVG_ICON(`<path d="M9.5 18h5"/><path d="M10.3 21h3.4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.3 1 2.1h5c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>`);
const ICON_FLASK = SVG_ICON(`<path d="M9 3h6"/><path d="M10 3v6l-4.5 8a1.6 1.6 0 0 0 1.4 2.4h10.2A1.6 1.6 0 0 0 18.5 17L14 9V3"/><path d="M7.3 14h9.4"/>`);

const ENCADRE_TITRES_DEFAUT = {
  molahada: { ar: "ملاحظة", fr: "Remarque" },
  tanbih: { ar: "تنبيه", fr: "Attention" },
  qaida: { ar: "قاعدة", fr: "Règle" },
  istintaj: { ar: "استنتاج", fr: "Déduction" },
  khoulasa: { ar: "خلاصة", fr: "Synthèse" },
  maaloumaMouhima: { ar: "معلومة مهمة", fr: "Info clé" },
  taarif: { ar: "تعريف", fr: "Définition" },
};

export function escapeHtml(str) {
  return String(str == null ? "" : str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// {{terme:id}} أو {{terme:id|نص العرض}} → span مفعّل (القسم 6.1.4)
export function replaceGlossaryTokens(text, lang, glossaryIndex) {
  if (!text) return "";
  return text.replace(/\{\{terme:([a-z0-9-]+)(?:\|([^}]+))\}\}|\{\{terme:([a-z0-9-]+)\}\}/g, (match, id1, display, id2) => {
    const id = id1 || id2;
    const entry = glossaryIndex && glossaryIndex[id];
    if (!entry) {
      // Fallback صامت: النص العادي بدون خط منقّط إذا لم يوجد المعرّف بعد (القسم 6.1.4)
      return escapeHtml(display || id);
    }
    const label = display || (entry.terme && (entry.terme[lang] || entry.terme.ar)) || id;
    return `<span class="terme-link" data-terme="${id}" tabindex="0">${escapeHtml(label)}</span>`;
  });
}

// Markdown خفيف → HTML معقَّم (القسم 6.1.2 + 14.2أ)
// inline=true لسياقات لا تحتمل عناصر Block متداخلة (خلايا الجدول، أسئلة QCM) — بدون <p> لفّ إضافي
export function mdToSafeHtml(text, lang, deps, inline = false) {
  const { marked, DOMPurify, glossaryIndex } = deps;
  const withGlossary = replaceGlossaryTokens(text || "", lang, glossaryIndex);
  const raw = inline ? marked.parseInline(withGlossary, { gfm: true }) : marked.parse(withGlossary, { breaks: false, gfm: true });
  return DOMPurify.sanitize(raw, { ADD_ATTR: ["data-terme", "tabindex"] });
}

function renderTableau(block, lang, deps) {
  const entetes = block.entetes[lang] || block.entetes.ar;
  const rows = block.lignes.map((l) => l[lang] || l.ar);
  const titre = block.titre ? block.titre[lang] || block.titre.ar : "";
  return `<div class="tableau-wrap"><table class="tableau">
    ${titre ? `<caption>${escapeHtml(titre)}</caption>` : ""}
    <thead><tr>${entetes.map((h) => `<th>${mdToSafeHtml(h, lang, deps, true)}</th>`).join("")}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${mdToSafeHtml(c, lang, deps, true)}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div>`;
}

function renderEncadre(block, lang, deps) {
  const variante = block.variante;
  const icon = ENCADRE_ICONS[variante] || "•";
  const titre = (block.titre && (block.titre[lang] || block.titre.ar)) || (ENCADRE_TITRES_DEFAUT[variante] && ENCADRE_TITRES_DEFAUT[variante][lang]) || "";
  return `<aside class="encadre encadre-${variante}" role="note" aria-label="${escapeHtml(titre)}">
    <span class="encadre-icon" aria-hidden="true">${icon}</span>
    ${titre ? `<p class="encadre-titre">${escapeHtml(titre)}</p>` : ""}
    ${mdToSafeHtml(block.texte[lang] || block.texte.ar, lang, deps)}
  </aside>`;
}

function renderLeSaviezVous(block, lang, deps) {
  const titre = block.titre ? block.titre[lang] || block.titre.ar : lang === "fr" ? "Le saviez-vous ?" : "أضف إلى معلوماتك";
  const lien = block.lien_encyclopedie ? `<a href="/encyclopedie/saviez-vous/${block.lien_encyclopedie}/">${lang === "fr" ? "Lire la suite" : "اقرأ المزيد"} ←</a>` : "";
  return `<div class="le-saviez-vous">
    <span class="le-saviez-vous-icon" aria-hidden="true">${ICON_BULB}</span>
    <p class="encadre-titre">${escapeHtml(titre)}</p>
    ${mdToSafeHtml(block.texte[lang] || block.texte.ar, lang, deps)}
    ${lien}
  </div>`;
}

// الرسوم SVG الأصلية تحمل تسميات ثنائية اللغة (data-lang، القسم 14.2هـ) يبدّلها CSS الصفحة —
// وهذا يعمل فقط إن كان الـ SVG مضمَّنا داخل DOM الصفحة نفسها، وليس عبر <img src>
// (المستند المحمَّل بـ <img> معزول ولا يرث تنسيقات الصفحة الأصلية). لذا نُضمّن محتوى SVG حرفيا هنا
// عبر deps.svgInliner (دالة متزامنة تُرجع نص الملف أو null)، مع Fallback إلى <img> عادي إن تعذّر ذلك.
function renderImageMarkup(block, lang, deps) {
  const alt = escapeHtml((block.legende && (block.legende[lang] || block.legende.ar)) || "");
  const isSvg = /\.svg$/i.test(block.src);
  if (isSvg && deps.svgInliner) {
    const svgContent = deps.svgInliner(block.src);
    if (svgContent) return svgContent;
  }
  return `<img src="/${block.src}" alt="${alt}" loading="lazy" width="800" height="450" />`;
}

function renderBlock(block, lang, deps) {
  switch (block.type) {
    case "paragraphe":
      // mdToSafeHtml (وضع Block) يُنتج <p>...</p> جاهزا — لا لفّ إضافي (تفاديا لـ <p><p>)
      return mdToSafeHtml(block.texte[lang] || block.texte.ar, lang, deps);
    case "image":
      return `<figure class="lesson-figure">
        ${renderImageMarkup(block, lang, deps)}
        ${block.legende ? `<figcaption>${escapeHtml(block.legende[lang] || block.legende.ar)}</figcaption>` : ""}
      </figure>`;
    case "video":
      return `<figure class="lesson-figure">
        <video controls preload="none" src="/${block.src}"${block.optionnel ? ' data-optional="true"' : ""}></video>
      </figure>`;
    case "lien_labo":
      return `<a class="lien-labo-card" href="/labo-virtuel/${block.experience_id}/">
        <span aria-hidden="true">${ICON_FLASK}</span>
        <span>${escapeHtml(block.texte[lang] || block.texte.ar)}</span>
      </a>`;
    case "encadre":
      return renderEncadre(block, lang, deps);
    case "tableau":
      return renderTableau(block, lang, deps);
    case "le_saviez_vous":
      return renderLeSaviezVous(block, lang, deps);
    default:
      return "";
  }
}

export function renderSection(section, lang, deps, idSuffix) {
  const blocsHtml = section.blocs.map((b) => renderBlock(b, lang, deps)).join("\n");
  const titre = section.titre[lang] || section.titre.ar;
  return `<section class="lesson-section" id="${section.id}${idSuffix}" data-lesson-section tabindex="-1">
    <h2>${escapeHtml(titre)}</h2>
    ${blocsHtml}
  </section>`;
}

export function renderToc(sections, lang, idSuffix) {
  return `<ul>
    ${sections
      .map((s) => `<li><a href="#${s.id}${idSuffix}" data-toc-link="${s.id}${idSuffix}">${escapeHtml(s.titre[lang] || s.titre.ar)}</a></li>`)
      .join("")}
  </ul>`;
}

export function renderQuiz(quiz, lang, deps) {
  if (!quiz) return "";
  const titre = quiz.titre[lang] || quiz.titre.ar;
  const questions = quiz.questions
    .map(
      (q, qi) => `<div class="quiz-question" data-quiz-question data-correct="${q.reponse_correcte}"${qi > 0 ? " hidden" : ""}>
      <p><strong>${qi + 1}. ${mdToSafeHtml(q.question[lang] || q.question.ar, lang, deps, true)}</strong></p>
      <div class="quiz-options" role="group">
        ${q.options
          .map((opt, oi) => `<button type="button" class="quiz-option" data-option-index="${oi}">${escapeHtml(opt[lang] || opt.ar)}</button>`)
          .join("")}
      </div>
      <div class="quiz-justification" hidden>${mdToSafeHtml(q.justification[lang] || q.justification.ar, lang, deps)}</div>
    </div>`
    )
    .join("");
  return `<div class="quiz" aria-label="${escapeHtml(titre)}">
    <h3>${escapeHtml(titre)}</h3>
    ${questions}
  </div>`;
}

// يبني كتلة كاملة بلغة واحدة (محاور + فهرس + اختبار) — تُستدعى مرتين (ar/fr) من القالب
export function renderLessonLangBlock(lecon, lang, deps) {
  const idSuffix = `-${lang}`;
  const sectionsHtml = lecon.sections.map((s) => renderSection(s, lang, deps, idSuffix)).join("\n");
  const tocHtml = renderToc(lecon.sections, lang, idSuffix);
  const quizHtml = renderQuiz(lecon.quiz, lang, deps);
  return { sectionsHtml, tocHtml, quizHtml };
}

export function renderMarkdownArticle(bodyMarkdown, lang, deps) {
  return mdToSafeHtml(bodyMarkdown, lang, deps);
}
