/* The teacher page's script (tools/build-teacher.js inlines it after js/progress-code.js). The same page is the
   game's Teacher screen (js/teacher-screen.js shows it inside the game) and a file the teacher can open on their
   own computer.
   Reads progress codes from pasted text, from .txt / .html files and from Canvas's "Download Submissions" .zip
   (unzipped here: the zip's central directory or local headers, and DecompressionStream("deflate-raw")), and the
   class list from Canvas's gradebook export (.csv: Student "Smith, Ann", ID ...), kept on this computer. Shows the
   class four ways: student cards with a suggested participation grade from the teacher's goals, the full table, a
   leaderboard (First name + last initial by default, or nicknames, or ranks only) and a standards report (each
   standard's % right on the first try, class and student by student). Writes a CSV of the table, a standards CSV and
   a Canvas gradebook import file (the export's student columns + the assignment's column).

   GRADING ROUNDS (v5.15.1): a code is a running total, so the page always grades "since last time". When the
   teacher finishes a round, each student's code is kept (on this computer) as the starting point of the next round;
   every number on the page then counts only the work since then (minutes, levels, questions, accuracy, standards,
   new badges; the highest level stays the student's highest). The first round counts everything. A student whose
   totals went DOWN (a new Chromebook, or a restore from an older code) is counted from this code alone and flagged.
   An earlier Download Submissions .zip can set the starting point too (a new computer), and a round can be undone. */
