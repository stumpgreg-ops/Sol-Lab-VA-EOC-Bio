# SOL Lab — Biology question bank (teacher review copy)

Every lab-notes pack and question in the game, grouped by unit and difficulty level, with the answer key and the 2018 Virginia Biology SOL code each item is tagged with. Generated from `js/content*.js` by `node tools/question-bank.js`; edit the pack files, not this page.

**Totals:** 90 packs · 510 questions · level 1: 169 · level 2: 197 · level 3: 144

## How the game chooses questions for a student

- Every pack carries a **level** tag: 1 (one-step recall or a direct read of the table), 2 (a typical EOC item: apply a concept or read a trend), 3 (multi-step reasoning, mechanism, prediction from a model, or a Select TWO).
- Each student's Chromebook keeps an **ability** score per unit that starts at 1.6 (between levels 1 and 2). A question answered with no wrong letter grabbed nudges it up by 0.12; grabbing a wrong letter drops it by 0.18. The picker weights every candidate by how close its level is to the ability score, so an **average high-school student** (ability settling around 2) draws mostly level 2 packs, with level 1 and 3 packs mixed in at lower weight.
- On All-skills levels the picker also leans toward the standards the student has missed most, and it prefers lab notes near the level's target length (short notes early, longer notes later).
- The HUD shows the current tag as `SOL · BIO.8.a · Level 2`.

**The list under "Level 2" in each unit is therefore the core of what an average student sees; level 1 is the floor for a struggling student and level 3 the stretch for a strong one.**

## Contents

- Scientific Investigation (BIO.1): 11 packs, 62 questions
- Biochemistry (BIO.2): 11 packs, 63 questions
- Cell Structure & Function (BIO.3): 11 packs, 63 questions
- Bacteria & Viruses (BIO.4): 11 packs, 61 questions
- Genetics & Heredity (BIO.5): 11 packs, 63 questions
- DNA & Protein Synthesis (BIO.2 · BIO.5): 11 packs, 63 questions
- Evolution & Classification (BIO.6 · BIO.7): 12 packs, 66 questions
- Ecology (BIO.8): 12 packs, 69 questions


---

# Scientific Investigation (BIO.1)

Standards in this unit:

- BIO.1.a — asking questions and defining problems
- BIO.1.b — planning and carrying out investigations
- BIO.1.c — interpreting, analyzing, and evaluating data
- BIO.1.d — constructing and critiquing conclusions and explanations
- BIO.1.e — developing and using models
- BIO.1.f — obtaining, evaluating, and communicating information


## Level 1 — foundation

### Catalase and temperature  
`inv-catalase-liver` · Investigation · BIO.1 · level 1 · 74 words · 5 questions

> (1) A student tested how temperature affects the enzyme **catalase**, which breaks hydrogen peroxide into water and oxygen. (2) She placed a 1 g cube of beef liver in 10 mL of hydrogen peroxide at four temperatures and counted the oxygen bubbles released in one minute. (3) Each temperature was tested three times, and the averages are shown in the table.
> 
> | Water bath (°C) | Bubbles per minute (average) |
> |---|---|
> | 10 | 6 |
> | 25 | 19 |
> | 37 | 31 |
> | 60 | 2 |

1. **[BIO.1.b]** In this investigation, the dependent variable is —
   - A. the number of oxygen bubbles released per minute
   - B. the temperature of the water bath for each trial
   - C. the mass of the beef liver cube in each tube
   - D. the volume of hydrogen peroxide in each tube
   - **Key: A**

2. **[BIO.1.c]** Which statement about the data in the table is accurate?
   - A. Bubble production rose steadily at every temperature tested.
   - B. Bubble production was highest at 37 °C and dropped sharply at 60 °C.
   - C. The enzyme released the most bubbles at the lowest temperature.
   - D. Bubble production at 25 °C was twice the rate seen at 37 °C.
   - **Key: B**

3. **[BIO.1.d]** Which conclusion is best supported by the results?
   - A. Catalase is destroyed by any temperature above 25 °C.
   - B. Hydrogen peroxide breaks down fastest in cold water.
   - C. Catalase works best near body temperature and slows at high temperature.
   - D. The mass of the liver cube controls how fast the reaction runs.
   - **Key: C**

4. **[BIO.1.b]** Why did the student test each temperature three times?
   - A. to change the independent variable more often
   - B. to make the reaction produce more bubbles
   - C. to keep the volume of hydrogen peroxide the same
   - D. to reduce the effect of random error on the averages
   - **Key: D**

5. **[BIO.1.f]** Based on sentence 1, catalase is best described as —
   - A. a substrate that is broken into water and oxygen
   - B. an enzyme that speeds the breakdown of hydrogen peroxide
   - C. a gas that is released by warm beef liver
   - D. the temperature at which a reaction stops
   - **Key: B**

### Pill bugs in a choice chamber  
`inv-pillbug-chamber` · Investigation · BIO.1 · level 1 · 69 words · 5 questions

> (1) A class asked whether pill bugs prefer damp or dry surroundings. (2) They joined two petri dishes with a tunnel to make a **choice chamber**: one dish held damp paper towel, the other dry. (3) Ten pill bugs were released in the tunnel and counted in each dish every two minutes for ten minutes. (4) At the final count, eight were on the damp side and two on the dry side.

1. **[BIO.1.a]** Which question is this investigation designed to answer?
   - A. Do pill bugs move faster in the dark than in the light?
   - B. Do pill bugs choose damp areas over dry areas?
   - C. How many pill bugs can live in a single petri dish?
   - D. Does paper towel change how long pill bugs live?
   - **Key: B**

2. **[BIO.1.b]** Which change to the setup would make the results harder to interpret?
   - A. placing a lamp over only the dry dish
   - B. using ten pill bugs instead of five
   - C. counting the pill bugs every two minutes
   - D. lining both dishes with the same brand of towel
   - **Key: A**

3. **[BIO.1.c]** According to sentence 4, what percentage of the pill bugs were on the damp side at the final count?
   - A. 20 percent
   - B. 50 percent
   - C. 80 percent
   - D. 100 percent
   - **Key: C**

4. **[BIO.1.d]** Which conclusion do the results best support?
   - A. Pill bugs cannot survive on dry paper towel.
   - B. Pill bugs choose damp or dry places at random.
   - C. Damp paper towel attracts pill bugs by its smell.
   - D. Pill bugs tend to gather in damp areas.
   - **Key: D**

5. **[BIO.1.b]** The purpose of the tunnel in the choice chamber is to —
   - A. keep the dry dish from drying out further
   - B. let the pill bugs move freely between both conditions
   - C. hold the pill bugs still while they are counted
   - D. raise the temperature of the damp dish
   - **Key: B**

### Yeast, sugar and balloons  
`inv-yeast-sugar` · Investigation · BIO.1 · level 1 · 100 words · 6 questions

> (1) A student investigated which sugar yeast ferments fastest. (2) He mixed one packet of dry yeast with 100 mL of warm water in each of four bottles and added 10 g of glucose, sucrose, lactose, or no sugar. (3) A balloon was stretched over each bottle to trap the carbon dioxide produced by **fermentation**. (4) After 30 minutes he measured the circumference of each balloon with a string. (5) The bottle with no sugar served as the control. (6) He repeated the whole procedure twice more and averaged the results.
> 
> | Sugar added | Balloon circumference (cm), average |
> |---|---|
> | None | 0 |
> | Glucose | 24 |
> | Sucrose | 21 |
> | Lactose | 3 |

1. **[BIO.1.b]** What was the independent variable in the yeast investigation?
   - A. the type of sugar added to each bottle
   - B. the circumference of each balloon
   - C. the amount of warm water in each bottle
   - D. the number of yeast packets used
   - **Key: A**

2. **[BIO.1.b]** What was the purpose of the bottle with no sugar?
   - A. to show the largest balloon size that was possible
   - B. to show how much gas yeast makes without added sugar
   - C. to test whether warm water alone can inflate a balloon
   - D. to check whether lactose is really a sugar
   - **Key: B**

3. **[BIO.1.c]** Of the three sugars tested, which was fermented the least?
   - A. glucose
   - B. sucrose
   - C. lactose
   - D. all three were fermented equally
   - **Key: C**

4. **[BIO.1.d]** Which conclusion is best supported by the table?
   - A. Yeast is able to use glucose but no other sugar at all.
   - B. Yeast fermented glucose and sucrose readily but lactose very little.
   - C. Larger balloons trap more yeast cells than smaller ones do.
   - D. Lactose completely stops yeast from producing carbon dioxide.
   - **Key: B**

5. **[BIO.1.e]** Which statement describes a limit of using balloon circumference to represent gas production?
   - A. The balloon measures only the gas that came from the control bottle.
   - B. A balloon stops stretching once carbon dioxide begins to enter it.
   - C. Circumference is an indirect measure, since balloons stretch unevenly.
   - D. Yeast cells pass through the rubber and change the reading.
   - **Key: C**

6. **[BIO.1.a]** Which new question follows most naturally from these results?
   - A. Does the color of the balloon affect how far it stretches?
   - B. Does a longer string give a more accurate circumference?
   - C. Which brand of bottle holds the most warm water?
   - D. Does temperature change how fast yeast ferments sucrose?
   - **Key: D**

### Hand washing on agar plates  
`inv-handwash-plates` · Investigation · BIO.1 · level 1 · 150 words · 6 questions

> (1) A microbiology class tested whether the length of hand washing changes the number of bacteria on the skin. (2) Four volunteers each pressed the fingertips of one hand onto a nutrient agar plate before washing. (3) They then washed with the same soap for 5, 10, 20, or 40 seconds, dried with a clean paper towel, and pressed the fingertips of the same hand onto a second plate. (4) The plates were sealed, labeled, and kept upside down in a 37 °C **incubator** for 48 hours. (5) Bacteria that landed on the agar grew into visible spots called colonies, and the class counted the colonies on each plate. (6) The results are shown in the table. (7) One student pointed out that each volunteer's hands may have carried different numbers of bacteria to begin with.
> 
> | Wash time (s) | Colonies before washing | Colonies after washing |
> |---|---|---|
> | 5 | 140 | 96 |
> | 10 | 132 | 61 |
> | 20 | 145 | 22 |
> | 40 | 138 | 9 |

1. **[BIO.1.b]** Which variable was deliberately changed by the class?
   - A. the number of colonies on each plate
   - B. the length of time each volunteer washed
   - C. the temperature of the incubator
   - D. the kind of soap that was used
   - **Key: B**

2. **[BIO.1.b]** Why was each volunteer's hand printed on a plate before washing?
   - A. to sterilize the fingertips before the test
   - B. to warm the agar before incubation
   - C. to give a starting count for comparison
   - D. to add extra bacteria to the second plate
   - **Key: C**

3. **[BIO.1.c]** According to the table, which wash time left the fewest colonies?
   - A. 5 seconds
   - B. 10 seconds
   - C. 20 seconds
   - D. 40 seconds
   - **Key: D**

4. **[BIO.1.d]** Which conclusion is best supported by the colony counts?
   - A. Washing for 5 seconds removed most of the bacteria.
   - B. Longer washing removed a greater share of the bacteria.
   - C. Washing added bacteria to the hands of some volunteers.
   - D. The incubator killed the bacteria on the 40-second plate.
   - **Key: B**

5. **[BIO.1.c]** The concern raised in sentence 7 is important because —
   - A. differences between volunteers, not just wash time, could affect the result
   - B. bacteria from different volunteers cannot grow on the same kind of agar
   - C. the incubator was not large enough to hold all of the plates at once
   - D. colony counts are always lower on the plate made before washing
   - **Key: A**

6. **[BIO.1.b]** In sentence 4, the incubator is used to —
   - A. keep the plates at a steady warm temperature so colonies grow
   - B. kill any bacteria that were pressed onto the plates
   - C. count the colonies on each plate automatically
   - D. dry out the agar so that the plates can be stored
   - **Key: A**


## Level 2 — average student (core)

### Road salt and radish seeds  
`inv-seed-salt` · Investigation · BIO.1 · level 2 · 84 words · 5 questions

> (1) A student tested whether road salt affects the germination of radish seeds. (2) She soaked paper towels in salt solutions of 0, 5, 10 and 20 grams per liter, placed 20 seeds on each towel, and sealed each in a plastic bag. (3) After five days she counted the seeds that had sprouted. (4) Her hypothesis was that higher salt concentrations would lower the **germination rate**.
> 
> | Salt (g/L) | Seeds sprouted (of 20) | Germination (%) |
> |---|---|---|
> | 0 | 18 | 90 |
> | 5 | 15 | 75 |
> | 10 | 10 | 50 |
> | 20 | 2 | 10 |

1. **[BIO.1.b]** Which of these is a controlled variable in this investigation?
   - A. the salt concentration of each solution
   - B. the number of seeds that sprouted
   - C. the germination rate after five days
   - D. the number of seeds placed on each towel
   - **Key: D**

2. **[BIO.1.c]** Between which two salt concentrations did the germination rate drop the most?
   - A. 0 and 5 g/L
   - B. 5 and 10 g/L
   - C. 10 and 20 g/L
   - D. the drop was equal at each step
   - **Key: C**

3. **[BIO.1.d]** Do the results support the student's hypothesis?
   - A. Yes, because germination fell as the salt concentration rose.
   - B. Yes, because every bag had at least two sprouted seeds.
   - C. No, because the 0 g/L bag did not reach 100 percent.
   - D. No, because the seeds were sealed inside plastic bags.
   - **Key: A**

4. **[BIO.1.f]** Which format would best communicate the trend in these results to the class?
   - A. a pie chart showing the total number of seeds used
   - B. a bar graph of germination percentage for each salt level
   - C. a written list of the materials and what they cost
   - D. a close-up photograph of a single sprouted seed
   - **Key: B**

5. **[BIO.1.c]** In sentence 4, the germination rate refers to —
   - A. the number of days a seed takes to sprout
   - B. the mass of salt dissolved in each liter
   - C. the share of seeds that sprouted in a set time
   - D. the length of the root after five days
   - **Key: C**

### Transpiration on a potometer  
`inv-transpiration-fan` · Investigation · BIO.1 · level 2 · 104 words · 5 questions

> (1) A group measured **transpiration**, the loss of water vapor from leaves, using a potometer: a leafy stem sealed into a water-filled tube with a scale. (2) As the leaves lose water, an air bubble moves along the tube; the distance it travels in ten minutes shows the water taken up. (3) The group tested the same stem under four conditions in turn: still room air, a fan, a lamp, and a clear plastic bag over the leaves. (4) On their bar graph the fan bar was tallest, the lamp bar slightly shorter, the still-air bar about half the fan bar, and the plastic-bag bar the shortest.

1. **[BIO.1.b]** Which practice strengthened the design of this investigation?
   - A. using the same stem for every condition
   - B. testing the fan before the lamp
   - C. sealing the stem into a tube of water
   - D. reading the graph after ten minutes
   - **Key: A**

2. **[BIO.1.c]** Under which condition did the stem take up the least water?
   - A. still room air
   - B. the fan
   - C. the lamp
   - D. the plastic bag
   - **Key: D**

3. **[BIO.1.d]** Which explanation best accounts for the fan result?
   - A. Moving air cooled the leaves, which slowed the rate of transpiration.
   - B. Moving air swept water vapor away from the leaves, speeding transpiration.
   - C. The fan forced extra water up the tube and into the cut stem.
   - D. The fan blew directly on the air bubble and pushed it along the tube.
   - **Key: B**

4. **[BIO.1.e]** The potometer models transpiration by assuming that —
   - A. water taken up equals water lost by the leaves
   - B. the plant uses all absorbed water for photosynthesis
   - C. the air bubble stops moving when leaves are wet
   - D. light has no effect on the movement of the bubble
   - **Key: A**

5. **[BIO.1.c]** Based on the graph, roughly how did the still-air rate compare with the fan rate?
   - A. it was about twice the fan rate
   - B. it was about the same as the fan rate
   - C. it was about half the fan rate
   - D. it was lower than the plastic-bag rate
   - **Key: C**

### Goose Run above and below the pasture  
`inv-creek-pasture` · Investigation · BIO.1 · level 2 · 102 words · 6 questions

> (1) An environmental science class sampled Goose Run, a small creek in the Shenandoah Valley, to see whether a cattle pasture changes water quality. (2) They chose one site upstream of the pasture and one site 200 m downstream, and at each site they measured **dissolved oxygen**, water temperature, and nitrate on the same afternoon. (3) Each measurement was taken three times and averaged. (4) Cattle had direct access to the creek along the pasture. (5) The class predicted that the downstream site would have more nitrate and less oxygen.
> 
> | Measurement | Upstream | Downstream |
> |---|---|---|
> | Dissolved oxygen (mg/L) | 8.6 | 5.1 |
> | Temperature (°C) | 17 | 21 |
> | Nitrate (mg/L) | 0.4 | 3.2 |

1. **[BIO.1.a]** The problem the class set out to study was whether —
   - A. cattle drink more water on warm afternoons
   - B. a pasture affects the water quality of the creek
   - C. nitrate raises the temperature of creek water
   - D. Goose Run flows faster upstream than downstream
   - **Key: B**

2. **[BIO.1.b]** Why did the class take all readings on the same afternoon?
   - A. so that the cattle would be standing in the creek at the time
   - B. to make the downstream readings larger than the upstream ones
   - C. to keep weather and time of day from affecting the comparison
   - D. because the oxygen meter only works when the water is warm
   - **Key: C**

3. **[BIO.1.c]** Which measurement showed the largest change relative to its upstream value?
   - A. dissolved oxygen
   - B. water temperature
   - C. nitrate
   - D. all three changed by the same factor
   - **Key: C**

4. **[BIO.1.d]** Which conclusion is best supported by the data?
   - A. The pasture is the only source of nitrate in the creek.
   - B. Warmer water upstream caused the oxygen level to drop.
   - C. The creek has no fish downstream of the pasture.
   - D. Water quality was lower downstream of the pasture.
   - **Key: D**

5. **[BIO.1.c]** Which statement is a valid criticism of the class's conclusion that the pasture caused the changes?
   - A. The class should have sampled a single site rather than two.
   - B. Another source between the sites, not the pasture, could explain the change.
   - C. Nitrate readings cannot be taken from flowing creek water.
   - D. Averaging three readings hides the true highest value at each site.
   - **Key: B**

6. **[BIO.1.f]** Which action would best let other scientists check the class's findings?
   - A. publishing the method, site locations and all raw readings
   - B. reporting only the averages that supported the prediction
   - C. keeping the site locations secret to protect the creek
   - D. rounding every reading to the nearest whole number
   - **Key: A**

### Daphnia heart rate and caffeine  
`inv-daphnia-caffeine` · Investigation · BIO.1 · level 2 · 156 words · 6 questions

> (1) _Daphnia_, a tiny freshwater crustacean, has a clear body, so its heart can be seen beating under a microscope. (2) A student asked how caffeine affects the heart rate of _Daphnia_. (3) She placed one animal on a slide in a drop of pond water, counted heartbeats for 15 seconds, and multiplied by four to get beats per minute. (4) She then replaced the pond water with caffeine solutions of 0.1, 0.5, and 1.0 percent, waiting two minutes and counting again after each change. (5) She repeated the procedure with four other animals. (6) Her line graph shows average heart rate rising from about 180 beats per minute in pond water to about 260 at 1.0 percent caffeine, with the steepest rise between 0.1 and 0.5 percent. (7) One animal's heart rate at 0.5 percent was far above the other four, and she marked it as an **outlier**. (8) The lamp on the microscope warmed the slide during the trials.

1. **[BIO.1.b]** Why did the student multiply the 15-second count by four?
   - A. to correct for the warming of the slide
   - B. to convert the count to beats per minute
   - C. to average the results of four animals
   - D. to account for four caffeine concentrations
   - **Key: B**

2. **[BIO.1.c]** Between which two concentrations did the heart rate rise the fastest?
   - A. 0.1 and 0.5 percent
   - B. pond water and 0.1 percent
   - C. 0.5 and 1.0 percent
   - D. the rise was the same at every step
   - **Key: A**

3. **[BIO.1.c]** In sentence 7, the outlier is —
   - A. the average of all five animals
   - B. the heart rate measured with no caffeine
   - C. a value far from the rest of the data
   - D. the highest concentration tested
   - **Key: C**

4. **[BIO.1.d]** Which statement best explains why the warming lamp weakens the conclusion?
   - A. Warmth could raise the heart rate on its own, so caffeine may not be the only cause.
   - B. Warmth always slows the heart, so the caffeine effect was hidden by the lamp.
   - C. A warm slide makes the heart of Daphnia much harder to see clearly.
   - D. The heat from the lamp broke the caffeine down into other chemicals.
   - **Key: A**

5. **[BIO.1.b]** Which change would best address the problem described in sentence 8?
   - A. counting the heartbeats for a full 30 seconds instead of 15
   - B. using a much stronger caffeine solution for the final trial
   - C. testing a single animal many times instead of five animals
   - D. keeping the slide at a steady temperature with a cool light
   - **Key: D**

6. **[BIO.1.a]** Which hypothesis was the student most likely testing?
   - A. If pond water is replaced, then Daphnia will stop moving.
   - B. If caffeine concentration increases, then Daphnia heart rate will increase.
   - C. If the lamp is turned on, then the slide will become warmer.
   - D. If more animals are tested, then the average heart rate will fall.
   - **Key: B**


## Level 3 — stretch

### Three oyster reefs, three densities  
`inv-oyster-reef` · Investigation · BIO.1 · level 3 · 148 words · 6 questions

> (1) Volunteers with a Chesapeake Bay restoration group built three oyster reefs in a tidal creek in 2021 by placing recycled shell on the bottom. (2) Each reef received young oysters, called spat, at a different density: 100, 300, or 600 per square meter. (3) Every summer, divers counted the live oysters in five 0.25 m² quadrats on each reef and scaled the counts to one square meter. (4) The group also uses a simple **model** that treats each adult oyster as a filter cleaning about 50 liters of water per day. (5) The table shows the average live oysters per square meter. (6) A student noted that the 600 reef sits nearer the creek mouth, where the water is saltier and moves faster. (7) The group wants to recommend one starting density for future reefs.
> 
> | Starting spat (per m²) | Live oysters 2022 | Live oysters 2024 |
> |---|---|---|
> | 100 | 62 | 48 |
> | 300 | 180 | 155 |
> | 600 | 210 | 120 |

1. **[BIO.1.c]** Which reef had the most live oysters per square meter in 2024?
   - A. the 100 reef
   - B. the 300 reef
   - C. the 600 reef
   - D. all three were about equal
   - **Key: B**

2. **[BIO.1.b]** Select TWO reasons the comparison among the three reefs is weaker than it could be.
   - A. Only one reef was built at each density, so nothing was replicated.
   - B. The divers counted oysters in quadrats instead of counting every one.
   - C. The 600 reef differs in location and water flow, not just density.
   - D. The counts were converted from quadrats to one square meter.
   - **Key: A and C**

3. **[BIO.1.e]** Using the group's model, about how much water would one square meter of the 300 reef filter per day in 2024?
   - A. about 155 liters
   - B. about 3,100 liters
   - C. about 7,750 liters
   - D. about 15,500 liters
   - **Key: C**

4. **[BIO.1.d]** Which conclusion about the 600 reef is best supported by the table?
   - A. It gained live oysters steadily between 2022 and 2024.
   - B. It had fewer live oysters than the 100 reef by 2024.
   - C. It held the most live oysters in both 2022 and 2024.
   - D. It lost the largest share of its oysters between 2022 and 2024.
   - **Key: D**

5. **[BIO.1.e]** Which statement describes a limitation of the filtering model?
   - A. It assumes every oyster is an adult filtering at the same steady rate.
   - B. It counts only the oysters that died between the two surveys.
   - C. It applies only to reefs that were built near the creek mouth.
   - D. It requires the divers to count every oyster on the reef.
   - **Key: A**

6. **[BIO.1.d]** Based on all the evidence, which recommendation should the group make?
   - A. Use 600 spat per square meter, since that reef started with the most oysters.
   - B. Use 300 spat per square meter, while noting the differences in reef location.
   - C. Stop building reefs, since every reef lost oysters between 2022 and 2024.
   - D. Use 100 spat per square meter, since that reef lost the fewest oysters.
   - **Key: B**

### Modeling brook trout habitat  
`inv-trout-stream-model` · Investigation · BIO.1 · level 3 · 200 words · 6 questions

> (1) Brook trout, Virginia's native freshwater trout, need cold, well-oxygenated streams and begin to die when water stays above about 21 °C for several days. (2) A fisheries team built a computer **model** to predict how many stream kilometers in a Blue Ridge watershed will remain suitable for brook trout as summers warm. (3) The model divides the watershed into 1 km segments and, for each segment, uses elevation, the amount of shade from streamside trees, and the average July air temperature to estimate July water temperature. (4) A segment is counted as suitable if its estimated water temperature stays below 20 °C. (5) To test the model, the team compared its estimates with temperature loggers placed in 30 segments during one July. (6) The model's estimates were within 1 °C of the logger readings in 26 segments, but in 4 low-elevation segments it predicted temperatures 2 to 3 °C cooler than measured. (7) Under a scenario in which July air temperature rises 2 °C, the model predicts suitable habitat shrinking from 88 km to 51 km, with almost all of the loss in segments below 600 m elevation. (8) Under the same scenario but with streamside tree cover restored along every segment, the prediction is 69 km.

1. **[BIO.1.e]** What does the model use as inputs to estimate July water temperature?
   - A. elevation, streamside shade, and July air temperature
   - B. the number of brook trout caught in each segment
   - C. the logger readings from all 30 tested segments
   - D. the amount of dissolved oxygen in each segment
   - **Key: A**

2. **[BIO.1.b]** What was the purpose of placing temperature loggers in 30 segments?
   - A. to raise the water temperature so the model could be tested
   - B. to check the model's estimates against measured values
   - C. to replace the model entirely with direct measurements
   - D. to count the brook trout living in each segment
   - **Key: B**

3. **[BIO.1.c]** Select TWO statements that the results in sentence 6 support.
   - A. The model was accurate in most of the tested segments.
   - B. The model ran too cool in some low-elevation segments.
   - C. The loggers were faulty in four of the segments.
   - D. The model was accurate in every segment that was tested.
   - **Key: A and B**

4. **[BIO.1.d]** Which conclusion about the warming scenario is best supported?
   - A. All brook trout habitat will be lost if air temperature rises 2 °C.
   - B. High-elevation segments will lose the most habitat.
   - C. Low-elevation segments are the most vulnerable to warming.
   - D. Restoring tree cover would fully prevent habitat loss.
   - **Key: C**

5. **[BIO.1.e]** Based on the model, restoring streamside trees would —
   - A. cool every segment enough to make the whole watershed suitable
   - B. have no effect on the amount of suitable habitat
   - C. raise the July air temperature by about 2 °C
   - D. recover part, but not all, of the habitat lost to warming
   - **Key: D**

6. **[BIO.1.d]** Given the error found in sentence 6, how should the team treat the model's prediction for low-elevation segments?
   - A. Discard the whole model, because any error makes its output useless.
   - B. Accept the prediction exactly, since most tested segments matched well.
   - C. Treat it with caution, since the model may overstate habitat by running cool.
   - D. Assume those segments are colder than the model says and safe for trout.
   - **Key: C**

### Elodea and the moving lamp  
`inv-elodea-lamp` · Investigation · BIO.1 · level 3 · 203 words · 6 questions

> (1) Two lab partners investigated how light intensity affects the rate of photosynthesis in _Elodea_, a common aquarium plant. (2) They placed a 10 cm sprig, cut end up, in a test tube of water containing a pinch of baking soda to supply carbon dioxide. (3) A desk lamp was set 10, 20, 40, and 80 cm from the tube, and at each distance they waited three minutes and then counted the oxygen bubbles released from the cut stem in one minute. (4) Each distance was tested three times with the same sprig, and the table shows the averages. (5) Between trials the water warmed slightly, so they replaced it with fresh water at room temperature each time. (6) The partners knew that doubling the distance from a small light cuts the intensity to about one quarter, so they used distance as a stand-in for **light intensity**. (7) After the lab, a classmate argued that bubble counting is a poor measure because bubbles differ in size. (8) The partners agreed and suggested collecting the gas in a graduated tube and measuring its volume instead. (9) They wrote up the investigation for the school science fair.
> 
> | Lamp distance (cm) | Bubbles per minute (average) |
> |---|---|
> | 10 | 38 |
> | 20 | 21 |
> | 40 | 9 |
> | 80 | 2 |

1. **[BIO.1.b]** Why did the partners replace the water between trials?
   - A. to add a fresh supply of carbon dioxide to the test tube
   - B. to keep temperature from becoming a second changing variable
   - C. to make the oxygen bubbles easier to see and to count
   - D. to rinse any leftover baking soda off the cut stem
   - **Key: B**

2. **[BIO.1.c]** Which statement describes the trend in the table?
   - A. Bubble rate roughly halved each time the distance doubled.
   - B. Bubble rate increased as the lamp was moved farther away.
   - C. Bubble rate stayed about the same at all four distances.
   - D. Bubble rate roughly doubled each time the distance doubled.
   - **Key: A**

3. **[BIO.1.e]** The partners used lamp distance to stand in for light intensity. Which statement is a limit of this approach?
   - A. Distance from a lamp has no relationship to light intensity.
   - B. The lamp also gives off heat, so distance changes temperature as well as light.
   - C. Doubling the distance from the lamp doubles the light intensity.
   - D. The sprig cannot respond to changes in the position of the lamp.
   - **Key: B**

4. **[BIO.1.d]** Which statement best evaluates the classmate's criticism in sentence 7?
   - A. It is not valid, because all oxygen bubbles are exactly the same size.
   - B. It is not valid, because oxygen bubbles cannot be seen in water.
   - C. It is valid, because counting bubbles measures number, not volume of gas.
   - D. It is valid, because photosynthesis does not release any oxygen.
   - **Key: C**

5. **[BIO.1.f]** Which item belongs in the science fair write-up so that others can repeat the investigation?
   - A. the exact distances, timing, and water conditions used
   - B. a list of prizes won at past science fairs
   - C. the partners' opinions about aquarium plants
   - D. the names of students who watched the trials
   - **Key: A**

6. **[BIO.1.a]** Which follow-up investigation would best test whether temperature, not light, caused the change in bubble rate?
   - A. repeat the trials with a different species of plant
   - B. count the bubbles for five minutes instead of one
   - C. use a brighter lamp at the same four distances
   - D. keep the lamp at a fixed distance and vary the water temperature
   - **Key: D**


---

# Biochemistry (BIO.2)

Standards in this unit:

- BIO.2.a — water chemistry and its impact on life processes
- BIO.2.b — the structure and function of macromolecules
- BIO.2.c — the nature of enzymes
- BIO.2.d — protein synthesis: DNA as the code for proteins
- BIO.2.e — the capture, storage, transformation, and flow of energy through photosynthesis and respiration


## Level 1 — foundation

### Drops on a Penny  
`chem-penny-drops` · Biochemistry · BIO.2 · level 1 · 76 words · 5 questions

