// يبني كل الصفحات الساكنة (القوائم/المحاور/الصفحات النصية) — القسم 7 وخريطة الموقع 3.1
// يفترض أن manifest.json وsearch-index.json وsitemap.xml تم توليدها مسبقا (ترتيب npm run build)
import fs from "node:fs";
import path from "node:path";
import { ROOT, listVirtualLab } from "./lib/content-loader.js";
import { svgInliner } from "./lib/render-deps-node.js";
import { collectBlogRoutes } from "./lib/routes.js";
import { wrapPage } from "./lib/partials.js";
import {
  homeBody,
  leconsListBody,
  examsListBody,
  laboListBody,
  encyclopedieHubBody,
  encyArticlesListBody,
  encyScientifiquesListBody,
  encyDecouvertesListBody,
  encyGlossaireListBody,
  encyChronologiesListBody,
  encySaviezVousListBody,
  encyGalerieListBody,
  encyOrganismesListBody,
  encyRochesMineralListBody,
  encyGeologieMarocListBody,
  encyExperiencesHistoriquesListBody,
  revisionBody,
  blogListBody,
  monEspaceBody,
  aproposBody,
  contactBody,
  confidentialiteBody,
} from "./lib/page-bodies.js";

function writePage(routeUrl, html) {
  const dir = path.join(ROOT, routeUrl.replace(/^\//, ""));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html, "utf-8");
}

function scriptTag(src) {
  return `<script type="module" src="${src}"></script>`;
}

function main() {
  const blogRoutes = collectBlogRoutes();
  const latestBlogPost = blogRoutes[0] ? { id: blogRoutes[0].item.id, titre_ar: blogRoutes[0].item.titre_ar, titre_fr: blogRoutes[0].item.titre_fr } : null;
  const common = { latestBlogPost };

  const pages = [
    { url: "/", title: "Nova SVT | المرجع الرقمي لعلوم الحياة والأرض بالمغرب", description: "منصة تعليمية مجانية وثنائية اللغة لمادة علوم الحياة والأرض بالمغرب.", body: homeBody(), activeNav: "home", scripts: "/assets/js/pages/home.js" },
    { url: "/lecons/", title: "الدروس | Nova SVT", description: "دروس علوم الحياة والأرض لكل المستويات، بالعربية والفرنسية.", body: leconsListBody(), activeNav: "lecons", scripts: "/assets/js/pages/lecons-list.js" },
    { url: "/devoirs-examens/", title: "الفروض والامتحانات | Nova SVT", description: "فروض وامتحانات SVT قابلة للتحميل مع التصحيح.", body: examsListBody(), activeNav: "exams", scripts: "/assets/js/pages/exams-list.js" },
    { url: "/labo-virtuel/", title: "المختبر الافتراضي | Nova SVT", description: "تجارب تفاعلية وفيديوهات ورسوم متحركة في SVT.", body: laboListBody(), activeNav: "labo", scripts: "/assets/js/pages/labo-list.js" },
    { url: "/encyclopedie/", title: "الموسوعة العلمية | Nova SVT", description: "معجم، علماء، اكتشافات، كائنات حية، صخور ومعادن، جيولوجيا المغرب، رسوم وخرائط، تجارب تاريخية، خطوط زمنية ومقالات.", body: encyclopedieHubBody(), activeNav: "encyclopedie" },
    { url: "/encyclopedie/articles/", title: "آفاق ومقالات علمية | Nova SVT", description: "مقالات علمية في البيولوجيا والجيولوجيا والبيئة.", body: encyArticlesListBody(), activeNav: "encyclopedie", scripts: "/assets/js/pages/ency-articles.js" },
    { url: "/encyclopedie/scientifiques/", title: "علماء | Nova SVT", description: "أبرز علماء الحياة والأرض عبر التاريخ.", body: encyScientifiquesListBody(), activeNav: "encyclopedie", scripts: "/assets/js/pages/ency-scientifiques.js" },
    { url: "/encyclopedie/decouvertes/", title: "اكتشافات علمية | Nova SVT", description: "أبرز الاكتشافات العلمية في علوم الحياة والأرض.", body: encyDecouvertesListBody(), activeNav: "encyclopedie", scripts: "/assets/js/pages/ency-decouvertes.js" },
    { url: "/encyclopedie/glossaire/", title: "المعجم العلمي | Nova SVT", description: "معجم مصطلحات علوم الحياة والأرض.", body: encyGlossaireListBody(), activeNav: "encyclopedie", scripts: "/assets/js/pages/ency-glossaire.js" },
    { url: "/encyclopedie/chronologies/", title: "خطوط زمنية | Nova SVT", description: "خطوط زمنية تفاعلية لتاريخ العلوم.", body: encyChronologiesListBody(), activeNav: "encyclopedie", scripts: "/assets/js/pages/ency-chronologies.js" },
    { url: "/encyclopedie/saviez-vous/", title: "هل تعلم؟ | Nova SVT", description: "حقائق علمية قصيرة ومثيرة للفضول.", body: encySaviezVousListBody(), activeNav: "encyclopedie", scripts: "/assets/js/pages/ency-saviez.js" },
    { url: "/encyclopedie/galerie/", title: "الرسوم والخرائط العلمية | Nova SVT", description: "رسوم تخطيطية علمية موسومة للمراجعة البصرية.", body: encyGalerieListBody(), activeNav: "encyclopedie", scripts: "/assets/js/pages/ency-galerie.js" },
    { url: "/encyclopedie/organismes/", title: "الكائنات الحية | Nova SVT", description: "أنواع حيوانية ونباتية مغربية، موطنها وخصائصها.", body: encyOrganismesListBody(), activeNav: "encyclopedie", scripts: "/assets/js/pages/ency-organismes.js" },
    { url: "/encyclopedie/roches-mineraux/", title: "الصخور والمعادن | Nova SVT", description: "تركيب الصخور والمعادن الشائعة، منشؤها واستعمالاتها.", body: encyRochesMineralListBody(), activeNav: "encyclopedie", scripts: "/assets/js/pages/ency-roches.js" },
    { url: "/encyclopedie/geologie-maroc/", title: "جيولوجيا المغرب | Nova SVT", description: "أبرز التكوينات الجيولوجية المغربية وقصة تشكّلها.", body: encyGeologieMarocListBody(), activeNav: "encyclopedie", scripts: "/assets/js/pages/ency-geologie-maroc.js" },
    { url: "/encyclopedie/experiences-historiques/", title: "التجارب العلمية التاريخية | Nova SVT", description: "تجارب غيّرت فهمنا للحياة والطبيعة.", body: encyExperiencesHistoriquesListBody(), activeNav: "encyclopedie", scripts: "/assets/js/pages/ency-experiences.js" },
    { url: "/revision/", title: "فضاء المراجعة | Nova SVT", description: "ملخصات، خرائط ذهنية، بطاقات مراجعة واختبارات استدلال علمي.", body: revisionBody(), activeNav: "revision", scripts: "/assets/js/pages/revision.js" },
    { url: "/mon-espace/", title: "فضاء الطالب | Nova SVT", description: "تقدمك الدراسي محفوظ محليا في متصفحك فقط.", body: monEspaceBody(), activeNav: "", scripts: "/assets/js/pages/mon-espace.js" },
    { url: "/blog/", title: "المدونة | Nova SVT", description: "مقالات ونقاشات علمية حول SVT.", body: blogListBody(), activeNav: "blog", scripts: "/assets/js/pages/blog-list.js" },
    { url: "/a-propos/", title: "عن المنصة | Nova SVT", description: "تعرّف على رؤية ورسالة Nova SVT.", body: aproposBody(), activeNav: "apropos" },
    { url: "/contact/", title: "اتصل بنا | Nova SVT", description: "تواصل مع فريق Nova SVT.", body: contactBody(), activeNav: "contact" },
    { url: "/confidentialite/", title: "سياسة الخصوصية | Nova SVT", description: "سياسة خصوصية Nova SVT — منصة Local-first بدون تخزين بيانات شخصية.", body: confidentialiteBody(), activeNav: "" },
  ];

  for (const p of pages) {
    const html = wrapPage({
      title: p.title,
      description: p.description,
      bodyHtml: p.body,
      activeNav: p.activeNav,
      url: p.url,
      extraScripts: p.scripts ? scriptTag(p.scripts) : "",
      ...common,
    });
    writePage(p.url, html);
  }

  // ---------- صفحات تجربة المختبر الافتراضي الفردية ----------
  const experiences = listVirtualLab();
  for (const exp of experiences) {
    const bodyHtml = virtualLabDetailBody(exp);
    const url = `/labo-virtuel/${exp.id}/`;
    writePage(
      url,
      wrapPage({
        title: `${exp.titre.ar} | Nova SVT`,
        description: (exp.description && exp.description.ar) || exp.titre.ar,
        bodyHtml,
        activeNav: "labo",
        url,
        ...common,
      })
    );
  }

  console.log(`✅ build-pages: ${pages.length} صفحة ساكنة + ${experiences.length} صفحة تجربة مختبر.`);
}

function virtualLabDetailBody(exp) {
  const animSrc = exp.animation_src || exp.vignette;
  const animSvg = animSrc && /\.svg$/i.test(animSrc) ? svgInliner(animSrc) : null;
  const media =
    exp.type === "interactif"
      ? `<iframe src="/content/virtual-lab/${exp.id}/index.html" title="${exp.titre.ar}" style="width:100%;aspect-ratio:16/9;border:1px solid var(--line);border-radius:var(--radius-lg)" loading="lazy"></iframe>`
      : exp.type === "video"
      ? `<video controls preload="none" src="/${exp.video_src}" style="width:100%;border-radius:var(--radius-lg)"></video>`
      : animSvg
      ? `<div style="border-radius:var(--radius-lg);overflow:hidden">${animSvg}</div>`
      : `<img src="/${animSrc}" alt="${exp.titre.ar}" style="width:100%;border-radius:var(--radius-lg)" />`;

  return `
<div class="container" style="padding-top:var(--sp-6)">
  <nav class="breadcrumb"><a href="/"><span data-lang="ar">الرئيسية</span><span data-lang="fr">Accueil</span></a><span aria-hidden="true">/</span> <a href="/labo-virtuel/"><span data-lang="ar">المختبر الافتراضي</span><span data-lang="fr">Labo virtuel</span></a><span aria-hidden="true">/</span> <span class="current"><span data-lang="ar">${exp.titre.ar}</span><span data-lang="fr">${exp.titre.fr}</span></span></nav>
  <h1><span data-lang="ar">${exp.titre.ar}</span><span data-lang="fr">${exp.titre.fr}</span></h1>
  <p><span data-lang="ar">${exp.description.ar}</span><span data-lang="fr">${exp.description.fr}</span></p>
  ${media}
  <div style="margin-top:var(--sp-6)"><a class="btn btn-ghost" href="/labo-virtuel/">← <span data-lang="ar">العودة لقائمة التجارب</span><span data-lang="fr">Retour aux expériences</span></a></div>
</div>`;
}

main();
