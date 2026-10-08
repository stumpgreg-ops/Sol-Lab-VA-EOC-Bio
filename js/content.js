/* SOL Lab — question-pack machinery for the Virginia EOC Biology SOL build.
   The packs themselves live in js/content2.js onward (one file per unit) and push into
   HEIST_PACKS. This file defines the units (families), the standards map that drives the
   skill screen, the strand filter, the adaptive level estimate and the stamina schedule. */
(function (global) {
  var PACKS = [];

  /* Units. `id` is the pack family; the title screen shows one card per unit plus Full review.
     `stds` lists the standard prefixes a pack in that unit may use (checked by the validator). */
  var FAMILIES = [
    { id: "ALL", label: "Full review", short: "Full review", kind: "All units", meta: "Every unit mixed, leaning toward the standards you miss most. Best in the last weeks before the test.", stds: ["BIO.1", "BIO.2", "BIO.3", "BIO.4", "BIO.5", "BIO.6", "BIO.7", "BIO.8"] },
    { id: "INV", label: "Scientific Investigation", short: "Investigation", kind: "BIO.1", meta: "Variables, controls, data tables, graphs, conclusions and models. The practices every other unit is tested through.", stds: ["BIO.1"] },
    { id: "CHEM", label: "Biochemistry", short: "Biochemistry", kind: "BIO.2", meta: "Water, macromolecules, enzymes, photosynthesis and cellular respiration.", stds: ["BIO.2"] },
    { id: "CELL", label: "Cell Structure & Function", short: "Cells", kind: "BIO.3", meta: "Cell theory, organelles, levels of organization, the membrane and transport, specialization.", stds: ["BIO.3"] },
    { id: "MICRO", label: "Bacteria & Viruses", short: "Bacteria & Viruses", kind: "BIO.4", meta: "Virus and bacterium structure, replication, roles in ecosystems and the germ theory of disease.", stds: ["BIO.4"] },
    { id: "GEN", label: "Genetics & Heredity", short: "Genetics", kind: "BIO.5", meta: "Meiosis, Mendel, Punnett squares, pedigrees, mutations, variation and biotechnology.", stds: ["BIO.5"] },
    { id: "DNA", label: "DNA & Protein Synthesis", short: "DNA & Proteins", kind: "BIO.2 · BIO.5", meta: "DNA structure and replication, transcription, translation and the history of the DNA model.", stds: ["BIO.2.d", "BIO.5.a", "BIO.5.b"] },
    { id: "EVO", label: "Evolution & Classification", short: "Evolution", kind: "BIO.6 · BIO.7", meta: "Cladograms, domains and kingdoms, fossils, natural selection, adaptation and speciation.", stds: ["BIO.6", "BIO.7"] },
    { id: "ECO", label: "Ecology", short: "Ecology", kind: "BIO.8", meta: "Populations, food webs, energy flow, nutrient cycles, succession, human impact and Virginia ecosystems.", stds: ["BIO.8"] }
  ];
  /* Which pack families feed each selection. */
  var FAMILY_POOL = {};
  FAMILIES.forEach(function (f) { FAMILY_POOL[f.id] = f.id === "ALL" ? FAMILIES.filter(function (x) { return x.id !== "ALL"; }).map(function (x) { return x.id; }) : [f.id]; });

  /* Standards map (2018 Virginia Biology Standards of Learning, BIO.1–BIO.8 with their key
     ideas). The skill screen shows these as cards; `strand` is the prefix a claim's `sol`
     code must start with. Unit cards list only the key ideas that unit teaches. */
  var STANDARDS = {
    "BIO.1": { name: "Scientific investigation", keys: {
      a: "asking questions and defining problems",
      b: "planning and carrying out investigations",
      c: "interpreting, analyzing, and evaluating data",
      d: "constructing and critiquing conclusions and explanations",
      e: "developing and using models",
      f: "obtaining, evaluating, and communicating information" } },
    "BIO.2": { name: "Chemical and biochemical processes", keys: {
      a: "water chemistry and its impact on life processes",
      b: "the structure and function of macromolecules",
      c: "the nature of enzymes",
      d: "protein synthesis: DNA as the code for proteins",
      e: "the capture, storage, transformation, and flow of energy through photosynthesis and respiration" } },
    "BIO.3": { name: "Cell structure and function", keys: {
      a: "the cell theory is supported by evidence",
      b: "structures in unicellular and multicellular organisms work interdependently to carry out life processes",
      c: "the structure and function of the cell membrane support cell transport",
      d: "specialization leads to the development of different types of cells" } },
    "BIO.4": { name: "Bacteria and viruses", keys: {
      a: "viruses depend on a host for metabolic processes",
      b: "the modes of reproduction and replication can be compared",
      c: "the structures and functions can be compared",
      d: "bacteria and viruses have a role in other organisms and the environment",
      e: "the germ theory of infectious disease is supported by evidence" } },
    "BIO.5": { name: "Mechanisms of inheritance", keys: {
      a: "DNA has structure and is the foundation for protein synthesis",
      b: "the structural model of DNA has developed over time",
      c: "cell division and gamete formation pass genes to the next generation",
      d: "the variety of traits in an organism are the result of the expression of various combinations of alleles",
      e: "mutations and genetic variation",
      f: "synthetic biology has biological and ethical implications" } },
    "BIO.6": { name: "Modern classification", keys: {
      a: "structural similarities among organisms",
      b: "fossil record interpretation",
      c: "comparison of developmental stages",
      d: "biochemical similarities and differences",
      e: "classification systems are adaptable to new scientific discoveries" } },
    "BIO.7": { name: "Populations change through time", keys: {
      a: "evidence found in fossil records",
      b: "how variation of traits, reproductive strategies, and environmental pressures affect survival",
      c: "how natural selection leads to adaptations",
      d: "the emergence of new species",
      e: "scientific evidence and explanations for biological evolution" } },
    "BIO.8": { name: "Dynamic equilibria in ecosystems", keys: {
      a: "interactions within and among populations: carrying capacity, limiting factors, and growth curves",
      b: "nutrient cycling with energy flow through ecosystems",
      c: "succession patterns in ecosystems",
      d: "natural events and human activities influence local and global ecosystems and the flora and fauna of Virginia" } }
  };

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
    ]
  };
  SKILLS.ALL = Object.keys(STANDARDS).map(function (k) {
    return { strand: k, kind: k, name: STANDARDS[k].name, meta: Object.keys(STANDARDS[k].keys).map(function (L) { return L + ") " + STANDARDS[k].keys[L]; }).join("; ") + "." };
  });
  Object.keys(SKILLS).forEach(function (fam) {
    SKILLS[fam].push({ strand: "ALL", kind: "All skills", name: "All", meta: fam === "ALL" ? "Every standard mixed, leaning toward the ones you miss most." : "Everything in this unit mixed, leaning toward the skills you miss most." });
  });
  /* Some skill cards cover two key ideas (BIO.7 a·e, BIO.7 b·c): extra prefixes the card also keeps. */
  var STRAND_ALIASES = { "BIO.7.A": ["BIO.7.E"], "BIO.7.B": ["BIO.7.C"] };

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

  /* A claim's strand is its full standard code, upper-cased: "BIO.8.a" -> "BIO.8.A". */
  function strandOf(claim) {
    if (claim && claim.strand) return String(claim.strand).toUpperCase();
    var sol = String((claim && claim.sol) || "").toUpperCase().replace(/\s+/g, "");
    return /^BIO\.\d/.test(sol) ? sol : "BIO.1";
  }
  function standardOf(claim) {
    var m = /^(BIO\.\d)/.exec(strandOf(claim));
    return m ? m[1] : "BIO.1";
  }
  function prefixMatch(code, prefix) {
    return code === prefix || code.indexOf(prefix + ".") === 0;
  }
  function strandMatch(claim, strand) {
    strand = String(strand || "ALL").toUpperCase();
    if (!strand || strand === "ALL" || strand === "NULL") return true;
    if (!/^BIO\.\d/.test(strand)) return true;
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
     Level 1 targets ~65 words; every 3 levels the target grows by 5 words, reaching ~225
     words by level 99. Tune in STAMINA. */
  var STAMINA = { start: 65, step: 5, every: 3, max: 240 };
  function targetWords(night) {
    night = Math.max(1, parseInt(night, 10) || 1);
    return Math.min(STAMINA.max, STAMINA.start + STAMINA.step * Math.floor((night - 1) / STAMINA.every));
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
  global.heistPackLevel = packLevel;
  global.heistTargetWords = targetWords;
  global.heistStamina = STAMINA;
  global.heistIsMulti = isMulti;
})(typeof window !== "undefined" ? window : global);
