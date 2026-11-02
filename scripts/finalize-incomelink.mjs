import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function walk(dir, out = []) {
  for (const n of readdirSync(dir)) {
    if (n === 'node_modules' || n === '.git') continue;
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(html|js|webmanifest|json)$/.test(n)) out.push(p);
  }
  return out;
}

const htmlCopy = '&copy; 2026 incomelink. All rights reserved.';
const jsCopy = '\u00a9 2026 incomelink. All rights reserved.';

for (const file of walk('.')) {
  let c = readFileSync(file, 'utf8');
  const before = c;

  c = c.replace(
    /<div>(?:&copy;|©|c)\s*2026 incomelink\. All rights reserved\.<\/div>/g,
    `<div>${htmlCopy}</div>`
  );
  c = c.replace(
    /children:"(?:©|c|&copy;|\\u00a9)?\s*2026 incomelink\. All rights reserved\."/g,
    `children:"${jsCopy}"`
  );

  if (c !== before) {
    writeFileSync(file, c);
    console.log('footer fixed', file);
  }
}

// Explicit SEO + about on homepage
let html = readFileSync('index.html', 'utf8');
html = html.replace(/<title>[^<]*<\/title>/, '<title>incomelink – Official Get Paid to Chat Platform</title>');
html = html.replace(
  /name="description" content="[^"]*"/,
  'name="description" content="Join incomelink and get paid to chat with lonely foreigners. Instant withdrawals to M-Pesa, MoMo, bank accounts, and crypto."'
);
html = html.replace(
  /property="og:title" content="[^"]*"/,
  'property="og:title" content="incomelink – Official Get Paid to Chat Platform"'
);
html = html.replace(
  /property="og:description" content="[^"]*"/,
  'property="og:description" content="Join incomelink and get paid to chat with lonely foreigners. Instant withdrawals to M-Pesa, MoMo, bank accounts, and crypto."'
);
html = html.replace(
  /name="twitter:title" content="[^"]*"/,
  'name="twitter:title" content="incomelink – Official Get Paid to Chat Platform"'
);
html = html.replace(
  /name="twitter:description" content="[^"]*"/,
  'name="twitter:description" content="Join incomelink and get paid to chat with lonely foreigners. Instant withdrawals to M-Pesa, MoMo, bank accounts, and crypto."'
);
html = html.replace(/<h1 class="sr-only">[^<]*<\/h1>/, '<h1 class="sr-only">incomelink</h1>');
html = html.replace(
  /<h2 class="font-display text-\[28px\] leading-\[1\.05\] font-extrabold tracking-tight text-text sm:text-4xl">[\s\S]*?<\/h2>/,
  '<h2 class="font-display text-[28px] leading-[1.05] font-extrabold tracking-tight text-text sm:text-4xl">incomelink</h2>'
);
html = html.replace(
  /(<p class="mx-auto mt-3 max-w-xl text-sm text-muted sm:text-base">)[^<]*(<\/p>)/,
  '$1Join thousands of people earning daily by chatting with lonely foreigners from around the world.$2'
);

const aboutText =
  'Join incomelink Site, the trusted platform where Africans and people around the world get paid to chat with lonely foreigners. Enjoy instant withdrawals to M-Pesa, MoMo, bank accounts or crypto. Over 80,000 users are earning daily.';

html = html.replace(
  /(<p class="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">)[^<]*(<\/p>)/,
  `$1${aboutText}$2`
);
html = html.replace(/<div>(?:&copy;|©|c)\s*2026 incomelink\. All rights reserved\.<\/div>/g, `<div>${htmlCopy}</div>`);
writeFileSync('index.html', html);

let about = readFileSync('about/index.html', 'utf8');
about = about.replace(
  /(<p class="mt-4 text-base text-muted">)[^<]*(<\/p>)/,
  `$1${aboutText}$2`
);
about = about.replace(/<div>(?:&copy;|©|c)\s*2026 incomelink\. All rights reserved\.<\/div>/g, `<div>${htmlCopy}</div>`);
writeFileSync('about/index.html', about);

writeFileSync(
  'manifest.webmanifest',
  JSON.stringify(
    {
      name: 'incomelink',
      short_name: 'incomelink',
      description: 'incomelink — Get paid to chat with foreigners. Install the incomelink App for fast access.',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      orientation: 'portrait',
      background_color: '#ffffff',
      theme_color: '#0E7C7B',
      icons: [
        { src: '/favicon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/favicon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/favicon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    null,
    2
  ) + '\n'
);

writeFileSync(
  'package.json',
  JSON.stringify(
    {
      name: 'incomelink',
      version: '1.0.0',
      private: true,
      description: 'incomelink static site',
      scripts: { start: 'npx --yes serve -l 3000' },
    },
    null,
    2
  ) + '\n'
);

writeFileSync(
  'robots.txt',
  `User-agent: *
Allow: /
Disallow: /auth
Disallow: /dashboard

# IndexNow
# Key file: /a74ecba8ce6ac217564cdad2e9d5602d.txt

Sitemap: https://incomelink.site/sitemap.xml
Host: incomelink.site
`
);

console.log('done');
