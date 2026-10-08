/* The whole question pool as a Word document: node tools/make-question-doc.js [out.docx]
   Needs the "docx" npm package (npm install docx, or DOCX_MODULE=/path/to/node_modules/docx).
   Writes dist/docs/SOL Lab Biology - Question Pool.docx: a summary, the key ideas with how many questions test
   each, then one chapter per unit (BIO.1 ... BIO.8) with every pack's lab notes (tables as Word tables) and its
   questions, the right answer marked, and an answer key at the end. Read from js/content*.js, so it always matches
   the game. */
var fs = require("fs"), path = require("path");
var D = require(process.env.DOCX_MODULE || "docx");
var root = path.join(__dirname, "..");
var out = process.argv[2] || path.join(root, "dist", "docs", "SOL Lab Biology - Question Pool.docx");

/* ── the game's data ── */
var g = {}; g.window = g;
fs.readdirSync(path.join(root, "js")).filter(function (f) { return /^content\d*\.js$/.test(f); })
  .sort(function (a, b) { return (parseInt(a.slice(7)) || 0) - (parseInt(b.slice(7)) || 0); })
  .forEach(function (f) { new Function("window", "global", "self", fs.readFileSync(path.join(root, "js", f), "utf8"))(g, g, g); });
new Function("window", fs.readFileSync(path.join(root, "js", "standards-bio.js"), "utf8"))(g);
var PACKS = g.HEIST_PACKS, FAMS = g.HEIST_FAMILIES.filter(function (f) { return f.id !== "ALL"; }), STD = g.SolStandards.STANDARDS;
var version = (fs.readFileSync(path.join(root, "index.html"), "utf8").match(/\?v=([0-9.]+)/) || [0, ""])[1];

/* ── look ── */
var FONT = "Calibri", INK = "1F2933", DIM = "5B6573", ACCENT = "1F5F8B", OK = "1B7A3D", RULE = "C9D2DC", HEAD_BG = "E8EEF4", NOTE_BG = "F6F8FA";
var W = 12240, H = 15840, M = 1080, TEXT_W = W - 2 * M;   /* US Letter, 0.75" margins */

