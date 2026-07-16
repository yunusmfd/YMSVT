// قوالب أجسام الصفحات الساكنة (Shells) — القسم 7. المحتوى الديناميكي يُملأ عبر assets/js/pages/*.js وقت التصفح (fetch /manifest.json، القسم 12.2)
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

const BENEFITS = [
  { icon: "lecons", spec: "ecologie", ar: "دروس شاملة", fr: "Cours complets", subAr: "محتوى ثنائي اللغة مُنظَّم وفق المنهاج الوطني المغربي.", subFr: "Contenu bilingue structuré selon le programme national marocain." },
  { icon: "quiz", spec: "geologie", ar: "امتحانات واختبارات", fr: "Examens & Quiz", subAr: "تدرّب على الامتحانات المصحَّحة والاختبارات التفاعلية.", subFr: "S'entraîner avec des annales corrigées et des tests interactifs." },
  { icon: "labo", spec: "genetique", ar: "المختبر الافتراضي", fr: "Labo Virtuel", subAr: "استكشف التجارب المعقّدة عبر المحاكاة والرسوم التوضيحية.", subFr: "Visualisez les expériences complexes en simulations." },
  { icon: "encyclopedie", spec: "ecologie", ar: "الموسوعة العلمية", fr: "Encyclopédie", subAr: "معجم علمي مفصَّل من الألف إلى الياء.", subFr: "Un glossaire scientifique détaillé de A à Z." },
];

