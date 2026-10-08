#!/usr/bin/env node
/* Writes docs/question-bank.docx: the teacher review copy of every problem set and question as a Word document
   (the same walk as tools/question-bank.js). Usage: node tools/question-bank-docx.js */
var fs = require("fs"), path = require("path"), vm = require("vm"), D = require("docx");
var root = path.join(__dirname, "..");
var files = fs.readdirSync(path.join(root, "js")).filter(function (f) { return /^content\d*\.js$/.test(f); })
  .sort(function (a, b) { return num(a) - num(b); });
function num(f) { var m = f.match(/content(\d*)\.js/); return m[1] === "" ? 0 : parseInt(m[1], 10); }
var sb = { window: {}, console: console }; sb.global = sb.window;
files.forEach(function (f) { vm.runInNewContext(fs.readFileSync(path.join(root, "js", f), "utf8"), sb, { filename: f }); });
var W = sb.window, packs = W.HEIST_PACKS, FAM = W.HEIST_FAMILIES, STD = W.HEIST_STANDARDS;
var version = (fs.readFileSync(path.join(root, "index.html"), "utf8").match(/SOL Lab · Algebra I · v([\d.]+)/) || [0, "?"])[1];

var P = D.Paragraph, R = D.TextRun, H = D.HeadingLevel;
var FONT = "Calibri", INK = "1b1b1b", GOLD = "8a6a00", DIM = "555555", KEYBG = "FFF3C4";
function entities(s) { return String(s).replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'"); }
/* inline HTML (strong / em / sup / sub / the (n) sentence markers) -> TextRuns */
function runs(html, base) {
  base = base || {};
  var out = [], s = String(html).replace(/<span class="n">\((\d+)\)<\/span>\s*/g, "\u0001$1\u0002");
  var re = /(<\/?(strong|b|em|i|sup|sub)>)|(\u0001\d+\u0002)|([^<\u0001]+)/g, m, st = { bold: false, italics: false, sup: false, sub: false };
  while ((m = re.exec(s))) {
    if (m[1]) { var tag = m[2], on = m[1].charAt(1) !== "/"; if (tag === "strong" || tag === "b") st.bold = on; else if (tag === "em" || tag === "i") st.italics = on; else if (tag === "sup") st.sup = on; else st.sub = on; }
    else if (m[3]) out.push(new R({ text: "(" + m[3].slice(1, -1) + ") ", bold: true, color: GOLD, font: FONT, size: base.size || 21 }));
    else { var t = entities(m[4].replace(/\s+/g, " ")); if (!t) continue; out.push(new R(Object.assign({ text: t, font: FONT, size: base.size || 22, bold: st.bold || base.bold, italics: st.italics, superScript: st.sup, subScript: st.sub, color: base.color || INK }, {}))); }
  }
  return out;
}
/* the stimulus: <p>, <ol>/<ul>, <table> -> paragraphs and tables */
function stimulus(html) {
  var blocks = [], s = String(html);
  var re = /<table[\s\S]*?<\/table>|<[ou]l>[\s\S]*?<\/[ou]l>|<p>[\s\S]*?<\/p>/gi, m, last = 0;
  function pushLoose(t) { t = t.trim(); if (t) blocks.push(new P({ children: runs(t), spacing: { after: 100 }, indent: { left: 360 } })); }
  while ((m = re.exec(s))) {
    pushLoose(s.slice(last, m.index)); last = m.index + m[0].length;
    var b = m[0];
    if (/^<table/i.test(b)) {
      var rows = b.split(/<tr[^>]*>/i).slice(1).map(function (r) { return r.split(/<t[hd][^>]*>/i).slice(1).map(function (c) { return c.replace(/<\/t[hd]>[\s\S]*$/i, ""); }); }).filter(function (r) { return r.length; });
      var cols = Math.max.apply(null, rows.map(function (r) { return r.length; })), cw = Math.floor(6000 / cols);
      blocks.push(new D.Table({ columnWidths: rows[0].map(function () { return cw; }), indent: { size: 360, type: D.WidthType.DXA }, rows: rows.map(function (r, ri) {
        return new D.TableRow({ children: r.map(function (c) { return new D.TableCell({ width: { size: cw, type: D.WidthType.DXA }, shading: ri === 0 ? { fill: "EFE7CF", type: D.ShadingType.CLEAR, color: "auto" } : undefined, margins: { top: 40, bottom: 40, left: 80, right: 80 }, children: [new P({ children: runs(c, { bold: ri === 0, size: 20 }) })] }); }) });
      }) }));
      blocks.push(new P({ spacing: { after: 60 } }));
    } else if (/^<[ou]l>/i.test(b)) {
      var ordered = /^<ol>/i.test(b), items = b.split(/<li>/i).slice(1).map(function (li) { return li.replace(/<\/li>[\s\S]*$/i, ""); });
      items.forEach(function (li, i) { blocks.push(new P({ children: runs((ordered ? (i + 1) + ". " : "• ") + li), indent: { left: 720, hanging: 300 }, spacing: { after: 40 } })); });
    } else blocks.push(new P({ children: runs(b.replace(/^<p>/i, "").replace(/<\/p>$/i, "")), spacing: { after: 100 }, indent: { left: 360 } }));
  }
  pushLoose(s.slice(last));
  return blocks;
}
function words(html) { return String(html).replace(/<[^>]+>/g, " ").replace(/\(\d+\)/g, " ").split(/\s+/).filter(Boolean).length; }
function heading(text, level) { return new P({ heading: level, children: [new R({ text: text, font: FONT })], spacing: { before: level === H.HEADING_1 ? 360 : 240, after: 120 } }); }
function para(text, opts) { opts = opts || {}; return new P({ children: [new R({ text: text, font: FONT, size: opts.size || 22, color: opts.color || INK, bold: opts.bold, italics: opts.italics })], spacing: { after: opts.after == null ? 120 : opts.after }, indent: opts.indent }); }

var units = FAM.filter(function (f) { return f.id !== "ALL"; });
var body = [];
body.push(new P({ heading: H.TITLE, children: [new R({ text: "SOL Lab · Algebra I — Question Pool", font: FONT })] }));
body.push(para("Teacher review copy of every problem set and question in the game, version " + version + ", generated " + new Date().toISOString().slice(0, 10) + ". Grouped by strand and difficulty level, with the answer key and the 2023 Virginia Algebra I Standards of Learning code each item is tagged with. The key is marked ✓ and shaded.", { color: DIM }));
body.push(heading("How the game chooses questions", H.HEADING_1));
[
  "Every problem set carries a level: 1 (one step: evaluate, read a table, identify a slope), 2 (a typical SOL item: solve a multistep equation, write a model, interpret a parameter), 3 (multi-step reasoning: a system in context, a quadratic model, a best-fit judgement).",
  "Each student's Chromebook keeps an ability score per unit that starts between levels 1 and 2. A question answered with no wrong letter nudges it up; a wrong letter nudges it down. The picker prefers problem sets near the student's level, so a struggling student sees mostly level 1 and 2 items and a strong one mostly 2 and 3.",
  "On Full review and All-skills levels the picker also leans toward the standards the student has missed most, and it prefers problem sets near the level's target length (short sets early, longer sets later).",
  "Level 2 in each unit is the core of what an average student sees; level 1 is the floor and level 3 the stretch."
].forEach(function (t) { body.push(new P({ children: [new R({ text: t, font: FONT, size: 22 })], numbering: { reference: "dots", level: 0 }, spacing: { after: 80 } })); });

/* contents table */
body.push(heading("Contents", H.HEADING_1));
var total = 0;
var crow = function (cells, head) { return new D.TableRow({ tableHeader: !!head, children: cells.map(function (c, i) { return new D.TableCell({ width: { size: [3600, 1600, 1600, 2560][i], type: D.WidthType.DXA }, shading: head ? { fill: "EFE7CF", type: D.ShadingType.CLEAR, color: "auto" } : undefined, margins: { top: 50, bottom: 50, left: 100, right: 100 }, children: [new P({ children: [new R({ text: c, font: FONT, size: 21, bold: !!head })] })] }); }) }); };
var crows = [crow(["Unit", "Packs", "Questions", "Standards"], true)];
units.forEach(function (u) { var ps = packs.filter(function (p) { return p.family === u.id; }), q = ps.reduce(function (a, p) { return a + p.claims.length; }, 0); total += q; crows.push(crow([u.label, String(ps.length), String(q), u.kind + (u.id === "ST" ? ".1" : u.id === "FN" ? ".1–2" : u.id === "EI" ? ".1–3" : ".1–4")])); });
crows.push(crow(["All strands", String(packs.length), String(total), "A.EO · A.EI · A.F · A.ST"], true));
body.push(new D.Table({ columnWidths: [3600, 1600, 1600, 2560], rows: crows }));

units.forEach(function (u) {
  body.push(new P({ children: [new D.PageBreak()] }));
  body.push(heading(u.label + " (" + u.kind + ")", H.HEADING_1));
  body.push(para(u.meta, { color: DIM }));
  body.push(para("Standards in this unit", { bold: true, after: 60 }));
  u.stds.forEach(function (s) {
    var st = STD[s]; if (!st) { Object.keys(STD).filter(function (k) { return k.indexOf(s + ".") === 0; }).forEach(function (k) { line(k); }); return; } line(s);
    function line(k) { body.push(new P({ children: [new R({ text: k + " ", bold: true, font: FONT, size: 21, color: GOLD }), new R({ text: STD[k].name + ": ", bold: true, font: FONT, size: 21 }), new R({ text: Object.keys(STD[k].keys).map(function (L) { return L + ") " + STD[k].keys[L]; }).join("; ") + ".", font: FONT, size: 20, color: DIM })], spacing: { after: 60 }, indent: { left: 360 } })); }
  });
  [1, 2, 3].forEach(function (lv) {
    var ps = packs.filter(function (p) { return p.family === u.id && p.level === lv; });
    if (!ps.length) return;
    body.push(heading("Level " + lv + (lv === 1 ? " — foundation" : lv === 2 ? " — average student (core)" : " — stretch"), H.HEADING_2));
    ps.forEach(function (p) {
      body.push(heading(p.title, H.HEADING_3));
      body.push(para(p.kind + " · level " + p.level + " · " + words(p.passage) + " words · " + p.claims.length + " questions · " + p.id, { color: DIM, size: 19, after: 80 }));
      stimulus(p.passage).forEach(function (b) { body.push(b); });
      p.claims.forEach(function (c, i) {
        var corr = Array.isArray(c.correct) ? c.correct : [c.correct];
        body.push(new P({ children: [new R({ text: (i + 1) + ". ", bold: true, font: FONT, size: 22 }), new R({ text: "[" + c.sol + "] ", bold: true, color: GOLD, font: FONT, size: 20 })].concat(runs(c.stem, { bold: true })), spacing: { before: 120, after: 60 }, indent: { left: 360 }, keepNext: true }));
        c.choices.forEach(function (ch) {
          var key = corr.indexOf(ch.letter) !== -1;
          body.push(new P({ children: [new R({ text: ch.letter + ". ", bold: true, font: FONT, size: 22 })].concat(runs(ch.text)).concat(key ? [new R({ text: "  ✓", bold: true, color: GOLD, font: FONT, size: 22 })] : []), indent: { left: 900, hanging: 300 }, spacing: { after: 30 }, shading: key ? { fill: KEYBG, type: D.ShadingType.CLEAR, color: "auto" } : undefined }));
        });
        body.push(para("Key: " + corr.join(" and ") + (corr.length > 1 ? " (select two)" : ""), { color: DIM, size: 19, indent: { left: 900 }, after: 60 }));
      });
    });
  });
});

var doc = new D.Document({
  creator: "SOL Lab", title: "SOL Lab Algebra I question pool",
  numbering: { config: [{ reference: "dots", levels: [{ level: 0, format: D.LevelFormat.BULLET, text: "\u2022", alignment: D.AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 300 } } } }] }] },
  styles: { default: { document: { run: { font: FONT, size: 22, color: INK } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal", next: "Normal", run: { size: 48, bold: true, font: FONT, color: INK }, paragraph: { spacing: { after: 200 } } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 34, bold: true, font: FONT, color: "3a2f12" }, paragraph: { spacing: { before: 360, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 28, bold: true, font: FONT, color: GOLD }, paragraph: { spacing: { before: 280, after: 100 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 25, bold: true, font: FONT, color: INK }, paragraph: { spacing: { before: 240, after: 40 }, outlineLevel: 2, keepNext: true } }
    ] },
  sections: [{ properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, bottom: 1080, left: 1260, right: 1260 } } },
    footers: { default: new D.Footer({ children: [new P({ alignment: D.AlignmentType.CENTER, children: [new R({ text: "SOL Lab · Algebra I v" + version + " · question pool · page ", font: FONT, size: 18, color: DIM }), new R({ children: [D.PageNumber.CURRENT], font: FONT, size: 18, color: DIM })] })] }) },
    children: body }]
});
D.Packer.toBuffer(doc).then(function (buf) {
  var out = path.join(root, "docs", "question-bank.docx");
  fs.writeFileSync(out, buf);
  console.log("docs/question-bank.docx: " + packs.length + " packs, " + total + " questions, " + (buf.length / 1024).toFixed(0) + " KB");
});
