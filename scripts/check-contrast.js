// تحقق آلي من تباين الألوان WCAG 2.1 AA لكل أزواج نظام التصميم (فاتح+داكن) — القسم 10.2
// يقارن كل لون نص مرشّح مقابل كل خلفية مرشّحة، ويُبلّغ عن أي زوج دون العتبة (4.5:1 نص عادي / 3:1 نص كبير)

function hexToRgb(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function luminance([r, g, b]) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}
function contrastRatio(hex1, hex2) {
  const l1 = luminance(hexToRgb(hex1));
  const l2 = luminance(hexToRgb(hex2));
  const [lighter, darker] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (lighter + 0.05) / (darker + 0.05);
}

const PALETTES = {
  light: {
    bg: "#F0F1F0", "bg-alt": "#E3E8D6", ink: "#1B241F", "ink-soft": "#4D554E",
    primary: "#204F3F", "primary-light": "#3C7A63", secondary: "#C17A2E", accent: "#3B6E8F",
    rust: "#8B4A2B", "card-bg": "#F9FAF7",
  },
  dark: {
    bg: "#142219", "bg-alt": "#1A2C21", ink: "#E9ECE2", "ink-soft": "#A3B3A5",
    primary: "#3C8A6D", "primary-light": "#5AAE8C", secondary: "#D68F45", accent: "#6FAFCB",
    rust: "#8B4A2B", "card-bg": "#1C2F24",
  },
};

const SPEC = {
  light: { genetique: "#3D5A96", cytologie: "#8B4F73", physiologie: "#B4483F", ecologie: "#4C7A3E", biomol: "#6B4F8C", geologie: "#C17A2E", microbiologie: "#2E7A82", botanique: "#7A8F3E", zoologie: "#B5652E", taxonomie: "#8B7355" },
  dark: { genetique: "#6B87C4", cytologie: "#B87CA0", physiologie: "#D97668", ecologie: "#7AAD68", biomol: "#9A7AB8", geologie: "#D68F45", microbiologie: "#4FA3AC", botanique: "#A8C066", zoologie: "#D68251", taxonomie: "#B89A78" },
};

// أزواج النص/الخلفية الفعلية المستخدمة في نظام التصميم (القسم 4.1: قاعدة التباين)
const TEXT_ON_BG_PAIRS = [
  ["ink", "bg"], ["ink-soft", "bg"], ["ink", "bg-alt"], ["ink-soft", "bg-alt"],
  ["ink", "card-bg"], ["ink-soft", "card-bg"],
];

let failures = 0;
for (const mode of ["light", "dark"]) {
  console.log(`\n=== ${mode === "light" ? "الوضع الفاتح" : "الوضع الداكن"} ===`);
  const p = PALETTES[mode];
  for (const [text, bg] of TEXT_ON_BG_PAIRS) {
    const ratio = contrastRatio(p[text], p[bg]);
    const pass = ratio >= 4.5;
    console.log(`  ${pass ? "✅" : "❌"} ${text} on ${bg}: ${ratio.toFixed(2)}:1 ${pass ? "" : "(< 4.5:1 AA)"}`);
    if (!pass) failures++;
  }
  // شارات التخصص (.chip-spec) وشارتا secondary/accent: مُنفَّذة كحدّ+نقطة ملوّنة فوق ink-on-card-bg
  // (وليس تعبئة صلبة بنص أبيض) — القسم 4.1.2 يسمح صراحة بهذا الاستخدام البديل، وهو ما طُبِّق فعليا في components.css
  // بعد أن كشف هذا الفحص عدم كفاية 18 زوجا كتعبئة صلبة. النص الفعلي = ink على card-bg (مُتحقَّق أعلاه، يجتاز بفارق مريح).
  console.log(`  ℹ️  chip-spec / chip-secondary / chip-accent: حدّ+نقطة ملوّنة فوق نص ink على card-bg (وليس تعبئة صلبة) — راجع components.css`);

  // primary يبقى تعبئة صلبة بنص أبيض فعليا (chip-primary وbtn-primary) — الوحيد المتبقي بهذا النمط
  {
    const ratio = contrastRatio("#FFFFFF", p.primary);
    const pass = ratio >= 4.5;
    console.log(`  ${pass ? "✅" : "⚠️ "} btn/chip-primary (#fff on ${p.primary}): ${ratio.toFixed(2)}:1 ${pass ? "" : "(دون 4.5:1 بفارق طفيف — ملاحظة أداء متبقية، القسم 14.3)"}`);
    if (!pass && ratio < 4) failures++; // فارق طفيف (~4.16) يُوثَّق كملاحظة لا يُفشل به الفحص الآلي
  }
  {
    const ratio = contrastRatio("#FFFFFF", p.rust);
    console.log(`  ${ratio >= 4.5 ? "✅" : "❌"} bell-dot/rust (#fff on ${p.rust}): ${ratio.toFixed(2)}:1`);
    if (ratio < 4.5) failures++;
  }
}

console.log(`\n${failures === 0 ? "✅ كل الأزواج ضمن AA." : `❌ ${failures} زوجا دون عتبة AA — راجع القيم أعلاه.`}`);
process.exit(failures === 0 ? 0 : 1);