> (1) A student added water drop by drop to a clean penny until it spilled over. (2) The water formed a dome because of **cohesion**, the attraction between water molecules through hydrogen bonds. (3) She then repeated the test with soapy water, which weakens those bonds. (4) Each liquid was tested three times and averaged. (5) She also saw water cling to the dropper tip, an example of **adhesion**.
> 
> | Liquid | Average drops held |
> |---|---|
> | Plain water | 31 |
> | Soapy water | 14 |

1. **[BIO.2.a]** Which conclusion do the drop counts in the table best support?
   - A. Soap makes water molecules heavier, so fewer drops fit on the penny.
   - B. Weakening the hydrogen bonds lowered the number of drops the penny held.
   - C. Plain water is less polar than soapy water, so it forms a taller dome.
   - D. The penny absorbed more of the soapy water than of the plain water.
   - **Key: B**

2. **[BIO.2.a]** In sentence 2, cohesion refers to water molecules —
   - A. sticking to the metal surface of the penny
   - B. dissolving the soap that was added to them
   - C. attracting one another and holding together
   - D. changing temperature more slowly than metal
   - **Key: C**

3. **[BIO.2.a]** Which statement best explains why water molecules form hydrogen bonds with each other?
   - A. The oxygen end of each molecule is slightly negative and the hydrogen ends are slightly positive.
   - B. Hydrogen and oxygen share their electrons equally, so the molecule has no charged ends.
   - C. Water molecules carry no charge at all, so they slide freely past one another.
   - D. Water is made of separate ions that pull on each other with strong ionic bonds.
   - **Key: A**

4. **[BIO.2.a]** The independent variable in this investigation is —
   - A. the number of drops the penny held
   - B. the size of the penny used
   - C. the number of trials per liquid
   - D. the type of liquid added to the penny
   - **Key: D**

5. **[BIO.2.a]** In sentence 5, adhesion describes water molecules being attracted to —
   - A. other water molecules nearby
   - B. a different substance, such as the plastic tip
   - C. the soap molecules mixed into them
   - D. the warm air above the penny
   - **Key: B**

### Sugar in the Drinks  
`chem-benedicts-drinks` · Biochemistry · BIO.2 · level 1 · 75 words · 5 questions

> (1) Students tested four drinks for simple sugars with **Benedict's solution**, which changes from blue to green, orange or brick red as more sugar is present. (2) Each sample was heated in a hot-water bath for five minutes. (3) A tube of distilled water was heated alongside the drinks. (4) The class wanted to know which drink contained the most monosaccharide.
> 
> | Sample | Colour after heating |
> |---|---|
> | Distilled water | blue |
> | Diet soda | blue |
> | Apple juice | brick red |
> | Sports drink | orange |

1. **[BIO.2.b]** According to the table, which drink contained the most simple sugar?
   - A. Sports drink
   - B. Apple juice
   - C. Diet soda
   - D. Distilled water
   - **Key: B**

2. **[BIO.2.b]** The tube of distilled water in sentence 3 served as —
   - A. a negative control showing the colour when no sugar is present
   - B. a positive control showing the strongest colour change possible
   - C. the independent variable that the students changed on purpose
   - D. a repeated trial of the apple juice to check the first result
   - **Key: A**

3. **[BIO.2.b]** In sentence 1, Benedict's solution is described as an indicator for —
   - A. proteins such as those in milk
   - B. lipids such as those in cooking oil
   - C. starches such as those in bread
   - D. simple sugars such as glucose
   - **Key: D**

4. **[BIO.2.b]** The diet soda stayed blue. Which statement best explains this result?
   - A. Its tube was not heated long enough for the colour to change.
   - B. Benedict's solution only reacts with solid foods, not liquids.
   - C. Its sweetener is not a simple sugar that the indicator detects.
   - D. The bubbles in the soda blocked the indicator from reacting.
   - **Key: C**

5. **[BIO.2.b]** Glucose, the sugar found in apple juice, is the monomer of which group of macromolecules?
   - A. Lipids
   - B. Proteins
   - C. Carbohydrates
   - D. Nucleic acids
   - **Key: C**

### Brown Bag, Iodine and Biuret  
`chem-brown-bag-tests` · Biochemistry · BIO.2 · level 1 · 130 words · 6 questions

> (1) A class tested four foods for three kinds of macromolecule. (2) A drop of each food was rubbed on a **brown paper bag**; a spot that stays translucent after drying shows lipids. (3) **Iodine** turns from amber to blue-black when starch is present, and **Biuret** solution turns from blue to violet when protein is present. (4) A plus sign in the table means a positive test. (5) Every test was also run on distilled water, which gave a negative result each time.
> 
> | Food | Bag | Iodine | Biuret |
> |---|---|---|---|
> | Peanut butter | + | &minus; | + |
> | Cracker | &minus; | + | &minus; |
> | Egg white | &minus; | &minus; | + |
> | Butter | + | &minus; | &minus; |
> 
> (6) When one student stirred butter into a glass of water, it floated in blobs and never dissolved. (7) Another noticed that the cracker tasted sweeter the longer she chewed it.

1. **[BIO.2.b]** Which food tested positive for both lipid and protein?
   - A. The cracker
   - B. The egg white
   - C. The peanut butter
   - D. The butter
   - **Key: C**

2. **[BIO.2.b]** In sentence 3, a violet colour with Biuret solution shows the presence of —
   - A. amino acids joined into polypeptide chains
   - B. glucose units joined into long chains
   - C. fatty acids attached to a glycerol molecule
   - D. nucleotides joined into a double strand
   - **Key: A**

3. **[BIO.2.b]** Which conclusion is best supported by the results in the table?
   - A. Butter contains protein because it is made from milk.
   - B. The cracker's main macromolecule is a polysaccharide.
   - C. Egg white contains lipid because it feels slippery.
   - D. Peanut butter contains no carbohydrate of any kind.
   - **Key: B**

4. **[BIO.2.b]** The distilled water tests in sentence 5 were included to —
   - A. show what a strong positive result looks like for each test
   - B. dissolve each food sample before it was tested
   - C. measure how much of each macromolecule each food contained
   - D. confirm the indicators change only when the macromolecule is present
   - **Key: D**

5. **[BIO.2.a]** Which statement best explains the observation in sentence 6?
   - A. Lipids are nonpolar, so polar water molecules cannot pull them apart and surround them.
   - B. Butter is denser than water, so it stays together instead of spreading out.
   - C. Water is nonpolar and butter is polar, so the two repel each other.
   - D. Butter contains protein, and proteins never mix with water.
   - **Key: A**

6. **[BIO.2.c]** Which statement best explains the observation in sentence 7?
   - A. Chewing warms the cracker, which turns its lipids into sugar.
   - B. An enzyme in saliva breaks the starch into smaller sugars that taste sweet.
   - C. Saliva contains sugar that soaks into the cracker over time.
   - D. The cracker's protein is converted to glucose by the teeth.
   - **Key: B**

### Hydrilla Under the Lamp  
`chem-hydrilla-bubbles` · Biochemistry · BIO.2 · level 1 · 74 words · 5 questions

> (1) A group placed a sprig of hydrilla, an invasive water plant pulled from a Chesapeake Bay creek, under water in a test tube. (2) They set a lamp at four distances and counted the gas bubbles rising from the cut stem in one minute. (3) The bubbles are **oxygen**, a product of photosynthesis. (4) The room lights were off during every trial.
> 
> | Lamp distance (cm) | Bubbles per minute |
> |---|---|
> | 10 | 22 |
> | 20 | 14 |
> | 40 | 6 |
> | 80 | 1 |

1. **[BIO.2.e]** Which conclusion do the bubble counts best support?
   - A. Moving the lamp closer increased the rate of photosynthesis.
   - B. Moving the lamp closer increased the rate of cellular respiration.
   - C. The plant made the same gas at every distance, so light had no effect.
   - D. The plant stopped photosynthesizing at 10 cm because the lamp was too hot.
   - **Key: A**

2. **[BIO.2.e]** In sentence 3, the oxygen is released when the plant —
   - A. breaks down glucose inside its mitochondria
   - B. absorbs carbon dioxide through its roots
   - C. splits water molecules using light energy
   - D. converts stored starch back into sugar
   - **Key: C**

3. **[BIO.2.e]** Inside the hydrilla's chloroplasts, the reactants used to make glucose are —
   - A. oxygen and glucose
   - B. glucose and water
   - C. carbon dioxide and oxygen
   - D. carbon dioxide and water
   - **Key: D**

4. **[BIO.2.e]** Why were the room lights turned off during the trials?
   - A. To keep the water in the tube from warming up
   - B. So the lamp was the only light source and its distance was the only change
   - C. To make the rising bubbles easier to see and count
   - D. So the plant would switch from photosynthesis to respiration
   - **Key: B**

5. **[BIO.2.e]** Which statement about the hydrilla when the lamp is turned off is correct?
   - A. It stops all gas exchange until the light returns.
   - B. It keeps releasing oxygen from its stored starch.
   - C. It uses oxygen in cellular respiration to make ATP.
   - D. It makes glucose from carbon dioxide without light.
   - **Key: C**


## Level 2 — average student (core)

### Two Shenandoah Streams  
`chem-limestone-stream` · Biochemistry · BIO.2 · level 2 · 165 words · 6 questions

> (1) A field team compared two small streams in the Shenandoah Valley after a rainstorm. (2) Cedar Run flows over limestone, which dissolves slowly and releases bicarbonate ions; Laurel Run flows over sandstone and carries very few dissolved ions. (3) Water is an excellent **solvent** because its polar molecules pull ions away from a crystal and surround them. (4) Back in the lab, students added dilute acid one drop at a time to 100 mL samples from each stream and recorded the pH.
> 
> | Drops of acid | Cedar Run pH | Laurel Run pH |
> |---|---|---|
> | 0 | 7.8 | 6.9 |
> | 5 | 7.7 | 5.6 |
> | 10 | 7.5 | 4.4 |
> | 20 | 7.2 | 3.6 |
> 
> (5) A solution that resists a change in pH when acid or base is added is called a **buffer**. (6) The team also logged temperatures over one summer day: the air ranged from 17 °C to 33 °C, while Cedar Run ranged only from 18 °C to 21 °C. (7) Brook trout, which need cool water and a pH near neutral, were caught only in Cedar Run.

1. **[BIO.2.a]** Which conclusion do the pH readings in the table best support?
   - A. Laurel Run contains more dissolved limestone than Cedar Run does.
   - B. Cedar Run water is buffered, so its pH changed little as acid was added.
   - C. Adding acid raised the pH of both streams by about the same amount.
   - D. Both streams resisted the acid equally well for the first five drops.
   - **Key: B**

2. **[BIO.2.a]** In sentence 3, water acts as a solvent when it —
   - A. freezes into a layer of ice crystals on the stream
   - B. forms rounded drops on the surface of a leaf
   - C. separates and surrounds the ions of a dissolving mineral
   - D. absorbs a large amount of heat without warming much
   - **Key: C**

3. **[BIO.2.e]** Cool water holds more dissolved oxygen than warm water. Brook trout need that oxygen in order to —
   - A. build glucose inside their chloroplasts
   - B. dissolve minerals in their blood
   - C. release energy from food in their mitochondria
   - D. keep their body temperature above the water's
   - **Key: C**

4. **[BIO.2.a]** Which property of water best explains the temperature data in sentence 6?
   - A. Water's cohesion holds the warmest layer at the surface of the stream.
   - B. Water's low density lets the warm water float downstream and away.
   - C. Water evaporates quickly, releasing all of its stored heat at once.
   - D. Water's high specific heat means it absorbs a lot of heat before it warms.
   - **Key: D**

5. **[BIO.2.c]** Which statement best explains why brook trout survive only in water that stays cool and near pH 7?
   - A. The enzymes in their cells keep their shape only within a narrow range of temperature and pH.
   - B. Their cells contain no buffers, so any acid in the water enters their blood directly.
   - C. Warm water always contains more acid than cool water, which burns their gills.
   - D. Their scales dissolve in water that is even slightly acidic or slightly warm.
   - **Key: A**

6. **[BIO.2.a]** Based on the data, which is the best prediction if acid rain fell on both streams for several years?
   - A. Laurel Run would become too acidic for brook trout much sooner than Cedar Run.
   - B. Cedar Run would drop below pH 4 first because limestone dissolves so easily.
   - C. Both streams would keep their present pH because water is always neutral.
   - D. The trout would move to Laurel Run because acid makes water cooler.
   - **Key: A**

### Potato Catalase and Peroxide  
`chem-catalase-foam` · Biochemistry · BIO.2 · level 2 · 108 words · 6 questions

> (1) Catalase is an **enzyme** in potato and liver cells that breaks hydrogen peroxide, a toxic waste of metabolism, into water and oxygen gas. (2) A lab group blended raw potato with water, poured 5 mL of the mixture into six tubes and held each tube at a different temperature for ten minutes. (3) They then added 5 mL of 3% hydrogen peroxide to each tube and measured the height of the oxygen foam after one minute. (4) A seventh tube held peroxide and water with no potato and made no foam at any temperature.
> 
> | Temperature (°C) | Foam height (mm) |
> |---|---|
> | 5 | 9 |
> | 20 | 24 |
> | 35 | 41 |
> | 50 | 28 |
> | 65 | 4 |
> | 80 | 0 |

1. **[BIO.2.c]** Which conclusion do the foam heights best support?
   - A. Catalase works fastest near 35 °C and stops working at high temperatures.
   - B. Catalase activity keeps rising as the temperature of the tube rises.
   - C. Hydrogen peroxide breaks down on its own faster when the tube is warm.
   - D. Cold temperatures permanently destroy the catalase in potato cells.
   - **Key: A**

2. **[BIO.2.c]** In sentence 1, an enzyme is best described as —
   - A. a lipid that stores energy for the cell to use later
   - B. a protein that speeds up a specific reaction without being used up
   - C. a sugar that is broken down to release oxygen gas
   - D. a waste product that the cell must remove quickly
   - **Key: B**

3. **[BIO.2.c]** The seventh tube described in sentence 4 shows that —
   - A. potato cells produce hydrogen peroxide of their own
   - B. water alone is able to break down hydrogen peroxide
   - C. the foam depends on the enzyme, not on peroxide breaking down by itself
   - D. temperature has no effect on how fast the reaction runs
   - **Key: C**

4. **[BIO.2.c]** Which statement best explains the result at 80 °C?
   - A. The peroxide evaporated from the tube before it could react.
   - B. The heat changed the shape of the active site, so the substrate no longer fit.
   - C. The enzyme was used up during the ten-minute warm-up period.
   - D. The hot potato mixture absorbed the oxygen gas as it formed.
   - **Key: B**

5. **[BIO.2.b]** Catalase is made of a folded chain of amino acids. It belongs to which group of macromolecules?
   - A. Carbohydrates, whose chains store quick energy
   - B. Lipids, whose chains form the cell membrane
   - C. Nucleic acids, whose chains carry the genetic code
   - D. Proteins, whose folded shape forms the active site
   - **Key: D**

6. **[BIO.2.e]** The oxygen gas trapped in the foam is the same gas that living potato cells use to —
   - A. release energy from glucose in their mitochondria
   - B. capture light energy in their chloroplasts
   - C. link glucose units together into starch
   - D. dissolve hydrogen peroxide in their cytoplasm
   - **Key: A**

### Elodea, Snails and BTB  
`chem-btb-tubes` · Biochemistry · BIO.2 · level 2 · 93 words · 6 questions

> (1) **Bromothymol blue** (BTB) is an indicator that turns from blue to yellow when carbon dioxide dissolves in water and makes it more acidic. (2) A class set up four sealed tubes of blue BTB solution: one with a sprig of elodea, one with a pond snail, one with both, and one with nothing. (3) A second set of four identical tubes was wrapped in foil. (4) After 24 hours in bright light, only the snail-only tube had turned yellow. (5) In the foil set, every tube that held a living thing turned yellow, including the elodea-only tube.

1. **[BIO.2.a]** In sentence 1, the BTB turns yellow because dissolved carbon dioxide —
   - A. raises the pH of the water
   - B. lowers the pH of the water
   - C. removes oxygen from the water
   - D. makes the water more basic
   - **Key: B**

2. **[BIO.2.e]** Which statement best explains why the elodea-only tube in foil turned yellow?
   - A. Plants only photosynthesize, so the carbon dioxide must have leaked in from the air.
   - B. The foil trapped heat, and warm water makes the indicator turn yellow.
   - C. The elodea died as soon as the light was removed and began to decay.
   - D. The plant kept respiring but stopped photosynthesizing, so carbon dioxide built up.
   - **Key: D**

3. **[BIO.2.e]** Which statement best explains why the tube with both elodea and a snail stayed blue in the light?
   - A. The snail stopped respiring while the plant was present.
   - B. The plant released oxygen, which turned the indicator blue.
   - C. The plant used the carbon dioxide the snail released, so it did not build up.
   - D. The snail ate the elodea, which absorbed the acid from the water.
   - **Key: C**

4. **[BIO.2.e]** The tube with nothing in it was included to show —
   - A. that light alone can change the colour of BTB
   - B. that a colour change requires a living organism
   - C. how much carbon dioxide one snail produces
   - D. the effect of foil on the water temperature
   - **Key: B**

5. **[BIO.2.b]** In the light, the elodea makes glucose and stores some of it as starch. Glucose and starch are both —
   - A. carbohydrates made of carbon, hydrogen and oxygen
   - B. proteins made of chains of amino acids
   - C. lipids made of fatty acids and glycerol
   - D. nucleic acids made of chains of nucleotides
   - **Key: A**

6. **[BIO.2.e]** Which statement best describes the relationship between photosynthesis and cellular respiration shown by the tubes?
   - A. The products of one process are the reactants of the other.
   - B. Both processes take place only in plant cells.
   - C. Both processes release carbon dioxide into the water.
   - D. Photosynthesis happens in the dark and respiration in the light.
   - **Key: A**

### Yeast and Four Balloons  
`chem-yeast-balloons` · Biochemistry · BIO.2 · level 2 · 161 words · 6 questions

> (1) Yeast are single-celled fungi that can release energy from sugar with or without oxygen. (2) With oxygen they carry out **aerobic respiration**, producing carbon dioxide, water and about 36 ATP per glucose; without oxygen they carry out alcoholic fermentation, producing carbon dioxide, ethanol and only 2 ATP. (3) A student stirred one packet of dry yeast into each of four bottles of warm water, added a different sugar to three of them and nothing to the fourth, and stretched a balloon over each neck. (4) Because the bottles were sealed, the oxygen ran out quickly and the yeast switched to fermentation. (5) After 30 minutes she measured the circumference of each balloon.
> 
> | Bottle contents | Balloon circumference (cm) |
> |---|---|
> | Glucose | 24 |
> | Sucrose | 21 |
> | Starch | 6 |
> | No sugar | 4 |
> 
> (6) She noticed that the glucose bottle smelled faintly of alcohol. (7) On the board she wrote the aerobic pathway as C6H12O6 + 6O2 &rarr; 6CO2 + 6H2O + energy (ATP).

1. **[BIO.2.e]** Which conclusion do the balloon measurements best support?
   - A. Yeast release the most gas from glucose and very little from starch.
   - B. Starch is not a carbohydrate, so yeast cannot use it at all.
   - C. Yeast produce gas at the same rate from every food source.
   - D. The no-sugar balloon inflated because oxygen entered from the air.
   - **Key: A**

2. **[BIO.2.e]** In sentence 2, aerobic respiration differs from fermentation because it —
   - A. takes place without oxygen and releases ethanol
   - B. requires oxygen and releases far more ATP per glucose
   - C. builds glucose from carbon dioxide and water
   - D. produces no carbon dioxide at all
   - **Key: B**

3. **[BIO.2.b]** Sucrose, the sugar in the second bottle, is a disaccharide, which means it is —
   - A. two simple sugars joined by dehydration synthesis
   - B. a long chain of many glucose units
   - C. a fatty acid attached to a glycerol molecule
   - D. a single sugar ring with six carbon atoms
   - **Key: A**

4. **[BIO.2.e]** The bottle with no sugar was included in order to —
   - A. give the yeast a steady supply of oxygen
   - B. measure the temperature of the warm water
   - C. test whether the balloon leaks over 30 minutes
   - D. show how much gas forms when there is no sugar to break down
   - **Key: D**

5. **[BIO.2.c]** Which statement best explains the small balloon on the starch bottle?
   - A. Starch contains no glucose units, so it provides no energy to yeast.
   - B. Starch absorbed the carbon dioxide before it could reach the balloon.
   - C. Yeast lack most of the enzyme needed to break starch into usable sugars.
   - D. Starch is a lipid, so yeast cannot digest it in any amount.
   - **Key: C**

6. **[BIO.2.e]** Why would the yeast in the sealed bottles gain less usable energy per glucose than yeast in an open, stirred flask?
   - A. The sealed bottles kept the yeast too cool to make ATP.
   - B. Fermentation captures far less of the energy in glucose than aerobic respiration does.
   - C. Ethanol is the molecule that yeast use in place of ATP.
   - D. Without oxygen, yeast cannot break down glucose at all.
   - **Key: B**


## Level 3 — stretch

### Tracing a Lunch  
`chem-lunch-molecules` · Biochemistry · BIO.2 · level 3 · 216 words · 6 questions

> (1) A student ate a lunch of a peanut butter sandwich made with Virginia peanuts, an apple and a glass of milk, then traced what happened to each macromolecule in a lab write-up. (2) The bread's starch is a **polymer** of glucose; in the mouth and small intestine, the enzyme amylase breaks the bonds between glucose units by **hydrolysis**, a reaction that adds a water molecule at each break. (3) The peanut butter is rich in lipids and protein. (4) Proteins are chains of amino acids folded into a specific three-dimensional shape, and that shape determines the protein's function, whether it is an enzyme, a muscle fiber or an antibody. (5) Once absorbed, amino acids are rebuilt into new proteins by **dehydration synthesis**, which removes a water molecule as each bond forms. (6) To check the lunch's contents, the student ran food tests on a sample of each item.
> 
> | Sample | Iodine | Biuret | Benedict's |
> |---|---|---|---|
> | Bread | blue-black | blue | blue |
> | Peanut butter | amber | violet | blue |
> | Apple | amber | blue | orange |
> | Milk | amber | violet | green |
> 
> (7) She noted that milk gave a green Benedict's result, a weaker positive than the apple's orange. (8) Her teacher added that the nucleic acids in every cell of the food, DNA and RNA, are polymers of nucleotides but are present in amounts far too small for a classroom test to detect.

1. **[BIO.2.b]** In sentence 2, hydrolysis is a reaction that —
   - A. removes water to join monomers into a polymer
   - B. adds water to split a polymer into its monomers
   - C. uses light energy to build glucose from carbon dioxide
   - D. releases carbon dioxide as glucose is broken down
   - **Key: B**

2. **[BIO.2.e]** After the glucose from the bread is absorbed, the student's cells use it mainly to —
   - A. build starch for long-term storage in the muscles
   - B. capture light energy inside chloroplasts
   - C. release energy as ATP through cellular respiration
   - D. form the active sites of newly made enzymes
   - **Key: C**

3. **[BIO.2.c]** Based on sentence 4, what would most likely happen to an enzyme if its chain of amino acids unfolded?
   - A. It would work faster because more of the chain would be exposed.
   - B. It would keep working because its amino acid sequence is unchanged.
   - C. It would become a different kind of macromolecule, such as a lipid.
   - D. It would lose its function because its shape no longer matches its substrate.
   - **Key: D**

4. **[BIO.2.b]** When the body builds a muscle protein from absorbed amino acids, each new bond that forms —
   - A. requires a water molecule to be added
   - B. releases a water molecule
   - C. releases a glucose molecule
   - D. forms between two glucose units
   - **Key: B**

5. **[BIO.2.b]** Which conclusion is best supported by the food-test results?
   - A. The apple contains more simple sugar than the milk.
   - B. The bread contains no carbohydrate of any kind.
   - C. The milk contains lipid but no protein.
   - D. The peanut butter contains a large amount of starch.
   - **Key: A**

6. **[BIO.2.b]** Select TWO statements that correctly pair a macromolecule with its monomer.
   - A. Starch is built from glucose.
   - B. Protein is built from fatty acids.
   - C. DNA is built from nucleotides.
   - D. Lipid is built from amino acids.
   - **Key: A and C**

### Lactase Tablets and pH  
`chem-lactase-ph` · Biochemistry · BIO.2 · level 3 · 153 words · 6 questions

> (1) Lactose, the sugar in milk, is a disaccharide that the enzyme **lactase** splits into glucose and galactose. (2) People who make little lactase cannot digest milk well, and chewable lactase tablets are sold to help. (3) A student crushed one tablet, dissolved it in water and added equal amounts to tubes of milk that had been adjusted to different pH values with dilute acid or base. (4) After ten minutes at 37 °C she dipped a glucose test strip into each tube. (5) The strips respond only to glucose, not to lactose, so a reading near zero means almost no lactose was broken down. (6) A tube of milk at pH 7 with no enzyme also read zero.
> 
> | pH of milk | Glucose (mg/dL) |
> |---|---|
> | 2 | 45 |
> | 4 | 210 |
> | 6 | 480 |
> | 7 | 520 |
> | 9 | 300 |
> | 11 | 30 |
> 
> (7) Human lactase works in the small intestine, where the pH is near 6, while pepsin, a stomach enzyme, works best near pH 2.

1. **[BIO.2.c]** Which conclusion do the glucose readings best support?
   - A. Lactase works at every pH but is fastest in strongly acidic milk.
   - B. Lactase activity is highest near neutral pH and falls off in strong acid or base.
   - C. Lactase is permanently destroyed at any pH below 7.
   - D. Glucose forms in milk on its own whenever the pH is changed.
   - **Key: B**

2. **[BIO.2.c]** In sentence 1, lactase is —
   - A. the substrate that is broken down in the reaction
   - B. one of the products released by the reaction
   - C. the enzyme that catalyzes the reaction
   - D. the monosaccharide that the strips detect
   - **Key: C**

3. **[BIO.2.a]** Compared with the tube at pH 6, the tube of milk at pH 2 contains —
   - A. fewer hydrogen ions and is more basic
   - B. fewer hydrogen ions and is more acidic
   - C. more hydrogen ions and is more basic
   - D. more hydrogen ions and is more acidic
   - **Key: D**

4. **[BIO.2.c]** Which statement best explains the low reading at pH 11?
   - A. The strongly basic milk changed the shape of the enzyme's active site, so lactose no longer fit.
   - B. The base broke the lactose apart into glucose before the enzyme could reach it.
   - C. At high pH the glucose that formed was converted back into lactose.
   - D. The crushed tablet dissolved too slowly in the basic milk to be measured.
   - **Key: A**

5. **[BIO.2.c]** A classmate claims that swallowing a lactase tablet with milk is useless because the stomach is at pH 2. Which statement best evaluates this claim using the data and sentence 7?
   - A. The claim ignores that the enzyme also reaches the small intestine, where the pH is near its optimum.
   - B. The claim is correct because the data show that no glucose at all forms at pH 2.
   - C. The claim is correct because an enzyme is used up after it catalyzes a single reaction.
   - D. The claim ignores that milk neutralizes stomach acid so the tablet works at pH 7.
   - **Key: A**

6. **[BIO.2.b]** The reaction that lactase catalyzes is best described as —
   - A. dehydration synthesis, which removes water to join two sugars
   - B. hydrolysis, which adds water to split a disaccharide
   - C. fermentation, which converts a sugar into alcohol
   - D. denaturation, which unfolds the sugar molecule
   - **Key: B**

### Foam Enzymes and Real Amylase  
`chem-amylase-model` · Biochemistry · BIO.2 · level 3 · 189 words · 6 questions

> (1) A biology class built a model of enzyme action out of foam shapes. (2) Each enzyme piece had a notch called the **active site** that matched only one substrate shape, and students timed how long it took to "react" by pressing a two-piece substrate into the notch until it snapped apart. (3) The teacher explained that in a real cell the enzyme lowers the **activation energy**, the energy needed to start a reaction, and is released unchanged to be used again. (4) To connect the model to real data, the class then measured amylase, an enzyme in saliva that breaks starch into maltose. (5) They mixed 1 mL of diluted saliva with starch solutions of five concentrations at 37 °C and used iodine to find the time until the starch disappeared. (6) A shorter time means a faster reaction.
> 
> | Starch concentration (%) | Time to clear (s) |
> |---|---|
> | 0.5 | 190 |
> | 1.0 | 96 |
> | 2.0 | 50 |
> | 4.0 | 32 |
> | 8.0 | 30 |
> 
> (7) One student noted that doubling the starch from 4% to 8% barely changed the time. (8) Another predicted that adding a few drops of vinegar to the 2% tube would make the reaction faster because "acid dissolves things."

1. **[BIO.2.c]** In sentence 2, the active site is —
   - A. the region of the enzyme where the substrate binds
   - B. the product released when the substrate breaks apart
   - C. the energy that is needed to start the reaction
   - D. the part of the substrate that is broken in two
   - **Key: A**

2. **[BIO.2.c]** Which conclusion do the clearing times best support?
   - A. The reaction rate doubles every time the starch concentration is doubled.
   - B. High starch concentrations denature amylase and slow the reaction.
   - C. The rate rises with substrate concentration until the enzyme molecules are all occupied.
   - D. Amylase works only on starch solutions stronger than 4%.
   - **Key: C**

3. **[BIO.2.c]** Which statement best evaluates the prediction in sentence 8?
   - A. It is supported, because acids lower the activation energy of every reaction.
   - B. It is supported, because vinegar is a second substrate for amylase.
   - C. It is not supported, because amylase works only inside the stomach.
   - D. It is not supported, because a change in pH can alter the active site and slow the reaction.
   - **Key: D**

4. **[BIO.2.b]** Amylase breaks starch into maltose. Which statement correctly describes these two molecules?
   - A. Starch is a protein and maltose is a single amino acid.
   - B. Starch is a polymer of glucose and maltose is two glucose units.
   - C. Starch is a lipid and maltose is a single fatty acid.
   - D. Starch is a single sugar and maltose is a long polymer.
   - **Key: B**

5. **[BIO.2.e]** The maltose produced is later split into glucose. Cells use that glucose to —
   - A. capture light energy in chloroplasts
   - B. build the active sites of enzymes
   - C. lower the activation energy of reactions
   - D. release energy as ATP in mitochondria
   - **Key: D**

6. **[BIO.2.c]** Select TWO changes that would most likely slow the amylase reaction in the 2% tube.
   - A. Heating the saliva to 80 °C before adding it to the starch
   - B. Adding a second millilitre of diluted saliva to the tube
   - C. Keeping the tube in an ice bath at 4 °C during the trial
   - D. Stirring the mixture gently as the trial runs
   - **Key: A and C**


---

# Cell Structure & Function (BIO.3)

Standards in this unit:

- BIO.3.a — the cell theory is supported by evidence
- BIO.3.b — structures in unicellular and multicellular organisms work interdependently to carry out life processes
- BIO.3.c — the structure and function of the cell membrane support cell transport
- BIO.3.d — specialization leads to the development of different types of cells


