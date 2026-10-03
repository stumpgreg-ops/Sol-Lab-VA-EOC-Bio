/* SOL Labyrinth v5.8.0 — shooter levels.
 *
 * Every other level of each realm (levels 2, 4, 6 and 8) swaps the maze for a
 * shooter, in rotation:
 *   2  Eagle Swoop   galaga style: eagles carry the letters above a raven guard and dive; shoot the right eagle
 *   4  Rune Rocks    asteroids style: beam in the rock with the right letter, blast the rest
 *   6  Sun Chariot   side-scrolling flyer: shoot the letter orb with the right answer
 *   8  Wolf Ring     arena: Hati attack; runestones rise one or two at a time; shoot the right one while it is up
 * Odd levels stay in the maze and every tenth level is still Fenrir's boss maze.
 *
 * The questions, the reading pop-up, lives, coins, the adaptive level,
 * the castle perks and the end-of-level screens are the maze's own: ModeScene
 * extends NightScene and only replaces the playfield. A wrong letter costs a life
 * and so does getting hit, the same as a wrong letter or a catch in the maze.
 *
 * game.js calls SolModes.install(NightScene, internals) after SolRealms.install
 * and switches scenes in restartNight(). Load order: after realms.js, before game.js.
 */
(function () {
  "use strict";

  var MODES = {
    raid: {
      id: "raid", name: "Eagle Swoop", kind: "galaga-style level",
      how: "Great eagles fly in and take the top of the sky, each carrying a letter in its talons, with two guard ravens under each eagle and rows of ravens below. Once the flock has formed, shoot the eagle that carries the right answer — it takes two arrows. Birds are always swooping down at Sol, and an eagle can stop and shine a beam down to catch him.",
      rules: "A wrong letter costs a life. So does bird poo landing on you, a bird crashing into you, or getting caught in an eagle's beam. You can't shoot until the flock has flown into formation.",
      keys: "◀ ▶ or A / D move · Space, FIRE or a mouse button shoots (clicking does not move Sol).",
      tip: "EAGLE SWOOP — shoot the eagle with the right letter. Dodge the poo and the beams.",
      hint1: "Shoot the eagle carrying the right letter — it takes two arrows. The lab notes stay in the side panel.",
      hint2: "This question has two right letters. Shoot both eagles that carry them.",
      news: ["",
        "Bird poo now drifts toward where you stand, and every diving bird drops two.",
        "The eagles trade places in the formation now and then. Keep your eye on the right letter.",
        "Iron-helmed eagles: an eagle now takes three arrows.",
        "A third row of ravens guards the eagles.",
        "A storm cloud drifts across the flock. Arrows can't get through it.",
        "An eagle's catching beam now follows you.",
        "Ravens in the formation drop poo too, not just the divers.",
        "Two storm clouds, and the eagles trade places more often.",
        "Ragnarok: one more bird dives at a time, on top of everything else."]
    },
    rocks: {
      id: "rocks", name: "Rune Rocks", kind: "asteroids level",
      how: "Rocks drift through space and a few carry letters. Hold your beam on the rock with the right answer to pull it in. Blast the wrong letters and the plain rocks before they hit you.",
      rules: "Pulling in a wrong letter costs a life. So does blasting the right answer, or a rock hitting your ship — including a rock you let go of before it reached you.",
      keys: "◀ ▶ turn · ▲ thrust · Space, FIRE or the left mouse button shoots · ▼, Shift, PULL or the right mouse button holds the beam. The mouse never steers the ship.",
      tip: "RUNE ROCKS — beam in the right letter, blast the rest. Don't get hit.",
      hint1: "Pull in the rock with the right letter (▼, Shift or PULL). Blast the others. The lab notes stay in the side panel.",
      hint2: "This question has two right letters. Pull in both rocks that carry them.",
      news: ["",
        "Comets: a red line flashes where a comet will streak across a second later. Get out of its way.",
        "Iron rocks: the big grey-blue rocks take two shots.",
        "Heavy runes: the beam pulls letter rocks in more slowly. Hold it longer.",
        "Slippery space: your ship drifts further before it stops.",
        "Guard stones: two small stones circle every letter rock. Shoot them off before the beam can pull it in.",
        "Comets come twice as often, in pairs.",
        "A valkyrie flies past and throws spears at your ship. Shoot her for a bonus.",
        "Rock showers: a wave of small rocks pours in from one side (an arrow shows where first).",
        "Ragnarok: every rock moves faster, on top of everything else."]
    },
    sky: {
      id: "sky", name: "Sun Chariot", kind: "flying shooter level",
      how: "Sol drives the sun's chariot across the sky. Letter orbs float past among ravens and will-o'-wisps, each inside a turning golden shield with one gap in it. A sunbolt only gets through when the gap faces you, so time your shot. Shoot the orb with the right answer; orbs you miss come round again. Ravens throw feathers at you (they glow orange first), and in later realms wisps throw sparks and a raven guards some orbs — shoot the guard out of the way.",
      rules: "Shooting a wrong orb costs a life. So does a feather, a spark, or flying into a raven or a wisp.",
      keys: "Arrow keys, WASD or the on-screen pad fly · Space, FIRE or a mouse button shoots (clicking does not move the chariot).",
      tip: "SUN CHARIOT — shoot the right orb through the gap in its shield. Dodge the ravens, wisps and feathers.",
      hint1: "Shoot the orb with the right letter through the gap in its turning shield. The lab notes stay in the side panel.",
      hint2: "This question has two right letters. Shoot both orbs that carry them, through the gaps in their shields.",
      news: ["",
        "A raven flies in front of one orb to guard it, the orbs weave more, and the shield gaps are narrower.",
        "Will-o'-wisps throw sparks at you.",
        "Shields now reverse direction without warning, and two orbs have guards.",
        "Narrower gaps and faster shields.",
        "Three orbs have guards.",
        "Every shield spins at its own speed.",
        "Four orbs have guards.",
        "Narrower gaps and faster shields again.",
        "Ragnarok: the narrowest, fastest shields of all."]
    },
    ring: {
      id: "ring", name: "Wolf Ring", kind: "arena level",
      how: "Sol stands in a stone ring while the Hati attack. The letter runestones are sunk in the ground: after the wolves come, they rise one or two at a time, in any order and anywhere round the ring, and sink again a few seconds later. Shoot the runestone with the right answer while it is up. An arrow sends a wolf running.",
      rules: "Shooting a wrong stone costs a life. So does letting a wolf reach you.",
      keys: "Arrow keys or WASD move and aim · Space or FIRE shoots · or click or tap to aim and shoot (Sol does not move).",
      tip: "WOLF RING — watch for the right runestone to rise, and shoot it. Keep the wolves off.",
      hint1: "The runestones rise after the wolves come. Shoot the one with the right letter while it is up. The lab notes stay in the side panel.",
      hint2: "This question has two right letters. Shoot both runestones that carry them.",
      news: ["",
        "Wolf packs: the Hati sometimes come two at a time from the same side.",
        "The alpha wolf: a big grey wolf that takes three arrows to send away.",
        "Ravens fly over the ring and drop poo. A shadow shows where it will land.",
        "The runestones slide round the ring while they are up.",
        "A quiver of six arrows: each one comes back after a moment, so don't waste them.",
        "Some wolves zig-zag as they run at you.",
        "The runestones stay up for less time, and two alpha wolves can come at once.",
        "Leaping wolves: some crouch, then leap the last stretch.",
        "Ragnarok: the wolves come faster, on top of everything else."]
    }
  };
  var SLOTS = { 2: "raid", 4: "rocks", 6: "sky", 8: "ring" };
  var BEAM_KEY = "afterHours.v1.beamLearned";   /* set once a student has pulled a rock in */

  function modeFor(n) {
    n = Math.floor(Number(n) || 0);
    if (n < 1 || n > 100) return null;
    var id = SLOTS[((n - 1) % 10) + 1];
    return id ? MODES[id] : null;
  }

  /* ── small helpers ── */
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function dist(ax, ay, bx, by) { var dx = ax - bx, dy = ay - by; return Math.sqrt(dx * dx + dy * dy); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function hex(c) { return "#" + ("000000" + (c >>> 0).toString(16)).slice(-6); }
  function mix(a, b, t) {
    var ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255, br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255;
    return (Math.round(ar + (br - ar) * t) << 16) | (Math.round(ag + (bg - ag) * t) << 8) | Math.round(ab + (bb - ab) * t);
  }
  function angDiff(a, b) { var d = a - b; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; return d; }
  function kill(o) {
    if (!o) return;
    ["spr", "label", "shield", "extra"].forEach(function (k) { if (o[k]) { try { o[k].destroy(); } catch (e) {} o[k] = null; } });
  }

  /* sound: the realm kit's WebAudio blips (quiet; nothing flashes) */
  function snd(name) {
    var R = window.SolRealms;
    if (!R || !R.blip) return;
    try {
      if (name === "shot") R.blip(1100, 520, 0.07, "square", 0.018);
      else if (name === "pop") { R.hiss(0.16, 1800, 0.04); R.blip(420, 180, 0.12, "triangle", 0.03); }
      else if (name === "rock") { R.hiss(0.28, 500, 0.06); }
      else if (name === "beam") R.blip(300, 360, 0.12, "sine", 0.02);
      else if (name === "yelp") { R.blip(900, 1300, 0.08, "triangle", 0.04); R.blip(1300, 700, 0.12, "triangle", 0.035, 0.08); }
      else if (name === "caw" && R.sfx) R.sfx.caw();
      else if (name === "chime" && R.sfx) R.sfx.chime();
      else if (name === "howl" && R.sfx) R.sfx.howl();
    } catch (e) {}
  }

  /* ── art, drawn once into canvas textures ── */
  function canvasTex(scene, key, w, h, draw) {
    if (scene.textures.exists(key)) return;
    var t = scene.textures.createCanvas(key, w, h);
    if (!t) return;
    draw(t.getContext(), w, h);
    t.refresh();
  }
  function drawArrow(c, w, h) {
    c.strokeStyle = "#e8d6a8"; c.lineWidth = 3; c.beginPath(); c.moveTo(w / 2, 9); c.lineTo(w / 2, h - 3); c.stroke();
    c.fillStyle = "#ffd84a"; c.beginPath(); c.moveTo(w / 2, 0); c.lineTo(w - 1, 11); c.lineTo(1, 11); c.closePath(); c.fill();
    c.fillStyle = "#d8553f"; c.fillRect(1, h - 10, 3, 9); c.fillRect(w - 4, h - 10, 3, 9);
  }
  function drawBolt(c, w, h) {
    var g = c.createRadialGradient(w * 0.62, h / 2, 1, w * 0.62, h / 2, w * 0.5);
    g.addColorStop(0, "rgba(255,255,230,1)"); g.addColorStop(0.35, "rgba(255,220,90,0.95)"); g.addColorStop(1, "rgba(255,150,30,0)");
    c.fillStyle = g; c.beginPath(); c.ellipse(w / 2, h / 2, w / 2, h / 2, 0, 0, Math.PI * 2); c.fill();
  }
  /* v5.7.7: bird poo — thick and white with a dark outline so it reads on any sky */
  function drawPoo(c, w, h) {
    c.fillStyle = "#1a1a22"; c.beginPath(); c.moveTo(w / 2, 1); c.quadraticCurveTo(w - 1, h * 0.55, w / 2, h - 1); c.quadraticCurveTo(1, h * 0.55, w / 2, 1); c.fill();
    c.fillStyle = "#f7f7ee"; c.beginPath(); c.moveTo(w / 2, 4); c.quadraticCurveTo(w - 4, h * 0.56, w / 2, h - 4); c.quadraticCurveTo(4, h * 0.56, w / 2, 4); c.fill();
    c.fillStyle = "#b9b9a8"; c.beginPath(); c.arc(w * 0.42, h * 0.66, w * 0.14, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#ffffff"; c.beginPath(); c.arc(w * 0.6, h * 0.48, w * 0.09, 0, Math.PI * 2); c.fill();
  }
  function drawSplat(c, w, h) {
    var cx = w / 2, cy = h / 2, i, a, r;
    c.fillStyle = "#1a1a22"; c.beginPath();
    for (i = 0; i <= 16; i++) { a = i / 16 * Math.PI * 2; r = (i % 2 ? 0.28 : 0.46) * w; c[i ? "lineTo" : "moveTo"](cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.8); }
    c.fill();
    c.fillStyle = "#f7f7ee"; c.beginPath();
    for (i = 0; i <= 16; i++) { a = i / 16 * Math.PI * 2; r = (i % 2 ? 0.23 : 0.41) * w; c[i ? "lineTo" : "moveTo"](cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.8); }
    c.fill();
    c.fillStyle = "#c8c8b6"; c.beginPath(); c.arc(cx - w * 0.08, cy + h * 0.06, w * 0.1, 0, Math.PI * 2); c.fill();
  }
  function drawFeather(c, w, h) {
    /* v5.7.7: a light outline so a dark feather shows against a dark sky */
    c.fillStyle = "#f2ecff"; c.beginPath(); c.moveTo(w / 2, 0);
    c.quadraticCurveTo(w, h * 0.45, w / 2, h - 1); c.quadraticCurveTo(0, h * 0.45, w / 2, 0); c.fill();
    c.fillStyle = "#2a2238"; c.beginPath(); c.moveTo(w / 2, 3);
    c.quadraticCurveTo(w - 3, h * 0.45, w / 2, h - 4); c.quadraticCurveTo(3, h * 0.45, w / 2, 3); c.fill();
    c.strokeStyle = "#c8c0e8"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(w / 2, 3); c.lineTo(w / 2, h); c.stroke();
  }
  function drawEagle(up) {
    return function (c, w, h) {
      var cx = w / 2;
      /* wings */
      c.fillStyle = "#4a321c"; c.strokeStyle = "#d8a73a"; c.lineWidth = 1.5;
      [-1, 1].forEach(function (sd) {
        c.beginPath(); c.moveTo(cx + sd * 8, 24);
        if (up) { c.lineTo(cx + sd * 30, 4); c.lineTo(cx + sd * 43, 2); c.lineTo(cx + sd * 38, 12); c.lineTo(cx + sd * 42, 16); c.lineTo(cx + sd * 34, 22); c.lineTo(cx + sd * 36, 28); c.lineTo(cx + sd * 12, 36); }
        else { c.lineTo(cx + sd * 30, 22); c.lineTo(cx + sd * 43, 34); c.lineTo(cx + sd * 34, 36); c.lineTo(cx + sd * 38, 44); c.lineTo(cx + sd * 28, 42); c.lineTo(cx + sd * 26, 48); c.lineTo(cx + sd * 12, 38); }
        c.closePath(); c.fill(); c.stroke();
      });
      /* tail, body, head */
      c.fillStyle = "#e8e2d0"; c.beginPath(); c.moveTo(cx - 8, 44); c.lineTo(cx + 8, 44); c.lineTo(cx + 11, 54); c.lineTo(cx - 11, 54); c.closePath(); c.fill();
      c.fillStyle = "#6a4a2a"; c.beginPath(); c.ellipse(cx, 32, 11, 16, 0, 0, Math.PI * 2); c.fill();
      c.fillStyle = "#f2efe6"; c.beginPath(); c.arc(cx, 15, 8.5, 0, Math.PI * 2); c.fill();
      c.fillStyle = "#f0b030"; c.beginPath(); c.moveTo(cx - 3.5, 17); c.lineTo(cx + 3.5, 17); c.lineTo(cx, 25); c.closePath(); c.fill();
      c.fillStyle = "#1a1208"; c.beginPath(); c.arc(cx - 3.5, 13, 1.6, 0, Math.PI * 2); c.arc(cx + 3.5, 13, 1.6, 0, Math.PI * 2); c.fill();
      /* talons, gripping the letter below */
      c.strokeStyle = "#f0b030"; c.lineWidth = 3;
      c.beginPath(); c.moveTo(cx - 5, 44); c.lineTo(cx - 8, h - 2); c.moveTo(cx + 5, 44); c.lineTo(cx + 8, h - 2); c.stroke();
    };
  }
  function drawCloud(c, w, h) {
    var puffs = [[0.22, 0.6, 0.2], [0.4, 0.42, 0.26], [0.62, 0.45, 0.24], [0.8, 0.62, 0.18], [0.5, 0.68, 0.26]];
    c.fillStyle = "#c8d0e0"; puffs.forEach(function (q) { c.beginPath(); c.arc(q[0] * w, q[1] * h, q[2] * w * 0.5 + 3, 0, Math.PI * 2); c.fill(); });
    c.fillStyle = "#5e6878"; puffs.forEach(function (q) { c.beginPath(); c.arc(q[0] * w, q[1] * h, q[2] * w * 0.5, 0, Math.PI * 2); c.fill(); });
    c.fillStyle = "rgba(255,255,255,0.18)"; c.beginPath(); c.arc(0.4 * w, 0.36 * h, 0.1 * w, 0, Math.PI * 2); c.fill();
  }
  function drawShield(c, w, h) {
    var r = w / 2 - 2;
    c.fillStyle = "#b8742e"; c.beginPath(); c.arc(w / 2, h / 2, r, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#f3e1a8"; c.beginPath(); c.arc(w / 2, h / 2, r - 6, 0, Math.PI * 2); c.fill();
    c.strokeStyle = "#ffd84a"; c.lineWidth = 3; c.beginPath(); c.arc(w / 2, h / 2, r, 0, Math.PI * 2); c.stroke();
  }
  function rockShape(seed) {
    var pts = [], n = 11, i, s = seed * 9301 + 49297;
    for (i = 0; i < n; i++) { s = (s * 9301 + 49297) % 233280; pts.push(0.74 + (s / 233280) * 0.26); }
    return pts;
  }
  function drawRock(seed, lettered) {
    return function (c, w, h) {
      var pts = rockShape(seed), n = pts.length, i, a, r = w * 0.46, cx = w / 2, cy = h / 2;
      c.beginPath();
      for (i = 0; i < n; i++) { a = i / n * Math.PI * 2; c[i ? "lineTo" : "moveTo"](cx + Math.cos(a) * r * pts[i], cy + Math.sin(a) * r * pts[i]); }
      c.closePath();
      var g = c.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
      if (lettered) { g.addColorStop(0, "#8a7a5a"); g.addColorStop(1, "#3e3424"); }
      else { g.addColorStop(0, "#8c8a88"); g.addColorStop(1, "#3a3836"); }
      c.fillStyle = g; c.fill();
      c.lineWidth = lettered ? 4 : 2; c.strokeStyle = lettered ? "#ffd84a" : "#1e1c1a"; c.stroke();
      c.fillStyle = "rgba(0,0,0,0.25)";
      [[0.3, -0.2, 0.14], [-0.35, 0.25, 0.1], [0.1, 0.4, 0.08]].forEach(function (k) { c.beginPath(); c.arc(cx + k[0] * r, cy + k[1] * r, k[2] * r, 0, Math.PI * 2); c.fill(); });
    };
  }
  function drawShip(c, w, h) {
    var g = c.createRadialGradient(w / 2, h * 0.58, 2, w / 2, h * 0.58, w * 0.5);
    g.addColorStop(0, "rgba(255,230,120,0.55)"); g.addColorStop(1, "rgba(255,200,60,0)");
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = "#f0c040"; c.beginPath(); c.moveTo(w / 2, 2); c.lineTo(w - 6, h - 6); c.lineTo(w / 2, h - 16); c.lineTo(6, h - 6); c.closePath(); c.fill();
    c.strokeStyle = "#7a4a10"; c.lineWidth = 2.5; c.stroke();
    c.fillStyle = "#8ad8ff"; c.beginPath(); c.ellipse(w / 2, h * 0.46, 5, 9, 0, 0, Math.PI * 2); c.fill();
  }
  function drawChariot(c, w, h) {
    var g = c.createRadialGradient(w * 0.34, h * 0.36, 3, w * 0.34, h * 0.36, 34);
    g.addColorStop(0, "rgba(255,250,200,1)"); g.addColorStop(0.5, "rgba(255,210,70,0.9)"); g.addColorStop(1, "rgba(255,150,30,0)");
    c.fillStyle = g; c.beginPath(); c.arc(w * 0.34, h * 0.36, 34, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#c8902a"; c.beginPath(); c.moveTo(14, h * 0.5); c.lineTo(w - 26, h * 0.5); c.quadraticCurveTo(w - 10, h * 0.5, w - 14, h * 0.74); c.lineTo(20, h * 0.74); c.closePath(); c.fill();
    c.strokeStyle = "#6a3e0c"; c.lineWidth = 2; c.stroke();
    c.strokeStyle = "#ffe07a"; c.lineWidth = 4; c.beginPath(); c.moveTo(w - 16, h * 0.56); c.lineTo(w - 2, h * 0.44); c.stroke();
    c.fillStyle = "#6a3e0c"; c.beginPath(); c.arc(w * 0.42, h * 0.8, 11, 0, Math.PI * 2); c.fill();
    c.strokeStyle = "#ffd84a"; c.lineWidth = 3; c.beginPath(); c.arc(w * 0.42, h * 0.8, 11, 0, Math.PI * 2); c.stroke();
    c.beginPath(); c.moveTo(w * 0.42 - 11, h * 0.8); c.lineTo(w * 0.42 + 11, h * 0.8); c.moveTo(w * 0.42, h * 0.8 - 11); c.lineTo(w * 0.42, h * 0.8 + 11); c.stroke();
  }
  /* v5.7.9: the sun chariot with two golden horses pulling it, facing right. The car sits in the left half
     (its centre at x = TEAM_CAR), the horses in the right; frame 0 and 1 are the two strides of a gallop. */
  var TEAM_W = 200, TEAM_H = 80, TEAM_CAR = 45;
  function drawHorse(c, x, y, frame, body, shade) {
    var ln = function (pts, w, col) { c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round"; c.beginPath(); pts.forEach(function (q, i) { c[i ? "lineTo" : "moveTo"](q[0], q[1]); }); c.stroke(); };
    var legs = frame ? [[[x + 13, y + 6], [x + 20, y + 14], [x + 14, y + 23]], [[x + 9, y + 6], [x + 12, y + 16], [x + 6, y + 23]], [[x - 12, y + 6], [x - 6, y + 15], [x - 10, y + 23]], [[x - 16, y + 6], [x - 14, y + 16], [x - 18, y + 23]]]
                     : [[[x + 13, y + 6], [x + 24, y + 12], [x + 32, y + 18]], [[x + 9, y + 6], [x + 18, y + 14], [x + 24, y + 21]], [[x - 12, y + 6], [x - 22, y + 13], [x - 30, y + 19]], [[x - 16, y + 6], [x - 26, y + 12], [x - 34, y + 16]]];
    legs.forEach(function (L) { ln(L, 5.5, "#5a3c12"); ln(L, 3.4, shade); });
    /* tail: a golden flame */
    ln([[x - 20, y - 4], [x - 30, y - 6], [x - 38, y + 2]], 6, "#5a3c12"); ln([[x - 20, y - 4], [x - 30, y - 6], [x - 38, y + 2]], 4, "#ffcf4a");
    /* body, neck, head */
    c.fillStyle = body; c.strokeStyle = "#5a3c12"; c.lineWidth = 1.6;
    c.beginPath(); c.ellipse(x, y, 22, 10.5, 0, 0, Math.PI * 2); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(x + 12, y - 6); c.lineTo(x + 22, y - 20); c.lineTo(x + 30, y - 17); c.lineTo(x + 21, y + 1); c.closePath(); c.fill(); c.stroke();
    c.save(); c.translate(x + 32, y - 17); c.rotate(0.55); c.beginPath(); c.ellipse(0, 0, 9.5, 5, 0, 0, Math.PI * 2); c.fill(); c.stroke(); c.restore();
    c.beginPath(); c.moveTo(x + 24, y - 21); c.lineTo(x + 26, y - 28); c.lineTo(x + 29, y - 20); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = "#2a1a08"; c.beginPath(); c.arc(x + 31, y - 19, 1.4, 0, Math.PI * 2); c.fill();
    /* mane */
    ln([[x + 12, y - 8], [x + 17, y - 16], [x + 23, y - 22]], 4.5, "#ffcf4a");
  }
  function drawTeam(frame) {
    return function (c, w, h) {
      /* the traces from the car to the horses' chests */
      c.strokeStyle = "#7a4a10"; c.lineWidth = 2.5;
      c.beginPath(); c.moveTo(92, 50); c.lineTo(148, 42); c.moveTo(92, 54); c.lineTo(136, 54); c.stroke();
      drawHorse(c, 150, 38, frame ? 0 : 1, "#e2d4ae", "#cdbb8c");   /* the far horse, a stride apart */
      c.save(); c.translate(0, 6); drawChariot(c, 100, 72); c.restore();
      drawHorse(c, 136, 50, frame, "#f7eed6", "#e6d8b2");
    };
  }
  function drawOrb(c, w, h) {
    var g = c.createRadialGradient(w * 0.42, h * 0.38, 2, w / 2, h / 2, w / 2);
    g.addColorStop(0, "rgba(255,255,255,0.95)"); g.addColorStop(0.45, "rgba(170,210,255,0.75)"); g.addColorStop(0.85, "rgba(80,120,220,0.55)"); g.addColorStop(1, "rgba(60,90,200,0)");
    c.fillStyle = g; c.beginPath(); c.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2); c.fill();
    c.strokeStyle = "rgba(255,230,140,0.9)"; c.lineWidth = 2.5; c.beginPath(); c.arc(w / 2, h / 2, w / 2 - 6, 0, Math.PI * 2); c.stroke();
  }
  function drawStone(c, w, h) {
    c.fillStyle = "rgba(0,0,0,0.3)"; c.beginPath(); c.ellipse(w / 2, h - 6, w * 0.42, 6, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#77736c"; c.beginPath(); c.moveTo(6, h - 8); c.lineTo(8, 22); c.quadraticCurveTo(w / 2, -6, w - 8, 22); c.lineTo(w - 6, h - 8); c.closePath(); c.fill();
    c.strokeStyle = "#35322e"; c.lineWidth = 3; c.stroke();
    c.strokeStyle = "rgba(255,255,255,0.18)"; c.lineWidth = 2; c.beginPath(); c.moveTo(14, h - 14); c.lineTo(14, 26); c.stroke();
  }
  function drawHills(color, amp, seed) {
    return function (c, w, h) {
      c.fillStyle = hex(color); c.beginPath(); c.moveTo(0, h);
      for (var x = 0; x <= w; x += 4) {
        var t = x / w * Math.PI * 2;
        var y = h * 0.45 - Math.sin(t * 2 + seed) * amp * 0.5 - Math.sin(t * 5 + seed * 2) * amp * 0.25 - Math.sin(t * 9 + seed * 3) * amp * 0.12;
        c.lineTo(x, y);
      }
      c.lineTo(w, h); c.closePath(); c.fill();
    };
  }
  function ensureModeArt(scene, pal) {
    canvasTex(scene, "md-arrow", 12, 34, drawArrow);
    canvasTex(scene, "md-bolt", 34, 12, drawBolt);
    canvasTex(scene, "md-feather", 16, 32, drawFeather);
    canvasTex(scene, "md-poo", 22, 28, drawPoo);
    canvasTex(scene, "md-splat", 54, 44, drawSplat);
    canvasTex(scene, "md-shield", 42, 42, drawShield);
    canvasTex(scene, "md-cloud", 180, 80, drawCloud);
    canvasTex(scene, "md-eagle-0", 88, 62, drawEagle(true));
    canvasTex(scene, "md-eagle-1", 88, 62, drawEagle(false));
    for (var i = 0; i < 3; i++) canvasTex(scene, "md-rock-" + i, 100, 100, drawRock(i + 1, false));
    canvasTex(scene, "md-rock-l", 100, 100, drawRock(7, true));
    canvasTex(scene, "md-ship", 44, 52, drawShip);
    canvasTex(scene, "md-chariot", 110, 72, drawChariot);
    canvasTex(scene, "md-team-0", TEAM_W, TEAM_H, drawTeam(0));
    canvasTex(scene, "md-team-1", TEAM_W, TEAM_H, drawTeam(1));
    canvasTex(scene, "md-orb", 70, 70, drawOrb);
    canvasTex(scene, "md-stone", 58, 72, drawStone);
    if (pal && scene.realm) {
      canvasTex(scene, "md-hills-far-" + scene.realm.id, 512, 200, drawHills(mix(pal.wall, pal.void, 0.35), 90, 1));
      canvasTex(scene, "md-hills-near-" + scene.realm.id, 512, 150, drawHills(mix(pal.wall, pal.stroke, 0.25), 60, 4));
    }
    if (window.SolRealms && SolRealms._ensureArt) { try { SolRealms._ensureArt(scene); } catch (e) {} }
  }

  function install(NightScene, K) {
    var Input = K.Input;

    class ModeScene extends NightScene {
      constructor() { super("mode"); }

      init(data) {
        super.init(data);   /* family, strand, level, question pack, realm and perks (realms.js wraps init) */
        this.mode = modeFor(this.night) || MODES.raid;
        /* v5.7.9: each mode comes round once a realm; every time it comes round it adds something (MODES[id].news) */
        this.tier = clamp(Math.floor(((this.night || 1) - 1) / 10), 0, 9);
      }

      /* ── lifecycle ── */
      create() {
        var self = this;
        K.setPlayScene(this);
        if (this.time) this.time.timeScale = 1;
        K.installSafeCamFlash(this);
        this._tabHidden = !!(typeof document !== "undefined" && document.hidden);
        K.hideTrapIntro();
        K.hideTut();
        try {
          var ov = document.getElementById("overlay"); if (ov) ov.classList.add("hidden");
          var fl = document.getElementById("flash"); if (fl) fl.className = "";
        } catch (eD) {}
        try { K.hideReading(); } catch (eR) {}

        this.ended = false; this._finishing = false; this._between = false;
        this._nightStarted = false; this._readPending = false; this.readOpen = false;
        this.tutDone = true; this.tutOpen = false; this.codexOpen = false; this.trapOpen = false;
        this.score = 0; this.scoreJuice = 0; this.scoreToastMs = 0; this.scoreToastMsg = "";
        this.oneUpAwarded = false; this.oneUpFlash = 0;
        this.spareLives = (this.perks && this.perks.blessing) ? 1 : 0;
        this._guardUsed = false; this._hudClaimId = null;
        this.strikes = 0; this.round = 1; this.kills = 0;
        this.usedClaims = K.loadUsedClaims(this.family, this.strand);
        this.adapt = K.loadAdapt(this.family);
        this.nightPacks = []; this.nightWrong = 0; this.nightCoins = 0; this.claimWrong = 0; this.extracted = [];
        this.iframeMs = 0; this.bigTagMs = 0; this.lastStrikeReason = ""; this._lastHitLabel = "";
        this.janitors = []; this.slips = []; this.shutters = [];
        this._beamHelpDone = false; this.helpOpen = false;

        this.pal = (this.realm && this.realm.pal) || { wall: 0x2f3b2c, stroke: 0x5a7050, lip: 0x8aa47a, floorA: 0xdcd4b4, floorB: 0xb9b08e, accent: 0xf5d76e, wash: 0x6aa84a, void: 0x07100a };
        this.W = this.scale.width; this.H = this.scale.height;
        ensureModeArt(this, this.pal);
        this.cameras.main.setBackgroundColor(hex(this.pal.void));

        this.keys = this.input.keyboard.addKeys("LEFT,RIGHT,UP,DOWN,W,A,S,D,SPACE,SHIFT");
        this.ptr = { down: false, x: 0, y: 0, t: -9999 };
        this.input.on("pointerdown", function (p) { self.ptr.down = true; self.ptr.right = !!(p.rightButtonDown && p.rightButtonDown()); self.ptr.x = p.x; self.ptr.y = p.y; self.ptr.t = self.time.now; });
        this.input.on("pointermove", function (p) { self.ptr.x = p.x; self.ptr.y = p.y; if (p.isDown || self.ptr.down) self.ptr.t = self.time.now; });
        this.input.on("pointerup", function () { self.ptr.down = false; self.ptr.right = false; });
        this.input.on("pointerupoutside", function () { self.ptr.down = false; self.ptr.right = false; });
        try { if (this.input.mouse) this.input.mouse.disableContextMenu(); } catch (eM) {}   /* the right button is a game button here */

        this.sparks = this.add.particles(0, 0, "spark", { speed: { min: 60, max: 260 }, lifespan: 460, scale: { start: 0.9, end: 0 }, emitting: false }).setDepth(30);
        this.dust = this.add.particles(0, 0, this.textures.exists("rf-dot") ? "rf-dot" : "spark", { speed: { min: 40, max: 200 }, lifespan: 560, scale: { start: 0.8, end: 0 }, alpha: { start: 0.9, end: 0 }, emitting: false }).setDepth(29);
        this.fxG = this.add.graphics().setDepth(19);
        this.bigTag = this.add.text(this.W / 2, this.H * 0.36, "", { fontFamily: "Trebuchet MS", fontSize: 34, color: "#ffe08a", fontStyle: "bold", stroke: "#1a1008", strokeThickness: 7, align: "center" }).setOrigin(0.5).setDepth(60).setVisible(false);

        /* the side-panel controls: FIRE, and PULL for the rock beam */
        try {
          var st = document.getElementById("stage");
          if (st) { st.classList.add("mode-play"); st.classList.add("mode-" + this.mode.id); }
          var act = document.getElementById("btn-action"), sh = document.getElementById("btn-shutter");
          if (act) { if (act.dataset.mazeLabel == null) act.dataset.mazeLabel = act.textContent; act.textContent = "FIRE"; }
          if (sh) { if (sh.dataset.mazeLabel == null) sh.dataset.mazeLabel = sh.textContent; sh.textContent = "PULL"; }
        } catch (eS) {}
        this._onResize = function (size) { self.relayout(size && size.width || self.scale.width, size && size.height || self.scale.height); };
        this.scale.on("resize", this._onResize);
        var cleanup = function () { self.cleanupMode(); };
        this.events.once("shutdown", cleanup);
        this.events.once("destroy", cleanup);

        this["setup_" + this.mode.id]();
        this.nextClaim();   /* picks the question; calls placeSlips(), which builds this mode's letter targets */
        this.paintHud();
      }

      cleanupMode() {
        try { this.scale.off("resize", this._onResize); } catch (e) {}
        try {
          var st = document.getElementById("stage");
          if (st) Object.keys(MODES).forEach(function (k) { st.classList.remove("mode-" + k); });
          if (st) st.classList.remove("mode-play");
          var act = document.getElementById("btn-action"), sh = document.getElementById("btn-shutter");
          if (act && act.dataset.mazeLabel != null) act.textContent = act.dataset.mazeLabel;
          if (sh && sh.dataset.mazeLabel != null) sh.textContent = sh.dataset.mazeLabel;
          var card = document.getElementById("mode-card"); if (card) card.classList.add("hidden");
        } catch (e2) {}
        Input.shutterHeld = false;
        this.hideBeamHelp();
      }

      placeSlips() {
        this.slips = [];
        var fn = this["answers_" + this.mode.id];
        if (fn) fn.call(this);
      }

      choiceLetters() {
        var c = this.claim, out = [];
        ((c && c.choices) || []).forEach(function (ch) { if (ch && ch.letter && out.indexOf(ch.letter) === -1) out.push(String(ch.letter)); });
        (this.need || []).forEach(function (L) { if (out.indexOf(L) === -1) out.push(L); });
        return out;
      }

      update(t, dt) {
        if (this._tabHidden && typeof document !== "undefined" && !document.hidden) {
          this._tabHidden = false;
          try { if (this.scene && this.scene.isPaused && this.scene.isPaused()) this.scene.resume(); } catch (e) {}
        }
        if (this._tabHidden) return;
        if (!(dt > 0)) return;
        if (dt > 50) dt = 50;
        if (this.readOpen && !K.readingIsVisible()) this.readOpen = false;
        if (this._readPending && this.claim && !this.ended) {
          this._readPending = false;
          this.openReading(this._readReason || "start");
        }
        if (!this.readOpen && !this.ended && this.mode.id === "rocks" && !this._beamHelpDone) this.showBeamHelp();
        if (this.readOpen || this.ended || this.helpOpen) { Input.actEdge = false; Input.shutterEdge = false; return; }
        var inp = this.readInput();
        this.tickTimers(dt);
        if (!this._finishing) {
          try { this["tick_" + this.mode.id](dt / 1000, inp, dt); }
          catch (err) { if (window.console) console.error("[modes] tick failed", err); }
        }
        Input.actEdge = false;
        Input.shutterEdge = false;
      }

      readInput() {
        var k = this.keys;
        var left = k.LEFT.isDown || k.A.isDown || Input.ax < 0, right = k.RIGHT.isDown || k.D.isDown || Input.ax > 0;
        var up = k.UP.isDown || k.W.isDown || Input.ay < 0, down = k.DOWN.isDown || k.S.isDown || Input.ay > 0;
        var locked = Date.now() < (this.tutLockUntil || 0);
        var ptr = this.ptr.down ? this.ptr : null;
        var rightBeam = this.mode.id === "rocks" && !!ptr && !!ptr.right;   /* Rune Rocks: the right mouse button is the beam */
        return {
          ax: (right ? 1 : 0) - (left ? 1 : 0),
          ay: (down ? 1 : 0) - (up ? 1 : 0),
          fire: !locked && (k.SPACE.isDown || Input.act || (!!ptr && !rightBeam)),
          pull: k.SHIFT.isDown || !!Input.shutterHeld || (this.mode.id === "rocks" && down) || rightBeam,
          ptr: locked ? null : ptr
        };
      }

      tickTimers(dt) {
        if (this.iframeMs > 0) this.iframeMs = Math.max(0, this.iframeMs - dt);
        if (this.scoreToastMs > 0) {
          this.scoreToastMs = Math.max(0, this.scoreToastMs - dt);
          if (this.scoreToastMs <= 0) this.paintCarryFlag();
        }
        if (this.bigTagMs > 0) {
          this.bigTagMs -= dt;
          this.bigTag.setAlpha(clamp(this.bigTagMs / 400, 0, 1));
          if (this.bigTagMs <= 0) this.bigTag.setVisible(false);
        }
      }

      relayout(w, h) {
        var oldW = this.W || w, oldH = this.H || h;
        this.W = w; this.H = h;
        var fn = this["resize_" + this.mode.id];
        if (fn) { try { fn.call(this, oldW, oldH); } catch (e) {} }
      }

      /* ── shared rules ── */
      /* The student chose letter L (shot it, beamed it in). */
      answerPick(L, x, y) {
        if (this.ended || this._finishing || this._between) return "ignore";
        if ((this.need || []).indexOf(L) === -1) { this.answerWrong(L, "WRONG LETTER (" + L + ")", x, y); return "wrong"; }
        if (this.extracted.indexOf(L) === -1) this.extracted.push(L);
        this.burst(x, y, 0xffe066, 26);
        if (window.AfterHoursAudio) { try { AfterHoursAudio.extract(); } catch (e) {} }
        var self = this, done = this.need.every(function (n) { return self.extracted.indexOf(n) !== -1; });
        if (!done) {
          var more = this.need.length - this.extracted.length;
          this.showTag(L + " IS RIGHT · " + more + " MORE", "#9aefc0");
          this.toast("Letter " + L + " is right. This question needs " + more + " more letter" + (more === 1 ? "" : "s") + ".", 3200);
          this.paintHud();
          return "partial";
        }
        this.score += 1;
        K.adaptEvent(this, this.claimWrong ? "struggled" : "clean", this.claim);
        this.giveCoins(this.coinEconomy().answer, "Correct answer");
        K.pingTeacher(this, "playing");
        this.showTag("CORRECT!", "#9aefc0");
        snd("chime");
        var clr = this["clear_" + this.mode.id];
        if (clr) clr.call(this);
        if (this.score >= this.needExtracts) {
          this._finishing = true;
          this.paintHud();
          this.time.delayedCall(1100, function () { if (!self.ended) self.endRun(true); });
          return "done";
        }
        this.round += 1;
        this._between = true;
        this.time.delayedCall(900, function () { self._between = false; if (!self.ended && !self._finishing) self.nextClaim(); });
        return "done";
      }

      answerWrong(L, label, x, y) {
        if (label !== "YOU BLASTED THE RIGHT ANSWER") this.noteWrongLetter(L);
        this.claimWrong = (this.claimWrong || 0) + 1;
        this.nightWrong = (this.nightWrong || 0) + 1;
        K.adaptEvent(this, "wrong", this.claim);
        if (x != null) this.burst(x, y, 0xff6a4a, 16);
        this.loseLife("wrong", label || "WRONG LETTER");
      }

      /* A hit or a wrong letter. Hits respect the safety blink; wrong letters always count. */
      loseLife(reason, label) {
        if (this.ended || this._finishing) return false;
        var hurt = reason !== "wrong";
        if (hurt && this.iframeMs > 0) return false;
        if (hurt && this.perks && this.perks.guard && !this._guardUsed) {
          this._guardUsed = true;
          this.iframeMs = 1600;
          this.showTag("BLOCKED", "#9ad8ff");
          this.toast("Your castle guard blocked that hit! (once per level)", 2800);
          return false;
        }
        var spent = false;
        if ((this.spareLives || 0) > 0) { this.spareLives -= 1; spent = true; }
        else { this.strikes += 1; this.lastStrikeReason = hurt ? "hit" : "wrong"; this._lastHitLabel = label; }
        this.iframeMs = 1700 + ((this.perks && this.perks.hearth) ? 1000 : 0);
        var left = Math.max(0, this.needStrikes - this.strikes);
        this.showTag(spent ? label + " · 1UP SAVED YOU" : (left > 0 ? label + " · " + left + (left === 1 ? " LIFE" : " LIVES") + " LEFT" : label), "#ff9a7a");
        try { this.cameras.main.shake(200, 0.01); } catch (e) {}
        if (window.AfterHoursAudio) { try { if (hurt) AfterHoursAudio.catch(); else AfterHoursAudio.alarm(); } catch (e2) {} }
        this.paintHud();
        if (this.strikes >= this.needStrikes) {
          var self = this;
          this._finishing = true;
          this.time.delayedCall(800, function () { if (!self.ended) self.endRun(false); });
        }
        return true;
      }

      addKill(x, y, why) {
        this.kills += 1;
        this.scoreJuice = (this.scoreJuice || 0) + 120;
        if (this.kills % 12 === 0) this.awardBonusPoints(1500, why || "Twelve in a row");
        else if (this.checkOneUp) this.checkOneUp();
      }

      burst(x, y, color, n) {
        try { this.dust.particleTint = color; this.dust.emitParticleAt(x, y, n || 14); } catch (e) {}
        try { this.sparks.emitParticleAt(x, y, Math.ceil((n || 14) / 2)); } catch (e2) {}
      }
      showTag(text, color) {
        this.bigTag.setText(text).setColor(color || "#ffe08a").setPosition(this.W / 2, this.H * 0.36).setAlpha(1).setVisible(true);
        this.bigTagMs = 1500;
      }
      toast(msg, ms) {
        this.scoreToastMs = Math.max(this.scoreToastMs || 0, ms || 2600);
        this.scoreToastMsg = msg;
        this.paintCarryFlag();
      }
      letterText(x, y, L, size, color, stroke) {
        return this.add.text(x, y, L, { fontFamily: "Trebuchet MS", fontSize: size || 26, color: color || "#2a1604", fontStyle: "bold", stroke: stroke || "#fff6d8", strokeThickness: 4 }).setOrigin(0.5).setDepth(14);
      }
      blink(spr) {
        if (!spr) return;
        spr.setAlpha(this.iframeMs > 0 ? (Math.floor(this.iframeMs / 120) % 2 ? 0.35 : 1) : 1);
      }
      makeSol(x, y, face, scale) {
        this.player = this.physics.add.sprite(x, y, "kid").setDepth(20);
        try { this.applyCharPreset(); } catch (e) {}
        this.player.setScale(scale || 1.5);
        this.faceIdle(face || "down");
        return this.player;
      }
      faceIdle(dir) {
        this.playerFaceDir = dir;
        if (!this.player || !this.playerSheetKey) return;
        try {
          if (this.player.anims) this.player.anims.stop();
          this.player.setTexture(this.playerSheetKey, (({ down: 4, left: 5, right: 6, up: 7 })[dir] || 4) * 8);
        } catch (e) {}
      }
      drawSkyBg(stars, space) {
        if (this.bgG) this.bgG.destroy();
        var g = this.bgG = this.add.graphics().setDepth(0), W = this.W, H = this.H, pal = this.pal, i, bands = 32;
        var top = mix(pal.void, 0x000000, space ? 0.4 : 0.2), bot = space ? mix(pal.void, pal.stroke, 0.22) : mix(pal.wall, pal.wash || pal.stroke, 0.3);
        for (i = 0; i < bands; i++) {
          g.fillStyle(mix(top, bot, i / (bands - 1)), 1);
          g.fillRect(0, Math.floor(H * i / bands), W, Math.ceil(H / bands) + 1);
        }
        var n = stars == null ? 90 : stars;
        for (i = 0; i < n; i++) {
          g.fillStyle(i % 7 ? 0xffffff : (pal.accent || 0xffe08a), rnd(0.25, 0.85));
          g.fillCircle(rnd(0, W), rnd(0, H * 0.8), i % 9 ? 1.2 : 2.2);
        }
      }

      /* ── the HUD and the reading pop-up (maze versions, retold for the shooters) ── */
      paintHud() {
        super.paintHud();
        try {
          if (!this.claim) return;
          var sp = document.getElementById("score-pip");
          if (sp) sp.textContent = "Answers " + this.score + " / " + this.needExtracts;
          var rf = document.getElementById("round-flag");
          if (rf && rf.textContent.indexOf(this.mode.name) === -1) rf.textContent += " · " + this.mode.name;
          /* the realm pip: castle perks only (no maze creature, no Fenrir here) */
          var pip = document.getElementById("realm-pip");
          if (pip) {
            var n = (this.perkList || []).length, txt = n ? "★ " + n + " perk" + (n === 1 ? "" : "s") : "";
            if (pip.textContent !== txt) pip.textContent = txt;
            pip.title = (this.perkList || []).map(function (q) { return q.name + ": " + q.desc; }).join("\n");
            pip.classList.toggle("hidden", !txt);
            pip.classList.remove("boss");
          }
          var ev = document.getElementById("evidence");
          if (ev && this.need && this.need.length > 1) ev.textContent = this.extracted.length + " of " + this.need.length + " right letters found. This question needs both.";
        } catch (e) {}
      }
      paintCarryFlag() {
        var flag = document.getElementById("carry-flag");
        if (!flag || !this.mode) return;
        var toast = (this.scoreToastMs || 0) > 0 && this.scoreToastMsg;
        flag.textContent = toast ? this.scoreToastMsg : this.mode.tip;
        flag.className = "carry-flag" + (toast ? " prio-score" : "");
      }
      openReading(reason) {
        var m = this.mode, card = document.getElementById("mode-card");
        if (!card) {
          var rc = document.getElementById("read-card"), sc = document.getElementById("read-scroll");
          if (rc && sc) { card = document.createElement("div"); card.id = "mode-card"; card.className = "realm-card mode-card hidden"; rc.insertBefore(card, sc); }
        }
        if (card) {
          if (reason === "start") {
            card.innerHTML = '<p class="rk">Level ' + this.night + " · shooter level · " + (this.realm ? this.realm.name : "") + "</p>" +
              "<h3>" + m.name + " <span>· " + m.kind + "</span></h3>" +
              "<p>" + m.how + "</p><p class=\"foe\"><b>Lives:</b> " + m.rules + "</p>" +
              "<p class=\"perks\"><b>Controls:</b> " + m.keys + "</p>" +
              (this.tier > 0 && m.news && m.news[this.tier] ? "<p class=\"new\"><b>New this time:</b> " + m.news[this.tier] + "</p>" : "");
            card.classList.remove("hidden");
            card.setAttribute("data-mode", m.id);
          } else card.classList.add("hidden");
        }
        var r = super.openReading(reason);
        try {
          var hint = document.getElementById("read-hint");
          if (hint) hint.textContent = (this.need && this.need.length > 1) ? m.hint2 : m.hint1;
        } catch (e) {}
        return r;
      }
      endRun(win) {
        if (this.ended) return;
        try { this.fxG.clear(); } catch (e0) {}
        super.endRun(win);
        try {
          var t = document.getElementById("win-title"), msg = document.getElementById("win-msg"), m = this.mode;
          if (win) {
            if (t && t.textContent === "Level cleared") t.textContent = m.name + " cleared";
            var nx = modeFor(this.night + 1);
            if (msg && this.night < 100) msg.textContent += " Next: " + (nx ? nx.name + " (" + nx.kind + ")." : ((this.night + 1) % 10 === 0 ? "Fenrir's boss maze." : "back to the maze."));
          } else if (msg) {
            msg.textContent = this.lossReason() + "In " + m.name + ", wrong letters and hits both cost a life. Retry this level — the campaign stays here.";
          }
        } catch (e) {}
      }

      /* what used the last life, in words (the label is the one the big tag showed) */
      lossReason() {
        var lab = this._lastHitLabel || "";
        if (lab === "YOU BLASTED THE RIGHT ANSWER") return "You blasted the rock with the right answer, and that used your last life. Pull the right letter in with the beam instead of shooting it. ";
        if (this.lastStrikeReason === "wrong") return "That wrong letter used your last life. " + this.wrongLetterNote();
        return lab ? "Last hit: " + lab.toLowerCase() + ". " : "";
      }

      /* ═══ 1. EAGLE SWOOP — galaga ══════════════════════════════════════════
         The eagles in the top row carry the letters in their talons, the way
         Galaga's boss ships carry a captured fighter. Rows of ravens fly in
         below them and shield them. Ravens and eagles peel off and dive; a
         diving eagle can stop and shine a beam down to catch Sol. An eagle
         takes two arrows; the second decides its letter. */
      setup_raid() {
        this.drawSkyBg(110);
        this.raidGround();
        this.makeSol(this.W / 2, this.H - 62, "up");
        this.raid = { arrows: [], feathers: [], ravens: [], ravSlots: [], cd: 0, clock: 0, fcx: this.W / 2, breath: 1, swayAmp: 60, top: 112,
          diveCd: 4000, refillCd: 8000, huginn: null, huginnCd: rnd(12000, 18000), fired: 0, total: 1 };
      }
      raidGround() {
        if (this.groundG) this.groundG.destroy();
        var g = this.groundG = this.add.graphics().setDepth(1), W = this.W, H = this.H;
        g.fillStyle(mix(this.pal.wall, 0x000000, 0.2), 1); g.fillRect(0, H - 28, W, 28);
        g.fillStyle(this.pal.stroke, 0.6); g.fillRect(0, H - 28, W, 3);
      }
      resize_raid(oldW, oldH) {
        var R = this.raid, dy = this.H - oldH;
        this.drawSkyBg(110); this.raidGround();
        if (this.player) this.player.y = this.H - 62;
        R.feathers.forEach(function (f) { f.y += dy; });
        this.raidSway();
      }
      raidSway() {
        var R = this.raid, span = 0;
        R.ravens.forEach(function (e) { span = Math.max(span, Math.abs(e.sx) * 2 + 80); });
        R.swayAmp = clamp((this.W - span) / 2 - 40, 0, 80);
      }
      answers_raid() {
        var R = this.raid, W = this.W, H = this.H, self = this, i, r, c;
        R.ravens.forEach(kill); R.ravens = []; R.ravSlots = [];
        var letters = shuffle(this.choiceLetters().slice()), n = letters.length;
        var gapE = 100, gapR = 62, cols = clamp(Math.floor((W * 0.72) / gapR), 6, 11), rows = this.tier >= 4 ? 3 : 2;
        var list = [];
        for (i = 0; i < n; i++) {
          var eg = { kind: "eagle", letter: letters[i], hp: this.tier >= 3 ? 3 : 2, alive: true, sx: (i - (n - 1) / 2) * gapE, sy: 0, state: "wait", x: -99, y: -99 };
          eg.spr = this.add.image(-99, -99, "md-eagle-0").setScale(1.12).setDepth(13);
          if (eg.hp > 2) eg.spr.setTint(0xcfd8e6);   /* an iron helm */
          eg.shield = this.add.image(-99, -99, "md-shield").setDepth(12).setScale(0.95);
          eg.label = this.letterText(-99, -99, eg.letter, 22, "#2a1604", "#fff6d8");
          list.push(eg);
        }
        for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) R.ravSlots.push({ sx: (c - (cols - 1) / 2) * gapR, sy: 112 + r * 54 });
        var rav = [];
        R.ravSlots.forEach(function (sl, k) { rav.push(self.raidRaven(k)); });
        /* v5.7.7: two guard ravens hang just under every eagle's letter; they never dive, and fly back if shot */
        list.forEach(function (eg2) { [-1, 1].forEach(function (sd) { rav.push(self.raidGuard(eg2, sd)); }); });
        R.total = rav.length;
        /* they fly in by groups from alternating sides: the eagles with the first ravens */
        shuffle(rav);
        list = list.concat(rav);
        var g = 0, k2 = 0, size = Math.max(6, n + 2);
        list.forEach(function (e, idx) {
          if (idx && idx % size === 0) { g++; k2 = 0; }
          e.delay = g * 750 + k2 * 110; e.side = g % 2 ? 1 : -1; k2++;
        });
        R.ravens = list;
        R.ready = false; R.readyWarned = false; R.guardCd = 5000;   /* v5.7.7: no arrows until the flock has formed */
        this.showTag("GET READY — THE FLOCK IS FLYING IN", "#ffe08a");
        R.diveCd = 600;
        R.refillCd = 9000;
        this.raidSway();
        snd("caw");
      }
      raidGuard(eg, sd) {
        var e = { kind: "raven", guard: true, guardOf: eg, gside: sd, letter: null, hp: 1, alive: true, slot: -1, sx: eg.sx + sd * 23, sy: 74, state: "wait", x: -99, y: -99 };
        e.spr = this.add.image(-99, -99, "rf-raven-0").setScale(0.66).setTint(0xc8d4ff).setDepth(12);
        return e;
      }
      raidRaven(k) {
        var sl = this.raid.ravSlots[k];
        var e = { kind: "raven", letter: null, hp: 1, alive: true, slot: k, sx: sl.sx, sy: sl.sy, state: "wait", x: -99, y: -99 };
        e.spr = this.add.image(-99, -99, "rf-raven-0").setScale(0.72).setDepth(12);
        return e;
      }
      raidSlot(e) {
        var R = this.raid;
        return { x: R.fcx + e.sx * R.breath, y: R.top + e.sy * (0.94 + 0.06 * R.breath) };
      }
      raidPos(o) { return { x: o.x, y: o.y }; }
      raidPlace(e) {
        if (e.spr) e.spr.setPosition(e.x, e.y);
        if (e.shield) e.shield.setPosition(e.x, e.y + 42);
        if (e.label) e.label.setPosition(e.x, e.y + 42);
      }
      raidBez(e) {
        var P = e.path, u = clamp(P.t, 0, 1), v = 1 - u, end = P.p3 || this.raidSlot(e);
        var a = v * v * v, b = 3 * v * v * u, c = 3 * v * u * u, d = u * u * u;
        return { x: a * P.p0.x + b * P.p1.x + c * P.p2.x + d * end.x, y: a * P.p0.y + b * P.p1.y + c * P.p2.y + d * end.y };
      }
      raidEntry(e) {
        var W = this.W, H = this.H, sd = e.side || -1;
        e.state = "enter";
        e.path = { p0: { x: W / 2 + sd * (W * 0.5 + 40), y: H * 0.12 }, p1: { x: W / 2 + sd * W * 0.08, y: H * 0.72 }, p2: { x: W / 2 - sd * W * 0.3, y: H * 0.5 }, p3: null, t: 0, dur: 2.1, next: "form" };
      }
      /* Galaga's dive: a loop up and out, a swoop at Sol, off the bottom, back in from the top */
      raidDive(e, dx) {
        var W = this.W, H = this.H, p = this.player, sd = e.x < W / 2 ? -1 : 1, tx = clamp(p.x + rnd(-40, 40), 40, W - 40);
        e.state = "dive"; e.drops = 0; e.dx = dx || 0;
        var spd = 1 + Math.min(0.6, this.night / 160);
        e.path = { p0: { x: e.x, y: e.y }, p1: { x: e.x + sd * 130, y: e.y - 110 }, p2: { x: tx - sd * 190 + e.dx, y: H * 0.72 }, p3: { x: tx + sd * 140 + e.dx, y: H + 70 }, t: 0, dur: 2.8 / spd, next: "return" };
      }
      raidBeamDive(e) {
        var W = this.W, H = this.H, p = this.player, sd = e.x < W / 2 ? -1 : 1, tx = clamp(p.x + rnd(-50, 50), 70, W - 70), hy = Math.max(e.y + 80, H * 0.44);
        e.state = "dive"; e.drops = 9; e.beamer = true;
        e.path = { p0: { x: e.x, y: e.y }, p1: { x: e.x + sd * 110, y: e.y - 80 }, p2: { x: tx, y: hy - 90 }, p3: { x: tx, y: hy }, t: 0, dur: 2.0, next: "beam" };
      }
      raidHit(o) {
        if (!o || !o.alive) return;
        var x = o.x, y = o.y;
        if (o.kind === "eagle" && o.hp > 1) {
          o.hp -= 1;
          if (o.spr) o.spr.setTint(0xffb08a);
          this.burst(x, y, 0xffb08a, 10);
          snd("pop");
          this.toast(o.hp === 1 ? "That eagle is hurt. One more arrow and its letter " + o.letter + " is your answer." : "That eagle's iron helm took it. " + o.hp + " more arrows for letter " + o.letter + ".", 2600);
          return;
        }
        o.alive = false;
        kill(o);
        this.burst(x, y, o.kind === "eagle" ? 0xc89a5a : 0x5a4a78, 12);
        snd("pop");
        if (o.letter) this.answerPick(o.letter, x, y);
        else this.addKill(x, y, "Twelve ravens");
      }
      /* the target an arrow meets first, coming up from below (so the ravens shield the eagles) */
      raidArrowHit(ax, y0, y1) {
        var R = this.raid, best = null, bestY = -1e9;
        R.ravens.forEach(function (e) {
          if (!e.alive || e.state === "wait") return;
          var boxes = e.kind === "eagle" ? [[38, -27, 22], [21, 20, 64]] : [[25, -18, 18]];
          boxes.forEach(function (b) {
            if (Math.abs(ax - e.x) < b[0] && y1 <= e.y + b[2] && y0 >= e.y + b[1] && e.y + b[2] > bestY) { best = e; bestY = e.y + b[2]; }
          });
        });
        return best;
      }
      tick_raid(s, inp, ms) {
        var R = this.raid, p = this.player, W = this.W, H = this.H, i, self = this;
        R.clock += s;
        /* Sol walks with the keys or the ◀ ▶ pad only; a mouse button or a tap just shoots */
        var vx = inp.ax * 430;
        p.x = clamp(p.x + vx * s, 30, W - 30); p.y = H - 62;
        this.tickPlayerCharAnim(0, vx ? -1 : 0, false);
        this.blink(p);
        /* arrows */
        R.cd -= ms;
        if (!R.ready && R.ravens.length && R.ravens.every(function (o) { return o.state !== "wait" && o.state !== "enter"; })) {
          R.ready = true; this.showTag("FIRE!", "#9aefc0"); snd("caw");
        }
        if (inp.fire && !R.ready && !R.readyWarned) { R.readyWarned = true; this.toast("Wait for the flock to fly into formation — then fire!", 2200); }
        if (inp.fire && R.ready && R.cd <= 0 && R.arrows.length < 2) {
          R.arrows.push({ x: p.x, y: p.y - 36, spr: this.add.image(p.x, p.y - 36, "md-arrow").setDepth(18) });
          R.cd = 260; R.fired += 1; snd("shot");
        }
        for (i = R.arrows.length - 1; i >= 0; i--) {
          var a = R.arrows[i], y0 = a.y, hit = false;
          a.y -= 760 * s; a.spr.y = a.y;
          var tgt = this._finishing ? null : this.raidArrowHit(a.x, y0, a.y);
          var cl = (R.clouds || []).filter(function (c) { return Math.abs(a.x - c.x) < 78 && y0 >= c.y - 28 && a.y <= c.y + 28; })[0];
          if (cl && (!tgt || cl.y + 28 >= tgt.y)) { hit = true; tgt = null; this.burst(a.x, cl.y + 20, 0x9aa4b8, 6); }
          if (tgt) { hit = true; this.raidHit(tgt); }
          if (!hit && R.huginn && Math.abs(a.x - R.huginn.x) < 32 && a.y < R.huginn.y + 24 && y0 > R.huginn.y - 24) {
            hit = true;
            this.burst(R.huginn.x, R.huginn.y, 0xffd84a, 24);
            this.awardBonusPoints(3000, "Huginn, Odin's raven!");
            kill(R.huginn); R.huginn = null; R.huginnCd = rnd(15000, 24000);
          }
          if (hit || a.y < -30) { a.spr.destroy(); R.arrows.splice(i, 1); }
        }
        this.fxG.clear();
        if (this._finishing) return;
        /* the formation sways, then breathes */
        R.fcx = W / 2 + Math.sin(R.clock * 0.5) * R.swayAmp;
        R.breath = 1 + 0.07 * Math.sin(R.clock * 1.3);
        var flap = Math.floor(R.clock * 4) % 2, divers = 0, anyForm = false;
        for (i = 0; i < R.ravens.length; i++) {
          var e = R.ravens[i];
          if (!e.alive) continue;
          var ox = e.x, oy = e.y;
          if (e.state === "wait") {
            e.delay -= ms;
            if (e.delay <= 0) this.raidEntry(e);
            else continue;
          }
          if (e.state === "form") {
            var sl = this.raidSlot(e); e.x = sl.x; e.y = sl.y; anyForm = true;
          } else if (e.state === "beam") {
            this.raidBeamTick(e, s, ms);
            if (!e.alive) continue;
          } else if (e.path) {
            e.path.t += s / e.path.dur;
            var q = this.raidBez(e); e.x = q.x; e.y = q.y;
            if (e.state === "dive" && !e.beamer) {
              var want = this.tier >= 1 ? 2 : 1;
              if (e.drops < want && e.path.t > 0.42 + e.drops * 0.14 && e.y < p.y - 110 && e.y > 0) { e.drops++; this.raidFeather(e.x, e.y + 16); }
            }
            if (e.path.t >= 1) {
              var nx = e.path.next;
              if (nx === "form") { e.state = "form"; e.path = null; }
              else if (nx === "beam") { e.state = "beam"; e.beamMs = 0; e.path = null; e.hoverY = e.y; }
              else if (nx === "return") {
                var sl2 = this.raidSlot(e);
                e.state = "return"; e.x = sl2.x; e.y = -60;
                e.path = { p0: { x: sl2.x, y: -60 }, p1: { x: sl2.x, y: sl2.y * 0.4 }, p2: { x: sl2.x, y: sl2.y * 0.8 }, p3: null, t: 0, dur: 1.3, next: "form" };
              }
            }
          }
          if (e.state === "dive" || e.state === "beam") { if (e.lead) divers++; }
          /* look where they fly */
          var mvx = (e.x - ox) / Math.max(s, 0.001), mvy = (e.y - oy) / Math.max(s, 0.001);
          if (e.spr) {
            if (e.kind === "raven") {
              e.spr.setTexture("rf-raven-" + flap);
              if (e.state === "form") e.spr.setFlipX(false).setRotation(0);
              else if (Math.abs(mvx) + Math.abs(mvy) > 5) { e.spr.setFlipX(mvx < 0); e.spr.setRotation(clamp((mvx < 0 ? -1 : 1) * Math.atan2(mvy, Math.abs(mvx) + 1) * 0.6, -0.9, 0.9)); }
            } else {
              e.spr.setTexture("md-eagle-" + (e.state === "beam" ? 1 : flap));
              e.spr.setRotation(e.state === "form" ? 0 : clamp(mvx / 700, -0.45, 0.45));
            }
          }
          this.raidPlace(e);
          /* a diving bird that reaches Sol costs a life */
          if ((e.state === "dive" || e.state === "return") && e.y > p.y - 70 && dist(e.x, e.y, p.x, p.y - 10) < (e.kind === "eagle" ? 38 : 30)) {
            this.loseLife("hit", e.kind === "eagle" ? "AN EAGLE CRASHED INTO YOU" : "A RAVEN CRASHED INTO YOU");
            if (e.kind === "raven") { e.alive = false; this.burst(e.x, e.y, 0x5a4a78, 12); kill(e); }
          }
        }
        R.ravens = R.ravens.filter(function (o) { return o.alive; });
        /* who dives next */
        R.diveCd -= ms;
        var maxDivers = 2 + Math.floor(this.night / 25) + (this.tier >= 9 ? 1 : 0);   /* 2 at first, 3 from 25, … 5 at 75+, 6 in Ragnarok */
        var flying = R.ravens.filter(function (o) { return o.alive && (o.state === "dive" || o.state === "beam" || o.state === "return"); }).length;
        if (R.ready && anyForm && (flying === 0 || (R.diveCd <= 0 && divers < maxDivers))) {   /* never an empty sky */
          this.raidLaunch();
          R.diveCd = rnd(700, 1400) * (1 - Math.min(0.4, this.night / 250));
        }
        /* v5.7.9 (realm 3 on): two eagles trade places now and then */
        if (this.tier >= 2 && R.ready) {
          R.swapCd = (R.swapCd == null ? 6000 : R.swapCd) - ms;
          if (R.swapCd <= 0) { R.swapCd = this.tier >= 8 ? 4000 : 6500; this.raidSwap(); }
        }
        /* (realm 6 on) storm clouds drift across the flock and stop arrows */
        if (this.tier >= 5) this.raidClouds(s, ms);
        /* (realm 8 on) ravens in the formation drop poo too */
        if (this.tier >= 7 && R.ready) {
          R.fpooCd = (R.fpooCd == null ? 2500 : R.fpooCd) - ms;
          if (R.fpooCd <= 0) {
            R.fpooCd = rnd(1800, 3000) * (this.tier >= 9 ? 0.7 : 1);
            var fr = R.ravens.filter(function (o) { return o.alive && o.kind === "raven" && !o.guard && o.state === "form"; });
            if (fr.length) { var fe = fr[Math.floor(Math.random() * fr.length)]; this.raidFeather(fe.x, fe.y + 16); }
          }
        }
        /* guards fly back to an eagle that is home in the formation */
        R.guardCd -= ms;
        if (R.guardCd <= 0) {
          R.guardCd = 5000;
          R.ravens.filter(function (o) { return o.kind === "eagle" && o.alive && o.state === "form"; }).forEach(function (eg) {
            [-1, 1].forEach(function (sd) {
              if (!R.ravens.some(function (o) { return o.guard && o.guardOf === eg && o.gside === sd && o.alive; })) { var ng = self.raidGuard(eg, sd); ng.delay = 0; ng.side = sd; R.ravens.push(ng); }
            });
          });
        }
        /* when the ravens thin out, more fly in to shield the eagles */
        R.refillCd -= ms;
        if (R.refillCd <= 0) {
          R.refillCd = 5000;
          var used = {}, liveRav = 0;
          R.ravens.forEach(function (o) { if (o.kind === "raven" && !o.guard) { used[o.slot] = 1; liveRav++; } });
          if (liveRav <= R.total * 0.75 && R.ravens.some(function (o) { return o.kind === "eagle"; })) {
            var empties = R.ravSlots.map(function (x, k) { return k; }).filter(function (k) { return !used[k]; });
            shuffle(empties).slice(0, 4).forEach(function (k, j) {
              var nr = self.raidRaven(k); nr.delay = j * 130; nr.side = Math.random() < 0.5 ? -1 : 1; R.ravens.push(nr);
            });
          }
        }
        /* falling feathers */
        for (i = R.feathers.length - 1; i >= 0; i--) {
          var f = R.feathers[i], gone = false;
          f.t += s; f.y += (230 + this.night * 1.1) * s; f.x += (f.vx || 0) * s;
          f.spr.setPosition(f.x, f.y).setScale(1, 1 + Math.min(0.25, f.t * 0.3));
          if (dist(f.x, f.y, p.x, p.y - 10) < 26) {
            gone = true;
            if (this.loseLife("hit", "SPLAT! BIRD POO GOT YOU")) this.raidSplat(p.x, p.y - 22, true);
          } else if (f.y > H - 30) { gone = true; this.raidSplat(f.x, H - 26, false); }
          if (gone) { f.spr.destroy(); R.feathers.splice(i, 1); }
        }
        /* Huginn, the golden raven, crosses the top now and then */
        if (!R.huginn) {
          R.huginnCd -= ms;
          if (R.huginnCd <= 0) {
            var fromL = Math.random() < 0.5;
            R.huginn = { x: fromL ? -50 : W + 50, y: 62, vx: fromL ? 170 : -170, spr: this.add.image(0, 62, "rf-raven-0").setScale(0.7).setTint(0xffd84a).setDepth(12).setFlipX(!fromL) };
            snd("caw");
          }
        } else {
          R.huginn.x += R.huginn.vx * s;
          R.huginn.spr.setPosition(R.huginn.x, R.huginn.y + Math.sin(this.time.now / 160) * 4);
          if (R.huginn.x < -80 || R.huginn.x > W + 80) { kill(R.huginn); R.huginn = null; R.huginnCd = rnd(14000, 22000); }
        }
      }
      /* two eagles in the formation swap slots (their guards swap with them) */
      raidSwap() {
        var R = this.raid, self = this;
        var eg = shuffle(R.ravens.filter(function (o) { return o.alive && o.kind === "eagle" && o.state === "form"; })).slice(0, 2);
        if (eg.length < 2) return;
        var a = eg[0], b = eg[1], t = a.sx; a.sx = b.sx; b.sx = t;
        R.ravens.forEach(function (o) { if (o.guard) { if (o.guardOf === a) o.guardOf = b; else if (o.guardOf === b) o.guardOf = a; } });
        [a, b].forEach(function (e) {
          var to = self.raidSlot(e);
          e.state = "swap";
          e.path = { p0: { x: e.x, y: e.y }, p1: { x: e.x, y: e.y + 80 }, p2: { x: to.x, y: to.y + 80 }, p3: null, t: 0, dur: 1.1, next: "form" };
        });
        if (!R.toldSwap) { R.toldSwap = true; this.toast("Watch out: the eagles trade places! Follow the right letter.", 2600); }
      }
      raidClouds(s, ms) {
        var R = this.raid, W = this.W, want = this.tier >= 8 ? 2 : 1, i;
        R.clouds = R.clouds || [];
        R.cloudCd = (R.cloudCd == null ? 1500 : R.cloudCd) - ms;
        if (R.clouds.length < want && R.cloudCd <= 0) {
          var fromL = Math.random() < 0.5, c = { x: fromL ? -110 : W + 110, y: R.top + rnd(20, 100), vx: (fromL ? 1 : -1) * rnd(40, 70) };
          c.spr = this.add.image(c.x, c.y, "md-cloud").setDepth(16).setAlpha(0.92);
          R.clouds.push(c); R.cloudCd = 3000;
        }
        for (i = R.clouds.length - 1; i >= 0; i--) {
          var c2 = R.clouds[i];
          c2.x += c2.vx * s; c2.spr.setPosition(c2.x, c2.y);
          if ((c2.vx > 0 && c2.x > W + 130) || (c2.vx < 0 && c2.x < -130)) { c2.spr.destroy(); R.clouds.splice(i, 1); }
        }
      }
      /* a white splat on Sol (it rides along and fades) or on the ground */
      raidSplat(x, y, onSol) {
        var sp = this.add.image(x, y, "md-splat").setDepth(onSol ? 22 : 3).setScale(onSol ? 1 : 0.7).setAlpha(0.95), self = this, p = this.player;
        snd("pop");
        this.tweens.add({ targets: sp, alpha: 0, delay: onSol ? 700 : 500, duration: onSol ? 500 : 700, onComplete: function () { sp.destroy(); },
          onUpdate: function () { if (onSol && p) sp.setPosition(p.x, p.y - 22); } });
      }
      raidFeather(x, y) {
        var p = this.player, fall = Math.max(0.4, (p.y - y) / (210 + this.night * 1.1));
        var vx = clamp((p.x - x) / fall, -140, 140) * (this.tier >= 1 ? 1 : 0.6);
        this.raid.feathers.push({ x: x, y: y, vx: vx, t: 0, spr: this.add.image(x, y, "md-poo").setDepth(17) });
      }
      raidLaunch() {
        var R = this.raid, self = this;
        var form = R.ravens.filter(function (o) { return o.alive && o.state === "form"; });
        var eagles = form.filter(function (o) { return o.kind === "eagle"; }), ravens = form.filter(function (o) { return o.kind === "raven" && !o.guard; });
        var beaming = R.ravens.some(function (o) { return o.alive && (o.state === "beam" || o.beamer); });
        if (eagles.length && (Math.random() < 0.5 || !ravens.length)) {
          var eg = eagles[Math.floor(Math.random() * eagles.length)];
          eg.lead = true;
          if (!beaming && Math.random() < 0.55) { this.raidBeamDive(eg); return; }
          eg.beamer = false;
          this.raidDive(eg, 0);
          /* up to two ravens fly escort, as in Galaga */
          ravens.sort(function (a, b) { return Math.abs(a.x - eg.x) - Math.abs(b.x - eg.x); }).slice(0, 2).forEach(function (o, j) { o.lead = false; o.beamer = false; self.raidDive(o, j ? 46 : -46); o.path = { p0: { x: o.x, y: o.y }, p1: { x: eg.path.p1.x + o.dx, y: eg.path.p1.y + 30 }, p2: { x: eg.path.p2.x + o.dx, y: eg.path.p2.y + 20 }, p3: { x: eg.path.p3.x + o.dx, y: eg.path.p3.y }, t: 0, dur: eg.path.dur, next: "return" }; });
          return;
        }
        if (!ravens.length) return;
        var rv = ravens[Math.floor(Math.random() * ravens.length)];
        rv.lead = true; rv.beamer = false;
        this.raidDive(rv, 0);
      }
      /* the eagle's catching beam: it grows for 0.6s (a fair warning), shines, then pulls back */
      raidBeamTick(e, s, ms) {
        var p = this.player, g = this.fxG, H = this.H;
        e.beamMs += ms;
        e.x += Math.sin(this.raid.clock * 1.6) * 12 * s;
        if (this.tier >= 6) e.x += clamp(p.x - e.x, -1, 1) * 60 * s;   /* the beam follows Sol */
        e.y = e.hoverY + Math.sin(this.raid.clock * 3) * 3;
        var ms0 = e.beamMs, grow = ms0 < 600 ? ms0 / 600 : ms0 < 2800 ? 1 : Math.max(0, 1 - (ms0 - 2800) / 400);
        var top = e.y + 66, full = (H - 30) - top, len = full * grow, w0 = 14, w1 = 14 + len * 0.16;
        if (len > 4) {
          var pulse = 0.2 + 0.05 * Math.sin(this.raid.clock * 4);
          g.fillStyle(0xffe08a, pulse);
          g.fillPoints([{ x: e.x - w0, y: top }, { x: e.x + w0, y: top }, { x: e.x + w1, y: top + len }, { x: e.x - w1, y: top + len }], true);
          g.lineStyle(2, 0xfff2b8, 0.45);
          for (var k = 0; k < 4; k++) {
            var yy = ((this.raid.clock * 90 + k * full / 4) % full);
            if (yy > len) continue;
            var ww = w0 + yy * 0.16;
            g.lineBetween(e.x - ww, top + yy, e.x + ww, top + yy);
          }
        }
        if (grow >= 1 && ms0 < 2800) {
          var half = w0 + (p.y - 10 - top) * 0.16;
          if (Math.abs(p.x - e.x) < half + 6) {
            if (this.loseLife("hit", "THE EAGLE'S BEAM CAUGHT YOU")) e.beamMs = 2800;
          }
        }
        if (ms0 >= 3200) {
          e.state = "return"; e.beamer = false;
          e.path = { p0: { x: e.x, y: e.y }, p1: { x: e.x, y: e.y - 120 }, p2: { x: this.raidSlot(e).x, y: this.raidSlot(e).y + 90 }, p3: null, t: 0, dur: 1.5, next: "form" };
        }
      }
      clear_raid() {
        var R = this.raid, self = this;
        R.ravens.forEach(function (o) { if (o.alive && o.state !== "wait") self.burst(o.x, o.y, o.kind === "eagle" ? 0xc89a5a : 0x5a4a78, 8); kill(o); });
        R.ravens = [];
        R.feathers.forEach(kill); R.feathers = [];
        (R.clouds || []).forEach(kill); R.clouds = [];
        try { this.fxG.clear(); } catch (e) {}
      }

      /* ── Rune Rocks: a one-card "how to pull a rock in" pop-up. It shows after the reading pop-up
         on each Rune Rocks level until the student has pulled a rock in once on this Chromebook. ── */
      showBeamHelp() {
        this._beamHelpDone = true;
        var learned = false;
        try { learned = localStorage.getItem(BEAM_KEY) === "1"; } catch (e) {}
        if (learned) return;
        var self = this, ov = document.getElementById("beam-help");
        if (!ov) {
          ov = document.createElement("div");
          ov.id = "beam-help"; ov.className = "beam-help"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-labelledby", "beam-help-title");
          ov.innerHTML = '<div class="tut-card beam-card">' +
            '<p class="tut-kicker">Rune Rocks · how to pull a rock in</p>' +
            '<h2 id="beam-help-title">Use the beam</h2>' +
            '<svg viewBox="0 0 360 120" width="100%" role="img" aria-label="The ship points at a rock; a gold beam pulls it in">' +
              '<polygon points="70,60 300,18 300,102" fill="rgba(255,224,122,0.22)"/>' +
              '<line x1="78" y1="60" x2="252" y2="60" stroke="#ffe07a" stroke-width="5" opacity="0.6"/>' +
              '<g transform="translate(52,60) rotate(90)"><polygon points="0,-22 16,16 0,8 -16,16" fill="#f0c040" stroke="#7a4a10" stroke-width="2.5"/></g>' +
              '<circle cx="270" cy="60" r="27" fill="#5a4c34" stroke="#ffd84a" stroke-width="4"/>' +
              '<text x="270" y="69" text-anchor="middle" font-family="Trebuchet MS, sans-serif" font-weight="bold" font-size="26" fill="#fff6d8">B</text>' +
              '<path d="M226 88 L150 88" stroke="#fff" stroke-width="3" fill="none" marker-end="url(#bh-arrow)"/>' +
              '<defs><marker id="bh-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#fff"/></marker></defs>' +
            '</svg>' +
            '<ol class="beam-steps">' +
              '<li><b>Point your ship</b> at the rock with the right letter: ◀ ▶ turn, ▲ moves you closer. (The mouse does not steer.)</li>' +
              '<li><b>Hold the beam:</b> ▼ or Shift, the <b>PULL</b> button, or the <b>right mouse button</b>. A gold cone shines in front of the ship.</li>' +
              '<li><b>Keep holding until the rock touches your ship.</b> Then it counts as your answer.</li>' +
            '</ol>' +
            '<p class="beam-warn"><b>Don\'t let go early!</b> A rock you let go of keeps flying at you, and a rock hitting your ship costs a life — even the right one. Don\'t shoot the right rock either; shoot the wrong letters and the plain rocks.</p>' +
            '<button type="button" class="btn primary" id="beam-help-ok">Got it</button>' +
            '</div>';
          (document.getElementById("stage") || document.body).appendChild(ov);
        }
        ov.classList.remove("hidden");
        this.helpOpen = true;
        var close = function () { self.hideBeamHelp(); self.tutLockUntil = Date.now() + 350; };
        var btn = document.getElementById("beam-help-ok");
        if (btn) { btn.onclick = close; try { btn.focus(); } catch (e2) {} }
        this._beamKey = function (ev) { if (ev.key === "Enter" || ev.key === " " || ev.key === "Escape") { ev.preventDefault(); close(); } };
        document.addEventListener("keydown", this._beamKey, true);
      }
      hideBeamHelp() {
        this.helpOpen = false;
        if (this._beamKey) { document.removeEventListener("keydown", this._beamKey, true); this._beamKey = null; }
        var ov = document.getElementById("beam-help");
        if (ov) ov.classList.add("hidden");
      }

      /* ═══ 2. RUNE ROCKS — asteroids ═══════════════════════════════════════ */
      setup_rocks() {
        this.drawSkyBg(160, true);
        var W = this.W, H = this.H;
        var ship = { x: W / 2, y: H / 2, vx: 0, vy: 0, ang: -Math.PI / 2, spr: this.add.image(W / 2, H / 2, "md-ship").setScale(1.2).setDepth(20) };
        this.makeSol(W / 2, H / 2, "up").setVisible(false);   /* Sol flies the ship; the sprite stays for coin pop-ups */
        this.rk = { ship: ship, rocks: [], bullets: [], cd: 0, spawnCd: 0, target: null, beamSnd: 0, gen: 0,
          warns: [], cometCd: 6000, valk: null, valkCd: 10000, spears: [], showerCd: 11000 };
        var n = 4 + Math.floor(this.night / 22), i;
        for (i = 0; i < n; i++) this.rockFromEdge(3, null);
      }
      resize_rocks() { this.drawSkyBg(160, true); }
      rockMake(size, letter, x, y, vx, vy) {
        var R = this.rk, rad = size === 3 ? 46 : size === 2 ? 32 : 18;
        var o = { x: x, y: y, vx: vx, vy: vy, size: size, r: letter ? 34 : rad, letter: letter || null, rot: rnd(0, 6), spin: rnd(-1.2, 1.2), gen: R.gen };
        o.spr = this.add.image(x, y, letter ? "md-rock-l" : "md-rock-" + Math.floor(rnd(0, 3))).setScale((letter ? 34 : rad) / 46).setDepth(11);
        if (letter) { o.spin *= 0.4; o.label = this.letterText(x, y, letter, 30, "#fff4c8", "#1a1008").setDepth(14); }
        else if (size === 3 && this.tier >= 2) { o.hp = 2; o.spr.setTint(0xa8b8d0); }   /* an iron rock: two shots */
        R.rocks.push(o);
        return o;
      }
      rockFromEdge(size, letter) {
        var W = this.W, H = this.H, side = Math.floor(rnd(0, 4)), x, y, S = this.rk.ship, tries = 0;
        do {
          side = Math.floor(rnd(0, 4));
          x = side === 0 ? -40 : side === 1 ? W + 40 : rnd(0, W);
          y = side === 2 ? -40 : side === 3 ? H + 40 : rnd(0, H);
          tries++;
        } while (tries < 8 && dist(x, y, S.x, S.y) < 220);
        var tx = rnd(W * 0.2, W * 0.8), ty = rnd(H * 0.2, H * 0.8), a = Math.atan2(ty - y, tx - x);
        var sp = (letter ? rnd(34, 56) + this.night * 0.2 : rnd(40, 80) + this.night * 0.45) * (this.tier >= 9 ? 1.25 : 1);
        return this.rockMake(size, letter, x, y, Math.cos(a) * sp, Math.sin(a) * sp);
      }
      /* a letter rock; from realm 6 two guard stones circle it and block the beam until they are shot off */
      letterRock(L) {
        var o = this.rockFromEdge(2, L), k;
        if (this.tier >= 5) for (k = 0; k < 2; k++) { var g = this.rockMake(1, null, o.x, o.y, 0, 0); g.orbitOf = o; g.oa = k * Math.PI; g.spr.setTint(0xe8c890); }
        return o;
      }
      rockRemove(o) {
        var R = this.rk, i = R.rocks.indexOf(o), self = this;
        if (i >= 0) R.rocks.splice(i, 1);
        if (R.target === o) R.target = null;
        kill(o);
        R.rocks.filter(function (q) { return q.orbitOf === o; }).forEach(function (q) { self.burst(q.x, q.y, 0xe8c890, 6); self.rockRemove(q); });
      }
      answers_rocks() {
        var R = this.rk, self = this;
        R.gen += 1;
        R.rocks.filter(function (o) { return o.letter; }).forEach(function (o) { self.burst(o.x, o.y, 0xffd84a, 10); self.rockRemove(o); });
        shuffle(this.choiceLetters().slice()).forEach(function (L) { self.letterRock(L); });
      }
      rockShot(o, noCredit) {
        var self = this;
        if (o.letter) {
          var L = o.letter, gen = this.rk.gen;
          this.burst(o.x, o.y, 0xffb04a, 16); snd("rock");
          this.rockRemove(o);
          if ((this.need || []).indexOf(L) !== -1 && this.extracted.indexOf(L) === -1) {
            this.answerWrong(L, "YOU BLASTED THE RIGHT ANSWER");
            /* the right answer comes back so the question can still be answered */
            this.time.delayedCall(1600, function () { if (!self.ended && !self._finishing && self.rk.gen === gen && self.extracted.indexOf(L) === -1) self.letterRock(L); });
          } else {
            this.toast("Letter " + L + " was not the answer. Rock cleared.", 2400);
            this.addKill(o.x, o.y, "Rocks cleared");
          }
          return;
        }
        if (!noCredit && o.hp > 1) { o.hp -= 1; o.spr.setTint(0xd8e0ec); this.burst(o.x, o.y, 0xc8d4e8, 8); snd("rock"); return; }   /* iron */
        this.burst(o.x, o.y, 0x9a9488, o.size * 6); snd("rock");
        if (o.size > 1) {
          var a = Math.atan2(o.vy, o.vx), sp = Math.sqrt(o.vx * o.vx + o.vy * o.vy) * 1.3 + 20, k;
          for (k = -1; k <= 1; k += 2) this.rockMake(o.size - 1, null, o.x, o.y, Math.cos(a + k * 0.7) * sp, Math.sin(a + k * 0.7) * sp);
        }
        this.rockRemove(o);
        if (!noCredit) this.addKill(o.x, o.y, "Rocks cleared");
      }
      rockCaught(o) {
        try { localStorage.setItem(BEAM_KEY, "1"); } catch (eL) {}   /* the beam pop-up has done its job */
        var x = o.x, y = o.y, L = o.letter;
        this.rockRemove(o);
        if (L) this.answerPick(L, x, y);
        else { this.burst(x, y, 0x9a9488, 10); this.toast("Plain rock crushed in the beam.", 1600); this.scoreJuice = (this.scoreJuice || 0) + 60; }
      }
      wrap(o, m) {
        var W = this.W, H = this.H;
        if (o.x < -m) o.x = W + m; else if (o.x > W + m) o.x = -m;
        if (o.y < -m) o.y = H + m; else if (o.y > H + m) o.y = -m;
      }
      tick_rocks(s, inp, ms) {
        var R = this.rk, S = R.ship, W = this.W, H = this.H, i, j, self = this, g = this.fxG;
        g.clear();
        /* steering */
        /* only the keys and the pad steer; a mouse button just fires (left) or holds the beam (right) */
        var thrust = inp.ay < 0;
        S.ang += inp.ax * 3.8 * s;
        if (thrust) { S.vx += Math.cos(S.ang) * 420 * s; S.vy += Math.sin(S.ang) * 420 * s; }
        var sp = Math.sqrt(S.vx * S.vx + S.vy * S.vy);
        if (sp > 340) { S.vx *= 340 / sp; S.vy *= 340 / sp; }
        var damp = Math.pow(this.tier >= 4 ? 0.8 : 0.55, s); S.vx *= damp; S.vy *= damp;   /* slippery from realm 5 */
        S.x += S.vx * s; S.y += S.vy * s;
        this.wrap(S, 24);
        S.spr.setPosition(S.x, S.y).setRotation(S.ang + Math.PI / 2);
        this.blink(S.spr);
        this.player.setPosition(S.x, S.y);
        var nx = Math.cos(S.ang), ny = Math.sin(S.ang);
        if (thrust) {
          g.fillStyle(0xffa030, 0.85);
          g.fillTriangle(S.x - nx * 22 - ny * 7, S.y - ny * 22 + nx * 7, S.x - nx * 22 + ny * 7, S.y - ny * 22 - nx * 7, S.x - nx * (34 + Math.random() * 10), S.y - ny * (34 + Math.random() * 10));
        }
        /* shots */
        R.cd -= ms;
        if (inp.fire && R.cd <= 0 && R.bullets.length < 6) {
          R.bullets.push({ x: S.x + nx * 26, y: S.y + ny * 26, vx: nx * 640 + S.vx * 0.5, vy: ny * 640 + S.vy * 0.5, life: 0.9, spr: this.add.image(S.x, S.y, "md-bolt").setDepth(18).setRotation(S.ang) });
          R.cd = 170; R.fired = (R.fired || 0) + 1; snd("shot");
        }
        for (i = R.bullets.length - 1; i >= 0; i--) {
          var b = R.bullets[i], hit = null;
          b.x += b.vx * s; b.y += b.vy * s; b.life -= s;
          this.wrap(b, 10);
          b.spr.setPosition(b.x, b.y);
          for (j = 0; j < R.rocks.length; j++) { if (dist(b.x, b.y, R.rocks[j].x, R.rocks[j].y) < R.rocks[j].r + 4) { hit = R.rocks[j]; break; } }
          if (!hit && R.valk && dist(b.x, b.y, R.valk.x, R.valk.y) < 32) {
            this.burst(R.valk.x, R.valk.y, 0xe0e8ff, 20); this.awardBonusPoints(1500, "Valkyrie driven off");
            kill(R.valk); R.valk = null; R.valkCd = rnd(14000, 20000); b.life = 0;
          }
          if (hit || b.life <= 0) { b.spr.destroy(); R.bullets.splice(i, 1); }
          if (hit) { this.rockShot(hit); if (this._finishing) return; }
        }
        /* the beam: pulls in the nearest rock in front of the ship */
        R.target = null;
        if (inp.pull) {
          var best = null, bd = 1e9;
          R.rocks.forEach(function (o) {
            if (o.size > 2 || o.comet || o.orbitOf) return;
            var dd = dist(o.x, o.y, S.x, S.y);
            if (dd > 270 || dd >= bd) return;
            if (Math.abs(angDiff(Math.atan2(o.y - S.y, o.x - S.x), S.ang)) > 0.45) return;
            best = o; bd = dd;
          });
          var len = 270, spread = 0.42;
          g.fillStyle(0xffe07a, 0.13);
          g.fillTriangle(S.x + nx * 18, S.y + ny * 18, S.x + Math.cos(S.ang - spread) * len, S.y + Math.sin(S.ang - spread) * len, S.x + Math.cos(S.ang + spread) * len, S.y + Math.sin(S.ang + spread) * len);
          R.beamSnd -= ms;
          if (R.beamSnd <= 0) { snd("beam"); R.beamSnd = 420; }
          var guarded = best && R.rocks.some(function (q) { return q.orbitOf === best; });
          if (guarded) {
            g.lineStyle(4, 0xff6a5a, 0.6); g.lineBetween(S.x + nx * 18, S.y + ny * 18, best.x, best.y);
            if (!R.toldGuard) { R.toldGuard = true; this.toast("Its guard stones block the beam. Shoot them off first.", 2600); }
            best = null;
          }
          if (best) {
            R.target = best; best.beamT = this.time.now;
            g.lineStyle(5, 0xffe07a, 0.55); g.lineBetween(S.x + nx * 18, S.y + ny * 18, best.x, best.y);
            g.lineStyle(2, 0xffffff, 0.8); g.strokeCircle(best.x, best.y, best.r + 6);
            var tx = S.x - best.x, ty = S.y - best.y, tl = Math.sqrt(tx * tx + ty * ty) || 1;
            var pullF = best.letter && this.tier >= 3 ? (this.tier >= 9 ? 0.5 : 0.6) : 1;   /* heavy runes from realm 4 */
            best.vx = best.vx * Math.pow(0.2, s) + tx / tl * 320 * s * 4 * pullF;
            best.vy = best.vy * Math.pow(0.2, s) + ty / tl * 320 * s * 4 * pullF;
            if (tl < best.r + 20) { this.rockCaught(best); if (this._finishing) return; }
          }
        }
        /* rocks drift and wrap; any rock but the beamed one hurts */
        for (i = R.rocks.length - 1; i >= 0; i--) {
          var o = R.rocks[i];
          if (!o) continue;
          if (o.orbitOf) { o.oa += 1.7 * s; o.x = o.orbitOf.x + Math.cos(o.oa) * 60; o.y = o.orbitOf.y + Math.sin(o.oa) * 60; }
          else { o.x += o.vx * s; o.y += o.vy * s; }
          o.rot += o.spin * s;
          if (o.comet) { if (o.x < -90 || o.x > W + 90 || o.y < -90 || o.y > H + 90) { this.rockRemove(o); continue; } }
          else if (!o.orbitOf) this.wrap(o, o.r + 8);
          o.spr.setPosition(o.x, o.y).setRotation(o.rot);
          if (o.label) o.label.setPosition(o.x, o.y);
          if (o !== R.target && dist(o.x, o.y, S.x, S.y) < o.r + 17 && this.iframeMs <= 0) {
            var early = o.beamT && this.time.now - o.beamT < 1600;   /* let go of the beam before it was in */
            var hurt = this.loseLife("hit", early ? "YOU LET GO OF THE BEAM TOO SOON" : "HIT BY A ROCK");
            if (hurt && early) this.toast("Keep holding the beam until the rock touches your ship. A rock you let go of keeps coming and hits you.", 4200);
            if (hurt) {
              var ka = Math.atan2(S.y - o.y, S.x - o.x);
              S.vx = Math.cos(ka) * 220; S.vy = Math.sin(ka) * 220;
              if (!o.letter) this.rockShot(o, true);
              else { o.vx = -Math.cos(ka) * 80; o.vy = -Math.sin(ka) * 80; }
            }
            if (this._finishing) return;
          }
        }
        this.rockExtras(s, ms);
        if (this._finishing) return;
        /* keep the field busy */
        var blanks = R.rocks.filter(function (o) { return !o.letter; }).reduce(function (a, o) { return a + o.size; }, 0);
        R.spawnCd -= ms;
        if (R.spawnCd <= 0 && blanks < 10 + Math.floor(this.night / 12)) { this.rockFromEdge(3, null); R.spawnCd = 2600; }
      }
      /* comets (realm 2 on), a valkyrie (realm 8 on) and rock showers (realm 9 on) */
      rockExtras(s, ms) {
        var R = this.rk, S = R.ship, W = this.W, H = this.H, g = this.fxG, i, self = this;
        if (this.tier >= 1) {
          R.cometCd -= ms;
          if (R.cometCd <= 0) {
            R.cometCd = this.tier >= 5 ? rnd(4000, 6000) : rnd(8000, 11000);
            var n = this.tier >= 5 ? 2 : 1, side = Math.random() < 0.5 ? -1 : 1, ang = rnd(-0.35, 0.35);
            for (i = 0; i < n; i++) {
              var cy = clamp(S.y + rnd(-120, 120) + i * 90, 40, H - 40), x0 = side < 0 ? -60 : W + 60;
              var vx = -side * Math.cos(ang) * 560, vy = Math.sin(ang) * 560;
              R.warns.push({ kind: "comet", x0: x0, y: cy, vx: vx, vy: vy, t: 0 });
            }
          }
        }
        for (i = R.warns.length - 1; i >= 0; i--) {
          var w = R.warns[i]; w.t += ms;
          if (w.kind === "comet") {
            g.lineStyle(3, 0xff5a4a, 0.25 + 0.35 * Math.abs(Math.sin(w.t / 90)));
            g.lineBetween(w.x0, w.y, w.x0 + w.vx * 3, w.y + w.vy * 3);
            if (w.t >= 1000) { var c = this.rockMake(1, null, w.x0, w.y, w.vx, w.vy); c.comet = true; c.spr.setTint(0xffb070); R.warns.splice(i, 1); snd("rock"); }
          } else {
            g.fillStyle(0xff5a4a, 0.35 + 0.35 * Math.abs(Math.sin(w.t / 90)));
            var ex = w.side === 0 ? 16 : W - 16, k;
            for (k = 0; k < 3; k++) { var yy = H * (0.3 + k * 0.2); g.fillTriangle(ex, yy - 14, ex, yy + 14, ex + (w.side === 0 ? 24 : -24), yy); }
            if (w.t >= 1200) {
              for (k = 0; k < 5; k++) this.rockMake(1, null, w.side === 0 ? -30 : W + 30, H * (0.15 + k * 0.17), (w.side === 0 ? 1 : -1) * rnd(150, 200), rnd(-30, 30));
              R.warns.splice(i, 1); snd("rock");
            }
          }
        }
        if (this.tier >= 8) {
          R.showerCd -= ms;
          if (R.showerCd <= 0) { R.showerCd = rnd(14000, 18000); R.warns.push({ kind: "shower", side: Math.random() < 0.5 ? 0 : 1, t: 0 }); }
        }
        if (this.tier >= 7) {
          if (!R.valk) {
            R.valkCd -= ms;
            if (R.valkCd <= 0) {
              var fromL = Math.random() < 0.5, vy0 = Math.random() < 0.5 ? rnd(50, H * 0.25) : rnd(H * 0.75, H - 50);
              R.valk = { x: fromL ? -50 : W + 50, y: vy0, vx: fromL ? 140 : -140, fireCd: 900, t: 0, spr: this.add.image(0, 0, "rf-valk-0").setScale(0.8).setDepth(15).setFlipX(!fromL) };
            }
          } else {
            var V = R.valk; V.t += s; V.x += V.vx * s;
            V.spr.setPosition(V.x, V.y + Math.sin(V.t * 3) * 6).setTexture("rf-valk-" + (Math.floor(V.t * 4) % 2));
            V.fireCd -= ms;
            if (V.fireCd <= 0 && V.x > 0 && V.x < W) {
              V.fireCd = 1500;
              var dx = S.x - V.x, dy = S.y - V.y, dl = Math.sqrt(dx * dx + dy * dy) || 1;
              R.spears.push({ x: V.x, y: V.y, vx: dx / dl * 300, vy: dy / dl * 300, spr: this.add.image(V.x, V.y, "md-arrow").setTint(0xe0e8ff).setDepth(17).setRotation(Math.atan2(dy, dx) + Math.PI / 2) });
              snd("shot");
            }
            if (V.x < -80 || V.x > W + 80) { kill(V); R.valk = null; R.valkCd = rnd(14000, 20000); }
          }
        }
        for (i = R.spears.length - 1; i >= 0; i--) {
          var sp = R.spears[i], gone = false;
          sp.x += sp.vx * s; sp.y += sp.vy * s; sp.spr.setPosition(sp.x, sp.y);
          if (dist(sp.x, sp.y, S.x, S.y) < 22) { gone = true; this.loseLife("hit", "A VALKYRIE'S SPEAR HIT YOU"); }
          else if (sp.x < -40 || sp.x > W + 40 || sp.y < -40 || sp.y > H + 40) gone = true;
          if (gone) { sp.spr.destroy(); R.spears.splice(i, 1); }
          if (this._finishing) return;
        }
      }
      clear_rocks() {
        var R = this.rk, self = this;
        R.gen += 1;
        R.rocks.filter(function (o) { return o.letter; }).forEach(function (o) { self.burst(o.x, o.y, 0xffd84a, 10); self.rockRemove(o); });
      }

      /* ═══ 3. SUN CHARIOT — side-scrolling flyer ═══════════════════════════
         v5.7.5: harder from the start and climbing faster. The first Sun Chariot
         (level 6) plays like level 30 used to, and every later one adds more.
         Ravens throw feathers at Sol (after a short orange wind-up), wisps throw
         sparks from level 26, and from level 16 the orbs weave more and some are
         guarded by a raven flying in front of them that has to be shot first. */
      skyParams(n) {
        var eff = 30 + Math.max(0, n - 6) * 1.25;          /* 30 at level 6, 42 at 16, 80 at 46, 142 at 96 */
        var late = Math.max(0, n - 6), tier = clamp(Math.floor((n - 1) / 10), 0, 9);
        return {
          eff: eff,
          spawnMs: Math.max(380, 1200 - eff * 6),
          ravenSp: 170 + Math.min(130, eff * 0.9),         /* + up to 70 random */
          wispSp: 110 + Math.min(90, eff * 0.6),
          wispHome: 60 + Math.min(80, eff * 0.5),
          wispShare: 0.25 + Math.min(0.2, eff / 600),
          throwP: clamp(0.35 + eff / 300, 0.35, 0.85),     /* chance a raven throws a feather */
          featherSp: 230 + Math.min(170, eff * 1.2),
          sparkP: n >= 26 ? clamp(0.3 + (eff - 55) / 250, 0.3, 0.7) : 0,
          sparkSp: 180 + Math.min(120, eff),
          orbSp: 90 + Math.min(100, eff * 0.6),                /* v5.7.9: faster from the start */
          bob: 34 + Math.min(56, late * 1.1),                  /* and they wobble more from the start */
          bobFr: 1.8 + Math.min(1.2, late * 0.015),
          guards: n >= 16 ? 1 + Math.floor((n - 16) / 20) : 0,  /* 1 at 16, 2 at 36, 3 at 56, 4 at 76 */
          /* v5.7.9: every orb sits in a turning shield with one gap; a bolt only gets through the gap. Each
             Sun Chariot level (one per realm) narrows the gap and spins it faster; from the fourth the shields
             reverse now and then, from the seventh they spin at different speeds. Orbs are smaller too. */
          tier: tier,
          orbScale: 0.8, coreR: 24, shieldR: 40,
          gapHalf: Math.max(35, 62 - tier * 3) * Math.PI / 180,  /* half the gap: 62° at level 6, 35° by level 96 */
          spin: Math.min(2.6, 1.3 + tier * 0.15),               /* radians a second */
          flip: tier >= 3,                                       /* shields reverse every 2.5–5 s */
          spinVar: tier >= 6 ? 0.45 : 0.15
        };
      }
      setup_sky() {
        this.drawSkyBg(50);
        this.skyHills();
        var x = this.W * 0.2, y = this.H / 2;
        /* v5.7.9: two horses pull the chariot; the team is drawn smaller than the old chariot on its own */
        this.teamS = 0.74; this.teamOff = (TEAM_W / 2 - TEAM_CAR) * this.teamS;
        this.chariot = this.add.image(x + this.teamOff, y, "md-team-0").setScale(this.teamS).setDepth(21);
        this.makeSol(x - 4, y - 17, "right", 1.2);
        this.sky = { bolts: [], foes: [], orbs: [], shots: [], cd: 0, spawnCd: 1800, t: 0, x: x, y: y, P: this.skyParams(this.night) };
      }
      skyHills() {
        var id = this.realm ? this.realm.id : "midgard", W = this.W, H = this.H;
        if (this.hillFar) this.hillFar.destroy();
        if (this.hillNear) this.hillNear.destroy();
        if (this.textures.exists("md-hills-far-" + id)) this.hillFar = this.add.tileSprite(0, H, W, 200, "md-hills-far-" + id).setOrigin(0, 1).setDepth(1);
        if (this.textures.exists("md-hills-near-" + id)) this.hillNear = this.add.tileSprite(0, H, W, 150, "md-hills-near-" + id).setOrigin(0, 1).setDepth(2);
      }
      resize_sky() { this.drawSkyBg(50); this.skyHills(); }
      answers_sky() {
        var K2 = this.sky, W = this.W, H = this.H, self = this, P = K2.P;
        K2.orbs.forEach(kill); K2.orbs = [];
        K2.foes = K2.foes.filter(function (f) { if (f.kind === "guard") { kill(f); return false; } return true; });
        var letters = shuffle(this.choiceLetters().slice()), n = letters.length;
        var lanes = []; for (var i = 0; i < n; i++) lanes.push(90 + (H - 190) * (n === 1 ? 0.5 : i / (n - 1)));
        shuffle(lanes);
        letters.forEach(function (L, k) {
          var o = { x: W + 90 + k * 200, by: lanes[k], y: lanes[k], ph: rnd(0, 6), letter: L, vx: -P.orbSp * rnd(0.9, 1.1),
            gap: rnd(0, Math.PI * 2), spin: P.spin * rnd(1 - P.spinVar, 1 + P.spinVar) * (Math.random() < 0.5 ? -1 : 1), flipCd: rnd(2500, 5000) };
          o.spr = self.add.image(o.x, o.y, "md-orb").setScale(P.orbScale).setDepth(13);
          o.label = self.letterText(o.x, o.y, L, 24, "#1a2a5a", "#ffffff");
          K2.orbs.push(o);
        });
        /* guards: right and wrong orbs alike, so a guard gives nothing away */
        shuffle(K2.orbs.slice()).slice(0, Math.min(P.guards, n)).forEach(function (o) { o.guarded = true; self.skyGuard(o); });
      }
      skyGuard(o) {
        var g = { kind: "guard", orb: o, x: o.x - 58, y: o.y, r: 22, t: rnd(0, 3), spr: this.add.image(o.x - 58, o.y, "rf-raven-0").setScale(0.72).setFlipX(true).setTint(0xd8c8ff).setDepth(15) };
        this.sky.foes.push(g);
        return g;
      }
      skyThrow(x, y, spark) {
        var K2 = this.sky, P = K2.P, tx = K2.x, ty = K2.y - 8, dx = tx - x, dy = ty - y, dl = Math.sqrt(dx * dx + dy * dy) || 1, sp = spark ? P.sparkSp : P.featherSp;
        var spr = spark ? this.add.image(x, y, "spark").setTint(0xbfe8ff).setScale(1.1).setDepth(17) : this.add.image(x, y, "md-feather").setDepth(17);
        K2.shots.push({ x: x, y: y, vx: dx / dl * sp, vy: dy / dl * sp, spark: !!spark, t: 0, spr: spr });
        snd(spark ? "beam" : "shot");
      }
      tick_sky(s, inp, ms) {
        var K2 = this.sky, W = this.W, H = this.H, P = K2.P, i, j, self = this;
        K2.t += s;
        if (this.hillFar) this.hillFar.tilePositionX += 30 * s;
        if (this.hillNear) this.hillNear.tilePositionX += 80 * s;
        /* flying */
        var vx = inp.ax * 380, vy = inp.ay * 380;
        if (inp.ay && inp.ax) { vx *= 0.7071; vy *= 0.7071; }
        K2.x = clamp(K2.x + vx * s, 60, W * 0.55); K2.y = clamp(K2.y + vy * s, 56, H - 44);
        this.chariot.setPosition(K2.x + this.teamOff, K2.y + Math.sin(K2.t * 3) * 2).setTexture("md-team-" + (Math.floor(K2.t * 7) % 2));
        this.player.setPosition(K2.x - 4, K2.y - 17 + Math.sin(K2.t * 3) * 2);
        this.blink(this.chariot); this.blink(this.player);
        /* sunbolts: the first thing in a bolt's path takes it (a guard shields its orb) */
        K2.cd -= ms;
        if (inp.fire && K2.cd <= 0) {
          var bx0 = K2.x + (TEAM_W - TEAM_CAR) * this.teamS;   /* from in front of the horses */
          K2.bolts.push({ x: bx0, y: K2.y - 4, spr: this.add.image(bx0, K2.y - 4, "md-bolt").setDepth(18) });
          K2.cd = 200; K2.fired = (K2.fired || 0) + 1; snd("shot");
        }
        for (i = K2.bolts.length - 1; i >= 0; i--) {
          var b = K2.bolts[i], x0 = b.x, best = null, bx = 1e9, isOrb = false, blocked = false;
          b.x += 820 * s; b.spr.x = b.x;
          K2.foes.forEach(function (f) { if (Math.abs(f.y - b.y) < f.r + 6 && f.x + f.r + 6 >= x0 && f.x - f.r - 6 <= b.x && f.x < bx) { best = f; bx = f.x; isOrb = false; } });
          /* an orb: the bolt meets its shield where it crosses the circle; the gap lets it through to the orb */
          K2.orbs.forEach(function (o) {
            var R = P.shieldR, dy = b.y - o.y;
            if (Math.abs(dy) >= R) return;
            var ex = o.x - Math.sqrt(R * R - dy * dy);
            if (ex < x0 - 2 || ex > b.x + 2 || ex >= bx) return;
            var open = Math.abs(angDiff(Math.atan2(dy, ex - o.x), o.gap)) < P.gapHalf;
            if (open && Math.abs(dy) > P.coreR) return;          /* through the gap but past the orb */
            best = o; bx = ex; isOrb = true; blocked = !open;
          });
          if (best && isOrb && blocked) {
            this.burst(bx, b.y, 0xffd84a, 6); snd("rock");
            best.hitT = 180;
            if (!K2.toldShield) { K2.toldShield = true; this.toast("The orb's shield stopped that sunbolt. Shoot when the gap faces you.", 2600); }
          } else if (best && !isOrb) {
            this.burst(best.x, best.y, best.kind === "wisp" ? 0xbfe8ff : 0x5a4a78, 12); snd("pop");
            kill(best); K2.foes.splice(K2.foes.indexOf(best), 1); this.addKill(best.x, best.y, "Sky cleared");
          } else if (best) {
            K2.orbs.splice(K2.orbs.indexOf(best), 1);
            kill(best);
            this.answerPick(best.letter, best.x, best.y);
          }
          if (best || b.x > W + 30) { b.spr.destroy(); K2.bolts.splice(i, 1); }
          if (this._finishing) return;
        }
        /* orbs drift past and come round again (weaving harder from level 16) */
        var g = this.fxG; g.clear();
        K2.orbs.forEach(function (o) {
          o.x += o.vx * s; o.y = o.by + Math.sin(K2.t * P.bobFr + o.ph) * P.bob;
          if (P.flip) { o.flipCd -= ms; if (o.flipCd <= 0) { o.spin = -o.spin; o.flipCd = rnd(2500, 5000); } }
          o.gap += o.spin * s;
          if (o.hitT) o.hitT = Math.max(0, o.hitT - ms);
          /* the shield: a thick gold ring with a dark edge, open where the gap is */
          var a0 = o.gap + P.gapHalf, a1 = o.gap - P.gapHalf + Math.PI * 2;
          g.lineStyle(10, 0x3a2608, 0.8); g.beginPath(); g.arc(o.x, o.y, P.shieldR, a0, a1, false); g.strokePath();
          g.lineStyle(6, o.hitT ? 0xffffff : 0xffd84a, 0.95); g.beginPath(); g.arc(o.x, o.y, P.shieldR, a0, a1, false); g.strokePath();
          if (o.x < -60) {
            o.x = W + 60 + rnd(0, 220); o.by = rnd(90, H - 100);
            if (o.guarded && !K2.foes.some(function (f) { return f.orb === o; })) self.skyGuard(o);   /* a new guard each time round */
          }
          o.spr.setPosition(o.x, o.y); o.label.setPosition(o.x, o.y);
        });
        /* ravens and wisps */
        K2.spawnCd -= ms;
        if (K2.spawnCd <= 0 && !this._between) {
          var wisp = Math.random() < P.wispShare, y0 = rnd(60, H - 60);
          var foe = wisp
            ? { kind: "wisp", x: W + 40, y: y0, by: y0, r: 20, sp: P.wispSp, spr: this.add.image(W + 40, y0, "rf-wisp").setScale(0.7).setDepth(15) }
            : { kind: "raven", x: W + 40, y: y0, by: y0, r: 22, sp: P.ravenSp + rnd(0, 70), amp: rnd(20, 80), fr: rnd(1.5, 3), t: 0, spr: this.add.image(W + 40, y0, "rf-raven-0").setScale(0.7).setFlipX(true).setDepth(15) };
          /* will it throw, and from how far along? */
          var pThrow = wisp ? P.sparkP : P.throwP;
          if (Math.random() < pThrow) foe.throwX = rnd(K2.x + 220, W - 60);
          K2.foes.push(foe);
          K2.spawnCd = P.spawnMs * rnd(0.7, 1.3);
        }
        for (i = K2.foes.length - 1; i >= 0; i--) {
          var e = K2.foes[i];
          if (e.kind === "guard") {
            if (K2.orbs.indexOf(e.orb) === -1) { kill(e); K2.foes.splice(i, 1); continue; }
            e.t += s; e.x = e.orb.x - 58; e.y = e.orb.y + Math.sin(e.t * 5) * 4;
            e.spr.setPosition(e.x, e.y).setTexture("rf-raven-" + (Math.floor(e.t * 4) % 2));
          } else if (e.kind === "wisp") {
            e.x -= e.sp * s;
            e.y += clamp(K2.y - e.y, -1, 1) * P.wispHome * s;
            e.spr.setPosition(e.x, e.y).setAlpha(0.75 + Math.sin(K2.t * 8 + i) * 0.2);
          } else {
            e.t += s; e.x -= e.sp * s; e.y = e.by + Math.sin(e.t * e.fr) * e.amp;
            e.spr.setPosition(e.x, e.y).setTexture("rf-raven-" + (Math.floor(e.t * 4) % 2));
          }
          /* the wind-up (it glows orange for a third of a second), then the throw */
          if (e.throwX != null && e.x <= e.throwX && !e.thrown) {
            e.wind = (e.wind || 0) + ms;
            if (e.kind === "raven") e.spr.setTint(0xffb060);
            if (e.wind >= 330) { e.thrown = true; e.spr.clearTint(); this.skyThrow(e.x - 16, e.y, e.kind === "wisp"); }
          }
          if (dist(e.x, e.y, K2.x, K2.y - 8) < e.r + 20 || dist(e.x, e.y, K2.x + 72 * this.teamS, K2.y) < e.r + 14) {   /* the car or the horses */
            var hurt = this.loseLife("hit", e.kind === "wisp" ? "A WISP HIT YOU" : "A RAVEN HIT YOU");
            if (hurt) { this.burst(e.x, e.y, 0xff9a7a, 12); kill(e); K2.foes.splice(i, 1); }
            if (this._finishing) return;
            continue;
          }
          if (e.x < -60 && e.kind !== "guard") { kill(e); K2.foes.splice(i, 1); }
        }
        /* feathers and sparks */
        for (i = K2.shots.length - 1; i >= 0; i--) {
          var sh = K2.shots[i];
          sh.t += s; sh.x += sh.vx * s; sh.y += sh.vy * s;
          sh.spr.setPosition(sh.x, sh.y).setRotation(sh.spark ? sh.t * 6 : Math.atan2(sh.vy, sh.vx) + Math.PI / 2 + Math.sin(sh.t * 10) * 0.3);
          var gone = sh.x < -30 || sh.x > W + 30 || sh.y < -30 || sh.y > H + 30;
          if (!gone && (dist(sh.x, sh.y, K2.x, K2.y - 8) < 26 || dist(sh.x, sh.y, K2.x + 72 * this.teamS, K2.y) < 18)) {
            gone = true;
            this.loseLife("hit", sh.spark ? "A WISP'S SPARK HIT YOU" : "HIT BY A FEATHER");
            if (this._finishing) { sh.spr.destroy(); K2.shots.splice(i, 1); return; }
          }
          if (gone) { sh.spr.destroy(); K2.shots.splice(i, 1); }
        }
      }
      clear_sky() {
        var K2 = this.sky, self = this;
        K2.foes.forEach(function (f) { self.burst(f.x, f.y, 0xffd84a, 6); kill(f); }); K2.foes = [];
        K2.orbs.forEach(function (o) { self.burst(o.x, o.y, 0xbfe8ff, 8); kill(o); }); K2.orbs = [];
        K2.shots.forEach(kill); K2.shots = [];
        K2.spawnCd = 1800;
        try { this.fxG.clear(); } catch (e) {}
      }

      /* ═══ 4. WOLF RING — arena ════════════════════════════════════════════ */
      setup_ring() {
        this.rg = { arrows: [], wolves: [], stones: [], cd: 0, spawnCd: 2200, aim: -Math.PI / 2, frameMs: 0,
          ammo: 6, ammoMs: 0, alphaCd: 7000, drops: [], rav: null, ravCd: 5000 };
        this.ringLayout();
        this.makeSol(this.rg.cx, this.rg.cy, "up");
      }
      ringLayout() {
        var W = this.W, H = this.H, rg = this.rg, pal = this.pal;
        rg.cx = W / 2; rg.cy = H / 2; rg.R = Math.min(W, H) * 0.45;
        if (this.bgG) this.bgG.destroy();
        var g = this.bgG = this.add.graphics().setDepth(0), i;
        g.fillStyle(mix(pal.void, 0x000000, 0.1), 1); g.fillRect(0, 0, W, H);
        g.fillStyle(mix(pal.floorB, 0x000000, 0.45), 1); g.fillCircle(rg.cx, rg.cy, rg.R + 18);
        g.fillStyle(mix(pal.floorA, 0x000000, 0.32), 1); g.fillCircle(rg.cx, rg.cy, rg.R);
        g.lineStyle(2, mix(pal.accent || 0xffe08a, 0x000000, 0.35), 0.5); g.strokeCircle(rg.cx, rg.cy, rg.R * 0.5); g.strokeCircle(rg.cx, rg.cy, rg.R * 0.18);
        for (i = 0; i < 28; i++) {
          var a = i / 28 * Math.PI * 2;
          g.fillStyle(mix(pal.lip, 0x6a665e, 0.5), 1);
          g.fillCircle(rg.cx + Math.cos(a) * (rg.R + 10), rg.cy + Math.sin(a) * (rg.R + 10), 9);
        }
      }
      resize_ring() {
        var rg = this.rg, oldCx = rg.cx, oldCy = rg.cy;
        this.ringLayout();
        var dx = rg.cx - oldCx, dy = rg.cy - oldCy;
        if (this.player) { this.player.x += dx; this.player.y += dy; }
        rg.wolves.forEach(function (w) { w.x += dx; w.y += dy; });
        this.ringPlaceStones();
      }
      /* v5.7.5: the runestones start sunk in the ground. The Hati attack first; after a few seconds
         the stones rise one or two at a time, in a shuffled order, on random spots round the ring. Each
         stays up for a few seconds, then sinks and the next rise, so the right answer is only open
         for a moment and never before the wolves are on the move. */
      answers_ring() {
        var rg = this.rg, self = this;
        rg.stones.forEach(kill); rg.stones = [];
        var letters = shuffle(this.choiceLetters().slice());
        rg.stoneA0 = rnd(0, Math.PI * 2);
        rg.slotN = 8;
        letters.forEach(function (L) {
          var o = { letter: L, dead: false, state: "down", t: 0, slot: 0, x: -999, y: -999 };
          o.spr = self.add.image(0, 0, "md-stone").setDepth(9).setVisible(false);
          o.label = self.letterText(0, 0, L, 30, "#ffe07a", "#1a1008").setDepth(10).setVisible(false);
          rg.stones.push(o);
        });
        rg.queue = [];
        rg.riseCd = 3600;                                   /* the wolves get a head start */
        rg.spawnCd = Math.min(rg.spawnCd, 600);
        rg.upMs = Math.max(3800, 6500 - this.night * 25) * (this.tier >= 7 ? 0.75 : 1);   /* how long a stone stays up */
      }
      ringSlotPos(k, drift) {
        var rg = this.rg, a = rg.stoneA0 + k / rg.slotN * Math.PI * 2 + (drift || 0);
        return { x: rg.cx + Math.cos(a) * (rg.R - 34), y: rg.cy + Math.sin(a) * (rg.R - 34) };
      }
      ringPlaceStones() {
        var self = this;
        this.rg.stones.forEach(function (o) {
          if (o.state === "down") return;
          var q = self.ringSlotPos(o.slot, o.drift); o.x = q.x; o.y = q.y;
          self.ringDrawStone(o);
        });
      }
      ringDrawStone(o) {
        var k = o.state === "rising" ? clamp(o.t / 400, 0, 1) : o.state === "sinking" ? clamp(1 - o.t / 350, 0, 1) : o.state === "up" ? 1 : 0;
        o.spr.setVisible(k > 0).setScale(1, Math.max(0.01, k)).setPosition(o.x, o.y + (1 - k) * 34);
        o.label.setVisible(k > 0.6).setAlpha(k).setPosition(o.x, o.y - 2);
      }
      /* raise a stone on a free spot, not right beside Sol */
      ringRaise(o) {
        var rg = this.rg, p = this.player, self = this, used = {}, free = [], k;
        rg.stones.forEach(function (q) { if (q !== o && q.state !== "down") used[q.slot] = true; });
        for (k = 0; k < rg.slotN; k++) if (!used[k]) { var q2 = this.ringSlotPos(k); if (!p || dist(q2.x, q2.y, p.x, p.y) > 130) free.push(k); }
        if (!free.length) for (k = 0; k < rg.slotN; k++) if (!used[k]) free.push(k);
        o.slot = free[Math.floor(Math.random() * free.length)] || 0;
        o.drift = 0; o.dv = this.tier >= 4 ? (Math.random() < 0.5 ? -1 : 1) * rnd(0.22, 0.38) * (this.tier >= 9 ? 1.3 : 1) : 0;   /* sliding stones from realm 5 */
        var pos = this.ringSlotPos(o.slot); o.x = pos.x; o.y = pos.y;
        o.state = "rising"; o.t = 0;
        this.burst(o.x, o.y + 20, 0x9a8a6a, 10);
        snd("rock");
        this.ringDrawStone(o);
      }
      ringStones(ms) {
        var rg = this.rg, self = this;
        rg.stones.forEach(function (o) {
          if (o.state === "down") return;
          o.t += ms;
          if (o.dv && o.state === "up" && !o.dead) { o.drift += o.dv * ms / 1000; var q3 = self.ringSlotPos(o.slot, o.drift); o.x = q3.x; o.y = q3.y; }
          if (o.state === "rising" && o.t >= 400) { o.state = "up"; o.t = 0; }
          else if (o.state === "up" && o.t >= (o.dead ? 1000 : rg.upMs)) { o.state = "sinking"; o.t = 0; }
          else if (o.state === "sinking" && o.t >= 350) { o.state = "down"; o.t = 0; if (!rg.stones.some(function (q) { return q.state !== "down"; })) rg.riseCd = 900; }
          self.ringDrawStone(o);
        });
        if (this._between) return;
        rg.riseCd -= ms;
        if (rg.riseCd > 0 || rg.stones.some(function (q) { return q.state !== "down"; })) return;
        /* next one or two, from a shuffled round of the stones still in play */
        var live = rg.stones.filter(function (q) { return !q.dead; });
        if (!live.length) return;
        rg.queue = rg.queue.filter(function (q) { return !q.dead; });
        if (!rg.queue.length) rg.queue = shuffle(live.slice());
        var n = Math.min(rg.queue.length, Math.random() < 0.5 ? 1 : 2);
        for (var i = 0; i < n; i++) this.ringRaise(rg.queue.shift());
        rg.riseCd = 99999;
      }
      tick_ring(s, inp, ms) {
        var rg = this.rg, p = this.player, i, j, self = this, g = this.fxG, now = this.time.now;
        g.clear();
        /* move */
        var ax = inp.ax, ay = inp.ay, l = Math.sqrt(ax * ax + ay * ay) || 1;
        p.x += ax / l * 320 * s; p.y += ay / l * 320 * s;
        var dc = dist(p.x, p.y, rg.cx, rg.cy), lim = rg.R - 34;
        if (dc > lim) { p.x = rg.cx + (p.x - rg.cx) / dc * lim; p.y = rg.cy + (p.y - rg.cy) / dc * lim; }
        this.ringStones(ms);
        rg.stones.forEach(function (o) {
          if (o.state !== "up") return;
          var d = dist(p.x, p.y, o.x, o.y);
          if (d < 40 && d > 0) { p.x = o.x + (p.x - o.x) / d * 40; p.y = o.y + (p.y - o.y) / d * 40; }
        });
        /* aim: the mouse or a finger if one is in use, else the way Sol walks */
        if (inp.ptr || now - this.ptr.t < 1500) rg.aim = Math.atan2(this.ptr.y - p.y, this.ptr.x - p.x);
        else if (ax || ay) rg.aim = Math.atan2(ay, ax);
        var ca = Math.cos(rg.aim), sa = Math.sin(rg.aim);
        this.playerFaceDir = Math.abs(ca) > Math.abs(sa) ? (ca > 0 ? "right" : "left") : (sa > 0 ? "down" : "up");
        this.tickPlayerCharAnim(ax, ay, false);
        this.blink(p);
        g.lineStyle(3, 0xffe07a, 0.55); g.lineBetween(p.x + ca * 26, p.y + sa * 26, p.x + ca * 58, p.y + sa * 58);
        g.fillStyle(0xffe07a, 0.7); g.fillTriangle(p.x + ca * 66, p.y + sa * 66, p.x + ca * 54 - sa * 7, p.y + sa * 54 + ca * 7, p.x + ca * 54 + sa * 7, p.y + sa * 54 - ca * 7);
        /* arrows */
        rg.cd -= ms;
        var quiver = this.tier >= 5;   /* realm 6 on: six arrows, each comes back after a moment */
        if (quiver) {
          if (rg.ammo < 6) { rg.ammoMs += ms; if (rg.ammoMs >= 650) { rg.ammoMs = 0; rg.ammo += 1; } } else rg.ammoMs = 0;
          for (var qi = 0; qi < 6; qi++) { g.fillStyle(qi < rg.ammo ? 0xffe07a : 0x5a5040, qi < rg.ammo ? 0.95 : 0.6); g.fillRect(p.x - 21 + qi * 7, p.y - 46, 4, 10); }
          if (inp.fire && rg.cd <= 0 && rg.ammo <= 0 && !rg.toldAmmo) { rg.toldAmmo = true; this.toast("Out of arrows! They come back one at a time.", 2200); }
        }
        if (inp.fire && rg.cd <= 0 && rg.arrows.length < 5 && (!quiver || rg.ammo > 0)) {
          if (quiver) rg.ammo -= 1;
          rg.arrows.push({ x: p.x + ca * 22, y: p.y + sa * 22, vx: ca * 720, vy: sa * 720, spr: this.add.image(p.x, p.y, "md-arrow").setRotation(rg.aim + Math.PI / 2).setDepth(18) });
          rg.cd = 260; snd("shot");
        }
        for (i = rg.arrows.length - 1; i >= 0; i--) {
          var a = rg.arrows[i], hit = false;
          a.x += a.vx * s; a.y += a.vy * s; a.spr.setPosition(a.x, a.y);
          for (j = 0; j < rg.wolves.length && !hit; j++) {
            var w = rg.wolves[j];
            if (w.state === "run" && dist(a.x, a.y, w.x, w.y) < (w.alpha ? 42 : 30)) {
              hit = true;
              if (w.alpha && w.hp > 1) {
                w.hp -= 1; this.burst(w.x, w.y, 0xd8dce4, 10); snd("yelp");
                var kb = Math.atan2(w.y - p.y, w.x - p.x); w.x += Math.cos(kb) * 50; w.y += Math.sin(kb) * 50;
                if (!rg.toldAlpha) { rg.toldAlpha = true; this.toast("The alpha wolf takes three arrows!", 2200); }
              } else { this.wolfScare(w); this.addKill(w.x, w.y, w.alpha ? "Alpha wolf chased off" : "Wolves chased off"); }
            }
          }
          for (j = 0; j < rg.stones.length && !hit; j++) {
            var o = rg.stones[j];
            var upEnough = o.state === "up" || (o.state === "rising" && o.t > 200);
            if (!o.dead && upEnough && dist(a.x, a.y, o.x, o.y) < 30) {
              hit = true;
              var res = this.answerPick(o.letter, o.x, o.y);
              if (res === "wrong") { o.dead = true; o.spr.setTint(0x555555); o.label.setText("✕").setColor("#8a8a8a"); o.state = "up"; o.t = 0; }
              else if (res === "partial") { o.dead = true; o.spr.setTint(0xffe07a); o.state = "up"; o.t = 0; }
            }
          }
          if (hit || dist(a.x, a.y, rg.cx, rg.cy) > rg.R + 90) { a.spr.destroy(); rg.arrows.splice(i, 1); }
          if (this._finishing) return;
        }
        /* the Hati */
        var running = rg.wolves.filter(function (w) { return w.state === "run"; }).length;
        rg.spawnCd -= ms;
        var cap = 3 + Math.floor(this.night / 22) + (this.tier >= 9 ? 1 : 0);
        if (rg.spawnCd <= 0 && !this._between && running < cap) {
          var sa2 = rnd(0, Math.PI * 2);
          this.ringWolf(sa2, false);
          if (this.tier >= 1 && Math.random() < 0.35 && running + 1 < cap + 1) this.ringWolf(sa2 + 0.2, false);   /* a pack of two */
          if (Math.random() < 0.25) snd("howl");
          rg.spawnCd = Math.max(650, 2100 - this.night * 13) * rnd(0.75, 1.25) * (this.tier >= 9 ? 0.75 : 1);
        }
        if (this.tier >= 2 && !this._between) {
          rg.alphaCd -= ms;
          var alphas = rg.wolves.filter(function (w) { return w.alpha && w.state === "run"; }).length;
          if (rg.alphaCd <= 0 && alphas < (this.tier >= 7 ? 2 : 1)) { this.ringWolf(rnd(0, Math.PI * 2), true); snd("howl"); rg.alphaCd = rnd(9000, 13000); }
        }
        if (this.tier >= 3) this.ringRavens(s, ms);
        rg.frameMs += ms;
        var frame = "hati" + (1 + Math.floor(rg.frameMs / 110) % 3);
        for (i = rg.wolves.length - 1; i >= 0; i--) {
          var wv = rg.wolves[i], tx, ty;
          if (wv.state === "run") { tx = p.x; ty = p.y; }
          else { tx = wv.x + (wv.x - rg.cx); ty = wv.y + (wv.y - rg.cy); }
          var dx = tx - wv.x, dy = ty - wv.y, dl = Math.sqrt(dx * dx + dy * dy) || 1, spd = wv.state === "run" ? wv.sp : 420;
          if (wv.state === "run") {
            wv.t = (wv.t || 0) + s;
            /* leaping wolves crouch (a clear pause), then leap the last stretch */
            if (wv.leap && !wv.leapt && dl < 190) { wv.crouch = (wv.crouch || 0) + ms; wv.spr.setTint(0xffc080); if (wv.crouch < 380) spd = 0; else { wv.leapt = true; wv.dash = 480; wv.spr.clearTint(); } }
            if (wv.dash > 0) { wv.dash -= ms; spd *= 2.3; }
            if (wv.zig && dl > 70) { var zz = Math.sin(wv.t * 6 + wv.ph) * spd * 0.8; wv.x += -dy / dl * zz * s; wv.y += dx / dl * zz * s; }
          }
          wv.x += dx / dl * spd * s; wv.y += dy / dl * spd * s;
          wv.spr.setPosition(wv.x, wv.y).setTexture(frame).setFlipX(dx < 0);
          if (wv.state === "flee") {
            wv.spr.setAlpha(Math.max(0, wv.spr.alpha - s * 1.2));
            if (dist(wv.x, wv.y, rg.cx, rg.cy) > rg.R + 160 || wv.spr.alpha <= 0.02) { kill(wv); rg.wolves.splice(i, 1); }
            continue;
          }
          if (dist(wv.x, wv.y, p.x, p.y) < (wv.alpha ? 44 : 36)) {
            var hurt = this.loseLife("hit", "A WOLF CAUGHT YOU");
            if (hurt) rg.wolves.forEach(function (o) { if (o.state === "run" && dist(o.x, o.y, p.x, p.y) < 280) self.wolfScare(o, true); });
            if (this._finishing) return;
          }
        }
      }
      ringWolf(ang, alpha) {
        var rg = this.rg, wx = rg.cx + Math.cos(ang) * (rg.R + 70), wy = rg.cy + Math.sin(ang) * (rg.R + 70);
        var w = { x: wx, y: wy, state: "run", sp: Math.min(285, 145 + this.night * 1.4) * rnd(0.9, 1.1) * (alpha ? 0.85 : 1), ph: rnd(0, 6),
          alpha: !!alpha, hp: alpha ? 3 : 1, zig: !alpha && this.tier >= 6 && Math.random() < 0.5, leap: !alpha && this.tier >= 8 && Math.random() < 0.4,
          spr: this.add.image(wx, wy, "hati1").setScale(alpha ? 0.74 : 0.5).setDepth(16) };
        if (alpha) w.spr.setTint(0xb8c0cc);
        rg.wolves.push(w);
        return w;
      }
      /* realm 4 on: a raven crosses the ring and drops poo; a shadow grows where it will land */
      ringRavens(s, ms) {
        var rg = this.rg, p = this.player, W = this.W, H = this.H, g = this.fxG, i, self = this;
        if (!rg.rav) {
          rg.ravCd -= ms;
          if (rg.ravCd <= 0 && !this._between) {
            var fromL = Math.random() < 0.5, y0 = rnd(rg.cy - rg.R * 0.6, rg.cy + rg.R * 0.6);
            rg.rav = { x: fromL ? -40 : W + 40, y: y0, vx: fromL ? 200 : -200, dropped: false, t: 0, spr: this.add.image(0, y0, "rf-raven-0").setScale(0.8).setDepth(20).setFlipX(!fromL) };
            snd("caw");
          }
        } else {
          var r = rg.rav; r.t += s; r.x += r.vx * s;
          r.spr.setPosition(r.x, r.y).setTexture("rf-raven-" + (Math.floor(r.t * 4) % 2));
          if (!r.dropped && Math.abs(r.x - p.x) < 60) { r.dropped = true; rg.drops.push({ x: p.x + rnd(-30, 30), y: p.y + rnd(-30, 30), t: 0 }); }
          if (r.x < -60 || r.x > W + 60) { kill(r); rg.rav = null; rg.ravCd = rnd(5000, 8000); }
        }
        for (i = rg.drops.length - 1; i >= 0; i--) {
          var d = rg.drops[i]; d.t += ms;
          var k = clamp(d.t / 1000, 0, 1);
          g.fillStyle(0x000000, 0.12 + 0.3 * k); g.fillEllipse(d.x, d.y + 8, 20 + 30 * k, 10 + 14 * k);
          if (d.t >= 1000) {
            var sp = this.add.image(d.x, d.y, "md-splat").setDepth(8).setScale(0.8);
            this.tweens.add({ targets: sp, alpha: 0, delay: 500, duration: 700, onComplete: function () { sp.destroy(); } });
            snd("pop");
            if (dist(p.x, p.y, d.x, d.y) < 34) this.loseLife("hit", "SPLAT! BIRD POO GOT YOU");
            rg.drops.splice(i, 1);
            if (this._finishing) return;
          }
        }
      }
      wolfScare(w, quiet) {
        w.state = "flee";
        w.spr.setTint(0xbfd8ff);
        if (!quiet) { this.burst(w.x, w.y, 0xbfd8ff, 10); snd("yelp"); }
      }
      clear_ring() {
        var rg = this.rg, self = this;
        rg.wolves.forEach(function (w) { if (w.state === "run") self.wolfScare(w, true); });
        rg.stones.forEach(function (o) { self.burst(o.x, o.y, 0xffe07a, 8); kill(o); });
        rg.stones = [];
        rg.spawnCd = 2400;
      }
    }

    return ModeScene;
  }

  /* v5.7.9: the maze draws Sol riding this chariot while the CHARIOT power lasts */
  function ensureChariotArt(scene) { canvasTex(scene, "md-team-0", TEAM_W, TEAM_H, drawTeam(0)); canvasTex(scene, "md-team-1", TEAM_W, TEAM_H, drawTeam(1)); }
  window.SolModes = { MODES: MODES, SLOTS: SLOTS, modeFor: modeFor, install: install, ensureChariotArt: ensureChariotArt,
    TEAM: { w: TEAM_W, h: TEAM_H, car: TEAM_CAR } };
})();
