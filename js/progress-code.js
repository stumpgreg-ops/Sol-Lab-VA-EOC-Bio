/* SOL Lab Biology (from SOL Labyrinth): progress codes (formats 1, 2 and 3). ONE file for the code format, used by the game (js/progress.js makes a
   code) and by the teacher page (tools/build-teacher.js inlines this file and reads codes with it), so the two can't
   drift. It runs in a browser (window.SolProgressCode) and in Node (module.exports).

   A code looks like  SOL1-VA-0F4K-1A2B-...  : "SOL" + the format number, the game (VA, NJ or ODY), then the payload
   in Crockford base32 (0-9 A-Z without I L O U; typed I and L read as 1, O as 0, any case), in blocks of 4.
   The payload is a string of bits. Each number is written in groups of 5 bits (4 bits of the number, lowest first,
   and a "more follows" bit), so small numbers take one character. In order:
     game id, game version (major, minor, patch), when the code was made (minutes since 2025-01-01 UTC),
     the nickname (its length, then 6 bits a letter), first and last day played (days since 2025-01-01; the last as
     days after the first), days played, minutes played, levels started / won / lost, highest level reached / won,
     questions answered / right on the first try / wrong picks, game modes tried, the number of skills, and for each
     skill of that game (BUILDS[...].skills, in order) answered / right on the first try;
   FORMAT 2 (v5.14, "SOL2-...") adds, after the skills, what the game needs to RESTORE a student's game from their
   last code (on a new Chromebook, or after the browser's data was cleared): the level to play next, the realms whose
   Fang was won (one bit each), and the town or castle: its theme, salt, coins, kit, the pieces owned (beyond those
   placed), the reward picked at each 5th level, and every placed piece (piece, style, how it was got, decoration,
   turn, and its cell). A word (theme, style or piece id) is 0 for none, its place in WORDS + 2, or 1 and the word spelled out.
   The teacher page reads format 1 and 2 alike and skips the restore part.
   FORMAT 3 (v5.15, "SOL3-...") adds, right after the skills: each standard practiced (its place in STDS + 1, or 0 and
   the code spelled out; answered; right on the first try), each game mode's highest level reached and won (a mode
   is a word: ALL, maze, raid ...), the best run of first-try answers, the number of perfect levels and the badges
   earned (one bit each, in BADGES order); and in the restore part, after the level, each mode's saved level.
   then a 30-bit tag (a hash of the payload bits and the game's secret), then zero bits up to a whole character.
   The tag turns a typo or a made-up code into INVALID. The secret ships inside the game, so it stops typos and
   casual tampering, not a determined student who reads the source. */
