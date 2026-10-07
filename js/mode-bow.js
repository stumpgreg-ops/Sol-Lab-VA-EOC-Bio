/* SOL Labyrinth v5.11 — the Odyssey mode "bow": Bend the Bow (Odyssey 21, Penelope's contest).
 *
 * A side view of the great hall on Ithaca, drawn like a Greek vase: the hall above in red-figure
 * (clay figures on a dark wine-black ground), the suitors at their tables below in black-figure
 * (black figures on clay). Odysseus, still in his beggar's rags, stands by the great threshold at the
 * left with the bow. One row of twelve bronze axe heads per answer letter hangs across the hall, each
 * row ending at a plaque with its letter. The rows fan out from Odysseus's shoulder and every row's
 * rings sit on the path of a fully drawn arrow, so a row can be threaded from where he stands.
 *
 * Aim (▲ ▼ / W S / the pad, or point), hold to draw (the meter: drawing → the gold band → shaking),
 * let go: the arrow flies with slight gravity (and, from level 41, the draft from the open side door).
 * Through all twelve rings into the plaque picks that letter (answerPick); an axe blade, a haft, a plank,
 * the floor or the wall stops it — a wasted arrow. The suitors' patience drains with time and with every
 * miss; when it runs out one of them (two from 61, three from 91) stands and throws a footstool or a cup
 * along a dotted arc: hold ◀ to step back into the doorway. A hit costs a life, and so does using up the
 * quiver (Eumaeus brings a fresh one). bowParams sets one difficulty curve for all of it.
 *
 * Registered with SolModes.extend (js/modes.js); the methods below are copied onto ModeScene, so `this`
 * is the mode scene. Every texture is drawn once (canvasTex) under an "md-bow-" key.
 */
