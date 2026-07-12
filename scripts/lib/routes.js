// حساب موحّد لكل روابط المحتوى المنشور — يُستهلك من prerender.js وbuild-search-index.js وbuild-sitemap.js
// (مصدر حقيقة واحد لبنية الروابط، يطابق القسم 3.5)
import { listLecons, listUnites, listAllEncyclopedia, listBlog, listRevision, listVirtualLab } from "./content-loader.js";

export function collectLessonRoutes() {
  const lecons = listLecons();
  const unites = listUnites();
  const uniteById = Object.fromEntries(unites.map((u) => [u.id, u]));
  const routes = [];
  for (const lecon of lecons) {
    const unite = uniteById[lecon.unite_id];
    if (!unite) continue;
    const tracks = lecon.filieres && lecon.filieres.length ? lecon.filieres : [lecon.niveau];
    for (const track of tracks) {
      routes.push({
        type: "lecon",
        title: lecon.titre,
        url: `/lecons/${track}/${unite.slug}/${lecon.slug || lecon.id}/`,
        tags: lecon.tags || [],
        lecon,
        unite,
        track,
      });
    }
  }
  return routes;
}

export function collectEncyclopediaRoutes() {
  const ency = listAllEncyclopedia();
  const routes = [];
  for (const article of ency.articles) {
    routes.push({ type: "article", title: { ar: article.titre_ar, fr: article.titre_fr }, url: `/encyclopedie/articles/${article.id}/`, tags: [article.categorie].filter(Boolean), item: article });
  }
  for (const term of ency.glossaire) {
    routes.push({ type: "glossaire", title: term.terme, url: `/encyclopedie/glossaire/${term.id}/`, tags: [], item: term });
  }
  for (const sci of ency.scientifiques) {
    routes.push({ type: "scientifique", title: sci.nom, url: `/encyclopedie/scientifiques/${sci.id}/`, tags: sci.domaines || [], item: sci });
  }
  for (const dec of ency.decouvertes) {
    routes.push({ type: "decouverte", title: dec.titre, url: `/encyclopedie/decouvertes/${dec.id}/`, tags: [dec.domaine].filter(Boolean), item: dec });
  }
  for (const chr of ency.chronologies) {
    routes.push({ type: "chronologie", title: chr.titre, url: `/encyclopedie/chronologies/${chr.id}/`, tags: [], item: chr });
  }
  for (const item of ency["saviez-vous"]) {
    routes.push({ type: "saviez-vous", title: { ar: "هل تعلم؟", fr: "Le saviez-vous ?" }, url: `/encyclopedie/saviez-vous/${item.id}/`, tags: [], item });
  }
  for (const item of ency.galerie) {
    routes.push({ type: "galerie", title: item.titre, url: `/encyclopedie/galerie/${item.id}/`, tags: [item.domaine].filter(Boolean), item });
  }
  return routes;
}

export function collectBlogRoutes() {
  const blog = listBlog().sort((a, b) => new Date(b.date) - new Date(a.date));
  return blog.map((post) => ({
    type: "blog",
    title: { ar: post.titre_ar, fr: post.titre_fr },
    url: `/blog/${post.id}/`,
    tags: [post.categorie].filter(Boolean),
    item: post,
  }));
}

// الملخصات فقط تحصل على صفحة تفاصيل مستقلة (القسم 7.7: "عرض كمقال مبسّط... مع زر طباعة")
export function collectResumeRoutes() {
  const resumes = listRevision("resumes");
  return resumes.map((r) => ({
    type: "resume",
    title: { ar: r.titre_ar, fr: r.titre_fr },
    url: `/revision/resumes/${r.id}/`,
    tags: [],
    item: r,
  }));
}

export function collectVirtualLabRoutes() {
  return listVirtualLab().map((exp) => ({ type: "labo", title: exp.titre, url: `/labo-virtuel/${exp.id}/`, tags: [], item: exp }));
}

export const STATIC_ROUTES = [
  "/",
  "/lecons/",
  "/devoirs-examens/",
  "/labo-virtuel/",
  "/encyclopedie/",
  "/encyclopedie/articles/",
  "/encyclopedie/scientifiques/",
  "/encyclopedie/decouvertes/",
  "/encyclopedie/glossaire/",
  "/encyclopedie/chronologies/",
  "/encyclopedie/saviez-vous/",
  "/encyclopedie/galerie/",
  "/revision/",
  "/mon-espace/",
  "/blog/",
  "/a-propos/",
  "/contact/",
  "/confidentialite/",
];