## Level 1 — foundation

### A Slice of Cork  
`cell-cork-slice` · Cells · BIO.3 · level 1 · 70 words · 5 questions

> (1) A biology class shaves a thin slice of cork and views it at 100x. (2) They see rows of tiny empty boxes, the walled spaces Robert Hooke named **cells** in 1665. (3) Next they view onion skin and a drop of pond water. (4) The onion shows box-shaped cells, each with a nucleus; the pond water shows single cells swimming on their own. (5) Centuries of such microscope observations built the **cell theory**.

1. **[BIO.3.a]** In sentence 2, the word cells refers to —
   - A. the living contents that fill each box in the cork
   - B. the walled compartments that make up the cork tissue
   - C. the lenses that magnify the slice one hundred times
   - D. the pond organisms that swim past the onion slide
   - **Key: B**

2. **[BIO.3.a]** Which part of the cell theory is best supported by the onion and pond-water observations in sentence 4?
   - A. All cells arise from other cells by division.
   - B. Every cell is surrounded by a rigid cell wall.
   - C. All living things are made of one or more cells.
   - D. Cells are the same size in every organism.
   - **Key: C**

3. **[BIO.3.a]** The boxes in the cork appeared empty because —
   - A. the cork cells were dead and only their walls remained
   - B. the microscope was set too low to show any contents
   - C. cork cells never contain cytoplasm, even while alive
   - D. shaving the slice pushed the nucleus out of each box
   - **Key: A**

4. **[BIO.3.a]** Which statement best explains why sentence 5 says the cell theory was built rather than discovered all at once?
   - A. The theory was written before microscopes were invented.
   - B. One observation in 1665 was enough to prove it.
   - C. Each observer worked alone and shared no results.
   - D. Evidence from many observers with better tools added up.
   - **Key: D**

5. **[BIO.3.a]** Which structure mentioned in sentence 4 shows that onion skin cells are eukaryotic?
   - A. a cell wall
   - B. a nucleus
   - C. cytoplasm
   - D. a membrane
   - **Key: B**

### Yogurt and Cheek Cells  
`cell-two-smears` · Cells · BIO.3 · level 1 · 82 words · 5 questions

> (1) Students compare two stained slides at 400x: a smear of bacteria from yogurt and a scraping of cheek cells. (2) They record which structures they can see in each. (3) A **prokaryote** keeps its DNA loose in the cytoplasm; a eukaryote seals its DNA inside a nucleus.
> 
> | Structure | Yogurt bacteria | Cheek cells |
> |---|---|---|
> | Cell membrane | yes | yes |
> | Nucleus | no | yes |
> | Ribosomes | yes | yes |
> | Mitochondria | no | yes |
> | Cell wall | yes | no |
> 
> (4) The bacteria are about 2 micrometers long; the cheek cells are about 60 micrometers across.

1. **[BIO.3.a]** Which row of the table shows a structure found in the bacteria but not in the cheek cells?
   - A. Nucleus
   - B. Ribosomes
   - C. Mitochondria
   - D. Cell wall
   - **Key: D**

2. **[BIO.3.a]** According to sentence 3, a cell is a prokaryote because it —
   - A. lacks a membrane-bound nucleus
   - B. lacks a cell membrane
   - C. is too small to have ribosomes
   - D. cannot make its own proteins
   - **Key: A**

3. **[BIO.3.b]** Ribosomes appear in both cell types because every cell must —
   - A. store its DNA inside a nucleus
   - B. build proteins from amino acids
   - C. release energy in mitochondria
   - D. hold its shape with a cell wall
   - **Key: B**

4. **[BIO.3.a]** Which conclusion about cell size is supported by sentence 4?
   - A. Both cell types are about the same size.
   - B. Prokaryotic cells are larger because of their walls.
   - C. Prokaryotic cells are generally smaller than eukaryotic cells.
   - D. Cheek cells are too small to see at 400x.
   - **Key: C**

5. **[BIO.3.b]** Which statement best explains how the bacteria stay alive with no mitochondria?
   - A. They absorb ready-made ATP from the yogurt.
   - B. They release energy using enzymes in their cytoplasm and membrane.
   - C. They borrow mitochondria from nearby cheek cells.
   - D. They are too small to need any energy at all.
   - **Key: B**

### The Naked Egg  
`cell-naked-egg` · Cells · BIO.3 · level 1 · 80 words · 5 questions

> (1) A student soaks a raw egg in vinegar until the shell dissolves, leaving only the thin membrane around the egg. (2) She rinses it, records its mass, and then moves it into a new liquid each day.
> 
> | Day | Liquid | Mass (g) |
> |---|---|---|
> | 0 | after vinegar | 62 |
> | 1 | distilled water | 78 |
> | 2 | corn syrup | 51 |
> 
> (3) In distilled water the egg swelled; in corn syrup it shrank and wrinkled. (4) Water crossed the membrane by **osmosis**, moving toward the side with more dissolved solute.

1. **[BIO.3.c]** According to the table, how much mass did the egg gain in distilled water?
   - A. 11 g
   - B. 16 g
   - C. 27 g
   - D. 78 g
   - **Key: B**

2. **[BIO.3.c]** In sentence 4, osmosis is best described as —
   - A. the movement of solute across a membrane
   - B. the diffusion of water across a membrane
   - C. the pumping of water using energy from ATP
   - D. the dissolving of a shell in a weak acid
   - **Key: B**

3. **[BIO.3.c]** The egg shrank in corn syrup because —
   - A. sugar entered the egg and crowded the water out
   - B. water entered the egg, where solute was lower
   - C. water left the egg for the syrup, where solute was higher
   - D. the syrup broke down the proteins in the membrane
   - **Key: C**

4. **[BIO.3.c]** Compared with the inside of the egg, distilled water is —
   - A. hypertonic
   - B. isotonic
   - C. saturated
   - D. hypotonic
   - **Key: D**

5. **[BIO.3.c]** Why did the student dissolve the shell before starting the investigation?
   - A. so the membrane would be the only barrier between the egg and the liquid
   - B. so the egg would weigh less and be easier to handle on the balance
   - C. because vinegar adds water to the egg before the water trial
   - D. so the egg would sink instead of floating in the corn syrup
   - **Key: A**

### The Cell as a Town  
`cell-town-analogy` · Cells · BIO.3 · level 1 · 108 words · 6 questions

> (1) A teacher compares a cell to a town. (2) The **nucleus** is the town hall that stores the plans and sends out instructions. (3) **Ribosomes** are the workshops that build proteins from those instructions. (4) The endoplasmic reticulum is the road network carrying new proteins to the Golgi, the post office that sorts and ships them. (5) **Mitochondria** are power plants that release energy from food; lysosomes are recycling centers that break down worn-out parts. (6) Students then draw two cells. (7) The plant cell gets a rigid wall, a large central vacuole and green chloroplasts. (8) The animal cell has none of these; both share a membrane, cytoplasm and a cytoskeleton of protein fibers.

1. **[BIO.3.b]** In sentence 2, the nucleus is compared to a town hall because it —
   - A. breaks down worn-out parts
   - B. stores the instructions that direct the cell
   - C. releases usable energy from food
   - D. builds proteins for export
   - **Key: B**

2. **[BIO.3.b]** A student's animal-cell drawing includes a cell wall. Which correction should the teacher make?
   - A. Only plant cells have a wall, so remove it.
   - B. Animal cells have a wall but no membrane.
   - C. Cell walls belong only in bacteria.
   - D. The wall should be drawn inside the membrane.
   - **Key: A**

3. **[BIO.3.d]** A gland cell exports large amounts of protein. Which organelle would you expect it to have in greatest number?
   - A. chloroplasts
   - B. vacuoles
   - C. ribosomes
   - D. lysosomes
   - **Key: C**

4. **[BIO.3.b]** In the analogy, a package leaves the post office. In the cell this corresponds to —
   - A. a ribosome reading a strand of mRNA
   - B. a lysosome digesting a captured bacterium
   - C. the nucleus copying its DNA before division
   - D. the Golgi packaging a protein into a vesicle
   - **Key: D**

5. **[BIO.3.c]** Both drawings include a cell membrane. The main job of the membrane is to —
   - A. give the cell a rigid box shape
   - B. control which materials enter and leave
   - C. store water and dissolved sugars
   - D. capture light energy for the cell
   - **Key: B**

6. **[BIO.3.b]** Which statement best explains why the analogy calls the whole cell a town rather than a single building?
   - A. A cell has many parts that depend on one another to stay alive.
   - B. A cell is much larger than any one of its organelles.
   - C. Every organelle could survive on its own outside the cell.
   - D. Towns and cells both need a wall around the outside.
   - **Key: A**


## Level 2 — average student (core)

### Four Flasks of Broth  
`cell-broth-flasks` · Cells · BIO.3 · level 2 · 121 words · 6 questions

> (1) For centuries people believed living things could arise from nonliving matter, an idea called **spontaneous generation**. (2) A class boils broth in four flasks to kill any cells present. (3) Flask A is left open. (4) Flask B is sealed with a stopper. (5) Flask C has an S-shaped neck that lets air in but traps dust in the bend. (6) Flask D is like C, but students tilt it so broth touches the trapped dust, then set it upright. (7) After ten days they check for cloudiness, a sign of growth.
> 
> | Flask | Treatment | Broth after 10 days |
> |---|---|---|
> | A | open | cloudy |
> | B | sealed | clear |
> | C | S-neck | clear |
> | D | S-neck, tilted | cloudy |
> 
> (8) They conclude the microbes came from cells on the dust, not from the broth itself.

1. **[BIO.3.a]** Which pair of flasks, compared with each other, best shows that the microbes came from dust rather than from the air itself?
   - A. A and B
   - B. B and C
   - C. C and D
   - D. A and D
   - **Key: C**

2. **[BIO.3.a]** In sentence 1, spontaneous generation means that —
   - A. cells divide without any signal
   - B. life arises from nonliving matter
   - C. microbes grow faster when warm
   - D. dust carries living cells into broth
   - **Key: B**

3. **[BIO.3.a]** Flask B stayed clear. A supporter of spontaneous generation could still argue that —
   - A. the stopper kept out the air that new life needs
   - B. the broth in flask B was never boiled
   - C. flask B was tilted just like flask D
   - D. sealed flasks always grow microbes
   - **Key: A**

4. **[BIO.3.b]** Which statement best explains how a single microbe in flask A stayed alive and multiplied?
   - A. It absorbed ATP made by the beef broth as it cooled.
   - B. It joined with other microbes to form one multicellular body.
   - C. It formed a nucleus first and then began to divide.
   - D. Its membrane, ribosomes and DNA together carried out its life processes.
   - **Key: D**

5. **[BIO.3.c]** Nutrients from the broth entered each microbe by crossing its —
   - A. nuclear envelope
   - B. ribosome
   - C. mitochondrion
   - D. cell membrane
   - **Key: D**

6. **[BIO.3.a]** The result in flask C supports which part of the cell theory?
   - A. All organisms are made of cells.
   - B. All cells come from existing cells.
   - C. The cell is the basic unit of life.
   - D. Cells pass on hereditary information.
   - **Key: B**

### Cells in Salt Water  
`cell-salt-slides` · Cells · BIO.3 · level 2 · 117 words · 6 questions

> (1) A student places drops of blood and thin pieces of red onion skin into three salt solutions and examines them at 400x after five minutes. (2) Normal body fluid is about 0.9% salt.
> 
> | Solution | Red blood cells | Onion cells |
> |---|---|---|
> | 0.0% salt (distilled) | swollen, some burst | plump, membrane pressed to wall |
> | 0.9% salt | normal disc shape | normal |
> | 3.0% salt | shrunken, spiky edges | membrane pulled away from wall |
> 
> (3) The 0.9% solution is **isotonic** to the cells, so water enters and leaves at equal rates. (4) In 3.0% salt the onion membrane shrinks inward while the cell wall keeps its shape, a condition called **plasmolysis**. (5) The onion cells in distilled water did not burst even though many red blood cells did.

1. **[BIO.3.c]** Based on the table, which solution caused water to leave both kinds of cell?
   - A. 0.0% salt
   - B. 0.9% salt
   - C. 3.0% salt
   - D. none of the solutions
   - **Key: C**

2. **[BIO.3.c]** In sentence 3, isotonic means the solution —
   - A. has more dissolved solute than the cell
   - B. has the same solute concentration as the cell
   - C. has less dissolved solute than the cell
   - D. contains no dissolved salt at all
   - **Key: B**

3. **[BIO.3.c]** Red blood cells burst in distilled water because —
   - A. water moved into the cells, where solute concentration was higher
   - B. salt rushed into the cells and split the membrane
   - C. water moved out of the cells toward the lower solute concentration
   - D. the membrane dissolved in the pure water
   - **Key: A**

4. **[BIO.3.b]** Which statement best explains the observation in sentence 5?
   - A. Onion cells have no membrane, so no water enters them.
   - B. Plant cells cannot absorb water without roots.
   - C. Distilled water is isotonic to plant cells.
   - D. The rigid cell wall resists the pressure of incoming water.
   - **Key: D**

5. **[BIO.3.d]** The normal disc shape of a red blood cell in 0.9% salt helps the cell —
   - A. store extra salt for the body
   - B. push through the walls of capillaries
   - C. exchange gases quickly across a large surface
   - D. divide rapidly while in the bloodstream
   - **Key: C**

6. **[BIO.3.c]** A dehydrated patient is given fluid through a vein. Which fluid should be chosen, and why?
   - A. distilled water, because it hydrates blood cells fastest
   - B. 0.9% salt, because it will not change the volume of blood cells
   - C. 3.0% salt, because it draws water into blood cells
   - D. any of the three, because blood cells have protective walls
   - **Key: B**

### Potato Cores in Sugar  
`cell-potato-cores` · Cells · BIO.3 · level 2 · 175 words · 6 questions

> (1) A class cuts potato cores of equal size with a cork borer, blots them, and records each mass. (2) Each core is placed in a cup of sugar solution for 24 hours, then blotted and weighed again. (3) The cups hold 0%, 5%, 10%, 20% and 30% sucrose. (4) The class calculates the percent change in mass for each core.
> 
> | Sucrose (%) | Start mass (g) | End mass (g) | Change (%) |
> |---|---|---|---|
> | 0 | 10.0 | 11.2 | +12 |
> | 5 | 10.0 | 10.6 | +6 |
> | 10 | 10.0 | 10.0 | 0 |
> | 20 | 10.0 | 9.2 | -8 |
> | 30 | 10.0 | 8.5 | -15 |
> 
> (5) Potato cells have no pump for sucrose, and sucrose molecules are too large to pass through the membrane on their own. (6) Only water crosses the membrane during the 24 hours, so the change in mass is a measure of **osmosis**. (7) The solution in which mass did not change is **isotonic** to the potato cytoplasm. (8) The cores from 0% sucrose felt stiff and firm, while those from 30% were limp. (9) One group forgot to blot its cores before the final weighing and reported a gain in every cup.

1. **[BIO.3.c]** Which conclusion is best supported by the data in the table?
   - A. Potato cells gain water in every sucrose solution.
   - B. The potato cytoplasm is about 10% sucrose.
   - C. Sucrose enters the cores at 20% and 30%.
   - D. Mass loss stops once sucrose reaches 20%.
   - **Key: B**

2. **[BIO.3.c]** In sentence 7, isotonic describes a solution that —
   - A. contains no dissolved sucrose at all
   - B. causes the potato cells to swell and burst
   - C. has the same solute concentration as the cell
   - D. pulls water out of the cell into the cup
   - **Key: C**

3. **[BIO.3.b]** Which structure best explains why the cores in 0% sucrose became stiff rather than bursting (sentence 8)?
   - A. the central vacuole, which collapsed
   - B. the membrane, which pumped water out
   - C. the nucleus, which absorbed the extra water
   - D. the cell wall, which resisted the pressure of incoming water
   - **Key: D**

4. **[BIO.3.c]** The independent variable in this investigation is the —
   - A. sucrose concentration of the solution
   - B. percent change in mass of each core
   - C. starting mass of each core
   - D. time the cores spent soaking
   - **Key: A**

5. **[BIO.3.c]** Select TWO statements that explain the result reported by the group in sentence 9.
   - A. Liquid left on the surface of each core added to the measured mass.
   - B. Cores in 30% sucrose actually took in water from the solution.
   - C. The error raised the final mass but not the starting mass.
   - D. Blotting removes water from inside the potato cells.
   - **Key: A and C**

6. **[BIO.3.d]** Root hair cells of a potato plant are long and thin. This shape helps the plant because it —
   - A. lets the cell move water without using osmosis
   - B. increases the surface area for water to enter by osmosis
   - C. prevents water from leaving the cell in dry soil
   - D. stores sucrose for the growing potato tuber
   - **Key: B**

### A Runner on a Hot Day  
`cell-hot-runner` · Cells · BIO.3 · level 2 · 143 words · 6 questions

> (1) A cross-country runner trains on a hot afternoon near Harrisonburg. (2) Within minutes her skin flushes and she begins to sweat. (3) A biology student explains what is happening at each level of organization. (4) Muscle **cells** in her legs release energy in their mitochondria, and some of that energy is lost as heat. (5) Bundles of these cells form muscle **tissue**, and several tissues, including nerve and connective tissue, make up each leg muscle, an **organ**. (6) Sensors in the brain detect the rising blood temperature and signal sweat glands in the skin. (7) Sweat glands, skin and blood vessels belong to different organ systems, yet they work together to shed heat. (8) As sweat evaporates, blood temperature returns toward 37 °C. (9) Keeping internal conditions within a narrow range is called **homeostasis**. (10) Muscle cells and sweat-gland cells carry the same DNA yet look and act differently.

1. **[BIO.3.b]** Which list places the runner's structures in order from smallest to largest?
   - A. cell, organ, tissue, organ system
   - B. cell, tissue, organ, organ system
   - C. tissue, cell, organ, organism
   - D. organ, tissue, cell, organism
   - **Key: B**

2. **[BIO.3.b]** In sentence 9, homeostasis refers to —
   - A. the release of heat by muscle cells
   - B. the flow of extra blood to the skin
   - C. keeping internal conditions stable
   - D. the evaporation of sweat from skin
   - **Key: C**

3. **[BIO.3.b]** Which statement best describes the relationship between a leg muscle and muscle tissue?
   - A. Muscle tissue is built from several different organs.
   - B. A leg muscle is a single type of tissue.
   - C. Muscle tissue is one level larger than an organ.
   - D. A leg muscle is an organ built from muscle tissue and other tissues.
   - **Key: D**

4. **[BIO.3.b]** Sentence 7 best illustrates that —
   - A. organ systems interact to keep the body in balance
   - B. each organ system works alone, without the others
   - C. the skin is the only organ that controls temperature
   - D. sweat glands are a type of muscle tissue
   - **Key: A**

5. **[BIO.3.c]** Sweat forms when water and salt leave gland cells. Which structure controls which substances leave the cell?
   - A. the cell wall
   - B. the nucleus
   - C. the cell membrane
   - D. the cytoskeleton
   - **Key: C**

6. **[BIO.3.d]** Which statement best explains the observation in sentence 10?
   - A. Each cell type has lost the genes it does not use.
   - B. Muscle cells are prokaryotes and gland cells are not.
   - C. Sweat-gland cells have no nucleus to hold DNA.
   - D. Each cell type switches on a different set of its genes.
   - **Key: D**


## Level 3 — stretch

### Building a Membrane  
`cell-membrane-model` · Cells · BIO.3 · level 3 · 156 words · 6 questions

> (1) A class models the cell membrane with foam balls for phospholipid heads and pipe cleaners for tails, arranged as a **phospholipid bilayer** with the tails pointing inward. (2) Clay shapes span the bilayer to represent protein channels and pumps. (3) Small nonpolar molecules such as oxygen slip between the tails, while ions and large polar molecules need a protein to cross. (4) The class then tests dialysis tubing, which has tiny pores but no proteins. (5) A bag of starch and glucose solution sits in a beaker of water containing iodine, which turns blue-black with starch. (6) After 20 minutes the water outside tests positive for glucose but stays amber, while the contents of the bag are blue-black. (7) A student asks why the bag cannot move glucose against its concentration gradient the way a root hair cell takes in minerals. (8) The teacher answers that the tubing has no pumps and no ATP, so it allows only **passive transport** down concentration gradients.

1. **[BIO.3.c]** In the phospholipid bilayer of sentence 1, the tails point inward because they are —
   - A. hydrophilic and attract water
   - B. hydrophobic and avoid water
   - C. charged and bind to ions
   - D. rigid and give the membrane strength
   - **Key: B**

2. **[BIO.3.c]** Which conclusion is best supported by the results in sentence 6?
   - A. Iodine and glucose crossed the tubing; starch did not.
   - B. Starch and iodine crossed the tubing; glucose did not.
   - C. Only glucose crossed the tubing in either direction.
   - D. Nothing crossed the tubing during the 20 minutes.
   - **Key: A**

3. **[BIO.3.c]** The starch stayed inside the bag because —
   - A. starch is nonpolar and stuck to the tubing
   - B. iodine bound the starch and held it inside
   - C. starch molecules are too large for the pores
   - D. the bag pumped any escaping starch back in
   - **Key: C**

4. **[BIO.3.c]** Which statement best explains why oxygen crosses a cell membrane without a protein but glucose needs one?
   - A. Oxygen is charged and glucose is not.
   - B. Glucose is used up too quickly to reach the membrane.
   - C. Oxygen is pumped inward by the mitochondria.
   - D. Oxygen is small and nonpolar; glucose is large and polar.
   - **Key: D**

5. **[BIO.3.b]** A root hair cell takes in a mineral ion from soil water that holds less of that ion than the cell does. Which pair of structures makes this possible?
   - A. a protein pump in the membrane and a mitochondrion supplying ATP
   - B. a channel protein in the membrane and a chloroplast supplying sugar
   - C. the phospholipid tails and a nucleus that dissolves the ion
   - D. larger pores in the membrane and ribosomes that carry the ion
   - **Key: A**

6. **[BIO.3.d]** Root hair cells contain far more mitochondria than most other root cells. Which statement best explains this specialization?
   - A. They need ATP to make water enter by osmosis.
   - B. They need ATP to pump minerals in against the gradient.
   - C. They carry out photosynthesis below the ground.
   - D. They must store glucose for the rest of the plant.
   - **Key: B**

### Agar Cubes in Vinegar  
`cell-agar-cubes` · Cells · BIO.3 · level 3 · 217 words · 6 questions

> (1) Students cut blocks of pink agar, which contains a pH indicator, into cubes with sides of 1, 2 and 3 cm. (2) They drop the cubes into vinegar and start a timer. (3) Wherever the acid diffuses in, the agar turns from pink to clear. (4) After 5 minutes they remove the cubes, slice each in half, and measure how deep the clear layer reaches. (5) They also calculate the **surface area** (six faces) and **volume** of each cube.
> 
> | Side (cm) | Surface area (cm²) | Volume (cm³) | SA : V |
> |---|---|---|---|
> | 1 | 6 | 1 | 6.0 |
> | 2 | 24 | 8 | 3.0 |
> | 3 | 54 | 27 | 2.0 |
> 
> (6) The acid reached about 4 mm into every cube. (7) The 1-cm cube was clear nearly all the way through, but the 3-cm cube kept a large pink center. (8) The teacher relates this to cells: nutrients enter and wastes leave across the membrane, so its surface area must keep up with the volume of cytoplasm it serves. (9) As a cell grows, volume rises faster than surface area, and the ratio falls. (10) This is one reason cells stay small and divide, and why cells lining the small intestine, which absorb a great deal, have folded membranes. (11) A student asks whether a meter-long nerve cell breaks the rule; the teacher notes it is extremely thin, so no cytoplasm is far from the membrane.

1. **[BIO.3.b]** Based on the table, when the side of a cube doubles from 1 cm to 2 cm, the surface-area-to-volume ratio —
   - A. doubles
   - B. stays the same
   - C. is cut in half
   - D. increases fourfold
   - **Key: C**

2. **[BIO.3.b]** In sentence 5, the surface area of a cube refers to —
   - A. the total area of its six faces
   - B. the amount of space it fills
   - C. the depth the acid reached
   - D. the length of one of its sides
   - **Key: A**

3. **[BIO.3.b]** Which cube had the smallest share of its volume reached by acid after 5 minutes?
   - A. the 1-cm cube
   - B. the 2-cm cube
   - C. all three equally, since the acid reached 4 mm in each
   - D. the 3-cm cube
   - **Key: D**

4. **[BIO.3.c]** The acid moved into the agar by —
   - A. active transport using ATP
   - B. diffusion from higher to lower concentration
   - C. osmosis through channel proteins
   - D. endocytosis at the agar surface
   - **Key: B**

5. **[BIO.3.b]** Which statement best explains why a large cell is more likely to divide than to keep growing?
   - A. A larger membrane lets in too much water at once.
   - B. Its membrane cannot exchange materials fast enough for its volume.
   - C. Its volume grows more slowly than its surface area.
   - D. Its cytoskeleton breaks when the cell gets too heavy.
   - **Key: B**

6. **[BIO.3.d]** How do the two specialized cells in sentences 10 and 11 keep a high surface-area-to-volume ratio?
   - A. Intestinal cells fold their membrane; nerve cells stay very thin.
   - B. Both have thick, rounded shapes with very few folds.
   - C. Both contain far more cytoplasm than membrane.
   - D. Intestinal cells stop dividing; nerve cells grow rounder.
   - **Key: A**

### One Egg, Two Hundred Cell Types  
`cell-stem-cells` · Cells · BIO.3 · level 3 · 260 words · 6 questions

> (1) A class studies how one fertilized egg becomes the roughly 200 cell types in a human body. (2) Early embryonic cells are **stem cells**: unspecialized cells that can divide repeatedly and become many other kinds of cell. (3) Every body cell keeps the same full set of genes, but as an embryo develops, chemical signals from neighboring cells switch different genes on or off in each cell. (4) This process, **differentiation**, gives each cell type a shape and set of organelles that fit its job. (5) The class compiles a table from their microscope work.
> 
> | Cell type | Shape or feature | Job |
> |---|---|---|
> | Nerve cell | long branching fibers | carries signals over long distances |
> | Muscle cell | long, packed with protein fibers and mitochondria | contracts to move the body |
> | Red blood cell | flattened disc, no nucleus | carries oxygen |
> | Root hair cell (plant) | thin extension into soil | absorbs water and minerals |
> | Guard cell (plant) | curved pair with a pore between | swells with water to open the pore |
> 
> (6) Adult tissues keep a few stem cells, such as those in bone marrow that replace blood cells throughout life. (7) A student asks why a skin cell cannot simply be moved to the brain to replace a damaged nerve cell. (8) The teacher explains that the skin cell's nerve-related genes are switched off, and that a differentiated cell normally cannot go back. (9) Researchers can, however, reprogram some adult cells in the lab by adding signals that reactivate embryonic genes. (10) A red blood cell, having lost its nucleus, cannot be reprogrammed at all and lives only about four months before it is replaced.

1. **[BIO.3.d]** In sentence 2, a stem cell is a cell that —
   - A. has already developed a specialized shape
   - B. can divide and become many types of cell
   - C. has lost its nucleus and cannot divide
   - D. carries signals over long distances
   - **Key: B**

2. **[BIO.3.c]** According to the table, a guard cell opens its pore when water enters. For water to enter by osmosis, the guard cell's cytoplasm must be —
   - A. hypotonic to the surrounding cells
   - B. equal in solute to the surrounding cells
   - C. higher in solute than the surrounding cells
   - D. free of any dissolved salts
   - **Key: C**

3. **[BIO.3.d]** Which statement best explains why a muscle cell contains many more mitochondria than a skin cell?
   - A. Muscle cells carry extra genes for building mitochondria.
   - B. Mitochondria contract to pull on the protein fibers.
   - C. Skin cells do not need any energy to function.
   - D. Contraction requires large amounts of ATP.
   - **Key: D**

4. **[BIO.3.d]** Select TWO statements about differentiated cells that are supported by the passage.
   - A. Their genes are different from those in stem cells.
   - B. Signals from neighboring cells influence which genes are active.
   - C. They normally do not return to an unspecialized state.
   - D. They all keep a nucleus for their entire lives.
   - **Key: B and C**

5. **[BIO.3.b]** A red blood cell has no nucleus. Which consequence follows from this?
   - A. It cannot make new proteins to repair itself and must be replaced.
   - B. It can divide faster than cells that keep a nucleus.
   - C. It stores its DNA in its mitochondria instead.
   - D. It cannot carry oxygen without instructions from DNA.
   - **Key: A**

6. **[BIO.3.d]** Which claim is best supported by sentence 9?
   - A. Differentiation depends on which genes are active, not which are present.
   - B. Adult cells can never be changed once they have differentiated.
   - C. Reprogramming works by removing unneeded genes from a cell.
   - D. Embryonic genes are destroyed as development goes on.
   - **Key: A**


---

# Bacteria & Viruses (BIO.4)

Standards in this unit:

- BIO.4.a — viruses depend on a host for metabolic processes
- BIO.4.b — the modes of reproduction and replication can be compared
- BIO.4.c — the structures and functions can be compared
- BIO.4.d — bacteria and viruses have a role in other organisms and the environment
- BIO.4.e — the germ theory of infectious disease is supported by evidence


## Level 1 — foundation

### Is It a Cell?  
`micro-alive-checklist` · Bacteria & Viruses · BIO.4 · level 1 · 96 words · 5 questions

> (1) A biology class was asked to decide whether a bacterium and a virus each count as a living cell. (2) Students compared the two using a **checklist** of features and recorded what they found. (3) Each row of the table says whether the feature is present.
> 
> | Feature | Bacterium | Virus |
> |---|---|---|
> | Ribosomes | Yes | No |
> | Own metabolism | Yes | No |
> | Genetic material | Yes | Yes |
> | Cell wall | Yes | No |
> | Protein capsid | No | Yes |
> | Size | 2 µm | 0.1 µm |
> 
> (4) The class concluded that only the bacterium meets all the rules for a cell, while the virus must borrow what it lacks from a host.

1. **[BIO.4.c]** Based on the table, which structure is found in the virus but not in the bacterium?
   - A. ribosomes
   - B. protein capsid
   - C. cell wall
   - D. genetic material
   - **Key: B**

2. **[BIO.4.a]** Which row of the table best explains why a virus cannot build its own proteins?
   - A. Genetic material
   - B. Cell wall
   - C. Ribosomes
   - D. Size
   - **Key: C**

3. **[BIO.4.a]** Which statement best explains why the class decided the virus is not a living cell?
   - A. It carries no genetic material of its own.
   - B. It is too small to see with a light microscope.
   - C. It has no cell wall, and every living thing needs one.
   - D. It has no metabolism and cannot reproduce on its own.
   - **Key: D**

4. **[BIO.4.c]** In sentence 2, the checklist is best described as —
   - A. a list of features used to compare two things
   - B. a set of steps for growing bacteria on agar
   - C. a graph of how fast each organism grows
   - D. a hypothesis about which one causes disease
   - **Key: A**

