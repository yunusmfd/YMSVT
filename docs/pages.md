# خريطة صفحات منصة Nova SVT

توثيق شامل لكل صفحات المنصة: الثابتة (المُصيَّرة وقت البناء ببنية كاملة) والمولَّدة (نمط واحد يُطبَّق على كل عنصر محتوى). كل صفحة ثنائية اللغة (عربي/فرنسي) في ملف HTML واحد، يُبدَّل بينهما عبر `<html lang>` دون إعادة تحميل. آخر تحديث: يعكس حالة الكود في فرع `main` بعد إصلاحات النشر/الأداء الأخيرة (تقسيم manifest، الصفحة 404، إلخ).

---

## 1. الصفحات الثابتة (شكل واحد لكل رابط)

| الرابط | العنوان | ملف الجسم | سكربت التفاعل | ملاحظات |
|---|---|---|---|---|
| `/` | الرئيسية | `homeBody()` | `pages/home.js` | JSON-LD `EducationalOrganization`+`WebSite` |
| `/lecons/` | الدروس | `leconsListBody()` | `pages/lecons-list.js` | فلاتر منسدلة |
| `/devoirs-examens/` | الفروض والامتحانات | `examsListBody()` | `pages/exams-list.js` | تبويبان رئيسيان |
| `/labo-virtuel/` | المختبر الافتراضي | `laboListBody()` | `pages/labo-list.js` | 3 أنواع تجارب |
| `/encyclopedie/` | الموسوعة العلمية (مجلّة) | `encyclopedieHubBody()` | — (ثابتة) | 11 قسما مرقّمة |
| `/encyclopedie/articles/` | آفاق ومقالات علمية | `encyArticlesListBody()` | `pages/ency-articles.js` | |
| `/encyclopedie/scientifiques/` | العلماء | `encyScientifiquesListBody()` | `pages/ency-scientifiques.js` | |
| `/encyclopedie/decouvertes/` | الاكتشافات | `encyDecouvertesListBody()` | `pages/ency-decouvertes.js` | مرتّبة تنازليا بالسنة |
| `/encyclopedie/glossaire/` | معجم المصطلحات | `encyGlossaireListBody()` | `pages/ency-glossaire.js` | مرتّب أبجديا |
| `/encyclopedie/chronologies/` | الخطوط الزمنية | `encyChronologiesListBody()` | `pages/ency-chronologies.js` | |
| `/encyclopedie/saviez-vous/` | هل تعلم؟ | `encySaviezVousListBody()` | `pages/ency-saviez.js` | |
| `/encyclopedie/galerie/` | الرسوم والخرائط العلمية | `encyGalerieListBody()` | `pages/ency-galerie.js` | |
| `/encyclopedie/organismes/` | الكائنات الحية | `encyOrganismesListBody()` | `pages/ency-organismes.js` | |
| `/encyclopedie/roches-mineraux/` | الصخور والمعادن | `encyRochesMineralListBody()` | `pages/ency-roches.js` | |
| `/encyclopedie/geologie-maroc/` | جيولوجيا المغرب | `encyGeologieMarocListBody()` | `pages/ency-geologie-maroc.js` | |
| `/encyclopedie/experiences-historiques/` | التجارب العلمية التاريخية | `encyExperiencesHistoriquesListBody()` | `pages/ency-experiences.js` | |
| `/revision/` | فضاء المراجعة | `revisionBody()` | `pages/revision.js` | 3 أقسام رئيسية |
| `/mon-espace/` | فضاء الطالب | `monEspaceBody()` | `pages/mon-espace.js` | localStorage فقط |
| `/blog/` | المدونة | `blogListBody()` | `pages/blog-list.js` | |
| `/a-propos/` | عن المنصة | `aproposBody()` | — | نصّية بسيطة |
| `/contact/` | اتصل بنا | `contactBody()` | — | Netlify Forms |
| `/confidentialite/` | سياسة الخصوصية | `confidentialiteBody()` | — | نصّية بسيطة |
| `/404.html` | الصفحة غير موجودة | `notFoundBody()` | — | `noindex`، في الجذر |

