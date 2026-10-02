# SOL Lab — Algebra I question bank (teacher review copy)

Every problem-set pack and question in the game, grouped by strand and difficulty level, with the answer key and the 2023 Virginia Algebra I SOL code each item is tagged with. Generated from `js/content*.js` by `node tools/question-bank.js`; edit the pack files, not this page.

**Totals:** 51 packs · 278 questions · level 1: 70 · level 2: 142 · level 3: 66

## How the game chooses questions for a student

- Every pack carries a **level** tag: 1 (one step: evaluate, read a table, identify a slope), 2 (a typical SOL item: solve a multistep equation, write a model, interpret a parameter), 3 (multi-step reasoning: a system in context, a quadratic model, a judgment about a prediction).
- Each student's Chromebook keeps an **ability** score per unit that starts at 1.6 (between levels 1 and 2). A question answered with no wrong letter grabbed nudges it up by 0.12; grabbing a wrong letter drops it by 0.18. The picker weights every candidate by how close its level is to the ability score, so an **average high-school student** (ability settling around 2) draws mostly level 2 packs, with level 1 and 3 packs mixed in at lower weight.
- On All-skills levels the picker also leans toward the standards the student has missed most, and it prefers problem sets near the level's target length (short notes early, longer notes later).
- The HUD shows the current tag as `SOL · A.EI.2.b · Level 2`.

**The list under "Level 2" in each unit is therefore the core of what an average student sees; level 1 is the floor for a struggling student and level 3 the stretch for a strong one.**

## Contents

- Expressions & Operations (A.EO): 13 packs, 71 questions
- Equations & Inequalities (A.EI): 13 packs, 71 questions
- Functions (A.F): 14 packs, 77 questions
- Statistics (A.ST): 11 packs, 59 questions


---

# Expressions & Operations (A.EO)

Standards in this unit:



## Level 1 — foundation

### Drama Club Ticket Table  
`eo-play-tickets` · Expressions & Operations · A.EO.1 · level 1 · 54 words · 5 questions

> (1) The drama club sells adult tickets for $8 and student tickets for $5. (2) Printing the programs costs the club $40 no matter how many tickets sell. (3) Let **t** be the number of adult tickets and **s** the number of student tickets sold. (4) The treasurer wrote the club's **profit** as 8t + 5s − 40.

1. **[A.EO.1.a]** Which expression represents the total money collected from ticket sales?
   - A. 8 + 5 + t + s
   - B. 8t + 5s
   - C. 13(t + s)
   - D. 8s + 5t
   - **Key: B**

2. **[A.EO.1.b]** What is the profit when t = 12 and s = 30?
   - A. $206
   - B. $246
   - C. $166
   - D. $286
   - **Key: A**

3. **[A.EO.1.a]** Which expression represents "three less than twice the number of student tickets"?
   - A. 3 − 2s
   - B. 2(s − 3)
   - C. 2s − 3
   - D. 3s − 2
   - **Key: C**

4. **[A.EO.1.b]** The treasurer compares the two ticket types using |s − 2t|. What is its value when t = 12 and s = 20?
   - A. −4
   - B. 44
   - C. 8
   - D. 4
   - **Key: D**

5. **[A.EO.1.a]** "The quotient of the number of student tickets and 4" is written as —
   - A. s − 4
   - B. s ÷ 4
   - C. 4s
   - D. 4 ÷ s
   - **Key: B**

### The Raised Garden Bed  
`eo-garden-bed` · Expressions & Operations · A.EO.2 · level 1 · 50 words · 5 questions

> (1) A raised garden bed is a rectangle. (2) Its length is (x + 5) feet and its width is (x + 2) feet. (3) Mr. Okafor asks his class to write the **area** and the **perimeter** of the bed as polynomials in x, then to check their work with x = 3.

1. **[A.EO.2.b]** Which polynomial represents the area of the bed?
   - A. x² + 10
   - B. x² + 7x + 10
   - C. 2x + 7
   - D. x² + 10x + 7
   - **Key: B**

2. **[A.EO.2.a]** Which polynomial represents the perimeter of the bed?
   - A. 2x + 7
   - B. x² + 7x + 10
   - C. 4x + 7
   - D. 4x + 14
   - **Key: D**

3. **[A.EO.1.b]** When x = 3, what is the area of the bed in square feet?
   - A. 40
   - B. 26
   - C. 24
   - D. 19
   - **Key: A**

4. **[A.EO.2.c]** A student is given only the area polynomial x² + 7x + 10. Which factored form gives the length and width?
   - A. (x + 10)(x + 1)
   - B. (x + 7)(x + 10)
   - C. (x + 5)(x + 2)
   - D. (x − 5)(x − 2)
   - **Key: C**

5. **[A.EO.2.e]** Which expression is equivalent to (x + 5)(x + 2) for every value of x?
   - A. x(x + 7) + 10
   - B. x² + 7 + 10
   - C. (x + 7)² + 10
   - D. x² + 10x + 7
   - **Key: A**

### Powers of Two Pattern  
`eo-powers-of-two` · Expressions & Operations · A.EO.3 · level 1 · 53 words · 5 questions

> (1) Jada made a table of powers of 2 to look for patterns before her quiz on the **laws of exponents**. (2) She noticed that multiplying two rows adds their exponents.
> 
> | Power | Value |
> |---|---|
> | 21 | 2 |
> | 22 | 4 |
> | 23 | 8 |
> | 24 | 16 |
> | 25 | 32 |
> | 26 | 64 |
> | 27 | 128 |

1. **[A.EO.3.a]** Using the table, 8 × 16 = 128. Which exponent rule does this show?
   - A. 2³ × 2⁴ = 2¹² because exponents multiply
   - B. 2³ × 2⁴ = 2⁷ because exponents add
   - C. 2³ × 2⁴ = 4⁷ because bases add
   - D. 2³ × 2⁴ = 2¹ because exponents subtract
   - **Key: B**

2. **[A.EO.3.a]** Which expression is equivalent to 2⁷ ÷ 2⁵?
   - A. 2¹²
   - B. 1²
   - C. 2²
   - D. 2³⁵
   - **Key: C**

3. **[A.EO.3.a]** Jada squares the value of 2³: 8 × 8 = 64. Which single power of 2 equals (2³)²?
   - A. 2⁵
   - B. 2⁹
   - C. 4⁶
   - D. 2⁶
   - **Key: D**

4. **[A.EO.3.b]** Extending the pattern downward, each row is half the row below it. What is the value of 2⁻²?
   - A. 1/4
   - B. −4
   - C. −1/4
   - D. 0
   - **Key: A**

5. **[A.EO.3.b]** Which expression is equivalent to (3x²y)(4x³y²)?
   - A. 7x⁵y³
   - B. 12x⁶y²
   - C. 12x⁵y³
   - D. 7x⁶y²
   - **Key: C**

### Measuring a Phone Screen  
`eo-phone-screen` · Expressions & Operations · A.EO.1 · level 1 · 75 words · 5 questions

> (1) A phone screen is a rectangle a inches wide and b inches tall. (2) Its diagonal, the size printed on the box, is √(a² + b²). (3) Marcus also uses the expression 2(a + b) − c ÷ 4 to compare two phones, where c is the thickness in millimeters. (4) For his phone, a = 3, b = 4 and c = 6. (5) A second phone has a = 1.5, b = 2.5 and c = 6.

1. **[A.EO.1.b]** What is the diagonal of Marcus's phone, in inches?
   - A. 7
   - B. √7
   - C. 12
   - D. 5
   - **Key: D**

2. **[A.EO.1.b]** What is the value of 2(a + b) − c ÷ 4 for the second phone?
   - A. 6.5
   - B. 1.5
   - C. 0.5
   - D. 8
   - **Key: A**

3. **[A.EO.1.b]** What is the value of |−3.5 + 1| + 2?
   - A. −0.5
   - B. 4.5
   - C. 0.5
   - D. 6.5
   - **Key: B**

4. **[A.EO.1.a]** "The width increased by half the height" is written as —
   - A. a + 2b
   - B. (a + b) ÷ 2
   - C. a + b ÷ 2
   - D. 2a + b
   - **Key: C**

5. **[A.EO.1.b]** The expression ∛(8a) is evaluated for a = 1.5. Hint: 8 × 1.5 = 12 is not a perfect cube, but ∛(8a) = 2∛a. Which value is exact?
   - A. 2∛1.5
   - B. 4
   - C. ∛12 ÷ 2
   - D. 3
   - **Key: A**


## Level 2 — average student (core)

### Tiles for the Science Lab  
`eo-square-tiles` · Expressions & Operations · A.EO.4 · level 2 · 57 words · 5 questions

> (1) New square floor tiles for the science lab each have an area of 50 square inches. (2) Priya says the side length is √50 inches and that the school wants the answer in **simplest radical form**. (3) A cube-shaped storage bin in the same room has a volume of 54 cubic feet, so its edge is ∛54 feet.

1. **[A.EO.4.a]** What is √50 in simplest radical form?
   - A. 25√2
   - B. 5√2
   - C. 2√5
   - D. 10√5
   - **Key: B**

2. **[A.EO.4.b]** What is ∛54 in simplest form?
   - A. 3∛2
   - B. 2∛3
   - C. 9∛6
   - D. 18∛3
   - **Key: A**

3. **[A.EO.4.c]** Two tiles are laid side by side. Which expression equals 3√2 + 5√2?
   - A. 8√4
   - B. 15√2
   - C. 8√2
   - D. 15√4
   - **Key: C**

4. **[A.EO.4.c]** What is the product √8 · √2?
   - A. √10
   - B. 16
   - C. 2√2
   - D. 4
   - **Key: D**

5. **[A.EO.4.d]** Priya writes the side of a 25-square-inch tile as 25^(1/2). Which value is equivalent?
   - A. 12.5
   - B. 5
   - C. √12.5
   - D. 625
   - **Key: B**

### Factoring Practice Sheet  
`eo-factoring-fence` · Expressions & Operations · A.EO.2 · level 2 · 64 words · 6 questions

> (1) Mrs. Lee's practice sheet asks students to **factor completely**: take out the greatest common factor first, then look for a difference of squares or a trinomial pattern. (2) She warns that an answer is not complete if one of the factors can still be factored.
> 
> - 2x² + 8x
> - x² − 9
> - 3x² + 10x + 8
> - x² − 5x − 14
> - 4x² − 36

1. **[A.EO.2.c]** What is the completely factored form of 2x² + 8x?
   - A. 2(x² + 4x)
   - B. x(2x + 8)
   - C. 2x(x + 4)
   - D. 2x(x + 8)
   - **Key: C**

2. **[A.EO.2.c]** What is the completely factored form of x² − 9?
   - A. (x − 3)(x + 3)
   - B. (x − 3)²
   - C. (x − 9)(x + 1)
   - D. x(x − 9)
   - **Key: A**

3. **[A.EO.2.c]** What is the completely factored form of 3x² + 10x + 8?
   - A. (3x + 2)(x + 4)
   - B. (3x + 4)(x + 2)
   - C. (3x + 8)(x + 1)
   - D. 3(x + 2)(x + 4)
   - **Key: B**

4. **[A.EO.2.c]** What is the completely factored form of x² − 5x − 14?
   - A. (x + 7)(x − 2)
   - B. (x − 7)(x − 2)
   - C. (x + 7)(x + 2)
   - D. (x − 7)(x + 2)
   - **Key: D**

5. **[A.EO.2.e]** A student wrote 4x² − 36 = (2x − 6)(2x + 6), which is correct but not complete. Which expression is the completely factored form and is equal to 4x² − 36 for every x?
   - A. (2x − 6)(2x − 6)
   - B. 4(x − 3)(x + 3)
   - C. (4x − 6)(x + 6)
   - D. 4(x − 6)(x + 6)
   - **Key: B**

6. **[A.EO.2.b]** To check item 3, a student multiplies (3x + 4)(x + 2). Which product does she get?
   - A. 3x² + 10x + 8
   - B. 3x² + 6x + 8
   - C. 4x² + 10x + 6
   - D. 3x² + 8
   - **Key: A**

### Sharing a Polynomial Evenly  
`eo-polynomial-division` · Expressions & Operations · A.EO.2 · level 2 · 80 words · 5 questions

> (1) Tonight's homework covers **sums**, **differences** and **quotients** of polynomials. (2) Dividing by a monomial means dividing every term; dividing by a binomial can be done by factoring the numerator when the divisor is one of its factors.
> 
> - (4x² − 3x + 7) − (x² + 5x − 2)
> - (x³ + 2x²) + (3x² − x)
> - (6x³ + 9x² − 3x) ÷ 3x
> - (x² + 7x + 12) ÷ (x + 3)
> - (2x² − x − 6) ÷ (x − 2)

1. **[A.EO.2.a]** What is the difference (4x² − 3x + 7) − (x² + 5x − 2)?
   - A. 3x² + 2x + 5
   - B. 3x² − 8x + 9
   - C. 3x² − 8x + 5
   - D. 5x² + 2x + 9
   - **Key: B**

2. **[A.EO.2.a]** What is the sum (x³ + 2x²) + (3x² − x)?
   - A. x³ + 5x² − x
   - B. 4x⁵ − x
   - C. x³ + 6x² − x
   - D. x³ + 5x² + x
   - **Key: A**