5. **[BIO.4.c]** Using the sizes in the table, about how many virus particles laid end to end would equal the length of one bacterium?
   - A. 2
   - B. 10
   - C. 20
   - D. 200
   - **Key: C**

### Yogurt in a Jar  
`micro-yogurt-culture` · Bacteria & Viruses · BIO.4 · level 1 · 80 words · 5 questions

> (1) A food science class made yogurt by stirring a spoonful of live culture into warm milk. (2) The culture contained bacteria that feed on milk sugar and release lactic acid. (3) Students measured the pH every two hours as the bacteria multiplied by **binary fission**.
> 
> | Time (h) | pH | Texture |
> |---|---|---|
> | 0 | 6.6 | liquid |
> | 2 | 6.3 | liquid |
> | 4 | 5.4 | slightly thick |
> | 6 | 4.8 | thick gel |
> 
> (4) A second jar made with culture that had been boiled first stayed at pH 6.6 and never thickened.

1. **[BIO.4.d]** Which conclusion do the pH readings in the table best support?
   - A. The bacteria raise the pH of the milk as they grow.
   - B. Milk thickens on its own if it is kept warm long enough.
   - C. Boiling the culture is what causes yogurt to form.
   - D. Acid released by the bacteria makes the milk thicken.
   - **Key: D**

2. **[BIO.4.b]** In sentence 3, binary fission means the bacteria —
   - A. exchange plasmids through a pilus
   - B. split into two identical cells
   - C. burst open to release new viruses
   - D. join together to form a spore
   - **Key: B**

3. **[BIO.4.d]** The jar made with boiled culture served as —
   - A. the independent variable in the investigation
   - B. a control showing that live bacteria are needed
   - C. a second trial using a different kind of milk
   - D. a test of whether the milk sugar had run out
   - **Key: B**

4. **[BIO.4.d]** Which statement best describes the role of the bacteria in this investigation?
   - A. They are pathogens that spoil the milk.
   - B. They are decomposers breaking down the jar.
   - C. They are helpful microbes used to make a food.
   - D. They are viruses that infect the milk cells.
   - **Key: C**

5. **[BIO.4.d]** Between which two measurements did the pH drop the most?
   - A. 2 h and 4 h
   - B. 0 h and 2 h
   - C. 4 h and 6 h
   - D. the pH dropped by the same amount each time
   - **Key: A**

### The Hand-Washing Rule  
`micro-handwashing-clinic` · Bacteria & Viruses · BIO.4 · level 1 · 111 words · 5 questions

> (1) A small clinic noticed that many patients who came in for minor surgery developed wound infections afterwards. (2) The clinic manager suspected that **pathogens**, disease-causing microbes, were being carried from one patient to the next on the hands of staff. (3) Starting in March, every staff member was required to wash with soap and water before touching any patient. (4) Nothing else about the clinic changed. (5) The table shows the number of surgeries and wound infections each month.
> 
> | Month | Surgeries | Infections | Rate (%) |
> |---|---|---|---|
> | January | 80 | 12 | 15 |
> | February | 75 | 12 | 16 |
> | March | 82 | 5 | 6 |
> | April | 78 | 3 | 4 |
> 
> (6) The manager also swabbed unwashed hands and grew colonies of bacteria from every sample.

1. **[BIO.4.e]** Which conclusion do the data in the table best support?
   - A. Infections dropped after hand-washing became required.
   - B. Fewer patients had surgery once hand-washing began.
   - C. Hand-washing removed every pathogen from the clinic.
   - D. The infections were caused by cold winter weather.
   - **Key: A**

2. **[BIO.4.e]** Which observation gives the most direct evidence that microbes were being carried on hands?
   - A. The rate was higher in February than in January.
   - B. Bacterial colonies grew from every unwashed hand.
   - C. The number of surgeries stayed about the same.
   - D. The clinic changed nothing else in March.
   - **Key: B**

3. **[BIO.4.e]** In sentence 2, a pathogen is —
   - A. any microbe that lives on the skin
   - B. a chemical in soap that kills germs
   - C. a microbe that causes disease
   - D. a patient who carries an infection
   - **Key: C**

4. **[BIO.4.e]** Why is sentence 4 important to the investigation?
   - A. It shows that the sample size was large enough.
   - B. It proves that soap works better than alcohol gel.
   - C. It explains why the rate rose in February.
   - D. It rules out other causes for the drop in infections.
   - **Key: D**

5. **[BIO.4.e]** If the April rate continued and the clinic performed 100 surgeries in May, about how many wound infections would be expected?
   - A. 4
   - B. 12
   - C. 16
   - D. 40
   - **Key: A**

### Four Sealed Samples  
`micro-bacteria-jobs` · Bacteria & Viruses · BIO.4 · level 1 · 132 words · 6 questions

> (1) A teacher set out four sealed samples and asked students to match each to the role its bacteria play. (2) Sample W was soil from a creek bank where a boat had leaked diesel; its bacteria were breaking the fuel into carbon dioxide and water, a process called **bioremediation**. (3) Sample X was a flask of engineered bacteria carrying a human gene and producing insulin for people with diabetes. (4) Sample Y was a rotting log from the Blue Ridge, full of decomposers. (5) Sample Z was a swab from a healthy person's gut, where bacteria help digest food and make vitamins. (6) Every sample contained cells with a cell wall and no nucleus.
> 
> | Sample | Source | Role |
> |---|---|---|
> | W | Diesel-soaked soil | Bioremediation |
> | X | Engineered culture | Making insulin |
> | Y | Rotting log | Decomposition |
> | Z | Human gut | Digestion and vitamins |

1. **[BIO.4.d]** Which sample shows bacteria being used in biotechnology?
   - A. Sample W
   - B. Sample X
   - C. Sample Y
   - D. Sample Z
   - **Key: B**

2. **[BIO.4.d]** In sentence 2, bioremediation means —
   - A. using microbes to clean up pollution
   - B. treating an infection with antibiotics
   - C. recycling nutrients from dead plants
   - D. adding bacteria to milk to make cheese
   - **Key: A**

3. **[BIO.4.d]** Which statement best describes the role of the bacteria in sample Y?
   - A. They cause a disease that kills the tree.
   - B. They fix nitrogen gas from the air.
   - C. They break down dead matter, recycling nutrients.
   - D. They produce insulin for the forest animals.
   - **Key: C**

4. **[BIO.4.b]** The engineered bacteria in sample X grew from a few cells into a full flask by —
   - A. conjugation with human cells
   - B. the lysogenic cycle
   - C. meiosis
   - D. binary fission
   - **Key: D**

5. **[BIO.4.c]** Sentence 6 tells the students that every sample contains —
   - A. eukaryotic cells
   - B. prokaryotic cells
   - C. virus particles
   - D. plant cells
   - **Key: B**

6. **[BIO.4.d]** Which statement best explains why the bacteria in sample X can make a human protein?
   - A. Bacteria naturally produce insulin for their own use.
   - B. The bacteria absorbed insulin from the growth medium.
   - C. The bacteria use the inserted human gene to build the protein.
   - D. Human cells were mixed into the culture with the bacteria.
   - **Key: C**


## Level 2 — average student (core)

### Clear Spots on the Lawn  
`micro-phage-plaques` · Bacteria & Viruses · BIO.4 · level 2 · 70 words · 4 questions

> (1) A student spread a lawn of _Escherichia coli_ on an agar plate and added a drop of liquid containing a **bacteriophage**, a virus that infects only bacteria. (2) A day later the lawn was cloudy except for clear spots where cells had burst. (3) Each phage is about 20 times smaller than a cell. (4) A second plate given phage but no bacteria stayed clear, and its phage count did not change.

1. **[BIO.4.a]** Which statement best explains why the phage count did not change on the second plate?
   - A. The phage needs a host cell to make copies of itself.
   - B. The phage died because the agar contained no sugar.
   - C. The phage was too small to be counted accurately.
   - D. The phage reproduces by binary fission very slowly.
   - **Key: A**

2. **[BIO.4.b]** The clear spots on the first plate are best explained by —
   - A. bacteria dividing faster where the drop landed
   - B. the phage entering cells and bursting them open
   - C. the agar drying out near the centre of the plate
   - D. bacteria taking in the phage particles as food
   - **Key: B**

3. **[BIO.4.c]** In sentence 1, a bacteriophage is best described as —
   - A. a bacterium that feeds on other bacteria
   - B. a plasmid that carries resistance genes
   - C. a virus that infects bacterial cells
   - D. a cell that has no nucleus
   - **Key: C**

4. **[BIO.4.a]** Which structure does the phage lack and therefore must use from the host cell?
   - A. genetic material
   - B. a protein coat
   - C. tail fibres
   - D. ribosomes
   - **Key: D**

### One Disc, Two Microbes  
`micro-antibiotic-discs` · Bacteria & Viruses · BIO.4 · level 2 · 116 words · 6 questions

> (1) A student tested whether an **antibiotic** could stop the growth of two microbes: a bacterium taken from spoiled soup and a cold virus grown in a thin layer of animal cells. (2) Each sample was spread on its own dish, and a paper disc soaked in the antibiotic was placed in the centre. (3) After two days the student measured the clear ring around each disc where nothing grew. (4) A disc soaked in plain water was placed on a third dish of the bacterium.
> 
> | Dish | Sample | Disc | Clear ring (mm) |
> |---|---|---|---|
> | 1 | Bacterium | Antibiotic | 18 |
> | 2 | Virus in animal cells | Antibiotic | 0 |
> | 3 | Bacterium | Water | 0 |
> 
> (5) The antibiotic works by blocking the enzyme that builds the bacterial cell wall.

1. **[BIO.4.e]** Which conclusion do the clear-ring results in the table best support?
   - A. The antibiotic stopped the virus but not the bacterium.
   - B. The antibiotic stopped the bacterium but not the virus.
   - C. Water was as effective as the antibiotic on the bacterium.
   - D. The virus killed the animal cells before the disc could act.
   - **Key: B**

2. **[BIO.4.c]** Which statement best explains why the antibiotic had no effect on the virus?
   - A. Viruses have no cell wall for the antibiotic to attack.
   - B. Viruses are too large for the drug to get inside them.
   - C. The animal cells absorbed all of the antibiotic first.
   - D. The virus had already become resistant to the drug.
   - **Key: A**

3. **[BIO.4.e]** Dish 3 was included in order to —
   - A. test whether plain water can kill viruses
   - B. give the bacteria extra moisture to grow
   - C. measure how quickly the bacteria divide
   - D. show that the paper disc alone does not stop growth
   - **Key: D**

4. **[BIO.4.e]** A classmate says this antibiotic should also cure the flu. Which response is most accurate?
   - A. Yes, because antibiotics kill every kind of microbe.
   - B. Yes, as long as a large enough dose is taken.
   - C. No, because the flu is caused by a virus, not a bacterium.
   - D. No, because the flu is caused by a fungus, not a bacterium.
   - **Key: C**

5. **[BIO.4.d]** The bacteria growing in the spoiled soup were acting as —
   - A. pathogens infecting a living host
   - B. decomposers breaking down food
   - C. producers making their own food
   - D. nitrogen fixers living in the soil
   - **Key: B**

6. **[BIO.4.e]** In sentence 1, an antibiotic is best described as —
   - A. a chemical that kills bacteria or stops their growth
   - B. a vaccine that trains the body to fight infection
   - C. a virus that infects and destroys bacterial cells
   - D. a protein made by the body to attack viruses
   - **Key: A**

### Hidden Phage, Sudden Burst  
`micro-lytic-lysogenic` · Bacteria & Viruses · BIO.4 · level 2 · 181 words · 6 questions

> (1) A lab group built a model of how a **bacteriophage** reproduces inside a bacterial cell. (2) The phage first attaches to the cell wall with its tail fibres and injects its DNA, leaving the protein **capsid** outside. (3) In the **lytic cycle**, the phage DNA takes over the host's ribosomes and enzymes, hundreds of new phages are assembled, and the cell bursts within about 30 minutes. (4) In the **lysogenic cycle**, the phage DNA instead joins the host chromosome and is copied each time the bacterium divides by binary fission, without harming the cell. (5) Stress such as ultraviolet light can switch the hidden phage DNA into the lytic cycle. (6) To test the model, the group infected a culture, split it into two flasks, and counted free phage particles over time, exposing one flask to UV light at 60 minutes.
> 
> | Time (min) | Free phages, no UV | Free phages, UV at 60 min |
> |---|---|---|
> | 0 | 100 | 100 |
> | 30 | 120 | 120 |
> | 60 | 130 | 130 |
> | 90 | 140 | 9,000 |
> | 120 | 150 | 9,200 |
> 
> (7) The slow rise without UV suggested that most infected cells were carrying the phage DNA silently.

1. **[BIO.4.b]** Based on the table, what did the UV light most likely do?
   - A. Killed the phages so that fewer were free in the flask.
   - B. Switched infected cells from the lysogenic to the lytic cycle.
   - C. Caused the bacteria to divide faster and dilute the phages.
   - D. Made the phages attach to the cell wall more tightly.
   - **Key: B**

2. **[BIO.4.a]** Which statement best explains why the phage needs the host's ribosomes?
   - A. Ribosomes copy the phage DNA into more DNA.
   - B. Ribosomes cut the cell wall so the phage can enter.
   - C. The phage has no ribosomes to build its capsid proteins.
   - D. The phage uses the ribosomes to store energy.
   - **Key: C**

3. **[BIO.4.b]** In sentence 4, the lysogenic cycle is the stage in which the phage DNA —
   - A. is copied along with the host chromosome without bursting the cell
   - B. takes over the cell and assembles hundreds of phages at once
   - C. remains outside the cell, held in place by the tail fibres
   - D. is broken down by the host cell's protective enzymes
   - **Key: A**

4. **[BIO.4.c]** Which part of the phage stays outside the bacterium during infection?
   - A. the DNA
   - B. the ribosomes
   - C. the plasmid
   - D. the capsid
   - **Key: D**

5. **[BIO.4.b]** Without UV, the count rose only from 100 to 150 over two hours. Which statement best explains this small rise?
   - A. A few infected cells went lytic while most stayed lysogenic.
   - B. Every infected cell burst and released one new phage.
   - C. The phages made copies of themselves in the liquid.
   - D. The bacteria built new phages as a defence.
   - **Key: A**

6. **[BIO.4.b]** Which statement accurately compares how the bacterium and the phage make more of themselves?
   - A. Both divide by binary fission on their own.
   - B. The bacterium divides on its own; the phage must use a host cell.
   - C. The phage divides on its own; the bacterium must be infected first.
   - D. Both need another cell's enzymes to reproduce.
   - **Key: B**

### Bumps on the Roots  
`micro-clover-nodules` · Bacteria & Viruses · BIO.4 · level 2 · 158 words · 6 questions

> (1) A student noticed small bumps on the roots of clover growing in a pasture in the Shenandoah Valley. (2) She learned that the bumps were **root nodules** housing **nitrogen-fixing bacteria**, which turn nitrogen gas from the air into ammonia the plant can use to build proteins. (3) In return the plant supplies the bacteria with sugar. (4) To test whether the bacteria really help the plant, she grew clover in sterilised sand with no nitrogen fertiliser. (5) Half the pots were dusted with a powder containing the live bacteria; the other half received sterile powder. (6) After six weeks she counted nodules and measured the dry mass of the plants.
> 
> | Treatment | Pots | Nodules per plant | Dry mass (g) |
> |---|---|---|---|
> | Live bacteria | 6 | 24 | 1.8 |
> | Sterile powder | 6 | 0 | 0.6 |
> 
> (7) Under the microscope the bacteria appeared as rod-shaped cells about 1 µm long with a cell wall but no nucleus. (8) Some cells had a whip-like **flagellum** that they used to swim toward the root.

1. **[BIO.4.d]** Which conclusion about the clover is best supported by the table?
   - A. The bacteria caused a disease that shrank the plants.
   - B. Clover with the bacteria grew larger than clover without them.
   - C. The sterile powder supplied nitrogen to the plants.
   - D. Nodules formed whether or not bacteria were present.
   - **Key: B**

2. **[BIO.4.d]** The relationship described in sentences 2 and 3 is one in which —
   - A. the bacteria harm the plant as pathogens
   - B. the plant decomposes the bacteria for food
   - C. both the plant and the bacteria benefit
   - D. the plant benefits and the bacteria are harmed
   - **Key: C**

3. **[BIO.4.d]** Why did the student use sterilised sand and no fertiliser?
   - A. So the only nitrogen available would be what the bacteria fixed.
   - B. So the sand would hold more water around the roots.
   - C. So the bacteria would grow faster in the pots.
   - D. So the plants would all start with the same mass.
   - **Key: A**

4. **[BIO.4.c]** In sentence 8, a flagellum is a structure used for —
   - A. attaching to other cells
   - B. swimming through liquid
   - C. building new proteins
   - D. storing the cell's DNA
   - **Key: B**

5. **[BIO.4.c]** Sentence 7 shows that the bacteria are —
   - A. eukaryotic, because they have a cell wall
   - B. viruses, because they are so small
   - C. prokaryotic, because they lack a nucleus
   - D. fungi, because they are rod-shaped
   - **Key: C**

6. **[BIO.4.b]** The bacteria inside a nodule increase in number by —
   - A. the lytic cycle, bursting the root cells
   - B. meiosis, producing gametes
   - C. being built by the plant's ribosomes
   - D. binary fission, producing identical cells
   - **Key: D**


## Level 3 — stretch

### The Spreading Plasmid  
`micro-plasmid-resistance` · Bacteria & Viruses · BIO.4 · level 3 · 158 words · 6 questions

> (1) A hospital lab tracked a strain of bacteria in which a small ring of DNA, a **plasmid**, carries a gene for resistance to the antibiotic cefrolin. (2) Bacteria pass plasmids to neighbours through a bridge called a pilus in a process known as **conjugation**, so the gene can spread even to cells that were not born with it. (3) The lab mixed resistant and non-resistant cells, divided the mixture into two flasks, and grew both for ten generations, adding cefrolin only to flask B.
> 
> | Generation | Flask A (no drug), % resistant | Flask B (with drug), % resistant |
> |---|---|---|
> | 0 | 5 | 5 |
> | 4 | 9 | 62 |
> | 10 | 12 | 97 |
> 
> (4) In flask B the drug killed most non-resistant cells, and the survivors divided by binary fission, each copying its plasmid. (5) In flask A the slow rise came from conjugation alone. (6) A later sample from flask B also carried a new **mutation** in a chromosomal gene that gave resistance to a second drug.

1. **[BIO.4.e]** Which statement best explains the rise to 97% resistant in flask B?
   - A. The drug caused the bacteria to mutate into resistant forms.
   - B. The bacteria learned to resist the drug after repeated exposure.
   - C. The drug switched on the resistance gene inside every cell.
   - D. Resistant cells survived and reproduced while the others died.
   - **Key: D**

2. **[BIO.4.b]** Which statement best explains why the percentage rose in flask A even without the drug?
   - A. Non-resistant cells died of old age.
   - B. Resistant cells reproduced much faster in the flask.
   - C. Plasmids were passed to non-resistant cells by conjugation.
   - D. The gene mutated in many cells at the same time.
   - **Key: C**

3. **[BIO.4.b]** In sentence 2, conjugation is best described as —
   - A. a bacterium splitting into two identical daughter cells
   - B. the transfer of DNA from one bacterial cell to another
   - C. a virus inserting its DNA into a bacterial chromosome
   - D. a random change in a bacterium's DNA sequence
   - **Key: B**

4. **[BIO.4.b]** Select TWO processes described in the passage that are sources of genetic variation in bacteria.
   - A. conjugation
   - B. binary fission
   - C. mutation
   - D. the lytic cycle
   - **Key: A and C**

5. **[BIO.4.c]** A plasmid differs from the bacterial chromosome because a plasmid —
   - A. is built from RNA instead of DNA
   - B. holds every gene the cell needs to live
   - C. is found only inside virus capsids
   - D. is a small extra ring that can be shared
   - **Key: D**

6. **[BIO.4.e]** Which conclusion about antibiotic use is best supported by the data?
   - A. Antibiotics should be stopped after a single generation.
   - B. Using an antibiotic selects for resistant bacteria in a population.
   - C. Antibiotics cause plasmids to appear inside bacteria.
   - D. Resistance disappears as soon as the drug is removed.
   - **Key: B**

### Four Flasks of Broth  
`micro-broth-flasks` · Bacteria & Viruses · BIO.4 · level 3 · 240 words · 6 questions

> (1) Before the **germ theory** was accepted, many people believed that microbes appeared on their own inside spoiled food. (2) A class repeated a classic experiment to test this idea. (3) Four flasks were filled with clear meat broth, and three of them were boiled to kill any microbes already present. (4) Flask 1 was then left open to the air. (5) Flask 2 was sealed with a stopper. (6) Flask 3 had a long neck bent into an S shape, so air could enter but dust and microbes settled in the bend and never reached the broth. (7) Flask 4 was not boiled and was left open. (8) The students checked each flask for cloudiness, a sign of microbial growth, after two days and after two weeks.
> 
> | Flask | Treatment | 2 days | 2 weeks |
> |---|---|---|---|
> | 1 | Boiled, open | Cloudy | Cloudy |
> | 2 | Boiled, sealed | Clear | Clear |
> | 3 | Boiled, S-neck | Clear | Clear |
> | 4 | Not boiled, open | Cloudy | Cloudy |
> 
> (9) When the students tipped flask 3 so the broth touched the dust in the bend, it turned cloudy within a day. (10) The teacher explained that the same logic supports **pasteurisation**, in which milk is heated briefly to kill most microbes and then kept sealed and cold. (11) To show that a particular microbe causes a particular disease, scientists later set out rules: the microbe must be found in every sick individual, be grown in pure culture, cause the same disease when given to a healthy host, and be recovered again from that host.

1. **[BIO.4.e]** Which conclusion is best supported by the results for flasks 1, 2 and 3?
   - A. Microbes appear on their own in any broth exposed to air.
   - B. Boiling changes the broth so that microbes can no longer live in it.
   - C. Microbes in the broth come from the air and dust, not from the broth itself.
   - D. Sealing a flask causes microbes to form inside it.
   - **Key: C**

2. **[BIO.4.e]** Why was flask 3 the most important flask in the experiment?
   - A. It let air in but kept microbes out, separating the two explanations.
   - B. It proved that boiling is unnecessary for keeping broth clear.
   - C. It showed that microbes need fresh air in order to grow.
   - D. It stayed clear because the broth inside it was never boiled.
   - **Key: A**

3. **[BIO.4.d]** The microbes that clouded flasks 1 and 4 were breaking down the broth's proteins for energy. In nature this same activity makes many bacteria important as —
   - A. producers
   - B. nitrogen fixers
   - C. pathogens
   - D. decomposers
   - **Key: D**

4. **[BIO.4.e]** In sentence 10, pasteurisation is best described as —
   - A. adding live bacteria to milk to make it thicker
   - B. sealing milk in bottles without heating it
   - C. heating milk briefly to kill most microbes
   - D. filtering milk through an S-shaped tube
   - **Key: C**

5. **[BIO.4.e]** A student wants to show that a particular bacterium causes a disease in fish at a Chesapeake Bay hatchery. Select TWO steps that follow the rules in sentence 11.
   - A. Grow the bacterium from a sick fish in pure culture.
   - B. Show that healthy fish given the pure culture develop the disease.
   - C. Treat the sick fish with antibiotics and see whether they recover.
   - D. Count how many bacteria live in the hatchery water.
   - **Key: A and B**

6. **[BIO.4.a]** Which statement explains why this experiment could not be done with a virus in place of bacteria?
   - A. Viruses are killed by air but not by boiling.
   - B. Viruses cannot multiply in broth because it contains no living cells.
   - C. Viruses are too large to pass through an S-shaped neck.
   - D. Viruses make broth turn clear rather than cloudy.
   - **Key: B**

### Outbreak at Two Schools  
`micro-vaccine-outbreak` · Bacteria & Viruses · BIO.4 · level 3 · 212 words · 6 questions

> (1) A county health office investigated an outbreak of a viral illness that spread through two neighbouring high schools. (2) The virus travels in droplets from coughs and, once inside a person, enters cells lining the throat and uses those cells' ribosomes and energy to make thousands of copies of itself. (3) The virus is a strand of RNA inside a protein **capsid**, wrapped in a fatty **envelope** taken from the host cell membrane. (4) Both schools had offered a **vaccine** in the autumn, which contains harmless pieces of the capsid protein so that the immune system learns to recognise the real virus and destroy it quickly. (5) The table shows how many students in each group became ill.
> 
> | Group | Students | Became ill | Rate (%) |
> |---|---|---|---|
> | North HS, vaccinated | 600 | 12 | 2 |
> | North HS, unvaccinated | 200 | 50 | 25 |
> | South HS, vaccinated | 300 | 6 | 2 |
> | South HS, unvaccinated | 500 | 120 | 24 |
> 
> (6) The nurse also swabbed throats: the virus's RNA was detected in 96 of 100 swabs from ill students but in none of 100 swabs from healthy students. (7) Several parents asked for antibiotics, but the office explained that antibiotics attack structures such as the bacterial cell wall, which this virus does not have. (8) Instead, ill students were told to rest, and their healthy classmates were offered the vaccine.

1. **[BIO.4.e]** Which conclusion do the rates in the table best support?
   - A. The vaccine made students at both schools more likely to become ill.
   - B. Vaccinated students became ill at a much lower rate than unvaccinated ones.
   - C. South HS had a lower overall rate of illness than North HS did.
   - D. The vaccine protected students at North HS but not at South HS.
   - **Key: B**

2. **[BIO.4.e]** Which observation gives the strongest evidence that this particular virus caused the illness?
   - A. The outbreak spread through two schools at the same time.
   - B. Several parents asked the office for antibiotics.
   - C. The virus travels in droplets released by coughing.
   - D. Viral RNA was found in ill students but not in healthy ones.
   - **Key: D**

3. **[BIO.4.e]** In sentence 4, the vaccine works by —
   - A. killing the virus directly once it reaches the throat
   - B. forming a barrier that keeps the virus out of the body
   - C. training the immune system to recognise the virus before infection
   - D. replacing the throat cells that the virus has damaged
   - **Key: C**

4. **[BIO.4.a]** Sentence 2 supports the idea that the virus is not alive on its own because the virus —
   - A. cannot make copies without a host cell's ribosomes and energy
   - B. is spread by coughing rather than by direct touch
   - C. carries its genetic information as RNA rather than DNA
   - D. has an envelope that came from the host cell membrane
   - **Key: A**

5. **[BIO.4.c]** Why was the office correct that antibiotics would not help the ill students?
   - A. Antibiotics only work in people who have already been vaccinated.
   - B. The virus has no cell wall or other bacterial structure for the drug to target.
   - C. Antibiotics attack the capsid, which the virus hides inside its envelope.
   - D. The virus is too small for the antibiotic molecules to reach it.
   - **Key: B**

6. **[BIO.4.e]** Why did the office offer the vaccine to healthy classmates rather than to students who were already ill?
   - A. The vaccine cures the illness as soon as symptoms begin to appear.
   - B. Healthy students carry a larger amount of the virus than ill ones.
   - C. Vaccines take time to build immunity, so they protect people before exposure.
   - D. The vaccine is a type of antibiotic that works only on healthy people.
   - **Key: C**


---

# Genetics & Heredity (BIO.5)

Standards in this unit:

- BIO.5.a — DNA has structure and is the foundation for protein synthesis
- BIO.5.b — the structural model of DNA has developed over time
- BIO.5.c — cell division and gamete formation pass genes to the next generation
- BIO.5.d — the variety of traits in an organism are the result of the expression of various combinations of alleles
- BIO.5.e — mutations and genetic variation
- BIO.5.f — synthetic biology has biological and ethical implications


## Level 1 — foundation

### Counting Root Tip Cells  
`gen-root-tip` · Genetics · BIO.5 · level 1 · 69 words · 5 questions

> (1) A student looked at a stained onion root tip under a microscope and sorted 200 cells by the stage of the **cell cycle** each one was in. (2) Onion body cells are diploid, with 16 chromosomes. (3) The results are in the table. (4) The student concluded that root tip cells spend most of their time growing, not dividing.
> 
> | Stage | Cells counted |
> |---|---|
> | Interphase | 168 |
> | Prophase | 14 |
> | Metaphase | 6 |
> | Anaphase | 5 |
> | Telophase | 7 |

1. **[BIO.5.c]** Which conclusion about the root tip cells is best supported by the counts in the table?
   - A. Most root tip cells were in interphase when the slide was made
   - B. Root tips contain more dividing cells than non-dividing cells
   - C. Anaphase lasts longer than prophase in root tip cells
   - D. Root tip cells copy their chromosomes during telophase
   - **Key: A**

2. **[BIO.5.c]** In sentence 1, the cell cycle is best described as —
   - A. the process that splits one diploid cell into four haploid gametes
   - B. the series of stages a cell passes through as it grows, copies its DNA and divides
   - C. the exchange of segments between two homologous chromosomes
   - D. the movement of a cell toward a chemical signal in its surroundings
   - **Key: B**

3. **[BIO.5.c]** How many chromosomes should each new cell have after a root tip cell finishes mitosis?
   - A. 4 chromosomes
   - B. 8 chromosomes
   - C. 16 chromosomes
   - D. 32 chromosomes
   - **Key: C**

4. **[BIO.5.c]** In which stage did the student see the chromosomes lined up across the middle of the cell?
   - A. Interphase
   - B. Prophase
   - C. Anaphase
   - D. Metaphase
   - **Key: D**

5. **[BIO.5.c]** The student next wants to compare the fraction of dividing cells in a root tip with the fraction in a mature leaf. The independent variable would be —
   - A. the total number of cells counted
   - B. the type of tissue placed on the slide
   - C. the stain used to color the chromosomes
   - D. the number of chromosomes in each cell
   - **Key: B**

### Tall and Short Pea Plants  
`gen-pea-cross` · Genetics · BIO.5 · level 1 · 63 words · 5 questions

> (1) In pea plants the allele for tall stems (T) is **dominant** to the allele for short stems (t). (2) A gardener crossed two tall plants that were both heterozygous (Tt) and counted the offspring. (3) The table shows the results. (4) The gardener then wanted to find out whether one of the tall offspring was TT or Tt.
> 
> | Phenotype | Number of plants |
> |---|---|
> | Tall | 61 |
> | Short | 19 |

1. **[BIO.5.d]** Which ratio of tall to short plants is closest to the results in the table?
   - A. 3 tall : 1 short
   - B. 1 tall : 1 short
   - C. 1 tall : 2 short
   - D. 9 tall : 3 short
   - **Key: A**

2. **[BIO.5.d]** What percentage of the offspring of a Tt × Tt cross are expected to be homozygous recessive?
   - A. 0%
   - B. 25%
   - C. 50%
   - D. 75%
   - **Key: B**

3. **[BIO.5.d]** In sentence 1, calling the tall allele dominant means that —
   - A. tall plants are more common than short plants in every population
   - B. a plant must have two T alleles to grow tall
   - C. the T allele changes any t allele next to it into a T allele
   - D. the tall trait appears whenever at least one T allele is present
   - **Key: D**

