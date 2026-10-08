/* SOL Labyrinth v5.6 — the nine realms, their creatures, Fenrir and the castle perks.
 *
 * The hundred levels are ten realms of ten levels (the nine worlds of the Norse
 * tree, then Ragnarok). Each realm has its own floor, wall touches, colours,
 * drifting particles, background sound, music (js/music.js) and one creature of
 * its own. Every tenth level is a boss level: Fenrir has chained the realm gate,
 * each correct answer banked at EXIT breaks a chain, and a wrong letter sends him
 * charging. The castle builder's perks (js/build.js, SolBuild.perks()) apply here.
 *
 * game.js keeps the maze, the Hati and the questions. At the end of its closure it
 * calls SolRealms.install(NightScene, internals); this file wraps a few scene
 * methods and adds the new ones. Load order: after build.js and music.js, before
 * game.js.
 */
(function () {
  "use strict";

  /* ── The realms ─────────────────────────────────────────────────────────── */
  var REALMS = [
    { id: "midgard", name: "Midgard", title: "the world of people", floor: "flag", wallFx: "moss",
      pal: { wall: 0x2f3b2c, stroke: 0x5a7050, lip: 0x8aa47a, floorA: 0xdcd4b4, floorB: 0xb9b08e, plazaA: 0xb4c894, plazaB: 0x9fb67f, wash: 0x6aa84a, washA: 0.04, accent: 0xf5d76e, vig: 0x0a1406, vigA: 0.48, void: 0x07100a },
      fx: "fireflies", amb: "meadow",
      foe: null,
      blurb: "Grassy halls and old stone. Only the Hati wolves hunt here." },
    { id: "niflheim", name: "Niflheim", title: "the land of ice and mist", floor: "ice", wallFx: "frost",
      pal: { wall: 0x1d3048, stroke: 0x6a94c0, lip: 0xbfe0ff, floorA: 0xe4eff9, floorB: 0xc0d5ea, plazaA: 0xd2e5f5, plazaB: 0xb5cde5, wash: 0x7ab8ff, washA: 0.06, accent: 0xbfe8ff, vig: 0x02081a, vigA: 0.6, void: 0x040a16 },
      fx: "snow", amb: "wind",
      foe: { kind: "raven", name: "Ravens", desc: "Odin's ravens fly over the walls. If one sees you, the wolves know where you are. They cannot see you in the dark." },
      blurb: "Frozen halls under falling snow." },
    { id: "jotunheim", name: "Jotunheim", title: "the land of the giants", floor: "rock", wallFx: "rock",
      pal: { wall: 0x3a342e, stroke: 0x6e645a, lip: 0xa39888, floorA: 0xcbc2b2, floorB: 0xa89e8c, plazaA: 0xbaaf9a, plazaB: 0x9f947f, wash: 0x8a7a64, washA: 0.05, accent: 0xd8c8a8, vig: 0x100c08, vigA: 0.56, void: 0x0a0806 },
      fx: "dust", amb: "canyon",
      foe: { kind: "troll", name: "Trolls", desc: "A troll guards one long hall and stomps after you if you come close. Slip past when its back is turned." },
      blurb: "Boulders and rough stone, built for giants." },
    { id: "muspelheim", name: "Muspelheim", title: "the land of fire", floor: "basalt", wallFx: "ember",
      pal: { wall: 0x2a0e08, stroke: 0x9a3a14, lip: 0xe0702a, floorA: 0xd8aa8a, floorB: 0xb88466, plazaA: 0xca8c66, plazaB: 0xaa6c4e, wash: 0xff5a1a, washA: 0.07, accent: 0xffa040, vig: 0x280600, vigA: 0.6, void: 0x1a0402 },
      fx: "embers", amb: "fire",
      foe: { kind: "vent", name: "Fire vents", desc: "Vents in the floor glow, then burst into flame. Wait for the fire to die down before you cross." },
      blurb: "Hot ash and glowing cracks." },
    { id: "svartalfheim", name: "Svartalfheim", title: "the dark forges under the mountains", floor: "ore", wallFx: "ore",
      pal: { wall: 0x2a2233, stroke: 0x5e4c74, lip: 0x9a86b4, floorA: 0xc0b7c7, floorB: 0x9d93a9, plazaA: 0xab9fb8, plazaB: 0x9084a2, wash: 0x6a4a9a, washA: 0.05, accent: 0xe0b84a, vig: 0x08040e, vigA: 0.64, void: 0x06040a },
      fx: "sparks", amb: "cave",
      foe: { kind: "serpent", name: "Nidhogg's serpent", desc: "A long serpent winds through the tunnels. Its whole body is dangerous, so find a way around it." },
      blurb: "Tunnels glinting with gold and crystal." },
    { id: "vanaheim", name: "Vanaheim", title: "the green land of the Vanir", floor: "grass", wallFx: "moss",
      pal: { wall: 0x24402a, stroke: 0x4a8a52, lip: 0x88c88c, floorA: 0xd2e6b4, floorB: 0xb3cd92, plazaA: 0xaad68a, plazaB: 0x91bd72, wash: 0x5ac84a, washA: 0.05, accent: 0xffe07a, vig: 0x061404, vigA: 0.48, void: 0x061208 },
      fx: "petals", amb: "meadow",
      foe: { kind: "boar", name: "Golden boars", desc: "A boar charges in a straight line when it sees you down a hall. Step into a side passage and it runs into the wall." },
      blurb: "Meadows, flowers and falling petals." },
    { id: "alfheim", name: "Alfheim", title: "the land of the light elves", floor: "marble", wallFx: "gold",
      pal: { wall: 0x3a3a5a, stroke: 0x8a8ac8, lip: 0xd0d0ff, floorA: 0xf4f0e2, floorB: 0xe2dcc4, plazaA: 0xf0e8c8, plazaB: 0xe0d4a8, wash: 0xffe89a, washA: 0.05, accent: 0xfff0a0, vig: 0x10102a, vigA: 0.42, void: 0x0c0c1c },
      fx: "motes", amb: "chimes",
      foe: { kind: "wisp", name: "Will-o'-wisps", desc: "Glowing wisps drift toward you through the walls. Touch one and you are dazzled: you can only see close by for a few seconds." },
      blurb: "White marble and floating lights." },
    { id: "helheim", name: "Helheim", title: "the misty land of the dead", floor: "bone", wallFx: "mist",
      pal: { wall: 0x1e2624, stroke: 0x4a5c56, lip: 0x7e948c, floorA: 0xbac2ba, floorB: 0x99a39b, plazaA: 0xa6b0a8, plazaB: 0x8b958d, wash: 0x5a8a7a, washA: 0.06, accent: 0x9ad8c0, vig: 0x000806, vigA: 0.66, void: 0x020605 },
      fx: "mist", amb: "hollow",
      foe: { kind: "draugr", name: "Draugr", desc: "Restless spirits creep toward you, but only while you are not looking at them. Face them and they freeze." },
      blurb: "Grey halls in drifting fog." },
    { id: "asgard", name: "Asgard", title: "the golden home of the gods", floor: "marble", wallFx: "gold",
      pal: { wall: 0x2e3a5a, stroke: 0x6a84c0, lip: 0xe8c86a, floorA: 0xf3eddf, floorB: 0xddd3b9, plazaA: 0xf0dca0, plazaB: 0xe0c880, wash: 0xffd86a, washA: 0.06, accent: 0xffe08a, vig: 0x0a1030, vigA: 0.44, void: 0x0a1228 },
      fx: "gold", amb: "chimes",
      foe: { kind: "valkyrie", name: "Valkyries", desc: "A golden shadow falls across a hall, then a valkyrie sweeps along it. Step out of the shadow before she arrives." },
      blurb: "Gold and white marble above the clouds." },
    { id: "ragnarok", name: "Ragnarok", title: "the end of the worlds", floor: "ash", wallFx: "ember",
      pal: { wall: 0x1a0a0a, stroke: 0x7a2020, lip: 0xc04030, floorA: 0xac938a, floorB: 0x8a726a, plazaA: 0x9a766c, plazaB: 0x7c5c54, wash: 0xff3a1a, washA: 0.08, accent: 0xff6a3a, vig: 0x200000, vigA: 0.68, void: 0x100202 },
      fx: "ash", amb: "fire",
      foe: { kind: "mix", name: "Every creature", desc: "Creatures from every realm return, three at a time. Everything you have learned counts now." },
      blurb: "Ash falls and the sky burns red." }
  ];
  var FOE_NAMES = { raven: "a raven", troll: "a troll", vent: "a fire vent", serpent: "the serpent", boar: "a boar", wisp: "a wisp", draugr: "a draugr", valkyrie: "a valkyrie", fenrir: "Fenrir" };
  var LS_SEEN = "afterHours.v1.realmSeen.";

  function realmIndex(n) { n = Math.max(1, Math.min(100, Math.floor(Number(n) || 1))); return Math.min(9, Math.floor((n - 1) / 10)); }
  function realmOf(n) { return REALMS[realmIndex(n)]; }
  function isBoss(n) { return Math.floor(Number(n) || 1) % 10 === 0; }
  function levelInRealm(n) { return ((Math.max(1, Math.floor(Number(n) || 1)) - 1) % 10) + 1; }

  /* seeded random (mulberry32) */
  function seeded(a) {
    a = a >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hex(c) { return "#" + ("000000" + (c >>> 0).toString(16)).slice(-6); }
  function rgba(c, a) { return "rgba(" + ((c >> 16) & 255) + "," + ((c >> 8) & 255) + "," + (c & 255) + "," + a + ")"; }
  function mix(a, b, t) {
    var r = ((a >> 16) & 255) + ((((b >> 16) & 255) - ((a >> 16) & 255)) * t);
    var g = ((a >> 8) & 255) + ((((b >> 8) & 255) - ((a >> 8) & 255)) * t);
    var bl = (a & 255) + (((b & 255) - (a & 255)) * t);
    return ((Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(bl)) >>> 0;
  }
  function dist(ax, ay, bx, by) { var dx = ax - bx, dy = ay - by; return Math.sqrt(dx * dx + dy * dy); }

  /* ── Floor textures (128 px, a 16 px grout band on the top/left edge lines up
        with the maze wall grid exactly like the v4.2 floor) ─────────────────── */
  function paintFloor(ctx, S, kind, p, r) {
    var i, x, y, k, a, rad;
    ctx.fillStyle = hex(p.floorA); ctx.fillRect(0, 0, S, S);
    ctx.globalAlpha = 0.4; ctx.fillStyle = hex(p.floorB);
    for (i = 0; i < 500; i++) { x = Math.floor(r() * S); y = Math.floor(r() * S); ctx.fillRect(x, y, 1, 1); }
    ctx.globalAlpha = 1;
    if (kind === "flag") {
      /* four worn flagstones with grass in the joints */
      var st = [[18, 18, 52, 50], [72, 18, 54, 38], [18, 70, 40, 56], [60, 58, 66, 68]];
      for (i = 0; i < st.length; i++) {
        ctx.fillStyle = hex(mix(p.floorA, p.floorB, r() * 0.45));
        ctx.beginPath(); ctx.rect(st[i][0] + 2, st[i][1] + 2, st[i][2] - 4, st[i][3] - 4); ctx.fill();
        ctx.strokeStyle = rgba(p.floorB, 0.8); ctx.lineWidth = 1.5; ctx.stroke();
      }
      ctx.fillStyle = rgba(0x6aa84a, 0.55);
      for (i = 0; i < 40; i++) { x = 16 + r() * (S - 16); y = r() < 0.5 ? 68 + r() * 4 : 56 + r() * 4; ctx.fillRect(x, y, 1.5, 3); ctx.fillRect(r() < 0.5 ? 70 : 58, 16 + r() * (S - 16), 3, 1.5); }
    } else if (kind === "ice") {
      ctx.strokeStyle = rgba(0xffffff, 0.55); ctx.lineWidth = 1;
      for (i = 0; i < 5; i++) {
        x = 16 + r() * (S - 16); y = 16 + r() * (S - 16);
        ctx.beginPath(); ctx.moveTo(x, y);
        for (k = 0; k < 4; k++) { x += (r() - 0.5) * 34; y += (r() - 0.5) * 34; ctx.lineTo(x, y); }
        ctx.stroke();
      }
      ctx.strokeStyle = rgba(0x7aa8d8, 0.35);
      for (i = 0; i < 3; i++) { x = 16 + r() * (S - 16); y = 16 + r() * (S - 16); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (r() - 0.5) * 60, y + (r() - 0.5) * 60); ctx.stroke(); }
      ctx.fillStyle = "#ffffff";
      for (i = 0; i < 60; i++) { ctx.globalAlpha = 0.3 + r() * 0.5; ctx.fillRect(16 + r() * (S - 16), 16 + r() * (S - 16), 1.5, 1.5); }
      ctx.globalAlpha = 1;
    } else if (kind === "rock") {
      for (i = 0; i < 26; i++) {
        x = 16 + r() * (S - 16); y = 16 + r() * (S - 16); rad = 5 + r() * 11;
        ctx.fillStyle = hex(mix(p.floorA, p.floorB, 0.3 + r() * 0.6));
        ctx.beginPath(); ctx.ellipse(x, y, rad, rad * (0.6 + r() * 0.4), r() * 3, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = rgba(0x3a342e, 0.25); ctx.lineWidth = 1; ctx.stroke();
      }
    } else if (kind === "basalt") {
      ctx.strokeStyle = rgba(0x5a2a18, 0.45); ctx.lineWidth = 2;
      for (i = 0; i < 7; i++) {
        x = 16 + r() * (S - 16); y = 16 + r() * (S - 16);
        ctx.beginPath(); ctx.moveTo(x, y);
        for (k = 0; k < 3; k++) { x += (r() - 0.5) * 50; y += (r() - 0.5) * 50; ctx.lineTo(x, y); }
        ctx.stroke();
      }
      ctx.strokeStyle = rgba(0xff7a2a, 0.5); ctx.lineWidth = 1.2;
      for (i = 0; i < 4; i++) {
        x = 16 + r() * (S - 16); y = 16 + r() * (S - 16);
        ctx.beginPath(); ctx.moveTo(x, y);
        for (k = 0; k < 3; k++) { x += (r() - 0.5) * 40; y += (r() - 0.5) * 40; ctx.lineTo(x, y); }
        ctx.stroke();
      }
    } else if (kind === "ore") {
      for (i = 0; i < 14; i++) {
        x = 16 + r() * (S - 16); y = 16 + r() * (S - 16);
        ctx.fillStyle = rgba(0xe0b84a, 0.7); ctx.fillRect(x, y, 2, 2);
      }
      for (i = 0; i < 6; i++) {
        x = 20 + r() * (S - 24); y = 20 + r() * (S - 24);
        ctx.fillStyle = rgba(0x9a6ad8, 0.45);
        ctx.beginPath(); ctx.moveTo(x, y - 5); ctx.lineTo(x + 3, y); ctx.lineTo(x, y + 5); ctx.lineTo(x - 3, y); ctx.closePath(); ctx.fill();
      }
      ctx.strokeStyle = rgba(0x4a3a5a, 0.3); ctx.lineWidth = 1;
      for (i = 0; i < 5; i++) { x = 16 + r() * (S - 16); y = 16 + r() * (S - 16); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (r() - 0.5) * 50, y + (r() - 0.5) * 50); ctx.stroke(); }
    } else if (kind === "grass") {
      for (i = 0; i < 120; i++) {
        x = 16 + r() * (S - 16); y = 16 + r() * (S - 16);
        ctx.strokeStyle = rgba(r() < 0.5 ? 0x5a9a3a : 0x7ab84a, 0.5); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (r() - 0.5) * 3, y - 4 - r() * 3); ctx.stroke();
      }
      var fl = [0xffe07a, 0xff9ac8, 0xffffff, 0xb49aff];
      for (i = 0; i < 7; i++) {
        x = 20 + r() * (S - 24); y = 20 + r() * (S - 24);
        ctx.fillStyle = hex(fl[i % fl.length]);
        for (k = 0; k < 4; k++) { a = k * Math.PI / 2; ctx.beginPath(); ctx.arc(x + Math.cos(a) * 2, y + Math.sin(a) * 2, 1.6, 0, Math.PI * 2); ctx.fill(); }
        ctx.fillStyle = "#e0a020"; ctx.fillRect(x - 0.8, y - 0.8, 1.6, 1.6);
      }
    } else if (kind === "marble") {
      ctx.strokeStyle = rgba(p.floorB, 0.9); ctx.lineWidth = 1.2;
      for (i = 0; i < 4; i++) {
        x = 16 + r() * (S - 16); y = 16;
        ctx.beginPath(); ctx.moveTo(x, y);
        for (k = 0; k < 6; k++) { x += (r() - 0.5) * 26; y += (S - 16) / 6; ctx.lineTo(x, y); }
        ctx.stroke();
      }
      ctx.strokeStyle = rgba(p.accent, 0.55); ctx.lineWidth = 1.5;
      ctx.strokeRect(22.5, 22.5, S - 29, S - 29);
      ctx.fillStyle = rgba(p.accent, 0.6);
      [[22, 22], [S - 7, 22], [22, S - 7], [S - 7, S - 7]].forEach(function (c) { ctx.fillRect(c[0] - 2, c[1] - 2, 4, 4); });
    } else if (kind === "bone") {
      ctx.strokeStyle = rgba(0x6a7a72, 0.35); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(72, 72, 30, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(72, 72, 22, 0, Math.PI * 2); ctx.stroke();
      for (i = 0; i < 8; i++) {
        a = i * Math.PI / 4; x = 72 + Math.cos(a) * 26; y = 72 + Math.sin(a) * 26;
        ctx.beginPath(); ctx.moveTo(x - 2, y - 3); ctx.lineTo(x + 2, y + 3); ctx.moveTo(x + 2, y - 3); ctx.lineTo(x - 2, y); ctx.stroke();
      }
      ctx.fillStyle = rgba(0xeef2ea, 0.5);
      for (i = 0; i < 30; i++) ctx.fillRect(16 + r() * (S - 16), 16 + r() * (S - 16), 2, 1);
    } else if (kind === "ash") {
      ctx.strokeStyle = rgba(0x3a1a14, 0.5); ctx.lineWidth = 1.5;
      for (i = 0; i < 8; i++) {
        x = 16 + r() * (S - 16); y = 16 + r() * (S - 16);
        ctx.beginPath(); ctx.moveTo(x, y);
        for (k = 0; k < 3; k++) { x += (r() - 0.5) * 44; y += (r() - 0.5) * 44; ctx.lineTo(x, y); }
        ctx.stroke();
      }
      for (i = 0; i < 12; i++) { ctx.fillStyle = rgba(0xff6a2a, 0.35 + r() * 0.4); ctx.fillRect(16 + r() * (S - 16), 16 + r() * (S - 16), 2, 2); }
    }
    /* grout aligned to the wall grid (same as the v4.2 floor) */
    ctx.globalAlpha = 0.3; ctx.fillStyle = hex(p.floorB);
    ctx.fillRect(0, 0, S, 16); ctx.fillRect(0, 0, 16, S);
    ctx.globalAlpha = 0.5; ctx.fillRect(0, 15, S, 1); ctx.fillRect(15, 0, 1, S);
    ctx.globalAlpha = 0.18; ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 16, S, 1); ctx.fillRect(16, 0, 1, S);
    ctx.globalAlpha = 1;
  }
  function paintPlaza(ctx, S, kind, p, r) {
    var T = 64, cx, cy, i;
    for (cy = 0; cy < 2; cy++) for (cx = 0; cx < 2; cx++) {
      ctx.fillStyle = hex(((cx + cy) % 2) ? p.plazaB : p.plazaA);
      ctx.fillRect(cx * T, cy * T, T, T);
      ctx.strokeStyle = rgba(0xffffff, 0.12); ctx.lineWidth = 1; ctx.strokeRect(cx * T + 3.5, cy * T + 3.5, T - 7, T - 7);
    }
    ctx.fillStyle = rgba(p.floorB, 0.35);
    for (i = 0; i < 400; i++) ctx.fillRect(Math.floor(r() * S), Math.floor(r() * S), 1, 1);
    if (kind === "grass" || kind === "flag") {
      for (i = 0; i < 80; i++) { ctx.strokeStyle = rgba(0x4a8a2a, 0.35); ctx.beginPath(); var x = r() * S, y = r() * S; ctx.moveTo(x, y); ctx.lineTo(x + (r() - 0.5) * 3, y - 4); ctx.stroke(); }
    } else if (kind === "ice") {
      ctx.fillStyle = "#ffffff"; for (i = 0; i < 40; i++) { ctx.globalAlpha = 0.5; ctx.fillRect(r() * S, r() * S, 1.5, 1.5); } ctx.globalAlpha = 1;
    } else if (kind === "basalt" || kind === "ash") {
      for (i = 0; i < 10; i++) { ctx.fillStyle = rgba(0xff7a2a, 0.3 + r() * 0.3); ctx.fillRect(r() * S, r() * S, 2, 2); }
    }
    ctx.globalAlpha = 0.22; ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, S, 2); ctx.fillRect(0, 64, S, 2); ctx.fillRect(0, 0, 2, S); ctx.fillRect(64, 0, 2, S);
    ctx.globalAlpha = 1;
  }

  /* ── Creature art (drawn once into canvas textures) ─────────────────────── */
  function canvasTex(scene, key, w, h, draw) {
    if (scene.textures.exists(key)) return;
    try {
      var t = scene.textures.createCanvas(key, w, h), ctx = t.getContext();
      draw(ctx, w, h);
      t.refresh();
    } catch (e) {}
  }
  function drawRaven(ctx, up) {
    ctx.fillStyle = "#1d1d26";
    ctx.beginPath(); ctx.moveTo(22, 28); ctx.lineTo(6, 20); ctx.lineTo(9, 28); ctx.lineTo(6, 36); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#15151c"; ctx.beginPath(); ctx.ellipse(34, 29, 15, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(50, 24, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#d8a73a"; ctx.beginPath(); ctx.moveTo(57, 21); ctx.lineTo(68, 25); ctx.lineTo(57, 28); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#f4e27a"; ctx.beginPath(); ctx.arc(52, 22, 1.9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#2a2a38"; ctx.strokeStyle = "#4a4a60"; ctx.lineWidth = 1.2;
    ctx.beginPath();
    if (up) { ctx.moveTo(26, 25); ctx.lineTo(14, 3); ctx.lineTo(26, 9); ctx.lineTo(34, 2); ctx.lineTo(42, 22); }
    else { ctx.moveTo(26, 31); ctx.lineTo(12, 50); ctx.lineTo(26, 44); ctx.lineTo(34, 51); ctx.lineTo(42, 33); }
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  function drawTroll(ctx, step) {
    var s = step ? 3 : -3;
    ctx.fillStyle = "#4d5b3d";
    ctx.fillRect(26, 68 + (step ? 2 : 0), 13, 22); ctx.fillRect(46, 68 + (step ? 0 : 2), 13, 22);
    ctx.fillStyle = "#3a2c1e"; ctx.fillRect(24, 86 + (step ? 2 : 0), 17, 6); ctx.fillRect(44, 86 + (step ? 0 : 2), 17, 6);
    ctx.fillStyle = "#6f7f58"; ctx.beginPath(); ctx.ellipse(42, 54, 29, 26, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#8a9a70"; ctx.beginPath(); ctx.ellipse(42, 60, 16, 15, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#6a4a2a"; ctx.fillRect(22, 66, 40, 9);
    ctx.fillStyle = "#6f7f58"; ctx.beginPath(); ctx.ellipse(15, 52 + s, 8, 15, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(69, 48 - s, 8, 14, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.translate(74, 40 - s); ctx.rotate(0.35);
    ctx.fillStyle = "#7a5230"; ctx.fillRect(-4, -34, 8, 40); ctx.beginPath(); ctx.ellipse(0, -36, 9, 11, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#5a3a20"; ctx.fillRect(-3, -40, 2, 4); ctx.fillRect(3, -30, 2, 4);
    ctx.restore();
    ctx.fillStyle = "#7d8d63"; ctx.beginPath(); ctx.ellipse(42, 25, 18, 16, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#56643f"; ctx.fillRect(28, 17, 28, 4);
    ctx.fillStyle = "#ffd24a"; ctx.beginPath(); ctx.arc(35, 23, 3, 0, Math.PI * 2); ctx.arc(49, 23, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#1a1a10"; ctx.beginPath(); ctx.arc(35.5, 23.5, 1.4, 0, Math.PI * 2); ctx.arc(49.5, 23.5, 1.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#65754b"; ctx.beginPath(); ctx.ellipse(42, 30, 6, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#f4f0dc"; ctx.beginPath(); ctx.moveTo(34, 35); ctx.lineTo(36, 29); ctx.lineTo(38, 35); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(46, 35); ctx.lineTo(48, 29); ctx.lineTo(50, 35); ctx.closePath(); ctx.fill();
  }
  function drawVent(ctx) {
    var g = ctx.createRadialGradient(28, 28, 2, 28, 28, 26);
    g.addColorStop(0, "rgba(255,120,40,0.55)"); g.addColorStop(1, "rgba(60,20,10,0.9)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(28, 28, 24, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#1a0c08"; ctx.lineWidth = 3;
    for (var i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(28 + i * 8, 8); ctx.lineTo(28 + i * 8, 48); ctx.stroke(); }
    ctx.strokeStyle = "#6a3a24"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(28, 28, 24, 0, Math.PI * 2); ctx.stroke();
  }
  function drawFlame(ctx, w, h) {
    function tear(cx, bot, ww, hh, c0, c1) {
      var g = ctx.createLinearGradient(0, bot, 0, bot - hh);
      g.addColorStop(0, c0); g.addColorStop(1, c1);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(cx, bot - hh);
      ctx.bezierCurveTo(cx + ww, bot - hh * 0.45, cx + ww * 0.8, bot, cx, bot);
      ctx.bezierCurveTo(cx - ww * 0.8, bot, cx - ww, bot - hh * 0.45, cx, bot - hh);
      ctx.fill();
    }
    tear(w / 2, h - 4, w * 0.48, h - 6, "rgba(255,90,20,0.95)", "rgba(255,60,0,0)");
    tear(w / 2, h - 6, w * 0.32, h * 0.72, "rgba(255,190,60,0.95)", "rgba(255,140,30,0)");
    tear(w / 2, h - 8, w * 0.16, h * 0.42, "rgba(255,250,210,1)", "rgba(255,230,140,0)");
  }
  function drawSerpentHead(ctx) {
    ctx.fillStyle = "#1e3a26"; ctx.beginPath(); ctx.ellipse(22, 24, 20, 15, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#2e5a3a"; ctx.beginPath(); ctx.ellipse(24, 22, 17, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#c8b060"; ctx.beginPath(); ctx.moveTo(10, 12); ctx.lineTo(6, 2); ctx.lineTo(16, 10); ctx.fill();
    ctx.beginPath(); ctx.moveTo(10, 36); ctx.lineTo(6, 46); ctx.lineTo(16, 38); ctx.fill();
    ctx.fillStyle = "#ffe040"; ctx.beginPath(); ctx.ellipse(32, 15, 4, 3, 0, 0, Math.PI * 2); ctx.ellipse(32, 33, 4, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#101010"; ctx.fillRect(31.4, 12.5, 1.4, 5); ctx.fillRect(31.4, 30.5, 1.4, 5);
    ctx.strokeStyle = "#c83a3a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(42, 24); ctx.lineTo(47, 24); ctx.moveTo(47, 24); ctx.lineTo(50, 21); ctx.moveTo(47, 24); ctx.lineTo(50, 27); ctx.stroke();
  }
  function drawSerpentBody(ctx, w) {
    var c = w / 2, g = ctx.createRadialGradient(c - 3, c - 3, 2, c, c, c);
    g.addColorStop(0, "#4e8a5a"); g.addColorStop(1, "#1e3a26");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c, c, c - 1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(200,176,96,0.55)";
    for (var i = 0; i < 5; i++) { var a = i * 1.26; ctx.beginPath(); ctx.arc(c + Math.cos(a) * c * 0.45, c + Math.sin(a) * c * 0.45, w * 0.08, 0, Math.PI * 2); ctx.fill(); }
  }
  function drawBoar(ctx, step) {
    ctx.fillStyle = "#4a2e14";
    var l = step ? [0, 4, 4, 0] : [4, 0, 0, 4], xs = [18, 28, 44, 54];
    for (var i = 0; i < 4; i++) ctx.fillRect(xs[i], 40 + l[i] * 0.5, 6, 12 - l[i] * 0.5);
    ctx.fillStyle = "#8a5a2a"; ctx.beginPath(); ctx.ellipse(36, 32, 26, 15, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#f0c040"; ctx.lineWidth = 2.2;
    for (i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(16 + i * 5, 20 - Math.sin(i / 8 * Math.PI) * 2); ctx.lineTo(18 + i * 5, 12 - Math.sin(i / 8 * Math.PI) * 4); ctx.stroke(); }
    ctx.fillStyle = "#9a6a36"; ctx.beginPath(); ctx.ellipse(62, 32, 13, 11, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#c89066"; ctx.beginPath(); ctx.ellipse(72, 35, 5, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#3a2010"; ctx.fillRect(71, 33, 1.5, 2); ctx.fillRect(73.5, 33, 1.5, 2);
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(62, 27, 2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#fffbe8"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(66, 40); ctx.quadraticCurveTo(70, 44, 71, 38); ctx.stroke();
    ctx.fillStyle = "#6a4020"; ctx.beginPath(); ctx.moveTo(56, 22); ctx.lineTo(58, 12); ctx.lineTo(62, 22); ctx.fill();
  }
  function drawWisp(ctx, w) {
    var c = w / 2, g = ctx.createRadialGradient(c, c, 1, c, c, c);
    g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.3, "rgba(200,245,255,0.9)"); g.addColorStop(0.65, "rgba(120,220,255,0.35)"); g.addColorStop(1, "rgba(120,220,255,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, w);
  }
  function drawDraugr(ctx, step) {
    var a = step ? 3 : 0;
    ctx.fillStyle = "#56646e";
    ctx.beginPath(); ctx.moveTo(16, 30); ctx.lineTo(40, 30); ctx.lineTo(48, 70);
    for (var i = 0; i < 6; i++) ctx.lineTo(48 - i * 7 - 3.5, i % 2 ? 70 : 64);
    ctx.lineTo(8, 70); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#6e7e8a"; ctx.beginPath(); ctx.moveTo(18, 32); ctx.lineTo(38, 32); ctx.lineTo(42, 56); ctx.lineTo(14, 56); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#8e9ea8"; ctx.lineWidth = 5; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(18, 36); ctx.lineTo(6, 46 - a); ctx.moveTo(38, 36); ctx.lineTo(50, 46 + a); ctx.stroke();
    ctx.fillStyle = "#c8d4d8"; ctx.beginPath(); ctx.arc(28, 20, 11, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#3e4a52"; ctx.beginPath(); ctx.arc(28, 16, 12, Math.PI, 0); ctx.fill();
    ctx.fillStyle = "#7ae0ff"; ctx.beginPath(); ctx.arc(24, 21, 2.4, 0, Math.PI * 2); ctx.arc(32, 21, 2.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(122,224,255,0.25)"; ctx.beginPath(); ctx.arc(28, 21, 9, 0, Math.PI * 2); ctx.fill();
  }
  function drawValkyrie(ctx, up) {
    ctx.fillStyle = "#eef2ff"; ctx.strokeStyle = "#a8b4d0"; ctx.lineWidth = 1.2;
    ctx.beginPath();
    if (up) { ctx.moveTo(40, 40); ctx.quadraticCurveTo(20, 2, 58, 4); ctx.quadraticCurveTo(52, 20, 56, 36); }
    else { ctx.moveTo(40, 44); ctx.quadraticCurveTo(12, 70, 52, 80); ctx.quadraticCurveTo(50, 62, 56, 48); }
    ctx.closePath(); ctx.fill(); ctx.stroke();
    for (var i = 1; i < 4; i++) { ctx.beginPath(); if (up) { ctx.moveTo(42, 38); ctx.lineTo(30 + i * 7, 8 + i * 3); } else { ctx.moveTo(42, 46); ctx.lineTo(28 + i * 7, 74 - i * 3); } ctx.stroke(); }
    ctx.fillStyle = "#b83a3a"; ctx.beginPath(); ctx.moveTo(52, 36); ctx.lineTo(28, 50); ctx.lineTo(50, 54); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#c0c8d8"; ctx.beginPath(); ctx.ellipse(62, 42, 14, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#f3d2b0"; ctx.beginPath(); ctx.arc(80, 38, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#e0b840"; ctx.beginPath(); ctx.arc(80, 35, 8, Math.PI, 0); ctx.fill();
    ctx.fillStyle = "#fff6d0"; ctx.beginPath(); ctx.moveTo(74, 31); ctx.lineTo(68, 24); ctx.lineTo(76, 29); ctx.fill();
    ctx.beginPath(); ctx.moveTo(86, 31); ctx.lineTo(92, 24); ctx.lineTo(84, 29); ctx.fill();
    ctx.fillStyle = "#f0d060"; ctx.beginPath(); ctx.moveTo(74, 40); ctx.quadraticCurveTo(68, 52, 60, 54); ctx.lineTo(70, 44); ctx.fill();
    ctx.strokeStyle = "#8a6a3a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(40, 58); ctx.lineTo(112, 30); ctx.stroke();
    ctx.fillStyle = "#e8eef8"; ctx.beginPath(); ctx.moveTo(118, 28); ctx.lineTo(108, 29); ctx.lineTo(111, 35); ctx.closePath(); ctx.fill();
  }
  function drawSoftDot(ctx, w) {
    var c = w / 2, g = ctx.createRadialGradient(c, c, 0, c, c, c);
    g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.5, "rgba(255,255,255,0.55)"); g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, w);
  }
  function drawLeaf(ctx) {
    ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.ellipse(7, 4, 6, 3, 0.4, 0, Math.PI * 2); ctx.fill();
  }
  function drawFlake(ctx) {
    ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1.2; ctx.lineCap = "round";
    for (var i = 0; i < 3; i++) { var a = i * Math.PI / 3; ctx.beginPath(); ctx.moveTo(6 - Math.cos(a) * 5, 6 - Math.sin(a) * 5); ctx.lineTo(6 + Math.cos(a) * 5, 6 + Math.sin(a) * 5); ctx.stroke(); }
  }
  function drawLock(ctx) {
    ctx.strokeStyle = "#b8b8c8"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(12, 11, 6, Math.PI, 0); ctx.stroke();
    ctx.fillStyle = "#6a6a7a"; ctx.fillRect(3, 11, 18, 13); ctx.fillStyle = "#9a9aae"; ctx.fillRect(3, 11, 18, 3);
    ctx.fillStyle = "#1a1a22"; ctx.beginPath(); ctx.arc(12, 17, 2, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(11, 17, 2, 4);
  }
  function drawDazzle(ctx, w, h) {
    var g = ctx.createRadialGradient(w / 2, h / 2, h * 0.12, w / 2, h / 2, h * 0.5);
    g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(0.5, "rgba(0,0,0,0.75)"); g.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  function ensureArt(scene) {
    canvasTex(scene, "rf-raven-0", 72, 54, function (c) { drawRaven(c, true); });
    canvasTex(scene, "rf-raven-1", 72, 54, function (c) { drawRaven(c, false); });
    canvasTex(scene, "rf-troll-0", 88, 96, function (c) { drawTroll(c, 0); });
    canvasTex(scene, "rf-troll-1", 88, 96, function (c) { drawTroll(c, 1); });
    canvasTex(scene, "rf-vent", 56, 56, drawVent);
    canvasTex(scene, "rf-flame", 60, 110, drawFlame);
    canvasTex(scene, "rf-snake-head", 52, 48, drawSerpentHead);
    canvasTex(scene, "rf-snake-body", 34, 34, drawSerpentBody);
    canvasTex(scene, "rf-boar-0", 80, 56, function (c) { drawBoar(c, 0); });
    canvasTex(scene, "rf-boar-1", 80, 56, function (c) { drawBoar(c, 1); });
    canvasTex(scene, "rf-wisp", 56, 56, drawWisp);
    canvasTex(scene, "rf-draugr-0", 56, 76, function (c) { drawDraugr(c, 0); });
    canvasTex(scene, "rf-draugr-1", 56, 76, function (c) { drawDraugr(c, 1); });
    canvasTex(scene, "rf-valk-0", 124, 84, function (c) { drawValkyrie(c, true); });
    canvasTex(scene, "rf-valk-1", 124, 84, function (c) { drawValkyrie(c, false); });
    canvasTex(scene, "rf-dot", 16, 16, drawSoftDot);
    canvasTex(scene, "rf-leaf", 14, 8, drawLeaf);
    canvasTex(scene, "rf-flake", 12, 12, drawFlake);
    canvasTex(scene, "rf-lock", 24, 26, drawLock);
    canvasTex(scene, "rf-dazzle", 256, 144, drawDazzle);
  }

  /* ── Small sound kit (WebAudio): creature calls and the realm background ── */
  var AC = null, AMB = null;
  function audio() {
    if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; } }
    if (AC && AC.state === "suspended") { try { AC.resume(); } catch (e2) {} }
    return AC;
  }
  function masterVol() {
    try {
      if (!window.SolMusic) return 0.5;
      if (SolMusic.isMuted && SolMusic.isMuted()) return 0;
      return SolMusic.getVolume ? SolMusic.getVolume() : 0.5;
    } catch (e) { return 0.5; }
  }
  var noiseBuf = null;
  function noise(ctx) {
    if (noiseBuf) return noiseBuf;
    var len = ctx.sampleRate * 2, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0), i;
    for (i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    noiseBuf = b; return b;
  }
  function blip(freq, freq2, dur, type, vol, delay) {
    var ctx = audio(), mv = masterVol();
    if (!ctx || mv <= 0) return;
    try {
      var t = ctx.currentTime + (delay || 0), o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type || "sine"; o.frequency.setValueAtTime(freq, t);
      if (freq2) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq2), t + dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol * mv), t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + dur + 0.05);
    } catch (e) {}
  }
  function hiss(dur, f, vol, delay) {
    var ctx = audio(), mv = masterVol();
    if (!ctx || mv <= 0) return;
    try {
      var t = ctx.currentTime + (delay || 0), s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
      s.buffer = noise(ctx); fl.type = "bandpass"; fl.frequency.value = f; fl.Q.value = 1.2;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol * mv), t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      s.connect(fl); fl.connect(g); g.connect(ctx.destination); s.start(t); s.stop(t + dur + 0.05);
    } catch (e) {}
  }
  var SFX = {
    caw: function () { blip(900, 520, 0.16, "sawtooth", 0.06); blip(820, 480, 0.2, "sawtooth", 0.06, 0.22); },
    roar: function () { blip(120, 70, 0.6, "sawtooth", 0.09); hiss(0.5, 300, 0.06); },
    whoosh: function () { hiss(0.7, 1400, 0.08); },
    burst: function () { hiss(0.9, 500, 0.07); },
    snort: function () { hiss(0.18, 700, 0.07); hiss(0.18, 700, 0.07, 0.22); },
    chime: function () { blip(1320, 1320, 0.5, "sine", 0.05); blip(1760, 1760, 0.6, "sine", 0.04, 0.08); },
    moan: function () { blip(220, 180, 0.9, "triangle", 0.05); },
    howl: function () { blip(300, 620, 0.5, "triangle", 0.08); blip(620, 380, 0.9, "triangle", 0.08, 0.5); },
    chain: function () { blip(1500, 900, 0.12, "square", 0.05); blip(1100, 700, 0.18, "square", 0.05, 0.1); hiss(0.25, 3000, 0.05); },
    perk: function () { blip(660, 990, 0.18, "sine", 0.05); }
  };
  var AMB_DEFS = {
    meadow: { f: 600, type: "lowpass", q: 0.5, vol: 0.035, lfo: 0.06, depth: 200, pings: "birds" },
    wind:   { f: 800, type: "bandpass", q: 0.7, vol: 0.06, lfo: 0.09, depth: 450 },
    canyon: { f: 320, type: "lowpass", q: 0.6, vol: 0.05, lfo: 0.05, depth: 150 },
    fire:   { f: 900, type: "lowpass", q: 0.4, vol: 0.04, lfo: 0.2, depth: 200, pings: "crackle" },
    cave:   { f: 260, type: "lowpass", q: 0.5, vol: 0.03, lfo: 0.04, depth: 60, pings: "drips" },
    chimes: { f: 1500, type: "lowpass", q: 0.4, vol: 0.02, lfo: 0.05, depth: 400, pings: "chimes" },
    hollow: { f: 300, type: "bandpass", q: 1.1, vol: 0.055, lfo: 0.07, depth: 160 }
  };
  function stopAmbience() {
    if (!AMB) return;
    try { AMB.src.stop(); } catch (e) {}
    try { AMB.lfo.stop(); } catch (e2) {}
    AMB = null;
  }
  function startAmbience(kind) {
    stopAmbience();
    var def = AMB_DEFS[kind], ctx = audio();
    if (!def || !ctx) return;
    try {
      var src = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
      src.buffer = noise(ctx); src.loop = true;
      fl.type = def.type; fl.frequency.value = def.f; fl.Q.value = def.q;
      lfo.frequency.value = def.lfo; lg.gain.value = def.depth; lfo.connect(lg); lg.connect(fl.frequency);
      g.gain.value = 0;
      src.connect(fl); fl.connect(g); g.connect(ctx.destination);
      src.start(); lfo.start();
      AMB = { src: src, gain: g, lfo: lfo, def: def, pingAt: 0, level: 0 };
    } catch (e) { AMB = null; }
  }
  /* a hidden tab or a closed game falls silent (update() stops ticking then) */
  try {
    document.addEventListener("visibilitychange", function () {
      if (!AMB || !AC) return;
      try { AMB.level = document.hidden ? 0 : AMB.level; AMB.gain.gain.setTargetAtTime(document.hidden ? 0 : AMB.level, AC.currentTime, 0.1); } catch (e) {}
    });
  } catch (eV) {}
  function tickAmbience(now, duck) {
    if (!AMB || !AC) return;
    var want = AMB.def.vol * masterVol() * (duck ? 0.25 : 1);
    if (Math.abs(want - AMB.level) > 0.001) {
      AMB.level = want;
      try { AMB.gain.gain.setTargetAtTime(want, AC.currentTime, 0.4); } catch (e) {}
    }
    if (!AMB.def.pings || duck || now < AMB.pingAt) return;
    var p = AMB.def.pings;
    if (p === "birds") { blip(2400 + Math.random() * 900, 3200 + Math.random() * 600, 0.08, "sine", 0.02); blip(2600, 3400, 0.07, "sine", 0.018, 0.12); AMB.pingAt = now + 3500 + Math.random() * 5000; }
    else if (p === "crackle") { hiss(0.05, 2400 + Math.random() * 1500, 0.03); AMB.pingAt = now + 120 + Math.random() * 700; }
    else if (p === "drips") { blip(1100 + Math.random() * 500, 700, 0.12, "sine", 0.025); AMB.pingAt = now + 1500 + Math.random() * 3000; }
    else if (p === "chimes") { var nts = [880, 990, 1175, 1320, 1480]; blip(nts[Math.floor(Math.random() * nts.length)], 0, 1.2, "sine", 0.015); AMB.pingAt = now + 2200 + Math.random() * 3000; }
  }

  /* ── install ────────────────────────────────────────────────────────────── */
  function install(Scene, K) {
    var P = Scene.prototype;
    window.SolRealms._K = K;   /* for the headless tests */

    /* The ten realm palettes replace the ten old school-wing colour sets. */
    (K.NIGHT_THEMES || []).forEach(function (t, i) {
      var rm = REALMS[i]; if (!rm) return;
      Object.keys(rm.pal).forEach(function (k) { t[k] = rm.pal[k]; });
      t.name = rm.name; t.realm = rm.id;
    });

    function wrap(name, fn) {
      var orig = P[name];
      P[name] = function () { return fn.call(this, orig, arguments); };
    }
    function toast(sc, msg, ms) {
      sc.scoreToastMs = Math.max(sc.scoreToastMs || 0, ms || 2600);
      sc.scoreToastMsg = msg;
    }
    function perk(sc, id) { return !!(sc.perks && sc.perks[id]); }
    /* v5.7.6: Fenrir's Fangs — one per realm whose boss level has been beaten on this Chromebook */
    var FANG_KEY = "afterHours.v1.fangs";
    function loadFangs() { try { var a = JSON.parse(localStorage.getItem(FANG_KEY) || "[]"); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
    function saveFangs(a) { try { localStorage.setItem(FANG_KEY, JSON.stringify(a)); } catch (e) {} }
    function play(sc) { return sc.player && !sc.ended; }
    function node(i) { var G = K.railGraph(); return G && G.nodes[i]; }
    function nodesOk(sc, minStart, minExit) {
      var M = K.maze(), out = [], i, nd, ex = K.exitPos(), st = K.startPos(), pen = M && M.ghostHouse;
      if (!M || !M.nodes) return out;
      for (i = 0; i < M.nodes.length; i++) {
        nd = M.nodes[i];
        if (!nd || nd.id === "pen" || nd.id === "exitSpur" || nd.id === "warpL" || nd.id === "warpR") continue;
        if (K.inSafeZone(nd.x, nd.y)) continue;
        if (dist(nd.x, nd.y, st.x, st.y) < (minStart || 300)) continue;
        if (dist(nd.x, nd.y, ex.x, ex.y) < (minExit || 300)) continue;
        if (pen && Math.abs(nd.x - pen.cx) < pen.w / 2 + 20 && Math.abs(nd.y - pen.cy) < pen.h / 2 + 20) continue;
        out.push(i);
      }
      return out;
    }
    function goTo(sc, f, tx, ty) {
      var G = K.railGraph(); if (!G) return false;
      var a = K.nearestMazeNode(f.x, f.y).i, b = K.nearestMazeNode(tx, ty).i;
      var p = K.railPath(G, a, b, false, sc.time ? sc.time.now : 0);
      if (!p) return false;
      f.path = p; f.pi = 0; return true;
    }
    /* Walk the planned node path. Returns true when it is finished (or the next
       node is inside a safe booth, which no creature enters). */
    function walk(f, spd, ms) {
      if (!f.path || f.pi >= f.path.length) return true;
      var nd = node(f.path[f.pi]);
      if (!nd) return true;
      if (K.inSafeZone(nd.x, nd.y)) { f.path = null; return true; }
      var dx = nd.x - f.x, dy = nd.y - f.y, d = Math.sqrt(dx * dx + dy * dy), st = spd * ms / 1000;
      if (d > 0.5) f.face = Math.atan2(dy, dx);
      if (d <= st) { f.x = nd.x; f.y = nd.y; f.pi += 1; return f.pi >= f.path.length; }
      f.x += dx / d * st; f.y += dy / d * st;
      return false;
    }
    function inDark(x, y) {
      var zs = (K.maze() && K.maze().darkZones) || [], i, z;
      for (i = 0; i < zs.length; i++) { z = zs[i]; if (Math.abs(x - z.x) < z.w / 2 && Math.abs(y - z.y) < z.h / 2) return true; }
      return false;
    }
    function flip(spr, face) { if (spr) spr.setFlipX(Math.cos(face || 0) < 0); }
    function mark(sc, f, txt, col) {
      try {
        var t = sc.add.text(f.x, f.y - (f.h || 50) * 0.6, txt, { fontFamily: "Trebuchet MS", fontSize: 26, color: col || "#ffe066", fontStyle: "bold", stroke: "#1a1008", strokeThickness: 5 }).setOrigin(0.5).setDepth(40);
        sc.tweens.add({ targets: t, y: t.y - 28, alpha: 0, duration: 1100, ease: "Cubic.easeOut", onComplete: function () { try { t.destroy(); } catch (e) {} } });
      } catch (e) {}
    }

    /* ── scene lifecycle ── */
    wrap("init", function (orig, args) {
      var r = orig.apply(this, args);
      var n = this.night || 1;
      this.realmIdx = realmIndex(n);
      this.realm = REALMS[this.realmIdx];
      this.realmLevel = levelInRealm(n);
      this.isBossLevel = isBoss(n);
      /* castle perks, read once per level */
      this.perks = {};
      this.perkList = [];
      try {
        if (window.SolBuild && SolBuild.perks) {
          this.perkList = SolBuild.perks() || [];
          for (var i = 0; i < this.perkList.length; i++) this.perks[this.perkList[i].id] = this.perkList[i];
        }
      } catch (eP) { this.perkList = []; }
      if (this.perks.archers) {
        this.janPatrol *= 0.95; this.janHurry *= 0.95; this.janChase *= 0.95;
      }
      /* v5.7.6: boss levels keep every Hati — Fenrir is extra pressure on top, not instead. */
      return r;
    });

    /* Realm floor tiles under the same texture keys the floor painter already uses. */
    wrap("ensureThemeTextures", function (orig, args) {
      var theme = args[0], idx = args[1], rm = REALMS[idx];
      if (rm) {
        var sc = this, S = 128;
        canvasTex(sc, "wing-floor-" + idx, S, S, function (ctx) { paintFloor(ctx, S, rm.floor, rm.pal, seeded(1000 + idx)); });
        canvasTex(sc, "wing-plaza-" + idx, S, S, function (ctx) { paintPlaza(ctx, S, rm.floor, rm.pal, seeded(2000 + idx)); });
      }
      return orig.apply(this, args);
    });

    /* Wall touches, clipped to the merged wall shape (game.js calls this hook). */
    P.decorateWallCanvas = function (ctx, path, theme) {
      var rm = this.realm, W = ctx.canvas.width, H = ctx.canvas.height, r = seeded(77 + (this.night || 1)), i, x, y;
      if (!rm) return;
      try {
        ctx.save();
        ctx.clip(path, "nonzero");
        if (rm.wallFx === "frost") {
          ctx.fillStyle = "rgba(220,240,255,0.55)";
          for (i = 0; i < 2600; i++) { x = r() * W; y = r() * H; ctx.fillRect(x, y, 2, 2); }
        } else if (rm.wallFx === "moss") {
          ctx.fillStyle = "rgba(120,170,80,0.5)";
          for (i = 0; i < 2200; i++) { x = r() * W; y = r() * H; ctx.fillRect(x, y, 3, 2); }
        } else if (rm.wallFx === "rock") {
          ctx.fillStyle = "rgba(0,0,0,0.25)";
          for (i = 0; i < 2600; i++) { x = r() * W; y = r() * H; ctx.fillRect(x, y, 2, 2); }
        } else if (rm.wallFx === "ember") {
          ctx.fillStyle = "rgba(255,110,40,0.55)";
          for (i = 0; i < 1600; i++) { x = r() * W; y = r() * H; ctx.fillRect(x, y, 2, 1); }
        } else if (rm.wallFx === "ore") {
          ctx.fillStyle = "rgba(230,190,80,0.7)";
          for (i = 0; i < 900; i++) { x = r() * W; y = r() * H; ctx.fillRect(x, y, 2, 2); }
        } else if (rm.wallFx === "gold") {
          ctx.fillStyle = "rgba(240,210,110,0.45)";
          for (i = 0; i < 1400; i++) { x = r() * W; y = r() * H; ctx.fillRect(x, y, 2, 2); }
        } else if (rm.wallFx === "mist") {
          ctx.fillStyle = "rgba(170,210,195,0.35)";
          for (i = 0; i < 1800; i++) { x = r() * W; y = r() * H; ctx.fillRect(x, y, 3, 3); }
        }
        ctx.restore();
      } catch (e) { try { ctx.restore(); } catch (e2) {} }
    };

    /* Called from create() just before the first question. */
    P.setupRealm = function () {
      var sc = this, rm = this.realm || realmOf(this.night), n = this.night || 1;
      ensureArt(sc);
      this.foes = [];
      this.fenrir = null;
      this.realmDazzleMs = 0;
      this.valkNextMs = 0;
      this.valkLine = null;
      this._guardUsed = false;
      this._runeUsed = false;
      this._realmTickHud = 0;
      /* void and camera background in the realm's colour */
      try { this.cameras.main.setBackgroundColor(rm.pal.void); } catch (e) {}
      /* blessing: a spare life every level */
      if (perk(this, "blessing")) this.spareLives = Math.max(this.spareLives || 0, 1);
      this.spawnRealmParticles(rm);
      if (this.realmAmbience !== false) startAmbience(rm.amb);
      this.spawnRealmFoes(rm, n);
      if (this.isBossLevel) this.spawnFenrir();
      /* the realm card shows on the first level of a realm, on boss levels and the
         first time this Chromebook reaches a realm */
      var seen = false;
      try { seen = localStorage.getItem(LS_SEEN + rm.id) === "1"; localStorage.setItem(LS_SEEN + rm.id, "1"); } catch (eS) {}
      this._realmCardPending = this.realmLevel === 1 || this.isBossLevel || !seen;
      if (this.perkList && this.perkList.length) {
        toast(this, "Castle perks: " + this.perkList.map(function (p) { return p.name; }).join(" · "), 4200);
      }
      this.ensureRealmPip();
      sc.events.once("shutdown", function () { stopAmbience(); });
      sc.events.once("destroy", function () { stopAmbience(); });
    };

    P.spawnRealmParticles = function (rm) {
      var cam = this.cameras.main, W = cam.width || 1280, H = cam.height || 720, cfg = null, cfg2 = null;
      switch (rm.fx) {
        case "fireflies": cfg = { key: "rf-dot", x: { min: 0, max: W }, y: { min: 0, max: H }, speedX: { min: -12, max: 12 }, speedY: { min: -10, max: 10 }, lifespan: 5000, scale: { start: 0.35, end: 0.1 }, alpha: { start: 0.9, end: 0 }, tint: 0xf5e27a, frequency: 520, blendMode: "ADD" }; break;
        case "snow": cfg = { key: "rf-flake", x: { min: -40, max: W + 40 }, y: -12, speedX: { min: -18, max: 18 }, speedY: { min: 28, max: 70 }, lifespan: 15000, scale: { min: 0.5, max: 1.1 }, alpha: { start: 0.85, end: 0.3 }, rotate: { min: 0, max: 360 }, frequency: 110 }; break;
        case "dust": cfg = { key: "rf-dot", x: { min: 0, max: W }, y: { min: 0, max: H }, speedX: { min: 6, max: 22 }, speedY: { min: -4, max: 6 }, lifespan: 7000, scale: { start: 0.2, end: 0.35 }, alpha: { start: 0.35, end: 0 }, tint: 0xc8b89a, frequency: 260 }; break;
        case "embers": cfg = { key: "rf-dot", x: { min: 0, max: W }, y: H + 8, speedX: { min: -16, max: 16 }, speedY: { min: -80, max: -35 }, lifespan: 9000, scale: { start: 0.35, end: 0.05 }, alpha: { start: 0.95, end: 0 }, tint: [0xff8a2a, 0xffc04a, 0xff5a1a], frequency: 130, blendMode: "ADD" }; break;
        case "sparks": cfg = { key: "rf-dot", x: { min: 0, max: W }, y: -8, speedX: { min: -6, max: 6 }, speedY: { min: 20, max: 45 }, lifespan: 12000, scale: { start: 0.22, end: 0.08 }, alpha: { start: 0.9, end: 0.1 }, tint: 0xe0b84a, frequency: 380, blendMode: "ADD" }; break;
        case "petals": cfg = { key: "rf-leaf", x: { min: -40, max: W + 40 }, y: -10, speedX: { min: -10, max: 30 }, speedY: { min: 25, max: 55 }, lifespan: 14000, scale: { min: 0.8, max: 1.3 }, alpha: { start: 0.9, end: 0.4 }, rotate: { min: 0, max: 360 }, tint: [0xffb0d0, 0xffffff, 0x9ad07a, 0xffe07a], frequency: 240 }; break;
        case "motes": cfg = { key: "rf-dot", x: { min: 0, max: W }, y: H + 8, speedX: { min: -8, max: 8 }, speedY: { min: -30, max: -12 }, lifespan: 16000, scale: { start: 0.3, end: 0.1 }, alpha: { start: 0.8, end: 0 }, tint: [0xffffff, 0xfff0a0, 0xc8f0ff], frequency: 260, blendMode: "ADD" }; break;
        case "mist": cfg = { key: "rf-dot", x: -60, y: { min: 0, max: H }, speedX: { min: 14, max: 34 }, speedY: { min: -3, max: 3 }, lifespan: 26000, scale: { min: 5, max: 9 }, alpha: { start: 0.11, end: 0 }, tint: 0xb8d4c8, frequency: 700 }; break;
        case "gold": cfg = { key: "rf-dot", x: { min: 0, max: W }, y: -8, speedX: { min: -8, max: 8 }, speedY: { min: 14, max: 32 }, lifespan: 16000, scale: { start: 0.25, end: 0.08 }, alpha: { start: 0.9, end: 0.2 }, tint: [0xffe08a, 0xfff6d0], frequency: 300, blendMode: "ADD" }; break;
        case "ash":
          cfg = { key: "rf-dot", x: { min: 0, max: W }, y: -8, speedX: { min: -10, max: 14 }, speedY: { min: 22, max: 48 }, lifespan: 16000, scale: { min: 0.15, max: 0.3 }, alpha: { start: 0.55, end: 0.2 }, tint: 0x5a4a48, frequency: 160 };
          cfg2 = { key: "rf-dot", x: { min: 0, max: W }, y: H + 8, speedX: { min: -14, max: 14 }, speedY: { min: -70, max: -30 }, lifespan: 9000, scale: { start: 0.3, end: 0.05 }, alpha: { start: 0.9, end: 0 }, tint: [0xff6a2a, 0xffa040], frequency: 260, blendMode: "ADD" };
          break;
      }
      this.realmFx = [];
      var self = this;
      [cfg, cfg2].forEach(function (c) {
        if (!c) return;
        try {
          var key = c.key; delete c.key;
          c.maxAliveParticles = 80;
          var em = self.add.particles(0, 0, key, c).setScrollFactor(0).setDepth(14.5);
          if (c.lifespan > 6000 && em.fastForward) { try { em.fastForward(Math.min(c.lifespan, 9000), 50); } catch (eFF) {} }
          self.realmFx.push(em);
        } catch (eP) {}
      });
    };

    /* ── creatures ── */
    P.spawnRealmFoes = function (rm, n) {
      var L = this.realmLevel || levelInRealm(n), boss = this.isBossLevel, kinds = [];
      var r = seeded(n * 7919 + 13);
      if (!rm.foe) return;
      if (rm.foe.kind === "mix") {
        var pool = ["raven", "troll", "vent", "serpent", "boar", "draugr", "valkyrie", "wisp"];
        while (kinds.length < (boss ? 2 : 3)) { var k = pool[Math.floor(r() * pool.length)]; if (kinds.indexOf(k) === -1) kinds.push(k); }
      } else kinds = [rm.foe.kind];
      var self = this;
      kinds.forEach(function (kind) {
        var mixCount = rm.foe.kind === "mix";
        var cnt;
        if (kind === "raven") cnt = boss || mixCount ? 1 : (L <= 5 ? 1 : 2);
        else if (kind === "troll") cnt = boss || mixCount ? 1 : (L <= 5 ? 1 : 2);
        else if (kind === "vent") cnt = boss ? 2 : (mixCount ? 3 : 3 + Math.floor(L / 3));
        else if (kind === "serpent") cnt = 1;
        else if (kind === "boar") cnt = boss || mixCount ? 1 : (L <= 5 ? 1 : 2);
        else if (kind === "wisp") cnt = boss || mixCount ? 2 : 2 + Math.floor(L / 4);
        else if (kind === "draugr") cnt = boss || mixCount ? 1 : (L <= 5 ? 2 : 3);
        else if (kind === "valkyrie") cnt = 1;
        for (var i = 0; i < cnt; i++) {
          try { self.spawnFoe(kind, i, r, L, mixCount); } catch (eF) { if (window.console) console.warn("[realms] spawn " + kind, eF); }
        }
      });
    };

    P.spawnFoe = function (kind, idx, r, L, mixed) {
      var sc = this, M = K.maze(), f = { kind: kind, x: 0, y: 0, face: 0, stunMs: 0, hurts: true, r: 26, h: 50 };
      var cand = nodesOk(sc, 520, 380), pick, nd;
      function farPick(minD) {
        var p = sc.player, tries = 0, i, clear;
        while (tries++ < 60 && cand.length) {
          i = cand[Math.floor(r() * cand.length)];
          nd = node(i);
          /* away from Sol, and not on top of another creature */
          clear = (sc.foes || []).every(function (o) { return o.x == null || dist(o.x, o.y, nd.x, nd.y) > 260; });
          if ((!p || dist(nd.x, nd.y, p.x, p.y) > (minD || 600)) && (clear || tries > 40)) return i;
        }
        return cand.length ? cand[0] : 0;
      }
      if (kind === "raven") {
        pick = farPick(700); nd = node(pick);
        f.x = nd.x; f.y = nd.y; f.hurts = false; f.spd = 150 + L * 4; f.sightR = 150 + Math.min(40, L * 4); f.cd = 2500; f.h = 54;
        f.spr = sc.add.image(f.x, f.y - 26, "rf-raven-0").setDepth(13).setScale(0.9);
        f.shadow = sc.add.ellipse(f.x, f.y, 34, 12, 0x000000, 0.22).setDepth(3);
        f.ring = sc.add.circle(f.x, f.y, f.sightR, 0x000000, 0).setStrokeStyle(2, 0x1a1a26, 0.28).setDepth(3);
        f.flap = 0;
      } else if (kind === "troll") {
        var seg = this.pickTrollHall(r, cand);
        if (!seg) return;
        f.a = seg.a; f.b = seg.b; f.t = 0.5; f.dir = 1; f.x = f.a.x + (f.b.x - f.a.x) * 0.5; f.y = f.a.y + (f.b.y - f.a.y) * 0.5;
        f.spd = K.WALK * (0.46 + L * 0.012); f.chaseSpd = K.WALK * (0.66 + L * 0.012); f.r = 34; f.h = 96; f.roared = 0;
        f.spr = sc.add.image(f.x, f.y - 24, "rf-troll-0").setDepth(11.5).setScale(0.78);
        f.shadow = sc.add.ellipse(f.x, f.y + 8, 56, 16, 0x000000, 0.3).setDepth(10);
        f.track = sc.add.graphics().setDepth(1);
        f.track.lineStyle(10, 0x3a2a1a, 0.13); f.track.lineBetween(f.a.x, f.a.y, f.b.x, f.b.y);
      } else if (kind === "vent") {
        var spot = this.pickVentSpot(r);
        if (!spot) return;
        f.x = spot.x; f.y = spot.y; f.r = 38; f.hurts = true;
        f.idle = 3200 + r() * 1800; f.warn = 1100; f.burst = 1400; f.phase = r() * (f.idle + f.warn + f.burst); f.state = "idle";
        f.base = sc.add.image(f.x, f.y, "rf-vent").setDepth(1.5).setScale(0.95);
        f.glow = sc.add.circle(f.x, f.y, 34, 0xff7a2a, 0).setDepth(1.6);
        f.spr = sc.add.image(f.x, f.y + 22, "rf-flame").setOrigin(0.5, 1).setDepth(11.8).setScale(0.8, 0).setAlpha(0.95);
      } else if (kind === "serpent") {
        pick = farPick(800); nd = node(pick);
        f.x = nd.x; f.y = nd.y; f.cur = pick; f.prev = -1; f.next = -1; f.spd = K.WALK * (0.55 + L * 0.015);
        f.segs = mixed ? 7 : 6 + Math.floor(L / 2); f.gap = 24; f.trail = [{ x: f.x, y: f.y }]; f.r = 22; f.h = 40;
        f.bodies = [];
        for (var s = 0; s < f.segs; s++) {
          var sz = 1 - s / (f.segs + 3);
          f.bodies.push(sc.add.image(f.x, f.y, "rf-snake-body").setDepth(11.2).setScale(0.95 * sz + 0.1));
        }
        f.spr = sc.add.image(f.x, f.y, "rf-snake-head").setDepth(11.3).setScale(0.9);
      } else if (kind === "boar") {
        pick = farPick(650); nd = node(pick);
        f.x = nd.x; f.y = nd.y; f.state = "wander"; f.spd = K.WALK * 0.42; f.chargeSpd = K.WALK * (1.95 + L * 0.03); f.cd = 1500; f.r = 28; f.h = 56;
        f.spr = sc.add.image(f.x, f.y - 10, "rf-boar-0").setDepth(11.5).setScale(0.78);
        f.shadow = sc.add.ellipse(f.x, f.y + 10, 50, 14, 0x000000, 0.28).setDepth(10);
      } else if (kind === "wisp") {
        pick = farPick(650); nd = node(pick);
        f.x = nd.x; f.y = nd.y; f.hurts = false; f.r = 26; f.spd = 60; f.chase = 92 + L * 3; f.wob = r() * 10; f.gone = 0; f.h = 40;
        f.tx = f.x; f.ty = f.y;
        f.spr = sc.add.image(f.x, f.y, "rf-wisp").setDepth(13).setBlendMode(Phaser.BlendModes.ADD).setScale(0.9);
      } else if (kind === "draugr") {
        pick = farPick(760); nd = node(pick);
        f.x = nd.x; f.y = nd.y; f.spd = K.WALK * (0.62 + L * 0.02); f.replan = 0; f.r = 26; f.h = 76; f.anim = 0;
        f.spr = sc.add.image(f.x, f.y - 18, "rf-draugr-0").setDepth(11.5).setScale(0.8).setAlpha(0.92);
        f.shadow = sc.add.ellipse(f.x, f.y + 12, 36, 12, 0x000000, 0.25).setDepth(10);
      } else if (kind === "valkyrie") {
        f.hurts = true; f.r = 40; f.state = "wait"; f.wait = 5000 + r() * 3000; f.every = Math.max(6500, 11500 - L * 450);
        f.stripe = sc.add.rectangle(0, 0, 10, 10, 0xffd86a, 0).setDepth(3);
        f.spr = sc.add.image(-200, -200, "rf-valk-0").setDepth(13).setScale(0.95).setVisible(false);
        f.shadow = sc.add.ellipse(-200, -200, 70, 18, 0x000000, 0).setDepth(3);
      } else return;
      this.foes.push(f);
    };

    /* A straight stretch of 2-4 junctions for a troll to guard. */
    P.pickTrollHall = function (r, cand) {
      var M = K.maze(), best = null, tries, i, s, dir, list, cur, nb, k, used = {};
      (this.foes || []).forEach(function (f) { if (f.kind === "troll") { used[f.a.i] = 1; used[f.b.i] = 1; } });
      var ok = {}; cand.forEach(function (c) { ok[c] = 1; });
      for (tries = 0; tries < 60; tries++) {
        s = cand[Math.floor(r() * cand.length)];
        if (s == null || used[s]) continue;
        var nbs = (M.neigh[String(s)] || []).filter(function (x) { return ok[x.i]; });
        if (!nbs.length) continue;
        dir = nbs[Math.floor(r() * nbs.length)].dir;
        list = [s]; cur = s;
        for (k = 0; k < 3; k++) {
          nb = (M.neigh[String(cur)] || []).filter(function (x) { return x.dir === dir && ok[x.i] && !used[x.i]; })[0];
          if (!nb) break;
          list.push(nb.i); cur = nb.i;
        }
        if (list.length >= 2 && (!best || list.length > best.length)) best = list;
        if (best && best.length >= 4) break;
      }
      if (!best) return null;
      var a = M.nodes[best[0]], b = M.nodes[best[best.length - 1]];
      return { a: { i: best[0], x: a.x, y: a.y }, b: { i: best[best.length - 1], x: b.x, y: b.y } };
    };
    /* Vents sit mid-corridor (between two junctions), never where a letter tile can land. */
    P.pickVentSpot = function (r) {
      var G = K.railGraph(), sc = this, ex = K.exitPos(), st = K.startPos(), M = K.maze(), pen = M && M.ghostHouse, tries, e, x, y, ok;
      if (!G) return null;
      for (tries = 0; tries < 80; tries++) {
        e = G.edges[Math.floor(r() * G.edges.length)];
        if (!e || e.len < 90 || e.len > 200) continue;
        x = (e.ax + e.bx) / 2; y = (e.ay + e.by) / 2;
        if (K.inSafeZone(x, y) || dist(x, y, ex.x, ex.y) < 330 || dist(x, y, st.x, st.y) < 330) continue;
        if (pen && dist(x, y, pen.cx, pen.cy) < 170) continue;
        if (sc.player && dist(x, y, sc.player.x, sc.player.y) < 300) continue;
        ok = (sc.foes || []).every(function (f) { return f.kind !== "vent" || dist(f.x, f.y, x, y) > 230; });
        if (!ok) continue;
        if (K.hitsSolid(x, y, 12)) continue;
        return { x: x, y: y };
      }
      return null;
    };

    P.spawnFenrir = function () {
      var sc = this, M = K.maze(), pen = M && M.ghostHouse;
      var x = pen ? pen.cx : K.WORLD_W / 2, y = pen ? pen.cy : K.WORLD_H / 2;
      var f = { kind: "fenrir", x: x, y: y, homeX: x, homeY: y, face: 0, state: "prowl", timer: 0, stunMs: 0, hurts: true, r: 46, h: 120,
        spd: K.WALK * 0.7, chargeSpd: Math.min(K.SPRINT * 0.96, 390 + this.realmIdx * 10), replan: 0, nextCharge: 7000, path: null };
      var key = sc.textures.exists("hati1") ? "hati1" : "janitor";
      f.spr = sc.add.sprite(x, y - 16, key).setDepth(11.6).setScale(key === "hati1" ? 0.78 : 2.4).setTint(0x8a86a8);
      try { if (sc.anims.exists("hati-move")) f.spr.play("hati-move"); } catch (eA) {}
      f.shadow = sc.add.ellipse(x, y + 26, 100, 26, 0x000000, 0.35).setDepth(10);
      f.eye = sc.add.circle(x, y, 9, 0xff2a1a, 0.0).setDepth(11.7).setBlendMode(Phaser.BlendModes.ADD);
      f.tag = sc.add.text(x, y - 86, "FENRIR", { fontFamily: "Trebuchet MS", fontSize: 18, color: "#ffd0c8", fontStyle: "bold", stroke: "#200806", strokeThickness: 5 }).setOrigin(0.5).setDepth(40);
      this.fenrir = f;
      this.chainsTotal = this.needExtracts || 5;
      this.chainsLeft = this.chainsTotal;
      this.paintGateChains();
    };
    P.paintGateChains = function () {
      var ex = K.exitPos(), n = this.chainsLeft || 0, tot = this.chainsTotal || n, i, x0;
      if (!this.gateChains) this.gateChains = [];
      this.gateChains.forEach(function (o) { try { o.destroy(); } catch (e) {} });
      this.gateChains = [];
      if (!this.isBossLevel) return;
      x0 = ex.x - (tot - 1) * 15;
      for (i = 0; i < tot; i++) {
        var im = this.add.image(x0 + i * 30, ex.y - 78, "rf-lock").setDepth(9).setScale(1.1);
        if (i >= n) im.setAlpha(0.18);
        this.gateChains.push(im);
      }
      if (n > 0) {
        var g = this.add.graphics().setDepth(8.9);
        g.lineStyle(4, 0x8a8a9a, 0.8);
        g.lineBetween(ex.x - 90, ex.y - 60, ex.x + 90, ex.y + 40);
        g.lineBetween(ex.x + 90, ex.y - 60, ex.x - 90, ex.y + 40);
        this.gateChains.push(g);
      }
    };
    P.breakChain = function () {
      if (!this.isBossLevel || !(this.chainsLeft > 0)) return;
      this.chainsLeft -= 1;
      SFX.chain();
      this.paintGateChains();
      var f = this.fenrir;
      if (this.chainsLeft > 0) {
        toast(this, "A chain breaks! " + this.chainsLeft + " left on Fenrir's gate.", 2600);
        if (f && f.state !== "stunned") { f.state = "windup"; f.timer = 1100; SFX.howl(); }
      } else toast(this, "The last chain breaks! Fenrir flees.", 3000);
      if (f) {
        f.chargeSpd = Math.min(K.SPRINT * 0.96, f.chargeSpd + 8);   /* angrier with every chain */
        f.nextCharge = this.fenrirRest();
      }
    };
    /* v5.7.6: time between charges — 10 s at first, 0.8 s less for every chain broken, never under 5.5 s */
    P.fenrirRest = function () {
      var broken = (this.chainsTotal || 0) - (this.chainsLeft || 0);
      return Math.max(5500, 10000 - broken * 800) + Math.random() * 2000;
    };
    P.showFangs = function () {
      try {
        var box = document.getElementById("fang-row"), card = document.getElementById("win-msg");
        if (!card) return;
        if (!box) { box = document.createElement("div"); box.id = "fang-row"; box.className = "fang-row"; card.parentNode.insertBefore(box, card.nextSibling); }
        var got = loadFangs();
        box.innerHTML = '<p class="fang-title">Fenrir\'s Fangs · ' + got.length + " of " + REALMS.length + "</p>" +
          REALMS.map(function (r) { var on = got.indexOf(r.id) !== -1; return '<span class="fang' + (on ? " on" : "") + '" title="' + r.name + (on ? " — freed" : "") + '">' + (on ? "\u25BC" : "\u25BD") + "<small>" + r.name + "</small></span>"; }).join("");
        box.classList.remove("hidden");
      } catch (e) {}
    };
    P.fenrirProvoke = function () {
      var f = this.fenrir;
      if (!f || f.state === "stunned") return;
      f.state = "windup"; f.timer = 900;
      SFX.howl();
      toast(this, "Wrong letter! Fenrir is coming!", 2400);
    };

    P.tickFenrir = function (ms) {
      var f = this.fenrir, sc = this, p = this.player, frozen = (this.iceWorldFreezeMs || 0) > 0;
      if (!f || !p) return;
      if (f.stunMs > 0) { f.stunMs -= ms; if (f.stunMs <= 0) { f.state = "rest"; f.timer = 800; } }
      else if (!frozen) {
        if (f.state === "rest") {                           /* v5.7.6: a short pant after a charge or a stun */
          f.timer -= ms;
          if (f.timer <= 0) { f.state = "prowl"; f.path = null; f.replan = 0; }
        } else if (f.state === "prowl") {
          /* v5.7.6: he stalks Sol through the whole maze (slower than her walk), then charges */
          f.nextCharge -= ms; f.replan -= ms;
          if (f.replan <= 0 || !f.path || f.pi >= f.path.length) {
            if (K.inSafeZone(p.x, p.y)) { var M = K.maze(), cand = nodesOk(sc, 200, 250), nd = cand.length ? M.nodes[cand[Math.floor(Math.random() * cand.length)]] : { x: f.homeX, y: f.homeY }; goTo(sc, f, nd.x, nd.y); }
            else goTo(sc, f, p.x, p.y);
            f.replan = 1500;
          }
          walk(f, f.spd, ms);
          if (f.nextCharge <= 0 && !K.inSafeZone(p.x, p.y)) { f.state = "windup"; f.timer = 1100; SFX.howl(); toast(sc, "Fenrir howls. He is coming for you!", 2200); }
        } else if (f.state === "windup") {
          f.timer -= ms;
          if (f.timer <= 0) { f.state = "charge"; f.timer = 4500; f.replan = 0; f.path = null; }
        } else if (f.state === "charge") {
          f.timer -= ms; f.replan -= ms;
          if (f.replan <= 0) { goTo(sc, f, p.x, p.y); f.replan = 450; }
          var done = walk(f, f.chargeSpd, ms);
          if (dist(f.x, f.y, p.x, p.y) < 140 && !K.inSafeZone(p.x, p.y) && !K.losBlocked(f.x, f.y, p.x, p.y)) {
            var dx = p.x - f.x, dy = p.y - f.y, d = Math.sqrt(dx * dx + dy * dy) || 1, st = f.chargeSpd * ms / 1000;
            if (!K.hitsSolid(f.x + dx / d * st, f.y + dy / d * st, 20)) { f.x += dx / d * st; f.y += dy / d * st; f.face = Math.atan2(dy, dx); }
          }
          if (f.timer <= 0 || K.inSafeZone(p.x, p.y) || (done && dist(f.x, f.y, p.x, p.y) > 200)) {
            f.state = "rest"; f.timer = 1400; f.nextCharge = this.fenrirRest();
          }
        } else if (f.state === "return") {
          if (walk(f, f.spd * 1.5, ms)) { f.state = "prowl"; f.path = null; f.nextCharge = this.fenrirRest(); }
        }
      }
      /* draw */
      var angry = f.state === "windup" || f.state === "charge";
      f.spr.setPosition(f.x, f.y - 16); flip(f.spr, f.face);
      f.spr.setTint(f.stunMs > 0 ? 0x6a6aa0 : (angry ? 0xb07070 : 0x8a86a8));
      f.shadow.setPosition(f.x, f.y + 26);
      f.eye.setPosition(f.x + (Math.cos(f.face) < 0 ? -30 : 30), f.y - 30).setFillStyle(0xff2a1a, angry ? 0.55 : 0.12);
      f.tag.setPosition(f.x, f.y - 86).setText(f.stunMs > 0 ? "FENRIR · stunned" : (angry ? "FENRIR!" : f.state === "rest" ? "FENRIR · panting" : "FENRIR"));
      if (f.stunMs > 0 || !play(this)) return;
      /* contact */
      if (dist(f.x, f.y, p.x, p.y) < f.r && !K.inSafeZone(p.x, p.y)) this.foeContact(f);
    };

    /* Touching a creature: a power-up smashes it, a shield passes through, otherwise a catch. */
    P.foeContact = function (f) {
      if (!f.hurts || this.ended || (this.iframeMs || 0) > 0 || this.justStruck) return;
      var charged = (this.lockerPowerMs || 0) > 0 || (this.dogModeMs || 0) > 0 || (this.pineappleMs || 0) > 0;
      var shielded = (this.forcefieldMs || 0) > 0 || (this.superPacMs || 0) > 0;
      var smashable = f.kind === "troll" || f.kind === "boar" || f.kind === "draugr" || f.kind === "serpent" || f.kind === "fenrir";
      if (charged && smashable) {
        f.stunMs = f.kind === "fenrir" ? 4000 : 3000; f.state = f.kind === "fenrir" ? "stunned" : f.state;
        if (f.kind === "boar") f.state = "stunned";
        mark(this, f, "SMASH!", "#ffe066");
        toast(this, "Chariot power! You knocked " + (FOE_NAMES[f.kind] || "it") + " flat.", 2200);
        if (window.AfterHoursAudio && AfterHoursAudio.smashChain) { try { AfterHoursAudio.smashChain(1); } catch (e) {} }
        return;
      }
      if (charged || shielded) return;
      if (f.kind === "fenrir" && perk(this, "rune") && !this._runeUsed) {
        this._runeUsed = true; f.stunMs = 2600; f.state = "stunned";
        mark(this, f, "RUNE!", "#9aefc0");
        toast(this, "The Rune of Sol turned Fenrir aside!", 2600);
        SFX.perk();
        return;
      }
      this._caughtBy = f.kind;
      this.caught({ x: f.x, y: f.y, setVelocity: function () {} });
      if (f.kind === "fenrir") { f.state = "rest"; f.timer = 2200; f.nextCharge = this.fenrirRest(); }
      if (f.kind === "boar") { f.state = "stunned"; f.stunMs = 1200; }
    };

    P.tickFoes = function (ms) {
      var sc = this, p = this.player, foes = this.foes || [], i, f, frozen = (this.iceWorldFreezeMs || 0) > 0, now = this.time.now || 0;
      if (!p) return;
      var pSafe = K.inSafeZone(p.x, p.y);
      for (i = 0; i < foes.length; i++) {
        f = foes[i];
        if (f.stunMs > 0) { f.stunMs -= ms; if (f.spr) f.spr.setAlpha(0.65 + 0.25 * Math.sin(now / 200)); if (f.stunMs <= 0 && f.spr) f.spr.setAlpha(1); }
        var moving = !frozen && !(f.stunMs > 0);
        switch (f.kind) {
          case "raven": {
            if (moving) {
              if (f.tx == null || dist(f.x, f.y, f.tx, f.ty) < 12) {
                var M = K.maze(), nds = (M && M.nodes) || [], tn = null, tries = 0;
                while (tries++ < 12) {
                  tn = nds[Math.floor(Math.random() * nds.length)];
                  if (!tn) break;
                  if (Math.random() < 0.55 && dist(tn.x, tn.y, p.x, p.y) > 520) continue;
                  break;
                }
                if (tn) { f.tx = tn.x; f.ty = tn.y; }
              }
              var dx = f.tx - f.x, dy = f.ty - f.y, d = Math.sqrt(dx * dx + dy * dy) || 1, st = f.spd * ms / 1000;
              f.x += dx / d * Math.min(st, d); f.y += dy / d * Math.min(st, d); f.face = Math.atan2(dy, dx);
              f.flap += ms;
            }
            f.cd -= ms;
            var seesSol = !pSafe && !this.inDarkZone && !inDark(p.x, p.y) && dist(f.x, f.y, p.x, p.y) < f.sightR && !this.ended;
            if (seesSol && f.cd <= 0) {
              f.cd = 9000; f.alarm = 1400;
              SFX.caw(); mark(this, f, "CAW!", "#ffe066");
              toast(this, "A raven spotted you! The wolves are coming.", 2400);
              this.ravenAlert(p.x, p.y);
            }
            if (f.alarm > 0) f.alarm -= ms;
            f.spr.setTexture(Math.floor(f.flap / 170) % 2 ? "rf-raven-1" : "rf-raven-0").setPosition(f.x, f.y - 30); flip(f.spr, f.face);
            f.shadow.setPosition(f.x + 8, f.y + 6);
            f.ring.setPosition(f.x, f.y).setStrokeStyle(2, f.alarm > 0 ? 0xffc040 : 0x1a1a26, f.alarm > 0 ? 0.6 : 0.28);
            break;
          }
          case "troll": {
            var ax = f.a.x, ay = f.a.y, bx = f.b.x, by = f.b.y, L2 = (bx - ax) * (bx - ax) + (by - ay) * (by - ay), len = Math.sqrt(L2) || 1;
            var tp = ((p.x - ax) * (bx - ax) + (p.y - ay) * (by - ay)) / (L2 || 1), px = ax + (bx - ax) * tp, py = ay + (by - ay) * tp;
            var near = !pSafe && tp > -0.25 && tp < 1.25 && dist(p.x, p.y, px, py) < 90 && dist(f.x, f.y, p.x, p.y) < 330 && !K.losBlocked(f.x, f.y, p.x, p.y);
            if (moving) {
              var sp = near ? f.chaseSpd : f.spd, dt = sp * ms / 1000 / len;
              if (near) {
                if (!f.roared || now - f.roared > 6000) { f.roared = now; SFX.roar(); mark(this, f, "!", "#ff9a6a"); }
                var tgt = Math.max(0, Math.min(1, tp));
                if (Math.abs(tgt - f.t) <= dt) f.t = tgt; else f.t += (tgt > f.t ? dt : -dt);
                f.dir = tgt >= f.t ? 1 : -1;
              } else {
                f.t += f.dir * dt;
                if (f.t >= 1) { f.t = 1; f.dir = -1; }
                if (f.t <= 0) { f.t = 0; f.dir = 1; }
              }
              var ox = f.x;
              f.x = ax + (bx - ax) * f.t; f.y = ay + (by - ay) * f.t;
              if (Math.abs(f.x - ox) > 0.01) f.face = f.x > ox ? 0 : Math.PI;
              f.step = (f.step || 0) + ms;
            }
            f.spr.setTexture(Math.floor((f.step || 0) / 260) % 2 ? "rf-troll-1" : "rf-troll-0").setPosition(f.x, f.y - 24); flip(f.spr, f.face);
            f.shadow.setPosition(f.x, f.y + 10);
            break;
          }
          case "vent": {
            var cyc = f.idle + f.warn + f.burst;
            if (!frozen) f.phase = (f.phase + ms) % cyc;
            var ph = f.phase, st2 = ph < f.idle ? "idle" : (ph < f.idle + f.warn ? "warn" : "burst");
            if (st2 === "burst" && f.state !== "burst" && dist(f.x, f.y, p.x, p.y) < 700) SFX.burst();
            f.state = st2;
            f.hurts = st2 === "burst";
            if (st2 === "idle") { f.glow.setFillStyle(0xff7a2a, 0.05); f.spr.setScale(0.8, 0.02).setAlpha(0); }
            else if (st2 === "warn") { var w = (ph - f.idle) / f.warn; f.glow.setFillStyle(0xff7a2a, 0.12 + w * 0.3); f.spr.setScale(0.5, 0.15 * w).setAlpha(0.8); }
            else { var bt = (ph - f.idle - f.warn) / f.burst, sh = bt < 0.15 ? bt / 0.15 : (bt > 0.8 ? (1 - bt) / 0.2 : 1); f.glow.setFillStyle(0xff9a3a, 0.45); f.spr.setScale(0.85 + 0.06 * Math.sin(now / 70), 1.05 * sh + 0.02 * Math.sin(now / 55)).setAlpha(0.95); }
            break;
          }
          case "serpent": {
            if (moving) {
              var target = node(f.cur);
              var sd = dist(f.x, f.y, target.x, target.y), st3 = f.spd * ms / 1000;
              if (sd <= st3) {
                f.x = target.x; f.y = target.y;
                var M2 = K.maze(), ok = nodesOk(sc, 300, 300), okm = {}; ok.forEach(function (q) { okm[q] = 1; });
                var opts = (M2.neigh[String(f.cur)] || []).filter(function (x) { return x.i !== f.prev && okm[x.i]; });
                var nxt;
                if (!opts.length) nxt = f.prev >= 0 ? f.prev : f.cur;
                else if (Math.random() < 0.4) { opts.sort(function (a, b) { return dist(a.x, a.y, p.x, p.y) - dist(b.x, b.y, p.x, p.y); }); nxt = opts[0].i; }
                else nxt = opts[Math.floor(Math.random() * opts.length)].i;
                f.prev = f.cur; f.cur = nxt;
              } else { f.x += (target.x - f.x) / sd * st3; f.y += (target.y - f.y) / sd * st3; f.face = Math.atan2(target.y - f.y, target.x - f.x); }
              var last = f.trail[0];
              if (dist(last.x, last.y, f.x, f.y) >= 4) { f.trail.unshift({ x: f.x, y: f.y }); if (f.trail.length > f.segs * f.gap / 4 + 12) f.trail.pop(); }
            }
            f.spr.setPosition(f.x, f.y).setRotation(f.face);
            var need = f.gap, acc = 0, ti = 0, prevPt = { x: f.x, y: f.y }, sI;
            f.segPts = [];
            for (sI = 0; sI < f.bodies.length; sI++) {
              while (ti < f.trail.length - 1 && acc < need) { acc += dist(prevPt.x, prevPt.y, f.trail[ti + 1].x, f.trail[ti + 1].y); prevPt = f.trail[ti + 1]; ti++; }
              f.bodies[sI].setPosition(prevPt.x, prevPt.y);
              f.segPts.push({ x: prevPt.x, y: prevPt.y });
              need += f.gap;
            }
            break;
          }
          case "boar": {
            if (f.state === "stunned") { if (f.stunMs <= 0) { f.state = "wander"; f.path = null; } }
            else if (moving && f.state === "wander") {
              f.cd -= ms;
              if (!f.path || f.pi >= f.path.length) { var c2 = nodesOk(sc, 300, 300), tn2 = node(c2[Math.floor(Math.random() * c2.length)]); if (tn2) goTo(sc, f, tn2.x, tn2.y); }
              walk(f, f.spd, ms); f.step = (f.step || 0) + ms;
              var lineH = Math.abs(p.y - f.y) < 26, lineV = Math.abs(p.x - f.x) < 26, dd = dist(f.x, f.y, p.x, p.y);
              if (f.cd <= 0 && !pSafe && (lineH || lineV) && dd < 640 && dd > 60 && !K.losBlocked(f.x, f.y, p.x, p.y)) {
                f.state = "windup"; f.timer = 650; f.ux = lineH ? (p.x > f.x ? 1 : -1) : 0; f.uy = lineH ? 0 : (p.y > f.y ? 1 : -1);
                f.face = Math.atan2(f.uy, f.ux); SFX.snort(); mark(this, f, "!", "#ffcf40");
              }
            } else if (moving && f.state === "windup") {
              f.timer -= ms; f.spr.setPosition(f.x + Math.sin(now / 30) * 2, f.y - 10);
              if (f.timer <= 0) { f.state = "charge"; f.run = 0; }
            } else if (moving && f.state === "charge") {
              var st4 = f.chargeSpd * ms / 1000, nx = f.x + f.ux * st4, ny = f.y + f.uy * st4;
              if (K.hitsSolid(nx + f.ux * 22, ny + f.uy * 22, 14) || K.inSafeZone(nx + f.ux * 30, ny + f.uy * 30) || f.run > 1100) {
                f.state = "stunned"; f.stunMs = 1400; f.cd = 2600; f.path = null; mark(this, f, "✶", "#ffffff");
                if (window.AfterHoursAudio && AfterHoursAudio.mushThud) { try { AfterHoursAudio.mushThud(); } catch (e) {} }
              } else { f.x = nx; f.y = ny; f.run += st4; f.step = (f.step || 0) + ms * 2; }
            }
            if (f.state !== "windup") f.spr.setPosition(f.x, f.y - 10);
            f.spr.setTexture(Math.floor((f.step || 0) / 160) % 2 ? "rf-boar-1" : "rf-boar-0"); flip(f.spr, f.face);
            f.shadow.setPosition(f.x, f.y + 10);
            break;
          }
          case "wisp": {
            if (f.gone > 0) {
              f.gone -= ms;
              if (f.gone <= 0) {
                var c3 = nodesOk(sc, 300, 300).filter(function (q) { var nd = node(q); return dist(nd.x, nd.y, p.x, p.y) > 520; });
                var nd3 = node(c3[Math.floor(Math.random() * c3.length)] || 0);
                f.x = nd3.x; f.y = nd3.y; f.spr.setVisible(true).setAlpha(0);
                sc.tweens.add({ targets: f.spr, alpha: 1, duration: 800 });
              }
              break;
            }
            if (moving) {
              var dp = dist(f.x, f.y, p.x, p.y), sp2;
              if (dp < 330 && !pSafe) { f.tx = p.x; f.ty = p.y; sp2 = f.chase; }
              else { if (dist(f.x, f.y, f.tx, f.ty) < 10) { f.tx = f.x + (Math.random() - 0.5) * 300; f.ty = f.y + (Math.random() - 0.5) * 300; } sp2 = f.spd; }
              var dx2 = f.tx - f.x, dy2 = f.ty - f.y, d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2) || 1, st5 = sp2 * ms / 1000;
              f.x += dx2 / d2 * Math.min(st5, d2); f.y += dy2 / d2 * Math.min(st5, d2);
              f.x = Math.max(60, Math.min(K.WORLD_W - 60, f.x)); f.y = Math.max(60, Math.min(K.WORLD_H - 60, f.y));
            }
            f.spr.setPosition(f.x, f.y + Math.sin(now / 400 + f.wob) * 6).setScale(0.85 + 0.08 * Math.sin(now / 300 + f.wob));
            if (!pSafe && dist(f.x, f.y, p.x, p.y) < f.r + 12 && !this.ended) {
              f.gone = 7000; f.spr.setVisible(false);
              this.realmDazzleMs = 4200; SFX.chime();
              toast(this, "A wisp dazzled you! You can only see close by for a moment.", 2600);
            }
            break;
          }
          case "draugr": {
            var vx = f.x - p.x, vy = f.y - p.y, dv = Math.sqrt(vx * vx + vy * vy) || 1, face = this.playerFace;
            var watched = face != null && dv < 760 && !K.losBlocked(p.x, p.y, f.x, f.y) && (Math.cos(face) * vx / dv + Math.sin(face) * vy / dv) > 0.45;
            f.watched = watched;
            if (moving && !watched && !pSafe) {
              f.replan -= ms;
              if (f.replan <= 0) { goTo(sc, f, p.x, p.y); f.replan = 700; }
              walk(f, f.spd, ms); f.anim += ms;
              if (!K.losBlocked(f.x, f.y, p.x, p.y) && dv < 120) {
                var st6 = f.spd * ms / 1000;
                if (!K.hitsSolid(f.x - vx / dv * st6, f.y - vy / dv * st6, 12)) { f.x -= vx / dv * st6; f.y -= vy / dv * st6; }
              }
            }
            var shiver = watched ? Math.sin(now / 25) * 1.2 : 0;
            f.spr.setTexture(Math.floor(f.anim / 300) % 2 ? "rf-draugr-1" : "rf-draugr-0").setPosition(f.x + shiver, f.y - 18)
              .setTint(watched ? 0xc8e8ff : 0xffffff).setAlpha(watched ? 0.75 : 0.92);
            flip(f.spr, Math.atan2(p.y - f.y, p.x - f.x));
            f.shadow.setPosition(f.x, f.y + 12);
            break;
          }
          case "valkyrie": {
            if (frozen) break;
            if (f.state === "wait") {
              f.wait -= ms;
              if (f.wait <= 0 && !pSafe) {
                var M3 = K.maze(), horiz = Math.random() < 0.5, nn = K.nearestMazeNode(p.x, p.y), lineAt = horiz ? nn.y : nn.x;
                f.horiz = horiz; f.line = lineAt; f.state = "warn"; f.timer = 1600; f.dir = Math.random() < 0.5 ? 1 : -1;
                if (horiz) f.stripe.setPosition(K.WORLD_W / 2, lineAt).setSize(K.WORLD_W, 76); else f.stripe.setPosition(lineAt, K.WORLD_H / 2).setSize(76, K.WORLD_H);
                f.stripe.setFillStyle(0xffd86a, 0);
                SFX.whoosh();
                toast(this, "A golden shadow falls across the hall. Step out of it!", 2000);
              }
            } else if (f.state === "warn") {
              f.timer -= ms;
              f.stripe.setFillStyle(0xffd86a, 0.08 + (1 - f.timer / 1600) * 0.22);
              if (f.timer <= 0) {
                f.state = "fly"; f.pos = f.dir > 0 ? -140 : (f.horiz ? K.WORLD_W : K.WORLD_H) + 140;
                f.spr.setVisible(true).setFlipX(f.dir < 0).setRotation(f.horiz ? 0 : (f.dir > 0 ? Math.PI / 2 : -Math.PI / 2));
                if (!f.horiz) f.spr.setFlipX(false);
                f.shadow.setFillStyle(0x000000, 0.25);
              }
            } else if (f.state === "fly") {
              f.pos += f.dir * 1500 * ms / 1000;
              f.x = f.horiz ? f.pos : f.line; f.y = f.horiz ? f.line : f.pos;
              f.spr.setPosition(f.x, f.y - 24).setTexture(Math.floor(now / 110) % 2 ? "rf-valk-1" : "rf-valk-0");
              f.shadow.setPosition(f.x, f.y + 4);
              var endAt = f.horiz ? K.WORLD_W : K.WORLD_H;
              if (f.pos < -200 || f.pos > endAt + 200) {
                f.state = "wait"; f.wait = f.every + Math.random() * 2500; f.spr.setVisible(false); f.stripe.setFillStyle(0xffd86a, 0); f.shadow.setFillStyle(0x000000, 0);
              }
            }
            break;
          }
        }
        /* contact */
        if (!f.hurts || f.stunMs > 0 || pSafe || this.ended) continue;
        if (f.kind === "valkyrie") {
          if (f.state === "fly" && Math.abs((f.horiz ? p.y : p.x) - f.line) < 38 && Math.abs((f.horiz ? p.x : p.y) - f.pos) < 54) this.foeContact(f);
          continue;
        }
        if (f.kind === "serpent") {
          var hit = dist(f.x, f.y, p.x, p.y) < f.r + 12;
          if (!hit && f.segPts) for (var q = 0; q < f.segPts.length && !hit; q++) hit = dist(f.segPts[q].x, f.segPts[q].y, p.x, p.y) < 26;
          if (hit) this.foeContact(f);
          continue;
        }
        if (dist(f.x, f.y, p.x, p.y) < f.r) this.foeContact(f);
      }
    };

    /* A raven's call: the nearest wolf hunts Sol, the others come to listen. */
    P.ravenAlert = function (x, y) {
      var js = this.janitors || [], best = null, bd = 1e9, i, j, d;
      for (i = 0; i < js.length; i++) {
        j = js[i];
        if (!j || (j.eyesMs || 0) > 0 || (j.eatenMs || 0) > 0) continue;
        d = dist(j.x, j.y, x, y);
        if (d < bd) { bd = d; best = j; }
      }
      if (best) {
        best.chasing = true; best.chaseFor = 0; best.chaseMs = this.chaseMs; best.loseSightMs = 0; best.pause = 0;
        best.investigate = false; best.searching = false; best.detFill = 1; best.allowReverse = true; best.hearX = x; best.hearY = y; best.gdir = null;
      }
      if (this.emitSound) { try { this.emitSound(x, y, 1100); } catch (e) {} }
    };

    P.tickDazzle = function (ms) {
      var want = 0;
      if (this.realmDazzleMs > 0) { this.realmDazzleMs -= ms; want = this.realmDazzleMs > 600 ? 0.93 : Math.max(0, this.realmDazzleMs / 600) * 0.93; }
      if (!want && !this.dazzleImg) return;
      if (!this.dazzleImg || !this.dazzleImg.scene) {
        this.dazzleImg = this.add.image(0, 0, "rf-dazzle").setOrigin(0, 0).setScrollFactor(0).setDepth(14.8).setAlpha(0);
      }
      var cam = this.cameras.main;
      this.dazzleImg.setDisplaySize(cam.width, cam.height);
      var a = this.dazzleImg.alpha, step = ms / 400;
      this.dazzleImg.setAlpha(a < want ? Math.min(want, a + step) : Math.max(want, a - step * 0.7));
    };

    /* Once a frame from update(), after the Hati and their catches. */
    P.tickRealm = function (dt) {
      if (!this.player || this.ended) return;
      var ms = K.playStep(dt);
      try { this.tickFoes(ms); } catch (e1) { if (!this._foeErr) { this._foeErr = 1; if (window.console) console.warn("[realms] foes", e1); } }
      try { this.tickFenrir(ms); } catch (e2) { if (!this._fenErr) { this._fenErr = 1; if (window.console) console.warn("[realms] fenrir", e2); } }
      this.tickDazzle(ms);
      tickAmbience(Date.now(), !!this.readOpen);
      this._realmTickHud -= ms;
      if (this._realmTickHud <= 0) { this._realmTickHud = 500; this.paintRealmPip(); }
    };

    /* ── HUD ── */
    P.ensureRealmPip = function () {
      var pip = document.getElementById("realm-pip");
      if (!pip) {
        var after = document.getElementById("strike-pip");
        if (!after || !after.parentNode) return;
        pip = document.createElement("span");
        pip.id = "realm-pip"; pip.className = "pip realm-pip";
        after.parentNode.insertBefore(pip, after.nextSibling);
      }
      this.paintRealmPip();
    };
    P.paintRealmPip = function () {
      var pip = document.getElementById("realm-pip");
      if (!pip) return;
      var parts = [], rm = this.realm;
      if (this.isBossLevel) parts.push("Fenrir's gate · " + (this.chainsLeft || 0) + " chain" + (this.chainsLeft === 1 ? "" : "s") + " left");
      else if (rm && rm.foe) parts.push(rm.foe.kind === "mix" ? "All creatures return" : rm.foe.name);
      if (this.perkList && this.perkList.length) parts.push("★ " + this.perkList.length + " perk" + (this.perkList.length === 1 ? "" : "s"));
      var txt = parts.join(" · ");
      if (pip.textContent !== txt) pip.textContent = txt;
      pip.title = (this.perkList || []).map(function (p) { return p.name + ": " + p.desc; }).join("\n");
      pip.classList.toggle("hidden", !txt);
      pip.classList.toggle("boss", !!this.isBossLevel);
    };
    wrap("paintHud", function (orig, args) {
      var r = orig.apply(this, args);
      try {
        var rf = document.getElementById("round-flag"), rm = this.realm || realmOf(this.night);
        if (rf) rf.textContent = "Level " + this.night + " / 100 · " + rm.name + (this.isBossLevel ? " · Boss" : "");
      } catch (e) {}
      return r;
    });

    /* ── the realm card inside the reading pop-up ── */
    wrap("openReading", function (orig, args) {
      var reason = args[0], card = document.getElementById("realm-card");
      if (!card) {
        var rc = document.getElementById("read-card"), sc = document.getElementById("read-scroll");
        if (rc && sc) { card = document.createElement("div"); card.id = "realm-card"; card.className = "realm-card hidden"; rc.insertBefore(card, sc); }
      }
      if (card) {
        if (reason === "start" && this._realmCardPending) {
          this._realmCardPending = false;
          var rm = this.realm || realmOf(this.night), html = "";
          html += '<p class="rk">Realm ' + (this.realmIdx + 1) + " of 10 · Level " + this.realmLevel + " of 10</p>";
          html += "<h3>" + rm.name + ' <span>· ' + rm.title + "</span></h3>";
          html += "<p>" + rm.blurb + "</p>";
          if (rm.foe) html += '<p class="foe"><b>' + (rm.foe.kind === "mix" ? "Creatures" : "New creature") + ": " + rm.foe.name + ".</b> " + rm.foe.desc + "</p>";
          if (this.isBossLevel) html += '<p class="boss"><b>Boss level: Fenrir.</b> The great wolf has chained the gate with ' + (this.chainsTotal || this.needExtracts) + " locks. Every correct answer you carry to EXIT breaks one. A wrong letter makes him charge, so read carefully.</p>";
          if (this.perkList && this.perkList.length) html += '<p class="perks"><b>Your castle perks:</b> ' + this.perkList.map(function (p) { return p.name; }).join(", ") + ".</p>";
          card.innerHTML = html;
          card.classList.remove("hidden");
          card.classList.toggle("boss", !!this.isBossLevel);
          card.setAttribute("data-realm", rm.id);
        } else card.classList.add("hidden");
      }
      return orig.apply(this, args);
    });

    /* ── boss hooks ── */
    wrap("tryExtract", function (orig, args) {
      var before = this.score || 0;
      var r = orig.apply(this, args);
      if (this.isBossLevel && (this.score || 0) > before) this.breakChain();
      return r;
    });
    /* v5.7.6: Fenrir smells a rune the moment Sol picks one up — his next charge comes within 2.5 s */
    wrap("tryGrab", function (orig, args) {
      var before = this.carriedSlips ? this.carriedSlips().length : 0;
      var r = orig.apply(this, args);
      var f = this.fenrir;
      if (this.isBossLevel && f && !this.ended && this.carriedSlips && this.carriedSlips().length > before && f.state === "prowl") {
        f.nextCharge = Math.min(f.nextCharge, 2500);
        toast(this, "Fenrir smells the rune you picked up. Get it to EXIT before he catches you!", 2600);
      }
      return r;
    });
    wrap("flagWrongAlarm", function (orig, args) {
      var r = orig.apply(this, args);
      if (this.isBossLevel && !this.ended) this.fenrirProvoke();
      return r;
    });

    /* ── perks ── */
    wrap("caught", function (orig, args) {
      var sc = this;
      var blocked = (this.forcefieldMs || 0) > 0 || (this.superPacMs || 0) > 0 || this.iframeMs > 0 || this.ended || this.justStruck;
      if (!blocked && perk(this, "guard") && !this._guardUsed) {
        this._guardUsed = true;
        this.iframeMs = Math.max(this.iframeMs || 0, 1600);
        var jan = args[0];
        if (jan && jan.body && this.horseshoeSoftBounce) { try { this.horseshoeSoftBounce(jan, this.player.x, this.player.y); } catch (e) {} }
        toast(this, "Your castle guard blocked that catch! (once per level)", 2800);
        SFX.perk();
        this.paintHud();
        return;
      }
      var strikes = this.strikes, spare = this.spareLives;
      var r = orig.apply(this, args);
      var happened = this.strikes !== strikes || this.spareLives !== spare;
      if (happened && perk(this, "hearth")) this.iframeMs = (this.iframeMs || 0) + 1000;
      if (happened && this._caughtBy && this.caughtFlashTag && !this.ended) {
        try { this.caughtFlashTag.setText(this.caughtFlashTag.text.replace(/^CAUGHT/, "CAUGHT BY " + (FOE_NAMES[this._caughtBy] || "").toUpperCase())); } catch (eT) {}
      }
      this._caughtBy = null;
      if (happened && this.fenrir && this.fenrir.state === "charge") { this.fenrir.state = "rest"; this.fenrir.timer = 2200; this.fenrir.nextCharge = this.fenrirRest(); }
      return r;
    });
    wrap("coinEconomy", function (orig, args) {
      var ec = orig.apply(this, args) || {};
      var out = Object.assign({}, ec), nf = loadFangs().length;
      if (nf) out.answer = (out.answer || 10) + nf;   /* v5.7.6: Fenrir's Fangs, +1 coin an answer per realm freed */
      if (!this.perks) return out;
      if (this.perks.trade) out.answer = (out.answer || 10) + 2;
      if (this.perks.gold) { out.bonusMin = (out.bonusMin || 3) * 2; out.bonusMax = (out.bonusMax || 12) * 2; }
      return out;
    });
    wrap("activateLockerPower", function (orig, args) {
      var before = this.lockerPowerMs || 0;
      var r = orig.apply(this, args);
      if (perk(this, "tinker") && (this.lockerPowerMs || 0) > before) this.lockerPowerMs = Math.round(before + (this.lockerPowerMs - before) * 1.25);
      return r;
    });
    /* Speed: called by update() just before Sol's velocity is set. */
    P.realmSpeed = function (spd, carrying, sprinting) {
      var base = carrying ? (sprinting ? K.CARRY_SPRINT : K.CARRY_WALK) : (sprinting ? K.SPRINT : K.WALK);
      if (perk(this, "iron") && spd < base) spd = base - (base - spd) * 0.5;
      if (perk(this, "swift")) spd *= 1.06;
      return spd;
    };

    wrap("endRun", function (orig, args) {
      var win = !!args[0], rm = this.realm || realmOf(this.night), bonus = [];
      stopAmbience();
      try { var fr = document.getElementById("fang-row"); if (fr) fr.classList.add("hidden"); } catch (eF) {}
      if (win && !this.ended) {
        if (this.isBossLevel) {
          var prize = 100 + 25 * (this.realmIdx || 0);
          this.giveCoins(prize, "Realm cleared");
          bonus.push("+" + prize + " coins for beating Fenrir in " + rm.name);
          var fangs = loadFangs(), had = fangs.indexOf(rm.id) !== -1;
          if (!had) { fangs.push(rm.id); saveFangs(fangs); }
          this._fangNews = had ? "" : "You won Fenrir's Fang of " + rm.name + ": every correct answer now pays +" + fangs.length + " extra coin" + (fangs.length === 1 ? "" : "s") + ", for good.";
          /* the realm's monument: a castle piece nobody can buy */
          var trophy = null;
          try { if (window.SolBuild && SolBuild.grantTrophy) trophy = SolBuild.grantTrophy(rm.id); } catch (eT) {}
          this._trophy = trophy;
          if (trophy) this._fangNews += (this._fangNews ? " " : "") + "Fenrir's treasure: the " + trophy + " now stands in your castle — a monument only a Fenrir-beater can have.";
          else if (!had) { this.giveCoins(50, "Fenrir's treasure"); this._fangNews += " Fenrir's treasure: +50 coins (choose the Castle in the builder to collect Fenrir's monuments)."; }
        }
        if (perk(this, "charter")) { this.giveCoins(10, "Royal charter"); bonus.push("+10 from your town hall"); }
        if (perk(this, "harvest")) { this.giveCoins(5, "Harvest"); bonus.push("+5 from your mills"); }
      }
      var r = orig.apply(this, args);
      if (win) {
        try {
          var t = document.getElementById("win-title"), m = document.getElementById("win-msg");
          if (this.isBossLevel && t) {
            t.textContent = "Fenrir beaten — " + rm.name + " is free!";
            var nx = REALMS[this.realmIdx + 1];
            if (m) m.textContent = "Fenrir's chains are broken and the gate is open. " + (this._fangNews ? this._fangNews + " " : "") + (nx ? "Next realm: " + nx.name + ", " + nx.title + "." : "You beat Ragnarok!") + " " + m.textContent;
            this.showFangs();
          }
          if (m && bonus.length) m.textContent += " Castle and realm bonus: " + bonus.join(", ") + ".";
        } catch (e) {}
      }
      return r;
    });

    /* ── minimap: Fenrir always, the other creatures with the Lookout perk ── */
    wrap("drawMini", function (orig, args) {
      var r = orig.apply(this, args);
      try {
        var c = document.getElementById("minimap"); if (!c) return r;
        var ctx = c.getContext("2d"), sx = c.width / K.WORLD_W, sy = c.height / K.WORLD_H, i, f;
        if (perk(this, "lookout")) {
          for (i = 0; i < (this.foes || []).length; i++) {
            f = this.foes[i];
            if (f.kind === "valkyrie" && f.state !== "fly" && f.state !== "warn") continue;
            if (f.kind === "wisp" && f.gone > 0) continue;
            ctx.fillStyle = f.kind === "vent" ? (f.hurts ? "#ff7a2a" : "#6a3a24") : "#c86ad8";
            if (f.kind === "valkyrie") { ctx.fillStyle = "rgba(255,216,106,0.5)"; if (f.horiz) ctx.fillRect(0, f.line * sy - 2, c.width, 4); else ctx.fillRect(f.line * sx - 2, 0, 4, c.height); continue; }
            ctx.beginPath(); ctx.arc(f.x * sx, f.y * sy, 2.6, 0, Math.PI * 2); ctx.fill();
          }
        }
        if (this.fenrir) {
          ctx.fillStyle = "#ff3a2a"; ctx.beginPath(); ctx.arc(this.fenrir.x * sx, this.fenrir.y * sy, 4.2, 0, Math.PI * 2); ctx.fill();
        }
      } catch (e) {}
      return r;
    });
  }

  window.SolRealms = {
    REALMS: REALMS, realmOf: realmOf, realmIndex: realmIndex, isBoss: isBoss, levelInRealm: levelInRealm,
    install: install, stopAmbience: stopAmbience,
    sfx: SFX, blip: blip, hiss: hiss,
    _paintFloor: paintFloor, _ensureArt: ensureArt
  };
})();
