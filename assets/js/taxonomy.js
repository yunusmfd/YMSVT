// مصدر الحقيقة الوحيد لأكواد المستويات/المسالك (القسم 3.2.1) — يُستورَد من المتصفح وNode معا
export const NIVEAUX = {
  "1ac": { ar: "الأولى إعدادي", fr: "1re année collège", cycle: "iaadadi" },
  "2ac": { ar: "الثانية إعدادي", fr: "2e année collège", cycle: "iaadadi" },
  "3ac": { ar: "الثالثة إعدادي", fr: "3e année collège", cycle: "iaadadi" },
  tc: { ar: "الجذع المشترك", fr: "Tronc commun", cycle: "thanawi-taahili" },
  "1bac": { ar: "الأولى باك", fr: "1re année Bac", cycle: "thanawi-taahili" },
  "2bac": { ar: "الثانية باك", fr: "2e année Bac", cycle: "thanawi-taahili" },
};

export const FILIERES = {
  tcs: { ar: "الجذع المشترك علمي", fr: "Tronc commun scientifique", code: "TCS", niveau: "tc" },
  tcl: { ar: "الجذع المشترك أدبي", fr: "Tronc commun lettres", code: "TCL", niveau: "tc" },
  "1bac-se": { ar: "الأولى باك علوم تجريبية", fr: "1re Bac Sciences expérimentales", code: "1BAC SE", niveau: "1bac" },
  "1bac-l": { ar: "الأولى باك آداب", fr: "1re Bac Lettres", code: "1BAC L", niveau: "1bac" },
  "1bac-sm": { ar: "الأولى باك علوم رياضية", fr: "1re Bac Sciences maths", code: "1BAC SM", niveau: "1bac" },
  "2bac-svt": { ar: "الثانية باك علوم الحياة والأرض", fr: "2e Bac SVT", code: "2BAC SVT", niveau: "2bac" },
  "2bac-pc": { ar: "الثانية باك علوم فيزيائية وكيميائية", fr: "2e Bac PC", code: "2BAC PC", niveau: "2bac" },
  "2bac-sm": { ar: "الثانية باك علوم رياضية", fr: "2e Bac Sciences maths", code: "2BAC SM", niveau: "2bac" },
  "2bac-sa": { ar: "الثانية باك علوم زراعية", fr: "2e Bac Sciences agronomiques", code: "2BAC SA", niveau: "2bac" },
};

export const NIVEAU_CODES = {
  "1ac": "1AC",
  "2ac": "2AC",
  "3ac": "3AC",
  tc: "TC",
};

export function niveauLabel(niveau, lang) {
  return (NIVEAUX[niveau] && NIVEAUX[niveau][lang]) || niveau;
}
export function filiereLabel(filiere, lang) {
  return (FILIERES[filiere] && FILIERES[filiere][lang]) || filiere;
}
export function isSecondaire(niveau) {
  return !["1ac", "2ac", "3ac"].includes(niveau);
}