3. **[A.EO.2.d]** What is the quotient (6x³ + 9x² − 3x) ÷ 3x?
   - A. 2x² + 3x
   - B. 2x³ + 3x² − 1
   - C. 2x² + 9x² − 3x
   - D. 2x² + 3x − 1
   - **Key: D**

4. **[A.EO.2.d]** What is the quotient (x² + 7x + 12) ÷ (x + 3)?
   - A. x + 3
   - B. x + 12
   - C. x + 4
   - D. x − 4
   - **Key: C**

5. **[A.EO.2.d]** What is the quotient (2x² − x − 6) ÷ (x − 2)?
   - A. 2x − 3
   - B. 2x + 3
   - C. x + 3
   - D. 2x + 6
   - **Key: B**

### The Exponent Spreadsheet  
`eo-exponent-spreadsheet` · Expressions & Operations · A.EO.3 · level 2 · 76 words · 6 questions

> (1) Devin built a spreadsheet that checks exponent work by plugging in numbers. (2) Column A holds an expression, column B his simplified answer, and column C shows whether both give the same value when x = 2 and y = 3. (3) Three of his answers came back as **mismatch**.
> 
> | Expression | Devin's answer | Check |
> |---|---|---|
> | (x⁴)³ ÷ x⁵ | x⁷ | match |
> | (2y²)³ | 2y⁶ | mismatch |
> | 5⁰ · 5² | 0 | mismatch |
> | 4x³y⁻² ÷ (2xy³) | 2x²y | mismatch |
> | (x⁻³y²)⁻¹ | x³ ÷ y² | match |

1. **[A.EO.3.b]** Devin's answer x⁷ for (x⁴)³ ÷ x⁵ matched. Which steps justify it?
   - A. (x⁴)³ = x⁷ because exponents add, then x⁷ ÷ x⁵ = x⁷ ÷ 1
   - B. (x⁴)³ = x¹² because exponents multiply, then x¹² ÷ x⁵ = x⁷ because exponents subtract
   - C. (x⁴)³ = x⁶⁴ because 4³ = 64, then 64 − 5 = 59
   - D. (x⁴)³ = x¹² because exponents multiply, then x¹² ÷ x⁵ = x⁷ because exponents divide
   - **Key: B**

2. **[A.EO.3.b]** What is the correct simplified form of (2y²)³?
   - A. 6y⁶
   - B. 2y⁵
   - C. 8y⁶
   - D. 8y⁵
   - **Key: C**

3. **[A.EO.3.a]** Why is 5⁰ · 5² not equal to 0?
   - A. Any nonzero base to the zero power is 1, so the product is 1 · 25 = 25.
   - B. 5⁰ equals 5, so the product is 125.
   - C. The zero exponent cancels the 2, leaving 5.
   - D. The product of the exponents is 0, so the answer is 5⁰ = 0.
   - **Key: A**

4. **[A.EO.3.b]** What is the correct simplified form of 4x³y⁻² ÷ (2xy³), with positive exponents?
   - A. 2x²y
   - B. 2x² ÷ y⁵
   - C. 2x³ ÷ y⁵
   - D. 2x²y⁵
   - **Key: B**

5. **[A.EO.3.b]** Which explanation shows why (x⁻³y²)⁻¹ = x³ ÷ y² is correct?
   - A. The outer −1 makes every exponent negative: x⁻³ becomes x³ and y² becomes y⁻².
   - B. Adding −1 to each exponent gives x⁻⁴y¹, which simplifies to x³ ÷ y².
   - C. A negative exponent means the answer is negative, so x³ ÷ y² is the opposite of x⁻³y².
   - D. Multiplying each exponent by −1 gives x³y⁻², and y⁻² is the same as 1 ÷ y².
   - **Key: D**

6. **[A.EO.1.b]** Column C uses x = 2 and y = 3. What value does the correct answer to (2y²)³ give?
   - A. 5832
   - B. 1458
   - C. 486
   - D. 216
   - **Key: A**

### Area Model Warm-Up  
`eo-area-model` · Expressions & Operations · A.EO.2 · level 2 · 58 words · 5 questions

> (1) The warm-up shows an **area model** for the product (2x + 3)(x + 4): a rectangle split into four parts labeled 2x², 8x, 3x and 12. (2) Below it are four more expressions to expand or factor.
> 
> |  | x | 4 |
> |---|---|---|
> | 2x | 2x² | 8x |
> | 3 | 3x | 12 |
> 
> - (x − 5)²
> - (3x − 2)(3x + 2)
> - 4x² − 25
> - 12x³ − 18x²

1. **[A.EO.2.b]** According to the area model, (2x + 3)(x + 4) equals —
   - A. 2x² + 11x + 12
   - B. 2x² + 24x
   - C. 3x² + 11x + 12
   - D. 2x² + 12
   - **Key: A**

2. **[A.EO.2.b]** What is (x − 5)² written as a polynomial?
   - A. x² − 25
   - B. x² + 25
   - C. x² − 10x + 25
   - D. x² − 10x − 25
   - **Key: C**

3. **[A.EO.2.b]** What is the product (3x − 2)(3x + 2)?
   - A. 9x² + 12x − 4
   - B. 9x² − 4
   - C. 6x² − 4
   - D. 9x² + 4
   - **Key: B**

4. **[A.EO.2.c]** What is the completely factored form of 4x² − 25?
   - A. (4x − 5)(x + 5)
   - B. (2x − 5)²
   - C. 4(x² − 25)
   - D. (2x − 5)(2x + 5)
   - **Key: D**

5. **[A.EO.2.c]** What is the completely factored form of 12x³ − 18x²?
   - A. 6x(2x² − 3x)
   - B. 6x²(2x − 3)
   - C. 2x²(6x − 9)
   - D. 6x²(2x − 18)
   - **Key: B**

### Robotics Team Budget Sheet  
`eo-robotics-budget` · Expressions & Operations · A.EO · level 2 · 105 words · 6 questions

> (1) The robotics team tracks its money on one sheet. (2) Each kit costs $k and each motor costs $m; the team buys 3 kits and 8 motors and gets a $25 discount. (3) The arena is a square with an area of 128 square feet, so its side is √128 feet. (4) A sensor's signal strength is modeled by 2⁴ · 2⁻⁶ of the maximum. (5) The coach writes the volume of a cube-shaped battery case as 27 cubic inches and asks for its edge length. (6) Finally, the fundraising total is written as "the product of 12 and the sum of the number of car washes w and 5."

1. **[A.EO.1.a]** Which expression represents the amount the team pays for kits and motors?
   - A. 3k + 8m − 25
   - B. 11(k + m) − 25
   - C. 3k + 8m + 25
   - D. 25 − 3k − 8m
   - **Key: A**

2. **[A.EO.4.a]** What is √128 in simplest radical form?
   - A. 64√2
   - B. 4√8
   - C. 8√2
   - D. 2√32
   - **Key: C**

3. **[A.EO.3.a]** The signal strength 2⁴ · 2⁻⁶ equals what fraction of the maximum?
   - A. 1/2
   - B. 1/4
   - C. 4
   - D. −4
   - **Key: B**

4. **[A.EO.4.d]** Which expression gives the edge length of the battery case, in inches?
   - A. 27^(1/2) = 9
   - B. 27 ÷ 3 = 9
   - C. 27^(1/3) = 3
   - D. √27 = 3√3
   - **Key: C**

5. **[A.EO.1.a]** Which expression represents the fundraising total in sentence 6?
   - A. 12w + 5
   - B. 12(w + 5)
   - C. 12 + 5w
   - D. (12 + w)5
   - **Key: B**

6. **[A.EO.1.b]** If k = 45 and m = 12.50, how much does the team pay for kits and motors?
   - A. $235
   - B. $260
   - C. $210
   - D. $135
   - **Key: C**


## Level 3 — stretch

### Designing a Shipping Box  
`eo-shipping-box` · Expressions & Operations · A.EO.2 · level 3 · 84 words · 6 questions

> (1) A packaging class designs a box whose height is x inches, width is (x + 3) inches and length is (2x − 1) inches. (2) The **volume** is the product of the three dimensions. (3) The area of the front face is width × height. (4) Nia expanded the volume by first multiplying x(x + 3), then multiplying that result by (2x − 1). (5) Her partner Sam factored a different expression from the same worksheet, 2x² + 5x − 3, and got (2x − 1)(x + 3).

1. **[A.EO.2.b]** Which polynomial represents the area of the front face?
   - A. x² + 3
   - B. 2x + 3
   - C. x² + 3x
   - D. 3x²
   - **Key: C**

2. **[A.EO.2.b]** Which polynomial represents the volume of the box?
   - A. 2x³ + 5x² − 3x
   - B. 2x³ + 6x² − 3x
   - C. 2x³ − x² + 3x
   - D. 2x² + 5x − 3
   - **Key: A**

3. **[A.EO.1.b]** What is the volume of the box, in cubic inches, when x = 2?
   - A. 24
   - B. 30
   - C. 36
   - D. 15
   - **Key: B**

4. **[A.EO.2.c]** Is Sam's factoring of 2x² + 5x − 3 correct?
   - A. No; the correct factors are (2x + 1)(x − 3).
   - B. No; the correct factors are (2x + 3)(x − 1).
   - C. Yes; (2x − 1)(x + 3) = 2x² + 6x − x − 3 = 2x² + 5x − 3.
   - D. Yes; (2x − 1)(x + 3) = 2x² − 3 because the middle terms cancel.
   - **Key: C**

5. **[A.EO.2.e]** A lid for the box has area x² + 6x + 9 square inches. Which statement about the lid is true?
   - A. The lid is a square with side (x + 3), because x² + 6x + 9 = (x + 3)².
   - B. The lid is a square with side (x + 9), because x² + 6x + 9 = (x + 9)².
   - C. The lid is a rectangle with sides (x + 6) and (x + 1).
   - D. The lid is a rectangle with sides x and (x + 6) plus 9 extra square inches that cannot be factored.
   - **Key: A**

6. **[A.EO.2.b]** What is the product (x + 1)(2x² + x + 3)?
   - A. 2x³ + x² + 3x + 3
   - B. 2x³ + 3x² + 4x + 3
   - C. 2x³ + 2x² + 4x + 3
   - D. 2x² + 2x + 4
   - **Key: B**

### The Radical Relay  
`eo-radical-relay` · Expressions & Operations · A.EO.4 · level 3 · 81 words · 6 questions

> (1) In the radical relay, each team member simplifies one expression and passes the marker. (2) A judge marks each answer right or wrong; a wrong answer sends the marker back. (3) Team Blue's answers are shown below. (4) The judge reminds everyone that a radical is in **simplest form** when no perfect-square factor (or perfect-cube factor, for cube roots) remains under the root.
> 
> | Expression | Team Blue |
> |---|---|
> | √72 | 6√2 |
> | 2√12 − √27 | √3 |
> | √6 · √10 | √60 |
> | ∛(−125) | −5 |
> | 3∛16 | 3∛16 |
> | 8^(1/3) + 49^(1/2) | 9 |

1. **[A.EO.4.a]** Why is 6√2 the correct simplest form of √72?
   - A. 72 = 36 · 2 and √36 = 6, so √72 = 6√2.
   - B. 72 = 6 · 12 and √12 = 2, so √72 = 6√2.
   - C. 72 ÷ 2 = 36 and √36 = 6, so √72 = 6 ÷ √2.
   - D. √72 = √70 + √2 = 6√2.
   - **Key: A**

2. **[A.EO.4.c]** Which work shows that 2√12 − √27 = √3?
   - A. 2√12 − √27 = √24 − √27 = −√3, so the answer should be negative.
   - B. 2√12 = 4√3 and √27 = 3√3, so 4√3 − 3√3 = √3.
   - C. 2√12 = 2√3 and √27 = √3, so 2√3 − √3 = √3.
   - D. 2√12 − √27 = √(24 − 27), which cannot be simplified.
   - **Key: B**

3. **[A.EO.4.c]** The judge marked √60 wrong. What should Team Blue have written for √6 · √10?
   - A. √16
   - B. 4√15
   - C. 2√15
   - D. 60
   - **Key: C**

4. **[A.EO.4.b]** Why is ∛(−125) = −5 correct while √(−25) has no real value?
   - A. (−5)³ = −125, but no real number squared gives a negative result.
   - B. Cube roots are always negative, and square roots are always positive.
   - C. (−5)³ = 125, and the negative sign is moved outside the radical.
   - D. Both are correct; √(−25) = −5 as well.
   - **Key: A**

5. **[A.EO.4.b]** What is 3∛16 in simplest form?
   - A. 12∛4
   - B. 3∛16 is already in simplest form
   - C. 6∛4
   - D. 6∛2
   - **Key: D**

6. **[A.EO.4.d]** Team Blue wrote 9 for 8^(1/3) + 49^(1/2). Which explanation justifies the answer?
   - A. 8 ÷ 3 ≈ 2.7 and 49 ÷ 2 = 24.5; rounding both gives 9.
   - B. 8^(1/3) = ∛8 = 2 and 49^(1/2) = √49 = 7, and 2 + 7 = 9.
   - C. 8^(1/3) = 8 ÷ 3 and 49^(1/2) = 49 ÷ 2; the sum rounds to 9.
   - D. 8^(1/3) = 8 × 3 = 24 and 49^(1/2) = 49 × 2 = 98; the answer should be 122.
   - **Key: B**

