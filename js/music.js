/* SOL Labyrinth — background music manager (window.SolMusic)
 *
 * Built on HTMLAudioElement, NOT Phaser sound, so music can run on the DOM
 * title / skill / builder screens before the Phaser game exists.
 * Plain ES5, one IIFE, one global, no build step, no dependencies.
 *
 * Chrome autoplay: nothing plays until the first user gesture. play() calls
 * made before that are queued (file pre-loaded) and start on unlock(), which
 * self-registers on document pointerdown / keydown / touchstart.
 *
 * Volume model: el.volume = baseVol * duckMul * channel.level. "level" is the
 * crossfade envelope (0..1) driven by ONE setInterval that stops when idle.
 */
(function (global) {
  "use strict";

  /* ── Track table — edit keys / paths / labels here ───────────────────── */
  var TRACKS = {
    "gloomy-piano":  { file: "assets/music/gloomy-piano.mp3",  name: "Gloomy Piano · suspense" },
    "electricity":   { file: "assets/music/electricity.mp3",   name: "Electricity · tense" },
    "boss-fight":    { file: "assets/music/boss-fight.mp3",    name: "Boss Fight Piano · intense" },
    "spring-forest": { file: "assets/music/spring-forest.mp3", name: "Spring Forest Piano · gentle" },
    "chill-1":       { file: "assets/music/chill-1.mp3",       name: "Chill Vibe 1 · lo-fi hip hop" },
    "chill-2":       { file: "assets/music/chill-2.mp3",       name: "Chill Vibe 2 · lo-fi hip hop" },
    "chill-3":       { file: "assets/music/chill-3.mp3",       name: "Chill Vibe 3 · lo-fi hip hop" },
    "chill-4":       { file: "assets/music/chill-4.mp3",       name: "Chill Vibe 4 · lo-fi hip hop" },
    "jazz-1":        { file: "assets/music/jazz-1.mp3",        name: "Jazz Piano · upbeat" }
  };
  /* Role aliases accepted by play(): the title screen, the builder, and the chase override. */
  var ROLES = { menu: "chill-1", builder: "jazz-1", chase: "boss-fight" };
  var CHASE_KEY = ROLES.chase;
  /* "Surprise me" rotation for nights (Greg: suspense), by wing of ten nights. */
  var SUSPENSE_CYCLE = ["gloomy-piano", "electricity"];
  /* Fallback order when a file 404s. */
  var CALM_CYCLE = ["gloomy-piano", "electricity", "spring-forest", "chill-2", "chill-3", "chill-4", "chill-1", "jazz-1"];
  var LS_PICK = "afterHours.v1.musicPick";    /* "auto" | track key | "off" — the student's choice */

  var LS_MUTE = "afterHours.v1.music";        /* "on" | "off" */
  var LS_VOL = "afterHours.v1.musicVol";      /* "0".."1" */
  var DEFAULT_VOL = 0.55;
  var FADE_MS = 900;            /* default crossfade */
  var DUCK_MS = 300;            /* duck ramp */
  var DUCK_LEVEL = 0.25;        /* multiplier while the reading pop-up is open */
  var CHASE_DEBOUNCE_MS = 400;  /* ignore chase flips shorter than this */
  var MAX_CHANNELS = 4;         /* hard cap on Audio elements (reused) */
  var TICK_MS = 33;             /* fade engine period */
  var HALT_WHEN_HIDDEN = true;  /* pause on tab hide, resume on show */

  /* ── State ───────────────────────────────────────────────────────────── */
  var unlocked = false;
  var pending = null;      /* {key, fade} requested before the first gesture */
  var pool = [];           /* channels: {el, key, level, from, to, at, dur, done} */
  var current = null;      /* channel that is "the music" right now */
  var held = null;         /* calm channel parked (paused) while chase plays */
  var sceneKey = null;     /* last non-chase key asked for (menu/calm/builder) */
  var prevSceneKey = null; /* the one before that — for back() */
  var dead = {};           /* key -> true once its file failed to load */
  var muted = false;
  var baseVol = DEFAULT_VOL;
  var duckMul = 1, duckFrom = 1, duckTo = 1, duckAt = 0;
  var chaseWant = false, chaseApplied = false, chaseTimer = null;
  var timer = null;
  var buttons = [];

  function now() { return Date.now(); }
  function warn(a, b) { try { console.warn("[SOL music]", a, b || ""); } catch (e) {} }
  function clamp01(v) { v = Number(v); return v > 1 ? 1 : (v >= 0 ? v : 0); }

  /* ── Channels (Audio element pool) ───────────────────────────────────── */
  function makeChannel() {
    var ch = { el: null, key: null, level: 0, from: 0, to: 0, at: 0, dur: 0, done: null };
    try {
      ch.el = new Audio();
      ch.el.preload = "auto";
      ch.el.loop = true;
      ch.el.addEventListener("error", function () {
        /* code 1 = MEDIA_ERR_ABORTED (we changed src mid-load) — not a dead file */
        var err = ch.el && ch.el.error;
        if (err && err.code === 1) return;
        onDead(ch);
      });
    } catch (e) { ch.el = { paused: true, play: function () {}, pause: function () {}, load: function () {} }; }
    pool.push(ch);
    return ch;
  }
  function isBusy(ch) { return ch === current || ch === held; }
  function silence(ch) {
    try { ch.el.pause(); } catch (e) {}
    ch.level = 0; ch.dur = 0; ch.done = null; applyVol(ch);
  }
  /* Pick a channel for `key`: same-key channel (resumes its position) > idle
     channel > new element (<= MAX_CHANNELS) > steal the quietest one. */
  function acquire(key) {
    var i, ch, best = null;
    for (i = 0; i < pool.length; i++) { ch = pool[i]; if (!isBusy(ch) && ch.key === key) return ch; }
    for (i = 0; i < pool.length; i++) {
      ch = pool[i];
      if (!isBusy(ch) && (ch.key === null || (ch.el.paused && ch.level === 0))) return ch;
    }
    if (pool.length < MAX_CHANNELS) return makeChannel();
    for (i = 0; i < pool.length; i++) { ch = pool[i]; if (!isBusy(ch) && (!best || ch.level < best.level)) best = ch; }
    if (!best) best = pool[0];
    silence(best);
    return best;
  }
  function load(ch, key) {
    if (ch.key === key) return true;
    try {
      ch.el.pause();
      ch.key = key; ch.level = 0; ch.dur = 0; ch.done = null;
      ch.el.src = TRACKS[key].file;
      ch.el.loop = true;
      ch.el.load();
      return true;
    } catch (e) { onDead(ch); return false; }
  }
  function applyVol(ch) {
    var v = baseVol * duckMul * ch.level;
    try { ch.el.volume = v > 1 ? 1 : (v > 0 ? v : 0); } catch (e) {}
  }
  /* el.play() with every failure mode handled: blocked -> re-queue for the
     next gesture; unsupported/404 -> mark dead and fall back. */
  function startPlayback(ch) {
    var p, key = ch.key;
    if (muted) return;
    try { applyVol(ch); p = ch.el.play(); } catch (e) { onDead(ch); return; }
    if (p && p.then) {
      p.then(null, function (err) {
        var name = (err && err.name) || "";
        if (name === "NotAllowedError") { unlocked = false; pending = { key: ch.key, fade: FADE_MS }; return; }
        /* Only a real media error on the same track counts; a rejection that
           arrives after the element was re-pointed at another file is stale. */
        if (name !== "AbortError" && ch.key === key && ch.el.error) onDead(ch);
      });
    }
  }
  function pauseAll() { var i; for (i = 0; i < pool.length; i++) { try { pool[i].el.pause(); } catch (e) {} } }
  function resumeAll() { if (unlocked && current) startPlayback(current); }

  /* ── Fade engine: one interval, runs only while something is moving ──── */
  function ease(p) { return p * p * (3 - 2 * p); }
  function kick() { if (!timer) timer = setInterval(tick, TICK_MS); }
  function fade(ch, to, ms, done) {
    ch.from = ch.level; ch.to = to; ch.at = now(); ch.dur = ms > 0 ? ms : 0; ch.done = done || null;
    if (!ch.dur) { ch.level = to; applyVol(ch); if (done) done(ch); return; }
    kick();
  }
  function pauseWhenSilent(c) { try { c.el.pause(); } catch (e) {} }
  function fadeOut(ch, ms) { fade(ch, 0, ms, pauseWhenSilent); }
  function tick() {
    var t = now(), i, ch, p, d, busy = false;
    if (duckMul !== duckTo) {
      p = (t - duckAt) / DUCK_MS;
      if (p >= 1) duckMul = duckTo; else { duckMul = duckFrom + (duckTo - duckFrom) * p; busy = true; }
      for (i = 0; i < pool.length; i++) applyVol(pool[i]);
    }
    for (i = 0; i < pool.length; i++) {
      ch = pool[i];
      if (!ch.dur) continue;
      p = (t - ch.at) / ch.dur;
      if (p >= 1) {
        ch.level = ch.to; ch.dur = 0; applyVol(ch);
        if (ch.done) { d = ch.done; ch.done = null; d(ch); }
      } else { ch.level = ch.from + (ch.to - ch.from) * ease(p); applyVol(ch); busy = true; }
    }
    if (!busy) { clearInterval(timer); timer = null; }
  }

  /* ── Dead-file fallback ──────────────────────────────────────────────── */
  /* Returns a playable key: `key` itself, or the next calm track that is not
     dead (menu/builder fall back to the calm cycle; chase has no substitute). */
  function resolve(key) {
    var i, start, k;
    if (ROLES[key]) key = ROLES[key];
    if (!TRACKS[key]) { warn("unknown track key", key); return null; }
    if (!dead[key]) return key;
    if (key === CHASE_KEY) return null;
    start = CALM_CYCLE.indexOf(key);
    for (i = 1; i <= CALM_CYCLE.length; i++) {
      k = CALM_CYCLE[(start + i) % CALM_CYCLE.length];
      if (!dead[k]) return k;
    }
    return null;
  }
  function onDead(ch) {
    var key = ch.key;
    if (!key || dead[key]) return;
    dead[key] = true;
    warn("track failed to load, skipping: " + key, TRACKS[key] && TRACKS[key].file);
    silence(ch); ch.key = null;
    /* Fall back on a fresh tick: right after the "error" event the browser
       rejects this element's pending play() promises, so a play() issued
       from inside the handler would be rejected too and look dead as well. */
    setTimeout(function () { fallbackFrom(ch, key); }, 0);
  }
  function fallbackFrom(ch, key) {
    var fb;
    if (pending && pending.key === key) pending.key = resolve(key);
    if (key === CHASE_KEY) {
      if (chaseApplied) { chaseApplied = false; if (current === ch) current = null; if (sceneKey) swapTo(sceneKey, FADE_MS, true); }
      return;
    }
    fb = resolve(key);
    if (sceneKey === key) sceneKey = fb;
    if (ch === held) { held = null; if (fb) { held = acquire(fb); load(held, fb); } }
    else if (ch === current) { current = null; if (fb) swapTo(fb, FADE_MS, false); }
  }

  /* ── Core switch: crossfade current -> key ───────────────────────────── */
  function swapTo(key, fadeMs, resume) {
    var old = current, ch;
    key = resolve(key);
    if (!key) return;
    if (old && old.key === key) {           /* already playing: make sure it is up */
      if (old.el.paused) startPlayback(old);
      if (old.dur ? old.to !== 1 : old.level !== 1) fade(old, 1, fadeMs);
      return;
    }
    if (held && resume && held.key === key) { ch = held; held = null; }
    else {
      if (resume && held) { silence(held); held = null; }
      ch = acquire(key);
      if (!load(ch, key)) return;
    }
    current = ch;
    startPlayback(ch);
    fade(ch, 1, fadeMs);
    if (old) fadeOut(old, fadeMs);
  }

  /* ── Public: play / back / stop ──────────────────────────────────────── */
  function play(key, opts) {
    var fadeMs = (opts && opts.fade != null) ? Number(opts.fade) : FADE_MS;
    if (key == null || key === "off") { stop(opts); return; }   /* "No music" */
    key = resolve(key);
    if (!key) return;
    if (key !== CHASE_KEY && key !== sceneKey) { prevSceneKey = sceneKey; sceneKey = key; }
    if (!unlocked) { pending = { key: key, fade: fadeMs }; load(acquire(key), key); return; }
    if (chaseApplied && key !== CHASE_KEY) {   /* chase owns the speakers: stage it in the held slot */
      if (!held) held = acquire(key);
      if (held.key !== key) { silence(held); load(held, key); }
      return;
    }
    swapTo(key, fadeMs, false);
  }
  function back(opts) { play(prevSceneKey || "menu", opts); }
  function stop(opts) {
    var i, fadeMs = (opts && opts.fade != null) ? Number(opts.fade) : FADE_MS;
    if (chaseTimer) { clearTimeout(chaseTimer); chaseTimer = null; }
    chaseWant = false; chaseApplied = false; pending = null;
    for (i = 0; i < pool.length; i++) fadeOut(pool[i], fadeMs);
    current = null; held = null; sceneKey = null; prevSceneKey = null;
  }

  /* ── Chase (debounced) ───────────────────────────────────────────────── */
  function applyChase(on) {
    if (on === chaseApplied) return;
    if (on && dead[CHASE_KEY]) return;   /* no chase file: calm just keeps playing */
    if (on && getPick() === "off") return;   /* "No music" stays silent during chases too */
    chaseApplied = on;
    if (!unlocked) return;             /* unlock() re-applies from chaseApplied */
    if (on) {
      if (current && current.key !== CHASE_KEY) { held = current; current = null; fadeOut(held, FADE_MS); }
      swapTo(CHASE_KEY, FADE_MS, false);
    } else if (sceneKey) {
      swapTo(sceneKey, FADE_MS, true);
    } else if (current) { fadeOut(current, FADE_MS); current = null; }
  }
  /* Cheap enough to call every frame: same value returns immediately. */
  function setChase(on) {
    on = !!on;
    if (on === chaseWant) return;
    chaseWant = on;
    if (chaseTimer) { clearTimeout(chaseTimer); chaseTimer = null; }
    if (on === chaseApplied) return;   /* flipped back before the debounce fired */
    chaseTimer = setTimeout(function () {
      chaseTimer = null;
      if (chaseWant !== chaseApplied) applyChase(chaseWant);
    }, CHASE_DEBOUNCE_MS);
  }

  /* ── Duck / mute / volume ────────────────────────────────────────────── */
  function duck(on) {
    var to = on ? DUCK_LEVEL : 1;
    if (to === duckTo) return;
    duckFrom = duckMul; duckTo = to; duckAt = now(); kick();
  }
  function setMuted(b) {
    b = !!b;
    if (b !== muted) {
      muted = b;
      try { localStorage.setItem(LS_MUTE, muted ? "off" : "on"); } catch (e) {}
      if (muted) pauseAll(); else resumeAll();
    }
    refreshButtons();
  }
  function toggleMuted() { setMuted(!muted); return muted; }
  function isMuted() { return muted; }
  function setVolume(v) {
    var i;
    baseVol = clamp01(v);
    try { localStorage.setItem(LS_VOL, String(baseVol)); } catch (e) {}
    for (i = 0; i < pool.length; i++) applyVol(pool[i]);
  }
  function getVolume() { return baseVol; }

  /* ── Unlock (first gesture) ──────────────────────────────────────────── */
  function unlock() {
    var p;
    if (unlocked) return;
    unlocked = true;
    p = pending; pending = null;
    if (p && p.key) swapTo(p.key, p.fade, false);
    else if (sceneKey && !current) swapTo(sceneKey, FADE_MS, false);
    if (chaseApplied) { chaseApplied = false; applyChase(true); }
  }

  /* ── The student's pick (skill screen): "auto" = suspense rotation, a track key, or "off" */
  function getPick() {
    var p = "auto";
    try { p = localStorage.getItem(LS_PICK) || "auto"; } catch (e) {}
    if (p !== "auto" && p !== "off" && !TRACKS[p]) p = "auto";
    return p;
  }
  function setPick(p) {
    if (p !== "auto" && p !== "off" && !TRACKS[p]) p = "auto";
    try { localStorage.setItem(LS_PICK, p); } catch (e) {}
    return p;
  }
  /* Track for a night: honours the pick; "auto" alternates the two suspense tracks by wing of ten nights.
     Returns null for "off" (play(null) fades everything out). */
  function calmFor(night) {
    var pick = getPick(), n;
    if (pick === "off") return null;
    if (pick !== "auto") return pick;
    n = Math.floor(Number(night));
    if (!(n > 0)) n = 1;
    return SUSPENSE_CYCLE[Math.floor((n - 1) / 10) % SUSPENSE_CYCLE.length];
  }

  /* ── Mute button wiring ──────────────────────────────────────────────── */
  function paintButton(el) {
    try {
      el.textContent = muted ? "♪ off" : "♪ on";
      el.setAttribute("aria-pressed", muted ? "false" : "true");
      el.setAttribute("aria-label", muted ? "Music off. Tap to turn on." : "Music on. Tap to turn off.");
      el.classList.toggle("music-off", muted);
    } catch (e) {}
  }
  function refreshButtons() { var i; for (i = 0; i < buttons.length; i++) paintButton(buttons[i]); }
  function bindButton(el) {
    if (!el || el._solMusicBound) return el;
    el._solMusicBound = true;
    buttons.push(el);
    el.addEventListener("click", function () { unlock(); toggleMuted(); });
    paintButton(el);
    return el;
  }

  function state() {
    return { unlocked: unlocked, key: current ? current.key : null, scene: sceneKey, held: held ? held.key : null,
      chase: chaseApplied, muted: muted, volume: baseVol, duck: duckMul, dead: dead, channels: pool.length, pick: getPick() };
  }

  /* ── Init: persisted prefs + gesture / visibility listeners ──────────── */
  try { muted = localStorage.getItem(LS_MUTE) === "off"; } catch (e) {}
  try { var sv = localStorage.getItem(LS_VOL); if (sv !== null && sv !== "" && !isNaN(Number(sv))) baseVol = clamp01(sv); } catch (e) {}
  if (typeof document !== "undefined") {
    document.addEventListener("pointerdown", unlock, true);
    document.addEventListener("keydown", unlock, true);
    document.addEventListener("touchstart", unlock, true);
    document.addEventListener("visibilitychange", function () {
      if (!HALT_WHEN_HIDDEN || muted) return;
      if (document.hidden) pauseAll(); else resumeAll();
    });
  }

  global.SolMusic = {
    TRACKS: TRACKS,
    unlock: unlock,
    play: play,
    back: back,
    stop: stop,
    setChase: setChase,
    duck: duck,
    setMuted: setMuted,
    toggleMuted: toggleMuted,
    isMuted: isMuted,
    setVolume: setVolume,
    getVolume: getVolume,
    calmFor: calmFor,
    getPick: getPick,
    setPick: setPick,
    bindButton: bindButton,
    state: state
  };
})(window);
