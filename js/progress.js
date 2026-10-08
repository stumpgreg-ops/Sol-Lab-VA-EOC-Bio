/* SOL Labyrinth: the progress record and "My progress code" (v5.13).
   A game uploaded to Canvas can't send anything anywhere, so a student's progress is kept on the Chromebook and
   shown to the teacher as a PROGRESS CODE (js/progress-code.js): the student pastes it into a Canvas assignment and
   the teacher reads every code at once on the teacher page (tools/build-teacher.js).

   THE RECORD lives in one place, localStorage "afterHours.v1.progress.<STATE>" (the Odyssey build's copy of this
   file says "afterHours.ody." — tools/build-games.js moves every save key), so a later version can also send it
   somewhere (a Google Sheet). It holds: first and last day played, the days played, active play time, levels
   started / won / lost, the highest level reached and won, questions answered, right on the first try and wrong
   picks, each skill's (each episode's, in the Odyssey) answered / right on the first try, each game mode's levels
   played / won, and the last 30 level results.

   ACTIVE TIME counts only while a level is running and on screen: the tab visible, no card open that pauses the
   game (reading, how-to, field guide, help), not after the level ends, and never more than IDLE_MS after the last
   key press, tap or mouse move (a student who walks away stops the clock).

   js/game.js reports what happens (SolProgress.levelStart / answer / levelEnd, all in try/catch) and tells this file
   which game is open, the nickname and whether play is active (SolProgress.hook). Nothing here can stop the game:
   every storage call is in try/catch, and an old save without a record starts a fresh one.

   RESTORE (v5.14): the code is format 2 ("SOL2-..."), so it also carries the level to play next, the Fangs and the
   town or castle (js/progress-code.js). "Restore my progress" on the title screen reads a student's last code and,
   after they confirm, writes it all back on this Chromebook and reloads the game: the record (its totals, so the next
   code goes on from them), the level, the Fangs, the town or castle and the nickname. A format 1 code (made before
   v5.14) restores the totals and the level only.

   v5.15 (format 3, "SOL3-..."): the record also counts each STANDARD practiced (9.RL.1.A: answered / right on the
   first try), each GAME MODE's highest level reached and won (every mode keeps its own level now), the best run
   of first-try answers, perfect levels (won with no wrong letter), comebacks (a level won after losing it) and the
   BADGES earned (js/badges.js decides them). The code carries them all, and Restore brings them back. */
