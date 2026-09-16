#!/usr/bin/env node
/* Validates the question packs in js/content*.js.
   Usage: node tools/validate-content.js            (all files)
          node tools/validate-content.js js/content3.js
   Loads content.js first (it defines HEIST_PACKS, the units and the standards map), then
   every other content file, and checks structure, uniqueness, answer keys, standard codes
   and stimulus length. Exit 1 on any error. */
var fs = require("fs"), path = require("path"), vm = require("vm");
var root = path.join(__dirname, "..");
var args = process.argv.slice(2);
var all = fs.readdirSync(path.join(root, "js")).filter(function (f) { return /^content\d*\.js$/.test(f); })
  .sort(function (a, b) { return num(a) - num(b); });
function num(f) { var m = f.match(/content(\d*)\.js/); return m[1] === "" ? 0 : parseInt(m[1], 10); }
var files = args.length ? ["content.js"].concat(args.map(function (a) { return path.basename(a); }).filter(function (f) { return f !== "content.js"; })) : all;

var sandbox = { window: {}, console: console };
sandbox.global = sandbox.window;
var errors = [], warnings = [];
var before = 0, perFile = {};
files.forEach(function (f) {
  var src = fs.readFileSync(path.join(root, "js", f), "utf8");
  try { vm.runInNewContext(src, sandbox, { filename: f }); }
  catch (e) { errors.push(f + ": does not load: " + e.message); return; }
  var n = (sandbox.window.HEIST_PACKS || []).length;
  perFile[f] = n - before; before = n;
});
var W = sandbox.window;
var packs = W.HEIST_PACKS || [];
var FAMILIES = W.HEIST_FAMILIES || [], STANDARDS = W.HEIST_STANDARDS || {};
var famIds = FAMILIES.map(function (f) { return f.id; }).filter(function (id) { return id !== "ALL"; });
function famDef(id) { return FAMILIES.filter(function (f) { return f.id === id; })[0]; }
var ids = {}, stems = {}, passages = {};
var stats = {}, levelStats = {};
function words(html) { return String(html).replace(/<[^>]+>/g, " ").replace(/\(\d+\)/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean).length; }

