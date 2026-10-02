/* Headless check of the single-file build: node tools/check-single-file.js [dist/sol-lab-va-algebra.html]
   Opens the file from disk (file://, no server — the way an LMS file area or a USB stick serves it),
   then walks the title screen, the shop (2D builder), a Functions level and the read pop-up. */
var path = require("path"), fs = require("fs");
var { chromium } = require("/opt/node22/lib/node_modules/playwright");
var root = path.join(__dirname, "..");
var file = path.resolve(process.argv[2] || path.join(root, "dist", "sol-lab-va-algebra.html"));
(async function () {
  var browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium/chrome-linux/chrome" }).catch(function () { return chromium.launch(); });
  var page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  var errors = [], requests = [];
  page.on("request", function (r) { var u = r.url(); if (!/^data:|^blob:/.test(u) && u !== "file://" + file) requests.push(u); });
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
  await page.goto("file://" + file, { waitUntil: "load" });
  await page.waitForTimeout(1000);
  check(await page.isVisible("#title-screen"), "title screen shows from file://");
  check((await page.$$eval("#title-screen .card[data-family]", function (l) { return l.length; })) === 5, "five unit cards");
  check(await page.evaluate(function () { var i = document.querySelector("#title-screen h1.logo img"); return i && i.complete && i.naturalWidth > 0 && /^data:/.test(i.src); }), "logo is inlined and decoded");
  check(await page.evaluate(function () { return window.SOL_SINGLE_FILE === true && Object.keys(window.SOL_FILES).length > 200; }), "asset table present");

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
  var setter = await page.evaluate(function () { var k = Object.keys(window.SOL_FILES).filter(function (f) { return /^assets\/build\/kit\/.*\.png$/.test(f); })[0]; var i = new Image(); i.src = k + "?v=1"; return { key: k, data: /^data:image\/png/.test(i.src) }; });
  check(setter.key && setter.data, "Image.src is redirected to the inlined copy (" + setter.key + ")");
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
  await page.screenshot({ path: path.join(root, "tools", "shots", "single-file-level.png") });

  console.log("network requests outside the file: " + (requests.length ? requests.slice(0, 5).join(" | ") : "none"));
  console.log("errors: " + (errors.length ? "\n  " + errors.join("\n  ") : "none"));
  check(requests.length === 0, "no requests left the file (fully self-contained)");
  check(errors.length === 0, "no page errors");
  await browser.close();
  console.log(fails.length ? "FAILED: " + fails.length : "ALL OK");
  process.exit(fails.length ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
