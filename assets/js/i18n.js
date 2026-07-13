// قاموس نصوص واجهة ثابتة (نافبار/فوتر/أزرار عامة) — القسم 5.1: تبديل اللغة فوري بدون إعادة تحميل
export const I18N = {
  ar: {
    nav_home: "الرئيسية",
    nav_lecons: "الدروس",
    nav_exams: "الامتحانات",
    nav_labo: "المختبر",
    nav_encyclopedie: "الموسوعة",
    nav_revision: "المراجعة",
    nav_more: "المزيد",
    nav_blog: "المدونة",
    nav_apropos: "عن المنصة",
    nav_contact: "اتصل بنا",
    search_placeholder: "ابحث...",
    search_title: "البحث",
    search_empty: "لا نتائج مطابقة",
    theme_toggle: "تبديل الوضع الليلي",
    lang_toggle: "التبديل إلى الفرنسية",
    breadcrumb_home: "الرئيسية",
    btn_start: "ابدأ التعلّم",
    btn_labo: "جرّب المختبر الافتراضي",
    footer_rights: "جميع الحقوق محفوظة",
    footer_privacy: "سياسة الخصوصية",
    print_btn: "طباعة / تنزيل PDF",
    loading: "جارٍ التحميل...",
    retry: "إعادة المحاولة",
    lang_missing: "هذا المحتوى غير متوفر بعد بالفرنسية.",
    skip_to_content: "تخطَّ إلى المحتوى",
    menu_open: "القائمة",
    close: "إغلاق",
    blog_menu: "المدونة",
    filter_all: "الكل",
    semester_1: "الدورة الأولى",
    semester_2: "الدورة الثانية",
    mon_espace: "لوحة المتعلم",
  },
  fr: {
    nav_home: "Accueil",
    nav_lecons: "Leçons",
    nav_exams: "Examens",
    nav_labo: "Labo",
    nav_encyclopedie: "Encyclopédie",
    nav_revision: "Révision",
    nav_more: "Plus",
    nav_blog: "Blog",
    nav_apropos: "À propos",
    nav_contact: "Contact",
    search_placeholder: "Rechercher...",
    search_title: "Recherche",
    search_empty: "Aucun résultat",
    theme_toggle: "Basculer le mode sombre",
    lang_toggle: "Passer à l'arabe",
    breadcrumb_home: "Accueil",
    btn_start: "Commencer",
    btn_labo: "Essayer le labo virtuel",
    footer_rights: "Tous droits réservés",
    footer_privacy: "Politique de confidentialité",
    print_btn: "Imprimer / Télécharger en PDF",
    loading: "Chargement...",
    retry: "Réessayer",
    lang_missing: "Ce contenu n'est pas encore disponible en français.",
    skip_to_content: "Aller au contenu",
    menu_open: "Menu",
    close: "Fermer",
    blog_menu: "Blog",
    filter_all: "Tous",
    semester_1: "1er semestre",
    semester_2: "2e semestre",
    mon_espace: "Tableau de bord",
  },
};

export function t(key, lang) {
  const l = lang || document.documentElement.getAttribute("lang") || "ar";
  return (I18N[l] && I18N[l][key]) || key;
}

export function applyI18n(root = document) {
  const lang = document.documentElement.getAttribute("lang") || "ar";
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"), lang);
  });
  root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder"), lang));
  });
  root.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"), lang));
  });
}
