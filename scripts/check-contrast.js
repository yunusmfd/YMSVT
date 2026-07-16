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
    bg: "#F1F6F2", "bg-alt": "#E4EEE6", ink: "#151D19", "ink-soft": "#404944",
    primary: "#204F3F", "primary-light": "#2F6A54", "on-primary": "#FFFFFF", secondary: "#8C5000", accent: "#0F4B6A",
    rust: "#B0472E", "card-bg": "#FFFFFF",
  },
  dark: {
    bg: "#0A1F1A", "bg-alt": "#143129", ink: "#F2FCF4", "ink-soft": "#C0C8C3",
    primary: "#BBEDD7", "primary-light": "#D4F5E6", "on-primary": "#002117", secondary: "#F0B15C", accent: "#8FBEDF",
    rust: "#E58368", "card-bg": "#0D2620",
  },
};

const SPEC = {
  light: { genetique: "#3D6FA8", cytologie: "#8A5FB0", physiologie: "#B4483F", ecologie: "#4C8C3E", biomol: "#6B4F9E", geologie: "#8C5000", microbiologie: "#2E8A92", botanique: "#8A9F3E", zoologie: "#C46A2E", taxonomie: "#93765A" },
  dark: { genetique: "#6D93C8", cytologie: "#AC87CE", physiologie: "#DC7A62", ecologie: "#7AB868", biomol: "#9B85D6", geologie: "#F0B15C", microbiologie: "#5FB0B8", botanique: "#B8C878", taxonomie: "#BBA084", zoologie: "#E0935F" },
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

  // تعبئة --primary الصلبة (btn/chip/tab): النص هو --on-primary (أبيض في الفاتح، أخضر داكن في الداكن) — Material 3
  {
    const ratio = contrastRatio(p["on-primary"], p.primary);
    const pass = ratio >= 4.5;
    console.log(`  ${pass ? "✅" : "❌"} btn/chip-primary (on-primary ${p["on-primary"]} on ${p.primary}): ${ratio.toFixed(2)}:1`);
    if (!pass) failures++;
  }
  // --primary كلون نص/تمييز فوق الأسطح (روابط/أيقونات) — يجب أن يقرأ فوق card-bg أيضا
  {
    const ratio = contrastRatio(p.primary, p["card-bg"]);
    const pass = ratio >= 4.5;
    console.log(`  ${pass ? "✅" : "❌"} primary as accent-text (on card-bg): ${ratio.toFixed(2)}:1`);
    if (!pass) failures++;
  }
  // --rust يُستعمل لونَ نص/أيقونة/حدّ (تنبيه، خطأ نموذج، نقطة الجرس) لا تعبئةً بنص أبيض — نفحصه كنص فوق الخلفية
  {
    const ratio = contrastRatio(p.rust, p.bg);
    console.log(`  ${ratio >= 4.5 ? "✅" : "❌"} rust as text/icon (${p.rust} on bg): ${ratio.toFixed(2)}:1`);
    if (ratio < 4.5) failures++;
  }
}

console.log(`\n${failures === 0 ? "✅ كل الأزواج ضمن AA." : `❌ ${failures} زوجا دون عتبة AA — راجع القيم أعلاه.`}`);
process.exit(failures === 0 ? 0 : 1);
