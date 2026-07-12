/*
  سكريبت أوّلي حرج (Critical Inline Script)
  يُحقن حرفيا داخل <head> كل صفحة (عبر scripts/lib/partials.js وقت البناء)
  قبل أول Paint، لتفادي وميض تبديل الثيم/الاتجاه (FOUC/RTL flash) — القسم 3.1.3 و4.1.1.
  ملاحظة: يبقى هذا الملف مصدر المرجعية المقروءة؛ partials.js يُضمّن نسخة مطابقة inline.
*/
(function () {
  try {
    var theme = localStorage.getItem("nova-svt:theme");
    if (!theme) {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.setAttribute("data-theme", theme);

    var lang = localStorage.getItem("nova-svt:lang") || document.documentElement.getAttribute("lang") || "ar";
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "fr" ? "ltr" : "rtl");
  } catch (e) {
    /* localStorage قد يكون معطّلا (وضع خاص) — لا كسر للصفحة، القيم الافتراضية في HTML تبقى فعّالة */
  }
})();
