import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
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

const htmlCopy = '&copy; 2026 incomelink. All rights reserved.';
const jsCopy = '\u00a9 2026 incomelink. All rights reserved.';
const NEW_WA = 'https://wa.me/254116906441?text=Hello%20am%20interested%20in%20IncomeLink';
const NEW_REG = 'https://starhela.com/register.php?ref=Reigns';

for (const file of walk('.')) {
  let c = readFileSync(file, 'utf8');
  const before = c;

  // Normalize footers
  c = c.replace(/<div>(?:&copy;|©|c)\s*2026 incomelink\. All rights reserved\.<\/div>/g, `<div>${htmlCopy}</div>`);
  c = c.replace(/children:"(?:©|c|&copy;|\\u00a9)?\s*2026 incomelink\. All rights reserved\."/g, `children:"${jsCopy}"`);

  if (c !== before) {
    writeFileSync(file, c);
    console.log('updated', file);
  }
}

// Final verification
const bad = ['Polimu', 'polimu.site', 'mula-prime', 'whatsapp.com/channel', 'polimuhelpline', 'Chatnow'];
let issues = 0;
for (const file of walk('.')) {
  const c = readFileSync(file, 'utf8');
  for (const b of bad) {
    // allow polimu only if somehow in path - check content
    if (b === 'Polimu' && c.includes('Polimu')) {
      console.log('FOUND Polimu in', file);
      issues++;
    } else if (b !== 'Polimu' && c.includes(b)) {
      console.log('FOUND', b, 'in', file);
      issues++;
    }
  }
}

const html = readFileSync('index.html', 'utf8');
console.log('\n--- KEY CHECKS ---');
console.log('title:', html.match(/<title>[^<]+<\/title>/)?.[0]);
console.log('desc:', html.match(/name="description" content="[^"]+"/)?.[0]);
console.log('hero:', html.match(/<h2 class="font-display text-\[28px\][^>]*>[^<]+<\/h2>/)?.[0]);
console.log('sub:', html.match(/mx-auto mt-3 max-w-xl[^>]*>[^<]+/)?.[0]);
console.log('about:', html.match(/Join incomelink Site[^<]{0,60}/)?.[0]);
console.log('footer:', html.match(/<div>[^<]*2026 incomelink[^<]*<\/div>/)?.[0]);
console.log('reg links:', (html.match(/starhela\.com\/register\.php\?ref=Reigns/g) || []).length);
console.log('wa links:', (html.match(/wa\.me\/254116906441/g) || []).length);
console.log('channel left:', (html.match(/whatsapp\.com\/channel/g) || []).length);
console.log('domain:', (html.match(/incomelink\.site/g) || []).length);
console.log('Polimu left:', (html.match(/Polimu|polimu/g) || []).length);

const js = readFileSync('assets/SiteFooter-BCEgAcxb.js', 'utf8');
console.log('JS reg:', js.match(/https:\/\/[^"]*register[^"]*/)?.[0]);
console.log('JS wa:', js.match(/https:\/\/wa\.me\/[^"]*/)?.[0]);
console.log('JS footer:', js.match(/children:"[^"]*2026 incomelink[^"]*"/)?.[0]);

const contact = readFileSync('contact/index.html', 'utf8');
console.log('email:', contact.match(/mentorreigns@gmail\.com/)?.[0]);
console.log('about page:', readFileSync('about/index.html', 'utf8').match(/Join incomelink Site[^<]{0,50}/)?.[0]);
console.log(issues === 0 ? '\nCLEAN' : `\nIssues: ${issues}`);
