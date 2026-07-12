// أدوات قراءة المحتوى من /content (Node فقط) — يُستدعى من scripts/prerender.js وسكريبتات البناء
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "..");
export const CONTENT_DIR = path.join(ROOT, "content");

function walk(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, ext));
    else if (entry.name.endsWith(ext)) out.push(full);
  }
  return out;
}

export function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function listJSON(dir) {
  return walk(dir, ".json").map(readJSON);
}

// gray-matter يحوّل تلقائيا تواريخ YAML غير المقتبَسة (date: 2026-07-10) إلى كائن Date —
// نعيدها لصيغة نصية YYYY-MM-DD ثابتة (بتوقيت UTC لتفادي انزياح المنطقة الزمنية)
function normalizeFrontMatterDate(data) {
  if (data && data.date instanceof Date) {
    data.date = data.date.toISOString().slice(0, 10);
  }
  return data;
}

export function listMarkdown(dir) {
  return walk(dir, ".md").map((filePath) => {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = matter(raw);
    return { ...normalizeFrontMatterDate(parsed.data), body: parsed.content, _file: filePath };
  });
}

// مقال/مدونة ثنائي اللغة: ملفان موازيان بنفس المعرّف تحت /ar و/fr (القسم 6.2أ)
export function listBilingualMarkdown(dir) {
  const merged = {};
  for (const lang of ["ar", "fr"]) {
    const files = walk(path.join(dir, lang), ".md");
    for (const filePath of files) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = matter(raw);
      const id = parsed.data.id || path.basename(filePath, ".md");
      if (!merged[id]) merged[id] = { id };
      Object.assign(merged[id], normalizeFrontMatterDate(parsed.data));
      merged[id][`body${lang === "ar" ? "Ar" : "Fr"}`] = parsed.content;
    }
  }
  return Object.values(merged);
}

export function listLecons() {
  return listJSON(path.join(CONTENT_DIR, "lecons")).filter((l) => l.statut === "publie");
}

export function listUnites() {
  return listJSON(path.join(CONTENT_DIR, "unites"));
}

export function listExams() {
  return listJSON(path.join(CONTENT_DIR, "exams"));
}

export function listVirtualLab() {
  const dir = path.join(CONTENT_DIR, "virtual-lab");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => readJSON(path.join(dir, e.name, "meta.json")));
}

const ENCYCLOPEDIA_TYPES = ["articles", "scientifiques", "decouvertes", "glossaire", "chronologies", "saviez-vous", "galerie"];

export function listEncyclopedia(type) {
  const dir = path.join(CONTENT_DIR, "encyclopedia", type);
  if (type === "articles") return listBilingualMarkdown(dir);
  return listJSON(dir);
}

export function listAllEncyclopedia() {
  const out = {};
  for (const t of ENCYCLOPEDIA_TYPES) out[t] = listEncyclopedia(t);
  return out;
}

const REVISION_TYPES = ["resumes", "cartes-mentales", "flashcards", "quiz-documents"];
export function listRevision(type) {
  const dir = path.join(CONTENT_DIR, "revision", type);
  if (type === "resumes") return listBilingualMarkdown(dir);
  return listJSON(dir);
}
export function listAllRevision() {
  const out = {};
  for (const t of REVISION_TYPES) out[t] = listRevision(t);
  return out;
}

export function listBlog() {
  return listBilingualMarkdown(path.join(CONTENT_DIR, "blog"));
}

export function buildGlossaryIndex() {
  const terms = listEncyclopedia("glossaire");
  const index = {};
  for (const term of terms) index[term.id] = term;
  return index;
}

export { ENCYCLOPEDIA_TYPES, REVISION_TYPES };
