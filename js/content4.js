/* SOL Lab — Algebra I · Functions (A.F). Original problems only.
   Stems are plain text (Unicode: x², −, ≤, ≥, →); the stimulus may use HTML. */
(function (global) {
  var P = global.HEIST_PACKS;
  if (!P || !P.push) return;
  var N = function (i) { return '<span class="n">(' + i + ')</span> '; };   // numbered sentence

  var PACKS = [

    /* ---------- tiny · level 1 · A.F.1 ---------- */
    {
      id: "fn-taxi-fare",
      family: "FN",
      title: "The Airport Taxi",
      kind: "Functions · A.F.1",
      blurb: "f(m) = 2.5m + 3. What do the slope and the intercept mean for the rider?",
      level: 1,
      passage: "<p>" + N(1) + "An airport taxi charges a flat $3 plus $2.50 per mile. " + N(2) + "The fare for a trip of m miles is the function <strong>f(m) = 2.5m + 3</strong>. " + N(3) + "Imani wants to know what a 6-mile trip costs and how far she can ride for $23.</p>",
      claims: [
        {
          id: "slope",
          sol: "A.F.1.h",
          stem: "What does the slope 2.5 represent in this situation?",
          choices: [
            { letter: "A", text: "the flat fee charged before the trip starts" },
            { letter: "B", text: "the cost per mile" },
            { letter: "C", text: "the number of miles in the trip" },
            { letter: "D", text: "the fare for a 1-mile trip" }
          ],
          correct: "B"
        },
        {
          id: "intercept",
          sol: "A.F.1.h",
          stem: "What does the y-intercept 3 represent?",
          choices: [
            { letter: "A", text: "the flat fee, the fare for a 0-mile trip" },
            { letter: "B", text: "the cost of the third mile" },
            { letter: "C", text: "the number of passengers allowed" },
            { letter: "D", text: "the fare for a 3-mile trip" }
          ],
          correct: "A"
        },
        {
          id: "evaluate",
          sol: "A.F.1.f",
          stem: "What is f(6)?",
          choices: [
            { letter: "A", text: "$15" },
            { letter: "B", text: "$11.50" },
            { letter: "C", text: "$18" },
            { letter: "D", text: "$33" }
          ],
          correct: "C"
        },
        {
          id: "inverse",
          sol: "A.F.1.f",
          stem: "For what value of m does f(m) = 23?",
          choices: [
            { letter: "A", text: "m = 9.2" },
            { letter: "B", text: "m = 10.4" },
            { letter: "C", text: "m = 20" },
            { letter: "D", text: "m = 8" }
          ],
          correct: "D"
        },
        {
          id: "table",
          sol: "A.F.1.i",
          stem: "A rival taxi's fare table shows $8 for 2 miles and $18 for 6 miles. How do the two taxis compare?",
          choices: [
            { letter: "A", text: "The rival charges more per mile, 2.5 versus 2." },
            { letter: "B", text: "The rival charges the same per mile but a higher flat fee." },
            { letter: "C", text: "The rival charges $2.50 per mile with a $3 flat fee, the same as Imani's taxi." },
            { letter: "D", text: "The rival charges less per mile, 2.5 versus 3." }
          ],
          correct: "C"
        }
      ]
    },

    /* ---------- tiny · level 1 · A.F.1 ---------- */
    {
      id: "fn-table-line",
      family: "FN",
      title: "Reading a Function Table",
      kind: "Functions · A.F.1",
      blurb: "A table of x and y values. Find the slope, the intercept and the rule.",
      level: 1,
      passage: "<p>" + N(1) + "Mr. Diaz shows a table and says it comes from a linear function. " + N(2) + "The class must find the <strong>slope</strong>, the <strong>y-intercept</strong> and an equation, then extend the table.</p>" +
        "<table><tr><th>x</th><th>0</th><th>2</th><th>4</th><th>6</th></tr><tr><th>y</th><td>5</td><td>9</td><td>13</td><td>17</td></tr></table>",
      claims: [
        {
          id: "slope",
          sol: "A.F.1.c",
          stem: "What is the slope of the function in the table?",
          choices: [
            { letter: "A", text: "4" },
            { letter: "B", text: "2" },
            { letter: "C", text: "1/2" },
            { letter: "D", text: "5" }
          ],
          correct: "B"
        },
        {
          id: "equation",
          sol: "A.F.1.d",
          stem: "Which equation represents the function?",
          choices: [
            { letter: "A", text: "y = 5x + 2" },
            { letter: "B", text: "y = 4x + 5" },
            { letter: "C", text: "y = 2x + 5" },
            { letter: "D", text: "y = 2x − 5" }
          ],
          correct: "C"
        },
        {
          id: "extend",
          sol: "A.F.1.f",
          stem: "What is the value of y when x = 10?",
          choices: [
            { letter: "A", text: "25" },
            { letter: "B", text: "45" },
            { letter: "C", text: "21" },
            { letter: "D", text: "15" }
          ],
          correct: "A"
        },
        {
          id: "zero",
          sol: "A.F.1.a",
          stem: "What is the zero (x-intercept) of the function?",
          choices: [
            { letter: "A", text: "x = 5" },
            { letter: "B", text: "x = 2.5" },
            { letter: "C", text: "x = 0" },
            { letter: "D", text: "x = −2.5" }
          ],
          correct: "D"
        },
        {
          id: "function",
          sol: "A.F.2.a",
          stem: "Why does the table represent a function?",
          choices: [
            { letter: "A", text: "Every y-value in the table is odd." },
            { letter: "B", text: "Each x-value is paired with exactly one y-value." },
            { letter: "C", text: "The y-values increase as x increases." },
            { letter: "D", text: "The x-values are all even numbers." }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- tiny · level 1 · A.F.2 ---------- */
    {
      id: "fn-is-it-a-function",
      family: "FN",
      title: "Is It a Function?",
      kind: "Functions · A.F.2",
      blurb: "Ordered pairs, a mapping and two graphs. Which relations are functions?",
      level: 1,
      passage: "<p>" + N(1) + "A <strong>relation</strong> is any set of ordered pairs; a <strong>function</strong> pairs each input with exactly one output. " + N(2) + "The warm-up shows four relations. " + N(3) + "Relation R: {(1, 3), (2, 5), (3, 3), (4, 7)}. " + N(4) + "Relation S: {(2, 4), (2, 6), (3, 8)}. " + N(5) + "Graph T is a circle. " + N(6) + "Graph U is a parabola opening upward.</p>",
      claims: [
        {
          id: "r",
          sol: "A.F.2.a",
          stem: "Is relation R a function?",
          choices: [
            { letter: "A", text: "No, because the output 3 appears twice." },
            { letter: "B", text: "No, because the inputs are not all even." },
            { letter: "C", text: "Yes; each input has one output, even if outputs repeat." },
            { letter: "D", text: "Yes, because it has four ordered pairs." }
          ],
          correct: "C"
        },
        {
          id: "s",
          sol: "A.F.2.a",
          stem: "Why is relation S not a function?",
          choices: [
            { letter: "A", text: "The input 2 has two different outputs, 4 and 6." },
            { letter: "B", text: "It has only three ordered pairs." },
            { letter: "C", text: "The outputs 4, 6 and 8 are all even." },
            { letter: "D", text: "The input 3 has only one output." }
          ],
          correct: "A"
        },
        {
          id: "vertical",
          sol: "A.F.2.a",
          stem: "Which statement about graphs T and U is correct?",
          choices: [
            { letter: "A", text: "Both are functions because both are smooth curves." },
            { letter: "B", text: "T is not a function because a vertical line can cross it twice; U is a function." },
            { letter: "C", text: "U is not a function because a horizontal line can cross it twice; T is a function." },
            { letter: "D", text: "Neither is a function because neither is a straight line." }
          ],
          correct: "B"
        },
        {
          id: "domain",
          sol: "A.F.1.a",
          stem: "What is the domain of relation R?",
          choices: [
            { letter: "A", text: "{3, 5, 7}" },
            { letter: "B", text: "{1, 2, 3, 4}" },
            { letter: "C", text: "all real numbers" },
            { letter: "D", text: "{1, 3, 5, 7}" }
          ],
          correct: "B"
        },
        {
          id: "range",
          sol: "A.F.1.a",
          stem: "What is the range of relation R?",
          choices: [
            { letter: "A", text: "{3, 5, 7}" },
            { letter: "B", text: "{1, 2, 3, 4}" },
            { letter: "C", text: "{3, 5, 3, 7}" },
            { letter: "D", text: "all numbers from 3 to 7" }
          ],
          correct: "A"
        }
      ]
    },

    /* ---------- tiny · level 1 · A.F.1 ---------- */
    {
      id: "fn-function-notation",
      family: "FN",
      title: "Function Notation Drill",
      kind: "Functions · A.F.1",
      blurb: "f(x) = −2x + 9 and g(x) = x² + 1. Inputs, outputs and zeros.",
      level: 1,
      passage: "<p>" + N(1) + "Two functions are on the board: <strong>f(x) = −2x + 9</strong> and <strong>g(x) = x² + 1</strong>. " + N(2) + "The notation f(−3) means \"the output of f when the input is −3.\" " + N(3) + "A <strong>zero</strong> of a function is an input that makes the output 0.</p>",
      claims: [
        {
          id: "f-neg3",
          sol: "A.F.1.f",
          stem: "What is f(−3)?",
          choices: [
            { letter: "A", text: "3" },
            { letter: "B", text: "15" },
            { letter: "C", text: "−15" },
            { letter: "D", text: "6" }
          ],
          correct: "B"
        },
        {
          id: "f-inverse",
          sol: "A.F.1.f",
          stem: "For what value of x is f(x) = 1?",
          choices: [
            { letter: "A", text: "x = 4" },
            { letter: "B", text: "x = −4" },
            { letter: "C", text: "x = 5" },
            { letter: "D", text: "x = 7" }
          ],
          correct: "A"
        },
        {
          id: "g-neg2",
          sol: "A.F.2.c",
          stem: "What is g(−2)?",
          choices: [
            { letter: "A", text: "−3" },
            { letter: "B", text: "−5" },
            { letter: "C", text: "5" },
            { letter: "D", text: "3" }
          ],
          correct: "C"
        },
        {
          id: "zero",
          sol: "A.F.1.a",
          stem: "What is the zero of f?",
          choices: [
            { letter: "A", text: "x = 9" },
            { letter: "B", text: "x = −4.5" },
            { letter: "C", text: "x = 4.5" },
            { letter: "D", text: "x = −2" }
          ],
          correct: "C"
        },
        {
          id: "g-range",
          sol: "A.F.2.b",
          stem: "What is the range of g(x) = x² + 1?",
          choices: [
            { letter: "A", text: "all real numbers" },
            { letter: "B", text: "y ≥ 0" },
            { letter: "C", text: "y ≤ 1" },
            { letter: "D", text: "y ≥ 1" }
          ],
          correct: "D"
        }
      ]
    },

    /* ---------- short · level 2 · A.F.1 ---------- */
    {
      id: "fn-parallel-perpendicular",
      family: "FN",
      title: "Lines Around y = 3x − 2",
      kind: "Functions · A.F.1",
      blurb: "Parallel, perpendicular, standard form and point-slope form of one line.",
      level: 2,
      passage: "<p>" + N(1) + "Start with the line <strong>y = 3x − 2</strong>. " + N(2) + "Parallel lines share a slope; perpendicular lines have slopes whose product is −1. " + N(3) + "The worksheet asks for a parallel line through (1, 4), a perpendicular line through (3, 5), the line's standard form, its point-slope form through (2, 4), and the slope of a second line, 4x + 2y = 8.</p>",
      claims: [
        {
          id: "parallel",
          sol: "A.F.1.e",
          stem: "Which equation is the line parallel to y = 3x − 2 through (1, 4)?",
          choices: [
            { letter: "A", text: "y = 3x + 1" },
            { letter: "B", text: "y = 3x + 4" },
            { letter: "C", text: "y = −3x + 7" },
            { letter: "D", text: "y = 3x − 2" }
          ],
          correct: "A"
        },
        {
          id: "perpendicular",
          sol: "A.F.1.e",
          stem: "Which equation is the line perpendicular to y = 3x − 2 through (3, 5)?",
          choices: [
            { letter: "A", text: "y = −3x + 14" },
            { letter: "B", text: "y = (1/3)x + 4" },
            { letter: "C", text: "y = −(1/3)x + 6" },
            { letter: "D", text: "y = 3x − 4" }
          ],
          correct: "C"
        },
        {
          id: "standard",
          sol: "A.F.1.b",
          stem: "Which equation is y = 3x − 2 written in standard form?",
          choices: [
            { letter: "A", text: "3x + y = 2" },
            { letter: "B", text: "3x − y = 2" },
            { letter: "C", text: "y − 3x = 2" },
            { letter: "D", text: "3x − y = −2" }
          ],
          correct: "B"
        },
        {
          id: "point-slope",
          sol: "A.F.1.b",
          stem: "Which equation is the point-slope form of y = 3x − 2 using the point (2, 4)?",
          choices: [
            { letter: "A", text: "y + 4 = 3(x + 2)" },
            { letter: "B", text: "y − 2 = 3(x − 4)" },
            { letter: "C", text: "y − 4 = −2(x − 2)" },
            { letter: "D", text: "y − 4 = 3(x − 2)" }
          ],
          correct: "D"
        },
        {
          id: "slope-standard",
          sol: "A.F.1.c",
          stem: "What is the slope of the line 4x + 2y = 8?",
          choices: [
            { letter: "A", text: "4" },
            { letter: "B", text: "−2" },
            { letter: "C", text: "2" },
            { letter: "D", text: "−1/2" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- short · level 2 · A.F.2 ---------- */
    {
      id: "fn-parabola-features",
      family: "FN",
      title: "Features of a Parabola",
      kind: "Functions · A.F.2",
      blurb: "f(x) = x² − 4x − 5. Zeros, vertex, axis, range and where it decreases.",
      level: 2,
      passage: "<p>" + N(1) + "The function <strong>f(x) = x² − 4x − 5</strong> factors as (x − 5)(x + 1). " + N(2) + "Its graph is a parabola that opens upward. " + N(3) + "Nadia lists its zeros, vertex, axis of symmetry, y-intercept, range and the interval where it is decreasing, then evaluates f(3).</p>",
      claims: [
        {
          id: "zeros",
          sol: "A.F.2.f",
          stem: "What are the zeros of f?",
          choices: [
            { letter: "A", text: "x = −5 and x = 1" },
            { letter: "B", text: "x = 5 and x = −1" },
            { letter: "C", text: "x = 4 and x = −5" },
            { letter: "D", text: "x = 0 and x = −5" }
          ],
          correct: "B"
        },
        {
          id: "vertex",
          sol: "A.F.2.b",
          stem: "What is the vertex of the parabola?",
          choices: [
            { letter: "A", text: "(2, −9)" },
            { letter: "B", text: "(−2, 7)" },
            { letter: "C", text: "(2, 9)" },
            { letter: "D", text: "(0, −5)" }
          ],
          correct: "A"
        },
        {
          id: "axis",
          sol: "A.F.2.b",
          stem: "What is the axis of symmetry?",
          choices: [
            { letter: "A", text: "y = 2" },
            { letter: "B", text: "x = −9" },
            { letter: "C", text: "x = 2" },
            { letter: "D", text: "x = 0" }
          ],
          correct: "C"
        },
        {
          id: "range",
          sol: "A.F.2.b",
          stem: "What is the range of f?",
          choices: [
            { letter: "A", text: "y ≤ −9" },
            { letter: "B", text: "all real numbers" },
            { letter: "C", text: "y ≥ −5" },
            { letter: "D", text: "y ≥ −9" }
          ],
          correct: "D"
        },
        {
          id: "decreasing",
          sol: "A.F.2.b",
          stem: "On which interval is f decreasing?",
          choices: [
            { letter: "A", text: "x < 2" },
            { letter: "B", text: "x > 2" },
            { letter: "C", text: "−1 < x < 5" },
            { letter: "D", text: "x < −9" }
          ],
          correct: "A"
        },
        {
          id: "evaluate",
          sol: "A.F.2.c",
          stem: "What is f(3)?",
          choices: [
            { letter: "A", text: "−2" },
            { letter: "B", text: "−8" },
            { letter: "C", text: "16" },
            { letter: "D", text: "4" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- short · level 2 · A.F.2 ---------- */
    {
      id: "fn-bacteria-doubling",
      family: "FN",
      title: "Doubling Bacteria, Shrinking Value",
      kind: "Functions · A.F.2",
      blurb: "P(t) = 100 · 2^t grows; V(t) = 5000(0.8)^t decays. Tell them apart.",
      level: 2,
      passage: "<p>" + N(1) + "A biology lab starts with 100 bacteria that double every hour, so the population after t hours is <strong>P(t) = 100 · 2<sup>t</sup></strong>. " + N(2) + "Meanwhile, a used laptop bought for $5,000 loses 20% of its value each year, so its value is <strong>V(t) = 5000(0.8)<sup>t</sup></strong>. " + N(3) + "Both are exponential functions, one growing and one decaying.</p>",
      claims: [
        {
          id: "p3",
          sol: "A.F.2.c",
          stem: "What is P(3)?",
          choices: [
            { letter: "A", text: "600" },
            { letter: "B", text: "800" },
            { letter: "C", text: "300" },
            { letter: "D", text: "106" }
          ],
          correct: "B"
        },
        {
          id: "growth",
          sol: "A.F.2.g",
          stem: "Which feature of P(t) = 100 · 2^t shows that it is exponential growth?",
          choices: [
            { letter: "A", text: "The starting value, 100, is a positive number." },
            { letter: "B", text: "The exponent is the variable t." },
            { letter: "C", text: "The base, 2, is greater than 1: each hour doubles the count." },
            { letter: "D", text: "The population increases by 100 each hour." }
          ],
          correct: "C"
        },
        {
          id: "v2",
          sol: "A.F.2.c",
          stem: "What is the laptop's value after 2 years?",
          choices: [
            { letter: "A", text: "$3,200" },
            { letter: "B", text: "$4,000" },
            { letter: "C", text: "$3,000" },
            { letter: "D", text: "$8,000" }
          ],
          correct: "A"
        },
        {
          id: "decay",
          sol: "A.F.2.g",
          stem: "In V(t) = 5000(0.8)^t, what does 0.8 represent?",
          choices: [
            { letter: "A", text: "The laptop loses $0.80 each year." },
            { letter: "B", text: "The laptop keeps 80% of its value each year." },
            { letter: "C", text: "The laptop is worth 80 dollars after t years." },
            { letter: "D", text: "The laptop loses 80% of its value each year." }
          ],
          correct: "B"
        },
        {
          id: "table",
          sol: "A.F.2.h",
          stem: "A table shows y-values 3, 6, 12, 24 for x = 0, 1, 2, 3. Which kind of function fits the table?",
          choices: [
            { letter: "A", text: "linear, because y increases each time" },
            { letter: "B", text: "quadratic, because the differences are 3, 6, 12" },
            { letter: "C", text: "exponential, because each y-value is 2 times the one before" },
            { letter: "D", text: "linear, because x increases by 1 each time" }
          ],
          correct: "C"
        }
      ]
    },

    /* ---------- medium · level 2 · A.F.1 ---------- */
    {
      id: "fn-two-points",
      family: "FN",
      title: "A Line Through Two Points",
      kind: "Functions · A.F.1",
      blurb: "(2, 11) and (6, 23) fix a line. Equation, intercepts, end behavior and a rival.",
      level: 2,
      passage: "<p>" + N(1) + "A linear function f passes through the points (2, 11) and (6, 23). " + N(2) + "Owen finds its slope, writes its equation and locates its intercepts. " + N(3) + "He compares f with a second function, <strong>g(x) = 4x − 3</strong>, and with a direct variation in which y = 12 when x = 4. " + N(4) + "Finally he describes the <strong>end behavior</strong> of f: what happens to f(x) as x grows without bound.</p>",
      claims: [
        {
          id: "equation",
          sol: "A.F.1.d",
          stem: "Which equation represents f?",
          choices: [
            { letter: "A", text: "f(x) = 3x + 5" },
            { letter: "B", text: "f(x) = 3x + 11" },
            { letter: "C", text: "f(x) = 4x + 3" },
            { letter: "D", text: "f(x) = 2x + 7" }
          ],
          correct: "A"
        },
        {
          id: "x-intercept",
          sol: "A.F.1.a",
          stem: "What is the x-intercept of f?",
          choices: [
            { letter: "A", text: "x = 5" },
            { letter: "B", text: "x = −5/3" },
            { letter: "C", text: "x = −5" },
            { letter: "D", text: "x = 5/3" }
          ],
          correct: "B"
        },
        {
          id: "solve-output",
          sol: "A.F.1.f",
          stem: "For what value of x is f(x) = 41?",
          choices: [
            { letter: "A", text: "x = 128" },
            { letter: "B", text: "x = 15" },
            { letter: "C", text: "x = 12" },
            { letter: "D", text: "x = 46/3" }
          ],
          correct: "C"
        },
        {
          id: "compare",
          sol: "A.F.1.i",
          stem: "How do f and g compare?",
          choices: [
            { letter: "A", text: "g has the greater rate of change and the greater y-intercept." },
            { letter: "B", text: "f has the greater rate of change; g has the greater y-intercept." },
            { letter: "C", text: "g has the greater rate of change; f has the greater y-intercept." },
            { letter: "D", text: "f and g have the same rate of change." }
          ],
          correct: "C"
        },
        {
          id: "direct",
          sol: "A.F.1.g",
          stem: "In the direct variation where y = 12 when x = 4, what is the constant of variation and the equation?",
          choices: [
            { letter: "A", text: "k = 8; y = x + 8" },
            { letter: "B", text: "k = 3; y = 3x" },
            { letter: "C", text: "k = 48; y = 48 ÷ x" },
            { letter: "D", text: "k = 1/3; y = x ÷ 3" }
          ],
          correct: "B"
        },
        {
          id: "end",
          sol: "A.F.1.a",
          stem: "Which statement describes the end behavior of f?",
          choices: [
            { letter: "A", text: "As x increases, f(x) approaches 5." },
            { letter: "B", text: "As x increases, f(x) decreases without bound." },
            { letter: "C", text: "As x increases, f(x) levels off at 41." },
            { letter: "D", text: "As x increases, f(x) increases without bound." }
          ],
          correct: "D"
        }
      ]
    },

    /* ---------- medium · level 3 · A.F.2 ---------- */
    {
      id: "fn-three-accounts",
      family: "FN",
      title: "Three Ways to Grow $200",
      kind: "Functions · A.F.2",
      blurb: "Linear, exponential and quadratic growth side by side. Which wins when?",
      level: 3,
      passage: "<p>" + N(1) + "Three cousins each start with $200. " + N(2) + "Ava adds $25 every year: <strong>A(t) = 200 + 25t</strong>. " + N(3) + "Ben's account grows 10% a year: <strong>B(t) = 200(1.1)<sup>t</sup></strong>. " + N(4) + "Cara's odd job pays more every year: <strong>C(t) = 200 + 2t²</strong>. " + N(5) + "They compare balances after 5 years and after 10 years.</p>" +
        "<table><tr><th>t</th><th>A(t)</th><th>B(t)</th><th>C(t)</th></tr><tr><td>0</td><td>200</td><td>200</td><td>200</td></tr><tr><td>5</td><td>325</td><td>322.10</td><td>250</td></tr><tr><td>10</td><td>450</td><td>518.75</td><td>400</td></tr></table>",
      claims: [
        {
          id: "types",
          sol: "A.F.2.h",
          stem: "Which list correctly names the function types of A, B and C?",
          choices: [
            { letter: "A", text: "A linear, B exponential, C quadratic" },
            { letter: "B", text: "A linear, B quadratic, C exponential" },
            { letter: "C", text: "A exponential, B linear, C quadratic" },
            { letter: "D", text: "A quadratic, B exponential, C linear" }
          ],
          correct: "A"
        },
        {
          id: "rate",
          sol: "A.F.1.h",
          stem: "What is the rate of change of A(t), and what does it mean?",
          choices: [
            { letter: "A", text: "200 dollars per year: Ava's starting amount" },
            { letter: "B", text: "25 dollars per year: the amount Ava adds each year" },
            { letter: "C", text: "25 years: the time it takes to double" },
            { letter: "D", text: "225 dollars: Ava's balance after one year" }
          ],
          correct: "B"
        },
        {
          id: "overtake",
          sol: "A.F.2.h",
          stem: "What does the table show about Ava's and Ben's balances?",
          choices: [
            { letter: "A", text: "Ben is always ahead because 10% is more than $25." },
            { letter: "B", text: "Ava is ahead at 5 years, but Ben's exponential growth passes her by 10 years." },
            { letter: "C", text: "Ava is always ahead because a linear function grows faster." },
            { letter: "D", text: "Their balances are equal at 10 years." }
          ],
          correct: "B"
        },
        {
          id: "ratio",
          sol: "A.F.2.g",
          stem: "Between any two consecutive years, B(t) is multiplied by —",
          choices: [
            { letter: "A", text: "10" },
            { letter: "B", text: "0.1" },
            { letter: "C", text: "1.1" },
            { letter: "D", text: "200" }
          ],
          correct: "C"
        },
        {
          id: "cara",
          sol: "A.F.2.c",
          stem: "What is C(7)?",
          choices: [
            { letter: "A", text: "298" },
            { letter: "B", text: "214" },
            { letter: "C", text: "228" },
            { letter: "D", text: "398" }
          ],
          correct: "A"
        },
        {
          id: "long-run",
          sol: "A.F.2.h",
          stem: "In the long run, which account grows fastest, and why?",
          choices: [
            { letter: "A", text: "Cara's, because a quadratic function eventually beats any exponential function." },
            { letter: "B", text: "Ava's, because it has the largest balance at 5 years." },
            { letter: "C", text: "Ben's, because multiplying by 1.1 each year eventually outgrows adding 25 or 2t²." },
            { letter: "D", text: "All three grow at the same rate after 10 years." }
          ],
          correct: "C"
        }
      ]
    },

    /* ---------- medium · level 3 · A.F.2 ---------- */
    {
      id: "fn-parabola-from-graph",
      family: "FN",
      title: "A Parabola Described in Words",
      kind: "Functions · A.F.2",
      blurb: "Vertex (3, 16), x-intercepts −1 and 7, y-intercept 7. Recover the function.",
      level: 3,
      passage: "<p>" + N(1) + "A graph shows a parabola that opens downward. " + N(2) + "Its <strong>vertex</strong> is (3, 16), its x-intercepts are −1 and 7, and its y-intercept is 7. " + N(3) + "Tomas wants to write the function in factored form and use it to describe where the graph is above the x-axis and where it is increasing. " + N(4) + "The graph models the height, in feet, of a water jet x feet from the nozzle of a fountain.</p>",
      claims: [
        {
          id: "factored",
          sol: "A.F.2.e",
          stem: "Which function has the zeros and y-intercept described?",
          choices: [
            { letter: "A", text: "f(x) = (x + 1)(x − 7)" },
            { letter: "B", text: "f(x) = −(x + 1)(x − 7)" },
            { letter: "C", text: "f(x) = −(x − 1)(x + 7)" },
            { letter: "D", text: "f(x) = (x − 3)(x − 16)" }
          ],
          correct: "B"
        },
        {
          id: "standard",
          sol: "A.F.2.f",
          stem: "Which is the same function written in standard form?",
          choices: [
            { letter: "A", text: "f(x) = −x² + 6x + 7" },
            { letter: "B", text: "f(x) = −x² − 6x − 7" },
            { letter: "C", text: "f(x) = x² − 6x − 7" },
            { letter: "D", text: "f(x) = −x² + 8x − 7" }
          ],
          correct: "A"
        },
        {
          id: "positive",
          sol: "A.F.2.b",
          stem: "For which values of x is f(x) > 0?",
          choices: [
            { letter: "A", text: "x < −1 or x > 7" },
            { letter: "B", text: "x > 3" },
            { letter: "C", text: "−1 < x < 7" },
            { letter: "D", text: "0 < x < 16" }
          ],
          correct: "C"
        },
        {
          id: "increasing",
          sol: "A.F.2.b",
          stem: "On which interval is the function increasing?",
          choices: [
            { letter: "A", text: "x < 3" },
            { letter: "B", text: "x > 3" },
            { letter: "C", text: "−1 < x < 7" },
            { letter: "D", text: "x > 16" }
          ],
          correct: "A"
        },
        {
          id: "range",
          sol: "A.F.2.b",
          stem: "What is the range of the function?",
          choices: [
            { letter: "A", text: "y ≥ 16" },
            { letter: "B", text: "y ≤ 16" },
            { letter: "C", text: "−1 ≤ y ≤ 7" },
            { letter: "D", text: "all real numbers" }
          ],
          correct: "B"
        },
        {
          id: "context",
          sol: "A.F.2.i",
          stem: "In the fountain model, what do the x-intercept 7 and the vertex represent?",
          choices: [
            { letter: "A", text: "The jet lands 7 feet from the nozzle; its greatest height is 16 feet, reached 3 feet out." },
            { letter: "B", text: "The jet lands 16 feet from the nozzle; its greatest height is 7 feet." },
            { letter: "C", text: "The jet is 7 feet high at the nozzle; it lands 3 feet out." },
            { letter: "D", text: "The jet reaches 7 feet high 16 feet from the nozzle." }
          ],
          correct: "A"
        }
      ]
    },

    /* ---------- medium · level 2 · A.F.1 ---------- */
    {
      id: "fn-draining-tank",
      family: "FN",
      title: "The Draining Tank",
      kind: "Functions · A.F.1",
      blurb: "V(t) = 500 − 20t. Zero, domain in context, and a second tank's table.",
      level: 2,
      passage: "<p>" + N(1) + "A 500-gallon tank drains at a steady 20 gallons per minute, so the volume after t minutes is <strong>V(t) = 500 − 20t</strong>. " + N(2) + "A second tank is measured every 5 minutes; its table is below. " + N(3) + "Lin graphs both tanks on one grid to see which empties first.</p>" +
        "<table><tr><th>t (min)</th><th>0</th><th>5</th><th>10</th><th>15</th></tr><tr><th>Tank 2 (gal)</th><td>420</td><td>345</td><td>270</td><td>195</td></tr></table>",
      claims: [
        {
          id: "zero",
          sol: "A.F.1.a",
          stem: "What is the zero of V, and what does it mean?",
          choices: [
            { letter: "A", text: "t = 25; the tank is empty after 25 minutes" },
            { letter: "B", text: "t = 500; the tank starts with 500 gallons" },
            { letter: "C", text: "t = 20; the tank loses 20 gallons each minute" },
            { letter: "D", text: "t = 480; the tank holds 480 gallons after one minute" }
          ],
          correct: "A"
        },
        {
          id: "domain",
          sol: "A.F.1.k",
          stem: "What is a reasonable domain for V(t) in this situation?",
          choices: [
            { letter: "A", text: "all real numbers" },
            { letter: "B", text: "0 ≤ t ≤ 500" },
            { letter: "C", text: "0 ≤ t ≤ 25" },
            { letter: "D", text: "t ≥ 25" }
          ],
          correct: "C"
        },
        {
          id: "slope",
          sol: "A.F.1.h",
          stem: "What does the slope −20 tell you about the graph of V?",
          choices: [
            { letter: "A", text: "The line rises 20 gallons every minute." },
            { letter: "B", text: "The line falls 20 gallons every minute." },
            { letter: "C", text: "The line crosses the vertical axis at −20." },
            { letter: "D", text: "The tank empties after 20 minutes." }
          ],
          correct: "B"
        },
        {
          id: "evaluate",
          sol: "A.F.1.f",
          stem: "What is V(12)?",
          choices: [
            { letter: "A", text: "260 gallons" },
            { letter: "B", text: "240 gallons" },
            { letter: "C", text: "488 gallons" },
            { letter: "D", text: "280 gallons" }
          ],
          correct: "A"
        },
        {
          id: "tank2-slope",
          sol: "A.F.1.c",
          stem: "What is the rate of change of Tank 2, from the table?",
          choices: [
            { letter: "A", text: "−75 gallons per minute" },
            { letter: "B", text: "−15 gallons per minute" },
            { letter: "C", text: "−20 gallons per minute" },
            { letter: "D", text: "−5 gallons per minute" }
          ],
          correct: "B"
        },
        {
          id: "which-first",
          sol: "A.F.1.i",
          stem: "Which tank empties first?",
          choices: [
            { letter: "A", text: "Tank 2, because it starts with less water." },
            { letter: "B", text: "Both empty at the same time, 25 minutes." },
            { letter: "C", text: "Tank 1, at 25 minutes; Tank 2 takes 28 minutes." },
            { letter: "D", text: "Tank 2, at 21 minutes; Tank 1 takes 25 minutes." }
          ],
          correct: "C"
        }
      ]
    },

    /* ---------- long · level 3 · A.F.2 ---------- */
    {
      id: "fn-car-value",
      family: "FN",
      title: "What Is the Car Worth?",
      kind: "Functions · A.F.2",
      blurb: "Exponential depreciation versus straight-line depreciation on a $24,000 car.",
      level: 3,
      passage: "<p>" + N(1) + "A new car costs $24,000. " + N(2) + "One model of its value after t years is exponential: <strong>V(t) = 24000(0.85)<sup>t</sup></strong>. " + N(3) + "The dealer's simpler model is linear: <strong>L(t) = 24000 − 3000t</strong>. " + N(4) + "Sofia builds a table of both models for the first four years, rounding to the nearest dollar, and notices they agree at t = 0 but drift apart. " + N(5) + "She also wonders which model makes sense for very large values of t.</p>" +
        "<table><tr><th>t</th><th>V(t)</th><th>L(t)</th></tr><tr><td>0</td><td>24000</td><td>24000</td></tr><tr><td>1</td><td>20400</td><td>21000</td></tr><tr><td>2</td><td>17340</td><td>18000</td></tr><tr><td>3</td><td>14739</td><td>15000</td></tr><tr><td>4</td><td>12528</td><td>12000</td></tr></table>",
      claims: [
        {
          id: "percent",
          sol: "A.F.2.g",
          stem: "According to V(t), by what percent does the car lose value each year?",
          choices: [
            { letter: "A", text: "85%" },
            { letter: "B", text: "15%" },
            { letter: "C", text: "0.85%" },
            { letter: "D", text: "12.5%" }
          ],
          correct: "B"
        },
        {
          id: "intercept",
          sol: "A.F.2.b",
          stem: "What is the y-intercept of both models, and what does it represent?",
          choices: [
            { letter: "A", text: "0; the car is worth nothing when it is new" },
            { letter: "B", text: "3000; the car loses $3,000 in its first year" },
            { letter: "C", text: "24000; the car's value when t = 0, its purchase price" },
            { letter: "D", text: "0.85; the fraction of value kept each year" }
          ],
          correct: "C"
        },
        {
          id: "check",
          sol: "A.F.2.c",
          stem: "Which calculation confirms the table entry V(2) = 17340?",
          choices: [
            { letter: "A", text: "24000 − 2(0.85) = 23998.3" },
            { letter: "B", text: "24000 × 0.85 × 0.85 = 17340" },
            { letter: "C", text: "24000 × 0.85 × 2 = 40800" },
            { letter: "D", text: "24000 − 0.85 × 2 × 3000 = 18900" }
          ],
          correct: "B"
        },
        {
          id: "compare",
          sol: "A.F.2.h",
          stem: "Which statement about the two models is supported by the table?",
          choices: [
            { letter: "A", text: "The linear model gives a lower value every year." },
            { letter: "B", text: "The exponential model is lower for years 1 to 3 but higher at year 4." },
            { letter: "C", text: "The two models give the same value every year." },
            { letter: "D", text: "The exponential model loses the same dollar amount every year." }
          ],
          correct: "B"
        },
        {
          id: "long-run",
          sol: "A.F.2.i",
          stem: "Why does the linear model stop making sense for large t while the exponential model does not?",
          choices: [
            { letter: "A", text: "L(t) becomes negative after 8 years, but V(t) stays positive and approaches 0." },
            { letter: "B", text: "V(t) becomes negative after 8 years, but L(t) stays positive." },
            { letter: "C", text: "L(t) grows without bound, but V(t) levels off at 24000." },
            { letter: "D", text: "Both models become negative after 8 years." }
          ],
          correct: "A"
        },
        {
          id: "ratio-table",
          sol: "A.F.2.g",
          stem: "How can Sofia tell from the V(t) column alone that the model is exponential?",
          choices: [
            { letter: "A", text: "The values decrease by the same amount each year." },
            { letter: "B", text: "The values are all multiples of 1000." },
            { letter: "C", text: "Each value is the previous one times the same factor, 0.85." },
            { letter: "D", text: "The values reach 0 after exactly 8 years." }
          ],
          correct: "C"
        }
      ]
    },

    /* ---------- short · level 2 · A.F.1 ---------- */
    {
      id: "fn-forms-of-a-line",
      family: "FN",
      title: "One Line, Three Forms",
      kind: "Functions · A.F.1",
      blurb: "2x − 3y = 12. Slope, intercepts, point-slope form and a parallel line.",
      level: 2,
      passage: "<p>" + N(1) + "The line <strong>2x − 3y = 12</strong> is written in standard form. " + N(2) + "Rewriting it in slope-intercept form shows its slope and y-intercept at a glance. " + N(3) + "Amir also writes it in point-slope form through the point (3, −2), finds the x-intercept, and writes a parallel line through the origin.</p>",
      claims: [
        {
          id: "slope",
          sol: "A.F.1.c",
          stem: "What is the slope of the line?",
          choices: [
            { letter: "A", text: "2/3" },
            { letter: "B", text: "−2/3" },
            { letter: "C", text: "3/2" },
            { letter: "D", text: "2" }
          ],
          correct: "A"
        },
        {
          id: "y-int",
          sol: "A.F.1.a",
          stem: "What is the y-intercept of the line?",
          choices: [
            { letter: "A", text: "12" },
            { letter: "B", text: "6" },
            { letter: "C", text: "−4" },
            { letter: "D", text: "4" }
          ],
          correct: "C"
        },
        {
          id: "x-int",
          sol: "A.F.1.a",
          stem: "What is the x-intercept of the line?",
          choices: [
            { letter: "A", text: "−4" },
            { letter: "B", text: "6" },
            { letter: "C", text: "12" },
            { letter: "D", text: "−6" }
          ],
          correct: "B"
        },
        {
          id: "point-slope",
          sol: "A.F.1.b",
          stem: "Which equation is the point-slope form through (3, −2)?",
          choices: [
            { letter: "A", text: "y − 2 = (2/3)(x + 3)" },
            { letter: "B", text: "y + 2 = (3/2)(x − 3)" },
            { letter: "C", text: "y − 3 = (2/3)(x + 2)" },
            { letter: "D", text: "y + 2 = (2/3)(x − 3)" }
          ],
          correct: "D"
        },
        {
          id: "parallel",
          sol: "A.F.1.e",
          stem: "Which equation is the parallel line through the origin?",
          choices: [
            { letter: "A", text: "y = −(3/2)x" },
            { letter: "B", text: "y = (2/3)x" },
            { letter: "C", text: "y = (2/3)x − 4" },
            { letter: "D", text: "2x − 3y = 12" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- long · level 2 · A.F.1 ---------- */
    {
      id: "fn-fundraiser-model",
      family: "FN",
      title: "Modeling the Car Wash Fundraiser",
      kind: "Functions · A.F.1",
      blurb: "Supplies cost $60; each wash earns $8. Build the linear model from words to graph.",
      level: 2,
      passage: "<p>" + N(1) + "The soccer team spends $60 on soap, sponges and signs for a car wash. " + N(2) + "Each car washed brings in $8. " + N(3) + "Let <strong>c</strong> be the number of cars washed and <strong>M(c)</strong> the team's money after paying for supplies. " + N(4) + "Coach Reyes asks the team to write the model, graph it, find how many cars it takes to break even, and compare it with last year's bake sale, which raised $5 per item after $20 in supplies. " + N(5) + "Both graphs are drawn on the same grid, with the number of items sold on the horizontal axis.</p>",
      claims: [
        {
          id: "model",
          sol: "A.F.1.k",
          stem: "Which equation models the car wash?",
          choices: [
            { letter: "A", text: "M(c) = 60c − 8" },
            { letter: "B", text: "M(c) = 8c − 60" },
            { letter: "C", text: "M(c) = 8c + 60" },
            { letter: "D", text: "M(c) = 60 − 8c" }
          ],
          correct: "B"
        },
        {
          id: "break-even",
          sol: "A.F.1.a",
          stem: "What is the x-intercept of M, and what does it mean?",
          choices: [
            { letter: "A", text: "c = 7.5; the 8th car pays back the $60" },
            { letter: "B", text: "c = 60; the team needs 60 cars" },
            { letter: "C", text: "c = 8; each car earns $8" },
            { letter: "D", text: "c = −60; the team starts $60 in debt" }
          ],
          correct: "A"
        },
        {
          id: "y-int",
          sol: "A.F.1.h",
          stem: "What does the y-intercept of the graph of M represent?",
          choices: [
            { letter: "A", text: "the money earned from the first car" },
            { letter: "B", text: "the price of one car wash" },
            { letter: "C", text: "the team's money before any cars are washed: −$60" },
            { letter: "D", text: "the number of cars washed on the first day" }
          ],
          correct: "C"
        },
        {
          id: "graph",
          sol: "A.F.1.b",
          stem: "Which description matches the graph of M?",
          choices: [
            { letter: "A", text: "a line starting at (0, 60) and falling 8 for each car" },
            { letter: "B", text: "a horizontal line at 8" },
            { letter: "C", text: "a line starting at (0, 8) and rising 60 for each car" },
            { letter: "D", text: "a line starting at (0, −60) and rising 8 for each car" }
          ],
          correct: "D"
        },
        {
          id: "compare",
          sol: "A.F.1.i",
          stem: "The bake sale model is B(n) = 5n − 20. Which comparison is correct?",
          choices: [
            { letter: "A", text: "The bake sale line is steeper and starts lower." },
            { letter: "B", text: "The car wash line is steeper and starts lower." },
            { letter: "C", text: "Both lines have the same slope." },
            { letter: "D", text: "The car wash line is steeper and starts higher." }
          ],
          correct: "B"
        },
        {
          id: "same",
          sol: "A.F.1.l",
          stem: "For what number of items do the two models give the same amount of money?",
          choices: [
            { letter: "A", text: "13.3 items, because 8c − 60 = 5c − 20 gives 3c = 40" },
            { letter: "B", text: "20 items, because 8(20) − 60 = 100 and 5(20) − 20 = 80" },
            { letter: "C", text: "8 items, because the car wash breaks even there" },
            { letter: "D", text: "40 items, because 8(40) − 60 = 5(40) − 20 = 260" }
          ],
          correct: "A"
        }
      ]
    }
  ];

  for (var i = 0; i < PACKS.length; i++) P.push(PACKS[i]);
})(typeof window !== "undefined" ? window : global);
