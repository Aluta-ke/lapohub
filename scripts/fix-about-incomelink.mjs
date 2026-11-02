import { readFileSync, writeFileSync } from 'fs';

const aboutText =
  'Join incomelink Site, the trusted platform where Africans and people around the world get paid to chat with lonely foreigners. Enjoy instant withdrawals to M-Pesa, MoMo, bank accounts or crypto. Over 80,000 users are earning daily.';

// Homepage discover section — first body paragraph under Discover heading
let html = readFileSync('index.html', 'utf8');
const discoverIdx = html.indexOf('Discover Real Opportunities to Earn by Chatting');
if (discoverIdx < 0) throw new Error('Discover heading not found');
const after = html.slice(discoverIdx);
const pMatch = after.match(/<p class="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">([\s\S]*?)<\/p>/);
if (!pMatch) throw new Error('Discover paragraph not found');
console.log('OLD discover p:', pMatch[1].slice(0, 120));
html =
  html.slice(0, discoverIdx) +
  after.replace(
    /<p class="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">[\s\S]*?<\/p>/,
    `<p class="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">${aboutText}</p>`
  );
writeFileSync('index.html', html);
console.log('NEW discover p:', aboutText.slice(0, 120));

// About page
let about = readFileSync('about/index.html', 'utf8');
const oldAbout = about.match(/<p class="mt-4 text-base text-muted">([\s\S]*?)<\/p>/);
console.log('OLD about page:', oldAbout?.[1]?.slice(0, 120));
about = about.replace(
  /<p class="mt-4 text-base text-muted">[\s\S]*?<\/p>/,
  `<p class="mt-4 text-base text-muted">${aboutText}</p>`
);
writeFileSync('about/index.html', about);

// Sitemap
writeFileSync(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://incomelink.site/</loc><lastmod>2026-07-20</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://incomelink.site/about</loc><lastmod>2026-07-20</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://incomelink.site/contact</loc><lastmod>2026-07-20</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://incomelink.site/terms</loc><lastmod>2026-07-20</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>https://incomelink.site/privacy</loc><lastmod>2026-07-20</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
</urlset>
`
);

// Confirm CTAs / social
const c = readFileSync('index.html', 'utf8');
console.log('Start Earning:', c.match(/href="([^"]+)"[^>]*>Start Earning</)?.[1]);
console.log('WA banner:', c.match(/href="([^"]+)"[^>]*aria-label="Join our WhatsApp[^"]*"/)?.[1]);
console.log('FB:', (() => { const i=c.indexOf('Follow us on Facebook'); return c.slice(i-150,i).match(/href="([^"]+)"/)?.[1]; })());
console.log('discover confirm:', c.includes(aboutText));
console.log('about confirm:', readFileSync('about/index.html','utf8').includes(aboutText));
