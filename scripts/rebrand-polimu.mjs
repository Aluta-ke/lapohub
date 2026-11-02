import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const ROOT = process.cwd();
const SKIP = new Set(['node_modules', '.git', 'scripts']);
const TEXT_EXTS = new Set(['.html', '.js', '.css', '.xml', '.txt', '.webmanifest', '.json', '.mjs']);

const OLD_REG = 'https://star-hela.com/register.php?ref=MartinKe';
const NEW_REG = 'https://mula-prime.com/user/register.php?ref=Chatnow';
const OLD_WA = /https:\/\/wa\.me\/254798106328[^"'\s]*/g;
const NEW_WA = 'https://whatsapp.com/channel/0029Vb8Dg2q3GJP4Sr6aAT47';

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

function transform(content, file) {
  let c = content;
  const rel = file.replace(ROOT + '\\', '').replace(ROOT + '/', '');

  // Brand / domain (order matters)
  c = c.split('imochat.site').join('polimu.site');
  c = c.split('ImoChat').join('Polimu');
  c = c.split('imochat').join('polimu');
  c = c.split('flitchat.site').join('polimu.site');
  c = c.split('FlitChat').join('Polimu');
  c = c.split('flitchat').join('polimu');

  // Registration CTAs
  c = c.split(OLD_REG).join(NEW_REG);

  // WhatsApp phone links -> channel (Contact Us / social / banner)
  c = c.replace(OLD_WA, NEW_WA);

  // Remove leftover phone numbers as visible/link text
  c = c.split('254798106328').join('');
  c = c.replace(/tel:[+\d]+/g, NEW_WA);

  // Homepage-specific SEO + hero + about + footer
  if (rel.endsWith('index.html') && !rel.includes('\\') && !rel.includes('/about') && !rel.includes('/contact') && !rel.includes('/privacy') && !rel.includes('/terms')) {
    c = c.replace(
      /<title>[^<]*<\/title>/,
      '<title>Polimu – Official Get Paid to Chat Platform</title>'
    );
    c = c.replace(
      /name="description" content="[^"]*"/,
      'name="description" content="Join Polimu and get paid to chat with lonely foreigners. Instant withdrawals to M-Pesa, MoMo, bank accounts, and crypto."'
    );
    c = c.replace(
      /property="og:title" content="[^"]*"/,
      'property="og:title" content="Polimu – Official Get Paid to Chat Platform"'
    );
    c = c.replace(
      /property="og:description" content="[^"]*"/,
      'property="og:description" content="Join Polimu and get paid to chat with lonely foreigners. Instant withdrawals to M-Pesa, MoMo, bank accounts, and crypto."'
    );
    c = c.replace(
      /name="twitter:title" content="[^"]*"/,
      'name="twitter:title" content="Polimu – Official Get Paid to Chat Platform"'
    );
    c = c.replace(
      /name="twitter:description" content="[^"]*"/,
      'name="twitter:description" content="Join Polimu and get paid to chat with lonely foreigners. Instant withdrawals to M-Pesa, MoMo, bank accounts, and crypto."'
    );

    // Hero title + subtitle
    c = c.replace(
      /<h1 class="sr-only">[^<]*<\/h1>/,
      '<h1 class="sr-only">Polimu</h1>'
    );
    c = c.replace(
      /<h2 class="font-display text-\[28px\] leading-\[1\.05\] font-extrabold tracking-tight text-text sm:text-4xl">[\s\S]*?<\/h2>/,
      '<h2 class="font-display text-[28px] leading-[1.05] font-extrabold tracking-tight text-text sm:text-4xl">Polimu</h2>'
    );
    c = c.replace(
      /(<p class="mx-auto mt-3 max-w-xl text-sm text-muted sm:text-base">)[^<]*(<\/p>)/,
      '$1Join thousands of people earning daily by chatting with lonely foreigners from around the world.$2'
    );

    // Discover / About blurb on homepage
    c = c.replace(
      /(<p class="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">)Polimu Site is Kenya[\s\S]*?(<\/p>)/,
      '$1Join Polimu Chat Site, the trusted platform where Africans and people around the world get paid to chat with lonely foreigners. Enjoy instant withdrawals to M-Pesa, MoMo, bank accounts or crypto. Over 80,000 users are earning daily.$2'
    );

    // Footer copyright
    c = c.replace(/>© Polimu Site</, '>© 2026 Polimu. All rights reserved.<');
    c = c.replace(/>© Polimu</, '>© 2026 Polimu. All rights reserved.<');
  }

  // Footer on all HTML pages
  if (rel.endsWith('.html')) {
    c = c.replace(/>© Polimu Site</g, '>© 2026 Polimu. All rights reserved.<');
    c = c.replace(/>© Polimu</g, '>© 2026 Polimu. All rights reserved.<');
    // Any remaining emails
    c = c.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, (m) => {
      if (m.includes('schema.org') || m.includes('w3.org')) return m;
      return 'polimuhelpline@gmail.com';
    });
  }

  // About page body
  if (rel.includes('about') && rel.endsWith('index.html')) {
    c = c.replace(
      /(<p class="mt-4 text-base text-muted">)[^<]*(<\/p>)/,
      '$1Join Polimu Chat Site, the trusted platform where Africans and people around the world get paid to chat with lonely foreigners. Enjoy instant withdrawals to M-Pesa, MoMo, bank accounts or crypto. Over 80,000 users are earning daily.$2'
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