### Two Ways to Save  
`eo-savings-plan` · Expressions & Operations · A.EO.1 · level 3 · 147 words · 6 questions

> (1) Amara is comparing two ways to grow $500 she earned over the summer. (2) A savings account pays 4% interest each year, so after t years it holds 500(1 + r)t dollars with r = 0.04. (3) Her uncle offers a different deal: he will give her 7 times the sum of a number n and 3, but then take back the square of n, where n is the number of chores she skips each month. (4) Amara also keeps a formula from class, √(b² − 4ac), to remind herself that the order of operations matters under a radical. (5) She evaluates everything by hand before trusting a calculator.
> 
> | Expression | Replacement values |
> |---|---|
> | 500(1 + r)t | r = 0.04, t = 2 |
> | 7(n + 3) − n² | n = −2 |
> | √(b² − 4ac) | a = 1, b = −5, c = 6 |
> | |2x − 9| + x | x = 2.5 |

1. **[A.EO.1.b]** How much is in the savings account after 2 years?
   - A. $540.00
   - B. $520.00
   - C. $540.80
   - D. $1,040.00
   - **Key: C**

2. **[A.EO.1.a]** Which expression represents the uncle's deal in sentence 3?
   - A. 7n + 3 − n²
   - B. 7(n + 3) − n²
   - C. 7(n + 3) − 2n
   - D. (7n + 3)²
   - **Key: B**

3. **[A.EO.1.b]** What is the value of 7(n + 3) − n² when n = −2?
   - A. 11
   - B. −1
   - C. 3
   - D. −11
   - **Key: C**

4. **[A.EO.1.b]** What is the value of √(b² − 4ac) when a = 1, b = −5 and c = 6?
   - A. 1
   - B. 7
   - C. √49
   - D. −1
   - **Key: A**

5. **[A.EO.1.b]** What is the value of |2x − 9| + x when x = 2.5?
   - A. −1.5
   - B. 1.5
   - C. 16.5
   - D. 6.5
   - **Key: D**

6. **[A.EO.4.a]** For a different equation, a = 1, b = 4 and c = −1. What is √(b² − 4ac) in simplest radical form?
   - A. 2√5
   - B. √12
   - C. 4√5
   - D. 2√3
   - **Key: A**


---

# Equations & Inequalities (A.EI)

Standards in this unit:



## Level 1 — foundation

### The Gym Pass  
`ei-gym-pass` · Equations & Inequalities · A.EI.1 · level 1 · 45 words · 5 questions

> (1) A community gym charges $25 for a monthly pass plus $4 for each visit. (2) Let **v** be the number of visits in a month and **C** the total cost. (3) Leo spent exactly $65 last month. (4) This month he wants to spend no more than $100.

1. **[A.EI.1.a]** Which equation can be used to find the number of visits Leo made last month?
   - A. 25v + 4 = 65
   - B. 4v − 25 = 65
   - C. 25 + 4v = 65
   - D. 29v = 65
   - **Key: C**

2. **[A.EI.1.b]** How many visits did Leo make last month?
   - A. 10
   - B. 16
   - C. 22
   - D. 40
   - **Key: A**

3. **[A.EI.1.c]** Which inequality represents this month's plan, and what is the greatest number of visits it allows?
   - A. 25 + 4v ≥ 100; at least 19 visits
   - B. 25 + 4v ≤ 100; at most 18 visits
   - C. 25 + 4v < 100; at most 25 visits
   - D. 4v ≤ 100; at most 25 visits
   - **Key: B**

4. **[A.EI.1.d]** Solve C = 25 + 4v for v.
   - A. v = C − 25 − 4
   - B. v = (C + 25) ÷ 4
   - C. v = 4C − 25
   - D. v = (C − 25) ÷ 4
   - **Key: D**

5. **[A.EI.1.f]** Which check confirms the solution to last month's equation?
   - A. 25 + 4(10) = 65, so 10 visits cost exactly $65.
   - B. 25(10) + 4 = 254, so 10 visits cost more than $65.
   - C. 65 − 25 = 40, so Leo visited 40 times.
   - D. 65 ÷ 4 = 16.25, so 16 visits is close enough.
   - **Key: A**

### Number Line Gallery  
`ei-number-line` · Equations & Inequalities · A.EI.1 · level 1 · 73 words · 5 questions

> (1) Each station in the gallery has an inequality and a number line. (2) An **open circle** means the endpoint is not included; a **closed circle** means it is. (3) Remember to reverse the inequality symbol when you multiply or divide both sides by a negative number.
> 
> - −3x + 7 > 22
> - 2(x − 4) ≥ 10
> - 5 − x ≤ 2
> - 3(x + 2) = 3x + 6
> - 4x + 1 = 4x − 5

1. **[A.EI.1.c]** What is the solution set of −3x + 7 > 22?
   - A. x > −5
   - B. x < −5
   - C. x < 5
   - D. x > 5
   - **Key: B**

2. **[A.EI.1.c]** Which number line shows the solution of 2(x − 4) ≥ 10?
   - A. open circle at 9, shaded to the right
   - B. closed circle at 7, shaded to the left
   - C. closed circle at 9, shaded to the right
   - D. closed circle at 9, shaded to the left
   - **Key: C**

3. **[A.EI.1.c]** What is the solution set of 5 − x ≤ 2?
   - A. x ≥ 3
   - B. x ≤ 3
   - C. x ≤ −3
   - D. x ≥ 7
   - **Key: A**

4. **[A.EI.1.e]** How many solutions does 3(x + 2) = 3x + 6 have?
   - A. none
   - B. exactly one, x = 0
   - C. exactly one, x = 2
   - D. infinitely many
   - **Key: D**

5. **[A.EI.1.e]** Why does 4x + 1 = 4x − 5 have no solution?
   - A. Subtracting 4x from both sides leaves 1 = −5, which is never true.
   - B. Both sides have 4x, so every value of x works.
   - C. The solution is x = −6, but negative solutions are not allowed.
   - D. Dividing by 4 gives x = −1.5, which is not a whole number.
   - **Key: A**

### Formula Flash Cards  
`ei-formula-cards` · Equations & Inequalities · A.EI.1 · level 1 · 67 words · 5 questions

> (1) Geometry and science formulas are **literal equations**: equations with more than one variable. (2) Solving one for a different variable uses the same properties of equality as any other equation. (3) Each flash card names the variable to isolate.
> 
> | Formula | Solve for |
> |---|---|
> | P = 2l + 2w | w |
> | A = ½bh | h |
> | d = rt | t |
> | y = mx + b | x |
> | F = 1.8C + 32 | C |

1. **[A.EI.1.d]** Which equation is P = 2l + 2w solved for w?
   - A. w = P − 2l − 2
   - B. w = (P − 2l) ÷ 2
   - C. w = P ÷ 2 − l ÷ 2
   - D. w = 2P − l
   - **Key: B**

2. **[A.EI.1.d]** Which equation is A = ½bh solved for h?
   - A. h = 2A ÷ b
   - B. h = A ÷ 2b
   - C. h = 2Ab
   - D. h = A − ½b
   - **Key: A**

3. **[A.EI.1.d]** Which equation is d = rt solved for t?
   - A. t = dr
   - B. t = r ÷ d
   - C. t = d − r
   - D. t = d ÷ r
   - **Key: D**

4. **[A.EI.1.d]** Which equation is y = mx + b solved for x?
   - A. x = y − b − m
   - B. x = (y + b) ÷ m
   - C. x = (y − b) ÷ m
   - D. x = my − b
   - **Key: C**

5. **[A.EI.1.d]** Which equation is F = 1.8C + 32 solved for C?
   - A. C = (F − 32) ÷ 1.8
   - B. C = F ÷ 1.8 − 32
   - C. C = 1.8(F − 32)
   - D. C = (F + 32) ÷ 1.8
   - **Key: A**


## Level 2 — average student (core)

### Two Phone Plans  
`ei-two-phone-plans` · Equations & Inequalities · A.EI.2 · level 2 · 50 words · 5 questions

> (1) Plan A costs $20 a month plus $0.10 per minute of calls. (2) Plan B costs $5 a month plus $0.25 per minute. (3) Let **m** be the minutes used in a month and **C** the monthly cost. (4) Rosa graphs both plans on the same axes to see where the lines cross.

1. **[A.EI.2.a]** Which system of equations represents the two plans?
   - A. C = 20m + 0.10 and C = 5m + 0.25
   - B. C = 20 + 0.10m and C = 5 + 0.25m
   - C. C = 0.10 + 20m and C = 0.25 + 5m
   - D. m = 20 + 0.10C and m = 5 + 0.25C
   - **Key: B**

2. **[A.EI.2.b]** At how many minutes do the two plans cost the same?
   - A. 60
   - B. 75
   - C. 100
   - D. 150
   - **Key: C**

3. **[A.EI.2.h]** What does the point where the two lines cross represent?
   - A. the number of minutes where Plan A becomes free
   - B. the month in which Rosa should switch plans
   - C. the greatest number of minutes either plan allows
   - D. the number of minutes at which both plans cost the same amount, $30
   - **Key: D**

4. **[A.EI.2.c]** Without solving, how can Rosa tell that the system has exactly one solution?
   - A. The lines have different slopes, 0.10 and 0.25, so they cross exactly once.
   - B. The lines have different y-intercepts, so they never cross.
   - C. Both equations use the variable C, so they are the same line.
   - D. Both plans have positive slopes, so they must be parallel.
   - **Key: A**

5. **[A.EI.1.c]** For which numbers of minutes is Plan A cheaper than Plan B?
   - A. fewer than 100 minutes
   - B. more than 100 minutes
   - C. fewer than 30 minutes
   - D. Plan A is never cheaper
   - **Key: B**

### The Rooftop Ball Toss  
`ei-ball-toss` · Equations & Inequalities · A.EI.3 · level 2 · 73 words · 5 questions

> (1) A ball is tossed upward from a roof 48 feet high. (2) Its height in feet after t seconds is h = −16t² + 32t + 48. (3) Kai wants to know when the ball hits the ground, so he sets h = 0 and factors: −16t² + 32t + 48 = −16(t² − 2t − 3) = −16(t − 3)(t + 1). (4) Then he checks a few other quadratic equations from the same worksheet.

1. **[A.EI.3.a]** According to Kai's factoring, when does the ball hit the ground?
   - A. after 1 second
   - B. after 3 seconds
   - C. after 4 seconds
   - D. after 48 seconds
   - **Key: B**

2. **[A.EI.3.c]** The factored equation also gives t = −1. Why is this solution not used?
   - A. It is a mistake; −16(t + 1) should be −16(t − 1).
   - B. Negative solutions are never correct for a quadratic equation.
   - C. The ball was tossed at t = 0, so a negative time is outside the situation.
   - D. The ball is at 48 feet when t = −1, not on the ground.
   - **Key: C**

3. **[A.EI.3.b]** How many real solutions does x² + 4x + 5 = 0 have?
   - A. none, because b² − 4ac = 16 − 20 is negative
   - B. one, because b² − 4ac = 0
   - C. two, because b² − 4ac = 36
   - D. two, because every quadratic has two solutions
   - **Key: A**

4. **[A.EI.3.b]** Which quadratic equation has exactly one real solution?
   - A. x² − 9 = 0
   - B. x² − 5x = 0
   - C. x² + 1 = 0
   - D. x² − 6x + 9 = 0
   - **Key: D**

5. **[A.EI.3.a]** What are the solutions of x² = 49?
   - A. x = 7 only
   - B. x = 7 or x = −7
   - C. x = 24.5
   - D. x = √7 or x = −√7
   - **Key: B**

### Multistep Equation Set  
`ei-multistep-set` · Equations & Inequalities · A.EI.1 · level 2 · 65 words · 5 questions

> (1) Ms. Grant's equation set mixes fractions, decimals and parentheses. (2) She asks students to name the **property of equality** they use at each step and to check every answer by substitution.
> 
> - 3(2x − 5) + 4 = 2x + 9
> - x ÷ 4 − 3 = 7
> - 0.5(x + 8) = 12
> - −4(x − 1) = 3x + 18
> - 5x − 3 = 2x + 12

1. **[A.EI.1.b]** What is the solution of 3(2x − 5) + 4 = 2x + 9?
   - A. x = 5
   - B. x = 2.5
   - C. x = −5
   - D. x = 3
   - **Key: A**

2. **[A.EI.1.b]** What is the solution of x ÷ 4 − 3 = 7?
   - A. x = 1
   - B. x = 16
   - C. x = 40
   - D. x = 2.5
   - **Key: C**

3. **[A.EI.1.b]** What is the solution of 0.5(x + 8) = 12?
   - A. x = 8
   - B. x = 16
   - C. x = 20
   - D. x = 32
   - **Key: B**

4. **[A.EI.1.b]** What is the solution of −4(x − 1) = 3x + 18?
   - A. x = 2
   - B. x = 22
   - C. x = −22
   - D. x = −2
   - **Key: D**

