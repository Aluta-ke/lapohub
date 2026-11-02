import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "scripts") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".html")) htmlFiles.push(full);
  }
}
walk(root);

const missing = [];
const external = new Set();
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const ref of refs) {
    if (ref.startsWith("mailto:") || ref.startsWith("http://") || ref.startsWith("https://") || ref.startsWith("#") || ref.startsWith("data:")) {
      if (ref.startsWith("http")) external.add(ref.split("?")[0]);
      continue;
    }
    const clean = ref.split("?")[0].split("#")[0];
    const rel = clean.startsWith("/") ? clean.slice(1) : clean;
    const target = path.join(root, rel);
    const index = path.join(target, "index.html");
    if (!fs.existsSync(target) && !fs.existsSync(index)) missing.push(`${path.relative(root, file)} -> ${ref}`);
  }
}
console.log("pages", htmlFiles.length);
console.log("missing", missing.length);
missing.forEach((line) => console.log(line));
console.log("external");
[...external].sort().forEach((line) => console.log(line));
