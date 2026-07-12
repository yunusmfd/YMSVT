// قوالب أجسام الصفحات الساكنة (Shells) — القسم 7. المحتوى الديناميكي يُملأ عبر assets/js/pages/*.js وقت التصفح (fetch /manifest.json، القسم 12.2)
import { HERO_STRATA_SVG } from "./hero-strata.js";
import { ICON_ARROW, uiIcon } from "./icons.js";

// عنوان قسم موحّد: تسمية Mono صغيرة (eyebrow) + شرطة طبقية + عنوان — يعطي إيقاعا تحريريا متّسقا عبر الصفحة
function sectionHead(eyebrowAr, eyebrowFr, titleAr, titleFr, linkHref, linkAr, linkFr) {
  return `<div class="section-head">
    <div class="section-head-titles">
      <span class="eyebrow section-eyebrow"><span class="eyebrow-tick" aria-hidden="true"></span><span data-lang="ar">${eyebrowAr}</span><span data-lang="fr">${eyebrowFr}</span></span>
      <h2><span data-lang="ar">${titleAr}</span><span data-lang="fr">${titleFr}</span></h2>
    </div>
    ${linkHref ? `<a class="section-head-link" href="${linkHref}"><span data-lang="ar">${linkAr}</span><span data-lang="fr">${linkFr}</span> ${ICON_ARROW}</a>` : ""}
  </div>`;
}

const QUICK_ACCESS = [
  { href: "/lecons/", icon: "lecons", i18n: "nav_lecons", spec: "genetique", descAr: "دروس مفصّلة لكل المستويات", descFr: "Leçons détaillées, tous niveaux" },
  { href: "/devoirs-examens/", icon: "exams", i18n: "nav_exams", spec: "physiologie", descAr: "فروض وامتحانات مع التصحيح", descFr: "Devoirs et examens corrigés" },
  { href: "/labo-virtuel/", icon: "labo", i18n: "nav_labo", spec: "microbiologie", descAr: "تجارب تفاعلية وفيديوهات", descFr: "Expériences interactives" },
  { href: "/encyclopedie/", icon: "encyclopedie", i18n: "nav_encyclopedie", spec: "taxonomie", descAr: "علماء، اكتشافات ومعجم", descFr: "Scientifiques, découvertes, glossaire" },
  { href: "/revision/", icon: "revision", i18n: "nav_revision", spec: "ecologie", descAr: "ملخصات وبطاقات مراجعة", descFr: "Résumés et fiches de révision" },
];

const FEATURES = [
  { icon: "free", ar: "مجاني بالكامل", fr: "100% gratuit", subAr: "لا اشتراكات، لا إعلانات مزعجة", subFr: "Sans abonnement ni publicité" },
  { icon: "bilingual", ar: "ثنائي اللغة كاملا", fr: "Entièrement bilingue", subAr: "العربية والفرنسية بنفس الجودة", subFr: "Arabe et français, même qualité" },
  { icon: "curriculum", ar: "مطابق للمنهاج الرسمي", fr: "Conforme au programme", subAr: "كل درس مرتبط ببند من المنهاج", subFr: "Aligné au programme officiel" },
  { icon: "secure", ar: "بدون تسجيل", fr: "Sans inscription", subAr: "تقدّمك محفوظ محليا في متصفّحك", subFr: "Progression locale, dans le navigateur" },
];

