// حساب موحّد لكل روابط المحتوى المنشور — يُستهلك من prerender.js وbuild-search-index.js وbuild-sitemap.js
// (مصدر حقيقة واحد لبنية الروابط، يطابق القسم 3.5)
import { listLecons, listUnites, listAllEncyclopedia, listBlog, listRevision, listVirtualLab } from "./content-loader.js";

function tracksForLecon(lecon) {
  return lecon.filieres && lecon.filieres.length ? lecon.filieres : [lecon.niveau];
}

export function collectLessonRoutes() {
  const lecons = listLecons();
  const unites = listUnites();
  const uniteById = Object.fromEntries(unites.map((u) => [u.id, u]));
  const routes = [];
  for (const lecon of lecons) {
    const unite = uniteById[lecon.unite_id];
    if (!unite) continue;
    for (const track of tracksForLecon(lecon)) {
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

// يجمّع الدروس في وحدات لكل (وحدة × مسلك)، مرتّبة داخليا حسب ordre_dans_unite (القسم 3.3، 6.1) —
// مصدر واحد يستهلكه: صفحة الوحدة، قائمة "دروس الوحدة" داخل الدرس، حساب السابق/التالي داخل الوحدة، والتجميع في القائمة.
export function collectUnitGroups() {
  const lecons = listLecons();
  const unites = listUnites();
  const uniteById = Object.fromEntries(unites.map((u) => [u.id, u]));
  const groups = new Map(); // key: `${track}::${uniteId}`

  for (const lecon of lecons) {
    const unite = uniteById[lecon.unite_id];
    if (!unite) continue;
    for (const track of tracksForLecon(lecon)) {
      const key = `${track}::${unite.id}`;
      if (!groups.has(key)) {
        groups.set(key, {
          track,
          unite,
          url: `/lecons/${track}/${unite.slug}/`,
          lecons: [],
        });
      }
      groups.get(key).lecons.push(lecon);
    }
  }

  for (const g of groups.values()) {
    g.lecons.sort((a, b) => (a.ordre_dans_unite || 0) - (b.ordre_dans_unite || 0));
    g.lecons = g.lecons.map((lecon, i) => ({
      lecon,
      ordre: i + 1,
      url: `/lecons/${g.track}/${g.unite.slug}/${lecon.slug || lecon.id}/`,
      prev: null,
      next: null,
    }));
    // سابق/تالي داخل نفس الوحدة (سلسلة خطّية طبيعية عبر ترتيب الوحدة)
    g.lecons.forEach((item, i) => {
      item.prev = i > 0 ? g.lecons[i - 1] : null;
      item.next = i < g.lecons.length - 1 ? g.lecons[i + 1] : null;
    });
  }
  return [...groups.values()];
}

export function collectUnitRoutes() {
  return collectUnitGroups().map((g) => ({
    type: "unite",
    title: g.unite.titre,
    url: g.url,
    tags: [],
    group: g,
  }));
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