5. **[A.EI.1.f]** To solve 5x − 3 = 2x + 12, a student first writes 3x − 3 = 12. Which property justifies this step?
   - A. the distributive property
   - B. the addition property of equality, adding 3 to both sides
   - C. the subtraction property of equality, subtracting 2x from both sides
   - D. the division property of equality, dividing both sides by 5
   - **Key: C**

### Selling Out the Spring Concert  
`ei-concert-tickets` · Equations & Inequalities · A.EI.2 · level 2 · 77 words · 6 questions

> (1) The spring concert sold 120 tickets and took in $750. (2) Adult tickets cost $8 and student tickets cost $5. (3) Let **x** be the number of adult tickets and **y** the number of student tickets. (4) Theo solves the system by substitution; Mia solves it by graphing and finds where the two lines meet. (5) Afterward, the teacher shows a different system, 2x + y = 6 and 4x + 2y = 12, and asks how many solutions it has.

1. **[A.EI.2.a]** Which system represents the concert ticket sales?
   - A. x + y = 120 and 8x + 5y = 750
   - B. x + y = 750 and 8x + 5y = 120
   - C. 8x + 5y = 120 and xy = 750
   - D. x + y = 120 and 5x + 8y = 750
   - **Key: A**

2. **[A.EI.2.b]** How many adult tickets and how many student tickets were sold?
   - A. 70 adult, 50 student
   - B. 60 adult, 60 student
   - C. 50 adult, 70 student
   - D. 40 adult, 80 student
   - **Key: C**

3. **[A.EI.2.b]** Theo replaces y with 120 − x in the money equation. Which equation does he get?
   - A. 8x + 5(120 − x) = 750
   - B. 8(120 − x) + 5x = 750
   - C. 8x + 5x = 750 − 120
   - D. x + (120 − x) = 750
   - **Key: A**

4. **[A.EI.2.h]** Which check verifies the solution in both equations?
   - A. 50 + 70 = 120 and 8(50) + 5(70) = 750
   - B. 50 + 70 = 120 and 8(70) + 5(50) = 810
   - C. 50 × 70 = 3500 and 8 + 5 = 13
   - D. 8(50) = 400 and 5(70) = 350, so 400 − 350 = 50
   - **Key: A**

5. **[A.EI.2.b]** On Mia's graph, what does the intersection of the two lines show?
   - A. the price of one adult ticket and one student ticket
   - B. the one pair (x, y) that satisfies both equations
   - C. the total number of tickets, 120
   - D. the total money collected, $750
   - **Key: B**

6. **[A.EI.2.c]** How many solutions does the system 2x + y = 6 and 4x + 2y = 12 have?
   - A. none, because the two lines are parallel
   - B. exactly one, at the point (3, 0)
   - C. exactly two, because there are two equations
   - D. infinitely many; the second equation is twice the first
   - **Key: D**

### Party Budget Inequalities  
`ei-party-budget` · Equations & Inequalities · A.EI.2 · level 2 · 64 words · 6 questions

> (1) The student council has $60 for a party. (2) Snack bags cost $3 each and pizzas cost $5 each. (3) Let **s** be the number of snack bags and **p** the number of pizzas. (4) The council also wants at least 8 items in total. (5) Elena graphs the budget inequality 3s + 5p ≤ 60 with s on the horizontal axis and p on the vertical axis.

1. **[A.EI.2.h]** Which order stays within the $60 budget?
   - A. 5 snack bags and 10 pizzas
   - B. 12 snack bags and 6 pizzas
   - C. 10 snack bags and 6 pizzas
   - D. 8 snack bags and 8 pizzas
   - **Key: C**

2. **[A.EI.2.e]** How should Elena draw the graph of 3s + 5p ≤ 60?
   - A. a dashed boundary line, shaded above the line
   - B. a solid boundary line, shaded below the line
   - C. a solid boundary line, shaded above the line
   - D. a dashed boundary line, shaded below the line
   - **Key: B**

3. **[A.EI.2.f]** Which system of inequalities represents both council requirements?
   - A. 3s + 5p ≤ 60 and s + p ≥ 8
   - B. 3s + 5p ≥ 60 and s + p ≤ 8
   - C. 3s + 5p ≤ 60 and s + p ≤ 8
   - D. s + p ≤ 60 and 3s + 5p ≥ 8
   - **Key: A**

4. **[A.EI.2.h]** Is (s, p) = (4, 4) a solution of the system?
   - A. No; 4 + 4 = 8 is not at least 8.
   - B. No; 3(4) + 5(4) = 32 is not under 60.
   - C. Yes; 3(4) + 5(4) = 32 ≤ 60 and 4 + 4 = 8 ≥ 8.
   - D. Yes, because any pair of equal numbers works.
   - **Key: C**

5. **[A.EI.2.e]** A second graph shows y > 2x − 1. Which description fits its graph?
   - A. a solid line through (0, −1) with slope 2, shaded above
   - B. a dashed line through (0, −1) with slope 2, shaded below
   - C. a solid line through (0, 2) with slope −1, shaded above
   - D. a dashed line through (0, −1) with slope 2, shaded above
   - **Key: D**

6. **[A.EI.2.g]** The solution set of the system in the graph is —
   - A. the region where the shadings of the two inequalities overlap
   - B. the single point where the two boundary lines cross
   - C. every point on either boundary line
   - D. the region shaded by either inequality
   - **Key: A**

### Mowing for a Bike  
`ei-lawn-money` · Equations & Inequalities · A.EI.1 · level 2 · 39 words · 5 questions

> (1) Dante earns $15 for every lawn he mows. (2) He already spent $45 on gas for the mower. (3) He wants at least $300 left over to buy a bike. (4) Let **n** be the number of lawns he mows this summer.

1. **[A.EI.1.a]** Which inequality represents Dante's goal?
   - A. 15n + 45 ≥ 300
   - B. 15n − 45 ≥ 300
   - C. 15n − 45 ≤ 300
   - D. 45n − 15 ≥ 300
   - **Key: B**

2. **[A.EI.1.c]** What is the least number of lawns Dante must mow?
   - A. 17
   - B. 20
   - C. 23
   - D. 24
   - **Key: C**

3. **[A.EI.1.c]** Which number line shows the solution set of 15n − 45 ≥ 300?
   - A. closed circle at 23, shaded to the right
   - B. open circle at 23, shaded to the right
   - C. closed circle at 23, shaded to the left
   - D. closed circle at 17, shaded to the right
   - **Key: A**

4. **[A.EI.1.f]** Which statement verifies the solution in context?
   - A. 15(22) − 45 = 285, so 22 lawns is enough.
   - B. 15(23) + 45 = 390, so 23 lawns leaves $390 for the bike.
   - C. 15(23) − 45 = 300, so 23 lawns leaves exactly $300 for the bike.
   - D. 300 ÷ 15 = 20, so 20 lawns is enough.
   - **Key: C**

5. **[A.EI.1.c]** What is the solution set of 7 − 2(x + 1) < 15?
   - A. x < −5
   - B. x > −5
   - C. x > 5
   - D. x < 5
   - **Key: B**

### Field Trip Bus Math  
`ei-field-trip-bus` · Equations & Inequalities · A.EI.1 · level 2 · 93 words · 6 questions

> (1) A field trip costs $240 for the bus plus $6 per student for museum tickets. (2) The school collects $10 from each student. (3) Let **n** be the number of students. (4) Ms. Ortiz asks: how many students make the trip break even, how many are needed to raise at least $100 extra for lunch, and what happens if the bus company raises its price to $396 while the museum drops tickets to $4? (5) She also writes the formula T = 240 + 6n for the trip cost and asks students to solve it for n.

1. **[A.EI.1.b]** How many students make the money collected equal to the trip cost?
   - A. 24
   - B. 40
   - C. 60
   - D. 15
   - **Key: C**

2. **[A.EI.1.a]** Which equation represents the break-even question?
   - A. 10n = 240 + 6n
   - B. 10n + 240 = 6n
   - C. 10 + 6n = 240
   - D. 240n = 10 + 6
   - **Key: A**

3. **[A.EI.1.c]** Which inequality and solution show how many students are needed to raise at least $100 extra?
   - A. 10n − (240 + 6n) ≤ 100; n ≤ 85
   - B. 10n − (240 + 6n) ≥ 100; n ≥ 85
   - C. 10n − 240 ≥ 100; n ≥ 34
   - D. 4n ≥ 100; n ≥ 25
   - **Key: B**

4. **[A.EI.1.d]** Which equation is T = 240 + 6n solved for n?
   - A. n = T − 240 − 6
   - B. n = (T + 240) ÷ 6
   - C. n = 6T − 240
   - D. n = (T − 240) ÷ 6
   - **Key: D**

5. **[A.EI.1.b]** With the new prices, the break-even equation is 10n = 396 + 4n. How many students are needed?
   - A. 40
   - B. 100
   - C. 66
   - D. 29
   - **Key: C**

6. **[A.EI.1.f]** In the break-even solution, the number 4 in 4n = 240 represents —
   - A. the number of buses the school must rent
   - B. the amount each student pays for the trip
   - C. what each student pays beyond that student's ticket
   - D. the cost of one museum ticket per student
   - **Key: C**


## Level 3 — stretch

### A Rectangle with Area 40  
`ei-rectangle-area` · Equations & Inequalities · A.EI.3 · level 3 · 75 words · 6 questions

> (1) A poster is 3 inches longer than it is wide, and its area is 40 square inches. (2) Let **w** be the width in inches. (3) Jun writes w(w + 3) = 40, rewrites it as w² + 3w − 40 = 0 and factors. (4) The same worksheet asks about 2x² − 8 = 0, x² + 2x − 7 = 0, 3x² − 2x + 1 = 0 and x² − 10x + 25 = 0.

1. **[A.EI.3.a]** What are the solutions of w² + 3w − 40 = 0?
   - A. w = 5 or w = −8
   - B. w = −5 or w = 8
   - C. w = 4 or w = 10
   - D. w = 3 or w = 40
   - **Key: A**

2. **[A.EI.3.c]** What are the dimensions of the poster?
   - A. 8 inches by 11 inches
   - B. 5 inches by 8 inches
   - C. 4 inches by 10 inches
   - D. −8 inches by −5 inches
   - **Key: B**

3. **[A.EI.3.a]** What are the solutions of 2x² − 8 = 0?
   - A. x = 4 only
   - B. x = 2 only
   - C. x = 2 or x = −2
   - D. x = 4 or x = −4
   - **Key: C**

4. **[A.EI.3.a]** Using the quadratic formula, what are the solutions of x² + 2x − 7 = 0?
   - A. x = 1 ± √7
   - B. x = −2 ± 2√2
   - C. x = −1 ± 2√2
   - D. x = −1 ± 4
   - **Key: C**

5. **[A.EI.3.b]** How many real solutions does 3x² − 2x + 1 = 0 have, and why?
   - A. two, because the equation has three terms
   - B. one, because the leading coefficient is 3
   - C. two, because b² − 4ac = 4 + 12 = 16
   - D. none, because b² − 4ac = 4 − 12 = −8 is negative
   - **Key: D**

6. **[A.EI.3.b]** Which statement about x² − 10x + 25 = 0 is true?
   - A. It has two real solutions, 5 and −5.
   - B. It has one real solution, 5, because it factors as (x − 5)².
   - C. It has no real solutions because 25 is positive.
   - D. It has one real solution, −5, because it factors as (x + 5)².
   - **Key: B**

### Mixing Two Acid Solutions  
`ei-acid-mixture` · Equations & Inequalities · A.EI.2 · level 3 · 110 words · 6 questions

> (1) A chemistry teacher needs 20 liters of a 25% acid solution. (2) The stockroom has a 10% solution and a 30% solution. (3) Let **x** be the liters of the 10% solution and **y** the liters of the 30% solution. (4) The total volume gives x + y = 20. (5) The amount of pure acid gives 0.10x + 0.30y = 0.25(20), which is 0.10x + 0.30y = 5. (6) Two students disagree: Ana says the answer is 5 liters of the 10% solution, and Ben says it is 15 liters of the 10% solution. (7) For homework, the class also studies the system y = 2x + 1 and y = 2x − 3.

1. **[A.EI.2.a]** Why does the second equation use 0.10x + 0.30y instead of x + y?
   - A. It counts only the pure acid, not the total liquid.
   - B. Decimals make the equation easier to graph.
   - C. It counts the water in each solution.
   - D. The percents must add up to 40%.
   - **Key: A**

2. **[A.EI.2.b]** How many liters of each solution should the teacher mix?
   - A. 15 liters of 10% and 5 liters of 30%
   - B. 10 liters of each
   - C. 5 liters of 10% and 15 liters of 30%
   - D. 2 liters of 10% and 18 liters of 30%
   - **Key: C**

3. **[A.EI.2.h]** Who is correct, Ana or Ben, and how can you tell?
   - A. Ben, because 15 + 5 = 20 liters.
   - B. Ana, because 0.10(5) + 0.30(15) = 5 liters of acid and 5 + 15 = 20.
   - C. Ben, because 0.10(15) + 0.30(5) = 3 liters of acid.
   - D. Both, because a system always has two solutions.
   - **Key: B**

