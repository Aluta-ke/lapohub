import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname, relative } from 'path';

const ROOT = process.cwd();
const SKIP = new Set(['node_modules', '.git', 'scripts']);
const TEXT_EXTS = new Set(['.html', '.js', '.css', '.xml', '.txt', '.webmanifest', '.json']);

const NEW_REG = 'https://mulaearn.com/register.php?ref=OkoaChat';
const OLD_REGS = [
  'https://starhela.com/register.php?ref=Reigns',
  'https://star-hela.com/register.php?ref=MartinKe',
  'https://starhela.com/register.php?ref=FLIRTCHAT',
  'https://mula-prime.com/user/register.php?ref=Chatnow',
  'https://okoachat.site',
];

const NEW_WA = 'https://whatsapp.com/channel/0029VbDTUGz0Qeaqcx3rnw2m';
const OLD_WAS = [
  'https://chat.whatsapp.com/JtTO6y8EDvXGxYsjmlVuTd',
  'https://wa.me/254116906441?text=Hello%20am%20interested%20in%20IncomeLink',
  'https://wa.me/254798106328?text=Hello%20am%20interested',
  'https://wa.me/254707156110?text=Hello%20%F0%9F%91%8B%20%20Am%20Interested',
  'https://whatsapp.com/channel/0029Vb8Dg2q3GJP4Sr6aAT47',
];

const NEW_EMAIL = 'franciscahmwende6@gmail.com';
const ABOUT_TEXT =
  'Join OkoaChat Chat Site, the trusted platform where Africans and people around the world get paid to chat with lonely foreigners. Enjoy instant withdrawals to M-Pesa, MoMo, bank accounts or crypto. Over 80,000 users are earning daily.';
const HERO_SUB =
  'Join thousands of people earning daily by chatting with lonely foreigners from around the world.';
const SEO_TITLE = 'OkoaChat – Official Get Paid to Chat Platform';
const SEO_DESC =
  'Join OkoaChat and get paid to chat with lonely foreigners. Instant withdrawals to M-Pesa, MoMo, bank accounts, and crypto.';
const FOOTER = '© 2026 OkoaChat. All rights reserved.';

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