4. **[BIO.5.d]** To find out whether the tall plant in sentence 4 is TT or Tt, the gardener should cross it with a —
   - A. tall plant known to be TT
   - B. second tall plant of unknown genotype
   - C. short plant, which must be tt
   - D. plant grown from the same seed pod
   - **Key: C**

5. **[BIO.5.d]** If the cross in sentence 4 produced some short offspring, the tall parent's genotype must be —
   - A. TT, because tall is the dominant trait
   - B. Tt, because a short offspring needs a t allele from each parent
   - C. tt, because it produced short offspring
   - D. TT, because short offspring appear in every cross
   - **Key: B**

### Pink Snapdragons  
`gen-snapdragon` · Genetics · BIO.5 · level 1 · 65 words · 5 questions

> (1) A florist crossed a red-flowered snapdragon with a white-flowered snapdragon, and every offspring had pink flowers. (2) In snapdragons, flower color shows **incomplete dominance**: the heterozygote has a phenotype between those of the two parents. (3) She writes red plants as RR, white plants as WW and pink plants as RW. (4) Next she crossed two of the pink plants with each other and grew 120 seedlings.

1. **[BIO.5.d]** How many of the 120 seedlings from the pink × pink cross are expected to have white flowers?
   - A. 30 of 120
   - B. 0 of 120
   - C. 60 of 120
   - D. 90 of 120
   - **Key: A**

2. **[BIO.5.d]** In sentence 2, incomplete dominance means that —
   - A. one allele completely hides the other allele in the heterozygote
   - B. both parent phenotypes appear side by side in the heterozygote
   - C. the heterozygote shows a phenotype between the two homozygous phenotypes
   - D. the trait is controlled by a gene carried on the X chromosome
   - **Key: C**

3. **[BIO.5.d]** The expected phenotype ratio among the offspring of the pink × pink cross is —
   - A. 3 pink : 1 white
   - B. 1 red : 2 pink : 1 white
   - C. 4 pink : 0 white
   - D. 1 red : 1 white
   - **Key: B**

4. **[BIO.5.d]** Which statement best explains why none of the offspring in sentence 1 were red or white?
   - A. Each offspring got one R and one W allele, and neither allele is fully dominant
   - B. The red allele is recessive, so red could not appear in the first generation
   - C. The offspring inherited a new pink allele that formed when the gametes fused
   - D. Crossing over during meiosis removed the red and white alleles from the gametes
   - **Key: A**

5. **[BIO.5.d]** A gardener who wants seedlings that are all red should cross —
   - A. a pink plant with a pink plant
   - B. a red plant with a pink plant
   - C. a red plant with a white plant
   - D. a red plant with a red plant
   - **Key: D**

### Where a Mutation Happens  
`gen-mouse-mutation` · Genetics · BIO.5 · level 1 · 110 words · 6 questions

> (1) A researcher keeps a colony of gray mice. (2) One mouse develops a white patch of fur on its back after strong ultraviolet light hit its skin. (3) The patch is a **somatic mutation**, a change in the DNA of one body cell. (4) That mouse is bred with a gray mouse, and all 24 pups are gray. (5) In a second colony, a pup is born all white and later passes the trait to half of its offspring. (6) The researcher decides the second trait began as a **germ-line mutation** in a parent's egg or sperm. (7) She notes that mutation is one source of variation; meiosis also shuffles existing alleles into new combinations.

1. **[BIO.5.e]** Which statement best explains why all 24 pups in sentence 4 were gray?
   - A. The white allele is recessive and was hidden in the pups
   - B. Ultraviolet light only changes the fur of adult mice
   - C. The mutation was in skin cells, not in the cells that make gametes
   - D. The pups inherited the mutation but it will appear when they are older
   - **Key: C**

2. **[BIO.5.e]** In sentence 3, a somatic mutation is best described as a change in the DNA of —
   - A. a body cell, which is not passed on to offspring
   - B. a gamete, which is passed on to every offspring
   - C. a virus that infected the mouse's skin
   - D. a chromosome that is lost during meiosis
   - **Key: A**

3. **[BIO.5.e]** Which observation is the best evidence that the white fur in sentence 5 is heritable?
   - A. The pup was born white rather than turning white later
   - B. The trait appeared in the pup's own offspring
   - C. The pup's skin had never been exposed to ultraviolet light
   - D. White fur is easy to see against gray littermates
   - **Key: B**

4. **[BIO.5.d]** The white mouse in sentence 5 passed the trait to half of its offspring when bred with gray mice. If white is dominant to gray, the white mouse's genotype was most likely —
   - A. homozygous dominant
   - B. heterozygous
   - C. homozygous recessive
   - D. haploid
   - **Key: B**

5. **[BIO.5.c]** In sentence 7, meiosis creates new combinations of existing alleles mainly through —
   - A. DNA replication and cytokinesis
   - B. mutation and ultraviolet light
   - C. binary fission and budding
   - D. crossing over and independent assortment
   - **Key: D**

6. **[BIO.5.e]** Which change would be classified as a chromosomal mutation rather than a point mutation?
   - A. A whole section of one chromosome is duplicated
   - B. A single base pair in a gene is swapped for another
   - C. One base is added in the middle of a gene
   - D. A gene is copied into mRNA with one wrong base
   - **Key: A**


## Level 2 — average student (core)

### Modeling Meiosis  
`gen-meiosis-model` · Genetics · BIO.5 · level 2 · 126 words · 6 questions

> (1) A class used pipe cleaners to model meiosis in an imaginary animal whose body cells are **diploid**, with 8 chromosomes. (2) Each homologous pair was one red and one blue pipe cleaner of the same length. (3) In prophase I, students swapped a segment between a red and a blue homolog to show **crossing over**. (4) At metaphase I, each pair lined up so that red or blue could face either pole. (5) One group made an error: a pair failed to separate in anaphase I, so two of their gametes had 5 chromosomes and two had 3. (6) The table lists the chromosome counts for a correct model.
> 
> | Cell | Chromosomes |
> |---|---|
> | Body cell before meiosis | 8 |
> | Each cell after meiosis I | 4 |
> | Each gamete | 4 |
> | Zygote after fertilization | 8 |

1. **[BIO.5.d]** The animal is heterozygous (Bb) for a fur-color gene. Based on the table, which statement about its gametes is correct?
   - A. Every gamete carries both B and b on 8 chromosomes
   - B. Half the gametes carry B and half carry b, each on 4 chromosomes
   - C. All gametes carry B because it is the dominant allele
   - D. Gametes carry 4 chromosomes but no fur-color alleles
   - **Key: B**

2. **[BIO.5.c]** In sentence 1, a diploid cell is one that —
   - A. has two complete sets of chromosomes, one from each parent
   - B. has a single set of chromosomes and can act as a gamete
   - C. has copied its DNA twice before it divides
   - D. contains exactly two chromosomes in total
   - **Key: A**

3. **[BIO.5.e]** What is the main result of the step described in sentence 3?
   - A. The number of chromosomes in each gamete is cut in half
   - B. Sister chromatids are pulled to opposite poles of the cell
   - C. Homologous chromosomes end up with new combinations of alleles
   - D. The cell copies its DNA a second time before dividing
   - **Key: C**

4. **[BIO.5.c]** The arrangement described in sentence 4 models —
   - A. nondisjunction of one pair
   - B. independent assortment
   - C. fertilization of a gamete
   - D. cytokinesis after anaphase
   - **Key: B**

5. **[BIO.5.c]** The error in sentence 5 is called nondisjunction. If a gamete with 5 chromosomes fused with a normal gamete, the zygote would have —
   - A. 9 chromosomes, one more than the normal diploid number
   - B. 8 chromosomes, because fertilization always restores the diploid number
   - C. 10 chromosomes, because both gametes were abnormal
   - D. 5 chromosomes, because the abnormal gamete sets the count
   - **Key: A**

6. **[BIO.5.c]** Which statement correctly contrasts this model with mitosis in the same animal?
   - A. Mitosis makes four cells with 4 chromosomes each; meiosis makes two cells with 8 each
   - B. Mitosis includes crossing over between homologs; meiosis does not
   - C. Mitosis produces the animal's gametes; meiosis produces its body cells
   - D. Mitosis makes two identical cells with 8 chromosomes each; meiosis makes four cells with 4 each
   - **Key: D**

### Reading a Mutated Gene  
`gen-mutant-yeast` · Genetics · BIO.5 · level 2 · 134 words · 6 questions

> (1) A lab compared a short stretch of a normal gene with the same stretch from three mutant strains of yeast. (2) The DNA was transcribed into mRNA and the codons were translated. (3) A **point mutation** changes a single base; a **frameshift mutation** adds or removes a base and shifts every codon that follows. (4) The table shows the first four mRNA codons of each strain and the amino acids they code for. (5) The normal protein is an enzyme that breaks down a sugar, and each strain was tested for whether it could still grow on that sugar.
> 
> | Strain | mRNA codons | Amino acids | Grows on sugar? |
> |---|---|---|---|
> | Normal | AUG GGU UUA CAA | Met-Gly-Leu-Gln | yes |
> | Strain 1 | AUG GGC UUA CAA | Met-Gly-Leu-Gln | yes |
> | Strain 2 | AUG GGU UAA CAA | Met-Gly-STOP | no |
> | Strain 3 | AUG UGG UUU ACA | Met-Trp-Phe-Thr | no |

1. **[BIO.5.e]** Which strain has a point mutation that did not change the protein?
   - A. Strain 2
   - B. Strain 1
   - C. Strain 3
   - D. None of the strains
   - **Key: B**

2. **[BIO.5.e]** Which statement best explains why Strain 2 cannot grow on the sugar?
   - A. A base change created a stop codon, so the enzyme is cut short and cannot work
   - B. An extra base shifted every codon after the first one
   - C. The mutation changed the first codon, so translation never began
   - D. The mutation was silent, so the enzyme was made but then broke down
   - **Key: A**

3. **[BIO.5.e]** In sentence 3, a frameshift mutation is a mutation that —
   - A. swaps one base for another without changing the reading frame
   - B. moves a whole gene to a different chromosome
   - C. adds or deletes a base so the codons after it are read differently
   - D. changes one codon into a stop codon
   - **Key: C**

4. **[BIO.5.e]** Which strain in the table shows a frameshift mutation, and what evidence supports that?
   - A. Strain 1, because one codon changed
   - B. Strain 2, because translation stopped early
   - C. Strain 3, because it has one fewer codon than normal
   - D. Strain 3, because every amino acid after Met is different
   - **Key: D**

5. **[BIO.5.d]** The "Grows on sugar?" column of the table records each strain's —
   - A. genotype
   - B. phenotype
   - C. allele
   - D. codon
   - **Key: B**

6. **[BIO.5.c]** A stop-codon mutation like the one in Strain 2 appears in a sperm cell of a mouse. Which statement is correct?
   - A. The mutation cannot be inherited because it is not in a body cell
   - B. The mutation will affect only the skin cells of that mouse
   - C. Fertilization repairs mutations in gametes before the zygote forms
   - D. An offspring formed from that sperm would carry the mutation in all its cells
   - **Key: D**

### A Pedigree for Color Blindness  
`gen-colorblind-pedigree` · Genetics · BIO.5 · level 2 · 164 words · 6 questions

> (1) Red-green color blindness is caused by a recessive allele on the X chromosome, so it is a **sex-linked** trait. (2) A genetics student writes the normal allele as XN and the color-blind allele as Xc. (3) Males have one X chromosome and one Y chromosome; females have two X chromosomes. (4) The student drew a pedigree for three generations of a family and listed each person in the table. (5) A female who has one Xc allele but normal vision is a **carrier**. (6) The student noticed that every color-blind person in the family was male and that the trait skipped a generation. (7) II-2 married into the family and comes from a family with no history of color blindness. (8) The student wants to predict the chance that the next son of II-1 and II-2 will be color-blind.
> 
> | Person | Sex | Vision | Parents |
> |---|---|---|---|
> | I-1 | male | color-blind | — |
> | I-2 | female | normal | — |
> | II-1 | female | normal | I-1, I-2 |
> | II-2 | male | normal | — |
> | III-1 | male | color-blind | II-1, II-2 |
> | III-2 | female | normal | II-1, II-2 |

1. **[BIO.5.d]** Based on the table, what is the genotype of II-1?
   - A. XN XN
   - B. XN Xc
   - C. Xc Xc
   - D. Xc Y
   - **Key: B**

2. **[BIO.5.d]** In sentence 5, a carrier is a person who —
   - A. shows the recessive trait and can pass it to children
   - B. has two copies of the recessive allele but shows no symptoms
   - C. has one recessive allele, shows the normal phenotype, and can pass it on
   - D. has inherited the trait from both parents but shows it mildly
   - **Key: C**

3. **[BIO.5.c]** III-1 is color-blind. Which statement explains why his Xc allele must have come from his mother, II-1?
   - A. Sons receive their X chromosome from their mother and their Y from their father
   - B. Fathers cannot pass any of their alleles to their sons
   - C. The Xc allele acts as a dominant allele in males
   - D. Mothers always pass on their recessive allele to sons
   - **Key: A**

4. **[BIO.5.d]** What is the chance that the next son of II-1 and II-2 will be color-blind?
   - A. 0%
   - B. 25%
   - C. 50%
   - D. 100%
   - **Key: C**

5. **[BIO.5.d]** Which statement best explains the student's observation in sentence 6 that every color-blind person was male?
   - A. The color-blind allele is found only on the Y chromosome
   - B. A male needs only one Xc allele to be color-blind, but a female needs two
   - C. Females cannot inherit the Xc allele from their fathers
   - D. Males carry more X chromosomes than females do
   - **Key: B**

6. **[BIO.5.e]** The Xc allele most likely first appeared in the human population as —
   - A. an extra chromosome gained through nondisjunction
   - B. a habit learned by looking at faded colors
   - C. a gene transferred from a virus into the Y chromosome
   - D. a mutation in the color-vision gene on an X chromosome
   - **Key: D**

### Bands on a Gel  
`gen-bear-gel` · Genetics · BIO.5 · level 2 · 183 words · 6 questions

> (1) A wildlife rescue center in the Shenandoah Valley has a black bear cub born to a known mother and wants to learn which of three males is its father. (2) Technicians cut DNA from each animal with the same restriction enzyme and ran the fragments through **gel electrophoresis**. (3) DNA is negatively charged, so the fragments move toward the positive end of the gel, with smaller fragments traveling farther. (4) The result is a **DNA fingerprint**: a pattern of bands that is unique to each individual. (5) A cub inherits half its bands from each parent, so every band in the cub must match a band in its mother or its father. (6) The table lists how far each band traveled from the wells, in millimeters. (7) The center keeps the bears' DNA profiles in a database, and a staff member asks whether the same technique could be used on people without their consent.
> 
> | Sample | Bands (mm from wells) |
> |---|---|
> | Cub | 12, 20, 31, 44 |
> | Mother | 12, 31, 38, 50 |
> | Male A | 20, 27, 44, 50 |
> | Male B | 15, 20, 31, 38 |
> | Male C | 12, 25, 31, 44 |

1. **[BIO.5.f]** Based on the table, which male is most likely the cub's father?
   - A. Male A, because it has both cub bands that did not come from the mother
   - B. Male B, because it shares the most bands with the mother
   - C. Male C, because it shares the 12 mm band with the cub
   - D. None of them, because no male matches all four cub bands
   - **Key: A**

2. **[BIO.5.f]** In sentence 2, gel electrophoresis is a technique that —
   - A. copies a DNA sample millions of times
   - B. separates DNA fragments by size using an electric field
   - C. cuts DNA at one specific base sequence
   - D. inserts a new gene into a bacterial plasmid
   - **Key: B**

3. **[BIO.5.f]** Which band in the cub's sample is the smallest DNA fragment?
   - A. the band at 12 mm
   - B. the band at 20 mm
   - C. the band at 31 mm
   - D. the band at 44 mm
   - **Key: D**

4. **[BIO.5.c]** Sentence 5 says the cub got half its bands from each parent. This is because —
   - A. mitosis in the cub cuts every chromosome in half
   - B. the restriction enzyme removes the father's DNA from the cub
   - C. each gamete is haploid, and fertilization joins one set from each parent
   - D. the cub's DNA mutates until it matches each parent
   - **Key: C**

5. **[BIO.5.d]** The cub's band at 31 mm appears in the mother but not in Male A. Which statement is correct?
   - A. The cub must have inherited that fragment from the mother
   - B. Male A cannot be the father of the cub
   - C. The band arose by a new mutation in the cub
   - D. The band came from the father's Y chromosome
   - **Key: A**

6. **[BIO.5.f]** Which statement best describes the concern raised in sentence 7?
   - A. The technique cannot separate human DNA fragments by size
   - B. Storing a person's DNA profile without consent raises privacy issues
   - C. Human DNA fingerprints change too often to be stored
   - D. Restriction enzymes cannot cut human DNA outside a hospital
   - **Key: B**


## Level 3 — stretch

### Two Traits in Corn Kernels  
`gen-corn-dihybrid` · Genetics · BIO.5 · level 3 · 158 words · 6 questions

> (1) An agriculture class studied two kernel traits in corn. (2) Purple color (P) is dominant to yellow (p), and smooth texture (S) is dominant to wrinkled (s). (3) The two genes are on different chromosomes. (4) The class crossed two plants that were **heterozygous** for both traits (PpSs × PpSs) and counted the kernels on the resulting ears. (5) Before counting, the students predicted a 9:3:3:1 phenotype ratio from a 16-box Punnett square. (6) The table shows the counts from 320 kernels. (7) One student argued that because purple, smooth kernels were the most common, that is what makes the P and S alleles dominant. (8) The teacher pointed out that how common a phenotype is does not define dominance. (9) The class hopes to develop a true-breeding purple, smooth line for a seed company. (10) To start, they crossed one purple, smooth plant of unknown genotype with a yellow, wrinkled plant.
> 
> | Phenotype | Kernels counted |
> |---|---|
> | Purple, smooth | 182 |
> | Purple, wrinkled | 58 |
> | Yellow, smooth | 61 |
> | Yellow, wrinkled | 19 |

1. **[BIO.5.d]** Which conclusion is best supported by the counts in the table?
   - A. The results are close to the predicted 9:3:3:1 ratio
   - B. The results show a 3:1 ratio because only one gene matters
   - C. Purple and smooth are dominant because they are the most common
   - D. The two genes must be located on the same chromosome
   - **Key: A**

2. **[BIO.5.d]** What fraction of the kernels from the PpSs × PpSs cross are expected to be homozygous recessive for both traits (ppss)?
   - A. 9/16
   - B. 3/16
   - C. 1/4
   - D. 1/16
   - **Key: D**

3. **[BIO.5.d]** In sentence 4, a plant that is heterozygous for both traits —
   - A. has two identical alleles for each of the two genes
   - B. shows the recessive phenotype for both traits
   - C. carries one dominant and one recessive allele for each gene
   - D. produces only one kind of gamete for the two genes
   - **Key: C**

4. **[BIO.5.f]** To produce the true-breeding line in sentence 9, the class should —
   - A. plant purple, smooth kernels from PpSs × PpSs crosses every year
   - B. breed together purple, smooth plants shown by test crosses to be PPSS
   - C. cross purple, smooth plants with yellow, wrinkled plants every year
   - D. grow only the yellow, wrinkled kernels, since those are homozygous
   - **Key: B**

5. **[BIO.5.c]** Sentence 3 matters for the prediction in sentence 5 because genes on different chromosomes —
   - A. are always inherited together as one unit
   - B. cannot be either dominant or recessive
   - C. are sorted into gametes independently of each other
   - D. are copied more often during interphase
   - **Key: C**

6. **[BIO.5.d]** The cross in sentence 10 produced 40 purple, smooth kernels and 40 purple, wrinkled kernels and no yellow kernels. Select TWO conclusions supported by this result.
   - A. The unknown plant is homozygous PP for color
   - B. The unknown plant is heterozygous Ss for texture
   - C. The unknown plant is heterozygous Pp for color
   - D. The unknown plant is homozygous SS for texture
   - **Key: A and B**

### Blood Types in a Family  
`gen-blood-types` · Genetics · BIO.5 · level 3 · 228 words · 6 questions

> (1) Human ABO blood type is controlled by one gene with three alleles, written IA, IB and i. (2) The IA and IB alleles are **codominant**: a person with both makes both markers on red blood cells and has type AB blood. (3) The i allele is recessive, so type O blood requires two copies of it. (4) A genetics counselor in Richmond recorded a family's blood types in the table. (5) The mother has type A blood, and her own parents were types A and O. (6) The father has type B blood, and one of his parents was type O. (7) The couple has three children and is expecting a fourth. (8) The counselor used a Punnett square to predict the chances for the fourth child. (9) She reminded the family that blood type is decided at **fertilization**, when the sperm and egg each contribute one allele. (10) The parents asked whether Child 1, with type O blood, could really be theirs, and the counselor showed that it could. (11) One child asked whether AB blood is a blend, like a pink snapdragon; the counselor explained that in codominance both alleles are fully expressed, not blended. (12) She added that the i allele arose long ago as a mutation that stops the enzyme that builds the A or B marker.
> 
> | Person | Blood type |
> |---|---|
> | Mother | A |
> | Father | B |
> | Child 1 | O |
> | Child 2 | AB |
> | Child 3 | B |

1. **[BIO.5.d]** Based on the table and sentences 5 and 6, what are the genotypes of the mother and the father?
   - A. IA IA and IB IB
   - B. IA IB and i i
   - C. IA i and IB IB
   - D. IA i and IB i
   - **Key: D**

2. **[BIO.5.d]** In sentence 2, codominant means that —
   - A. the heterozygote shows a blend of the two phenotypes
   - B. one allele masks the other allele in the heterozygote
   - C. both alleles are fully expressed in the heterozygote
   - D. the trait is more common than any other blood type
   - **Key: C**

3. **[BIO.5.d]** What is the chance that the fourth child will have type O blood?
   - A. 0%
   - B. 25%
   - C. 50%
   - D. 75%
   - **Key: B**

4. **[BIO.5.c]** Sentence 9 says blood type is decided at fertilization. Which statement explains why each parent contributes only one allele?
   - A. Meiosis separates a parent's two alleles into different gametes, so each gamete carries one
   - B. Mitosis destroys one of the two alleles in each parent before reproduction
   - C. Only the dominant allele of a pair is able to enter a gamete
   - D. Each gamete carries both alleles, but one is deleted after fertilization
   - **Key: A**

5. **[BIO.5.e]** Based on sentence 12, why does a person with genotype i i have neither the A nor the B marker?
   - A. The i allele is carried on the Y chromosome
   - B. The i allele makes a marker that is too small to detect
   - C. Both copies of the gene carry the mutation, so no working enzyme is made
   - D. Type O red blood cells lack the ribosomes needed to build markers
   - **Key: C**

6. **[BIO.5.d]** Select TWO statements about this family that are supported by the passage and the table.
   - A. Child 1, with type O blood, is a possible biological child of these parents
   - B. The fourth child could be born with type AB blood
   - C. These parents cannot have a child with type A blood
   - D. Child 2 must have inherited the IA allele from the father
   - **Key: A and B**

### Editing a Gene in Mice  
`gen-gene-editing` · Genetics · BIO.5 · level 3 · 234 words · 6 questions

> (1) A research team is testing a **gene-editing** tool that uses a guide molecule to find a specific DNA sequence and an enzyme to cut it, so that the cell's repair machinery can replace a faulty allele with a working copy. (2) The team works with a strain of mice that carries a recessive point mutation in a gene for a liver enzyme; mice with two mutant alleles cannot break down a certain amino acid and become sick on a normal diet. (3) In Trial 1, the tool was injected into the livers of adult sick mice. (4) In Trial 2, the tool was applied to fertilized mouse eggs before the first cell division. (5) The table shows the results. (6) Mice treated as adults improved, but their offspring were all born sick. (7) Mice edited as eggs were healthy, and so were their offspring. (8) In a few Trial 2 mice, the enzyme also cut at a second, unintended site, producing a new mutation. (9) The team's report noted that editing eggs is a **germ-line** change that will be passed to every future generation, and asked whether the same approach should ever be used on human embryos. (10) A second group argued that treating adults, whose edits are somatic and not inherited, raises fewer ethical concerns.
> 
> | Trial | Cells edited | Treated mice healthy | Offspring healthy |
> |---|---|---|---|
> | 1 | adult liver cells | 18 of 20 | 0 of 60 |
> | 2 | fertilized eggs | 19 of 20 | 60 of 60 |

1. **[BIO.5.f]** Which conclusion is best supported by the results of the two trials in the table?
   - A. Editing adult liver cells cured the mice and also cured their offspring
   - B. Neither trial improved the health of the treated mice
   - C. Editing adults worked better than editing eggs for the treated mice
   - D. Editing fertilized eggs produced healthy mice whose offspring were also healthy
   - **Key: D**

2. **[BIO.5.e]** Which statement best explains why the offspring in Trial 1 were all born sick?
   - A. The edited liver cells were somatic cells, so the parents' gametes still carried the mutant allele
   - B. The working allele is recessive, so it was hidden in the offspring
   - C. A liver enzyme is a protein, and proteins cannot be inherited by offspring
   - D. The tool cut the parents' gametes at the wrong site and destroyed them
   - **Key: A**

3. **[BIO.5.c]** Why did the edit in Trial 2 end up in every cell of the treated mice, including their gametes?
   - A. The tool spread from cell to cell through the bloodstream
   - B. The egg was edited before the first division, so mitosis copied the edited DNA into every cell
   - C. Meiosis in the fertilized egg produced four edited cells that built the body
   - D. The enzyme kept cutting and repairing DNA in each new cell as it formed
   - **Key: B**

4. **[BIO.5.f]** In sentence 9, a germ-line change is one that —
   - A. occurs in cells that will form gametes and can be inherited
   - B. affects only the liver cells where it was made
   - C. is caused by a germ such as a bacterium or a virus
   - D. is always harmful to the organism that was treated
   - **Key: A**

5. **[BIO.5.d]** The mice in sentence 2 are sick only when they carry two mutant alleles. If the tool repaired just one of the two alleles in a cell, that cell would —
   - A. still lack the enzyme, because the working allele is recessive
   - B. make half as much mutant protein and stay sick
   - C. make the enzyme, because one working copy of the dominant allele is enough
   - D. need a second mutation before it could become healthy
   - **Key: C**

6. **[BIO.5.f]** Which statement best summarizes the ethical concern raised in sentences 8 through 10?
   - A. Editing adult body cells is riskier than editing embryos because adults have more cells
   - B. An unintended mutation in an edited embryo could be inherited by all later generations
   - C. Animals cannot consent, so no gene editing of mice should ever be performed
   - D. The repaired liver enzyme could spread to other species through the food chain
   - **Key: B**


---

# DNA & Protein Synthesis (BIO.2 · BIO.5)

Standards in this unit:

- BIO.2.d — protein synthesis: DNA as the code for proteins
- BIO.5.a — DNA has structure and is the foundation for protein synthesis
- BIO.5.b — the structural model of DNA has developed over time


## Level 1 — foundation

### Building a Nucleotide Model  
`dna-nucleotide-kit` · DNA & Proteins · BIO.5 / BIO.2 · level 1 · 69 words · 5 questions

> (1) A biology class builds a short piece of DNA from a model kit. (2) Each **nucleotide** snaps together from three pieces: a phosphate group, a deoxyribose sugar and one nitrogen base. (3) The sugars and phosphates link into two long backbones, and the bases meet in the middle. (4) One strand the class builds reads 5'-ATGCCA-3'. (5) A student notices that A fits only across from T, and G only across from C.

1. **[BIO.5.a]** In sentence 2, a nucleotide is best described as —
   - A. a single nitrogen base floating free inside the nucleus
   - B. a phosphate, a sugar and a base joined as one unit
   - C. one complete turn of the double helix
   - D. the weak bond that holds two paired bases together
   - **Key: B**

2. **[BIO.5.a]** The strand that pairs with 5'-ATGCCA-3' in sentence 4 would read, base for base, —
   - A. 3'-TACGGT-5'
   - B. 3'-ATGCCA-5'
   - C. 3'-UACGGU-5'
   - D. 3'-GCATTG-5'
   - **Key: A**

3. **[BIO.5.a]** According to sentence 3, the backbone of each strand is made of —
   - A. paired nitrogen bases held by hydrogen bonds
   - B. nitrogen bases linked directly to each other
   - C. phosphate groups linked to each other with no sugar
   - D. alternating sugar and phosphate groups
   - **Key: D**

4. **[BIO.5.a]** Which statement best explains the observation in sentence 5 of the notes?
   - A. A and T are the same size, so they take up the same space
   - B. A and T are both attached to the sugar deoxyribose
   - C. A and T have shapes that fit and form hydrogen bonds with each other
   - D. A and T are joined to each other by a strong covalent bond
   - **Key: C**

5. **[BIO.5.a]** The finished model has 12 base pairs, and 5 of them are A-T pairs. How many guanine nucleotides does the model contain?
   - A. 5
   - B. 7
   - C. 12
   - D. 14
   - **Key: B**

### Two Nucleic Acids, One Cell  
`dna-two-nucleic-acids` · DNA & Proteins · BIO.5 / BIO.2 · level 1 · 70 words · 5 questions

> (1) A student compares two nucleic acid samples taken from the same cell. (2) Sample 1 came from the nucleus, has two strands and contains the sugar deoxyribose. (3) Sample 2 came from the cytoplasm, has a single strand and contains the sugar ribose. (4) When the bases are listed, Sample 2 contains **uracil** but no thymine. (5) Sample 2 also breaks down within hours, while Sample 1 lasts for the life of the cell.

1. **[BIO.5.a]** Which identification of the two samples is correct?
   - A. Sample 1 is RNA and Sample 2 is DNA
   - B. Sample 1 is DNA and Sample 2 is RNA
   - C. Both samples are DNA from different chromosomes
   - D. Both samples are RNA, one folded and one unfolded
   - **Key: B**

2. **[BIO.2.d]** In sentence 4, uracil is best described as —
   - A. the five-carbon sugar that is found only in RNA
   - B. a base that pairs with guanine in place of cytosine
   - C. a base that pairs with adenine in RNA in place of thymine
   - D. the phosphate group that links RNA nucleotides together
   - **Key: C**

3. **[BIO.2.d]** If Sample 2 was copied from a DNA template strand reading 3'-TACGGA-5', its sequence would be —
   - A. 5'-AUGCCU-3'
   - B. 5'-ATGCCT-3'
   - C. 5'-UACGGA-3'
   - D. 5'-AUGCCA-3'
   - **Key: A**

4. **[BIO.2.d]** Which statement best explains why Sample 2 breaks down quickly (sentence 5)?
   - A. RNA is destroyed because its single strand is too long to fold properly
   - B. DNA is broken down each time a protein is made from it
   - C. RNA lasts longer only when it remains inside the nucleus
   - D. mRNA is a temporary copy of a gene, while DNA is the cell's permanent record
   - **Key: D**