(function () {
  "use strict";
  var C = window.SolProgressCode, ST = window.TEACHER_STATE, B = C.BUILDS[ST];
  var LS = "solTeacher." + ST + ".goals", LS_ROSTER = "solTeacher." + ST + ".roster", LS_VIEW = "solTeacher." + ST + ".view", LS_ROUNDS = "solTeacher." + ST + ".rounds";
  var GOALS = [
    { k: "minutes", label: "Minutes played", short: "Minutes", unit: "minutes", def: 60, w: 1 },
    { k: "won", label: "Levels won", short: "Levels won", unit: "levels", def: 10, w: 1 },
    { k: "answered", label: "Questions answered", short: "Questions", unit: "questions", def: 50, w: 1 },
    { k: "days", label: "Days played", short: "Days", unit: "days", def: 5, w: 0 },
    { k: "acc", label: "Right on the first try", short: "% right", unit: "%", def: 70, w: 0 }
  ];
  var DEF_POINTS = 100;
  var $ = function (id) { return document.getElementById(id); };
  var rows = [], notes = [], sortBy = { k: "student", dir: 1 }, view = "cards", hidden = {};
  try { var v0 = localStorage.getItem(LS_VIEW); if (/^(cards|table|board|std)$/.test(v0 || "")) view = v0; } catch (e) {}

  /* ── goals (remembered in this browser) ── */
  var goals = loadGoals();
  function loadGoals() {
    var g = { points: DEF_POINTS };
    GOALS.forEach(function (x) { g[x.k] = { t: x.def, w: x.w }; });
    try {
      var s = JSON.parse(localStorage.getItem(LS) || "null");
      if (s && typeof s === "object") {
        if (s.points > 0) g.points = +s.points;
        GOALS.forEach(function (x) {
          var v = s[x.k];
          if (v && v.t > 0) g[x.k].t = +v.t;
          if (v && v.w >= 0) g[x.k].w = +v.w;
        });
      }
    } catch (e) {}
    return g;
  }
  function saveGoals() { try { localStorage.setItem(LS, JSON.stringify(goals)); } catch (e) {} }
  function numIn(v, min, max, dflt) { v = parseFloat(v); return isFinite(v) ? Math.min(max, Math.max(min, v)) : dflt; }
  function paintGoals() {
    var tb = $("goal-rows");
    tb.innerHTML = "";
    GOALS.forEach(function (x) {
      var tr = document.createElement("tr");
      tr.innerHTML = "<td>" + x.label + "</td>" +
        '<td><input type="number" min="1" max="' + (x.k === "acc" ? 100 : 100000) + '" step="1" data-k="' + x.k + '" data-f="t" aria-label="' + x.label + ' for full credit" /> ' + x.unit + "</td>" +
        '<td><input type="number" min="0" max="10" step="1" data-k="' + x.k + '" data-f="w" aria-label="How much ' + x.label + ' counts" /></td>';
      tb.appendChild(tr);
    });
    Array.prototype.forEach.call(tb.querySelectorAll("input"), function (inp) {
      inp.value = goals[inp.dataset.k][inp.dataset.f];
      inp.addEventListener("input", function () {
        var f = inp.dataset.f, x = goals[inp.dataset.k];
        if (f === "t") x.t = numIn(inp.value, 1, inp.dataset.k === "acc" ? 100 : 100000, x.t);
        else x.w = numIn(inp.value, 0, 10, x.w);
        saveGoals(); paint();
      });
    });
    $("points").value = goals.points;
  }
  $("points").addEventListener("input", function () { goals.points = numIn($("points").value, 1, 1000, goals.points); saveGoals(); paint(); });
  $("goals-reset").addEventListener("click", function () {
    try { localStorage.removeItem(LS); } catch (e) {}
    goals = loadGoals(); paintGoals(); paint();
  });
  function goalLine() {
    var on = GOALS.filter(function (x) { return goals[x.k].w > 0; });
    return "Full credit (" + goals.points + " points) at: " + on.map(function (x) { return goals[x.k].t + (x.k === "acc" ? "%" : " " + x.unit) + (x.k === "acc" ? " right on the first try" : ""); }).join(", ") + ". Open box 1 to change the scoring criteria.";
  }
  function goalVal(x, d) { return x.k === "acc" ? (d.answered ? 100 * d.right / d.answered : 0) : d[x.k]; }
  function grade(r) {
    if (!r || !r.ok || r.build !== ST) return null;
    var d = r.data, sumW = 0, got = 0;
    GOALS.forEach(function (x) {
      var g = goals[x.k], w = g.w;
      if (!(w > 0)) return;
      sumW += w; got += w * Math.min(1, goalVal(x, d) / g.t);
    });
    if (!sumW) return null;
    return Math.round(10 * goals.points * got / sumW) / 10;
  }
  function band(g) { if (g == null) return "none"; var f = g / goals.points; return f >= 0.9 ? "hi" : f >= 0.7 ? "mid" : "lo"; }

  /* ── the class list: Canvas's gradebook export ── */
  var roster = loadRoster();
  function loadRoster() { try { var r = JSON.parse(localStorage.getItem(LS_ROSTER) || "null"); return r && Array.isArray(r.header) && Array.isArray(r.list) ? r : null; } catch (e) { return null; } }
  function saveRoster() { try { if (roster) localStorage.setItem(LS_ROSTER, JSON.stringify(roster)); else localStorage.removeItem(LS_ROSTER); } catch (e) {} }
  function parseCsv(text) {
    var out = [], row = [], cell = "", q = false, i, ch;
    text = String(text).replace(/^﻿/, "");
    for (i = 0; i < text.length; i++) {
      ch = text.charAt(i);
      if (q) {
        if (ch === '"') { if (text.charAt(i + 1) === '"') { cell += '"'; i++; } else q = false; }
        else cell += ch;
      } else if (ch === '"') q = true;
      else if (ch === ",") { row.push(cell); cell = ""; }
      else if (ch === "\n" || ch === "\r") { if (ch === "\r" && text.charAt(i + 1) === "\n") i++; row.push(cell); out.push(row); row = []; cell = ""; }
      else cell += ch;
    }
    if (cell !== "" || row.length) { row.push(cell); out.push(row); }
    return out;
  }
  /* a gradebook export: a header with Student and ID; rows like "Smith, Ann","12345",... (the "Points Possible" row and
     the Test Student are left out) */
  function readRoster(text) {
    var t = parseCsv(text), h = t[0] || [], iS = h.indexOf("Student"), iI = h.indexOf("ID");
    if (iS < 0 || iI < 0) return null;
    var list = [];
    t.slice(1).forEach(function (r) {
      var nm = String(r[iS] || "").trim(), id = String(r[iI] || "").trim();
      if (!nm || !/^\d+$/.test(id) || /points possible/i.test(nm) || /^student,\s*test$/i.test(nm) || /^test student$/i.test(nm)) return;
      var first, last;
      if (nm.indexOf(",") !== -1) { last = nm.slice(0, nm.indexOf(",")).trim(); first = nm.slice(nm.indexOf(",") + 1).trim(); }
      else { var ps = nm.split(/\s+/); first = ps[0]; last = ps.slice(1).join(" "); }
      list.push({ id: id, student: nm, first: first, last: last, cells: r.slice(0, h.length) });
    });
    if (!list.length) return null;
    return { header: h, list: list, saved: Date.now(), pick: null };
  }
  var ID_COLS = ["Student", "ID", "SIS User ID", "SIS Login ID", "Integration ID", "Section"];
  function assignCols() {
    if (!roster) return [];
    return roster.header.filter(function (x) { return /\(\d+\)\s*$/.test(x) && ID_COLS.indexOf(x) === -1; });
  }
  function assignCol() {
    var cols = assignCols();
    if (roster && roster.pick && cols.indexOf(roster.pick) !== -1) return roster.pick;
    var a = norm(B.assignment);
    return cols.filter(function (x) { return norm(x.replace(/\(\d+\)\s*$/, "")) === a; })[0] || cols.filter(function (x) { return norm(x).indexOf(a) === 0; })[0] || null;
  }
  function rosterFor(r) {
    if (!roster) return null;
    var i, s;
    if (r.userId) for (i = 0; i < roster.list.length; i++) if (roster.list[i].id === r.userId) return roster.list[i];
    var keys = [r.squash, r.name ? norm(r.name) : ""].filter(Boolean);
    for (i = 0; i < roster.list.length; i++) {
      s = roster.list[i];
      if (keys.indexOf(norm(s.last + s.first)) !== -1 || keys.indexOf(norm(s.first + s.last)) !== -1 || keys.indexOf(norm(s.student)) !== -1) return s;
    }
    return null;
  }
  function paintRoster() {
    var l = $("roster-line");
    if (roster) {
      l.innerHTML = "Class list: <b>" + roster.list.length + " students</b> from your gradebook export (saved " + new Date(roster.saved).toLocaleDateString() + "). " +
        "Real names show as <b>Ann S.</b> on the leaderboard.";
    } else l.innerHTML = "No class list yet. For real names, the list of who hasn't turned in and a Canvas import file, drop your <b>gradebook export</b> " +
      "(Canvas: Grades → Export → Export Entire Gradebook) above. Without it, students show by their nicknames.";
    $("forget").hidden = !roster;
  }

  /* ── reading codes ── */
  function norm(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, ""); }
  function cleanName(s) {
    return String(s || "").replace(/[\t:,;=|]+\s*$/, "").replace(/^[\s\-*•·>\d.)]+/, "").replace(/\s+/g, " ").trim().slice(0, 60);
  }
  /* Canvas names a submission file after the student and their Canvas ID: "smithann_12345_67890_text.html"
     (or "smithann_LATE_12345_67890_text.html") */
  function fileInfo(f) {
    var base = String(f).split(/[\\/]/).pop().replace(/\.[a-z0-9]+$/i, ""), parts = base.split("_"), k = 1;
    if (/^LATE$/i.test(parts[1] || "")) k = 2;
    if (parts.length >= 2 && /^\d+$/.test(parts[k] || "")) return { squash: parts[0], id: parts[k] };
    if (parts.length >= 3 && /^\d+$/.test(parts[parts.length - 2] || "")) return { squash: parts[0], id: null };
    return { squash: base, id: null };
  }
  function nameFromFile(f) { return fileInfo(f).squash; }
  /* text from an HTML submission: block tags become line breaks, entities are decoded */
  function htmlText(html) {
    var t = String(html).replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<\/?(p|div|br|li|ul|ol|tr|td|th|h\d|table|section|article|blockquote|pre)\b[^>]*>/gi, "\n")
      .replace(/<[^>]*>/g, "");
    var ta = document.createElement("textarea");
    ta.innerHTML = t;
    return ta.value;
  }
  function addText(text, source, fileName) {
    var found = C.findCodes(text), n = 0, fi = fileName ? fileInfo(fileName) : null;
    found.forEach(function (f) {
      var name = "";
      if (fi) name = fi.squash;
      else if (/[\t:,;=|]\s*$/.test(f.before)) name = cleanName(f.before);
      addRow(f, name, source, fi);
      n++;
    });
    return n;
  }
  function addRow(f, name, source, fi) {
    var res = f.result, r = { name: name, source: source, raw: res.ok ? res.code : f.raw, ok: !!res.ok, build: res.build,
      data: res.ok ? res.data : null, full: res.ok ? res.data : null, why: res.ok ? "" : res.why, count: 1, userId: fi ? fi.id : null, squash: fi ? fi.squash : null };
    r.student = name || (r.data && r.data.nick ? r.data.nick : "");
    r.key = r.userId ? "i:" + r.userId : name ? "n:" + norm(name) : (r.data && r.data.nick ? "k:" + norm(r.data.nick) : "c:" + norm(r.raw));
    var old = null, i;
    for (i = 0; i < rows.length; i++) if (rows[i].key === r.key) { old = rows[i]; break; }
    if (!old) { rows.push(r); return; }
    if (old.raw === r.raw) return;                     /* the same code twice */
    var better = (r.ok && !old.ok) || (r.ok && old.ok && (r.build === ST) > (old.build === ST)) ||
      (r.ok === old.ok && (r.build === ST) === (old.build === ST) && r.ok && r.data.made > old.data.made);
    var keep = better ? r : old;
    keep.count = old.count + 1;
    rows[i] = keep;
  }
  function msg(text, bad) { var m = $("msg"); m.textContent = text; m.className = bad ? "bad" : "ok"; }

  /* ── .zip files ── */
  function u16(u, o) { return u[o] | (u[o + 1] << 8); }
  function u32(u, o) { return (u[o] | (u[o + 1] << 8) | (u[o + 2] << 16) | (u[o + 3] << 24)) >>> 0; }
  var utf8 = new TextDecoder("utf-8");
  function zipEntries(u) {
    var list = [], i, eocd = -1;
    for (i = u.length - 22; i >= 0 && i >= u.length - 65558; i--) if (u32(u, i) === 0x06054b50) { eocd = i; break; }
    if (eocd >= 0) {
      var n = u16(u, eocd + 10), off = u32(u, eocd + 16);
      for (i = 0; i < n && off + 46 <= u.length && u32(u, off) === 0x02014b50; i++) {
        var nl = u16(u, off + 28), xl = u16(u, off + 30), cl = u16(u, off + 32);
        list.push({ name: utf8.decode(u.subarray(off + 46, off + 46 + nl)), method: u16(u, off + 10), size: u32(u, off + 20), at: u32(u, off + 42) });
        off += 46 + nl + xl + cl;
      }
    }
    if (!list.length) {                                /* no central directory: walk the local headers */
      var p = 0;
      while (p + 30 <= u.length && u32(u, p) === 0x04034b50) {
        var flags = u16(u, p + 6), size = u32(u, p + 18), nl2 = u16(u, p + 26), xl2 = u16(u, p + 28);
        if ((flags & 8) && !size) break;
        list.push({ name: utf8.decode(u.subarray(p + 30, p + 30 + nl2)), method: u16(u, p + 8), size: size, at: p });
        p += 30 + nl2 + xl2 + size;
      }
    }
    return list;
  }
  function inflate(bytes) {
    if (typeof DecompressionStream === "undefined") return Promise.reject(new Error("nozip"));
    var ds;
    try { ds = new DecompressionStream("deflate-raw"); } catch (e) { return Promise.reject(new Error("nozip")); }
    return new Response(new Blob([bytes]).stream().pipeThrough(ds)).arrayBuffer().then(function (b) { return new Uint8Array(b); });
  }
  function readZip(buf) {
    var u = new Uint8Array(buf), list = zipEntries(u), out = [];
    if (!list.length) return Promise.reject(new Error("notzip"));
    return list.reduce(function (p, e) {
      return p.then(function () {
        if (/\/$/.test(e.name) || /(^|\/)(__MACOSX|\.)/.test(e.name)) return;
        if (u32(u, e.at) !== 0x04034b50) return;
        var start = e.at + 30 + u16(u, e.at + 26) + u16(u, e.at + 28), data = u.subarray(start, start + e.size);
        var got = e.method === 0 ? Promise.resolve(data) : e.method === 8 ? inflate(data) : Promise.resolve(null);
        return got.then(function (b) { if (b) out.push({ name: e.name, text: utf8.decode(b) }); });
      });
    }, Promise.resolve()).then(function () { return out; });
  }
  function readFiles(files) {
    var total = 0, filesRead = 0, problems = [], gotRoster = null;
    files = Array.prototype.slice.call(files || []);
    if (!files.length) return Promise.resolve();
    msg("Reading " + files.length + " file" + (files.length === 1 ? "" : "s") + "…");
    return files.reduce(function (p, f) {
      return p.then(function () {
        return f.arrayBuffer().then(function (buf) {
          var u = new Uint8Array(buf);
          if (u.length >= 4 && u32(u, 0) === 0x04034b50 || /\.zip$/i.test(f.name)) {
            return readZip(buf).then(function (entries) {
              entries.forEach(function (e) {
                filesRead++;
                var n = addText(/\.html?$/i.test(e.name) ? htmlText(e.text) : e.text, "zip", e.name);
                total += n;
                if (!n) problems.push(nameFromFile(e.name) + ": no code in the submission");
              });
            }, function (err) {
              problems.push(err.message === "nozip" ? f.name + ": this browser can't open .zip files. Use Chrome (or unzip the file and choose the files inside it)." : f.name + ": not a .zip file Canvas made, or it is damaged.");
            });
          }
          var text = utf8.decode(u);
          if (/\.csv$/i.test(f.name) || /^﻿?"?Student"?,/.test(text)) {
            var ro = readRoster(text);
            if (ro) { gotRoster = ro; return; }
          }
          filesRead++;
          var n2 = addText(/\.html?$/i.test(f.name) || /^\s*</.test(text) ? htmlText(text) : text, "file", /\.(html?|txt)$/i.test(f.name) && /_/.test(f.name) ? f.name : "");
          total += n2;
          if (!n2) problems.push(f.name + ": no code in the file");
        });
      });
    }, Promise.resolve()).then(function () {
      if (gotRoster) { if (roster && roster.pick) gotRoster.pick = roster.pick; roster = gotRoster; saveRoster(); paintRoster(); }
      notes = problems;
      paint();
      var said = [];
      if (gotRoster) said.push("Class list: " + gotRoster.list.length + " students.");
      if (filesRead || !gotRoster) said.push("Found " + total + " code" + (total === 1 ? "" : "s") + " in " + filesRead + " file" + (filesRead === 1 ? "" : "s") + ".");
      if (!total && !gotRoster && problems.length && /browser can't open/.test(problems.join(" "))) msg(problems[0], true);
      else msg(said.join(" ") + (problems.length ? " See the notes at the bottom." : ""), !total && !gotRoster);
    }, function (e) { msg("Could not read the file: " + e.message, true); });
  }

  /* ── people: names ── */
  /* ── grading rounds: grade only what changed since last time ── */
  var rounds = loadRounds();
  function loadRounds() {
    var x = null;
    try { x = JSON.parse(localStorage.getItem(LS_ROUNDS) || "null"); } catch (e) {}
    if (!x || typeof x !== "object" || !x.base || typeof x.base !== "object") x = { since: null, base: {}, prev: null };
    return x;
  }
  function saveRounds() { try { localStorage.setItem(LS_ROUNDS, JSON.stringify(rounds)); } catch (e) {} }
  function baseKeys(r) {
    var ro = rosterFor(r), d = r.full, k = [];
    if (r.userId) k.push("i:" + r.userId);
    if (ro) k.push("i:" + ro.id);
    if (r.name && !r.squash) k.push("n:" + norm(r.name));
    if (ro) k.push("n:" + norm(ro.first + " " + ro.last));
    if (d && d.nick) k.push("k:" + norm(d.nick));
    return k;
  }
  /* the code this student's round starts from (null: the first round, everything counts) */
  function baseFor(r) {
    var ks = baseKeys(r), i, e;
    for (i = 0; i < ks.length; i++) {
      e = rounds.base[ks[i]];
      if (e) { var res = C.decode(e); if (res.ok && res.build === ST) return res.data; }
    }
    return null;
  }
  function sub(a, b) { return Math.max(0, (a || 0) - (b || 0)); }
  /* this round's numbers: the newest code minus the starting point */
  function roundOf(r) {
    var cur = r.full, prev = baseFor(r);
    r.reset = false; r.since = prev ? prev.made : null;
    if (!prev) return cur;
    if (cur.answered < prev.answered || cur.minutes < prev.minutes || cur.started < prev.started) { r.reset = true; r.since = null; return cur; }
    var d = {};
    Object.keys(cur).forEach(function (k) { d[k] = cur[k]; });
    ["days", "minutes", "started", "won", "lost", "answered", "right", "wrong"].forEach(function (k) { d[k] = sub(cur[k], prev[k]); });
    d.perfect = sub(cur.perfect, prev.perfect);
    d.levelsUp = sub(cur.hiWon, prev.hiWon);
    d.skills = (cur.skills || []).map(function (s, i) { var p = (prev.skills || [])[i] || {}; return { key: s.key, name: s.name, a: sub(s.a, p.a), r: sub(s.r, p.r) }; });
    if (cur.std) {
      var pm = {};
      (prev.std || []).forEach(function (s) { pm[s.code] = s; });
      d.std = cur.std.map(function (s) { var p = pm[s.code] || {}; return { code: s.code, a: sub(s.a, p.a), r: sub(s.r, p.r) }; }).filter(function (s) { return s.a > 0; });
    }
    if (cur.badges) d.badges = cur.badges.filter(function (b) { return (prev.badges || []).indexOf(b) === -1; });
    d.first = prev.last || cur.first;
    return d;
  }
  function applyRounds() { rows.forEach(function (r) { r.data = r.ok && r.build === ST ? roundOf(r) : r.full; }); }
  function finishRound() {
    var mineRows = rows.filter(function (r) { return r.ok && r.build === ST; });
    if (!mineRows.length) { msg("Add the codes first: Submit codes keeps the codes on this page as the new starting point.", true); return; }
    if (!window.confirm("Submit these codes? From now on the page counts only the work students do after these codes (" + mineRows.length +
      " student" + (mineRows.length === 1 ? "" : "s") + "). Do this after you have entered these grades in Canvas.")) return;
    var base = {}, k;
    for (k in rounds.base) base[k] = rounds.base[k];
    mineRows.forEach(function (r) { baseKeys(r).forEach(function (key) { base[key] = r.raw; }); });
    rounds = { since: Date.now(), base: base, prev: { since: rounds.since, base: rounds.base } };
    saveRounds();
    paint(); paintRounds();
    msg("Codes submitted. Next time, drop the new Download Submissions .zip: the grades will count only what students do from now on.");
  }
  function undoRound() {
    if (!rounds.prev) return;
    if (!window.confirm("Return to the previous codes? The codes you submitted last are forgotten.")) return;
    rounds = { since: rounds.prev.since, base: rounds.prev.base || {}, prev: null };
    saveRounds(); paint(); paintRounds(); msg("Back to the previous codes.");
  }
  function paintRounds() {
    var el = $("round-line");
    if (rounds.since) el.innerHTML = "<b>Counting the work since " + esc(new Date(rounds.since).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })) + "</b> (the codes you submitted then). " +
      "Every number on this page counts only the work students did after them. Put each round's grades in a new assignment column.";
    else el.innerHTML = "<b>No codes submitted yet:</b> everything students have done so far counts. When you have entered these grades in Canvas, click <b>Submit codes</b>: next time, only the new work counts.";
    $("undo-round").hidden = !rounds.prev;
  }
  function D(r) { return r && r.ok ? r.data : null; }
  function mine(r) { return !!(r && r.ok && r.build === ST); }
  function person(r) {
    var ro = rosterFor(r);
    if (ro) return { full: ro.first + " " + ro.last, first: ro.first, last: ro.last, ro: ro };
    var nm = r.name && !r.squash ? r.name : "";
    if (nm && /\s/.test(nm)) { var ps = nm.split(/\s+/); return { full: nm, first: ps[0], last: ps[ps.length - 1] }; }
    return { full: r.student || "(no name)", first: null, last: null };
  }
  function fullName(r) { return person(r).full; }
  function pct(a, b) { return b ? Math.round(100 * a / b) : null; }
  function fmtDay(s) {
    if (!s) return "";
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    return m ? new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : s;
  }
  function fmtTime(ms) {
    var d = new Date(ms);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) + " " + d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }
  function isoTime(ms) { var d = new Date(ms); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); }
  function status(r) { return !r.ok ? "INVALID" : r.build !== ST ? "Other game" : "Valid"; }
  function badgesOf(r) { var d = D(r); return d && d.badges ? d.badges.length : 0; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ── the table ── */
  var COLS = [
    { k: "student", h: "Student", v: fullName, cls: "name l" },
    { k: "nick", h: "Nickname in code", v: function (r) { return D(r) ? D(r).nick : ""; }, cls: "l" },
    { k: "status", h: "Code", v: status, cls: "l status" },
    { k: "grade", h: "Suggested grade (of {P})", v: grade, num: true, cls: "grade" },
    { k: "hi", h: "Highest level", v: function (r) { return D(r) && D(r).hiReached; }, num: true, show: function (r) { var d = D(r); return d ? d.hiReached + (d.hiWon !== d.hiReached ? " (won " + d.hiWon + ")" : "") : ""; } },
    { k: "won", h: "Levels won", v: function (r) { return D(r) && D(r).won; }, num: true },
    { k: "started", h: "Levels played", v: function (r) { return D(r) && D(r).started; }, num: true },
    { k: "answered", h: "Questions answered", v: function (r) { return D(r) && D(r).answered; }, num: true },
    { k: "acc", h: "% right first try", v: function (r) { return D(r) && pct(D(r).right, D(r).answered); }, num: true, show: function (r) { var p = D(r) && pct(D(r).right, D(r).answered); return p == null ? "" : p + "%"; } },
    { k: "minutes", h: "Minutes played", v: function (r) { return D(r) && D(r).minutes; }, num: true },
    { k: "days", h: "Days played", v: function (r) { return D(r) && D(r).days; }, num: true },
    { k: "badges", h: "Badges", v: function (r) { return D(r) ? badgesOf(r) : null; }, num: true },
    { k: "streak", h: "Best streak", v: function (r) { return D(r) && D(r).bestStreak; }, num: true },
    { k: "first", h: "First played", v: function (r) { return D(r) && D(r).first; }, show: function (r) { return fmtDay(D(r) && D(r).first); } },
    { k: "last", h: "Last played", v: function (r) { return D(r) && D(r).last; }, show: function (r) { return fmtDay(D(r) && D(r).last); } }
  ];
  B.skills.forEach(function (s, i) {
    COLS.push({ k: "sk" + i, h: s[1] + " (% right)", skill: s,
      v: function (r) { var d = D(r); if (!d || r.build !== ST || !d.skills[i]) return null; return pct(d.skills[i].r, d.skills[i].a); }, num: true,
      show: function (r) { var d = D(r); if (!d || r.build !== ST || !d.skills[i] || !d.skills[i].a) return d && r.build === ST ? "–" : ""; var x = d.skills[i]; return pct(x.r, x.a) + "% of " + x.a; } });
  });
  COLS.push({ k: "made", h: "Code made", v: function (r) { return D(r) && D(r).made; }, show: function (r) { return D(r) ? fmtTime(D(r).made) : ""; } });

  function cmp(a, b) {
    var c = COLS.filter(function (x) { return x.k === sortBy.k; })[0] || COLS[0];
    var x = c.v(a), y = c.v(b);
    var ex = x == null || x === "", ey = y == null || y === "";
    if (ex || ey) return ex === ey ? 0 : ex ? 1 : -1;      /* blanks last */
    if (c.num) return (x - y) * sortBy.dir;
    return String(x).localeCompare(String(y), undefined, { numeric: true, sensitivity: "base" }) * sortBy.dir;
  }
  function sortedRows() { return rows.slice().sort(function (a, b) { return cmp(a, b) || String(fullName(a)).localeCompare(String(fullName(b))); }); }
  function head(c) { return c.h.replace("{P}", goals.points); }
  function paintTable() {
    var t = $("table");
    if (!rows.length) { t.innerHTML = '<tbody><tr><td class="empty">No codes yet. Add them in box 2.</td></tr></tbody>'; return; }
    var h = "<thead><tr>" + COLS.map(function (c) {
      return '<th class="' + (c.cls || "") + '" data-k="' + c.k + '" title="Sort by ' + esc(head(c)) + '">' + esc(head(c)) +
        (sortBy.k === c.k ? ' <span class="arr">' + (sortBy.dir > 0 ? "▲" : "▼") + "</span>" : "") + "</th>";
    }).join("") + "</tr></thead><tbody>";
    sortedRows().forEach(function (r) {
      var cls = !r.ok ? "invalid" : r.build !== ST ? "other" : "";
      h += '<tr class="' + cls + '">' + COLS.map(function (c) {
        var v;
        if (c.k === "status") {
          v = !r.ok ? '<span class="st-bad">INVALID</span><div class="small" title="' + esc(r.raw) + '">' + esc(r.why) + "</div>" :
            r.build !== ST ? '<span class="st-other">Other game</span><div class="small">' + esc(C.BUILDS[r.build].short) + ": use that game's teacher screen</div>" :
            '<span class="st-ok">Valid</span>' + (r.count > 1 ? '<div class="small">' + r.count + " codes: newest kept</div>" : "");
        } else if (c.k === "grade") {
          var g = grade(r); v = g == null ? (mine(r) ? "–" : "") : String(g);
        } else v = esc(c.show ? c.show(r) : c.v(r));
        return '<td class="' + (c.cls || "") + '">' + (v == null ? "" : v) + "</td>";
      }).join("") + "</tr>";
    });
    t.innerHTML = h + "</tbody>";
    Array.prototype.forEach.call(t.querySelectorAll("th"), function (th) {
      th.addEventListener("click", function () {
        var k = th.getAttribute("data-k");
        sortBy = { k: k, dir: sortBy.k === k ? -sortBy.dir : (COLS.filter(function (c) { return c.k === k; })[0].num ? -1 : 1) };
        paint();
      });
    });
  }

  /* ── the class summary ── */
  function missing() {
    if (!roster) return [];
    var got = {};
    rows.forEach(function (r) { if (mine(r)) { var ro = rosterFor(r); if (ro) got[ro.id] = 1; } });
    return roster.list.filter(function (s) { return !got[s.id]; });
  }
  function paintSummary() {
    var v = rows.filter(mine), gs = v.map(grade).filter(function (g) { return g != null; }), el = $("summary");
    if (!rows.length && !roster) { el.innerHTML = ""; return; }
    var avg = gs.length ? Math.round(10 * gs.reduce(function (a, b) { return a + b; }, 0) / gs.length) / 10 : null;
    var full = gs.filter(function (g) { return g >= goals.points; }).length, low = gs.filter(function (g) { return g < 0.7 * goals.points; }).length;
    var ans = v.reduce(function (a, r) { return a + r.data.answered; }, 0), right = v.reduce(function (a, r) { return a + r.data.right; }, 0);
    var mins = v.reduce(function (a, r) { return a + r.data.minutes; }, 0), bad = rows.filter(function (r) { return !r.ok; }).length, other = rows.length - v.length - bad;
    var miss = missing();
    function st(n, label) { return '<div class="st"><b>' + esc(n) + "</b><span>" + esc(label) + "</span></div>"; }
    var h = st(v.length + (roster ? " of " + roster.list.length : ""), "students with a valid code") +
      st(avg == null ? "–" : avg, "average suggested grade (of " + goals.points + ")") + st(full, "at full credit") + st(low, "below 70%") +
      st(ans ? pct(right, ans) + "%" : "–", "right on the first try (class" + (rounds.since ? ", this round" : "") + ")") + st(mins, "minutes played (class" + (rounds.since ? ", this round" : "") + ")");
    if (bad || other) h += st(bad + other, (bad ? bad + " INVALID" : "") + (bad && other ? ", " : "") + (other ? other + " other game" : ""));
    if (roster) h += '<div class="st wide"><b style="display:inline;font-size:18px">' + (miss.length ? miss.length + " not turned in: " : "Everyone on the class list turned in a code.") + "</b> " +
      esc(miss.map(function (s) { return s.first + " " + s.last; }).join(", ")) + "</div>";
    el.innerHTML = h;
  }

  /* ── student cards ── */
  function paintCards() {
    var el = $("cards"), list = sortedRows(), miss = missing();
    if (!list.length && !miss.length) { el.innerHTML = '<p class="empty">No codes yet. Drop the Download Submissions .zip in box 2.</p>'; return; }
    var on = GOALS.filter(function (x) { return goals[x.k].w > 0; });
    var h = list.map(function (r) {
      var d = D(r), g = grade(r), b = mine(r) ? band(g) : "none", p = person(r);
      var out = '<div class="card g-' + b + '"><h3>' + esc(p.full) + "</h3>" + (d && d.nick ? '<div class="nick">“' + esc(d.nick) + "”</div>" : "");
      if (!r.ok) return out + '<div class="gr" style="color:var(--bad)">INVALID</div><div class="meta">' + esc(r.why) + "</div></div>";
      if (!mine(r)) return out + '<div class="gr" style="color:var(--warn)">Other game</div><div class="meta">' + esc(C.BUILDS[r.build].short) + "</div></div>";
      out += '<div class="gr">' + (g == null ? "–" : g) + ' <span class="small">/ ' + goals.points + "</span></div>";
      on.forEach(function (x) {
        var val = goalVal(x, d), f = Math.min(1, val / goals[x.k].t);
        out += '<div class="lbl"><span>' + esc(x.short) + "</span><span>" + Math.round(val) + (x.k === "acc" ? "%" : "") + " / " + goals[x.k].t + (x.k === "acc" ? "%" : "") + "</span></div>" +
          '<div class="bar"><i style="width:' + Math.round(100 * f) + '%"></i></div>';
      });
      var rd = !!(rounds.since && !r.reset);
      out += '<div class="meta">Highest level ' + d.hiReached + " · " + d.won + " levels won" + (rd ? " this round" : "") + " · " + badgesOf(r) + (rd ? " new" : "") + " badges" + (d.last ? " · last played " + esc(fmtDay(d.last)) : "") + (r.reset ? " · <b>counted from a new start</b>" : "") + "</div>";
      return out + "</div>";
    }).join("");
    h += miss.map(function (s) { return '<div class="card missing g-none"><h3>' + esc(s.first + " " + s.last) + '</h3><div class="gr" style="color:var(--dim)">No code</div><div class="meta">Not turned in yet.</div></div>'; }).join("");
    el.innerHTML = h;
  }

  /* ── the leaderboard ── */
  var BOARD = [
    ["won", "Levels won", function (d) { return d.won; }],
    ["hi", "Highest level", function (d) { return d.hiReached; }],
    ["answered", "Questions answered", function (d) { return d.answered; }],
    ["acc", "% right on the first try (20+ questions)", function (d) { return d.answered >= 20 ? pct(d.right, d.answered) : null; }, "%"],
    ["badges", "Badges earned", function (d) { return d.badges ? d.badges.length : 0; }],
    ["minutes", "Minutes played", function (d) { return d.minutes; }],
    ["streak", "Best streak (in a row, first try)", function (d) { return d.bestStreak || 0; }]
  ];
  function boardName(r, mode, i) {
    var d = D(r), p = person(r);
    if (mode === "none") return "";
    if (mode === "first" && p.first) return p.first + (p.last ? " " + p.last.charAt(0).toUpperCase() + "." : "");
    return d && d.nick ? d.nick : "Player " + (i + 1);
  }
  function paintBoard() {
    var sel = $("board-by");
    if (!sel.options.length) BOARD.forEach(function (b) { var o = document.createElement("option"); o.value = b[0]; o.textContent = b[1]; sel.appendChild(o); });
    var by = BOARD.filter(function (b) { return b[0] === sel.value; })[0] || BOARD[0], n = +$("board-n").value, names = $("board-names").value;
    var list = rows.filter(function (r) { return mine(r) && !hidden[r.key]; }).map(function (r) { return { r: r, v: by[2](r.data) }; })
      .filter(function (x) { return x.v != null; }).sort(function (a, b) { return b.v - a.v; });
    var shown = n ? list.slice(0, n) : list, seen = {}, rank = 0, lastV = null;
    var items = shown.map(function (x, i) {
      if (x.v !== lastV) { rank = i + 1; lastV = x.v; }
      var nm = boardName(x.r, names, i);
      if (nm) { seen[nm] = (seen[nm] || 0) + 1; if (seen[nm] > 1) nm += " (" + seen[nm] + ")"; }
      return '<li><span class="rk">' + rank + '</span><span class="nm">' + esc(nm || "") + '</span><span class="val">' + x.v + (by[3] || "") +
        '</span><button type="button" class="btn hide noprint" data-key="' + esc(x.r.key) + '" title="Leave this student off the leaderboard">Hide</button></li>';
    });
    var nh = Object.keys(hidden).length, el = $("board");
    el.innerHTML = '<p class="board-title">Class leaderboard · ' + esc(by[1]) + "</p>" + (items.length ? "<ol>" + items.join("") + "</ol>" : '<p class="empty">No valid codes yet.</p>') +
      (el.classList.contains("full") ? '<button type="button" class="btn" id="board-exit">Close full screen</button>' : "");
    Array.prototype.forEach.call(el.querySelectorAll(".hide"), function (b) { b.addEventListener("click", function () { hidden[b.getAttribute("data-key")] = 1; paintBoard(); }); });
    var ex = $("board-exit"); if (ex) ex.addEventListener("click", function () { el.classList.remove("full"); paintBoard(); });
    $("board-unhide").hidden = !nh;
    $("board-unhide").textContent = "Show hidden students (" + nh + ")";
    $("board-hint").textContent = (names === "first" && !roster ? "Without your class list, students show by nickname. " : "") +
      "Hide leaves a student off this leaderboard (for example, an unkind nickname) until you reload this page.";
  }
  ["board-by", "board-n", "board-names"].forEach(function (id) { $(id).addEventListener("change", paintBoard); });
  $("board-unhide").addEventListener("click", function () { hidden = {}; paintBoard(); });
  $("board-full").addEventListener("click", function () { $("board").classList.add("full"); paintBoard(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && $("board").classList.contains("full")) { $("board").classList.remove("full"); paintBoard(); } });

  /* ── the standards report ── */
  var STRAND = { RL: "Literary", RI: "Informational", RV: "Vocabulary", DSR: "Paired texts" };
  /* v6.4: SOL Lab Biology's standards (BIO.8.a) belong to a unit, not a reading strand */
  var BIO_UNIT = { 1: "Scientific investigation", 2: "Biochemistry", 3: "Cells", 4: "Bacteria & viruses", 5: "Heredity", 6: "Classification", 7: "Evolution", 8: "Ecology" };
  function unitLabel(code) { var b = /^BIO\.(\d)/i.exec(code); return b ? (BIO_UNIT[b[1]] || "") : (STRAND[strandOf(code)] || ""); }
  function strandOf(code) {
    var b = /^BIO\.(\d)/i.exec(code);
    if (b) return "BIO" + b[1];
    var m = /^\d+\.(RL|RI|RV|DSR)\./.exec(code + ".");
    if (m) return m[1];
    if (/^L\./.test(code)) return "RV";
    if (/\.CT\./.test(code)) return "DSR";
    return /^RI\./.test(code) ? "RI" : /^RL\./.test(code) ? "RL" : "";
  }
  function stdOrder(a, b) {
    if (/^BIO\./i.test(a) || /^BIO\./i.test(b)) return a.localeCompare(b, undefined, { numeric: true });
    var pa = a.split("."), pb = b.split("."), ga = parseInt(pa[0], 10), gb = parseInt(pb[0], 10);
    if (ga !== gb) return (isNaN(ga) ? 99 : ga) - (isNaN(gb) ? 99 : gb);
    var so = ["RL", "RI", "RV", "DSR"], sa = so.indexOf(strandOf(a)), sb = so.indexOf(strandOf(b));
    return sa !== sb ? sa - sb : a.localeCompare(b, undefined, { numeric: true });
  }
  /* v5.17: Virginia's standards are split into SKILLS (js/standards-va.js, inlined in the Virginia page): one skill
     per action verb, each LOTS (lower-order: identify, explain ...) or HOTS (higher-order: analyze, evaluate ...).
     A question names its skill (9.RL.2.A.2) or, in older codes, only its standard (9.RL.2.A). The report shows each
     standard with its skills under it, and LOTS and HOTS in total, for the class and for each student. */
  var SS = window.SolStandards || null;
  function info(c) {
    if (SS && SS.SKILL[c]) return { std: SS.SKILL[c].code, skill: c, text: SS.SKILL[c].text, level: SS.SKILL[c].level };
    if (SS && SS.STANDARDS[c]) return { std: c, skill: null, text: SS.STANDARDS[c].text, level: "" };
    return { std: c, skill: null, text: "", level: "" };
  }
  function skillText(c) { return info(c).text; }
  function lvBadge(l) { return l ? '<span class="lv lv-' + l.charAt(0) + '" title="' + (l === "LOTS" ? "Lower-order thinking skill" : "Higher-order thinking skill") + '">' + l + "</span>" : ""; }
  /* the keys each answer adds to: a skill, its standard and its level (LOTS/HOTS); an answer tagged only to a
     standard adds to the standard and to "<standard>*" (questions on the whole standard) */
  function keysOf(c) {
    var i = info(c);
    return i.skill ? [i.skill, i.std, i.level] : [c, c + "*"];
  }
  function stdData() {
    var v = rows.filter(mine), tot = {}, kids = {}, stds = {}, per = [], old = 0;
    function add(m, k, s) { var t = m[k] || (m[k] = { a: 0, r: 0 }); t.a += s.a; t.r += s.r; }
    v.forEach(function (r) {
      var m = {};
      if (!r.data.std) { old++; return; }
      r.data.std.forEach(function (s) {
        var i = info(s.code);
        stds[i.std] = 1;
        if (i.skill) (kids[i.std] || (kids[i.std] = {}))[i.skill] = 1;
        keysOf(s.code).forEach(function (k) { if (k) add(m, k, s); });
      });
      Object.keys(m).forEach(function (k) { var t = tot[k] || (tot[k] = { a: 0, r: 0, n: 0 }); t.a += m[k].a; t.r += m[k].r; if (m[k].a) t.n++; });
      per.push({ r: r, m: m });
    });
    var codes = Object.keys(stds).sort(stdOrder), leaves = [];
    var kidList = {};
    codes.forEach(function (c) {
      var k = Object.keys(kids[c] || {}).sort(stdOrder);
      if (k.length && tot[c + "*"]) k.push(c + "*");
      kidList[c] = k;
      leaves = leaves.concat(k.length ? k : [c]);
    });
    return { codes: codes, kids: kidList, leaves: leaves, tot: tot, per: per.sort(function (a, b) { return fullName(a.r).localeCompare(fullName(b.r)); }), old: old };
  }
  function leafText(c) { return /\*$/.test(c) ? "Questions on the whole standard (from codes made before v5.17)" : skillText(c); }
  function leafCode(c) { return /\*$/.test(c) ? c.slice(0, -1) : c; }
  function cellCls(p) { return p == null ? "" : p >= 80 ? "c-hi" : p >= 60 ? "c-mid" : "c-lo"; }
  var stdPage = "class", stdSort = "std", stdCols = "skills";
  function bar(p) { return '<span class="sbar"><i class="' + cellCls(p) + '" style="width:' + (p == null ? 0 : p) + '%"></i></span>'; }
  /* v5.16.2: the CLASS TOTAL page: every student's answers added together, standard by standard, with how many
     students are at 80%+, 60-79% and below 60% on it, the skill areas in total, and the weakest standards first.
     v5.17: LOTS and HOTS in total, and each standard's skills under it. */
  function paintStdClass(s) {
    var areas = {}, h = "";
    s.codes.forEach(function (c) { var sd = ST === "BIO" ? (unitLabel(c) || "?") : (strandOf(c) || "?"), a = areas[sd] || (areas[sd] = { a: 0, r: 0 }); a.a += s.tot[c].a; a.r += s.tot[c].r; });
    var all = s.codes.reduce(function (m, c) { m.a += s.tot[c].a; m.r += s.tot[c].r; return m; }, { a: 0, r: 0 });
    function card(p, label, n) { return '<div class="st"><b class="' + cellCls(p) + '-t">' + p + "%</b><span>" + label + " (" + n + " questions)</span></div>"; }
    h += '<div class="summary">' + ['<div class="st"><b>' + pct(all.r, all.a) + '%</b><span>the class, all standards (' + all.a + ' questions)</span></div>']
      .concat(["LOTS", "HOTS"].filter(function (k) { return s.tot[k]; }).map(function (k) {
        return card(pct(s.tot[k].r, s.tot[k].a), lvBadge(k) + (k === "LOTS" ? "lower-order skills" : "higher-order skills"), s.tot[k].a);
      }))
      .concat((ST === "BIO" ? Object.keys(areas) : ["RL", "RI", "RV", "DSR"]).filter(function (k) { return areas[k]; }).map(function (k) {
        return card(pct(areas[k].r, areas[k].a), esc(STRAND[k] || k), areas[k].a);
      })).join("") + "</div>";
    if (s.tot.LOTS && s.tot.HOTS) {
      var gap = pct(s.tot.LOTS.r, s.tot.LOTS.a) - pct(s.tot.HOTS.r, s.tot.HOTS.a);
      if (gap >= 10) h += '<p class="focus"><b>LOTS vs HOTS:</b> the class is ' + gap + " points lower on higher-order skills (analyze, evaluate, compare) than on lower-order ones (identify, explain). Reteach the HOTS skills below.</p>";
    }
    var buckets = {};
    s.per.forEach(function (x) { Object.keys(x.m).forEach(function (c) { var m = x.m[c]; if (!m.a) return; var b = buckets[c] || (buckets[c] = { hi: 0, mid: 0, lo: 0 }), p = pct(m.r, m.a); b[p >= 80 ? "hi" : p >= 60 ? "mid" : "lo"]++; }); });
    function p0(c) { return pct(s.tot[c].r, s.tot[c].a); }
    var weak = s.leaves.filter(function (c) { return s.tot[c] && s.tot[c].a >= 10; }).sort(function (x, y) { return p0(x) - p0(y); }).slice(0, 3);
    if (weak.length) h += '<p class="focus"><b>Reteach first:</b> ' + weak.map(function (c) { return esc(leafCode(c)) + " " + lvBadge(info(c).level) + esc(leafText(c)) + " (" + p0(c) + "%)"; }).join(" · ") + "</p>";
    var list = s.codes.slice();
    if (stdSort === "weak") list.sort(function (x, y) { return p0(x) - p0(y); });
    h += '<div class="std-wrap"><table class="std"><thead><tr><th class="l">' + (ST === "BIO" ? "Key idea" : "Standard / skill") + '</th><th>' + (ST === "BIO" ? "Unit" : "Skill area") + '</th><th class="skl">' + (ST === "BIO" ? "What it covers" : "What students do") + '</th><th>Students</th><th>Questions</th><th>Right first try</th><th>Class % right</th>' +
      '<th>Students 80%+</th><th>60–79%</th><th>Below 60%</th></tr></thead><tbody>';
    function row(c, cls, label, text) {
      var t = s.tot[c], p = pct(t.r, t.a), bk = buckets[c] || { hi: 0, mid: 0, lo: 0 };
      return '<tr class="' + cls + '"><td class="l">' + esc(label) + "</td><td>" + (cls === "sk" ? "" : esc(unitLabel(label))) + '</td><td class="skl">' + text + "</td><td>" + t.n + "</td><td>" + t.a + "</td><td>" + t.r +
        '</td><td class="' + cellCls(p) + '">' + p + "% " + bar(p) + '</td><td class="c-hi">' + bk.hi + '</td><td class="c-mid">' + bk.mid + '</td><td class="c-lo">' + bk.lo + "</td></tr>";
    }
    list.forEach(function (c) {
      var k = s.kids[c];
      h += row(c, k.length ? "sd" : "", c, esc(skillText(c)));
      var kl = k.slice();
      if (stdSort === "weak") kl.sort(function (x, y) { return p0(x) - p0(y); });
      kl.forEach(function (sk) { h += row(sk, "sk", leafCode(sk), lvBadge(info(sk).level) + esc(leafText(sk))); });
    });
    return h + "</tbody></table></div>";
  }
  function stuCols(s) {
    var lv = ["LOTS", "HOTS"].filter(function (k) { return s.tot[k]; });
    return lv.concat(stdCols === "skills" ? s.leaves : s.codes);
  }
  function colHead(c) {
    if (c === "LOTS" || c === "HOTS") return '<th title="All ' + (c === "LOTS" ? "lower" : "higher") + '-order skills">' + lvBadge(c) + "</th>";
    var i = info(c);
    return '<th title="' + esc(leafText(c)) + '">' + esc(leafCode(c)) + (i.level ? "<br>" + lvBadge(i.level) : "") + "</th>";
  }
  function paintStdStudents(s) {
    var cols = stuCols(s);
    var h = '<div class="std-wrap"><table class="std"><thead><tr><th class="l">Student</th>' + cols.map(colHead).join("") + "</tr></thead><tbody>";
    h += '<tr class="cls"><td class="l">Class total</td>' + cols.map(function (c) { var t = s.tot[c], p = pct(t.r, t.a); return '<td class="' + cellCls(p) + '">' + p + "% (" + t.a + ")</td>"; }).join("") + "</tr>";
    s.per.forEach(function (x) {
      h += '<tr><td class="l">' + esc(fullName(x.r)) + "</td>" + cols.map(function (c) {
        var m = x.m[c]; if (!m || !m.a) return "<td>–</td>";
        var p = pct(m.r, m.a); return '<td class="' + cellCls(p) + '">' + p + "% (" + m.a + ")</td>";
      }).join("") + "</tr>";
    });
    return h + "</tbody></table></div>";
  }
  function paintStd() {
    var s = stdData(), el = $("std");
    if (!s.codes.length) {
      el.innerHTML = '<p class="empty">No standards detail yet. ' + (s.old ? s.old + " code" + (s.old === 1 ? " is" : "s are") + " from before version 5.15, which didn't record standards: ask for new codes." : "Add codes in box 2.") + "</p>";
      return;
    }
    var split = s.leaves.length > s.codes.length || !!s.tot.LOTS;
    var h = '<div class="tabs noprint" role="tablist"><button type="button" class="tab' + (stdPage === "class" ? " on" : "") + '" data-sp="class">Class total</button>' +
      '<button type="button" class="tab' + (stdPage === "students" ? " on" : "") + '" data-sp="students">Student by student</button>' +
      (stdPage === "class" ? '<label class="sortby">Order <select id="std-sort"><option value="std"' + (stdSort === "std" ? " selected" : "") + '>By standard</option><option value="weak"' + (stdSort === "weak" ? " selected" : "") + '>Weakest first</option></select></label>' :
        split ? '<label class="sortby">Columns <select id="std-cols"><option value="skills"' + (stdCols === "skills" ? " selected" : "") + '>Each skill</option><option value="stds"' + (stdCols === "stds" ? " selected" : "") + '>Each standard</option></select></label>' : "") + "</div>";
    h += '<p class="std-key">' + (stdPage === "class" ? "Every student's answers added together. Class % right = right on the first try ÷ questions answered. The last three columns count students by their own % on that standard or skill." :
      "Each cell: % right on the first try (questions answered). Point at a column heading to read its skill.") + " Green 80%+, yellow 60–79%, red below 60%." +
      (split ? " " + lvBadge("LOTS") + "= lower-order skill (identify, describe, explain, interpret); " + lvBadge("HOTS") + "= higher-order skill (analyze, compare, distinguish, evaluate). A standard with two action verbs is split into two skills." : "") +
      (s.old ? " " + s.old + " student" + (s.old === 1 ? "'s code is" : "s' codes are") + " from before version 5.15 and not included." : "") + "</p>";
    h += stdPage === "class" ? paintStdClass(s) : paintStdStudents(s);
    el.innerHTML = h;
    Array.prototype.forEach.call(el.querySelectorAll(".tab[data-sp]"), function (t) { t.addEventListener("click", function () { stdPage = t.getAttribute("data-sp"); paintStd(); }); });
    var so = $("std-sort"); if (so) so.addEventListener("change", function () { stdSort = so.value; paintStd(); });
    var sc = $("std-cols"); if (sc) sc.addEventListener("change", function () { stdCols = sc.value; paintStd(); });
  }
  function stdCsv() {
    var s = stdData(), out = [["CLASS TOTAL"], ["Standard", "Skill", "Level", ST === "BIO" ? "Unit" : "Skill area", ST === "BIO" ? "What it covers" : "What students do", "Students", "Questions", "Right first try", "Class % right"]];
    function line(std, sk, c) { var t = s.tot[c], i = info(c); out.push([std, sk, i.level, unitLabel(std), sk ? leafText(c) : skillText(c), t.n, t.a, t.r, pct(t.r, t.a)]); }
    ["LOTS", "HOTS"].forEach(function (k) { if (s.tot[k]) { var t = s.tot[k]; out.push(["All " + k + " skills", "", k, "", k === "LOTS" ? "Lower-order skills" : "Higher-order skills", t.n, t.a, t.r, pct(t.r, t.a)]); } });
    s.codes.forEach(function (c) {
      line(c, "", c);
      s.kids[c].forEach(function (k) { line(c, /\*$/.test(k) ? "(whole standard)" : k, k); });
    });
    var cols = ["LOTS", "HOTS"].filter(function (k) { return s.tot[k]; }).concat(s.leaves);
    out.push([], ["STUDENT BY STUDENT (each skill)"]);
    out.push(["Student", "Nickname"].concat([].concat.apply([], cols.map(function (c) { var n = /\*$/.test(c) ? leafCode(c) + " whole standard" : c; return [n + " answered", n + " right first try", n + " % right"]; }))));
    out.push(["Class total", ""].concat([].concat.apply([], cols.map(function (c) { var t = s.tot[c]; return [t.a, t.r, pct(t.r, t.a)]; }))));
    s.per.forEach(function (x) {
      out.push([fullName(x.r), x.r.data.nick || ""].concat([].concat.apply([], cols.map(function (c) { var m = x.m[c]; return m && m.a ? [m.a, m.r, pct(m.r, m.a)] : ["", "", ""]; }))));
    });
    return csvText(out, ",");
  }

  /* ── files out ── */
  function csvText(out, sep) {
    return out.map(function (l) {
      return l.map(function (v) {
        v = String(v == null ? "" : v);
        if (sep === "\t") return v.replace(/[\t\r\n]+/g, " ");
        return /[",\r\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
      }).join(sep);
    }).join("\r\n") + "\r\n";
  }
  /* the table as text: CSV (",") or tab-separated for pasting into a spreadsheet ("\t") */
  function table(sep) {
    var hdr = ["Student", "Nickname in code", "Code status", "Suggested grade", "Points possible", "Highest level", "Highest level won", "Levels played", "Levels won", "Levels lost",
      "Questions answered", "Right on first try", "% right first try", "Wrong picks", "Minutes played", "Days played", "First played", "Last played", "Game modes tried", "Badges", "Best streak", "Perfect levels"];
    B.skills.forEach(function (s) { hdr.push(s[1] + " answered", s[1] + " right first try", s[1] + " % right"); });
    hdr.push("Code made", "Game", "Game version", "Code", "Note");
    var out = [hdr];
    sortedRows().forEach(function (r) {
      var d = D(r), g = grade(r), my = mine(r);
      var line = [fullName(r), d ? d.nick : "", r.ok ? (my ? "Valid" : "Other game") : "INVALID", g == null ? "" : g, my ? goals.points : ""];
      if (d) line.push(d.hiReached, d.hiWon, d.started, d.won, d.lost, d.answered, d.right, pct(d.right, d.answered) == null ? "" : pct(d.right, d.answered), d.wrong, d.minutes, d.days, d.first || "", d.last || "", d.modes,
        badgesOf(r), d.bestStreak == null ? "" : d.bestStreak, d.perfect == null ? "" : d.perfect);
      else line.push("", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");
      B.skills.forEach(function (s, i) { var x = my && d.skills[i]; line.push(x ? x.a : "", x ? x.r : "", x && x.a ? pct(x.r, x.a) : ""); });
      line.push(d ? isoTime(d.made) : "", r.build ? C.BUILDS[r.build].short : "", d ? d.version : "", r.raw, !r.ok ? r.why : r.count > 1 ? r.count + " codes, newest kept" : "");
      out.push(line);
    });
    return csvText(out, sep);
  }
  /* Canvas's gradebook import: the export's student columns and the assignment's column, a grade for each student with
     a valid code (a blank cell leaves that student's grade alone) */
  function importCsv() {
    var col = assignCol();
    if (!roster || !col) return null;
    var idc = roster.header.filter(function (h) { return ID_COLS.indexOf(h) !== -1; }), idx = idc.map(function (h) { return roster.header.indexOf(h); });
    var best = {};
    rows.forEach(function (r) { if (!mine(r)) return; var ro = rosterFor(r); if (ro) best[ro.id] = grade(r); });
    var out = [idc.concat([col])];
    roster.list.forEach(function (s) { out.push(idx.map(function (i) { return s.cells[i]; }).concat([best[s.id] == null ? "" : best[s.id]])); });
    return csvText(out, ",");
  }
  function link(a, text, name) {
    try {
      if (a._url) URL.revokeObjectURL(a._url);
      a._url = text == null ? null : URL.createObjectURL(new Blob(["﻿" + text], { type: "text/csv" }));
      a.href = a._url || "#";
      a.download = name;
    } catch (e) { a.href = "#"; }
    a.classList.toggle("disabled", text == null);
  }
  function fileStem() { return B.short.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-"; }
  function paintFiles() {
    link($("csv"), rows.length ? table(",") : null, fileStem() + "progress-" + isoTime(Date.now()).slice(0, 10) + ".csv");
    link($("std-csv"), rows.some(mine) ? stdCsv() : null, fileStem() + "standards-" + isoTime(Date.now()).slice(0, 10) + ".csv");
    var imp = importCsv(), hint = $("import-hint"), cols = assignCols();
    link($("import"), imp, fileStem() + "canvas-gradebook-import-" + isoTime(Date.now()).slice(0, 10) + ".csv");
    if (!roster) hint.textContent = "The Canvas gradebook import file needs your class list: drop your gradebook export in box 2.";
    else if (!cols.length) hint.textContent = "Your gradebook export has no assignments yet. Make the \"" + B.assignment + "\" assignment, then export the gradebook again.";
    else {
      hint.innerHTML = "Import file: fills the column <b>" + esc(assignCol() || "?") + "</b>. In Canvas: Grades → Import → choose the file → Upload, check the changes, then Save. " +
        (cols.length > 1 ? 'Wrong column? <select id="import-col">' + cols.map(function (c) { return "<option" + (c === assignCol() ? " selected" : "") + ">" + esc(c) + "</option>"; }).join("") + "</select>" : "");
      var sel = $("import-col");
      if (sel) sel.addEventListener("change", function () { roster.pick = sel.value; saveRoster(); paint(); });
    }
  }

  /* ── views ── */
  function setView(v) {
    view = v;
    try { localStorage.setItem(LS_VIEW, v); } catch (e) {}
    Array.prototype.forEach.call(document.querySelectorAll(".tab"), function (t) { t.classList.toggle("on", t.getAttribute("data-view") === v); });
    ["cards", "table", "board", "std"].forEach(function (k) { $("view-" + k).hidden = k !== v; });
    paint();
  }
  Array.prototype.forEach.call(document.querySelectorAll(".tab"), function (t) { t.addEventListener("click", function () { setView(t.getAttribute("data-view")); }); });
  function paint() {
    applyRounds();
    $("goal-line").textContent = goalLine();
    $("goal-line").hidden = $("goals-box").open;   /* the summary line only when the goals box is folded */
    paintSummary();
    if (view === "cards") paintCards();
    else if (view === "table") paintTable();
    else if (view === "board") paintBoard();
    else paintStd();
    var nl = $("notes"), list = [];
    rows.forEach(function (r) {
      if (r.count > 1) list.push(fullName(r) + ": " + r.count + " different codes; the newest one (made " + (r.ok ? fmtTime(r.data.made) : "?") + ") is used.");
      if (!r.ok) list.push(fullName(r) + ": INVALID: " + r.why + " Ask the student to copy the code again with the Copy code button. (What was read: " + r.raw + ")");
      if (roster && mine(r) && !rosterFor(r)) list.push(fullName(r) + ": not on your class list (a student who joined later? export the gradebook again).");
      if (mine(r) && r.reset) list.push(fullName(r) + ": their totals went down since last round (a new Chromebook, or restored from an older code), so this round counts their new code from its start.");
    });
    list = list.concat(notes);
    nl.innerHTML = list.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
    paintFiles();
  }

  /* ── buttons ── */
  $("read").addEventListener("click", function () {
    var t = $("paste").value;
    if (!t.trim()) { msg("Paste some codes in the box first.", true); return; }
    var n = addText(t, "paste", "");
    notes = [];
    paint();
    if (n) { $("paste").value = ""; msg("Found " + n + " code" + (n === 1 ? "" : "s") + "."); }
    else msg("No code found. A code starts with SOL3-" + ST + "- (or SOL1- / SOL2- from older versions).", true);
  });
  $("clear").addEventListener("click", function () { rows = []; notes = []; hidden = {}; paint(); msg(""); $("copybox").hidden = true; });
  $("forget").addEventListener("click", function () {
    if (!window.confirm("Forget the class list on this computer? Your goals stay.")) return;
    roster = null; saveRoster(); paintRoster(); paint(); msg("The class list is forgotten on this computer.");
  });
  $("choose").addEventListener("click", function () { $("file").click(); });
  $("file").addEventListener("change", function () { readFiles($("file").files); $("file").value = ""; });
  var drop = $("drop");
  ["dragenter", "dragover"].forEach(function (t) { drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.add("over"); }); });
  ["dragleave", "drop"].forEach(function (t) { drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.remove("over"); }); });
  drop.addEventListener("drop", function (e) { readFiles(e.dataTransfer && e.dataTransfer.files); });
  /* a file dropped anywhere else on the page is read too, instead of the browser opening it */
  window.addEventListener("dragover", function (e) { e.preventDefault(); });
  window.addEventListener("drop", function (e) { e.preventDefault(); if (e.target !== drop && !drop.contains(e.target)) readFiles(e.dataTransfer && e.dataTransfer.files); });
  [["csv", function () { return table(","); }], ["std-csv", stdCsv], ["import", importCsv]].forEach(function (x) {
    $(x[0]).addEventListener("click", function (e) {
      var text = rows.length ? x[1]() : null;
      if (!text) { e.preventDefault(); msg(x[0] === "import" ? $("import-hint").textContent : "Add some codes first.", true); return; }
      showCopy(text, "If the download didn't start (Canvas can block downloads), copy this text instead: press Ctrl+C, paste it into a spreadsheet and save it as .csv.");
    });
  });
  $("copy").addEventListener("click", function () {
    if (!rows.length) { msg("Add some codes first.", true); return; }
    var text = table("\t");
    function fallback() { showCopy(text, "The table is selected below: press Ctrl+C to copy it, then paste it into a spreadsheet."); }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { msg("Copied the table. Paste it into a spreadsheet (Ctrl+V)."); }, fallback);
        return;
      }
    } catch (e) {}
    fallback();
  });
  function showCopy(text, hint) {
    $("copybox").hidden = false;
    $("copyhint").textContent = hint;
    var ta = $("copytext");
    ta.value = text;
    ta.focus(); ta.select();
  }
  $("print").addEventListener("click", function () { window.print(); });
  $("finish-round").addEventListener("click", finishRound);
  $("undo-round").addEventListener("click", undoRound);
  $("base-choose").addEventListener("click", function () { $("base-file").click(); });
  /* an earlier Download Submissions .zip as the starting point (grading on a new computer) */
  $("base-file").addEventListener("change", function () {
    var keep = rows, keepNotes = notes;
    rows = [];
    readFiles($("base-file").files).then(function () {
      var got = rows.filter(function (r) { return r.ok && r.build === ST; }), base = {};
      got.forEach(function (r) { baseKeys(r).forEach(function (key) { base[key] = r.raw; }); });
      rows = keep; notes = keepNotes; $("base-file").value = "";
      if (!got.length) { paint(); msg("No codes found in that file, so the starting point didn't change.", true); return; }
      var newest = got.reduce(function (m, r) { return Math.max(m, r.full.made); }, 0);
      rounds = { since: newest, base: base, prev: { since: rounds.since, base: rounds.base } };
      saveRounds(); paint(); paintRounds();
      msg("Starting point set from that file (" + got.length + " students): this round counts only the work since then.");
    });
  });
  /* inside the game (js/teacher-screen.js): a Close button that goes back to the game */
  try {
    if (window.parent && window.parent !== window && window.parent.SolTeacher) {
      $("close-teacher").hidden = false;
      $("close-teacher").addEventListener("click", function () { window.parent.SolTeacher.hide(); });
      $("hide-link").hidden = false;
      $("hide-link").addEventListener("click", function () {
        if (window.confirm("Hide the Teacher link on this computer? To show it again, type the word teacher in the nickname box on the game's title screen.")) window.parent.SolTeacher.forget();
      });
    }
  } catch (e) {}
  if (!rows.length && !roster) $("how").open = true;

  $("goals-box").addEventListener("toggle", function () { $("goal-line").hidden = $("goals-box").open; });
  paintGoals();
  paintRoster();
  paintRounds();
  setView(view);
  window.TeacherPage = { addText: addText, readFiles: readFiles, rows: function () { return rows; }, table: table, grade: grade, readZip: readZip, nameFromFile: nameFromFile,
    importCsv: importCsv, stdCsv: stdCsv, roster: function () { return roster; }, setView: setView, readRoster: readRoster, fileInfo: fileInfo,
    finishRound: finishRound, undoRound: undoRound, rounds: function () { return rounds; } };
})();
