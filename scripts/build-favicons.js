// يولّد مجموعة Favicon الكاملة من شعار الأيقونة الحقيقي — القسم 12.6
// سكريبت مستقل (لا يُشغَّل تلقائيا ضمن npm run build لأن الشعار لا يتغيّر مع كل نشر) — نفّذه يدويا عند تغيير اللوغو فقط
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { ROOT } from "./lib/content-loader.js";

const DIR = path.join(ROOT, "assets/images/favicons");
const svgPath = path.join(ROOT, "assets/images/logo/nova-svt-icon.png");
// الأيقونة رسم خطّي بلا خلفية مصمتة — تُسطَّح على أبيض حتى لا تختفي حلقتها الخضراء الداكنة فوق تبويبات داكنة

// يبني ملف .ico صالحا (حاوية ICO حديثة تُضمّن بيانات PNG مباشرة — مدعومة من كل المتصفحات الحديثة)
function buildIco(pngBuffer, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // count: 1 image

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 = 256)
  entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2); // color palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(pngBuffer.length, 8); // image data size
  entry.writeUInt32LE(6 + 16, 12); // offset

  return Buffer.concat([header, entry, pngBuffer]);
}

async function main() {
  const svg = fs.readFileSync(svgPath);

  const png32 = await sharp(svg).resize(32, 32).flatten({ background: { r: 255, g: 255, b: 255 } }).png().toBuffer();
  fs.writeFileSync(path.join(DIR, "favicon.ico"), buildIco(png32, 32));

  await sharp(svg).resize(180, 180).flatten({ background: { r: 255, g: 255, b: 255 } }).png().toFile(path.join(DIR, "apple-touch-icon.png"));
  await sharp(svg).resize(192, 192).flatten({ background: { r: 255, g: 255, b: 255 } }).png().toFile(path.join(DIR, "icon-192.png"));
  await sharp(svg).resize(512, 512).flatten({ background: { r: 255, g: 255, b: 255 } }).png().toFile(path.join(DIR, "icon-512.png"));

  const manifest = {
    name: "Nova SVT",
    short_name: "Nova SVT",
    icons: [
      { src: "/assets/images/favicons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/assets/images/favicons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    theme_color: "#204F3F",
    background_color: "#F0F1F0",
    display: "standalone",
    start_url: "/",
    lang: "ar",
    dir: "rtl",
  };
  fs.writeFileSync(path.join(DIR, "site.webmanifest"), JSON.stringify(manifest, null, 2));

  console.log("✅ Favicons generated: favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png, site.webmanifest");
}

main();