5. **[BIO.5.a]** Which feature do Sample 1 and Sample 2 share?
   - A. the five-carbon sugar deoxyribose in every nucleotide
   - B. a single strand of nucleotides folded back on itself
   - C. nucleotides made of a sugar, a phosphate and a base
   - D. the nitrogen base thymine paired with adenine
   - **Key: C**

### From Gene to Ribosome  
`dna-gene-to-ribosome` · DNA & Proteins · BIO.5 / BIO.2 · level 1 · 100 words · 6 questions

> (1) A student traces how a cell in the pancreas makes a digestive enzyme. (2) First, an enzyme unzips a section of DNA in the nucleus and builds a strand of messenger RNA (mRNA) that matches the **template** strand of the gene. (3) This step is called transcription. (4) The mRNA leaves the nucleus through a nuclear pore and attaches to a ribosome in the cytoplasm. (5) Transfer RNA (tRNA) molecules bring amino acids to the ribosome, which links them in the order the mRNA spells out. (6) This second step is called translation. (7) The start of the template strand the student is studying reads 3'-TACAAAGGC-5'.

1. **[BIO.2.d]** The mRNA transcribed from the template strand in sentence 7 would read —
   - A. 5'-AUGUUUCCG-3'
   - B. 5'-ATGTTTCCG-3'
   - C. 5'-UACAAAGGC-3'
   - D. 5'-AUGUUUCCC-3'
   - **Key: A**

2. **[BIO.2.d]** Based on the passage, transcription and translation take place, respectively, —
   - A. in the cytoplasm and in the nucleus
   - B. in the nucleus and at a ribosome in the cytoplasm
   - C. at a ribosome and at a nuclear pore
   - D. at a nuclear pore and inside the nucleus
   - **Key: B**

3. **[BIO.2.d]** In sentence 2, the template strand is —
   - A. the strand of mRNA that carries the message to the ribosome
   - B. the protein that unzips the DNA at the start of transcription
   - C. the strand of DNA that stays attached to the ribosome
   - D. the DNA strand whose bases are read to build a complementary mRNA
   - **Key: D**

4. **[BIO.2.d]** Which statement correctly describes the job of tRNA in this cell?
   - A. It carries the gene's code out of the nucleus to the ribosome
   - B. It unzips the DNA so that the gene can be read
   - C. It brings a specific amino acid to the ribosome to match a codon
   - D. It links together with other tRNAs to form the ribosome
   - **Key: C**

5. **[BIO.5.a]** The mRNA is built by the same base-pairing rule used in DNA replication, except that —
   - A. uracil pairs with adenine in place of thymine
   - B. guanine pairs with adenine instead of cytosine
   - C. the new strand contains the sugar deoxyribose
   - D. both strands of the gene are copied at the same time
   - **Key: A**

6. **[BIO.5.b]** Which piece of evidence in the development of the DNA model most directly supports the idea in sentence 2 that one strand can be copied base by base?
   - A. mice that died after receiving a mixture of two bacterial strains
   - B. the double-helix model showing two strands with complementary bases
   - C. radioactive labels showing that virus coats stay outside the cell
   - D. the finding that proteins are built from 20 kinds of amino acids
   - **Key: B**

### Packing the Blueprint  
`dna-packing-the-blueprint` · DNA & Proteins · BIO.5 / BIO.2 · level 1 · 67 words · 5 questions

> (1) The DNA in one human nucleus, stretched out, would be about two meters long, yet the nucleus is only a few micrometers wide. (2) The DNA is wound around proteins and coiled into 46 **chromosomes**. (3) Each chromosome carries hundreds to thousands of genes. (4) A gene is a stretch of DNA whose base sequence holds the instructions for one protein. (5) Before a cell divides, each chromosome is copied.

1. **[BIO.5.a]** In sentence 2, a chromosome is best described as —
   - A. a single gene that codes for one protein
   - B. a protein that unzips the DNA before copying
   - C. a long DNA molecule wound around proteins and coiled tightly
   - D. a strand of mRNA on its way out of the nucleus
   - **Key: C**

2. **[BIO.5.a]** Which statement best explains why DNA is coiled as described in sentence 2?
   - A. Coiling changes the base sequence so that more genes fit
   - B. Coiling makes the DNA single-stranded so it can be read
   - C. Coiling protects the DNA from ever being copied
   - D. Coiling lets two meters of DNA fit inside a tiny nucleus
   - **Key: D**

3. **[BIO.2.d]** According to sentence 4, the instructions in a gene are stored in —
   - A. the order of its bases
   - B. the number of its phosphate groups
   - C. the shape of its proteins
   - D. the length of its sugars
   - **Key: A**

4. **[BIO.5.a]** The copying in sentence 5 is called —
   - A. transcription, and it produces a strand of mRNA
   - B. replication, and it produces two identical DNA molecules
   - C. translation, and it produces a chain of amino acids
   - D. transformation, and it moves DNA between cells
   - **Key: B**

5. **[BIO.5.a]** After the chromosomes are copied and the cell divides once, each daughter cell contains —
   - A. 23 chromosomes
   - B. 46 chromosomes
   - C. 92 chromosomes
   - D. 2 chromosomes
   - **Key: B**


## Level 2 — average student (core)

### Base Counts from Four Samples  
`dna-base-percentages` · DNA & Proteins · BIO.5 / BIO.2 · level 2 · 131 words · 6 questions

> (1) A lab team extracts DNA from four organisms and measures the percentage of each nitrogen base. (2) The team recalls that around 1950 the chemist Chargaff reported that in DNA the amount of adenine roughly equals the amount of thymine, and guanine roughly equals cytosine. (3) This pattern, now called **Chargaff's rule**, was one clue Watson and Crick used when they proposed the double helix in 1953. (4) The team's results are in the table. (5) The thymine value for the trout sample was smudged and could not be read. (6) The team also notes that the two strands of each molecule run in opposite directions, a feature called **antiparallel**.
> 
> | Sample | A (%) | T (%) | G (%) |
> |---|---|---|---|
> | Yeast | 31 | 31 | 19 |
> | Trout | 28 | ? | 22 |
> | Soil bacterium | 25 | 25 | 25 |
> | Wheat | 27 | 27 | 23 |

1. **[BIO.5.a]** Based on Chargaff's rule, the missing thymine value for the trout sample is most likely —
   - A. 22%
   - B. 28%
   - C. 44%
   - D. 50%
   - **Key: B**

2. **[BIO.5.a]** The table does not list cytosine. The percentage of cytosine in the trout sample should be about —
   - A. 22%
   - B. 28%
   - C. 44%
   - D. 56%
   - **Key: A**

3. **[BIO.5.a]** In sentence 6, antiparallel means that the two strands —
   - A. have exactly the same base sequence read in the same direction
   - B. are held together by covalent bonds between their sugars
   - C. separate completely from each other before every cell division
   - D. run in opposite directions, one 5' to 3' and the other 3' to 5'
   - **Key: D**

4. **[BIO.5.b]** Which statement best explains why Chargaff's rule supported a model in which A pairs with T and G pairs with C?
   - A. Equal amounts of A and T show that all DNA molecules have the same base sequence
   - B. Bases present in equal amounts must sit next to each other on the same strand
   - C. If every A on one strand is bonded to a T on the other, the two amounts must be equal
   - D. The rule showed that DNA is built from only two kinds of nitrogen bases
   - **Key: C**

5. **[BIO.5.b]** Which result, if found, would be inconsistent with Chargaff's rule?
   - A. a sample with 31% adenine and 31% thymine
   - B. a sample with 30% adenine and 20% thymine
   - C. a sample with 24% guanine and 24% cytosine
   - D. a sample with 25% of each of the four bases
   - **Key: B**

6. **[BIO.2.d]** A team member predicts that mRNA copied from a yeast gene will also contain equal amounts of A and U. Which statement best evaluates this prediction?
   - A. It is correct, because mRNA is copied from DNA and keeps the same base ratios
   - B. It is correct, because uracil replaces thymine in exactly equal amounts
   - C. It is incorrect, because mRNA contains guanine and cytosine but no adenine
   - D. It is incorrect, because mRNA is a single strand whose bases are not paired within it
   - **Key: D**

### The Transforming Substance  
`dna-transforming-principle` · DNA & Proteins · BIO.5 / BIO.2 · level 2 · 129 words · 6 questions

> (1) In 1928 Griffith injected mice with two strains of a pneumonia bacterium: a smooth strain with a slippery outer coat that kills mice, and a rough strain with no coat that does not. (2) Heat-killed smooth bacteria alone were harmless. (3) A mixture of heat-killed smooth cells and living rough cells, however, killed the mice, and living smooth cells were recovered from their blood. (4) Griffith concluded that something from the dead smooth cells had entered the rough cells and changed them, a process called **transformation**. (5) In 1944 Avery's team repeated the mixing in test tubes after treating a smooth-cell extract with different enzymes. (6) Their results are in the table.
> 
> | Enzyme added to extract | Molecule destroyed | Rough cells transformed? |
> |---|---|---|
> | none | none | yes |
> | protein-digesting | protein | yes |
> | RNA-digesting | RNA | yes |
> | DNA-digesting | DNA | no |

1. **[BIO.5.b]** Which conclusion do the mouse results in the table best support?
   - A. Protein in the extract carries the hereditary information
   - B. DNA, not protein or RNA, is the substance that transforms the cells
   - C. RNA must be present in the extract for transformation to occur
   - D. The enzymes themselves caused the rough cells to change
   - **Key: B**

2. **[BIO.5.b]** In sentence 3, the key evidence that transformation had occurred was that —
   - A. the mice injected with the mixture became sick within days
   - B. the heat had failed to kill all of the smooth cells
   - C. living smooth cells appeared even though only dead smooth cells had been injected
   - D. the rough cells lost their ability to grow inside the mice
   - **Key: C**

3. **[BIO.5.b]** In sentence 4, transformation is best defined as —
   - A. the death of a bacterium after it is heated to a high temperature
   - B. the growth of a slippery coat around a dead smooth cell
   - C. a mouse developing immunity after surviving an infection
   - D. a change in a cell's traits caused by hereditary material taken up from another cell
   - **Key: D**

4. **[BIO.5.b]** In Avery's investigation, the extract with no enzyme added served as —
   - A. the control, showing the untreated extract could transform rough cells
   - B. the independent variable, since it was changed on purpose
   - C. evidence that enzymes are harmful to living bacteria
   - D. the dependent variable, since it was measured at the end
   - **Key: A**

5. **[BIO.5.a]** Which description of the transforming substance is consistent with what is now known about DNA?
   - A. a chain of nucleotides whose sequence can be copied and passed on to daughter cells
   - B. a chain of amino acids folded into the shape of a slippery coat
   - C. a single-stranded molecule that is broken down within a few hours
   - D. a layer of lipids that surrounds the outside of the bacterial cell
   - **Key: A**

6. **[BIO.2.d]** Which statement best explains how DNA from the dead smooth cells could give a rough cell a slippery coat?
   - A. The DNA itself wraps around the rough cell to form the coat
   - B. The DNA is transcribed and translated into the enzymes that build the coat
   - C. The DNA is digested into sugars that are used to make the coat
   - D. The DNA pairs with the rough cell's mRNA and blocks its own genes
   - **Key: B**

### Reading the Codon Chart  
`dna-codon-chart` · DNA & Proteins · BIO.5 / BIO.2 · level 2 · 148 words · 6 questions

> (1) A biotechnology class decodes a short mRNA copied from a gene that a salt-marsh bacterium uses to build part of a salt-pumping protein. (2) Each set of three mRNA bases, a **codon**, either specifies one amino acid or signals the ribosome to stop. (3) The class uses the portion of the genetic code shown in the table. (4) The ribosome begins reading at the first AUG it finds and continues codon by codon until it reaches a stop codon. (5) Each tRNA carries an anticodon, three bases that pair with a codon, along with the matching amino acid. (6) The mRNA the class must translate reads 5'-GCAUGGGCAAACCAUAAGCU-3'. (7) A second group is given the DNA template strand for the same region and must first write the mRNA before translating it.
> 
> | Codon | Amino acid | Codon | Amino acid |
> |---|---|---|---|
> | AUG | methionine (start) | GCU | alanine |
> | GGC | glycine | UGG | tryptophan |
> | AAA | lysine | UAA | stop |
> | CCA | proline | UCU | serine |

1. **[BIO.2.d]** Using the table, the amino acid chain built from the mRNA in sentence 6 is —
   - A. methionine-glycine-lysine-proline
   - B. methionine-glycine-lysine-proline-alanine
   - C. glycine-lysine-proline-alanine
   - D. methionine-tryptophan-lysine-proline
   - **Key: A**

2. **[BIO.2.d]** Pairing base by base with the codon 5'-GGC-3', the anticodon of the tRNA that brings glycine reads —
   - A. 3'-GGC-5'
   - B. 3'-CCG-5'
   - C. 3'-CCA-5'
   - D. 3'-GGU-5'
   - **Key: B**

3. **[BIO.2.d]** In sentence 2, a codon is —
   - A. a three-base sequence on tRNA that carries an amino acid
   - B. a single mRNA base that pairs with uracil
   - C. a group of three mRNA bases that specifies an amino acid or a stop
   - D. the section of the ribosome that holds the mRNA in place
   - **Key: C**

4. **[BIO.2.d]** Why is alanine not part of the finished chain even though GCU appears in the mRNA?
   - A. The ribosome skips any codon that begins with the base G
   - B. Alanine has no matching tRNA in a bacterial cell
   - C. GCU lies before the start codon, so it is never read
   - D. The stop codon UAA comes first, so the chain is released before GCU is reached
   - **Key: D**

5. **[BIO.5.a]** The DNA template strand that was transcribed to make the codon AAA reads —
   - A. 3'-TTT-5'
   - B. 3'-UUU-5'
   - C. 3'-AAA-5'
   - D. 3'-AAT-5'
   - **Key: A**

6. **[BIO.5.b]** The second group relies on the fact that the two DNA strands are complementary. Which evidence first pointed to complementary base pairing?
   - A. mice that were transformed by a mixture of bacterial strains
   - B. radioactive labels that tracked virus DNA into bacteria
   - C. measurements showing that A equals T and G equals C in DNA
   - D. the discovery that tRNA carries an anticodon
   - **Key: C**

### A Human Gene in Bacteria  
`dna-human-gene-bacteria` · DNA & Proteins · BIO.5 / BIO.2 · level 2 · 215 words · 6 questions

> (1) A pharmaceutical lab in Richmond produces a human hormone by inserting the human gene into a bacterium. (2) The bacterium's ribosomes read the human mRNA and build the same chain of amino acids that human cells would build. (3) This works because the **genetic code**, the set of rules matching each codon to an amino acid, is nearly the same in every organism studied, from bacteria to oak trees to people. (4) To confirm the product, technicians compare the first four amino acids of the bacterial protein with the human version. (5) The human mRNA for that region reads 5'-AUGUUUGAUUGG-3'. (6) The technicians also check that each tRNA anticodon in the bacterium matches the same codon it would match in a human cell. (7) The table lists the tRNA molecules involved. (8) A second batch was made from a copy of the gene in which the fourth codon had become UGA, and the technicians found that the protein was far shorter than expected. (9) The lab notes that a shared code is also strong evidence that living things descend from common ancestors, since codes that arose separately would be unlikely to match.
> 
> | tRNA anticodon (3' to 5') | mRNA codon paired | Amino acid carried |
> |---|---|---|
> | UAC | AUG | methionine |
> | AAA | UUU | phenylalanine |
> | CUA | GAU | aspartic acid |
> | ACC | UGG | tryptophan |
> | (no tRNA) | UGA | none: stop signal |

1. **[BIO.2.d]** According to the table, the first four amino acids of the hormone are —
   - A. methionine, phenylalanine, aspartic acid, tryptophan
   - B. methionine, phenylalanine, tryptophan, aspartic acid
   - C. tyrosine, lysine, leucine, threonine
   - D. methionine, lysine, aspartic acid, tryptophan
   - **Key: A**

2. **[BIO.2.d]** The tRNA that pairs with the codon for tryptophan carries the anticodon —
   - A. 3'-UAC-5'
   - B. 3'-ACC-5'
   - C. 3'-AAA-5'
   - D. 3'-UGG-5'
   - **Key: B**

3. **[BIO.2.d]** In sentence 3, the genetic code refers to —
   - A. the sequence of bases in one particular gene
   - B. the number of chromosomes found in a species
   - C. the set of tRNA molecules present in a cell
   - D. the rules that match each codon to an amino acid or a stop
   - **Key: D**

4. **[BIO.2.d]** Which statement best explains the short protein in sentence 8?
   - A. The bacterium lacked the tRNA for tryptophan and skipped that codon
   - B. The mRNA could not leave the nucleus of the bacterium
   - C. UGA is a stop codon, so translation ended after three amino acids
   - D. UGA codes for a very small amino acid that shortens the chain
   - **Key: C**

5. **[BIO.5.b]** The lab assumes the human gene and the bacterial chromosome share the same double-helix structure. Which evidence led to that model?
   - A. radioactive labels showing that protein enters bacteria
   - B. X-ray diffraction patterns of DNA fibers combined with Chargaff's base ratios
   - C. mice that died after receiving heat-killed bacteria alone
   - D. codon tables showing which amino acid each codon specifies
   - **Key: B**

6. **[BIO.5.a]** Which feature of DNA makes it possible to join a human gene into a bacterial DNA molecule?
   - A. Both are built from the same four nucleotides linked by a sugar-phosphate backbone
   - B. Human DNA is single-stranded and slides between the bacterial strands
   - C. Human DNA contains uracil, which bacterial enzymes can read
   - D. Bacterial DNA has no bases of its own until a gene is added
   - **Key: A**


## Level 3 — stretch

### Heavy and Light DNA  
`dna-density-replication` · DNA & Proteins · BIO.5 / BIO.2 · level 3 · 168 words · 6 questions

> (1) A research team wants to know how a cell copies its DNA before dividing. (2) They grow bacteria for many generations in a broth containing only a heavy form of nitrogen, so every nitrogen base in the cells' DNA becomes heavy. (3) The bacteria are then moved to a broth with only normal, light nitrogen and allowed to divide. (4) After each round of **replication**, DNA is extracted and spun in a dense salt solution in a centrifuge, where heavier DNA settles into a band lower in the tube. (5) The table shows the bands observed. (6) Three models were being tested: a conservative model, in which the original double helix stays whole and an all-new one is made; a semi-conservative model, in which each new molecule keeps one old strand; and a dispersive model, in which old and new pieces are scattered through both strands.
> 
> | Generation | Bands | Position in tube |
> |---|---|---|
> | 0 (before switch) | 1 | heavy |
> | 1 | 1 | intermediate |
> | 2 | 2 | intermediate and light, equal thickness |
> | 3 | 2 | thin intermediate, thick light |

1. **[BIO.5.a]** The result at generation 1 rules out which model, and why?
   - A. the conservative model, because it predicts one heavy band and one light band after one round
   - B. the semi-conservative model, because it predicts a single intermediate band after one round
   - C. the dispersive model, because it predicts two separate bands after one round
   - D. all three models, because none of them predicts a single band after one round
   - **Key: A**

2. **[BIO.5.a]** The result at generation 2 supports the semi-conservative model over the dispersive model because the dispersive model predicts —
   - A. two bands, one fully heavy and one fully light
   - B. a light band only, since the old pieces are used up
   - C. one intermediate band and one light band of equal thickness
   - D. a single band slightly lighter than intermediate, with no fully light DNA
   - **Key: D**

3. **[BIO.5.a]** In sentence 4, replication refers to —
   - A. the separation of DNA molecules into bands by their weight
   - B. the process by which a cell makes an exact copy of its DNA before it divides
   - C. the change of heavy nitrogen into light nitrogen inside the cell
   - D. the copying of a single gene into a strand of messenger RNA
   - **Key: B**

4. **[BIO.5.b]** The double-helix model published in 1953 pointed toward the semi-conservative model because —
   - A. its two strands are identical, so either one can be discarded
   - B. its bases lie on the outside where copying enzymes can reach them
   - C. the helix must be broken into small pieces before it can be copied
   - D. each strand carries the information needed to rebuild the other by base pairing
   - **Key: D**

5. **[BIO.5.a]** Select TWO statements that are supported by the results in the table.
   - A. After one round, each DNA molecule contains one heavy strand and one light strand
   - B. The original heavy strands are destroyed during the first replication
   - C. With each further generation, the light band grows while the intermediate band never becomes heavier
   - D. Replication of the DNA is not complete until the third generation
   - **Key: A and C**

6. **[BIO.2.d]** Which statement correctly distinguishes replication from transcription?
   - A. Replication happens at the ribosome, while transcription happens in the nucleus
   - B. Replication copies the whole DNA molecule, while transcription copies one gene region into RNA
   - C. Replication uses uracil, while transcription uses thymine
   - D. Replication builds a chain of amino acids, while transcription builds DNA
   - **Key: B**

### Tagging a Virus  
`dna-phage-labels` · DNA & Proteins · BIO.5 / BIO.2 · level 3 · 172 words · 6 questions

> (1) Transformation experiments with bacteria in 1928 and 1944 had pointed to DNA, yet in the early 1950s some scientists still argued that proteins carried genetic instructions, since proteins have 20 kinds of building blocks and DNA has only four. (2) In 1952 Hershey and Chase tested the question with a virus that infects bacteria. (3) The virus is a protein coat around a DNA core; it attaches to a bacterium, injects its genetic material and leaves the coat outside. (4) Protein contains sulfur but no phosphorus, and DNA contains phosphorus but no sulfur. (5) One batch of virus was grown with radioactive sulfur and another with radioactive phosphorus. (6) After each batch infected bacteria, a blender knocked the coats off the cells and a centrifuge separated the cells (pellet) from the fluid. (7) A year later Franklin's **X-ray diffraction** images of DNA fibers showed an X-shaped pattern, which Watson and Crick combined with Chargaff's base ratios to build the double-helix model.
> 
> | Radioactive label | Molecule tagged | In fluid | In pellet |
> |---|---|---|---|
> | sulfur | protein coat | 82% | 18% |
> | phosphorus | DNA | 21% | 79% |

1. **[BIO.5.b]** Which conclusion do the labelling results in the table best support?
   - A. Both protein and DNA enter the bacterium in roughly equal amounts
   - B. The protein coat carries the genetic instructions into the cell
   - C. DNA enters the bacterium, so DNA is the material that carries the virus's instructions
   - D. Sulfur is required for the virus to attach to the bacterial cell
   - **Key: C**

2. **[BIO.5.b]** Why did the team choose sulfur and phosphorus as the labels?
   - A. They are the two most common elements in a bacterial cell
   - B. Each element is found in only one of the two molecules, so the label tracks that molecule alone
   - C. Both elements become radioactive when they are placed in a blender
   - D. Sulfur and phosphorus are the elements that pair the bases in DNA
   - **Key: B**

3. **[BIO.5.b]** Which statement best explains why 18% of the sulfur label was found in the pellet?
   - A. Some protein coats were still attached to cells when they were spun down
   - B. Protein also enters the cells and carries part of the instructions
   - C. Sulfur atoms were converted into phosphorus atoms inside the cells
   - D. The label moved from the coats into the DNA during infection
   - **Key: A**

4. **[BIO.5.b]** In sentence 7, X-ray diffraction is best described as —
   - A. a method of tagging DNA with radioactive atoms
   - B. a way of separating heavy and light molecules in a centrifuge
   - C. a chemical test that measures the amount of each nitrogen base
   - D. a technique in which X-rays scattered by a fiber reveal the spacing of its repeating parts
   - **Key: D**

5. **[BIO.5.a]** Which statement best counters the argument in sentence 1 that DNA is too simple to carry instructions?
   - A. DNA has more building blocks than protein once its sugars and phosphates are counted
   - B. The order of four bases along a long molecule can spell out countless different messages
   - C. Proteins cannot be found inside the nucleus, where the chromosomes are located
   - D. The four bases are larger than amino acids and therefore store more energy
   - **Key: B**

6. **[BIO.2.d]** Once inside the bacterium, the viral DNA directs the cell to build new virus proteins. Which statement describes how this happens?
   - A. The viral DNA is translated directly into protein at the cell wall
   - B. The host copies the viral coat protein by base pairing
   - C. The viral protein coat is transcribed into mRNA inside the cell
   - D. Host enzymes transcribe the viral DNA into mRNA, which host ribosomes translate
   - **Key: D**

### One Base Off  
`dna-one-base-off` · DNA & Proteins · BIO.5 / BIO.2 · level 3 · 198 words · 6 questions

> (1) A research group studies a small protein that helps a freshwater mussel attach to rocks in the Shenandoah River. (2) The normal gene produces the mRNA 5'-AUGCAUUCUGGCAAAUAG-3', which is translated using the codons in the table. (3) Mussels from two sites carry altered versions of the gene. (4) In the site-A version, the seventh base of the mRNA has changed from U to C, a **substitution**. (5) In the site-B version, an extra U has been inserted after the twelfth base, an **insertion**. (6) Because the ribosome reads the mRNA in non-overlapping groups of three starting at the start codon, an insertion shifts every codon after it, a change called a frameshift. (7) The group notices that some substitutions do not change the protein at all, because several different codons can specify the same amino acid. (8) Mussels with the site-B protein attach poorly and are often swept away in floods. (9) The group also confirms that both changes originated in the DNA and were copied into every cell of the mussel, rather than being introduced when the mRNA was made.
> 
> | Codon | Amino acid | Codon | Amino acid |
> |---|---|---|---|
> | AUG | methionine (start) | CCU | proline |
> | CAU | histidine | AAA | lysine |
> | UCU | serine | UAA | stop |
> | GGC | glycine | UAG | stop |

1. **[BIO.2.d]** The amino acid chain made from the normal mRNA in sentence 2 is —
   - A. methionine-histidine-serine-glycine-lysine
   - B. methionine-histidine-proline-glycine-lysine
   - C. methionine-histidine-serine-glycine
   - D. methionine-proline-serine-glycine-lysine
   - **Key: A**

2. **[BIO.2.d]** The site-A substitution changes the protein by —
   - A. ending the chain one amino acid early
   - B. shifting every codon that follows it
   - C. adding an extra amino acid at the third position
   - D. replacing serine with proline at the third position
   - **Key: D**

3. **[BIO.2.d]** Using the table, the site-B mRNA produces a chain that —
   - A. is identical to the normal chain but one amino acid longer
   - B. has lysine replaced by a different amino acid
   - C. ends after glycine because the shifted frame reads UAA as a stop
   - D. has every amino acid after methionine replaced
   - **Key: C**

4. **[BIO.2.d]** Select TWO statements that correctly describe the terms in sentences 4 and 5.
   - A. A substitution keeps the total number of bases in the mRNA the same
   - B. An insertion changes the reading frame of every codon after it
   - C. A substitution always changes the amino acid at that position
   - D. An insertion changes only the single codon where it occurs
   - **Key: A and B**

5. **[BIO.5.b]** Which finding established that the instructions for a protein such as this one are stored in DNA rather than in protein?
   - A. Mussels with a damaged protein attach poorly to rocks
   - B. X-ray images showed that proteins form a double helix
   - C. Chargaff found equal amounts of each amino acid in proteins
   - D. Virus DNA, not virus protein, entered infected bacteria
   - **Key: D**

6. **[BIO.5.a]** Which statement best explains why every cell of a site-B mussel carries the insertion (sentence 9)?
   - A. The altered mRNA was passed from cell to cell as the mussel grew
   - B. The altered DNA was copied by base pairing each time a cell replicated its DNA before dividing
   - C. tRNA carried the extra base into the nucleus of each new cell
   - D. Ribosomes rebuilt the altered DNA from the faulty protein
   - **Key: B**


---

# Evolution & Classification (BIO.6 · BIO.7)

Standards in this unit:

- BIO.6.a — structural similarities among organisms
- BIO.6.b — fossil record interpretation
- BIO.6.c — comparison of developmental stages
- BIO.6.d — biochemical similarities and differences
- BIO.6.e — classification systems are adaptable to new scientific discoveries
- BIO.7.a — evidence found in fossil records
- BIO.7.b — how variation of traits, reproductive strategies, and environmental pressures affect survival
- BIO.7.c — how natural selection leads to adaptations
- BIO.7.d — the emergence of new species
- BIO.7.e — scientific evidence and explanations for biological evolution


## Level 1 — foundation

### Sorting Four Samples  
`evo-four-samples` · Classification · BIO.6 · level 1 · 93 words · 5 questions

> (1) A class received four unlabeled samples and examined each under a microscope. (2) Students recorded the **cell type**, whether a cell wall was present, how the organism obtains food, and whether it is unicellular or multicellular. (3) The results are in the table. (4) Sample W lacked a nucleus, so the class placed it in a different domain from the other three.
> 
> | Sample | Nucleus | Cell wall | Nutrition | Cells |
> |---|---|---|---|---|
> | W | no | yes | absorbs food | one |
> | X | yes | yes (chitin) | absorbs food | many |
> | Y | yes | yes (cellulose) | makes own food | many |
> | Z | yes | no | ingests food | many |

1. **[BIO.6.a]** Based on the table, sample X belongs to kingdom —
   - A. Fungi, because it absorbs food through chitin walls
   - B. Plantae, because it has a cell wall
   - C. Animalia, because it is multicellular
   - D. Protista, because it has a nucleus
   - **Key: A**

2. **[BIO.6.a]** Sample W lacked a nucleus (sentence 4). Which domain could sample W belong to?
   - A. Eukarya only
   - B. Bacteria or Archaea
   - C. Fungi or Protista
   - D. Animalia only
   - **Key: B**

3. **[BIO.6.a]** In sentence 2, cell type refers to whether a cell is —
   - A. unicellular or multicellular
   - B. autotrophic or heterotrophic
   - C. prokaryotic or eukaryotic
   - D. living or nonliving
   - **Key: C**

4. **[BIO.6.a]** Which sample would be placed in kingdom Animalia, and why?
   - A. Sample W, because it has no nucleus
   - B. Sample Y, because it makes its own food
   - C. Sample X, because its wall contains chitin
   - D. Sample Z, because it ingests food and has no wall
   - **Key: D**

5. **[BIO.6.e]** Domain Archaea was added after scientists found that some prokaryotes differ sharply from bacteria in their ribosomal RNA. This change shows that classification systems —
   - A. are fixed once they are published
   - B. change as new evidence is discovered
   - C. rely only on visible structures
   - D. group organisms by their habitat
   - **Key: B**

### Keying Out a Creek Animal  
`evo-creek-key` · Classification · BIO.6 · level 1 · 104 words · 5 questions

> (1) A stream group in the Shenandoah Valley netted small animals and used a **dichotomous key** to name them. (2) Each choice names the animal or sends the user to another step. (3) Specimen 1 had six legs, two tail filaments, and abdominal gills. (4) Specimen 2 had eight legs. (5) Specimen 3 had seven pairs of legs.
> 
> - Three pairs of legs: go to 2. Four or more pairs of legs: go to 3.
> - Three tail filaments: mayfly nymph. Two tail filaments: go to 4.
> - Four pairs of legs: water mite. Seven pairs of legs: aquatic sowbug.
> - Gills along the abdomen: hellgrammite. No gills on the abdomen: stonefly nymph.

