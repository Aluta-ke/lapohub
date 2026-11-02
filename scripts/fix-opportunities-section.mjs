import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const LINK = 'https://okoachat.site';

const sectionHtml = `<section class="mx-auto max-w-5xl px-4 py-8" id="earn-online"><h2 class="text-center font-display text-xl font-extrabold text-text">Explore Diverse Ways to Earn Online!</h2><p class="mt-1 text-center text-xs text-muted">More ways to earn beyond chatting — start any task in minutes.</p><div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3"><div class="flex h-full flex-col rounded-2xl border border-border bg-white p-4 shadow-sm"><div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-xl" aria-hidden="true">🗣️</div><h3 class="mt-2.5 font-display text-base font-bold text-text">Teach Foreigners Swahili</h3><ul class="mt-3 flex flex-1 flex-col gap-2"><li class="flex items-start gap-2 text-xs text-muted"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true"></span><span>Share your language skills</span></li><li class="flex items-start gap-2 text-xs text-muted"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true"></span><span>Connect with global learners</span></li><li class="flex items-start gap-2 text-xs text-muted"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true"></span><span>Flexible hours</span></li></ul><a href="${LINK}" target="_blank" rel="noopener noreferrer" class="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97]">Start Teaching &amp; Earn</a></div><div class="flex h-full flex-col rounded-2xl border border-border bg-white p-4 shadow-sm"><div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-xl" aria-hidden="true">🎬</div><h3 class="mt-2.5 font-display text-base font-bold text-text">Watch Videos &amp; Review Hotels</h3><ul class="mt-3 flex flex-1 flex-col gap-2"><li class="flex items-start gap-2 text-xs text-muted"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true"></span><span>Discover travel destinations</span></li><li class="flex items-start gap-2 text-xs text-muted"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true"></span><span>Provide valuable feedback</span></li><li class="flex items-start gap-2 text-xs text-muted"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true"></span><span>Get compensated for your time</span></li></ul><a href="${LINK}" target="_blank" rel="noopener noreferrer" class="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97]">Explore Video Tasks</a></div><div class="flex h-full flex-col rounded-2xl border border-border bg-white p-4 shadow-sm"><div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-xl" aria-hidden="true">🔎</div><h3 class="mt-2.5 font-display text-base font-bold text-text">More Opportunities</h3><ul class="mt-3 flex flex-1 flex-col gap-2"><li class="flex items-start gap-2 text-xs text-muted"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true"></span><span>Surveys, testing apps, and more</span></li><li class="flex items-start gap-2 text-xs text-muted"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true"></span><span>New earning options daily</span></li><li class="flex items-start gap-2 text-xs text-muted"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true"></span><span>Maximize your income potential</span></li></ul><a href="${LINK}" target="_blank" rel="noopener noreferrer" class="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97]">View All Tasks</a></div></div></section>`;

const jsComponent = `function earnOnlineSection(){const e=[{icon:"🗣️",title:"Teach Foreigners Swahili",bullets:["Share your language skills","Connect with global learners","Flexible hours"],cta:"Start Teaching & Earn"},{icon:"🎬",title:"Watch Videos & Review Hotels",bullets:["Discover travel destinations","Provide valuable feedback","Get compensated for your time"],cta:"Explore Video Tasks"},{icon:"🔎",title:"More Opportunities",bullets:["Surveys, testing apps, and more","New earning options daily","Maximize your income potential"],cta:"View All Tasks"}];return n.jsxs("section",{className:"mx-auto max-w-5xl px-4 py-8",id:"earn-online",children:[n.jsx("h2",{className:"text-center font-display text-xl font-extrabold text-text",children:"Explore Diverse Ways to Earn Online!"}),n.jsx("p",{className:"mt-1 text-center text-xs text-muted",children:"More ways to earn beyond chatting — start any task in minutes."}),n.jsx("div",{className:"mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3",children:e.map((t,r)=>n.jsxs("div",{className:"flex h-full flex-col rounded-2xl border border-border bg-white p-4 shadow-sm",children:[n.jsx("div",{className:"flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-xl","aria-hidden":!0,children:t.icon}),n.jsx("h3",{className:"mt-2.5 font-display text-base font-bold text-text",children:t.title}),n.jsx("ul",{className:"mt-3 flex flex-1 flex-col gap-2",children:t.bullets.map((b,i)=>n.jsxs("li",{className:"flex items-start gap-2 text-xs text-muted",children:[n.jsx("span",{className:"mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary","aria-hidden":!0}),n.jsx("span",{children:b})]},i))}),n.jsx("a",{href:"${LINK}",target:"_blank",rel:"noopener noreferrer",className:"mt-5 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97]",children:t.cta})]},r))})]})} `;

// Fix HTML: replace existing earn-online section
const htmlPath = path.join(ROOT, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
const htmlStart = html.indexOf('<section class="mx-auto max-w-5xl px-4 py-10" id="earn-online">');
const htmlStart2 = html.indexOf('<section class="mx-auto max-w-5xl px-4 py-8" id="earn-online">');
const start = htmlStart >= 0 ? htmlStart : htmlStart2;
if (start < 0) throw new Error('earn-online section not found in HTML');
const end = html.indexOf('</section>', start) + '</section>'.length;
html = html.slice(0, start) + sectionHtml + html.slice(end);
fs.writeFileSync(htmlPath, html);
console.log('HTML section replaced');

// Fix JS: replace earnOnlineSection function body
const jsPath = path.join(ROOT, 'assets', 'index-BA91RANk.js');
let js = fs.readFileSync(jsPath, 'utf8');
const jsStart = js.indexOf('function earnOnlineSection(){');
if (jsStart < 0) throw new Error('earnOnlineSection not found in JS');
const jsEnd = js.indexOf('function ln(){', jsStart);
if (jsEnd < 0) throw new Error('ln() after earnOnlineSection not found');
js = js.slice(0, jsStart) + jsComponent + js.slice(jsEnd);
fs.writeFileSync(jsPath, js);
console.log('JS section replaced');

// Verify
html = fs.readFileSync(htmlPath, 'utf8');
js = fs.readFileSync(jsPath, 'utf8');
console.log('HTML has title:', html.includes('Explore Diverse Ways to Earn Online!'));
console.log('HTML has link count:', (html.match(/https:\/\/okoachat\.site/g) || []).length);
console.log('JS has title:', js.includes('Explore Diverse Ways to Earn Online!'));
console.log('JS has link count:', (js.match(/https:\/\/okoachat\.site/g) || []).length);
console.log('JS compose ok:', js.includes('n.jsx(earnOnlineSection,{})'));
