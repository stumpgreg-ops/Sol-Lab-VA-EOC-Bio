# Writing question packs for SOL Lab (Virginia Algebra I)

Every pack is one **stimulus** (a short problem set: a scenario with the numbers the items
need, a data table, or a list of equations) plus 4–6 multiple-choice questions ("claims").
Packs live in `js/content*.js`, one file per unit. Each file is an IIFE that pushes into the live
`HEIST_PACKS` array:

```js
/* SOL Lab — Algebra I · <unit>. Original problems only. */
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
  id: "ei-gym-pass",               // unique, lowercase, unit-slug
  family: "EI",                    // EO | EI | FN | ST
  title: "The Gym Pass",
  kind: "Equations & Inequalities · A.EI.1",   // unit name · standard(s)
  blurb: "One line shown on the pack card.",
  level: 2,                        // 1 easy · 2 medium · 3 hard (reading + reasoning load)
  passage: "<p>" + N(1) + "First sentence. " + N(2) + "Second sentence. ... </p>",
  claims: [
    {
      id: "carry",                 // unique within the pack
      sol: "A.EI.1.b",             // standard code from the map below (lower-case letter)
      stem: "How many visits did Leo make last month?",
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

The stimulus is the shared set-up of an item set: a few sentences that give the situation and
every number, equation or table the items need, so that each question can point back to it.
Write it as HTML:

- `<p>` paragraphs, every sentence numbered with `N(i)` so stems can say "In sentence 3, …".
- Data tables use a real `<table>`: `<table><tr><th>x</th><th>0</th><th>2</th><th>4</th></tr><tr><th>y</th><td>5</td><td>9</td><td>13</td></tr></table>`.
  Keep tables to 2–4 columns and 3–6 rows so they fit the side panel on a Chromebook.
- Lists of equations to solve or steps to follow may use `<ol>`/`<ul>`.
- Bold key terms with `<strong>` (the variable definitions, "line of best fit", "vertex").
- No images. Describe a graph, number line or scatterplot in words instead ("a parabola that
  opens downward with vertex (3, 16) and x-intercepts −1 and 7"; "a closed circle at 9, shaded
  to the right").
- Word counts (excluding the sentence numbers and table cells) by tier:

| tier   | levels  | words   | questions |
|--------|---------|---------|-----------|
| tiny   | 1–15    | 30–50   | 5         |
| short  | 16–45   | 50–80   | 5–6       |
| medium | 46–75   | 80–120  | 6         |
| long   | 76–100  | 120–170 | 6         |

The picker aims for a longer stimulus as levels go by (`STAMINA` in `js/content.js`), so each
unit file needs every tier: aim for roughly 4 tiny, 4 short, 3 medium and 2 long packs.

## Units and standards

Packs sit under the four families below and use the **2023 Virginia Algebra I Standards of
Learning** codes (`A.EO.1.a` … `A.ST.1.i`), with the lettered statements exactly as the map in `js/content.js` lists them. `family` decides which unit card the pack sits under
and which codes it may use; the validator rejects a code outside the unit.

| family | unit                      | codes allowed | key ideas |
|--------|---------------------------|---------------|-----------|
| EO     | Expressions & Operations  | A.EO.1–4      | 1 translate & evaluate expressions · 2 polynomial sums, products, factoring, quotients, equivalent forms · 3 laws of exponents · 4 square and cube roots, radical arithmetic, rational exponents ½ and ⅓ |
| EI     | Equations & Inequalities  | A.EI.1–3      | 1 multistep equations and inequalities in one variable, number lines, literal equations, how many solutions · 2 a–c systems of two equations, d–e a linear inequality in two variables, f–g a system of two inequalities, h verifying and interpreting solutions · 3 quadratic equations, number of real solutions, solutions in context |
| FN     | Functions                 | A.F.1–2       | 1 linear functions: a characteristics and their meaning in context (slope, intercepts, zeros, domain, range), b transformations of y = x, c forms of a line, d writing the equation (including direct variation and models), e parallel and perpendicular, f graphing, g function notation, h comparing representations · 2 a is-it-a-function, b quadratic characteristics, c graphing quadratics, d standard/factored form and the graph, e exponential characteristics (growth and decay), f graphing exponentials, g function notation, h comparing linear, quadratic and exponential |
| ST     | Statistics                | A.ST.1        | a–c the data cycle: investigative questions, variables, representative samples · d which model (line or quadratic) and its equation · e regression models and their strengths and weaknesses · f predictions and their validity · g meaning of slope and intercept · h the relationship a scatterplot shows (direction, strength, outliers) · i conclusions and their limits, correlation vs causation |

Rules specific to math packs:

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
- **One defensible answer.** Distractors are plausible (the result of a sign slip, an
  un-flipped inequality, a misread table row, a true statement that answers a different
  question) but clearly wrong on a careful re-read. Keep the four choices similar in length and
  grammar. Never let the correct choice be the only one that repeats a phrase from the stem.
- **Spread the keys**: across a pack's items use each letter at least once, no letter more than
  twice.
- **Stems** use test phrasing: "Which equation represents…", "What is the solution set of…",
  "What does the slope mean in this situation?", "Which statement is supported by the table?",
  "For what value of x is f(x) = 23?", "Select TWO …". Stems that end in a dash have choices
  that complete the sentence (lower-case start).
- **Skills per pack** (6 items): mix at least three different key ideas, and include at least
  one computation item, one representation item (equation, graph or table described in words)
  and one interpretation item (what a number means in context, or whether a claim is justified).
- **Level tags**: in each file spread levels roughly evenly. Level 1 = one step (evaluate, read
  a table, identify a slope); level 3 = multi-step reasoning (a system in context, a quadratic
  model, a judgment about a prediction) or a Select TWO.
- Escape quotes inside JS strings (`\"`), use plain apostrophes, and keep each choice on one
  line as in the existing files.