(function (root) {
  "use strict";
  var FORMAT = 3;                                   /* the newest format; decode() reads 1, 2 and 3 */
  var ALPHA = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  var NICK_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -";
  var NICK_MAX = 12, TAG_BITS = 30;
  var EPOCH = Date.UTC(2025, 0, 1);
  /* format 2: the words a restore part names, by number. APPEND ONLY: a word's place must never change, or codes
     already made would read wrong (tools/smoke-progress.js checks every theme, style and piece in pieces.json is here;
     a word that isn't is spelled out, so it still works, only longer). */
  var WORDS = [
    "village", "castle", "tile", "slate", "thatch", "blue", "red", "green", "gold", "cottage", "stone-cottage",
    "house", "stall", "steps", "cottage-wing", "stone-wing", "lamp-path", "house-wing", "bakery", "dock", "chapel",
    "arch", "tavern", "windmill", "watermill", "square", "harbour", "manor", "town-hall", "bell-tower", "grand-mill",
    "fence", "well", "lamp", "barrels", "crates", "hay-cart", "barrel-cart", "haystacks", "cobbles", "signpost",
    "keep", "round-keep", "watch-keep", "wall", "gate", "doorway", "stairs-wall", "corner-tower", "round-tower",
    "square-tower", "gate-tower", "roof-tower", "balcony-tower", "watchtower", "grand-tower", "arch-tower",
    "great-tower", "royal-tower", "flag", "flag-wide", "banner-long", "banner-short", "bridge", "stone-stairs",
    "knight", "knight-red", "king", "ballista", "catapult", "ram", "trebuchet", "siege-tower", "c-cottage", "hut",
    "stable", "barn", "c-tavern", "stone-hall", "c-chapel", "c-manor", "c-windmill", "stall-red", "stall-green",
    "cart", "c-hay-cart", "lantern", "lamp-post", "lamp-double", "bench", "fountain", "pool", "waterwheel", "planks",
    "stone-path", "well-sign", "campfire", "tent", "log-pile", "wheat", "pumpkins", "pot", "urn", "wood-bridge",
    "hedge", "hedge-gate", "c-fence", "fence-gate", "rail-fence", "oak", "pine", "round-pine", "autumn-tree",
    "tall-tree", "small-tree", "fir", "tall-fir", "poplar", "bush", "bushes", "flowers-red", "flowers-yellow",
    "flowers-purple", "flowers-mixed", "mushrooms", "tan-mushrooms", "boulder", "rocks", "tall-rock", "crag",
    "stump", "lily-pads", "obelisk", "column", "great-column", "stone-head", "stone-ring", "pedestal",
    "knight-statue", "king-statue", "stone-pillar", "small-obelisk", "glass-lantern", "cow", "horse", "pig", "goat",
    "chicken", "dog", "rabbit", "duck", "owl", "k-castle", "k-townhall", "k-barracks", "k-archery", "k-market",
    "k-mine", "k-shipyard", "k-stables", "k-tent", "k-workshop", "k-blacksmith", "k-church", "k-home-a", "k-home-b",
    "k-lumbermill", "k-shrine", "k-inn", "k-watermill", "k-windmill", "k-tower-a", "k-tower-b", "k-tower-base",
    "k-tower-cannon", "k-tower-catapult", "k-watchtower", "k-well", "k-grain", "k-site", "k-ruins", "k-stage",
    "k-platform", "k-barrels", "k-crates", "k-supplies", "k-hay", "k-wheelbarrow", "k-target", "k-weapons",
    "k-trough", "k-cannonballs", "k-camp-tent", "k-bucket", "k-pallet", "k-cart", "k-merchant-cart", "k-catapult",
    "k-cannon", "k-warhorse", "k-soldier", "k-banner", "k-flag", "k-tree-a", "k-tree-b", "k-grove-a", "k-grove-b",
    "k-rock", "k-stones", "trophy-midgard", "trophy-niflheim", "trophy-jotunheim", "trophy-muspelheim",
    "trophy-svartalfheim", "trophy-vanaheim", "trophy-alfheim", "trophy-helheim", "trophy-asgard", "trophy-ragnarok",
    /* v5.15: the game modes */
    "ALL", "maze", "raid", "rocks", "sky", "ring", "worms", "strait", "ram", "bow", "raft", "row"
  ];
  /* format 3: the standards, by number. APPEND ONLY, like WORDS (Virginia, then New Jersey) */
  var STDS = [
    "9.DSR.D", "9.DSR.E", "9.RI.1.A", "9.RI.1.B", "9.RI.1.C", "9.RI.2.A", "9.RI.2.B", "9.RI.3.A", "9.RL.1.A",
    "9.RL.1.B", "9.RL.1.C", "9.RL.1.D", "9.RL.2.A", "9.RL.2.B", "9.RL.2.C", "9.RL.3.A", "9.RL.3.B", "9.RV.1.B",
    "9.RV.1.C", "9.RV.1.E", "9.RV.1.F", "10.DSR.D", "10.DSR.E", "10.RI.1.A", "10.RI.1.B", "10.RI.1.C", "10.RI.2.A",
    "10.RI.2.B", "10.RI.2.C", "10.RL.1.A", "10.RL.1.B", "10.RL.1.C", "10.RL.2.A", "10.RL.2.B", "10.RL.2.C",
    "10.RL.3.A", "10.RV.1.A", "10.RV.1.B", "10.RV.1.C", "10.RV.1.D", "11.DSR.D", "11.DSR.E", "11.RI.1.A",
    "11.RI.1.B", "11.RI.1.C", "11.RI.2.A", "11.RI.2.B", "11.RI.2.C", "11.RL.1.A", "11.RL.1.B", "11.RL.1.C",
    "11.RL.2.A", "11.RL.2.B", "11.RL.2.C", "11.RL.3.A", "11.RV.1.A", "11.RV.1.B", "11.RV.1.C", "L.VI.5.3",
    "L.VL.5.2", "RI.AA.5.7", "RI.CI.5.2", "RI.CR.5.1", "RI.CT.5.8", "RI.IT.5.3", "RI.PP.5.5", "RI.TS.5.4",
    "RL.CI.5.2", "RL.CR.5.1", "RL.CT.5.8", "RL.IT.5.3", "RL.PP.5.5", "RL.TS.5.4",
    /* v6.4: the 2018 Virginia Biology SOL (SOL Lab Biology) */
    "BIO.1.a", "BIO.1.b", "BIO.1.c", "BIO.1.d", "BIO.1.e", "BIO.1.f", "BIO.2.a", "BIO.2.b", "BIO.2.c", "BIO.2.d", "BIO.2.e",
    "BIO.3.a", "BIO.3.b", "BIO.3.c", "BIO.3.d", "BIO.4.a", "BIO.4.b", "BIO.4.c", "BIO.4.d", "BIO.4.e",
    "BIO.5.a", "BIO.5.b", "BIO.5.c", "BIO.5.d", "BIO.5.e", "BIO.5.f", "BIO.6.a", "BIO.6.b", "BIO.6.c", "BIO.6.d", "BIO.6.e",
    "BIO.7.a", "BIO.7.b", "BIO.7.c", "BIO.7.d", "BIO.7.e", "BIO.8.a", "BIO.8.b", "BIO.8.c", "BIO.8.d",
    /* the reading game's v5.17 skill codes (js/standards-va.js there): here only so its codes still decode as "Other game";
       their places differ from the reading game's table, so a reading-game code's standards are never shown on this page */
    "9.DSR.A", "9.DSR.A.1", "9.DSR.A.2", "9.DSR.B", "9.DSR.B.1", "9.DSR.C", "9.DSR.C.1", "9.DSR.C.2", "9.DSR.C.3",
    "9.DSR.D.1", "9.DSR.D.2", "9.DSR.E.1", "9.RV.1.A", "9.RV.1.A.1", "9.RV.1.A.2", "9.RV.1.B.1", "9.RV.1.C.1",
    "9.RV.1.D", "9.RV.1.D.1", "9.RV.1.D.2", "9.RV.1.E.1", "9.RV.1.E.2", "9.RV.1.F.1", "9.RV.1.F.2", "9.RV.1.G",
    "9.RV.1.G.1", "9.RL.1.A.1", "9.RL.1.A.2", "9.RL.1.B.1", "9.RL.1.B.2", "9.RL.1.C.1", "9.RL.1.D.1", "9.RL.1.D.2",
    "9.RL.2.A.1", "9.RL.2.A.2", "9.RL.2.B.1", "9.RL.2.B.2", "9.RL.2.C.1", "9.RL.2.C.2", "9.RL.3.A.1", "9.RL.3.B.1",
    "9.RI.1.A.1", "9.RI.1.A.2", "9.RI.1.B.1", "9.RI.1.B.2", "9.RI.1.C.1", "9.RI.1.C.2", "9.RI.2.A.1", "9.RI.2.B.1",
    "9.RI.2.B.2", "9.RI.2.C", "9.RI.2.C.1", "9.RI.2.C.2", "9.RI.3.A.1", "9.RI.3.B", "9.RI.3.B.1", "9.RI.3.B.2",
    "10.DSR.A", "10.DSR.A.1", "10.DSR.A.2", "10.DSR.B", "10.DSR.B.1", "10.DSR.C", "10.DSR.C.1", "10.DSR.C.2",
    "10.DSR.C.3", "10.DSR.D.1", "10.DSR.D.2", "10.DSR.E.1", "10.RV.1.A.1", "10.RV.1.A.2", "10.RV.1.B.1",
    "10.RV.1.C.1", "10.RV.1.D.1", "10.RV.1.D.2", "10.RV.1.E", "10.RV.1.E.1", "10.RV.1.E.2", "10.RV.1.F",
    "10.RV.1.F.1", "10.RV.1.F.2", "10.RV.1.G", "10.RV.1.G.1", "10.RL.1.A.1", "10.RL.1.A.2", "10.RL.1.B.1",
    "10.RL.1.B.2", "10.RL.1.C.1", "10.RL.1.D", "10.RL.1.D.1", "10.RL.1.D.2", "10.RL.2.A.1", "10.RL.2.A.2",
    "10.RL.2.A.3", "10.RL.2.B.1", "10.RL.2.B.2", "10.RL.2.C.1", "10.RL.2.C.2", "10.RL.2.D", "10.RL.2.D.1",
    "10.RL.2.D.2", "10.RL.3.A.1", "10.RL.3.A.2", "10.RL.3.B", "10.RL.3.B.1", "10.RL.3.C", "10.RL.3.C.1",
    "10.RI.1.A.1", "10.RI.1.B.1", "10.RI.1.B.2", "10.RI.1.C.1", "10.RI.1.C.2", "10.RI.2.A.1", "10.RI.2.A.2",
    "10.RI.2.B.1", "10.RI.2.B.2", "10.RI.2.C.1", "10.RI.2.C.2", "10.RI.3.A", "10.RI.3.A.1", "10.RI.3.B",
    "10.RI.3.B.1", "11.DSR.A", "11.DSR.A.1", "11.DSR.A.2", "11.DSR.B", "11.DSR.B.1", "11.DSR.C", "11.DSR.C.1",
    "11.DSR.C.2", "11.DSR.C.3", "11.DSR.D.1", "11.DSR.D.2", "11.DSR.E.1", "11.RV.1.A.1", "11.RV.1.A.2", "11.RV.1.B.1",
    "11.RV.1.C.1", "11.RV.1.D", "11.RV.1.D.1", "11.RV.1.E", "11.RV.1.E.1", "11.RV.1.E.2", "11.RV.1.F", "11.RV.1.F.1",
    "11.RV.1.F.2", "11.RV.1.G", "11.RV.1.G.1", "11.RL.1.A.1", "11.RL.1.A.2", "11.RL.1.B.1", "11.RL.1.C.1",
    "11.RL.1.C.2", "11.RL.1.D", "11.RL.1.D.1", "11.RL.1.D.2", "11.RL.2.A.1", "11.RL.2.A.2", "11.RL.2.B.1",
    "11.RL.2.B.2", "11.RL.2.C.1", "11.RL.2.C.2", "11.RL.2.D", "11.RL.2.D.1", "11.RL.2.D.2", "11.RL.3.A.1",
    "11.RL.3.B", "11.RL.3.B.1", "11.RL.3.C", "11.RL.3.C.1", "11.RI.1.A.1", "11.RI.1.A.2", "11.RI.1.B.1",
    "11.RI.1.B.2", "11.RI.1.C.1", "11.RI.1.C.2", "11.RI.2.A.1", "11.RI.2.A.2", "11.RI.2.B.1", "11.RI.2.B.2",
    "11.RI.2.C.1", "11.RI.2.C.2", "11.RI.3.A", "11.RI.3.A.1", "11.RI.3.B", "11.RI.3.B.1"
  ];
  var STD_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ.abcdefghijklmnopqrstuvwxyz-_", STD_MAX = 24;
  /* format 3: the badges, by number. APPEND ONLY. "m-<mode>-<level>" = win that level in that game mode. */
  var MODE_IDS = ["ALL", "maze", "raid", "rocks", "sky", "ring", "worms", "strait", "ram", "bow", "raft", "row"];
  var MODE_TIERS = [10, 25, 50, 75, 100];
  var BADGES = ["first-win", "q25", "q100", "q250", "q500", "q1000", "q2500", "streak5", "streak10", "streak20", "streak40",
    "perfect1", "perfect10", "perfect25", "perfect50", "rl25", "rl100", "ri25", "ri100", "rv25", "rv100", "dsr25", "dsr100",
    "std10", "std20", "days3", "days7", "days15", "days30", "min30", "min120", "min300", "min600", "fang1", "fang5", "fang10",
    "town5", "town20", "town50", "coins500", "coins2000", "explorer", "grandtour", "legend", "comeback",
    "m-ALL-10", "m-ALL-25", "m-ALL-50", "m-ALL-75", "m-ALL-100", "m-maze-10", "m-maze-25", "m-maze-50", "m-maze-75", "m-maze-100",
    "m-raid-10", "m-raid-25", "m-raid-50", "m-raid-75", "m-raid-100", "m-rocks-10", "m-rocks-25", "m-rocks-50", "m-rocks-75", "m-rocks-100",
    "m-sky-10", "m-sky-25", "m-sky-50", "m-sky-75", "m-sky-100", "m-ring-10", "m-ring-25", "m-ring-50", "m-ring-75", "m-ring-100",
    "m-worms-10", "m-worms-25", "m-worms-50", "m-worms-75", "m-worms-100", "m-strait-10", "m-strait-25", "m-strait-50", "m-strait-75", "m-strait-100",
    "m-ram-10", "m-ram-25", "m-ram-50", "m-ram-75", "m-ram-100", "m-bow-10", "m-bow-25", "m-bow-50", "m-bow-75", "m-bow-100",
    "m-raft-10", "m-raft-25", "m-raft-50", "m-raft-75", "m-raft-100", "m-row-10", "m-row-25", "m-row-50", "m-row-75", "m-row-100"];
  var MODE_NAMES = { ALL: "Mixed", maze: "Labyrinth", raid: "Eagle Swoop", rocks: "Rune Rocks", sky: "Sun Chariot", ring: "Wolf Ring",
    worms: "Root Worms", strait: "Scylla and Charybdis", ram: "Under the Ram", bow: "Bend the Bow", raft: "Calypso's Raft", row: "Row Past the Sirens" };
  var TIER_NAMES = { 10: "Bronze", 25: "Silver", 50: "Gold", 75: "Platinum", 100: "Champion" };
  var BADGE_INFO = {
    "first-win": ["First Victory", "Win your first level."],
    q25: ["Curious Reader", "Answer 25 questions."], q100: ["Avid Reader", "Answer 100 questions."], q250: ["Bookworm", "Answer 250 questions."],
    q500: ["Scholar", "Answer 500 questions."], q1000: ["Sage", "Answer 1,000 questions."], q2500: ["Living Library", "Answer 2,500 questions."],
    streak5: ["Sharp Eye", "Get 5 questions in a row right on the first try."], streak10: ["Hot Streak", "Get 10 in a row right on the first try."],
    streak20: ["On Fire", "Get 20 in a row right on the first try."], streak40: ["Unstoppable", "Get 40 in a row right on the first try."],
    perfect1: ["Flawless", "Win a level with no wrong letters."], perfect10: ["Precision", "Win 10 levels with no wrong letters."],
    perfect25: ["Perfectionist", "Win 25 levels with no wrong letters."], perfect50: ["Untouchable", "Win 50 levels with no wrong letters."],
    /* v6.4: in SOL Lab Biology js/badges.js names these four pairs for the Biology units (Cell Biologist, Geneticist, Naturalist, Field Scientist) */
    rl25: ["Story Seeker", "Get 25 literary questions right on the first try."], rl100: ["Story Master", "Get 100 literary questions right on the first try."],
    ri25: ["Fact Finder", "Get 25 informational questions right on the first try."], ri100: ["Fact Master", "Get 100 informational questions right on the first try."],
    rv25: ["Word Hunter", "Get 25 vocabulary questions right on the first try."], rv100: ["Word Master", "Get 100 vocabulary questions right on the first try."],
    dsr25: ["Connector", "Get 25 paired-text questions right on the first try."], dsr100: ["Master Connector", "Get 100 paired-text questions right on the first try."],
    std10: ["Well-Rounded", "Practice 10 different standards."], std20: ["Standards Sweep", "Practice 20 different standards."],
    days3: ["Regular", "Play on 3 different days."], days7: ["Dedicated", "Play on 7 different days."], days15: ["Committed", "Play on 15 different days."],
    days30: ["Devoted", "Play on 30 different days."],
    min30: ["Warming Up", "Play for 30 minutes."], min120: ["Focused", "Play for 2 hours."], min300: ["Marathon", "Play for 5 hours."], min600: ["Iron Will", "Play for 10 hours."],
    fang1: ["Boss Slayer", "Beat a boss level and win Fenrir's Fang."], fang5: ["Realm Hunter", "Win 5 of Fenrir's Fangs."], fang10: ["Realm Conqueror", "Win all 10 of Fenrir's Fangs."],
    town5: ["Builder", "Place 5 pieces in your town or castle."], town20: ["Architect", "Place 20 pieces in your town or castle."],
    town50: ["Master Builder", "Place 50 pieces in your town or castle."],
    coins500: ["Saver", "Have 500 coins at once."], coins2000: ["Treasurer", "Have 2,000 coins at once."],
    explorer: ["Explorer", "Play a level in every game mode."], grandtour: ["Grand Tour", "Win level 10 in every game mode."],
    legend: ["Legend", "Win level 100 in every game mode."], comeback: ["Never Give Up", "Win a level you lost before."]
  };
  /* badgeInfo("m-raid-25") -> { id, name, desc, mode, tier } */
  function badgeInfo(id) {
    var m = /^m-([A-Za-z]+)-(\d+)$/.exec(id || "");
    if (m) {
      var nm = MODE_NAMES[m[1]] || m[1];
      return { id: id, name: nm + " " + (TIER_NAMES[m[2]] || m[2]), desc: "Win level " + m[2] + " in " + nm + ".", mode: m[1], tier: +m[2] };
    }
    var b = BADGE_INFO[id];
    return { id: id, name: b ? b[0] : id, desc: b ? b[1] : "" };
  }
  var WORD_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789-_ABCDEFGHIJKLMNOPQRSTUVWXYZ", WORD_MAX = 40;
  var SRC = ["reward", "shop", "auto", "free"];
  var PICKS_MAX = 2000, LIST_MAX = 2000;
  var DAY = 86400000;
  var BUILDS = {
    VA: { id: 1, tag: "VA", name: "Sol's Labyrinth (Virginia)", short: "Virginia", assignment: "Sol's Labyrinth progress",
      skillWord: "Skill", secret: "va.7Qm2-kestrel-41c9-amber",
      skills: [["RL", "Literary"], ["RI", "Informational"], ["RV", "Vocabulary"], ["DSR", "Paired texts"]] },
    NJ: { id: 2, tag: "NJ", name: "Sol's Labyrinth (New Jersey)", short: "New Jersey", assignment: "Sol's Labyrinth progress",
      skillWord: "Skill", secret: "nj.3Rx8-heron-b62d-cobalt",
      skills: [["RL", "Literature"], ["RI", "Informational"], ["RV", "Vocabulary"], ["DSR", "Paired texts"]] },
    ODY: { id: 3, tag: "ODY", name: "The Odyssey: Labyrinth of the Wine-Dark Sea", short: "The Odyssey", assignment: "Odyssey game progress",
      skillWord: "Episode", secret: "ody.9Kd4-dolphin-e17a-saffron",
      skills: [["LOTUS", "Lotus-Eaters"], ["CYCLOPS", "Cyclops"], ["CIRCE", "Circe"], ["HELIOS", "Cattle of the Sun"], ["CALYPSO", "Calypso"], ["VOYAGE", "Whole voyage"]] },
    /* v6.4: SOL Lab Biology (Virginia EOC). A "skill" is a standard, BIO.1 to BIO.8 (js/progress.js skillOf: BIO1 … BIO8). */
    BIO: { id: 4, tag: "BIO", name: "SOL Lab Biology (Virginia EOC)", short: "Biology", assignment: "SOL Lab Biology progress",
      skillWord: "Standard", secret: "bio.5Hn7-osprey-c83e-verdant",
      skills: [["BIO1", "BIO.1 Investigation"], ["BIO2", "BIO.2 Biochemistry"], ["BIO3", "BIO.3 Cells"], ["BIO4", "BIO.4 Bacteria & viruses"],
               ["BIO5", "BIO.5 Heredity"], ["BIO6", "BIO.6 Classification"], ["BIO7", "BIO.7 Evolution"], ["BIO8", "BIO.8 Ecology"]] }
  };
  function buildById(id) { for (var k in BUILDS) if (BUILDS[k].id === id) return k; return null; }

  /* ── dates: a local calendar day "YYYY-MM-DD" <-> days since 2025-01-01 ── */
  function dayNum(ymd) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(ymd || ""));
    if (!m) return 0;
    return Math.max(0, Math.round((Date.UTC(+m[1], +m[2] - 1, +m[3]) - EPOCH) / DAY));
  }
  function dayStr(n) {
    var d = new Date(EPOCH + Math.max(0, n) * DAY);
    return d.getUTCFullYear() + "-" + ("0" + (d.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + d.getUTCDate()).slice(-2);
  }

  /* ── bits ── */
  function Writer() { this.b = []; }
  Writer.prototype.fixed = function (v, n) { for (var i = n - 1; i >= 0; i--) this.b.push((v >>> i) & 1); };
  Writer.prototype.num = function (v) {
    v = Math.max(0, Math.floor(Number(v) || 0));
    if (v > 0x3fffffff) v = 0x3fffffff;
    do { var g = v % 16; v = Math.floor(v / 16); this.fixed((v > 0 ? 16 : 0) | g, 5); } while (v > 0);
  };
  Writer.prototype.word = function (s) {
    s = String(s || "");
    if (!s) { this.num(0); return; }
    var i = WORDS.indexOf(s);
    if (i !== -1) { this.num(i + 2); return; }
    var t = "";
    for (var k = 0; k < s.length && t.length < WORD_MAX; k++) if (WORD_CHARS.indexOf(s.charAt(k)) !== -1) t += s.charAt(k);
    this.num(1); this.num(t.length);
    for (k = 0; k < t.length; k++) this.fixed(WORD_CHARS.indexOf(t.charAt(k)), 6);
  };
  Writer.prototype.signed = function (v) { v = Math.round(Number(v) || 0); this.num(v >= 0 ? v * 2 : -v * 2 - 1); };
  function Reader(bits) { this.b = bits; this.i = 0; }
  Reader.prototype.fixed = function (n) {
    if (this.i + n > this.b.length) throw new Error("short");
    var v = 0;
    for (var k = 0; k < n; k++) v = v * 2 + this.b[this.i++];
    return v;
  };
  Reader.prototype.num = function () {
    var v = 0, mul = 1, g, guard = 0;
    do {
      g = this.fixed(5);
      v += (g & 15) * mul; mul *= 16;
      if (++guard > 8) throw new Error("number too long");
    } while (g & 16);
    return v;
  };

  Reader.prototype.word = function () {
    var i = this.num();
    if (i === 0) return "";
    if (i > 1) { if (i - 2 >= WORDS.length) throw new Error("word"); return WORDS[i - 2]; }
    var n = this.num(), t = "";
    if (n > WORD_MAX) throw new Error("word");
    for (var k = 0; k < n; k++) t += WORD_CHARS.charAt(this.fixed(6));
    return t;
  };
  Reader.prototype.signed = function () { var n = this.num(); return n % 2 ? -(n + 1) / 2 : n / 2; };
  Writer.prototype.std = function (s) {
    s = String(s || "");
    var i = STDS.indexOf(s);
    if (i !== -1) { this.num(i + 1); return; }
    var t = "";
    for (var k = 0; k < s.length && t.length < STD_MAX; k++) if (STD_CHARS.indexOf(s.charAt(k)) !== -1) t += s.charAt(k);
    this.num(0); this.num(t.length);
    for (k = 0; k < t.length; k++) this.fixed(STD_CHARS.indexOf(t.charAt(k)), 6);
  };
  Reader.prototype.std = function () {
    var i = this.num();
    if (i > 0) { if (i > STDS.length) throw new Error("std"); return STDS[i - 1]; }
    var n = this.num(), t = "";
    if (n > STD_MAX) throw new Error("std");
    for (var k = 0; k < n; k++) t += STD_CHARS.charAt(this.fixed(6));
    return t;
  };

  /* format 3's extra numbers: s.std { "9.RL.1.A": { a, r } }, s.camp { raid: { hiReached, hiWon } }, s.bestStreak,
     s.perfect, s.badges [ids] */
  function writeExtra(w, s) {
    var std = s.std || {}, keys = Object.keys(std).filter(function (k) { return std[k] && std[k].a > 0; }).slice(0, 200);
    w.num(keys.length);
    keys.forEach(function (k) { w.std(k); w.num(std[k].a); w.num(Math.min(std[k].a, std[k].r || 0)); });
    var camp = s.camp || {}, ck = Object.keys(camp).filter(function (k) { return camp[k] && camp[k].hiReached > 0; }).slice(0, 30);
    w.num(ck.length);
    ck.forEach(function (k) { w.word(k); w.num(Math.min(100, camp[k].hiReached)); w.num(Math.min(camp[k].hiReached, camp[k].hiWon || 0)); });
    w.num(s.bestStreak); w.num(s.perfect);
    var have = {}, last = -1;
    (s.badges || []).forEach(function (id) { var i = BADGES.indexOf(id); if (i !== -1) { have[i] = 1; if (i > last) last = i; } });
    w.num(last + 1);
    for (var i = 0; i <= last; i++) w.fixed(have[i] ? 1 : 0, 1);
  }
  function readExtra(r, d) {
    var n = r.num(), i;
    if (n > 200) throw new Error("std");
    d.std = [];
    for (i = 0; i < n; i++) { var code = r.std(), a = r.num(), rr = r.num(); if (rr > a) throw new Error("std"); d.std.push({ code: code, a: a, r: rr }); }
    n = r.num(); if (n > 30) throw new Error("camp");
    d.camp = {};
    for (i = 0; i < n; i++) { var m = r.word(), hr = r.num(), hw = r.num(); if (hr > 100 || hw > hr) throw new Error("camp"); d.camp[m] = { hiReached: hr, hiWon: hw }; }
    d.bestStreak = r.num(); d.perfect = r.num();
    n = r.num(); if (n > 1000) throw new Error("badges");
    d.badges = [];
    for (i = 0; i < n; i++) if (r.fixed(1)) d.badges.push(BADGES[i] || ("badge" + i));
  }

  /* format 2's restore part. sv: { night, fangs: [realm numbers 0..15], build: null or { theme, salt, coins, kit,
     owned: [ids], rewards: { "5": id, ... }, picks: [{ piece, style, src, deco, rot, cx, cy }] } } */
  function writeSave(w, sv, fmt) {
    sv = sv || {};
    w.num(Math.max(1, Math.min(100, Math.floor(Number(sv.night) || 1))));
    if (fmt >= 3) {
      var nights = sv.nights || {}, nk = Object.keys(nights).filter(function (k) { return nights[k] >= 1 && nights[k] <= 100; }).slice(0, 30);
      w.num(nk.length);
      nk.forEach(function (k) { w.word(k); w.num(Math.floor(nights[k])); });
    }
    var mask = 0;
    (sv.fangs || []).forEach(function (i) { i = Math.floor(Number(i)); if (i >= 0 && i < 16) mask |= 1 << i; });
    w.num(mask);
    var b = sv.build;
    w.fixed(b ? 1 : 0, 1);
    if (!b) return;
    var picks = (b.picks || []).slice(0, PICKS_MAX), placed = {};
    picks.forEach(function (p) { placed[p.piece] = 1; });
    w.word(b.theme || "");
    w.num(b.salt); w.num(b.coins); w.num(b.kit);
    var owned = (b.owned || []).filter(function (id) { return id && !placed[id]; }).slice(0, LIST_MAX);
    w.num(owned.length);
    owned.forEach(function (id) { w.word(id); });
    var rk = Object.keys(b.rewards || {}).filter(function (k) { var n = parseInt(k, 10); return b.rewards[k] && n >= 5 && n <= 100 && n % 5 === 0; });
    w.num(rk.length);
    rk.forEach(function (k) { w.num(parseInt(k, 10) / 5); w.word(b.rewards[k]); });
    w.num(picks.length);
    picks.forEach(function (p) {
      var hasPos = p.cx != null && p.cy != null && isFinite(p.cx) && isFinite(p.cy);
      w.word(p.piece); w.word(p.style || "");
      w.fixed(Math.max(0, SRC.indexOf(p.src)), 2); w.fixed(p.deco ? 1 : 0, 1); w.fixed((Number(p.rot) || 0) & 3, 2);
      w.fixed(hasPos ? 1 : 0, 1);
      if (hasPos) { w.signed(p.cx); w.signed(p.cy); }
    });
  }
  function readSave(r, fmt) {
    var sv = { night: r.num(), nights: {}, fangs: [], build: null }, mask, i, n;
    if (sv.night < 1 || sv.night > 100) throw new Error("night");
    if (fmt >= 3) {
      n = r.num(); if (n > 30) throw new Error("nights");
      for (i = 0; i < n; i++) { var mk = r.word(), nv = r.num(); if (nv < 1 || nv > 100) throw new Error("nights"); sv.nights[mk] = nv; }
    }
    mask = r.num();
    for (i = 0; i < 16; i++) if (mask & (1 << i)) sv.fangs.push(i);
    if (!r.fixed(1)) return sv;
    var b = sv.build = { theme: r.word() || null, salt: r.num(), coins: r.num(), kit: r.num(), owned: [], rewards: {}, picks: [] };
    n = r.num(); if (n > LIST_MAX) throw new Error("owned");
    for (i = 0; i < n; i++) b.owned.push(r.word());
    n = r.num(); if (n > 20) throw new Error("rewards");
    for (i = 0; i < n; i++) { var lv = r.num() * 5; if (lv < 5 || lv > 100) throw new Error("reward"); b.rewards[lv] = r.word(); }
    n = r.num(); if (n > PICKS_MAX) throw new Error("picks");
    for (i = 0; i < n; i++) {
      var p = { piece: r.word(), style: r.word() };
      p.src = SRC[r.fixed(2)]; p.deco = !!r.fixed(1); p.rot = r.fixed(2);
      if (r.fixed(1)) { p.cx = r.signed(); p.cy = r.signed(); }
      b.picks.push(p);
    }
    return sv;
  }

  /* FNV-1a over the game's secret and the payload bits, then a 32-bit finaliser; the top 30 bits are the tag */
  function tagOf(secret, bits) {
    var s = secret + "|" + bits.join(""), h = 0x811c9dc5, i;
    for (i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b) >>> 0; h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35) >>> 0; h ^= h >>> 16;
    return (h >>> 0) >>> (32 - TAG_BITS);
  }

  function cleanNick(s) {
    var out = "";
    String(s || "").replace(/[_.]/g, "-").split("").forEach(function (ch) { if (out.length < NICK_MAX && NICK_CHARS.indexOf(ch) !== -1) out += ch; });
    return out.replace(/\s+/g, " ").trim();
  }
  function parseVersion(v) {
    var m = /(\d+)\.(\d+)(?:\.(\d+))?/.exec(String(v || ""));
    return m ? [+m[1], +m[2], +(m[3] || 0)] : [0, 0, 0];
  }

  /* encode(build, s, opts) -> "SOL1-VA-...." (or "SOL3-VA-...." with opts.save: see writeExtra and writeSave;
     opts.format 2 makes a v5.14 code, for tests)
     s: { first, last ("YYYY-MM-DD" or null), days, minutes, started, won, lost, hiReached, hiWon, answered, right,
          wrong, modes, skills: { RL: { a, r }, ... }, and for format 3 std, camp, bestStreak, perfect, badges };
     opts: { nick, version ("5.12.2"), now (ms), save, format } */
  function encode(build, s, opts) {
    var B = BUILDS[build];
    if (!B) throw new Error("unknown game " + build);
    opts = opts || {}; s = s || {};
    var w = new Writer(), ver = parseVersion(opts.version), now = opts.now != null ? opts.now : Date.now();
    var nick = cleanNick(opts.nick), first = s.first ? dayNum(s.first) : 0, last = s.last ? dayNum(s.last) : first;
    w.num(B.id);
    w.num(ver[0]); w.num(ver[1]); w.num(ver[2]);
    w.num(Math.max(0, Math.floor((now - EPOCH) / 60000)));
    w.num(nick.length);
    for (var i = 0; i < nick.length; i++) w.fixed(NICK_CHARS.indexOf(nick.charAt(i)), 6);
    w.num(first); w.num(Math.max(0, last - first)); w.num(s.days);
    w.num(s.minutes);
    w.num(s.started); w.num(s.won); w.num(s.lost);
    w.num(s.hiReached); w.num(s.hiWon);
    w.num(s.answered); w.num(s.right); w.num(s.wrong);
    w.num(s.modes);
    w.num(B.skills.length);
    B.skills.forEach(function (k) { var r = (s.skills && s.skills[k[0]]) || {}; w.num(r.a); w.num(r.r); });
    var fmt = opts.format || (opts.save ? FORMAT : 1);
    if (fmt >= 3) writeExtra(w, s);
    if (fmt >= 2) writeSave(w, opts.save, fmt);
    var payload = w.b.slice();
    w.fixed(tagOf(B.secret, payload), TAG_BITS);
    while (w.b.length % 5) w.b.push(0);
    var chars = "";
    for (var j = 0; j < w.b.length; j += 5) {
      var v = 0;
      for (var q = 0; q < 5; q++) v = v * 2 + w.b[j + q];
      chars += ALPHA.charAt(v);
    }
    return "SOL" + fmt + "-" + B.tag + "-" + chars.match(/.{1,4}/g).join("-");
  }

  /* decode("SOL1-VA-....") -> { ok: true, build, code, data } or { ok: false, build, why }; a format 2 code's data
     also has .format 2 and .save (see readSave) */
  function decode(text) {
    var t = String(text || "").toUpperCase().replace(/[\s-]+/g, "");
    var m = /^SOL(\d+)(VA|NJ|ODY|BIO)([0-9A-Z]*)$/.exec(t);
    if (!m) return { ok: false, build: null, why: "This is not a progress code." };
    var build = m[2], B = BUILDS[build];
    var fmt = +m[1];
    if (fmt < 1 || fmt > FORMAT) return { ok: false, build: build, why: "Made by a newer version of the game (format " + m[1] + "): get the newest teacher page." };
    var body = m[3].replace(/O/g, "0").replace(/[IL]/g, "1"), bits = [];
    if (/U/.test(body)) return { ok: false, build: build, why: "Has a letter that is never in a code (U): a typo?" };
    if (body.length < 12) return { ok: false, build: build, why: "Too short: part of the code is missing." };
    for (var i = 0; i < body.length; i++) {
      var v = ALPHA.indexOf(body.charAt(i));
      for (var q = 4; q >= 0; q--) bits.push((v >>> q) & 1);
    }
    var r = new Reader(bits), d = {};
    try {
      var id = r.num();
      if (id !== B.id) throw new Error("game");
      d.version = r.num() + "." + r.num() + "." + r.num();
      d.made = EPOCH + r.num() * 60000;
      var nl = r.num(), nick = "";
      if (nl > NICK_MAX) throw new Error("nick");
      for (var k = 0; k < nl; k++) nick += NICK_CHARS.charAt(r.fixed(6));
      d.nick = nick;
      var first = r.num(), span = r.num();
      d.days = r.num();
      d.first = d.days ? dayStr(first) : null;
      d.last = d.days ? dayStr(first + span) : null;
      d.minutes = r.num();
      d.started = r.num(); d.won = r.num(); d.lost = r.num();
      d.hiReached = r.num(); d.hiWon = r.num();
      d.answered = r.num(); d.right = r.num(); d.wrong = r.num();
      d.modes = r.num();
      var ns = r.num();
      if (ns > 20) throw new Error("skills");
      d.skills = [];
      for (var s = 0; s < ns; s++) {
        var def = B.skills[s] || ["S" + (s + 1), B.skillWord + " " + (s + 1)];
        d.skills.push({ key: def[0], name: def[1], a: r.num(), r: r.num() });
      }
      d.format = fmt;
      if (fmt >= 3) readExtra(r, d);
      if (fmt >= 2) d.save = readSave(r, fmt);
      var payload = bits.slice(0, r.i);
      var tag = r.fixed(TAG_BITS);
      var rest = bits.slice(r.i);
      if (rest.length >= 5 || rest.some(function (x) { return x; })) throw new Error("extra");
      if (tag !== tagOf(B.secret, payload)) throw new Error("tag");
      if (d.right > d.answered || d.won + d.lost > d.started || d.hiWon > d.hiReached || d.hiReached > 100) throw new Error("numbers");
    } catch (e) {
      return { ok: false, build: build, why: "Does not check out: a typo, a missing part, or a changed code." };
    }
    return { ok: true, build: build, code: format(t), data: d };
  }
  /* the canonical way to write a code (blocks of 4) */
  function format(t) {
    var m = /^SOL(\d+)(VA|NJ|ODY|BIO)([0-9A-Z]*)$/.exec(String(t).toUpperCase().replace(/[\s-]+/g, ""));
    return m ? "SOL" + m[1] + "-" + m[2] + "-" + (m[3].match(/.{1,4}/g) || []).join("-") : String(t);
  }

  /* findCodes(text) -> every code in any text: [{ raw, before, result }]. A code runs to the end of its line; if a
     word typed after it (on the same line) breaks it, the last space-separated pieces are dropped one at a time until
     it checks out. `before` is the text on the line before the code (a "Name: CODE" line gives the name). */
  function findCodes(text) {
    var out = [], re = /SOL[ \t]*(\d+)[ \t]*-?[ \t]*(VA|NJ|ODY|BIO)([0-9A-Za-z \t-]*)/gi, m;
    text = String(text || "");
    while ((m = re.exec(text))) {
      var lineStart = text.lastIndexOf("\n", m.index) + 1;
      var before = text.slice(lineStart, m.index);
      var head = "SOL" + m[1] + "-" + m[2].toUpperCase() + "-";
      var pieces = m[3].replace(/^[\s-]+/, "").split(/[ \t]+/).filter(Boolean), res = null, k;
      for (k = pieces.length; k >= 1; k--) {
        res = decode(head + pieces.slice(0, k).join(""));
        if (res.ok) break;
      }
      if (!res || !res.ok) { k = pieces.length; res = decode(head + pieces.join("")); }
      var raw = (head + pieces.slice(0, Math.max(k, 1)).join(" ")).replace(/-+$/, "");
      out.push({ raw: raw.length > 140 ? raw.slice(0, 140) + "…" : raw, before: before, result: res });
    }
    return out;
  }

  var api = { FORMAT: FORMAT, BUILDS: BUILDS, WORDS: WORDS, STDS: STDS, BADGES: BADGES, MODE_IDS: MODE_IDS, MODE_TIERS: MODE_TIERS, badgeInfo: badgeInfo, buildById: buildById, encode: encode, decode: decode, format: format,
    findCodes: findCodes, dayNum: dayNum, dayStr: dayStr, cleanNick: cleanNick, parseVersion: parseVersion, _tag: tagOf };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.SolProgressCode = api;
})(typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : this));
