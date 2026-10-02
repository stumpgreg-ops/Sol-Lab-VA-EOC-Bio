/* SOL Lab Biology — the teacher page (Apps Script link + ?admin=1). tools/build-appsscript.js packs it into the
   bundle as __admin.js; the loader runs it after the question bank (js/content*.js) instead of the game.
   Everything is saved in the Apps Script project through google.script.run.solAdmin(pin, op, arg) (Code.gs):
   classes, each class's own question sets, the regular questions it hides or rewords, and students' progress.
   A class's settings only reach students who open the class link (?class=CODE); the core game never changes. */
(function () {
  "use strict";
  var PACKS = window.HEIST_PACKS || [], LET = ["A", "B", "C", "D"];
  /* v6.3 (Biology): a class plays one unit (or Full review); a question is tagged with a 2018 Biology SOL code */
  var FAM = window.HEIST_FAMILIES || [], STD = window.HEIST_STANDARDS || {};
  var POOL = window.HEIST_FAMILY_POOL || {};
  var GRADES = FAM.map(function (f) { return [f.id, f.label + " (" + f.kind + ")"]; });
  function stdOptions(unit) {
    var f = FAM.filter(function (x) { return x.id === unit; })[0], prefixes = (f && f.stds) || [], out = [];
    Object.keys(STD).forEach(function (code) {
      Object.keys(STD[code].keys || {}).forEach(function (k) {
        var full = code + "." + k, ok = !prefixes.length || prefixes.some(function (pr) { pr = String(pr).toUpperCase(); var F = full.toUpperCase(); return F === pr || F.indexOf(pr + ".") === 0 || pr.indexOf(F) === 0; });
        if (ok) out.push([full, full + " — " + STD[code].keys[k]]);
      });
    });
    return out;
  }
  function firstStd(unit) { var o = stdOptions(unit); return o.length ? o[0][0] : "BIO.1.a"; }
  var APP = window.SOL_APP_URL || "";
  var pin = "", classes = [], cur = null, dirty = false, tab = "sets";
  try { pin = sessionStorage.getItem("sol.admin.pin") || ""; } catch (e) {}

  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function strip(h) { return String(h || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(); }
  function call(op, arg) {
    return new Promise(function (ok, bad) {
      google.script.run.withSuccessHandler(ok).withFailureHandler(function (e) { bad(new Error((e && e.message) || String(e))); }).solAdmin(pin, op, arg == null ? "" : arg);
    });
  }
  var root = document.createElement("div"); root.id = "adm"; document.body.appendChild(root);
  document.title = "SOL Lab Biology · Teacher";
  function h(html) { root.innerHTML = html; }
  function $(sel) { return root.querySelector(sel); }
  function $$(sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
  function flash(msg, bad) {
    var n = document.createElement("div"); n.className = "adm-flash" + (bad ? " bad" : ""); n.textContent = msg; document.body.appendChild(n);
    setTimeout(function () { n.classList.add("go"); }, 2200); setTimeout(function () { if (n.parentNode) n.parentNode.removeChild(n); }, 2800);
  }
  window.addEventListener("beforeunload", function (e) { if (dirty) { e.preventDefault(); e.returnValue = ""; } });

  /* ── sign in ── */
  function signIn() {
    h('<div class="adm-card adm-narrow"><p class="adm-kick">SOL Lab Biology · Teacher page</p><h1>Checking…</h1></div>');
    call("status").then(function (st) {
      if (!st.hasPin) {
        h('<form class="adm-card adm-narrow" id="f"><p class="adm-kick">SOL Lab Biology · Teacher page</p><h1>Choose a teacher PIN</h1>' +
          '<p>Only someone with this PIN can open this page. Students never need it. Use 4 to 8 digits.</p>' +
          '<label>PIN <input id="p1" type="password" inputmode="numeric" maxlength="8" autocomplete="new-password"></label>' +
          '<label>Type it again <input id="p2" type="password" inputmode="numeric" maxlength="8" autocomplete="new-password"></label>' +
          '<button class="adm-btn pri">Save PIN</button><p class="adm-err" id="err"></p></form>');
        $("#f").onsubmit = function (e) {
          e.preventDefault();
          var a = $("#p1").value, b = $("#p2").value;
          if (!/^\d{4,8}$/.test(a)) { $("#err").textContent = "Use 4 to 8 digits."; return; }
          if (a !== b) { $("#err").textContent = "The two PINs don't match."; return; }
          call("setPin", a).then(function () { pin = a; remember(); home(); }, function (er) { $("#err").textContent = er.message; });
        };
        return;
      }
      if (pin) { call("list").then(function (l) { classes = l; home(); }, function () { pin = ""; signIn(); }); return; }
      h('<form class="adm-card adm-narrow" id="f"><p class="adm-kick">SOL Lab Biology · Teacher page</p><h1>Teacher PIN</h1>' +
        '<label>PIN <input id="p1" type="password" inputmode="numeric" maxlength="8" autocomplete="current-password"></label>' +
        '<button class="adm-btn pri">Open</button><p class="adm-err" id="err"></p></form>');
      $("#p1").focus();
      $("#f").onsubmit = function (e) {
        e.preventDefault(); pin = $("#p1").value;
        call("list").then(function (l) { classes = l; remember(); home(); }, function (er) { pin = ""; $("#err").textContent = er.message; });
      };
    }, function (er) { h('<div class="adm-card adm-narrow"><h1>Could not reach the script</h1><p>' + esc(er.message) + "</p></div>"); });
  }
  function remember() { try { sessionStorage.setItem("sol.admin.pin", pin); } catch (e) {} }

  /* ── the class list ── */
  function linkFor(code) { return APP ? APP + (APP.indexOf("?") >= 0 ? "&" : "?") + "class=" + code : "(your game link)?class=" + code; }
  function home() {
    cur = null; dirty = false;
    call("list").then(function (l) { classes = l || []; drawHome(); }, function (er) { flash(er.message, true); drawHome(); });
  }
  function drawHome() {
    var rows = classes.slice().sort(function (a, b) { return String(a.name).localeCompare(b.name); }).map(function (c) {
      return '<tr><td><b>' + esc(c.name) + '</b><div class="adm-dim">' + esc(c.code) + " · " + esc(gradeName(c.grade)) + " · " + (c.sets || 0) + " question set" + (c.sets === 1 ? "" : "s") + "</div></td>" +
        '<td class="adm-link">' + esc(linkFor(c.code)) + '</td><td class="adm-r"><button class="adm-btn" data-open="' + esc(c.code) + '">Open</button> <button class="adm-btn del" data-del="' + esc(c.code) + '">Delete</button></td></tr>';
    }).join("");
    h('<div class="adm-top"><div><p class="adm-kick">SOL Lab Biology · Teacher page</p><h1>Your classes</h1></div><div><button class="adm-btn" id="pinbtn">Change PIN</button></div></div>' +
      '<div class="adm-card"><p>Each class has its own link. Students who open it play with that class\'s question sets and edits; everyone on the regular link keeps the regular game. Nothing here changes the game for other classes.</p>' +
      (rows ? '<table class="adm-table">' + rows + "</table>" : '<p class="adm-dim">No classes yet.</p>') + "</div>" +
      '<form class="adm-card" id="nf"><h2>New class</h2><div class="adm-row"><label>Class name <input id="nn" maxlength="60" placeholder="e.g. Biology, block 3"></label>' +
      '<label>Unit <select id="ng">' + GRADES.map(function (g) { return '<option value="' + g[0] + '">' + g[1] + "</option>"; }).join("") + '</select></label>' +
      '<button class="adm-btn pri">Create</button></div></form>');
    $$("[data-open]").forEach(function (b) { b.onclick = function () { openClass(b.getAttribute("data-open")); }; });
    $$("[data-del]").forEach(function (b) {
      b.onclick = function () {
        var c = b.getAttribute("data-del");
        if (!confirm("Delete class " + c + " with its question sets, edits and student progress? This can't be undone.")) return;
        call("delete", c).then(function () { flash("Deleted " + c); home(); }, function (er) { flash(er.message, true); });
      };
    });
    $("#pinbtn").onclick = function () {
      var a = prompt("New PIN (4 to 8 digits):");
      if (a == null) return;
      call("newPin", a).then(function () { pin = a; remember(); flash("PIN changed"); }, function (er) { flash(er.message, true); });
    };
    $("#nf").onsubmit = function (e) {
      e.preventDefault();
      var name = $("#nn").value.trim(); if (!name) { $("#nn").focus(); return; }
      var base = name.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4) || "CLS", code, tries = 0;
      do { code = base + Math.floor(10 + Math.random() * 90); tries++; } while (classes.some(function (c) { return c.code === code; }) && tries < 50);
      cur = { code: code, name: name, grade: $("#ng").value, only: false, sets: [], hide: [], edits: {} };
      save().then(function () { editor(); });
    };
  }
  function gradeName(g) { var f = GRADES.filter(function (x) { return x[0] === g; })[0]; return f ? f[1] : g || ""; }

  function openClass(code) {
    call("get", code).then(function (t) {
      if (!t) { flash("That class was not found.", true); return; }
      cur = JSON.parse(t); cur.sets = cur.sets || []; cur.hide = cur.hide || []; cur.edits = cur.edits || {};
      dirty = false; tab = "sets"; editor();
    }, function (er) { flash(er.message, true); });
  }
  function save() {
    return call("save", JSON.stringify(cur)).then(function () { dirty = false; markSaved(); flash("Saved"); }, function (er) { flash("Not saved: " + er.message, true); throw er; });
  }
  function touch() { dirty = true; markSaved(); }
  function markSaved() { var n = $("#savestate"); if (n) { n.textContent = dirty ? "Unsaved changes" : "All changes saved"; n.className = dirty ? "adm-unsaved" : "adm-dim"; } }

  /* ── one class ── */
  function editor() {
    h('<div class="adm-top"><div><p class="adm-kick"><a href="#" id="back">← Your classes</a></p><h1>' + esc(cur.name) + '</h1></div>' +
      '<div class="adm-save"><span id="savestate"></span> <button class="adm-btn pri" id="save">Save</button></div></div>' +
      '<div class="adm-card"><div class="adm-row"><label>Class name <input id="cn" maxlength="60" value="' + esc(cur.name) + '"></label>' +
      '<label>Unit <select id="cg">' + GRADES.map(function (g) { return '<option value="' + g[0] + '"' + (g[0] === cur.grade ? " selected" : "") + ">" + g[1] + "</option>"; }).join("") + "</select></label></div>" +
      '<p><b>Student link:</b> <span class="adm-link" id="lnk">' + esc(linkFor(cur.code)) + '</span> <button class="adm-btn" id="cp">Copy</button></p>' +
      '<p class="adm-dim">Put this link in Google Classroom, or in Google Sites with Insert → Embed → By URL.</p>' +
      '<label class="adm-check"><input type="checkbox" id="only"' + (cur.only ? " checked" : "") + '> Play only this class\'s question sets (turn off to mix them in with the regular questions)</label></div>' +
      '<div class="adm-tabs">' + [["sets", "Question sets"], ["bank", "Regular questions"], ["prog", "Student progress"]].map(function (t) { return '<button class="adm-tab' + (tab === t[0] ? " on" : "") + '" data-tab="' + t[0] + '">' + t[1] + "</button>"; }).join("") + '</div><div id="pane"></div>');
    markSaved();
    $("#back").onclick = function (e) { e.preventDefault(); if (dirty && !confirm("Leave without saving?")) return; home(); };
    $("#save").onclick = function () { save(); };
    $("#cn").oninput = function () { cur.name = this.value; touch(); };
    $("#cg").onchange = function () { cur.grade = this.value; touch(); if (tab === "bank" || tab === "sets") pane(); };
    $("#only").onchange = function () { cur.only = this.checked; touch(); };
    $("#cp").onclick = function () { copy(linkFor(cur.code)); };
    $$("[data-tab]").forEach(function (b) { b.onclick = function () { tab = b.getAttribute("data-tab"); $$("[data-tab]").forEach(function (x) { x.classList.toggle("on", x === b); }); pane(); }; });
    pane();
  }
  function copy(t) {
    var done = function () { flash("Link copied"); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, function () { prompt("Copy this link:", t); });
    else prompt("Copy this link:", t);
  }
  function pane() { if (tab === "sets") paneSets(); else if (tab === "bank") paneBank(); else paneProg(); }

  /* question sets: lab notes and their questions, e.g. a class's own stream-survey data */
  function numbered(text) {
    var n = 0;
    return String(text || "").split(/\n\s*\n/).map(function (para) {
      para = para.replace(/\s+/g, " ").trim(); if (!para) return "";
      var s = para.match(/[^.!?]+[.!?]+["'”’)\]]*\s*|[^.!?]+$/g) || [para];
      return "<p>" + s.map(function (x) { n++; return "<b>(" + n + ")</b> " + esc(x.trim()); }).join(" ") + "</p>";
    }).join("");
  }
  function paneSets() {
    var P = $("#pane");
    P.innerHTML = '<div class="adm-card"><p>A question set is a set of lab notes and its questions, on anything you are teaching: your own lab\'s data, a case study, a reading from class. Sentences are numbered for you, so a question can say "sentence 3". Each question carries a Biology SOL code so it counts toward that standard in the game. Students in this class get these questions in the maze and the shooter levels, just like the regular ones.</p>' +
      '<button class="adm-btn pri" id="addset">+ New question set</button></div>' +
      cur.sets.map(function (s, si) {
        return '<div class="adm-card adm-set" data-si="' + si + '"><div class="adm-row"><label class="grow">Title <input data-f="title" maxlength="80" value="' + esc(s.title) + '" placeholder="e.g. Ecology · Our oyster reef data"></label>' +
          '<label>Level <select data-f="level">' + [1, 2, 3].map(function (l) { return '<option value="' + l + '"' + ((s.level || 2) === l ? " selected" : "") + ">" + ["", "1 · foundation", "2 · typical EOC item", "3 · stretch"][l] + "</option>"; }).join("") + "</select></label>" +
          '<button class="adm-btn del" data-delset>Delete set</button></div>' +
          '<label>Lab notes <span class="adm-dim">(leave a blank line between paragraphs)</span><textarea data-f="passage" rows="7" placeholder="Paste or type the lab notes, data description or reading the questions are about.">' + esc(s.passage) + "</textarea></label>" +
          '<details><summary>How students will see it (numbered)</summary><div class="adm-prev">' + numbered(s.passage) + "</div></details>" +
          '<h3>Questions (' + (s.questions || []).length + ")</h3>" +
          (s.questions || []).map(function (q, qi) {
            return '<div class="adm-q" data-qi="' + qi + '"><div class="adm-row"><label class="grow">Question ' + (qi + 1) + '<textarea data-q="stem" rows="2">' + esc(q.stem) + "</textarea></label>" +
              '<label>Standard <select data-q="sol">' + stdOptions(cur.grade).map(function (k) { return '<option value="' + k[0] + '"' + ((q.sol || firstStd(cur.grade)) === k[0] ? " selected" : "") + ">" + esc(k[1]) + "</option>"; }).join("") + '</select></label><button class="adm-btn del" data-delq>Remove</button></div>' +
              LET.map(function (L, k) { return '<label class="adm-choice"><input type="radio" name="c' + si + "-" + qi + '" value="' + L + '"' + (q.correct === L ? " checked" : "") + ' data-q="correct"> <b>' + L + '</b> <input data-q="c' + k + '" value="' + esc((q.choices || [])[k] || "") + '" placeholder="Choice ' + L + '"></label>'; }).join("") +
              '<p class="adm-dim">Tick the right answer.</p></div>';
          }).join("") +
          '<button class="adm-btn" data-addq>+ Add a question</button></div>';
      }).join("");
    $("#addset").onclick = function () { cur.sets.push({ id: "s" + Date.now().toString(36), title: "", level: 2, passage: "", questions: [{ id: "q1", stem: "", choices: ["", "", "", ""], correct: "A", sol: firstStd(cur.grade) }] }); touch(); paneSets(); };
    $$(".adm-set").forEach(function (box) {
      var s = cur.sets[+box.getAttribute("data-si")];
      box.querySelectorAll("[data-f]").forEach(function (inp) {
        inp.oninput = inp.onchange = function () {
          var f = inp.getAttribute("data-f"); s[f] = f === "level" ? +inp.value : inp.value; touch();
          if (f === "passage") box.querySelector(".adm-prev").innerHTML = numbered(s.passage);
        };
      });
      box.querySelector("[data-delset]").onclick = function () { if (confirm("Delete the set \"" + (s.title || "untitled") + "\"?")) { cur.sets.splice(cur.sets.indexOf(s), 1); touch(); paneSets(); } };
      box.querySelector("[data-addq]").onclick = function () { s.questions = s.questions || []; s.questions.push({ id: "q" + Date.now().toString(36), stem: "", choices: ["", "", "", ""], correct: "A", sol: (s.questions[s.questions.length - 1] || {}).sol || firstStd(cur.grade) }); touch(); paneSets(); };
      box.querySelectorAll(".adm-q").forEach(function (qb) {
        var q = s.questions[+qb.getAttribute("data-qi")];
        qb.querySelectorAll("[data-q]").forEach(function (inp) {
          inp.oninput = inp.onchange = function () {
            var f = inp.getAttribute("data-q");
            if (f === "correct") { if (inp.checked) q.correct = inp.value; }
            else if (/^c\d$/.test(f)) { q.choices = q.choices || ["", "", "", ""]; q.choices[+f.slice(1)] = inp.value; }
            else q[f] = inp.value;
            touch();
          };
        });
        qb.querySelector("[data-delq]").onclick = function () { s.questions.splice(s.questions.indexOf(q), 1); touch(); paneSets(); };
      });
    });
  }

  /* the regular questions of this class's unit: hide them for this class, or reword them */
  var bankQ = "", bankShow = 30;
  function bankList() {
    var pool = POOL[cur.grade] || [cur.grade], out = [], q = bankQ.toLowerCase();
    PACKS.forEach(function (p) {
      if (pool.indexOf(p.family) === -1 || p.classSet) return;
      (p.claims || []).forEach(function (c) {
        var id = p.id + ":" + c.id, hay = (p.title + " " + c.stem + " " + (c.choices || []).map(function (x) { return x.text; }).join(" ") + " " + strip(p.passage).slice(0, 400)).toLowerCase();
        if (q && hay.indexOf(q) === -1) return;
        out.push({ id: id, p: p, c: c });
      });
    });
    return out;
  }
  function paneBank() {
    var P = $("#pane"), hidden = {}, list = bankList();
    cur.hide.forEach(function (id) { hidden[id] = true; });
    P.innerHTML = '<div class="adm-card"><p>These are the regular questions for ' + esc(gradeName(cur.grade)) + '. <b>Hide</b> turns one off for this class only; <b>Edit</b> rewords it (or changes its right answer) for this class only.</p>' +
      '<div class="adm-row"><label class="grow">Search <input id="bq" value="' + esc(bankQ) + '" placeholder="a word from the lab notes, title or question"></label></div>' +
      '<p class="adm-dim">' + list.length + " questions" + (cur.hide.length ? " · " + cur.hide.length + " hidden" : "") + (Object.keys(cur.edits).length ? " · " + Object.keys(cur.edits).length + " edited" : "") + "</p></div>" +
      list.slice(0, bankShow).map(function (r) {
        var e = cur.edits[r.id], stem = e && e.stem ? e.stem : r.c.stem, ch = e && e.choices ? e.choices : (r.c.choices || []).map(function (x) { return x.text; }), key = e && e.correct ? e.correct : String(r.c.correct);
        return '<div class="adm-card adm-bq' + (hidden[r.id] ? " off" : "") + '" data-id="' + esc(r.id) + '"><div class="adm-dim">' + esc(r.p.title) + " · " + esc(r.c.sol || "") + (e ? ' · <b class="adm-ed">edited</b>' : "") + (hidden[r.id] ? ' · <b class="adm-hid">hidden</b>' : "") + "</div>" +
          '<p class="adm-stem">' + esc(stem) + "</p><ol class=\"adm-ch\">" + ch.map(function (t, k) { return "<li" + (LET[k] === key ? ' class="key"' : "") + "><b>" + LET[k] + "</b> " + esc(t) + "</li>"; }).join("") + "</ol>" +
          '<details><summary>Lab notes</summary><div class="adm-prev">' + r.p.passage + "</div></details>" +
          '<div class="adm-row"><button class="adm-btn" data-hide>' + (hidden[r.id] ? "Show again" : "Hide") + '</button> <button class="adm-btn" data-edit>Edit</button>' + (e ? ' <button class="adm-btn" data-reset>Undo edit</button>' : "") + "</div></div>";
      }).join("") +
      (list.length > bankShow ? '<button class="adm-btn" id="more">Show more</button>' : "");
    var t = null;
    $("#bq").oninput = function () { var v = this.value; clearTimeout(t); t = setTimeout(function () { bankQ = v; bankShow = 30; paneBank(); var i = $("#bq"); i.focus(); i.setSelectionRange(v.length, v.length); }, 250); };
    if ($("#more")) $("#more").onclick = function () { bankShow += 30; paneBank(); };
    $$(".adm-bq").forEach(function (box) {
      var id = box.getAttribute("data-id"), r = list.filter(function (x) { return x.id === id; })[0];
      box.querySelector("[data-hide]").onclick = function () {
        var i = cur.hide.indexOf(id); if (i >= 0) cur.hide.splice(i, 1); else cur.hide.push(id); touch(); paneBank();
      };
      if (box.querySelector("[data-reset]")) box.querySelector("[data-reset]").onclick = function () { delete cur.edits[id]; touch(); paneBank(); };
      box.querySelector("[data-edit]").onclick = function () {
        var e = cur.edits[id] || {}, ch = e.choices || (r.c.choices || []).map(function (x) { return x.text; }), key = e.correct || String(r.c.correct);
        var f = document.createElement("div"); f.className = "adm-q";
        f.innerHTML = '<label>Question <textarea rows="2" data-s>' + esc(e.stem || r.c.stem) + "</textarea></label>" +
          LET.map(function (L, k) { return '<label class="adm-choice"><input type="radio" name="e-' + esc(id) + '" value="' + L + '"' + (key === L ? " checked" : "") + "> <b>" + L + '</b> <input data-c="' + k + '" value="' + esc(ch[k] || "") + '"></label>'; }).join("") +
          '<div class="adm-row"><button class="adm-btn pri" data-ok>Use this for my class</button> <button class="adm-btn" data-cancel>Cancel</button></div>';
        box.appendChild(f); this.disabled = true;
        f.querySelector("[data-cancel]").onclick = function () { paneBank(); };
        f.querySelector("[data-ok]").onclick = function () {
          var picked = f.querySelector("input[type=radio]:checked");
          cur.edits[id] = { stem: f.querySelector("[data-s]").value.trim(), choices: LET.map(function (L, k) { return f.querySelector('[data-c="' + k + '"]').value.trim(); }).filter(function (x, k, a) { return x || k < 2; }), correct: picked ? picked.value : key };
          touch(); paneBank();
        };
      };
    });
  }

  /* students' progress in this class */
  function ago(t) { var s = Math.max(0, (Date.now() - t) / 1000); return s < 90 ? "just now" : s < 5400 ? Math.round(s / 60) + " min ago" : s < 129600 ? Math.round(s / 3600) + " h ago" : Math.round(s / 86400) + " days ago"; }
  function paneProg() {
    var P = $("#pane");
    P.innerHTML = '<div class="adm-card"><p class="adm-dim">Loading…</p></div>';
    call("report", cur.code).then(function (t) {
      var all = {}; try { all = JSON.parse(t || "{}"); } catch (e) {}
      var names = Object.keys(all).sort(function (a, b) { return (all[b].level - all[a].level) || a.localeCompare(b); });
      P.innerHTML = '<div class="adm-card"><div class="adm-row"><p class="grow">Students report here when they start a level, answer a question and finish a level. They type a first name or nickname the first time they open the class link.</p>' +
        '<button class="adm-btn" id="rf">Refresh</button> <button class="adm-btn del" id="clr">Clear</button></div>' +
        (names.length ? '<table class="adm-table"><tr><th>Student</th><th>Highest level</th><th>Now on</th><th>Right</th><th>Wrong</th><th>Level</th><th>Last seen</th></tr>' +
          names.map(function (n) { var r = all[n], tot = (r.right || 0) + (r.wrong || 0); return "<tr><td><b>" + esc(n) + "</b></td><td>" + (r.level || 0) + "</td><td>" + (r.now || 0) + (r.status === "stuck" ? ' <span class="adm-hid">lost a run</span>' : "") + "</td><td>" + (r.right || 0) + "</td><td>" + (r.wrong || 0) + (tot ? ' <span class="adm-dim">(' + Math.round(100 * (r.right || 0) / tot) + "% right)</span>" : "") + "</td><td>" + esc(r.reading || "") + "</td><td>" + ago(r.t || 0) + "</td></tr>"; }).join("") + "</table>"
          : '<p class="adm-dim">No students yet. Share the class link and they will appear here.</p>') + "</div>";
      $("#rf").onclick = paneProg;
      $("#clr").onclick = function () { if (confirm("Clear this class's progress list?")) call("clearReport", cur.code).then(paneProg); };
    }, function (er) { P.innerHTML = '<div class="adm-card"><p class="adm-err">' + esc(er.message) + "</p></div>"; });
  }

  signIn();
  window.SolAdmin = { _cur: function () { return cur; }, _save: save, _open: openClass, _home: home };
})();
