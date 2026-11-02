import { mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas } from "@napi-rs/canvas";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://lapohub.com";
const REG = "https://www.lofthela.com/user/register.php?ref=Lapohub";
const WA = "https://whatsapp.com/channel/0029VbE1cQe7j6gAAHMouP20";
const EMAIL = "lapohub2@gmail.com";

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function current(pathname, href) {
  if (href === "/") return pathname === "/" ? ' aria-current="page"' : "";
  return pathname === href || pathname.startsWith(href) ? ' aria-current="page"' : "";
}

function shell({ title, description, pathname, body, noindex = false }) {
  const canonical = SITE + (pathname === "/" ? "/" : pathname);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="${noindex ? "noindex, follow" : "index, follow"}">
<meta name="author" content="LapoHub">
<meta name="theme-color" content="#1c2433">
<meta name="application-name" content="LapoHub">
<link rel="canonical" href="${canonical}">
<meta property="og:site_name" content="LapoHub">
<meta property="og:type" content="website">
<meta property="og:locale" content="en_US">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE}/assets/og-lapohub.png">
<meta property="og:image:alt" content="LapoHub — international communication and digital learning">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${SITE}/assets/og-lapohub.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png">
<link rel="apple-touch-icon" href="/favicon-192.png">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,560;9..144,680&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/lapo.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <a class="brand" href="/"><img src="/assets/logo.svg" alt="" width="40" height="40"><span class="brand-text"><strong>LapoHub</strong><em>Connect. Learn. Earn.</em></span></a>
  <button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="site-nav">Menu</button>
  <nav class="nav" id="site-nav" data-nav>
    <p class="menu-label">Activities</p>
    ${activities.map(([title, , href]) => `<a href="${href}"${current(pathname, href)}>${esc(title)}</a>`).join("")}
    <a class="btn btn-wa menu-contact" href="${WA}" target="_blank" rel="noopener noreferrer">Contact Us</a>
  </nav>
</header>
<main id="main">${body}</main>
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div>
      <strong>LapoHub</strong>
      <p class="fine">International communication, language exchange, digital learning, and interactive activities.</p>
      <p class="fine">The welcome bonus is a promotion. It is added to your active account wallet and credited for active users immediately after activation.</p>
      <p class="fine">Prize-wheel photograph by Kari, <a href="https://commons.wikimedia.org/wiki/File:Wheel_of_Fortune_Cyclone_Arcade_Game.jpg">CC BY 2.0</a>.</p>
    </div>
    <div>
      <strong>Explore</strong>
      <div class="link-list">
        <a href="/chat/">Chat with foreigners</a>
        <a href="/activities/">Activities</a>
        <a href="/bonus/">Welcome bonus</a>
        <a href="/referrals/">Referral link</a>
        <a href="/about/">About</a>
        <a href="/terms/">Terms</a>
        <a href="/privacy/">Privacy</a>
      </div>
    </div>
    <div>
      <strong>Support</strong>
      <div class="link-list">
        <a href="${WA}" target="_blank" rel="noopener noreferrer">Contact Us</a>
        <a href="${WA}" target="_blank" rel="noopener noreferrer">Join WhatsApp Channel</a>
        <a href="mailto:${EMAIL}">Email Support</a>
      </div>
    </div>
  </div>
  <div class="wrap fine" style="margin-top:18px">© 2026 LapoHub · <a href="${SITE}/">lapohub.com</a></div>
</footer>
<nav class="bottom-nav" aria-label="Primary">
  <a href="/"${current(pathname, "/")}>Home</a>
  <a href="/chat/"${current(pathname, "/chat/")}>Chat</a>
  <a href="/activities/"${current(pathname, "/activities/")}>Activities</a>
  <a href="/courses/"${current(pathname, "/courses/")}>Learn</a>
  <a href="/dashboard/"${current(pathname, "/dashboard/")}>Account</a>
