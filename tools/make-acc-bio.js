/* Build js/acc-bio.js, the word lists for the accommodations (js/accommodations.js): node tools/make-acc-bio.js
   Sources (edit these, then run this again):
     tools/acc/bio-def.json  word → a short student definition. Everyday, academic and setting words only: no Biology
                             or science term is ever defined, so a definition never gives an answer away.
     tools/acc/bio-tr.json   word → {es, ar, fa, ru}: a word-to-word dictionary of every word in the questions and
                             answers, in the sense the question uses ("—" where a word has no translation).
   Checks that every word in a question or answer has a translation in all four languages, and that every defined
   word is used somewhere in the packs. --report lists the questions whose right answer alone contains a defined
   word, for a person to read over. Run it again whenever questions change (tools/validate-content.js reminds you). */
var fs = require("fs"), path = require("path");
var root = path.join(__dirname, ".."), dir = path.join(__dirname, "acc");
var g = {}; g.window = g;
fs.readdirSync(path.join(root, "js")).filter(function (f) { return /^content\d*\.js$/.test(f); })
  .sort(function (a, b) { return (parseInt(a.slice(7)) || 0) - (parseInt(b.slice(7)) || 0); })
  .forEach(function (f) { new Function("window", "global", "self", fs.readFileSync(path.join(root, "js", f), "utf8"))(g, g, g); });
var P = g.HEIST_PACKS, RE = /[A-Za-z][A-Za-z'’-]*[A-Za-z]|[A-Za-z]/g;
function norm(w) { return String(w).replace(/’/g, "'").replace(/'s$/i, "").replace(/'$/, "").toLowerCase(); }
function txt(h) { return String(h || "").replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " "); }
function words(t) { return (txt(t).match(RE) || []).map(norm); }
var def = JSON.parse(fs.readFileSync(path.join(dir, "bio-def.json"), "utf8"));
var tr = JSON.parse(fs.readFileSync(path.join(dir, "bio-tr.json"), "utf8"));
var qa = {}, used = {}, problems = [];
P.forEach(function (p) {
  words(p.passage).forEach(function (w) { used[w] = 1; });
  (p.claims || []).forEach(function (c) {
    [c.stem].concat((c.choices || []).map(function (x) { return x.text; })).forEach(function (t) { words(t).forEach(function (w) { qa[w] = used[w] = 1; }); });
  });
});
Object.keys(qa).forEach(function (w) {
  var t = tr[w];
  if (!t) { problems.push("no translation: " + w); return; }
  ["es", "ar", "fa", "ru"].forEach(function (l) { if (!t[l] || typeof t[l] !== "string") problems.push("no " + l + " for: " + w); });
});
var trOut = {};
Object.keys(qa).sort().forEach(function (w) { if (tr[w]) trOut[w] = { es: tr[w].es, ar: tr[w].ar, fa: tr[w].fa, ru: tr[w].ru }; });
var defOut = {};
Object.keys(def).sort().forEach(function (w) {
  var k = norm(w);
  if (!used[k]) { problems.push("defined but not in any pack: " + w); return; }
  if (typeof def[w] !== "string" || !def[w].trim()) { problems.push("empty definition: " + w); return; }
  defOut[k] = def[w].trim().replace(/\.$/, "");
});
if (process.argv.indexOf("--report") !== -1) {
  P.forEach(function (p) { (p.claims || []).forEach(function (c) {
    var right = (c.choices || []).filter(function (x) { return x.letter === c.correct; })[0];
    if (!right) return;
    var others = {}; (c.choices || []).forEach(function (x) { if (x !== right) words(x.text).forEach(function (w) { others[w] = 1; }); });
    words(c.stem).forEach(function (w) { others[w] = 1; });
    var hit = words(right.text).filter(function (w) { return defOut[w] && !others[w]; });
    if (hit.length) console.log("check " + p.id + ":" + c.id + "  right answer alone has: " + hit.join(", ") + "  — " + txt(right.text).trim());
  }); });
}
if (problems.length) { console.error(problems.slice(0, 40).join("\n") + (problems.length > 40 ? "\n… " + (problems.length - 40) + " more" : "")); process.exit(1); }
var head = "/* SOL Lab Biology: the word lists for the accommodations (js/accommodations.js), v6.5.\n" +
  "   def: short student definitions of everyday, academic and setting words in the passages, questions and answers;\n" +
  "   no Biology or science term is defined, so a definition never gives an answer away.\n" +
  "   tr: a word-to-word dictionary of every word in the questions and answers (es Spanish, ar Arabic, fa Farsi,\n" +
  "   ru Russian), the sense used in the question. Made by tools/make-acc-bio.js from tools/acc/; do not edit by hand. */\n";
fs.writeFileSync(path.join(root, "js", "acc-bio.js"), head + "window.SOL_ACC_DATA = " + JSON.stringify({ def: defOut, tr: trOut }) + ";\n");
console.log("js/acc-bio.js: " + Object.keys(defOut).length + " definitions, " + Object.keys(trOut).length + " dictionary words (" +
  (fs.statSync(path.join(root, "js", "acc-bio.js")).size / 1024).toFixed(0) + " KiB)");
