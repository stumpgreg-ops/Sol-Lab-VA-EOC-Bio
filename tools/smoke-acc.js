/* Headless test of the accommodations (js/accommodations.js, js/acc-bio.js): node tools/smoke-acc.js
   Off for everyone by default; the teacher's way in (the word "accommodations" in the nickname box, then the PIN);
   each option on a level in the 500 px Canvas frame (word meanings, the dictionary, read aloud, larger text, the
   slower game); end dates; Turn all off; and the word lists themselves (no Biology term is ever defined).
   Saves screenshots to tools/shots/acc-*.png. */
var path = require("path"), fs = require("fs"), http = require("http"), url = require("url");
var { chromium } = require("/opt/node22/lib/node_modules/playwright");
var root = path.join(__dirname, ".."), shots = path.join(__dirname, "shots");
fs.mkdirSync(shots, { recursive: true });
var MIME = { html: "text/html", js: "application/javascript", css: "text/css", json: "application/json", png: "image/png", mp3: "audio/mpeg" };
var srv = http.createServer(function (req, res) {
  var f = path.join(root, decodeURIComponent(url.parse(req.url).pathname));
  if (f.endsWith("/")) f += "index.html";
  fs.readFile(f, function (err, buf) {
    if (err) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { "Content-Type": MIME[f.split(".").pop()] || "application/octet-stream" }); res.end(buf);
  });
});
/* Biology and science words that must never get a definition (a definition would give an answer away) */
var NEVER = ["photosynthesis", "respiration", "enzyme", "enzymes", "catalase", "allele", "alleles", "osmosis", "diffusion",
  "mitochondria", "chloroplast", "chloroplasts", "ribosome", "ribosomes", "nucleus", "membrane", "producer", "producers",
  "consumer", "consumers", "decomposer", "decomposers", "hypothesis", "variable", "variables", "dependent", "independent",
  "control", "mutation", "mutations", "invasive", "succession", "homeostasis", "prokaryote", "prokaryotic", "eukaryotic",
  "trophic", "meiosis", "mitosis", "dna", "rna", "gene", "genes", "genotype", "phenotype", "dominant", "recessive",
  "virus", "viruses", "bacteria", "antibiotic", "antibiotics", "vaccine", "evolution", "adaptation", "speciation",
  "carrying", "capacity", "biodiversity", "ecosystem", "population", "community", "niche", "transcription", "translation",
  "protein", "proteins", "carbohydrate", "lipid", "lipids", "glucose", "atp", "cladogram", "fossil", "fossils",
  "eutrophication", "pioneer", "symbiosis", "mutualism", "parasitism", "commensalism", "predation", "organelle", "organelles"];
