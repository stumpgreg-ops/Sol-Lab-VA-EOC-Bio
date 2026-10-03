/* SOL Lab — the Canvas / single-file loader, shared with the SOL Labyrinth backbone (v5.8.2 tools/build-canvas.js).
   tools/build-canvas.js prepends window.SOL_CANVAS_ID and window.SOL_PARTS = { manifest, files } and writes the
   result as <name>-game.js next to a small starter page; each data file calls solPart(i, hash, base64).
   Algebra change: a request for a file the bundle leaves out on purpose (assets/music/…) answers with an empty
   data: URL instead of leaving the page, so a Canvas folder is never asked for files that are not there. */
/* SOL Labyrinth — Apps Script loader (tools/build-appsscript.js puts this in loader.html).
   v5.8.1: also the Canvas loader (tools/build-canvas.js): there the manifest and the gzip bundle sit inside the
   page itself (<script id="sol-manifest"> and <script class="sol-part">s, base64), so the one HTML file needs no
   server at all (v5.8.2: or in data files next to a small starter page, see loadParts), and the game's saves get their own prefix in localStorage (see canvasStorage).
   Asks the Apps Script server (google.script.run) for the manifest and the bundle's parts, keeps the bundle in
   IndexedDB so each Chromebook downloads a version once, unpacks it in memory, and makes every request the game
   makes for assets/…, js/… or css/… answer from memory: fetch, XMLHttpRequest, <img src> (property, attribute
   and innerHTML) and CSS url(). Then it adds the page markup and runs the game's scripts in their original order. */
