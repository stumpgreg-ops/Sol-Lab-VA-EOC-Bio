/* SOL Lab — Scientific Investigation (BIO.1). Original text only. */
(function (global) {
  var P = global.HEIST_PACKS;
  if (!P || !P.push) return;
  var N = function (i) { return '<span class="n">(' + i + ')</span> '; };   // numbered sentence

  var PACKS = [
    /* ---------- tiny ---------- */
    {
      id: "inv-catalase-liver",
      family: "INV",
      title: "Catalase and temperature",
      kind: "Investigation · BIO.1",
      blurb: "Liver, hydrogen peroxide and four water baths: read the bubble counts.",
      level: 1,
      passage: "<p>" + N(1) + "A student tested how temperature affects the enzyme <strong>catalase</strong>, which breaks hydrogen peroxide into water and oxygen. " + N(2) + "She placed a 1 g cube of beef liver in 10 mL of hydrogen peroxide at four temperatures and counted the oxygen bubbles released in one minute. " + N(3) + "Each temperature was tested three times, and the averages are shown in the table.</p>" +
        "<table><tr><th>Water bath (°C)</th><th>Bubbles per minute (average)</th></tr><tr><td>10</td><td>6</td></tr><tr><td>25</td><td>19</td></tr><tr><td>37</td><td>31</td></tr><tr><td>60</td><td>2</td></tr></table>",
      claims: [
        {
          id: "dv",
          sol: "BIO.1.b",
          stem: "In this investigation, the dependent variable is —",
          choices: [
            { letter: "A", text: "the number of oxygen bubbles released per minute" },
            { letter: "B", text: "the temperature of the water bath for each trial" },
            { letter: "C", text: "the mass of the beef liver cube in each tube" },
            { letter: "D", text: "the volume of hydrogen peroxide in each tube" }
          ],
          correct: "A"
        },
        {
          id: "read",
          sol: "BIO.1.c",
          stem: "Which statement about the data in the table is accurate?",
          choices: [
            { letter: "A", text: "Bubble production rose steadily at every temperature tested." },
            { letter: "B", text: "Bubble production was highest at 37 °C and dropped sharply at 60 °C." },
            { letter: "C", text: "The enzyme released the most bubbles at the lowest temperature." },
            { letter: "D", text: "Bubble production at 25 °C was twice the rate seen at 37 °C." }
          ],
          correct: "B"
        },
        {
          id: "conclude",
          sol: "BIO.1.d",
          stem: "Which conclusion is best supported by the results?",
          choices: [
            { letter: "A", text: "Catalase is destroyed by any temperature above 25 °C." },
            { letter: "B", text: "Hydrogen peroxide breaks down fastest in cold water." },
            { letter: "C", text: "Catalase works best near body temperature and slows at high temperature." },
            { letter: "D", text: "The mass of the liver cube controls how fast the reaction runs." }
          ],
          correct: "C"
        },
        {
          id: "trials",
          sol: "BIO.1.b",
          stem: "Why did the student test each temperature three times?",
          choices: [
            { letter: "A", text: "to change the independent variable more often" },
            { letter: "B", text: "to make the reaction produce more bubbles" },
            { letter: "C", text: "to keep the volume of hydrogen peroxide the same" },
            { letter: "D", text: "to reduce the effect of random error on the averages" }
          ],
          correct: "D"
        },
        {
          id: "term",
          sol: "BIO.1.f",
          stem: "Based on sentence 1, catalase is best described as —",
          choices: [
            { letter: "A", text: "a substrate that is broken into water and oxygen" },
            { letter: "B", text: "an enzyme that speeds the breakdown of hydrogen peroxide" },
            { letter: "C", text: "a gas that is released by warm beef liver" },
            { letter: "D", text: "the temperature at which a reaction stops" }
          ],
          correct: "B"
        }
      ]
    },
    {
      id: "inv-pillbug-chamber",
      family: "INV",
      title: "Pill bugs in a choice chamber",
      kind: "Investigation · BIO.1",
      blurb: "Damp or dry? Ten pill bugs vote with their feet.",
      level: 1,
      passage: "<p>" + N(1) + "A class asked whether pill bugs prefer damp or dry surroundings. " + N(2) + "They joined two petri dishes with a tunnel to make a <strong>choice chamber</strong>: one dish held damp paper towel, the other dry. " + N(3) + "Ten pill bugs were released in the tunnel and counted in each dish every two minutes for ten minutes. " + N(4) + "At the final count, eight were on the damp side and two on the dry side.</p>",
      claims: [
        {
          id: "question",
          sol: "BIO.1.a",
          stem: "Which question is this investigation designed to answer?",
          choices: [
            { letter: "A", text: "Do pill bugs move faster in the dark than in the light?" },
            { letter: "B", text: "Do pill bugs choose damp areas over dry areas?" },
            { letter: "C", text: "How many pill bugs can live in a single petri dish?" },
            { letter: "D", text: "Does paper towel change how long pill bugs live?" }
          ],
          correct: "B"
        },
        {
          id: "confound",
          sol: "BIO.1.b",
          stem: "Which change to the setup would make the results harder to interpret?",
          choices: [
            { letter: "A", text: "placing a lamp over only the dry dish" },
            { letter: "B", text: "using ten pill bugs instead of five" },
            { letter: "C", text: "counting the pill bugs every two minutes" },
            { letter: "D", text: "lining both dishes with the same brand of towel" }
          ],
          correct: "A"
        },
        {
          id: "percent",
          sol: "BIO.1.c",
          stem: "According to sentence 4, what percentage of the pill bugs were on the damp side at the final count?",
          choices: [
            { letter: "A", text: "20 percent" },
            { letter: "B", text: "50 percent" },
            { letter: "C", text: "80 percent" },
            { letter: "D", text: "100 percent" }
          ],
          correct: "C"
        },
        {
          id: "conclude",
          sol: "BIO.1.d",
          stem: "Which conclusion do the results best support?",
          choices: [
            { letter: "A", text: "Pill bugs cannot survive on dry paper towel." },
            { letter: "B", text: "Pill bugs choose damp or dry places at random." },
            { letter: "C", text: "Damp paper towel attracts pill bugs by its smell." },
            { letter: "D", text: "Pill bugs tend to gather in damp areas." }
          ],
          correct: "D"
        },
        {
          id: "tunnel",
          sol: "BIO.1.b",
          stem: "The purpose of the tunnel in the choice chamber is to —",
          choices: [
            { letter: "A", text: "keep the dry dish from drying out further" },
            { letter: "B", text: "let the pill bugs move freely between both conditions" },
            { letter: "C", text: "hold the pill bugs still while they are counted" },
            { letter: "D", text: "raise the temperature of the damp dish" }
          ],
          correct: "B"
        }
      ]
    },
    {
      id: "inv-seed-salt",
      family: "INV",
      title: "Road salt and radish seeds",
      kind: "Investigation · BIO.1",
      blurb: "Four salt solutions, 20 seeds each, five days: who sprouts?",
      level: 2,
      passage: "<p>" + N(1) + "A student tested whether road salt affects the germination of radish seeds. " + N(2) + "She soaked paper towels in salt solutions of 0, 5, 10 and 20 grams per liter, placed 20 seeds on each towel, and sealed each in a plastic bag. " + N(3) + "After five days she counted the seeds that had sprouted. " + N(4) + "Her hypothesis was that higher salt concentrations would lower the <strong>germination rate</strong>.</p>" +
        "<table><tr><th>Salt (g/L)</th><th>Seeds sprouted (of 20)</th><th>Germination (%)</th></tr><tr><td>0</td><td>18</td><td>90</td></tr><tr><td>5</td><td>15</td><td>75</td></tr><tr><td>10</td><td>10</td><td>50</td></tr><tr><td>20</td><td>2</td><td>10</td></tr></table>",
      claims: [
        {
          id: "controlled",
          sol: "BIO.1.b",
          stem: "Which of these is a controlled variable in this investigation?",
          choices: [
            { letter: "A", text: "the salt concentration of each solution" },
            { letter: "B", text: "the number of seeds that sprouted" },
            { letter: "C", text: "the germination rate after five days" },
            { letter: "D", text: "the number of seeds placed on each towel" }
          ],
          correct: "D"
        },
        {
          id: "drop",
          sol: "BIO.1.c",
          stem: "Between which two salt concentrations did the germination rate drop the most?",
          choices: [
            { letter: "A", text: "0 and 5 g/L" },
            { letter: "B", text: "5 and 10 g/L" },
            { letter: "C", text: "10 and 20 g/L" },
            { letter: "D", text: "the drop was equal at each step" }
          ],
          correct: "C"
        },
        {
          id: "support",
          sol: "BIO.1.d",
          stem: "Do the results support the student's hypothesis?",
          choices: [
            { letter: "A", text: "Yes, because germination fell as the salt concentration rose." },
            { letter: "B", text: "Yes, because every bag had at least two sprouted seeds." },
            { letter: "C", text: "No, because the 0 g/L bag did not reach 100 percent." },
            { letter: "D", text: "No, because the seeds were sealed inside plastic bags." }
          ],
          correct: "A"
        },
        {
          id: "share",
          sol: "BIO.1.f",
          stem: "Which format would best communicate the trend in these results to the class?",
          choices: [
            { letter: "A", text: "a pie chart showing the total number of seeds used" },
            { letter: "B", text: "a bar graph of germination percentage for each salt level" },
            { letter: "C", text: "a written list of the materials and what they cost" },
            { letter: "D", text: "a close-up photograph of a single sprouted seed" }
          ],
          correct: "B"
        },
        {
          id: "term",
          sol: "BIO.1.c",
          stem: "In sentence 4, the germination rate refers to —",
          choices: [
            { letter: "A", text: "the number of days a seed takes to sprout" },
            { letter: "B", text: "the mass of salt dissolved in each liter" },
            { letter: "C", text: "the share of seeds that sprouted in a set time" },
            { letter: "D", text: "the length of the root after five days" }
          ],
          correct: "C"
        }
      ]
    },

    /* ---------- short ---------- */
    {
      id: "inv-yeast-sugar",
      family: "INV",
      title: "Yeast, sugar and balloons",
      kind: "Investigation · BIO.1",
      blurb: "Which sugar does yeast ferment fastest? Measure the balloons.",
      level: 1,
      passage: "<p>" + N(1) + "A student investigated which sugar yeast ferments fastest. " + N(2) + "He mixed one packet of dry yeast with 100 mL of warm water in each of four bottles and added 10 g of glucose, sucrose, lactose, or no sugar. " + N(3) + "A balloon was stretched over each bottle to trap the carbon dioxide produced by <strong>fermentation</strong>. " + N(4) + "After 30 minutes he measured the circumference of each balloon with a string. " + N(5) + "The bottle with no sugar served as the control. " + N(6) + "He repeated the whole procedure twice more and averaged the results.</p>" +
        "<table><tr><th>Sugar added</th><th>Balloon circumference (cm), average</th></tr><tr><td>None</td><td>0</td></tr><tr><td>Glucose</td><td>24</td></tr><tr><td>Sucrose</td><td>21</td></tr><tr><td>Lactose</td><td>3</td></tr></table>",
      claims: [
        {
          id: "iv",
          sol: "BIO.1.b",
          stem: "What was the independent variable in the yeast investigation?",
          choices: [
            { letter: "A", text: "the type of sugar added to each bottle" },
            { letter: "B", text: "the circumference of each balloon" },
            { letter: "C", text: "the amount of warm water in each bottle" },
            { letter: "D", text: "the number of yeast packets used" }
          ],
          correct: "A"
        },
        {
          id: "control",
          sol: "BIO.1.b",
          stem: "What was the purpose of the bottle with no sugar?",
          choices: [
            { letter: "A", text: "to show the largest balloon size that was possible" },
            { letter: "B", text: "to show how much gas yeast makes without added sugar" },
            { letter: "C", text: "to test whether warm water alone can inflate a balloon" },
            { letter: "D", text: "to check whether lactose is really a sugar" }
          ],
          correct: "B"
        },
        {
          id: "least",
          sol: "BIO.1.c",
          stem: "Of the three sugars tested, which was fermented the least?",
          choices: [
            { letter: "A", text: "glucose" },
            { letter: "B", text: "sucrose" },
            { letter: "C", text: "lactose" },
            { letter: "D", text: "all three were fermented equally" }
          ],
          correct: "C"
        },
        {
          id: "conclude",
          sol: "BIO.1.d",
          stem: "Which conclusion is best supported by the table?",
          choices: [
            { letter: "A", text: "Yeast is able to use glucose but no other sugar at all." },
            { letter: "B", text: "Yeast fermented glucose and sucrose readily but lactose very little." },
            { letter: "C", text: "Larger balloons trap more yeast cells than smaller ones do." },
            { letter: "D", text: "Lactose completely stops yeast from producing carbon dioxide." }
          ],
          correct: "B"
        },
        {
          id: "limit",
          sol: "BIO.1.e",
          stem: "Which statement describes a limit of using balloon circumference to represent gas production?",
          choices: [
            { letter: "A", text: "The balloon measures only the gas that came from the control bottle." },
            { letter: "B", text: "A balloon stops stretching once carbon dioxide begins to enter it." },
            { letter: "C", text: "Circumference is an indirect measure, since balloons stretch unevenly." },
            { letter: "D", text: "Yeast cells pass through the rubber and change the reading." }
          ],
          correct: "C"
        },
        {
          id: "next",
          sol: "BIO.1.a",
          stem: "Which new question follows most naturally from these results?",
          choices: [
            { letter: "A", text: "Does the color of the balloon affect how far it stretches?" },
            { letter: "B", text: "Does a longer string give a more accurate circumference?" },
            { letter: "C", text: "Which brand of bottle holds the most warm water?" },
            { letter: "D", text: "Does temperature change how fast yeast ferments sucrose?" }
          ],
          correct: "D"
        }
      ]
    },
    {
      id: "inv-transpiration-fan",
      family: "INV",
      title: "Transpiration on a potometer",
      kind: "Investigation · BIO.1",
      blurb: "Fan, lamp, bag or still air: which moves the bubble fastest?",
      level: 2,
      passage: "<p>" + N(1) + "A group measured <strong>transpiration</strong>, the loss of water vapor from leaves, using a potometer: a leafy stem sealed into a water-filled tube with a scale. " + N(2) + "As the leaves lose water, an air bubble moves along the tube; the distance it travels in ten minutes shows the water taken up. " + N(3) + "The group tested the same stem under four conditions in turn: still room air, a fan, a lamp, and a clear plastic bag over the leaves. " + N(4) + "On their bar graph the fan bar was tallest, the lamp bar slightly shorter, the still-air bar about half the fan bar, and the plastic-bag bar the shortest.</p>",
      claims: [
        {
          id: "design",
          sol: "BIO.1.b",
          stem: "Which practice strengthened the design of this investigation?",
          choices: [
            { letter: "A", text: "using the same stem for every condition" },
            { letter: "B", text: "testing the fan before the lamp" },
            { letter: "C", text: "sealing the stem into a tube of water" },
            { letter: "D", text: "reading the graph after ten minutes" }
          ],
          correct: "A"
        },
        {
          id: "least",
          sol: "BIO.1.c",
          stem: "Under which condition did the stem take up the least water?",
          choices: [
            { letter: "A", text: "still room air" },
            { letter: "B", text: "the fan" },
            { letter: "C", text: "the lamp" },
            { letter: "D", text: "the plastic bag" }
          ],
          correct: "D"
        },
        {
          id: "explain",
          sol: "BIO.1.d",
          stem: "Which explanation best accounts for the fan result?",
          choices: [
            { letter: "A", text: "Moving air cooled the leaves, which slowed the rate of transpiration." },
            { letter: "B", text: "Moving air swept water vapor away from the leaves, speeding transpiration." },
            { letter: "C", text: "The fan forced extra water up the tube and into the cut stem." },
            { letter: "D", text: "The fan blew directly on the air bubble and pushed it along the tube." }
          ],
          correct: "B"
        },
        {
          id: "model",
          sol: "BIO.1.e",
          stem: "The potometer models transpiration by assuming that —",
          choices: [
            { letter: "A", text: "water taken up equals water lost by the leaves" },
            { letter: "B", text: "the plant uses all absorbed water for photosynthesis" },
            { letter: "C", text: "the air bubble stops moving when leaves are wet" },
            { letter: "D", text: "light has no effect on the movement of the bubble" }
          ],
          correct: "A"
        },
        {
          id: "compare",
          sol: "BIO.1.c",
          stem: "Based on the graph, roughly how did the still-air rate compare with the fan rate?",
          choices: [
            { letter: "A", text: "it was about twice the fan rate" },
            { letter: "B", text: "it was about the same as the fan rate" },
            { letter: "C", text: "it was about half the fan rate" },
            { letter: "D", text: "it was lower than the plastic-bag rate" }
          ],
          correct: "C"
        }
      ]
    },
    {
      id: "inv-creek-pasture",
      family: "INV",
      title: "Goose Run above and below the pasture",
      kind: "Investigation · BIO.1",
      blurb: "Oxygen, temperature and nitrate at two sites on a Shenandoah Valley creek.",
      level: 2,
      passage: "<p>" + N(1) + "An environmental science class sampled Goose Run, a small creek in the Shenandoah Valley, to see whether a cattle pasture changes water quality. " + N(2) + "They chose one site upstream of the pasture and one site 200 m downstream, and at each site they measured <strong>dissolved oxygen</strong>, water temperature, and nitrate on the same afternoon. " + N(3) + "Each measurement was taken three times and averaged. " + N(4) + "Cattle had direct access to the creek along the pasture. " + N(5) + "The class predicted that the downstream site would have more nitrate and less oxygen.</p>" +
        "<table><tr><th>Measurement</th><th>Upstream</th><th>Downstream</th></tr><tr><td>Dissolved oxygen (mg/L)</td><td>8.6</td><td>5.1</td></tr><tr><td>Temperature (°C)</td><td>17</td><td>21</td></tr><tr><td>Nitrate (mg/L)</td><td>0.4</td><td>3.2</td></tr></table>",
      claims: [
        {
          id: "problem",
          sol: "BIO.1.a",
          stem: "The problem the class set out to study was whether —",
          choices: [
            { letter: "A", text: "cattle drink more water on warm afternoons" },
            { letter: "B", text: "a pasture affects the water quality of the creek" },
            { letter: "C", text: "nitrate raises the temperature of creek water" },
            { letter: "D", text: "Goose Run flows faster upstream than downstream" }
          ],
          correct: "B"
        },
        {
          id: "sameday",
          sol: "BIO.1.b",
          stem: "Why did the class take all readings on the same afternoon?",
          choices: [
            { letter: "A", text: "so that the cattle would be standing in the creek at the time" },
            { letter: "B", text: "to make the downstream readings larger than the upstream ones" },
            { letter: "C", text: "to keep weather and time of day from affecting the comparison" },
            { letter: "D", text: "because the oxygen meter only works when the water is warm" }
          ],
          correct: "C"
        },
        {
          id: "biggest",
          sol: "BIO.1.c",
          stem: "Which measurement showed the largest change relative to its upstream value?",
          choices: [
            { letter: "A", text: "dissolved oxygen" },
            { letter: "B", text: "water temperature" },
            { letter: "C", text: "nitrate" },
            { letter: "D", text: "all three changed by the same factor" }
          ],
          correct: "C"
        },
        {
          id: "conclude",
          sol: "BIO.1.d",
          stem: "Which conclusion is best supported by the data?",
          choices: [
            { letter: "A", text: "The pasture is the only source of nitrate in the creek." },
            { letter: "B", text: "Warmer water upstream caused the oxygen level to drop." },
            { letter: "C", text: "The creek has no fish downstream of the pasture." },
            { letter: "D", text: "Water quality was lower downstream of the pasture." }
          ],
          correct: "D"
        },
        {
          id: "critique",
          sol: "BIO.1.c",
          stem: "Which statement is a valid criticism of the class's conclusion that the pasture caused the changes?",
          choices: [
            { letter: "A", text: "The class should have sampled a single site rather than two." },
            { letter: "B", text: "Another source between the sites, not the pasture, could explain the change." },
            { letter: "C", text: "Nitrate readings cannot be taken from flowing creek water." },
            { letter: "D", text: "Averaging three readings hides the true highest value at each site." }
          ],
          correct: "B"
        },
        {
          id: "share",
          sol: "BIO.1.f",
          stem: "Which action would best let other scientists check the class's findings?",
          choices: [
            { letter: "A", text: "publishing the method, site locations and all raw readings" },
            { letter: "B", text: "reporting only the averages that supported the prediction" },
            { letter: "C", text: "keeping the site locations secret to protect the creek" },
            { letter: "D", text: "rounding every reading to the nearest whole number" }
          ],
          correct: "A"
        }
      ]
    },

    /* ---------- medium ---------- */
    {
      id: "inv-handwash-plates",
      family: "INV",
      title: "Hand washing on agar plates",
      kind: "Investigation · BIO.1",
      blurb: "Five, ten, twenty or forty seconds of scrubbing: count the colonies.",
      level: 1,
      passage: "<p>" + N(1) + "A microbiology class tested whether the length of hand washing changes the number of bacteria on the skin. " + N(2) + "Four volunteers each pressed the fingertips of one hand onto a nutrient agar plate before washing. " + N(3) + "They then washed with the same soap for 5, 10, 20, or 40 seconds, dried with a clean paper towel, and pressed the fingertips of the same hand onto a second plate. " + N(4) + "The plates were sealed, labeled, and kept upside down in a 37 °C <strong>incubator</strong> for 48 hours. " + N(5) + "Bacteria that landed on the agar grew into visible spots called colonies, and the class counted the colonies on each plate. " + N(6) + "The results are shown in the table. " + N(7) + "One student pointed out that each volunteer's hands may have carried different numbers of bacteria to begin with.</p>" +
        "<table><tr><th>Wash time (s)</th><th>Colonies before washing</th><th>Colonies after washing</th></tr><tr><td>5</td><td>140</td><td>96</td></tr><tr><td>10</td><td>132</td><td>61</td></tr><tr><td>20</td><td>145</td><td>22</td></tr><tr><td>40</td><td>138</td><td>9</td></tr></table>",
      claims: [
        {
          id: "iv",
          sol: "BIO.1.b",
          stem: "Which variable was deliberately changed by the class?",
          choices: [
            { letter: "A", text: "the number of colonies on each plate" },
            { letter: "B", text: "the length of time each volunteer washed" },
            { letter: "C", text: "the temperature of the incubator" },
            { letter: "D", text: "the kind of soap that was used" }
          ],
          correct: "B"
        },
        {
          id: "baseline",
          sol: "BIO.1.b",
          stem: "Why was each volunteer's hand printed on a plate before washing?",
          choices: [
            { letter: "A", text: "to sterilize the fingertips before the test" },
            { letter: "B", text: "to warm the agar before incubation" },
            { letter: "C", text: "to give a starting count for comparison" },
            { letter: "D", text: "to add extra bacteria to the second plate" }
          ],
          correct: "C"
        },
        {
          id: "fewest",
          sol: "BIO.1.c",
          stem: "According to the table, which wash time left the fewest colonies?",
          choices: [
            { letter: "A", text: "5 seconds" },
            { letter: "B", text: "10 seconds" },
            { letter: "C", text: "20 seconds" },
            { letter: "D", text: "40 seconds" }
          ],
          correct: "D"
        },
        {
          id: "conclude",
          sol: "BIO.1.d",
          stem: "Which conclusion is best supported by the colony counts?",
          choices: [
            { letter: "A", text: "Washing for 5 seconds removed most of the bacteria." },
            { letter: "B", text: "Longer washing removed a greater share of the bacteria." },
            { letter: "C", text: "Washing added bacteria to the hands of some volunteers." },
            { letter: "D", text: "The incubator killed the bacteria on the 40-second plate." }
          ],
          correct: "B"
        },
        {
          id: "concern",
          sol: "BIO.1.c",
          stem: "The concern raised in sentence 7 is important because —",
          choices: [
            { letter: "A", text: "differences between volunteers, not just wash time, could affect the result" },
            { letter: "B", text: "bacteria from different volunteers cannot grow on the same kind of agar" },
            { letter: "C", text: "the incubator was not large enough to hold all of the plates at once" },
            { letter: "D", text: "colony counts are always lower on the plate made before washing" }
          ],
          correct: "A"
        },
        {
          id: "term",
          sol: "BIO.1.b",
          stem: "In sentence 4, the incubator is used to —",
          choices: [
            { letter: "A", text: "keep the plates at a steady warm temperature so colonies grow" },
            { letter: "B", text: "kill any bacteria that were pressed onto the plates" },
            { letter: "C", text: "count the colonies on each plate automatically" },
            { letter: "D", text: "dry out the agar so that the plates can be stored" }
          ],
          correct: "A"
        }
      ]
    },
    {
      id: "inv-oyster-reef",
      family: "INV",
      title: "Three oyster reefs, three densities",
      kind: "Investigation · BIO.1",
      blurb: "Spat density, diver counts and a filtering model in a Chesapeake tidal creek.",
      level: 3,
      passage: "<p>" + N(1) + "Volunteers with a Chesapeake Bay restoration group built three oyster reefs in a tidal creek in 2021 by placing recycled shell on the bottom. " + N(2) + "Each reef received young oysters, called spat, at a different density: 100, 300, or 600 per square meter. " + N(3) + "Every summer, divers counted the live oysters in five 0.25 m² quadrats on each reef and scaled the counts to one square meter. " + N(4) + "The group also uses a simple <strong>model</strong> that treats each adult oyster as a filter cleaning about 50 liters of water per day. " + N(5) + "The table shows the average live oysters per square meter. " + N(6) + "A student noted that the 600 reef sits nearer the creek mouth, where the water is saltier and moves faster. " + N(7) + "The group wants to recommend one starting density for future reefs.</p>" +
        "<table><tr><th>Starting spat (per m²)</th><th>Live oysters 2022</th><th>Live oysters 2024</th></tr><tr><td>100</td><td>62</td><td>48</td></tr><tr><td>300</td><td>180</td><td>155</td></tr><tr><td>600</td><td>210</td><td>120</td></tr></table>",
      claims: [
        {
          id: "most",
          sol: "BIO.1.c",
          stem: "Which reef had the most live oysters per square meter in 2024?",
          choices: [
            { letter: "A", text: "the 100 reef" },
            { letter: "B", text: "the 300 reef" },
            { letter: "C", text: "the 600 reef" },
            { letter: "D", text: "all three were about equal" }
          ],
          correct: "B"
        },
        {
          id: "weak",
          sol: "BIO.1.b",
          stem: "Select TWO reasons the comparison among the three reefs is weaker than it could be.",
          choices: [
            { letter: "A", text: "Only one reef was built at each density, so nothing was replicated." },
            { letter: "B", text: "The divers counted oysters in quadrats instead of counting every one." },
            { letter: "C", text: "The 600 reef differs in location and water flow, not just density." },
            { letter: "D", text: "The counts were converted from quadrats to one square meter." }
          ],
          correct: ["A", "C"]
        },
        {
          id: "filter",
          sol: "BIO.1.e",
          stem: "Using the group's model, about how much water would one square meter of the 300 reef filter per day in 2024?",
          choices: [
            { letter: "A", text: "about 155 liters" },
            { letter: "B", text: "about 3,100 liters" },
            { letter: "C", text: "about 7,750 liters" },
            { letter: "D", text: "about 15,500 liters" }
          ],
          correct: "C"
        },
        {
          id: "six",
          sol: "BIO.1.d",
          stem: "Which conclusion about the 600 reef is best supported by the table?",
          choices: [
            { letter: "A", text: "It gained live oysters steadily between 2022 and 2024." },
            { letter: "B", text: "It had fewer live oysters than the 100 reef by 2024." },
            { letter: "C", text: "It held the most live oysters in both 2022 and 2024." },
            { letter: "D", text: "It lost the largest share of its oysters between 2022 and 2024." }
          ],
          correct: "D"
        },
        {
          id: "limit",
          sol: "BIO.1.e",
          stem: "Which statement describes a limitation of the filtering model?",
          choices: [
            { letter: "A", text: "It assumes every oyster is an adult filtering at the same steady rate." },
            { letter: "B", text: "It counts only the oysters that died between the two surveys." },
            { letter: "C", text: "It applies only to reefs that were built near the creek mouth." },
            { letter: "D", text: "It requires the divers to count every oyster on the reef." }
          ],
          correct: "A"
        },
        {
          id: "recommend",
          sol: "BIO.1.d",
          stem: "Based on all the evidence, which recommendation should the group make?",
          choices: [
            { letter: "A", text: "Use 600 spat per square meter, since that reef started with the most oysters." },
            { letter: "B", text: "Use 300 spat per square meter, while noting the differences in reef location." },
            { letter: "C", text: "Stop building reefs, since every reef lost oysters between 2022 and 2024." },
            { letter: "D", text: "Use 100 spat per square meter, since that reef lost the fewest oysters." }
          ],
          correct: "B"
        }
      ]
    },
    {
      id: "inv-daphnia-caffeine",
      family: "INV",
      title: "Daphnia heart rate and caffeine",
      kind: "Investigation · BIO.1",
      blurb: "Counting heartbeats through a see-through crustacean, with a warm lamp overhead.",
      level: 2,
      passage: "<p>" + N(1) + "<em>Daphnia</em>, a tiny freshwater crustacean, has a clear body, so its heart can be seen beating under a microscope. " + N(2) + "A student asked how caffeine affects the heart rate of <em>Daphnia</em>. " + N(3) + "She placed one animal on a slide in a drop of pond water, counted heartbeats for 15 seconds, and multiplied by four to get beats per minute. " + N(4) + "She then replaced the pond water with caffeine solutions of 0.1, 0.5, and 1.0 percent, waiting two minutes and counting again after each change. " + N(5) + "She repeated the procedure with four other animals. " + N(6) + "Her line graph shows average heart rate rising from about 180 beats per minute in pond water to about 260 at 1.0 percent caffeine, with the steepest rise between 0.1 and 0.5 percent. " + N(7) + "One animal's heart rate at 0.5 percent was far above the other four, and she marked it as an <strong>outlier</strong>. " + N(8) + "The lamp on the microscope warmed the slide during the trials.</p>",
      claims: [
        {
          id: "convert",
          sol: "BIO.1.b",
          stem: "Why did the student multiply the 15-second count by four?",
          choices: [
            { letter: "A", text: "to correct for the warming of the slide" },
            { letter: "B", text: "to convert the count to beats per minute" },
            { letter: "C", text: "to average the results of four animals" },
            { letter: "D", text: "to account for four caffeine concentrations" }
          ],
          correct: "B"
        },
        {
          id: "steepest",
          sol: "BIO.1.c",
          stem: "Between which two concentrations did the heart rate rise the fastest?",
          choices: [
            { letter: "A", text: "0.1 and 0.5 percent" },
            { letter: "B", text: "pond water and 0.1 percent" },
            { letter: "C", text: "0.5 and 1.0 percent" },
            { letter: "D", text: "the rise was the same at every step" }
          ],
          correct: "A"
        },
        {
          id: "outlier",
          sol: "BIO.1.c",
          stem: "In sentence 7, the outlier is —",
          choices: [
            { letter: "A", text: "the average of all five animals" },
            { letter: "B", text: "the heart rate measured with no caffeine" },
            { letter: "C", text: "a value far from the rest of the data" },
            { letter: "D", text: "the highest concentration tested" }
          ],
          correct: "C"
        },
        {
          id: "lamp",
          sol: "BIO.1.d",
          stem: "Which statement best explains why the warming lamp weakens the conclusion?",
          choices: [
            { letter: "A", text: "Warmth could raise the heart rate on its own, so caffeine may not be the only cause." },
            { letter: "B", text: "Warmth always slows the heart, so the caffeine effect was hidden by the lamp." },
            { letter: "C", text: "A warm slide makes the heart of Daphnia much harder to see clearly." },
            { letter: "D", text: "The heat from the lamp broke the caffeine down into other chemicals." }
          ],
          correct: "A"
        },
        {
          id: "fix",
          sol: "BIO.1.b",
          stem: "Which change would best address the problem described in sentence 8?",
          choices: [
            { letter: "A", text: "counting the heartbeats for a full 30 seconds instead of 15" },
            { letter: "B", text: "using a much stronger caffeine solution for the final trial" },
            { letter: "C", text: "testing a single animal many times instead of five animals" },
            { letter: "D", text: "keeping the slide at a steady temperature with a cool light" }
          ],
          correct: "D"
        },
        {
          id: "hypothesis",
          sol: "BIO.1.a",
          stem: "Which hypothesis was the student most likely testing?",
          choices: [
            { letter: "A", text: "If pond water is replaced, then Daphnia will stop moving." },
            { letter: "B", text: "If caffeine concentration increases, then Daphnia heart rate will increase." },
            { letter: "C", text: "If the lamp is turned on, then the slide will become warmer." },
            { letter: "D", text: "If more animals are tested, then the average heart rate will fall." }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- long ---------- */
    {
      id: "inv-trout-stream-model",
      family: "INV",
      title: "Modeling brook trout habitat",
      kind: "Investigation · BIO.1",
      blurb: "A watershed model, thirty temperature loggers and a two-degree warmer July.",
      level: 3,
      passage: "<p>" + N(1) + "Brook trout, Virginia's native freshwater trout, need cold, well-oxygenated streams and begin to die when water stays above about 21 °C for several days. " + N(2) + "A fisheries team built a computer <strong>model</strong> to predict how many stream kilometers in a Blue Ridge watershed will remain suitable for brook trout as summers warm. " + N(3) + "The model divides the watershed into 1 km segments and, for each segment, uses elevation, the amount of shade from streamside trees, and the average July air temperature to estimate July water temperature. " + N(4) + "A segment is counted as suitable if its estimated water temperature stays below 20 °C. " + N(5) + "To test the model, the team compared its estimates with temperature loggers placed in 30 segments during one July. " + N(6) + "The model's estimates were within 1 °C of the logger readings in 26 segments, but in 4 low-elevation segments it predicted temperatures 2 to 3 °C cooler than measured. " + N(7) + "Under a scenario in which July air temperature rises 2 °C, the model predicts suitable habitat shrinking from 88 km to 51 km, with almost all of the loss in segments below 600 m elevation. " + N(8) + "Under the same scenario but with streamside tree cover restored along every segment, the prediction is 69 km.</p>",
      claims: [
        {
          id: "inputs",
          sol: "BIO.1.e",
          stem: "What does the model use as inputs to estimate July water temperature?",
          choices: [
            { letter: "A", text: "elevation, streamside shade, and July air temperature" },
            { letter: "B", text: "the number of brook trout caught in each segment" },
            { letter: "C", text: "the logger readings from all 30 tested segments" },
            { letter: "D", text: "the amount of dissolved oxygen in each segment" }
          ],
          correct: "A"
        },
        {
          id: "loggers",
          sol: "BIO.1.b",
          stem: "What was the purpose of placing temperature loggers in 30 segments?",
          choices: [
            { letter: "A", text: "to raise the water temperature so the model could be tested" },
            { letter: "B", text: "to check the model's estimates against measured values" },
            { letter: "C", text: "to replace the model entirely with direct measurements" },
            { letter: "D", text: "to count the brook trout living in each segment" }
          ],
          correct: "B"
        },
        {
          id: "accuracy",
          sol: "BIO.1.c",
          stem: "Select TWO statements that the results in sentence 6 support.",
          choices: [
            { letter: "A", text: "The model was accurate in most of the tested segments." },
            { letter: "B", text: "The model ran too cool in some low-elevation segments." },
            { letter: "C", text: "The loggers were faulty in four of the segments." },
            { letter: "D", text: "The model was accurate in every segment that was tested." }
          ],
          correct: ["A", "B"]
        },
        {
          id: "scenario",
          sol: "BIO.1.d",
          stem: "Which conclusion about the warming scenario is best supported?",
          choices: [
            { letter: "A", text: "All brook trout habitat will be lost if air temperature rises 2 °C." },
            { letter: "B", text: "High-elevation segments will lose the most habitat." },
            { letter: "C", text: "Low-elevation segments are the most vulnerable to warming." },
            { letter: "D", text: "Restoring tree cover would fully prevent habitat loss." }
          ],
          correct: "C"
        },
        {
          id: "trees",
          sol: "BIO.1.e",
          stem: "Based on the model, restoring streamside trees would —",
          choices: [
            { letter: "A", text: "cool every segment enough to make the whole watershed suitable" },
            { letter: "B", text: "have no effect on the amount of suitable habitat" },
            { letter: "C", text: "raise the July air temperature by about 2 °C" },
            { letter: "D", text: "recover part, but not all, of the habitat lost to warming" }
          ],
          correct: "D"
        },
        {
          id: "caution",
          sol: "BIO.1.d",
          stem: "Given the error found in sentence 6, how should the team treat the model's prediction for low-elevation segments?",
          choices: [
            { letter: "A", text: "Discard the whole model, because any error makes its output useless." },
            { letter: "B", text: "Accept the prediction exactly, since most tested segments matched well." },
            { letter: "C", text: "Treat it with caution, since the model may overstate habitat by running cool." },
            { letter: "D", text: "Assume those segments are colder than the model says and safe for trout." }
          ],
          correct: "C"
        }
      ]
    },
    {
      id: "inv-elodea-lamp",
      family: "INV",
      title: "Elodea and the moving lamp",
      kind: "Investigation · BIO.1",
      blurb: "Bubble counts at four lamp distances, and a classmate who doubts the method.",
      level: 3,
      passage: "<p>" + N(1) + "Two lab partners investigated how light intensity affects the rate of photosynthesis in <em>Elodea</em>, a common aquarium plant. " + N(2) + "They placed a 10 cm sprig, cut end up, in a test tube of water containing a pinch of baking soda to supply carbon dioxide. " + N(3) + "A desk lamp was set 10, 20, 40, and 80 cm from the tube, and at each distance they waited three minutes and then counted the oxygen bubbles released from the cut stem in one minute. " + N(4) + "Each distance was tested three times with the same sprig, and the table shows the averages. " + N(5) + "Between trials the water warmed slightly, so they replaced it with fresh water at room temperature each time. " + N(6) + "The partners knew that doubling the distance from a small light cuts the intensity to about one quarter, so they used distance as a stand-in for <strong>light intensity</strong>. " + N(7) + "After the lab, a classmate argued that bubble counting is a poor measure because bubbles differ in size. " + N(8) + "The partners agreed and suggested collecting the gas in a graduated tube and measuring its volume instead. " + N(9) + "They wrote up the investigation for the school science fair.</p>" +
        "<table><tr><th>Lamp distance (cm)</th><th>Bubbles per minute (average)</th></tr><tr><td>10</td><td>38</td></tr><tr><td>20</td><td>21</td></tr><tr><td>40</td><td>9</td></tr><tr><td>80</td><td>2</td></tr></table>",
      claims: [
        {
          id: "water",
          sol: "BIO.1.b",
          stem: "Why did the partners replace the water between trials?",
          choices: [
            { letter: "A", text: "to add a fresh supply of carbon dioxide to the test tube" },
            { letter: "B", text: "to keep temperature from becoming a second changing variable" },
            { letter: "C", text: "to make the oxygen bubbles easier to see and to count" },
            { letter: "D", text: "to rinse any leftover baking soda off the cut stem" }
          ],
          correct: "B"
        },
        {
          id: "trend",
          sol: "BIO.1.c",
          stem: "Which statement describes the trend in the table?",
          choices: [
            { letter: "A", text: "Bubble rate roughly halved each time the distance doubled." },
            { letter: "B", text: "Bubble rate increased as the lamp was moved farther away." },
            { letter: "C", text: "Bubble rate stayed about the same at all four distances." },
            { letter: "D", text: "Bubble rate roughly doubled each time the distance doubled." }
          ],
          correct: "A"
        },
        {
          id: "standin",
          sol: "BIO.1.e",
          stem: "The partners used lamp distance to stand in for light intensity. Which statement is a limit of this approach?",
          choices: [
            { letter: "A", text: "Distance from a lamp has no relationship to light intensity." },
            { letter: "B", text: "The lamp also gives off heat, so distance changes temperature as well as light." },
            { letter: "C", text: "Doubling the distance from the lamp doubles the light intensity." },
            { letter: "D", text: "The sprig cannot respond to changes in the position of the lamp." }
          ],
          correct: "B"
        },
        {
          id: "critique",
          sol: "BIO.1.d",
          stem: "Which statement best evaluates the classmate's criticism in sentence 7?",
          choices: [
            { letter: "A", text: "It is not valid, because all oxygen bubbles are exactly the same size." },
            { letter: "B", text: "It is not valid, because oxygen bubbles cannot be seen in water." },
            { letter: "C", text: "It is valid, because counting bubbles measures number, not volume of gas." },
            { letter: "D", text: "It is valid, because photosynthesis does not release any oxygen." }
          ],
          correct: "C"
        },
        {
          id: "writeup",
          sol: "BIO.1.f",
          stem: "Which item belongs in the science fair write-up so that others can repeat the investigation?",
          choices: [
            { letter: "A", text: "the exact distances, timing, and water conditions used" },
            { letter: "B", text: "a list of prizes won at past science fairs" },
            { letter: "C", text: "the partners' opinions about aquarium plants" },
            { letter: "D", text: "the names of students who watched the trials" }
          ],
          correct: "A"
        },
        {
          id: "followup",
          sol: "BIO.1.a",
          stem: "Which follow-up investigation would best test whether temperature, not light, caused the change in bubble rate?",
          choices: [
            { letter: "A", text: "repeat the trials with a different species of plant" },
            { letter: "B", text: "count the bubbles for five minutes instead of one" },
            { letter: "C", text: "use a brighter lamp at the same four distances" },
            { letter: "D", text: "keep the lamp at a fixed distance and vary the water temperature" }
          ],
          correct: "D"
        }
      ]
    }
  ];

  for (var i = 0; i < PACKS.length; i++) P.push(PACKS[i]);
})(typeof window !== "undefined" ? window : global);
