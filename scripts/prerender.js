// سكريبت التصيير المسبق وقت البناء — القسم 12.2.1 (إلزامي، حل مشكلة الفهرسة)
import fs from "node:fs";
import path from "node:path";
import { ROOT, listLecons, listUnites, listBlog } from "./lib/content-loader.js";
import { collectLessonRoutes, collectEncyclopediaRoutes, collectBlogRoutes, collectResumeRoutes } from "./lib/routes.js";
import { makeRenderDeps } from "./lib/render-deps-node.js";
import { wrapPage } from "./lib/partials.js";
import {
  lessonDetailBody,
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
  const lecons = listLecons();
  const unites = listUnites();
  const uniteById = Object.fromEntries(unites.map((u) => [u.id, u]));
  const leconById = Object.fromEntries(lecons.map((l) => [l.id, l]));

  const blogRoutes = collectBlogRoutes();
  const latestBlogPost = blogRoutes[0] ? { id: blogRoutes[0].item.id, titre_ar: blogRoutes[0].item.titre_ar, titre_fr: blogRoutes[0].item.titre_fr } : null;

  let generated = 0;

  function tracksForLecon(lecon) {
    if (lecon.filieres && lecon.filieres.length) return lecon.filieres;
    return [lecon.niveau];
  }

  function resolveNavTarget(targetId, currentTrack) {
    const target = leconById[targetId];
    if (!target) return null;
    const targetUnite = uniteById[target.unite_id];
    if (!targetUnite) return null;
    const tracks = tracksForLecon(target);
    const track = tracks.includes(currentTrack) ? currentTrack : tracks[0];
    return { titre: target.titre, track, uniteSlug: targetUnite.slug, slug: target.slug || target.id };
  }

  // ---------- 1) الدروس ----------
  for (const route of collectLessonRoutes()) {
    const { lecon, unite, track, url } = route;
    const prevLecon = lecon.navigation && lecon.navigation.lecon_precedente ? resolveNavTarget(lecon.navigation.lecon_precedente, track) : null;
    const nextLecon = lecon.navigation && lecon.navigation.lecon_suivante ? resolveNavTarget(lecon.navigation.lecon_suivante, track) : null;

    const bodyHtml = lessonDetailBody({ lecon, unite, deps, prevLecon, nextLecon, track });
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
