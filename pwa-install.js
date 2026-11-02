(function () {
  var key = "lapohub-install-dismissed";
  if (window.matchMedia("(display-mode: standalone)").matches) return;
  var deferred = null;
  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    deferred = event;
    if (localStorage.getItem(key)) return;
    var bar = document.createElement("div");
    bar.style.cssText = "position:fixed;right:12px;bottom:86px;z-index:50;background:#1c2433;color:#fffaf4;padding:12px;border-radius:16px;max-width:240px";
    bar.innerHTML = "<strong>Install LapoHub</strong><p style='margin:6px 0 10px'>Add this site to your home screen.</p>";
    var install = document.createElement("button");
    install.textContent = "Install";
    install.className = "btn btn-gold";
    var dismiss = document.createElement("button");
    dismiss.textContent = "Not now";
    dismiss.className = "btn btn-ghost";
    dismiss.style.marginLeft = "6px";
    install.addEventListener("click", function () {
      if (!deferred) return;
      deferred.prompt();
      deferred = null;
      bar.remove();
    });
    dismiss.addEventListener("click", function () {
      localStorage.setItem(key, "1");
      bar.remove();
    });
    bar.append(install, dismiss);
    document.body.appendChild(bar);
  });
})();
