/* v6.5 (SOL Labyrinth v5.17.2): does every screen fit the Canvas frame?  node tools/audit-500.js [bio] [WxH ...]
   The Canvas embed code is width="100%" height="500": the frame is as wide as the Canvas page column (about 700
   to 1280 pixels) and 500 pixels tall, so every screen must fit in 500 pixels of height. This opens every screen
   and window at each size, saves a screenshot to tools/shots/w500/, and lists anything that runs off an edge, is
   cut off, or makes the page itself scroll (a window may scroll inside itself: a long passage, the shop list).
   Exit 1 if anything doesn't fit. */
var path = require("path"), fs = require("fs"), http = require("http"), url = require("url");
var { chromium } = require("/opt/node22/lib/node_modules/playwright");
var root = path.join(__dirname, ".."), shots = path.join(__dirname, "shots", "w500");
fs.mkdirSync(shots, { recursive: true });
var game = "bio", sizeArgs = process.argv.slice(2).filter(function (a) { return a !== "bio"; });
var sizes = sizeArgs.map(function (s) { var m = /^(\d+)x(\d+)$/.exec(s); return m ? { w: +m[1], h: +m[2] } : null; }).filter(Boolean);
if (!sizes.length) sizes = [{ w: 1000, h: 500 }, { w: 700, h: 500 }, { w: 1280, h: 500 }];
var dir = root;
var MIME = { html: "text/html", js: "application/javascript", css: "text/css", json: "application/json", png: "image/png", webp: "image/webp", mp3: "audio/mpeg", glb: "model/gltf-binary", svg: "image/svg+xml" };
var srv = http.createServer(function (req, res) {
  var f = path.join(dir, decodeURIComponent(url.parse(req.url).pathname));
  if (f.endsWith("/")) f += "index.html";
  fs.readFile(f, function (err, buf) {
    if (err) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { "Content-Type": MIME[f.split(".").pop()] || "application/octet-stream" }); res.end(buf);
  });
});

/* in the page: every visible element that is cut off or needs scrolling to be seen, and why. Only these boxes may
   scroll (they hold long lists or passages); anything else that needs scrolling doesn't fit. */
function measure(opt) {
  opt = opt || {};
  var ALLOWED = "#eoc-passage-wrap, .read-scroll, .codex-scroll, #badge-overlay .tut-card, .build-options, .build-shop, .build-styles, .build-plist, .build-themes, .prog-code, .std-wrap, .table-wrap, .badge-body";
  var W = window.innerWidth, H = window.innerHeight, out = [], seen = {};
  var docEl = document.documentElement, body = document.body;
  function vis(el) {
    var cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0) return false;
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }
  function path(el) {
    var p = [];
    for (var e = el; e && e !== document.body && p.length < 4; e = e.parentElement) p.unshift(e.id ? "#" + e.id : e.tagName.toLowerCase() + (e.className && typeof e.className === "string" ? "." + e.className.trim().split(/\s+/).slice(0, 2).join(".") : ""));
    return p.join(" > ");
  }
  function inside(r, b, pad) { pad = pad || 1.5; return r.left >= b.left - pad && r.right <= b.right + pad && r.top >= b.top - pad && r.bottom <= b.bottom + pad; }
  var frame = { left: 0, top: 0, right: W, bottom: H };
  var els = Array.prototype.slice.call(body.querySelectorAll("*"));
  els.forEach(function (el) {
    if (!vis(el)) return;
    var tag = el.tagName;
    var leaf = /^(BUTTON|INPUT|SELECT|TEXTAREA|IMG|CANVAS|A|LABEL|SVG|IFRAME|H1|H2|H3|P|LI|TD|TH|SPAN|B)$/.test(tag) || (el.children.length === 0 && (el.textContent || "").trim());
    if (!leaf) return;
    if (el.closest("#teacher-overlay") && !opt.inFrame) { if (tag !== "IFRAME") return; }
    var r = el.getBoundingClientRect(), why = "";
    /* the nearest box that scrolls (or clips) it */
    var sc = null, clip = null;
    for (var e = el.parentElement; e && e !== docEl; e = e.parentElement) {
      var cs = getComputedStyle(e), oy = cs.overflowY, ox = cs.overflowX;
      if ((oy === "auto" || oy === "scroll" || ox === "auto" || ox === "scroll") && (e.scrollHeight > e.clientHeight + 1 || e.scrollWidth > e.clientWidth + 1)) { sc = e; break; }
      if (!clip && (oy === "hidden" || oy === "clip" || ox === "hidden" || ox === "clip") && e !== body) clip = e;
    }
    if (clip && !inside(r, clip.getBoundingClientRect())) {
      var cr = clip.getBoundingClientRect();
      if (r.bottom <= cr.top || r.top >= cr.bottom || r.right <= cr.left || r.left >= cr.right || (r.height < 400 && r.width < 600)) why = "cut off by " + path(clip);
    }
    if (!why && sc && sc !== body && sc !== docEl) {
      var sr = sc.getBoundingClientRect();
      if (!inside(sr, frame)) why = "its scrolling box " + path(sc) + " runs off the frame (" + Math.round(sr.top) + "–" + Math.round(sr.bottom) + " of " + H + ")";
      else if (!inside(r, sr) && !sc.matches(ALLOWED)) why = "you have to scroll " + path(sc) + " to see it";
    } else if (!why && !inside(r, frame)) {
      if (!(opt.pageMayScroll && r.left >= -1.5 && r.right <= W + 1.5)) why = "off the frame (" + Math.round(r.left) + "," + Math.round(r.top) + " – " + Math.round(r.right) + "," + Math.round(r.bottom) + " in " + W + "x" + H + ")";
    }
    if (!why) return;
    var key = path(el) + "|" + why;
    if (seen[key]) return;
    seen[key] = 1;
    out.push({ el: path(el), text: (el.innerText || el.value || el.alt || "").trim().replace(/\s+/g, " ").slice(0, 50), why: why });
  });
  var fits = Array.prototype.map.call(document.querySelectorAll("[data-fit]"), function (e) { return (e.id || e.className) + "=" + e.getAttribute("data-fit"); }).filter(function (x, i, a) { return a.indexOf(x) === i; });
  return { docW: docEl.scrollWidth, W: W, H: H, sideways: docEl.scrollWidth > W + 1, issues: out.slice(0, 25), more: Math.max(0, out.length - 25), fits: fits };
}