(function () {
  "use strict";
  var bootEl = document.getElementById("sol-boot");
  var fillEl = bootEl.querySelector(".fill"), msgEl = bootEl.querySelector(".msg");
  function say(t) { msgEl.textContent = t; }
  function bar(f) { fillEl.style.width = Math.max(0, Math.min(100, Math.round(f * 100))) + "%"; }
  function failed(e) {
    say("The game could not load (" + ((e && e.message) || e) + "). Check the internet connection and try again.");
    var b = document.createElement("button"); b.textContent = "Try again";
    b.onclick = function () { location.reload(); };
    bootEl.appendChild(b);
    try { console.error("[SOL loader]", e); } catch (x) {}
  }
  window.SOL_STATE = window.SOL_STATE || null;
  window.SOL_NO_MUSIC = true;
  var INLINE = document.querySelectorAll("script.sol-part");
  INLINE = INLINE.length ? INLINE : null;
  /* v5.8.2: the Canvas build in files: a small starter page and data files next to it in the same Canvas folder,
     read with relative <script src>s (Canvas runs a small page's scripts but not a big one's). SOL_PARTS =
     { manifest, files: [...] }; each data file calls solPart(i, version hash, base64). Behaves like the one-file build. */
  var PARTS = window.SOL_PARTS || null;
  if (PARTS) INLINE = true;
  if (INLINE) window.SOL_CANVAS = true; else window.SOL_APPSSCRIPT = true;

  /* ── server calls ── */
  function server(fn, arg) {
    return new Promise(function (ok, bad) {
      var r = google.script.run.withSuccessHandler(ok).withFailureHandler(function (e) { bad(e instanceof Error ? e : new Error(String((e && e.message) || e))); });
      if (arg === undefined) r[fn](); else r[fn](arg);
    });
  }
  /* a busy class can hit Apps Script's limit on calls at once: wait a moment and ask again */
  function retry(make, tries) {
    return make().catch(function (e) {
      if (tries <= 1) throw e;
      return new Promise(function (r) { setTimeout(r, 1500 + Math.random() * 3500); }).then(function () { return retry(make, tries - 1); });
    });
  }
  function unb64(s) {
    var bin = atob(s), n = bin.length, u = new Uint8Array(n), i;
    for (i = 0; i < n; i++) u[i] = bin.charCodeAt(i);
    return u;
  }

  /* ── IndexedDB: { manifest, gz } of the last version that loaded ── */
  var DB = "sol-labyrinth-appsscript", STORE = "bundle";
  function idb() {
    return new Promise(function (ok, bad) {
      var q; try { q = indexedDB.open(DB, 1); } catch (e) { bad(e); return; }
      q.onupgradeneeded = function () { q.result.createObjectStore(STORE); };
      q.onsuccess = function () { ok(q.result); };
      q.onerror = function () { bad(q.error); };
    });
  }
  function cacheGet() {
    return idb().then(function (db) {
      return new Promise(function (ok) {
        var q = db.transaction(STORE, "readonly").objectStore(STORE).get("last");
        q.onsuccess = function () { ok(q.result || null); }; q.onerror = function () { ok(null); };
      });
    }).catch(function () { return null; });
  }
  function cachePut(v) {
    return idb().then(function (db) {
      return new Promise(function (ok) {
        var t = db.transaction(STORE, "readwrite"); t.objectStore(STORE).put(v, "last");
        t.oncomplete = ok; t.onerror = ok; t.onabort = ok;
      });
    }).catch(function () {});
  }

  /* ── get the bundle (gzip bytes) for the newest version ── */
  function download(man) {
    var parts = man.parts, got = new Array(parts.length), done = 0, next = 0;
    say("Downloading the game (" + (man.bytes / 1048576).toFixed(1) + " MB, only the first time)…");
    function one() {
      if (next >= parts.length) return Promise.resolve();
      var i = next++;
      return retry(function () { return server("solPart", parts[i]); }, 5).then(function (b64) {
        got[i] = unb64(b64); done++; bar(0.1 + 0.8 * done / parts.length);
        return one();
      });
    }
    return Promise.all([one(), one()]).then(function () {
      var gz = new Uint8Array(man.bytes), off = 0;
      got.forEach(function (u) { gz.set(u, off); off += u.length; });
      if (off !== man.bytes) throw new Error("download was incomplete");
      return gz;
    });
  }
  function getBundle() {
    bar(0.03);
    if (PARTS) return loadParts();
    if (INLINE) {
      var man = JSON.parse(document.getElementById("sol-manifest").textContent);
      var gz = new Uint8Array(man.bytes), off = 0;
      for (var i = 0; i < INLINE.length; i++) {
        var u = unb64(INLINE[i].textContent.replace(/\s+/g, ""));
        if (off + u.length > gz.length) break;
        gz.set(u, off); off += u.length;
        INLINE[i].textContent = "";   /* free the text copy */
      }
      if (off !== man.bytes) return Promise.reject(new Error("the file is incomplete: upload it again"));
      return Promise.resolve({ man: man, gz: gz });
    }
    return cacheGet().then(function (cached) {
      return retry(function () { return server("solManifest"); }, 4).then(function (t) { return JSON.parse(t); }, function (e) {
        if (cached) return cached.manifest;   /* the server is unreachable: play the version this Chromebook already has */
        throw e;
      }).then(function (man) {
        bar(0.08);
        if (cached && cached.manifest.hash === man.hash) return { man: man, gz: new Uint8Array(cached.gz) };
        return download(man).then(function (gz) {
          return cachePut({ manifest: man, gz: gz.buffer }).then(function () { return { man: man, gz: gz }; });
        });
      });
    });
  }
  /* the data files, two at a time, each a <script src> relative to the page (so Canvas finds it in the page's folder) */
  function loadParts() {
    var man = PARTS.manifest, files = PARTS.files, got = new Array(files.length), done = 0, next = 0;
    window.solPart = function (i, h, s) { if (h === man.hash) got[i] = s; };
    say("Opening the game files…");
    function one() {
      if (next >= files.length) return Promise.resolve();
      var i = next++;
      return new Promise(function (ok, bad) {
        var sc = document.createElement("script");
        sc.src = files[i];
        sc.onload = function () {
          if (typeof got[i] !== "string") { bad(new Error(files[i] + " is not this version's file: upload it again")); return; }
          done++; bar(0.1 + 0.8 * done / files.length); ok();
        };
        sc.onerror = function () { bad(new Error("can't find " + files[i] + ": upload it to the same folder as this page, with the same name")); };
        document.head.appendChild(sc);
      }).then(one);
    }
    return Promise.all([one(), one()]).then(function () {
      var gz = new Uint8Array(man.bytes), off = 0;
      for (var i = 0; i < got.length; i++) {
        var u = unb64(got[i]);
        if (off + u.length > gz.length) { off = -1; break; }
        gz.set(u, off); off += u.length; got[i] = null;
      }
      if (off !== man.bytes) throw new Error("the game files don't match each other: upload them all again");
      return { man: man, gz: gz };
    });
  }
  function gunzip(gz) {
    if (typeof DecompressionStream === "undefined") return Promise.reject(new Error("this browser is too old"));
    var s = new Blob([gz]).stream().pipeThrough(new DecompressionStream("gzip"));
    return new Response(s).arrayBuffer().then(function (b) { return new Uint8Array(b); });
  }

  /* ── the unpacked files ── */
  var bytes = null, index = {}, urls = {};
  var TYPES = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", svg: "image/svg+xml", webp: "image/webp",
    json: "application/json", js: "text/javascript", css: "text/css", html: "text/html", glb: "model/gltf-binary",
    gltf: "model/gltf+json", obj: "text/plain", mtl: "text/plain", txt: "text/plain", mp3: "audio/mpeg", woff2: "font/woff2", woff: "font/woff" };
  function unpack(raw) {
    var hl = ((raw[0] << 24) | (raw[1] << 16) | (raw[2] << 8) | raw[3]) >>> 0;
    var head = JSON.parse(new TextDecoder().decode(raw.subarray(4, 4 + hl))), base = 4 + hl;
    head.forEach(function (h) { index[h[0]] = [base + h[1], h[2]]; });
    bytes = raw;
    /* v5.8.1: a near-copy of another model is stored as a delta of it (tools/build-appsscript.js delta()) */
    head.forEach(function (h) { if (h[3]) rebuilt[h[0]] = undelta(slice(h[3]), bytes.subarray(base + h[1], base + h[1] + h[2])); });
  }
  var rebuilt = {};
  function undelta(a, d) {
    var parts = [], n = 0, i = 0;
    function v() { var x = 0, m = 1, c; do { c = d[i++]; x += (c & 127) * m; m *= 128; } while (c & 128); return x; }
    while (i < d.length) {
      var l = v(); parts.push(d.subarray(i, i + l)); n += l; i += l;
      var c = v(), o = v(); if (c) { parts.push(a.subarray(o, o + c)); n += c; }
    }
    var out = new Uint8Array(n), at = 0;
    parts.forEach(function (p) { out.set(p, at); at += p.length; });
    return out;
  }
  function slice(p) { if (rebuilt[p]) return rebuilt[p]; var e = index[p]; return bytes.subarray(e[0], e[0] + e[1]); }
  function type(p) { return TYPES[(p.split(".").pop() || "").toLowerCase()] || "application/octet-stream"; }
  /* a .png may travel as lossless WebP (tools/build-appsscript.js): name the type by what the bytes are */
  function blob(p) {
    var b = slice(p), t = type(p);
    if (t === "image/png" && b.length > 12 && b[0] === 0x52 && b[1] === 0x49 && b[8] === 0x57 && b[9] === 0x45) t = "image/webp";
    return new Blob([b], { type: t });
  }
  /* the Canvas build hands out data: URLs instead of blob: ones: Canvas's file domain may refuse blob: (the Algebra
     game, which runs there, uses data: URLs too) */
  function b64(u) {
    var s = "", i, CH = 0x8000;
    for (i = 0; i < u.length; i += CH) s += String.fromCharCode.apply(null, u.subarray(i, i + CH));
    return btoa(s);
  }
  function url(p) {
    if (urls[p]) return urls[p];
    if (INLINE) { var b = blob(p); return (urls[p] = "data:" + b.type + ";base64," + b64(slice(p))); }
    return (urls[p] = URL.createObjectURL(blob(p)));
  }
  function text(p) { return new TextDecoder().decode(slice(p)); }
  /* "assets/x.png?v=5", "/assets/x.png", "https://this-origin/…/assets/x.png" → "assets/x.png" when the bundle has it */
  function resolve(u) {
    if (u == null) return null;
    u = String(u);
    if (/^(blob|data|about|javascript):/i.test(u)) return null;
    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(u)) {
      var a; try { a = new URL(u); } catch (e) { return null; }
      if (a.origin !== here()) return null;
      u = a.pathname;
    }
    u = u.replace(/[?#].*$/, "");
    try { u = decodeURIComponent(u); } catch (e) {}
    var segs = u.split("/").filter(function (s) { return s && s !== "."; }), i, p;
    for (i = 0; i < segs.length; i++) { p = segs.slice(i).join("/"); if (index[p]) return p; }
    return null;
  }
  /* the page's own origin (document.baseURI: a srcdoc frame's location is about:srcdoc) */
  function here() { try { return new URL(document.baseURI).origin; } catch (e) { return location.origin; } }
  function map(u) {
    var p = resolve(u); if (p) return url(p);
    if (/(^|\/)assets\/music\//.test(String(u))) return "data:,";   /* left out of the bundle on purpose */
    return u;
  }

  /* ── make the game's requests answer from memory ── */
  function shim() {
    var realFetch = window.fetch;
    window.fetch = function (input, init) {
      var p = resolve(typeof input === "string" ? input : (input && input.url));
      if (p) { var bl = blob(p); return Promise.resolve(new Response(bl, { status: 200, headers: { "Content-Type": bl.type } })); }
      return realFetch.apply(this, arguments);
    };
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (m, u) {
      var a = Array.prototype.slice.call(arguments); a[1] = map(u);
      return open.apply(this, a);
    };
    var src = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");
    Object.defineProperty(HTMLImageElement.prototype, "src", {
      configurable: true, enumerable: src.enumerable,
      get: function () { return src.get.call(this); },
      set: function (v) { src.set.call(this, map(v)); }
    });
    /* Algebra: <audio>/<video> src too, so a track the bundle leaves out never asks the Canvas folder for a file */
    var msrc = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, "src");
    if (msrc && msrc.set) Object.defineProperty(HTMLMediaElement.prototype, "src", {
      configurable: true, enumerable: msrc.enumerable,
      get: function () { return msrc.get.call(this); },
      set: function (v) { msrc.set.call(this, map(v)); }
    });
    var setAttr = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (n, v) {
      if (this instanceof HTMLImageElement && String(n).toLowerCase() === "src") v = map(v);
      return setAttr.call(this, n, v);
    };
    var inner = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
    Object.defineProperty(Element.prototype, "innerHTML", {
      configurable: true, enumerable: inner.enumerable,
      get: function () { return inner.get.call(this); },
      set: function (v) { inner.set.call(this, typeof v === "string" ? fixHtml(v) : v); }
    });
    var ins = Element.prototype.insertAdjacentHTML;
    Element.prototype.insertAdjacentHTML = function (w, v) { return ins.call(this, w, fixHtml(String(v))); };
    /* anything that still slips through (e.g. a template cloned from markup) */
    new MutationObserver(function (list) {
      list.forEach(function (m) {
        [].forEach.call(m.addedNodes, function (n) {
          if (n.nodeType !== 1) return;
          var imgs = n.tagName === "IMG" ? [n] : n.querySelectorAll ? n.querySelectorAll("img") : [];
          [].forEach.call(imgs, fixImg);
        });
      });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
  function fixHtml(h) {
    return h.replace(/(\ssrc=)(["'])([^"']+)\2/gi, function (m, a, q, u) { return a + q + map(u) + q; })
            .replace(/url\((["']?)([^"')]+)\1\)/g, function (m, q, u) { return "url(" + q + map(u) + q + ")"; });
  }
  function fixImg(img) {
    var d = img.getAttribute("data-vfs-src"), s = d || img.getAttribute("src");
    if (!s) return;
    var p = resolve(s);
    if (p && s !== url(p)) img.setAttribute("src", url(p));
    if (d) img.removeAttribute("data-vfs-src");
  }
  function css(p) {
    var dir = p.replace(/[^/]*$/, "");
    var t = text(p).replace(/url\((["']?)([^"')]+)\1\)/g, function (m, q, u) {
      if (/^(data|blob|https?):/i.test(u) || u.charAt(0) === "#") return m;
      var r = resolve(dir + u) || resolve(u);
      return r ? "url(" + q + url(r) + q + ")" : m;
    });
    var s = document.createElement("style"); s.setAttribute("data-src", p); s.textContent = t;
    document.head.appendChild(s);
  }
  function runScripts(list) {
    list.forEach(function (sc) {
      var s = document.createElement("script");
      s.textContent = sc.src ? text(sc.src) + "\n//# sourceURL=" + sc.src : sc.code;
      document.body.appendChild(s);
    });
  }

  /* v5.8: a class session (?class=CODE): its settings come from the script alongside the game */
  function getClass() {
    var code = window.SOL_CLASS_CODE;
    if (!code) return Promise.resolve(null);
    return retry(function () { return server("solClass", code); }, 3).then(function (t) {
      if (!t) return { missing: code };
      try { return JSON.parse(t); } catch (e) { return { missing: code }; }
    }, function () { return { missing: code }; });
  }
  function useClass(cfg) {
    if (!cfg) return;
    if (cfg.missing) { window.SOL_CLASS_MISSING = cfg.missing; return; }
    window.SOL_CLASS = cfg;
    window.SOL_CLASS_SEND = function (rec) {
      try { google.script.run.withFailureHandler(function () {}).solReport(cfg.code, rec); } catch (e) {}
    };
  }
  function classNotice() {
    if (!window.SOL_CLASS_MISSING) return;
    var n = document.createElement("div");
    n.setAttribute("style", "position:fixed;left:50%;top:12px;transform:translateX(-50%);z-index:9000;background:#3a1a14;color:#ffd8c8;border:1px solid #ff8b7a;border-radius:10px;padding:8px 14px;font:14px system-ui,sans-serif");
    n.textContent = "Class code " + window.SOL_CLASS_MISSING + " was not found, so this is the regular game. Check the link with your teacher.";
    document.body.appendChild(n);
    setTimeout(function () { if (n.parentNode) n.parentNode.removeChild(n); }, 9000);
  }

  /* Canvas serves every uploaded HTML file from one shared domain, so other games built on this engine (an
     Algebra or Biology version, say) would read and overwrite these saves. Each Canvas build keeps its own. */
  function canvasStorage(prefix) {
    var S = Storage.prototype, get = S.getItem, set = S.setItem, rem = S.removeItem, keyAt = S.key;
    function mine(st) { try { return st === window.localStorage; } catch (e) { return false; } }
    S.getItem = function (k) { return get.call(this, mine(this) ? prefix + k : k); };
    S.setItem = function (k, v) { return set.call(this, mine(this) ? prefix + k : k, v); };
    S.removeItem = function (k) { return rem.call(this, mine(this) ? prefix + k : k); };
    /* key(i) and length still see every key; the game only uses them to find its own, which carry the prefix */
    S.key = function (i) { var k = keyAt.call(this, i); return mine(this) && k && k.indexOf(prefix) === 0 ? k.slice(prefix.length) : k; };
  }

  function start() {
    if (INLINE) {
      canvasStorage("solReading." + String(window.SOL_CANVAS_ID || "game") + ":");
    } else if (!window.google || !google.script || !google.script.run) { failed(new Error("open this page from its Apps Script web app link")); return; }
    var klass = (window.SOL_ADMIN || INLINE) ? Promise.resolve(null) : getClass();
    getBundle().then(function (b) {
      say("Unpacking…"); bar(0.93);
      return gunzip(b.gz).then(function (raw) { unpack(raw); return b.man; });
    }).then(function (man) {
      return klass.then(function (cfg) { useClass(cfg); return man; });
    }).then(function (man) {
      shim();
      bar(1);
      if (window.SOL_ADMIN) {
        /* the teacher page: the question bank (the content files) and the admin app, no game */
        css("__admin.css");
        runScripts(man.scripts.filter(function (sc) { return sc.src && /^js\/content\d*\.js$/.test(sc.src); }).concat([{ src: "__admin.js" }]));
        bootEl.parentNode.removeChild(bootEl);
        return;
      }
      man.css.forEach(css);
      if (man.body) document.body.className = man.body;
      document.body.insertAdjacentHTML("beforeend", text("__page.html"));
      [].forEach.call(document.querySelectorAll("img"), fixImg);
      runScripts(man.scripts);
      bootEl.parentNode.removeChild(bootEl);
      classNotice();
    }).catch(failed);
  }
  start();
})();

