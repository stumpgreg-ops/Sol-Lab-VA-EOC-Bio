/* Canvas build: node tools/build-canvas.js [--no-webp] [--with-music] [outDir]
   Writes dist/canvas/: a small starter page (SOLLab-VA-Algebra.html), the loader (SOLLab-VA-Algebra-game.js) and
   the game in data files (SOLLab-VA-Algebra-data-NN.js, ~0.8 MB each). Upload every file to ONE Canvas folder and
   link or frame the .html. Canvas runs the scripts of a small page but not of a big one, so the game travels in the
   data files: one gzip bundle of every file the game needs (page markup, CSS, scripts, assets), base64, split.
   Same format as the SOL Labyrinth backbone's tools/build-canvas.js (v5.8.2): the bundle is a 4-byte big-endian
   header length, a JSON header [[path, offset, length, deltaOfPath?], …] and the file bytes; PNGs travel as lossless
   WebP when smaller (the loader names the type by the bytes); a near-copy of another model is stored as a delta.
   Music stays out (the loader answers those requests with an empty data: URL) unless --with-music. */
var fs = require("fs"), path = require("path"), zlib = require("zlib"), crypto = require("crypto"), cp = require("child_process");
var root = path.join(__dirname, "..");
var args = process.argv.slice(2), noWebp = args.indexOf("--no-webp") !== -1, withMusic = args.indexOf("--with-music") !== -1;
var outDir = args.filter(function (a) { return a[0] !== "-"; })[0] || path.join(root, "dist", "canvas");
var NAME = "SOLLab-VA-Algebra", CANVAS_ID = "algebra", TITLE = "SOL Lab · Algebra I";
var CHUNK = 800000;   /* base64 characters per data file (~0.6 MB of bundle each) */

