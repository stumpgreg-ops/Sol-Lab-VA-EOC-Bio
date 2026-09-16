/* SOL Lab — Evolution & Classification (BIO.6, BIO.7). Original text only. */
(function (global) {
  var P = global.HEIST_PACKS;
  if (!P || !P.push) return;
  var N = function (i) { return '<span class="n">(' + i + ')</span> '; };   // numbered sentence

  var PACKS = [
    /* ---------- tiny · level 1 · classification ---------- */
    {
      id: "evo-four-samples",
      family: "EVO",
      title: "Sorting Four Samples",
      kind: "Classification · BIO.6",
      blurb: "Four unlabeled samples, four traits, six kingdoms and three domains.",
      level: 1,
      passage: "<p>" + N(1) + "A class received four unlabeled samples and examined each under a microscope. " + N(2) + "Students recorded the <strong>cell type</strong>, whether a cell wall was present, how the organism obtains food, and whether it is unicellular or multicellular. " + N(3) + "The results are in the table. " + N(4) + "Sample W lacked a nucleus, so the class placed it in a different domain from the other three.</p>" +
        "<table><tr><th>Sample</th><th>Nucleus</th><th>Cell wall</th><th>Nutrition</th><th>Cells</th></tr>" +
        "<tr><td>W</td><td>no</td><td>yes</td><td>absorbs food</td><td>one</td></tr>" +
        "<tr><td>X</td><td>yes</td><td>yes (chitin)</td><td>absorbs food</td><td>many</td></tr>" +
        "<tr><td>Y</td><td>yes</td><td>yes (cellulose)</td><td>makes own food</td><td>many</td></tr>" +
        "<tr><td>Z</td><td>yes</td><td>no</td><td>ingests food</td><td>many</td></tr></table>",
      claims: [
        {
          id: "kingdom-x",
          sol: "BIO.6.a",
          stem: "Based on the table, sample X belongs to kingdom —",
          choices: [
            { letter: "A", text: "Fungi, because it absorbs food through chitin walls" },
            { letter: "B", text: "Plantae, because it has a cell wall" },
            { letter: "C", text: "Animalia, because it is multicellular" },
            { letter: "D", text: "Protista, because it has a nucleus" }
          ],
          correct: "A"
        },
        {
          id: "domain-w",
          sol: "BIO.6.a",
          stem: "Sample W lacked a nucleus (sentence 4). Which domain could sample W belong to?",
          choices: [
            { letter: "A", text: "Eukarya only" },
            { letter: "B", text: "Bacteria or Archaea" },
            { letter: "C", text: "Fungi or Protista" },
            { letter: "D", text: "Animalia only" }
          ],
          correct: "B"
        },
        {
          id: "cell-type",
          sol: "BIO.6.a",
          stem: "In sentence 2, <strong>cell type</strong> refers to whether a cell is —",
          choices: [
            { letter: "A", text: "unicellular or multicellular" },
            { letter: "B", text: "autotrophic or heterotrophic" },
            { letter: "C", text: "prokaryotic or eukaryotic" },
            { letter: "D", text: "living or nonliving" }
          ],
          correct: "C"
        },
        {
          id: "animalia",
          sol: "BIO.6.a",
          stem: "Which sample would be placed in kingdom Animalia, and why?",
          choices: [
            { letter: "A", text: "Sample W, because it has no nucleus" },
            { letter: "B", text: "Sample Y, because it makes its own food" },
            { letter: "C", text: "Sample X, because its wall contains chitin" },
            { letter: "D", text: "Sample Z, because it ingests food and has no wall" }
          ],
          correct: "D"
        },
        {
          id: "archaea-added",
          sol: "BIO.6.e",
          stem: "Domain Archaea was added after scientists found that some prokaryotes differ sharply from bacteria in their ribosomal RNA. This change shows that classification systems —",
          choices: [
            { letter: "A", text: "are fixed once they are published" },
            { letter: "B", text: "change as new evidence is discovered" },
            { letter: "C", text: "rely only on visible structures" },
            { letter: "D", text: "group organisms by their habitat" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- short · level 1 · classification ---------- */
    {
      id: "evo-creek-key",
      family: "EVO",
      title: "Keying Out a Creek Animal",
      kind: "Classification · BIO.6",
      blurb: "Use a four-step dichotomous key to name three stream specimens.",
      level: 1,
      passage: "<p>" + N(1) + "A stream group in the Shenandoah Valley netted small animals and used a <strong>dichotomous key</strong> to name them. " + N(2) + "Each choice names the animal or sends the user to another step. " + N(3) + "Specimen 1 had six legs, two tail filaments, and abdominal gills. " + N(4) + "Specimen 2 had eight legs. " + N(5) + "Specimen 3 had seven pairs of legs.</p>" +
        "<ol>" +
        "<li>Three pairs of legs: go to 2. Four or more pairs of legs: go to 3.</li>" +
        "<li>Three tail filaments: mayfly nymph. Two tail filaments: go to 4.</li>" +
        "<li>Four pairs of legs: water mite. Seven pairs of legs: aquatic sowbug.</li>" +
        "<li>Gills along the abdomen: hellgrammite. No gills on the abdomen: stonefly nymph.</li>" +
        "</ol>",
      claims: [
        {
          id: "specimen-1",
          sol: "BIO.6.a",
          stem: "Using the key, specimen 1 is a —",
          choices: [
            { letter: "A", text: "mayfly nymph" },
            { letter: "B", text: "stonefly nymph" },
            { letter: "C", text: "hellgrammite" },
            { letter: "D", text: "water mite" }
          ],
          correct: "C"
        },
        {
          id: "specimen-2",
          sol: "BIO.6.a",
          stem: "Specimen 2 keys out as a water mite because it —",
          choices: [
            { letter: "A", text: "has exactly three pairs of legs" },
            { letter: "B", text: "has exactly four pairs of legs" },
            { letter: "C", text: "has gills along its abdomen" },
            { letter: "D", text: "has more than four pairs of legs" }
          ],
          correct: "B"
        },
        {
          id: "specimen-3",
          sol: "BIO.6.a",
          stem: "Specimen 3 keys out as —",
          choices: [
            { letter: "A", text: "an aquatic sowbug" },
            { letter: "B", text: "a water mite" },
            { letter: "C", text: "a hellgrammite" },
            { letter: "D", text: "a mayfly nymph" }
          ],
          correct: "A"
        },
        {
          id: "key-term",
          sol: "BIO.6.a",
          stem: "In sentence 1, a <strong>dichotomous key</strong> is best described as a tool that —",
          choices: [
            { letter: "A", text: "lists every species found in a stream" },
            { letter: "B", text: "sorts organisms by their DNA sequences" },
            { letter: "C", text: "ranks organisms from simplest to most complex" },
            { letter: "D", text: "identifies organisms through paired choices" }
          ],
          correct: "D"
        },
        {
          id: "new-animal",
          sol: "BIO.6.e",
          stem: "The group then finds an insect nymph with three pairs of legs and a single tail filament. Which statement best describes what the group should do?",
          choices: [
            { letter: "A", text: "Discard the specimen because it does not fit the key" },
            { letter: "B", text: "Revise the key to add a step for the new animal" },
            { letter: "C", text: "Record it as a hellgrammite because it has gills" },
            { letter: "D", text: "Record it as a water mite because it is small" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- tiny · level 1 · classification ---------- */
    {
      id: "evo-two-oaks",
      family: "EVO",
      title: "Two Names for Two Oaks",
      kind: "Classification · BIO.6",
      blurb: "Binomial names and the taxonomic hierarchy for three Blue Ridge trees.",
      level: 1,
      passage: "<p>" + N(1) + "A forestry student compared the white oak, <em>Quercus alba</em>, and the chestnut oak, <em>Quercus montana</em>, with the American chestnut, <em>Castanea dentata</em>. " + N(2) + "All three are placed in the beech family, Fagaceae, but only the two oaks share a genus. " + N(3) + "The student listed the ranks of the <strong>taxonomic hierarchy</strong> in the table, from broadest to narrowest. " + N(4) + "Each name follows binomial nomenclature, the system Linnaeus introduced in the 1700s.</p>" +
        "<table><tr><th>Rank</th><th>White oak</th><th>Chestnut oak</th><th>American chestnut</th></tr>" +
        "<tr><td>Kingdom</td><td>Plantae</td><td>Plantae</td><td>Plantae</td></tr>" +
        "<tr><td>Order</td><td>Fagales</td><td>Fagales</td><td>Fagales</td></tr>" +
        "<tr><td>Family</td><td>Fagaceae</td><td>Fagaceae</td><td>Fagaceae</td></tr>" +
        "<tr><td>Genus</td><td><em>Quercus</em></td><td><em>Quercus</em></td><td><em>Castanea</em></td></tr>" +
        "<tr><td>Species</td><td><em>Q. alba</em></td><td><em>Q. montana</em></td><td><em>C. dentata</em></td></tr></table>",
      claims: [
        {
          id: "closest-pair",
          sol: "BIO.6.a",
          stem: "Based on the table, the two trees that are most closely related are the —",
          choices: [
            { letter: "A", text: "white oak and American chestnut, which share an order" },
            { letter: "B", text: "white oak and chestnut oak, which share a genus" },
            { letter: "C", text: "chestnut oak and American chestnut, which share a family" },
            { letter: "D", text: "three trees equally, because all share a kingdom" }
          ],
          correct: "B"
        },
        {
          id: "alba",
          sol: "BIO.6.a",
          stem: "In the name <em>Quercus alba</em>, the word <em>alba</em> is the —",
          choices: [
            { letter: "A", text: "family name" },
            { letter: "B", text: "genus name" },
            { letter: "C", text: "species name" },
            { letter: "D", text: "order name" }
          ],
          correct: "C"
        },
        {
          id: "hierarchy",
          sol: "BIO.6.a",
          stem: "In sentence 3, the <strong>taxonomic hierarchy</strong> is a system of ranks in which —",
          choices: [
            { letter: "A", text: "each lower rank holds fewer, more similar organisms" },
            { letter: "B", text: "each lower rank holds more, less similar organisms" },
            { letter: "C", text: "every rank holds the same set of organisms" },
            { letter: "D", text: "only genus and species are used to rank organisms" }
          ],
          correct: "A"
        },
        {
          id: "missing-ranks",
          sol: "BIO.6.a",
          stem: "Which ranks would fill the gap between kingdom and order in the table?",
          choices: [
            { letter: "A", text: "domain and phylum" },
            { letter: "B", text: "class and family" },
            { letter: "C", text: "genus and species" },
            { letter: "D", text: "phylum and class" }
          ],
          correct: "D"
        },
        {
          id: "why-binomial",
          sol: "BIO.6.a",
          stem: "Why do scientists use a binomial name such as <em>Quercus alba</em> rather than a common name?",
          choices: [
            { letter: "A", text: "One name refers to one species in every language" },
            { letter: "B", text: "Latin names describe how a plant is used" },
            { letter: "C", text: "Scientific names are shorter than common names" },
            { letter: "D", text: "Common names cannot be printed in field guides" }
          ],
          correct: "A"
        }
      ]
    },

    /* ---------- medium · level 2 · classification ---------- */
    {
      id: "evo-trait-table",
      family: "EVO",
      title: "Reading a Trait Table",
      kind: "Classification · BIO.6",
      blurb: "Five animals, three derived traits, one cladogram described in words.",
      level: 2,
      passage: "<p>" + N(1) + "A museum volunteer was asked to arrange five animals on a <strong>cladogram</strong>, a branching diagram that shows the order in which groups split from common ancestors. " + N(2) + "She scored each animal for three <strong>derived traits</strong>, features that arose in an ancestor and were passed to all of its descendants. " + N(3) + "The table shows the results. " + N(4) + "Only the fox has fur, which appeared after the amniotic egg. " + N(5) + "On the finished diagram the lamprey branches off first, then the bass, then the salamander, and the turtle and fox share the last branch point. " + N(6) + "A visitor argued that the bass and the salamander should be grouped together because both are found in ponds. " + N(7) + "The volunteer explained that habitat is not a derived trait and that the diagram groups organisms by shared ancestry, not by where they live.</p>" +
        "<table><tr><th>Animal</th><th>Jaws</th><th>Four limbs</th><th>Amniotic egg</th></tr>" +
        "<tr><td>Lamprey</td><td>no</td><td>no</td><td>no</td></tr>" +
        "<tr><td>Bass</td><td>yes</td><td>no</td><td>no</td></tr>" +
        "<tr><td>Salamander</td><td>yes</td><td>yes</td><td>no</td></tr>" +
        "<tr><td>Turtle</td><td>yes</td><td>yes</td><td>yes</td></tr>" +
        "<tr><td>Fox</td><td>yes</td><td>yes</td><td>yes</td></tr></table>",
      claims: [
        {
          id: "closest",
          sol: "BIO.6.a",
          stem: "Based on the table, which two animals are most closely related?",
          choices: [
            { letter: "A", text: "lamprey and bass" },
            { letter: "B", text: "bass and salamander" },
            { letter: "C", text: "salamander and turtle" },
            { letter: "D", text: "turtle and fox" }
          ],
          correct: "D"
        },
        {
          id: "shared-trait",
          sol: "BIO.6.a",
          stem: "Which derived trait is shared by the bass, salamander, turtle and fox but not by the lamprey?",
          choices: [
            { letter: "A", text: "jaws" },
            { letter: "B", text: "four limbs" },
            { letter: "C", text: "amniotic egg" },
            { letter: "D", text: "fur" }
          ],
          correct: "A"
        },
        {
          id: "derived",
          sol: "BIO.6.a",
          stem: "In sentence 2, a <strong>derived trait</strong> is best described as a feature that —",
          choices: [
            { letter: "A", text: "is found in every living organism" },
            { letter: "B", text: "arose in an ancestor and is shared by its descendants" },
            { letter: "C", text: "appears only in the oldest group on the diagram" },
            { letter: "D", text: "develops during an individual's own lifetime" }
          ],
          correct: "B"
        },
        {
          id: "fossil-placement",
          sol: "BIO.6.b",
          stem: "A newly discovered fossil animal has jaws and four limbs but no amniotic egg. Where would it join the cladogram?",
          choices: [
            { letter: "A", text: "before the lamprey branches off" },
            { letter: "B", text: "between the lamprey and the bass" },
            { letter: "C", text: "on the same branch as the salamander" },
            { letter: "D", text: "between the turtle and the fox" }
          ],
          correct: "C"
        },
        {
          id: "habitat",
          sol: "BIO.7.e",
          stem: "Which statement best explains why the volunteer rejected the visitor's grouping (sentences 6 and 7)?",
          choices: [
            { letter: "A", text: "Ponds contain too many species to be useful" },
            { letter: "B", text: "The bass has more derived traits than the salamander" },
            { letter: "C", text: "Sharing a habitat does not show shared ancestry" },
            { letter: "D", text: "Salamanders are more closely related to lampreys" }
          ],
          correct: "C"
        },
        {
          id: "count-shared",
          sol: "BIO.6.a",
          stem: "According to the table, how many of the three derived traits does the turtle share with the salamander?",
          choices: [
            { letter: "A", text: "one" },
            { letter: "B", text: "two" },
            { letter: "C", text: "three" },
            { letter: "D", text: "none" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- medium · level 3 · classification ---------- */
    {
      id: "evo-protein-clues",
      family: "EVO",
      title: "Protein Clues and a Moved Family",
      kind: "Classification · BIO.6",
      blurb: "Amino-acid differences from a river otter and why skunks left the weasel family.",
      level: 3,
      passage: "<p>" + N(1) + "For most of the last century the spotted skunk was placed in the weasel family because of its long body, short legs and scent glands. " + N(2) + "A research team compared the sequence of a 104-amino-acid blood protein in five mammals, using the river otter, a member of the weasel family, as the reference. " + N(3) + "The table lists the number of positions at which each species differs from the otter. " + N(4) + "In general, the fewer <strong>amino acid differences</strong> two species show, the more recently they shared a common ancestor, because mutations accumulate over time. " + N(5) + "DNA sequencing of several genes gave the same pattern. " + N(6) + "Based on this <strong>biochemical evidence</strong>, taxonomists moved skunks out of the weasel family into a family of their own. " + N(7) + "The team noted that scent glands are found in many carnivores and are therefore not a reliable clue to ancestry.</p>" +
        "<table><tr><th>Species</th><th>Differences from river otter</th><th>Traditional family</th></tr>" +
        "<tr><td>Mink</td><td>4</td><td>weasel</td></tr>" +
        "<tr><td>Badger</td><td>9</td><td>weasel</td></tr>" +
        "<tr><td>Spotted skunk</td><td>21</td><td>weasel</td></tr>" +
        "<tr><td>Raccoon</td><td>19</td><td>raccoon</td></tr>" +
        "<tr><td>Domestic dog</td><td>27</td><td>dog</td></tr></table>",
      claims: [
        {
          id: "closest-otter",
          sol: "BIO.6.d",
          stem: "According to the table, which species shares the most recent common ancestor with the river otter?",
          choices: [
            { letter: "A", text: "mink" },
            { letter: "B", text: "badger" },
            { letter: "C", text: "raccoon" },
            { letter: "D", text: "domestic dog" }
          ],
          correct: "A"
        },
        {
          id: "skunk-conclusion",
          sol: "BIO.6.d",
          stem: "Which conclusion about the spotted skunk is best supported by the table?",
          choices: [
            { letter: "A", text: "It is more closely related to the otter than the badger is" },
            { letter: "B", text: "It is about as distant from the otter as the raccoon is" },
            { letter: "C", text: "It shares more of the protein with the dog than with the otter" },
            { letter: "D", text: "It has the fewest differences of any species listed" }
          ],
          correct: "B"
        },
        {
          id: "biochemical",
          sol: "BIO.6.d",
          stem: "In sentence 6, <strong>biochemical evidence</strong> refers to comparisons of —",
          choices: [
            { letter: "A", text: "bone shape and body size" },
            { letter: "B", text: "embryos at early stages" },
            { letter: "C", text: "protein and DNA sequences" },
            { letter: "D", text: "fossils in rock layers" }
          ],
          correct: "C"
        },
        {
          id: "why-moved",
          sol: "BIO.6.e",
          stem: "Which statement best explains why taxonomists changed the skunk's classification (sentence 6)?",
          choices: [
            { letter: "A", text: "Skunks were found to lack scent glands" },
            { letter: "B", text: "Skunks differ from every mammal in the table" },
            { letter: "C", text: "Body shape is never used in classification" },
            { letter: "D", text: "New molecular data conflicted with the older grouping" }
          ],
          correct: "D"
        },
        {
          id: "select-two",
          sol: "BIO.7.e",
          stem: "Select TWO statements that are supported by the passage and the table.",
          choices: [
            { letter: "A", text: "The mink and otter lineages split more recently than the dog and otter lineages" },
            { letter: "B", text: "The badger's 9 differences show it does not belong in the weasel family" },
            { letter: "C", text: "Scent glands evolved only once, in the weasel family" },
            { letter: "D", text: "Similar body shapes can occur in species that are not closely related" }
          ],
          correct: ["A", "D"]
        },
        {
          id: "weasel-prediction",
          sol: "BIO.6.d",
          stem: "If the team sequenced the same protein in a long-tailed weasel, which number of differences from the otter would be most consistent with its placement in the weasel family?",
          choices: [
            { letter: "A", text: "24" },
            { letter: "B", text: "18" },
            { letter: "C", text: "5" },
            { letter: "D", text: "30" }
          ],
          correct: "C"
        }
      ]
    },

    /* ---------- short · level 1 · evolution ---------- */
    {
      id: "evo-roadcut-layers",
      family: "EVO",
      title: "Layers in a Roadcut",
      kind: "Evolution · BIO.7",
      blurb: "Four fossil layers near the James River and a fish with a neck.",
      level: 1,
      passage: "<p>" + N(1) + "A geology club mapped four rock layers exposed in a roadcut near the James River and recorded the <strong>fossils</strong> in each. " + N(2) + "The layers were undisturbed, so the deepest layer was deposited first and is the oldest. " + N(3) + "Layer 3 held a fish-like animal with sturdy, jointed fins and a neck, features not seen in the fish of layer 4 but present in the four-legged animals of layer 2. " + N(4) + "The club described this animal as a <strong>transitional form</strong>. " + N(5) + "No four-legged animals were found below layer 2, and no jointed-fin fish were found above layer 3.</p>" +
        "<table><tr><th>Layer (1 = top)</th><th>Fossils found</th><th>Estimated age (million years)</th></tr>" +
        "<tr><td>1</td><td>reptile bones, fern leaves</td><td>300</td></tr>" +
        "<tr><td>2</td><td>four-legged amphibian skeletons, fern leaves</td><td>340</td></tr>" +
        "<tr><td>3</td><td>fish with jointed fins and a neck</td><td>375</td></tr>" +
        "<tr><td>4</td><td>fish with fin rays only, shellfish</td><td>400</td></tr></table>",
      claims: [
        {
          id: "oldest",
          sol: "BIO.7.a",
          stem: "Which layer contains the oldest fossils?",
          choices: [
            { letter: "A", text: "Layer 1" },
            { letter: "B", text: "Layer 2" },
            { letter: "C", text: "Layer 3" },
            { letter: "D", text: "Layer 4" }
          ],
          correct: "D"
        },
        {
          id: "sequence",
          sol: "BIO.6.b",
          stem: "Based on the table, which sequence lists the fossil groups from oldest to youngest?",
          choices: [
            { letter: "A", text: "reptiles, amphibians, jointed-fin fish, ray-fin fish" },
            { letter: "B", text: "ray-fin fish, jointed-fin fish, amphibians, reptiles" },
            { letter: "C", text: "amphibians, reptiles, ray-fin fish, jointed-fin fish" },
            { letter: "D", text: "jointed-fin fish, ray-fin fish, reptiles, amphibians" }
          ],
          correct: "B"
        },
        {
          id: "transitional",
          sol: "BIO.7.a",
          stem: "In sentence 4, a <strong>transitional form</strong> is a fossil that —",
          choices: [
            { letter: "A", text: "shows traits of an older group and of a group that appeared later" },
            { letter: "B", text: "is found only in the youngest layer of rock at a site" },
            { letter: "C", text: "belongs to a species that is still alive somewhere today" },
            { letter: "D", text: "formed when an animal changed during its own lifetime" }
          ],
          correct: "A"
        },
        {
          id: "relative-age",
          sol: "BIO.7.a",
          stem: "Which statement best explains how the club knew that layer 4 was deposited before layer 2?",
          choices: [
            { letter: "A", text: "Layer 4 contains more kinds of fossils" },
            { letter: "B", text: "Fish are always older than amphibians" },
            { letter: "C", text: "In undisturbed rock, deeper layers formed first" },
            { letter: "D", text: "Fern leaves are found only in younger rock" }
          ],
          correct: "C"
        },
        {
          id: "layer-2-origin",
          sol: "BIO.7.a",
          stem: "What does the fossil in layer 3 suggest about the animals in layer 2?",
          choices: [
            { letter: "A", text: "They evolved from fish-like ancestors with jointed fins" },
            { letter: "B", text: "They moved into the water after living on land" },
            { letter: "C", text: "They were the same species as the layer 3 animal" },
            { letter: "D", text: "They appeared before any fish existed" }
          ],
          correct: "A"
        }
      ]
    },

    /* ---------- medium · level 2 · evolution ---------- */
    {
      id: "evo-drought-beaks",
      family: "EVO",
      title: "Beak Depth After a Drought",
      kind: "Evolution · BIO.7",
      blurb: "Four years of finch data: a drought, hard seeds and a shifting average.",
      level: 2,
      passage: "<p>" + N(1) + "On a small island, a population of seed-eating finches feeds on two kinds of seeds: soft seeds from a grass and hard, woody seeds from a shrub. " + N(2) + "Researchers measured <strong>beak depth</strong>, the distance from the top of the beak to the bottom, in a random sample of adults each year. " + N(3) + "During the second year, a drought killed most of the grass and left mainly the hard shrub seeds. " + N(4) + "Birds with deeper beaks could crack the hard seeds and were more likely to survive and breed. " + N(5) + "Beak depth is largely inherited. " + N(6) + "The table shows the results, along with the number of finches counted on the island. " + N(7) + "The population's mean beak depth rose even though no individual bird's beak grew deeper.</p>" +
        "<table><tr><th>Year</th><th>Mean beak depth (mm)</th><th>Finches counted</th><th>Rainfall (mm)</th></tr>" +
        "<tr><td>1</td><td>9.2</td><td>640</td><td>410</td></tr>" +
        "<tr><td>2 (drought)</td><td>9.9</td><td>210</td><td>60</td></tr>" +
        "<tr><td>3</td><td>10.0</td><td>290</td><td>380</td></tr>" +
        "<tr><td>4</td><td>10.1</td><td>470</td><td>400</td></tr></table>",
      claims: [
        {
          id: "count-change",
          sol: "BIO.7.b",
          stem: "Between year 1 and year 2, the number of finches counted —",
          choices: [
            { letter: "A", text: "rose by 430" },
            { letter: "B", text: "fell by 430" },
            { letter: "C", text: "fell by 210" },
            { letter: "D", text: "stayed about the same" }
          ],
          correct: "B"
        },
        {
          id: "why-deeper",
          sol: "BIO.7.c",
          stem: "Which statement best explains why mean beak depth rose from year 1 to year 2?",
          choices: [
            { letter: "A", text: "Each bird grew a deeper beak to crack hard seeds" },
            { letter: "B", text: "The drought caused new mutations for deep beaks" },
            { letter: "C", text: "Shallow-beaked birds migrated to another island" },
            { letter: "D", text: "Deep-beaked birds survived the drought at a higher rate" }
          ],
          correct: "D"
        },
        {
          id: "beak-trait",
          sol: "BIO.7.b",
          stem: "The researchers focused on <strong>beak depth</strong> (sentence 2) because it is a trait that —",
          choices: [
            { letter: "A", text: "varies among individuals and is passed to offspring" },
            { letter: "B", text: "is identical in every finch on the island" },
            { letter: "C", text: "changes each time a bird eats a hard seed" },
            { letter: "D", text: "depends only on how much rain fell that year" }
          ],
          correct: "A"
        },
        {
          id: "pressure",
          sol: "BIO.7.b",
          stem: "Which condition in the passage acted as the environmental pressure on the finches?",
          choices: [
            { letter: "A", text: "the shortage of soft seeds during the drought" },
            { letter: "B", text: "the random sampling of adults each year" },
            { letter: "C", text: "the inheritance of beak depth" },
            { letter: "D", text: "the return of rainfall in year 3" }
          ],
          correct: "A"
        },
        {
          id: "prediction",
          sol: "BIO.7.c",
          stem: "Which of the following is the best prediction if rainfall stays near 400 mm and soft grass seeds return for many years?",
          choices: [
            { letter: "A", text: "mean beak depth will keep rising at the same rate" },
            { letter: "B", text: "beak depth will no longer be inherited" },
            { letter: "C", text: "selection for deep beaks will weaken" },
            { letter: "D", text: "the population will fall below 210" }
          ],
          correct: "C"
        },
        {
          id: "populations-evolve",
          sol: "BIO.7.e",
          stem: "Sentence 7 supports which idea about evolution?",
          choices: [
            { letter: "A", text: "Individuals adapt to the environment during their lifetimes" },
            { letter: "B", text: "Populations, not individuals, evolve over generations" },
            { letter: "C", text: "Traits that are used more become stronger and are inherited" },
            { letter: "D", text: "Evolution occurs only when a species goes extinct" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- short · level 2 · evolution ---------- */
    {
      id: "evo-squash-selection",
      family: "EVO",
      title: "Breeding a Bigger Squash",
      kind: "Evolution · BIO.7",
      blurb: "Five generations of artificial selection, and the cost that came with it.",
      level: 2,
      passage: "<p>" + N(1) + "A garden club wanted a winter squash with larger fruit. " + N(2) + "Each autumn members weighed every fruit in the plot, saved seeds only from the ten heaviest, and planted those seeds the next spring. " + N(3) + "The table shows the mean fruit mass over five generations. " + N(4) + "This process is called <strong>artificial selection</strong> because people, not the environment, decide which individuals reproduce. " + N(5) + "In generation 5 a member noticed that the biggest fruits split open more often and rotted before harvest, and that fewer seeds from those fruits sprouted.</p>" +
        "<table><tr><th>Generation</th><th>Mean fruit mass (g)</th><th>Seeds that sprouted (%)</th></tr>" +
        "<tr><td>1</td><td>1,450</td><td>88</td></tr>" +
        "<tr><td>2</td><td>1,620</td><td>87</td></tr>" +
        "<tr><td>3</td><td>1,830</td><td>84</td></tr>" +
        "<tr><td>4</td><td>2,010</td><td>79</td></tr>" +
        "<tr><td>5</td><td>2,140</td><td>71</td></tr></table>",
      claims: [
        {
          id: "trend",
          sol: "BIO.7.c",
          stem: "Which trend does the table show from generation 1 to generation 5?",
          choices: [
            { letter: "A", text: "Fruit mass rose while sprouting fell" },
            { letter: "B", text: "Fruit mass fell while sprouting rose" },
            { letter: "C", text: "Both fruit mass and sprouting rose" },
            { letter: "D", text: "Both fruit mass and sprouting fell" }
          ],
          correct: "A"
        },
        {
          id: "heritable",
          sol: "BIO.7.b",
          stem: "Artificial selection was able to change the squash population because fruit mass —",
          choices: [
            { letter: "A", text: "was controlled entirely by the soil" },
            { letter: "B", text: "varied among plants and was heritable" },
            { letter: "C", text: "increased in each fruit after it was picked" },
            { letter: "D", text: "was the same in every plant in the plot" }
          ],
          correct: "B"
        },
        {
          id: "artificial",
          sol: "BIO.7.c",
          stem: "In sentence 4, <strong>artificial selection</strong> differs from natural selection mainly in —",
          choices: [
            { letter: "A", text: "whether the trait can be inherited" },
            { letter: "B", text: "whether the population shows variation" },
            { letter: "C", text: "how many generations are required" },
            { letter: "D", text: "what determines which individuals reproduce" }
          ],
          correct: "D"
        },
        {
          id: "cost",
          sol: "BIO.7.b",
          stem: "Which statement best explains the observation in sentence 5?",
          choices: [
            { letter: "A", text: "the plants developed large fruit because they needed to" },
            { letter: "B", text: "selecting for one trait can bring costs to reproduction" },
            { letter: "C", text: "the club accidentally saved seeds from the smallest fruits" },
            { letter: "D", text: "fruit mass has no effect on how well seeds sprout" }
          ],
          correct: "B"
        },
        {
          id: "wild-squash",
          sol: "BIO.7.c",
          stem: "If wild squash grew where animals ate only the smallest fruits and scattered their seeds, which fruit size would natural selection most likely favor?",
          choices: [
            { letter: "A", text: "fruits as large as those in generation 5" },
            { letter: "B", text: "fruits with no seeds at all" },
            { letter: "C", text: "fruits small enough to be eaten and carried away" },
            { letter: "D", text: "fruits of every size equally" }
          ],
          correct: "C"
        }
      ]
    },

    /* ---------- tiny · level 2 · evolution ---------- */
    {
      id: "evo-beetle-spray",
      family: "EVO",
      title: "Beetles That Shrug Off the Spray",
      kind: "Evolution · BIO.7",
      blurb: "The same pesticide, the same dose, and far fewer dead beetles by year five.",
      level: 2,
      passage: "<p>" + N(1) + "A soybean grower sprayed one pesticide on a field each June. " + N(2) + "In the first year about 97% of the leaf beetles died. " + N(3) + "By year five the same dose killed only 40%, and the grower asked whether the spray had gone bad. " + N(4) + "The agent found the spray unchanged: a few beetles had carried a <strong>resistance allele</strong> before spraying began. " + N(5) + "Those survivors bred, and the allele became common in the population.</p>",
      claims: [
        {
          id: "why-fewer",
          sol: "BIO.7.c",
          stem: "Which statement best explains why the pesticide killed fewer beetles in year five?",
          choices: [
            { letter: "A", text: "Each beetle built up a tolerance during its life" },
            { letter: "B", text: "The beetles evolved resistance because they needed to" },
            { letter: "C", text: "Resistant beetles survived and passed the allele on" },
            { letter: "D", text: "The pesticide created the resistance allele" }
          ],
          correct: "C"
        },
        {
          id: "allele",
          sol: "BIO.7.b",
          stem: "In sentence 4, a <strong>resistance allele</strong> is best described as —",
          choices: [
            { letter: "A", text: "a gene version that helps a beetle survive the spray" },
            { letter: "B", text: "a chemical that breaks down the pesticide in soil" },
            { letter: "C", text: "a behavior beetles learn by watching others" },
            { letter: "D", text: "a trait that appears only after spraying" }
          ],
          correct: "A"
        },
        {
          id: "similar",
          sol: "BIO.7.e",
          stem: "Which situation is most similar to the change in the beetle population?",
          choices: [
            { letter: "A", text: "a lizard that regrows a lost tail" },
            { letter: "B", text: "a dog that learns to sit for a treat" },
            { letter: "C", text: "a plant that wilts on a hot afternoon" },
            { letter: "D", text: "an infection that no longer responds to an antibiotic" }
          ],
          correct: "D"
        },
        {
          id: "survivors",
          sol: "BIO.7.b",
          stem: "What percentage of the beetles survived the spray in the first year?",
          choices: [
            { letter: "A", text: "40%" },
            { letter: "B", text: "3%" },
            { letter: "C", text: "60%" },
            { letter: "D", text: "97%" }
          ],
          correct: "B"
        },
        {
          id: "slow-spread",
          sol: "BIO.7.c",
          stem: "Which practice would most slow the spread of the resistance allele?",
          choices: [
            { letter: "A", text: "spraying a higher dose every week" },
            { letter: "B", text: "spraying the same product every June" },
            { letter: "C", text: "rotating pesticides and leaving unsprayed areas" },
            { letter: "D", text: "spraying only on cloudy days" }
          ],
          correct: "C"
        }
      ]
    },

    /* ---------- long · level 3 · evolution ---------- */
    {
      id: "evo-ridge-salamanders",
      family: "EVO",
      title: "Two Salamanders, One Ridge",
      kind: "Evolution · BIO.7",
      blurb: "A warm valley splits a population; courtship and DNA show what happened next.",
      level: 3,
      passage: "<p>" + N(1) + "A population of stream salamanders once ranged across a section of the Blue Ridge. " + N(2) + "About 20,000 years ago the climate warmed and the low valley between two arms of the ridge became too warm and dry for the salamanders, which dry out quickly away from cool shaded water, to cross. " + N(3) + "Field surveys today find a northern form with 14 costal grooves and a bright orange stripe, and a southern form with 16 grooves and a dull brown stripe. " + N(4) + "The northern streams are steeper and colder; the southern streams are slower and richer in aquatic insects. " + N(5) + "Biologists brought northern and southern animals together in the laboratory. " + N(6) + "The two forms rarely courted one another because the courtship dance of each form did not trigger a response in the other, and the few eggs produced from mixed pairs failed to hatch. " + N(7) + "Individuals from the same form mated readily and produced healthy larvae. " + N(8) + "Genetic tests show that the two forms differ at many sites in their DNA, while salamanders within each form are very similar to one another. " + N(9) + "The biologists concluded that <strong>geographic isolation</strong> followed by <strong>reproductive isolation</strong> had produced two <strong>species</strong> from one ancestral population, an example of speciation.</p>",
      claims: [
        {
          id: "first-split",
          sol: "BIO.7.d",
          stem: "Which event first divided the ancestral population into two groups?",
          choices: [
            { letter: "A", text: "a warm, dry valley the salamanders could not cross" },
            { letter: "B", text: "differences in the courtship dances" },
            { letter: "C", text: "the failure of mixed-pair eggs to hatch" },
            { letter: "D", text: "differences in the number of costal grooves" }
          ],
          correct: "A"
        },
        {
          id: "species-evidence",
          sol: "BIO.7.d",
          stem: "Which observation is the strongest evidence that the two forms are now separate species?",
          choices: [
            { letter: "A", text: "they are found in different streams" },
            { letter: "B", text: "they have different stripe colors" },
            { letter: "C", text: "they do not interbreed successfully" },
            { letter: "D", text: "their streams differ in temperature" }
          ],
          correct: "C"
        },
        {
          id: "repro-isolation",
          sol: "BIO.7.d",
          stem: "In sentence 9, <strong>reproductive isolation</strong> means that the two forms —",
          choices: [
            { letter: "A", text: "live on opposite sides of a barrier" },
            { letter: "B", text: "reproduce at different times of the day" },
            { letter: "C", text: "have stopped reproducing entirely" },
            { letter: "D", text: "no longer produce fertile offspring together" }
          ],
          correct: "D"
        },
        {
          id: "how-differ",
          sol: "BIO.7.c",
          stem: "Which statement best explains how the two forms came to differ in stripe color and groove number?",
          choices: [
            { letter: "A", text: "each salamander changed its traits to fit its stream" },
            { letter: "B", text: "the barrier itself caused the new mutations" },
            { letter: "C", text: "different conditions favored different variants over generations" },
            { letter: "D", text: "the forms chose to look different from each other" }
          ],
          correct: "C"
        },
        {
          id: "select-two",
          sol: "BIO.7.e",
          stem: "Select TWO findings from the passage that support the conclusion that the two forms descended from one ancestral population.",
          choices: [
            { letter: "A", text: "the population once ranged across the whole ridge" },
            { letter: "B", text: "the two forms rarely court one another" },
            { letter: "C", text: "the southern streams hold more aquatic insects" },
            { letter: "D", text: "the forms have similar bodies and only some DNA differences" }
          ],
          correct: ["A", "D"]
        },
        {
          id: "corridor",
          sol: "BIO.7.d",
          stem: "If a cool, shaded forest corridor regrew across the valley, which outcome is most likely?",
          choices: [
            { letter: "A", text: "the forms would quickly merge into one species" },
            { letter: "B", text: "the forms would stay separate because they do not interbreed" },
            { letter: "C", text: "the northern form would immediately lose its stripe" },
            { letter: "D", text: "both forms would go extinct from competition" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- medium · level 2 · evolution ---------- */
    {
      id: "evo-limb-lab",
      family: "EVO",
      title: "Bones, Wings and Embryos",
      kind: "Evolution · BIO.7",
      blurb: "Homologous, analogous and vestigial structures, plus three embryos.",
      level: 2,
      passage: "<p>" + N(1) + "In an anatomy lab, students compared the forelimb skeletons of a bat, a whale, a cat and a human. " + N(2) + "Each limb had the same pattern: one upper-arm bone, two forearm bones, a cluster of wrist bones and rows of finger bones, though bone lengths and limb jobs differed. " + N(3) + "Structures with the same underlying plan inherited from a common ancestor are <strong>homologous</strong>. " + N(4) + "The students then compared a bat wing with an insect wing. " + N(5) + "Both are used for flight, but the insect wing is a thin sheet of chitin with no bones, so the two wings are <strong>analogous</strong>: similar in function but not inherited from a shared winged ancestor. " + N(6) + "The whale skeleton also contained small hip bones that no longer attach to any limb, a <strong>vestigial</strong> structure left over from land-living ancestors. " + N(7) + "Finally, the students viewed early embryos of a fish, a chicken and a mammal; all three had a tail and throat pouches at that stage.</p>",
      claims: [
        {
          id: "homologous",
          sol: "BIO.6.a",
          stem: "The forelimbs of the bat, whale, cat and human are homologous because they —",
          choices: [
            { letter: "A", text: "are used for the same job" },
            { letter: "B", text: "share one bone pattern from a common ancestor" },
            { letter: "C", text: "are all used for walking on land" },
            { letter: "D", text: "have bones of exactly the same length" }
          ],
          correct: "B"
        },
        {
          id: "analogous",
          sol: "BIO.6.a",
          stem: "In sentence 5, <strong>analogous</strong> structures are alike in —",
          choices: [
            { letter: "A", text: "function but not in ancestry" },
            { letter: "B", text: "ancestry but not in function" },
            { letter: "C", text: "both function and ancestry" },
            { letter: "D", text: "neither function nor ancestry" }
          ],
          correct: "A"
        },
        {
          id: "vestigial",
          sol: "BIO.7.e",
          stem: "The whale's hip bones (sentence 6) are evidence that whales —",
          choices: [
            { letter: "A", text: "are more closely related to fish than to land mammals" },
            { letter: "B", text: "will grow hind legs again in the future" },
            { letter: "C", text: "descended from ancestors that had hind limbs" },
            { letter: "D", text: "use their hips to steer while swimming" }
          ],
          correct: "C"
        },
        {
          id: "embryos",
          sol: "BIO.6.c",
          stem: "Which conclusion is best supported by the embryo observations in sentence 7?",
          choices: [
            { letter: "A", text: "adult mammals keep working gills" },
            { letter: "B", text: "chickens are the direct descendants of fish" },
            { letter: "C", text: "embryos look identical at every stage" },
            { letter: "D", text: "the three groups share a distant common ancestor" }
          ],
          correct: "D"
        },
        {
          id: "bird-butterfly",
          sol: "BIO.6.a",
          stem: "A bird wing and a butterfly wing would best be classified as —",
          choices: [
            { letter: "A", text: "homologous, because both are used to fly" },
            { letter: "B", text: "analogous, because flight evolved separately in each" },
            { letter: "C", text: "vestigial, because both are lightweight" },
            { letter: "D", text: "homologous, because both come from a winged ancestor" }
          ],
          correct: "B"
        },
        {
          id: "bat-cat",
          sol: "BIO.7.e",
          stem: "Which evidence from the lab best supports the claim that a bat is more closely related to a cat than to an insect?",
          choices: [
            { letter: "A", text: "bats and insects both fly" },
            { letter: "B", text: "the bat wing is larger than the insect wing" },
            { letter: "C", text: "the bat and cat forelimbs share the same bone pattern" },
            { letter: "D", text: "the insect wing is made of chitin" }
          ],
          correct: "C"
        }
      ]
    },

    /* ---------- long · level 3 · evolution ---------- */
    {
      id: "evo-eggs-or-care",
      family: "EVO",
      title: "Many Eggs or Much Care",
      kind: "Evolution · BIO.7",
      blurb: "Blue crabs and ospreys in the same marsh, two ways to leave descendants.",
      level: 3,
      passage: "<p>" + N(1) + "A Chesapeake Bay research station tracked two animals that share the same marsh: the blue crab and the osprey. " + N(2) + "A female blue crab releases up to two million eggs in a single spawning and provides no care after the larvae hatch; nearly all the larvae are eaten or swept away. " + N(3) + "An osprey pair lays two to four eggs each spring, incubates them for over a month, and feeds the chicks fish for weeks after they leave the nest. " + N(4) + "The table summarizes the station's estimates. " + N(5) + "Both strategies persist because, on average, each parent leaves enough surviving offspring to replace itself. " + N(6) + "Researchers call the crab's approach a <strong>high-fecundity strategy</strong>: many offspring, low investment in each. " + N(7) + "The osprey's approach is the opposite: few offspring, heavy investment in each. " + N(8) + "In one year an unusually cold spring killed most crab larvae in the bay, yet the crab population recovered within two seasons. " + N(9) + "When a storm destroyed a quarter of the osprey nests in the same year, the local osprey population took several years to return to its earlier size. " + N(10) + "The station noted that overproduction of offspring, combined with limited food and space, means that not every individual can survive, and that those best suited to the conditions are the ones most likely to reproduce.</p>" +
        "<table><tr><th>Feature</th><th>Blue crab</th><th>Osprey</th></tr>" +
        "<tr><td>Eggs per female per year</td><td>up to 2,000,000</td><td>2 to 4</td></tr>" +
        "<tr><td>Parental care</td><td>none</td><td>months</td></tr>" +
        "<tr><td>Offspring surviving to adulthood</td><td>about 0.0001%</td><td>about 50%</td></tr>" +
        "<tr><td>Age at first reproduction</td><td>1 to 2 years</td><td>3 years</td></tr></table>",
      claims: [
        {
          id: "survivors",
          sol: "BIO.7.b",
          stem: "According to the table, about how many offspring from a single spawning of 2,000,000 crab eggs survive to adulthood?",
          choices: [
            { letter: "A", text: "2" },
            { letter: "B", text: "20" },
            { letter: "C", text: "200" },
            { letter: "D", text: "2,000" }
          ],
          correct: "A"
        },
        {
          id: "fecundity",
          sol: "BIO.7.b",
          stem: "In sentence 6, a <strong>high-fecundity strategy</strong> is one in which an organism —",
          choices: [
            { letter: "A", text: "produces few offspring and cares for each one" },
            { letter: "B", text: "produces many offspring and invests little in each" },
            { letter: "C", text: "reproduces only once in its lifetime" },
            { letter: "D", text: "produces offspring only in warm years" }
          ],
          correct: "B"
        },
        {
          id: "recovery",
          sol: "BIO.7.b",
          stem: "Which statement best explains why the crab population recovered faster than the osprey population (sentences 8 and 9)?",
          choices: [
            { letter: "A", text: "crabs are less affected by weather than ospreys" },
            { letter: "B", text: "cold water does not harm crab larvae" },
            { letter: "C", text: "a few surviving crabs can release millions of eggs" },
            { letter: "D", text: "ospreys stopped nesting after the storm" }
          ],
          correct: "C"
        },
        {
          id: "logic",
          sol: "BIO.7.c",
          stem: "Sentence 10 describes which parts of the reasoning behind natural selection?",
          choices: [
            { letter: "A", text: "isolation, divergence and speciation" },
            { letter: "B", text: "mutation, migration and genetic drift" },
            { letter: "C", text: "inheritance of traits gained during life" },
            { letter: "D", text: "overproduction, competition and differential survival" }
          ],
          correct: "D"
        },
        {
          id: "favored",
          sol: "BIO.7.b",
          stem: "In which environment would the osprey's strategy most likely be favored over the crab's?",
          choices: [
            { letter: "A", text: "where offspring survival is random and very low" },
            { letter: "B", text: "where a protected offspring has a good chance to survive" },
            { letter: "C", text: "where food is unlimited and predators are absent" },
            { letter: "D", text: "where adults die before their eggs hatch" }
          ],
          correct: "B"
        },
        {
          id: "both-persist",
          sol: "BIO.7.e",
          stem: "Which statement about the two strategies is best supported by the passage?",
          choices: [
            { letter: "A", text: "the osprey's strategy is more advanced than the crab's" },
            { letter: "B", text: "the crab's strategy will eventually replace the osprey's" },
            { letter: "C", text: "only the crab's strategy is shaped by natural selection" },
            { letter: "D", text: "each strategy leaves enough survivors to maintain the population" }
          ],
          correct: "D"
        }
      ]
    }
  ];

  for (var i = 0; i < PACKS.length; i++) P.push(PACKS[i]);
})(typeof window !== "undefined" ? window : global);
