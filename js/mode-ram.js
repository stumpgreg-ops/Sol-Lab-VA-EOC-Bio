/* SOL Labyrinth v5.11 — the Odyssey mode "ram": Under the Ram (Odyssey 9).
 *
 * Top-down view of Polyphemus's cave. The doorway is in the right-hand wall;
 * outside it, in the dawn light, the blinded Cyclops sits beside the path
 * with the great stone pushed aside, and his two huge hands sweep back and
 * forth across the doorway, feeling the BACKS of the rams as they go out to
 * pasture (Homer: he felt their backs, never their bellies).
 *
 * The rams carry the letters, painted on a tag on their fleece. They graze
 * and wander, and every few seconds one more heads for the door, so the
 * flock drifts out in a loose line. Odysseus walks the cave floor; the
 * action key (Space, the CLING button or a mouse button) grabs on under the
 * ram he is touching, and again lets go. Under a ram he rides with it; when
 * that ram passes out through the door, its letter is his answer: the right
 * one answers the question, a wrong one costs a life and is crossed out on
 * the other rams (a crossed-out ram can't be ridden). A Select TWO question
 * needs a ride out on each right letter.
 *
 * Dangers: a hand that touches Odysseus while he is NOT under a ram catches
 * him (a life) and throws him back into the cave. Besides sweeping the door,
 * a hand gropes into the cave: a shadow and a closing ring show where it
 * will come down. From level 31 a hand sometimes feels UNDER a ram (a red
 * ring and a "!" over it): get out from under that ram in time. Polyphemus
 * roars now and then and the rams scatter. If the whole flock goes out
 * without him, that costs a life and a new flock comes in.
 *
 * ramParams(n) sets one difficulty curve (exposed as MODES.ram.params).
 * Registered with SolModes.extend; the methods run as ModeScene methods.
 * Texture keys: md-ram-*. Everything is drawn once (the cave background again
 * only when the canvas is resized); per frame only positions change and three
 * Graphics layers (warnings, rings, the giant's arms) are redrawn.
 */
