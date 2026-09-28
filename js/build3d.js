/* SOL Labyrinth — castle builder, the 3D view (v5.5)
   Draws the castle's pieces with WebGL (three.js, js/vendor/three.min.js) instead of sprites, so every building,
   tower, prop and wall turns with the map by the degree: sprites only exist facing four ways, so between the
   quarter turns of the view a building sat still while its footprint turned under it.

   The camera is the builder's own isometric projection (true isometric: elevation atan(1/√2), a cell 151 px wide
   and 87.2 px tall at scale 1, +x down-right and +y down-left at view angle 0) with the same fit, zoom and pan as
   the 2D canvas, so the 2D layer underneath (sky, ground, footprints) and the hit tests in build.js line up with it
   exactly. Buildings are the kits' models (assets/build/models, packed by tools/pack-models.js), walls, gates,
   hedges and fences are boxes (the same plan as the 2D drawRun), and pieces whose kit has no model (trees, flowers,
   animals, statues from the nature and graveyard kits) stand upright as sprites facing the view. If WebGL, three.js
   or the models are missing the builder keeps its 2D drawing (SolBuild3D.ready() is false). */
(function () {
  "use strict";
  var api = null, R = null, models = null, modelsState = "idle", loads = {}, sprites = {}, THREE = null;
  var EL = Math.atan(Math.SQRT1_2), SQ2 = Math.SQRT2;
  var HUES = { "red/": [355, 1.05, 1.0], "green/": [128, 0.9, 0.95], "gold/": [44, 1.1, 1.08] };   /* the castle kit's blue accents, per style (tools/make-castle-kit.py COLORS) */
  var STONE = 0x9aa0ac;

  function webgl() { try { var c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch (e) { return false; } }
  /* the builder asks this every redraw: true once three.js, WebGL and the model list are all there */
  function ready() {
    if (modelsState === "idle" && api) loadModels();
    return modelsState === "ok" && !!THREE;
  }
  function init(a) { api = a; THREE = window.THREE || null; if (!THREE || !webgl()) { modelsState = "fail"; return; } loadModels(); }
  function loadModels() {
    if (modelsState !== "idle") return;
    modelsState = "loading";
    var done = function (j) { models = j; modelsState = "ok"; api.redraw(); }, fail = function () { modelsState = "fail"; api.redraw(); };
    try {
      if (window.fetch) fetch(api.modelsUrl, { cache: "no-cache" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(done).catch(fail);
      else { var x = new XMLHttpRequest(); x.open("GET", api.modelsUrl); x.onload = function () { try { done(JSON.parse(x.responseText)); } catch (e) { fail(); } }; x.onerror = fail; x.send(); }
    } catch (e) { fail(); }
  }

  /* ── renderer, camera, lights ────────────────────────────────────────────── */
  function ensure(canvas, W, H, dpr) {
    if (R && R.canvas !== canvas) dispose();
    if (!R) {
      R = { canvas: canvas, pieces: {}, gen: 0 };
      R.renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: "low-power" });
      R.renderer.setClearColor(0x000000, 0); R.renderer.outputColorSpace = THREE.SRGBColorSpace;
      R.scene = new THREE.Scene();
      R.cam = new THREE.OrthographicCamera(-1, 1, 1, -1, -400, 400);
      R.amb = new THREE.AmbientLight(0xffffff, 1.55); R.sun = new THREE.DirectionalLight(0xffffff, 2.3);
      R.scene.add(R.amb); R.scene.add(R.sun); R.scene.add(R.sun.target);
      R.group = new THREE.Group(); R.scene.add(R.group);
      /* one instanced mesh per shape for every wall, hedge and fence box on the field */
      R.boxes = inst(new THREE.BoxGeometry(1, 1, 1), 512);
      R.drums = inst(new THREE.CylinderGeometry(1, 1, 1, 24), 16);
      R.scene.add(R.boxes.mesh); R.scene.add(R.drums.mesh);
    }
    if (R.W !== W || R.H !== H || R.dpr !== dpr) { R.W = W; R.H = H; R.dpr = dpr; R.renderer.setPixelRatio(dpr); R.renderer.setSize(W, H, false); }
  }
  function inst(geom, cap) {
    var mat = new THREE.MeshLambertMaterial({ color: 0xffffff }), m = new THREE.InstancedMesh(geom, mat, cap);
    m.count = 0; m.frustumCulled = false;
    return { mesh: m, cap: cap, geom: geom, mat: mat, n: 0, mtx: new THREE.Matrix4(), col: new THREE.Color() };
  }
  function grow(o, need) {
    if (need <= o.cap) return;
    var cap = Math.max(need, o.cap * 2), m = new THREE.InstancedMesh(o.geom, o.mat, cap);
    m.count = 0; m.frustumCulled = false;
    R.scene.remove(o.mesh); o.mesh.dispose(); o.mesh = m; o.cap = cap; R.scene.add(m);
  }
  function setCamera(fit, W, H) {
    var s = fit.s / fit.base, ppu = api.cellPx() / SQ2 * s, az = (45 + api.angle()) * Math.PI / 180, cam = R.cam;
    var dir = new THREE.Vector3(Math.sin(az) * Math.cos(EL), Math.sin(EL), Math.cos(az) * Math.cos(EL));
    var right = new THREE.Vector3(dir.z, 0, -dir.x).normalize(), up = new THREE.Vector3().crossVectors(dir, right).normalize();
    /* the world origin must land at (fit.ox, fit.oy) on the canvas */
    var T = new THREE.Vector3().addScaledVector(right, -(fit.ox - W / 2) / ppu).addScaledVector(up, (fit.oy - H / 2) / ppu);
    cam.left = -W / 2 / ppu; cam.right = W / 2 / ppu; cam.top = H / 2 / ppu; cam.bottom = -H / 2 / ppu;
    cam.position.copy(T).addScaledVector(dir, 150); cam.up.copy(up); cam.lookAt(T); cam.updateProjectionMatrix();
    /* light from the front-left of the view, wherever it turns, like the sprites were rendered */
    R.sun.position.copy(T).addScaledVector(right, -4).addScaledVector(dir, 2.5).add(new THREE.Vector3(0, 5, 0)); R.sun.target.position.copy(T);
    R.az = az; R.dir = dir; R.right = right; R.up = up; R.ppu = ppu; R.horiz = new THREE.Vector3(Math.sin(az), 0, Math.cos(az));
  }
  /* where a world point lands on the canvas (for tests): matches build.js worldPx through the fit */
  function project(x, y, z) {
    if (!R) return null;
    var v = new THREE.Vector3(x, z || 0, y).project(R.cam);
    return { x: (v.x + 1) / 2 * R.W, y: (1 - v.y) / 2 * R.H };
  }

  /* ── models ──────────────────────────────────────────────────────────────── */
  /* HSV, as tools/make-castle-kit.py judges the sprites' colours (three.js only offers HSL) */
  function hsvOf(c) {
    var r = c.r, g = c.g, b = c.b, mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, h = 0;
    if (d > 0) { if (mx === r) h = ((g - b) / d + 6) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h /= 6; }
    return { h: h, s: mx ? d / mx : 0, v: mx };
  }
  function setHSV(c, h, s, v) {
    var i = Math.floor(h * 6), f = h * 6 - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s), k = i % 6;
    var r = [v, q, p, p, t, v][k], g = [t, v, v, q, p, p][k], b = [p, p, t, v, v, q][k];
    c.setRGB(r, g, b);
  }
  function isBlue(m) { var h = hsvOf(m.color); return h.h > 0.52 && h.h < 0.70 && h.s > 0.42 && h.v > 0.15; }
  function recolourMat(m, dir) {
    var t = HUES[dir], h;
    if (!t || !m.color || !isBlue(m)) return m;
    m = m.clone(); h = hsvOf(m.color);
    setHSV(m.color, t[0] / 360, Math.min(1, h.s * t[1]), Math.min(1, h.v * t[2]));
    return m;
  }
  function greystone(m) {                                  /* v5.3: Kenney's beige stone tinted grey, blue accents untouched */
    var h; if (!m.color) return m; h = hsvOf(m.color);
    if (h.h > 0.05 && h.h < 0.19 && h.s < 0.42 && h.v > 0.3) { m = m.clone(); setHSV(m.color, h.h, h.s * 0.3, h.v * 0.62); }   /* darker than the sprite tint: this light rig is brighter than Kenney's renders */
    return m;
  }
  function prepMaterials(obj, file) {
    var stoneKit = /castle\/(tower|wall)/.test(file);
    obj.traverse(function (o) {
      if (!o.isMesh) return;
      var ms = Array.isArray(o.material) ? o.material : [o.material];
      ms = ms.map(function (m) {
        if (m.isMeshStandardMaterial) { m.metalness = 0; m.roughness = 1; }
        if (m.isMeshPhongMaterial) { m.shininess = 4; m.specular.setHex(0x111111); if (!m.map) m.color.multiplyScalar(0.8); }
        if (stoneKit) m = greystone(m);
        return m;
      });
      o.material = Array.isArray(o.material) ? ms : ms[0];
      o.castShadow = o.receiveShadow = false;
    });
  }
  /* a model file, loaded once; null until it arrives (the piece is drawn again then) */
  function model(file) {
    var e = loads[file];
    if (e) return e.obj;
    e = loads[file] = { obj: null, err: false };
    var url = models.dir + file, arrive = function (o) { prepMaterials(o, file); e.obj = o; R && R.gen++; api.redraw(); }, fail = function (err) { e.err = true; console.warn("build3d: " + file, err && err.message); };
    try {
      if (/\.obj$/i.test(file)) {
        var mtl = new THREE.MTLLoader(), base = url.replace(/[^/]*$/, "");
        mtl.setResourcePath(base).setPath(base);
        mtl.loadAsync(file.replace(/^.*\//, "").replace(/\.obj$/i, ".mtl")).then(function (mats) {
          mats.preload();
          return new THREE.OBJLoader().setMaterials(mats).loadAsync(url);
        }).then(arrive).catch(fail);
      } else new THREE.GLTFLoader().loadAsync(url).then(function (g) { arrive(g.scene); }).catch(fail);
    } catch (err) { fail(err); }
    return null;
  }
  function baseName(n) { var m = /^(.*)_(NE|SE|SW|NW)$/.exec(n); return m ? m[1] : n; }
  function styleDir(style) { var st = api.styleDef(style); return (st && st.dir) || ""; }
  /* one part of a piece as a group: the model(s) scaled to the cell, footprint centred, base on y = 0 */
  function buildModelPart(spec, dir, stone) {
    var g = new THREE.Group(), complete = true, i, pt, file, src, obj, k, box, c;
    for (i = 0; i < spec.parts.length; i++) {
      pt = spec.parts[i]; file = typeof pt.file === "string" ? pt.file : (pt.file[dir] || pt.file[""]);
      src = model(file);
      if (!src) { complete = false; continue; }
      obj = src.clone();
      if (stone || (spec.coloured && dir && spec.kind === "obj")) obj.traverse(function (o) {
        if (!o.isMesh) return;
        var ms = Array.isArray(o.material) ? o.material : [o.material];
        ms = ms.map(function (m) { if (stone) { m = m.clone(); m.color.setHex(STONE); if (m.map) m.map = null; return m; } return recolourMat(m, dir); });
        o.material = Array.isArray(o.material) ? ms : ms[0];
      });
      k = (pt.scale || 1) * (spec.scale || 1);
      obj.scale.setScalar(k);
      if (pt.rotY || spec.rotY) obj.rotation.y = ((pt.rotY || 0) + (spec.rotY || 0)) * Math.PI / 180;
      obj.updateMatrixWorld(true);
      box = new THREE.Box3().setFromObject(obj); c = box.getCenter(new THREE.Vector3());
      obj.position.set(-c.x + (pt.dx || 0), -box.min.y, -c.z + (pt.dz || 0));
      g.add(obj);
    }
    g.userData.complete = complete;
    return g;
  }
  /* a sprite with no model: an upright plane facing the view, textured from the kit atlas */
  function spriteTexture(name, style) {
    var key = name + "|" + styleDir(style), e = sprites[key], ref, c, sp, cv, ctx;
    if (e) return e.tex;
    ref = api.spriteRef(name, style); c = api.getImg(ref.src); sp = api.kitSprite(name);
    if (!c.ok) return null;                                  /* still loading (build.js redraws when it lands) or missing */
    cv = document.createElement("canvas"); cv.width = sp.w; cv.height = sp.h; ctx = cv.getContext("2d");
    if (ref.whole) ctx.drawImage(c.img, 0, 0, sp.w, sp.h); else ctx.drawImage(c.img, ref.x, ref.y, sp.w, sp.h, 0, 0, sp.w, sp.h);
    var tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.minFilter = THREE.LinearFilter; tex.generateMipmaps = false;
    sprites[key] = { tex: tex };
    return tex;
  }
  var planeGeom = null;
  function buildBillboard(pt, style) {
    var tex = spriteTexture(pt.name, style), C = api.cellPx(), H = api.cellH(), mesh, mat;
    if (!planeGeom) planeGeom = new THREE.PlaneGeometry(1, 1).translate(0, 0.5, 0);
    if (!tex) return null;
    mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.3, side: THREE.DoubleSide });
    mesh = new THREE.Mesh(planeGeom, mat);
    mesh.scale.set(pt.w * SQ2 / C, pt.h / H, 1);
    mesh.userData.billboard = true;
    return mesh;
  }

  /* ── pieces ──────────────────────────────────────────────────────────────── */
  function sig(it) {
    return [it.p.id, it.style || "", it.a, it.prot | 0, it.n, it.parts.map(function (q) { return q.name; }).join(","), it.hostKey || ""].join("|");
  }
  function buildPiece(it) {
    var g = new THREE.Group(), dir = styleDir(it.style), y = 0, i, pt, base, spec, part, box, complete = true;
    for (i = 0; i < it.parts.length; i++) {
      pt = it.parts[i]; base = baseName(pt.name); spec = models.sprites[base];
      if (spec) {
        part = buildModelPart(spec, dir, !!spec.stone);
        if (!part.userData.complete) complete = false;
        part.position.y = y;
        g.add(part);
        part.updateMatrixWorld(true);
        box = new THREE.Box3().setFromObject(part);
        if (box.max.y > -Infinity) y = box.max.y;                    /* the next part sits on this one */
      } else {
        part = buildBillboard(pt, it.style);
        if (!part) { complete = false; continue; }
        part.position.y = y - (pt.oy || 0) / api.cellH();      /* oy raises the sprite in build.js (bottom = y0 − (lift − oy)) */
        g.add(part);
      }
    }
    g.userData.complete = complete; g.userData.top = y;
    if (it.a < 1) g.traverse(function (o) {
      if (!o.isMesh) return;
      var ms = Array.isArray(o.material) ? o.material : [o.material];
      ms = ms.map(function (m) { m = m.clone(); m.transparent = true; m.opacity = it.a; m.depthWrite = false; return m; });
      o.material = Array.isArray(o.material) ? ms : ms[0];
    });
    return g;
  }
  function placePiece(g, it, y0) {
    var n = it.n, cx = it.cx + n / 2, cy = it.cy + n / 2;
    g.position.set(cx, y0, cy);
    g.rotation.y = -(it.prot | 0) * Math.PI / 2;
    g.traverse(function (o) {
      if (!o.userData.billboard) return;
      /* the sprite's foot is where build.js puts it: the point n/√2 toward the viewer from the footprint's centre, facing the view */
      o.rotation.y = R.az + (it.prot | 0) * Math.PI / 2;
      o.position.x = R.horiz.x * n / SQ2; o.position.z = R.horiz.z * n / SQ2;
      var w = new THREE.Vector3(o.position.x, 0, o.position.z).applyAxisAngle(new THREE.Vector3(0, 1, 0), -g.rotation.y);   /* undo the piece's turn */
      o.position.x = w.x; o.position.z = w.z;
    });
  }

  /* ── runs: walls, gates, hedges and fences as boxes ──────────────────────── */
  function addBox(x0, y0, x1, y1, z0, z1, col) {
    var o = R.boxes, i = o.n++;
    if (i >= o.cap) grow(o, i + 1);
    o.mtx.makeScale(Math.max(1e-3, x1 - x0), Math.max(1e-3, z1 - z0), Math.max(1e-3, y1 - y0)); o.mtx.setPosition((x0 + x1) / 2, (z0 + z1) / 2, (y0 + y1) / 2);
    o.mesh.setMatrixAt(i, o.mtx); o.mesh.setColorAt(i, o.col.set(col));
  }
  function addDrum(cx, cy, r, z0, z1, col) {
    var o = R.drums, i = o.n++;
    if (i >= o.cap) grow(o, i + 1);
    o.mtx.makeScale(r, Math.max(1e-3, z1 - z0), r); o.mtx.setPosition(cx, (z0 + z1) / 2, cy);
    o.mesh.setMatrixAt(i, o.mtx); o.mesh.setColorAt(i, o.col.set(col));
  }
  function drawRun(it) {
    var pl = api.runPlan(it), st = pl.st, cols = pl.cols, h = st.h, t = st.t, mx = pl.mx, my = pl.my, E = pl.E, k, b, ht = t / 2;
    var body = cols.body || cols.top, merlon = cols.merlon || cols.top;
    if (st.fence) {
      var n = st.rails || 2, pw = 0.08, posts = [], i;
      pl.parts.forEach(function (b) {
        if (b.axis === "x") { posts.push([b.x0 + E, my]); posts.push([b.x1 - E, my]); for (k = 0; k < n; k++) { var z = 0.14 + k * (h - 0.2) / Math.max(1, n - 1); addBox(b.x0, my - t / 2, b.x1, my + t / 2, z, z + 0.06, body); } }
        else { posts.push([mx, b.y0 + E]); posts.push([mx, b.y1 - E]); for (k = 0; k < n; k++) { var z2 = 0.14 + k * (h - 0.2) / Math.max(1, n - 1); addBox(mx - t / 2, b.y0, mx + t / 2, b.y1, z2, z2 + 0.06, body); } }
      });
      if (st.gate) posts.push([mx, my]);
      for (i = 0; i < posts.length; i++) addBox(posts[i][0] - pw / 2, posts[i][1] - pw / 2, posts[i][0] + pw / 2, posts[i][1] + pw / 2, 0, h, body);
      return;
    }
    pl.parts.forEach(function (b) {
      if (st.arch && b === pl.main) {                         /* a gate: two piers and a lintel leave the way through open */
        var u = b.axis === "x" ? mx : my, o0 = u - 0.2, o1 = u + 0.2, top = 0.78;
        if (b.axis === "x") { addBox(b.x0, b.y0, o0, b.y1, 0, h, body); addBox(o1, b.y0, b.x1, b.y1, 0, h, body); addBox(o0 - 0.01, b.y0, o1 + 0.01, b.y1, top, h, body); }
        else { addBox(b.x0, b.y0, b.x1, o0, 0, h, body); addBox(b.x0, o1, b.x1, b.y1, 0, h, body); addBox(b.x0, o0 - 0.01, b.x1, o1 + 0.01, top, h, body); }
        if (st.bars) {                                        /* the portcullis: iron bars in the middle of the gateway */
          for (k = -2; k <= 2; k++) { if (b.axis === "x") addBox(u + k * 0.08 - 0.015, my - 0.02, u + k * 0.08 + 0.015, my + 0.02, 0, top, cols.bar); else addBox(mx - 0.02, u + k * 0.08 - 0.015, mx + 0.02, u + k * 0.08 + 0.015, 0, top, cols.bar); }
          for (var z = 0.15; z < top; z += 0.18) { if (b.axis === "x") addBox(o0 + 0.02, my - 0.02, o1 - 0.02, my + 0.02, z, z + 0.03, cols.bar); else addBox(mx - 0.02, o0 + 0.02, mx + 0.02, o1 - 0.02, z, z + 0.03, cols.bar); }
        }
      } else addBox(b.x0, b.y0, b.x1, b.y1, 0, h, body);
    });
    if (st.stairs && pl.main) {                               /* three steps against one long face (turning the piece swaps the side) */
      var sw = 0.22, sd = 0.24, e0 = pl.side > 0 ? ht : -ht - sd, e1 = e0 + sd;
      for (k = 0; k < 3; k++) {
        if (pl.main.axis === "x") addBox(mx - 0.33 + k * sw, my + e0, mx - 0.33 + (k + 1) * sw, my + e1, 0, 0.3 * (k + 1), body);
        else addBox(mx + e0, my - 0.33 + k * sw, mx + e1, my - 0.33 + (k + 1) * sw, 0, 0.3 * (k + 1), body);
      }
    }
    if (st.merlons) {                                         /* battlements along both long edges of every box */
      var mw = 0.12, md = 0.13, mh = 0.22;
      pl.parts.forEach(function (b) {
        var len = b.axis === "x" ? b.x1 - b.x0 : b.y1 - b.y0, n2 = Math.max(1, Math.round(len / 0.25)), k4, u;
        for (k4 = 0; k4 < n2; k4++) {
          u = (b.axis === "x" ? b.x0 : b.y0) + (k4 + 0.5) * len / n2 - mw / 2;
          if (b.axis === "x") { addBox(u, b.y0, u + mw, b.y0 + md, h, h + mh, merlon); addBox(u, b.y1 - md, u + mw, b.y1, h, h + mh, merlon); }
          else { addBox(b.x0, u, b.x0 + md, u + mw, h, h + mh, merlon); addBox(b.x1 - md, u, b.x1, u + mw, h, h + mh, merlon); }
        }
      });
    }
    if (st.turret) {                                          /* a round turret on the corner with its own ring of merlons */
      var r = 0.36, th = h + 0.45, a, q;
      addDrum(mx, my, r, 0, th, body);
      for (k = 0; k < 8; k++) { a = k * Math.PI / 4; q = { x: mx + (r - 0.07) * Math.cos(a), y: my + (r - 0.07) * Math.sin(a) }; addBox(q.x - 0.06, q.y - 0.06, q.x + 0.06, q.y + 0.06, th, th + 0.18, merlon); }
    }
  }

  /* ── a frame ─────────────────────────────────────────────────────────────── */
  function render(f) {
    if (!ready()) return false;
    ensure(f.canvas, f.W, f.H, f.dpr);
    setCamera(f.fit, f.W, f.H);
    var seen = {}, i, it, key, e, s, g, host;
    R.boxes.n = 0; R.drums.n = 0;
    /* hosts before the flags that stand on them */
    var items = f.items.slice().sort(function (a, b) { return (a.hostKey ? 1 : 0) - (b.hostKey ? 1 : 0); }), tops = {};
    for (i = 0; i < items.length; i++) {
      it = items[i];
      if (!it.kit) continue;
      if (it.run) { drawRun(it); continue; }
      key = it.key; seen[key] = 1;
      e = R.pieces[key]; s = sig(it) + "|" + (e && !e.complete ? R.gen : "");
      if (!e || e.sig !== s) {
        if (e) { R.group.remove(e.g); disposeGroup(e.g); }
        g = buildPiece(it);
        e = R.pieces[key] = { g: g, sig: s, complete: g.userData.complete, top: g.userData.top };
        R.group.add(g);
      }
      host = it.hostKey && tops[it.hostKey];
      placePiece(e.g, it, host != null ? host : (it.base || 0) / api.cellH());
      if (!it.hostKey) tops[key] = e.top;
    }
    for (key in R.pieces) if (!seen[key]) { R.group.remove(R.pieces[key].g); disposeGroup(R.pieces[key].g); delete R.pieces[key]; }
    [R.boxes, R.drums].forEach(function (o) { o.mesh.count = o.n; o.mesh.instanceMatrix.needsUpdate = true; if (o.mesh.instanceColor) o.mesh.instanceColor.needsUpdate = true; });
    R.renderer.render(R.scene, R.cam);
    return true;
  }
  function disposeGroup(g) {
    g.traverse(function (o) { if (o.isMesh && o.material && o.material !== o.material.__shared) { /* clones only: shared materials stay */ } });
  }
  function dispose() {
    if (!R) return;
    try { R.renderer.dispose(); } catch (e) {}
    R = null;
  }
  function clear() { if (R) { R.renderer.setClearColor(0x000000, 0); R.renderer.clear(); } }

  window.SolBuild3D = { init: init, ready: ready, render: render, project: project, clear: clear, dispose: dispose,
    _loads: function () { var n = 0, err = 0, k; for (k in loads) { if (loads[k].obj) n++; if (loads[k].err) err++; } return { loaded: n, failed: err, total: Object.keys(loads).length, models: modelsState }; } };
})();