function transform(content, rel) {
  let c = content;

  // Registration links first (before brand domain swaps)
  for (const old of OLD_REGS) c = c.split(old).join(NEW_REG);

  // WhatsApp links
  for (const old of OLD_WAS) c = c.split(old).join(NEW_WA);

  // Brand / domain (order: longer / specific first)
  c = c.split('incomelink.site').join('okoachat.site');
  c = c.split('Incomelink.site').join('okoachat.site');
  c = c.split('IncomeLink.site').join('okoachat.site');
  c = c.split('incomelink.Site').join('okoachat.Site');
  c = c.split('Incomelink.Site').join('okoachat.Site');
  c = c.split('IncomeLink').join('OkoaChat');
  c = c.split('Incomelink').join('OkoaChat');
  c = c.split('incomelink').join('OkoaChat');

  // Emails
  c = c.split('mentorreigns@gmail.com').join(NEW_EMAIL);
  c = c.split('polimuhelpline@gmail.com').join(NEW_EMAIL);
  c = c.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, (m) => {
    if (m.includes('schema.org') || m.includes('w3.org') || m.includes('example.com')) return m;
    if (m === NEW_EMAIL) return m;
    return NEW_EMAIL;
  });

  // Remove tel: links / phone numbers as links
  c = c.replace(/href="tel:[^"]+"/g, `href="${NEW_WA}"`);
  c = c.replace(/tel:\+?\d+/g, NEW_WA);
  // Strip leftover plain Kenya phone displays that aren't part of channel URLs
  c = c.replace(/\+?254[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{3}/g, '');
  c = c.replace(/254\d{9}/g, (m) => {
    // keep if somehow inside remaining URL path (shouldn't happen)
    return '';
  });

  // Footer copyright variants
  c = c.replace(/©\s*2026\s*OkoaChat\.?\s*All rights reserved\.?/g, FOOTER);
  c = c.replace(/©\s*2026\s*incomelink\.?\s*All rights reserved\.?/gi, FOOTER);
  c = c.replace(/©\s*OkoaChat(?:\.Site)?(?:\s*Site)?/g, FOOTER);
  c = c.replace(/>\s*©[^<]*OkoaChat[^<]*</g, `>${FOOTER}<`);
  c = c.replace(/>\s*©[^<]*incomelink[^<]*</gi, `>${FOOTER}<`);
  // JS string forms
  c = c.replace(/"©[^"]*OkoaChat[^"]*"/g, JSON.stringify(FOOTER));
  c = c.replace(/"©[^"]*incomelink[^"]*"/gi, JSON.stringify(FOOTER));
  c = c.replace(/'©[^']*OkoaChat[^']*'/g, JSON.stringify(FOOTER));

  // HTML pages: SEO + hero + about
  if (rel.endsWith('.html')) {
    if (rel === 'index.html' || rel.replace(/\\/g, '/') === 'index.html') {
      c = c.replace(/<title>[^<]*<\/title>/, `<title>${SEO_TITLE}</title>`);
      c = c.replace(
        /name="description" content="[^"]*"/,
        `name="description" content="${SEO_DESC}"`
      );
      c = c.replace(/property="og:title" content="[^"]*"/, `property="og:title" content="${SEO_TITLE}"`);
      c = c.replace(
        /property="og:description" content="[^"]*"/,
        `property="og:description" content="${SEO_DESC}"`
      );
      c = c.replace(/name="twitter:title" content="[^"]*"/, `name="twitter:title" content="${SEO_TITLE}"`);
      c = c.replace(
        /name="twitter:description" content="[^"]*"/,
        `name="twitter:description" content="${SEO_DESC}"`
      );
      c = c.replace(/property="og:url" content="[^"]*"/, 'property="og:url" content="https://okoachat.site/"');
      c = c.replace(/property="og:site_name" content="[^"]*"/, 'property="og:site_name" content="OkoaChat"');

      c = c.replace(/<h1 class="sr-only">[^<]*<\/h1>/, '<h1 class="sr-only">OkoaChat</h1>');
      c = c.replace(
        /<h2 class="font-display text-\[28px\] leading-\[1\.05\] font-extrabold tracking-tight text-text sm:text-4xl">[\s\S]*?<\/h2>/,
        '<h2 class="font-display text-[28px] leading-[1.05] font-extrabold tracking-tight text-text sm:text-4xl">OkoaChat</h2>'
      );
      c = c.replace(
        /(<p class="mx-auto mt-3 max-w-xl text-sm text-muted sm:text-base">)[^<]*(<\/p>)/,
        `$1${HERO_SUB}$2`
      );

      // Discover / about paragraph on homepage
      const discoverIdx = c.indexOf('Discover Real Opportunities to Earn by Chatting');
      if (discoverIdx >= 0) {
        const after = c.slice(discoverIdx);
        const replaced = after.replace(
          /<p class="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">[\s\S]*?<\/p>/,
          `<p class="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">${ABOUT_TEXT}</p>`
        );
        c = c.slice(0, discoverIdx) + replaced;
      }
    }

    // About page body
    if (rel.replace(/\\/g, '/').includes('about/') && rel.endsWith('index.html')) {
      c = c.replace(
        /<p class="mt-4 text-base text-muted">[\s\S]*?<\/p>/,
        `<p class="mt-4 text-base text-muted">${ABOUT_TEXT}</p>`
      );
    }

    // Ensure footer text
    c = c.replace(/>©[^<]*</g, (m) => {
      if (/2026|rights reserved|OkoaChat|incomelink|Polimu|Site/i.test(m)) return `>${FOOTER}<`;
      return m;
    });
  }

  return c;
}

const files = walk(ROOT);
let changed = 0;
for (const file of files) {
  const rel = relative(ROOT, file);
  const before = readFileSync(file, 'utf8');
  const after = transform(before, rel.replace(/\\/g, '/'));
  if (after !== before) {
    writeFileSync(file, after);
    changed++;
    console.log('updated', rel);
  }
}

// Explicit SEO / config files
writeFileSync(
  join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://okoachat.site/</loc><lastmod>2026-07-28</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://okoachat.site/about</loc><lastmod>2026-07-28</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://okoachat.site/contact</loc><lastmod>2026-07-28</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://okoachat.site/terms</loc><lastmod>2026-07-28</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>https://okoachat.site/privacy</loc><lastmod>2026-07-28</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
</urlset>
`
);

writeFileSync(
  join(ROOT, 'robots.txt'),
  `User-agent: *
Allow: /
Disallow: /auth
Disallow: /dashboard

# IndexNow
# Key file: /a74ecba8ce6ac217564cdad2e9d5602d.txt

Sitemap: https://okoachat.site/sitemap.xml
Host: okoachat.site
`
);

writeFileSync(
  join(ROOT, 'manifest.webmanifest'),
  `{
  "name": "OkoaChat",
  "short_name": "OkoaChat",
  "description": "OkoaChat — Get paid to chat with foreigners. Install the OkoaChat App for fast access.",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#ffffff",
  "theme_color": "#0E7C7B",
  "icons": [
    {
      "src": "/favicon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/favicon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/favicon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
`
);

writeFileSync(
  join(ROOT, 'package.json'),
  `{
  "name": "okoachat",
  "version": "1.0.0",
  "private": true,
  "description": "OkoaChat static site",
  "scripts": {
    "start": "npx --yes serve -l 3000"
  }
}
`
);

console.log('Changed files:', changed);
console.log('Wrote sitemap, robots, manifest, package.json');
