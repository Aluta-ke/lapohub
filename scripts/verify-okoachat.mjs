import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname, relative } from 'path';

const ROOT = process.cwd();
const SKIP = new Set(['node_modules', '.git', 'scripts']);

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, files);
    else if (['.html', '.js', '.css', '.xml', '.txt', '.webmanifest', '.json'].includes(extname(name)))
      files.push(p);
  }
  return files;
}

let incomelink = 0;
let leftovers = [];
const checks = {
  title: false,
  desc: false,
  about: false,
  hero: false,
  reg: 0,
  wa: 0,
  email: 0,
  footer: false,
  phone: 0,
  starhela: 0,
  oldWa: 0,
};

for (const file of walk(ROOT)) {
  const c = readFileSync(file, 'utf8');
  const rel = relative(ROOT, file);
  const m = c.match(/incomelink/gi);
  if (m) {
    incomelink += m.length;
    leftovers.push(`${rel}: ${m.length}`);
  }
  checks.reg += (c.match(/mulaearn\.com\/register\.php\?ref=OkoaChat/g) || []).length;
  checks.wa += (c.match(/whatsapp\.com\/channel\/0029VbDTUGz0Qeaqcx3rnw2m/g) || []).length;
  checks.email += (c.match(/franciscahmwende6@gmail\.com/g) || []).length;
  checks.phone += (c.match(/254\d{9}/g) || []).length;
  checks.starhela += (c.match(/starhela\.com/gi) || []).length;
  checks.oldWa += (c.match(/chat\.whatsapp\.com\/JtTO6y8EDvXGxYsjmlVuTd/g) || []).length;
  checks.oldWa += (c.match(/wa\.me\//g) || []).length;
}

const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
checks.title = html.includes('OkoaChat – Official Get Paid to Chat Platform');
checks.desc = html.includes(
  'Join OkoaChat and get paid to chat with lonely foreigners. Instant withdrawals to M-Pesa, MoMo, bank accounts, and crypto.'
);
checks.about = html.includes('Join OkoaChat Chat Site, the trusted platform');
checks.hero = html.includes('>OkoaChat</h2>') && html.includes('Join thousands of people earning daily by chatting with lonely foreigners from around the world.');
checks.footer = html.includes('© 2026 OkoaChat. All rights reserved.');

const about = readFileSync(join(ROOT, 'about/index.html'), 'utf8');
const aboutOk = about.includes('Join OkoaChat Chat Site, the trusted platform');

console.log(JSON.stringify({ incomelink, leftovers, checks, aboutOk }, null, 2));
console.log('robots', readFileSync(join(ROOT, 'robots.txt'), 'utf8').includes('okoachat.site'));
console.log('sitemap', readFileSync(join(ROOT, 'sitemap.xml'), 'utf8').includes('okoachat.site'));
console.log('manifest', readFileSync(join(ROOT, 'manifest.webmanifest'), 'utf8').includes('OkoaChat'));
