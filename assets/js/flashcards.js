// بطاقات المراجعة القابلة للتقليب + خلط البطاقات (القسم 7.7)
export function initFlashcards() {
  document.querySelectorAll("[data-flashcard]").forEach((card) => {
    const flip = () => card.classList.toggle("flipped");
    card.addEventListener("click", flip);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        flip();
      }
    });
  });

  const shuffleBtn = document.querySelector("[data-flashcards-shuffle]");
  const grid = document.querySelector("[data-flashcards-grid]");
  if (shuffleBtn && grid) {
    shuffleBtn.addEventListener("click", () => {
      const cards = Array.from(grid.children);
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }
      cards.forEach((c) => {
        c.classList.remove("flipped");
        grid.appendChild(c);
      });
    });
  }
}
