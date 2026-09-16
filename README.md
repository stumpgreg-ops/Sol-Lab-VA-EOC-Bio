# SOL Lab — Virginia EOC Biology

The SOL Labyrinth maze-chase engine rebuilt for the **Virginia End-of-Course Biology SOL**. 100 levels. Solo Chromebook play.

**Theme (Norse × SOL):** You are **Sol**, the Norse sun goddess, collecting letter slips in a Pac-like school labyrinth. Ravenous wolves — **Hati** — patrol the corridors. Read the lab notes and the question in the side panel, grab the **correct** letter to summon Sol's **CHARIOT** and smash Hati by contact (they return from the Wolf Pen). A wrong letter sets off the alarm and costs a life. Fruit = coins. Ice = brief escape freeze. **Only one power/effect active at a time.** Every fifth level won earns a piece for the student's own Town or Castle, and coins buy more in the shop.

Play: `index.html`. Teacher monitor: `admin.html` (PIN lock; FERPA nicknames only).

Progress saves in this browser profile (`afterHours.v1.night`). Itch login does not store progress.

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
- `tools/smoke.js` — headless Playwright run of the title screen, the pools, the builder, the shop and a level (screenshots in `tools/shots/`).

## Standards note

Codes follow the **2018 Virginia Biology Standards of Learning** (BIO.1 scientific and engineering practices; BIO.2 chemical and biochemical processes; BIO.3 cell structure and function; BIO.4 bacteria and viruses; BIO.5 mechanisms of inheritance; BIO.6 modern classification; BIO.7 populations change through time; BIO.8 dynamic equilibria in ecosystems), the standards the EOC Biology test has been built on since spring 2023. The key-idea letters in `js/content.js` were written from the standards as published on VDOE's GoOpenVA resources; if a letter differs from the printed Curriculum Framework, fix the map in `content.js` and the pack codes will follow.

## Engine history

The SOL Labyrinth changelog (v4 → v5.1.1: maze generator, Hati navigator, reading pop-up, coins, shop, Town & Castle builder, atlas sheets) lives in the SOL Labyrinth repository. Credits for every third-party asset are in `CREDITS.md`.
