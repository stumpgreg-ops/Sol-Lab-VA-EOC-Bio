/* Headless test of the one-card tutorial and the Menu / Esc window (v6.5): node tools/smoke-menu.js
   In the 500-pixel Canvas frame: the Level 1 tutorial is one card with every rule and one "Got it — play" button,
   and fits; the Menu button in the side panel and the Esc key pause a maze level and a shooter level; Keep playing
   resumes; Leave the level goes back to the title screen without changing the saved level; Esc closes the field
   guide (not the level) when the guide is open. Saves screenshots to tools/shots/menu-*.png. */
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
  var glArgs = { args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] };
  var browser = await chromium.launch(Object.assign({ executablePath: "/opt/pw-browsers/chromium/chrome-linux/chrome" }, glArgs)).catch(function () { return chromium.launch(glArgs); });
  var page = await browser.newPage({ viewport: { width: 900, height: 500 } });
  var errors = [], fails = [];
  page.on("pageerror", function (e) { errors.push("pageerror: " + e.message); });
  function check(cond, msg) { if (!cond) fails.push(msg); console.log((cond ? "ok   " : "FAIL ") + msg); }
  function shot(n) { return page.screenshot({ path: path.join(shots, "menu-" + n + ".png") }); }
  function inFrame(sel) {
    return page.evaluate(function (sel) { var e = document.querySelector(sel); if (!e) return null; var r = e.getBoundingClientRect(); return { top: Math.round(r.top), bottom: Math.round(r.bottom), ok: r.top >= 0 && r.bottom <= innerHeight + 1 && r.height > 0, scrolls: e.scrollHeight > e.clientHeight + 1 }; }, sel);
  }
  async function startLevel(mode) {
    await page.click('#title-screen .card[data-family="ECO"]');
    await page.waitForSelector("#mode-screen:not(.hidden)");
    await page.click('#mode-packs .card[data-gamemode="' + mode + '"]');
    await page.waitForSelector("#skill-screen:not(.hidden)");
    await page.waitForTimeout(500);
    await page.click("#btn-skill-start");
    await page.waitForSelector("#btn-char-confirm:visible", { timeout: 4000 }).catch(function () {});
    if (await page.isVisible("#btn-char-confirm").catch(function () { return false; })) await page.click("#btn-char-confirm");
    await page.waitForFunction(function () { return window.SolScene && SolScene.claim; }, null, { timeout: 20000 });
  }
  async function clearWindows() {
    for (var k = 0; k < 6; k++) {
      if (await page.isVisible("#read-go").catch(function () { return false; })) await page.click("#read-go");
      else if (await page.isVisible("#tut-skip").catch(function () { return false; })) await page.click("#tut-skip");
      else if (await page.isVisible("#beam-help-ok").catch(function () { return false; })) await page.click("#beam-help-ok");
      else break;
      await page.waitForTimeout(500);
    }
    await page.waitForTimeout(600);
  }
  await page.goto(base + "index.html", { waitUntil: "load" });
  await page.evaluate(function () { localStorage.clear(); });
  await page.reload({ waitUntil: "load" }); await page.waitForTimeout(600);

  /* the tutorial: one card */
  await startLevel("maze");
  for (var i = 0; i < 20; i++) { if (await page.isVisible("#tut-overlay")) break; if (await page.isVisible("#read-go")) await page.click("#read-go"); await page.waitForTimeout(300); }
  var tut = await page.evaluate(function () {
    return { kicker: document.getElementById("tut-kicker").textContent, title: document.getElementById("tut-title").textContent,
      rules: document.querySelectorAll("#tut-body li").length, btn: document.getElementById("tut-skip").textContent,
      text: document.getElementById("tut-body").textContent };
  });
  check(tut.rules >= 6 && /How to play/.test(tut.title) && !/of 9|1 of/.test(tut.kicker) && tut.btn === "Got it — play",
    "the Level 1 tutorial is one card with every rule and one \"Got it — play\" button: " + JSON.stringify({ kicker: tut.kicker, rules: tut.rules, btn: tut.btn }));
  check(/arrow keys/.test(tut.text) && /SPACE/.test(tut.text) && /EXIT/.test(tut.text) && /strikes/.test(tut.text) && /TAB/.test(tut.text) && /Menu/.test(tut.text),
    "the card names moving, picking up, the EXIT, strikes, the field guide and the Menu");
  var tf = await inFrame("#tut-card");
  check(tf && tf.ok && !tf.scrolls, "the tutorial card fits the 500-pixel frame without scrolling: " + JSON.stringify(tf));
  await shot("1-tutorial");
  await page.click("#tut-skip"); await page.waitForTimeout(400);
  check(!(await page.isVisible("#tut-overlay")), "Got it — play closes it");
  await clearWindows();

  /* Menu in a maze level */
  var mb = await inFrame("#btn-menu");
  check(mb && mb.ok, "the Menu button is in view in the side panel: " + JSON.stringify(mb));
  await page.click("#btn-menu");
  await page.waitForSelector("#leave-overlay:not(.hidden)"); await page.waitForTimeout(150);
  var p1 = await page.evaluate(function () { return { paused: SolScene.scene.isPaused(), body: document.getElementById("leave-body").textContent }; });
  check(p1.paused && /Leave Level 1/.test(p1.body) && /saved level stays at Level 1/.test(p1.body), "Menu pauses the maze and asks before leaving: " + p1.body);
  var lf = await inFrame("#leave-overlay .tut-card");
  check(lf && lf.ok, "the Menu window fits the frame");
  await shot("2-menu");
  await page.waitForTimeout(900);
  check(await page.evaluate(function () { return SolScene.scene.isPaused(); }), "the level stays paused while the window is open");
  await page.click("#btn-leave-stay"); await page.waitForTimeout(300);
  check(await page.evaluate(function () { return !SolScene.scene.isPaused() && document.getElementById("leave-overlay").classList.contains("hidden"); }), "Keep playing closes the window and the level runs again");
  /* Esc: opens the window, Esc again closes it */
  await page.waitForTimeout(500);
  await page.keyboard.press("Escape"); await page.waitForTimeout(200);
  var e1 = await page.evaluate(function () { return SolLeave.isOpen() && SolScene.scene.isPaused(); });
  await page.keyboard.press("Escape"); await page.waitForTimeout(200);
  var e2 = await page.evaluate(function () { return !SolLeave.isOpen() && !SolScene.scene.isPaused(); });
  check(e1 && e2, "Esc opens the Menu window, and Esc again goes back to the level");
  /* Esc with the field guide open closes the guide, not the level */
  await page.keyboard.press("Tab"); await page.waitForTimeout(300);
  var guide = await page.isVisible("#codex-overlay");
  await page.keyboard.press("Escape"); await page.waitForTimeout(300);
  var afterGuide = await page.evaluate(function () { return { guide: !document.getElementById("codex-overlay").classList.contains("hidden") && getComputedStyle(document.getElementById("codex-overlay")).display !== "none", menu: SolLeave.isOpen() }; });
  check(guide && !afterGuide.guide && !afterGuide.menu, "with the field guide open, Esc closes the guide and leaves the level alone: " + JSON.stringify(afterGuide));
  /* Leave the level */
  await page.click("#btn-menu"); await page.waitForSelector("#leave-overlay:not(.hidden)");
  await page.click("#btn-leave-go"); await page.waitForTimeout(600);
  var back = await page.evaluate(function () { return { title: !document.getElementById("title-screen").classList.contains("hidden"), play: document.getElementById("play").classList.contains("hidden"), menu: SolLeave.isOpen(), night: localStorage.getItem("afterHours.v1.night") }; });
  check(back.title && back.play && !back.menu, "Leave the level goes back to the title screen: " + JSON.stringify(back));
  await shot("3-title-after-leave");

  /* Menu in a shooter level */
  await startLevel("raid");
  await clearWindows();
  await page.click("#btn-menu");
  await page.waitForSelector("#leave-overlay:not(.hidden)"); await page.waitForTimeout(150);
  var p2 = await page.evaluate(function () { return { paused: SolScene.scene.isPaused(), mode: SolScene.mode && SolScene.mode.id }; });
  check(p2.paused && p2.mode === "raid", "Menu pauses a shooter level (Eagle Swoop) too: " + JSON.stringify(p2));
  await shot("4-menu-shooter");
  await page.click("#btn-leave-stay"); await page.waitForTimeout(300);
  check(await page.evaluate(function () { return !SolScene.scene.isPaused(); }), "Keep playing resumes the shooter");
  await page.click("#btn-menu"); await page.waitForSelector("#leave-overlay:not(.hidden)");
  await page.click("#btn-leave-go"); await page.waitForTimeout(600);
  check(await page.evaluate(function () { return !document.getElementById("title-screen").classList.contains("hidden"); }), "and Leave the level goes back to the title screen");
  /* a new level after leaving starts normally */
  await startLevel("maze");
  await clearWindows();
  check(await page.evaluate(function () { return !SolScene.scene.isPaused() && !SolScene.ended && !!SolScene.player; }), "a level started after leaving one runs normally");

  check(!errors.length, "no page errors" + (errors.length ? ": " + errors.slice(0, 5).join(" | ") : ""));
  await browser.close(); srv.close();
  if (fails.length) { console.log("FAILED: " + fails.length); process.exit(1); }
  console.log("ALL OK");
})().catch(function (e) { console.error(e); process.exit(1); });