/* ── HTML from the packs → Word runs and blocks ── */
function decode(s) {
  return String(s).replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;|&rsquo;/g, "’").replace(/&lsquo;/g, "‘").replace(/&ldquo;/g, "“").replace(/&rdquo;/g, "”")
    .replace(/&mdash;/g, "—").replace(/&ndash;/g, "–").replace(/&deg;/g, "°").replace(/&times;/g, "×").replace(/&rarr;/g, "→")
    .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(+n); });
}
/* inline HTML → TextRuns (strong, em, sub, sup and the numbered-sentence spans) */
function runs(html, base) {
  base = base || {};
  var out = [], st = { b: 0, i: 0, sub: 0, sup: 0, n: 0 }, re = /<(\/?)([a-z0-9]+)([^>]*)>|([^<]+)/gi, m;
  while ((m = re.exec(String(html)))) {
    if (m[4] != null) {
      var t = decode(m[4]).replace(/\s+/g, " ");
      if (!t) continue;
      out.push(new D.TextRun(Object.assign({ text: t, font: FONT, size: base.size || 21, color: st.n ? ACCENT : (base.color || INK),
        bold: !!(st.b || st.n || base.bold), italics: !!(st.i || base.italics), subScript: !!st.sub, superScript: !!st.sup })));
      continue;
    }
    var close = m[1] === "/", tag = m[2].toLowerCase(), attrs = m[3] || "", d = close ? -1 : 1;
    if (tag === "strong" || tag === "b") st.b += d;
    else if (tag === "em" || tag === "i") st.i += d;
    else if (tag === "sub") st.sub += d;
    else if (tag === "sup") st.sup += d;
    else if (tag === "span") { if (!close && /class="n"/.test(attrs)) st.n++; else if (close && st.n) st.n--; }
    else if (tag === "br") out.push(new D.TextRun({ text: "", break: 1 }));
  }
  return out;
}
function para(children, opt) {
  opt = opt || {};
  return new D.Paragraph(Object.assign({ children: children, spacing: { before: opt.before || 0, after: opt.after == null ? 100 : opt.after, line: opt.line || 276 } }, opt.p || {}));
}
var border = { style: D.BorderStyle.SINGLE, size: 4, color: RULE };
var borders = { top: border, bottom: border, left: border, right: border };
function cell(html, width, head) {
  return new D.TableCell({
    width: { size: width, type: D.WidthType.DXA }, borders: borders,
    shading: head ? { fill: HEAD_BG, type: D.ShadingType.CLEAR, color: "auto" } : undefined,
    margins: { top: 50, bottom: 50, left: 90, right: 90 },
    children: [para(runs(html, { size: 19, bold: head }), { after: 0, line: 252 })]
  });
}
/* a passage table → a Word table (the columns share the text width; the first row, or any <th> row, is a header) */
function table(html) {
  var rows = [], rr = /<tr[^>]*>([\s\S]*?)<\/tr>/gi, m;
  while ((m = rr.exec(html))) {
    var cells = [], cr = /<(th|td)[^>]*>([\s\S]*?)<\/\1>/gi, c;
    while ((c = cr.exec(m[1]))) cells.push({ head: c[1].toLowerCase() === "th", html: c[2] });
    if (cells.length) rows.push(cells);
  }
  var n = Math.max.apply(null, rows.map(function (r) { return r.length; })), width = Math.min(TEXT_W, 1900 * n), colW = Math.floor(width / n);
  var widths = []; for (var i = 0; i < n; i++) widths.push(colW);
  return new D.Table({
    width: { size: colW * n, type: D.WidthType.DXA }, columnWidths: widths,
    rows: rows.map(function (r) {
      while (r.length < n) r.push({ head: false, html: "" });
      return new D.TableRow({ tableHeader: r.every(function (x) { return x.head; }), children: r.map(function (x) { return cell(x.html, colW, x.head); }) });
    })
  });
}
/* a passage → paragraphs, tables and numbered lists, in order */
function passage(html) {
  var out = [], re = /<(p|table|ol|ul)[^>]*>([\s\S]*?)<\/\1>/gi, m, last = 0;
  html = String(html);
  function loose(s) { s = s.trim(); if (s.replace(/<[^>]+>/g, "").trim()) out.push(para(runs(s), { after: 120 })); }
  while ((m = re.exec(html))) {
    loose(html.slice(last, m.index)); last = re.lastIndex;
    var tag = m[1].toLowerCase();
    if (tag === "p") out.push(para(runs(m[2]), { after: 120 }));
    else if (tag === "table") { out.push(table(m[0])); out.push(para([], { after: 80 })); }
    else {
      var li = /<li[^>]*>([\s\S]*?)<\/li>/gi, x;
      while ((x = li.exec(m[2]))) out.push(para(runs(x[1]), { after: 60, p: { numbering: { reference: tag === "ol" ? "steps" : "dots", level: 0 } } }));
    }
  }
  loose(html.slice(last));
  return out;
}

/* ── the document ── */
var body = [], key = [], qn = 0, byStd = {}, byUnit = {};
PACKS.forEach(function (p) { (p.claims || []).forEach(function (c) { byStd[c.sol] = (byStd[c.sol] || 0) + 1; }); byUnit[p.family] = byUnit[p.family] || { packs: 0, qs: 0 }; byUnit[p.family].packs++; byUnit[p.family].qs += p.claims.length; });
var total = PACKS.reduce(function (n, p) { return n + p.claims.length; }, 0);