</nav>
<script src="/assets/lapo.js" defer></script>
<script src="/pwa-install.js" defer></script>
</body>
</html>`;
}

const activities = [
  ["Chat with foreigners", "Open a conversation with people in other countries.", "/chat/", "activity-chat.jpg", "Active"],
  ["Spin and win", "Spin the wheel and collect an activity reward.", "/spin/", "activity-spin.jpg", "Active"],
  ["Marketplace", "Browse study items, descriptions, and prices.", "/marketplace/", "activity-market.jpg", "Active"],
  ["Teach local languages", "Swahili, Luganda, and other African languages.", "/languages/", "activity-languages.jpg", "Active"],
  ["TikTok activities", "Short creative tasks with clear instructions.", "/tiktok/", "activity-video.jpg", "Active"],
  ["Practice trivia", "Answer questions and keep your score.", "/trivia/", "activity-trivia.jpg", "Active"],
  ["Article reading", "Read short guides with a progress bar.", "/articles/", "activity-articles.jpg", "Active"],
  ["Music listening", "Play original pieces in the listening room.", "/music/", "activity-music.jpg", "Active"],
  ["AI video tasks", "Plan a short learning video and save your brief.", "/ai-videos/", "activity-aivideo.jpg", "Active"],
  ["AI-powered lessons", "Beginner lessons on tools, prompts, and productivity.", "/ai-lessons/", "activity-ailessons.jpg", "Active"],
  ["Online courses", "Work through lessons and track what you finish.", "/courses/", "activity-courses.jpg", "Active"],
  ["Investment learning", "Financial literacy with clear risk notes.", "/investment/", "activity-invest.jpg", "Active"],
  ["Sports tips", "Adult sports notes. No betting on this site.", "/tips/", "activity-sports.jpg", "Active"]
];

function startLink() {
  return `<a class="btn btn-gold start-btn" href="${REG}" target="_blank" rel="noopener noreferrer">Start</a>`;
}

function activityCards(featured) {
  return activities.map(([title, text, href, image, label], index) => {
    const cls = index === 0 && featured ? "card feature-card" : "card";
    const frame = image === "activity-spin.jpg" ? " card-photo-spin" : image === "activity-sports.jpg" ? " card-photo-sport" : "";
    return `<article class="${cls}"><a class="card-link" href="${href}"><img class="card-photo${frame}" src="/assets/activities/${image}" alt=""><div class="icon-row"><span class="pill pill-live">Active</span></div><h3>${title}</h3><p class="muted">${text}</p><p class="meta" style="margin-top:auto">${label}</p></a>${startLink()}</article>`;
  }).join("");
}

const articles = [
  {
    slug: "respectful-conversations",
    title: "How to start a respectful conversation across countries",
    category: "Communication",
    description: "A short guide to introductions, listening, and boundaries in international chat.",
    paragraphs: [
      "A good conversation usually starts smaller than people expect. Say who you are, mention one ordinary detail from your day, and leave room for the other person to answer. A greeting that assumes friendship too quickly can feel confusing, especially when you do not share a language or a city.",
      "Ask questions that a stranger can answer comfortably: food, weather, study, music, or a festival. Avoid questions about money, home address, identification documents, or romantic plans. If someone asks you for a payment, a code, or a private photo, stop and use the account tools on the registration platform rather than continuing in the chat.",
      "Language mistakes are part of exchange. Repeat a word you did not catch, or type it slowly. Short sentences travel better than long speeches. If you are practicing Swahili, Luganda, or another language, agree on that before the chat so both people know it is practice.",
      "End clearly. Thank the person, say you are leaving, and do not promise a meeting or a payment you cannot keep. LapoHub does not match people inside this website. Conversation access, if it is available to you, opens from your registered account."
    ]
  },
  {
    slug: "practice-a-language",
    title: "Practice a language for fifteen minutes",
    category: "Language exchange",
    description: "A simple daily routine for Swahili, Luganda, and other languages you are learning.",
    paragraphs: [
      "Fifteen quiet minutes can be enough. Spend three minutes reading yesterday’s phrases aloud. Spend five minutes writing four new sentences about your real day. Spend the last minutes saying them without looking.",
      "Use phrases you can check. For Swahili, “Jina langu ni…” means “My name is…” and “Asante” means “Thank you.” For Luganda, “Oli otya?” means “How are you?” and “Webale” means “Thank you.” Stop when you are unsure rather than inventing a sentence.",
      "Keep a small notebook with three columns: the phrase, the meaning, and a sentence of your own. Review only the phrases you missed. This is more useful than collecting a long list you never say.",
      "A teacher connection is not live on LapoHub yet. Until it is, use these public lesson notes and, if you want conversation practice, open a chat account through the official registration page."
    ]
  },
  {
    slug: "creative-learning",
    title: "Creative habits for digital learning",
    category: "Digital learning",
    description: "Ways to stay with an online lesson without turning it into a race.",
    paragraphs: [
      "Choose one lesson and finish it before opening another tab. Write a single sentence at the end: what you can now do that you could not do at the start. That sentence is your progress note.",
      "Creative work needs a limit. A sketch, a short recording, or a five-line explanation is complete when it communicates one idea. Longer is not automatically better.",
      "Turn off alerts for the length of the lesson. If you stop, mark the lesson incomplete. LapoHub course checkboxes are stored in this browser so you can return, and they are not a certificate.",
      "Share work only when you are comfortable. Do not post another person’s chat, photo, or voice note. Creative exchange still needs permission."
    ]
  },
  {
    slug: "reading-with-focus",
    title: "Reading an online article with focus",
    category: "Online education",
    description: "How to use the LapoHub reading view and keep a honest progress mark.",
    paragraphs: [
      "Read the title and the first paragraph before you decide the article is for you. If it is not, leave it. Attention is a limited tool.",
      "The progress bar on a LapoHub article follows how far the text has moved through the screen. It is saved in this browser. It does not mean a teacher reviewed your reading, and it does not pay a reward.",
      "When you finish, write one question the article did not answer. That question is a better memory aid than highlighting every line.",
      "Come back a day later and try to explain the article without opening it. What you can still say is what you actually learned."
    ]
  }
];

const courses = [
  {
    slug: "communication",
    title: "International communication basics",
    category: "Communication",
    description: "Four short lessons on greetings, clarity, safety, and closing a conversation.",
    lessons: [
      ["Greetings", "Use your name, your country, and one simple question. Let the other person choose how much to share."],
      ["Clarity", "Prefer short sentences. If you switch languages, say so. Ask for the spelling of a word you want to keep."],
      ["Safety", "Do not send passwords, payout details, or private documents in a chat. Report pressure inside the registered account, not by moving to a private number."],
      ["Closing", "Thank the person and say goodbye. A clear ending is part of a respectful exchange."]
    ]
  },
  {
    slug: "digital-skills",
    title: "Digital learning habits",
    category: "Online education",
    description: "Four lessons on planning study time, notes, reviews, and honest progress.",
    lessons: [
      ["A small plan", "Pick a start time and one lesson. Protect that block from extra tabs."],
      ["Notes", "Write what you will use tomorrow, not everything you saw."],
      ["Review", "The next day, recall the lesson before you reread it."],
      ["Progress", "Mark a lesson complete only after you can explain it. The mark stays on this device."]
    ]
  }
];

const products = [
  ["study-journal", "Language study journal", "Notes", "USD 8", "journal.png", "A notebook for phrase practice, with space for meanings and your own sentences."],
  ["practice-headset", "Practice headset", "Audio", "USD 18", "headset.png", "A headset for listening back to pronunciations and music lessons."],
  ["desk-lamp", "Reading lamp", "Study", "USD 14", "lamp.png", "A small lamp for evening reading and course work."],
  ["phrase-cards", "Phrase cards", "Notes", "USD 6", "cards.png", "Cards for Swahili and Luganda greetings you can review each day."]
];

const aiLessons = [
  ["what-tools-do", "What AI tools can and cannot do", "AI tools", "A tool can draft, sort, and explain. It can also be wrong. Check names, translations, and numbers before you use them."],
  ["clear-prompts", "Writing a clearer prompt", "AI skills", "Say the task, the audience, the length, and what to leave out. A short prompt with those four parts is easier to correct."],
  ["study-plans", "A study plan with AI assistance", "AI productivity", "Ask for a seven-day plan of fifteen-minute sessions. Then delete anything you do not understand. The plan is a draft, not a teacher."],
  ["everyday-productivity", "Everyday productivity", "AI productivity", "Use a tool to turn messy notes into a list. Keep the decisions yourself. Do not paste private chats or account passwords."],
  ["plan-a-video", "Plan a short video", "Video creation", "Write a beginning, one example, and an ending. A storyboard is enough for a first lesson. This page does not generate or pay for a video."]
];

function pageHero(kicker, title, lede) {
  const skip = new Set(["Promotion", "Dashboard", "Account", "Referrals", "About", "Support", "Terms", "Privacy", "Admin", "404"]);
  const start = skip.has(kicker) ? "" : `<div class="hero-actions">${startLink()}</div>`;
  return `<div class="wrap page-hero"><p class="kicker">${kicker}</p><h1>${title}</h1><p class="lede">${lede}</p>${start}</div>`;
}

const pages = [];

pages.push({
  pathname: "/",
  title: "LapoHub — international chat, language exchange, and digital learning",
  description: "LapoHub is a digital platform for international communication, language exchange, digital learning, interactive activities, and online education.",
  body: `<section class="wrap hero">
    <div>
      <h1>Chat with people <em>in other countries.</em></h1>
      <p class="lede">LapoHub is a home for international conversation, language exchange, and digital learning. Chat is the first activity. The panel shows a labeled sample of the layout. Real chat opens from a registered account.</p>
      <div class="hero-actions">
        <a class="btn btn-gold btn-pop" href="${REG}" target="_blank" rel="noopener noreferrer">Start</a>
        <a class="btn btn-live" href="/chat/">How chat works</a>
        <a class="btn btn-wa" href="${WA}" target="_blank" rel="noopener noreferrer">Contact Us</a>
      </div>
    </div>
    <aside class="chat-board" aria-label="Sample preview of Live Global Chat">
      <p class="lgc-note">Sample preview. The profiles, messages, and number here are design examples. They are not registered members, live sessions, or earnings.</p>
      <p class="kicker" style="color:#e3b15a">Layout sample</p>
      <h2 style="color:#fffaf4">Live Global Chat</h2>
      <p class="lgc-sub">Connect with people around the world.</p>
      <div class="lgc-count">
        <span class="lgc-count-num">24</span>
        <span>Sample online count. Member sessions are not connected to this page yet, so this figure does not change.</span>
      </div>
      <div class="lgc-feed">
        <article class="lgc-row">
          <div class="lgc-avatar" role="img" aria-label="Illustrated sample profile, not a member"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="32" fill="#3d2a22"/><circle cx="32" cy="28" r="12" fill="#c68642"/><path d="M14 58c3-12 10-16 18-16s15 4 18 16" fill="#8d5524"/><path d="M20 24c2-10 22-12 26-2-6-6-18-6-26 2z" fill="#1a120e"/></svg><span class="lgc-presence" aria-hidden="true"></span></div>
          <div>
            <p class="lgc-who"><strong>Sample A</strong><span class="lgc-flag" aria-label="Kenya"><svg viewBox="0 0 16 16" aria-hidden="true"><rect width="16" height="5" fill="#111"/><rect y="5" width="16" height="2" fill="#fff"/><rect y="7" width="16" height="2" fill="#bb0000"/><rect y="9" width="16" height="2" fill="#fff"/><rect y="11" width="16" height="5" fill="#006600"/></svg></span><span>Kenya</span><span class="lgc-tag">Sample</span></p>
            <p class="lgc-msg">Hello. What are you learning this week?</p>
          </div>
        </article>
        <article class="lgc-row">
          <div class="lgc-avatar" role="img" aria-label="Illustrated sample profile, not a member"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="32" fill="#2a3548"/><circle cx="32" cy="30" r="12" fill="#e0ac69"/><path d="M16 60c2-14 10-18 16-18s14 4 16 18" fill="#246247"/><path d="M18 26c4-8 24-8 28 0-2-8-26-8-28 0z" fill="#3a2416"/></svg><span class="lgc-presence" aria-hidden="true"></span></div>
          <div>
            <p class="lgc-who"><strong>Sample B</strong><span class="lgc-flag" aria-label="Mexico"><svg viewBox="0 0 16 16" aria-hidden="true"><rect width="5.4" height="16" fill="#006847"/><rect x="5.4" width="5.2" height="16" fill="#fff"/><rect x="10.6" width="5.4" height="16" fill="#ce1126"/></svg></span><span>Mexico</span><span class="lgc-tag">Sample</span></p>
            <p class="lgc-msg">I can practice English if you share one greeting.</p>
          </div>
        </article>
        <article class="lgc-row">
          <div class="lgc-avatar" role="img" aria-label="Illustrated sample profile, not a member"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="32" fill="#62456f"/><circle cx="32" cy="30" r="12" fill="#8d5524"/><path d="M15 59c3-13 11-17 17-17s14 4 17 17" fill="#b5523a"/><path d="M16 28c2-14 30-14 32 0-8-8-24-8-32 0z" fill="#1a120e"/></svg><span class="lgc-presence" aria-hidden="true"></span></div>
          <div>
            <p class="lgc-who"><strong>Sample C</strong><span class="lgc-flag" aria-label="Brazil"><svg viewBox="0 0 16 16" aria-hidden="true"><rect width="16" height="16" fill="#009c3b"/><polygon points="8,2 15,8 8,14 1,8" fill="#ffdf00"/><circle cx="8" cy="8" r="2.3" fill="#002776"/></svg></span><span>Brazil</span><span class="lgc-tag">Sample</span></p>
            <p class="lgc-msg">Lunch here is rice and beans. What is lunch like for you?</p>
          </div>
        </article>
        <article class="lgc-row">
          <div class="lgc-avatar" role="img" aria-label="Illustrated sample profile, not a member"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="32" fill="#1c2433"/><circle cx="32" cy="30" r="12" fill="#f1c27d"/><path d="M16 60c2-14 10-18 16-18s14 4 16 18" fill="#2a3548"/><path d="M20 22c6-6 20-6 24 2-8-4-18-4-24-2z" fill="#111"/></svg><span class="lgc-presence" aria-hidden="true"></span></div>
          <div>
            <p class="lgc-who"><strong>Sample D</strong><span class="lgc-flag" aria-label="Japan"><svg viewBox="0 0 16 16" aria-hidden="true"><rect width="16" height="16" fill="#fff"/><circle cx="8" cy="8" r="3.2" fill="#bc002d"/></svg></span><span>Japan</span><span class="lgc-tag">Sample</span></p>
            <p class="lgc-msg">Good evening. I am reviewing a few phrases before class.</p>
          </div>
        </article>
      </div>
      <div class="topics">
        <a class="topic" href="${REG}" target="_blank" rel="noopener noreferrer">Food today</a>
        <a class="topic" href="${REG}" target="_blank" rel="noopener noreferrer">One greeting</a>
        <a class="topic" href="${REG}" target="_blank" rel="noopener noreferrer">Music you love</a>
        <a class="topic" href="${REG}" target="_blank" rel="noopener noreferrer">A place you know</a>
        <a class="topic" href="${REG}" target="_blank" rel="noopener noreferrer">Swahili hello</a>
        <a class="topic" href="${REG}" target="_blank" rel="noopener noreferrer">Luganda hello</a>
        <a class="topic" href="${REG}" target="_blank" rel="noopener noreferrer">Weekend plans</a>
        <a class="topic" href="${REG}" target="_blank" rel="noopener noreferrer">A local custom</a>
      </div>
      <div class="chat-start"><a class="btn btn-gold" href="${REG}" target="_blank" rel="noopener noreferrer">Join the Conversation</a></div>
    </aside>
  </section>
  <section class="wrap section">
    <h2>Start with three steps</h2>
    <div class="grid-3 steps" style="margin-top:16px">
      <article class="card step"><h3>Register</h3><p class="muted">Create your LapoHub account and activate it to open chat and your welcome bonus.</p><p style="margin-top:14px"><a class="btn btn-gold" href="${REG}" target="_blank" rel="noopener noreferrer">Sign up</a></p></article>
      <article class="card step"><h3>Open chat</h3><p class="muted">Start a conversation from your account. Say hello, pick a topic, and practice a language together.</p></article>
      <article class="card step"><h3>Keep learning</h3><p class="muted">Use languages, articles, and courses while you chat with people in other countries.</p></article>
    </div>
  </section>
  <section class="wrap section">
    <div class="bonus-band">
      <div>
        <p class="kicker" style="color:#e3b15a">Welcome bonus</p>
        <h2 style="color:#fffaf4">A promotion</h2>
        <p>Uganda: UGX 10,000. Other regions: USD 2. Added to your active account wallet and credited for active users immediately after activation.</p>
        <p style="margin-top:12px"><a class="btn btn-gold" href="/bonus/">Read eligibility</a></p>
      </div>
      <div><div class="amount">UGX 10,000</div><p>Added to active Uganda accounts immediately after activation.</p></div>
      <div><div class="amount">USD 2</div><p>Added to active accounts in other regions immediately after activation.</p></div>
    </div>
  </section>
  <section class="wrap section">
    <h2>Activities</h2>
    <p class="lede">Chat stays first. Every activity below is open.</p>
    <div class="activity-grid" style="margin-top:16px">${activityCards(true)}</div>
  </section>
  <section class="wrap section grid-2">
    <article class="panel">
      <h2>Keep learning</h2>
      <p class="muted">Articles, AI lessons, and courses work in the browser. Progress stays on your device.</p>
      <p style="margin-top:12px"><a class="btn" href="/courses/">Browse courses</a></p>
    </article>
    <article class="panel">
      <h2>Community</h2>
      <p class="muted">Contact buttons open the LapoHub WhatsApp Channel. Email is separate.</p>
      <div class="hero-actions">
        <a class="btn" href="${WA}" target="_blank" rel="noopener noreferrer">Contact Us</a>
        <a class="btn btn-ghost" href="${WA}" target="_blank" rel="noopener noreferrer">Join WhatsApp Channel</a>
        <a class="btn btn-ghost" href="mailto:${EMAIL}">Email Support</a>
      </div>
    </article>
  </section>
  <section class="wrap section">
    <h2>Questions</h2>
    <div class="grid-2" style="margin-top:12px">
      <article class="panel"><h3>Where does chat happen?</h3><p class="muted">After you register, chat opens in that account. The homepage panel is a labeled sample layout, not a live member count.</p></article>
      <article class="panel"><h3>When is the welcome bonus credited?</h3><p class="muted">It is a promotion. It is added to your active account wallet and credited for active users immediately after activation.</p></article>
      <article class="panel"><h3>Is the welcome bonus already mine?</h3><p class="muted">It is a promotion. After activation it is added to your active account wallet. Active users are credited immediately after activation.</p></article>
      <article class="panel"><h3>Which link should I share?</h3><p class="muted">Share only the official registration URL published on the referral page.</p></article>
    </div>
  </section>`
});

pages.push({
  pathname: "/chat/",
  title: "Chat with foreigners — LapoHub",
  description: "Start international conversation on LapoHub through the official registration account. This page does not simulate a live chat.",
  body: `${pageHero("Chat", "Chat with foreigners", "This is the main LapoHub activity. The working chat stays on the registration platform. This page explains how to reach it and how to take part safely.")}
  <section class="wrap section grid-2">
    <article class="panel">
      <h2>Open the real account</h2>
      <p class="muted">Create an account with the LapoHub referral link. Do not use a different registration URL.</p>
      <p style="margin-top:14px"><a class="btn btn-gold" href="${REG}" target="_blank" rel="noopener noreferrer">Register to chat</a></p>
    </article>
    <article class="panel">
      <h2>What you can talk about</h2>
      <ul class="list">
        <li>Everyday life, study, food, music, and travel.</li>
        <li>Language practice in Swahili, Luganda, English, and other languages you actually speak.</li>
        <li>Culture, with patience for different habits and time zones.</li>
      </ul>
    </article>
  </section>
  <section class="wrap section">
    <div class="notice warn"><strong>Safety.</strong> Do not share passwords, wallet details, or identification documents. LapoHub will not ask you to continue a chat on a private phone number. This page is not a messaging app.</div>
    <div class="grid-3" style="margin-top:14px">
      <article class="card"><h3>Be clear</h3><p class="muted">Short sentences are easier across languages.</p></article>
      <article class="card"><h3>Be patient</h3><p class="muted">People reply at different hours.</p></article>
      <article class="card"><h3>Be finished</h3><p class="muted">Say goodbye when you leave the conversation.</p></article>
    </div>
  </section>`
});

pages.push({
  pathname: "/activities/",
  title: "Activities — LapoHub",
  description: "Browse LapoHub activities for conversation, language exchange, learning, and creative practice.",
  body: `${pageHero("Activities", "Choose an activity", "Chat is listed first. Each activity is open and ready to use.")}
  <section class="wrap section"><div class="card-grid">${activityCards(false)}</div></section>`
});

function wheelMarkup() {
  const segments = [
    ["Conversation", "#1c2433", "#f7f1e6"],
    ["Languages", "#b7791f", "#1c2433"],
    ["Practice quiz", "#246247", "#f7f1e6"],
    ["Reading", "#62456f", "#f7f1e6"],
    ["Music", "#b5523a", "#fffaf4"],
    ["Courses", "#2a3548", "#f7f1e6"]
  ];
  const cx = 160;
  const cy = 160;
  const radius = 150;
  const polar = (deg, dist) => {
    const rad = (deg * Math.PI) / 180;
    return [cx + dist * Math.sin(rad), cy - dist * Math.cos(rad)];
  };
  const wedges = segments.map((seg, index) => {
    const start = index * 60;
    const end = start + 60;
    const mid = start + 30;
    const [x0, y0] = polar(start, radius);
    const [x1, y1] = polar(end, radius);
    const [tx, ty] = polar(mid, 78);
    const [px, py] = polar(start, 138);
    const words = seg[0].split(" ");
    const label = words.length === 1
      ? esc(seg[0])
      : `<tspan x="${tx.toFixed(2)}" dy="-0.45em">${esc(words[0])}</tspan><tspan x="${tx.toFixed(2)}" dy="1.15em">${esc(words.slice(1).join(" "))}</tspan>`;
    return `<path d="M${cx} ${cy} L${x0.toFixed(2)} ${y0.toFixed(2)} A${radius} ${radius} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z" fill="${seg[1]}"/>
      <line x1="${cx}" y1="${cy}" x2="${x0.toFixed(2)}" y2="${y0.toFixed(2)}" stroke="#f6e7c1" stroke-width="2"/>
      <circle cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="5" fill="#f8edd2" stroke="#8a5a12" stroke-width="1.2"/>
      <text x="${tx.toFixed(2)}" y="${ty.toFixed(2)}" fill="${seg[2]}" font-size="13" font-weight="650" text-anchor="middle" dominant-baseline="middle" transform="rotate(${mid} ${tx.toFixed(2)} ${ty.toFixed(2)})">${label}</text>`;
  }).join("");
  const bulbs = Array.from({ length: 18 }, (_, index) => {
    const angle = (index / 18) * Math.PI * 2 - Math.PI / 2;
    const x = 50 + 46.4 * Math.cos(angle);
    const y = 50 + 46.4 * Math.sin(angle);
    return `<i style="left:${x.toFixed(2)}%;top:${y.toFixed(2)}%"></i>`;
  }).join("");
  return `<div class="wheel-stage">
      <div class="wheel-rim">
        <div class="wheel-lights" aria-hidden="true">${bulbs}</div>
        <div class="wheel-rotor" data-wheel>
          <svg viewBox="0 0 320 320" aria-hidden="true">${wedges}</svg>
        </div>
        <div class="wheel-shine" aria-hidden="true"></div>
        <div class="wheel-hub" aria-hidden="true"></div>
        <div class="wheel-pointer" aria-hidden="true"></div>
      </div>
    </div>`;
}

pages.push({
  pathname: "/spin/",
  title: "Spin and win — LapoHub",
  description: "Spin the LapoHub wheel and collect an activity reward.",
  body: `${pageHero("Active", "Spin and win", "Give the wheel a spin. Your result is saved with your other activity rewards on this device.")}
  <section class="wrap section wheel-layout">
    <div>
      ${wheelMarkup()}
      <p style="text-align:center;margin-top:12px"><button class="btn btn-gold" type="button" data-spin>Spin</button></p>
      <p class="muted" style="text-align:center" data-spin-result>No spin yet.</p>
    </div>
    <div>
      <h2>Segments</h2>
      <ul class="legend">
        <li><i class="swatch" style="background:#1c2433"></i> Conversation</li>
        <li><i class="swatch" style="background:#b7791f"></i> Languages</li>
        <li><i class="swatch" style="background:#246247"></i> Practice quiz</li>
        <li><i class="swatch" style="background:#62456f"></i> Reading</li>
        <li><i class="swatch" style="background:#b5523a"></i> Music</li>
        <li><i class="swatch" style="background:#2a3548"></i> Courses</li>
      </ul>
      <h2 style="margin-top:18px">Rules</h2>
      <div class="notice">One spin at a time. The reward is an activity result, saved on this device and shown in your dashboard.</div>
      <ul class="list">
        <li>Each spin lands on one open activity.</li>
        <li>Results stay in your task history.</li>
        <li>Daily play is limited to five spins on this device.</li>
      </ul>
    </div>
  </section>`
});

pages.push({
  pathname: "/marketplace/",
  title: "Marketplace — LapoHub",
  description: "Browse LapoHub study items with photos, descriptions, and prices.",
  body: `${pageHero("Active", "Marketplace", "Study items with photos, descriptions, and prices. Save anything you want to your list.")}
  <section class="wrap">
    <div class="filters">
      <label>Search<input type="search" data-filter-search placeholder="Search items"></label>
      <label>Category<select data-filter-category><option value="all">All</option><option>Notes</option><option>Audio</option><option>Study</option></select></label>
    </div>
    <div class="card-grid">
      ${products.map(([slug, name, category, price, file, blurb]) => `<article class="card" data-filter-item data-name="${esc(name)}" data-category="${esc(category)}"><a class="card-link" href="/marketplace/${slug}/"><img class="card-photo" src="/assets/products/${file}" alt="${esc(name)}"><h3>${name}</h3><p class="muted">${blurb}</p><p class="meta"><span class="pill pill-live">Active</span> ${category} · ${price}</p></a>${startLink()}</article>`).join("")}
    </div>
  </section>`
});

for (const [slug, name, category, price, file, blurb] of products) {
  pages.push({
    pathname: `/marketplace/${slug}/`,
    title: `${name} — LapoHub marketplace`,
    description: `${name} on the LapoHub marketplace, with a description and price.`,
    body: `<div class="wrap page-hero"><p class="crumbs"><a href="/marketplace/">Marketplace</a> / ${name}</p><h1>${name}</h1></div>
    <section class="wrap section product">
      <img src="/assets/products/${file}" alt="${name}" width="640" height="480">
      <div class="panel">
        <span class="pill pill-live">Active</span>
        <p class="lede" style="margin-top:10px">${blurb}</p>
        <p><strong>Price:</strong> ${price}</p>
        <p><strong>Seller:</strong> LapoHub study shop</p>
        <p><strong>Category:</strong> ${category}</p>
        <p style="margin-top:12px">${startLink()} <button class="btn" type="button" data-save-item="${esc(name)}">Save to my list</button></p>
        <p class="muted" data-save-result role="status"></p>
      </div>
    </section>`
  });
}

pages.push({
  pathname: "/languages/",
  title: "Teach and learn local languages — LapoHub",
  description: "Explore Swahili, Luganda, and other African languages with lesson notes, sample teacher profiles, and learning options.",
  body: `${pageHero("Languages", "Teach local languages", "Open a language, read the lesson, and practice it in chat.")}
  <section class="wrap section card-grid">
    <article class="card"><a class="card-link" href="/languages/swahili/"><h3>Swahili</h3><p class="muted">Greetings, names, and everyday words used across East Africa.</p><span class="pill pill-live">Active</span></a>${startLink()}</article>
    <article class="card"><a class="card-link" href="/languages/luganda/"><h3>Luganda</h3><p class="muted">Introductions and polite phrases from central Uganda.</p><span class="pill pill-live">Active</span></a>${startLink()}</article>
    <article class="card"><a class="card-link" href="/languages/more/"><h3>More African languages</h3><p class="muted">Yoruba, Amharic, and Zulu starters.</p><span class="pill pill-live">Active</span></a>${startLink()}</article>
  </section>
  <section class="wrap section">
    <h2>Teacher guides</h2>
    <p class="muted">Each guide is active. Practice the lesson, then continue the conversation in chat.</p>
    <div class="grid-3" style="margin-top:12px">
      ${[["Swahili guide", "Greetings, names, and everyday words."], ["Luganda guide", "Polite introductions and closings."], ["Yoruba guide", "Hello, thank you, and giving your name."]].map(([role, text]) => `<article class="panel"><span class="pill pill-live">Active</span><h3>${role}</h3><p class="muted">${text}</p><p style="margin-top:10px">${startLink()}</p></article>`).join("")}
    </div>
  </section>
  <section class="wrap section panel">
    <h2>Learning options</h2>
    <ul class="list">
      <li>Self-study notes on this website.</li>
      <li>Conversation practice through a registered chat account, when that account offers it.</li>
      <li>Practice with a partner through the chat registration link.</li>
    </ul>
  </section>`
});

pages.push({
  pathname: "/languages/swahili/",
  title: "Swahili lessons — LapoHub",
  description: "Beginner Swahili greetings and lesson notes for language exchange on LapoHub.",
  body: `${pageHero("Swahili", "Swahili lesson notes", "Introductory phrases for self-study. A live teacher is not attached to this page.")}
  <section class="wrap section prose">
    <h2>Greetings</h2>
    <p>Habari means “news” and is used as a greeting. Habari yako? asks “How are you?” Nzuri is a common reply meaning “good.” Asante means “thank you,” and asante sana means “thank you very much.” Karibu means “welcome.”</p>
    <h2>Names</h2>
    <p>Jina langu ni… means “My name is…” Ninatoka… means “I come from…” Use a place you are happy to share.</p>
    <h2>Useful words</h2>
    <p>Ndiyo means yes. Hapana means no. Tafadhali means please. Samahani means sorry or excuse me. Kwaheri means goodbye.</p>
    <h2>Lesson shape</h2>
    <p>Say four phrases aloud, write one sentence about your day, and check any word you are unsure of before you teach it to someone else.</p>
    <p><a class="btn" href="${REG}" target="_blank" rel="noopener noreferrer">Practice these phrases in chat</a></p>
  </section>`
});

pages.push({
  pathname: "/languages/luganda/",
  title: "Luganda lessons — LapoHub",
  description: "Beginner Luganda greetings and lesson notes for learners and future teachers on LapoHub.",
  body: `${pageHero("Luganda", "Luganda lesson notes", "Short phrases for polite conversation. These notes are for study, not a live class.")}
  <section class="wrap section prose">
    <h2>Greetings</h2>
    <p>Oli otya? means “How are you?” Bulungi means “fine” or “well.” Ssebo is a polite address for a man, and nnyabo for a woman. Webale means “thank you.” Webale nnyo means “thank you very much.”</p>
    <h2>Introducing yourself</h2>
    <p>Nze… means “I am…” followed by your name. Keep the rest of the sentence short until you have checked it with a confident speaker.</p>
    <h2>Closing</h2>
    <p>Kale can mean “okay.” Weeraba is used when saying goodbye. A respectful close matters as much as the greeting.</p>
    <p><a class="btn" href="${REG}" target="_blank" rel="noopener noreferrer">Practice these phrases in chat</a></p>
  </section>`
});

pages.push({
  pathname: "/languages/more/",
  title: "More African languages — LapoHub",
  description: "Introductory notes for Yoruba, Amharic, and Zulu on LapoHub.",
  body: `${pageHero("Languages", "More African languages", "Starter greetings only. Spelling and tone vary by speaker, so treat these as a first step.")}
  <section class="wrap section grid-3">
    <article class="panel"><h3>Yoruba</h3><p class="muted">Bawo ni? asks how someone is. E se is a polite thank you. Oruko mi ni… means “My name is…”</p></article>
    <article class="panel"><h3>Amharic</h3><p class="muted">Selam is a greeting. Ameseginalehu means thank you. Ask a speaker to correct the pronunciation before you teach it.</p></article>
    <article class="panel"><h3>Zulu</h3><p class="muted">Sawubona is hello to one person. Unjani? asks how you are. Ngiyabonga means thank you.</p></article>
  </section>
  <section class="wrap"><p><a class="btn" href="${REG}" target="_blank" rel="noopener noreferrer">Practice in chat</a></p></section>`
});

pages.push({
  pathname: "/tiktok/",
  title: "TikTok-style learning activities — LapoHub",
  description: "Read LapoHub activity ideas and submission instructions. This is not an official TikTok program and it does not pay for views.",
  body: `${pageHero("Activities", "TikTok-style activities", "These are optional creative activities. LapoHub is not a TikTok partner. Views, followers, and likes are not paid by this website, and no earning amount is promised.")}
  <section class="wrap section grid-3">
    <article class="panel"><h3>Teach one greeting</h3><p class="muted">Record a short clip that teaches one checked phrase, such as Swahili “Asante.” Say the meaning and use it in one sentence.</p><p style="margin-top:12px">${startLink()}</p></article>
    <article class="panel"><h3>Show a study habit</h3><p class="muted">Film a fifteen-minute study setup. Explain what you will practice. Do not show private account screens.</p><p style="margin-top:12px">${startLink()}</p></article>
    <article class="panel"><h3>Describe a local custom</h3><p class="muted">Explain one public custom in simple English, then one sentence in a language you speak well.</p><p style="margin-top:12px">${startLink()}</p></article>
  </section>
  <section class="wrap section panel">
    <h2>Submission instructions</h2>
    <ol>
      <li>Use music and images you have the right to use.</li>
      <li>Do not say that TikTok or LapoHub guarantees pay for views.</li>
      <li>Keep personal documents out of the frame.</li>
    </ol>
    <form class="form-grid" data-preview-form>
      <label>Activity<select name="activity"><option>Teach one greeting</option><option>Show a study habit</option><option>Describe a local custom</option></select></label>
      <label>Link<input type="url" name="link" placeholder="https://"></label>
      <label>Notes<textarea name="notes" maxlength="500"></textarea></label>
      <button class="btn" type="submit">Save activity</button>
      <p data-form-result class="muted" role="status"></p>
    </form>
  </section>`
});

pages.push({
  pathname: "/trivia/",
  title: "Practice trivia — LapoHub",
  description: "Answer LapoHub multiple-choice questions, see your score, and review practice categories. Rewards are not paid.",
  body: `${pageHero("Trivia", "Practice questions", "Choose a category, answer every question, and check your score. This quiz does not pay a reward.")}
  <section class="wrap section">
    <div class="notice">Reward information: payouts for trivia are not configured. A score is stored only in this browser.</div>
    <div data-quiz="languages" class="quiz" style="margin-top:14px">
      <h2>Category: World languages</h2>
      <fieldset class="q" data-correct="b"><legend>What does Swahili “Asante” mean?</legend>
        <label class="choice"><input type="radio" name="l1" value="a"> Hello</label>
        <label class="choice"><input type="radio" name="l1" value="b"> Thank you</label>
        <label class="choice"><input type="radio" name="l1" value="c"> Goodbye</label>
      </fieldset>
      <fieldset class="q" data-correct="a"><legend>What does Luganda “Oli otya?” ask?</legend>
        <label class="choice"><input type="radio" name="l2" value="a"> How are you?</label>
        <label class="choice"><input type="radio" name="l2" value="b"> What is your name?</label>
        <label class="choice"><input type="radio" name="l2" value="c"> Where is the market?</label>
      </fieldset>
      <fieldset class="q" data-correct="c"><legend>Which phrase means “My name is…” in Swahili?</legend>
        <label class="choice"><input type="radio" name="l3" value="a"> Habari yako</label>
        <label class="choice"><input type="radio" name="l3" value="b"> Kwaheri</label>
        <label class="choice"><input type="radio" name="l3" value="c"> Jina langu ni</label>
      </fieldset>
      <h2>Category: Digital learning</h2>
      <fieldset class="q" data-correct="b"><legend>A useful study block on LapoHub is closest to which habit?</legend>
        <label class="choice"><input type="radio" name="d1" value="a"> Opening every course at once</label>
        <label class="choice"><input type="radio" name="d1" value="b"> Finishing one short lesson</label>
        <label class="choice"><input type="radio" name="d1" value="c"> Sharing private chats publicly</label>
      </fieldset>
      <fieldset class="q" data-correct="a"><legend>What should you do with an AI draft?</legend>
        <label class="choice"><input type="radio" name="d2" value="a"> Check it before you rely on it</label>
        <label class="choice"><input type="radio" name="d2" value="b"> Treat it as a certified teacher</label>
        <label class="choice"><input type="radio" name="d2" value="c"> Paste your passwords into it</label>
      </fieldset>
      <button class="btn" type="button" data-grade>See score</button>
      <p data-quiz-result role="status" class="lede"></p>
    </div>
  </section>`
});

pages.push({
  pathname: "/articles/",
  title: "Articles — LapoHub",
  description: "Read LapoHub articles on communication, language exchange, and digital learning.",
  body: `${pageHero("Reading", "Articles", "Original notes on conversation, language practice, and focused study.")}
  <section class="wrap">
    <div class="filters"><label>Search<input type="search" data-filter-search placeholder="Search titles"></label>
      <label>Category<select data-filter-category><option value="all">All</option><option>Communication</option><option>Language exchange</option><option>Digital learning</option><option>Online education</option></select></label>
    </div>
    <div class="card-grid">
      ${articles.map((article) => `<article class="card" data-filter-item data-name="${esc(article.title)}" data-category="${esc(article.category)}"><a class="card-link" href="/articles/${article.slug}/"><img class="thumb" alt="" src="/assets/articles/${article.slug}.png"><span class="pill pill-live">${esc(article.category)}</span><h3>${esc(article.title)}</h3><p class="muted">${esc(article.description)}</p></a>${startLink()}</article>`).join("")}
    </div>
  </section>`
});

for (const article of articles) {
  pages.push({
    pathname: `/articles/${article.slug}/`,
    title: `${article.title} — LapoHub`,
    description: article.description,
    body: `<div class="article-top" aria-hidden="true"><span data-read-bar></span></div>
    <article class="wrap section reading" data-article="${article.slug}">
      <div class="prose">
        <p class="crumbs"><a href="/articles/">Articles</a> / ${esc(article.category)}</p>
        <h1>${esc(article.title)}</h1>
        <p>${startLink()}</p>
        <img class="thumb" src="/assets/articles/${article.slug}.png" alt="">
        ${article.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}
      </div>
      <aside class="panel">
        <h2>Reading</h2>
        <p data-read-label class="muted">Progress starts as you read.</p>
        <p class="fine">Saved in this browser. It is not a certificate and it is not paid.</p>
      </aside>
    </article>`
  });
}

pages.push({
  pathname: "/music/",
  title: "Music listening — LapoHub",
  description: "Listen to original LapoHub demo pieces in a simple browser player. A commercial music catalog is not connected.",
  body: `${pageHero("Active", "Listening room", "Play original LapoHub pieces in Calm, Focus, and Bright. They are composed for this site and play in your browser.")}
  <section class="wrap section player panel">
    <div class="icon-row"><h2>Player</h2><button class="btn" type="button" data-player-toggle>Play</button></div>
    <p data-player-status class="muted">Choose a demo. Nothing here is a commercial stream.</p>
    <div class="progress" aria-hidden="true"><span data-player-bar></span></div>
    <div data-track-list></div>
    <p class="fine">Categories in this demo set: Calm, Focus, and Bright. Thumbnails are original color art.</p>
  </section>`
});

pages.push({
  pathname: "/ai-videos/",
  title: "AI video activities — LapoHub",
  description: "Plan a short learning video on LapoHub and save the brief with your activities.",
  body: `${pageHero("Active", "AI video tasks", "Choose a brief, plan the clip, and save your notes with your other activities.")}
  <section class="wrap section grid-3">
    <article class="panel"><img class="thumb" src="/assets/ai/storyboard.png" alt="Illustration of a three-frame storyboard"><h3>Three-frame storyboard</h3><p class="muted">Frame one states the greeting. Frame two shows the meaning. Frame three uses it in a sentence.</p><p style="margin-top:12px">${startLink()}</p></article>
    <article class="panel"><img class="thumb" src="/assets/ai/prompt.png" alt="Illustration of a prompt card"><h3>Prompt card</h3><p class="muted">Write the audience, the language, and a 30-second limit. Check every translation before you record.</p><p style="margin-top:12px">${startLink()}</p></article>
    <article class="panel"><img class="thumb" src="/assets/ai/edit.png" alt="Illustration of an edit timeline"><h3>Simple edit</h3><p class="muted">Cut anything you cannot explain. Do not add music you do not have rights to use.</p><p style="margin-top:12px">${startLink()}</p></article>
  </section>
  <section class="wrap section panel">
    <h2>Submission</h2>
    <form class="form-grid" data-preview-form>
      <label>Task<select name="activity"><option>Three-frame storyboard</option><option>Prompt card</option><option>Simple edit</option></select></label>
      <label>What you planned<textarea name="notes" maxlength="500"></textarea></label>
      <button class="btn" type="submit">Save activity</button>
      <p data-form-result class="muted" role="status"></p>
    </form>
  </section>`
});

pages.push({
  pathname: "/ai-lessons/",
  title: "AI-powered lessons — LapoHub",
  description: "Beginner LapoHub lessons on AI tools, skills, productivity, and video planning.",
  body: `${pageHero("AI lessons", "Beginner AI lessons", "Practical lessons for people who are new to these tools. They are educational notes, not a certificate.")}
  <section class="wrap section card-grid">
    ${aiLessons.map(([slug, title, category, text]) => `<article class="card"><a class="card-link" href="/ai-lessons/${slug}/"><span class="pill pill-live">${category}</span><h3>${title}</h3><p class="muted">${text}</p></a>${startLink()}</article>`).join("")}
  </section>`
});

for (const [slug, title, category, text] of aiLessons) {
  pages.push({
    pathname: `/ai-lessons/${slug}/`,
    title: `${title} — LapoHub`,
    description: text,
    body: `${pageHero(category, title, text)}
    <section class="wrap section prose">
      <p>Start with a task you already understand, such as rewriting a greeting or sorting a study list. Compare the result with what you know. If a translation, name, or number looks unfamiliar, check it with a reliable source or a person who speaks the language.</p>
      <p>Keep private material out of the tool. That includes chat logs, identification numbers, and anything from your registered account. A useful result is one you can explain in your own words.</p>
      <p>This lesson does not unlock a paid video job. When you want to plan a clip, use the AI video page and read the coming-soon notice before you expect a review.</p>
      <p><a href="/ai-lessons/">All AI lessons</a></p>
    </section>`
  });
}

pages.push({
  pathname: "/courses/",
  title: "Online courses — LapoHub",
  description: "LapoHub courses with lessons, descriptions, and completion tracking stored in your browser.",
  body: `${pageHero("Courses", "Online courses", "Short courses you can finish on this website. Progress is saved in this browser and is not a certificate.")}
  <section class="wrap section card-grid">
    ${courses.map((course) => `<article class="card"><a class="card-link" href="/courses/${course.slug}/"><img class="thumb" alt="" src="/assets/courses/${course.slug}.png"><span class="pill pill-live">${course.category}</span><h3>${course.title}</h3><p class="muted">${course.description}</p><p class="meta">${course.lessons.length} lessons</p></a>${startLink()}</article>`).join("")}
  </section>`
});

for (const course of courses) {
  pages.push({
    pathname: `/courses/${course.slug}/`,
    title: `${course.title} — LapoHub`,
    description: course.description,
    body: `<div class="wrap page-hero"><p class="crumbs"><a href="/courses/">Courses</a> / ${esc(course.category)}</p><h1>${esc(course.title)}</h1><p class="lede">${esc(course.description)}</p><div class="hero-actions">${startLink()}</div></div>
    <section class="wrap section" data-course="${course.slug}">
      <img class="thumb" src="/assets/courses/${course.slug}.png" alt="">
      <div class="progress" style="margin:12px 0"><span data-course-bar></span></div>
      <p data-course-label class="muted">0 of ${course.lessons.length} lessons marked complete on this device</p>
      ${course.lessons.map(([title, text], index) => `<div class="lesson"><label><input type="checkbox" data-lesson="${index + 1}"> <span><strong>${esc(title)}</strong><br><span class="muted">${esc(text)}</span></span></label>${startLink()}</div>`).join("")}
    </section>`
  });
}

pages.push({
  pathname: "/investment/",
  title: "Investment learning — LapoHub",
  description: "Financial literacy notes on LapoHub. Investing can lose money. This is not an investment service.",
  body: `${pageHero("Education", "Investment learning", "These notes explain ideas used in financial literacy. LapoHub does not take investments, hold customer funds, or promise returns.")}
  <section class="wrap section">
    <div class="notice warn"><strong>Risk.</strong> You can lose some or all of the money you invest. Past examples are not future results. Nothing on this page is a recommendation to buy, sell, or hold any asset.</div>
    <div class="grid-2" style="margin-top:14px">
      <article class="panel"><h3>What investing means</h3><p class="muted">Investing is putting money into something that can rise or fall in value. It is different from a fee you pay for a lesson, and it is different from cash you need for rent or food.</p></article>
      <article class="panel"><h3>Time and fees</h3><p class="muted">Costs, taxes, and the length of time you can leave money untouched all change the result. A short lesson cannot calculate that for you.</p></article>
      <article class="panel"><h3>Licensed advice</h3><p class="muted">Personal advice belongs with a person or firm allowed to give it where you live. LapoHub is not that firm and does not open investment accounts.</p></article>
      <article class="panel"><h3>Learning first</h3><p class="muted">Before considering any product, write down the amount you can afford to lose and the questions you still cannot answer. If the list is long, keep studying.</p></article>
    </div>
  </section>`
});

pages.push({
  pathname: "/tips/",
  title: "Sports information and tips — LapoHub",
  description: "Optional adult sports information on LapoHub. Tips are not guarantees and the site does not take bets.",
  body: `<section class="wrap section" data-age-gate>
    <div data-age-panel class="age-gate panel">
      <div>
        <p class="kicker">Adults 18+</p>
        <h1>Sports information</h1>
        <p class="lede">This section is optional. Confirm that you are 18 or older to view it. The check is self-declared and is not an identity document review. LapoHub does not take bets.</p>
        <div class="hero-actions">
          <button class="btn" type="button" data-age="yes">I am 18 or older</button>
          <button class="btn btn-ghost" type="button" data-age="no">I am under 18</button>
          ${startLink()}
        </div>
      </div>
    </div>
    <div data-age-content hidden>
      <p class="kicker">Information only</p>
      <h1>Sports categories</h1>
      <p class="lede">Notes below are general observations, not live picks. They do not promise winnings. There is no odds board and no way to place a bet.</p>
      <div class="notice warn" style="margin-top:12px">Gambling can be harmful. If it stops being entertainment, stop and seek local support. This website will not process a wager.</div>
      <div class="grid-3" style="margin-top:14px">
        <article class="panel"><h3>Football</h3><p class="muted">People often discuss home crowds, travel, and recent team news. None of those factors decides a match. This is not a prediction that a named team will win.</p><p style="margin-top:12px">${startLink()}</p></article>
        <article class="panel"><h3>Basketball</h3><p class="muted">Rest, injuries, and schedule density are commonly mentioned. They are context, not a guaranteed result, and not a staking tip.</p><p style="margin-top:12px">${startLink()}</p></article>
        <article class="panel"><h3>Athletics</h3><p class="muted">Wind, lane, and season’s best times help you read a start list. They do not tell you who will finish first.</p><p style="margin-top:12px">${startLink()}</p></article>
      </div>
      <p class="fine" style="margin-top:12px">Responsible play means never using money you need for living costs, never chasing a loss, and never treating a tip as a promise.</p>
    </div>
  </section>`
});

pages.push({
  pathname: "/bonus/",
  title: "Welcome bonus — LapoHub",
  description: "The LapoHub welcome bonus is a promotion added to your active account wallet and credited immediately after activation.",
  body: `${pageHero("Promotion", "Welcome bonus", "This promotion is UGX 10,000 for Uganda and USD 2 for other regions. It is added to your active account wallet and credited for active users immediately after activation.")}
  <section class="wrap section grid-2">
    <article class="panel"><p class="kicker">Your promotion</p><h2 data-bonus-place>Other regions</h2><p class="stat" data-bonus-amount>USD 2</p><p data-bonus-status class="muted"></p>
      <form data-profile-form class="form-grid" style="margin-top:12px">
        <label>Region for this display<select name="region"><option value="UG">Uganda</option><option value="OTHER">Other regions</option></select></label>
        <input type="hidden" name="displayName" value="">
        <button class="btn" type="submit">Update display</button>
        <p data-form-result class="muted" role="status"></p>
      </form>
    </article>
    <article class="panel">
      <h2>Eligibility</h2>
      <ul class="list">
        <li>Register through the official LapoHub link and activate your account.</li>
        <li>One promotion per person.</li>
        <li>Uganda: UGX 10,000. Other regions: USD 2.</li>
        <li>The promotion is added to your active account wallet.</li>
        <li>Active users are credited immediately after activation.</li>
      </ul>
      <p style="margin-top:12px"><a class="btn btn-gold" href="${REG}" target="_blank" rel="noopener noreferrer">Register</a></p>
    </article>
  </section>
  <section class="wrap section prose">
    <h2>Terms</h2>
    <p>The welcome bonus is a promotion. It is added to your active account wallet. Active users are credited immediately after activation. Uganda is credited UGX 10,000. Other regions are credited USD 2.</p>
    <p>Duplicate accounts, misleading details, or a registration that does not use the official link fall outside this promotion.</p>
    <p>See also the <a href="/terms/">site terms</a> and your <a href="/dashboard/">dashboard status</a>.</p>
  </section>`
});

pages.push({
  pathname: "/dashboard/",
  noindex: true,
  title: "Dashboard — LapoHub",
  description: "Your LapoHub device dashboard for profile, learning progress, bonus status, and account notices.",
  body: `${pageHero("Dashboard", "Your space", "Profile preferences and learning progress on this device sit beside your welcome bonus promotion.")}
  <section class="wrap section dash" data-dashboard>
    <aside class="panel">
      <h2>Profile</h2>
      <p>Display name</p>
      <p class="stat" data-display-name>Not set on this device</p>
      <form data-profile-form class="form-grid">
        <label>Name on this device<input name="displayName" maxlength="40" type="text" autocomplete="nickname"></label>
        <label>Bonus region<select name="region"><option value="UG">Uganda</option><option value="OTHER">Other regions</option></select></label>
        <button class="btn" type="submit">Save on this device</button>
        <p data-form-result class="muted" role="status"></p>
      </form>
    </aside>
    <div class="grid-2">
      <article class="panel"><h3>Welcome bonus</h3><p data-bonus-place></p><p class="stat" data-bonus-amount></p><p data-bonus-status class="muted"></p><p><a href="/bonus/">Terms</a></p></article>
      <article class="panel"><h3>Account</h3><p class="muted">There is no login session on this website. Create an account on the registration platform.</p><p style="margin-top:8px"><a class="btn" href="${REG}" target="_blank" rel="noopener noreferrer">Register</a></p></article>
      <article class="panel"><h3>Active account wallet</h3><p class="stat" data-bonus-amount></p><p class="muted">The welcome bonus is a promotion. It is added to your active account wallet and credited for active users immediately after activation.</p></article>
      <article class="panel"><h3>Bonus credit</h3><p class="muted">Active users are credited immediately after activation. The amount is added to the active account wallet.</p></article>
      <article class="panel"><h3>Referral</h3><p class="muted">Share the official link. Tracking, if any, happens on the registration platform.</p><p style="margin-top:8px"><a href="/referrals/">Open referral page</a></p></article>
      <article class="panel"><h3>Learning progress</h3><p data-learning-summary class="muted"></p></article>
      <article class="panel"><h3>Task history</h3><ul class="list" data-task-history></ul></article>
      <article class="panel"><h3>Notifications</h3><ul class="list" data-notifications></ul></article>
    </div>
  </section>
  <section class="wrap section">
    <h2>Activities</h2>
    <div class="card-grid">${activityCards(false)}</div>
  </section>`
});

pages.push({
  pathname: "/login/",
  noindex: true,
  title: "Account access — LapoHub",
  description: "LapoHub accounts are created on the official registration page. This site does not host a separate password login.",
  body: `${pageHero("Account", "Registration and sign-in", "LapoHub does not keep a local password database. New members use the official registration link. If you already have an account, use the sign-in option on that same registration site.")}
  <section class="wrap section panel">
    <p class="lede">The official destination is the LapoHub referral registration URL. Please do not replace it with another link.</p>
    <p style="margin-top:14px"><a class="btn btn-gold" href="${REG}" target="_blank" rel="noopener noreferrer">Continue to registration</a></p>
  </section>`
});

pages.push({
  pathname: "/referrals/",
  title: "Referral link — LapoHub",
  description: "Use the official LapoHub registration and referral URL. Do not replace it with a different address.",
  body: `${pageHero("Referrals", "Official registration link", "Share this URL when the platform asks for the LapoHub referral destination. Referral counts are not stored on this website.")}
  <section class="wrap section panel">
    <label>Registration URL<input id="ref-url" readonly value="${REG}"></label>
    <p style="margin-top:12px"><button class="btn" type="button" data-copy="#ref-url">Copy link</button> <a class="btn btn-gold" href="${REG}" target="_blank" rel="noopener noreferrer">Open registration</a></p>
    <p class="fine" style="margin-top:12px">If the registration platform tracks referrals, it does so after this link is used. LapoHub does not invent referral totals.</p>
  </section>`
});

pages.push({
  pathname: "/about/",
  title: "About LapoHub",
  description: "LapoHub is a digital platform for international communication, language exchange, digital learning, and interactive activities.",
  body: `${pageHero("About", "About LapoHub", "LapoHub brings conversation, language exchange, and online education into one place, with a design and structure of its own.")}
  <section class="wrap section prose">
    <p>The most visible activity is chat with people in other countries. That chat remains on the registered account system. Lessons, articles, and practice tools that do not need a payment ledger live on this website.</p>
    <p>Every activity on the homepage is open. Chat still opens through your registered account. Learning progress, spins, and saved items stay with this browser.</p>
    <p>Support is available through the WhatsApp Channel and by email at ${EMAIL}.</p>
  </section>`
});

pages.push({
  pathname: "/contact/",
  title: "Contact LapoHub",
  description: "Contact LapoHub through the WhatsApp Channel or by email at lapohub2@gmail.com.",
  body: `${pageHero("Support", "Contact", "Use the channel for community updates and the email address for support. LapoHub does not publish a personal chat number.")}
  <section class="wrap section grid-3">
    <article class="panel"><h3>Contact Us</h3><p class="muted">Opens the official WhatsApp Channel.</p><p style="margin-top:10px"><a class="btn" href="${WA}" target="_blank" rel="noopener noreferrer">Contact Us</a></p></article>
    <article class="panel"><h3>WhatsApp Channel</h3><p class="muted">The same channel link, labeled for joining.</p><p style="margin-top:10px"><a class="btn" href="${WA}" target="_blank" rel="noopener noreferrer">Join WhatsApp Channel</a></p></article>
    <article class="panel"><h3>Email</h3><p class="muted">${EMAIL}</p><p style="margin-top:10px"><a class="btn btn-ghost" href="mailto:${EMAIL}">Email Support</a></p></article>
  </section>`
});

pages.push({
  pathname: "/terms/",
  title: "Terms — LapoHub",
  description: "Terms for using the LapoHub website, including promotions, learning tools, and activities that are not yet available.",
  body: `${pageHero("Terms", "Terms and conditions", "Last updated 2 November 2026.")}
  <section class="wrap section prose">
    <p>LapoHub provides a website for international communication, language exchange, digital learning, and interactive activities. Chat accounts are created at the official registration URL. This website is not a second chat server.</p>
    <p>You agree not to misuse the site or attempt to break into it. Activity rewards, saved items, and lesson progress on this website stay in your browser. They are not cash withdrawals.</p>
    <p>The welcome bonus is a promotion of UGX 10,000 for Uganda and USD 2 for other regions. It is added to your active account wallet and credited for active users immediately after activation.</p>
    <p>Investment pages are educational. They are not an offer to invest. Sports notes are optional, limited to adults, and are not a betting service. TikTok-style tasks are not an official TikTok program and do not promise earnings.</p>
    <p>Learning progress stored in your browser can be cleared by you or by the browser. It is not a credential.</p>
    <p>Questions: <a href="mailto:${EMAIL}">${EMAIL}</a> or the <a href="${WA}">WhatsApp Channel</a>.</p>
  </section>`
});

pages.push({
  pathname: "/privacy/",
  title: "Privacy — LapoHub",
  description: "How the LapoHub website handles information stored in your browser and links to registration and support.",
  body: `${pageHero("Privacy", "Privacy policy", "Last updated 2 November 2026.")}
  <section class="wrap section prose">
    <p>This website can store a display name, a region choice for bonus display, article progress, course checkboxes, and practice quiz scores in your browser. That information stays on your device. LapoHub does not operate a member database from these pages.</p>
    <p>Registration happens on a separate site. Their handling of your account is covered by that site after you leave LapoHub. The WhatsApp Channel is operated on WhatsApp’s platform.</p>
    <p>Email you send to ${EMAIL} is used to reply to your support request. Do not include passwords or payment card numbers.</p>
    <p>The sports section remembers a self-declared age confirmation for the current browser session. It is not an identity check.</p>
    <p>You can clear the local data by clearing this site’s storage in your browser.</p>
  </section>`
});

pages.push({
  pathname: "/admin/",
  noindex: true,
  title: "Activity status — LapoHub",
  description: "Read-only status of LapoHub activities. This page cannot create users, balances, or rewards.",
  body: `${pageHero("Admin", "Activity status", "This is a read-only map of what the static site can and cannot do. It is not a control panel for payments.")}
  <section class="wrap section table-wrap">
    <table>
      <thead><tr><th>Area</th><th>Status</th><th>Notes</th></tr></thead>
      <tbody>
        <tr><td>Chat handoff</td><td>Partial</td><td>Registration link is live. Messages stay on the account platform.</td></tr>
        <tr><td>Articles, AI lessons, courses</td><td>Available</td><td>Content and on-device progress.</td></tr>
        <tr><td>Trivia and music demos</td><td>Partial</td><td>Practice tools work. Rewards and a commercial catalog do not.</td></tr>
        <tr><td>Languages</td><td>Partial</td><td>Lesson notes exist. Teacher booking does not.</td></tr>
        <tr><td>Spin, marketplace, AI video tasks, TikTok activities</td><td>Active</td><td>Open on this website. Results are saved in the browser.</td></tr>
        <tr><td>Welcome bonus</td><td>Promotion</td><td>Added to the active account wallet and credited for active users immediately after activation.</td></tr>
        <tr><td>Investment and sports</td><td>Education only</td><td>No transactions.</td></tr>
      </tbody>
    </table>
  </section>`
});

pages.push({
  pathname: "/404.html",
  file: "404.html",
  noindex: true,
  title: "Page not found — LapoHub",
  description: "This LapoHub page is not available.",
  body: `${pageHero("404", "That page is not here", "Try the homepage, chat, or the activity list.")}
  <section class="wrap"><a class="btn" href="/">Back home</a></section>`
});

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function canvasOf(width, height, draw) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  draw(ctx, width, height);
  return canvas.toBuffer("image/png");
}

async function writePng(relative, buffer) {
  const file = path.join(root, relative);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, buffer);
}

function scene(ctx, w, h, a, b) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, a);
  g.addColorStop(1, b);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "rgba(255,250,244,0.18)";
  ctx.beginPath();
  ctx.arc(w * 0.82, h * 0.22, w * 0.18, 0, Math.PI * 2);
  ctx.fill();
}

async function buildImages() {
  await writePng("assets/og-lapohub.png", canvasOf(1200, 630, (ctx, w, h) => {
    scene(ctx, w, h, "#1c2433", "#3a2a22");
    ctx.fillStyle = "#e3b15a";
    ctx.fillRect(80, 150, 84, 12);
    ctx.fillStyle = "#fffaf4";
    ctx.font = "680 92px sans-serif";
    ctx.fillText("LapoHub", 80, 280);
    ctx.font = "36px sans-serif";
    ctx.fillStyle = "#f4efe6";
    ctx.fillText("International conversation and digital learning", 80, 360);
    ctx.fillStyle = "#e3b15a";
    ctx.fillText("lapohub.com", 80, 430);
  }));

  const icon = (size) => canvasOf(size, size, (ctx, w, h) => {
    ctx.fillStyle = "#1c2433";
    roundRect(ctx, 0, 0, w, h, w * 0.22);
    ctx.fill();
    ctx.strokeStyle = "#e3b15a";
    ctx.lineWidth = Math.max(4, size * 0.07);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(w * 0.28, h * 0.72);
    ctx.lineTo(w * 0.28, h * 0.28);
    ctx.lineTo(w * 0.58, h * 0.28);
    ctx.stroke();
    ctx.fillStyle = "#b5523a";
    ctx.beginPath();
    ctx.arc(w * 0.7, h * 0.38, w * 0.07, 0, Math.PI * 2);
    ctx.fill();
  });

  await writePng("favicon-48.png", icon(48));
  await writePng("favicon-192.png", icon(192));
  await writePng("favicon-512.png", icon(512));
  const png48 = canvasOf(48, 48, (ctx, w, h) => {
    ctx.fillStyle = "#1c2433";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#e3b15a";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(12, 34);
    ctx.lineTo(12, 12);
    ctx.lineTo(28, 12);
    ctx.stroke();
  });
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry[0] = 48;
  entry[1] = 48;
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png48.length, 8);
  entry.writeUInt32LE(22, 12);
  await writeFile(path.join(root, "favicon.ico"), Buffer.concat([header, entry, png48]));

  const productArt = {
    "journal.png": (ctx, w, h) => {
      scene(ctx, w, h, "#f4efe6", "#e7d3b0");
      ctx.fillStyle = "#1c2433";
      roundRect(ctx, 70, 40, 220, 280, 16);
      ctx.fill();
      ctx.fillStyle = "#e3b15a";
      ctx.fillRect(150, 40, 18, 280);
    },
    "headset.png": (ctx, w, h) => {
      scene(ctx, w, h, "#1c2433", "#246247");
      ctx.strokeStyle = "#fffaf4";
      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.arc(180, 170, 90, Math.PI, 0);
      ctx.stroke();
      ctx.fillStyle = "#e3b15a";
      roundRect(ctx, 70, 160, 36, 70, 10);
      ctx.fill();
      roundRect(ctx, 254, 160, 36, 70, 10);
      ctx.fill();
    },
    "lamp.png": (ctx, w, h) => {
      scene(ctx, w, h, "#2a3548", "#b7791f");
      ctx.fillStyle = "#fffaf4";
      ctx.beginPath();
      ctx.moveTo(180, 50);
      ctx.lineTo(250, 180);
      ctx.lineTo(110, 180);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(168, 180, 24, 90);
      ctx.fillRect(130, 270, 100, 16);
    },
    "cards.png": (ctx, w, h) => {
      scene(ctx, w, h, "#fffaf4", "#f0d2c6");
      ctx.fillStyle = "#62456f";
      roundRect(ctx, 80, 70, 150, 200, 14);
      ctx.fill();
      ctx.fillStyle = "#1c2433";
      roundRect(ctx, 130, 110, 150, 200, 14);
      ctx.fill();
    }
  };
  for (const [name, draw] of Object.entries(productArt)) {
    await writePng(`assets/products/${name}`, canvasOf(640, 480, draw));
  }
  for (const article of articles) {
    await writePng(`assets/articles/${article.slug}.png`, canvasOf(800, 480, (ctx, w, h) => scene(ctx, w, h, "#1c2433", "#b5523a")));
  }
  for (const course of courses) {
    await writePng(`assets/courses/${course.slug}.png`, canvasOf(800, 480, (ctx, w, h) => scene(ctx, w, h, "#246247", "#e3b15a")));
  }
  await writePng("assets/ai/storyboard.png", canvasOf(800, 480, (ctx, w, h) => scene(ctx, w, h, "#1c2433", "#e3b15a")));
  await writePng("assets/ai/prompt.png", canvasOf(800, 480, (ctx, w, h) => scene(ctx, w, h, "#62456f", "#f4efe6")));
  await writePng("assets/ai/edit.png", canvasOf(800, 480, (ctx, w, h) => scene(ctx, w, h, "#b5523a", "#1c2433")));
}

async function buildPages() {
  for (const page of pages) {
    const html = shell(page);
    const clean = page.pathname.replace(/^\/+|\/+$/g, "");
    const file = page.file
      ? path.join(root, page.file)
      : clean
        ? path.join(root, clean, "index.html")
        : path.join(root, "index.html");
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, html);
  }
  const urls = pages
    .filter((page) => !page.noindex && page.pathname !== "/404.html")
    .map((page) => `  <url><loc>${SITE}${page.pathname === "/" ? "/" : page.pathname}</loc><lastmod>2026-11-02</lastmod></url>`)
    .join("\n");
  await writeFile(path.join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
}

const stale = [
  "assets/index-BA91RANk.js",
  "assets/index-BxJ28E2m.js",
  "assets/SiteFooter-BCEgAcxb.js",
  "assets/terms-DX1bOgGE.js",
  "assets/privacy-CTW2ydfS.js",
  "assets/contact-Wz-2baKe.js",
  "assets/about-xXvOyurZ.js",
  "assets/styles-5F5pSNYI.css",
  "assets/denichat-logo-CnMczFfq.webp",
  "denichat-logo.webp"
];

await buildImages();
await buildPages();
for (const file of stale) {
  await rm(path.join(root, file), { force: true });
}
console.log(`Built ${pages.length} pages`);