4. **[A.EI.2.b]** To solve by elimination, a student multiplies x + y = 20 by −0.10 and adds it to the acid equation. Which equation results?
   - A. 0.40y = 7
   - B. 0.20x = 3
   - C. 0.20y = 3
   - D. 0.30y = 5
   - **Key: C**

5. **[A.EI.2.c]** How many solutions does the system y = 2x + 1 and y = 2x − 3 have?
   - A. none, because the lines have the same slope and different y-intercepts
   - B. exactly one, because the y-intercepts are different
   - C. infinitely many, because the slopes are equal
   - D. exactly one, at the point (2, 5) where they cross
   - **Key: A**

6. **[A.EI.2.h]** Suppose the teacher needed a 35% solution instead. What would happen to the system?
   - A. It would have infinitely many solutions, one for each mixture.
   - B. One amount would come out negative, since 35% is stronger than both stock solutions.
   - C. The solution would be exactly 10 liters of each solution.
   - D. Only the total-volume equation would change, not the acid one.
   - **Key: B**

### Model Rocket Height Table  
`ei-model-rocket` · Equations & Inequalities · A.EI.3 · level 3 · 91 words · 6 questions

> (1) A model rocket's height in meters after t seconds is h = −5t² + 40t. (2) The launch team records the height each second in the table. (3) They want to know when the rocket is at 60 meters, whether it ever reaches 100 meters, and when it lands. (4) Setting h = 60 gives −5t² + 40t = 60, and dividing by −5 gives t² − 8t + 12 = 0.
> 
> | t (s) | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
> |---|---|---|---|---|---|---|---|---|---|
> | h (m) | 0 | 35 | 60 | 75 | 80 | 75 | 60 | 35 | 0 |

1. **[A.EI.3.a]** Solving −5t² + 40t = 0 by factoring gives −5t(t − 8) = 0. When does the rocket land?
   - A. after 5 seconds
   - B. after 8 seconds
   - C. after 40 seconds
   - D. after 4 seconds
   - **Key: B**

2. **[A.EI.3.a]** What are the solutions of t² − 8t + 12 = 0?
   - A. t = 3 or t = 4
   - B. t = −2 or t = −6
   - C. t = 2 or t = 6
   - D. t = 4 only
   - **Key: C**

3. **[A.EI.3.c]** Why does the equation for h = 60 have two solutions, and how does the table confirm them?
   - A. The rocket passes 60 m going up and again coming down; the table shows h = 60 at t = 2 and t = 6.
   - B. Every quadratic has two solutions; the table shows h = 60 at t = 3 and t = 5.
   - C. One solution is an error; the table shows h = 60 only at t = 2.
   - D. The rocket is launched twice; the table shows h = 0 at t = 0 and t = 8.
   - **Key: A**

4. **[A.EI.3.b]** Does the rocket ever reach 100 meters? Setting h = 100 gives t² − 8t + 20 = 0.
   - A. Yes, at t = 10, because 100 ÷ 10 = 10.
   - B. Yes, at t = 4 and again at t = 5, on the way down.
   - C. No; b² − 4ac = 64 − 80 < 0, so there is no real solution.
   - D. No, because the table stops at t = 8.
   - **Key: C**

5. **[A.EI.3.b]** Setting h = 80 gives t² − 8t + 16 = 0. What does the number of solutions tell the launch team?
   - A. Two solutions: the rocket is at 80 m twice.
   - B. One solution, t = 4: the rocket reaches 80 m once, at its peak.
   - C. No solutions: the rocket never reaches 80 m.
   - D. One solution, t = 16: the rocket reaches 80 m after landing.
   - **Key: B**

6. **[A.EI.3.c]** Which substitution verifies that t = 6 is a solution of −5t² + 40t = 60?
   - A. −5(36) + 40(6) = −180 + 240 = 60
   - B. −5(12) + 40(6) = −60 + 240 = 180
   - C. −5(6) + 40(6) = 210
   - D. (−5 · 6)² + 40 = 940
   - **Key: A**


---

# Functions (A.F)

Standards in this unit:



## Level 1 — foundation

### The Airport Taxi  
`fn-taxi-fare` · Functions · A.F.1 · level 1 · 45 words · 5 questions

> (1) An airport taxi charges a flat $3 plus $2.50 per mile. (2) The fare for a trip of m miles is the function **f(m) = 2.5m + 3**. (3) Imani wants to know what a 6-mile trip costs and how far she can ride for $23.

1. **[A.F.1.a]** What does the slope 2.5 represent in this situation?
   - A. the flat fee charged before the trip starts
   - B. the cost per mile
   - C. the number of miles in the trip
   - D. the fare for a 1-mile trip
   - **Key: B**

2. **[A.F.1.a]** What does the y-intercept 3 represent?
   - A. the flat fee, the fare for a 0-mile trip
   - B. the cost of the third mile
   - C. the number of passengers allowed
   - D. the fare for a 3-mile trip
   - **Key: A**

3. **[A.F.1.g]** What is f(6)?
   - A. $15
   - B. $11.50
   - C. $18
   - D. $33
   - **Key: C**

4. **[A.F.1.g]** For what value of m does f(m) = 23?
   - A. m = 9.2
   - B. m = 10.4
   - C. m = 20
   - D. m = 8
   - **Key: D**

5. **[A.F.1.h]** A rival taxi's fare table shows $8 for 2 miles and $18 for 6 miles. How do the two taxis compare?
   - A. The rival charges more per mile, 2.5 versus 2.
   - B. The rival charges the same per mile but a higher flat fee.
   - C. The rival charges $2.50 per mile with a $3 flat fee, the same as Imani's taxi.
   - D. The rival charges less per mile, 2.5 versus 3.
   - **Key: C**

### Reading a Function Table  
`fn-table-line` · Functions · A.F.1 · level 1 · 39 words · 5 questions

> (1) Mr. Diaz shows a table and says it comes from a linear function. (2) The class must find the **slope**, the **y-intercept** and an equation, then extend the table.
> 
> | x | 0 | 2 | 4 | 6 |
> |---|---|---|---|---|
> | y | 5 | 9 | 13 | 17 |

1. **[A.F.1.a]** What is the slope of the function in the table?
   - A. 4
   - B. 2
   - C. 1/2
   - D. 5
   - **Key: B**

2. **[A.F.1.d]** Which equation represents the function?
   - A. y = 5x + 2
   - B. y = 4x + 5
   - C. y = 2x + 5
   - D. y = 2x − 5
   - **Key: C**

3. **[A.F.1.g]** What is the value of y when x = 10?
   - A. 25
   - B. 45
   - C. 21
   - D. 15
   - **Key: A**

4. **[A.F.1.a]** What is the zero (x-intercept) of the function?
   - A. x = 5
   - B. x = 2.5
   - C. x = 0
   - D. x = −2.5
   - **Key: D**

5. **[A.F.2.a]** Why does the table represent a function?
   - A. Every y-value in the table is odd.
   - B. Each x-value is paired with exactly one y-value.
   - C. The y-values increase as x increases.
   - D. The x-values are all even numbers.
   - **Key: B**

### Is It a Function?  
`fn-is-it-a-function` · Functions · A.F.2 · level 1 · 52 words · 5 questions

> (1) A **relation** is any set of ordered pairs; a **function** pairs each input with exactly one output. (2) The warm-up shows four relations. (3) Relation R: {(1, 3), (2, 5), (3, 3), (4, 7)}. (4) Relation S: {(2, 4), (2, 6), (3, 8)}. (5) Graph T is a circle. (6) Graph U is a parabola opening upward.

1. **[A.F.2.a]** Is relation R a function?
   - A. No, because the output 3 appears twice.
   - B. No, because the inputs are not all even.
   - C. Yes; each input has one output, even if outputs repeat.
   - D. Yes, because it has four ordered pairs.
   - **Key: C**

2. **[A.F.2.a]** Why is relation S not a function?
   - A. The input 2 has two different outputs, 4 and 6.
   - B. It has only three ordered pairs.
   - C. The outputs 4, 6 and 8 are all even.
   - D. The input 3 has only one output.
   - **Key: A**

3. **[A.F.2.a]** Which statement about graphs T and U is correct?
   - A. Both are functions because both are smooth curves.
   - B. T is not a function because a vertical line can cross it twice; U is a function.
   - C. U is not a function because a horizontal line can cross it twice; T is a function.
   - D. Neither is a function because neither is a straight line.
   - **Key: B**

4. **[A.F.1.a]** What is the domain of relation R?
   - A. {3, 5, 7}
   - B. {1, 2, 3, 4}
   - C. all real numbers
   - D. {1, 3, 5, 7}
   - **Key: B**

5. **[A.F.1.a]** What is the range of relation R?
   - A. {3, 5, 7}
   - B. {1, 2, 3, 4}
   - C. {3, 5, 3, 7}
   - D. all numbers from 3 to 7
   - **Key: A**

### Function Notation Drill  
`fn-function-notation` · Functions · A.F.1 · level 1 · 44 words · 5 questions

> (1) Two functions are on the board: **f(x) = −2x + 9** and **g(x) = x² + 1**. (2) The notation f(−3) means "the output of f when the input is −3." (3) A **zero** of a function is an input that makes the output 0.

1. **[A.F.1.g]** What is f(−3)?
   - A. 3
   - B. 15
   - C. −15
   - D. 6
   - **Key: B**

2. **[A.F.1.g]** For what value of x is f(x) = 1?
   - A. x = 4
   - B. x = −4
   - C. x = 5
   - D. x = 7
   - **Key: A**

3. **[A.F.2.g]** What is g(−2)?
   - A. −3
   - B. −5
   - C. 5
   - D. 3
   - **Key: C**

4. **[A.F.1.a]** What is the zero of f?
   - A. x = 9
   - B. x = −4.5
   - C. x = 4.5
   - D. x = −2
   - **Key: C**

5. **[A.F.2.b]** What is the range of g(x) = x² + 1?
   - A. all real numbers
   - B. y ≥ 0
   - C. y ≤ 1
   - D. y ≥ 1
   - **Key: D**


## Level 2 — average student (core)

### Lines Around y = 3x − 2  
`fn-parallel-perpendicular` · Functions · A.F.1 · level 2 · 61 words · 5 questions

> (1) Start with the line **y = 3x − 2**. (2) Parallel lines share a slope; perpendicular lines have slopes whose product is −1. (3) The worksheet asks for a parallel line through (1, 4), a perpendicular line through (3, 5), the line's standard form, its point-slope form through (2, 4), and the slope of a second line, 4x + 2y = 8.

1. **[A.F.1.e]** Which equation is the line parallel to y = 3x − 2 through (1, 4)?
   - A. y = 3x + 1
   - B. y = 3x + 4
   - C. y = −3x + 7
   - D. y = 3x − 2
   - **Key: A**

2. **[A.F.1.e]** Which equation is the line perpendicular to y = 3x − 2 through (3, 5)?
   - A. y = −3x + 14
   - B. y = (1/3)x + 4
   - C. y = −(1/3)x + 6
   - D. y = 3x − 4
   - **Key: C**

3. **[A.F.1.c]** Which equation is y = 3x − 2 written in standard form?
   - A. 3x + y = 2
   - B. 3x − y = 2
   - C. y − 3x = 2
   - D. 3x − y = −2
   - **Key: B**

4. **[A.F.1.c]** Which equation is the point-slope form of y = 3x − 2 using the point (2, 4)?
   - A. y + 4 = 3(x + 2)
   - B. y − 2 = 3(x − 4)
   - C. y − 4 = −2(x − 2)
   - D. y − 4 = 3(x − 2)
   - **Key: D**

5. **[A.F.1.a]** What is the slope of the line 4x + 2y = 8?
   - A. 4
   - B. −2
   - C. 2
   - D. −1/2
   - **Key: B**

### Features of a Parabola  
`fn-parabola-features` · Functions · A.F.2 · level 2 · 45 words · 6 questions

> (1) The function **f(x) = x² − 4x − 5** factors as (x − 5)(x + 1). (2) Its graph is a parabola that opens upward. (3) Nadia lists its zeros, vertex, axis of symmetry, y-intercept, range and the interval where it is decreasing, then evaluates f(3).

1. **[A.F.2.d]** What are the zeros of f?
   - A. x = −5 and x = 1
   - B. x = 5 and x = −1
   - C. x = 4 and x = −5
   - D. x = 0 and x = −5
   - **Key: B**

2. **[A.F.2.b]** What is the vertex of the parabola?
   - A. (2, −9)
   - B. (−2, 7)
   - C. (2, 9)
   - D. (0, −5)
   - **Key: A**

3. **[A.F.2.b]** What is the axis of symmetry?
   - A. y = 2
   - B. x = −9
   - C. x = 2
   - D. x = 0
   - **Key: C**

4. **[A.F.2.b]** What is the range of f?
   - A. y ≤ −9
   - B. all real numbers
   - C. y ≥ −5
   - D. y ≥ −9
   - **Key: D**

5. **[A.F.2.b]** On which interval is f decreasing?
   - A. x < 2
   - B. x > 2
   - C. −1 < x < 5
   - D. x < −9
   - **Key: A**

6. **[A.F.2.g]** What is f(3)?
   - A. −2
   - B. −8
   - C. 16
   - D. 4
   - **Key: B**

