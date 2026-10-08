# SOL Lab — Virginia EOC Biology

The SOL Labyrinth maze-chase engine rebuilt for the **Virginia End-of-Course Biology SOL**. 100 levels. Solo Chromebook play.

**Theme (Norse × SOL):** You are **Sol**, the Norse sun goddess, collecting letter slips in a Pac-like school labyrinth. Ravenous wolves — **Hati** — patrol the corridors. Read the lab notes and the question in the side panel, grab the **correct** letter to summon Sol's **CHARIOT** and smash Hati by contact (they return from the Wolf Pen). A wrong letter sets off the alarm and costs a life. Fruit = coins. Ice = brief escape freeze. **Only one power/effect active at a time.** Every fifth level won earns a piece for the student's own Town or Castle, and coins buy more in the shop.

Play: `index.html`. Teacher monitor: `admin.html` (PIN lock; FERPA nicknames only).

Progress saves in this browser profile (`afterHours.v1.night`). Itch login does not store progress.

## v6.5.0 (2026-10-08) — every screen fits 100% × 500, a one-card tutorial, a Menu to leave a level, and accommodations (SOL Labyrinth v5.17.2 and v5.18.0)

- **Every screen fits the Canvas embed (width 100%, height 500) without scrolling** (from SOL Labyrinth v5.17.2, merged over v6.4.2's first pass). Short frames (620 px or less) tighten the start screens, windows, builder and shop (`css/after-hours.css` and `css/build.css`, "short frames"); `js/fit.js` shrinks any screen or window that still doesn't fit (CSS zoom, down to a floor) and undoes it in full screen; the play HUD stays on the left so the passage, question and all four answers show. `node tools/audit-500.js [WxH …]` opens every screen and window (title, progress, Restore, badges, accommodations, town, shop, teacher screen, game mode, skill, look, tutorial, reading, play, Menu, level end, a shooter) and fails if anything is cut off or makes the page scroll: all fit at 640, 700, 1000 and 1280 × 500 and at 1280 × 720 and 1366 × 768. `tools/smoke-canvas.js` embeds the game the READ ME's way (100% × 500).
- **The tutorial is one window.** The Level 1 *How to play* used to be nine cards behind "Tap to continue"; students clicked *Skip intro* on the first and never learned the rules. Now one card lists them all (move, read, grab the right letter with SPACE, carry it to EXIT · SAFE, the chariot and a wrong letter, the wolves and strikes, the safe booths, SPRINT, TAB, the Menu) with one **Got it — play** button, and fits the 500-pixel frame.
- **Menu: leave a level and go back to the title screen.** A **☰ Menu** button in the side panel (every mode: the maze and the shooters) or the **Esc** key pauses the level and asks *Keep playing* or *Leave the level*. Leaving goes to the title screen like the level-end *Title* button; the saved level and the progress record stay as they were (a level left half-way is not a loss). Esc closes the field guide or a word pop-up first when one is open. `node tools/smoke-menu.js` checks both, in a maze and an Eagle Swoop level.

- **Accommodations a teacher turns on for one student** (from SOL Labyrinth v5.18.0), one Chromebook (browser profile) at a time; nothing is on for anyone by default. The teacher types the word `accommodations` in the nickname box on the title screen and enters the teacher PIN (4826, in the Canvas READ ME; "Change the PIN on this Chromebook" sets another one there). Each option can carry an *Ends after* date so a support meant to fade switches itself off, and the title screen shows "Accommodations on: …" while any are on. Saved in `afterHours.v1.acc.BIO`; the code is `js/accommodations.js`, the same module as the Odyssey build's, with Biology's save keys.
  - **Tap a word for its meaning:** harder everyday, academic and setting words in the passage, question and answers (vineyard, culvert, gradually) are underlined; a click shows a short definition. **No Biology or science term is ever defined,** so a definition never gives an answer away; Virginia's science tests allow a word-to-word dictionary and read-aloud but not definitions of tested terms. `tools/smoke-acc.js` checks a list of core terms stays out.
  - **Word-to-word dictionary** (questions and answers only): a click on any word, science terms included, shows it in Spanish, Arabic, Farsi or Russian (right to left for Arabic and Farsi), one word in the sense the question uses, never a definition.
  - **Read aloud:** speaker buttons read the passage sentence by sentence (highlighted), the question and each answer with the Chromebook's own voice (speechSynthesis, no audio files, works offline); a slower voice can be chosen.
  - **Larger text** in the side panel and the reading pop-up, and a **slower game** at 85, 75 or 60 % speed (the maze and every shooter: enemies, timers, rhythms; `SolAcc.speedK()` scales each frame in `js/game.js` and `js/modes.js`).
- **The word lists** are `js/acc-bio.js`, made by `node tools/make-acc-bio.js` from `tools/acc/bio-def.json` (the definitions) and `tools/acc/bio-tr.json` (the dictionary: every word of every question and answer, in four languages). The tool fails if a question or answer word has no translation; run it again whenever questions change. `--report` lists questions whose right answer alone holds a defined word, for a person to read over.
- **The Canvas READ ME** has a new section, *Accommodations for a student (teacher PIN)*, and its troubleshooting tip now says `height="500"` (try 600 or 700), matching the embed code.
- **Test (accommodations):** `node tools/smoke-acc.js` (in the 900 × 500 Canvas frame): off by default, the nickname-box way in and a wrong PIN, all five options on a level (Farsi, the slower voice, 75 %), the read-aloud queue, end dates, Turn all off, and the word lists' coverage.

## v6.4.2 (2026-10-08) — a 500 px tall Canvas embed

- **The embed code in the Canvas READ ME is now `width="100%" height="500"`** (was 700), and the game fits that frame: on a frame under 1100 px wide the side panel used to move above the maze as a 28 vh strip, which at 500 px tall left the lab notes and the question unreadable. Now that stacking happens only when the frame is both narrow and at least 601 px tall; a short frame keeps the panel beside the maze down to 740 px wide (`css/after-hours.css`). The menu screens scroll from their top in a short frame (`justify-content: safe center`) instead of clipping the logo and heading above the frame where no scroll reached them, and the logo shrinks to fit (`48vh`).

## v6.4.1 (2026-10-08) — the teacher screen from SOL Labyrinth v5.16.1 to v5.17.1

- **The standards report opens on a Class total page:** every student's answers added together, key idea by key idea (BIO.8.a with its text from the standards map), with the class's % right and a bar, how many students are at 80%+, 60–79% and below 60% on it, the units in total, the three weakest key ideas under *Reteach first*, and an order by standard or weakest first. *Student by student* is the second page, with a Class total row. The standards CSV starts with the class total. `js/standards-bio.js` (made by `node tools/make-standards-bio.js` from the standards map in `js/content.js`) gives the report each key idea's text; the English game's LOTS/HOTS skill split does not apply here, since Biology questions carry a key idea and no sub-skill.
- **The teacher screen's order:** box 1 is *Scoring criteria* (open by default; the one-line summary shows only when it is folded), box 2 *Add the codes*, box 3 *Your class*. *Finish this grading round* is now **Submit codes** inside box 2, and *Undo: back to the round before* is **Undo: return to the previous codes**. The READ MEs in the Canvas zips say the same.
- `js/progress.js` records a question's skill (`sub`) when one is given, as the English game does; Biology questions have none, so nothing changes in the codes. `js/progress-code.js` also lists the reading game's v5.17 skill codes after the Biology ones, so a `SOL3-VA` code made by the newest English game still reads as "Other game" here.
- Not carried over: the English game's 2024 reading standards file and the skill tags on its 10,562 questions.

## v6.4 (2026-10-07) — progress codes and the Teacher screen, badges, a level per mode, Root Worms (the v5.16.0 engine)

The Biology game now carries everything SOL Labyrinth gained between v5.8.2 and v5.16.0 that is not Odyssey-only. The 510 Biology questions are untouched.

- **Progress codes and the Teacher screen (Canvas grading).** A game uploaded to Canvas cannot send anything anywhere, so each student taps **Submit my progress** (title screen or after a level) and turns in a code (`SOL3-BIO-…`) to a Text Entry assignment. The code is a running total: days and minutes played (only while a level is on screen), levels started, won and lost, highest level, questions answered and right on the first try, each standard practiced (BIO.1 to BIO.8, with every key idea such as BIO.8.a), each mode's levels, the best streak, perfect levels, badges, and what Restore needs. A 30-bit tag with a per-game secret makes a typo or an edited code INVALID; a reading-game code (`SOL3-VA-`) shows as "Other game".
  - **The Teacher screen is inside the game.** It is hidden: a teacher types the word **teacher** in the nickname box on the title screen once per computer. It reads the assignment's *Download Submissions* .zip (or pasted codes), shows student cards with a suggested participation grade from the teacher's goals, a sortable table, a leaderboard, and a **standards report** (% right on the first try for each Biology key idea, with its unit, class and student by student, with a CSV). It reads Canvas's gradebook export as the class list (real names, who has not turned in) and writes a Canvas gradebook import file. **Grading rounds** count only the work since the last round. The same page is in each Canvas zip as `SOLLab-VA-Bio-Teacher.html` to open on a computer.
  - **Restore my progress** (title screen): paste the newest code on a new Chromebook and the level of every mode, the Fangs, the town or castle, the totals and the badges come back.
  - Where it lives: `js/progress-code.js` (the code format, shared with the teacher page; the Biology game is build `BIO`, id 4), `js/progress.js` (the record in `afterHours.v1.progress.BIO`, the Submit and Restore windows), `js/badges.js`, `js/teacher-screen.js`, `tools/teacher/` and `tools/build-teacher.js` (writes `teacher/BIO.html`, which the Apps Script bundle, the itch zip and GitHub Pages all carry). `node tools/smoke-progress.js` tests the record, the window, the code, the badges, the Teacher screen, Restore and the teacher page end to end.
- **A game mode screen** after the unit: Mixed (the campaign), Labyrinth only, or one shooter on every level. **Each mode keeps its own level** 1 to 100.
- **Badges:** 45 general badges plus Bronze to Champion for levels 10, 25, 50, 75 and 100 in each of the 7 modes (80 in all). The four "skill" badge pairs are Biology units here: Cell Biologist (BIO.2 to BIO.4), Geneticist (BIO.5), Naturalist (BIO.6 to BIO.7) and Field Scientist (BIO.1, BIO.8). A pop-up when one is earned; **My badges** on the title screen.
- **Root Worms**, a centipede-style shooter, joins the rotation (five shooters share levels 2, 4, 6 and 8 of a realm, turning one place every realm). Eagle Swoop's rows are new birds realm by realm (ravens, magpies, hawks, owls, falcons), and after the last answer in Eagle Swoop or Root Worms the student must clear the field. Every mode is harder at every level; Rune Rocks has waves and saucers and the beam stays locked on the rock it is pulling; Wolf Ring is tougher; a caught Sol costs a life only if he is not freed.
- **Canvas zips** (`node tools/build-canvas.js`): `SOL Lab VA Bio.zip` for a first set-up and `SOL Lab VA Bio update.zip` (the .js files only) to update a game already in Canvas, each with a READ ME in numbered sections (set-up, the embed code, grading with the ZIP download, grading rounds, the class list and the import file, students' codes and Restore, troubleshooting) and the teacher page.
- Not carried over: the Odyssey game (its own build, modes, look and packs) and the 9,400 new English questions.

## v6.3.1 (2026-10-03) — the Canvas version: a starter page and its data files, nothing hosted outside the school

For a course in Canvas where the game cannot be hosted on GitHub or any other outside site. `node tools/build-canvas.js` (after `node tools/build-appsscript.js`) writes `dist/canvas/BIO/` and the same files zipped as **`dist/canvas/SOLLab-VA-Bio-Canvas.zip`** (about 5 MB). The 3D castle is in; the music is not. It mirrors SOL Labyrinth v5.8.1–v5.8.2, which found in a real course that Canvas runs the scripts of a small uploaded HTML page but not of a 7 MB one, and that a small page can read files next to it in the same Canvas folder.

- `SOLLab-VA-Bio.html`: the starter page (3 KB), the loading screen and one `<script src>`.
- `SOLLab-VA-Bio-game.js`: the loader, the manifest and the list of data files.
- `SOLLab-VA-Bio-data-01.js` … : the gzip bundle as base64, 576 KB per file. Each file calls `solPart(i, hash, base64)`; a file from another version is refused and a missing or renamed file is named on screen.
- **In Canvas:**
  1. Upload the zip to one folder in **Files** and let Canvas expand it (or upload the files one by one into the same folder).
  2. Embed `SOLLab-VA-Bio.html` in a Page: `<iframe src="/courses/<course>/files/<file id>/preview" width="100%" height="500" allowfullscreen></iframe>`.
  3. If the page never gets past "Loading the game…", that spot in Canvas does not run scripts. Upload `tools/canvas-check.html` (also at https://stumpgreg-ops.github.io/Sol-Lab-VA-EOC-Bio/canvas-check.html) the same way: it says whether a page's code can run there and whether progress can be saved.
- **Saves:** Canvas serves every uploaded file from one shared domain, so this build prefixes the game's localStorage keys with `solLab.bio:`; the reading game (`solReading.va:`) or any other game on the same Canvas cannot read or overwrite them. An update replaces only the `.js` files, so the starter page and every student's progress stay.
- **Not included:** class sessions and the teacher page need the Apps Script server.
- **Smaller bundle (Apps Script version too):** a castle model that differs from an earlier one by one word in its name (the four colours) is stored as a delta of it, and PNGs travel as lossless WebP when that is smaller (`tools/webp-cache.py`, needs Pillow; without it PNGs stay PNG).
- **Test:** `node tools/smoke-canvas.js` serves the files from a Canvas-like folder path (with a space in it) and embeds the starter page in a "course page" on another origin. It checks that the page reads only its own files, that every file is read, that a level starts and the 3D castle draws in all four colours, that music is off, that saves keep their prefix and other games' saves are untouched, and that a missing data file is named.

## v6.3 (2026-10-02) — the Google Apps Script version, class sessions, and the v5.8.0 engine

**For schools that block GitHub Pages and itch.io.** The teacher pastes one small file into a new project on script.google.com and deploys it as a web app; students open the `/exec` link (or the teacher embeds it in Google Sites). The page only ever talks to script.google.com: the script fetches the game from this repository's `gh-pages` branch on Google's servers, where the school's filter never sees the request. The 3D castle is included; the music is not.

- **Set-up (once):** copy `Code.gs` from https://stumpgreg-ops.github.io/Sol-Lab-VA-EOC-Bio/appsscript/Code.gs (or `dist/appsscript/Code.gs` after `node tools/build-appsscript.js`). At script.google.com → New project, replace the contents of `Code.gs` with it, Save, then Deploy → New deployment → Web app, *Execute as: Me*, *Who has access: Anyone* (or your school's domain), Deploy, and authorize it. The Web app URL is the game's link. New versions of the game arrive by themselves: every page load asks for the newest manifest, and a Chromebook downloads the bundle (8.5 MiB) once per version into IndexedDB.
- **Class sessions and a teacher page.** The game link with `?admin=1` opens a PIN-locked teacher page (choose the PIN on the first visit). It makes classes; each class's link is the game link with `?class=CODE`, and only students on that link get the class's settings. Per class: question sets on anything you are teaching (lab notes plus multiple-choice questions, each tagged with a Biology SOL code so it counts toward that standard), hide or reword a regular question, play only the class's sets or mix them in, and a progress table (highest level, current level, right and wrong, level, last seen). Students type a first name or nickname once. Everything is stored inside the Apps Script project; nothing goes in Google Drive. A class plays one unit (or Full review).
- **Where it lives:** `tools/build-appsscript.js` packs the game (503 files, 17 MiB) into one gzip in three parts plus a manifest, `loader.html` and `Code.gs`, under `dist/appsscript/`; `tools/appsscript/` holds the Code.gs template, the loader, the teacher page (`admin.js`, `admin.css`) and a local Apps Script stand-in (`test.html`); `js/classes.js` applies a class to the question bank before `game.js` starts and does nothing without one; `tools/publish-pages.sh` publishes `appsscript/bio/` and `Code.gs` with the game. `node tools/smoke-appsscript.js` checks the whole thing headless: title, a level, every 3D model, cache on revisit, the teacher page, a class session, progress, "only this class's sets", an unknown code, and that no asset ever came from the server.
- **The v5.7.2–v5.8.0 engine from SOL Labyrinth**, with the questions untouched:
  - Every shooter adds something each time it comes round (once a realm); the intro card says what is new. Sun Chariot orbs sit in turning shields with one gap; two horses pull the chariot, and Sol rides the horse team in the maze while the CHARIOT power lasts.
  - Fenrir hunts: he stalks Sol through the whole maze and charges, sooner as chains break. Beating him pays 100 coins plus 25 per realm, Fenrir's Fang (+1 coin on every answer for good) and the realm's monument for the castle (ten pieces that are never sold).
  - Eagle Swoop: no arrows until the flock forms, a bird always diving, guard ravens, bird poo. Rune Rocks: a one-card beam tutorial, right mouse button holds the beam, clicks only fire. Wolf Ring: the runestones rise one or two at a time after the wolves attack.
  - A wrong letter names the letter in the banner and on the end screen, with the keyed answer, so a doubtful question can be checked at once.
  - Town builder: the view holds still while dragging; Turn mirrors a town picture.

## v6.2.1 (2026-10-02) — clean question stems, Google Docs review copy

- Fourteen Evolution & Classification stems carried literal `<strong>` / `<em>` tags that showed as raw text in the side panel; the tags are gone (the lab notes, which render as HTML, keep their bold terms and italic species names).
- The question bank is also published as one Google Doc per unit plus an index doc for the reviewing teacher; the same content stays in `docs/question-bank.md` and `docs/question-bank.html`.

## v6.2 (2026-09-28) — the v5.7.1 engine: realms, Fenrir, shooter levels, the 3D castle

Everything SOL Labyrinth gained between v5.1.1 and v5.7.1 is in the Biology game now, with the questions untouched:

- **Ten realms of ten levels** (`js/realms.js`): Midgard, Niflheim, Jotunheim, Muspelheim, Svartalfheim, Vanaheim, Alfheim, Helheim, Asgard and Ragnarok, each with its own floor, colours, particles, ambient sound, music and creature (ravens, trolls, fire vents, the serpent, golden boars, will-o'-wisps, draugr, valkyries; Ragnarok mixes them). A realm card at the top of the read-first pop-up introduces the realm and its creature.
- **Fenrir on every tenth level.** The great wolf chains the realm gate with one lock per question; each correct answer banked at EXIT breaks one, a wrong letter makes him charge. Clearing a boss level pays 40 coins.
- **Shooter levels on 2, 4, 6 and 8 of every realm** (`js/modes.js`): Eagle Swoop (Galaga style), Rune Rocks (Asteroids style), Sun Chariot (side-scrolling flyer) and Wolf Ring (arena). Same lab notes, same questions, same lives and coins; shoot the letter with the right answer. Odd levels stay in the maze.
- **Castle perks.** Buildings placed in the castle builder give perks in the maze (Swift feet, Sure footing, Lookout, Castle guard, Blessing, Trade, Gold vein, Iron boots, Archers, Warm hearth, Tinkerer, Royal charter, Harvest, Rune of Sol).
- **The castle in 3D** (`js/build3d.js`, three.js): the KayKit and Kenney pieces turn with the map by the degree; walls, gates, hedges and fences are drawn as geometry; 57 KayKit castle pieces; a 2D fallback on a Chromebook without WebGL.
- **The Sol's Labyrinth logo** on the title screen and as the favicon, with the build's version under it.
- **Teacher review copy of every question:** `docs/question-bank.md` (regenerate with `node tools/question-bank.js`) lists all 90 packs and 510 questions by unit and level with keys and standard codes, and explains which items an average student draws.
- `tools/publish-pages.sh` publishes the game to GitHub Pages (branch `gh-pages`); `tools/make-itch-zip.sh` still builds the itch.io upload.
- Not carried over: the New Jersey / Virginia two-build script (`tools/build-games.js`); this game is one course.

## What changed from SOL Labyrinth (v6.0, 2026-09-16)

- **One course, eight units.** The New Jersey / Virginia gateway and the Grade 9 / 10 / 11 cards are gone. The title screen shows **Full review** plus one card per unit, matching the NNPS Biology remediation sequence:

  | card | unit | standards |
  |---|---|---|
  | Full review | every unit mixed, leaning toward the standards the student misses most | BIO.1–BIO.8 |
  | Scientific Investigation | variables, controls, data tables, graphs, conclusions, models | BIO.1 a–f |
  | Biochemistry | water, macromolecules, enzymes, photosynthesis & respiration | BIO.2 a, b, c, e |
  | Cell Structure & Function | cell theory, organelles, membrane & transport, specialization | BIO.3 a–d |
  | Bacteria & Viruses | structure, replication, ecological roles, germ theory | BIO.4 a–e |
  | Genetics & Heredity | meiosis, Mendel, Punnett squares, mutations, biotechnology | BIO.5 c–f |
  | DNA & Protein Synthesis | DNA structure & replication, transcription, translation, history of the model | BIO.5 a, b · BIO.2 d |
  | Evolution & Classification | cladograms, domains, fossils, natural selection, speciation | BIO.6 a–e · BIO.7 a–e |
  | Ecology | populations, energy flow, nutrient cycles, succession, human impact, Virginia ecosystems | BIO.8 a–d |

- **Skill screen = standards.** Each unit's skill cards are the key ideas of its standard (for Ecology: Populations BIO.8 a, Energy & cycles BIO.8 b, Succession BIO.8 c, Human impact & Virginia BIO.8 d, All). Full review's skill cards are the eight standards themselves. The filter matches on the question's `sol` code prefix, so a card such as "Natural selection (BIO.7 b · c)" keeps both key ideas.
- **Lab notes instead of passages.** Every question pack is a short stimulus — a lab write-up, a field study, a data table, a model described in words — with 4–6 test-style items. Data tables render in the side panel and the read-first pop-up. The adaptive picker still keeps a level (1–3) per unit and leans toward weaker standards on All-skills levels; the HUD reads `SOL · BIO.8.a · Level 2`.
- **Stamina retuned for science.** Level 1 aims for ~65-word notes (counts include table cells); the target grows 5 words every 3 levels to ~225 by level 99 (`STAMINA` in `js/content.js`). Pools are written in four length tiers so every level has notes near its target.
- **All English content removed.** The 25 Reading pack files (`js/content2.js`–`content25.js`, Virginia grades 9–11 and New Jersey grade 5) are gone. The eight Biology unit files replace them; every item is original and keyed to a 2018 Virginia Biology SOL key idea.
- **Picker tuned for unit pools.** A level prefers lab notes it has not used yet, but may ask a second question on the same notes when that keeps the length band honest (science item sets normally share a stimulus). The band threshold is 8 items instead of 12.
- Engine, maze, wolves, traps, music, coins, shop, Town & Castle builder, teacher monitor: otherwise unchanged from SOL Labyrinth v5.1.1.

## Files

- `js/content.js` — units (`HEIST_FAMILIES`), the standards map (`HEIST_STANDARDS`), the skill cards per unit (`HEIST_SKILLS`), the strand filter, the difficulty estimate and the stamina schedule. No packs.
- `js/content2.js` Scientific Investigation · `content3.js` Biochemistry · `content4.js` Cells · `content5.js` Bacteria & Viruses · `content6.js` Genetics · `content7.js` DNA & Protein Synthesis · `content8.js` Evolution & Classification · `content9.js` Ecology.
- `tools/CONTENT-GUIDE.md` — pack format, the standards table and the writing rules. `node tools/validate-content.js` checks every file (codes, units, keys, lengths, duplicates); `node tools/validate-content.js js/content9.js` checks one.
- `tools/smoke.js` — headless Playwright run of the title screen, the pools, the builder (2D and 3D), the shop, a level, the ten realms and their creatures, Fenrir, the perks and the four shooter levels (screenshots in `tools/shots/`). `tools/smoke-appsscript.js` does the same for the Apps Script build.
- `js/classes.js` — class sessions for the Apps Script version (`?class=CODE`): hides or rewords regular questions and adds the class's own sets. Does nothing without a class.
- `tools/build-appsscript.js` and `tools/appsscript/` — the Google Apps Script version (see v6.3 above). `tools/build-canvas.js` and `tools/smoke-canvas.js` — the Canvas version (v6.3.1); `tools/canvas-check.html` tells a teacher whether a spot in Canvas runs scripts.
- `tools/question-bank.js` — writes `docs/question-bank.md`, the teacher review copy of every question.
- `tools/make-itch-zip.sh` — builds the itch.io HTML5 upload (`sh tools/make-itch-zip.sh`): index.html at the zip root, about 500 files and 33 MB, under itch.io's 1,000-file limit.
- `tools/publish-pages.sh` — pushes the game and the Apps Script bundle to the `gh-pages` branch for GitHub Pages: https://stumpgreg-ops.github.io/Sol-Lab-VA-EOC-Bio/ (turn Pages on once under Settings → Pages, branch `gh-pages`, folder `/`). Upload it to https://gstump.itch.io/sols-labyrinth-va-bio as an HTML project with "This file will be played in the browser" ticked.

## Standards note

Codes follow the **2018 Virginia Biology Standards of Learning** (BIO.1 scientific and engineering practices; BIO.2 chemical and biochemical processes; BIO.3 cell structure and function; BIO.4 bacteria and viruses; BIO.5 mechanisms of inheritance; BIO.6 modern classification; BIO.7 populations change through time; BIO.8 dynamic equilibria in ecosystems), the standards the EOC Biology test has been built on since spring 2023. The key-idea letters in `js/content.js` were written from the standards as published on VDOE's GoOpenVA resources; if a letter differs from the printed Curriculum Framework, fix the map in `content.js` and the pack codes will follow.

## Engine history

The SOL Labyrinth changelog (v4 → v5.7.1: maze generator, Hati navigator, reading pop-up, coins, shop, Town & Castle builder, atlas sheets, realms, Fenrir, shooter levels, the 3D castle) lives in the SOL Labyrinth repository. Credits for every third-party asset are in `CREDITS.md`.
