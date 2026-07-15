// يبني manifest.json — قوائم مختصرة لكل نوع محتوى تستهلكها صفحات القوائم عبر fetch() من جهة المتصفح (القسم 12.2)
// (التصيير المسبق في prerender.js يبقى مخصصا لصفحات *التفاصيل* فقط، وفق النطاق الإلزامي بالقسم 12.2.1)
import fs from "node:fs";
import path from "node:path";
import { ROOT, listExams, listVirtualLab, listAllEncyclopedia, listAllRevision } from "./lib/content-loader.js";
import { collectLessonRoutes, collectBlogRoutes } from "./lib/routes.js";

// المصغّرات تُولَّد يدويا عبر scripts/build-lesson-thumbnails.js (SVG أول محور مرسوما بلغة واحدة)
function leconVignette(leconId) {
  const rel = `assets/images/thumbs/lecon-${leconId}.png`;
  return fs.existsSync(path.join(ROOT, rel)) ? rel : null;
}

function main() {
  const lecons = collectLessonRoutes().map((r) => ({
    id: r.lecon.id,
    titre: r.lecon.titre,
    niveau: r.lecon.niveau,
    filiere: r.track,
    unite: r.unite.titre,
    uniteId: r.unite.id,
    uniteUrl: `/lecons/${r.track}/${r.unite.slug}/`,
    uniteOrdre: r.unite.numero_ordre || 0,
    ordreInUnite: r.lecon.ordre_dans_unite || 0,
    dorra: r.lecon.dorra,
    duree: r.lecon.duree_estimee_min,
    tags: r.lecon.tags || [],
    domaine_specialite: r.lecon.domaine_specialite || null,
    description: { ar: (r.lecon.objectifs && r.lecon.objectifs.ar && r.lecon.objectifs.ar[0]) || "", fr: (r.lecon.objectifs && r.lecon.objectifs.fr && r.lecon.objectifs.fr[0]) || "" },
    date_maj: r.lecon.date_maj,
    vignette: leconVignette(r.lecon.id),
    url: r.url,
  }));

  const exams = listExams().map((e) => ({
    id: e.id,
    type: e.type,
    sous_type: e.sous_type || null,
    niveau: e.niveau,
    filiere: e.filiere || "",
    dorra: e.dorra,
    numero: e.numero,
    annee_scolaire: e.annee_scolaire,
    titre: e.titre,
    fichier_pdf: e.fichier_pdf,
    corrige_pdf: e.corrige_pdf || null,
  }));

  const virtualLab = listVirtualLab().map((v) => ({
    id: v.id,
    type: v.type,
    niveau: v.niveau,
    titre: v.titre,
    description: v.description,
    vignette: v.vignette,
  }));

  const ency = listAllEncyclopedia();
  const encyclopedia = {
    articles: ency.articles.map((a) => ({ id: a.id, titre: { ar: a.titre_ar, fr: a.titre_fr }, categorie: a.categorie, date: a.date, image_cover: a.image_cover })),
    scientifiques: ency.scientifiques.map((s) => ({ id: s.id, nom: s.nom, periode: s.periode, photo: s.photo, domaines: s.domaines || [] })),
    decouvertes: ency.decouvertes.map((d) => ({ id: d.id, titre: d.titre, annee: d.annee, domaine: d.domaine, scientifiques_lies: d.scientifiques_lies || [] })),
    glossaire: ency.glossaire.map((g) => ({ id: g.id, terme: g.terme, definition: g.definition })),
    chronologies: ency.chronologies.map((c) => ({ id: c.id, titre: c.titre, nbEvenements: c.evenements.length })),
    saviezVous: ency["saviez-vous"].map((sv) => ({ id: sv.id, texte: sv.texte })),
    galerie: ency.galerie.map((g) => ({ id: g.id, titre: g.titre, domaine: g.domaine, image: g.image })),
    organismes: ency.organismes.map((o) => ({ id: o.id, nom: o.nom, nom_scientifique: o.nom_scientifique, regne: o.regne, image: o.image })),
    rochesMineraux: ency["roches-mineraux"].map((r) => ({ id: r.id, nom: r.nom, type: r.type, image: r.image })),
    geologieMaroc: ency["geologie-maroc"].map((g) => ({ id: g.id, titre: g.titre, region: g.region, image: g.image })),
    experiencesHistoriques: ency["experiences-historiques"].map((e) => ({ id: e.id, titre: e.titre, annee: e.annee, image: e.image })),
  };

  const rev = listAllRevision();
  const revision = {
    resumes: rev.resumes.map((r) => ({ id: r.id, titre: { ar: r.titre_ar, fr: r.titre_fr }, niveau: r.niveau, dorra: r.dorra || null, filieres: r.filieres || [], unite: r.unite })),
    cartesMentales: rev["cartes-mentales"].map((c) => ({ id: c.id, titre: c.titre, niveau: c.niveau, dorra: c.dorra || null, filieres: c.filieres || [], unite: c.unite, image: c.image })),
    flashcards: rev.flashcards.map((f) => ({ id: f.id, niveau: f.niveau, dorra: f.dorra || null, filieres: f.filieres || [], unite: f.unite, question: f.question, reponse: f.reponse })),
    quizDocuments: rev["quiz-documents"].map((q) => ({ id: q.id, titre: q.titre, niveau: q.niveau, dorra: q.dorra || null, filieres: q.filieres || [], unite: q.unite, document: q.document, questions: q.questions })),
  };

  const blog = collectBlogRoutes().map((r) => ({
    id: r.item.id,
    titre: { ar: r.item.titre_ar, fr: r.item.titre_fr },
    categorie: r.item.categorie,
    date: r.item.date,
    image_cover: r.item.image_cover,
    url: r.url,
  }));

  // manifest مقسّم حسب القسم بدل ملف واحد ضخم (كان ~60KB يُجلب كاملا في كل صفحة قائمة).
  // كل صفحة تجلب قسمها فقط عبر fetchSection() — القسم 11.2 (أداء 3G).
  const outDir = path.join(ROOT, "manifest");
  fs.mkdirSync(outDir, { recursive: true });
  const sections = {
    lecons,
    exams,
    "virtual-lab": virtualLab,
    encyclopedia,
    revision,
    blog,
    // حمولة صغيرة مخصّصة للصفحة الرئيسية (أحدث 3 دروس + معلومة "هل تعلم؟" واحدة) بدل جلب كل الدروس/الموسوعة
    home: {
      lecons: [...lecons].sort((a, b) => (b.date_maj || "").localeCompare(a.date_maj || "")).slice(0, 3),
      saviezVous: (encyclopedia.saviezVous || []).slice(0, 1),
    },
  };
  for (const [name, payload] of Object.entries(sections)) {
    fs.writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify(payload), "utf-8");
  }
  const totalKb = (Buffer.byteLength(JSON.stringify(sections)) / 1024).toFixed(1);
  console.log(`✅ manifest/: ${Object.keys(sections).length} أقسام (${totalKb}KB إجمالا) — ${lecons.length} درسا، ${exams.length} فرض/امتحان، ${virtualLab.length} تجربة، ${blog.length} مقال.`);
}

main();