export function homeBody() {
  return `
<section class="hero">
  ${HERO_STRATA_SVG}
  <div class="hero-content">
    <span class="hero-badge"><span class="hero-badge-dot" aria-hidden="true"></span><span data-lang="ar">منصة تعليمية مجانية · المغرب</span><span data-lang="fr">Plateforme éducative gratuite · Maroc</span></span>
    <h1>
      <span data-lang="ar">مرجعك الكامل<br><em>لعلوم الحياة والأرض</em></span>
      <span data-lang="fr">Votre référence complète<br><em>en SVT</em></span>
    </h1>
    <p class="lead">
      <span data-lang="ar">دروس، فروض، امتحانات، مختبر افتراضي وموسوعة علمية — بالعربية والفرنسية، مطابقة للمنهاج الرسمي المغربي.</span>
      <span data-lang="fr">Leçons, devoirs, examens, labo virtuel et encyclopédie — en arabe et en français, conformes au programme officiel marocain.</span>
    </p>
    <div class="hero-ctas">
      <a class="btn btn-primary btn-lg" href="/lecons/"><span data-lang="ar">ابدأ التعلّم</span><span data-lang="fr">Commencer</span> ${ICON_ARROW}</a>
      <a class="btn btn-glass btn-lg" href="/labo-virtuel/"><span data-lang="ar">جرّب المختبر الافتراضي</span><span data-lang="fr">Essayer le labo virtuel</span></a>
    </div>
    <div class="hero-stats">
      <div class="hero-stat"><strong>100%</strong><span data-lang="ar">مجاني بدون تسجيل</span><span data-lang="fr">Gratuit, sans inscription</span></div>
      <div class="hero-stat"><strong>12</strong><span data-lang="ar">مسارا دراسيا</span><span data-lang="fr">parcours scolaires</span></div>
      <div class="hero-stat"><strong>7</strong><span data-lang="ar">أقسام بالموسوعة</span><span data-lang="fr">sections encyclopédiques</span></div>
    </div>
  </div>
</section>

<section class="level-picker container section">
  ${sectionHead("ابدأ من مستواك", "Choisis ton niveau", "أنا في...", "Je suis en...", "", "", "", "")}
  <div class="level-picker-grid">
    <a class="level-btn" href="/lecons/#1ac"><span class="level-btn-code">1·2·3 AC</span><strong data-lang="ar">الإعدادي</strong><strong data-lang="fr">Collège</strong><span class="level-btn-sub">1AC · 2AC · 3AC</span></a>
    <a class="level-btn" href="/lecons/#tc"><span class="level-btn-code">TC</span><strong data-lang="ar">الجذع المشترك</strong><strong data-lang="fr">Tronc commun</strong><span class="level-btn-sub">TCS · TCL</span></a>
    <a class="level-btn" href="/lecons/#1bac"><span class="level-btn-code">1 BAC</span><strong data-lang="ar">الأولى باك</strong><strong data-lang="fr">1re Bac</strong><span class="level-btn-sub">SE · L · SM</span></a>
    <a class="level-btn" href="/lecons/#2bac"><span class="level-btn-code">2 BAC</span><strong data-lang="ar">الثانية باك</strong><strong data-lang="fr">2e Bac</strong><span class="level-btn-sub">SVT · PC · SM · SA</span></a>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    ${sectionHead("منصة واحدة", "Une seule plateforme", "كل ما تحتاجه في مكان واحد", "Tout au même endroit", "", "", "", "")}
    <div class="quick-grid">
      ${QUICK_ACCESS.map(
        (q) => `<a class="quick-card card-link" href="${q.href}">
        <span class="quick-icon" data-spec="${q.spec}">${uiIcon(q.icon)}</span>
        <span class="quick-body">
          <span class="quick-title" data-i18n="${q.i18n}"></span>
          <span class="quick-desc"><span data-lang="ar">${q.descAr}</span><span data-lang="fr">${q.descFr}</span></span>
        </span>
        <span class="quick-arrow" aria-hidden="true">${ICON_ARROW}</span>
      </a>`
      ).join("")}
    </div>
  </div>
</section>

<section class="section container">
  ${sectionHead("مجالان، منهج واحد", "Deux domaines", "علوم الحياة وعلوم الأرض", "Vie et Terre", "", "", "", "")}
  <div class="dual-cards">
    <a class="dual-card bio card-link" href="/lecons/#biologie">
      <span class="dual-card-icon">${uiIcon("bio")}</span>
      <div class="dual-card-body">
        <h3><span data-lang="ar">علوم الحياة</span><span data-lang="fr">Biologie</span></h3>
        <p><span data-lang="ar">من الخلية إلى الأنظمة البيئية: الوراثة، المناعة، التنفّس والتركيب الضوئي.</span><span data-lang="fr">De la cellule aux écosystèmes : génétique, immunité, respiration et photosynthèse.</span></p>
        <span class="dual-card-link"><span data-lang="ar">استكشف الدروس</span><span data-lang="fr">Explorer</span> ${ICON_ARROW}</span>
      </div>
    </a>
    <a class="dual-card geo card-link" href="/lecons/#geologie">
      <span class="dual-card-icon">${uiIcon("geo")}</span>
      <div class="dual-card-body">
        <h3><span data-lang="ar">علوم الأرض</span><span data-lang="fr">Géologie</span></h3>
        <p><span data-lang="ar">الصخور، تكتونية الصفائح، الزلازل والبراكين والمخاطر الطبيعية.</span><span data-lang="fr">Roches, tectonique des plaques, séismes, volcans et risques naturels.</span></p>
        <span class="dual-card-link"><span data-lang="ar">استكشف الدروس</span><span data-lang="fr">Explorer</span> ${ICON_ARROW}</span>
      </div>
    </a>
  </div>
</section>

<section class="section container">
  ${sectionHead("محتوى حقيقي", "Contenu réel", "أحدث الدروس", "Dernières leçons", "/lecons/", "كل الدروس", "Toutes les leçons")}
  <div class="tabs" role="tablist" style="margin-bottom:var(--sp-6)">
    <button class="tab" data-home-tab="1ac" aria-selected="false">1AC</button>
    <button class="tab" data-home-tab="3ac" aria-selected="false">3AC</button>
    <button class="tab" data-home-tab="tc" aria-selected="false">TC</button>
    <button class="tab" data-home-tab="1bac" aria-selected="false">1BAC</button>
    <button class="tab" data-home-tab="2bac" aria-selected="true">2BAC</button>
  </div>
  <div class="grid grid-3" data-latest-lecons></div>
</section>

<section class="section section-alt">
  <div class="container">
    ${sectionHead("فضول علمي", "Curiosité", "من الموسوعة العلمية", "De l'encyclopédie", "/encyclopedie/", "استكشف الموسوعة", "Explorer")}
    <div class="encyclopedia-scroller" data-ency-scroller></div>
  </div>
</section>

<section class="section container">
  ${sectionHead("لماذا نحن", "Pourquoi nous", "لماذا Nova SVT؟", "Pourquoi Nova SVT ?", "", "", "", "")}
  <div class="features-grid">
    ${FEATURES.map(
      (f) => `<div class="feature-card">
      <span class="feature-icon">${uiIcon(f.icon)}</span>
      <h4><span data-lang="ar">${f.ar}</span><span data-lang="fr">${f.fr}</span></h4>
      <p><span data-lang="ar">${f.subAr}</span><span data-lang="fr">${f.subFr}</span></p>
    </div>`
    ).join("")}
  </div>
</section>`;
}

