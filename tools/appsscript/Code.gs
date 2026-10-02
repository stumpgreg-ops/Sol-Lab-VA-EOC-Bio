/* SOL Lab Biology for Google Apps Script — the whole project is this one file.
   The game lives in a public GitHub repository. School filters block GitHub on Chromebooks, but this
   script runs on Google's servers, so it fetches the game there and hands it to the page.

   Set up (once):
     1. script.google.com → New project. Delete what is in Code.gs, paste this whole file, click Save.
     2. Deploy → New deployment → gear icon → Web app.
        Execute as: Me.   Who has access: Anyone (or: Anyone in your school's domain).
        Click Deploy, then Authorize access and allow it (it needs "connect to an external service").
     3. Copy the Web app URL (ends in /exec). That is the game's link. In Google Sites: Insert → Embed →
        By URL → paste it → Insert, then drag the frame bigger.
   Classes: open the link with ?admin=1 on the end to reach the teacher page (you choose a PIN the first
   time). A class's link is the game link with ?class=CODE on the end; only that class sees its own
   questions and edits. Everything is saved inside this script (nothing is put in Google Drive).
   New versions of the game arrive by themselves: the page always loads the newest one. */

var BASES = __BASES__;

/* the page: the game (optionally for one class), or the teacher page */
function doGet(e) {
  var p = (e && e.parameter) || {}, admin = p.admin != null;
  var code = String(p["class"] || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
  var boot = "<script>window.SOL_APP_URL = " + JSON.stringify(ScriptApp.getService().getUrl()) + ";" +
    (admin ? "window.SOL_ADMIN = true;" : "") + (code ? "window.SOL_CLASS_CODE = " + JSON.stringify(code) + ";" : "") + "</script>";
  return HtmlService.createHtmlOutput(fetchText_("loader.html").replace("<head>", "<head>" + boot))
    .setTitle(admin ? "SOL Lab Biology · Teacher" : "__TITLE__")
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/* called by the page: which parts make up the newest game */
function solManifest() {
  return fetchText_("manifest.json");
}

/* called by the page: one part of the game, as base64 */
function solPart(name) {
  if (!/^sol-[0-9a-f]+-\d+\.bin$/.test(String(name))) throw new Error("bad part name");
  return Utilities.base64Encode(fetch_(name).getContent());
}

function fetchText_(name) {
  var cache = CacheService.getScriptCache(), key = "sol:" + name, hit = cache.get(key);
  if (hit) return hit;
  var text = fetch_(name).getContentText();
  if (text.length < 90000) cache.put(key, text, 300);
  return text;
}

function fetch_(name) {
  var last = "";
  for (var i = 0; i < BASES.length; i++) {
    try {
      var r = UrlFetchApp.fetch(BASES[i] + name, { muteHttpExceptions: true, followRedirects: true });
      if (r.getResponseCode() === 200) return r;
      last = BASES[i] + name + " → " + r.getResponseCode();
    } catch (e) { last = String(e); }
  }
  throw new Error("Could not load " + name + " (" + last + ")");
}

/* ── classes ──────────────────────────────────────────────────────────────────────────────────
   A class is a JSON record kept in this script's properties (split into 8 KB pieces, since one
   property holds 9 KB): its name, grade, whether its own question sets replace the regular ones,
   its question sets, and the regular questions it hides or rewords. Students' progress for a class
   is kept the same way. */
var PIECE = 8000;
function props_() { return PropertiesService.getScriptProperties(); }
function cleanCode_(c) { return String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12); }
function putBig_(key, text) {
  var pr = props_(), n = Math.ceil(text.length / PIECE) || 1, old = parseInt(pr.getProperty(key + "#n") || "0", 10), all = {}, i;
  for (i = 0; i < n; i++) all[key + "#" + i] = text.slice(i * PIECE, (i + 1) * PIECE);
  all[key + "#n"] = String(n);
  pr.setProperties(all);
  for (i = n; i < old; i++) pr.deleteProperty(key + "#" + i);
}
function getBig_(key) {
  var pr = props_(), n = parseInt(pr.getProperty(key + "#n") || "0", 10), out = "", i;
  if (!n) return null;
  for (i = 0; i < n; i++) out += pr.getProperty(key + "#" + i) || "";
  return out;
}
function delBig_(key) {
  var pr = props_(), n = parseInt(pr.getProperty(key + "#n") || "0", 10), i;
  for (i = 0; i < n; i++) pr.deleteProperty(key + "#" + i);
  pr.deleteProperty(key + "#n");
}
function classIndex_() { try { return JSON.parse(props_().getProperty("classes") || "[]"); } catch (e) { return []; } }

/* called by the game: this class's settings (no PIN; students need them) */
function solClass(code) {
  code = cleanCode_(code);
  var t = code && getBig_("cls:" + code);
  return t || "";
}

/* called by the game: one student's progress (a nickname, never a real name is asked for) */
function solReport(code, rec) {
  code = cleanCode_(code);
  if (!code || !getBig_("cls:" + code)) return false;
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return false;
  try {
    var all = {}; try { all = JSON.parse(getBig_("rep:" + code) || "{}"); } catch (e) {}
    var name = String((rec && rec.name) || "?").slice(0, 24), old = all[name] || {};
    all[name] = {
      level: Math.max(old.level || 0, +rec.night || 0), now: +rec.night || 0, right: (old.right || 0) + (+rec.right || 0), wrong: (old.wrong || 0) + (+rec.wrong || 0),
      reading: String(rec.reading || old.reading || "").slice(0, 20), grade: String(rec.family || old.grade || "").slice(0, 8), status: String(rec.status || "").slice(0, 20), t: Date.now()
    };
    var names = Object.keys(all);
    if (names.length > 80) { names.sort(function (a, b) { return all[a].t - all[b].t; }); names.slice(0, names.length - 80).forEach(function (n) { delete all[n]; }); }
    putBig_("rep:" + code, JSON.stringify(all));
    return true;
  } finally { lock.releaseLock(); }
}

/* called by the teacher page. Every call but the first-time PIN setup needs the PIN. */
function solAdmin(pin, op, arg) {
  var pr = props_(), stored = pr.getProperty("pin");
  if (op === "status") return { hasPin: !!stored };
  if (op === "setPin") {
    if (stored) throw new Error("A PIN is already set.");
    if (!/^\d{4,8}$/.test(String(arg || ""))) throw new Error("Use 4 to 8 digits.");
    pr.setProperty("pin", hash_(arg)); return true;
  }
  if (!stored || hash_(pin) !== stored) throw new Error("Wrong PIN.");
  var idx = classIndex_(), code, i;
  if (op === "list") return idx;
  if (op === "get") { code = cleanCode_(arg); return getBig_("cls:" + code) || ""; }
  if (op === "save") {
    var cfg = JSON.parse(arg); code = cleanCode_(cfg.code);
    if (!code) throw new Error("No class code.");
    cfg.code = code; cfg.saved = Date.now();
    putBig_("cls:" + code, JSON.stringify(cfg));
    idx = idx.filter(function (c) { return c.code !== code; });
    idx.push({ code: code, name: String(cfg.name || code).slice(0, 60), grade: cfg.grade || "", sets: (cfg.sets || []).length, saved: cfg.saved });
    pr.setProperty("classes", JSON.stringify(idx));
    return true;
  }
  if (op === "delete") {
    code = cleanCode_(arg);
    delBig_("cls:" + code); delBig_("rep:" + code);
    pr.setProperty("classes", JSON.stringify(idx.filter(function (c) { return c.code !== code; })));
    return true;
  }
  if (op === "report") { code = cleanCode_(arg); return getBig_("rep:" + code) || "{}"; }
  if (op === "clearReport") { delBig_("rep:" + cleanCode_(arg)); return true; }
  if (op === "newPin") {
    if (!/^\d{4,8}$/.test(String(arg || ""))) throw new Error("Use 4 to 8 digits.");
    pr.setProperty("pin", hash_(arg)); return true;
  }
  throw new Error("Unknown request.");
}
function hash_(s) {
  var salt = props_().getProperty("salt");
  if (!salt) { salt = Utilities.getUuid(); props_().setProperty("salt", salt); }
  return Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + ":" + s));
}