### Doubling Bacteria, Shrinking Value  
`fn-bacteria-doubling` · Functions · A.F.2 · level 2 · 57 words · 5 questions

> (1) A biology lab starts with 100 bacteria that double every hour, so the population after t hours is **P(t) = 100 · 2t**. (2) Meanwhile, a used laptop bought for $5,000 loses 20% of its value each year, so its value is **V(t) = 5000(0.8)t**. (3) Both are exponential functions, one growing and one decaying.

1. **[A.F.2.g]** What is P(3)?
   - A. 600
   - B. 800
   - C. 300
   - D. 106
   - **Key: B**

2. **[A.F.2.e]** Which feature of P(t) = 100 · 2^t shows that it is exponential growth?
   - A. The starting value, 100, is a positive number.
   - B. The exponent is the variable t.
   - C. The base, 2, is greater than 1: each hour doubles the count.
   - D. The population increases by 100 each hour.
   - **Key: C**

3. **[A.F.2.g]** What is the laptop's value after 2 years?
   - A. $3,200
   - B. $4,000
   - C. $3,000
   - D. $8,000
   - **Key: A**

4. **[A.F.2.e]** In V(t) = 5000(0.8)^t, what does 0.8 represent?
   - A. The laptop loses $0.80 each year.
   - B. The laptop keeps 80% of its value each year.
   - C. The laptop is worth 80 dollars after t years.
   - D. The laptop loses 80% of its value each year.
   - **Key: B**

5. **[A.F.2.h]** A table shows y-values 3, 6, 12, 24 for x = 0, 1, 2, 3. Which kind of function fits the table?
   - A. linear, because y increases each time
   - B. quadratic, because the differences are 3, 6, 12
   - C. exponential, because each y-value is 2 times the one before
   - D. linear, because x increases by 1 each time
   - **Key: C**

### A Line Through Two Points  
`fn-two-points` · Functions · A.F.1 · level 2 · 68 words · 6 questions

> (1) A linear function f passes through the points (2, 11) and (6, 23). (2) Owen finds its slope, writes its equation and locates its intercepts. (3) He compares f with a second function, **g(x) = 4x − 3**, and with a direct variation in which y = 12 when x = 4. (4) Finally he describes the **end behavior** of f: what happens to f(x) as x grows without bound.

1. **[A.F.1.d]** Which equation represents f?
   - A. f(x) = 3x + 5
   - B. f(x) = 3x + 11
   - C. f(x) = 4x + 3
   - D. f(x) = 2x + 7
   - **Key: A**

2. **[A.F.1.a]** What is the x-intercept of f?
   - A. x = 5
   - B. x = −5/3
   - C. x = −5
   - D. x = 5/3
   - **Key: B**

3. **[A.F.1.g]** For what value of x is f(x) = 41?
   - A. x = 128
   - B. x = 15
   - C. x = 12
   - D. x = 46/3
   - **Key: C**

4. **[A.F.1.h]** How do f and g compare?
   - A. g has the greater rate of change and the greater y-intercept.
   - B. f has the greater rate of change; g has the greater y-intercept.
   - C. g has the greater rate of change; f has the greater y-intercept.
   - D. f and g have the same rate of change.
   - **Key: C**

5. **[A.F.1.d]** In the direct variation where y = 12 when x = 4, what is the constant of variation and the equation?
   - A. k = 8; y = x + 8
   - B. k = 3; y = 3x
   - C. k = 48; y = 48 ÷ x
   - D. k = 1/3; y = x ÷ 3
   - **Key: B**

6. **[A.F.1.a]** Which statement describes the end behavior of f?
   - A. As x increases, f(x) approaches 5.
   - B. As x increases, f(x) decreases without bound.
   - C. As x increases, f(x) levels off at 41.
   - D. As x increases, f(x) increases without bound.
   - **Key: D**

### The Draining Tank  
`fn-draining-tank` · Functions · A.F.1 · level 2 · 61 words · 6 questions

> (1) A 500-gallon tank drains at a steady 20 gallons per minute, so the volume after t minutes is **V(t) = 500 − 20t**. (2) A second tank is measured every 5 minutes; its table is below. (3) Lin graphs both tanks on one grid to see which empties first.
> 
> | t (min) | 0 | 5 | 10 | 15 |
> |---|---|---|---|---|
> | Tank 2 (gal) | 420 | 345 | 270 | 195 |

1. **[A.F.1.a]** What is the zero of V, and what does it mean?
   - A. t = 25; the tank is empty after 25 minutes
   - B. t = 500; the tank starts with 500 gallons
   - C. t = 20; the tank loses 20 gallons each minute
   - D. t = 480; the tank holds 480 gallons after one minute
   - **Key: A**

2. **[A.F.1.a]** What is a reasonable domain for V(t) in this situation?
   - A. all real numbers
   - B. 0 ≤ t ≤ 500
   - C. 0 ≤ t ≤ 25
   - D. t ≥ 25
   - **Key: C**

3. **[A.F.1.a]** What does the slope −20 tell you about the graph of V?
   - A. The line rises 20 gallons every minute.
   - B. The line falls 20 gallons every minute.
   - C. The line crosses the vertical axis at −20.
   - D. The tank empties after 20 minutes.
   - **Key: B**

4. **[A.F.1.g]** What is V(12)?
   - A. 260 gallons
   - B. 240 gallons
   - C. 488 gallons
   - D. 280 gallons
   - **Key: A**

5. **[A.F.1.a]** What is the rate of change of Tank 2, from the table?
   - A. −75 gallons per minute
   - B. −15 gallons per minute
   - C. −20 gallons per minute
   - D. −5 gallons per minute
   - **Key: B**

6. **[A.F.1.h]** Which tank empties first?
   - A. Tank 2, because it starts with less water.
   - B. Both empty at the same time, 25 minutes.
   - C. Tank 1, at 25 minutes; Tank 2 takes 28 minutes.
   - D. Tank 2, at 21 minutes; Tank 1 takes 25 minutes.
   - **Key: C**

### One Line, Three Forms  
`fn-forms-of-a-line` · Functions · A.F.1 · level 2 · 48 words · 5 questions

> (1) The line **2x − 3y = 12** is written in standard form. (2) Rewriting it in slope-intercept form shows its slope and y-intercept at a glance. (3) Amir also writes it in point-slope form through the point (3, −2), finds the x-intercept, and writes a parallel line through the origin.

1. **[A.F.1.a]** What is the slope of the line?
   - A. 2/3
   - B. −2/3
   - C. 3/2
   - D. 2
   - **Key: A**

2. **[A.F.1.a]** What is the y-intercept of the line?
   - A. 12
   - B. 6
   - C. −4
   - D. 4
   - **Key: C**

3. **[A.F.1.a]** What is the x-intercept of the line?
   - A. −4
   - B. 6
   - C. 12
   - D. −6
   - **Key: B**

4. **[A.F.1.c]** Which equation is the point-slope form through (3, −2)?
   - A. y − 2 = (2/3)(x + 3)
   - B. y + 2 = (3/2)(x − 3)
   - C. y − 3 = (2/3)(x + 2)
   - D. y + 2 = (2/3)(x − 3)
   - **Key: D**

5. **[A.F.1.e]** Which equation is the parallel line through the origin?
   - A. y = −(3/2)x
   - B. y = (2/3)x
   - C. y = (2/3)x − 4
   - D. 2x − 3y = 12
   - **Key: B**

### Modeling the Car Wash Fundraiser  
`fn-fundraiser-model` · Functions · A.F.1 · level 2 · 92 words · 6 questions

> (1) The soccer team spends $60 on soap, sponges and signs for a car wash. (2) Each car washed brings in $8. (3) Let **c** be the number of cars washed and **M(c)** the team's money after paying for supplies. (4) Coach Reyes asks the team to write the model, graph it, find how many cars it takes to break even, and compare it with last year's bake sale, which raised $5 per item after $20 in supplies. (5) Both graphs are drawn on the same grid, with the number of items sold on the horizontal axis.

1. **[A.F.1.d]** Which equation models the car wash?
   - A. M(c) = 60c − 8
   - B. M(c) = 8c − 60
   - C. M(c) = 8c + 60
   - D. M(c) = 60 − 8c
   - **Key: B**

2. **[A.F.1.a]** What is the x-intercept of M, and what does it mean?
   - A. c = 7.5; the 8th car pays back the $60
   - B. c = 60; the team needs 60 cars
   - C. c = 8; each car earns $8
   - D. c = −60; the team starts $60 in debt
   - **Key: A**

3. **[A.F.1.a]** What does the y-intercept of the graph of M represent?
   - A. the money earned from the first car
   - B. the price of one car wash
   - C. the team's money before any cars are washed: −$60
   - D. the number of cars washed on the first day
   - **Key: C**

4. **[A.F.1.f]** Which description matches the graph of M?
   - A. a line starting at (0, 60) and falling 8 for each car
   - B. a horizontal line at 8
   - C. a line starting at (0, 8) and rising 60 for each car
   - D. a line starting at (0, −60) and rising 8 for each car
   - **Key: D**

5. **[A.F.1.h]** The bake sale model is B(n) = 5n − 20. Which comparison is correct?
   - A. The bake sale line is steeper and starts lower.
   - B. The car wash line is steeper and starts lower.
   - C. Both lines have the same slope.
   - D. The car wash line is steeper and starts higher.
   - **Key: B**

6. **[A.F.1.h]** For what number of items do the two models give the same amount of money?
   - A. 13.3 items, because 8c − 60 = 5c − 20 gives 3c = 40
   - B. 20 items, because 8(20) − 60 = 100 and 5(20) − 20 = 80
   - C. 8 items, because the car wash breaks even there
   - D. 40 items, because 8(40) − 60 = 5(40) − 20 = 260
   - **Key: A**


## Level 3 — stretch

### Three Ways to Grow $200  
`fn-three-accounts` · Functions · A.F.2 · level 3 · 67 words · 6 questions

> (1) Three cousins each start with $200. (2) Ava adds $25 every year: **A(t) = 200 + 25t**. (3) Ben's account grows 10% a year: **B(t) = 200(1.1)t**. (4) Cara's odd job pays more every year: **C(t) = 200 + 2t²**. (5) They compare balances after 5 years and after 10 years.
> 
> | t | A(t) | B(t) | C(t) |
> |---|---|---|---|
> | 0 | 200 | 200 | 200 |
> | 5 | 325 | 322.10 | 250 |
> | 10 | 450 | 518.75 | 400 |

1. **[A.F.2.h]** Which list correctly names the function types of A, B and C?
   - A. A linear, B exponential, C quadratic
   - B. A linear, B quadratic, C exponential
   - C. A exponential, B linear, C quadratic
   - D. A quadratic, B exponential, C linear
   - **Key: A**

2. **[A.F.1.a]** What is the rate of change of A(t), and what does it mean?
   - A. 200 dollars per year: Ava's starting amount
   - B. 25 dollars per year: the amount Ava adds each year
   - C. 25 years: the time it takes to double
   - D. 225 dollars: Ava's balance after one year
   - **Key: B**

3. **[A.F.2.h]** What does the table show about Ava's and Ben's balances?
   - A. Ben is always ahead because 10% is more than $25.
   - B. Ava is ahead at 5 years, but Ben's exponential growth passes her by 10 years.
   - C. Ava is always ahead because a linear function grows faster.
   - D. Their balances are equal at 10 years.
   - **Key: B**

4. **[A.F.2.e]** Between any two consecutive years, B(t) is multiplied by —
   - A. 10
   - B. 0.1
   - C. 1.1
   - D. 200
   - **Key: C**

5. **[A.F.2.g]** What is C(7)?
   - A. 298
   - B. 214
   - C. 228
   - D. 398
   - **Key: A**

6. **[A.F.2.h]** In the long run, which account grows fastest, and why?
   - A. Cara's, because a quadratic function eventually beats any exponential function.
   - B. Ava's, because it has the largest balance at 5 years.
   - C. Ben's, because multiplying by 1.1 each year eventually outgrows adding 25 or 2t².
   - D. All three grow at the same rate after 10 years.
   - **Key: C**

### A Parabola Described in Words  
`fn-parabola-from-graph` · Functions · A.F.2 · level 3 · 69 words · 6 questions

> (1) A graph shows a parabola that opens downward. (2) Its **vertex** is (3, 16), its x-intercepts are −1 and 7, and its y-intercept is 7. (3) Tomas wants to write the function in factored form and use it to describe where the graph is above the x-axis and where it is increasing. (4) The graph models the height, in feet, of a water jet x feet from the nozzle of a fountain.

1. **[A.F.2.d]** Which function has the zeros and y-intercept described?
   - A. f(x) = (x + 1)(x − 7)
   - B. f(x) = −(x + 1)(x − 7)
   - C. f(x) = −(x − 1)(x + 7)
   - D. f(x) = (x − 3)(x − 16)
   - **Key: B**

2. **[A.F.2.d]** Which is the same function written in standard form?
   - A. f(x) = −x² + 6x + 7
   - B. f(x) = −x² − 6x − 7
   - C. f(x) = x² − 6x − 7
   - D. f(x) = −x² + 8x − 7
   - **Key: A**

3. **[A.F.2.b]** For which values of x is f(x) > 0?
   - A. x < −1 or x > 7
   - B. x > 3
   - C. −1 < x < 7
   - D. 0 < x < 16
   - **Key: C**

