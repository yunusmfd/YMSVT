// خادم ساكن بسيط للتطوير/التحقق المحلي فقط (بدون تبعيات) — ليس جزءا من خط أنابيب Netlify
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PORT = process.env.PORT || 8080;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".pdf": "application/pdf",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
};

http
  .createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath.endsWith("/")) urlPath += "index.html";
    let filePath = path.join(ROOT, urlPath);

    fs.stat(filePath, (err, stat) => {
      if (err || !stat.isFile()) {
        // محاولة index.html داخل المسار كصفحة نظيفة الرابط
        const altPath = path.join(ROOT, urlPath, "index.html");
        fs.readFile(altPath, (err2, data) => {
          if (err2) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("404 — الصفحة غير موجودة");
            return;
          }
          res.writeHead(200, { "Content-Type": MIME[".html"] });
          res.end(data);
        });
        return;
      }
      const ext = path.extname(filePath);
      fs.readFile(filePath, (err3, data) => {
        if (err3) {
          res.writeHead(500);
          res.end("500");
          return;
        }
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
        res.end(data);
      });
    });
  })
  .listen(PORT, () => {
    console.log(`Nova SVT dev server → http://localhost:${PORT}`);
  });
