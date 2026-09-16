/* SOL Lab — question-pack machinery for the Virginia SOL builds (EOC Biology and Algebra I).
   The packs themselves live in js/content2.js onward (one file per unit) and push into
   HEIST_PACKS. This file defines the courses, the units (families), the standards map that
   drives the skill screen, the strand filter, the adaptive level estimate and the stamina
   schedule. */
(function (global) {
  var PACKS = [];

  /* Courses. The title screen shows one tab per course; a family belongs to exactly one course.
     `notes` is what the side panel calls the stimulus; `stamina` is the course's stimulus-length
     schedule (math problem sets are naturally shorter than lab notes). */
  var COURSES = {
    BIO: { id: "BIO", name: "Biology", tab: "Biology · EOC", kicker: "Virginia EOC Biology SOL · 100 levels", notes: "Lab notes", def: "ALL", stamina: { start: 65, step: 5, every: 3, max: 240 } },
    MATH: { id: "MATH", name: "Algebra I", tab: "Algebra I · EOC", kicker: "Virginia Algebra I SOL · 100 levels", notes: "Problem set", def: "ALG", stamina: { start: 45, step: 4, every: 3, max: 170 } }
  };

  /* Units. `id` is the pack family; the title screen shows one card per unit plus a Full review
     card (`all: true`) for each course. `stds` lists the standard prefixes a pack in that unit
     may use (checked by the validator). */
  var FAMILIES = [
    { id: "ALL", course: "BIO", all: true, label: "Full review", short: "Full review", kind: "All units", meta: "Every unit mixed, leaning toward the standards you miss most. Best in the last weeks before the test.", stds: ["BIO.1", "BIO.2", "BIO.3", "BIO.4", "BIO.5", "BIO.6", "BIO.7", "BIO.8"] },
    { id: "INV", course: "BIO", label: "Scientific Investigation", short: "Investigation", kind: "BIO.1", meta: "Variables, controls, data tables, graphs, conclusions and models. The practices every other unit is tested through.", stds: ["BIO.1"] },
    { id: "CHEM", course: "BIO", label: "Biochemistry", short: "Biochemistry", kind: "BIO.2", meta: "Water, macromolecules, enzymes, photosynthesis and cellular respiration.", stds: ["BIO.2"] },
    { id: "CELL", course: "BIO", label: "Cell Structure & Function", short: "Cells", kind: "BIO.3", meta: "Cell theory, organelles, levels of organization, the membrane and transport, specialization.", stds: ["BIO.3"] },
    { id: "MICRO", course: "BIO", label: "Bacteria & Viruses", short: "Bacteria & Viruses", kind: "BIO.4", meta: "Virus and bacterium structure, replication, roles in ecosystems and the germ theory of disease.", stds: ["BIO.4"] },
    { id: "GEN", course: "BIO", label: "Genetics & Heredity", short: "Genetics", kind: "BIO.5", meta: "Meiosis, Mendel, Punnett squares, pedigrees, mutations, variation and biotechnology.", stds: ["BIO.5"] },
    { id: "DNA", course: "BIO", label: "DNA & Protein Synthesis", short: "DNA", kind: "BIO.2 · BIO.5", meta: "DNA structure and replication, transcription, translation, and the history of the DNA model.", stds: ["BIO.5.a", "BIO.5.b", "BIO.2.d"] },
    { id: "EVO", course: "BIO", label: "Evolution & Classification", short: "Evolution", kind: "BIO.6 · BIO.7", meta: "Cladograms, domains and kingdoms, fossils, natural selection and speciation.", stds: ["BIO.6", "BIO.7"] },
    { id: "ECO", course: "BIO", label: "Ecology", short: "Ecology", kind: "BIO.8", meta: "Populations, food webs, nutrient cycles, succession, human impact and Virginia ecosystems.", stds: ["BIO.8"] },
    /* Algebra I (2023 Virginia Mathematics Standards of Learning): four strands. */
    { id: "ALG", course: "MATH", all: true, label: "Full review", short: "Full review", kind: "All strands", meta: "Every Algebra I strand mixed, leaning toward the standards you miss most. Best in the last weeks before the test.", stds: ["A.EO", "A.EI", "A.F", "A.ST"] },
    { id: "EO", course: "MATH", label: "Expressions & Operations", short: "Expressions", kind: "A.EO", meta: "Writing and evaluating expressions, polynomials and factoring, laws of exponents, radicals.", stds: ["A.EO"] },
    { id: "EI", course: "MATH", label: "Equations & Inequalities", short: "Equations", kind: "A.EI", meta: "Multistep equations and inequalities, literal equations, systems, and quadratic equations.", stds: ["A.EI"] },
    { id: "FN", course: "MATH", label: "Functions", short: "Functions", kind: "A.F", meta: "Linear functions and their graphs, slope and intercepts, quadratic and exponential functions.", stds: ["A.F"] },
    { id: "ST", course: "MATH", label: "Statistics", short: "Statistics", kind: "A.ST", meta: "The data cycle, scatterplots, lines and curves of best fit, predictions and their limits.", stds: ["A.ST"] }
  ];
  /* Which pack families feed each selection: a Full review card draws from every unit of its course. */
  var FAMILY_POOL = {};
  FAMILIES.forEach(function (f) {
    FAMILY_POOL[f.id] = f.all ? FAMILIES.filter(function (x) { return x.course === f.course && !x.all; }).map(function (x) { return x.id; }) : [f.id];
  });

  /* Standards map. Biology: 2018 Virginia Biology Standards of Learning, BIO.1–BIO.8 with their
     key ideas. Algebra I: 2023 Virginia Mathematics Standards of Learning, A.EO.1–A.ST.1 with
     their lettered knowledge-and-skills statements. The skill screen shows these as cards;
     `strand` is the prefix a claim's `sol` code must start with. Unit cards list only the key
     ideas that unit teaches. */
  var STANDARDS = {
    "BIO.1": { course: "BIO", name: "Scientific investigation", keys: {
      a: "asking questions and defining problems",
      b: "planning and carrying out investigations",
      c: "interpreting, analyzing, and evaluating data",
      d: "constructing and critiquing conclusions and explanations",
      e: "developing and using models",
      f: "obtaining, evaluating, and communicating information" } },
    "BIO.2": { course: "BIO", name: "Chemical and biochemical processes", keys: {
      a: "water chemistry and its impact on life processes",
      b: "the structure and function of macromolecules",
      c: "the nature of enzymes",
      d: "protein synthesis: DNA as the code for proteins",
      e: "the capture, storage, transformation, and flow of energy through photosynthesis and respiration" } },
    "BIO.3": { course: "BIO", name: "Cell structure and function", keys: {
      a: "the cell theory is supported by evidence",
      b: "structures in unicellular and multicellular organisms work interdependently to carry out life processes",
      c: "the structure and function of the cell membrane support cell transport",
      d: "specialization leads to the development of different types of cells" } },
    "BIO.4": { course: "BIO", name: "Bacteria and viruses", keys: {
      a: "viruses depend on a host for metabolic processes",
      b: "the modes of reproduction and replication can be compared",
      c: "the structures and functions can be compared",
      d: "bacteria and viruses have a role in other organisms and the environment",
      e: "the germ theory of infectious disease is supported by evidence" } },
    "BIO.5": { course: "BIO", name: "Mechanisms of inheritance", keys: {
      a: "DNA has structure and is the foundation for protein synthesis",
      b: "the structural model of DNA has developed over time",
      c: "cell division and gamete formation pass genes to the next generation",
      d: "the variety of traits in an organism are the result of the expression of various combinations of alleles",
      e: "mutations and genetic variation",
      f: "synthetic biology has biological and ethical implications" } },
    "BIO.6": { course: "BIO", name: "Modern classification", keys: {
      a: "structural similarities among organisms",
      b: "fossil record interpretation",
      c: "comparison of developmental stages",
      d: "biochemical similarities and differences",
      e: "classification systems are adaptable to new scientific discoveries" } },
    "BIO.7": { course: "BIO", name: "Populations change through time", keys: {
      a: "evidence found in fossil records",
      b: "how variation of traits, reproductive strategies, and environmental pressures affect survival",
      c: "how natural selection leads to adaptations",
      d: "the emergence of new species",
      e: "scientific evidence and explanations for biological evolution" } },
    "BIO.8": { course: "BIO", name: "Dynamic equilibria in ecosystems", keys: {
      a: "interactions within and among populations: carrying capacity, limiting factors, and growth curves",
      b: "nutrient cycling with energy flow through ecosystems",
      c: "succession patterns in ecosystems",
      d: "natural events and human activities influence local and global ecosystems and the flora and fauna of Virginia" } },
    /* ── Algebra I ── */
    "A.EO.1": { course: "MATH", name: "Expressions: represent and evaluate", keys: {
      a: "translate between verbal quantitative situations and algebraic expressions, including contextual situations",
      b: "evaluate algebraic expressions, including absolute value, square roots, and cube roots, for given replacement values including rational numbers" } },
    "A.EO.2": { course: "MATH", name: "Polynomials: operations and factoring", keys: {
      a: "determine sums and differences of polynomial expressions in one variable",
      b: "determine the product of polynomial expressions in one variable (distributive property, area models)",
      c: "factor completely first- and second-degree polynomials in one variable with integral coefficients",
      d: "determine the quotient of polynomials using a monomial or binomial divisor",
      e: "represent and demonstrate equality of quadratic expressions in different forms" } },
    "A.EO.3": { course: "MATH", name: "Laws of exponents", keys: {
      a: "derive the laws of exponents through patterns: products, quotients, and powers of bases",
      b: "simplify multivariable expressions and ratios of monomials with integer exponents using the laws of exponents" } },
    "A.EO.4": { course: "MATH", name: "Radical expressions", keys: {
      a: "simplify square roots of whole numbers to simplest radical form",
      b: "simplify cube roots of integers",
      c: "add, subtract, and multiply numeric square-root and cube-root expressions",
      d: "generate equivalent expressions using rational exponents of 1/2 and 1/3" } },
    "A.EI.1": { course: "MATH", name: "Linear equations and inequalities in one variable", keys: {
      a: "write a linear equation or inequality in one variable to represent a contextual situation",
      b: "solve multistep linear equations in one variable using the properties of real numbers and equality",
      c: "solve multistep linear inequalities in one variable and graph the solution set on a number line",
      d: "rearrange a formula or literal equation to solve for a specified variable",
      e: "determine whether a linear equation in one variable has one, none, or infinitely many solutions",
      f: "verify solutions and explain the solution method; interpret solutions in context" } },
    "A.EI.2": { course: "MATH", name: "Systems of linear equations and inequalities", keys: {
      a: "create a system of two linear equations in two variables to represent a contextual situation",
      b: "solve a system of two linear equations in two variables algebraically and graphically",
      c: "determine whether a system of two linear equations has one, none, or infinitely many solutions",
      d: "write a system of two linear inequalities in two variables to represent a contextual situation",
      e: "represent the solution of a linear inequality in two variables graphically",
      f: "represent the solution set of a system of two linear inequalities graphically",
      g: "determine whether an ordered pair is a solution to a linear inequality or a system of inequalities",
      h: "verify solutions to systems and inequalities; explain the method and interpret solutions in context" } },
    "A.EI.3": { course: "MATH", name: "Quadratic equations in one variable", keys: {
      a: "solve a quadratic equation in one variable over the real numbers, with rational or irrational solutions, including in context",
      b: "determine and justify whether a quadratic equation has no real solutions, one real solution, or two real solutions",
      c: "verify solutions to a quadratic equation algebraically, graphically, or with technology; interpret solutions in context" } },
    "A.F.1": { course: "MATH", name: "Linear functions", keys: {
      a: "determine the domain, range, zeros, slope, y-intercept, x-intercept, and end behavior of a linear function",
      b: "graph a linear function from its equation and write it in slope-intercept, standard, and point-slope forms",
      c: "determine the slope of a line from an equation, a graph, two points, or a table",
      d: "write the equation of a linear function given slope and y-intercept, slope and a point, two points, a graph, or a table",
      e: "write the equation of a line parallel or perpendicular to a given line through a given point",
      f: "use function notation: determine f(x) for a given x, and x for a given f(x)",
      g: "recognize and model direct variation and its constant of variation",
      h: "explain the meaning of the slope and the y-intercept of a linear function in context",
      i: "compare and contrast linear functions represented algebraically, graphically, in tables, and in words",
      j: "determine the characteristics of a linear function from a graph, table, or set of ordered pairs",
      k: "model a linear relationship from a contextual situation with an equation, graph, or table",
      l: "verify and justify characteristics and solutions of linear functions, including with technology" } },
    "A.F.2": { course: "MATH", name: "Quadratic and exponential functions", keys: {
      a: "determine whether a relation given as ordered pairs, a table, a mapping, or a graph is a function",
      b: "determine domain, range, zeros, intercepts, vertex, axis of symmetry, intervals of increase and decrease, and end behavior of quadratic and exponential functions",
      c: "use function notation: determine f(x) for a given x, and x for a given f(x), graphically and algebraically",
      d: "graph a quadratic or exponential function from its equation",
      e: "write a quadratic function in factored form from its zeros and relate zeros, factors, and x-intercepts",
      f: "connect the roots of a quadratic equation, the zeros of the function, its x-intercepts, and its factors",
      g: "recognize and describe exponential growth and decay from an equation, a table, or a graph",
      h: "compare linear, quadratic, and exponential functions represented in different ways",
      i: "model quadratic and exponential relationships from contextual situations" } },
    "A.ST.1": { course: "MATH", name: "The data cycle with bivariate data", keys: {
      a: "formulate investigative questions that require the collection of bivariate data",
      b: "determine what variables could be used to explain a given contextual problem or situation",
      c: "determine an appropriate method to collect a representative sample of bivariate data",
      d: "represent bivariate data in a scatterplot, with and without technology",
      e: "determine the linear or quadratic curve of best fit and interpret its parameters in context",
      f: "analyze the relationship between the variables: direction, strength, outliers, and the equation of best fit",
      g: "use the curve of best fit to make predictions and evaluate whether they are reasonable",
      h: "analyze and communicate the results, including the limits of the data and correlation versus causation" } }
  };
  function courseStandards(course) {
    return Object.keys(STANDARDS).filter(function (k) { return STANDARDS[k].course === course; });
  }
  /* Longest code prefixes first so "A.EO.1" is tried before "A.EI.2" style overlaps. */
  var CODE_PREFIXES = Object.keys(STANDARDS).sort(function (a, b) { return b.length - a.length; });
  function codeStandard(code) {
    code = String(code || "").toUpperCase();
    for (var i = 0; i < CODE_PREFIXES.length; i++) {
      var p = CODE_PREFIXES[i].toUpperCase();
      if (code === p || code.indexOf(p + ".") === 0) return CODE_PREFIXES[i];
    }
    return null;
  }
  function isCode(s) { return codeStandard(s) !== null; }

  /* Skill cards per unit (strand = the sol-code prefix the filter keeps). */
  var SKILLS = {
    INV: [
      { strand: "BIO.1.A", kind: "BIO.1 a", name: "Questions & hypotheses", meta: "Testable questions, hypotheses, and what a study can and cannot answer." },
      { strand: "BIO.1.B", kind: "BIO.1 b", name: "Design & variables", meta: "Independent, dependent and controlled variables, control groups, trials and safety." },
      { strand: "BIO.1.C", kind: "BIO.1 c", name: "Data & graphs", meta: "Reading tables and graphs, trends, averages, outliers and precision." },
      { strand: "BIO.1.D", kind: "BIO.1 d", name: "Conclusions", meta: "Claims that the evidence supports, sources of error, and what to test next." },
      { strand: "BIO.1.E", kind: "BIO.1 e", name: "Models", meta: "Diagrams, simulations and equations: what a model shows and where it breaks down." }
    ],
    CHEM: [
      { strand: "BIO.2.A", kind: "BIO.2 a", name: "Water", meta: "Polarity, hydrogen bonds, cohesion, adhesion, pH and why water matters to cells." },
      { strand: "BIO.2.B", kind: "BIO.2 b", name: "Macromolecules", meta: "Carbohydrates, lipids, proteins and nucleic acids: monomers, structure and jobs." },
      { strand: "BIO.2.C", kind: "BIO.2 c", name: "Enzymes", meta: "Active sites, substrates, activation energy, temperature and pH." },
      { strand: "BIO.2.E", kind: "BIO.2 e", name: "Photosynthesis & respiration", meta: "Reactants, products, ATP, chloroplasts, mitochondria and the flow of energy." }
    ],
    CELL: [
      { strand: "BIO.3.A", kind: "BIO.3 a", name: "Cell theory", meta: "Evidence for the cell theory, microscopes, prokaryotes and eukaryotes." },
      { strand: "BIO.3.B", kind: "BIO.3 b", name: "Organelles & organization", meta: "Organelle jobs, plant vs animal cells, cells to tissues to organs to systems." },
      { strand: "BIO.3.C", kind: "BIO.3 c", name: "Membrane & transport", meta: "Phospholipid bilayer, diffusion, osmosis, facilitated and active transport." },
      { strand: "BIO.3.D", kind: "BIO.3 d", name: "Specialization", meta: "Stem cells, differentiation, and how a cell's shape fits its job." }
    ],
    MICRO: [
      { strand: "BIO.4.A", kind: "BIO.4 a", name: "Viruses need a host", meta: "Why viruses are not cells, and how they take over a host's machinery." },
      { strand: "BIO.4.B", kind: "BIO.4 b", name: "Reproduction & replication", meta: "Binary fission, conjugation, lytic and lysogenic cycles." },
      { strand: "BIO.4.C", kind: "BIO.4 c", name: "Structure comparison", meta: "Capsids, cell walls, plasmids, flagella and size." },
      { strand: "BIO.4.D", kind: "BIO.4 d", name: "Roles in nature", meta: "Decomposers, nitrogen fixers, gut bacteria, biotechnology and disease." },
      { strand: "BIO.4.E", kind: "BIO.4 e", name: "Germ theory", meta: "Evidence for the germ theory, vaccines, antibiotics and resistance." }
    ],
    GEN: [
      { strand: "BIO.5.C", kind: "BIO.5 c", name: "Meiosis & gametes", meta: "Chromosome number, crossing over, independent assortment and mitosis vs meiosis." },
      { strand: "BIO.5.D", kind: "BIO.5 d", name: "Alleles & Punnett squares", meta: "Dominant and recessive, genotype and phenotype, ratios, pedigrees, sex-linked traits." },
      { strand: "BIO.5.E", kind: "BIO.5 e", name: "Mutations & variation", meta: "Point and frameshift mutations, chromosome changes, and where variation comes from." },
      { strand: "BIO.5.F", kind: "BIO.5 f", name: "Biotechnology", meta: "Gel electrophoresis, GMOs, gene therapy, cloning and the ethics of each." }
    ],
    DNA: [
      { strand: "BIO.5.A", kind: "BIO.5 a", name: "DNA structure & replication", meta: "Nucleotides, base pairing, the double helix and semi-conservative replication." },
      { strand: "BIO.2.D", kind: "BIO.2 d", name: "Protein synthesis", meta: "Transcription, translation, codons, the genetic code and RNA types." },
      { strand: "BIO.5.B", kind: "BIO.5 b", name: "History of the DNA model", meta: "Griffith, Avery, Hershey and Chase, Chargaff, Franklin, Watson and Crick." }
    ],
    EVO: [
      { strand: "BIO.6", kind: "BIO.6", name: "Classification", meta: "Domains, kingdoms, binomial names, cladograms and the evidence used to sort life." },
      { strand: "BIO.7.A", kind: "BIO.7 a · e", name: "Evidence for evolution", meta: "Fossils, homologous structures, embryos and DNA comparisons." },
      { strand: "BIO.7.B", kind: "BIO.7 b · c", name: "Natural selection", meta: "Variation, environmental pressure, fitness and adaptation." },
      { strand: "BIO.7.D", kind: "BIO.7 d", name: "Speciation", meta: "Isolation, divergence and how new species arise." }
    ],
    ECO: [
      { strand: "BIO.8.A", kind: "BIO.8 a", name: "Populations", meta: "Growth curves, carrying capacity, limiting factors, predation and competition." },
      { strand: "BIO.8.B", kind: "BIO.8 b", name: "Energy & cycles", meta: "Food webs, trophic levels, energy pyramids, and the carbon, nitrogen and water cycles." },
      { strand: "BIO.8.C", kind: "BIO.8 c", name: "Succession", meta: "Primary and secondary succession, pioneer species and climax communities." },
      { strand: "BIO.8.D", kind: "BIO.8 d", name: "Human impact & Virginia", meta: "The Chesapeake Bay, invasive species, pollution, climate and conservation." }
    ],
    /* ── Algebra I ── */
    EO: [
      { strand: "A.EO.1", kind: "A.EO.1", name: "Write & evaluate expressions", meta: "Words to algebra and back; evaluating with fractions, decimals, absolute value and roots." },
      { strand: "A.EO.2", kind: "A.EO.2", name: "Polynomials & factoring", meta: "Adding, subtracting, multiplying and dividing polynomials; factoring completely; equivalent forms." },
      { strand: "A.EO.3", kind: "A.EO.3", name: "Laws of exponents", meta: "Products, quotients and powers of powers; zero and negative exponents; ratios of monomials." },
      { strand: "A.EO.4", kind: "A.EO.4", name: "Radicals", meta: "Simplest radical form, cube roots, adding and multiplying radicals, rational exponents ½ and ⅓." }
    ],
    EI: [
      { strand: "A.EI.1", kind: "A.EI.1", name: "Equations & inequalities", meta: "Multistep equations and inequalities in one variable, number-line graphs, literal equations, how many solutions." },
      { strand: "A.EI.2", kind: "A.EI.2", name: "Systems", meta: "Systems of two linear equations, inequalities in two variables and their graphs, checking ordered pairs." },
      { strand: "A.EI.3", kind: "A.EI.3", name: "Quadratic equations", meta: "Factoring, square roots and the quadratic formula; how many real solutions; solutions in context." }
    ],
    FN: [
      { strand: "A.F.1", kind: "A.F.1", name: "Linear functions", meta: "Slope, intercepts, zeros, function notation, forms of a line, parallel and perpendicular, direct variation, modeling." },
      { strand: "A.F.2", kind: "A.F.2", name: "Quadratic & exponential", meta: "Is it a function? Vertex, zeros, axis of symmetry, growth and decay, comparing function families." }
    ],
    ST: [
      { strand: "A.ST.1.A", kind: "A.ST.1 a–d", name: "Data cycle & scatterplots", meta: "Investigative questions, choosing variables, representative samples, plotting bivariate data." },
      { strand: "A.ST.1.E", kind: "A.ST.1 e–h", name: "Best fit & predictions", meta: "Lines and curves of best fit, slope in context, outliers, predictions and their limits, correlation vs causation." }
    ]
  };
  /* A course's Full review card shows its standards themselves as skill cards. */
  Object.keys(COURSES).forEach(function (cid) {
    var fam = COURSES[cid].def;
    SKILLS[fam] = courseStandards(cid).map(function (k) {
      return { strand: k, kind: k, name: STANDARDS[k].name, meta: Object.keys(STANDARDS[k].keys).map(function (L) { return L + ") " + STANDARDS[k].keys[L]; }).join("; ") + "." };
    });
  });
  Object.keys(SKILLS).forEach(function (fam) {
    var f = familyDef(fam);
    SKILLS[fam].push({ strand: "ALL", kind: "All skills", name: "All", meta: f && f.all ? "Every standard mixed, leaning toward the ones you miss most." : "Everything in this unit mixed, leaning toward the skills you miss most." });
  });
  /* Some skill cards cover several key ideas (BIO.7 a·e, BIO.7 b·c, A.ST.1 a–d, A.ST.1 e–h): extra prefixes the card also keeps. */
  var STRAND_ALIASES = {
    "BIO.7.A": ["BIO.7.E"], "BIO.7.B": ["BIO.7.C"],
    "A.ST.1.A": ["A.ST.1.B", "A.ST.1.C", "A.ST.1.D"], "A.ST.1.E": ["A.ST.1.F", "A.ST.1.G", "A.ST.1.H"]
  };

  function wordCount(s) {
    return String(s).replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  }

  function letterIndex(claim, letter) {
    var ch = (claim && claim.choices) || [];
    var L = String(letter).toUpperCase();
    for (var i = 0; i < ch.length; i++) {
      if (String(ch[i].letter).toUpperCase() === L) return i;
    }
    var fallback = "ABCD".indexOf(L);
    return fallback >= 0 ? fallback : 0;
  }

  function correctList(claim) {
    var c = claim && claim.correct;
    if (c == null) return [];
    var raw = Array.isArray(c) ? c.slice() : [c];
    return raw.map(function (x) {
      if (typeof x === "number") return x;
      return letterIndex(claim, x);
    });
  }

  function isMulti(claim) {
    return correctList(claim).length > 1;
  }

  /* A claim's strand is its full standard code, upper-cased: "BIO.8.a" -> "BIO.8.A", "A.EO.1.b" -> "A.EO.1.B". */
  function strandOf(claim) {
    if (claim && claim.strand) return String(claim.strand).toUpperCase();
    var sol = String((claim && claim.sol) || "").toUpperCase().replace(/\s+/g, "");
    return isCode(sol) ? sol : "BIO.1";
  }
  function standardOf(claim) {
    return codeStandard(strandOf(claim)) || "BIO.1";
  }
  function prefixMatch(code, prefix) {
    return code === prefix || code.indexOf(prefix + ".") === 0;
  }
  function strandMatch(claim, strand) {
    strand = String(strand || "ALL").toUpperCase();
    if (!strand || strand === "ALL" || strand === "NULL") return true;
    if (!isCode(strand)) return true;
    var code = strandOf(claim);
    if (prefixMatch(code, strand)) return true;
    var extra = STRAND_ALIASES[strand] || [];
    for (var i = 0; i < extra.length; i++) if (prefixMatch(code, extra[i])) return true;
    return false;
  }

  /* Difficulty 1–3 for the adaptive picker: the pack's own `level` tag, or an
     estimate from sentence length and long words when a pack has none. */
  function syllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, "");
    if (!word) return 0;
    if (word.length <= 3) return 1;
    var v = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "").match(/[aeiouy]{1,2}/g);
    return v ? v.length : 1;
  }
  function readingGrade(html) {
    var text = String(html).replace(/<[^>]+>/g, " ").replace(/\(\d+\)/g, " ");
    var words = text.split(/\s+/).filter(Boolean), sents = text.split(/[.!?]+\s/).filter(Boolean).length || 1, syl = 0;
    if (!words.length) return 5;
    words.forEach(function (w) { syl += syllables(w); });
    return 0.39 * (words.length / sents) + 11.8 * (syl / words.length) - 15.59;   /* Flesch–Kincaid grade */
  }
  function passageWords(p) {
    if (p._words) return p._words;
    var text = String(p.passage || "").replace(/<[^>]+>/g, " ").replace(/\(\d+\)/g, " ");
    p._words = text.split(/\s+/).filter(Boolean).length;
    return p._words;
  }
  /* Stamina schedule: the stimulus length the picker aims for on a given level. Word counts
     include table cells, so a "tiny" 60-word note with a data table measures 80-100.
     Biology: level 1 targets ~65 words; every 3 levels the target grows by 5 words, reaching
     ~225 words by level 99. Algebra I problem sets are shorter: ~45 words at level 1 growing
     4 words every 3 levels to ~170. Tune in COURSES[...].stamina. */
  var STAMINA = COURSES.BIO.stamina;
  function courseOf(family) {
    var f = familyDef(family);
    return (f && COURSES[f.course]) ? COURSES[f.course] : COURSES.BIO;
  }
  function targetWords(night, family) {
    var s = courseOf(family).stamina || STAMINA;
    night = Math.max(1, parseInt(night, 10) || 1);
    return Math.min(s.max, s.start + s.step * Math.floor((night - 1) / s.every));
  }
  function packLevel(p) {
    if (p.level === 1 || p.level === 2 || p.level === 3) return p.level;
    var g = readingGrade(p.passage || "");
    return g < 8 ? 1 : g < 10.5 ? 2 : 3;
  }

  function familyDef(id) {
    for (var i = 0; i < FAMILIES.length; i++) if (FAMILIES[i].id === id) return FAMILIES[i];
    return null;
  }

  function buildPack(family, strand) {
    family = family || "ALL";
    strand = String(strand == null ? "ALL" : strand).toUpperCase();
    if (!strand || strand === "NULL") strand = "ALL";
    var pool = FAMILY_POOL[family] || FAMILY_POOL.ALL;
    var src = PACKS.filter(function (p) {
      return pool.indexOf(p.family) !== -1;
    });
    if (!src.length) src = PACKS.slice();
    var slips = [];
    var claims = [];
    src.forEach(function (p) {
      var lvl = packLevel(p);
      p.claims.forEach(function (c) {
        /* A Part B item is only ever asked right after its Part A, so the strand
           filter follows the Part A and Part B is never drawn on its own. */
        var isPartB = p.claims.some(function (o) { return o.partB === c.id; });
        if (!isPartB && !strandMatch(c, strand)) return;
        var choices = (c.choices || []).map(function (ch, i) {
          return {
            letter: ch.letter,
            text: ch.text,
            slipIndex: i
          };
        });
        claims.push({
          id: p.id + ":" + c.id,
          packId: p.id,
          sol: c.sol,
          strand: strandOf(c),
          standard: standardOf(c),
          level: lvl,
          words: passageWords(p),
          partB: c.partB ? p.id + ":" + c.partB : null,
          isPartB: isPartB,
          stem: c.stem,
          doThis: c.stem,
          claim: c.stem,
          choices: choices,
          correct: c.correct,
          passage: p.passage,
          packTitle: p.title,
          family: p.family
        });
      });
    });
    /* If the strand filter emptied the pool (sparse strand in a unit), fall back to unit-all. */
    if (!claims.length && strand !== "ALL") {
      return buildPack(family, "ALL");
    }
    var card = familyDef(family);
    var title = card ? card.label : family;
    if (strand && strand !== "ALL") title = title + " · " + strand;
    return {
      family: family,
      strand: strand,
      title: title,
      slips: slips,
      claims: claims
    };
  }

  global.HEIST_PACKS = PACKS;
  global.HEIST_COURSES = COURSES;
  global.HEIST_FAMILIES = FAMILIES;
  global.HEIST_FAMILY_POOL = FAMILY_POOL;
  global.HEIST_STANDARDS = STANDARDS;
  global.HEIST_SKILLS = SKILLS;
  global.heistWordCount = wordCount;
  global.heistBuildPack = buildPack;
  global.heistCorrectList = correctList;
  global.heistStrandOf = strandOf;
  global.heistStandardOf = standardOf;
  global.heistStrandMatch = strandMatch;
  global.heistFamilyDef = familyDef;
  global.heistCourseOf = courseOf;
  global.heistCodeStandard = codeStandard;
  global.heistPackLevel = packLevel;
  global.heistTargetWords = targetWords;
  global.heistStamina = STAMINA;
  global.heistIsMulti = isMulti;
})(typeof window !== "undefined" ? window : global);
