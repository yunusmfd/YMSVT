// تبديل الوضع الليلي/الفاتح + الحفظ في nova-svt:theme (القسم 4.1.1، 3.1.3)
export function initTheme() {
  const toggles = document.querySelectorAll("[data-theme-toggle]");
  toggles.forEach((btn) => {
    btn.setAttribute(
      "aria-label",
      document.documentElement.getAttribute("lang") === "fr" ? "Basculer le mode sombre" : "تبديل الوضع الليلي"
    );
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("nova-svt:theme", next);
      } catch (e) {
        /* تجاهل صامت — راجع inline-init.js لنفس المنطق */
      }
    });
  });
}
