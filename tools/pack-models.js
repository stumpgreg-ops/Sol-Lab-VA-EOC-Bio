/* v5.5: pack the 3D models the castle builder draws in the browser.

   node tools/pack-models.js <KayKit Assets/gltf dir> <kenney mirror dir> [<sizes.json from tools/render-kaykit.js>]

   Writes assets/build/models/:
     kk/<model>.glb          KayKit Medieval Hexagon Pack (CC0) models the castle pieces use, one file per model
                             and colour, repacked as GLB with int16 positions and uint16 texture coordinates
                             (KHR_mesh_quantization) and no normals (three.js recomputes them): about a third of
                             the size of the pack's glTF + bin. They share one texture, kk/hexagons_medieval.png.
     town/<model>.glb        Kenney Fantasy Town Kit (CC0) models, copied as they are (1 unit = 1 cell)
     castle/<model>.obj|mtl  Kenney Castle Kit (CC0) models, copied as they are (10 units = 1 cell)
     models.json             sprite base name (the part names in pieces.json without their _NE suffix) → how to
                             build it: files, scale (cells per model unit), footprint, colour variants.
   The KayKit glTF folder and the Kenney mirror stay out of the repo (see README, "Regenerating the castle kit"). */
var fs = require("fs"), path = require("path");
var kk = require("./render-kaykit.js"), SPECS = kk.SPECS, COLOURS = kk.COLOURS;
var args = process.argv.slice(2), kitDir = args[0], mirror = args[1];
if (!kitDir || !mirror) { console.error("usage: node tools/pack-models.js <KayKit gltf dir> <kenney mirror dir>"); process.exit(2); }
var root = path.join(__dirname, ".."), out = path.join(root, "assets", "build", "models");
var pieces = JSON.parse(fs.readFileSync(path.join(root, "assets", "build", "pieces.json"), "utf8"));
var sizesPath = args[2] || path.join(kitDir, "..", "renders", "sizes.json");   /* the fit scales tools/render-kaykit.js measured */
var sizes = fs.existsSync(sizesPath) ? JSON.parse(fs.readFileSync(sizesPath, "utf8")) : {};
if (!sizes.castle) throw new Error("sizes.json from tools/render-kaykit.js not found at " + sizesPath);

/* ── which sprites the pieces draw (walls, gates, hedges and fences are geometry since v5.4, so not those) ── */
var names = {};
pieces.pieces.forEach(function (p) {
  if (p.theme !== "castle") return;
  (p.parts || []).forEach(function (n) { names[n] = 1; });
  (p.grow || []).forEach(function (g) { g.forEach(function (n) { names[n] = 1; }); });
});
function baseName(n) { var m = /^(.*)_(NE|SE|SW|NW)$/.exec(n); return m ? m[1] : n; }
var bases = {}; Object.keys(names).forEach(function (n) { bases[baseName(n)] = 1; });

var models = { dir: "assets/build/models/", cellUnits: { castle: 10, town: 1 }, sprites: {} };
var written = 0, bytes = 0;
function ensure(d) { fs.mkdirSync(d, { recursive: true }); }
function copy(src, dst) {
  ensure(path.dirname(dst));
  /* Kenney Suite writes a "usemap" line in every OBJ, which three.js's OBJLoader warns about; the MTL carries the textures */
  if (/\.obj$/i.test(src)) fs.writeFileSync(dst, fs.readFileSync(src, "utf8").split("\n").filter(function (l) { return !/^usemap\b/.test(l); }).join("\n"));
  else fs.copyFileSync(src, dst);
  written++; bytes += fs.statSync(dst).size;
}