/* title and summary */
body.push(para([new D.TextRun({ text: "SOL Lab Biology", font: FONT, size: 52, bold: true, color: ACCENT })], { after: 40 }));
body.push(para([new D.TextRun({ text: "Question pool · Virginia EOC Biology SOL (BIO.1–BIO.8)", font: FONT, size: 30, color: INK })], { after: 60 }));
body.push(para([new D.TextRun({ text: "Game version " + version + " · " + PACKS.length + " lab-note packs · " + total + " questions · the right answer is marked ✓ and listed in the answer key at the end", font: FONT, size: 20, color: DIM })], { after: 240 }));
body.push(para([new D.TextRun({ text: "Each pack is one set of lab notes (a short investigation, data table or scenario) with its questions. In the game a student reads the notes, then finds the letter of the right answer in the maze or shoots it in a shooter level. Every question is tagged with the Biology SOL key idea it tests.", font: FONT, size: 21, color: INK })], { after: 200 }));
/* units table */
var uw = [4400, 2200, 1800, 1680];
function row(cells, head) { return new D.TableRow({ tableHeader: !!head, children: cells.map(function (t, i) { return cell(t, uw[i], head); }) }); }
body.push(new D.Table({ width: { size: uw.reduce(function (a, b) { return a + b; }), type: D.WidthType.DXA }, columnWidths: uw,
  rows: [row(["Unit", "Standards", "Packs", "Questions"], true)].concat(FAMS.map(function (f) { return row([f.label, f.kind, String(byUnit[f.id].packs), String(byUnit[f.id].qs)]); }))
    .concat([row(["<strong>All units</strong>", "BIO.1–BIO.8", "<strong>" + PACKS.length + "</strong>", "<strong>" + total + "</strong>"])]) }));
body.push(para([], { after: 120 }));
body.push(new D.Paragraph({ children: [new D.PageBreak()] }));
body.push(new D.Paragraph({ heading: D.HeadingLevel.HEADING_1, children: [new D.TextRun("Contents")] }));
body.push(new D.TableOfContents("Contents", { hyperlink: true, headingStyleRange: "1-2" }));
body.push(new D.Paragraph({ children: [new D.PageBreak()] }));

/* key ideas */
body.push(new D.Paragraph({ heading: D.HeadingLevel.HEADING_1, children: [new D.TextRun("The key ideas and how many questions test each")] }));
var kw = [1300, 7680, 1100];
var stdRows = Object.keys(STD).sort(function (a, b) { var x = a.split("."), y = b.split("."); return (+x[1] - +y[1]) || x[2].localeCompare(y[2]); })
  .map(function (s) { return new D.TableRow({ children: [cell("<strong>" + s + "</strong>", kw[0]), cell(STD[s].text, kw[1]), cell(String(byStd[s] || 0), kw[2])] }); });
body.push(new D.Table({ width: { size: kw[0] + kw[1] + kw[2], type: D.WidthType.DXA }, columnWidths: kw,
  rows: [new D.TableRow({ tableHeader: true, children: [cell("Key idea", kw[0], true), cell("What it covers", kw[1], true), cell("Questions", kw[2], true)] })].concat(stdRows) }));

/* the units */
FAMS.forEach(function (f) {
  body.push(new D.Paragraph({ children: [new D.PageBreak()] }));
  body.push(new D.Paragraph({ heading: D.HeadingLevel.HEADING_1, children: [new D.TextRun(f.kind + "  " + f.label)] }));
  body.push(para([new D.TextRun({ text: f.meta + " " + byUnit[f.id].packs + " packs, " + byUnit[f.id].qs + " questions.", font: FONT, size: 21, color: DIM, italics: true })], { after: 160 }));
  PACKS.filter(function (p) { return p.family === f.id; }).sort(function (a, b) { return (a.level || 0) - (b.level || 0); }).forEach(function (p) {
    body.push(new D.Paragraph({ heading: D.HeadingLevel.HEADING_2, keepNext: true, children: [new D.TextRun(p.title)] }));
    body.push(para([new D.TextRun({ text: p.kind + " · level " + p.level + " · " + p.claims.length + " questions · pack " + p.id, font: FONT, size: 18, color: DIM })], { after: 60, p: { keepNext: true } }));
    if (p.blurb) body.push(para(runs(p.blurb, { italics: true, color: DIM, size: 20 }), { after: 120, p: { keepNext: true } }));
    body.push(para([new D.TextRun({ text: "Lab notes", font: FONT, size: 20, bold: true, color: ACCENT, allCaps: true })], { after: 60, p: { keepNext: true, border: { bottom: { style: D.BorderStyle.SINGLE, size: 4, color: RULE, space: 2 } } } }));
    passage(p.passage).forEach(function (b) { body.push(b); });
    p.claims.forEach(function (c) {
      qn++;
      /* most questions have one right letter; "Select TWO" questions have a list of them */
      var rightSet = [].concat(c.correct), isRight = function (L) { return rightSet.indexOf(L) !== -1; };
      var right = c.choices.filter(function (x) { return isRight(x.letter); })[0];
      key.push({ n: qn, unit: f.kind, pack: p.title, sol: c.sol, ans: rightSet.join(", ") });
      body.push(para([new D.TextRun({ text: qn + ".  ", font: FONT, size: 21, bold: true, color: ACCENT })].concat(runs(c.stem, { bold: true })).concat([
        new D.TextRun({ text: "   " + c.sol, font: FONT, size: 17, color: DIM })]), { before: 160, after: 60, p: { keepNext: true, keepLines: true } }));
      c.choices.forEach(function (x, i) {
        var ok = isRight(x.letter);
        body.push(para([new D.TextRun({ text: x.letter + "\t", font: FONT, size: 21, bold: true, color: ok ? OK : INK })]
          .concat(runs(x.text, { bold: ok, color: ok ? OK : INK }))
          .concat(ok ? [new D.TextRun({ text: "  ✓", font: FONT, size: 21, bold: true, color: OK })] : []),
          { after: 30, p: { indent: { left: 720, hanging: 360 }, tabStops: [{ type: D.TabStopType.LEFT, position: 720 }], keepNext: i < c.choices.length - 1 } }));
      });
      if (!right) console.warn("no right answer for " + p.id + ":" + c.id);
    });
  });
});

