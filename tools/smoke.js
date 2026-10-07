/* Headless smoke test: node tools/smoke.js
   Serves the game, drives the title screen, the reward builder over 20 rewards,
   the coin shop, a level, the realms, Fenrir, the perks and the shooter levels, and saves
   screenshots to tools/shots/. */
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
  /* v5.5: WebGL through SwiftShader so the builder's 3D view runs headless */
  var glArgs = { args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] };
  var browser = await chromium.launch(Object.assign({ executablePath: "/opt/pw-browsers/chromium/chrome-linux/chrome" }, glArgs)).catch(function () { return chromium.launch(glArgs); });
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
  check(await page.isVisible("#title-screen h1.logo img") && /v6\./.test(await page.textContent("#title-screen .ver")), "logo and version label on the title screen");
  await shot("01-title");

  /* content pools: every unit has a pool, every skill card of every unit has items, and the
     strand filter really filters */
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
  /* v5.7.9: dragging a town piece holds the view still (the ground used to slide under a lone house), the piece
     lands where it is let go, and Turn mirrors a town picture (two ways to face) */
  await page.evaluate(function () { SolBuild.showGallery(); });
  await page.waitForSelector("#build-overlay:not(.hidden)"); await page.waitForTimeout(600);
  var tA = await page.evaluate(function () { return { pk: SolBuild._pickScreen(0), g: SolBuild._probe(0, 0, 0) }; });
  await page.mouse.move(tA.pk.x, tA.pk.y - 30); await page.mouse.down();
  for (var tk = 1; tk <= 8; tk++) { await page.mouse.move(tA.pk.x - tk * 22, tA.pk.y - 30 + tk * 11); await page.waitForTimeout(25); }
  var tMid = await page.evaluate(function () { return SolBuild._probe(0, 0, 0); });
  await page.mouse.up(); await page.waitForTimeout(150);
  var tB = await page.evaluate(function () { var o = { pk: SolBuild._pickScreen(0) }; SolBuild._select(0); o.r1 = SolBuild._turn(); o.note = document.querySelector(".build-note").textContent; o.r2 = SolBuild._turn(); return o; });
  var tMoved = tB.pk.cx !== tA.pk.cx || tB.pk.cy !== tA.pk.cy;
  check(Math.abs(tMid.x2 - tA.g.x2) < 1 && Math.abs(tMid.y2 - tA.g.y2) < 1, "town: the ground holds still while a piece is dragged");
  check(!tMoved || Math.hypot(tB.pk.x - (tA.pk.x - 176), tB.pk.y - (tA.pk.y + 88)) < 60, "town: a dragged piece lands where it is let go: " + JSON.stringify({ moved: tMoved, from: [Math.round(tA.pk.x), Math.round(tA.pk.y)], to: [Math.round(tB.pk.x), Math.round(tB.pk.y)] }));
  check(tB.r1 === 1 && tB.r2 === 0 && /faces the other way/.test(tB.note), "town: Turn flips a town building to face the other way and back: " + JSON.stringify({ r1: tB.r1, r2: tB.r2 }));
  await page.evaluate(function () { SolBuild.close(); });
  await page.evaluate(function () { SolBuild.importCode(localStorage.getItem("smoke.castleCode")); });
  await page.reload({ waitUntil: "load" }); await page.waitForTimeout(800);

  /* gallery */
  await page.evaluate(function () { SolBuild.showGallery(); });
  await page.waitForSelector("#build-overlay:not(.hidden)");
  await page.waitForTimeout(2500);
  await shot("09-gallery");
  /* v5.5: the castle draws in 3D, lined up with the 2D layer's projection, and every model it asked for arrived */
  var td = await page.evaluate(function () { return { probe: SolBuild._probe(3, 2, 1), loads: SolBuild._loads3d() }; });
  console.log("3d", JSON.stringify(td));
  check(td.probe && td.probe.use3d && td.probe.p3 && Math.abs(td.probe.p3.x - td.probe.x2) < 0.5 && Math.abs(td.probe.p3.y - td.probe.y2) < 0.5, "the 3D view is on and its projection matches the 2D layer");
  check(td.loads && td.loads.models === "ok" && td.loads.failed === 0 && td.loads.loaded === td.loads.total && td.loads.total > 3, "every 3D model the castle needs loaded: " + JSON.stringify(td.loads));
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
  await page.waitForTimeout(1200);
  await shot("09d-rotated");
  var td2 = await page.evaluate(function () { return { probe: SolBuild._probe(-2, 4, 0), loads: SolBuild._loads3d() }; });
  check(td2.probe.use3d && Math.abs(td2.probe.p3.x - td2.probe.x2) < 0.5 && Math.abs(td2.probe.p3.y - td2.probe.y2) < 0.5 && td2.loads.failed === 0, "the 3D view still lines up at 217° after placing and turning pieces");
  await page.evaluate(function () { SolBuild._rotate(-217); SolBuild._zoom(0.8); });
  await page.keyboard.press("Escape");

  /* start an Ecology level */
  await page.click('#title-screen .card[data-family="ECO"]');
  /* v5.8.3: the game mode screen comes after the unit: all modes, or one mode on every level */
  await page.waitForSelector("#mode-screen:not(.hidden)");
  var gm = await page.evaluate(function () {
    return { cards: Array.prototype.map.call(document.querySelectorAll("#mode-packs .card"), function (c) { return c.getAttribute("data-gamemode"); }).join(","),
      sel: (document.querySelector("#mode-packs .card.selected") || {}).getAttribute && document.querySelector("#mode-packs .card.selected").getAttribute("data-gamemode"),
      skill: !document.getElementById("skill-screen").classList.contains("hidden"), kick: document.getElementById("mode-kicker").textContent };
  });
  await shot("10a-game-mode");
  await page.click('#mode-packs .card[data-gamemode="raid"]');
  await page.waitForSelector("#skill-screen:not(.hidden)");
  gm.one = await page.evaluate(function () { return { kick: document.getElementById("skill-kicker").textContent, l1: (SolModes.modeFor(1) || {}).id, l10: (SolModes.modeFor(10) || {}).id, saved: localStorage.getItem("afterHours.v1.gameMode"), modeHidden: document.getElementById("mode-screen").classList.contains("hidden") }; });
  await page.click("#btn-skill-back");
  await page.waitForSelector("#mode-screen:not(.hidden)");
  gm.backSel = await page.evaluate(function () { return document.querySelector("#mode-packs .card.selected").getAttribute("data-gamemode"); });
  await page.click('#mode-packs .card[data-gamemode="maze"]');
  await page.waitForSelector("#skill-screen:not(.hidden)");
  gm.maze = await page.evaluate(function () { return [2, 4, 10].map(function (n) { return SolModes.modeFor(n) ? "x" : "-"; }).join(""); });
  await page.waitForTimeout(500);   /* a button ignores a second tap within 450 ms */
  await page.click("#btn-skill-back"); await page.waitForSelector("#mode-screen:not(.hidden)");
  await page.click("#btn-mode-back"); await page.waitForTimeout(300);
  gm.backToUnits = await page.isVisible('#title-screen .card[data-family="ECO"]') && !(await page.isVisible("#mode-screen"));
  await page.click('#title-screen .card[data-family="ECO"]');
  await page.waitForSelector("#mode-screen:not(.hidden)");
  await page.click('#mode-packs .card[data-gamemode="ALL"]');
  await page.waitForSelector("#skill-screen:not(.hidden)");
  gm.all = await page.evaluate(function () { return (SolModes.modeFor(2) || {}).id + "," + (SolModes.modeFor(1) ? "x" : "-"); });
  check(gm.cards === "ALL,maze,raid,rocks,sky,ring,worms" && !gm.skill && /Ecology/.test(gm.kick), "after the unit, a game mode screen: all modes, the maze, or one of the five shooters (Root Worms too): " + JSON.stringify(gm));
  check(gm.one.l1 === "raid" && gm.one.l10 === "raid" && /Eagle Swoop/.test(gm.one.kick) && gm.one.saved === "raid" && gm.one.modeHidden && gm.backSel === "raid", "one mode: every level (a boss level too) is that mode, the skill screen names it, and it is remembered: " + JSON.stringify(gm.one));
  check(gm.maze === "---" && gm.backToUnits && gm.all === "raid,-", "maze only: no shooter levels; Back goes skill → mode → units; All modes brings the rotation back: " + JSON.stringify(gm));
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
    for (var n of [13, 30, 55]) {
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
  check(hazardCheck.nights.every(function (n) { return n.bad === 0 && n.slips === 4; }), "letter tiles sit clear of every hazard and pickup on nights 1/13/30/55");
  check(hazardCheck.skull && hazardCheck.skull.frozen && !hazardCheck.skull.eyes && !hazardCheck.skull.moved && hazardCheck.skull.skullGone, "a skull stuns a Hati in place: " + JSON.stringify(hazardCheck.skull));
  for (var w = 0; w < 10; w++) { if (await page.isVisible("#read-go")) { await page.click("#read-go"); break; } await page.waitForTimeout(300); }
  await page.waitForTimeout(500);

  /* a wrong letter costs a life: three wrong grabs end the night */
  var strikeRun = await page.evaluate(function () {
    var sc = window.SolScene, out = { before: sc.strikes, hud: [], ended: false };
    sc.spareLives = 0; sc.perks = {};   /* v5.6: no castle perks (a Blessing 1UP) in this check */
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
  /* v5.6: ten realms of ten levels, one creature each, Fenrir on every tenth level, castle perks */
  async function realmLevel(n) {
    await page.evaluate(function (n) { SolScene.scene.restart({ family: "ALL", strand: "ALL", night: n }); }, n);
    await page.waitForTimeout(2500);
  }
  var realmSeen = [];
  var wantFoe = { 11: "raven", 21: "troll", 31: "vent", 41: "serpent", 51: "boar", 61: "wisp", 71: "draugr", 81: "valkyrie" };
  for (var rn of [1, 11, 21, 31, 41, 51, 61, 71, 81, 91]) {
    await realmLevel(rn);
    realmSeen.push(await page.evaluate(function () { var s = SolScene; return { n: s.night, realm: s.realm && s.realm.name, flag: document.getElementById("round-flag").textContent, foes: (s.foes || []).map(function (f) { return f.kind; }), fenrir: !!s.fenrir }; }));
    if (rn === 31) await shot("15-realm-muspelheim");
  }
  console.log("realms", JSON.stringify(realmSeen));
  check(realmSeen.map(function (r) { return r.realm; }).join(",") === "Midgard,Niflheim,Jotunheim,Muspelheim,Svartalfheim,Vanaheim,Alfheim,Helheim,Asgard,Ragnarok", "ten realms of ten levels, named on the HUD");
  check(realmSeen.every(function (r) { return r.flag.indexOf(r.realm) !== -1 && !r.fenrir; }), "the HUD names the realm; no Fenrir on ordinary levels");
  check(realmSeen[0].foes.length === 0 && realmSeen.slice(1, 9).every(function (r) { return r.foes.length && r.foes.every(function (k) { return k === wantFoe[r.n]; }); }), "each realm brings its own creature (none in Midgard)");
  check(realmSeen[9].foes.length >= 3, "Ragnarok mixes creatures from the other realms");
  /* every creature that hurts costs a life, with its name on the CAUGHT tag */
  var foeHits = [];
  for (var fk of [[21, "troll"], [31, "vent"], [41, "serpent"], [51, "boar"], [71, "draugr"], [81, "valkyrie"]]) {
    await realmLevel(fk[0]);
    foeHits.push(await page.evaluate(function (kind) {
      var s = SolScene, f = s.foes.filter(function (q) { return q.kind === kind; })[0], sp = s.slips[0], st = s.strikes;
      s.spareLives = 0; s.iframeMs = 0; s.justStruck = false; s.perks = {};
      s.lockerPowerMs = 0; s.dogModeMs = 0; s.pineappleMs = 0; s.forcefieldMs = 0; s.superPacMs = 0;
      if (kind === "vent") f.phase = f.idle + f.warn + 300;
      if (kind === "valkyrie") { s.player.body.reset(sp.x, sp.y); f.state = "fly"; f.horiz = true; f.line = sp.y; f.pos = sp.x - 20; f.dir = 1; }
      else s.player.body.reset(f.x, f.y);
      s.tickFoes(16);
      return kind + ":" + (s.strikes - st) + ":" + (s.caughtFlashTag ? s.caughtFlashTag.text : "");
    }, fk[1]));
  }
  console.log("creature catches", JSON.stringify(foeHits));
  check(foeHits.every(function (h) { return /:1:CAUGHT BY /.test(h); }), "trolls, vents, the serpent, boars, draugr and valkyries each catch Sol");
  await realmLevel(11);
  var ravenCall = await page.evaluate(function () {
    var s = SolScene, f = s.foes[0], sp = s.slips[0];
    s.player.body.reset(sp.x, sp.y); s.inDarkZone = false; f.x = sp.x + 30; f.y = sp.y; f.tx = f.x; f.ty = f.y; f.cd = 0;
    s.janitors.forEach(function (j) { j.chasing = false; });
    /* v5.7: a letter tile can sit in a dark zone, where ravens cannot see Sol; test in the light */
    var M = SolRealms._K.maze(), dz = M.darkZones; M.darkZones = [];
    s.tickFoes(16);
    M.darkZones = dz;
    return s.janitors.filter(function (j) { return j.chasing; }).length;
  });
  check(ravenCall >= 1, "a raven that spots Sol sends a wolf after her");
  await realmLevel(71);
  var draugrLook = await page.evaluate(function () {
    var s = SolScene, f = s.foes[0], K = SolRealms._K, M = K.maze(), i, x0, y0, o = {}, pair = null;
    /* the draugr on a junction, Sol two junctions away down a clear hall */
    for (i = 0; i < M.nodes.length && !pair; i++) {
      var a = M.nodes[i]; if (a.id.charAt(0) !== "j" || K.inSafeZone(a.x, a.y)) continue;
      var n1 = (M.neigh[String(i)] || []).filter(function (x) { return x.dir === "E"; })[0]; if (!n1) continue;
      var n2 = (M.neigh[String(n1.i)] || []).filter(function (x) { return x.dir === "E"; })[0]; if (!n2) continue;
      if (!K.inSafeZone(n2.x, n2.y) && !K.losBlocked(a.x, a.y, n2.x, n2.y)) pair = { a: a, b: n2 };
    }
    f.x = pair.b.x; f.y = pair.b.y; f.path = null; f.replan = 0;
    s.player.body.reset(pair.a.x, pair.a.y);
    s.playerFace = 0;
    x0 = f.x; y0 = f.y; for (i = 0; i < 20; i++) s.tickFoes(16); o.watched = Math.hypot(f.x - x0, f.y - y0);
    s.playerFace += Math.PI;
    x0 = f.x; y0 = f.y; for (i = 0; i < 20; i++) s.tickFoes(16); o.free = Math.hypot(f.x - x0, f.y - y0);
    return o;
  });
  check(draugrLook.free > 20 && (draugrLook.watched < 1 || draugrLook.watched < draugrLook.free / 4), "a draugr moves only while Sol looks away: " + JSON.stringify(draugrLook));
  /* boss level: Fenrir, the gate chains, a wrong letter sets him off, a banked answer breaks a chain */
  await realmLevel(20);
  var boss = await page.evaluate(function () {
    var s = SolScene, o = { fenrir: !!s.fenrir, chains: s.chainsLeft, need: s.needExtracts, hati: s.janitors.length, lanes: (s.level.startLanes || []).length, pip: document.getElementById("realm-pip").textContent };
    /* v5.7.6: a hunter — stalks at 70% of Sol's walk, charges faster than she can run while carrying a letter */
    o.stalk = s.fenrir.spd; o.charge = s.fenrir.chargeSpd; o.firstCharge = s.fenrir.nextCharge;
    /* picking up a right letter brings his charge within 2.5 s */
    s.fenrir.state = "prowl"; s.fenrir.nextCharge = 9000; s.player.carrying = null; s.carryExtra = []; s.stunMs = 0;
    var rs = s.slips.filter(function (q) { return q.visible && s.need.indexOf(q.letter) !== -1; })[0];
    if (rs) { s.player.body.reset(rs.x, rs.y); s.player.x = rs.x; s.player.y = rs.y; s.tryGrab(); }
    o.smell = s.fenrir.nextCharge; o.grabbed = !!s.player.carrying;
    s.player.carrying = null; s.carryExtra = [];
    s.spareLives = 3; s.iframeMs = 0; s.stunMs = 0;
    s.flagWrongAlarm({ x: s.player.x, y: s.player.y }); o.provoked = s.fenrir.state;
    s.strikes = 0; s.carryExtra = []; s.player.carrying = null;
    s.need.forEach(function (L, i) { var sl = s.slips.filter(function (q) { return q.letter === L; })[0]; if (!i) s.player.carrying = sl; else s.carryExtra.push(sl); });
    s.player.body.reset(s.exitZone.x, s.exitZone.y); s.tryExtract(); o.after = s.chainsLeft;
    return o;
  });
  console.log("boss", JSON.stringify(boss));
  /* v5.7.9: a right letter's CHARIOT power shows Sol riding the sun chariot, and it goes when the power ends */
  for (var rw = 0; rw < 10; rw++) { if (await page.isVisible("#read-go")) { await page.click("#read-go"); break; } await page.waitForTimeout(150); }
  var ride = await page.evaluate(async function () {
    var s = SolScene; s.activateLockerPower();
    await new Promise(function (r) { setTimeout(r, 200); });
    var c = s.chariotRide, o = { on: !!(c && c.visible), near: c ? Math.hypot(c.x - s.player.x, c.y - s.player.y) : -1 };
    s.lockerPowerMs = 1;
    for (var w = 0; w < 10 && s.chariotRide && s.chariotRide.visible; w++) await new Promise(function (r) { setTimeout(r, 150); });
    o.off = !(s.chariotRide && s.chariotRide.visible); o.power = s.lockerPowerMs; o.read = s.readOpen;
    return o;
  });
  check(ride.on && ride.near < 60 && ride.off, "the CHARIOT power shows Sol riding the sun chariot, which goes when the power ends: " + JSON.stringify(ride));
  check(boss.fenrir && boss.chains === boss.need && boss.hati === boss.lanes && boss.hati >= 2 && /Fenrir/.test(boss.pip), "level 20: Fenrir guards a gate with one chain per question, and every Hati stays: " + boss.hati);
  check(boss.stalk > 180 && boss.charge > 365 && boss.firstCharge <= 7000 && boss.grabbed && boss.smell <= 2500, "Fenrir hunts: he stalks Sol, charges faster than she can run with a letter, and picking up a right letter brings his charge on: " + JSON.stringify({ stalk: boss.stalk, charge: boss.charge, first: boss.firstCharge, smell: boss.smell }));
  check(boss.provoked === "windup" && boss.after === boss.chains - 1, "a wrong letter sets Fenrir off; a banked answer breaks a chain");
  /* v5.7.6: beating Fenrir pays 100+ coins and a Fang (+1 coin an answer for good), shown on the win screen */
  var bossWin = await page.evaluate(async function () {
    var s = SolScene, o = {};
    try { localStorage.removeItem("afterHours.v1.fangs"); } catch (e) {}
    o.answer0 = s.coinEconomy().answer; var c0 = s.nightCoins || 0;
    s.endRun(true);
    await new Promise(function (r) { setTimeout(r, 900); });
    o.coins = (s.nightCoins || 0) - c0;
    o.title = document.getElementById("win-title").textContent; o.msg = document.getElementById("win-msg").textContent;
    var fr = document.getElementById("fang-row"); o.fangRow = !!fr && !fr.classList.contains("hidden"); o.fangOn = fr ? fr.querySelectorAll(".fang.on").length : 0;
    o.fangs = localStorage.getItem("afterHours.v1.fangs");
    o.answer1 = s.coinEconomy().answer;
    o.trophies = window.SolBuild && SolBuild.trophies ? SolBuild.trophies() : [];
    o.theme = window.SolBuild ? SolBuild.state().theme : null;
    o.onField = window.SolBuild ? JSON.parse(localStorage.getItem(SolBuild.LS_KEY) || "{}").picks.filter(function (q) { return /^trophy-/.test(q.piece); }).map(function (q) { return q.piece; }) : [];
    o.shopHasTrophy = window.SolBuild && SolBuild._shopDecos ? SolBuild._shopDecos().some(function (id) { return /^trophy-/.test(id); }) : null;
    return o;
  });
  console.log("boss win", JSON.stringify(bossWin));
  await shot("15b-boss-win");
  await page.evaluate(function () { try { if (window.SolBuild && SolBuild.isOpen()) SolBuild.close(); } catch (e) {} });
  /* the monument stands in the castle */
  await page.evaluate(function () { try { SolBuild.showGallery(); } catch (e) {} });
  await page.waitForTimeout(2500);
  await shot("15c-boss-monument");
  /* all ten monuments side by side, for the picture */
  await page.evaluate(function () { try { SolBuild.trophies().forEach(function (t) { if (!t.owned) SolBuild._place(t.id); }); SolBuild._zoom(1.5); } catch (e) {} });
  await page.waitForTimeout(3500);
  await shot("15d-monuments");
  await page.evaluate(function () { try { if (SolBuild.isOpen()) SolBuild.close(); } catch (e) {} });
  await page.evaluate(function () { try { localStorage.removeItem("afterHours.v1.fangs"); } catch (e) {} });
  var nifTrophy = (bossWin.trophies || []).filter(function (t) { return t.realm === "niflheim"; })[0];
  check(bossWin.theme !== "castle" || (nifTrophy && nifTrophy.owned && bossWin.onField.indexOf("trophy-niflheim") !== -1 && bossWin.shopHasTrophy === false && (bossWin.trophies || []).length === 10), "beating Fenrir sets that realm's monument in the castle; monuments are never in the shop: " + JSON.stringify({ theme: bossWin.theme, nif: nifTrophy, field: bossWin.onField, shop: bossWin.shopHasTrophy, n: (bossWin.trophies || []).length }));
  check(/Fenrir beaten/.test(bossWin.title) && bossWin.coins >= 100 && bossWin.fangRow && bossWin.fangOn === 1 && /niflheim/i.test(bossWin.fangs || "") && bossWin.answer1 === bossWin.answer0 + 1 && /Fang/.test(bossWin.msg), "beating Fenrir: a Fenrir-beaten title, 100+ coins, a Fang shown on the win screen and +1 coin on every answer after: " + JSON.stringify({ title: bossWin.title, coins: bossWin.coins, fangs: bossWin.fangs, a0: bossWin.answer0, a1: bossWin.answer1 }));
  /* castle perks: buildings on the field grant perks in the maze */
  await page.evaluate(function () {
    var picks = ["keep", "k-stables", "k-church", "k-barracks", "k-market", "k-castle"].map(function (id, i) { return { night: 5, piece: id, style: "blue", src: "free", deco: false, ord: i, rot: 0, cx: i * 3, cy: 0 }; });
    localStorage.setItem("afterHours.v1.build", JSON.stringify({ v: 4, theme: "castle", salt: 7, coins: 50, kit: 2, owned: {}, rewards: {}, picks: picks, view: { a: 0, z: 1, px: 0, py: 0 }, code: "" }));
    SolBuild._reload();
  });
  await realmLevel(20);
  var perks = await page.evaluate(function () {
    var s = SolScene, o = { list: s.perkList.map(function (p) { return p.id; }).sort().join(","), spare: s.spareLives, answer: s.coinEconomy().answer, speed: Math.round(s.realmSpeed(268, false, false)) };
    s.player.body.reset(s.slips[0].x, s.slips[0].y); s.iframeMs = 0; s.justStruck = false;
    var st = s.strikes; s.caught({ x: s.player.x, y: s.player.y, setVelocity: function () {} }); o.guarded = s.strikes === st && s.spareLives === 1;
    s.iframeMs = 0; s.justStruck = false; s.fenrir.stunMs = 0; s.fenrir.state = "charge"; s.player.body.reset(s.fenrir.x, s.fenrir.y); s.foeContact(s.fenrir); o.rune = s._runeUsed && s.strikes === st;
    return o;
  });
  console.log("perks", JSON.stringify(perks));
  check(perks.list === "blessing,guard,rune,swift,trade", "castle buildings on the field grant their perks: " + perks.list);
  check(perks.spare === 1 && perks.answer === 12 && perks.speed === 284, "Blessing gives a 1UP, Trade +2 coins an answer, Swift feet 6% speed");
  check(perks.guarded && perks.rune, "Castle guard blocks the first catch; the Rune of Sol turns Fenrir's first charge aside");
  await page.evaluate(function () { localStorage.removeItem("afterHours.v1.build"); SolBuild._reload(); });

  /* v5.7: shooter levels on 2, 4, 6 and 8 of each realm, reached through the real Next level button */
  /* v5.12: five shooters share the four shooter levels of a realm; the order turns one place every realm (realm 1 keeps
     raid, rocks, sky, ring), so each shooter plays in eight realms of the ten and Root Worms first comes on level 18 */
  var rot = await page.evaluate(function () {
    function ids(a, b) { var o = []; for (var n = a; n <= b; n++) { var m = SolModes.modeFor(n); o.push(m ? m.id : "-"); } return o.join(","); }
    var count = {}; for (var n = 1; n <= 100; n++) { var m = SolModes.modeFor(n); if (m) count[m.id] = (count[m.id] || 0) + 1; }
    return { first: ids(1, 20), r5: ids(41, 50), r10: ids(91, 100), count: count };
  });
  check(rot.first === "-,raid,-,rocks,-,sky,-,ring,-,-,-,rocks,-,sky,-,ring,-,worms,-,-", "shooter rotation (v5.12): realm 1 is raid, rocks, sky, ring on even levels, realm 2 turns one place and brings Root Worms on 18; maze on odd levels and bosses: " + rot.first);
  check(rot.r5 === "-,worms,-,raid,-,rocks,-,sky,-,-" && rot.r10 === "-,worms,-,raid,-,rocks,-,sky,-,-" && ["raid", "rocks", "sky", "ring", "worms"].every(function (k) { return rot.count[k] === 8; }) && Object.keys(rot.count).length === 5,
    "shooter rotation (v5.12): realms 5 and 10 play worms, raid, rocks, sky; over 100 levels each of the five shooters plays 8 times: " + JSON.stringify(rot));
  /* v5.8.3: with one game mode picked, an odd level plays as that mode */
  await page.evaluate(function () { SolModes.only = "rocks"; });
  await page.evaluate(function () { var b = document.getElementById("btn-next"); b.dataset.goto = "3"; b.click(); });
  await page.waitForFunction(function () { var s = window.SolScene; return s && s.night === 3 && s.claim; }, null, { timeout: 15000 }).catch(function () {});
  var only3 = await page.evaluate(function () { var s = SolScene; return { key: s.sys.settings.key, mode: s.mode && s.mode.id }; });
  await page.evaluate(function () { SolModes.only = null; if (SolScene.readOpen) { var g = document.getElementById("read-go"); if (g) g.click(); } });
  await page.waitForTimeout(500);
  check(only3.key === "mode" && only3.mode === "rocks", "Rune Rocks only: level 3 (a maze level in the mix) plays as Rune Rocks: " + JSON.stringify(only3));
  async function gotoLevel(n) {
    await page.evaluate(function (n) { var b = document.getElementById("btn-next"); b.dataset.goto = String(n); b.click(); }, n);
    await page.waitForTimeout(1500);
    /* wait for the level's reading pop-up, then close it so the level runs */
    await page.waitForFunction(function (n) { var s = window.SolScene; return s && s.night === n && s.claim && s.readOpen; }, n, { timeout: 15000 }).catch(function () {});
    if (await page.isVisible("#read-go")) await page.click("#read-go");
    await page.waitForFunction(function () { var s = window.SolScene; return s && !s.readOpen; }, null, { timeout: 5000 }).catch(function () {});
    await page.waitForTimeout(300);
  }
  function tickWait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  var modeRuns = {};
  await gotoLevel(2);
  /* v5.7.7: no arrows until the flock has flown into formation */
  var pre = await page.evaluate(function () { var s = SolScene, R = s.raid; s.tutLockUntil = 0; return { ready: R.ready, fired: R.fired, eagles: R.ravens.filter(function (o) { return o.kind === "eagle"; }).length, guards: R.ravens.filter(function (o) { return o.guard; }).length }; });
  await page.keyboard.down("Space"); await page.waitForTimeout(600); await page.keyboard.up("Space");
  pre.firedEarly = await page.evaluate(function (a) { return SolScene.raid.fired - a; }, pre.fired);
  await page.evaluate(function () { SolScene.raid.ravens.forEach(function (e) { if (e.state === "wait" || e.state === "enter") { e.state = "form"; e.path = null; } }); });
  await page.waitForFunction(function () { return SolScene.raid.ready; }, null, { timeout: 8000 }).catch(function () {});
  await page.waitForTimeout(2500);
  pre.after = await page.evaluate(function () { var R = SolScene.raid; return { ready: R.ready, flying: R.ravens.filter(function (o) { return o.alive && (o.state === "dive" || o.state === "beam" || o.state === "return"); }).length }; });
  modeRuns.raidPre = pre;
  /* a mouse button (left or right) shoots without moving Sol */
  var cbox = await page.evaluate(function () { var r = SolScene.game.canvas.getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; });
  var click0 = await page.evaluate(function () { var s = SolScene; s.tutLockUntil = 0; return { x: s.player.x, fired: s.raid.fired }; });
  await page.mouse.move(cbox.x + cbox.width * 0.2, cbox.y + cbox.height * 0.55);
  await page.mouse.down({ button: "right" }); await page.waitForTimeout(700);
  await page.mouse.up({ button: "right" });
  await page.mouse.down(); await page.waitForTimeout(700); await page.mouse.up();
  var click1 = await page.evaluate(function () { var s = SolScene; return { x: s.player.x, fired: s.raid.fired, menu: false }; });
  modeRuns.click = { moved: Math.abs(click1.x - click0.x), fired: click1.fired - click0.fired };
  modeRuns.raid = await page.evaluate(async function () {
    var s = SolScene, o = { key: s.sys.settings.key, mode: s.mode.id, fire: document.getElementById("btn-action").textContent, mini: getComputedStyle(document.getElementById("minimap")).display, hud: document.getElementById("score-pip").textContent };
    /* v5.12: wait on the game, not the clock, with room for a loaded machine (the game runs much slower than real
       time there: a fixed 8 s wait once ran out before the freed Sol had landed, and the test crashed on the missing
       second Sol). A step that never happens is reported in o.err instead of crashing the run. */
    function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
    async function until(f, ms) { var t0 = Date.now(); while (!f() && Date.now() - t0 < (ms || 30000)) await wait(50); return !!f(); }
    async function readGo() {
      await until(function () { return !s._between && !s._readPending; }, 20000);
      var g = document.getElementById("read-go"); if (s.readOpen && g && g.offsetParent) g.click();
      await until(function () { return !s.readOpen; }, 10000);
    }
    s.spareLives = 0; s.perks = {};
    /* the click test's arrows may have hit birds: a fresh wave, no lives spent */
    var R = s.raid;
    if (s._between || s._readPending || s.readOpen) await readGo();   /* an arrow answered the question: let the next one load, then close its reading pop-up */
    R.arrows.forEach(function (a) { a.spr.destroy(); }); R.arrows = [];
    if (s.ended || s._finishing) { o.endedEarly = true; return o; }
    s.answers_raid(); s.strikes = 0; s.iframeMs = 0; s.claimWrong = 0; s.score = 0; s.paintHud();
    /* the birds stay out of the sky for these checks (a dive or a beam would muddle the counts) */
    R.ravens.forEach(function (q) { q.delay = 1e9; });
    R.feathers.forEach(function (f) { f.spr.destroy(); }); R.feathers = [];
    o.hud = document.getElementById("score-pip").textContent;
    var eagles = R.ravens.filter(function (q) { return q.letter; });
    o.eagles = eagles.length; o.ravens = R.ravens.filter(function (q) { return !q.letter && !q.guard; }).length;
    var wrong = eagles.filter(function (q) { return s.need.indexOf(q.letter) === -1; })[0];
    if (!wrong) { o.err = "no eagle with a wrong letter"; return o; }
    wrong.hp = 2; s.strikes = 0; s.iframeMs = 0;   /* the mouse test's arrows may have hit it */
    s.raidHit(wrong); o.afterOne = s.strikes + (wrong.alive ? 0 : 10);
    s.raidHit(wrong); o.wrong = s.strikes; s.strikes = 0; s.iframeMs = 0;
    /* (earlier random play may have left two Sols: then a feather takes one Sol, not a life — start from one) */
    if (R.wing) { try { R.wing.destroy(); } catch (eW) {} R.wing = null; }
    R.feathers.push({ x: s.player.x, y: s.player.y - 20, vx: 0, t: 0, spr: s.add.image(s.player.x, s.player.y - 20, "md-poo") });
    await until(function () { return s.strikes > 0 && !R.feathers.length; }, 15000); o.feather = s.strikes; s.strikes = 0; s.iframeMs = 0;
    /* an eagle's beam over Sol catches him */
    var bm = R.ravens.filter(function (q) { return q.alive && q.letter && q.state !== "wait"; })[0] || R.ravens.filter(function (q) { return q.alive && q.letter; })[0];
    if (!bm) { o.err = "no eagle left for the beam test"; return o; }
    bm.state = "beam"; bm.beamMs = 900; bm.path = null; bm.x = s.player.x; bm.hoverY = s.H * 0.4; bm.y = bm.hoverY; bm.lead = true;
    await until(function () { return !!R.capt; }); o.beam = s.strikes; s.strikes = 0;
    /* v5.8.2: Galaga's capture — the eagle carries Sol off; an arrow on it frees him and he stands next to Sol.
       Nothing may hit either Sol while he rises, drops and lands (iframes); the checks below take them off again. */
    s.iframeMs = 1e9;
    await until(function () { return R.capt && R.capt.held; });
    var cap = R.capt;
    o.capt = { caught: !!cap && cap.held && cap.eagle === bm, hp: bm.hp };
    if (!cap || !cap.held) { o.err = "the beam never carried Sol up to the eagle"; return o; }
    s.raidHit(bm);
    o.capt.freedNoHurt = bm.alive && bm.hp === o.capt.hp && s.strikes === 0;
    await until(function () { return !!R.wing && !R.capt; });
    o.capt.double = !!R.wing && !R.capt && Math.abs(R.wing.x - s.player.x - 40) < 1;
    if (!R.wing) { o.err = "the freed Sol never landed next to Sol (no second Sol)"; return o; }
    R.arrows.forEach(function (a) { a.spr.destroy(); }); R.arrows = [];
    var wasReady = R.ready; R.ready = true; R.cd = 0;
    s.keys.SPACE.isDown = true; await until(function () { return R.arrows.length > 0; }, 10000); s.keys.SPACE.isDown = false;
    o.capt.twoArrows = R.arrows.length; R.ready = wasReady;
    R.arrows.forEach(function (a) { a.spr.destroy(); }); R.arrows = [];
    /* with two Sols, poo on the second one takes him away, not a life */
    if (!R.wing) { o.err = "the second Sol was lost before the poo test"; return o; }
    s.iframeMs = 0;
    R.feathers.push({ x: R.wing.x, y: s.player.y - 20, vx: 0, t: 0, spr: s.add.image(R.wing.x, s.player.y - 20, "md-poo") });
    await until(function () { return !R.wing || s.strikes > 0; }, 15000);
    o.capt.lostOne = !R.wing && s.strikes === 0;
    s.iframeMs = 0;
    R.arrows.forEach(function (a) { a.spr.destroy(); }); R.arrows = [];
    /* v5.8.3: a Sol still held when the question is answered costs a life then */
    var ke = R.ravens.filter(function (q) { return q.alive && q.letter && s.need.indexOf(q.letter) === -1; })[0];
    if (ke && !R.capt) { s.raidCapture(ke); R.capt.held = true; R.capt.t = 1; }
    s.strikes = 0; s.iframeMs = 0;
    var coins = s.nightCoins;
    R.ravens.filter(function (q) { return q.alive && q.letter && s.need.indexOf(q.letter) !== -1; }).forEach(function (q) { s.raidHit(q); s.raidHit(q); });
    o.score = s.score; o.coins = s.nightCoins > coins; o.capt.kept = ke ? s.strikes : -1; o.capt.keptGone = !R.capt;
    await until(function () { return R.ravens.some(function (q) { return q.alive && q.letter; }); }, 20000);
    o.newWave = R.ravens.filter(function (q) { return q.alive && q.letter; }).length;
    var pip = document.getElementById("realm-pip"); o.pip = pip ? pip.textContent : "";
    return o;
  });
  check(!modeRuns.raid.err && !modeRuns.raid.endedEarly, "Eagle Swoop: the scripted run reached every step: " + (modeRuns.raid.err || (modeRuns.raid.endedEarly ? "the level ended early" : "ok")));
  if (await page.isVisible("#read-go")) await page.click("#read-go");
  await page.waitForTimeout(3500);
  modeRuns.raid.flying = await page.evaluate(function () { return SolScene.raid.ravens.filter(function (q) { return q.state !== "wait"; }).length; });
  await shot("16-eagle-swoop");
  await page.evaluate(function () {
    var s = SolScene, e = s.raid.ravens.filter(function (q) { return q.alive && q.letter && q.state === "form"; })[0];
    s.iframeMs = 60000;   /* just for the picture */
    if (e) s.raidBeamDive(e);
    var r = s.raid.ravens.filter(function (q) { return q.alive && q.kind === "raven" && q.state === "form"; })[0];
    if (r) { r.lead = true; s.raidDive(r, 0); }
  });
  await page.waitForFunction(function () { return SolScene.raid.ravens.some(function (q) { return q.state === "beam" && q.beamMs > 700; }); }, null, { timeout: 20000 }).catch(function () {});
  await shot("16b-eagle-beam");
  /* v5.8.2: pictures of a caught Sol over his eagle, then the two Sols */
  await page.evaluate(function () {
    var s = SolScene, R = s.raid, e = R.ravens.filter(function (q) { return q.alive && q.letter && q.state === "form" && !q.captive; })[0];
    s.iframeMs = 60000;
    if (e && !R.capt && !R.wing) s.raidCapture(e);
  });
  await page.waitForTimeout(1600);
  await shot("16c-eagle-caught-sol");
  await page.evaluate(function () { var R = SolScene.raid; if (R.capt && R.capt.held) SolScene.raidHit(R.capt.eagle); });
  await page.waitForTimeout(1400);
  await shot("16d-two-sols");
  await page.evaluate(function () { SolScene.iframeMs = 0; });
  await gotoLevel(4);
  /* v5.7.3: the "how to pull a rock in" card comes up once the reading pop-up closes, and pauses the level */
  await page.waitForSelector("#beam-help:not(.hidden)", { timeout: 8000 }).catch(function () {});
  var beamHelp = await page.evaluate(function () {
    var ov = document.getElementById("beam-help"), s = SolScene;
    return { shown: !!ov && !ov.classList.contains("hidden") && getComputedStyle(ov).display !== "none", paused: !!s.helpOpen, right: /right mouse button/.test(ov ? ov.textContent : ""), text: ov ? ov.textContent : "" };
  });
  await shot("17b-beam-help");
  if (await page.isVisible("#beam-help-ok")) await page.click("#beam-help-ok");
  await page.waitForTimeout(300);
  beamHelp.closed = await page.evaluate(function () { var ov = document.getElementById("beam-help"); return ov.classList.contains("hidden") && !SolScene.helpOpen; });
  beamHelp.rightBtn = await page.evaluate(function () {
    var s = SolScene, keep = s.ptr, lock = s.tutLockUntil;
    s.tutLockUntil = 0;
    s.ptr = { down: true, right: true, x: 10, y: 10, t: s.time.now }; var a = s.readInput();
    s.ptr = { down: true, right: false, x: 10, y: 10, t: s.time.now }; var b = s.readInput();
    s.ptr = keep; s.tutLockUntil = lock;
    return { rightPulls: a.pull && !a.fire, leftFires: b.fire && !b.pull };
  });
  modeRuns.beamHelp = beamHelp;
  /* v5.7.4: a mouse button never steers the ship: left fires, right beams */
  var rk0 = await page.evaluate(function () { var s = SolScene, S = s.rk.ship; s.tutLockUntil = 0; S.vx = 0; S.vy = 0; return { x: S.x, y: S.y, ang: S.ang, fired: s.rk.fired || 0, W: s.W, H: s.H }; });
  var cb2 = await page.evaluate(function () { var r = SolScene.game.canvas.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
  await page.mouse.move(cb2.x + cb2.w * 0.85, cb2.y + cb2.h * 0.2);
  await page.mouse.down(); await page.waitForTimeout(600); await page.mouse.up();
  await page.mouse.down({ button: "right" }); await page.waitForTimeout(400); await page.mouse.up({ button: "right" });
  modeRuns.rockMouse = await page.evaluate(function (a) { var s = SolScene, S = s.rk.ship; return { turned: Math.abs(S.ang - a.ang), moved: Math.hypot(S.x - a.x, S.y - a.y), fired: (s.rk.fired || 0) - a.fired }; }, rk0);
  modeRuns.rocks = await page.evaluate(async function () {
    var s = SolScene, R = s.rk, o = { mode: s.mode.id, pull: getComputedStyle(document.getElementById("btn-shutter")).display };
    s.spareLives = 0; s.perks = {};
    /* the mouse test's shots may have hit a letter rock: fresh letters, no lives spent */
    R.bullets.forEach(function (b) { b.spr.destroy(); }); R.bullets = [];
    s.answers_rocks(); s.strikes = 0; s.iframeMs = 0; s.claimWrong = 0;
    function rockOf(right) { return R.rocks.filter(function (q) { return q.letter && (s.need.indexOf(q.letter) !== -1) === right; })[0]; }
    s.rockCaught(rockOf(false)); o.pullWrong = s.strikes; s.strikes = 0; s.iframeMs = 0;
    var right = rockOf(true), L = right.letter;
    s.rockShot(right); o.blastRight = s.strikes; o.why = s.lossReason(); s.strikes = 0; s.iframeMs = 0;
    s.rockShot(rockOf(false)); o.blastWrong = s.strikes;
    await new Promise(function (r) { setTimeout(r, 2600); });
    o.back = R.rocks.some(function (q) { return q.letter === L; });
    var blank = s.rockMake(2, null, R.ship.x, R.ship.y, 0, 0); s.iframeMs = 0;
    await new Promise(function (r) { setTimeout(r, 500); }); o.hit = s.strikes; s.strikes = 0; s.iframeMs = 0;
    /* a right rock that was in the beam a moment ago and hits the ship: named, and still costs a life */
    var rr = rockOf(true); s.strikes = 0; s.iframeMs = 0;
    /* v5.10: nothing else may hit the ship first (on a busy machine a stray rock sometimes did) */
    R.rocks.filter(function (q) { return !q.letter; }).slice().forEach(function (q) { s.rockRemove(q); }); R.spawnCd = 1e9; R.saucerCd = 1e9;
    R.saucers.forEach(function (u) { u.spr.destroy(); }); R.saucers = []; R.sBullets.forEach(function (q) { q.spr.destroy(); }); R.sBullets = [];
    R.rocks.forEach(function (q) { if (q.letter && q !== rr) { q.x = R.ship.x - 300; q.y = R.ship.y - 200; q.vx = 0; q.vy = 0; } });
    if (rr) { rr.x = R.ship.x + 10; rr.y = R.ship.y; rr.vx = 0; rr.vy = 0; rr.beamT = s.time.now; }
    await new Promise(function (r) { setTimeout(r, 500); }); o.early = s.strikes; o.earlyLabel = s._lastHitLabel; s.strikes = 0; s.iframeMs = 0;
    s.need.forEach(function (N) { var q = R.rocks.filter(function (z) { return z.letter === N; })[0]; if (q) s.rockCaught(q); });
    o.score = s.score;
    try { o.learned = localStorage.getItem("afterHours.v1.beamLearned"); } catch (e) {}
    /* v5.8.5: a rock held in the beam stays locked: a plain rock drifting into the beam nearer the ship, and the
       ship turning so the pulled rock leaves the narrow cone, no longer drop it (it used to hit the ship as
       "let go too soon" with the beam still held).
       v5.12: wait on the game, not the clock: on a loaded machine the next question's reading pop-up opened after the
       fixed 1.3 s wait, paused the level, and the pull below never happened */
    async function until(f, ms) { var t0 = Date.now(); while (!f() && Date.now() - t0 < (ms || 30000)) await new Promise(function (r) { setTimeout(r, 50); }); return !!f(); }
    await until(function () { return !s._between && !s._readPending; }, 20000);
    var rgo2 = document.getElementById("read-go"); if (s.readOpen && rgo2 && rgo2.offsetParent) rgo2.click();
    await until(function () { return !s.readOpen; }, 10000);
    R.rocks.filter(function (q) { return !q.letter; }).slice().forEach(function (q) { s.rockRemove(q); });
    R.spawnCd = 1e9; R.saucerCd = 1e9;
    var S = R.ship; S.x = s.W / 2; S.y = s.H / 2; S.vx = 0; S.vy = 0; S.ang = 0;
    var lr = R.rocks.filter(function (q) { return q.letter && s.need.indexOf(q.letter) !== -1 && s.extracted.indexOf(q.letter) === -1; })[0];
    o.lock = { found: !!lr };
    if (lr) {
      R.rocks.filter(function (q) { return q.letter && q !== lr; }).forEach(function (q) { q.x = S.x - 300; q.y = S.y - 200; q.vx = 0; q.vy = 0; });
      lr.x = S.x + 220; lr.y = S.y; lr.vx = 0; lr.vy = 0;
      var L2 = lr.letter, sc0 = s.score, ex0 = s.extracted.length;
      s.strikes = 0; s.iframeMs = 0; s.spareLives = 0;
      s.keys.SHIFT.isDown = true;
      o.lock.lockedFirst = await until(function () { return R.lock === lr; }, 10000);
      var thief = s.rockMake(1, null, S.x + 70, S.y + 18, 0, 0);
      S.ang = 0.55;
      await until(function () { return R.rocks.indexOf(lr) < 0 || s.strikes > 0; }, 30000);
      s.keys.SHIFT.isDown = false;
      o.lock.caught = R.rocks.indexOf(lr) < 0 && (s.score > sc0 || s.extracted.length > ex0 || s.extracted.indexOf(L2) !== -1);
      o.lock.strikes = s.strikes; o.lock.label = s._lastHitLabel || "";
      if (R.rocks.indexOf(thief) >= 0) s.rockRemove(thief);
    }
    return o;
  });
  await shot("17-rune-rocks");
  await gotoLevel(6);
  var sk0 = await page.evaluate(function () { var s = SolScene; s.tutLockUntil = 0; return { x: s.sky.x, y: s.sky.y }; });
  var cb3 = await page.evaluate(function () { var r = SolScene.game.canvas.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
  await page.mouse.move(cb3.x + cb3.w * 0.5, cb3.y + cb3.h * 0.15);
  await page.mouse.down(); await page.waitForTimeout(600); await page.mouse.up();
  modeRuns.skyMouse = await page.evaluate(function (a) { var s = SolScene; return { moved: Math.hypot(s.sky.x - a.x, s.sky.y - a.y) }; }, sk0);
  modeRuns.sky = await page.evaluate(async function () {
    var s = SolScene, K = s.sky, o = { mode: s.mode.id };
    s.spareLives = 0; s.perks = {}; s.strikes = 0; s.iframeMs = 0;
    /* v5.7.5: difficulty climbs from a harder start */
    var p6 = s.skyParams(6), p16 = s.skyParams(16), p56 = s.skyParams(56), p96 = s.skyParams(96);
    o.curve = { spawn6: p6.spawnMs, spawn96: p96.spawnMs, throw6: p6.throwP, throw96: p96.throwP, spark6: p6.sparkP, spark96: p96.sparkP, guards6: p6.guards, guards16: p16.guards, guards56: p56.guards, bob6: p6.bob, bob56: p56.bob,
      gap6: p6.gapHalf, gap16: p16.gapHalf, gap96: p96.gapHalf, spin6: p6.spin, spin96: p96.spin, flip6: p6.flip, flip36: s.skyParams(36).flip };
    /* quiet sky for the scripted checks */
    K.spawnCd = 1e9; K.foes.forEach(function (f) { if (f.spr) f.spr.destroy(); }); K.foes = []; K.shots.forEach(function (f) { f.spr.destroy(); }); K.shots = [];
    K.orbs.forEach(function (q, i) { q.x = s.W * 0.6 + i * 60; q.vx = 0; q.gap = Math.PI; q.spin = 0; q.flipCd = 1e9; });   /* bring the orbs on screen, gaps facing the chariot */
    function bolt(x, y) { K.bolts.push({ x: x - 40, y: y, spr: s.add.image(x - 40, y, "md-bolt") }); }
    /* v5.7.9: a shield turned away stops the bolt: the right orb stays, no life lost, no answer */
    var sh = K.orbs.filter(function (q) { return s.need.indexOf(q.letter) !== -1; })[0];
    sh.gap = 0; bolt(sh.x, sh.y); await new Promise(function (r) { setTimeout(r, 400); });
    o.blocked = { stays: K.orbs.indexOf(sh) !== -1, strikes: s.strikes, score: s.score }; sh.gap = Math.PI;
    var w = K.orbs.filter(function (q) { return s.need.indexOf(q.letter) === -1; })[0];
    bolt(w.x, w.y); await new Promise(function (r) { setTimeout(r, 400); }); o.wrong = s.strikes; s.strikes = 0; s.iframeMs = 0;
    K.foes.push({ kind: "raven", x: K.x, y: K.y - 8, by: K.y - 8, r: 22, sp: 0, amp: 0, fr: 1, t: 0, spr: s.add.image(K.x, K.y, "rf-raven-0") });
    await new Promise(function (r) { setTimeout(r, 400); }); o.crash = s.strikes; s.strikes = 0; s.iframeMs = 0;
    K.foes.forEach(function (f) { if (f.spr) f.spr.destroy(); }); K.foes = [];
    /* a thrown feather hits the chariot */
    s.skyThrow(K.x + 120, K.y - 8, false);
    await new Promise(function (r) { setTimeout(r, 900); }); o.feather = s.strikes; s.strikes = 0; s.iframeMs = 0;
    /* a guard in front of an orb takes the bolt; the orb is untouched */
    var gOrb = K.orbs.filter(function (q) { return s.need.indexOf(q.letter) === -1; })[0] || K.orbs[0];
    var guard = s.skyGuard(gOrb), kills = s.kills;
    bolt(guard.x - 20, guard.y);
    await new Promise(function (r) { setTimeout(r, 500); });
    o.guard = { orbSafe: K.orbs.indexOf(gOrb) !== -1, guardGone: K.foes.indexOf(guard) === -1, strikes: s.strikes, kill: s.kills > kills };
    s.strikes = 0; s.iframeMs = 0;
    K.orbs.filter(function (q) { return s.need.indexOf(q.letter) !== -1; }).forEach(function (q) { bolt(q.x, q.y); });
    await new Promise(function (r) { setTimeout(r, 400); }); o.score = s.score;
    return o;
  });
  await shot("18-sun-chariot");
  if (await page.isVisible("#read-go")) await page.click("#read-go");
  await page.evaluate(function () {
    var s = SolScene, K = s.sky; s.iframeMs = 60000; K.spawnCd = 0;   /* just for the picture: a busy sky, a guarded orb */
    K.orbs.forEach(function (q, i) { q.x = s.W * 0.55 + i * 150; q.vx = -40; });
    if (K.orbs[0]) s.skyGuard(K.orbs[0]);
  });
  await page.waitForTimeout(4500);
  await shot("18b-sun-chariot-busy");
  await page.evaluate(function () { SolScene.iframeMs = 0; });
  await gotoLevel(8);
  await page.evaluate(function () { var s = SolScene; s.iframeMs = 60000; s.rg.riseCd = 1500; });   /* just for the picture */
  await page.waitForTimeout(6500);
  await shot("19a-wolf-ring");
  await page.evaluate(function () { var s = SolScene; s.iframeMs = 0; s.strikes = 0; s.rg.stones.forEach(function (q) { q.state = "down"; q.t = 0; s.ringDrawStone(q); }); s.rg.riseCd = 3600; s.rg.wolves.forEach(function (w) { w.spr.destroy(); }); s.rg.wolves = []; s.rg.spawnCd = 1e9; });
  modeRuns.ring = await page.evaluate(async function () {
    var s = SolScene, G = s.rg, p = s.player, o = { mode: s.mode.id };
    s.spareLives = 0; s.perks = {};
    function arrowAt(x, y) { G.arrows.push({ x: x, y: y, vx: 0, vy: 0, spr: s.add.image(x, y, "md-arrow") }); }
    /* v5.7.5: every runestone starts sunk; the wolves come first */
    o.sunkAtStart = G.stones.every(function (q) { return q.state === "down" && !q.spr.visible; });   /* (reset after the picture) */
    o.riseWait = G.riseCd;
    var sunkArrow = G.stones[0]; s.ringRaise(sunkArrow); sunkArrow.state = "down"; s.ringDrawStone(sunkArrow);
    arrowAt(sunkArrow.x, sunkArrow.y); await new Promise(function (r) { setTimeout(r, 300); }); o.sunkShot = s.strikes + s.score; s.strikes = 0; s.iframeMs = 0;
    G.arrows.forEach(function (a) { a.spr.destroy(); }); G.arrows = [];
    /* then they rise one or two at a time */
    G.riseCd = 0; await new Promise(function (r) { setTimeout(r, 900); });
    o.upCount = G.stones.filter(function (q) { return q.state !== "down"; }).length;
    G.stones.forEach(function (q) { q.state = "down"; s.ringDrawStone(q); }); G.riseCd = 99999; G.queue = [];
    G.arrows.forEach(function (a) { a.spr.destroy(); }); G.arrows = []; s.strikes = 0; s.iframeMs = 0; s.claimWrong = 0;
    function raise(q) { s.ringRaise(q); q.state = "up"; q.t = 0; s.ringDrawStone(q); }
    var w = G.stones.filter(function (q) { return s.need.indexOf(q.letter) === -1; })[0];
    raise(w);
    arrowAt(w.x, w.y); await new Promise(function (r) { setTimeout(r, 400); }); o.wrong = s.strikes; o.crossed = w.dead; s.strikes = 0; s.iframeMs = 0;
    G.wolves.push({ x: p.x + 10, y: p.y, state: "run", sp: 0, spr: s.add.image(p.x, p.y, "hati1").setScale(0.5) });
    await new Promise(function (r) { setTimeout(r, 400); }); o.bitten = s.strikes; s.strikes = 0; s.iframeMs = 0;
    s.score = s.needExtracts - 1;
    G.stones.filter(function (q) { return s.need.indexOf(q.letter) !== -1; }).forEach(function (q) { raise(q); arrowAt(q.x, q.y); });
    await new Promise(function (r) { setTimeout(r, 2200); });
    o.ended = s.ended; o.title = document.getElementById("win-title").textContent; o.msg = document.getElementById("win-msg").textContent; o.goto = document.getElementById("btn-next").dataset.goto;
    return o;
  });
  await shot("19-wolf-ring-cleared");
  console.log("modes", JSON.stringify(modeRuns));
  var mr = modeRuns;
  check(mr.raid.key === "mode" && mr.raid.mode === "raid" && mr.raid.fire === "FIRE" && mr.raid.mini === "none" && /^Answers 0/.test(mr.raid.hud), "level 2 is Eagle Swoop in the shooter scene (FIRE button, no minimap, Answers on the HUD)");
  check(mr.raid.capt && mr.raid.capt.caught && mr.raid.capt.freedNoHurt && mr.raid.capt.double && mr.raid.capt.twoArrows === 2 && mr.raid.capt.lostOne && mr.raid.capt.kept === 1 && mr.raid.capt.keptGone, "Eagle Swoop (v5.8.2/3): the beam carries Sol off to the eagle (no life yet); an arrow on that eagle frees him without hurting it; two Sols shoot two arrows; poo on one takes him away, not a life; a Sol still held when the question is answered costs a life then: " + JSON.stringify(mr.raid.capt));
  check(mr.raid.eagles >= 2 && mr.raid.ravens >= 12 && mr.raid.afterOne === 0 && mr.raid.wrong === 1 && mr.raid.feather === 1 && mr.raid.beam === 0 && mr.raid.score === 1 && mr.raid.coins && mr.raid.newWave > 0 && mr.raid.flying > 0 && !/Fenrir/.test(mr.raid.pip), "Eagle Swoop: eagles carry the letters above a raven guard; an eagle takes two arrows; a wrong letter and a feather each cost a life, an eagle's beam catches Sol; the right eagle answers, pays coins and a new wave flies in: " + JSON.stringify(mr.raid));
  check(mr.raidPre && mr.raidPre.ready === false && mr.raidPre.firedEarly === 0 && mr.raidPre.after.ready, "Eagle Swoop: no shooting until the flock has formed: " + JSON.stringify(mr.raidPre));
  check(mr.raidPre && mr.raidPre.guards === 2 * mr.raidPre.eagles && mr.raidPre.after.flying >= 1, "Eagle Swoop: two guard ravens under every eagle, and once shooting starts a bird is always flying: " + JSON.stringify(mr.raidPre));
  check(mr.click && mr.click.moved < 2 && mr.click.fired >= 2, "Eagle Swoop: left and right mouse buttons shoot without moving Sol: " + JSON.stringify(mr.click));
  check(mr.rocks.mode === "rocks" && mr.rocks.pull !== "none" && mr.rocks.pullWrong === 1 && mr.rocks.blastRight === 1 && mr.rocks.blastWrong === 0 && mr.rocks.back && mr.rocks.hit === 1 && mr.rocks.score === 1, "Rune Rocks: pulling a wrong letter, blasting the right one and a rock hit cost a life; blasting a wrong letter is free; the right rock returns; beaming it in answers");
  check(mr.beamHelp && mr.beamHelp.shown && mr.beamHelp.paused && mr.beamHelp.right && mr.beamHelp.closed, "Rune Rocks: a one-card beam tutorial shows after the reading pop-up, pauses the level and closes with Got it: " + JSON.stringify({ shown: mr.beamHelp.shown, paused: mr.beamHelp.paused, closed: mr.beamHelp.closed }));
  check(mr.beamHelp && mr.beamHelp.rightBtn.rightPulls && mr.beamHelp.rightBtn.leftFires, "Rune Rocks: the right mouse button holds the beam; the left button fires");
  check(mr.rockMouse && mr.rockMouse.turned < 0.01 && mr.rockMouse.moved < 3 && mr.rockMouse.fired >= 1, "Rune Rocks: clicking fires without turning or moving the ship: " + JSON.stringify(mr.rockMouse));
  check(mr.rocks.lock && mr.rocks.lock.found && mr.rocks.lock.lockedFirst && mr.rocks.lock.caught && mr.rocks.lock.strikes === 0, "Rune Rocks (v5.8.5): a rock held in the beam stays locked — a nearer rock drifting into the beam and the ship turning don't drop it, so it is pulled in with no life lost: " + JSON.stringify(mr.rocks.lock));
  check(mr.rocks.early === 1 && mr.rocks.earlyLabel === "YOU LET GO OF THE BEAM TOO SOON", "Rune Rocks: a rock let go of early that hits the ship costs a life and says why: " + mr.rocks.earlyLabel);
  var cv = mr.sky.curve || {};
  check(cv.spawn6 < 1100 && cv.spawn96 <= 400 && cv.throw6 > 0.3 && cv.throw96 > cv.throw6 && cv.spark6 === 0 && cv.spark96 > 0 && cv.guards6 === 0 && cv.guards16 === 1 && cv.guards56 === 3 && cv.bob56 > cv.bob6, "Sun Chariot: harder from the first one (level 6) and harder every time after: " + JSON.stringify(cv));
  check(mr.sky.feather === 1, "Sun Chariot: a raven's feather that hits the chariot costs a life");
  check(mr.sky.blocked && mr.sky.blocked.stays && mr.sky.blocked.strikes === 0 && mr.sky.blocked.score === 0, "Sun Chariot: an orb's shield stops a bolt unless its gap faces the chariot: " + JSON.stringify(mr.sky.blocked));
  check(cv.gap16 < cv.gap6 && cv.gap96 < cv.gap16 && cv.spin96 > cv.spin6 && !cv.flip6 && cv.flip36, "Sun Chariot: the shield gap narrows and spins faster every time the level comes round, and from level 36 it reverses: " + JSON.stringify({ g6: cv.gap6, g16: cv.gap16, g96: cv.gap96, s6: cv.spin6, s96: cv.spin96 }));
  check(mr.sky.guard && mr.sky.guard.orbSafe && mr.sky.guard.guardGone && mr.sky.guard.strikes === 0 && mr.sky.guard.kill, "Sun Chariot: a guard raven in front of an orb takes the bolt and the orb stays: " + JSON.stringify(mr.sky.guard));
  check(mr.ring.sunkAtStart && mr.ring.riseWait > 2000 && mr.ring.sunkShot === 0 && mr.ring.upCount >= 1 && mr.ring.upCount <= 2, "Wolf Ring: the runestones start sunk while the wolves come, can't be shot down there, and rise one or two at a time: " + JSON.stringify({ sunk: mr.ring.sunkAtStart, wait: mr.ring.riseWait, sunkShot: mr.ring.sunkShot, up: mr.ring.upCount }));
  check(mr.skyMouse && mr.skyMouse.moved < 2, "Sun Chariot: clicking does not move the chariot: " + JSON.stringify(mr.skyMouse));
  check(mr.beamHelp && /let go early/i.test(mr.beamHelp.text || ""), "Rune Rocks: the beam card warns about letting go early");
  check(mr.rocks.learned === "1", "Rune Rocks: pulling a rock in retires the beam tutorial on this Chromebook");
  check(/blasted the rock with the right answer/.test(mr.rocks.why || ""), "Rune Rocks: losing the last life by blasting the right answer says so (not \"wrong letter\"): " + mr.rocks.why);
  check(mr.sky.mode === "sky" && mr.sky.wrong === 1 && mr.sky.crash === 1 && mr.sky.score === 1, "Sun Chariot: a wrong orb and a crash cost a life; the right orb answers");
  check(mr.ring.mode === "ring" && mr.ring.wrong === 1 && mr.ring.crossed && mr.ring.bitten === 1, "Wolf Ring: a wrong stone is crossed out and costs a life; a wolf reaching Sol costs a life");
  check(mr.ring.ended && mr.ring.title === "Wolf Ring cleared" && mr.ring.goto === "9" && /back to the maze/.test(mr.ring.msg), "the last right answer clears the level and points to the maze next");
  await page.evaluate(function () { document.getElementById("btn-next").click(); });
  await page.waitForTimeout(3000);
  var back = await page.evaluate(function () { var s = SolScene; return { key: s.sys.settings.key, night: s.night, slips: (s.slips || []).length, act: document.getElementById("btn-action").textContent, mini: getComputedStyle(document.getElementById("minimap")).display, stage: document.getElementById("stage").className }; });
  console.log("back to maze", JSON.stringify(back));
  check(back.key === "night" && back.night === 9 && back.slips === 4 && back.act === "SPRINT" && back.mini !== "none" && back.stage.indexOf("mode") === -1, "Next level goes from the shooter back to the maze with its own controls");
  /* ── v5.12 (from the Chemistry build): Eagle Swoop's birds, Root Worms, and the teacher's rule for both: answering
     the level's last question doesn't win it — the rest of the flock / every worm segment has to be shot first. ──
     Helpers that run in the page: they wait on the game, not the clock (a loaded machine runs the game slower). */
  var pageHelpers = "window.__wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };" +
    "window.__until = async function (f, ms) { var t0 = Date.now(); while (!f() && Date.now() - t0 < (ms || 30000)) await __wait(50); return !!f(); };" +
    "window.__readGo = async function () { var s = SolScene; await __until(function () { return !s._between && !s._readPending; }, 20000);" +
    " var g = document.getElementById('read-go'); if (s.readOpen && g && g.offsetParent) g.click(); await __until(function () { return !s.readOpen; }, 10000); };" +
    "window.__gameWait = async function (ms) { var s = SolScene, t0 = s.time.now; await __until(function () { return s.time.now - t0 >= ms; }, 60000); };";
  async function retryLevel(n) {
    await page.click("#btn-retry");
    await page.waitForFunction(function (n) { var s = window.SolScene; return s && s.night === n && s.claim && s.readOpen && !s.ended; }, n, { timeout: 30000 }).catch(function () {});
    if (await page.isVisible("#read-go")) await page.click("#read-go");
    await page.waitForFunction(function () { var s = window.SolScene; return s && !s.readOpen; }, null, { timeout: 10000 }).catch(function () {});
  }
  var birds = {};
  birds.table = await page.evaluate(function () {
    var rows = []; for (var t = 0; t <= 9; t++) rows.push(SolModes.raidKindsFor(t).join("+"));
    var B = SolModes.BIRDS;
    return { rows: rows.join(" | "), hp: Object.keys(B).map(function (k) { return k + ":" + B[k].hp; }).join(","), owl: B.owl.drops(3), raven0: B.raven.drops(0), raven1: B.raven.drops(1),
      steer: B.hawk.steer > 0 && B.falcon.steer > B.hawk.steer && !B.raven.steer, fast: B.falcon.dur < B.magpie.dur && B.magpie.dur < 1, wobble: B.magpie.wobble > 0 };
  });
  console.log("birds table", JSON.stringify(birds.table));
  check(birds.table.rows === "raven+raven | magpie+raven | hawk+raven | hawk+magpie | hawk+owl+raven | hawk+owl+magpie | falcon+hawk+raven | falcon+owl+magpie | falcon+hawk+owl | raven+magpie+hawk+owl+falcon" &&
    birds.table.hp === "raven:1,magpie:1,hawk:2,owl:1,falcon:1" && birds.table.owl === 3 && birds.table.raven0 === 1 && birds.table.raven1 === 2 && birds.table.steer && birds.table.fast && birds.table.wobble,
    "Eagle Swoop (v5.12): each realm's rows are their own kinds of bird (Ragnarok mixes all five); a hawk has two lives, an owl drops three, hawks and falcons steer, magpies zig-zag: " + JSON.stringify(birds.table));
  /* level 28 (realm 3): hawks over ravens; the card names the birds and what came in while Eagle Swoop was away (realm 2) */
  await gotoLevel(28);
  await page.evaluate(pageHelpers);
  birds.run = await page.evaluate(async function () {
    var s = SolScene, R = s.raid, o = { mode: s.mode.id, tier: s.tier, card: (document.getElementById("mode-card") || {}).textContent || "" };
    s.spareLives = 9; s.perks = {}; s.iframeMs = 1e9;
    o.kinds = R.ravSlots.map(function (q) { return q.bird; }).filter(function (k, i, a) { return a.indexOf(k) === i; }).join("+");
    o.toldBirds = !!R.told.birds;
    o.tex = R.ravens.filter(function (q) { return q.bird === "hawk"; }).every(function (q) { return q.spr.texture.key.indexOf("md-hawk-") === 0; });
    R.ravens.forEach(function (q) { if (q.state === "wait") q.delay = 0; });
    await __until(function () { return R.ready; });
    var rowBirds = function () { return R.ravens.filter(function (q) { return q.alive && q.kind === "raven" && !q.guard; }); };
    var hawk = rowBirds().filter(function (q) { return q.bird === "hawk"; })[0];
    if (!hawk) { o.err = "no hawk in the rows"; return o; }
    var k0 = s.kills;
    s.raidHit(hawk); o.hawk1 = { alive: hawk.alive, hp: hawk.hp, kills: s.kills - k0 };
    s.raidHit(hawk); o.hawk2 = { alive: hawk.alive, kills: s.kills - k0, strikes: s.strikes };
    /* rows never refill: shoot down six row birds; nothing flies in to replace them (the old code sent four more every 5 s) */
    rowBirds().slice(0, 6).forEach(function (q) { var n = 0; while (q.alive && n++ < 4) s.raidHit(q); });
    var after = rowBirds().length, total = R.ravSlots.length;
    await __gameWait(7000);
    o.refill = { slots: total, after: after, after7s: rowBirds().length };
    return o;
  });
  await page.waitForTimeout(1500);
  await shot("22a-eagle-swoop-realm3-hawks");
  /* the teacher's rule: the last answer leaves the rest of the flock to clear */
  birds.clear = await page.evaluate(async function () {
    var s = SolScene, R = s.raid, o = {};
    s.spareLives = 0; s.perks = {}; s.iframeMs = 1e9; s.strikes = 0; s.claimWrong = 0;
    /* one bird is still off-screen when the last answer comes: the clearing must fly it in */
    var off = R.ravens.filter(function (q) { return q.alive && q.kind === "raven" && !q.guard && q.state === "form"; })[0];
    if (off) { off.state = "wait"; off.delay = 1e9; off.path = null; off.x = -99; off.y = -99; off.spr.setPosition(-99, -99); }
    s.score = s.needExtracts - 1; s.extracted = [];
    var waiting = R.ravens.filter(function (q) { return q.alive && q.state === "wait"; }).length;
    R.ravens.filter(function (q) { return q.alive && q.letter && s.need.indexOf(q.letter) !== -1; }).forEach(function (q) { var n = 0; while (q.alive && n++ < 5) s.raidHit(q); });
    o.after = { score: s.score, need: s.needExtracts, ended: s.ended, finishing: s._finishing, mop: !!s._mopup, left: R.ravens.filter(function (q) { return q.alive; }).length,
      letters: R.ravens.filter(function (q) { return q.alive && q.letter; }).length, labels: R.ravens.filter(function (q) { return q.label || q.shield; }).length, waiting: waiting };
    await __until(function () { return s._mopup && s._mopup.left > 0 && !!s._mopBanner; }, 15000);
    o.banner = s._mopBanner ? s._mopBanner.t.text : "";
    /* the side panel says it too, once the "+10 coins" note for the answer has had its moment */
    await __until(function () { return /clear the sky/.test((document.getElementById("carry-flag") || {}).textContent || ""); }, 60000);
    o.flag = (document.getElementById("carry-flag") || {}).textContent || "";
    o.hp1 = R.ravens.every(function (q) { return q.hp === 1; });
    await __gameWait(1500);
    o.stillWaiting = R.ravens.filter(function (q) { return q.alive && q.state === "wait"; }).length;
    o.oneShot = (function () { var e = R.ravens.filter(function (q) { return q.alive && q.kind === "eagle"; })[0]; if (!e) return "no eagle"; s.raidHit(e); return !e.alive; })();
    return o;
  });
  await page.waitForTimeout(800);
  await shot("22b-eagle-swoop-clear-the-sky");
  /* losing the last life while clearing still loses the level */
  birds.lose = await page.evaluate(async function () {
    var s = SolScene; s.iframeMs = 0; s.spareLives = 0; s.perks = {}; s.strikes = s.needStrikes - 1;
    var mop = !!s._mopup;
    s.loseLife("hit", "A RAVEN CRASHED INTO YOU");
    await __until(function () { return s.ended; }, 20000);
    return { mop: mop, ended: s.ended, title: document.getElementById("win-title").textContent, retry: !document.getElementById("btn-retry").classList.contains("hidden") };
  });
  await retryLevel(28);
  await page.evaluate(pageHelpers);
  birds.win = await page.evaluate(async function () {
    var s = SolScene, R = s.raid, o = {};
    s.spareLives = 0; s.perks = {}; s.iframeMs = 1e9; s.strikes = 0; s.claimWrong = 0;
    R.ravens.forEach(function (q) { if (q.state === "wait") q.delay = 0; });
    await __until(function () { return R.ready; });
    s.score = s.needExtracts - 1; s.extracted = [];
    R.ravens.filter(function (q) { return q.alive && q.letter && s.need.indexOf(q.letter) !== -1; }).forEach(function (q) { var n = 0; while (q.alive && n++ < 5) s.raidHit(q); });
    o.mop = !!s._mopup && !s.ended;
    /* everything but one guard (guards never dive, so it can't crash into Sol) */
    var keep = R.ravens.filter(function (q) { return q.alive && q.guard; })[0] || R.ravens.filter(function (q) { return q.alive && q.kind === "eagle"; })[0];
    R.ravens.filter(function (q) { return q.alive && q !== keep; }).forEach(function (q) { var n = 0; while (q.alive && n++ < 4) s.raidHit(q); });
    await __until(function () { return s._mopup && s._mopup.left === 1; }, 15000);
    await __gameWait(1500);
    o.oneLeft = { left: s._mopup && s._mopup.left, ended: s.ended, finishing: s._finishing, banner: s._mopBanner ? s._mopBanner.t.text : "" };
    var coins = s.nightCoins;
    s.raidHit(keep);
    await __until(function () { return s.ended; }, 20000);
    o.end = { ended: s.ended, title: document.getElementById("win-title").textContent, msg: document.getElementById("win-msg").textContent, coins: s.nightCoins - coins, hit: s._mopup && s._mopup.hit };
    return o;
  });
  console.log("birds", JSON.stringify(birds));
  var br = birds.run || {};
  check(!br.err && br.mode === "raid" && br.tier === 2 && br.kinds === "hawk+raven" && br.tex && br.toldBirds && /Birds in the rows:.*Hawks \(take two arrows/.test(br.card) && /New this time:.*Magpies.*Hawks take the top row/.test(br.card),
    "Eagle Swoop at level 28 (v5.12): hawks over ravens, drawn as hawks; the card lists the birds in the rows and what came in while the mode was away (magpies, realm 2): " + JSON.stringify({ err: br.err, kinds: br.kinds, tier: br.tier, card: (br.card || "").slice(-300) }));
  check(br.hawk1 && br.hawk1.alive && br.hawk1.hp === 1 && br.hawk1.kills === 0 && br.hawk2.alive === false && br.hawk2.kills === 1 && br.hawk2.strikes === 0, "Eagle Swoop (v5.12): a hawk takes two arrows: " + JSON.stringify({ h1: br.hawk1, h2: br.hawk2 }));
  check(br.refill && br.refill.after <= br.refill.slots - 6 && br.refill.after7s <= br.refill.after, "Eagle Swoop (v5.12): the rows never refill — a bird shot down stays down: " + JSON.stringify(br.refill));
  var bc = birds.clear || {}, bca = bc.after || {};
  check(bca.score === bca.need && !bca.ended && !bca.finishing && bca.mop && bca.left > 0 && bca.letters === 0 && bca.labels === 0 && bca.waiting > 0 && bc.stillWaiting === 0 && bc.hp1 && bc.oneShot === true,
    "Eagle Swoop (v5.12, the teacher's rule): answering the last question doesn't win — the eagles drop their letters, every bird falls to one arrow, and a bird still off-screen flies in to be shot: " + JSON.stringify(bc));
  check(/All questions answered — now clear the sky!/.test(bc.banner || "") && /\d+ birds? left/.test(bc.banner || "") && /clear the sky/.test(bc.flag || ""), "Eagle Swoop (v5.12): a banner says to clear the sky and counts the birds left (and the side panel says it too): " + JSON.stringify({ banner: bc.banner, flag: bc.flag }));
  check(birds.lose && birds.lose.mop && birds.lose.ended && birds.lose.title === "Run over" && birds.lose.retry, "Eagle Swoop (v5.12): losing the last life while clearing the sky still loses the level: " + JSON.stringify(birds.lose));
  var bw = birds.win || {};
  check(bw.mop && bw.oneLeft && bw.oneLeft.left === 1 && !bw.oneLeft.ended && !bw.oneLeft.finishing && /1 bird left/.test(bw.oneLeft.banner) && bw.end && bw.end.ended && bw.end.title === "Eagle Swoop cleared" && /You earned \d+ coins/.test(bw.end.msg) && bw.end.coins >= 3 && bw.end.hit === false,
    "Eagle Swoop (v5.12): with one bird left the level goes on; shooting the last one wins it, with the usual end screen and a clean-sweep bonus: " + JSON.stringify(bw));
  /* realm 7 (Eagle Swoop picked alone: the Mixed rotation skips it in realm 7) and realm 8 (Mixed): the other birds, for the pictures */
  await page.evaluate(function () { SolModes.only = "raid"; });
  await gotoLevel(64);
  await page.evaluate(pageHelpers);
  birds.r7 = await page.evaluate(async function () {
    var s = SolScene, R = s.raid; s.iframeMs = 1e9; s.spareLives = 9;
    R.ravens.forEach(function (q) { if (q.state === "wait") q.delay = 0; });
    await __until(function () { return R.ready; }); await __gameWait(2500);
    return { tier: s.tier, kinds: R.ravSlots.map(function (q) { return q.bird; }).filter(function (k, i, a) { return a.indexOf(k) === i; }).join("+") };
  });
  await shot("22c-eagle-swoop-realm7-falcons");
  await page.evaluate(function () { SolModes.only = null; });
  await gotoLevel(78);
  await page.evaluate(pageHelpers);
  birds.r8 = await page.evaluate(async function () {
    var s = SolScene, R = s.raid; s.iframeMs = 1e9; s.spareLives = 9;
    R.ravens.forEach(function (q) { if (q.state === "wait") q.delay = 0; });
    await __until(function () { return R.ready; }); await __gameWait(2500);
    return { mode: s.mode.id, tier: s.tier, kinds: R.ravSlots.map(function (q) { return q.bird; }).filter(function (k, i, a) { return a.indexOf(k) === i; }).join("+"), card: (document.getElementById("mode-card") || {}).textContent || "" };
  });
  await shot("22d-eagle-swoop-realm8-owls-magpies");
  console.log("birds r7/r8", JSON.stringify({ r7: birds.r7, r8: { mode: birds.r8.mode, tier: birds.r8.tier, kinds: birds.r8.kinds } }));
  check(birds.r7.tier === 6 && birds.r7.kinds === "falcon+hawk+raven" && birds.r8.mode === "raid" && birds.r8.tier === 7 && birds.r8.kinds === "falcon+owl+magpie" && /New this time:.*Falcons take the top row.*formation drop poo/.test(birds.r8.card),
    "Eagle Swoop (v5.12): realm 7 brings falcons over hawks and ravens; realm 8 (level 78, after a realm away) falcons, owls and magpies, and its card tells both realms' news: " + JSON.stringify({ r7: birds.r7, r8: birds.r8.kinds }));

  /* Root Worms (centipede): first in the Mixed rotation on level 18 */
  await gotoLevel(18);
  await page.evaluate(pageHelpers);
  var worms = {};
  await page.waitForTimeout(2500);
  await shot("23a-root-worms-18");
  await page.evaluate(function () {
    /* the scripted checks: no hazards, no mushrooms, the worms frozen and laid out in plain rows */
    window.__wq = function () {
      var s = SolScene, wm = s.wm;
      wm.spiderCd = wm.fleaCd = wm.wispCd = 1e9;
      ["spider", "flea", "wisp"].forEach(function (k) { if (wm[k] && wm[k].spr) wm[k].spr.destroy(); wm[k] = null; });
      wm.arrows.forEach(function (a) { a.spr.destroy(); }); wm.arrows = [];
      Object.keys(wm.shrooms).forEach(function (k) { s.wormShroomRemove(wm.shrooms[k]); });
      wm.worms.forEach(function (w, k) {
        w.stepMs = 1e9; w.acc = 0; w.dir = 1; w.vdir = 1; w.plunge = false;
        var n = w.segs.length; w.segs.forEach(function (e, i) { e.c = e.pc = 1 + n - 1 - i; e.r = e.pr = 3 + 2 * k; });
      });
    };
    window.__ws = async function (e) {   /* an arrow just under segment e */
      var wm = SolScene.wm;
      wm.arrows.forEach(function (a) { a.spr.destroy(); }); wm.arrows = [];
      wm.arrows.push({ x: e.x, y: e.y + 30, spr: SolScene.add.image(e.x, e.y + 30, "md-arrow") });
      await __until(function () { return !wm.arrows.length; }, 15000);
    };
    window.__wsegs = function () { var out = []; SolScene.wm.worms.forEach(function (w) { w.segs.forEach(function (e, j) { out.push({ e: e, w: w, j: j }); }); }); return out; };
  });
  worms.run = await page.evaluate(async function () {
    var s = SolScene, wm = s.wm, p = s.player, o = { key: s.sys.settings.key, mode: s.mode.id, tier: s.tier, act: document.getElementById("btn-action").textContent, card: (document.getElementById("mode-card") || {}).textContent || "",
      hint: (document.getElementById("read-hint") || {}).textContent || "" };
    s.spareLives = 0; s.perks = {}; s.strikes = 0; s.iframeMs = 0; s.claimWrong = 0;
    __wq();
    var lead = wm.worms[0];
    await __until(function () { var h = lead.segs[0]; return h && Math.abs(h.x - s.wormCellX(h.c)) < 1 && Math.abs(h.y - s.wormCellY(h.r)) < 1; }, 15000);
    o.len = lead.segs.length; o.letters = lead.segs.filter(function (e) { return e.letter; }).map(function (e) { return e.letter; }).join("");
    o.choices = s.choiceLetters().slice().sort().join("");
    var need = s.need.slice();
    /* a wrong glowing segment: a life; it is gone, a mushroom grows where it was, and the worm is split */
    var ws = lead.segs.filter(function (e) { return e.letter && need.indexOf(e.letter) === -1; })[0];
    if (!ws) { o.err = "no wrong letter on the worm"; return o; }
    var wc = ws.c, wr = ws.r, wL = ws.letter, nW = wm.worms.length;
    await __ws(ws);
    o.wrong = { strikes: s.strikes, gone: !__wsegs().some(function (q) { return q.e.letter === wL; }), shroom: !!wm.shrooms[s.wormKey(wc, wr)], split: wm.worms.length - nW };
    s.strikes = 0; s.iframeMs = 0; s.claimWrong = 0;
    /* a plain segment: no life; it becomes a mushroom and the worm splits in two */
    var pick = null;
    wm.worms.forEach(function (q) { q.segs.forEach(function (e, j) { if (!pick && j >= 1 && j < q.segs.length - 1 && !e.letter) pick = { w: q, j: j }; }); });
    if (!pick) { o.err = "no plain segment in the middle of a worm to split"; return o; }
    var w = pick.w, e1 = w.segs[pick.j], c1 = e1.c, r1 = e1.r, n1 = wm.worms.length, k1 = s.kills;
    await __ws(e1);
    o.split = { worms: wm.worms.length - n1, shroom: !!wm.shrooms[s.wormKey(c1, r1)], kills: s.kills - k1, front: w.segs.length, at: pick.j, strikes: s.strikes };
    /* a worm that reaches Sol bites: a life; a plain segment that bit is eaten, a glowing one stays */
    var bc = clamp0(Math.round((p.x - wm.x0) / wm.cs), 3, wm.cols - 2), brow = wm.zone + 2;
    function clamp0(v, a, b) { return v < a ? a : v > b ? b : v; }
    p.x = s.wormCellX(bc); p.y = s.wormCellY(brow) + 8;
    var bw = s.wormMake(3, brow, true, [], 0, false); bw.stepMs = 1e9; bw.acc = 0;
    bw.segs.forEach(function (e, i) { e.c = e.pc = bc - i; e.r = e.pr = brow; });
    s.strikes = 0; s.iframeMs = 0;
    await __until(function () { return s.strikes > 0; }, 15000);
    o.bite = { strikes: s.strikes, label: s._lastHitLabel, eaten: bw.segs.length < 3 };
    wm.worms.filter(function (q) { return q === bw || q.segs.some(function (e) { return e.r === brow; }); }).forEach(function (q) { q.segs.forEach(function (e) { e.spr.destroy(); if (e.label) e.label.destroy(); }); q.segs.length = 0; });
    wm.worms = wm.worms.filter(function (q) { return q.segs.length; });
    var gw = s.wormMake(3, brow, true, ["Q"], 0, false); gw.stepMs = 1e9; gw.acc = 0;
    gw.segs.forEach(function (e, i) { e.c = e.pc = bc + 2 - i; e.r = e.pr = brow; });   /* its glowing segment (the third) on Sol */
    s.strikes = 0; s.iframeMs = 0;
    await __until(function () { return s.strikes > 0; }, 15000);
    o.biteGlow = { strikes: s.strikes, kept: gw.segs.some(function (e) { return e.letter === "Q"; }) };
    gw.segs.forEach(function (e) { e.spr.destroy(); if (e.label) e.label.destroy(); }); gw.segs.length = 0; wm.worms = wm.worms.filter(function (q) { return q.segs.length; });
    p.y = s.H - 60; s.strikes = 0; s.iframeMs = 0;
    /* the field can't trap a worm: one at the bottom turns and keeps moving inside the clearing; a piece split off
       before it came in walks onto the field (the Chemistry code let it walk away for good) */
    var segs = [], i, okR = true, okC = true;
    for (i = 0; i < 6; i++) segs.push({ c: wm.cols - 1 - i, r: wm.rows - 1, pc: 0, pr: 0 });
    var tw = { segs: segs, dir: 1, vdir: 1, plunge: false };
    for (i = 0; i < 400; i++) { s.wormStep(tw); tw.segs.forEach(function (e) { if (e.r < wm.zone || e.r >= wm.rows) okR = false; if (e.c < 0 || e.c >= wm.cols) okC = false; }); }
    var og = { segs: [{ c: -3, r: 2, pc: -3, pr: 2 }, { c: -4, r: 2, pc: -4, pr: 2 }], dir: -1, vdir: 1, plunge: false };
    for (i = 0; i < 6; i++) s.wormStep(og);
    o.field = { bottomStays: okR && okC, offEdgeComesIn: og.segs[0].c >= 0 && og.segs[0].c < wm.cols };
    /* a Select TWO question: the first right segment is half the answer (it shows a tick), the second answers it */
    var live = __wsegs().filter(function (q) { return q.e.letter && !q.e.dead; });
    var two = live.map(function (q) { return q.e.letter; }).slice(0, 2);
    if (two.length < 2) { o.err = "fewer than two letters left for the Select TWO check"; return o; }
    s.need = two.slice(); s.extracted = []; var sc0 = s.score, coins0 = s.nightCoins;
    var first = live.filter(function (q) { return q.e.letter === two[0]; })[0].e;
    await __ws(first);
    o.two = { first: s.score - sc0, found: s.extracted.join(""), tick: first.dead && first.label && first.label.text === "✓", strikes: s.strikes };
    var second = __wsegs().filter(function (q) { return q.e.letter === two[1] && !q.e.dead; })[0];
    if (!second) { o.err = "the second letter vanished"; return o; }
    await __ws(second.e);
    o.two.second = s.score - sc0; o.two.coins = s.nightCoins > coins0; o.two.strikes = s.strikes;
    /* the next question: its own fresh worm; the right glowing segment (or two) answers it */
    await __readGo();
    __wq();
    await __until(function () { var h = wm.worms[0] && wm.worms[0].segs[0]; return h && Math.abs(h.x - s.wormCellX(h.c)) < 1; }, 15000);
    var sc1 = s.score; o.nextNeed = s.need.length; s.strikes = 0;
    for (var j = 0; j < s.need.length; j++) { var q = __wsegs().filter(function (z) { return z.e.letter === s.need[j] && !z.e.dead; })[0]; if (q) await __ws(q.e); }
    o.right = s.score - sc1; o.rightStrikes = s.strikes;
    return o;
  });
  /* the teacher's rule in Root Worms: the last answer leaves every worm segment to shoot */
  await page.evaluate(function () { return __readGo(); });
  worms.clear = await page.evaluate(async function () {
    var s = SolScene, wm = s.wm, o = {};
    s.spareLives = 0; s.perks = {}; s.iframeMs = 1e9; s.strikes = 0;
    __wq();
    await __until(function () { var h = wm.worms[0] && wm.worms[0].segs[0]; return h && Math.abs(h.x - s.wormCellX(h.c)) < 1; }, 15000);
    s.score = s.needExtracts - 1; s.extracted = [];
    s.need.slice().forEach(function (L) { var q = __wsegs().filter(function (z) { return z.e.letter === L && !z.e.dead; })[0]; if (q) s.wormShot(q.w, q.j); });
    var segs = __wsegs();
    o.after = { score: s.score, need: s.needExtracts, ended: s.ended, finishing: s._finishing, mop: !!s._mopup, left: segs.length,
      letters: segs.filter(function (q) { return q.e.letter; }).length, labels: segs.filter(function (q) { return q.e.label; }).length };
    await __until(function () { return s._mopup && s._mopup.left > 0 && !!s._mopBanner; }, 15000);
    o.banner = s._mopBanner ? s._mopBanner.t.text : "";
    await __until(function () { return /clear the field/.test((document.getElementById("carry-flag") || {}).textContent || ""); }, 60000);
    o.flag = (document.getElementById("carry-flag") || {}).textContent || "";
    /* one arrow takes a segment down now */
    var e = __wsegs()[0] && __wsegs()[0].e, before = __wsegs().length;
    if (e) await __ws(e);
    o.oneShot = before - __wsegs().length;
    /* let them move again for the picture */
    wm.worms.forEach(function (w) { w.stepMs = wm.P.stepMs; });
    return o;
  });
  await page.waitForTimeout(1800);
  await shot("23b-root-worms-clear-the-field");
  worms.lose = await page.evaluate(async function () {
    var s = SolScene; s.iframeMs = 0; s.spareLives = 0; s.perks = {}; s.strikes = s.needStrikes - 1;
    var mop = !!s._mopup;
    s.loseLife("hit", "A WORM BIT YOU");
    await __until(function () { return s.ended; }, 20000);
    return { mop: mop, ended: s.ended, title: document.getElementById("win-title").textContent, retry: !document.getElementById("btn-retry").classList.contains("hidden") };
  });
  await retryLevel(18);
  await page.evaluate(pageHelpers);
  worms.win = await page.evaluate(async function () {
    var s = SolScene, wm = s.wm, o = {};
    s.spareLives = 0; s.perks = {}; s.iframeMs = 1e9; s.strikes = 0; s.claimWrong = 0;
    __wq();
    await __until(function () { var h = wm.worms[0] && wm.worms[0].segs[0]; return h && Math.abs(h.x - s.wormCellX(h.c)) < 1; }, 15000);
    s.score = s.needExtracts - 1; s.extracted = [];
    s.need.slice().forEach(function (L) { var q = __wsegs().filter(function (z) { return z.e.letter === L && !z.e.dead; })[0]; if (q) s.wormShot(q.w, q.j); });
    o.mop = !!s._mopup && !s.ended;
    var keep = __wsegs()[0] && __wsegs()[0].e, guard = 0;
    while (__wsegs().length > 1 && guard++ < 300) { var q = __wsegs().filter(function (z) { return z.e !== keep; })[0]; if (!q) break; s.wormShot(q.w, q.j); }
    await __until(function () { return s._mopup && s._mopup.left === 1; }, 15000);
    await __gameWait(1500);
    o.oneLeft = { left: s._mopup && s._mopup.left, ended: s.ended, finishing: s._finishing, banner: s._mopBanner ? s._mopBanner.t.text : "" };
    var coins = s.nightCoins, last = __wsegs()[0];
    if (last) s.wormShot(last.w, last.j);
    await __until(function () { return s.ended; }, 20000);
    o.end = { ended: s.ended, title: document.getElementById("win-title").textContent, msg: document.getElementById("win-msg").textContent, coins: s.nightCoins - coins };
    return o;
  });
  console.log("worms", JSON.stringify(worms));
  var wr = worms.run || {};
  check(!wr.err && wr.key === "mode" && wr.mode === "worms" && wr.tier === 1 && wr.act === "FIRE" && /Root Worms/.test(wr.card) && /New this time:.*wolf prowls/.test(wr.card) && /Controls:/.test(wr.card) && /lab notes stay in the side panel|passage stays in the side panel|both glowing segments/.test(wr.hint) && !/lab notes/i.test(wr.card + wr.hint),
    "Root Worms (v5.12): level 18 plays it in the shooter scene, and its card explains it with this realm's news (a wolf): " + JSON.stringify({ err: wr.err, key: wr.key, mode: wr.mode, tier: wr.tier, act: wr.act }));
  check(wr.letters && wr.letters.split("").sort().join("") === wr.choices && wr.len >= 11, "Root Worms: the lead worm carries every answer letter on its glowing segments: " + JSON.stringify({ len: wr.len, letters: wr.letters, choices: wr.choices }));
  check(wr.wrong && wr.wrong.strikes === 1 && wr.wrong.gone && wr.wrong.shroom && wr.wrong.split === 1, "Root Worms: a wrong glowing segment costs a life, is gone, leaves a mushroom and splits the worm: " + JSON.stringify(wr.wrong));
  check(wr.split && wr.split.worms === 1 && wr.split.shroom && wr.split.kills === 1 && wr.split.front === wr.split.at && wr.split.strikes === 0, "Root Worms: shooting a plain segment splits the worm in two and leaves a mushroom, at no cost: " + JSON.stringify(wr.split));
  check(wr.bite && wr.bite.strikes === 1 && wr.bite.label === "A WORM BIT YOU" && wr.bite.eaten && wr.biteGlow && wr.biteGlow.strikes === 1 && wr.biteGlow.kept, "Root Worms: a worm reaching Sol costs a life; the plain segment that bit is eaten, a glowing one stays to be shot: " + JSON.stringify({ bite: wr.bite, glow: wr.biteGlow }));
  check(wr.field && wr.field.bottomStays && wr.field.offEdgeComesIn, "Root Worms (no soft-lock): a worm at the bottom keeps moving inside the clearing where it can be shot; a piece still off the edge walks onto the field: " + JSON.stringify(wr.field));
  check(wr.two && wr.two.first === 0 && wr.two.found.length === 1 && wr.two.tick && wr.two.second === 1 && wr.two.coins && wr.two.strikes === 0 && wr.right === 1 && wr.rightStrikes === 0,
    "Root Worms: a Select TWO question needs both right segments (the first shows a tick), and the right segment answers the next question: " + JSON.stringify({ two: wr.two, right: wr.right, need: wr.nextNeed }));
  var wc = worms.clear || {}, wca = wc.after || {};
  check(wca.score === wca.need && !wca.ended && !wca.finishing && wca.mop && wca.left > 0 && wca.letters === 0 && wca.labels === 0 && wc.oneShot === 1,
    "Root Worms (v5.12, the teacher's rule): answering the last question doesn't win — the segments lose their letters and every one left has to be shot (one arrow each): " + JSON.stringify(wc));
  check(/All questions answered — now clear the field!/.test(wc.banner || "") && /\d+ worm segments? left/.test(wc.banner || "") && /clear the field/.test(wc.flag || ""), "Root Worms (v5.12): a banner says to clear the field and counts the segments left: " + JSON.stringify({ banner: wc.banner, flag: wc.flag }));
  check(worms.lose && worms.lose.mop && worms.lose.ended && worms.lose.title === "Run over" && worms.lose.retry, "Root Worms (v5.12): losing the last life while clearing still loses the level: " + JSON.stringify(worms.lose));
  var ww = worms.win || {};
  check(ww.mop && ww.oneLeft && ww.oneLeft.left === 1 && !ww.oneLeft.ended && !ww.oneLeft.finishing && /1 worm segment left/.test(ww.oneLeft.banner) && ww.end && ww.end.ended && ww.end.title === "Root Worms cleared" && /You earned \d+ coins/.test(ww.end.msg) && ww.end.coins >= 3,
    "Root Worms (v5.12): with one segment left the level goes on; shooting the last one wins it, with the usual end screen and coins: " + JSON.stringify(ww));

  /* v5.7.9: every time a mode comes round (once a realm) it adds something; the Ragnarok levels have it all.
     v5.12: realm 10 of the Mixed rotation is 92 Root Worms, 94 Eagle Swoop, 96 Rune Rocks, 98 Sun Chariot; Wolf Ring
     sits that realm out, so it is picked alone for its Ragnarok check (level 99) */
  var tiers = {};
  await gotoLevel(92);
  await page.evaluate(pageHelpers);
  tiers.worms = await page.evaluate(async function () {
    var s = SolScene, wm = s.wm; s.iframeMs = 1e9; s.spareLives = 9;
    var o = { mode: s.mode.id, tier: s.tier, card: (document.getElementById("mode-card") || {}).textContent || "", worms: wm.worms.length,
      helm: !!(wm.worms[0] && wm.worms[0].segs[0] && wm.worms[0].segs[0].hp === 2), len: wm.worms[0] ? wm.worms[0].segs.length : 0, seen: {} };
    wm.spiderCd = 0; wm.fleaCd = 0; wm.wispCd = 0;
    var t0 = s.time.now;
    await __until(function () { ["spider", "flea", "wisp"].forEach(function (k) { if (wm[k]) o.seen[k] = true; }); return (o.seen.spider && o.seen.flea && o.seen.wisp) || s.time.now - t0 > 6000; }, 60000);
    await __gameWait(1500);
    return o;
  });
  await shot("23c-root-worms-ragnarok");
  await gotoLevel(94);
  tiers.raid = await page.evaluate(async function () {
    var s = SolScene, R = s.raid; s.iframeMs = 1e9; s.spareLives = 9;
    R.ravens.forEach(function (e) { if (e.state === "wait" || e.state === "enter") { e.state = "form"; e.path = null; } });
    R.cloudCd = 0; R.swapCd = 0;
    await new Promise(function (r) { setTimeout(r, 2500); });
    return { tier: s.tier, card: (document.getElementById("mode-card") || {}).textContent || "", clouds: (R.clouds || []).length, swapped: !!R.toldSwap,
      helm: R.ravens.filter(function (o) { return o.kind === "eagle"; }).every(function (o) { return o.hp === 3; }), rows: R.ravSlots.length };
  });
  await shot("20a-eagle-swoop-ragnarok");
  await gotoLevel(96);
  tiers.rocks = await page.evaluate(async function () {
    var s = SolScene, R = s.rk; s.iframeMs = 1e9; s.spareLives = 9; s._beamHelpDone = true; s.helpOpen = false; s.hideBeamHelp();
    R.cometCd = 0; R.valkCd = 0; R.showerCd = 0;
    await new Promise(function (r) { setTimeout(r, 1500); });
    var o = { tier: s.tier, warned: R.warns.length > 0, valk: !!R.valk, guards: R.rocks.filter(function (q) { return q.orbitOf; }).length, iron: R.rocks.some(function (q) { return q.hp === 2; }) };
    await new Promise(function (r) { setTimeout(r, 1300); });
    o.comet = R.rocks.some(function (q) { return q.comet; }) || o.warned;
    /* v5.8.4: harder every level — more, faster rocks, fuller fields, waves within a level, saucers */
    var lv = [], k, ok = true;
    for (k = 1; k <= 100; k++) lv.push(s.rkParams(k, 1));
    for (k = 1; k < 100; k++) {
      var a = lv[k - 1], b = lv[k];
      if (!(b.speed > a.speed && b.speedAdd > a.speedAdd && b.spawnMs <= a.spawnMs && b.start >= a.start && b.cap >= a.cap && b.saucerMs <= a.saucerMs)) ok = false;
      if (!(b.spawnMs < a.spawnMs || b.start > a.start || b.cap > a.cap || b.speed > a.speed)) ok = false;
    }
    o.ramp = { ok: ok, start: [lv[0].start, lv[49].start, lv[99].start], cap: [lv[0].cap, lv[49].cap, lv[99].cap], saucer: [lv[4].saucer, lv[5].saucer], small: [lv[14].smallShare, lv[15].smallShare] };
    var w1 = s.rkParams(40, 1), w3 = s.rkParams(40, 3);
    o.waves = w3.cap > w1.cap && w3.speed > w1.speed && w3.waveAdd > 0 && w1.waveAdd === 0;
    var big0 = R.rocks.filter(function (q) { return q.size === 3 && !q.letter; }).length, wv = R.wave;
    s.answers_rocks();
    o.waveRocks = R.wave === wv + 1 && R.rocks.filter(function (q) { return q.size === 3 && !q.letter; }).length >= big0 + s.rkParams(s.night, R.wave).waveAdd;
    /* a saucer flies in, shoots, and can be shot down for a bonus */
    R.saucers.forEach(function (u) { u.spr.destroy(); }); R.saucers = []; R.saucerCd = 0;
    await new Promise(function (r) { setTimeout(r, 900); });
    o.saucer = R.saucers.length === 1;
    await new Promise(function (r) { setTimeout(r, 1400); });
    o.saucerShot = R.sBullets.length > 0 || (R.saucers[0] && R.saucers[0].fireCd < 1300);
    var u0 = R.saucers[0];
    if (u0) s.saucerDown(u0, true);
    o.saucerDown = !!u0 && R.saucers.length === 0;
    /* a saucer's shot costs a life */
    s.iframeMs = 0; var st0 = s.strikes, sp0 = s.spareLives;
    R.sBullets.push({ x: R.ship.x + 4, y: R.ship.y, vx: 0, vy: 0, life: 1, spr: s.add.image(R.ship.x, R.ship.y, "md-bolt") });
    await new Promise(function (r) { setTimeout(r, 200); });
    o.saucerHurts = s.strikes > st0 || s.spareLives < sp0;
    s.iframeMs = 1e9;
    return o;
  });
  await shot("20b-rune-rocks-ragnarok");
  await gotoLevel(98);
  tiers.sky = await page.evaluate(async function () {
    var s = SolScene; s.iframeMs = 1e9; s.spareLives = 9;
    await new Promise(function (r) { setTimeout(r, 2500); });
    return { tier: s.tier, flip: s.sky.P.flip, gap: s.sky.P.gapHalf, orbs: s.sky.orbs.length };
  });
  await shot("20c-sun-chariot-ragnarok");
  await page.evaluate(function () { SolModes.only = "ring"; });
  await gotoLevel(99);
  await page.evaluate(function () { SolModes.only = null; });
  tiers.ring = await page.evaluate(async function () {
    var s = SolScene, G = s.rg; s.iframeMs = 1e9; s.spareLives = 9; G.alphaCd = 0; G.ravCd = 0;
    await new Promise(function (r) { setTimeout(r, 2600); });
    return { tier: s.tier, alpha: G.wolves.some(function (w) { return w.alpha; }), raven: !!G.rav || G.drops.length > 0, ammo: G.ammo, short: G.upMs };
  });
  await shot("20d-wolf-ring-ragnarok");
  /* v5.8.4: every mode is harder at every level than at the one before (never easier on any setting) */
  var ramp = await page.evaluate(function () {
    var s = SolScene, out = {};
    function chk(name, f, up, down) {
      var easier = [], flat = [], n;
      for (n = 1; n < 100; n++) {
        var a = f(n), b = f(n + 1), harder = false, worse = false;
        up.forEach(function (k) { if (b[k] > a[k] + 1e-9) harder = true; if (b[k] < a[k] - 1e-9) worse = true; });
        down.forEach(function (k) { if (b[k] < a[k] - 1e-9) harder = true; if (b[k] > a[k] + 1e-9) worse = true; });
        if (worse) easier.push(n + 1); if (!harder) flat.push(n + 1);
      }
      out[name] = { easier: easier.slice(0, 6), flat: flat.slice(0, 6) };
    }
    chk("maze", function (n) { return window.__sol.nightConfig(n); }, ["coneRange", "coneHalf", "janPatrol", "janHurry", "janChase", "chaseMs", "cameraCount", "mazeCount", "extracts"], ["iframe", "strikes"]);
    chk("raid", function (n) { return s.raidParams(n); }, ["maxDivers", "diveSpd", "featherSp", "beamP"], ["diveCdMul"]);
    chk("rocks", function (n) { return s.rkParams(n, 1); }, ["start", "cap", "speed", "speedAdd", "smallShare"], ["spawnMs", "saucerMs", "aimErr", "saucerFireMs"]);
    chk("sky", function (n) { return s.skyParams(n); }, ["eff", "ravenSp", "featherSp", "orbSp", "throwP", "guards", "spin"], ["spawnMs", "gapHalf"]);
    chk("ring", function (n) { return s.ringParams(n); }, ["eff", "cap", "wolfSp", "packP", "packMax"], ["spawnMs", "upMs", "headStart", "alphaMs"]);
    /* v5.10: Scylla and Charybdis (the Odyssey build) */
    /* v5.12: Root Worms */
    chk("worms", function (n) { return s.wormsParams(n); }, ["worms", "len", "extraLen", "shrooms", "shroomHp", "spider", "spiderSp", "flea", "fleaSp", "fleaPlant", "wisp", "wispSp", "helm"], ["stepMs", "spiderMs", "fleaMs", "wispMs"]);
    out.wormsEnds = { l4: s.wormsParams(4), l18: s.wormsParams(18), l50: s.wormsParams(50), l99: s.wormsParams(99) };
    var r1 = s.ringParams(1), r8 = s.ringParams(8);
    out.ringStart = { cap: r1.cap, spawnMs: r1.spawnMs, wolfSp: r1.wolfSp, packP: r1.packP, l8: { cap: r8.cap, spawnMs: r8.spawnMs, wolfSp: r8.wolfSp } };
    return out;
  });
  console.log("ramp", JSON.stringify(ramp));
  ["maze", "raid", "rocks", "sky", "ring", "worms"].forEach(function (m) {
    check(ramp[m] && ramp[m].easier.length === 0 && ramp[m].flat.length === 0, "v5.8.4: " + m + " is harder at every level 2-100 than at the level before, and never easier: " + JSON.stringify(ramp[m]));
  });
  check(ramp.ringStart.cap >= 4 && ramp.ringStart.spawnMs < 1500 && ramp.ringStart.wolfSp > 180 && ramp.ringStart.packP > 0, "v5.8.4: Wolf Ring starts harder (4 wolves at once, sooner and faster, packs from the start): " + JSON.stringify(ramp.ringStart));
  console.log("tiers", JSON.stringify(tiers));
  var we = ramp.wormsEnds;
  console.log("wormsParams 4/18/50/99", JSON.stringify(we));
  check(we.l18.worms === 1 && we.l18.stepMs >= 160 && !we.l18.flea && !we.l18.wisp && !we.l18.helm && we.l18.spider === 1 && we.l4.spider === 0 && we.l4.stepMs > we.l18.stepMs,
    "Root Worms (v5.12): fair where it first comes (level 18: one slow worm and a wolf; level 4, picked alone: no wolf yet): " + JSON.stringify({ l4: we.l4, l18: we.l18 }));
  check(we.l99.worms === 3 && we.l99.stepMs <= 95 && we.l99.helm && we.l99.wisp && we.l99.flea && we.l99.len > we.l18.len && we.l99.shroomHp === 4 && we.l99.spiderMs < we.l18.spiderMs / 1.5,
    "Root Worms (v5.12): intense at level 99 (three fast worms, an iron helm, the wisp, falling ravens, a quicker wolf, tougher mushrooms): " + JSON.stringify(we.l99));
  var tw9 = tiers.worms || {};
  check(tw9.mode === "worms" && tw9.tier === 9 && /New this time/.test(tw9.card) && tw9.worms >= 3 && tw9.helm && tw9.seen.spider && tw9.seen.flea && tw9.seen.wisp,
    "Root Worms in Ragnarok (level 92): three worms, the iron helm, the wolf, falling ravens and the wisp, and the card says what's new: " + JSON.stringify({ mode: tw9.mode, tier: tw9.tier, worms: tw9.worms, helm: tw9.helm, seen: tw9.seen, len: tw9.len }));
  check(tiers.raid.tier === 9 && /New this time/.test(tiers.raid.card) && tiers.raid.clouds >= 1 && tiers.raid.swapped && tiers.raid.helm && tiers.raid.rows > 12, "Eagle Swoop in Ragnarok: storm clouds, eagles trading places, iron helms, three raven rows, and the card says what's new: " + JSON.stringify(tiers.raid).slice(0, 200));
  check(tiers.rocks.ramp && tiers.rocks.ramp.ok && tiers.rocks.ramp.start[2] > tiers.rocks.ramp.start[0] && tiers.rocks.ramp.cap[2] > tiers.rocks.ramp.cap[0] && !tiers.rocks.ramp.saucer[0] && tiers.rocks.ramp.saucer[1] && tiers.rocks.ramp.small[0] === 0 && tiers.rocks.ramp.small[1] > 0, "Rune Rocks (v5.8.4): every level is harder than the one before (faster rocks, faster respawns, never fewer rocks), saucers from level 6, small aiming saucers from 16: " + JSON.stringify(tiers.rocks.ramp));
  check(tiers.rocks.waves && tiers.rocks.waveRocks && tiers.rocks.saucer && tiers.rocks.saucerShot && tiers.rocks.saucerDown && tiers.rocks.saucerHurts, "Rune Rocks (v5.8.4): each new question sends a wave of big rocks; a dark-elf saucer flies in, fires, can be shot down, and its shot costs a life: " + JSON.stringify({ w: tiers.rocks.waves, wr: tiers.rocks.waveRocks, s: tiers.rocks.saucer, f: tiers.rocks.saucerShot, d: tiers.rocks.saucerDown, h: tiers.rocks.saucerHurts }));
  check(tiers.rocks.tier === 9 && tiers.rocks.comet && tiers.rocks.valk && tiers.rocks.guards >= 2 && tiers.rocks.iron, "Rune Rocks in Ragnarok: comets, a valkyrie, guard stones and iron rocks: " + JSON.stringify(tiers.rocks));
  check(tiers.sky.tier === 9 && tiers.sky.flip && tiers.sky.orbs > 0, "Sun Chariot in Ragnarok runs with reversing shields: " + JSON.stringify(tiers.sky));
  check(tiers.ring.tier === 9 && tiers.ring.alpha && tiers.ring.raven && tiers.ring.ammo <= 6, "Wolf Ring in Ragnarok: the alpha wolf, poo-dropping ravens and the quiver: " + JSON.stringify(tiers.ring));
  await gotoLevel(2);
  var retry = await page.evaluate(async function () {
    var s = SolScene; s.spareLives = 0; s.perks = {}; s.strikes = s.needStrikes - 1;
    s.answerWrong("Z", "WRONG LETTER");
    await new Promise(function (r) { setTimeout(r, 1500); });
    return { ended: s.ended, title: document.getElementById("win-title").textContent, msg: document.getElementById("win-msg").textContent, retry: !document.getElementById("btn-retry").classList.contains("hidden") };
  });
  await page.click("#btn-retry");
  await page.waitForTimeout(2500);
  retry.after = await page.evaluate(function () { var s = SolScene; return { key: s.sys.settings.key, night: s.night, strikes: s.strikes, mode: s.mode && s.mode.id }; });
  console.log("mode retry", JSON.stringify(retry));
  check(retry.ended && retry.title === "Run over" && /Eagle Swoop/.test(retry.msg) && retry.retry && retry.after.key === "mode" && retry.after.night === 2 && retry.after.strikes === 0, "losing a shooter level offers Retry, which restarts the same shooter");

  console.log("errors:", errors.length ? errors : "none");
  check(errors.length === 0, "no page errors");
  await browser.close(); srv.close();
  console.log(fails.length ? fails.length + " FAILED" : "ALL OK");
  process.exit(fails.length ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
