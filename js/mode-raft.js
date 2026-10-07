/* SOL Labyrinth v5.11 — the Odyssey mode "raft": Calypso's Raft (Odyssey, Book 5).
 *
 * Odysseus sails from Ogygia on the raft he built, steering by the stars Calypso named for him
 * (the Pleiades, the Great Bear). Side view: big swells roll in from the right and the raft rides
 * them, physics-lite: it follows the surface with the surface's own speed, a steep crest can throw
 * it, ▲ hops it up (held, the sail glides it down slowly; pressed again in the air, it lifts once
 * more) and ▼ dives it low in the water.
 * The letters ride the sea: glowing stars hang above the crests (hop up to touch one), marker buoys
 * float in the troughs (ride into one, or hop over it) and, from level 11, some buoys are sunk below
 * the surface (dive to touch one). Touching the right letter answers; a wrong one costs a life and is
 * crossed out from then on. Poseidon's breakers rise on the right (a dark swell and a rumble first):
 * be on top when one reaches you (hold ▲ or be above its crest), or you are swamped — a life.
 * Rocks of the Phaeacian coast (from 21) must be hopped; squalls (from 31) hide the stars and the sea
 * ahead until lightning flashes; the four winds (from 71) lift or press down the raft. Ino's veil, an
 * occasional pickup, takes one hit. raftParams sets one curve for all of it.
 *
 * Loaded after js/modes.js; SolModes.extend adds the MODES entry and the scene methods below.
 * Art: canvas textures drawn once (keys md-raft-*); the sea is a few filled polygons redrawn each frame
 * from reused point arrays; letter objects are pooled.
 */
