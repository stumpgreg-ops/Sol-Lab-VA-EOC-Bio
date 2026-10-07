/* SOL Labyrinth v5.11 — the Odyssey mode "row": Row Past the Sirens (Odyssey 12), a rhythm level.
 *
 * The galley rows up the screen past the Sirens' island: their flowery meadow, the heap of bones, the two
 * Sirens singing on their rocks along the left of the channel. The crew's ears are stopped with beeswax;
 * Odysseus is tied to the mast (the vase panel, top left). The boatswain's drum sets the beat: marks slide
 * along the Greek-key band at the bottom, from both ends toward the drum in the middle, and the student
 * rows (Space, the ROW button, a click or a tap) when they meet it.
 *   PERFECT / GOOD  the crew's stroke (rw.mom) grows: more speed, full steering, less of the song's pull.
 *   MISS            late, early, off the beat, or a beat let pass: the ship slows, the song tugs it toward
 *                   the rocks, and one of Odysseus's ropes snaps. When the last rope snaps he breaks free:
 *                   a life, and the crew ties him again and finds the beat (a count-in).
 * Running onto the Sirens' rocks costs a life too. Between verses a line of marker posts crosses the
 * channel, one passage for each letter of the question: the passage the ship's keel crosses is the letter
 * picked. A wrong letter's passage is crossed out from then on and a found letter (Select TWO) is ticked;
 * both are safe to sail through. rowParams(n) is the one difficulty curve (also on the def as `params`).
 * Only the Odyssey build offers this mode (game.js and SolModes.ODY_ROT); the file loads in every build.
 */
