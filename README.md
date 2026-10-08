# SOL Lab — Virginia Algebra I

The SOL Labyrinth maze-chase engine rebuilt for the **Virginia Algebra I SOL** (end-of-course). 100 levels. Solo Chromebook play in any browser — no install, no login.

**Theme (Norse × SOL):** You are **Sol**, the Norse sun goddess, collecting letter slips in a Pac-like school labyrinth. Ravenous wolves — **Hati** — patrol the corridors. Read the problem set and the question in the side panel, grab the **correct** letter to summon Sol's **CHARIOT** and smash Hati by contact (they return from the Wolf Pen). A wrong letter sets off the alarm and costs a life. Fruit = coins. Ice = brief escape freeze. **Only one power/effect active at a time.** Every fifth level won earns a piece for the student's own Town or Castle, and coins buy more in the shop. Every tenth level is a Fenrir boss level; levels 2, 4, 6 and 8 of each realm are shooter levels with the same question.

Play: `index.html`. Teacher monitor: `admin.html` (PIN lock; FERPA nicknames only).

Progress saves in this browser profile (`afterHours.v1.night`). Itch login does not store progress.

## Algebra I 1.1.3 (2026-10-08) — leave a level; the title screen in one 500px screen

- **Leave a level in progress.** A **⏏ Leave** button at the top left of the maze or shooter stage, or the Esc key, pauses the level and asks "Leave this level?"; *Keep playing* resumes, *Leave the level* returns to the title screen the way the end card's *Title* does. The saved level, coins, town or castle and the progress record are untouched, and the level is not counted as lost. (`leaveToTitle` / `openLeave` in `js/game.js`, `#leave-overlay` in `index.html`.)
- **One-card tutorial.** The nine "How to play" cards are one screen: read, move and pick up a letter, carry it to EXIT · SAFE, the chariot and the lives, the safe booths and TAB. Students tapped *Skip intro* on card 1 of 9 and started without knowing how to play; now one tap starts the level with everything read. The button reads *Got it — start* (`tutorialCards` in `js/game.js`).
- **The title screen fits a 500px frame without scrolling** at 1000 and 1280 wide: in a short frame the long blurbs are hidden, the logo is small, the five unit cards sit in one compact row and the buttons and nickname box are tighter; the mode cards drop their descriptions. Measured: title, mode and skill screens each scroll 0px at 1000×500 and 1280×500.

## Algebra I 1.1.2 (2026-10-08) — fits a 500-pixel-tall frame

- **Short frames.** The Canvas embed is now `width="100%" height="500"`, and the game fits it: below 560px of height the start screens use a small logo and tighter cards so the five unit cards show without scrolling, the play screen keeps the problem set beside the maze whenever the frame is at least 760px wide (stacking it on top left a 280px maze), and a narrow *and* short frame stacks with a taller panel so the notes and all four choices stay readable. End-of-level and shop cards scroll inside the frame instead of clipping (`@media (max-height: 560px)` in `css/after-hours.css`).

## Algebra I 1.1.1 (2026-10-08) — engine v5.17.1

