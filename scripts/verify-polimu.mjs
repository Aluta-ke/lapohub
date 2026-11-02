import { readFileSync } from 'fs';

console.log('=== copyright fix ===');
import('./fix-copyright.mjs').then(() => {
  const c = readFileSync('index.html', 'utf8');
  console.log('footer:', c.match(/<div>[^<]*2026 Polimu[^<]*<\/div>/)?.[0]);

  const start = c.match(/href="([^"]+)"[^>]*>[\s\S]{0,300}?Start Chat/);
  console.log('Start Chat href:', start?.[1]);

  const wa = c.match(/href="([^"]+)"[^>]*aria-label="Join our WhatsApp[^"]*"/);
  console.log('WA banner:', wa?.[1]);

  const contactIdx = c.indexOf('Contact us');
  const around = c.slice(Math.max(0, contactIdx - 400), contactIdx);
  const hrefs = [...around.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  console.log('Hrefs before Contact us:', hrefs);

  const earn = c.match(/href="([^"]+)"[^>]*>Start Earning</);
  console.log('Start Earning:', earn?.[1]);

  const create = c.match(/href="([^"]+)"[\s\S]{0,200}?Create Your Chatting Account/);
  console.log('Create Account:', create?.[1]);

  const js = readFileSync('assets/SiteFooter-BCEgAcxb.js', 'utf8');
  console.log('JS footer:', js.match(/children:"[^"]*2026 Polimu[^"]*"/)?.[0]);
  console.log('JS mula:', (js.match(/mula-prime/g) || []).length);
  console.log('JS channel:', (js.match(/0029Vb8Dg2q3GJP4Sr6aAT47/g) || []).length);
});
