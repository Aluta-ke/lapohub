import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join, extname } from 'path';

function walk(dir, out = []) {
  for (const n of readdirSync(dir)) {
    if (n === 'node_modules' || n === '.git' || n === 'scripts') continue;
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (['.html', '.js', '.xml', '.txt', '.webmanifest', '.json'].includes(extname(n))) out.push(p);
  }
  return out;
}

const bad = [
  'ImoChat', 'imochat', 'FlitChat', 'flitchat',
  'star-hela', 'starhela.com', 'wa.me/', '254798106328', '254707156110',
  'MartinKe', 'FLIRTCHAT', 'MENTORMACKY',
];

let issues = 0;
for (const file of walk('.')) {
  const c = readFileSync(file, 'utf8');
  for (const b of bad) {
    if (c.includes(b)) {
      console.log('FOUND', b, 'in', file);
      issues++;
    }
  }
}
console.log(issues === 0 ? 'CLEAN: no leftover brand/phone/old links' : `Issues: ${issues}`);

// Ensure title uses proper dash character
let html = readFileSync('index.html', 'utf8');
html = html.replace(
  /<title>Polimu\s*[-–—]\s*Official Get Paid to Chat Platform<\/title>/,
  '<title>Polimu – Official Get Paid to Chat Platform</title>'
);
html = html.replace(
  /content="Polimu\s*[-–—]\s*Official Get Paid to Chat Platform"/g,
  'content="Polimu – Official Get Paid to Chat Platform"'
);
writeFileSync('index.html', html);

console.log('title:', html.match(/<title>[^<]+<\/title>/)?.[0]);
console.log('description:', html.match(/name="description" content="[^"]+"/)?.[0]);
console.log('hero:', html.match(/<h2 class="font-display text-\[28px\][^>]*>[^<]+<\/h2>/)?.[0]);
console.log('footer:', html.match(/<div>(?:&copy;|©) 2026 Polimu\. All rights reserved\.<\/div>/)?.[0]);