/* the answer key */
body.push(new D.Paragraph({ children: [new D.PageBreak()] }));
body.push(new D.Paragraph({ heading: D.HeadingLevel.HEADING_1, children: [new D.TextRun("Answer key")] }));
var aw = [800, 1300, 5980, 1000, 1000];
body.push(new D.Table({ width: { size: aw.reduce(function (a, b) { return a + b; }), type: D.WidthType.DXA }, columnWidths: aw,
  rows: [new D.TableRow({ tableHeader: true, children: ["#", "Standards", "Pack", "Key idea", "Answer"].map(function (t, i) { return cell(t, aw[i], true); }) })]
    .concat(key.map(function (k) { return new D.TableRow({ cantSplit: true, children: [cell(String(k.n), aw[0]), cell(k.unit, aw[1]), cell(k.pack, aw[2]), cell(k.sol, aw[3]), cell("<strong>" + k.ans + "</strong>", aw[4])] }); })) }));

var doc = new D.Document({
  creator: "SOL Lab", title: "SOL Lab Biology - Question Pool", description: "Every question in SOL Lab Biology v" + version,
  styles: {
    default: { document: { run: { font: FONT, size: 21, color: INK } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: FONT, size: 34, bold: true, color: ACCENT }, paragraph: { spacing: { before: 120, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: FONT, size: 26, bold: true, color: INK }, paragraph: { spacing: { before: 320, after: 40 }, outlineLevel: 1 } }
    ]
  },
  numbering: { config: [
    { reference: "steps", levels: [{ level: 0, format: D.LevelFormat.DECIMAL, text: "%1.", alignment: D.AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 300 } } } }] },
    { reference: "dots", levels: [{ level: 0, format: D.LevelFormat.BULLET, text: "•", alignment: D.AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 300 } } } }] }
  ] },
  features: { updateFields: true },
  sections: [{
    properties: { page: { size: { width: W, height: H }, margin: { top: M, bottom: M, left: M, right: M } } },
    headers: { default: new D.Header({ children: [para([new D.TextRun({ text: "SOL Lab Biology · Question pool · v" + version, font: FONT, size: 16, color: DIM })], { after: 0, p: { alignment: D.AlignmentType.RIGHT } })] }) },
    footers: { default: new D.Footer({ children: [para([new D.TextRun({ children: ["Page ", D.PageNumber.CURRENT, " of ", D.PageNumber.TOTAL_PAGES], font: FONT, size: 16, color: DIM })], { after: 0, p: { alignment: D.AlignmentType.CENTER } })] }) },
    children: body
  }]
});
fs.mkdirSync(path.dirname(out), { recursive: true });
D.Packer.toBuffer(doc).then(function (buf) { fs.writeFileSync(out, buf); console.log(out + ": " + PACKS.length + " packs, " + qn + " questions, " + (buf.length / 1024).toFixed(0) + " KiB"); });