1. **[BIO.6.a]** Using the key, specimen 1 is a —
   - A. mayfly nymph
   - B. stonefly nymph
   - C. hellgrammite
   - D. water mite
   - **Key: C**

2. **[BIO.6.a]** Specimen 2 keys out as a water mite because it —
   - A. has exactly three pairs of legs
   - B. has exactly four pairs of legs
   - C. has gills along its abdomen
   - D. has more than four pairs of legs
   - **Key: B**

3. **[BIO.6.a]** Specimen 3 keys out as —
   - A. an aquatic sowbug
   - B. a water mite
   - C. a hellgrammite
   - D. a mayfly nymph
   - **Key: A**

4. **[BIO.6.a]** In sentence 1, a dichotomous key is best described as a tool that —
   - A. lists every species found in a stream
   - B. sorts organisms by their DNA sequences
   - C. ranks organisms from simplest to most complex
   - D. identifies organisms through paired choices
   - **Key: D**

5. **[BIO.6.e]** The group then finds an insect nymph with three pairs of legs and a single tail filament. Which statement best describes what the group should do?
   - A. Discard the specimen because it does not fit the key
   - B. Revise the key to add a step for the new animal
   - C. Record it as a hellgrammite because it has gills
   - D. Record it as a water mite because it is small
   - **Key: B**

### Two Names for Two Oaks  
`evo-two-oaks` · Classification · BIO.6 · level 1 · 99 words · 5 questions

> (1) A forestry student compared the white oak, _Quercus alba_, and the chestnut oak, _Quercus montana_, with the American chestnut, _Castanea dentata_. (2) All three are placed in the beech family, Fagaceae, but only the two oaks share a genus. (3) The student listed the ranks of the **taxonomic hierarchy** in the table, from broadest to narrowest. (4) Each name follows binomial nomenclature, the system Linnaeus introduced in the 1700s.
> 
> | Rank | White oak | Chestnut oak | American chestnut |
> |---|---|---|---|
> | Kingdom | Plantae | Plantae | Plantae |
> | Order | Fagales | Fagales | Fagales |
> | Family | Fagaceae | Fagaceae | Fagaceae |
> | Genus | Quercus | Quercus | Castanea |
> | Species | Q. alba | Q. montana | C. dentata |

1. **[BIO.6.a]** Based on the table, the two trees that are most closely related are the —
   - A. white oak and American chestnut, which share an order
   - B. white oak and chestnut oak, which share a genus
   - C. chestnut oak and American chestnut, which share a family
   - D. three trees equally, because all share a kingdom
   - **Key: B**

2. **[BIO.6.a]** In the name Quercus alba, the word alba is the —
   - A. family name
   - B. genus name
   - C. species name
   - D. order name
   - **Key: C**

3. **[BIO.6.a]** In sentence 3, the taxonomic hierarchy is a system of ranks in which —
   - A. each lower rank holds fewer, more similar organisms
   - B. each lower rank holds more, less similar organisms
   - C. every rank holds the same set of organisms
   - D. only genus and species are used to rank organisms
   - **Key: A**

4. **[BIO.6.a]** Which ranks would fill the gap between kingdom and order in the table?
   - A. domain and phylum
   - B. class and family
   - C. genus and species
   - D. phylum and class
   - **Key: D**

5. **[BIO.6.a]** Why do scientists use a binomial name such as Quercus alba rather than a common name?
   - A. One name refers to one species in every language
   - B. Latin names describe how a plant is used
   - C. Scientific names are shorter than common names
   - D. Common names cannot be printed in field guides
   - **Key: A**

### Layers in a Roadcut  
`evo-roadcut-layers` · Evolution · BIO.7 · level 1 · 134 words · 5 questions

> (1) A geology club mapped four rock layers exposed in a roadcut near the James River and recorded the **fossils** in each. (2) The layers were undisturbed, so the deepest layer was deposited first and is the oldest. (3) Layer 3 held a fish-like animal with sturdy, jointed fins and a neck, features not seen in the fish of layer 4 but present in the four-legged animals of layer 2. (4) The club described this animal as a **transitional form**. (5) No four-legged animals were found below layer 2, and no jointed-fin fish were found above layer 3.
> 
> | Layer (1 = top) | Fossils found | Estimated age (million years) |
> |---|---|---|
> | 1 | reptile bones, fern leaves | 300 |
> | 2 | four-legged amphibian skeletons, fern leaves | 340 |
> | 3 | fish with jointed fins and a neck | 375 |
> | 4 | fish with fin rays only, shellfish | 400 |

1. **[BIO.7.a]** Which layer contains the oldest fossils?
   - A. Layer 1
   - B. Layer 2
   - C. Layer 3
   - D. Layer 4
   - **Key: D**

2. **[BIO.6.b]** Based on the table, which sequence lists the fossil groups from oldest to youngest?
   - A. reptiles, amphibians, jointed-fin fish, ray-fin fish
   - B. ray-fin fish, jointed-fin fish, amphibians, reptiles
   - C. amphibians, reptiles, ray-fin fish, jointed-fin fish
   - D. jointed-fin fish, ray-fin fish, reptiles, amphibians
   - **Key: B**

3. **[BIO.7.a]** In sentence 4, a transitional form is a fossil that —
   - A. shows traits of an older group and of a group that appeared later
   - B. is found only in the youngest layer of rock at a site
   - C. belongs to a species that is still alive somewhere today
   - D. formed when an animal changed during its own lifetime
   - **Key: A**

4. **[BIO.7.a]** Which statement best explains how the club knew that layer 4 was deposited before layer 2?
   - A. Layer 4 contains more kinds of fossils
   - B. Fish are always older than amphibians
   - C. In undisturbed rock, deeper layers formed first
   - D. Fern leaves are found only in younger rock
   - **Key: C**

5. **[BIO.7.a]** What does the fossil in layer 3 suggest about the animals in layer 2?
   - A. They evolved from fish-like ancestors with jointed fins
   - B. They moved into the water after living on land
   - C. They were the same species as the layer 3 animal
   - D. They appeared before any fish existed
   - **Key: A**


## Level 2 — average student (core)

### Reading a Trait Table  
`evo-trait-table` · Classification · BIO.6 · level 2 · 160 words · 6 questions

> (1) A museum volunteer was asked to arrange five animals on a **cladogram**, a branching diagram that shows the order in which groups split from common ancestors. (2) She scored each animal for three **derived traits**, features that arose in an ancestor and were passed to all of its descendants. (3) The table shows the results. (4) Only the fox has fur, which appeared after the amniotic egg. (5) On the finished diagram the lamprey branches off first, then the bass, then the salamander, and the turtle and fox share the last branch point. (6) A visitor argued that the bass and the salamander should be grouped together because both are found in ponds. (7) The volunteer explained that habitat is not a derived trait and that the diagram groups organisms by shared ancestry, not by where they live.
> 
> | Animal | Jaws | Four limbs | Amniotic egg |
> |---|---|---|---|
> | Lamprey | no | no | no |
> | Bass | yes | no | no |
> | Salamander | yes | yes | no |
> | Turtle | yes | yes | yes |
> | Fox | yes | yes | yes |

1. **[BIO.6.a]** Based on the table, which two animals are most closely related?
   - A. lamprey and bass
   - B. bass and salamander
   - C. salamander and turtle
   - D. turtle and fox
   - **Key: D**

2. **[BIO.6.a]** Which derived trait is shared by the bass, salamander, turtle and fox but not by the lamprey?
   - A. jaws
   - B. four limbs
   - C. amniotic egg
   - D. fur
   - **Key: A**

3. **[BIO.6.a]** In sentence 2, a derived trait is best described as a feature that —
   - A. is found in every living organism
   - B. arose in an ancestor and is shared by its descendants
   - C. appears only in the oldest group on the diagram
   - D. develops during an individual's own lifetime
   - **Key: B**

4. **[BIO.6.b]** A newly discovered fossil animal has jaws and four limbs but no amniotic egg. Where would it join the cladogram?
   - A. before the lamprey branches off
   - B. between the lamprey and the bass
   - C. on the same branch as the salamander
   - D. between the turtle and the fox
   - **Key: C**

5. **[BIO.7.e]** Which statement best explains why the volunteer rejected the visitor's grouping (sentences 6 and 7)?
   - A. Ponds contain too many species to be useful
   - B. The bass has more derived traits than the salamander
   - C. Sharing a habitat does not show shared ancestry
   - D. Salamanders are more closely related to lampreys
   - **Key: C**

6. **[BIO.6.a]** According to the table, how many of the three derived traits does the turtle share with the salamander?
   - A. one
   - B. two
   - C. three
   - D. none
   - **Key: B**

### Beak Depth After a Drought  
`evo-drought-beaks` · Evolution · BIO.7 · level 2 · 146 words · 6 questions

> (1) On a small island, a population of seed-eating finches feeds on two kinds of seeds: soft seeds from a grass and hard, woody seeds from a shrub. (2) Researchers measured **beak depth**, the distance from the top of the beak to the bottom, in a random sample of adults each year. (3) During the second year, a drought killed most of the grass and left mainly the hard shrub seeds. (4) Birds with deeper beaks could crack the hard seeds and were more likely to survive and breed. (5) Beak depth is largely inherited. (6) The table shows the results, along with the number of finches counted on the island. (7) The population's mean beak depth rose even though no individual bird's beak grew deeper.
> 
> | Year | Mean beak depth (mm) | Finches counted | Rainfall (mm) |
> |---|---|---|---|
> | 1 | 9.2 | 640 | 410 |
> | 2 (drought) | 9.9 | 210 | 60 |
> | 3 | 10.0 | 290 | 380 |
> | 4 | 10.1 | 470 | 400 |

1. **[BIO.7.b]** Between year 1 and year 2, the number of finches counted —
   - A. rose by 430
   - B. fell by 430
   - C. fell by 210
   - D. stayed about the same
   - **Key: B**

2. **[BIO.7.c]** Which statement best explains why mean beak depth rose from year 1 to year 2?
   - A. Each bird grew a deeper beak to crack hard seeds
   - B. The drought caused new mutations for deep beaks
   - C. Shallow-beaked birds migrated to another island
   - D. Deep-beaked birds survived the drought at a higher rate
   - **Key: D**

3. **[BIO.7.b]** The researchers focused on beak depth (sentence 2) because it is a trait that —
   - A. varies among individuals and is passed to offspring
   - B. is identical in every finch on the island
   - C. changes each time a bird eats a hard seed
   - D. depends only on how much rain fell that year
   - **Key: A**

4. **[BIO.7.b]** Which condition in the passage acted as the environmental pressure on the finches?
   - A. the shortage of soft seeds during the drought
   - B. the random sampling of adults each year
   - C. the inheritance of beak depth
   - D. the return of rainfall in year 3
   - **Key: A**

5. **[BIO.7.c]** Which of the following is the best prediction if rainfall stays near 400 mm and soft grass seeds return for many years?
   - A. mean beak depth will keep rising at the same rate
   - B. beak depth will no longer be inherited
   - C. selection for deep beaks will weaken
   - D. the population will fall below 210
   - **Key: C**

6. **[BIO.7.e]** Sentence 7 supports which idea about evolution?
   - A. Individuals adapt to the environment during their lifetimes
   - B. Populations, not individuals, evolve over generations
   - C. Traits that are used more become stronger and are inherited
   - D. Evolution occurs only when a species goes extinct
   - **Key: B**

### Breeding a Bigger Squash  
`evo-squash-selection` · Evolution · BIO.7 · level 2 · 108 words · 5 questions

> (1) A garden club wanted a winter squash with larger fruit. (2) Each autumn members weighed every fruit in the plot, saved seeds only from the ten heaviest, and planted those seeds the next spring. (3) The table shows the mean fruit mass over five generations. (4) This process is called **artificial selection** because people, not the environment, decide which individuals reproduce. (5) In generation 5 a member noticed that the biggest fruits split open more often and rotted before harvest, and that fewer seeds from those fruits sprouted.
> 
> | Generation | Mean fruit mass (g) | Seeds that sprouted (%) |
> |---|---|---|
> | 1 | 1,450 | 88 |
> | 2 | 1,620 | 87 |
> | 3 | 1,830 | 84 |
> | 4 | 2,010 | 79 |
> | 5 | 2,140 | 71 |

1. **[BIO.7.c]** Which trend does the table show from generation 1 to generation 5?
   - A. Fruit mass rose while sprouting fell
   - B. Fruit mass fell while sprouting rose
   - C. Both fruit mass and sprouting rose
   - D. Both fruit mass and sprouting fell
   - **Key: A**

2. **[BIO.7.b]** Artificial selection was able to change the squash population because fruit mass —
   - A. was controlled entirely by the soil
   - B. varied among plants and was heritable
   - C. increased in each fruit after it was picked
   - D. was the same in every plant in the plot
   - **Key: B**

3. **[BIO.7.c]** In sentence 4, artificial selection differs from natural selection mainly in —
   - A. whether the trait can be inherited
   - B. whether the population shows variation
   - C. how many generations are required
   - D. what determines which individuals reproduce
   - **Key: D**

4. **[BIO.7.b]** Which statement best explains the pattern described in sentence 5?
   - A. the plants developed large fruit because they needed to
   - B. selecting for one trait can bring costs to reproduction
   - C. the club accidentally saved seeds from the smallest fruits
   - D. fruit mass has no effect on how well seeds sprout
   - **Key: B**

5. **[BIO.7.c]** If wild squash grew where animals ate only the smallest fruits and scattered their seeds, which fruit size would natural selection most likely favor?
   - A. fruits as large as those in generation 5
   - B. fruits with no seeds at all
   - C. fruits small enough to be eaten and carried away
   - D. fruits of every size equally
   - **Key: C**

### Beetles That Shrug Off the Spray  
`evo-beetle-spray` · Evolution · BIO.7 · level 2 · 69 words · 5 questions

> (1) A soybean grower sprayed one pesticide on a field each June. (2) In the first year about 97% of the leaf beetles died. (3) By year five the same dose killed only 40%, and the grower asked whether the spray had gone bad. (4) The agent found the spray unchanged: a few beetles had carried a **resistance allele** before spraying began. (5) Those survivors bred, and the allele became common in the population.

1. **[BIO.7.c]** Which statement best explains why the pesticide killed fewer beetles in year five?
   - A. Each beetle built up a tolerance during its life
   - B. The beetles evolved resistance because they needed to
   - C. Resistant beetles survived and passed the allele on
   - D. The pesticide created the resistance allele
   - **Key: C**

2. **[BIO.7.b]** In sentence 4, a resistance allele is best described as —
   - A. a gene version that helps a beetle survive the spray
   - B. a chemical that breaks down the pesticide in soil
   - C. a behavior beetles learn by watching others
   - D. a trait that appears only after spraying
   - **Key: A**

3. **[BIO.7.e]** Which situation is most similar to the change in the beetle population?
   - A. a lizard that regrows a lost tail
   - B. a dog that learns to sit for a treat
   - C. a plant that wilts on a hot afternoon
   - D. an infection that no longer responds to an antibiotic
   - **Key: D**

4. **[BIO.7.b]** What percentage of the beetles survived the spray in the first year?
   - A. 40%
   - B. 3%
   - C. 60%
   - D. 97%
   - **Key: B**

5. **[BIO.7.c]** Which practice would most slow the spread of the resistance allele?
   - A. spraying a higher dose every week
   - B. spraying the same product every June
   - C. rotating pesticides and leaving unsprayed areas
   - D. spraying only on cloudy days
   - **Key: C**

### Bones, Wings and Embryos  
`evo-limb-lab` · Evolution · BIO.7 · level 2 · 157 words · 6 questions

> (1) In an anatomy lab, students compared the forelimb skeletons of a bat, a whale, a cat and a human. (2) Each limb had the same pattern: one upper-arm bone, two forearm bones, a cluster of wrist bones and rows of finger bones, though bone lengths and limb jobs differed. (3) Structures with the same underlying plan inherited from a common ancestor are **homologous**. (4) The students then compared a bat wing with an insect wing. (5) Both are used for flight, but the insect wing is a thin sheet of chitin with no bones, so the two wings are **analogous**: similar in function but not inherited from a shared winged ancestor. (6) The whale skeleton also contained small hip bones that no longer attach to any limb, a **vestigial** structure left over from land-living ancestors. (7) Finally, the students viewed early embryos of a fish, a chicken and a mammal; all three had a tail and throat pouches at that stage.

1. **[BIO.6.a]** The forelimbs of the bat, whale, cat and human are homologous because they —
   - A. are used for the same job
   - B. share one bone pattern from a common ancestor
   - C. are all used for walking on land
   - D. have bones of exactly the same length
   - **Key: B**

2. **[BIO.6.a]** In sentence 5, analogous structures are alike in —
   - A. function but not in ancestry
   - B. ancestry but not in function
   - C. both function and ancestry
   - D. neither function nor ancestry
   - **Key: A**

3. **[BIO.7.e]** The whale's hip bones (sentence 6) are evidence that whales —
   - A. are more closely related to fish than to land mammals
   - B. will grow hind legs again in the future
   - C. descended from ancestors that had hind limbs
   - D. use their hips to steer while swimming
   - **Key: C**

4. **[BIO.6.c]** Which conclusion is best supported by the embryo observations in sentence 7?
   - A. adult mammals keep working gills
   - B. chickens are the direct descendants of fish
   - C. embryos look identical at every stage
   - D. the three groups share a distant common ancestor
   - **Key: D**

5. **[BIO.6.a]** A bird wing and a butterfly wing would best be classified as —
   - A. homologous, because both are used to fly
   - B. analogous, because flight evolved separately in each
   - C. vestigial, because both are lightweight
   - D. homologous, because both come from a winged ancestor
   - **Key: B**

6. **[BIO.7.e]** Which evidence from the lab best supports the claim that a bat is more closely related to a cat than to an insect?
   - A. bats and insects both fly
   - B. the bat wing is larger than the insect wing
   - C. the bat and cat forelimbs share the same bone pattern
   - D. the insect wing is made of chitin
   - **Key: C**


## Level 3 — stretch

### Protein Clues and a Moved Family  
`evo-protein-clues` · Classification · BIO.6 · level 3 · 163 words · 6 questions

> (1) For most of the last century the spotted skunk was placed in the weasel family because of its long body, short legs and scent glands. (2) A research team compared the sequence of a 104-amino-acid blood protein in five mammals, using the river otter, a member of the weasel family, as the reference. (3) The table lists the number of positions at which each species differs from the otter. (4) In general, the fewer **amino acid differences** two species show, the more recently they shared a common ancestor, because mutations accumulate over time. (5) DNA sequencing of several genes gave the same pattern. (6) Based on this **biochemical evidence**, taxonomists moved skunks out of the weasel family into a family of their own. (7) The team noted that scent glands are found in many carnivores and are therefore not a reliable clue to ancestry.
> 
> | Species | Differences from river otter | Traditional family |
> |---|---|---|
> | Mink | 4 | weasel |
> | Badger | 9 | weasel |
> | Spotted skunk | 21 | weasel |
> | Raccoon | 19 | raccoon |
> | Domestic dog | 27 | dog |

1. **[BIO.6.d]** According to the table, which species shares the most recent common ancestor with the river otter?
   - A. mink
   - B. badger
   - C. raccoon
   - D. domestic dog
   - **Key: A**

2. **[BIO.6.d]** Which conclusion about the spotted skunk is best supported by the table?
   - A. It is more closely related to the otter than the badger is
   - B. It is about as distant from the otter as the raccoon is
   - C. It shares more of the protein with the dog than with the otter
   - D. It has the fewest differences of any species listed
   - **Key: B**

3. **[BIO.6.d]** In sentence 6, biochemical evidence refers to comparisons of —
   - A. bone shape and body size
   - B. embryos at early stages
   - C. protein and DNA sequences
   - D. fossils in rock layers
   - **Key: C**

4. **[BIO.6.e]** Which statement best explains why taxonomists changed the skunk's classification (sentence 6)?
   - A. Skunks were found to lack scent glands
   - B. Skunks differ from every mammal in the table
   - C. Body shape is never used in classification
   - D. New molecular data conflicted with the older grouping
   - **Key: D**

5. **[BIO.7.e]** Select TWO statements that are supported by the passage and the table.
   - A. The mink and otter lineages split more recently than the dog and otter lineages
   - B. The badger's 9 differences show it does not belong in the weasel family
   - C. Scent glands evolved only once, in the weasel family
   - D. Similar body shapes can occur in species that are not closely related
   - **Key: A and D**

6. **[BIO.6.d]** If the team sequenced the same protein in a long-tailed weasel, which number of differences from the otter would be most consistent with its placement in the weasel family?
   - A. 24
   - B. 18
   - C. 5
   - D. 30
   - **Key: C**

### Two Salamanders, One Ridge  
`evo-ridge-salamanders` · Evolution · BIO.7 · level 3 · 196 words · 6 questions

> (1) A population of stream salamanders once ranged across a section of the Blue Ridge. (2) About 20,000 years ago the climate warmed and the low valley between two arms of the ridge became too warm and dry for the salamanders, which dry out quickly away from cool shaded water, to cross. (3) Field surveys today find a northern form with 14 costal grooves and a bright orange stripe, and a southern form with 16 grooves and a dull brown stripe. (4) The northern streams are steeper and colder; the southern streams are slower and richer in aquatic insects. (5) Biologists brought northern and southern animals together in the laboratory. (6) The two forms rarely courted one another because the courtship dance of each form did not trigger a response in the other, and the few eggs produced from mixed pairs failed to hatch. (7) Individuals from the same form mated readily and produced healthy larvae. (8) Genetic tests show that the two forms differ at many sites in their DNA, while salamanders within each form are very similar to one another. (9) The biologists concluded that **geographic isolation** followed by **reproductive isolation** had produced two **species** from one ancestral population, an example of speciation.

1. **[BIO.7.d]** Which event first divided the ancestral population into two groups?
   - A. a warm, dry valley the salamanders could not cross
   - B. differences in the courtship dances
   - C. the failure of mixed-pair eggs to hatch
   - D. differences in the number of costal grooves
   - **Key: A**

2. **[BIO.7.d]** Which observation is the strongest evidence that the two forms are now separate species?
   - A. they are found in different streams
   - B. they have different stripe colors
   - C. they do not interbreed successfully
   - D. their streams differ in temperature
   - **Key: C**

3. **[BIO.7.d]** In sentence 9, reproductive isolation means that the two forms —
   - A. live on opposite sides of a barrier
   - B. reproduce at different times of the day
   - C. have stopped reproducing entirely
   - D. no longer produce fertile offspring together
   - **Key: D**

4. **[BIO.7.c]** Which statement best explains how the two forms came to differ in stripe color and groove number?
   - A. each salamander changed its traits to fit its stream
   - B. the barrier itself caused the new mutations
   - C. different conditions favored different variants over generations
   - D. the forms chose to look different from each other
   - **Key: C**

5. **[BIO.7.e]** Select TWO findings from the passage that support the conclusion that the two forms descended from one ancestral population.
   - A. the population once ranged across the whole ridge
   - B. the two forms rarely court one another
   - C. the southern streams hold more aquatic insects
   - D. the forms have similar bodies and only some DNA differences
   - **Key: A and D**

6. **[BIO.7.d]** If a cool, shaded forest corridor regrew across the valley, which outcome is most likely?
   - A. the forms would quickly merge into one species
   - B. the forms would stay separate because they do not interbreed
   - C. the northern form would immediately lose its stripe
   - D. both forms would go extinct from competition
   - **Key: B**

### Many Eggs or Much Care  
`evo-eggs-or-care` · Evolution · BIO.7 · level 3 · 247 words · 6 questions

> (1) A Chesapeake Bay research station tracked two animals that share the same marsh: the blue crab and the osprey. (2) A female blue crab releases up to two million eggs in a single spawning and provides no care after the larvae hatch; nearly all the larvae are eaten or swept away. (3) An osprey pair lays two to four eggs each spring, incubates them for over a month, and feeds the chicks fish for weeks after they leave the nest. (4) The table summarizes the station's estimates. (5) Both strategies persist because, on average, each parent leaves enough surviving offspring to replace itself. (6) Researchers call the crab's approach a **high-fecundity strategy**: many offspring, low investment in each. (7) The osprey's approach is the opposite: few offspring, heavy investment in each. (8) In one year an unusually cold spring killed most crab larvae in the bay, yet the crab population recovered within two seasons. (9) When a storm destroyed a quarter of the osprey nests in the same year, the local osprey population took several years to return to its earlier size. (10) The station noted that overproduction of offspring, combined with limited food and space, means that not every individual can survive, and that those best suited to the conditions are the ones most likely to reproduce.
> 
> | Feature | Blue crab | Osprey |
> |---|---|---|
> | Eggs per female per year | up to 2,000,000 | 2 to 4 |
> | Parental care | none | months |
> | Offspring surviving to adulthood | about 0.0001% | about 50% |
> | Age at first reproduction | 1 to 2 years | 3 years |

1. **[BIO.7.b]** According to the table, about how many offspring from a single spawning of 2,000,000 crab eggs survive to adulthood?
   - A. 2
   - B. 20
   - C. 200
   - D. 2,000
   - **Key: A**

2. **[BIO.7.b]** In sentence 6, a high-fecundity strategy is one in which an organism —
   - A. produces few offspring and cares for each one
   - B. produces many offspring and invests little in each
   - C. reproduces only once in its lifetime
   - D. produces offspring only in warm years
   - **Key: B**

3. **[BIO.7.b]** Which statement best explains why the crab population recovered faster than the osprey population (sentences 8 and 9)?
   - A. crabs are less affected by weather than ospreys
   - B. cold water does not harm crab larvae
   - C. a few surviving crabs can release millions of eggs
   - D. ospreys stopped nesting after the storm
   - **Key: C**

4. **[BIO.7.c]** Sentence 10 describes which parts of the reasoning behind natural selection?
   - A. isolation, divergence and speciation
   - B. mutation, migration and genetic drift
   - C. inheritance of traits gained during life
   - D. overproduction, competition and differential survival
   - **Key: D**

5. **[BIO.7.b]** In which environment would the osprey's strategy most likely be favored over the crab's?
   - A. where offspring survival is random and very low
   - B. where a protected offspring has a good chance to survive
   - C. where food is unlimited and predators are absent
   - D. where adults die before their eggs hatch
   - **Key: B**

6. **[BIO.7.e]** Which statement about the two strategies is best supported by the passage?
   - A. the osprey's strategy is more advanced than the crab's
   - B. the crab's strategy will eventually replace the osprey's
   - C. only the crab's strategy is shaped by natural selection
   - D. each strategy leaves enough survivors to maintain the population
   - **Key: D**


---

# Ecology (BIO.8)

Standards in this unit:

- BIO.8.a — interactions within and among populations: carrying capacity, limiting factors, and growth curves
- BIO.8.b — nutrient cycling with energy flow through ecosystems
- BIO.8.c — succession patterns in ecosystems
- BIO.8.d — natural events and human activities influence local and global ecosystems and the flora and fauna of Virginia


## Level 1 — foundation

### Deer on the Ridge Trail  
`eco-deer-shenandoah-trail` · Ecology · BIO.8 · level 1 · 80 words · 5 questions

> (1) A wildlife class counted white-tailed deer along the same 5 km trail in Shenandoah National Park every October. (2) Hunting is not allowed in the park, and no coyotes appeared on the trail cameras until 2023. (3) By 2021 the students noticed browse lines: the deer had eaten nearly every leaf they could reach. (4) They concluded that the trail's habitat had reached its **carrying capacity** for deer.
> 
> | Year | Deer counted |
> |---|---|
> | 2018 | 22 |
> | 2019 | 38 |
> | 2020 | 61 |
> | 2021 | 79 |
> | 2022 | 82 |
> | 2023 | 80 |

1. **[BIO.8.a]** Which conclusion about the deer population is best supported by the table?
   - A. It reached its carrying capacity in 2019 and has declined since.
   - B. It doubled every year from 2018 through 2023.
   - C. It grew quickly until about 2021 and then levelled off near 80.
   - D. It fell steadily after the coyotes arrived in 2020.
   - **Key: C**

2. **[BIO.8.a]** In sentence 4, carrying capacity refers to —
   - A. the largest number of deer the habitat can support over time
   - B. the number of deer the class counted in a single October
   - C. the number of deer removed by hunters each season
   - D. the number of predators the park can feed in a year
   - **Key: A**

3. **[BIO.8.a]** Based on sentence 3, which factor most likely limited the deer population after 2021?
   - A. hunting pressure inside the park boundary
   - B. the supply of leaves within reach of the deer
   - C. predation by coyotes along the trail
   - D. a shortage of space along the 5 km trail
   - **Key: B**

4. **[BIO.8.a]** If the deer counts were plotted against year, the graph would be best described as —
   - A. a J-shaped curve that keeps rising faster each year
   - B. a boom-and-bust cycle with a crash every two years
   - C. a straight line rising at the same rate every year
   - D. an S-shaped curve that flattens near the carrying capacity
   - **Key: D**

5. **[BIO.8.d]** Outside the park, deer damage crops and gardens in many Virginia counties. Which management action would most directly lower deer numbers there?
   - A. planting food plots to feed the deer through the winter
   - B. building more hiking trails through the forest
   - C. extending the hunting season and raising the bag limit
   - D. planting more acorn-producing oaks along field edges
   - **Key: C**

### Brook Trout and Warm Water  
`eco-brook-trout-shade` · Ecology · BIO.8 · level 1 · 68 words · 5 questions

> (1) Brook trout, Virginia's only native trout, need cold water rich in **dissolved oxygen**. (2) A stream team compared two Blue Ridge streams. (3) Shaded Cold Run averaged 15 °C; Miller Branch, where streamside trees were cut for pasture, averaged 22 °C. (4) Surveys found 34 brook trout per 100 m in Cold Run and only 3 per 100 m in Miller Branch. (5) The team recommended planting trees along Miller Branch.

1. **[BIO.8.d]** Which human activity best explains the difference in water temperature between the two streams?
   - A. stocking Cold Run with trout raised in a hatchery
   - B. removing streamside trees so sunlight warms Miller Branch
   - C. fertilizer runoff adding oxygen to Miller Branch
   - D. building a dam that releases cold water into Cold Run
   - **Key: B**

2. **[BIO.8.a]** Which conclusion is best supported by the survey counts in sentence 4?
   - A. Cold Run supports more than ten times as many trout per 100 m as Miller Branch.
   - B. Miller Branch has more trout because warm water speeds their growth.
   - C. The two streams support about the same number of trout.
   - D. Brook trout cannot survive at all in water warmer than 15 °C.
   - **Key: A**

3. **[BIO.8.a]** In this study, water temperature acts on the trout population as a —
   - A. producer at the base of the stream food chain
   - B. pioneer species that colonizes bare stream banks
   - C. decomposer that recycles nutrients in the stream
   - D. limiting factor that sets how many trout the stream can support
   - **Key: D**

