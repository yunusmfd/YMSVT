import { applyI18n, t } from "./i18n.js";

// تبديل اللغة الفوري: نفس الرابط، نفس موضع التمرير، بدون إعادة تحميل (القسم 5.1، 3.1.3)
export function initLang() {
  applyI18n();
  updateLangButtons();

  document.querySelectorAll("[data-lang-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("lang") === "fr" ? "fr" : "ar";
      const next = current === "fr" ? "ar" : "fr";
      const scrollY = window.scrollY;

      document.documentElement.setAttribute("lang", next);
      document.documentElement.setAttribute("dir", next === "fr" ? "ltr" : "rtl");
      try {
        localStorage.setItem("nova-svt:lang", next);
      } catch (e) {
        /* تجاهل صامت */
      }
      applyI18n();
      updateLangButtons();

      // يجب أن يبقى استرجاع موضع التمرير فوريا (لا حركة)، رغم "scroll-behavior: smooth" العام في base.css —
      // نعطّل السلاسة مؤقتا عبر نمط inline (يتفوّق على قاعدة CSS) ثم نُعيدها فورا (القسم 5.1)
      const html = document.documentElement;
      const previousScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, scrollY);
      html.style.scrollBehavior = previousScrollBehavior;
    });
  });
}

function updateLangButtons() {
  const current = document.documentElement.getAttribute("lang") === "fr" ? "fr" : "ar";
  document.querySelectorAll("[data-lang-toggle]").forEach((btn) => {
    btn.textContent = current === "fr" ? "AR" : "FR";
    btn.setAttribute("aria-label", t("lang_toggle", current));
  });
}
