/* Build one self-contained HTML file of the game for hosts that cannot serve a folder
   (an LMS file area such as Canvas Files, a shared drive, a USB stick):
     node tools/make-single-file.js                 -> dist/sol-lab-va-algebra.html
     node tools/make-single-file.js --with-music    -> adds the nine music tracks (~19 MB more)
     node tools/make-single-file.js out.html
   Every stylesheet, script and image is inlined; the game's loaders (Phaser's XHR, the
   builder's Image()s, fetch) are pointed at the inlined copies by a small shim. The 3D castle
   kit (8.8 MB of models) is left out, so the builder uses its 2D view, and three.js goes with it. */
var fs = require("fs"), path = require("path");
var root = path.join(__dirname, "..");
var args = process.argv.slice(2), withMusic = args.indexOf("--with-music") !== -1;
var out = args.filter(function (a) { return a[0] !== "-"; })[0] || path.join(root, "dist", "sol-lab-va-algebra.html");
var MIME = { html: "text/html", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", svg: "image/svg+xml", json: "application/json", mp3: "audio/mpeg", webp: "image/webp" };
var SKIP = [/^assets\/build\/models\//, /\.(glb|obj|mtl)$/];
if (!withMusic) SKIP.push(/^assets\/music\//);
var DROP_SCRIPTS = [/js\/vendor\/three\.min\.js/];

function rel(f) { return path.relative(root, f).split(path.sep).join("/"); }
function dataUri(f) { var ext = f.split(".").pop().toLowerCase(); return "data:" + (MIME[ext] || "application/octet-stream") + ";base64," + fs.readFileSync(f).toString("base64"); }
function walk(dir, acc) { fs.readdirSync(dir).forEach(function (n) { var f = path.join(dir, n), st = fs.statSync(f); if (st.isDirectory()) walk(f, acc); else if (!/^\./.test(n) && n !== "Thumbs.db") acc.push(f); }); return acc; }
function noQuery(u) { return u.replace(/[?#].*$/, ""); }

var files = {}, bytes = 0, count = 0;
walk(path.join(root, "assets"), []).forEach(function (f) {
  var r = rel(f);
  if (SKIP.some(function (re) { return re.test(r); })) return;
  files[r] = dataUri(f); bytes += fs.statSync(f).size; count++;
});

walk(path.join(root, "teacher"), []).forEach(function (f) { files[rel(f)] = dataUri(f); count++; });   /* the teacher screen (js/teacher-screen.js fetches teacher/<STATE>.html) */
var html = fs.readFileSync(path.join(root, "index.html"), "utf8");
/* stylesheets */
html = html.replace(/<link rel="stylesheet" href="([^"]+)"\s*\/?>/g, function (m, href) {
  return "<style>\n" + fs.readFileSync(path.join(root, noQuery(href)), "utf8") + "\n</style>";
});
/* icons and the logo */
html = html.replace(/href="(assets\/[^"]+)"/g, function (m, href) { var k = noQuery(href); return files[k] ? 'href="' + files[k] + '"' : m; });
html = html.replace(/src="(assets\/[^"]+)"/g, function (m, src) { var k = noQuery(src); return files[k] ? 'src="' + files[k] + '"' : m; });
/* the shim + the asset table go in before the first external script */
var shim = "<script>\n(function () {\n" +
  "  var F = window.SOL_FILES = " + JSON.stringify(files) + ";\n" +
  "  window.SOL_SINGLE_FILE = true;\n" +
  "  function map(u) {\n" +
  "    if (typeof u !== 'string' || !u || /^(data|blob|https?):/.test(u)) return u;\n" +
  "    var k = u.replace(/[?#].*$/, '').replace(/^\\.?\\//, '');\n" +
  "    var i = k.indexOf('assets/'); if (i > 0) k = k.slice(i);\n" +
  "    if (F[k]) return F[k];\n" +
  "    return /^assets\\//.test(k) ? 'data:,' : u;   /* left out on purpose (music, 3D models): fail fast, never leave the file */\n" +
  "  }\n" +
  "  window.solMapUrl = map;\n" +
  "  var xo = XMLHttpRequest.prototype.open;\n" +
  "  XMLHttpRequest.prototype.open = function (m, u) { var a = Array.prototype.slice.call(arguments); a[1] = map(u); return xo.apply(this, a); };\n" +
  "  if (window.fetch) { var fo = window.fetch; window.fetch = function (u, o) { return fo.call(this, typeof u === 'string' ? map(u) : u, o); }; }\n" +
  "  function mapHtml(h) { return typeof h === 'string' ? h.replace(/(src=[\"'])([^\"']+)/g, function (m, a, u) { return a + map(u); }) : h; }\n" +
  "  var ih = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');\n" +
  "  if (ih && ih.set) Object.defineProperty(Element.prototype, 'innerHTML', { configurable: true, enumerable: ih.enumerable, get: ih.get, set: function (v) { ih.set.call(this, mapHtml(v)); } });\n" +
  "  var iah = Element.prototype.insertAdjacentHTML; Element.prototype.insertAdjacentHTML = function (w, h) { return iah.call(this, w, mapHtml(h)); };\n" +
  "  var sa = Element.prototype.setAttribute; Element.prototype.setAttribute = function (n, v) { return sa.call(this, n, String(n).toLowerCase() === 'src' ? map(v) : v); };\n" +
  "  [HTMLImageElement, HTMLMediaElement].forEach(function (C) {\n" +
  "    var d = Object.getOwnPropertyDescriptor(C.prototype, 'src'); if (!d || !d.set) return;\n" +
  "    Object.defineProperty(C.prototype, 'src', { configurable: true, enumerable: d.enumerable, get: d.get, set: function (v) { d.set.call(this, map(v)); } });\n" +
  "  });\n" +
  "})();\n</script>\n";
var first = true;
html = html.replace(/<script src="([^"]+)"><\/script>/g, function (m, src) {
  var p = noQuery(src);
  if (DROP_SCRIPTS.some(function (re) { return re.test(p); })) return "<!-- " + p + " left out of the single-file build -->";
  var js = fs.readFileSync(path.join(root, p), "utf8").replace(/<\/script/gi, "<\\/script");
  var pre = first ? shim : ""; first = false;
  return pre + "<script>\n/* " + p + " */\n" + js + "\n</script>";
});
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log(rel(out) + ": " + (fs.statSync(out).size / 1048576).toFixed(1) + " MB, " + count + " assets inlined (" + (bytes / 1048576).toFixed(1) + " MB raw)" + (withMusic ? ", with music" : ", no music"));