كل هذه الصفحات تُولَّد بواسطة `scripts/build-pages.js` عبر مصفوفة `pages` واحدة (ما عدا 404 المكتوبة مباشرة إلى الجذر).

### 1.1 الصفحة الرئيسية (`/`)
4 أقسام بترتيب النزول:
1. **Hero مبسّط**: عنوان مركزي بلونين (`علوم الحياة **و الأرض**`)، نص تمهيدي، زرّا دعوة (تصفّح الموسوعة / ابدأ التعلّم).
2. **"كل ما تحتاجه للنجاح"**: شبكة 4 بطاقات مزايا (ملخصات للتحميل، اختبارات فورية، رسوم تخطيطية، فيديوهات شرح) بأيقونة ملوّنة لكل بطاقة.
3. **"أحدث الدروس والمراجعات"**: أحدث 3 دروس (صورة مصغّرة + شارة تخصّص ملوّنة في الزاوية + مستوى/مدة + وصف)، مصدرها `manifest/home.json` (حمولة مخفَّفة ~3KB بدل جلب كل الدروس).
4. **بطاقة "هل تعلم؟" المميّزة**: علامة اقتباس زخرفية كبيرة، أيقونة مصباح، زر مشاركة (Web Share API مع نسخ للحافظة كبديل).

### 1.2 الدروس (`/lecons/`)
فلاتر منسدلة متتالية: **المستوى** → **المسلك** (يظهر فقط للثانوي التأهيلي: TC/1BAC/2BAC) → **الدورة** → **الوحدة** (تُبنى ديناميكيا حسب الفلاتر السابقة). الدروس تُعرض مجمَّعة حسب الوحدة، كل مجموعة ببطاقات الدروس مرتّبة بترتيبها داخل الوحدة. يدعم فتح مستوى مباشرة عبر الهاش (`#2bac`).

### 1.3 الفروض والامتحانات (`/devoirs-examens/`)
قسمان رئيسيان (تبويب علوي):
- **الفروض**: فلاتر مستوى + مسلك (عند الاقتضاء) + دورة.
- **الامتحانات**: مقصورة على المستويين الإشهاديين فقط — **3AC** (تبويب فرعي: محلي/الدورة1، جهوي/الدورة2) و**2BAC** (امتحان وطني، بفلتر مسلك من 4 مسالك).

### 1.4 المختبر الافتراضي (`/labo-virtuel/`)
شبكة تجارب بتبويبات حسب النوع: 🔬 تفاعلي (iframe HTML/JS)، 🎬 فيديو، ✏️ رسوم متحركة (SVG). كل تجربة لها صفحة تفاصيل مستقلة (انظر 2.5).

### 1.5 مجلّة الموسوعة (`/encyclopedie/`)
صفحة هبوط "مجلة" بمصطلح "مجلّة Nova SVT"، تعرض 11 قسما مرقّمة (01–11) بترتيب ثابت:
`📖 معجم المصطلحات` → `🔬 العلماء` → `💡 الاكتشافات` → `🧬 الكائنات الحية` → `🪨 الصخور والمعادن` → `🌍 جيولوجيا المغرب` → `🗺️ الرسوم والخرائط العلمية` → `🧪 التجارب العلمية التاريخية` → `📅 الخطوط الزمنية` → `📰 آفاق ومقالات علمية` → `✨ هل تعلم؟` (قسم إضافي).

### 1.6 فضاء المراجعة (`/revision/`)
3 أقسام رئيسية (تبويب علوي):
- **مراجعة الدروس**: نفس منظومة فلاتر `/lecons/` بالضبط (مستوى/مسلك/دورة/وحدة)، مع تبويبات فرعية للأنواع الأربعة: ملخصات، خرائط ذهنية، بطاقات، اختبارات وثائقية.
- **الاستعداد للفروض**: فلاتر مستوى/مسلك/دورة (نفس بنية صفحة الامتحانات).
- **الاستعداد للامتحانات**: نفس القيد الإشهادي (3AC محلي/جهوي، 2BAC وطني حسب المسلك).

