/* SOL Lab Biology (from SOL Labyrinth). The teacher progress page for one game: one self-contained HTML file (no outside scripts, fonts or images; Canvas
   and school filters block them). v5.15: it is the game's Teacher screen (tools/build-games.js puts it in each game
   as teacher/<STATE>.html) and a file in each Canvas zip that a teacher opens on their own computer. It reads students' progress codes and suggests
   a participation grade (see README: "Progress codes and the teacher page").
     require("./build-teacher").build("VA", "5.12.2") -> the page's HTML
     node tools/build-teacher.js VA [out.html]         -> writes it (default dist/teacher/SOLLabyrinth-VA-Teacher.html)
   v6.4 (Biology): node tools/build-teacher.js writes teacher/BIO.html next to index.html (the game's Teacher screen fetches it;
   tools/build-appsscript.js packs it into the bundle). tools/build-canvas.js puts it in each Canvas zip. The page = tools/teacher/teacher.html with js/progress-code.js
   (the one code format the game also uses) and tools/teacher/teacher.js inlined. */
var fs = require("fs"), path = require("path");
var root = path.join(__dirname, "..");
var C = require(path.join(root, "js", "progress-code.js"));
var tokenize = require("./jstok").tokenize;
/* v5.15: the page's scripts lose their comments and spare spaces (the code is unchanged: only the gaps between the
   tokens are touched, and a line break stays a line break), so the page stays small enough for Canvas to run. */
function minifyJs(src) {
  var toks = tokenize(src), out = "", prev = null;
  function wordy(t) { return t && (t.type === "id" || t.type === "num"); }
  toks.forEach(function (t) {
    var gap = src.slice(prev ? prev.end : 0, t.start);
    var bare = gap.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, "");
    var keep = bare.replace(/\s+/g, "");                       /* template-literal delimiters (` ${ }) stay */
    var sep = "";
    if (/\n/.test(bare)) sep = "\n";
    else if (/\s/.test(bare) && prev && ((wordy(prev) && wordy(t)) || (prev.type === "punct" && t.type === "punct") || keep)) sep = " ";
    out += (keep ? (sep && !/\n/.test(sep) ? " " : sep) + keep + (sep === "\n" ? "" : "") : sep) + src.slice(t.start, t.end);
    prev = t;
  });
  return out + src.slice(prev ? prev.end : 0).replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "").replace(/\s+/g, "\n");
}
var LOOK = {
  VA: { BG: "#0b0d13", PANEL: "#151923", PANEL2: "#1d2230", LINE: "#3a4150", GOLD: "#f5c842" },
  NJ: { BG: "#0b0d13", PANEL: "#151923", PANEL2: "#1d2230", LINE: "#3a4150", GOLD: "#f5c842" },
  /* the Odyssey's black glaze, wine and ochre (css/odyssey.css) */
  ODY: { BG: "#140c0a", PANEL: "#22130f", PANEL2: "#2e1a14", LINE: "#6a4430", GOLD: "#e8b04a" },
  BIO: { BG: "#0b0d13", PANEL: "#151923", PANEL2: "#1d2230", LINE: "#3a4150", GOLD: "#f5c842" }
};
function fileName(st) { return (st === "BIO" ? "SOLLab-VA-Bio" : st === "ODY" ? "SOLLabyrinth-Odyssey" : "SOLLabyrinth-" + st) + "-Teacher.html"; }
function build(st, version) {
  st = String(st || "VA").toUpperCase();
  var B = C.BUILDS[st];
  if (!B) throw new Error("tools/build-teacher.js: no game " + st);
  var tpl = fs.readFileSync(path.join(__dirname, "teacher", "teacher.html"), "utf8");
  var code = fs.readFileSync(path.join(root, "js", "progress-code.js"), "utf8");
  var app = fs.readFileSync(path.join(__dirname, "teacher", "teacher.js"), "utf8");
  /* v5.17: the standards and their text for the standards report (Virginia: js/standards-va.js with LOTS/HOTS skills;
     v6.4.1 Biology: js/standards-bio.js, the 2018 Biology SOL and their key ideas, made by tools/make-standards-bio.js) */
  var stdFile = st === "BIO" ? "standards-bio.js" : st === "VA" ? "standards-va.js" : "";
  var stds = stdFile && fs.existsSync(path.join(root, "js", stdFile)) ? fs.readFileSync(path.join(root, "js", stdFile), "utf8") : "";
  [code, app, stds].forEach(function (js) { if (/<\/script/i.test(js)) throw new Error("tools/build-teacher.js: a script holds </script"); });
  var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); };
  var vals = Object.assign({
    TITLE: esc(B.short + " · teacher progress page"),
    HEADING: esc(B.name) + " · teacher progress page",
    VERSION: esc(version || "?"), ASSIGNMENT: esc(B.assignment), ST: st,
    CODE_JS: minifyJs(code), APP_JS: minifyJs(app), STD_JS: stds ? minifyJs(stds) : ""
  }, LOOK[st]);
  var html = tpl.replace(/\{\{([A-Z0-9_]+)\}\}/g, function (m, k) {
    if (!(k in vals)) throw new Error("tools/build-teacher.js: no value for " + m);
    return vals[k];
  });
  var size = Buffer.byteLength(html);
  /* v5.15: the page opens inside the game (Teacher) or from the teacher's own computer, never as a Canvas page of its
     own, so Canvas's limit on a page's size doesn't apply; this only catches a page that grew by mistake. */
  if (size > 200 * 1024) throw new Error("tools/build-teacher.js: the teacher page is " + size + " bytes (more than 200 KB)");
  return html;
}
module.exports = { build: build, fileName: fileName, minifyJs: minifyJs };

if (require.main === module) {
  var st = (process.argv[2] || "BIO").toUpperCase();
  var ver = (fs.readFileSync(path.join(root, "index.html"), "utf8").match(/\?v=([0-9.]+)/) || [0, "0"])[1];
  /* the game's Teacher screen (js/teacher-screen.js) fetches teacher/<STATE>.html next to index.html */
  var out = process.argv[3] || path.join(root, "teacher", st + ".html");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  var html = build(st, ver);
  fs.writeFileSync(out, html);
  console.log("teacher page " + st + ": " + path.relative(process.cwd(), out) + " (" + (Buffer.byteLength(html) / 1024).toFixed(1) + " KiB)");
}
