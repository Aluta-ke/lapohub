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

  function initSpin() {
    var wheel = document.querySelector("[data-wheel]");
    var button = document.querySelector("[data-spin]");
    var result = document.querySelector("[data-spin-result]");
    if (!wheel || !button) return;
    var rotation = 0;
    var busy = false;
    var segments = ["Conversation", "Languages", "Practice quiz", "Reading", "Music", "Courses"];
    button.addEventListener("click", function () {
      if (busy) return;
      var today = new Date().toISOString().slice(0, 10);
      var spins = read("lapohub.spins", { date: today, count: 0 });
      if (spins.date !== today) spins = { date: today, count: 0 };
      if (spins.count >= 5) {
        if (result) result.textContent = "You have used today's five spins. Come back tomorrow.";
        return;
      }
      busy = true;
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      rotation += reduce ? 60 : 1440 + Math.floor(Math.random() * 360);
      wheel.style.transform = "rotate(" + rotation + "deg)";
      if (result) result.textContent = "Spinning…";
      window.setTimeout(function () {
        busy = false;
        var index = Math.floor((((360 - (rotation % 360)) % 360) / 60)) % segments.length;
        var reward = segments[index];
        spins.count += 1;
        write("lapohub.spins", spins);
        addEntry("Spin reward: " + reward);
        if (result) result.textContent = "You landed on " + reward + ". It is saved in your dashboard. " + spins.count + " of 5 spins used today.";
      }, reduce ? 250 : 4500);
    });
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
      learn.textContent = parts.length ? parts.join(" · ") : "No lesson or article progress is stored in this browser yet.";
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
  initMusic();
  initCatalog();
  initAge();
  paintDashboard();
})();
