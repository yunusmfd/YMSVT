// سلوك الشريط العلوي: شفافية عند التمرير (3.1.4)، قائمة "المزيد" (3.1.1)، قائمة الهامبرغر (8.1)
export function initNav() {
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // قائمة "المزيد" — حاسوب: Dropdown يُفتح بالنقر ويُغلق بالنقر خارجها
  const moreWrap = document.querySelector("[data-nav-more]");
  const moreTrigger = document.querySelector("[data-nav-more-trigger]");
  const moreMenu = document.querySelector("[data-nav-more-menu]");
  if (moreWrap && moreTrigger && moreMenu) {
    const closeMore = () => {
      moreMenu.hidden = true;
      moreTrigger.setAttribute("aria-expanded", "false");
    };
    moreTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = !moreMenu.hidden;
      moreMenu.hidden = isOpen;
      moreTrigger.setAttribute("aria-expanded", String(!isOpen));
    });
    document.addEventListener("click", (e) => {
      if (!moreWrap.contains(e.target)) closeMore();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMore();
    });
  }

  // الهامبرغر — هاتف: قائمة فرعية ثابتة (غير منبثقة) بدل Dropdown متداخل
  const hamburgerBtn = document.querySelector("[data-hamburger-btn]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const mobileMenuClose = document.querySelector("[data-mobile-menu-close]");
  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener("click", () => {
      mobileMenu.hidden = false;
      document.body.style.overflow = "hidden";
    });
  }
  if (mobileMenuClose && mobileMenu) {
    mobileMenuClose.addEventListener("click", () => {
      mobileMenu.hidden = true;
      document.body.style.overflow = "";
    });
  }
}
