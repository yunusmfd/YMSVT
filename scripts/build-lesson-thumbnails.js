// يولّد صورة مصغّرة (PNG) لكل درس من أول رسم SVG داخل محاوره، لعرضها في بطاقات قوائم الدروس.
// نفّذه يدويا عند إضافة/تعديل دروس (لا يتغيّر مع كل نشر عادي، مثل build-favicons.js).
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { ROOT } from "./lib/content-loader.js";
import { collectLessonRoutes } from "./lib/routes.js";

const OUT_DIR = path.join(ROOT, "assets/images/thumbs");

function firstImageSrc(lecon) {
  for (const section of lecon.sections || []) {
    for (const bloc of section.blocs || []) {
      if (bloc.type === "image" && /\.svg$/i.test(bloc.src)) return bloc.src;
    }
  }
  return null;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const seen = new Set();
  let count = 0;
  for (const route of collectLessonRoutes()) {
    const lecon = route.lecon;
    if (seen.has(lecon.id)) continue; // الدرس المشترك بين مسالك عدة يحتاج صورة واحدة فقط
    seen.add(lecon.id);

    const src = firstImageSrc(lecon);
    const svgPath = src && path.join(ROOT, src);
    if (!svgPath || !fs.existsSync(svgPath)) {
      console.warn(`⚠️  لا صورة SVG لهذا الدرس: ${lecon.id}`);
      continue;
    }

    // لا CSS خارجي متاح وقت التصيير (مصغّرة مستقلة)، لذا نعرض النسخة العربية فقط بإخفاء الطبقة الفرنسية
    let svg = fs.readFileSync(svgPath, "utf-8");
    svg = svg.replace(/(<svg[^>]*>)/, `$1<style>[data-lang="fr"]{display:none}</style>`);

    const outPath = path.join(OUT_DIR, `lecon-${lecon.id}.png`);
    await sharp(Buffer.from(svg))
      .resize(480, 270, { fit: "contain", background: "#F9FAF7" })
      .png({ compressionLevel: 9 })
      .toFile(outPath);
    count++;
  }
  console.log(`✅ صور مصغّرة للدروس: ${count} صورة في ${path.relative(ROOT, OUT_DIR)}/`);
}

main();
