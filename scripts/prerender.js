// سكريبت التصيير المسبق وقت البناء — القسم 12.2.1 (إلزامي، حل مشكلة الفهرسة)
import fs from "node:fs";
import path from "node:path";
import { ROOT, listLecons, listUnites, listBlog } from "./lib/content-loader.js";
import { collectUnitGroups, collectEncyclopediaRoutes, collectBlogRoutes, collectResumeRoutes } from "./lib/routes.js";
import { makeRenderDeps } from "./lib/render-deps-node.js";
import { wrapPage } from "./lib/partials.js";
import {
  lessonDetailBody,
  uniteDetailBody,
  articleDetailBody,
  glossaireDetailBody,
  scientifiqueDetailBody,
  decouverteDetailBody,
  chronologieDetailBody,
  saviezVousDetailBody,
  galerieDetailBody,
} from "./lib/templates.js";

function writePage(routeUrl, html) {
  // routeUrl مثل "/lecons/2bac-svt/genetique/meiose/"
  const dir = path.join(ROOT, routeUrl.replace(/^\//, ""));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html, "utf-8");
}

function main() {
  const deps = makeRenderDeps();

  const blogRoutes = collectBlogRoutes();
  const latestBlogPost = blogRoutes[0] ? { id: blogRoutes[0].item.id, titre_ar: blogRoutes[0].item.titre_ar, titre_fr: blogRoutes[0].item.titre_fr } : null;

  let generated = 0;

  // ---------- 1) الدروس + صفحات الوحدات ----------
  // كل درس يستمد سابقه/تاليه وقائمة أشقّائه من ترتيب الوحدة (collectUnitGroups)، لا من حقل navigation اليدوي —
  // يعالج مباشرة واقع "الوحدة تضم عدة دروس" ويُبقي التنقّل متماسكا داخل الوحدة.
  const nav = (item) => (item ? { titre: item.lecon.titre, url: item.url } : null);

  for (const group of collectUnitGroups()) {
    const { unite, track } = group;
    const siblings = group.lecons.map((it) => ({ titre: it.lecon.titre, url: it.url, ordre: it.ordre, id: it.lecon.id }));

    for (const item of group.lecons) {
      const { lecon, url } = item;
      const bodyHtml = lessonDetailBody({
        lecon,
        unite,
        deps,
        track,
        prevLecon: nav(item.prev),
        nextLecon: nav(item.next),
        siblings,
        uniteUrl: group.url,
      });
      writePage(
        url,
        wrapPage({
          title: `${lecon.titre.ar} | Nova SVT`,
          description: (lecon.objectifs && lecon.objectifs.ar && lecon.objectifs.ar[0]) || lecon.titre.ar,
          bodyHtml,
          activeNav: "lecons",
          ogType: "article",
          url,
          latestBlogPost,
        })
      );
      generated++;
    }

    // صفحة فهرس الوحدة (تُصلح رابط مسار التنقّل المكسور سابقا)
    writePage(
      group.url,
      wrapPage({
        title: `${unite.titre.ar} | Nova SVT`,
        description: `${unite.titre.ar} — ${group.lecons.length} دروس`,
        bodyHtml: uniteDetailBody({ group }),
        activeNav: "lecons",
        url: group.url,
        latestBlogPost,
      })
    );
    generated++;
  }

  // ---------- 2) الموسوعة العلمية ----------
  const bodyBuilders = {
    article: (item) => articleDetailBody({ article: item, kind: "article", deps }),
    glossaire: (item) => glossaireDetailBody(item),
    scientifique: (item) => scientifiqueDetailBody(item),
    decouverte: (item) => decouverteDetailBody(item),
    chronologie: (item) => chronologieDetailBody(item),
    "saviez-vous": (item) => saviezVousDetailBody(item),
    galerie: (item) => galerieDetailBody(item, deps),
  };
  const descriptionOf = (type, item) => {
    if (type === "article") return item.titre_ar;
    if (type === "glossaire") return item.definition.ar;
    if (type === "scientifique") return item.resume.ar;
    if (type === "decouverte") return item.resume.ar;
    if (type === "saviez-vous") return item.texte.ar;
    return item.titre ? item.titre.ar : "";
  };
  const ogImageOf = (type, item) => {
    if (type === "article" && item.image_cover) return `/${item.image_cover}`;
    if (type === "scientifique" && item.photo) return `/${item.photo}`;
    if (type === "galerie" && item.image) return `/${item.image}`;
    return undefined;
  };

  for (const route of collectEncyclopediaRoutes()) {
    const bodyHtml = bodyBuilders[route.type](route.item);
    writePage(
      route.url,
      wrapPage({
        title: `${route.title.ar} | Nova SVT`,
        description: descriptionOf(route.type, route.item),
        bodyHtml,
        activeNav: "encyclopedie",
        ogType: route.type === "article" ? "article" : "website",
        ogImage: ogImageOf(route.type, route.item),
        url: route.url,
        latestBlogPost,
      })
    );
    generated++;
  }

  // ---------- 3) المدونة ----------
  for (const route of blogRoutes) {
    const bodyHtml = articleDetailBody({ article: route.item, kind: "blog", deps });
    writePage(
      route.url,
      wrapPage({
        title: `${route.item.titre_ar} | Nova SVT`,
        description: route.item.titre_ar,
        bodyHtml,
        activeNav: "blog",
        ogType: "article",
        ogImage: route.item.image_cover ? `/${route.item.image_cover}` : undefined,
        url: route.url,
        latestBlogPost,
      })
    );
    generated++;
  }

  // ---------- 4) ملخصات المراجعة (القسم 7.7: عرض كمقال مبسّط) ----------
  for (const route of collectResumeRoutes()) {
    const bodyHtml = articleDetailBody({ article: route.item, kind: "resume", deps });
    writePage(
      route.url,
      wrapPage({
        title: `${route.item.titre_ar} | Nova SVT`,
        description: route.item.titre_ar,
        bodyHtml,
        activeNav: "revision",
        url: route.url,
        latestBlogPost,
      })
    );
    generated++;
  }

  console.log(`✅ التصيير المسبق: تم توليد ${generated} صفحة تفاصيل ثابتة.`);
}

main();