- **Standards report with LOTS / HOTS.** The backbone's v5.17 gives each game a standards file for the teacher screen; `tools/build-standards.js` writes ours, `js/standards-alg.js`, from `HEIST_STANDARDS`: each standard's name and its lettered statements as skills, each lower-order (solve, simplify, graph, write) or higher-order (analyze, compare, justify, verify, interpret in context, conclude). The teacher screen groups every code's results under its standard, shows the LOTS/HOTS split and flags a gap. Rebuild it after editing the standards map.
- `js/progress.js` takes a question's skill from `claim.sub` before `claim.sol` (v5.17; Algebra questions have no `sub`, their `sol` is the skill). `js/progress-code.js` appends the backbone's Reading skill list after the Algebra codes (append only, so yesterday's Algebra codes still read).
- Teacher page rebuilt from the v5.17.1 page: *Scoring criteria* is box 1, codes are box 2, *Submit codes* replaces *Finish this grading round*.

## Algebra I 1.1.0 (2026-10-07) — engine synced to SOL Labyrinth v5.16.0

The engine files are now the ones the Reading game ships at v5.16.0 (taken from its Canvas update of 2026-10-07 and unpacked); the Algebra bank, the standards map, the unit cards and the course wording are unchanged. New for students and teachers:

- **A game-mode screen** between the unit and the skill: *Mixed* (the campaign as before: maze on odd levels, a shooter on even ones, Fenrir every tenth) or one mode on every level — Labyrinth, Eagle Swoop, Rune Rocks, Sun Chariot, Wolf Ring or the new Root Worms. **Each mode keeps its own level** (`afterHours.v1.night.<mode>`); an older save moves to the mode last played.
- **Progress codes.** The game cannot send anything out of Canvas, so *Submit my progress* (title screen and end-of-level card) copies a code like `SOL3-ALG-4110-…` that a student pastes into a Canvas assignment. It carries days and minutes played, levels, questions answered and right on the first try, each standard practised (A.EO.1.a … A.ST.1.i), each game mode's level, streaks, badges, and everything needed to **Restore my progress** on a new Chromebook (level, town or castle, coins, Fangs). The format is `js/progress-code.js`, shared with the Reading game; this game is build `ALG` (id 4) with the ten standards as its skills.
- **Badges** (`js/badges.js`, *My badges* on the title screen) for levels in each mode, questions, streaks, perfect levels, standards, days and time.
- **The teacher screen inside the game** (`teacher/ALG.html`, opened by `js/teacher-screen.js`). The *Teacher* link is hidden: type `teacher` in the nickname box on the title screen and confirm, once per computer. Drop the assignment's *Download Submissions* zip (or the gradebook CSV) on it to see every student's numbers, a suggested grade, a leaderboard, a standards report and a Canvas gradebook import file; *Finish this grading round* makes the next round count only new work. `node tools/build-teacher.js` rebuilds the page from `tools/teacher-page.html` with `js/progress-code.js` inlined.
- Engine fixes since v5.7.1 the Algebra build had not had: Fenrir stalks the whole maze and pants between charges, Fenrir's Fangs (+1 coin an answer per realm freed) and a monument in the castle for each realm beaten, Sol rides the chariot while the power lasts, the wrong-letter screen says which letter was picked, the town builder holds the view still while a piece is dragged, Eagle Swoop's birds and clouds, Rune Rocks' comets, the Wolf Ring's rising runestones.
- Four Odyssey-only modes (`js/mode-*.js`) ride along inert, as in the Reading build, so the engine files stay identical to the backbone for the next sync.

Two Algebra-marked lines in the engine: `js/progress.js` takes a claim's skill from `claim.standard` (A.EO.1) before `claim.strand` (A.EO.1.B), and lets a non-Reading unit fall back to the game's state for the record; `js/progress-code.js` gains the ALG build and the Algebra codes in its standards list. `index.html` sets `window.SOL_STATE = "ALG"`, the engine's own single-game switch, so the old state gateway never shows.

## Algebra I 1.0.2 (2026-10-03)

- **Full review's skill cards read in one line each.** The ten standard cards carried every lettered statement (up to 1,100 characters a card); they now show a one-line blurb (`blurb` in `HEIST_STANDARDS`); the full letters stay in `keys` for the validator, the question bank and the content guide.
- **Tall screens scroll from the top.** The title, skill and state screens centred their content and clipped the top when it was taller than the window, which inside a 760-pixel LMS frame hid the heading and the first rows of cards. They now centre when the content fits and scroll from the top when it does not (`.screen` in `css/after-hours.css`).
- Canvas build (`tools/build-canvas.js`) and the one-file build rebuilt from this version.

## Algebra I 1.0.1 (2026-10-02)

- **Standards map corrected to the published 2023 letters.** The 1.0.0 map was written from memory of the standards; checked against the published text, A.EO.1–4, A.EI.1 and A.EI.3 matched, but A.EI.2 d–g, A.F.1, A.F.2 and A.ST.1 did not (the published A.F.1 has eight letters, not twelve; A.F.2 eight, not nine; A.ST.1 nine, not eight; and A.EI.2 d/f are *create* an inequality / a system of inequalities, g is *graph* the system). `HEIST_STANDARDS` now carries the published wording, 93 items were recoded to the letters they actually assess, and the Statistics skill cards split A.ST.1 as a–c + h (data cycle and reading scatterplots) and d–g + i (best fit, predictions, conclusions). No stems, choices or keys changed. `docs/question-bank.*` regenerated.
- Known gap for the next content pass: no item yet assesses A.EI.2.d (create a linear inequality in two variables), A.F.1.b (transformations of y = x) or A.F.2.c/f (graphing quadratics and exponentials with transformations), and only a handful touch A.ST.1.d/e as written (choosing and fitting a model with technology).

## Algebra I 1.0.0 (2026-10-02)

Built from the SOL Lab Biology game at v6.2.1, which carries the SOL Labyrinth v5.7.1 engine (ten realms, Fenrir, the four shooter levels, castle perks, the 3D castle, the logo). The Biology item bank is replaced by an Algebra I bank; the engine is otherwise untouched.

- **One course, four strands.** The title screen shows **Full review** plus one card per strand of the 2023 Virginia Algebra I Standards of Learning:

  | card | strand | what it covers | packs · items |
  |---|---|---|---|
  | Full review | A.EO · A.EI · A.F · A.ST | every strand mixed, leaning toward the standards the student misses most | 51 · 278 |
  | Expressions & Operations | A.EO.1–4 | writing and evaluating expressions; polynomial sums, products, factoring and quotients; laws of exponents; square and cube roots, radical arithmetic, rational exponents | 13 · 71 |
  | Equations & Inequalities | A.EI.1–3 | multistep equations and inequalities in one variable, number-line graphs, literal equations, how many solutions; systems of two equations, inequalities in two variables; quadratic equations and their number of real solutions | 13 · 71 |
  | Functions | A.F.1–2 | linear functions: slope, intercepts, zeros, function notation, forms of a line, parallel and perpendicular, direct variation, meaning in context; is-it-a-function, quadratic and exponential characteristics, growth and decay, comparing function families | 14 · 77 |
  | Statistics | A.ST.1 | the data cycle: investigative questions, variables, representative samples, scatterplots; lines and curves of best fit, slope and intercept in context, outliers, predictions and their limits, correlation versus causation | 11 · 59 |

- **Skill screen = standards.** Expressions has one card per standard (A.EO.1 write & evaluate, A.EO.2 polynomials & factoring, A.EO.3 exponents, A.EO.4 radicals), Equations has A.EI.1–3, Functions has A.F.1 and A.F.2, and Statistics splits A.ST.1 into *Data cycle & scatterplots* (a–c, h) and *Best fit & predictions* (d–g, i). Full review's cards are the ten standards themselves. The filter matches on the question's `sol` code prefix; `STRAND_ALIASES` in `js/content.js` lets one card keep several letters. The HUD reads `SOL · A.EI.2.b · Level 2`.
- **Problem sets instead of lab notes.** Every pack is a short scenario — a ticket table, a phone plan, a rocket's height table, a scatterplot described in words, a list of equations to solve — with 5–6 test-style items. Stems and choices use plain Unicode math (x², √50, ∛54, −, ≤) so they read the same in the side panel, the read-first pop-up and the shooter levels. Every number was worked by hand; distractors are the usual student slips (sign errors, forgetting to flip an inequality, adding exponents that should multiply, extrapolating a best-fit line past the data).
- **Stamina retuned for math.** Level 1 aims for ~45-word problem sets, growing 4 words every 3 levels to ~170 by level 99 (`STAMINA` in `js/content.js`). Pools are written in short, medium and long tiers so every level has sets near its target.
- **Teacher review copy of every question:** `docs/question-bank.md` and `docs/question-bank.html` (regenerate with `node tools/question-bank.js`) list all 51 packs and 278 questions by strand and level with keys and standard codes, and explain which items an average student draws.
- Validator and smoke test cover the Algebra bank: `node tools/validate-content.js` checks every code against the standards map and the strand; `node tools/smoke.js` drives the title screen, the pools, the builder (2D and 3D), the shop, a Functions level, the ten realms and their creatures, Fenrir, the perks and the four shooter levels.

## The standards this build reviews

Codes follow the **2023 Virginia Mathematics Standards of Learning** for Algebra I, the standards the Algebra I SOL test has been built on since spring 2025: A.EO expressions and operations (A.EO.1–4), A.EI equations and inequalities (A.EI.1–3), A.F functions (A.F.1–2) and A.ST statistics (A.ST.1). The ten standards, their strands and the lettered knowledge-and-skills statements in `js/content.js` (`HEIST_STANDARDS`) follow the published 2023 standards (checked letter by letter on 2026-10-02 against the standards text as published; the Curriculum Framework's extra teacher notes were not consulted). If VDOE revises a letter, fix the map in `content.js` first — the pack codes and skill cards follow it.

- Mathematics Standards of Learning and curriculum frameworks: https://www.doe.virginia.gov/teaching-learning-assessment/k-12-standards-instruction/mathematics
- Test blueprints: https://www.doe.virginia.gov/teaching-learning-assessment/student-assessment/virginia-sol-assessment-program/test-blueprints (Algebra I SOL Test)

## Files

- `js/content.js` — units (`HEIST_FAMILIES`), the standards map (`HEIST_STANDARDS`), the skill cards per unit (`HEIST_SKILLS`), the strand filter and its aliases, the difficulty estimate and the stamina schedule. No packs.
- `js/content2.js` Expressions & Operations (A.EO) · `content3.js` Equations & Inequalities (A.EI) · `content4.js` Functions (A.F) · `content5.js` Statistics (A.ST).
- `tools/CONTENT-GUIDE.md` — pack format, the standards table, math notation conventions and the writing rules. `node tools/validate-content.js` checks every file (codes, units, keys, lengths, duplicates); `node tools/validate-content.js js/content4.js` checks one.
- `tools/smoke.js` — headless Playwright run of the whole game (screenshots in `tools/shots/`).
- `tools/build-teacher.js` + `tools/teacher-page.html` — writes `teacher/ALG.html`, the teacher screen (see *1.1.0*), with `js/progress-code.js` and `js/standards-alg.js` (from `tools/build-standards.js`) inlined. `js/progress-code.js` is the progress-code format shared with the Reading game; `js/progress.js`, `js/badges.js`, `js/teacher-screen.js`, `js/classes.js` and `js/mode-*.js` are engine files from the backbone.
- `tools/question-bank.js` — writes `docs/question-bank.md` and `docs/question-bank.html`, the teacher review copy of every question.
- `tools/make-itch-zip.sh` — builds the itch.io HTML5 upload (`sh tools/make-itch-zip.sh`): index.html at the zip root, under itch.io's 1,000-file limit. Upload it as an HTML project with "This file will be played in the browser" ticked.
- `tools/build-canvas.js` — the **Canvas build** (`dist/canvas/`, `dist/SOLLab-VA-Algebra-Canvas.zip`): starter page + loader + data files, see *Hosting* below. `tools/canvas-loader.js` is the in-page loader, `tools/canvas-starter.html` the starter template, `tools/png2webp.py` the lossless-WebP step.
- `tools/make-single-file.js` — builds **one self-contained HTML file** of the game (`dist/sol-lab-va-algebra.html`, about 10 MB; `--with-music` adds the nine tracks, about 35 MB) for places that cannot serve a folder or reach GitHub: an LMS file area such as Canvas Files, a shared drive, a USB stick. Styles, scripts and images are inlined and a small shim points the game's loaders at the inlined copies; the 3D castle kit is left out, so the builder shows its 2D view. `node tools/check-single-file.js [file | dist/canvas]` opens the file from disk, or serves the Canvas folder, in headless Chromium and plays into a level with no outside request allowed.
- `tools/publish-pages.sh` — pushes the game to the `gh-pages` branch for GitHub Pages: https://stumpgreg-ops.github.io/Sol-Lab-VA-EOC-Algebra/ (turn Pages on once under Settings → Pages, branch `gh-pages`, folder `/`).

## Hosting where GitHub is blocked (Canvas and other LMSs)

The game is static files and needs no server, login or build step, so any host that serves files over HTTPS works: itch.io (`tools/make-itch-zip.sh`), GitHub Pages (`tools/publish-pages.sh`), Netlify, Vercel, Cloudflare Pages or a school web server. Where students cannot reach GitHub, upload the **Canvas build** to the course's Files, the same way the SOL Labyrinth Reading game is delivered:

1. `node tools/build-canvas.js` writes `dist/canvas/` and `dist/SOLLab-VA-Algebra-Canvas.zip` (about 6.5 MB): a small starter page `SOLLab-VA-Algebra.html`, the loader `SOLLab-VA-Algebra-game.js` and the game in data files `SOLLab-VA-Algebra-data-01.js` … `-09.js`. Canvas runs the scripts of a small page but not of a big one, so the game travels in the data files: one gzip bundle of every file it needs (markup, CSS, scripts, 3D kit, art), base64 and split. PNGs travel as lossless WebP and near-copy models as deltas, which is why 37 MB of game fits in 6.5 MB. Music stays out (`--with-music` adds it). Needs Pillow for the WebP step (`python3 -m pip install pillow`; `--no-webp` skips it).
2. Unzip and upload **all eleven files into one Canvas folder**, names unchanged (Files → the folder → Upload).
3. Link or frame the `.html`: as a module item (Files → the page), or on a page in the HTML editor (`</>`), replacing `COURSE_ID` with the number in the course URL and the folder path with yours (the Reading game's README gives the other working form, `/courses/COURSE_ID/files/FILE_ID/preview`, where FILE_ID is the number Canvas shows in the address bar after clicking the `.html` once in Files):

   ```html
   <p><a href="/courses/COURSE_ID/file_contents/course%20files/SOLLab-VA-Algebra.html" target="_blank" rel="noopener">Open SOL Lab: Algebra I in a new tab</a></p>
   <iframe src="/courses/COURSE_ID/file_contents/course%20files/SOLLab-VA-Algebra.html" title="SOL Lab: Virginia Algebra I" width="100%" height="500" style="border:0; display:block;" allow="fullscreen; autoplay" allowfullscreen loading="lazy"></iframe>
   ```

The loader (`tools/canvas-loader.js`, shared with the backbone) gunzips the bundle in memory and answers every request the game makes for `assets/…`, `js/…` or `css/…` from it (fetch, XMLHttpRequest, `<img src>`, `<audio src>`, CSS `url()`), hands out `data:` URLs because Canvas's file domain may refuse `blob:` ones, and prefixes the saves in localStorage with `solReading.algebra:` so the Reading, Biology and Algebra games can share Canvas's one file domain without overwriting each other's progress. `node tools/check-single-file.js dist/canvas` serves the folder over http and plays into a level with no request allowed outside it.

**Updating a game already in Canvas:** upload the new `-game.js` and `-data-NN.js` files into the same folder and choose *Replace* for each; the `.html` can stay (it does not change between versions), so the page link and students' progress keep working. Delete any `-data-NN.js` with a number the new build no longer has.

Canvas strips `<script>` from page bodies, so no game can be pasted into a page directly. Keys reach the maze only after the student clicks inside the frame, which is why the new-tab link is there. The teacher monitor (`admin.html`) is not part of the Canvas build.

**One-file alternative** for a shared drive or USB stick: `node tools/make-single-file.js` writes `dist/sol-lab-va-algebra.html` (about 10 MB, no music, 2D castle); it runs from `file://`. Canvas may show a file that large as a preview that cannot run, so prefer the Canvas build there.

## Engine history

The SOL Labyrinth changelog (v4 → v5.7.1: maze generator, Hati navigator, reading pop-up, coins, shop, Town & Castle builder, atlas sheets, realms, Fenrir, shooter levels, the 3D castle) lives in the SOL Labyrinth repository; the science rebuild (unit cards, short stimuli, data tables, unit-pool picker) is described in the SOL Lab Biology repository. Credits for every third-party asset are in `CREDITS.md`.