(function () {
  "use strict";
  var M = typeof window !== "undefined" ? window.SolModes : null;
  if (!M || !M.extend || !M.lib) return;
  var L = M.lib, clamp = L.clamp, rnd = L.rnd, shuffle = L.shuffle, snd = L.snd, canvasTex = L.canvasTex;

  var C = { terra: "#d9772b", ochre: "#e8b04a", glaze: "#140c0a", wine: "#3a0f2a", blue: "#1e5f8c", foam: "#9fd3d6", bone: "#efe6d2",
    clay2: "#e79a52", dilute: "#7a3c1c" };
  var TAU = Math.PI * 2, DEG = Math.PI / 180;
  var DRAW_MS = 900;      /* rest to a full draw */
  var FLIGHT = 0.5;       /* seconds a fully drawn arrow takes to reach the plaques */
  var DROP = 0.07;        /* gravity: a fully drawn arrow drops this share of the distance on its way */
  var AX_W = 26, BL = 12, RIM = 4, HF = 10;   /* the axe texture: width, blade, ring rim, haft below the ring */
  var PLAQUE_R = 23;
  /* the suitors at the tables (Antinous and Eurymachus each threw a footstool at the beggar, Books 17 and 18) */
  var SUITORS = [["Antinous", "stool"], ["Eurymachus", "stool"], ["Ctesippus", "cup"], ["Agelaus", "cup"], ["Peisander", "cup"]];

  /* ── difficulty: one curve for every level 1-100, each level harder than the one before ── */
  function bowParams(n) {
    n = Math.max(1, Number(n) || 1);
    return {
      gap: 36 - n * 0.14,                                         /* the hole through a ring, px: 33.3 at 19, 22.1 at 99 */
      sway: n >= 11 ? Math.min(42, 8 + (n - 11) * 0.38) : 0,      /* rows sway up and down, px at the plaques */
      swaySpd: 0.5 + n * 0.009,                                   /* rad a second */
      sweetMs: 1400 - n * 9.5,                                    /* the gold band: a full draw held steady, ms */
      shakeDeg: 1.2 + n * 0.03,                                   /* how far the aim shakes when held too long */
      shakeMs: 1500 - n * 7,                                      /* from the first tremble to the worst */
      wind: n >= 41 ? 10 + (n - 41) * 0.45 : 0,                   /* the draft: px it pushes an arrow at the plaques */
      guide: 0.95 - n * 0.006,                                    /* how much of the way to the first axe the dotted line shows */
      glow: n < 71 ? 1 : 0,                                       /* the row lights up when the aim is lined up with it */
      drain: 0.0294 + n * 0.0009,                                 /* the suitors' patience lost a second (21 s at 19, 8.5 s at 99) */
      missCost: 0.1 + n * 0.0013,                                 /* patience lost for every wasted or wrong arrow */
      refill: 0.7 - n * 0.0028,                                   /* patience after a volley */
      throwers: n >= 91 ? 3 : n >= 61 ? 2 : 1,                    /* suitors throwing at once */
      doorP: n >= 61 ? Math.min(0.45, 0.2 + (n - 61) * 0.007) : 0, /* a throw aimed at the doorway instead */
      warnMs: Math.max(450, 1500 - n * 10.5),                     /* the suitor stands and the arc shows */
      flightMs: Math.max(520, 1100 - n * 5.5),                    /* the throw in the air */
      quiver: n >= 91 ? 5 : n >= 81 ? 6 : 10 - Math.floor((n - 1) / 20)   /* arrows a question: 10 ... 7, 6, 5 */
    };
  }

  /* ── art (the design sheet's palette), drawn once ── */
  function path(c, pts) { c.beginPath(); pts.forEach(function (q, i) { c[i ? "lineTo" : "moveTo"](q[0], q[1]); }); }
  function meander(c, x0, y0, w, h, col) {
    var t = y0 + h * 0.14, b = y0 + h * 0.86, s = b - t, x;
    c.strokeStyle = col; c.lineWidth = Math.max(1.4, h / 7.5); c.lineJoin = "miter"; c.lineCap = "butt";
    c.beginPath();
    for (x = x0 - s; x < x0 + w; x += s * 1.15) {
      c.moveTo(x, b); c.lineTo(x, t); c.lineTo(x + s * 0.85, t); c.lineTo(x + s * 0.85, t + s * 0.66);
      c.lineTo(x + s * 0.4, t + s * 0.66); c.lineTo(x + s * 0.4, t + s * 0.36); c.lineTo(x + s * 0.6, t + s * 0.36);
    }
    c.moveTo(x0, b); c.lineTo(x0 + w, b);
    c.stroke();
  }
  /* one bronze axe head on its haft, the ring's hole facing along the row */
  function axeH(gap) { return BL + RIM * 2 + gap + HF; }
  function drawAxe(gap) {
    return function (c, w, h) {
      var cx = w / 2, ry = gap / 2, cy = BL + RIM + ry, g;
      /* the haft, down to the plank */
      c.fillStyle = "#7a4220"; c.fillRect(cx - 2.5, cy + ry + RIM - 1, 5, h - (cy + ry + RIM - 1));
      c.strokeStyle = C.glaze; c.lineWidth = 1; c.strokeRect(cx - 2.5, cy + ry + RIM, 5, h - (cy + ry + RIM) - 0.5);
      /* the head: a double axe, two flaring blades with curved edges either side of the socket */
      var by = BL * 0.5 + 0.5;
      g = c.createLinearGradient(0, 0, 0, BL + 1);
      g.addColorStop(0, "#ffd97a"); g.addColorStop(0.55, "#d4902e"); g.addColorStop(1, "#8a5418");
      c.fillStyle = g; c.beginPath();
      c.moveTo(cx - 2.5, by - 2.6); c.lineTo(3, 0.8); c.quadraticCurveTo(-1.5, by, 3, BL + 0.2); c.lineTo(cx - 2.5, by + 2.6);
      c.lineTo(cx + 2.5, by + 2.6); c.lineTo(w - 3, BL + 0.2); c.quadraticCurveTo(w + 1.5, by, w - 3, 0.8); c.lineTo(cx + 2.5, by - 2.6); c.closePath(); c.fill();
      c.strokeStyle = C.glaze; c.lineWidth = 1.1; c.stroke();
      c.strokeStyle = "rgba(255,240,190,0.95)"; c.lineWidth = 1.1;
      c.beginPath(); c.moveTo(3.6, 2); c.quadraticCurveTo(0.4, by, 3.6, BL - 1); c.moveTo(w - 3.6, 2); c.quadraticCurveTo(w - 0.4, by, w - 3.6, BL - 1); c.stroke();
      c.fillStyle = "#6a3e14"; c.fillRect(cx - 2.5, by - 3.5, 5, BL + RIM - by + 3.5);
      /* the ring: a bronze hoop seen a little from the side, its dark hole lined up with the others */
      g = c.createLinearGradient(cx - 9, 0, cx + 9, 0);
      g.addColorStop(0, "#ffe08e"); g.addColorStop(0.45, "#d4902e"); g.addColorStop(1, "#7a4a14");
      c.fillStyle = g; c.beginPath(); c.ellipse(cx, cy, 8.5, ry + RIM, 0, 0, TAU); c.fill();
      c.strokeStyle = C.glaze; c.lineWidth = 1.2; c.stroke();
      c.fillStyle = "#0e060a"; c.beginPath(); c.ellipse(cx + 0.6, cy, 4.4, ry, 0, 0, TAU); c.fill();
      c.strokeStyle = "rgba(255,226,150,0.55)"; c.lineWidth = 1; c.beginPath(); c.ellipse(cx + 0.6, cy, 4.4, ry, 0, Math.PI * 0.6, Math.PI * 1.4); c.stroke();
    };
  }
  /* the letter plaque at the end of a row: a bone-white disc with a terracotta rim, like a painted plate */
  function drawPlaque(c, w, h) {
    var cx = w / 2, cy = h / 2;
    c.fillStyle = "rgba(0,0,0,0.35)"; c.beginPath(); c.arc(cx + 1.5, cy + 2, 25, 0, TAU); c.fill();
    c.fillStyle = C.terra; c.beginPath(); c.arc(cx, cy, 25, 0, TAU); c.fill();
    c.strokeStyle = C.glaze; c.lineWidth = 1.6; c.stroke();
    c.fillStyle = C.glaze;
    for (var i = 0; i < 16; i++) { var a = i / 16 * TAU; c.beginPath(); c.arc(cx + Math.cos(a) * 22.3, cy + Math.sin(a) * 22.3, 1.1, 0, TAU); c.fill(); }
    c.fillStyle = C.bone; c.beginPath(); c.arc(cx, cy, 19.5, 0, TAU); c.fill();
    c.strokeStyle = C.glaze; c.lineWidth = 1; c.stroke();
  }
  /* an arrow seen from the side, pointing right: terracotta fletching, bone shaft, bronze head */
  function drawArrowSide(c, w, h) {
    var cy = h / 2;
    c.fillStyle = C.terra; path(c, [[0, 0.5], [13, cy - 1], [4, cy - 1]]); c.closePath(); c.fill();
    path(c, [[0, h - 0.5], [13, cy + 1], [4, cy + 1]]); c.closePath(); c.fill();
    c.strokeStyle = C.glaze; c.lineWidth = 3.4; c.beginPath(); c.moveTo(1, cy); c.lineTo(w - 10, cy); c.stroke();
    c.strokeStyle = C.bone; c.lineWidth = 2; c.beginPath(); c.moveTo(1.5, cy); c.lineTo(w - 10, cy); c.stroke();
    c.fillStyle = "#e8a83c"; path(c, [[w, cy], [w - 13, 0.8], [w - 10, cy], [w - 13, h - 0.8]]); c.closePath(); c.fill();
    c.strokeStyle = C.glaze; c.lineWidth = 1; c.stroke();
  }
  /* Odysseus in red-figure: a clay figure with black painted lines; ragged tunic and cloak, the pilos cap
     he wears on Greek vases. The arms and the bow are drawn every frame (they follow the aim). Feet at (38, 136). */
  function drawOdysseus(c, w, h) {
    var G = C.glaze, CL = C.terra, CL2 = C.clay2;
    c.lineCap = "round"; c.lineJoin = "round";
    function limb(pts, wd) {
      c.strokeStyle = G; c.lineWidth = wd + 2.6; path(c, pts); c.stroke();
      c.strokeStyle = CL; c.lineWidth = wd; path(c, pts); c.stroke();
    }
    /* the ragged cloak hanging behind */
    c.fillStyle = C.dilute; path(c, [[34, 45], [27, 60], [22, 84], [17, 101], [23, 97], [25, 104], [30, 96], [34, 102], [37, 90], [39, 60]]); c.closePath(); c.fill();
    c.strokeStyle = G; c.lineWidth = 1.2; c.stroke();
    /* legs: an archer's stance */
    limb([[35, 92], [28, 113], [20, 131]], 7.5);
    limb([[43, 92], [51, 113], [55, 131]], 7.5);
    c.fillStyle = CL; c.strokeStyle = G; c.lineWidth = 1.2;
    path(c, [[15, 128], [24, 128], [25, 136], [10, 136]]); c.closePath(); c.fill(); c.stroke();
    path(c, [[51, 128], [60, 131], [67, 136], [51, 136]]); c.closePath(); c.fill(); c.stroke();
    /* the short ragged tunic, with painted folds and a rope belt */
    c.fillStyle = CL2; path(c, [[33, 45], [51, 45], [52, 68], [57, 94], [53, 90], [50, 97], [46, 91], [42, 98], [38, 91], [34, 97], [31, 90], [27, 95], [32, 68]]); c.closePath(); c.fill();
    c.strokeStyle = G; c.lineWidth = 1.3; c.stroke();
    c.lineWidth = 1;
    [[37, 72, 34, 90], [42, 72, 42, 93], [47, 72, 50, 89], [38, 50, 37, 66], [45, 50, 46, 66]].forEach(function (l) { c.beginPath(); c.moveTo(l[0], l[1]); c.lineTo(l[2], l[3]); c.stroke(); });
    c.lineWidth = 2.2; c.beginPath(); c.moveTo(32, 68); c.lineTo(52, 68); c.stroke();
    c.lineWidth = 1; c.strokeRect(42.5, 75, 5, 6);   /* a patch on the rags */
    /* neck and head, in profile facing right */
    c.fillStyle = CL; c.fillRect(40, 35, 7, 12);
    c.beginPath(); c.arc(44, 28, 9.5, 0, TAU); c.fill(); c.strokeStyle = G; c.lineWidth = 1.2; c.stroke();
    path(c, [[52.5, 23], [57, 30.5], [52, 31.5]]); c.fill();
    c.beginPath(); c.moveTo(52.5, 23.5); c.lineTo(57, 30.5); c.lineTo(52.5, 31.5); c.stroke();
    /* a full black beard, the eye, hair at the nape */
    c.fillStyle = G; path(c, [[36, 29], [44, 33], [51, 33.5], [54, 36], [50, 43], [44, 46], [37, 40]]); c.closePath(); c.fill();
    c.beginPath(); c.ellipse(49, 25.5, 2.3, 1.3, 0, 0, TAU); c.fill();
    path(c, [[34.5, 22], [39.5, 22], [38.5, 33], [34, 31]]); c.closePath(); c.fill();
    /* the pilos, a traveller's felt cap */
    c.fillStyle = CL2; path(c, [[33, 22], [56, 22], [45, 3]]); c.closePath(); c.fill(); c.strokeStyle = G; c.lineWidth = 1.3; c.stroke();
    c.lineWidth = 2.6; c.beginPath(); c.moveTo(32, 22.5); c.lineTo(57, 22.5); c.stroke();
  }
  /* a suitor in black-figure, facing left toward Odysseus; lines incised in clay. Seated (64x82, three
     poses) or standing to throw (64x104, the throwing hand up at (52, 6)). Feet on the bottom edge. */
  function drawSuitor(v, standing) {
    return function (c, w, h) {
      var G = C.glaze, IN = "rgba(239,170,100,0.95)";
      c.lineCap = "round"; c.lineJoin = "round";
      function st(pts, wd) { c.strokeStyle = G; c.lineWidth = wd; path(c, pts); c.stroke(); }
      function cup(x, y) {
        c.fillStyle = G; c.beginPath(); c.moveTo(x - 7, y - 2); c.quadraticCurveTo(x, y + 6, x + 7, y - 2); c.closePath(); c.fill();
        c.fillRect(x - 1, y + 1, 2, 4); c.fillRect(x - 4, y + 4.5, 8, 1.6);
        c.strokeStyle = IN; c.lineWidth = 0.8; c.beginPath(); c.moveTo(x - 5, y); c.lineTo(x + 5, y); c.stroke();
      }
      function head(x, y) {
        c.fillStyle = G; c.beginPath(); c.arc(x, y, 7.5, 0, TAU); c.fill();
        path(c, [[x - 6.5, y - 3], [x - 11, y + 2], [x - 6, y + 3]]); c.fill();
        path(c, [[x - 6, y + 4], [x - 9, y + 12.5], [x - 1, y + 8]]); c.fill();
        c.strokeStyle = IN; c.lineWidth = 1;
        c.beginPath(); c.arc(x - 3.5, y - 1.5, 1.2, 0, TAU); c.stroke();
        c.beginPath(); c.arc(x + 1, y, 5.6, Math.PI * 1.05, Math.PI * 1.85); c.stroke();
        c.beginPath(); c.moveTo(x - 5, y + 6); c.lineTo(x - 7, y + 10); c.stroke();
      }
      if (!standing) {
        /* the chair (a klismos), curved legs and back */
        st([[34, 55], [55, 55]], 3.6);
        st([[37, 55], [31, 66], [28, 81]], 2.6);
        st([[53, 55], [58, 67], [61, 81]], 2.6);
        st([[53, 55], [56, 41], [61, 29]], 2.6);
        /* seated legs and foot */
        st([[47, 52], [24, 53]], 9);
        st([[24, 53], [20, 77]], 7);
        c.fillStyle = G; path(c, [[13, 76], [24, 76], [24, 81], [10, 81]]); c.closePath(); c.fill();
        /* the body wrapped in a himation */
        path(c, [[35, 25], [46, 25], [50, 41], [51, 55], [30, 57], [22, 52], [30, 45]]); c.closePath(); c.fill();
        head(39, 16);
        c.strokeStyle = IN; c.lineWidth = 1;
        [[44, 29, 47, 50], [39, 31, 42, 51], [33, 47, 46, 52], [27, 52, 22, 74]].forEach(function (l) { c.beginPath(); c.moveTo(l[0], l[1]); c.quadraticCurveTo((l[0] + l[2]) / 2 + 2, (l[1] + l[3]) / 2, l[2], l[3]); c.stroke(); });
        if (v === 0) { st([[38, 29], [29, 37], [19, 35]], 4.6); cup(13, 32); }
        else if (v === 1) { st([[38, 29], [31, 41], [26, 49]], 4.6); }
        else { st([[38, 29], [29, 32], [30, 22]], 4.6); cup(26, 19); }
      } else {
        /* standing up to throw */
        st([[36, 64], [30, 83], [24, 100]], 7); st([[41, 64], [47, 83], [53, 100]], 7);
        c.fillStyle = G; path(c, [[17, 98], [26, 98], [26, 104], [14, 104]]); c.closePath(); c.fill();
        path(c, [[50, 98], [58, 100], [62, 104], [50, 104]]); c.closePath(); c.fill();
        path(c, [[33, 29], [45, 29], [48, 47], [48, 68], [29, 68], [28, 48]]); c.closePath(); c.fill();
        head(37, 19);
        st([[43, 33], [51, 20], [52, 7]], 4.8);
        st([[34, 35], [24, 44], [15, 41]], 4.6);
        c.strokeStyle = IN; c.lineWidth = 1;
        [[38, 36, 36, 64], [44, 36, 45, 64], [31, 52, 47, 56]].forEach(function (l) { c.beginPath(); c.moveTo(l[0], l[1]); c.quadraticCurveTo((l[0] + l[2]) / 2 + 2, (l[1] + l[3]) / 2, l[2], l[3]); c.stroke(); });
      }
    };
  }
  /* what they throw: a footstool and a wine cup, black with a bone rim so they show against the dark hall */
  function drawStool(c, w, h) {
    c.lineCap = "round"; c.lineJoin = "round";
    function shape() {
      path(c, [[3, 4], [33, 4], [33, 9], [3, 9]]); c.closePath();
      c.moveTo(8, 9); c.quadraticCurveTo(4, 16, 4, 23); c.moveTo(28, 9); c.quadraticCurveTo(32, 16, 32, 23);
      c.moveTo(7, 16); c.lineTo(29, 16);
    }
    c.strokeStyle = C.bone; c.lineWidth = 5.5; shape(); c.stroke();
    c.strokeStyle = C.glaze; c.lineWidth = 3; shape(); c.stroke();
    c.fillStyle = C.glaze; c.fillRect(3, 4, 30, 5);
    c.strokeStyle = C.terra; c.lineWidth = 1; c.beginPath(); c.moveTo(5, 6.5); c.lineTo(31, 6.5); c.stroke();
  }
  function drawCup(c, w, h) {
    function shape() {
      c.beginPath(); c.moveTo(5, 5); c.lineTo(33, 5); c.quadraticCurveTo(30, 12, 19, 12.5); c.quadraticCurveTo(8, 12, 5, 5); c.closePath();
      c.rect(17.5, 12, 3, 4); c.rect(12, 15.5, 14, 2.4);
    }
    c.lineJoin = "round";
    c.strokeStyle = C.bone; c.lineWidth = 4; shape(); c.stroke();
    c.strokeStyle = C.bone; c.lineWidth = 4; c.beginPath(); c.arc(4, 6, 3, Math.PI * 0.5, Math.PI * 1.5); c.stroke(); c.beginPath(); c.arc(34, 6, 3, -Math.PI * 0.5, Math.PI * 0.5); c.stroke();
    c.fillStyle = C.glaze; shape(); c.fill();
    c.strokeStyle = C.glaze; c.lineWidth = 1.8; c.beginPath(); c.arc(4, 6, 3, Math.PI * 0.5, Math.PI * 1.5); c.stroke(); c.beginPath(); c.arc(34, 6, 3, -Math.PI * 0.5, Math.PI * 0.5); c.stroke();
    c.strokeStyle = C.terra; c.lineWidth = 1.4; c.beginPath(); c.moveTo(8, 7.5); c.quadraticCurveTo(19, 10, 30, 7.5); c.stroke();
  }
  function drawFlame(c, w, h) {
    var g = c.createLinearGradient(0, h, 0, 0);
    g.addColorStop(0, "rgba(255,236,170,1)"); g.addColorStop(0.35, "rgba(232,176,74,0.95)"); g.addColorStop(0.75, "rgba(217,119,43,0.75)"); g.addColorStop(1, "rgba(217,119,43,0)");
    c.fillStyle = g; c.beginPath(); c.moveTo(w / 2, 0); c.quadraticCurveTo(w, h * 0.55, w / 2, h); c.quadraticCurveTo(0, h * 0.55, w / 2, 0); c.fill();
    c.fillStyle = "rgba(255,248,220,0.85)"; c.beginPath(); c.moveTo(w / 2, h * 0.45); c.quadraticCurveTo(w * 0.72, h * 0.75, w / 2, h); c.quadraticCurveTo(w * 0.28, h * 0.75, w / 2, h * 0.45); c.fill();
  }
  function drawGlow(c, w, h) {
    var g = c.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2);
    g.addColorStop(0, "rgba(255,210,120,0.55)"); g.addColorStop(0.5, "rgba(232,150,60,0.18)"); g.addColorStop(1, "rgba(217,119,43,0)");
    c.fillStyle = g; c.fillRect(0, 0, w, h);
  }
  function ensureBowArt(scene) {
    canvasTex(scene, "md-bow-plaque", 54, 54, drawPlaque);
    canvasTex(scene, "md-bow-arrow", 56, 10, drawArrowSide);
    canvasTex(scene, "md-bow-ody", 76, 138, drawOdysseus);
    for (var i = 0; i < 3; i++) canvasTex(scene, "md-bow-suitor-" + i, 64, 82, drawSuitor(i, false));
    canvasTex(scene, "md-bow-suitor-up", 64, 104, drawSuitor(0, true));
    canvasTex(scene, "md-bow-stool", 36, 26, drawStool);
    canvasTex(scene, "md-bow-cup", 38, 20, drawCup);
    canvasTex(scene, "md-bow-flame", 26, 44, drawFlame);
    canvasTex(scene, "md-bow-glow", 128, 128, drawGlow);
  }
  /* the hall, drawn once for the canvas size (B is the layout) */
  function drawHall(B, W, H) {
    return function (c) {
      var fy = B.floorY, k = B.k, g;
      /* the upper register: the hall's dark wine-black wall, lit by the hearth */
      g = c.createLinearGradient(0, 0, 0, fy);
      g.addColorStop(0, "#14070f"); g.addColorStop(0.6, "#280b1d"); g.addColorStop(1, "#3a1426");
      c.fillStyle = g; c.fillRect(0, 0, W, fy);
      g = c.createRadialGradient(B.hearthX, fy - 30 * k, 10, B.hearthX, fy - 30 * k, W * 0.55);
      g.addColorStop(0, "rgba(232,176,74,0.26)"); g.addColorStop(0.45, "rgba(217,119,43,0.08)"); g.addColorStop(1, "rgba(217,119,43,0)");
      c.fillStyle = g; c.fillRect(0, 0, W, fy);
      /* a painted dado stripe low on the wall */
      c.fillStyle = "rgba(217,119,43,0.22)"; c.fillRect(0, fy - 46 * k, W, 5 * k);
      c.fillStyle = "rgba(20,12,10,0.35)"; c.fillRect(0, fy - 41 * k, W, 41 * k);
      /* the far wall, where the arrows stick */
      c.fillStyle = "rgba(20,12,10,0.45)"; c.fillRect(W - 12, 0, 12, fy);
      /* columns round the hearth: Mycenaean, wider at the top, black capitals */
      B.colX.forEach(function (x) {
        var top = 24 * k, tw = 15 * k, bw = 10.5 * k;
        g = c.createLinearGradient(x - tw, 0, x + tw, 0);
        g.addColorStop(0, "#3e1018"); g.addColorStop(0.4, "#6a2026"); g.addColorStop(1, "#30080f");
        c.fillStyle = g; path(c, [[x - tw, top + 16 * k], [x + tw, top + 16 * k], [x + bw, fy - 6 * k], [x - bw, fy - 6 * k]]); c.closePath(); c.fill();
        c.fillStyle = C.glaze; c.beginPath(); c.ellipse(x, top + 13 * k, tw + 6 * k, 6.5 * k, 0, 0, TAU); c.fill();
        c.fillRect(x - tw - 8 * k, top, (tw + 8 * k) * 2, 8 * k);
        c.fillStyle = "rgba(217,119,43,0.5)"; c.fillRect(x - tw - 8 * k, top + 7 * k, (tw + 8 * k) * 2, 1.5 * k);
        c.fillStyle = "#2a0c12"; c.fillRect(x - bw - 3 * k, fy - 8 * k, (bw + 3 * k) * 2, 8 * k);
      });
      /* the side door high in the wall, open to the day (the draft comes in here) */
      var dx = B.doorX, dy = B.doorY, dw = B.doorW, dh = B.doorH;
      g = c.createLinearGradient(0, dy, 0, dy + dh);
      g.addColorStop(0, "#bfe4e4"); g.addColorStop(0.55, C.foam); g.addColorStop(1, C.blue);
      c.fillStyle = g; c.fillRect(dx - dw / 2, dy, dw, dh);
      c.fillStyle = "rgba(30,95,140,0.5)"; c.fillRect(dx - dw / 2, dy + dh * 0.62, dw, dh * 0.38);
      c.strokeStyle = "#8a7a62"; c.lineWidth = 6 * k; c.strokeRect(dx - dw / 2 - 3 * k, dy - 3 * k, dw + 6 * k, dh + 3 * k);
      c.fillStyle = "#6a5a46"; c.fillRect(dx - dw / 2 - 10 * k, dy + dh, dw + 20 * k, 5 * k);
      /* the great threshold and the doorway at the left, where Odysseus can step back */
      var tx0 = Math.max(6 * k, B.bx - 74 * k), tx1 = B.mx - 24 * k, ty = fy - 156 * k;
      g = c.createLinearGradient(0, ty, 0, fy);
      g.addColorStop(0, "#0a0508"); g.addColorStop(1, "#1a0e12");
      c.fillStyle = g; c.fillRect(tx0, ty, tx1 - tx0, fy - ty);
      c.fillStyle = "#8a7a62"; c.fillRect(tx0 - 6 * k, ty - 10 * k, tx1 - tx0 + 12 * k, 10 * k);
      c.fillRect(tx0 - 6 * k, ty, 7 * k, fy - ty); c.fillRect(tx1 - 1 * k, ty, 7 * k, fy - ty);
      c.fillStyle = "rgba(239,230,210,0.25)"; c.fillRect(tx0 - 6 * k, ty - 10 * k, tx1 - tx0 + 12 * k, 2 * k);
      c.fillStyle = "#a8987c"; c.fillRect(0, fy - 7 * k, B.mx + 34 * k, 7 * k);
      c.fillStyle = "rgba(20,12,10,0.4)"; c.fillRect(0, fy - 1.5 * k, B.mx + 34 * k, 1.5 * k);
      /* the hearth: a round stone drum with glowing coals */
      var hx = B.hearthX, hr = 38 * k, htop = fy - 24 * k;
      c.fillStyle = "#6a5a46"; c.fillRect(hx - hr, htop, hr * 2, fy - htop);
      c.fillStyle = C.terra; c.fillRect(hx - hr, htop + 9 * k, hr * 2, 4 * k);
      c.strokeStyle = C.glaze; c.lineWidth = 1.2; c.strokeRect(hx - hr, htop, hr * 2, fy - htop);
      g = c.createRadialGradient(hx, htop, 2, hx, htop, hr);
      g.addColorStop(0, "#ffe7a0"); g.addColorStop(0.5, "#e8a040"); g.addColorStop(1, "#7a2a12");
      c.fillStyle = g; c.beginPath(); c.ellipse(hx, htop, hr, 8 * k, 0, 0, TAU); c.fill();
      c.strokeStyle = "#4a3a2a"; c.lineWidth = 2 * k; c.stroke();
      /* the floor and the ceiling beam, each with a meander */
      c.fillStyle = "#4a3a2c"; c.fillRect(0, fy, W, 5 * k);
      c.fillStyle = C.glaze; c.fillRect(0, 0, W, 22 * k);
      meander(c, 0, 4 * k, W, 14 * k, C.ochre);
      /* the lower register: the suitors' feast in black-figure on clay */
      var ly = fy + 5 * k;
      g = c.createLinearGradient(0, ly, 0, H);
      g.addColorStop(0, "#e2843a"); g.addColorStop(1, "#c46424");
      c.fillStyle = g; c.fillRect(0, ly, W, H - ly);
      meander(c, 0, ly + 2 * k, W, 15 * k, C.glaze);
      c.fillStyle = C.glaze; c.fillRect(0, ly + 18 * k, W, 2 * k); c.fillRect(0, H - 5 * k, W, 5 * k);
      /* a small three-legged table in front of each suitor, with bread and a cup */
      B.suX.forEach(function (x, j) {
        var t0 = x - 52 * k, t1 = x - 26 * k, ty2 = B.suY - 34 * k;
        c.fillStyle = C.glaze; c.fillRect(t0, ty2, t1 - t0, 4 * k);
        c.strokeStyle = C.glaze; c.lineWidth = 2.4 * k; c.lineCap = "round";
        c.beginPath(); c.moveTo(t0 + 3 * k, ty2 + 3 * k); c.lineTo(t0 + 1 * k, B.suY); c.moveTo(t1 - 3 * k, ty2 + 3 * k); c.lineTo(t1 - 1 * k, B.suY); c.moveTo((t0 + t1) / 2, ty2 + 3 * k); c.lineTo((t0 + t1) / 2, B.suY - 2 * k); c.stroke();
        c.beginPath(); c.arc(t0 + 8 * k, ty2 - 3 * k, 4.5 * k, Math.PI, 0); c.fill();
        if (j % 2 === 0) { c.beginPath(); c.moveTo(t1 - 13 * k, ty2 - 6 * k); c.quadraticCurveTo(t1 - 7 * k, ty2 + 1 * k, t1 - 1 * k, ty2 - 6 * k); c.closePath(); c.fill(); c.fillRect(t1 - 8 * k, ty2 - 2 * k, 2 * k, 2 * k); }
        c.strokeStyle = "rgba(239,170,100,0.9)"; c.lineWidth = 1; c.beginPath(); c.moveTo(t0 + 2 * k, ty2 + 2 * k); c.lineTo(t1 - 2 * k, ty2 + 2 * k); c.stroke();
      });
    };
  }

  var SUITOR_POSE = [0, 2, 1, 0, 2];

  M.extend("bow", {
    name: "Bend the Bow", kind: "archery level", level: "archery level", act: "DRAW",
    how: "Penelope's contest: string Odysseus's great bow and shoot an arrow through the rings of twelve axe heads. None of the suitors could even string it; now Odysseus, still in his beggar's rags, has it. Each letter has its own row of twelve axes, ending at a plaque. Aim along the right row (its axes light up when you are lined up), hold to draw, and let go while the meter is in the gold band: too soon and the arrow drops, too late and your arms shake. The arrow must fly through all twelve rings. The suitors lose patience while you wait or miss; then one throws a footstool or a cup along a dotted arc, so step back into the doorway.",
    rules: "Shooting through a wrong row costs a life. So does a thrown footstool or cup (Antinous threw a footstool at the beggar in Book 17), or using up your quiver (the swineherd Eumaeus brings a fresh one). An arrow that hits an axe costs no life, but it angers the suitors.",
    keys: "▲ ▼, W / S or the on-screen pad aim (or point with the mouse or a finger) · hold Space, DRAW or a mouse button to draw the bow, let go to shoot · hold ◀ or A to step back into the doorway.",
    tip: "BEND THE BOW — shoot through all twelve rings of the row with the right letter. Hold ◀ to step back when a suitor throws.",
    hint1: "Shoot an arrow through all twelve axe rings in the row with the right letter. The passage stays in the side panel.",
    hint2: "This question has two right letters. Shoot through both rows that carry them.",
    news: ["",
      "The rows of axes sway slowly up and down. Let go when your row is lined up.",
      "One arrow fewer in the quiver, and the suitors lose patience faster.",
      "Smaller rings: the holes in the axe heads are narrower, and the rows sway further.",
      "A draft from the open side door pushes your arrow up or down. The floating ash and the DRAFT sign show which way.",
      "The gold band on the draw meter is shorter: let go soon after the meter reaches it.",
      "Two suitors throw at once, and some throws aim at the doorway. Step back only when an arc ends where you stand.",
      "The axes no longer light up when you are lined up, and the dotted line is shorter.",
      "Stronger drafts, faster swaying, and only six arrows.",
      "Ithaca at last: three suitors throw at once and the quiver holds five arrows, on top of everything else."],
    params: bowParams
  }, {
    bowParams: function (n) { return bowParams(n); },

    setup_bow: function () {
      ensureBowArt(this);
      var P = bowParams(this.night), i;
      var B = this.bw = { P: P, rows: [], arrows: [], pool: [], suitors: [], flames: [], motes: [], t: 0, swayT: 0, aim: 0.1, aimMin: -0.4, aimMax: 0.9,
        ox: null, aimHold: 0, lpx: null, lpy: null, drawing: false, hold: 0, armed: false, cd: 0, shakeA: 0, quiver: P.quiver, pat: 1, volley: null,
        wph: rnd(0, 6), windA: 0, shots: 0, shotsQ: 0, wastedQ: 0, hits: 0, volleys: 0, glowRow: -1, lastFrame: -9, hallKey: null };
      B.axeKey = "md-bow-axe-" + Math.round(P.gap);
      canvasTex(this, B.axeKey, AX_W, axeH(Math.round(P.gap)), drawAxe(Math.round(P.gap)));
      B.gapT = Math.round(P.gap);
      this.cameras.main.setBackgroundColor("#160910");
      this.bowLayout();
      B.hall = this.add.image(0, 0, B.hallKey).setOrigin(0, 0).setDepth(0);
      B.glow = this.add.image(0, 0, "md-bow-glow").setDepth(1).setBlendMode(1);
      for (i = 0; i < 3; i++) B.flames.push(this.add.image(0, 0, "md-bow-flame").setOrigin(0.5, 1).setDepth(1));
      B.moteG = this.add.graphics().setDepth(1);
      B.rowG = this.add.graphics().setDepth(2);
      B.ody = this.add.image(0, 0, "md-bow-ody").setOrigin(0.5, 1).setDepth(8);
      B.bowG = this.add.graphics().setDepth(9);
      B.fxG = this.add.graphics().setDepth(12);
      B.uiG = this.add.graphics().setDepth(16);
      for (i = 0; i < SUITORS.length; i++) {
        var tex = "md-bow-suitor-" + SUITOR_POSE[i];
        B.suitors.push({ name: SUITORS[i][0], obj: SUITORS[i][1], tex: tex, up: false, spr: this.add.image(0, 0, tex).setOrigin(0.5, 1).setDepth(6),
          tag: this.add.text(0, 0, "", { fontFamily: "Georgia, 'Palatino Linotype', serif", fontSize: 13, color: C.glaze, fontStyle: "bold" }).setOrigin(1, 0.5).setDepth(16).setVisible(false) });
      }
      for (i = 0; i < 28; i++) B.motes.push({ x: Math.random(), y: Math.random(), r: rnd(0.8, 1.9), a: rnd(0.18, 0.45), ph: rnd(0, 6) });
      var serif = "Georgia, 'Palatino Linotype', serif";
      B.txPat = this.add.text(0, 0, "THE SUITORS' PATIENCE", { fontFamily: serif, fontSize: 13, color: C.glaze, fontStyle: "bold" }).setOrigin(0, 0.5).setDepth(16);
      B.txQuiver = this.add.text(0, 0, "ARROWS", { fontFamily: serif, fontSize: 12, color: C.bone, fontStyle: "bold" }).setOrigin(0, 1).setDepth(16);
      B.txMeter = this.add.text(0, 0, "DRAW", { fontFamily: serif, fontSize: 11, color: C.bone, fontStyle: "bold" }).setOrigin(0.5, 0).setDepth(16);
      B.txDraft = this.add.text(0, 0, "DRAFT", { fontFamily: serif, fontSize: 12, color: C.foam, fontStyle: "bold" }).setOrigin(1, 0.5).setDepth(16).setVisible(P.wind > 0);
      B.txShake = this.add.text(0, 0, "SHAKING!", { fontFamily: serif, fontSize: 13, color: "#ffb08a", fontStyle: "bold", stroke: C.glaze, strokeThickness: 4 }).setOrigin(0.5, 1).setDepth(16).setVisible(false);
      this.bowPlaceStatic();
      B.ox = B.mx;
      this.makeSol(B.mx, B.floorY - 140 * B.k, "right").setVisible(false);   /* Odysseus shoots; the sprite stays for coin pop-ups */
    },

    /* everything that depends on the canvas size */
    bowLayout: function () {
      var B = this.bw, W = this.W, H = this.H, k, i;
      k = B.k = clamp(Math.min(H / 768, W / 1000), 0.6, 1.25);
      B.floorY = Math.round(H * 0.76);
      B.mx = Math.round(clamp(W * 0.15, 118 * k, 210));
      /* the on-screen pad sits over the canvas's bottom-left corner: where it reaches into the hall, Odysseus
         (even stepped back) and the draw meter keep clear of it */
      var pad = this.bowPadBox();
      if (pad && pad.x0 < W * 0.4 && pad.y0 < B.floorY) B.mx = Math.max(B.mx, Math.round(pad.x1 + 92 * k));
      B.bx = B.mx - Math.round(58 * k);
      B.sx = B.mx + 6 * k; B.sy = B.floorY - 92 * k;              /* Odysseus's front shoulder: the rows fan out from here */
      B.x0 = Math.round(W * 0.52); B.x1 = Math.round(W * 0.875);
      B.dx = (B.x1 - B.x0) / 11;
      B.px = B.x1 + Math.max(30 * k, B.dx * 1.15);
      B.D = B.px - B.sx; B.V = B.D / FLIGHT; B.g = 2 * DROP * B.D / (FLIGHT * FLIGHT);
      B.top = Math.max(H * 0.12, 64 * k); B.bot = Math.min(B.floorY - 58 * k, H * 0.7);
      B.wallX = W - 10;
      B.tol = (B.gapT / 2 - 1.5) * k;
      B.above = (B.gapT / 2 + RIM + BL) * k; B.below = (B.gapT / 2 + RIM + HF) * k;
      B.hearthX = Math.round(B.sx + (B.x0 - B.sx) * 0.5);
      B.colX = [B.hearthX - W * 0.085, B.hearthX + W * 0.085];
      B.doorX = B.hearthX; B.doorW = 50 * k; B.doorH = 78 * k; B.doorY = Math.max(36 * k, H * 0.075);
      B.meterX = Math.max(12, B.bx - 52 * k); B.meterW = 12 * k; B.meterBot = B.floorY - 26 * k;
      if (pad && pad.y0 < B.floorY && pad.x1 > B.meterX - 6 * k && pad.x0 < B.meterX + 40 * k) B.meterBot = Math.min(B.meterBot, pad.y0 - 18 * k);
      B.meterTop = B.meterBot - 124 * k;
      B.suX = []; B.suY = H - 9 * k;
      for (i = 0; i < SUITORS.length; i++) B.suX.push(Math.round(W * (0.29 + i * 0.13)));
      B.patX0 = Math.round(W * 0.24); B.patY = B.floorY + 5 * k + 34 * k; B.patX1 = Math.round(W * 0.86);
      var key = "md-bow-hall-" + W + "x" + H;
      if (B.hallKey !== key) {
        var old = B.hallKey;
        canvasTex(this, key, W, H, drawHall(B, W, H));
        B.hallKey = key;
        if (B.hall) B.hall.setTexture(key);
        if (old && old !== key) { try { this.textures.remove(old); } catch (e) {} }
      }
    },
    /* the on-screen pad's box in canvas pixels (null when it is not shown) */
    bowPadBox: function () {
      try {
        var pad = document.querySelector("#controls .dpad") || document.querySelector(".dpad"), cv = this.game && this.game.canvas;
        if (!pad || !cv) return null;
        var a = pad.getBoundingClientRect(), c = cv.getBoundingClientRect();
        if (!a.width || !a.height || !c.width || !c.height) return null;
        var fx = this.W / c.width, fy = this.H / c.height;
        return { x0: (a.left - c.left) * fx, y0: (a.top - c.top) * fy, x1: (a.right - c.left) * fx, y1: (a.bottom - c.top) * fy };
      } catch (e) { return null; }
    },
    bowPlaceStatic: function () {
      var B = this.bw, k = B.k;
      B.hall.setPosition(0, 0);
      B.glow.setPosition(B.hearthX, B.floorY - 34 * k).setScale(2.4 * k, 1.6 * k);
      B.ody.setScale(k);
      B.suitors.forEach(function (su, i) { su.x = B.suX[i]; su.y = B.suY; su.spr.setPosition(su.x, su.y).setScale(k); su.tag.setFontSize(Math.round(13 * k)).setPosition(su.x - 16 * k, su.y - 84 * k); });
      B.txPat.setText("THE SUITORS' PATIENCE").setColor(C.glaze).setPosition(B.patX0, B.patY).setFontSize(Math.round(13 * k));
      B.patMode = false; B.patBar0 = B.patX0 + B.txPat.width + 12 * k;
      B.txQuiver.setPosition(B.meterX - 2, B.meterTop - 46 * k).setFontSize(Math.round(12 * k));
      B.txMeter.setPosition(B.meterX + B.meterW / 2, B.meterBot + 4 * k).setFontSize(Math.round(11 * k));
      B.txDraft.setPosition(B.doorX - 4 * k, B.doorY + B.doorH + 18 * k).setFontSize(Math.round(12 * k));
      B.txShake.setFontSize(Math.round(13 * k));
    },
    resize_bow: function () {
      var B = this.bw, self = this;
      this.bowLayout();
      this.bowPlaceStatic();
      B.ox = Math.abs(B.ox - B.mx) < Math.abs(B.ox - B.bx) ? B.mx : B.bx;
      /* the rows keep their far ends at the same share of the hall's height */
      var n = B.rows.length;
      B.rows.forEach(function (r, i) {
        r.yFar = n > 1 ? B.top + (B.bot - B.top) * i / (n - 1) : (B.top + B.bot) / 2;
        r.u0 = self.bowSolveU(r.yFar);
        r.axes.forEach(function (a) { a.setScale(B.k); });
        r.plaque.setScale(B.k); r.label.setFontSize(Math.round(26 * B.k));
      });
      this.bowAimLimits();
      /* arrows in the air go back in the quiver */
      B.arrows.slice().forEach(function (a) { if (a.state === "fly") { B.quiver += 1; self.bowFree(a); } else if (!a.keep) self.bowFree(a); else a.x = B.px - 8 * B.k; });
      this.player.setPosition(B.ox, B.floorY - 140 * B.k);
    },

    /* tan of the launch angle whose fully drawn arrow, from the shoulder, passes (x, y) (x: the plaques by default);
       a point too high to reach gets the steepest useful angle */
    bowSolveU: function (y, x) {
      var B = this.bw, D = (x == null ? B.px : x) - B.sx, q = B.g * D * D / (2 * B.V * B.V), c0 = q + B.sy - y;
      return (D - Math.sqrt(Math.max(0, D * D - 4 * q * c0))) / (2 * q);
    },
    /* a row's ring centre at x: the path of a fully drawn arrow at the row's (swaying) angle */
    bowRingY: function (row, x) {
      var B = this.bw, u = row.u, d = x - B.sx;
      return B.sy - d * u + B.g * d * d * (1 + u * u) / (2 * B.V * B.V);
    },
    /* the exact launch angle for a row right now (for the tests) */
    bowRowAim: function (i) { var r = this.bw.rows[i]; return r ? Math.atan(r.u) : 0; },
    bowAimLimits: function () {
      var B = this.bw, lo = 1e9, hi = -1e9;
      B.rows.forEach(function (r) { var a = Math.atan(r.u0); lo = Math.min(lo, a); hi = Math.max(hi, a); });
      if (!B.rows.length) { lo = 0; hi = 0.4; }
      B.aimMin = lo - 0.14; B.aimMax = hi + 0.14;
    },
    /* would a fully drawn arrow at this angle (no draft) thread every ring of the row? */
    bowLinedUp: function (ang, r) {
      var B = this.bw, u = Math.tan(ang), j;
      for (j = 0; j < 12; j++) {
        var x = B.x0 + j * B.dx, d = x - B.sx;
        var y = B.sy - d * u + B.g * d * d * (1 + u * u) / (2 * B.V * B.V);
        if (Math.abs(y - this.bowRingY(r, x)) > B.tol) return false;
      }
      return true;
    },

    answers_bow: function () {
      var B = this.bw, P = B.P, self = this, k = B.k;
      B.rows.forEach(function (r) { self.bowKillRow(r); });
      B.rows = [];
      B.arrows.slice().forEach(function (a) { self.bowFree(a); });
      this.bowEndVolley();
      var letters = this.choiceLetters(), n = letters.length;
      letters.forEach(function (Lt, i) {
        var yFar = n > 1 ? B.top + (B.bot - B.top) * i / (n - 1) : (B.top + B.bot) / 2;
        var r = { letter: Lt, state: "live", yFar: yFar, u0: self.bowSolveU(yFar), ph: i * 0.35, axes: [], flash: [] };
        r.u = r.u0;
        for (var j = 0; j < 12; j++) { r.axes.push(self.add.image(-99, -99, B.axeKey).setScale(k).setDepth(3)); r.flash.push(0); }
        r.plaque = self.add.image(-99, -99, "md-bow-plaque").setScale(k).setDepth(4);
        r.label = self.add.text(-99, -99, Lt, { fontFamily: "Georgia, 'Palatino Linotype', serif", fontSize: Math.round(26 * k), color: C.glaze, fontStyle: "bold" }).setOrigin(0.5).setDepth(5);
        if (self.extracted.indexOf(Lt) !== -1) r.state = "found";
        self.bowPaint(r);
        B.rows.push(r);
      });
      this.bowAimLimits();
      /* start aimed between two rows, never at one */
      if (B.rows.length >= 2) { var m = Math.floor(B.rows.length / 2); B.aim = (Math.atan(B.rows[m - 1].u0) + Math.atan(B.rows[m].u0)) / 2; }
      B.quiver = P.quiver; B.pat = 1; B.wastedQ = 0; B.shotsQ = 0; B.lastRow = null;
      B.drawing = false; B.hold = 0; B.armed = false;
      this.bowPlaceRows();
    },
    bowPaint: function (r) {
      var dead = r.state === "dead", found = r.state === "found";
      r.plaque.setTint(dead ? 0x8a8278 : found ? 0xbff0c8 : 0xffffff);
      r.label.setText(dead ? "✕" : found ? "✓" : r.letter).setColor(dead ? "#5a524a" : found ? "#1f6a3a" : C.glaze);
    },
    bowKillRow: function (r) {
      r.axes.forEach(function (a) { try { a.destroy(); } catch (e) {} });
      try { r.plaque.destroy(); r.label.destroy(); } catch (e2) {}
    },
    /* the rows this frame: sway, positions, tints, planks */
    bowPlaceRows: function () {
      var B = this.bw, P = B.P, k = B.k, self = this, g = B.rowG, swayA = P.sway * k / B.D;
      g.clear();
      B.rows.forEach(function (r, ri) {
        r.u = r.u0 + swayA * Math.sin(B.swayT * P.swaySpd + r.ph);
        var lit = ri === B.glowRow;
        r.axes.forEach(function (a, j) {
          var x = B.x0 + j * B.dx;
          a.setPosition(x, self.bowRingY(r, x));
          a.setTint(r.state === "dead" ? 0x6a6058 : r.state === "found" ? 0xa8f0c0 : (r.flash[j] > 0 || lit) ? 0xffffff : 0xc8b8a0);
        });
        var py = self.bowRingY(r, B.px);
        r.plaque.setPosition(B.px, py); r.label.setPosition(B.px, py + 1 * k);
        /* the plank the axes stand on */
        var xa = B.x0 - 14 * k, xb = B.px - 6 * k, ya = self.bowRingY(r, xa) + B.below, yb = self.bowRingY(r, xb) + B.below;
        g.lineStyle(6 * k, 0x3a2010, 1); g.lineBetween(xa, ya + 3 * k, xb, yb + 3 * k);
        g.lineStyle(2 * k, r.state === "dead" ? 0x5a524a : 0x9a6a3a, 1); g.lineBetween(xa, ya + 1 * k, xb, yb + 1 * k);
        g.fillStyle(0x3a2010, 1); g.fillCircle(xa, ya + 3 * k, 4 * k);
      });
    },

    tick_bow: function (s, inp, ms) {
      var B = this.bw, P = B.P, k = B.k, i, frame = this.game && this.game.loop ? this.game.loop.frame : 0;
      if (frame !== B.lastFrame + 1) B.armed = false;   /* frames went by without a tick (the reading pop-up): a key still held does not draw */
      B.lastFrame = frame;
      B.t += s; B.swayT += s;
      if (B.cd > 0) B.cd -= ms;
      B.fxG.clear(); B.uiG.clear(); B.bowG.clear(); B.moteG.clear();
      if (!B.told) { B.told = true; this.toast("Line the dotted line up with a row's rings, hold Space or DRAW, and let go in the gold band.", 5200); }

      /* Odysseus: on his mark, or (◀ held) back in the doorway */
      var back = inp.ax < 0;
      var tx = back ? B.bx : B.mx, sp = 640 * k * s;
      B.ox += clamp(tx - B.ox, -sp, sp);
      var atMark = Math.abs(B.ox - B.mx) < 0.5;

      /* aim: the keys or the pad; else the pointer, when it moves or is held down */
      var p = this.ptr;
      if (inp.ay) {
        if (!B.aimHold) B.aim -= inp.ay * 0.15 * DEG;
        B.aimHold += ms;
        B.aim -= inp.ay * Math.min(32, 8 + B.aimHold / 500 * 24) * DEG * s;
      } else {
        B.aimHold = 0;
        var moved = B.lpx != null && Math.abs(p.x - B.lpx) + Math.abs(p.y - B.lpy) > 2;
        if (moved || inp.ptr) B.aim = Math.atan(this.bowSolveU(p.y, Math.max(p.x, B.sx + 70 * k)));   /* the arrow's path runs through the pointer */
      }
      B.lpx = p.x; B.lpy = p.y;
      B.aim = clamp(B.aim, B.aimMin, B.aimMax);

      /* the draw: hold to draw, let go to shoot */
      if (!inp.fire) B.armed = true;
      var ready = atMark && !this._between && B.quiver > 0;
      if (B.drawing) {
        if (!ready || back) { B.drawing = false; B.hold = 0; }
        else if (inp.fire) B.hold += ms;
        else this.bowRelease();
      } else if (inp.fire && B.armed && ready && B.cd <= 0) { B.drawing = true; B.hold = 0; }
      else if (inp.fire && B.armed && !atMark && !B.toldBack) { B.toldBack = true; this.toast("Step back out of the doorway (let go of ◀) to shoot.", 2400); }
      var shake = 0;
      if (B.drawing) {
        var over = B.hold - DRAW_MS - P.sweetMs;
        if (over > 0) {
          shake = P.shakeDeg * DEG * (0.3 + 0.7 * Math.min(1, over / P.shakeMs));
          if (!B.toldShake) { B.toldShake = true; this.toast("Your arms are shaking! Let go sooner, while the meter is in the gold band.", 3200); }
        }
      }
      B.shakeA = shake * (0.6 * Math.sin(B.t * 33) + 0.4 * Math.sin(B.t * 51 + 1));

      /* the draft from the side door (level 41 on): a slow gust, up or down */
      var windMax = 2 * P.wind * k / (FLIGHT * FLIGHT);
      B.windA = P.wind ? windMax * (0.62 * Math.sin(B.t * 0.37 + B.wph) + 0.38 * Math.sin(B.t * 0.93 + B.wph * 2)) : 0;
      if (P.wind && !B.toldDraft && B.t > 2) { B.toldDraft = true; this.toast("A draft from the open side door pushes your arrow up or down. Watch the floating ash and the DRAFT sign.", 4200); }

      /* the rows; which one the aim lines up with */
      B.glowRow = -1;
      if (P.glow && atMark && !this._between) {
        for (i = 0; i < B.rows.length; i++) if (B.rows[i].state === "live" && this.bowLinedUp(B.aim, B.rows[i])) { B.glowRow = i; break; }
      }
      B.rows.forEach(function (r) { for (var j = 0; j < 12; j++) if (r.flash[j] > 0) r.flash[j] -= ms; });
      this.bowPlaceRows();

      /* arrows */
      var ay = B.g - B.windA;
      var list = B.arrows.slice();
      for (i = 0; i < list.length; i++) {
        var a = list[i];
        if (B.arrows.indexOf(a) === -1) continue;
        if (a.state === "fly") this.bowFly(a, s, ay);
        else if (a.state === "stuck") {
          a.t += ms;
          a.spr.setRotation(a.rot + Math.sin(a.t * 0.07) * 0.09 * Math.max(0, 1 - a.t / 380));
          if (a.row && B.rows.indexOf(a.row) !== -1) { a.y = this.bowRingY(a.row, a.x) + a.dy; a.spr.setPosition(a.x, a.y); }
          if (!a.keep && a.t > 420) { a.state = "drop"; a.t = 0; a.vy = 0; }
        } else if (a.state === "drop") {
          a.t += ms; a.vy += 1100 * k * s; a.y = Math.min(B.floorY - 2, a.y + a.vy * s); a.rot += 4 * s * (a.y < B.floorY - 2 ? 1 : 0);
          a.spr.setPosition(a.x, a.y).setRotation(a.rot).setAlpha(clamp(1 - (a.t - 300) / 600, 0, 1));
          if (a.t >= 900) this.bowFree(a);
        }
        if (this._finishing) return;
      }

      /* the suitors' patience, and what they throw when it runs out */
      if (!this._between && !B.volley) {
        B.pat -= P.drain * s;
        if (B.pat < 0.3 && !B.toldPat) { B.toldPat = true; this.toast("The suitors are losing patience! Shoot soon, or they'll start throwing things.", 3200); }
        if (B.pat <= 0) this.bowVolley();
      }
      if (B.volley) { this.bowThrows(s, ms); if (this._finishing) return; }
      B.suitors.forEach(function (su, j) {
        var bob = !su.up && B.pat < 0.35 ? -Math.abs(Math.sin(B.t * 7 + j * 1.7)) * 3 * k : 0;
        su.spr.setPosition(su.x, su.y + bob);
      });

      this.bowDrawHearth(s);
      this.bowDrawOdysseus(atMark);
      this.bowDrawGuide(atMark);
      this.bowDrawUi(atMark);
    },

    bowRelease: function () {
      var B = this.bw, hold = B.hold;
      B.drawing = false; B.hold = 0;
      if (hold < 140) {
        if (!B.toldTap) { B.toldTap = true; this.toast("Hold to draw the bow, then let go to shoot.", 2400); }
        return null;
      }
      var pw = hold >= DRAW_MS ? 1 : 0.5 + 0.5 * hold / DRAW_MS;
      if (pw < 1 && !B.toldWeak) { B.toldWeak = true; this.toast("Too soon! A half-drawn bow shoots a weak arrow that drops. Hold until the meter reaches the gold band.", 3600); }
      return this.bowShoot(B.aim + B.shakeA, pw);
    },
    /* an arrow leaves the bow at this angle and power (1 = a full draw) */
    bowShoot: function (ang, pw) {
      var B = this.bw, k = B.k, v = B.V * (pw || 1);
      var a = B.pool.pop() || { spr: this.add.image(0, 0, "md-bow-arrow").setOrigin(1, 0.5).setDepth(10) };
      a.state = "fly"; a.rr = -1; a.rk = 0; a.keep = false; a.row = null; a.t = 0; a.dy = 0;
      a.x = B.sx; a.y = B.sy; a.vx = v * Math.cos(ang); a.vy = -v * Math.sin(ang);
      /* it starts at the bow, partway along its own path */
      var t0 = 44 * k / v, ay = B.g - B.windA;
      a.x += a.vx * t0; a.y += a.vy * t0 + 0.5 * ay * t0 * t0; a.vy += ay * t0;
      a.spr.setScale(k).setVisible(true).setAlpha(1).setPosition(a.x, a.y).setRotation(Math.atan2(a.vy, a.vx));
      B.arrows.push(a);
      B.quiver = Math.max(0, B.quiver - 1); B.shots += 1; B.shotsQ += 1; B.cd = 250;
      snd("shot");
      try { var R = window.SolRealms; if (R && R.blip) { R.blip(196, 98, 0.22, "triangle", 0.05); R.blip(392, 260, 0.12, "sine", 0.025); } } catch (e) {}
      return a;
    },
    bowFree: function (a) {
      var B = this.bw, i = B.arrows.indexOf(a);
      if (i !== -1) B.arrows.splice(i, 1);
      a.state = "free"; a.keep = false; a.row = null;
      try { a.spr.setVisible(false); } catch (e) {}
      if (B.pool.indexOf(a) === -1) B.pool.push(a);
    },
    bowFly: function (a, s, ay) {
      var rem = s;
      while (rem > 1e-6 && a.state === "fly") {
        var dt = Math.min(rem, 5 / Math.max(150, Math.abs(a.vx)));
        var x0 = a.x, y0 = a.y;
        a.x += a.vx * dt; a.y += a.vy * dt + 0.5 * ay * dt * dt; a.vy += ay * dt;
        rem -= dt;
        this.bowHits(a, x0, y0);
      }
      if (a.state === "fly") a.spr.setPosition(a.x, a.y).setRotation(Math.atan2(a.vy, a.vx));
    },
    /* what the arrow met between (x0, y0) and where it is now */
    bowHits: function (a, x0, y0) {
      var B = this.bw, k = B.k, x1 = a.x, y1 = a.y, r, row, j;
      if (y1 >= B.floorY - 3) return this.bowStick(a, x1, B.floorY - 3, "floor");
      if (x1 >= B.wallX) return this.bowStick(a, B.wallX, y1, "wall");
      if (y1 < -50 * k || x1 < -40) { this.bowFree(a); return this.bowWasted("away"); }
      /* the axes: an arrow crossing an axe's line goes through its ring or hits it */
      var ja = Math.max(0, Math.floor((x0 - B.x0) / B.dx) + 1), jb = Math.min(11, Math.floor((x1 - B.x0) / B.dx));
      for (j = ja; j <= jb; j++) {
        var X = B.x0 + j * B.dx;
        if (X <= x0 || X > x1) continue;
        var Y = y0 + (y1 - y0) * (X - x0) / (x1 - x0);
        for (r = 0; r < B.rows.length; r++) {
          row = B.rows[r];
          var d = Y - this.bowRingY(row, X);
          if (Math.abs(d) <= B.tol) {
            if (a.rr === r && a.rk === j) a.rk = j + 1; else { a.rr = r; a.rk = j === 0 ? 1 : -99; }
            row.flash[j] = 320;
            if (a.rk > 0) this.bowPing(j);
          } else if (d >= -B.above && d <= B.below) {
            return this.bowStick(a, X - 5 * k, Y, "axe", row);
          }
        }
      }
      /* the planks under the rows */
      for (r = 0; r < B.rows.length; r++) {
        row = B.rows[r];
        if (x1 < B.x0 - 14 * k || x0 > B.px) continue;
        var d0 = y0 - (this.bowRingY(row, x0) + B.below), d1 = y1 - (this.bowRingY(row, x1) + B.below), th = 6 * k;
        if ((d1 >= 0 && d1 <= th) || (d0 < 0) !== (d1 < 0) || (d0 > th) !== (d1 > th)) return this.bowStick(a, x1, y1 - d1 + clamp(d1, 0, th), "plank", row);
      }
      /* the plaques */
      var XP = B.px - 8 * k;
      if (x0 < XP && x1 >= XP) {
        var Yp = y0 + (y1 - y0) * (XP - x0) / (x1 - x0);
        for (r = 0; r < B.rows.length; r++) {
          row = B.rows[r];
          var cy = this.bowRingY(row, B.px);
          if (Math.abs(Yp - cy) <= PLAQUE_R * k) return this.bowPlaque(a, row, r, XP, Yp, cy);
        }
      }
      return null;
    },
    bowPing: function (j) {
      try { var R = window.SolRealms; if (R && R.blip) R.blip(1250 + j * 75, 0, 0.05, "sine", 0.014); } catch (e) {}
    },
    bowThunk: function () {
      try { var R = window.SolRealms; if (R && R.blip) { R.blip(150, 60, 0.12, "triangle", 0.07); R.hiss(0.07, 900, 0.03); } } catch (e) {}
    },
    /* the arrow stops: it quivers a moment and falls (a wasted arrow) */
    bowStick: function (a, x, y, what, row) {
      a.state = "stuck"; a.t = 0; a.x = x; a.y = y; a.rot = Math.atan2(a.vy, a.vx); a.row = row || null; a.dy = row ? y - this.bowRingY(row, x) : 0;
      a.spr.setPosition(x, y).setRotation(a.rot);
      this.bowThunk();
      this.burst(x, y, what === "axe" ? 0xe8b04a : 0x9a7a5a, 6);
      this.bowWasted(what);
      return what;
    },
    bowWasted: function (what) {
      var B = this.bw, P = B.P;
      B.wastedQ += 1;
      if (!this._between) B.pat -= P.missCost;
      if (!B.toldMiss) {
        B.toldMiss = true;
        this.toast(what === "axe" ? "Thunk! That arrow hit an axe head. It has to fly through all twelve rings." :
          what === "plank" ? "Thunk! That arrow hit the plank under the axes. Aim along a row of rings." :
          "Missed the rows! Line the dotted line up with a row's rings before you let go.", 3400);
      }
      this.bowCheckQuiver();
    },
    /* the last arrow is gone and none is in the air: a life, and Eumaeus brings a fresh quiver */
    bowCheckQuiver: function () {
      var B = this.bw;
      if (B.quiver > 0 || this._between || this._finishing || this.ended) return;
      if (B.arrows.some(function (a) { return a.state === "fly"; })) return;
      B.quiver = B.P.quiver;
      this.loseLife("hit", "YOUR QUIVER IS EMPTY");
      if (!this._finishing) this.toast("Out of arrows! That costs a life. The swineherd Eumaeus brings you a fresh quiver.", 3400);
    },
    /* the arrow reached a plaque: through all twelve rings it answers with that letter */
    bowPlaque: function (a, row, r, x, y, cy) {
      var B = this.bw, P = B.P, k = B.k;
      a.state = "stuck"; a.t = 0; a.x = x; a.y = y; a.rot = Math.atan2(a.vy, a.vx); a.row = row; a.dy = y - this.bowRingY(row, x);
      a.spr.setPosition(x, y).setRotation(a.rot);
      this.bowThunk();
      if (row.state !== "live") {
        this.toast(row.state === "dead" ? "That row is crossed out. Try another letter." : "You already found that letter. Shoot the other right one.", 2600);
        return this.bowWasted("plaque");
      }
      if (a.rr !== r || a.rk !== 12) {
        if (!B.toldTwelve) { B.toldTwelve = true; this.toast("It only counts if the arrow flies through all twelve rings.", 2600); }
        return this.bowWasted("plaque");
      }
      a.keep = true;
      this.burst(B.px, cy, 0xffe08a, 18);
      var clean = !B.wastedQ && !this.claimWrong;
      B.lastRow = row;
      var res = this.answerPick(row.letter, B.px, cy - 30 * k);
      if (res === "wrong") {
        row.state = "dead"; this.bowPaint(row);
        if (!this._between) B.pat -= P.missCost;
        this.bowCheckQuiver();
      } else if (res === "partial") {
        row.state = "found"; this.bowPaint(row);
      } else if (res === "done") {
        if (!B.toldZeus) { B.toldZeus = true; try { var R = window.SolRealms; if (R && R.hiss) { R.hiss(1.4, 120, 0.09); R.blip(70, 40, 1.2, "sawtooth", 0.04); } } catch (e) {} }
        if (clean && !this.ended) this.awardBonusPoints(1000, "All twelve rings, no arrow wasted");
      }
      return res;
    },

    /* ── the suitors throw ── */
    bowVolley: function () {
      var B = this.bw, P = B.P, picks = shuffle([0, 1, 2, 3, 4]).slice(0, P.throwers), list = [], names = [];
      picks.forEach(function (si, i) {
        var target = Math.random() < (i === 0 ? P.doorP * 0.5 : P.doorP) ? "back" : "mark";   /* the first one mostly at the mark */
        list.push({ si: si, obj: SUITORS[si][1], target: target, phase: "wait", t: -i * (P.warnMs * 0.5 + 260) });
        names.push(SUITORS[si][0]);
      });
      B.volley = { list: list };
      B.volleys += 1; B.pat = 0;
      var what = list[0].obj === "stool" ? "a footstool" : "a wine cup";
      this.toast(names.length > 1 ? names.join(" and ") + " are throwing! Watch where each arc ends: hold ◀ (or A) to step back only for the ones aimed at you." :
        names[0] + " throws " + what + "! Hold ◀ (or A) to step back into the doorway until it lands.", 3800);
      try { var R = window.SolRealms; if (R && R.blip) { R.blip(260, 180, 0.25, "sawtooth", 0.03); R.blip(220, 150, 0.3, "sawtooth", 0.03, 0.12); } } catch (e) {}
      return B.volley;
    },
    bowThrowPath: function (th) {
      var B = this.bw, k = B.k, su = B.suitors[th.si];
      var p0 = { x: su.x + 20 * k, y: su.y - 96 * k }, tx = th.target === "back" ? B.bx : B.mx, ty = B.floorY - 74 * k;
      return { p0: p0, p1: { x: (p0.x + tx) / 2, y: Math.min(p0.y, ty) - 170 * k }, p2: { x: tx, y: ty } };
    },
    bowThrows: function (s, ms) {
      var B = this.bw, P = B.P, k = B.k, fx = B.fxG, self = this, live = 0;
      function bez(q, u) { var v = 1 - u; return { x: v * v * q.p0.x + 2 * v * u * q.p1.x + u * u * q.p2.x, y: v * v * q.p0.y + 2 * v * u * q.p1.y + u * u * q.p2.y }; }
      B.volley.list.forEach(function (th) {
        if (th.phase === "gone") return;
        live++;
        th.t += ms;
        var su = B.suitors[th.si];
        if (th.phase === "wait") {
          if (th.t < 0) return;
          th.phase = "warn"; th.t = 0;
          su.up = true; su.spr.setTexture("md-bow-suitor-up");
          su.tag.setText(su.name.toUpperCase() + "!").setPosition(su.x - 16 * k, su.y - 84 * k).setVisible(true);
          th.spr = self.add.image(0, 0, "md-bow-" + th.obj).setScale(k).setDepth(13);
        }
        var q = self.bowThrowPath(th);
        if (th.phase === "warn") {
          var kk = clamp(th.t / P.warnMs, 0, 1), n = 30, u, pt, j;
          /* the telegraph: a dotted arc that fills in, and a ring where it will land */
          for (j = 1; j < n; j++) {
            u = j / n; if (u > 0.25 + kk * 0.75) break;
            pt = bez(q, u);
            fx.fillStyle(0x140c0a, 0.8); fx.fillCircle(pt.x, pt.y, (3.2 + 1.2 * kk) * k);
            fx.fillStyle(j % 3 ? 0xefe6d2 : 0xe8b04a, 0.7 + 0.3 * kk); fx.fillCircle(pt.x, pt.y, (2 + 1.2 * kk) * k);
          }
          var pulse = 1 + 0.12 * Math.sin(B.t * 14);
          fx.fillStyle(0xd9772b, 0.3 + 0.4 * kk); fx.fillEllipse(q.p2.x, B.floorY - 3 * k, 50 * k * pulse, 10 * k);
          fx.lineStyle(5 * k, 0x140c0a, 0.5 * (0.5 + kk)); fx.strokeCircle(q.p2.x, q.p2.y, (32 - 10 * kk) * k * pulse);
          fx.lineStyle(3 * k, 0xff8a5a, 0.55 + 0.45 * kk); fx.strokeCircle(q.p2.x, q.p2.y, (32 - 10 * kk) * k * pulse);
          /* a warning mark over the spot */
          var wy = B.floorY - 160 * k + Math.sin(B.t * 10) * 3 * k;
          fx.fillStyle(0x140c0a, 0.85); fx.fillTriangle(q.p2.x - 11 * k, wy - 4 * k, q.p2.x + 11 * k, wy - 4 * k, q.p2.x, wy + 14 * k);
          fx.fillStyle(0xff8a5a, 1); fx.fillTriangle(q.p2.x - 7.5 * k, wy - 1.6 * k, q.p2.x + 7.5 * k, wy - 1.6 * k, q.p2.x, wy + 10 * k);
          th.spr.setPosition(q.p0.x, q.p0.y).setRotation(Math.sin(B.t * 9) * 0.25);
          if (th.t >= P.warnMs) {
            th.phase = "fly"; th.t = 0;
            try { var R = window.SolRealms; if (R && R.hiss) R.hiss(0.45, 1300, 0.05); } catch (e) {}
          }
        } else if (th.phase === "fly") {
          var uu = clamp(th.t / P.flightMs, 0, 1), at = bez(q, uu);
          if (th.t > 280 && su.up) { su.up = false; su.spr.setTexture(su.tex); su.tag.setVisible(false); }
          fx.fillStyle(0xd9772b, 0.4); fx.fillEllipse(q.p2.x, B.floorY - 3 * k, 46 * k, 9 * k);
          th.spr.setPosition(at.x, at.y).setRotation(uu * 7.5);
          if (uu >= 1) {
            th.phase = "fall"; th.t = 0; th.x = at.x; th.y = at.y; th.vx = -90 * k; th.vy = -160 * k;
            if (Math.abs(B.ox - q.p2.x) < 26 * k && !self.ended && !self._finishing) {
              self.burst(at.x, at.y, 0xffb08a, 14);
              if (self.loseLife("hit", th.obj === "stool" ? "A FOOTSTOOL HIT YOU" : "A WINE CUP HIT YOU")) B.hits += 1;
              th.vx = 120 * k;
            } else {
              try { var R2 = window.SolRealms; if (R2 && R2.blip) R2.blip(520, 300, 0.08, "square", 0.02); } catch (e2) {}
            }
          }
        } else if (th.phase === "fall") {
          th.vy += 1100 * k * s; th.x += th.vx * s; th.y += th.vy * s;
          if (th.y > B.floorY - 8 * k) { th.y = B.floorY - 8 * k; th.vy *= -0.3; th.vx *= 0.6; }
          th.spr.setPosition(th.x, th.y).setRotation(th.spr.rotation + th.vx * s * 0.04).setAlpha(clamp(1 - (th.t - 400) / 500, 0, 1));
          if (th.t >= 900) { try { th.spr.destroy(); } catch (e3) {} th.spr = null; th.phase = "gone"; }
        }
      });
      if (!live) { B.volley = null; B.pat = P.refill; }
    },
    bowEndVolley: function () {
      var B = this.bw;
      if (B.volley) B.volley.list.forEach(function (th) { if (th.spr) { try { th.spr.destroy(); } catch (e) {} th.spr = null; } });
      B.volley = null;
      B.suitors.forEach(function (su) { su.up = false; su.spr.setTexture(su.tex); su.tag.setVisible(false); });
    },

    /* ── drawing every frame ── */
    bowDrawHearth: function (s) {
      var B = this.bw, k = B.k, g = B.moteG, i, t = B.t;
      B.flames.forEach(function (f, j) {
        f.setPosition(B.hearthX + (j - 1) * 14 * k + Math.sin(t * 5 + j) * 1.5 * k, B.floorY - 26 * k)
          .setScale(k * (j === 1 ? 1.1 : 0.8), k * (j === 1 ? 1.15 : 0.85) * (0.86 + 0.16 * Math.sin(t * 9 + j * 2.1) + 0.07 * Math.sin(t * 23 + j)));
      });
      B.glow.setAlpha(0.75 + 0.12 * Math.sin(t * 7) + 0.06 * Math.sin(t * 17));
      /* floating ash: it rises with the hearth's heat, and the draft carries it up or down */
      var P = B.P, windMax = 2 * P.wind * k / (FLIGHT * FLIGHT), wn = windMax ? B.windA / windMax : 0;
      var x0 = B.sx + 40 * k, x1 = B.px, y0 = 30 * k, y1 = B.floorY - 10 * k, vy = (16 + wn * 120) / (y1 - y0);
      for (i = 0; i < B.motes.length; i++) {
        var m = B.motes[i];
        m.y -= vy * s * (0.7 + m.r * 0.25); m.x += 0.004 * s * Math.sin(t + m.ph);
        if (m.y < 0) m.y += 1; if (m.y > 1) m.y -= 1;
        if (m.x < 0) m.x += 1; if (m.x > 1) m.x -= 1;
        g.fillStyle(i % 3 ? 0xe8b04a : 0xefe6d2, m.a); g.fillCircle(x0 + m.x * (x1 - x0), y0 + m.y * (y1 - y0), m.r * k);
      }
    },
    bowDrawOdysseus: function (atMark) {
      var B = this.bw, k = B.k, g = B.bowG, fy = B.floorY, ox = B.ox;
      B.ody.setPosition(ox, fy);
      this.blink(B.ody);
      g.setAlpha(B.ody.alpha);
      this.player.setPosition(ox, fy - 140 * k);
      var a = B.aim + B.shakeA, c = Math.cos(a), sn = Math.sin(a);
      var dx = c, dy = -sn, ux = -sn, uy = -c;                    /* along the aim, and "up" across it */
      var pw = B.drawing ? Math.min(1, B.hold / DRAW_MS) : 0;
      var sfx = ox + 6 * k, sfy = fy - 92 * k, srx = ox - 1 * k, sry = fy - 90 * k;
      var gx = sfx + dx * 34 * k, gy = sfy + dy * 34 * k;          /* the bow hand */
      var nx = gx - dx * (6 + 40 * pw) * k, ny = gy - dy * (6 + 40 * pw) * k;   /* the nock and the drawing hand */
      var Lb = 44 * k, bend = (5 + 13 * pw) * k;
      var t1x = gx + ux * Lb - dx * bend, t1y = gy + uy * Lb - dy * bend, t2x = gx - ux * Lb - dx * bend, t2y = gy - uy * Lb - dy * bend;
      /* the drawing arm, behind the bow */
      var ex = (srx + nx) / 2 - ux * 9 * k - dx * 4 * k, ey = (sry + ny) / 2 - uy * 9 * k - dy * 4 * k;
      g.lineStyle(8 * k, 0x140c0a, 1); g.strokePoints([{ x: srx, y: sry }, { x: ex, y: ey }, { x: nx, y: ny }]);
      g.lineStyle(5.4 * k, 0xd9772b, 1); g.strokePoints([{ x: srx, y: sry }, { x: ex, y: ey }, { x: nx, y: ny }]);
      /* the string: two straight runs from the tips to the nock */
      g.lineStyle(1.8 * k, 0xefe6d2, 0.95); g.strokePoints([{ x: t1x, y: t1y }, { x: nx, y: ny }, { x: t2x, y: t2y }]);
      /* the bow: two limbs bulging forward, horn tips curling out */
      var pts = [], i, u;
      for (i = 0; i <= 12; i++) {
        u = i / 12 * 2 - 1;                                           /* -1 lower tip … 1 upper tip */
        var fwd = (1 - u * u) * (7 + 4 * pw) * k - Math.abs(u) * bend;
        pts.push({ x: gx + ux * Lb * u + dx * fwd, y: gy + uy * Lb * u + dy * fwd });
      }
      g.lineStyle(6.5 * k, 0x2a1408, 1); g.strokePoints(pts);
      g.lineStyle(3.8 * k, 0xc8902a, 1); g.strokePoints(pts);
      g.lineStyle(3 * k, 0xefe6d2, 1);
      g.lineBetween(t1x, t1y, t1x + dx * 5 * k + ux * 2 * k, t1y + dy * 5 * k + uy * 2 * k);
      g.lineBetween(t2x, t2y, t2x + dx * 5 * k - ux * 2 * k, t2y + dy * 5 * k - uy * 2 * k);
      /* the arrow on the string */
      if (atMark && B.quiver > 0 && !this._between && B.cd <= 120) {
        var hx = nx + dx * 52 * k, hy = ny + dy * 52 * k;
        g.lineStyle(3.2 * k, 0x140c0a, 1); g.lineBetween(nx, ny, hx - dx * 8 * k, hy - dy * 8 * k);
        g.lineStyle(1.8 * k, 0xefe6d2, 1); g.lineBetween(nx, ny, hx - dx * 8 * k, hy - dy * 8 * k);
        g.fillStyle(0xe8a83c, 1); g.fillTriangle(hx, hy, hx - dx * 11 * k + ux * 4 * k, hy - dy * 11 * k + uy * 4 * k, hx - dx * 11 * k - ux * 4 * k, hy - dy * 11 * k - uy * 4 * k);
        g.fillStyle(0xd9772b, 1); g.fillTriangle(nx + dx * 2 * k, ny + dy * 2 * k, nx + dx * 12 * k + ux * 4 * k, ny + dy * 12 * k + uy * 4 * k, nx + dx * 12 * k, ny + dy * 12 * k);
      }
      /* the bow arm, in front */
      g.lineStyle(8 * k, 0x140c0a, 1); g.lineBetween(sfx, sfy, gx, gy);
      g.lineStyle(5.4 * k, 0xd9772b, 1); g.lineBetween(sfx, sfy, gx, gy);
      g.fillStyle(0xd9772b, 1); g.fillCircle(gx, gy, 3.6 * k); g.fillCircle(nx, ny, 3.4 * k);
    },
    /* the dotted line: where a fully drawn arrow starts out (no draft) */
    bowDrawGuide: function (atMark) {
      var B = this.bw, P = B.P, k = B.k, fx = B.fxG;
      if (!atMark || this._between || B.quiver <= 0) return;
      var a = B.aim + B.shakeA, u = Math.tan(a), x = B.sx + 56 * k * Math.cos(a), end = x + P.guide * (B.x0 - x);
      var lit = B.glowRow >= 0, col = lit ? 0x9aefc0 : 0xe8b04a;
      for (; x <= end; x += 15 * k) {
        var d = x - B.sx, y = B.sy - d * u + B.g * d * d * (1 + u * u) / (2 * B.V * B.V), f = 1 - (x - B.sx) / Math.max(1, end - B.sx) * 0.6;
        fx.fillStyle(col, 0.85 * f); fx.fillCircle(x, y, (lit ? 2.8 : 2.3) * k);
      }
      if (lit) {
        var r = B.rows[B.glowRow], cy = this.bowRingY(r, B.px), pulse = 1 + 0.06 * Math.sin(B.t * 8);
        fx.lineStyle(3 * k, 0x9aefc0, 0.9); fx.strokeCircle(B.px, cy, (PLAQUE_R + 5) * k * pulse);
      }
      /* the rings an arrow just went through glow for a moment */
      B.rows.forEach(function (r) {
        r.flash.forEach(function (f, j) {
          if (f <= 0) return;
          fx.lineStyle(2.5 * k, 0xfff2b0, Math.min(1, f / 200)); fx.strokeEllipse(B.x0 + j * B.dx, r.axes[j].y, 18 * k, (B.gapT + 10) * k);
        });
      });
    },
    bowDrawUi: function (atMark) {
      var B = this.bw, P = B.P, k = B.k, g = B.uiG, i;
      /* the draw meter: drawing (dim) → the gold band (steady) → shaking (red) */
      var mx = B.meterX, mw = B.meterW, top = B.meterTop, bot = B.meterBot, hgt = bot - top;
      var total = DRAW_MS + P.sweetMs + P.shakeMs, y1 = bot - hgt * DRAW_MS / total, y2 = bot - hgt * (DRAW_MS + P.sweetMs) / total;
      g.fillStyle(0x140c0a, 0.9); g.fillRect(mx - 3 * k, top - 3 * k, mw + 6 * k, hgt + 6 * k);
      g.fillStyle(0x5a3a22, 1); g.fillRect(mx, y1, mw, bot - y1);
      g.fillStyle(0xe8b04a, 1); g.fillRect(mx, y2, mw, y1 - y2);
      g.fillStyle(0x8a2a1a, 1); g.fillRect(mx, top, mw, y2 - top);
      var f = B.drawing ? Math.min(1, B.hold / total) : 0;
      if (f > 0) {
        var fy = bot - hgt * f, inGold = B.hold >= DRAW_MS && B.hold <= DRAW_MS + P.sweetMs;
        g.fillStyle(inGold ? 0xfff6d0 : 0xefe6d2, inGold ? 0.75 : 0.5); g.fillRect(mx, fy, mw, bot - fy);
        g.lineStyle(2.5 * k, inGold ? 0x9aefc0 : 0xefe6d2, 1); g.lineBetween(mx - 5 * k, fy, mx + mw + 5 * k, fy);
        if (inGold) { g.lineStyle(2 * k, 0x9aefc0, 0.8 + 0.2 * Math.sin(B.t * 12)); g.strokeRect(mx - 3 * k, y2 - 2 * k, mw + 6 * k, y1 - y2 + 4 * k); }
      }
      g.lineStyle(1.5 * k, 0xefe6d2, 0.8); g.strokeRect(mx - 3 * k, top - 3 * k, mw + 6 * k, hgt + 6 * k);
      B.txShake.setVisible(B.shakeA !== 0 && B.drawing).setPosition(B.ox, B.floorY - 146 * k);
      /* the quiver */
      var qx = B.meterX, qy = B.meterTop - 40 * k;
      for (i = 0; i < B.P.quiver; i++) {
        var on = i < B.quiver, ax = qx + i * 7 * k;
        g.lineStyle(2 * k, on ? 0xefe6d2 : 0x5a4a44, on ? 1 : 0.6); g.lineBetween(ax, qy, ax, qy + 18 * k);
        g.fillStyle(on ? 0xe8a83c : 0x5a4a44, on ? 1 : 0.6); g.fillTriangle(ax, qy - 2 * k, ax - 2.6 * k, qy + 4 * k, ax + 2.6 * k, qy + 4 * k);
        g.fillStyle(on ? 0xd9772b : 0x5a4a44, on ? 1 : 0.6); g.fillRect(ax - 2 * k, qy + 14 * k, 4 * k, 4 * k);
      }
      B.txQuiver.setText("ARROWS " + B.quiver);
      /* the suitors' patience, over their tables */
      var px0 = B.patBar0, px1 = B.patX1, ph = 12 * k, py = B.patY - ph / 2, pf = clamp(B.pat, 0, 1);
      var flashing = !!B.volley && Math.floor(B.t * 6) % 2 === 0;
      g.fillStyle(0xefe6d2, 1); g.fillRect(px0, py, px1 - px0, ph);
      g.fillStyle(pf < 0.3 || B.volley ? 0xb8321e : 0x3a0f2a, 1); g.fillRect(px0, py, (px1 - px0) * pf, ph);
      g.lineStyle(2 * k, flashing ? 0xb8321e : 0x140c0a, 1); g.strokeRect(px0, py, px1 - px0, ph);
      if (B.patMode !== !!B.volley) { B.patMode = !!B.volley; B.txPat.setText(B.volley ? "THEY'RE THROWING!" : "THE SUITORS' PATIENCE").setColor(B.volley ? "#7a1408" : C.glaze); }
      /* the draft sign under the side door */
      if (P.wind) {
        var windMax = 2 * P.wind * k / (FLIGHT * FLIGHT), wn = B.windA / windMax, nCh = Math.round(Math.abs(wn) * 3), cx = B.doorX + 6 * k, cy = B.doorY + B.doorH + 18 * k;
        for (i = 0; i < 3; i++) {
          var on2 = i < nCh, up = wn > 0, x = cx + i * 12 * k;
          g.fillStyle(0x9fd3d6, on2 ? 0.95 : 0.2);
          if (up) g.fillTriangle(x, cy - 6 * k, x - 5 * k, cy + 4 * k, x + 5 * k, cy + 4 * k);
          else g.fillTriangle(x, cy + 6 * k, x - 5 * k, cy - 4 * k, x + 5 * k, cy - 4 * k);
        }
      }
    },

    /* a right answer: the suitors sit down, the arrows in the air vanish; the rows stay until the next question */
    clear_bow: function () {
      var B = this.bw, self = this;
      B.drawing = false; B.hold = 0;
      this.bowEndVolley();
      B.arrows.slice().forEach(function (a) { if (a.state !== "stuck" || !a.keep) self.bowFree(a); });
      if (B.lastRow) {
        B.lastRow.state = "found"; this.bowPaint(B.lastRow);
        B.lastRow.axes.forEach(function (a, j) { B.lastRow.flash[j] = 900; if (j % 3 === 0) self.burst(a.x, a.y, 0x9aefc0, 4); });
      }
      try { B.fxG.clear(); } catch (e) {}
    }
  });
})();
