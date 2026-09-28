/*
 * SOL Labyrinth — "Town & Castle" reward builder (v5).   window.SolBuild
 *
 * Every 5 levels won (5, 10, … 100 = 20 rewards) a pop-up covers the game and
 * the student picks one of three pieces (reward 1: a Town or a Castle, then a
 * modest starting building). Coins from the maze buy more pieces in the shop.
 *
 * v5 model: a piece, once earned or bought, is UNLOCKED for good (save.owned)
 * and can be placed as many times as the student likes from the palette in the
 * full-screen editor ("My Castle"). Placed copies (save.picks) can be dragged
 * anywhere on the grid, joined or not, deleted, duplicated or recoloured at
 * any time. The scene rotates in 90° steps, zooms and pans.
 *
 * Castle theme: Kenney Castle Kit tiles on a true-isometric grid (one cell per
 * piece). Walls, hedges and fences auto-tile from their neighbours; towers,
 * keeps and houses are sprite stacks; the keep grows a storey as the castle
 * grows (theme.growAt); a curtain wall rises by itself at the 8th building.
 * Town theme: the older Modular Village sprites on the same grid.
 *
 * Public API
 *   SolBuild.init()                     load assets/build/pieces.json + saved build
 *   SolBuild.rewardDue(night)           true when night % 5 === 0 and that reward is not taken
 *   SolBuild.showReward(night, onDone)  reward flow; onDone() when Continue is tapped
 *   SolBuild.showGallery(onClose)       the full-screen editor with palette, build code Copy / Load
 *   SolBuild.showShop(night, onClose)   coin shop (unlock buildings, decorations, packs)
 *   SolBuild.addCoins(n, why)           add (or spend, n<0) coins; returns the balance
 *   SolBuild.coins() / economy()        balance / {answer, perfectNight, bonusMin, bonusMax, bonusPer}
 *   SolBuild.close() / isOpen() / exportCode() / importCode(str) / state()
 *
 * Save record (localStorage "afterHours.v1.build"):
 *   {v:4, theme:"village"|"castle"|null, salt, coins, kit:2,
 *    owned:{pieceId:1}, rewards:{"5":"keep", …},
 *    picks:[{piece, style, cx, cy, src:"reward"|"shop"|"auto"|"free", night, deco}],
 *    view:{r:0..3, z:1, px:0, py:0}, code:"…"}
 *   v1–v3 records and v1–v4 build codes still load.
 */
