# Writing question packs for SOL Lab (Virginia EOC Biology and Algebra I)

Every pack is one **stimulus** (a short lab note, scenario, data table or model description —
or, for Algebra I, a short problem set) plus 4–6 multiple-choice questions ("claims"). Packs
live in `js/content*.js`, one file per unit. Each file is an IIFE that pushes into the live
`HEIST_PACKS` array:

```js
/* SOL Lab — <unit>. Original text only. */
(function (global) {
  var P = global.HEIST_PACKS;
  if (!P || !P.push) return;
  var N = function (i) { return '<span class="n">(' + i + ')</span> '; };   // numbered sentence

  var PACKS = [
    { /* pack */ },
    ...
  ];

  for (var i = 0; i < PACKS.length; i++) P.push(PACKS[i]);
})(typeof window !== "undefined" ? window : global);
```

Validate with `node tools/validate-content.js js/contentN.js` — it must print `OK — no errors`.
Fix warnings too where you can (spread answer keys, keep the correct choice from being the longest).

## Pack shape

```js
{
  id: "eco-deer-count",            // unique, lowercase, unit-slug
  family: "ECO",                   // Biology: INV | CHEM | CELL | MICRO | GEN | DNA | EVO | ECO
                                   // Algebra I: EO | EI | FN | ST
  title: "Deer on Bull Run Mountain",
  kind: "Ecology · BIO.8",         // unit name · standard(s)
  blurb: "One line shown on the pack card.",
  level: 2,                        // 1 easy · 2 medium · 3 hard (reading + reasoning load)
  passage: "<p>" + N(1) + "First sentence. " + N(2) + "Second sentence. ... </p>",
  claims: [
    {
      id: "carry",                 // unique within the pack
      sol: "BIO.8.a",              // standard code from the map below (lower-case letter); Algebra: "A.EI.2.b"
      stem: "Which statement best explains why the deer count levelled off after 2019?",
      choices: [
        { letter: "A", text: "..." },
        { letter: "B", text: "..." },
        { letter: "C", text: "..." },
        { letter: "D", text: "..." }
      ],
      correct: "B"                 // or ["A", "C"] for a Select TWO item (stem must say "Select TWO")
    }
  ]
}
```

## The stimulus

The stimulus is what the Virginia test calls the "passage" of a science item set: a few
sentences that set up an investigation, an observation, a model or a data set, and that the
questions can point back to. Write it as HTML:

- `<p>` paragraphs, every sentence numbered with `N(i)` so stems can say "In sentence 3, …".
- Data tables use a real `<table>`: `<table><tr><th>Trial</th><th>Temp (°C)</th><th>Bubbles / min</th></tr><tr><td>1</td><td>10</td><td>4</td></tr>…</table>`.
  Keep tables to 2–4 columns and 3–6 rows so they fit the side panel on a Chromebook.