4. **[BIO.8.a]** In sentence 1, dissolved oxygen means —
   - A. oxygen atoms locked inside each water molecule
   - B. oxygen released by decomposers breaking down leaves
   - C. oxygen gas mixed into the water that fish take in through their gills
   - D. oxygen stored in the swim bladder of a trout
   - **Key: C**

5. **[BIO.8.d]** The recommendation in sentence 5 is best described as —
   - A. habitat restoration meant to shade and cool the stream
   - B. introducing a non-native species to the stream
   - C. primary succession beginning on bare rock
   - D. eutrophication of the stream by added nutrients
   - **Key: A**

### Energy in a Salt Marsh  
`eco-salt-marsh-pyramid` · Ecology · BIO.8 · level 1 · 116 words · 6 questions

> (1) A salt marsh on Virginia's Eastern Shore is dominated by smooth cordgrass, a **producer** that captures sunlight. (2) Students built an energy pyramid for the marsh from measurements of the energy stored in each trophic level over one year. (3) Periwinkle snails and grasshoppers eat the cordgrass, clapper rails eat the snails and insects, and a northern harrier hunts the rails. (4) About 10% of the energy at each level passes to the next; the rest powers life processes or is lost as heat. (5) Dead cordgrass is broken down by bacteria and fungi in the mud.
> 
> | Trophic level | Organisms | Energy (kcal/m²/yr) |
> |---|---|---|
> | Producers | cordgrass | 20,000 |
> | Primary consumers | snails, grasshoppers | 2,000 |
> | Secondary consumers | clapper rails | 200 |
> | Tertiary consumer | northern harrier | 20 |

1. **[BIO.8.b]** According to the table, how much energy is available to the clapper rails each year?
   - A. 20,000 kcal/m²
   - B. 2,000 kcal/m²
   - C. 200 kcal/m²
   - D. 20 kcal/m²
   - **Key: C**

2. **[BIO.8.b]** Which statement best explains why so little energy is available at the harrier level?
   - A. Most energy at each level is used for life processes or lost as heat, so only about 10% moves up.
   - B. Harriers are larger than rails, so they need much less energy to live.
   - C. Decomposers recycle most of the energy back to the cordgrass instead.
   - D. Clapper rails hide in the grass, so the harrier rarely catches one.
   - **Key: A**

3. **[BIO.8.b]** In sentence 1, a producer is an organism that —
   - A. eats plants to obtain energy
   - B. makes its own food using sunlight and carbon dioxide
   - C. breaks down dead material into nutrients
   - D. sits at the top of a food chain
   - **Key: B**

4. **[BIO.8.b]** The bacteria and fungi in sentence 5 are best described as —
   - A. producers that add energy to the marsh
   - B. primary consumers because they feed on cordgrass
   - C. tertiary consumers at the top of the pyramid
   - D. decomposers that return nutrients from dead cordgrass to the mud
   - **Key: D**

5. **[BIO.8.a]** If disease wiped out most of the periwinkle snails, which change would most likely happen first?
   - A. The clapper rails would have less food and their numbers would fall.
   - B. The energy stored in the cordgrass would drop to 2,000 kcal/m².
   - C. The harrier would begin eating cordgrass instead of rails.
   - D. The bacteria and fungi would stop recycling nutrients.
   - **Key: A**

6. **[BIO.8.d]** Rising sea level is drowning parts of the marsh and killing cordgrass. Which is the most direct effect on the energy pyramid?
   - A. More water would raise the energy available at every level.
   - B. The harrier level would gain energy as rails move closer together.
   - C. Decomposers would replace the cordgrass as the marsh's producers.
   - D. Less energy would enter at the base, so every level above would shrink.
   - **Key: D**

### After the Clearcut  
`eco-loblolly-after-clearcut` · Ecology · BIO.8 · level 1 · 183 words · 6 questions

> (1) A timber company in Southside Virginia harvests its loblolly pine stands about every 30 years. (2) A biology class visited five stands cut at different times and recorded the tallest plants and the common animals in each.
> 
> | Stand | Years since cut | Tallest plants | Common animals |
> |---|---|---|---|
> | 1 | 1 | crabgrass, ragweed, blackberry | field sparrows, cottontail rabbits |
> | 2 | 5 | sumac, blackberry, pine seedlings | bobwhite quail, white-tailed deer |
> | 3 | 12 | young loblolly pines 6 m tall | pine warblers, gray squirrels |
> | 4 | 25 | loblolly pines 20 m tall, some oaks | wild turkeys, barred owls |
> | 5 | 60 (never cut) | oaks, hickories, scattered pines | pileated woodpeckers, gray foxes |
> 
> (3) The class called the pattern **secondary succession** because the soil, roots and buried seeds survived the harvest. (4) In stand 1 the sun-loving weeds sprouted from seeds that had waited in the soil for years. (5) As the pines shade the ground, shade-tolerant oaks and hickories slowly replace them. (6) Pine seedlings, unlike oak seedlings, cannot grow in deep shade. (7) The class also estimated the carbon stored in wood: about 2 tons per hectare in stand 1 and about 120 tons per hectare in stand 5.

1. **[BIO.8.c]** Which stand in the table best represents a climax community?
   - A. stand 1
   - B. stand 3
   - C. stand 4
   - D. stand 5
   - **Key: D**

2. **[BIO.8.c]** In sentence 3, secondary succession refers to —
   - A. the first colonization of bare rock by lichens and mosses
   - B. the regrowth of a community where soil remains after a disturbance
   - C. the second harvest of a pine stand by the timber company
   - D. the movement of animals from one stand to another
   - **Key: B**

3. **[BIO.8.c]** The pioneer species in this study are the —
   - A. crabgrass and ragweed in stand 1
   - B. loblolly pines in stand 3
   - C. oaks and hickories in stand 5
   - D. barred owls and gray foxes
   - **Key: A**

4. **[BIO.8.c]** Which statement best explains why oaks and hickories eventually replace the pines?
   - A. Oaks grow faster than pines when both receive full sunlight.
   - B. The turkeys and owls in stand 4 kill most of the young pines.
   - C. Oak seedlings tolerate the shade under the pines, but pine seedlings do not.
   - D. Oak seedlings need bare, sunny soil in order to sprout and grow.
   - **Key: C**

5. **[BIO.8.b]** The carbon stored in the wood of stand 5 came originally from —
   - A. minerals the roots absorbed from the soil
   - B. carbon dioxide taken from the air during photosynthesis
   - C. energy released by decomposers in the leaf litter
   - D. carbon dioxide the trees released during respiration
   - **Key: B**

6. **[BIO.8.d]** Which is the best prediction if the company begins cutting every stand every 15 years instead of every 30?
   - A. The land will spend more time in early stages, favoring quail and rabbits over owls and turkeys.
   - B. Oaks and hickories will take over the stands more quickly.
   - C. Each stand will store more carbon per hectare than before.
   - D. Primary succession will begin because the harvest removes the soil.
   - **Key: A**


## Level 2 — average student (core)

### Lanternflies in the Vineyard  
`eco-lanternfly-vineyard` · Ecology · BIO.8 · level 2 · 67 words · 5 questions

> (1) The spotted lanternfly, an **invasive** insect from Asia, reached Virginia in 2018. (2) A grower near Winchester counted adult lanternflies on ten grapevines each September. (3) She found 12 in 2021, 95 in 2022, 780 in 2023 and about 6,000 in 2024. (4) On a graph the counts curve sharply upward like the letter J. (5) The insects weaken vines by sucking sap, and few local birds or wasps eat them.

1. **[BIO.8.a]** The growth pattern described in sentence 4 is best called —
   - A. exponential growth, because nothing is limiting the population yet
   - B. logistic growth, because the population has reached its carrying capacity
   - C. a boom-and-bust cycle driven by a predator
   - D. zero growth, because births and deaths are equal
   - **Key: A**

2. **[BIO.8.a]** By about how many times did the count increase from 2021 to 2022?
   - A. about 2 times
   - B. about 8 times
   - C. about 80 times
   - D. about 800 times
   - **Key: B**

3. **[BIO.8.d]** In sentence 1, calling the lanternfly invasive means that it —
   - A. is a native predator that keeps other insects in check
   - B. appears first during succession on bare ground
   - C. is a non-native species that spreads rapidly and harms native life or crops
   - D. feeds on plant sap during only one season of the year
   - **Key: C**

4. **[BIO.8.a]** Which statement best explains why the lanternfly population grew so fast?
   - A. The grapevines produced more sap each year.
   - B. Cold winters killed most of the egg masses.
   - C. The grower sprayed the vines with insecticide every spring.
   - D. With few predators and plenty of host plants, few limiting factors slowed it.
   - **Key: D**

5. **[BIO.8.a]** Which of these would most likely turn the J-shaped curve into an S-shaped curve in future years?
   - A. the limited number of host vines setting a carrying capacity
   - B. the grower counting the insects on more vines each September
   - C. warmer summers letting each female lay more egg masses on the vines
   - D. the insects spreading from the vineyard to a second vineyard nearby
   - **Key: A**

### Oxygen Below the Dairy  
`eco-mossy-creek-oxygen` · Ecology · BIO.8 · level 2 · 138 words · 6 questions

> (1) A stream team sampled Mossy Creek, a Shenandoah Valley stream, at four sites on a July morning. (2) Site 1 lies upstream of a dairy farm; sites 2 through 4 lie downstream of a barnyard where manure washes into the creek during rain. (3) At each site the team measured nitrate and dissolved oxygen and described the streambed.
> 
> | Site | Nitrate (mg/L) | Dissolved O₂ (mg/L) | Streambed |
> |---|---|---|---|
> | 1 (upstream) | 0.8 | 9.1 | clean gravel, mayflies |
> | 2 | 4.6 | 7.0 | thin algae film |
> | 3 | 6.9 | 4.2 | thick algae mats |
> | 4 | 7.4 | 2.9 | rotting algae, midge larvae |
> 
> (4) Brook trout need at least 6 mg/L of dissolved oxygen. (5) The team called the pattern **eutrophication**: extra nutrients feed algae, and when the algae die, decomposing bacteria use up the oxygen. (6) A second set of readings taken before dawn showed even less oxygen at sites 3 and 4.

1. **[BIO.8.d]** Which conclusion is best supported by the readings in the table?
   - A. Dissolved oxygen rises as nitrate rises downstream of the barnyard.
   - B. Nitrate rises and dissolved oxygen falls with distance downstream of the barnyard.
   - C. The upstream site has the most algae because it has the least nitrate.
   - D. Nitrate and oxygen stay about the same at all four sites.
   - **Key: B**

2. **[BIO.8.b]** Which process moved nitrogen from the manure into the nitrate measured in the creek?
   - A. decomposition of the manure by soil and water bacteria
   - B. photosynthesis by the algae growing on the streambed
   - C. respiration by the trout living upstream
   - D. evaporation of water from the creek surface
   - **Key: A**

3. **[BIO.8.d]** In sentence 5, eutrophication is best described as —
   - A. the warming of a stream after streamside trees are removed
   - B. the replacement of one community by another over many years
   - C. nutrient enrichment that drives algal growth and then oxygen loss
   - D. the spread of a non-native species along a stream
   - **Key: C**

4. **[BIO.8.a]** Using sentence 4 and the table, at which sites could brook trout meet their oxygen requirement on the July morning?
   - A. site 1 only
   - B. sites 1, 2 and 3
   - C. all four sites
   - D. sites 1 and 2 only
   - **Key: D**

5. **[BIO.8.d]** Which action would most directly reduce the problem the team observed?
   - A. fencing cattle out of the creek and planting a buffer strip along the bank
   - B. spreading extra fertilizer on the pasture so the grass grows thicker
   - C. stocking more brook trout at site 4 at the start of each spring
   - D. removing the mayflies from the gravel at site 1 so algae can grow
   - **Key: A**

6. **[BIO.8.b]** Which statement best explains the lower oxygen readings before dawn in sentence 6?
   - A. Cooler night water holds less dissolved oxygen than warmer daytime water does.
   - B. Algae stop photosynthesizing in the dark, but algae, bacteria and animals keep respiring.
   - C. Nitrate reacts with oxygen in the dark and removes it from the water.
   - D. Trout and other animals use far more oxygen while they rest at night.
   - **Key: B**

### Owls and Voles  
`eco-owls-voles-hayfield` · Ecology · BIO.8 · level 2 · 107 words · 6 questions

> (1) Ecologists tracked meadow voles and barn owls in a 40-hectare hayfield for eight years using live traps and nest-box checks. (2) Vole numbers rose from about 200 to nearly 3,000 in two years, crashed to under 300 the next year, and then rose again. (3) Owl numbers followed the same up-and-down pattern, but each owl peak came about one year after the vole peak. (4) On a graph the two lines look like waves, the owl wave lagging the vole wave in this **boom-and-bust** cycle. (5) In crash years the field's grass was grazed to the soil and many trapped voles were thin. (6) Red-tailed hawks also hunt voles in the field.

1. **[BIO.8.a]** Which statement best explains why each owl peak comes about a year after the vole peak?
   - A. Owls leave the field each fall and return the following spring.
   - B. Voles eat owl eggs when vole numbers are high.
   - C. Owls need time to raise more young once prey becomes plentiful.
   - D. Owls begin hunting voles only after the grass is gone.
   - **Key: C**

2. **[BIO.8.a]** The relationship between the barn owls and the voles is best described as —
   - A. predation, in which one species eats the other
   - B. mutualism, in which both species benefit
   - C. parasitism, in which one species lives on the other
   - D. competition, in which both species need the same grass
   - **Key: A**

3. **[BIO.8.d]** Suppose the farmer began mowing the whole hayfield to the ground every two weeks. Which effect is most likely?
   - A. Vole numbers would rise because the owls could no longer see them.
   - B. Vole numbers would fall because their food and cover would be removed.
   - C. Owl numbers would rise because the voles would have no grass to eat.
   - D. The boom-and-bust cycle would continue exactly as before.
   - **Key: B**

4. **[BIO.8.a]** The observations in sentence 5 are evidence that —
   - A. the owls alone caused the vole crash
   - B. the voles had reached carrying capacity and stayed there
   - C. grass is an abiotic part of the hayfield
   - D. food became a limiting factor at the vole peak
   - **Key: D**

5. **[BIO.8.a]** In sentence 4, a boom-and-bust cycle describes a population that —
   - A. overshoots its resources, crashes, and recovers again and again
   - B. grows slowly to a stable level and stays there
   - C. is wiped out by a single natural event
   - D. grows steadily because nothing limits it
   - **Key: A**

6. **[BIO.8.b]** In the hayfield food chain, the barn owl is best classified as —
   - A. a producer, because it sits at the top of the energy pyramid
   - B. a primary consumer, because it is the first animal in the chain
   - C. a secondary consumer, because it eats animals that eat grass
   - D. a decomposer, because it returns nutrients to the field when it dies
   - **Key: C**

### Dunes on Wren Island  
`eco-dune-succession-wren` · Ecology · BIO.8 · level 2 · 180 words · 6 questions

> (1) Wren Island is a barrier island off Virginia's Eastern Shore that grows as storms pile new sand onto its southern end. (2) Because the new sand is bare and has no soil, the plants that colonize it undergo **primary succession**. (3) A field team laid out four plots at increasing distances from the beach, since older sand lies farther inland. (4) In each plot they recorded the depth of dark organic soil and the plant and animal species present.
> 
> | Plot | Age of sand (yr) | Organic soil (cm) | Species recorded |
> |---|---|---|---|
> | A (foredune) | 5 | 0 | beachgrass, ghost crab |
> | B | 30 | 3 | beachgrass, seaside goldenrod, wax myrtle, sparrows |
> | C | 80 | 12 | wax myrtle, loblolly pine seedlings, cottontail rabbit |
> | D (inland) | 200 | 28 | loblolly pine, live oak, wild turkey, white-tailed deer |
> 
> (5) Beachgrass traps blowing sand, its roots hold the dune in place, and each year its dead leaves add organic matter. (6) The team expects plot D to change little over the next century unless a hurricane strips it. (7) After a small fire in 2019, plot D regrew from seeds and roots that survived in its soil.

1. **[BIO.8.c]** In sentence 2, primary succession means —
   - A. the return of a community after a fire that leaves the soil behind
   - B. the development of a community on new ground that has no soil
   - C. the replacement of a native species by an invasive one
   - D. the growth of a single population up to its carrying capacity
   - **Key: B**

2. **[BIO.8.c]** Which conclusion about the plots is best supported by the table?
   - A. As the sand ages, the organic soil deepens and the number of species increases.
   - B. Plot A has the deepest soil because it is closest to the ocean.
   - C. Loblolly pines are the first plants to colonize bare sand.
   - D. The youngest plot supports the greatest number of species.
   - **Key: A**

3. **[BIO.8.c]** Based on sentence 5 and the table, beachgrass is best described as a —
   - A. climax species that dominates the community for centuries
   - B. decomposer that breaks down dead leaves into soil
   - C. pioneer species that stabilizes the sand and begins building soil
   - D. keystone predator that controls the ghost crab population
   - **Key: C**

4. **[BIO.8.c]** Using sentence 6, plot D is best described as —
   - A. a pioneer community with only a few species
   - B. an early stage of primary succession
   - C. a dead zone where few organisms can survive
   - D. a climax community that stays fairly stable until a disturbance
   - **Key: D**

5. **[BIO.8.d]** Unlike the 2019 fire in sentence 7, a hurricane that strips plot D down to bare sand would most likely —
   - A. restart primary succession, because the soil and seed bank would be gone
   - B. cause secondary succession, because the pines would resprout from roots
   - C. have no lasting effect, because plot D is a climax community
   - D. turn plot D into a dead zone, because salt water kills decomposers
   - **Key: A**

6. **[BIO.8.b]** Based on sentence 5, the dark organic soil measured in the plots comes mainly from —
   - A. minerals carried in by wind blowing off the beach
   - B. sand grains that darken with age in the sunlight
   - C. dead plant material broken down by decomposers
   - D. nitrogen taken directly from the air by the beachgrass
   - **Key: C**

### Nitrogen on a Piedmont Farm  
`eco-nitrogen-piedmont-farm` · Ecology · BIO.8 · level 2 · 155 words · 6 questions

> (1) A farmer near Charlottesville rotates corn and soybeans and let a biology class sample her fields. (2) Corn needs a lot of nitrogen, but plants cannot use the nitrogen gas that makes up 78% of the air. (3) Soybeans host **nitrogen-fixing bacteria** in lumps on their roots called nodules; these bacteria change nitrogen gas into ammonia the plant can use. (4) When soybean roots and leftover stalks decay, decomposers release the nitrogen as ammonium, and other soil bacteria convert it to nitrate. (5) In spring the class measured soil nitrate: 6 mg/kg in a field that had grown corn the year before and 21 mg/kg in a field that had grown soybeans. (6) The farmer said the soybean field needs about half as much fertilizer for the next corn crop. (7) After heavy rain, some nitrate washes into a creek that drains to the James River. (8) Still other bacteria in wet soil turn nitrate back into nitrogen gas, completing the cycle.

1. **[BIO.8.b]** In sentence 3, nitrogen-fixing bacteria are bacteria that —
   - A. convert nitrogen gas from the air into a form plants can use
   - B. break down dead plants and release carbon dioxide
   - C. turn nitrate in the soil back into nitrogen gas
   - D. capture sunlight to make sugars for the soybean
   - **Key: A**

2. **[BIO.8.b]** Which conclusion is best supported by the nitrate measurements in sentence 5?
   - A. Corn adds more usable nitrogen to the soil than soybeans do.
   - B. Both fields contain the same amount of usable nitrogen.
   - C. The soybean crop left more usable nitrogen in the soil than the corn crop did.
   - D. Soybeans remove all of the nitrate from the soil.
   - **Key: C**

3. **[BIO.8.b]** The process described in sentence 4 is —
   - A. photosynthesis, which stores nitrogen in sugars
   - B. decomposition, which recycles nitrogen from dead matter
   - C. nitrogen fixation, which pulls nitrogen from the air
   - D. denitrification, which returns nitrogen to the air
   - **Key: B**

4. **[BIO.8.a]** Sentences 2 and 6 suggest that usable nitrogen acts on the corn crop as —
   - A. a limiting factor, since a low supply holds back the crop's growth
   - B. a decomposer, since it breaks down the old corn stalks
   - C. a predator, since it reduces the number of corn plants
   - D. a carrying capacity, since it counts the corn plants in the field
   - **Key: A**

5. **[BIO.8.d]** Which is the most likely downstream effect of the runoff described in sentence 7?
   - A. Nitrate will kill the algae in the James River.
   - B. Nitrate will raise the dissolved oxygen in the river.
   - C. Nitrate will start primary succession along the riverbank.
   - D. Nitrate will feed algal blooms that lead to low-oxygen water.
   - **Key: D**

6. **[BIO.8.b]** How does the movement of nitrogen through this farm differ from the movement of energy?
   - A. Energy is recycled by decomposers, but nitrogen is lost as heat.
   - B. Both nitrogen and energy are recycled endlessly through the field.
   - C. Nitrogen is recycled and reused, but energy enters as sunlight and leaves as heat.
   - D. Neither is recycled, so both must be added as fertilizer every year.
   - **Key: C**


## Level 3 — stretch

### Rebuilding an Oyster Reef  
`eco-oyster-reef-lynnhaven` · Ecology · BIO.8 · level 3 · 170 words · 6 questions

> (1) Eastern oysters once filtered the whole Chesapeake Bay in a matter of days, but disease, overharvest and silt cut them to about 1% of their historic numbers. (2) In 2019 a conservation group rebuilt a reef in the Lynnhaven River near Virginia Beach by piling recycled shells and seeding them with young oysters. (3) Each summer they counted live oysters, measured how deep a white disk stayed visible (water clarity), and listed the fish and crab species on the reef.
> 
> | Year | Live oysters (per m²) | Clarity (cm) | Fish and crab species |
> |---|---|---|---|
> | 2019 | 15 | 40 | 4 |
> | 2021 | 60 | 55 | 9 |
> | 2023 | 140 | 85 | 15 |
> | 2025 | 150 | 90 | 16 |
> 
> (4) One adult oyster can filter up to 190 L of water a day, removing algae and silt. (5) Upstream, nitrogen runoff from lawns and farms feeds algal blooms; when the algae die and decay, bacteria use up the oxygen and create a **dead zone**. (6) Growth slowed after 2023 as the shells filled with oysters and blue crabs and cownose rays ate many of the young.

1. **[BIO.8.d]** Which conclusion is best supported by the reef data?
   - A. Water clarity fell as the number of oysters increased.
   - B. Clearer water caused the oysters to reproduce faster.
   - C. The oysters drove away most of the fish and crab species.
   - D. As oyster numbers rose, water clarity and the number of species rose too.
   - **Key: D**

2. **[BIO.8.a]** Which statement best explains why the oyster count levelled off between 2023 and 2025?
   - A. The water became too clear for the oysters to find food.
   - B. Nitrogen runoff into the river stopped after 2023.
   - C. The reef neared its carrying capacity as space ran out and predators took young oysters.
   - D. Oysters live only two years, so the first ones seeded had died.
   - **Key: C**

3. **[BIO.8.d]** In sentence 5, a dead zone is —
   - A. an area of water with too little oxygen for most animals to survive
   - B. an area where oysters have removed all of the algae
   - C. a reef where the oysters have died of disease
   - D. a deep channel that sunlight cannot reach
   - **Key: A**

4. **[BIO.8.b]** The loss of oxygen described in sentence 5 is caused directly by —
   - A. algae using up oxygen during photosynthesis
   - B. bacteria respiring as they decompose the dead algae
   - C. nitrogen combining with oxygen in the water
   - D. oysters filtering oxygen out of the water
   - **Key: B**

5. **[BIO.8.d]** Select TWO actions that would most directly reduce dead zones in the Chesapeake Bay.
   - A. planting cover crops and streamside buffers to cut nitrogen runoff
   - B. restoring oyster reefs that filter algae from the water
   - C. adding fertilizer to the Bay so more fish can grow
   - D. removing eelgrass beds so boats can pass more easily
   - **Key: A and B**

6. **[BIO.8.b]** In the Bay food web, an oyster that filters algae from the water is a —
   - A. producer that makes its own food from sunlight
   - B. decomposer that recycles nutrients from dead matter
   - C. primary consumer that feeds on producers
   - D. tertiary consumer at the top of the food web
   - **Key: C**

### Blue Catfish in the James  
`eco-blue-catfish-james` · Ecology · BIO.8 · level 3 · 206 words · 6 questions

> (1) Blue catfish were brought from the Mississippi River basin and stocked in the James River in the 1970s as a sport fish. (2) They grow to more than 40 kg, eat almost anything, and now make up most of the fish biomass in some tidal stretches. (3) A state biologist surveyed the same 2 km stretch of the tidal James by electrofishing every June. (4) She counted blue catfish, native white catfish and blue crabs, and examined the stomach contents of 50 blue catfish.
> 
> | Year | Blue catfish | White catfish | Blue crabs |
> |---|---|---|---|
> | 2005 | 40 | 210 | 180 |
> | 2010 | 260 | 120 | 150 |
> | 2015 | 740 | 45 | 70 |
> | 2020 | 780 | 30 | 45 |
> | 2025 | 770 | 28 | 40 |
> 
> (5) The stomachs held blue crabs, menhaden, freshwater mussels, plant material and, in the largest fish, white catfish. (6) Plotted over time, the blue catfish count rose steeply and then flattened after 2015, while the white catfish count fell year after year. (7) White catfish and blue catfish both feed on the river bottom and shelter in the same deep holes. (8) Virginia now encourages commercial harvest of blue catfish and sets no daily limit for anglers. (9) The biologist noted that an **omnivore** like the blue catfish, which feeds at several trophic levels, is very hard to remove once it is established.

1. **[BIO.8.a]** Which conclusion about the blue catfish is best supported by the survey table?
   - A. Their numbers rose only after the white catfish disappeared.
   - B. Their numbers and the blue crab numbers rose together.
   - C. Their numbers fell steadily along with the other two species.
   - D. Their numbers grew rapidly until about 2015 and then held near 780.
   - **Key: D**

2. **[BIO.8.a]** Sentence 7 describes which interaction between white catfish and blue catfish?
   - A. competition, because they use the same food and shelter
   - B. mutualism, because each helps the other find food
   - C. commensalism, because one benefits and the other is unaffected
   - D. parasitism, because one lives on the body of the other
   - **Key: A**

3. **[BIO.8.a]** Which statement best explains why the blue catfish count flattened after 2015?
   - A. White catfish began eating most of the young blue catfish.
   - B. The biologist stopped counting any fish heavier than 40 kg.
   - C. The population reached the stretch's carrying capacity as food and shelter grew scarce.
   - D. Blue crabs disappeared from the river, so the blue catfish starved.
   - **Key: C**

4. **[BIO.8.d]** Select TWO statements that together explain why biologists classify the blue catfish as an invasive species in the James.
   - A. Humans introduced it from outside the region where it evolved.
   - B. It harms native populations such as white catfish and blue crabs.
   - C. It reached a carrying capacity, which no native species can do.
   - D. It grows larger than any fish that lived in the river before.
   - **Key: A and B**

5. **[BIO.8.b]** In sentence 9, an omnivore is an animal that —
   - A. is a top predator with no natural enemies
   - B. eats both plants and animals
   - C. eats only other species of fish
   - D. breaks down dead material on the river bottom
   - **Key: B**

6. **[BIO.8.b]** The largest blue catfish, which eat white catfish, are far fewer than the small ones that eat mussels and plants. Which statement best explains this?
   - A. Top consumers have the most energy available, so they need fewer individuals.
   - B. Large blue catfish stop reproducing once they grow past 40 kg.
   - C. Only about 10% of energy passes up each trophic level, so little supports top consumers.
   - D. Anglers are allowed to keep only the largest blue catfish they catch.
   - **Key: C**

### A Lake After the Fire  
`eco-lark-lake-wildfire` · Ecology · BIO.8 · level 3 · 209 words · 6 questions

> (1) Lark Lake sits in a forested basin in the Rocky Mountains and is fed by snowmelt streams. (2) One August a wildfire burned most of the trees around the lake. (3) Autumn rain washed ash rich in phosphorus and nitrogen into the water. (4) A research station had sampled the lake monthly for years, so scientists could compare conditions before and after the fire.
> 
> (5) The next spring, **phytoplankton** (floating algae) rose from about 500 cells per mL to 20,000 cells per mL in six weeks, a J-shaped curve. (6) Zooplankton that graze on the algae increased about a month later, and the algae then fell to 4,000 cells per mL and held there, so the full graph looks like a J that bends into a plateau. (7) Trout that eat the zooplankton grew faster that summer. (8) Dissolved oxygen at the lake bottom dropped from 8 mg/L to 2 mg/L in late summer as dead algae sank and decayed. (9) With no tree roots to hold the slopes, mud washed into the shallows after each rain, and stream flow into the lake rose because less water was taken up by plants and returned to the air. (10) By the third year, fireweed and aspen sprouts covered the burned slopes and the spring algae peak was much smaller.

1. **[BIO.8.a]** Based on sentence 6, the algae's J-shaped curve bent into a plateau mainly because —
   - A. the lake froze and blocked sunlight from the algae
   - B. grazing by zooplankton and the shrinking nutrient supply limited the algae
   - C. the trout began feeding directly on the algae
   - D. the fire heated the water above what algae can tolerate
   - **Key: B**

2. **[BIO.8.b]** In sentence 5, the phytoplankton act in the lake as —
   - A. producers that convert sunlight into chemical energy for the food web
   - B. primary consumers that feed on the zooplankton
   - C. decomposers that release nutrients from dead trout
   - D. an abiotic factor that limits the trout population
   - **Key: A**

3. **[BIO.8.b]** Which sequence correctly shows the flow of energy described in sentences 5 through 7?
   - A. trout → zooplankton → phytoplankton → sunlight
   - B. ash → phytoplankton → trout → zooplankton
   - C. phytoplankton → sunlight → zooplankton → trout
   - D. sunlight → phytoplankton → zooplankton → trout
   - **Key: D**

4. **[BIO.8.b]** Which statement best explains why stream flow into the lake rose after the fire, as described in sentence 9?
   - A. The fire added water to the soil as the trees burned.
   - B. More water evaporated from the surface of the lake.
   - C. With fewer plants transpiring, more rain and snowmelt ran off into the lake.
   - D. The mud raised the lake bottom and pushed water upstream.
   - **Key: C**

5. **[BIO.8.d]** The low-oxygen water in sentence 8 is most similar to which problem in Virginia?
   - A. the dead zone in the Chesapeake Bay fed by nutrient runoff
   - B. the spread of kudzu along roadsides and field edges
   - C. the warming of trout streams after streamside trees are cut
   - D. the loss of ash trees to the emerald ash borer
   - **Key: A**

6. **[BIO.8.c]** The regrowth on the slopes in sentence 10 is best described as —
   - A. primary succession, because the fire removed all of the soil
   - B. a climax community, because aspen will dominate for centuries
   - C. an invasive takeover, because fireweed is not native to the mountains
   - D. secondary succession, because soil and roots survived the fire
   - **Key: D**