(async function () {
  await new Promise(function (r) { srv.listen(0, r); });
  var base = "http://127.0.0.1:" + srv.address().port + "/";
  var glArgs = { args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] };
  var browser = await chromium.launch(Object.assign({ executablePath: "/opt/pw-browsers/chromium/chrome-linux/chrome" }, glArgs)).catch(function () { return chromium.launch(glArgs); });
  var report = [], bad = 0;
  for (var si = 0; si < sizes.length; si++) {
    var S = sizes[si], tag = game + "-" + S.w + "x" + S.h;
    var page = await browser.newPage({ viewport: { width: S.w, height: S.h } });
    var errors = [];
    page.on("pageerror", function (e) { errors.push(e.message); });
    async function check(name, sel) {
      await page.waitForTimeout(350);
      var m = await page.evaluate(measure, {}).catch(function (e) { return { error: e.message, issues: [] }; });
      var file = tag + "-" + name + ".png";
      await page.screenshot({ path: path.join(shots, file) });
      var line = (m.issues.length || m.sideways ? "FAIL " : "ok   ") + tag + " " + name + (m.sideways ? "  (page " + m.docW + " wide: scrolls sideways)" : "") + (m.fits && m.fits.length ? "  [shrunk: " + m.fits.join(", ") + "]" : "") + (m.error ? " ERROR " + m.error : "");
      console.log(line);
      m.issues.forEach(function (i) { console.log("       " + i.el + (i.text ? ' "' + i.text + '"' : "") + ": " + i.why); });
      if (m.more) console.log("       … and " + m.more + " more");
      if (m.issues.length || m.sideways) bad++;
      report.push({ size: tag, screen: name, shot: "tools/shots/w500/" + file, sideways: !!m.sideways, issues: m.issues, more: m.more || 0 });
    }
    async function step(name, fn) { try { await fn(); } catch (e) { console.log("SKIP " + tag + " " + name + ": " + e.message.split("\n")[0]); report.push({ size: tag, screen: name, skipped: e.message.split("\n")[0] }); } }
    await page.goto(base + "index.html", { waitUntil: "load" });
    await page.evaluate(function () { localStorage.clear(); });
    await page.reload({ waitUntil: "load" }); await page.waitForTimeout(900);
    var ody = false;
    await step("gateway", async function () { if (await page.isVisible("#state-screen")) await check("01-gateway"); });
    await step("title", async function () {
      if (await page.isVisible("#state-screen")) await page.click('#state-screen .card[data-state="VA"]');
      await page.waitForSelector("#title-screen:not(.hidden)");
      await check("02-title");
    });
    await step("windows", async function () {
      await page.evaluate(function () { window.SolProgress && SolProgress.show(); });
      await page.waitForTimeout(300); await check("03-submit-progress");
      await page.keyboard.press("Escape"); await page.waitForTimeout(200);
      if (await page.isVisible("#btn-restore")) { await page.click("#btn-restore"); await page.waitForTimeout(300); await check("04-restore"); await page.keyboard.press("Escape"); await page.waitForTimeout(200); }
      if (await page.isVisible("#btn-badges")) { await page.click("#btn-badges"); await page.waitForTimeout(300); await check("05-badges"); await page.keyboard.press("Escape"); await page.waitForTimeout(200); }
    });
    /* v6.5: the teacher's accommodations panel (the PIN, then the five options) */
    await step("accommodations", async function () {
      await page.fill("#join-nick", "accommodations");
      await page.waitForSelector("#acc-overlay:not(.hidden) #acc-pin", { timeout: 3000 });
      await check("05b-accommodations-pin");
      await page.fill("#acc-pin", "4826"); await page.click("#acc-pin-go");
      await page.waitForSelector("#acc-save", { timeout: 3000 });
      await check("05c-accommodations");
      await page.click("#acc-close"); await page.waitForTimeout(200);
    });
    await step("town", async function () {
      await page.evaluate(function () { if (window.SolBuild) SolBuild.showGallery(); });
      await page.waitForTimeout(1200); await check("06-town-gallery");
      await page.evaluate(function () { if (window.SolBuild) SolBuild.close(); }); await page.waitForTimeout(300);
      await page.evaluate(function () { if (window.SolBuild) { SolBuild.addCoins(300, "audit"); SolBuild.showShop(3, function () {}); } });
      await page.waitForTimeout(1200); await check("07-shop");
      if (await page.isVisible(".build-theme")) { await page.click(".build-theme >> nth=0"); await page.click("#build-overlay .btn.primary"); await page.waitForTimeout(600); await check("07b-shop-after-theme"); }
      await page.evaluate(function () { if (window.SolBuild) SolBuild.close(); }); await page.waitForTimeout(300);
    });
    await step("teacher", async function () {
      await page.evaluate(function () { window.SolTeacher && SolTeacher.show(); });
      await page.waitForSelector("#teacher-overlay:not(.hidden) iframe", { timeout: 5000 });
      await page.waitForTimeout(600);
      await check("08-teacher");
      var fr = page.frames().filter(function (f) { return f !== page.mainFrame(); })[0];
      if (fr) {
        var m = await fr.evaluate(measure, { inFrame: true, pageMayScroll: true });
        var line = (m.issues.length || m.sideways ? "FAIL " : "ok   ") + tag + " 08b-teacher-inside" + (m.sideways ? "  (page " + m.docW + " wide: scrolls sideways)" : "");
        console.log(line); m.issues.forEach(function (i) { console.log("       " + i.el + (i.text ? ' "' + i.text + '"' : "") + ": " + i.why); });
        if (m.issues.length || m.sideways) bad++;
        report.push({ size: tag, screen: "08b-teacher-inside", sideways: !!m.sideways, issues: m.issues, more: m.more || 0 });
      }
      await page.evaluate(function () { window.SolTeacher && SolTeacher.hide(); }); await page.waitForTimeout(200);
    });
    var fam = "ECO";
    await step("mode", async function () {
      await page.click(fam ? '#title-screen .card[data-family="' + fam + '"]' : "#title-screen .card[data-family]:not(.hidden)");
      await page.waitForSelector("#mode-screen:not(.hidden), #skill-screen:not(.hidden)", { timeout: 4000 });
      if (await page.isVisible("#mode-screen")) await check("09-mode");
    });
    await step("skill", async function () {
      if (await page.isVisible("#mode-screen")) await page.click("#mode-packs .card >> nth=0");
      await page.waitForSelector("#skill-screen:not(.hidden)");
      await check("10-skill");
    });
    await step("level", async function () {
      await page.waitForTimeout(500);
      await page.click("#btn-skill-start");
      await page.waitForTimeout(500);
      if (await page.isVisible("#char-overlay")) { await check("11-character"); if (await page.isVisible("#btn-char-confirm")) await page.click("#btn-char-confirm"); }
      for (var i = 0; i < 20; i++) { if (await page.isVisible("#tut-overlay")) break; if (await page.isVisible("#read-overlay")) break; await page.waitForTimeout(300); }
      if (await page.isVisible("#tut-overlay")) { await check("12-tutorial"); if (await page.isVisible("#tut-skip")) await page.click("#tut-skip"); }
      for (var j = 0; j < 20; j++) { if (await page.isVisible("#read-go")) break; await page.waitForTimeout(300); }
      await page.waitForTimeout(600);
      await check("13-reading");
      /* scroll the reading card to its end, as a student would */
      await page.evaluate(function () { var s = document.querySelector("#read-overlay .read-scroll") || document.getElementById("read-card"); if (s) s.scrollTop = s.scrollHeight; });
      await check("13b-reading-end");
      if (await page.isVisible("#read-go")) await page.click("#read-go");
      await page.waitForTimeout(1500);
      await check("14-play-hud");
    });
    /* v6.5: the Menu window during a level */
    await step("menu", async function () {
      await page.click("#btn-menu");
      await page.waitForSelector("#leave-overlay:not(.hidden)", { timeout: 3000 });
      await check("14b-menu");
      await page.click("#btn-leave-stay"); await page.waitForTimeout(300);
    });
    await step("question-bar", async function () {
      /* the in-play question / answer letters bar */
      await check("15-play-question");
    });
    await step("end", async function () {
      var won = await page.evaluate(function () {
        var s = window.SolScene; if (!s || !s.need) return false;
        for (var k = 0; k < 12 && !s.ended; k++) {
          s.player.carrying = null; s.player.carryExtra = [];
          s.need.forEach(function (L, i) { var sl = s.slips.filter(function (q) { return q.letter === L && q.active !== false; })[0]; if (!i) s.player.carrying = sl; else s.player.carryExtra.push(sl); });
          s.player.body.reset(s.exitZone.x, s.exitZone.y); s.player.x = s.exitZone.x; s.player.y = s.exitZone.y;
          s.tryExtract();
          var g = document.getElementById("read-go"); if (g && g.offsetParent) g.click();
        }
        return !!s.ended;
      });
      for (var i = 0; i < 25; i++) { if (await page.isVisible("#overlay")) break; if (await page.isVisible("#build-overlay")) { await check("16-reward-builder"); break; } await page.waitForTimeout(300); }
      if (await page.isVisible("#build-overlay")) { try { await page.click("#build-overlay .build-opt >> nth=0", { timeout: 1500 }); await page.click("#build-overlay .btn.primary", { timeout: 1500 }); } catch (e) {} }
      for (var j = 0; j < 25; j++) { if (await page.isVisible("#overlay")) break; await page.waitForTimeout(300); }
      if (await page.isVisible("#overlay")) await check("17-level-end");
      else if (won) console.log("note " + tag + ": level won but the end screen didn't show");
    });
    /* a shooter level */
    await step("shooter", async function () {
      await page.evaluate(function () {
        var s = window.SolScene; if (!s) return;
        var ids = (window.SolModes && SolModes.list ? SolModes.list().map(function (m) { return m.id; }) : []);
        var id = ids.filter(function (x) { return x !== "maze" && x !== "ALL"; })[0] || "raid";
        SolModes.only = id;
        document.getElementById("overlay").classList.add("hidden");
        s.scene.restart({ family: s.family, strand: s.strand || "ALL", night: 2 });
      });
      await page.waitForTimeout(3000);
      for (var j = 0; j < 20; j++) { if (await page.isVisible("#read-go")) break; await page.waitForTimeout(300); }
      if (await page.isVisible("#tut-skip")) await page.click("#tut-skip");
      if (await page.isVisible("#read-go")) await page.click("#read-go");
      await page.waitForTimeout(1500);
      await check("18-shooter");
    });
    if (errors.length) console.log("page errors " + tag + ": " + errors.slice(0, 3).join(" | "));
    await page.close();
  }
  fs.writeFileSync(path.join(shots, game + "-report.json"), JSON.stringify(report, null, 1));
  console.log(bad ? bad + " screen(s) don't fit" : "ALL FIT");
  await browser.close(); srv.close();
  process.exit(bad ? 1 : 0);
})();
