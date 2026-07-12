import { fetchManifest, showError, escapeHtml } from "../list-page.js";
import { initFlashcards } from "../flashcards.js";

function resumeCard(r) {
  return `<a class="card card-link" href="/revision/resumes/${r.id}/">
    <span aria-hidden="true" style="font-size:var(--fs-24)">📄</span>
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

async function init() {
  const niveauTabs = document.querySelector("[data-revision-niveau]");
  const typeTabs = document.querySelector("[data-revision-type]");
  const panels = document.querySelectorAll("[data-revision-panel]");
  const lightbox = document.querySelector("[data-lightbox]");
  const lightboxImg = document.querySelector("[data-lightbox-img]");
  if (!typeTabs) return;

  try {
    const manifest = await fetchManifest();
    const rev = manifest.revision;

    function currentNiveau() {
      return niveauTabs.querySelector('[aria-selected="true"]').getAttribute("data-niveau-value");
    }

    function renderAll() {
      const niveau = currentNiveau();
      const resumes = rev.resumes.filter((r) => r.niveau === niveau);
      const cartes = rev.cartesMentales.filter((c) => c.niveau === niveau);
      const flashcards = rev.flashcards.filter((f) => f.niveau === niveau);
      const quizDocs = rev.quizDocuments.filter((q) => q.niveau === niveau);

      document.querySelector('[data-revision-panel="resumes"]').innerHTML = resumes.map(resumeCard).join("") || emptyMsg();
      document.querySelector('[data-revision-panel="cartesMentales"]').innerHTML = cartes.map(carteCard).join("") || emptyMsg();
      document.querySelector('[data-revision-panel="flashcards"] [data-flashcards-grid]').innerHTML = flashcards.map(flashcardHtml).join("") || emptyMsg();
      document.querySelector('[data-revision-panel="quizDocuments"]').innerHTML = quizDocs.map(quizDocHtml).join("") || emptyMsg();

      wireLightbox();
      wireReveal();
      initFlashcards();
    }

    function emptyMsg() {
      const lang = document.documentElement.getAttribute("lang") || "ar";
      return `<p class="state-empty">${lang === "fr" ? "Rien pour ce niveau pour l'instant." : "لا يوجد محتوى لهذا المستوى بعد."}</p>`;
    }

    function wireLightbox() {
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
    if (lightbox) lightbox.addEventListener("click", () => (lightbox.hidden = true));

    niveauTabs.querySelectorAll("[data-niveau-value]").forEach((btn) => {
      btn.addEventListener("click", () => {
        niveauTabs.querySelectorAll("[data-niveau-value]").forEach((b) => b.setAttribute("aria-selected", "false"));
        btn.setAttribute("aria-selected", "true");
        renderAll();
      });
    });
    typeTabs.querySelectorAll("[data-type-value]").forEach((btn) => {
      btn.addEventListener("click", () => {
        typeTabs.querySelectorAll("[data-type-value]").forEach((b) => b.setAttribute("aria-selected", "false"));
        btn.setAttribute("aria-selected", "true");
        panels.forEach((p) => (p.hidden = p.getAttribute("data-revision-panel") !== btn.getAttribute("data-type-value")));
      });
    });

    renderAll();
  } catch (e) {
    showError(document.querySelector('[data-revision-panel="resumes"]'), init);
  }
}
document.addEventListener("DOMContentLoaded", init);
