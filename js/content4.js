/* SOL Lab — Cell Structure & Function (BIO.3). Original text only. */
(function (global) {
  var P = global.HEIST_PACKS;
  if (!P || !P.push) return;
  var N = function (i) { return '<span class="n">(' + i + ')</span> '; };   // numbered sentence

  var PACKS = [
    /* ---------- tiny · level 1 · cell theory ---------- */
    {
      id: "cell-cork-slice",
      family: "CELL",
      title: "A Slice of Cork",
      kind: "Cells · BIO.3",
      blurb: "A class repeats the 1665 cork observation and sees where the word cell came from.",
      level: 1,
      passage: "<p>" + N(1) + "A biology class shaves a thin slice of cork and views it at 100x. " + N(2) + "They see rows of tiny empty boxes, the walled spaces Robert Hooke named <strong>cells</strong> in 1665. " + N(3) + "Next they view onion skin and a drop of pond water. " + N(4) + "The onion shows box-shaped cells, each with a nucleus; the pond water shows single cells swimming on their own. " + N(5) + "Centuries of such microscope observations built the <strong>cell theory</strong>.</p>",
      claims: [
        {
          id: "vocab",
          sol: "BIO.3.a",
          stem: "In sentence 2, the word cells refers to —",
          choices: [
            { letter: "A", text: "the living contents that fill each box in the cork" },
            { letter: "B", text: "the walled compartments that make up the cork tissue" },
            { letter: "C", text: "the lenses that magnify the slice one hundred times" },
            { letter: "D", text: "the pond organisms that swim past the onion slide" }
          ],
          correct: "B"
        },
        {
          id: "principle",
          sol: "BIO.3.a",
          stem: "Which part of the cell theory is best supported by the onion and pond-water observations in sentence 4?",
          choices: [
            { letter: "A", text: "All cells arise from other cells by division." },
            { letter: "B", text: "Every cell is surrounded by a rigid cell wall." },
            { letter: "C", text: "All living things are made of one or more cells." },
            { letter: "D", text: "Cells are the same size in every organism." }
          ],
          correct: "C"
        },
        {
          id: "empty",
          sol: "BIO.3.a",
          stem: "The boxes in the cork appeared empty because —",
          choices: [
            { letter: "A", text: "the cork cells were dead and only their walls remained" },
            { letter: "B", text: "the microscope was set too low to show any contents" },
            { letter: "C", text: "cork cells never contain cytoplasm, even while alive" },
            { letter: "D", text: "shaving the slice pushed the nucleus out of each box" }
          ],
          correct: "A"
        },
        {
          id: "built",
          sol: "BIO.3.a",
          stem: "Which statement best explains why sentence 5 says the cell theory was built rather than discovered all at once?",
          choices: [
            { letter: "A", text: "The theory was written before microscopes were invented." },
            { letter: "B", text: "One observation in 1665 was enough to prove it." },
            { letter: "C", text: "Each observer worked alone and shared no results." },
            { letter: "D", text: "Evidence from many observers with better tools added up." }
          ],
          correct: "D"
        },
        {
          id: "euk",
          sol: "BIO.3.a",
          stem: "Which structure mentioned in sentence 4 shows that onion skin cells are eukaryotic?",
          choices: [
            { letter: "A", text: "a cell wall" },
            { letter: "B", text: "a nucleus" },
            { letter: "C", text: "cytoplasm" },
            { letter: "D", text: "a membrane" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- tiny · level 1 · prokaryote vs eukaryote ---------- */
    {
      id: "cell-two-smears",
      family: "CELL",
      title: "Yogurt and Cheek Cells",
      kind: "Cells · BIO.3",
      blurb: "Two stained slides, one table: what a bacterium and a cheek cell do and do not share.",
      level: 1,
      passage: "<p>" + N(1) + "Students compare two stained slides at 400x: a smear of bacteria from yogurt and a scraping of cheek cells. " + N(2) + "They record which structures they can see in each. " + N(3) + "A <strong>prokaryote</strong> keeps its DNA loose in the cytoplasm; a eukaryote seals its DNA inside a nucleus.</p>" +
        "<table><tr><th>Structure</th><th>Yogurt bacteria</th><th>Cheek cells</th></tr>" +
        "<tr><td>Cell membrane</td><td>yes</td><td>yes</td></tr>" +
        "<tr><td>Nucleus</td><td>no</td><td>yes</td></tr>" +
        "<tr><td>Ribosomes</td><td>yes</td><td>yes</td></tr>" +
        "<tr><td>Mitochondria</td><td>no</td><td>yes</td></tr>" +
        "<tr><td>Cell wall</td><td>yes</td><td>no</td></tr></table>" +
        "<p>" + N(4) + "The bacteria are about 2 micrometers long; the cheek cells are about 60 micrometers across.</p>",
      claims: [
        {
          id: "table",
          sol: "BIO.3.a",
          stem: "Which row of the table shows a structure found in the bacteria but not in the cheek cells?",
          choices: [
            { letter: "A", text: "Nucleus" },
            { letter: "B", text: "Ribosomes" },
            { letter: "C", text: "Mitochondria" },
            { letter: "D", text: "Cell wall" }
          ],
          correct: "D"
        },
        {
          id: "vocab",
          sol: "BIO.3.a",
          stem: "According to sentence 3, a cell is a prokaryote because it —",
          choices: [
            { letter: "A", text: "lacks a membrane-bound nucleus" },
            { letter: "B", text: "lacks a cell membrane" },
            { letter: "C", text: "is too small to have ribosomes" },
            { letter: "D", text: "cannot make its own proteins" }
          ],
          correct: "A"
        },
        {
          id: "ribo",
          sol: "BIO.3.b",
          stem: "Ribosomes appear in both cell types because every cell must —",
          choices: [
            { letter: "A", text: "store its DNA inside a nucleus" },
            { letter: "B", text: "build proteins from amino acids" },
            { letter: "C", text: "release energy in mitochondria" },
            { letter: "D", text: "hold its shape with a cell wall" }
          ],
          correct: "B"
        },
        {
          id: "size",
          sol: "BIO.3.a",
          stem: "Which conclusion about cell size is supported by sentence 4?",
          choices: [
            { letter: "A", text: "Both cell types are about the same size." },
            { letter: "B", text: "Prokaryotic cells are larger because of their walls." },
            { letter: "C", text: "Prokaryotic cells are generally smaller than eukaryotic cells." },
            { letter: "D", text: "Cheek cells are too small to see at 400x." }
          ],
          correct: "C"
        },
        {
          id: "energy",
          sol: "BIO.3.b",
          stem: "Which statement best explains how the bacteria stay alive with no mitochondria?",
          choices: [
            { letter: "A", text: "They absorb ready-made ATP from the yogurt." },
            { letter: "B", text: "They release energy using enzymes in their cytoplasm and membrane." },
            { letter: "C", text: "They borrow mitochondria from nearby cheek cells." },
            { letter: "D", text: "They are too small to need any energy at all." }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- tiny · level 1 · osmosis with a shell-less egg ---------- */
    {
      id: "cell-naked-egg",
      family: "CELL",
      title: "The Naked Egg",
      kind: "Cells · BIO.3",
      blurb: "An egg with its shell dissolved swells in water and shrinks in syrup.",
      level: 1,
      passage: "<p>" + N(1) + "A student soaks a raw egg in vinegar until the shell dissolves, leaving only the thin membrane around the egg. " + N(2) + "She rinses it, records its mass, and then moves it into a new liquid each day.</p>" +
        "<table><tr><th>Day</th><th>Liquid</th><th>Mass (g)</th></tr>" +
        "<tr><td>0</td><td>after vinegar</td><td>62</td></tr>" +
        "<tr><td>1</td><td>distilled water</td><td>78</td></tr>" +
        "<tr><td>2</td><td>corn syrup</td><td>51</td></tr></table>" +
        "<p>" + N(3) + "In distilled water the egg swelled; in corn syrup it shrank and wrinkled. " + N(4) + "Water crossed the membrane by <strong>osmosis</strong>, moving toward the side with more dissolved solute.</p>",
      claims: [
        {
          id: "gain",
          sol: "BIO.3.c",
          stem: "According to the table, how much mass did the egg gain in distilled water?",
          choices: [
            { letter: "A", text: "11 g" },
            { letter: "B", text: "16 g" },
            { letter: "C", text: "27 g" },
            { letter: "D", text: "78 g" }
          ],
          correct: "B"
        },
        {
          id: "vocab",
          sol: "BIO.3.c",
          stem: "In sentence 4, osmosis is best described as —",
          choices: [
            { letter: "A", text: "the movement of solute across a membrane" },
            { letter: "B", text: "the diffusion of water across a membrane" },
            { letter: "C", text: "the pumping of water using energy from ATP" },
            { letter: "D", text: "the dissolving of a shell in a weak acid" }
          ],
          correct: "B"
        },
        {
          id: "shrink",
          sol: "BIO.3.c",
          stem: "The egg shrank in corn syrup because —",
          choices: [
            { letter: "A", text: "sugar entered the egg and crowded the water out" },
            { letter: "B", text: "water entered the egg, where solute was lower" },
            { letter: "C", text: "water left the egg for the syrup, where solute was higher" },
            { letter: "D", text: "the syrup broke down the proteins in the membrane" }
          ],
          correct: "C"
        },
        {
          id: "tonic",
          sol: "BIO.3.c",
          stem: "Compared with the inside of the egg, distilled water is —",
          choices: [
            { letter: "A", text: "hypertonic" },
            { letter: "B", text: "isotonic" },
            { letter: "C", text: "saturated" },
            { letter: "D", text: "hypotonic" }
          ],
          correct: "D"
        },
        {
          id: "why-vinegar",
          sol: "BIO.3.c",
          stem: "Why did the student dissolve the shell before starting the investigation?",
          choices: [
            { letter: "A", text: "so the membrane would be the only barrier between the egg and the liquid" },
            { letter: "B", text: "so the egg would weigh less and be easier to handle on the balance" },
            { letter: "C", text: "because vinegar adds water to the egg before the water trial" },
            { letter: "D", text: "so the egg would sink instead of floating in the corn syrup" }
          ],
          correct: "A"
        }
      ]
    },

    /* ---------- short · level 2 · spontaneous generation refuted ---------- */
    {
      id: "cell-broth-flasks",
      family: "CELL",
      title: "Four Flasks of Broth",
      kind: "Cells · BIO.3",
      blurb: "Open, sealed and S-necked flasks test whether life can appear from nonliving broth.",
      level: 2,
      passage: "<p>" + N(1) + "For centuries people believed living things could arise from nonliving matter, an idea called <strong>spontaneous generation</strong>. " + N(2) + "A class boils broth in four flasks to kill any cells present. " + N(3) + "Flask A is left open. " + N(4) + "Flask B is sealed with a stopper. " + N(5) + "Flask C has an S-shaped neck that lets air in but traps dust in the bend. " + N(6) + "Flask D is like C, but students tilt it so broth touches the trapped dust, then set it upright. " + N(7) + "After ten days they check for cloudiness, a sign of growth.</p>" +
        "<table><tr><th>Flask</th><th>Treatment</th><th>Broth after 10 days</th></tr>" +
        "<tr><td>A</td><td>open</td><td>cloudy</td></tr>" +
        "<tr><td>B</td><td>sealed</td><td>clear</td></tr>" +
        "<tr><td>C</td><td>S-neck</td><td>clear</td></tr>" +
        "<tr><td>D</td><td>S-neck, tilted</td><td>cloudy</td></tr></table>" +
        "<p>" + N(8) + "They conclude the microbes came from cells on the dust, not from the broth itself.</p>",
      claims: [
        {
          id: "pair",
          sol: "BIO.3.a",
          stem: "Which pair of flasks, compared with each other, best shows that the microbes came from dust rather than from the air itself?",
          choices: [
            { letter: "A", text: "A and B" },
            { letter: "B", text: "B and C" },
            { letter: "C", text: "C and D" },
            { letter: "D", text: "A and D" }
          ],
          correct: "C"
        },
        {
          id: "vocab",
          sol: "BIO.3.a",
          stem: "In sentence 1, spontaneous generation means that —",
          choices: [
            { letter: "A", text: "cells divide without any signal" },
            { letter: "B", text: "life arises from nonliving matter" },
            { letter: "C", text: "microbes grow faster when warm" },
            { letter: "D", text: "dust carries living cells into broth" }
          ],
          correct: "B"
        },
        {
          id: "objection",
          sol: "BIO.3.a",
          stem: "Flask B stayed clear. A supporter of spontaneous generation could still argue that —",
          choices: [
            { letter: "A", text: "the stopper kept out the air that new life needs" },
            { letter: "B", text: "the broth in flask B was never boiled" },
            { letter: "C", text: "flask B was tilted just like flask D" },
            { letter: "D", text: "sealed flasks always grow microbes" }
          ],
          correct: "A"
        },
        {
          id: "single",
          sol: "BIO.3.b",
          stem: "Which statement best explains how a single microbe in flask A stayed alive and multiplied?",
          choices: [
            { letter: "A", text: "It absorbed ATP made by the beef broth as it cooled." },
            { letter: "B", text: "It joined with other microbes to form one multicellular body." },
            { letter: "C", text: "It formed a nucleus first and then began to divide." },
            { letter: "D", text: "Its membrane, ribosomes and DNA together carried out its life processes." }
          ],
          correct: "D"
        },
        {
          id: "entry",
          sol: "BIO.3.c",
          stem: "Nutrients from the broth entered each microbe by crossing its —",
          choices: [
            { letter: "A", text: "nuclear envelope" },
            { letter: "B", text: "ribosome" },
            { letter: "C", text: "mitochondrion" },
            { letter: "D", text: "cell membrane" }
          ],
          correct: "D"
        },
        {
          id: "principle",
          sol: "BIO.3.a",
          stem: "The result in flask C supports which part of the cell theory?",
          choices: [
            { letter: "A", text: "All organisms are made of cells." },
            { letter: "B", text: "All cells come from existing cells." },
            { letter: "C", text: "The cell is the basic unit of life." },
            { letter: "D", text: "Cells pass on hereditary information." }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- short · level 1 · organelles as a town ---------- */
    {
      id: "cell-town-analogy",
      family: "CELL",
      title: "The Cell as a Town",
      kind: "Cells · BIO.3",
      blurb: "Organelles compared to a town hall, workshops, roads and a post office.",
      level: 1,
      passage: "<p>" + N(1) + "A teacher compares a cell to a town. " + N(2) + "The <strong>nucleus</strong> is the town hall that stores the plans and sends out instructions. " + N(3) + "<strong>Ribosomes</strong> are the workshops that build proteins from those instructions. " + N(4) + "The endoplasmic reticulum is the road network carrying new proteins to the Golgi, the post office that sorts and ships them. " + N(5) + "<strong>Mitochondria</strong> are power plants that release energy from food; lysosomes are recycling centers that break down worn-out parts. " + N(6) + "Students then draw two cells. " + N(7) + "The plant cell gets a rigid wall, a large central vacuole and green chloroplasts. " + N(8) + "The animal cell has none of these; both share a membrane, cytoplasm and a cytoskeleton of protein fibers.</p>",
      claims: [
        {
          id: "vocab",
          sol: "BIO.3.b",
          stem: "In sentence 2, the nucleus is compared to a town hall because it —",
          choices: [
            { letter: "A", text: "breaks down worn-out parts" },
            { letter: "B", text: "stores the instructions that direct the cell" },
            { letter: "C", text: "releases usable energy from food" },
            { letter: "D", text: "builds proteins for export" }
          ],
          correct: "B"
        },
        {
          id: "drawing",
          sol: "BIO.3.b",
          stem: "A student's animal-cell drawing includes a cell wall. Which correction should the teacher make?",
          choices: [
            { letter: "A", text: "Only plant cells have a wall, so remove it." },
            { letter: "B", text: "Animal cells have a wall but no membrane." },
            { letter: "C", text: "Cell walls belong only in bacteria." },
            { letter: "D", text: "The wall should be drawn inside the membrane." }
          ],
          correct: "A"
        },
        {
          id: "gland",
          sol: "BIO.3.d",
          stem: "A gland cell exports large amounts of protein. Which organelle would you expect it to have in greatest number?",
          choices: [
            { letter: "A", text: "chloroplasts" },
            { letter: "B", text: "vacuoles" },
            { letter: "C", text: "ribosomes" },
            { letter: "D", text: "lysosomes" }
          ],
          correct: "C"
        },
        {
          id: "post",
          sol: "BIO.3.b",
          stem: "In the analogy, a package leaves the post office. In the cell this corresponds to —",
          choices: [
            { letter: "A", text: "a ribosome reading a strand of mRNA" },
            { letter: "B", text: "a lysosome digesting a captured bacterium" },
            { letter: "C", text: "the nucleus copying its DNA before division" },
            { letter: "D", text: "the Golgi packaging a protein into a vesicle" }
          ],
          correct: "D"
        },
        {
          id: "membrane",
          sol: "BIO.3.c",
          stem: "Both drawings include a cell membrane. The main job of the membrane is to —",
          choices: [
            { letter: "A", text: "give the cell a rigid box shape" },
            { letter: "B", text: "control which materials enter and leave" },
            { letter: "C", text: "store water and dissolved sugars" },
            { letter: "D", text: "capture light energy for the cell" }
          ],
          correct: "B"
        },
        {
          id: "town",
          sol: "BIO.3.b",
          stem: "Which statement best explains why the analogy calls the whole cell a town rather than a single building?",
          choices: [
            { letter: "A", text: "A cell has many parts that depend on one another to stay alive." },
            { letter: "B", text: "A cell is much larger than any one of its organelles." },
            { letter: "C", text: "Every organelle could survive on its own outside the cell." },
            { letter: "D", text: "Towns and cells both need a wall around the outside." }
          ],
          correct: "A"
        }
      ]
    },

    /* ---------- short · level 2 · blood and onion cells in salt water ---------- */
    {
      id: "cell-salt-slides",
      family: "CELL",
      title: "Cells in Salt Water",
      kind: "Cells · BIO.3",
      blurb: "Red blood cells and onion cells react differently to three salt solutions.",
      level: 2,
      passage: "<p>" + N(1) + "A student places drops of blood and thin pieces of red onion skin into three salt solutions and examines them at 400x after five minutes. " + N(2) + "Normal body fluid is about 0.9% salt.</p>" +
        "<table><tr><th>Solution</th><th>Red blood cells</th><th>Onion cells</th></tr>" +
        "<tr><td>0.0% salt (distilled)</td><td>swollen, some burst</td><td>plump, membrane pressed to wall</td></tr>" +
        "<tr><td>0.9% salt</td><td>normal disc shape</td><td>normal</td></tr>" +
        "<tr><td>3.0% salt</td><td>shrunken, spiky edges</td><td>membrane pulled away from wall</td></tr></table>" +
        "<p>" + N(3) + "The 0.9% solution is <strong>isotonic</strong> to the cells, so water enters and leaves at equal rates. " + N(4) + "In 3.0% salt the onion membrane shrinks inward while the cell wall keeps its shape, a condition called <strong>plasmolysis</strong>. " + N(5) + "The onion cells in distilled water did not burst even though many red blood cells did.</p>",
      claims: [
        {
          id: "table",
          sol: "BIO.3.c",
          stem: "Based on the table, which solution caused water to leave both kinds of cell?",
          choices: [
            { letter: "A", text: "0.0% salt" },
            { letter: "B", text: "0.9% salt" },
            { letter: "C", text: "3.0% salt" },
            { letter: "D", text: "none of the solutions" }
          ],
          correct: "C"
        },
        {
          id: "vocab",
          sol: "BIO.3.c",
          stem: "In sentence 3, isotonic means the solution —",
          choices: [
            { letter: "A", text: "has more dissolved solute than the cell" },
            { letter: "B", text: "has the same solute concentration as the cell" },
            { letter: "C", text: "has less dissolved solute than the cell" },
            { letter: "D", text: "contains no dissolved salt at all" }
          ],
          correct: "B"
        },
        {
          id: "burst",
          sol: "BIO.3.c",
          stem: "Red blood cells burst in distilled water because —",
          choices: [
            { letter: "A", text: "water moved into the cells, where solute concentration was higher" },
            { letter: "B", text: "salt rushed into the cells and split the membrane" },
            { letter: "C", text: "water moved out of the cells toward the lower solute concentration" },
            { letter: "D", text: "the membrane dissolved in the pure water" }
          ],
          correct: "A"
        },
        {
          id: "wall",
          sol: "BIO.3.b",
          stem: "Which statement best explains the observation in sentence 5?",
          choices: [
            { letter: "A", text: "Onion cells have no membrane, so no water enters them." },
            { letter: "B", text: "Plant cells cannot absorb water without roots." },
            { letter: "C", text: "Distilled water is isotonic to plant cells." },
            { letter: "D", text: "The rigid cell wall resists the pressure of incoming water." }
          ],
          correct: "D"
        },
        {
          id: "disc",
          sol: "BIO.3.d",
          stem: "The normal disc shape of a red blood cell in 0.9% salt helps the cell —",
          choices: [
            { letter: "A", text: "store extra salt for the body" },
            { letter: "B", text: "push through the walls of capillaries" },
            { letter: "C", text: "exchange gases quickly across a large surface" },
            { letter: "D", text: "divide rapidly while in the bloodstream" }
          ],
          correct: "C"
        },
        {
          id: "iv",
          sol: "BIO.3.c",
          stem: "A dehydrated patient is given fluid through a vein. Which fluid should be chosen, and why?",
          choices: [
            { letter: "A", text: "distilled water, because it hydrates blood cells fastest" },
            { letter: "B", text: "0.9% salt, because it will not change the volume of blood cells" },
            { letter: "C", text: "3.0% salt, because it draws water into blood cells" },
            { letter: "D", text: "any of the three, because blood cells have protective walls" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- medium · level 2 · potato cores in sucrose ---------- */
    {
      id: "cell-potato-cores",
      family: "CELL",
      title: "Potato Cores in Sugar",
      kind: "Cells · BIO.3",
      blurb: "Percent change in mass across five sucrose concentrations, plus one group's blotting mistake.",
      level: 2,
      passage: "<p>" + N(1) + "A class cuts potato cores of equal size with a cork borer, blots them, and records each mass. " + N(2) + "Each core is placed in a cup of sugar solution for 24 hours, then blotted and weighed again. " + N(3) + "The cups hold 0%, 5%, 10%, 20% and 30% sucrose. " + N(4) + "The class calculates the percent change in mass for each core.</p>" +
        "<table><tr><th>Sucrose (%)</th><th>Start mass (g)</th><th>End mass (g)</th><th>Change (%)</th></tr>" +
        "<tr><td>0</td><td>10.0</td><td>11.2</td><td>+12</td></tr>" +
        "<tr><td>5</td><td>10.0</td><td>10.6</td><td>+6</td></tr>" +
        "<tr><td>10</td><td>10.0</td><td>10.0</td><td>0</td></tr>" +
        "<tr><td>20</td><td>10.0</td><td>9.2</td><td>-8</td></tr>" +
        "<tr><td>30</td><td>10.0</td><td>8.5</td><td>-15</td></tr></table>" +
        "<p>" + N(5) + "Potato cells have no pump for sucrose, and sucrose molecules are too large to pass through the membrane on their own. " + N(6) + "Only water crosses the membrane during the 24 hours, so the change in mass is a measure of <strong>osmosis</strong>. " + N(7) + "The solution in which mass did not change is <strong>isotonic</strong> to the potato cytoplasm. " + N(8) + "The cores from 0% sucrose felt stiff and firm, while those from 30% were limp. " + N(9) + "One group forgot to blot its cores before the final weighing and reported a gain in every cup.</p>",
      claims: [
        {
          id: "conclusion",
          sol: "BIO.3.c",
          stem: "Which conclusion is best supported by the data in the table?",
          choices: [
            { letter: "A", text: "Potato cells gain water in every sucrose solution." },
            { letter: "B", text: "The potato cytoplasm is about 10% sucrose." },
            { letter: "C", text: "Sucrose enters the cores at 20% and 30%." },
            { letter: "D", text: "Mass loss stops once sucrose reaches 20%." }
          ],
          correct: "B"
        },
        {
          id: "vocab",
          sol: "BIO.3.c",
          stem: "In sentence 7, isotonic describes a solution that —",
          choices: [
            { letter: "A", text: "contains no dissolved sucrose at all" },
            { letter: "B", text: "causes the potato cells to swell and burst" },
            { letter: "C", text: "has the same solute concentration as the cell" },
            { letter: "D", text: "pulls water out of the cell into the cup" }
          ],
          correct: "C"
        },
        {
          id: "stiff",
          sol: "BIO.3.b",
          stem: "Which structure best explains why the cores in 0% sucrose became stiff rather than bursting (sentence 8)?",
          choices: [
            { letter: "A", text: "the central vacuole, which collapsed" },
            { letter: "B", text: "the membrane, which pumped water out" },
            { letter: "C", text: "the nucleus, which absorbed the extra water" },
            { letter: "D", text: "the cell wall, which resisted the pressure of incoming water" }
          ],
          correct: "D"
        },
        {
          id: "iv",
          sol: "BIO.3.c",
          stem: "The independent variable in this investigation is the —",
          choices: [
            { letter: "A", text: "sucrose concentration of the solution" },
            { letter: "B", text: "percent change in mass of each core" },
            { letter: "C", text: "starting mass of each core" },
            { letter: "D", text: "time the cores spent soaking" }
          ],
          correct: "A"
        },
        {
          id: "blot",
          sol: "BIO.3.c",
          stem: "Select TWO statements that explain the result reported by the group in sentence 9.",
          choices: [
            { letter: "A", text: "Liquid left on the surface of each core added to the measured mass." },
            { letter: "B", text: "Cores in 30% sucrose actually took in water from the solution." },
            { letter: "C", text: "The error raised the final mass but not the starting mass." },
            { letter: "D", text: "Blotting removes water from inside the potato cells." }
          ],
          correct: ["A", "C"]
        },
        {
          id: "root",
          sol: "BIO.3.d",
          stem: "Root hair cells of a potato plant are long and thin. This shape helps the plant because it —",
          choices: [
            { letter: "A", text: "lets the cell move water without using osmosis" },
            { letter: "B", text: "increases the surface area for water to enter by osmosis" },
            { letter: "C", text: "prevents water from leaving the cell in dry soil" },
            { letter: "D", text: "stores sucrose for the growing potato tuber" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- medium · level 2 · levels of organization and homeostasis ---------- */
    {
      id: "cell-hot-runner",
      family: "CELL",
      title: "A Runner on a Hot Day",
      kind: "Cells · BIO.3",
      blurb: "From muscle cells to organ systems: how a runner's body sheds heat.",
      level: 2,
      passage: "<p>" + N(1) + "A cross-country runner trains on a hot afternoon near Harrisonburg. " + N(2) + "Within minutes her skin flushes and she begins to sweat. " + N(3) + "A biology student explains what is happening at each level of organization. " + N(4) + "Muscle <strong>cells</strong> in her legs release energy in their mitochondria, and some of that energy is lost as heat. " + N(5) + "Bundles of these cells form muscle <strong>tissue</strong>, and several tissues, including nerve and connective tissue, make up each leg muscle, an <strong>organ</strong>. " + N(6) + "Sensors in the brain detect the rising blood temperature and signal sweat glands in the skin. " + N(7) + "Sweat glands, skin and blood vessels belong to different organ systems, yet they work together to shed heat. " + N(8) + "As sweat evaporates, blood temperature returns toward 37 °C. " + N(9) + "Keeping internal conditions within a narrow range is called <strong>homeostasis</strong>. " + N(10) + "Muscle cells and sweat-gland cells carry the same DNA yet look and act differently.</p>",
      claims: [
        {
          id: "order",
          sol: "BIO.3.b",
          stem: "Which list places the runner's structures in order from smallest to largest?",
          choices: [
            { letter: "A", text: "cell, organ, tissue, organ system" },
            { letter: "B", text: "cell, tissue, organ, organ system" },
            { letter: "C", text: "tissue, cell, organ, organism" },
            { letter: "D", text: "organ, tissue, cell, organism" }
          ],
          correct: "B"
        },
        {
          id: "vocab",
          sol: "BIO.3.b",
          stem: "In sentence 9, homeostasis refers to —",
          choices: [
            { letter: "A", text: "the release of heat by muscle cells" },
            { letter: "B", text: "the flow of extra blood to the skin" },
            { letter: "C", text: "keeping internal conditions stable" },
            { letter: "D", text: "the evaporation of sweat from skin" }
          ],
          correct: "C"
        },
        {
          id: "organ",
          sol: "BIO.3.b",
          stem: "Which statement best describes the relationship between a leg muscle and muscle tissue?",
          choices: [
            { letter: "A", text: "Muscle tissue is built from several different organs." },
            { letter: "B", text: "A leg muscle is a single type of tissue." },
            { letter: "C", text: "Muscle tissue is one level larger than an organ." },
            { letter: "D", text: "A leg muscle is an organ built from muscle tissue and other tissues." }
          ],
          correct: "D"
        },
        {
          id: "systems",
          sol: "BIO.3.b",
          stem: "Sentence 7 best illustrates that —",
          choices: [
            { letter: "A", text: "organ systems interact to keep the body in balance" },
            { letter: "B", text: "each organ system works alone, without the others" },
            { letter: "C", text: "the skin is the only organ that controls temperature" },
            { letter: "D", text: "sweat glands are a type of muscle tissue" }
          ],
          correct: "A"
        },
        {
          id: "sweat",
          sol: "BIO.3.c",
          stem: "Sweat forms when water and salt leave gland cells. Which structure controls which substances leave the cell?",
          choices: [
            { letter: "A", text: "the cell wall" },
            { letter: "B", text: "the nucleus" },
            { letter: "C", text: "the cell membrane" },
            { letter: "D", text: "the cytoskeleton" }
          ],
          correct: "C"
        },
        {
          id: "differ",
          sol: "BIO.3.d",
          stem: "Which statement best explains the observation in sentence 10?",
          choices: [
            { letter: "A", text: "Each cell type has lost the genes it does not use." },
            { letter: "B", text: "Muscle cells are prokaryotes and gland cells are not." },
            { letter: "C", text: "Sweat-gland cells have no nucleus to hold DNA." },
            { letter: "D", text: "Each cell type switches on a different set of its genes." }
          ],
          correct: "D"
        }
      ]
    },

    /* ---------- medium · level 3 · membrane model and dialysis tubing ---------- */
    {
      id: "cell-membrane-model",
      family: "CELL",
      title: "Building a Membrane",
      kind: "Cells · BIO.3",
      blurb: "A bilayer model, then dialysis tubing with starch, glucose and iodine.",
      level: 3,
      passage: "<p>" + N(1) + "A class models the cell membrane with foam balls for phospholipid heads and pipe cleaners for tails, arranged as a <strong>phospholipid bilayer</strong> with the tails pointing inward. " + N(2) + "Clay shapes span the bilayer to represent protein channels and pumps. " + N(3) + "Small nonpolar molecules such as oxygen slip between the tails, while ions and large polar molecules need a protein to cross. " + N(4) + "The class then tests dialysis tubing, which has tiny pores but no proteins. " + N(5) + "A bag of starch and glucose solution sits in a beaker of water containing iodine, which turns blue-black with starch. " + N(6) + "After 20 minutes the water outside tests positive for glucose but stays amber, while the contents of the bag are blue-black. " + N(7) + "A student asks why the bag cannot move glucose against its concentration gradient the way a root hair cell takes in minerals. " + N(8) + "The teacher answers that the tubing has no pumps and no ATP, so it allows only <strong>passive transport</strong> down concentration gradients.</p>",
      claims: [
        {
          id: "vocab",
          sol: "BIO.3.c",
          stem: "In the phospholipid bilayer of sentence 1, the tails point inward because they are —",
          choices: [
            { letter: "A", text: "hydrophilic and attract water" },
            { letter: "B", text: "hydrophobic and avoid water" },
            { letter: "C", text: "charged and bind to ions" },
            { letter: "D", text: "rigid and give the membrane strength" }
          ],
          correct: "B"
        },
        {
          id: "result",
          sol: "BIO.3.c",
          stem: "Which conclusion is best supported by the results in sentence 6?",
          choices: [
            { letter: "A", text: "Iodine and glucose crossed the tubing; starch did not." },
            { letter: "B", text: "Starch and iodine crossed the tubing; glucose did not." },
            { letter: "C", text: "Only glucose crossed the tubing in either direction." },
            { letter: "D", text: "Nothing crossed the tubing during the 20 minutes." }
          ],
          correct: "A"
        },
        {
          id: "starch",
          sol: "BIO.3.c",
          stem: "The starch stayed inside the bag because —",
          choices: [
            { letter: "A", text: "starch is nonpolar and stuck to the tubing" },
            { letter: "B", text: "iodine bound the starch and held it inside" },
            { letter: "C", text: "starch molecules are too large for the pores" },
            { letter: "D", text: "the bag pumped any escaping starch back in" }
          ],
          correct: "C"
        },
        {
          id: "oxygen",
          sol: "BIO.3.c",
          stem: "Which statement best explains why oxygen crosses a cell membrane without a protein but glucose needs one?",
          choices: [
            { letter: "A", text: "Oxygen is charged and glucose is not." },
            { letter: "B", text: "Glucose is used up too quickly to reach the membrane." },
            { letter: "C", text: "Oxygen is pumped inward by the mitochondria." },
            { letter: "D", text: "Oxygen is small and nonpolar; glucose is large and polar." }
          ],
          correct: "D"
        },
        {
          id: "uptake",
          sol: "BIO.3.b",
          stem: "A root hair cell takes in a mineral ion from soil water that holds less of that ion than the cell does. Which pair of structures makes this possible?",
          choices: [
            { letter: "A", text: "a protein pump in the membrane and a mitochondrion supplying ATP" },
            { letter: "B", text: "a channel protein in the membrane and a chloroplast supplying sugar" },
            { letter: "C", text: "the phospholipid tails and a nucleus that dissolves the ion" },
            { letter: "D", text: "larger pores in the membrane and ribosomes that carry the ion" }
          ],
          correct: "A"
        },
        {
          id: "roothair",
          sol: "BIO.3.d",
          stem: "Root hair cells contain far more mitochondria than most other root cells. Which statement best explains this specialization?",
          choices: [
            { letter: "A", text: "They need ATP to make water enter by osmosis." },
            { letter: "B", text: "They need ATP to pump minerals in against the gradient." },
            { letter: "C", text: "They carry out photosynthesis below the ground." },
            { letter: "D", text: "They must store glucose for the rest of the plant." }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- long · level 3 · surface area to volume ---------- */
    {
      id: "cell-agar-cubes",
      family: "CELL",
      title: "Agar Cubes in Vinegar",
      kind: "Cells · BIO.3",
      blurb: "Three sizes of indicator agar show why cells stay small and why some fold their membranes.",
      level: 3,
      passage: "<p>" + N(1) + "Students cut blocks of pink agar, which contains a pH indicator, into cubes with sides of 1, 2 and 3 cm. " + N(2) + "They drop the cubes into vinegar and start a timer. " + N(3) + "Wherever the acid diffuses in, the agar turns from pink to clear. " + N(4) + "After 5 minutes they remove the cubes, slice each in half, and measure how deep the clear layer reaches. " + N(5) + "They also calculate the <strong>surface area</strong> (six faces) and <strong>volume</strong> of each cube.</p>" +
        "<table><tr><th>Side (cm)</th><th>Surface area (cm²)</th><th>Volume (cm³)</th><th>SA : V</th></tr>" +
        "<tr><td>1</td><td>6</td><td>1</td><td>6.0</td></tr>" +
        "<tr><td>2</td><td>24</td><td>8</td><td>3.0</td></tr>" +
        "<tr><td>3</td><td>54</td><td>27</td><td>2.0</td></tr></table>" +
        "<p>" + N(6) + "The acid reached about 4 mm into every cube. " + N(7) + "The 1-cm cube was clear nearly all the way through, but the 3-cm cube kept a large pink center. " + N(8) + "The teacher relates this to cells: nutrients enter and wastes leave across the membrane, so its surface area must keep up with the volume of cytoplasm it serves. " + N(9) + "As a cell grows, volume rises faster than surface area, and the ratio falls. " + N(10) + "This is one reason cells stay small and divide, and why cells lining the small intestine, which absorb a great deal, have folded membranes. " + N(11) + "A student asks whether a meter-long nerve cell breaks the rule; the teacher notes it is extremely thin, so no cytoplasm is far from the membrane.</p>",
      claims: [
        {
          id: "ratio",
          sol: "BIO.3.b",
          stem: "Based on the table, when the side of a cube doubles from 1 cm to 2 cm, the surface-area-to-volume ratio —",
          choices: [
            { letter: "A", text: "doubles" },
            { letter: "B", text: "stays the same" },
            { letter: "C", text: "is cut in half" },
            { letter: "D", text: "increases fourfold" }
          ],
          correct: "C"
        },
        {
          id: "vocab",
          sol: "BIO.3.b",
          stem: "In sentence 5, the surface area of a cube refers to —",
          choices: [
            { letter: "A", text: "the total area of its six faces" },
            { letter: "B", text: "the amount of space it fills" },
            { letter: "C", text: "the depth the acid reached" },
            { letter: "D", text: "the length of one of its sides" }
          ],
          correct: "A"
        },
        {
          id: "percent",
          sol: "BIO.3.b",
          stem: "Which cube had the smallest share of its volume reached by acid after 5 minutes?",
          choices: [
            { letter: "A", text: "the 1-cm cube" },
            { letter: "B", text: "the 2-cm cube" },
            { letter: "C", text: "all three equally, since the acid reached 4 mm in each" },
            { letter: "D", text: "the 3-cm cube" }
          ],
          correct: "D"
        },
        {
          id: "process",
          sol: "BIO.3.c",
          stem: "The acid moved into the agar by —",
          choices: [
            { letter: "A", text: "active transport using ATP" },
            { letter: "B", text: "diffusion from higher to lower concentration" },
            { letter: "C", text: "osmosis through channel proteins" },
            { letter: "D", text: "endocytosis at the agar surface" }
          ],
          correct: "B"
        },
        {
          id: "divide",
          sol: "BIO.3.b",
          stem: "Which statement best explains why a large cell is more likely to divide than to keep growing?",
          choices: [
            { letter: "A", text: "A larger membrane lets in too much water at once." },
            { letter: "B", text: "Its membrane cannot exchange materials fast enough for its volume." },
            { letter: "C", text: "Its volume grows more slowly than its surface area." },
            { letter: "D", text: "Its cytoskeleton breaks when the cell gets too heavy." }
          ],
          correct: "B"
        },
        {
          id: "shapes",
          sol: "BIO.3.d",
          stem: "How do the two specialized cells in sentences 10 and 11 keep a high surface-area-to-volume ratio?",
          choices: [
            { letter: "A", text: "Intestinal cells fold their membrane; nerve cells stay very thin." },
            { letter: "B", text: "Both have thick, rounded shapes with very few folds." },
            { letter: "C", text: "Both contain far more cytoplasm than membrane." },
            { letter: "D", text: "Intestinal cells stop dividing; nerve cells grow rounder." }
          ],
          correct: "A"
        }
      ]
    },

    /* ---------- long · level 3 · stem cells and differentiation ---------- */
    {
      id: "cell-stem-cells",
      family: "CELL",
      title: "One Egg, Two Hundred Cell Types",
      kind: "Cells · BIO.3",
      blurb: "How stem cells differentiate, and why a skin cell cannot simply become a nerve cell.",
      level: 3,
      passage: "<p>" + N(1) + "A class studies how one fertilized egg becomes the roughly 200 cell types in a human body. " + N(2) + "Early embryonic cells are <strong>stem cells</strong>: unspecialized cells that can divide repeatedly and become many other kinds of cell. " + N(3) + "Every body cell keeps the same full set of genes, but as an embryo develops, chemical signals from neighboring cells switch different genes on or off in each cell. " + N(4) + "This process, <strong>differentiation</strong>, gives each cell type a shape and set of organelles that fit its job. " + N(5) + "The class compiles a table from their microscope work.</p>" +
        "<table><tr><th>Cell type</th><th>Shape or feature</th><th>Job</th></tr>" +
        "<tr><td>Nerve cell</td><td>long branching fibers</td><td>carries signals over long distances</td></tr>" +
        "<tr><td>Muscle cell</td><td>long, packed with protein fibers and mitochondria</td><td>contracts to move the body</td></tr>" +
        "<tr><td>Red blood cell</td><td>flattened disc, no nucleus</td><td>carries oxygen</td></tr>" +
        "<tr><td>Root hair cell (plant)</td><td>thin extension into soil</td><td>absorbs water and minerals</td></tr>" +
        "<tr><td>Guard cell (plant)</td><td>curved pair with a pore between</td><td>swells with water to open the pore</td></tr></table>" +
        "<p>" + N(6) + "Adult tissues keep a few stem cells, such as those in bone marrow that replace blood cells throughout life. " + N(7) + "A student asks why a skin cell cannot simply be moved to the brain to replace a damaged nerve cell. " + N(8) + "The teacher explains that the skin cell's nerve-related genes are switched off, and that a differentiated cell normally cannot go back. " + N(9) + "Researchers can, however, reprogram some adult cells in the lab by adding signals that reactivate embryonic genes. " + N(10) + "A red blood cell, having lost its nucleus, cannot be reprogrammed at all and lives only about four months before it is replaced.</p>",
      claims: [
        {
          id: "vocab",
          sol: "BIO.3.d",
          stem: "In sentence 2, a stem cell is a cell that —",
          choices: [
            { letter: "A", text: "has already developed a specialized shape" },
            { letter: "B", text: "can divide and become many types of cell" },
            { letter: "C", text: "has lost its nucleus and cannot divide" },
            { letter: "D", text: "carries signals over long distances" }
          ],
          correct: "B"
        },
        {
          id: "guard",
          sol: "BIO.3.c",
          stem: "According to the table, a guard cell opens its pore when water enters. For water to enter by osmosis, the guard cell's cytoplasm must be —",
          choices: [
            { letter: "A", text: "hypotonic to the surrounding cells" },
            { letter: "B", text: "equal in solute to the surrounding cells" },
            { letter: "C", text: "higher in solute than the surrounding cells" },
            { letter: "D", text: "free of any dissolved salts" }
          ],
          correct: "C"
        },
        {
          id: "muscle",
          sol: "BIO.3.d",
          stem: "Which statement best explains why a muscle cell contains many more mitochondria than a skin cell?",
          choices: [
            { letter: "A", text: "Muscle cells carry extra genes for building mitochondria." },
            { letter: "B", text: "Mitochondria contract to pull on the protein fibers." },
            { letter: "C", text: "Skin cells do not need any energy to function." },
            { letter: "D", text: "Contraction requires large amounts of ATP." }
          ],
          correct: "D"
        },
        {
          id: "two",
          sol: "BIO.3.d",
          stem: "Select TWO statements about differentiated cells that are supported by the passage.",
          choices: [
            { letter: "A", text: "Their genes are different from those in stem cells." },
            { letter: "B", text: "Signals from neighboring cells influence which genes are active." },
            { letter: "C", text: "They normally do not return to an unspecialized state." },
            { letter: "D", text: "They all keep a nucleus for their entire lives." }
          ],
          correct: ["B", "C"]
        },
        {
          id: "rbc",
          sol: "BIO.3.b",
          stem: "A red blood cell has no nucleus. Which consequence follows from this?",
          choices: [
            { letter: "A", text: "It cannot make new proteins to repair itself and must be replaced." },
            { letter: "B", text: "It can divide faster than cells that keep a nucleus." },
            { letter: "C", text: "It stores its DNA in its mitochondria instead." },
            { letter: "D", text: "It cannot carry oxygen without instructions from DNA." }
          ],
          correct: "A"
        },
        {
          id: "reprogram",
          sol: "BIO.3.d",
          stem: "Which claim is best supported by sentence 9?",
          choices: [
            { letter: "A", text: "Differentiation depends on which genes are active, not which are present." },
            { letter: "B", text: "Adult cells can never be changed once they have differentiated." },
            { letter: "C", text: "Reprogramming works by removing unneeded genes from a cell." },
            { letter: "D", text: "Embryonic genes are destroyed as development goes on." }
          ],
          correct: "A"
        }
      ]
    }
  ];

  for (var i = 0; i < PACKS.length; i++) P.push(PACKS[i]);
})(typeof window !== "undefined" ? window : global);
