// أجزاء HTML مشتركة (نافبار/فوتر/الهيكل العام للصفحة) — يُستدعى من scripts/build-pages.js وscripts/prerender.js
// حتى لا يتكرر تصميم النافبار/الفوتر يدويا في عشرات الملفات (القسم 12.1 لا يمنع أداة DRY وقت البناء)
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./content-loader.js";
import { ICON_SEARCH, ICON_BELL, ICON_MOON, ICON_SUN, ICON_HAMBURGER, ICON_CLOSE, ICON_ARROW, ICON_USER, ICON_GLOBE, uiIcon } from "./icons.js";

// شعار: أيقونة دائرية + "Nova SVT" بسطر واحد بخط Serif أخضر (كما في القالب المرجعي)
const NOVA_LOGO_IMG = `<img src="/assets/images/logo/nova-svt-icon.png" alt="" class="nova-logo-img" width="44" height="44" /><span class="nova-logo-text">Nova SVT</span>`;

const INLINE_INIT = fs.readFileSync(path.join(ROOT, "assets/js/inline-init.js"), "utf-8");

const NAV_ITEMS = [
  { key: "lecons", href: "/lecons/", i18n: "nav_lecons" },
  { key: "exams", href: "/devoirs-examens/", i18n: "nav_exams" },
  { key: "labo", href: "/labo-virtuel/", i18n: "nav_labo" },
  { key: "encyclopedie", href: "/encyclopedie/", i18n: "nav_encyclopedie" },
  { key: "revision", href: "/revision/", i18n: "nav_revision" },
];
const MORE_ITEMS = [
  { key: "blog", href: "/blog/", i18n: "nav_blog" },
  { key: "apropos", href: "/a-propos/", i18n: "nav_apropos" },
  { key: "contact", href: "/contact/", i18n: "nav_contact" },
];

export function renderNavbar({ activeNav = "", latestBlogPost = null } = {}) {
  const navLinks = NAV_ITEMS.map(
    (item) => `<li><a class="nav-link" href="${item.href}" data-i18n="${item.i18n}"${item.key === activeNav ? ' aria-current="page"' : ""}></a></li>`
  ).join("");

  const moreLinks = MORE_ITEMS.map(
    (item) => `<a href="${item.href}" data-i18n="${item.i18n}"${item.key === activeNav ? ' aria-current="page"' : ""}></a>`
  ).join("");

  const bellContent = latestBlogPost
    ? `<a href="/blog/${latestBlogPost.id}/"><strong data-lang="ar">${latestBlogPost.titre_ar || ""}</strong><strong data-lang="fr">${latestBlogPost.titre_fr || ""}</strong></a><a href="/blog/" class="mono" data-i18n="nav_blog" style="font-size:var(--fs-12)"></a>`
    : `<a href="/blog/" data-i18n="nav_blog"></a>`;

  return `
<a href="#main" class="skip-link" data-i18n="skip_to_content">تخطَّ إلى المحتوى</a>
<header class="navbar" data-navbar>
  <div class="navbar-inner">
    <a href="/" class="nova-logo">${NOVA_LOGO_IMG}</a>
    <nav class="nav-center" aria-label="التنقل الرئيسي">
      <ul class="nav-links">
        <li><a class="nav-link" href="/" data-i18n="nav_home"${activeNav === "home" ? ' aria-current="page"' : ""}></a></li>
        ${navLinks}
      </ul>
      <div class="nav-more" data-nav-more>
        <button class="nav-more-trigger" data-nav-more-trigger aria-expanded="false">
          <span data-i18n="nav_more"></span>
          <span class="arrow" aria-hidden="true">▾</span>
        </button>
        <div class="nav-more-menu" data-nav-more-menu hidden>${moreLinks}</div>
      </div>
    </nav>
    <div class="nav-actions">
      <button class="icon-btn" data-search-open data-i18n-aria="search_title">${ICON_SEARCH}</button>
      <button class="icon-btn lang-toggle-btn" data-lang-toggle data-i18n-aria="lang_toggle">${ICON_GLOBE}<span data-lang-code>FR</span></button>
      <button class="icon-btn theme-toggle" data-theme-toggle data-i18n-aria="theme_toggle">${ICON_MOON}${ICON_SUN}</button>
      <div class="nav-more" data-nav-more>
        <button class="icon-btn" data-nav-more-trigger="bell" aria-expanded="false" data-i18n-aria="blog_menu">${ICON_BELL}<span class="bell-dot"></span></button>
        <div class="nav-more-menu" data-nav-more-menu hidden>${bellContent}</div>
      </div>
      <a class="icon-btn" href="/mon-espace/" data-i18n-aria="mon_espace">${ICON_USER}</a>
      <button class="icon-btn hamburger-btn" data-hamburger-btn data-i18n-aria="menu_open">${ICON_HAMBURGER}</button>
    </div>
  </div>
  <div class="nav-divider-bar"></div>
</header>

<div class="mobile-menu" data-mobile-menu hidden>
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--sp-6)">
    <span class="nova-logo">${NOVA_LOGO_IMG}</span>
    <button class="icon-btn" data-mobile-menu-close data-i18n-aria="close">${ICON_CLOSE}</button>
  </div>
  <nav>
    <ul>
      <li><a class="nav-link" href="/" data-i18n="nav_home"></a></li>
      ${NAV_ITEMS.map((item) => `<li><a class="nav-link" href="${item.href}" data-i18n="${item.i18n}"></a></li>`).join("")}
      <li class="mobile-submenu">
        ${MORE_ITEMS.map((item) => `<a class="nav-link" href="${item.href}" data-i18n="${item.i18n}"></a>`).join("")}
      </li>
    </ul>
  </nav>
</div>

<div class="search-overlay" data-search-overlay hidden>
  <div class="search-box" role="dialog" aria-modal="true" data-i18n-aria="search_title">
    <div class="search-box-header">
      ${ICON_SEARCH}
      <input type="search" data-search-input data-i18n-placeholder="search_placeholder" autocomplete="off" />
      <button class="icon-btn" data-search-close data-i18n-aria="close">${ICON_CLOSE}</button>
    </div>
    <div class="search-suggestions">
      <button class="chip" data-search-suggestion>الانقسام المنصف</button>
      <button class="chip" data-search-suggestion>التركيب الضوئي</button>
      <button class="chip" data-search-suggestion>المناعة</button>
      <button class="chip" data-search-suggestion>الخلية</button>
    </div>
    <div class="search-results" data-search-results></div>
  </div>
</div>
`;
}

