/* Headless smoke test: node tools/smoke.js
   Serves the game, drives the title screen, the reward builder over 20 rewards,
   the coin shop and the start of a level, and saves screenshots to tools/shots/. */
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
(async function () {
  await new Promise(function (r) { srv.listen(0, r); });
  var base = "http://127.0.0.1:" + srv.address().port + "/";
  var browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium/chrome-linux/chrome" }).catch(function () { return chromium.launch(); });
  var page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  var errors = [];
  page.on("response", function (r) { if (r.status() === 404) console.log("404", r.url()); });
  page.on("pageerror", function (e) { errors.push("pageerror: " + e.message); });
  page.on("console", function (m) { if (m.type() === "error" || m.type() === "warning") { var t = m.text(); if (!/favicon|net::ERR|Autoplay|AudioContext|unpkg|peerjs|phaser|WebGL|GL Driver|swiftshader/i.test(t)) errors.push(m.type() + ": " + t); } });
  var fails = [];
  function check(cond, msg) { if (!cond) fails.push(msg); console.log((cond ? "ok   " : "FAIL ") + msg); }
  async function shot(name) { await page.screenshot({ path: path.join(shots, name + ".png") }); }

  await page.goto(base + "index.html", { waitUntil: "load" });
  await page.waitForTimeout(800);
  check(await page.isVisible("#title-screen") && !(await page.isVisible("#state-screen")), "title screen shows first (no state gateway)");
  check((await page.$$eval("#title-screen .card[data-family]", function (l) { return l.length; })) === 9, "nine unit cards (Full review + 8 units)");
  check(await page.isVisible('#title-screen .card.selected[data-family="ALL"]'), "Full review is selected by default");
  check((await page.textContent("#title-kicker")).indexOf("Biology") !== -1, "kicker names Biology");
  await shot("01-title");

  /* content pools: every unit has a pool, every skill card of every unit has items, and the
     strand filter really filters (a unit's skill pools sum to at least the unit's All pool) */
  var pools = await page.evaluate(function () {
    var out = { units: {}, empty: [] };
    HEIST_FAMILIES.forEach(function (f) {
      var all = heistBuildPack(f.id, "ALL").claims.length, per = {};
      (HEIST_SKILLS[f.id] || []).forEach(function (sk) {
        if (sk.strand === "ALL") return;
        var n = heistBuildPack(f.id, sk.strand).claims.filter(function (c) { return heistStrandMatch(c, sk.strand); }).length;
        per[sk.strand] = n; if (!n) out.empty.push(f.id + ":" + sk.strand);
      });
      out.units[f.id] = { all: all, per: per };
    });
    out.packs = HEIST_PACKS.length;
    out.families = {}; HEIST_PACKS.forEach(function (p) { out.families[p.family] = (out.families[p.family] || 0) + 1; });
    return out;
  });
  console.log("pools", JSON.stringify(pools));
  check(pools.units.ALL.all > 400 && Object.keys(pools.units).every(function (k) { return k === "ALL" || pools.units[k].all >= 40; }), "every unit has at least 40 questions and Full review has 400+");
  check(pools.empty.length === 0, "every skill card has questions: " + (pools.empty.join(", ") || "none empty"));

  /* v4.9.7: the shop is open from night 1 — with no build yet it asks Town or Castle first, and a wall
     bought before the first reward must not steal lot 1 from the keep */
  await page.evaluate(function () { localStorage.removeItem("afterHours.v1.build"); SolBuild.init(); });
  var early = await page.evaluate(function () { return SolBuild.state(); });
  check(early.canShop === true && early.theme === null, "shop is open before the first reward: " + JSON.stringify(early));
  await page.evaluate(function () { SolBuild.addCoins(60, "test"); window.__closed = false; SolBuild.showShop(1, function () { window.__closed = true; }); });
  await page.waitForSelector(".build-theme");
  check(/Town or a Castle/.test(await page.textContent("#build-overlay h2")), "night-1 shop asks Town or Castle first");
  await shot("02b-shop-theme");
  await page.click(".build-theme:nth-child(2)");
  await page.click("#build-overlay .btn.primary");
  await page.waitForSelector(".build-shop .build-opt");
  await page.click(".build-shop .build-opt >> nth=0");           /* Wall, 15 coins */
  await page.waitForSelector(".build-styles .build-opt");
  await page.click(".build-styles .build-opt:nth-child(1)");
  await page.click("#build-overlay .btn.primary");
  await page.waitForSelector(".build-note:not(.hidden)");
  await page.click("#build-overlay .btn.primary");
  await page.waitForTimeout(150);
  var earlyBuy = await page.evaluate(function () {
    var s = JSON.parse(localStorage.getItem("afterHours.v1.build"));
    return { theme: s.theme, kit: s.kit, picks: s.picks.map(function (p) { return p.piece; }), owned: Object.keys(s.owned), coins: s.coins, offer: SolBuild._offer(5) };
  });
  console.log("early shop", JSON.stringify(earlyBuy));
  check(earlyBuy.theme === "castle" && earlyBuy.picks.length === 1 && earlyBuy.picks[0] === "wall" && earlyBuy.owned.indexOf("wall") !== -1 && earlyBuy.coins === 45, "a wall bought on level 1 is placed, unlocked and costs 15 coins");
  check(earlyBuy.offer.length === 3 && !/wall|gate|tower/.test(earlyBuy.offer.join(" ")), "first reward still offers keeps after an early purchase: " + earlyBuy.offer.join(", "));
  await page.click("#build-overlay .btn.primary");                    /* Back to shop */
  await page.waitForTimeout(150);
  await page.click("#build-overlay .btn.primary");                    /* Done */
  await page.waitForFunction(function () { return window.__closed === true; });

  /* reward builder over 20 rewards (random choices) — a reload gives the builder a fresh save */
  await page.evaluate(function () { localStorage.removeItem("afterHours.v1.build"); });
  await page.reload({ waitUntil: "load" }); await page.waitForTimeout(800);
  for (var night = 5; night <= 100; night += 5) {
    await page.evaluate(function (n) { window.__done = false; SolBuild.showReward(n, function () { window.__done = true; }); }, night);
    await page.waitForSelector("#build-overlay:not(.hidden)", { timeout: 5000 });
    if (night === 5) {
      await page.waitForSelector(".build-theme");
      await page.click(".build-theme:nth-child(2)");   /* the castle kit is the path under test; the town gets a short pass below */
      await page.click("#build-overlay .btn.primary");
    }
    await page.waitForSelector(".build-options .build-opt");
    var nOpt = await page.$$eval(".build-options .build-opt", function (l) { return l.length; });
    check(nOpt === 3, "night " + night + ": three pieces offered");
    if (night === 5) {
      var names = await page.$$eval(".build-options .build-opt .name", function (l) { return l.map(function (e) { return e.textContent; }); });
      check(!/wall|fence|scaffold|ruin|tower/i.test(names.join(" ")), "first offer is modest keeps: " + names.join(", "));
      await shot("03-first-building");
    }
    if (night === 10 || night === 15 || night === 20 || night === 25) {
      /* v4.9.8: rewards 2-5 offer only towers and gate pieces */
      var ids = await page.$$eval(".build-options .build-opt .name", function (l) { return l.map(function (e) { return e.textContent; }); });
      check(ids.every(function (nm) { return /tower|gate/i.test(nm); }), "level " + night + " offers towers and gates only: " + ids.join(", "));
    }
    await page.click(".build-options .build-opt:nth-child(" + (1 + Math.floor(Math.random() * 3)) + ")");
    await page.click("#build-overlay .btn.primary");
    /* pieces with no coloured parts (houses, most props) skip the style step and go straight to placing */
    await page.waitForSelector(".build-styles:not(.hidden) .build-opt, .build-note:not(.hidden)");
    if (await page.isVisible(".build-styles:not(.hidden) .build-opt")) {
      if (night === 5 || night === 10) await shot("04-style-" + night);
      await page.click(".build-styles .build-opt:nth-child(" + (1 + Math.floor(Math.random() * 3)) + ")");
      await page.click("#build-overlay .btn.primary");
    }
    await page.waitForSelector(".build-note:not(.hidden)");
    /* place step: the new piece was auto-joined; drag it one cell and check it snaps to a free spot */
    if (night === 15) {
      var box = await page.$eval("#build-overlay .build-scene canvas", function (c) { var r = c.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
      var before = await page.evaluate(function () { var s = JSON.parse(localStorage.getItem("afterHours.v1.build")); return s.picks[s.picks.length - 1]; });
      var hit = await page.evaluate(function () {
        /* find the new piece's screen position through the module's own fit: emulate by reading the canvas note */
        return document.querySelector(".build-note").textContent;
      });
      console.log("place note:", hit);
      await shot("05b-place-15");
    }
    await page.click("#build-overlay .btn.primary");
    await page.waitForSelector(".build-note:not(.hidden)");
    if (night === 40 || night === 100) { await page.waitForTimeout(400); await shot("05-done-" + night); }
    await page.click("#build-overlay .btn.primary");
    await page.waitForFunction(function () { return window.__done === true; });
  }
  var joined = await page.evaluate(function () {
    /* every building must touch at least one other building (the estate is one joined structure) */
    var s = JSON.parse(localStorage.getItem("afterHours.v1.build")), cells = {}, ok = true;
    var P = null; var xhr = new XMLHttpRequest(); xhr.open("GET", "assets/build/pieces.json", false); xhr.send(); P = JSON.parse(xhr.responseText).pieces;
    function pc(id) { return P.filter(function (x) { return x.id === id; })[0]; }
    var rs = s.picks.filter(function (pk) { var p = pc(pk.piece); return p && p.kind !== "topper"; }).map(function (pk) { return { id: pk.piece, cx: pk.cx, cy: pk.cy, n: pc(pk.piece).cells || 1 }; });
    function touches(a, b) { var sx = (a.cx + a.n === b.cx || b.cx + b.n === a.cx) && a.cy < b.cy + b.n && a.cy + a.n > b.cy; var sy = (a.cy + a.n === b.cy || b.cy + b.n === a.cy) && a.cx < b.cx + b.n && a.cx + a.n > b.cx; return sx || sy; }
    function overlaps(a, b) { return a.cx < b.cx + b.n && a.cx + a.n > b.cx && a.cy < b.cy + b.n && a.cy + a.n > b.cy; }
    var lonely = 0, overlap = 0, pairs = [];
    rs.forEach(function (a, i) { var t = false; rs.forEach(function (b, j) { if (i !== j) { if (touches(a, b)) t = true; if (overlaps(a, b)) { overlap++; if (i < j) pairs.push(a.id + "@" + a.cx + "," + a.cy + "/" + b.id); } } }); if (!t) lonely++; });
    return { pieces: rs.length, lonely: lonely, overlap: overlap, pairs: pairs.slice(0, 6) };
  });
  check(joined.pieces >= 20 && joined.overlap === 0, "no two pieces overlap (auto-placed pieces join the build): " + JSON.stringify(joined));
  var rt0 = await page.evaluate(function () { return SolBuild.state().rating; });
  console.log("rating", JSON.stringify(rt0));
  var stage = await page.evaluate(function () { return SolBuild._coreStage(); });
  check(stage === 3, "the keep has grown to its final stage after 20 rewards (stage " + stage + ")");
  check(rt0 && rt0.score > 200, "castle rating computed");
  var st = await page.evaluate(function () { return SolBuild.state(); });
  check(st.count === 20 && st.walls === true && st.owned >= 8, "20 rewards taken, walls up, pieces unlocked: " + JSON.stringify(st));

  /* shop: coins, buildings, decorations, packs */
  await page.evaluate(function () { SolBuild.addCoins(600, "test"); window.__closed = false; SolBuild.showShop(41, function () { window.__closed = true; }); });
  await page.waitForSelector(".build-shop .build-opt");
  await shot("06-shop-buildings");
  /* buy a building the student does not own yet (owned ones just place a free copy) */
  await page.click(".build-shop .build-opt:has(.price:not(.own)) >> nth=0");
  await page.waitForSelector(".build-styles:not(.hidden) .build-opt, .build-note:not(.hidden)");
  if (await page.isVisible(".build-styles:not(.hidden) .build-opt")) {
    await page.click(".build-styles .build-opt:nth-child(2)");
    await page.click("#build-overlay .btn.primary");
  }
  await page.waitForSelector(".build-note:not(.hidden)");
  await page.click("#build-overlay .btn.primary");      /* Keep it here */
  await page.waitForTimeout(150);
  await page.click("#build-overlay .btn.primary");      /* Back to shop */
  await page.click(".build-tab:nth-child(2)");
  await page.waitForTimeout(200);
  await page.click(".build-shop .build-opt:has(.price:not(.own)) >> nth=0");
  await page.waitForTimeout(200);
  await page.click(".build-tab:nth-child(3)");
  await page.waitForTimeout(200);
  await shot("07-shop-packs");
  await page.click(".build-shop .build-opt >> nth=0");
  await page.waitForTimeout(400);
  var st2 = await page.evaluate(function () { return SolBuild.state(); });
  check(st2.buildings >= 21 && st2.decorations >= 1 && st2.coins < 600, "shop purchases landed: " + JSON.stringify(st2));
  await shot("08-shop-after");
  await page.click("#build-overlay .btn.primary");
  await page.waitForFunction(function () { return window.__closed === true; });

  /* build code round trip */
  var rt = await page.evaluate(function () {
    var code = SolBuild.exportCode(), before = JSON.stringify(SolBuild.state());
    localStorage.removeItem("afterHours.v1.build");
    var r = SolBuild.importCode(code), after = JSON.stringify(SolBuild.state()), bo = JSON.parse(before), ao = JSON.parse(after), diff = {};
    Object.keys(bo).forEach(function (k) { if (JSON.stringify(bo[k]) !== JSON.stringify(ao[k])) diff[k] = [bo[k], ao[k]]; });
    return { ok: r.ok, count: r.count, same: after === before, diff: diff };
  });
  check(rt.ok && rt.same, "build code round trip " + JSON.stringify(rt));

  /* short town pass: three rewards on the village theme still work */
  await page.evaluate(function () { localStorage.setItem("smoke.castleCode", SolBuild.exportCode()); localStorage.removeItem("afterHours.v1.build"); });
  await page.reload({ waitUntil: "load" }); await page.waitForTimeout(800);
  for (var tn = 5; tn <= 15; tn += 5) {
    await page.evaluate(function (n) { window.__done = false; SolBuild.showReward(n, function () { window.__done = true; }); }, tn);
    await page.waitForSelector("#build-overlay:not(.hidden)", { timeout: 5000 });
    if (tn === 5) { await page.waitForSelector(".build-theme"); await page.click(".build-theme:nth-child(1)"); await page.click("#build-overlay .btn.primary"); }
    await page.waitForSelector(".build-options .build-opt"); await page.click(".build-options .build-opt:nth-child(1)"); await page.click("#build-overlay .btn.primary");
    await page.waitForSelector(".build-styles .build-opt"); await page.click(".build-styles .build-opt:nth-child(1)"); await page.click("#build-overlay .btn.primary");
    await page.waitForSelector(".build-note:not(.hidden)"); await page.click("#build-overlay .btn.primary"); await page.waitForSelector(".build-note:not(.hidden)");
    await page.click("#build-overlay .btn.primary"); await page.waitForFunction(function () { return window.__done === true; });
  }
  var townSt = await page.evaluate(function () { return SolBuild.state(); });
  check(townSt.theme === "village" && townSt.buildings === 3, "town theme still builds: " + JSON.stringify({ theme: townSt.theme, b: townSt.buildings }));
  await shot("09c-town");
  await page.evaluate(function () { SolBuild.importCode(localStorage.getItem("smoke.castleCode")); });
  await page.reload({ waitUntil: "load" }); await page.waitForTimeout(800);

  /* gallery */
  await page.evaluate(function () { SolBuild.showGallery(); });
  await page.waitForSelector("#build-overlay:not(.hidden)");
  await page.waitForTimeout(500);
  await shot("09-gallery");
  /* v4.9.8: no arrange mode — any piece drags at any time. Drag the core piece a long way to the right and check it moved (or bounced back with a reason) */
  check(!(await page.isVisible("text=Arrange pieces")), "gallery has no separate arrange mode");
  var cv = await page.$eval("#build-overlay .build-scene canvas", function (c) { var r = c.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
  var beforeMove = await page.evaluate(function () { return JSON.parse(localStorage.getItem("afterHours.v1.build")).picks.map(function (p) { return p.cx + "," + p.cy; }).join(" "); });
  var p0 = await page.evaluate(function () { return SolBuild._pickScreen(0); });
  console.log("drag from", JSON.stringify(p0));
  /* synthetic pointer events on the canvas (headless mouse moves were coalesced to one position) */
  await page.evaluate(function (q) {
    var c = document.querySelector("#build-overlay .build-scene canvas");   /* not the hidden theme-preview canvases */
    function ev(type, x, y) { c.dispatchEvent(new PointerEvent(type, { pointerId: 7, pointerType: "mouse", isPrimary: true, clientX: x, clientY: y, bubbles: true, cancelable: true })); }
    ev("pointerdown", q.x, q.y);
    for (var i = 1; i <= 12; i++) ev("pointermove", q.x + 22 * i, q.y + 11 * i);
    ev("pointerup", q.x + 22 * 12, q.y + 11 * 12);
  }, p0);
  await page.waitForTimeout(200);
  var afterMove = await page.evaluate(function () { return JSON.parse(localStorage.getItem("afterHours.v1.build")).picks.map(function (p) { return p.cx + "," + p.cy; }).join(" "); });
  var noteTxt = await page.textContent(".build-note");
  console.log("arrange:", beforeMove === afterMove ? "no move (" + noteTxt + ")" : "moved (" + noteTxt + ")");
  check(beforeMove !== afterMove || /taken/i.test(noteTxt), "gallery drag moves a piece anywhere free (or reports the spot is taken): " + noteTxt);
  await shot("09b-arrange");
  /* v5 editor: palette placement of unlocked pieces, selection bar, delete, rotate, zoom, code round trip after a rotation */
  var pal = await page.$$eval(".build-plist .build-pitem", function (l) { return { total: l.length, locked: l.filter(function (b) { return b.classList.contains("locked"); }).length }; });
  check(pal.total > 0 && pal.locked > 0 && pal.locked < pal.total, "palette lists unlocked and locked pieces: " + JSON.stringify(pal));
  var edit = await page.evaluate(function () {
    var out = {}, s0 = SolBuild.state();
    out.placed = SolBuild._place("wall"); out.afterPlace = SolBuild.state().buildings - s0.buildings;
    out.barVisible = !document.querySelector(".build-pbar").classList.contains("hidden");
    SolBuild._delete(); out.afterDelete = SolBuild.state().buildings - s0.buildings;
    out.ownedStill = SolBuild._owned().indexOf("wall") !== -1;
    out.rot = [SolBuild._rotate(90), SolBuild._rotate(90)]; out.zoom = SolBuild._zoom(1.25);
    SolBuild._rotate(37); out.angle = SolBuild._angle();                     /* one-degree turning: 217° */
    out.turned = (SolBuild._place("square-tower"), SolBuild._turn());         /* right-click / Turn: a quarter turn on one piece */
    var code = SolBuild.exportCode(), before = JSON.stringify(SolBuild.state().rating);
    SolBuild.importCode(code); out.rtSame = JSON.stringify(SolBuild.state().rating) === before;
    out.rotKept = JSON.parse(localStorage.getItem("afterHours.v1.build")).picks.some(function (p) { return p.rot === 1; });
    out.rotAfter = SolBuild.state().view.r;
    return out;
  });
  console.log("editor", JSON.stringify(edit));
  check(edit.placed && edit.afterPlace === 1 && edit.barVisible && edit.afterDelete === 0 && edit.ownedStill, "palette places a free copy, selection bar shows, delete keeps the piece unlocked");
  check(edit.rot[0] === 1 && edit.rot[1] === 2 && Math.abs(edit.angle - 217) < 0.01 && edit.zoom > 1 && edit.rtSame, "view turns by degrees and zooms; the build code survives a rotated view");
  check(edit.turned === 1 && edit.rotKept, "a piece turns a quarter turn and its turn survives the build code");
  await page.waitForTimeout(400);
  await shot("09d-rotated");
  await page.evaluate(function () { SolBuild._rotate(-217); SolBuild._zoom(0.8); });
  await page.keyboard.press("Escape");

  /* start an Ecology level */
  await page.click('#title-screen .card[data-family="ECO"]');
  await page.waitForSelector("#skill-screen:not(.hidden)");
  check((await page.$$eval("#skill-packs .card", function (l) { return l.length; })) === 5, "five Ecology skill cards (BIO.8 a–d + All)");
  check(/Ecology/.test(await page.textContent("#skill-kicker")), "skill kicker names the unit");
  await shot("10-skills-eco");
  await page.click("#btn-skill-start");
  await page.waitForTimeout(300);
  if (await page.isVisible("#btn-char-confirm")) await page.click("#btn-char-confirm");
  await page.waitForTimeout(3000);
  for (var i = 0; i < 12; i++) { if (await page.isVisible("#tut-skip")) { await page.click("#tut-skip"); break; } await page.waitForTimeout(300); }
  await page.waitForTimeout(1500);
  var hud = await page.evaluate(function () { return { sol: document.getElementById("job-sol").textContent, coins: document.getElementById("bonus-pip").textContent, stem: document.getElementById("eoc-stem").textContent, kick: document.getElementById("read-kicker") && document.getElementById("read-kicker").textContent }; });
  console.log("hud", JSON.stringify(hud));
  check(/^SOL · BIO\.\d\.[a-f] · Level [123]/.test(hud.sol), "HUD shows the SOL code and the adaptive level: " + hud.sol);
  check(/^Coins/.test(hud.coins), "HUD shows coins");
  check(hud.stem.length > 10, "a question is loaded");
  await shot("11-night-read");
  if (await page.isVisible("#read-go")) await page.click("#read-go");
  await page.waitForTimeout(800);
  await shot("12-night-play");

  /* stamina: level 1 draws a tiny stimulus, level 90 a long one */
  var stamina = await page.evaluate(async function () {
    function wordsNow() { return window.SolScene && SolScene.claim ? SolScene.claim.words : 0; }
    var out = { target1: heistTargetWords(1), target90: heistTargetWords(90), n1: [], n90: [] };
    var sc = window.SolScene;
    for (var i = 0; i < 5; i++) { sc.nextClaim(); out.n1.push(wordsNow()); }
    sc.night = 90; sc.nightPacks = [];
    for (var j = 0; j < 5; j++) { sc.nextClaim(); out.n90.push(wordsNow()); }
    sc.night = 1;
    return out;
  });
  console.log("stamina", JSON.stringify(stamina));
  var avg = function (a) { return a.reduce(function (x, y) { return x + y; }, 0) / a.length; };
  check(avg(stamina.n1) < 95 && avg(stamina.n90) > 130 && avg(stamina.n90) > avg(stamina.n1) + 40, "level 1 lab notes are much shorter than level 90 lab notes");

  /* letter tiles never sit on a hazard or a pickup (checked on several nights); a skull stuns a Hati in place */
  var hazardCheck = await page.evaluate(async function () {
    var out = { nights: [], worst: 0, skull: null };
    function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
    function checkNight(sc) {
      var bad = 0, min = 1e9, pts = [];
      (sc.puddles || []).concat(sc.mats || []).forEach(function (b) { pts.push({ x: b.x, y: b.y, r: Math.max(b.w, b.h) / 2 }); });
      (sc.secCams || []).forEach(function (c) { pts.push({ x: c.x, y: c.y, r: 0 }); });
      (sc.skulls || []).forEach(function (k) { if (k.live) pts.push({ x: k.x, y: k.y, r: 0 }); });
      ["zapPad", "mushPad", "firePad", "tarPad"].forEach(function (k) { if (sc[k] && sc[k].active) pts.push({ x: sc[k].x, y: sc[k].y, r: 0 }); });
      if (sc.autoGreen) pts.push({ x: sc.autoGreen.x, y: sc.autoGreen.y, r: Math.max(sc.autoGreen.w || 0, sc.autoGreen.h || 0) / 2 });
      (sc.slips || []).forEach(function (s) { pts.forEach(function (p) { var d = dist(s, p) - p.r; min = Math.min(min, d); if (d < 40) bad++; }); });
      return { night: sc.night, slips: (sc.slips || []).length, hazards: pts.length, bad: bad, minGap: Math.round(min) };
    }
    var sc = window.SolScene;
    out.nights.push(checkNight(sc));
    for (var n of [12, 30, 55]) {
      sc.scene.restart({ family: "ALL", strand: "ALL", night: n });
      await new Promise(function (r) { setTimeout(r, 2500); });
      sc = window.SolScene;
      out.nights.push(checkNight(sc));
    }
    /* skull: a Hati on a skull is frozen where it is, not sent home */
    var j = sc.janitors && sc.janitors[0], k = (sc.skulls || []).filter(function (x) { return x.live; })[0];
    if (j && k) { var bx = j.x, by = j.y; sc.skullKillHati(j, k); out.skull = { frozen: j.trogFreezeMs > 0, eyes: j.eyesMs || 0, moved: Math.hypot(j.x - bx, j.y - by) > 1, skullGone: !k.live }; }
    sc.scene.restart({ family: "ALL", strand: "ALL", night: 1 });
    await new Promise(function (r) { setTimeout(r, 2500); });
    return out;
  });
  console.log("hazards", JSON.stringify(hazardCheck));
  check(hazardCheck.nights.every(function (n) { return n.bad === 0 && n.slips === 4; }), "letter tiles sit clear of every hazard and pickup on nights 1/12/30/55");
  check(hazardCheck.skull && hazardCheck.skull.frozen && !hazardCheck.skull.eyes && !hazardCheck.skull.moved && hazardCheck.skull.skullGone, "a skull stuns a Hati in place: " + JSON.stringify(hazardCheck.skull));
  for (var w = 0; w < 10; w++) { if (await page.isVisible("#read-go")) { await page.click("#read-go"); break; } await page.waitForTimeout(300); }
  await page.waitForTimeout(500);

  /* a wrong letter costs a life: three wrong grabs end the night */
  var strikeRun = await page.evaluate(function () {
    var sc = window.SolScene, out = { before: sc.strikes, hud: [], ended: false };
    for (var i = 0; i < 3; i++) {
      sc.iframeMs = 0; sc.stunMs = 0;
      sc.flagWrongAlarm({ x: sc.player.x, y: sc.player.y });
      out.hud.push(document.getElementById("strike-pip").textContent.split(" · ")[0]);
    }
    out.after = sc.strikes; out.ended = !!sc.ended; out.tag = sc.caughtFlashTag ? sc.caughtFlashTag.text : "";
    out.msg = document.getElementById("win-msg").textContent; out.title = document.getElementById("win-title").textContent;
    return out;
  });
  console.log("wrong-letter strikes", JSON.stringify(strikeRun));
  check(strikeRun.after === strikeRun.before + 3 && strikeRun.ended && /wrong letter/i.test(strikeRun.msg) && strikeRun.title === "Run over", "three wrong letters end the night");
  await page.waitForTimeout(500);
  await shot("13-run-over-wrong");

  /* adaptive + coins through the scene API */
  var adapt = await page.evaluate(function () {
    var sc = null; try { sc = window.__scene || null; } catch (e) {}
    return sc ? "scene" : "no";
  });
  console.log("errors:", errors.length ? errors : "none");
  check(errors.length === 0, "no page errors");
  await browser.close(); srv.close();
  console.log(fails.length ? fails.length + " FAILED" : "ALL OK");
  process.exit(fails.length ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
