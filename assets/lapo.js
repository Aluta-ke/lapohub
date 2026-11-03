(function () {
  "use strict";

  var REG = "https://www.lofthela.com/user/register.php?ref=Lapohub";
  var KEYS = {
    profile: "lapohub.profile",
    articles: "lapohub.articles",
    courses: "lapohub.courses",
    trivia: "lapohub.trivia",
    age: "lapohub.age",
    entries: "lapohub.entries"
  };

  function markLively() {
    var links = document.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      var text = links[i].textContent.replace(/\s+/g, " ").trim();
      if (text === "Contact Us" || text === "Join WhatsApp Channel") links[i].classList.add("wa-live");
    }
    var labels = document.querySelectorAll(".pill-live, .card .meta");
    for (var j = 0; j < labels.length; j++) {
      if (labels[j].textContent.replace(/\s+/g, " ").trim() === "Active") labels[j].classList.add("is-active-pop");
    }
  }

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }

  function profile() {
    return read(KEYS.profile, { displayName: "", region: guessRegion() });
  }

  function guessRegion() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (tz === "Africa/Kampala") return "UG";
    } catch (e) {}
    return "OTHER";
  }

  function bonusCopy(region) {
    if (region === "UG") {
      return {
        place: "Uganda",
        amount: "UGX 10,000",
        status: "Promotion. Added to your active account wallet and credited immediately after activation."
      };
    }
    return {
      place: "Other regions",
      amount: "USD 2",
      status: "Promotion. Added to your active account wallet and credited immediately after activation."
    };
  }

  function initNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-nav]");
    if (!toggle || !nav) return;
    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }
    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });
    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      setOpen(false);
    });
  }

  function initCopy() {
    document.querySelectorAll("[data-copy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var el = document.querySelector(btn.getAttribute("data-copy"));
        var value = (el ? (el.value || el.textContent || "") : REG).trim();
        var done = function () {
          btn.textContent = "Copied";
          setTimeout(function () { btn.textContent = "Copy link"; }, 1600);
        };
        var fallback = function () {
          var input = document.createElement("textarea");
          input.value = value;
          document.body.appendChild(input);
          input.select();
          var ok = false;
          try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
          input.remove();
          if (ok) done();
          else btn.textContent = "Select the link";
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(value).then(done).catch(fallback);
        } else fallback();
      });
    });
  }

  function addEntry(detail) {
    var entries = read(KEYS.entries, []);
    entries.unshift({ detail: detail, at: new Date().toISOString() });
    write(KEYS.entries, entries.slice(0, 12));
  }

  function initPreviewForms() {
    document.querySelectorAll("[data-preview-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var data = new FormData(form);
        var activity = data.get("activity") || "Activity";
        var notes = (data.get("notes") || "").toString().trim();
        addEntry(activity + (notes ? ": " + notes.slice(0, 80) : ""));
        var slot = form.querySelector("[data-form-result]");
        if (slot) slot.textContent = "Saved. This activity is now in your dashboard history.";
        form.reset();
      });
    });
  }

  function initSaveItems() {
    document.querySelectorAll("[data-save-item]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var name = btn.getAttribute("data-save-item");
        addEntry("Saved " + name);
        var slot = btn.parentElement && btn.parentElement.parentElement
          ? btn.parentElement.parentElement.querySelector("[data-save-result]")
          : null;
        if (slot) slot.textContent = name + " is on your list.";
      });
    });
  }

  function initProfileForm() {
    var form = document.querySelector("[data-profile-form]");
    if (!form) return;
    var current = profile();
    if (form.displayName) form.displayName.value = current.displayName || "";
    if (form.region) form.region.value = current.region || "OTHER";
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      write(KEYS.profile, {
        displayName: (form.displayName.value || "").trim().slice(0, 40),
        region: form.region.value === "UG" ? "UG" : "OTHER"
      });
      var slot = form.querySelector("[data-form-result]");
      if (slot) slot.textContent = "Saved. This promotion is added to your active account wallet and credited for active users immediately after activation.";
      paintBonus();
      paintDashboard();
    });
  }

  function paintBonus() {
    var data = bonusCopy(profile().region);
    document.querySelectorAll("[data-bonus-amount]").forEach(function (el) { el.textContent = data.amount; });
    document.querySelectorAll("[data-bonus-place]").forEach(function (el) { el.textContent = data.place; });
    document.querySelectorAll("[data-bonus-status]").forEach(function (el) { el.textContent = data.status; });
  }

  function initReading() {
    var article = document.querySelector("[data-article]");
    var bar = document.querySelector("[data-read-bar]");
    if (!article) return;
    var slug = article.getAttribute("data-article");
    function paint() {
      var rect = article.getBoundingClientRect();
      var viewed = Math.min(rect.height, Math.max(0, window.innerHeight - rect.top));
      var seen = rect.height ? Math.min(100, Math.max(0, Math.round((viewed / rect.height) * 100))) : 0;
      if (bar) bar.style.width = seen + "%";
      var all = read(KEYS.articles, {});
      all[slug] = Math.max(all[slug] || 0, seen);
      write(KEYS.articles, all);
      var label = document.querySelector("[data-read-label]");
      if (label) label.textContent = seen + "% of this article is in view";
    }
    paint();
    window.addEventListener("scroll", paint, { passive: true });
  }

  function initCourses() {
    document.querySelectorAll("[data-course]").forEach(function (box) {
      var id = box.getAttribute("data-course");
      var saved = read(KEYS.courses, {});
      var done = saved[id] || [];
      box.querySelectorAll("[data-lesson]").forEach(function (input) {
        var lesson = input.getAttribute("data-lesson");
        input.checked = done.indexOf(lesson) !== -1;
        input.addEventListener("change", function () {
          var current = read(KEYS.courses, {});
          var list = current[id] || [];
          if (input.checked && list.indexOf(lesson) === -1) list.push(lesson);
          if (!input.checked) list = list.filter(function (item) { return item !== lesson; });
          current[id] = list;
          write(KEYS.courses, current);
          paintCourse(box, id);
        });
      });
      paintCourse(box, id);
    });
  }

  function paintCourse(box, id) {
    var inputs = box.querySelectorAll("[data-lesson]");
    var done = (read(KEYS.courses, {})[id] || []).length;
    var label = box.querySelector("[data-course-label]");
    if (label) label.textContent = done + " of " + inputs.length + " lessons marked complete on this device";
    var bar = box.querySelector("[data-course-bar]");
    if (bar) bar.style.width = (inputs.length ? Math.round((done / inputs.length) * 100) : 0) + "%";
  }

  function initQuiz() {
    var root = document.querySelector("[data-quiz]");
    if (!root) return;
    var button = root.querySelector("[data-grade]");
    var result = root.querySelector("[data-quiz-result]");
    if (!button) return;
    button.addEventListener("click", function () {
      var questions = root.querySelectorAll("[data-correct]");
      var score = 0;
      questions.forEach(function (q) {
        var expected = q.getAttribute("data-correct");
        var chosen = q.querySelector("input:checked");
        q.querySelectorAll(".choice").forEach(function (choice) { choice.classList.remove("is-correct", "is-wrong"); });
        q.querySelectorAll(".choice").forEach(function (choice) {
          var input = choice.querySelector("input");
          if (!input) return;
          if (input.value === expected) choice.classList.add("is-correct");
          else if (chosen && input === chosen) choice.classList.add("is-wrong");
        });
        if (chosen && chosen.value === expected) score += 1;
      });
      var category = root.getAttribute("data-quiz") || "practice";
      var history = read(KEYS.trivia, []);
      history.unshift({ category: category, score: score, total: questions.length, at: new Date().toISOString() });
      write(KEYS.trivia, history.slice(0, 12));
      if (result) {
        result.textContent = "Score: " + score + " / " + questions.length + ". Saved to your dashboard.";
      }
    });
  }

  function wheelAngle(el) {
    var transform = window.getComputedStyle(el).transform;
    if (!transform || transform === "none") return 0;
    var values = transform.match(/-?\d+\.?\d*(?:e-?\d+)?/gi);
    if (!values || values.length < 4) return 0;
    var angle = Math.atan2(parseFloat(values[1]), parseFloat(values[0])) * (180 / Math.PI);
    return angle < 0 ? angle + 360 : angle;
  }

  function initSpin() {
    var wheel = document.querySelector("[data-wheel]");
    var stage = document.querySelector(".wheel-stage");
    var button = document.querySelector("[data-spin]");
    var result = document.querySelector("[data-spin-result]");
    if (!wheel || !button) return;
    var busy = false;
    var motion = 0;
    var segments = ["Conversation", "Languages", "Practice quiz", "Trivia", "Music", "Lessons"];
    var reduceQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    if (!reduceQuery || !reduceQuery.matches) wheel.classList.add("is-idling");

    function spin(fromUser) {
      if (busy) return;
      var today = new Date().toISOString().slice(0, 10);
      var spins = read("lapohub.spins", { date: today, count: 0 });
      if (spins.date !== today) spins = { date: today, count: 0 };
      if (spins.count >= 5) {
        if (fromUser && result) result.textContent = "You have used today's five spins. Come back tomorrow.";
        return;
      }
      busy = true;
      var ticket = ++motion;
      var reduce = reduceQuery && reduceQuery.matches;
      var start = wheelAngle(wheel);
      var rotation = start + (reduce ? 60 : 1800 + Math.floor(Math.random() * 360));
      wheel.classList.remove("is-idling");
      wheel.style.transition = "none";
      wheel.style.transform = "rotate(" + start + "deg)";
      if (stage) stage.classList.add("is-spinning");
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          wheel.style.transition = "";
          wheel.style.transform = "rotate(" + rotation + "deg)";
        });
      });
      if (result) result.textContent = "Spinning…";
      window.setTimeout(function () {
        busy = false;
        var landed = ((rotation % 360) + 360) % 360;
        var index = Math.floor((((360 - landed) % 360) / 60)) % segments.length;
        var reward = segments[index];
        spins.count += 1;
        write("lapohub.spins", spins);
        addEntry("Spin reward: " + reward);
        if (result) result.textContent = "You landed on " + reward + ". It is saved in your dashboard. " + spins.count + " of 5 spins used today.";
        if (stage) stage.classList.remove("is-spinning");
        if (!reduce) {
          window.setTimeout(function () {
            if (ticket !== motion) return;
            wheel.style.transition = "none";
            wheel.style.setProperty("--wheel-base", landed + "deg");
            wheel.classList.add("is-idling");
            wheel.style.transform = "";
          }, 1200);
        }
      }, reduce ? 250 : 4700);
    }

    button.addEventListener("click", function () { spin(true); });

    if (reduceQuery && reduceQuery.matches) return;
    var seen = false;
    function begin() {
      if (seen) return;
      seen = true;
      spin(false);
    }
    if (stage && "IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          begin();
        });
      }, { threshold: 0.55 });
      observer.observe(stage);
    } else {
      begin();
    }
  }

  function initSpinCards() {
    var photos = document.querySelectorAll(".card-photo-spin");
    if (!photos.length) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle("is-turning", entry.isIntersecting);
      });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(photos, function (photo) { observer.observe(photo); });
  }

  var tracks = [
    { title: "Paper Lantern", category: "Calm", bpm: 70, notes: [69, 72, 76, 79, 76, 72, 67, 64] },
    { title: "Study Window", category: "Focus", bpm: 84, notes: [60, 67, 72, 67, 64, 67, 72, 76] },
    { title: "Market Morning", category: "Bright", bpm: 96, notes: [72, 76, 79, 76, 74, 72, 69, 72] }
  ];

  function initMusic() {
    var list = document.querySelector("[data-track-list]");
    var status = document.querySelector("[data-player-status]");
    var bar = document.querySelector("[data-player-bar]");
    var toggle = document.querySelector("[data-player-toggle]");
    if (!list) return;
    var audioCtx = null;
    var timer = null;
    var step = 0;
    var current = 0;
    var playing = false;

    tracks.forEach(function (track, index) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "track" + (index === 0 ? " is-active" : "");
      btn.innerHTML = '<span class="art" style="background:linear-gradient(135deg,' + ["#1c2433,#e3b15a", "#246247,#f4efe6", "#b5523a,#e3b15a"][index] + ')"></span><span><strong>' + track.title + '</strong><br><span class="muted">' + track.category + " · original demo</span></span><span>Play</span>";
      btn.addEventListener("click", function () {
        current = index;
        step = 0;
        list.querySelectorAll(".track").forEach(function (el) { el.classList.remove("is-active"); });
        btn.classList.add("is-active");
        start();
      });
      list.appendChild(btn);
    });

    function ensure() {
      if (!audioCtx) {
        var Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return null;
        audioCtx = new Ctx();
      }
      return audioCtx;
    }

    function beep(note, when, dur) {
      var ctx = ensure();
      if (!ctx) return;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = 440 * Math.pow(2, (note - 69) / 12);
      gain.gain.setValueAtTime(0.0001, when);
      gain.gain.exponentialRampToValueAtTime(0.08, when + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(when);
      osc.stop(when + dur + 0.02);
    }

    function stop() {
      playing = false;
      if (timer) window.clearInterval(timer);
      timer = null;
      if (toggle) toggle.textContent = "Play";
    }

    function start() {
      var ctx = ensure();
      if (!ctx) {
        if (status) status.textContent = "This browser cannot play the original demo audio.";
        return;
      }
      if (ctx.state === "suspended") ctx.resume();
      stop();
      playing = true;
      if (toggle) toggle.textContent = "Pause";
      var track = tracks[current];
      if (status) status.textContent = "Playing " + track.title + " · " + track.category;
      timer = window.setInterval(function () {
        if (!playing) return;
        var note = track.notes[step % track.notes.length];
        beep(note, ctx.currentTime, 0.28);
        step += 1;
        if (bar) bar.style.width = ((step % track.notes.length) / track.notes.length) * 100 + "%";
      }, Math.round(60000 / track.bpm));
    }

    if (toggle) {
      toggle.addEventListener("click", function () {
        if (playing) {
          stop();
          if (status) status.textContent = "Paused. These are original LapoHub demos, not a commercial catalog.";
        } else start();
      });
    }
  }

  function initCatalog() {
    var search = document.querySelector("[data-filter-search]");
    var select = document.querySelector("[data-filter-category]");
    var cards = document.querySelectorAll("[data-filter-item]");
    if (!search && !select) return;
    function apply() {
      var q = search ? search.value.trim().toLowerCase() : "";
      var cat = select ? select.value : "all";
      cards.forEach(function (card) {
        var name = (card.getAttribute("data-name") || "").toLowerCase();
        var category = card.getAttribute("data-category") || "";
        var visible = (!q || name.indexOf(q) !== -1) && (cat === "all" || category === cat);
        card.hidden = !visible;
      });
    }
    if (search) search.addEventListener("input", apply);
    if (select) select.addEventListener("change", apply);
  }

  function initAge() {
    var gate = document.querySelector("[data-age-gate]");
    if (!gate) return;
    var panel = gate.querySelector("[data-age-panel]");
    var content = gate.querySelector("[data-age-content]");
    function open() {
      if (panel) panel.hidden = true;
      if (content) content.hidden = false;
    }
    if (sessionStorage.getItem(KEYS.age) === "yes") open();
    gate.querySelectorAll("[data-age]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.getAttribute("data-age") === "yes") {
          sessionStorage.setItem(KEYS.age, "yes");
          open();
        } else if (panel) {
          panel.innerHTML = "<h2>This section is limited to adults</h2><p class='lede'>Sports predictions are hidden because you did not confirm that you are 18 or older. LapoHub does not offer betting.</p>";
        }
      });
    });
  }

  function paintDashboard() {
    if (!document.querySelector("[data-dashboard]")) return;
    var person = profile();
    var name = document.querySelector("[data-display-name]");
    if (name) name.textContent = person.displayName || "Not set on this device";
    var history = document.querySelector("[data-task-history]");
    if (history) {
      var trivia = read(KEYS.trivia, []);
      var entries = read(KEYS.entries, []);
      history.innerHTML = "";
      if (!trivia.length && !entries.length) {
        history.innerHTML = "<li>No activity results yet. Spin, take a quiz, or save an item.</li>";
      }
      entries.forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = item.detail + " · " + item.at.slice(0, 10);
        history.appendChild(li);
      });
      trivia.forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = "Quiz " + item.category + ": " + item.score + "/" + item.total + " · " + item.at.slice(0, 10);
        history.appendChild(li);
      });
    }
    var learn = document.querySelector("[data-learning-summary]");
    if (learn) {
      var articles = read(KEYS.articles, {});
      var courses = read(KEYS.courses, {});
      var articleBits = Object.keys(articles).map(function (key) { return key + " " + articles[key] + "%"; });
      var courseBits = Object.keys(courses).map(function (key) { return key + " (" + courses[key].length + " lessons checked)"; });
      var parts = articleBits.concat(courseBits);
      learn.textContent = parts.length ? parts.join(" · ") : "No saved progress is stored in this browser yet.";
    }
    var notes = document.querySelector("[data-notifications]");
    if (notes) {
      notes.innerHTML = "";
      [
        bonusCopy(person.region).status,
        person.displayName ? "Display name is saved only in this browser." : "You can save a display name on this device. It is not an account."
      ].forEach(function (text) {
        var li = document.createElement("li");
        li.textContent = text;
        notes.appendChild(li);
      });
    }
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(function () {});
  }

  markLively();
  initNav();
  initCopy();
  initPreviewForms();
  initSaveItems();
  initProfileForm();
  paintBonus();
  initReading();
  initCourses();
  initQuiz();
  initSpin();
  initSpinCards();
  initMusic();
  initCatalog();
  initAge();
  paintDashboard();
  initLiveChat();

  function initLiveChat() {
    var root = document.querySelector("[data-live-chat]");
    if (!root) return;
    var countEl = root.querySelector("[data-live-count]");
    var membersEl = root.querySelector("[data-live-members]");
    var feed = root.querySelector("[data-live-feed]");
    var tickerTrack = root.querySelector("[data-live-ticker-track]");
    if (!countEl || !membersEl || !feed || !tickerTrack) return;

    var counts = [208, 214, 221, 230, 226, 219, 212, 217, 224, 233, 218, 206];
    var countIndex = 0;
    var peopleStart = 0;
    var messageStart = 0;
    var people = [
      { name: "Emily", country: "US" },
      { name: "Daniel", country: "CA" },
      { name: "Anna", country: "DE" },
      { name: "James", country: "GB" },
      { name: "Sophia", country: "AU" },
      { name: "David", country: "FR" },
      { name: "Emma", country: "NL" },
      { name: "Lars", country: "SE" },
      { name: "Ingrid", country: "NO" },
      { name: "Marco", country: "IT" },
      { name: "Grace", country: "UG" },
      { name: "Sarah", country: "KE" }
    ];
    var messages = [
      { name: "Emily", country: "US", text: "Hi! Can someone teach me basic Swahili?" },
      { name: "Anna", country: "DE", text: "I'm from Germany and I would love to learn Luganda." },
      { name: "David", country: "FR", text: "Habari! I want to practise my Swahili." },
      { name: "James", country: "GB", text: "Can someone teach me how to greet people in Luganda?" },
      { name: "Sophia", country: "AU", text: "I am learning African languages. Anyone available to chat?" },
      { name: "Daniel", country: "CA", text: "I would love to make friends in Uganda." },
      { name: "Emma", country: "NL", text: "How do you say 'How are you?' in Swahili?" },
      { name: "Lars", country: "SE", text: "I want to practise African languages with someone from Kenya." },
      { name: "Ingrid", country: "NO", text: "Hello from Norway. I would love friends in Uganda." },
      { name: "Marco", country: "IT", text: "Ciao! Can we talk and practise Luganda together?" },
      { name: "Emily", country: "US", text: "I would love a friendly chat with someone from Uganda." },
      { name: "Anna", country: "DE", text: "Habari! Please teach me a simple Swahili greeting." },
      { name: "Grace", country: "UG", text: "Hello from Uganda. I can share a simple Luganda greeting." },
      { name: "Sarah", country: "KE", text: "Habari from Kenya. Shall we practise Swahili together?" }
    ];
    var tickerIcons = {
      join: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="6" cy="5.2" r="2.1" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M2.6 13c.4-2.1 1.8-3.2 3.4-3.2s3 .1 3.4 3.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M11 6.2v3.6M9.2 8h3.6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
      register: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2.4" width="10" height="11.2" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M5.4 6.4h5.2M5.4 9h3.4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
      chat: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.8 3.2h10.4v6.8H6.4L2.8 12.6V3.2z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
      activity: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.2l1.4 3 3.3.4-2.4 2.2.7 3.3L8 9.5 4.9 11.1l.7-3.3L3.2 5.6l3.3-.4z" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>',
      bonus: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2.4" y="7" width="11.2" height="6.4" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 7v6.4M2.4 9.2h11.2" stroke="currentColor" stroke-width="1.3"/><path d="M8 7C6.8 4.8 4.6 5 4.6 6.4S7 7 8 7s2.4-1.4 3.4-.6S9.2 4.8 8 7z" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>'
    };
    var activities = [
      { country: "UG", kind: "join", text: "James from Uganda joins LapoHub." },
      { country: "KE", kind: "register", text: "Sarah from Kenya registers an account." },
      { country: "TZ", kind: "chat", text: "Grace from Tanzania opens a practice chat." },
      { country: "CA", kind: "chat", text: "Emily from Canada opens a practice chat." },
      { country: "UG", kind: "bonus", text: "David from Uganda may qualify for UGX 10,000." },
      { country: "US", kind: "activity", text: "Daniel from the USA tries an activity." },
      { country: "DE", kind: "join", text: "Anna from Germany joins LapoHub." },
      { country: "GB", kind: "activity", text: "Michael from the UK tries an activity." },
      { country: "AU", kind: "chat", text: "Sophia from Australia says hello." },
      { country: "FR", kind: "register", text: "David from France registers an account." },
      { country: "NL", kind: "join", text: "Sarah from the Netherlands joins LapoHub." },
      { country: "KE", kind: "activity", text: "James from Kenya tries an activity." }
    ];
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function personByName(name) {
      for (var i = 0; i < people.length; i++) {
        if (people[i].name === name) return people[i];
      }
      return people[0];
    }

    function soften(node) {
      if (reduce || !node) return;
      node.classList.remove("lgc-soft");
      void node.offsetWidth;
      node.classList.add("lgc-soft");
    }

    function portrait(sizeClass) {
      var box = document.createElement("div");
      box.className = "lgc-avatar " + sizeClass;
      var img = document.createElement("img");
      img.alt = "";
      img.width = 160;
      img.height = 160;
      img.decoding = "async";
      box.appendChild(img);
      var dot = document.createElement("span");
      dot.className = "lgc-presence";
      dot.setAttribute("aria-hidden", "true");
      box.appendChild(dot);
      return box;
    }

    function flagNode() {
      var img = document.createElement("img");
      img.className = "lgc-flag";
      img.alt = "";
      img.width = 18;
      img.height = 12;
      return img;
    }

    function setFlag(img, code) {
      var next = "/assets/flags/" + code.toLowerCase() + ".svg";
      if (img.getAttribute("src") !== next) img.src = next;
    }

    function setPortrait(box, person) {
      var img = box.querySelector("img");
      var next = "/assets/promo/" + person.name.toLowerCase() + ".jpg";
      if (img.getAttribute("src") === next) return;
      img.onerror = function () {
        img.onerror = null;
        img.src = "/assets/promo/fallback.jpg";
      };
      img.src = next;
    }

    for (var m = 0; m < 5; m++) {
      var item = document.createElement("li");
      item.className = "lgc-member";
      item.appendChild(portrait("lgc-avatar-lg"));
      var name = document.createElement("span");
      name.className = "lgc-member-name";
      item.appendChild(name);
      item.appendChild(flagNode());
      membersEl.appendChild(item);
    }

    for (var r = 0; r < 3; r++) {
      var row = document.createElement("article");
      row.className = "lgc-row";
      row.appendChild(portrait("lgc-avatar-sm"));
      var body = document.createElement("div");
      var who = document.createElement("p");
      who.className = "lgc-who";
      var strong = document.createElement("strong");
      who.appendChild(strong);
      who.appendChild(flagNode());
      var msg = document.createElement("p");
      msg.className = "lgc-msg";
      body.appendChild(who);
      body.appendChild(msg);
      row.appendChild(body);
      feed.appendChild(row);
    }

    function iconNode(kind) {
      var wrap = document.createElement("span");
      wrap.className = "lgc-tick-icon lgc-tick-" + kind;
      wrap.innerHTML = tickerIcons[kind] || tickerIcons.join;
      return wrap;
    }

    function addTickerSet(hidden) {
      activities.forEach(function (item) {
        var tick = document.createElement("span");
        tick.className = "lgc-tick";
        if (hidden) tick.setAttribute("aria-hidden", "true");
        tick.appendChild(iconNode(item.kind));
        var flag = flagNode();
        setFlag(flag, item.country);
        tick.appendChild(flag);
        var label = document.createElement("span");
        label.className = "lgc-tick-text";
        label.textContent = item.text;
        tick.appendChild(label);
        tickerTrack.appendChild(tick);
      });
    }
    addTickerSet(false);
    addTickerSet(true);

    function paintMembers(animate) {
      var slots = membersEl.children;
      for (var i = 0; i < slots.length; i++) {
        var person = people[(peopleStart + i) % people.length];
        var slot = slots[i];
        var nameEl = slot.querySelector(".lgc-member-name");
        if (nameEl.textContent === person.name) continue;
        setPortrait(slot.querySelector(".lgc-avatar"), person);
        nameEl.textContent = person.name;
        setFlag(slot.querySelector(".lgc-flag"), person.country);
        if (animate) soften(slot);
      }
    }

    function paintMessages(animate) {
      var rows = feed.children;
      for (var i = 0; i < rows.length; i++) {
        var sample = messages[(messageStart + i) % messages.length];
        var row = rows[i];
        var strong = row.querySelector("strong");
        if (strong.textContent === sample.name && row.querySelector(".lgc-msg").textContent === sample.text) continue;
        setPortrait(row.querySelector(".lgc-avatar"), personByName(sample.name));
        strong.textContent = sample.name;
        setFlag(row.querySelector(".lgc-flag"), sample.country);
        row.querySelector(".lgc-msg").textContent = sample.text;
        if (animate) soften(row.querySelector(".lgc-msg"));
      }
    }

    function paintCount(animate) {
      var next = counts[countIndex] + "+";
      if (countEl.textContent === next) return;
      countEl.textContent = next;
      if (animate) soften(countEl);
    }

    function tick(animate) {
      paintMembers(animate);
      paintMessages(animate);
      paintCount(animate);
    }

    tick(false);
    window.setInterval(function () {
      peopleStart = (peopleStart + 1) % people.length;
      messageStart = (messageStart + 1) % messages.length;
      countIndex = (countIndex + 1) % counts.length;
      tick(true);
    }, 2000);
  }
})();
