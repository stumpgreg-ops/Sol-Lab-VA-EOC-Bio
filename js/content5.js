/* SOL Lab — Bacteria & Viruses (BIO.4). Original text only. */
(function (global) {
  var P = global.HEIST_PACKS;
  if (!P || !P.push) return;
  var N = function (i) { return '<span class="n">(' + i + ')</span> '; };   // numbered sentence

  var PACKS = [
    /* ---------------------------------------------------------------- tiny (40–70 words) */
    {
      id: "micro-alive-checklist",
      family: "MICRO",
      title: "Is It a Cell?",
      kind: "Bacteria & Viruses · BIO.4",
      blurb: "A class compares a bacterium and a virus feature by feature.",
      level: 1,
      passage: "<p>" + N(1) + "A biology class was asked to decide whether a bacterium and a virus each count as a living cell. " + N(2) + "Students compared the two using a <strong>checklist</strong> of features and recorded what they found. " + N(3) + "Each row of the table says whether the feature is present.</p>" +
        "<table><tr><th>Feature</th><th>Bacterium</th><th>Virus</th></tr>" +
        "<tr><td>Ribosomes</td><td>Yes</td><td>No</td></tr>" +
        "<tr><td>Own metabolism</td><td>Yes</td><td>No</td></tr>" +
        "<tr><td>Genetic material</td><td>Yes</td><td>Yes</td></tr>" +
        "<tr><td>Cell wall</td><td>Yes</td><td>No</td></tr>" +
        "<tr><td>Protein capsid</td><td>No</td><td>Yes</td></tr>" +
        "<tr><td>Size</td><td>2 µm</td><td>0.1 µm</td></tr></table>" +
        "<p>" + N(4) + "The class concluded that only the bacterium meets all the rules for a cell, while the virus must borrow what it lacks from a host.</p>",
      claims: [
        {
          id: "capsid-only",
          sol: "BIO.4.c",
          stem: "Based on the table, which structure is found in the virus but not in the bacterium?",
          choices: [
            { letter: "A", text: "ribosomes" },
            { letter: "B", text: "protein capsid" },
            { letter: "C", text: "cell wall" },
            { letter: "D", text: "genetic material" }
          ],
          correct: "B"
        },
        {
          id: "no-proteins",
          sol: "BIO.4.a",
          stem: "Which row of the table best explains why a virus cannot build its own proteins?",
          choices: [
            { letter: "A", text: "Genetic material" },
            { letter: "B", text: "Cell wall" },
            { letter: "C", text: "Ribosomes" },
            { letter: "D", text: "Size" }
          ],
          correct: "C"
        },
        {
          id: "not-alive",
          sol: "BIO.4.a",
          stem: "Which statement best explains why the class decided the virus is not a living cell?",
          choices: [
            { letter: "A", text: "It carries no genetic material of its own." },
            { letter: "B", text: "It is too small to see with a light microscope." },
            { letter: "C", text: "It has no cell wall, and every living thing needs one." },
            { letter: "D", text: "It has no metabolism and cannot reproduce on its own." }
          ],
          correct: "D"
        },
        {
          id: "checklist-vocab",
          sol: "BIO.4.c",
          stem: "In sentence 2, the checklist is best described as —",
          choices: [
            { letter: "A", text: "a list of features used to compare two things" },
            { letter: "B", text: "a set of steps for growing bacteria on agar" },
            { letter: "C", text: "a graph of how fast each organism grows" },
            { letter: "D", text: "a hypothesis about which one causes disease" }
          ],
          correct: "A"
        },
        {
          id: "size-ratio",
          sol: "BIO.4.c",
          stem: "Using the sizes in the table, about how many virus particles laid end to end would equal the length of one bacterium?",
          choices: [
            { letter: "A", text: "2" },
            { letter: "B", text: "10" },
            { letter: "C", text: "20" },
            { letter: "D", text: "200" }
          ],
          correct: "C"
        }
      ]
    },
    {
      id: "micro-yogurt-culture",
      family: "MICRO",
      title: "Yogurt in a Jar",
      kind: "Bacteria & Viruses · BIO.4",
      blurb: "Live bacteria turn warm milk into yogurt while students track the pH.",
      level: 1,
      passage: "<p>" + N(1) + "A food science class made yogurt by stirring a spoonful of live culture into warm milk. " + N(2) + "The culture contained bacteria that feed on milk sugar and release lactic acid. " + N(3) + "Students measured the pH every two hours as the bacteria multiplied by <strong>binary fission</strong>.</p>" +
        "<table><tr><th>Time (h)</th><th>pH</th><th>Texture</th></tr>" +
        "<tr><td>0</td><td>6.6</td><td>liquid</td></tr>" +
        "<tr><td>2</td><td>6.3</td><td>liquid</td></tr>" +
        "<tr><td>4</td><td>5.4</td><td>slightly thick</td></tr>" +
        "<tr><td>6</td><td>4.8</td><td>thick gel</td></tr></table>" +
        "<p>" + N(4) + "A second jar made with culture that had been boiled first stayed at pH 6.6 and never thickened.</p>",
      claims: [
        {
          id: "acid-thickens",
          sol: "BIO.4.d",
          stem: "Which conclusion is best supported by the data in the table?",
          choices: [
            { letter: "A", text: "The bacteria raise the pH of the milk as they grow." },
            { letter: "B", text: "Milk thickens on its own if it is kept warm long enough." },
            { letter: "C", text: "Boiling the culture is what causes yogurt to form." },
            { letter: "D", text: "Acid released by the bacteria makes the milk thicken." }
          ],
          correct: "D"
        },
        {
          id: "fission-vocab",
          sol: "BIO.4.b",
          stem: "In sentence 3, binary fission means the bacteria —",
          choices: [
            { letter: "A", text: "exchange plasmids through a pilus" },
            { letter: "B", text: "split into two identical cells" },
            { letter: "C", text: "burst open to release new viruses" },
            { letter: "D", text: "join together to form a spore" }
          ],
          correct: "B"
        },
        {
          id: "boiled-control",
          sol: "BIO.4.d",
          stem: "The jar made with boiled culture served as —",
          choices: [
            { letter: "A", text: "the independent variable in the investigation" },
            { letter: "B", text: "a control showing that live bacteria are needed" },
            { letter: "C", text: "a second trial using a different kind of milk" },
            { letter: "D", text: "a test of whether the milk sugar had run out" }
          ],
          correct: "B"
        },
        {
          id: "helpful-role",
          sol: "BIO.4.d",
          stem: "Which statement best describes the role of the bacteria in this investigation?",
          choices: [
            { letter: "A", text: "They are pathogens that spoil the milk." },
            { letter: "B", text: "They are decomposers breaking down the jar." },
            { letter: "C", text: "They are helpful microbes used to make a food." },
            { letter: "D", text: "They are viruses that infect the milk cells." }
          ],
          correct: "C"
        },
        {
          id: "biggest-drop",
          sol: "BIO.4.d",
          stem: "Between which two measurements did the pH drop the most?",
          choices: [
            { letter: "A", text: "2 h and 4 h" },
            { letter: "B", text: "0 h and 2 h" },
            { letter: "C", text: "4 h and 6 h" },
            { letter: "D", text: "the pH dropped by the same amount each time" }
          ],
          correct: "A"
        }
      ]
    },
    {
      id: "micro-phage-plaques",
      family: "MICRO",
      title: "Clear Spots on the Lawn",
      kind: "Bacteria & Viruses · BIO.4",
      blurb: "A bacteriophage leaves holes in a lawn of bacteria, but only where there are cells to infect.",
      level: 2,
      passage: "<p>" + N(1) + "A student spread a lawn of <em>Escherichia coli</em> on an agar plate and added a drop of liquid containing a <strong>bacteriophage</strong>, a virus that infects only bacteria. " + N(2) + "A day later the lawn was cloudy except for clear spots where cells had burst. " + N(3) + "Each phage is about 20 times smaller than a cell. " + N(4) + "A second plate given phage but no bacteria stayed clear, and its phage count did not change.</p>",
      claims: [
        {
          id: "no-host-no-copies",
          sol: "BIO.4.a",
          stem: "Which statement best explains why the phage count did not change on the second plate?",
          choices: [
            { letter: "A", text: "The phage needs a host cell to make copies of itself." },
            { letter: "B", text: "The phage died because the agar contained no sugar." },
            { letter: "C", text: "The phage was too small to be counted accurately." },
            { letter: "D", text: "The phage reproduces by binary fission very slowly." }
          ],
          correct: "A"
        },
        {
          id: "clear-spots",
          sol: "BIO.4.b",
          stem: "The clear spots on the first plate are best explained by —",
          choices: [
            { letter: "A", text: "bacteria dividing faster where the drop landed" },
            { letter: "B", text: "the phage entering cells and bursting them open" },
            { letter: "C", text: "the agar drying out near the centre of the plate" },
            { letter: "D", text: "bacteria taking in the phage particles as food" }
          ],
          correct: "B"
        },
        {
          id: "phage-vocab",
          sol: "BIO.4.c",
          stem: "In sentence 1, a bacteriophage is best described as —",
          choices: [
            { letter: "A", text: "a bacterium that feeds on other bacteria" },
            { letter: "B", text: "a plasmid that carries resistance genes" },
            { letter: "C", text: "a virus that infects bacterial cells" },
            { letter: "D", text: "a cell that has no nucleus" }
          ],
          correct: "C"
        },
        {
          id: "borrowed-ribosomes",
          sol: "BIO.4.a",
          stem: "Which structure does the phage lack and therefore must use from the host cell?",
          choices: [
            { letter: "A", text: "genetic material" },
            { letter: "B", text: "a protein coat" },
            { letter: "C", text: "tail fibres" },
            { letter: "D", text: "ribosomes" }
          ],
          correct: "D"
        }
      ]
    },

    /* ---------------------------------------------------------------- short (70–110 words) */
    {
      id: "micro-handwashing-clinic",
      family: "MICRO",
      title: "The Hand-Washing Rule",
      kind: "Bacteria & Viruses · BIO.4",
      blurb: "A clinic tracks wound infections before and after staff must wash their hands.",
      level: 1,
      passage: "<p>" + N(1) + "A small clinic noticed that many patients who came in for minor surgery developed wound infections afterwards. " + N(2) + "The clinic manager suspected that <strong>pathogens</strong>, disease-causing microbes, were being carried from one patient to the next on the hands of staff. " + N(3) + "Starting in March, every staff member was required to wash with soap and water before touching any patient. " + N(4) + "Nothing else about the clinic changed. " + N(5) + "The table shows the number of surgeries and wound infections each month.</p>" +
        "<table><tr><th>Month</th><th>Surgeries</th><th>Infections</th><th>Rate (%)</th></tr>" +
        "<tr><td>January</td><td>80</td><td>12</td><td>15</td></tr>" +
        "<tr><td>February</td><td>75</td><td>12</td><td>16</td></tr>" +
        "<tr><td>March</td><td>82</td><td>5</td><td>6</td></tr>" +
        "<tr><td>April</td><td>78</td><td>3</td><td>4</td></tr></table>" +
        "<p>" + N(6) + "The manager also swabbed unwashed hands and grew colonies of bacteria from every sample.</p>",
      claims: [
        {
          id: "rate-fell",
          sol: "BIO.4.e",
          stem: "Which conclusion do the data in the table best support?",
          choices: [
            { letter: "A", text: "Infections dropped after hand-washing became required." },
            { letter: "B", text: "Fewer patients had surgery once hand-washing began." },
            { letter: "C", text: "Hand-washing removed every pathogen from the clinic." },
            { letter: "D", text: "The infections were caused by cold winter weather." }
          ],
          correct: "A"
        },
        {
          id: "colonies-evidence",
          sol: "BIO.4.e",
          stem: "Which observation gives the most direct evidence that microbes were being carried on hands?",
          choices: [
            { letter: "A", text: "The rate was higher in February than in January." },
            { letter: "B", text: "Bacterial colonies grew from every unwashed hand." },
            { letter: "C", text: "The number of surgeries stayed about the same." },
            { letter: "D", text: "The clinic changed nothing else in March." }
          ],
          correct: "B"
        },
        {
          id: "pathogen-vocab",
          sol: "BIO.4.e",
          stem: "In sentence 2, a pathogen is —",
          choices: [
            { letter: "A", text: "any microbe that lives on the skin" },
            { letter: "B", text: "a chemical in soap that kills germs" },
            { letter: "C", text: "a microbe that causes disease" },
            { letter: "D", text: "a patient who carries an infection" }
          ],
          correct: "C"
        },
        {
          id: "nothing-else",
          sol: "BIO.4.e",
          stem: "Why is sentence 4 important to the investigation?",
          choices: [
            { letter: "A", text: "It shows that the sample size was large enough." },
            { letter: "B", text: "It proves that soap works better than alcohol gel." },
            { letter: "C", text: "It explains why the rate rose in February." },
            { letter: "D", text: "It rules out other causes for the drop in infections." }
          ],
          correct: "D"
        },
        {
          id: "predict-may",
          sol: "BIO.4.e",
          stem: "If the April rate continued and the clinic performed 100 surgeries in May, about how many wound infections would be expected?",
          choices: [
            { letter: "A", text: "4" },
            { letter: "B", text: "12" },
            { letter: "C", text: "16" },
            { letter: "D", text: "40" }
          ],
          correct: "A"
        }
      ]
    },
    {
      id: "micro-antibiotic-discs",
      family: "MICRO",
      title: "One Disc, Two Microbes",
      kind: "Bacteria & Viruses · BIO.4",
      blurb: "An antibiotic disc is tested against a bacterium and a virus side by side.",
      level: 2,
      passage: "<p>" + N(1) + "A student tested whether an <strong>antibiotic</strong> could stop the growth of two microbes: a bacterium taken from spoiled soup and a cold virus grown in a thin layer of animal cells. " + N(2) + "Each sample was spread on its own dish, and a paper disc soaked in the antibiotic was placed in the centre. " + N(3) + "After two days the student measured the clear ring around each disc where nothing grew. " + N(4) + "A disc soaked in plain water was placed on a third dish of the bacterium.</p>" +
        "<table><tr><th>Dish</th><th>Sample</th><th>Disc</th><th>Clear ring (mm)</th></tr>" +
        "<tr><td>1</td><td>Bacterium</td><td>Antibiotic</td><td>18</td></tr>" +
        "<tr><td>2</td><td>Virus in animal cells</td><td>Antibiotic</td><td>0</td></tr>" +
        "<tr><td>3</td><td>Bacterium</td><td>Water</td><td>0</td></tr></table>" +
        "<p>" + N(5) + "The antibiotic works by blocking the enzyme that builds the bacterial cell wall.</p>",
      claims: [
        {
          id: "disc-result",
          sol: "BIO.4.e",
          stem: "Which conclusion is best supported by the results in the table?",
          choices: [
            { letter: "A", text: "The antibiotic stopped the virus but not the bacterium." },
            { letter: "B", text: "The antibiotic stopped the bacterium but not the virus." },
            { letter: "C", text: "Water was as effective as the antibiotic on the bacterium." },
            { letter: "D", text: "The virus killed the animal cells before the disc could act." }
          ],
          correct: "B"
        },
        {
          id: "no-wall",
          sol: "BIO.4.c",
          stem: "Which statement best explains why the antibiotic had no effect on the virus?",
          choices: [
            { letter: "A", text: "Viruses have no cell wall for the antibiotic to attack." },
            { letter: "B", text: "Viruses are too large for the drug to get inside them." },
            { letter: "C", text: "The animal cells absorbed all of the antibiotic first." },
            { letter: "D", text: "The virus had already become resistant to the drug." }
          ],
          correct: "A"
        },
        {
          id: "water-disc",
          sol: "BIO.4.e",
          stem: "Dish 3 was included in order to —",
          choices: [
            { letter: "A", text: "test whether plain water can kill viruses" },
            { letter: "B", text: "give the bacteria extra moisture to grow" },
            { letter: "C", text: "measure how quickly the bacteria divide" },
            { letter: "D", text: "show that the paper disc alone does not stop growth" }
          ],
          correct: "D"
        },
        {
          id: "flu-misconception",
          sol: "BIO.4.e",
          stem: "A classmate says this antibiotic should also cure the flu. Which response is most accurate?",
          choices: [
            { letter: "A", text: "Yes, because antibiotics kill every kind of microbe." },
            { letter: "B", text: "Yes, as long as a large enough dose is taken." },
            { letter: "C", text: "No, because the flu is caused by a virus, not a bacterium." },
            { letter: "D", text: "No, because the flu is caused by a fungus, not a bacterium." }
          ],
          correct: "C"
        },
        {
          id: "soup-role",
          sol: "BIO.4.d",
          stem: "The bacteria growing in the spoiled soup were acting as —",
          choices: [
            { letter: "A", text: "pathogens infecting a living host" },
            { letter: "B", text: "decomposers breaking down food" },
            { letter: "C", text: "producers making their own food" },
            { letter: "D", text: "nitrogen fixers living in the soil" }
          ],
          correct: "B"
        },
        {
          id: "antibiotic-vocab",
          sol: "BIO.4.e",
          stem: "In sentence 1, an antibiotic is best described as —",
          choices: [
            { letter: "A", text: "a chemical that kills bacteria or stops their growth" },
            { letter: "B", text: "a vaccine that trains the body to fight infection" },
            { letter: "C", text: "a virus that infects and destroys bacterial cells" },
            { letter: "D", text: "a protein made by the body to attack viruses" }
          ],
          correct: "A"
        }
      ]
    },
    {
      id: "micro-bacteria-jobs",
      family: "MICRO",
      title: "Four Sealed Samples",
      kind: "Bacteria & Viruses · BIO.4",
      blurb: "Students match four bacterial samples to the jobs the bacteria are doing.",
      level: 1,
      passage: "<p>" + N(1) + "A teacher set out four sealed samples and asked students to match each to the role its bacteria play. " + N(2) + "Sample W was soil from a creek bank where a boat had leaked diesel; its bacteria were breaking the fuel into carbon dioxide and water, a process called <strong>bioremediation</strong>. " + N(3) + "Sample X was a flask of engineered bacteria carrying a human gene and producing insulin for people with diabetes. " + N(4) + "Sample Y was a rotting log from the Blue Ridge, full of decomposers. " + N(5) + "Sample Z was a swab from a healthy person's gut, where bacteria help digest food and make vitamins. " + N(6) + "Every sample contained cells with a cell wall and no nucleus.</p>" +
        "<table><tr><th>Sample</th><th>Source</th><th>Role</th></tr>" +
        "<tr><td>W</td><td>Diesel-soaked soil</td><td>Bioremediation</td></tr>" +
        "<tr><td>X</td><td>Engineered culture</td><td>Making insulin</td></tr>" +
        "<tr><td>Y</td><td>Rotting log</td><td>Decomposition</td></tr>" +
        "<tr><td>Z</td><td>Human gut</td><td>Digestion and vitamins</td></tr></table>",
      claims: [
        {
          id: "biotech-sample",
          sol: "BIO.4.d",
          stem: "Which sample shows bacteria being used in biotechnology?",
          choices: [
            { letter: "A", text: "Sample W" },
            { letter: "B", text: "Sample X" },
            { letter: "C", text: "Sample Y" },
            { letter: "D", text: "Sample Z" }
          ],
          correct: "B"
        },
        {
          id: "bioremediation-vocab",
          sol: "BIO.4.d",
          stem: "In sentence 2, bioremediation means —",
          choices: [
            { letter: "A", text: "using microbes to clean up pollution" },
            { letter: "B", text: "treating an infection with antibiotics" },
            { letter: "C", text: "recycling nutrients from dead plants" },
            { letter: "D", text: "adding bacteria to milk to make cheese" }
          ],
          correct: "A"
        },
        {
          id: "log-role",
          sol: "BIO.4.d",
          stem: "Which statement best describes the role of the bacteria in sample Y?",
          choices: [
            { letter: "A", text: "They cause a disease that kills the tree." },
            { letter: "B", text: "They fix nitrogen gas from the air." },
            { letter: "C", text: "They break down dead matter, recycling nutrients." },
            { letter: "D", text: "They produce insulin for the forest animals." }
          ],
          correct: "C"
        },
        {
          id: "flask-growth",
          sol: "BIO.4.b",
          stem: "The engineered bacteria in sample X grew from a few cells into a full flask by —",
          choices: [
            { letter: "A", text: "conjugation with human cells" },
            { letter: "B", text: "the lysogenic cycle" },
            { letter: "C", text: "meiosis" },
            { letter: "D", text: "binary fission" }
          ],
          correct: "D"
        },
        {
          id: "prokaryote-clue",
          sol: "BIO.4.c",
          stem: "Sentence 6 tells the students that every sample contains —",
          choices: [
            { letter: "A", text: "eukaryotic cells" },
            { letter: "B", text: "prokaryotic cells" },
            { letter: "C", text: "virus particles" },
            { letter: "D", text: "plant cells" }
          ],
          correct: "B"
        },
        {
          id: "insulin-how",
          sol: "BIO.4.d",
          stem: "Which statement best explains why the bacteria in sample X can make a human protein?",
          choices: [
            { letter: "A", text: "Bacteria naturally produce insulin for their own use." },
            { letter: "B", text: "The bacteria absorbed insulin from the growth medium." },
            { letter: "C", text: "The bacteria use the inserted human gene to build the protein." },
            { letter: "D", text: "Human cells were mixed into the culture with the bacteria." }
          ],
          correct: "C"
        }
      ]
    },

    /* ---------------------------------------------------------------- medium (110–160 words) */
    {
      id: "micro-lytic-lysogenic",
      family: "MICRO",
      title: "Hidden Phage, Sudden Burst",
      kind: "Bacteria & Viruses · BIO.4",
      blurb: "A model of the lytic and lysogenic cycles is tested with a flash of ultraviolet light.",
      level: 2,
      passage: "<p>" + N(1) + "A lab group built a model of how a <strong>bacteriophage</strong> reproduces inside a bacterial cell. " + N(2) + "The phage first attaches to the cell wall with its tail fibres and injects its DNA, leaving the protein <strong>capsid</strong> outside. " + N(3) + "In the <strong>lytic cycle</strong>, the phage DNA takes over the host's ribosomes and enzymes, hundreds of new phages are assembled, and the cell bursts within about 30 minutes. " + N(4) + "In the <strong>lysogenic cycle</strong>, the phage DNA instead joins the host chromosome and is copied each time the bacterium divides by binary fission, without harming the cell. " + N(5) + "Stress such as ultraviolet light can switch the hidden phage DNA into the lytic cycle. " + N(6) + "To test the model, the group infected a culture, split it into two flasks, and counted free phage particles over time, exposing one flask to UV light at 60 minutes.</p>" +
        "<table><tr><th>Time (min)</th><th>Free phages, no UV</th><th>Free phages, UV at 60 min</th></tr>" +
        "<tr><td>0</td><td>100</td><td>100</td></tr>" +
        "<tr><td>30</td><td>120</td><td>120</td></tr>" +
        "<tr><td>60</td><td>130</td><td>130</td></tr>" +
        "<tr><td>90</td><td>140</td><td>9,000</td></tr>" +
        "<tr><td>120</td><td>150</td><td>9,200</td></tr></table>" +
        "<p>" + N(7) + "The slow rise without UV suggested that most infected cells were carrying the phage DNA silently.</p>",
      claims: [
        {
          id: "uv-switch",
          sol: "BIO.4.b",
          stem: "Based on the table, what did the UV light most likely do?",
          choices: [
            { letter: "A", text: "Killed the phages so that fewer were free in the flask." },
            { letter: "B", text: "Switched infected cells from the lysogenic to the lytic cycle." },
            { letter: "C", text: "Caused the bacteria to divide faster and dilute the phages." },
            { letter: "D", text: "Made the phages attach to the cell wall more tightly." }
          ],
          correct: "B"
        },
        {
          id: "why-ribosomes",
          sol: "BIO.4.a",
          stem: "Which statement best explains why the phage needs the host's ribosomes?",
          choices: [
            { letter: "A", text: "Ribosomes copy the phage DNA into more DNA." },
            { letter: "B", text: "Ribosomes cut the cell wall so the phage can enter." },
            { letter: "C", text: "The phage has no ribosomes to build its capsid proteins." },
            { letter: "D", text: "The phage uses the ribosomes to store energy." }
          ],
          correct: "C"
        },
        {
          id: "lysogenic-vocab",
          sol: "BIO.4.b",
          stem: "In sentence 4, the lysogenic cycle is the stage in which the phage DNA —",
          choices: [
            { letter: "A", text: "is copied along with the host chromosome without bursting the cell" },
            { letter: "B", text: "takes over the cell and assembles hundreds of phages at once" },
            { letter: "C", text: "remains outside the cell, held in place by the tail fibres" },
            { letter: "D", text: "is broken down by the host cell's protective enzymes" }
          ],
          correct: "A"
        },
        {
          id: "capsid-outside",
          sol: "BIO.4.c",
          stem: "Which part of the phage stays outside the bacterium during infection?",
          choices: [
            { letter: "A", text: "the DNA" },
            { letter: "B", text: "the ribosomes" },
            { letter: "C", text: "the plasmid" },
            { letter: "D", text: "the capsid" }
          ],
          correct: "D"
        },
        {
          id: "slow-rise",
          sol: "BIO.4.b",
          stem: "Without UV, the count rose only from 100 to 150 over two hours. Which statement best explains this small rise?",
          choices: [
            { letter: "A", text: "A few infected cells went lytic while most stayed lysogenic." },
            { letter: "B", text: "Every infected cell burst and released one new phage." },
            { letter: "C", text: "The phages made copies of themselves in the liquid." },
            { letter: "D", text: "The bacteria built new phages as a defence." }
          ],
          correct: "A"
        },
        {
          id: "compare-reproduction",
          sol: "BIO.4.b",
          stem: "Which statement accurately compares how the bacterium and the phage make more of themselves?",
          choices: [
            { letter: "A", text: "Both divide by binary fission on their own." },
            { letter: "B", text: "The bacterium divides on its own; the phage must use a host cell." },
            { letter: "C", text: "The phage divides on its own; the bacterium must be infected first." },
            { letter: "D", text: "Both need another cell's enzymes to reproduce." }
          ],
          correct: "B"
        }
      ]
    },
    {
      id: "micro-clover-nodules",
      family: "MICRO",
      title: "Bumps on the Roots",
      kind: "Bacteria & Viruses · BIO.4",
      blurb: "Nitrogen-fixing bacteria in clover root nodules are put to the test in sterile sand.",
      level: 2,
      passage: "<p>" + N(1) + "A student noticed small bumps on the roots of clover growing in a pasture in the Shenandoah Valley. " + N(2) + "She learned that the bumps were <strong>root nodules</strong> housing <strong>nitrogen-fixing bacteria</strong>, which turn nitrogen gas from the air into ammonia the plant can use to build proteins. " + N(3) + "In return the plant supplies the bacteria with sugar. " + N(4) + "To test whether the bacteria really help the plant, she grew clover in sterilised sand with no nitrogen fertiliser. " + N(5) + "Half the pots were dusted with a powder containing the live bacteria; the other half received sterile powder. " + N(6) + "After six weeks she counted nodules and measured the dry mass of the plants.</p>" +
        "<table><tr><th>Treatment</th><th>Pots</th><th>Nodules per plant</th><th>Dry mass (g)</th></tr>" +
        "<tr><td>Live bacteria</td><td>6</td><td>24</td><td>1.8</td></tr>" +
        "<tr><td>Sterile powder</td><td>6</td><td>0</td><td>0.6</td></tr></table>" +
        "<p>" + N(7) + "Under the microscope the bacteria appeared as rod-shaped cells about 1 µm long with a cell wall but no nucleus. " + N(8) + "Some cells had a whip-like <strong>flagellum</strong> that they used to swim toward the root.</p>",
      claims: [
        {
          id: "nodule-mass",
          sol: "BIO.4.d",
          stem: "Which conclusion about the clover is best supported by the table?",
          choices: [
            { letter: "A", text: "The bacteria caused a disease that shrank the plants." },
            { letter: "B", text: "Clover with the bacteria grew larger than clover without them." },
            { letter: "C", text: "The sterile powder supplied nitrogen to the plants." },
            { letter: "D", text: "Nodules formed whether or not bacteria were present." }
          ],
          correct: "B"
        },
        {
          id: "mutual-benefit",
          sol: "BIO.4.d",
          stem: "The relationship described in sentences 2 and 3 is one in which —",
          choices: [
            { letter: "A", text: "the bacteria harm the plant as pathogens" },
            { letter: "B", text: "the plant decomposes the bacteria for food" },
            { letter: "C", text: "both the plant and the bacteria benefit" },
            { letter: "D", text: "the plant benefits and the bacteria are harmed" }
          ],
          correct: "C"
        },
        {
          id: "why-sterile-sand",
          sol: "BIO.4.d",
          stem: "Why did the student use sterilised sand and no fertiliser?",
          choices: [
            { letter: "A", text: "So the only nitrogen available would be what the bacteria fixed." },
            { letter: "B", text: "So the sand would hold more water around the roots." },
            { letter: "C", text: "So the bacteria would grow faster in the pots." },
            { letter: "D", text: "So the plants would all start with the same mass." }
          ],
          correct: "A"
        },
        {
          id: "flagellum-vocab",
          sol: "BIO.4.c",
          stem: "In sentence 8, a flagellum is a structure used for —",
          choices: [
            { letter: "A", text: "attaching to other cells" },
            { letter: "B", text: "swimming through liquid" },
            { letter: "C", text: "building new proteins" },
            { letter: "D", text: "storing the cell's DNA" }
          ],
          correct: "B"
        },
        {
          id: "prokaryote-evidence",
          sol: "BIO.4.c",
          stem: "Sentence 7 shows that the bacteria are —",
          choices: [
            { letter: "A", text: "eukaryotic, because they have a cell wall" },
            { letter: "B", text: "viruses, because they are so small" },
            { letter: "C", text: "prokaryotic, because they lack a nucleus" },
            { letter: "D", text: "fungi, because they are rod-shaped" }
          ],
          correct: "C"
        },
        {
          id: "nodule-fission",
          sol: "BIO.4.b",
          stem: "The bacteria inside a nodule increase in number by —",
          choices: [
            { letter: "A", text: "the lytic cycle, bursting the root cells" },
            { letter: "B", text: "meiosis, producing gametes" },
            { letter: "C", text: "being built by the plant's ribosomes" },
            { letter: "D", text: "binary fission, producing identical cells" }
          ],
          correct: "D"
        }
      ]
    },
    {
      id: "micro-plasmid-resistance",
      family: "MICRO",
      title: "The Spreading Plasmid",
      kind: "Bacteria & Viruses · BIO.4",
      blurb: "A resistance gene on a plasmid spreads through two flasks, one with the antibiotic and one without.",
      level: 3,
      passage: "<p>" + N(1) + "A hospital lab tracked a strain of bacteria in which a small ring of DNA, a <strong>plasmid</strong>, carries a gene for resistance to the antibiotic cefrolin. " + N(2) + "Bacteria pass plasmids to neighbours through a bridge called a pilus in a process known as <strong>conjugation</strong>, so the gene can spread even to cells that were not born with it. " + N(3) + "The lab mixed resistant and non-resistant cells, divided the mixture into two flasks, and grew both for ten generations, adding cefrolin only to flask B.</p>" +
        "<table><tr><th>Generation</th><th>Flask A (no drug), % resistant</th><th>Flask B (with drug), % resistant</th></tr>" +
        "<tr><td>0</td><td>5</td><td>5</td></tr>" +
        "<tr><td>4</td><td>9</td><td>62</td></tr>" +
        "<tr><td>10</td><td>12</td><td>97</td></tr></table>" +
        "<p>" + N(4) + "In flask B the drug killed most non-resistant cells, and the survivors divided by binary fission, each copying its plasmid. " + N(5) + "In flask A the slow rise came from conjugation alone. " + N(6) + "A later sample from flask B also carried a new <strong>mutation</strong> in a chromosomal gene that gave resistance to a second drug.</p>",
      claims: [
        {
          id: "selection-97",
          sol: "BIO.4.e",
          stem: "Which statement best explains the rise to 97% resistant in flask B?",
          choices: [
            { letter: "A", text: "The drug caused the bacteria to mutate into resistant forms." },
            { letter: "B", text: "The bacteria learned to resist the drug after repeated exposure." },
            { letter: "C", text: "The drug switched on the resistance gene inside every cell." },
            { letter: "D", text: "Resistant cells survived and reproduced while the others died." }
          ],
          correct: "D"
        },
        {
          id: "flask-a-rise",
          sol: "BIO.4.b",
          stem: "Which statement best explains why the percentage rose in flask A even without the drug?",
          choices: [
            { letter: "A", text: "Non-resistant cells died of old age." },
            { letter: "B", text: "Resistant cells reproduced much faster in the flask." },
            { letter: "C", text: "Plasmids were passed to non-resistant cells by conjugation." },
            { letter: "D", text: "The gene mutated in many cells at the same time." }
          ],
          correct: "C"
        },
        {
          id: "conjugation-vocab",
          sol: "BIO.4.b",
          stem: "In sentence 2, conjugation is best described as —",
          choices: [
            { letter: "A", text: "a bacterium splitting into two identical daughter cells" },
            { letter: "B", text: "the transfer of DNA from one bacterial cell to another" },
            { letter: "C", text: "a virus inserting its DNA into a bacterial chromosome" },
            { letter: "D", text: "a random change in a bacterium's DNA sequence" }
          ],
          correct: "B"
        },
        {
          id: "variation-two",
          sol: "BIO.4.b",
          stem: "Select TWO processes described in the passage that are sources of genetic variation in bacteria.",
          choices: [
            { letter: "A", text: "conjugation" },
            { letter: "B", text: "binary fission" },
            { letter: "C", text: "mutation" },
            { letter: "D", text: "the lytic cycle" }
          ],
          correct: ["A", "C"]
        },
        {
          id: "plasmid-vs-chromosome",
          sol: "BIO.4.c",
          stem: "A plasmid differs from the bacterial chromosome because a plasmid —",
          choices: [
            { letter: "A", text: "is built from RNA instead of DNA" },
            { letter: "B", text: "holds every gene the cell needs to live" },
            { letter: "C", text: "is found only inside virus capsids" },
            { letter: "D", text: "is a small extra ring that can be shared" }
          ],
          correct: "D"
        },
        {
          id: "antibiotic-lesson",
          sol: "BIO.4.e",
          stem: "Which conclusion about antibiotic use is best supported by the data?",
          choices: [
            { letter: "A", text: "Antibiotics should be stopped after a single generation." },
            { letter: "B", text: "Using an antibiotic selects for resistant bacteria in a population." },
            { letter: "C", text: "Antibiotics cause plasmids to appear inside bacteria." },
            { letter: "D", text: "Resistance disappears as soon as the drug is removed." }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------------------------------------------------------------- long (160–220 words) */
    {
      id: "micro-broth-flasks",
      family: "MICRO",
      title: "Four Flasks of Broth",
      kind: "Bacteria & Viruses · BIO.4",
      blurb: "A class rebuilds the bent-neck flask experiment that helped establish the germ theory.",
      level: 3,
      passage: "<p>" + N(1) + "Before the <strong>germ theory</strong> was accepted, many people believed that microbes appeared on their own inside spoiled food. " + N(2) + "A class repeated a classic experiment to test this idea. " + N(3) + "Four flasks were filled with clear meat broth, and three of them were boiled to kill any microbes already present. " + N(4) + "Flask 1 was then left open to the air. " + N(5) + "Flask 2 was sealed with a stopper. " + N(6) + "Flask 3 had a long neck bent into an S shape, so air could enter but dust and microbes settled in the bend and never reached the broth. " + N(7) + "Flask 4 was not boiled and was left open. " + N(8) + "The students checked each flask for cloudiness, a sign of microbial growth, after two days and after two weeks.</p>" +
        "<table><tr><th>Flask</th><th>Treatment</th><th>2 days</th><th>2 weeks</th></tr>" +
        "<tr><td>1</td><td>Boiled, open</td><td>Cloudy</td><td>Cloudy</td></tr>" +
        "<tr><td>2</td><td>Boiled, sealed</td><td>Clear</td><td>Clear</td></tr>" +
        "<tr><td>3</td><td>Boiled, S-neck</td><td>Clear</td><td>Clear</td></tr>" +
        "<tr><td>4</td><td>Not boiled, open</td><td>Cloudy</td><td>Cloudy</td></tr></table>" +
        "<p>" + N(9) + "When the students tipped flask 3 so the broth touched the dust in the bend, it turned cloudy within a day. " + N(10) + "The teacher explained that the same logic supports <strong>pasteurisation</strong>, in which milk is heated briefly to kill most microbes and then kept sealed and cold. " + N(11) + "To show that a particular microbe causes a particular disease, scientists later set out rules: the microbe must be found in every sick individual, be grown in pure culture, cause the same disease when given to a healthy host, and be recovered again from that host.</p>",
      claims: [
        {
          id: "air-not-broth",
          sol: "BIO.4.e",
          stem: "Which conclusion is best supported by the results for flasks 1, 2 and 3?",
          choices: [
            { letter: "A", text: "Microbes appear on their own in any broth exposed to air." },
            { letter: "B", text: "Boiling changes the broth so that microbes can no longer live in it." },
            { letter: "C", text: "Microbes in the broth come from the air and dust, not from the broth itself." },
            { letter: "D", text: "Sealing a flask causes microbes to form inside it." }
          ],
          correct: "C"
        },
        {
          id: "why-s-neck",
          sol: "BIO.4.e",
          stem: "Why was flask 3 the most important flask in the experiment?",
          choices: [
            { letter: "A", text: "It let air in but kept microbes out, separating the two explanations." },
            { letter: "B", text: "It proved that boiling is unnecessary for keeping broth clear." },
            { letter: "C", text: "It showed that microbes need fresh air in order to grow." },
            { letter: "D", text: "It stayed clear because the broth inside it was never boiled." }
          ],
          correct: "A"
        },
        {
          id: "broth-decomposers",
          sol: "BIO.4.d",
          stem: "The microbes that clouded flasks 1 and 4 were breaking down the broth's proteins for energy. In nature this same activity makes many bacteria important as —",
          choices: [
            { letter: "A", text: "producers" },
            { letter: "B", text: "nitrogen fixers" },
            { letter: "C", text: "pathogens" },
            { letter: "D", text: "decomposers" }
          ],
          correct: "D"
        },
        {
          id: "pasteurisation-vocab",
          sol: "BIO.4.e",
          stem: "In sentence 10, pasteurisation is best described as —",
          choices: [
            { letter: "A", text: "adding live bacteria to milk to make it thicker" },
            { letter: "B", text: "sealing milk in bottles without heating it" },
            { letter: "C", text: "heating milk briefly to kill most microbes" },
            { letter: "D", text: "filtering milk through an S-shaped tube" }
          ],
          correct: "C"
        },
        {
          id: "postulates-two",
          sol: "BIO.4.e",
          stem: "A student wants to show that a particular bacterium causes a disease in fish at a Chesapeake Bay hatchery. Select TWO steps that follow the rules in sentence 11.",
          choices: [
            { letter: "A", text: "Grow the bacterium from a sick fish in pure culture." },
            { letter: "B", text: "Show that healthy fish given the pure culture develop the disease." },
            { letter: "C", text: "Treat the sick fish with antibiotics and see whether they recover." },
            { letter: "D", text: "Count how many bacteria live in the hatchery water." }
          ],
          correct: ["A", "B"]
        },
        {
          id: "no-virus-broth",
          sol: "BIO.4.a",
          stem: "Which statement explains why this experiment could not be done with a virus in place of bacteria?",
          choices: [
            { letter: "A", text: "Viruses are killed by air but not by boiling." },
            { letter: "B", text: "Viruses cannot multiply in broth because it contains no living cells." },
            { letter: "C", text: "Viruses are too large to pass through an S-shaped neck." },
            { letter: "D", text: "Viruses make broth turn clear rather than cloudy." }
          ],
          correct: "B"
        }
      ]
    },
    {
      id: "micro-vaccine-outbreak",
      family: "MICRO",
      title: "Outbreak at Two Schools",
      kind: "Bacteria & Viruses · BIO.4",
      blurb: "A health office compares illness rates in vaccinated and unvaccinated students during a viral outbreak.",
      level: 3,
      passage: "<p>" + N(1) + "A county health office investigated an outbreak of a viral illness that spread through two neighbouring high schools. " + N(2) + "The virus travels in droplets from coughs and, once inside a person, enters cells lining the throat and uses those cells' ribosomes and energy to make thousands of copies of itself. " + N(3) + "The virus is a strand of RNA inside a protein <strong>capsid</strong>, wrapped in a fatty <strong>envelope</strong> taken from the host cell membrane. " + N(4) + "Both schools had offered a <strong>vaccine</strong> in the autumn, which contains harmless pieces of the capsid protein so that the immune system learns to recognise the real virus and destroy it quickly. " + N(5) + "The table shows how many students in each group became ill.</p>" +
        "<table><tr><th>Group</th><th>Students</th><th>Became ill</th><th>Rate (%)</th></tr>" +
        "<tr><td>North HS, vaccinated</td><td>600</td><td>12</td><td>2</td></tr>" +
        "<tr><td>North HS, unvaccinated</td><td>200</td><td>50</td><td>25</td></tr>" +
        "<tr><td>South HS, vaccinated</td><td>300</td><td>6</td><td>2</td></tr>" +
        "<tr><td>South HS, unvaccinated</td><td>500</td><td>120</td><td>24</td></tr></table>" +
        "<p>" + N(6) + "The nurse also swabbed throats: the virus's RNA was detected in 96 of 100 swabs from ill students but in none of 100 swabs from healthy students. " + N(7) + "Several parents asked for antibiotics, but the office explained that antibiotics attack structures such as the bacterial cell wall, which this virus does not have. " + N(8) + "Instead, ill students were told to rest, and their healthy classmates were offered the vaccine.</p>",
      claims: [
        {
          id: "vaccine-rate",
          sol: "BIO.4.e",
          stem: "Which conclusion do the rates in the table best support?",
          choices: [
            { letter: "A", text: "The vaccine made students at both schools more likely to become ill." },
            { letter: "B", text: "Vaccinated students became ill at a much lower rate than unvaccinated ones." },
            { letter: "C", text: "South HS had a lower overall rate of illness than North HS did." },
            { letter: "D", text: "The vaccine protected students at North HS but not at South HS." }
          ],
          correct: "B"
        },
        {
          id: "swab-evidence",
          sol: "BIO.4.e",
          stem: "Which observation gives the strongest evidence that this particular virus caused the illness?",
          choices: [
            { letter: "A", text: "The outbreak spread through two schools at the same time." },
            { letter: "B", text: "Several parents asked the office for antibiotics." },
            { letter: "C", text: "The virus travels in droplets released by coughing." },
            { letter: "D", text: "Viral RNA was found in ill students but not in healthy ones." }
          ],
          correct: "D"
        },
        {
          id: "vaccine-vocab",
          sol: "BIO.4.e",
          stem: "In sentence 4, the vaccine works by —",
          choices: [
            { letter: "A", text: "killing the virus directly once it reaches the throat" },
            { letter: "B", text: "forming a barrier that keeps the virus out of the body" },
            { letter: "C", text: "training the immune system to recognise the virus before infection" },
            { letter: "D", text: "replacing the throat cells that the virus has damaged" }
          ],
          correct: "C"
        },
        {
          id: "not-alive-alone",
          sol: "BIO.4.a",
          stem: "Sentence 2 supports the idea that the virus is not alive on its own because the virus —",
          choices: [
            { letter: "A", text: "cannot make copies without a host cell's ribosomes and energy" },
            { letter: "B", text: "is spread by coughing rather than by direct touch" },
            { letter: "C", text: "carries its genetic information as RNA rather than DNA" },
            { letter: "D", text: "has an envelope that came from the host cell membrane" }
          ],
          correct: "A"
        },
        {
          id: "why-no-antibiotics",
          sol: "BIO.4.c",
          stem: "Why was the office correct that antibiotics would not help the ill students?",
          choices: [
            { letter: "A", text: "Antibiotics only work in people who have already been vaccinated." },
            { letter: "B", text: "The virus has no cell wall or other bacterial structure for the drug to target." },
            { letter: "C", text: "Antibiotics attack the capsid, which the virus hides inside its envelope." },
            { letter: "D", text: "The virus is too small for the antibiotic molecules to reach it." }
          ],
          correct: "B"
        },
        {
          id: "vaccinate-healthy",
          sol: "BIO.4.e",
          stem: "Why did the office offer the vaccine to healthy classmates rather than to students who were already ill?",
          choices: [
            { letter: "A", text: "The vaccine cures the illness as soon as symptoms begin to appear." },
            { letter: "B", text: "Healthy students carry a larger amount of the virus than ill ones." },
            { letter: "C", text: "Vaccines take time to build immunity, so they protect people before exposure." },
            { letter: "D", text: "The vaccine is a type of antibiotic that works only on healthy people." }
          ],
          correct: "C"
        }
      ]
    }
  ];

  for (var i = 0; i < PACKS.length; i++) P.push(PACKS[i]);
})(typeof window !== "undefined" ? window : global);
