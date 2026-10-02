/* SOL Lab — Algebra I · Expressions & Operations (A.EO). Original problems only.
   Stems are plain text (Unicode: x², √, ∛, −, ≤); the stimulus may use HTML. */
(function (global) {
  var P = global.HEIST_PACKS;
  if (!P || !P.push) return;
  var N = function (i) { return '<span class="n">(' + i + ')</span> '; };   // numbered sentence

  var PACKS = [

    /* ---------- tiny · level 1 · A.EO.1 ---------- */
    {
      id: "eo-play-tickets",
      family: "EO",
      title: "Drama Club Ticket Table",
      kind: "Expressions & Operations · A.EO.1",
      blurb: "Adult and student tickets, one program bill. Write the expression, then evaluate it.",
      level: 1,
      passage: "<p>" + N(1) + "The drama club sells adult tickets for $8 and student tickets for $5. " + N(2) + "Printing the programs costs the club $40 no matter how many tickets sell. " + N(3) + "Let <strong>t</strong> be the number of adult tickets and <strong>s</strong> the number of student tickets sold. " + N(4) + "The treasurer wrote the club's <strong>profit</strong> as 8t + 5s − 40.</p>",
      claims: [
        {
          id: "collected",
          sol: "A.EO.1.a",
          stem: "Which expression represents the total money collected from ticket sales?",
          choices: [
            { letter: "A", text: "8 + 5 + t + s" },
            { letter: "B", text: "8t + 5s" },
            { letter: "C", text: "13(t + s)" },
            { letter: "D", text: "8s + 5t" }
          ],
          correct: "B"
        },
        {
          id: "evaluate",
          sol: "A.EO.1.b",
          stem: "What is the profit when t = 12 and s = 30?",
          choices: [
            { letter: "A", text: "$206" },
            { letter: "B", text: "$246" },
            { letter: "C", text: "$166" },
            { letter: "D", text: "$286" }
          ],
          correct: "A"
        },
        {
          id: "phrase",
          sol: "A.EO.1.a",
          stem: "Which expression represents \"three less than twice the number of student tickets\"?",
          choices: [
            { letter: "A", text: "3 − 2s" },
            { letter: "B", text: "2(s − 3)" },
            { letter: "C", text: "2s − 3" },
            { letter: "D", text: "3s − 2" }
          ],
          correct: "C"
        },
        {
          id: "absval",
          sol: "A.EO.1.b",
          stem: "The treasurer compares the two ticket types using |s − 2t|. What is its value when t = 12 and s = 20?",
          choices: [
            { letter: "A", text: "−4" },
            { letter: "B", text: "44" },
            { letter: "C", text: "8" },
            { letter: "D", text: "4" }
          ],
          correct: "D"
        },
        {
          id: "quotient",
          sol: "A.EO.1.a",
          stem: "\"The quotient of the number of student tickets and 4\" is written as —",
          choices: [
            { letter: "A", text: "s − 4" },
            { letter: "B", text: "s ÷ 4" },
            { letter: "C", text: "4s" },
            { letter: "D", text: "4 ÷ s" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- tiny · level 1 · A.EO.2 ---------- */
    {
      id: "eo-garden-bed",
      family: "EO",
      title: "The Raised Garden Bed",
      kind: "Expressions & Operations · A.EO.2",
      blurb: "A garden bed measured in x. Multiply, add, factor and evaluate.",
      level: 1,
      passage: "<p>" + N(1) + "A raised garden bed is a rectangle. " + N(2) + "Its length is (x + 5) feet and its width is (x + 2) feet. " + N(3) + "Mr. Okafor asks his class to write the <strong>area</strong> and the <strong>perimeter</strong> of the bed as polynomials in x, then to check their work with x = 3.</p>",
      claims: [
        {
          id: "area",
          sol: "A.EO.2.b",
          stem: "Which polynomial represents the area of the bed?",
          choices: [
            { letter: "A", text: "x² + 10" },
            { letter: "B", text: "x² + 7x + 10" },
            { letter: "C", text: "2x + 7" },
            { letter: "D", text: "x² + 10x + 7" }
          ],
          correct: "B"
        },
        {
          id: "perimeter",
          sol: "A.EO.2.a",
          stem: "Which polynomial represents the perimeter of the bed?",
          choices: [
            { letter: "A", text: "2x + 7" },
            { letter: "B", text: "x² + 7x + 10" },
            { letter: "C", text: "4x + 7" },
            { letter: "D", text: "4x + 14" }
          ],
          correct: "D"
        },
        {
          id: "check",
          sol: "A.EO.1.b",
          stem: "When x = 3, what is the area of the bed in square feet?",
          choices: [
            { letter: "A", text: "40" },
            { letter: "B", text: "26" },
            { letter: "C", text: "24" },
            { letter: "D", text: "19" }
          ],
          correct: "A"
        },
        {
          id: "factor",
          sol: "A.EO.2.c",
          stem: "A student is given only the area polynomial x² + 7x + 10. Which factored form gives the length and width?",
          choices: [
            { letter: "A", text: "(x + 10)(x + 1)" },
            { letter: "B", text: "(x + 7)(x + 10)" },
            { letter: "C", text: "(x + 5)(x + 2)" },
            { letter: "D", text: "(x − 5)(x − 2)" }
          ],
          correct: "C"
        },
        {
          id: "equiv",
          sol: "A.EO.2.e",
          stem: "Which expression is equivalent to (x + 5)(x + 2) for every value of x?",
          choices: [
            { letter: "A", text: "x(x + 7) + 10" },
            { letter: "B", text: "x² + 7 + 10" },
            { letter: "C", text: "(x + 7)² + 10" },
            { letter: "D", text: "x² + 10x + 7" }
          ],
          correct: "A"
        }
      ]
    },

    /* ---------- tiny · level 1 · A.EO.3 ---------- */
    {
      id: "eo-powers-of-two",
      family: "EO",
      title: "Powers of Two Pattern",
      kind: "Expressions & Operations · A.EO.3",
      blurb: "A table of powers of 2 shows where the exponent rules come from.",
      level: 1,
      passage: "<p>" + N(1) + "Jada made a table of powers of 2 to look for patterns before her quiz on the <strong>laws of exponents</strong>. " + N(2) + "She noticed that multiplying two rows adds their exponents.</p>" +
        "<table><tr><th>Power</th><th>Value</th></tr><tr><td>2<sup>1</sup></td><td>2</td></tr><tr><td>2<sup>2</sup></td><td>4</td></tr><tr><td>2<sup>3</sup></td><td>8</td></tr><tr><td>2<sup>4</sup></td><td>16</td></tr><tr><td>2<sup>5</sup></td><td>32</td></tr><tr><td>2<sup>6</sup></td><td>64</td></tr><tr><td>2<sup>7</sup></td><td>128</td></tr></table>",
      claims: [
        {
          id: "product",
          sol: "A.EO.3.a",
          stem: "Using the table, 8 × 16 = 128. Which exponent rule does this show?",
          choices: [
            { letter: "A", text: "2³ × 2⁴ = 2¹² because exponents multiply" },
            { letter: "B", text: "2³ × 2⁴ = 2⁷ because exponents add" },
            { letter: "C", text: "2³ × 2⁴ = 4⁷ because bases add" },
            { letter: "D", text: "2³ × 2⁴ = 2¹ because exponents subtract" }
          ],
          correct: "B"
        },
        {
          id: "quotient",
          sol: "A.EO.3.a",
          stem: "Which expression is equivalent to 2⁷ ÷ 2⁵?",
          choices: [
            { letter: "A", text: "2¹²" },
            { letter: "B", text: "1²" },
            { letter: "C", text: "2²" },
            { letter: "D", text: "2³⁵" }
          ],
          correct: "C"
        },
        {
          id: "power",
          sol: "A.EO.3.a",
          stem: "Jada squares the value of 2³: 8 × 8 = 64. Which single power of 2 equals (2³)²?",
          choices: [
            { letter: "A", text: "2⁵" },
            { letter: "B", text: "2⁹" },
            { letter: "C", text: "4⁶" },
            { letter: "D", text: "2⁶" }
          ],
          correct: "D"
        },
        {
          id: "negative",
          sol: "A.EO.3.b",
          stem: "Extending the pattern downward, each row is half the row below it. What is the value of 2⁻²?",
          choices: [
            { letter: "A", text: "1/4" },
            { letter: "B", text: "−4" },
            { letter: "C", text: "−1/4" },
            { letter: "D", text: "0" }
          ],
          correct: "A"
        },
        {
          id: "monomials",
          sol: "A.EO.3.b",
          stem: "Which expression is equivalent to (3x²y)(4x³y²)?",
          choices: [
            { letter: "A", text: "7x⁵y³" },
            { letter: "B", text: "12x⁶y²" },
            { letter: "C", text: "12x⁵y³" },
            { letter: "D", text: "7x⁶y²" }
          ],
          correct: "C"
        }
      ]
    },

    /* ---------- tiny · level 2 · A.EO.4 ---------- */
    {
      id: "eo-square-tiles",
      family: "EO",
      title: "Tiles for the Science Lab",
      kind: "Expressions & Operations · A.EO.4",
      blurb: "Square tiles with an area of 50: the side length is a radical in simplest form.",
      level: 2,
      passage: "<p>" + N(1) + "New square floor tiles for the science lab each have an area of 50 square inches. " + N(2) + "Priya says the side length is √50 inches and that the school wants the answer in <strong>simplest radical form</strong>. " + N(3) + "A cube-shaped storage bin in the same room has a volume of 54 cubic feet, so its edge is ∛54 feet.</p>",
      claims: [
        {
          id: "side",
          sol: "A.EO.4.a",
          stem: "What is √50 in simplest radical form?",
          choices: [
            { letter: "A", text: "25√2" },
            { letter: "B", text: "5√2" },
            { letter: "C", text: "2√5" },
            { letter: "D", text: "10√5" }
          ],
          correct: "B"
        },
        {
          id: "cube",
          sol: "A.EO.4.b",
          stem: "What is ∛54 in simplest form?",
          choices: [
            { letter: "A", text: "3∛2" },
            { letter: "B", text: "2∛3" },
            { letter: "C", text: "9∛6" },
            { letter: "D", text: "18∛3" }
          ],
          correct: "A"
        },
        {
          id: "add",
          sol: "A.EO.4.c",
          stem: "Two tiles are laid side by side. Which expression equals 3√2 + 5√2?",
          choices: [
            { letter: "A", text: "8√4" },
            { letter: "B", text: "15√2" },
            { letter: "C", text: "8√2" },
            { letter: "D", text: "15√4" }
          ],
          correct: "C"
        },
        {
          id: "multiply",
          sol: "A.EO.4.c",
          stem: "What is the product √8 · √2?",
          choices: [
            { letter: "A", text: "√10" },
            { letter: "B", text: "16" },
            { letter: "C", text: "2√2" },
            { letter: "D", text: "4" }
          ],
          correct: "D"
        },
        {
          id: "rational",
          sol: "A.EO.4.d",
          stem: "Priya writes the side of a 25-square-inch tile as 25^(1/2). Which value is equivalent?",
          choices: [
            { letter: "A", text: "12.5" },
            { letter: "B", text: "5" },
            { letter: "C", text: "√12.5" },
            { letter: "D", text: "625" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- short · level 2 · A.EO.2 ---------- */
    {
      id: "eo-factoring-fence",
      family: "EO",
      title: "Factoring Practice Sheet",
      kind: "Expressions & Operations · A.EO.2",
      blurb: "Five polynomials on a practice sheet. Factor each one completely.",
      level: 2,
      passage: "<p>" + N(1) + "Mrs. Lee's practice sheet asks students to <strong>factor completely</strong>: take out the greatest common factor first, then look for a difference of squares or a trinomial pattern. " + N(2) + "She warns that an answer is not complete if one of the factors can still be factored.</p>" +
        "<ol><li>2x² + 8x</li><li>x² − 9</li><li>3x² + 10x + 8</li><li>x² − 5x − 14</li><li>4x² − 36</li></ol>",
      claims: [
        {
          id: "gcf",
          sol: "A.EO.2.c",
          stem: "What is the completely factored form of 2x² + 8x?",
          choices: [
            { letter: "A", text: "2(x² + 4x)" },
            { letter: "B", text: "x(2x + 8)" },
            { letter: "C", text: "2x(x + 4)" },
            { letter: "D", text: "2x(x + 8)" }
          ],
          correct: "C"
        },
        {
          id: "dos",
          sol: "A.EO.2.c",
          stem: "What is the completely factored form of x² − 9?",
          choices: [
            { letter: "A", text: "(x − 3)(x + 3)" },
            { letter: "B", text: "(x − 3)²" },
            { letter: "C", text: "(x − 9)(x + 1)" },
            { letter: "D", text: "x(x − 9)" }
          ],
          correct: "A"
        },
        {
          id: "trinomial",
          sol: "A.EO.2.c",
          stem: "What is the completely factored form of 3x² + 10x + 8?",
          choices: [
            { letter: "A", text: "(3x + 2)(x + 4)" },
            { letter: "B", text: "(3x + 4)(x + 2)" },
            { letter: "C", text: "(3x + 8)(x + 1)" },
            { letter: "D", text: "3(x + 2)(x + 4)" }
          ],
          correct: "B"
        },
        {
          id: "negative",
          sol: "A.EO.2.c",
          stem: "What is the completely factored form of x² − 5x − 14?",
          choices: [
            { letter: "A", text: "(x + 7)(x − 2)" },
            { letter: "B", text: "(x − 7)(x − 2)" },
            { letter: "C", text: "(x + 7)(x + 2)" },
            { letter: "D", text: "(x − 7)(x + 2)" }
          ],
          correct: "D"
        },
        {
          id: "incomplete",
          sol: "A.EO.2.e",
          stem: "A student wrote 4x² − 36 = (2x − 6)(2x + 6), which is correct but not complete. Which expression is the completely factored form and is equal to 4x² − 36 for every x?",
          choices: [
            { letter: "A", text: "(2x − 6)(2x − 6)" },
            { letter: "B", text: "4(x − 3)(x + 3)" },
            { letter: "C", text: "(4x − 6)(x + 6)" },
            { letter: "D", text: "4(x − 6)(x + 6)" }
          ],
          correct: "B"
        },
        {
          id: "check",
          sol: "A.EO.2.b",
          stem: "To check item 3, a student multiplies (3x + 4)(x + 2). Which product does she get?",
          choices: [
            { letter: "A", text: "3x² + 10x + 8" },
            { letter: "B", text: "3x² + 6x + 8" },
            { letter: "C", text: "4x² + 10x + 6" },
            { letter: "D", text: "3x² + 8" }
          ],
          correct: "A"
        }
      ]
    },

    /* ---------- short · level 2 · A.EO.2 ---------- */
    {
      id: "eo-polynomial-division",
      family: "EO",
      title: "Sharing a Polynomial Evenly",
      kind: "Expressions & Operations · A.EO.2",
      blurb: "Adding, subtracting and dividing polynomials from a homework set.",
      level: 2,
      passage: "<p>" + N(1) + "Tonight's homework covers <strong>sums</strong>, <strong>differences</strong> and <strong>quotients</strong> of polynomials. " + N(2) + "Dividing by a monomial means dividing every term; dividing by a binomial can be done by factoring the numerator when the divisor is one of its factors.</p>" +
        "<ol><li>(4x² − 3x + 7) − (x² + 5x − 2)</li><li>(x³ + 2x²) + (3x² − x)</li><li>(6x³ + 9x² − 3x) ÷ 3x</li><li>(x² + 7x + 12) ÷ (x + 3)</li><li>(2x² − x − 6) ÷ (x − 2)</li></ol>",
      claims: [
        {
          id: "difference",
          sol: "A.EO.2.a",
          stem: "What is the difference (4x² − 3x + 7) − (x² + 5x − 2)?",
          choices: [
            { letter: "A", text: "3x² + 2x + 5" },
            { letter: "B", text: "3x² − 8x + 9" },
            { letter: "C", text: "3x² − 8x + 5" },
            { letter: "D", text: "5x² + 2x + 9" }
          ],
          correct: "B"
        },
        {
          id: "sum",
          sol: "A.EO.2.a",
          stem: "What is the sum (x³ + 2x²) + (3x² − x)?",
          choices: [
            { letter: "A", text: "x³ + 5x² − x" },
            { letter: "B", text: "4x⁵ − x" },
            { letter: "C", text: "x³ + 6x² − x" },
            { letter: "D", text: "x³ + 5x² + x" }
          ],
          correct: "A"
        },
        {
          id: "monomial",
          sol: "A.EO.2.d",
          stem: "What is the quotient (6x³ + 9x² − 3x) ÷ 3x?",
          choices: [
            { letter: "A", text: "2x² + 3x" },
            { letter: "B", text: "2x³ + 3x² − 1" },
            { letter: "C", text: "2x² + 9x² − 3x" },
            { letter: "D", text: "2x² + 3x − 1" }
          ],
          correct: "D"
        },
        {
          id: "binomial",
          sol: "A.EO.2.d",
          stem: "What is the quotient (x² + 7x + 12) ÷ (x + 3)?",
          choices: [
            { letter: "A", text: "x + 3" },
            { letter: "B", text: "x + 12" },
            { letter: "C", text: "x + 4" },
            { letter: "D", text: "x − 4" }
          ],
          correct: "C"
        },
        {
          id: "binomial2",
          sol: "A.EO.2.d",
          stem: "What is the quotient (2x² − x − 6) ÷ (x − 2)?",
          choices: [
            { letter: "A", text: "2x − 3" },
            { letter: "B", text: "2x + 3" },
            { letter: "C", text: "x + 3" },
            { letter: "D", text: "2x + 6" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- short · level 1 · A.EO.1 ---------- */
    {
      id: "eo-phone-screen",
      family: "EO",
      title: "Measuring a Phone Screen",
      kind: "Expressions & Operations · A.EO.1",
      blurb: "Diagonals, decimals and absolute value: evaluating with real replacement values.",
      level: 1,
      passage: "<p>" + N(1) + "A phone screen is a rectangle a inches wide and b inches tall. " + N(2) + "Its diagonal, the size printed on the box, is √(a² + b²). " + N(3) + "Marcus also uses the expression 2(a + b) − c ÷ 4 to compare two phones, where c is the thickness in millimeters. " + N(4) + "For his phone, a = 3, b = 4 and c = 6. " + N(5) + "A second phone has a = 1.5, b = 2.5 and c = 6.</p>",
      claims: [
        {
          id: "diagonal",
          sol: "A.EO.1.b",
          stem: "What is the diagonal of Marcus's phone, in inches?",
          choices: [
            { letter: "A", text: "7" },
            { letter: "B", text: "√7" },
            { letter: "C", text: "12" },
            { letter: "D", text: "5" }
          ],
          correct: "D"
        },
        {
          id: "compare",
          sol: "A.EO.1.b",
          stem: "What is the value of 2(a + b) − c ÷ 4 for the second phone?",
          choices: [
            { letter: "A", text: "6.5" },
            { letter: "B", text: "1.5" },
            { letter: "C", text: "0.5" },
            { letter: "D", text: "8" }
          ],
          correct: "A"
        },
        {
          id: "absval",
          sol: "A.EO.1.b",
          stem: "What is the value of |−3.5 + 1| + 2?",
          choices: [
            { letter: "A", text: "−0.5" },
            { letter: "B", text: "4.5" },
            { letter: "C", text: "0.5" },
            { letter: "D", text: "6.5" }
          ],
          correct: "B"
        },
        {
          id: "translate",
          sol: "A.EO.1.a",
          stem: "\"The width increased by half the height\" is written as —",
          choices: [
            { letter: "A", text: "a + 2b" },
            { letter: "B", text: "(a + b) ÷ 2" },
            { letter: "C", text: "a + b ÷ 2" },
            { letter: "D", text: "2a + b" }
          ],
          correct: "C"
        },
        {
          id: "cuberoot",
          sol: "A.EO.1.b",
          stem: "The expression ∛(8a) is evaluated for a = 1.5. Hint: 8 × 1.5 = 12 is not a perfect cube, but ∛(8a) = 2∛a. Which value is exact?",
          choices: [
            { letter: "A", text: "2∛1.5" },
            { letter: "B", text: "4" },
            { letter: "C", text: "∛12 ÷ 2" },
            { letter: "D", text: "3" }
          ],
          correct: "A"
        }
      ]
    },

    /* ---------- medium · level 2 · A.EO.3 ---------- */
    {
      id: "eo-exponent-spreadsheet",
      family: "EO",
      title: "The Exponent Spreadsheet",
      kind: "Expressions & Operations · A.EO.3",
      blurb: "A spreadsheet of monomials to simplify, including negative and zero exponents.",
      level: 2,
      passage: "<p>" + N(1) + "Devin built a spreadsheet that checks exponent work by plugging in numbers. " + N(2) + "Column A holds an expression, column B his simplified answer, and column C shows whether both give the same value when x = 2 and y = 3. " + N(3) + "Three of his answers came back as <strong>mismatch</strong>.</p>" +
        "<table><tr><th>Expression</th><th>Devin's answer</th><th>Check</th></tr><tr><td>(x⁴)³ ÷ x⁵</td><td>x⁷</td><td>match</td></tr><tr><td>(2y²)³</td><td>2y⁶</td><td>mismatch</td></tr><tr><td>5⁰ · 5²</td><td>0</td><td>mismatch</td></tr><tr><td>4x³y⁻² ÷ (2xy³)</td><td>2x²y</td><td>mismatch</td></tr><tr><td>(x⁻³y²)⁻¹</td><td>x³ ÷ y²</td><td>match</td></tr></table>",
      claims: [
        {
          id: "power-of-power",
          sol: "A.EO.3.b",
          stem: "Devin's answer x⁷ for (x⁴)³ ÷ x⁵ matched. Which steps justify it?",
          choices: [
            { letter: "A", text: "(x⁴)³ = x⁷ because exponents add, then x⁷ ÷ x⁵ = x⁷ ÷ 1" },
            { letter: "B", text: "(x⁴)³ = x¹² because exponents multiply, then x¹² ÷ x⁵ = x⁷ because exponents subtract" },
            { letter: "C", text: "(x⁴)³ = x⁶⁴ because 4³ = 64, then 64 − 5 = 59" },
            { letter: "D", text: "(x⁴)³ = x¹² because exponents multiply, then x¹² ÷ x⁵ = x⁷ because exponents divide" }
          ],
          correct: "B"
        },
        {
          id: "coefficient",
          sol: "A.EO.3.b",
          stem: "What is the correct simplified form of (2y²)³?",
          choices: [
            { letter: "A", text: "6y⁶" },
            { letter: "B", text: "2y⁵" },
            { letter: "C", text: "8y⁶" },
            { letter: "D", text: "8y⁵" }
          ],
          correct: "C"
        },
        {
          id: "zero",
          sol: "A.EO.3.a",
          stem: "Why is 5⁰ · 5² not equal to 0?",
          choices: [
            { letter: "A", text: "Any nonzero base to the zero power is 1, so the product is 1 · 25 = 25." },
            { letter: "B", text: "5⁰ equals 5, so the product is 125." },
            { letter: "C", text: "The zero exponent cancels the 2, leaving 5." },
            { letter: "D", text: "The product of the exponents is 0, so the answer is 5⁰ = 0." }
          ],
          correct: "A"
        },
        {
          id: "ratio",
          sol: "A.EO.3.b",
          stem: "What is the correct simplified form of 4x³y⁻² ÷ (2xy³), with positive exponents?",
          choices: [
            { letter: "A", text: "2x²y" },
            { letter: "B", text: "2x² ÷ y⁵" },
            { letter: "C", text: "2x³ ÷ y⁵" },
            { letter: "D", text: "2x²y⁵" }
          ],
          correct: "B"
        },
        {
          id: "negative-power",
          sol: "A.EO.3.b",
          stem: "Which explanation shows why (x⁻³y²)⁻¹ = x³ ÷ y² is correct?",
          choices: [
            { letter: "A", text: "The outer −1 makes every exponent negative: x⁻³ becomes x³ and y² becomes y⁻²." },
            { letter: "B", text: "Adding −1 to each exponent gives x⁻⁴y¹, which simplifies to x³ ÷ y²." },
            { letter: "C", text: "A negative exponent means the answer is negative, so x³ ÷ y² is the opposite of x⁻³y²." },
            { letter: "D", text: "Multiplying each exponent by −1 gives x³y⁻², and y⁻² is the same as 1 ÷ y²." }
          ],
          correct: "D"
        },
        {
          id: "numeric-check",
          sol: "A.EO.1.b",
          stem: "Column C uses x = 2 and y = 3. What value does the correct answer to (2y²)³ give?",
          choices: [
            { letter: "A", text: "5832" },
            { letter: "B", text: "1458" },
            { letter: "C", text: "486" },
            { letter: "D", text: "216" }
          ],
          correct: "A"
        }
      ]
    },

    /* ---------- medium · level 3 · A.EO.2 ---------- */
    {
      id: "eo-shipping-box",
      family: "EO",
      title: "Designing a Shipping Box",
      kind: "Expressions & Operations · A.EO.2",
      blurb: "A box with sides x, x + 3 and 2x − 1. Expand, factor and check.",
      level: 3,
      passage: "<p>" + N(1) + "A packaging class designs a box whose height is x inches, width is (x + 3) inches and length is (2x − 1) inches. " + N(2) + "The <strong>volume</strong> is the product of the three dimensions. " + N(3) + "The area of the front face is width × height. " + N(4) + "Nia expanded the volume by first multiplying x(x + 3), then multiplying that result by (2x − 1). " + N(5) + "Her partner Sam factored a different expression from the same worksheet, 2x² + 5x − 3, and got (2x − 1)(x + 3).</p>",
      claims: [
        {
          id: "front",
          sol: "A.EO.2.b",
          stem: "Which polynomial represents the area of the front face?",
          choices: [
            { letter: "A", text: "x² + 3" },
            { letter: "B", text: "2x + 3" },
            { letter: "C", text: "x² + 3x" },
            { letter: "D", text: "3x²" }
          ],
          correct: "C"
        },
        {
          id: "volume",
          sol: "A.EO.2.b",
          stem: "Which polynomial represents the volume of the box?",
          choices: [
            { letter: "A", text: "2x³ + 5x² − 3x" },
            { letter: "B", text: "2x³ + 6x² − 3x" },
            { letter: "C", text: "2x³ − x² + 3x" },
            { letter: "D", text: "2x² + 5x − 3" }
          ],
          correct: "A"
        },
        {
          id: "evaluate",
          sol: "A.EO.1.b",
          stem: "What is the volume of the box, in cubic inches, when x = 2?",
          choices: [
            { letter: "A", text: "24" },
            { letter: "B", text: "30" },
            { letter: "C", text: "36" },
            { letter: "D", text: "15" }
          ],
          correct: "B"
        },
        {
          id: "sam-check",
          sol: "A.EO.2.c",
          stem: "Is Sam's factoring of 2x² + 5x − 3 correct?",
          choices: [
            { letter: "A", text: "No; the correct factors are (2x + 1)(x − 3)." },
            { letter: "B", text: "No; the correct factors are (2x + 3)(x − 1)." },
            { letter: "C", text: "Yes; (2x − 1)(x + 3) = 2x² + 6x − x − 3 = 2x² + 5x − 3." },
            { letter: "D", text: "Yes; (2x − 1)(x + 3) = 2x² − 3 because the middle terms cancel." }
          ],
          correct: "C"
        },
        {
          id: "square",
          sol: "A.EO.2.e",
          stem: "A lid for the box has area x² + 6x + 9 square inches. Which statement about the lid is true?",
          choices: [
            { letter: "A", text: "The lid is a square with side (x + 3), because x² + 6x + 9 = (x + 3)²." },
            { letter: "B", text: "The lid is a square with side (x + 9), because x² + 6x + 9 = (x + 9)²." },
            { letter: "C", text: "The lid is a rectangle with sides (x + 6) and (x + 1)." },
            { letter: "D", text: "The lid is a rectangle with sides x and (x + 6) plus 9 extra square inches that cannot be factored." }
          ],
          correct: "A"
        },
        {
          id: "five-terms",
          sol: "A.EO.2.b",
          stem: "What is the product (x + 1)(2x² + x + 3)?",
          choices: [
            { letter: "A", text: "2x³ + x² + 3x + 3" },
            { letter: "B", text: "2x³ + 3x² + 4x + 3" },
            { letter: "C", text: "2x³ + 2x² + 4x + 3" },
            { letter: "D", text: "2x² + 2x + 4" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- medium · level 3 · A.EO.4 ---------- */
    {
      id: "eo-radical-relay",
      family: "EO",
      title: "The Radical Relay",
      kind: "Expressions & Operations · A.EO.4",
      blurb: "Teams race to simplify radicals and rational exponents. Which answers are right?",
      level: 3,
      passage: "<p>" + N(1) + "In the radical relay, each team member simplifies one expression and passes the marker. " + N(2) + "A judge marks each answer right or wrong; a wrong answer sends the marker back. " + N(3) + "Team Blue's answers are shown below. " + N(4) + "The judge reminds everyone that a radical is in <strong>simplest form</strong> when no perfect-square factor (or perfect-cube factor, for cube roots) remains under the root.</p>" +
        "<table><tr><th>Expression</th><th>Team Blue</th></tr><tr><td>√72</td><td>6√2</td></tr><tr><td>2√12 − √27</td><td>√3</td></tr><tr><td>√6 · √10</td><td>√60</td></tr><tr><td>∛(−125)</td><td>−5</td></tr><tr><td>3∛16</td><td>3∛16</td></tr><tr><td>8^(1/3) + 49^(1/2)</td><td>9</td></tr></table>",
      claims: [
        {
          id: "seventy-two",
          sol: "A.EO.4.a",
          stem: "Why is 6√2 the correct simplest form of √72?",
          choices: [
            { letter: "A", text: "72 = 36 · 2 and √36 = 6, so √72 = 6√2." },
            { letter: "B", text: "72 = 6 · 12 and √12 = 2, so √72 = 6√2." },
            { letter: "C", text: "72 ÷ 2 = 36 and √36 = 6, so √72 = 6 ÷ √2." },
            { letter: "D", text: "√72 = √70 + √2 = 6√2." }
          ],
          correct: "A"
        },
        {
          id: "subtract",
          sol: "A.EO.4.c",
          stem: "Which work shows that 2√12 − √27 = √3?",
          choices: [
            { letter: "A", text: "2√12 − √27 = √24 − √27 = −√3, so the answer should be negative." },
            { letter: "B", text: "2√12 = 4√3 and √27 = 3√3, so 4√3 − 3√3 = √3." },
            { letter: "C", text: "2√12 = 2√3 and √27 = √3, so 2√3 − √3 = √3." },
            { letter: "D", text: "2√12 − √27 = √(24 − 27), which cannot be simplified." }
          ],
          correct: "B"
        },
        {
          id: "product",
          sol: "A.EO.4.c",
          stem: "The judge marked √60 wrong. What should Team Blue have written for √6 · √10?",
          choices: [
            { letter: "A", text: "√16" },
            { letter: "B", text: "4√15" },
            { letter: "C", text: "2√15" },
            { letter: "D", text: "60" }
          ],
          correct: "C"
        },
        {
          id: "cube-neg",
          sol: "A.EO.4.b",
          stem: "Why is ∛(−125) = −5 correct while √(−25) has no real value?",
          choices: [
            { letter: "A", text: "(−5)³ = −125, but no real number squared gives a negative result." },
            { letter: "B", text: "Cube roots are always negative, and square roots are always positive." },
            { letter: "C", text: "(−5)³ = 125, and the negative sign is moved outside the radical." },
            { letter: "D", text: "Both are correct; √(−25) = −5 as well." }
          ],
          correct: "A"
        },
        {
          id: "cube-simplify",
          sol: "A.EO.4.b",
          stem: "What is 3∛16 in simplest form?",
          choices: [
            { letter: "A", text: "12∛4" },
            { letter: "B", text: "3∛16 is already in simplest form" },
            { letter: "C", text: "6∛4" },
            { letter: "D", text: "6∛2" }
          ],
          correct: "D"
        },
        {
          id: "rational",
          sol: "A.EO.4.d",
          stem: "Team Blue wrote 9 for 8^(1/3) + 49^(1/2). Which explanation justifies the answer?",
          choices: [
            { letter: "A", text: "8 ÷ 3 ≈ 2.7 and 49 ÷ 2 = 24.5; rounding both gives 9." },
            { letter: "B", text: "8^(1/3) = ∛8 = 2 and 49^(1/2) = √49 = 7, and 2 + 7 = 9." },
            { letter: "C", text: "8^(1/3) = 8 ÷ 3 and 49^(1/2) = 49 ÷ 2; the sum rounds to 9." },
            { letter: "D", text: "8^(1/3) = 8 × 3 = 24 and 49^(1/2) = 49 × 2 = 98; the answer should be 122." }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- long · level 3 · A.EO.1 ---------- */
    {
      id: "eo-savings-plan",
      family: "EO",
      title: "Two Ways to Save",
      kind: "Expressions & Operations · A.EO.1",
      blurb: "Translating a savings plan into expressions and evaluating them with care.",
      level: 3,
      passage: "<p>" + N(1) + "Amara is comparing two ways to grow $500 she earned over the summer. " + N(2) + "A savings account pays 4% interest each year, so after t years it holds 500(1 + r)<sup>t</sup> dollars with r = 0.04. " + N(3) + "Her uncle offers a different deal: he will give her 7 times the sum of a number n and 3, but then take back the square of n, where n is the number of chores she skips each month. " + N(4) + "Amara also keeps a formula from class, √(b² − 4ac), to remind herself that the order of operations matters under a radical. " + N(5) + "She evaluates everything by hand before trusting a calculator.</p>" +
        "<table><tr><th>Expression</th><th>Replacement values</th></tr><tr><td>500(1 + r)<sup>t</sup></td><td>r = 0.04, t = 2</td></tr><tr><td>7(n + 3) − n²</td><td>n = −2</td></tr><tr><td>√(b² − 4ac)</td><td>a = 1, b = −5, c = 6</td></tr><tr><td>|2x − 9| + x</td><td>x = 2.5</td></tr></table>",
      claims: [
        {
          id: "interest",
          sol: "A.EO.1.b",
          stem: "How much is in the savings account after 2 years?",
          choices: [
            { letter: "A", text: "$540.00" },
            { letter: "B", text: "$520.00" },
            { letter: "C", text: "$540.80" },
            { letter: "D", text: "$1,040.00" }
          ],
          correct: "C"
        },
        {
          id: "uncle",
          sol: "A.EO.1.a",
          stem: "Which expression represents the uncle's deal in sentence 3?",
          choices: [
            { letter: "A", text: "7n + 3 − n²" },
            { letter: "B", text: "7(n + 3) − n²" },
            { letter: "C", text: "7(n + 3) − 2n" },
            { letter: "D", text: "(7n + 3)²" }
          ],
          correct: "B"
        },
        {
          id: "uncle-value",
          sol: "A.EO.1.b",
          stem: "What is the value of 7(n + 3) − n² when n = −2?",
          choices: [
            { letter: "A", text: "11" },
            { letter: "B", text: "−1" },
            { letter: "C", text: "3" },
            { letter: "D", text: "−11" }
          ],
          correct: "C"
        },
        {
          id: "discriminant",
          sol: "A.EO.1.b",
          stem: "What is the value of √(b² − 4ac) when a = 1, b = −5 and c = 6?",
          choices: [
            { letter: "A", text: "1" },
            { letter: "B", text: "7" },
            { letter: "C", text: "√49" },
            { letter: "D", text: "−1" }
          ],
          correct: "A"
        },
        {
          id: "absolute",
          sol: "A.EO.1.b",
          stem: "What is the value of |2x − 9| + x when x = 2.5?",
          choices: [
            { letter: "A", text: "−1.5" },
            { letter: "B", text: "1.5" },
            { letter: "C", text: "16.5" },
            { letter: "D", text: "6.5" }
          ],
          correct: "D"
        },
        {
          id: "radical",
          sol: "A.EO.4.a",
          stem: "For a different equation, a = 1, b = 4 and c = −1. What is √(b² − 4ac) in simplest radical form?",
          choices: [
            { letter: "A", text: "2√5" },
            { letter: "B", text: "√12" },
            { letter: "C", text: "4√5" },
            { letter: "D", text: "2√3" }
          ],
          correct: "A"
        }
      ]
    },

    /* ---------- short · level 2 · A.EO.2 ---------- */
    {
      id: "eo-area-model",
      family: "EO",
      title: "Area Model Warm-Up",
      kind: "Expressions & Operations · A.EO.2",
      blurb: "An area model for (2x + 3)(x + 4), then special products and factoring.",
      level: 2,
      passage: "<p>" + N(1) + "The warm-up shows an <strong>area model</strong> for the product (2x + 3)(x + 4): a rectangle split into four parts labeled 2x², 8x, 3x and 12. " + N(2) + "Below it are four more expressions to expand or factor.</p>" +
        "<table><tr><th></th><th>x</th><th>4</th></tr><tr><th>2x</th><td>2x²</td><td>8x</td></tr><tr><th>3</th><td>3x</td><td>12</td></tr></table>" +
        "<ol><li>(x − 5)²</li><li>(3x − 2)(3x + 2)</li><li>4x² − 25</li><li>12x³ − 18x²</li></ol>",
      claims: [
        {
          id: "model",
          sol: "A.EO.2.b",
          stem: "According to the area model, (2x + 3)(x + 4) equals —",
          choices: [
            { letter: "A", text: "2x² + 11x + 12" },
            { letter: "B", text: "2x² + 24x" },
            { letter: "C", text: "3x² + 11x + 12" },
            { letter: "D", text: "2x² + 12" }
          ],
          correct: "A"
        },
        {
          id: "square",
          sol: "A.EO.2.b",
          stem: "What is (x − 5)² written as a polynomial?",
          choices: [
            { letter: "A", text: "x² − 25" },
            { letter: "B", text: "x² + 25" },
            { letter: "C", text: "x² − 10x + 25" },
            { letter: "D", text: "x² − 10x − 25" }
          ],
          correct: "C"
        },
        {
          id: "conjugates",
          sol: "A.EO.2.b",
          stem: "What is the product (3x − 2)(3x + 2)?",
          choices: [
            { letter: "A", text: "9x² + 12x − 4" },
            { letter: "B", text: "9x² − 4" },
            { letter: "C", text: "6x² − 4" },
            { letter: "D", text: "9x² + 4" }
          ],
          correct: "B"
        },
        {
          id: "factor-dos",
          sol: "A.EO.2.c",
          stem: "What is the completely factored form of 4x² − 25?",
          choices: [
            { letter: "A", text: "(4x − 5)(x + 5)" },
            { letter: "B", text: "(2x − 5)²" },
            { letter: "C", text: "4(x² − 25)" },
            { letter: "D", text: "(2x − 5)(2x + 5)" }
          ],
          correct: "D"
        },
        {
          id: "gcf",
          sol: "A.EO.2.c",
          stem: "What is the completely factored form of 12x³ − 18x²?",
          choices: [
            { letter: "A", text: "6x(2x² − 3x)" },
            { letter: "B", text: "6x²(2x − 3)" },
            { letter: "C", text: "2x²(6x − 9)" },
            { letter: "D", text: "6x²(2x − 18)" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- long · level 2 · mixed A.EO ---------- */
    {
      id: "eo-robotics-budget",
      family: "EO",
      title: "Robotics Team Budget Sheet",
      kind: "Expressions & Operations · A.EO",
      blurb: "Expressions, exponents and radicals from one robotics team budget.",
      level: 2,
      passage: "<p>" + N(1) + "The robotics team tracks its money on one sheet. " + N(2) + "Each kit costs $k and each motor costs $m; the team buys 3 kits and 8 motors and gets a $25 discount. " + N(3) + "The arena is a square with an area of 128 square feet, so its side is √128 feet. " + N(4) + "A sensor's signal strength is modeled by 2⁴ · 2⁻⁶ of the maximum. " + N(5) + "The coach writes the volume of a cube-shaped battery case as 27 cubic inches and asks for its edge length. " + N(6) + "Finally, the fundraising total is written as \"the product of 12 and the sum of the number of car washes w and 5.\"</p>",
      claims: [
        {
          id: "cost",
          sol: "A.EO.1.a",
          stem: "Which expression represents the amount the team pays for kits and motors?",
          choices: [
            { letter: "A", text: "3k + 8m − 25" },
            { letter: "B", text: "11(k + m) − 25" },
            { letter: "C", text: "3k + 8m + 25" },
            { letter: "D", text: "25 − 3k − 8m" }
          ],
          correct: "A"
        },
        {
          id: "arena",
          sol: "A.EO.4.a",
          stem: "What is √128 in simplest radical form?",
          choices: [
            { letter: "A", text: "64√2" },
            { letter: "B", text: "4√8" },
            { letter: "C", text: "8√2" },
            { letter: "D", text: "2√32" }
          ],
          correct: "C"
        },
        {
          id: "signal",
          sol: "A.EO.3.a",
          stem: "The signal strength 2⁴ · 2⁻⁶ equals what fraction of the maximum?",
          choices: [
            { letter: "A", text: "1/2" },
            { letter: "B", text: "1/4" },
            { letter: "C", text: "4" },
            { letter: "D", text: "−4" }
          ],
          correct: "B"
        },
        {
          id: "edge",
          sol: "A.EO.4.d",
          stem: "Which expression gives the edge length of the battery case, in inches?",
          choices: [
            { letter: "A", text: "27^(1/2) = 9" },
            { letter: "B", text: "27 ÷ 3 = 9" },
            { letter: "C", text: "27^(1/3) = 3" },
            { letter: "D", text: "√27 = 3√3" }
          ],
          correct: "C"
        },
        {
          id: "fundraising",
          sol: "A.EO.1.a",
          stem: "Which expression represents the fundraising total in sentence 6?",
          choices: [
            { letter: "A", text: "12w + 5" },
            { letter: "B", text: "12(w + 5)" },
            { letter: "C", text: "12 + 5w" },
            { letter: "D", text: "(12 + w)5" }
          ],
          correct: "B"
        },
        {
          id: "evaluate",
          sol: "A.EO.1.b",
          stem: "If k = 45 and m = 12.50, how much does the team pay for kits and motors?",
          choices: [
            { letter: "A", text: "$235" },
            { letter: "B", text: "$260" },
            { letter: "C", text: "$210" },
            { letter: "D", text: "$135" }
          ],
          correct: "C"
        }
      ]
    }
  ];

  for (var i = 0; i < PACKS.length; i++) P.push(PACKS[i]);
})(typeof window !== "undefined" ? window : global);