export function homeBody() {
  return `
<section class="hero hero-simple">
  <div class="hero-content">
    <span class="hero-eyebrow">Nova SVT</span>
    <h1>
      <span data-lang="ar">التميّز في علوم الحياة والأرض</span>
      <span data-lang="fr">Excellence en Sciences de la Vie et de la Terre</span>
    </h1>
    <p class="lead">
      <span data-lang="ar">منصة أكاديمية حديثة مخصّصة لتلاميذ المغرب. أتقن المفاهيم البيولوجية والجيولوجية بصرامة علمية لا مثيل لها.</span>
      <span data-lang="fr">Une plateforme académique moderne dédiée aux élèves marocains. Maîtrisez les concepts biologiques et géologiques avec une rigueur scientifique inégalée.</span>
    </p>
    <div class="hero-ctas">
      <a class="btn btn-primary btn-lg" href="/lecons/"><span data-lang="ar">ابدأ التعلّم</span><span data-lang="fr">Commencer l'apprentissage</span></a>
      <a class="btn btn-ghost btn-lg" href="/encyclopedie/"><span data-lang="ar">تصفح الموسوعة</span><span data-lang="fr">Explorer l'Encyclopédie</span></a>
    </div>
  </div>
</section>

<section class="section container">
  <div class="benefits-head">
    <h2><span data-lang="ar">كل ما تحتاجه للنجاح في علوم الحياة والأرض</span><span data-lang="fr">Tout ce qu'il faut pour réussir en SVT</span></h2>
  </div>
  <div class="benefits-grid">
    ${BENEFITS.map(
      (b) => `<div class="benefit-card">
      <span class="benefit-icon" data-spec="${b.spec}">${uiIcon(b.icon)}</span>
      <h4><span data-lang="ar">${b.ar}</span><span data-lang="fr">${b.fr}</span></h4>
      <p><span data-lang="ar">${b.subAr}</span><span data-lang="fr">${b.subFr}</span></p>
    </div>`
    ).join("")}
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    ${sectionHead("محتوى حقيقي", "Contenu réel", "أحدث الدروس والمراجعات", "Dernières leçons et révisions", "/lecons/", "عرض جميع الدروس", "Voir toutes les leçons")}
    <div class="grid grid-3" data-latest-lecons></div>
  </div>
</section>

<section class="section container">
  <div data-saviez-featured></div>
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
const FILIERE_2BAC_CHIPS = FILIERE_CHIPS.filter((c) => c.v.startsWith("2bac-"));

// قائمة منسدلة موحّدة لفلاتر المستوى/الدورة/الوحدة (تُستعمل في صفحتي الدروس والفروض والامتحانات وفضاء المراجعة)
function filterDropdown(key, labelAr, labelFr, extraOptions = "") {
  return `<div class="filter-group">
    <h4><span data-lang="ar">${labelAr}</span><span data-lang="fr">${labelFr}</span></h4>
    <select class="filter-select" data-revision-filter="${key}">
      <option value="" data-i18n="filter_all"></option>
      ${extraOptions}
    </select>
  </div>`;
}

// قائمة منسدلة أصلية (select) مُنسَّقة كصندوق القالب: أيقونة + القيمة المختارة + شيفرون — مع الحفاظ على منطق الفلترة القائم على data-filter-key
function leconsDropdown(key, labelAr, labelFr, icon, options, groupAttrs = "") {
  return `<div class="lecons-filter" ${groupAttrs}>
    <label class="lecons-filter-label"><span data-lang="ar">${labelAr}</span><span data-lang="fr">${labelFr}</span></label>
    <div class="lecons-filter-control">
      <span class="lecons-filter-icon" aria-hidden="true">${uiIcon(icon)}</span>
      <select class="lecons-filter-select" data-filter-key="${key}">
        <option value="" data-i18n="filter_all"></option>
        ${options}
      </select>
      <span class="lecons-filter-chevron" aria-hidden="true">${uiIcon("chevron")}</span>
    </div>
  </div>`;
}

export function leconsListBody() {
  return `
<div class="container lecons-page" data-filters data-filters-target="[data-lecons-grid]" data-filters-empty="[data-lecons-grid-empty]">
  <!-- الهيرو: مسار تنقّل + صندوق أيقونة + عنوان تحريري + وصف + زخرفة طبقية -->
  <section class="lecons-hero">
    <div class="lecons-hero-main">
      <nav class="lecons-breadcrumb" aria-label="مسار التنقل">
        <a href="/"><span data-lang="ar">الرئيسية</span><span data-lang="fr">Accueil</span></a>
        <span class="lecons-breadcrumb-sep flip-rtl" aria-hidden="true">${ICON_ARROW}</span>
        <span class="lecons-breadcrumb-current"><span data-lang="ar">الدروس</span><span data-lang="fr">Leçons</span></span>
      </nav>
      <div class="lecons-hero-titlerow">
        <span class="lecons-hero-icon" aria-hidden="true">${uiIcon("lecons")}</span>
        <h1><span data-lang="ar">الدروس</span><span data-lang="fr">Leçons</span></h1>
      </div>
      <p class="lecons-hero-lead">
        <span data-lang="ar">تصفّح دروس علوم الحياة والأرض وفق المستوى والمسلك والدورة والوحدة.</span>
        <span data-lang="fr">Parcourez les leçons de SVT par niveau, filière, semestre et unité.</span>
      </p>
    </div>
    <div class="lecons-hero-deco" aria-hidden="true">
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="90" stroke="currentColor" stroke-dasharray="4 4" stroke-width="1"/>
        <circle cx="100" cy="100" r="60" stroke="currentColor" stroke-width="2"/>
        <path d="M100 20V180" stroke="currentColor" stroke-width="1"/>
        <path d="M20 100H180" stroke="currentColor" stroke-width="1"/>
        <circle cx="100" cy="100" r="10" fill="currentColor"/>
      </svg>
    </div>
  </section>

  <!-- بطاقة الفلاتر الأفقية: 4 قوائم منسدلة + زر إعادة التعيين -->
  <section class="lecons-filters">
    <div class="lecons-filters-grid">
      ${leconsDropdown("niveau", "المستوى", "Niveau", "curriculum", NIVEAU_CHIPS.map((c) => `<option value="${c.v}">${c.l}</option>`).join(""))}
      ${leconsDropdown("filiere", "المسلك", "Filière", "groups", FILIERE_CHIPS.map((c) => `<option value="${c.v}">${c.l}</option>`).join(""), 'data-filter-key="filiere-group" hidden')}
      ${leconsDropdown("dorra", "الدورة", "Semestre", "calendar", `<option value="1" data-i18n="semester_1"></option><option value="2" data-i18n="semester_2"></option>`)}
      ${leconsDropdown("unite", "الوحدة", "Unité", "lecons", "")}
    </div>
    <button class="lecons-filters-reset" type="button" data-filters-reset>
      ${uiIcon("reset")}<span data-lang="ar">إعادة تعيين الفلاتر</span><span data-lang="fr">Réinitialiser</span>
    </button>
  </section>

  <!-- الوحدات والدروس: أكورديون -->
  <h2 class="lecons-units-title"><span data-lang="ar">الوحدات والدروس</span><span data-lang="fr">Unités et leçons</span></h2>
  <div data-lecons-grid></div>
  <div class="state-empty" data-lecons-grid-empty hidden>
    <span class="icon">${uiIcon("empty")}</span>
    <p><span data-lang="ar">لا توجد دروس بعد لهذا الاختيار، جرّب مستوى آخر.</span><span data-lang="fr">Aucune leçon pour ce choix, essayez un autre niveau.</span></p>
  </div>
</div>`;
}

export function examsListBody() {
  return `
<div class="container" style="padding-top:var(--sp-6)">
  <h1><span data-lang="ar">الفروض والامتحانات</span><span data-lang="fr">Devoirs et examens</span></h1>

  <div class="tabs" role="tablist" style="margin-bottom:var(--sp-6)" data-exams-section>
    <button class="tab" data-exsection-value="fard" aria-selected="true"><span data-lang="ar">الفروض</span><span data-lang="fr">Devoirs</span></button>
    <button class="tab" data-exsection-value="imtihan" aria-selected="false"><span data-lang="ar">الامتحانات</span><span data-lang="fr">Examens</span></button>
  </div>

  <!-- ========== 1) الفروض — مستوى + مسلك (عند الاقتضاء) + دورة ========== -->
  <div data-exsection-panel="fard">
    <div class="layout-with-sidebar">
      <aside class="filters-sidebar">
      <div class="filters-sidebar-head">${uiIcon("filter")}<span data-lang="ar">تصفية النتائج</span><span data-lang="fr">Filtrer les résultats</span></div>
        ${filterDropdown("ex-fard-niveau", "المستوى", "Niveau", NIVEAU_CHIPS.map((c) => `<option value="${c.v}">${c.l}</option>`).join(""))}
        <div class="filter-group" data-filter-key="ex-fard-filiere-group" hidden>
          <h4><span data-lang="ar">المسلك</span><span data-lang="fr">Filière</span></h4>
          <select class="filter-select" data-revision-filter="ex-fard-filiere">
            <option value="" data-i18n="filter_all"></option>
            ${FILIERE_CHIPS.map((c) => `<option value="${c.v}">${c.l}</option>`).join("")}
          </select>
        </div>
        ${filterDropdown("ex-fard-dorra", "الدورة", "Semestre", `<option value="1" data-i18n="semester_1"></option><option value="2" data-i18n="semester_2"></option>`)}
      </aside>
      <div>
        <div class="grid grid-2" data-exams-fard-grid></div>
        <div class="state-empty" data-exams-fard-empty hidden>
          <span class="icon">${uiIcon("empty")}</span>
          <p><span data-lang="ar">لا توجد فروض بعد لهذا الاختيار.</span><span data-lang="fr">Aucun devoir pour ce choix.</span></p>
        </div>
      </div>
    </div>
  </div>

  <!-- ========== 2) الامتحانات — مستويان إشهاديان فقط: 3AC و2BAC ========== -->
  <div data-exsection-panel="imtihan" hidden>
    <p><span data-lang="ar">الامتحانات الإشهادية بالمغرب محصورة في مستويين: الثالثة إعدادي (امتحانان محلي وجهوي) والثانية بكالوريا (امتحان وطني حسب المسلك).</span><span data-lang="fr">Au Maroc, les examens certificatifs concernent deux niveaux : la 3AC (examens local et régional) et la 2BAC (examen national selon la filière).</span></p>
    <div class="tabs" role="tablist" style="margin:var(--sp-4) 0 var(--sp-6)" data-exams-imtihan-niveau>
      <button class="tab" data-exams-imtihan-niveau-value="3ac" aria-selected="true">3AC</button>
      <button class="tab" data-exams-imtihan-niveau-value="2bac" aria-selected="false">2BAC</button>
    </div>

    <div data-exams-imtihan-panel="3ac">
      <div class="grid grid-2" data-exams-imtihan-3ac-grid></div>
    </div>
    <div data-exams-imtihan-panel="2bac" hidden>
      <div class="filter-group" style="max-width:280px;margin-bottom:var(--sp-5)">
        <h4><span data-lang="ar">المسلك</span><span data-lang="fr">Filière</span></h4>
        <select class="filter-select" data-exams-imtihan-2bac-filiere>
          <option value="" data-i18n="filter_all"></option>
          ${FILIERE_2BAC_CHIPS.map((c) => `<option value="${c.v}">${c.l}</option>`).join("")}
        </select>
      </div>
      <div class="grid grid-2" data-exams-imtihan-2bac-grid></div>
    </div>
  </div>