4. **[A.F.2.b]** On which interval is the function increasing?
   - A. x < 3
   - B. x > 3
   - C. −1 < x < 7
   - D. x > 16
   - **Key: A**

5. **[A.F.2.b]** What is the range of the function?
   - A. y ≥ 16
   - B. y ≤ 16
   - C. −1 ≤ y ≤ 7
   - D. all real numbers
   - **Key: B**

6. **[A.F.2.g]** In the fountain model, what do the x-intercept 7 and the vertex represent?
   - A. The jet lands 7 feet from the nozzle; its greatest height is 16 feet, reached 3 feet out.
   - B. The jet lands 16 feet from the nozzle; its greatest height is 7 feet.
   - C. The jet is 7 feet high at the nozzle; it lands 3 feet out.
   - D. The jet reaches 7 feet high 16 feet from the nozzle.
   - **Key: A**

### What Is the Car Worth?  
`fn-car-value` · Functions · A.F.2 · level 3 · 91 words · 6 questions

> (1) A new car costs $24,000. (2) One model of its value after t years is exponential: **V(t) = 24000(0.85)t**. (3) The dealer's simpler model is linear: **L(t) = 24000 − 3000t**. (4) Sofia builds a table of both models for the first four years, rounding to the nearest dollar, and notices they agree at t = 0 but drift apart. (5) She also wonders which model makes sense for very large values of t.
> 
> | t | V(t) | L(t) |
> |---|---|---|
> | 0 | 24000 | 24000 |
> | 1 | 20400 | 21000 |
> | 2 | 17340 | 18000 |
> | 3 | 14739 | 15000 |
> | 4 | 12528 | 12000 |

1. **[A.F.2.e]** According to V(t), by what percent does the car lose value each year?
   - A. 85%
   - B. 15%
   - C. 0.85%
   - D. 12.5%
   - **Key: B**

2. **[A.F.2.e]** What is the y-intercept of both models, and what does it represent?
   - A. 0; the car is worth nothing when it is new
   - B. 3000; the car loses $3,000 in its first year
   - C. 24000; the car's value when t = 0, its purchase price
   - D. 0.85; the fraction of value kept each year
   - **Key: C**

3. **[A.F.2.g]** Which calculation confirms the table entry V(2) = 17340?
   - A. 24000 − 2(0.85) = 23998.3
   - B. 24000 × 0.85 × 0.85 = 17340
   - C. 24000 × 0.85 × 2 = 40800
   - D. 24000 − 0.85 × 2 × 3000 = 18900
   - **Key: B**

4. **[A.F.2.h]** Which statement about the two models is supported by the table?
   - A. The linear model gives a lower value every year.
   - B. The exponential model is lower for years 1 to 3 but higher at year 4.
   - C. The two models give the same value every year.
   - D. The exponential model loses the same dollar amount every year.
   - **Key: B**

5. **[A.F.2.h]** Why does the linear model stop making sense for large t while the exponential model does not?
   - A. L(t) becomes negative after 8 years, but V(t) stays positive and approaches 0.
   - B. V(t) becomes negative after 8 years, but L(t) stays positive.
   - C. L(t) grows without bound, but V(t) levels off at 24000.
   - D. Both models become negative after 8 years.
   - **Key: A**

6. **[A.F.2.h]** How can Sofia tell from the V(t) column alone that the model is exponential?
   - A. The values decrease by the same amount each year.
   - B. The values are all multiples of 1000.
   - C. Each value is the previous one times the same factor, 0.85.
   - D. The values reach 0 after exactly 8 years.
   - **Key: C**


---

# Statistics (A.ST)

Standards in this unit:



## Level 1 — foundation

### Study Hours and Quiz Scores  
`st-study-hours` · Statistics · A.ST.1 · level 1 · 52 words · 5 questions

> (1) Six students recorded how many hours they studied for a quiz and their scores. (2) Using technology, the class found the **line of best fit** y = 6x + 58, where x is hours and y is the score.
> 
> | Hours | 1 | 2 | 2 | 3 | 4 | 5 |
> |---|---|---|---|---|---|---|
> | Score | 62 | 72 | 68 | 78 | 80 | 90 |

1. **[A.ST.1.h]** Which statement describes the relationship in the scatterplot?
   - A. a negative association: more hours, lower scores
   - B. a positive association: more hours, higher scores
   - C. no association between hours and scores
   - D. a quadratic pattern that rises and then falls
   - **Key: B**

2. **[A.ST.1.b]** In this investigation, which variable is the explanatory (independent) variable?
   - A. the quiz score
   - B. the number of students
   - C. the number of hours studied
   - D. the line of best fit
   - **Key: C**

3. **[A.ST.1.f]** Using the line of best fit, what score is predicted for a student who studies 4 hours?
   - A. 82
   - B. 80
   - C. 64
   - D. 88
   - **Key: A**

4. **[A.ST.1.g]** What does the slope 6 mean in context?
   - A. Each extra hour of study is associated with about 6 more points.
   - B. Students who do not study score about 6 points.
   - C. Six students took the quiz.
   - D. The highest possible score is 6 points above 58.
   - **Key: A**

5. **[A.ST.1.g]** What does the y-intercept 58 represent?
   - A. the score gained per hour of study
   - B. the number of hours needed to pass
   - C. the average score of the six students
   - D. the predicted score for a student who studies 0 hours
   - **Key: D**

### Snow Cones and the Thermometer  
`st-snow-cones` · Statistics · A.ST.1 · level 1 · 47 words · 5 questions

> (1) Jaylen runs a snow-cone stand at the town pool. (2) He thinks he sells more on hotter days and wants to plan the **data cycle**: ask a question, collect data, make a graph, and draw a conclusion. (3) The pool is open every day from June to August.

1. **[A.ST.1.a]** Which is the best investigative question for Jaylen's study?
   - A. What was the high temperature at the pool on July 4?
   - B. Is there a relationship between the day's high temperature and snow cones sold?
   - C. How many snow cones did Jaylen sell over the whole summer?
   - D. Which flavor of snow cone is the most popular at the pool?
   - **Key: B**

2. **[A.ST.1.b]** Which pair of variables should Jaylen record each day?
   - A. the date and the pool's opening time
   - B. the number of lifeguards and the number of swimmers
   - C. the high temperature and the number of snow cones sold
   - D. the price of a snow cone and the color of the sky
   - **Key: C**

3. **[A.ST.1.c]** Which sample of days would give the most representative data?
   - A. the ten hottest days of the summer
   - B. every day of one rainy week in June
   - C. only the days when the pool held a swim meet
   - D. twenty days chosen at random from the whole summer
   - **Key: D**

4. **[A.ST.1.b]** How should Jaylen set up his scatterplot?
   - A. temperature on the horizontal axis, snow cones sold on the vertical axis, one point per day
   - B. snow cones sold on the horizontal axis, temperature on the vertical axis, one bar per week
   - C. days on the horizontal axis and both variables stacked on the vertical axis
   - D. a circle graph showing the share of sales on hot days
   - **Key: A**

5. **[A.ST.1.f]** Jaylen's line of best fit predicts 190 snow cones for a 120°F day. Why is this prediction unreasonable?
   - A. Lines of best fit cannot be used for predictions.
   - B. 120°F is far outside his data, and the pool would likely be closed.
   - C. The number 190 is not a whole number of snow cones.
   - D. Sales always go down when it is hotter.
   - **Key: B**

### Planning a Sleep Survey  
`st-sleep-survey` · Statistics · A.ST.1 · level 1 · 42 words · 5 questions

> (1) The student council wants to know whether students who ride the bus longer get less sleep. (2) The school has 1,200 students in grades 9 through 12. (3) The council can survey about 100 of them and wants results that represent the whole school.

1. **[A.ST.1.a]** Which question requires bivariate data?
   - A. How many minutes do students spend on the bus?
   - B. How many students ride the bus?
   - C. Is bus ride time related to hours of sleep?
   - D. Do seniors sleep more than freshmen?
   - **Key: C**

2. **[A.ST.1.b]** Which two variables should each surveyed student report?
   - A. grade level and favorite subject
   - B. minutes on the bus and hours of sleep last night
   - C. bus number and homeroom teacher
   - D. hours of sleep and hours of homework
   - **Key: B**

3. **[A.ST.1.c]** Which sampling method is most likely to represent the whole school?
   - A. surveying the first 100 students who arrive on one bus
   - B. surveying the entire football team
   - C. surveying 100 students whose names are drawn at random from the school roster
   - D. posting the survey online and using whoever answers first
   - **Key: C**

4. **[A.ST.1.c]** Why would surveying only students on one bus route give a poor sample?
   - A. Riders on one route have similar ride times, so bus time barely varies.
   - B. One bus cannot hold 100 students at a time.
   - C. Students who ride the bus never get enough sleep.
   - D. The survey would take too long to hand out.
   - **Key: A**

5. **[A.ST.1.h]** After collecting the data, which display best shows whether the two variables are related?
   - A. a bar graph of the number of students in each grade
   - B. a scatterplot of bus minutes against sleep hours
   - C. a circle graph of favorite bus routes
   - D. a list of the 100 names
   - **Key: B**


## Level 2 — average student (core)

### Age and Price of Used Cars  
`st-used-cars` · Statistics · A.ST.1 · level 2 · 68 words · 5 questions

> (1) A consumer class collected the age and asking price of 30 used cars of one model from online listings. (2) The line of best fit is y = −1500x + 18000, where x is the age in years and y the price in dollars. (3) Most points lie close to the line, but one 3-year-old car is listed at $4,000. (4) The oldest car in the data is 9 years old.

1. **[A.ST.1.h]** Which statement describes the association between age and price?
   - A. positive and strong
   - B. negative and strong
   - C. negative and weak
   - D. no association
   - **Key: B**

2. **[A.ST.1.f]** What price does the line predict for a 5-year-old car?
   - A. $16,500
   - B. $7,500
   - C. $10,500
   - D. $12,000
   - **Key: C**

3. **[A.ST.1.g]** What does the slope −1500 mean?
   - A. The predicted price drops about $1,500 per year of age.
   - B. A brand-new car of this model costs $1,500.
   - C. The oldest car in the data sells for $1,500.
   - D. Fifteen hundred cars were included in the sample.
   - **Key: A**

4. **[A.ST.1.h]** The 3-year-old car listed at $4,000 is best described as —
   - A. the y-intercept of the line
   - B. proof that the association is positive
   - C. a typical point, since the line predicts $4,000 at age 3
   - D. an outlier, far below the $13,500 the line predicts
   - **Key: D**

5. **[A.ST.1.f]** The line reaches y = 0 at x = 12. Why should the class not conclude that a 12-year-old car is free?
   - A. Twelve years is beyond the oldest car in the data, so this is extrapolation.
   - B. The slope should have been positive.
   - C. The line of best fit is only valid at whole-number ages.
   - D. A 12-year-old car would be worth more than a new one.
   - **Key: A**

### Curve of Best Fit for a Rocket  
`st-rocket-curve` · Statistics · A.ST.1 · level 2 · 70 words · 5 questions

> (1) A physics class launched a water rocket and used a video to measure its height every half second. (2) Plotted on a scatterplot, the points rise, level off and fall. (3) Using technology, the class compared a linear fit and a quadratic fit and chose the **quadratic curve of best fit** h = −4.9t² + 19.6t + 0.5.
> 
> | t (s) | 0 | 1 | 2 | 3 | 4 |
> |---|---|---|---|---|---|
> | h (m) | 0.5 | 15.1 | 20.3 | 15.4 | 0.6 |

1. **[A.ST.1.d]** Why is a quadratic curve a better model than a line for these data?
   - A. The points rise and then fall, and a line cannot change direction.
   - B. There are five data points, and a quadratic always fits five points exactly.
   - C. The heights are measured in meters.
   - D. A line would have a negative slope.
   - **Key: A**

2. **[A.ST.1.f]** Using the curve, what height is predicted at t = 2 seconds?
   - A. 39.7 m
   - B. 20.1 m
   - C. 10.3 m
   - D. 29.9 m
   - **Key: B**

3. **[A.ST.1.f]** About when does the model say the rocket reaches its greatest height?
   - A. t = 4 s, when it lands
   - B. t = 0 s, at launch
   - C. t = 2 s, at the vertex
   - D. t = 19.6 s, from the middle term
   - **Key: C**

4. **[A.ST.1.i]** The curve gives h = −24 at t = 5 seconds. What should the class conclude?
   - A. The rocket goes underground after landing.
   - B. The model does not apply after the rocket lands at about t = 4 s.
   - C. The quadratic fit is wrong and a line should be used.
   - D. The rocket was launched from 24 m below the ground.
   - **Key: B**

5. **[A.ST.1.b]** Which variable belongs on the horizontal axis of the scatterplot?
   - A. height, because it is what the class measured
   - B. the number of launches
   - C. the video frame rate
   - D. time, because height depends on time
   - **Key: D**

### How Much Fertilizer?  
`st-fertilizer-plants` · Statistics · A.ST.1 · level 2 · 89 words · 6 questions

