/* SOL Lab Biology: fit every screen and window into the frame (v6.5.0, from SOL Labyrinth v5.17.2).
   The Canvas embed code is width="100%" height="500", so a screen or window can be taller than the frame. The CSS
   already tightens the start screens and windows when the frame is short (css/after-hours.css, "short frames").
   This shrinks whatever still doesn't fit: it measures a visible screen's (or window's) contents and sets CSS zoom
   on its children until they fit, down to a floor (then the box scrolls, and nothing is cut off at the top). It
   undoes the zoom when the frame grows (full screen). Nothing changes when everything already fits.
   It runs when the frame resizes and when a screen or window opens or changes; it never touches the play area
   (the maze, the shooters, the HUD). */
(function () {
  "use strict";
  /* the boxes, the smallest zoom for each, and which children to leave alone (they scroll by themselves) */
  var TARGETS = [
    { sel: "#state-screen, #title-screen, #mode-screen, #skill-screen", min: 0.6 },
    { sel: "#overlay .box, #char-panel, #tut-card, #trap-card, #codex-card, #read-card, #progress-overlay .tut-card, #restore-overlay .tut-card, #acc-overlay .acc-card, #leave-overlay .tut-card", min: 0.72, card: true }
  ];
  var pending = false, lastW = 0, lastH = 0;
  function visible(el) {
    if (!el || !el.isConnected) return false;
    if (el.closest(".hidden")) return false;
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }
  function px(v) { var n = parseFloat(v); return isFinite(n) ? n : 0; }
  function kidsOf(box) {
    return Array.prototype.filter.call(box.children, function (k) {
      if (k.tagName === "SCRIPT" || k.tagName === "STYLE") return false;
      var cs = getComputedStyle(k);
      return cs.display !== "none" && cs.position !== "absolute" && cs.position !== "fixed";
    });
  }
  /* the height the children take now, top margin to bottom margin (visual pixels) */
  function span(kids, z) {
    var top = Infinity, bot = -Infinity;
    kids.forEach(function (k) {
      var r = k.getBoundingClientRect(), cs = getComputedStyle(k);
      if (!r.height && !r.width) return;
      top = Math.min(top, r.top - px(cs.marginTop) * z);
      bot = Math.max(bot, r.bottom + px(cs.marginBottom) * z);
    });
    return bot > top ? bot - top : 0;
  }
  /* the room the box has for its children (visual pixels) */
  function room(box, card) {
    var cs = getComputedStyle(box), pad = px(cs.paddingTop) + px(cs.paddingBottom) + px(cs.borderTopWidth) + px(cs.borderBottomWidth);
    if (!card) return box.clientHeight - px(cs.paddingTop) - px(cs.paddingBottom);
    var limit = window.innerHeight - 16;
    var mh = cs.maxHeight;
    if (mh && mh !== "none" && /px$/.test(mh)) limit = Math.min(limit, px(mh));
    /* a window inside a padded overlay: leave the overlay's padding */
    var ov = box.parentElement, ocs = ov && getComputedStyle(ov);
    if (ocs && (ocs.position === "fixed" || ocs.position === "absolute")) limit = Math.min(limit, ov.clientHeight - px(ocs.paddingTop) - px(ocs.paddingBottom));
    return limit - pad;
  }
  function setZoom(kids, z) { kids.forEach(function (k) { k.style.zoom = z === 1 ? "" : String(z); }); }
  /* the largest zoom (1 down to the floor) at which the children fit; text rewraps as it shrinks, so this searches
     instead of dividing once */
  function fitBox(box, t) {
    var kids = kidsOf(box);
    if (!kids.length) return;
    var have = room(box, t.card) - 1;
    if (have <= 0) return;
    function fits(z) { setZoom(kids, z); return span(kids, z) <= have; }
    var z = 1;
    if (!fits(1)) {
      var lo = t.min, hi = 1;
      if (fits(lo)) {
        for (var i = 0; i < 7; i++) { var mid = (lo + hi) / 2; if (fits(mid)) lo = mid; else hi = mid; }
      }
      z = Math.floor(lo * 100) / 100;
      setZoom(kids, z);
    }
    box._solFitZ = z;
    if (z === 1) box.removeAttribute("data-fit"); else box.setAttribute("data-fit", String(z));
  }
  function fitAll() {
    pending = false;
    TARGETS.forEach(function (t) {
      Array.prototype.forEach.call(document.querySelectorAll(t.sel), function (box) {
        if (!visible(box)) return;
        try { fitBox(box, t); } catch (e) { if (window.console) console.warn("SolFit", e); }
      });
    });
  }
  function soon() { if (pending) return; pending = true; (window.requestAnimationFrame || setTimeout)(fitAll); }
  function start() {
    lastW = window.innerWidth; lastH = window.innerHeight;
    window.addEventListener("resize", function () {
      if (window.innerWidth === lastW && window.innerHeight === lastH) return;
      lastW = window.innerWidth; lastH = window.innerHeight;
      soon();
    });
    try {
      new MutationObserver(function (list) {
        for (var i = 0; i < list.length; i++) {
          var t = list[i].target;
          /* the HUD and the play area change all the time and are never fitted */
          if (t.closest && (t.closest("#hud") || t.closest("#game-root"))) continue;
          soon(); return;
        }
      }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "hidden"], characterData: true });
    } catch (e) {}
    soon();
    /* web fonts and images change the heights once they load */
    window.addEventListener("load", soon);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
  window.SolFit = { now: fitAll };
})();
