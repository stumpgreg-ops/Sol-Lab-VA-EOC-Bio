/* SOL Lab Biology v6.3 — class sessions (Google Apps Script only).
 *
 * A teacher makes classes on the teacher page (the Apps Script link with ?admin=1). A class's link is the
 * game link with ?class=CODE; the loader (tools/appsscript/loader.js) fetches that class's settings from the
 * script and sets window.SOL_CLASS before this file runs. Without a class this file does nothing, so the core
 * game is untouched. With one it:
 *   - hides the regular questions the teacher turned off for this class, and applies the teacher's rewording
 *     (stem, choices, right letter) of any regular question;
 *   - adds the class's own question sets (lab notes and their questions, e.g. one on the class's own oyster
 *     reef data), and with "only" set, plays those sets and nothing else;
 *   - asks each student once for a first name or nickname, and sends progress to the teacher page through
 *     window.SOL_CLASS_SEND (set by the loader) whenever the game pings the teacher (game.js pingTeacher).
 * Loaded after the content files and before game.js.
 *
 * window.SOL_CLASS = { code, name, grade: a unit id from HEIST_FAMILIES ("ALL", "INV", "CHEM", "CELL", "MICRO",
 *   "GEN", "DNA", "EVO", "ECO"), only: bool,
 *   sets: [{ id, title, passage: "plain text, paragraphs split by blank lines", level: 1-3,
 *            questions: [{ id, stem, choices: [A, B, C, D], correct: "A"-"D", sol: "BIO.8.a" }] }],
 *   hide: ["packId:claimId", …], edits: { "packId:claimId": { stem, choices: [A, B, C, D], correct } } } */
