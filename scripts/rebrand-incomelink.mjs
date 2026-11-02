import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const ROOT = process.cwd();
const SKIP = new Set(['node_modules', '.git', 'scripts']);
const TEXT_EXTS = new Set(['.html', '.js', '.css', '.xml', '.txt', '.webmanifest', '.json', '.mjs']);

const OLD_REG = 'https://mula-prime.com/user/register.php?ref=Chatnow';
const NEW_REG = 'https://starhela.com/register.php?ref=Reigns';
const OLD_WA_CHANNEL = 'https://whatsapp.com/channel/0029Vb8Dg2q3GJP4Sr6aAT47';
const NEW_WA = 'https://wa.me/254116906441?text=Hello%20am%20interested%20in%20IncomeLink';
const NEW_EMAIL = 'mentorreigns@gmail.com';

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, files);
    else if (TEXT_EXTS.has(extname(name))) files.push(p);
  }
  return files;
}

function isHome(rel) {
  const n = rel.replace(/\\/g, '/');
  return n === 'index.html' || n.endsWith('/index.html') === false && n === 'index.html';
}

function transform(content, file) {
  let c = content;
  const rel = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');

  // Brand / domain (order matters: longer first)
  c = c.split('polimu.site').join('incomelink.site');
  c = c.split('Polimu.Site').join('incomelink.Site');
  c = c.split('Polimu').join('incomelink');
  c = c.split('polimu').join('incomelink');

  // Registration CTAs
  c = c.split(OLD_REG).join(NEW_REG);

  // WhatsApp: channel -> wa.me contact link
  c = c.split(OLD_WA_CHANNEL).join(NEW_WA);

  // Emails
  c = c.split('polimuhelpline@gmail.com').join(NEW_EMAIL);
  c = c.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, (m) => {
    if (m.includes('schema.org') || m.includes('w3.org')) return m;
    return NEW_EMAIL;
  });

  // Remove tel: links (keep wa.me URLs intact)
  c = c.replace(/href="tel:[^"]+"/g, `href="${NEW_WA}"`);
  c = c.replace(/tel:\+?\d+/g, NEW_WA);

  // Homepage SEO + hero + about + footer
  if (rel === 'index.html') {
    c = c.replace(
      /<title>[^<]*<\/title>/,
      '<title>incomelink – Official Get Paid to Chat Platform</title>'
    );
    c = c.replace(
      /name="description" content="[^"]*"/,
      'name="description" content="Join incomelink and get paid to chat with lonely foreigners. Instant withdrawals to M-Pesa, MoMo, bank accounts, and crypto."'
    );
    c = c.replace(
      /property="og:title" content="[^"]*"/,
      'property="og:title" content="incomelink – Official Get Paid to Chat Platform"'
    );
    c = c.replace(
      /property="og:description" content="[^"]*"/,
      'property="og:description" content="Join incomelink and get paid to chat with lonely foreigners. Instant withdrawals to M-Pesa, MoMo, bank accounts, and crypto."'
    );
    c = c.replace(
      /name="twitter:title" content="[^"]*"/,
      'name="twitter:title" content="incomelink – Official Get Paid to Chat Platform"'
    );
    c = c.replace(
      /name="twitter:description" content="[^"]*"/,
      'name="twitter:description" content="Join incomelink and get paid to chat with lonely foreigners. Instant withdrawals to M-Pesa, MoMo, bank accounts, and crypto."'
    );

    c = c.replace(/<h1 class="sr-only">[^<]*<\/h1>/, '<h1 class="sr-only">incomelink</h1>');
    c = c.replace(
      /<h2 class="font-display text-\[28px\] leading-\[1\.05\] font-extrabold tracking-tight text-text sm:text-4xl">[\s\S]*?<\/h2>/,
      '<h2 class="font-display text-[28px] leading-[1.05] font-extrabold tracking-tight text-text sm:text-4xl">incomelink</h2>'
    );
    c = c.replace(
      /(<p class="mx-auto mt-3 max-w-xl text-sm text-muted sm:text-base">)[^<]*(<\/p>)/,
      '$1Join thousands of people earning daily by chatting with lonely foreigners from around the world.$2'
    );

    // Homepage about/discover blurb
    c = c.replace(
      /(<p class="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">)incomelink(?: Site)?[\s\S]*?(<\/p>)/,
      '$1Join incomelink Site, the trusted platform where Africans and people around the world get paid to chat with lonely foreigners. Enjoy instant withdrawals to M-Pesa, MoMo, bank accounts or crypto. Over 80,000 users are earning daily.$2'
    );
    // Fallback if already partially branded
    c = c.replace(
      /Join incomelink Chat Site, the trusted platform[\s\S]*?earning daily\./,
      'Join incomelink Site, the trusted platform where Africans and people around the world get paid to chat with lonely foreigners. Enjoy instant withdrawals to M-Pesa, MoMo, bank accounts or crypto. Over 80,000 users are earning daily.'
    );
  }

  // About page
  if (rel === 'about/index.html') {
    c = c.replace(
      /(<p class="mt-4 text-base text-muted">)[^<]*(<\/p>)/,
      '$1Join incomelink Site, the trusted platform where Africans and people around the world get paid to chat with lonely foreigners. Enjoy instant withdrawals to M-Pesa, MoMo, bank accounts or crypto. Over 80,000 users are earning daily.$2'
    );
  }

  // Footer on all HTML
  if (rel.endsWith('.html')) {
    c = c.replace(
      /<div>(?:&copy;|©|c)\s*2026 incomelink\. All rights reserved\.<\/div>/g,
      '<div>&copy; 2026 incomelink. All rights reserved.</div>'
    );
    c = c.replace(
      /<div>(?:&copy;|©|c)\s*2026 Polimu\. All rights reserved\.<\/div>/g,
      '<div>&copy; 2026 incomelink. All rights reserved.</div>'
    );
    c = c.replace(
      /<div>(?:&copy;|©|c)?\s*2026 incomelink\. All rights reserved\.<\/div>/g,
      '<div>&copy; 2026 incomelink. All rights reserved.</div>'
    );
  }

  // SiteFooter JS copyright
  if (rel.endsWith('SiteFooter-BCEgAcxb.js')) {
    c = c.replace(
      /children:"(?:©|c|&copy;|\\u00a9)?\s*2026 [^"]*"/g,
      'children:"\u00a9 2026 incomelink. All rights reserved."'
    );
  }

  return c;
}

const files = walk(ROOT);
let changed = 0;
for (const file of files) {
  const before = readFileSync(file, 'utf8');
  const after = transform(before, file);
  if (after !== before) {
    writeFileSync(file, after, 'utf8');
    changed++;
    console.log('Updated', file.replace(ROOT + '\\', '').replace(ROOT + '/', ''));
  }
}
console.log('Files changed:', changed);
