import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function walk(dir, out = []) {
  for (const n of readdirSync(dir)) {
    if (n === 'node_modules' || n === '.git') continue;
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(html|js)$/.test(n)) out.push(p);
  }
  return out;
}

const htmlCopy = '&copy; 2026 Polimu. All rights reserved.';
const jsCopy = '\\u00a9 2026 Polimu. All rights reserved.';

for (const file of walk('.')) {
  let c = readFileSync(file, 'utf8');
  const before = c;

  // Normalize any footer copyright variants to a clean form
  c = c.replace(
    /<div>(?:©|c|&copy;|\\u00a9|A©|Ac)?\s*2026 Polimu\. All rights reserved\.<\/div>/g,
    `<div>${htmlCopy}</div>`
  );
  c = c.replace(
    /children:"(?:©|c|&copy;|\\u00a9|A©|Ac)?\s*2026 Polimu\. All rights reserved\."/g,
    `children:"${String.fromCharCode(0xa9)} 2026 Polimu. All rights reserved."`
  );

  if (c !== before) {
    writeFileSync(file, c);
    console.log('updated', file);
  }
}

const idx = readFileSync('index.html', 'utf8');
console.log('HTML:', idx.match(/<div>[^<]*2026 Polimu[^<]*<\/div>/)?.[0]);
const js = readFileSync('assets/SiteFooter-BCEgAcxb.js', 'utf8');
console.log('JS:', js.match(/children:"[^"]*2026 Polimu[^"]*"/)?.[0]);
console.log('codepoint:', [...js.match(/children:"([^"]*2026 Polimu[^"]*)"/)[1]].map(ch => ch.codePointAt(0).toString(16)));
