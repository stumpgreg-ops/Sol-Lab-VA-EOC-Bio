/* SOL Labyrinth v5.7.1 — shooter levels.
 *
 * Every other level of each realm (levels 2, 4, 6 and 8) swaps the maze for a
 * shooter, in rotation:
 *   2  Eagle Swoop   galaga style: eagles carry the letters above a raven guard and dive; shoot the right eagle
 *   4  Rune Rocks    asteroids style: beam in the rock with the right letter, blast the rest
 *   6  Sun Chariot   side-scrolling flyer: shoot the letter orb with the right answer
 *   8  Wolf Ring     arena: Hati circle in; shoot the runestone with the right answer
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
      how: "Great eagles sit at the top of the sky, each carrying a letter in its talons, with rows of ravens flying guard below them. Shoot the eagle that carries the right answer. An eagle takes two arrows. Ravens and eagles swoop down at Sol, and an eagle can stop and shine a beam down to catch him.",
      rules: "A wrong letter costs a life. So does a feather, a bird crashing into you, or getting caught in an eagle's beam.",
      keys: "◀ ▶ or A / D move · Space, FIRE or a mouse button shoots (clicking does not move Sol).",
      tip: "EAGLE SWOOP — shoot the eagle with the right letter. Dodge the beams.",
      hint1: "Shoot the eagle carrying the right letter — it takes two arrows. The problem set stays in the side panel.",
      hint2: "This question has two right letters. Shoot both eagles that carry them."
    },
    rocks: {
      id: "rocks", name: "Rune Rocks", kind: "asteroids level",
      how: "Rocks drift through space and a few carry letters. Hold your beam on the rock with the right answer to pull it in. Blast the wrong letters and the plain rocks before they hit you.",
      rules: "Pulling in a wrong letter costs a life. So does blasting the right answer, or a rock hitting your ship.",
      keys: "◀ ▶ turn · ▲ thrust · Space or FIRE shoots · ▼, Shift or PULL holds the beam. With a mouse, hold the button to turn toward it and fire.",
      tip: "RUNE ROCKS — beam in the right letter, blast the rest. Don't get hit.",
      hint1: "Pull in the rock with the right letter (▼, Shift or PULL). Blast the others. The problem set stays in the side panel.",
      hint2: "This question has two right letters. Pull in both rocks that carry them."
    },
    sky: {
      id: "sky", name: "Sun Chariot", kind: "flying shooter level",
      how: "Sol drives the sun's chariot across the sky. Letter orbs float past among ravens and will-o'-wisps. Shoot the orb with the right answer. Orbs you miss come round again.",
      rules: "Shooting a wrong orb costs a life. So does flying into a raven or a wisp.",
      keys: "Arrow keys or WASD fly · Space or FIRE shoots · or hold the mouse or a finger where you want to fly.",
      tip: "SUN CHARIOT — shoot the orb with the right letter. Dodge the ravens and wisps.",
      hint1: "Shoot the orb with the right letter. The problem set stays in the side panel.",
      hint2: "This question has two right letters. Shoot both orbs that carry them."
    },
    ring: {
      id: "ring", name: "Wolf Ring", kind: "arena level",
      how: "Sol stands inside a ring of runestones while the Hati circle in. Shoot the runestone with the right answer. An arrow sends a wolf running.",
      rules: "Shooting a wrong stone costs a life. So does letting a wolf reach you.",
      keys: "Arrow keys or WASD move and aim · Space or FIRE shoots · or click or tap to aim and shoot.",
      tip: "WOLF RING — shoot the runestone with the right letter. Keep the wolves off.",
      hint1: "Shoot the runestone with the right letter. The problem set stays in the side panel.",
      hint2: "This question has two right letters. Shoot both runestones that carry them."
    }
  };
  var SLOTS = { 2: "raid", 4: "rocks", 6: "sky", 8: "ring" };

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
  function drawFeather(c, w, h) {
    c.fillStyle = "#2a2238"; c.beginPath(); c.moveTo(w / 2, 0);
    c.quadraticCurveTo(w, h * 0.45, w / 2, h - 3); c.quadraticCurveTo(0, h * 0.45, w / 2, 0); c.fill();
    c.strokeStyle = "#8a80a8"; c.lineWidth = 1.2; c.beginPath(); c.moveTo(w / 2, 2); c.lineTo(w / 2, h); c.stroke();
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
    canvasTex(scene, "md-feather", 12, 26, drawFeather);
    canvasTex(scene, "md-shield", 42, 42, drawShield);
    canvasTex(scene, "md-eagle-0", 88, 62, drawEagle(true));
    canvasTex(scene, "md-eagle-1", 88, 62, drawEagle(false));
    for (var i = 0; i < 3; i++) canvasTex(scene, "md-rock-" + i, 100, 100, drawRock(i + 1, false));
    canvasTex(scene, "md-rock-l", 100, 100, drawRock(7, true));
    canvasTex(scene, "md-ship", 44, 52, drawShip);
    canvasTex(scene, "md-chariot", 110, 72, drawChariot);
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

        this.pal = (this.realm && this.realm.pal) || { wall: 0x2f3b2c, stroke: 0x5a7050, lip: 0x8aa47a, floorA: 0xdcd4b4, floorB: 0xb9b08e, accent: 0xf5d76e, wash: 0x6aa84a, void: 0x07100a };
        this.W = this.scale.width; this.H = this.scale.height;
        ensureModeArt(this, this.pal);
        this.cameras.main.setBackgroundColor(hex(this.pal.void));

        this.keys = this.input.keyboard.addKeys("LEFT,RIGHT,UP,DOWN,W,A,S,D,SPACE,SHIFT");
        this.ptr = { down: false, x: 0, y: 0, t: -9999 };
        this.input.on("pointerdown", function (p) { self.ptr.down = true; self.ptr.x = p.x; self.ptr.y = p.y; self.ptr.t = self.time.now; });
        this.input.on("pointermove", function (p) { self.ptr.x = p.x; self.ptr.y = p.y; if (p.isDown || self.ptr.down) self.ptr.t = self.time.now; });
        this.input.on("pointerup", function () { self.ptr.down = false; });
        this.input.on("pointerupoutside", function () { self.ptr.down = false; });

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
        if (this.readOpen || this.ended) { Input.actEdge = false; Input.shutterEdge = false; return; }
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
        return {
          ax: (right ? 1 : 0) - (left ? 1 : 0),
          ay: (down ? 1 : 0) - (up ? 1 : 0),
          fire: !locked && (k.SPACE.isDown || Input.act || !!ptr),
          pull: k.SHIFT.isDown || !!Input.shutterHeld || (this.mode.id === "rocks" && down),
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
        if ((this.need || []).indexOf(L) === -1) { this.answerWrong(L, "WRONG LETTER", x, y); return "wrong"; }
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
              "<p class=\"perks\"><b>Controls:</b> " + m.keys + "</p>";
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
            msg.textContent = (this.lastStrikeReason === "wrong" ? "That wrong letter used your last life. " :
              (this._lastHitLabel ? "Last hit: " + this._lastHitLabel.toLowerCase() + ". " : "")) +
              "In " + m.name + ", wrong letters and hits both cost a life. Retry this level — the campaign stays here.";
          }
        } catch (e) {}
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
        try { if (this.input.mouse) this.input.mouse.disableContextMenu(); } catch (e) {}
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
        var gapE = 100, gapR = 62, cols = clamp(Math.floor((W * 0.72) / gapR), 6, 11), rows = this.night >= 40 ? 3 : 2;
        var list = [];
        for (i = 0; i < n; i++) {
          var eg = { kind: "eagle", letter: letters[i], hp: 2, alive: true, sx: (i - (n - 1) / 2) * gapE, sy: 0, state: "wait", x: -99, y: -99 };
          eg.spr = this.add.image(-99, -99, "md-eagle-0").setScale(1.12).setDepth(13);
          eg.shield = this.add.image(-99, -99, "md-shield").setDepth(12).setScale(0.95);
          eg.label = this.letterText(-99, -99, eg.letter, 22, "#2a1604", "#fff6d8");
          list.push(eg);
        }
        for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) R.ravSlots.push({ sx: (c - (cols - 1) / 2) * gapR, sy: 88 + r * 54 });
        var rav = [];
        R.ravSlots.forEach(function (sl, k) { rav.push(self.raidRaven(k)); });
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
        R.diveCd = 2500 + (g + 1) * 750 + 2000;
        R.refillCd = 9000;
        this.raidSway();
        snd("caw");
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
          this.toast("That eagle is hurt. One more arrow and its letter " + o.letter + " is your answer.", 2600);
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
        if (inp.fire && R.cd <= 0 && R.arrows.length < 2) {
          R.arrows.push({ x: p.x, y: p.y - 36, spr: this.add.image(p.x, p.y - 36, "md-arrow").setDepth(18) });
          R.cd = 260; R.fired += 1; snd("shot");
        }
        for (i = R.arrows.length - 1; i >= 0; i--) {
          var a = R.arrows[i], y0 = a.y, hit = false;
          a.y -= 760 * s; a.spr.y = a.y;
          var tgt = this._finishing ? null : this.raidArrowHit(a.x, y0, a.y);
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
              var want = this.night >= 30 ? 2 : 1;
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
        var maxDivers = 2 + Math.floor(this.night / 35);
        if (R.diveCd <= 0 && anyForm && divers < maxDivers) {
          this.raidLaunch();
          R.diveCd = rnd(1300, 2500) * (1 - Math.min(0.45, this.night / 220));
        }
        /* when the ravens thin out, more fly in to shield the eagles */
        R.refillCd -= ms;
        if (R.refillCd <= 0) {
          R.refillCd = 7000;
          var used = {}, liveRav = 0;
          R.ravens.forEach(function (o) { if (o.kind === "raven") { used[o.slot] = 1; liveRav++; } });
          if (liveRav <= R.total * 0.6 && R.ravens.some(function (o) { return o.kind === "eagle"; })) {
            var empties = R.ravSlots.map(function (x, k) { return k; }).filter(function (k) { return !used[k]; });
            shuffle(empties).slice(0, 4).forEach(function (k, j) {
              var nr = self.raidRaven(k); nr.delay = j * 130; nr.side = Math.random() < 0.5 ? -1 : 1; R.ravens.push(nr);
            });
          }
        }
        /* falling feathers */
        for (i = R.feathers.length - 1; i >= 0; i--) {
          var f = R.feathers[i], gone = false;
          f.t += s; f.y += (210 + this.night * 1.1) * s; f.x += ((f.vx || 0) + Math.sin(f.t * 6) * 40) * s;
          f.spr.setPosition(f.x, f.y).setRotation(Math.sin(f.t * 6) * 0.4);
          if (dist(f.x, f.y, p.x, p.y - 10) < 24) { gone = true; this.loseLife("hit", "HIT BY A FEATHER"); }
          if (gone || f.y > H + 20) { f.spr.destroy(); R.feathers.splice(i, 1); }
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
      raidFeather(x, y) {
        var p = this.player, fall = Math.max(0.4, (p.y - y) / (210 + this.night * 1.1));
        var vx = clamp((p.x - x) / fall, -140, 140) * (this.night >= 20 ? 1 : 0.6);
        this.raid.feathers.push({ x: x, y: y, vx: vx, t: 0, spr: this.add.image(x, y, "md-feather").setDepth(17) });
      }
      raidLaunch() {
        var R = this.raid, self = this;
        var form = R.ravens.filter(function (o) { return o.alive && o.state === "form"; });
        var eagles = form.filter(function (o) { return o.kind === "eagle"; }), ravens = form.filter(function (o) { return o.kind === "raven"; });
        var beaming = R.ravens.some(function (o) { return o.alive && (o.state === "beam" || o.beamer); });
        if (eagles.length && (Math.random() < 0.4 || !ravens.length)) {
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
        try { this.fxG.clear(); } catch (e) {}
      }

      /* ═══ 2. RUNE ROCKS — asteroids ═══════════════════════════════════════ */
      setup_rocks() {
        this.drawSkyBg(160, true);
        var W = this.W, H = this.H;
        var ship = { x: W / 2, y: H / 2, vx: 0, vy: 0, ang: -Math.PI / 2, spr: this.add.image(W / 2, H / 2, "md-ship").setScale(1.2).setDepth(20) };
        this.makeSol(W / 2, H / 2, "up").setVisible(false);   /* Sol flies the ship; the sprite stays for coin pop-ups */
        this.rk = { ship: ship, rocks: [], bullets: [], cd: 0, spawnCd: 0, target: null, beamSnd: 0, gen: 0 };
        var n = 4 + Math.floor(this.night / 22), i;
        for (i = 0; i < n; i++) this.rockFromEdge(3, null);
      }
      resize_rocks() { this.drawSkyBg(160, true); }
      rockMake(size, letter, x, y, vx, vy) {
        var R = this.rk, rad = size === 3 ? 46 : size === 2 ? 32 : 18;
        var o = { x: x, y: y, vx: vx, vy: vy, size: size, r: letter ? 34 : rad, letter: letter || null, rot: rnd(0, 6), spin: rnd(-1.2, 1.2), gen: R.gen };
        o.spr = this.add.image(x, y, letter ? "md-rock-l" : "md-rock-" + Math.floor(rnd(0, 3))).setScale((letter ? 34 : rad) / 46).setDepth(11);
        if (letter) { o.spin *= 0.4; o.label = this.letterText(x, y, letter, 30, "#fff4c8", "#1a1008").setDepth(14); }
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
        var sp = letter ? rnd(34, 56) + this.night * 0.2 : rnd(40, 80) + this.night * 0.45;
        return this.rockMake(size, letter, x, y, Math.cos(a) * sp, Math.sin(a) * sp);
      }
      rockRemove(o) {
        var R = this.rk, i = R.rocks.indexOf(o);
        if (i >= 0) R.rocks.splice(i, 1);
        if (R.target === o) R.target = null;
        kill(o);
      }
      answers_rocks() {
        var R = this.rk, self = this;
        R.gen += 1;
        R.rocks.filter(function (o) { return o.letter; }).forEach(function (o) { self.burst(o.x, o.y, 0xffd84a, 10); self.rockRemove(o); });
        shuffle(this.choiceLetters().slice()).forEach(function (L) { self.rockFromEdge(2, L); });
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
            this.time.delayedCall(1600, function () { if (!self.ended && !self._finishing && self.rk.gen === gen && self.extracted.indexOf(L) === -1) self.rockFromEdge(2, L); });
          } else {
            this.toast("Letter " + L + " was not the answer. Rock cleared.", 2400);
            this.addKill(o.x, o.y, "Rocks cleared");
          }
          return;
        }
        this.burst(o.x, o.y, 0x9a9488, o.size * 6); snd("rock");
        if (o.size > 1) {
          var a = Math.atan2(o.vy, o.vx), sp = Math.sqrt(o.vx * o.vx + o.vy * o.vy) * 1.3 + 20, k;
          for (k = -1; k <= 1; k += 2) this.rockMake(o.size - 1, null, o.x, o.y, Math.cos(a + k * 0.7) * sp, Math.sin(a + k * 0.7) * sp);
        }
        this.rockRemove(o);
        if (!noCredit) this.addKill(o.x, o.y, "Rocks cleared");
      }
      rockCaught(o) {
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
        var thrust = inp.ay < 0;
        S.ang += inp.ax * 3.8 * s;
        if (inp.ptr) {
          var want = Math.atan2(inp.ptr.y - S.y, inp.ptr.x - S.x), d = angDiff(want, S.ang);
          S.ang += clamp(d, -5 * s, 5 * s);
          if (Math.abs(d) < 0.5 && dist(inp.ptr.x, inp.ptr.y, S.x, S.y) > 140) thrust = true;
        }
        if (thrust) { S.vx += Math.cos(S.ang) * 420 * s; S.vy += Math.sin(S.ang) * 420 * s; }
        var sp = Math.sqrt(S.vx * S.vx + S.vy * S.vy);
        if (sp > 340) { S.vx *= 340 / sp; S.vy *= 340 / sp; }
        var damp = Math.pow(0.55, s); S.vx *= damp; S.vy *= damp;
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
          R.cd = 170; snd("shot");
        }
        for (i = R.bullets.length - 1; i >= 0; i--) {
          var b = R.bullets[i], hit = null;
          b.x += b.vx * s; b.y += b.vy * s; b.life -= s;
          this.wrap(b, 10);
          b.spr.setPosition(b.x, b.y);
          for (j = 0; j < R.rocks.length; j++) { if (dist(b.x, b.y, R.rocks[j].x, R.rocks[j].y) < R.rocks[j].r + 4) { hit = R.rocks[j]; break; } }
          if (hit || b.life <= 0) { b.spr.destroy(); R.bullets.splice(i, 1); }
          if (hit) { this.rockShot(hit); if (this._finishing) return; }
        }
        /* the beam: pulls in the nearest rock in front of the ship */
        R.target = null;
        if (inp.pull) {
          var best = null, bd = 1e9;
          R.rocks.forEach(function (o) {
            if (o.size > 2) return;
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
          if (best) {
            R.target = best;
            g.lineStyle(5, 0xffe07a, 0.55); g.lineBetween(S.x + nx * 18, S.y + ny * 18, best.x, best.y);
            g.lineStyle(2, 0xffffff, 0.8); g.strokeCircle(best.x, best.y, best.r + 6);
            var tx = S.x - best.x, ty = S.y - best.y, tl = Math.sqrt(tx * tx + ty * ty) || 1;
            best.vx = best.vx * Math.pow(0.2, s) + tx / tl * 320 * s * 4;
            best.vy = best.vy * Math.pow(0.2, s) + ty / tl * 320 * s * 4;
            if (tl < best.r + 20) { this.rockCaught(best); if (this._finishing) return; }
          }
        }
        /* rocks drift and wrap; any rock but the beamed one hurts */
        for (i = R.rocks.length - 1; i >= 0; i--) {
          var o = R.rocks[i];
          if (!o) continue;
          o.x += o.vx * s; o.y += o.vy * s; o.rot += o.spin * s;
          this.wrap(o, o.r + 8);
          o.spr.setPosition(o.x, o.y).setRotation(o.rot);
          if (o.label) o.label.setPosition(o.x, o.y);
          if (o !== R.target && dist(o.x, o.y, S.x, S.y) < o.r + 17 && this.iframeMs <= 0) {
            var hurt = this.loseLife("hit", "HIT BY A ROCK");
            if (hurt) {
              var ka = Math.atan2(S.y - o.y, S.x - o.x);
              S.vx = Math.cos(ka) * 220; S.vy = Math.sin(ka) * 220;
              if (!o.letter) this.rockShot(o, true);
              else { o.vx = -Math.cos(ka) * 80; o.vy = -Math.sin(ka) * 80; }
            }
            if (this._finishing) return;
          }
        }
        /* keep the field busy */
        var blanks = R.rocks.filter(function (o) { return !o.letter; }).reduce(function (a, o) { return a + o.size; }, 0);
        R.spawnCd -= ms;
        if (R.spawnCd <= 0 && blanks < 10 + Math.floor(this.night / 12)) { this.rockFromEdge(3, null); R.spawnCd = 2600; }
      }
      clear_rocks() {
        var R = this.rk, self = this;
        R.gen += 1;
        R.rocks.filter(function (o) { return o.letter; }).forEach(function (o) { self.burst(o.x, o.y, 0xffd84a, 10); self.rockRemove(o); });
      }

      /* ═══ 3. SUN CHARIOT — side-scrolling flyer ═══════════════════════════ */
      setup_sky() {
        this.drawSkyBg(50);
        this.skyHills();
        var x = this.W * 0.2, y = this.H / 2;
        this.chariot = this.add.image(x, y, "md-chariot").setScale(1.25).setDepth(21);
        this.makeSol(x - 10, y - 36, "right", 1.6);
        this.sky = { bolts: [], foes: [], orbs: [], cd: 0, spawnCd: 1800, t: 0, x: x, y: y };
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
        var K2 = this.sky, W = this.W, H = this.H, self = this;
        K2.orbs.forEach(kill); K2.orbs = [];
        var letters = shuffle(this.choiceLetters().slice()), n = letters.length;
        var lanes = []; for (var i = 0; i < n; i++) lanes.push(90 + (H - 190) * (n === 1 ? 0.5 : i / (n - 1)));
        shuffle(lanes);
        letters.forEach(function (L, k) {
          var o = { x: W + 90 + k * 200, by: lanes[k], y: lanes[k], ph: rnd(0, 6), letter: L, vx: -(78 + self.night * 0.45) };
          o.spr = self.add.image(o.x, o.y, "md-orb").setDepth(13);
          o.label = self.letterText(o.x, o.y, L, 28, "#1a2a5a", "#ffffff");
          K2.orbs.push(o);
        });
      }
      tick_sky(s, inp, ms) {
        var K2 = this.sky, W = this.W, H = this.H, i, j, self = this;
        K2.t += s;
        if (this.hillFar) this.hillFar.tilePositionX += 30 * s;
        if (this.hillNear) this.hillNear.tilePositionX += 80 * s;
        /* flying */
        var vx = inp.ax * 380, vy = inp.ay * 380;
        if (inp.ay && inp.ax) { vx *= 0.7071; vy *= 0.7071; }
        if (inp.ptr) {
          var dx = inp.ptr.x - K2.x, dy = inp.ptr.y - K2.y, dl = Math.sqrt(dx * dx + dy * dy);
          if (dl > 12) { vx = dx / dl * 380; vy = dy / dl * 380; } else { vx = 0; vy = 0; }
        }
        K2.x = clamp(K2.x + vx * s, 60, W * 0.55); K2.y = clamp(K2.y + vy * s, 56, H - 44);
        this.chariot.setPosition(K2.x, K2.y + Math.sin(K2.t * 3) * 2);
        this.player.setPosition(K2.x - 10, K2.y - 36 + Math.sin(K2.t * 3) * 2);
        this.blink(this.chariot); this.blink(this.player);
        /* sunbolts */
        K2.cd -= ms;
        if (inp.fire && K2.cd <= 0) {
          K2.bolts.push({ x: K2.x + 60, y: K2.y - 4, spr: this.add.image(K2.x + 60, K2.y - 4, "md-bolt").setDepth(18) });
          K2.cd = 200; snd("shot");
        }
        for (i = K2.bolts.length - 1; i >= 0; i--) {
          var b = K2.bolts[i], hit = false;
          b.x += 820 * s; b.spr.x = b.x;
          for (j = 0; j < K2.foes.length && !hit; j++) {
            var f = K2.foes[j];
            if (dist(b.x, b.y, f.x, f.y) < f.r + 6) { hit = true; this.burst(f.x, f.y, f.kind === "wisp" ? 0xbfe8ff : 0x5a4a78, 12); snd("pop"); kill(f); K2.foes.splice(j, 1); this.addKill(f.x, f.y, "Sky cleared"); }
          }
          for (j = 0; j < K2.orbs.length && !hit; j++) {
            var o = K2.orbs[j];
            if (dist(b.x, b.y, o.x, o.y) < 32) {
              hit = true;
              K2.orbs.splice(j, 1);
              kill(o);
              this.answerPick(o.letter, o.x, o.y);
            }
          }
          if (hit || b.x > W + 30) { b.spr.destroy(); K2.bolts.splice(i, 1); }
          if (this._finishing) return;
        }
        /* orbs drift past and come round again */
        K2.orbs.forEach(function (o) {
          o.x += o.vx * s; o.y = o.by + Math.sin(K2.t * 1.6 + o.ph) * 26;
          if (o.x < -60) { o.x = W + 60 + rnd(0, 220); o.by = rnd(90, H - 100); }
          o.spr.setPosition(o.x, o.y); o.label.setPosition(o.x, o.y);
        });
        /* ravens and wisps */
        K2.spawnCd -= ms;
        if (K2.spawnCd <= 0 && !this._between) {
          var wisp = Math.random() < 0.3, y0 = rnd(60, H - 60);
          var foe = wisp
            ? { kind: "wisp", x: W + 40, y: y0, by: y0, r: 20, sp: 110 + this.night * 0.6, spr: this.add.image(W + 40, y0, "rf-wisp").setScale(0.7).setDepth(15) }
            : { kind: "raven", x: W + 40, y: y0, by: y0, r: 22, sp: rnd(170, 240) + this.night * 0.9, amp: rnd(20, 80), fr: rnd(1.5, 3), t: 0, spr: this.add.image(W + 40, y0, "rf-raven-0").setScale(0.7).setFlipX(true).setDepth(15) };
          K2.foes.push(foe);
          K2.spawnCd = Math.max(420, 1200 - this.night * 6) * rnd(0.7, 1.3);
        }
        for (i = K2.foes.length - 1; i >= 0; i--) {
          var e = K2.foes[i];
          if (e.kind === "wisp") {
            e.x -= e.sp * s;
            e.y += clamp(K2.y - e.y, -1, 1) * 60 * s;
            e.spr.setPosition(e.x, e.y).setAlpha(0.75 + Math.sin(K2.t * 8 + i) * 0.2);
          } else {
            e.t += s; e.x -= e.sp * s; e.y = e.by + Math.sin(e.t * e.fr) * e.amp;
            e.spr.setPosition(e.x, e.y).setTexture("rf-raven-" + (Math.floor(e.t * 4) % 2));
          }
          if (dist(e.x, e.y, K2.x, K2.y - 8) < e.r + 26) {
            var hurt = this.loseLife("hit", e.kind === "wisp" ? "A WISP HIT YOU" : "A RAVEN HIT YOU");
            if (hurt) { this.burst(e.x, e.y, 0xff9a7a, 12); kill(e); K2.foes.splice(i, 1); }
            if (this._finishing) return;
            continue;
          }
          if (e.x < -60) { kill(e); K2.foes.splice(i, 1); }
        }
      }
      clear_sky() {
        var K2 = this.sky, self = this;
        K2.foes.forEach(function (f) { self.burst(f.x, f.y, 0xffd84a, 6); kill(f); }); K2.foes = [];
        K2.orbs.forEach(function (o) { self.burst(o.x, o.y, 0xbfe8ff, 8); kill(o); }); K2.orbs = [];
        K2.spawnCd = 1800;
      }

      /* ═══ 4. WOLF RING — arena ════════════════════════════════════════════ */
      setup_ring() {
        this.rg = { arrows: [], wolves: [], stones: [], cd: 0, spawnCd: 2200, aim: -Math.PI / 2, frameMs: 0 };
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
      answers_ring() {
        var rg = this.rg, self = this;
        rg.stones.forEach(kill); rg.stones = [];
        var letters = shuffle(this.choiceLetters().slice());
        rg.stoneA0 = -Math.PI / 2 + rnd(-0.4, 0.4);
        letters.forEach(function (L) {
          var o = { letter: L, dead: false };
          o.spr = self.add.image(0, 0, "md-stone").setDepth(9);
          o.label = self.letterText(0, 0, L, 30, "#ffe07a", "#1a1008").setDepth(10);
          rg.stones.push(o);
        });
        this.ringPlaceStones();
      }
      ringPlaceStones() {
        var rg = this.rg, n = rg.stones.length;
        rg.stones.forEach(function (o, k) {
          var a = rg.stoneA0 + k / n * Math.PI * 2;
          o.x = rg.cx + Math.cos(a) * (rg.R - 34); o.y = rg.cy + Math.sin(a) * (rg.R - 34);
          if (o.spr) o.spr.setPosition(o.x, o.y);
          if (o.label) o.label.setPosition(o.x, o.y - 2);
        });
      }
      tick_ring(s, inp, ms) {
        var rg = this.rg, p = this.player, i, j, self = this, g = this.fxG, now = this.time.now;
        g.clear();
        /* move */
        var ax = inp.ax, ay = inp.ay, l = Math.sqrt(ax * ax + ay * ay) || 1;
        p.x += ax / l * 320 * s; p.y += ay / l * 320 * s;
        var dc = dist(p.x, p.y, rg.cx, rg.cy), lim = rg.R - 34;
        if (dc > lim) { p.x = rg.cx + (p.x - rg.cx) / dc * lim; p.y = rg.cy + (p.y - rg.cy) / dc * lim; }
        rg.stones.forEach(function (o) {
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
        if (inp.fire && rg.cd <= 0 && rg.arrows.length < 5) {
          rg.arrows.push({ x: p.x + ca * 22, y: p.y + sa * 22, vx: ca * 720, vy: sa * 720, spr: this.add.image(p.x, p.y, "md-arrow").setRotation(rg.aim + Math.PI / 2).setDepth(18) });
          rg.cd = 260; snd("shot");
        }
        for (i = rg.arrows.length - 1; i >= 0; i--) {
          var a = rg.arrows[i], hit = false;
          a.x += a.vx * s; a.y += a.vy * s; a.spr.setPosition(a.x, a.y);
          for (j = 0; j < rg.wolves.length && !hit; j++) {
            var w = rg.wolves[j];
            if (w.state === "run" && dist(a.x, a.y, w.x, w.y) < 30) { hit = true; this.wolfScare(w); this.addKill(w.x, w.y, "Wolves chased off"); }
          }
          for (j = 0; j < rg.stones.length && !hit; j++) {
            var o = rg.stones[j];
            if (!o.dead && dist(a.x, a.y, o.x, o.y) < 30) {
              hit = true;
              var res = this.answerPick(o.letter, o.x, o.y);
              if (res === "wrong") { o.dead = true; o.spr.setTint(0x555555); o.label.setText("✕").setColor("#8a8a8a"); }
              else if (res === "partial") { o.dead = true; o.spr.setTint(0xffe07a); }
            }
          }
          if (hit || dist(a.x, a.y, rg.cx, rg.cy) > rg.R + 90) { a.spr.destroy(); rg.arrows.splice(i, 1); }
          if (this._finishing) return;
        }
        /* the Hati */
        var running = rg.wolves.filter(function (w) { return w.state === "run"; }).length;
        rg.spawnCd -= ms;
        if (rg.spawnCd <= 0 && !this._between && running < 3 + Math.floor(this.night / 22)) {
          var sa2 = rnd(0, Math.PI * 2), wx = rg.cx + Math.cos(sa2) * (rg.R + 70), wy = rg.cy + Math.sin(sa2) * (rg.R + 70);
          rg.wolves.push({ x: wx, y: wy, state: "run", sp: Math.min(285, 145 + this.night * 1.4) * rnd(0.9, 1.1), spr: this.add.image(wx, wy, "hati1").setScale(0.5).setDepth(16) });
          if (Math.random() < 0.25) snd("howl");
          rg.spawnCd = Math.max(650, 2100 - this.night * 13) * rnd(0.75, 1.25);
        }
        rg.frameMs += ms;
        var frame = "hati" + (1 + Math.floor(rg.frameMs / 110) % 3);
        for (i = rg.wolves.length - 1; i >= 0; i--) {
          var wv = rg.wolves[i], tx, ty;
          if (wv.state === "run") { tx = p.x; ty = p.y; }
          else { tx = wv.x + (wv.x - rg.cx); ty = wv.y + (wv.y - rg.cy); }
          var dx = tx - wv.x, dy = ty - wv.y, dl = Math.sqrt(dx * dx + dy * dy) || 1, spd = wv.state === "run" ? wv.sp : 420;
          wv.x += dx / dl * spd * s; wv.y += dy / dl * spd * s;
          wv.spr.setPosition(wv.x, wv.y).setTexture(frame).setFlipX(dx < 0);
          if (wv.state === "flee") {
            wv.spr.setAlpha(Math.max(0, wv.spr.alpha - s * 1.2));
            if (dist(wv.x, wv.y, rg.cx, rg.cy) > rg.R + 160 || wv.spr.alpha <= 0.02) { kill(wv); rg.wolves.splice(i, 1); }
            continue;
          }
          if (dist(wv.x, wv.y, p.x, p.y) < 36) {
            var hurt = this.loseLife("hit", "A WOLF CAUGHT YOU");
            if (hurt) rg.wolves.forEach(function (o) { if (o.state === "run" && dist(o.x, o.y, p.x, p.y) < 280) self.wolfScare(o, true); });
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

  window.SolModes = { MODES: MODES, SLOTS: SLOTS, modeFor: modeFor, install: install };
})();