function rel(f) { return path.relative(root, f).split(path.sep).join("/"); }
function walk(dir, acc) { fs.readdirSync(dir).forEach(function (n) { var f = path.join(dir, n), st = fs.statSync(f); if (st.isDirectory()) walk(f, acc); else if (!/^\./.test(n) && n !== "Thumbs.db") acc.push(f); }); return acc; }
function noQuery(u) { return u.replace(/[?#].*$/, ""); }

/* ── what the page is made of ── */
var html = fs.readFileSync(path.join(root, "index.html"), "utf8");
var version = (html.match(/SOL Lab · Algebra I · v([\d.]+)/) || [0, "0"])[1];
var css = []; html.replace(/<link rel="stylesheet" href="([^"]+)"/g, function (m, h) { css.push(noQuery(h)); });
var bodyStart = html.indexOf("<body>") + 6, bodyEnd = html.indexOf("\n  <script", bodyStart);
var page = html.slice(bodyStart, bodyEnd).replace(/\?v=[\d.]+/g, "");
var scripts = [];
html.slice(bodyEnd).replace(/<script(?: src="([^"]+)")?>([\s\S]*?)<\/script>/g, function (m, src, code) { scripts.push(src ? { src: noQuery(src) } : { code: code }); return ""; });
var bodyClass = (html.match(/<body class="([^"]*)"/) || [0, ""])[1];

/* ── the files ── */
var files = {};   /* path -> Buffer */
files["__page.html"] = Buffer.from(page, "utf8");
css.forEach(function (p) { files[p] = fs.readFileSync(path.join(root, p)); });
scripts.forEach(function (s) { if (s.src) files[s.src] = fs.readFileSync(path.join(root, s.src)); });
walk(path.join(root, "assets"), []).forEach(function (f) {
  var r = rel(f);
  if (!withMusic && /^assets\/music\//.test(r)) return;
  files[r] = fs.readFileSync(f);
});

/* PNG -> lossless WebP where smaller (tools/png2webp.py, Pillow) */
var webpSaved = 0, webpN = 0;
if (!noWebp) {
  var tmp = fs.mkdtempSync(path.join(require("os").tmpdir(), "sol-webp-"));
  var pngs = Object.keys(files).filter(function (p) { return /\.png$/i.test(p); });
  var lines = pngs.map(function (p) { return path.join(root, p) + "\t" + path.join(tmp, p); }).join("\n") + "\n";
  var r = cp.spawnSync("python3", [path.join(__dirname, "png2webp.py")], { input: lines, encoding: "utf8", maxBuffer: 1 << 26 });
  if (r.status !== 0) console.warn("WebP step skipped: " + (r.stderr || "").split("\n")[0]);
  else (r.stdout || "").split("\n").filter(Boolean).forEach(function (dst) {
    var p = path.relative(tmp, dst).split(path.sep).join("/"), w = fs.readFileSync(dst);
    webpSaved += files[p].length - w.length; webpN++; files[p] = w;
  });
  fs.rmSync(tmp, { recursive: true, force: true });
}

/* ── deltas: a model whose name differs from another's only by its colour word is stored against it ── */
function varint(n) { var b = []; do { var c = n % 128; n = Math.floor(n / 128); b.push(n ? c | 128 : c); } while (n); return b; }
function delta(base, target) {
  var B = 16, map = new Map(), i, out = [], lit = [];
  for (i = 0; i + B <= base.length; i += B) { var k = base.toString("latin1", i, i + B); if (!map.has(k)) map.set(k, i); }
  function flush(copyLen, off) { out.push.apply(out, varint(lit.length)); for (var j = 0; j < lit.length; j++) out.push(lit[j]); lit = []; out.push.apply(out, varint(copyLen)); out.push.apply(out, varint(off)); }
  i = 0;
  while (i < target.length) {
    var m = i + B <= target.length ? map.get(target.toString("latin1", i, i + B)) : undefined;
    if (m !== undefined) {
      var len = B; while (i + len < target.length && m + len < base.length && target[i + len] === base[m + len]) len++;
      flush(len, m); i += len;
    } else { lit.push(target[i]); i++; }
  }
  if (lit.length) flush(0, 0);
  return Buffer.from(out);
}
function undelta(a, d) {   /* the loader's decoder, to prove each delta before it ships */
  var parts = [], n = 0, i = 0;
  function v() { var x = 0, m = 1, c; do { c = d[i++]; x += (c & 127) * m; m *= 128; } while (c & 128); return x; }
  while (i < d.length) { var l = v(); parts.push(d.subarray(i, i + l)); n += l; i += l; var c = v(), o = v(); if (c) { parts.push(a.subarray(o, o + c)); n += c; } }
  return Buffer.concat(parts, n);
}
var deltas = {}, deltaSaved = 0;
var COLOURS = /_(blue|red|green|yellow)(\.[a-z]+)$/i;
Object.keys(files).forEach(function (p) {
  var m = p.match(COLOURS); if (!m || /_blue\./i.test(p)) return;
  var base = p.replace(COLOURS, "_blue$2"); if (!files[base]) return;
  var d = delta(files[base], files[p]);
  if (d.length < files[p].length * 0.6 && undelta(files[base], d).equals(files[p])) { deltaSaved += files[p].length - d.length; deltas[p] = { base: base, bytes: d }; }
});

/* ── the bundle ── */
var order = Object.keys(files).sort(function (a, b) { return (deltas[a] ? 1 : 0) - (deltas[b] ? 1 : 0) || (a < b ? -1 : 1); });   /* bases first */
var head = [], chunks = [], off = 0;
order.forEach(function (p) {
  var b = deltas[p] ? deltas[p].bytes : files[p];
  head.push(deltas[p] ? [p, off, b.length, deltas[p].base] : [p, off, b.length]);
  chunks.push(b); off += b.length;
});
var headBuf = Buffer.from(JSON.stringify(head), "utf8"), len = Buffer.alloc(4); len.writeUInt32BE(headBuf.length, 0);
var raw = Buffer.concat([len, headBuf].concat(chunks));
var gz = zlib.gzipSync(raw, { level: 9 });
var hash = crypto.createHash("sha1").update(gz).digest("hex").slice(0, 12);
var b64 = gz.toString("base64"), parts = [];
for (var i = 0; i < b64.length; i += CHUNK) parts.push(b64.slice(i, i + CHUNK));
var dataNames = parts.map(function (s, i) { return NAME + "-data-" + String(i + 1).padStart(2, "0") + ".js"; });
var manifest = { state: "VA", version: version, hash: hash, bytes: gz.length, files: order.length, parts: [], body: bodyClass, css: css, scripts: scripts };

/* ── write ── */
fs.rmSync(outDir, { recursive: true, force: true }); fs.mkdirSync(outDir, { recursive: true });
parts.forEach(function (s, i) {
  fs.writeFileSync(path.join(outDir, dataNames[i]), "/* " + TITLE + " v" + version + ": game data " + (i + 1) + " (open " + NAME + ".html, not this file) */\nsolPart(" + i + "," + JSON.stringify(hash) + "," + JSON.stringify(s) + ");\n");
});
var loader = fs.readFileSync(path.join(__dirname, "canvas-loader.js"), "utf8");
fs.writeFileSync(path.join(outDir, NAME + "-game.js"),
  "/* " + TITLE + " v" + version + " (open " + NAME + ".html, not this file) */\n" +
  "window.SOL_CANVAS_ID = " + JSON.stringify(CANVAS_ID) + ";\n" +
  "window.SOL_PARTS = " + JSON.stringify({ manifest: manifest, files: dataNames }) + ";\n" + loader);
var starter = fs.readFileSync(path.join(__dirname, "canvas-starter.html"), "utf8").split("{{TITLE}}").join(TITLE).split("{{NAME}}").join(NAME);
fs.writeFileSync(path.join(outDir, NAME + ".html"), starter);

/* one zip to hand a teacher: unzip, upload every file to one Canvas folder */
var zipPath = path.join(path.dirname(outDir), NAME + "-Canvas.zip");
try { fs.rmSync(zipPath, { force: true }); cp.execFileSync("zip", ["-q", "-j", "-X", zipPath].concat(fs.readdirSync(outDir).map(function (f) { return path.join(outDir, f); }))); console.log(rel(zipPath) + ": " + (fs.statSync(zipPath).size / 1048576).toFixed(1) + " MB"); }
catch (e) { console.warn("zip not written (" + e.message.split("\n")[0] + ")"); }
var total = fs.readdirSync(outDir).reduce(function (n, f) { return n + fs.statSync(path.join(outDir, f)).size; }, 0);
console.log(rel(outDir) + "/: " + (parts.length + 2) + " files, " + (total / 1048576).toFixed(1) + " MB on disk");
console.log("  bundle: " + order.length + " game files, " + (raw.length / 1048576).toFixed(1) + " MB raw -> " + (gz.length / 1048576).toFixed(1) + " MB gzip (hash " + hash + ")");
console.log("  webp: " + webpN + " PNGs converted, saved " + (webpSaved / 1048576).toFixed(1) + " MB · deltas: " + Object.keys(deltas).length + " models, saved " + (deltaSaved / 1048576).toFixed(1) + " MB" + (withMusic ? " · with music" : " · no music"));
