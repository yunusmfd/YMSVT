// أيقونات الشريط العلوي — طقم موحّد بأسلوب Material Symbols Outlined: شبكة 24، سُمك خط 2، أطراف وزوايا مستديرة،
// وتناسب بصري متّسق بين كل الرموز. stroke="currentColor" ليتكيّف مع الوضع الليلي والسياق اللوني تلقائيا (القسم 4.1.1)
const NAV = (paths) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

export const ICON_SEARCH = NAV(`<circle cx="11" cy="11" r="7"/><line x1="16.8" y1="16.8" x2="21" y2="21"/>`);
export const ICON_BELL = NAV(`<path d="M6 10a6 6 0 0 1 12 0c0 3.8 1 5.4 1.8 6.3a.6.6 0 0 1-.45 1H4.65a.6.6 0 0 1-.45-1C5 15.4 6 13.8 6 10Z"/><path d="M9.8 20a2.2 2.2 0 0 0 4.4 0"/>`);
export const ICON_MOON = `<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 13.6A7.6 7.6 0 1 1 10.4 4 6 6 0 0 0 20 13.6Z"/></svg>`;
export const ICON_SUN = `<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4.1"/><path d="M12 2.6v2.3M12 19.1v2.3M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M2.6 12h2.3M19.1 12h2.3M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6"/></svg>`;
export const ICON_HAMBURGER = NAV(`<line x1="3.5" y1="7" x2="20.5" y2="7"/><line x1="3.5" y1="12" x2="20.5" y2="12"/><line x1="3.5" y1="17" x2="20.5" y2="17"/>`);
export const ICON_CLOSE = NAV(`<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`);
export const ICON_ARROW = `<svg class="flip-rtl" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" aria-hidden="true"><line x1="4" y1="12" x2="19" y2="12"/><polyline points="12.5 5.5 19 12 12.5 18.5"/></svg>`;
export const ICON_USER = NAV(`<circle cx="12" cy="8.5" r="3.5"/><path d="M5.8 19.6a6.2 6.2 0 0 1 12.4 0"/>`);
// كرة أرضية بخطوط الطول والعرض — لزر تبديل اللغة، بنفس سُمك الطقم العلوي (بديل عن bilingual ذي السُمك 1.6)
export const ICON_GLOBE = NAV(`<circle cx="12" cy="12" r="8.5"/><line x1="3.5" y1="12" x2="20.5" y2="12"/><path d="M12 3.5c2.3 2.4 3.5 5.4 3.5 8.5S14.3 18.1 12 20.5c-2.3-2.4-3.5-5.4-3.5-8.5S9.7 5.9 12 3.5Z"/>`);

/*
  أيقونات الواجهة المخصّصة (خطّية موحّدة: 24×24، stroke-width 1.6، أطراف مدوّرة) —
  تحلّ محل الـEmoji في شبكات الوصول السريع/الثقة/التخصصات لكسر الطابع القالبي (القسم 4.4).
  كلها currentColor لتتكيّف مع الوضع الليلي والسياق اللوني تلقائيا.
*/
const I = (paths) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

