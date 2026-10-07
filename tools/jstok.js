/* (SOL Labyrinth tools/ody-jstok.js) A small JavaScript tokenizer for tools/ody-theme.js: it finds every string literal (double, single and the
   text parts of template literals) and skips comments and regular-expression literals, so the Odyssey reskin
   can rewrite the words players read without ever touching code.

   tokenize(src) -> [{ type, start, end, line, q? }]
     type: "str" (q = '"' or "'"; start/end cover the quotes), "tpl" (one text part of a template literal:
     start/end cover the text only, without the backtick / ${ / } around it), "re", "id", "num", "punct".
     Comments and whitespace are not tokens. */
"use strict";

var REGEX_AFTER_WORD = { "return": 1, "typeof": 1, "instanceof": 1, "in": 1, "of": 1, "new": 1, "delete": 1, "void": 1,
  "throw": 1, "case": 1, "do": 1, "else": 1, "yield": 1, "await": 1 };

function isIdStart(c) { return /[A-Za-z_$À-￿]/.test(c); }
function isIdPart(c) { return /[A-Za-z0-9_$À-￿]/.test(c); }

function tokenize(src) {
  var toks = [], i = 0, n = src.length, line = 1;
  /* (SOL Labyrinth tools/ody-jstok.js) a stack of open template literals: each entry counts the { } depth inside its current ${ } */
  var tplStack = [];

  function lastSig() { return toks.length ? toks[toks.length - 1] : null; }
  function regexAllowed() {
    var t = lastSig();
    if (!t) return true;
    if (t.type === "punct") return !/^(\)|\])$/.test(t.text) && !/^(\+\+|--)$/.test(t.text);
    if (t.type === "id") return !!REGEX_AFTER_WORD[t.text];
    if (t.type === "tpl") return !t.closed;   /* (SOL Labyrinth tools/ody-jstok.js) right after `...${ an expression starts */
    return false;
  }
  function countLines(a, b) { for (var k = a; k < b; k++) if (src.charCodeAt(k) === 10) line++; }
  function push(type, start, end, extra) {
    var t = { type: type, start: start, end: end, line: line, text: src.slice(start, end) };
    if (extra) for (var k in extra) t[k] = extra[k];
    countLines(start, end);
    toks.push(t);
    return t;
  }
  /* (SOL Labyrinth tools/ody-jstok.js) reads template text from i (just after ` or }) to the closing ` or ${ */
  function readTplPart() {
    var s = i;
    while (i < n) {
      var c = src[i];
      if (c === "\\") { i += 2; continue; }
      if (c === "`") { push("tpl", s, i, { closed: true }); i++; tplStack.pop(); return; }
      if (c === "$" && src[i + 1] === "{") { push("tpl", s, i, { closed: false }); i += 2; tplStack[tplStack.length - 1] = 0; return; }
      i++;
    }
    throw new Error("unterminated template literal at line " + line);
  }

  while (i < n) {
    var c = src[i], c2 = src[i + 1];
    if (c === "\n") { line++; i++; continue; }
    if (c === " " || c === "\t" || c === "\r" || c === "﻿" || c === " " || c === " " || c === " ") { i++; continue; }
    if (c === "/" && c2 === "/") { while (i < n && src[i] !== "\n") i++; continue; }
    if (c === "/" && c2 === "*") {
      var e = src.indexOf("*/", i + 2); if (e === -1) throw new Error("unterminated comment at line " + line);
      countLines(i, e + 2); i = e + 2; continue;
    }
    if (c === '"' || c === "'") {
      var s = i; i++;
      while (i < n && src[i] !== c) { if (src[i] === "\\") i++; else if (src[i] === "\n") throw new Error("newline in string at line " + line); i++; }
      i++;
      push("str", s, i, { q: c });
      continue;
    }
    if (c === "`") { i++; tplStack.push(0); readTplPart(); continue; }
    if (tplStack.length && (c === "{" || c === "}")) {
      if (c === "{") { tplStack[tplStack.length - 1]++; push("punct", i, i + 1); i++; continue; }
      if (tplStack[tplStack.length - 1] === 0) { i++; readTplPart(); continue; }
      tplStack[tplStack.length - 1]--; push("punct", i, i + 1); i++; continue;
    }
    if (c === "/" && regexAllowed()) {
      var rs = i, inClass = false; i++;
      while (i < n) {
        var r = src[i];
        if (r === "\\") { i += 2; continue; }
        if (r === "\n") throw new Error("newline in regex at line " + line);
        if (inClass) { if (r === "]") inClass = false; }
        else if (r === "[") inClass = true;
        else if (r === "/") break;
        i++;
      }
      i++;
      while (i < n && /[a-z]/.test(src[i])) i++;
      push("re", rs, i);
      continue;
    }
    if (isIdStart(c)) { var is = i; while (i < n && isIdPart(src[i])) i++; push("id", is, i); continue; }
    if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(c2))) {
      var ns = i; i++;
      while (i < n && /[0-9A-Za-z_.]/.test(src[i])) { if ((src[i] === "e" || src[i] === "E") && (src[i + 1] === "+" || src[i + 1] === "-")) i++; i++; }
      push("num", ns, i); continue;
    }
    var ops = [">>>=", "...", "===", "!==", "**=", "<<=", ">>=", ">>>", "&&=", "||=", "??=", "=>", "==", "!=", "<=", ">=", "&&", "||", "??", "?.",
      "++", "--", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", "**", "<<", ">>"];
    var op = null;
    for (var k = 0; k < ops.length; k++) if (src.substr(i, ops[k].length) === ops[k]) { op = ops[k]; break; }
    if (!op) op = c;
    push("punct", i, i + op.length); i += op.length;
  }
  if (tplStack.length) throw new Error("unterminated template literal");
  return toks;
}

module.exports = { tokenize: tokenize };
