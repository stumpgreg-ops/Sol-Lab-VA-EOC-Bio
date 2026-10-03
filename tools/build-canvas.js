/* Build the Canvas (LMS) version of SOL Lab Biology: node tools/build-canvas.js
   (run tools/build-appsscript.js first; tools/publish-pages.sh runs both).

   Files a teacher uploads to one folder in Canvas Files and embeds in a Canvas page: nothing is hosted on GitHub
   or any other outside site. Canvas runs the scripts of a small uploaded HTML page but not of a big one (SOL
   Labyrinth's one-file 7 MB build stopped on its first screen), and a small page can read files next to it in its
   folder with a relative <script src>. So the game is:
     SOLLab-VA-Bio.html          the starter page (a few KB): the loading screen and one <script src>
     SOLLab-VA-Bio-game.js       the Apps Script loader, the manifest and the list of data files
     SOLLab-VA-Bio-data-NN.js    the gzip bundle (no music) as base64, in pieces of 576 KB
   Canvas gives each uploaded file its own web address, and the game's saves live with the starter page's: an
   update replaces only the .js files, so the starter page (and every student's progress) stays.

   Writes dist/canvas/BIO/ and dist/canvas/SOLLab-VA-Bio-Canvas.zip (the same files, for one upload) */
var fs = require("fs"), path = require("path"), cp = require("child_process");
var root = path.join(__dirname, ".."), dist = path.join(root, "dist");
var lo = "bio", st = "BIO";
var src = path.join(dist, "appsscript", lo), outAll = path.join(dist, "canvas"), out = path.join(outAll, st);
if (!fs.existsSync(path.join(src, "manifest.json"))) throw new Error("tools/build-canvas.js: run tools/build-appsscript.js first");

var man = JSON.parse(fs.readFileSync(path.join(src, "manifest.json"), "utf8"));
var gz = Buffer.concat(man.parts.map(function (p) { return fs.readFileSync(path.join(src, p)); }));
if (gz.length !== man.bytes) throw new Error("tools/build-canvas.js: the bundle parts add up to " + gz.length + " bytes, not " + man.bytes);

var page = fs.readFileSync(path.join(src, "loader.html"), "utf8");
var m = page.match(/<script>([\s\S]*)<\/script>/);
if (!m) throw new Error("tools/build-canvas.js: no loader script in loader.html");
var loaderJs = m[1];
var base = "SOLLab-VA-Bio", NAME = "SOL Lab Biology";

/* ── the data files: 576 KB of bundle each (768 KB of base64; Canvas has served an 800 KB one to a page) ── */
var PIECE = 576 * 1024, files = [];
for (var o = 0, n = 1; o < gz.length; o += PIECE, n++) {
  var name = base + "-data-" + (n < 10 ? "0" : "") + n + ".js";
  files.push(name);
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, name), "/* " + NAME + " v" + man.version + ": game data " + n + " (open " + base + ".html, not this file) */\n" +
    "solPart(" + (n - 1) + "," + JSON.stringify(man.hash) + ',"' + gz.subarray(o, o + PIECE).toString("base64") + '");\n');
}

/* ── the game file: which version, which data files, and the loader ── */
var parts = { manifest: man, files: files };
fs.writeFileSync(path.join(out, base + "-game.js"), "/* " + NAME + " v" + man.version + " (open " + base + ".html, not this file) */\n" +
  "window.SOL_CANVAS_ID = " + JSON.stringify(lo) + ";\nwindow.SOL_PARTS = " + JSON.stringify(parts) + ";\n" + loaderJs + "\n");

/* ── the starter page: what it says when its scripts can't run (a preview that blocks scripts shows only that),
   a first small script that changes it, then the game file ── */
var stuck = '<div class="msg">Loading the game…</div><div class="msg" id="sol-noscript" style="font-size:13px;opacity:.7">' +
  "If this message never changes, the page is not allowed to run the game here (Canvas shows some files as a preview that cannot run games).</div>";
if (page.indexOf('<div class="msg">Loading the game…</div>') < 0) throw new Error("tools/build-canvas.js: loader.html has no loading message");
page = page.replace('<div class="msg">Loading the game…</div>', stuck);
var early = "<script>(function(){var n=document.getElementById('sol-noscript');if(n)n.parentNode.removeChild(n);" +
  /* anything the page refuses to load (a security rule) is named on screen, since a student can't open the console */
  "var blocked=[];document.addEventListener('securitypolicyviolation',function(e){var k=(e.effectiveDirective||e.violatedDirective)+' '+String(e.blockedURI).slice(0,12);" +
  "if(blocked.indexOf(k)>=0)return;blocked.push(k);var d=document.getElementById('sol-blocked');if(!d){d=document.createElement('div');d.id='sol-blocked';" +
  "d.setAttribute('style','position:fixed;left:8px;bottom:8px;z-index:100000;background:#3a1a14;color:#ffd8c8;border:1px solid #ff8b7a;border-radius:8px;padding:6px 10px;font:13px system-ui,sans-serif;max-width:90vw');" +
  "document.body.appendChild(d);}d.textContent='Canvas blocked part of the game: '+blocked.join(', ');});" +
  "window.addEventListener('error',function(e){var m=document.querySelector('#sol-boot .msg');if(m&&document.getElementById('sol-boot'))m.textContent='The game hit an error: '+(e.message||e)+' (line '+(e.lineno||'?')+')';});" +
  "window.solMissing=function(f){var m=document.querySelector('#sol-boot .msg');if(m)m.textContent='Can\\'t find '+f+'. Upload it to the same Canvas folder as this page, with the same name.';};})();</script>\n";
var game = base + "-game.js";
var starter = page.replace(m[0], function () { return early + '<script src="' + game + '" onerror="solMissing(\'' + game + '\')"></script>'; });
if (Buffer.byteLength(starter) > 64 * 1024) throw new Error("tools/build-canvas.js: the starter page is " + Buffer.byteLength(starter) + " bytes; Canvas runs only small pages");
fs.writeFileSync(path.join(out, base + ".html"), starter);

/* the files of an older build that this one doesn't have (fewer data files) */
fs.readdirSync(out).forEach(function (f) { if (f !== base + ".html" && f !== game && files.indexOf(f) < 0) fs.unlinkSync(path.join(out, f)); });

var zip = path.join(outAll, base + "-Canvas.zip");
if (fs.existsSync(zip)) fs.unlinkSync(zip);
cp.execFileSync("zip", ["-q", "-X", "-j", zip].concat([base + ".html", game].concat(files).map(function (f) { return path.join(out, f); })));

var mb = function (b) { return (b / 1048576).toFixed(1) + " MiB"; };
console.log("Canvas " + NAME + " v" + man.version + ": " + path.relative(root, out) + "/ (" + base + ".html " + (Buffer.byteLength(starter) / 1024).toFixed(1) + " KiB, " + game + ", " +
  files.length + " data files) and " + path.relative(root, zip) + " (" + mb(fs.statSync(zip).size) + ")");
