/* SOL Lab — Algebra I · Equations & Inequalities (A.EI). Original problems only.
   Stems are plain text (Unicode: x², √, −, ≤, ≥); the stimulus may use HTML. */
(function (global) {
  var P = global.HEIST_PACKS;
  if (!P || !P.push) return;
  var N = function (i) { return '<span class="n">(' + i + ')</span> '; };   // numbered sentence

  var PACKS = [

    /* ---------- tiny · level 1 · A.EI.1 ---------- */
    {
      id: "ei-gym-pass",
      family: "EI",
      title: "The Gym Pass",
      kind: "Equations & Inequalities · A.EI.1",
      blurb: "A $25 pass plus $4 a visit. Write the equation, solve it, and turn it around.",
      level: 1,
      passage: "<p>" + N(1) + "A community gym charges $25 for a monthly pass plus $4 for each visit. " + N(2) + "Let <strong>v</strong> be the number of visits in a month and <strong>C</strong> the total cost. " + N(3) + "Leo spent exactly $65 last month. " + N(4) + "This month he wants to spend no more than $100.</p>",
      claims: [
        {
          id: "equation",
          sol: "A.EI.1.a",
          stem: "Which equation can be used to find the number of visits Leo made last month?",
          choices: [
            { letter: "A", text: "25v + 4 = 65" },
            { letter: "B", text: "4v − 25 = 65" },
            { letter: "C", text: "25 + 4v = 65" },
            { letter: "D", text: "29v = 65" }
          ],
          correct: "C"
        },
        {
          id: "solve",
          sol: "A.EI.1.b",
          stem: "How many visits did Leo make last month?",
          choices: [
            { letter: "A", text: "10" },
            { letter: "B", text: "16" },
            { letter: "C", text: "22" },
            { letter: "D", text: "40" }
          ],
          correct: "A"
        },
        {
          id: "inequality",
          sol: "A.EI.1.c",
          stem: "Which inequality represents this month's plan, and what is the greatest number of visits it allows?",
          choices: [
            { letter: "A", text: "25 + 4v ≥ 100; at least 19 visits" },
            { letter: "B", text: "25 + 4v ≤ 100; at most 18 visits" },
            { letter: "C", text: "25 + 4v < 100; at most 25 visits" },
            { letter: "D", text: "4v ≤ 100; at most 25 visits" }
          ],
          correct: "B"
        },
        {
          id: "literal",
          sol: "A.EI.1.d",
          stem: "Solve C = 25 + 4v for v.",
          choices: [
            { letter: "A", text: "v = C − 25 − 4" },
            { letter: "B", text: "v = (C + 25) ÷ 4" },
            { letter: "C", text: "v = 4C − 25" },
            { letter: "D", text: "v = (C − 25) ÷ 4" }
          ],
          correct: "D"
        },
        {
          id: "verify",
          sol: "A.EI.1.f",
          stem: "Which check confirms the solution to last month's equation?",
          choices: [
            { letter: "A", text: "25 + 4(10) = 65, so 10 visits cost exactly $65." },
            { letter: "B", text: "25(10) + 4 = 254, so 10 visits cost more than $65." },
            { letter: "C", text: "65 − 25 = 40, so Leo visited 40 times." },
            { letter: "D", text: "65 ÷ 4 = 16.25, so 16 visits is close enough." }
          ],
          correct: "A"
        }
      ]
    },

    /* ---------- tiny · level 1 · A.EI.1 ---------- */
    {
      id: "ei-number-line",
      family: "EI",
      title: "Number Line Gallery",
      kind: "Equations & Inequalities · A.EI.1",
      blurb: "Solve each inequality, then match it to the right number-line picture.",
      level: 1,
      passage: "<p>" + N(1) + "Each station in the gallery has an inequality and a number line. " + N(2) + "An <strong>open circle</strong> means the endpoint is not included; a <strong>closed circle</strong> means it is. " + N(3) + "Remember to reverse the inequality symbol when you multiply or divide both sides by a negative number.</p>" +
        "<ol><li>−3x + 7 > 22</li><li>2(x − 4) ≥ 10</li><li>5 − x ≤ 2</li><li>3(x + 2) = 3x + 6</li><li>4x + 1 = 4x − 5</li></ol>",
      claims: [
        {
          id: "flip",
          sol: "A.EI.1.c",
          stem: "What is the solution set of −3x + 7 > 22?",
          choices: [
            { letter: "A", text: "x > −5" },
            { letter: "B", text: "x < −5" },
            { letter: "C", text: "x < 5" },
            { letter: "D", text: "x > 5" }
          ],
          correct: "B"
        },
        {
          id: "graph",
          sol: "A.EI.1.c",
          stem: "Which number line shows the solution of 2(x − 4) ≥ 10?",
          choices: [
            { letter: "A", text: "open circle at 9, shaded to the right" },
            { letter: "B", text: "closed circle at 7, shaded to the left" },
            { letter: "C", text: "closed circle at 9, shaded to the right" },
            { letter: "D", text: "closed circle at 9, shaded to the left" }
          ],
          correct: "C"
        },
        {
          id: "subtract-var",
          sol: "A.EI.1.c",
          stem: "What is the solution set of 5 − x ≤ 2?",
          choices: [
            { letter: "A", text: "x ≥ 3" },
            { letter: "B", text: "x ≤ 3" },
            { letter: "C", text: "x ≤ −3" },
            { letter: "D", text: "x ≥ 7" }
          ],
          correct: "A"
        },
        {
          id: "identity",
          sol: "A.EI.1.e",
          stem: "How many solutions does 3(x + 2) = 3x + 6 have?",
          choices: [
            { letter: "A", text: "none" },
            { letter: "B", text: "exactly one, x = 0" },
            { letter: "C", text: "exactly one, x = 2" },
            { letter: "D", text: "infinitely many" }
          ],
          correct: "D"
        },
        {
          id: "none",
          sol: "A.EI.1.e",
          stem: "Why does 4x + 1 = 4x − 5 have no solution?",
          choices: [
            { letter: "A", text: "Subtracting 4x from both sides leaves 1 = −5, which is never true." },
            { letter: "B", text: "Both sides have 4x, so every value of x works." },
            { letter: "C", text: "The solution is x = −6, but negative solutions are not allowed." },
            { letter: "D", text: "Dividing by 4 gives x = −1.5, which is not a whole number." }
          ],
          correct: "A"
        }
      ]
    },

    /* ---------- tiny · level 1 · A.EI.1 ---------- */
    {
      id: "ei-formula-cards",
      family: "EI",
      title: "Formula Flash Cards",
      kind: "Equations & Inequalities · A.EI.1",
      blurb: "Five formulas from science and geometry. Solve each for the variable named.",
      level: 1,
      passage: "<p>" + N(1) + "Geometry and science formulas are <strong>literal equations</strong>: equations with more than one variable. " + N(2) + "Solving one for a different variable uses the same properties of equality as any other equation. " + N(3) + "Each flash card names the variable to isolate.</p>" +
        "<table><tr><th>Formula</th><th>Solve for</th></tr><tr><td>P = 2l + 2w</td><td>w</td></tr><tr><td>A = ½bh</td><td>h</td></tr><tr><td>d = rt</td><td>t</td></tr><tr><td>y = mx + b</td><td>x</td></tr><tr><td>F = 1.8C + 32</td><td>C</td></tr></table>",
      claims: [
        {
          id: "perimeter",
          sol: "A.EI.1.d",
          stem: "Which equation is P = 2l + 2w solved for w?",
          choices: [
            { letter: "A", text: "w = P − 2l − 2" },
            { letter: "B", text: "w = (P − 2l) ÷ 2" },
            { letter: "C", text: "w = P ÷ 2 − l ÷ 2" },
            { letter: "D", text: "w = 2P − l" }
          ],
          correct: "B"
        },
        {
          id: "triangle",
          sol: "A.EI.1.d",
          stem: "Which equation is A = ½bh solved for h?",
          choices: [
            { letter: "A", text: "h = 2A ÷ b" },
            { letter: "B", text: "h = A ÷ 2b" },
            { letter: "C", text: "h = 2Ab" },
            { letter: "D", text: "h = A − ½b" }
          ],
          correct: "A"
        },
        {
          id: "distance",
          sol: "A.EI.1.d",
          stem: "Which equation is d = rt solved for t?",
          choices: [
            { letter: "A", text: "t = dr" },
            { letter: "B", text: "t = r ÷ d" },
            { letter: "C", text: "t = d − r" },
            { letter: "D", text: "t = d ÷ r" }
          ],
          correct: "D"
        },
        {
          id: "line",
          sol: "A.EI.1.d",
          stem: "Which equation is y = mx + b solved for x?",
          choices: [
            { letter: "A", text: "x = y − b − m" },
            { letter: "B", text: "x = (y + b) ÷ m" },
            { letter: "C", text: "x = (y − b) ÷ m" },
            { letter: "D", text: "x = my − b" }
          ],
          correct: "C"
        },
        {
          id: "temperature",
          sol: "A.EI.1.d",
          stem: "Which equation is F = 1.8C + 32 solved for C?",
          choices: [
            { letter: "A", text: "C = (F − 32) ÷ 1.8" },
            { letter: "B", text: "C = F ÷ 1.8 − 32" },
            { letter: "C", text: "C = 1.8(F − 32)" },
            { letter: "D", text: "C = (F + 32) ÷ 1.8" }
          ],
          correct: "A"
        }
      ]
    },

    /* ---------- short · level 2 · A.EI.2 ---------- */
    {
      id: "ei-two-phone-plans",
      family: "EI",
      title: "Two Phone Plans",
      kind: "Equations & Inequalities · A.EI.2",
      blurb: "Plan A: $20 plus 10 cents a minute. Plan B: $5 plus 25 cents. When do they cost the same?",
      level: 2,
      passage: "<p>" + N(1) + "Plan A costs $20 a month plus $0.10 per minute of calls. " + N(2) + "Plan B costs $5 a month plus $0.25 per minute. " + N(3) + "Let <strong>m</strong> be the minutes used in a month and <strong>C</strong> the monthly cost. " + N(4) + "Rosa graphs both plans on the same axes to see where the lines cross.</p>",
      claims: [
        {
          id: "system",
          sol: "A.EI.2.a",
          stem: "Which system of equations represents the two plans?",
          choices: [
            { letter: "A", text: "C = 20m + 0.10 and C = 5m + 0.25" },
            { letter: "B", text: "C = 20 + 0.10m and C = 5 + 0.25m" },
            { letter: "C", text: "C = 0.10 + 20m and C = 0.25 + 5m" },
            { letter: "D", text: "m = 20 + 0.10C and m = 5 + 0.25C" }
          ],
          correct: "B"
        },
        {
          id: "solve",
          sol: "A.EI.2.b",
          stem: "At how many minutes do the two plans cost the same?",
          choices: [
            { letter: "A", text: "60" },
            { letter: "B", text: "75" },
            { letter: "C", text: "100" },
            { letter: "D", text: "150" }
          ],
          correct: "C"
        },
        {
          id: "interpret",
          sol: "A.EI.2.h",
          stem: "What does the point where the two lines cross represent?",
          choices: [
            { letter: "A", text: "the number of minutes where Plan A becomes free" },
            { letter: "B", text: "the month in which Rosa should switch plans" },
            { letter: "C", text: "the greatest number of minutes either plan allows" },
            { letter: "D", text: "the number of minutes at which both plans cost the same amount, $30" }
          ],
          correct: "D"
        },
        {
          id: "count",
          sol: "A.EI.2.c",
          stem: "Without solving, how can Rosa tell that the system has exactly one solution?",
          choices: [
            { letter: "A", text: "The lines have different slopes, 0.10 and 0.25, so they cross exactly once." },
            { letter: "B", text: "The lines have different y-intercepts, so they never cross." },
            { letter: "C", text: "Both equations use the variable C, so they are the same line." },
            { letter: "D", text: "Both plans have positive slopes, so they must be parallel." }
          ],
          correct: "A"
        },
        {
          id: "cheaper",
          sol: "A.EI.1.c",
          stem: "For which numbers of minutes is Plan A cheaper than Plan B?",
          choices: [
            { letter: "A", text: "fewer than 100 minutes" },
            { letter: "B", text: "more than 100 minutes" },
            { letter: "C", text: "fewer than 30 minutes" },
            { letter: "D", text: "Plan A is never cheaper" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- short · level 2 · A.EI.3 ---------- */
    {
      id: "ei-ball-toss",
      family: "EI",
      title: "The Rooftop Ball Toss",
      kind: "Equations & Inequalities · A.EI.3",
      blurb: "h = −16t² + 32t + 48. When does the ball hit the ground?",
      level: 2,
      passage: "<p>" + N(1) + "A ball is tossed upward from a roof 48 feet high. " + N(2) + "Its height in feet after t seconds is h = −16t² + 32t + 48. " + N(3) + "Kai wants to know when the ball hits the ground, so he sets h = 0 and factors: −16t² + 32t + 48 = −16(t² − 2t − 3) = −16(t − 3)(t + 1). " + N(4) + "Then he checks a few other quadratic equations from the same worksheet.</p>",
      claims: [
        {
          id: "ground",
          sol: "A.EI.3.a",
          stem: "According to Kai's factoring, when does the ball hit the ground?",
          choices: [
            { letter: "A", text: "after 1 second" },
            { letter: "B", text: "after 3 seconds" },
            { letter: "C", text: "after 4 seconds" },
            { letter: "D", text: "after 48 seconds" }
          ],
          correct: "B"
        },
        {
          id: "reject",
          sol: "A.EI.3.c",
          stem: "The factored equation also gives t = −1. Why is this solution not used?",
          choices: [
            { letter: "A", text: "It is a mistake; −16(t + 1) should be −16(t − 1)." },
            { letter: "B", text: "Negative solutions are never correct for a quadratic equation." },
            { letter: "C", text: "The ball was tossed at t = 0, so a negative time is outside the situation." },
            { letter: "D", text: "The ball is at 48 feet when t = −1, not on the ground." }
          ],
          correct: "C"
        },
        {
          id: "none",
          sol: "A.EI.3.b",
          stem: "How many real solutions does x² + 4x + 5 = 0 have?",
          choices: [
            { letter: "A", text: "none, because b² − 4ac = 16 − 20 is negative" },
            { letter: "B", text: "one, because b² − 4ac = 0" },
            { letter: "C", text: "two, because b² − 4ac = 36" },
            { letter: "D", text: "two, because every quadratic has two solutions" }
          ],
          correct: "A"
        },
        {
          id: "one",
          sol: "A.EI.3.b",
          stem: "Which quadratic equation has exactly one real solution?",
          choices: [
            { letter: "A", text: "x² − 9 = 0" },
            { letter: "B", text: "x² − 5x = 0" },
            { letter: "C", text: "x² + 1 = 0" },
            { letter: "D", text: "x² − 6x + 9 = 0" }
          ],
          correct: "D"
        },
        {
          id: "sqrt",
          sol: "A.EI.3.a",
          stem: "What are the solutions of x² = 49?",
          choices: [
            { letter: "A", text: "x = 7 only" },
            { letter: "B", text: "x = 7 or x = −7" },
            { letter: "C", text: "x = 24.5" },
            { letter: "D", text: "x = √7 or x = −√7" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- short · level 2 · A.EI.1 ---------- */
    {
      id: "ei-multistep-set",
      family: "EI",
      title: "Multistep Equation Set",
      kind: "Equations & Inequalities · A.EI.1",
      blurb: "Distribute, combine, isolate. Four equations and a property of equality.",
      level: 2,
      passage: "<p>" + N(1) + "Ms. Grant's equation set mixes fractions, decimals and parentheses. " + N(2) + "She asks students to name the <strong>property of equality</strong> they use at each step and to check every answer by substitution.</p>" +
        "<ol><li>3(2x − 5) + 4 = 2x + 9</li><li>x ÷ 4 − 3 = 7</li><li>0.5(x + 8) = 12</li><li>−4(x − 1) = 3x + 18</li><li>5x − 3 = 2x + 12</li></ol>",
      claims: [
        {
          id: "distribute",
          sol: "A.EI.1.b",
          stem: "What is the solution of 3(2x − 5) + 4 = 2x + 9?",
          choices: [
            { letter: "A", text: "x = 5" },
            { letter: "B", text: "x = 2.5" },
            { letter: "C", text: "x = −5" },
            { letter: "D", text: "x = 3" }
          ],
          correct: "A"
        },
        {
          id: "fraction",
          sol: "A.EI.1.b",
          stem: "What is the solution of x ÷ 4 − 3 = 7?",
          choices: [
            { letter: "A", text: "x = 1" },
            { letter: "B", text: "x = 16" },
            { letter: "C", text: "x = 40" },
            { letter: "D", text: "x = 2.5" }
          ],
          correct: "C"
        },
        {
          id: "decimal",
          sol: "A.EI.1.b",
          stem: "What is the solution of 0.5(x + 8) = 12?",
          choices: [
            { letter: "A", text: "x = 8" },
            { letter: "B", text: "x = 16" },
            { letter: "C", text: "x = 20" },
            { letter: "D", text: "x = 32" }
          ],
          correct: "B"
        },
        {
          id: "negative",
          sol: "A.EI.1.b",
          stem: "What is the solution of −4(x − 1) = 3x + 18?",
          choices: [
            { letter: "A", text: "x = 2" },
            { letter: "B", text: "x = 22" },
            { letter: "C", text: "x = −22" },
            { letter: "D", text: "x = −2" }
          ],
          correct: "D"
        },
        {
          id: "property",
          sol: "A.EI.1.f",
          stem: "To solve 5x − 3 = 2x + 12, a student first writes 3x − 3 = 12. Which property justifies this step?",
          choices: [
            { letter: "A", text: "the distributive property" },
            { letter: "B", text: "the addition property of equality, adding 3 to both sides" },
            { letter: "C", text: "the subtraction property of equality, subtracting 2x from both sides" },
            { letter: "D", text: "the division property of equality, dividing both sides by 5" }
          ],
          correct: "C"
        }
      ]
    },

    /* ---------- medium · level 2 · A.EI.2 ---------- */
    {
      id: "ei-concert-tickets",
      family: "EI",
      title: "Selling Out the Spring Concert",
      kind: "Equations & Inequalities · A.EI.2",
      blurb: "120 tickets, $750 collected. How many of each kind were sold?",
      level: 2,
      passage: "<p>" + N(1) + "The spring concert sold 120 tickets and took in $750. " + N(2) + "Adult tickets cost $8 and student tickets cost $5. " + N(3) + "Let <strong>x</strong> be the number of adult tickets and <strong>y</strong> the number of student tickets. " + N(4) + "Theo solves the system by substitution; Mia solves it by graphing and finds where the two lines meet. " + N(5) + "Afterward, the teacher shows a different system, 2x + y = 6 and 4x + 2y = 12, and asks how many solutions it has.</p>",
      claims: [
        {
          id: "system",
          sol: "A.EI.2.a",
          stem: "Which system represents the concert ticket sales?",
          choices: [
            { letter: "A", text: "x + y = 120 and 8x + 5y = 750" },
            { letter: "B", text: "x + y = 750 and 8x + 5y = 120" },
            { letter: "C", text: "8x + 5y = 120 and xy = 750" },
            { letter: "D", text: "x + y = 120 and 5x + 8y = 750" }
          ],
          correct: "A"
        },
        {
          id: "solve",
          sol: "A.EI.2.b",
          stem: "How many adult tickets and how many student tickets were sold?",
          choices: [
            { letter: "A", text: "70 adult, 50 student" },
            { letter: "B", text: "60 adult, 60 student" },
            { letter: "C", text: "50 adult, 70 student" },
            { letter: "D", text: "40 adult, 80 student" }
          ],
          correct: "C"
        },
        {
          id: "substitution",
          sol: "A.EI.2.b",
          stem: "Theo replaces y with 120 − x in the money equation. Which equation does he get?",
          choices: [
            { letter: "A", text: "8x + 5(120 − x) = 750" },
            { letter: "B", text: "8(120 − x) + 5x = 750" },
            { letter: "C", text: "8x + 5x = 750 − 120" },
            { letter: "D", text: "x + (120 − x) = 750" }
          ],
          correct: "A"
        },
        {
          id: "verify",
          sol: "A.EI.2.h",
          stem: "Which check verifies the solution in both equations?",
          choices: [
            { letter: "A", text: "50 + 70 = 120 and 8(50) + 5(70) = 750" },
            { letter: "B", text: "50 + 70 = 120 and 8(70) + 5(50) = 810" },
            { letter: "C", text: "50 × 70 = 3500 and 8 + 5 = 13" },
            { letter: "D", text: "8(50) = 400 and 5(70) = 350, so 400 − 350 = 50" }
          ],
          correct: "A"
        },
        {
          id: "graph",
          sol: "A.EI.2.b",
          stem: "On Mia's graph, what does the intersection of the two lines show?",
          choices: [
            { letter: "A", text: "the price of one adult ticket and one student ticket" },
            { letter: "B", text: "the one pair (x, y) that satisfies both equations" },
            { letter: "C", text: "the total number of tickets, 120" },
            { letter: "D", text: "the total money collected, $750" }
          ],
          correct: "B"
        },
        {
          id: "infinite",
          sol: "A.EI.2.c",
          stem: "How many solutions does the system 2x + y = 6 and 4x + 2y = 12 have?",
          choices: [
            { letter: "A", text: "none, because the two lines are parallel" },
            { letter: "B", text: "exactly one, at the point (3, 0)" },
            { letter: "C", text: "exactly two, because there are two equations" },
            { letter: "D", text: "infinitely many; the second equation is twice the first" }
          ],
          correct: "D"
        }
      ]
    },

    /* ---------- medium · level 2 · A.EI.2 ---------- */
    {
      id: "ei-party-budget",
      family: "EI",
      title: "Party Budget Inequalities",
      kind: "Equations & Inequalities · A.EI.2",
      blurb: "$60 for snacks at $3 and pizzas at $5. Which orders work?",
      level: 2,
      passage: "<p>" + N(1) + "The student council has $60 for a party. " + N(2) + "Snack bags cost $3 each and pizzas cost $5 each. " + N(3) + "Let <strong>s</strong> be the number of snack bags and <strong>p</strong> the number of pizzas. " + N(4) + "The council also wants at least 8 items in total. " + N(5) + "Elena graphs the budget inequality 3s + 5p ≤ 60 with s on the horizontal axis and p on the vertical axis.</p>",
      claims: [
        {
          id: "point",
          sol: "A.EI.2.g",
          stem: "Which order stays within the $60 budget?",
          choices: [
            { letter: "A", text: "5 snack bags and 10 pizzas" },
            { letter: "B", text: "12 snack bags and 6 pizzas" },
            { letter: "C", text: "10 snack bags and 6 pizzas" },
            { letter: "D", text: "8 snack bags and 8 pizzas" }
          ],
          correct: "C"
        },
        {
          id: "graph",
          sol: "A.EI.2.e",
          stem: "How should Elena draw the graph of 3s + 5p ≤ 60?",
          choices: [
            { letter: "A", text: "a dashed boundary line, shaded above the line" },
            { letter: "B", text: "a solid boundary line, shaded below the line" },
            { letter: "C", text: "a solid boundary line, shaded above the line" },
            { letter: "D", text: "a dashed boundary line, shaded below the line" }
          ],
          correct: "B"
        },
        {
          id: "system",
          sol: "A.EI.2.d",
          stem: "Which system of inequalities represents both council requirements?",
          choices: [
            { letter: "A", text: "3s + 5p ≤ 60 and s + p ≥ 8" },
            { letter: "B", text: "3s + 5p ≥ 60 and s + p ≤ 8" },
            { letter: "C", text: "3s + 5p ≤ 60 and s + p ≤ 8" },
            { letter: "D", text: "s + p ≤ 60 and 3s + 5p ≥ 8" }
          ],
          correct: "A"
        },
        {
          id: "both",
          sol: "A.EI.2.g",
          stem: "Is (s, p) = (4, 4) a solution of the system?",
          choices: [
            { letter: "A", text: "No; 4 + 4 = 8 is not at least 8." },
            { letter: "B", text: "No; 3(4) + 5(4) = 32 is not under 60." },
            { letter: "C", text: "Yes; 3(4) + 5(4) = 32 ≤ 60 and 4 + 4 = 8 ≥ 8." },
            { letter: "D", text: "Yes, because any pair of equal numbers works." }
          ],
          correct: "C"
        },
        {
          id: "strict",
          sol: "A.EI.2.e",
          stem: "A second graph shows y > 2x − 1. Which description fits its graph?",
          choices: [
            { letter: "A", text: "a solid line through (0, −1) with slope 2, shaded above" },
            { letter: "B", text: "a dashed line through (0, −1) with slope 2, shaded below" },
            { letter: "C", text: "a solid line through (0, 2) with slope −1, shaded above" },
            { letter: "D", text: "a dashed line through (0, −1) with slope 2, shaded above" }
          ],
          correct: "D"
        },
        {
          id: "region",
          sol: "A.EI.2.f",
          stem: "The solution set of the system in the graph is —",
          choices: [
            { letter: "A", text: "the region where the shadings of the two inequalities overlap" },
            { letter: "B", text: "the single point where the two boundary lines cross" },
            { letter: "C", text: "every point on either boundary line" },
            { letter: "D", text: "the region shaded by either inequality" }
          ],
          correct: "A"
        }
      ]
    },

    /* ---------- medium · level 3 · A.EI.3 ---------- */
    {
      id: "ei-rectangle-area",
      family: "EI",
      title: "A Rectangle with Area 40",
      kind: "Equations & Inequalities · A.EI.3",
      blurb: "Length is 3 more than width; area is 40. Which quadratic, and which solution?",
      level: 3,
      passage: "<p>" + N(1) + "A poster is 3 inches longer than it is wide, and its area is 40 square inches. " + N(2) + "Let <strong>w</strong> be the width in inches. " + N(3) + "Jun writes w(w + 3) = 40, rewrites it as w² + 3w − 40 = 0 and factors. " + N(4) + "The same worksheet asks about 2x² − 8 = 0, x² + 2x − 7 = 0, 3x² − 2x + 1 = 0 and x² − 10x + 25 = 0.</p>",
      claims: [
        {
          id: "factor",
          sol: "A.EI.3.a",
          stem: "What are the solutions of w² + 3w − 40 = 0?",
          choices: [
            { letter: "A", text: "w = 5 or w = −8" },
            { letter: "B", text: "w = −5 or w = 8" },
            { letter: "C", text: "w = 4 or w = 10" },
            { letter: "D", text: "w = 3 or w = 40" }
          ],
          correct: "A"
        },
        {
          id: "context",
          sol: "A.EI.3.c",
          stem: "What are the dimensions of the poster?",
          choices: [
            { letter: "A", text: "8 inches by 11 inches" },
            { letter: "B", text: "5 inches by 8 inches" },
            { letter: "C", text: "4 inches by 10 inches" },
            { letter: "D", text: "−8 inches by −5 inches" }
          ],
          correct: "B"
        },
        {
          id: "sqrt",
          sol: "A.EI.3.a",
          stem: "What are the solutions of 2x² − 8 = 0?",
          choices: [
            { letter: "A", text: "x = 4 only" },
            { letter: "B", text: "x = 2 only" },
            { letter: "C", text: "x = 2 or x = −2" },
            { letter: "D", text: "x = 4 or x = −4" }
          ],
          correct: "C"
        },
        {
          id: "irrational",
          sol: "A.EI.3.a",
          stem: "Using the quadratic formula, what are the solutions of x² + 2x − 7 = 0?",
          choices: [
            { letter: "A", text: "x = 1 ± √7" },
            { letter: "B", text: "x = −2 ± 2√2" },
            { letter: "C", text: "x = −1 ± 2√2" },
            { letter: "D", text: "x = −1 ± 4" }
          ],
          correct: "C"
        },
        {
          id: "discriminant",
          sol: "A.EI.3.b",
          stem: "How many real solutions does 3x² − 2x + 1 = 0 have, and why?",
          choices: [
            { letter: "A", text: "two, because the equation has three terms" },
            { letter: "B", text: "one, because the leading coefficient is 3" },
            { letter: "C", text: "two, because b² − 4ac = 4 + 12 = 16" },
            { letter: "D", text: "none, because b² − 4ac = 4 − 12 = −8 is negative" }
          ],
          correct: "D"
        },
        {
          id: "double",
          sol: "A.EI.3.b",
          stem: "Which statement about x² − 10x + 25 = 0 is true?",
          choices: [
            { letter: "A", text: "It has two real solutions, 5 and −5." },
            { letter: "B", text: "It has one real solution, 5, because it factors as (x − 5)²." },
            { letter: "C", text: "It has no real solutions because 25 is positive." },
            { letter: "D", text: "It has one real solution, −5, because it factors as (x + 5)²." }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- short · level 2 · A.EI.1 ---------- */
    {
      id: "ei-lawn-money",
      family: "EI",
      title: "Mowing for a Bike",
      kind: "Equations & Inequalities · A.EI.1",
      blurb: "$15 a lawn, $45 spent on gas, a $300 bike. How many lawns?",
      level: 2,
      passage: "<p>" + N(1) + "Dante earns $15 for every lawn he mows. " + N(2) + "He already spent $45 on gas for the mower. " + N(3) + "He wants at least $300 left over to buy a bike. " + N(4) + "Let <strong>n</strong> be the number of lawns he mows this summer.</p>",
      claims: [
        {
          id: "write",
          sol: "A.EI.1.a",
          stem: "Which inequality represents Dante's goal?",
          choices: [
            { letter: "A", text: "15n + 45 ≥ 300" },
            { letter: "B", text: "15n − 45 ≥ 300" },
            { letter: "C", text: "15n − 45 ≤ 300" },
            { letter: "D", text: "45n − 15 ≥ 300" }
          ],
          correct: "B"
        },
        {
          id: "solve",
          sol: "A.EI.1.c",
          stem: "What is the least number of lawns Dante must mow?",
          choices: [
            { letter: "A", text: "17" },
            { letter: "B", text: "20" },
            { letter: "C", text: "23" },
            { letter: "D", text: "24" }
          ],
          correct: "C"
        },
        {
          id: "graph",
          sol: "A.EI.1.c",
          stem: "Which number line shows the solution set of 15n − 45 ≥ 300?",
          choices: [
            { letter: "A", text: "closed circle at 23, shaded to the right" },
            { letter: "B", text: "open circle at 23, shaded to the right" },
            { letter: "C", text: "closed circle at 23, shaded to the left" },
            { letter: "D", text: "closed circle at 17, shaded to the right" }
          ],
          correct: "A"
        },
        {
          id: "verify",
          sol: "A.EI.1.f",
          stem: "Which statement verifies the solution in context?",
          choices: [
            { letter: "A", text: "15(22) − 45 = 285, so 22 lawns is enough." },
            { letter: "B", text: "15(23) + 45 = 390, so 23 lawns leaves $390 for the bike." },
            { letter: "C", text: "15(23) − 45 = 300, so 23 lawns leaves exactly $300 for the bike." },
            { letter: "D", text: "300 ÷ 15 = 20, so 20 lawns is enough." }
          ],
          correct: "C"
        },
        {
          id: "other",
          sol: "A.EI.1.c",
          stem: "What is the solution set of 7 − 2(x + 1) < 15?",
          choices: [
            { letter: "A", text: "x < −5" },
            { letter: "B", text: "x > −5" },
            { letter: "C", text: "x > 5" },
            { letter: "D", text: "x < 5" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- long · level 3 · A.EI.2 ---------- */
    {
      id: "ei-acid-mixture",
      family: "EI",
      title: "Mixing Two Acid Solutions",
      kind: "Equations & Inequalities · A.EI.2",
      blurb: "10% and 30% solutions, 20 liters at 25%. A system with a twist.",
      level: 3,
      passage: "<p>" + N(1) + "A chemistry teacher needs 20 liters of a 25% acid solution. " + N(2) + "The stockroom has a 10% solution and a 30% solution. " + N(3) + "Let <strong>x</strong> be the liters of the 10% solution and <strong>y</strong> the liters of the 30% solution. " + N(4) + "The total volume gives x + y = 20. " + N(5) + "The amount of pure acid gives 0.10x + 0.30y = 0.25(20), which is 0.10x + 0.30y = 5. " + N(6) + "Two students disagree: Ana says the answer is 5 liters of the 10% solution, and Ben says it is 15 liters of the 10% solution. " + N(7) + "For homework, the class also studies the system y = 2x + 1 and y = 2x − 3.</p>",
      claims: [
        {
          id: "system",
          sol: "A.EI.2.a",
          stem: "Why does the second equation use 0.10x + 0.30y instead of x + y?",
          choices: [
            { letter: "A", text: "It counts only the pure acid, not the total liquid." },
            { letter: "B", text: "Decimals make the equation easier to graph." },
            { letter: "C", text: "It counts the water in each solution." },
            { letter: "D", text: "The percents must add up to 40%." }
          ],
          correct: "A"
        },
        {
          id: "solve",
          sol: "A.EI.2.b",
          stem: "How many liters of each solution should the teacher mix?",
          choices: [
            { letter: "A", text: "15 liters of 10% and 5 liters of 30%" },
            { letter: "B", text: "10 liters of each" },
            { letter: "C", text: "5 liters of 10% and 15 liters of 30%" },
            { letter: "D", text: "2 liters of 10% and 18 liters of 30%" }
          ],
          correct: "C"
        },
        {
          id: "who",
          sol: "A.EI.2.h",
          stem: "Who is correct, Ana or Ben, and how can you tell?",
          choices: [
            { letter: "A", text: "Ben, because 15 + 5 = 20 liters." },
            { letter: "B", text: "Ana, because 0.10(5) + 0.30(15) = 5 liters of acid and 5 + 15 = 20." },
            { letter: "C", text: "Ben, because 0.10(15) + 0.30(5) = 3 liters of acid." },
            { letter: "D", text: "Both, because a system always has two solutions." }
          ],
          correct: "B"
        },
        {
          id: "elimination",
          sol: "A.EI.2.b",
          stem: "To solve by elimination, a student multiplies x + y = 20 by −0.10 and adds it to the acid equation. Which equation results?",
          choices: [
            { letter: "A", text: "0.40y = 7" },
            { letter: "B", text: "0.20x = 3" },
            { letter: "C", text: "0.20y = 3" },
            { letter: "D", text: "0.30y = 5" }
          ],
          correct: "C"
        },
        {
          id: "parallel",
          sol: "A.EI.2.c",
          stem: "How many solutions does the system y = 2x + 1 and y = 2x − 3 have?",
          choices: [
            { letter: "A", text: "none, because the lines have the same slope and different y-intercepts" },
            { letter: "B", text: "exactly one, because the y-intercepts are different" },
            { letter: "C", text: "infinitely many, because the slopes are equal" },
            { letter: "D", text: "exactly one, at the point (2, 5) where they cross" }
          ],
          correct: "A"
        },
        {
          id: "sense",
          sol: "A.EI.2.h",
          stem: "Suppose the teacher needed a 35% solution instead. What would happen to the system?",
          choices: [
            { letter: "A", text: "It would have infinitely many solutions, one for each mixture." },
            { letter: "B", text: "One amount would come out negative, since 35% is stronger than both stock solutions." },
            { letter: "C", text: "The solution would be exactly 10 liters of each solution." },
            { letter: "D", text: "Only the total-volume equation would change, not the acid one." }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- long · level 3 · A.EI.3 ---------- */
    {
      id: "ei-model-rocket",
      family: "EI",
      title: "Model Rocket Height Table",
      kind: "Equations & Inequalities · A.EI.3",
      blurb: "h = −5t² + 40t. Use the table and the equation to answer height questions.",
      level: 3,
      passage: "<p>" + N(1) + "A model rocket's height in meters after t seconds is h = −5t² + 40t. " + N(2) + "The launch team records the height each second in the table. " + N(3) + "They want to know when the rocket is at 60 meters, whether it ever reaches 100 meters, and when it lands. " + N(4) + "Setting h = 60 gives −5t² + 40t = 60, and dividing by −5 gives t² − 8t + 12 = 0.</p>" +
        "<table><tr><th>t (s)</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr><tr><th>h (m)</th><td>0</td><td>35</td><td>60</td><td>75</td><td>80</td><td>75</td><td>60</td><td>35</td><td>0</td></tr></table>",
      claims: [
        {
          id: "land",
          sol: "A.EI.3.a",
          stem: "Solving −5t² + 40t = 0 by factoring gives −5t(t − 8) = 0. When does the rocket land?",
          choices: [
            { letter: "A", text: "after 5 seconds" },
            { letter: "B", text: "after 8 seconds" },
            { letter: "C", text: "after 40 seconds" },
            { letter: "D", text: "after 4 seconds" }
          ],
          correct: "B"
        },
        {
          id: "sixty",
          sol: "A.EI.3.a",
          stem: "What are the solutions of t² − 8t + 12 = 0?",
          choices: [
            { letter: "A", text: "t = 3 or t = 4" },
            { letter: "B", text: "t = −2 or t = −6" },
            { letter: "C", text: "t = 2 or t = 6" },
            { letter: "D", text: "t = 4 only" }
          ],
          correct: "C"
        },
        {
          id: "two-times",
          sol: "A.EI.3.c",
          stem: "Why does the equation for h = 60 have two solutions, and how does the table confirm them?",
          choices: [
            { letter: "A", text: "The rocket passes 60 m going up and again coming down; the table shows h = 60 at t = 2 and t = 6." },
            { letter: "B", text: "Every quadratic has two solutions; the table shows h = 60 at t = 3 and t = 5." },
            { letter: "C", text: "One solution is an error; the table shows h = 60 only at t = 2." },
            { letter: "D", text: "The rocket is launched twice; the table shows h = 0 at t = 0 and t = 8." }
          ],
          correct: "A"
        },
        {
          id: "hundred",
          sol: "A.EI.3.b",
          stem: "Does the rocket ever reach 100 meters? Setting h = 100 gives t² − 8t + 20 = 0.",
          choices: [
            { letter: "A", text: "Yes, at t = 10, because 100 ÷ 10 = 10." },
            { letter: "B", text: "Yes, at t = 4 and again at t = 5, on the way down." },
            { letter: "C", text: "No; b² − 4ac = 64 − 80 < 0, so there is no real solution." },
            { letter: "D", text: "No, because the table stops at t = 8." }
          ],
          correct: "C"
        },
        {
          id: "eighty",
          sol: "A.EI.3.b",
          stem: "Setting h = 80 gives t² − 8t + 16 = 0. What does the number of solutions tell the launch team?",
          choices: [
            { letter: "A", text: "Two solutions: the rocket is at 80 m twice." },
            { letter: "B", text: "One solution, t = 4: the rocket reaches 80 m once, at its peak." },
            { letter: "C", text: "No solutions: the rocket never reaches 80 m." },
            { letter: "D", text: "One solution, t = 16: the rocket reaches 80 m after landing." }
          ],
          correct: "B"
        },
        {
          id: "verify",
          sol: "A.EI.3.c",
          stem: "Which substitution verifies that t = 6 is a solution of −5t² + 40t = 60?",
          choices: [
            { letter: "A", text: "−5(36) + 40(6) = −180 + 240 = 60" },
            { letter: "B", text: "−5(12) + 40(6) = −60 + 240 = 180" },
            { letter: "C", text: "−5(6) + 40(6) = 210" },
            { letter: "D", text: "(−5 · 6)² + 40 = 940" }
          ],
          correct: "A"
        }
      ]
    },

    /* ---------- medium · level 2 · A.EI.1 ---------- */
    {
      id: "ei-field-trip-bus",
      family: "EI",
      title: "Field Trip Bus Math",
      kind: "Equations & Inequalities · A.EI.1",
      blurb: "Bus rental, museum tickets and a per-student price. Equations from a real budget.",
      level: 2,
      passage: "<p>" + N(1) + "A field trip costs $240 for the bus plus $6 per student for museum tickets. " + N(2) + "The school collects $10 from each student. " + N(3) + "Let <strong>n</strong> be the number of students. " + N(4) + "Ms. Ortiz asks: how many students make the trip break even, how many are needed to raise at least $100 extra for lunch, and what happens if the bus company raises its price to $396 while the museum drops tickets to $4? " + N(5) + "She also writes the formula T = 240 + 6n for the trip cost and asks students to solve it for n.</p>",
      claims: [
        {
          id: "break-even",
          sol: "A.EI.1.b",
          stem: "How many students make the money collected equal to the trip cost?",
          choices: [
            { letter: "A", text: "24" },
            { letter: "B", text: "40" },
            { letter: "C", text: "60" },
            { letter: "D", text: "15" }
          ],
          correct: "C"
        },
        {
          id: "write",
          sol: "A.EI.1.a",
          stem: "Which equation represents the break-even question?",
          choices: [
            { letter: "A", text: "10n = 240 + 6n" },
            { letter: "B", text: "10n + 240 = 6n" },
            { letter: "C", text: "10 + 6n = 240" },
            { letter: "D", text: "240n = 10 + 6" }
          ],
          correct: "A"
        },
        {
          id: "lunch",
          sol: "A.EI.1.c",
          stem: "Which inequality and solution show how many students are needed to raise at least $100 extra?",
          choices: [
            { letter: "A", text: "10n − (240 + 6n) ≤ 100; n ≤ 85" },
            { letter: "B", text: "10n − (240 + 6n) ≥ 100; n ≥ 85" },
            { letter: "C", text: "10n − 240 ≥ 100; n ≥ 34" },
            { letter: "D", text: "4n ≥ 100; n ≥ 25" }
          ],
          correct: "B"
        },
        {
          id: "literal",
          sol: "A.EI.1.d",
          stem: "Which equation is T = 240 + 6n solved for n?",
          choices: [
            { letter: "A", text: "n = T − 240 − 6" },
            { letter: "B", text: "n = (T + 240) ÷ 6" },
            { letter: "C", text: "n = 6T − 240" },
            { letter: "D", text: "n = (T − 240) ÷ 6" }
          ],
          correct: "D"
        },
        {
          id: "new-prices",
          sol: "A.EI.1.b",
          stem: "With the new prices, the break-even equation is 10n = 396 + 4n. How many students are needed?",
          choices: [
            { letter: "A", text: "40" },
            { letter: "B", text: "100" },
            { letter: "C", text: "66" },
            { letter: "D", text: "29" }
          ],
          correct: "C"
        },
        {
          id: "explain",
          sol: "A.EI.1.f",
          stem: "In the break-even solution, the number 4 in 4n = 240 represents —",
          choices: [
            { letter: "A", text: "the number of buses the school must rent" },
            { letter: "B", text: "the amount each student pays for the trip" },
            { letter: "C", text: "what each student pays beyond that student's ticket" },
            { letter: "D", text: "the cost of one museum ticket per student" }
          ],
          correct: "C"
        }
      ]
    }
  ];

  for (var i = 0; i < PACKS.length; i++) P.push(PACKS[i]);
})(typeof window !== "undefined" ? window : global);
