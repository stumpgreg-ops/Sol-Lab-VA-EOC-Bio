# SOL Lab — Virginia EOC Biology & Algebra I

The SOL Labyrinth maze-chase engine rebuilt for the **Virginia End-of-Course Biology SOL**, now with a second course for the **Virginia Algebra I SOL** (v6.1). 100 levels per course. Solo Chromebook play in any browser — no install, no login.

**Theme (Norse × SOL):** You are **Sol**, the Norse sun goddess, collecting letter slips in a Pac-like school labyrinth. Ravenous wolves — **Hati** — patrol the corridors. Read the lab notes and the question in the side panel, grab the **correct** letter to summon Sol's **CHARIOT** and smash Hati by contact (they return from the Wolf Pen). A wrong letter sets off the alarm and costs a life. Fruit = coins. Ice = brief escape freeze. **Only one power/effect active at a time.** Every fifth level won earns a piece for the student's own Town or Castle, and coins buy more in the shop.

Play: `index.html`. Teacher monitor: `admin.html` (PIN lock; FERPA nicknames only).

Progress saves in this browser profile, one saved level per course (`afterHours.v1.night` for Biology, `afterHours.v1.night.math` for Algebra I). Itch login does not store progress.

## What changed in v6.1 (2026-09-16): Algebra I course

- **Two courses, one game.** The title screen has a course tab row — **Biology · EOC** and **Algebra I · EOC** — above the unit cards. The tab swaps the unit cards, the kicker and the saved-level line; the maze, wolves, traps, coins, shop and Town & Castle builder are shared. The last course played is remembered (`afterHours.v1.state`).
- **Algebra I units = the four strands of the 2023 Virginia Algebra I Standards of Learning**, plus a Full review card that mixes them and leans toward the standards the student misses most:

  | card | unit | standards | packs · items |
  |---|---|---|---|
  | Full review | every strand mixed | A.EO · A.EI · A.F · A.ST | 51 · 278 |
  | Expressions & Operations | writing and evaluating expressions, polynomials and factoring, laws of exponents, radicals | A.EO.1–4 | 13 · 71 |
  | Equations & Inequalities | multistep equations and inequalities, literal equations, systems, quadratic equations | A.EI.1–3 | 13 · 71 |
  | Functions | linear functions, slope and intercepts, function notation, forms of a line, quadratic and exponential functions | A.F.1–2 | 14 · 77 |
  | Statistics | the data cycle, scatterplots, lines and curves of best fit, predictions and their limits | A.ST.1 | 11 · 59 |

- **Skill screen = standards.** Expressions has one card per standard (A.EO.1 write & evaluate, A.EO.2 polynomials & factoring, A.EO.3 exponents, A.EO.4 radicals), Equations has A.EI.1–3, Functions has A.F.1 and A.F.2, Statistics splits A.ST.1 into *Data cycle & scatterplots* (a–d) and *Best fit & predictions* (e–h). Full review's cards are the ten standards themselves. The HUD reads `SOL · A.EI.2.b · Level 2`.
- **Problem sets instead of lab notes.** Every Algebra pack is a short scenario — a ticket table, a phone plan, a rocket's height table, a scatterplot described in words — with 5–6 test-style items. Stems use plain Unicode math (x², √50, ∛54, −, ≤) so they read the same in the side panel, the read-first pop-up and the maze. Every number was worked by hand; distractors are the usual slips (sign errors, forgetting to flip an inequality, adding exponents instead of multiplying, extrapolating a best-fit line).
- **Shorter stamina curve for math.** Level 1 aims for ~45-word problem sets, growing 4 words every 3 levels to ~160 by level 99 (`COURSES.MATH.stamina` in `js/content.js`); Biology keeps its 65 → 225 curve.
- **Stems render as HTML.** The side panel and read-first pop-up now render question stems as HTML rather than raw text, so the fourteen Biology stems that bold a term (`<strong>cell type</strong>`) or italicize a genus no longer show the tags.
- Validator and smoke test cover both courses: `node tools/validate-content.js` checks Algebra codes against the standards map and the unit, and `node tools/smoke.js` switches to the Algebra I tab, starts a Functions level and checks that its save does not touch the Biology save.

## What changed from SOL Labyrinth (v6.0, 2026-09-16): Biology

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

- `js/content.js` — courses (`HEIST_COURSES`), units (`HEIST_FAMILIES`, each tagged with its course), the standards map (`HEIST_STANDARDS`), the skill cards per unit (`HEIST_SKILLS`), the strand filter, the difficulty estimate and the per-course stamina schedule. No packs.
- Biology: `js/content2.js` Scientific Investigation · `content3.js` Biochemistry · `content4.js` Cells · `content5.js` Bacteria & Viruses · `content6.js` Genetics · `content7.js` DNA & Protein Synthesis · `content8.js` Evolution & Classification · `content9.js` Ecology.
- Algebra I: `js/content10.js` Expressions & Operations · `content11.js` Equations & Inequalities · `content12.js` Functions · `content13.js` Statistics.
- `tools/CONTENT-GUIDE.md` — pack format, the standards table and the writing rules. `node tools/validate-content.js` checks every file (codes, units, keys, lengths, duplicates); `node tools/validate-content.js js/content9.js` checks one.
- `tools/smoke.js` — headless Playwright run of the title screen (both courses), the pools, the builder, the shop, a Biology level and an Algebra I level (screenshots in `tools/shots/`).

## Standards note

**Algebra I** codes follow the **2023 Virginia Mathematics Standards of Learning** for Algebra I (A.EO expressions and operations; A.EI equations and inequalities; A.F functions; A.ST statistics), the standards the Algebra I SOL test has been built on since spring 2025. The lettered knowledge-and-skills statements in `js/content.js` were written from the standards as published by VDOE; the ten standards and their strands are exact, and if a letter differs from the printed Curriculum Framework, fix the map in `content.js` and the pack codes will follow.

**Biology** codes follow the **2018 Virginia Biology Standards of Learning** (BIO.1 scientific and engineering practices; BIO.2 chemical and biochemical processes; BIO.3 cell structure and function; BIO.4 bacteria and viruses; BIO.5 mechanisms of inheritance; BIO.6 modern classification; BIO.7 populations change through time; BIO.8 dynamic equilibria in ecosystems), the standards the EOC Biology test has been built on since spring 2023. The key-idea letters in `js/content.js` were written from the standards as published on VDOE's GoOpenVA resources; if a letter differs from the printed Curriculum Framework, fix the map in `content.js` and the pack codes will follow.

## Engine history

The SOL Labyrinth changelog (v4 → v5.1.1: maze generator, Hati navigator, reading pop-up, coins, shop, Town & Castle builder, atlas sheets) lives in the SOL Labyrinth repository. Credits for every third-party asset are in `CREDITS.md`.
