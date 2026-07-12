// توليد sitemap.xml من كل روابط المحتوى المنشور (القسم 12.6)
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/content-loader.js";
import { collectLessonRoutes, collectUnitRoutes, collectEncyclopediaRoutes, collectBlogRoutes, collectResumeRoutes, collectVirtualLabRoutes, STATIC_ROUTES } from "./lib/routes.js";

const BASE_URL = "https://novasvt.ma";

function main() {
  const dynamicUrls = [
    ...collectLessonRoutes(),
    ...collectUnitRoutes(),
    ...collectEncyclopediaRoutes(),
    ...collectBlogRoutes(),
    ...collectResumeRoutes(),
    ...collectVirtualLabRoutes(),
  ].map((r) => r.url);
  const allUrls = [...STATIC_ROUTES, ...dynamicUrls];

  const urlEntries = allUrls
    .map((u) => `  <url><loc>${BASE_URL}${u}</loc></url>`)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;

  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml, "utf-8");
  console.log(`✅ sitemap.xml: ${allUrls.length} رابطا.`);
}

main();
