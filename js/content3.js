/* SOL Lab — Biochemistry (BIO.2.a water, BIO.2.b macromolecules, BIO.2.c enzymes, BIO.2.e photosynthesis & respiration). Original text only. */
(function (global) {
  var P = global.HEIST_PACKS;
  if (!P || !P.push) return;
  var N = function (i) { return '<span class="n">(' + i + ')</span> '; };   // numbered sentence

  var PACKS = [

    /* ---------- WATER ---------- */
    {
      id: "chem-penny-drops",
      family: "CHEM",
      title: "Drops on a Penny",
      kind: "Biochemistry · BIO.2",
      blurb: "Plain water versus soapy water on a penny, and what hydrogen bonds have to do with it.",
      level: 1,
      passage: "<p>" + N(1) + "A student added water drop by drop to a clean penny until it spilled over. " + N(2) + "The water formed a dome because of <strong>cohesion</strong>, the attraction between water molecules through hydrogen bonds. " + N(3) + "She then repeated the test with soapy water, which weakens those bonds. " + N(4) + "Each liquid was tested three times and averaged. " + N(5) + "She also saw water cling to the dropper tip, an example of <strong>adhesion</strong>.</p>" +
        "<table><tr><th>Liquid</th><th>Average drops held</th></tr><tr><td>Plain water</td><td>31</td></tr><tr><td>Soapy water</td><td>14</td></tr></table>",
      claims: [
        {
          id: "drops-trend",
          sol: "BIO.2.a",
          stem: "Which conclusion is best supported by the table?",
          choices: [
            { letter: "A", text: "Soap makes water molecules heavier, so fewer drops fit on the penny." },
            { letter: "B", text: "Weakening the hydrogen bonds lowered the number of drops the penny held." },
            { letter: "C", text: "Plain water is less polar than soapy water, so it forms a taller dome." },
            { letter: "D", text: "The penny absorbed more of the soapy water than of the plain water." }
          ],
          correct: "B"
        },
        {
          id: "cohesion-vocab",
          sol: "BIO.2.a",
          stem: "In sentence 2, cohesion refers to water molecules —",
          choices: [
            { letter: "A", text: "sticking to the metal surface of the penny" },
            { letter: "B", text: "dissolving the soap that was added to them" },
            { letter: "C", text: "attracting one another and holding together" },
            { letter: "D", text: "changing temperature more slowly than metal" }
          ],
          correct: "C"
        },
        {
          id: "polarity",
          sol: "BIO.2.a",
          stem: "Which statement best explains why water molecules form hydrogen bonds with each other?",
          choices: [
            { letter: "A", text: "The oxygen end of each molecule is slightly negative and the hydrogen ends are slightly positive." },
            { letter: "B", text: "Hydrogen and oxygen share their electrons equally, so the molecule has no charged ends." },
            { letter: "C", text: "Water molecules carry no charge at all, so they slide freely past one another." },
            { letter: "D", text: "Water is made of separate ions that pull on each other with strong ionic bonds." }
          ],
          correct: "A"
        },
        {
          id: "iv",
          sol: "BIO.2.a",
          stem: "The independent variable in this investigation is —",
          choices: [
            { letter: "A", text: "the number of drops the penny held" },
            { letter: "B", text: "the size of the penny used" },
            { letter: "C", text: "the number of trials per liquid" },
            { letter: "D", text: "the type of liquid added to the penny" }
          ],
          correct: "D"
        },
        {
          id: "adhesion-vocab",
          sol: "BIO.2.a",
          stem: "In sentence 5, adhesion describes water molecules being attracted to —",
          choices: [
            { letter: "A", text: "other water molecules nearby" },
            { letter: "B", text: "a different substance, such as the plastic tip" },
            { letter: "C", text: "the soap molecules mixed into them" },
            { letter: "D", text: "the warm air above the penny" }
          ],
          correct: "B"
        }
      ]
    },

    {
      id: "chem-limestone-stream",
      family: "CHEM",
      title: "Two Shenandoah Streams",
      kind: "Biochemistry · BIO.2",
      blurb: "A limestone stream and a sandstone stream get the same acid drops but very different pH readings.",
      level: 2,
      passage: "<p>" + N(1) + "A field team compared two small streams in the Shenandoah Valley after a rainstorm. " + N(2) + "Cedar Run flows over limestone, which dissolves slowly and releases bicarbonate ions; Laurel Run flows over sandstone and carries very few dissolved ions. " + N(3) + "Water is an excellent <strong>solvent</strong> because its polar molecules pull ions away from a crystal and surround them. " + N(4) + "Back in the lab, students added dilute acid one drop at a time to 100 mL samples from each stream and recorded the pH.</p>" +
        "<table><tr><th>Drops of acid</th><th>Cedar Run pH</th><th>Laurel Run pH</th></tr><tr><td>0</td><td>7.8</td><td>6.9</td></tr><tr><td>5</td><td>7.7</td><td>5.6</td></tr><tr><td>10</td><td>7.5</td><td>4.4</td></tr><tr><td>20</td><td>7.2</td><td>3.6</td></tr></table>" +
        "<p>" + N(5) + "A solution that resists a change in pH when acid or base is added is called a <strong>buffer</strong>. " + N(6) + "The team also logged temperatures over one summer day: the air ranged from 17 °C to 33 °C, while Cedar Run ranged only from 18 °C to 21 °C. " + N(7) + "Brook trout, which need cool water and a pH near neutral, were caught only in Cedar Run.</p>",
      claims: [
        {
          id: "buffer-trend",
          sol: "BIO.2.a",
          stem: "Which conclusion do the pH readings in the table best support?",
          choices: [
            { letter: "A", text: "Laurel Run contains more dissolved limestone than Cedar Run does." },
            { letter: "B", text: "Cedar Run water is buffered, so its pH changed little as acid was added." },
            { letter: "C", text: "Adding acid raised the pH of both streams by about the same amount." },
            { letter: "D", text: "Both streams resisted the acid equally well for the first five drops." }
          ],
          correct: "B"
        },
        {
          id: "solvent-vocab",
          sol: "BIO.2.a",
          stem: "In sentence 3, water acts as a solvent when it —",
          choices: [
            { letter: "A", text: "freezes into a layer of ice crystals on the stream" },
            { letter: "B", text: "forms rounded drops on the surface of a leaf" },
            { letter: "C", text: "separates and surrounds the ions of a dissolving mineral" },
            { letter: "D", text: "absorbs a large amount of heat without warming much" }
          ],
          correct: "C"
        },
        {
          id: "oxygen-use",
          sol: "BIO.2.e",
          stem: "Cool water holds more dissolved oxygen than warm water. Brook trout need that oxygen in order to —",
          choices: [
            { letter: "A", text: "build glucose inside their chloroplasts" },
            { letter: "B", text: "dissolve minerals in their blood" },
            { letter: "C", text: "release energy from food in their mitochondria" },
            { letter: "D", text: "keep their body temperature above the water's" }
          ],
          correct: "C"
        },
        {
          id: "specific-heat",
          sol: "BIO.2.a",
          stem: "Which property of water best explains the temperature data in sentence 6?",
          choices: [
            { letter: "A", text: "Water's cohesion holds the warmest layer at the surface of the stream." },
            { letter: "B", text: "Water's low density lets the warm water float downstream and away." },
            { letter: "C", text: "Water evaporates quickly, releasing all of its stored heat at once." },
            { letter: "D", text: "Water's high specific heat means it absorbs a lot of heat before it warms." }
          ],
          correct: "D"
        },
        {
          id: "trout-enzymes",
          sol: "BIO.2.c",
          stem: "Which statement best explains why brook trout survive only in water that stays cool and near pH 7?",
          choices: [
            { letter: "A", text: "The enzymes in their cells keep their shape only within a narrow range of temperature and pH." },
            { letter: "B", text: "Their cells contain no buffers, so any acid in the water enters their blood directly." },
            { letter: "C", text: "Warm water always contains more acid than cool water, which burns their gills." },
            { letter: "D", text: "Their scales dissolve in water that is even slightly acidic or slightly warm." }
          ],
          correct: "A"
        },
        {
          id: "acid-rain",
          sol: "BIO.2.a",
          stem: "Based on the data, which is the best prediction if acid rain fell on both streams for several years?",
          choices: [
            { letter: "A", text: "Laurel Run would become too acidic for brook trout much sooner than Cedar Run." },
            { letter: "B", text: "Cedar Run would drop below pH 4 first because limestone dissolves so easily." },
            { letter: "C", text: "Both streams would keep their present pH because water is always neutral." },
            { letter: "D", text: "The trout would move to Laurel Run because acid makes water cooler." }
          ],
          correct: "A"
        }
      ]
    },

    /* ---------- MACROMOLECULES ---------- */
    {
      id: "chem-benedicts-drinks",
      family: "CHEM",
      title: "Sugar in the Drinks",
      kind: "Biochemistry · BIO.2",
      blurb: "Four drinks, a hot-water bath and Benedict's solution: which one turns brick red?",
      level: 1,
      passage: "<p>" + N(1) + "Students tested four drinks for simple sugars with <strong>Benedict's solution</strong>, which changes from blue to green, orange or brick red as more sugar is present. " + N(2) + "Each sample was heated in a hot-water bath for five minutes. " + N(3) + "A tube of distilled water was heated alongside the drinks. " + N(4) + "The class wanted to know which drink contained the most monosaccharide.</p>" +
        "<table><tr><th>Sample</th><th>Colour after heating</th></tr><tr><td>Distilled water</td><td>blue</td></tr><tr><td>Diet soda</td><td>blue</td></tr><tr><td>Apple juice</td><td>brick red</td></tr><tr><td>Sports drink</td><td>orange</td></tr></table>",
      claims: [
        {
          id: "most-sugar",
          sol: "BIO.2.b",
          stem: "According to the table, which drink contained the most simple sugar?",
          choices: [
            { letter: "A", text: "Sports drink" },
            { letter: "B", text: "Apple juice" },
            { letter: "C", text: "Diet soda" },
            { letter: "D", text: "Distilled water" }
          ],
          correct: "B"
        },
        {
          id: "water-control",
          sol: "BIO.2.b",
          stem: "The tube of distilled water in sentence 3 served as —",
          choices: [
            { letter: "A", text: "a negative control showing the colour when no sugar is present" },
            { letter: "B", text: "a positive control showing the strongest colour change possible" },
            { letter: "C", text: "the independent variable that the students changed on purpose" },
            { letter: "D", text: "a repeated trial of the apple juice to check the first result" }
          ],
          correct: "A"
        },
        {
          id: "benedict-vocab",
          sol: "BIO.2.b",
          stem: "In sentence 1, Benedict's solution is described as an indicator for —",
          choices: [
            { letter: "A", text: "proteins such as those in milk" },
            { letter: "B", text: "lipids such as those in cooking oil" },
            { letter: "C", text: "starches such as those in bread" },
            { letter: "D", text: "simple sugars such as glucose" }
          ],
          correct: "D"
        },
        {
          id: "diet-soda",
          sol: "BIO.2.b",
          stem: "The diet soda stayed blue. Which statement best explains this result?",
          choices: [
            { letter: "A", text: "Its tube was not heated long enough for the colour to change." },
            { letter: "B", text: "Benedict's solution only reacts with solid foods, not liquids." },
            { letter: "C", text: "Its sweetener is not a simple sugar that the indicator detects." },
            { letter: "D", text: "The bubbles in the soda blocked the indicator from reacting." }
          ],
          correct: "C"
        },
        {
          id: "monomer",
          sol: "BIO.2.b",
          stem: "Glucose, the sugar found in apple juice, is the monomer of which group of macromolecules?",
          choices: [
            { letter: "A", text: "Lipids" },
            { letter: "B", text: "Proteins" },
            { letter: "C", text: "Carbohydrates" },
            { letter: "D", text: "Nucleic acids" }
          ],
          correct: "C"
        }
      ]
    },

    {
      id: "chem-brown-bag-tests",
      family: "CHEM",
      title: "Brown Bag, Iodine and Biuret",
      kind: "Biochemistry · BIO.2",
      blurb: "Peanut butter, a cracker, egg white and butter go through three food tests.",
      level: 1,
      passage: "<p>" + N(1) + "A class tested four foods for three kinds of macromolecule. " + N(2) + "A drop of each food was rubbed on a <strong>brown paper bag</strong>; a spot that stays translucent after drying shows lipids. " + N(3) + "<strong>Iodine</strong> turns from amber to blue-black when starch is present, and <strong>Biuret</strong> solution turns from blue to violet when protein is present. " + N(4) + "A plus sign in the table means a positive test. " + N(5) + "Every test was also run on distilled water, which gave a negative result each time.</p>" +
        "<table><tr><th>Food</th><th>Bag</th><th>Iodine</th><th>Biuret</th></tr><tr><td>Peanut butter</td><td>+</td><td>&minus;</td><td>+</td></tr><tr><td>Cracker</td><td>&minus;</td><td>+</td><td>&minus;</td></tr><tr><td>Egg white</td><td>&minus;</td><td>&minus;</td><td>+</td></tr><tr><td>Butter</td><td>+</td><td>&minus;</td><td>&minus;</td></tr></table>" +
        "<p>" + N(6) + "When one student stirred butter into a glass of water, it floated in blobs and never dissolved. " + N(7) + "Another noticed that the cracker tasted sweeter the longer she chewed it.</p>",
      claims: [
        {
          id: "lipid-protein",
          sol: "BIO.2.b",
          stem: "Which food tested positive for both lipid and protein?",
          choices: [
            { letter: "A", text: "The cracker" },
            { letter: "B", text: "The egg white" },
            { letter: "C", text: "The peanut butter" },
            { letter: "D", text: "The butter" }
          ],
          correct: "C"
        },
        {
          id: "biuret-vocab",
          sol: "BIO.2.b",
          stem: "In sentence 3, a violet colour with Biuret solution shows the presence of —",
          choices: [
            { letter: "A", text: "amino acids joined into polypeptide chains" },
            { letter: "B", text: "glucose units joined into long chains" },
            { letter: "C", text: "fatty acids attached to a glycerol molecule" },
            { letter: "D", text: "nucleotides joined into a double strand" }
          ],
          correct: "A"
        },
        {
          id: "table-conclusion",
          sol: "BIO.2.b",
          stem: "Which conclusion is best supported by the results in the table?",
          choices: [
            { letter: "A", text: "Butter contains protein because it is made from milk." },
            { letter: "B", text: "The cracker's main macromolecule is a polysaccharide." },
            { letter: "C", text: "Egg white contains lipid because it feels slippery." },
            { letter: "D", text: "Peanut butter contains no carbohydrate of any kind." }
          ],
          correct: "B"
        },
        {
          id: "water-tests",
          sol: "BIO.2.b",
          stem: "The distilled water tests in sentence 5 were included to —",
          choices: [
            { letter: "A", text: "show what a strong positive result looks like for each test" },
            { letter: "B", text: "dissolve each food sample before it was tested" },
            { letter: "C", text: "measure how much of each macromolecule each food contained" },
            { letter: "D", text: "confirm the indicators change only when the macromolecule is present" }
          ],
          correct: "D"
        },
        {
          id: "butter-water",
          sol: "BIO.2.a",
          stem: "Which statement best explains the observation in sentence 6?",
          choices: [
            { letter: "A", text: "Lipids are nonpolar, so polar water molecules cannot pull them apart and surround them." },
            { letter: "B", text: "Butter is denser than water, so it stays together instead of spreading out." },
            { letter: "C", text: "Water is nonpolar and butter is polar, so the two repel each other." },
            { letter: "D", text: "Butter contains protein, and proteins never mix with water." }
          ],
          correct: "A"
        },
        {
          id: "sweet-cracker",
          sol: "BIO.2.c",
          stem: "Which statement best explains the observation in sentence 7?",
          choices: [
            { letter: "A", text: "Chewing warms the cracker, which turns its lipids into sugar." },
            { letter: "B", text: "An enzyme in saliva breaks the starch into smaller sugars that taste sweet." },
            { letter: "C", text: "Saliva contains sugar that soaks into the cracker over time." },
            { letter: "D", text: "The cracker's protein is converted to glucose by the teeth." }
          ],
          correct: "B"
        }
      ]
    },

    {
      id: "chem-lunch-molecules",
      family: "CHEM",
      title: "Tracing a Lunch",
      kind: "Biochemistry · BIO.2",
      blurb: "A peanut butter sandwich, an apple and milk are followed from polymer to monomer and back again.",
      level: 3,
      passage: "<p>" + N(1) + "A student ate a lunch of a peanut butter sandwich made with Virginia peanuts, an apple and a glass of milk, then traced what happened to each macromolecule in a lab write-up. " + N(2) + "The bread's starch is a <strong>polymer</strong> of glucose; in the mouth and small intestine, the enzyme amylase breaks the bonds between glucose units by <strong>hydrolysis</strong>, a reaction that adds a water molecule at each break. " + N(3) + "The peanut butter is rich in lipids and protein. " + N(4) + "Proteins are chains of amino acids folded into a specific three-dimensional shape, and that shape determines the protein's function, whether it is an enzyme, a muscle fiber or an antibody. " + N(5) + "Once absorbed, amino acids are rebuilt into new proteins by <strong>dehydration synthesis</strong>, which removes a water molecule as each bond forms. " + N(6) + "To check the lunch's contents, the student ran food tests on a sample of each item.</p>" +
        "<table><tr><th>Sample</th><th>Iodine</th><th>Biuret</th><th>Benedict's</th></tr><tr><td>Bread</td><td>blue-black</td><td>blue</td><td>blue</td></tr><tr><td>Peanut butter</td><td>amber</td><td>violet</td><td>blue</td></tr><tr><td>Apple</td><td>amber</td><td>blue</td><td>orange</td></tr><tr><td>Milk</td><td>amber</td><td>violet</td><td>green</td></tr></table>" +
        "<p>" + N(7) + "She noted that milk gave a green Benedict's result, a weaker positive than the apple's orange. " + N(8) + "Her teacher added that the nucleic acids in every cell of the food, DNA and RNA, are polymers of nucleotides but are present in amounts far too small for a classroom test to detect.</p>",
      claims: [
        {
          id: "hydrolysis-vocab",
          sol: "BIO.2.b",
          stem: "In sentence 2, hydrolysis is a reaction that —",
          choices: [
            { letter: "A", text: "removes water to join monomers into a polymer" },
            { letter: "B", text: "adds water to split a polymer into its monomers" },
            { letter: "C", text: "uses light energy to build glucose from carbon dioxide" },
            { letter: "D", text: "releases carbon dioxide as glucose is broken down" }
          ],
          correct: "B"
        },
        {
          id: "glucose-fate",
          sol: "BIO.2.e",
          stem: "After the glucose from the bread is absorbed, the student's cells use it mainly to —",
          choices: [
            { letter: "A", text: "build starch for long-term storage in the muscles" },
            { letter: "B", text: "capture light energy inside chloroplasts" },
            { letter: "C", text: "release energy as ATP through cellular respiration" },
            { letter: "D", text: "form the active sites of newly made enzymes" }
          ],
          correct: "C"
        },
        {
          id: "unfolded-enzyme",
          sol: "BIO.2.c",
          stem: "Based on sentence 4, what would most likely happen to an enzyme if its chain of amino acids unfolded?",
          choices: [
            { letter: "A", text: "It would work faster because more of the chain would be exposed." },
            { letter: "B", text: "It would keep working because its amino acid sequence is unchanged." },
            { letter: "C", text: "It would become a different kind of macromolecule, such as a lipid." },
            { letter: "D", text: "It would lose its function because its shape no longer matches its substrate." }
          ],
          correct: "D"
        },
        {
          id: "dehydration",
          sol: "BIO.2.b",
          stem: "When the body builds a muscle protein from absorbed amino acids, each new bond that forms —",
          choices: [
            { letter: "A", text: "requires a water molecule to be added" },
            { letter: "B", text: "releases a water molecule" },
            { letter: "C", text: "releases a glucose molecule" },
            { letter: "D", text: "forms between two glucose units" }
          ],
          correct: "B"
        },
        {
          id: "lunch-conclusion",
          sol: "BIO.2.b",
          stem: "Which conclusion is best supported by the food-test results?",
          choices: [
            { letter: "A", text: "The apple contains more simple sugar than the milk." },
            { letter: "B", text: "The bread contains no carbohydrate of any kind." },
            { letter: "C", text: "The milk contains lipid but no protein." },
            { letter: "D", text: "The peanut butter contains a large amount of starch." }
          ],
          correct: "A"
        },
        {
          id: "monomer-pairs",
          sol: "BIO.2.b",
          stem: "Select TWO statements that correctly pair a macromolecule with its monomer.",
          choices: [
            { letter: "A", text: "Starch is built from glucose." },
            { letter: "B", text: "Protein is built from fatty acids." },
            { letter: "C", text: "DNA is built from nucleotides." },
            { letter: "D", text: "Lipid is built from amino acids." }
          ],
          correct: ["A", "C"]
        }
      ]
    },

    /* ---------- ENZYMES ---------- */
    {
      id: "chem-catalase-foam",
      family: "CHEM",
      title: "Potato Catalase and Peroxide",
      kind: "Biochemistry · BIO.2",
      blurb: "Foam heights from blended potato at six temperatures show where catalase works best.",
      level: 2,
      passage: "<p>" + N(1) + "Catalase is an <strong>enzyme</strong> in potato and liver cells that breaks hydrogen peroxide, a toxic waste of metabolism, into water and oxygen gas. " + N(2) + "A lab group blended raw potato with water, poured 5 mL of the mixture into six tubes and held each tube at a different temperature for ten minutes. " + N(3) + "They then added 5 mL of 3% hydrogen peroxide to each tube and measured the height of the oxygen foam after one minute. " + N(4) + "A seventh tube held peroxide and water with no potato and made no foam at any temperature.</p>" +
        "<table><tr><th>Temperature (°C)</th><th>Foam height (mm)</th></tr><tr><td>5</td><td>9</td></tr><tr><td>20</td><td>24</td></tr><tr><td>35</td><td>41</td></tr><tr><td>50</td><td>28</td></tr><tr><td>65</td><td>4</td></tr><tr><td>80</td><td>0</td></tr></table>",
      claims: [
        {
          id: "foam-trend",
          sol: "BIO.2.c",
          stem: "Which conclusion do the foam heights best support?",
          choices: [
            { letter: "A", text: "Catalase works fastest near 35 °C and stops working at high temperatures." },
            { letter: "B", text: "Catalase activity keeps rising as the temperature of the tube rises." },
            { letter: "C", text: "Hydrogen peroxide breaks down on its own faster when the tube is warm." },
            { letter: "D", text: "Cold temperatures permanently destroy the catalase in potato cells." }
          ],
          correct: "A"
        },
        {
          id: "enzyme-vocab",
          sol: "BIO.2.c",
          stem: "In sentence 1, an enzyme is best described as —",
          choices: [
            { letter: "A", text: "a lipid that stores energy for the cell to use later" },
            { letter: "B", text: "a protein that speeds up a specific reaction without being used up" },
            { letter: "C", text: "a sugar that is broken down to release oxygen gas" },
            { letter: "D", text: "a waste product that the cell must remove quickly" }
          ],
          correct: "B"
        },
        {
          id: "seventh-tube",
          sol: "BIO.2.c",
          stem: "The seventh tube described in sentence 4 shows that —",
          choices: [
            { letter: "A", text: "potato cells produce hydrogen peroxide of their own" },
            { letter: "B", text: "water alone is able to break down hydrogen peroxide" },
            { letter: "C", text: "the foam depends on the enzyme, not on peroxide breaking down by itself" },
            { letter: "D", text: "temperature has no effect on how fast the reaction runs" }
          ],
          correct: "C"
        },
        {
          id: "eighty-degrees",
          sol: "BIO.2.c",
          stem: "Which statement best explains the result at 80 °C?",
          choices: [
            { letter: "A", text: "The peroxide evaporated from the tube before it could react." },
            { letter: "B", text: "The heat changed the shape of the active site, so the substrate no longer fit." },
            { letter: "C", text: "The enzyme was used up during the ten-minute warm-up period." },
            { letter: "D", text: "The hot potato mixture absorbed the oxygen gas as it formed." }
          ],
          correct: "B"
        },
        {
          id: "catalase-class",
          sol: "BIO.2.b",
          stem: "Catalase is made of a folded chain of amino acids. It belongs to which group of macromolecules?",
          choices: [
            { letter: "A", text: "Carbohydrates, whose chains store quick energy" },
            { letter: "B", text: "Lipids, whose chains form the cell membrane" },
            { letter: "C", text: "Nucleic acids, whose chains carry the genetic code" },
            { letter: "D", text: "Proteins, whose folded shape forms the active site" }
          ],
          correct: "D"
        },
        {
          id: "oxygen-fate",
          sol: "BIO.2.e",
          stem: "The oxygen gas trapped in the foam is the same gas that living potato cells use to —",
          choices: [
            { letter: "A", text: "release energy from glucose in their mitochondria" },
            { letter: "B", text: "capture light energy in their chloroplasts" },
            { letter: "C", text: "link glucose units together into starch" },
            { letter: "D", text: "dissolve hydrogen peroxide in their cytoplasm" }
          ],
          correct: "A"
        }
      ]
    },

    {
      id: "chem-lactase-ph",
      family: "CHEM",
      title: "Lactase Tablets and pH",
      kind: "Biochemistry · BIO.2",
      blurb: "A crushed lactase tablet meets milk at six pH values; glucose strips tell how much lactose was split.",
      level: 3,
      passage: "<p>" + N(1) + "Lactose, the sugar in milk, is a disaccharide that the enzyme <strong>lactase</strong> splits into glucose and galactose. " + N(2) + "People who make little lactase cannot digest milk well, and chewable lactase tablets are sold to help. " + N(3) + "A student crushed one tablet, dissolved it in water and added equal amounts to tubes of milk that had been adjusted to different pH values with dilute acid or base. " + N(4) + "After ten minutes at 37 °C she dipped a glucose test strip into each tube. " + N(5) + "The strips respond only to glucose, not to lactose, so a reading near zero means almost no lactose was broken down. " + N(6) + "A tube of milk at pH 7 with no enzyme also read zero.</p>" +
        "<table><tr><th>pH of milk</th><th>Glucose (mg/dL)</th></tr><tr><td>2</td><td>45</td></tr><tr><td>4</td><td>210</td></tr><tr><td>6</td><td>480</td></tr><tr><td>7</td><td>520</td></tr><tr><td>9</td><td>300</td></tr><tr><td>11</td><td>30</td></tr></table>" +
        "<p>" + N(7) + "Human lactase works in the small intestine, where the pH is near 6, while pepsin, a stomach enzyme, works best near pH 2.</p>",
      claims: [
        {
          id: "ph-trend",
          sol: "BIO.2.c",
          stem: "Which conclusion do the glucose readings best support?",
          choices: [
            { letter: "A", text: "Lactase works at every pH but is fastest in strongly acidic milk." },
            { letter: "B", text: "Lactase activity is highest near neutral pH and falls off in strong acid or base." },
            { letter: "C", text: "Lactase is permanently destroyed at any pH below 7." },
            { letter: "D", text: "Glucose forms in milk on its own whenever the pH is changed." }
          ],
          correct: "B"
        },
        {
          id: "lactase-vocab",
          sol: "BIO.2.c",
          stem: "In sentence 1, lactase is —",
          choices: [
            { letter: "A", text: "the substrate that is broken down in the reaction" },
            { letter: "B", text: "one of the products released by the reaction" },
            { letter: "C", text: "the enzyme that catalyzes the reaction" },
            { letter: "D", text: "the monosaccharide that the strips detect" }
          ],
          correct: "C"
        },
        {
          id: "ph-ions",
          sol: "BIO.2.a",
          stem: "Compared with the tube at pH 6, the tube of milk at pH 2 contains —",
          choices: [
            { letter: "A", text: "fewer hydrogen ions and is more basic" },
            { letter: "B", text: "fewer hydrogen ions and is more acidic" },
            { letter: "C", text: "more hydrogen ions and is more basic" },
            { letter: "D", text: "more hydrogen ions and is more acidic" }
          ],
          correct: "D"
        },
        {
          id: "ph-eleven",
          sol: "BIO.2.c",
          stem: "Which statement best explains the low reading at pH 11?",
          choices: [
            { letter: "A", text: "The strongly basic milk changed the shape of the enzyme's active site, so lactose no longer fit." },
            { letter: "B", text: "The base broke the lactose apart into glucose before the enzyme could reach it." },
            { letter: "C", text: "At high pH the glucose that formed was converted back into lactose." },
            { letter: "D", text: "The crushed tablet dissolved too slowly in the basic milk to be measured." }
          ],
          correct: "A"
        },
        {
          id: "stomach-claim",
          sol: "BIO.2.c",
          stem: "A classmate claims that swallowing a lactase tablet with milk is useless because the stomach is at pH 2. Which statement best evaluates this claim using the data and sentence 7?",
          choices: [
            { letter: "A", text: "The claim ignores that the enzyme also reaches the small intestine, where the pH is near its optimum." },
            { letter: "B", text: "The claim is correct because the data show that no glucose at all forms at pH 2." },
            { letter: "C", text: "The claim is correct because an enzyme is used up after it catalyzes a single reaction." },
            { letter: "D", text: "The claim ignores that milk neutralizes stomach acid so the tablet works at pH 7." }
          ],
          correct: "A"
        },
        {
          id: "reaction-type",
          sol: "BIO.2.b",
          stem: "The reaction that lactase catalyzes is best described as —",
          choices: [
            { letter: "A", text: "dehydration synthesis, which removes water to join two sugars" },
            { letter: "B", text: "hydrolysis, which adds water to split a disaccharide" },
            { letter: "C", text: "fermentation, which converts a sugar into alcohol" },
            { letter: "D", text: "denaturation, which unfolds the sugar molecule" }
          ],
          correct: "B"
        }
      ]
    },

    {
      id: "chem-amylase-model",
      family: "CHEM",
      title: "Foam Enzymes and Real Amylase",
      kind: "Biochemistry · BIO.2",
      blurb: "A foam-shape model of enzyme action, then real amylase timed against five starch concentrations.",
      level: 3,
      passage: "<p>" + N(1) + "A biology class built a model of enzyme action out of foam shapes. " + N(2) + "Each enzyme piece had a notch called the <strong>active site</strong> that matched only one substrate shape, and students timed how long it took to \"react\" by pressing a two-piece substrate into the notch until it snapped apart. " + N(3) + "The teacher explained that in a real cell the enzyme lowers the <strong>activation energy</strong>, the energy needed to start a reaction, and is released unchanged to be used again. " + N(4) + "To connect the model to real data, the class then measured amylase, an enzyme in saliva that breaks starch into maltose. " + N(5) + "They mixed 1 mL of diluted saliva with starch solutions of five concentrations at 37 °C and used iodine to find the time until the starch disappeared. " + N(6) + "A shorter time means a faster reaction.</p>" +
        "<table><tr><th>Starch concentration (%)</th><th>Time to clear (s)</th></tr><tr><td>0.5</td><td>190</td></tr><tr><td>1.0</td><td>96</td></tr><tr><td>2.0</td><td>50</td></tr><tr><td>4.0</td><td>32</td></tr><tr><td>8.0</td><td>30</td></tr></table>" +
        "<p>" + N(7) + "One student noted that doubling the starch from 4% to 8% barely changed the time. " + N(8) + "Another predicted that adding a few drops of vinegar to the 2% tube would make the reaction faster because \"acid dissolves things.\"</p>",
      claims: [
        {
          id: "active-site-vocab",
          sol: "BIO.2.c",
          stem: "In sentence 2, the active site is —",
          choices: [
            { letter: "A", text: "the region of the enzyme where the substrate binds" },
            { letter: "B", text: "the product released when the substrate breaks apart" },
            { letter: "C", text: "the energy that is needed to start the reaction" },
            { letter: "D", text: "the part of the substrate that is broken in two" }
          ],
          correct: "A"
        },
        {
          id: "starch-trend",
          sol: "BIO.2.c",
          stem: "Which conclusion do the clearing times best support?",
          choices: [
            { letter: "A", text: "The reaction rate doubles every time the starch concentration is doubled." },
            { letter: "B", text: "High starch concentrations denature amylase and slow the reaction." },
            { letter: "C", text: "The rate rises with substrate concentration until the enzyme molecules are all occupied." },
            { letter: "D", text: "Amylase works only on starch solutions stronger than 4%." }
          ],
          correct: "C"
        },
        {
          id: "vinegar-claim",
          sol: "BIO.2.c",
          stem: "Which statement best evaluates the prediction in sentence 8?",
          choices: [
            { letter: "A", text: "It is supported, because acids lower the activation energy of every reaction." },
            { letter: "B", text: "It is supported, because vinegar is a second substrate for amylase." },
            { letter: "C", text: "It is not supported, because amylase works only inside the stomach." },
            { letter: "D", text: "It is not supported, because a change in pH can alter the active site and slow the reaction." }
          ],
          correct: "D"
        },
        {
          id: "starch-maltose",
          sol: "BIO.2.b",
          stem: "Amylase breaks starch into maltose. Which statement correctly describes these two molecules?",
          choices: [
            { letter: "A", text: "Starch is a protein and maltose is a single amino acid." },
            { letter: "B", text: "Starch is a polymer of glucose and maltose is two glucose units." },
            { letter: "C", text: "Starch is a lipid and maltose is a single fatty acid." },
            { letter: "D", text: "Starch is a single sugar and maltose is a long polymer." }
          ],
          correct: "B"
        },
        {
          id: "maltose-energy",
          sol: "BIO.2.e",
          stem: "The maltose produced is later split into glucose. Cells use that glucose to —",
          choices: [
            { letter: "A", text: "capture light energy in chloroplasts" },
            { letter: "B", text: "build the active sites of enzymes" },
            { letter: "C", text: "lower the activation energy of reactions" },
            { letter: "D", text: "release energy as ATP in mitochondria" }
          ],
          correct: "D"
        },
        {
          id: "slow-it-down",
          sol: "BIO.2.c",
          stem: "Select TWO changes that would most likely slow the amylase reaction in the 2% tube.",
          choices: [
            { letter: "A", text: "Heating the saliva to 80 °C before adding it to the starch" },
            { letter: "B", text: "Adding a second millilitre of diluted saliva to the tube" },
            { letter: "C", text: "Keeping the tube in an ice bath at 4 °C during the trial" },
            { letter: "D", text: "Stirring the mixture gently as the trial runs" }
          ],
          correct: ["A", "C"]
        }
      ]
    },

    /* ---------- PHOTOSYNTHESIS & RESPIRATION ---------- */
    {
      id: "chem-hydrilla-bubbles",
      family: "CHEM",
      title: "Hydrilla Under the Lamp",
      kind: "Biochemistry · BIO.2",
      blurb: "Bubble counts from an invasive water plant as a lamp is moved farther away.",
      level: 1,
      passage: "<p>" + N(1) + "A group placed a sprig of hydrilla, an invasive water plant pulled from a Chesapeake Bay creek, under water in a test tube. " + N(2) + "They set a lamp at four distances and counted the gas bubbles rising from the cut stem in one minute. " + N(3) + "The bubbles are <strong>oxygen</strong>, a product of photosynthesis. " + N(4) + "The room lights were off during every trial.</p>" +
        "<table><tr><th>Lamp distance (cm)</th><th>Bubbles per minute</th></tr><tr><td>10</td><td>22</td></tr><tr><td>20</td><td>14</td></tr><tr><td>40</td><td>6</td></tr><tr><td>80</td><td>1</td></tr></table>",
      claims: [
        {
          id: "bubble-trend",
          sol: "BIO.2.e",
          stem: "Which conclusion do the bubble counts best support?",
          choices: [
            { letter: "A", text: "Moving the lamp closer increased the rate of photosynthesis." },
            { letter: "B", text: "Moving the lamp closer increased the rate of cellular respiration." },
            { letter: "C", text: "The plant made the same gas at every distance, so light had no effect." },
            { letter: "D", text: "The plant stopped photosynthesizing at 10 cm because the lamp was too hot." }
          ],
          correct: "A"
        },
        {
          id: "oxygen-vocab",
          sol: "BIO.2.e",
          stem: "In sentence 3, the oxygen is released when the plant —",
          choices: [
            { letter: "A", text: "breaks down glucose inside its mitochondria" },
            { letter: "B", text: "absorbs carbon dioxide through its roots" },
            { letter: "C", text: "splits water molecules using light energy" },
            { letter: "D", text: "converts stored starch back into sugar" }
          ],
          correct: "C"
        },
        {
          id: "reactants",
          sol: "BIO.2.e",
          stem: "Inside the hydrilla's chloroplasts, the reactants used to make glucose are —",
          choices: [
            { letter: "A", text: "oxygen and glucose" },
            { letter: "B", text: "glucose and water" },
            { letter: "C", text: "carbon dioxide and oxygen" },
            { letter: "D", text: "carbon dioxide and water" }
          ],
          correct: "D"
        },
        {
          id: "lights-off",
          sol: "BIO.2.e",
          stem: "Why were the room lights turned off during the trials?",
          choices: [
            { letter: "A", text: "To keep the water in the tube from warming up" },
            { letter: "B", text: "So the lamp was the only light source and its distance was the only change" },
            { letter: "C", text: "To make the rising bubbles easier to see and count" },
            { letter: "D", text: "So the plant would switch from photosynthesis to respiration" }
          ],
          correct: "B"
        },
        {
          id: "in-the-dark",
          sol: "BIO.2.e",
          stem: "Which statement about the hydrilla when the lamp is turned off is correct?",
          choices: [
            { letter: "A", text: "It stops all gas exchange until the light returns." },
            { letter: "B", text: "It keeps releasing oxygen from its stored starch." },
            { letter: "C", text: "It uses oxygen in cellular respiration to make ATP." },
            { letter: "D", text: "It makes glucose from carbon dioxide without light." }
          ],
          correct: "C"
        }
      ]
    },

    {
      id: "chem-btb-tubes",
      family: "CHEM",
      title: "Elodea, Snails and BTB",
      kind: "Biochemistry · BIO.2",
      blurb: "Sealed tubes of indicator with a plant, a snail, both or neither, in the light and in foil.",
      level: 2,
      passage: "<p>" + N(1) + "<strong>Bromothymol blue</strong> (BTB) is an indicator that turns from blue to yellow when carbon dioxide dissolves in water and makes it more acidic. " + N(2) + "A class set up four sealed tubes of blue BTB solution: one with a sprig of elodea, one with a pond snail, one with both, and one with nothing. " + N(3) + "A second set of four identical tubes was wrapped in foil. " + N(4) + "After 24 hours in bright light, only the snail-only tube had turned yellow. " + N(5) + "In the foil set, every tube that held a living thing turned yellow, including the elodea-only tube.</p>",
      claims: [
        {
          id: "btb-vocab",
          sol: "BIO.2.a",
          stem: "In sentence 1, the BTB turns yellow because dissolved carbon dioxide —",
          choices: [
            { letter: "A", text: "raises the pH of the water" },
            { letter: "B", text: "lowers the pH of the water" },
            { letter: "C", text: "removes oxygen from the water" },
            { letter: "D", text: "makes the water more basic" }
          ],
          correct: "B"
        },
        {
          id: "elodea-foil",
          sol: "BIO.2.e",
          stem: "Which statement best explains why the elodea-only tube in foil turned yellow?",
          choices: [
            { letter: "A", text: "Plants only photosynthesize, so the carbon dioxide must have leaked in from the air." },
            { letter: "B", text: "The foil trapped heat, and warm water makes the indicator turn yellow." },
            { letter: "C", text: "The elodea died as soon as the light was removed and began to decay." },
            { letter: "D", text: "The plant kept respiring but stopped photosynthesizing, so carbon dioxide built up." }
          ],
          correct: "D"
        },
        {
          id: "both-tube",
          sol: "BIO.2.e",
          stem: "Which statement best explains why the tube with both elodea and a snail stayed blue in the light?",
          choices: [
            { letter: "A", text: "The snail stopped respiring while the plant was present." },
            { letter: "B", text: "The plant released oxygen, which turned the indicator blue." },
            { letter: "C", text: "The plant used the carbon dioxide the snail released, so it did not build up." },
            { letter: "D", text: "The snail ate the elodea, which absorbed the acid from the water." }
          ],
          correct: "C"
        },
        {
          id: "empty-tube",
          sol: "BIO.2.e",
          stem: "The tube with nothing in it was included to show —",
          choices: [
            { letter: "A", text: "that light alone can change the colour of BTB" },
            { letter: "B", text: "that a colour change requires a living organism" },
            { letter: "C", text: "how much carbon dioxide one snail produces" },
            { letter: "D", text: "the effect of foil on the water temperature" }
          ],
          correct: "B"
        },
        {
          id: "starch-class",
          sol: "BIO.2.b",
          stem: "In the light, the elodea makes glucose and stores some of it as starch. Glucose and starch are both —",
          choices: [
            { letter: "A", text: "carbohydrates made of carbon, hydrogen and oxygen" },
            { letter: "B", text: "proteins made of chains of amino acids" },
            { letter: "C", text: "lipids made of fatty acids and glycerol" },
            { letter: "D", text: "nucleic acids made of chains of nucleotides" }
          ],
          correct: "A"
        },
        {
          id: "relationship",
          sol: "BIO.2.e",
          stem: "Which statement best describes the relationship between photosynthesis and cellular respiration shown by the tubes?",
          choices: [
            { letter: "A", text: "The products of one process are the reactants of the other." },
            { letter: "B", text: "Both processes take place only in plant cells." },
            { letter: "C", text: "Both processes release carbon dioxide into the water." },
            { letter: "D", text: "Photosynthesis happens in the dark and respiration in the light." }
          ],
          correct: "A"
        }
      ]
    },

    {
      id: "chem-yeast-balloons",
      family: "CHEM",
      title: "Yeast and Four Balloons",
      kind: "Biochemistry · BIO.2",
      blurb: "Yeast in sealed bottles of glucose, sucrose, starch or plain water inflate balloons by fermentation.",
      level: 2,
      passage: "<p>" + N(1) + "Yeast are single-celled fungi that can release energy from sugar with or without oxygen. " + N(2) + "With oxygen they carry out <strong>aerobic respiration</strong>, producing carbon dioxide, water and about 36 ATP per glucose; without oxygen they carry out alcoholic fermentation, producing carbon dioxide, ethanol and only 2 ATP. " + N(3) + "A student stirred one packet of dry yeast into each of four bottles of warm water, added a different sugar to three of them and nothing to the fourth, and stretched a balloon over each neck. " + N(4) + "Because the bottles were sealed, the oxygen ran out quickly and the yeast switched to fermentation. " + N(5) + "After 30 minutes she measured the circumference of each balloon.</p>" +
        "<table><tr><th>Bottle contents</th><th>Balloon circumference (cm)</th></tr><tr><td>Glucose</td><td>24</td></tr><tr><td>Sucrose</td><td>21</td></tr><tr><td>Starch</td><td>6</td></tr><tr><td>No sugar</td><td>4</td></tr></table>" +
        "<p>" + N(6) + "She noticed that the glucose bottle smelled faintly of alcohol. " + N(7) + "On the board she wrote the aerobic pathway as C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6O<sub>2</sub> &rarr; 6CO<sub>2</sub> + 6H<sub>2</sub>O + energy (ATP).</p>",
      claims: [
        {
          id: "balloon-trend",
          sol: "BIO.2.e",
          stem: "Which conclusion do the balloon measurements best support?",
          choices: [
            { letter: "A", text: "Yeast release the most gas from glucose and very little from starch." },
            { letter: "B", text: "Starch is not a carbohydrate, so yeast cannot use it at all." },
            { letter: "C", text: "Yeast produce gas at the same rate from every food source." },
            { letter: "D", text: "The no-sugar balloon inflated because oxygen entered from the air." }
          ],
          correct: "A"
        },
        {
          id: "aerobic-vocab",
          sol: "BIO.2.e",
          stem: "In sentence 2, aerobic respiration differs from fermentation because it —",
          choices: [
            { letter: "A", text: "takes place without oxygen and releases ethanol" },
            { letter: "B", text: "requires oxygen and releases far more ATP per glucose" },
            { letter: "C", text: "builds glucose from carbon dioxide and water" },
            { letter: "D", text: "produces no carbon dioxide at all" }
          ],
          correct: "B"
        },
        {
          id: "sucrose",
          sol: "BIO.2.b",
          stem: "Sucrose, the sugar in the second bottle, is a disaccharide, which means it is —",
          choices: [
            { letter: "A", text: "two simple sugars joined by dehydration synthesis" },
            { letter: "B", text: "a long chain of many glucose units" },
            { letter: "C", text: "a fatty acid attached to a glycerol molecule" },
            { letter: "D", text: "a single sugar ring with six carbon atoms" }
          ],
          correct: "A"
        },
        {
          id: "no-sugar-bottle",
          sol: "BIO.2.e",
          stem: "The bottle with no sugar was included in order to —",
          choices: [
            { letter: "A", text: "give the yeast a steady supply of oxygen" },
            { letter: "B", text: "measure the temperature of the warm water" },
            { letter: "C", text: "test whether the balloon leaks over 30 minutes" },
            { letter: "D", text: "show how much gas forms when there is no sugar to break down" }
          ],
          correct: "D"
        },
        {
          id: "starch-bottle",
          sol: "BIO.2.c",
          stem: "Which statement best explains the small balloon on the starch bottle?",
          choices: [
            { letter: "A", text: "Starch contains no glucose units, so it provides no energy to yeast." },
            { letter: "B", text: "Starch absorbed the carbon dioxide before it could reach the balloon." },
            { letter: "C", text: "Yeast lack most of the enzyme needed to break starch into usable sugars." },
            { letter: "D", text: "Starch is a lipid, so yeast cannot digest it in any amount." }
          ],
          correct: "C"
        },
        {
          id: "atp-yield",
          sol: "BIO.2.e",
          stem: "Why would the yeast in the sealed bottles gain less usable energy per glucose than yeast in an open, stirred flask?",
          choices: [
            { letter: "A", text: "The sealed bottles kept the yeast too cool to make ATP." },
            { letter: "B", text: "Fermentation captures far less of the energy in glucose than aerobic respiration does." },
            { letter: "C", text: "Ethanol is the molecule that yeast use in place of ATP." },
            { letter: "D", text: "Without oxygen, yeast cannot break down glucose at all." }
          ],
          correct: "B"
        }
      ]
    }
  ];

  for (var i = 0; i < PACKS.length; i++) P.push(PACKS[i]);
})(typeof window !== "undefined" ? window : global);
