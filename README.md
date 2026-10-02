# SOL Lab — Virginia Algebra I

The SOL Labyrinth maze-chase engine rebuilt for the **Virginia Algebra I SOL** (end-of-course). 100 levels. Solo Chromebook play in any browser — no install, no login.

**Theme (Norse × SOL):** You are **Sol**, the Norse sun goddess, collecting letter slips in a Pac-like school labyrinth. Ravenous wolves — **Hati** — patrol the corridors. Read the problem set and the question in the side panel, grab the **correct** letter to summon Sol's **CHARIOT** and smash Hati by contact (they return from the Wolf Pen). A wrong letter sets off the alarm and costs a life. Fruit = coins. Ice = brief escape freeze. **Only one power/effect active at a time.** Every fifth level won earns a piece for the student's own Town or Castle, and coins buy more in the shop. Every tenth level is a Fenrir boss level; levels 2, 4, 6 and 8 of each realm are shooter levels with the same question.

Play: `index.html`. Teacher monitor: `admin.html` (PIN lock; FERPA nicknames only).

Progress saves in this browser profile (`afterHours.v1.night`). Itch login does not store progress.

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

- **Skill screen = standards.** Expressions has one card per standard (A.EO.1 write & evaluate, A.EO.2 polynomials & factoring, A.EO.3 exponents, A.EO.4 radicals), Equations has A.EI.1–3, Functions has A.F.1 and A.F.2, and Statistics splits A.ST.1 into *Data cycle & scatterplots* (a–d) and *Best fit & predictions* (e–h). Full review's cards are the ten standards themselves. The filter matches on the question's `sol` code prefix; `STRAND_ALIASES` in `js/content.js` lets one card keep several letters. The HUD reads `SOL · A.EI.2.b · Level 2`.
- **Problem sets instead of lab notes.** Every pack is a short scenario — a ticket table, a phone plan, a rocket's height table, a scatterplot described in words, a list of equations to solve — with 5–6 test-style items. Stems and choices use plain Unicode math (x², √50, ∛54, −, ≤) so they read the same in the side panel, the read-first pop-up and the shooter levels. Every number was worked by hand; distractors are the usual student slips (sign errors, forgetting to flip an inequality, adding exponents that should multiply, extrapolating a best-fit line past the data).
- **Stamina retuned for math.** Level 1 aims for ~45-word problem sets, growing 4 words every 3 levels to ~170 by level 99 (`STAMINA` in `js/content.js`). Pools are written in short, medium and long tiers so every level has sets near its target.
- **Teacher review copy of every question:** `docs/question-bank.md` and `docs/question-bank.html` (regenerate with `node tools/question-bank.js`) list all 51 packs and 278 questions by strand and level with keys and standard codes, and explain which items an average student draws.
- Validator and smoke test cover the Algebra bank: `node tools/validate-content.js` checks every code against the standards map and the strand; `node tools/smoke.js` drives the title screen, the pools, the builder (2D and 3D), the shop, a Functions level, the ten realms and their creatures, Fenrir, the perks and the four shooter levels.

## The standards this build reviews

Codes follow the **2023 Virginia Mathematics Standards of Learning** for Algebra I, the standards the Algebra I SOL test has been built on since spring 2025: A.EO expressions and operations (A.EO.1–4), A.EI equations and inequalities (A.EI.1–3), A.F functions (A.F.1–2) and A.ST statistics (A.ST.1). The ten standards and their strands are exact. The lettered knowledge-and-skills statements in `js/content.js` (`HEIST_STANDARDS`) were written from the standards as published by VDOE; **check them against the printed Curriculum Framework before the first classroom run**, and if a letter differs, fix the map in `content.js` — the pack codes and skill cards follow it.

- Mathematics Standards of Learning and curriculum frameworks: https://www.doe.virginia.gov/teaching-learning-assessment/k-12-standards-instruction/mathematics
- Test blueprints: https://www.doe.virginia.gov/teaching-learning-assessment/student-assessment/virginia-sol-assessment-program/test-blueprints (Algebra I SOL Test)

## Files

- `js/content.js` — units (`HEIST_FAMILIES`), the standards map (`HEIST_STANDARDS`), the skill cards per unit (`HEIST_SKILLS`), the strand filter and its aliases, the difficulty estimate and the stamina schedule. No packs.
- `js/content2.js` Expressions & Operations (A.EO) · `content3.js` Equations & Inequalities (A.EI) · `content4.js` Functions (A.F) · `content5.js` Statistics (A.ST).
- `tools/CONTENT-GUIDE.md` — pack format, the standards table, math notation conventions and the writing rules. `node tools/validate-content.js` checks every file (codes, units, keys, lengths, duplicates); `node tools/validate-content.js js/content4.js` checks one.
- `tools/smoke.js` — headless Playwright run of the whole game (screenshots in `tools/shots/`).
- `tools/question-bank.js` — writes `docs/question-bank.md` and `docs/question-bank.html`, the teacher review copy of every question.
- `tools/make-itch-zip.sh` — builds the itch.io HTML5 upload (`sh tools/make-itch-zip.sh`): index.html at the zip root, under itch.io's 1,000-file limit. Upload it as an HTML project with "This file will be played in the browser" ticked.
- `tools/publish-pages.sh` — pushes the game to the `gh-pages` branch for GitHub Pages: https://stumpgreg-ops.github.io/Sol-Lab-VA-EOC-Algebra/ (turn Pages on once under Settings → Pages, branch `gh-pages`, folder `/`).

## Engine history

The SOL Labyrinth changelog (v4 → v5.7.1: maze generator, Hati navigator, reading pop-up, coins, shop, Town & Castle builder, atlas sheets, realms, Fenrir, shooter levels, the 3D castle) lives in the SOL Labyrinth repository; the science rebuild (unit cards, short stimuli, data tables, unit-pool picker) is described in the SOL Lab Biology repository. Credits for every third-party asset are in `CREDITS.md`.
