// اعتماديات محرك العرض المشترك (render-core.js) من جهة Node — القسم 12.2.1 و14.2أ
import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import { buildGlossaryIndex, ROOT } from "./content-loader.js";

// يُضمّن محتوى ملفات SVG حرفيا وقت التصيير المسبق (بدل <img src>) حتى يعمل تبديل data-lang
// عبر CSS الصفحة (القسم 14.2هـ) — مستندات <img> معزولة ولا ترث تنسيقات الصفحة الأصلية.
const svgCache = new Map();
export function svgInliner(relativeSrc) {
  if (svgCache.has(relativeSrc)) return svgCache.get(relativeSrc);
  try {
    const content = fs.readFileSync(path.join(ROOT, relativeSrc), "utf-8");
    svgCache.set(relativeSrc, content);
    return content;
  } catch (e) {
    svgCache.set(relativeSrc, null);
    return null;
  }
}

export function makeRenderDeps() {
  return { marked, DOMPurify, glossaryIndex: buildGlossaryIndex(), svgInliner };
}
