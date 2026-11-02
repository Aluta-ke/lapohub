import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

function walk(d, a = []) {
  for (const n of readdirSync(d)) {
    if (n === 'node_modules' || n === '.git' || n === 'scripts') continue;
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p, a);
    else if (['.html', '.js', '.css', '.xml', '.txt', '.webmanifest', '.json'].includes(extname(n))) a.push(p);
  }
  return a;
}

for (const f of walk('.')) {
  const c = readFileSync(f, 'utf8');
  const m = c.match(/mailto:[^\s"'\\]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
  if (m) console.log(f, m);
}

// CTA button href samples
const html = readFileSync('index.html', 'utf8');
const hrefs = [...html.matchAll(/href="(https:[^"]+)"/g)].map((x) => x[1]);
const uniq = [...new Set(hrefs)];
console.log('unique external hrefs:', uniq);

const footer = readFileSync('assets/SiteFooter-BCEgAcxb.js', 'utf8');
console.log('footer wa:', footer.includes('0029VbDTUGz0Qeaqcx3rnw2m'));
console.log('footer reg:', footer.includes('mulaearn.com/register.php?ref=OkoaChat'));
console.log('js earn section:', readFileSync('assets/index-BA91RANk.js', 'utf8').includes('mulaearn.com/register.php?ref=OkoaChat'));
console.log('old okoachat.site bare link left?', (html.match(/href="https:\/\/okoachat\.site"/g) || []).length);
