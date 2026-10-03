/* SOL Lab — question-pack machinery for the Virginia Algebra I SOL build.
   The packs themselves live in js/content2.js onward (one file per unit) and push into
   HEIST_PACKS. This file defines the units (families), the standards map that drives the
   skill screen, the strand filter, the adaptive level estimate and the stamina schedule. */
(function (global) {
  var PACKS = [];

  /* Units. `id` is the pack family; the title screen shows one card per unit plus Full review.
     The four units are the four strands of the 2023 Virginia Algebra I Standards of Learning.
     `stds` lists the standard prefixes a pack in that unit may use (checked by the validator). */
  var FAMILIES = [
    { id: "ALL", label: "Full review", short: "Full review", kind: "All strands", meta: "Every Algebra I strand mixed, leaning toward the standards you miss most. Best in the last weeks before the test.", stds: ["A.EO", "A.EI", "A.F", "A.ST"] },
    { id: "EO", label: "Expressions & Operations", short: "Expressions", kind: "A.EO", meta: "Writing and evaluating expressions, polynomials and factoring, laws of exponents, radicals.", stds: ["A.EO"] },
    { id: "EI", label: "Equations & Inequalities", short: "Equations", kind: "A.EI", meta: "Multistep equations and inequalities, literal equations, systems, and quadratic equations.", stds: ["A.EI"] },
    { id: "FN", label: "Functions", short: "Functions", kind: "A.F", meta: "Linear functions and their graphs, slope and intercepts, quadratic and exponential functions.", stds: ["A.F"] },
    { id: "ST", label: "Statistics", short: "Statistics", kind: "A.ST", meta: "The data cycle, scatterplots, lines and curves of best fit, predictions and their limits.", stds: ["A.ST"] }
  ];
  /* Which pack families feed each selection. */
  var FAMILY_POOL = {};
  FAMILIES.forEach(function (f) { FAMILY_POOL[f.id] = f.id === "ALL" ? FAMILIES.filter(function (x) { return x.id !== "ALL"; }).map(function (x) { return x.id; }) : [f.id]; });

  /* Standards map: the 2023 Virginia Mathematics Standards of Learning for Algebra I,
     A.EO.1–A.ST.1 with their lettered knowledge-and-skills statements,
     checked against the published 2023 standards on 2026-10-02. The skill screen shows
     these as cards; `strand` is the prefix a claim's `sol` code must start with. */
  var STANDARDS = {
    "A.EO.1": { course: "MATH", name: "Expressions: represent and evaluate", blurb: "Translate words to expressions and back; evaluate expressions with fractions, decimals, absolute value and roots.", keys: {
      a: "translate between verbal quantitative situations and algebraic expressions, including contextual situations",
      b: "evaluate algebraic expressions which include absolute value, square roots, and cube roots for given replacement values to include rational numbers, without rationalizing the denominator" } },
    "A.EO.2": { course: "MATH", name: "Polynomials: operations and factoring", blurb: "Add, subtract, multiply and divide polynomials; factor completely; show that two forms of a quadratic are equal.", keys: {
      a: "determine sums and differences of polynomial expressions in one variable, using a variety of strategies, including concrete objects and their related pictorial and symbolic models",
      b: "determine the product of polynomial expressions in one variable, using a variety of strategies, including the distributive property and area models; factors limited to five or fewer terms",
      c: "factor completely first- and second-degree polynomials in one variable with integral coefficients; after factoring out the GCF, leading coefficients have no more than four factors",
      d: "determine the quotient of polynomials, using a monomial or binomial divisor, or a completely factored divisor",
      e: "represent and demonstrate equality of quadratic expressions in different forms (concrete, verbal, symbolic, and graphical)" } },
    "A.EO.3": { course: "MATH", name: "Laws of exponents", blurb: "Laws of exponents: products, quotients and powers; simplify monomial expressions with integer exponents.", keys: {
      a: "derive the laws of exponents through explorations of patterns, to include products, quotients, and powers of bases",
      b: "simplify multivariable expressions and ratios of monomial expressions in which the exponents are integers, using the laws of exponents" } },
    "A.EO.4": { course: "MATH", name: "Radical expressions", blurb: "Simplest radical form for square and cube roots; add, subtract and multiply radicals; exponents ½ and ⅓.", keys: {
      a: "simplify and determine equivalent radical expressions involving the square root of a whole number in simplest form",
      b: "simplify and determine equivalent radical expressions involving the cube root of an integer",
      c: "add, subtract, and multiply radicals, limited to numeric square and cube root expressions",
      d: "generate equivalent numerical expressions and justify their equivalency for radicals using rational exponents, limited to rational exponents of 1/2 and 1/3" } },
    "A.EI.1": { course: "MATH", name: "Linear equations and inequalities in one variable", blurb: "Write and solve multistep equations and inequalities in one variable; number-line graphs; rearrange formulas; how many solutions.", keys: {
      a: "write a linear equation or inequality in one variable to represent a contextual situation",
      b: "solve multistep linear equations in one variable, including those in contextual situations, by applying the properties of real numbers and/or properties of equality",
      c: "solve multistep linear inequalities in one variable algebraically and graph the solution set on a number line, including those in contextual situations, by applying the properties of real numbers and/or properties of inequality",
      d: "rearrange a formula or literal equation to solve for a specified variable by applying the properties of equality",
      e: "determine if a linear equation in one variable has one solution, no solution, or an infinite number of solutions",
      f: "verify possible solution(s) to multistep linear equations and inequalities in one variable algebraically, graphically, and with technology to justify the reasonableness of the answer(s); explain the solution method and interpret solutions in context" } },
    "A.EI.2": { course: "MATH", name: "Systems of linear equations and inequalities", blurb: "Systems of two linear equations; linear inequalities and systems of inequalities in two variables, their graphs and their solutions.", keys: {
      a: "create a system of two linear equations in two variables to represent a contextual situation",
      b: "apply the properties of real numbers and/or properties of equality to solve a system of two linear equations in two variables, algebraically and graphically",
      c: "determine whether a system of two linear equations has one solution, no solution, or an infinite number of solutions",
      d: "create a linear inequality in two variables to represent a contextual situation",
      e: "represent the solution of a linear inequality in two variables graphically on a coordinate plane",
      f: "create a system of two linear inequalities in two variables to represent a contextual situation",
      g: "represent the solution set of a system of two linear inequalities in two variables graphically on a coordinate plane",
      h: "verify possible solution(s) to a system of two linear equations, a linear inequality in two variables, or a system of two linear inequalities algebraically, graphically, and with technology to justify the reasonableness of the answer(s); explain the solution method and interpret solutions in context" } },
    "A.EI.3": { course: "MATH", name: "Quadratic equations in one variable", blurb: "Solve quadratic equations with rational or irrational solutions; how many real solutions; what the solutions mean.", keys: {
      a: "solve a quadratic equation in one variable over the set of real numbers with rational or irrational solutions, including those that can be used to solve contextual problems",
      b: "determine and justify if a quadratic equation in one variable has no real solutions, one real solution, or two real solutions",
      c: "verify possible solution(s) to a quadratic equation in one variable algebraically, graphically, and with technology to justify the reasonableness of answer(s); explain the solution method and interpret solutions for problems given in context" } },
    "A.F.1": { course: "MATH", name: "Linear functions", blurb: "Slope, intercepts, zeros, domain and range of a line; forms of a line; writing equations; parallel and perpendicular; f(x); comparing.", keys: {
      a: "determine and identify the domain, range, zeros, slope, and intercepts of a linear function, presented algebraically or graphically, including the interpretation of these characteristics in contextual situations",
      b: "investigate and explain how transformations to the parent function y = x affect the rate of change (slope) and the y-intercept of a linear function",
      c: "write equivalent algebraic forms of linear functions, including slope-intercept form, standard form, and point-slope form, and analyze and interpret the information revealed by each form",
      d: "write the equation of a linear function to model a linear relationship between two quantities, including contextual situations: given the graph of a line, two points with integer coordinates, or the slope and a point; vertical lines as x = a and horizontal lines as y = c",
      e: "write the equation of a line parallel or perpendicular to a given line through a given point",
      f: "graph a linear function in two variables, with and without the use of technology, including those that can represent contextual situations",
      g: "for any value x in the domain of f, determine f(x), and determine x given any value f(x) in the range of f, given an algebraic or graphical representation of a linear function",
      h: "compare and contrast the characteristics of linear functions represented algebraically, graphically, in tables, and in contextual situations" } },
    "A.F.2": { course: "MATH", name: "Quadratic and exponential functions", blurb: "Is it a function? Key features, graphs and forms of quadratic and exponential functions; f(x); comparing linear, quadratic and exponential.", keys: {
      a: "determine whether a relation, represented by a set of ordered pairs, a table, a mapping, or a graph is a function",
      b: "given an equation or graph, determine key characteristics of a quadratic function including x-intercepts (zeros), y-intercept, vertex (maximum or minimum), and domain and range (including when restricted by context); interpret key characteristics in contextual situations",
      c: "graph a quadratic function f(x) in two variables using a variety of strategies, including transformations f(x) + k and kf(x), where k is limited to rational values",
      d: "make connections between the algebraic (standard and factored forms) and graphical representation of a quadratic function",
      e: "given an equation or graph of an exponential function in the form y = ab^x (where b is limited to a natural number), interpret key characteristics, including y-intercepts and domain and range; interpret key characteristics in contextual situations",
      f: "graph an exponential function f(x) in two variables using a variety of strategies, including transformations f(x) + k and kf(x), where k is limited to rational values",
      g: "for any value x in the domain of f, determine f(x) of a quadratic or exponential function; determine x given any value f(x) in the range of f of a quadratic function; explain the meaning of x and f(x) in context",
      h: "compare and contrast the key characteristics of linear functions (f(x) = x), quadratic functions (f(x) = x²), and exponential functions (f(x) = bˣ) using tables and graphs" } },
    "A.ST.1": { course: "MATH", name: "The data cycle with bivariate data", blurb: "The data cycle with two variables: questions, variables, samples, scatterplots, lines and curves of best fit, predictions and conclusions.", keys: {
      a: "formulate investigative questions that require the collection or acquisition of bivariate data",
      b: "determine what variables could be used to explain a given contextual problem or situation or answer investigative questions",
      c: "determine an appropriate method to collect a representative sample (survey, observation, or experiment) to answer an investigative question",
      d: "given a table of ordered pairs or a scatterplot representing no more than 30 data points, use available technology to determine whether a linear or quadratic function would represent the relationship, and if so, determine the equation of the curve of best fit",
      e: "use linear and quadratic regression methods available through technology to write a linear or quadratic function that represents the data where appropriate and describe the strengths and weaknesses of the model",
      f: "use a linear model to predict outcomes and evaluate the strength and validity of these predictions, including through the use of technology",
      g: "investigate and explain the meaning of the rate of change (slope) and y-intercept (constant term) of a linear model in context",
      h: "analyze relationships between two quantitative variables revealed in a scatterplot",
      i: "make conclusions based on the analysis of a set of bivariate data and communicate the results" } }
  };
  /* Longest code prefixes first so "A.EO.1" is matched before any shorter prefix. */
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
      { strand: "A.ST.1.A", kind: "A.ST.1 a–c, h", name: "Data cycle & scatterplots", meta: "Investigative questions, choosing variables, representative samples, reading the relationship in a scatterplot." },
      { strand: "A.ST.1.D", kind: "A.ST.1 d–g, i", name: "Best fit & predictions", meta: "Lines and curves of best fit, slope and intercept in context, predictions and their limits, conclusions and correlation vs causation." }
    ]
  };
  /* Full review shows the ten standards themselves as skill cards (one-line blurbs: the full lettered
     statements are in `keys` for the validator, the question bank and the content guide). */
  SKILLS.ALL = Object.keys(STANDARDS).map(function (k) {
    return { strand: k, kind: k, name: STANDARDS[k].name, meta: STANDARDS[k].blurb };
  });
  Object.keys(SKILLS).forEach(function (fam) {
    SKILLS[fam].push({ strand: "ALL", kind: "All skills", name: "All", meta: fam === "ALL" ? "Every standard mixed, leaning toward the ones you miss most." : "Everything in this unit mixed, leaning toward the skills you miss most." });
  });
  /* The two Statistics cards each cover several key ideas: extra prefixes the card also keeps. */
  var STRAND_ALIASES = { "A.ST.1.A": ["A.ST.1.B", "A.ST.1.C", "A.ST.1.H"], "A.ST.1.D": ["A.ST.1.E", "A.ST.1.F", "A.ST.1.G", "A.ST.1.I"] };

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

  /* A claim's strand is its full standard code, upper-cased: "A.EO.1.b" -> "A.EO.1.B". */
  function strandOf(claim) {
    if (claim && claim.strand) return String(claim.strand).toUpperCase();
    var sol = String((claim && claim.sol) || "").toUpperCase().replace(/\s+/g, "");
    return isCode(sol) ? sol : "A.EO.1";
  }
  function standardOf(claim) {
    return codeStandard(strandOf(claim)) || "A.EO.1";
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
     include table cells and listed equations. Algebra I problem sets are short: level 1 targets
     ~45 words; every 3 levels the target grows by 4 words, reaching ~170 by level 99. Tune in
     STAMINA. */
  var STAMINA = { start: 45, step: 4, every: 3, max: 170 };
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
  global.heistCodeStandard = codeStandard;
  global.heistPackLevel = packLevel;
  global.heistTargetWords = targetWords;
  global.heistStamina = STAMINA;
  global.heistIsMulti = isMulti;
})(typeof window !== "undefined" ? window : global);
