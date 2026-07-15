// Service Worker — القسم 14.2ج، 11.2
// كاشان منفصلان:
//  - CODE_CACHE: شيفرة الموقع (CSS/JS/مكتبات) — اسمه يحمل بصمة المحتوى (__BUILD_ID__ يُختم وقت البناء).
//    استراتيجية cache-first للسرعة؛ وعند أي تغيير فعلي في الشيفرة يتغيّر اسم الكاش فيُجلب كل شيء من جديد
//    (يحلّ مشكلة بقاء نسخة قديمة لدى الزوّار العائدين رغم كاش HTTP الطويل).
//  - DATA_CACHE: الصور والمحتوى وملفات manifest — stale-while-revalidate كي تتحدّث دون انتظار تحديث SW.
// لا تُخزَّن صفحات HTML إطلاقا (تبقى دائما طازجة عبر الشبكة).
const CODE_CACHE = "nova-svt-code-b0142cca19";
const DATA_CACHE = "nova-svt-data-v1";
const KEEP = [CODE_CACHE, DATA_CACHE];

const CODE_PREFIXES = ["/assets/css/", "/assets/js/", "/assets/vendor/"];
const DATA_PREFIXES = ["/assets/images/", "/content/", "/manifest/"];

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => !KEEP.includes(k)).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

function cacheFirst(request) {
  return caches.open(CODE_CACHE).then((cache) =>
    cache.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((res) => {
        if (res && res.ok) cache.put(request, res.clone());
        return res;
      });
    })
  );
}

function staleWhileRevalidate(request) {
  return caches.open(DATA_CACHE).then((cache) =>
    cache.match(request).then((cached) => {
      const network = fetch(request)
        .then((res) => {
          if (res && res.ok) cache.put(request, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin) return;
  if (CODE_PREFIXES.some((p) => url.pathname.startsWith(p))) {
    event.respondWith(cacheFirst(event.request));
  } else if (DATA_PREFIXES.some((p) => url.pathname.startsWith(p))) {
    event.respondWith(staleWhileRevalidate(event.request));
  }
});