- Short lists of steps or observations may use `<ol>`/`<ul>`.
- Bold key terms with `<strong>`; use `<em>` for genus and species names.
- No images. Describe a diagram, graph or model in words instead ("The graph shows the
  number of rabbits rising steeply for 6 years, then levelling off at about 400").
- Word counts (excluding the sentence numbers and table cells) by tier:

| tier   | levels  | words   | questions |
|--------|---------|---------|-----------|
| tiny   | 1–15    | 40–70   | 4–5       |
| short  | 16–40   | 70–110  | 5–6       |
| medium | 41–70   | 110–160 | 6         |
| long   | 71–100  | 160–220 | 6         |

The picker aims for a longer stimulus as levels go by (`STAMINA` in `js/content.js`), so each
unit file needs every tier: aim for roughly 3 tiny, 3 short, 3 medium and 2–3 long packs.

## Units and standards

Packs align to the **2018 Virginia Biology Standards of Learning**. `sol` is the standard
and key-idea letter (`BIO.8.a`). A pack's `family` decides which unit card it sits under and
which codes it may use; the validator rejects a code outside the unit.

| family | unit                         | codes allowed                | key ideas |
|--------|------------------------------|------------------------------|-----------|
| INV    | Scientific Investigation     | BIO.1.a–f                    | a questions/problems · b planning & carrying out investigations · c interpreting/analyzing/evaluating data · d conclusions & explanations · e models · f communicating information |
| CHEM   | Biochemistry                 | BIO.2.a, b, c, e             | a water chemistry · b macromolecules · c enzymes · e photosynthesis & respiration (energy capture, storage, transformation, flow) |
| CELL   | Cell Structure & Function    | BIO.3.a–d                    | a cell theory & evidence · b structures work interdependently (organelles, levels of organization) · c membrane structure supports transport · d specialization / differentiation |
| MICRO  | Bacteria & Viruses           | BIO.4.a–e                    | a viruses depend on a host · b reproduction & replication compared · c structures & functions compared · d roles in other organisms and the environment · e germ theory of infectious disease |
| GEN    | Genetics & Heredity          | BIO.5.c, d, e, f             | c cell division & gamete formation · d traits from combinations of alleles (Mendel, Punnett, pedigrees, sex-linked) · e mutations & genetic variation · f synthetic biology / biotechnology & ethics |
| DNA    | DNA & Protein Synthesis      | BIO.5.a, BIO.5.b, BIO.2.d    | 5.a DNA structure & replication · 5.b history of the DNA model · 2.d protein synthesis (transcription, translation, codons) |
| EVO    | Evolution & Classification   | BIO.6.a–e, BIO.7.a–e         | 6.a structural similarities · 6.b fossil record · 6.c developmental stages · 6.d biochemical evidence · 6.e classification adapts to new discoveries · 7.a fossil evidence · 7.b variation, reproductive strategies, environmental pressure · 7.c natural selection → adaptation · 7.d new species · 7.e evidence for evolution |
| ECO    | Ecology                      | BIO.8.a–d                    | a populations: carrying capacity, limiting factors, growth curves · b nutrient cycling & energy flow · c succession · d natural events & human activities, Virginia flora and fauna |

The Virginia test embeds the BIO.1 practices in every unit: a Biochemistry pack can (and
should) include a question about the control group or the trend in the table, but tag it
with the unit's own code (`BIO.2.c`) when it is really about enzymes, and with `BIO.1.x`
**only in the INV unit**. Every unit file should still read like a lab: data, trials, variables.

## Algebra I packs

Algebra packs sit under the four families below and use the **2023 Virginia Algebra I
Standards of Learning** codes (`A.EO.1.a` … `A.ST.1.h`). The validator rejects a Biology code in
an Algebra unit and vice versa.

| family | unit                      | codes allowed | key ideas |
|--------|---------------------------|---------------|-----------|
| EO     | Expressions & Operations  | A.EO.1–4      | 1 translate & evaluate expressions · 2 polynomial sums, products, factoring, quotients, equivalent forms · 3 laws of exponents · 4 square and cube roots, radical arithmetic, rational exponents ½ and ⅓ |
| EI     | Equations & Inequalities  | A.EI.1–3      | 1 multistep equations and inequalities in one variable, number lines, literal equations, how many solutions · 2 systems of two equations, inequalities in two variables, systems of inequalities · 3 quadratic equations, number of real solutions, solutions in context |
| FN     | Functions                 | A.F.1–2       | 1 linear functions: domain/range/zeros/intercepts/slope, forms of a line, parallel and perpendicular, function notation, direct variation, meaning in context, comparing, modeling · 2 is-it-a-function, quadratic and exponential characteristics, factored form and zeros, growth and decay, comparing families, modeling |
| ST     | Statistics                | A.ST.1        | a–d the data cycle: investigative questions, variables, representative samples, scatterplots · e–h line or quadratic curve of best fit, meaning of slope and intercept, direction/strength/outliers, predictions and their limits, correlation vs causation |

Rules that differ from Biology:

- **The stimulus is a problem set**: a scenario with the numbers the items need (a fare, a
  price list, a table of heights, a scatterplot described in words, a list of equations to
  solve). Keep it to 30–120 words; the math stamina curve tops out near 160 words. Tables and
  `<ol>` lists of equations count as words. Every unit still needs a spread of tiny (30–50),
  short (50–80) and medium/long (80–160) packs.
- **Math notation is plain Unicode in stems and choices**: x², x³, √50, ∛54, −, ×, ÷, ≤, ≥, ≠,
  ½, and fractions as `2/3`. Rational exponents are written `8^(1/3)` (say so in the stimulus).
  The stimulus may use `<sup>`/`<sub>`. Stems render as HTML too, but keep them plain so the
  same text reads correctly everywhere.
- **Every number must be worked by hand** before the pack is committed, and the distractors
  should be the errors students actually make: a sign slip, forgetting to reverse an
  inequality, adding exponents where they multiply, distributing to only one term, reading the
  wrong table row, extrapolating a best-fit line past the data.
- **Explanation items** ("why is this correct", "what does the slope mean") are welcome and
  are how the test asks A.EI.1 f, A.EI.2 h, A.EI.3 c and most of A.ST.1, but keep the four
  choices near the same length — the validator warns when the key is the longest.
- **Contexts**: school clubs, phone plans, gyms, taxis, fundraisers, science labs, sports, and
  Virginia where it fits (an oyster reef, a Blue Ridge stream). No real people or brands.

## Writing rules

- **Original text only.** No copied test items, textbook passages or real published data
  sets. No real people. Invented but realistic numbers.
- **Virginia where it fits.** The Chesapeake Bay, the James and Shenandoah rivers, the Blue
  Ridge, salt marshes, oyster reefs, white-tailed deer, bald eagles, brook trout, blue crabs,
  loblolly pine, invasive species like the spotted lanternfly and hydrilla. Do not overdo it:
  about a third of the packs.
- **One defensible answer.** Distractors are plausible (a true-but-off-question fact, a common
  misconception such as "plants do not respire", a reversed cause and effect, a misread table
  row) but clearly wrong on a careful re-read. Keep the four choices similar in length and
  grammar. Never let the correct choice be the only one that repeats a phrase from the stem.
- **Spread the keys**: across a pack's items use each letter at least once, no letter more than
  twice.
- **Stems** use test phrasing: "Which conclusion is best supported by the data in the table?",
  "The independent variable in this investigation is —", "Which statement best explains why…",
  "Based on the model, which of these would most likely happen if…", "Which of the following is
  the best hypothesis for…", "Select TWO …". Stems that end in a dash have choices that
  complete the sentence (lower-case start).
- **Skills per pack** (6 items): mix at least three different key ideas, and include at least
  one data or investigation item (a control, a variable, a trend, a conclusion) and one
  vocabulary-in-context item (a bold term from the stimulus).
- **Level tags**: in each file spread levels roughly evenly. Level 1 = one-step recall or a
  direct read of the table; level 3 = multi-step reasoning, an explanation of mechanism, a
  prediction from a model, or a Select TWO.
- Escape quotes inside JS strings (`\"`), use plain apostrophes, and keep each choice on one
  line as in the existing files.