export const UI_ICONS = {
  // درس — كتاب مفتوح
  lecons: I(`<path d="M12 6.5C10.5 5 8 4.5 4.5 5v12c3.5-.5 6 0 7.5 1.5"/><path d="M12 6.5C13.5 5 16 4.5 19.5 5v12c-3.5-.5-6 0-7.5 1.5"/><line x1="12" y1="6.5" x2="12" y2="18.5"/>`),
  // امتحان — ورقة بعلامة تحقّق
  exams: I(`<path d="M6 3h9l3 3v15H6z"/><path d="M15 3v3h3"/><path d="M8.5 13l1.8 1.8L14 11"/>`),
  // مختبر — قارورة
  labo: I(`<path d="M9 3h6"/><path d="M10 3v6l-4.5 8a1.6 1.6 0 0 0 1.4 2.4h10.2A1.6 1.6 0 0 0 18.5 17L14 9V3"/><path d="M7.3 14h9.4"/>`),
  // موسوعة — مجلّدات مرصوصة
  encyclopedie: I(`<rect x="4" y="4" width="4" height="16" rx="1"/><rect x="9.5" y="4" width="4" height="16" rx="1"/><path d="M16.5 5.4l3.2.9 -3.3 12.6 -3.2-.9z"/><line x1="6" y1="8" x2="6" y2="9"/><line x1="11.5" y1="8" x2="11.5" y2="9"/>`),
  // مراجعة — بطاقات متراكبة
  revision: I(`<rect x="3" y="7" width="14" height="12" rx="2"/><path d="M7 4h11a2 2 0 0 1 2 2v10"/><line x1="7" y1="11" x2="13" y2="11"/><line x1="7" y1="15" x2="11" y2="15"/>`),
  // مجاني — قلب
  free: I(`<path d="M12 20s-7-4.4-9.2-8.4A4.4 4.4 0 0 1 12 6.5 4.4 4.4 0 0 1 21.2 11.6C19 15.6 12 20 12 20z"/>`),
  // ثنائي اللغة — كرة أرضية
  bilingual: I(`<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.4 4 5.6 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.6-4-9s1.4-6.6 4-9z"/>`),
  // منهاج رسمي — شهادة/قبعة تخرّج
  curriculum: I(`<path d="M12 4l9 4-9 4-9-4 9-4z"/><path d="M6.5 10v4.5c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8V10"/><line x1="21" y1="8" x2="21" y2="13"/>`),
  // بدون تسجيل — درع
  secure: I(`<path d="M12 3l7 3v5c0 4.6-3 8-7 10-4-2-7-5.4-7-10V6l7-3z"/><path d="M9.3 12l1.9 1.9 3.6-3.8"/>`),
  // بيولوجيا — خلية
  bio: I(`<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.4"/><circle cx="8" cy="8.5" r="1"/><circle cx="16.2" cy="15" r="1.2"/><circle cx="15.5" cy="8" r="0.9"/>`),
  // جيولوجيا — طبقات/جبل
  geo: I(`<path d="M3 19l5-8 3.5 4.5L15 10l6 9z"/><path d="M3 19h18"/><circle cx="8.5" cy="6.5" r="1.6"/>`),
  // نقطة/شرارة معرفية (هل تعلم) — بريق
  spark: I(`<path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7z"/>`),
  // تحميل — سهم نحو أسفل فوق خط
  download: I(`<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 19h16"/>`),
  // اختبار فوري — ورقة بعلامتي تحقق
  quiz: I(`<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M7.5 8.3l1.3 1.3L11 7.2"/><line x1="13.3" y1="8.3" x2="17" y2="8.3"/><path d="M7.5 14.3l1.3 1.3L11 13.2"/><line x1="13.3" y1="14.3" x2="17" y2="14.3"/>`),
  // رسوم تخطيطية — طبقات
  layers: I(`<polygon points="12 3 21 8.5 12 14 3 8.5 12 3"/><polyline points="3 14.5 12 20 21 14.5"/><polyline points="3 11.3 12 16.8 21 11.3"/>`),
  // فيديوهات شرح — زر تشغيل
  video: I(`<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M10 9l5.5 3-5.5 3z"/>`),
  // مصباح — هل تعلم
  bulb: I(`<path d="M9.5 18h5"/><path d="M10.3 21h3.4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.3 1 2.1h5c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>`),
  // مشاركة
  share: I(`<circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><line x1="8.3" y1="10.7" x2="15.7" y2="6.3"/><line x1="8.3" y1="13.3" x2="15.7" y2="17.7"/>`),
  // تصفية — قمع مبسّط
  filter: I(`<path d="M4 5h16"/><path d="M7 12h10"/><path d="M10 19h4"/>`),
  // فراغ/لا نتائج — صندوق مفتوح
  empty: I(`<path d="M4 12l2.5-7h11L20 12"/><path d="M4 12v6a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 18v-6"/><path d="M4 12h5.2c.3 1.2 1.3 2 2.8 2s2.5-.8 2.8-2H20"/>`),
  // خلط البطاقات
  shuffle: I(`<path d="M3 6h3.5L14 18h3.5"/><path d="M14 6h3.5L17.5 6l3 3-3 3"/><path d="M3 18h3.5L9 14"/><path d="M17.5 6l3-3-3-3"/>`),
  // طباعة
  print: I(`<path d="M6 9V3h12v6"/><rect x="4" y="9" width="16" height="8" rx="1.5"/><path d="M6 14h12v7H6z"/>`),
  // مصطلح/وسم
  tag: I(`<path d="M20 12.2L11.8 20.4a1.6 1.6 0 0 1-2.3 0L3.6 14.5a1.6 1.6 0 0 1 0-2.3L11.8 4h6.6a1.6 1.6 0 0 1 1.6 1.6z"/><circle cx="15.3" cy="8.7" r="1.3"/>`),
  // كتب مكدّسة
  books: I(`<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3h3A1.5 1.5 0 0 1 10 4.5v15A1.5 1.5 0 0 1 8.5 21h-3A1.5 1.5 0 0 1 4 19.5z"/><path d="M12 5l3.3-1.1a1.5 1.5 0 0 1 1.9.95l4.6 14.3a1.5 1.5 0 0 1-.96 1.9L17.5 22"/><line x1="4" y1="17" x2="10" y2="17"/>`),
  // ورقة/مقال
  newspaper: I(`<rect x="3" y="5" width="14" height="15" rx="1.5"/><path d="M17 8h2.5A1.5 1.5 0 0 1 21 9.5V18a2 2 0 0 1-2 2H7"/><line x1="6" y1="9" x2="12" y2="9"/><line x1="6" y1="12.5" x2="14" y2="12.5"/><line x1="6" y1="16" x2="14" y2="16"/>`),
  // تقويم/خط زمني
  calendar: I(`<rect x="3.5" y="5" width="17" height="16" rx="2"/><line x1="3.5" y1="10" x2="20.5" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/><circle cx="8.2" cy="14.2" r="0.9" fill="currentColor" stroke="none"/><circle cx="12" cy="14.2" r="0.9" fill="currentColor" stroke="none"/>`),
  // خريطة/رسم تخطيطي
  map: I(`<path d="M9 4L4 6.2v13.8L9 17.8"/><path d="M9 4l6 2.8v13.8L9 17.8"/><path d="M15 6.8l5-2.2v13.8l-5 2.4"/>`),
  // صخرة/معدن
  rock: I(`<path d="M5 18l1.6-6.4a2 2 0 0 1 1.7-1.5l2.2-.3 2-3a2 2 0 0 1 2.7-.5l3 1.9a2 2 0 0 1 .9 2l-.6 3.4a2 2 0 0 1-1 1.4L14 17"/><path d="M5 18h14"/>`),
  // شخص/عالِم
  person: I(`<circle cx="12" cy="7.5" r="3.5"/><path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5"/>`),
  // ورقة نبات/حالة حفظ
  leaf: I(`<path d="M5 19c8 0 13-5 14-14C10 6 5 11 5 19z"/><path d="M5 19c2-4 5-7 9-9"/>`),
  // موقع/دبّوس
  pin: I(`<path d="M12 21s7-6.6 7-11.5A7 7 0 0 0 5 9.5C5 14.4 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.4"/>`),
  // رسوم متحركة — شريط لقطات
  animation: I(`<rect x="3" y="6" width="18" height="12" rx="2"/><line x1="8.5" y1="6" x2="8.5" y2="18"/><line x1="15.5" y1="6" x2="15.5" y2="18"/>`),
  // بريد إلكتروني — ظرف
  mail: I(`<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6 8.5-6"/>`),
  // مجموعة/مسلك — شخصان
  groups: I(`<circle cx="9" cy="8" r="3"/><path d="M3.5 20c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5"/><path d="M16 5.2a3 3 0 0 1 0 5.6"/><path d="M17.5 14.7c2 .8 3.5 2.6 3.5 5.3"/>`),
  // إعادة تعيين — سهم دائري
  reset: I(`<path d="M4.5 12a7.5 7.5 0 1 1 2.2 5.3"/><polyline points="3 12 6.7 12 6.7 8.3"/>`),
  // شيفرون للأسفل
  chevron: I(`<polyline points="6 9 12 15 18 9"/>`),
  // زر تشغيل دائري
  play: I(`<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5 3.5-5 3.5z"/>`),
  // ساعة/مدة
  clock: I(`<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/>`),
};

export function uiIcon(name) {
  return UI_ICONS[name] || "";
}
