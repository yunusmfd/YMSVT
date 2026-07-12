// محرك فلترة عام لصفحات القوائم (الدروس/الفروض/المختبر/الموسوعة/المراجعة) — دمج AND بين الفلاتر (القسم 6.3.1)
export function initFilters(root = document) {
  const filterWraps = root.querySelectorAll("[data-filters]");
  filterWraps.forEach((wrap) => {
    const listSelector = wrap.getAttribute("data-filters-target");
    const list = document.querySelector(listSelector);
    if (!list) return;
    const items = () => Array.from(list.querySelectorAll("[data-item]"));
    const emptySelector = wrap.getAttribute("data-filters-empty");
    const emptyState = emptySelector ? document.querySelector(emptySelector) : null;

    const state = {};

    function applyFilters() {
      let visibleCount = 0;
      items().forEach((item) => {
        let visible = true;
        for (const key in state) {
          if (!state[key]) continue;
          const itemVal = item.getAttribute(`data-${key}`);
          if (itemVal !== state[key]) visible = false;
        }
        item.hidden = !visible;
        if (visible) visibleCount++;
      });
      if (emptyState) emptyState.hidden = visibleCount !== 0;

      // القسم 6.3.1: فلتر المسلك يظهر فقط عند اختيار مستوى ثانوي تأهيلي
      const filiereControl = wrap.querySelector('[data-filter-key="filiere"]');
      if (filiereControl) {
        const niveau = state.niveau;
        const isThanawi = niveau && !["1ac", "2ac", "3ac"].includes(niveau);
        filiereControl.closest(".filter-group").hidden = !isThanawi;
        if (!isThanawi) {
          state.filiere = "";
        }
      }
    }

    wrap.querySelectorAll("[data-filter-key]").forEach((control) => {
      const key = control.getAttribute("data-filter-key");
      control.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-filter-value]");
        if (!btn) return;
        const value = btn.getAttribute("data-filter-value");
        state[key] = state[key] === value ? "" : value;
        control.querySelectorAll("[data-filter-value]").forEach((b) => b.setAttribute("aria-selected", String(b === btn && state[key] === value)));
        applyFilters();
      });
      control.addEventListener("change", (e) => {
        if (e.target.matches("select, input")) {
          state[key] = e.target.value;
          applyFilters();
        }
      });
    });

    applyFilters();
  });
}
