const http = require("http");
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "public");
const types = { ".html": "text/html", ".jpg": "image/jpeg", ".css": "text/css" };
http.createServer((req, res) => {
  let rel = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (rel === "/") rel = "/index.html";
  const file = path.normalize(path.join(root, rel));
  const candidates = [file, path.join(file, "index.html")];
  const hit = candidates.find((c) => c.startsWith(root) && fs.existsSync(c) && fs.statSync(c).isFile());
  if (!hit) { res.writeHead(404, { "content-type": "text/plain" }); res.end("Not found"); return; }
  res.writeHead(200, { "content-type": types[path.extname(hit)] || "application/octet-stream" });
  res.end(fs.readFileSync(hit));
}).listen(process.env.PORT || 3000);