(async function () {
  await new Promise(function (r) { srv.listen(0, r); });
  var base = "http://127.0.0.1:" + srv.address().port + "/";
  var glArgs = { args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] };
  var browser = await chromium.launch(Object.assign({ executablePath: "/opt/pw-browsers/chromium/chrome-linux/chrome" }, glArgs)).catch(function () { return chromium.launch(glArgs); });
  var page = await browser.newPage({ viewport: { width: 900, height: 500 } });   /* the Canvas embed: 100% wide, 500 tall */
  var errors = [], fails = [];
  page.on("pageerror", function (e) { errors.push("pageerror: " + e.message); });
  page.on("console", function (m) { if (m.type() === "error") { var t = m.text(); if (!/favicon|net::ERR|Autoplay|AudioContext|unpkg|peerjs|phaser|WebGL|GL Driver|swiftshader/i.test(t)) errors.push("error: " + t); } });
  function check(cond, msg) { if (!cond) fails.push(msg); console.log((cond ? "ok   " : "FAIL ") + msg); }
  function shot(n) { return page.screenshot({ path: path.join(shots, "acc-" + n + ".png") }); }
  await page.goto(base + "index.html", { waitUntil: "load" });
  await page.evaluate(function () { localStorage.clear(); });
  await page.reload({ waitUntil: "load" }); await page.waitForTimeout(600);

  /* the word lists */
  var lists = await page.evaluate(function (never) {
    var D = window.SOL_ACC_DATA || {}, def = D.def || {}, tr = D.tr || {}, bad = [], miss = [], langs = [];
    never.forEach(function (w) { if (def[w]) bad.push(w); });
    var RE = /[A-Za-z][A-Za-z'’-]*[A-Za-z]|[A-Za-z]/g;
    function norm(w) { return String(w).replace(/’/g, "'").replace(/'s$/i, "").replace(/'$/, "").toLowerCase(); }
    HEIST_PACKS.forEach(function (p) { (p.claims || []).forEach(function (c) {
      [c.stem].concat(c.choices.map(function (x) { return x.text; })).forEach(function (t) {
        (String(t).replace(/<[^>]+>/g, " ").match(RE) || []).forEach(function (w) { if (!tr[norm(w)]) miss.push(norm(w)); });
      });
    }); });
    Object.keys(tr).forEach(function (w) { ["es", "ar", "fa", "ru"].forEach(function (l) { if (!tr[w][l]) langs.push(w + ":" + l); }); });
    return { nd: Object.keys(def).length, nt: Object.keys(tr).length, bad: bad, miss: miss.slice(0, 10), nmiss: miss.length, langs: langs.slice(0, 10) };
  }, NEVER);
  check(lists.nd > 200 && lists.nt > 2500, "the Biology word lists load: " + lists.nd + " definitions, " + lists.nt + " dictionary words");
  check(!lists.bad.length, "no Biology or science term is defined (a definition would give an answer away): " + (lists.bad.join(", ") || "none"));
  check(!lists.nmiss && !lists.langs.length, "every word in every question and answer has Spanish, Arabic, Farsi and Russian: " + JSON.stringify({ missing: lists.miss, langs: lists.langs }));

  /* off for everyone until a teacher turns it on */
  var off = await page.evaluate(function () { return { k: SolAcc.speedK(), note: !!document.getElementById("acc-note"), big: document.body.classList.contains("acc-big"), any: ["define", "dict", "audio", "big", "slow"].some(SolAcc.on) }; });
  check(off.k === 1 && !off.note && !off.big && !off.any, "accommodations are off by default (full speed, no note on the title screen): " + JSON.stringify(off));

  /* the teacher's way in */
  await page.fill("#join-nick", "accommodations");
  await page.waitForSelector("#acc-overlay:not(.hidden) #acc-pin");
  check((await page.inputValue("#join-nick")) === "", "typing \"accommodations\" in the nickname box opens the panel and clears the box");
  await page.fill("#acc-pin", "1111"); await page.click("#acc-pin-go");
  check(/not right/.test(await page.textContent("#acc-msg")) && !(await page.$("#acc-save")), "a wrong PIN does not open the settings");
  await page.fill("#acc-pin", "4826"); await page.click("#acc-pin-go");
  await page.waitForSelector("#acc-save");
  var form = await page.evaluate(function () {
    var ids = ["define", "dict", "audio", "big", "slow"], card = document.querySelector("#acc-overlay .acc-card"), r = card.getBoundingClientRect();
    return { enabled: ids.filter(function (i) { var c = document.getElementById("acc-" + i); return c && !c.disabled; }).length, fits: r.top >= 0 && r.bottom <= innerHeight + 1, scrolls: card.scrollHeight > card.clientHeight ? getComputedStyle(card).overflowY : "fits" };
  });
  check(form.enabled === 5 && form.fits && form.scrolls !== "visible", "the teacher PIN opens all five options, and the panel fits the 500 px frame: " + JSON.stringify(form));
  await shot("1-panel");
  for (var id of ["define", "dict", "audio", "big", "slow"]) await page.check("#acc-" + id);
  await page.selectOption("#acc-lang", "fa"); await page.selectOption("#acc-pct", "75"); await page.selectOption("#acc-rate", "slow");
  await page.click("#acc-save");
  var saved = await page.evaluate(function () { return { msg: document.getElementById("acc-msg").textContent, s: SolAcc.settings(), k: SolAcc.speedK(), lang: SolAcc.lang() }; });
  check(/Saved\. On now/.test(saved.msg) && saved.k === 0.75 && saved.lang === "fa" && saved.s.audio.rate === "slow", "Save turns them on (Farsi, 75 % speed, the slower voice): " + saved.msg);
  await page.click("#acc-close");
  var note = await page.textContent("#acc-note").catch(function () { return ""; });
  check(/Accommodations on: word meanings · dictionary \(فارسی\) · read aloud · larger text · slower game \(75%\)/.test(note), "the title screen says what is on: " + note);
  var kept = await page.evaluate(function () { return JSON.parse(localStorage.getItem("afterHours.v1.acc.BIO") || "{}").slow; });
  check(kept && kept.on && kept.pct === 75, "the settings are saved for this browser profile (afterHours.v1.acc.BIO)");

  /* a level */
  await page.click('#title-screen .card[data-family="ECO"]');
  await page.waitForSelector("#mode-screen:not(.hidden)");
  await page.click('#mode-packs .card[data-gamemode="maze"]');
  await page.waitForSelector("#skill-screen:not(.hidden)");
  await page.click("#btn-skill-start");
  await page.waitForSelector("#btn-char-confirm:visible", { timeout: 4000 }).catch(function () {});
  if (await page.isVisible("#btn-char-confirm").catch(function () { return false; })) await page.click("#btn-char-confirm");
  await page.waitForFunction(function () { return window.SolScene && SolScene.claim; }, null, { timeout: 20000 });
  await page.waitForSelector("#eoc-passage .acc-s", { timeout: 10000 }).catch(function () {});
  await page.waitForTimeout(400);
  var lvl = await page.evaluate(function () {
    /* the side panel always holds the passage, question and answers (the reading pop-up gets the same marks when it opens) */
    var rp = document.getElementById("eoc-passage"), rs = document.getElementById("eoc-stem"), rc = document.getElementById("eoc-choices");
    return { sentences: rp.querySelectorAll(".acc-s").length, readBtn: !!(rp.parentNode.querySelector(".acc-say-pass")),
      defs: document.querySelectorAll("#read-passage .acc-def, #eoc-passage .acc-def").length,
      trs: rs.querySelectorAll(".acc-tr").length + rc.querySelectorAll(".acc-tr").length,
      say: rc.querySelectorAll(".acc-say-ch").length, sayQ: !!rs.querySelector(".acc-say-q"),
      big: parseFloat(getComputedStyle(rp).fontSize),
      speech: typeof speechSynthesis !== "undefined" };
  });
  check(lvl.sentences > 1 && lvl.readBtn && lvl.say === 4 && lvl.sayQ, "read aloud: the passage is cut into sentences with a Read button, and the question and each answer get a speaker: " + JSON.stringify(lvl));
  check(lvl.trs > 5, "the dictionary marks the words of the question and the answers: " + lvl.trs);
  check(lvl.big >= 16.5, "larger text in the side panel's passage: " + lvl.big + "px");
  await shot("2-read");
  /* a word in an answer: Farsi, right to left, and never a definition of a science term */
  var clicked = await page.evaluate(function () {
    /* a word with a Farsi translation ("the" has none: Farsi has no articles, so its pop-up shows no line for it) */
    var w = Array.prototype.filter.call(document.querySelectorAll("#eoc-choices .acc-tr, #eoc-stem .acc-tr"), function (x) {
      var t = SOL_ACC_DATA.tr[x.getAttribute("data-w")]; return t && t.fa && t.fa !== "—";
    })[0];
    w.click();
    var pop = document.getElementById("acc-pop"), tr = pop.querySelector(".acc-pop-tr");
    return { word: w.textContent, shown: getComputedStyle(pop).display, lang: tr && tr.getAttribute("lang"), dir: tr && tr.getAttribute("dir"), text: tr && tr.textContent };
  });
  check(clicked.shown === "block" && clicked.lang === "fa" && clicked.dir === "rtl" && /فارسی/.test(clicked.text), "a click on an answer word shows it in Farsi, right to left: " + JSON.stringify(clicked));
  await shot("3-word");
  await page.keyboard.press("Escape");
  var defd = await page.evaluate(function () {
    var w = document.querySelector("#eoc-passage .acc-def, #eoc-stem .acc-def, #eoc-choices .acc-def");
    if (!w) return { none: true };
    w.click();
    var pop = document.getElementById("acc-pop"), d = pop.querySelector(".acc-pop-def");
    return { word: w.textContent, def: d && d.textContent };
  });
  check(defd.none || (defd.def && defd.def.length > 5), "a click on an underlined word shows its meaning: " + JSON.stringify(defd));
  await page.keyboard.press("Escape");
  /* read aloud really speaks (a stub records what would be said, headless Chromium has no voices) */
  var said = await page.evaluate(function () {
    window.__said = [];
    var real = speechSynthesis.speak.bind(speechSynthesis);
    speechSynthesis.speak = function (u) { window.__said.push({ t: u.text, r: u.rate }); setTimeout(function () { u.onend && u.onend(); }, 5); };
    document.querySelector("#eoc-choices .acc-say-ch").click();
    return new Promise(function (r) { setTimeout(function () { r(window.__said); }, 60); });
  });
  check(said.length === 1 && /^A\. /.test(said[0].t) && said[0].r < 0.9, "an answer's speaker reads \"A. ...\" in the slower voice: " + JSON.stringify(said[0]));
  var pass = await page.evaluate(function () {
    window.__said = [];
    document.getElementById("eoc-passage").parentNode.querySelector(".acc-say-pass").click();
    return new Promise(function (r) { setTimeout(function () { r({ n: window.__said.length, total: document.querySelectorAll("#eoc-passage .acc-s").length }); }, 400); });
  });
  check(pass.n === pass.total && pass.n > 1, "Read the passage reads it sentence by sentence: " + JSON.stringify(pass));
  /* the slower game */
  for (var k = 0; k < 4; k++) {
    if (await page.isVisible("#read-go").catch(function () { return false; })) { await shot("2b-read"); await page.click("#read-go"); }
    else if (await page.isVisible("#tut-skip").catch(function () { return false; })) await page.click("#tut-skip");
    await page.waitForTimeout(400);
  }
  var slow = await page.evaluate(function () { var s = SolScene; return { t: s.time.timeScale, tw: s.tweens.timeScale, ph: s.physics.world.timeScale, k: s._accK }; });
  check(slow.k === 0.75 && slow.t === 0.75 && Math.abs(slow.ph - 1 / 0.75) < 1e-6, "the slower game runs the level at 75 %: " + JSON.stringify(slow));
  var side = await page.evaluate(function () { return parseFloat(getComputedStyle(document.getElementById("eoc-stem")).fontSize); });
  check(side >= 16.5, "larger text in the side panel: " + side + "px");
  await shot("4-play");

  /* the slower game survives anything that puts the clock back to full speed (a slow-motion effect ending, a tab
     coming back, the next level) */
  await page.evaluate(function () { var s = SolScene; s.time.timeScale = 1; s.physics.world.timeScale = 1; });
  await page.waitForTimeout(300);
  var again = await page.evaluate(function () { var s = SolScene; return { t: s.time.timeScale, ph: s.physics.world.timeScale }; });
  check(again.t === 0.75 && Math.abs(again.ph - 1 / 0.75) < 1e-6, "the slower game comes back after the clock is reset to full speed: " + JSON.stringify(again));
  /* an end date that has passed switches an option off; Turn all off clears everything */
  await page.evaluate(function () { var s = SolAcc.settings(); s.slow.until = "2020-01-01"; SolAcc.set(s); });
  check(await page.evaluate(function () { return !SolAcc.on("slow") && SolAcc.speedK() === 1 && SolAcc.on("audio"); }), "an option whose end date has passed is off (the others stay on)");
  await page.waitForTimeout(300);
  check(await page.evaluate(function () { return SolScene.time.timeScale === 1; }), "the level goes back to full speed");
  await page.evaluate(function () { SolAcc.open(); });
  await page.fill("#acc-pin", "4826"); await page.click("#acc-pin-go");
  await page.waitForSelector("#acc-off"); await page.click("#acc-off");
  var cleared = await page.evaluate(function () { return { any: ["define", "dict", "audio", "big", "slow"].some(SolAcc.on), marks: document.querySelectorAll("#app .acc-w, #app .acc-say, #app .acc-bar").length, pop: (document.getElementById("acc-pop") || {}).style ? document.getElementById("acc-pop").style.display : "none", big: document.body.classList.contains("acc-big") }; });
  check(!cleared.any && !cleared.marks && !cleared.big && cleared.pop === "none", "Turn all off clears every option and every mark on the page: " + JSON.stringify(cleared));
  await page.click("#acc-close");

  check(!errors.length, "no page errors" + (errors.length ? ": " + errors.slice(0, 5).join(" | ") : ""));
  await browser.close(); srv.close();
  if (fails.length) { console.log("FAILED: " + fails.length); process.exit(1); }
  console.log("ALL OK");
})().catch(function (e) { console.error(e); process.exit(1); });