const NIVEAU_CHIPS = [
  { v: "1ac", l: "1AC" }, { v: "2ac", l: "2AC" }, { v: "3ac", l: "3AC" },
  { v: "tc", l: "TC" }, { v: "1bac", l: "1BAC" }, { v: "2bac", l: "2BAC" },
];
const FILIERE_CHIPS = [
  { v: "tcs", l: "TCS" }, { v: "tcl", l: "TCL" },
  { v: "1bac-se", l: "1BAC SE" }, { v: "1bac-l", l: "1BAC L" }, { v: "1bac-sm", l: "1BAC SM" },
  { v: "2bac-svt", l: "2BAC SVT" }, { v: "2bac-pc", l: "2BAC PC" }, { v: "2bac-sm", l: "2BAC SM" }, { v: "2bac-sa", l: "2BAC SA" },
];

export function leconsListBody() {
  return `
<div class="container" style="padding-top:var(--sp-6)">
  <div class="section-head">
    <h1><span data-lang="ar">الدروس</span><span data-lang="fr">Leçons</span></h1>
  </div>
  <div class="layout-with-sidebar" data-filters data-filters-target="[data-lecons-grid]" data-filters-empty="[data-lecons-grid-empty]">
    <aside class="filters-sidebar">
      <div class="filter-group" data-filter-key="niveau">
        <h4><span data-lang="ar">المستوى</span><span data-lang="fr">Niveau</span></h4>
        <div class="tabs">${NIVEAU_CHIPS.map((c) => `<button class="tab" data-filter-value="${c.v}" aria-selected="false">${c.l}</button>`).join("")}</div>
      </div>
      <div class="filter-group" data-filter-key="filiere" hidden>
        <h4><span data-lang="ar">المسلك</span><span data-lang="fr">Filière</span></h4>
        <div class="tabs">${FILIERE_CHIPS.map((c) => `<button class="tab" data-filter-value="${c.v}" aria-selected="false">${c.l}</button>`).join("")}</div>
      </div>
    </aside>
    <div>
      <div class="grid grid-3" data-lecons-grid></div>
      <div class="state-empty" data-lecons-grid-empty hidden>
        <span class="icon">📭</span>
        <p><span data-lang="ar">لا توجد دروس بعد لهذا الاختيار، جرّب مستوى آخر.</span><span data-lang="fr">Aucune leçon pour ce choix, essayez un autre niveau.</span></p>
      </div>
    </div>
  </div>
</div>`;
}

