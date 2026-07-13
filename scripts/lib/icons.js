// أيقونات SVG أصلية بسيطة — stroke="currentColor" لتتكيف مع الوضع الليلي تلقائيا (القسم 4.1.1)
export const ICON_SEARCH = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
export const ICON_BELL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`;
export const ICON_MOON = `<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
export const ICON_SUN = `<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`;
export const ICON_HAMBURGER = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
export const ICON_CLOSE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
export const ICON_ARROW = `<svg class="flip-rtl" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
export const ICON_USER = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>`;

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
};

export function uiIcon(name) {
  return UI_ICONS[name] || "";
}
