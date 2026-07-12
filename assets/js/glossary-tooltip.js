// تفعيل الروابط المعجمية المضمّنة {{terme:id}} → span.terme-link (القسم 6.1.4)
let glossaryCache = null;

async function loadGlossary() {
  if (glossaryCache) return glossaryCache;
  try {
    const res = await fetch("/glossary-index.json");
    glossaryCache = await res.json();
  } catch (e) {
    glossaryCache = {};
  }
  return glossaryCache;
}

export function initGlossaryTooltips() {
  const links = document.querySelectorAll(".terme-link[data-terme]");
  if (!links.length) return;

  let tooltip = document.querySelector(".glossary-tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.className = "glossary-tooltip";
    tooltip.hidden = true;
    tooltip.setAttribute("role", "tooltip");
    document.body.appendChild(tooltip);
  }

  const show = async (target) => {
    const glossary = await loadGlossary();
    const id = target.getAttribute("data-terme");
    const entry = glossary[id];
    if (!entry) return;
    const lang = document.documentElement.getAttribute("lang") || "ar";
    tooltip.innerHTML = `<strong>${entry.terme[lang] || entry.terme.ar}</strong><p>${entry.definition[lang] || entry.definition.ar}</p><a href="/encyclopedie/glossaire/${id}/">${lang === "fr" ? "Ouvrir dans le glossaire" : "افتح في المعجم"} ←</a>`;
    const rect = target.getBoundingClientRect();
    tooltip.style.top = `${window.scrollY + rect.bottom + 8}px`;
    tooltip.style.insetInlineStart = `${window.scrollX + rect.left}px`;
    tooltip.hidden = false;
  };
  const hide = () => {
    tooltip.hidden = true;
  };

  links.forEach((link) => {
    link.addEventListener("mouseenter", () => show(link));
    link.addEventListener("mouseleave", hide);
    link.addEventListener("focus", () => show(link));
    link.addEventListener("blur", hide);
    link.addEventListener("click", (e) => {
      e.preventDefault();
      if (tooltip.hidden) show(link);
      else hide();
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hide();
  });
}