> (1) An agriculture class grew tomato seedlings with different amounts of fertilizer, in grams per pot, and measured each plant's height after four weeks. (2) The scatterplot rose at first, peaked, then fell as heavy fertilizer burned the roots. (3) The class chose the quadratic curve of best fit **h = −0.5g² + 6g + 12**, where g is grams and h is height in centimeters. (4) The data ran from 0 to 12 grams.
> 
> | g | 0 | 2 | 4 | 6 | 8 | 10 | 12 |
> |---|---|---|---|---|---|---|---|
> | h (cm) | 11 | 23 | 27 | 30 | 29 | 21 | 13 |

1. **[A.ST.1.h]** Which description of the relationship fits the data?
   - A. a linear positive association: more fertilizer, taller plants at every level
   - B. no association between fertilizer and height
   - C. a quadratic relationship: height rises to a peak near 6 grams and then falls
   - D. a linear negative association: more fertilizer, shorter plants
   - **Key: C**

2. **[A.ST.1.f]** What height does the curve predict for 5 grams of fertilizer?
   - A. 29.5 cm
   - B. 42 cm
   - C. 24.5 cm
   - D. 54.5 cm
   - **Key: A**

3. **[A.ST.1.f]** According to the model, which amount of fertilizer gives the greatest predicted height?
   - A. 12 grams, the most fertilizer
   - B. 6 grams, at the vertex of the curve
   - C. 0 grams, because fertilizer burns roots
   - D. 3 grams, half of 6
   - **Key: B**

4. **[A.ST.1.i]** A student uses the curve to predict the height for 20 grams and gets −68 cm. What is the best response?
   - A. The plant would grow 68 cm downward.
   - B. The data stop at 12 grams; 20 grams is far outside the model's range.
   - C. The class should have used a line of best fit.
   - D. Negative heights are fine because the curve is quadratic.
   - **Key: B**

5. **[A.ST.1.e]** What does the constant 12 in the model represent?
   - A. the predicted height of a plant given no fertilizer
   - B. the most fertilizer used in the study
   - C. the number of plants in the study
   - D. the height gained per gram of fertilizer
   - **Key: A**

6. **[A.ST.1.b]** Which other variable should the class have kept the same for every pot?
   - A. the amount of fertilizer
   - B. the final height
   - C. the sunlight and water each pot received
   - D. the number of weeks, which should vary by pot
   - **Key: C**

### Screen Time and Sleep  
`st-screen-time` · Statistics · A.ST.1 · level 2 · 72 words · 6 questions

> (1) A health class asked 40 students how many hours they used screens after school and how many hours they slept that night. (2) The scatterplot shows a moderate negative association. (3) The line of best fit is **y = −0.5x + 9.5**, where x is screen hours and y is sleep hours. (4) Screen time in the data ranged from 0 to 6 hours. (5) One student concludes that screens cause students to lose sleep.

1. **[A.ST.1.g]** What does the slope −0.5 mean in context?
   - A. Each extra hour of screen time is associated with about half an hour less sleep.
   - B. Students sleep half as long as they use screens.
   - C. Half of the students use screens after school.
   - D. Each extra hour of sleep causes half an hour less screen time.
   - **Key: A**

2. **[A.ST.1.f]** How many hours of sleep does the line predict for a student with 3 hours of screen time?
   - A. 9 hours
   - B. 6.5 hours
   - C. 8 hours
   - D. 11 hours
   - **Key: C**

3. **[A.ST.1.f]** Which prediction from the line is most trustworthy?
   - A. sleep for 15 hours of screen time
   - B. sleep for 4 hours of screen time
   - C. sleep for 19 hours of screen time, when the line reaches 0
   - D. screen time for a student who slept 12 hours
   - **Key: B**

4. **[A.ST.1.i]** Why is the student's conclusion in sentence 5 too strong?
   - A. The slope is negative, which means there is no relationship.
   - B. A survey cannot measure how long students sleep.
   - C. An association shows the variables move together, not that one causes the other.
   - D. Forty students is too many for a valid survey result.
   - **Key: C**

5. **[A.ST.1.b]** Which variable did the class treat as the explanatory variable?
   - A. hours of sleep
   - B. hours of screen time
   - C. the number of students
   - D. the y-intercept
   - **Key: B**

6. **[A.ST.1.g]** What does the y-intercept 9.5 represent?
   - A. the most sleep any student reported
   - B. the number of hours of screen time when sleep is 0
   - C. the average screen time of the class
   - D. the predicted sleep, in hours, for a student with no screen time
   - **Key: D**

### Four Scatterplots  
`st-four-plots` · Statistics · A.ST.1 · level 2 · 81 words · 5 questions

> (1) Four scatterplots are described. (2) Plot 1: shoe size against score on a history test; the points are scattered evenly with no pattern. (3) Plot 2: years of experience against hourly pay for 25 electricians; the points climb steadily from lower left to upper right and lie close to a line. (4) Plot 3: outdoor temperature against heating cost; the points fall from upper left to lower right. (5) Plot 4: seconds after a bounce against a ball's height; the points rise and then fall.

1. **[A.ST.1.h]** Which plot shows no association?
   - A. Plot 1
   - B. Plot 2
   - C. Plot 3
   - D. Plot 4
   - **Key: A**

2. **[A.ST.1.h]** Which plot shows a strong positive linear association?
   - A. Plot 1
   - B. Plot 2
   - C. Plot 3
   - D. Plot 4
   - **Key: B**

3. **[A.ST.1.d]** For Plot 3, which line of best fit is possible?
   - A. y = 3x + 40
   - B. y = 3x² + 40
   - C. y = −3x + 240
   - D. y = x² − 40
   - **Key: C**

4. **[A.ST.1.d]** Which plot calls for a quadratic curve of best fit rather than a line?
   - A. Plot 1
   - B. Plot 2
   - C. Plot 3
   - D. Plot 4
   - **Key: D**

5. **[A.ST.1.i]** What can be concluded from Plot 1?
   - A. Larger shoes cause lower history scores.
   - B. Shoe size is not useful for predicting a history score.
   - C. The line of best fit has a steep positive slope.
   - D. Students with the same shoe size have the same score.
   - **Key: B**

### Exercise and Heart Rate  
`st-heart-rate` · Statistics · A.ST.1 · level 2 · 91 words · 5 questions

> (1) A P.E. class measured each student's heart rate after 0, 2, 4, 6, 8 and 10 minutes on a treadmill at a steady jog. (2) For the class averages, the line of best fit is **y = 8x + 70**, where x is minutes and y is beats per minute. (3) The teacher points out that no one jogged longer than 10 minutes, and that a healthy heart rate rarely goes above about 200 beats per minute.
> 
> | Minutes | 0 | 2 | 4 | 6 | 8 | 10 |
> |---|---|---|---|---|---|---|
> | Avg. bpm | 72 | 84 | 104 | 116 | 136 | 148 |

1. **[A.ST.1.h]** Which statement describes the association?
   - A. strong positive: heart rate rises steadily with minutes jogged
   - B. strong negative: heart rate falls as minutes increase
   - C. no association between minutes and heart rate
   - D. quadratic: heart rate rises then falls
   - **Key: A**

2. **[A.ST.1.f]** What heart rate does the line predict after 5 minutes?
   - A. 75 bpm
   - B. 110 bpm
   - C. 120 bpm
   - D. 40 bpm
   - **Key: B**

3. **[A.ST.1.f]** The line predicts 550 bpm after 60 minutes. Why is this prediction not reasonable?
   - A. The slope should be negative for long runs.
   - B. Sixty minutes is far beyond the data; heart rate levels off well below 550.
   - C. Heart rate is not related to exercise.
   - D. The line of best fit only works for even numbers of minutes.
   - **Key: B**

4. **[A.ST.1.g]** What does the y-intercept 70 represent?
   - A. the increase in heart rate each minute
   - B. the number of students measured
   - C. the predicted resting heart rate, before jogging begins
   - D. the number of minutes to reach 148 bpm
   - **Key: C**

5. **[A.ST.1.c]** The teacher wants results that apply to all ninth graders at the school. Which change would most improve the sample?
   - A. measuring the same class again the next day
   - B. a random selection from every ninth-grade P.E. class
   - C. measuring only students on the track team
   - D. using a longer treadmill
   - **Key: B**


## Level 3 — stretch

### Pricing the Concession Stand  
`st-concession-price` · Statistics · A.ST.1 · level 3 · 93 words · 6 questions

> (1) The booster club tried a different price for a hot dog at each of eight home games and recorded the revenue. (2) As the price rose, revenue rose at first and then fell as fewer fans bought. (3) Using technology, the club found the quadratic curve of best fit **R = −20p² + 200p**, where p is the price in dollars and R the revenue. (4) Prices in the data ranged from $1 to $8.
> 
> | p ($) | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
> |---|---|---|---|---|---|---|---|---|
> | R ($) | 185 | 315 | 425 | 475 | 505 | 470 | 395 | 330 |

1. **[A.ST.1.a]** Which investigative question did the club set out to answer?
   - A. How many hot dogs were sold at the third game?
   - B. How is hot dog price related to revenue, and which price earns the most?
   - C. Which home game had the largest crowd this season?
   - D. Do fans prefer hot dogs or nachos at the stand?
   - **Key: B**

2. **[A.ST.1.f]** According to the model, which price maximizes revenue?
   - A. $8
   - B. $10
   - C. $5
   - D. $2.50
   - **Key: C**

3. **[A.ST.1.f]** What revenue does the model predict at a price of $3?
   - A. $420
   - B. $540
   - C. $180
   - D. $600
   - **Key: A**

4. **[A.ST.1.e]** Why would a line of best fit be a poor model for these data?
   - A. The revenue values are too large for a line.
   - B. There are eight points, and a line needs exactly two.
   - C. The data rise and then fall, so no single slope describes them.
   - D. Prices are whole dollars.
   - **Key: C**

5. **[A.ST.1.i]** The model gives R = 0 at p = 10. What is the most reasonable interpretation?
   - A. Few would buy at $10, but $10 is outside the tested prices, so be cautious.
   - B. At $10 the club would earn its greatest revenue of the season.
   - C. The model is wrong, because revenue can never be zero.
   - D. At $10 each fan would buy exactly one hot dog.
   - **Key: A**

6. **[A.ST.1.i]** Which factor most limits the conclusions the club can draw?
   - A. Each price was tried at one game, so crowd size and weather also varied.
   - B. The prices were listed in dollars instead of cents.
   - C. A quadratic model can only be used for projectiles.
   - D. Revenue is not a numerical variable.
   - **Key: A**

### Oysters on the Rappahannock  
`st-oyster-harvest` · Statistics · A.ST.1 · level 3 · 126 words · 6 questions

> (1) A marine science club studied how the oyster harvest on restored reefs in the Rappahannock River has changed. (2) Each fall they sampled 10 reefs chosen at random from the 60 restored reefs and recorded the harvest in bushels per reef. (3) Let x be years since 2015 and y the average bushels per reef. (4) Technology gave the line of best fit **y = 12.5x + 40**. (5) The 2018 value, 55 bushels, sits well below the line because a tropical storm buried part of the reefs that summer. (6) A club member wants to use the line to predict the harvest in 2050. (7) Another argues that the restoration work caused the increase.
> 
> | Year | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 |
> |---|---|---|---|---|---|---|---|
> | Bushels | 42 | 50 | 68 | 55 | 92 | 101 | 117 |

1. **[A.ST.1.a]** Which investigative question best matches the club's study?
   - A. How many oysters live in the Rappahannock River?
   - B. How has the average harvest per restored reef changed over the years since 2015?
   - C. Which reef had the largest harvest in 2021?
   - D. Are oysters more common in rivers or in the Chesapeake Bay?
   - **Key: B**

2. **[A.ST.1.c]** Why did the club choose 10 reefs at random each year instead of the 10 reefs closest to the dock?
   - A. Random reefs are easier to reach.
   - B. The reefs near the dock have no oysters.
   - C. A random sample better represents all 60 reefs, near and far.
   - D. Ten is the largest number of reefs a boat can visit.
   - **Key: C**

3. **[A.ST.1.g]** What does the slope 12.5 mean in context?
   - A. The average harvest per reef grew about 12.5 bushels a year.
   - B. Each reef produced 12.5 bushels in 2015.
   - C. The club sampled 12.5 reefs per year.
   - D. The harvest doubled every 12.5 years.
   - **Key: A**

4. **[A.ST.1.f]** What harvest does the line predict for 2025?
   - A. 125 bushels per reef
   - B. 165 bushels per reef
   - C. 290 bushels per reef
   - D. 52.5 bushels per reef
   - **Key: B**

5. **[A.ST.1.h]** How should the club treat the 2018 data point?
   - A. Delete it, because it proves the line is wrong.
   - B. Keep it, and report it as an outlier with a known cause.
   - C. Move it up to the line so the fit looks better.
   - D. Use it as the y-intercept.
   - **Key: B**

6. **[A.ST.1.i]** Which statement best evaluates the 2050 prediction and the causation claim?
   - A. Both are sound: the line is a good fit, so it works for any year, and the increase proves restoration caused it.
   - B. The 2050 prediction is reliable, but restoration cannot have caused the increase.
   - C. 2050 is too far out to trust; restoration is plausible, but the data show only an association.
   - D. Neither can be discussed without more reefs.
   - **Key: C**