export function examsListBody() {
  return `
<div class="container" style="padding-top:var(--sp-6)">
  <h1><span data-lang="ar">الفروض والامتحانات</span><span data-lang="fr">Devoirs et examens</span></h1>
  <div class="layout-with-sidebar" data-filters data-filters-target="[data-exams-grid]" data-filters-empty="[data-exams-grid-empty]">
    <aside class="filters-sidebar">
      <div class="filter-group" data-filter-key="type">
        <h4><span data-lang="ar">النوع</span><span data-lang="fr">Type</span></h4>
        <div class="tabs">
          <button class="tab" data-filter-value="fard" aria-selected="false"><span data-lang="ar">فرض</span><span data-lang="fr">Devoir</span></button>
          <button class="tab" data-filter-value="imtihan" aria-selected="false"><span data-lang="ar">امتحان</span><span data-lang="fr">Examen</span></button>
        </div>
      </div>
      <div class="filter-group" data-filter-key="niveau">
        <h4><span data-lang="ar">المستوى</span><span data-lang="fr">Niveau</span></h4>
        <div class="tabs">${NIVEAU_CHIPS.map((c) => `<button class="tab" data-filter-value="${c.v}" aria-selected="false">${c.l}</button>`).join("")}</div>
      </div>
      <div class="filter-group" data-filter-key="filiere" hidden>
        <h4><span data-lang="ar">المسلك</span><span data-lang="fr">Filière</span></h4>
        <div class="tabs">${FILIERE_CHIPS.map((c) => `<button class="tab" data-filter-value="${c.v}" aria-selected="false">${c.l}</button>`).join("")}</div>
      </div>
      <div class="filter-group" data-filter-key="dorra">
        <h4><span data-lang="ar">الدورة</span><span data-lang="fr">Semestre</span></h4>
        <div class="tabs">
          <button class="tab" data-filter-value="1" aria-selected="false"><span data-lang="ar">الأولى</span><span data-lang="fr">1</span></button>
          <button class="tab" data-filter-value="2" aria-selected="false"><span data-lang="ar">الثانية</span><span data-lang="fr">2</span></button>
        </div>
      </div>
    </aside>
    <div>
      <div class="grid grid-2" data-exams-grid></div>
      <div class="state-empty" data-exams-grid-empty hidden>
        <span class="icon">📭</span>
        <p><span data-lang="ar">لا توجد نتائج، جرّب فلترة مختلفة.</span><span data-lang="fr">Aucun résultat, essayez d'autres filtres.</span></p>
      </div>
    </div>
  </div>
</div>`;
}

const ENCY_SECTIONS = [
  { slug: "scientifiques", icon: "🧑‍🔬", ar: "علماء", fr: "Scientifiques" },
  { slug: "decouvertes", icon: "💡", ar: "اكتشافات", fr: "Découvertes" },
  { slug: "glossaire", icon: "🔤", ar: "معجم", fr: "Glossaire" },
  { slug: "chronologies", icon: "📅", ar: "خطوط زمنية", fr: "Chronologies" },
  { slug: "articles", icon: "📰", ar: "آفاق ومقالات علمية", fr: "Articles scientifiques" },
  { slug: "saviez-vous", icon: "✨", ar: "هل تعلم؟", fr: "Le saviez-vous ?" },
  { slug: "galerie", icon: "🖼️", ar: "المعرض", fr: "Galerie" },
];