(function () {
  "use strict";

  var LS_KEY = "afterHours.v1.build";
  var DATA_URL = "assets/build/pieces.json";
  var EVERY = 5;                          /* a reward every 5 levels             */
  var TOTAL = 20;                         /* 20 rewards = levels 5..100           */
  var OPTIONS = 3;                        /* pieces offered per reward            */
  var THEME_ORDER = ["village", "castle"];
  var THEME_BLURB = { village: "A cottage that grows into a whole town.", castle: "A keep that grows into a fortress." };
  var SHOP_TABS = [["build", "Buildings"], ["deco", "Decorations"], ["pack", "Packs"]];
  var KIND_HINT = { side: "This piece joins the side of your building.", back: "This piece goes behind your building.",
    front: "This piece goes out front, by the entrance.", far: "This piece stands at the back of the estate." };
  var DUP_FULL = 4;                       /* copies of one piece that score in full; later copies score a quarter */
  var ZMIN = 0.35, ZMAX = 4;

  var data = null;                        /* parsed pieces.json                  */
  var loadState = "idle";                 /* idle | loading | ok | fail          */
  var waiters = [];
  var save = null;                        /* the build record (see header)       */
  var imgCache = {};                      /* src -> {img, ok:null|true|false}    */
  var ui = null;                          /* DOM refs, created once              */
  var mode = null;                        /* "reward" | "gallery" | "shop" | null */
  var step = null;                        /* theme | pick | style | place | done | gallery | shop */
  var cur = null;                         /* live state of the open overlay      */
  var drawQueued = false;
  var thumbs = [];                        /* stack thumbnails waiting for images */

  /* ── save record ─────────────────────────────────────────────────────────── */
  function freshView() { return { a: 0, z: 1, px: 0, py: 0 }; }
  function freshSave() { return { v: 4, theme: null, salt: Math.floor(Math.random() * 900000000) + 1, coins: 0, kit: 2, owned: {}, rewards: {}, picks: [], view: freshView(), code: "" }; }
  function cleanPicks(list) {
    var out = [], order = 0;
    (Array.isArray(list) ? list : []).forEach(function (p) {
      if (!p || typeof p !== "object" || typeof p.piece !== "string") return;
      var n = parseInt(p.night, 10), src = p.src === "shop" || p.src === "auto" || p.src === "free" ? p.src : "reward";
      if (!(n >= 1 && n <= EVERY * TOTAL)) n = 1;
      var pk = { night: n, piece: p.piece, style: typeof p.style === "string" ? p.style : "", src: src, deco: !!p.deco, ord: order++, rot: (parseInt(p.rot, 10) || 0) & 3 };
      if (p.cx != null && p.cy != null && isFinite(parseInt(p.cx, 10)) && isFinite(parseInt(p.cy, 10))) { pk.cx = parseInt(p.cx, 10); pk.cy = parseInt(p.cy, 10); }
      out.push(pk);
    });
    return out;
  }
  function cleanView(v) {
    var o = freshView();
    if (v && typeof v === "object") {
      o.a = v.a != null ? ((parseFloat(v.a) || 0) % 360 + 360) % 360 : (((parseInt(v.r, 10) || 0) & 3) * 90);
      o.z = Math.max(ZMIN, Math.min(ZMAX, parseFloat(v.z) || 1));
      o.px = parseFloat(v.px) || 0; o.py = parseFloat(v.py) || 0;
    }
    return o;
  }
  function loadSave() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(LS_KEY) || "null"); } catch (e) { s = null; }
    if (!s || typeof s !== "object" || !(s.v >= 1 && s.v <= 4)) s = freshSave();
    if (s.v === 1) s = { v: 3, theme: s.theme, salt: s.salt, picks: s.picks, code: "", migrate: true };
    var old = s.v < 4;
    s.kit = parseInt(s.kit, 10) || 0;
    s.picks = cleanPicks(s.picks);
    s.salt = parseInt(s.salt, 10); if (!(s.salt > 0)) s.salt = freshSave().salt;
    s.coins = Math.max(0, parseInt(s.coins, 10) || 0);
    if (typeof s.theme !== "string") s.theme = null;
    if (typeof s.code !== "string") s.code = "";
    s.owned = (s.owned && typeof s.owned === "object") ? s.owned : {};
    s.rewards = (s.rewards && typeof s.rewards === "object") ? s.rewards : {};
    s.view = cleanView(s.view);
    if (old) {                                                                 /* v3: every placed piece was earned; reward picks mark their level */
      s.picks.forEach(function (p) { s.owned[p.piece] = 1; if (p.src === "reward" && p.night % EVERY === 0) s.rewards[p.night] = p.piece; });
    }
    s.picks.forEach(function (p) { s.owned[p.piece] = 1; });
    s.v = 4;
    return s;
  }
  function buildingPicks() { return save.picks.filter(function (p) { return !p.deco; }); }
  function grownCount() { return buildingPicks().filter(function (pk) { return pk.src !== "auto"; }).length; }
  function hasCore() { return buildingPicks().some(function (p) { var pc = pieceById(p.piece); return pc && pc.role === "core"; }); }
  function rewardsTaken() { return Object.keys(save.rewards).filter(function (k) { return !!save.rewards[k]; }).length; }
  function owned(id) { return !!(save.owned && save.owned[id]); }
  function unlock(id) { if (!save.owned) save.owned = {}; save.owned[id] = 1; }

  /* v5.6: castle perks. A building on the field gives its perk in the maze
     (each perk counts once, however many copies are placed). The maze reads
     SolBuild.perks() when a level starts; js/realms.js applies them. */
  var PERKS = [
    { id: "swift",    name: "Swift feet",    desc: "Sol runs 6% faster.", pieces: ["k-stables", "stable", "bakery"] },
    { id: "surefoot", name: "Sure footing",  desc: "Wet floors never slow Sol down or trip her.", pieces: ["k-well", "well", "fountain"] },
    { id: "lookout",  name: "Lookout",       desc: "Ravens, trolls and the other realm creatures show on the map.", pieces: ["k-watchtower", "watchtower", "bell-tower"] },
    { id: "guard",    name: "Castle guard",  desc: "The first catch in each level bounces off.", pieces: ["k-barracks", "manor"] },
    { id: "blessing", name: "Blessing",      desc: "Start every level with a 1UP (a spare life).", pieces: ["k-church", "c-chapel", "chapel", "k-shrine"] },
    { id: "trade",    name: "Trade",         desc: "+2 coins for every correct answer.", pieces: ["k-market", "square"] },
    { id: "gold",     name: "Gold vein",     desc: "Pickups in the maze pay double coins.", pieces: ["k-mine", "harbour"] },
    { id: "iron",     name: "Iron boots",    desc: "Slowing floors slow Sol only half as much.", pieces: ["k-blacksmith", "dock"] },
    { id: "archers",  name: "Archers",       desc: "The Hati wolves run 5% slower.", pieces: ["k-archery"] },
    { id: "hearth",   name: "Warm hearth",   desc: "One extra second of safety after a catch.", pieces: ["k-inn", "c-tavern", "tavern"] },
    { id: "tinker",   name: "Tinkerer",      desc: "The chariot power lasts 25% longer.", pieces: ["k-workshop", "k-lumbermill"] },
    { id: "charter",  name: "Royal charter", desc: "+10 coins for every level you clear.", pieces: ["k-townhall", "town-hall"] },
    { id: "harvest",  name: "Harvest",       desc: "+5 coins for every level you clear.", pieces: ["k-windmill", "k-watermill", "c-windmill", "windmill", "watermill", "grand-mill", "barn"] },
    { id: "rune",     name: "Rune of Sol",   desc: "Fenrir's first charge in each boss level misses.", pieces: ["k-castle", "great-tower", "royal-tower"] }
  ];
  var PERK_BY_PIECE = {};
  PERKS.forEach(function (pk) { pk.pieces.forEach(function (id) { PERK_BY_PIECE[id] = pk; }); });
  function perkOf(pieceId) { return PERK_BY_PIECE[pieceId] || null; }
  function perkLine(p) { var pk = p && perkOf(p.id); return pk ? "Perk in the maze: " + pk.name + " · " + pk.desc : ""; }
  function activePerks() {
    if (!save) save = loadSave();
    var out = [], seen = {};
    (save.picks || []).forEach(function (pick) {
      var pk = perkOf(pick.piece), pc;
      if (!pk) return;
      if (!seen[pk.id]) { seen[pk.id] = { id: pk.id, name: pk.name, desc: pk.desc, from: [] }; out.push(seen[pk.id]); }
      pc = data ? pieceById(pick.piece) : null;
      var nm = (pc && pc.name) || pick.piece;
      if (seen[pk.id].from.indexOf(nm) === -1) seen[pk.id].from.push(nm);
    });
    return out;
  }
  /* Once pieces.json is in: old castles map to kit pieces; picks that no longer exist are dropped. */
  function migrateIfNeeded() {
    if (!save || !data) return;
    var changed = false;
    if (save.theme && !themeDef(save.theme)) { save.theme = null; save.picks = []; save.owned = {}; changed = true; }
    if (save.theme === "castle" && isKit() && save.kit !== 2) {                /* v4.9.5: the old scattered castle becomes a kit castle */
      var MAP = { keep: "keep", storehouse: "watch-keep", hall: "round-keep", "lodge-wing": "wall", "tower-short": "round-tower", gate: "gate", "hall-wing": "wall",
        "keep-wing": "square-tower", watchtower: "watchtower", gatehouse: "gate", "tower-pair": "roof-tower", "royal-hall": "grand-tower", "great-gate": "gate",
        "fortress-corner": "corner-tower", "grand-keep": "great-tower", citadel: "royal-tower" };
      var STYLE = { stone: "blue", sand: "gold", white: "red" };
      var legacy = save.picks.some(function (p) { return !pieceById(p.piece) || !!STYLE[p.style]; });
      if (legacy) {
        save.picks.forEach(function (p) {
          if (!pieceById(p.piece)) { p.piece = MAP[p.piece] || (p.deco ? "knight" : "wall"); }
          p.style = STYLE[p.style] || p.style; delete p.cx; delete p.cy;
        });
        Object.keys(save.rewards).forEach(function (k) { if (!pieceById(save.rewards[k])) save.rewards[k] = MAP[save.rewards[k]] || "wall"; });
        save.owned = {};
      }
      save.kit = 2; changed = true;
    }
    var keep = [];
    save.picks.forEach(function (p) {
      var pc = pieceById(p.piece);
      if (!pc || pc.theme !== save.theme) { changed = true; return; }
      if (!!p.deco !== (pc.role === "deco")) { p.deco = pc.role === "deco"; changed = true; }
      if (p.style && !styleDef(p.style)) { p.style = defaultStyle(); changed = true; }
      keep.push(p);
    });
    save.picks = keep;
    save.picks.forEach(function (p) { if (!owned(p.piece)) { unlock(p.piece); changed = true; } });
    Object.keys(save.rewards).forEach(function (k) { if (save.rewards[k] && !owned(save.rewards[k]) && pieceById(save.rewards[k])) { unlock(save.rewards[k]); changed = true; } });
    if (save.migrate) { delete save.migrate; changed = true; }
    if (changed) persist();
    ensurePositions();
  }
  function persist() {
    if (ui && ui.perks && step === "gallery") { try { fillPerks(); } catch (eP) {} }
    save.picks.sort(function (a, b) { return (a.ord || 0) - (b.ord || 0); });
    save.picks.forEach(function (p, i) { p.ord = i; });
    save.code = exportCode();
    try { localStorage.setItem(LS_KEY, JSON.stringify(save)); } catch (e) {}
    refreshButton();
  }

  /* ── pieces.json helpers ─────────────────────────────────────────────────── */
  function themes() { return (data && data.themes) || {}; }
  function themeDef(id) { return themes()[id] || null; }
  function themeName(id) { var t = themeDef(id); return (t && t.name) || (id === "castle" ? "Castle" : "Town"); }
  function stylesOf(theme) { var t = themeDef(theme || save.theme); return (t && t.styles) || []; }
  function styleDef(id) { var s = stylesOf(), i; for (i = 0; i < s.length; i++) if (s[i].id === id) return s[i]; return null; }
  function styleName(id) { var s = styleDef(id); return s ? s.name : ""; }
  function defaultStyle() { var s = stylesOf(); return s.length ? s[0].id : ""; }
  function pieceById(id) {
    var p = (data && data.pieces) || [], i, other = null, th = save && save.theme;
    for (i = 0; i < p.length; i++) if (p[i].id === id) { if (!th || p[i].theme === th) return p[i]; if (!other) other = p[i]; }
    return other;
  }
  function piecesOf(theme, role) { return ((data && data.pieces) || []).filter(function (p) { return p.theme === theme && (!role || p.role === role); }); }
  function catOf(p) { return p.cat || (p.role === "deco" ? "deco" : p.role === "core" ? "core" : "module"); }
  function themeTabs() {
    var t = themeDef(save.theme);
    if (t && t.tabs) return t.tabs;
    return [["core", "Home"], ["module", "Buildings"], ["deco", "Decorations"]];
  }
  function lotFor(k) { var L = (data && data.lots) || [], i; for (i = 0; i < L.length; i++) if (L[i].k === k) return L[i]; return k === 1 ? { k: 1, u: 0, v: 0, kind: "core" } : { k: k, u: k, v: k, kind: "side" }; }
  function fitsLot(p, lot) { return !p.fits || p.fits.indexOf(lot.kind) !== -1; }
  function packsList() { return (data && data.packs) || []; }
  function economy() { var e = (data && data.economy) || {}; return { answer: e.answer || 10, perfectNight: e.perfectNight || 25, bonusMin: e.bonusMin || 3, bonusMax: e.bonusMax || 12, bonusPer: e.bonusPer || 500 }; }
  function priceOf(p) { return p ? (p.price || [0, 40, 80, 140, 220][p.tier || 1] || 40) : 0; }
  function bandFor(k) { return Math.max(1, Math.min(4, Math.ceil(k / 5))); }   /* reward 1-5 → tier 1 … 16-20 → tier 4 */
  function nextRewardNight() { var n; for (n = EVERY; n <= EVERY * TOTAL; n += EVERY) if (!save.rewards[n]) return n; return null; }
  function wallLevel() { var t = themeDef(save.theme); return (t && t.wallLevel) || 8; }
  function wallsUp() { return !!save.theme && (isKit() ? save.picks.some(function (p) { return p.src === "auto"; }) : buildingPicks().length >= wallLevel()); }
  /* The style the student has used most (ties → the first building's style). */
  function dominantStyle() {
    var count = {}, best = null, bn = -1, bp = buildingPicks();
    bp.forEach(function (p) { count[p.style] = (count[p.style] || 0) + 1; });
    if (bp.length && count[bp[0].style]) count[bp[0].style] += 0.5;
    Object.keys(count).forEach(function (k) { if (count[k] > bn && styleDef(k)) { bn = count[k]; best = k; } });
    return best || defaultStyle();
  }
  function partnerStyle(id) { var s = styleDef(id); return (s && s.pairs && s.pairs[0]) || null; }
  function imgFor(piece, style) {
    if (piece && (piece.parts || piece.auto)) {
      var parts = staticParts(piece), first = parts[parts.length - 1];
      return kitImg(first, style);
    }
    var s = styleDef(style), dir = (s && s.dir) || "", src = piece.img || "";
    if (!dir || piece.nostyle) return src;
    return src.replace(/^(.*\/)?([^\/]+)$/, function (m, d, f) { return (d || "") + dir + f; });
  }
  function styleable(p) {
    if (!p) return false;
    if (!isKit()) return stylesOf().length > 0 && !p.nostyle;
    return staticParts(p).some(function (nm) { var sp = kitData().sprites[nm]; return !!(sp && sp.coloured); });
  }

  function load() {
    if (loadState !== "idle") return;
    loadState = "loading";
    var xhr = new XMLHttpRequest();
    function settle() {
      if (loadState === "fail") console.warn("[SolBuild] could not load " + DATA_URL);
      if (loadState === "ok") migrateIfNeeded();
      var w = waiters; waiters = [];
      w.forEach(function (fn) { fn(); });
      refreshButton();
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      try {
        if ((xhr.status >= 200 && xhr.status < 300) || (xhr.status === 0 && xhr.responseText)) {
          data = JSON.parse(xhr.responseText);
          if (!data || data.v !== 2) throw new Error("pieces.json v2 expected");
          loadState = "ok";
        } else loadState = "fail";
      } catch (e) { loadState = "fail"; }
      settle();
    };
    try { xhr.open("GET", DATA_URL, true); xhr.timeout = 20000; xhr.send(); } catch (e) { loadState = "fail"; settle(); }
  }
  function whenReady(fn) { if (loadState === "ok" || loadState === "fail") fn(); else { waiters.push(fn); load(); } }

  /* ── seeded RNG (Park–Miller) and the offer ──────────────────────────────── */
  function rng(seed) {
    var s = (Math.abs(Math.floor(seed)) % 2147483646) + 1;
    return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }
  function shuffle(arr, r) { var i, j, t; for (i = arr.length - 1; i > 0; i--) { j = Math.floor(r() * (i + 1)); t = arr[i]; arr[i] = arr[j]; arr[j] = t; } return arr; }

  /* Three pieces for reward k. Reward 1 offers the core buildings; later rewards prefer pieces not yet
     unlocked, the band's tier first. Seeded by level + salt so a reload shows the same three. */
  function offerFor(night, k, bandOverride) {
    var band = bandOverride || bandFor(Math.min(k, TOTAL)), lot = lotFor(k), r = rng(night * 7 + k + save.salt), out = [], wantOwned, t;
    if (k === 1 || !hasCore()) return piecesOf(save.theme, "core");
    if (isKit()) {
      var pool = piecesOf(save.theme, "module").filter(function (p) { return (p.tier || 1) <= band; }), kinds = {};
      var fresh = pool.filter(function (p) { return !owned(p.id); }), known = pool.filter(function (p) { return owned(p.id); });
      shuffle(fresh.filter(function (p) { return (p.tier || 1) === band; }), r).concat(shuffle(fresh.filter(function (p) { return (p.tier || 1) < band; }), r))
        .forEach(function (p) { if (out.length < OPTIONS && (out.length < 2 || !kinds[p.kind])) { out.push(p); kinds[p.kind] = true; } });
      shuffle(known.slice(), r).forEach(function (p) { if (out.length < OPTIONS && out.indexOf(p) === -1) out.push(p); });
      shuffle(pool.slice(), r).forEach(function (p) { if (out.length < OPTIONS && out.indexOf(p) === -1) out.push(p); });
      return out;
    }
    var mods = piecesOf(save.theme, "module").filter(function (p) { return fitsLot(p, lot); });
    for (wantOwned = 0; wantOwned < 2 && out.length < OPTIONS; wantOwned++) {
      for (t = band; t >= 1 && out.length < OPTIONS; t--) {
        shuffle(mods.filter(function (p) { return (p.tier || 1) === t && owned(p.id) === !!wantOwned; }), r)
          .forEach(function (p) { if (out.length < OPTIONS && out.indexOf(p) === -1) out.push(p); });
      }
    }
    for (t = band + 1; t <= 4 && out.length < OPTIONS; t++) {
      shuffle(mods.filter(function (p) { return (p.tier || 1) === t; }), r).forEach(function (p) { if (out.length < OPTIONS && out.indexOf(p) === -1) out.push(p); });
    }
    if (out.length < OPTIONS) shuffle(piecesOf(save.theme, "module").slice(), r).forEach(function (p) { if (out.length < OPTIONS && out.indexOf(p) === -1) out.push(p); });
    return out;
  }

  /* ── build codes ──────────────────────────────────────────────────────────
     v5: base64url("5|theme|salt|coins|kit|owned,…|night=piece;…|piece:style:src:cx,cy;…") + 2-char checksum.
     v1–v4 codes still load. */
  function b64url(s) { return btoa(unescape(encodeURIComponent(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
  function unb64url(s) { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; return decodeURIComponent(escape(atob(s))); }
  function checksum(s) { var h = 7, i; for (i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 1296; return ("0" + h.toString(36)).slice(-2); }
  var SRC_FLAG = { reward: "r", shop: "s", auto: "a", free: "f" }, FLAG_SRC = { r: "reward", s: "shop", a: "auto", f: "free" };
  function exportCode() {
    if (!save) save = loadSave();
    var ownedList = Object.keys(save.owned || {}).filter(function (k) { return save.owned[k]; }).join(",");
    var rewards = Object.keys(save.rewards || {}).filter(function (k) { return save.rewards[k]; }).map(function (k) { return k + "=" + save.rewards[k]; }).join(",");
    var list = save.picks.map(function (p) { return p.piece + ":" + (p.style || "") + ":" + (SRC_FLAG[p.src] || "f") + (p.deco ? "d" : "") + ":" + (p.cx != null ? p.cx + "," + p.cy : "") + (p.rot ? ":" + p.rot : ""); }).join(";");
    var body = b64url("5|" + (save.theme || "") + "|" + save.salt + "|" + (save.coins || 0) + "|" + (save.kit || 0) + "|" + ownedList + "|" + rewards + "|" + list);
    return body + checksum(body);
  }
  function parseCode(str) {
    var s = String(str || "").replace(/\s+/g, ""), body = s.slice(0, -2), raw, parts, theme, salt, coins = 0, picks = [], bad = null, ver, listStr, kitv = 0, rec;
    if (s.length < 4) return { ok: false, error: "Paste a build code first." };
    if (checksum(body) !== s.slice(-2)) return { ok: false, error: "That code has a typo — check every letter and try again." };
    try { raw = unb64url(body); } catch (e) { return { ok: false, error: "That is not a build code." }; }
    parts = raw.split("|"); ver = parts[0];
    theme = parts[1] || null; salt = parseInt(parts[2], 10);
    if (theme && data && !themeDef(theme)) return { ok: false, error: "Unknown build type: " + theme };
    if (!(salt > 0)) return { ok: false, error: "That build code is damaged." };
    rec = freshSave(); rec.theme = theme; rec.salt = salt;
    if (ver === "5" && parts.length === 8) {
      rec.coins = Math.max(0, parseInt(parts[3], 10) || 0); rec.kit = parseInt(parts[4], 10) || 0;
      if (parts[5]) parts[5].split(",").forEach(function (id) { if (id) rec.owned[id] = 1; });
      if (parts[6]) parts[6].split(",").forEach(function (kv) { var f = kv.split("="), n = parseInt(f[0], 10); if (n % EVERY === 0 && n >= EVERY && n <= EVERY * TOTAL && f[1]) rec.rewards[n] = f[1]; });
      if (parts[7]) parts[7].split(";").forEach(function (item) {
        var f = item.split(":"), flags = f[2] || "f", pos;
        if (bad) return;
        if (f.length < 3 || !f[0]) { bad = "bad piece list"; return; }
        var pk = { night: 1, piece: f[0], style: f[1] || "", src: FLAG_SRC[flags.charAt(0)] || "free", deco: flags.indexOf("d") !== -1, rot: (parseInt(f[4], 10) || 0) & 3 };
        if (f[3]) { pos = f[3].split(","); if (pos.length === 2 && isFinite(parseInt(pos[0], 10))) { pk.cx = parseInt(pos[0], 10); pk.cy = parseInt(pos[1], 10); } }
        picks.push(pk);
      });
    } else if (((ver === "1" || ver === "2") && parts.length === 4) || (ver === "3" && parts.length === 5) || (ver === "4" && (parts.length === 5 || parts.length === 6))) {
      if (ver === "4" && parts.length === 6) { coins = Math.max(0, parseInt(parts[3], 10) || 0); kitv = parseInt(parts[4], 10) || 0; listStr = parts[5]; }
      else if (ver === "3" || ver === "4") { coins = Math.max(0, parseInt(parts[3], 10) || 0); listStr = parts[4]; } else listStr = parts[3];
      rec.coins = coins; rec.kit = kitv;
      if (listStr) listStr.split(ver === "4" ? ";" : ",").forEach(function (item) {
        var f = item.split(":"), night = parseInt(f[0], 10), flags = (ver === "3" || ver === "4") ? (f[4] || "r") : "r", shop = flags.indexOf("s") !== -1 || flags.indexOf("a") !== -1, pos, pk;
        if (bad) return;
        if (f.length < 3 || !f[1] || !(night >= 1 && night <= EVERY * TOTAL)) { bad = "bad pick list"; return; }
        pk = { night: night, piece: f[1], style: ver === "1" ? "" : (f[2] || ""), src: flags.indexOf("a") !== -1 ? "auto" : shop ? "shop" : "reward", deco: flags.indexOf("d") !== -1 };
        if (ver === "4" && f[5]) { pos = f[5].split(","); if (pos.length === 2 && isFinite(parseInt(pos[0], 10))) { pk.cx = parseInt(pos[0], 10); pk.cy = parseInt(pos[1], 10); } }
        if (pk.src === "reward" && night % EVERY === 0) rec.rewards[night] = pk.piece;
        rec.owned[pk.piece] = 1;
        picks.push(pk);
      });
    } else return { ok: false, error: "That build code is from a different version." };
    if (bad) return { ok: false, error: "That build code is damaged (" + bad + ")." };
    if (picks.length && !theme) return { ok: false, error: "That build code is damaged (no build type)." };
    rec.picks = picks;
    return { ok: true, rec: rec };
  }
  function importCode(str) {
    if (!save) save = loadSave();
    var r = parseCode(str);
    if (!r.ok) return r;
    save = r.rec; save.picks = cleanPicks(save.picks); save.view = freshView();
    save.picks.forEach(function (p) { save.owned[p.piece] = 1; });
    migrateIfNeeded(); persist();
    if (cur) cur.sel = null;
    if (mode) { if (step === "gallery") fillGallery(); else redraw(); }
    return { ok: true, count: save.picks.length };
  }

  /* ── canvas: painted backgrounds (no images) ─────────────────────────────── */
  function ellipse(ctx, x, y, rx, ry) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); }
  function paintBg(ctx, W, H, theme) { if (theme === "castle") paintCastle(ctx, W, H); else paintVillage(ctx, W, H); }
  /* v5.1: a flat field under a sky — no dome. The build sits on a flat grid drawn by drawGround. */
  function paintVillage(ctx, W, H) {
    var hz = H * 0.34, g;
    g = ctx.createLinearGradient(0, 0, 0, hz); g.addColorStop(0, "#4f9fe6"); g.addColorStop(1, "#d6ecfb");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, hz);
    ctx.fillStyle = "#fff3b0"; ellipse(ctx, W * 0.84, H * 0.11, W * 0.045, W * 0.045);
    ctx.fillStyle = "rgba(255,255,255,.75)";
    ellipse(ctx, W * 0.2, H * 0.14, W * 0.09, H * 0.045); ellipse(ctx, W * 0.55, H * 0.09, W * 0.07, H * 0.035);
    ctx.fillStyle = "#8fc47f";
    ellipse(ctx, W * 0.18, hz + H * 0.01, W * 0.38, H * 0.06); ellipse(ctx, W * 0.78, hz + H * 0.01, W * 0.42, H * 0.05);
    g = ctx.createLinearGradient(0, hz, 0, H); g.addColorStop(0, "#5fa848"); g.addColorStop(1, "#4d9a3c");
    ctx.fillStyle = g; ctx.fillRect(0, hz, W, H - hz);
  }
  function paintCastle(ctx, W, H) {
    var g, i;
    g = ctx.createLinearGradient(0, 0, 0, H * 0.8); g.addColorStop(0, "#2f5da8"); g.addColorStop(0.7, "#8fb6e8"); g.addColorStop(1, "#f4d3b0");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(255,255,255,.8)";
    ellipse(ctx, W * 0.15, H * 0.2, W * 0.1, H * 0.04); ellipse(ctx, W * 0.7, H * 0.12, W * 0.08, H * 0.035); ellipse(ctx, W * 0.9, H * 0.3, W * 0.07, H * 0.03);
    ctx.fillStyle = "#6c7fa6"; ctx.beginPath(); ctx.moveTo(0, H * 0.72);
    [[0.1, 0.5], [0.22, 0.62], [0.35, 0.44], [0.5, 0.58], [0.62, 0.4], [0.78, 0.6], [0.9, 0.48], [1, 0.66]]
      .forEach(function (p) { ctx.lineTo(W * p[0], H * p[1]); });
    ctx.lineTo(W, H * 0.8); ctx.lineTo(0, H * 0.8); ctx.fill();
    g = ctx.createLinearGradient(0, H * 0.6, 0, H); g.addColorStop(0, "#4f9a3e"); g.addColorStop(1, "#3c8a30");
    ctx.fillStyle = g; ctx.fillRect(0, H * 0.62, W, H * 0.38);                 /* a flat plain in front of the mountains */
    ctx.fillStyle = "#2f7a2a";
    for (i = 0; i < 9; i++) ellipse(ctx, W * (0.04 + i * 0.115), H * (0.62 + (i % 2) * 0.01), W * 0.06, H * 0.02);
  }
  /* The flat ground the build stands on: a square of grass cells around everything built, turning with the view. */
  function drawGround(ctx, fit) {
    var b = bboxCells() || { u0: -1, v0: -1, u1: 1, v1: 1 }, mx = (b.u0 + b.u1) / 2, my = (b.v0 + b.v1) / 2;
    var R = Math.max(5, Math.ceil(Math.max(b.u1 - b.u0, b.v1 - b.v0) / 2) + 3), x0 = Math.floor(mx - R), x1 = Math.ceil(mx + R), y0 = Math.floor(my - R), y1 = Math.ceil(my + R), x, y;
    function S(px, py) { var c = worldPx(px, py); return { x: fit.ox + c.x * fit.s / fit.base, y: fit.oy + c.y * fit.s / fit.base }; }
    function poly(pts) { ctx.beginPath(); pts.forEach(function (q, i) { if (i) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }); ctx.closePath(); }
    var corners = [S(x0, y0), S(x1, y0), S(x1, y1), S(x0, y1)];
    ctx.save();
    ctx.fillStyle = "rgba(20,60,20,.18)"; poly(corners.map(function (q) { return { x: q.x, y: q.y + 6 }; })); ctx.fill();   /* a hair of drop shadow so the field reads as a slab */
    ctx.fillStyle = save.theme === "castle" ? "#79c463" : "#86c96a"; poly(corners); ctx.fill();
    ctx.lineWidth = 1; ctx.strokeStyle = "rgba(0,0,0,.09)";
    for (x = x0 + 1; x < x1; x++) { var a = S(x, y0), bq = S(x, y1); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(bq.x, bq.y); ctx.stroke(); }
    for (y = y0 + 1; y < y1; y++) { var a2 = S(x0, y), b2 = S(x1, y); ctx.beginPath(); ctx.moveTo(a2.x, a2.y); ctx.lineTo(b2.x, b2.y); ctx.stroke(); }
    ctx.lineWidth = 2; ctx.strokeStyle = "rgba(40,90,30,.55)"; poly(corners); ctx.stroke();
    ctx.restore();
  }
  function banner(ctx, W, H, text) {
    ctx.fillStyle = "rgba(8,10,14,.55)"; ctx.fillRect(0, H * 0.42, W, H * 0.16);
    ctx.fillStyle = "#f5c842"; ctx.font = "700 " + Math.round(Math.max(14, W * 0.032)) + "px 'Trebuchet MS', sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(text, W / 2, H * 0.5, W * 0.9);
  }

  /* ── images ──────────────────────────────────────────────────────────────── */
  function getImg(src) {
    var c = imgCache[src];
    if (c) return c;
    c = imgCache[src] = { img: new Image(), ok: null };
    if (!src) { c.ok = false; return c; }
    c.img.onload = function () { c.ok = true; scheduleDraw(); };
    c.img.onerror = function () { c.ok = false; scheduleDraw(); };
    c.img.src = src;
    return c;
  }
  function scheduleDraw() { if (drawQueued) return; drawQueued = true; requestAnimationFrame(function () { drawQueued = false; redraw(); refreshThumbs(); }); }

  /* ── the estate grid and the view ─────────────────────────────────────────
     Pieces sit on an isometric grid of square cells (theme.cell px per cell). A piece covers n×n cells
     from its top-left cell (cx, cy) in WORLD coordinates. The view rotates the world in 90° steps:
     world (cx, cy) → view (u, v); +u runs down-right on screen, +v down-left. Everything that touches
     the screen (drawing, hit tests, auto-tiling of walls) works in view space; the save stays in world. */
  function cellPx() { var t = themeDef(save.theme); return (t && t.cell) || 36; }
  function cellH() { var t = themeDef(save.theme); return (t && t.cellH) || cellPx() / 2; }
  function isKit() { var t = themeDef(save.theme); return !!(t && t.kit); }
  function cellsOf(p) { return Math.max(1, (p && p.cells) || 1); }
  function cellXY(u, v) { var C = cellPx(), H = cellH(); return { x: (u - v) * C / 2, y: (u + v) * H / 2 }; }
  function pxToCell(x, y) { var C = cellPx(), H = cellH(); return { u: (x / (C / 2) + y / (H / 2)) / 2, v: (y / (H / 2) - x / (C / 2)) / 2 }; }
  function view() { if (!save.view) save.view = freshView(); if (save.view.a == null) save.view.a = 0; return save.view; }
  /* v5.1: the view turns by any angle. Positions rotate continuously on the ground plane; sprites (which only
     exist in four orientations) snap to the nearest quarter turn, rot(), which also drives wall auto-tiling. */
  function ang() { return ((view().a || 0) % 360 + 360) % 360; }
  function rot() { return Math.round(ang() / 90) % 4; }
  function rotPt(x, y) { var t = ang() * Math.PI / 180, c = Math.cos(t), sn = Math.sin(t); return { u: x * c - y * sn, v: x * sn + y * c }; }
  function unrotPt(u, v) { var t = -ang() * Math.PI / 180, c = Math.cos(t), sn = Math.sin(t); return { x: u * c - v * sn, y: u * sn + v * c }; }
  function worldPx(x, y) { var p = rotPt(x, y); return cellXY(p.u, p.v); }
  function viewDirToWorld(du, dv) { var r = rot(); if (r === 1) return [dv, -du]; if (r === 2) return [-du, -dv]; if (r === 3) return [-dv, du]; return [du, dv]; }
  /* sprite orientation: NE → SE → SW → NW is one quarter turn clockwise; a piece's own rot adds to the view's */
  var ORD = ["NE", "SE", "SW", "NW"];
  function orientName(name, shift) {
    shift = ((shift || 0) % 4 + 4) % 4;
    if (!shift) return name;
    var m = /^(.*)_(NE|SE|SW|NW)$/.exec(name);
    if (!m) return name;
    var nn = m[1] + "_" + ORD[(ORD.indexOf(m[2]) + shift) % 4];
    return kitData().sprites[nn] ? nn : name;
  }

  /* ── the castle kit (Kenney tiles) ──────────────────────────────────────── */
  function kitData() { return (data && data.kit) || { dir: "assets/build/kit/", sprites: {} }; }
  function kitSprite(name) { return kitData().sprites[name] || { w: 151, h: 151, lift: 64 }; }
  function kitImg(name, style) {
    var k = kitData(), st = styleDef(style), sp = k.sprites[name];
    return k.dir + ((st && st.dir && sp && sp.coloured) ? st.dir : "") + name + ".png";
  }
  /* v5.1: sprites live in atlas sheets (kit.atlas[dir][name] = [sheet, x, y]); {src, x, y} for a sprite in a style.
     Without an atlas (older data) each sprite is its own file. */
  function spriteRef(name, style) {
    var k = kitData(), st = styleDef(style), sp = k.sprites[name], dir = (st && st.dir && sp && sp.coloured) ? st.dir : "", a = k.atlas;
    if (!a) return { src: kitImg(name, style), x: 0, y: 0, whole: true };
    var m = (a[dir] && a[dir][name]) || (a[""] && a[""][name]);
    if (!m) return { src: "", x: 0, y: 0, whole: true };
    if (!(a[dir] && a[dir][name])) dir = "";
    return { src: k.dir + dir + "atlas-" + m[0] + ".png", x: m[1], y: m[2], whole: false };
  }
  function drawSprite(ctx, name, style, w, h, dx, dy, dw, dh) {
    var ref = spriteRef(name, style), c = getImg(ref.src);
    if (c.ok) { if (ref.whole) ctx.drawImage(c.img, dx, dy, dw, dh); else ctx.drawImage(c.img, ref.x, ref.y, w, h, dx, dy, dw, dh); return true; }
    return c.ok;                                                            /* null: still loading; false: missing */
  }
  function isTopper(p) { return !!p && p.kind === "topper"; }
  function isHost(p) { return !!p && (p.kind === "tower" || p.kind === "core"); }
  function isSolid(p) { return !!p && (p.kind === "tower" || p.kind === "core" || p.kind === "house"); }
  function pickAt(cx, cy, ignore, pred) {
    var i, pk, p;
    for (i = 0; i < save.picks.length; i++) {
      pk = save.picks[i]; p = pieceById(pk.piece);
      if (!p || pk === ignore || pk.cx !== cx || pk.cy !== cy) continue;
      if (!pred || pred(p, pk)) return pk;
    }
    return null;
  }
  /* Which way a run (wall / hedge / fence) goes, from its four neighbours in VIEW space: a run joins runs of
     its own category and solid buildings. */
  function wallParts(p, cx, cy, ignore) {
    var pred = function (q) { return q.auto ? catOf(q) === catOf(p) : isSolid(q); };
    var conn = function (du, dv) { var d = viewDirToWorld(du, dv); return !!pickAt(cx + d[0], cy + d[1], ignore, pred); };
    var mu = conn(-1, 0), pu = conn(1, 0), mv = conn(0, -1), pv = conn(0, 1), a = p.auto, key = null, out;
    if ((mu || pu) && !(mv || pv)) out = a.u;
    else if ((mv || pv) && !(mu || pu)) out = a.v;
    else if (a.corner && ((mu ? 1 : 0) + (pu ? 1 : 0)) === 1 && ((mv ? 1 : 0) + (pv ? 1 : 0)) === 1) { key = (mu ? "-u" : "+u") + (mv ? "-v" : "+v"); out = a.corner[key] || a.u; }
    else out = a.u;
    return Array.isArray(out) ? out : [out];
  }
  /* Sprite names of a piece with no neighbours (thumbnails, the option cards). */
  function staticParts(p) {
    if (p.auto) return Array.isArray(p.auto.u) ? p.auto.u : [p.auto.u];
    if (p.grow) return p.grow[0] || p.parts || [];
    return p.parts || [];
  }
  /* The keep grows a storey at each theme.growAt building count (rewards + shop pieces, not the auto walls). */
  function coreStage() {
    var t = themeDef(save.theme), at = (t && t.growAt) || [1, 4, 8, 13], n = grownCount(), st = 0, i;
    for (i = 0; i < at.length; i++) if (n >= at[i]) st = i;
    return st;
  }
  function partsFor(p, cx, cy, ignore, prot) {
    var names = p.auto ? wallParts(p, cx, cy, ignore) : (p.grow ? (p.grow[Math.min(coreStage(), p.grow.length - 1)] || p.parts) : (p.parts || [])), out = [], lift = 0, i, sp, nm;
    /* auto-tiled runs already picked their sprite in view space, so only the piece's own turn applies to them */
    var shift = (p.auto ? 0 : rot()) + (prot || 0);
    for (i = 0; i < names.length; i++) {
      nm = orientName(names[i], shift); sp = kitSprite(nm);
      out.push({ name: nm, lift: lift, w: sp.w, h: sp.h, oy: sp.oy || 0 });
      if (!p.auto) lift += sp.lift || 0;              /* gate overlays sit on the wall's own base */
    }
    return out;
  }
  function stackHeight(p, cx, cy, prot) { var ps = partsFor(p, cx, cy, null, prot), last = ps[ps.length - 1]; return last ? last.lift + (kitSprite(last.name).lift || 0) : 0; }
  function rectsOf(ignore) {
    var out = [];
    save.picks.forEach(function (pk) {
      var p = pieceById(pk.piece);
      if (!p || pk === ignore || pk.cx == null || isTopper(p)) return;   /* toppers ride on a tower, they take no cell */
      out.push({ cx: pk.cx, cy: pk.cy, n: cellsOf(p), pk: pk, p: p });
    });
    return out;
  }
  function overlaps(cx, cy, n, r) { return cx < r.cx + r.n && cx + n > r.cx && cy < r.cy + r.n && cy + n > r.cy; }
  function touches(cx, cy, n, r) {
    var sideX = (cx + n === r.cx || r.cx + r.n === cx) && cy < r.cy + r.n && cy + n > r.cy;
    var sideY = (cy + n === r.cy || r.cy + r.n === cy) && cx < r.cx + r.n && cx + n > r.cx;
    return sideX || sideY;
  }
  function spotFree(cx, cy, n, ignore) {
    var rs = rectsOf(ignore), i;
    for (i = 0; i < rs.length; i++) if (overlaps(cx, cy, n, rs[i])) return false;
    return true;
  }
  function touchesAny(cx, cy, n, ignore) { var rs = rectsOf(ignore), i; for (i = 0; i < rs.length; i++) if (touches(cx, cy, n, rs[i])) return true; return false; }
  /* v5: a piece may go anywhere that is free; flags and banners need a tower with no flag yet. */
  function spotOk(cx, cy, n, ignore, piece) {
    if (piece && isTopper(piece)) return !!hostFor(cx, cy, ignore);
    return spotFree(cx, cy, n, ignore);
  }
  function hostFor(cx, cy, ignore) {
    var host = pickAt(cx, cy, ignore, function (q) { return isHost(q); });
    if (!host) return null;
    return pickAt(cx, cy, ignore, function (q) { return isTopper(q); }) ? null : host;
  }
  /* Nearest free spot that touches an existing piece (a new piece joins the build by default); walls
     prefer to continue a straight run; toppers go on the tallest free tower. Falls back to any free cell. */
  function autoPlace(n, ignore, piece, near) {
    var rs = rectsOf(ignore), i, ring, cx, cy, best = null, bd = Infinity, sumx = 0, sumy = 0, d, mx, my, R = 16;
    if (piece && isTopper(piece)) {
      var hosts = rs.filter(function (r) { return isHost(r.p) && hostFor(r.cx, r.cy, ignore); })
        .sort(function (a, b) { return stackHeight(b.p, b.cx, b.cy, b.pk.rot) - stackHeight(a.p, a.cx, a.cy, a.pk.rot); });
      return hosts.length ? { cx: hosts[0].cx, cy: hosts[0].cy } : null;
    }
    if (!rs.length) return { cx: -Math.floor(n / 2), cy: -Math.floor(n / 2) };
    if (piece && piece.kind === "wall" && !near) {                         /* extend a run of the same kind */
      var walls = rs.filter(function (r) { return r.p.kind === "wall" && catOf(r.p) === catOf(piece); }), ends = [];
      walls.forEach(function (w) {
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (dv) {
          var x = w.cx + dv[0], y = w.cy + dv[1], back = pickAt(w.cx - dv[0], w.cy - dv[1], ignore);
          if (back && spotFree(x, y, 1, ignore)) ends.push({ cx: x, cy: y, s: 0 });
          else if (spotFree(x, y, 1, ignore)) ends.push({ cx: x, cy: y, s: 1 });
        });
      });
      ends.sort(function (a, b) { return a.s - b.s; });
      if (ends.length) return { cx: ends[0].cx, cy: ends[0].cy };
    }
    if (near) { mx = near.cx; my = near.cy; }
    else { rs.forEach(function (r) { sumx += r.cx + r.n / 2; sumy += r.cy + r.n / 2; }); mx = sumx / rs.length; my = sumy / rs.length; }
    for (ring = 0; ring <= R; ring++) {
      for (cx = Math.round(mx) - ring; cx <= Math.round(mx) + ring; cx++) for (cy = Math.round(my) - ring; cy <= Math.round(my) + ring; cy++) {
        if (Math.max(Math.abs(cx - Math.round(mx)), Math.abs(cy - Math.round(my))) !== ring) continue;
        if (!spotFree(cx, cy, n, ignore)) continue;
        var adj = touchesAny(cx, cy, n, ignore);
        d = Math.abs(cx + n / 2 - mx) + Math.abs(cy + n / 2 - my) + (adj ? 0 : 6) + (cx + cy) * 0.01;
        if (d < bd) { bd = d; best = { cx: cx, cy: cy }; }
      }
      if (best && ring >= 1) return best;
    }
    return best || { cx: Math.round(mx) + R, cy: Math.round(my) + R };
  }
  function ensurePositions() {
    var changed = false;
    save.picks.filter(function (pk) { return !pk.deco; }).concat(save.picks.filter(function (pk) { return pk.deco; })).forEach(function (pk) {
      var p = pieceById(pk.piece);
      if (!p || (pk.cx != null && pk.cy != null)) return;
      var pos = autoPlace(cellsOf(p), null, p) || autoPlace(1, null, null);
      pk.cx = pos.cx; pk.cy = pos.cy; changed = true;
    });
    if (changed) persist();
  }
  function bboxCells(ignore) {
    var rs = rectsOf(ignore), b = null;
    rs.forEach(function (r) {
      if (!b) b = { u0: r.cx, v0: r.cy, u1: r.cx + r.n, v1: r.cy + r.n };
      else { b.u0 = Math.min(b.u0, r.cx); b.v0 = Math.min(b.v0, r.cy); b.u1 = Math.max(b.u1, r.cx + r.n); b.v1 = Math.max(b.v1, r.cy + r.n); }
    });
    return b;
  }
  /* v5.5: a stable key per placed piece for the 3D view's cache (picks are plain saved objects, so the key lives beside them) */
  var pickKeys = typeof WeakMap === "function" ? new WeakMap() : null, keySeq = 0;
  function keyOf(pk) {
    if (!pk) return "";
    if (!pickKeys) { if (!pk._k) pk._k = "p" + (++keySeq); return pk._k; }
    var k = pickKeys.get(pk); if (!k) { k = "p" + (++keySeq); pickKeys.set(pk, k); } return k;
  }
  function itemFor(p, pk, cx, cy, style, extra, ignore) {
    var n = cellsOf(p), ctr = rotPt(cx + n / 2, cy + n / 2), c = cellXY(ctr.u, ctr.v), it, k, host, base = 0;
    if (isKit()) {
      /* the sprite's bottom-centre is the cell's front apex: half a diamond below the cell centre */
      if (isTopper(p)) { host = hostFor(cx, cy, pk) || pickAt(cx, cy, pk, function (q) { return isHost(q); }); if (host) base = stackHeight(pieceById(host.piece), cx, cy, host.rot); }
      /* v5.3: an n×n piece's sprite hangs from the front apex of the whole footprint, n half-diamonds below its centre */
      it = { p: p, pk: pk, style: style, x: c.x, y: c.y + n * cellH() / 2, a: 1, depth: ctr.u + ctr.v + n - 1 + (isTopper(p) ? 0.5 : 0), cx: cx, cy: cy, n: n, kit: true, base: base, ign: ignore || null, parts: partsFor(p, cx, cy, ignore, pk ? pk.rot : 0),
        key: keyOf(pk) || ("g" + cx + "," + cy), prot: pk ? (pk.rot || 0) : 0, run: isRun(p), hostKey: host ? keyOf(host) : "" };
    } else {
      it = { p: p, pk: pk, style: style, x: c.x, y: c.y, a: 1, depth: ctr.u + ctr.v + n, cx: cx, cy: cy, n: n };
    }
    if (extra) for (k in extra) it[k] = extra[k];
    return it;
  }
  function sceneItems() {
    var items = [], t = themeDef(save.theme), dom = dominantStyle(), drag = cur && cur.drag, sel = cur && cur.sel;
    ensurePositions();
    save.picks.forEach(function (pk) {
      var p = pieceById(pk.piece);
      if (!p) return;
      if (drag && drag.pk === pk && drag.moved) {
        items.push(itemFor(p, pk, drag.cx, drag.cy, pk.style || dom, { a: drag.ok ? 0.85 : 0.45, bad: !drag.ok, ghost: true }, pk));
        return;
      }
      items.push(itemFor(p, pk, pk.cx, pk.cy, pk.style || dom, { ghost: cur && cur.placedKey === pk, sel: sel === pk }, drag ? drag.pk : null));
    });
    if (t && t.ring && wallsUp()) ringItems(t.ring, dom).forEach(function (it) { items.push(it); });
    return items;
  }
  /* Town: the fence ring hugs the estate one cell out; segments are 2 cells long so they join. */
  function ringItems(ring, style) {
    var seg = pieceById(ring.seg), corner = ring.corner ? pieceById(ring.corner) : null, gate = ring.gate ? pieceById(ring.gate) : null;
    var b = bboxCells(), items = [], len, u0, v0, u1, v1, i, c, nseg, gateAt, odd = rot() % 2 === 1;
    if (!seg || !b) return items;
    len = Math.max(1, cellsOf(seg));
    u0 = b.u0 - 1; v0 = b.v0 - 1; u1 = b.u1 + 1; v1 = b.v1 + 1;
    var span = Math.max(u1 - u0, v1 - v0); u1 = u0 + span; v1 = v0 + span;
    nseg = Math.ceil(span / len);
    gateAt = Math.floor(nseg / 2);
    function push(p, cx, cy, flip, key, front) {
      var pv = rotPt(cx, cy); c = cellXY(pv.u, pv.v);
      items.push({ p: p, style: style, x: c.x, y: c.y, a: front ? 0.94 : 1, depth: pv.u + pv.v, flip: flip !== odd, key: key, ring: true });
    }
    for (i = 0; i < nseg; i++) {
      var f = Math.min(u0 + i * len + len / 2, u1 - len / 2), g = Math.min(v0 + i * len + len / 2, v1 - len / 2);
      push(seg, f, v0 + 0.5, true, "wb" + i, false);
      push(seg, u0 + 0.5, g, false, "wl" + i, false);
      push(seg, f, v1 + 0.5, true, "wf" + i, true);
      if (i === gateAt && gate) push(gate, u1 + 0.5, g, false, "gate", true);
      else if (i !== gateAt || gate) push(seg, u1 + 0.5, g, false, "wr" + i, true);
    }
    if (corner) [[u0 + 0.5, v0 + 0.5], [u1 + 0.5, v0 + 0.5], [u1 + 0.5, v1 + 0.5], [u0 + 0.5, v1 + 0.5]].forEach(function (q, ci) { push(corner, q[0], q[1], false, "c" + ci, ci >= 2); });
    return items;
  }
  function sceneScale1() { var t = themeDef(save.theme); return (t && t.drawScale) || (data && data.drawScale) || 1; }
  function unitScale(p) { var t = themeDef(save.theme), tu = (t && t.unitPx) || p.unitPx || 1, pu = p.unitPx || tu; return pu ? tu / pu : 1; }
  /* Fit: bounding box of every sprite → scale + offset; then the student's zoom and pan on top. */
  function fitScene(items, W, H) {
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity, base = sceneScale1(), sc, ox, oy, pad, vw = view();
    items.forEach(function (it) {
      if (it.kit) {
        (it.parts || []).forEach(function (pt) {
          var l = it.x * base - pt.w * base / 2, bottom = (it.y - it.base - pt.lift + pt.oy) * base, tp = bottom - pt.h * base;
          minX = Math.min(minX, l); maxX = Math.max(maxX, l + pt.w * base); minY = Math.min(minY, tp); maxY = Math.max(maxY, bottom);
        });
        return;
      }
      var us = unitScale(it.p), w = (it.p.w || 60) * base * us, h = (it.p.h || 60) * base * us, ax = it.p.ax != null ? it.p.ax : 0.5, ay = it.p.ay != null ? it.p.ay : 1;
      var l = it.x * base - w * ax, tp = it.y * base - h * ay;
      minX = Math.min(minX, l); maxX = Math.max(maxX, l + w); minY = Math.min(minY, tp); maxY = Math.max(maxY, tp + h);
    });
    if (!items.length) { minX = -100; maxX = 100; minY = -60; maxY = 40; }
    pad = cellPx() * base * 1.2;
    minX -= pad; maxX += pad; minY -= pad * 0.5; maxY += pad * 0.5;
    var bw = Math.max(1, maxX - minX), bh = Math.max(1, maxY - minY);
    var maxS = (W / ((data && data.sceneW) || 1120)) * 2.2;                   /* small estates are drawn big, not lost in the field */
    sc = Math.min(maxS, (W * 0.94) / bw, (H * 0.9) / bh) * (vw.z || 1);
    ox = W / 2 - ((minX + maxX) / 2) * sc + (vw.px || 0); oy = H * 0.52 - ((minY + maxY) / 2) * sc + (vw.py || 0);
    return { s: sc * base, ox: ox, oy: oy, base: base };
  }
  function drawFootprint(ctx, it, fit) {
    var C = cellPx() * fit.s / fit.base, q = [worldPx(it.cx, it.cy), worldPx(it.cx + it.n, it.cy), worldPx(it.cx + it.n, it.cy + it.n), worldPx(it.cx, it.cy + it.n)];
    ctx.beginPath(); q.forEach(function (pt, i) { var px = fit.ox + pt.x * fit.s / fit.base, py = fit.oy + pt.y * fit.s / fit.base; if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); });
    ctx.closePath();
    ctx.fillStyle = it.bad ? "rgba(255,90,90,.35)" : it.sel ? "rgba(120,220,255,.35)" : it.ghost ? "rgba(245,200,66,.35)" : "rgba(245,200,66,.12)"; ctx.fill();
    ctx.lineWidth = Math.max(1, C * 0.04); ctx.strokeStyle = it.bad ? "#ff6b6b" : it.sel ? "#8ee0ff" : "rgba(245,200,66,.85)"; ctx.stroke();
  }
  /* ── v5.4: walls, gates, hedges and fences are drawn as geometry, not sprites ──────────────
     A run piece (auto-tiled) is a box, or an L / T / cross of boxes, built from its cell's corners in
     WORLD space and projected through the view, so a run stays one continuous wall at every view
     angle. Sprites only exist in four directions, which broke a run into staggered blocks in between
     the quarter turns. Neighbours are read in world space too (same category, or a solid building). */
  var RUN_STYLE = {
    wall: { kind: "stone", t: 0.5, h: 1.15, merlons: true },
    gate: { kind: "stone", t: 0.5, h: 1.15, merlons: true, arch: true, bars: true },
    doorway: { kind: "stone", t: 0.5, h: 1.15, merlons: true, arch: true },
    "stairs-wall": { kind: "stone", t: 0.5, h: 1.15, merlons: true, stairs: true },
    "corner-tower": { kind: "stone", t: 0.5, h: 1.15, merlons: true, turret: true },
    hedge: { kind: "hedge", t: 0.56, h: 0.6 },
    "hedge-gate": { kind: "hedge", t: 0.56, h: 0.6, gap: true },
    "c-fence": { kind: "wood", t: 0.07, h: 0.55, fence: true, rails: 2 },
    "fence-gate": { kind: "wood", t: 0.07, h: 0.6, fence: true, rails: 3, gate: true },
    "rail-fence": { kind: "wood", t: 0.06, h: 0.45, fence: true, rails: 2 }
  };
  var RUN_COLS = {
    stone: { top: "#aeb4bb", light: "#8f969e", dark: "#687079", hole: "#33373b", bar: "#b8bcc0", body: "#8e949c", merlon: "#8e949c" },
    hedge: { top: "#5cab45", light: "#48943b", dark: "#33712c", body: "#4a9a3c" },
    wood: { top: "#c39463", light: "#aa7c4f", dark: "#7f5a38", body: "#a57b4e" }
  };
  function isRun(p) { return !!(p && p.auto && RUN_STYLE[p.id]); }
  /* the world directions a run piece at (cx, cy) joins: the same category of run, or a solid building */
  function runDirs(p, cx, cy, ignore) {
    var pred = function (q) { return q.auto ? catOf(q) === catOf(p) : isSolid(q); }, out = [];
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { if (pickAt(cx + d[0], cy + d[1], ignore, pred)) out.push(d); });
    return out;
  }
  /* the plan of a run cell: which boxes make it (a straight box for an opposite pair of joins, half boxes for the other arms,
     a gap in a hedge gate), shared by the 2D drawing here and the 3D view (js/build3d.js) */
  function runPlan(it) {
    var p = it.p, st = RUN_STYLE[p.id], cols = RUN_COLS[st.kind], cx = it.cx, cy = it.cy;
    /* which way the run goes, from WORLD neighbours; a lone piece follows its own turn */
    var dirs = runDirs(p, cx, cy, it.ign), rot = (it.pk && it.pk.rot) || 0, side = (rot & 1) ? -1 : 1;
    if (!dirs.length) dirs = (rot & 1) ? [[0, 1], [0, -1]] : [[1, 0], [-1, 0]];
    else if (dirs.length === 1) dirs.push([-dirs[0][0], -dirs[0][1]]);
    var has = function (dx, dy) { return dirs.some(function (d) { return d[0] === dx && d[1] === dy; }); };
    var mx = cx + 0.5, my = cy + 0.5, t = st.t, ht = t / 2, E = 0.02, h = st.h, parts = [];
    var straightX = has(1, 0) && has(-1, 0), straightY = has(0, 1) && has(0, -1), main = null;
    if (straightX) { parts.push({ x0: cx - E, x1: cx + 1 + E, y0: my - ht, y1: my + ht, axis: "x" }); main = parts[parts.length - 1]; }
    if (straightY) { parts.push({ x0: mx - ht, x1: mx + ht, y0: cy - E, y1: cy + 1 + E, axis: "y" }); if (!main) main = parts[parts.length - 1]; }
    dirs.forEach(function (d) {
      if ((d[0] && straightX) || (d[1] && straightY)) return;
      if (d[0]) parts.push({ x0: d[0] > 0 ? mx - ht : cx - E, x1: d[0] > 0 ? cx + 1 + E : mx + ht, y0: my - ht, y1: my + ht, axis: "x" });
      else parts.push({ x0: mx - ht, x1: mx + ht, y0: d[1] > 0 ? my - ht : cy - E, y1: d[1] > 0 ? cy + 1 + E : my + ht, axis: "y" });
    });
    if (!main) main = parts[0];
    if (st.gap && main) {                              /* a gap in the middle of a hedge */
      var g = 0.2, keep = [];
      parts.forEach(function (b) {
        if (b !== main) { keep.push(b); return; }
        if (b.axis === "x") { keep.push({ x0: b.x0, x1: mx - g, y0: b.y0, y1: b.y1, axis: "x" }); keep.push({ x0: mx + g, x1: b.x1, y0: b.y0, y1: b.y1, axis: "x" }); }
        else { keep.push({ x0: b.x0, x1: b.x1, y0: b.y0, y1: my - g, axis: "y" }); keep.push({ x0: b.x0, x1: b.x1, y0: my + g, y1: b.y1, axis: "y" }); }
      });
      parts = keep;
    }
    return { st: st, cols: cols, parts: parts, main: main, side: side, dirs: dirs, mx: mx, my: my, cx: cx, cy: cy, t: t, ht: ht, h: h, E: E };
  }
  function drawRun(ctx, it, fit) {
    var pl = runPlan(it), st = pl.st, cols = pl.cols, s = fit.s / fit.base, H = cellH();
    var side = pl.side, mx = pl.mx, my = pl.my, t = pl.t, ht = pl.ht, E = pl.E, h = pl.h, parts = pl.parts, main = pl.main;
    function P(x, y, z) { var g = worldPx(x, y); return { x: fit.ox + g.x * s, y: fit.oy + (g.y - (z || 0) * H) * s }; }
    function poly(pts) { ctx.beginPath(); pts.forEach(function (q, i) { if (i) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }); ctx.closePath(); }
    /* a box over world [x0,x1]×[y0,y1], from height z0 to z1: the two near side faces, then the top */
    function box(x0, y0, x1, y1, z0, z1, c, mode) {
      c = c || cols;
      var b = [P(x0, y0, z0), P(x1, y0, z0), P(x1, y1, z0), P(x0, y1, z0)], t = [P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)];
      var ctr = P((x0 + x1) / 2, (y0 + y1) / 2, z0), i, j, m;
      if (mode !== "top") for (i = 0; i < 4; i++) {
        j = (i + 1) & 3; m = { x: (b[i].x + b[j].x) / 2, y: (b[i].y + b[j].y) / 2 };
        if (m.y > ctr.y + 0.01) { ctx.fillStyle = m.x < ctr.x ? c.light : c.dark; poly([b[i], b[j], t[j], t[i]]); ctx.fill(); }
      }
      if (mode !== "sides") { ctx.fillStyle = c.top; poly(t); ctx.fill(); }
    }
    function screenY(x, y) { return P(x, y, 0).y; }
    ctx.save(); ctx.globalAlpha = it.a;
    if (st.fence) {
      /* posts at the cell edges and the centre, rails between them */
      var posts = [], rails = [], pw = 0.08, i, k, n = st.rails || 2;
      parts.forEach(function (b) {
        if (b.axis === "x") { posts.push([b.x0 + E, my]); posts.push([b.x1 - E, my]); for (k = 0; k < n; k++) rails.push({ x0: b.x0, x1: b.x1, y0: my - t / 2, y1: my + t / 2, z0: 0.14 + k * (h - 0.2) / Math.max(1, n - 1), z1: 0.14 + k * (h - 0.2) / Math.max(1, n - 1) + 0.06 }); }
        else { posts.push([mx, b.y0 + E]); posts.push([mx, b.y1 - E]); for (k = 0; k < n; k++) rails.push({ x0: mx - t / 2, x1: mx + t / 2, y0: b.y0, y1: b.y1, z0: 0.14 + k * (h - 0.2) / Math.max(1, n - 1), z1: 0.14 + k * (h - 0.2) / Math.max(1, n - 1) + 0.06 }); }
      });
      if (st.gate) posts.push([mx, my]);
      var all = rails.map(function (r) { return { kind: "rail", r: r, y: screenY((r.x0 + r.x1) / 2, (r.y0 + r.y1) / 2) }; })
        .concat(posts.map(function (q) { return { kind: "post", q: q, y: screenY(q[0], q[1]) }; }));
      all.sort(function (a, b) { return a.y - b.y; });
      all.forEach(function (o) {
        if (o.kind === "rail") box(o.r.x0, o.r.y0, o.r.x1, o.r.y1, o.r.z0, o.r.z1);
        else box(o.q[0] - pw / 2, o.q[1] - pw / 2, o.q[0] + pw / 2, o.q[1] + pw / 2, 0, h);
      });
      ctx.restore(); return;
    }
    /* solid runs: boxes back to front, then merlons, arches, stairs, turret */
    /* all the side faces, then all the tops: the boxes share one height, so where arms overlap (a corner, T or cross) no seam shows */
    parts.forEach(function (b) { box(b.x0, b.y0, b.x1, b.y1, 0, h, null, "sides"); });
    parts.forEach(function (b) { box(b.x0, b.y0, b.x1, b.y1, 0, h, null, "top"); });
    if (st.stairs && main) {                            /* three steps up against one long face (turning the piece swaps the side) */
      var k2, sw = 0.22, sd = 0.24, e0 = side > 0 ? ht : -ht - sd, e1 = e0 + sd;
      for (k2 = 0; k2 < 3; k2++) {
        if (main.axis === "x") box(mx - 0.33 + k2 * sw, my + e0, mx - 0.33 + (k2 + 1) * sw, my + e1, 0, 0.3 * (k2 + 1));
        else box(mx + e0, my - 0.33 + k2 * sw, mx + e1, my - 0.33 + (k2 + 1) * sw, 0, 0.3 * (k2 + 1));
      }
    }
    if (st.arch && main) {                              /* an archway through the near long face (and iron bars for the portcullis) */
      var face = null, a, pts = [], u0, u1, um, k3, z;
      if (main.axis === "x") { face = screenY(mx, my + ht) > screenY(mx, my - ht) ? my + ht : my - ht; um = mx; }
      else { face = screenY(mx + ht, my) > screenY(mx - ht, my) ? mx + ht : mx - ht; um = my; }
      u0 = um - 0.2; u1 = um + 0.2;
      var F = function (u, z) { return main.axis === "x" ? P(u, face, z) : P(face, u, z); };
      pts.push(F(u0, 0)); pts.push(F(u0, 0.55));
      for (k3 = 0; k3 <= 10; k3++) { a = Math.PI - k3 * Math.PI / 10; pts.push(F(um + 0.2 * Math.cos(a), 0.55 + 0.2 * Math.sin(a))); }
      pts.push(F(u1, 0));
      ctx.fillStyle = cols.hole; poly(pts); ctx.fill();
      if (st.bars) {
        ctx.strokeStyle = cols.bar; ctx.lineWidth = Math.max(1, 2 * s);
        for (k3 = -2; k3 <= 2; k3++) { var q0 = F(um + k3 * 0.08, 0), q1 = F(um + k3 * 0.08, 0.72); ctx.beginPath(); ctx.moveTo(q0.x, q0.y); ctx.lineTo(q1.x, q1.y); ctx.stroke(); }
        for (z = 0.15; z < 0.72; z += 0.18) { var r0 = F(u0 + 0.03, z), r1 = F(u1 - 0.03, z); ctx.beginPath(); ctx.moveTo(r0.x, r0.y); ctx.lineTo(r1.x, r1.y); ctx.stroke(); }
      }
    }
    if (st.merlons) {                                   /* battlements along both long edges of every box */
      var ms = [], mw = 0.12, md = 0.13, mh = 0.22;
      parts.forEach(function (b) {
        var len = b.axis === "x" ? b.x1 - b.x0 : b.y1 - b.y0, n2 = Math.max(1, Math.round(len / 0.25)), k4, u;
        for (k4 = 0; k4 < n2; k4++) {
          u = (b.axis === "x" ? b.x0 : b.y0) + (k4 + 0.5) * len / n2 - mw / 2;
          if (b.axis === "x") { ms.push({ x0: u, x1: u + mw, y0: b.y0, y1: b.y0 + md }); ms.push({ x0: u, x1: u + mw, y0: b.y1 - md, y1: b.y1 }); }
          else { ms.push({ x0: b.x0, x1: b.x0 + md, y0: u, y1: u + mw }); ms.push({ x0: b.x1 - md, x1: b.x1, y0: u, y1: u + mw }); }
        }
      });
      ms.sort(function (a, b) { return screenY((a.x0 + a.x1) / 2, (a.y0 + a.y1) / 2) - screenY((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2); });
      ms.forEach(function (m) { box(m.x0, m.y0, m.x1, m.y1, h, h + mh); });
    }
    if (st.turret) {                                    /* a round turret on the corner: shaded cylinder, flat top, a ring of merlons */
      var r = 0.36, th = h + 0.45, N = 24, ring = [], top = [], k5, ang2, q, c0 = P(mx, my, 0), lo = null, hi = null;
      for (k5 = 0; k5 < N; k5++) { ang2 = k5 * 2 * Math.PI / N; q = { x: mx + r * Math.cos(ang2), y: my + r * Math.sin(ang2) }; ring.push({ b: P(q.x, q.y, 0), t: P(q.x, q.y, th) }); }
      /* the near half of the cylinder: from the leftmost to the rightmost silhouette point through the front */
      ring.forEach(function (o, i) { if (!lo || o.b.x < ring[lo].b.x) lo = i; if (!hi || o.b.x > ring[hi].b.x) hi = i; });
      var seq = [], i2 = lo, guard = 0;
      while (guard++ < N + 1) { seq.push(i2); if (i2 === hi) break; i2 = (i2 + 1) % N; }
      if (seq.length && ring[seq[Math.floor(seq.length / 2)]].b.y < c0.y) { seq = []; i2 = lo; guard = 0; while (guard++ < N + 1) { seq.push(i2); if (i2 === hi) break; i2 = (i2 - 1 + N) % N; } }
      var bodyPts = seq.map(function (i) { return ring[i].b; }).concat(seq.slice().reverse().map(function (i) { return ring[i].t; }));
      var gr = ctx.createLinearGradient(ring[lo].b.x, 0, ring[hi].b.x, 0); gr.addColorStop(0, cols.light); gr.addColorStop(0.45, cols.light); gr.addColorStop(1, cols.dark);
      ctx.fillStyle = gr; poly(bodyPts); ctx.fill();
      ctx.fillStyle = cols.top; poly(ring.map(function (o) { return o.t; })); ctx.fill();
      var mer = [];
      for (k5 = 0; k5 < 8; k5++) { ang2 = k5 * Math.PI / 4; q = { x: mx + (r - 0.07) * Math.cos(ang2), y: my + (r - 0.07) * Math.sin(ang2) }; mer.push({ x0: q.x - 0.06, x1: q.x + 0.06, y0: q.y - 0.06, y1: q.y + 0.06 }); }
      mer.sort(function (a, b) { return screenY((a.x0 + a.x1) / 2, (a.y0 + a.y1) / 2) - screenY((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2); });
      mer.forEach(function (m) { box(m.x0, m.y0, m.x1, m.y1, th, th + 0.18); });
    }
    ctx.restore();
  }
  function drawKitPiece(ctx, it, fit) {
    var s = fit.s / fit.base, x = fit.ox + it.x * s, y0 = fit.oy + it.y * s, i, pt, c, dw, dh, bottom;
    if (isRun(it.p)) { if (it.ghost || it.sel) { ctx.save(); ctx.globalAlpha = it.a; drawFootprint(ctx, it, fit); ctx.restore(); } drawRun(ctx, it, fit); return; }
    ctx.save(); ctx.globalAlpha = it.a;
    if (it.ghost || it.sel) drawFootprint(ctx, it, fit);
    for (i = 0; i < it.parts.length; i++) {
      pt = it.parts[i];
      dw = pt.w * s; dh = pt.h * s; bottom = y0 - (it.base + pt.lift - pt.oy) * s;
      c = drawSprite(ctx, pt.name, it.style, pt.w, pt.h, x - dw / 2, bottom - dh, dw, dh);
      if (c === false) { ctx.fillStyle = "rgba(58,65,80,.9)"; ctx.fillRect(x - dw / 2, bottom - dh, dw, dh); }
    }
    ctx.restore();
  }
  function drawPiece(ctx, it, fit) {
    if (it.kit) { drawKitPiece(ctx, it, fit); return; }
    var p = it.p, src = imgFor(p, it.style), c = getImg(src), s = fit.s * unitScale(p), x = fit.ox + it.x * fit.s / fit.base, y = fit.oy + it.y * fit.s / fit.base;
    var w = (p.w || 60) * s / fit.base, h = (p.h || 60) * s / fit.base, ax = p.ax != null ? p.ax : 0.5, ay = p.ay != null ? p.ay : 1, iw, ih, dw, dh;
    ctx.save(); ctx.globalAlpha = it.a;
    if (it.n && (it.ghost || it.sel)) drawFootprint(ctx, it, fit);
    if (c.ok) {
      iw = c.img.naturalWidth || p.w || 1; ih = c.img.naturalHeight || p.h || 1; dw = iw * s / fit.base; dh = ih * s / fit.base;
      if (!it.flip) { ctx.fillStyle = "rgba(0,0,0,.16)"; ellipse(ctx, x, y + 2, dw * 0.4, dw * 0.1); }
      if (it.flip) { ctx.translate(x, y); ctx.scale(-1, 1); ctx.drawImage(c.img, -dw * (1 - ax), -dh * ay, dw, dh); }
      else ctx.drawImage(c.img, x - dw * ax, y - dh * ay, dw, dh);
    } else if (c.ok === false || !it.flip) {
      ctx.fillStyle = "rgba(0,0,0,.2)"; ellipse(ctx, x, y + 2, w * 0.45, w * 0.11);
      ctx.fillStyle = c.ok === null ? "rgba(255,255,255,.3)" : "rgba(58,65,80,.9)";
      ctx.fillRect(x - w / 2, y - h, w, h);
      ctx.strokeStyle = "#f5c842"; ctx.lineWidth = 1.5; ctx.strokeRect(x - w / 2, y - h, w, h);
      ctx.fillStyle = "#e8e6df"; ctx.font = "700 " + Math.max(9, Math.round(w * 0.14)) + "px 'Trebuchet MS', sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(p.name || p.id, x, y - h / 2, w - 4);
    }
    ctx.restore();
  }
  var lastFit = null;
  function redraw() {
    if (!ui || !mode) return;
    var cv = ui.canvas, ctx = cv.getContext("2d"), W = cv._w || 1, H = cv._h || 1, items, fit;
    ctx.setTransform(cv._dpr || 1, 0, 0, cv._dpr || 1, 0, 0);
    ctx.clearRect(0, 0, W, H);
    paintBg(ctx, W, H, save.theme || "village");
    if (!save.theme) { banner(ctx, W, H, loadState === "ok" ? "Choose a Town or a Castle to start building" : "Build data not available"); lastFit = null; return; }
    items = sceneItems();
    fit = lastFit = fitScene(items, W, H);
    drawGround(ctx, fit);
    /* v5.5: a kit theme draws its pieces in 3D when it can (js/build3d.js), so they turn with the map by the degree */
    var td = window.SolBuild3D, use3d = isKit() && td && td.ready() && !redraw.force2d;
    if (use3d) {
      items.forEach(function (it) { if (it.kit && (it.ghost || it.sel)) { ctx.save(); ctx.globalAlpha = it.a; drawFootprint(ctx, it, fit); ctx.restore(); } });
      var drawn = false;
      try { drawn = td.render({ canvas: ui.canvas3d, W: W, H: H, dpr: cv._dpr || 1, fit: fit, items: items }); } catch (err) { drawn = false; if (window.console) console.warn("build3d", err); }
      if (drawn) { ui.canvas3d.style.display = ""; return; }
    }
    ui.canvas3d.style.display = "none";
    items.sort(function (a, b) { return (a.depth - b.depth) || (a.y - b.y) || (a.x - b.x); }).forEach(function (it) { drawPiece(ctx, it, fit); });
  }

  /* ── stack thumbnails (palette, shop and option cards) ───────────────────── */
  function drawStackInto(cv, p, style) {
    var ctx = cv.getContext("2d"), W = cv.width, H = cv.height, names = staticParts(p), parts = [], lift = 0, i, sp, maxW = 1, top = 0, ready = true;
    ctx.clearRect(0, 0, W, H);
    for (i = 0; i < names.length; i++) { sp = kitSprite(names[i]); parts.push({ name: names[i], lift: lift, w: sp.w, h: sp.h, oy: sp.oy || 0 }); if (!p.auto) lift += sp.lift || 0; maxW = Math.max(maxW, sp.w); top = Math.max(top, lift + sp.h - (sp.oy || 0)); }
    var sc = Math.min((W - 8) / maxW, (H - 8) / Math.max(1, top)), x = W / 2, y0 = H - 4;
    for (i = 0; i < parts.length; i++) {
      var pt = parts[i], dw = pt.w * sc, dh = pt.h * sc, bottom = y0 - (pt.lift - pt.oy) * sc;
      if (drawSprite(ctx, pt.name, style, pt.w, pt.h, x - dw / 2, bottom - dh, dw, dh) === null) ready = false;
    }
    return ready;
  }
  function stackThumb(p, style, w, h) {
    var cv = el("canvas"); cv.width = w || 120; cv.height = h || 96; cv.className = "thumb";
    if (!drawStackInto(cv, p, style)) thumbs.push({ cv: cv, p: p, style: style });
    return cv;
  }
  function refreshThumbs() {
    if (!thumbs.length) return;
    thumbs = thumbs.filter(function (t) { return document.body.contains(t.cv) && !drawStackInto(t.cv, t.p, t.style); });
  }

  /* ── dragging, selecting and panning ─────────────────────────────────────── */
  function canvasScenePt(e) {
    var r = ui.canvas.getBoundingClientRect(), fit = lastFit;
    if (!fit) return null;
    var x = (e.clientX - r.left) * (ui.canvas._w / (r.width || 1)), y = (e.clientY - r.top) * (ui.canvas._h / (r.height || 1));
    return { x: (x - fit.ox) * fit.base / fit.s, y: (y - fit.oy) * fit.base / fit.s, sx: x, sy: y, fit: fit };
  }
  function hitPick(pt) {
    var cell = pxToCell(pt.x, pt.y), wpt = unrotPt(cell.u, cell.v), cu = Math.floor(wpt.x), cvv = Math.floor(wpt.y), fit = pt.fit;
    var bestFoot = null, bfd = -Infinity, bestBox = null, bbd = -Infinity;
    var all = rectsOf();
    save.picks.forEach(function (pk) { var p = pieceById(pk.piece); if (p && isTopper(p) && pk.cx != null) all.push({ cx: pk.cx, cy: pk.cy, n: 1, pk: pk, p: p, topper: true }); });
    all.forEach(function (r) {
      var ctr = rotPt(r.cx + r.n / 2, r.cy + r.n / 2), depth = ctr.u + ctr.v + (r.topper ? 0.5 : 0), p = pieceById(r.pk.piece);
      if (!r.topper && cu >= r.cx && cu < r.cx + r.n && cvv >= r.cy && cvv < r.cy + r.n) { if (depth > bfd) { bfd = depth; bestFoot = r.pk; } return; }
      if (!p) return;
      var it = itemFor(p, r.pk, r.cx, r.cy, ""), x = fit.ox + it.x * fit.s / fit.base, y = fit.oy + it.y * fit.s / fit.base, w, h, ax, ay, sc;
      if (it.kit) {
        var top = it.parts[it.parts.length - 1]; if (!top) return;
        sc = fit.s / fit.base; w = Math.max.apply(null, it.parts.map(function (q) { return q.w; })) * sc; h = (it.base + top.lift + top.h) * sc; ax = 0.5; ay = 1;
      } else {
        sc = fit.s * unitScale(p) / fit.base; w = (p.w || 60) * sc; h = (p.h || 60) * sc; ax = p.ax != null ? p.ax : 0.5; ay = p.ay != null ? p.ay : 1;
      }
      if (pt.sx >= x - w * ax && pt.sx <= x - w * ax + w && pt.sy >= y - h * ay && pt.sy <= y - h * ay + h && depth > bbd) { bbd = depth; bestBox = r.pk; }
    });
    return bestFoot || bestBox;
  }
  function dragStep() { return step === "place" || step === "done" || step === "gallery" || step === "shop"; }
  function draggable(pk) { return !!pk && !!cur && dragStep(); }
  function onPointerDown(e) {
    if (!cur || !lastFit || !dragStep() || !save.theme) return;
    var pt = canvasScenePt(e); if (!pt) return;
    if (e.button === 2) return;                                             /* right button: contextmenu turns the piece */
    var pk = hitPick(pt), cell = pxToCell(pt.x, pt.y), wpt = unrotPt(cell.u, cell.v);
    if (pk) {
      cur.drag = { pk: pk, id: e.pointerId, du: wpt.x - pk.cx, dv: wpt.y - pk.cy, cx: pk.cx, cy: pk.cy, ok: true, moved: false, sx: e.clientX, sy: e.clientY };
    } else {
      cur.pan = { id: e.pointerId, sx: e.clientX, sy: e.clientY, px: view().px || 0, py: view().py || 0, moved: false };
    }
    try { ui.canvas.setPointerCapture(e.pointerId); } catch (err) {}
    e.preventDefault();
    redraw();
  }
  function onPointerMove(e) {
    if (!cur) return;
    if (cur.pan && cur.pan.id === e.pointerId) {
      var r = ui.canvas.getBoundingClientRect(), k = ui.canvas._w / (r.width || 1), pn = cur.pan;
      var dx = (e.clientX - pn.sx) * k, dy = (e.clientY - pn.sy) * k;
      if (Math.abs(e.clientX - pn.sx) + Math.abs(e.clientY - pn.sy) > 4) pn.moved = true;
      if (!pn.moved) return;
      view().px = pn.px + dx; view().py = pn.py + dy;
      e.preventDefault(); redraw(); return;
    }
    if (!cur.drag || cur.drag.id !== e.pointerId) return;
    var pt = canvasScenePt(e); if (!pt) return;
    var cell = pxToCell(pt.x, pt.y), wpt = unrotPt(cell.u, cell.v), d = cur.drag, p = pieceById(d.pk.piece), n = cellsOf(p);
    if (Math.abs(e.clientX - d.sx) + Math.abs(e.clientY - d.sy) > 4) d.moved = true;
    var ncx = Math.round(wpt.x - d.du), ncy = Math.round(wpt.y - d.dv);
    if (ncx === d.cx && ncy === d.cy) return;
    d.cx = ncx; d.cy = ncy; d.ok = spotOk(ncx, ncy, n, d.pk, p); d.moved = true;
    e.preventDefault();
    redraw();
  }
  function onPointerUp(e) {
    if (!cur) return;
    try { ui.canvas.releasePointerCapture(e.pointerId); } catch (err) {}
    if (cur.pan && cur.pan.id === e.pointerId) {
      var pn = cur.pan; cur.pan = null;
      if (pn.moved) persist(); else if (cur.sel) { cur.sel = null; fillPieceBar(); }
      redraw(); return;
    }
    if (!cur.drag || cur.drag.id !== e.pointerId) return;
    var d = cur.drag; cur.drag = null;
    if (!d.moved) { cur.sel = cur.sel === d.pk ? null : d.pk; fillPieceBar(); redraw(); return; }
    if (d.ok && (d.cx !== d.pk.cx || d.cy !== d.pk.cy)) { d.pk.cx = d.cx; d.pk.cy = d.cy; persist(); ui.note.textContent = joinedNote(d.pk); if (step === "gallery") ui.badge.textContent = galleryBadge(); }
    else if (!d.ok) ui.note.textContent = isTopper(pieceById(d.pk.piece)) ? "Flags and banners go on top of a tower that has none — it went back." : "That spot is taken — the piece went back.";
    redraw();
  }
  function onWheel(e) {
    if (!cur || !dragStep() || !save.theme) return;
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) { zoomBy(e.deltaY < 0 ? 1.12 : 1 / 1.12); return; }
    var notch = e.deltaMode === 1 ? 1 : (Math.abs(e.deltaY) / 100);
    rotateView((e.deltaY > 0 ? 1 : -1) * Math.max(1, Math.round(3 * Math.min(4, notch))));   /* about 3° per wheel notch: fast turning */
    settleView();
  }
  /* right-click (or the Turn button / R key) turns one piece a quarter turn so it faces the way you want */
  function onContextMenu(e) {
    if (!cur || !lastFit || !dragStep() || !save.theme) { if (cur) e.preventDefault(); return; }
    e.preventDefault();
    var pt = canvasScenePt(e); if (!pt) return;
    var pk = hitPick(pt);
    if (!pk) return;
    cur.drag = null; cur.pan = null;
    turnPick(pk);
  }
  /* v5.2: a wall, gate, hedge or fence looks the same from behind, so it only has two ways to face;
     turning it a half turn looked like nothing happened. Those pieces switch between the two ways. */
  var TWO_WAY = { wall: 1, gate: 1, doorway: 1, hedge: 1, "hedge-gate": 1, "c-fence": 1, "fence-gate": 1, "rail-fence": 1 };
  function turnPick(pk) {
    if (!pk) return;
    var p = pieceById(pk.piece), two = !!(p && p.auto && TWO_WAY[p.id]);
    pk.rot = two ? ((pk.rot || 0) + 1) & 1 : ((pk.rot || 0) + 1) & 3;
    cur.sel = pk; persist(); fillPieceBar(); redraw();
    var joined = two && isRun(p) && runDirs(p, pk.cx, pk.cy, pk).length > 0;
    ui.note.textContent = joined
      ? (p.name + " follows the pieces it joins, so it keeps its line" + (p.id === "stairs-wall" ? "; its stairs moved to the other side." : ". Move it away from them to run it the other way."))
      : two ? (p.name + " now runs the other way. A wall or gate looks the same from behind, so it has two ways to face; right-click (or Turn) again to switch back.")
      : ((p ? p.name : "Piece") + " turned. Right-click (or Turn) again for the next quarter turn.");
  }
  function joinedNote(pk) {
    var p = pieceById(pk.piece), rs = rectsOf(pk), i, n = cellsOf(p), host;
    if (isTopper(p)) { host = pickAt(pk.cx, pk.cy, pk, function (q) { return isHost(q); }); return (p.name || "Flag") + (host ? " flies from the " + (pieceById(host.piece) || {}).name + "." : " is waiting for a tower."); }
    for (i = 0; i < rs.length; i++) if (touches(pk.cx, pk.cy, n, rs[i])) return (p.name || "Piece") + " joined to the " + (pieceById(rs[i].pk.piece) || {}).name + ".";
    return (p.name || "Piece") + " placed on its own.";
  }

  /* ── view controls ───────────────────────────────────────────────────────── */
  function rotateView(deg) { view().a = ((ang() + (deg || 0)) % 360 + 360) % 360; persist(); redraw(); }
  var settleTimer = null;
  /* after fast turning (wheel, held button) a view within 4° of a quarter turn settles onto it, where every wall and hedge lines up */
  function settleView() {
    if (settleTimer) clearTimeout(settleTimer);
    settleTimer = setTimeout(function () {
      settleTimer = null;
      var a = ang(), q = Math.round(a / 90) * 90, d = a - q;
      if (d !== 0 && Math.abs(d) <= 4) rotateView(-d);
    }, 450);
  }
  function zoomBy(k) { view().z = Math.max(ZMIN, Math.min(ZMAX, (view().z || 1) * k)); persist(); redraw(); }
  function resetView() { save.view = freshView(); persist(); redraw(); }

  /* ── selection: recolour, copy, delete ───────────────────────────────────── */
  function selectPick(pk) { if (!cur) return; cur.sel = pk || null; fillPieceBar(); redraw(); }
  function deleteSelected() {
    if (!cur || !cur.sel) return;
    var pk = cur.sel, p = pieceById(pk.piece), i = save.picks.indexOf(pk);
    if (i !== -1) save.picks.splice(i, 1);
    cur.sel = null; if (cur.placedKey === pk) cur.placedKey = null;
    persist(); fillPieceBar(); redraw();
    ui.note.textContent = (p ? p.name : "Piece") + " removed. It stays in your palette — add it back any time.";
    if (step === "gallery") { ui.badge.textContent = galleryBadge(); fillPalette(); }
  }
  function duplicateSelected() {
    if (!cur || !cur.sel) return;
    var pk = cur.sel, p = pieceById(pk.piece);
    if (!p) return;
    var np = addPiece(p, pk.style, "free", { cx: pk.cx, cy: pk.cy });
    if (np && pk.rot) { np.rot = pk.rot; persist(); redraw(); }
  }
  function recolourSelected(styleId) {
    if (!cur || !cur.sel) return;
    cur.sel.style = styleId; persist(); fillPieceBar(); redraw();
  }
  /* Place a copy of an unlocked piece (palette, duplicate, shop re-use). Returns the pick or null. */
  function addPiece(p, style, src, near) {
    var pos = autoPlace(cellsOf(p), null, p, near);
    if (!pos) { ui.note.textContent = "Flags and banners need a tower with no flag yet — build a tower first."; return null; }
    var stageBefore = isKit() ? coreStage() : 0;
    var pk = { night: (cur && cur.night) || 1, piece: p.id, style: style != null ? style : (styleable(p) ? dominantStyle() : ""), src: src || "free", deco: p.role === "deco", ord: save.picks.length, cx: pos.cx, cy: pos.cy, rot: 0 };
    save.picks.push(pk); unlock(p.id);
    var grew = isKit() && !pk.deco && coreStage() > stageBefore && buildingPicks().length > 1;
    var walls = raiseCastleWalls();
    persist();
    if (cur) { cur.sel = pk; fillPieceBar(); }
    redraw();
    ui.note.textContent = walls ? "The curtain walls went up around your castle — drag any wall to reshape them!"
      : grew ? "Your keep grew a storey — " + grownCount() + " pieces strong!"
      : (p.name || "Piece") + " placed — drag it anywhere, or tap it to recolour, copy or remove it.";
    if (step === "gallery") ui.badge.textContent = galleryBadge();
    return pk;
  }

  /* ── canvas sizing: the scene fills whatever space the layout leaves it ───── */
  function layoutCanvas() {
    var cv = ui.canvas, wrap = ui.sceneWrap, r = wrap.getBoundingClientRect(), w = Math.max(160, Math.floor(r.width)), h = Math.max(120, Math.floor(r.height)), dpr;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.style.width = w + "px"; cv.style.height = h + "px";
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    cv._w = w; cv._h = h; cv._dpr = dpr;
    if (ui.canvas3d) { ui.canvas3d.style.width = w + "px"; ui.canvas3d.style.height = h + "px"; }
  }

  /* ── DOM (built once, appended to body) ──────────────────────────────────── */
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function show(n, on) { n.classList.toggle("hidden", !on); }
  function btn(cls, label, title) { var b = el("button", cls, label); b.type = "button"; if (title) b.title = title; return b; }
  function buildDom() {
    if (ui) return;
    ui = {};
    ui.overlay = el("div", "hidden"); ui.overlay.id = "build-overlay";
    ui.overlay.setAttribute("role", "dialog"); ui.overlay.setAttribute("aria-modal", "true"); ui.overlay.setAttribute("aria-hidden", "true");
    ui.card = el("div", "build-card");
    var head = el("div", "build-head"), hl = el("div"), codeLab, loadLab;
    ui.kicker = el("p", "tut-kicker"); ui.title = el("h2"); hl.appendChild(ui.kicker); hl.appendChild(ui.title);
    ui.badge = el("span", "build-badge"); head.appendChild(hl); head.appendChild(ui.badge);
    ui.sub = el("p", "build-sub");
    ui.perks = el("p", "build-perks hidden");
    ui.themes = el("div", "build-themes hidden");
    ui.options = el("div", "build-options hidden");
    ui.styles = el("div", "build-styles hidden");
    ui.tabs = el("div", "build-tabs hidden");
    ui.shop = el("div", "build-options build-shop hidden");
    /* main area: the scene (with view tools and the piece bar floating on it) + the palette */
    ui.main = el("div", "build-main hidden");
    ui.sceneWrap = el("div", "build-scene"); ui.canvas = el("canvas"); ui.sceneWrap.appendChild(ui.canvas);
    ui.canvas3d = el("canvas", "build-3d"); ui.canvas3d.style.pointerEvents = "none"; ui.sceneWrap.appendChild(ui.canvas3d);   /* v5.5: the WebGL view, over the 2D sky, ground and footprints */
    ui.tools = el("div", "build-tools");
    [["⟲", "Turn left 1° (hold to keep turning; mouse wheel turns faster)", function () { rotateView(-1); }, true], ["⟳", "Turn right 1° (hold to keep turning; mouse wheel turns faster)", function () { rotateView(1); }, true],
     ["−", "Zoom out (Ctrl + wheel)", function () { zoomBy(1 / 1.25); }], ["+", "Zoom in (Ctrl + wheel)", function () { zoomBy(1.25); }], ["⤢", "Fit the whole build and face front", resetView]]
      .forEach(function (t) {
        var b = btn("build-tool", t[0], t[1]), timer = null, held = false; b.setAttribute("aria-label", t[1]);
        if (t[3]) {                                                             /* press and hold: keeps turning about 40° a second */
          b.addEventListener("pointerdown", function (e) { e.preventDefault(); held = false; timer = setTimeout(function () { held = true; timer = setInterval(function () { t[2](); }, 25); }, 260); });
          var stop = function () { if (timer) { clearTimeout(timer); clearInterval(timer); timer = null; if (held) settleView(); } };
          b.addEventListener("pointerup", stop); b.addEventListener("pointerleave", stop); b.addEventListener("pointercancel", stop);
          b.addEventListener("click", function (e) { e.preventDefault(); if (!held) t[2](); held = false; });
        } else b.addEventListener("click", function (e) { e.preventDefault(); t[2](); });
        ui.tools.appendChild(b);
      });
    ui.sceneWrap.appendChild(ui.tools);
    ui.pbar = el("div", "build-pbar hidden"); ui.sceneWrap.appendChild(ui.pbar);
    ui.side = el("div", "build-side hidden");
    ui.ptabs = el("div", "build-ptabs"); ui.plist = el("div", "build-plist");
    ui.side.appendChild(ui.ptabs); ui.side.appendChild(ui.plist);
    ui.main.appendChild(ui.sceneWrap); ui.main.appendChild(ui.side);
    ui.note = el("p", "build-note hidden");
    ui.codeWrap = el("div", "build-code hidden");
    codeLab = el("label", "lab", "Build code"); ui.codeOut = el("input"); ui.codeOut.readOnly = true; ui.codeOut.id = "build-code-out"; codeLab.htmlFor = ui.codeOut.id;
    ui.copyBtn = btn("btn", "Copy");
    loadLab = el("label", "lab", "Load code"); ui.codeIn = el("input"); ui.codeIn.id = "build-code-in"; loadLab.htmlFor = ui.codeIn.id;
    ui.codeIn.placeholder = "Paste a build code from another Chromebook"; ui.codeIn.autocomplete = "off"; ui.codeIn.spellcheck = false;
    ui.loadBtn = btn("btn", "Load");
    ui.codeMsg = el("p", "build-msg");
    [codeLab, ui.codeOut, ui.copyBtn, loadLab, ui.codeIn, ui.loadBtn, ui.codeMsg].forEach(function (n) { ui.codeWrap.appendChild(n); });
    ui.row = el("div", "row build-row");
    [head, ui.sub, ui.perks, ui.themes, ui.options, ui.styles, ui.tabs, ui.shop, ui.main, ui.note, ui.codeWrap, ui.row].forEach(function (n) { ui.card.appendChild(n); });
    ui.overlay.appendChild(ui.card);
    document.body.appendChild(ui.overlay);

    ui.overlay.addEventListener("pointerdown", function (e) { if (e.target === ui.overlay) e.preventDefault(); });
    ui.canvas.addEventListener("pointerdown", onPointerDown);
    ui.canvas.addEventListener("pointermove", onPointerMove);
    ui.canvas.addEventListener("pointerup", onPointerUp);
    ui.canvas.addEventListener("pointercancel", onPointerUp);
    ui.canvas.addEventListener("wheel", onWheel, { passive: false });
    ui.canvas.addEventListener("contextmenu", onContextMenu);
    ui.copyBtn.addEventListener("click", copyCode);
    ui.loadBtn.addEventListener("click", doLoad);
    ui.codeIn.addEventListener("input", function () { if (cur) cur.confirmLoad = false; ui.loadBtn.textContent = "Load"; ui.codeMsg.textContent = ""; });
    window.addEventListener("resize", function () { if (mode && !ui.main.classList.contains("hidden")) { layoutCanvas(); redraw(); } });
  }
  function setButtons(list) {
    ui.row.innerHTML = ""; ui.primary = null;
    list.forEach(function (b) {
      var n = btn("btn" + (b.primary ? " primary" : ""), b.label);
      n.disabled = !!b.disabled;
      n.addEventListener("click", function (e) { e.preventDefault(); if (!n.disabled && b.onTap) b.onTap(); });
      if (b.primary) ui.primary = n;
      ui.row.appendChild(n);
    });
  }
  function selectIn(container, node) { Array.prototype.forEach.call(container.children, function (c) { c.classList.toggle("selected", c === node); }); }

  function fillThemes() {
    ui.themes.innerHTML = "";
    var ids = Object.keys(themes()); if (!ids.length) ids = THEME_ORDER;
    ids.forEach(function (id) {
      var b = btn("build-theme"), cv = el("canvas"), t = themeDef(id);
      cv.width = 320; cv.height = 180; paintBg(cv.getContext("2d"), 320, 180, id);
      b.appendChild(cv); b.appendChild(el("span", "name", "My " + themeName(id)));
      b.appendChild(el("span", "meta", (t && t.desc) || THEME_BLURB[id] || ""));
      b.addEventListener("click", function () {
        if (step !== "theme" || !cur || !ui.primary) return;
        cur.themePick = id; selectIn(ui.themes, b);
        ui.primary.disabled = false; ui.primary.textContent = "Start my " + themeName(id);
      });
      ui.themes.appendChild(b);
    });
  }
  function picFor(p, style) {
    var pic = el("div", "pic");
    if (isKit() && (p.parts || p.auto || p.grow)) { pic.appendChild(stackThumb(p, style)); return pic; }
    var img = new Image(), name = p.name || p.id;
    img.alt = ""; img.onerror = function () { pic.innerHTML = ""; pic.appendChild(el("span", "ph", name)); };
    img.src = imgFor(p, style); pic.appendChild(img);
    return pic;
  }
  function optionCard(p, style, name, meta) {
    var b = btn("build-opt");
    b.appendChild(picFor(p, style)); b.appendChild(el("span", "name", name)); if (meta) b.appendChild(el("span", "meta", meta));
    return b;
  }
  function fillOptions() {
    ui.options.innerHTML = "";
    var dom = dominantStyle();
    cur.offer.forEach(function (p) {
      var b = optionCard(p, dom, p.name || p.id, p.desc || "");
      b.addEventListener("click", function () {
        if (step !== "pick" || !cur || !ui.primary) return;
        cur.piece = p; selectIn(ui.options, b);
        ui.primary.disabled = false; ui.primary.textContent = "Choose the " + (p.name || p.id);
      });
      ui.options.appendChild(b);
    });
  }
  function fillStyles() {
    ui.styles.innerHTML = "";
    var dom = dominantStyle(), partner = partnerStyle(dom), first = !buildingPicks().length;
    stylesOf().forEach(function (st) {
      var meta = st.desc || "", tag = "";
      if (!first && st.id === dom) tag = "Same as most of your " + themeName(save.theme).toLowerCase();
      else if (!first && st.id === partner) tag = "Matches your " + styleName(dom);
      var swatch = cur.piece;
      if (isKit() && !styleable(cur.piece) && kitData().sprites["towerSquareTopRoofHigh_NE"]) swatch = { parts: ["towerSquareTopRoofHigh_NE"], name: cur.piece.name };
      var b = optionCard(swatch, st.id, st.name, meta + (tag ? " · " + tag : ""));
      if (tag) b.appendChild(el("span", "match", tag));
      b.addEventListener("click", function () {
        if (step !== "style" || !cur || !ui.primary) return;
        cur.stylePick = st.id; selectIn(ui.styles, b);
        ui.primary.disabled = false; ui.primary.textContent = (cur.shop ? "Buy and build it in " : "Build it in ") + st.name;
        redraw();
      });
      ui.styles.appendChild(b);
      if (st.id === (cur.stylePick || dom)) { cur.stylePick = st.id; selectIn(ui.styles, b); }
    });
  }
  function styleSummary() {
    var count = {}, parts = [];
    save.picks.forEach(function (p) { count[p.style] = (count[p.style] || 0) + 1; });
    stylesOf().forEach(function (s) { if (count[s.id]) parts.push(count[s.id] + " " + s.name); });
    return parts.join(" · ");
  }
  function galleryBadge() {
    var rt = save.theme && loadState === "ok" ? rating() : null;
    return (isKit() && rt ? rt.rank + " · " + rt.score + " pts · " : rewardsTaken() + " / " + TOTAL + " · ") + coinLabel();
  }

  /* ── the editor (gallery): palette, piece bar ────────────────────────────── */
  function paletteItems(tab) {
    return piecesOf(save.theme).filter(function (p) { return catOf(p) === tab; })
      .sort(function (a, b) { return (owned(b.id) - owned(a.id)) || ((a.tier || 1) - (b.tier || 1)) || priceOf(a) - priceOf(b); });
  }
  function fillPalette() {
    if (!save.theme) { ui.ptabs.innerHTML = ""; ui.plist.innerHTML = ""; return; }
    var tabs = themeTabs(), tab = cur.ptab, dom = dominantStyle();
    if (!tabs.some(function (t) { return t[0] === tab; })) tab = cur.ptab = tabs[0][0];
    ui.ptabs.innerHTML = "";
    tabs.forEach(function (t) {
      var n = paletteItems(t[0]).filter(function (p) { return owned(p.id); }).length;
      var b = btn("build-tab" + (t[0] === tab ? " selected" : ""), t[1] + (n ? " · " + n : ""));
      b.addEventListener("click", function () { cur.ptab = t[0]; fillPalette(); });
      ui.ptabs.appendChild(b);
    });
    ui.plist.innerHTML = "";
    var items = paletteItems(tab);
    if (!items.length) ui.plist.appendChild(el("p", "build-pempty", "Nothing here yet."));
    items.forEach(function (p) {
      var have = owned(p.id), b = btn("build-pitem" + (have ? "" : " locked"));
      b.appendChild(picFor(p, dom)); b.appendChild(el("span", "name", p.name || p.id));
      b.appendChild(el("span", "tag", have ? "Tap to place" : priceOf(p) + " coins"));
      if (perkOf(p.id)) { b.appendChild(el("span", "perkmark", "★ " + perkOf(p.id).name)); b.classList.add("has-perk"); }
      b.title = (p.desc || "") + (perkOf(p.id) ? " " + perkLine(p) : "");
      b.addEventListener("click", function () {
        if (step !== "gallery") return;
        if (have) { addPiece(p, null, "free"); return; }
        ui.note.textContent = (p.name || "That") + " is in the shop for " + priceOf(p) + " coins. Buy it once, place it as often as you like.";
        openShopFromGallery(p.role === "deco" ? "deco" : "build");
      });
      ui.plist.appendChild(b);
    });
  }
  function fillPieceBar() {
    var pk = cur && cur.sel, p = pk && pieceById(pk.piece);
    ui.pbar.innerHTML = "";
    if (!pk || !p || !dragStep()) { show(ui.pbar, false); return; }
    ui.pbar.appendChild(el("span", "name", p.name || p.id));
    if (perkOf(p.id)) ui.pbar.appendChild(el("span", "perk", "★ " + perkOf(p.id).name + ": " + perkOf(p.id).desc));
    if (styleable(p)) stylesOf().forEach(function (st) {
      var c = btn("build-chip" + (pk.style === st.id ? " selected" : ""), "", st.name);
      c.setAttribute("aria-label", st.name); c.setAttribute("data-style", st.id);
      var sw = el("span", "sw"); sw.style.background = STYLE_SWATCH[st.id] || "#8ee0ff"; c.appendChild(sw);
      c.addEventListener("click", function (e) { e.preventDefault(); recolourSelected(st.id); });
      ui.pbar.appendChild(c);
    });
    var turn = btn("btn small", "Turn ↻", "Turn it a quarter turn (right-click or R)"), copy = btn("btn small", "Copy", "Place another one next to it"), del = btn("btn small danger", "Remove", "Take it off the field (it stays in your palette)"), ok = btn("btn small", "Done");
    turn.addEventListener("click", function (e) { e.preventDefault(); turnPick(cur.sel); });
    ui.pbar.appendChild(turn);
    copy.addEventListener("click", function (e) { e.preventDefault(); duplicateSelected(); });
    del.addEventListener("click", function (e) { e.preventDefault(); deleteSelected(); });
    ok.addEventListener("click", function (e) { e.preventDefault(); selectPick(null); });
    ui.pbar.appendChild(copy); ui.pbar.appendChild(del); ui.pbar.appendChild(ok);
    show(ui.pbar, true);
  }
  var STYLE_SWATCH = { blue: "#3d6fd6", red: "#d6403d", green: "#3fa050", gold: "#e0b23a", tile: "#b5452f", slate: "#5c6a7a", thatch: "#c9a453" };
  function openShopFromGallery(tab) {
    cur.shop = true; cur.night = cur.night || 1; cur.tab = tab || "build"; cur.fromGallery = true; cur.sel = null; mode = "shop";
    showStep(save.theme && themeDef(save.theme) ? "shop" : "theme");
  }
  /* v5.6: the perks the castle gives in the maze, listed under the gallery summary */
  function fillPerks() {
    if (!ui.perks) return;
    ui.perks.innerHTML = "";
    if (!save.theme || loadState !== "ok") { show(ui.perks, false); return; }
    var act = activePerks(), ids = {}, missing = [];
    act.forEach(function (a) { ids[a.id] = 1; });
    ui.perks.appendChild(el("span", "lab", act.length ? "Perks in the maze:" : "Perks in the maze: none yet."));
    act.forEach(function (a) {
      var chip = el("span", "chip on", "★ " + a.name);
      chip.title = a.desc + " From: " + a.from.join(", ") + ".";
      ui.perks.appendChild(chip);
    });
    PERKS.forEach(function (pk) {
      if (ids[pk.id]) return;
      var names = pk.pieces.map(function (id) { var pc = pieceById(id); return pc && pc.theme === save.theme ? pc.name : null; }).filter(Boolean);
      if (names.length) missing.push(pk.name + " (" + names[0] + ")");
    });
    if (missing.length) ui.perks.appendChild(el("span", "more", (act.length ? "More to earn: " : "Place one of these to earn a perk: ") + missing.slice(0, 5).join(", ") + (missing.length > 5 ? ", …" : ".")));
    show(ui.perks, true);
  }
  function fillGallery() {
    var next = nextRewardNight(), n = rewardsTaken();
    ui.kicker.textContent = "My build · full-screen editor"; ui.title.textContent = save.theme ? "My " + themeName(save.theme) : "My build";
    ui.sub.textContent = loadState !== "ok" ? "Build data could not be loaded on this page." :
      !save.theme ? "Tap Shop to choose a Town or a Castle and start building — or win Level 5 for your first free piece." :
      save.picks.length + " pieces on the field · " + Object.keys(save.owned).length + " kinds unlocked · " + n + " of " + TOTAL + " rewards" +
      (styleSummary() ? " (" + styleSummary() + ")" : "") + " · " + (next ? "next reward after level " + next : "every reward earned!");
    fillPerks();
    ui.codeOut.value = exportCode(); ui.codeIn.value = ""; ui.codeMsg.textContent = ""; ui.loadBtn.textContent = "Load";
    ui.badge.textContent = galleryBadge();
    var buttons = [{ label: "Close", primary: true, onTap: function () { var cb = cur && cur.onClose; closeOverlay(); if (cb) cb(); } }];
    if (loadState === "ok") buttons.unshift({ label: "Shop (" + coinLabel() + ")", onTap: function () { openShopFromGallery("build"); } });
    show(ui.side, !!save.theme);
    show(ui.note, true);
    if (save.theme) ui.note.textContent = ui.note.textContent || "Tap a palette piece to place it, drag pieces anywhere, right-click a piece to turn it. Tap a piece to recolour, copy or remove it. Mouse wheel or ⟲ ⟳ turn the view (hold to keep turning), Ctrl + wheel or + − zoom, drag the ground to pan.";
    else ui.note.textContent = "";
    fillPalette(); fillPieceBar();
    setButtons(buttons);
    layoutCanvas(); redraw();
  }

  /* ── steps ───────────────────────────────────────────────────────────────── */
  function showStep(s) {
    step = s;
    var name = cur && cur.piece ? (cur.piece.name || cur.piece.id) : "", lot, tn;
    ui.card.className = "build-card step-" + s;
    show(ui.themes, s === "theme"); show(ui.options, s === "pick"); show(ui.styles, s === "style");
    show(ui.tabs, s === "shop"); show(ui.shop, s === "shop");
    show(ui.main, s === "pick" || s === "style" || s === "place" || s === "done" || s === "gallery" || s === "shop");
    show(ui.side, s === "gallery" && !!save.theme);
    show(ui.tools, s === "gallery" || s === "shop" || s === "place" || s === "done");
    show(ui.note, s === "place" || s === "done" || s === "shop" || s === "gallery"); show(ui.codeWrap, s === "gallery");
    if (s !== "gallery") show(ui.perks, false);
    if (cur) { cur.drag = null; cur.pan = null; if (s !== "place" && s !== "done") cur.placedKey = null; if (!dragStep()) cur.sel = null; }
    ui.note.textContent = "";
    fillPieceBar();
    if (s === "gallery") { fillGallery(); return; }
    if (s === "shop") { fillShop(); return; }
    tn = themeName(save.theme || (cur && cur.themePick) || "village");
    ui.badge.textContent = cur.shop ? coinLabel() : "REWARD";
    ui.kicker.textContent = cur.shop ? "Level " + cur.night + " · shop" : "Level " + cur.night + " reward · piece " + cur.k + " of " + TOTAL;
    if (s === "theme") {
      ui.kicker.textContent = cur.shop ? "Level " + cur.night + " · shop" : "Level " + cur.night + " reward · your first building";
      ui.title.textContent = "Build a Town or a Castle?";
      ui.sub.textContent = cur.shop ? "Your coins buy pieces for one build, and you earn a free reward piece every 5 levels, all the way to level 100. This choice is permanent."
        : "You add a new piece every 5 levels, all the way to level 100. This choice is permanent.";
      var themeBtns = [{ label: "Tap one to choose", primary: true, disabled: true, onTap: function () {
        if (!cur.themePick) return; save.theme = cur.themePick; save.kit = 2; save.view = freshView(); persist();
        if (cur.shop) { cur.tab = "build"; showStep("shop"); } else beginPick();
      } }];
      if (cur.shop) themeBtns.push({ label: "Not now", onTap: function () { if (cur.fromGallery) { mode = "gallery"; cur.shop = false; showStep("gallery"); return; } var cb = cur && cur.onClose; closeOverlay(); if (cb) cb(); } });
      setButtons(themeBtns);
      fillThemes();
    } else if (s === "pick") {
      lot = lotFor(cur.k);
      ui.title.textContent = cur.k === 1 ? "Choose your first building" : "Add a piece to your " + tn;
      ui.sub.textContent = cur.k === 1 ? "Every " + tn.toLowerCase() + " starts with a home. You pick its style next; once earned, a piece can be placed as often as you like."
        : (isKit() ? "" : (KIND_HINT[lot.kind] || "") + " ") + "Tap one of the three, then pick its style. Earned pieces stay in your palette for good.";
      setButtons([{ label: "Tap a piece first", primary: true, disabled: true, onTap: beginStyle }]);
      fillOptions(); if (save.theme) { layoutCanvas(); redraw(); }
    } else if (s === "style") {
      ui.title.textContent = "Which style for the " + name + "?";
      ui.sub.textContent = !buildingPicks().length ? "Pieces in the same style match; the game will also suggest a style that goes with yours."
        : "Keep your look, or mix in a second style that matches." + (cur.shop ? " Costs " + priceOf(cur.piece) + " coins once — then place it as often as you like." : "");
      setButtons([{ label: "Back", onTap: function () { showStep(cur.shop ? "shop" : "pick"); } },
        { label: cur.shop ? "Buy and build it" : "Build it", primary: true, disabled: !cur.stylePick, onTap: place }]);
      fillStyles(); layoutCanvas(); redraw();
    } else if (s === "place") {
      ui.title.textContent = "Where does the " + name + " go?";
      ui.sub.textContent = "Drag it (finger or mouse) anywhere — joined to the rest or on its own. You can move, recolour or remove any other piece too. Tap Keep it here when you like it.";
      ui.note.textContent = cur.placedKey ? joinedNote(cur.placedKey) : "";
      setButtons([{ label: "Keep it here", primary: true, onTap: function () { showStep("done"); } }]);
      layoutCanvas(); redraw();
    } else if (s === "done") {
      var nb = buildingPicks().length;
      ui.title.textContent = name + (cur.stylePick && styleable(cur.piece) ? " built in " + styleName(cur.stylePick) : " built") + "!" + (isKit() ? " " + rating().rank + " · " + rating().score + " pts" : "");
      ui.sub.textContent = cur.shop ? "Bought for " + priceOf(cur.piece) + " coins. " + coinLabel() + " left. It is unlocked — place more copies from your palette any time."
        : "Reward " + cur.k + " of " + TOTAL + " is in place and unlocked in your palette." + (cur.k < TOTAL ? " Next reward after level " + (cur.night + EVERY) + "." : " Every reward earned!");
      ui.note.textContent = cur.wallsRaised ? "The curtain walls went up around your castle — drag any wall to reshape them!"
        : cur.keepGrew ? "Your keep grew a storey — " + grownCount() + " pieces strong!"
        : nb === wallLevel() - 1 && isKit() ? "One more building and the walls go up."
        : "Added to your " + tn + "! Open My " + tn + " from the title screen to keep building.";
      setButtons(cur.shop ? [{ label: "Back to shop", primary: true, onTap: function () { cur.piece = null; cur.stylePick = null; showStep("shop"); } }]
        : [{ label: "Continue", primary: true, onTap: finish }]);
      layoutCanvas(); redraw();
    }
    if (ui.primary && !ui.primary.disabled) { try { ui.primary.focus(); } catch (e) {} }
  }
  function beginPick() {
    cur.offer = offerFor(cur.night, cur.k);
    if (!cur.offer.length) { console.warn("[SolBuild] no pieces for theme " + save.theme); finish(); return; }
    showStep("pick");
  }
  function beginStyle() {
    if (!cur || !cur.piece) return;
    if (!stylesOf().length || !styleable(cur.piece)) { cur.stylePick = styleable(cur.piece) ? cur.stylePick : ""; place(); return; }
    if (!cur.stylePick) cur.stylePick = dominantStyle();
    showStep("style");
  }
  function place() {
    if (!cur || !cur.piece) return;
    if (cur.shop) {
      if (!owned(cur.piece.id)) {
        var cost = priceOf(cur.piece);
        if (save.coins < cost) { ui.note.textContent = "Not enough coins."; return; }
        save.coins -= cost;
      }
    } else if (save.rewards[cur.night]) return;
    var stageBefore = isKit() ? coreStage() : 0;
    var pos = autoPlace(cellsOf(cur.piece), null, cur.piece) || autoPlace(1, null, null);
    var pk = { night: cur.night, piece: cur.piece.id, style: cur.stylePick || (styleable(cur.piece) ? defaultStyle() : ""), src: cur.shop ? "shop" : "reward", deco: cur.piece.role === "deco", ord: save.picks.length, cx: pos.cx, cy: pos.cy };
    save.picks.push(pk); cur.placedKey = pk; unlock(cur.piece.id);
    if (!cur.shop) save.rewards[cur.night] = cur.piece.id;
    cur.keepGrew = isKit() && coreStage() > stageBefore && buildingPicks().length > 1;
    cur.wallsRaised = raiseCastleWalls();
    persist();
    showStep("place");
  }
  /* Castle: at the wall level a curtain wall (real, movable wall picks with one gate) goes up one cell out from everything built so far. */
  function raiseCastleWalls() {
    if (!isKit() || grownCount() < wallLevel() || save.picks.some(function (pk) { return pk.src === "auto"; })) return false;
    var b = bboxCells(), wall = pieceById("wall"), gate = pieceById("gate"), dom = dominantStyle(), u, v, n = 0;
    if (!b || !wall) return false;
    var u0 = b.u0 - 1, v0 = b.v0 - 1, u1 = b.u1, v1 = b.v1, gateAt = Math.floor((v0 + v1) / 2);
    function add(cx, cy, piece) {
      if (!spotFree(cx, cy, 1, null)) return;
      save.picks.push({ night: cur ? cur.night : 1, piece: piece.id, style: dom, src: "auto", deco: false, ord: save.picks.length, cx: cx, cy: cy }); n++;
    }
    for (u = u0; u <= u1; u++) { add(u, v0, wall); add(u, v1, wall); }
    for (v = v0 + 1; v < v1; v++) { add(u0, v, wall); add(u1, v, (gate && v === gateAt) ? gate : wall); }
    if (n) { unlock("wall"); if (gate) unlock("gate"); }
    return n > 0;
  }
  function coinLabel() { return (save.coins || 0) + " coin" + (save.coins === 1 ? "" : "s"); }
  /* Castle rating: piece scores (the first few copies of a piece count in full, more copies a quarter),
     plus 12 per courtyard cell fully enclosed by walls and towers (capped), plus the keep's growth. */
  function rating() {
    var total = 0, t = themeDef(save.theme), rs = rectsOf(), b = bboxCells(), blocked = {}, seen = {}, enclosed = 0, q, key, x, y, i, counts = {};
    var stage = isKit() ? coreStage() : 0;
    save.picks.forEach(function (pk) {
      var p = pieceById(pk.piece); if (!p) return;
      counts[p.id] = (counts[p.id] || 0) + 1;
      var sc = (p.score || Math.round(priceOf(p) / 3)) + (p.grow ? stage * 20 : 0);
      total += counts[p.id] <= DUP_FULL ? sc : sc * 0.25;
    });
    total = Math.round(total);
    if (isKit() && b && rs.length > 3) {
      rs.forEach(function (r) { if (r.p.kind !== "prop") blocked[r.cx + "," + r.cy] = true; });
      var u0 = b.u0 - 1, v0 = b.v0 - 1, u1 = b.u1, v1 = b.v1;
      q = [[u0, v0]]; seen[u0 + "," + v0] = true;
      while (q.length) {
        var c = q.pop();
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) {
          x = c[0] + d[0]; y = c[1] + d[1]; key = x + "," + y;
          if (x < u0 || x > u1 || y < v0 || y > v1 || seen[key] || blocked[key]) return;
          seen[key] = true; q.push([x, y]);
        });
      }
      for (x = b.u0; x < b.u1; x++) for (y = b.v0; y < b.v1; y++) if (!blocked[x + "," + y] && !seen[x + "," + y]) enclosed++;
      total += Math.min(240, enclosed * 12);
    }
    var ranks = (t && t.ranks) || [[0, "Camp"]], name = ranks[0][1];
    for (i = 0; i < ranks.length; i++) if (total >= ranks[i][0]) name = ranks[i][1];
    return { score: total, rank: name, enclosed: enclosed };
  }

  /* ── the shop: buy a piece once, place it forever ────────────────────────── */
  /* v5: the shop sells every piece from level 1 — coins are the only gate (tiers only shape the free reward offers). */
  function shopBand() { return 4; }
  function shopOffers() {
    var band = shopBand(), t = themeDef(save.theme), builds, decos;
    var order = function (a, b) { return ((a.tier || 1) - (b.tier || 1)) || (priceOf(a) - priceOf(b)) || (a.name > b.name ? 1 : -1); };
    if (isKit()) {
      builds = [pieceById("wall"), pieceById("gate")].filter(Boolean)
        .concat(piecesOf(save.theme, "module").filter(function (p) { return p.id !== "wall" && p.id !== "gate" && (p.tier || 1) <= band; }).sort(order))
        .concat(piecesOf(save.theme, "core").filter(function (p) { return !owned(p.id); }));
      decos = piecesOf(save.theme, "deco").filter(function (p) { return (p.tier || 1) <= band; }).sort(order);
    } else {
      builds = piecesOf(save.theme, "module").filter(function (p) { return (p.tier || 1) <= band; }).sort(order);
      decos = piecesOf(save.theme, "deco").slice().sort(order);
    }
    return { builds: builds, decos: decos, packs: (t && t.packs) || packsList() };
  }
  function packItems(pk) { return (pk.items || []).map(pieceById).filter(Boolean); }
  function packPrice(pk) {
    var total = 0;
    packItems(pk).forEach(function (p) { if (!owned(p.id)) total += priceOf(p); });
    if (!total) return 0;
    return Math.max(5, Math.round(total * (1 - (pk.discount || 0)) / 5) * 5);
  }
  function packContents(pk) { return packItems(pk).map(function (p) { return p.name; }).join(" + "); }
  function buyDeco(p) {
    if (owned(p.id)) { var pk = addPiece(p, null, "free"); return !!pk; }
    var cost = priceOf(p);
    if (save.coins < cost) { ui.note.textContent = "Not enough coins for the " + p.name + "."; return false; }
    var pos = autoPlace(cellsOf(p), null, p);
    if (!pos) { ui.note.textContent = "Every tower already has a flag — build another tower first."; return false; }
    save.coins -= cost;
    save.picks.push({ night: cur.night, piece: p.id, style: styleable(p) ? dominantStyle() : "", src: "shop", deco: true, ord: save.picks.length, cx: pos.cx, cy: pos.cy });
    unlock(p.id); persist(); return true;
  }
  function buyPack(pk) {
    var cost = packPrice(pk), dom = dominantStyle();
    if (!cost) { ui.note.textContent = "You already own everything in the " + pk.name + " — place them from your palette."; return; }
    if (save.coins < cost) { ui.note.textContent = "Not enough coins for the " + pk.name + "."; return; }
    save.coins -= cost;
    packItems(pk).forEach(function (p) {
      var pos = autoPlace(cellsOf(p), null, p) || autoPlace(1, null, null), dec = p.role === "deco";
      unlock(p.id);
      save.picks.push({ night: cur.night, piece: p.id, style: styleable(p) ? dom : "", src: "shop", deco: dec, ord: save.picks.length, cx: pos.cx, cy: pos.cy });
    });
    raiseCastleWalls(); persist();
    ui.note.textContent = pk.name + " bought and unlocked: " + packContents(pk) + ". " + coinLabel() + " left.";
    fillShop(true);
  }
  function fillShop(keepNote) {
    var off = shopOffers(), tab = cur.tab || "build", tn = themeName(save.theme), lastCat = null;
    ui.badge.textContent = coinLabel();
    ui.kicker.textContent = "Level " + cur.night + " · shop";
    ui.title.textContent = "Spend coins on your " + tn;
    ui.sub.textContent = "Buy a piece once and place it as often as you like. Coins come from correct answers (" + economy().answer + " each), a perfect level (+" + economy().perfectNight + ") and bonus pickups. Free reward pieces still come every 5 levels.";
    if (!keepNote) ui.note.textContent = "";
    ui.tabs.innerHTML = "";
    SHOP_TABS.forEach(function (t) {
      var b = btn("build-tab" + (t[0] === tab ? " selected" : ""), t[1]);
      b.addEventListener("click", function () { cur.tab = t[0]; fillShop(); });
      ui.tabs.appendChild(b);
    });
    ui.shop.innerHTML = "";
    var dom = dominantStyle();
    function heading(p) { var c = catOf(p), lab = null, tabs = themeTabs(), i; if (c === lastCat) return; lastCat = c; for (i = 0; i < tabs.length; i++) if (tabs[i][0] === c) lab = tabs[i][1]; if (lab) ui.shop.appendChild(el("h3", "build-shop-h", lab)); }
    function card(p, style, name, meta, price, have, onBuy) {
      var b = optionCard(p, style, name, meta), tag = el("span", "price" + (have ? " own" : save.coins < price ? " short" : ""), have ? "Owned · tap to place" : price + " coins");
      b.appendChild(tag);
      b.addEventListener("click", function () { if (step === "shop") onBuy(); });
      ui.shop.appendChild(b);
    }
    if (tab === "build") {
      ui.note.textContent = ui.note.textContent || (isKit() ? "Walls, hedges and fences turn corners by themselves. Tap a piece to buy it (once) and choose its colour." : "Tap a building to buy it and choose its style.");
      off.builds.forEach(function (p) {
        if (isKit()) heading(p);
        card(p, dom, p.name, p.desc + (perkOf(p.id) ? " ★ " + perkOf(p.id).name + ": " + perkOf(p.id).desc : ""), priceOf(p), owned(p.id), function () {
          if (owned(p.id)) { if (addPiece(p, null, "free")) fillShop(true); return; }
          if (save.coins < priceOf(p)) { ui.note.textContent = "Not enough coins for the " + p.name + " (" + priceOf(p) + ")."; return; }
          cur.piece = p; cur.stylePick = dom; if (styleable(p)) showStep("style"); else place();
        });
      });
    } else if (tab === "deco") {
      ui.note.textContent = ui.note.textContent || (isKit() ? "Flags fly from towers. Trees, flowers, statues, animals and village life go anywhere on the field." : "Decorations go in the yard between your buildings.");
      off.decos.forEach(function (p) {
        if (isKit()) heading(p);
        card(p, isKit() ? dom : "", p.name, p.desc, priceOf(p), owned(p.id), function () { if (buyDeco(p)) { if (!owned(p.id)) ui.note.textContent = p.name + " added and unlocked. " + coinLabel() + " left."; fillShop(true); } });
      });
    } else {
      ui.note.textContent = ui.note.textContent || "Packs unlock several pieces at a discount. Pieces you already own are free, so a pack only charges for the new ones.";
      off.packs.forEach(function (pk) {
        var first = packItems(pk)[0];
        if (!first) return;
        var price = packPrice(pk);
        card(first, dom, pk.name, pk.desc + " " + packContents(pk) + ".", price, price === 0, function () { buyPack(pk); });
      });
    }
    setButtons([{ label: cur.fromGallery ? "Back to my " + tn : "Done", primary: true, onTap: function () {
      if (cur.fromGallery) { mode = "gallery"; cur.shop = false; cur.fromGallery = false; showStep("gallery"); return; }
      var cb = cur && cur.onClose; closeOverlay(); if (cb) cb();
    } }]);
    layoutCanvas(); redraw();
  }
  function finish() { var cb = cur && cur.onDone; closeOverlay(); if (cb) cb(); }
  function openOverlay(m) { mode = m; ui.overlay.classList.remove("hidden"); ui.overlay.setAttribute("aria-hidden", "false"); }
  function closeOverlay() {
    mode = null; step = null; cur = null;
    if (ui) { ui.overlay.classList.add("hidden"); ui.overlay.setAttribute("aria-hidden", "true"); }
  }

  /* Keys: during a reward Escape is swallowed; in the editor Escape closes, Delete removes the selected piece. */
  function onKey(e) {
    if (!mode) return;
    var k = e.key || e.code, esc = k === "Escape" || k === "Esc", cb, inInput = e.target === ui.codeIn || e.target === ui.codeOut;
    if (mode === "gallery" || mode === "shop") {
      if (esc) { e.preventDefault(); e.stopPropagation(); if (cur && cur.sel) { selectPick(null); return; } if (cur && cur.fromGallery) { mode = "gallery"; cur.shop = false; cur.fromGallery = false; showStep("gallery"); return; } cb = cur && cur.onClose; closeOverlay(); if (cb) cb(); }
      else if (k === "Enter" && e.target === ui.codeIn) { e.preventDefault(); e.stopPropagation(); doLoad(); }
      else if ((k === "Delete" || k === "Backspace") && !inInput && cur && cur.sel) { e.preventDefault(); e.stopPropagation(); deleteSelected(); }
      else if ((k === "r" || k === "R") && !inInput && cur && cur.sel) { e.preventDefault(); e.stopPropagation(); turnPick(cur.sel); }
      else if ((k === "ArrowLeft" || k === "ArrowRight") && !inInput && dragStep()) { e.preventDefault(); e.stopPropagation(); rotateView((k === "ArrowLeft" ? -1 : 1) * (e.shiftKey ? 15 : 1)); }
      return;
    }
    if (esc) e.preventDefault();
    if ((k === "Delete" || k === "Backspace") && !inInput && cur && cur.sel && dragStep()) { e.preventDefault(); e.stopPropagation(); deleteSelected(); return; }
    if (esc || k === " " || k === "Enter" || k === "Tab") { e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation(); }
  }

  /* ── build-code row ──────────────────────────────────────────────────────── */
  function copyCode() {
    var txt = ui.codeOut.value;
    function done(ok) { ui.copyBtn.textContent = ok ? "Copied!" : "Select + Ctrl+C"; setTimeout(function () { ui.copyBtn.textContent = "Copy"; }, 1600); }
    function fallback() { try { ui.codeOut.focus(); ui.codeOut.select(); done(document.execCommand("copy")); } catch (e) { done(false); } }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function () { done(true); }, fallback);
    else fallback();
  }
  function doLoad() {
    var r = parseCode(ui.codeIn.value);
    ui.codeMsg.className = "build-msg";
    if (!r.ok) { ui.codeMsg.textContent = r.error; ui.codeMsg.className = "build-msg bad"; return; }
    if (save.picks.length && !cur.confirmLoad) {
      cur.confirmLoad = true; ui.loadBtn.textContent = "Yes, replace";
      ui.codeMsg.textContent = "This replaces your current build (" + save.picks.length + " pieces). Tap again to confirm.";
      return;
    }
    cur.confirmLoad = false;
    r = importCode(ui.codeIn.value);
    fillGallery();
    ui.codeMsg.textContent = r.ok ? "Loaded " + r.count + " pieces." : r.error;
    ui.codeMsg.className = "build-msg " + (r.ok ? "ok" : "bad");
  }

  function refreshButton() {
    var b = document.getElementById("btn-build") || document.getElementById("btn-town");
    if (!b) return;
    b.textContent = state().label;
    if (!b._solBuild && b.id === "btn-build") { b._solBuild = true; b.addEventListener("click", function (e) { e.preventDefault(); showGallery(); }); }
  }

  /* ── public API ──────────────────────────────────────────────────────────── */
  function init() {
    if (!save) save = loadSave(); load(); refreshButton();
    if (window.SolBuild3D && !init.td) {
      init.td = true;
      window.SolBuild3D.init({ modelsUrl: "assets/build/models/models.json", cellPx: cellPx, cellH: cellH, angle: ang, kitSprite: kitSprite, spriteRef: spriteRef, getImg: getImg,
        styleDef: styleDef, runPlan: runPlan, redraw: scheduleDraw });
    }
  }
  function rewardDue(night) {
    night = parseInt(night, 10);
    if (!save) save = loadSave();
    return night > 0 && night % EVERY === 0 && night <= EVERY * TOTAL && !save.rewards[night];
  }
  function showReward(night, onDone) {
    night = parseInt(night, 10);
    init();
    whenReady(function () {
      if (mode || loadState !== "ok" || !rewardDue(night)) { if (onDone) onDone(); return; }
      buildDom();
      cur = { night: night, k: night / EVERY, band: bandFor(night / EVERY), onDone: onDone || null,
        offer: null, piece: null, stylePick: null, themePick: null, shop: false, sel: null };
      openOverlay("reward");
      if (save.theme && themeDef(save.theme)) beginPick(); else showStep("theme");
    });
  }
  function showGallery(onClose) {
    init();
    whenReady(function () {
      if (mode === "reward") return;
      buildDom();
      cur = { onClose: onClose || null, confirmLoad: false, night: 1, sel: null, ptab: null };
      openOverlay("gallery");
      showStep("gallery");
    });
  }
  function showShop(night, onClose) {
    night = parseInt(night, 10) || 1;
    init();
    whenReady(function () {
      if (mode === "reward") return;
      if (loadState !== "ok") { if (onClose) onClose(); return; }
      buildDom();
      cur = { onClose: onClose || null, night: night, shop: true, tab: "build", piece: null, stylePick: null, themePick: null, sel: null };
      openOverlay("shop");
      showStep(save.theme && themeDef(save.theme) ? "shop" : "theme");
    });
  }
  function addCoins(n, why) {
    if (!save) save = loadSave();
    n = parseInt(n, 10) || 0;
    save.coins = Math.max(0, (save.coins || 0) + n);
    persist();
    if (mode && ui) ui.badge.textContent = mode === "reward" ? ui.badge.textContent : (step === "gallery" ? galleryBadge() : coinLabel());
    return save.coins;
  }
  function coins() { if (!save) save = loadSave(); return save.coins || 0; }
  function state() {
    if (!save) save = loadSave();
    var nm = save.theme ? themeName(save.theme) : null, nb = save.picks.filter(function (p) { return !p.deco; }).length;
    return { theme: save.theme, themeName: nm, count: rewardsTaken(), total: TOTAL,
      buildings: nb, decorations: save.picks.length - nb, owned: Object.keys(save.owned || {}).length, coins: save.coins || 0, canShop: loadState === "ok",
      nextNight: nextRewardNight(), label: "My " + (nm || "Town"), loaded: loadState, walls: wallsUp(), style: save.theme ? dominantStyle() : null,
      view: { r: rot(), a: ang(), z: view().z }, rating: save.theme && loadState === "ok" ? rating() : null };
  }

  document.addEventListener("keydown", onKey, true);

  window.SolBuild = {
    init: init, rewardDue: rewardDue, showReward: showReward, showGallery: showGallery, showShop: showShop,
    addCoins: addCoins, coins: coins, economy: economy,
    close: closeOverlay, isOpen: function () { return !!mode; },
    exportCode: exportCode, importCode: importCode, state: state,
    perks: activePerks, perkOf: perkOf, perkTable: function () { return PERKS.slice(); },
    LS_KEY: LS_KEY, version: 5,
    /* test hooks (tools/smoke.js) */
    _offer: function (night) { return offerFor(night, night / EVERY).map(function (p) { return p.id; }); },
    _coreStage: function () { return isKit() ? coreStage() : null; },
    _reload: function () { save = loadSave(); try { migrateIfNeeded(); } catch (e) {} return state(); },
    _owned: function () { return Object.keys(save.owned || {}).filter(function (k) { return save.owned[k]; }); },
    _place: function (id) { var p = pieceById(id); return p && cur ? !!addPiece(p, null, "free") : false; },
    _select: function (i) { if (!cur) return false; selectPick(save.picks[i] || null); return !!cur.sel; },
    _delete: function () { deleteSelected(); return save.picks.length; },
    _rotate: function (deg) { rotateView(deg); return rot(); },
    _angle: function () { return ang(); },
    _probe: function (x, y, z) { var f = lastFit, c = worldPx(x, y), td = window.SolBuild3D; if (!f) return null; return { x2: f.ox + (c.x) * f.s / f.base, y2: f.oy + (c.y - (z || 0) * cellH()) * f.s / f.base, p3: td ? td.project(x, y, z || 0) : null, use3d: !!(td && td.ready() && ui.canvas3d.style.display !== "none") }; },
    _loads3d: function () { return window.SolBuild3D ? window.SolBuild3D._loads() : null; },
    _force2d: function (on) { redraw.force2d = !!on; redraw(); return !!redraw.force2d; },
    _turn: function () { turnPick(cur && cur.sel); return cur && cur.sel ? cur.sel.rot : null; },
    _zoom: function (k) { zoomBy(k); return view().z; },
    _hitAt: function (clientX, clientY) { var pt = canvasScenePt({ clientX: clientX, clientY: clientY }); var pk = pt && hitPick(pt); return { pt: pt && { x: pt.x, y: pt.y, sx: pt.sx, sy: pt.sy }, cell: pt && pxToCell(pt.x, pt.y), pick: pk ? pk.piece + "@" + pk.cx + "," + pk.cy : null, step: step, draggable: draggable(pk) }; },
    _pickScreen: function (i) {
      var pk = save && save.picks[i], p = pk && pieceById(pk.piece), fit = lastFit;
      if (!pk || !p || !fit || pk.cx == null) return null;
      var it = itemFor(p, pk, pk.cx, pk.cy, ""), r = ui.canvas.getBoundingClientRect();
      return { x: r.left + (fit.ox + it.x * fit.s / fit.base) * (r.width / ui.canvas._w), y: r.top + (fit.oy + it.y * fit.s / fit.base) * (r.height / ui.canvas._h) - 4, cx: pk.cx, cy: pk.cy };
    }
  };
})();
