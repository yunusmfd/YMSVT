// بناء فهرس بحث ساكن واحد search-index.json — حل مشكلة أداء البحث (القسم 14.2ب)
import fs from "node:fs";
import path from "node:path";
import { ROOT, listAllEncyclopedia } from "./lib/content-loader.js";
import { collectLessonRoutes, collectEncyclopediaRoutes, collectBlogRoutes, collectResumeRoutes } from "./lib/routes.js";

function main() {
  const routes = [...collectLessonRoutes(), ...collectEncyclopediaRoutes(), ...collectBlogRoutes(), ...collectResumeRoutes()];
  const index = routes
    .filter((r) => r.type !== "chronologie" && r.type !== "saviez-vous" && r.type !== "galerie")
    .map((r) => ({ type: r.type, title: r.title, url: r.url, tags: r.tags }));

  fs.writeFileSync(path.join(ROOT, "search-index.json"), JSON.stringify(index), "utf-8");

  // فهرس معجم مبسّط (id → term) لاستهلاك الروابط المعجمية المضمّنة من جهة المتصفح (القسم 6.1.4)
  // يُكتب خارج /content عمدا حتى لا يُقرأ بالخطأ كملف محتوى جديد في عملية بناء لاحقة
  const glossaryTerms = listAllEncyclopedia().glossaire;
  const glossaryOut = {};
  for (const term of glossaryTerms) glossaryOut[term.id] = term;
  fs.writeFileSync(path.join(ROOT, "glossary-index.json"), JSON.stringify(glossaryOut), "utf-8");

  console.log(`✅ search-index.json: ${index.length} عنصرا. glossaire/index.json: ${Object.keys(glossaryOut).length} مصطلحا.`);
}

main();
