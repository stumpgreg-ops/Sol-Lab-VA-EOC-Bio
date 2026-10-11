/* SOL Lab — DNA & Protein Synthesis (BIO.5.a, BIO.5.b, BIO.2.d). Original text only. */
(function (global) {
  var P = global.HEIST_PACKS;
  if (!P || !P.push) return;
  var N = function (i) { return '<span class="n">(' + i + ')</span> '; };   // numbered sentence

  var PACKS = [
    /* ---------- tiny · level 1 · BIO.5.a ---------- */
    {
      id: "dna-nucleotide-kit",
      family: "DNA",
      title: "Building a Nucleotide Model",
      kind: "DNA & Proteins · BIO.5 / BIO.2",
      blurb: "A model kit shows the three parts of a nucleotide and which bases fit together.",
      level: 1,
      passage: "<p>" + N(1) + "A biology class builds a short piece of DNA from a model kit. " + N(2) + "Each <strong>nucleotide</strong> snaps together from three pieces: a phosphate group, a deoxyribose sugar and one nitrogen base. " + N(3) + "The sugars and phosphates link into two long backbones, and the bases meet in the middle. " + N(4) + "One strand the class builds reads 5'-ATGCCA-3'. " + N(5) + "A student notices that A fits only across from T, and G only across from C.</p>",
      claims: [
        {
          id: "parts",
          sol: "BIO.5.a",
          stem: "In sentence 2, a nucleotide is best described as —",
          choices: [
            { letter: "A", text: "a single nitrogen base floating free inside the nucleus" },
            { letter: "B", text: "a phosphate, a sugar and a base joined as one unit" },
            { letter: "C", text: "one complete turn of the double helix" },
            { letter: "D", text: "the weak bond that holds two paired bases together" }
          ],
          correct: "B"
        },
        {
          id: "complement",
          sol: "BIO.5.a",
          stem: "The strand that pairs with 5'-ATGCCA-3' in sentence 4 would read, base for base, —",
          choices: [
            { letter: "A", text: "3'-TACGGT-5'" },
            { letter: "B", text: "3'-ATGCCA-5'" },
            { letter: "C", text: "3'-UACGGU-5'" },
            { letter: "D", text: "3'-GCATTG-5'" }
          ],
          correct: "A"
        },
        {
          id: "backbone",
          sol: "BIO.5.a",
          stem: "According to sentence 3, the backbone of each strand is made of —",
          choices: [
            { letter: "A", text: "paired nitrogen bases held by hydrogen bonds" },
            { letter: "B", text: "nitrogen bases linked directly to each other" },
            { letter: "C", text: "phosphate groups linked to each other with no sugar" },
            { letter: "D", text: "alternating sugar and phosphate groups" }
          ],
          correct: "D"
        },
        {
          id: "fit",
          sol: "BIO.5.a",
          stem: "Which statement best explains the observation in sentence 5 of the notes?",
          choices: [
            { letter: "A", text: "A and T are the same size, so they take up the same space" },
            { letter: "B", text: "A and T are both attached to the sugar deoxyribose" },
            { letter: "C", text: "A and T have shapes that fit and form hydrogen bonds with each other" },
            { letter: "D", text: "A and T are joined to each other by a strong covalent bond" }
          ],
          correct: "C"
        },
        {
          id: "count",
          sol: "BIO.5.a",
          stem: "The finished model has 12 base pairs, and 5 of them are A-T pairs. How many guanine nucleotides does the model contain?",
          choices: [
            { letter: "A", text: "5" },
            { letter: "B", text: "7" },
            { letter: "C", text: "12" },
            { letter: "D", text: "14" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- short · level 2 · BIO.5.a / 5.b / 2.d ---------- */
    {
      id: "dna-base-percentages",
      family: "DNA",
      title: "Base Counts from Four Samples",
      kind: "DNA & Proteins · BIO.5 / BIO.2",
      blurb: "Base percentages from four organisms, one value missing, and the rule that fills it in.",
      level: 2,
      passage: "<p>" + N(1) + "A lab team extracts DNA from four organisms and measures the percentage of each nitrogen base. " + N(2) + "The team recalls that around 1950 the chemist Chargaff reported that in DNA the amount of adenine roughly equals the amount of thymine, and guanine roughly equals cytosine. " + N(3) + "This pattern, now called <strong>Chargaff's rule</strong>, was one clue Watson and Crick used when they proposed the double helix in 1953. " + N(4) + "The team's results are in the table. " + N(5) + "The thymine value for the trout sample was smudged and could not be read. " + N(6) + "The team also notes that the two strands of each molecule run in opposite directions, a feature called <strong>antiparallel</strong>.</p><table><tr><th>Sample</th><th>A (%)</th><th>T (%)</th><th>G (%)</th></tr><tr><td>Yeast</td><td>31</td><td>31</td><td>19</td></tr><tr><td>Trout</td><td>28</td><td>?</td><td>22</td></tr><tr><td>Soil bacterium</td><td>25</td><td>25</td><td>25</td></tr><tr><td>Wheat</td><td>27</td><td>27</td><td>23</td></tr></table>",
      claims: [
        {
          id: "missing",
          sol: "BIO.5.a",
          stem: "Based on Chargaff's rule, the missing thymine value for the trout sample is most likely —",
          choices: [
            { letter: "A", text: "22%" },
            { letter: "B", text: "28%" },
            { letter: "C", text: "44%" },
            { letter: "D", text: "50%" }
          ],
          correct: "B"
        },
        {
          id: "cytosine",
          sol: "BIO.5.a",
          stem: "The table does not list cytosine. The percentage of cytosine in the trout sample should be about —",
          choices: [
            { letter: "A", text: "22%" },
            { letter: "B", text: "28%" },
            { letter: "C", text: "44%" },
            { letter: "D", text: "56%" }
          ],
          correct: "A"
        },
        {
          id: "anti",
          sol: "BIO.5.a",
          stem: "In sentence 6, antiparallel means that the two strands —",
          choices: [
            { letter: "A", text: "have exactly the same base sequence read in the same direction" },
            { letter: "B", text: "are held together by covalent bonds between their sugars" },
            { letter: "C", text: "separate completely from each other before every cell division" },
            { letter: "D", text: "run in opposite directions, one 5' to 3' and the other 3' to 5'" }
          ],
          correct: "D"
        },
        {
          id: "clue",
          sol: "BIO.5.b",
          stem: "Which statement best explains why Chargaff's rule supported a model in which A pairs with T and G pairs with C?",
          choices: [
            { letter: "A", text: "Equal amounts of A and T show that all DNA molecules have the same base sequence" },
            { letter: "B", text: "Bases present in equal amounts must sit next to each other on the same strand" },
            { letter: "C", text: "If every A on one strand is bonded to a T on the other, the two amounts must be equal" },
            { letter: "D", text: "The rule showed that DNA is built from only two kinds of nitrogen bases" }
          ],
          correct: "C"
        },
        {
          id: "violate",
          sol: "BIO.5.b",
          stem: "Which result, if found, would be inconsistent with Chargaff's rule?",
          choices: [
            { letter: "A", text: "a sample with 31% adenine and 31% thymine" },
            { letter: "B", text: "a sample with 30% adenine and 20% thymine" },
            { letter: "C", text: "a sample with 24% guanine and 24% cytosine" },
            { letter: "D", text: "a sample with 25% of each of the four bases" }
          ],
          correct: "B"
        },
        {
          id: "mrna",
          sol: "BIO.2.d",
          stem: "A team member predicts that mRNA copied from a yeast gene will also contain equal amounts of A and U. Which statement best evaluates this prediction?",
          choices: [
            { letter: "A", text: "It is correct, because mRNA is copied from DNA and keeps the same base ratios" },
            { letter: "B", text: "It is correct, because uracil replaces thymine in exactly equal amounts" },
            { letter: "C", text: "It is incorrect, because mRNA contains guanine and cytosine but no adenine" },
            { letter: "D", text: "It is incorrect, because mRNA is a single strand whose bases are not paired within it" }
          ],
          correct: "D"
        }
      ]
    },

    /* ---------- tiny · level 1 · BIO.5.a / 2.d ---------- */
    {
      id: "dna-two-nucleic-acids",
      family: "DNA",
      title: "Two Nucleic Acids, One Cell",
      kind: "DNA & Proteins · BIO.5 / BIO.2",
      blurb: "Two samples from the same cell differ in sugar, strands and one base.",
      level: 1,
      passage: "<p>" + N(1) + "A student compares two nucleic acid samples taken from the same cell. " + N(2) + "Sample 1 came from the nucleus, has two strands and contains the sugar deoxyribose. " + N(3) + "Sample 2 came from the cytoplasm, has a single strand and contains the sugar ribose. " + N(4) + "When the bases are listed, Sample 2 contains <strong>uracil</strong> but no thymine. " + N(5) + "Sample 2 also breaks down within hours, while Sample 1 lasts for the life of the cell.</p>",
      claims: [
        {
          id: "ident",
          sol: "BIO.5.a",
          stem: "Which identification of the two samples is correct?",
          choices: [
            { letter: "A", text: "Sample 1 is RNA and Sample 2 is DNA" },
            { letter: "B", text: "Sample 1 is DNA and Sample 2 is RNA" },
            { letter: "C", text: "Both samples are DNA from different chromosomes" },
            { letter: "D", text: "Both samples are RNA, one folded and one unfolded" }
          ],
          correct: "B"
        },
        {
          id: "uracil",
          sol: "BIO.2.d",
          stem: "In sentence 4, uracil is best described as —",
          choices: [
            { letter: "A", text: "the five-carbon sugar that is found only in RNA" },
            { letter: "B", text: "a base that pairs with guanine in place of cytosine" },
            { letter: "C", text: "a base that pairs with adenine in RNA in place of thymine" },
            { letter: "D", text: "the phosphate group that links RNA nucleotides together" }
          ],
          correct: "C"
        },
        {
          id: "copy",
          sol: "BIO.2.d",
          stem: "If Sample 2 was copied from a DNA template strand reading 3'-TACGGA-5', its sequence would be —",
          choices: [
            { letter: "A", text: "5'-AUGCCU-3'" },
            { letter: "B", text: "5'-ATGCCT-3'" },
            { letter: "C", text: "5'-UACGGA-3'" },
            { letter: "D", text: "5'-AUGCCA-3'" }
          ],
          correct: "A"
        },
        {
          id: "short",
          sol: "BIO.2.d",
          stem: "Which statement best explains why Sample 2 breaks down quickly (sentence 5)?",
          choices: [
            { letter: "A", text: "RNA is destroyed because its single strand is too long to fold properly" },
            { letter: "B", text: "DNA is broken down each time a protein is made from it" },
            { letter: "C", text: "RNA lasts longer only when it remains inside the nucleus" },
            { letter: "D", text: "mRNA is a temporary copy of a gene, while DNA is the cell's permanent record" }
          ],
          correct: "D"
        },
        {
          id: "share",
          sol: "BIO.5.a",
          stem: "Which feature do Sample 1 and Sample 2 share?",
          choices: [
            { letter: "A", text: "the five-carbon sugar deoxyribose in every nucleotide" },
            { letter: "B", text: "a single strand of nucleotides folded back on itself" },
            { letter: "C", text: "nucleotides made of a sugar, a phosphate and a base" },
            { letter: "D", text: "the nitrogen base thymine paired with adenine" }
          ],
          correct: "C"
        }
      ]
    },

    /* ---------- medium · level 3 · BIO.5.a / 5.b / 2.d ---------- */
    {
      id: "dna-density-replication",
      family: "DNA",
      title: "Heavy and Light DNA",
      kind: "DNA & Proteins · BIO.5 / BIO.2",
      blurb: "Bacteria switched from heavy to light nitrogen reveal how DNA is copied.",
      level: 3,
      passage: "<p>" + N(1) + "A research team wants to know how a cell copies its DNA before dividing. " + N(2) + "They grow bacteria for many generations in a broth containing only a heavy form of nitrogen, so every nitrogen base in the cells' DNA becomes heavy. " + N(3) + "The bacteria are then moved to a broth with only normal, light nitrogen and allowed to divide. " + N(4) + "After each round of <strong>replication</strong>, DNA is extracted and spun in a dense salt solution in a centrifuge, where heavier DNA settles into a band lower in the tube. " + N(5) + "The table shows the bands observed. " + N(6) + "Three models were being tested: a conservative model, in which the original double helix stays whole and an all-new one is made; a semi-conservative model, in which each new molecule keeps one old strand; and a dispersive model, in which old and new pieces are scattered through both strands.</p><table><tr><th>Generation</th><th>Bands</th><th>Position in tube</th></tr><tr><td>0 (before switch)</td><td>1</td><td>heavy</td></tr><tr><td>1</td><td>1</td><td>intermediate</td></tr><tr><td>2</td><td>2</td><td>intermediate and light, equal thickness</td></tr><tr><td>3</td><td>2</td><td>thin intermediate, thick light</td></tr></table>",
      claims: [
        {
          id: "gen1",
          sol: "BIO.5.a",
          stem: "The result at generation 1 rules out which model, and why?",
          choices: [
            { letter: "A", text: "the conservative model, because it predicts one heavy band and one light band after one round" },
            { letter: "B", text: "the semi-conservative model, because it predicts a single intermediate band after one round" },
            { letter: "C", text: "the dispersive model, because it predicts two separate bands after one round" },
            { letter: "D", text: "all three models, because none of them predicts a single band after one round" }
          ],
          correct: "A"
        },
        {
          id: "gen2",
          sol: "BIO.5.a",
          stem: "The result at generation 2 supports the semi-conservative model over the dispersive model because the dispersive model predicts —",
          choices: [
            { letter: "A", text: "two bands, one fully heavy and one fully light" },
            { letter: "B", text: "a light band only, since the old pieces are used up" },
            { letter: "C", text: "one intermediate band and one light band of equal thickness" },
            { letter: "D", text: "a single band slightly lighter than intermediate, with no fully light DNA" }
          ],
          correct: "D"
        },
        {
          id: "vocab",
          sol: "BIO.5.a",
          stem: "In sentence 4, replication refers to —",
          choices: [
            { letter: "A", text: "the separation of DNA molecules into bands by their weight" },
            { letter: "B", text: "the process by which a cell makes an exact copy of its DNA before it divides" },
            { letter: "C", text: "the change of heavy nitrogen into light nitrogen inside the cell" },
            { letter: "D", text: "the copying of a single gene into a strand of messenger RNA" }
          ],
          correct: "B"
        },
        {
          id: "helix",
          sol: "BIO.5.b",
          stem: "The double-helix model published in 1953 pointed toward the semi-conservative model because —",
          choices: [
            { letter: "A", text: "its two strands are identical, so either one can be discarded" },
            { letter: "B", text: "its bases lie on the outside where copying enzymes can reach them" },
            { letter: "C", text: "the helix must be broken into small pieces before it can be copied" },
            { letter: "D", text: "each strand carries the information needed to rebuild the other by base pairing" }
          ],
          correct: "D"
        },
        {
          id: "two",
          sol: "BIO.5.a",
          stem: "Select TWO statements that are supported by the results in the table.",
          choices: [
            { letter: "A", text: "After one round, each DNA molecule contains one heavy strand and one light strand" },
            { letter: "B", text: "The original heavy strands are destroyed during the first replication" },
            { letter: "C", text: "With each further generation, the light band grows while the intermediate band never becomes heavier" },
            { letter: "D", text: "Replication of the DNA is not complete until the third generation" }
          ],
          correct: ["A", "C"]
        },
        {
          id: "compare",
          sol: "BIO.2.d",
          stem: "Which statement correctly distinguishes replication from transcription?",
          choices: [
            { letter: "A", text: "Replication happens at the ribosome, while transcription happens in the nucleus" },
            { letter: "B", text: "Replication copies the whole DNA molecule, while transcription copies one gene region into RNA" },
            { letter: "C", text: "Replication uses uracil, while transcription uses thymine" },
            { letter: "D", text: "Replication builds a chain of amino acids, while transcription builds DNA" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- short · level 2 · BIO.5.b / 5.a / 2.d ---------- */
    {
      id: "dna-transforming-principle",
      family: "DNA",
      title: "The Transforming Substance",
      kind: "DNA & Proteins · BIO.5 / BIO.2",
      blurb: "Mice, two bacterial strains and a set of enzymes point to the molecule that carries traits.",
      level: 2,
      passage: "<p>" + N(1) + "In 1928 Griffith injected mice with two strains of a pneumonia bacterium: a smooth strain with a slippery outer coat that kills mice, and a rough strain with no coat that does not. " + N(2) + "Heat-killed smooth bacteria alone were harmless. " + N(3) + "A mixture of heat-killed smooth cells and living rough cells, however, killed the mice, and living smooth cells were recovered from their blood. " + N(4) + "Griffith concluded that something from the dead smooth cells had entered the rough cells and changed them, a process called <strong>transformation</strong>. " + N(5) + "In 1944 Avery's team repeated the mixing in test tubes after treating a smooth-cell extract with different enzymes. " + N(6) + "Their results are in the table.</p><table><tr><th>Enzyme added to extract</th><th>Molecule destroyed</th><th>Rough cells transformed?</th></tr><tr><td>none</td><td>none</td><td>yes</td></tr><tr><td>protein-digesting</td><td>protein</td><td>yes</td></tr><tr><td>RNA-digesting</td><td>RNA</td><td>yes</td></tr><tr><td>DNA-digesting</td><td>DNA</td><td>no</td></tr></table>",
      claims: [
        {
          id: "table",
          sol: "BIO.5.b",
          stem: "Which conclusion do the mouse results in the table best support?",
          choices: [
            { letter: "A", text: "Protein in the extract carries the hereditary information" },
            { letter: "B", text: "DNA, not protein or RNA, is the substance that transforms the cells" },
            { letter: "C", text: "RNA must be present in the extract for transformation to occur" },
            { letter: "D", text: "The enzymes themselves caused the rough cells to change" }
          ],
          correct: "B"
        },
        {
          id: "evidence",
          sol: "BIO.5.b",
          stem: "In sentence 3, the key evidence that transformation had occurred was that —",
          choices: [
            { letter: "A", text: "the mice injected with the mixture became sick within days" },
            { letter: "B", text: "the heat had failed to kill all of the smooth cells" },
            { letter: "C", text: "living smooth cells appeared even though only dead smooth cells had been injected" },
            { letter: "D", text: "the rough cells lost their ability to grow inside the mice" }
          ],
          correct: "C"
        },
        {
          id: "vocab",
          sol: "BIO.5.b",
          stem: "In sentence 4, transformation is best defined as —",
          choices: [
            { letter: "A", text: "the death of a bacterium after it is heated to a high temperature" },
            { letter: "B", text: "the growth of a slippery coat around a dead smooth cell" },
            { letter: "C", text: "a mouse developing immunity after surviving an infection" },
            { letter: "D", text: "a change in a cell's traits caused by hereditary material taken up from another cell" }
          ],
          correct: "D"
        },
        {
          id: "control",
          sol: "BIO.5.b",
          stem: "In Avery's investigation, the extract with no enzyme added served as —",
          choices: [
            { letter: "A", text: "the control, showing the untreated extract could transform rough cells" },
            { letter: "B", text: "the independent variable, since it was changed on purpose" },
            { letter: "C", text: "evidence that enzymes are harmful to living bacteria" },
            { letter: "D", text: "the dependent variable, since it was measured at the end" }
          ],
          correct: "A"
        },
        {
          id: "structure",
          sol: "BIO.5.a",
          stem: "Which description of the transforming substance is consistent with what is now known about DNA?",
          choices: [
            { letter: "A", text: "a chain of nucleotides whose sequence can be copied and passed on to daughter cells" },
            { letter: "B", text: "a chain of amino acids folded into the shape of a slippery coat" },
            { letter: "C", text: "a single-stranded molecule that is broken down within a few hours" },
            { letter: "D", text: "a layer of lipids that surrounds the outside of the bacterial cell" }
          ],
          correct: "A"
        },
        {
          id: "coat",
          sol: "BIO.2.d",
          stem: "Which statement best explains how DNA from the dead smooth cells could give a rough cell a slippery coat?",
          choices: [
            { letter: "A", text: "The DNA itself wraps around the rough cell to form the coat" },
            { letter: "B", text: "The DNA is transcribed and translated into the enzymes that build the coat" },
            { letter: "C", text: "The DNA is digested into sugars that are used to make the coat" },
            { letter: "D", text: "The DNA pairs with the rough cell's mRNA and blocks its own genes" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- medium · level 3 · BIO.5.b / 5.a / 2.d ---------- */
    {
      id: "dna-phage-labels",
      family: "DNA",
      title: "Tagging a Virus",
      kind: "DNA & Proteins · BIO.5 / BIO.2",
      blurb: "Radioactive sulfur and phosphorus track which part of a virus enters a bacterium.",
      level: 3,
      passage: "<p>" + N(1) + "Transformation experiments with bacteria in 1928 and 1944 had pointed to DNA, yet in the early 1950s some scientists still argued that proteins carried genetic instructions, since proteins have 20 kinds of building blocks and DNA has only four. " + N(2) + "In 1952 Hershey and Chase tested the question with a virus that infects bacteria. " + N(3) + "The virus is a protein coat around a DNA core; it attaches to a bacterium, injects its genetic material and leaves the coat outside. " + N(4) + "Protein contains sulfur but no phosphorus, and DNA contains phosphorus but no sulfur. " + N(5) + "One batch of virus was grown with radioactive sulfur and another with radioactive phosphorus. " + N(6) + "After each batch infected bacteria, a blender knocked the coats off the cells and a centrifuge separated the cells (pellet) from the fluid. " + N(7) + "A year later Franklin's <strong>X-ray diffraction</strong> images of DNA fibers showed an X-shaped pattern, which Watson and Crick combined with Chargaff's base ratios to build the double-helix model.</p><table><tr><th>Radioactive label</th><th>Molecule tagged</th><th>In fluid</th><th>In pellet</th></tr><tr><td>sulfur</td><td>protein coat</td><td>82%</td><td>18%</td></tr><tr><td>phosphorus</td><td>DNA</td><td>21%</td><td>79%</td></tr></table>",
      claims: [
        {
          id: "conclude",
          sol: "BIO.5.b",
          stem: "Which conclusion do the labelling results in the table best support?",
          choices: [
            { letter: "A", text: "Both protein and DNA enter the bacterium in roughly equal amounts" },
            { letter: "B", text: "The protein coat carries the genetic instructions into the cell" },
            { letter: "C", text: "DNA enters the bacterium, so DNA is the material that carries the virus's instructions" },
            { letter: "D", text: "Sulfur is required for the virus to attach to the bacterial cell" }
          ],
          correct: "C"
        },
        {
          id: "labels",
          sol: "BIO.5.b",
          stem: "Why did the team choose sulfur and phosphorus as the labels?",
          choices: [
            { letter: "A", text: "They are the two most common elements in a bacterial cell" },
            { letter: "B", text: "Each element is found in only one of the two molecules, so the label tracks that molecule alone" },
            { letter: "C", text: "Both elements become radioactive when they are placed in a blender" },
            { letter: "D", text: "Sulfur and phosphorus are the elements that pair the bases in DNA" }
          ],
          correct: "B"
        },
        {
          id: "pellet",
          sol: "BIO.5.b",
          stem: "Which statement best explains why 18% of the sulfur label was found in the pellet?",
          choices: [
            { letter: "A", text: "Some protein coats were still attached to cells when they were spun down" },
            { letter: "B", text: "Protein also enters the cells and carries part of the instructions" },
            { letter: "C", text: "Sulfur atoms were converted into phosphorus atoms inside the cells" },
            { letter: "D", text: "The label moved from the coats into the DNA during infection" }
          ],
          correct: "A"
        },
        {
          id: "vocab",
          sol: "BIO.5.b",
          stem: "In sentence 7, X-ray diffraction is best described as —",
          choices: [
            { letter: "A", text: "a method of tagging DNA with radioactive atoms" },
            { letter: "B", text: "a way of separating heavy and light molecules in a centrifuge" },
            { letter: "C", text: "a chemical test that measures the amount of each nitrogen base" },
            { letter: "D", text: "a technique in which X-rays scattered by a fiber reveal the spacing of its repeating parts" }
          ],
          correct: "D"
        },
        {
          id: "counter",
          sol: "BIO.5.a",
          stem: "Which statement best counters the argument in sentence 1 that DNA is too simple to carry instructions?",
          choices: [
            { letter: "A", text: "DNA has more building blocks than protein once its sugars and phosphates are counted" },
            { letter: "B", text: "The order of four bases along a long molecule can spell out countless different messages" },
            { letter: "C", text: "Proteins cannot be found inside the nucleus, where the chromosomes are located" },
            { letter: "D", text: "The four bases are larger than amino acids and therefore store more energy" }
          ],
          correct: "B"
        },
        {
          id: "host",
          sol: "BIO.2.d",
          stem: "Once inside the bacterium, the viral DNA directs the cell to build new virus proteins. Which statement describes how this happens?",
          choices: [
            { letter: "A", text: "The viral DNA is translated directly into protein at the cell wall" },
            { letter: "B", text: "The host copies the viral coat protein by base pairing" },
            { letter: "C", text: "The viral protein coat is transcribed into mRNA inside the cell" },
            { letter: "D", text: "Host enzymes transcribe the viral DNA into mRNA, which host ribosomes translate" }
          ],
          correct: "D"
        }
      ]
    },

    /* ---------- short · level 1 · BIO.2.d / 5.a / 5.b ---------- */
    {
      id: "dna-gene-to-ribosome",
      family: "DNA",
      title: "From Gene to Ribosome",
      kind: "DNA & Proteins · BIO.5 / BIO.2",
      blurb: "Follow a pancreas gene from the nucleus to a ribosome and copy its first nine bases.",
      level: 1,
      passage: "<p>" + N(1) + "A student traces how a cell in the pancreas makes a digestive enzyme. " + N(2) + "First, an enzyme unzips a section of DNA in the nucleus and builds a strand of messenger RNA (mRNA) that matches the <strong>template</strong> strand of the gene. " + N(3) + "This step is called transcription. " + N(4) + "The mRNA leaves the nucleus through a nuclear pore and attaches to a ribosome in the cytoplasm. " + N(5) + "Transfer RNA (tRNA) molecules bring amino acids to the ribosome, which links them in the order the mRNA spells out. " + N(6) + "This second step is called translation. " + N(7) + "The start of the template strand the student is studying reads 3'-TACAAAGGC-5'.</p>",
      claims: [
        {
          id: "mrna",
          sol: "BIO.2.d",
          stem: "The mRNA transcribed from the template strand in sentence 7 would read —",
          choices: [
            { letter: "A", text: "5'-AUGUUUCCG-3'" },
            { letter: "B", text: "5'-ATGTTTCCG-3'" },
            { letter: "C", text: "5'-UACAAAGGC-3'" },
            { letter: "D", text: "5'-AUGUUUCCC-3'" }
          ],
          correct: "A"
        },
        {
          id: "where",
          sol: "BIO.2.d",
          stem: "Based on the passage, transcription and translation take place, respectively, —",
          choices: [
            { letter: "A", text: "in the cytoplasm and in the nucleus" },
            { letter: "B", text: "in the nucleus and at a ribosome in the cytoplasm" },
            { letter: "C", text: "at a ribosome and at a nuclear pore" },
            { letter: "D", text: "at a nuclear pore and inside the nucleus" }
          ],
          correct: "B"
        },
        {
          id: "vocab",
          sol: "BIO.2.d",
          stem: "In sentence 2, the template strand is —",
          choices: [
            { letter: "A", text: "the strand of mRNA that carries the message to the ribosome" },
            { letter: "B", text: "the protein that unzips the DNA at the start of transcription" },
            { letter: "C", text: "the strand of DNA that stays attached to the ribosome" },
            { letter: "D", text: "the DNA strand whose bases are read to build a complementary mRNA" }
          ],
          correct: "D"
        },
        {
          id: "trna",
          sol: "BIO.2.d",
          stem: "Which statement correctly describes the job of tRNA in this cell?",
          choices: [
            { letter: "A", text: "It carries the gene's code out of the nucleus to the ribosome" },
            { letter: "B", text: "It unzips the DNA so that the gene can be read" },
            { letter: "C", text: "It brings a specific amino acid to the ribosome to match a codon" },
            { letter: "D", text: "It links together with other tRNAs to form the ribosome" }
          ],
          correct: "C"
        },
        {
          id: "rule",
          sol: "BIO.5.a",
          stem: "The mRNA is built by the same base-pairing rule used in DNA replication, except that —",
          choices: [
            { letter: "A", text: "uracil pairs with adenine in place of thymine" },
            { letter: "B", text: "guanine pairs with adenine instead of cytosine" },
            { letter: "C", text: "the new strand contains the sugar deoxyribose" },
            { letter: "D", text: "both strands of the gene are copied at the same time" }
          ],
          correct: "A"
        },
        {
          id: "history",
          sol: "BIO.5.b",
          stem: "Which piece of evidence in the development of the DNA model most directly supports the idea in sentence 2 that one strand can be copied base by base?",
          choices: [
            { letter: "A", text: "mice that died after receiving a mixture of two bacterial strains" },
            { letter: "B", text: "the double-helix model showing two strands with complementary bases" },
            { letter: "C", text: "radioactive labels showing that virus coats stay outside the cell" },
            { letter: "D", text: "the finding that proteins are built from 20 kinds of amino acids" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- medium · level 2 · BIO.2.d / 5.a / 5.b ---------- */
    {
      id: "dna-codon-chart",
      family: "DNA",
      title: "Reading the Codon Chart",
      kind: "DNA & Proteins · BIO.5 / BIO.2",
      blurb: "Translate a short bacterial mRNA with a partial codon table, start codon and stop codon.",
      level: 2,
      passage: "<p>" + N(1) + "A biotechnology class decodes a short mRNA copied from a gene that a salt-marsh bacterium uses to build part of a salt-pumping protein. " + N(2) + "Each set of three mRNA bases, a <strong>codon</strong>, either specifies one amino acid or signals the ribosome to stop. " + N(3) + "The class uses the portion of the genetic code shown in the table. " + N(4) + "The ribosome begins reading at the first AUG it finds and continues codon by codon until it reaches a stop codon. " + N(5) + "Each tRNA carries an anticodon, three bases that pair with a codon, along with the matching amino acid. " + N(6) + "The mRNA the class must translate reads 5'-GCAUGGGCAAACCAUAAGCU-3'. " + N(7) + "A second group is given the DNA template strand for the same region and must first write the mRNA before translating it.</p><table><tr><th>Codon</th><th>Amino acid</th><th>Codon</th><th>Amino acid</th></tr><tr><td>AUG</td><td>methionine (start)</td><td>GCU</td><td>alanine</td></tr><tr><td>GGC</td><td>glycine</td><td>UGG</td><td>tryptophan</td></tr><tr><td>AAA</td><td>lysine</td><td>UAA</td><td>stop</td></tr><tr><td>CCA</td><td>proline</td><td>UCU</td><td>serine</td></tr></table>",
      claims: [
        {
          id: "translate",
          sol: "BIO.2.d",
          stem: "Using the table, the amino acid chain built from the mRNA in sentence 6 is —",
          choices: [
            { letter: "A", text: "methionine-glycine-lysine-proline" },
            { letter: "B", text: "methionine-glycine-lysine-proline-alanine" },
            { letter: "C", text: "glycine-lysine-proline-alanine" },
            { letter: "D", text: "methionine-tryptophan-lysine-proline" }
          ],
          correct: "A"
        },
        {
          id: "anticodon",
          sol: "BIO.2.d",
          stem: "Pairing base by base with the codon 5'-GGC-3', the anticodon of the tRNA that brings glycine reads —",
          choices: [
            { letter: "A", text: "3'-GGC-5'" },
            { letter: "B", text: "3'-CCG-5'" },
            { letter: "C", text: "3'-CCA-5'" },
            { letter: "D", text: "3'-GGU-5'" }
          ],
          correct: "B"
        },
        {
          id: "vocab",
          sol: "BIO.2.d",
          stem: "In sentence 2, a codon is —",
          choices: [
            { letter: "A", text: "a three-base sequence on tRNA that carries an amino acid" },
            { letter: "B", text: "a single mRNA base that pairs with uracil" },
            { letter: "C", text: "a group of three mRNA bases that specifies an amino acid or a stop" },
            { letter: "D", text: "the section of the ribosome that holds the mRNA in place" }
          ],
          correct: "C"
        },
        {
          id: "alanine",
          sol: "BIO.2.d",
          stem: "Why is alanine not part of the finished chain even though GCU appears in the mRNA?",
          choices: [
            { letter: "A", text: "The ribosome skips any codon that begins with the base G" },
            { letter: "B", text: "Alanine has no matching tRNA in a bacterial cell" },
            { letter: "C", text: "GCU lies before the start codon, so it is never read" },
            { letter: "D", text: "The stop codon UAA comes first, so the chain is released before GCU is reached" }
          ],
          correct: "D"
        },
        {
          id: "template",
          sol: "BIO.5.a",
          stem: "The DNA template strand that was transcribed to make the codon AAA reads —",
          choices: [
            { letter: "A", text: "3'-TTT-5'" },
            { letter: "B", text: "3'-UUU-5'" },
            { letter: "C", text: "3'-AAA-5'" },
            { letter: "D", text: "3'-AAT-5'" }
          ],
          correct: "A"
        },
        {
          id: "pairing",
          sol: "BIO.5.b",
          stem: "The second group relies on the fact that the two DNA strands are complementary. Which evidence first pointed to complementary base pairing?",
          choices: [
            { letter: "A", text: "mice that were transformed by a mixture of bacterial strains" },
            { letter: "B", text: "radioactive labels that tracked virus DNA into bacteria" },
            { letter: "C", text: "measurements showing that A equals T and G equals C in DNA" },
            { letter: "D", text: "the discovery that tRNA carries an anticodon" }
          ],
          correct: "C"
        }
      ]
    },

    /* ---------- long · level 3 · BIO.2.d / 5.a / 5.b ---------- */
    {
      id: "dna-one-base-off",
      family: "DNA",
      title: "One Base Off",
      kind: "DNA & Proteins · BIO.5 / BIO.2",
      blurb: "A substitution and an insertion in a mussel gene have very different effects on the protein.",
      level: 3,
      passage: "<p>" + N(1) + "A research group studies a small protein that helps a freshwater mussel attach to rocks in the Shenandoah River. " + N(2) + "The normal gene produces the mRNA 5'-AUGCAUUCUGGCAAAUAG-3', which is translated using the codons in the table. " + N(3) + "Mussels from two sites carry altered versions of the gene. " + N(4) + "In the site-A version, the seventh base of the mRNA has changed from U to C, a <strong>substitution</strong>. " + N(5) + "In the site-B version, an extra U has been inserted after the twelfth base, an <strong>insertion</strong>. " + N(6) + "Because the ribosome reads the mRNA in non-overlapping groups of three starting at the start codon, an insertion shifts every codon after it, a change called a frameshift. " + N(7) + "The group notices that some substitutions do not change the protein at all, because several different codons can specify the same amino acid. " + N(8) + "Mussels with the site-B protein attach poorly and are often swept away in floods. " + N(9) + "The group also confirms that both changes originated in the DNA and were copied into every cell of the mussel, rather than being introduced when the mRNA was made.</p><table><tr><th>Codon</th><th>Amino acid</th><th>Codon</th><th>Amino acid</th></tr><tr><td>AUG</td><td>methionine (start)</td><td>CCU</td><td>proline</td></tr><tr><td>CAU</td><td>histidine</td><td>AAA</td><td>lysine</td></tr><tr><td>UCU</td><td>serine</td><td>UAA</td><td>stop</td></tr><tr><td>GGC</td><td>glycine</td><td>UAG</td><td>stop</td></tr></table>",
      claims: [
        {
          id: "normal",
          sol: "BIO.2.d",
          stem: "The amino acid chain made from the normal mRNA in sentence 2 is —",
          choices: [
            { letter: "A", text: "methionine-histidine-serine-glycine-lysine" },
            { letter: "B", text: "methionine-histidine-proline-glycine-lysine" },
            { letter: "C", text: "methionine-histidine-serine-glycine" },
            { letter: "D", text: "methionine-proline-serine-glycine-lysine" }
          ],
          correct: "A"
        },
        {
          id: "sitea",
          sol: "BIO.2.d",
          stem: "The site-A substitution changes the protein by —",
          choices: [
            { letter: "A", text: "ending the chain one amino acid early" },
            { letter: "B", text: "shifting every codon that follows it" },
            { letter: "C", text: "adding an extra amino acid at the third position" },
            { letter: "D", text: "replacing serine with proline at the third position" }
          ],
          correct: "D"
        },
        {
          id: "siteb",
          sol: "BIO.2.d",
          stem: "Using the table, the site-B mRNA produces a chain that —",
          choices: [
            { letter: "A", text: "is identical to the normal chain but one amino acid longer" },
            { letter: "B", text: "has lysine replaced by a different amino acid" },
            { letter: "C", text: "ends after glycine because the shifted frame reads UAA as a stop" },
            { letter: "D", text: "has every amino acid after methionine replaced" }
          ],
          correct: "C"
        },
        {
          id: "two",
          sol: "BIO.2.d",
          stem: "Select TWO statements that correctly describe the terms in sentences 4 and 5.",
          choices: [
            { letter: "A", text: "A substitution keeps the total number of bases in the mRNA the same" },
            { letter: "B", text: "An insertion changes the reading frame of every codon after it" },
            { letter: "C", text: "A substitution always changes the amino acid at that position" },
            { letter: "D", text: "An insertion changes only the single codon where it occurs" }
          ],
          correct: ["A", "B"]
        },
        {
          id: "history",
          sol: "BIO.5.b",
          stem: "Which finding established that the instructions for a protein such as this one are stored in DNA rather than in protein?",
          choices: [
            { letter: "A", text: "Mussels with a damaged protein attach poorly to rocks" },
            { letter: "B", text: "X-ray images showed that proteins form a double helix" },
            { letter: "C", text: "Chargaff found equal amounts of each amino acid in proteins" },
            { letter: "D", text: "Virus DNA, not virus protein, entered infected bacteria" }
          ],
          correct: "D"
        },
        {
          id: "copied",
          sol: "BIO.5.a",
          stem: "Which statement best explains why every cell of a site-B mussel carries the insertion (sentence 9)?",
          choices: [
            { letter: "A", text: "The altered mRNA was passed from cell to cell as the mussel grew" },
            { letter: "B", text: "The altered DNA was copied by base pairing each time a cell replicated its DNA before dividing" },
            { letter: "C", text: "tRNA carried the extra base into the nucleus of each new cell" },
            { letter: "D", text: "Ribosomes rebuilt the altered DNA from the faulty protein" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- long · level 2 · BIO.2.d / 5.a / 5.b ---------- */
    {
      id: "dna-human-gene-bacteria",
      family: "DNA",
      title: "A Human Gene in Bacteria",
      kind: "DNA & Proteins · BIO.5 / BIO.2",
      blurb: "Bacteria build a human hormone because codons mean the same thing in both organisms.",
      level: 2,
      passage: "<p>" + N(1) + "A pharmaceutical lab in Richmond produces a human hormone by inserting the human gene into a bacterium. " + N(2) + "The bacterium's ribosomes read the human mRNA and build the same chain of amino acids that human cells would build. " + N(3) + "This works because the <strong>genetic code</strong>, the set of rules matching each codon to an amino acid, is nearly the same in every organism studied, from bacteria to oak trees to people. " + N(4) + "To confirm the product, technicians compare the first four amino acids of the bacterial protein with the human version. " + N(5) + "The human mRNA for that region reads 5'-AUGUUUGAUUGG-3'. " + N(6) + "The technicians also check that each tRNA anticodon in the bacterium matches the same codon it would match in a human cell. " + N(7) + "The table lists the tRNA molecules involved. " + N(8) + "A second batch was made from a copy of the gene in which the fourth codon had become UGA, and the technicians found that the protein was far shorter than expected. " + N(9) + "The lab notes that a shared code is also strong evidence that living things descend from common ancestors, since codes that arose separately would be unlikely to match.</p><table><tr><th>tRNA anticodon (3' to 5')</th><th>mRNA codon paired</th><th>Amino acid carried</th></tr><tr><td>UAC</td><td>AUG</td><td>methionine</td></tr><tr><td>AAA</td><td>UUU</td><td>phenylalanine</td></tr><tr><td>CUA</td><td>GAU</td><td>aspartic acid</td></tr><tr><td>ACC</td><td>UGG</td><td>tryptophan</td></tr><tr><td>(no tRNA)</td><td>UGA</td><td>none: stop signal</td></tr></table>",
      claims: [
        {
          id: "four",
          sol: "BIO.2.d",
          stem: "According to the table, the first four amino acids of the hormone are —",
          choices: [
            { letter: "A", text: "methionine, phenylalanine, aspartic acid, tryptophan" },
            { letter: "B", text: "methionine, phenylalanine, tryptophan, aspartic acid" },
            { letter: "C", text: "tyrosine, lysine, leucine, threonine" },
            { letter: "D", text: "methionine, lysine, aspartic acid, tryptophan" }
          ],
          correct: "A"
        },
        {
          id: "anticodon",
          sol: "BIO.2.d",
          stem: "The tRNA that pairs with the codon for tryptophan carries the anticodon —",
          choices: [
            { letter: "A", text: "3'-UAC-5'" },
            { letter: "B", text: "3'-ACC-5'" },
            { letter: "C", text: "3'-AAA-5'" },
            { letter: "D", text: "3'-UGG-5'" }
          ],
          correct: "B"
        },
        {
          id: "vocab",
          sol: "BIO.2.d",
          stem: "In sentence 3, the genetic code refers to —",
          choices: [
            { letter: "A", text: "the sequence of bases in one particular gene" },
            { letter: "B", text: "the number of chromosomes found in a species" },
            { letter: "C", text: "the set of tRNA molecules present in a cell" },
            { letter: "D", text: "the rules that match each codon to an amino acid or a stop" }
          ],
          correct: "D"
        },
        {
          id: "short",
          sol: "BIO.2.d",
          stem: "Which statement best explains the short protein in sentence 8?",
          choices: [
            { letter: "A", text: "The bacterium lacked the tRNA for tryptophan and skipped that codon" },
            { letter: "B", text: "The mRNA could not leave the nucleus of the bacterium" },
            { letter: "C", text: "UGA is a stop codon, so translation ended after three amino acids" },
            { letter: "D", text: "UGA codes for a very small amino acid that shortens the chain" }
          ],
          correct: "C"
        },
        {
          id: "model",
          sol: "BIO.5.b",
          stem: "The lab assumes the human gene and the bacterial chromosome share the same double-helix structure. Which evidence led to that model?",
          choices: [
            { letter: "A", text: "radioactive labels showing that protein enters bacteria" },
            { letter: "B", text: "X-ray diffraction patterns of DNA fibers combined with Chargaff's base ratios" },
            { letter: "C", text: "mice that died after receiving heat-killed bacteria alone" },
            { letter: "D", text: "codon tables showing which amino acid each codon specifies" }
          ],
          correct: "B"
        },
        {
          id: "join",
          sol: "BIO.5.a",
          stem: "Which feature of DNA makes it possible to join a human gene into a bacterial DNA molecule?",
          choices: [
            { letter: "A", text: "Both are built from the same four nucleotides linked by a sugar-phosphate backbone" },
            { letter: "B", text: "Human DNA is single-stranded and slides between the bacterial strands" },
            { letter: "C", text: "Human DNA contains uracil, which bacterial enzymes can read" },
            { letter: "D", text: "Bacterial DNA has no bases of its own until a gene is added" }
          ],
          correct: "A"
        }
      ]
    },

    /* ---------- tiny · level 1 · BIO.5.a / 2.d ---------- */
    {
      id: "dna-packing-the-blueprint",
      family: "DNA",
      title: "Packing the Blueprint",
      kind: "DNA & Proteins · BIO.5 / BIO.2",
      blurb: "Two meters of DNA fit in a nucleus by coiling into chromosomes.",
      level: 1,
      passage: "<p>" + N(1) + "The DNA in one human nucleus, stretched out, would be about two meters long, yet the nucleus is only a few micrometers wide. " + N(2) + "The DNA is wound around proteins and coiled into 46 <strong>chromosomes</strong>. " + N(3) + "Each chromosome carries hundreds to thousands of genes. " + N(4) + "A gene is a stretch of DNA whose base sequence holds the instructions for one protein. " + N(5) + "Before a cell divides, each chromosome is copied.</p>",
      claims: [
        {
          id: "vocab",
          sol: "BIO.5.a",
          stem: "In sentence 2, a chromosome is best described as —",
          choices: [
            { letter: "A", text: "a single gene that codes for one protein" },
            { letter: "B", text: "a protein that unzips the DNA before copying" },
            { letter: "C", text: "a long DNA molecule wound around proteins and coiled tightly" },
            { letter: "D", text: "a strand of mRNA on its way out of the nucleus" }
          ],
          correct: "C"
        },
        {
          id: "why",
          sol: "BIO.5.a",
          stem: "Which statement best explains why DNA is coiled as described in sentence 2?",
          choices: [
            { letter: "A", text: "Coiling changes the base sequence so that more genes fit" },
            { letter: "B", text: "Coiling makes the DNA single-stranded so it can be read" },
            { letter: "C", text: "Coiling protects the DNA from ever being copied" },
            { letter: "D", text: "Coiling lets two meters of DNA fit inside a tiny nucleus" }
          ],
          correct: "D"
        },
        {
          id: "gene",
          sol: "BIO.2.d",
          stem: "According to sentence 4, the instructions in a gene are stored in —",
          choices: [
            { letter: "A", text: "the order of its bases" },
            { letter: "B", text: "the number of its phosphate groups" },
            { letter: "C", text: "the shape of its proteins" },
            { letter: "D", text: "the length of its sugars" }
          ],
          correct: "A"
        },
        {
          id: "copy",
          sol: "BIO.5.a",
          stem: "The copying in sentence 5 is called —",
          choices: [
            { letter: "A", text: "transcription, and it produces a strand of mRNA" },
            { letter: "B", text: "replication, and it produces two identical DNA molecules" },
            { letter: "C", text: "translation, and it produces a chain of amino acids" },
            { letter: "D", text: "transformation, and it moves DNA between cells" }
          ],
          correct: "B"
        },
        {
          id: "number",
          sol: "BIO.5.a",
          stem: "After the chromosomes are copied and the cell divides once, each daughter cell contains —",
          choices: [
            { letter: "A", text: "23 chromosomes" },
            { letter: "B", text: "46 chromosomes" },
            { letter: "C", text: "92 chromosomes" },
            { letter: "D", text: "2 chromosomes" }
          ],
          correct: "B"
        }
      ]
    }
  ];

  for (var i = 0; i < PACKS.length; i++) P.push(PACKS[i]);
})(typeof window !== "undefined" ? window : global);