export function renderFooter() {
  return `
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <span class="nova-logo">${NOVA_LOGO_IMG}</span>
        <p class="footer-blurb" data-lang="ar">منصة مخصّصة لمرافقة التلاميذ نحو التميّز الأكاديمي في علوم الحياة والأرض، بموارد مطابقة للمعايير التربوية.</p>
        <p class="footer-blurb" data-lang="fr">Plateforme dédiée à l'accompagnement des élèves vers l'excellence académique en Sciences de la Vie et de la Terre, avec des ressources conformes aux standards pédagogiques.</p>
        <div class="footer-social">
          <a href="/" aria-label="Nova SVT">${uiIcon("bilingual")}</a>
          <a href="/lecons/" aria-label="${"الدروس"}">${uiIcon("curriculum")}</a>
          <a href="/contact/" data-i18n-aria="nav_contact">${uiIcon("mail")}</a>
        </div>
      </div>
      <div class="footer-col">
        <h5><span data-lang="ar">المنصة</span><span data-lang="fr">Plateforme</span></h5>
        <ul>
          <li><a href="/lecons/" data-i18n="nav_lecons"></a></li>
          <li><a href="/devoirs-examens/" data-i18n="nav_exams"></a></li>
          <li><a href="/labo-virtuel/" data-i18n="nav_labo"></a></li>
          <li><a href="/encyclopedie/" data-i18n="nav_encyclopedie"></a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5><span data-lang="ar">الدعم</span><span data-lang="fr">Support</span></h5>
        <ul>
          <li><a href="/a-propos/" data-i18n="nav_apropos"></a></li>
          <li><a href="/contact/" data-i18n="nav_contact"></a></li>
          <li><a href="/revision/" data-i18n="nav_revision"></a></li>
          <li><a href="/blog/" data-i18n="nav_blog"></a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5><span data-lang="ar">قانوني</span><span data-lang="fr">Légal</span></h5>
        <ul>
          <li><a href="/confidentialite/" data-i18n="footer_privacy"></a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span data-current-year>2026</span> Nova SVT — <span data-i18n="footer_rights"></span></span>
      <span data-lang="ar">صُنع بعناية للتلميذ والأستاذ المغربي 🇲🇦</span>
      <span data-lang="fr">Conçu avec soin pour l'élève et l'enseignant marocain 🇲🇦</span>
    </div>
  </div>
</footer>`;
}

