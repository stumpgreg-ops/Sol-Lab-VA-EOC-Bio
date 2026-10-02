/* Render the KayKit Medieval Hexagon Pack (CC0, Kay Lousberg) into isometric sprite canvases for the castle kit.

   node tools/render-kaykit.js <kaykit gltf dir> <out dir> [--three <dir with three.module.js + loaders>]

   <kaykit gltf dir> is the pack's Assets/gltf folder (buildings/<colour>, buildings/neutral, decoration/props,
   decoration/nature, units/<colour>). <out dir> gets base/, red/, green/, gold/ with <key>_<NE|SE|SW|NW>.png
   canvases in Kenney's convention (512 wide, 130 px floor cell, front apex of the cell at the canvas origin),
   plus floor1 / floor2 reference tiles, so tools/make-castle-kit.py imports them like any other extra kit.
   The KayKit "blue" set is the base; red and green are the red/ and green/ styles, yellow is gold/.

   three.js (r160: build/three.module.js, examples/jsm/loaders/GLTFLoader.js, OBJLoader.js, MTLLoader.js,
   examples/jsm/utils/BufferGeometryUtils.js) is fetched from github.com/mrdoob/three.js into --three (default
   tools/three/, ignored by git) if it is not there. Needs Playwright's Chromium (WebGL via SwiftShader). */
var path = require("path"), fs = require("fs"), http = require("http"), url = require("url"), cp = require("child_process");
var { chromium } = require("/opt/node22/lib/node_modules/playwright");
var args = process.argv.slice(2), kit = args[0], outDir = args[1], threeDir = path.join(__dirname, "three"), asModule = require.main !== module;
for (var a = 2; a < args.length; a++) if (args[a] === "--three") threeDir = args[++a];
if (!asModule && (!kit || !outDir)) { console.error("usage: node tools/render-kaykit.js <gltf dir> <out dir> [--three <dir>]"); process.exit(2); }

/* v5.5: tools/pack-models.js requires this file for SPECS and COLOURS; nothing runs then */
if (asModule) { module.exports = { SPECS: null, COLOURS: null }; }
var THREE_FILES = { "three.module.js": "build/three.module.js", "GLTFLoader.js": "examples/jsm/loaders/GLTFLoader.js", "OBJLoader.js": "examples/jsm/loaders/OBJLoader.js",
  "MTLLoader.js": "examples/jsm/loaders/MTLLoader.js", "BufferGeometryUtils.js": "examples/jsm/utils/BufferGeometryUtils.js" };
if (!asModule) fs.mkdirSync(threeDir, { recursive: true });
if (!asModule) Object.keys(THREE_FILES).forEach(function (f) {
  var p = path.join(threeDir, f);
  if (!fs.existsSync(p)) { console.log("fetching three.js", f); cp.execFileSync("curl", ["-sS", "-f", "-L", "-o", p, "https://raw.githubusercontent.com/mrdoob/three.js/r160/" + THREE_FILES[f]]); }
});

var COLOURS = { blue: "base", red: "red", green: "green", yellow: "gold" };
var ORIENTS = ["NE", "SE", "SW", "NW"];
/* what to render: key -> spec. cells: footprint size; scale: fraction of the footprint the model fills (default 0.94);
   coloured: render the four colour sets; url: relative to the gltf dir (<c> = colour). */
