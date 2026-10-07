/* Headless check of the Apps Script build: node tools/smoke-appsscript.js
   (run tools/build-appsscript.js first).
   Serves dist/appsscript and opens test.html, which plays Apps Script's part: loader.html in a sandboxed frame,
   google.script.run answered from the local parts. Checks that the game only ever asks the server for the
   loader, the manifest and the parts (every asset comes out of the bundle), that the title screen, a level and
   the 3D castle all work, that music is off, that a second visit loads from the Chromebook's cache, and that
   the teacher page (?admin=1) and a class session (?class=CODE) work end to end. */
var path = require("path"), fs = require("fs"), http = require("http"), url = require("url");
var { chromium } = require("/opt/node22/lib/node_modules/playwright");
var st = "bio";
var root = path.join(__dirname, "..", "dist", "appsscript"), shots = path.join(__dirname, "shots");
fs.mkdirSync(shots, { recursive: true });
var MIME = { html: "text/html", json: "application/json", bin: "application/octet-stream" };
var served = [];
var srv = http.createServer(function (req, res) {
  var p = decodeURIComponent(url.parse(req.url).pathname);
  served.push(p);
  fs.readFile(path.join(root, p), function (err, buf) {
    if (err) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { "Content-Type": MIME[p.split(".").pop()] || "application/octet-stream" }); res.end(buf);
  });
});
(async function () {
  await new Promise(function (r) { srv.listen(0, r); });
  var base = "http://127.0.0.1:" + srv.address().port + "/";
  var glArgs = { args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] };
  var browser = await chromium.launch(Object.assign({ executablePath: "/opt/pw-browsers/chromium/chrome-linux/chrome" }, glArgs)).catch(function () { return chromium.launch(glArgs); });
  var ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  var page = await ctx.newPage();
  var errors = [], fails = [];
  page.on("pageerror", function (e) { errors.push("pageerror: " + e.message); });
  page.on("console", function (m) { if (m.type() === "error") { var t = m.text(); if (!/favicon|Autoplay|AudioContext|peerjs|WebGL|GL Driver|swiftshader/i.test(t)) errors.push(t); } });
  function check(cond, msg) { if (!cond) fails.push(msg); console.log((cond ? "ok   " : "FAIL ") + msg); }
  async function frame() { var h = await page.waitForSelector("#app"); return h.contentFrame(); }
  var man = JSON.parse(fs.readFileSync(path.join(root, st, "manifest.json"), "utf8"));

  var t0 = Date.now();
  await page.goto(base + "test.html?st=" + st);
  var f = await frame();
  await f.waitForSelector("#title-screen:not(.hidden)", { timeout: 60000 });
  console.log("first load " + (Date.now() - t0) + " ms");
  await page.waitForTimeout(1500);
  var s1 = await f.evaluate(function () {
    return { units: (window.HEIST_FAMILIES || []).length, cards: document.querySelectorAll("#title-screen .card[data-family]").length, boot: !!document.getElementById("sol-boot"), phaser: !!window.Phaser, build: !!window.SolBuild,
      three: !!window.THREE, calls: window.__solCalls.slice(), music: getComputedStyle(document.getElementById("btn-music")).display,
      logo: document.querySelector("#title-screen .logo img").src, logoOk: document.querySelector("#title-screen .logo img").naturalWidth, title: document.title };
  });
  console.log(JSON.stringify(s1));
  check(s1.units === 9 && s1.cards === 9, "the page is the Biology game (nine unit cards)");
  check(!s1.boot && s1.phaser && s1.build && s1.three, "the loader finished and the game's scripts ran");
  check(s1.calls.length === 1 + man.parts.length && s1.calls[0] === "solManifest", "the page asked the server for the manifest and " + man.parts.length + " parts: " + s1.calls.join(", "));
  check(s1.logoOk > 0 && /^blob:/.test(s1.logo), "the title logo comes from the bundle");
  check(s1.music === "none", "no music button");
  await page.screenshot({ path: path.join(shots, "as-01-title.png") });

  /* a level */
  async function startLevel(fr, fam) {
    await fr.click('#title-screen .card[data-family="' + fam + '"]');
    await fr.waitForSelector("#mode-screen:not(.hidden)");   /* v5.8.3: the game mode screen */
    await fr.click('#mode-packs .card[data-gamemode="ALL"]');
    await fr.waitForSelector("#skill-screen:not(.hidden)");
    await fr.click("#btn-skill-start");
    await page.waitForTimeout(400);
    if (await fr.isVisible("#btn-char-confirm")) await fr.click("#btn-char-confirm");
    await page.waitForTimeout(3000);
    for (var i = 0; i < 12; i++) { if (await fr.isVisible("#tut-skip")) { await fr.click("#tut-skip"); break; } await page.waitForTimeout(300); }
    await page.waitForTimeout(1500);
  }
  await startLevel(f, "ECO");
  var hud = await f.evaluate(function () { return { stem: document.getElementById("eoc-stem").textContent, sol: document.getElementById("job-sol").textContent, music: window.SolMusic.state() }; });
  check(hud.stem.length > 10 && /BIO\.8/.test(hud.sol), "a level starts with an Ecology question: " + hud.sol);
  check(!hud.music.key, "no music track is playing");
  await page.screenshot({ path: path.join(shots, "as-02-level.png") });
  if (await f.isVisible("#read-go")) await f.click("#read-go");
  await page.waitForTimeout(1500);
  var sprites = await f.evaluate(function () {
    var g = window.SolScene && SolScene.game, tx = g && g.textures, bad = [];
    if (tx) tx.getTextureKeys().forEach(function (k) { var s = tx.get(k).getSourceImage(); if (s && s.width === 0) bad.push(k); });
    return { n: tx ? tx.getTextureKeys().length : -1, bad: bad };
  });
  check(sprites.n > 10 && sprites.bad.length === 0, "the game's images loaded: " + sprites.n + " textures" + (sprites.bad.length ? ", empty: " + sprites.bad.join(",") : ""));
  await page.screenshot({ path: path.join(shots, "as-03-maze.png") });

  /* the 3D castle, with one of every kind of building and every monument */
  await f.evaluate(function () {
    var ids = ["keep", "k-stables", "k-church", "k-barracks", "k-market", "k-castle", "trophy-midgard", "trophy-asgard", "trophy-ragnarok", "tower", "wall", "gate"];
    var picks = ids.map(function (id, i) { return { night: 5, piece: id, style: "blue", src: "free", deco: false, ord: i, rot: 0, cx: (i % 4) * 4, cy: Math.floor(i / 4) * 4 }; });
    localStorage.setItem("afterHours.v1.build", JSON.stringify({ v: 4, theme: "castle", salt: 7, coins: 50, kit: 2, owned: {}, rewards: {}, picks: picks, view: { a: 0, z: 1, px: 0, py: 0 }, code: "" }));
  });
  await page.reload();
  f = await frame();
  await f.waitForSelector("#title-screen:not(.hidden)", { timeout: 60000 });
  var calls2 = await f.evaluate(function () { return window.__solCalls.slice(); });
  check(calls2.length === 1 && calls2[0] === "solManifest", "a second visit loads the game from the Chromebook's cache: " + calls2.join(", "));
  await f.evaluate(function () { SolBuild.init && SolBuild.init(); SolBuild.showGallery(); });
  await f.waitForSelector("#build-overlay:not(.hidden)");
  var loads;
  for (var w = 0; w < 40; w++) {
    await page.waitForTimeout(500);
    loads = await f.evaluate(function () { return SolBuild._loads3d(); });
    if (loads && loads.models === "ok" && loads.total > 3 && loads.loaded + loads.failed === loads.total) break;
  }
  await page.waitForTimeout(1500);
  var probe = await f.evaluate(function () { return SolBuild._probe(3, 2, 1); });
  console.log("3d", JSON.stringify({ loads: loads, probe: probe }));
  check(probe && probe.use3d, "the castle draws in 3D");
  check(loads && loads.models === "ok" && loads.failed === 0 && loads.loaded === loads.total && loads.total > 3, "every 3D model loaded from the bundle: " + JSON.stringify(loads));
  await page.screenshot({ path: path.join(shots, "as-04-castle-3d.png") });

  /* the teacher page (?admin=1) and a class session (?class=CODE) */
  await page.goto(base + "test.html?st=" + st + "&admin=1");
  f = await frame();
  await f.waitForSelector("#p1", { timeout: 60000 });
  var gameRan = await f.evaluate(function () { return !!window.Phaser || !!document.getElementById("title-screen"); });
  check(!gameRan, "the teacher page loads the question bank, not the game");
  await f.fill("#p1", "2468"); await f.fill("#p2", "2468"); await f.click("button.pri");
  await f.waitForSelector("#nn");
  await f.fill("#nn", "Biology Block 3"); await f.selectOption("#ng", "ECO"); await f.click("#nf button.pri");
  await f.waitForSelector("#addset");
  var stdOpts = await f.evaluate(function () { var sel = document.querySelector('#pane select[data-q="sol"]'); return sel ? Array.prototype.map.call(sel.options, function (o) { return o.value; }) : null; });
  await f.click("#addset");
  await f.fill('.adm-set [data-f="title"]', "Ecology · Our stream survey");
  await f.fill('.adm-set [data-f="passage"]', "Our class sampled Beaver Creek above and below the storm drain. Above the drain we found 14 mayfly larvae and 2 midge larvae per net. Below the drain we found 1 mayfly larva and 31 midge larvae per net.\n\nMayflies need clean, oxygen-rich water, while midges tolerate pollution.");
  await f.fill('.adm-q [data-q="stem"]', "Which conclusion is best supported by the class's counts?");
  for (var ci = 0; ci < 4; ci++) await f.fill('.adm-q [data-q="c' + ci + '"]', ["The stream is cleaner below the drain.", "Water quality drops below the storm drain.", "Midges need cleaner water than mayflies.", "The two sites have the same water quality."][ci]);
  await f.check('.adm-q input[type=radio][value="B"]');
  await f.selectOption('.adm-q select[data-q="sol"]', "BIO.8.d");
  var opts = await f.evaluate(function () { var sel = document.querySelector('.adm-q select[data-q="sol"]'); return Array.prototype.map.call(sel.options, function (o) { return o.value; }); });
  check(opts.length === 4 && opts.every(function (o) { return /^BIO\.8\.[a-d]$/.test(o); }), "an Ecology class offers the four BIO.8 key ideas as a question's standard: " + opts.join(", "));
  await f.click('.adm-tab[data-tab="bank"]');
  await f.waitForSelector(".adm-bq [data-hide]");
  var hiddenId = await f.getAttribute(".adm-bq", "data-id");
  var bankSols = await f.evaluate(function () { return Array.prototype.slice.call(document.querySelectorAll(".adm-bq .adm-dim")).slice(0, 30).map(function (d) { return d.textContent; }); });
  check(bankSols.length > 0 && bankSols.every(function (t) { return /BIO\.8\./.test(t); }), "the regular-questions tab lists the unit's own questions (BIO.8)");
  await f.click(".adm-bq [data-hide]");
  await f.click("#save"); await page.waitForTimeout(400);
  var cls = await f.evaluate(function () { return SolAdmin._cur(); });
  check(cls && cls.code && cls.grade === "ECO" && cls.sets.length === 1 && cls.sets[0].questions[0].correct === "B" && cls.sets[0].questions[0].sol === "BIO.8.d" && cls.hide.indexOf(hiddenId) !== -1, "the teacher page makes an Ecology class with a question set and a hidden regular question: " + (cls && cls.code));
  await page.screenshot({ path: path.join(shots, "as-05-teacher.png") });

  await page.goto(base + "test.html?st=" + st + "&class=" + cls.code);
  f = await frame();
  await f.waitForSelector("#class-nick input", { timeout: 60000 });
  await f.fill("#class-nick input", "Test S."); await f.click("#class-nick button");
  var cs = await f.evaluate(function (hid) {
    var P = window.HEIST_PACKS, mine = P.filter(function (p) { return p.classSet; });
    var hidden = P.some(function (p) { return p.claims.some(function (c) { return p.id + ":" + c.id === hid; }); });
    var built = heistBuildPack("ECO", "ALL").claims;
    var visible = Array.prototype.filter.call(document.querySelectorAll("#title-screen .card[data-family]"), function (c) { return !c.classList.contains("hidden"); }).map(function (c) { return c.getAttribute("data-family"); });
    return { cls: !!window.SOL_CLASS, sets: mine.length, fam: mine[0] && mine[0].family, q: mine[0] && mine[0].claims[0].stem, key: mine[0] && mine[0].claims[0].correct, sol: mine[0] && mine[0].claims[0].sol, hidden: hidden,
      inPool: built.some(function (c) { return c.packId === (mine[0] || {}).id; }), others: built.filter(function (c) { return !/^class-/.test(c.packId); }).length,
      kicker: document.getElementById("title-kicker").textContent, nick: SolClass.nick(), visible: visible };
  }, hiddenId);
  console.log("class", JSON.stringify(cs));
  check(cs.cls && cs.sets === 1 && cs.fam === "ECO" && /counts/.test(cs.q) && cs.key === "B" && cs.sol === "BIO.8.d" && !cs.hidden && cs.inPool && cs.others > 0, "the class link plays the class's question set mixed with the regular Ecology questions, minus the hidden one");
  check(/Class: Biology Block 3/.test(cs.kicker) && cs.nick === "Test S." && cs.visible.length === 1 && cs.visible[0] === "ECO", "the class link names the class, shows only its unit, and asks for the student's nickname once");
  await startLevel(f, "ECO");
  var reps = 0;
  for (var rw = 0; rw < 16 && !reps; rw++) { if (await f.isVisible("#read-go")) await f.click("#read-go"); reps = await f.evaluate(function () { return window.__solReports || 0; }); if (!reps) await page.waitForTimeout(500); }
  check(reps >= 1, "a student's progress is sent to the teacher page (" + reps + " reports)");
  await page.screenshot({ path: path.join(shots, "as-06-class.png") });

  /* the progress table, and "only this class's sets" */
  await page.goto(base + "test.html?st=" + st + "&admin=1");
  f = await frame();
  await f.waitForSelector("[data-open]", { timeout: 60000 });
  await f.click("[data-open]");
  await f.waitForSelector("#only");
  await f.click('.adm-tab[data-tab="prog"]');
  await f.waitForSelector(".adm-table td b", { timeout: 10000 });
  var prog = await f.textContent(".adm-table");
  check(/Test S\./.test(prog), "the teacher page shows the student's progress");
  await page.screenshot({ path: path.join(shots, "as-07-progress.png") });
  await f.check("#only"); await f.click("#save"); await page.waitForTimeout(400);
  await page.goto(base + "test.html?st=" + st + "&class=" + cls.code);
  f = await frame();
  await f.waitForSelector("#title-screen:not(.hidden)", { timeout: 60000 });
  var only = await f.evaluate(function () { var b = heistBuildPack("ECO", "ALL").claims; return { n: b.length, all: b.every(function (c) { return /^class-/.test(c.packId); }) }; });
  check(only.n >= 1 && only.all, "with \"only this class's sets\" on, the class plays its own questions only: " + JSON.stringify(only));
  await page.goto(base + "test.html?st=" + st + "&class=NOPE99");
  f = await frame();
  await f.waitForSelector("#title-screen:not(.hidden)", { timeout: 60000 });
  var nope = await f.evaluate(function () { return { cls: !!window.SOL_CLASS, missing: window.SOL_CLASS_MISSING, packs: window.HEIST_PACKS.filter(function (p) { return p.classSet; }).length, cards: document.querySelectorAll("#title-screen .card[data-family]:not(.hidden)").length }; });
  check(!nope.cls && nope.missing === "NOPE99" && nope.packs === 0 && nope.cards === 9, "an unknown class code plays the regular game (all nine units) and says so");

  /* nothing but the loader, manifest and parts ever came from the server */
  var allowed = ["/test.html", "/" + st + "/loader.html", "/" + st + "/manifest.json"].concat(man.parts.map(function (p) { return "/" + st + "/" + p; }));
  var leaks = served.filter(function (p) { return allowed.indexOf(p) === -1; });
  check(leaks.length === 0, "every asset came from the bundle" + (leaks.length ? "; asked the server for: " + leaks.slice(0, 12).join(", ") : ""));
  check(errors.length === 0, "no errors" + (errors.length ? ": " + errors.slice(0, 6).join(" | ") : ""));

  await browser.close(); srv.close();
  console.log(fails.length ? "\n" + fails.length + " FAILED" : "\nALL OK");
  process.exit(fails.length ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(1); });
