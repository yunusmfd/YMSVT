// بصمة محتوى شيفرة الموقع (CSS/JS) — تُستعمل لتسمية كاش الـService Worker كي يتحدّث تلقائيا عند كل تغيير فعلي في الشيفرة.
// لا نُبصم أسماء الملفات نفسها (رسم بياني ESM بروابط نسبية)، بل نعتمد على SW + إعادة تحقّق HTTP لإيصال التحديثات (القسم 11.2).
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { ROOT } from "./content-loader.js";

function walk(dir, exts, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, exts, out);
    else if (exts.some((e) => entry.name.endsWith(e)) && entry.name !== "sw.js") out.push(full);
  }
}

let cached = null;
export function assetVersion() {
  if (cached) return cached;
  const files = [];
  for (const rel of ["assets/css", "assets/js"]) {
    const dir = path.join(ROOT, rel);
    if (fs.existsSync(dir)) walk(dir, [".css", ".js"], files);
  }
  files.sort();
  const h = crypto.createHash("sha256");
  for (const f of files) {
    h.update(path.relative(ROOT, f));
    h.update(fs.readFileSync(f));
  }
  cached = h.digest("hex").slice(0, 10);
  return cached;
}
