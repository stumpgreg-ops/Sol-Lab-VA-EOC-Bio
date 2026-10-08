/* SOL Lab Biology (from SOL Labyrinth). Headless check of the progress record, "Submit my progress", badges, the Teacher screen,
   Restore and the teacher page: node tools/smoke-progress.js (run node tools/build-teacher.js BIO, node tools/build-appsscript.js
   and node tools/build-canvas.js first).
   1. The dev page (Biology): a maze level won with one wrong pick, a shooter level won, a maze level lost. The record
      counts levels, answers, first-try answers, wrong picks, skills, modes and the level log; active time runs only
      while a level is on screen (not with the reading card open, not after the idle limit). Old or broken saves
      don't break it. The progress window (after a level and on the title screen) shows the summary, the code and
      the Canvas instruction, and the code decodes to the record (with the nickname).
   2. The teacher page (dist/canvas/SOLLab-VA-Bio-Teacher.html): pasted text with names, the game's code, a
      tampered copy and a reading-game code; a newer code for the same student; the goals change the grade; CSV and Copy;
      a Canvas "Download Submissions" .zip with two students (one deflated, one stored). No page errors, nothing
      loaded from outside. Screenshots: tools/shots/pg-*.png
   3. Restore (v5.14): the code is SOL2 and carries the level, the Fangs and the town or castle; "Restore my progress"
      on a cleared Chromebook brings them all back (and the totals, so the next code goes on from them); a SOL1 code
      restores the totals and the level; another game's code and a typo are refused; WORDS has every theme, style and
      piece in pieces.json. */
var path = require("path"), fs = require("fs"), http = require("http"), url = require("url"), zlib = require("zlib");
var { chromium } = require("/opt/node22/lib/node_modules/playwright");
var root = path.join(__dirname, ".."), shots = path.join(__dirname, "shots");
var C = require(path.join(root, "js", "progress-code.js"));
fs.mkdirSync(shots, { recursive: true });
var MIME = { html: "text/html", js: "application/javascript", css: "text/css", json: "application/json", png: "image/png", mp3: "audio/mpeg", webp: "image/webp", glb: "model/gltf-binary" };
function serve(dir) {
  var s = http.createServer(function (req, res) {
    var f = path.join(dir, decodeURIComponent(url.parse(req.url).pathname));
    if (f.endsWith("/")) f += "index.html";
    fs.readFile(f, function (err, buf) {
      if (err) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { "Content-Type": MIME[f.split(".").pop()] || "application/octet-stream" }); res.end(buf);
    });
  });
  return new Promise(function (r) { s.listen(0, function () { r(s); }); });
}
var fails = [];
function check(cond, msg) { if (!cond) fails.push(msg); console.log((cond ? "ok   " : "FAIL ") + msg); }

/* a zip like Canvas's "Download Submissions": local headers, central directory, end record */
function crc32(b) {
  var c, t = crc32.t || (crc32.t = (function () { var a = []; for (var n = 0; n < 256; n++) { c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; a[n] = c >>> 0; } return a; })());
  c = 0xffffffff;
  for (var i = 0; i < b.length; i++) c = t[(c ^ b[i]) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function makeZip(files) {
  var locals = [], centrals = [], off = 0;
  files.forEach(function (f) {
    var name = Buffer.from(f.name), raw = Buffer.from(f.text), data = f.deflate ? zlib.deflateRawSync(raw) : raw, crc = crc32(raw);
    var lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(0, 6); lh.writeUInt16LE(f.deflate ? 8 : 0, 8);
    lh.writeUInt32LE(crc, 14); lh.writeUInt32LE(data.length, 18); lh.writeUInt32LE(raw.length, 22); lh.writeUInt16LE(name.length, 26); lh.writeUInt16LE(0, 28);
    var ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0); ch.writeUInt16LE(20, 4); ch.writeUInt16LE(20, 6); ch.writeUInt16LE(0, 8); ch.writeUInt16LE(f.deflate ? 8 : 0, 10);
    ch.writeUInt32LE(crc, 16); ch.writeUInt32LE(data.length, 20); ch.writeUInt32LE(raw.length, 24); ch.writeUInt16LE(name.length, 28); ch.writeUInt32LE(off, 42);
    locals.push(lh, name, data); centrals.push(ch, name);
    off += 30 + name.length + data.length;
  });
  var cd = Buffer.concat(centrals), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10); end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(off, 16);
  return Buffer.concat(locals.concat([cd, end]));
}