export function encyclopedieHubBody() {
  return `
<div class="container" style="padding-top:var(--sp-6)">
  <h1><span data-lang="ar">الموسوعة العلمية</span><span data-lang="fr">Encyclopédie scientifique</span></h1>
  <p><span data-lang="ar">سبعة أقسام مستقلة لاستكشاف عالم علوم الحياة والأرض.</span><span data-lang="fr">Sept sections indépendantes pour explorer les sciences de la vie et de la Terre.</span></p>
  <div class="grid grid-3" style="margin-top:var(--sp-6)">
    ${ENCY_SECTIONS.map(
      (s) => `<a class="card card-link" href="/encyclopedie/${s.slug}/">
      <span aria-hidden="true" style="font-size:var(--fs-28)">${s.icon}</span>
      <h3 style="margin-top:var(--sp-3)"><span data-lang="ar">${s.ar}</span><span data-lang="fr">${s.fr}</span></h3>
    </a>`
    ).join("")}
  </div>
</div>`;
}

export function encyArticlesListBody() {
  return `
<div class="container" style="padding-top:var(--sp-6)">
  ${encyBreadcrumb("آفاق ومقالات علمية", "Articles scientifiques")}
  <h1><span data-lang="ar">آفاق ومقالات علمية</span><span data-lang="fr">Articles scientifiques</span></h1>
  <div class="grid grid-3" data-articles-grid></div>
</div>`;
}

export function encyScientifiquesListBody() {
  return `
<div class="container" style="padding-top:var(--sp-6)">
  ${encyBreadcrumb("علماء", "Scientifiques")}
  <h1><span data-lang="ar">علماء</span><span data-lang="fr">Scientifiques</span></h1>
  <div class="grid grid-5" data-scientifiques-grid></div>
</div>`;
}

export function encyDecouvertesListBody() {
  return `
<div class="container" style="padding-top:var(--sp-6);max-width:760px">
  ${encyBreadcrumb("اكتشافات", "Découvertes")}
  <h1><span data-lang="ar">اكتشافات علمية</span><span data-lang="fr">Découvertes scientifiques</span></h1>
  <div class="timeline" style="flex-direction:column;overflow:visible" data-decouvertes-list></div>
</div>`;
}

export function encyGlossaireListBody() {
  return `
<div class="container" style="padding-top:var(--sp-6);max-width:820px">
  ${encyBreadcrumb("معجم", "Glossaire")}
  <h1><span data-lang="ar">المعجم العلمي</span><span data-lang="fr">Glossaire scientifique</span></h1>
  <div class="form-field" style="max-width:320px">
    <input type="search" data-glossaire-search data-i18n-placeholder="search_placeholder" />
  </div>
  <div class="tabs" data-glossaire-alphabet style="margin-bottom:var(--sp-5)"></div>
  <div class="grid grid-3" data-glossaire-grid></div>
</div>`;
}

export function encyChronologiesListBody() {
  return `
<div class="container" style="padding-top:var(--sp-6)">
  ${encyBreadcrumb("خطوط زمنية", "Chronologies")}
  <h1><span data-lang="ar">خطوط زمنية</span><span data-lang="fr">Chronologies</span></h1>
  <div class="grid grid-2" data-chronologies-grid></div>
</div>`;
}

export function encySaviezVousListBody() {
  return `
<div class="container" style="padding-top:var(--sp-6)">
  ${encyBreadcrumb("هل تعلم؟", "Le saviez-vous ?")}
  <h1><span data-lang="ar">هل تعلم؟</span><span data-lang="fr">Le saviez-vous ?</span></h1>
  <div class="grid grid-3" data-saviez-grid></div>
</div>`;
}

export function encyGalerieListBody() {
  return `
<div class="container" style="padding-top:var(--sp-6)">
  ${encyBreadcrumb("المعرض", "Galerie")}
  <h1><span data-lang="ar">معرض الرسوم التخطيطية</span><span data-lang="fr">Galerie des schémas</span></h1>
  <div class="masonry" data-galerie-grid></div>
  <div class="lightbox" data-lightbox hidden><img data-lightbox-img alt="" /></div>
</div>`;
}

function encyBreadcrumb(ar, fr) {
  return `<nav class="breadcrumb"><a href="/"><span data-lang="ar">الرئيسية</span><span data-lang="fr">Accueil</span></a><span aria-hidden="true">/</span> <a href="/encyclopedie/"><span data-lang="ar">الموسوعة</span><span data-lang="fr">Encyclopédie</span></a><span aria-hidden="true">/</span> <span class="current"><span data-lang="ar">${ar}</span><span data-lang="fr">${fr}</span></span></nav>`;
}

