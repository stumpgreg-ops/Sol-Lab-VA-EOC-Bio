/* SOL Lab — Genetics & Heredity (BIO.5.c–f). Original text only. */
(function (global) {
  var P = global.HEIST_PACKS;
  if (!P || !P.push) return;
  var N = function (i) { return '<span class="n">(' + i + ')</span> '; };   // numbered sentence

  var PACKS = [
    /* ---------- tiny · level 1 · cell cycle ---------- */
    {
      id: "gen-root-tip",
      family: "GEN",
      title: "Counting Root Tip Cells",
      kind: "Genetics · BIO.5",
      blurb: "Sort 200 onion root cells by stage and decide what the counts mean.",
      level: 1,
      passage: "<p>" + N(1) + "A student looked at a stained onion root tip under a microscope and sorted 200 cells by the stage of the <strong>cell cycle</strong> each one was in. " + N(2) + "Onion body cells are diploid, with 16 chromosomes. " + N(3) + "The results are in the table. " + N(4) + "The student concluded that root tip cells spend most of their time growing, not dividing.</p>" +
        "<table><tr><th>Stage</th><th>Cells counted</th></tr><tr><td>Interphase</td><td>168</td></tr><tr><td>Prophase</td><td>14</td></tr><tr><td>Metaphase</td><td>6</td></tr><tr><td>Anaphase</td><td>5</td></tr><tr><td>Telophase</td><td>7</td></tr></table>",
      claims: [
        {
          id: "conclusion",
          sol: "BIO.5.c",
          stem: "Which conclusion about the root tip cells is best supported by the counts in the table?",
          choices: [
            { letter: "A", text: "Most root tip cells were in interphase when the slide was made" },
            { letter: "B", text: "Root tips contain more dividing cells than non-dividing cells" },
            { letter: "C", text: "Anaphase lasts longer than prophase in root tip cells" },
            { letter: "D", text: "Root tip cells copy their chromosomes during telophase" }
          ],
          correct: "A"
        },
        {
          id: "vocab",
          sol: "BIO.5.c",
          stem: "In sentence 1, the cell cycle is best described as —",
          choices: [
            { letter: "A", text: "the process that splits one diploid cell into four haploid gametes" },
            { letter: "B", text: "the series of stages a cell passes through as it grows, copies its DNA and divides" },
            { letter: "C", text: "the exchange of segments between two homologous chromosomes" },
            { letter: "D", text: "the movement of a cell toward a chemical signal in its surroundings" }
          ],
          correct: "B"
        },
        {
          id: "count",
          sol: "BIO.5.c",
          stem: "How many chromosomes should each new cell have after a root tip cell finishes mitosis?",
          choices: [
            { letter: "A", text: "4 chromosomes" },
            { letter: "B", text: "8 chromosomes" },
            { letter: "C", text: "16 chromosomes" },
            { letter: "D", text: "32 chromosomes" }
          ],
          correct: "C"
        },
        {
          id: "stage",
          sol: "BIO.5.c",
          stem: "In which stage did the student see the chromosomes lined up across the middle of the cell?",
          choices: [
            { letter: "A", text: "Interphase" },
            { letter: "B", text: "Prophase" },
            { letter: "C", text: "Anaphase" },
            { letter: "D", text: "Metaphase" }
          ],
          correct: "D"
        },
        {
          id: "variable",
          sol: "BIO.5.c",
          stem: "The student next wants to compare the fraction of dividing cells in a root tip with the fraction in a mature leaf. The independent variable would be —",
          choices: [
            { letter: "A", text: "the total number of cells counted" },
            { letter: "B", text: "the type of tissue placed on the slide" },
            { letter: "C", text: "the stain used to color the chromosomes" },
            { letter: "D", text: "the number of chromosomes in each cell" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- tiny · level 1 · monohybrid cross and test cross ---------- */
    {
      id: "gen-pea-cross",
      family: "GEN",
      title: "Tall and Short Pea Plants",
      kind: "Genetics · BIO.5",
      blurb: "A monohybrid cross, an offspring count and a test cross to settle a genotype.",
      level: 1,
      passage: "<p>" + N(1) + "In pea plants the allele for tall stems (T) is <strong>dominant</strong> to the allele for short stems (t). " + N(2) + "A gardener crossed two tall plants that were both heterozygous (Tt) and counted the offspring. " + N(3) + "The table shows the results. " + N(4) + "The gardener then wanted to find out whether one of the tall offspring was TT or Tt.</p>" +
        "<table><tr><th>Phenotype</th><th>Number of plants</th></tr><tr><td>Tall</td><td>61</td></tr><tr><td>Short</td><td>19</td></tr></table>",
      claims: [
        {
          id: "ratio",
          sol: "BIO.5.d",
          stem: "Which ratio of tall to short plants is closest to the results in the table?",
          choices: [
            { letter: "A", text: "3 tall : 1 short" },
            { letter: "B", text: "1 tall : 1 short" },
            { letter: "C", text: "1 tall : 2 short" },
            { letter: "D", text: "9 tall : 3 short" }
          ],
          correct: "A"
        },
        {
          id: "percent",
          sol: "BIO.5.d",
          stem: "What percentage of the offspring of a Tt × Tt cross are expected to be homozygous recessive?",
          choices: [
            { letter: "A", text: "0%" },
            { letter: "B", text: "25%" },
            { letter: "C", text: "50%" },
            { letter: "D", text: "75%" }
          ],
          correct: "B"
        },
        {
          id: "vocab",
          sol: "BIO.5.d",
          stem: "In sentence 1, calling the tall allele dominant means that —",
          choices: [
            { letter: "A", text: "tall plants are more common than short plants in every population" },
            { letter: "B", text: "a plant must have two T alleles to grow tall" },
            { letter: "C", text: "the T allele changes any t allele next to it into a T allele" },
            { letter: "D", text: "the tall trait appears whenever at least one T allele is present" }
          ],
          correct: "D"
        },
        {
          id: "testcross",
          sol: "BIO.5.d",
          stem: "To find out whether the tall plant in sentence 4 is TT or Tt, the gardener should cross it with a —",
          choices: [
            { letter: "A", text: "tall plant known to be TT" },
            { letter: "B", text: "second tall plant of unknown genotype" },
            { letter: "C", text: "short plant, which must be tt" },
            { letter: "D", text: "plant grown from the same seed pod" }
          ],
          correct: "C"
        },
        {
          id: "result",
          sol: "BIO.5.d",
          stem: "If the cross in sentence 4 produced some short offspring, the tall parent's genotype must be —",
          choices: [
            { letter: "A", text: "TT, because tall is the dominant trait" },
            { letter: "B", text: "Tt, because a short offspring needs a t allele from each parent" },
            { letter: "C", text: "tt, because it produced short offspring" },
            { letter: "D", text: "TT, because short offspring appear in every cross" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- tiny · level 1 · incomplete dominance ---------- */
    {
      id: "gen-snapdragon",
      family: "GEN",
      title: "Pink Snapdragons",
      kind: "Genetics · BIO.5",
      blurb: "Red × white gives pink: work out the ratios when neither allele wins.",
      level: 1,
      passage: "<p>" + N(1) + "A florist crossed a red-flowered snapdragon with a white-flowered snapdragon, and every offspring had pink flowers. " + N(2) + "In snapdragons, flower color shows <strong>incomplete dominance</strong>: the heterozygote has a phenotype between those of the two parents. " + N(3) + "She writes red plants as RR, white plants as WW and pink plants as RW. " + N(4) + "Next she crossed two of the pink plants with each other and grew 120 seedlings.</p>",
      claims: [
        {
          id: "white",
          sol: "BIO.5.d",
          stem: "How many of the 120 seedlings from the pink × pink cross are expected to have white flowers?",
          choices: [
            { letter: "A", text: "30 of 120" },
            { letter: "B", text: "0 of 120" },
            { letter: "C", text: "60 of 120" },
            { letter: "D", text: "90 of 120" }
          ],
          correct: "A"
        },
        {
          id: "vocab",
          sol: "BIO.5.d",
          stem: "In sentence 2, incomplete dominance means that —",
          choices: [
            { letter: "A", text: "one allele completely hides the other allele in the heterozygote" },
            { letter: "B", text: "both parent phenotypes appear side by side in the heterozygote" },
            { letter: "C", text: "the heterozygote shows a phenotype between the two homozygous phenotypes" },
            { letter: "D", text: "the trait is controlled by a gene carried on the X chromosome" }
          ],
          correct: "C"
        },
        {
          id: "ratio",
          sol: "BIO.5.d",
          stem: "The expected phenotype ratio among the offspring of the pink × pink cross is —",
          choices: [
            { letter: "A", text: "3 pink : 1 white" },
            { letter: "B", text: "1 red : 2 pink : 1 white" },
            { letter: "C", text: "4 pink : 0 white" },
            { letter: "D", text: "1 red : 1 white" }
          ],
          correct: "B"
        },
        {
          id: "explain",
          sol: "BIO.5.d",
          stem: "Which statement best explains why none of the offspring in sentence 1 were red or white?",
          choices: [
            { letter: "A", text: "Each offspring got one R and one W allele, and neither allele is fully dominant" },
            { letter: "B", text: "The red allele is recessive, so red could not appear in the first generation" },
            { letter: "C", text: "The offspring inherited a new pink allele that formed when the gametes fused" },
            { letter: "D", text: "Crossing over during meiosis removed the red and white alleles from the gametes" }
          ],
          correct: "A"
        },
        {
          id: "breed",
          sol: "BIO.5.d",
          stem: "A gardener who wants seedlings that are all red should cross —",
          choices: [
            { letter: "A", text: "a pink plant with a pink plant" },
            { letter: "B", text: "a red plant with a pink plant" },
            { letter: "C", text: "a red plant with a white plant" },
            { letter: "D", text: "a red plant with a red plant" }
          ],
          correct: "D"
        }
      ]
    },

    /* ---------- short · level 2 · meiosis model ---------- */
    {
      id: "gen-meiosis-model",
      family: "GEN",
      title: "Modeling Meiosis",
      kind: "Genetics · BIO.5",
      blurb: "Pipe-cleaner chromosomes, crossing over, independent assortment and one group's mistake.",
      level: 2,
      passage: "<p>" + N(1) + "A class used pipe cleaners to model meiosis in an imaginary animal whose body cells are <strong>diploid</strong>, with 8 chromosomes. " + N(2) + "Each homologous pair was one red and one blue pipe cleaner of the same length. " + N(3) + "In prophase I, students swapped a segment between a red and a blue homolog to show <strong>crossing over</strong>. " + N(4) + "At metaphase I, each pair lined up so that red or blue could face either pole. " + N(5) + "One group made an error: a pair failed to separate in anaphase I, so two of their gametes had 5 chromosomes and two had 3. " + N(6) + "The table lists the chromosome counts for a correct model.</p>" +
        "<table><tr><th>Cell</th><th>Chromosomes</th></tr><tr><td>Body cell before meiosis</td><td>8</td></tr><tr><td>Each cell after meiosis I</td><td>4</td></tr><tr><td>Each gamete</td><td>4</td></tr><tr><td>Zygote after fertilization</td><td>8</td></tr></table>",
      claims: [
        {
          id: "alleles",
          sol: "BIO.5.d",
          stem: "The animal is heterozygous (Bb) for a fur-color gene. Based on the table, which statement about its gametes is correct?",
          choices: [
            { letter: "A", text: "Every gamete carries both B and b on 8 chromosomes" },
            { letter: "B", text: "Half the gametes carry B and half carry b, each on 4 chromosomes" },
            { letter: "C", text: "All gametes carry B because it is the dominant allele" },
            { letter: "D", text: "Gametes carry 4 chromosomes but no fur-color alleles" }
          ],
          correct: "B"
        },
        {
          id: "vocab",
          sol: "BIO.5.c",
          stem: "In sentence 1, a diploid cell is one that —",
          choices: [
            { letter: "A", text: "has two complete sets of chromosomes, one from each parent" },
            { letter: "B", text: "has a single set of chromosomes and can act as a gamete" },
            { letter: "C", text: "has copied its DNA twice before it divides" },
            { letter: "D", text: "contains exactly two chromosomes in total" }
          ],
          correct: "A"
        },
        {
          id: "crossover",
          sol: "BIO.5.e",
          stem: "What is the main result of the step described in sentence 3?",
          choices: [
            { letter: "A", text: "The number of chromosomes in each gamete is cut in half" },
            { letter: "B", text: "Sister chromatids are pulled to opposite poles of the cell" },
            { letter: "C", text: "Homologous chromosomes end up with new combinations of alleles" },
            { letter: "D", text: "The cell copies its DNA a second time before dividing" }
          ],
          correct: "C"
        },
        {
          id: "assort",
          sol: "BIO.5.c",
          stem: "The arrangement described in sentence 4 models —",
          choices: [
            { letter: "A", text: "nondisjunction of one pair" },
            { letter: "B", text: "independent assortment" },
            { letter: "C", text: "fertilization of a gamete" },
            { letter: "D", text: "cytokinesis after anaphase" }
          ],
          correct: "B"
        },
        {
          id: "nondis",
          sol: "BIO.5.c",
          stem: "The error in sentence 5 is called nondisjunction. If a gamete with 5 chromosomes fused with a normal gamete, the zygote would have —",
          choices: [
            { letter: "A", text: "9 chromosomes, one more than the normal diploid number" },
            { letter: "B", text: "8 chromosomes, because fertilization always restores the diploid number" },
            { letter: "C", text: "10 chromosomes, because both gametes were abnormal" },
            { letter: "D", text: "5 chromosomes, because the abnormal gamete sets the count" }
          ],
          correct: "A"
        },
        {
          id: "mitosis",
          sol: "BIO.5.c",
          stem: "Which statement correctly contrasts this model with mitosis in the same animal?",
          choices: [
            { letter: "A", text: "Mitosis makes four cells with 4 chromosomes each; meiosis makes two cells with 8 each" },
            { letter: "B", text: "Mitosis includes crossing over between homologs; meiosis does not" },
            { letter: "C", text: "Mitosis produces the animal's gametes; meiosis produces its body cells" },
            { letter: "D", text: "Mitosis makes two identical cells with 8 chromosomes each; meiosis makes four cells with 4 each" }
          ],
          correct: "D"
        }
      ]
    },

    /* ---------- short · level 2 · point and frameshift mutations ---------- */
    {
      id: "gen-mutant-yeast",
      family: "GEN",
      title: "Reading a Mutated Gene",
      kind: "Genetics · BIO.5",
      blurb: "Three yeast strains, three mutations: which ones break the enzyme?",
      level: 2,
      passage: "<p>" + N(1) + "A lab compared a short stretch of a normal gene with the same stretch from three mutant strains of yeast. " + N(2) + "The DNA was transcribed into mRNA and the codons were translated. " + N(3) + "A <strong>point mutation</strong> changes a single base; a <strong>frameshift mutation</strong> adds or removes a base and shifts every codon that follows. " + N(4) + "The table shows the first four mRNA codons of each strain and the amino acids they code for. " + N(5) + "The normal protein is an enzyme that breaks down a sugar, and each strain was tested for whether it could still grow on that sugar.</p>" +
        "<table><tr><th>Strain</th><th>mRNA codons</th><th>Amino acids</th><th>Grows on sugar?</th></tr><tr><td>Normal</td><td>AUG GGU UUA CAA</td><td>Met-Gly-Leu-Gln</td><td>yes</td></tr><tr><td>Strain 1</td><td>AUG GGC UUA CAA</td><td>Met-Gly-Leu-Gln</td><td>yes</td></tr><tr><td>Strain 2</td><td>AUG GGU UAA CAA</td><td>Met-Gly-STOP</td><td>no</td></tr><tr><td>Strain 3</td><td>AUG UGG UUU ACA</td><td>Met-Trp-Phe-Thr</td><td>no</td></tr></table>",
      claims: [
        {
          id: "silent",
          sol: "BIO.5.e",
          stem: "Which strain has a point mutation that did not change the protein?",
          choices: [
            { letter: "A", text: "Strain 2" },
            { letter: "B", text: "Strain 1" },
            { letter: "C", text: "Strain 3" },
            { letter: "D", text: "None of the strains" }
          ],
          correct: "B"
        },
        {
          id: "stop",
          sol: "BIO.5.e",
          stem: "Which statement best explains why Strain 2 cannot grow on the sugar?",
          choices: [
            { letter: "A", text: "A base change created a stop codon, so the enzyme is cut short and cannot work" },
            { letter: "B", text: "An extra base shifted every codon after the first one" },
            { letter: "C", text: "The mutation changed the first codon, so translation never began" },
            { letter: "D", text: "The mutation was silent, so the enzyme was made but then broke down" }
          ],
          correct: "A"
        },
        {
          id: "vocab",
          sol: "BIO.5.e",
          stem: "In sentence 3, a frameshift mutation is a mutation that —",
          choices: [
            { letter: "A", text: "swaps one base for another without changing the reading frame" },
            { letter: "B", text: "moves a whole gene to a different chromosome" },
            { letter: "C", text: "adds or deletes a base so the codons after it are read differently" },
            { letter: "D", text: "changes one codon into a stop codon" }
          ],
          correct: "C"
        },
        {
          id: "frameshift",
          sol: "BIO.5.e",
          stem: "Which strain in the table shows a frameshift mutation, and what evidence supports that?",
          choices: [
            { letter: "A", text: "Strain 1, because one codon changed" },
            { letter: "B", text: "Strain 2, because translation stopped early" },
            { letter: "C", text: "Strain 3, because it has one fewer codon than normal" },
            { letter: "D", text: "Strain 3, because every amino acid after Met is different" }
          ],
          correct: "D"
        },
        {
          id: "phenotype",
          sol: "BIO.5.d",
          stem: "The \"Grows on sugar?\" column of the table records each strain's —",
          choices: [
            { letter: "A", text: "genotype" },
            { letter: "B", text: "phenotype" },
            { letter: "C", text: "allele" },
            { letter: "D", text: "codon" }
          ],
          correct: "B"
        },
        {
          id: "gamete",
          sol: "BIO.5.c",
          stem: "A stop-codon mutation like the one in Strain 2 appears in a sperm cell of a mouse. Which statement is correct?",
          choices: [
            { letter: "A", text: "The mutation cannot be inherited because it is not in a body cell" },
            { letter: "B", text: "The mutation will affect only the skin cells of that mouse" },
            { letter: "C", text: "Fertilization repairs mutations in gametes before the zygote forms" },
            { letter: "D", text: "An offspring formed from that sperm would carry the mutation in all its cells" }
          ],
          correct: "D"
        }
      ]
    },

    /* ---------- short · level 1 · somatic vs germ-line mutation ---------- */
    {
      id: "gen-mouse-mutation",
      family: "GEN",
      title: "Where a Mutation Happens",
      kind: "Genetics · BIO.5",
      blurb: "Two white-fur mice, two very different kinds of mutation.",
      level: 1,
      passage: "<p>" + N(1) + "A researcher keeps a colony of gray mice. " + N(2) + "One mouse develops a white patch of fur on its back after strong ultraviolet light hit its skin. " + N(3) + "The patch is a <strong>somatic mutation</strong>, a change in the DNA of one body cell. " + N(4) + "That mouse is bred with a gray mouse, and all 24 pups are gray. " + N(5) + "In a second colony, a pup is born all white and later passes the trait to half of its offspring. " + N(6) + "The researcher decides the second trait began as a <strong>germ-line mutation</strong> in a parent's egg or sperm. " + N(7) + "She notes that mutation is one source of variation; meiosis also shuffles existing alleles into new combinations.</p>",
      claims: [
        {
          id: "pups",
          sol: "BIO.5.e",
          stem: "Which statement best explains why all 24 pups in sentence 4 were gray?",
          choices: [
            { letter: "A", text: "The white allele is recessive and was hidden in the pups" },
            { letter: "B", text: "Ultraviolet light only changes the fur of adult mice" },
            { letter: "C", text: "The mutation was in skin cells, not in the cells that make gametes" },
            { letter: "D", text: "The pups inherited the mutation but it will appear when they are older" }
          ],
          correct: "C"
        },
        {
          id: "vocab",
          sol: "BIO.5.e",
          stem: "In sentence 3, a somatic mutation is best described as a change in the DNA of —",
          choices: [
            { letter: "A", text: "a body cell, which is not passed on to offspring" },
            { letter: "B", text: "a gamete, which is passed on to every offspring" },
            { letter: "C", text: "a virus that infected the mouse's skin" },
            { letter: "D", text: "a chromosome that is lost during meiosis" }
          ],
          correct: "A"
        },
        {
          id: "heritable",
          sol: "BIO.5.e",
          stem: "Which observation is the best evidence that the white fur in sentence 5 is heritable?",
          choices: [
            { letter: "A", text: "The pup was born white rather than turning white later" },
            { letter: "B", text: "The trait appeared in the pup's own offspring" },
            { letter: "C", text: "The pup's skin had never been exposed to ultraviolet light" },
            { letter: "D", text: "White fur is easy to see against gray littermates" }
          ],
          correct: "B"
        },
        {
          id: "genotype",
          sol: "BIO.5.d",
          stem: "The white mouse in sentence 5 passed the trait to half of its offspring when bred with gray mice. If white is dominant to gray, the white mouse's genotype was most likely —",
          choices: [
            { letter: "A", text: "homozygous dominant" },
            { letter: "B", text: "heterozygous" },
            { letter: "C", text: "homozygous recessive" },
            { letter: "D", text: "haploid" }
          ],
          correct: "B"
        },
        {
          id: "shuffle",
          sol: "BIO.5.c",
          stem: "In sentence 7, meiosis creates new combinations of existing alleles mainly through —",
          choices: [
            { letter: "A", text: "DNA replication and cytokinesis" },
            { letter: "B", text: "mutation and ultraviolet light" },
            { letter: "C", text: "binary fission and budding" },
            { letter: "D", text: "crossing over and independent assortment" }
          ],
          correct: "D"
        },
        {
          id: "chromosomal",
          sol: "BIO.5.e",
          stem: "Which change would be classified as a chromosomal mutation rather than a point mutation?",
          choices: [
            { letter: "A", text: "A whole section of one chromosome is duplicated" },
            { letter: "B", text: "A single base pair in a gene is swapped for another" },
            { letter: "C", text: "One base is added in the middle of a gene" },
            { letter: "D", text: "A gene is copied into mRNA with one wrong base" }
          ],
          correct: "A"
        }
      ]
    },

    /* ---------- medium · level 3 · dihybrid cross ---------- */
    {
      id: "gen-corn-dihybrid",
      family: "GEN",
      title: "Two Traits in Corn Kernels",
      kind: "Genetics · BIO.5",
      blurb: "Purple or yellow, smooth or wrinkled: 320 kernels against a 9:3:3:1 prediction.",
      level: 3,
      passage: "<p>" + N(1) + "An agriculture class studied two kernel traits in corn. " + N(2) + "Purple color (P) is dominant to yellow (p), and smooth texture (S) is dominant to wrinkled (s). " + N(3) + "The two genes are on different chromosomes. " + N(4) + "The class crossed two plants that were <strong>heterozygous</strong> for both traits (PpSs × PpSs) and counted the kernels on the resulting ears. " + N(5) + "Before counting, the students predicted a 9:3:3:1 phenotype ratio from a 16-box Punnett square. " + N(6) + "The table shows the counts from 320 kernels. " + N(7) + "One student argued that because purple, smooth kernels were the most common, that is what makes the P and S alleles dominant. " + N(8) + "The teacher pointed out that how common a phenotype is does not define dominance. " + N(9) + "The class hopes to develop a true-breeding purple, smooth line for a seed company. " + N(10) + "To start, they crossed one purple, smooth plant of unknown genotype with a yellow, wrinkled plant.</p>" +
        "<table><tr><th>Phenotype</th><th>Kernels counted</th></tr><tr><td>Purple, smooth</td><td>182</td></tr><tr><td>Purple, wrinkled</td><td>58</td></tr><tr><td>Yellow, smooth</td><td>61</td></tr><tr><td>Yellow, wrinkled</td><td>19</td></tr></table>",
      claims: [
        {
          id: "conclusion",
          sol: "BIO.5.d",
          stem: "Which conclusion is best supported by the counts in the table?",
          choices: [
            { letter: "A", text: "The results are close to the predicted 9:3:3:1 ratio" },
            { letter: "B", text: "The results show a 3:1 ratio because only one gene matters" },
            { letter: "C", text: "Purple and smooth are dominant because they are the most common" },
            { letter: "D", text: "The two genes must be located on the same chromosome" }
          ],
          correct: "A"
        },
        {
          id: "fraction",
          sol: "BIO.5.d",
          stem: "What fraction of the kernels from the PpSs × PpSs cross are expected to be homozygous recessive for both traits (ppss)?",
          choices: [
            { letter: "A", text: "9/16" },
            { letter: "B", text: "3/16" },
            { letter: "C", text: "1/4" },
            { letter: "D", text: "1/16" }
          ],
          correct: "D"
        },
        {
          id: "vocab",
          sol: "BIO.5.d",
          stem: "In sentence 4, a plant that is heterozygous for both traits —",
          choices: [
            { letter: "A", text: "has two identical alleles for each of the two genes" },
            { letter: "B", text: "shows the recessive phenotype for both traits" },
            { letter: "C", text: "carries one dominant and one recessive allele for each gene" },
            { letter: "D", text: "produces only one kind of gamete for the two genes" }
          ],
          correct: "C"
        },
        {
          id: "truebreed",
          sol: "BIO.5.f",
          stem: "To produce the true-breeding line in sentence 9, the class should —",
          choices: [
            { letter: "A", text: "plant purple, smooth kernels from PpSs × PpSs crosses every year" },
            { letter: "B", text: "breed together purple, smooth plants shown by test crosses to be PPSS" },
            { letter: "C", text: "cross purple, smooth plants with yellow, wrinkled plants every year" },
            { letter: "D", text: "grow only the yellow, wrinkled kernels, since those are homozygous" }
          ],
          correct: "B"
        },
        {
          id: "assort",
          sol: "BIO.5.c",
          stem: "Sentence 3 matters for the prediction in sentence 5 because genes on different chromosomes —",
          choices: [
            { letter: "A", text: "are always inherited together as one unit" },
            { letter: "B", text: "cannot be either dominant or recessive" },
            { letter: "C", text: "are sorted into gametes independently of each other" },
            { letter: "D", text: "are copied more often during interphase" }
          ],
          correct: "C"
        },
        {
          id: "testcross",
          sol: "BIO.5.d",
          stem: "The cross in sentence 10 produced 40 purple, smooth kernels and 40 purple, wrinkled kernels and no yellow kernels. Select TWO conclusions supported by this result.",
          choices: [
            { letter: "A", text: "The unknown plant is homozygous PP for color" },
            { letter: "B", text: "The unknown plant is heterozygous Ss for texture" },
            { letter: "C", text: "The unknown plant is heterozygous Pp for color" },
            { letter: "D", text: "The unknown plant is homozygous SS for texture" }
          ],
          correct: ["A", "B"]
        }
      ]
    },

    /* ---------- medium · level 2 · sex-linked pedigree ---------- */
    {
      id: "gen-colorblind-pedigree",
      family: "GEN",
      title: "A Pedigree for Color Blindness",
      kind: "Genetics · BIO.5",
      blurb: "Three generations, one X-linked allele, and a grandson who cannot tell red from green.",
      level: 2,
      passage: "<p>" + N(1) + "Red-green color blindness is caused by a recessive allele on the X chromosome, so it is a <strong>sex-linked</strong> trait. " + N(2) + "A genetics student writes the normal allele as XN and the color-blind allele as Xc. " + N(3) + "Males have one X chromosome and one Y chromosome; females have two X chromosomes. " + N(4) + "The student drew a pedigree for three generations of a family and listed each person in the table. " + N(5) + "A female who has one Xc allele but normal vision is a <strong>carrier</strong>. " + N(6) + "The student noticed that every color-blind person in the family was male and that the trait skipped a generation. " + N(7) + "II-2 married into the family and comes from a family with no history of color blindness. " + N(8) + "The student wants to predict the chance that the next son of II-1 and II-2 will be color-blind.</p>" +
        "<table><tr><th>Person</th><th>Sex</th><th>Vision</th><th>Parents</th></tr><tr><td>I-1</td><td>male</td><td>color-blind</td><td>—</td></tr><tr><td>I-2</td><td>female</td><td>normal</td><td>—</td></tr><tr><td>II-1</td><td>female</td><td>normal</td><td>I-1, I-2</td></tr><tr><td>II-2</td><td>male</td><td>normal</td><td>—</td></tr><tr><td>III-1</td><td>male</td><td>color-blind</td><td>II-1, II-2</td></tr><tr><td>III-2</td><td>female</td><td>normal</td><td>II-1, II-2</td></tr></table>",
      claims: [
        {
          id: "genotype",
          sol: "BIO.5.d",
          stem: "Based on the table, what is the genotype of II-1?",
          choices: [
            { letter: "A", text: "XN XN" },
            { letter: "B", text: "XN Xc" },
            { letter: "C", text: "Xc Xc" },
            { letter: "D", text: "Xc Y" }
          ],
          correct: "B"
        },
        {
          id: "vocab",
          sol: "BIO.5.d",
          stem: "In sentence 5, a carrier is a person who —",
          choices: [
            { letter: "A", text: "shows the recessive trait and can pass it to children" },
            { letter: "B", text: "has two copies of the recessive allele but shows no symptoms" },
            { letter: "C", text: "has one recessive allele, shows the normal phenotype, and can pass it on" },
            { letter: "D", text: "has inherited the trait from both parents but shows it mildly" }
          ],
          correct: "C"
        },
        {
          id: "source",
          sol: "BIO.5.c",
          stem: "III-1 is color-blind. Which statement explains why his Xc allele must have come from his mother, II-1?",
          choices: [
            { letter: "A", text: "Sons receive their X chromosome from their mother and their Y from their father" },
            { letter: "B", text: "Fathers cannot pass any of their alleles to their sons" },
            { letter: "C", text: "The Xc allele acts as a dominant allele in males" },
            { letter: "D", text: "Mothers always pass on their recessive allele to sons" }
          ],
          correct: "A"
        },
        {
          id: "chance",
          sol: "BIO.5.d",
          stem: "What is the chance that the next son of II-1 and II-2 will be color-blind?",
          choices: [
            { letter: "A", text: "0%" },
            { letter: "B", text: "25%" },
            { letter: "C", text: "50%" },
            { letter: "D", text: "100%" }
          ],
          correct: "C"
        },
        {
          id: "males",
          sol: "BIO.5.d",
          stem: "Which statement best explains the student's observation in sentence 6 that every color-blind person was male?",
          choices: [
            { letter: "A", text: "The color-blind allele is found only on the Y chromosome" },
            { letter: "B", text: "A male needs only one Xc allele to be color-blind, but a female needs two" },
            { letter: "C", text: "Females cannot inherit the Xc allele from their fathers" },
            { letter: "D", text: "Males carry more X chromosomes than females do" }
          ],
          correct: "B"
        },
        {
          id: "origin",
          sol: "BIO.5.e",
          stem: "The Xc allele most likely first appeared in the human population as —",
          choices: [
            { letter: "A", text: "an extra chromosome gained through nondisjunction" },
            { letter: "B", text: "a habit learned by looking at faded colors" },
            { letter: "C", text: "a gene transferred from a virus into the Y chromosome" },
            { letter: "D", text: "a mutation in the color-vision gene on an X chromosome" }
          ],
          correct: "D"
        }
      ]
    },

    /* ---------- medium · level 2 · gel electrophoresis and DNA fingerprinting ---------- */
    {
      id: "gen-bear-gel",
      family: "GEN",
      title: "Bands on a Gel",
      kind: "Genetics · BIO.5",
      blurb: "Which of three male black bears fathered the cub? Read the bands.",
      level: 2,
      passage: "<p>" + N(1) + "A wildlife rescue center in the Shenandoah Valley has a black bear cub born to a known mother and wants to learn which of three males is its father. " + N(2) + "Technicians cut DNA from each animal with the same restriction enzyme and ran the fragments through <strong>gel electrophoresis</strong>. " + N(3) + "DNA is negatively charged, so the fragments move toward the positive end of the gel, with smaller fragments traveling farther. " + N(4) + "The result is a <strong>DNA fingerprint</strong>: a pattern of bands that is unique to each individual. " + N(5) + "A cub inherits half its bands from each parent, so every band in the cub must match a band in its mother or its father. " + N(6) + "The table lists how far each band traveled from the wells, in millimeters. " + N(7) + "The center keeps the bears' DNA profiles in a database, and a staff member asks whether the same technique could be used on people without their consent.</p>" +
        "<table><tr><th>Sample</th><th>Bands (mm from wells)</th></tr><tr><td>Cub</td><td>12, 20, 31, 44</td></tr><tr><td>Mother</td><td>12, 31, 38, 50</td></tr><tr><td>Male A</td><td>20, 27, 44, 50</td></tr><tr><td>Male B</td><td>15, 20, 31, 38</td></tr><tr><td>Male C</td><td>12, 25, 31, 44</td></tr></table>",
      claims: [
        {
          id: "father",
          sol: "BIO.5.f",
          stem: "Based on the table, which male is most likely the cub's father?",
          choices: [
            { letter: "A", text: "Male A, because it has both cub bands that did not come from the mother" },
            { letter: "B", text: "Male B, because it shares the most bands with the mother" },
            { letter: "C", text: "Male C, because it shares the 12 mm band with the cub" },
            { letter: "D", text: "None of them, because no male matches all four cub bands" }
          ],
          correct: "A"
        },
        {
          id: "vocab",
          sol: "BIO.5.f",
          stem: "In sentence 2, gel electrophoresis is a technique that —",
          choices: [
            { letter: "A", text: "copies a DNA sample millions of times" },
            { letter: "B", text: "separates DNA fragments by size using an electric field" },
            { letter: "C", text: "cuts DNA at one specific base sequence" },
            { letter: "D", text: "inserts a new gene into a bacterial plasmid" }
          ],
          correct: "B"
        },
        {
          id: "smallest",
          sol: "BIO.5.f",
          stem: "Which band in the cub's sample is the smallest DNA fragment?",
          choices: [
            { letter: "A", text: "the band at 12 mm" },
            { letter: "B", text: "the band at 20 mm" },
            { letter: "C", text: "the band at 31 mm" },
            { letter: "D", text: "the band at 44 mm" }
          ],
          correct: "D"
        },
        {
          id: "half",
          sol: "BIO.5.c",
          stem: "Sentence 5 says the cub got half its bands from each parent. This is because —",
          choices: [
            { letter: "A", text: "mitosis in the cub cuts every chromosome in half" },
            { letter: "B", text: "the restriction enzyme removes the father's DNA from the cub" },
            { letter: "C", text: "each gamete is haploid, and fertilization joins one set from each parent" },
            { letter: "D", text: "the cub's DNA mutates until it matches each parent" }
          ],
          correct: "C"
        },
        {
          id: "band31",
          sol: "BIO.5.d",
          stem: "The cub's band at 31 mm appears in the mother but not in Male A. Which statement is correct?",
          choices: [
            { letter: "A", text: "The cub must have inherited that fragment from the mother" },
            { letter: "B", text: "Male A cannot be the father of the cub" },
            { letter: "C", text: "The band arose by a new mutation in the cub" },
            { letter: "D", text: "The band came from the father's Y chromosome" }
          ],
          correct: "A"
        },
        {
          id: "ethics",
          sol: "BIO.5.f",
          stem: "Which statement best describes the concern raised in sentence 7?",
          choices: [
            { letter: "A", text: "The technique cannot separate human DNA fragments by size" },
            { letter: "B", text: "Storing a person's DNA profile without consent raises privacy issues" },
            { letter: "C", text: "Human DNA fingerprints change too often to be stored" },
            { letter: "D", text: "Restriction enzymes cannot cut human DNA outside a hospital" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- long · level 3 · codominance and multiple alleles ---------- */
    {
      id: "gen-blood-types",
      family: "GEN",
      title: "Blood Types in a Family",
      kind: "Genetics · BIO.5",
      blurb: "Three alleles, two codominant, one recessive: could a type O child belong to type A and B parents?",
      level: 3,
      passage: "<p>" + N(1) + "Human ABO blood type is controlled by one gene with three alleles, written IA, IB and i. " + N(2) + "The IA and IB alleles are <strong>codominant</strong>: a person with both makes both markers on red blood cells and has type AB blood. " + N(3) + "The i allele is recessive, so type O blood requires two copies of it. " + N(4) + "A genetics counselor in Richmond recorded a family's blood types in the table. " + N(5) + "The mother has type A blood, and her own parents were types A and O. " + N(6) + "The father has type B blood, and one of his parents was type O. " + N(7) + "The couple has three children and is expecting a fourth. " + N(8) + "The counselor used a Punnett square to predict the chances for the fourth child. " + N(9) + "She reminded the family that blood type is decided at <strong>fertilization</strong>, when the sperm and egg each contribute one allele. " + N(10) + "The parents asked whether Child 1, with type O blood, could really be theirs, and the counselor showed that it could. " + N(11) + "One child asked whether AB blood is a blend, like a pink snapdragon; the counselor explained that in codominance both alleles are fully expressed, not blended. " + N(12) + "She added that the i allele arose long ago as a mutation that stops the enzyme that builds the A or B marker.</p>" +
        "<table><tr><th>Person</th><th>Blood type</th></tr><tr><td>Mother</td><td>A</td></tr><tr><td>Father</td><td>B</td></tr><tr><td>Child 1</td><td>O</td></tr><tr><td>Child 2</td><td>AB</td></tr><tr><td>Child 3</td><td>B</td></tr></table>",
      claims: [
        {
          id: "parents",
          sol: "BIO.5.d",
          stem: "Based on the table and sentences 5 and 6, what are the genotypes of the mother and the father?",
          choices: [
            { letter: "A", text: "IA IA and IB IB" },
            { letter: "B", text: "IA IB and i i" },
            { letter: "C", text: "IA i and IB IB" },
            { letter: "D", text: "IA i and IB i" }
          ],
          correct: "D"
        },
        {
          id: "vocab",
          sol: "BIO.5.d",
          stem: "In sentence 2, codominant means that —",
          choices: [
            { letter: "A", text: "the heterozygote shows a blend of the two phenotypes" },
            { letter: "B", text: "one allele masks the other allele in the heterozygote" },
            { letter: "C", text: "both alleles are fully expressed in the heterozygote" },
            { letter: "D", text: "the trait is more common than any other blood type" }
          ],
          correct: "C"
        },
        {
          id: "chance-o",
          sol: "BIO.5.d",
          stem: "What is the chance that the fourth child will have type O blood?",
          choices: [
            { letter: "A", text: "0%" },
            { letter: "B", text: "25%" },
            { letter: "C", text: "50%" },
            { letter: "D", text: "75%" }
          ],
          correct: "B"
        },
        {
          id: "one-allele",
          sol: "BIO.5.c",
          stem: "Sentence 9 says blood type is decided at fertilization. Which statement explains why each parent contributes only one allele?",
          choices: [
            { letter: "A", text: "Meiosis separates a parent's two alleles into different gametes, so each gamete carries one" },
            { letter: "B", text: "Mitosis destroys one of the two alleles in each parent before reproduction" },
            { letter: "C", text: "Only the dominant allele of a pair is able to enter a gamete" },
            { letter: "D", text: "Each gamete carries both alleles, but one is deleted after fertilization" }
          ],
          correct: "A"
        },
        {
          id: "marker",
          sol: "BIO.5.e",
          stem: "Based on sentence 12, why does a person with genotype i i have neither the A nor the B marker?",
          choices: [
            { letter: "A", text: "The i allele is carried on the Y chromosome" },
            { letter: "B", text: "The i allele makes a marker that is too small to detect" },
            { letter: "C", text: "Both copies of the gene carry the mutation, so no working enzyme is made" },
            { letter: "D", text: "Type O red blood cells lack the ribosomes needed to build markers" }
          ],
          correct: "C"
        },
        {
          id: "select-two",
          sol: "BIO.5.d",
          stem: "Select TWO statements about this family that are supported by the passage and the table.",
          choices: [
            { letter: "A", text: "Child 1, with type O blood, is a possible biological child of these parents" },
            { letter: "B", text: "The fourth child could be born with type AB blood" },
            { letter: "C", text: "These parents cannot have a child with type A blood" },
            { letter: "D", text: "Child 2 must have inherited the IA allele from the father" }
          ],
          correct: ["A", "B"]
        }
      ]
    },

    /* ---------- long · level 3 · gene editing, germ-line vs somatic, ethics ---------- */
    {
      id: "gen-gene-editing",
      family: "GEN",
      title: "Editing a Gene in Mice",
      kind: "Genetics · BIO.5",
      blurb: "Fix a faulty liver gene in adults or in eggs: what gets inherited, and what could go wrong?",
      level: 3,
      passage: "<p>" + N(1) + "A research team is testing a <strong>gene-editing</strong> tool that uses a guide molecule to find a specific DNA sequence and an enzyme to cut it, so that the cell's repair machinery can replace a faulty allele with a working copy. " + N(2) + "The team works with a strain of mice that carries a recessive point mutation in a gene for a liver enzyme; mice with two mutant alleles cannot break down a certain amino acid and become sick on a normal diet. " + N(3) + "In Trial 1, the tool was injected into the livers of adult sick mice. " + N(4) + "In Trial 2, the tool was applied to fertilized mouse eggs before the first cell division. " + N(5) + "The table shows the results. " + N(6) + "Mice treated as adults improved, but their offspring were all born sick. " + N(7) + "Mice edited as eggs were healthy, and so were their offspring. " + N(8) + "In a few Trial 2 mice, the enzyme also cut at a second, unintended site, producing a new mutation. " + N(9) + "The team's report noted that editing eggs is a <strong>germ-line</strong> change that will be passed to every future generation, and asked whether the same approach should ever be used on human embryos. " + N(10) + "A second group argued that treating adults, whose edits are somatic and not inherited, raises fewer ethical concerns.</p>" +
        "<table><tr><th>Trial</th><th>Cells edited</th><th>Treated mice healthy</th><th>Offspring healthy</th></tr><tr><td>1</td><td>adult liver cells</td><td>18 of 20</td><td>0 of 60</td></tr><tr><td>2</td><td>fertilized eggs</td><td>19 of 20</td><td>60 of 60</td></tr></table>",
      claims: [
        {
          id: "conclusion",
          sol: "BIO.5.f",
          stem: "Which conclusion is best supported by the results of the two trials in the table?",
          choices: [
            { letter: "A", text: "Editing adult liver cells cured the mice and also cured their offspring" },
            { letter: "B", text: "Neither trial improved the health of the treated mice" },
            { letter: "C", text: "Editing adults worked better than editing eggs for the treated mice" },
            { letter: "D", text: "Editing fertilized eggs produced healthy mice whose offspring were also healthy" }
          ],
          correct: "D"
        },
        {
          id: "somatic",
          sol: "BIO.5.e",
          stem: "Which statement best explains why the offspring in Trial 1 were all born sick?",
          choices: [
            { letter: "A", text: "The edited liver cells were somatic cells, so the parents' gametes still carried the mutant allele" },
            { letter: "B", text: "The working allele is recessive, so it was hidden in the offspring" },
            { letter: "C", text: "A liver enzyme is a protein, and proteins cannot be inherited by offspring" },
            { letter: "D", text: "The tool cut the parents' gametes at the wrong site and destroyed them" }
          ],
          correct: "A"
        },
        {
          id: "everycell",
          sol: "BIO.5.c",
          stem: "Why did the edit in Trial 2 end up in every cell of the treated mice, including their gametes?",
          choices: [
            { letter: "A", text: "The tool spread from cell to cell through the bloodstream" },
            { letter: "B", text: "The egg was edited before the first division, so mitosis copied the edited DNA into every cell" },
            { letter: "C", text: "Meiosis in the fertilized egg produced four edited cells that built the body" },
            { letter: "D", text: "The enzyme kept cutting and repairing DNA in each new cell as it formed" }
          ],
          correct: "B"
        },
        {
          id: "vocab",
          sol: "BIO.5.f",
          stem: "In sentence 9, a germ-line change is one that —",
          choices: [
            { letter: "A", text: "occurs in cells that will form gametes and can be inherited" },
            { letter: "B", text: "affects only the liver cells where it was made" },
            { letter: "C", text: "is caused by a germ such as a bacterium or a virus" },
            { letter: "D", text: "is always harmful to the organism that was treated" }
          ],
          correct: "A"
        },
        {
          id: "onecopy",
          sol: "BIO.5.d",
          stem: "The mice in sentence 2 are sick only when they carry two mutant alleles. If the tool repaired just one of the two alleles in a cell, that cell would —",
          choices: [
            { letter: "A", text: "still lack the enzyme, because the working allele is recessive" },
            { letter: "B", text: "make half as much mutant protein and stay sick" },
            { letter: "C", text: "make the enzyme, because one working copy of the dominant allele is enough" },
            { letter: "D", text: "need a second mutation before it could become healthy" }
          ],
          correct: "C"
        },
        {
          id: "ethics",
          sol: "BIO.5.f",
          stem: "Which statement best summarizes the ethical concern raised in sentences 8 through 10?",
          choices: [
            { letter: "A", text: "Editing adult body cells is riskier than editing embryos because adults have more cells" },
            { letter: "B", text: "An unintended mutation in an edited embryo could be inherited by all later generations" },
            { letter: "C", text: "Animals cannot consent, so no gene editing of mice should ever be performed" },
            { letter: "D", text: "The repaired liver enzyme could spread to other species through the food chain" }
          ],
          correct: "B"
        }
      ]
    }
  ];

  for (var i = 0; i < PACKS.length; i++) P.push(PACKS[i]);
})(typeof window !== "undefined" ? window : global);