/* KayKit buildings are squat next to Kenney's wall and tower tiles, so they fill 1.18 of their footprint's width (neighbours overlap a little, as they do anyway) */
var B = function (name, cells, scale) { return { url: "buildings/<c>/building_" + name + "_<c>.gltf", cells: cells, coloured: true, scale: scale || 1.18 }; };
var N = function (rel, cells, scale, extra) { var s = { url: rel, cells: cells || 1, scale: scale }; if (extra) Object.keys(extra).forEach(function (k) { s[k] = extra[k]; }); return s; };
var SPECS = {
  floor1: { parts: [{ floor: 1 }], cells: 1, fit: false }, floor2: { parts: [{ floor: 2 }], cells: 2, fit: false }, floor3: { parts: [{ floor: 3 }], cells: 3, fit: false },
  /* buildings in four colours */
  castle: B("castle", 3, 1.0), townhall: B("townhall", 2), barracks: B("barracks", 2), archeryrange: B("archeryrange", 2), market: B("market", 2), mine: B("mine", 2),
  shipyard: B("shipyard", 2), stables: B("stables", 2), tent: B("tent", 2), workshop: B("workshop", 2),
  blacksmith: B("blacksmith", 1), church: B("church", 1), home_A: B("home_A", 1), home_B: B("home_B", 1), lumbermill: B("lumbermill", 1), shrine: B("shrine", 1),
  tavern: B("tavern", 1), tower_A: B("tower_A", 1), tower_B: B("tower_B", 1), tower_base: B("tower_base", 1), tower_cannon: B("tower_cannon", 1),
  tower_catapult: B("tower_catapult", 1), watchtower: B("watchtower", 1), watermill: B("watermill", 1), well: B("well", 1), windmill: B("windmill", 1),
  /* neutral buildings */
  grain: N("buildings/neutral/building_grain.gltf", 2, 1.1), scaffolding: N("buildings/neutral/building_scaffolding.gltf", 2, 1.15), destroyed: N("buildings/neutral/building_destroyed.gltf", 2, 1.15),
  stage_A: N("buildings/neutral/building_stage_A.gltf", 1, 1.1), stage_C: N("buildings/neutral/building_stage_C.gltf", 1, 1.1),
  /* props: small things are scaled up or grouped so they read on a cell */
  barrels: { parts: [{ url: "decoration/props/barrel.gltf", dx: -0.16, dz: 0.1 }, { url: "decoration/props/barrel.gltf", dx: 0.12, dz: 0.16 }, { url: "decoration/props/barrel.gltf", dx: -0.02, dz: -0.14 }], cells: 1, scale: 0.5 },
  crates: { parts: [{ url: "decoration/props/crate_A_big.gltf", dx: -0.14, dz: 0.08 }, { url: "decoration/props/crate_B_small.gltf", dx: 0.14, dz: 0.12 }, { url: "decoration/props/crate_long_A.gltf", dx: 0.02, dz: -0.16 }], cells: 1, scale: 0.55 },
  supplies: { parts: [{ url: "decoration/props/resource_lumber.gltf", dx: -0.05, dz: 0.12 }, { url: "decoration/props/resource_stone.gltf", dx: 0.12, dz: -0.16 }, { url: "decoration/props/sack.gltf", dx: -0.22, dz: -0.14 }], cells: 1, scale: 0.65 },
  haybales: { parts: [{ url: "decoration/props/haybale.gltf", dx: -0.12, dz: 0.1 }, { url: "decoration/props/haybale.gltf", dx: 0.14, dz: -0.1, rotY: 90 }], cells: 1, scale: 0.6 },
  wheelbarrow: N("decoration/props/wheelbarrow.gltf", 1, 0.55), target: N("decoration/props/target.gltf", 1, 0.4), weaponrack: N("decoration/props/weaponrack.gltf", 1, 0.4),
  trough: N("decoration/props/trough_long.gltf", 1, 0.5), cannonballs: N("decoration/props/cannonball_pallet.gltf", 1, 0.4), small_tent: N("decoration/props/tent.gltf", 1, 0.62),
  bucket: N("decoration/props/bucket_water.gltf", 1, 0.25), pallet: N("decoration/props/pallet.gltf", 1, 0.45),
  /* units */
  cart: N("units/neutral/cart.gltf", 1, 0.8), merchant_cart: N("units/neutral/cart_merchant.gltf", 1, 0.85), catapult: N("units/neutral/catapult.gltf", 1, 0.85), cannon: N("units/neutral/cannon.gltf", 1, 0.8),
  horse: N("units/neutral/horse_A.gltf", 1, 0.6), soldier: { url: "units/<c>/unit_<c>_full.gltf", cells: 1, coloured: true, scale: 0.42 }, banner: { url: "units/<c>/banner_<c>_full.gltf", cells: 1, coloured: true, scale: 0.36 },
  flag: { url: "decoration/props/flag_<c>.gltf", cells: 1, coloured: true, scale: 0.35 },
  /* nature */
  tree_A: N("decoration/nature/tree_single_A.gltf", 1, 1.0), tree_B: N("decoration/nature/tree_single_B.gltf", 1, 1.0), grove_A: N("decoration/nature/trees_A_medium.gltf", 2, 1.05),
  grove_B: N("decoration/nature/trees_B_medium.gltf", 2, 1.05), rock: N("decoration/nature/rock_single_C.gltf", 1, 0.5),
  rocks: { parts: [{ url: "decoration/nature/rock_single_A.gltf", dx: -0.16, dz: 0.1 }, { url: "decoration/nature/rock_single_B.gltf", dx: 0.14, dz: 0.14 }, { url: "decoration/nature/rock_single_C.gltf", dx: 0.02, dz: -0.16 }], cells: 1, scale: 0.6 },
};
var MIME = { html: "text/html", js: "application/javascript", gltf: "model/gltf+json", bin: "application/octet-stream", png: "image/png", obj: "text/plain", mtl: "text/plain" };
var srv = http.createServer(function (req, res) {
  var p = decodeURIComponent(url.parse(req.url).pathname), f;
  if (p.startsWith("/three/")) f = path.join(threeDir, p.slice(7));
  else if (p.startsWith("/model/")) f = path.join(kit, p.slice(7));
  else f = path.join(__dirname, "render-iso.html");
  fs.readFile(f, function (err, buf) { if (err) { res.writeHead(404); res.end(); return; } res.writeHead(200, { "Content-Type": MIME[f.split(".").pop()] || "application/octet-stream" }); res.end(buf); });
});
if (asModule) { module.exports.SPECS = SPECS; module.exports.COLOURS = COLOURS; }
if (!asModule) (async function () {
  await new Promise(function (r) { srv.listen(0, r); });
  var base = "http://127.0.0.1:" + srv.address().port;
  var browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  var page = await browser.newPage();
  page.on("pageerror", function (e) { console.log("pageerror", e.message); });
  page.on("console", function (m) { if (m.type() === "error") console.log("console", m.text()); });
  await page.goto(base + "/render-iso.html", { waitUntil: "load" });
  await page.waitForFunction(function () { return !!window.renderIso; });
  Object.keys(COLOURS).forEach(function (c) { fs.mkdirSync(path.join(outDir, COLOURS[c]), { recursive: true }); });
  var sizes = {}, n = 0;
  /* first pass: render each model at scale 1 and measure its width in pixels, so the fit scale is known
     (KayKit buildings stand on hexagonal bases, which are narrower on screen than their bounding box) */
  async function measure(spec, colour) {
    var parts = (spec.parts || [{ url: spec.url }]).map(function (pt) { return pt.floor ? pt : { url: "/model/" + pt.url.replace(/<c>/g, colour), dx: pt.dx, dz: pt.dz, rotY: pt.rotY, scale: pt.scale }; });
    var r = await page.evaluate(function (s) { return window.measureIso(s); }, { parts: parts, scale: 1 });
    return { parts: parts, px: r.w };
  }
  for (var key in SPECS) {
    var spec = SPECS[key], colours = spec.coloured ? Object.keys(COLOURS) : ["blue"];
    for (var ci = 0; ci < colours.length; ci++) {
      /* scale: the fraction of the footprint's width on screen (cells × 130 px) the model fills (0.94 for buildings; less for props) */
      var colour = colours[ci], m = await measure(spec, colour), k = spec.fit === false ? 1 : ((spec.scale || 0.94) * spec.cells * 130) / m.px;
      var r = await page.evaluate(function (s) { return window.renderIso(s, ["NE", "SE", "SW", "NW"]); }, { parts: m.parts, scale: k });
      for (var oi = 0; oi < ORIENTS.length; oi++) {
        var o = ORIENTS[oi], dst = path.join(outDir, COLOURS[colour], key + "_" + o + ".png");
        fs.writeFileSync(dst, Buffer.from(r.png[o].split(",")[1], "base64")); n++;
      }
      if (colour === "blue") sizes[key] = { cells: spec.cells, scale: +k.toFixed(3), px: Math.round(m.px * k), height: +(r.height).toFixed(2) };
    }
    console.log(key, JSON.stringify(sizes[key]));
  }
  fs.writeFileSync(path.join(outDir, "sizes.json"), JSON.stringify(sizes, null, 1));
  await browser.close(); srv.close();
  console.log("wrote", n, "canvases to", outDir);
})().catch(function (e) { console.error(e); process.exit(1); });
