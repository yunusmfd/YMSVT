// Service Worker بسيط: Stale-While-Revalidate لملفات /content (القسم 14.2ج، 11.2)
// لا يخزّن صفحات HTML مؤقتا (لتفادي تقديم نسخة قديمة من محتوى تربوي مُحدَّث)، فقط /content و/assets الساكنة
const CACHE_NAME = "nova-svt-v1";
const CACHEABLE_PREFIXES = ["/content/", "/assets/"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin) return;
  if (!CACHEABLE_PREFIXES.some((p) => url.pathname.startsWith(p))) return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cached) => {
        const network = fetch(event.request)
          .then((response) => {
            if (response && response.ok) cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })
    )
  );
});