(function (global) {
  "use strict";
  var C = global.SOL_CLASS, P = global.HEIST_PACKS, FAM = global.HEIST_FAMILIES || [];
  if (!C || !P || !P.splice) return;

  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var LET = ["A", "B", "C", "D"];

  /* 1. the regular questions: hide and reword */
  var hide = {}, edits = C.edits || {};
  (C.hide || []).forEach(function (id) { hide[id] = true; });
  P.forEach(function (p) {
    p.claims = (p.claims || []).filter(function (c) { return !hide[p.id + ":" + c.id]; });
    p.claims.forEach(function (c) {
      var e = edits[p.id + ":" + c.id];
      if (!e) return;
      if (e.stem) c.stem = String(e.stem);
      if (e.choices && e.choices.length) c.choices = e.choices.slice(0, 4).map(function (t, i) { return { letter: LET[i], text: String(t) }; });
      if (e.correct && /^[A-D]$/.test(e.correct)) c.correct = e.correct;
      c.partB = c.partB && !hide[p.id + ":" + c.partB] ? c.partB : null;
    });
  });
  /* a pack with every question hidden goes */
  for (var i = P.length - 1; i >= 0; i--) if (!P[i].claims.length) P.splice(i, 1);

  /* 2. the class's own sets become packs: sentences numbered like the regular lab notes */
  function passageHtml(text) {
    var n = 0;
    return String(text || "").split(/\n\s*\n/).map(function (para) {
      para = para.replace(/\s+/g, " ").trim();
      if (!para) return "";
      var sents = para.match(/[^.!?]+[.!?]+["'”’)\]]*\s*|[^.!?]+$/g) || [para];
      return "<p>" + sents.map(function (s2) { n++; return '<span class="n">(' + n + ")</span> " + esc(s2.trim()) + " "; }).join("") + "</p>";
    }).join("");
  }
  /* the unit a standard code belongs to (longest matching prefix in HEIST_FAMILIES; "Full review" sets
     take the unit of their first question so they sit in a unit's pool) */
  function unitFor(sol) {
    var code = String(sol || "").toUpperCase(), best = null, bl = 0;
    FAM.forEach(function (f) {
      if (f.id === "ALL") return;
      (f.stds || []).forEach(function (s) {
        s = String(s).toUpperCase();
        if ((code === s || code.indexOf(s + ".") === 0) && s.length > bl) { best = f.id; bl = s.length; }
      });
    });
    return best;
  }
  var unitIds = FAM.map(function (f) { return f.id; });
  var unit = unitIds.indexOf(C.grade) !== -1 ? C.grade : "ALL";
  var firstStd = (FAM.filter(function (f) { return f.id === unit; })[0] || {}).stds;
  firstStd = firstStd && firstStd[0] ? firstStd[0] : "BIO.1";
  var mine = [];
  (C.sets || []).forEach(function (set, si) {
    var qs = (set.questions || []).filter(function (q) { return q && q.stem && q.choices && q.choices.filter(Boolean).length >= 2 && /^[A-D]$/.test(q.correct || ""); });
    if (!qs.length) return;
    var sols = qs.map(function (q) { return /^BIO\.\d/i.test(q.sol || q.skill || "") ? String(q.sol || q.skill) : firstStd; });
    var fam = unit !== "ALL" ? unit : (unitFor(sols[0]) || "INV");
    var pack = {
      id: "class-" + C.code + "-" + (set.id || si), family: fam, title: String(set.title || "Class set"),
      kind: "Class set · " + esc(set.title || ""), blurb: "", level: set.level >= 1 && set.level <= 3 ? set.level : 2, classSet: true,
      passage: passageHtml(set.passage),
      claims: qs.map(function (q, qi) {
        return { id: String(q.id || "q" + (qi + 1)), sol: sols[qi], stem: String(q.stem),
          choices: q.choices.slice(0, 4).map(function (t, k) { return { letter: LET[k], text: String(t || "") }; }).filter(function (ch) { return ch.text; }),
          correct: q.correct };
      })
    };
    mine.push(pack);
  });
  if (C.only && mine.length) P.splice(0, P.length);
  mine.forEach(function (p) { P.push(p); });

  /* 3. who is playing, and their progress for the teacher page */
  var NICK_KEY = "sol.class.nick." + C.code;
  function nick() { try { return localStorage.getItem(NICK_KEY) || ""; } catch (e) { return ""; } }
  function askNick() {
    if (nick()) return;
    var ov = document.createElement("div");
    ov.id = "class-nick";
    ov.setAttribute("style", "position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;background:rgba(6,8,14,.86);font:16px/1.4 system-ui,sans-serif;color:#efe6ff;padding:16px");
    ov.innerHTML = '<form style="background:#1a1830;border:2px solid #ffd84a;border-radius:14px;padding:22px;max-width:420px;width:100%">' +
      '<div style="font-size:13px;letter-spacing:.08em;color:#ffd84a;text-transform:uppercase">Class: ' + esc(C.name || C.code) + "</div>" +
      '<h2 style="margin:6px 0 10px;font-size:22px">What should your teacher call you?</h2>' +
      '<p style="margin:0 0 12px;opacity:.85">Type your first name and last initial, or a nickname your teacher knows. Your teacher sees how far you get.</p>' +
      '<input id="class-nick-in" maxlength="24" autocomplete="off" style="width:100%;box-sizing:border-box;font:inherit;padding:10px;border-radius:8px;border:1px solid #6a6090;background:#0f0e1c;color:#fff">' +
      '<button type="submit" style="margin-top:14px;font:inherit;font-weight:700;padding:10px 20px;border:0;border-radius:8px;background:#ffd84a;color:#241a00;cursor:pointer">Start</button></form>';
    document.body.appendChild(ov);
    var inp = ov.querySelector("input");
    setTimeout(function () { try { inp.focus(); } catch (e) {} }, 50);
    ov.querySelector("form").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var v = inp.value.replace(/[<>]/g, "").trim().slice(0, 24);
      if (!v) { inp.focus(); return; }
      try { localStorage.setItem(NICK_KEY, v); } catch (e) {}
      ov.parentNode.removeChild(ov);
    });
  }
  if (document.body) askNick(); else document.addEventListener("DOMContentLoaded", askNick);

  var last = { night: -1, score: 0, wrong: 0 };
  global.SolClass = {
    config: C,
    unit: unit,
    packs: mine.map(function (p) { return p.id; }),
    nick: nick,
    report: function (sc, status, level) {
      if (!global.SOL_CLASS_SEND || !sc) return;
      if (sc.night !== last.night) last = { night: sc.night, score: 0, wrong: 0 };
      var score = sc.score || 0, wrong = sc.nightWrong || 0;
      var rec = { name: nick() || "(no name)", night: sc.night, right: Math.max(0, score - last.score), wrong: Math.max(0, wrong - last.wrong),
        reading: level == null ? "" : String(level), family: sc.family || unit, status: status || "playing" };
      last.score = score; last.wrong = wrong;
      global.SOL_CLASS_SEND(rec);
    }
  };
})(window);
