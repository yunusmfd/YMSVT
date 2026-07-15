// أيقونات SVG صغيرة للاستعمال في وحدات JS الديناميكية (وقت التصفح) — نسخة مصغّرة موازية لـscripts/lib/icons.js
// (لا يمكن الاستيراد من scripts/lib هناك لأن مسار scripts/ غير متاح وقت التصفح، القسم 11.2)
const I = (paths) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

export const ICON_WARNING = I(`<path d="M12 4L21.5 20H2.5z"/><line x1="12" y1="10" x2="12" y2="14.2"/><circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none"/>`);
export const ICON_SEARCH_EMPTY = I(`<circle cx="10.5" cy="10.5" r="6.5"/><line x1="15.3" y1="15.3" x2="20.5" y2="20.5"/>`);
export const ICON_BULB = I(`<path d="M9.5 18h5"/><path d="M10.3 21h3.4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.3 1 2.1h5c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>`);
export const ICON_CALENDAR = I(`<rect x="3.5" y="5" width="17" height="16" rx="2"/><line x1="3.5" y1="10" x2="20.5" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/>`);
export const ICON_PIN = I(`<path d="M12 21s7-6.6 7-11.5A7 7 0 0 0 5 9.5C5 14.4 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.4"/>`);
export const ICON_FLASK = I(`<path d="M9 3h6"/><path d="M10 3v6l-4.5 8a1.6 1.6 0 0 0 1.4 2.4h10.2A1.6 1.6 0 0 0 18.5 17L14 9V3"/><path d="M7.3 14h9.4"/>`);
export const ICON_VIDEO = I(`<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M10 9l5.5 3-5.5 3z"/>`);
export const ICON_ANIMATION = I(`<rect x="3" y="6" width="18" height="12" rx="2"/><line x1="8.5" y1="6" x2="8.5" y2="18"/><line x1="15.5" y1="6" x2="15.5" y2="18"/>`);
export const ICON_DOCUMENT = I(`<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><line x1="9.5" y1="12.5" x2="14.5" y2="12.5"/><line x1="9.5" y1="16" x2="14.5" y2="16"/>`);