</div>`;
}

const ENCY_SECTIONS = [
  { slug: "glossaire", icon: "tag", tone: "--spec-taxonomie", ar: "معجم المصطلحات", fr: "Glossaire des termes", descAr: "تعريفات دقيقة لأهم مصطلحات SVT.", descFr: "Définitions précises des principaux termes de SVT." },
  { slug: "scientifiques", icon: "person", tone: "--spec-genetique", ar: "العلماء", fr: "Scientifiques", descAr: "أعلام العلم الذين شكّلوا فهمنا للحياة والأرض.", descFr: "Les figures scientifiques qui ont façonné notre compréhension du vivant et de la Terre." },
  { slug: "decouvertes", icon: "bulb", tone: "--spec-biomol", ar: "الاكتشافات", fr: "Découvertes", descAr: "لحظات فارقة غيّرت مسار العلم.", descFr: "Des moments charnières qui ont changé le cours de la science." },
  { slug: "organismes", icon: "bio", tone: "--spec-ecologie", ar: "الكائنات الحية", fr: "Êtres vivants", descAr: "أنواع حيوانية ونباتية مغربية وخصائصها.", descFr: "Espèces animales et végétales marocaines et leurs particularités." },
  { slug: "roches-mineraux", icon: "rock", tone: "--spec-zoologie", ar: "الصخور والمعادن", fr: "Roches et minéraux", descAr: "تركيب الصخور والمعادن الشائعة ومنشؤها.", descFr: "Composition et origine des roches et minéraux courants." },
  { slug: "geologie-maroc", icon: "geo", tone: "--spec-geologie", ar: "جيولوجيا المغرب", fr: "Géologie du Maroc", descAr: "التكوينات الجيولوجية الكبرى بالمغرب.", descFr: "Les grandes formations géologiques du Maroc." },
  { slug: "galerie", icon: "map", tone: "--spec-microbiologie", ar: "الرسوم والخرائط العلمية", fr: "Schémas et cartes", descAr: "رسوم تخطيطية موسومة للمراجعة البصرية.", descFr: "Schémas annotés pour la révision visuelle." },
  { slug: "experiences-historiques", icon: "labo", tone: "--spec-physiologie", ar: "التجارب العلمية التاريخية", fr: "Expériences historiques", descAr: "تجارب غيّرت فهمنا للحياة: السؤال، البروتوكول، النتيجة.", descFr: "Des expériences qui ont changé notre compréhension du vivant." },
  { slug: "chronologies", icon: "calendar", tone: "--spec-cytologie", ar: "الخطوط الزمنية", fr: "Chronologies", descAr: "تسلسل الأحداث الكبرى في تاريخ العلوم.", descFr: "La chronologie des grands événements de l'histoire des sciences." },
  { slug: "articles", icon: "newspaper", tone: "--spec-botanique", ar: "آفاق ومقالات علمية", fr: "Articles scientifiques", descAr: "مقالات معمّقة في البيولوجيا والجيولوجيا والبيئة.", descFr: "Articles approfondis en biologie, géologie et environnement." },
  { slug: "saviez-vous", icon: "spark", tone: "--secondary", ar: "هل تعلم؟", fr: "Le saviez-vous ?", descAr: "حقائق علمية قصيرة ومثيرة للفضول.", descFr: "De courts faits scientifiques surprenants." },
];

export function encyclopedieHubBody() {
  return `
