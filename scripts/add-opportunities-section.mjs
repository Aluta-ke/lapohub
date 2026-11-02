import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const LINK = 'https://okoachat.site';

const cards = [
  {
    icon: '🗣️',
    title: 'Teach Foreigners Swahili',
    bullets: [
      'Share your language skills',
      'Connect with global learners',
      'Flexible hours',
    ],
    cta: 'Start Teaching & Earn',
  },
  {
    icon: '🎬',
    title: 'Watch Videos & Review Hotels',
    bullets: [
      'Discover travel destinations',
      'Provide valuable feedback',
      'Get compensated for your time',
    ],
    cta: 'Explore Video Tasks',
  },
  {
    icon: '🔎',
    title: 'More Opportunities',
    bullets: [
      'Surveys, testing apps, and more',
      'New earning options daily',
      'Maximize your income potential',
    ],
    cta: 'View All Tasks',
  },
];

function cardHtml(card) {
  const bullets = card.bullets
    .map(
      (b) =>
        `<li class="flex items-start gap-2 text-sm text-muted"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true"></span><span>${b}</span></li>`
    )
    .join('');
  return `<div class="flex h-full flex-col rounded-2xl border border-border bg-white p-5 shadow-sm"><div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl" aria-hidden="true">${card.icon}</div><h3 class="mt-4 font-display text-lg font-bold text-text">${card.title}</h3><ul class="mt-3 flex flex-1 flex-col gap-2">${bullets}</ul><a href="${LINK}" target="_blank" rel="noopener noreferrer" class="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]">${card.cta}</a></div>`;
}

const sectionHtml = `<section class="mx-auto max-w-5xl px-4 py-10" id="earn-online"><h2 class="text-center font-display text-xl font-extrabold text-text sm:text-2xl">Explore Diverse Ways to Earn Online!</h2><p class="mt-1 text-center text-xs text-muted sm:text-sm">More ways to earn beyond chatting — start any task in minutes.</p><div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">${cards.map(cardHtml).join('')}</div></section>`;

// --- Update index.html ---
const htmlPath = path.join(ROOT, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

if (html.includes('Explore Diverse Ways to Earn Online!')) {
  console.log('HTML already has section; skipping HTML insert');
} else {
  const marker = '</section><section class="mx-auto max-w-5xl px-4 py-6"><div class="grid grid-cols-2 gap-3 rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-teal-600';
  if (!html.includes(marker)) {
    // fallback: after How it works closing
    const howIdx = html.indexOf('>How it works<');
    if (howIdx < 0) throw new Error('How it works not found in HTML');
    const afterHow = html.indexOf('</section>', howIdx);
    if (afterHow < 0) throw new Error('How it works section end not found');
    html = html.slice(0, afterHow + '</section>'.length) + sectionHtml + html.slice(afterHow + '</section>'.length);
  } else {
    html = html.replace(marker, `</section>${sectionHtml}<section class="mx-auto max-w-5xl px-4 py-6"><div class="grid grid-cols-2 gap-3 rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-teal-600`);
  }
  fs.writeFileSync(htmlPath, html);
  console.log('Updated index.html');
}

// --- Update JS bundle ---
const jsPath = path.join(ROOT, 'assets', 'index-BA91RANk.js');
let js = fs.readFileSync(jsPath, 'utf8');

if (js.includes('Explore Diverse Ways to Earn Online!')) {
  console.log('JS already has section; skipping JS insert');
} else {
  // Insert a new component function before ln()
  const componentFn = `function earnOnlineSection(){const e=[{icon:"🗣️",title:"Teach Foreigners Swahili",bullets:["Share your language skills","Connect with global learners","Flexible hours"],cta:"Start Teaching & Earn"},{icon:"🎬",title:"Watch Videos & Review Hotels",bullets:["Discover travel destinations","Provide valuable feedback","Get compensated for your time"],cta:"Explore Video Tasks"},{icon:"🔎",title:"More Opportunities",bullets:["Surveys, testing apps, and more","New earning options daily","Maximize your income potential"],cta:"View All Tasks"}];return n.jsxs("section",{className:"mx-auto max-w-5xl px-4 py-10",id:"earn-online",children:[n.jsx("h2",{className:"text-center font-display text-xl font-extrabold text-text sm:text-2xl",children:"Explore Diverse Ways to Earn Online!"}),n.jsx("p",{className:"mt-1 text-center text-xs text-muted sm:text-sm",children:"More ways to earn beyond chatting — start any task in minutes."}),n.jsx("div",{className:"mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3",children:e.map((t,r)=>n.jsxs("div",{className:"flex h-full flex-col rounded-2xl border border-border bg-white p-5 shadow-sm",children:[n.jsx("div",{className:"flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl","aria-hidden":!0,children:t.icon}),n.jsx("h3",{className:"mt-4 font-display text-lg font-bold text-text",children:t.title}),n.jsx("ul",{className:"mt-3 flex flex-1 flex-col gap-2",children:t.bullets.map((b,i)=>n.jsxs("li",{className:"flex items-start gap-2 text-sm text-muted",children:[n.jsx("span",{className:"mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary","aria-hidden":!0}),n.jsx("span",{children:b})]},i))}),n.jsx("a",{href:"${LINK}",target:"_blank",rel:"noopener noreferrer",className:"mt-5 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]",children:t.cta})]},r))})]})}function ln(){`;

  if (!js.includes('function ln(){')) {
    throw new Error('function ln() not found in JS');
  }
  js = js.replace('function ln(){', componentFn);

  // Inject into main children after or (How it works)
  const oldCompose = 'n.jsx(or,{}),n.jsx(sr,{})';
  const newCompose = 'n.jsx(or,{}),n.jsx(earnOnlineSection,{}),n.jsx(sr,{})';
  if (!js.includes(oldCompose)) {
    throw new Error('compose marker not found in JS');
  }
  js = js.replace(oldCompose, newCompose);

  fs.writeFileSync(jsPath, js);
  console.log('Updated index-BA91RANk.js');
}

console.log('Done.');
