import { readFileSync, readdirSync, statSync } from 'fs';
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

const needles = ['Polimu', 'polimu.site', 'mula-prime', 'whatsapp.com/channel', 'polimuhelpline', 'ref=Chatnow', 'tel:'];
let issues = 0;
for (const file of walk('.')) {
  const c = readFileSync(file, 'utf8');
  for (const n of needles) {
    if (c.includes(n)) {
      // tel: appears in framework form input type lists — ignore type:tel
      if (n === 'tel:' && /tel:!0|tel:"|type.*tel/.test(c) && !/href="tel:/.test(c) && !/tel:\+?\d/.test(c)) continue;
      console.log('LEFTOVER', n, 'in', file);
      issues++;
    }
  }
}

const html = readFileSync('index.html', 'utf8');
console.log('title:', html.match(/<title>[^<]+<\/title>/)?.[0]);
console.log('hero:', html.match(/<h2 class="font-display text-\[28px\][^>]*>[^<]+<\/h2>/)?.[0]);
console.log('header brand:', html.match(/incomelink<span class="text-coral">\.Site<\/span>/)?.[0]);
console.log('footer:', html.match(/<div>&copy; 2026 incomelink\. All rights reserved\.<\/div>/)?.[0]);
console.log('reg:', (html.match(/starhela\.com\/register\.php\?ref=Reigns/g) || []).length);
console.log('wa:', (html.match(/wa\.me\/254116906441\?text=Hello%20am%20interested%20in%20IncomeLink/g) || []).length);
console.log('visible phone text 254116906441 outside href?:', (() => {
  const stripped = html.replace(/href="[^"]*254116906441[^"]*"/g, '');
  return stripped.includes('254116906441');
})());
console.log(issues === 0 ? 'CLEAN' : `Issues: ${issues}`);