/* ── KayKit: glTF + bin → quantized GLB ─────────────────────────────────────── */
function align4(n) { return (n + 3) & ~3; }
function quantize(gltfPath, dstPath) {
  var g = JSON.parse(fs.readFileSync(gltfPath, "utf8")), dir = path.dirname(gltfPath);
  var bins = g.buffers.map(function (b) { return fs.readFileSync(path.join(dir, b.uri)); });
  function view(acc) { var bv = g.bufferViews[acc.bufferView]; return { buf: bins[bv.buffer], off: (bv.byteOffset || 0) + (acc.byteOffset || 0), stride: bv.byteStride || 0 }; }
  var chunks = [], newViews = [], newAcc = [], total = 0;
  function push(buf, target) { var off = align4(total); chunks.push({ off: off, buf: buf }); total = off + buf.length; newViews.push({ buffer: 0, byteOffset: off, byteLength: buf.length, target: target }); return newViews.length - 1; }
  var S = null, scaleOf = {};
  g.meshes.forEach(function (m) { m.primitives.forEach(function (pr) {
    var pa = g.accessors[pr.attributes.POSITION], v = view(pa), n = pa.count, f = new Float32Array(n * 3), i, k, mx = 0;
    for (i = 0; i < n; i++) for (k = 0; k < 3; k++) { f[i * 3 + k] = v.buf.readFloatLE(v.off + i * (v.stride || 12) + k * 4); mx = Math.max(mx, Math.abs(f[i * 3 + k])); }
    if (S === null) S = 32767 / (mx || 1); else S = Math.min(S, 32767 / (mx || 1));
    scaleOf[pr.attributes.POSITION] = f;
  }); });
  var mapped = {};
  function convertAccessor(idx, kind) {
    if (mapped[idx] !== undefined) return mapped[idx];
    var acc = g.accessors[idx], v = view(acc), n = acc.count, i, k, buf, a = { componentType: acc.componentType, count: n, type: acc.type };
    if (kind === "POSITION") {
      var f = scaleOf[idx], q = new Int16Array(n * 4), mn = [1e9, 1e9, 1e9], mxv = [-1e9, -1e9, -1e9];
      for (i = 0; i < n; i++) for (k = 0; k < 3; k++) { var val = Math.round(f[i * 3 + k] * S); q[i * 4 + k] = val; mn[k] = Math.min(mn[k], val); mxv[k] = Math.max(mxv[k], val); }
      buf = Buffer.from(q.buffer); a.componentType = 5122; a.min = mn; a.max = mxv;
      a.bufferView = push(buf, 34962); newViews[a.bufferView].byteStride = 8;
    } else if (kind === "TEXCOORD_0") {
      var ok = true, uv = new Float32Array(n * 2);
      for (i = 0; i < n; i++) for (k = 0; k < 2; k++) { uv[i * 2 + k] = v.buf.readFloatLE(v.off + i * (v.stride || 8) + k * 4); if (uv[i * 2 + k] < 0 || uv[i * 2 + k] > 1) ok = false; }
      if (ok) { var u = new Uint16Array(n * 2); for (i = 0; i < n * 2; i++) u[i] = Math.round(uv[i] * 65535); buf = Buffer.from(u.buffer); a.componentType = 5123; a.normalized = true; }
      else buf = Buffer.from(uv.buffer);
      a.bufferView = push(buf, 34962);
    } else {                                                     /* indices: copy */
      var size = { 5121: 1, 5123: 2, 5125: 4 }[acc.componentType] * ({ SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 })[acc.type];
      buf = Buffer.alloc(n * size); v.buf.copy(buf, 0, v.off, v.off + n * size);
      a.bufferView = push(buf, 34963);
    }
    newAcc.push(a); mapped[idx] = newAcc.length - 1; return mapped[idx];
  }
  g.meshes.forEach(function (m) { m.primitives.forEach(function (pr) {
    var at = {};
    at.POSITION = convertAccessor(pr.attributes.POSITION, "POSITION");
    if (pr.attributes.TEXCOORD_0 !== undefined) at.TEXCOORD_0 = convertAccessor(pr.attributes.TEXCOORD_0, "TEXCOORD_0");
    pr.attributes = at;
    if (pr.indices !== undefined) pr.indices = convertAccessor(pr.indices, "INDICES");
  }); });
  /* the quantized positions are 1/S of the model: scale every node that carries a mesh */
  g.nodes.slice().forEach(function (nd) {
    if (nd.mesh === undefined) return;
    if (!nd.scale && !nd.rotation && !nd.translation && !nd.matrix) { nd.scale = [1 / S, 1 / S, 1 / S]; return; }
    /* a node with its own transform keeps it and hands the mesh to a scaled child */
    g.nodes.push({ mesh: nd.mesh, scale: [1 / S, 1 / S, 1 / S], name: (nd.name || "mesh") + "_q" }); delete nd.mesh;
    nd.children = (nd.children || []).concat([g.nodes.length - 1]);
  });
  var bin = Buffer.alloc(align4(total)); chunks.forEach(function (c) { c.buf.copy(bin, c.off); });
  g.buffers = [{ byteLength: bin.length }]; g.bufferViews = newViews; g.accessors = newAcc;
  (g.images || []).forEach(function (im) { im.uri = "hexagons_medieval.png"; });
  g.extensionsUsed = ["KHR_mesh_quantization"]; g.extensionsRequired = ["KHR_mesh_quantization"];
  var json = Buffer.from(JSON.stringify(g)), jpad = align4(json.length), jb = Buffer.alloc(jpad, 0x20); json.copy(jb);
  var head = Buffer.alloc(12); head.writeUInt32LE(0x46546C67, 0); head.writeUInt32LE(2, 4); head.writeUInt32LE(12 + 8 + jpad + 8 + bin.length, 8);
  var jh = Buffer.alloc(8); jh.writeUInt32LE(jpad, 0); jh.writeUInt32LE(0x4E4F534A, 4);
  var bh = Buffer.alloc(8); bh.writeUInt32LE(bin.length, 0); bh.writeUInt32LE(0x004E4942, 4);
  ensure(path.dirname(dstPath)); fs.writeFileSync(dstPath, Buffer.concat([head, jh, jb, bh, bin])); written++; bytes += 12 + 8 + jpad + 8 + bin.length;
}
var kkDone = {};
function packKK(url, colour) {
  var rel = url.replace(/<c>/g, colour), src = path.join(kitDir, rel), name = path.basename(rel, ".gltf") + ".glb";
  if (!kkDone[name]) { quantize(src, path.join(out, "kk", name)); kkDone[name] = 1; }
  return "kk/" + name;
}
copy(path.join(kitDir, "buildings", "blue", "hexagons_medieval.png"), path.join(out, "kk", "hexagons_medieval.png"));
["king", "knightBlue", "knightRed", "astronaut"].forEach(function (t) { copy(path.join(mirror, "castle-kit-1.0", "Models", "Textures", t + ".png"), path.join(out, "castle", "Textures", t + ".png")); });
Object.keys(bases).filter(function (b) { return b.indexOf("k_") === 0; }).forEach(function (b) {
  var key = b.slice(2), spec = SPECS[key], sz = sizes[key];
  if (!spec) throw new Error("no KayKit spec for " + key);
  var parts = (spec.parts || [{ url: spec.url }]).map(function (pt) {
    var o = { dx: pt.dx || 0, dz: pt.dz || 0 };
    if (pt.rotY) o.rotY = pt.rotY; if (pt.scale) o.scale = pt.scale;
    if (spec.coloured) { o.file = {}; Object.keys(COLOURS).forEach(function (c) { o.file[COLOURS[c] === "base" ? "" : COLOURS[c] + "/"] = packKK(pt.url, c); }); }
    else o.file = packKK(pt.url, "blue");
    return o;
  });
  models.sprites[b] = { kind: "gltf", cells: spec.cells || 1, scale: sz ? sz.scale : (spec.scale || 1), parts: parts, coloured: !!spec.coloured };
});