export function revisionBody() {
  return `
<div class="container" style="padding-top:var(--sp-6)">
  <h1><span data-lang="ar">فضاء المراجعة</span><span data-lang="fr">Espace révision</span></h1>
  <div class="tabs" style="margin-bottom:var(--sp-4)" data-revision-niveau>
    ${NIVEAU_CHIPS.map((c, i) => `<button class="tab" data-niveau-value="${c.v}" aria-selected="${i === 0}">${c.l}</button>`).join("")}
  </div>
  <div class="tabs" role="tablist" style="margin-bottom:var(--sp-6)" data-revision-type>
    <button class="tab" data-type-value="resumes" aria-selected="true"><span data-lang="ar">ملخصات</span><span data-lang="fr">Résumés</span></button>
    <button class="tab" data-type-value="cartesMentales" aria-selected="false"><span data-lang="ar">خرائط ذهنية</span><span data-lang="fr">Cartes mentales</span></button>
    <button class="tab" data-type-value="flashcards" aria-selected="false"><span data-lang="ar">بطاقات مراجعة</span><span data-lang="fr">Flashcards</span></button>
    <button class="tab" data-type-value="quizDocuments" aria-selected="false"><span data-lang="ar">اختبارات استدلال علمي</span><span data-lang="fr">Quiz documents</span></button>
  </div>

  <div data-revision-panel="resumes" class="grid grid-3"></div>
  <div data-revision-panel="cartesMentales" class="grid grid-3" hidden></div>
  <div data-revision-panel="flashcards" hidden>
    <button class="btn btn-ghost btn-sm" data-flashcards-shuffle style="margin-bottom:var(--sp-4)">🔀 <span data-lang="ar">خلط البطاقات</span><span data-lang="fr">Mélanger</span></button>
    <div class="grid grid-3" data-flashcards-grid></div>
  </div>
  <div data-revision-panel="quizDocuments" hidden></div>

  <div class="lightbox" data-lightbox hidden><img data-lightbox-img alt="" /></div>
</div>`;
}

export function blogListBody() {
  return `
<div class="container" style="padding-top:var(--sp-6)">
  <h1><span data-lang="ar">المدونة</span><span data-lang="fr">Blog</span></h1>
  <div class="grid grid-3" data-blog-grid></div>
</div>`;
}

export function monEspaceBody() {
  return `
<div class="container" style="padding-top:var(--sp-6);max-width:820px">
  <h1><span data-lang="ar">فضاء الطالب</span><span data-lang="fr">Mon espace</span></h1>
  <p><span data-lang="ar">كل ما تراه هنا محفوظ محليا في متصفحك فقط — لا حسابات ولا خادم. مسح ذاكرة المتصفح يمسح هذه البيانات.</span><span data-lang="fr">Tout ce que vous voyez ici est stocké localement dans votre navigateur uniquement — pas de compte, pas de serveur. Vider le cache l'efface.</span></p>
  <div class="grid grid-2" style="margin-top:var(--sp-6)">
    <div class="card">
      <h3><span data-lang="ar">نتائج الاختبارات</span><span data-lang="fr">Résultats des quiz</span></h3>
      <div data-espace-quiz></div>
    </div>
    <div class="card">
      <h3><span data-lang="ar">التفضيلات</span><span data-lang="fr">Préférences</span></h3>
      <div data-espace-prefs></div>
    </div>
  </div>
</div>`;
}

export function aproposBody() {
  return `
<div class="container" style="padding-top:var(--sp-6);max-width:680px">
  <h1><span data-lang="ar">عن المنصة</span><span data-lang="fr">À propos</span></h1>
  <p><span data-lang="ar">Nova SVT منصة تعليمية مجانية تهدف إلى أن تصبح المرجع الرقمي الأول لمادة علوم الحياة والأرض بالمغرب، بمحتوى مطابق للمنهاج الرسمي ومتاح بالعربية والفرنسية بنفس مستوى الجودة.</span><span data-lang="fr">Nova SVT est une plateforme éducative gratuite qui vise à devenir la référence numérique des Sciences de la Vie et de la Terre au Maroc, avec un contenu conforme au programme officiel, disponible en arabe et en français au même niveau de qualité.</span></p>
  <p><span data-lang="ar">لا نظام دفع، لا إعلانات مزعجة، لا حسابات إلزامية — فقط محتوى علمي موثوق في متناول كل تلميذ.</span><span data-lang="fr">Pas de paiement, pas de publicités intrusives, pas de compte obligatoire — juste un contenu scientifique fiable, accessible à tous les élèves.</span></p>
</div>`;
}