(function () {
  "use strict";
  var M = window.SolModes;
  if (!M || !M.extend || !M.lib) return;
  var L = M.lib, clamp = L.clamp, rnd = L.rnd, shuffle = L.shuffle, mix = L.mix, ST = L.ST, canvasTex = L.canvasTex, snd = L.snd;
  var TAU = Math.PI * 2;
  var SERIF = "Georgia, 'Palatino Linotype', serif";

  /* ── difficulty: one curve, a little harder every level (bpm rises every level, nothing ever eases) ── */
  function rowParams(n) {
    n = clamp(Math.floor(Number(n) || 1), 1, 100);
    return {
      bpm: (64 + n * 0.62) * (n >= 91 ? 1.06 : 1),                       /* the drum: 71 at 12, 95 at 50, 133 at 99 */
      perfectW: Math.max(38, 85 - n * 0.48),                              /* ms either side of the beat for PERFECT */
      goodW: Math.max(90, 175 - n * 0.85),                                /* ... and for GOOD */
      offP: n >= 21 ? Math.min(0.7, 0.3 + (n - 21) * 0.006) : 0,          /* a bar with an off-beat stroke */
      dblP: n >= 41 ? Math.min(0.6, 0.25 + (n - 41) * 0.006) : 0,         /* a bar with a double stroke */
      restP: n >= 71 ? Math.min(0.45, 0.2 + (n - 71) * 0.008) : 0,        /* a bar with a silent beat */
      breakAt: n < 11 ? 5 : n < 51 ? 4 : 3,                               /* misses in a row that set Odysseus free */
      pull: 14 + n * 0.75,                                                /* the song's pull toward the rocks, px/s */
      tug: 50 + n * 0.8,                                                  /* the jerk toward the rocks on every miss */
      swellMul: n >= 11 ? Math.min(2.6, 1.8 + (n - 11) * 0.009) : 1,      /* the pull while the song swells */
      swellEvery: n >= 11 ? Math.max(4200, 11000 - n * 70) * (n >= 81 ? 0.85 : 1) : 1e9,   /* calm song between swells, ms */
      swellWarn: Math.max(700, 1300 - n * 6),                             /* the gold notes before a swell, ms */
      swellMs: 1800 + n * 14,                                             /* how long a swell lasts */
      scroll: 118 + n * 0.9,                                              /* top speed up the channel, px/s */
      rowGap: Math.max(360, 680 - n * 3.2),                               /* water between lines of marker posts, px */
      chanFrac: (1 - n * 0.0026) * (n >= 31 ? 0.94 : 1),                  /* how much of the sea the channel keeps */
      sway: n >= 61 ? Math.min(0.3, 0.1 + (n - 61) * 0.005) : 0           /* inner posts drifting, × a passage's width */
    };
  }

  /* ── art: canvas textures in the vase palette, drawn once (keys md-row-*) ── */
  var C = { glaze: ST.glaze, terra: ST.terra, ochre: ST.ochre, bone: ST.bone, foam: ST.foam, wine: ST.wine, wood: "#8a5a32", woodDk: "#5a3418", skin: "#f4ecda" };
  function seeded(seed) { var s = seed; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
  function ell(c, x, y, rx, ry, rot) { c.beginPath(); c.ellipse(x, y, rx, ry, rot || 0, 0, TAU); }
  function line(c, x0, y0, x1, y1) { c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); }
  function poly(c, pts) { c.beginPath(); pts.forEach(function (q, i) { c[i ? "lineTo" : "moveTo"](q[0], q[1]); }); c.closePath(); }
  function dot(c, x, y, r) { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); }
  /* a Greek-key hook on its running base line, u wide and u/2 tall, its top-left at (x, y) */
  function keyUnit(c, x, y, u) {
    var h = u * 0.5;
    c.beginPath();
    c.moveTo(x, y + h); c.lineTo(x + u, y + h);
    c.moveTo(x + u * 0.12, y + h); c.lineTo(x + u * 0.12, y); c.lineTo(x + u * 0.74, y); c.lineTo(x + u * 0.74, y + h * 0.7);
    c.lineTo(x + u * 0.36, y + h * 0.7); c.lineTo(x + u * 0.36, y + h * 0.36); c.lineTo(x + u * 0.54, y + h * 0.36);
    c.stroke();
  }

  /* the galley from above, bow up, the sail furled on its yard (the wind dropped near the island and the
     crew rowed). The oars are separate sprites; OARS are their oarlocks [half-width, y] in this texture. */
  var SW = 100, SH = 212, MAST_Y = 106, OAR_LEN = 58;
  var OARS = [[16.5, 60], [17.9, 82], [16.2, 130], [15, 150], [12.9, 170]];
  function hullPath(c, cx, k) {
    c.beginPath();
    c.moveTo(cx, 6 + k * 1.6);
    c.quadraticCurveTo(cx + 22 - k, 50, cx + 17 - k, 102);
    c.quadraticCurveTo(cx + 16 - k, 176, cx + 6 - k * 0.6, 198 - k);
    c.lineTo(cx, 206 - k * 1.4);
    c.lineTo(cx - 6 + k * 0.6, 198 - k);
    c.quadraticCurveTo(cx - 16 + k, 176, cx - 17 + k, 102);
    c.quadraticCurveTo(cx - 22 + k, 50, cx, 6 + k * 1.6);
    c.closePath();
  }
  function drawShip(c, w, h) {
    var cx = w / 2, my = MAST_Y, i;
    c.lineCap = "round"; c.lineJoin = "round";
    /* the steering oar, starboard at the stern */
    c.strokeStyle = C.woodDk; c.lineWidth = 3; line(c, cx + 8, 182, cx + 19, 204);
    c.fillStyle = C.ochre; ell(c, cx + 19, 203, 3, 6, -0.45); c.fill();
    /* hull: black glaze with a terracotta rim, then the deck */
    c.fillStyle = C.glaze; hullPath(c, cx, 0); c.fill();
    c.strokeStyle = C.terra; c.lineWidth = 2.5; c.stroke();
    c.fillStyle = C.wood; hullPath(c, cx, 4); c.fill();
    c.strokeStyle = "rgba(20,12,10,0.5)"; c.lineWidth = 1; c.stroke();
    c.strokeStyle = "rgba(20,12,10,0.2)";
    line(c, cx - 6, 30, cx - 6, 188); line(c, cx + 6, 30, cx + 6, 188);
    /* benches, and the crew at the oars — ears stopped with beeswax (the yellow dots) */
    c.strokeStyle = C.woodDk; c.lineWidth = 3;
    OARS.forEach(function (o) { line(c, cx - o[0] + 4, o[1] - 4, cx + o[0] - 4, o[1] - 4); });
    OARS.forEach(function (o) {
      [-1, 1].forEach(function (sd) {
        var x = cx + sd * Math.max(5.5, o[0] - 9.5), y = o[1] + 3;
        c.fillStyle = "#d8c4a0"; ell(c, x, y + 3.4, 5, 3.2); c.fill();
        c.fillStyle = "#2a160c"; dot(c, x, y, 3.3);
        c.fillStyle = "#ffd36a"; dot(c, x - 3.4, y, 1.2); dot(c, x + 3.4, y, 1.2);
      });
    });
    /* Odysseus bound to the mast: his terracotta cloak, his dark hair, three turns of rope round both */
    c.fillStyle = "#b4471e"; ell(c, cx, my + 7, 9.5, 6); c.fill();
    c.strokeStyle = C.ochre; c.lineWidth = 1; c.stroke();
    c.fillStyle = C.woodDk; dot(c, cx, my - 1, 4.2);
    c.fillStyle = "#24140c"; dot(c, cx, my + 7.5, 4.6);
    [[11.5, 8.5, 0, 3], [13, 9.5, 0.12, 6], [12, 9, -0.1, 9]].forEach(function (q) {
      c.strokeStyle = C.glaze; c.lineWidth = 3.4; ell(c, cx, my + q[3] - 1, q[0], q[1], q[2]); c.stroke();
      c.strokeStyle = C.bone; c.lineWidth = 1.7; ell(c, cx, my + q[3] - 1, q[0], q[1], q[2]); c.stroke();
    });
    /* the yard with the sail furled along it */
    c.strokeStyle = C.glaze; c.lineWidth = 9; line(c, cx - 40, my - 14, cx + 40, my - 14);
    c.strokeStyle = C.bone; c.lineWidth = 6.5; line(c, cx - 38, my - 14, cx + 38, my - 14);
    c.strokeStyle = C.terra; c.lineWidth = 2;
    for (i = -30; i <= 30; i += 12) line(c, cx + i, my - 17.5, cx + i, my - 10.5);
    /* the painted eyes on the prow */
    [-1, 1].forEach(function (sd) {
      var ex = cx + sd * 7.5, ey = 26;
      c.fillStyle = C.bone; ell(c, ex, ey, 3.4, 6, sd * 0.35); c.fill();
      c.fillStyle = "#b8321e"; dot(c, ex, ey, 2.3);
      c.fillStyle = C.glaze; dot(c, ex, ey, 1.2);
    });
    /* the boatswain at the stern with his drum */
    c.fillStyle = C.terra; dot(c, cx, 182, 6.2);
    c.fillStyle = C.bone; dot(c, cx, 182, 4.4);
    c.fillStyle = C.ochre; dot(c, cx, 182, 1.4);
    c.fillStyle = "#2a160c"; dot(c, cx, 191, 3.4);
    /* the stern post curls back */
    c.strokeStyle = C.terra; c.lineWidth = 3; c.beginPath(); c.arc(cx, 199, 5, 0.2, Math.PI - 0.2); c.stroke();
  }
  function drawOar(c, w, h) {
    c.lineCap = "round";
    c.strokeStyle = C.glaze; c.lineWidth = 4.2; line(c, 2, h / 2, 48, h / 2);
    c.strokeStyle = "#a06a3a"; c.lineWidth = 2.4; line(c, 2, h / 2, 48, h / 2);
    c.fillStyle = C.ochre; c.strokeStyle = C.glaze; c.lineWidth = 1.3; ell(c, 54, h / 2, 9, 3.8); c.fill(); c.stroke();
  }

  /* A woman's head as on a black-figure vase (the same head as js/odyssey.js's Sirens): white face,
     dark hair held by an ochre band; flow streams the hair back (to the left) */
  function sirenHead(c, x, y, s, flow) {
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = "#120806"; c.strokeStyle = C.ochre; c.lineWidth = 1 / s;
    c.beginPath();
    if (flow) { c.moveTo(-1, -9); c.quadraticCurveTo(-16, -9, -22, 2); c.quadraticCurveTo(-14, 0, -12, 6); c.quadraticCurveTo(-6, 9, 1, 6); c.arc(0, -1, 8.6, 0.9 * Math.PI / 2, -Math.PI / 2, true); }
    else { c.moveTo(-8.6, -2); c.arc(0, -1.5, 8.8, Math.PI, 0); c.lineTo(9.5, 9); c.quadraticCurveTo(5, 12, 2, 9.5); c.lineTo(-2, 9.5); c.quadraticCurveTo(-5, 12, -9.5, 9); c.closePath(); }
    c.fill(); c.stroke();
    c.fillStyle = C.skin; ell(c, 0, 1, 6.1, 7.2); c.fill();
    c.strokeStyle = "#5a3020"; c.lineWidth = 0.7 / s; c.stroke();
    c.fillStyle = "#120806"; c.beginPath(); c.ellipse(0, -4.2, 6.6, 3.6, 0, Math.PI, 0); c.lineTo(6.4, -3.4); c.quadraticCurveTo(0, -1.8, -6.4, -3.4); c.closePath(); c.fill();
    c.strokeStyle = C.ochre; c.lineWidth = 1.4 / s; c.beginPath(); c.ellipse(0, -4.4, 7.4, 3.2, 0, Math.PI * 1.08, Math.PI * 1.92); c.stroke();
    c.fillStyle = "#1a0e0a"; ell(c, -2.4, 0.8, 1.35, 0.85); c.fill(); ell(c, 2.4, 0.8, 1.35, 0.85); c.fill();
    c.strokeStyle = "#3a2216"; c.lineWidth = 0.6 / s; line(c, -3.8, -0.9, -1.2, -1.1); line(c, 1.2, -1.1, 3.8, -0.9);
    c.restore();
  }
  /* a Siren on her rock, side-on and facing the sea (right): a bird's body, a woman's head; frame 1 lifts
     her wing and opens her mouth wider as she sings. Feet at the bottom centre (origin 0.5, 1). */
  var SIR_W = 84, SIR_H = 104, SIR_MOUTH = [61 - 42, 30 - 104];
  function drawSiren(frame) {
    return function (c, w, h) {
      var bx = 38, by = 62, i;
      c.lineJoin = "round"; c.lineCap = "round";
      c.fillStyle = C.glaze; c.strokeStyle = C.ochre; c.lineWidth = 1.5;
      poly(c, [[bx - 12, by - 2], [bx - 36, by + 2], [bx - 30, by + 8], [bx - 38, by + 14], [bx - 28, by + 15], [bx - 31, by + 22], [bx - 12, by + 10]]); c.fill(); c.stroke();
      c.strokeStyle = C.terra; c.lineWidth = 1; line(c, bx - 14, by + 3, bx - 32, by + 6); line(c, bx - 14, by + 7, bx - 29, by + 15);
      /* legs and talons gripping the rock */
      c.strokeStyle = C.ochre; c.lineWidth = 2.6; line(c, bx - 4, by + 10, bx - 6, h - 6); line(c, bx + 5, by + 10, bx + 6, h - 6);
      c.lineWidth = 1.6;
      [-6, 6].forEach(function (fx) { var x = bx + fx; line(c, x, h - 6, x - 4, h - 2); line(c, x, h - 6, x + 4, h - 2); line(c, x, h - 6, x, h - 1.5); });
      /* body, chest raised */
      c.fillStyle = C.glaze; c.strokeStyle = C.ochre; c.lineWidth = 1.6;
      ell(c, bx, by, 19, 12.5, -0.3); c.fill(); c.stroke();
      c.strokeStyle = C.terra; c.lineWidth = 0.9;
      [[bx + 6, by - 4], [bx + 11, by - 1], [bx + 4, by + 2], [bx + 9, by + 4], [bx + 14, by - 6]].forEach(function (q) { c.beginPath(); c.arc(q[0], q[1], 2.3, 0.15 * Math.PI, 0.85 * Math.PI); c.stroke(); });
      /* the wing: folded, or lifted as she sings */
      c.fillStyle = C.glaze; c.strokeStyle = C.ochre; c.lineWidth = 1.5;
      if (frame) poly(c, [[bx + 8, by - 8], [bx - 2, by - 30], [bx - 18, by - 42], [bx - 16, by - 33], [bx - 26, by - 36], [bx - 22, by - 26], [bx - 31, by - 26], [bx - 22, by - 16], [bx - 27, by - 10], [bx - 12, by + 2]]);
      else poly(c, [[bx + 10, by - 9], [bx - 4, by - 14], [bx - 22, by - 10], [bx - 34, by - 2], [bx - 24, by + 1], [bx - 28, by + 6], [bx - 14, by + 6], [bx + 2, by + 4]]);
      c.fill(); c.stroke();
      c.strokeStyle = C.terra; c.lineWidth = 1.1;
      if (frame) { line(c, bx + 2, by - 6, bx - 14, by - 34); line(c, bx - 2, by - 3, bx - 20, by - 24); line(c, bx - 4, by, bx - 19, by - 12); }
      else { line(c, bx + 4, by - 7, bx - 26, by - 3); line(c, bx + 2, by - 2, bx - 20, by + 3); }
      c.fillStyle = C.ochre;
      for (i = 0; i < 4; i++) dot(c, bx + 6 - i * 5, by - (frame ? 10 + i * 4 : 9 - i * 0.4), 0.95);
      /* her neck and head; her mouth open in song */
      c.fillStyle = C.skin; c.strokeStyle = "#5a3020"; c.lineWidth = 0.8;
      poly(c, [[bx + 12, by - 14], [bx + 19, by - 30], [bx + 25, by - 28], [bx + 19, by - 10]]); c.fill(); c.stroke();
      sirenHead(c, bx + 23, by - 38, 1.3, frame === 1);
      c.fillStyle = "#3a1810"; ell(c, bx + 23, by - 38 + 6, frame ? 1.7 : 1.3, frame ? 1.6 : 0.8); c.fill();
    };
  }

  /* the Sirens' island, the left bank: the meadow with its flowers and bones, the rocks at the water,
     and the two Sirens' rocks (ROCK_Y). The texture tiles top to bottom; coastEdge(ty) is the sea edge. */
  var CO_W = 256, CO_H = 1024, ROCK_Y = [250, 770];
  function wrapD(d, p) { d = ((d % p) + p) % p; return d > p / 2 ? d - p : d; }
  function coastEdge(ty) {
    var a = ty / CO_H * TAU, e = 212 + 9 * Math.sin(a * 3) + 6 * Math.sin(a * 7 + 1.3) + 3 * Math.sin(a * 13 + 0.4);
    for (var i = 0; i < ROCK_Y.length; i++) { var d = wrapD(ty - ROCK_Y[i], CO_H); e += 18 * Math.exp(-(d * d) / 3000); }
    return e;
  }
  function rockX(i) { return coastEdge(ROCK_Y[i]) - 30; }
  function boulder(c, x, y, rx, ry, light, dark) {
    var g = c.createRadialGradient(x - rx * 0.35, y - ry * 0.4, 1, x, y, Math.max(rx, ry));
    g.addColorStop(0, light); g.addColorStop(1, dark);
    c.fillStyle = g; ell(c, x, y, rx, ry); c.fill();
    c.strokeStyle = C.glaze; c.lineWidth = 1.8; c.stroke();
    c.strokeStyle = "rgba(239,230,210,0.22)"; c.lineWidth = 1.5; c.beginPath(); c.ellipse(x, y, rx * 0.7, ry * 0.65, 0, Math.PI * 1.1, Math.PI * 1.6); c.stroke();
  }
  function bone(c, x, y, len, rot) {
    c.save(); c.translate(x, y); c.rotate(rot);
    [[C.glaze, 4.6, 3.4], [C.bone, 2.6, 2.4]].forEach(function (q) {
      c.strokeStyle = q[0]; c.fillStyle = q[0]; c.lineWidth = q[1]; c.lineCap = "round"; line(c, -len / 2, 0, len / 2, 0);
      [-1, 1].forEach(function (sd) { dot(c, sd * len / 2, -1.6, q[2] * 0.62); dot(c, sd * len / 2, 1.6, q[2] * 0.62); });
    });
    c.restore();
  }
  function drawCoast(c, w, h) {
    var r = seeded(7), y, i, k;
    function wrap(y0, fn) { for (k = -1; k <= 1; k++) { var yy = y0 + k * h; if (yy > -60 && yy < h + 60) fn(yy); } }
    var g = c.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, "#46601e"); g.addColorStop(0.65, "#748a30"); g.addColorStop(1, "#9ea446");
    c.fillStyle = g; c.beginPath(); c.moveTo(0, 0);
    for (y = 0; y <= h; y += 4) c.lineTo(coastEdge(y), y);
    c.lineTo(0, h); c.closePath(); c.fill();
    /* grass */
    for (i = 0; i < 520; i++) {
      var gx = r() * 220, gy = r() * h, lean = (r() - 0.5) * 4, col = i % 3 ? "rgba(36,58,16,0.5)" : "rgba(200,204,110,0.45)";
      if (gx > coastEdge(gy) - 34) continue;
      wrap(gy, function (yy) { c.strokeStyle = col; c.lineWidth = 1.4; line(c, gx, yy, gx + lean, yy - 6); });
    }
    /* flowers of the meadow */
    var FL = ["#efe6d2", "#e8b04a", "#f2c6d2", "#efe6d2", "#c8b0e8"];
    for (i = 0; i < 110; i++) {
      var fx = 8 + r() * 200, fy = r() * h, fc = FL[i % FL.length], fr = 1.4 + r() * 1.2;
      if (fx > coastEdge(fy) - 38) continue;
      wrap(fy, function (yy) {
        c.fillStyle = fc;
        for (var p = 0; p < 5; p++) { var a = p / 5 * TAU; dot(c, fx + Math.cos(a) * fr * 1.3, yy + Math.sin(a) * fr * 1.3, fr); }
        c.fillStyle = "#c8742a"; dot(c, fx, yy, fr * 0.7);
      });
    }
    /* the bones in the grass (Homer's "heap of bones" — bleached, nothing more) */
    for (i = 0; i < 22; i++) {
      var bx = 14 + r() * 170, by = r() * h, bl = 9 + r() * 8, br = r() * Math.PI;
      if (bx > coastEdge(by) - 46) continue;
      wrap(by, function (yy) { bone(c, bx, yy, bl, br); });
      if (i % 3 === 0) { var bx2 = bx + 6, by2 = by + 5, br2 = br + 1.1; wrap(by2, function (yy) { bone(c, bx2, yy, bl * 0.8, br2); }); }
    }
    /* rocks along the water */
    for (y = 0; y < h; y += 16 + r() * 10) {
      var rr = 9 + r() * 12, rx2 = coastEdge(y) - rr * 0.6 - r() * 8, ry2 = rr * (0.75 + r() * 0.2), yv = y;
      wrap(yv, function (yy) { boulder(c, rx2, yy, rr, ry2, "#9a8c78", "#4e4236"); });
    }
    /* the Sirens' two great rocks */
    ROCK_Y.forEach(function (ry, idx) {
      wrap(ry, function (yy) {
        boulder(c, rockX(idx) + 8, yy + 14, 28, 20, "#8a7c68", "#3a3028");
        boulder(c, rockX(idx), yy, 30, 22, "#a89a84", "#4a3e32");
      });
    });
    /* foam where the sea breaks on the shore */
    c.strokeStyle = "rgba(159,211,214,0.9)"; c.lineWidth = 3.5; c.beginPath();
    for (y = 0; y <= h; y += 4) c[y ? "lineTo" : "moveTo"](coastEdge(y) + 2, y);
    c.stroke();
    c.strokeStyle = "rgba(239,230,210,0.5)"; c.lineWidth = 2; c.setLineDash([7, 9]); c.beginPath();
    for (y = 0; y <= h; y += 4) c[y ? "lineTo" : "moveTo"](coastEdge(y) + 8, y);
    c.stroke(); c.setLineDash([]);
  }
  /* the reef on the far (right) side of the channel; it widens with the level. Its sea edge is on the left. */
  var RF_W = 512, RF_H = 512;
  function reefEdge(ty) { var a = ty / RF_H * TAU; return 14 + 5 * Math.sin(a * 2) + 4 * Math.sin(a * 5 + 1) + 2 * Math.sin(a * 11 + 2); }
  function drawReef(c, w, h) {
    var r = seeded(23), y, i, k;
    var g = c.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, "#5a5046"); g.addColorStop(0.3, "#3a332c"); g.addColorStop(1, "#231e1a");
    c.fillStyle = g; c.beginPath(); c.moveTo(w, 0);
    for (y = 0; y <= h; y += 4) c.lineTo(reefEdge(y), y);
    c.lineTo(w, h); c.closePath(); c.fill();
    for (i = 0; i < 230; i++) {
      var yy0 = r() * h, rx = reefEdge(yy0) + 8 + r() * (w - 20), rr = 6 + r() * 12, ry = rr * (0.7 + r() * 0.25);
      for (k = -1; k <= 1; k++) { var yy = yy0 + k * h; if (yy > -30 && yy < h + 30) boulder(c, rx, yy, rr, ry, "#7a6e60", "#2e2822"); }
    }
    c.strokeStyle = "rgba(159,211,214,0.85)"; c.lineWidth = 3.5; c.beginPath();
    for (y = 0; y <= h; y += 4) c[y ? "lineTo" : "moveTo"](reefEdge(y) - 2, y);
    c.stroke();
    c.strokeStyle = "rgba(239,230,210,0.45)"; c.lineWidth = 2; c.setLineDash([6, 10]); c.beginPath();
    for (y = 0; y <= h; y += 4) c[y ? "lineTo" : "moveTo"](reefEdge(y) - 8, y);
    c.stroke(); c.setLineDash([]);
  }
  /* a marker post's head from above: a wooden stake with a terracotta band, foam round its foot */
  function drawPost(c, w, h) {
    var cx = w / 2, cy = h / 2;
    c.fillStyle = "rgba(159,211,214,0.5)"; dot(c, cx, cy + 1, 14);
    c.fillStyle = C.glaze; dot(c, cx, cy, 11);
    c.fillStyle = C.terra; dot(c, cx, cy, 9.5);
    c.fillStyle = C.wood; dot(c, cx, cy, 7.2);
    c.strokeStyle = C.woodDk; c.lineWidth = 1.2; ell(c, cx, cy, 4.8, 4.8); c.stroke(); ell(c, cx, cy, 2.2, 2.2); c.stroke();
    c.fillStyle = "rgba(239,230,210,0.3)"; dot(c, cx - 3, cy - 3, 2.2);
  }
  /* the plaque that floats on the rope across a passage, for its letter */
  function drawPlaque(c, w, h) {
    var cx = w / 2, cy = h / 2;
    c.fillStyle = "rgba(0,0,0,0.3)"; dot(c, cx + 2, cy + 3, 25);
    c.fillStyle = C.glaze; dot(c, cx, cy, 26);
    c.fillStyle = C.terra; dot(c, cx, cy, 24);
    c.fillStyle = C.bone; dot(c, cx, cy, 19);
    c.strokeStyle = "rgba(217,119,43,0.55)"; c.lineWidth = 1.2; ell(c, cx, cy, 21.5, 21.5); c.stroke();
  }
  /* a note of the song (bone, tinted in play) */
  function drawNote(c, w, h) {
    c.lineCap = "round"; c.lineJoin = "round";
    c.strokeStyle = C.glaze; c.lineWidth = 6; line(c, 12.5, 22, 12.5, 4.5);
    c.beginPath(); c.moveTo(12.5, 4.5); c.quadraticCurveTo(19.5, 9, 18.5, 16.5); c.stroke();
    c.fillStyle = C.glaze; ell(c, 7.6, 23, 7.4, 5.8, -0.45); c.fill();
    c.strokeStyle = C.bone; c.lineWidth = 2.6; line(c, 12.5, 22, 12.5, 4.5);
    c.beginPath(); c.moveTo(12.5, 4.5); c.quadraticCurveTo(19.5, 9, 18.5, 16.5); c.stroke();
    c.fillStyle = C.bone; ell(c, 7.6, 23, 5.4, 4, -0.45); c.fill();
  }
  /* the boatswain's drum, from above: terracotta rim, laced cords, a bone skin with an ochre rosette */
  function drawDrum(c, w, h) {
    var cx = w / 2, cy = h / 2, i, a;
    c.fillStyle = C.glaze; dot(c, cx, cy, 33);
    c.fillStyle = C.terra; dot(c, cx, cy, 31);
    c.strokeStyle = C.bone; c.lineWidth = 1.8; c.beginPath();
    for (i = 0; i <= 32; i++) { a = i / 32 * TAU; var rr = i % 2 ? 29.5 : 24.5; c[i ? "lineTo" : "moveTo"](cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
    c.stroke();
    c.fillStyle = C.glaze; dot(c, cx, cy, 23.5);
    var g = c.createRadialGradient(cx - 5, cy - 6, 2, cx, cy, 22);
    g.addColorStop(0, "#fbf5e6"); g.addColorStop(1, "#d8c8a0");
    c.fillStyle = g; dot(c, cx, cy, 22);
    c.fillStyle = "rgba(232,176,74,0.55)";
    for (i = 0; i < 8; i++) { a = i / 8 * TAU; ell(c, cx + Math.cos(a) * 15, cy + Math.sin(a) * 15, 3.4, 1.8, a); c.fill(); }
  }
  /* the beat marks: a beat (ochre), an off-beat (sea-foam, smaller), a double stroke (the vases' red) */
  function drawMark(kind) {
    return function (c, w, h) {
      var cx = w / 2, cy = h / 2, r = kind === "off" ? 10.5 : 13.5;
      c.fillStyle = C.glaze; dot(c, cx, cy, r + 1.8);
      c.fillStyle = kind === "off" ? C.foam : kind === "dbl" ? "#b8321e" : C.ochre; dot(c, cx, cy, r);
      c.fillStyle = kind === "dbl" ? C.bone : "rgba(255,250,235,0.75)";
      if (kind === "dbl") dot(c, cx, cy, r * 0.32); else dot(c, cx - r * 0.3, cy - r * 0.3, r * 0.28);
    };
  }
  /* the Greek-key band (one unit; it tiles across) */
  function drawKey(c, w, h) {
    c.fillStyle = C.glaze; c.fillRect(0, 0, w, h);
    c.strokeStyle = C.ochre; c.lineWidth = 2; c.lineCap = "square"; c.lineJoin = "miter";
    keyUnit(c, 0, 2, w);
  }
  /* the vase panel, top left: Odysseus at the mast, black figure on the red clay, a meander above */
  var PAN_W = 160, PAN_H = 184, ROPE_Y0 = 50, ROPE_Y1 = 132;
  function drawPanel(c, w, h) {
    var rad = 10, mx = w / 2, x;
    function rr() { c.beginPath(); c.moveTo(rad, 0); c.lineTo(w - rad, 0); c.quadraticCurveTo(w, 0, w, rad); c.lineTo(w, h - rad); c.quadraticCurveTo(w, h, w - rad, h); c.lineTo(rad, h); c.quadraticCurveTo(0, h, 0, h - rad); c.lineTo(0, rad); c.quadraticCurveTo(0, 0, rad, 0); c.closePath(); }
    c.save(); rr(); c.clip();
    var g = c.createRadialGradient(mx, h * 0.45, 10, mx, h * 0.45, w * 0.85);
    g.addColorStop(0, "#ea9550"); g.addColorStop(1, "#b85a22");
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = C.glaze; c.fillRect(0, 0, w, 19); c.fillRect(0, h - 30, w, 30);
    c.strokeStyle = C.terra; c.lineWidth = 1.8; c.lineCap = "square";
    for (x = 2; x < w; x += 18) keyUnit(c, x, 4, 18);
    c.fillStyle = C.glaze; c.fillRect(0, 22, w, 1.6); c.fillRect(0, h - 33, w, 1.6);
    /* the mast and its yard with the furled sail */
    c.fillRect(mx - 3.5, 30, 7, h - 66);
    c.fillRect(20, 37, w - 40, 4);
    c.fillStyle = C.bone; c.fillRect(24, 32, w - 48, 6);
    c.strokeStyle = C.glaze; c.lineWidth = 1; c.strokeRect(24, 32, w - 48, 6);
    c.fillStyle = C.terra; for (x = 32; x < w - 26; x += 14) c.fillRect(x, 32, 2, 6);
    /* the sea at the foot of the picture: black waves */
    c.strokeStyle = C.glaze; c.lineWidth = 2.2;
    for (x = 4; x < w; x += 20) { c.beginPath(); c.arc(x + 8, h - 38, 6, Math.PI, Math.PI * 1.9); c.stroke(); }
    c.restore();
    c.strokeStyle = C.glaze; c.lineWidth = 3; rr(); c.stroke();
  }
  /* Odysseus in black figure, facing left (toward the Sirens), arms bound behind him; feet at the bottom */
  var HERO_W = 64, HERO_H = 124;
  function drawHero(c, w, h) {
    var cx = w / 2, i;
    c.lineJoin = "round"; c.lineCap = "round";
    c.fillStyle = C.glaze; c.strokeStyle = C.glaze;
    c.lineWidth = 6; line(c, cx - 5, 88, cx - 7, h - 8); line(c, cx + 5, 88, cx + 4, h - 8);
    ell(c, cx - 10, h - 6, 6, 3); c.fill(); ell(c, cx + 1, h - 6, 6, 3); c.fill();
    poly(c, [[cx - 13, 36], [cx + 12, 36], [cx + 15, 90], [cx - 16, 90]]); c.fill();
    ell(c, cx, 38, 15, 7); c.fill();
    c.fillRect(cx - 4, 25, 8, 13);
    ell(c, cx + 1, 18, 9.5, 10.5); c.fill();
    poly(c, [[cx - 8, 14], [cx - 13, 21], [cx - 7, 22]]); c.fill();
    poly(c, [[cx - 8, 23], [cx - 12, 33], [cx - 1, 35], [cx + 5, 26]]); c.fill();
    /* details scratched through to the clay: the folds, a dotted hem, the curls, the beard */
    c.strokeStyle = C.terra; c.lineWidth = 1;
    [-8, -3, 2, 7].forEach(function (dx) { line(c, cx + dx, 48, cx + dx * 1.15, 84); });
    c.fillStyle = C.terra; for (i = -12; i <= 12; i += 4) dot(c, cx + i, 86, 1);
    c.beginPath(); c.arc(cx + 5, 16, 4.5, -1.6, 1.4); c.stroke();
    c.beginPath(); c.arc(cx + 6, 22, 3.5, -1.2, 1.6); c.stroke();
    line(c, cx - 9, 27, cx - 5, 32); line(c, cx - 5, 26, cx - 2, 31);
    c.strokeStyle = C.ochre; c.lineWidth = 1.6; c.beginPath(); c.arc(cx + 1, 18, 9.6, Math.PI * 1.08, Math.PI * 1.78); c.stroke();
    /* the eye, and his mouth open: he is calling to be set free */
    c.fillStyle = C.bone; ell(c, cx - 4, 16.5, 2.5, 1.4); c.fill();
    c.fillStyle = C.glaze; dot(c, cx - 4.7, 16.5, 0.95);
    c.strokeStyle = C.bone; c.lineWidth = 1; line(c, cx - 9.5, 23.6, cx - 6, 24.4);
  }
  function rowArt(scene) {
    canvasTex(scene, "md-row-water", 256, 256, L.drawStraitWater);
    canvasTex(scene, "md-row-coast", CO_W, CO_H, drawCoast);
    canvasTex(scene, "md-row-reef", RF_W, RF_H, drawReef);
    canvasTex(scene, "md-row-ship", SW, SH, drawShip);
    canvasTex(scene, "md-row-oar", 64, 12, drawOar);
    canvasTex(scene, "md-row-siren-0", SIR_W, SIR_H, drawSiren(0));
    canvasTex(scene, "md-row-siren-1", SIR_W, SIR_H, drawSiren(1));
    canvasTex(scene, "md-row-post", 30, 30, drawPost);
    canvasTex(scene, "md-row-plaque", 56, 56, drawPlaque);
    canvasTex(scene, "md-row-note", 22, 30, drawNote);
    canvasTex(scene, "md-row-drum", 68, 68, drawDrum);
    canvasTex(scene, "md-row-mark-beat", 32, 32, drawMark("beat"));
    canvasTex(scene, "md-row-mark-off", 26, 26, drawMark("off"));
    canvasTex(scene, "md-row-mark-dbl", 32, 32, drawMark("dbl"));
    canvasTex(scene, "md-row-key", 24, 16, drawKey);
    canvasTex(scene, "md-row-panel", PAN_W, PAN_H, drawPanel);
    canvasTex(scene, "md-row-hero", HERO_W, HERO_H, drawHero);
  }
  function eo(u) { return 1 - (1 - u) * (1 - u); }
  function eio(u) { return u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u); }
  function wallNow() { return (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now(); }

  M.extend("row", {
    name: "Row Past the Sirens", kind: "rhythm level", level: "rhythm level", act: "ROW",
    how: "Odysseus's ship rows past the Sirens' island. The crew's ears are stopped with beeswax, and Odysseus is tied to the mast: he hears the song but cannot go to it. The boatswain beats the drum, and marks slide along the band at the bottom toward the drum in the middle — row each time they meet it. Good strokes give the ship speed and full steering. A missed or mistimed stroke slows it, and the Sirens' song pulls it toward their rocks. Between verses, a line of marker posts crosses the channel with one passage for each letter: steer through the passage with the right answer.",
    rules: "Steering through a wrong letter's passage costs a life. So does running onto the Sirens' rocks. Each miss in a row snaps one of the ropes that hold Odysseus (top left); when the last rope snaps he breaks free, and that costs a life too. A good stroke ties the ropes again.",
    keys: "Space, the ROW button, or a click or tap: row (on the drum beat) · ◀ ▶, A / D or the on-screen pad: steer.",
    tip: "ROW PAST THE SIRENS — row (Space or ROW) when the marks meet the drum, and steer ◀ ▶ through the passage with the right letter.",
    hint1: "Row on the beat and steer through the passage marked with the right letter. The passage stays in the side panel.",
    hint2: "This question has two right letters. Steer through both passages that carry them.",
    news: ["",
      "The Sirens' song swells now and then: when the sea turns wine-dark and the song glows gold, it pulls much harder. Keep rowing on the beat and steer away from the rocks.",
      "Off-beat strokes: a small pale-blue mark comes between two beats. Row on the mark, not on the beat.",
      "A reef closes in from the right: the channel and its passages are narrower.",
      "Double strokes: two red marks close together. Row twice, quickly.",
      "Odysseus strains harder: three misses in a row now set him free. Watch for pale-blue off-beat marks (between the beats) and red double strokes (two marks close together).",
      "The marker posts drift with the current, so the passages change width.",
      "Rests: now and then the drummer skips a beat. Don't row where there is no mark. The marker posts drift, too.",
      "The Sirens' song swells more often, and pulls harder.",
      "Ithaca is close: the drum beats faster, on top of everything else."],
    params: rowParams
  }, {
    rowParams: function (n) { return rowParams(n); },

    setup_row: function () {
      var self = this, i;
      rowArt(this);
      var P = rowParams(this.night);
      var R = this.rw = { P: P, clock: 0, t: 0, trav: 0, dist: 0, mom: 0.5, kx: 0, missRun: 0, hitRun: 0, perfRun: 0,
        notes: [], presses: [], countIn: [], liveFrom: Infinity, genT: Infinity, bd: 60000 / P.bpm, catchW: P.goodW + 140, lastPress: -1e9,
        plainLeft: 0, firstPending: false, rows: [], dead: [], pool: { post: [], plaque: [], letter: [], mark: [], beat: [], off: [], dbl: [] },
        splashes: [], song: { state: "calm", t: 0, cd: P.swellEvery * 0.8 }, songWk: 0, noteCd: 400, flying: [],
        oarT: -1e9, oarAmp: 0.8, rag: [], ragMs: 0, fbMs: 0, countMs: 0, burstMs: 0, burstCol: 0xffd36a, drumK: 0, lean: 0, freeMs: 0,
        sirenMs: 0, sirenFrame: 0, ropesShown: -1, told: {}, auto: false, stats: { perfect: 0, good: 0, miss: 0, off: 0, breaks: 0, rocks: 0, presses: 0 } };
      for (i = 0; i < 10; i++) R.rag.push(0);
      this.cameras.main.setBackgroundColor(ST.deep);
      R.water = this.add.tileSprite(0, 0, this.W, this.H, "md-row-water").setOrigin(0, 0).setDepth(0);
      R.tint = this.add.graphics().setDepth(1).setAlpha(0);
      R.coast = this.add.tileSprite(0, 0, CO_W, this.H, "md-row-coast").setOrigin(0, 0).setDepth(3);
      R.reef = this.add.tileSprite(0, 0, RF_W, this.H, "md-row-reef").setOrigin(0, 0).setDepth(3);
      R.sirens = [];
      for (i = 0; i < 4; i++) R.sirens.push({ rock: i % 2, inst: i < 2 ? 0 : 1, spr: this.add.image(-200, -200, "md-row-siren-0").setOrigin(0.5, 1).setDepth(4).setVisible(false) });
      R.lowG = this.add.graphics().setDepth(7);
      R.songG = this.add.graphics().setDepth(8);
      for (i = 0; i < 14; i++) R.flying.push({ on: false, spr: this.add.image(-99, -99, "md-row-note").setDepth(8).setVisible(false) });
      R.songLabel = this.add.text(0, 0, "", { fontFamily: SERIF, fontSize: 16, color: "#efe6d2", fontStyle: "bold", stroke: "#3a0f2a", strokeThickness: 6, align: "center" }).setOrigin(0.5, 0).setDepth(39);
      R.ship = { x: 0, y: 0 };
      R.oars = [];
      for (i = 0; i < 10; i++) R.oars.push(this.add.image(0, 0, "md-row-oar").setOrigin(2 / 64, 0.5).setDepth(18));
      R.shipSpr = this.add.image(0, 0, "md-row-ship").setDepth(19);
      R.laneG = this.add.graphics().setDepth(30);
      R.keyT = this.add.tileSprite(0, 0, 24, 16, "md-row-key").setOrigin(0, 0).setDepth(31);
      R.keyB = this.add.tileSprite(0, 0, 24, 16, "md-row-key").setOrigin(0, 0).setDepth(31);
      R.ringG = this.add.graphics().setDepth(33);
      R.drum = this.add.image(0, 0, "md-row-drum").setDepth(34);
      R.drumTxt = this.add.text(0, 0, "ROW", { fontFamily: SERIF, fontSize: 14, color: "#140c0a", fontStyle: "bold" }).setOrigin(0.5).setDepth(35);
      var fbStyle = { fontFamily: SERIF, fontSize: 30, color: "#ffd36a", fontStyle: "bold", stroke: "#140c0a", strokeThickness: 7 };
      R.fb = this.add.text(0, 0, "", fbStyle).setOrigin(0.5).setDepth(36).setAlpha(0);
      R.fb2 = this.add.text(0, 0, "", { fontFamily: SERIF, fontSize: 15, color: "#efe6d2", fontStyle: "bold", stroke: "#140c0a", strokeThickness: 5 }).setOrigin(0.5).setDepth(36).setAlpha(0);
      R.combo = this.add.text(0, 0, "", { fontFamily: SERIF, fontSize: 16, color: "#e8b04a", fontStyle: "bold", stroke: "#140c0a", strokeThickness: 5 }).setOrigin(0, 0.5).setDepth(36);
      R.countTxt = this.add.text(0, 0, "", { fontFamily: SERIF, fontSize: 44, color: "#efe6d2", fontStyle: "bold", stroke: "#140c0a", strokeThickness: 8 }).setOrigin(0.5).setDepth(37).setAlpha(0);
      R.panel = this.add.image(0, 0, "md-row-panel").setOrigin(0, 0).setDepth(40);
      R.hero = this.add.image(0, 0, "md-row-hero").setOrigin(0.5, 1).setDepth(41);
      R.ropeG = this.add.graphics().setDepth(42);
      R.ropeTxt = this.add.text(0, 0, "", { fontFamily: SERIF, fontSize: 13, color: "#efe6d2", fontStyle: "bold" }).setOrigin(0.5).setDepth(43);
      this.rowLayout();
      R.ship.x = R.chanL + (R.chanR - R.chanL) * 0.5;
      this.makeSol(R.ship.x, R.ship.y, "up").setVisible(false);   /* Odysseus rows; the sprite stays for coin pop-ups */
      this.rowPanel(0, 0);   /* the ropes show under the reading card too */
      /* strokes: Space, a click or tap anywhere on the sea, or the ROW button — timed by the event itself */
      var onKey = function (e) { if (e && e.repeat) return; self.rowOnPress(e && e.timeStamp); };
      var onPtr = function (p) { self.rowOnPress(p && p.event && p.event.timeStamp); };
      var act = document.getElementById("btn-action");
      var onAct = function (e) { self.rowOnPress(e && e.timeStamp); };
      this.input.keyboard.on("keydown-SPACE", onKey);
      this.input.on("pointerdown", onPtr);
      if (act) act.addEventListener("pointerdown", onAct);
      var off = function () {
        try { self.input.keyboard.off("keydown-SPACE", onKey); self.input.off("pointerdown", onPtr); } catch (e) {}
        if (act) act.removeEventListener("pointerdown", onAct);
      };
      this.events.once("shutdown", off);
      this.events.once("destroy", off);
    },

    rowLayout: function () {
      var R = this.rw, P = R.P, W = this.W, H = this.H, y, mx = 0;
      R.k = clamp(H / 768, 0.72, 1.15);
      R.sx = clamp(W / 1026, 0.6, 1.3);
      R.coastW = clamp(Math.round(W * 0.19), 120, 240); R.cs = R.coastW / CO_W;
      for (y = 0; y < CO_H; y += 4) mx = Math.max(mx, coastEdge(y));
      R.edgeMax = mx * R.cs;
      R.chanL = R.edgeMax + 4;
      R.chanR = R.chanL + (W - 6 - R.chanL) * P.chanFrac;
      R.water.setSize(W, H);
      R.tint.clear(); R.tint.fillStyle(0x3a0f2a, 1); R.tint.fillRect(0, 0, W, H);
      R.coast.setSize(R.coastW, H).setTileScale(R.cs, R.cs);
      var rx = R.chanR - 12;
      R.reef.setPosition(rx, 0).setSize(Math.max(8, W - rx), H);
      /* the drum band, between the on-screen pad (bottom left) and the ROW button (bottom right) */
      R.laneH = Math.round(74 * R.k); R.laneT = H - 12 - R.laneH;
      var l0 = 188, r0 = W - 110;
      if (r0 - l0 < 320) { l0 = 12; r0 = W - 12; }
      R.laneL = l0; R.laneR = r0; R.drumX = Math.round((l0 + r0) / 2); R.drumY = R.laneT + R.laneH / 2;
      R.half = Math.min(R.drumX - l0, r0 - R.drumX) - 20;
      var g = R.laneG, kh = Math.round(16 * R.k);
      g.clear();
      g.fillStyle(0x000000, 0.35); g.fillRoundedRect(l0 + 3, R.laneT + 4, r0 - l0, R.laneH, 10);
      g.fillStyle(0x140c0a, 0.96); g.fillRoundedRect(l0, R.laneT, r0 - l0, R.laneH, 10);
      g.fillStyle(0x2a140c, 1); g.fillRect(l0 + 6, R.laneT + kh + 5, r0 - l0 - 12, R.laneH - 2 * kh - 10);
      g.lineStyle(2, 0xe8b04a, 0.9); g.strokeRoundedRect(l0, R.laneT, r0 - l0, R.laneH, 10);
      g.lineStyle(1, 0xe8b04a, 0.5); g.lineBetween(l0 + 6, R.laneT + kh + 5, r0 - 6, R.laneT + kh + 5); g.lineBetween(l0 + 6, R.laneT + R.laneH - kh - 5, r0 - 6, R.laneT + R.laneH - kh - 5);
      R.keyT.setPosition(l0 + 8, R.laneT + 3).setSize(r0 - l0 - 16, kh).setTileScale(R.k, R.k);
      R.keyB.setPosition(l0 + 8, R.laneT + R.laneH - 3 - kh).setSize(r0 - l0 - 16, kh).setTileScale(R.k, R.k);
      R.drumS = R.laneH * 1.02 / 68;
      R.drum.setPosition(R.drumX, R.drumY).setScale(R.drumS);
      R.drumTxt.setPosition(R.drumX, R.drumY).setFontSize(Math.round(14 * R.k));
      R.fb.setPosition(R.drumX, R.laneT - 30 * R.k).setFontSize(Math.round(30 * R.k));
      R.fb2.setPosition(R.drumX, R.laneT - 9 * R.k).setFontSize(Math.round(15 * R.k));
      R.combo.setPosition(R.drumX + 84 * R.k, R.laneT - 28 * R.k).setFontSize(Math.round(17 * R.k));
      R.countTxt.setPosition(R.drumX, R.laneT - 34 * R.k).setFontSize(Math.round(44 * R.k));
      /* the ship sits just above the band */
      R.shipS = clamp(H / 768 * 0.82, 0.56, 0.95);
      R.ship.y = R.laneT - 50 * R.k - SH * R.shipS / 2;
      R.hull = 15 * R.shipS;
      R.shipSpr.setScale(R.shipS);
      R.oars.forEach(function (o) { o.setScale(R.shipS); });
      /* the vase panel over the meadow, top left */
      R.ins = clamp(Math.min((R.coastW - 12) / PAN_W, H / 820), 0.6, 1);
      R.panel.setPosition(8, 8).setScale(R.ins);
      R.heroX = 8 + PAN_W / 2 * R.ins; R.heroY = 8 + (PAN_H - 36) * R.ins;
      R.hero.setScale(R.ins).setPosition(R.heroX, R.heroY);
      R.ropeTxt.setPosition(8 + PAN_W / 2 * R.ins, 8 + (PAN_H - 15) * R.ins).setFontSize(Math.max(11, Math.round(13 * R.ins)));
      R.ropesShown = -1;
      /* the song's words on the meadow under the panel, where the marker posts never pass */
      R.songLabel.setPosition(8 + PAN_W / 2 * R.ins, 8 + PAN_H * R.ins + 10).setFontSize(Math.round(16 * R.k)).setWordWrapWidth(Math.max(110, R.coastW - 14));
      R.sirS = clamp(R.cs * 1.1, 0.6, 1.05);
      R.sirens.forEach(function (sr) { sr.spr.setScale(R.sirS); });
      R.flying.forEach(function (f) { f.spr.setScale(R.k); });
    },
    resize_row: function (oldW, oldH) {
      var R = this.rw, fx = this.W / (oldW || this.W), fy = this.H / (oldH || this.H);
      this.rowLayout();
      R.ship.x = clamp(R.ship.x * fx, R.chanL, R.chanR - R.hull - 4);
      R.rows.forEach(function (r) { r.y *= fy; });
    },

    /* ── the beat ── */
    /* a stroke happened at wall time ts (the input event's own time stamp) */
    rowOnPress: function (ts) {
      var R = this.rw, now = wallNow();
      if (!R || this.ended || this._finishing || this.readOpen || this.helpOpen || this._tabHidden) return;
      if (Date.now() < (this.tutLockUntil || 0)) return;
      if (!(ts > 0) || ts > now + 1 || now - ts > 400) ts = now;
      R.presses.push(ts);
    },
    /* a new count-in (3, 2, 1, ROW!) delay ms from now; the first bar after it is plain beats */
    rowRestart: function (delay) {
      var R = this.rw, P = R.P, self = this;
      R.notes.forEach(function (nt) { self.rowFreeNote(nt); });
      R.notes = [];
      R.bd = 60000 / P.bpm; R.catchW = P.goodW + 140; R.lead = R.bd * 4;
      var t0 = R.clock + (delay || 0);
      R.countIn = [{ t: t0, txt: "3" }, { t: t0 + R.bd, txt: "2" }, { t: t0 + 2 * R.bd, txt: "1" }];
      R.liveFrom = t0 + 3 * R.bd - R.catchW;
      R.genT = t0 + 3 * R.bd; R.plainLeft = 1; R.firstPending = true;
      R.missRun = 0; R.lastPress = -1e9;
    },
    /* no beat at all (between questions, and in the tests) */
    rowStop: function () {
      var R = this.rw, self = this;
      R.notes.forEach(function (nt) { self.rowFreeNote(nt); });
      R.notes = []; R.countIn = []; R.liveFrom = Infinity; R.genT = Infinity; R.missRun = 0;
    },
    /* one bar of four beats from time t0: plain beats, with an off-beat, a double stroke or a rest as the level allows */
    rowMeasure: function (t0) {
      var R = this.rw, P = R.P, self = this, list = [{ b: 0, kind: "beat" }, { b: 1, kind: "beat" }, { b: 2, kind: "beat" }, { b: 3, kind: "beat" }];
      var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
      if (R.plainLeft > 0) R.plainLeft -= 1;
      else {
        if (P.restP && Math.random() < P.restP) list.splice(1 + Math.floor(Math.random() * 3), 1);
        if (P.offP && Math.random() < P.offP) {
          var c1 = list.filter(function (x) { return x.b > 0; });
          if (c1.length) { var o = pick(c1); o.b += 0.5; o.kind = "off"; }
        }
        if (P.dblP && Math.random() < P.dblP) {
          var c2 = list.filter(function (x) { return x.kind === "beat" && !list.some(function (y) { return y.b === x.b + 0.5; }); });
          if (c2.length) { var d = pick(c2); d.kind = "dbl"; list.push({ b: d.b + 0.5, kind: "dbl" }); }
        }
        list.sort(function (a, b) { return a.b - b.b; });
      }
      list.forEach(function (x) {
        var nt = { t: t0 + x.b * R.bd, kind: x.kind, judged: false, sounded: false, res: null, fade: 1, first: false };
        if (R.firstPending) { nt.first = true; R.firstPending = false; }
        nt.mL = self.rowMarkGet(x.kind); nt.mR = self.rowMarkGet(x.kind);
        R.notes.push(nt);
      });
    },
    rowMarkGet: function (kind) {
      var R = this.rw, p = R.pool[kind], m = p.length ? p.pop() : this.add.image(-99, -99, "md-row-mark-" + kind).setDepth(32);
      return m.setVisible(false).setAlpha(1).setScale(R.k);
    },
    rowFreeNote: function (nt) {
      var R = this.rw;
      [nt.mL, nt.mR].forEach(function (m) { if (m) { m.setVisible(false); R.pool[nt.kind].push(m); } });
      nt.mL = nt.mR = null;
    },
    /* the drum: generate bars ahead, count in, sound every stroke, and a stroke let pass is a miss */
    rowBeats: function () {
      var R = this.rw, i, nt;
      while (R.genT < R.clock + R.lead + R.bd * 4) { this.rowMeasure(R.genT); R.genT += R.bd * 4; }
      for (i = 0; i < R.countIn.length; i++) {
        var ci = R.countIn[i];
        if (!ci.done && R.clock >= ci.t) { ci.done = true; this.rowCount(ci.txt); this.rowSnd("drum"); R.drumK = 1; }
      }
      var list = R.notes;
      for (i = 0; i < list.length; i++) {
        nt = list[i];
        if (!nt.sounded && R.clock >= nt.t) {
          nt.sounded = true; R.drumK = 1;
          this.rowSnd(nt.first ? "drumHi" : "drum");
          if (nt.first) { this.rowCount("ROW!"); if (!R.told.start) { R.told.start = true; this.toast("Row on the drum: press Space (or ROW, or click) each time the marks meet the drum.", 4200); } }
        }
        if (!nt.judged && R.clock - nt.t > R.catchW) {
          nt.judged = true; nt.res = "miss";
          this.rowJudge("miss", "MISSED BEAT", nt, false);
          if (this._finishing || R.notes !== list) return;
        }
      }
      /* drop marks that are done */
      for (i = R.notes.length - 1; i >= 0; i--) {
        nt = R.notes[i];
        if (nt.judged && (nt.res !== "miss" || nt.fade <= 0)) { this.rowFreeNote(nt); R.notes.splice(i, 1); }
      }
    },
    /* a stroke at song time t: the nearest mark decides PERFECT, GOOD or MISS (early / late); none near = off the beat */
    rowPress: function (t) {
      var R = this.rw, P = R.P, best = null, bd = 1e9;
      if (t == null) t = R.clock;
      if (t < R.liveFrom) return null;
      if (t - R.lastPress < 90) return null;
      R.lastPress = t; R.stats.presses += 1;
      R.notes.forEach(function (nt) { if (nt.judged) return; var d = Math.abs(t - nt.t); if (d < bd) { bd = d; best = nt; } });
      if (best && bd <= R.catchW) {
        var err = t - best.t, a = Math.abs(err), g = a <= P.perfectW ? "perfect" : a <= P.goodW ? "good" : "miss";
        best.judged = true; best.res = g;
        this.rowJudge(g, g === "miss" ? (err < 0 ? "TOO EARLY" : "TOO LATE") : (g === "good" ? (err < 0 ? "a little early" : "a little late") : ""), best, true);
        return g;
      }
      R.stats.off += 1;
      this.rowJudge("miss", "OFF THE BEAT", null, true);
      return "off";
    },
    rowJudge: function (g, why, nt, pressed) {
      var R = this.rw, P = R.P, i;
      R.stats[g] += 1;
      if (g === "miss") {
        R.mom = Math.max(0, R.mom - 0.18);
        R.missRun += 1; R.hitRun = 0; R.perfRun = 0;
        R.kx -= P.tug * R.sx;
        for (i = 0; i < 10; i++) R.rag[i] = rnd(-0.5, 0.5);
        R.ragMs = 700;
        if (pressed) { R.oarT = R.clock; R.oarAmp = 0.45; }
        this.rowFeedback("MISS", "#ff8a6a", why);
        this.rowSnd("miss");
        if (R.missRun >= P.breakAt) { this.rowBreakFree(); return; }
        if (!R.told.miss) { R.told.miss = true; this.toast("A miss snaps one of the ropes that hold Odysseus (top left). " + P.breakAt + " misses in a row and he breaks free!", 4400); }
      } else {
        var pf = g === "perfect";
        R.mom = Math.min(1, R.mom + (pf ? 0.2 : 0.12));
        R.missRun = 0; R.hitRun += 1; R.perfRun = pf ? R.perfRun + 1 : 0;
        R.oarT = R.clock; R.oarAmp = pf ? 1 : 0.8; R.ragMs = 0;
        R.burstMs = 320; R.burstCol = pf ? 0xffd36a : 0x9fd3d6;
        this.rowFeedback(pf ? "PERFECT!" : "GOOD", pf ? "#ffd36a" : "#9fd3d6", why);
        this.rowSnd(g);
        this.scoreJuice = (this.scoreJuice || 0) + (pf ? 60 : 30);
        if (R.perfRun && R.perfRun % 16 === 0) this.awardBonusPoints(1500, "Sixteen perfect strokes in a row!");
        else if (this.checkOneUp) this.checkOneUp();
        this.rowSplash();
      }
    },
    /* the rhythm fell apart: Odysseus breaks free; the crew ties him again and the drum counts in */
    rowBreakFree: function () {
      var R = this.rw;
      R.stats.breaks += 1; R.missRun = 0; R.freeMs = 1300;
      this.rowSnd("snap");
      this.loseLife("hit", "ODYSSEUS BROKE FREE");
      if (this._finishing) return;
      if (!R.told.free) { R.told.free = true; this.toast("Odysseus broke free and begged to sail to the Sirens! Perimedes and Eurylochus tie him to the mast again, tighter. Find the beat.", 4800); }
      R.mom = Math.max(R.mom, 0.45);
      this.rowRestart(R.bd * 1.2);
    },
    /* the song dragged the ship onto the Sirens' rocks */
    rowRocks: function (x, y) {
      var R = this.rw;
      R.stats.rocks += 1;
      this.burst(x, y, 0x9fd3d6, 18);
      snd("rock");
      var lost = this.loseLife("hit", "THE SIRENS' ROCKS");
      R.kx = 560 * R.sx;
      if (this._finishing) return;
      if (lost) {
        if (!R.told.rocks) { R.told.rocks = true; this.toast("The song pulled the ship onto the Sirens' rocks! The crew pushes off. Find the beat, and row hard to steer clear.", 4600); }
        R.mom = Math.max(R.mom, 0.45);
        this.rowRestart(R.bd * 1.2);
      }
    },
    rowFeedback: function (text, color, sub) {
      var R = this.rw;
      R.fb.setText(text).setColor(color); R.fb2.setText(sub || "");
      R.fbMs = 700; R.countMs = 0;   /* the word for the stroke replaces "ROW!" */
    },
    rowCount: function (txt) {
      var R = this.rw;
      R.countTxt.setText(txt).setColor(txt === "ROW!" ? "#ffd36a" : "#efe6d2");
      R.countMs = txt === "ROW!" ? 800 : 600;
    },
    rowSnd: function (name) {
      var Rm = window.SolRealms;
      if (!Rm || !Rm.blip) return;
      try {
        if (name === "drum") { Rm.blip(160, 70, 0.16, "triangle", 0.07); Rm.hiss(0.04, 900, 0.025); }
        else if (name === "drumHi") { Rm.blip(200, 80, 0.2, "triangle", 0.09); Rm.hiss(0.05, 1100, 0.03); }
        else if (name === "perfect") { Rm.hiss(0.16, 1500, 0.03); Rm.blip(784, 1046, 0.09, "triangle", 0.02); }
        else if (name === "good") { Rm.hiss(0.14, 1100, 0.028); Rm.blip(587, 660, 0.07, "triangle", 0.014); }
        else if (name === "miss") Rm.blip(190, 120, 0.12, "square", 0.014);
        else if (name === "song") { Rm.blip(659, 659, 0.55, "sine", 0.016); Rm.blip(880, 830, 0.6, "sine", 0.013, 0.28); Rm.blip(784, 698, 0.8, "sine", 0.013, 0.6); }
        else if (name === "snap") { Rm.hiss(0.09, 2600, 0.05); Rm.blip(420, 90, 0.2, "sawtooth", 0.016); }
      } catch (e) {}
    },

    /* ── the marker posts ── */
    rowGet: function (kind) {
      var R = this.rw, p = R.pool[kind];
      if (p.length) return p.pop().setVisible(true);
      if (kind === "post") return this.add.image(-99, -99, "md-row-post").setDepth(9);
      if (kind === "plaque") return this.add.image(-99, -99, "md-row-plaque").setDepth(10);
      if (kind === "letter") return this.add.text(-99, -99, "", { fontFamily: SERIF, fontSize: 28, color: "#140c0a", fontStyle: "bold" }).setOrigin(0.5).setDepth(11);
      return this.add.text(-99, -99, "", { fontFamily: SERIF, fontSize: 40, color: "#b8321e", fontStyle: "bold" }).setOrigin(0.5).setDepth(12);
    },
    rowPut: function (kind, o) { if (o) { o.setVisible(false); this.rw.pool[kind].push(o); } },
    /* a line of marker posts at height y with one passage per letter, in this order */
    rowMakeRow: function (letters, y) {
      var R = this.rw, self = this, j, row = { y: y, k: letters.length, gates: [], posts: [], ph: [], b: [], done: false, rel: null, cut: -1 };
      for (j = 0; j <= row.k; j++) { row.posts.push(this.rowGet("post").setScale(R.k * 0.95)); row.ph.push(rnd(0, TAU)); }
      letters.forEach(function (L2) {
        var g = { letter: L2, state: "live", x: 0, plaque: self.rowGet("plaque").setScale(R.k * 0.92), txt: self.rowGet("letter"), mk: self.rowGet("mark") };
        g.txt.setText(L2).setFontSize(Math.round(28 * R.k));
        self.rowPaint(g, R.dead.indexOf(L2) !== -1 ? "wrong" : self.extracted.indexOf(L2) !== -1 ? "right" : "live");
        row.gates.push(g);
      });
      R.rows.push(row);
      this.rowPlaceRow(row);
      return row;
    },
    rowSpawnRow: function () {
      var R = this.rw, letters = this.choiceLetters();
      if (!letters.length) return null;
      var row = this.rowMakeRow(shuffle(letters.slice()), -60 * R.k);
      if (!R.told.row) { R.told.row = true; this.toast("Marker posts ahead! Steer ◀ ▶ through the passage with the right letter.", 4400); }
      return row;
    },
    rowPaint: function (g, state) {
      g.state = state;
      var k = this.rw.k;
      /* a crossed-out letter stays readable under a see-through red cross; a found one gets a green tick badge */
      if (state === "wrong") { g.plaque.setTint(0x9a9a9a); g.txt.setColor("#2a2a2a"); g.mk.setText("✕").setColor("#c0281a").setStroke("#c0281a", 0).setFontSize(Math.round(44 * k)).setAlpha(0.74).setVisible(true); }
      else if (state === "right") { g.plaque.setTint(0xbff0c8); g.txt.setColor("#1f6a3a"); g.mk.setText("✓").setColor("#1f6a3a").setStroke("#efe6d2", 5).setFontSize(Math.round(26 * k)).setAlpha(1).setVisible(true); }
      else { g.plaque.clearTint(); g.txt.setColor("#140c0a"); g.mk.setVisible(false); }
    },
    rowMarkLetter: function (L2, state) {
      var self = this;
      this.rw.rows.forEach(function (r) { r.gates.forEach(function (g) { if (g.letter === L2) self.rowPaint(g, state); }); });
    },
    rowKillRow: function (r) {
      var self = this;
      r.posts.forEach(function (p) { self.rowPut("post", p); });
      r.gates.forEach(function (g) { self.rowPut("plaque", g.plaque); self.rowPut("letter", g.txt); self.rowPut("mark", g.mk); });
      r.posts = []; r.gates = [];
    },
    /* where the posts stand now: evenly across the channel; from level 61 the inner ones drift */
    rowPlaceRow: function (row) {
      var R = this.rw, P = R.P, k = row.k, pw = (R.chanR - R.chanL) / Math.max(1, k), j, b = row.b;
      for (j = 0; j <= k; j++) b[j] = R.chanL + j * pw + (j > 0 && j < k && P.sway ? Math.sin(R.t * 1.2 + row.ph[j]) * P.sway * pw : 0);
      for (j = 0; j <= k; j++) row.posts[j].setPosition(b[j], row.y);
      row.gates.forEach(function (g, i) {
        g.x = (b[i] + b[i + 1]) / 2;
        g.plaque.setPosition(g.x, row.y); g.txt.setPosition(g.x, row.y);
        if (g.state === "right") g.mk.setPosition(g.x + 20 * R.k, row.y - 18 * R.k);
        else g.mk.setPosition(g.x, row.y);
      });
    },
    /* the ship's keel crossed passage g */
    rowThrough: function (g) {
      var R = this.rw, res = this.answerPick(g.letter, g.x, R.ship.y - 30);
      if (res === "wrong") { if (R.dead.indexOf(g.letter) === -1) R.dead.push(g.letter); this.rowMarkLetter(g.letter, "wrong"); }
      else if (res === "partial") this.rowMarkLetter(g.letter, "right");
      return res;
    },
    rowEdgeX: function (y) {
      var R = this.rw, ty = (((y - R.trav) / R.cs) % CO_H + CO_H) % CO_H;
      return coastEdge(ty) * R.cs;
    },
    rowSplash: function () {
      var R = this.rw, i, o;
      for (i = 0; i < R.oars.length; i++) {
        o = R.oars[i];
        var tip = { x: o.x + Math.cos(o.rotation) * (OAR_LEN - 4) * R.shipS, y: o.y + Math.sin(o.rotation) * (OAR_LEN - 4) * R.shipS };
        if (R.splashes.length >= 30) R.splashes.shift();
        R.splashes.push({ x: tip.x, y: tip.y, age: 0 });
      }
    },

    answers_row: function () {
      var R = this.rw, P = R.P, self = this;
      R.rows.forEach(function (r) { self.rowKillRow(r); });
      R.rows = []; R.dead = [];
      R.dist = P.rowGap - P.scroll * R.k * 0.75 * 1.3;   /* the first posts show up about a second into the rowing */
      this.rowRestart(450);
    },
    clear_row: function () {
      var R = this.rw, self = this;
      R.rows.forEach(function (r) { r.gates.forEach(function (g) { self.burst(g.x, r.y, 0xe8b04a, 6); }); self.rowKillRow(r); });
      R.rows = [];
      this.rowStop();
    },

    tick_row: function (s, inp, ms) {
      var R = this.rw, P = R.P, W = this.W, H = this.H, sh = R.ship, self = this, i, j, lg = R.lowG;
      var wall = wallNow();
      R.t += s; R.clock += ms;
      /* 1. strokes and the drum */
      if (R.presses.length) { var q = R.presses; R.presses = []; for (i = 0; i < q.length; i++) this.rowPress(R.clock - clamp(wall - q[i], 0, ms)); }
      if (R.auto) R.notes.slice().forEach(function (nt) { if (!nt.judged && nt.t <= R.clock && nt.t >= R.liveFrom) self.rowPress(nt.t); });
      if (this._finishing) return;
      this.rowBeats();
      if (this._finishing) return;
      R.mom = Math.max(0, R.mom - 0.05 * s);
      /* 2. up the channel: speed from the stroke */
      var v = P.scroll * (0.45 + 0.55 * R.mom) * R.k, dy = v * s;
      R.trav += dy;
      R.water.tilePositionY = -(R.trav % 256);
      R.coast.tilePositionY = -((R.trav / R.cs) % CO_H);
      R.reef.tilePositionY = -(R.trav % RF_H);
      /* 3. the song pulls toward the rocks (less with a strong stroke); steering is full only with one */
      var songK = this.rowSong(ms);
      var pullV = -P.pull * songK * (1 - 0.6 * R.mom) * R.sx;
      var steerV = inp.ax * 300 * R.sx * (0.3 + 0.7 * R.mom);
      sh.x = clamp(sh.x + (steerV + pullV + R.kx) * s, R.hull + 2, R.chanR - R.hull - 4);
      R.kx *= Math.pow(0.03, s);
      var tilt = clamp((steerV + pullV + R.kx) / 1700, -0.2, 0.2);
      /* the Sirens' rocks */
      var hullPts = [[-0.36, 0.55], [-0.1, 1], [0.2, 0.95], [0.4, 0.6]], hit = null;
      for (i = 0; i < hullPts.length && !hit; i++) {
        var hy = sh.y + hullPts[i][0] * SH * R.shipS, ex = this.rowEdgeX(hy) + 2;
        if (sh.x - R.hull * hullPts[i][1] < ex) hit = { x: ex, y: hy };
      }
      if (hit) {
        if (this.iframeMs > 0) { R.kx = Math.max(R.kx, 420 * R.sx); sh.x = Math.max(sh.x, hit.x + R.hull); }
        else { this.rowRocks(hit.x, hit.y); if (this._finishing) return; }
      }
      /* 4. the ship and its oars */
      R.shipSpr.setPosition(sh.x, sh.y).setRotation(tilt);
      this.blink(R.shipSpr);
      this.player.setPosition(sh.x, sh.y);
      R.ragMs = Math.max(0, R.ragMs - ms);
      var u = R.clock - R.oarT, drive = Math.min(0.42 * R.bd, 320), rec = Math.max(120, R.bd * 0.85 - drive);
      var ready = -0.45, fin = ready + 0.95 * R.oarAmp, base;
      if (u < drive) base = ready + (fin - ready) * eo(u / drive);
      else if (u < drive + rec) base = fin + (ready - fin) * eio((u - drive) / rec);
      else base = ready;
      var cs = Math.cos(tilt), sn = Math.sin(tilt), al = R.shipSpr.alpha;
      for (i = 0; i < 5; i++) {
        var oy = (OARS[i][1] - SH / 2) * R.shipS, a0 = base + R.rag[i] * (R.ragMs / 700) + 0.03 * Math.sin(R.t * 2 + i);
        for (j = 0; j < 2; j++) {
          var sd = j ? 1 : -1, ox = sd * OARS[i][0] * R.shipS, o = R.oars[i * 2 + j];
          var a = j ? a0 + R.rag[i + 5] * 0.3 * (R.ragMs / 700) : a0;
          o.setPosition(sh.x + ox * cs - oy * sn, sh.y + ox * sn + oy * cs).setRotation((j ? a : Math.PI - a) + tilt).setAlpha(al);
          if (R.burstMs > 200 && R.burstCol === 0xffd36a) o.setTint(0xffe7a0); else o.clearTint();
        }
      }
      /* the wake and the oars' splashes */
      lg.clear();
      var wa = 0.2 + 0.4 * R.mom;
      for (i = 0; i < 5; i++) {
        var wy = sh.y + SH * R.shipS * 0.47 + i * 11 + ((R.trav) % 11), ww = 6 + i * 5;
        lg.fillStyle(0xefe6d2, wa * (1 - i / 5)); lg.fillEllipse(sh.x - ww, wy, 7, 3); lg.fillEllipse(sh.x + ww, wy, 7, 3);
      }
      for (i = R.splashes.length - 1; i >= 0; i--) {
        var sp = R.splashes[i]; sp.age += ms; sp.y += dy;
        if (sp.age > 520) { R.splashes.splice(i, 1); continue; }
        var kk = sp.age / 520;
        lg.lineStyle(2, 0xefe6d2, 0.8 * (1 - kk)); lg.strokeEllipse(sp.x, sp.y, (6 + 16 * kk) * R.k, (4 + 9 * kk) * R.k);
      }
      /* 5. the Sirens and their song */
      this.rowSirens(ms);
      /* 6. the marker posts come down the channel */
      R.dist += dy;
      if (!this._between && R.dist >= P.rowGap) { R.dist = 0; this.rowSpawnRow(); }
      var rows = R.rows.slice();
      for (i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (R.rows.indexOf(row) === -1) continue;
        row.y += dy;
        this.rowPlaceRow(row);
        /* the ropes of floats across each passage (the one the ship cut stays cut) */
        for (j = 0; j < row.k; j++) {
          if (row.cut === j) continue;
          var g = row.gates[j], x0 = row.b[j] + 11 * R.k, x1 = row.b[j + 1] - 11 * R.k;
          var col = g.state === "wrong" ? 0x8a8a8a : g.state === "right" ? 0x7af0a0 : 0xe8b04a;
          lg.lineStyle(2, 0xefe6d2, 0.5); lg.lineBetween(x0, row.y, x1, row.y);
          lg.fillStyle(col, 0.95);
          for (var fx = x0 + 6; fx <= x1 - 6; fx += 15 * R.k) if (Math.abs(fx - g.x) > 30 * R.k) lg.fillCircle(fx, row.y, 3.2 * R.k);
        }
        /* through a passage: the row crosses the middle of the ship */
        var rel = row.y - sh.y;
        if (!row.done && row.rel != null && row.rel < 0 && rel >= 0) {
          row.done = true;
          var gi = 0;
          for (j = 0; j < row.k; j++) if (sh.x >= row.b[j]) gi = j;
          row.cut = gi;
          var gate = row.gates[gi];
          if (gate && gate.state === "live") { this.rowThrough(gate); if (this._finishing) return; }
        }
        row.rel = rel;
        if (row.y > H + 80 * R.k && R.rows.indexOf(row) !== -1) { this.rowKillRow(row); R.rows.splice(R.rows.indexOf(row), 1); }
      }
      /* 7. the band, the drum, the vase panel */
      this.rowLane(ms);
      this.rowPanel(s, ms);
    },

    /* the song: calm → it swells (gold notes first) → calm; the sea darkens to wine while it swells */
    rowSong: function (ms) {
      var R = this.rw, P = R.P, su = R.song;
      su.t += ms;
      if (su.state === "calm" && su.t >= su.cd) { su.state = "warn"; su.t = 0; }
      else if (su.state === "warn" && su.t >= P.swellWarn) {
        su.state = "swell"; su.t = 0; this.rowSnd("song");
        if (!R.told.song) { R.told.song = true; this.toast("The Sirens sing: \"Come here, famous Odysseus — we know all that happened at Troy.\" Their song swells and drags at the ship. Row on the beat to steer clear.", 5200); }
      } else if (su.state === "swell" && su.t >= P.swellMs) { su.state = "calm"; su.t = 0; su.cd = P.swellEvery * rnd(0.85, 1.15); }
      var wk = su.state === "warn" ? clamp(su.t / P.swellWarn, 0, 1) : su.state === "swell" ? 1 : 0;
      R.songWk = wk;
      R.tint.setAlpha(0.05 + 0.24 * wk);
      var lab = su.state === "warn" ? "The song swells…" : su.state === "swell" ? "THE SONG PULLS!" : "";
      if (R.songLabel.text !== lab) R.songLabel.setText(lab).setColor(su.state === "swell" ? "#ffd36a" : "#efe6d2");
      return su.state === "swell" ? P.swellMul : 1;
    },
    /* where the song runs from a Siren's mouth (ax, ay) to the mast (bx, by): ribbon j at u in 0..1 */
    rowRibbon: function (ax, ay, bx, by, j, u, out) {
      var R = this.rw, dx = bx - ax, dy = by - ay, len = Math.sqrt(dx * dx + dy * dy) || 1, nx = -dy / len, ny = dx / len;
      var amp = (7 + 10 * R.songWk) * Math.sin(Math.PI * u) * R.k, w = Math.sin(u * 9 - R.t * (3 + 3 * R.songWk) + j * 2.2);
      out.x = ax + dx * u + nx * amp * w;
      out.y = ay + dy * u - Math.sin(Math.PI * u) * (36 + j * 18) * R.k + ny * amp * w;
      return out;
    },
    rowSirens: function (ms) {
      var R = this.rw, H = this.H, sh = R.ship, g = R.songG, self = this, per = CO_H * R.cs, i, j, k;
      R.sirenMs += ms;
      if (R.sirenMs >= (R.songWk > 0.5 ? 260 : 520)) { R.sirenMs = 0; R.sirenFrame = 1 - R.sirenFrame; }
      var off = R.trav % per, vis = [];
      R.sirens.forEach(function (sr, idx) {
        var y = ROCK_Y[sr.rock] * R.cs + off - sr.inst * per;
        if (y < -40) y += 2 * per;
        var on = y > -30 && y < H + SIR_H;
        sr.spr.setVisible(on);
        if (!on) return;
        var bob = Math.sin(R.t * 3 + idx) * 1.5;
        var fr = (R.sirenFrame + idx) % 2;
        sr.spr.setPosition(rockX(sr.rock) * R.cs, y - 8 * R.cs + bob);
        if (sr.fr !== fr) { sr.fr = fr; sr.spr.setTexture("md-row-siren-" + fr); }
        var my = sr.spr.y + SIR_MOUTH[1] * R.sirS;
        if (my > 14 && y < R.laneT - 20) vis.push({ idx: idx, x: sr.spr.x + SIR_MOUTH[0] * R.sirS, y: my });
      });
      /* the song's ribbons, from each singing Siren to the mast */
      g.clear();
      var wk = R.songWk, mxx = sh.x, myy = sh.y + (MAST_Y - SH / 2) * R.shipS, pt = { x: 0, y: 0 }, pts;
      var colr = mix(0xe8b04a, 0xffd36a, wk);
      vis.forEach(function (v) {
        for (j = 0; j < 2; j++) {
          pts = [];
          for (k = 0; k <= 22; k++) { self.rowRibbon(v.x, v.y, mxx, myy, j, k / 22, pt); pts.push({ x: pt.x, y: pt.y }); }
          /* faint while the song is calm (the notes carry it); a broad gold ribbon while it swells */
          if (wk > 0) { g.lineStyle((6 + 6 * wk) * R.k, 0x3a0f2a, 0.3 * wk); g.strokePoints(pts); }
          g.lineStyle((1.2 + 3 * wk) * R.k, colr, 0.12 + 0.5 * wk); g.strokePoints(pts);
        }
      });
      /* its notes drift along them */
      R.noteCd -= ms;
      if (R.noteCd <= 0 && vis.length) {
        R.noteCd = wk > 0.5 ? 170 : wk > 0 ? 320 : 620;
        for (i = 0; i < R.flying.length; i++) if (!R.flying[i].on) {
          var f = R.flying[i], v0 = vis[Math.floor(Math.random() * vis.length)];
          f.on = true; f.sir = v0.idx; f.j = Math.random() < 0.5 ? 0 : 1; f.u = 0; f.spd = rnd(0.28, 0.36);
          f.spr.setVisible(true);
          break;
        }
      }
      for (i = 0; i < R.flying.length; i++) {
        var fl = R.flying[i];
        if (!fl.on) continue;
        var src = vis.filter(function (v) { return v.idx === fl.sir; })[0];
        fl.u += fl.spd * (1 + 1.2 * wk) * ms / 1000;
        if (!src || fl.u >= 1) { fl.on = false; fl.spr.setVisible(false); continue; }
        this.rowRibbon(src.x, src.y, mxx, myy, fl.j, fl.u, pt);
        fl.spr.setPosition(pt.x, pt.y).setAlpha(Math.min(1, Math.sin(Math.PI * fl.u) * 1.6)).setTint(colr).setRotation(Math.sin(R.t * 4 + i) * 0.25);
      }
    },
    /* the drum band: marks closing in from both ends, the drum, the stroke ring, the words */
    rowLane: function (ms) {
      var R = this.rw, i, nt;
      for (i = 0; i < R.notes.length; i++) {
        nt = R.notes[i];
        var u = (nt.t - R.clock) / R.lead, show = u < 1.04 && !(nt.judged && nt.res !== "miss");
        if (nt.judged && nt.res === "miss") nt.fade -= ms / 260;
        var al = show ? Math.min(1, (1.04 - u) * 8) * (nt.res === "miss" ? Math.max(0, nt.fade) : 1) : 0;
        [nt.mL, nt.mR].forEach(function (m, sd) {
          if (!m) return;
          m.setVisible(al > 0.01);
          if (al > 0.01) m.setPosition(R.drumX + (sd ? 1 : -1) * Math.max(u, -0.2) * R.half, R.drumY).setAlpha(al).setTint(nt.res === "miss" ? 0x8a8a8a : 0xffffff);
        });
      }
      R.drumK = Math.max(0, R.drumK - ms / 160);
      R.drum.setScale(R.drumS * (1 + 0.08 * R.drumK));
      R.drumTxt.setScale(1 + 0.08 * R.drumK);
      /* the stroke ring round the drum: how strong the crew is pulling */
      var g = R.ringG, rr = 36 * R.drumS;
      g.clear();
      g.lineStyle(5 * R.k, 0x140c0a, 0.9); g.strokeCircle(R.drumX, R.drumY, rr);
      g.lineStyle(3.5 * R.k, R.mom > 0.75 ? 0xffd36a : R.mom > 0.4 ? 0xe8b04a : 0xd9772b, 1);
      g.beginPath(); g.arc(R.drumX, R.drumY, rr, -Math.PI / 2, -Math.PI / 2 + Math.max(0.02, R.mom) * TAU, false); g.strokePath();
      if (R.burstMs > 0) {
        R.burstMs -= ms;
        var b = 1 - Math.max(0, R.burstMs) / 320;
        g.lineStyle(4 * R.k, R.burstCol, 1 - b); g.strokeCircle(R.drumX, R.drumY, rr + b * 26 * R.k);
      }
      if (R.fbMs > 0) {
        R.fbMs -= ms;
        var fa = clamp(R.fbMs / 260, 0, 1), pop = 1 + 0.25 * clamp((R.fbMs - 560) / 140, 0, 1);
        R.fb.setAlpha(fa).setScale(pop); R.fb2.setAlpha(fa);
      } else { R.fb.setAlpha(0); R.fb2.setAlpha(0); }
      if (R.countMs > 0) { R.countMs -= ms; R.countTxt.setAlpha(clamp(R.countMs / 250, 0, 1)).setScale(1 + 0.2 * clamp((R.countMs - 450) / 150, 0, 1)); }
      else R.countTxt.setAlpha(0);
      var ct = R.hitRun >= 4 ? "×" + R.hitRun : "";
      if (R.combo.text !== ct) R.combo.setText(ct);
    },
    /* the vase panel: Odysseus strains toward the Sirens as the ropes snap */
    rowPanel: function (s, ms) {
      var R = this.rw, P = R.P, n = P.breakAt, g = R.ropeG, i;
      R.freeMs = Math.max(0, R.freeMs - ms);
      var target = R.freeMs > 0 ? 1.5 : R.missRun / n;
      R.lean += (target - R.lean) * Math.min(1, s * 9);
      var shake = R.lean > 0.05 ? Math.sin(R.t * 26) * 0.04 * Math.min(1, R.lean) : 0;
      R.hero.setPosition(R.heroX - 9 * R.lean * R.ins, R.heroY).setRotation(-0.26 * R.lean + shake);
      /* ropes intact: all of them, less the misses in a row; while he is free they come back one by one */
      var intact = R.freeMs > 0 ? Math.floor(clamp(1 - R.freeMs / 700, 0, 1) * n) : n - R.missRun;
      g.clear();
      var mx = 8 + PAN_W / 2 * R.ins, half = 20 * R.ins;
      for (i = 0; i < n; i++) {
        var y = 8 + (ROPE_Y0 + (ROPE_Y1 - ROPE_Y0) * (n > 1 ? i / (n - 1) : 0.5)) * R.ins;
        if (i < intact) {
          g.lineStyle(6 * R.ins, 0x140c0a, 1); g.lineBetween(mx - half, y, mx + half, y + 3 * R.ins);
          g.lineStyle(3.4 * R.ins, 0xefe6d2, 1); g.lineBetween(mx - half, y, mx + half, y + 3 * R.ins);
        } else {
          g.lineStyle(3 * R.ins, 0xefe6d2, 0.9);
          g.lineBetween(mx - half, y, mx - half + 5 * R.ins, y + 8 * R.ins); g.lineBetween(mx + half, y + 3 * R.ins, mx + half - 5 * R.ins, y + 11 * R.ins);
          g.fillStyle(0xb8321e, 1); g.fillCircle(mx - half + 5 * R.ins, y + 8 * R.ins, 2.2 * R.ins); g.fillCircle(mx + half - 5 * R.ins, y + 11 * R.ins, 2.2 * R.ins);
        }
      }
      if (R.ropesShown !== intact) {
        R.ropesShown = intact;
        var dots = ""; for (i = 0; i < n; i++) dots += i < intact ? "●" : "○";
        R.ropeTxt.setText("ROPES " + dots).setColor(intact <= 1 ? "#ff9a7a" : "#efe6d2");
      }
    }
  });
})();