/* ── Kenney town kit (GLB) and castle kit (OBJ + MTL) ───────────────────────── */
var townDir = path.join(mirror, "fantasy-town-kit-1.0", "Models", "GLTF format"), castleDir = path.join(mirror, "castle-kit-1.0", "Models");
Object.keys(bases).forEach(function (b) {
  var m;
  if ((m = /^t_(.+)$/.exec(b))) {
    copy(path.join(townDir, m[1] + ".glb"), path.join(out, "town", m[1] + ".glb"));
    models.sprites[b] = { kind: "gltf", scale: 1, rotY: 90, parts: [{ file: "town/" + m[1] + ".glb" }] };   /* the kit's "E" render (the sprites' NE) is the model turned a quarter */
  } else if ((m = /^s_(.+)$/.exec(b))) {                                  /* stone statues of the castle kit figures */
    var src = { king: "king", knight: "knightBlue" }[m[1]] || m[1];
    copy(path.join(castleDir, src + ".obj"), path.join(out, "castle", src + ".obj")); copy(path.join(castleDir, src + ".mtl"), path.join(out, "castle", src + ".mtl"));
    models.sprites[b] = { kind: "obj", scale: 0.1, parts: [{ file: "castle/" + src + ".obj" }], stone: true };
  } else if (!/^[a-z]\d?_/.test(b)) {
    if (!fs.existsSync(path.join(castleDir, b + ".obj"))) { console.log("no castle kit model for", b); return; }
    copy(path.join(castleDir, b + ".obj"), path.join(out, "castle", b + ".obj")); copy(path.join(castleDir, b + ".mtl"), path.join(out, "castle", b + ".mtl"));
    models.sprites[b] = { kind: "obj", scale: 0.1, parts: [{ file: "castle/" + b + ".obj" }], coloured: true };
  }
  /* n_, g_, a_ and the flower beds stay sprites: their kits have no models here, so the builder draws them upright, facing the view */
});
fs.writeFileSync(path.join(out, "models.json"), JSON.stringify(models));
console.log("wrote", written, "files,", (bytes / 1048576).toFixed(2), "MiB,", Object.keys(models.sprites).length, "sprite bases; billboards:",
  Object.keys(bases).filter(function (b) { return !models.sprites[b]; }).join(" "));