(function () {
  "use strict";
  var M = window.SolModes;
  if (!M || !M.extend || !M.lib) return;
  var L = M.lib, clamp = L.clamp, rnd = L.rnd, dist = L.dist, shuffle = L.shuffle, angDiff = L.angDiff, canvasTex = L.canvasTex;
  var TAU = Math.PI * 2, SERIF = "Georgia, 'Palatino Linotype', serif";
  /* the Odyssey sheet's palette, plus fleece, skin and rock */
  var C = { terra: "#d9772b", ochre: "#e8b04a", glaze: "#140c0a", wine: "#3a0f2a", blue: "#1e5f8c", foam: "#9fd3d6", bone: "#efe6d2",
    fleece: "#f5f0e4", curl: "#d2c7ae", skin: "#ecd8bc", skinDk: "#c9a684", giant: "#e6cfae", giantDk: "#c7a47e", hair: "#1c110b" };

  /* ── difficulty: one curve for every level (fair at 21, intense at 99) ── */
  function ramParams(n) {
    n = Math.max(1, Math.min(100, Math.floor(n) || 1));
    var rams = Math.min(12, 8 + Math.floor((n - 1) / 25));      /* 8 rams, 9 from 26, 10 from 51, 11 from 76 */
    var flockMs = Math.max(24000, 54000 - n * 300);              /* about how long until the whole flock is out */
    return {
      rams: rams,
      flockMs: flockMs,
      releaseMs: Math.round(flockMs / rams),                     /* one more ram heads for the door every … ms */
      walkSp: 52 + n * 0.68,                                     /* the flock's pace toward the door, px a second */
      grazeSp: 28 + n * 0.3,
      handSp: 0.55 + n * 0.0075,                                 /* how fast the hands sweep across the doorway */
      sweepDepth: 24 + n * 0.9,                                  /* how far the sweep bulges into the cave, px */
      reach: Math.min(0.56, 0.24 + n * 0.0032),                  /* how far in a hand gropes, share of the cave's width */
      gropeEvery: Math.max(1300, 4700 - n * 34),                 /* ms between gropes into the cave */
      gropers: n >= 61 ? 2 : 1,                                  /* hands groping at the same time */
      warn: Math.max(620, 1500 - n * 8.8),                       /* the shadow on the floor before a hand comes down, ms */
      aimErr: Math.max(8, 92 - n * 0.85),                        /* how far from Odysseus a grope lands */
      underEvery: n >= 31 ? Math.max(3000, 9800 - (n - 31) * 100) : 1e9,   /* feeling UNDER a ram (never before 31) */
      roarEvery: n >= 11 ? Math.max(8000, 30000 - (n - 11) * 250) : 1e9,   /* roars (never before 11) */
      roarWarn: Math.max(600, 1150 - n * 5.5),                   /* he draws a breath first */
      scatterSp: 140 + n,                                        /* how fast the rams scatter at a roar */
      again: n >= 51,                                            /* a grope that finds nothing gropes again at once */
      doubleUnder: n >= 71,                                      /* after feeling under one ram he may feel the next one */
      loudRoar: n >= 81                                          /* louder roars: further scatter, and the hands sweep faster for a moment */
    };
  }

  var DEF = {
    name: "Under the Ram", kind: "sneaking level", level: "sneaking level", act: "CLING",
    how: "Odysseus is trapped in the Cyclops's cave. At dawn the blinded Polyphemus pushes the great stone aside and sits by the doorway, " +
      "sweeping his huge hands across it to feel the backs of his rams as they go out to pasture. Every ram carries a letter on its fleece. " +
      "Walk up to a ram with the right answer, grab on under its belly, and ride it out through the door: he feels only their backs, so he won't find you there. " +
      "The rams wander, then drift to the door in a loose line, and the flock won't wait for you. Watch his hands: a dark shadow on the floor shows where one will grope next. " +
      "Sometimes he roars, and the frightened rams scatter.",
    rules: "Riding out under a wrong letter costs a life, and that letter is crossed out on the other rams. " +
      "A touch from Polyphemus's hand while you are not under a ram costs a life too (he throws you back into the cave), and so does letting the whole flock go out without you (then a new flock comes in).",
    keys: "Arrow keys, WASD or the on-screen pad move Odysseus · Space, CLING or a mouse button: grab on under the ram you are touching; press again to let go. You can't walk out on foot.",
    tip: "UNDER THE RAM — cling under the ram with the right letter and ride it out past Polyphemus's hands.",
    hint1: "Cling under a ram with the right letter and ride it out through the door. The passage stays in the side panel.",
    hint2: "This question has two right letters. Ride out under a ram with each of them, one at a time.",
    news: ["",
      "Polyphemus roars now and then, and the frightened rams scatter for a moment. Hold on tight!",
      "A bigger flock that moves out sooner, and his hands reach further into the cave.",
      "Polyphemus now feels UNDER the rams too. When a red ring and a \"!\" fall on your ram, let go and get away, or get under another ram.",
      "The rams trot out faster, and he feels under them more often.",
      "A hand that finds nothing gropes again at once, close by.",
      "Both hands grope into the cave at the same time.",
      "After feeling under one ram, he may feel under the ram next to it straight away.",
      "Louder roars: the rams scatter further, and his hands sweep faster for a moment.",
      "Ithaca is close: the flock, the hands and the roars are all faster, on top of everything else."],
    params: ramParams
  };

  /* ── art (canvas textures, drawn once) ── */
  var RAM_W = 100, RAM_H = 66, RAM_CX = 46, RAM_CY = 33, PLAQUE_DX = -6, RAM_SC = 0.92, RAM_R = 27, RAM_SEP = 66;
  var HAND_W = 132, HAND_H = 116, PALM_X = 54, PALM_Y = 58, HAND_R = 44;
  var POLY_W = 320, POLY_H = 340, POLY_HX = 160, POLY_HY = 118, POLY_SH = [[70, 236], [250, 236]];
  var ODY_S = 46, ODY_SP = 215, ODY_R = 13;

  function ell(c, x, y, rx, ry, rot) { c.beginPath(); c.ellipse(x, y, rx, ry, rot || 0, 0, TAU); }
  function circ(c, x, y, r) { c.beginPath(); c.arc(x, y, r, 0, TAU); }
  function pathPts(c, pts) { c.beginPath(); for (var i = 0; i < pts.length; i++) c[i ? "lineTo" : "moveTo"](pts[i][0], pts[i][1]); }
  function seeded(seed) { var s = seed % 233280; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
  function stroke2(c, pts, w, col, w2, col2) {
    c.lineCap = "round"; c.lineJoin = "round";
    c.strokeStyle = col; c.lineWidth = w; pathPts(c, pts); c.stroke();
    if (col2) { c.strokeStyle = col2; c.lineWidth = w2; pathPts(c, pts); c.stroke(); }
  }
  /* a curly lump of fleece: a ring of curls round a soft middle */
  function fleece(c, x, y, r, col) {
    var n = Math.max(7, Math.round(r * 0.9)), i, a;
    c.fillStyle = col || C.fleece; c.strokeStyle = C.glaze; c.lineWidth = 1.6;
    for (i = 0; i < n; i++) { a = i / n * TAU; circ(c, x + Math.cos(a) * r * 0.74, y + Math.sin(a) * r * 0.74, r * 0.38); c.fill(); c.stroke(); }
    circ(c, x, y, r * 0.78); c.fill();
  }
  /* a ram's horn: a thick spiral beside its head, curling back and out */
  function horn(c, x, y, sd) {
    var pts = [], k;
    for (k = 0; k <= 26; k++) {
      var t = k / 26, th = (sd < 0 ? Math.PI / 2 : -Math.PI / 2) + (sd < 0 ? 1 : -1) * t * TAU * 1.3, rr = 9.5 * (1 - 0.72 * t);
      pts.push([x + Math.cos(th) * rr, y + Math.sin(th) * rr]);
    }
    stroke2(c, pts, 7, C.glaze, 4.4, "#c79d62");
    c.strokeStyle = "rgba(255,238,200,0.55)"; c.lineWidth = 1.2; pathPts(c, pts); c.stroke();
  }
  /* a ram from above, facing right: big curly white fleece, the painted letter tag on its back, curled horns */
  function drawRam(frame) {
    return function (c) {
      var cx = RAM_CX, cy = RAM_CY, i, a, r = seeded(17), st = frame ? 5 : -5;
      c.fillStyle = "rgba(10,6,4,0.34)"; ell(c, cx + 3, cy + 3, 43, 27); c.fill();
      c.fillStyle = C.glaze;
      [[cx + 19 + st, cy - 22], [cx + 17 - st, cy + 22], [cx - 19 - st, cy - 21], [cx - 17 + st, cy + 21]].forEach(function (q) { ell(c, q[0], q[1], 5.5, 4.2); c.fill(); });
      fleece(c, cx - 35, cy, 7.5);
      c.fillStyle = C.fleece; c.strokeStyle = C.glaze; c.lineWidth = 2;
      for (i = 0; i < 20; i++) { a = i / 20 * TAU; circ(c, cx + Math.cos(a) * 31, cy + Math.sin(a) * 19.5, 7.5); c.fill(); c.stroke(); }
      ell(c, cx, cy, 31, 19.5); c.fill();
      c.strokeStyle = C.curl; c.lineWidth = 1.7;
      for (i = 0; i < 30; i++) {
        var x = cx + (r() - 0.5) * 60, y = cy + (r() - 0.5) * 38, a0 = r() * TAU, rr = 2.6 + r() * 2.2;
        if (((x - cx) / 29) * ((x - cx) / 29) + ((y - cy) / 18) * ((y - cy) / 18) > 0.95) continue;
        if (dist(x, y, cx + PLAQUE_DX, cy) < 19) continue;
        c.beginPath(); c.arc(x, y, rr, a0, a0 + 3.6); c.stroke();
      }
      /* the tag: a terracotta ring with a bone middle; the letter is a text drawn on top, always upright */
      c.fillStyle = C.terra; circ(c, cx + PLAQUE_DX, cy, 15.5); c.fill();
      c.strokeStyle = C.glaze; c.lineWidth = 1.5; c.stroke();
      c.fillStyle = C.bone; circ(c, cx + PLAQUE_DX, cy, 12.8); c.fill();
      var hx = cx + 34;
      c.fillStyle = "#cdb48e"; c.strokeStyle = C.glaze; c.lineWidth = 1.6;
      [-1, 1].forEach(function (sd) { ell(c, hx - 4, cy + sd * 11, 6, 2.8, sd * 0.7); c.fill(); c.stroke(); });
      c.fillStyle = "#dcc8a4"; c.lineWidth = 2; ell(c, hx + 2, cy, 13, 9.5); c.fill(); c.stroke();
      c.fillStyle = "#b8987a"; ell(c, hx + 11, cy, 4.2, 5.6); c.fill();
      c.fillStyle = C.glaze; circ(c, hx + 3, cy - 6.5, 1.7); c.fill(); circ(c, hx + 3, cy + 6.5, 1.7); c.fill();
      [-1, 1].forEach(function (sd) { horn(c, hx - 6, cy + sd * 14, sd); });
      fleece(c, hx - 8, cy, 6.5);
    };
  }
  /* Odysseus's hands and feet, gripping round the ram's sides: drawn UNDER the ram, so only the ends peek out */
  function drawUnder(c) {
    var cx = RAM_CX, cy = RAM_CY;
    [-1, 1].forEach(function (sd) {
      stroke2(c, [[cx + 2, cy + sd * 8], [cx + 17, cy + sd * 30]], 7.5, C.glaze, 4.8, C.skin);
      c.fillStyle = C.skin; c.strokeStyle = C.glaze; c.lineWidth = 1.6; circ(c, cx + 18, cy + sd * 31.5, 4.8); c.fill(); c.stroke();
      stroke2(c, [[cx - 6, cy + sd * 7], [cx - 23, cy + sd * 30]], 7.5, C.glaze, 4.8, C.skin);
      c.fillStyle = "#6a3a1c"; ell(c, cx - 24, cy + sd * 31.5, 6, 3.8); c.fill(); c.stroke();
    });
  }
  /* Odysseus from above, facing right: bronze helmet with a red crest, bone tunic, terracotta cloak; two strides */
  function drawOdy(frame) {
    return function (c) {
      var cx = ODY_S / 2, cy = ODY_S / 2, st = frame ? 6 : -6;
      c.fillStyle = "rgba(10,6,4,0.35)"; ell(c, cx + 1, cy + 2, 14, 12); c.fill();
      c.fillStyle = "#6a3a1c"; c.strokeStyle = C.glaze; c.lineWidth = 1.2;
      ell(c, cx + st, cy - 5, 4.8, 3.1); c.fill(); c.stroke();
      ell(c, cx - st, cy + 5, 4.8, 3.1); c.fill(); c.stroke();
      c.fillStyle = C.terra; c.lineWidth = 1.6;
      c.beginPath(); c.moveTo(cx + 2, cy - 12); c.quadraticCurveTo(cx - 16, cy - 13, cx - 15, cy); c.quadraticCurveTo(cx - 16, cy + 13, cx + 2, cy + 12); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = C.bone; ell(c, cx + 1, cy, 7.5, 11.5); c.fill(); c.stroke();
      c.fillStyle = C.skin; circ(c, cx + 2 - st * 0.5, cy - 12.5, 3.4); c.fill(); c.stroke(); circ(c, cx + 2 + st * 0.5, cy + 12.5, 3.4); c.fill(); c.stroke();
      c.fillStyle = "#c8902a"; circ(c, cx + 2, cy, 7.6); c.fill(); c.stroke();
      c.fillStyle = "rgba(255,230,150,0.65)"; circ(c, cx + 4, cy - 3, 2.4); c.fill();
      stroke2(c, [[cx - 8, cy], [cx + 10, cy]], 5.5, C.glaze, 3.2, "#c0341e");
    };
  }
  /* one of Polyphemus's huge pale hands from above, palm down, fingers to the right (shadow: the silhouette only) */
  function drawHand(shadow) {
    return function (c) {
      var px = PALM_X, py = PALM_Y, fingers = [[-0.3, 40], [-0.1, 46], [0.1, 44], [0.3, 36]];
      function tipOf(k) { var f = fingers[k], bx = px + 18, by = py + (k - 1.5) * 15; return [bx, by, bx + Math.cos(f[0]) * f[1], by + Math.sin(f[0]) * f[1]]; }
      function shape(col, grow) {
        c.strokeStyle = col; c.fillStyle = col; c.lineCap = "round";
        c.lineWidth = 36 + grow * 2; c.beginPath(); c.moveTo(6, py); c.lineTo(px - 8, py); c.stroke();
        ell(c, px, py, 30 + grow, 33 + grow); c.fill();
        for (var k = 0; k < 4; k++) { var t = tipOf(k); c.lineWidth = 15 + grow * 2; c.beginPath(); c.moveTo(t[0], t[1]); c.lineTo(t[2], t[3]); c.stroke(); }
        c.lineWidth = 16 + grow * 2; c.beginPath(); c.moveTo(px + 6, py - 18); c.lineTo(px + 6 + Math.cos(-0.95) * 30, py - 18 + Math.sin(-0.95) * 30); c.stroke();
      }
      if (shadow) { shape("#000000", 1); return; }
      shape(C.glaze, 2.6);
      shape(C.giant, 0);
      /* knuckles, nails and a little shading */
      c.fillStyle = "rgba(199,164,126,0.55)"; ell(c, px - 6, py + 6, 20, 24); c.fill();
      c.strokeStyle = C.giantDk; c.lineWidth = 2;
      for (var k = 0; k < 4; k++) {
        var t = tipOf(k), mx = t[0] + (t[2] - t[0]) * 0.45, my = t[1] + (t[3] - t[1]) * 0.45, ang = Math.atan2(t[3] - t[1], t[2] - t[0]);
        c.beginPath(); c.arc(t[0] - 2, t[1], 5, ang - 1.2, ang + 1.2); c.stroke();
        c.beginPath(); c.moveTo(mx + Math.sin(ang) * 4, my - Math.cos(ang) * 4); c.lineTo(mx - Math.sin(ang) * 4, my + Math.cos(ang) * 4); c.stroke();
        c.fillStyle = "#f7eddc"; c.strokeStyle = "rgba(20,12,10,0.6)"; c.lineWidth = 1.2;
        ell(c, t[2] - Math.cos(ang) * 4, t[3] - Math.sin(ang) * 4, 4.6, 3.6, ang); c.fill(); c.stroke();
        c.strokeStyle = C.giantDk; c.lineWidth = 2;
      }
      c.strokeStyle = "rgba(255,248,236,0.5)"; c.lineWidth = 3; c.beginPath(); c.arc(px - 2, py - 4, 22, -2.4, -1.2); c.stroke();
    };
  }
  /* Polyphemus seated, facing us: shaggy hair and beard, a sheepskin over his shoulders, a wine-dark tunic,
     and a bone-white cloth bound round his head over the single eye (closed, not shown) */
  function drawPoly(roar) {
    return function (c, w, h) {
      var hx = POLY_HX, hy = POLY_HY, i, x;
      c.lineJoin = "round"; c.lineCap = "round";
      c.fillStyle = C.hair;
      [[0, -52, 62], [-58, -24, 42], [58, -24, 42], [-68, 22, 34], [68, 22, 34], [-40, -70, 34], [40, -70, 34], [-74, 60, 24], [74, 60, 24]].forEach(function (q) { circ(c, hx + q[0], hy + q[1], q[2]); c.fill(); });
      c.fillStyle = C.wine; c.strokeStyle = C.glaze; c.lineWidth = 4;
      c.beginPath(); c.moveTo(6, h + 4); c.bezierCurveTo(-2, 300, 26, 238, 96, 218); c.lineTo(224, 218); c.bezierCurveTo(294, 238, 322, 300, w - 6, h + 4); c.closePath(); c.fill(); c.stroke();
      /* a terracotta band with a black-glaze key pattern, like the rim of a pot */
      c.fillStyle = C.terra; c.fillRect(10, h - 40, w - 20, 22);
      c.strokeStyle = C.glaze; c.lineWidth = 2.5;
      for (x = 16; x < w - 34; x += 22) { c.beginPath(); c.moveTo(x, h - 22); c.lineTo(x, h - 36); c.lineTo(x + 14, h - 36); c.lineTo(x + 14, h - 26); c.lineTo(x + 7, h - 26); c.lineTo(x + 7, h - 31); c.stroke(); }
      c.fillStyle = C.giant; c.strokeStyle = C.glaze; c.lineWidth = 3.5;
      c.beginPath(); c.moveTo(hx - 34, hy + 52); c.lineTo(hx - 38, hy + 116); c.lineTo(hx + 38, hy + 116); c.lineTo(hx + 34, hy + 52); c.closePath(); c.fill(); c.stroke();
      for (i = 0; i <= 12; i++) { var t = i / 12; fleece(c, 34 + t * 252, 230 - Math.sin(t * Math.PI) * 16 + (i % 2) * 5, 19); }
      c.fillStyle = C.giant; c.strokeStyle = C.glaze; c.lineWidth = 3;
      ell(c, hx - 64, hy + 8, 11, 18); c.fill(); c.stroke(); ell(c, hx + 64, hy + 8, 11, 18); c.fill(); c.stroke();
      ell(c, hx, hy, 62, 72); c.fill(); c.lineWidth = 4; c.stroke();
      c.fillStyle = "rgba(217,119,43,0.22)"; circ(c, hx - 36, hy + 24, 14); c.fill(); circ(c, hx + 36, hy + 24, 14); c.fill();
      c.fillStyle = "rgba(150,110,80,0.25)"; ell(c, hx + 30, hy + 4, 26, 52); c.fill();
      /* beard, with curls along its edge */
      c.fillStyle = C.hair;
      c.beginPath(); c.moveTo(hx - 60, hy + 4); c.quadraticCurveTo(hx - 66, hy + 70, hx - 30, hy + 104); c.quadraticCurveTo(hx, hy + 122, hx + 30, hy + 104);
      c.quadraticCurveTo(hx + 66, hy + 70, hx + 60, hy + 4); c.quadraticCurveTo(hx + 46, hy + 42, hx + 22, hy + 40); c.quadraticCurveTo(hx, hy + 32, hx - 22, hy + 40);
      c.quadraticCurveTo(hx - 46, hy + 42, hx - 60, hy + 4); c.closePath(); c.fill();
      for (i = 0; i < 7; i++) { circ(c, hx - 36 + i * 12, hy + 102 + (i % 2) * 6, 10); c.fill(); }
      if (roar) {
        c.fillStyle = C.wine; ell(c, hx, hy + 60, 22, 18); c.fill(); c.strokeStyle = C.glaze; c.lineWidth = 3; c.stroke();
        c.fillStyle = C.bone; c.fillRect(hx - 13, hy + 44, 26, 5); c.fillRect(hx - 10, hy + 72, 20, 4);
      } else {
        c.strokeStyle = "#6a2e1c"; c.lineWidth = 5; c.beginPath(); c.moveTo(hx - 16, hy + 60); c.quadraticCurveTo(hx, hy + 53, hx + 16, hy + 60); c.stroke();
      }
      c.strokeStyle = C.hair; c.lineWidth = 9; c.beginPath(); c.moveTo(hx - 32, hy + 52); c.quadraticCurveTo(hx - 12, hy + 38, hx, hy + 42); c.quadraticCurveTo(hx + 12, hy + 38, hx + 32, hy + 52); c.stroke();
      c.fillStyle = "#dcbf98"; c.strokeStyle = C.glaze; c.lineWidth = 3;
      c.beginPath(); c.moveTo(hx - 7, hy - 4); c.quadraticCurveTo(hx - 22, hy + 26, hx - 15, hy + 33); c.quadraticCurveTo(hx, hy + 40, hx + 15, hy + 33); c.quadraticCurveTo(hx + 22, hy + 26, hx + 7, hy - 4); c.fill(); c.stroke();
      c.fillStyle = "#5a2e1c"; ell(c, hx - 8, hy + 31, 4, 2.6); c.fill(); ell(c, hx + 8, hy + 31, 4, 2.6); c.fill();
      c.strokeStyle = C.hair; c.lineWidth = 10; c.beginPath(); c.moveTo(hx - 42, hy - 40); c.quadraticCurveTo(hx, hy - 62, hx + 42, hy - 40); c.stroke();
      /* the cloth over his one eye, wound round his head and knotted at the side */
      c.fillStyle = C.bone; c.strokeStyle = C.glaze; c.lineWidth = 3;
      c.beginPath(); c.moveTo(hx - 66, hy - 32); c.quadraticCurveTo(hx, hy - 48, hx + 66, hy - 32); c.lineTo(hx + 64, hy - 2); c.quadraticCurveTo(hx, hy - 18, hx - 64, hy - 2); c.closePath(); c.fill(); c.stroke();
      c.strokeStyle = C.terra; c.lineWidth = 2.5;
      c.beginPath(); c.moveTo(hx - 62, hy - 27); c.quadraticCurveTo(hx, hy - 42, hx + 62, hy - 27); c.stroke();
      c.beginPath(); c.moveTo(hx - 62, hy - 7); c.quadraticCurveTo(hx, hy - 22, hx + 62, hy - 7); c.stroke();
      c.strokeStyle = "rgba(20,12,10,0.28)"; c.lineWidth = 2;
      [-30, -6, 20].forEach(function (dx) { c.beginPath(); c.moveTo(hx + dx, hy - 36); c.quadraticCurveTo(hx + dx + 6, hy - 24, hx + dx, hy - 12); c.stroke(); });
      c.fillStyle = C.bone; c.strokeStyle = C.glaze; c.lineWidth = 2.5;
      c.beginPath(); c.moveTo(hx + 70, hy - 18); c.quadraticCurveTo(hx + 92, hy + 6, hx + 86, hy + 30); c.lineTo(hx + 78, hy + 28); c.quadraticCurveTo(hx + 80, hy + 8, hx + 66, hy - 10); c.closePath(); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(hx + 68, hy - 16); c.quadraticCurveTo(hx + 76, hy + 12, hx + 68, hy + 36); c.lineTo(hx + 61, hy + 32); c.quadraticCurveTo(hx + 66, hy + 12, hx + 62, hy - 8); c.closePath(); c.fill(); c.stroke();
      circ(c, hx + 68, hy - 17, 9); c.fill(); c.stroke();
      /* a folded pad over the one eye, tied on with the cloth: the eye is shut and covered */
      c.fillStyle = "#f7f0e0"; c.strokeStyle = C.glaze; c.lineWidth = 3;
      ell(c, hx, hy - 24, 24, 19); c.fill(); c.stroke();
      c.strokeStyle = C.terra; c.lineWidth = 2; c.setLineDash([4, 3]); ell(c, hx, hy - 24, 18, 13.5); c.stroke(); c.setLineDash([]);
      c.strokeStyle = "rgba(20,12,10,0.3)"; c.lineWidth = 2; c.beginPath(); c.moveTo(hx - 10, hy - 30); c.quadraticCurveTo(hx, hy - 24, hx + 10, hy - 30); c.stroke();
    };
  }
  /* the great stone Polyphemus rolled from the doorway */
  function drawStone(c, w, h) {
    var r = seeded(5), pts = [], n = 16, i;
    for (i = 0; i < n; i++) { var a = i / n * TAU, rr = 0.86 + r() * 0.14; pts.push([w / 2 + Math.cos(a) * w * 0.45 * rr, h / 2 + Math.sin(a) * h * 0.4 * rr]); }
    c.fillStyle = "rgba(20,12,10,0.35)"; ell(c, w / 2 + 8, h / 2 + 12, w * 0.45, h * 0.38); c.fill();
    var g = c.createRadialGradient(w * 0.36, h * 0.3, 8, w / 2, h / 2, w * 0.55);
    g.addColorStop(0, "#9a8c76"); g.addColorStop(0.6, "#665a4a"); g.addColorStop(1, "#3a3028");
    c.fillStyle = g; pathPts(c, pts); c.closePath(); c.fill();
    c.strokeStyle = C.glaze; c.lineWidth = 4; c.stroke();
    c.strokeStyle = "rgba(20,12,10,0.55)"; c.lineWidth = 2.5;
    [[0.3, 0.3, 0.45, 0.55, 0.4, 0.75], [0.62, 0.22, 0.7, 0.4, 0.82, 0.48], [0.5, 0.62, 0.62, 0.7, 0.64, 0.84]].forEach(function (q) {
      c.beginPath(); c.moveTo(q[0] * w, q[1] * h); c.lineTo(q[2] * w, q[3] * h); c.lineTo(q[4] * w, q[5] * h); c.stroke();
    });
    c.fillStyle = "rgba(110,140,70,0.45)";
    for (i = 0; i < 9; i++) { circ(c, w * (0.25 + r() * 0.5), h * (0.18 + r() * 0.2), 3 + r() * 4); c.fill(); }
  }
  function drawGlow(c, w, h) {
    var g = c.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w / 2);
    g.addColorStop(0, "rgba(255,190,110,0.6)"); g.addColorStop(0.4, "rgba(232,140,60,0.22)"); g.addColorStop(1, "rgba(217,119,43,0)");
    c.fillStyle = g; c.fillRect(0, 0, w, h);
  }
  /* dawn light falling in through the doorway: brightest at the door (right edge), fading into the cave */
  function drawLight(c, w, h) {
    var g = c.createLinearGradient(w, 0, 0, 0);
    g.addColorStop(0, "rgba(255,228,176,0.5)"); g.addColorStop(0.45, "rgba(255,214,150,0.16)"); g.addColorStop(1, "rgba(255,214,150,0)");
    c.fillStyle = g; c.beginPath(); c.moveTo(w, h * 0.3); c.lineTo(0, 0); c.lineTo(0, h); c.lineTo(w, h * 0.7); c.closePath(); c.fill();
  }
  function drawFlame(f) {
    return function (c, w, h) {
      var sway = [0, 5, -4][f], tall = [1, 0.88, 1.06][f];
      function tongue(col, s, dx, lean) {
        var bx = w / 2 + dx, by = h - 6, top = by - (h - 14) * tall * s;
        c.fillStyle = col; c.beginPath(); c.moveTo(bx - 15 * s, by);
        c.quadraticCurveTo(bx - 19 * s, by - (by - top) * 0.55, bx + (sway + lean) * s, top);
        c.quadraticCurveTo(bx + 18 * s, by - (by - top) * 0.45, bx + 15 * s, by); c.closePath(); c.fill();
      }
      tongue(C.terra, 0.62, -12, -6); tongue(C.terra, 0.6, 12, 6);
      tongue(C.terra, 1, 0, 0); tongue(C.ochre, 0.72, 1, 0); tongue("#fff1c8", 0.4, 1, 0);
    };
  }
  /* the cave, drawn once for the canvas size: rock, the floor in firelight and dawn light, the doorway,
     the dawn-lit hillside outside, the lambs' pen, the fire pit and the cheeses in the wall (Homer's cave) */
  function caveFloorPts(G) {
    var r = seeded(23), pts = [], x, y, s = 26;
    for (x = G.fx0 + 18; x < G.wallX0 - 8; x += s) pts.push([x, G.fy0 + (r() - 0.35) * 9]);
    pts.push([G.wallX0, G.fy0 + 10]);
    for (y = G.fy0 + 30; y < G.doorTop - 4; y += s) pts.push([G.wallX0 + (r() - 0.6) * 7, y]);
    pts.push([G.wallX0, G.doorTop]); pts.push([G.wallX1 + 4, G.doorTop]); pts.push([G.wallX1 + 4, G.doorBot]); pts.push([G.wallX0, G.doorBot]);
    for (y = G.doorBot + 26; y < G.fy1 - 18; y += s) pts.push([G.wallX0 + (r() - 0.6) * 7, y]);
    pts.push([G.wallX0 - 10, G.fy1]);
    for (x = G.wallX0 - 30; x > G.fx0 + 18; x -= s) pts.push([x, G.fy1 + (r() - 0.65) * 9]);
    pts.push([G.fx0, G.fy1 - 16]);
    for (y = G.fy1 - 40; y > G.fy0 + 18; y -= s) pts.push([G.fx0 + (r() - 0.35) * 9, y]);
    pts.push([G.fx0 + 4, G.fy0 + 6]);
    return pts;
  }
  function drawCave(G) {
    return function (c, w, h) {
      var r = seeded(91), i, k, x, y, a;
      c.fillStyle = "#1e140f"; c.fillRect(0, 0, w, h);
      for (i = 0; i < 240; i++) {
        x = r() * w; y = r() * h;
        c.fillStyle = i % 5 === 0 ? "rgba(217,119,43,0.10)" : i % 2 ? "rgba(74,51,38,0.5)" : "rgba(10,6,4,0.45)";
        ell(c, x, y, 12 + r() * 42, 6 + r() * 20, r() * 3); c.fill();
      }
      c.strokeStyle = "rgba(10,6,4,0.7)"; c.lineWidth = 2;
      for (i = 0; i < 46; i++) {
        x = r() * w; y = r() * h; c.beginPath(); c.moveTo(x, y);
        for (k = 0; k < 4; k++) { x += (r() - 0.5) * 44; y += (r() - 0.5) * 44; c.lineTo(x, y); }
        c.stroke();
      }
      /* outside: the hillside at dawn */
      var ox = G.wallX1, g = c.createLinearGradient(ox, 0, w, 0);
      g.addColorStop(0, "#9c7f50"); g.addColorStop(1, "#d2ba84");
      c.fillStyle = g; c.fillRect(ox, 0, w - ox, h);
      var g2 = c.createRadialGradient(w + 40, G.doorY - 60, 10, w + 40, G.doorY - 60, (w - ox) * 1.7);
      g2.addColorStop(0, "rgba(255,206,170,0.6)"); g2.addColorStop(1, "rgba(255,206,170,0)");
      c.fillStyle = g2; c.fillRect(ox, 0, w - ox, h);
      c.fillStyle = "rgba(112,84,52,0.5)"; ell(c, (ox + w) / 2 + 30, G.doorY, (w - ox) * 0.62, G.doorH * 0.34); c.fill();
      c.fillStyle = "rgba(70,50,30,0.35)";
      for (i = 0; i < 26; i++) { x = ox + 10 + r() * (w - ox); y = G.doorY + (r() - 0.5) * G.doorH * 0.5; ell(c, x, y, 2.4, 1.6); c.fill(); ell(c, x + 4, y + 1, 2.4, 1.6); c.fill(); }
      for (i = 0; i < 80; i++) {
        x = ox + 6 + r() * (w - ox); y = r() * h;
        if (Math.abs(y - G.doorY) < G.doorH * 0.42) continue;
        c.strokeStyle = i % 3 ? "rgba(96,112,52,0.75)" : "rgba(140,150,70,0.7)"; c.lineWidth = 1.6;
        for (k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(x + k * 2, y); c.lineTo(x + k * 3.5, y - 7 - r() * 4); c.stroke(); }
      }
      /* scrape marks where the stone was rolled aside */
      c.strokeStyle = "rgba(60,40,24,0.35)"; c.lineWidth = 3;
      for (k = 0; k < 3; k++) { c.beginPath(); c.moveTo(ox + 6, G.doorBot - 30 + k * 12); c.quadraticCurveTo(ox + (w - ox) * 0.3, G.doorBot + 20 + k * 10, G.stoneX - 30, G.stoneY - 20 + k * 10); c.stroke(); }
      /* the cave floor */
      var fp = caveFloorPts(G);
      c.fillStyle = "#4b3628"; pathPts(c, fp); c.closePath(); c.fill();
      c.save(); pathPts(c, fp); c.closePath(); c.clip();
      for (i = 0; i < 300; i++) {
        x = G.fx0 + r() * (G.wallX1 - G.fx0); y = G.fy0 + r() * (G.fy1 - G.fy0);
        c.fillStyle = i % 3 ? "rgba(30,20,14,0.35)" : "rgba(150,112,76,0.28)"; ell(c, x, y, 2 + r() * 6, 1.5 + r() * 3.5, r() * 3); c.fill();
      }
      c.strokeStyle = "rgba(232,176,74,0.26)"; c.lineWidth = 1.4;
      for (i = 0; i < 200; i++) {
        x = G.fx0 + r() * (G.wallX0 - G.fx0); y = G.fy0 + r() * (G.fy1 - G.fy0); a = r() * Math.PI;
        c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * 10, y + Math.sin(a) * 10); c.stroke();
      }
      var gf = c.createRadialGradient(G.fire.x, G.fire.y, 10, G.fire.x, G.fire.y, Math.max(w, h) * 0.5);
      gf.addColorStop(0, "rgba(232,140,60,0.42)"); gf.addColorStop(0.5, "rgba(217,119,43,0.12)"); gf.addColorStop(1, "rgba(217,119,43,0)");
      c.fillStyle = gf; c.fillRect(0, 0, w, h);
      var gd = c.createRadialGradient(G.wallX1, G.doorY, 10, G.wallX1, G.doorY, G.caveW * 0.62);
      gd.addColorStop(0, "rgba(255,226,180,0.42)"); gd.addColorStop(1, "rgba(255,226,180,0)");
      c.fillStyle = gd; c.fillRect(0, 0, w, h);
      var gb = c.createLinearGradient(G.fx0, 0, G.fx0 + G.caveW * 0.42, 0);
      gb.addColorStop(0, "rgba(6,4,3,0.36)"); gb.addColorStop(1, "rgba(6,4,3,0)");
      c.fillStyle = gb; c.fillRect(0, 0, w, h);
      c.restore();
      c.strokeStyle = C.glaze; c.lineWidth = 5; pathPts(c, fp); c.closePath(); c.stroke();
      c.strokeStyle = "rgba(217,119,43,0.3)"; c.lineWidth = 2; pathPts(c, fp); c.closePath(); c.stroke();
      /* the door jambs: boulders at the ends of the wall, and a worn sill on the threshold */
      [G.doorTop, G.doorBot].forEach(function (yy, j) {
        for (k = 0; k < 3; k++) {
          var bx = G.wallX0 + 6 + k * (G.T / 2.4), by = yy + (j ? 6 : -6) + (k % 2 ? 3 : -2);
          c.fillStyle = k % 2 ? "#5a4636" : "#4a3a2e"; ell(c, bx, by, 11, 9, k); c.fill(); c.strokeStyle = C.glaze; c.lineWidth = 2.5; c.stroke();
        }
      });
      c.strokeStyle = "rgba(20,12,10,0.32)"; c.lineWidth = 3; c.setLineDash([9, 7]);
      c.beginPath(); c.moveTo(G.thrX, G.doorTop + 8); c.lineTo(G.thrX, G.doorBot - 8); c.stroke(); c.setLineDash([]);
      /* the pen for the lambs, a wicker fence in a corner (Homer: pens crowded with lambs and kids) */
      var P = G.pen;
      c.fillStyle = "rgba(232,176,74,0.16)"; c.fillRect(P.x0, P.y0, P.x1 - P.x0, P.y1 - P.y0);
      c.strokeStyle = "rgba(232,176,74,0.3)"; c.lineWidth = 1.4;
      for (i = 0; i < 60; i++) { x = P.x0 + r() * (P.x1 - P.x0); y = P.y0 + r() * (P.y1 - P.y0); a = r() * Math.PI; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * 9, y + Math.sin(a) * 9); c.stroke(); }
      [[P.x0 + (P.x1 - P.x0) * 0.32, P.y0 + (P.y1 - P.y0) * 0.45], [P.x0 + (P.x1 - P.x0) * 0.62, P.y0 + (P.y1 - P.y0) * 0.66], [P.x0 + (P.x1 - P.x0) * 0.4, P.y0 + (P.y1 - P.y0) * 0.78]].forEach(function (q, j) {
        c.fillStyle = "rgba(10,6,4,0.3)"; ell(c, q[0] + 2, q[1] + 3, 15, 11); c.fill();
        fleece(c, q[0], q[1], 11);
        c.fillStyle = "#dcc8a4"; c.strokeStyle = C.glaze; c.lineWidth = 1.5; ell(c, q[0] + (j % 2 ? -13 : 13), q[1] - 2, 6, 4.6); c.fill(); c.stroke();
      });
      function wicker(x0, y0, x1, y1) {
        var len = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0)), n = Math.max(2, Math.round(len / 20)), j;
        c.strokeStyle = C.glaze; c.lineWidth = 7; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
        c.strokeStyle = "#b8873e"; c.lineWidth = 4.5; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
        c.strokeStyle = "rgba(20,12,10,0.55)"; c.lineWidth = 1.2;
        for (j = 0; j < n * 2; j++) { var u = j / (n * 2), px = x0 + (x1 - x0) * u, py = y0 + (y1 - y0) * u; c.beginPath(); c.moveTo(px - 2, py - 2); c.lineTo(px + 2, py + 2); c.stroke(); }
        c.fillStyle = "#8a5a2a"; c.strokeStyle = C.glaze; c.lineWidth = 2;
        for (j = 0; j <= n; j++) { circ(c, x0 + (x1 - x0) * j / n, y0 + (y1 - y0) * j / n, 4.5); c.fill(); c.stroke(); }
      }
      wicker(P.x0 + 4, P.y0, P.x1, P.y0); wicker(P.x1, P.y0, P.x1, P.y1 - 4);
      /* the fire pit */
      var F = G.fire;
      c.fillStyle = "#2a1a12"; circ(c, F.x, F.y, F.r - 4); c.fill();
      c.fillStyle = "rgba(217,119,43,0.85)";
      for (i = 0; i < 14; i++) { a = r() * TAU; k = r() * (F.r - 10); circ(c, F.x + Math.cos(a) * k, F.y + Math.sin(a) * k, 1.6 + r() * 2); c.fill(); }
      for (i = 0; i < 10; i++) {
        a = i / 10 * TAU; c.fillStyle = i % 2 ? "#6d655c" : "#5a534c"; c.strokeStyle = C.glaze; c.lineWidth = 2;
        ell(c, F.x + Math.cos(a) * F.r, F.y + Math.sin(a) * F.r, 9, 7, a); c.fill(); c.stroke();
      }
      /* cheeses in niches of the left-hand wall */
      for (y = G.fy0 + 50; y < P.y0 - 50; y += 74) {
        c.fillStyle = "rgba(6,4,3,0.75)"; ell(c, G.fx0 * 0.52, y, G.fx0 * 0.4, 26); c.fill();
        for (k = 0; k < 2; k++) {
          var cy2 = y - 9 + k * 18;
          c.fillStyle = k ? "#e8c27a" : "#efe0b8"; c.strokeStyle = C.glaze; c.lineWidth = 1.5; ell(c, G.fx0 * 0.52, cy2, G.fx0 * 0.3, 7.5); c.fill(); c.stroke();
          c.strokeStyle = "rgba(160,110,50,0.7)"; c.lineWidth = 1; c.beginPath(); c.moveTo(G.fx0 * 0.3, cy2); c.lineTo(G.fx0 * 0.74, cy2); c.stroke();
        }
      }
      /* wicker crates of cheese and pails of whey along the bottom wall */
      [0.5, 0.59].forEach(function (u, j) {
        var bx = G.fx0 + G.caveW * u, by = G.fy1 + (h - G.fy1) * 0.52;
        c.fillStyle = "#8a5a2a"; c.strokeStyle = C.glaze; c.lineWidth = 2.5; c.fillRect(bx - 26, by - 14, 52, 28); c.strokeRect(bx - 26, by - 14, 52, 28);
        c.strokeStyle = "rgba(232,176,74,0.55)"; c.lineWidth = 1.3;
        for (k = 1; k < 5; k++) { c.beginPath(); c.moveTo(bx - 26, by - 14 + k * 5.6); c.lineTo(bx + 26, by - 14 + k * 5.6); c.stroke(); }
        for (k = 0; k < 3; k++) { c.fillStyle = (k + j) % 2 ? "#e8c27a" : "#efe0b8"; c.strokeStyle = C.glaze; c.lineWidth = 1.5; circ(c, bx - 15 + k * 15, by - 2, 7); c.fill(); c.stroke(); }
      });
      [0.68, 0.73].forEach(function (u) {
        var bx = G.fx0 + G.caveW * u, by = G.fy1 + (h - G.fy1) * 0.5;
        c.fillStyle = "#6a4a2a"; c.strokeStyle = C.glaze; c.lineWidth = 2.5; circ(c, bx, by, 13); c.fill(); c.stroke();
        c.fillStyle = "#f2ead8"; circ(c, bx, by, 9); c.fill();
      });
    };
  }
  function ensureRamArt(scene) {
    canvasTex(scene, "md-ram-ram-0", RAM_W, RAM_H, drawRam(0));
    canvasTex(scene, "md-ram-ram-1", RAM_W, RAM_H, drawRam(1));
    canvasTex(scene, "md-ram-under", RAM_W, RAM_H, drawUnder);
    canvasTex(scene, "md-ram-ody-0", ODY_S, ODY_S, drawOdy(0));
    canvasTex(scene, "md-ram-ody-1", ODY_S, ODY_S, drawOdy(1));
    canvasTex(scene, "md-ram-hand", HAND_W, HAND_H, drawHand(false));
    canvasTex(scene, "md-ram-hshadow", HAND_W, HAND_H, drawHand(true));
    canvasTex(scene, "md-ram-poly-0", POLY_W, POLY_H, drawPoly(false));
    canvasTex(scene, "md-ram-poly-1", POLY_W, POLY_H, drawPoly(true));
    canvasTex(scene, "md-ram-stone", 200, 160, drawStone);
    canvasTex(scene, "md-ram-glow", 256, 256, drawGlow);
    canvasTex(scene, "md-ram-light", 420, 300, drawLight);
    for (var i = 0; i < 3; i++) canvasTex(scene, "md-ram-flame-" + i, 56, 72, drawFlame(i));
  }

  /* sounds: the realm kit's quiet WebAudio blips */
  function rsnd(name) {
    var S = window.SolRealms;
    if (!S || !S.blip) return;
    try {
      if (name === "bleat") { S.blip(640, 520, 0.12, "triangle", 0.012); S.blip(560, 470, 0.2, "triangle", 0.01, 0.13); }
      else if (name === "roar") { if (S.hiss) S.hiss(0.9, 260, 0.07); S.blip(120, 62, 0.9, "sawtooth", 0.045); }
      else if (name === "cling") S.blip(330, 460, 0.1, "sine", 0.03);
      else if (name === "letgo") S.blip(460, 300, 0.1, "sine", 0.025);
      else if (name === "pat") { if (S.hiss) S.hiss(0.1, 700, 0.025); }
      else if (name === "grab") { S.blip(220, 90, 0.3, "square", 0.035); if (S.hiss) S.hiss(0.2, 500, 0.05); }
      else if (name === "thud") { if (S.hiss) S.hiss(0.18, 300, 0.05); }
    } catch (e) {}
  }

  M.extend("ram", DEF, {
    ramParams: function (n) { return ramParams(n); },

    setup_ram: function () {
      ensureRamArt(this);
      var P = this.ramParams(this.night), self = this, i;
      var R = this.ram = { P: P, rams: [], hands: [], dead: [], order: [], t: 0, relCd: 2600, gropeCd: 2800, underCd: P.underEvery * 0.6, sweepPh: 0, rageMs: 0,
        roar: { state: "calm", t: 0, cd: P.roarEvery * 0.6 }, prevFire: false, lastFrame: -9, flameMs: 0, flame: 0, told: {}, youMs: 0, hold: false,
        hudTxt: "", inCave: 0, bleatMs: 0, armPts: [] };
      for (i = 0; i <= 14; i++) R.armPts.push({ x: 0, y: 0 });
      this.cameras.main.setBackgroundColor("#120b08");
      R.light = this.add.image(0, 0, "md-ram-light").setOrigin(1, 0.5).setDepth(2);
      R.glow = this.add.image(0, 0, "md-ram-glow").setDepth(2);
      try { R.light.setBlendMode(Phaser.BlendModes.ADD); R.glow.setBlendMode(Phaser.BlendModes.ADD); } catch (eB) {}
      R.flameSpr = this.add.image(0, 0, "md-ram-flame-0").setOrigin(0.5, 0.92).setDepth(4);
      R.stone = this.add.image(0, 0, "md-ram-stone").setDepth(6);
      R.poly = this.add.image(0, 0, "md-ram-poly-0").setOrigin(POLY_HX / POLY_W, 1).setDepth(15);
      R.lowG = this.add.graphics().setDepth(5);
      R.topG = this.add.graphics().setDepth(13);
      R.armG = this.add.graphics().setDepth(18);
      for (i = 0; i < 2; i++) {
        R.hands.push({ i: i, x: 0, y: 0, ex: 0, ey: 0, rot: Math.PI, mode: "sweep", phase: "", t: 0, low: true, tx: 0, ty: 0, ram: null, warn: 0, again: false, caught: false, feeling: null,
          spr: this.add.image(0, 0, "md-ram-hand").setOrigin(PALM_X / HAND_W, PALM_Y / HAND_H).setDepth(19).setFlipY(i === 1),
          sh: this.add.image(0, 0, "md-ram-hshadow").setOrigin(PALM_X / HAND_W, PALM_Y / HAND_H).setDepth(12).setAlpha(0.25).setFlipY(i === 1),
          mark: this.add.text(0, 0, "!", { fontFamily: SERIF, fontSize: 34, color: "#ff8a5a", fontStyle: "bold", stroke: C.glaze, strokeThickness: 6 }).setOrigin(0.5, 1).setDepth(22).setVisible(false) });
      }
      R.ody = { x: 0, y: 0, rot: 0, state: "foot", ram: null, walk: 0, t: 0, fx: 0, fy: 0, tx: 0, ty: 0, sx: 0, sy: 0, dur: 800, moved: false,
        spr: this.add.image(0, 0, "md-ram-ody-0").setDepth(14),
        halo: this.add.image(0, 0, "md-ram-glow").setDepth(3).setScale(0.42).setAlpha(0.55),
        under: this.add.image(0, 0, "md-ram-under").setOrigin(RAM_CX / RAM_W, RAM_CY / RAM_H).setDepth(9).setVisible(false) };
      try { R.ody.halo.setBlendMode(Phaser.BlendModes.ADD); } catch (eH) {}
      R.you = this.add.text(0, 0, "YOU\n▼", { fontFamily: SERIF, fontSize: 15, color: C.ochre, fontStyle: "bold", stroke: C.glaze, strokeThickness: 4, align: "center" }).setOrigin(0.5, 1).setDepth(22).setVisible(false);
      R.hud = this.add.text(12, 8, "", { fontFamily: SERIF, fontSize: 16, color: C.bone, fontStyle: "bold", stroke: C.glaze, strokeThickness: 4, lineSpacing: 3 }).setDepth(25);
      R.say = this.add.text(0, 0, "", { fontFamily: SERIF, fontSize: 22, color: C.bone, fontStyle: "bold", stroke: C.glaze, strokeThickness: 5, align: "center" }).setOrigin(0.5).setDepth(23).setVisible(false);
      this.ramLayout();
      R.ody.x = R.start.x; R.ody.y = R.start.y;
      R.hands.forEach(function (h) { var q = self.ramSweepPt(h); h.x = q.x; h.y = q.y; });
      this.makeSol(R.ody.x, R.ody.y, "right").setVisible(false);   /* the coin pop-ups follow this sprite */
    },

    /* the cave's shape for the canvas size; redraws the background */
    ramLayout: function () {
      var R = this.ram, W = this.W, H = this.H, P = R.P;
      R.T = clamp(Math.round(Math.min(W, H) * 0.055), 30, 50);
      R.topT = Math.max(R.T, 58);
      R.outW = clamp(Math.round(W * 0.21), 160, 250);
      R.wallX1 = W - R.outW; R.wallX0 = R.wallX1 - R.T;
      R.doorH = clamp(Math.round(H * 0.25), 140, 200);
      R.doorY = Math.round(clamp(H * 0.56, R.topT + R.doorH / 2 + 140, H - R.T - R.doorH / 2 - 40));
      R.doorTop = R.doorY - R.doorH / 2; R.doorBot = R.doorY + R.doorH / 2;
      R.thrX = R.wallX0 + R.T * 0.5;
      R.fx0 = R.T; R.fx1 = R.wallX0; R.fy0 = R.topT; R.fy1 = H - R.T;
      R.caveW = R.fx1 - R.fx0; R.caveH = R.fy1 - R.fy0;
      var pw = clamp(Math.round(W * 0.17), 130, 190), ph = clamp(Math.round(H * 0.23), 120, 180);
      R.pen = { x0: R.fx0, y0: R.fy1 - ph, x1: R.fx0 + pw, y1: R.fy1 };
      R.fire = { x: R.fx0 + R.caveW * 0.34, y: R.fy0 + R.caveH * 0.26, r: 30 };
      R.doorC = { x: R.wallX0, y: R.doorY };
      R.reachR = P.reach * R.caveW;
      R.start = { x: R.fx0 + 48, y: clamp(R.fy0 + R.caveH * 0.5, R.fy0 + 40, R.pen.y0 - 40) };
      R.HS = clamp(H / 768, 0.82, 1.05);
      R.PS = clamp(Math.min((R.doorTop - 6) / POLY_H, R.outW * 1.45 / POLY_W), 0.5, 1);
      R.polyX = R.wallX1 + R.outW * 0.52; R.polyY = R.doorTop - 2;
      R.poly.setPosition(R.polyX, R.polyY).setScale(R.PS);
      R.sh = POLY_SH.map(function (q) { return { x: R.polyX + (q[0] - POLY_HX) * R.PS, y: R.polyY + (q[1] - POLY_H) * R.PS }; });
      R.stoneX = R.wallX1 + R.outW * 0.5; R.stoneY = Math.min(H - 70, R.doorBot + (H - R.doorBot) * 0.5);
      R.stone.setPosition(R.stoneX, R.stoneY).setScale(clamp(R.outW / 210, 0.6, 1));
      R.light.setPosition(R.wallX1, R.doorY).setScale(1, R.doorH * 1.7 / 300);
      R.glow.setPosition(R.fire.x, R.fire.y).setScale(1.3);
      R.flameSpr.setPosition(R.fire.x, R.fire.y + 10);
      R.say.setPosition(R.wallX0 - 150, R.fy0 + 34);
      if (R.bg) { R.bg.destroy(); R.bg = null; }
      if (this.textures.exists("md-ram-cave")) this.textures.remove("md-ram-cave");
      canvasTex(this, "md-ram-cave", W, H, drawCave(R));
      R.bg = this.add.image(0, 0, "md-ram-cave").setOrigin(0, 0).setDepth(0);
    },
    resize_ram: function (oldW, oldH) {
      var R = this.ram, fx = this.W / (oldW || this.W), fy = this.H / (oldH || this.H);
      this.ramLayout();
      R.rams.forEach(function (r) { r.x *= fx; r.y *= fy; r.tx *= fx; r.ty *= fy; });
      R.hands.forEach(function (h) { h.x *= fx; h.y *= fy; h.tx *= fx; h.ty *= fy; });
      var o = R.ody; o.x *= fx; o.y *= fy; o.tx *= fx; o.ty *= fy;
      if (o.state === "foot") this.ramCollide(o, ODY_R, false);
    },

    /* a new question: a new flock, Odysseus back at the back of the cave, the hands at the door */
    answers_ram: function () {
      var R = this.ram, P = R.P, self = this;
      R.dead = [];
      this.ramFlock(false);
      var o = R.ody;
      o.state = "foot"; o.ram = null; o.x = R.start.x; o.y = R.start.y; o.rot = 0;
      o.spr.setVisible(true).setAlpha(1).setScale(1).setRotation(0); o.under.setVisible(false);
      R.hands.forEach(function (h) { self.ramHandReset(h); });
      R.relCd = 2600; R.gropeCd = 2800; R.underCd = Math.max(3200, P.underEvery * 0.5);
      R.roar.state = "calm"; R.roar.t = 0; R.roar.cd = P.roarEvery * rnd(0.5, 0.8);
      R.poly.setTexture("md-ram-poly-0"); R.say.setVisible(false);
      R.youMs = 4000;
      this.ramActLabel();
    },
    /* a flock in the cave: every live letter on two or more rams, released in rounds (one ram of each
       letter per round) so a letter only runs out at the very end of the flock */
    ramFlock: function (again) {
      var R = this.ram, P = R.P, self = this, i;
      R.rams.forEach(function (r) { self.ramKill(r); });
      R.rams = [];
      var letters = this.choiceLetters();
      var live = letters.filter(function (L) { return R.dead.indexOf(L) === -1 && self.extracted.indexOf(L) === -1; });
      var other = letters.filter(function (L) { return live.indexOf(L) === -1; });
      var n = Math.max(P.rams, Math.min(12, live.length * 2 + other.length)), list = [];
      other.forEach(function (L) { if (n - list.length > live.length * 2) list.push({ L: L, copy: 0 }); });
      var liveSh = shuffle(live.slice()), count = {}, k = 0;
      while (list.length < n && liveSh.length) { var L2 = liveSh[k % liveSh.length]; count[L2] = (count[L2] || 0); list.push({ L: L2, copy: count[L2]++ }); k++; }
      shuffle(list);
      list.forEach(function (it) {
        var spot = self.ramSpawnSpot();
        var r = self.ramMake(it.L, spot.x, spot.y);
        r.copy = it.copy; r.a = again ? 0 : 1;
        R.rams.push(r);
      });
      R.order = R.rams.slice().sort(function (a, b) { return a.copy - b.copy || Math.random() - 0.5; });
      var big = R.order[R.order.length - 1];
      if (big) { big.big = true; big.sc = RAM_SC * 1.12; big.spr.setScale(big.sc); }   /* the great ram goes out last, as in Homer */
      R.inCave = R.rams.length;
      R.relCd = again ? 2400 : 2600;
      for (i = 0; i < R.rams.length; i++) this.ramPlace(R.rams[i]);
      if (again) this.toast("A new flock comes out of the dark at the back of the cave. Ride out before the last ram goes!", 3600);
    },
    ramSpawnSpot: function () {
      var R = this.ram, best = null, bestD = -1, t, x, y;
      for (t = 0; t < 24; t++) {
        x = rnd(R.fx0 + 50, R.fx0 + R.caveW * 0.68); y = rnd(R.fy0 + 40, R.fy1 - 40);
        if (this.ramBlocked(x, y, 40)) continue;
        var d = 1e9;
        R.rams.forEach(function (q) { d = Math.min(d, dist(x, y, q.x, q.y)); });
        d = Math.min(d, dist(x, y, R.start.x, R.start.y) + 30);
        if (d > bestD) { bestD = d; best = { x: x, y: y }; }
        if (d > 90) break;
      }
      return best || { x: R.fx0 + R.caveW * 0.4, y: R.doorY };
    },
    ramMake: function (L, x, y) {
      var R = this.ram;
      var r = { letter: L, x: x, y: y, vx: 0, vy: 0, h: rnd(-Math.PI, Math.PI), state: "graze", tx: x, ty: y, pause: rnd(200, 1800), held: 0, scat: 0, svx: 0, svy: 0,
        a: 1, walk: rnd(0, 20), frame: 0, ph: rnd(0, 6), lane: rnd(-1, 1), crossed: false, mark: "", big: false, sc: RAM_SC, copy: 0, patted: false };
      r.spr = this.add.image(x, y, "md-ram-ram-0").setOrigin(RAM_CX / RAM_W, RAM_CY / RAM_H).setDepth(10).setScale(RAM_SC);
      r.txt = this.add.text(x, y, L, { fontFamily: SERIF, fontSize: 21, color: C.glaze, fontStyle: "bold" }).setOrigin(0.5).setDepth(20);   /* above the hands: a letter is never hidden */
      if (R.dead.indexOf(L) !== -1) this.ramPaint(r, "wrong");
      else if (this.extracted.indexOf(L) !== -1) this.ramPaint(r, "right");
      this.ramGrazeTarget(r);
      return r;
    },
    ramKill: function (r) {
      try { r.spr.destroy(); } catch (e) {}
      try { r.txt.destroy(); } catch (e2) {}
      r.state = "gone";
    },
    ramPaint: function (r, state) {
      r.mark = state;
      r.spr.setTint(state === "wrong" ? 0x8c867c : 0xcdeccf);
      r.txt.setText(state === "wrong" ? "✕" : "✓").setColor(state === "wrong" ? "#6a6258" : "#1f6a3a");
    },
    /* every ram (still about) with letter L: crossed out, or found */
    ramMark: function (L, state) {
      var self = this;
      this.ram.rams.forEach(function (r) { if (r.letter === L && r.state !== "gone") self.ramPaint(r, state); });
    },
    ramPlace: function (r) {
      r.spr.setPosition(r.x, r.y).setRotation(r.h).setAlpha(r.a);
      r.txt.setPosition(r.x + Math.cos(r.h) * PLAQUE_DX * r.sc, r.y + Math.sin(r.h) * PLAQUE_DX * r.sc).setAlpha(r.a);
    },
    ramBlocked: function (x, y, m) {
      var R = this.ram, p = R.pen;
      if (x > p.x0 - m && x < p.x1 + m && y > p.y0 - m && y < p.y1 + m) return true;
      return dist(x, y, R.fire.x, R.fire.y) < R.fire.r + m;
    },
    ramGrazeTarget: function (r) {
      var R = this.ram, share = R.rams.length ? 1 - R.inCave / R.rams.length : 0, gz = R.fx0 + R.caveW * (0.6 + 0.18 * share), t;
      for (t = 0; t < 12; t++) {
        var x = rnd(R.fx0 + 40, gz), y = rnd(R.fy0 + 36, R.fy1 - 36);
        if (this.ramBlocked(x, y, 34)) continue;
        r.tx = x; r.ty = y; return;
      }
      r.tx = R.fx0 + R.caveW * 0.45; r.ty = R.doorY;
    },
    /* keep a ram or Odysseus on the cave floor, out of the pen and the fire */
    ramCollide: function (o, rad) {
      var R = this.ram, p = R.pen;
      o.x = clamp(o.x, R.fx0 + rad, R.wallX0 - rad * 0.7);
      o.y = clamp(o.y, R.fy0 + rad, R.fy1 - rad);
      if (o.x < p.x1 + rad && o.y > p.y0 - rad) { if (p.x1 + rad - o.x < o.y - (p.y0 - rad)) o.x = p.x1 + rad; else o.y = p.y0 - rad; }
      var d = dist(o.x, o.y, R.fire.x, R.fire.y), m = R.fire.r + rad;
      if (d < m) { if (d < 0.01) o.x += m; else { o.x = R.fire.x + (o.x - R.fire.x) / d * m; o.y = R.fire.y + (o.y - R.fire.y) / d * m; } }
    },
    ramBackSpot: function () {
      var R = this.ram;
      for (var t = 0; t < 16; t++) {
        var x = rnd(R.fx0 + 34, R.fx0 + R.caveW * 0.3), y = rnd(R.fy0 + 34, R.fy1 - 34);
        if (!this.ramBlocked(x, y, 30)) return { x: x, y: y };
      }
      return { x: R.start.x, y: R.start.y };
    },
    ramDoorDist: function (x, y) { return dist(x, y, this.ram.doorC.x, this.ram.doorC.y); },
    ramClampReach: function (x, y) {
      var R = this.ram, dx = x - R.doorC.x, dy = y - R.doorC.y, d = Math.sqrt(dx * dx + dy * dy);
      if (d > R.reachR) { x = R.doorC.x + dx / d * R.reachR; y = R.doorC.y + dy / d * R.reachR; }
      return { x: clamp(x, R.fx0 + 30, R.wallX0 - 22), y: clamp(y, R.fy0 + 26, R.fy1 - 26) };
    },
    /* a toast once per level (or, with `again`, at most every few seconds) */
    ramTell: function (key, msg, ms, again) {
      var R = this.ram, now = this.time.now;
      if (again ? now - (R.told[key] || -1e9) < 4000 : R.told[key]) return;
      R.told[key] = now || 1;
      this.toast(msg, ms || 3200);
    },
    ramActLabel: function () {
      try {
        var act = document.getElementById("btn-action"), want = this.ram.ody.state === "cling" ? "LET GO" : (this.mode.act || "CLING");
        if (act && act.textContent !== want) act.textContent = want;
      } catch (e) {}
    },
    ramBleat: function () {
      var R = this.ram;
      if (R.bleatMs > 0) return;
      R.bleatMs = 1400; rsnd("bleat");
    },

    tick_ram: function (s, inp, ms) {
      var R = this.ram, frame = (this.game && this.game.loop && this.game.loop.frame) || 0;
      /* the action key acts on a fresh press; the first frame after a pause (the reading card) never counts */
      var fire = !!inp.fire, edge = fire && !R.prevFire && R.lastFrame === frame - 1;
      R.prevFire = fire; R.lastFrame = frame;
      R.t += s;
      if (R.bleatMs > 0) R.bleatMs -= ms;
      var rams = R.rams;
      this.ramTickRams(s, ms);
      if (this._finishing) return;
      this.ramTickOdy(s, ms, inp, edge && R.rams === rams);
      this.ramTickRoar(s, ms);
      this.ramTickHands(s, ms);
      if (this._finishing) return;
      this.ramDraw(s, ms);
    },

    /* ── the flock ── */
    ramTickRams: function (s, ms) {
      var R = this.ram, P = R.P, rams = R.rams, n = rams.length, i, j;
      if (!R.hold && !this._between) {
        R.relCd -= ms;
        if (R.relCd <= 0) {
          while (R.order.length && R.order[0].state !== "graze") R.order.shift();
          var nx = R.order.shift();
          if (nx) { nx.state = "go"; nx.pause = 0; if (Math.random() < 0.5) this.ramBleat(); }
          R.relCd = P.releaseMs * rnd(0.85, 1.15);
        }
      }
      var kk = 1 - Math.exp(-6 * s), inCave = 0;
      for (i = 0; i < n; i++) {
        var r = rams[i];
        if (r.state === "gone") continue;
        if (r.a < 1) r.a = Math.min(1, r.a + s * 1.5);
        var dvx = 0, dvy = 0, sp, dx, dy, d;
        if (r.held > 0) r.held -= ms;
        else if (r.scat > 0) { r.scat -= ms; dvx = r.svx; dvy = r.svy; }
        else if (r.state === "graze") {
          if (r.pause > 0) r.pause -= ms;
          else {
            dx = r.tx - r.x; dy = r.ty - r.y; d = Math.sqrt(dx * dx + dy * dy);
            if (d < 14) { r.pause = rnd(500, 2400); if (Math.random() < 0.15) this.ramBleat(); this.ramGrazeTarget(r); }
            else { sp = P.grazeSp * (r.big ? 0.9 : 1) * Math.min(1, d / 30 + 0.4); dvx = dx / d * sp; dvy = dy / d * sp; }
          }
        } else if (r.state === "go") {
          var gx = R.wallX0 - 58, gy = R.doorY + r.lane * R.doorH * 0.22;
          dx = gx - r.x; dy = gy - r.y; d = Math.sqrt(dx * dx + dy * dy) || 1;
          sp = P.walkSp * (r.big ? 0.92 : 1);
          var wob = Math.sin(R.t * 2.4 + r.ph) * sp * 0.3;
          dvx = dx / d * sp - dy / d * wob; dvy = dy / d * sp + dx / d * wob;
          if (r.x > R.wallX0 - 80 && Math.abs(r.y - gy) < R.doorH * 0.3) r.state = "exit";
        } else if (r.state === "exit") {
          var ex = r.x < R.wallX1 + 20 ? R.wallX1 + 80 : this.W + 140, ey = R.doorY + r.lane * R.doorH * 0.16;
          dx = ex - r.x; dy = ey - r.y; d = Math.sqrt(dx * dx + dy * dy) || 1;
          sp = P.walkSp * 1.15; dvx = dx / d * sp; dvy = dy / d * sp;
        }
        /* they keep apart in the cave (and so queue up in a loose line at the door) */
        if (r.state !== "exit" && r.held <= 0) {
          for (j = 0; j < n; j++) {
            var q = rams[j];
            if (q === r || q.state === "gone" || q.state === "exit") continue;
            var sx = r.x - q.x, sy = r.y - q.y, sd = sx * sx + sy * sy;
            if (sd < RAM_SEP * RAM_SEP && sd > 0.01) { var sdd = Math.sqrt(sd), push = (RAM_SEP - sdd) * (q.state === r.state ? 4 : 6); dvx += sx / sdd * push; dvy += sy / sdd * push; }
          }
        }
        if (r.held > 0) { r.vx *= 0.5; r.vy *= 0.5; }
        else { r.vx += (dvx - r.vx) * kk; r.vy += (dvy - r.vy) * kk; }
        var bx = r.x, by = r.y;
        r.x += r.vx * s; r.y += r.vy * s;
        if (r.state === "exit") { if (r.x > R.wallX0 - 6 && r.x < R.wallX1 + 6) r.y = clamp(r.y, R.doorTop + RAM_R * 0.8, R.doorBot - RAM_R * 0.8); }
        else {
          var px = r.x, py = r.y;
          this.ramCollide(r, RAM_R * 0.85);
          if (r.scat > 0) { if (Math.abs(r.x - px) > 0.5) r.svx = -r.svx; if (Math.abs(r.y - py) > 0.5) r.svy = -r.svy; }
        }
        var mx = (r.x - bx) / Math.max(s, 0.001), my = (r.y - by) / Math.max(s, 0.001), spd = Math.sqrt(mx * mx + my * my);
        if (spd > 6) r.h += angDiff(Math.atan2(my, mx), r.h) * Math.min(1, 7 * s);
        r.walk += spd * s;
        var fr = Math.floor(r.walk / 13) % 2;
        if (fr !== r.frame) { r.frame = fr; r.spr.setTexture("md-ram-ram-" + fr); }
        /* out through the door */
        if (r.state === "exit" && !r.crossed && r.x >= R.thrX) {
          r.crossed = true;
          this.ramCrossed(r);
          if (this._finishing || this.ended || R.rams !== rams) return;
        }
        if (r.state === "exit" && r.x > this.W + 70) { r.state = "gone"; r.spr.setVisible(false); r.txt.setVisible(false); continue; }
        if (!r.crossed) inCave++;
        this.ramPlace(r);
      }
      R.inCave = inCave;
    },
    /* a ram has passed out through the door */
    ramCrossed: function (r) {
      var R = this.ram, o = R.ody, rode = o.state === "cling" && o.ram === r;
      if (rode) this.ramExit(r);
      if (this._finishing || this.ended || this._between) return;
      var left = R.rams.filter(function (q) { return q.state !== "gone" && !q.crossed; }).length;
      if (left > 0) return;
      if (!rode) {
        this.iframeMs = 0;   /* the flock leaving is not a hit the safety blink can dodge */
        this.loseLife("hit", "THE FLOCK WENT OUT WITHOUT YOU");
        if (this._finishing) return;
      }
      this.ramFlock(true);
    },
    /* Odysseus rode a ram out: its letter is his answer */
    ramExit: function (r) {
      var R = this.ram, o = R.ody, L = r.letter;
      o.state = "foot"; o.ram = null; o.under.setVisible(false);
      var res = this.answerPick(L, r.x, r.y - 30);
      if (res === "done") return;   /* clear_ram has let Odysseus go free */
      if (res === "wrong") { if (R.dead.indexOf(L) === -1) R.dead.push(L); this.ramMark(L, "wrong"); }
      else if (res === "partial") this.ramMark(L, "right");
      this.ramSlip(r.x, r.y);
      this.ramActLabel();
    },

    /* ── Odysseus ── */
    /* the ram Odysseus is touching (one he can ride, if any) */
    ramTouching: function () {
      var R = this.ram, o = R.ody, best = null, bd = 1e9, marked = null, md = 1e9;
      R.rams.forEach(function (r) {
        if (r.state === "gone" || r.crossed || r.a < 0.6) return;
        var d = dist(r.x, r.y, o.x, o.y);
        if (d >= RAM_R * r.sc / RAM_SC + 24) return;
        if (r.mark) { if (d < md) { md = d; marked = r; } }
        else if (d < bd) { bd = d; best = r; }
      });
      return best || marked;
    },
    ramCling: function (r) {
      var R = this.ram, o = R.ody;
      o.state = "cling"; o.ram = r; o.x = r.x; o.y = r.y;
      o.spr.setVisible(false);
      o.under.setPosition(r.x, r.y).setRotation(r.h).setScale(r.sc).setVisible(true);
      rsnd("cling");
      this.ramTell("cling", "You're under the ram, holding on to its fleece. Ride it out through the door: Polyphemus feels only their backs!", 4200);
      this.ramActLabel();
    },
    ramTryCling: function () {
      var r = this.ramTouching();
      if (!r) { this.ramTell("near", "Walk right up to a ram first, then press Space (or CLING) to grab on under it.", 2600, true); return; }
      if (r.mark === "wrong") { this.ramTell("crossed", "Letter " + r.letter + " is crossed out. Find a ram with another letter.", 2600, true); return; }
      if (r.mark === "right") { this.ramTell("found", "You already rode out on " + r.letter + ". Now find the other right letter.", 2600, true); return; }
      this.ramCling(r);
    },
    ramLetGo: function () {
      var R = this.ram, o = R.ody, r = o.ram;
      o.state = "foot"; o.ram = null; o.under.setVisible(false);
      if (r) { o.x = r.x - Math.cos(r.h) * 6; o.y = r.y - Math.sin(r.h) * 6; o.rot = r.h; }
      this.ramCollide(o, ODY_R);
      o.spr.setVisible(true).setAlpha(1).setScale(1);
      rsnd("letgo");
      this.ramActLabel();
    },
    /* caught by a hand: a life, and he is thrown back into the cave */
    ramCaught: function (h, label) {
      var R = this.ram, o = R.ody;
      if (o.state === "cling") { o.state = "foot"; o.ram = null; o.under.setVisible(false); }
      h.caught = true;
      this.burst(o.x, o.y, 0xefe6d2, 16);
      rsnd("grab");
      this.loseLife("hit", label);
      this.ramActLabel();
      if (this._finishing) return;
      var b = this.ramBackSpot();
      o.state = "thrown"; o.t = 0; o.fx = o.x; o.fy = o.y; o.tx = b.x; o.ty = b.y; o.dur = 800;
      o.spr.setVisible(true).setAlpha(1);
      this.ramTell("thrown", "Polyphemus caught you and threw you back into the cave! Stay under a ram near his hands.", 3600);
    },
    /* after riding out on a wrong (or a first right) letter: he slips back into the cave */
    ramSlip: function (x, y) {
      var o = this.ram.ody;
      o.state = "slip"; o.t = 0; o.sx = x; o.sy = y; o.moved = false;
      o.spr.setVisible(true).setScale(1);
      this.iframeMs = Math.max(this.iframeMs || 0, 1200);
    },
    ramTickOdy: function (s, ms, inp, edge) {
      var R = this.ram, o = R.ody, fr;
      o.t += ms;
      if (o.state === "foot") {
        if (edge && !this._between) { this.ramTryCling(); if (o.state !== "foot") { this.player.setPosition(o.x, o.y); return; } }
        var ax = inp.ax, ay = inp.ay, l = Math.sqrt(ax * ax + ay * ay);
        if (l > 0) {
          o.x += ax / l * ODY_SP * s; o.y += ay / l * ODY_SP * s;
          o.rot += angDiff(Math.atan2(ay, ax), o.rot) * Math.min(1, 14 * s);
          o.walk += ODY_SP * s;
          if (ax > 0 && o.x > R.wallX0 - 26 && o.y > R.doorTop && o.y < R.doorBot) this.ramTell("door", "You can't walk out on foot: Polyphemus would grab you. Cling under a ram and ride it out!", 3600);
        }
        this.ramCollide(o, ODY_R);
        fr = l > 0 ? Math.floor(o.walk / 18) % 2 : 0;
        o.spr.setTexture("md-ram-ody-" + fr).setPosition(o.x, o.y).setRotation(o.rot).setScale(1).setVisible(true);
        this.blink(o.spr);
      } else if (o.state === "cling") {
        var r = o.ram;
        if (!r || r.state === "gone") { o.ram = null; this.ramLetGo(); return; }
        if (edge) { this.ramLetGo(); this.player.setPosition(o.x, o.y); return; }
        if (inp.ax || inp.ay) this.ramTell("hold", "You're holding on under the ram. Press Space (or LET GO) to drop off.", 3000);
        o.x = r.x; o.y = r.y; o.rot = r.h;
        o.under.setPosition(r.x, r.y).setRotation(r.h).setScale(r.sc).setAlpha(r.a);
        this.blink(o.under);
      } else if (o.state === "thrown") {
        var u = clamp(o.t / o.dur, 0, 1);
        o.x = o.fx + (o.tx - o.fx) * u; o.y = o.fy + (o.ty - o.fy) * u - Math.sin(Math.PI * u) * 90;
        o.spr.setPosition(o.x, o.y).setRotation(o.rot + u * TAU * 1.5).setScale(1 + 0.7 * Math.sin(Math.PI * u));
        if (u >= 1) { o.x = o.tx; o.y = o.ty; o.state = "foot"; o.spr.setScale(1).setPosition(o.x, o.y); this.burst(o.x, o.y + 6, 0x9a8a6a, 10); rsnd("thud"); R.youMs = 1800; }
      } else if (o.state === "slip") {
        var A = 380;
        if (o.t < A) o.spr.setPosition(o.sx, o.sy).setAlpha(1 - o.t / A);
        else {
          if (!o.moved) { o.moved = true; var b = this.ramBackSpot(); o.x = b.x; o.y = b.y; o.rot = 0; }
          o.spr.setTexture("md-ram-ody-0").setPosition(o.x, o.y).setRotation(o.rot).setAlpha(clamp((o.t - A) / A, 0, 1));
          if (o.t >= A * 2) { o.state = "foot"; o.spr.setAlpha(1); R.youMs = 2200; }
        }
      } else if (o.state === "free") {
        /* out in the dawn: he runs off along the path */
        o.x += 160 * s; o.walk += 160 * s; o.rot = 0;
        fr = Math.floor(o.walk / 18) % 2;
        o.spr.setTexture("md-ram-ody-" + fr).setPosition(o.x, o.y).setRotation(0).setAlpha(clamp((this.W + 10 - o.x) / 60, 0, 1));
      }
      this.player.setPosition(o.x, o.y);
    },

    /* ── Polyphemus's roar ── */
    ramTickRoar: function (s, ms) {
      var R = this.ram, P = R.P, ro = R.roar;
      ro.t += ms;
      if (ro.state === "calm") {
        if (P.roarEvery < 1e8 && !R.hold && !this._between && ro.t >= ro.cd) {
          ro.state = "breath"; ro.t = 0;
          R.say.setText("Polyphemus draws a deep breath…").setColor(C.bone).setVisible(true);
        }
      } else if (ro.state === "breath") {
        if (ro.t >= P.roarWarn) this.ramRoar();
      } else if (ro.t >= 1400) {
        ro.state = "calm"; ro.t = 0; ro.cd = P.roarEvery * rnd(0.85, 1.15);
        R.poly.setTexture("md-ram-poly-0"); R.say.setVisible(false);
      }
    },
    ramRoar: function () {
      var R = this.ram, P = R.P, ro = R.roar, sp = P.scatterSp * (P.loudRoar ? 1.3 : 1);
      ro.state = "roar"; ro.t = 0;
      R.poly.setTexture("md-ram-poly-1");
      R.say.setText("ROAR!").setColor("#ffb070").setVisible(true);
      try { this.cameras.main.shake(260, 0.004); } catch (e) {}
      rsnd("roar");
      R.rams.forEach(function (r) {
        if ((r.state !== "graze" && r.state !== "go") || r.held > 0) return;
        var a = Math.atan2(r.y - R.doorY, r.x - (R.wallX1 + 40)) + rnd(-1.1, 1.1), v = sp * rnd(0.8, 1.2);
        r.scat = rnd(1000, 1500) * (P.loudRoar ? 1.25 : 1); r.svx = Math.cos(a) * v; r.svy = Math.sin(a) * v; r.pause = 0;
      });
      if (P.loudRoar) R.rageMs = 3000;
      this.ramTell("roar", "Polyphemus roars and the rams scatter! If you're under one, hold on. If not, chase the ram you want.", 3800);
    },

    /* ── the hands ── */
    /* sweeping: one hand sweeps across the doorway, bulging into the cave; the other sweeps just outside it,
       the other way, feeling the rams as they come out (if one hand is groping, the other takes the doorway) */
    ramSweepPt: function (h) {
      var R = this.ram, P = R.P, other = R.hands[1 - h.i], inner = h.i === 0 || other.mode !== "sweep";
      var ph = R.sweepPh + (inner ? 0 : Math.PI), u = 0.5 + 0.5 * Math.sin(ph), y = R.doorTop + 22 + (R.doorH - 44) * u;
      if (!inner) return { x: R.wallX1 + 34 + 8 * Math.sin(ph * 2), y: y };
      var k = clamp((y - R.doorTop) / R.doorH, 0, 1);
      return { x: R.wallX0 + 6 - P.sweepDepth * Math.sin(Math.PI * k), y: y };
    },
    ramHandReset: function (h) {
      h.mode = "sweep"; h.phase = ""; h.t = 0; h.low = true; h.ram = null; h.again = false; h.caught = false; h.feeling = null;
      h.mark.setVisible(false);
    },
    ramHandBack: function (h) {
      if (h.ram) h.ram.held = 0;
      h.phase = "back"; h.t = 0; h.low = false; h.ram = null; h.mark.setVisible(false);
    },
    ramFreeHand: function (x, y) {
      var best = null, bd = 1e9, self = this;
      this.ram.hands.forEach(function (h) {
        if (h.mode !== "sweep") return;
        var d = dist(h.x, h.y, x, y) + (self.ram.ody.state === "cling" && h.feeling === self.ram.ody.ram ? 400 : 0);
        if (d < bd) { bd = d; best = h; }
      });
      return best;
    },
    /* a grope into the cave: the hand hovers over (x, y) for `warn` ms (a shadow and a closing ring), then comes down */
    ramGrope: function (h, x, y, warn, chain) {
      h.mode = "grope"; h.phase = "warn"; h.t = 0; h.warn = warn; h.tx = x; h.ty = y; h.low = false; h.ram = null; h.again = !!chain; h.caught = false; h.feeling = null;
      this.ramTell("grope", "Polyphemus gropes into the cave! The dark shadow shows where his hand will come down. Keep out from under it.", 4000);
    },
    /* feeling UNDER a ram: a red ring and a "!" over the ram, then the hand comes down on it */
    ramUnder: function (h, r, warn, chain) {
      h.mode = "under"; h.phase = "warn"; h.t = 0; h.warn = warn; h.ram = r; h.tx = r.x; h.ty = r.y; h.low = false; h.again = !!chain; h.caught = false; h.feeling = null;
      this.ramTell("under", "Polyphemus is feeling UNDER a ram (the red ring)! If you're under it, let go (Space or LET GO) and get away, or get under another ram.", 4400);
    },
    ramGropeTarget: function () {
      var R = this.ram, P = R.P, o = R.ody, self = this, x, y;
      if (o.state === "foot" && this.ramDoorDist(o.x, o.y) < R.reachR + 30) { x = o.x + rnd(-1, 1) * P.aimErr; y = o.y + rnd(-1, 1) * P.aimErr; }
      else {
        var cand = R.rams.filter(function (r) { return (r.state === "graze" || r.state === "go") && self.ramDoorDist(r.x, r.y) < R.reachR; });
        if (cand.length && Math.random() < 0.6) { var r = cand[Math.floor(Math.random() * cand.length)]; x = r.x + rnd(-30, 30); y = r.y + rnd(-30, 30); }
        else { var a = rnd(Math.PI * 0.62, Math.PI * 1.38), d = rnd(0.35, 1) * R.reachR; x = R.doorC.x + Math.cos(a) * d; y = R.doorC.y + Math.sin(a) * d; }
      }
      return this.ramClampReach(x, y);
    },
    ramUnderTarget: function () {
      var R = this.ram, o = R.ody, self = this;
      var cand = R.rams.filter(function (r) {
        return (r.state === "graze" || r.state === "go") && r.held <= 0 && r.a >= 1 && r.x < R.wallX0 - 50 && self.ramDoorDist(r.x, r.y) < R.reachR &&
          !R.hands.some(function (h) { return h.ram === r; });
      });
      if (!cand.length) return null;
      if (o.state === "cling" && cand.indexOf(o.ram) !== -1 && Math.random() < 0.8) return o.ram;
      return cand[Math.floor(Math.random() * cand.length)];
    },
    ramHandC: function (h) {
      var sc = this.ram.HS;
      return { x: h.x + Math.cos(h.rot) * 14 * sc, y: h.y + Math.sin(h.rot) * 14 * sc };
    },
    ramTickHands: function (s, ms) {
      var R = this.ram, P = R.P, o = R.ody, self = this, i;
      R.sweepPh += P.handSp * 2.2 * (R.rageMs > 0 ? 1.6 : 1) * s;
      if (R.rageMs > 0) R.rageMs -= ms;
      if (!R.hold && !this._between) {
        var busy = R.hands.filter(function (h) { return h.mode !== "sweep"; }).length;
        R.gropeCd -= ms;
        if (R.gropeCd <= 0) {
          if (busy < P.gropers) { var tg = this.ramGropeTarget(), h0 = this.ramFreeHand(tg.x, tg.y); if (h0) { this.ramGrope(h0, tg.x, tg.y, P.warn); busy++; } }
          R.gropeCd = P.gropeEvery * rnd(0.8, 1.2);
        }
        if (P.underEvery < 1e8) {
          R.underCd -= ms;
          if (R.underCd <= 0) {
            var tr = busy < P.gropers ? this.ramUnderTarget() : null, h1 = tr ? this.ramFreeHand(tr.x, tr.y) : null;
            if (h1) { this.ramUnder(h1, tr, P.warn * 1.15); R.underCd = P.underEvery * rnd(0.85, 1.15); }
            else R.underCd = 700;
          }
        }
      }
      for (i = 0; i < R.hands.length; i++) this.ramTickHand(R.hands[i], s, ms);
      /* a hand that touches Odysseus while he is not under a ram catches him */
      if (o.state === "foot" && this.iframeMs <= 0 && !this._between) {
        for (i = 0; i < R.hands.length; i++) {
          var h = R.hands[i];
          if (!h.low) continue;
          var c = this.ramHandC(h);
          if (dist(c.x, c.y, o.x, o.y) < HAND_R * R.HS + ODY_R - 2) { this.ramCaught(h, "POLYPHEMUS CAUGHT YOU"); break; }
        }
      }
    },
    ramTickHand: function (h, s, ms) {
      var R = this.ram, P = R.P, o = R.ody, tx, ty, k;
      h.t += ms;
      if (h.mode === "sweep") {
        var q = this.ramSweepPt(h), fb = this.ramBackFor(h, q);
        tx = q.x; ty = q.y; k = 9; h.low = true; h.feeling = fb;
        if (fb) {
          /* he feels the backs of the rams going out (and, as in Homer, never underneath) */
          tx = fb.x - Math.cos(h.rot) * 40 * R.HS; ty = fb.y - Math.sin(h.rot) * 40 * R.HS + Math.sin(R.t * 16) * 3; k = 12;
          if (!fb.patted && dist(h.x, h.y, fb.x, fb.y) < 60) { fb.patted = true; rsnd("pat"); if (o.state === "cling" && o.ram === fb) this.ramTell("back", "Polyphemus feels the ram's back, but not underneath it. Hold on!", 3200); }
        }
      } else if (h.phase === "warn") {
        if (h.mode === "under") {
          if (!h.ram || h.ram.state === "gone" || h.ram.crossed || h.ram.state === "exit") { this.ramHandBack(h); return this.ramTickHand(h, 0, 0); }
          h.tx = h.ram.x; h.ty = h.ram.y;
        }
        /* poised, raised and drawn back along the arm, so the ram or the spot it will feel stays in plain sight */
        tx = h.tx - Math.cos(h.rot) * 128 * R.HS; ty = h.ty - Math.sin(h.rot) * 128 * R.HS; k = 7; h.low = false;
        if (h.t >= h.warn) { h.phase = "down"; h.t = 0; this.ramLand(h); }
      } else if (h.phase === "down") {
        if (h.mode === "under" && h.ram) {
          h.tx = h.ram.x; h.ty = h.ram.y; h.ram.held = 120;
          if (o.state === "cling" && o.ram === h.ram && this.iframeMs <= 0 && !this._between && !h.caught) { this.ramCaught(h, "POLYPHEMUS FELT YOU UNDER THE RAM"); if (this._finishing) return; }
        }
        tx = h.tx + Math.sin(h.t * 0.03) * 5; ty = h.ty; k = 24; h.low = true;
        if (h.t >= (h.mode === "under" ? 650 : 480)) this.ramAfterFeel(h);
      } else {
        var q2 = this.ramSweepPt(h);
        tx = q2.x + 24; ty = q2.y - 24; k = 8; h.low = false;
        if (h.t >= 420) this.ramHandReset(h);
      }
      var kk = 1 - Math.exp(-k * s);
      h.x += (tx - h.x) * kk; h.y += (ty - h.y) * kk;
      this.ramElbow(h);
    },
    /* the arm reaches in THROUGH the doorway: once the hand is inside the cave the elbow sits in the door gap,
       otherwise it bends naturally between shoulder and hand; the hand points along the forearm */
    ramElbow: function (h) {
      var R = this.ram, sh = R.sh[h.i], dx = h.x - sh.x, dy = h.y - sh.y, len = Math.sqrt(dx * dx + dy * dy) || 1, bend = Math.min(60, len * 0.16);
      var nx = (sh.x + h.x) / 2 + dy / len * bend, ny = (sh.y + h.y) / 2 - dx / len * bend;
      var w = clamp((R.wallX0 - h.x) / 90, 0, 1), gx = R.wallX0 + R.T * 0.4, gy = clamp(h.y, R.doorTop + 46, R.doorBot - 34);
      h.ex = nx + (gx - nx) * w; h.ey = ny + (gy - ny) * w;
      var fx = h.x - h.ex, fy = h.y - h.ey, fl = Math.sqrt(fx * fx + fy * fy) || 1, k = clamp(fl / 60, 0, 1);
      var ux = fx / fl * k + dx / len * (1 - k), uy = fy / fl * k + dy / len * (1 - k);
      h.rot = Math.atan2(uy, ux);
    },
    /* the ram in the doorway nearest this sweeping hand, if the other hand isn't on it */
    ramBackFor: function (h, q) {
      var R = this.ram, best = null, bd = 150;
      R.rams.forEach(function (r) {
        if (r.state !== "exit" || r.x < R.wallX0 - 60 || r.x > R.wallX1 + 50) return;
        if (R.hands.some(function (o) { return o !== h && o.feeling === r; })) return;
        var d = dist(r.x, r.y, q.x, q.y);
        if (d < bd) { bd = d; best = r; }
      });
      return best;
    },
    /* the hand comes down: feeling under a ram finds Odysseus if he is still under it */
    ramLand: function (h) {
      rsnd("pat");
      if (h.mode === "under" && h.ram) h.ram.held = 700;
    },
    ramAfterFeel: function (h) {
      var R = this.ram, P = R.P, o = R.ody, self = this;
      if (!this._between && !R.hold && !h.again && !h.caught) {
        if (h.mode === "grope" && P.again && o.state === "foot" && this.ramDoorDist(o.x, o.y) < R.reachR + 40) {
          var t = this.ramClampReach(o.x + rnd(-1, 1) * P.aimErr * 0.5, o.y + rnd(-1, 1) * P.aimErr * 0.5);
          this.ramGrope(h, t.x, t.y, Math.max(450, P.warn * 0.7), true);
          return;
        }
        if (h.mode === "under" && P.doubleUnder && h.ram && Math.random() < 0.6) {
          var from = h.ram, nb = null, bd = 170;
          R.rams.forEach(function (r) {
            if (r === from || (r.state !== "graze" && r.state !== "go") || r.held > 0 || r.x > R.wallX0 - 50 || self.ramDoorDist(r.x, r.y) > R.reachR) return;
            var d = dist(r.x, r.y, from.x, from.y);
            if (d < bd) { bd = d; nb = r; }
          });
          if (nb) { from.held = 0; this.ramUnder(h, nb, Math.max(520, P.warn * 0.85), true); return; }
        }
      }
      this.ramHandBack(h);
    },

    /* ── drawing (positions, the arms, the warnings, the HUD) ── */
    ramDraw: function (s, ms) {
      var R = this.ram, o = R.ody, lg = R.lowG, tg = R.topG, i;
      lg.clear(); tg.clear(); R.armG.clear();
      R.flameMs += ms;
      if (R.flameMs >= 95) { R.flameMs = 0; R.flame = (R.flame + 1) % 3; R.flameSpr.setTexture("md-ram-flame-" + R.flame); }
      R.glow.setAlpha(0.55 + 0.08 * Math.sin(R.t * 7.3) + 0.05 * Math.sin(R.t * 17)).setScale(1.3 + 0.04 * Math.sin(R.t * 5.1));
      R.light.setAlpha(0.85 + 0.1 * Math.sin(R.t * 0.6));
      var shake = R.roar.state === "roar" ? Math.sin(R.t * 50) * 3 : 0;
      R.poly.setPosition(R.polyX + shake, R.polyY).setScale(R.PS, R.PS * (1 + 0.007 * Math.sin(R.t * 1.7)));
      if (R.say.visible) R.say.setScale(R.roar.state === "roar" ? 1 + 0.08 * Math.sin(R.t * 30) : 1);
      for (i = 0; i < R.hands.length; i++) {
        var h = R.hands[i], sh = R.sh[i], sc = R.HS * (h.low ? 1 : 1.14) * (h.feeling ? 1 + 0.03 * Math.sin(R.t * 18) : 1);
        h.spr.setPosition(h.x, h.y).setRotation(h.rot).setScale(sc);
        if (h.phase === "warn") {
          /* the shadow of the raised hand falls on the very spot it will come down on */
          var kw = clamp(h.t / h.warn, 0, 1);
          h.sh.setPosition(h.tx, h.ty).setRotation(h.rot).setScale(R.HS * (1.3 - 0.3 * kw)).setAlpha(0.12 + 0.3 * kw);
        } else h.sh.setPosition(h.x + (h.low ? 4 : 18), h.y + (h.low ? 6 : 28)).setRotation(h.rot).setScale(sc).setAlpha(h.low ? 0.26 : 0.2);
        this.ramArm(sh.x, sh.y, h.ex, h.ey, h.x - Math.cos(h.rot) * 40 * sc, h.y - Math.sin(h.rot) * 40 * sc, R.HS);
        if (h.mode === "grope" && h.phase === "warn") {
          var k = clamp(h.t / h.warn, 0, 1), rr = HAND_R * R.HS;
          lg.fillStyle(0x06040a, 0.1 + 0.25 * k); lg.fillEllipse(h.tx, h.ty, rr * 2.3, rr * 2);
          lg.lineStyle(3, 0xd9772b, 0.5 + 0.45 * k); lg.strokeCircle(h.tx, h.ty, rr * (2.3 - 1.25 * k));
          lg.lineStyle(2, 0xefe6d2, 0.35 + 0.45 * k); lg.strokeEllipse(h.tx, h.ty, rr * 2.3, rr * 2);
        }
        if (h.mode === "under" && h.ram && (h.phase === "warn" || h.phase === "down")) {
          var r = h.ram, k2 = h.phase === "warn" ? clamp(h.t / h.warn, 0, 1) : 1, pul = 0.5 + 0.5 * Math.sin(R.t * 14);
          tg.fillStyle(0x06040a, 0.06 + 0.14 * k2); tg.fillEllipse(r.x, r.y, 96, 74);
          tg.lineStyle(5, 0xe0482a, 0.6 + 0.4 * pul); tg.strokeCircle(r.x, r.y, 44 + 14 * (1 - k2));
          h.mark.setPosition(r.x, r.y - 40 - 4 * pul).setVisible(h.phase === "warn");
        } else h.mark.setVisible(false);
      }
      o.halo.setPosition(o.x, o.y).setVisible(o.state !== "free" && o.spr.alpha > 0.3 || o.state === "cling");
      if (o.state === "cling" && o.ram) {
        tg.lineStyle(3, 0xe8b04a, 0.95); tg.strokeCircle(o.ram.x, o.ram.y, 40 * o.ram.sc / RAM_SC);
      } else if (o.state === "foot") {
        lg.lineStyle(3, 0xffd27a, 0.9); lg.strokeEllipse(o.x, o.y + 2, 36, 30);
        var tr = this.ramTouching();
        if (tr && !tr.mark) { tg.lineStyle(2, 0xefe6d2, 0.7); tg.strokeCircle(tr.x, tr.y, 40 * tr.sc / RAM_SC); }
      }
      if (R.youMs > 0 && o.state === "foot") { R.youMs -= ms; R.you.setPosition(o.x, o.y - 18).setAlpha(clamp(R.youMs / 600, 0, 1)).setVisible(true); }
      else R.you.setVisible(false);
      var line2 = o.state === "cling" && o.ram ? "Under ram " + o.ram.letter + ": ride it out the door"
        : o.state === "foot" ? "On foot: touch a ram, press Space / CLING"
        : o.state === "thrown" ? "Thrown back into the cave!" : o.state === "free" ? "Out in the daylight!" : "";
      var txt = "Rams still in the cave: " + R.inCave + "\n" + line2;
      if (txt !== R.hudTxt) { R.hudTxt = txt; R.hud.setText(txt); }
    },
    /* one of the giant's arms: a thick pale tube from his shoulder (x0, y0) to the elbow (ex, ey), then on to the wrist (x1, y1) */
    ramArm: function (x0, y0, ex, ey, x1, y1, sc) {
      var R = this.ram, g = R.armG, pts = R.armPts, n = pts.length, half = 7, i, w = 34 * sc;
      for (i = 0; i < n; i++) {
        var u = i <= half ? i / half : (i - half) / (n - 1 - half);
        if (i <= half) { pts[i].x = x0 + (ex - x0) * u; pts[i].y = y0 + (ey - y0) * u; }
        else { pts[i].x = ex + (x1 - ex) * u; pts[i].y = ey + (y1 - ey) * u; }
      }
      g.lineStyle(w + 6, 0x140c0a, 1); g.strokePoints(pts);
      g.fillStyle(0x140c0a, 1); for (i = 0; i < n; i++) g.fillCircle(pts[i].x, pts[i].y, (w + 6) / 2);
      g.lineStyle(w, 0xe6cfae, 1); g.strokePoints(pts);
      g.fillStyle(0xe6cfae, 1); for (i = 0; i < n; i++) g.fillCircle(pts[i].x, pts[i].y, w / 2);
      /* shading on one side, a highlight on the other, following each part of the arm */
      for (i = 0; i < n; i++) {
        var a = i < n - 1 ? pts[i + 1] : pts[i], b = i < n - 1 ? pts[i] : pts[i - 1], dx = a.x - b.x, dy = a.y - b.y, l = Math.sqrt(dx * dx + dy * dy) || 1;
        g.fillStyle(0xc7a47e, 0.5); g.fillCircle(pts[i].x + dy / l * w * 0.22, pts[i].y - dx / l * w * 0.22, w * 0.22);
        if (i > 0 && i < n - 1) { g.fillStyle(0xf6e8d2, 0.55); g.fillCircle(pts[i].x - dy / l * w * 0.24, pts[i].y + dx / l * w * 0.24, w * 0.12); }
      }
      /* the sheepskin round his shoulder */
      g.fillStyle(0x140c0a, 1); g.fillCircle(x0, y0, w * 0.64);
      g.fillStyle(0xf5f0e4, 1); g.fillCircle(x0, y0, w * 0.56);
      g.fillStyle(0xd2c7ae, 1); g.fillCircle(x0 - w * 0.16, y0 - w * 0.14, w * 0.16); g.fillCircle(x0 + w * 0.2, y0 + w * 0.1, w * 0.14);
    },

    /* a full right answer: Odysseus is out in the daylight; the rest of the flock goes */
    clear_ram: function () {
      var R = this.ram, self = this, o = R.ody;
      R.rams.forEach(function (r) { if (r.state !== "gone") self.burst(r.x, r.y, 0xefe6d2, 4); self.ramKill(r); });
      R.rams = []; R.order = []; R.inCave = 0;
      R.hands.forEach(function (h) { if (h.mode !== "sweep") self.ramHandBack(h); });
      R.roar.state = "calm"; R.roar.t = 0; R.poly.setTexture("md-ram-poly-0"); R.say.setVisible(false);
      o.under.setVisible(false); o.ram = null;
      o.state = "free"; o.t = 0; o.x = Math.max(o.x, R.wallX1 + 8); o.y = R.doorY;
      o.spr.setVisible(true).setAlpha(1).setScale(1).setRotation(0);
      this.burst(o.x, o.y, 0xe8b04a, 14);
      try { R.lowG.clear(); R.topG.clear(); } catch (e) {}
      this.ramActLabel();
    }
  });
})();
