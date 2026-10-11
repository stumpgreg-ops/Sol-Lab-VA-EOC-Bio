(function (global) {
  var ctx = null;
  function ensure() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function tone(freq, dur, type, gain, delay) {
    var c = ensure();
    if (!c) return;
    var t = c.currentTime + (delay || 0);
    var o = c.createOscillator();
    var g = c.createGain();
    o.type = type || "square";
    o.frequency.setValueAtTime(freq, t);
    /* Gains bumped ~1.7–2× for Chromebook speakers / playtest audibility */
    g.gain.setValueAtTime(gain || 0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g);
    g.connect(c.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  }
  global.AfterHoursAudio = {
    unlock: ensure,
    startBeep: function () {
      tone(440, 0.07, "square", 0.16);
      tone(660, 0.09, "triangle", 0.14, 0.06);
    },
    grab: function () {
      tone(520, 0.09, "square", 0.20);
      tone(780, 0.07, "square", 0.14, 0.05);
    },
    alarm: function () {
      tone(880, 0.16, "square", 0.26);
      tone(220, 0.32, "sawtooth", 0.24, 0.08);
      tone(140, 0.26, "square", 0.20, 0.16);
    },
    /* v4.6: security camera alarm — ONE dissonant beep (~0.3 s). game.js loops it:
       beep, 1 s pause, beep, 1 s pause … while the camera alarm is live (refreshed
       while a camera has Sol, expires 6.5 s after she breaks the lock).
       Dissonance: Eb5 + A5 (a tritone) with an Eb6/E6 minor-second rub on top.
       Triangle/sine only — no square/sawtooth buzz. Measured ≈ -26 dB RMS, the
       middle ground between the old klaxon (-23) and the v4.3 bell (-31). */
    camBeep: function () {
      ensure();
      tone(622, 0.30, "triangle", 0.165);     /* Eb5 */
      tone(880, 0.30, "triangle", 0.15);      /* A5 — tritone against Eb */
      tone(1245, 0.14, "sine", 0.04);         /* Eb6 */
      tone(1318, 0.14, "sine", 0.035);        /* E6 — minor-second rub */
      tone(110, 0.26, "sine", 0.12);          /* low thump: weight */
    },
    catch: function () {
      tone(90, 0.26, "sawtooth", 0.28);
      tone(60, 0.32, "square", 0.22, 0.06);
    },
    extract: function () {
      tone(220, 0.09, "square", 0.14);
      tone(440, 0.11, "square", 0.14, 0.06);
      tone(660, 0.13, "triangle", 0.12, 0.14);
      tone(880, 0.20, "triangle", 0.12, 0.24);
    },
    /* Greg playtest: ALERT / chase-start beeps (no pack required) */
    alert: function () {
      tone(740, 0.10, "square", 0.24);
      tone(980, 0.12, "square", 0.20, 0.07);
      tone(620, 0.09, "sawtooth", 0.16, 0.14);
    },
    chaseStart: function () {
      /* engage-1919: slightly louder chase-start beep (TROG ICE polish) */
      tone(180, 0.11, "sawtooth", 0.34);
      tone(280, 0.13, "square", 0.29, 0.08);
      tone(140, 0.18, "sawtooth", 0.26, 0.16);
    },
    win: function () {
      tone(523, 0.1, "triangle", 0.12);
      tone(659, 0.12, "triangle", 0.12, 0.1);
      tone(784, 0.2, "triangle", 0.12, 0.2);
    },
    lose: function () {
      tone(196, 0.18, "sawtooth", 0.14);
      tone(130, 0.28, "square", 0.12, 0.12);
    },
    nearMiss: function () {
      tone(640, 0.05, "triangle", 0.08);
      tone(880, 0.06, "sine", 0.06, 0.04);
    },
    proximity: function () {
      tone(180, 0.07, "sine", 0.055);
      tone(140, 0.09, "triangle", 0.045, 0.06);
      tone(220, 0.05, "sine", 0.035, 0.12);
    },
    closeCall: function () {
      tone(720, 0.04, "sine", 0.07);
      tone(980, 0.07, "triangle", 0.06, 0.035);
      tone(520, 0.05, "sine", 0.04, 0.09);
    },
    heatCommit: function () {
      tone(410, 0.05, "triangle", 0.07);
      tone(560, 0.06, "sine", 0.055, 0.04);
    },
    /* Pac-Man power pellet: hall-pass / locker-power window */
    powerOn: function () {
      tone(392, 0.07, "square", 0.14);
      tone(523, 0.08, "square", 0.12, 0.06);
      tone(659, 0.10, "triangle", 0.11, 0.13);
      tone(784, 0.12, "triangle", 0.09, 0.22);
    },
    powerWarn: function () {
      /* engage-1720: slightly louder expiry one-shot */
      tone(659, 0.06, "square", 0.13);
      tone(523, 0.07, "square", 0.11, 0.06);
      tone(392, 0.10, "sawtooth", 0.10, 0.13);
    },
    /* engage-1720: EXPIRY TICK — short sharp ascending chirp (Pac-Man end / Lady Bug rim) */
    expiryTick: function () {
      tone(880, 0.028, "square", 0.16);
      tone(1180, 0.035, "triangle", 0.14, 0.022);
      tone(1480, 0.030, "sine", 0.10, 0.048);
    },
    /* Pac-Man fruit bonus: richer synth chime (distinct from letter grab / powerOn) */
    fruitChime: function () {
      tone(523, 0.06, "triangle", 0.14);
      tone(659, 0.07, "triangle", 0.13, 0.05);
      tone(784, 0.08, "sine", 0.12, 0.11);
      tone(1047, 0.12, "triangle", 0.10, 0.18);
      tone(880, 0.10, "sine", 0.08, 0.28);
    },
    /* engage-1652: Pac-Man role-flip / frightened kick (HALL PASS on) */
    roleFlip: function () {
      tone(520, 0.06, "square", 0.16);
      tone(392, 0.08, "sawtooth", 0.14, 0.05);
      tone(262, 0.10, "triangle", 0.12, 0.12);
      tone(196, 0.14, "sine", 0.10, 0.20);
    },
    roleRecover: function () {
      tone(330, 0.05, "square", 0.12);
      tone(440, 0.07, "triangle", 0.10, 0.05);
      tone(554, 0.09, "sine", 0.08, 0.11);
    },
    /* Soft sprint footstep tick (Chromebook-safe) */
    footstep: function () {
      tone(95, 0.035, "sine", 0.045);
      tone(140, 0.028, "triangle", 0.030, 0.018);
    },
    /* engage-1751: CRUISE ELROY — Blinky heat kick when evidence left drops */
    elroyKick: function () {
      tone(220, 0.07, "sawtooth", 0.18);
      tone(330, 0.08, "square", 0.16, 0.05);
      tone(440, 0.10, "sawtooth", 0.14, 0.12);
      tone(554, 0.12, "triangle", 0.12, 0.20);
    },
    elroyPulse: function () {
      tone(185, 0.04, "sawtooth", 0.10);
      tone(247, 0.05, "square", 0.08, 0.03);
    },
    /* engage-1824: LOCK SHUTTER — Lock 'n' Chase temporary fire gates */
    shutterClang: function () {
      tone(90, 0.07, "sawtooth", 0.16);
      tone(160, 0.09, "square", 0.15, 0.04);
      tone(240, 0.08, "square", 0.12, 0.10);
    },
    shutterWarn: function () {
      tone(1320, 0.035, "square", 0.14);
      tone(980, 0.030, "triangle", 0.10, 0.028);
    },
    shutterOpen: function () {
      tone(280, 0.06, "triangle", 0.10);
      tone(190, 0.08, "sine", 0.08, 0.05);
      tone(120, 0.10, "triangle", 0.06, 0.11);
    },
    /* engage-1855: TURNSTILE — Lady Bug swing-gate click / thud */
    turnstileClick: function () {
      tone(420, 0.035, "square", 0.14);
      tone(280, 0.045, "triangle", 0.12, 0.025);
      tone(180, 0.055, "sine", 0.08, 0.055);
    },
    turnstileThud: function () {
      tone(90, 0.06, "sawtooth", 0.12);
      tone(60, 0.08, "sine", 0.08, 0.04);
    },
    /* engage-1919: TROG ICE — freezer ice pack pickup / freeze / thaw */
    iceCrack: function () {
      tone(980, 0.05, "square", 0.22);
      tone(1320, 0.06, "triangle", 0.18, 0.03);
      tone(720, 0.08, "sawtooth", 0.14, 0.07);
      tone(1600, 0.04, "sine", 0.10, 0.10);
    },
    iceFreeze: function () {
      tone(220, 0.18, "sine", 0.16);
      tone(277, 0.22, "triangle", 0.14, 0.04);
      tone(330, 0.26, "sine", 0.12, 0.10);
      tone(165, 0.30, "triangle", 0.10, 0.16);
    },
    iceThaw: function () {
      tone(523, 0.06, "triangle", 0.16);
      tone(659, 0.08, "sine", 0.14, 0.05);
      tone(784, 0.10, "triangle", 0.12, 0.12);
    },
    /* engage-2057: HOT FOOT — Trog red-root quiet speed zip */
    hotFootZip: function () {
      tone(260, 0.05, "sawtooth", 0.14);
      tone(420, 0.07, "triangle", 0.16, 0.03);
      tone(680, 0.09, "sine", 0.14, 0.07);
      tone(880, 0.06, "square", 0.10, 0.12);
    },
    /* engage-2128: SECTION SEAL — Maze Runner closing fire door */
    sectionSealWarn: function () {
      tone(740, 0.04, "square", 0.12);
      tone(520, 0.05, "triangle", 0.10, 0.03);
    },
    sectionSealClang: function () {
      tone(70, 0.09, "sawtooth", 0.18);
      tone(140, 0.10, "square", 0.16, 0.04);
      tone(210, 0.08, "square", 0.12, 0.11);
    },
    sectionSealOpen: function () {
      tone(300, 0.06, "triangle", 0.10);
      tone(200, 0.08, "sine", 0.08, 0.05);
      tone(130, 0.10, "triangle", 0.06, 0.11);
    },
    /* engage-1833: STAIR CUT — Mouse Trap IN whoosh */
    heartChime: function () {
      tone(660, 0.07, "sine", 0.07, 0);
      tone(880, 0.09, "triangle", 0.06, 0.05);
      tone(1175, 0.12, "sine", 0.05, 0.11);
    },
    smashChain: function (n) {
      ensure();
      var step = Math.max(0, Math.min(3, n || 0));
      tone(520 + step * 90, 0.07, "square", 0.05, 0);
      tone(720 + step * 110, 0.09, "triangle", 0.045, 0.05);
      if (step >= 2) tone(980, 0.12, "sine", 0.04, 0.1);
    },
    /* engage-2313: MONEY BAG — Lock 'n' Chase soft gold chime */
    moneyBagChime: function () {
      tone(392, 0.07, "triangle", 0.12);
      tone(523, 0.09, "sine", 0.14, 0.04);
      tone(659, 0.11, "triangle", 0.12, 0.09);
      tone(784, 0.08, "sine", 0.10, 0.15);
    },
    /* engage-0232: BAG STREAK — vault doubling pitch climbs with streak (0..3) */
    bagStreak: function (n) {
      ensure();
      var step = Math.max(0, Math.min(3, n || 0));
      tone(392 + step * 40, 0.06, "triangle", 0.12);
      tone(523 + step * 50, 0.08, "sine", 0.13, 0.04);
      tone(659 + step * 60, 0.10, "triangle", 0.11, 0.09);
      tone(784 + step * 70, 0.12, "sine", 0.10, 0.14);
      if (step >= 2) tone(988 + step * 40, 0.10, "triangle", 0.08, 0.18);
    },
    /* engage-0006: HORSESHOE — Trog yellow horseshoe forcefield bright chime */
    horseshoeChime: function () {
      tone(523, 0.06, "sine", 0.11);
      tone(784, 0.08, "triangle", 0.12, 0.04);
      tone(988, 0.10, "sine", 0.10, 0.09);
      tone(1175, 0.07, "triangle", 0.08, 0.15);
    },
    /* engage-0055: VEGGIE — Lady Bug vegetable bright chime */
    veggieChime: function () {
      tone(392, 0.06, "triangle", 0.11);
      tone(523, 0.08, "sine", 0.12, 0.05);
      tone(659, 0.10, "triangle", 0.11, 0.10);
      tone(784, 0.12, "sine", 0.10, 0.16);
    },
    /* engage-0115: IVY GRIP — Maze Runner ivy wall-phase soft chime */
    ivyGripChime: function () {
      tone(349, 0.06, "triangle", 0.11);
      tone(440, 0.08, "sine", 0.12, 0.04);
      tone(523, 0.10, "triangle", 0.11, 0.09);
      tone(659, 0.12, "sine", 0.09, 0.15);
    },
    /* engage-0148: CAGE SCORE — Lock 'n' Chase trap-cop bonus clang */
    cageChime: function (n) {
      ensure();
      var step = Math.max(0, Math.min(3, (n || 1) - 1));
      tone(180 + step * 40, 0.07, "square", 0.14);
      tone(260 + step * 50, 0.08, "sawtooth", 0.12, 0.04);
      tone(520 + step * 80, 0.10, "triangle", 0.10, 0.09);
      if (step >= 1) tone(784, 0.08, "sine", 0.08, 0.14);
    },
    /* engage-0028: SCATTER WAVE — soft reverse / peel chirp */
    scatterWave: function () {
      tone(440, 0.05, "triangle", 0.10);
      tone(330, 0.07, "sine", 0.12, 0.04);
      tone(262, 0.09, "triangle", 0.10, 0.09);
      tone(196, 0.08, "sine", 0.08, 0.14);
    },
    /* engage-0208: PEN HOLD — soft pen gate thump when a second+ Hati waits */
    penHold: function () {
      ensure();
      tone(140, 0.08, "square", 0.10);
      tone(110, 0.10, "triangle", 0.12, 0.05);
      tone(90, 0.12, "sine", 0.08, 0.10);
    },
    penNudge: function () {
      ensure();
      tone(320, 0.05, "triangle", 0.10);
      tone(420, 0.06, "sine", 0.09, 0.04);
    },
    penExit: function () {
      ensure();
      tone(260, 0.05, "sawtooth", 0.08);
      tone(380, 0.07, "triangle", 0.10, 0.04);
      tone(520, 0.06, "sine", 0.08, 0.09);
    },
    /* engage-0255: SKULL — Lady Bug poison skull kill bait */
    skullChime: function () {
      ensure();
      tone(180, 0.07, "square", 0.12);
      tone(240, 0.09, "sawtooth", 0.10, 0.04);
      tone(360, 0.08, "triangle", 0.09, 0.09);
      tone(120, 0.12, "sine", 0.08, 0.14);
    },
    /* engage-0325: 1UP — Pac-Man bonus life at 10k juice */
    oneUp: function () {
      ensure();
      tone(520, 0.06, "square", 0.10);
      tone(660, 0.08, "triangle", 0.12, 0.05);
      tone(880, 0.10, "sine", 0.14, 0.10);
      tone(1040, 0.12, "sine", 0.10, 0.16);
    },
    /* engage-0559: EXTRA letter chip — soft ascending chime */
    extraLetterChime: function () {
      ensure();
      tone(440, 0.05, "triangle", 0.09);
      tone(554, 0.06, "sine", 0.10, 0.04);
      tone(660, 0.07, "triangle", 0.11, 0.08);
      tone(880, 0.08, "sine", 0.09, 0.13);
    },
    /* engage-0559: EXTRA complete — spare life (cousin of oneUp, different pitches) */
    extraComplete: function () {
      ensure();
      tone(480, 0.06, "square", 0.10);
      tone(600, 0.08, "triangle", 0.12, 0.05);
      tone(760, 0.10, "sine", 0.14, 0.10);
      tone(960, 0.12, "sine", 0.11, 0.16);
      tone(1200, 0.10, "triangle", 0.08, 0.22);
    },
    /* engage-1036: SPECIAL letter chip — soft red-window chime */
    specialLetterChime: function () {
      ensure();
      tone(392, 0.05, "triangle", 0.09);
      tone(494, 0.06, "sine", 0.10, 0.04);
      tone(587, 0.07, "triangle", 0.11, 0.08);
      tone(740, 0.08, "sine", 0.09, 0.13);
    },
    /* engage-1036: SPECIAL complete — jackpot + freeze (cousin of extraComplete) */
    specialComplete: function () {
      ensure();
      tone(330, 0.07, "square", 0.11);
      tone(440, 0.08, "triangle", 0.12, 0.05);
      tone(554, 0.10, "sine", 0.14, 0.10);
      tone(698, 0.12, "sine", 0.12, 0.16);
      tone(880, 0.10, "triangle", 0.09, 0.22);
      tone(1100, 0.08, "sine", 0.07, 0.28);
    },
    /* engage-0729: PINEAPPLE — Trog smash pickup */
    pineappleChime: function () {
      ensure();
      tone(220, 0.07, "sawtooth", 0.12);
      tone(330, 0.08, "square", 0.11, 0.04);
      tone(440, 0.10, "triangle", 0.13, 0.09);
      tone(550, 0.12, "sine", 0.10, 0.15);
      tone(180, 0.10, "sawtooth", 0.08, 0.20);
    },
    /* engage-0846: SPRING FAN — Trog springboard dash whoosh */
    springWhoosh: function () {
      ensure();
      tone(180, 0.06, "sawtooth", 0.12);
      tone(320, 0.08, "triangle", 0.14, 0.03);
      tone(520, 0.10, "sine", 0.12, 0.07);
      tone(780, 0.08, "triangle", 0.09, 0.12);
      tone(240, 0.10, "sine", 0.08, 0.16);
    },
    /* engage-1006: COLOR DOORS — Mouse Trap colored door flip */
    colorDoorClang: function () {
      ensure();
      tone(160, 0.06, "square", 0.12);
      tone(240, 0.07, "triangle", 0.11, 0.03);
      tone(110, 0.09, "sawtooth", 0.09, 0.07);
      tone(320, 0.06, "sine", 0.08, 0.12);
    },
    colorDoorOpen: function () {
      ensure();
      tone(280, 0.05, "triangle", 0.09);
      tone(200, 0.07, "sine", 0.08, 0.04);
      tone(360, 0.06, "triangle", 0.07, 0.08);
    },
    /* engage-0648: LOCK GATE — Lock 'n' Chase player door seal */
    lockGateClang: function () {
      ensure();
      tone(140, 0.07, "square", 0.12);
      tone(220, 0.08, "triangle", 0.11, 0.03);
      tone(90, 0.10, "sawtooth", 0.09, 0.08);
    },
    lockGateOpen: function () {
      ensure();
      tone(260, 0.05, "triangle", 0.09);
      tone(180, 0.07, "sine", 0.08, 0.04);
    },
    /* engage-0619: STAGE TREASURE — Lock 'n' Chase vault chime */
    treasureChime: function () {
      ensure();
      tone(300, 0.06, "triangle", 0.10);
      tone(450, 0.07, "sine", 0.11, 0.04);
      tone(600, 0.08, "triangle", 0.12, 0.08);
      tone(750, 0.10, "sine", 0.10, 0.13);
      tone(900, 0.08, "square", 0.08, 0.18);
    },
    /* engage-0346: DOG BONE — Mouse Trap bank chime */
    dogBoneChime: function () {
      ensure();
      tone(300, 0.06, "triangle", 0.11);
      tone(420, 0.08, "sine", 0.12, 0.04);
      tone(540, 0.09, "triangle", 0.10, 0.09);
    },
    /* engage-0346: DOG activate — barky smash window */
    /* engage-0416: CHILI FIRE — Trog chilli pickup */
    chiliChime: function () {
      ensure();
      tone(220, 0.06, "sawtooth", 0.11);
      tone(340, 0.08, "square", 0.10, 0.04);
      tone(480, 0.09, "triangle", 0.11, 0.09);
      tone(160, 0.10, "sine", 0.08, 0.14);
    },
    /* engage-0416: CHILI burn pulse */
    chiliBurn: function () {
      ensure();
      tone(160, 0.07, "sawtooth", 0.13);
      tone(240, 0.08, "square", 0.11, 0.03);
      tone(420, 0.06, "triangle", 0.09, 0.08);
    },
    dogActivate: function () {
      ensure();
      tone(180, 0.07, "sawtooth", 0.12);
      tone(260, 0.08, "square", 0.11, 0.04);
      tone(380, 0.10, "triangle", 0.12, 0.09);
      tone(520, 0.08, "sine", 0.09, 0.14);
    },
    /* engage-1059: SUPER PAC — Super Pac-Man giant chime */
    superPacChime: function () {
      ensure();
      tone(220, 0.07, "square", 0.11);
      tone(330, 0.08, "triangle", 0.12, 0.04);
      tone(440, 0.10, "sine", 0.13, 0.09);
      tone(660, 0.12, "triangle", 0.11, 0.15);
      tone(880, 0.10, "sine", 0.09, 0.22);
    },
    superGateCrash: function () {
      ensure();
      tone(120, 0.08, "sawtooth", 0.13);
      tone(200, 0.07, "square", 0.11, 0.03);
      tone(360, 0.09, "triangle", 0.10, 0.08);
      tone(90, 0.10, "sine", 0.08, 0.12);
    },
    /* engage-1133: ZAP PAD — Trog electric buzz (noise+square) */
    zapBuzz: function () {
      ensure();
      tone(90, 0.05, "sawtooth", 0.10);
      tone(180, 0.06, "square", 0.11, 0.02);
      tone(240, 0.07, "square", 0.09, 0.05);
      tone(140, 0.08, "triangle", 0.08, 0.08);
      tone(60, 0.09, "sine", 0.07, 0.10);
    },
    /* engage-1212: MUSHROOM — Trog gray mushroom dull thud (Sol-only slow) */
    mushThud: function () {
      ensure();
      tone(70, 0.08, "sine", 0.11);
      tone(55, 0.10, "triangle", 0.10, 0.03);
      tone(90, 0.07, "sine", 0.08, 0.06);
      tone(45, 0.12, "sine", 0.07, 0.09);
    },
    /* engage-1240: STONE WHEEL — Trog rolling stone rumble */
    wheelRumble: function () {
      ensure();
      tone(50, 0.10, "sawtooth", 0.09);
      tone(38, 0.14, "sine", 0.11, 0.02);
      tone(65, 0.08, "triangle", 0.08, 0.05);
      tone(28, 0.16, "sine", 0.07, 0.08);
      tone(90, 0.05, "square", 0.05, 0.10);
    },
    /* engage-1302: FIRE PIT — Trog shared fire crackle */
    fireCrackle: function () {
      ensure();
      tone(110, 0.06, "sawtooth", 0.10);
      tone(180, 0.07, "square", 0.09, 0.02);
      tone(90, 0.09, "triangle", 0.10, 0.05);
      tone(220, 0.06, "sawtooth", 0.08, 0.08);
      tone(55, 0.11, "sine", 0.07, 0.10);
    },
    /* engage-1342: TAR PIT — Trog sticky tar squish */
    tarSquish: function () {
      ensure();
      tone(45, 0.10, "sine", 0.12);
      tone(70, 0.12, "triangle", 0.10, 0.03);
      tone(35, 0.14, "sine", 0.09, 0.06);
      tone(55, 0.08, "sawtooth", 0.06, 0.10);
      tone(28, 0.16, "sine", 0.07, 0.12);
    },
    /* engage-1350: AUTO GREEN — Lock n Chase auto door clang / open */
    autoGreenClang: function () {
      ensure();
      tone(160, 0.07, "square", 0.10);
      tone(110, 0.10, "sawtooth", 0.09, 0.02);
      tone(220, 0.06, "triangle", 0.08, 0.05);
      tone(80, 0.12, "sine", 0.08, 0.07);
    },
    autoGreenOpen: function () {
      ensure();
      tone(240, 0.06, "triangle", 0.08);
      tone(320, 0.07, "sine", 0.07, 0.02);
      tone(180, 0.09, "triangle", 0.06, 0.05);
    },
    /* engage-1427: MASK — Maze Runner LOS cloak whoosh */
    maskWhoosh: function () {
      ensure();
      tone(220, 0.05, "sine", 0.08);
      tone(330, 0.07, "triangle", 0.10, 0.03);
      tone(440, 0.08, "sine", 0.09, 0.07);
      tone(280, 0.10, "triangle", 0.07, 0.12);
      tone(160, 0.08, "sine", 0.06, 0.18);
    },
    /* engage-1443: SIGNAL MAST — Maze Runner noise decoy horn */
    signalHorn: function () {
      ensure();
      tone(180, 0.08, "sawtooth", 0.11);
      tone(240, 0.10, "square", 0.10, 0.04);
      tone(140, 0.12, "triangle", 0.09, 0.08);
      tone(90, 0.14, "sine", 0.08, 0.12);
      tone(320, 0.06, "square", 0.06, 0.16);
    },
    /* engage-1526: SHINY EGG — Trog sparkle chime + warp whoosh */
    shinyChime: function () {
      ensure();
      tone(520, 0.06, "sine", 0.09);
      tone(660, 0.07, "triangle", 0.10, 0.03);
      tone(780, 0.08, "sine", 0.08, 0.07);
      tone(440, 0.06, "triangle", 0.06, 0.12);
    },
    shinyWarp: function () {
      ensure();
      tone(180, 0.08, "sawtooth", 0.10);
      tone(320, 0.10, "triangle", 0.11, 0.04);
      tone(480, 0.12, "sine", 0.10, 0.08);
      tone(240, 0.10, "square", 0.07, 0.14);
      tone(600, 0.08, "sine", 0.08, 0.18);
    },
  };
  /* Chromebook autoplay: unlock on first pointer / key / touch anywhere */
  function unlockOnce() {
    try { ensure(); } catch (e) {}
  }
  if (typeof document !== "undefined") {
    ["pointerdown", "keydown", "touchstart", "mousedown"].forEach(function (ev) {
      document.addEventListener(ev, unlockOnce, { once: false, passive: true });
    });
  }
})(window);
