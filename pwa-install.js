(function () {
  var key = "lapohub-install-dismissed";
  if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) return;
  try {
    if (localStorage.getItem(key)) return;
  } catch (error) {
    return;
  }

  var deferred = null;
  var stopped = false;
  var timer = 0;
  var nudgeTimer = 0;
  var pop = null;
  var phoneQuery = window.matchMedia("(max-width: 900px)");
  var apple =
    '<svg class="pwa-mark-apple" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path fill="currentColor" d="M11.6 8.3c0-1.5 1.2-2.2 1.3-2.3-.7-1-1.8-1.2-2.2-1.2-.9-.1-1.8.5-2.3.5-.5 0-1.2-.5-2-.5-1 0-2 .6-2.5 1.5-1.1 1.9-.3 4.7.8 6.2.5.7 1.1 1.5 1.9 1.5.8 0 1-.5 2-.5s1.2.5 2 .5 1.3-.7 1.8-1.5c.6-.8.8-1.6.8-1.6s-1.6-.6-1.6-2.6zM10.2 3.9c.4-.5.7-1.2.6-1.9-.6 0-1.3.4-1.7.9-.4.5-.7 1.2-.6 1.9.6.1 1.3-.3 1.7-.9z"/></svg>';
  var android =
    '<svg class="pwa-mark-android" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M7.2 8.2 6 6.1a.4.4 0 0 1 .7-.4l1.2 2.1A7 7 0 0 1 12 7c1.5 0 2.9.5 4.1 1.4l1.2-2.1a.4.4 0 1 1 .7.4l-1.2 2.1A6 6 0 0 1 18 12v3.2c0 .6-.4 1-1 1h-.6V19a1.2 1.2 0 0 1-2.4 0v-2.8h-3.9V19a1.2 1.2 0 0 1-2.4 0v-2.8H7c-.6 0-1-.4-1-1V12c0-1.4.5-2.7 1.2-3.8zM9 13.2a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8zm6 0a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8z"/></svg>';

  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    deferred = event;
  });

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function isIos() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
  }

  function build() {
    var bar = document.createElement("div");
    bar.className = "pwa-pop";
    bar.hidden = true;
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Install LapoHub on iPhone or Android");
    bar.innerHTML =
      '<button type="button" class="pwa-pop-install">' +
        '<span class="pwa-marks" aria-hidden="true">' + apple + android + "</span>" +
        '<span class="pwa-pop-label">Install</span>' +
      "</button>" +
      '<button type="button" class="pwa-pop-x" aria-label="Not now">×</button>';
    bar.querySelector(".pwa-pop-install").addEventListener("click", onInstall);
    bar.querySelector(".pwa-pop-x").addEventListener("click", dismiss);
    document.body.appendChild(bar);
    return bar;
  }

  function onInstall() {
    if (deferred) {
      var promptEvent = deferred;
      deferred = null;
      promptEvent.prompt();
      if (promptEvent.userChoice) {
        promptEvent.userChoice.then(function (choice) {
          if (choice && choice.outcome === "accepted") {
            stopped = true;
            window.clearTimeout(timer);
            window.clearTimeout(nudgeTimer);
            hide(true);
          }
        });
      }
      return;
    }
    var label = pop && pop.querySelector(".pwa-pop-label");
    if (label) label.textContent = isIos() ? "Share, then Add" : "Add to home screen";
  }

  function dismiss() {
    stopped = true;
    window.clearTimeout(timer);
    window.clearTimeout(nudgeTimer);
    try {
      localStorage.setItem(key, "1");
    } catch (error) {}
    hide(true);
  }

  function show() {
    if (stopped || !phoneQuery.matches) return;
    if (!pop) pop = build();
    var label = pop.querySelector(".pwa-pop-label");
    if (label) label.textContent = "Install";
    pop.hidden = false;
    pop.classList.remove("is-out", "is-nudge");
    void pop.offsetWidth;
    pop.classList.add("is-in");
  }

  function hide(remove) {
    if (!pop) return;
    window.clearTimeout(nudgeTimer);
    if (pop.hidden) {
      if (remove) pop.remove();
      return;
    }
    pop.classList.remove("is-in", "is-nudge");
    pop.classList.add("is-out");
    window.setTimeout(function () {
      if (!pop) return;
      pop.hidden = true;
      pop.classList.remove("is-out");
      if (remove) {
        pop.remove();
        pop = null;
      }
    }, 280);
  }

  function nudge() {
    if (!pop || pop.hidden) return;
    pop.classList.remove("is-nudge");
    void pop.offsetWidth;
    pop.classList.add("is-nudge");
  }

  function cycle() {
    if (stopped) return;
    if (!phoneQuery.matches) {
      hide(false);
      timer = window.setTimeout(cycle, 5000);
      return;
    }
    timer = window.setTimeout(function () {
      if (stopped) return;
      show();
      nudgeTimer = window.setTimeout(nudge, rand(1800, 3200));
      timer = window.setTimeout(function () {
        hide(false);
        timer = window.setTimeout(cycle, rand(11000, 26000));
      }, rand(6500, 11000));
    }, rand(2200, 7000));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", cycle);
  } else {
    cycle();
  }
})();