(function () {
  "use strict";
  var C = window.SolProgressCode;
  var KEY = "afterHours.v1.progress.";
  var NICK_KEY = "afterHours.v1.nick";
  var NIGHT_KEY = "afterHours.v1.night", FANG_KEY = "afterHours.v1.fangs", BUILD_KEY = "afterHours.v1.build";
  var LOG_MAX = 30, DAYS_MAX = 400, IDLE_MS = 90000, TICK_MS = 1000, FLUSH_MS = 15000;
  var hooks = { state: null, nick: null, active: null };
  var cache = { st: null, rec: null };
  var cur = null;            /* the level being played: { st, night, mode, a, r, w, ms, ended } */
  var pendingMs = 0, lastTick = Date.now(), lastFlush = Date.now(), lastInput = Date.now();

  function num(v) { v = Math.floor(Number(v)); return isFinite(v) && v > 0 ? v : 0; }
  function today() {
    var d = new Date();
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  }
  function blank() {
    return { v: 1, first: null, last: null, days: [], dayCount: 0, activeMs: 0,
      levels: { started: 0, won: 0, lost: 0 }, hiReached: 0, hiWon: 0, modesMin: 0,
      std: {}, camp: {}, streak: 0, bestStreak: 0, perfect: 0, comebacks: 0, lostAt: [], badges: [],
      q: { answered: 0, right: 0, wrong: 0 }, skills: {}, modes: {}, log: [] };
  }
  /* an old or damaged save: keep what is usable, fill in the rest */
  function tidy(x) {
    var r = blank();
    if (!x || typeof x !== "object") return r;
    var ymd = /^\d{4}-\d{2}-\d{2}$/;
    r.first = ymd.test(x.first) ? x.first : null;
    r.last = ymd.test(x.last) ? x.last : r.first;
    r.days = Array.isArray(x.days) ? x.days.filter(function (d) { return ymd.test(d); }).slice(-DAYS_MAX) : [];
    r.dayCount = Math.max(num(x.dayCount), r.days.length);
    r.activeMs = num(x.activeMs);
    r.modesMin = num(x.modesMin);
    if (x.std && typeof x.std === "object") Object.keys(x.std).forEach(function (k) {
      var s = x.std[k]; if (s && /^[0-9A-Za-z.]{3,24}$/.test(k)) r.std[k] = { a: num(s.a), r: Math.min(num(s.a), num(s.r)) };
    });
    if (x.camp && typeof x.camp === "object") Object.keys(x.camp).forEach(function (k) {
      var c = x.camp[k]; if (c && /^[A-Za-z]{1,12}$/.test(k)) { var hr = Math.min(100, num(c.hiReached)); r.camp[k] = { hiReached: hr, hiWon: Math.min(hr, num(c.hiWon)) }; }
    });
    r.streak = num(x.streak); r.bestStreak = Math.max(num(x.bestStreak), r.streak);
    r.perfect = num(x.perfect); r.comebacks = num(x.comebacks);
    r.lostAt = Array.isArray(x.lostAt) ? x.lostAt.filter(function (k) { return typeof k === "string"; }).slice(-60) : [];
    r.badges = Array.isArray(x.badges) ? x.badges.filter(function (k) { return typeof k === "string"; }) : [];
    if (x.levels) { r.levels.started = num(x.levels.started); r.levels.won = num(x.levels.won); r.levels.lost = num(x.levels.lost); }
    r.hiReached = Math.min(100, num(x.hiReached)); r.hiWon = Math.min(r.hiReached, num(x.hiWon));
    if (x.q) { r.q.answered = num(x.q.answered); r.q.right = Math.min(r.q.answered, num(x.q.right)); r.q.wrong = num(x.q.wrong); }
    if (x.skills && typeof x.skills === "object") Object.keys(x.skills).forEach(function (k) {
      var s = x.skills[k]; if (s && /^[A-Z]{1,10}$/.test(k)) r.skills[k] = { a: num(s.a), r: Math.min(num(s.a), num(s.r)) };
    });
    if (x.modes && typeof x.modes === "object") Object.keys(x.modes).forEach(function (k) {
      var m = x.modes[k]; if (m && /^[a-z]{1,12}$/.test(k)) r.modes[k] = { played: num(m.played), won: Math.min(num(m.played), num(m.won)) };
    });
    if (Array.isArray(x.log)) r.log = x.log.filter(function (e) { return e && typeof e === "object"; }).slice(-LOG_MAX);
    return r;
  }
  function stateNow() {
    var st = null;
    try { st = hooks.state && hooks.state(); } catch (e) {}
    st = st || window.SOL_STATE || "VA";
    return C && C.BUILDS[st] ? st : "VA";
  }
  function load(st) {
    if (cache.st === st && cache.rec) return cache.rec;
    var rec = null;
    try { rec = JSON.parse(localStorage.getItem(KEY + st) || "null"); } catch (e) { rec = null; }
    cache.st = st; cache.rec = tidy(rec);
    return cache.rec;
  }
  function save(st, rec) {
    try { localStorage.setItem(KEY + st, JSON.stringify(rec)); } catch (e) {}
  }
  function touchDay(rec) {
    var d = today();
    if (!rec.first || d < rec.first) rec.first = d;
    if (!rec.last || d > rec.last) rec.last = d;
    if (rec.days.indexOf(d) === -1) {
      rec.days.push(d);
      if (rec.days.length > DAYS_MAX) rec.days.shift();
      rec.dayCount++;
    }
  }
  /* a Reading grade names its game; any other family (an Algebra unit, say) leaves it to the state hook */
  function stateOfFamily(f) { return f === "NJ5" ? "NJ" : f === "ODY" ? "ODY" : /^G(9|10|11)$/.test(String(f || "")) ? "VA" : null; }
  function skillOf(claim) {
    if (!claim) return null;
    if (claim.episode) return String(claim.episode).toUpperCase();
    /* Algebra: a claim's strand is its full lettered code (A.EO.1.B); its skill is the standard (A.EO.1, claim.standard) */
    var s = claim.standard || claim.strand || (window.heistStrandOf ? window.heistStrandOf(claim) : null);
    return s ? String(s).toUpperCase() : null;
  }

  /* ── the clock: active play time ── */
  function flush() {
    if (!pendingMs || !cur) { pendingMs = 0; return; }
    var rec = load(cur.st);
    rec.activeMs += Math.round(pendingMs);
    pendingMs = 0;
    lastFlush = Date.now();
    save(cur.st, rec);
  }
  function tick() {
    var now = Date.now(), dt = now - lastTick;
    lastTick = now;
    if (!cur || cur.ended) return;
    if (!(dt > 0)) return;
    if (dt > TICK_MS * 2) dt = TICK_MS * 2;          /* a throttled or sleeping tab doesn't count its gap */
    var on = false;
    try { on = !document.hidden && !!(hooks.active && hooks.active()); } catch (e) { on = false; }
    if (on && now - lastInput <= IDLE_MS) { pendingMs += dt; cur.ms += dt; }
    if (now - lastFlush >= FLUSH_MS) flush();
  }
  function onInput() { lastInput = Date.now(); }
  try {
    ["keydown", "pointerdown", "pointermove", "touchstart", "wheel", "mousedown"].forEach(function (t) {
      window.addEventListener(t, onInput, { capture: true, passive: true });
    });
    document.addEventListener("visibilitychange", function () { if (document.hidden) flush(); });
    window.addEventListener("pagehide", flush);
    setInterval(tick, TICK_MS);
  } catch (eT) {}

  /* ── what the game reports ── */
  function logLevel(rec, c, result) {
    rec.log.push({ d: today(), n: c.night, m: c.mode, a: c.a, r: c.r, w: c.w, min: Math.round(c.ms / 6000) / 10, res: result });
    if (rec.log.length > LOG_MAX) rec.log.splice(0, rec.log.length - LOG_MAX);
  }
  function levelStart(info) {
    try {
      if (cur && !cur.ended) {                       /* the last level was left without a win or a loss */
        flush();
        var old = load(cur.st);
        logLevel(old, cur, "left");
        save(cur.st, old);
        cur.ended = true;
      }
      var st = stateOfFamily(info && info.family) || stateNow();
      var night = Math.max(1, Math.min(100, num(info && info.night) || 1));
      var mode = String((info && info.mode) || "maze").toLowerCase().replace(/[^a-z]/g, "").slice(0, 12) || "maze";
      var campaign = String((info && info.campaign) || "ALL").replace(/[^A-Za-z]/g, "").slice(0, 12) || "ALL";
      var rec = load(st);
      rec.levels.started++;
      if (night > rec.hiReached) rec.hiReached = night;
      var cp = rec.camp[campaign] || (rec.camp[campaign] = { hiReached: 0, hiWon: 0 });
      if (night > cp.hiReached) cp.hiReached = night;
      var m = rec.modes[mode] || (rec.modes[mode] = { played: 0, won: 0 });
      m.played++;
      touchDay(rec);
      save(st, rec);
      cur = { st: st, night: night, mode: mode, campaign: campaign, a: 0, r: 0, w: 0, ms: 0, ended: false };
      lastTick = Date.now(); lastInput = Date.now();
    } catch (e) {}
  }
  /* kind: "wrong" (a wrong letter picked), "clean" (answered, no wrong pick first) or "struggled" (answered after one) */
  function answer(kind, claim) {
    try {
      var st = cur ? cur.st : stateNow(), rec = load(st), sk = skillOf(claim);
      /* v5.17: a question names its skill (claim.sub, 9.RL.2.A.2: js/standards-va.js) or only its standard (claim.sol) */
      var tag = claim ? claim.sub || claim.sol : "", code = tag ? String(tag).replace(/[^0-9A-Za-z.]/g, "").slice(0, 24) : "";
      if (kind === "wrong") {
        rec.q.wrong++;
        rec.streak = 0;
        if (cur) cur.w++;
      } else {
        rec.q.answered++;
        if (kind === "clean") { rec.q.right++; rec.streak++; if (rec.streak > rec.bestStreak) rec.bestStreak = rec.streak; }
        else rec.streak = 0;
        if (code) { var sd = rec.std[code] || (rec.std[code] = { a: 0, r: 0 }); sd.a++; if (kind === "clean") sd.r++; }
        if (sk) {
          var s = rec.skills[sk] || (rec.skills[sk] = { a: 0, r: 0 });
          s.a++; if (kind === "clean") s.r++;
        }
        if (cur) { cur.a++; if (kind === "clean") cur.r++; }
      }
      touchDay(rec);
      save(st, rec);
      badgesSoon();
    } catch (e) {}
  }
  function levelEnd(win) {
    try {
      if (!cur || cur.ended) return;
      flush();
      var rec = load(cur.st);
      cur.ended = true;
      var key = (cur.campaign || "ALL") + ":" + cur.night;
      if (win) {
        rec.levels.won++;
        if (cur.night > rec.hiWon) rec.hiWon = cur.night;
        if (rec.modes[cur.mode]) rec.modes[cur.mode].won++;
        var cp = rec.camp[cur.campaign || "ALL"] || (rec.camp[cur.campaign || "ALL"] = { hiReached: cur.night, hiWon: 0 });
        if (cur.night > cp.hiWon) cp.hiWon = cur.night;
        if (cur.w === 0 && cur.a > 0) rec.perfect++;
        var li = rec.lostAt.indexOf(key);
        if (li !== -1) { rec.comebacks++; rec.lostAt.splice(li, 1); }
      } else {
        rec.levels.lost++;
        if (rec.lostAt.indexOf(key) === -1) { rec.lostAt.push(key); if (rec.lostAt.length > 60) rec.lostAt.shift(); }
      }
      logLevel(rec, cur, win ? "won" : "lost");
      touchDay(rec);
      save(cur.st, rec);
      badgesSoon();
    } catch (e) {}
  }
  /* js/badges.js looks at the record after an answer or a level (a moment later, so a level's own screen comes first) */
  var badgeTimer = null;
  function badgesSoon() {
    if (badgeTimer) return;
    badgeTimer = setTimeout(function () { badgeTimer = null; try { if (window.SolBadges && SolBadges.check) SolBadges.check(); } catch (e) {} }, 600);
  }
  /* the badges js/badges.js awarded: added to the record (once each); returns the ones that are new */
  function addBadges(ids, st) {
    st = st || stateNow();
    var rec = load(st), fresh = [];
    (ids || []).forEach(function (id) { if (typeof id === "string" && rec.badges.indexOf(id) === -1) { rec.badges.push(id); fresh.push(id); } });
    if (fresh.length) save(st, rec);
    return fresh;
  }

  /* ── the code ── */
  function nickNow() {
    var n = "";
    try { n = hooks.nick && hooks.nick(); } catch (e) {}
    if (!n) { try { var el = document.getElementById("join-nick"); n = el && el.value; } catch (e2) {} }
    if (!n) { try { n = localStorage.getItem(NICK_KEY) || ""; } catch (e3) {} }
    return C ? C.cleanNick(n) : "";
  }
  function versionNow() {
    var el = document.querySelector("#title-screen .ver") || document.querySelector(".ver");
    return el ? el.textContent : "0.0.0";
  }
  function summary(st) {
    var rec = load(st);
    return {
      first: rec.first, last: rec.last, days: rec.dayCount, minutes: Math.round(rec.activeMs / 60000),
      started: rec.levels.started, won: rec.levels.won, lost: rec.levels.lost, hiReached: rec.hiReached, hiWon: rec.hiWon,
      answered: rec.q.answered, right: rec.q.right, wrong: rec.q.wrong,
      modes: Math.max(rec.modesMin || 0, Object.keys(rec.modes).filter(function (k) { return rec.modes[k].played > 0; }).length),
      skills: rec.skills,
      std: rec.std, camp: rec.camp, bestStreak: rec.bestStreak, perfect: rec.perfect, badges: rec.badges.slice()
    };
  }
  /* format 2's restore part: what is saved on this Chromebook now */
  function realmIds() {
    var R = window.SolRealms && window.SolRealms.REALMS;
    return Array.isArray(R) ? R.map(function (rm) { return rm && rm.id; }) : [];
  }
  function saveNow() {
    var sv = { night: 1, fangs: [], build: null }, ids = realmIds();
    try { var n = parseInt(localStorage.getItem(NIGHT_KEY) || "1", 10); if (n >= 1 && n <= 100) sv.night = n; } catch (e) {}
    sv.nights = {};
    (C && C.MODE_IDS || []).forEach(function (m) {
      try { var v = parseInt(localStorage.getItem(NIGHT_KEY + "." + m) || "", 10); if (v >= 1 && v <= 100) sv.nights[m] = v; } catch (e1) {}
    });
    try {
      var f = JSON.parse(localStorage.getItem(FANG_KEY) || "[]");
      if (Array.isArray(f)) f.forEach(function (id) { var i = ids.indexOf(id); if (i !== -1 && sv.fangs.indexOf(i) === -1) sv.fangs.push(i); });
    } catch (e2) {}
    try {
      var b = JSON.parse(localStorage.getItem(BUILD_KEY) || "null");
      if (b && typeof b === "object" && (b.theme || (Array.isArray(b.picks) && b.picks.length) || num(b.coins))) {
        sv.build = { theme: typeof b.theme === "string" ? b.theme : "", salt: num(b.salt), coins: num(b.coins), kit: num(b.kit),
          owned: Object.keys(b.owned || {}).filter(function (k) { return b.owned[k]; }), rewards: b.rewards || {},
          picks: (Array.isArray(b.picks) ? b.picks : []).filter(function (p) { return p && typeof p.piece === "string"; }) };
      }
    } catch (e3) {}
    return sv;
  }
  function makeCode(st) {
    st = st || stateNow();
    flush();
    return C.encode(st, summary(st), { nick: nickNow(), version: versionNow(), save: saveNow() });
  }

  /* ── restore from a code ── */
  /* check(text) -> { ok, why } or { ok: true, st, d, have } : what the code holds and what this Chromebook has now */
  function checkRestore(text) {
    if (!C) return { ok: false, why: "The game could not read codes." };
    var found = C.findCodes(text), res = found.length ? found[found.length - 1].result : C.decode(text), st = stateNow();
    if (!res.ok) return { ok: false, why: res.build && res.build !== st && C.BUILDS[res.build] ? "That code is from another game (" + C.BUILDS[res.build].name + ")." : res.why };
    if (res.build !== st) return { ok: false, why: "That code is from another game (" + C.BUILDS[res.build].name + ")." };
    flush();
    var rec = load(st), night = 1;
    try { night = parseInt(localStorage.getItem(NIGHT_KEY) || "1", 10) || 1; } catch (e) {}
    return { ok: true, st: st, d: res.data, code: res.code, have: { started: rec.levels.started, won: rec.levels.won, night: night } };
  }
  function nightFrom(d) {
    if (d.save) return d.save.night;
    return Math.max(1, Math.min(100, d.hiReached > d.hiWon ? d.hiReached : d.hiWon + 1));
  }
  function applyRestore(chk) {
    var d = chk.d, st = chk.st, rec = blank(), ids = realmIds();
    rec.first = d.first; rec.last = d.last || d.first;
    rec.days = d.last ? [d.last] : [];                /* that day is already counted: playing on it again adds nothing */
    rec.dayCount = d.days;
    rec.activeMs = d.minutes * 60000;
    rec.levels = { started: d.started, won: d.won, lost: d.lost };
    rec.hiReached = d.hiReached; rec.hiWon = d.hiWon;
    rec.q = { answered: d.answered, right: d.right, wrong: d.wrong };
    (d.skills || []).forEach(function (k) { if (k.a) rec.skills[k.key] = { a: k.a, r: k.r }; });
    rec.modesMin = d.modes;
    (d.std || []).forEach(function (k) { if (k.a) rec.std[k.code] = { a: k.a, r: k.r }; });
    if (d.camp) Object.keys(d.camp).forEach(function (k) { rec.camp[k] = { hiReached: d.camp[k].hiReached, hiWon: d.camp[k].hiWon }; });
    rec.bestStreak = d.bestStreak || 0; rec.perfect = d.perfect || 0;
    rec.badges = (d.badges || []).slice();
    rec = tidy(rec);
    cur = null; pendingMs = 0;
    save(st, rec); cache.st = null; cache.rec = null;
    try {
      localStorage.setItem(NIGHT_KEY, String(nightFrom(d)));
      var nights = (d.save && d.save.nights) || {};
      (C.MODE_IDS || []).forEach(function (m) { localStorage.removeItem(NIGHT_KEY + "." + m); });
      if (Object.keys(nights).length) {
        Object.keys(nights).forEach(function (m) { localStorage.setItem(NIGHT_KEY + "." + m, String(nights[m])); });
        localStorage.setItem(NIGHT_KEY + ".migrated", "1");
      } else localStorage.removeItem(NIGHT_KEY + ".migrated");   /* an older code: its one level goes to the mode last picked */
    } catch (e) {}
    try { if (d.nick) localStorage.setItem(NICK_KEY, d.nick); } catch (e2) {}
    if (d.save) {
      try { localStorage.setItem(FANG_KEY, JSON.stringify(d.save.fangs.map(function (i) { return ids[i]; }).filter(Boolean))); } catch (e3) {}
      var b = d.save.build;
      try {
        if (b) {
          var owned = {};
          b.owned.concat(b.picks.map(function (p) { return p.piece; })).forEach(function (id) { if (id) owned[id] = 1; });
          Object.keys(b.rewards).forEach(function (k) { owned[b.rewards[k]] = 1; });
          localStorage.setItem(BUILD_KEY, JSON.stringify({ v: 4, theme: b.theme || null, salt: b.salt || 1, coins: b.coins, kit: b.kit, owned: owned,
            rewards: b.rewards, picks: b.picks.map(function (p) {
              var o = { night: 1, piece: p.piece, style: p.style, src: p.src, deco: p.deco, rot: p.rot };
              if (p.cx != null) { o.cx = p.cx; o.cy = p.cy; }
              return o;
            }), view: { a: 0, z: 1, px: 0, py: 0 }, code: "" }));
        } else localStorage.removeItem(BUILD_KEY);
      } catch (e4) {}
    }
    return true;
  }

  /* ── the "My progress code" window ── */
  var STYLE = [
    "#progress-overlay{position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;background:rgba(8,10,14,.72);padding:12px;overflow:auto}",
    "#progress-overlay.hidden{display:none!important}",
    "#progress-overlay .tut-card{max-width:560px;width:min(560px,96%);user-select:text;-webkit-user-select:text}",
    "#progress-overlay h2{margin:0 0 10px;font-size:26px}",
    ".prog-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:0 0 14px;padding:0;list-style:none}",
    ".prog-stats li{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:8px 10px;text-align:center}",
    ".prog-stats b{display:block;font-size:24px;color:var(--gold)}",
    ".prog-stats span{font-size:13px;color:var(--dim)}",
    ".prog-code{font:700 22px/1.45 Consolas,'Courier New',monospace;letter-spacing:.04em;background:#fffbea;color:#1a1408;border:2px solid var(--gold);border-radius:10px;padding:10px 12px;word-break:normal;overflow-wrap:anywhere;user-select:all;-webkit-user-select:all;cursor:text}",
    ".prog-code.long{font-size:14px;line-height:1.4;letter-spacing:0;max-height:170px;overflow:auto}",
    ".prog-copied{margin:8px 0 0;color:var(--gold);font-weight:700}",
    ".prog-copied:empty{display:none}",
    ".prog-how{margin:0 0 8px;font-size:17px;line-height:1.4}",
    ".prog-steps{margin:10px 0 4px;padding-left:24px;font-size:16px;line-height:1.5}",
    ".prog-steps li{margin:2px 0}",
    ".prog-nick{margin:4px 0 0;font-size:15px}",
    ".prog-nick b{color:var(--gold)}",
    ".prog-note{margin:6px 0 0;color:var(--dim);font-size:13px;line-height:1.4}",
    "#progress-overlay .row{justify-content:flex-start;margin-top:12px}",
    "#progress-overlay textarea{position:absolute;left:-9999px;top:0;width:10px;height:10px;opacity:0}"
  ].join("\n");
  var ov = null;
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function stat(n, label) { var li = el("li"); li.appendChild(el("b", null, String(n))); li.appendChild(el("span", null, label)); return li; }
  function build() {
    if (ov) return ov;
    var css = el("style"); css.textContent = STYLE; document.head.appendChild(css);
    ov = el("div", "hidden"); ov.id = "progress-overlay";
    ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-label", "Submit my progress");
    var card = el("div", "tut-card"); ov.appendChild(card);
    card.appendChild(el("p", "tut-kicker", "Submit my progress"));
    card.appendChild(el("h2", "prog-title", "Your progress"));
    var stats = el("ul", "prog-stats"); card.appendChild(stats);
    card.appendChild(el("p", "prog-how"));
    var code = el("div", "prog-code"); code.setAttribute("tabindex", "0"); card.appendChild(code);
    var row = el("div", "row"); card.appendChild(row);
    var copy = el("button", "btn primary", "Copy code"); copy.type = "button"; row.appendChild(copy);
    var close = el("button", "btn", "Close"); close.type = "button"; row.appendChild(close);
    var copied = el("p", "prog-copied"); copied.setAttribute("aria-live", "polite"); card.appendChild(copied);
    /* v5.15: the steps to turn the code in, for a game that sits in its Canvas assignment */
    var steps = el("ol", "prog-steps"); card.appendChild(steps);
    card.appendChild(el("p", "prog-nick"));
    card.appendChild(el("p", "prog-note"));
    copy.addEventListener("click", function (e) { e.stopPropagation(); copyCode(); });
    close.addEventListener("click", function (e) { e.stopPropagation(); hide(); });
    ov.addEventListener("click", function (e) { if (e.target === ov) hide(); });
    ov.addEventListener("keydown", function (e) { e.stopPropagation(); if (e.key === "Escape") hide(); }, true);
    ov.addEventListener("pointerup", function (e) { e.stopPropagation(); });
    (document.getElementById("app") || document.body).appendChild(ov);
    return ov;
  }
  function selectCode() {
    var c = ov.querySelector(".prog-code"), r = document.createRange(), s = window.getSelection();
    r.selectNodeContents(c); s.removeAllRanges(); s.addRange(r);
  }
  function copyCode() {
    var text = ov.querySelector(".prog-code").textContent, msg = ov.querySelector(".prog-copied");
    function fallback() {
      var ok = false;
      try {
        var ta = el("textarea"); ta.value = text; ov.appendChild(ta); ta.select();
        ok = document.execCommand && document.execCommand("copy");
        ov.removeChild(ta);
      } catch (e) { ok = false; }
      selectCode();
      msg.textContent = ok ? "Copied! Now follow the steps below to turn it in." : "The code is selected: press Ctrl+C to copy it, then follow the steps below.";
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          selectCode();
          msg.textContent = "Copied! Now follow the steps below to turn it in.";
        }, fallback);
        return;
      }
    } catch (e) {}
    fallback();
  }
  function show(st) {
    if (!C) return;
    st = st || stateNow();
    build();
    var B = C.BUILDS[st], s = summary(st), code = makeCode(st), nick = nickNow();
    var stats = ov.querySelector(".prog-stats");
    stats.innerHTML = "";
    var pct = s.answered ? Math.round(100 * s.right / s.answered) : 0;
    stats.appendChild(stat(s.won, s.won === 1 ? "level won" : "levels won"));
    stats.appendChild(stat(s.hiReached || "–", "highest level"));
    stats.appendChild(stat(s.answered, s.answered === 1 ? "question answered" : "questions answered"));
    stats.appendChild(stat(s.answered ? pct + "%" : "–", "right on the first try"));
    stats.appendChild(stat(s.minutes, s.minutes === 1 ? "minute played" : "minutes played"));
    stats.appendChild(stat(s.days, s.days === 1 ? "day played" : "days played"));
    ov.querySelector(".prog-title").textContent = s.started ? "Your progress in " + B.short : "No levels played yet";
    ov.querySelector(".prog-code").textContent = code;
    ov.querySelector(".prog-code").classList.toggle("long", code.length > 120);
    ov.querySelector(".prog-copied").textContent = "";
    var how = ov.querySelector(".prog-how");
    how.innerHTML = "";
    how.appendChild(document.createTextNode("Tap Copy code, then turn it in to the "));
    how.appendChild(el("b", null, B.assignment));
    how.appendChild(document.createTextNode(" assignment in Canvas."));
    var steps = ov.querySelector(".prog-steps");
    steps.innerHTML = "";
    ["Tap Copy code (below the code).",
     "Scroll down below the game to the assignment and click Start Assignment (or New Attempt if you turned one in before).",
     "Click in the Text Entry box and press Ctrl+V to paste your code.",
     "Click Submit Assignment. Done! Your newest code always shows everything so far."].forEach(function (t) { steps.appendChild(el("li", null, t)); });
    var nk = ov.querySelector(".prog-nick");
    nk.innerHTML = "";
    if (nick) { nk.appendChild(document.createTextNode("Your nickname: ")); nk.appendChild(el("b", null, nick)); nk.appendChild(document.createTextNode(" (look for it on your class leaderboard).")); }
    else nk.textContent = "No nickname yet: add one on the title screen so you can find yourself on the class leaderboard.";
    ov.querySelector(".prog-note").textContent = (s.started ? "" : "Play a level, then come back for a code that shows it. ") +
      "Your progress is saved on this Chromebook only. The code also holds your levels, badges and your town or castle: " +
      "on a new Chromebook, tap Restore my progress on the title screen and paste your newest code.";
    ov.classList.remove("hidden");
    setTimeout(function () { try { ov.querySelector(".btn.primary").focus(); } catch (e) {} }, 30);
  }
  function hide() { if (ov) ov.classList.add("hidden"); }

  /* ── the "Restore my progress" window ── */
  var RSTYLE = [
    "#restore-overlay{position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;background:rgba(8,10,14,.72);padding:12px;overflow:auto}",
    "#restore-overlay.hidden{display:none!important}",
    "#restore-overlay .tut-card{max-width:600px;width:min(600px,96%)}",
    "#restore-overlay h2{margin:0 0 10px;font-size:26px}",
    "#restore-overlay textarea{width:100%;box-sizing:border-box;min-height:96px;font:600 15px/1.4 Consolas,'Courier New',monospace;padding:8px 10px;border-radius:10px;border:2px solid var(--gold);background:#fffbea;color:#1a1408;resize:vertical}",
    ".rest-how{margin:0 0 8px;font-size:17px;line-height:1.4}",
    ".rest-msg{margin:10px 0 0;font-size:16px;line-height:1.45}",
    ".rest-msg:empty{display:none}",
    ".rest-msg.bad{color:#ff9a8a;font-weight:700}",
    ".rest-msg ul{margin:6px 0;padding-left:22px}",
    ".rest-warn{color:var(--gold);font-weight:700}",
    "#restore-overlay .row{justify-content:flex-start;margin-top:12px;flex-wrap:wrap;gap:8px}"
  ].join("\n");
  var rov = null, rchk = null;
  function buildRestore() {
    if (rov) return rov;
    var css = el("style"); css.textContent = RSTYLE; document.head.appendChild(css);
    rov = el("div", "hidden"); rov.id = "restore-overlay";
    rov.setAttribute("role", "dialog"); rov.setAttribute("aria-modal", "true"); rov.setAttribute("aria-label", "Restore my progress");
    var card = el("div", "tut-card"); rov.appendChild(card);
    card.appendChild(el("p", "tut-kicker", "Restore my progress"));
    card.appendChild(el("h2", null, "Paste your last progress code"));
    card.appendChild(el("p", "rest-how", "New Chromebook, or your progress is gone? Paste the newest code you got from My progress code " +
      "(it is in your Canvas assignment), then tap Check code."));
    var ta = el("textarea"); ta.id = "restore-code"; ta.setAttribute("spellcheck", "false"); ta.setAttribute("autocomplete", "off");
    ta.setAttribute("aria-label", "Your progress code"); ta.placeholder = "SOL2-..."; card.appendChild(ta);
    var msg = el("div", "rest-msg"); msg.setAttribute("aria-live", "polite"); card.appendChild(msg);
    var row = el("div", "row"); card.appendChild(row);
    var check = el("button", "btn", "Check code"); check.type = "button"; check.id = "restore-check"; row.appendChild(check);
    var go = el("button", "btn primary hidden", "Restore"); go.type = "button"; go.id = "restore-go"; row.appendChild(go);
    var close = el("button", "btn", "Cancel"); close.type = "button"; row.appendChild(close);
    check.addEventListener("click", function (e) { e.stopPropagation(); runCheck(); });
    go.addEventListener("click", function (e) { e.stopPropagation(); runRestore(); });
    close.addEventListener("click", function (e) { e.stopPropagation(); hideRestore(); });
    ta.addEventListener("input", function () { rchk = null; go.classList.add("hidden"); msg.textContent = ""; msg.className = "rest-msg"; });
    rov.addEventListener("click", function (e) { if (e.target === rov) hideRestore(); });
    rov.addEventListener("keydown", function (e) { e.stopPropagation(); if (e.key === "Escape") hideRestore(); }, true);
    rov.addEventListener("keyup", function (e) { e.stopPropagation(); }, true);
    rov.addEventListener("pointerup", function (e) { e.stopPropagation(); });
    (document.getElementById("app") || document.body).appendChild(rov);
    return rov;
  }
  function li(ul, text) { ul.appendChild(el("li", null, text)); }
  function runCheck() {
    var msg = rov.querySelector(".rest-msg"), go = rov.querySelector("#restore-go");
    rchk = checkRestore(rov.querySelector("#restore-code").value);
    msg.innerHTML = "";
    if (!rchk.ok) { msg.className = "rest-msg bad"; msg.textContent = rchk.why; go.classList.add("hidden"); return; }
    var d = rchk.d, b = d.save && d.save.build, ul = el("ul");
    msg.className = "rest-msg";
    msg.appendChild(el("div", null, "This code " + (d.nick ? "(“" + d.nick + "”) " : "") + "will bring back:"));
    var nights = (d.save && d.save.nights) || {}, nk = Object.keys(nights);
    if (nk.length) {
      li(ul, "Your levels: " + nk.map(function (m) { var nm = C.badgeInfo("m-" + m + "-10").name.replace(/ Bronze$/, ""); try { nm = (hooks.modeName && hooks.modeName(m)) || nm; } catch (e) {} return nm + " " + nights[m]; }).join(", "));
    } else li(ul, "Level " + nightFrom(d) + " to play next");
    li(ul, d.won + (d.won === 1 ? " level won, " : " levels won, ") + d.answered + (d.answered === 1 ? " question, " : " questions, ") + d.minutes + (d.minutes === 1 ? " minute played" : " minutes played"));
    if (b) li(ul, "Your " + (b.theme === "castle" ? "castle" : b.theme === "village" ? "town" : "town or castle") + ": " + b.picks.length + (b.picks.length === 1 ? " piece, " : " pieces, ") + b.coins + (b.coins === 1 ? " coin" : " coins"));
    else if (d.save) li(ul, "No town or castle yet");
    var nf = d.save ? d.save.fangs.length : 0, ody = rchk.st === "ODY";
    if (nf) li(ul, nf + (ody ? (nf === 1 ? " Ram's Fleece" : " Ram's Fleeces") : (nf === 1 ? " Fang" : " Fangs")));
    if (d.badges && d.badges.length) li(ul, d.badges.length + (d.badges.length === 1 ? " badge" : " badges"));
    msg.appendChild(ul);
    if (!d.save) msg.appendChild(el("div", "rest-warn", "This code is from an older version of the game: it brings back your level and totals, but not your town or castle."));
    if (rchk.have.started) msg.appendChild(el("div", "rest-warn", "This replaces what is on this Chromebook now (level " + rchk.have.night + ", " + rchk.have.won + (rchk.have.won === 1 ? " level won" : " levels won") + ")."));
    go.classList.remove("hidden");
    try { go.focus(); } catch (e) {}
  }
  function runRestore() {
    if (!rchk || !rchk.ok) return;
    var msg = rov.querySelector(".rest-msg");
    applyRestore(rchk);
    msg.className = "rest-msg"; msg.textContent = "Restored! The game is starting again...";
    rov.querySelector("#restore-go").classList.add("hidden");
    setTimeout(function () { try { window.location.reload(); } catch (e) {} }, 900);
  }
  function showRestore() {
    buildRestore();
    rchk = null;
    rov.querySelector("#restore-code").value = "";
    rov.querySelector(".rest-msg").textContent = "";
    rov.querySelector(".rest-msg").className = "rest-msg";
    rov.querySelector("#restore-go").classList.add("hidden");
    rov.classList.remove("hidden");
    setTimeout(function () { try { rov.querySelector("#restore-code").focus(); } catch (e) {} }, 30);
  }
  function hideRestore() { if (rov) rov.classList.add("hidden"); }
  function isOpen() { return (!!ov && !ov.classList.contains("hidden")) || (!!rov && !rov.classList.contains("hidden")); }

  function bindButtons() {
    ["btn-progress", "btn-progress-end"].forEach(function (id) {
      var b = document.getElementById(id), last = 0;
      if (!b) return;
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        var now = Date.now(); if (now - last < 400) return; last = now;
        show();
      });
    });
    var rb = document.getElementById("btn-restore"), rlast = 0;
    if (rb) rb.addEventListener("click", function (e) {
      e.stopPropagation();
      var now = Date.now(); if (now - rlast < 400) return; rlast = now;
      showRestore();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindButtons); else bindButtons();

  window.SolProgress = {
    hook: function (h) { if (h) Object.keys(h).forEach(function (k) { hooks[k] = h[k]; }); },
    levelStart: levelStart, answer: answer, levelEnd: levelEnd,
    record: function (st) { flush(); return JSON.parse(JSON.stringify(load(st || stateNow()))); },
    summary: function (st) { flush(); return summary(st || stateNow()); },
    code: makeCode, show: show, hide: hide, isOpen: isOpen,
    checkRestore: checkRestore, restore: applyRestore, showRestore: showRestore, hideRestore: hideRestore, saveNow: saveNow,
    addBadges: addBadges, modes: function () { try { return (hooks.modes && hooks.modes()) || []; } catch (e) { return []; } },
    modeName: function (m) { try { return (hooks.modeName && hooks.modeName(m)) || m; } catch (e) { return m; } }, state: stateNow,
    current: function () { return cur ? JSON.parse(JSON.stringify(cur)) : null; },
    _reset: function (st) { try { localStorage.removeItem(KEY + (st || stateNow())); } catch (e) {} cache.st = null; cache.rec = null; cur = null; pendingMs = 0; },
    _tick: tick, IDLE_MS: IDLE_MS
  };
})();
