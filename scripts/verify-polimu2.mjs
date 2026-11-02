import { readFileSync, writeFileSync } from 'fs';

const c = readFileSync('index.html', 'utf8');

// Create Your Chatting Account CTA
const create = [...c.matchAll(/href="([^"]+)"/g)];
const idx = c.indexOf('Create Your Chatting Account');
console.log('Create context:', c.slice(idx - 200, idx + 40));

// Facebook/IG
for (const label of ['Follow us on Facebook', 'Follow us on Instagram']) {
  const i = c.indexOf(label);
  const slice = c.slice(Math.max(0, i - 120), i);
  const href = slice.match(/href="([^"]+)"/);
  console.log(label + ':', href?.[1]);
}

// Bundle SEO leftovers
const js = readFileSync('assets/index-BxJ28E2m.js', 'utf8');
console.log('Bundle ImoChat:', (js.match(/ImoChat|FlitChat|imochat\.site|flitchat\.site/g) || []).length);
console.log('Bundle Polimu:', (js.match(/Polimu/g) || []).length);
console.log('Bundle mula:', (js.match(/mula-prime/g) || []).length);
console.log('Bundle star-hela:', (js.match(/star-hela/g) || []).length);
console.log('Bundle wa.me:', (js.match(/wa\.me/g) || []).length);

// Ensure Create CTA uses mula-prime if nested differently
let html = c;
if (idx > 0) {
  // Find nearest preceding href within 500 chars
  const before = html.slice(Math.max(0, idx - 500), idx);
  const hrefs = [...before.matchAll(/href="([^"]+)"/g)];
  const last = hrefs[hrefs.length - 1]?.[1];
  console.log('Create Account nearest href:', last);
}

// Contact email on contact page
const contact = readFileSync('contact/index.html', 'utf8');
console.log('Contact email mentions:', (contact.match(/polimuhelpline@gmail\.com/g) || []).length);
console.log('Email line:', contact.match(/Email[^<]{0,80}/)?.[0]);