(async function () {
  var glArgs = { args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] };
  var browser = await chromium.launch(Object.assign({ executablePath: "/opt/pw-browsers/chromium/chrome-linux/chrome" }, glArgs)).catch(function () { return chromium.launch(glArgs); });
  var errors = [];
  function watch(page) {
    page.on("pageerror", function (e) { errors.push("pageerror: " + e.message); });
    page.on("console", function (m) { if (m.type() === "error") { var t = m.text(); if (!/favicon|net::ERR|Autoplay|AudioContext|peerjs|WebGL|GL Driver|swiftshader/i.test(t)) errors.push("console: " + t); } });
  }
  async function skipIntro(page) {
    for (var i = 0; i < 12; i++) { if (await page.isVisible("#tut-skip")) { await page.click("#tut-skip"); break; } await page.waitForTimeout(250); }
  }
  async function closeReading(page) {
    for (var i = 0; i < 16; i++) { if (await page.isVisible("#read-go")) { await page.click("#read-go"); return true; } await page.waitForTimeout(200); }
    return false;
  }
  async function startFromTitle(page, fam, mode) {
    await page.click('#title-screen .card[data-family="' + fam + '"]');
    await page.waitForSelector("#mode-screen:not(.hidden)");
    await page.click('#mode-packs .card[data-gamemode="' + mode + '"]');
    await page.waitForSelector("#skill-screen:not(.hidden)");
    await page.waitForTimeout(500);
    await page.click("#btn-skill-start");
    await page.waitForTimeout(400);
    if (await page.isVisible("#btn-char-confirm")) await page.click("#btn-char-confirm");
    await page.waitForTimeout(2500);
    await skipIntro(page);
    await page.waitForTimeout(800);
  }
  /* the maze: carry the right letter(s) to EXIT */
  var bankRight = function () {
    var s = SolScene;
    s.player.carrying = null; s.player.carryExtra = [];
    s.need.forEach(function (L, i) { var sl = s.slips.filter(function (q) { return q.letter === L && q.active !== false; })[0]; if (!i) s.player.carrying = sl; else s.player.carryExtra.push(sl); });
    s.player.body.reset(s.exitZone.x, s.exitZone.y); s.player.x = s.exitZone.x; s.player.y = s.exitZone.y;
    s.tryExtract();
    return { score: s.score, need: s.needExtracts, ended: !!s.ended };
  };

  /* ════ 1. the dev page, Virginia ════ */
  var dev = await serve(root);   /* the dev page needs teacher/BIO.html (node tools/build-teacher.js BIO) */
  var page = await browser.newPage({ viewport: { width: 1280, height: 760 } });
  watch(page);
  await page.goto("http://127.0.0.1:" + dev.address().port + "/index.html", { waitUntil: "load" });
  await page.evaluate(function () { localStorage.clear(); localStorage.setItem("afterHours.v1.progress.BIO", "{not json"); });
  await page.reload({ waitUntil: "load" }); await page.waitForTimeout(800);
  await page.waitForSelector("#title-screen:not(.hidden)");
  check(await page.isVisible("#btn-progress"), "title screen: a My progress code button next to My Town / Music");
  var broken = await page.evaluate(function () { return SolProgress.summary("BIO"); });
  check(broken.started === 0 && broken.answered === 0 && broken.minutes === 0, "a broken saved record starts fresh: " + JSON.stringify(broken).slice(0, 80));
  await page.evaluate(function () { localStorage.setItem("afterHours.v1.progress.BIO", JSON.stringify({ levels: { won: "x", started: 2 }, q: { answered: 3, right: 9 }, skills: { RL: { a: 3, r: 1 }, "bad key": 4 }, log: "no" })); });
  await page.reload({ waitUntil: "load" }); await page.waitForTimeout(800);
  var old = await page.evaluate(function () { return SolProgress.record("BIO"); });
  check(old.levels.started === 2 && old.levels.won === 0 && old.q.answered === 3 && old.q.right === 3 && old.skills.RL.a === 3 && !old.skills["bad key"] && Array.isArray(old.log),
    "an old or partial record keeps what is usable and fills in the rest");
  await page.evaluate(function () { SolProgress._reset("BIO"); localStorage.removeItem("afterHours.v1.progress.BIO"); });
  await page.waitForSelector("#title-screen:not(.hidden)");
  await page.fill("#join-nick", "Ann S");

  /* level 1: the maze — a wrong pick, then every question right */
  await startFromTitle(page, "ECO", "ALL");
  var l1 = await page.evaluate(function () { return { night: SolScene.night, mode: SolScene.mode ? SolScene.mode.id : "maze", cur: SolProgress.current(), read: !document.getElementById("read-overlay").classList.contains("hidden") }; });
  check(l1.night === 1 && l1.cur && l1.cur.night === 1 && l1.cur.mode === "maze" && l1.cur.st === "BIO", "level 1 (maze) start is recorded: " + JSON.stringify(l1.cur));
  /* the reading card is open: the clock doesn't run */
  var t0 = await page.evaluate(function () { return SolProgress.current().ms; });
  await page.mouse.move(400, 300); await page.waitForTimeout(2200);
  var t1 = await page.evaluate(function () { return SolProgress.current().ms; });
  check(l1.read && t1 === t0, "no play time while the reading card is open (" + t0 + " -> " + t1 + " ms)");
  await closeReading(page);
  var tStart = Date.now();
  for (var k = 0; k < 6; k++) { await page.mouse.move(500 + k * 10, 400); await page.keyboard.press("Shift"); await page.waitForTimeout(500); }
  var t2 = await page.evaluate(function () { return SolProgress.current().ms; }), took = Date.now() - tStart;
  check(t2 >= 2000 && t2 >= took - 2200 && t2 <= took + 1200, "play time runs while the level is on screen: " + t2 + " ms counted in " + took + " ms");
  /* idle: no input for longer than the idle limit stops the clock */
  var idle = await page.evaluate(async function () {
    var real = Date.now, shift = SolProgress.IDLE_MS + 5000;
    Date.now = function () { return real() + shift; };       /* the last input was IDLE_MS + 5 s ago */
    var a = SolProgress.current().ms;
    await new Promise(function (r) { setTimeout(r, 2200); });
    var b = SolProgress.current().ms;
    Date.now = real;
    return { a: a, b: b };
  });
  check(idle.b === idle.a, "no play time after " + 90 + " s without a key press or a tap: " + JSON.stringify(idle));
  await page.mouse.move(520, 410);
  var p1 = await page.evaluate(function () {
    var s = SolScene; s.spareLives = 0; s.perks = {}; s.iframeMs = 0; s.stunMs = 0;
    s.flagWrongAlarm({ x: s.player.x, y: s.player.y });
    return { strikes: s.strikes, rec: SolProgress.record("BIO").q };
  });
  check(p1.rec.wrong === 1 && p1.rec.answered === 0, "a wrong pick is counted: " + JSON.stringify(p1.rec));
  var l1won = null, firstSkill = await page.evaluate(function () { var c = SolScene.claim; return "BIO" + (/^BIO\.(\d)/i.exec(c.strand || "") || [0, "1"])[1]; });
  for (var q = 0; q < 12; q++) {
    await closeReading(page).catch(function () {});
    var r1 = await page.evaluate(bankRight);
    if (r1.ended) { l1won = r1; break; }
    await page.waitForTimeout(700);
  }
  await page.waitForTimeout(1200);
  var after1 = await page.evaluate(function () { return { rec: SolProgress.record("BIO"), title: document.getElementById("win-title").textContent, endBtn: !document.getElementById("btn-progress-end").classList.contains("hidden") }; });
  console.log("after level 1", JSON.stringify(after1.rec));
  check(l1won && after1.rec.levels.started === 1 && after1.rec.levels.won === 1 && after1.rec.q.answered === l1won.need && after1.rec.q.right === l1won.need - 1 && after1.rec.q.wrong === 1,
    "level 1 won: " + (l1won && l1won.need) + " questions answered, all but the first right on the first try, 1 wrong pick");
  check(after1.rec.skills[firstSkill] && Object.keys(after1.rec.skills).reduce(function (a, k) { return a + after1.rec.skills[k].a; }, 0) === after1.rec.q.answered, "every answer is counted under its skill (" + Object.keys(after1.rec.skills).join(",") + ")");
  check(after1.rec.activeMs >= 2000 && after1.rec.hiReached === 1 && after1.rec.hiWon === 1 && after1.rec.first && after1.rec.dayCount === 1, "time, highest level and days are recorded");
  check(after1.endBtn, "the end-of-level screen has a My progress code button");
  /* level 2: a shooter (Eagle Swoop) — one wrong pick, then every question right */
  for (var w2 = 0; w2 < 20 && !(await page.isVisible("#btn-next")); w2++) {
    /* the town reward pop-up comes first on some levels: pick the first piece */
    if (await page.isVisible("#build-overlay")) { try { await page.click("#build-overlay .build-opt >> nth=0", { timeout: 1000 }); await page.click("#build-overlay .btn.primary", { timeout: 1000 }); } catch (e) {} }
    await page.waitForTimeout(300);
  }
  await page.click("#btn-next");
  await page.waitForTimeout(2500);
  await closeReading(page);
  await page.waitForTimeout(600);
  var l2 = await page.evaluate(function () { return { mode: SolScene.mode && SolScene.mode.id, cur: SolProgress.current() }; });
  check(l2.mode && l2.cur.mode === l2.mode && l2.cur.night === 2, "level 2 (a shooter, " + l2.mode + ") start is recorded");
  await page.evaluate(function () { var s = SolScene; s.spareLives = 0; s.perks = {}; var bad = ["A", "B", "C", "D", "E", "F"].filter(function (L) { return s.need.indexOf(L) === -1; })[0]; s.answerPick(bad, 100, 100); });
  var l2ans = 0, l2need = 0;
  for (var q2 = 0; q2 < 40; q2++) {
    await closeReading(page).catch(function () {});
    var r2 = await page.evaluate(function () {
      var s = SolScene;
      if (s.ended) return { ended: true };
      if (s._mopup && !s._finishing) { s.mopupLeft(0); return { mop: true }; }
      if (s._between || s._finishing || !s.claim || s.readOpen) return { wait: true };
      var res = "";
      s.need.forEach(function (L) { if (s.extracted.indexOf(L) === -1) res = s.answerPick(L, 200, 200); });
      return { res: res, score: s.score, need: s.needExtracts };
    });
    if (r2.ended) break;
    if (r2.res === "done") { l2ans++; l2need = r2.need; }
    await page.waitForTimeout(450);
  }
  await page.waitForTimeout(1500);
  var after2 = await page.evaluate(function () { return SolProgress.record("BIO"); });
  check(after2.levels.started === 2 && after2.levels.won === 2 && after2.q.answered === after1.rec.q.answered + l2need && after2.q.wrong === 2 && after2.modes[l2.mode] && after2.modes[l2.mode].won === 1 && after2.modes.maze.won === 1,
    "level 2 won: answers, the wrong pick and the mode are counted (" + l2need + " questions, modes " + Object.keys(after2.modes).join(",") + ")");
  /* level 3: the maze, lost on wrong letters */
  for (var w3 = 0; w3 < 20 && !(await page.isVisible("#btn-next")); w3++) {
    if (await page.isVisible("#build-overlay")) { try { await page.click("#build-overlay .build-opt >> nth=0", { timeout: 1000 }); await page.click("#build-overlay .btn.primary", { timeout: 1000 }); } catch (e) {} }
    await page.waitForTimeout(300);
  }
  await page.click("#btn-next");
  await page.waitForTimeout(2500);
  await closeReading(page);
  await page.evaluate(function () { var s = SolScene; s.spareLives = 0; s.perks = {}; for (var i = 0; i < 6 && !s.ended; i++) { s.iframeMs = 0; s.stunMs = 0; s.flagWrongAlarm({ x: s.player.x, y: s.player.y }); } });
  await page.waitForTimeout(1200);
  var after3 = await page.evaluate(function () { return { rec: SolProgress.record("BIO"), title: document.getElementById("win-title").textContent }; });
  console.log("after level 3", JSON.stringify(after3.rec).slice(0, 600));
  var lg = after3.rec.log;
  check(after3.rec.levels.started === 3 && after3.rec.levels.won === 2 && after3.rec.levels.lost === 1 && after3.rec.hiReached === 3 && after3.rec.hiWon === 2 && after3.rec.q.wrong >= 5,
    "level 3 lost: 3 started, 2 won, 1 lost, highest level 3 (won 2)");
  check(lg.length === 3 && lg[0].n === 1 && lg[0].res === "won" && lg[0].m === "maze" && lg[1].m === l2.mode && lg[2].res === "lost" && lg[0].a === l1won.need && lg[0].r === l1won.need - 1 && lg[0].w === 1,
    "the level log has each level's date, number, mode, answers, first-try answers, wrong picks and result");

  /* the progress window after a level */
  await page.click("#btn-progress-end");
  await page.waitForSelector("#progress-overlay:not(.hidden)");
  var modal = await page.evaluate(function () {
    var o = document.getElementById("progress-overlay");
    return { text: o.innerText, code: o.querySelector(".prog-code").textContent, sum: SolProgress.summary("BIO") };
  });
  await page.screenshot({ path: path.join(shots, "pg-01-modal-va.png") });
  var dec = C.decode(modal.code);
  console.log("code", modal.code, modal.code.length + " chars");
  check(/^SOL3-BIO-[0-9A-Z]{4}(-[0-9A-Z]{1,4})+$/.test(modal.code) && modal.code.length <= 220, "the window shows a code: SOL3-BIO- in blocks of 4, " + modal.code.length + " characters (no castle yet)");
  check(dec.ok && dec.data.nick === "Ann S" && dec.data.won === 2 && dec.data.started === 3 && dec.data.lost === 1 && dec.data.answered === modal.sum.answered && dec.data.right === modal.sum.right &&
    dec.data.wrong === modal.sum.wrong && dec.data.hiReached === 3 && dec.data.hiWon === 2 && dec.data.days === 1 && dec.data.modes === 2 && dec.data.version === (fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8").match(/\?v=([0-9.]+)/) || [])[1] && Math.abs(dec.data.made - Date.now()) < 120000,
    "the code decodes to the record, with the nickname: " + JSON.stringify(dec.data).slice(0, 200));
  check(dec.data.skills.length === 8 && dec.data.skills.reduce(function (a, s) { return a + s.a; }, 0) === modal.sum.answered, "the code carries each standard's (BIO.1 to BIO.8) answered / right");
  /* v5.15: format 3 */
  var stdSum = (dec.data.std || []).reduce(function (a, s) { return a + s.a; }, 0), stdRec = Object.keys(modal.sum.std || {});
  check(dec.data.format === 3 && stdSum === modal.sum.answered && dec.data.std.length === stdRec.length && dec.data.std.every(function (s) { return /^BIO\.\d\.[a-f]$/.test(s.code) && modal.sum.std[s.code].a === s.a && modal.sum.std[s.code].r === s.r; }),
    "the code carries each key idea practiced (" + (dec.data.std || []).map(function (s) { return s.code + " " + s.r + "/" + s.a; }).join(", ") + ")");
  check(dec.data.camp && dec.data.camp.ALL && dec.data.camp.ALL.hiReached === 3 && dec.data.camp.ALL.hiWon === 2 && dec.data.save && dec.data.save.nights.ALL === 3,
    "the code carries each game mode's levels (Mixed: reached 3, won 2, saved at 3): " + JSON.stringify(dec.data.camp) + " " + JSON.stringify(dec.data.save && dec.data.save.nights));
  check(dec.data.badges.indexOf("first-win") !== -1 && dec.data.bestStreak >= 1, "the code carries the badges (" + dec.data.badges.join(", ") + ") and the best streak (" + dec.data.bestStreak + ")");
  check(/turn it in to the SOL Lab Biology progress assignment in Canvas\./.test(modal.text) && /Start Assignment/.test(modal.text) && /Ctrl\+V/.test(modal.text) && /Submit Assignment/.test(modal.text) && /Your nickname: Ann S/.test(modal.text) && /levels? won/.test(modal.text) && /questions answered/.test(modal.text) && /right on the first try/.test(modal.text) && /minutes? played/.test(modal.text) && /days? played/.test(modal.text),
    "the Submit my progress window has a friendly summary, the nickname and the steps to turn the code in");
  await page.click("#progress-overlay .btn.primary");
  await page.waitForTimeout(400);
  var copied = await page.textContent("#progress-overlay .prog-copied");
  check(/Copied!|press Ctrl\+C/.test(copied), "Copy code copies it, or selects it and says to press Ctrl+C: " + copied);
  await page.click("#progress-overlay .btn:not(.primary)");
  check(!(await page.isVisible("#progress-overlay")), "Close closes the window");
  /* the title screen's button */
  await page.click("#btn-again");
  await page.waitForSelector("#title-screen:not(.hidden)");
  await page.click("#btn-progress");
  await page.waitForSelector("#progress-overlay:not(.hidden)");
  var tcode = await page.textContent("#progress-overlay .prog-code");
  check(C.decode(tcode).ok && C.decode(tcode).data.won === 2, "the title screen's My progress code button opens the same window");
  await page.screenshot({ path: path.join(shots, "pg-02-modal-title.png") });
  await page.keyboard.press("Escape");
  check(!(await page.isVisible("#progress-overlay")), "Escape closes it");
  /* v5.15: badges */
  check(/My badges \(\d+\)/.test(await page.textContent("#btn-badges")), "title screen: a My badges button with the count: " + await page.textContent("#btn-badges"));
  await page.click("#btn-badges");
  await page.waitForSelector("#badge-overlay:not(.hidden)");
  var bg = await page.evaluate(function () { var o = document.getElementById("badge-overlay"); return { count: o.querySelector(".badge-count").textContent, tiles: o.querySelectorAll(".badge-tile").length, on: o.querySelectorAll(".badge-tile:not(.locked)").length, text: o.innerText }; });
  await page.screenshot({ path: path.join(shots, "pg-08-badges.png") });
  check(bg.tiles === 80 && bg.on >= 1 && /First Victory/.test(bg.text) && /Eagle Swoop Bronze/.test(bg.text) && /Root Worms Champion/.test(bg.text) && !/Under the Ram/.test(bg.text),
    "the badge gallery: 80 Biology badges (45 general + 5 for each of the 7 modes), earned ones in colour: " + bg.count);
  await page.keyboard.press("Escape");
  var toastSeen = await page.evaluate(function () {
    var rec = SolProgress.record(); rec.badges = rec.badges.filter(function (b) { return b !== "first-win"; });
    localStorage.setItem("afterHours.v1.progress.BIO", JSON.stringify(rec)); SolProgress._reset && 0;
    return true;
  });
  /* v5.15: the Teacher screen inside the game */
  check(!(await page.isVisible("#btn-teacher-screen")), "title screen: the Teacher link is hidden (students never see it)");
  var dlg = [];
  page.on("dialog", function (d) { dlg.push(d.message()); d.accept(); });
  await page.fill("#join-nick", "teacher");
  await page.waitForSelector("#teacher-overlay:not(.hidden)");
  check(/Show the Teacher link on this computer/.test(dlg.join(" ")) && await page.evaluate(function () { return !document.getElementById("btn-teacher-screen").hidden && localStorage.getItem("afterHours.v1.teacherLink") === "1" && document.getElementById("join-nick").value === ""; }),
    "typing teacher in the nickname box asks to show the Teacher link on this computer, opens the teacher screen and clears the box");
  await page.waitForSelector("#teacher-overlay:not(.hidden) iframe");
  await page.waitForSelector("#teacher-overlay:not(.hidden) iframe");
  var tf = page.frames().filter(function (f) { return f !== page.mainFrame() && f.parentFrame() === page.mainFrame(); }).pop();
  await tf.waitForSelector("h1");
  var tin = await tf.evaluate(function () { return { h1: document.querySelector("h1").textContent, close: !document.getElementById("close-teacher").hidden, drop: !!document.getElementById("drop") }; });
  check(/SOL Lab Biology \(Virginia EOC\)/.test(tin.h1) && tin.close && tin.drop, "Teacher opens the teacher screen inside the game, with a Close button: " + tin.h1);
  await page.screenshot({ path: path.join(shots, "pg-13-teacher-in-game.png") });
  check(await tf.isVisible("#hide-link"), "the teacher screen in the game has Hide the Teacher link on this computer");
  await tf.click("#close-teacher");
  check(!(await page.isVisible("#teacher-overlay")), "Close goes back to the game");
  await page.click("#btn-teacher-screen");
  await page.waitForSelector("#teacher-overlay:not(.hidden) iframe");
  await tf.click("#hide-link");
  await page.waitForTimeout(200);
  check(!(await page.isVisible("#teacher-overlay")) && !(await page.isVisible("#btn-teacher-screen")) && await page.evaluate(function () { return localStorage.getItem("afterHours.v1.teacherLink") === null; }),
    "Hide the Teacher link closes the screen and hides the link again");
  await page.fill("#join-nick", "Ann S");
  /* each game mode keeps its own level */
  var nights = await page.evaluate(function () { return { all: localStorage.getItem("afterHours.v1.night.ALL"), raid: localStorage.getItem("afterHours.v1.night.raid"), last: localStorage.getItem("afterHours.v1.night") }; });
  check(nights.all === "3" && nights.raid === null && nights.last === "3", "Mixed keeps its own level (3); Eagle Swoop has none yet: " + JSON.stringify(nights));
  await page.click('#title-screen .card[data-family="ECO"]');
  await page.waitForSelector("#mode-screen:not(.hidden)");
  await page.click('#mode-packs .card[data-gamemode="raid"]');
  await page.waitForSelector("#skill-screen:not(.hidden)");
  var ln = await page.evaluate(function () { return { line: document.getElementById("skill-save-line").textContent, cont: !document.getElementById("btn-skill-continue").classList.contains("hidden") }; });
  check(/No level saved in Eagle Swoop/.test(ln.line) && !ln.cont, "Eagle Swoop starts at level 1 with no Continue: " + ln.line);
  await page.evaluate(function () { localStorage.setItem("afterHours.v1.gameMode", "ALL"); });
  await page.reload({ waitUntil: "load" }); await page.waitForTimeout(800);
  await page.waitForSelector("#title-screen:not(.hidden)");
  await page.click('#title-screen .card[data-family="ECO"]');
  await page.waitForSelector("#mode-screen:not(.hidden)");
  await page.click('#mode-packs .card[data-gamemode="ALL"]');
  await page.waitForSelector("#skill-screen:not(.hidden)");
  var ln2 = await page.evaluate(function () { return { line: document.getElementById("skill-save-line").textContent, cont: document.getElementById("btn-skill-continue").textContent }; });
  check(/Level 3 saved in Mixed/.test(ln2.line) && /Continue Level 3/.test(ln2.cont), "Mixed still continues at level 3: " + ln2.line);
  /* a badge that comes back is shown as earned again (the record was edited above to drop First Victory) */
  var again = await page.evaluate(function () { return SolBadges.check(); });
  await page.waitForTimeout(300);
  var toastTxt = await page.evaluate(function () { var t = document.getElementById("badge-toasts"); return t ? t.innerText : ""; });
  check(again.indexOf("first-win") !== -1 && /Badge earned/i.test(toastTxt) && /First Victory/.test(toastTxt), "a newly earned badge pops up at the top: " + toastTxt.replace(/\n/g, " | "));
  await page.screenshot({ path: path.join(shots, "pg-09-badge-toast.png") });
  await page.click("#btn-skill-back").catch(function () {});
  await page.evaluate(function () { document.getElementById("skill-screen").classList.add("hidden"); document.getElementById("mode-screen").classList.add("hidden"); document.getElementById("title-screen").classList.remove("hidden"); });
  var vaCode = modal.code;

  /* ════ 4. restore ════ */
  var PJ = JSON.parse(fs.readFileSync(path.join(root, "assets", "build", "pieces.json"), "utf8"));
  var allWords = Object.keys(PJ.themes).concat([].concat.apply([], Object.keys(PJ.themes).map(function (k) { return (PJ.themes[k].styles || []).map(function (x) { return x.id; }); })), PJ.pieces.map(function (x) { return x.id; }));
  var missing = allWords.filter(function (w) { return C.WORDS.indexOf(w) === -1; });
  check(missing.length === 0, "WORDS has every theme, style and piece in pieces.json (append new ones at the end)" + (missing.length ? ": missing " + missing.join(", ") : ""));
  check(await page.isVisible("#btn-restore"), "title screen: a Restore my progress button");
  /* a castle like a student's: real castle pieces, styles, a shop piece, a decoration, a turned piece */
  var castle = PJ.pieces.filter(function (x) { return x.theme === "castle"; }), cdeco = castle.filter(function (x) { return x.role === "deco"; }), cbuild = castle.filter(function (x) { return x.role !== "deco"; });
  var picks = [];
  for (var pi = 0; pi < 14; pi++) picks.push({ night: 1, piece: cbuild[pi % cbuild.length].id, style: ["blue", "red", "green"][pi % 3], src: pi < 4 ? "reward" : pi % 2 ? "shop" : "auto", deco: false, rot: pi % 4, cx: (pi % 5) - 2, cy: Math.floor(pi / 5) * 2 - 1 });
  for (pi = 0; pi < 6; pi++) picks.push({ night: 1, piece: cdeco[pi % cdeco.length].id, style: "", src: "shop", deco: true, rot: 0, cx: 4 + pi, cy: -3 });
  var before = await page.evaluate(function (picks) {
    localStorage.setItem("afterHours.v1.build", JSON.stringify({ v: 4, theme: "castle", salt: 123456789, coins: 437, kit: 2, owned: {}, rewards: { 5: picks[0].piece, 10: picks[1].piece, 15: picks[2].piece, 20: picks[3].piece },
      picks: picks, view: { a: 0, z: 1, px: 0, py: 0 }, code: "" }));
    localStorage.setItem("afterHours.v1.night", "21");
    localStorage.setItem("afterHours.v1.night.ALL", "21");
    localStorage.setItem("afterHours.v1.night.raid", "6");
    localStorage.setItem("afterHours.v1.fangs", JSON.stringify([SolRealms.REALMS[0].id, SolRealms.REALMS[1].id]));
    SolBuild._reload();                                /* the game's own clean-up of the record, as in play */
    return { build: JSON.parse(localStorage.getItem("afterHours.v1.build")), code: SolProgress.code("BIO"), sum: SolProgress.summary("BIO"), fangs: localStorage.getItem("afterHours.v1.fangs") };
  }, picks);
  var rd = C.decode(before.code);
  console.log("castle code", before.code.length + " chars for " + before.build.picks.length + " pieces");
  check(/^SOL3-BIO-/.test(before.code) && rd.ok && rd.data.save && rd.data.save.night === 21 && rd.data.save.fangs.join() === "0,1" && rd.data.save.build && rd.data.save.build.theme === "castle" &&
    rd.data.save.build.picks.length === before.build.picks.length && rd.data.save.build.coins === 437, "the code carries the level (21), two Fangs and the castle (" + before.build.picks.length + " pieces, 437 coins): " + before.code.length + " characters");
  /* a cleared Chromebook */
  await page.evaluate(function () { localStorage.clear(); });
  await page.reload({ waitUntil: "load" }); await page.waitForTimeout(800);
  await page.waitForSelector("#title-screen:not(.hidden)");
  await page.click("#btn-restore");
  await page.waitForSelector("#restore-overlay:not(.hidden)");
  /* refused: a typo, another game's code */
  var typo = before.code.slice(0, 30) + (before.code.charAt(30) === "7" ? "8" : "7") + before.code.slice(31);
  await page.fill("#restore-code", typo); await page.click("#restore-check");
  var r1 = await page.evaluate(function () { return { msg: document.querySelector("#restore-overlay .rest-msg").textContent, go: !document.getElementById("restore-go").classList.contains("hidden") }; });
  check(/Does not check out/.test(r1.msg) && !r1.go, "a typo is refused, with no Restore button: " + r1.msg);
  var odyFake = C.encode("ODY", { won: 1, started: 1, hiReached: 1, hiWon: 1 }, { save: { night: 2 } });
  await page.fill("#restore-code", odyFake); await page.click("#restore-check");
  var r2 = await page.evaluate(function () { return document.querySelector("#restore-overlay .rest-msg").textContent; });
  check(/another game/.test(r2), "another game's code is refused: " + r2);
  /* the real code, pasted with the words a student might type around it */
  await page.fill("#restore-code", "my code is " + before.code + " thanks");
  await page.click("#restore-check");
  var r3 = await page.evaluate(function () { return { msg: document.querySelector("#restore-overlay .rest-msg").innerText, go: !document.getElementById("restore-go").classList.contains("hidden") }; });
  await page.screenshot({ path: path.join(shots, "pg-07-restore.png") });
  check(r3.go && /Your levels: Mixed \(all modes\) 21, Eagle Swoop 6/.test(r3.msg) && /\d+ badges?/.test(r3.msg) && /castle: 20 pieces, 437 coins/.test(r3.msg) && /2 Fangs/.test(r3.msg) && /Ann S/.test(r3.msg), "Check code shows what comes back: " + r3.msg.replace(/\n/g, " | "));
  await Promise.all([page.waitForNavigation({ waitUntil: "load" }), page.click("#restore-go")]);
  await page.waitForTimeout(1200);
  var after = await page.evaluate(function () {
    return { build: JSON.parse(localStorage.getItem("afterHours.v1.build") || "null"), night: localStorage.getItem("afterHours.v1.night"), fangs: localStorage.getItem("afterHours.v1.fangs"),
      nick: localStorage.getItem("afterHours.v1.nick"), rec: JSON.parse(localStorage.getItem("afterHours.v1.progress.BIO") || "null") };
  });
  await page.waitForSelector("#title-screen:not(.hidden)");
  var after2 = await page.evaluate(function () { var st = SolBuild._reload(); return { sum: SolProgress.summary("BIO"), code: SolProgress.code("BIO"), nickBox: document.getElementById("join-nick").value, picks: JSON.parse(localStorage.getItem("afterHours.v1.build")).picks.length, coins: SolBuild.coins() }; });
  var key = function (p) { return [p.piece, p.style || "", p.src, !!p.deco, p.rot || 0, p.cx, p.cy].join(":"); };
  check(after.build && after.build.theme === "castle" && after.build.salt === before.build.salt && after.build.coins === 437 && JSON.stringify(after.build.rewards) === JSON.stringify(before.build.rewards) &&
    after.build.picks.map(key).join("|") === before.build.picks.map(key).join("|"), "the castle comes back piece for piece: theme, salt, coins, rewards, each piece's style, turn and cell");
  check(after2.picks === before.build.picks.length && after2.coins === 437, "the game loads the restored castle as it is (" + after2.picks + " pieces, " + after2.coins + " coins)");
  check(after.night === "21" && after.fangs === before.fangs && after.nick === "Ann S" && after2.nickBox === "Ann S", "the level (21), the Fangs and the nickname come back");
  await page.waitForTimeout(1800);   /* the badge check runs 1.5 s after the page loads (town20 for the restored castle) */
  var modeNights = await page.evaluate(function () { return { all: localStorage.getItem("afterHours.v1.night.ALL"), raid: localStorage.getItem("afterHours.v1.night.raid"), rec: SolProgress.record("BIO") }; });
  check(modeNights.all === "21" && modeNights.raid === "6", "each mode's level comes back (Mixed 21, Eagle Swoop 6)");
  var s0 = before.sum, s1 = after2.sum;
  check(s0.badges.every(function (b) { return modeNights.rec.badges.indexOf(b) !== -1; }) && modeNights.rec.badges.indexOf("town20") !== -1 && Object.keys(modeNights.rec.std).length === Object.keys(s0.std).length && modeNights.rec.bestStreak === s0.bestStreak && modeNights.rec.camp.ALL && modeNights.rec.camp.ALL.hiWon === s0.camp.ALL.hiWon,
    "the badges, standards, best streak and mode levels come back (" + modeNights.rec.badges.length + " badges, " + Object.keys(modeNights.rec.std).length + " standards): " +
    JSON.stringify({ b: [modeNights.rec.badges, s0.badges], std: [Object.keys(modeNights.rec.std).length, Object.keys(s0.std).length], st: [modeNights.rec.bestStreak, s0.bestStreak], camp: [modeNights.rec.camp, s0.camp] }));
  check(s1.won === s0.won && s1.started === s0.started && s1.answered === s0.answered && s1.right === s0.right && s1.wrong === s0.wrong && s1.hiReached === s0.hiReached && s1.days === s0.days && s1.modes === s0.modes && Math.abs(s1.minutes - s0.minutes) <= 1 &&
    Object.keys(s0.skills).concat(Object.keys(s1.skills)).every(function (k) { var a = s0.skills[k] || {}, b = s1.skills[k] || {}; return (a.a || 0) === (b.a || 0) && (a.r || 0) === (b.r || 0); }), "the totals come back, so the next code goes on from them: " + JSON.stringify(s1).slice(0, 160));
  var nd = C.decode(after2.code);
  check(nd.ok && nd.data.save.build.picks.length === 20 && nd.data.save.night === 21 && nd.data.won === s0.won, "a code made after the restore carries the same game");
  /* a SOL1 code (before v5.14): the totals and the level, and it says the castle isn't in it */
  var old1 = C.encode("BIO", { first: "2026-09-01", last: "2026-09-20", days: 4, minutes: 50, started: 9, won: 8, lost: 1, hiReached: 8, hiWon: 8, answered: 40, right: 30, wrong: 12, modes: 3, skills: { BIO8: { a: 40, r: 30 } } }, { nick: "Bo", version: "6.3.1" });
  await page.click("#btn-restore");
  await page.waitForSelector("#restore-overlay:not(.hidden)");
  await page.fill("#restore-code", old1); await page.click("#restore-check");
  var r4 = await page.evaluate(function () { return document.querySelector("#restore-overlay .rest-msg").innerText; });
  check(/Level 9 to play next/.test(r4) && /older version/.test(r4) && /replaces what is on this Chromebook now \(level 21/.test(r4), "a SOL1 code: level 9 next, says the castle isn't in it, and warns it replaces level 21: " + r4.replace(/\n/g, " | "));
  await Promise.all([page.waitForNavigation({ waitUntil: "load" }), page.click("#restore-go")]);
  await page.waitForTimeout(1000);
  var after3 = await page.evaluate(function () { return { night: localStorage.getItem("afterHours.v1.night"), rec: JSON.parse(localStorage.getItem("afterHours.v1.progress.BIO")), build: localStorage.getItem("afterHours.v1.build") }; });
  check(after3.night === "9" && after3.rec.levels.won === 8 && after3.rec.q.answered === 40 && after3.rec.dayCount === 4 && after3.build && JSON.parse(after3.build).picks.length === 20,
    "the SOL1 restore sets level 9 and the totals and leaves the castle on this Chromebook alone");
  await page.close();
  dev.close();

  /* a code from the reading game (SOL Labyrinth, Virginia): "another game" here */
  var odyCode = C.encode("VA", { first: "2026-10-01", last: "2026-10-06", days: 2, minutes: 20, started: 4, won: 3, lost: 1, hiReached: 3, hiWon: 3, answered: 16, right: 12, wrong: 5, modes: 2, skills: { RL: { a: 16, r: 12 } } }, { nick: "Dee", version: "5.16.0" });

  /* ════ 3. the teacher page ════ */
  var tdir = path.join(root, "dist", "canvas"), tfile = "SOLLab-VA-Bio-Teacher.html";
  check(fs.existsSync(path.join(tdir, tfile)) && fs.statSync(path.join(tdir, tfile)).size < 200 * 1024, "build-canvas wrote " + tfile + " (" + (fs.statSync(path.join(tdir, tfile)).size / 1024).toFixed(1) + " KiB)");
  async function openPaste(pg) { await pg.evaluate(function () { document.getElementById("paste").closest("details").open = true; }); }
  var zipList = require("child_process").execFileSync("unzip", ["-Z1", path.join(tdir, "SOL Lab VA Bio.zip")]).toString();
  check(zipList.indexOf(tfile) !== -1, "the Canvas zip carries the teacher page");
  var tsrv = await serve(tdir), served = [];
  page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  watch(page);
  page.on("request", function (r) { served.push(r.url()); });
  await page.goto("http://127.0.0.1:" + tsrv.address().port + "/" + tfile, { waitUntil: "load" });
  await page.evaluate(function () { localStorage.clear(); });
  await page.reload({ waitUntil: "load" });
  var tt = await page.evaluate(function () { return { title: document.title, h1: document.querySelector("h1").textContent }; });
  check(/Biology/.test(tt.title) && /SOL Lab Biology \(Virginia EOC\)/.test(tt.h1), "the page names the game: " + tt.h1);
  /* a newer code for the same student, made in Node */
  var later = C.encode("BIO", { first: "2026-09-01", last: "2026-10-06", days: 6, minutes: 75, started: 14, won: 12, lost: 2, hiReached: 12, hiWon: 12, answered: 70, right: 52, wrong: 21, modes: 4,
    skills: { BIO8: { a: 20, r: 15 }, BIO1: { a: 20, r: 16 }, BIO3: { a: 15, r: 12 }, BIO5: { a: 15, r: 9 } } }, { nick: "Ann S", version: "6.4.0", now: Date.now() + 60000 });
  var other = C.encode("BIO", { first: "2026-10-01", last: "2026-10-06", days: 3, minutes: 30, started: 6, won: 5, lost: 1, hiReached: 5, hiWon: 5, answered: 25, right: 15, wrong: 12, modes: 2,
    skills: { BIO8: { a: 10, r: 7 }, BIO2: { a: 15, r: 8 } } }, { nick: "", version: "6.4.0" });
  var groups = vaCode.split("-"), gi = groups.length - 3, gch = groups[gi];
  groups[gi] = (gch[0] === "7" ? "8" : "7") + gch.slice(1);
  var tampered = groups.join("-");
  var text = "Ann Smith: " + vaCode + "\n" + "Carl Diaz\t" + tampered + "\n" + "Dee Park, " + odyCode + "\n" + other + "  thanks!\n";
  await openPaste(page);
  await page.fill("#paste", text);
  await page.click("#read");
  await page.waitForTimeout(300);
  var t1r = await page.evaluate(function () { return TeacherPage.rows().map(function (r) { return { s: r.student, ok: r.ok, b: r.build, g: TeacherPage.grade(r), d: r.data, why: r.why }; }); });
  console.log("teacher rows", JSON.stringify(t1r.map(function (r) { return [r.s, r.ok, r.b, r.g]; })));
  var ann = t1r.filter(function (r) { return r.s === "Ann Smith"; })[0], carl = t1r.filter(function (r) { return r.s === "Carl Diaz"; })[0], dee = t1r.filter(function (r) { return r.s === "Dee Park"; })[0];
  var anon = t1r.filter(function (r) { return r.s === ""; })[0];
  var want = ann && Math.round(10 * 100 * (Math.min(1, ann.d.minutes / 60) + Math.min(1, ann.d.won / 10) + Math.min(1, ann.d.answered / 50)) / 3) / 10;
  check(t1r.length === 4 && ann && ann.ok && ann.b === "BIO" && ann.g === want, "a pasted \"Name: code\" line: valid, named, grade " + (ann && ann.g) + " = 100 x (minutes/60 + won/10 + answered/50)/3");
  check(carl && !carl.ok && carl.g === null, "a tampered code (one character changed) is INVALID: " + (carl && carl.why));
  check(dee && dee.ok && dee.b === "VA" && dee.g === null, "a reading-game code on the Biology page: from another game, no grade");
  check(anon && anon.ok && anon.d.won === 5 && anon.g === Math.round(10 * 100 * (30 / 60 + 5 / 10 + 25 / 50) / 3) / 10, "a code with a word typed after it still reads (grade " + (anon && anon.g) + ")");
  await page.click('.tab[data-view="table"]');
  var shown = await page.evaluate(function () { return { cells: document.getElementById("table").innerText, counts: document.getElementById("summary").innerText }; });
  check(/INVALID/.test(shown.cells) && /Other game/.test(shown.cells) && /Investigation/.test(shown.cells) && /2\s*students with a valid code/.test(shown.counts) && /1 INVALID, 1 other game/.test(shown.counts), "the table shows the codes' status and the standards; the summary counts them: " + shown.counts.replace(/\n/g, " "));
  /* a newer code for Ann: kept, and noted */
  await openPaste(page);
  await page.fill("#paste", "Ann Smith: " + later);
  await page.click("#read");
  await page.waitForTimeout(200);
  var ann2 = await page.evaluate(function () { var r = TeacherPage.rows().filter(function (x) { return x.student === "Ann Smith"; }); return { n: r.length, won: r[0].data.won, count: r[0].count, notes: document.getElementById("notes").innerText }; });
  check(ann2.n === 1 && ann2.won === 12 && ann2.count === 2 && /2 different codes/.test(ann2.notes), "the same student twice: the newest code is kept, and noted");
  /* the goals change the grade */
  await page.evaluate(function () { document.getElementById("goals-box").open = true; });
  await page.fill('input[data-k="minutes"][data-f="w"]', "0");
  await page.fill('input[data-k="won"][data-f="w"]', "0");
  await page.fill('input[data-k="answered"][data-f="t"]', "140");
  await page.fill("#points", "20");
  await page.waitForTimeout(200);
  var g2 = await page.evaluate(function () { var r = TeacherPage.rows().filter(function (x) { return x.student === "Ann Smith"; })[0]; return { g: TeacherPage.grade(r), saved: localStorage.getItem("solTeacher.BIO.goals") }; });
  check(g2.g === 10 && /"points":20/.test(g2.saved), "goals: only questions counting, 70 of 140 answered, 20 points -> 10 (and the goals are remembered)");
  await page.reload({ waitUntil: "load" });
  var kept = await page.evaluate(function () { return document.getElementById("points").value + "/" + document.querySelector('input[data-k="answered"][data-f="t"]').value; });
  check(kept === "20/140", "the goals are still there after a reload");
  await page.evaluate(function () { document.getElementById("goals-box").open = true; });
  await page.click("#goals-reset");
  /* a Canvas "Download Submissions" zip */
  var zip = makeZip([
    { name: "smithann_123456_7890123_text.html", deflate: true, text: "<html><body><p>" + vaCode + "</p><p>thanks</p></body></html>" },
    { name: "jonesbob_LATE_234567_8901234_text.html", deflate: false, text: "<div><p>my code is&nbsp;" + other + "</p></div>" },
    { name: "leeemma_345678_9012345_text.html", deflate: true, text: "<p>I forgot</p>" }
  ]);
  var zpath = path.join(shots, "pg-submissions.zip");
  fs.writeFileSync(zpath, zip);
  await page.setInputFiles("#file", zpath);
  await page.waitForFunction(function () { return TeacherPage.rows().length >= 2; }, null, { timeout: 5000 }).catch(function () {});
  await page.waitForTimeout(300);
  var zr = await page.evaluate(function () { return { rows: TeacherPage.rows().map(function (r) { return [r.student, r.ok, r.data && r.data.won]; }), msg: document.getElementById("msg").textContent, notes: document.getElementById("notes").innerText }; });
  console.log("zip rows", JSON.stringify(zr));
  check(zr.rows.length === 2 && zr.rows.some(function (r) { return r[0] === "smithann" && r[1] && r[2] === 2; }) && zr.rows.some(function (r) { return r[0] === "jonesbob" && r[1] && r[2] === 5; }),
    "the Canvas zip: names from the file names (smithann, jonesbob), codes from the submissions (deflated and stored)");
  check(/Found 2 codes in 3 files/.test(zr.msg) && /leeemma: no code/.test(zr.notes), "a submission without a code is named in the notes: " + zr.msg);
  /* v5.15: the class list from Canvas's gradebook export: real names, who hasn't turned in, the import file */
  var gb = '"Student","ID","SIS User ID","SIS Login ID","Section","Quiz 1 (111)","SOL Lab Biology progress (98765)"\r\n' +
    '"    Points Possible","","","","","10","100"\r\n' +
    '"Smith, Ann","123456","S-1","asmith","Period 2","9",""\r\n"Jones, Bob","234567","S-2","bjones","Period 2","8",""\r\n' +
    '"Lee, Emma","345678","S-3","elee","Period 2","10",""\r\n"Student, Test","999999","","","Period 2","",""\r\n';
  var gpath = path.join(shots, "pg-gradebook-export.csv");
  fs.writeFileSync(gpath, gb);
  await page.setInputFiles("#file", gpath);
  await page.waitForTimeout(500);
  var rst = await page.evaluate(function () {
    TeacherPage.setView("cards");
    return { msg: document.getElementById("msg").textContent, roster: document.getElementById("roster-line").innerText, summary: document.getElementById("summary").innerText,
      cards: Array.prototype.map.call(document.querySelectorAll("#cards .card h3"), function (h) { return h.textContent; }), imp: TeacherPage.importCsv(), saved: !!localStorage.getItem("solTeacher.BIO.roster") };
  });
  check(/Class list: 3 students/.test(rst.msg) && /3 students/.test(rst.roster) && rst.saved, "the gradebook export is read as the class list (3 students; the Points Possible row and the Test Student left out) and kept: " + rst.msg);
  check(rst.cards.indexOf("Ann Smith") !== -1 && rst.cards.indexOf("Bob Jones") !== -1 && rst.cards.indexOf("Emma Lee") !== -1 && /1 not turned in: Emma Lee/.test(rst.summary),
    "the student cards use real names from the class list (matched by Canvas ID), with a card for the student who didn't turn in: " + rst.cards.join(", "));
  var impL = (rst.imp || "").replace(/^\ufeff/, "").split("\r\n");
  check(impL[0] === "Student,ID,SIS User ID,SIS Login ID,Section,SOL Lab Biology progress (98765)" && /^"Smith, Ann",123456,S-1,asmith,Period 2,\d/.test(impL[1]) && /^"Lee, Emma",345678,S-3,elee,Period 2,$/.test(impL[3]) && impL.length === 5,
    "the Canvas gradebook import file: the export's student columns, the assignment's column, a grade for each student with a code and blank for the rest: " + impL.slice(0, 4).join(" | "));
  await page.screenshot({ path: path.join(shots, "pg-10-teacher-cards.png"), fullPage: true });
  await page.click('.tab[data-view="board"]');
  var bd = await page.evaluate(function () { return Array.prototype.map.call(document.querySelectorAll("#board li"), function (li) { return li.querySelector(".nm").textContent + "=" + li.querySelector(".val").textContent; }); });
  check(bd.length === 2 && /^Bob J\.=5$/.test(bd[0]) && /^Ann S\.=2$/.test(bd[1]), "the leaderboard ranks by levels won with First name + last initial: " + bd.join(", "));
  await page.selectOption("#board-names", "nick");
  var bdn = await page.evaluate(function () { return Array.prototype.map.call(document.querySelectorAll("#board li .nm"), function (x) { return x.textContent; }); });
  await page.selectOption("#board-names", "none");
  var bdx = await page.evaluate(function () { return Array.prototype.map.call(document.querySelectorAll("#board li .nm"), function (x) { return x.textContent; }); });
  await page.selectOption("#board-names", "first");
  check(bdn.join() === "Player 1,Ann S" && bdx.join() === ",", "nicknames only (no nickname shows as Player 1), or no names: " + bdn.join(", "));
  await page.click("#board li .hide");
  var bdh = await page.evaluate(function () { return { n: document.querySelectorAll("#board li").length, un: !document.getElementById("board-unhide").hidden }; });
  check(bdh.n === 1 && bdh.un, "Hide leaves a student off the leaderboard, and Show hidden students brings them back");
  await page.click("#board-unhide");
  await page.click("#board-full");
  await page.screenshot({ path: path.join(shots, "pg-11-leaderboard.png") });
  await page.keyboard.press("Escape");
  await page.click('.tab[data-view="std"]');
  var sd = await page.evaluate(function () { return { text: document.getElementById("std").innerText, rows: document.querySelectorAll("#std table.std").length, csv: TeacherPage.stdCsv() }; });
  check(sd.rows === 1 && /Class total/.test(sd.text) && /BIO\.\d\.[a-f]/.test(sd.text) && /Students 80%\+/.test(sd.text) && /Below 60%/.test(sd.text) && /from before version 5\.15/.test(sd.text) && /(Ecology|Scientific investigation|Cells|Heredity) \(\d+ questions\)/.test(sd.text) && /Dynamic equilibria|Scientific investigation|Cell structure|Mechanisms of inheritance/.test(sd.text),
    "the standards report opens on the Class total page: every key idea with its text and the class's %, the students at 80%+ / 60-79% / below 60%, the units");
  await page.click('#std .tab[data-sp="students"]');
  var sd2 = await page.evaluate(function () { return document.getElementById("std").innerText; });
  check(/Ann Smith/.test(sd2) && /Class total/.test(sd2), "Student by student shows each student and the class total row");
  check(/^CLASS TOTAL/.test(sd.csv.replace(/^\ufeff/, "")) && /STUDENT BY STUDENT/.test(sd.csv) && /\nStudent,Nickname,BIO\./.test(sd.csv) && /Ecology/.test(sd.csv), "the standards CSV has the class total (with each key idea's unit), then student by student");
  await page.click('#std .tab[data-sp="class"]');
  await page.screenshot({ path: path.join(shots, "pg-12-standards.png"), fullPage: true });
  await page.click('.tab[data-view="table"]');
  /* more students for the picture, then CSV and Copy */
  var demo = [["Maria Lopez", 95, 14, 88, 70], ["Tyler Brooks", 22, 3, 18, 55], ["Priya Natarajan", 64, 10, 52, 81]].map(function (s, i) {
    return s[0] + ": " + C.encode("BIO", { first: "2026-09-0" + (i + 2), last: "2026-10-0" + (i + 3), days: 3 + i * 2, minutes: s[1], started: s[2] + 2, won: s[2], lost: 2, hiReached: s[2] + 1, hiWon: s[2], answered: s[3],
      right: Math.round(s[3] * s[4] / 100), wrong: 9, modes: 3, skills: { BIO8: { a: Math.round(s[3] * .3), r: Math.round(s[3] * .3 * s[4] / 100) }, BIO3: { a: Math.round(s[3] * .3), r: Math.round(s[3] * .25) }, BIO5: { a: Math.round(s[3] * .2), r: Math.round(s[3] * .15) }, BIO1: { a: Math.round(s[3] * .2), r: Math.round(s[3] * .1) } } },
      { nick: s[0].split(" ")[0], version: "6.4.0" });
  }).join("\n");
  await openPaste(page);
  await page.fill("#paste", demo + "\nCarl Diaz: " + tampered + "\nDee Park: " + odyCode);
  await page.click("#read");
  await page.waitForTimeout(200);
  await page.click('th[data-k="grade"]');
  await page.waitForTimeout(200);
  var order = await page.evaluate(function () { return Array.prototype.map.call(document.querySelectorAll("#table tbody tr td.name"), function (td) { return td.textContent; }); });
  check(order[0] === "Maria Lopez" && order.indexOf("Carl Diaz") > order.indexOf("Tyler Brooks"), "sorting by grade: highest first, codes without a grade last: " + order.join(", "));
  var csv = await page.evaluate(async function () { var a = document.getElementById("csv"); var t = await (await fetch(a.href)).text(); return { name: a.download, t: t, tsv: TeacherPage.table("\t") }; });
  check(/^﻿?Student,Nickname in code,Code status,Suggested grade/.test(csv.t) && csv.t.split("\r\n").length >= 9 && /Maria Lopez/.test(csv.t) && /\.csv$/.test(csv.name) && csv.tsv.split("\t").length > 30, "Download CSV: a CSV of every row (" + csv.name + "), and the tab-separated table for Copy");
  await page.click("#copy");
  await page.waitForTimeout(300);
  var cp = await page.evaluate(function () { return { msg: document.getElementById("msg").textContent, box: !document.getElementById("copybox").hidden }; });
  check(/Copied the table/.test(cp.msg) || cp.box, "Copy the table copies it, or shows it selected with Ctrl+C");
  /* v5.15.1: grading rounds — only the work since last time counts */
  page.on("dialog", function (d) { d.accept(); });
  var r0 = await page.evaluate(function () { var a = TeacherPage.rows().filter(function (r) { return r.userId === "123456"; })[0]; return { won: a.data.won, ans: a.data.answered, line: document.getElementById("round-line").innerText }; });
  check(/No codes submitted yet/.test(r0.line), "before any codes are submitted everything counts: " + r0.line.slice(0, 60));
  await page.click("#finish-round");
  await page.waitForTimeout(200);
  var newer = C.encode("BIO", { first: "2026-09-01", last: "2026-10-09", days: 4, minutes: 80, started: 20, won: 17, lost: 3, hiReached: 18, hiWon: 17, answered: r0.ans + 40, right: 30 + 8, wrong: 20, modes: 3,
    skills: { BIO8: { a: 20, r: 15 }, BIO1: { a: 20, r: 16 } }, std: { "BIO.8.a": { a: 50, r: 40 } }, badges: ["first-win", "q25"] }, { nick: "Ann S", version: "6.4.0", now: Date.now() + 120000, save: { night: 18 } });
  var gone = C.encode("BIO", { first: "2026-10-08", last: "2026-10-09", days: 1, minutes: 3, started: 1, won: 1, lost: 0, hiReached: 1, hiWon: 1, answered: 2, right: 2, wrong: 0, modes: 1 }, { nick: "", version: "6.4.0", now: Date.now() + 120000, save: { night: 2 } });
  var zip2 = makeZip([
    { name: "smithann_123456_7890999_text.html", deflate: true, text: "<p>" + newer + "</p>" },
    { name: "jonesbob_234567_8901999_text.html", deflate: true, text: "<p>" + gone + "</p>" }
  ]);
  var z2 = path.join(shots, "pg-submissions-week2.zip");
  fs.writeFileSync(z2, zip2);
  await page.setInputFiles("#file", z2);
  await page.waitForTimeout(600);
  var r1 = await page.evaluate(function () {
    var a = TeacherPage.rows().filter(function (r) { return r.userId === "123456"; })[0], b = TeacherPage.rows().filter(function (r) { return r.userId === "234567"; })[0];
    return { a: a.data, b: b.data, bReset: b.reset, line: document.getElementById("round-line").innerText, notes: document.getElementById("notes").innerText, imp: TeacherPage.importCsv(), undo: !document.getElementById("undo-round").hidden };
  });
  check(/Counting the work since/.test(r1.line) && r1.undo, "after Submit codes, the page counts the work since then, with Undo: return to the previous codes");
  check(r1.a.won === 15 && r1.a.answered === 40 && r1.a.minutes === 80 && r1.a.hiReached === 18 && r1.a.badges.join() === "q25",
    "the next round counts only the new work: 15 levels won, 40 questions, 80 minutes, 1 new badge (highest level stays 18): " + JSON.stringify({ won: r1.a.won, ans: r1.a.answered, min: r1.a.minutes, b: r1.a.badges }));
  check(r1.bReset && r1.b.won === 1 && /totals went down since last round/.test(r1.notes), "a student whose totals went down (new Chromebook) is counted from the new code alone, and noted");
  var g100 = /^"Smith, Ann",123456,S-1,asmith,Period 2,93\.3\r?$/m.test((r1.imp || "").replace(/^\ufeff/, ""));
  check(g100, "the Canvas import file carries this round's grade (Ann: 93.3 for 80 minutes, 15 levels, 40 of 50 questions): " + (r1.imp || "").split("\n").slice(0, 3).join(" | "));
  await page.click("#undo-round");
  await page.waitForTimeout(200);
  var r2 = await page.evaluate(function () { var a = TeacherPage.rows().filter(function (r) { return r.userId === "123456"; })[0]; return { won: a.data.won, line: document.getElementById("round-line").innerText }; });
  check(r2.won === 17 && /No codes submitted yet/.test(r2.line), "Undo goes back to the previous codes (everything counts again)");
  await page.evaluate(function () { document.getElementById("copybox").hidden = true; window.scrollTo(0, 0); });
  await page.screenshot({ path: path.join(shots, "pg-04-teacher-va.png"), fullPage: true });
  await page.emulateMedia({ media: "print" });
  await page.screenshot({ path: path.join(shots, "pg-05-teacher-print.png"), fullPage: true });
  await page.emulateMedia({ media: "screen" });
  var outside = served.filter(function (u) { return u.indexOf("http://127.0.0.1:" + tsrv.address().port + "/" + tfile) !== 0 && !/^blob:/.test(u); });
  check(outside.length === 0, "the teacher page loads nothing but itself" + (outside.length ? ": " + outside.join(", ") : ""));
  await page.close();

  tsrv.close();

  check(errors.length === 0, "no page errors" + (errors.length ? ": " + errors.slice(0, 6).join(" | ") : ""));
  await browser.close();
  console.log(fails.length ? "FAILED: " + fails.length + "\n  " + fails.join("\n  ") : "ALL OK");
  process.exit(fails.length ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(1); });
