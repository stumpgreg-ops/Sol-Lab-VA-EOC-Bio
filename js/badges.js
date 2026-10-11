/* SOL Lab Biology (from SOL Labyrinth): badges (v5.15).
   The badges are listed in js/progress-code.js (BADGES, append only, so a progress code can carry them as one bit
   each) with their names (badgeInfo). This file decides which are earned, from the progress record
   (js/progress.js: questions, standards, streaks, perfect levels, comebacks, days, minutes, each game mode's levels)
   and from the town or castle and the Fangs saved on this Chromebook. A badge, once earned, stays (it is in the
   record, the code and a restore). New ones pop up for a few seconds at the top of the screen; "My badges" on the
   title screen opens the gallery, earned in colour and the rest with what to do to earn them.
   Only the game modes of this game get mode badges (the Odyssey has its own modes). */
(function () {
  "use strict";
  var C = window.SolProgressCode;
  if (!C || !C.BADGES) return;
  var BUILD_KEY = "afterHours.v1.build", FANG_KEY = "afterHours.v1.fangs", NIGHT_KEY = "afterHours.v1.night";
  function P() { return window.SolProgress; }
  function num(v) { v = Math.floor(Number(v)); return isFinite(v) && v > 0 ? v : 0; }
  function modesHere() {
    var m = [];
    try { m = P() && P().modes ? P().modes() : []; } catch (e) {}
    return m && m.length ? m : ["ALL", "maze", "raid", "rocks", "sky", "ring", "worms"];
  }
  function modeName(m) {
    var n = "";
    try { n = P() && P().modeName ? P().modeName(m) : ""; } catch (e) {}
    return n && n !== m ? n : C.badgeInfo("m-" + m + "-10").name.replace(/ Bronze$/, "");
  }
  /* a standard code's strand: 9.RL.1.A -> RL; New Jersey L.VL.5.2 -> RV and RL.CT.5.8 -> DSR */
  /* v6.4 (Biology): the four strand badge pairs count Biology standards instead: RL = cells and chemistry
     (BIO.2-BIO.4), RI = heredity (BIO.5), RV = classification and evolution (BIO.6-BIO.7), DSR = investigation
     and ecology (BIO.1, BIO.8). The badge ids stay (a progress code carries them by number). */
  var BIO_STRAND = { 1: "DSR", 2: "RL", 3: "RL", 4: "RL", 5: "RI", 6: "RV", 7: "RV", 8: "DSR" };
  var BIO_NAMES = {
    rl25: ["Cell Biologist", "Get 25 biochemistry, cell or microbe questions (BIO.2-BIO.4) right on the first try."],
    rl100: ["Master Cell Biologist", "Get 100 biochemistry, cell or microbe questions (BIO.2-BIO.4) right on the first try."],
    ri25: ["Geneticist", "Get 25 heredity questions (BIO.5) right on the first try."], ri100: ["Master Geneticist", "Get 100 heredity questions (BIO.5) right on the first try."],
    rv25: ["Naturalist", "Get 25 classification or evolution questions (BIO.6-BIO.7) right on the first try."],
    rv100: ["Master Naturalist", "Get 100 classification or evolution questions (BIO.6-BIO.7) right on the first try."],
    dsr25: ["Field Scientist", "Get 25 investigation or ecology questions (BIO.1, BIO.8) right on the first try."],
    dsr100: ["Master Field Scientist", "Get 100 investigation or ecology questions (BIO.1, BIO.8) right on the first try."]
  };
  function strandOfCode(c) {
    c = String(c || "");
    var bio = /^BIO\.(\d)/i.exec(c);
    if (bio) return BIO_STRAND[bio[1]] || null;
    var m = /^\d+\.(RL|RI|RV|DSR)\./.exec(c + ".");
    if (m) return m[1];
    if (/^L\./.test(c)) return "RV";
    if (/\.CT\./.test(c)) return "DSR";
    if (/^RL\./.test(c)) return "RL";
    if (/^RI\./.test(c)) return "RI";
    return null;
  }
  /* everything a badge looks at */
  function facts() {
    var rec = null, st = "VA";
    try { st = P().state(); rec = P().record(st); } catch (e) { rec = null; }
    rec = rec || { levels: {}, q: {}, std: {}, camp: {}, badges: [] };
    var f = { rec: rec, right: { RL: 0, RI: 0, RV: 0, DSR: 0 }, stds: 0, camp: {}, fangs: 0, pieces: 0, coins: 0, ody: st === "ODY" };
    Object.keys(rec.std || {}).forEach(function (k) {
      var s = rec.std[k]; if (!s || !s.a) return;
      f.stds++;
      var sd = strandOfCode(k); if (sd) f.right[sd] += num(s.r);
    });
    /* each mode's levels: the record, or (for a save from before v5.15) the level saved for that mode */
    modesHere().forEach(function (m) {
      var c = (rec.camp || {})[m] || { hiReached: 0, hiWon: 0 }, hr = num(c.hiReached), hw = num(c.hiWon);
      try { var v = parseInt(localStorage.getItem(NIGHT_KEY + "." + m) || "", 10); if (v >= 1 && v <= 100) { hr = Math.max(hr, v); hw = Math.max(hw, v - 1); } } catch (e) {}
      f.camp[m] = { hiReached: hr, hiWon: hw };
    });
    try { var fa = JSON.parse(localStorage.getItem(FANG_KEY) || "[]"); f.fangs = Array.isArray(fa) ? fa.length : 0; } catch (e) {}
    try { var b = JSON.parse(localStorage.getItem(BUILD_KEY) || "null"); if (b) { f.pieces = Array.isArray(b.picks) ? b.picks.length : 0; f.coins = num(b.coins); } } catch (e) {}
    return f;
  }
  /* the badges this game shows: every general badge, and the mode badges of this game's modes */
  function relevant() {
    var here = modesHere();
    return C.BADGES.filter(function (id) { var m = /^m-([A-Za-z]+)-/.exec(id); return !m || here.indexOf(m[1]) !== -1; });
  }
  function met(id, f) {
    var r = f.rec, q = num(r.q && r.q.answered), m, here = modesHere();
    if ((m = /^m-([A-Za-z]+)-(\d+)$/.exec(id))) return !!f.camp[m[1]] && f.camp[m[1]].hiWon >= +m[2];
    if ((m = /^q(\d+)$/.exec(id))) return q >= +m[1];
    if ((m = /^streak(\d+)$/.exec(id))) return num(r.bestStreak) >= +m[1];
    if ((m = /^perfect(\d+)$/.exec(id))) return num(r.perfect) >= +m[1];
    if ((m = /^(rl|ri|rv|dsr)(\d+)$/.exec(id))) return f.right[m[1].toUpperCase()] >= +m[2];
    if ((m = /^std(\d+)$/.exec(id))) return f.stds >= +m[1];
    if ((m = /^days(\d+)$/.exec(id))) return num(r.dayCount) >= +m[1];
    if ((m = /^min(\d+)$/.exec(id))) return num(r.activeMs) / 60000 >= +m[1];
    if ((m = /^fang(\d+)$/.exec(id))) return f.fangs >= +m[1];
    if ((m = /^town(\d+)$/.exec(id))) return f.pieces >= +m[1];
    if ((m = /^coins(\d+)$/.exec(id))) return f.coins >= +m[1];
    if (id === "first-win") return num(r.levels && r.levels.won) >= 1;
    if (id === "comeback") return num(r.comebacks) >= 1;
    if (id === "explorer") return here.every(function (k) { return f.camp[k] && f.camp[k].hiReached >= 1; });
    if (id === "grandtour") return here.every(function (k) { return f.camp[k] && f.camp[k].hiWon >= 10; });
    if (id === "legend") return here.every(function (k) { return f.camp[k] && f.camp[k].hiWon >= 100; });
    return false;
  }
  function info(id, f) {
    var b = C.badgeInfo(id), m = /^m-([A-Za-z]+)-(\d+)$/.exec(id);
    if (BIO_NAMES[id]) { b.name = BIO_NAMES[id][0]; b.desc = BIO_NAMES[id][1]; }
    if (m) { var nm = modeName(m[1]); b.name = nm + " " + b.name.split(" ").pop(); b.desc = "Win level " + m[2] + " in " + nm + "."; }
    if (f && f.ody && /^fang/.test(id)) {
      b.name = { fang1: "Fleece Finder", fang5: "Fleece Hunter", fang10: "Golden Voyager" }[id] || b.name;
      b.desc = id === "fang1" ? "Win a Ram's Fleece." : "Win " + id.slice(4) + " Ram's Fleeces.";
    }
    return b;
  }
  function earnedIds() { var r = null; try { r = P().record(); } catch (e) {} return (r && r.badges) || []; }

  /* ── check: award what is met now ── */
  function check() {
    if (!P() || !P().addBadges) return [];
    var f = facts(), have = f.rec.badges || [], want = relevant().filter(function (id) { return have.indexOf(id) === -1 && met(id, f); });
    if (!want.length) { refreshButton(); return []; }
    var fresh = P().addBadges(want);
    fresh.forEach(function (id) { toast(info(id, f)); });
    refreshButton();
    return fresh;
  }

  /* ── look ── */
  var CSS = [
    "#badge-toasts{position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:9600;display:flex;flex-direction:column;gap:8px;align-items:center;pointer-events:none}",
    ".badge-toast{display:flex;align-items:center;gap:12px;background:#15181f;border:2px solid var(--gold,#f5d76e);border-radius:14px;padding:10px 16px 10px 10px;color:#fff;box-shadow:0 6px 24px rgba(0,0,0,.5);font:15px/1.3 system-ui,sans-serif;opacity:0;transform:translateY(-12px);transition:opacity .3s,transform .3s;max-width:min(460px,92vw)}",
    ".badge-toast.on{opacity:1;transform:none}",
    ".badge-toast small{display:block;color:var(--gold,#f5d76e);font-weight:700;letter-spacing:.06em;text-transform:uppercase;font-size:11px}",
    ".badge-toast b{display:block;font-size:17px}",
    ".badge-medal{flex:0 0 auto;width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:800 15px/1 system-ui,sans-serif;color:#2a1a00;box-shadow:inset 0 -3px 0 rgba(0,0,0,.25),0 0 0 3px rgba(255,255,255,.15)}",
    ".badge-medal.t10{background:radial-gradient(circle at 35% 30%,#f3c08a,#b06a2a)}",
    ".badge-medal.t25{background:radial-gradient(circle at 35% 30%,#ffffff,#9aa4b0)}",
    ".badge-medal.t50,.badge-medal.gen{background:radial-gradient(circle at 35% 30%,#fff3b0,#d9a520)}",
    ".badge-medal.t75{background:radial-gradient(circle at 35% 30%,#e8fbff,#6fb7c8)}",
    ".badge-medal.t100{background:radial-gradient(circle at 35% 30%,#ffd6ff,#9a4dd0);color:#fff}",
    ".badge-medal.locked{background:#3a3f4a;color:#8a93a3;box-shadow:inset 0 0 0 2px #4a5160}",
    "#badge-overlay{position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;background:rgba(8,10,14,.78);padding:12px;overflow:auto}",
    "#badge-overlay.hidden{display:none!important}",
    "#badge-overlay .tut-card{max-width:900px;width:min(900px,96%);max-height:92vh;overflow:auto}",
    "#badge-overlay h2{margin:0 0 4px;font-size:26px}",
    ".badge-count{margin:0 0 12px;color:var(--dim,#aab)}",
    ".badge-group{margin:14px 0 6px;font-size:15px;letter-spacing:.06em;text-transform:uppercase;color:var(--gold,#f5d76e)}",
    ".badge-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:8px}",
    ".badge-tile{display:flex;gap:10px;align-items:center;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:8px}",
    ".badge-tile.locked{opacity:.62}",
    ".badge-tile b{display:block;font-size:14px}",
    ".badge-tile span{display:block;font-size:12px;color:var(--dim,#aab);line-height:1.3}",
    ".badge-row-name{grid-column:1/-1;margin:6px 0 0;font-weight:700;font-size:14px}",
    "#badge-overlay .row{justify-content:flex-start;margin-top:14px}"
  ].join("\n");
  var cssOn = false;
  function css() { if (cssOn) return; cssOn = true; var s = document.createElement("style"); s.textContent = CSS; document.head.appendChild(s); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function medal(b, locked) {
    var tier = b.tier ? "t" + b.tier : "gen", m = el("div", "badge-medal " + (locked ? "locked" : tier));
    m.textContent = b.tier ? String(b.tier) : (locked ? "?" : "★");
    return m;
  }

  /* ── the pop-up ── */
  var queue = [], showing = 0;
  function toast(b) {
    css();
    var host = document.getElementById("badge-toasts");
    if (!host) { host = el("div"); host.id = "badge-toasts"; host.setAttribute("aria-live", "polite"); document.body.appendChild(host); }
    queue.push(b);
    pump();
  }
  function pump() {
    var host = document.getElementById("badge-toasts");
    while (queue.length && showing < 3) {
      var b = queue.shift(), t = el("div", "badge-toast"), txt = el("div");
      showing++;
      t.appendChild(medal(b, false));
      txt.appendChild(el("small", null, "Badge earned"));
      txt.appendChild(el("b", null, b.name));
      txt.appendChild(document.createTextNode(b.desc));
      t.appendChild(txt);
      host.appendChild(t);
      (function (t) {
        setTimeout(function () { t.classList.add("on"); }, 20);
        setTimeout(function () { t.classList.remove("on"); }, 4200);
        setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); showing--; pump(); }, 4600);
      })(t);
    }
  }

  /* ── the gallery ── */
  var GROUPS = [
    ["Questions and standards", /^(q\d+|std\d+)$/],
    ["Units", /^(rl|ri|rv|dsr)\d+$/],
    ["Accuracy", /^(streak\d+|perfect\d+|comeback)$/],
    ["Adventure", /^(first-win|fang\d+|explorer|grandtour|legend)$/],
    ["Time", /^(days\d+|min\d+)$/],
    ["Town and treasure", /^(town\d+|coins\d+)$/]
  ];
  var ov = null;
  function build() {
    if (ov) return ov;
    css();
    ov = el("div", "hidden"); ov.id = "badge-overlay";
    ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-label", "My badges");
    var card = el("div", "tut-card"); ov.appendChild(card);
    card.appendChild(el("p", "tut-kicker", "My badges"));
    card.appendChild(el("h2", null, "Badges"));
    card.appendChild(el("p", "badge-count"));
    card.appendChild(el("div", "badge-body"));
    var row = el("div", "row"), close = el("button", "btn primary", "Close");
    close.type = "button"; row.appendChild(close); card.appendChild(row);
    close.addEventListener("click", function (e) { e.stopPropagation(); hide(); });
    ov.addEventListener("click", function (e) { if (e.target === ov) hide(); });
    ov.addEventListener("keydown", function (e) { e.stopPropagation(); if (e.key === "Escape") hide(); }, true);
    ov.addEventListener("pointerup", function (e) { e.stopPropagation(); });
    (document.getElementById("app") || document.body).appendChild(ov);
    return ov;
  }
  function tile(id, f, have) {
    var b = info(id, f), on = have.indexOf(id) !== -1, t = el("div", "badge-tile" + (on ? "" : " locked")), txt = el("div");
    t.appendChild(medal(b, !on));
    txt.appendChild(el("b", null, b.name));
    txt.appendChild(el("span", null, b.desc));
    t.appendChild(txt);
    t.title = (on ? "Earned: " : "To earn: ") + b.desc;
    return t;
  }
  function show() {
    check();
    build();
    var f = facts(), have = f.rec.badges || [], all = relevant(), body = ov.querySelector(".badge-body");
    var got = all.filter(function (id) { return have.indexOf(id) !== -1; }).length;
    ov.querySelector(".badge-count").textContent = got + " of " + all.length + " badges earned. Earned badges are in colour; tap or hover over the others to see how to earn them.";
    body.innerHTML = "";
    body.appendChild(el("div", "badge-group", "Game modes"));
    var grid = el("div", "badge-grid");
    modesHere().forEach(function (m) {
      grid.appendChild(el("div", "badge-row-name", modeName(m)));
      C.MODE_TIERS.forEach(function (t) { grid.appendChild(tile("m-" + m + "-" + t, f, have)); });
    });
    body.appendChild(grid);
    GROUPS.forEach(function (g) {
      var ids = all.filter(function (id) { return g[1].test(id); });
      if (!ids.length) return;
      body.appendChild(el("div", "badge-group", g[0]));
      var gr = el("div", "badge-grid");
      ids.forEach(function (id) { gr.appendChild(tile(id, f, have)); });
      body.appendChild(gr);
    });
    ov.classList.remove("hidden");
    setTimeout(function () { try { ov.querySelector(".btn.primary").focus(); } catch (e) {} }, 30);
  }
  function hide() { if (ov) ov.classList.add("hidden"); }
  function isOpen() { return !!ov && !ov.classList.contains("hidden"); }
  function refreshButton() {
    var b = document.getElementById("btn-badges");
    if (!b) return;
    var have = earnedIds(), all = relevant(), n = all.filter(function (id) { return have.indexOf(id) !== -1; }).length;
    b.textContent = "My badges (" + n + ")";
  }
  function bind() {
    var b = document.getElementById("btn-badges"), last = 0;
    if (b) b.addEventListener("click", function (e) {
      e.stopPropagation();
      var now = Date.now(); if (now - last < 400) return; last = now;
      show();
    });
    setTimeout(function () { try { check(); } catch (e) {} }, 1500);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind); else bind();

  window.SolBadges = {
    check: check, show: show, hide: hide, isOpen: isOpen, relevant: relevant, info: function (id) { return info(id, facts()); },
    earned: earnedIds, strandOfCode: strandOfCode, _met: function (id) { return met(id, facts()); }
  };
})();
