import { readFileSync } from 'fs';

const c = readFileSync('index.html', 'utf8');
const idx = c.indexOf('Create Your Chatting Account');
console.log(c.slice(idx - 600, idx + 50));

// All mula and any leftover register links
console.log('mula count', (c.match(/mula-prime\.com/g) || []).length);
console.log('register.php count', (c.match(/register\.php/g) || []).length);
console.log('star', (c.match(/star-hela|starhela/g) || []).length);

const footer = readFileSync('assets/SiteFooter-BCEgAcxb.js', 'utf8');
console.log('footer register', footer.match(/https:\/\/[^"]*register[^"]*/)?.[0]);
console.log('footer K or wa const', footer.match(/https:\/\/whatsapp\.com\/channel\/[^"]+/)?.[0]);
