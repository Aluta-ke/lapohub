import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join, extname, relative } from 'path';

function walk(d, a = []) {
  for (const n of readdirSync(d)) {
    if (n === 'node_modules' || n === '.git' || n === 'scripts') continue;
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p, a);
    else if (['.html', '.js', '.css', '.xml', '.txt', '.webmanifest', '.json'].includes(extname(n))) a.push(p);
  }
  return a;
}

const bad = [];
for (const f of walk('.')) {
  const c = readFileSync(f, 'utf8');
  for (const pat of [
    /incomelink/gi,
    /polimu/gi,
    /flitchat/gi,
    /imochat/gi,
    /starhela/gi,
    /mula-prime/gi,
    /wa\.me\//g,
    /chat\.whatsapp\.com/g,
    /254\d{9}/g,
    /mentorreigns@/gi,
    /polimuhelpline@/gi,
  ]) {
    if (pat.test(c)) bad.push(`${relative('.', f)} :: ${pat}`);
  }
}
console.log('bad leftovers', bad);

const html = readFileSync('index.html', 'utf8');
console.log('nav brand sample:');
const ni = html.indexOf('OkoaChat');
console.log(html.slice(ni, ni + 80));
console.log('title:', (html.match(/<title>[^<]+<\/title>/) || [])[0]);
console.log('hero h2:', (html.match(/text-\[28px\][^>]*>[^<]+/) || [])[0]);
console.log('footer html:', html.includes('&copy; 2026 OkoaChat. All rights reserved.'));
console.log('footer js:', readFileSync('assets/SiteFooter-BCEgAcxb.js', 'utf8').includes('© 2026 OkoaChat. All rights reserved.'));

// Ensure contact shows the new email if there's a visible email field empty
const contact = readFileSync('contact/index.html', 'utf8');
console.log('contact email present:', contact.includes('franciscahmwende6@gmail.com'));
console.log('contact wa:', contact.includes('0029VbDTUGz0Qeaqcx3rnw2m'));
