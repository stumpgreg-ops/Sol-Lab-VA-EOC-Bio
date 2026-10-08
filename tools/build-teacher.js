/* node tools/build-teacher.js : writes teacher/ALG.html, the teacher screen the game opens over itself
   (js/teacher-screen.js fetches teacher/<STATE>.html; the Teacher link appears after typing "teacher" in the
   nickname box). The page is the SOL Labyrinth backbone's teacher page (tools/teacher-page.html, taken from the
   Reading game's v5.17.1 Canvas build) with the game's state, name and version filled in and js/progress-code.js
   inlined, so the game and the page always read codes with the same file. Run it after any change to
   js/progress-code.js or index.html's version. */
var fs = require("fs"), path = require("path");
var root = path.join(__dirname, ".."), STATE = "ALG";
var html = fs.readFileSync(path.join(root, "index.html"), "utf8");
var version = (html.match(/SOL Lab · Algebra I · v([\d.]+)/) || [0, "0"])[1];
var code = fs.readFileSync(path.join(root, "js", "progress-code.js"), "utf8");
var stds = fs.readFileSync(path.join(root, "js", "standards-alg.js"), "utf8");   /* tools/build-standards.js; the standards report groups each code under its standard */
var B = (function () { var w = {}; new Function("module", "window", code)(undefined, w); return (w.SolProgressCode || {}).BUILDS; })();
if (!B || !B[STATE]) throw new Error("js/progress-code.js has no build " + STATE);
var out = fs.readFileSync(path.join(__dirname, "teacher-page.html"), "utf8")
  .split("{{STATE}}").join(STATE).split("{{SHORT}}").join(B[STATE].short).split("{{NAME}}").join(B[STATE].name).split("{{ASSIGNMENT}}").join(B[STATE].assignment)
  .split("{{VERSION}}").join(version).replace("{{PROGRESS_CODE_JS}}", function () { return code; }).replace("{{STANDARDS_JS}}", function () { return stds; });
fs.mkdirSync(path.join(root, "teacher"), { recursive: true });
fs.writeFileSync(path.join(root, "teacher", STATE + ".html"), out);
console.log("teacher/" + STATE + ".html: " + (out.length / 1024).toFixed(0) + " KB, game version " + version + ", " + B[STATE].name);
