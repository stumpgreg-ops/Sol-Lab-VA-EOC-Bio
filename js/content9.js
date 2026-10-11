/* SOL Lab — Ecology (BIO.8). Original text only. */
(function (global) {
  var P = global.HEIST_PACKS;
  if (!P || !P.push) return;
  var N = function (i) { return '<span class="n">(' + i + ')</span> '; };   // numbered sentence

  var PACKS = [

    /* ---------- tiny · level 1 · BIO.8.a ---------- */
    {
      id: "eco-deer-shenandoah-trail",
      family: "ECO",
      title: "Deer on the Ridge Trail",
      kind: "Ecology · BIO.8",
      blurb: "Six years of deer counts in Shenandoah National Park level off. Why?",
      level: 1,
      passage: "<p>" + N(1) + "A wildlife class counted white-tailed deer along the same 5 km trail in Shenandoah National Park every October. " + N(2) + "Hunting is not allowed in the park, and no coyotes appeared on the trail cameras until 2023. " + N(3) + "By 2021 the students noticed browse lines: the deer had eaten nearly every leaf they could reach. " + N(4) + "They concluded that the trail's habitat had reached its <strong>carrying capacity</strong> for deer.</p>" +
        "<table><tr><th>Year</th><th>Deer counted</th></tr><tr><td>2018</td><td>22</td></tr><tr><td>2019</td><td>38</td></tr><tr><td>2020</td><td>61</td></tr><tr><td>2021</td><td>79</td></tr><tr><td>2022</td><td>82</td></tr><tr><td>2023</td><td>80</td></tr></table>",
      claims: [
        {
          id: "trend",
          sol: "BIO.8.a",
          stem: "Which conclusion about the deer population is best supported by the table?",
          choices: [
            { letter: "A", text: "It reached its carrying capacity in 2019 and has declined since." },
            { letter: "B", text: "It doubled every year from 2018 through 2023." },
            { letter: "C", text: "It grew quickly until about 2021 and then levelled off near 80." },
            { letter: "D", text: "It fell steadily after the coyotes arrived in 2020." }
          ],
          correct: "C"
        },
        {
          id: "vocab",
          sol: "BIO.8.a",
          stem: "In sentence 4, carrying capacity refers to —",
          choices: [
            { letter: "A", text: "the largest number of deer the habitat can support over time" },
            { letter: "B", text: "the number of deer the class counted in a single October" },
            { letter: "C", text: "the number of deer removed by hunters each season" },
            { letter: "D", text: "the number of predators the park can feed in a year" }
          ],
          correct: "A"
        },
        {
          id: "limit",
          sol: "BIO.8.a",
          stem: "Based on sentence 3, which factor most likely limited the deer population after 2021?",
          choices: [
            { letter: "A", text: "hunting pressure inside the park boundary" },
            { letter: "B", text: "the supply of leaves within reach of the deer" },
            { letter: "C", text: "predation by coyotes along the trail" },
            { letter: "D", text: "a shortage of space along the 5 km trail" }
          ],
          correct: "B"
        },
        {
          id: "curve",
          sol: "BIO.8.a",
          stem: "If the deer counts were plotted against year, the graph would be best described as —",
          choices: [
            { letter: "A", text: "a J-shaped curve that keeps rising faster each year" },
            { letter: "B", text: "a boom-and-bust cycle with a crash every two years" },
            { letter: "C", text: "a straight line rising at the same rate every year" },
            { letter: "D", text: "an S-shaped curve that flattens near the carrying capacity" }
          ],
          correct: "D"
        },
        {
          id: "manage",
          sol: "BIO.8.d",
          stem: "Outside the park, deer damage crops and gardens in many Virginia counties. Which management action would most directly lower deer numbers there?",
          choices: [
            { letter: "A", text: "planting food plots to feed the deer through the winter" },
            { letter: "B", text: "building more hiking trails through the forest" },
            { letter: "C", text: "extending the hunting season and raising the bag limit" },
            { letter: "D", text: "planting more acorn-producing oaks along field edges" }
          ],
          correct: "C"
        }
      ]
    },

    /* ---------- tiny · level 1 · BIO.8.d / BIO.8.a ---------- */
    {
      id: "eco-brook-trout-shade",
      family: "ECO",
      title: "Brook Trout and Warm Water",
      kind: "Ecology · BIO.8",
      blurb: "Two Blue Ridge streams, one shaded and one not. Where are the trout?",
      level: 1,
      passage: "<p>" + N(1) + "Brook trout, Virginia's only native trout, need cold water rich in <strong>dissolved oxygen</strong>. " + N(2) + "A stream team compared two Blue Ridge streams. " + N(3) + "Shaded Cold Run averaged 15 °C; Miller Branch, where streamside trees were cut for pasture, averaged 22 °C. " + N(4) + "Surveys found 34 brook trout per 100 m in Cold Run and only 3 per 100 m in Miller Branch. " + N(5) + "The team recommended planting trees along Miller Branch.</p>",
      claims: [
        {
          id: "cause",
          sol: "BIO.8.d",
          stem: "Which human activity best explains the difference in water temperature between the two streams?",
          choices: [
            { letter: "A", text: "stocking Cold Run with trout raised in a hatchery" },
            { letter: "B", text: "removing streamside trees so sunlight warms Miller Branch" },
            { letter: "C", text: "fertilizer runoff adding oxygen to Miller Branch" },
            { letter: "D", text: "building a dam that releases cold water into Cold Run" }
          ],
          correct: "B"
        },
        {
          id: "data",
          sol: "BIO.8.a",
          stem: "Which conclusion is best supported by the survey counts in sentence 4?",
          choices: [
            { letter: "A", text: "Cold Run supports more than ten times as many trout per 100 m as Miller Branch." },
            { letter: "B", text: "Miller Branch has more trout because warm water speeds their growth." },
            { letter: "C", text: "The two streams support about the same number of trout." },
            { letter: "D", text: "Brook trout cannot survive at all in water warmer than 15 °C." }
          ],
          correct: "A"
        },
        {
          id: "factor",
          sol: "BIO.8.a",
          stem: "In this study, water temperature acts on the trout population as a —",
          choices: [
            { letter: "A", text: "producer at the base of the stream food chain" },
            { letter: "B", text: "pioneer species that colonizes bare stream banks" },
            { letter: "C", text: "decomposer that recycles nutrients in the stream" },
            { letter: "D", text: "limiting factor that sets how many trout the stream can support" }
          ],
          correct: "D"
        },
        {
          id: "vocab",
          sol: "BIO.8.a",
          stem: "In sentence 1, dissolved oxygen means —",
          choices: [
            { letter: "A", text: "oxygen atoms locked inside each water molecule" },
            { letter: "B", text: "oxygen released by decomposers breaking down leaves" },
            { letter: "C", text: "oxygen gas mixed into the water that fish take in through their gills" },
            { letter: "D", text: "oxygen stored in the swim bladder of a trout" }
          ],
          correct: "C"
        },
        {
          id: "restore",
          sol: "BIO.8.d",
          stem: "The recommendation in sentence 5 is best described as —",
          choices: [
            { letter: "A", text: "habitat restoration meant to shade and cool the stream" },
            { letter: "B", text: "introducing a non-native species to the stream" },
            { letter: "C", text: "primary succession beginning on bare rock" },
            { letter: "D", text: "eutrophication of the stream by added nutrients" }
          ],
          correct: "A"
        }
      ]
    },

    /* ---------- tiny · level 2 · BIO.8.a / BIO.8.d ---------- */
    {
      id: "eco-lanternfly-vineyard",
      family: "ECO",
      title: "Lanternflies in the Vineyard",
      kind: "Ecology · BIO.8",
      blurb: "An insect count that curves like the letter J at a Winchester vineyard.",
      level: 2,
      passage: "<p>" + N(1) + "The spotted lanternfly, an <strong>invasive</strong> insect from Asia, reached Virginia in 2018. " + N(2) + "A grower near Winchester counted adult lanternflies on ten grapevines each September. " + N(3) + "She found 12 in 2021, 95 in 2022, 780 in 2023 and about 6,000 in 2024. " + N(4) + "On a graph the counts curve sharply upward like the letter J. " + N(5) + "The insects weaken vines by sucking sap, and few local birds or wasps eat them.</p>",
      claims: [
        {
          id: "growth",
          sol: "BIO.8.a",
          stem: "The growth pattern described in sentence 4 is best called —",
          choices: [
            { letter: "A", text: "exponential growth, because nothing is limiting the population yet" },
            { letter: "B", text: "logistic growth, because the population has reached its carrying capacity" },
            { letter: "C", text: "a boom-and-bust cycle driven by a predator" },
            { letter: "D", text: "zero growth, because births and deaths are equal" }
          ],
          correct: "A"
        },
        {
          id: "ratio",
          sol: "BIO.8.a",
          stem: "By about how many times did the count increase from 2021 to 2022?",
          choices: [
            { letter: "A", text: "about 2 times" },
            { letter: "B", text: "about 8 times" },
            { letter: "C", text: "about 80 times" },
            { letter: "D", text: "about 800 times" }
          ],
          correct: "B"
        },
        {
          id: "vocab",
          sol: "BIO.8.d",
          stem: "In sentence 1, calling the lanternfly invasive means that it —",
          choices: [
            { letter: "A", text: "is a native predator that keeps other insects in check" },
            { letter: "B", text: "appears first during succession on bare ground" },
            { letter: "C", text: "is a non-native species that spreads rapidly and harms native life or crops" },
            { letter: "D", text: "feeds on plant sap during only one season of the year" }
          ],
          correct: "C"
        },
        {
          id: "why",
          sol: "BIO.8.a",
          stem: "Which statement best explains why the lanternfly population grew so fast?",
          choices: [
            { letter: "A", text: "The grapevines produced more sap each year." },
            { letter: "B", text: "Cold winters killed most of the egg masses." },
            { letter: "C", text: "The grower sprayed the vines with insecticide every spring." },
            { letter: "D", text: "With few predators and plenty of host plants, few limiting factors slowed it." }
          ],
          correct: "D"
        },
        {
          id: "predict",
          sol: "BIO.8.a",
          stem: "Which of these would most likely turn the J-shaped curve into an S-shaped curve in future years?",
          choices: [
            { letter: "A", text: "the limited number of host vines setting a carrying capacity" },
            { letter: "B", text: "the grower counting the insects on more vines each September" },
            { letter: "C", text: "warmer summers letting each female lay more egg masses on the vines" },
            { letter: "D", text: "the insects spreading from the vineyard to a second vineyard nearby" }
          ],
          correct: "A"
        }
      ]
    },

    /* ---------- short · level 1 · BIO.8.b ---------- */
    {
      id: "eco-salt-marsh-pyramid",
      family: "ECO",
      title: "Energy in a Salt Marsh",
      kind: "Ecology · BIO.8",
      blurb: "Cordgrass to snails to rails to a harrier: an Eastern Shore energy pyramid.",
      level: 1,
      passage: "<p>" + N(1) + "A salt marsh on Virginia's Eastern Shore is dominated by smooth cordgrass, a <strong>producer</strong> that captures sunlight. " + N(2) + "Students built an energy pyramid for the marsh from measurements of the energy stored in each trophic level over one year. " + N(3) + "Periwinkle snails and grasshoppers eat the cordgrass, clapper rails eat the snails and insects, and a northern harrier hunts the rails. " + N(4) + "About 10% of the energy at each level passes to the next; the rest powers life processes or is lost as heat. " + N(5) + "Dead cordgrass is broken down by bacteria and fungi in the mud.</p>" +
        "<table><tr><th>Trophic level</th><th>Organisms</th><th>Energy (kcal/m²/yr)</th></tr><tr><td>Producers</td><td>cordgrass</td><td>20,000</td></tr><tr><td>Primary consumers</td><td>snails, grasshoppers</td><td>2,000</td></tr><tr><td>Secondary consumers</td><td>clapper rails</td><td>200</td></tr><tr><td>Tertiary consumer</td><td>northern harrier</td><td>20</td></tr></table>",
      claims: [
        {
          id: "read",
          sol: "BIO.8.b",
          stem: "According to the table, how much energy is available to the clapper rails each year?",
          choices: [
            { letter: "A", text: "20,000 kcal/m²" },
            { letter: "B", text: "2,000 kcal/m²" },
            { letter: "C", text: "200 kcal/m²" },
            { letter: "D", text: "20 kcal/m²" }
          ],
          correct: "C"
        },
        {
          id: "loss",
          sol: "BIO.8.b",
          stem: "Which statement best explains why so little energy is available at the harrier level?",
          choices: [
            { letter: "A", text: "Most energy at each level is used for life processes or lost as heat, so only about 10% moves up." },
            { letter: "B", text: "Harriers are larger than rails, so they need much less energy to live." },
            { letter: "C", text: "Decomposers recycle most of the energy back to the cordgrass instead." },
            { letter: "D", text: "Clapper rails hide in the grass, so the harrier rarely catches one." }
          ],
          correct: "A"
        },
        {
          id: "vocab",
          sol: "BIO.8.b",
          stem: "In sentence 1, a producer is an organism that —",
          choices: [
            { letter: "A", text: "eats plants to obtain energy" },
            { letter: "B", text: "makes its own food using sunlight and carbon dioxide" },
            { letter: "C", text: "breaks down dead material into nutrients" },
            { letter: "D", text: "sits at the top of a food chain" }
          ],
          correct: "B"
        },
        {
          id: "decomp",
          sol: "BIO.8.b",
          stem: "The bacteria and fungi in sentence 5 are best described as —",
          choices: [
            { letter: "A", text: "producers that add energy to the marsh" },
            { letter: "B", text: "primary consumers because they feed on cordgrass" },
            { letter: "C", text: "tertiary consumers at the top of the pyramid" },
            { letter: "D", text: "decomposers that return nutrients from dead cordgrass to the mud" }
          ],
          correct: "D"
        },
        {
          id: "crash",
          sol: "BIO.8.a",
          stem: "If disease wiped out most of the periwinkle snails, which change would most likely happen first?",
          choices: [
            { letter: "A", text: "The clapper rails would have less food and their numbers would fall." },
            { letter: "B", text: "The energy stored in the cordgrass would drop to 2,000 kcal/m²." },
            { letter: "C", text: "The harrier would begin eating cordgrass instead of rails." },
            { letter: "D", text: "The bacteria and fungi would stop recycling nutrients." }
          ],
          correct: "A"
        },
        {
          id: "sealevel",
          sol: "BIO.8.d",
          stem: "Rising sea level is drowning parts of the marsh and killing cordgrass. Which is the most direct effect on the energy pyramid?",
          choices: [
            { letter: "A", text: "More water would raise the energy available at every level." },
            { letter: "B", text: "The harrier level would gain energy as rails move closer together." },
            { letter: "C", text: "Decomposers would replace the cordgrass as the marsh's producers." },
            { letter: "D", text: "Less energy would enter at the base, so every level above would shrink." }
          ],
          correct: "D"
        }
      ]
    },

    /* ---------- short · level 2 · BIO.8.d / BIO.8.b ---------- */
    {
      id: "eco-mossy-creek-oxygen",
      family: "ECO",
      title: "Oxygen Below the Dairy",
      kind: "Ecology · BIO.8",
      blurb: "Nitrate up, oxygen down: four sites along a Shenandoah Valley creek.",
      level: 2,
      passage: "<p>" + N(1) + "A stream team sampled Mossy Creek, a Shenandoah Valley stream, at four sites on a July morning. " + N(2) + "Site 1 lies upstream of a dairy farm; sites 2 through 4 lie downstream of a barnyard where manure washes into the creek during rain. " + N(3) + "At each site the team measured nitrate and dissolved oxygen and described the streambed.</p>" +
        "<table><tr><th>Site</th><th>Nitrate (mg/L)</th><th>Dissolved O₂ (mg/L)</th><th>Streambed</th></tr><tr><td>1 (upstream)</td><td>0.8</td><td>9.1</td><td>clean gravel, mayflies</td></tr><tr><td>2</td><td>4.6</td><td>7.0</td><td>thin algae film</td></tr><tr><td>3</td><td>6.9</td><td>4.2</td><td>thick algae mats</td></tr><tr><td>4</td><td>7.4</td><td>2.9</td><td>rotting algae, midge larvae</td></tr></table>" +
        "<p>" + N(4) + "Brook trout need at least 6 mg/L of dissolved oxygen. " + N(5) + "The team called the pattern <strong>eutrophication</strong>: extra nutrients feed algae, and when the algae die, decomposing bacteria use up the oxygen. " + N(6) + "A second set of readings taken before dawn showed even less oxygen at sites 3 and 4.</p>",
      claims: [
        {
          id: "trend",
          sol: "BIO.8.d",
          stem: "Which conclusion is best supported by the readings in the table?",
          choices: [
            { letter: "A", text: "Dissolved oxygen rises as nitrate rises downstream of the barnyard." },
            { letter: "B", text: "Nitrate rises and dissolved oxygen falls with distance downstream of the barnyard." },
            { letter: "C", text: "The upstream site has the most algae because it has the least nitrate." },
            { letter: "D", text: "Nitrate and oxygen stay about the same at all four sites." }
          ],
          correct: "B"
        },
        {
          id: "source",
          sol: "BIO.8.b",
          stem: "Which process moved nitrogen from the manure into the nitrate measured in the creek?",
          choices: [
            { letter: "A", text: "decomposition of the manure by soil and water bacteria" },
            { letter: "B", text: "photosynthesis by the algae growing on the streambed" },
            { letter: "C", text: "respiration by the trout living upstream" },
            { letter: "D", text: "evaporation of water from the creek surface" }
          ],
          correct: "A"
        },
        {
          id: "vocab",
          sol: "BIO.8.d",
          stem: "In sentence 5, eutrophication is best described as —",
          choices: [
            { letter: "A", text: "the warming of a stream after streamside trees are removed" },
            { letter: "B", text: "the replacement of one community by another over many years" },
            { letter: "C", text: "nutrient enrichment that drives algal growth and then oxygen loss" },
            { letter: "D", text: "the spread of a non-native species along a stream" }
          ],
          correct: "C"
        },
        {
          id: "trout",
          sol: "BIO.8.a",
          stem: "Using sentence 4 and the table, at which sites could brook trout meet their oxygen requirement on the July morning?",
          choices: [
            { letter: "A", text: "site 1 only" },
            { letter: "B", text: "sites 1, 2 and 3" },
            { letter: "C", text: "all four sites" },
            { letter: "D", text: "sites 1 and 2 only" }
          ],
          correct: "D"
        },
        {
          id: "fix",
          sol: "BIO.8.d",
          stem: "Which action would most directly reduce the problem the team observed?",
          choices: [
            { letter: "A", text: "fencing cattle out of the creek and planting a buffer strip along the bank" },
            { letter: "B", text: "spreading extra fertilizer on the pasture so the grass grows thicker" },
            { letter: "C", text: "stocking more brook trout at site 4 at the start of each spring" },
            { letter: "D", text: "removing the mayflies from the gravel at site 1 so algae can grow" }
          ],
          correct: "A"
        },
        {
          id: "night",
          sol: "BIO.8.b",
          stem: "Which statement best explains the lower oxygen readings before dawn in sentence 6?",
          choices: [
            { letter: "A", text: "Cooler night water holds less dissolved oxygen than warmer daytime water does." },
            { letter: "B", text: "Algae stop photosynthesizing in the dark, but algae, bacteria and animals keep respiring." },
            { letter: "C", text: "Nitrate reacts with oxygen in the dark and removes it from the water." },
            { letter: "D", text: "Trout and other animals use far more oxygen while they rest at night." }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- short · level 2 · BIO.8.a ---------- */
    {
      id: "eco-owls-voles-hayfield",
      family: "ECO",
      title: "Owls and Voles",
      kind: "Ecology · BIO.8",
      blurb: "Eight years of predator and prey counts that rise and fall like waves.",
      level: 2,
      passage: "<p>" + N(1) + "Ecologists tracked meadow voles and barn owls in a 40-hectare hayfield for eight years using live traps and nest-box checks. " + N(2) + "Vole numbers rose from about 200 to nearly 3,000 in two years, crashed to under 300 the next year, and then rose again. " + N(3) + "Owl numbers followed the same up-and-down pattern, but each owl peak came about one year after the vole peak. " + N(4) + "On a graph the two lines look like waves, the owl wave lagging the vole wave in this <strong>boom-and-bust</strong> cycle. " + N(5) + "In crash years the field's grass was grazed to the soil and many trapped voles were thin. " + N(6) + "Red-tailed hawks also hunt voles in the field.</p>",
      claims: [
        {
          id: "lag",
          sol: "BIO.8.a",
          stem: "Which statement best explains why each owl peak comes about a year after the vole peak?",
          choices: [
            { letter: "A", text: "Owls leave the field each fall and return the following spring." },
            { letter: "B", text: "Voles eat owl eggs when vole numbers are high." },
            { letter: "C", text: "Owls need time to raise more young once prey becomes plentiful." },
            { letter: "D", text: "Owls begin hunting voles only after the grass is gone." }
          ],
          correct: "C"
        },
        {
          id: "relation",
          sol: "BIO.8.a",
          stem: "The relationship between the barn owls and the voles is best described as —",
          choices: [
            { letter: "A", text: "predation, in which one species eats the other" },
            { letter: "B", text: "mutualism, in which both species benefit" },
            { letter: "C", text: "parasitism, in which one species lives on the other" },
            { letter: "D", text: "competition, in which both species need the same grass" }
          ],
          correct: "A"
        },
        {
          id: "mowing",
          sol: "BIO.8.d",
          stem: "Suppose the farmer began mowing the whole hayfield to the ground every two weeks. Which effect is most likely?",
          choices: [
            { letter: "A", text: "Vole numbers would rise because the owls could no longer see them." },
            { letter: "B", text: "Vole numbers would fall because their food and cover would be removed." },
            { letter: "C", text: "Owl numbers would rise because the voles would have no grass to eat." },
            { letter: "D", text: "The boom-and-bust cycle would continue exactly as before." }
          ],
          correct: "B"
        },
        {
          id: "evidence",
          sol: "BIO.8.a",
          stem: "The observations in sentence 5 are evidence that —",
          choices: [
            { letter: "A", text: "the owls alone caused the vole crash" },
            { letter: "B", text: "the voles had reached carrying capacity and stayed there" },
            { letter: "C", text: "grass is an abiotic part of the hayfield" },
            { letter: "D", text: "food became a limiting factor at the vole peak" }
          ],
          correct: "D"
        },
        {
          id: "vocab",
          sol: "BIO.8.a",
          stem: "In sentence 4, a boom-and-bust cycle describes a population that —",
          choices: [
            { letter: "A", text: "overshoots its resources, crashes, and recovers again and again" },
            { letter: "B", text: "grows slowly to a stable level and stays there" },
            { letter: "C", text: "is wiped out by a single natural event" },
            { letter: "D", text: "grows steadily because nothing limits it" }
          ],
          correct: "A"
        },
        {
          id: "trophic",
          sol: "BIO.8.b",
          stem: "In the hayfield food chain, the barn owl is best classified as —",
          choices: [
            { letter: "A", text: "a producer, because it sits at the top of the energy pyramid" },
            { letter: "B", text: "a primary consumer, because it is the first animal in the chain" },
            { letter: "C", text: "a secondary consumer, because it eats animals that eat grass" },
            { letter: "D", text: "a decomposer, because it returns nutrients to the field when it dies" }
          ],
          correct: "C"
        }
      ]
    },

    /* ---------- medium · level 2 · BIO.8.c ---------- */
    {
      id: "eco-dune-succession-wren",
      family: "ECO",
      title: "Dunes on Wren Island",
      kind: "Ecology · BIO.8",
      blurb: "Four plots on an Eastern Shore barrier island, from bare sand to pine and oak.",
      level: 2,
      passage: "<p>" + N(1) + "Wren Island is a barrier island off Virginia's Eastern Shore that grows as storms pile new sand onto its southern end. " + N(2) + "Because the new sand is bare and has no soil, the plants that colonize it undergo <strong>primary succession</strong>. " + N(3) + "A field team laid out four plots at increasing distances from the beach, since older sand lies farther inland. " + N(4) + "In each plot they recorded the depth of dark organic soil and the plant and animal species present.</p>" +
        "<table><tr><th>Plot</th><th>Age of sand (yr)</th><th>Organic soil (cm)</th><th>Species recorded</th></tr><tr><td>A (foredune)</td><td>5</td><td>0</td><td>beachgrass, ghost crab</td></tr><tr><td>B</td><td>30</td><td>3</td><td>beachgrass, seaside goldenrod, wax myrtle, sparrows</td></tr><tr><td>C</td><td>80</td><td>12</td><td>wax myrtle, loblolly pine seedlings, cottontail rabbit</td></tr><tr><td>D (inland)</td><td>200</td><td>28</td><td>loblolly pine, live oak, wild turkey, white-tailed deer</td></tr></table>" +
        "<p>" + N(5) + "Beachgrass traps blowing sand, its roots hold the dune in place, and each year its dead leaves add organic matter. " + N(6) + "The team expects plot D to change little over the next century unless a hurricane strips it. " + N(7) + "After a small fire in 2019, plot D regrew from seeds and roots that survived in its soil.</p>",
      claims: [
        {
          id: "vocab",
          sol: "BIO.8.c",
          stem: "In sentence 2, primary succession means —",
          choices: [
            { letter: "A", text: "the return of a community after a fire that leaves the soil behind" },
            { letter: "B", text: "the development of a community on new ground that has no soil" },
            { letter: "C", text: "the replacement of a native species by an invasive one" },
            { letter: "D", text: "the growth of a single population up to its carrying capacity" }
          ],
          correct: "B"
        },
        {
          id: "trend",
          sol: "BIO.8.c",
          stem: "Which conclusion about the plots is best supported by the table?",
          choices: [
            { letter: "A", text: "As the sand ages, the organic soil deepens and the number of species increases." },
            { letter: "B", text: "Plot A has the deepest soil because it is closest to the ocean." },
            { letter: "C", text: "Loblolly pines are the first plants to colonize bare sand." },
            { letter: "D", text: "The youngest plot supports the greatest number of species." }
          ],
          correct: "A"
        },
        {
          id: "pioneer",
          sol: "BIO.8.c",
          stem: "Based on sentence 5 and the table, beachgrass is best described as a —",
          choices: [
            { letter: "A", text: "climax species that dominates the community for centuries" },
            { letter: "B", text: "decomposer that breaks down dead leaves into soil" },
            { letter: "C", text: "pioneer species that stabilizes the sand and begins building soil" },
            { letter: "D", text: "keystone predator that controls the ghost crab population" }
          ],
          correct: "C"
        },
        {
          id: "climax",
          sol: "BIO.8.c",
          stem: "Using sentence 6, plot D is best described as —",
          choices: [
            { letter: "A", text: "a pioneer community with only a few species" },
            { letter: "B", text: "an early stage of primary succession" },
            { letter: "C", text: "a dead zone where few organisms can survive" },
            { letter: "D", text: "a climax community that stays fairly stable until a disturbance" }
          ],
          correct: "D"
        },
        {
          id: "hurricane",
          sol: "BIO.8.d",
          stem: "Unlike the 2019 fire in sentence 7, a hurricane that strips plot D down to bare sand would most likely —",
          choices: [
            { letter: "A", text: "restart primary succession, because the soil and seed bank would be gone" },
            { letter: "B", text: "cause secondary succession, because the pines would resprout from roots" },
            { letter: "C", text: "have no lasting effect, because plot D is a climax community" },
            { letter: "D", text: "turn plot D into a dead zone, because salt water kills decomposers" }
          ],
          correct: "A"
        },
        {
          id: "soil",
          sol: "BIO.8.b",
          stem: "Based on sentence 5, the dark organic soil measured in the plots comes mainly from —",
          choices: [
            { letter: "A", text: "minerals carried in by wind blowing off the beach" },
            { letter: "B", text: "sand grains that darken with age in the sunlight" },
            { letter: "C", text: "dead plant material broken down by decomposers" },
            { letter: "D", text: "nitrogen taken directly from the air by the beachgrass" }
          ],
          correct: "C"
        }
      ]
    },

    /* ---------- medium · level 1 · BIO.8.c / BIO.8.b ---------- */
    {
      id: "eco-loblolly-after-clearcut",
      family: "ECO",
      title: "After the Clearcut",
      kind: "Ecology · BIO.8",
      blurb: "Five Southside Virginia pine stands, one to sixty years after harvest.",
      level: 1,
      passage: "<p>" + N(1) + "A timber company in Southside Virginia harvests its loblolly pine stands about every 30 years. " + N(2) + "A biology class visited five stands cut at different times and recorded the tallest plants and the common animals in each.</p>" +
        "<table><tr><th>Stand</th><th>Years since cut</th><th>Tallest plants</th><th>Common animals</th></tr><tr><td>1</td><td>1</td><td>crabgrass, ragweed, blackberry</td><td>field sparrows, cottontail rabbits</td></tr><tr><td>2</td><td>5</td><td>sumac, blackberry, pine seedlings</td><td>bobwhite quail, white-tailed deer</td></tr><tr><td>3</td><td>12</td><td>young loblolly pines 6 m tall</td><td>pine warblers, gray squirrels</td></tr><tr><td>4</td><td>25</td><td>loblolly pines 20 m tall, some oaks</td><td>wild turkeys, barred owls</td></tr><tr><td>5</td><td>60 (never cut)</td><td>oaks, hickories, scattered pines</td><td>pileated woodpeckers, gray foxes</td></tr></table>" +
        "<p>" + N(3) + "The class called the pattern <strong>secondary succession</strong> because the soil, roots and buried seeds survived the harvest. " + N(4) + "In stand 1 the sun-loving weeds sprouted from seeds that had waited in the soil for years. " + N(5) + "As the pines shade the ground, shade-tolerant oaks and hickories slowly replace them. " + N(6) + "Pine seedlings, unlike oak seedlings, cannot grow in deep shade. " + N(7) + "The class also estimated the carbon stored in wood: about 2 tons per hectare in stand 1 and about 120 tons per hectare in stand 5.</p>",
      claims: [
        {
          id: "climax",
          sol: "BIO.8.c",
          stem: "Which stand in the table best represents a climax community?",
          choices: [
            { letter: "A", text: "stand 1" },
            { letter: "B", text: "stand 3" },
            { letter: "C", text: "stand 4" },
            { letter: "D", text: "stand 5" }
          ],
          correct: "D"
        },
        {
          id: "vocab",
          sol: "BIO.8.c",
          stem: "In sentence 3, secondary succession refers to —",
          choices: [
            { letter: "A", text: "the first colonization of bare rock by lichens and mosses" },
            { letter: "B", text: "the regrowth of a community where soil remains after a disturbance" },
            { letter: "C", text: "the second harvest of a pine stand by the timber company" },
            { letter: "D", text: "the movement of animals from one stand to another" }
          ],
          correct: "B"
        },
        {
          id: "pioneer",
          sol: "BIO.8.c",
          stem: "The pioneer species in this study are the —",
          choices: [
            { letter: "A", text: "crabgrass and ragweed in stand 1" },
            { letter: "B", text: "loblolly pines in stand 3" },
            { letter: "C", text: "oaks and hickories in stand 5" },
            { letter: "D", text: "barred owls and gray foxes" }
          ],
          correct: "A"
        },
        {
          id: "replace",
          sol: "BIO.8.c",
          stem: "Which statement best explains why oaks and hickories eventually replace the pines?",
          choices: [
            { letter: "A", text: "Oaks grow faster than pines when both receive full sunlight." },
            { letter: "B", text: "The turkeys and owls in stand 4 kill most of the young pines." },
            { letter: "C", text: "Oak seedlings tolerate the shade under the pines, but pine seedlings do not." },
            { letter: "D", text: "Oak seedlings need bare, sunny soil in order to sprout and grow." }
          ],
          correct: "C"
        },
        {
          id: "carbon",
          sol: "BIO.8.b",
          stem: "The carbon stored in the wood of stand 5 came originally from —",
          choices: [
            { letter: "A", text: "minerals the roots absorbed from the soil" },
            { letter: "B", text: "carbon dioxide taken from the air during photosynthesis" },
            { letter: "C", text: "energy released by decomposers in the leaf litter" },
            { letter: "D", text: "carbon dioxide the trees released during respiration" }
          ],
          correct: "B"
        },
        {
          id: "predict",
          sol: "BIO.8.d",
          stem: "Which is the best prediction if the company begins cutting every stand every 15 years instead of every 30?",
          choices: [
            { letter: "A", text: "The land will spend more time in early stages, favoring quail and rabbits over owls and turkeys." },
            { letter: "B", text: "Oaks and hickories will take over the stands more quickly." },
            { letter: "C", text: "Each stand will store more carbon per hectare than before." },
            { letter: "D", text: "Primary succession will begin because the harvest removes the soil." }
          ],
          correct: "A"
        }
      ]
    },

    /* ---------- medium · level 3 · BIO.8.d / BIO.8.b / BIO.8.a ---------- */
    {
      id: "eco-oyster-reef-lynnhaven",
      family: "ECO",
      title: "Rebuilding an Oyster Reef",
      kind: "Ecology · BIO.8",
      blurb: "Oysters, water clarity and a dead zone in a Chesapeake Bay tributary.",
      level: 3,
      passage: "<p>" + N(1) + "Eastern oysters once filtered the whole Chesapeake Bay in a matter of days, but disease, overharvest and silt cut them to about 1% of their historic numbers. " + N(2) + "In 2019 a conservation group rebuilt a reef in the Lynnhaven River near Virginia Beach by piling recycled shells and seeding them with young oysters. " + N(3) + "Each summer they counted live oysters, measured how deep a white disk stayed visible (water clarity), and listed the fish and crab species on the reef.</p>" +
        "<table><tr><th>Year</th><th>Live oysters (per m²)</th><th>Clarity (cm)</th><th>Fish and crab species</th></tr><tr><td>2019</td><td>15</td><td>40</td><td>4</td></tr><tr><td>2021</td><td>60</td><td>55</td><td>9</td></tr><tr><td>2023</td><td>140</td><td>85</td><td>15</td></tr><tr><td>2025</td><td>150</td><td>90</td><td>16</td></tr></table>" +
        "<p>" + N(4) + "One adult oyster can filter up to 190 L of water a day, removing algae and silt. " + N(5) + "Upstream, nitrogen runoff from lawns and farms feeds algal blooms; when the algae die and decay, bacteria use up the oxygen and create a <strong>dead zone</strong>. " + N(6) + "Growth slowed after 2023 as the shells filled with oysters and blue crabs and cownose rays ate many of the young.</p>",
      claims: [
        {
          id: "trend",
          sol: "BIO.8.d",
          stem: "Which conclusion is best supported by the reef data?",
          choices: [
            { letter: "A", text: "Water clarity fell as the number of oysters increased." },
            { letter: "B", text: "Clearer water caused the oysters to reproduce faster." },
            { letter: "C", text: "The oysters drove away most of the fish and crab species." },
            { letter: "D", text: "As oyster numbers rose, water clarity and the number of species rose too." }
          ],
          correct: "D"
        },
        {
          id: "plateau",
          sol: "BIO.8.a",
          stem: "Which statement best explains why the oyster count levelled off between 2023 and 2025?",
          choices: [
            { letter: "A", text: "The water became too clear for the oysters to find food." },
            { letter: "B", text: "Nitrogen runoff into the river stopped after 2023." },
            { letter: "C", text: "The reef neared its carrying capacity as space ran out and predators took young oysters." },
            { letter: "D", text: "Oysters live only two years, so the first ones seeded had died." }
          ],
          correct: "C"
        },
        {
          id: "vocab",
          sol: "BIO.8.d",
          stem: "In sentence 5, a dead zone is —",
          choices: [
            { letter: "A", text: "an area of water with too little oxygen for most animals to survive" },
            { letter: "B", text: "an area where oysters have removed all of the algae" },
            { letter: "C", text: "a reef where the oysters have died of disease" },
            { letter: "D", text: "a deep channel that sunlight cannot reach" }
          ],
          correct: "A"
        },
        {
          id: "oxygen",
          sol: "BIO.8.b",
          stem: "The loss of oxygen described in sentence 5 is caused directly by —",
          choices: [
            { letter: "A", text: "algae using up oxygen during photosynthesis" },
            { letter: "B", text: "bacteria respiring as they decompose the dead algae" },
            { letter: "C", text: "nitrogen combining with oxygen in the water" },
            { letter: "D", text: "oysters filtering oxygen out of the water" }
          ],
          correct: "B"
        },
        {
          id: "two",
          sol: "BIO.8.d",
          stem: "Select TWO actions that would most directly reduce dead zones in the Chesapeake Bay.",
          choices: [
            { letter: "A", text: "planting cover crops and streamside buffers to cut nitrogen runoff" },
            { letter: "B", text: "restoring oyster reefs that filter algae from the water" },
            { letter: "C", text: "adding fertilizer to the Bay so more fish can grow" },
            { letter: "D", text: "removing eelgrass beds so boats can pass more easily" }
          ],
          correct: ["A", "B"]
        },
        {
          id: "trophic",
          sol: "BIO.8.b",
          stem: "In the Bay food web, an oyster that filters algae from the water is a —",
          choices: [
            { letter: "A", text: "producer that makes its own food from sunlight" },
            { letter: "B", text: "decomposer that recycles nutrients from dead matter" },
            { letter: "C", text: "primary consumer that feeds on producers" },
            { letter: "D", text: "tertiary consumer at the top of the food web" }
          ],
          correct: "C"
        }
      ]
    },

    /* ---------- medium · level 2 · BIO.8.b ---------- */
    {
      id: "eco-nitrogen-piedmont-farm",
      family: "ECO",
      title: "Nitrogen on a Piedmont Farm",
      kind: "Ecology · BIO.8",
      blurb: "Soybeans, root nodules, soil nitrate and a creek that drains to the James.",
      level: 2,
      passage: "<p>" + N(1) + "A farmer near Charlottesville rotates corn and soybeans and let a biology class sample her fields. " + N(2) + "Corn needs a lot of nitrogen, but plants cannot use the nitrogen gas that makes up 78% of the air. " + N(3) + "Soybeans host <strong>nitrogen-fixing bacteria</strong> in lumps on their roots called nodules; these bacteria change nitrogen gas into ammonia the plant can use. " + N(4) + "When soybean roots and leftover stalks decay, decomposers release the nitrogen as ammonium, and other soil bacteria convert it to nitrate. " + N(5) + "In spring the class measured soil nitrate: 6 mg/kg in a field that had grown corn the year before and 21 mg/kg in a field that had grown soybeans. " + N(6) + "The farmer said the soybean field needs about half as much fertilizer for the next corn crop. " + N(7) + "After heavy rain, some nitrate washes into a creek that drains to the James River. " + N(8) + "Still other bacteria in wet soil turn nitrate back into nitrogen gas, completing the cycle.</p>",
      claims: [
        {
          id: "vocab",
          sol: "BIO.8.b",
          stem: "In sentence 3, nitrogen-fixing bacteria are bacteria that —",
          choices: [
            { letter: "A", text: "convert nitrogen gas from the air into a form plants can use" },
            { letter: "B", text: "break down dead plants and release carbon dioxide" },
            { letter: "C", text: "turn nitrate in the soil back into nitrogen gas" },
            { letter: "D", text: "capture sunlight to make sugars for the soybean" }
          ],
          correct: "A"
        },
        {
          id: "data",
          sol: "BIO.8.b",
          stem: "Which conclusion is best supported by the nitrate measurements in sentence 5?",
          choices: [
            { letter: "A", text: "Corn adds more usable nitrogen to the soil than soybeans do." },
            { letter: "B", text: "Both fields contain the same amount of usable nitrogen." },
            { letter: "C", text: "The soybean crop left more usable nitrogen in the soil than the corn crop did." },
            { letter: "D", text: "Soybeans remove all of the nitrate from the soil." }
          ],
          correct: "C"
        },
        {
          id: "process",
          sol: "BIO.8.b",
          stem: "The process described in sentence 4 is —",
          choices: [
            { letter: "A", text: "photosynthesis, which stores nitrogen in sugars" },
            { letter: "B", text: "decomposition, which recycles nitrogen from dead matter" },
            { letter: "C", text: "nitrogen fixation, which pulls nitrogen from the air" },
            { letter: "D", text: "denitrification, which returns nitrogen to the air" }
          ],
          correct: "B"
        },
        {
          id: "limit",
          sol: "BIO.8.a",
          stem: "Sentences 2 and 6 suggest that usable nitrogen acts on the corn crop as —",
          choices: [
            { letter: "A", text: "a limiting factor, since a low supply holds back the crop's growth" },
            { letter: "B", text: "a decomposer, since it breaks down the old corn stalks" },
            { letter: "C", text: "a predator, since it reduces the number of corn plants" },
            { letter: "D", text: "a carrying capacity, since it counts the corn plants in the field" }
          ],
          correct: "A"
        },
        {
          id: "runoff",
          sol: "BIO.8.d",
          stem: "Which is the most likely downstream effect of the runoff described in sentence 7?",
          choices: [
            { letter: "A", text: "Nitrate will kill the algae in the James River." },
            { letter: "B", text: "Nitrate will raise the dissolved oxygen in the river." },
            { letter: "C", text: "Nitrate will start primary succession along the riverbank." },
            { letter: "D", text: "Nitrate will feed algal blooms that lead to low-oxygen water." }
          ],
          correct: "D"
        },
        {
          id: "compare",
          sol: "BIO.8.b",
          stem: "How does the movement of nitrogen through this farm differ from the movement of energy?",
          choices: [
            { letter: "A", text: "Energy is recycled by decomposers, but nitrogen is lost as heat." },
            { letter: "B", text: "Both nitrogen and energy are recycled endlessly through the field." },
            { letter: "C", text: "Nitrogen is recycled and reused, but energy enters as sunlight and leaves as heat." },
            { letter: "D", text: "Neither is recycled, so both must be added as fertilizer every year." }
          ],
          correct: "C"
        }
      ]
    },

    /* ---------- long · level 3 · BIO.8.a / BIO.8.d / BIO.8.b ---------- */
    {
      id: "eco-blue-catfish-james",
      family: "ECO",
      title: "Blue Catfish in the James",
      kind: "Ecology · BIO.8",
      blurb: "Twenty years of fish surveys as an introduced giant takes over a tidal river.",
      level: 3,
      passage: "<p>" + N(1) + "Blue catfish were brought from the Mississippi River basin and stocked in the James River in the 1970s as a sport fish. " + N(2) + "They grow to more than 40 kg, eat almost anything, and now make up most of the fish biomass in some tidal stretches. " + N(3) + "A state biologist surveyed the same 2 km stretch of the tidal James by electrofishing every June. " + N(4) + "She counted blue catfish, native white catfish and blue crabs, and examined the stomach contents of 50 blue catfish.</p>" +
        "<table><tr><th>Year</th><th>Blue catfish</th><th>White catfish</th><th>Blue crabs</th></tr><tr><td>2005</td><td>40</td><td>210</td><td>180</td></tr><tr><td>2010</td><td>260</td><td>120</td><td>150</td></tr><tr><td>2015</td><td>740</td><td>45</td><td>70</td></tr><tr><td>2020</td><td>780</td><td>30</td><td>45</td></tr><tr><td>2025</td><td>770</td><td>28</td><td>40</td></tr></table>" +
        "<p>" + N(5) + "The stomachs held blue crabs, menhaden, freshwater mussels, plant material and, in the largest fish, white catfish. " + N(6) + "Plotted over time, the blue catfish count rose steeply and then flattened after 2015, while the white catfish count fell year after year. " + N(7) + "White catfish and blue catfish both feed on the river bottom and shelter in the same deep holes. " + N(8) + "Virginia now encourages commercial harvest of blue catfish and sets no daily limit for anglers. " + N(9) + "The biologist noted that an <strong>omnivore</strong> like the blue catfish, which feeds at several trophic levels, is very hard to remove once it is established.</p>",
      claims: [
        {
          id: "trend",
          sol: "BIO.8.a",
          stem: "Which conclusion about the blue catfish is best supported by the survey table?",
          choices: [
            { letter: "A", text: "Their numbers rose only after the white catfish disappeared." },
            { letter: "B", text: "Their numbers and the blue crab numbers rose together." },
            { letter: "C", text: "Their numbers fell steadily along with the other two species." },
            { letter: "D", text: "Their numbers grew rapidly until about 2015 and then held near 780." }
          ],
          correct: "D"
        },
        {
          id: "interact",
          sol: "BIO.8.a",
          stem: "Sentence 7 describes which interaction between white catfish and blue catfish?",
          choices: [
            { letter: "A", text: "competition, because they use the same food and shelter" },
            { letter: "B", text: "mutualism, because each helps the other find food" },
            { letter: "C", text: "commensalism, because one benefits and the other is unaffected" },
            { letter: "D", text: "parasitism, because one lives on the body of the other" }
          ],
          correct: "A"
        },
        {
          id: "plateau",
          sol: "BIO.8.a",
          stem: "Which statement best explains why the blue catfish count flattened after 2015?",
          choices: [
            { letter: "A", text: "White catfish began eating most of the young blue catfish." },
            { letter: "B", text: "The biologist stopped counting any fish heavier than 40 kg." },
            { letter: "C", text: "The population reached the stretch's carrying capacity as food and shelter grew scarce." },
            { letter: "D", text: "Blue crabs disappeared from the river, so the blue catfish starved." }
          ],
          correct: "C"
        },
        {
          id: "two",
          sol: "BIO.8.d",
          stem: "Select TWO statements that together explain why biologists classify the blue catfish as an invasive species in the James.",
          choices: [
            { letter: "A", text: "Humans introduced it from outside the region where it evolved." },
            { letter: "B", text: "It harms native populations such as white catfish and blue crabs." },
            { letter: "C", text: "It reached a carrying capacity, which no native species can do." },
            { letter: "D", text: "It grows larger than any fish that lived in the river before." }
          ],
          correct: ["A", "B"]
        },
        {
          id: "vocab",
          sol: "BIO.8.b",
          stem: "In sentence 9, an omnivore is an animal that —",
          choices: [
            { letter: "A", text: "is a top predator with no natural enemies" },
            { letter: "B", text: "eats both plants and animals" },
            { letter: "C", text: "eats only other species of fish" },
            { letter: "D", text: "breaks down dead material on the river bottom" }
          ],
          correct: "B"
        },
        {
          id: "pyramid",
          sol: "BIO.8.b",
          stem: "The largest blue catfish, which eat white catfish, are far fewer than the small ones that eat mussels and plants. Which statement best explains this?",
          choices: [
            { letter: "A", text: "Top consumers have the most energy available, so they need fewer individuals." },
            { letter: "B", text: "Large blue catfish stop reproducing once they grow past 40 kg." },
            { letter: "C", text: "Only about 10% of energy passes up each trophic level, so little supports top consumers." },
            { letter: "D", text: "Anglers are allowed to keep only the largest blue catfish they catch." }
          ],
          correct: "C"
        }
      ]
    },

    /* ---------- long · level 3 · BIO.8.a / BIO.8.b / BIO.8.c / BIO.8.d ---------- */
    {
      id: "eco-lark-lake-wildfire",
      family: "ECO",
      title: "A Lake After the Fire",
      kind: "Ecology · BIO.8",
      blurb: "Ash, an algae boom, a grazing crash and a hillside growing back.",
      level: 3,
      passage: "<p>" + N(1) + "Lark Lake sits in a forested basin in the Rocky Mountains and is fed by snowmelt streams. " + N(2) + "One August a wildfire burned most of the trees around the lake. " + N(3) + "Autumn rain washed ash rich in phosphorus and nitrogen into the water. " + N(4) + "A research station had sampled the lake monthly for years, so scientists could compare conditions before and after the fire.</p>" +
        "<p>" + N(5) + "The next spring, <strong>phytoplankton</strong> (floating algae) rose from about 500 cells per mL to 20,000 cells per mL in six weeks, a J-shaped curve. " + N(6) + "Zooplankton that graze on the algae increased about a month later, and the algae then fell to 4,000 cells per mL and held there, so the full graph looks like a J that bends into a plateau. " + N(7) + "Trout that eat the zooplankton grew faster that summer. " + N(8) + "Dissolved oxygen at the lake bottom dropped from 8 mg/L to 2 mg/L in late summer as dead algae sank and decayed. " + N(9) + "With no tree roots to hold the slopes, mud washed into the shallows after each rain, and stream flow into the lake rose because less water was taken up by plants and returned to the air. " + N(10) + "By the third year, fireweed and aspen sprouts covered the burned slopes and the spring algae peak was much smaller.</p>",
      claims: [
        {
          id: "curve",
          sol: "BIO.8.a",
          stem: "Based on sentence 6, the algae's J-shaped curve bent into a plateau mainly because —",
          choices: [
            { letter: "A", text: "the lake froze and blocked sunlight from the algae" },
            { letter: "B", text: "grazing by zooplankton and the shrinking nutrient supply limited the algae" },
            { letter: "C", text: "the trout began feeding directly on the algae" },
            { letter: "D", text: "the fire heated the water above what algae can tolerate" }
          ],
          correct: "B"
        },
        {
          id: "vocab",
          sol: "BIO.8.b",
          stem: "In sentence 5, the phytoplankton act in the lake as —",
          choices: [
            { letter: "A", text: "producers that convert sunlight into chemical energy for the food web" },
            { letter: "B", text: "primary consumers that feed on the zooplankton" },
            { letter: "C", text: "decomposers that release nutrients from dead trout" },
            { letter: "D", text: "an abiotic factor that limits the trout population" }
          ],
          correct: "A"
        },
        {
          id: "flow",
          sol: "BIO.8.b",
          stem: "Which sequence correctly shows the flow of energy described in sentences 5 through 7?",
          choices: [
            { letter: "A", text: "trout → zooplankton → phytoplankton → sunlight" },
            { letter: "B", text: "ash → phytoplankton → trout → zooplankton" },
            { letter: "C", text: "phytoplankton → sunlight → zooplankton → trout" },
            { letter: "D", text: "sunlight → phytoplankton → zooplankton → trout" }
          ],
          correct: "D"
        },
        {
          id: "water",
          sol: "BIO.8.b",
          stem: "Which statement best explains why stream flow into the lake rose after the fire, as described in sentence 9?",
          choices: [
            { letter: "A", text: "The fire added water to the soil as the trees burned." },
            { letter: "B", text: "More water evaporated from the surface of the lake." },
            { letter: "C", text: "With fewer plants transpiring, more rain and snowmelt ran off into the lake." },
            { letter: "D", text: "The mud raised the lake bottom and pushed water upstream." }
          ],
          correct: "C"
        },
        {
          id: "virginia",
          sol: "BIO.8.d",
          stem: "The low-oxygen water in sentence 8 is most similar to which problem in Virginia?",
          choices: [
            { letter: "A", text: "the dead zone in the Chesapeake Bay fed by nutrient runoff" },
            { letter: "B", text: "the spread of kudzu along roadsides and field edges" },
            { letter: "C", text: "the warming of trout streams after streamside trees are cut" },
            { letter: "D", text: "the loss of ash trees to the emerald ash borer" }
          ],
          correct: "A"
        },
        {
          id: "regrow",
          sol: "BIO.8.c",
          stem: "The regrowth on the slopes in sentence 10 is best described as —",
          choices: [
            { letter: "A", text: "primary succession, because the fire removed all of the soil" },
            { letter: "B", text: "a climax community, because aspen will dominate for centuries" },
            { letter: "C", text: "an invasive takeover, because fireweed is not native to the mountains" },
            { letter: "D", text: "secondary succession, because soil and roots survived the fire" }
          ],
          correct: "D"
        }
      ]
    }
  ];

  for (var i = 0; i < PACKS.length; i++) P.push(PACKS[i]);
})(typeof window !== "undefined" ? window : global);