(function () {
  "use strict";
  var M = window.SolModes;
  if (!M || !M.extend || !M.lib) return;
  var lib = M.lib, clamp = lib.clamp, rnd = lib.rnd, shuffle = lib.shuffle, mix = lib.mix, snd = lib.snd, canvasTex = lib.canvasTex, ST = lib.ST;
  var TAU = Math.PI * 2;
  var STAR_SHARE = 0.42;                 /* how many letters hang as stars over a crest (the rest float in troughs) */
  var RAFT_W = 170, RAFT_H = 150, RAFT_WL = 124;   /* the raft texture and its waterline */
  /* the part of the raft that touches things, around its waterline point (texture px; low = sail lowered) */
  var BOX = { l: -48, r: 58, top: -102, low: -56, bot: 8 };
  /* px/s², px/s and px at 620 px high. Holding ▲ lightens the raft a little on the way up and lets the sail
     glide it down (falling no faster than GLIDE_V); one more press of ▲ in the air lifts it again once (AIR_HOP of a hop) */
  var G = 1500, G_RISE = 0.62, G_GLIDE = 0.32, GLIDE_V = 120, G_DIVE = 2.6, HOP = 560, AIR_HOP = 0.8, DIP = 40;
  var STEP = 10;                         /* px between the sea's polygon points */
  var BUOY_UP = 26, DEEP_DOWN = 42;      /* a buoy's plate above the water; a sunken one's below it */

  /* ── difficulty: one curve, every level at least as hard as the one before ── */
  function raftParams(n) {
    n = Math.max(1, n || 1);
    return {
      scroll: (118 + n * 1.55) * (n >= 91 ? 1.08 : 1),        /* px a second the sea runs: 121 at 2, 196 at 50, 293 at 99 */
      waveMin: 34 + n * 0.45,                                   /* a swell's height, trough to crest (px at 620 high) */
      waveMax: 60 + n * 1.0,
      lenMin: Math.max(250, 420 - n * 1.5),                     /* its length, trough to trough */
      lenMax: 600 - n * 2.2,
      steep: 1 + n * 0.01,                                      /* how sharp the crests are */
      gap: Math.max(270, 440 - n * 1.75),                       /* px of sea at least between two letters */
      deep: n >= 11 ? Math.min(0.6, 0.15 + (n - 11) * 0.0055) : 0,   /* share of trough buoys that are sunk (dive to them) */
      clear: 26 + n * 0.35 + (n >= 51 ? 16 : 0),                /* how far a star hangs above the sail top */
      breakEvery: Math.max(2800, 13000 - n * 105),              /* ms between Poseidon's waves */
      breakWarn: Math.max(650, (2300 - n * 17) * (n >= 81 ? 0.9 : 1)),   /* the dark swell before one rises */
      breakSp: 1.45 + n * 0.0065,                               /* its speed, times the sea's */
      breakH: 120 + n * 0.8,                                    /* its height above the troughs */
      double: n >= 41 ? Math.min(0.6, 0.2 + (n - 41) * 0.008) : 0,     /* a second wave right behind */
      rockP: n >= 21 ? Math.min(0.85, 0.15 + (n - 21) * 0.0095) : 0,  /* a rock in a trough between letters */
      rockH: 46 + n * 0.25 + (n >= 61 ? 14 : 0),
      rockPair: n >= 61 ? Math.min(0.5, 0.15 + (n - 61) * 0.009) : 0,
      dark: n >= 31 ? Math.min(0.9, 0.45 + (n - 31) * 0.0065 + (n >= 81 ? 0.05 : 0)) : 0,   /* a squall's darkness */
      squallMs: n >= 31 ? 7000 + (n - 31) * 110 : 0,
      calmMs: n >= 31 ? Math.max(4000, 16000 - (n - 31) * 170) : 1e9,
      seeR: n >= 31 ? Math.max(170, 360 - (n - 31) * 2.6) : 9999,      /* how far you see in a squall */
      lightMs: n >= 31 ? 2600 + (n - 31) * 30 + (n >= 81 ? 600 : 0) : 0,   /* ms between lightning flashes */
      gust: n >= 71 ? Math.min(0.75, 0.3 + (n - 71) * 0.012) : 0,     /* the four winds */
      gustEvery: n >= 71 ? Math.max(5000, 11000 - (n - 71) * 160) : 1e9,
      veilMs: 22000 + n * 220,                                  /* ms between Ino's veils */
      conflict: Math.max(0, 0.9 - n * 0.009)                    /* s kept clear between a wave's arrival and a letter's */
    };
  }

  /* ── art (the Odyssey sheet: terracotta, ochre, black glaze, wine-dark, Aegean blue, sea-foam, bone) ── */
  function line(c, x0, y0, x1, y1) { c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); }
  function disc(c, x, y, r) { c.beginPath(); c.arc(x, y, r, 0, TAU); }
  function glow(c, x, y, r, rgb, a) {
    var g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(" + rgb + "," + a + ")"); g.addColorStop(1, "rgba(" + rgb + ",0)");
    c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2);
  }
  function seeded(seed) { var s = seed; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }

  /* the night sky: scattered stars and the ones Calypso told him to steer by (Odyssey 5.270-277) */
  function drawSky(c, w, h) {
    var r = seeded(29), i;
    for (i = 0; i < 230; i++) {
      var x = r() * w, y = r() * h, big = r() < 0.08;
      c.fillStyle = r() < 0.2 ? "rgba(232,176,74," + (0.35 + r() * 0.4).toFixed(2) + ")" : "rgba(239,230,210," + (0.25 + r() * 0.55).toFixed(2) + ")";
      disc(c, x, y, big ? 1.6 : 0.5 + r() * 0.8); c.fill();
    }
    function asterism(pts, links, label, lx, ly) {
      c.strokeStyle = "rgba(159,211,214,0.22)"; c.lineWidth = 1.2;
      links.forEach(function (k) { line(c, pts[k[0]][0], pts[k[0]][1], pts[k[1]][0], pts[k[1]][1]); });
      pts.forEach(function (p) { glow(c, p[0], p[1], 7, "239,230,210", 0.45); c.fillStyle = "#fbf4e2"; disc(c, p[0], p[1], p[2] || 2.2); c.fill(); });
      c.font = "bold 12px Georgia, 'Palatino Linotype', serif"; c.textAlign = "center"; c.fillStyle = "rgba(232,176,74,0.55)";
      if (c.letterSpacing !== undefined) c.letterSpacing = "2px";
      c.fillText(label, lx, ly);
    }
    /* the Great Bear (the Wagon), the stars that never bathe in Ocean */
    asterism([[150, 70, 2.6], [156, 108, 2.4], [204, 118], [212, 84], [252, 90], [290, 98, 2.4], [330, 126, 2.4]],
      [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]], "THE GREAT BEAR", 240, 150);
    /* late-setting Boötes */
    asterism([[478, 204, 2.8], [462, 168], [470, 132], [500, 120], [512, 156]],
      [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]], "BOÖTES", 488, 232);
    /* the Pleiades, a little cluster */
    asterism([[702, 64, 1.9], [714, 56, 1.7], [724, 66, 2], [712, 74, 1.6], [698, 76, 1.5], [732, 58, 1.5], [720, 82, 1.4]],
      [], "THE PLEIADES", 716, 104);
    /* Orion, whom the Bear watches */
    asterism([[870, 150, 2.6], [916, 154, 2.2], [884, 192, 1.9], [893, 195, 1.9], [902, 198, 1.9], [872, 238, 2.2], [920, 236, 2.6]],
      [[0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6]], "ORION", 896, 264);
  }
  /* a band of far sea at the horizon (tiles sideways) */
  function drawFar(c, w, h) {
    var g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#26405f"); g.addColorStop(0.35, "#173352"); g.addColorStop(1, "#0f2740");
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    var r = seeded(7), i, k;
    for (i = 0; i < 34; i++) {
      var x = r() * w, y = 6 + r() * (h - 10), len = 20 + r() * 60;
      c.strokeStyle = "rgba(159,211,214," + (0.08 + r() * 0.14).toFixed(2) + ")"; c.lineWidth = 1.5;
      for (k = -1; k <= 1; k++) { c.beginPath(); c.moveTo(x - len / 2 + k * w, y); c.quadraticCurveTo(x + k * w, y - 3, x + len / 2 + k * w, y); c.stroke(); }
    }
    c.fillStyle = "rgba(239,230,210,0.14)"; c.fillRect(0, 0, w, 1.5);
  }
  /* Scheria on the horizon: "it looked like a shield on the misty sea" (Odyssey 5.281) */
  function drawIsle(c, w, h) {
    c.fillStyle = "#231d36";
    c.beginPath(); c.moveTo(0, h);
    c.quadraticCurveTo(w * 0.18, h * 0.55, w * 0.3, h * 0.5);
    c.quadraticCurveTo(w * 0.5, h * 0.02, w * 0.72, h * 0.42);
    c.quadraticCurveTo(w * 0.86, h * 0.62, w, h); c.closePath(); c.fill();
    c.strokeStyle = "rgba(239,230,210,0.16)"; c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(w * 0.3, h * 0.5); c.quadraticCurveTo(w * 0.5, h * 0.02, w * 0.72, h * 0.42); c.stroke();
    var g = c.createLinearGradient(0, h * 0.55, 0, h);
    g.addColorStop(0, "rgba(38,64,95,0)"); g.addColorStop(1, "rgba(38,64,95,0.9)");
    c.fillStyle = g; c.fillRect(0, h * 0.55, w, h * 0.45);
  }
  /* storm clouds for the squalls (tile sideways) */
  function drawClouds(c, w, h) {
    var r = seeded(5), i, k, cols = ["#140f1c", "#1d1628", "#271e33", "#33182b"];
    c.fillStyle = "#140f1c"; c.fillRect(0, 0, w, h * 0.3);
    for (i = 0; i < 52; i++) {
      var x = r() * w, y = r() * h * 0.62, rad = 24 + r() * 46;
      c.fillStyle = cols[i % cols.length];
      for (k = -1; k <= 1; k++) { disc(c, x + k * w, y, rad); c.fill(); }
    }
    for (i = 0; i < 16; i++) {
      var x2 = r() * w, y2 = h * 0.62 + r() * h * 0.2, rad2 = 18 + r() * 26;
      c.fillStyle = "rgba(29,22,40,0.6)";
      for (k = -1; k <= 1; k++) { disc(c, x2 + k * w, y2, rad2); c.fill(); }
    }
  }
  function drawBolt(c, w, h) {
    var pts = [[w * 0.55, 0], [w * 0.38, h * 0.22], [w * 0.62, h * 0.34], [w * 0.34, h * 0.58], [w * 0.56, h * 0.66], [w * 0.3, h]];
    c.lineCap = "round"; c.lineJoin = "round";
    c.shadowColor = "rgba(200,230,255,0.9)"; c.shadowBlur = 14;
    [[7, "rgba(159,211,214,0.6)"], [3.5, "#fbf7ff"]].forEach(function (q) {
      c.strokeStyle = q[1]; c.lineWidth = q[0]; c.beginPath();
      pts.forEach(function (p, i) { c[i ? "lineTo" : "moveTo"](p[0], p[1]); }); c.stroke();
      line(c, pts[2][0], pts[2][1], w * 0.9, h * 0.46);
    });
    c.shadowBlur = 0;
  }
  /* the dark of a squall: opaque, with a clear hole in the middle */
  function drawDark(c, w, h) {
    c.fillStyle = "#05060c"; c.fillRect(0, 0, w, h);
    c.globalCompositeOperation = "destination-out";
    var g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, "rgba(0,0,0,1)"); g.addColorStop(0.45, "rgba(0,0,0,0.92)"); g.addColorStop(0.8, "rgba(0,0,0,0.3)"); g.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.globalCompositeOperation = "source-over";
  }
  /* the raft from the side, bow to the right: two courses of lashed logs, the wicker fence Homer gives it,
     the mast and the square sail of Calypso's cloth, and Odysseus in his sailor's cap (pilos) at the
     steering oar. Frames 0 and 1 billow the sail; frame 2 has it lowered (diving). Waterline at y = 124. */
  function drawRaft(frame) {
    return function (c, w, h) {
      var low = frame === 2, i, oy = low ? 8 : 0;
      c.lineCap = "round"; c.lineJoin = "round";
      /* the steering oar, from his hands into the sea astern */
      c.strokeStyle = ST.glaze; c.lineWidth = 6; line(c, 46, 96 + oy * 0.5, 9, 140);
      c.strokeStyle = "#9a6a3a"; c.lineWidth = 3.4; line(c, 46, 96 + oy * 0.5, 9, 140);
      c.save(); c.translate(13, 135); c.rotate(Math.atan2(44, -36)); c.fillStyle = "#9a6a3a"; c.strokeStyle = ST.glaze; c.lineWidth = 1.6;
      c.beginPath(); c.ellipse(0, 0, 11, 4.6, 0, 0, TAU); c.fill(); c.stroke(); c.restore();
      /* logs */
      function log(y0, y1, x0, x1, col) {
        var r = (y1 - y0) / 2;
        c.fillStyle = col; c.strokeStyle = ST.glaze; c.lineWidth = 2;
        c.beginPath(); c.moveTo(x0 + r, y0); c.lineTo(x1 - r, y0); c.arc(x1 - r, y0 + r, r, -Math.PI / 2, Math.PI / 2);
        c.lineTo(x0 + r, y1); c.arc(x0 + r, y0 + r, r, Math.PI / 2, Math.PI * 1.5); c.closePath(); c.fill(); c.stroke();
        c.strokeStyle = "rgba(232,176,74,0.4)"; c.lineWidth = 1.2; line(c, x0 + r + 2, y0 + 3, x1 - r - 6, y0 + 3);
        c.strokeStyle = "rgba(20,12,10,0.35)"; c.lineWidth = 1; line(c, x0 + r + 6, y0 + r + 2, x1 - r - 14, y0 + r + 2);
        c.fillStyle = "#c8945a"; c.strokeStyle = ST.glaze; c.lineWidth = 1.6;
        c.beginPath(); c.ellipse(x1 - r, y0 + r, r * 0.55, r - 1.4, 0, 0, TAU); c.fill(); c.stroke();
        c.strokeStyle = "rgba(110,68,38,0.9)"; c.lineWidth = 1; c.beginPath(); c.ellipse(x1 - r, y0 + r, r * 0.26, r * 0.5, 0, 0, TAU); c.stroke();
      }
      log(120, 134, 18, 162, "#6e4426");
      log(107, 121, 12, 158, "#8a5a32");
      /* the deck, the lashings */
      c.fillStyle = "#a87444"; c.strokeStyle = ST.glaze; c.lineWidth = 1.4;
      c.beginPath(); c.rect(18, 103, 134, 5); c.fill(); c.stroke();
      [30, 58, 88, 118, 146].forEach(function (x) {
        c.fillStyle = ST.ochre; c.fillRect(x - 2, 103, 4, 30);
        c.strokeStyle = "rgba(20,12,10,0.7)"; c.lineWidth = 1; line(c, x - 2, 112, x + 2, 116); line(c, x - 2, 122, x + 2, 126);
      });
      /* the wicker fence against the waves */
      c.strokeStyle = ST.glaze; c.lineWidth = 1.6;
      for (i = 66; i <= 148; i += 8) line(c, i, 103, i, 93);
      c.strokeStyle = ST.ochre; c.lineWidth = 2;
      [95.5, 99.5].forEach(function (y, k) { c.beginPath(); for (i = 64; i <= 150; i += 4) c[i === 64 ? "moveTo" : "lineTo"](i, y + ((i / 4 + k) % 2 ? 1 : -1)); c.stroke(); });
      /* the mast */
      var mTop = low ? 46 : 12;
      c.fillStyle = "#6e4426"; c.strokeStyle = ST.glaze; c.lineWidth = 1.4;
      c.beginPath(); c.rect(86, mTop, 5, 104 - mTop); c.fill(); c.stroke();
      if (!low) {
        /* the pennant streams ahead with the wind */
        c.fillStyle = ST.terra; c.beginPath(); c.moveTo(91, mTop + 1); c.lineTo(110, mTop + 5); c.lineTo(91, mTop + 9); c.closePath(); c.fill();
        /* the square sail, bellied forward */
        var belly = frame ? 140 : 134, top = 24, bot = 88;
        c.save();
        c.beginPath(); c.moveTo(58, top + 2); c.quadraticCurveTo(90, top - 6, 122, top);
        c.quadraticCurveTo(belly, (top + bot) / 2, 124, bot); c.quadraticCurveTo(92, bot + 4, 60, bot - 1);
        c.quadraticCurveTo(62, (top + bot) / 2, 58, top + 2); c.closePath();
        c.fillStyle = ST.bone; c.fill();
        c.clip();
        c.fillStyle = ST.terra; [70, 94, 118].forEach(function (x) { c.fillRect(x, top - 10, 9, bot - top + 14); });
        /* a Greek key along the foot of the sail */
        c.fillStyle = ST.ochre; c.fillRect(50, bot - 13, 100, 9);
        c.strokeStyle = ST.glaze; c.lineWidth = 1.6;
        for (i = 58; i < 140; i += 10) { c.beginPath(); c.moveTo(i, bot - 5); c.lineTo(i, bot - 11); c.lineTo(i + 7, bot - 11); c.lineTo(i + 7, bot - 7); c.lineTo(i + 3, bot - 7); c.stroke(); }
        c.restore();
        c.strokeStyle = ST.glaze; c.lineWidth = 2;
        c.beginPath(); c.moveTo(58, top + 2); c.quadraticCurveTo(90, top - 6, 122, top);
        c.quadraticCurveTo(belly, (top + bot) / 2, 124, bot); c.quadraticCurveTo(92, bot + 4, 60, bot - 1);
        c.quadraticCurveTo(62, (top + bot) / 2, 58, top + 2); c.closePath(); c.stroke();
        /* the yard and the sheets */
        c.strokeStyle = "#6e4426"; c.lineWidth = 4; c.beginPath(); c.moveTo(52, top + 3); c.quadraticCurveTo(90, top - 7, 128, top); c.stroke();
        c.strokeStyle = "rgba(20,12,10,0.8)"; c.lineWidth = 1.2; line(c, 60, bot - 1, 66, 103); line(c, 124, bot, 140, 103);
      } else {
        /* the sail lowered and furled on its yard */
        c.fillStyle = ST.bone; c.strokeStyle = ST.glaze; c.lineWidth = 1.6;
        c.beginPath(); c.moveTo(56, 58); c.quadraticCurveTo(90, 50, 126, 58); c.quadraticCurveTo(128, 66, 124, 68); c.quadraticCurveTo(90, 62, 58, 68); c.quadraticCurveTo(53, 64, 56, 58); c.closePath(); c.fill(); c.stroke();
        c.fillStyle = ST.terra; [72, 96, 116].forEach(function (x) { c.fillRect(x, 56, 4, 12); });
        c.strokeStyle = "#6e4426"; c.lineWidth = 4; c.beginPath(); c.moveTo(52, 57); c.quadraticCurveTo(90, 48, 130, 57); c.stroke();
      }
      /* Odysseus at the steering oar */
      c.save(); c.translate(0, oy);
      c.fillStyle = ST.bone; c.strokeStyle = ST.glaze; c.lineWidth = 1.6;
      c.beginPath(); c.moveTo(34, 103); c.lineTo(52, 99); c.lineTo(55, 103); c.lineTo(36, 104); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = "#c98a52"; c.beginPath(); c.moveTo(51, 99); c.lineTo(56, 103 - oy); c.lineTo(52, 103 - oy); c.closePath(); c.fill();
      c.fillStyle = "#5a1f3e";
      c.beginPath(); c.moveTo(26, 104); c.quadraticCurveTo(24, 88, 32, 80); c.lineTo(44, 79); c.quadraticCurveTo(48, 90, 45, 104); c.closePath(); c.fill(); c.stroke();
      c.strokeStyle = "rgba(232,176,74,0.7)"; c.lineWidth = 1.2; line(c, 30, 98, 43, 98);
      /* arm to the oar */
      c.strokeStyle = ST.glaze; c.lineWidth = 5; line(c, 41, 83, 47, 94 - oy * 0.5);
      c.strokeStyle = "#c98a52"; c.lineWidth = 3; line(c, 41, 83, 47, 94 - oy * 0.5);
      c.fillStyle = "#c98a52"; c.strokeStyle = ST.glaze; c.lineWidth = 1.2; disc(c, 47, 95 - oy * 0.5, 2.8); c.fill(); c.stroke();
      /* head, beard and the pilos cap */
      c.fillStyle = "#c98a52"; c.lineWidth = 1.6; disc(c, 39, 72, 7.5); c.fill(); c.stroke();
      c.fillStyle = "#2a1a12"; c.beginPath(); c.moveTo(33, 74); c.quadraticCurveTo(38, 84, 46, 74); c.quadraticCurveTo(40, 78, 33, 74); c.fill();
      c.fillStyle = ST.glaze; disc(c, 43, 70.5, 1.2); c.fill();
      c.fillStyle = ST.ochre; c.strokeStyle = ST.glaze; c.lineWidth = 1.6;
      c.beginPath(); c.moveTo(30.5, 68); c.lineTo(47.5, 68); c.lineTo(40, 53); c.closePath(); c.fill(); c.stroke();
      c.strokeStyle = ST.terra; c.lineWidth = 1.5; line(c, 32, 66, 46, 66);
      c.restore();
    };
  }
  /* a marker buoy: the letter plate on a pole over a terracotta float, with a little lamp (waterline y = 62) */
  function drawBuoy(c, w, h) {
    var cx = w / 2, py = 30;
    glow(c, cx, py, 31, "232,176,74", 0.42);
    c.fillStyle = ST.terra; c.strokeStyle = ST.glaze; c.lineWidth = 2;
    c.beginPath(); c.ellipse(cx, 70, 14, 12, 0, 0, TAU); c.fill(); c.stroke();
    c.fillStyle = ST.glaze; c.fillRect(cx - 13, 66, 26, 3);
    c.fillStyle = "#6e4426"; c.fillRect(cx - 2, py + 16, 4, 62 - py - 12);
    c.fillStyle = ST.terra; disc(c, cx, py, 19); c.fill(); c.stroke();
    c.fillStyle = ST.bone; disc(c, cx, py, 15.5); c.fill();
    glow(c, cx, 8, 8, "255,224,150", 0.95);
    c.fillStyle = "#fff0c0"; disc(c, cx, 8, 2.6); c.fill();
  }
  /* a glowing star carrying a letter: eight rays round a bone-white disc */
  function drawStar(c, w, h) {
    var cx = w / 2, cy = h / 2, i;
    glow(c, cx, cy, w / 2, "255,232,160", 0.5);
    c.fillStyle = ST.ochre; c.strokeStyle = "#7a4a10"; c.lineWidth = 1.5; c.beginPath();
    for (i = 0; i < 16; i++) { var a = i / 16 * TAU - Math.PI / 2, r = i % 2 ? 12 : (i % 4 === 0 ? 39 : 28); c[i ? "lineTo" : "moveTo"](cx + Math.cos(a) * r, cy + Math.sin(a) * r); }
    c.closePath(); c.fill(); c.stroke();
    c.fillStyle = "#fff4cf"; c.beginPath();
    for (i = 0; i < 16; i++) { var a2 = i / 16 * TAU - Math.PI / 2, r2 = i % 2 ? 7 : (i % 4 === 0 ? 28 : 19); c[i ? "lineTo" : "moveTo"](cx + Math.cos(a2) * r2, cy + Math.sin(a2) * r2); }
    c.closePath(); c.fill();
    c.fillStyle = ST.terra; c.strokeStyle = ST.glaze; c.lineWidth = 1.6; disc(c, cx, cy, 19); c.fill(); c.stroke();
    c.fillStyle = ST.bone; disc(c, cx, cy, 15.5); c.fill();
  }
  function drawCross(c, w, h) {
    c.lineCap = "round";
    [[9, ST.glaze], [5, "#c0392b"]].forEach(function (q) { c.strokeStyle = q[1]; c.lineWidth = q[0]; line(c, 9, 9, w - 9, h - 9); line(c, w - 9, 9, 9, h - 9); });
  }
  /* a sea stack of the Phaeacian coast, lit from the left by the stars */
  function drawRock(seed) {
    return function (c, w, h) {
      var r = seeded(seed), pts = [[4, h], [9, h * 0.66], [3 + r() * 8, h * 0.48], [15, h * 0.32], [22 + r() * 6, h * 0.14], [34, 6 + r() * 6], [44, 2 + r() * 4], [53, h * 0.1], [60 + r() * 6, h * 0.24], [66, h * 0.42], [74 + r() * 4, h * 0.54], [72, h * 0.72], [w - 3, h]];
      c.beginPath(); pts.forEach(function (p, i) { c[i ? "lineTo" : "moveTo"](p[0], p[1]); }); c.closePath();
      var g = c.createLinearGradient(0, 0, w, 0); g.addColorStop(0, "#4e3d33"); g.addColorStop(0.55, "#2a1d18"); g.addColorStop(1, "#140c0a");
      c.fillStyle = g; c.fill();
      c.save(); c.clip();
      c.strokeStyle = "rgba(217,119,43,0.35)"; c.lineWidth = 3;
      for (var i = 0; i < 6; i++) { var y = h * (0.2 + i * 0.13); c.beginPath(); c.moveTo(0, y + 4); c.quadraticCurveTo(w / 2, y - 6 + r() * 12, w, y + 2); c.stroke(); }
      c.restore();
      c.strokeStyle = ST.glaze; c.lineWidth = 2.5; c.beginPath(); pts.forEach(function (p, i) { c[i ? "lineTo" : "moveTo"](p[0], p[1]); }); c.stroke();
      c.strokeStyle = "rgba(239,230,210,0.45)"; c.lineWidth = 2; c.beginPath();
      pts.slice(0, 7).forEach(function (p, i) { c[i ? "lineTo" : "moveTo"](p[0] + 2, p[1] + 2); }); c.stroke();
    };
  }
  /* Ino's veil: a white scarf rippling in the air, with a sea-foam shimmer */
  function drawVeil(c, w, h) {
    glow(c, w / 2, h / 2, w * 0.5, "159,211,214", 0.42);
    var top = [], bot = [], x, i;
    for (x = 8; x <= w - 8; x += 3) {
      var t = (x - 8) / (w - 16), y = h / 2 + Math.sin(t * TAU * 1.4 + 0.4) * 8 * (0.4 + t * 0.6), th = 9 - t * 3;
      top.push([x, y - th]); bot.push([x, y + th]);
    }
    var g = c.createLinearGradient(0, 0, w, 0); g.addColorStop(0, "#ffffff"); g.addColorStop(1, ST.bone);
    c.fillStyle = g; c.beginPath();
    top.forEach(function (p, k) { c[k ? "lineTo" : "moveTo"](p[0], p[1]); });
    for (i = bot.length - 1; i >= 0; i--) c.lineTo(bot[i][0], bot[i][1]);
    c.closePath(); c.fill();
    c.strokeStyle = "rgba(30,95,140,0.35)"; c.lineWidth = 1.2; c.stroke();
    c.strokeStyle = "rgba(159,211,214,0.8)"; c.lineWidth = 1.5; c.beginPath();
    top.forEach(function (p, k) { var q = bot[k]; c[k ? "lineTo" : "moveTo"](p[0], (p[1] + q[1]) / 2); }); c.stroke();
    var end = top[top.length - 1], eb = bot[bot.length - 1];
    c.strokeStyle = "rgba(239,230,210,0.9)"; c.lineWidth = 1.2;
    for (i = 0; i < 4; i++) { var fy = end[1] + (eb[1] - end[1]) * (i + 0.5) / 4; line(c, end[0], fy, end[0] + 5, fy + 2); }
    c.fillStyle = "#ffffff";
    [[0.2, 0.2], [0.45, 0.82], [0.7, 0.15], [0.9, 0.7], [0.32, 0.6]].forEach(function (q) {
      var sx = q[0] * w, sy = q[1] * h; c.beginPath(); c.moveTo(sx, sy - 4); c.lineTo(sx + 1, sy - 1); c.lineTo(sx + 4, sy); c.lineTo(sx + 1, sy + 1);
      c.lineTo(sx, sy + 4); c.lineTo(sx - 1, sy + 1); c.lineTo(sx - 4, sy); c.lineTo(sx - 1, sy - 1); c.closePath(); c.fill();
    });
  }
  /* the breaking lip of Poseidon's wave, curling forward (to the left) */
  function drawCurl(c, w, h) {
    /* the crest sits at (0.82w, 0.2h); the lip reaches forward from it and hooks down */
    function hook() {
      c.beginPath(); c.moveTo(w, h * 0.42);
      c.quadraticCurveTo(w * 0.86, h * 0.02, w * 0.52, h * 0.06);
      c.quadraticCurveTo(w * 0.14, h * 0.12, w * 0.06, h * 0.56);
      c.quadraticCurveTo(w * 0.16, h * 0.4, w * 0.3, h * 0.3);
      c.quadraticCurveTo(w * 0.62, h * 0.2, w * 0.8, h * 0.44); c.closePath();
    }
    var g = c.createLinearGradient(0, 0, 0, h * 0.6);
    g.addColorStop(0, "#ffffff"); g.addColorStop(0.6, ST.bone); g.addColorStop(1, "#9fd3d6");
    hook(); c.fillStyle = g; c.fill();
    c.strokeStyle = "rgba(18,63,96,0.7)"; c.lineWidth = 2; c.stroke();
    c.strokeStyle = "rgba(159,211,214,0.95)"; c.lineWidth = 2.5;
    c.beginPath(); c.moveTo(w * 0.88, h * 0.3); c.quadraticCurveTo(w * 0.62, h * 0.08, w * 0.3, h * 0.2); c.stroke();
    var r = seeded(17);
    for (var i = 0; i < 18; i++) { c.fillStyle = "rgba(239,230,210," + (0.5 + r() * 0.5).toFixed(2) + ")"; disc(c, w * (0.02 + r() * 0.2), h * (0.5 + r() * 0.45), 1.5 + r() * 2.5); c.fill(); }
  }
  function ensureRaftArt(scene) {
    canvasTex(scene, "md-raft-sky", 1024, 300, drawSky);
    canvasTex(scene, "md-raft-far", 512, 96, drawFar);
    canvasTex(scene, "md-raft-isle", 320, 84, drawIsle);
    canvasTex(scene, "md-raft-cloud", 512, 220, drawClouds);
    canvasTex(scene, "md-raft-bolt", 80, 260, drawBolt);
    canvasTex(scene, "md-raft-dark", 256, 256, drawDark);
    for (var f = 0; f < 3; f++) canvasTex(scene, "md-raft-raft-" + f, RAFT_W, RAFT_H, drawRaft(f));
    canvasTex(scene, "md-raft-buoy", 60, 86, drawBuoy);
    canvasTex(scene, "md-raft-star", 84, 84, drawStar);
    canvasTex(scene, "md-raft-x", 44, 44, drawCross);
    canvasTex(scene, "md-raft-rock-0", 84, 130, drawRock(41));
    canvasTex(scene, "md-raft-rock-1", 84, 130, drawRock(97));
    canvasTex(scene, "md-raft-veil", 110, 56, drawVeil);
    canvasTex(scene, "md-raft-curl", 150, 120, drawCurl);
  }

  /* a Poseidon's wave's shape: a steep face in front (left), a long back behind */
  function brkProf(d, fw, bw) {
    if (d < 0) { var t = 1 + d / fw; return t <= 0 ? 0 : t * t * (3 - 2 * t); }
    var q = d / bw; return Math.exp(-q * q);
  }
  var BW = 175;

  var DEF = {
    name: "Calypso's Raft", kind: "wave-riding level", level: "wave-riding level", act: "LIFT",
    how: "Odysseus sails home from Calypso's island on the raft he built himself, steering by the stars as she told him: the Pleiades and the Great Bear. Big waves roll toward him and the raft rides them by itself. The letters ride the sea too: glowing stars hang in the air over the crests, marker buoys float in the troughs, and from the second island on some buoys are sunk just under the water. Touch the letter with the right answer: hop up (▲) to a star, let the waves carry you into a buoy, or dive (▼) to a sunken one. Keep clear of the wrong ones: don't hop at a wrong star, and hold ▲ to jump over a wrong buoy. Letters you pass come round again. Poseidon is still angry: when the sea on the right turns dark and rumbles, one of his great waves is rising. Hold ▲ as it reaches you to ride up on top of it. Sometimes Ino's white veil floats by: sail into it, and it saves you from one hit, as the sea goddess's veil saved Odysseus.",
    rules: "Touching a wrong letter costs a life, and that letter is crossed out from then on. So does being swamped by one of Poseidon's waves (anywhere but on top of it) or crashing into a rock. Ino's veil takes one wave or rock for you.",
    keys: "▲, W, Space, LIFT, the pad's ▲ or a click or tap: hop the raft up (hold it to glide; press it again in the air for one more lift) · ▼, S or the pad's ▼: dive low in the water.",
    tip: "CALYPSO'S RAFT — touch the right letter (▲ hop, ▼ dive) and jump the wrong ones. Hold ▲ as Poseidon's wave hits.",
    hint1: "Touch the right letter with the raft: hop (▲) up to a star, ride into a buoy, dive (▼) to a sunken buoy. Jump over the wrong buoys. The passage stays in the side panel.",
    hint2: "This question has two right letters. Touch both of them: the star or buoy with each one.",
    news: ["",
      "Sunken buoys: some buoys float below the surface in the troughs. Dive (▼) to reach one; sail over it if it's wrong.",
      "The rocky coast of the Phaeacians: rocks stand in the water. Hold ▲ to jump over them.",
      "Squalls: Poseidon's storm clouds hide the stars, and you can only see the sea close around you until lightning flashes.",
      "Poseidon's waves can now come two in a row.",
      "The stars hang higher over the crests. Hop from the rising face of a wave to reach them.",
      "Taller rocks, and sometimes two stand together.",
      "The four winds: the South Wind lifts the raft and the North Wind presses it down. Watch for the wind streaks.",
      "Darker, longer squalls with less lightning, and Poseidon's waves give less warning.",
      "Poseidon's storm: the sea runs faster, on top of everything else."],
    params: raftParams
  };

  M.extend("raft", DEF, {
    raftParams: function (n) { return raftParams(n); },

    setup_raft: function () {
      ensureRaftArt(this);
      var P = raftParams(this.night), W = this.W;
      var S = this.rf = { P: P, box: BOX, t: 0, cam: 0, segs: [], segEnd: -STEP * 4, plans: [], planU: W * 0.55, lastLetU: 0, lastObsU: -1e9,
        letters: [], pool: [], rocks: [], breakers: [], dead: [], queue: [], lastL: null, told: {}, tq: [], tqCd: 0,
        veil: null, hasVeil: false, veilDue: false, veilCd: Math.min(P.veilMs, 14000 + P.veilMs * 0.25),
        breakCd: Math.max(6500, P.breakEvery * 0.7), sq: { on: false, t: 0, next: 9000, lvl: 0 }, flash: 0, lightCd: 1500,
        gu: { state: "calm", t: 0, next: P.gustEvery * 0.6, dir: 1 }, frame: 0, frameMs: 0, rides: 0, hops: 0 };
      this.cameras.main.setBackgroundColor("#0a0712");
      S.skyG = this.add.graphics().setDepth(0);
      S.sky = this.add.image(0, 0, "md-raft-sky").setOrigin(0, 0).setDepth(1);
      S.bolt = this.add.image(0, 0, "md-raft-bolt").setOrigin(0.5, 0).setDepth(2.2).setAlpha(0);
      S.cloud = this.add.tileSprite(0, 0, W, 220, "md-raft-cloud").setOrigin(0, 0).setDepth(2).setAlpha(0);
      S.isle = this.add.image(W * 0.72, 0, "md-raft-isle").setOrigin(0.5, 1).setDepth(2.5).setAlpha(0.9);
      S.far = this.add.tileSprite(0, 0, W, 96, "md-raft-far").setOrigin(0, 0).setDepth(3);
      S.midG = this.add.graphics().setDepth(4);
      S.seaG = this.add.graphics().setDepth(10);
      S.topG = this.add.graphics().setDepth(11);
      S.rainG = this.add.graphics().setDepth(38);
      S.dark = this.add.image(0, 0, "md-raft-dark").setDepth(39).setAlpha(0);
      S.darkG = this.add.graphics().setDepth(39);
      S.brkG = this.add.graphics().setDepth(41);
      var lab = { fontFamily: "Georgia, 'Palatino Linotype', serif", fontSize: 18, color: "#efe6d2", fontStyle: "bold", stroke: "#140c0a", strokeThickness: 5 };
      S.warnText = this.add.text(0, 0, "POSEIDON'S WAVE!", lab).setOrigin(1, 0.5).setDepth(45).setVisible(false);
      S.cue = this.add.text(0, 0, "▲ RIDE IT!", lab).setOrigin(0.5, 1).setDepth(45).setVisible(false);
      S.gustText = this.add.text(0, 0, "", lab).setOrigin(0.5, 0.5).setDepth(45).setVisible(false);
      S.raft = { y: 0, vy: 0, air: false, dip: 0, rot: 0, tumble: 0, hopCd: 0, coyote: 0, lastSy: 0,
        spr: this.add.image(0, 0, "md-raft-raft-0").setOrigin(0.5, RAFT_WL / RAFT_H).setDepth(8) };
      S.mastVeil = this.add.image(0, 0, "md-raft-veil").setDepth(8.1).setVisible(false);
      this.raftLayout();
      /* the opening swells are gentle */
      this.raftSegs(S.cam + W + 2 * P.lenMax);
      S.lastLetU = S.cam + W + 70 - P.gap; S.planU = S.cam + W + 70;
      var sy = this.raftSurf(S.rx);
      S.raft.y = sy; S.raft.lastSy = sy;
      this.makeSol(S.rx, sy - 40, "right").setVisible(false);   /* Odysseus is drawn on the raft; the sprite stays for coin pop-ups */
      this.raftPlace();
    },

    /* sizes and positions that follow the canvas */
    raftLayout: function () {
      var S = this.rf, W = this.W, H = this.H, P = S.P, i;
      S.vs = clamp(H / 620, 0.72, 1.3);
      S.RS = 0.9 * S.vs; S.LS = 0.95 * S.vs;
      S.rx = Math.round(clamp(W * 0.3, 170, 400));
      S.seaY = H - Math.max(64, H * 0.16);
      S.horizonY = Math.round(H * 0.46);
      S.midY = S.seaY - P.waveMax * S.vs * 0.8 - 26 * S.vs;
      /* the sky: black glaze above, wine-dark lower, a blue glow at the horizon */
      var g = S.skyG, bands = 28, top = 0x07050c, mid = 0x241231, hor = 0x2c4064;
      g.clear();
      for (i = 0; i < bands; i++) {
        var t = i / (bands - 1), col = t < 0.6 ? mix(top, mid, t / 0.6) : mix(mid, hor, (t - 0.6) / 0.4);
        g.fillStyle(col, 1); g.fillRect(0, Math.floor(S.horizonY * i / bands) - 1, W, Math.ceil(S.horizonY / bands) + 2);
      }
      var sc = Math.max(W / 1024, S.horizonY / 300);
      S.sky.setScale(sc).setPosition(0, 0);
      S.cloud.setSize(W, Math.round(S.horizonY * 1.15)).setTileScale(1, S.horizonY * 1.15 / 220);
      S.isle.setPosition(S.isle.x, S.horizonY + 3).setScale(S.vs);
      S.far.setPosition(0, S.horizonY).setSize(W, Math.max(40, S.midY - S.horizonY + 40)).setTileScale(1, Math.max(40, S.midY - S.horizonY + 40) / 96);
      S.raft.spr.setScale(S.RS);
      S.mastVeil.setScale(0.42 * S.vs);
      [S.warnText, S.cue, S.gustText].forEach(function (t) { t.setFontSize(Math.round(18 * S.vs)); });
      /* the polygon points, reused every frame */
      var n = Math.ceil((W + STEP * 2) / STEP) + 1;
      S.n = n; S.ys = new Array(n); S.yb = new Array(n); S.pA = []; S.pB = []; S.pC = []; S.pS = []; S.pT = [];
      for (i = 0; i < n + 2; i++) { S.pA.push({ x: 0, y: 0 }); S.pB.push({ x: 0, y: 0 }); S.pC.push({ x: 0, y: 0 }); }
      for (i = 0; i < n * 2 + 4; i++) S.pT.push({ x: 0, y: 0 });
      for (i = 0; i < n; i++) S.pS.push({ x: 0, y: 0 });
      S.pM = []; S.nM = Math.ceil((W + 24) / 12) + 1;
      for (i = 0; i < S.nM + 2; i++) S.pM.push({ x: 0, y: 0 });
    },
    resize_raft: function (oldW, oldH) {
      var S = this.rf, fy = this.H / (oldH || this.H);
      this.raftLayout();
      S.letters.forEach(function (o) { if (o.kind === "star") o.y0 *= fy; });
      S.raft.y = this.raftSurf(S.rx); S.raft.lastSy = S.raft.y; S.raft.vy = 0; S.raft.air = false;
    },

    /* ── the sea ── */
    raftSegs: function (uMax) {
      var S = this.rf, P = S.P;
      while (S.segEnd < uMax) {
        var gentle = S.segEnd < this.W * 1.1;
        var seg = { u0: S.segEnd, L: rnd(P.lenMin, P.lenMax), h: rnd(P.waveMin, P.waveMax) * (gentle ? 0.6 : 1), g: P.steep };
        S.segs.push(seg); S.segEnd = seg.u0 + seg.L;
      }
      while (S.segs.length > 2 && S.segs[0].u0 + S.segs[0].L < S.cam - 200) S.segs.shift();
    },
    raftBase: function (u) {
      var S = this.rf, segs = S.segs;
      for (var i = 0; i < segs.length; i++) {
        var g = segs[i];
        if (u < g.u0 + g.L) {
          if (u < g.u0) return S.seaY;
          var c = 0.5 - 0.5 * Math.cos((u - g.u0) / g.L * TAU);
          return S.seaY - g.h * S.vs * Math.pow(c, g.g);
        }
      }
      return S.seaY;
    },
    /* the water's surface at screen x: the swells, and Poseidon's waves where they stand higher */
    raftSurf: function (x) {
      var S = this.rf, y = this.raftBase(S.cam + x), bs = S.breakers;
      for (var i = 0; i < bs.length; i++) {
        var b = bs[i];
        if (b.A <= 0) continue;
        var yb = S.seaY - b.A * S.vs * brkProf(x - b.x, b.fw, BW);
        if (yb < y) y = yb;
      }
      return y;
    },

    /* ── what rides the sea: letters (star over a crest, buoy or sunken buoy in a trough), rocks, the veil ── */
    raftPlan: function (uMax) {
      var S = this.rf, segs = S.segs;
      for (var i = 0; i < segs.length; i++) {
        var g = segs[i], fs = [g.u0 + g.L / 2, g.u0 + g.L];
        for (var k = 0; k < 2; k++) {
          var u = fs[k];
          if (u <= S.planU || u > uMax) continue;
          S.planU = u;
          this.raftPlanAt(u, k === 0);
        }
      }
    },
    raftPlanAt: function (u, crest) {
      var S = this.rf, P = S.P, due = S.lastLetU + P.gap, sp = Math.max(170, P.scroll * 0.8);   /* a rock and a letter are 0.8 s of sea apart */
      if (!crest && u - S.lastLetU >= sp && u - S.lastObsU >= Math.max(260, P.scroll * 1.1) && P.rockP > 0 && Math.random() < P.rockP) {
        var pair = Math.random() < P.rockPair;
        S.plans.push({ u: pair ? u - 26 : u, kind: "rock" });
        if (pair) S.plans.push({ u: u + 30, kind: "rock", small: true });
        S.lastObsU = u + (pair ? 30 : 0);
        return;
      }
      if (u >= due && u - S.lastObsU >= sp) {
        if (crest && Math.random() < STAR_SHARE) { S.plans.push({ u: u, kind: "star" }); S.lastLetU = u; return; }
        if (!crest) { S.plans.push({ u: u, kind: Math.random() < P.deep ? "deep" : "buoy" }); S.lastLetU = u; return; }
        return;
      }
      if (!crest && S.veilDue && u - S.lastLetU >= 150 && due - u >= 150 && u - S.lastObsU >= 170) {
        S.plans.push({ u: u, kind: "veil" }); S.veilDue = false; S.lastObsU = u;
      }
    },
    raftSpawn: function (p) {
      var S = this.rf, P = S.P;
      if (p.kind === "rock") {
        var rh = (P.rockH * (p.small ? 0.78 : 1)) * S.vs, k = Math.random() < 0.5 ? 0 : 1, sc = (rh + 34 * S.vs) / 124;
        S.rocks.push({ u: p.u, h: rh, sc: sc, hw: 22 * sc, hit: false,
          spr: this.add.image(0, 0, "md-raft-rock-" + k).setOrigin(0.5, 1).setScale(sc).setFlipX(Math.random() < 0.5).setDepth(6) });
        this.raftTell("rock", "Rocks of the Phaeacian coast! Hold ▲ to jump over them.");
        return;
      }
      if (p.kind === "veil") {
        if (S.hasVeil || S.veil) { S.veilDue = true; return; }
        S.veil = { u: p.u, ph: rnd(0, 6), spr: this.add.image(0, 0, "md-raft-veil").setDepth(12).setScale(S.vs) };
        return;
      }
      if (this._between || this._finishing || !this.claim) return;
      var L = this.raftNextLetter();
      if (L) this.raftAddLetter(L, p.kind, p.u);
    },
    /* a letter on the sea at world position u: "star" over a crest, "buoy" or "deep" (sunken) in a trough */
    raftAddLetter: function (L, kind, u) {
      var S = this.rf, P = S.P, o = S.pool.pop();
      if (!o) {
        o = { spr: this.add.image(0, 0, "md-raft-buoy"),
          label: this.add.text(0, 0, "", { fontFamily: "Georgia, 'Palatino Linotype', serif", fontSize: 22, color: ST.glaze, fontStyle: "bold" }).setOrigin(0.5),
          xm: this.add.image(0, 0, "md-raft-x"),
          /* how to reach it (not whether to): ▲ under a star, ▼ over a sunken buoy; shown up to level 49 */
          hint: this.add.text(0, 0, "", { fontFamily: "Georgia, 'Palatino Linotype', serif", fontSize: 16, color: "#e8b04a", fontStyle: "bold", stroke: "#140c0a", strokeThickness: 4 }).setOrigin(0.5) };
      }
      o.kind = kind; o.u = u; o.L = L; o.touched = false; o.ph = rnd(0, 6); o.state = "live";
      var star = o.kind === "star", deep = o.kind === "deep", dz = star ? 12 : deep ? 10.5 : 7;
      o.r = (star ? 19 : 18) * S.LS;
      o.spr.setTexture(star ? "md-raft-star" : "md-raft-buoy").setOrigin(0.5, star ? 0.5 : 30 / 86).setScale(S.LS).setDepth(dz).setVisible(true);
      o.label.setFontSize(Math.round(23 * S.LS)).setDepth(dz + 0.1).setVisible(true);
      o.xm.setScale(0.8 * S.LS).setDepth(dz + 0.2).setVisible(false);
      var ht = this.night < 50 && !this.raftHintOff ? (star ? "▲" : deep ? "▼" : "") : "";
      if (o.hint.text !== ht) o.hint.setText(ht);
      if (ht && o.hintSize !== S.vs) { o.hintSize = S.vs; o.hint.setFontSize(Math.round(21 * S.vs)).setColor(star ? "#e8b04a" : "#9fd3d6"); }
      o.hint.setDepth(dz + 0.3).setVisible(!!ht);
      if (star) o.y0 = this.raftBase(u) - ((-BOX.top) * S.RS + o.r + P.clear * S.vs);
      o.x = u - S.cam;
      o.y = star ? o.y0 : this.raftSurf(o.x) + (deep ? DEEP_DOWN : -BUOY_UP) * S.LS;
      o.spr.setPosition(o.x, o.y); o.label.setPosition(o.x, o.y + 1); o.xm.setPosition(o.x, o.y); o.hint.setPosition(o.x, o.y);
      S.letters.push(o);
      this.raftPaint(o, S.dead.indexOf(L) !== -1 ? "wrong" : this.extracted.indexOf(L) !== -1 ? "right" : "live");
      this.raftTell(o.kind, star ? "A star: hop up to it (▲, Space or LIFT) if its letter is right."
        : deep ? "A sunken buoy: dive (▼ or S) to touch it if its letter is right."
        : "A buoy: ride into it if it's right; hold ▲ to jump over it if it's wrong.");
      return o;
    },
    /* the next letter to send: every letter not found yet comes round in turn (the wrong ones crossed out) */
    raftNextLetter: function () {
      var S = this.rf, self = this;
      var cand = this.choiceLetters().filter(function (L) { return self.extracted.indexOf(L) === -1; });
      if (!cand.length) return null;
      S.queue = S.queue.filter(function (L) { return cand.indexOf(L) !== -1; });
      if (!S.queue.length) {
        S.queue = shuffle(cand.slice());
        if (S.queue.length > 1 && S.queue[0] === S.lastL) S.queue.push(S.queue.shift());
      }
      S.lastL = S.queue.shift();
      return S.lastL;
    },
    raftPaint: function (o, state) {
      o.state = state;
      var deep = o.kind === "deep";
      if (state === "wrong") {
        o.spr.setTint(0x8a8a8a).setAlpha(0.78);
        o.label.setText(o.L).setColor("#6a5a50");
        o.xm.setVisible(true);
      } else if (state === "right") {
        o.spr.setTint(0xbff0c8).setAlpha(1);
        o.label.setText("✓").setColor("#1f6a3a");
        o.xm.setVisible(false);
      } else {
        if (deep) o.spr.setTint(0x8fd0ff).setAlpha(0.9); else o.spr.clearTint().setAlpha(1);
        o.label.setText(o.L).setColor(deep ? "#0d2f4a" : ST.glaze);
        o.xm.setVisible(false);
      }
    },
    raftMark: function (L, state) {
      var self = this;
      this.rf.letters.forEach(function (o) { if (o.L === L) self.raftPaint(o, state); });
    },
    raftFree: function (o) {
      o.spr.setVisible(false); o.label.setVisible(false); o.xm.setVisible(false); o.hint.setVisible(false);
      this.rf.pool.push(o);
    },
    /* the raft touched a letter */
    raftTouch: function (o, x, y) {
      var S = this.rf;
      o.touched = true;
      if (o.state !== "live") return;
      var res = this.answerPick(o.L, x, y);
      if (res === "wrong") { if (S.dead.indexOf(o.L) === -1) S.dead.push(o.L); this.raftMark(o.L, "wrong"); }
      else if (res === "partial") this.raftMark(o.L, "right");
      return res;
    },
    raftTell: function (key, msg) {
      var S = this.rf;
      if (S.told[key]) return;
      S.told[key] = true; S.tq.push(msg);
    },

    answers_raft: function () {
      var S = this.rf, self = this;
      S.letters.forEach(function (o) { self.raftFree(o); }); S.letters = [];
      S.dead = []; S.queue = []; S.lastL = null;
      /* plan the sea ahead again, so the new question's first letter comes soon */
      var line0 = S.cam + this.W + 70;
      S.plans = S.plans.filter(function (p) { if (p.u > line0 && p.kind === "veil") S.veilDue = true; return p.u <= line0; });
      S.lastObsU = -1e9;
      S.rocks.forEach(function (k) { S.lastObsU = Math.max(S.lastObsU, k.u); });
      S.plans.forEach(function (p) { S.lastObsU = Math.max(S.lastObsU, p.u); });
      if (S.veil) S.lastObsU = Math.max(S.lastObsU, S.veil.u);
      S.planU = Math.min(S.planU, line0); S.lastLetU = line0 - S.P.gap;
    },
    clear_raft: function () {
      var S = this.rf, self = this;
      S.letters.forEach(function (o) { self.burst(o.spr.x, o.spr.y, 0xe8b04a, 6); self.raftFree(o); }); S.letters = [];
      S.plans = S.plans.filter(function (p) { return p.kind === "rock" || p.kind === "veil"; });
      S.breakers.forEach(function (b) { b.checked = true; });
      S.breakCd = Math.max(S.breakCd, 3000);
    },

    /* ── hits ── */
    raftHurt: function (label) {
      var S = this.rf;
      if (this.ended || this._finishing || this.iframeMs > 0) return false;
      if (S.hasVeil) {
        S.hasVeil = false;
        var mv = S.mastVeil, x = mv.x, y = mv.y, ghost = this.add.image(x, y, "md-raft-veil").setDepth(30).setScale(mv.scaleX);
        mv.setVisible(false);
        this.tweens.add({ targets: ghost, y: y - 120, x: x - 60, alpha: 0, angle: -30, duration: 1100, onComplete: function () { ghost.destroy(); } });
        this.iframeMs = 1500;
        this.burst(x, y, 0xefe6d2, 16);
        this.showTag("INO'S VEIL SAVED YOU", "#9ad8ff");
        this.toast("Ino's veil took that hit for you, as it saved Odysseus.", 3200);
        return false;
      }
      return this.loseLife("hit", label);
    },

    /* ── Poseidon's waves ── */
    raftBreaker: function (wait) {
      var S = this.rf, P = S.P, A = P.breakH * rnd(0.94, 1.06);
      var b = { A: 0, Amax: A, fw: 64 + A * 0.25, x: this.W + 60, state: wait ? "wait" : "warn", t: 0, wait: wait || 0, warn: wait ? Math.min(700, P.breakWarn) : P.breakWarn,
        checked: false, curl: this.add.image(0, 0, "md-raft-curl").setOrigin(0.82, 0.2).setDepth(41).setAlpha(0) };
      S.breakers.push(b);
      return b;
    },
    raftBreakerSoon: function () {
      /* when would a wave starting now reach the raft, and is a letter or a rock due then? */
      var S = this.rf, P = S.P, W = this.W, vb = P.scroll * P.breakSp, fw = 64 + P.breakH * 0.25;
      var tA = P.breakWarn / 1000 + (W + 60 - fw * 0.5 - (S.rx + BOX.r * S.RS)) / vb, clash = false;
      if (P.conflict <= 0) return false;
      function near(u) { var tL = (u - S.cam - S.rx) / P.scroll; if (Math.abs(tA - tL) < P.conflict + 0.25) clash = true; }
      S.letters.forEach(function (o) { if (o.state === "live") near(o.u); });
      S.plans.forEach(function (p) { if (p.kind !== "veil") near(p.u); });
      S.rocks.forEach(function (k) { near(k.u); });
      return clash;
    },

    /* ── the frame ── */
    tick_raft: function (s, inp, ms) {
      var S = this.rf, P = S.P, W = this.W, H = this.H, R = S.raft, i, vs = S.vs;
      S.t += s;
      var v = P.scroll;
      S.cam += v * s;
      S.far.tilePositionX += v * 0.12 * s;
      S.cloud.tilePositionX += 14 * s;
      S.isle.x -= v * 0.025 * s; if (S.isle.x < -200 * vs) S.isle.x = W + 420 * vs;
      /* toasts, one at a time */
      S.tqCd -= ms;
      if (S.tq.length && S.tqCd <= 0 && !((this.scoreToastMs || 0) > 600)) { this.toast(S.tq.shift(), 3600); S.tqCd = 3800; }
      /* the sea ahead, and what rides it */
      this.raftSegs(S.cam + W + 2 * P.lenMax);
      this.raftPlan(S.cam + W + P.lenMax);
      while (S.plans.length && S.plans[0].u - S.cam <= W + 70) this.raftSpawn(S.plans.shift());
      if (!S.hasVeil && !S.veil && !S.veilDue) { S.veilCd -= ms; if (S.veilCd <= 0) { S.veilDue = true; S.veilCd = P.veilMs; } }

      /* squalls: the stars go out, the sea ahead goes dark; lightning lights it */
      var sq = S.sq;
      if (P.dark > 0) {
        sq.t += ms;
        if (!sq.on && sq.t >= sq.next) { sq.on = true; sq.t = 0; this.raftTell("squall", "A squall hides the stars and the sea ahead. Lightning lights it for a moment."); }
        else if (sq.on && sq.t >= P.squallMs) { sq.on = false; sq.t = 0; sq.next = P.calmMs; }
      }
      sq.lvl = clamp(sq.lvl + (sq.on ? 0.55 : -0.45) * s, 0, 1);
      S.flash = Math.max(0, S.flash - s * 1.5);
      if (sq.lvl > 0.35) {
        S.lightCd -= ms;
        if (S.lightCd <= 0) {
          S.lightCd = P.lightMs * rnd(0.75, 1.25); S.flash = 1;
          S.bolt.setPosition(rnd(W * 0.35, W * 0.95), rnd(-20, 10) * vs).setScale(vs * rnd(0.8, 1.1)).setFlipX(Math.random() < 0.5);
          try { if (window.SolRealms && SolRealms.hiss) { SolRealms.hiss(1.3, 140, 0.06, 0.18); SolRealms.blip(70, 40, 0.9, "sine", 0.05, 0.15); } } catch (eT) {}
        }
      }
      S.bolt.setAlpha(S.flash > 0.4 ? (S.flash - 0.4) / 0.6 : 0);
      S.sky.setAlpha(1 - 0.92 * sq.lvl);
      S.cloud.setAlpha(sq.lvl * 0.97);
      /* rain: slanting streaks, a few dozen lines */
      var rg = S.rainG; rg.clear();
      if (sq.lvl > 0.02) {
        rg.lineStyle(1.4, 0x9fd3d6, 0.45 * sq.lvl);
        for (i = 0; i < 44; i++) {
          var rxx = ((i * 233.7 + S.t * 150) % (W + 60)) - 30, ryy = ((i * 97.3 + S.t * 560) % (H + 40)) - 20, rl = (14 + (i % 4) * 4) * vs;
          rg.lineBetween(rxx, ryy, rxx - rl * 0.3, ryy + rl);
        }
      }

      /* the four winds */
      var gu = S.gu, gmul = 1;
      if (P.gust > 0) {
        gu.t += ms;
        if (gu.state === "calm" && gu.t >= gu.next && !this._between) {
          gu.state = "warn"; gu.t = 0; gu.dir = Math.random() < 0.5 ? 1 : -1;
          S.gustText.setText(gu.dir > 0 ? "THE SOUTH WIND LIFTS YOU" : "THE NORTH WIND PRESSES DOWN");
          this.raftTell("gust", "The winds! The South Wind lifts the raft; the North Wind presses it down.");
        } else if (gu.state === "warn" && gu.t >= 900) { gu.state = "on"; gu.t = 0; }
        else if (gu.state === "on" && gu.t >= 1700) { gu.state = "calm"; gu.t = 0; gu.next = P.gustEvery * rnd(0.85, 1.15); }
        if (gu.state === "on") gmul = gu.dir > 0 ? 1 - P.gust * 0.75 : 1 + P.gust * 1.2;
      }
      S.gustText.setVisible(gu.state !== "calm").setPosition(W / 2, H * 0.12).setAlpha(gu.state === "warn" ? 0.55 + 0.45 * Math.sin(S.t * 12) : 1);

      /* Poseidon's waves: a dark swell and a rumble on the right, then the wave rolls in */
      if (!this._between) S.breakCd -= ms;
      if (S.breakCd <= 0) {
        if (this.raftBreakerSoon()) S.breakCd = 260;
        else {
          this.raftBreaker(0);
          if (Math.random() < P.double) this.raftBreaker(rnd(1100, 1500));
          S.breakCd = P.breakEvery * rnd(0.85, 1.15);
        }
      }
      var vb = v * P.breakSp, warnOn = false;
      for (i = S.breakers.length - 1; i >= 0; i--) {
        var b = S.breakers[i];
        b.t += ms;
        if (b.state === "wait") { if (b.t >= b.wait) { b.state = "warn"; b.t = 0; } continue; }
        if (b.state === "warn") {
          warnOn = true;
          b.A = b.Amax * 0.45 * clamp(b.t / b.warn, 0, 1);
          if (!b.rumbled) {
            b.rumbled = true;
            try { if (window.SolRealms && SolRealms.blip) { SolRealms.blip(62, 38, 1.1, "sawtooth", 0.035); SolRealms.hiss(1.1, 220, 0.05); } } catch (eR) {}
            this.raftTell("wave", "Poseidon's wave! Hold ▲ (or LIFT) as it reaches you to ride on top of it.");
          }
          if (b.t >= b.warn) { b.state = "run"; b.t = 0; }
        } else {
          b.x -= vb * s;
          b.A = b.Amax * (0.45 + 0.55 * clamp(b.t / 600, 0, 1));
          if (b.x + BW * 2.6 < 0) { b.curl.destroy(); S.breakers.splice(i, 1); continue; }
        }
      }

      /* the surface, once a frame (the breakers have moved) */
      var ys = S.ys, yb = S.yb, n = S.n, bs = S.breakers, j;
      for (i = 0; i < n; i++) {
        var px = -STEP + i * STEP, py = this.raftBase(S.cam + px);
        yb[i] = py;
        for (j = 0; j < bs.length; j++) { var bb = bs[j]; if (bb.A > 0) py = Math.min(py, S.seaY - bb.A * vs * brkProf(px - bb.x, bb.fw, BW)); }
        ys[i] = py;
      }

      /* ── the raft ── */
      var rx = S.rx, sy = this.raftSurf(rx), svy = (sy - R.lastSy) / Math.max(s, 0.001);
      R.lastSy = sy;
      var dive = inp.ay > 0, lift = !dive && (inp.ay < 0 || inp.fire), press = lift && !R.liftWas;
      R.liftWas = lift;
      var g = G * vs * gmul * (lift ? (R.vy < 0 ? G_RISE : G_GLIDE) : dive ? G_DIVE : 1);
      R.hopCd = Math.max(0, R.hopCd - ms); R.coyote = Math.max(0, R.coyote - ms);
      if (R.tumble > 0) {
        /* swamped: held under the wave, then it bobs back up behind it */
        R.tumble -= ms; R.air = false; R.dip = 0;
        R.y = this.raftBase(S.cam + rx) + 26 * vs; R.vy = 0; R.rot += s * 7;
        if (R.tumble <= 0) {
          if (sy < this.raftBase(S.cam + rx) - 8 * vs) R.tumble = 120;
          else { R.y = sy; R.air = true; R.vy = -260 * vs; R.rot = 0; this.burst(rx, sy, 0x9fd3d6, 14); R.lastSy = sy; R.airLift = false; }
        }
      } else if (!R.air) {
        R.dip = dive ? Math.min(DIP * vs, R.dip + 260 * vs * s) : Math.max(0, R.dip - 170 * vs * s);
        if (lift && R.hopCd <= 0 && R.dip < 8 * vs) {
          R.air = true; R.vy = Math.min(svy, 0) * 0.85 - HOP * vs; R.y = sy - 1; R.hopCd = 220; S.hops++; R.airLift = true;
          try { if (window.SolRealms && SolRealms.hiss) SolRealms.hiss(0.2, 1500, 0.025); } catch (eH) {}
        } else {
          /* a steep crest throws the raft when the water falls away faster than it can follow */
          var vyAir = R.vy + g * s, yAir = R.y + vyAir * s;
          if (yAir < sy - 0.5 && !dive) { R.air = true; R.vy = vyAir; R.y = yAir; R.coyote = 130; R.airLift = true; }
          else { R.vy = clamp(svy, -900 * vs, 900 * vs); R.y = sy; }
        }
      } else {
        if (lift && R.coyote > 0 && R.hopCd <= 0) { R.vy = Math.min(R.vy, 0) - HOP * vs; R.coyote = 0; R.hopCd = 220; S.hops++; }
        else if (press && R.airLift && R.hopCd <= 0) {
          /* the sail catches a gust: one more lift in the air */
          R.airLift = false; R.vy = Math.min(R.vy, 0) - HOP * AIR_HOP * vs; R.hopCd = 220; S.lifts = (S.lifts || 0) + 1;
          this.burst(rx - 30 * S.RS, R.y - 60 * S.RS, 0xefe6d2, 6);
          try { if (window.SolRealms && SolRealms.hiss) SolRealms.hiss(0.25, 2200, 0.02); } catch (eA) {}
        }
        R.vy += g * s;
        if (lift && R.vy > GLIDE_V * vs) R.vy = Math.max(GLIDE_V * vs, R.vy - 1600 * vs * s);   /* the sail brakes the fall */
        R.vy = Math.min(R.vy, 1500 * vs);
        R.y += R.vy * s;
        R.dip = Math.max(0, R.dip - 170 * vs * s);
        var ceil = 24 * vs - BOX.top * S.RS;
        if (R.y < ceil) { R.y = ceil; R.vy = Math.max(R.vy, 0); }
        if (R.y >= sy) {
          if (R.vy - svy > 420 * vs) { this.burst(rx + 10, sy, 0x9fd3d6, 10); try { if (window.SolRealms && SolRealms.hiss) SolRealms.hiss(0.25, 900, 0.035); } catch (eL) {} }
          R.y = sy; R.air = false; R.vy = svy; R.hopCd = Math.max(R.hopCd, 90);
        }
      }
      if (R.tumble <= 0) {
        var slope = (this.raftSurf(rx + 8) - this.raftSurf(rx - 8)) / 16;
        var want = R.air ? clamp(Math.atan2(R.vy, v * 1.6), -0.45, 0.45) : clamp(Math.atan(slope) * 0.85, -0.5, 0.5);
        R.rot += (want - R.rot) * Math.min(1, s * 9);
      }
      S.frameMs += ms;
      if (S.frameMs >= 420) { S.frameMs = 0; S.frame = 1 - S.frame; }
      var lowered = R.dip > 10 * vs;
      R.spr.setTexture("md-raft-raft-" + (lowered ? 2 : S.frame)).setPosition(rx, R.y + R.dip).setRotation(R.rot);
      this.blink(R.spr);
      this.player.setPosition(rx, R.y - 50 * vs);
      if (S.hasVeil) {
        var mvx = rx + 10 * S.RS + Math.cos(R.rot - Math.PI / 2) * 96 * S.RS, mvy = R.y + R.dip + Math.sin(R.rot - Math.PI / 2) * 96 * S.RS;
        S.mastVeil.setVisible(true).setPosition(mvx - 22 * vs, mvy).setScale(0.42 * vs * (0.9 + 0.1 * Math.sin(S.t * 9)), 0.42 * vs).setAlpha(0.9 + 0.1 * Math.sin(S.t * 5));
      } else S.mastVeil.setVisible(false);
      /* what touches things */
      var bx0 = rx + BOX.l * S.RS, bx1 = rx + BOX.r * S.RS, by0 = R.y + R.dip + (lowered ? BOX.low : BOX.top) * S.RS, by1 = R.y + R.dip + BOX.bot * S.RS;
      var live = R.tumble <= 0;
      function touches(x, y, r) {
        var dx = x < bx0 ? bx0 - x : x > bx1 ? x - bx1 : 0, dy = y < by0 ? by0 - y : y > by1 ? y - by1 : 0;
        return dx * dx + dy * dy < r * r;
      }

      /* ── letters ── */
      for (i = S.letters.length - 1; i >= 0; i--) {
        var o = S.letters[i], x = o.u - S.cam, y;
        if (x < -90) { this.raftFree(o); S.letters.splice(i, 1); continue; }
        if (o.kind === "star") y = o.y0 + Math.sin(S.t * 2.2 + o.ph) * 4 * vs;
        else {
          var wl = this.raftSurf(x);
          y = wl + (o.kind === "deep" ? DEEP_DOWN : -BUOY_UP) * S.LS + Math.sin(S.t * 2.6 + o.ph) * 2 * vs;
        }
        o.x = x; o.y = y;
        o.spr.setPosition(x, y).setRotation(o.kind === "star" ? Math.sin(S.t * 0.9 + o.ph) * 0.12 : 0);
        o.label.setPosition(x, y + 1); o.xm.setPosition(x, y);
        if (o.hint.visible) {
          if (o.state !== "live" || o.touched) o.hint.setVisible(false);
          else o.hint.setPosition(x, o.kind === "star" ? y + o.r + 16 * vs + Math.sin(S.t * 5) * 2 * vs : wl - 16 * vs - Math.sin(S.t * 5) * 2 * vs);
        }
        if (live && !o.touched && touches(x, y, o.r)) {
          var res = this.raftTouch(o, x, y);
          if (this._finishing) return;
          if (res === "done") break;
        }
      }

      /* ── rocks ── */
      for (i = S.rocks.length - 1; i >= 0; i--) {
        var k = S.rocks[i], kx = k.u - S.cam, ktop = S.seaY - k.h;
        if (kx < -80) { k.spr.destroy(); S.rocks.splice(i, 1); continue; }
        k.spr.setPosition(kx, S.seaY + 34 * vs);
        if (live && !k.hit && this.iframeMs <= 0 && kx + k.hw > bx0 + 6 * S.RS && kx - k.hw < bx1 - 6 * S.RS && by1 > ktop + 5 * vs && ktop < this.raftSurf(kx) - 4 * vs) {
          k.hit = true;
          this.burst(kx, ktop + 10, 0x9fd3d6, 14); snd("rock");
          this.raftHurt("YOU HIT THE ROCKS");
          if (this._finishing) return;
          R.air = true; R.vy = -380 * vs; R.y = Math.min(R.y, sy - 2); R.airLift = false;
        }
      }

      /* ── Ino's veil ── */
      if (S.veil) {
        var vx = S.veil.u - S.cam, vy = this.raftSurf(vx) - 50 * vs + Math.sin(S.t * 2 + S.veil.ph) * 6 * vs;
        S.veil.spr.setPosition(vx, vy).setRotation(Math.sin(S.t * 1.7 + S.veil.ph) * 0.15).setScale(vs * (1 + 0.06 * Math.sin(S.t * 6)), vs).setAlpha(0.85 + 0.15 * Math.sin(S.t * 4));
        if (vx < W - 30) this.raftTell("veil", "Ino's veil! Sail into it: the sea goddess's veil saves you from one hit.");
        if (live && touches(vx, vy, 28 * vs)) {
          S.hasVeil = true; this.burst(vx, vy, 0xefe6d2, 18);
          try { if (window.SolRealms && SolRealms.blip) { SolRealms.blip(660, 1320, 0.25, "sine", 0.04); SolRealms.blip(990, 1760, 0.3, "sine", 0.03, 0.12); } } catch (eV) {}
          this.showTag("INO'S VEIL", "#bfefff");
          this.toast("You have Ino's veil: it will save you from one wave or rock.", 3200);
          S.veil.spr.destroy(); S.veil = null;
        } else if (vx < -80) { S.veil.spr.destroy(); S.veil = null; }
      }

      /* ── Poseidon's wave reaches the raft: on top of it, or swamped ── */
      for (i = 0; i < S.breakers.length; i++) {
        var bk = S.breakers[i];
        if (bk.state !== "run" || bk.checked) continue;
        if (bk.x - bk.fw * 0.5 <= rx + BOX.r * S.RS * 0.6) {
          bk.checked = true;
          var crestTop = S.seaY - bk.A * vs;
          if (R.tumble > 0) continue;
          var onTop = (lift && R.dip < 6 * vs) || by1 <= crestTop + 24 * vs;
          if (onTop) { S.rides++; this.addKill(rx, R.y, "Twelve of Poseidon's waves ridden"); }
          else {
            this.burst(rx, R.y - 20 * vs, 0xefe6d2, 24); snd("rock");
            try { if (window.SolRealms && SolRealms.hiss) SolRealms.hiss(0.8, 600, 0.07); } catch (eS) {}
            var hurt = this.raftHurt("SWAMPED BY POSEIDON'S WAVE");
            if (this._finishing) return;
            if (hurt) { R.tumble = 650; R.air = false; }
          }
        }
      }
      this.raftDraw(s, warnOn, lift);
    },

    /* the picture: the mid swell, the sea, the foam, the breakers, the dark of a squall */
    raftDraw: function (s, warnOn, lift) {
      var S = this.rf, P = S.P, W = this.W, H = this.H, vs = S.vs, ys = S.ys, n = S.n, i, R = S.raft;
      var m = S.midG; m.clear();
      var mo = S.cam * 0.45, pM = S.pM, nM = S.nM;
      for (i = 0; i < nM; i++) {
        var mx = -12 + i * 12, mu = mx + mo;
        pM[i].x = mx; pM[i].y = S.midY - 13 * vs * Math.sin(mu * TAU / 230) - 6 * vs * Math.sin(mu * TAU / 97 + 1.3);
      }
      pM[nM].x = W + 12; pM[nM].y = S.seaY + 4; pM[nM + 1].x = -12; pM[nM + 1].y = S.seaY + 4;
      m.fillStyle(0x123a5c, 1); m.fillPoints(pM, true);
      m.lineStyle(2, 0x9fd3d6, 0.22); m.strokePoints(pM, false, false, nM);

      var g = S.seaG; g.clear();
      var pA = S.pA, pB = S.pB, pC = S.pC, pS = S.pS, t = S.t;
      for (i = 0; i < n; i++) {
        var x = -STEP + i * STEP, y = ys[i] + 2 * vs * Math.sin((x + S.cam) * 0.045 - t * 2.4);
        pS[i].x = x; pS[i].y = y;
        pA[i].x = x; pA[i].y = y;
        pB[i].x = x;
        pC[i].x = x; pC[i].y = y + 52 * vs;
      }
      [pA, pC].forEach(function (p) { p[n].x = W + STEP; p[n].y = H + 4; p[n + 1].x = -STEP; p[n + 1].y = H + 4; });
      g.fillStyle(0x1b5580, 1); g.fillPoints(pA, true);
      g.fillStyle(0x0d3050, 0.8); g.fillPoints(pC, true);
      /* the dark body of each of Poseidon's waves: the hump above the usual sea, and a little under it */
      var pT = S.pT, brk = S.brkG, yb = S.yb; brk.clear();
      S.breakers.forEach(function (b) {
        if (b.A <= 0) return;
        var x0 = Math.max(-STEP, b.x - b.fw), x1 = Math.min(W + STEP, b.x + BW * 2.2), k = 0, j;
        if (x1 <= x0) return;
        var i0 = Math.max(0, Math.floor((x0 + STEP) / STEP)), i1 = Math.min(n - 1, Math.ceil((x1 + STEP) / STEP));
        for (j = i0; j <= i1; j++, k++) { pT[k].x = pS[j].x; pT[k].y = pS[j].y; }
        if (k < 2) return;
        var kk = k;
        for (j = i1; j >= i0; j--, kk++) { pT[kk].x = pS[j].x; pT[kk].y = Math.max(pS[j].y, yb[j] + 44 * vs * brkProf(pS[j].x - b.x, b.fw, BW)); }
        g.fillStyle(0x1a0f2a, 0.55 * clamp(b.A / b.Amax, 0, 1)); g.fillPoints(pT, true, false, kk);
        /* the white face and the breaking lip, drawn above the dark of a squall so they always show */
        var fa = clamp(b.A / b.Amax, 0, 1), kf = 0;
        while (kf < k - 1 && pT[kf].x < b.x + 24) kf++;
        brk.lineStyle(4 * vs, 0xefe6d2, 0.85 * fa); brk.strokePoints(pT, false, false, kf + 1);
        var crestY = S.seaY - b.A * vs;
        b.curl.setPosition(b.x + 2, crestY + 2).setScale(b.A * vs / 190).setAlpha(b.state === "run" ? 1 : fa * 0.9);
        if (b.state === "run") {
          for (var q = 0; q < 6; q++) {
            var sx = b.x - b.fw * (0.25 + q * 0.12) - ((t * 140 + q * 37) % 30), syy = crestY + (q * 13 + (t * 160 + q * 23) % 40) * vs;
            brk.fillStyle(0xefe6d2, 0.6); brk.fillCircle(sx, syy, 2.2 * vs);
          }
        }
      });
      /* the dark swell at the right edge while a wave rises */
      if (warnOn) {
        var pulse = 0.5 + 0.5 * Math.sin(t * 7), sw = Math.round(22 * vs);
        for (i = 0; i < 6; i++) { brk.fillStyle(0x140c1e, (0.05 + 0.04 * pulse) * (i + 1)); brk.fillRect(W - sw * (6 - i), S.midY, sw, H - S.midY); }
      }
      S.warnText.setVisible(warnOn).setPosition(W - 14, S.seaY - P.breakH * vs - 30 * vs).setAlpha(0.65 + 0.35 * Math.sin(t * 10));
      /* foam: the surface line, two lines below it, caps on the crests */
      g.lineStyle(3 * vs, 0x9fd3d6, 0.9); g.strokePoints(pS, false);
      for (i = 0; i < n; i++) pB[i].y = pS[i].y + 14 * vs;
      g.lineStyle(2, 0x9fd3d6, 0.2); g.strokePoints(pB, false, false, n);
      for (i = 0; i < n; i++) pC[i].y = pS[i].y + 32 * vs;
      g.lineStyle(2, 0x9fd3d6, 0.12); g.strokePoints(pC, false, false, n);
      S.segs.forEach(function (sg) {
        var cx = sg.u0 + sg.L / 2 - S.cam;
        if (cx < -30 || cx > W + 30) return;
        var cy = pS[clamp(Math.round((cx + STEP) / STEP), 0, n - 1)].y;
        g.fillStyle(0xefe6d2, 0.55); g.fillEllipse(cx, cy + 1, 30 * vs, 5 * vs);
        g.fillStyle(0xefe6d2, 0.35); g.fillCircle(cx - 14 * vs, cy + 5 * vs, 1.8 * vs); g.fillCircle(cx + 11 * vs, cy + 4 * vs, 1.6 * vs);
      });

      /* the raft's wake, the sunken buoys' ripples and bubbles, the wind */
      var tg = S.topG; tg.clear();
      if (!R.air && R.tumble <= 0) {
        for (i = 0; i < 5; i++) {
          var wx = S.rx - 64 * S.RS - i * 13 - ((t * P.scroll) % 13), wy = this.raftSurf(wx);
          tg.fillStyle(0xefe6d2, 0.45 * (1 - i / 5)); tg.fillEllipse(wx, wy + 1, 12 - i, 3.5);
        }
        tg.fillStyle(0xefe6d2, 0.5); tg.fillEllipse(S.rx + BOX.r * S.RS, R.y + R.dip, 14, 4);
      }
      S.rocks.forEach(function (k) {
        var kx = k.u - S.cam, ky = Math.min(S.seaY, ys[clamp(Math.round((kx + STEP) / STEP), 0, n - 1)]);
        if (kx < -60 || kx > W + 60 || ky < S.seaY - k.h + 6 * vs) return;
        tg.fillStyle(0xefe6d2, 0.6); tg.fillEllipse(kx, ky + 1, k.hw * 2.6 + 6 * Math.sin(t * 5 + k.u), 7 * vs);
        tg.fillStyle(0x9fd3d6, 0.5); tg.fillCircle(kx - k.hw * 1.3, ky - 3 * vs, 2.5 * vs); tg.fillCircle(kx + k.hw * 1.2, ky - 2 * vs, 2 * vs);
      });
      S.letters.forEach(function (o) {
        if (o.kind !== "deep") return;
        var wl = o.y - DEEP_DOWN * S.LS;
        tg.lineStyle(2, 0x9fd3d6, 0.55); tg.strokeEllipse(o.x, wl + 1, 40 * vs, 9 * vs);
        for (var bq = 0; bq < 3; bq++) {
          var by = o.y - 22 * vs - ((t * 30 + bq * 9) % 26) * vs;
          tg.lineStyle(1.2, 0xefe6d2, 0.6); tg.strokeCircle(o.x + (bq - 1) * 8 * vs, by, (1.5 + bq * 0.5) * vs);
        }
      });
      var gu = S.gu;
      if (gu.state !== "calm") {
        var ga = gu.state === "warn" ? 0.14 : 0.32;
        tg.lineStyle(2, 0xefe6d2, ga);
        for (i = 0; i < 16; i++) {
          var lx = W - ((t * 620 + i * 97) % (W + 140)), ly = H * (0.1 + (i * 0.37 % 1) * 0.6), dl = 70 + (i % 3) * 30;
          tg.lineBetween(lx, ly, lx + dl, ly + gu.dir * dl * 0.18);
        }
      }
      /* the cue: Poseidon's wave is about to reach you */
      var cue = false;
      S.breakers.forEach(function (b) { if (b.state === "run" && !b.checked && (b.x - b.fw * 0.5 - S.rx) / (P.scroll * P.breakSp) < 1.0) cue = true; });
      S.cue.setVisible(cue).setPosition(S.rx, R.y + R.dip + BOX.top * S.RS - 8 * vs).setAlpha(0.75 + 0.25 * Math.sin(t * 14));
      if (cue && S.cueLift !== !!lift) { S.cueLift = !!lift; S.cue.setColor(lift ? "#9aefc0" : "#efe6d2"); }

      /* the dark of a squall: a clear pool round the raft and a little way ahead */
      var dk = S.P.dark * S.sq.lvl * (1 - S.flash * 0.85), dg = S.darkG; dg.clear();
      if (dk > 0.01) {
        var half = Math.round(P.seeR * 1.15), hx = Math.round(S.rx + P.seeR * 0.42), hy = Math.round(clamp(R.y - 40 * vs, H * 0.3, H * 0.75));
        S.dark.setVisible(true).setPosition(hx, hy).setScale(half / 128).setAlpha(dk);
        dg.fillStyle(0x05060c, dk);
        if (hy - half > 0) dg.fillRect(0, 0, W, hy - half);
        if (hy + half < H) dg.fillRect(0, hy + half, W, H - hy - half);
        if (hx - half > 0) dg.fillRect(0, hy - half, hx - half, half * 2);
        if (hx + half < W) dg.fillRect(hx + half, hy - half, W - hx - half, half * 2);
      } else S.dark.setVisible(false);
    },

    raftPlace: function () {
      var S = this.rf;
      S.raft.spr.setPosition(S.rx, S.raft.y);
      this.player.setPosition(S.rx, S.raft.y - 50 * S.vs);
    }
  });
})();
