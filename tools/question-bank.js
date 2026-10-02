#!/usr/bin/env node
/* Writes docs/question-bank.md: every pack and question, by unit and difficulty level, with the
   key and the standard code, for a teacher to verify. Usage: node tools/question-bank.js */
var fs = require("fs"), path = require("path"), vm = require("vm");
var root = path.join(__dirname, "..");
var files = fs.readdirSync(path.join(root, "js")).filter(function (f) { return /^content\d*\.js$/.test(f); })
  .sort(function (a, b) { return num(a) - num(b); });
function num(f) { var m = f.match(/content(\d*)\.js/); return m[1] === "" ? 0 : parseInt(m[1], 10); }
var sb = { window: {}, console: console }; sb.global = sb.window;
files.forEach(function (f) { vm.runInNewContext(fs.readFileSync(path.join(root, "js", f), "utf8"), sb, { filename: f }); });
var W = sb.window, packs = W.HEIST_PACKS, FAM = W.HEIST_FAMILIES, STD = W.HEIST_STANDARDS;
function mdTable(tbl) {
  /* an HTML table -> a Markdown table (header separator after the first row) */
  var rows = tbl.split(/<tr[^>]*>/i).slice(1).map(function (r) {
    return r.split(/<t[hd][^>]*>/i).slice(1).map(function (c) { return c.replace(/<\/t[hd]>[\s\S]*$/i, "").replace(/<[^>]+>/g, "").trim(); });
  }).filter(function (r) { return r.length; });
  if (!rows.length) return "";
  var out = ["| " + rows[0].join(" | ") + " |", "|" + rows[0].map(function () { return "---"; }).join("|") + "|"];
  rows.slice(1).forEach(function (r) { out.push("| " + r.join(" | ") + " |"); });
  return "\n\n" + out.join("\n") + "\n\n";
}
function text(html) {
  return String(html)
    .replace(/<span class="n">\((\d+)\)<\/span>\s*/g, "($1) ")
    .replace(/<table[\s\S]*?<\/table>/gi, mdTable)
    .replace(/<li>/g, "- ").replace(/<\/li>/g, "\n").replace(/<\/p>/g, "\n\n").replace(/<br\s*\/?>/g, "\n")
    .replace(/<strong>/g, "**").replace(/<\/strong>/g, "**").replace(/<em>/g, "_").replace(/<\/em>/g, "_")
    .replace(/<[^>]+>/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}
function words(html) { return String(html).replace(/<[^>]+>/g, " ").replace(/\(\d+\)/g, " ").split(/\s+/).filter(Boolean).length; }
var out = [], total = 0, byLevel = { 1: 0, 2: 0, 3: 0 };
out.push("# SOL Lab — Algebra I question bank (teacher review copy)\n");
out.push("Every problem-set pack and question in the game, grouped by strand and difficulty level, with the answer key and the 2023 Virginia Algebra I SOL code each item is tagged with. Generated from `js/content*.js` by `node tools/question-bank.js`; edit the pack files, not this page.\n");
out.push("## How the game chooses questions for a student\n");
out.push("- Every pack carries a **level** tag: 1 (one step: evaluate, read a table, identify a slope), 2 (a typical SOL item: solve a multistep equation, write a model, interpret a parameter), 3 (multi-step reasoning: a system in context, a quadratic model, a judgment about a prediction).");
out.push("- Each student's Chromebook keeps an **ability** score per unit that starts at 1.6 (between levels 1 and 2). A question answered with no wrong letter grabbed nudges it up by 0.12; grabbing a wrong letter drops it by 0.18. The picker weights every candidate by how close its level is to the ability score, so an **average high-school student** (ability settling around 2) draws mostly level 2 packs, with level 1 and 3 packs mixed in at lower weight.");
out.push("- On All-skills levels the picker also leans toward the standards the student has missed most, and it prefers problem sets near the level's target length (short notes early, longer notes later).");
out.push("- The HUD shows the current tag as `SOL · A.EI.2.b · Level 2`.\n");
out.push("**The list under \"Level 2\" in each unit is therefore the core of what an average student sees; level 1 is the floor for a struggling student and level 3 the stretch for a strong one.**\n");
var units = FAM.filter(function (f) { return f.id !== "ALL"; });
out.push("## Contents\n");
units.forEach(function (u) { var ps = packs.filter(function (p) { return p.family === u.id; }); out.push("- " + u.label + " (" + u.kind + "): " + ps.length + " packs, " + ps.reduce(function (a, p) { return a + p.claims.length; }, 0) + " questions"); });
out.push("");
units.forEach(function (u) {
  out.push("\n---\n\n# " + u.label + " (" + u.kind + ")\n");
  var keys = [];
  u.stds.forEach(function (s) { var m = /^(A\.(?:EO|EI|F|ST)\.\d)(?:\.([a-l]))?$/.exec(s); if (!m) return; var st = STD[m[1]]; if (m[2]) keys.push(s + " — " + st.keys[m[2]]); else Object.keys(st.keys).forEach(function (L) { keys.push(m[1] + "." + L + " — " + st.keys[L]); }); });
  out.push("Standards in this unit:\n"); keys.forEach(function (k) { out.push("- " + k); }); out.push("");
  [1, 2, 3].forEach(function (lv) {
    var ps = packs.filter(function (p) { return p.family === u.id && p.level === lv; });
    if (!ps.length) return;
    out.push("\n## Level " + lv + (lv === 1 ? " — foundation" : lv === 2 ? " — average student (core)" : " — stretch") + "\n");
    ps.forEach(function (p) {
      total += p.claims.length; byLevel[lv] += p.claims.length;
      out.push("### " + p.title + "  \n`" + p.id + "` · " + p.kind + " · level " + p.level + " · " + words(p.passage) + " words · " + p.claims.length + " questions\n");
      out.push("> " + text(p.passage).split("\n").join("\n> ") + "\n");
      p.claims.forEach(function (c, i) {
        var corr = Array.isArray(c.correct) ? c.correct.join(" and ") : c.correct;
        out.push((i + 1) + ". **[" + c.sol + "]** " + c.stem);
        c.choices.forEach(function (ch) { out.push("   - " + ch.letter + ". " + ch.text); });
        out.push("   - **Key: " + corr + "**\n");
      });
    });
  });
});
out.splice(2, 0, "**Totals:** " + packs.length + " packs · " + total + " questions · level 1: " + byLevel[1] + " · level 2: " + byLevel[2] + " · level 3: " + byLevel[3] + "\n");
fs.writeFileSync(path.join(root, "docs", "question-bank.md"), out.join("\n") + "\n");
/* the same bank as a printable web page (the lab notes keep their own HTML tables) */
var H = [];
function esc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
H.push('<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SOL Lab · Algebra I question bank (teacher review)</title>');
H.push('<style>body{font:15px/1.5 Georgia,serif;max-width:900px;margin:0 auto;padding:24px 16px;color:#222}h1,h2,h3{font-family:"Trebuchet MS",sans-serif}h1{font-size:26px}h2{font-size:21px;margin-top:40px;border-bottom:2px solid #ccc}h3{font-size:17px;margin:28px 0 4px}.meta{color:#666;font-size:13px;font-family:"Trebuchet MS",sans-serif}.notes{background:#f6f4ec;border-left:4px solid #d4b34a;padding:10px 14px;margin:8px 0 12px}.notes .n{color:#a07c10;font-weight:700;font-size:12px}.notes table{border-collapse:collapse;margin:8px 0}.notes th,.notes td{border:1px solid #bbb;padding:3px 8px;text-align:left}.notes th{background:#ece6d0}ol.q{padding-left:22px}ol.q>li{margin:0 0 12px}.std{color:#7a5c00;font-family:"Trebuchet MS",sans-serif;font-size:12px}ul.ch{list-style:none;padding-left:8px;margin:4px 0}ul.ch li{margin:1px 0}.key{font-weight:700;color:#1d6b2f}.how{background:#eef3ff;padding:10px 14px;border-radius:8px}nav a{margin-right:10px}@media print{h2{page-break-before:always}.notes{background:#fff}}</style></head><body>');
H.push("<h1>SOL Lab — Algebra I question bank (teacher review copy)</h1>");
H.push("<p>Every problem-set pack and question in the game, grouped by strand and difficulty level, with the answer key and the 2023 Virginia Algebra I SOL code each item is tagged with. Generated by <code>node tools/question-bank.js</code>.</p>");
H.push("<p><b>Totals:</b> " + packs.length + " packs · " + total + " questions · level 1: " + byLevel[1] + " · level 2: " + byLevel[2] + " · level 3: " + byLevel[3] + "</p>");
H.push('<div class="how"><b>How the game chooses questions.</b> Every pack has a level tag (1 recall / direct read, 2 typical EOC item, 3 multi-step or Select TWO). A student\'s Chromebook keeps an ability score per unit, starting at 1.6: a clean answer nudges it up 0.12, a wrong letter drops it 0.18, and the picker weights each candidate by how close its level is to that score. An <b>average high-school student</b> settles near level 2 and draws mostly the <b>Level 2</b> packs below, with level 1 and 3 mixed in at lower weight. All-skills levels also lean toward the standards the student misses most.</div>');
H.push("<nav><p>" + units.map(function (u) { return '<a href="#' + u.id + '">' + esc(u.label) + "</a>"; }).join(" · ") + "</p></nav>");
units.forEach(function (u) {
  H.push('<h2 id="' + u.id + '">' + esc(u.label) + " (" + esc(u.kind) + ")</h2>");
  [1, 2, 3].forEach(function (lv) {
    var ps = packs.filter(function (p) { return p.family === u.id && p.level === lv; });
    if (!ps.length) return;
    H.push("<h3>Level " + lv + (lv === 1 ? " — foundation" : lv === 2 ? " — average student (core)" : " — stretch") + "</h3>");
    ps.forEach(function (p) {
      H.push("<h3>" + esc(p.title) + '</h3><p class="meta">' + esc(p.id) + " · " + esc(p.kind) + " · level " + p.level + " · " + words(p.passage) + " words · " + p.claims.length + " questions</p>");
      H.push('<div class="notes">' + p.passage + "</div>");
      H.push('<ol class="q">');
      p.claims.forEach(function (c) {
        var corr = Array.isArray(c.correct) ? c.correct.join(" and ") : c.correct;
        H.push('<li><span class="std">[' + esc(c.sol) + "]</span> " + esc(c.stem) + '<ul class="ch">' + c.choices.map(function (ch) { return "<li>" + ch.letter + ". " + esc(ch.text) + "</li>"; }).join("") + '</ul><span class="key">Key: ' + esc(corr) + "</span></li>");
      });
      H.push("</ol>");
    });
  });
});
H.push("</body></html>");
fs.writeFileSync(path.join(root, "docs", "question-bank.html"), H.join("\n") + "\n");
console.log("docs/question-bank.md: " + packs.length + " packs, " + total + " questions (L1 " + byLevel[1] + ", L2 " + byLevel[2] + ", L3 " + byLevel[3] + ")");