<div class="container" style="padding-top:var(--sp-6)">
  <div class="ency-masthead">
    <span class="section-eyebrow"><span class="eyebrow-tick" aria-hidden="true"></span><span data-lang="ar">مجلّة Nova SVT</span><span data-lang="fr">Le magazine Nova SVT</span></span>
    <h1><span data-lang="ar">الموسوعة العلمية</span><span data-lang="fr">Encyclopédie scientifique</span></h1>
    <p><span data-lang="ar">${ENCY_SECTIONS.length} أقسام لاستكشاف عالم علوم الحياة والأرض — من المعجم إلى جيولوجيا المغرب.</span><span data-lang="fr">${ENCY_SECTIONS.length} sections pour explorer les sciences de la vie et de la Terre — du glossaire à la géologie du Maroc.</span></p>
  </div>
  <div class="ency-sections-grid">
    ${ENCY_SECTIONS.map(
      (s, i) => `<a class="ency-section-card" href="/encyclopedie/${s.slug}/">
      <span class="ency-section-num mono" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
      <span class="ency-section-icon" aria-hidden="true" style="--tone:var(${s.tone})">${uiIcon(s.icon)}</span>
      <h3><span data-lang="ar">${s.ar}</span><span data-lang="fr">${s.fr}</span></h3>
      <p><span data-lang="ar">${s.descAr}</span><span data-lang="fr">${s.descFr}</span></p>
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
  ${encyBreadcrumb("الرسوم والخرائط العلمية", "Schémas et cartes scientifiques")}
  <h1><span data-lang="ar">الرسوم والخرائط العلمية</span><span data-lang="fr">Schémas et cartes scientifiques</span></h1>
  <div class="masonry" data-galerie-grid></div>
  <div class="lightbox" data-lightbox hidden><img data-lightbox-img alt="" /></div>
</div>`;
}

export function encyOrganismesListBody() {
  return `
<div class="container" style="padding-top:var(--sp-6)">
  ${encyBreadcrumb("الكائنات الحية", "Êtres vivants")}
  <h1><span data-lang="ar">الكائنات الحية</span><span data-lang="fr">Êtres vivants</span></h1>
  <p><span data-lang="ar">أنواع حيوانية ونباتية مغربية، موطنها وخصائصها المميّزة.</span><span data-lang="fr">Espèces animales et végétales marocaines, leur habitat et leurs particularités.</span></p>
  <div class="grid grid-3" data-organismes-grid></div>
</div>`;
}

export function encyRochesMineralListBody() {
  return `
<div class="container" style="padding-top:var(--sp-6)">
  ${encyBreadcrumb("الصخور والمعادن", "Roches et minéraux")}
  <h1><span data-lang="ar">الصخور والمعادن</span><span data-lang="fr">Roches et minéraux</span></h1>
  <p><span data-lang="ar">تركيب الصخور والمعادن الشائعة، منشؤها، واستعمالاتها.</span><span data-lang="fr">Composition, origine et usages des roches et minéraux courants.</span></p>
  <div class="grid grid-3" data-roches-grid></div>
</div>`;
}

export function encyGeologieMarocListBody() {
  return `
<div class="container" style="padding-top:var(--sp-6)">
  ${encyBreadcrumb("جيولوجيا المغرب", "Géologie du Maroc")}
  <h1><span data-lang="ar">جيولوجيا المغرب</span><span data-lang="fr">Géologie du Maroc</span></h1>
  <p><span data-lang="ar">أبرز التكوينات الجيولوجية المغربية وقصة تشكّلها.</span><span data-lang="fr">Les grandes formations géologiques du Maroc et l'histoire de leur formation.</span></p>
  <div class="grid grid-2" data-geologie-maroc-grid></div>
</div>`;
}

export function encyExperiencesHistoriquesListBody() {
  return `
<div class="container" style="padding-top:var(--sp-6)">
  ${encyBreadcrumb("التجارب العلمية التاريخية", "Expériences historiques")}
  <h1><span data-lang="ar">التجارب العلمية التاريخية</span><span data-lang="fr">Expériences scientifiques historiques</span></h1>
  <p><span data-lang="ar">تجارب غيّرت فهمنا للحياة والطبيعة: السؤال، البروتوكول، والنتيجة.</span><span data-lang="fr">Des expériences qui ont changé notre compréhension du vivant : la question, le protocole, le résultat.</span></p>
  <div class="grid grid-3" data-experiences-grid></div>
</div>`;
}

function encyBreadcrumb(ar, fr) {
  return `<nav class="breadcrumb"><a href="/"><span data-lang="ar">الرئيسية</span><span data-lang="fr">Accueil</span></a><span aria-hidden="true">/</span> <a href="/encyclopedie/"><span data-lang="ar">الموسوعة</span><span data-lang="fr">Encyclopédie</span></a><span aria-hidden="true">/</span> <span class="current"><span data-lang="ar">${ar}</span><span data-lang="fr">${fr}</span></span></nav>`;
}

export function revisionBody() {
  return `
<div class="container" style="padding-top:var(--sp-6)">
  <h1><span data-lang="ar">فضاء المراجعة</span><span data-lang="fr">Espace révision</span></h1>

  <div class="tabs" role="tablist" style="margin-bottom:var(--sp-6)" data-revision-section>
    <button class="tab" data-section-value="lecons" aria-selected="true"><span data-lang="ar">مراجعة الدروس</span><span data-lang="fr">Révision des leçons</span></button>
    <button class="tab" data-section-value="froud" aria-selected="false"><span data-lang="ar">الاستعداد للفروض</span><span data-lang="fr">Préparation aux devoirs</span></button>
    <button class="tab" data-section-value="imtihanat" aria-selected="false"><span data-lang="ar">الاستعداد للامتحانات</span><span data-lang="fr">Préparation aux examens</span></button>
  </div>

  <!-- ========== 1) مراجعة الدروس ========== -->
  <div data-section-panel="lecons">
    <div class="layout-with-sidebar">
      <aside class="filters-sidebar">
      <div class="filters-sidebar-head">${uiIcon("filter")}<span data-lang="ar">تصفية النتائج</span><span data-lang="fr">Filtrer les résultats</span></div>
        ${filterDropdown("niveau", "المستوى", "Niveau", NIVEAU_CHIPS.map((c) => `<option value="${c.v}">${c.l}</option>`).join(""))}
        <div class="filter-group" data-filter-key="filiere-group" hidden>
          <h4><span data-lang="ar">المسلك</span><span data-lang="fr">Filière</span></h4>
          <select class="filter-select" data-revision-filter="filiere">
            <option value="" data-i18n="filter_all"></option>
            ${FILIERE_CHIPS.map((c) => `<option value="${c.v}">${c.l}</option>`).join("")}
          </select>
        </div>
        ${filterDropdown("dorra", "الدورة", "Semestre", `<option value="1" data-i18n="semester_1"></option><option value="2" data-i18n="semester_2"></option>`)}
        ${filterDropdown("unite", "الوحدة", "Unité")}
      </aside>
      <div>
        <div class="tabs" role="tablist" style="margin-bottom:var(--sp-5)" data-revision-type>
          <button class="tab" data-type-value="resumes" aria-selected="true"><span data-lang="ar">ملخصات</span><span data-lang="fr">Résumés</span></button>
          <button class="tab" data-type-value="cartesMentales" aria-selected="false"><span data-lang="ar">خرائط ذهنية</span><span data-lang="fr">Cartes mentales</span></button>
          <button class="tab" data-type-value="flashcards" aria-selected="false"><span data-lang="ar">بطاقات مراجعة</span><span data-lang="fr">Flashcards</span></button>
          <button class="tab" data-type-value="quizDocuments" aria-selected="false"><span data-lang="ar">اختبارات استدلال علمي</span><span data-lang="fr">Quiz documents</span></button>
        </div>
        <div data-revision-panel="resumes" class="grid grid-3"></div>
        <div data-revision-panel="cartesMentales" class="grid grid-3" hidden></div>
        <div data-revision-panel="flashcards" hidden>
          <button class="btn btn-ghost btn-sm" data-flashcards-shuffle style="margin-bottom:var(--sp-4)">${uiIcon("shuffle")} <span data-lang="ar">خلط البطاقات</span><span data-lang="fr">Mélanger</span></button>
          <div class="grid grid-3" data-flashcards-grid></div>
        </div>
        <div data-revision-panel="quizDocuments" hidden></div>
      </div>
    </div>
  </div>

  <!-- ========== 2) الاستعداد للفروض ========== -->
  <div data-section-panel="froud" hidden>
    <div class="layout-with-sidebar">
      <aside class="filters-sidebar">
      <div class="filters-sidebar-head">${uiIcon("filter")}<span data-lang="ar">تصفية النتائج</span><span data-lang="fr">Filtrer les résultats</span></div>
        ${filterDropdown("fard-niveau", "المستوى", "Niveau", NIVEAU_CHIPS.map((c) => `<option value="${c.v}">${c.l}</option>`).join(""))}
        <div class="filter-group" data-filter-key="fard-filiere-group" hidden>
          <h4><span data-lang="ar">المسلك</span><span data-lang="fr">Filière</span></h4>
          <select class="filter-select" data-revision-filter="fard-filiere">
            <option value="" data-i18n="filter_all"></option>
            ${FILIERE_CHIPS.map((c) => `<option value="${c.v}">${c.l}</option>`).join("")}
          </select>
        </div>
        ${filterDropdown("fard-dorra", "الدورة", "Semestre", `<option value="1" data-i18n="semester_1"></option><option value="2" data-i18n="semester_2"></option>`)}
      </aside>
      <div>
        <div class="grid grid-2" data-fard-grid></div>
        <div class="state-empty" data-fard-empty hidden>
          <span class="icon">${uiIcon("empty")}</span>
          <p><span data-lang="ar">لا توجد فروض بعد لهذا الاختيار.</span><span data-lang="fr">Aucun devoir pour ce choix.</span></p>
        </div>
      </div>
    </div>
  </div>

  <!-- ========== 3) الاستعداد للامتحانات (مستويان إشهاديان فقط: 3AC و2BAC) ========== -->
  <div data-section-panel="imtihanat" hidden>
    <p><span data-lang="ar">الامتحانات الإشهادية بالمغرب محصورة في مستويين: الثالثة إعدادي (امتحانان محلي وجهوي) والثانية بكالوريا (امتحان وطني حسب المسلك).</span><span data-lang="fr">Au Maroc, les examens certificatifs concernent deux niveaux : la 3AC (examens local et régional) et la 2BAC (examen national selon la filière).</span></p>
    <div class="tabs" role="tablist" style="margin:var(--sp-4) 0 var(--sp-6)" data-imtihan-niveau>
      <button class="tab" data-imtihan-niveau-value="3ac" aria-selected="true">3AC</button>
      <button class="tab" data-imtihan-niveau-value="2bac" aria-selected="false">2BAC</button>
    </div>

    <div data-imtihan-panel="3ac">
      <div class="grid grid-2" data-imtihan-3ac-grid></div>
    </div>
    <div data-imtihan-panel="2bac" hidden>
      <div class="filter-group" style="max-width:280px;margin-bottom:var(--sp-5)">
        <h4><span data-lang="ar">المسلك</span><span data-lang="fr">Filière</span></h4>
        <select class="filter-select" data-imtihan-2bac-filiere>
          <option value="" data-i18n="filter_all"></option>
          ${FILIERE_2BAC_CHIPS.map((c) => `<option value="${c.v}">${c.l}</option>`).join("")}
        </select>
      </div>
      <div class="grid grid-2" data-imtihan-2bac-grid></div>
    </div>
  </div>

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

// صفحة 404 — تُكتب في جذر الموقع (404.html) لا في مجلد فرعي، بمسارات أصول مطلقة تعمل من أي عمق رابط
export function notFoundBody() {
  return `
<div class="container" style="padding:var(--sp-9) var(--sp-5);max-width:560px;text-align:center">
  <p class="mono" style="font-size:var(--fs-32);color:var(--secondary);margin-bottom:var(--sp-3)">404</p>
  <h1><span data-lang="ar">هذه الصفحة غير موجودة</span><span data-lang="fr">Page introuvable</span></h1>
  <p style="color:var(--ink-soft);margin-bottom:var(--sp-6)"><span data-lang="ar">قد يكون الرابط قديما أو خاطئا. يمكنك العودة إلى الرئيسية أو تصفّح الدروس والموسوعة.</span><span data-lang="fr">Le lien est peut-être ancien ou erroné. Revenez à l'accueil ou parcourez les leçons et l'encyclopédie.</span></p>
  <div class="hero-ctas" style="justify-content:center">
    <a class="btn btn-primary" href="/"><span data-lang="ar">العودة إلى الرئيسية</span><span data-lang="fr">Retour à l'accueil</span></a>
    <a class="btn btn-ghost" href="/lecons/"><span data-lang="ar">تصفّح الدروس</span><span data-lang="fr">Parcourir les leçons</span></a>
  </div>
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
        <button class="tab" data-filter-value="interactif" aria-selected="false">${uiIcon("labo")} <span data-lang="ar">تفاعلي</span><span data-lang="fr">Interactif</span></button>
        <button class="tab" data-filter-value="video" aria-selected="false">${uiIcon("video")} <span data-lang="ar">فيديو</span><span data-lang="fr">Vidéo</span></button>
        <button class="tab" data-filter-value="animation" aria-selected="false">${uiIcon("animation")} <span data-lang="ar">رسوم متحركة</span><span data-lang="fr">Animation</span></button>
      </div>
    </div>
    <div class="grid grid-3" data-labo-grid></div>
    <div class="state-empty" data-labo-grid-empty hidden><span class="icon">${uiIcon("empty")}</span><p><span data-lang="ar">لا توجد تجارب لهذا النوع بعد.</span><span data-lang="fr">Aucune expérience pour ce type.</span></p></div>
  </div>
</div>`;
}
