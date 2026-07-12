// فهرس محاور الدرس (Scrollspy) + شريط تقدم القراءة (القسم 7.3.1، 7.3.3)
export function initReadingProgress() {
  const bar = document.querySelector("[data-progress-bar]");
  const content = document.querySelector("[data-lesson-content]");
  if (!bar || !content) return;
  const update = () => {
    const rect = content.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

export function initScrollspy() {
  const links = document.querySelectorAll("[data-toc-link]");
  const sections = Array.from(document.querySelectorAll("[data-lesson-section]"));
  if (!links.length || !sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove("active"));
          const active = document.querySelector(`[data-toc-link="${entry.target.id}"]`);
          if (active) active.classList.add("active");
        }
      });
    },
    { rootMargin: "-20% 0px -70% 0px" }
  );
  sections.forEach((sec) => observer.observe(sec));

  const tocToggle = document.querySelector("[data-toc-mobile-toggle]");
  const tocList = document.querySelector("[data-toc-list]");
  if (tocToggle && tocList) {
    tocToggle.addEventListener("click", () => {
      const isOpen = tocList.classList.toggle("open");
      tocToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }
}