### 1.7 فضاء الطالب (`/mon-espace/`)
لا تسجيل دخول ولا خادم خلفي — التقدّم الدراسي (نتائج الاختبارات، التفضيلات) محفوظ بالكامل في `localStorage` للمتصفح المحلي فقط (مذكور صراحة في سياسة الخصوصية).

### 1.8 صفحات نصّية بسيطة
`/a-propos/`، `/contact/` (نموذج Netlify Forms بدون honeypot)، `/confidentialite/` — عمود نص واحد بلا محتوى ديناميكي.

---

## 2. أنماط الصفحات المولَّدة (نمط واحد × N عنصر محتوى)

هذه الصفحات تُصيَّر مسبقا وقت البناء عبر `scripts/prerender.js` — HTML كامل ومملوء فعليا (ليس هيكلا فارغا يُملأ بجافاسكربت)، إلزامي لأغراض الفهرسة.

### 2.1 صفحة الدرس الفردي
**الرابط**: `/lecons/{المسلك}/{slug-الوحدة}/{slug-الدرس}/`
**القالب**: `lessonDetailBody()` في `templates.js`
**البنية**:
- شريط تقدّم قراءة أعلى الصفحة (fixed).
- شريط معلومات الدرس (مستوى، مدة، دورة...).
- فهرس محاور جانبي Sticky مع Scrollspy.
- محاور الدرس: بلوكات متنوعة (فقرة، صورة SVG أصلية، فيديو، رابط مختبر افتراضي، أطر تربوية بـ7 أنواع بصرية موحّدة، جدول مقارنة، رابط معجمي `{{terme:id}}`، "هل تعلم؟").
- اختبار QCM تفاعلي يكشف سؤالا تلو الآخر مع تصحيح فوري وتبرير.
- تنقّل سابق/تالي بين دروس نفس الوحدة + قائمة "دروس هذه الوحدة" الجانبية.
- زر طباعة/تنزيل PDF.
- بيانات `LearningResource` JSON-LD (مجاني، بالصورة والتاريخ).
- يُحمَّل `render-engine.js` لتفعيل الاختبار/الفهرس/شريط التقدّم.

### 2.2 صفحة فهرس الوحدة
**الرابط**: `/lecons/{المسلك}/{slug-الوحدة}/`
**القالب**: `uniteDetailBody()`
تعرض عنوان الوحدة وقائمة كل دروسها مرتّبة بترقيم دائري، مع رابط لكل درس.

### 2.3 صفحات تفاصيل الموسوعة (11 نوعا)
كل نوع له قالب تفاصيل مستقل، لكنها تشترك نمط الرابط `/encyclopedie/{النوع}/{id}/`:

| النوع | الرابط | القالب |
|---|---|---|
| مقال | `/encyclopedie/articles/{id}/` | `articleDetailBody()` |
| مصطلح معجمي | `/encyclopedie/glossaire/{id}/` | `glossaireDetailBody()` |
| عالِم | `/encyclopedie/scientifiques/{id}/` | `scientifiqueDetailBody()` |
| اكتشاف | `/encyclopedie/decouvertes/{id}/` | `decouverteDetailBody()` |
| خط زمني | `/encyclopedie/chronologies/{id}/` | `chronologieDetailBody()` |
| هل تعلم | `/encyclopedie/saviez-vous/{id}/` | `saviezVousDetailBody()` |
| رسم/خريطة | `/encyclopedie/galerie/{id}/` | `galerieDetailBody()` |
| كائن حي | `/encyclopedie/organismes/{id}/` | `organismeDetailBody()` |
| صخرة/معدن | `/encyclopedie/roches-mineraux/{id}/` | `rocheMineralDetailBody()` |
| موقع جيولوجي مغربي | `/encyclopedie/geologie-maroc/{id}/` | `geologieMarocDetailBody()` |
| تجربة تاريخية | `/encyclopedie/experiences-historiques/{id}/` | `experienceHistoriqueDetailBody()` |

