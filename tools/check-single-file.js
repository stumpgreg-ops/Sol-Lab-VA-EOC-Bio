/* Headless check of the offline builds:
     node tools/check-single-file.js [dist/sol-lab-va-algebra.html]   the one-file build, opened from disk (file://)
     node tools/check-single-file.js dist/canvas                        the Canvas build: the folder is served over
                                                                        http (as a Canvas folder is) and its .html opened
   Walks the title screen, the shop (builder), the character picker, a Functions level and the read pop-up, and
   fails if any request leaves the file / the folder. */
var path = require("path"), fs = require("fs"), http = require("http"), urlMod = require("url");
var { chromium } = require("/opt/node22/lib/node_modules/playwright");
var root = path.join(__dirname, "..");
var target = path.resolve(process.argv[2] || path.join(root, "dist", "sol-lab-va-algebra.html"));
var isDir = fs.existsSync(target) && fs.statSync(target).isDirectory();
(async function () {
  var pageUrl, allowed;
  if (isDir) {
    var MIME = { html: "text/html", js: "application/javascript" };
    var srv = http.createServer(function (req, res) {
      var f = path.join(target, decodeURIComponent(urlMod.parse(req.url).pathname));
      fs.readFile(f, function (err, buf) { if (err) { res.writeHead(404); res.end(); return; } res.writeHead(200, { "Content-Type": MIME[f.split(".").pop()] || "application/octet-stream" }); res.end(buf); });
    });
    await new Promise(function (r) { srv.listen(0, r); });
    var base = "http://127.0.0.1:" + srv.address().port + "/";
    var starter = fs.readdirSync(target).filter(function (f) { return /\.html$/.test(f); })[0];
    pageUrl = base + starter;
    allowed = function (u) { return u.indexOf(base) === 0 && fs.existsSync(path.join(target, decodeURIComponent(u.slice(base.length).replace(/[?#].*$/, "")))); };
  } else { pageUrl = "file://" + target; allowed = function (u) { return u === pageUrl; }; }
  var glArgs = { args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] };
  var browser = await chromium.launch(Object.assign({ executablePath: "/opt/pw-browsers/chromium/chrome-linux/chrome" }, glArgs)).catch(function () { return chromium.launch(glArgs); });
  var page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  var errors = [], requests = [];
  page.on("request", function (r) { var u = r.url(); if (!/^data:|^blob:/.test(u) && !allowed(u)) requests.push(u); });
  page.on("requestfailed", function (r) { var u = r.url(); if (!/^data:|^blob:/.test(u)) errors.push("requestfailed: " + u.slice(0, 120)); });
  page.on("pageerror", function (e) { errors.push("pageerror: " + e.message); });
  page.on("console", function (m) { if (m.type() === "error" || m.type() === "warning") { var t = m.text(); if (!/Autoplay|AudioContext|peerjs|WebGL|GL Driver|swiftshader|could not load assets\/build\/models|SOL music/i.test(t)) errors.push(m.type() + ": " + t.slice(0, 160)); } });
  var fails = [];
  function check(c, msg) { if (!c) fails.push(msg); console.log((c ? "ok   " : "FAIL ") + msg); }

  /* catch the Phaser.Game instance the page makes (game.js keeps it private) */
  await page.addInitScript(function () {
    var P; Object.defineProperty(window, "Phaser", { configurable: true, get: function () { return P; }, set: function (v) {
      P = v; if (v && v.Game) v.Game = new Proxy(v.Game, { construct: function (T, a) { var g = new T(a[0]); window.__solGame = g; return g; } });
    } });
  });
  await page.goto(pageUrl, { waitUntil: "load" });
  await page.waitForSelector("#title-screen", { timeout: 60000 });
  await page.waitForTimeout(1000);
  check(await page.isVisible("#title-screen") && !(await page.$("#sol-boot")), "title screen shows from " + (isDir ? "the served folder (boot screen gone)" : "file://"));
  check((await page.$$eval("#title-screen .card[data-family]", function (l) { return l.length; })) === 5, "five unit cards");
  check(await page.evaluate(function () { var i = document.querySelector("#title-screen h1.logo img"); return i && i.complete && i.naturalWidth > 0 && /^data:/.test(i.src); }), "logo is inlined and decoded");
  check(await page.evaluate(function () { return window.SOL_SINGLE_FILE === true ? Object.keys(window.SOL_FILES).length > 200 : window.SOL_CANVAS === true; }), isDir ? "Canvas loader ran (SOL_CANVAS)" : "asset table present");

  /* shop opens: the builder loaded pieces.json through the shim and draws its 2D view */
  await page.evaluate(function () { localStorage.removeItem("afterHours.v1.build"); SolBuild.init(); });
  await page.evaluate(function () { SolBuild.addCoins(60, "test"); SolBuild.showShop(1, function () {}); });
  await page.waitForSelector(".build-theme", { timeout: 10000 });
  await page.click(".build-theme:nth-child(2)");
  await page.click("#build-overlay .btn.primary");
  await page.waitForSelector(".build-shop .build-opt", { timeout: 10000 });
  var pieces = await page.evaluate(function () { var s = SolBuild.state(); return { theme: s.theme, loads: SolBuild._loads3d ? SolBuild._loads3d() : null }; });
  check(pieces.theme === "castle" || pieces.theme === "town", "shop opened and pieces.json loaded (theme " + pieces.theme + ")");
  /* the builder's own Image() loads (kit sprites) go through the src setter */
  var setter = await page.evaluate(function () { var k = "assets/build/kit/atlas-0.png"; var i = new Image(); i.src = k + "?v=1"; return { key: k, data: /^data:image\/(png|webp)/.test(i.src) }; });
  check(setter.key && setter.data, "Image.src is redirected to the inlined copy (" + setter.key + ")");
  if (isDir) {
    /* the Canvas build carries the 3D castle kit (models as deltas): the 3D view must load every model it asks for */
    await page.evaluate(function () { SolBuild._rotate && SolBuild._rotate(30); });
    await page.waitForTimeout(4000);
    var td = await page.evaluate(function () { return SolBuild._loads3d ? SolBuild._loads3d() : null; });
    check(td && td.models === "ok" && td.failed === 0, "3D view found models.json in the bundle: " + JSON.stringify(td));
    /* models stored as deltas and PNGs stored as WebP come back byte-for-byte / pixel-for-pixel through the loader */
    var want = ["assets/build/models/kk/building_castle_red.glb", "assets/build/models/kk/building_barracks_yellow.glb", "assets/build/models/kk/banner_green_full.glb"].map(function (p) { return { p: p, n: fs.statSync(path.join(root, p)).size }; });
    var got = await page.evaluate(function (want) {
      return Promise.all(want.map(function (w) { return fetch(w.p).then(function (r) { return r.arrayBuffer(); }).then(function (b) { var u = new Uint8Array(b); return { p: w.p, n: u.length, glb: u[0] === 0x67 && u[1] === 0x6c && u[2] === 0x54 && u[3] === 0x46 }; }); }));
    }, want);
    check(got.every(function (g, i) { return g.n === want[i].n && g.glb; }), "delta-stored models rebuild to their full size (" + got.map(function (g) { return g.n; }).join(", ") + " bytes, glTF magic ok)");
    var pic = await page.evaluate(function () {
      return fetch("assets/logo/sols-labyrinth-512.png").then(function (r) { return r.blob(); }).then(function (b) { return createImageBitmap(b).then(function (bm) { return { type: b.type, w: bm.width, h: bm.height }; }); });
    });
    check(pic.type === "image/webp" && pic.w === 512 && pic.h === 512, "a PNG travels as lossless WebP and decodes at full size: " + JSON.stringify(pic));
    check(await page.evaluate(function () { return localStorage.getItem("afterHours.v1.build") !== null && Object.keys(localStorage).some(function (k) { return k.indexOf("solReading.algebra:") === 0; }); }), "saves carry the Canvas prefix (solReading.algebra:)");
  }
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  /* a Functions level */
  await page.click('#title-screen .card[data-family="FN"]');
  await page.waitForSelector("#skill-screen:not(.hidden)");
  await page.click("#btn-skill-start");
  await page.waitForTimeout(300);
  if (await page.isVisible("#btn-char-confirm")) {
    await page.waitForTimeout(800);
    var imgs = await page.evaluate(function () { var l = Array.prototype.slice.call(document.images); return { n: l.length, ok: l.filter(function (i) { return i.complete && i.naturalWidth > 0; }).length, data: l.filter(function (i) { return /^data:/.test(i.src); }).length }; });
    check(imgs.n >= 9 && imgs.ok === imgs.n && imgs.data === imgs.n, "character previews (innerHTML <img>) decode from inlined data (" + imgs.ok + "/" + imgs.n + ")");
    await page.click("#btn-char-confirm");
  }
  await page.waitForTimeout(3000);
  for (var i = 0; i < 12; i++) { if (await page.isVisible("#tut-skip")) { await page.click("#tut-skip"); break; } await page.waitForTimeout(300); }
  await page.waitForTimeout(1500);
  var hud = await page.evaluate(function () { return { sol: document.getElementById("job-sol").textContent, stem: document.getElementById("eoc-stem").textContent }; });
  check(/^SOL · A\.F\.[12]\.[a-h] · Level [123]/.test(hud.sol), "HUD shows a SOL code: " + hud.sol);
  check(hud.stem.length > 10, "a question is loaded");
  if (await page.isVisible("#read-go")) await page.click("#read-go");
  await page.waitForTimeout(2500);
  var tex = await page.evaluate(function () {
    var c = document.querySelector("canvas"), g = window.__solGame || (c && c.__phaserGame) || null;
    if (!g && window.Phaser) { var l = document.querySelectorAll("canvas"); for (var i = 0; i < l.length && !g; i++) { var k = Object.keys(l[i]).filter(function (n) { return /game/i.test(n); })[0]; if (k) g = l[i][k]; } }
    if (!g) return null;
    var keys = g.textures.getTextureKeys().filter(function (k) { return k !== "__DEFAULT" && k !== "__MISSING" && k !== "__WHITE"; });
    var missing = keys.filter(function (k) { var s = g.textures.get(k).getSourceImage(); return !s || !(s.width > 0); });
    return { n: keys.length, missing: missing };
  });
  check(tex && tex.n > 20 && tex.missing.length === 0, "Phaser textures loaded through the shim (" + (tex && tex.n) + " keys, missing: " + (tex && tex.missing.join(",")) + ")");
  check(await page.evaluate(function () { return !!document.querySelector("#game canvas, canvas"); }), "game canvas is on the page");
  await page.screenshot({ path: path.join(root, "tools", "shots", (isDir ? "canvas" : "single-file") + "-level.png") });

  console.log("requests outside the " + (isDir ? "folder" : "file") + ": " + (requests.length ? requests.slice(0, 5).join(" | ") : "none"));
  console.log("errors: " + (errors.length ? "\n  " + errors.join("\n  ") : "none"));
  check(requests.length === 0, "no requests left the " + (isDir ? "folder" : "file") + " (fully self-contained)");
  check(errors.length === 0, "no page errors");
  await browser.close();
  console.log(fails.length ? "FAILED: " + fails.length : "ALL OK");
  process.exit(fails.length ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
