/*
  محرك عرض المحتوى المشترك — القسم 12.2 و12.2.1
  ملف واحد يُستدعى من مكانين بلا تكرار منطق:
   (أ) المتصفح: assets/js/render-engine.js (fetch وقت التصفح — Fallback عند غياب HTML مصيَّر مسبقا)
   (ب) البناء: scripts/prerender.js (Node، وقت النشر عبر Netlify)
  دوال نقية: لا "document"، لا "fs" — تُستقبل مكتبات markdown/sanitize كاعتماديات (Dependency Injection)
  حتى يعمل نفس الكود في المتصفح (marked.min.js/purify.min.js عبر <script> عادي) وفي Node (حزم npm).
*/

const ENCADRE_ICONS = {
  molahada: "ℹ️",
  tanbih: "⚠️",
  qaida: "📐",
  istintaj: "←",
  khoulasa: "📋",
  maaloumaMouhima: "💡",
  taarif: "🔤",
};

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
    <span class="le-saviez-vous-icon" aria-hidden="true">💡</span>
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
        <span aria-hidden="true">🔬</span>
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
