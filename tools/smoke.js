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
  var rot = await page.evaluate(function () { var o = []; for (var n = 1; n <= 20; n++) { var m = SolModes.modeFor(n); o.push(m ? m.id : "-"); } return o.join(","); });
  check(rot === "-,raid,-,rocks,-,sky,-,ring,-,-,-,raid,-,rocks,-,sky,-,ring,-,-", "shooter rotation: raid, rocks, sky, ring on even levels; maze on odd levels and bosses: " + rot);
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
    s.spareLives = 0; s.perks = {};
    /* the click test's arrows may have hit birds: a fresh wave, no lives spent */
    var R = s.raid;
    if (s._between) {   /* an arrow answered the question: let the next one load, then close its reading pop-up */
      await new Promise(function (r) { setTimeout(r, 1300); });
      var rgo = document.getElementById("read-go"); if (rgo && rgo.offsetParent) rgo.click();
      await new Promise(function (r) { setTimeout(r, 300); });
    }
    R.arrows.forEach(function (a) { a.spr.destroy(); }); R.arrows = [];
    if (s.ended || s._finishing) { o.endedEarly = true; }
    s.answers_raid(); s.strikes = 0; s.iframeMs = 0; s.claimWrong = 0; s.score = 0; s.paintHud();
    o.hud = document.getElementById("score-pip").textContent;
    var eagles = R.ravens.filter(function (q) { return q.letter; });
    o.eagles = eagles.length; o.ravens = R.ravens.filter(function (q) { return !q.letter && !q.guard; }).length;
    var wrong = eagles.filter(function (q) { return s.need.indexOf(q.letter) === -1; })[0];
    wrong.hp = 2; s.strikes = 0; s.iframeMs = 0;   /* the mouse test's arrows may have hit it */
    s.raidHit(wrong); o.afterOne = s.strikes + (wrong.alive ? 0 : 10);
    s.raidHit(wrong); o.wrong = s.strikes; s.strikes = 0; s.iframeMs = 0;
    R.feathers.push({ x: s.player.x, y: s.player.y - 20, vx: 0, t: 0, spr: s.add.image(s.player.x, s.player.y - 20, "md-poo") });
    await new Promise(function (r) { setTimeout(r, 600); }); o.feather = s.strikes; s.strikes = 0; s.iframeMs = 0;
    /* an eagle's beam over Sol catches him */
    var bm = R.ravens.filter(function (q) { return q.alive && q.letter && q.state !== "wait"; })[0] || R.ravens.filter(function (q) { return q.alive && q.letter; })[0];
    bm.state = "beam"; bm.beamMs = 900; bm.path = null; bm.x = s.player.x; bm.hoverY = s.H * 0.4; bm.y = bm.hoverY; bm.lead = true;
    await new Promise(function (r) { setTimeout(r, 700); }); o.beam = s.strikes; s.strikes = 0; s.iframeMs = 0;
    var coins = s.nightCoins;
    R.ravens.filter(function (q) { return q.alive && q.letter && s.need.indexOf(q.letter) !== -1; }).forEach(function (q) { s.raidHit(q); s.raidHit(q); });
    o.score = s.score; o.coins = s.nightCoins > coins;
    await new Promise(function (r) { setTimeout(r, 1800); });
    o.newWave = R.ravens.filter(function (q) { return q.alive && q.letter; }).length;
    var pip = document.getElementById("realm-pip"); o.pip = pip ? pip.textContent : "";
    return o;
  });
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
    if (rr) { rr.x = R.ship.x + 10; rr.y = R.ship.y; rr.vx = 0; rr.vy = 0; rr.beamT = s.time.now; }
    await new Promise(function (r) { setTimeout(r, 500); }); o.early = s.strikes; o.earlyLabel = s._lastHitLabel; s.strikes = 0; s.iframeMs = 0;
    s.need.forEach(function (N) { var q = R.rocks.filter(function (z) { return z.letter === N; })[0]; if (q) s.rockCaught(q); });
    o.score = s.score;
    try { o.learned = localStorage.getItem("afterHours.v1.beamLearned"); } catch (e) {}
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
  check(mr.raid.eagles >= 2 && mr.raid.ravens >= 12 && mr.raid.afterOne === 0 && mr.raid.wrong === 1 && mr.raid.feather === 1 && mr.raid.beam === 1 && mr.raid.score === 1 && mr.raid.coins && mr.raid.newWave > 0 && mr.raid.flying > 0 && !/Fenrir/.test(mr.raid.pip), "Eagle Swoop: eagles carry the letters above a raven guard; an eagle takes two arrows; a wrong letter, a feather and an eagle's beam each cost a life; the right eagle answers, pays coins and a new wave flies in: " + JSON.stringify(mr.raid));
  check(mr.raidPre && mr.raidPre.ready === false && mr.raidPre.firedEarly === 0 && mr.raidPre.after.ready, "Eagle Swoop: no shooting until the flock has formed: " + JSON.stringify(mr.raidPre));
  check(mr.raidPre && mr.raidPre.guards === 2 * mr.raidPre.eagles && mr.raidPre.after.flying >= 1, "Eagle Swoop: two guard ravens under every eagle, and once shooting starts a bird is always flying: " + JSON.stringify(mr.raidPre));
  check(mr.click && mr.click.moved < 2 && mr.click.fired >= 2, "Eagle Swoop: left and right mouse buttons shoot without moving Sol: " + JSON.stringify(mr.click));
  check(mr.rocks.mode === "rocks" && mr.rocks.pull !== "none" && mr.rocks.pullWrong === 1 && mr.rocks.blastRight === 1 && mr.rocks.blastWrong === 0 && mr.rocks.back && mr.rocks.hit === 1 && mr.rocks.score === 1, "Rune Rocks: pulling a wrong letter, blasting the right one and a rock hit cost a life; blasting a wrong letter is free; the right rock returns; beaming it in answers");
  check(mr.beamHelp && mr.beamHelp.shown && mr.beamHelp.paused && mr.beamHelp.right && mr.beamHelp.closed, "Rune Rocks: a one-card beam tutorial shows after the reading pop-up, pauses the level and closes with Got it: " + JSON.stringify({ shown: mr.beamHelp.shown, paused: mr.beamHelp.paused, closed: mr.beamHelp.closed }));
  check(mr.beamHelp && mr.beamHelp.rightBtn.rightPulls && mr.beamHelp.rightBtn.leftFires, "Rune Rocks: the right mouse button holds the beam; the left button fires");
  check(mr.rockMouse && mr.rockMouse.turned < 0.01 && mr.rockMouse.moved < 3 && mr.rockMouse.fired >= 1, "Rune Rocks: clicking fires without turning or moving the ship: " + JSON.stringify(mr.rockMouse));
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
  /* v5.7.9: every time a mode comes round (once a realm) it adds something; the Ragnarok levels have it all */
  var tiers = {};
  await gotoLevel(92);
  tiers.raid = await page.evaluate(async function () {
    var s = SolScene, R = s.raid; s.iframeMs = 1e9; s.spareLives = 9;
    R.ravens.forEach(function (e) { if (e.state === "wait" || e.state === "enter") { e.state = "form"; e.path = null; } });
    R.cloudCd = 0; R.swapCd = 0;
    await new Promise(function (r) { setTimeout(r, 2500); });
    return { tier: s.tier, card: (document.getElementById("mode-card") || {}).textContent || "", clouds: (R.clouds || []).length, swapped: !!R.toldSwap,
      helm: R.ravens.filter(function (o) { return o.kind === "eagle"; }).every(function (o) { return o.hp === 3; }), rows: R.ravSlots.length };
  });
  await shot("20a-eagle-swoop-ragnarok");
  await gotoLevel(94);
  tiers.rocks = await page.evaluate(async function () {
    var s = SolScene, R = s.rk; s.iframeMs = 1e9; s.spareLives = 9; s._beamHelpDone = true; s.helpOpen = false; s.hideBeamHelp();
    R.cometCd = 0; R.valkCd = 0; R.showerCd = 0;
    await new Promise(function (r) { setTimeout(r, 1500); });
    var o = { tier: s.tier, warned: R.warns.length > 0, valk: !!R.valk, guards: R.rocks.filter(function (q) { return q.orbitOf; }).length, iron: R.rocks.some(function (q) { return q.hp === 2; }) };
    await new Promise(function (r) { setTimeout(r, 1300); });
    o.comet = R.rocks.some(function (q) { return q.comet; }) || o.warned;
    return o;
  });
  await shot("20b-rune-rocks-ragnarok");
  await gotoLevel(96);
  tiers.sky = await page.evaluate(async function () {
    var s = SolScene; s.iframeMs = 1e9; s.spareLives = 9;
    await new Promise(function (r) { setTimeout(r, 2500); });
    return { tier: s.tier, flip: s.sky.P.flip, gap: s.sky.P.gapHalf, orbs: s.sky.orbs.length };
  });
  await shot("20c-sun-chariot-ragnarok");
  await gotoLevel(98);
  tiers.ring = await page.evaluate(async function () {
    var s = SolScene, G = s.rg; s.iframeMs = 1e9; s.spareLives = 9; G.alphaCd = 0; G.ravCd = 0;
    await new Promise(function (r) { setTimeout(r, 2600); });
    return { tier: s.tier, alpha: G.wolves.some(function (w) { return w.alpha; }), raven: !!G.rav || G.drops.length > 0, ammo: G.ammo, short: G.upMs };
  });
  await shot("20d-wolf-ring-ragnarok");
  console.log("tiers", JSON.stringify(tiers));
  check(tiers.raid.tier === 9 && /New this time/.test(tiers.raid.card) && tiers.raid.clouds >= 1 && tiers.raid.swapped && tiers.raid.helm && tiers.raid.rows > 12, "Eagle Swoop in Ragnarok: storm clouds, eagles trading places, iron helms, three raven rows, and the card says what's new: " + JSON.stringify(tiers.raid).slice(0, 200));
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
