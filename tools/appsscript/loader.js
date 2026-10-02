/* SOL Lab Biology — Apps Script loader (tools/build-appsscript.js puts this in loader.html).
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
  window.SOL_APPSSCRIPT = true;

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
  }
  function slice(p) { var e = index[p]; return bytes.subarray(e[0], e[0] + e[1]); }
  function type(p) { return TYPES[(p.split(".").pop() || "").toLowerCase()] || "application/octet-stream"; }
  function blob(p) { return new Blob([slice(p)], { type: type(p) }); }
  function url(p) { return urls[p] || (urls[p] = URL.createObjectURL(blob(p))); }
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
  function map(u) { var p = resolve(u); return p ? url(p) : u; }

  /* ── make the game's requests answer from memory ── */
  function shim() {
    var realFetch = window.fetch;
    window.fetch = function (input, init) {
      var p = resolve(typeof input === "string" ? input : (input && input.url));
      if (p) return Promise.resolve(new Response(blob(p), { status: 200, headers: { "Content-Type": type(p) } }));
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

  function start() {
    if (!window.google || !google.script || !google.script.run) { failed(new Error("open this page from its Apps Script web app link")); return; }
    var klass = window.SOL_ADMIN ? Promise.resolve(null) : getClass();
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