export function contactBody() {
  return `
<div class="container" style="padding-top:var(--sp-6);max-width:560px">
  <h1><span data-lang="ar">اتصل بنا</span><span data-lang="fr">Contact</span></h1>
  <form name="contact" method="POST" data-netlify="true">
    <input type="hidden" name="form-name" value="contact" />
    <div class="form-field">
      <label for="name"><span data-lang="ar">الاسم</span><span data-lang="fr">Nom</span></label>
      <input id="name" name="name" type="text" required />
    </div>
    <div class="form-field">
      <label for="email"><span data-lang="ar">البريد الإلكتروني</span><span data-lang="fr">E-mail</span></label>
      <input id="email" name="email" type="email" required />
    </div>
    <div class="form-field">
      <label for="message"><span data-lang="ar">الرسالة</span><span data-lang="fr">Message</span></label>
      <textarea id="message" name="message" rows="5" required></textarea>
    </div>
    <button class="btn btn-primary" type="submit"><span data-lang="ar">إرسال</span><span data-lang="fr">Envoyer</span></button>
  </form>
</div>`;
}

export function confidentialiteBody() {
  return `
<div class="container" style="padding-top:var(--sp-6);max-width:680px">
  <h1><span data-lang="ar">سياسة الخصوصية</span><span data-lang="fr">Politique de confidentialité</span></h1>
  <p><span data-lang="ar">Nova SVT منصة "الخصوصية أولا" (Local-first): لا نطلب تسجيل الدخول، ولا نخزّن أي بيانات شخصية على خادم. أي تقدم دراسي (نتائج اختبارات، تفضيل اللغة/الوضع الليلي) يُحفظ محليا في متصفحك فقط عبر localStorage، ولا يغادر جهازك أبدا.</span><span data-lang="fr">Nova SVT est une plateforme « vie privée d'abord » (Local-first) : aucune connexion requise, aucune donnée personnelle stockée sur un serveur. Toute progression (résultats de quiz, préférence de langue/thème) est enregistrée localement dans votre navigateur via localStorage, et ne quitte jamais votre appareil.</span></p>
  <p><span data-lang="ar">نموذج "اتصل بنا" يُرسَل عبر خدمة Netlify Forms لغرض الرد على استفساراتكم فقط.</span><span data-lang="fr">Le formulaire « Contact » est envoyé via Netlify Forms dans le seul but de répondre à vos demandes.</span></p>
</div>`;
}

export function laboListBody() {
  return `
<div class="container" style="padding-top:var(--sp-6)">
  <h1><span data-lang="ar">المختبر الافتراضي</span><span data-lang="fr">Labo virtuel</span></h1>
  <p><span data-lang="ar">اكتشف مكمّلات تفاعلية للدروس: تجارب تفاعلية، فيديوهات، ورسوم متحركة توضيحية.</span><span data-lang="fr">Découvrez des compléments interactifs aux leçons : expériences interactives, vidéos et animations.</span></p>
  <div data-filters data-filters-target="[data-labo-grid]" data-filters-empty="[data-labo-grid-empty]">
    <div class="filter-group" data-filter-key="type">
      <div class="tabs" style="margin-bottom:var(--sp-6)">
        <button class="tab" data-filter-value="" aria-selected="true"><span data-lang="ar">الكل</span><span data-lang="fr">Tout</span></button>
        <button class="tab" data-filter-value="interactif" aria-selected="false">🔬 <span data-lang="ar">تفاعلي</span><span data-lang="fr">Interactif</span></button>
        <button class="tab" data-filter-value="video" aria-selected="false">🎬 <span data-lang="ar">فيديو</span><span data-lang="fr">Vidéo</span></button>
        <button class="tab" data-filter-value="animation" aria-selected="false">✏️ <span data-lang="ar">رسوم متحركة</span><span data-lang="fr">Animation</span></button>
      </div>
    </div>
    <div class="grid grid-3" data-labo-grid></div>
    <div class="state-empty" data-labo-grid-empty hidden><span class="icon">📭</span><p><span data-lang="ar">لا توجد تجارب لهذا النوع بعد.</span><span data-lang="fr">Aucune expérience pour ce type.</span></p></div>
  </div>
</div>`;
}