packs.forEach(function (p, pi) {
  var where = (p.id || ("pack#" + pi));
  if (!p.id || typeof p.id !== "string") errors.push(where + ": missing id");
  else if (!/^[a-z0-9-]+$/.test(p.id)) errors.push(where + ": id must be lowercase letters, digits and dashes");
  if (ids[p.id]) errors.push(where + ": duplicate pack id"); ids[p.id] = true;
  var fam = famDef(p.family);
  if (!fam || p.family === "ALL") errors.push(where + ": family must be one of " + famIds.join("/") + ", got " + p.family);
  if (p.level != null && !(p.level === 1 || p.level === 2 || p.level === 3)) errors.push(where + ": level must be 1, 2 or 3");
  if (p.level == null) warnings.push(where + ": no level (1 easy, 2 medium, 3 hard) — it will be estimated from readability");
  else levelStats[p.family + ".L" + p.level] = (levelStats[p.family + ".L" + p.level] || 0) + 1;
  if (!p.title) errors.push(where + ": missing title");
  if (!p.kind) errors.push(where + ": missing kind");
  if (!p.passage || typeof p.passage !== "string") { errors.push(where + ": missing passage (the stimulus)"); return; }
  var wc = words(p.passage);
  if (wc < 35 || wc > 260) warnings.push(where + ": stimulus is " + wc + " words (expected 40-220)");
  if (/<img|<script|<style|<iframe/i.test(p.passage)) errors.push(where + ": stimulus may not contain img/script/style/iframe");
  var key = p.passage.replace(/<[^>]+>/g, "").slice(0, 120);
  if (passages[key]) errors.push(where + ": stimulus text duplicates " + passages[key]); passages[key] = where;
  if (!Array.isArray(p.claims) || !p.claims.length) { errors.push(where + ": no claims"); return; }
  if (p.claims.length < 4 || (p.claims.length < 5 && wc > 90)) warnings.push(where + ": only " + p.claims.length + " claims (aim for 6; 4–5 on a tiny pack)");
  var letterCount = {}, solSeen = {};
  p.claims.forEach(function (c, ci) {
    var w = where + ":" + (c.id || ("claim#" + ci));
    if (!c.id) errors.push(w + ": missing claim id");
    if (p.claims.filter(function (x) { return x.id === c.id; }).length > 1) errors.push(w + ": duplicate claim id in pack");
    var sol = String(c.sol || "");
    var m = /^(BIO\.[1-8])\.([a-f])$/.exec(sol);
    if (!m) errors.push(w + ": sol code should look like BIO.8.a, got " + sol);
    else {
      var std = STANDARDS[m[1]];
      if (!std || !std.keys[m[2]]) errors.push(w + ": " + sol + " is not a key idea in the standards map");
      if (fam && fam.stds && !fam.stds.some(function (s) { return sol.toUpperCase() === s.toUpperCase() || sol.toUpperCase().indexOf(s.toUpperCase() + ".") === 0; }))
        errors.push(w + ": " + sol + " is outside unit " + p.family + " (" + fam.stds.join(", ") + ")");
      stats[m[1]] = (stats[m[1]] || 0) + 1;
      solSeen[sol] = true;
    }
    if (c.partB != null) {
      var pb = p.claims.filter(function (x) { return x.id === c.partB; })[0];
      if (!pb) errors.push(w + ": partB points at missing claim " + c.partB);
      else if (pb === c) errors.push(w + ": partB points at itself");
      else if (pb.partB) errors.push(w + ": a Part B claim cannot have its own partB");
    }
    if (!c.stem || typeof c.stem !== "string") errors.push(w + ": missing stem");
    var sk = (c.stem || "").toLowerCase().replace(/\s+/g, " ").trim();
    if (stems[sk] && stems[sk] !== where) warnings.push(w + ": stem repeats one in " + stems[sk]); stems[sk] = where;
    if (!Array.isArray(c.choices) || c.choices.length !== 4) { errors.push(w + ": needs exactly 4 choices"); return; }
    var letters = c.choices.map(function (ch) { return ch.letter; }).join("");
    if (letters !== "ABCD") errors.push(w + ": choice letters must be A,B,C,D in order (got " + letters + ")");
    var texts = {};
    c.choices.forEach(function (ch) {
      if (!ch.text || typeof ch.text !== "string") errors.push(w + ": empty choice " + ch.letter);
      var t = String(ch.text).trim().toLowerCase();
      if (texts[t]) errors.push(w + ": duplicate choice text"); texts[t] = true;
    });
    var corr = Array.isArray(c.correct) ? c.correct : [c.correct];
    if (!corr.length || corr.length > 2) errors.push(w + ": correct must be one letter or an array of two");
    corr.forEach(function (L) { if (!/^[ABCD]$/.test(String(L))) errors.push(w + ": correct letter " + L + " not in A-D"); letterCount[L] = (letterCount[L] || 0) + 1; });
    if (corr.length === 2 && !/TWO/i.test(c.stem)) warnings.push(w + ": two correct answers but the stem does not say 'Select TWO'");
    if (corr.length === 1 && /select\s+two/i.test(c.stem)) errors.push(w + ": stem says Select TWO but only one correct letter");
    var lens = c.choices.map(function (ch) { return String(ch.text).length; });
    var longest = Math.max.apply(null, lens), idx = lens.indexOf(longest);
    if (corr.length === 1 && c.choices[idx].letter === corr[0] && longest > 1.6 * (lens.reduce(function (a, b) { return a + b; }, 0) - longest) / 3)
      warnings.push(w + ": the correct answer is much longer than the others");
  });
  if (p.claims.length >= 6 && Object.keys(solSeen).length < 3) warnings.push(where + ": only " + Object.keys(solSeen).length + " distinct key ideas across " + p.claims.length + " items — mix more");
  var maxSame = Math.max.apply(null, Object.keys(letterCount).map(function (k) { return letterCount[k]; }));
  if (maxSame >= 4) warnings.push(where + ": " + maxSame + " answers share one letter — spread the keys");
});

console.log("Files: " + files.map(function (f) { return f + " (" + (perFile[f] || 0) + " packs)"; }).join(", "));
console.log("Packs: " + packs.length + "  Questions: " + packs.reduce(function (a, p) { return a + (p.claims ? p.claims.length : 0); }, 0));
Object.keys(stats).sort().forEach(function (k) { console.log("  " + k + ": " + stats[k]); });
Object.keys(levelStats).sort().forEach(function (k) { console.log("  " + k + ": " + levelStats[k]); });
warnings.forEach(function (w) { console.log("WARN  " + w); });
errors.forEach(function (e) { console.log("ERROR " + e); });
console.log(errors.length ? errors.length + " error(s)" : "OK — no errors" + (warnings.length ? " (" + warnings.length + " warnings)" : ""));
process.exit(errors.length ? 1 : 0);