// بيانات مهيكلة JSON-LD (schema.org) — تحسّن ظهور البحث والنتائج الغنية. inLanguage يوضّح ثنائية اللغة
// للمحرّكات بما أن الصفحة الواحدة تحمل النسختين العربية والفرنسية معا (القسم 12.2.1).
const SITE_URL = "https://novasvt.ma";
export function jsonLdScript(obj) {
  return `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;
}

// كيان المنظّمة التعليمية + الموقع (مع صندوق بحث Sitelinks) — يُحقن في الصفحة الرئيسية
export function orgAndWebsiteJsonLd() {
  return (
    jsonLdScript({
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: "Nova SVT",
      url: SITE_URL,
      logo: `${SITE_URL}/assets/images/favicons/icon-512.png`,
      description: "منصة تعليمية مجانية وثنائية اللغة لعلوم الحياة والأرض بالمغرب.",
      inLanguage: ["ar", "fr"],
      areaServed: "MA",
    }) +
    jsonLdScript({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Nova SVT",
      url: SITE_URL,
      inLanguage: ["ar", "fr"],
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    })
  );
}

// مورد تعليمي/درس أو مقال — يُحقن في صفحات التفاصيل
export function learningResourceJsonLd({ type = "LearningResource", titleAr, description, url, image, datePublished }) {
  const obj = {
    "@context": "https://schema.org",
    "@type": type,
    name: titleAr,
    description: description || titleAr,
    url: `${SITE_URL}${url}`,
    inLanguage: ["ar", "fr"],
    isAccessibleForFree: true,
    provider: { "@type": "EducationalOrganization", name: "Nova SVT", url: SITE_URL },
  };
  if (image) obj.image = image.startsWith("http") ? image : `${SITE_URL}${image}`;
  if (datePublished) obj.datePublished = datePublished;
  if (type === "LearningResource") obj.learningResourceType = "Leçon";
  return jsonLdScript(obj);
}

export function renderHead({ title, description, ogImage = "/assets/images/hero/og-default.webp", ogType = "website", url = "", extraHead = "" }) {
  const fullUrl = url ? `https://novasvt.ma${url}` : "";
  return `
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<meta name="description" content="${description}" />
<link rel="canonical" href="${fullUrl}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="https://novasvt.ma${ogImage}" />
<meta property="og:type" content="${ogType}" />
<meta property="og:url" content="${fullUrl}" />
<meta property="og:locale" content="ar_MA" />
<meta property="og:locale:alternate" content="fr_MA" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="theme-color" content="#204F3F" />
<link rel="icon" href="/assets/images/favicons/favicon.ico" sizes="any" />
<link rel="icon" type="image/png" sizes="192x192" href="/assets/images/favicons/icon-192.png" />
<link rel="apple-touch-icon" href="/assets/images/favicons/apple-touch-icon.png" />
<link rel="manifest" href="/assets/images/favicons/site.webmanifest" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Markazi+Text:wght@600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Sans+Arabic:wght@400;500&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/assets/css/tokens.css" />
<link rel="stylesheet" href="/assets/css/base.css" />
<link rel="stylesheet" href="/assets/css/components.css" />
<script>${INLINE_INIT}</script>
${extraHead}`;
}

// مسار التنقل (Breadcrumb) — القسم 3.4. trail: [{ar,fr,href}] بدون آخر عنصر (الحالي يُضاف تلقائيا)
export function renderBreadcrumb(trail, currentAr, currentFr) {
  const items = [{ ar: "الرئيسية", fr: "Accueil", href: "/" }, ...trail];
  const linksHtml = items
    .map(
      (item) => `<a href="${item.href}"><span data-lang="ar">${item.ar}</span><span data-lang="fr">${item.fr}</span></a><span aria-hidden="true">/</span>`
    )
    .join(" ");
  return `<nav class="breadcrumb" aria-label="مسار التنقل">
    ${linksHtml}
    <span class="current"><span data-lang="ar">${currentAr}</span><span data-lang="fr">${currentFr}</span></span>
  </nav>`;
}

export function wrapPage({
  lang = "ar",
  title,
  description,
  bodyHtml,
  activeNav = "",
  ogImage,
  ogType,
  url = "",
  extraHead = "",
  extraScripts = "",
  latestBlogPost = null,
  bodyClass = "",
}) {
  const dir = lang === "fr" ? "ltr" : "rtl";
  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
${renderHead({ title, description, ogImage, ogType, url, extraHead })}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ""}>
${renderNavbar({ activeNav, latestBlogPost })}
<main id="main">
${bodyHtml}
</main>
${renderFooter()}
<script src="/assets/vendor/marked.min.js"></script>
<script src="/assets/vendor/purify.min.js"></script>
<script type="module" src="/assets/js/site.js"></script>
<script>document.querySelectorAll('[data-current-year]').forEach(function(el){el.textContent = new Date().getFullYear();});</script>
${extraScripts}
</body>
</html>`;
}