المقالات فقط تحمل بيانات `Article` JSON-LD (النوع الوحيد المطابق لمخطط CreativeWork المهيكل بأمان).

### 2.4 صفحات المدونة
**الرابط**: `/blog/{id}/`
**القالب**: `articleDetailBody({kind:"blog"})` — يعيد استخدام قالب المقال. مع JSON-LD نوع `Article`.

### 2.5 صفحات تجارب المختبر الافتراضي
**الرابط**: `/labo-virtuel/{id}/`
تُولَّد في `build-pages.js` (لا `prerender.js`) عبر `virtualLabDetailBody()`. الوسيط يختلف حسب النوع:
- `interactif` → `<iframe>` من `/content/virtual-lab/{id}/index.html`.
- `video` → `<video>` بمعاينة كسولة.
- `animation` → SVG مضمَّن مباشرة أو صورة.

### 2.6 صفحات ملخّصات المراجعة (كمقال مبسّط)
**الرابط**: يُبنى عبر `collectResumeRoutes()` تحت `/revision/resumes/...`
تُعرَض ملخّصات الدروس (نوع `resumes` من محتوى المراجعة) بنفس قالب المقال (`articleDetailBody({kind:"resume"})`).

---

## 3. الأصول المشتركة عبر كل الصفحات

- **الرأس/التذييل**: `renderNavbar()` / `renderFooter()` في `scripts/lib/partials.js` — نافبار بشبكة CSS تُوسِّط عناصر التنقّل الرئيسية وتُبقي أزرار الإجراء (بحث/لغة/وضع ليلي/إشعارات/فضاء الطالب) في الجانب المقابل للشعار.
- **بيانات المحتوى وقت التصفح**: `manifest/{lecons,exams,virtual-lab,encyclopedia,revision,blog,home}.json` — كل صفحة قائمة تجلب قسمها فقط عبر `fetchSection(name)` بدل ملف واحد ضخم.
- **الفهرسة**: `search-index.json` (بحث Overlay)، `sitemap.xml`، `glossary-index.json` (تلميحات الروابط المعجمية).
- **Service Worker** (`/sw.js`، نطاقه الجذر): كاش شيفرة مبصوم (cache-first، يتجدّد تلقائيا مع كل تغيير CSS/JS فعلي) + كاش بيانات (صور/محتوى/manifest، stale-while-revalidate).
- **البيانات المهيكلة**: `EducationalOrganization`+`WebSite` في الرئيسية، `LearningResource` في كل درس، `Article` في المقالات/المدونة.

---

## 4. إحصاء المحتوى الحالي (عيّنة توضيحية)

| القسم | العدد الحالي |
|---|---|
| الدروس | 21 |
| الفروض/الامتحانات | 9 |
| تجارب المختبر الافتراضي | 3 |
| مقالات الموسوعة | 2 |
| العلماء | 3 |
| الاكتشافات | 3 |
| مصطلحات المعجم | 29 |
| الخطوط الزمنية | 1 |
| هل تعلم | 3 |
| الرسوم/الخرائط | 3 |
| الكائنات الحية | 4 |
| الصخور والمعادن | 4 |
| مواقع جيولوجيا المغرب | 4 |
| التجارب التاريخية | 4 |
| ملخّصات المراجعة | 3 |
| خرائط ذهنية | 2 |
| بطاقات مراجعة | 8 |
| اختبارات وثائقية | 2 |
| مقالات المدونة | 2 |

> ⚠️ هذا محتوى عيّنة توضيحية للمرحلة الأولى، ويحتاج مراجعة أستاذ مادة قبل اعتماده رسميا في الاستعمال الفعلي.
