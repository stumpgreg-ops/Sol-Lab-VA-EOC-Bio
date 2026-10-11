/* SOL Lab Biology: accommodations a teacher turns on for one student (v6.5.0, from SOL Labyrinth v5.18.0).
   Not the standard setup: every option is off until a teacher opens the Accommodations panel on that student's
   Chromebook (type the word "accommodations" in the nickname box on the title screen, then the teacher PIN) and
   ticks it. Each option can carry an end date, after which it switches itself off, so an accommodation meant to
   fade can be planned. Settings live in this browser profile only (localStorage "afterHours.v1.acc.<STATE>").
     define  click a difficult word in the passage, question or answers: a short definition (SOL_ACC_DATA.def)
     dict    word-to-word dictionary, questions and answers only: click a word to see it in Spanish, Arabic,
             Farsi or Russian (SOL_ACC_DATA.tr)
     audio   read aloud: the passage sentence by sentence (highlighted), the question and each answer, with the
             Chromebook's own voice (speechSynthesis; no audio files, works offline)
     big     larger text in the side panel and the reading pop-up
     slow    the whole game runs slower (85, 75 or 60 % speed): game.js and modes.js scale each frame by speedK()
   On a vocabulary question (a .RV. standard) the word it asks about is never defined or translated. Biology has no
   vocabulary questions; instead its definition list (js/acc-bio.js) leaves out every Biology and science term, so a
   definition never gives an answer away (Virginia's science tests allow a word-to-word dictionary and read-aloud,
   not definitions of tested terms). The dictionary translates every word, science terms included.
   The word lists are per game: js/acc-bio.js (made by tools/make-acc-bio.js from tools/acc/) sets
   window.SOL_ACC_DATA; without it the two word options are not offered. */
