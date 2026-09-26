/* ModDownloader website — minimal, dependency-free JS.
 * No analytics, no tracking, no cookies. */
(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};

  /* ---- Fill [data-config="KEY"] elements ---- */
  document.querySelectorAll("[data-config]").forEach(function (el) {
    var v = C[el.getAttribute("data-config")];
    if (v !== undefined && v !== null && v !== "") el.textContent = v;
  });

  /* ---- Download buttons: enable only when an official URL is configured ---- */
  document.querySelectorAll("[data-download-btn]").forEach(function (a) {
    if (C.DOWNLOAD_URL) {
      a.href = C.DOWNLOAD_URL;
      a.removeAttribute("disabled");
      a.setAttribute("aria-label", "Download " + C.APP_NAME + " for Windows (" + C.DOWNLOAD_SIZE + ")");
    } else {
      a.setAttribute("aria-disabled", "true");
      a.setAttribute("disabled", "disabled");
      a.removeAttribute("href");
      a.title = "Download link not published yet";
    }
  });
  document.querySelectorAll("[data-url-note]").forEach(function (el) {
    el.hidden = !!C.DOWNLOAD_URL;
  });

  /* ---- OS detection (informational only; nothing is stored or sent) ---- */
  document.querySelectorAll("[data-os-note]").forEach(function (el) {
    var ua = navigator.userAgent;
    var isWin = /Windows NT/.test(ua);
    var isMac = /Macintosh|Mac OS X/.test(ua);
    var isLinux = /Linux/.test(ua) && !isMac && !/Android/.test(ua);
    var isAndroid = /Android/.test(ua);
    var isIOS = /iPhone|iPad|iPod/.test(ua);
    var label = isWin ? "Windows detected" :
      isMac ? "macOS detected" :
        isAndroid ? "Android detected" :
          isIOS ? "iOS detected" :
            isLinux ? "Linux detected" : "Operating system not detected";
    var pill = document.createElement("span");
    pill.className = "pill";
    pill.textContent = label;
    el.appendChild(pill);
    if (!isWin) {
      var msg = document.createElement("p");
      msg.className = "muted mt";
      msg.textContent = C.APP_NAME + " is currently distributed for Windows.";
      el.appendChild(msg);
    }
  });

  /* ---- Supported version chips ---- */
  document.querySelectorAll("[data-version-chips]").forEach(function (el) {
    (C.SUPPORTED_VERSIONS || []).forEach(function (v) {
      var chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = v;
      el.appendChild(chip);
    });
  });

  /* ---- Loader cards ---- */
  document.querySelectorAll("[data-loader-cards]").forEach(function (el) {
    (C.SUPPORTED_LOADERS || []).forEach(function (l) {
      var card = document.createElement("div");
      card.className = "card feature";
      var badge = l.status === "Supported" ? "badge-ok" : "badge-warn";
      var h = document.createElement("h3");
      var dot = document.createElement("span");
      dot.className = "icon-dot";
      dot.setAttribute("aria-hidden", "true");
      h.appendChild(dot);
      h.appendChild(document.createTextNode(l.name));
      var b = document.createElement("span");
      b.className = "badge " + badge;
      b.textContent = l.status;
      h.appendChild(b);
      card.appendChild(h);
      var p = document.createElement("p");
      p.className = "muted";
      p.textContent = l.status === "Experimental"
        ? l.name + " is selectable, but launching may fall back to vanilla while loader metadata is unavailable."
        : "Select " + l.name + " when creating or editing an instance.";
      card.appendChild(p);
      el.appendChild(card);
    });
  });

  /* ---- Mobile nav ---- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  /* ---- Screenshot lightbox ---- */
  var lb = document.createElement("div");
  lb.className = "lightbox";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Screenshot viewer");
  lb.innerHTML = '<button class="close" type="button">Close ✕</button><img alt="">';
  document.body.appendChild(lb);
  var lbImg = lb.querySelector("img");
  var lastFocus = null;
  function closeLb() {
    lb.classList.remove("open");
    if (lastFocus) lastFocus.focus();
    document.removeEventListener("keydown", onKey);
  }
  function onKey(e) { if (e.key === "Escape") closeLb(); }
  document.querySelectorAll("[data-shot]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      lastFocus = btn;
      lbImg.src = btn.getAttribute("data-shot");
      lbImg.alt = btn.querySelector("img") ? btn.querySelector("img").alt : "Screenshot";
      lb.classList.add("open");
      lb.querySelector(".close").focus();
      document.addEventListener("keydown", onKey);
    });
  });
  lb.querySelector(".close").addEventListener("click", closeLb);
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });

  /* ---- Footer contact / social placeholders ---- */
  document.querySelectorAll("[data-github-link]").forEach(function (a) {
    if (C.GITHUB_URL) a.href = C.GITHUB_URL;
    else { a.removeAttribute("href"); a.setAttribute("aria-disabled", "true"); a.title = "To be added"; }
  });
  document.querySelectorAll("[data-discord-link]").forEach(function (a) {
    if (C.DISCORD_URL) a.href = C.DISCORD_URL;
    else { a.removeAttribute("href"); a.setAttribute("aria-disabled", "true"); a.title = "To be added"; }
  });
})();
