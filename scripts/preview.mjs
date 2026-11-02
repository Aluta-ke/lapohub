import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json"
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.includes("..")) {
    res.writeHead(400);
    res.end("Bad request");
    return;
  }
  let file = path.join(root, pathname);
  if (pathname.endsWith("/")) file = path.join(file, "index.html");
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    file = path.join(root, "404.html");
    res.writeHead(404, { "content-type": types[".html"] });
    res.end(fs.readFileSync(file));
    return;
  }
  res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
  res.end(fs.readFileSync(file));
});

server.listen(3000, "127.0.0.1", () => {
  console.log("LapoHub preview at http://127.0.0.1:3000");
});