(function () {
  "use strict";
  var STATE = window.SOL_STATE || "BIO";
  var KEY = "afterHours.v1.acc." + STATE, PIN_KEY = "afterHours.v1.accPin", PIN0 = "4826", UNLOCK = "accommodations";
  var LANGS = { es: "Español (Spanish)", ar: "العربية (Arabic)", fa: "فارسی (Farsi)", ru: "Русский (Russian)" };
  var LANG_NAME = { es: "Español", ar: "العربية", fa: "فارسی", ru: "Русский" };
  var OPTS = [
    { id: "define", name: "Tap a word for its meaning", what: "Harder everyday words in the passage, question and answers are underlined; clicking one shows a short definition. Biology terms are never defined.", words: true },
    { id: "dict", name: "Word-to-word dictionary (questions and answers)", what: "Click any word in the question or answers to see it in the student's language.", words: true },
    { id: "audio", name: "Read aloud", what: "Speaker buttons read the passage (sentence by sentence), the question and each answer aloud." },
    { id: "big", name: "Larger text", what: "Bigger text in the side panel and the reading pop-up." },
    { id: "slow", name: "Slower game", what: "The whole game runs slower: enemies, timers, rhythms and throws." }
  ];
  var STOP = { the: 1, and: 1, that: 1, this: 1, with: 1, from: 1, word: 1, words: 1, sentence: 1, sentences: 1, line: 1, lines: 1,
    paragraph: 1, passage: 1, mean: 1, means: 1, meaning: 1, used: 1, use: 1, best: 1, most: 1, which: 1, what: 1, author: 1, phrase: 1 };
  var RE = /[A-Za-z][A-Za-z'’-]*[A-Za-z]|[A-Za-z]/g;
  function norm(w) { return String(w).replace(/’/g, "'").replace(/'s$/i, "").replace(/'$/, "").toLowerCase(); }
  function data() { return window.SOL_ACC_DATA || null; }
  function today() { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }

  /* ── settings ── */
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  var S = load();
  function on(id) {
    var o = S[id];
    if (!o || !o.on) return false;
    if (o.until && today() > o.until) return false;
    if ((id === "define" || id === "dict") && !(data() && data()[id === "define" ? "def" : "tr"])) return false;
    return true;
  }
  function lang() { var l = S.dict && S.dict.lang; return LANGS[l] ? l : "es"; }
  function speedK() { return on("slow") ? clamp(Number(S.slow.pct) || 75, 50, 100) / 100 : 1; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function pin() { try { return localStorage.getItem(PIN_KEY) || PIN0; } catch (e) { return PIN0; } }

  /* the slower game: game.js and modes.js call this from update() when speedK() changes */
  function applyScene(sc, k) {
    try { if (sc.time) sc.time.timeScale = k; } catch (e) {}
    try { if (sc.tweens) sc.tweens.timeScale = k; } catch (e) {}
    try { if (sc.physics && sc.physics.world) sc.physics.world.timeScale = 1 / k; } catch (e) {}
    try { if (sc.anims) sc.anims.globalTimeScale = k; } catch (e) {}
  }

  /* ── the words: definitions and the dictionary ── */
  var PASS = ["eoc-passage", "read-passage"], QA = ["eoc-stem", "eoc-choices", "read-stem", "read-choices"];
  var blocked = {}, blockedFor = null;
  /* a vocabulary question: the word it asks about (in the stem, or a one- or two-word answer, that is also in the passage) */
  function computeBlocked() {
    var sc = window.SolScene, c = sc && sc.claim;
    if (c === blockedFor) return;
    blockedFor = c; blocked = {};
    if (!c || !/\.RV\./.test(String(c.sol || ""))) return;
    var tmp = document.createElement("div"); tmp.innerHTML = c.passage || "";
    var inPass = {};
    (tmp.textContent.match(RE) || []).forEach(function (w) { inPass[norm(w)] = 1; });
    var cand = (String(c.stem || "").match(RE) || []).slice();
    (c.choices || []).forEach(function (ch) {
      var t = String(ch.text || "").replace(/<[^>]+>/g, ""), ws = t.match(RE) || [];
      if (ws.length <= 2) cand = cand.concat(ws);
    });
    cand.forEach(function (w) { var n = norm(w); if (n.length >= 3 && !STOP[n] && inPass[n]) blocked[n] = 1; });
  }
  function wrapWords(root, pick) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        for (var p = n.parentNode; p && p !== root; p = p.parentNode) {
          if (p.nodeType === 1 && (p.classList.contains("n") || p.classList.contains("let") || p.classList.contains("acc-w") || p.tagName === "BUTTON")) return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var list = [], n;
    while ((n = walker.nextNode())) list.push(n);
    list.forEach(function (tn) {
      var t = tn.nodeValue, last = 0, m, frag = null;
      RE.lastIndex = 0;
      while ((m = RE.exec(t))) {
        var w = norm(m[0]), cls = pick(w);
        if (!cls) continue;
        frag = frag || document.createDocumentFragment();
        if (m.index > last) frag.appendChild(document.createTextNode(t.slice(last, m.index)));
        var sp = document.createElement("span");
        sp.className = "acc-w " + cls; sp.setAttribute("data-w", w); sp.setAttribute("role", "button"); sp.tabIndex = 0;
        sp.textContent = m[0];
        frag.appendChild(sp);
        last = m.index + m[0].length;
      }
      if (!frag) return;
      if (last < t.length) frag.appendChild(document.createTextNode(t.slice(last)));
      tn.parentNode.replaceChild(frag, tn);
    });
  }
  /* the passage, sentence by sentence (each sentence starts at its number), for reading aloud */
  function wrapSentences(root) {
    Array.prototype.forEach.call(root.querySelectorAll("p"), function (p) {
      var kids = Array.prototype.slice.call(p.childNodes), cur = null;
      kids.forEach(function (k) {
        if (k.nodeType === 1 && k.classList.contains("n")) { cur = document.createElement("span"); cur.className = "acc-s"; p.insertBefore(cur, k.nextSibling); return; }
        if (cur) cur.appendChild(k);
      });
      if (!p.querySelector(".acc-s") && p.textContent.trim()) { var s = document.createElement("span"); s.className = "acc-s"; while (p.firstChild) s.appendChild(p.firstChild); p.appendChild(s); }
    });
  }
  var observers = [];
  function decorate(id) {
    var el = document.getElementById(id);
    if (!el) return;
    computeBlocked();
    var D = data() || {}, def = on("define") ? D.def || {} : null, tr = on("dict") ? D.tr || {} : null, qa = QA.indexOf(id) !== -1;
    if (PASS.indexOf(id) !== -1) {
      if (on("audio") && !el.querySelector(".acc-s")) wrapSentences(el);
      if (def) wrapWords(el, function (w) { return !blocked[w] && def[w] ? "acc-def" : null; });
      addPassageTools(el);
    } else {
      if (def || tr) wrapWords(el, function (w) {
        if (blocked[w]) return null;
        if (def && def[w]) return "acc-def";
        return tr && tr[w] ? "acc-tr" : null;
      });
      if (on("audio")) addSayButtons(el);
    }
    if (qa && tr) el.classList.add("acc-dict"); else el.classList.remove("acc-dict");
  }
  function watch() {
    observers.forEach(function (o) { o.ob.disconnect(); });
    observers = [];
    PASS.concat(QA).forEach(function (id) {
      var el = document.getElementById(id);
      if (!el || !window.MutationObserver) return;
      var busy = false, ob = new MutationObserver(function () {
        if (busy) return;
        busy = true;
        setTimeout(function () {
          ob.disconnect();
          try { if (PASS.indexOf(id) !== -1) stopSpeaking(); decorate(id); } catch (e) {}
          ob.observe(el, { childList: true, subtree: true, characterData: true });
          busy = false;
        }, 0);
      });
      ob.observe(el, { childList: true, subtree: true, characterData: true });
      observers.push({ ob: ob, el: el });
      decorate(id);
    });
  }

  /* the pop-up for a clicked word */
  var pop = null;
  function showWord(sp) {
    var w = sp.getAttribute("data-w"), D = data() || {}, qa = !!(sp.closest && sp.closest("#" + QA.join(",#")));
    if (!pop) {
      pop = document.createElement("div"); pop.id = "acc-pop"; pop.setAttribute("role", "dialog");
      document.body.appendChild(pop);
    }
    var h = '<div class="acc-pop-w">' + esc(sp.textContent) + (on("audio") && speechOk() ? ' <button type="button" class="acc-say acc-say-w" aria-label="Say the word">🔊</button>' : "") + "</div>";
    if (on("define") && D.def && D.def[w]) h += '<div class="acc-pop-def">' + esc(D.def[w]) + "</div>";
    var l = lang(), t = on("dict") && qa && D.tr && D.tr[w] && D.tr[w][l];
    if (t && t !== "—") h += '<div class="acc-pop-tr" lang="' + l + '" dir="' + (l === "ar" || l === "fa" ? "rtl" : "ltr") + '"><span class="acc-pop-l">' + LANG_NAME[l] + ":</span> " + esc(t) + "</div>";
    pop.innerHTML = h;
    var b = pop.querySelector(".acc-say-w");
    if (b) b.addEventListener("click", function (e) { e.stopPropagation(); speak([sp.textContent]); });
    pop.style.display = "block";
    var r = sp.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight;
    var x = clamp(r.left + r.width / 2 - pw / 2, 6, window.innerWidth - pw - 6), y = r.bottom + 6;
    if (y + ph > window.innerHeight - 6) y = Math.max(6, r.top - ph - 6);
    pop.style.left = x + "px"; pop.style.top = y + "px";
  }
  function hidePop() { if (pop) pop.style.display = "none"; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  document.addEventListener("click", function (e) {
    var sp = e.target && e.target.closest ? e.target.closest(".acc-w") : null;
    if (sp) { e.stopPropagation(); showWord(sp); return; }
    if (pop && !(e.target.closest && e.target.closest("#acc-pop"))) hidePop();
  }, true);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") hidePop();
    if ((e.key === "Enter") && e.target && e.target.classList && e.target.classList.contains("acc-w")) { e.preventDefault(); showWord(e.target); }
  }, true);

  /* ── read aloud ── */
  function speechOk() { return typeof window.speechSynthesis !== "undefined" && typeof window.SpeechSynthesisUtterance !== "undefined"; }
  var voice = null, speakingEl = null, queueId = 0;
  function pickVoice() {
    if (voice || !speechOk()) return voice;
    var vs = window.speechSynthesis.getVoices() || [];
    voice = vs.filter(function (v) { return /^en[-_]US/i.test(v.lang); })[0] || vs.filter(function (v) { return /^en/i.test(v.lang); })[0] || null;
    return voice;
  }
  function stopSpeaking() {
    queueId++;
    try { if (speechOk()) window.speechSynthesis.cancel(); } catch (e) {}
    Array.prototype.forEach.call(document.querySelectorAll(".acc-reading"), function (x) { x.classList.remove("acc-reading"); });
    Array.prototype.forEach.call(document.querySelectorAll(".acc-say.on"), function (x) { x.classList.remove("on"); });
    speakingEl = null;
  }
  /* parts: strings, or elements (read and highlighted one at a time) */
  function speak(parts, btn) {
    if (!speechOk()) return;
    stopSpeaking();
    var id = queueId, i = 0, rate = S.audio && S.audio.rate === "slow" ? 0.78 : 0.95;
    if (btn) btn.classList.add("on");
    (function next() {
      if (id !== queueId) return;
      if (i >= parts.length) { if (btn) btn.classList.remove("on"); return; }
      var p = parts[i++], el = typeof p === "string" ? null : p, text = el ? textOf(el) : p;
      if (!text.trim()) { next(); return; }
      Array.prototype.forEach.call(document.querySelectorAll(".acc-reading"), function (x) { x.classList.remove("acc-reading"); });
      if (el) { el.classList.add("acc-reading"); try { el.scrollIntoView({ block: "nearest", behavior: "smooth" }); } catch (e) {} }
      var u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US"; u.rate = rate; if (pickVoice()) u.voice = voice;
      u.onend = u.onerror = function () { if (el) el.classList.remove("acc-reading"); next(); };
      window.speechSynthesis.speak(u);
    })();
  }
  function textOf(el) {
    var c = el.cloneNode(true);
    Array.prototype.forEach.call(c.querySelectorAll("button,.n,.let"), function (x) { x.parentNode.removeChild(x); });
    return c.textContent.replace(/\s+/g, " ").trim();
  }
  function addPassageTools(el) {
    var host = el.parentNode, bar = host && host.querySelector(":scope > .acc-bar");
    if (!on("audio") || !speechOk()) { if (bar) bar.parentNode.removeChild(bar); return; }
    if (bar) return;
    bar = document.createElement("div"); bar.className = "acc-bar";
    bar.innerHTML = '<button type="button" class="acc-say acc-say-pass">🔊 Read the passage</button>';
    host.insertBefore(bar, el);
    bar.firstChild.addEventListener("click", function (e) {
      e.stopPropagation();
      if (this.classList.contains("on")) { stopSpeaking(); return; }
      if (!el.querySelector(".acc-s")) wrapSentences(el);
      speak(Array.prototype.slice.call(el.querySelectorAll(".acc-s")), this);
    });
  }
  function addSayButtons(el) {
    if (!speechOk()) return;
    if (el.tagName === "OL") {
      Array.prototype.forEach.call(el.children, function (li) {
        if (li.querySelector(".acc-say")) return;
        var b = document.createElement("button"); b.type = "button"; b.className = "acc-say acc-say-ch"; b.textContent = "🔊";
        var L = li.querySelector(".let"); b.setAttribute("aria-label", "Read answer " + (L ? L.textContent : ""));
        b.addEventListener("click", function (e) { e.stopPropagation(); speak([(L ? L.textContent + ". " : "") + textOf(li)], b); });
        li.appendChild(b);
      });
    } else if (!el.querySelector(".acc-say") && el.textContent.trim()) {
      var b = document.createElement("button"); b.type = "button"; b.className = "acc-say acc-say-q"; b.textContent = "🔊";
      b.setAttribute("aria-label", "Read the question");
      b.addEventListener("click", function (e) { e.stopPropagation(); speak([textOf(el)], b); });
      el.insertBefore(b, el.firstChild);
    }
  }

  /* ── apply everything (body classes, the words, the note on the title screen) ── */
  function apply() {
    var b = document.body;
    if (!b) return;
    b.classList.toggle("acc-big", on("big"));
    b.classList.toggle("acc-audio", on("audio") && speechOk());
    if (!on("audio")) stopSpeaking();
    hidePop();
    /* re-render the words: the game rewrites these boxes on the next question; clear our marks now */
    PASS.concat(QA).forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      Array.prototype.forEach.call(el.querySelectorAll(".acc-w"), function (sp) { sp.parentNode.replaceChild(document.createTextNode(sp.textContent), sp); });
      Array.prototype.forEach.call(el.querySelectorAll(".acc-say"), function (x) { x.parentNode.removeChild(x); });
      el.normalize();
    });
    Array.prototype.forEach.call(document.querySelectorAll(".acc-bar"), function (x) { x.parentNode.removeChild(x); });
    blockedFor = null;
    watch();
    note();
  }
  function activeNames() {
    var out = [];
    if (on("define")) out.push("word meanings");
    if (on("dict")) out.push("dictionary (" + LANG_NAME[lang()] + ")");
    if (on("audio")) out.push("read aloud");
    if (on("big")) out.push("larger text");
    if (on("slow")) out.push("slower game (" + Math.round(speedK() * 100) + "%)");
    return out;
  }
  function note() {
    var title = document.getElementById("title-screen");
    if (!title) return;
    var n = document.getElementById("acc-note"), names = activeNames();
    if (!names.length) { if (n) n.parentNode.removeChild(n); return; }
    if (!n) { n = document.createElement("p"); n.id = "acc-note"; title.appendChild(n); }
    n.textContent = "Accommodations on: " + names.join(" · ");
  }

  /* ── the teacher's panel ── */
  var ov = null;
  function panel() {
    if (!ov) {
      ov = document.createElement("div"); ov.id = "acc-overlay"; ov.className = "hidden";
      ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-label", "Accommodations");
      ["keydown", "keyup", "pointerdown", "pointerup", "click"].forEach(function (t) { ov.addEventListener(t, function (e) { e.stopPropagation(); }); });
      document.body.appendChild(ov);
    }
    ov.classList.remove("hidden");
    ov.innerHTML = '<div class="tut-card acc-card"><p class="tut-kicker">For teachers</p><h2>Accommodations</h2>' +
      '<p class="acc-small">Turn on supports for the student who uses this Chromebook. Enter the teacher PIN (it is in the READ ME).</p>' +
      '<div class="row"><input id="acc-pin" type="password" inputmode="numeric" autocomplete="off" maxlength="12" placeholder="Teacher PIN" aria-label="Teacher PIN">' +
      '<button type="button" class="btn primary" id="acc-pin-go">Open</button><button type="button" class="btn" id="acc-cancel">Cancel</button></div>' +
      '<p class="acc-msg" id="acc-msg"></p></div>';
    var inp = document.getElementById("acc-pin");
    var go = function () {
      if (String(inp.value).trim() === pin()) form();
      else { document.getElementById("acc-msg").textContent = "That PIN is not right."; inp.value = ""; inp.focus(); }
    };
    document.getElementById("acc-pin-go").addEventListener("click", go);
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
    document.getElementById("acc-cancel").addEventListener("click", close);
    setTimeout(function () { try { inp.focus(); } catch (e) {} }, 30);
  }
  function close() { if (ov) { ov.classList.add("hidden"); ov.innerHTML = ""; } }
  function form() {
    var hasWords = !!(data() && data().def), h = '<div class="tut-card acc-card"><p class="tut-kicker">For teachers · this Chromebook only</p><h2>Accommodations</h2>' +
      '<p class="acc-small">These stay on for this Chromebook (this browser profile) until you turn them off or their end date passes. Leave the date empty to keep one on.</p>';
    OPTS.forEach(function (o) {
      var s = S[o.id] || {}, dis = o.words && !hasWords;
      h += '<div class="acc-opt' + (dis ? " dis" : "") + '"><label><input type="checkbox" id="acc-' + o.id + '"' + (s.on ? " checked" : "") + (dis ? " disabled" : "") + "> <b>" + o.name + "</b></label>" +
        '<div class="acc-small">' + (dis ? "Not available in this game yet." : o.what) + "</div><div class=\"acc-row\">";
      if (o.id === "dict") {
        h += '<label>Language <select id="acc-lang">';
        Object.keys(LANGS).forEach(function (k) { h += '<option value="' + k + '"' + (lang() === k ? " selected" : "") + ">" + LANGS[k] + "</option>"; });
        h += "</select></label>";
      }
      if (o.id === "audio") h += '<label>Voice <select id="acc-rate"><option value="normal">normal speed</option><option value="slow"' + (s.rate === "slow" ? " selected" : "") + ">slower</option></select></label>";
      if (o.id === "slow") {
        h += '<label>Speed <select id="acc-pct">';
        [85, 75, 60].forEach(function (p) { h += '<option value="' + p + '"' + ((Number(s.pct) || 75) === p ? " selected" : "") + ">" + p + " %</option>"; });
        h += "</select></label>";
      }
      h += '<label>Ends after <input type="date" id="acc-until-' + o.id + '" value="' + (s.until || "") + '"></label></div></div>';
    });
    h += '<div class="row"><button type="button" class="btn primary" id="acc-save">Save</button><button type="button" class="btn" id="acc-off">Turn all off</button><button type="button" class="btn" id="acc-close">Close</button></div>' +
      '<details class="acc-small"><summary>Change the PIN on this Chromebook</summary><div class="row"><input id="acc-newpin" type="password" inputmode="numeric" maxlength="12" placeholder="New PIN (4+ digits)" aria-label="New PIN"><button type="button" class="btn" id="acc-setpin">Set PIN</button></div></details>' +
      '<p class="acc-msg" id="acc-msg"></p></div>';
    ov.innerHTML = h;
    var msg = function (t) { document.getElementById("acc-msg").textContent = t; };
    document.getElementById("acc-save").addEventListener("click", function () {
      var n = {};
      OPTS.forEach(function (o) {
        var c = document.getElementById("acc-" + o.id), u = document.getElementById("acc-until-" + o.id);
        n[o.id] = { on: !!(c && c.checked && !c.disabled), until: u && u.value ? u.value : "" };
      });
      n.dict.lang = (document.getElementById("acc-lang") || {}).value || "es";
      n.audio.rate = (document.getElementById("acc-rate") || {}).value || "normal";
      n.slow.pct = Number((document.getElementById("acc-pct") || {}).value) || 75;
      S = n; save(S); apply();
      var names = activeNames();
      msg(names.length ? "Saved. On now: " + names.join(", ") + "." : "Saved. No accommodations are on.");
    });
    document.getElementById("acc-off").addEventListener("click", function () {
      S = {}; save(S); apply(); form(); msg("All accommodations are off on this Chromebook.");
    });
    document.getElementById("acc-close").addEventListener("click", close);
    document.getElementById("acc-setpin").addEventListener("click", function () {
      var v = String(document.getElementById("acc-newpin").value).trim();
      if (!/^\d{4,12}$/.test(v)) { msg("A PIN is 4 to 12 digits."); return; }
      try { localStorage.setItem(PIN_KEY, v); } catch (e) {}
      document.getElementById("acc-newpin").value = "";
      msg("The PIN on this Chromebook is changed. Write it down: the READ ME still lists the original.");
    });
  }
  /* the teacher's way in: type the word "accommodations" in the nickname box on the title screen */
  function hook() {
    var nick = document.getElementById("join-nick");
    if (nick) nick.addEventListener("input", function () {
      if (String(nick.value || "").trim().toLowerCase() !== UNLOCK) return;
      nick.value = "";
      try { nick.dispatchEvent(new Event("input")); } catch (e) {}
      panel();
    });
    apply();
    if (speechOk()) { try { window.speechSynthesis.onvoiceschanged = function () { voice = null; pickVoice(); }; } catch (e) {} }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", hook); else hook();

  window.SolAcc = { on: on, speedK: speedK, applyScene: applyScene, lang: lang, open: panel, close: close, apply: apply,
    settings: function () { return JSON.parse(JSON.stringify(S)); },
    set: function (n) { S = n || {}; save(S); apply(); },   /* for the tests */
    blocked: function () { computeBlocked(); return Object.keys(blocked); }, speak: speak, stop: stopSpeaking, PIN0: PIN0 };
})();
