/* SOL Lab — Algebra I · Statistics: the data cycle with bivariate data (A.ST). Original data only.
   Stems are plain text; the stimulus may use HTML. */
(function (global) {
  var P = global.HEIST_PACKS;
  if (!P || !P.push) return;
  var N = function (i) { return '<span class="n">(' + i + ')</span> '; };   // numbered sentence

  var PACKS = [

    /* ---------- tiny · level 1 · A.ST.1 e–g ---------- */
    {
      id: "st-study-hours",
      family: "ST",
      title: "Study Hours and Quiz Scores",
      kind: "Statistics · A.ST.1",
      blurb: "Hours studied against quiz score, with a line of best fit.",
      level: 1,
      passage: "<p>" + N(1) + "Six students recorded how many hours they studied for a quiz and their scores. " + N(2) + "Using technology, the class found the <strong>line of best fit</strong> y = 6x + 58, where x is hours and y is the score.</p>" +
        "<table><tr><th>Hours</th><th>1</th><th>2</th><th>2</th><th>3</th><th>4</th><th>5</th></tr><tr><th>Score</th><td>62</td><td>72</td><td>68</td><td>78</td><td>80</td><td>90</td></tr></table>",
      claims: [
        {
          id: "direction",
          sol: "A.ST.1.f",
          stem: "Which statement describes the relationship in the scatterplot?",
          choices: [
            { letter: "A", text: "a negative association: more hours, lower scores" },
            { letter: "B", text: "a positive association: more hours, higher scores" },
            { letter: "C", text: "no association between hours and scores" },
            { letter: "D", text: "a quadratic pattern that rises and then falls" }
          ],
          correct: "B"
        },
        {
          id: "explanatory",
          sol: "A.ST.1.b",
          stem: "In this investigation, which variable is the explanatory (independent) variable?",
          choices: [
            { letter: "A", text: "the quiz score" },
            { letter: "B", text: "the number of students" },
            { letter: "C", text: "the number of hours studied" },
            { letter: "D", text: "the line of best fit" }
          ],
          correct: "C"
        },
        {
          id: "predict",
          sol: "A.ST.1.g",
          stem: "Using the line of best fit, what score is predicted for a student who studies 4 hours?",
          choices: [
            { letter: "A", text: "82" },
            { letter: "B", text: "80" },
            { letter: "C", text: "64" },
            { letter: "D", text: "88" }
          ],
          correct: "A"
        },
        {
          id: "slope",
          sol: "A.ST.1.e",
          stem: "What does the slope 6 mean in context?",
          choices: [
            { letter: "A", text: "Each extra hour of study is associated with about 6 more points." },
            { letter: "B", text: "Students who do not study score about 6 points." },
            { letter: "C", text: "Six students took the quiz." },
            { letter: "D", text: "The highest possible score is 6 points above 58." }
          ],
          correct: "A"
        },
        {
          id: "intercept",
          sol: "A.ST.1.e",
          stem: "What does the y-intercept 58 represent?",
          choices: [
            { letter: "A", text: "the score gained per hour of study" },
            { letter: "B", text: "the number of hours needed to pass" },
            { letter: "C", text: "the average score of the six students" },
            { letter: "D", text: "the predicted score for a student who studies 0 hours" }
          ],
          correct: "D"
        }
      ]
    },

    /* ---------- tiny · level 1 · A.ST.1 a–d ---------- */
    {
      id: "st-snow-cones",
      family: "ST",
      title: "Snow Cones and the Thermometer",
      kind: "Statistics · A.ST.1",
      blurb: "Planning a data investigation: question, variables, sample and graph.",
      level: 1,
      passage: "<p>" + N(1) + "Jaylen runs a snow-cone stand at the town pool. " + N(2) + "He thinks he sells more on hotter days and wants to plan the <strong>data cycle</strong>: ask a question, collect data, make a graph, and draw a conclusion. " + N(3) + "The pool is open every day from June to August.</p>",
      claims: [
        {
          id: "question",
          sol: "A.ST.1.a",
          stem: "Which is the best investigative question for Jaylen's study?",
          choices: [
            { letter: "A", text: "What was the high temperature at the pool on July 4?" },
            { letter: "B", text: "Is there a relationship between the day's high temperature and snow cones sold?" },
            { letter: "C", text: "How many snow cones did Jaylen sell over the whole summer?" },
            { letter: "D", text: "Which flavor of snow cone is the most popular at the pool?" }
          ],
          correct: "B"
        },
        {
          id: "variables",
          sol: "A.ST.1.b",
          stem: "Which pair of variables should Jaylen record each day?",
          choices: [
            { letter: "A", text: "the date and the pool's opening time" },
            { letter: "B", text: "the number of lifeguards and the number of swimmers" },
            { letter: "C", text: "the high temperature and the number of snow cones sold" },
            { letter: "D", text: "the price of a snow cone and the color of the sky" }
          ],
          correct: "C"
        },
        {
          id: "sample",
          sol: "A.ST.1.c",
          stem: "Which sample of days would give the most representative data?",
          choices: [
            { letter: "A", text: "the ten hottest days of the summer" },
            { letter: "B", text: "every day of one rainy week in June" },
            { letter: "C", text: "only the days when the pool held a swim meet" },
            { letter: "D", text: "twenty days chosen at random from the whole summer" }
          ],
          correct: "D"
        },
        {
          id: "plot",
          sol: "A.ST.1.d",
          stem: "How should Jaylen set up his scatterplot?",
          choices: [
            { letter: "A", text: "temperature on the horizontal axis, snow cones sold on the vertical axis, one point per day" },
            { letter: "B", text: "snow cones sold on the horizontal axis, temperature on the vertical axis, one bar per week" },
            { letter: "C", text: "days on the horizontal axis and both variables stacked on the vertical axis" },
            { letter: "D", text: "a circle graph showing the share of sales on hot days" }
          ],
          correct: "A"
        },
        {
          id: "extrapolate",
          sol: "A.ST.1.g",
          stem: "Jaylen's line of best fit predicts 190 snow cones for a 120°F day. Why is this prediction unreasonable?",
          choices: [
            { letter: "A", text: "Lines of best fit cannot be used for predictions." },
            { letter: "B", text: "120°F is far outside his data, and the pool would likely be closed." },
            { letter: "C", text: "The number 190 is not a whole number of snow cones." },
            { letter: "D", text: "Sales always go down when it is hotter." }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- short · level 2 · A.ST.1 e–h ---------- */
    {
      id: "st-used-cars",
      family: "ST",
      title: "Age and Price of Used Cars",
      kind: "Statistics · A.ST.1",
      blurb: "A negative association, an outlier, and an x-intercept that makes no sense.",
      level: 2,
      passage: "<p>" + N(1) + "A consumer class collected the age and asking price of 30 used cars of one model from online listings. " + N(2) + "The line of best fit is y = −1500x + 18000, where x is the age in years and y the price in dollars. " + N(3) + "Most points lie close to the line, but one 3-year-old car is listed at $4,000. " + N(4) + "The oldest car in the data is 9 years old.</p>",
      claims: [
        {
          id: "direction",
          sol: "A.ST.1.f",
          stem: "Which statement describes the association between age and price?",
          choices: [
            { letter: "A", text: "positive and strong" },
            { letter: "B", text: "negative and strong" },
            { letter: "C", text: "negative and weak" },
            { letter: "D", text: "no association" }
          ],
          correct: "B"
        },
        {
          id: "predict",
          sol: "A.ST.1.g",
          stem: "What price does the line predict for a 5-year-old car?",
          choices: [
            { letter: "A", text: "$16,500" },
            { letter: "B", text: "$7,500" },
            { letter: "C", text: "$10,500" },
            { letter: "D", text: "$12,000" }
          ],
          correct: "C"
        },
        {
          id: "slope",
          sol: "A.ST.1.e",
          stem: "What does the slope −1500 mean?",
          choices: [
            { letter: "A", text: "The predicted price drops about $1,500 per year of age." },
            { letter: "B", text: "A brand-new car of this model costs $1,500." },
            { letter: "C", text: "The oldest car in the data sells for $1,500." },
            { letter: "D", text: "Fifteen hundred cars were included in the sample." }
          ],
          correct: "A"
        },
        {
          id: "outlier",
          sol: "A.ST.1.f",
          stem: "The 3-year-old car listed at $4,000 is best described as —",
          choices: [
            { letter: "A", text: "the y-intercept of the line" },
            { letter: "B", text: "proof that the association is positive" },
            { letter: "C", text: "a typical point, since the line predicts $4,000 at age 3" },
            { letter: "D", text: "an outlier, far below the $13,500 the line predicts" }
          ],
          correct: "D"
        },
        {
          id: "x-intercept",
          sol: "A.ST.1.g",
          stem: "The line reaches y = 0 at x = 12. Why should the class not conclude that a 12-year-old car is free?",
          choices: [
            { letter: "A", text: "Twelve years is beyond the oldest car in the data, so this is extrapolation." },
            { letter: "B", text: "The slope should have been positive." },
            { letter: "C", text: "The line of best fit is only valid at whole-number ages." },
            { letter: "D", text: "A 12-year-old car would be worth more than a new one." }
          ],
          correct: "A"
        }
      ]
    },

    /* ---------- short · level 2 · A.ST.1 e ---------- */
    {
      id: "st-rocket-curve",
      family: "ST",
      title: "Curve of Best Fit for a Rocket",
      kind: "Statistics · A.ST.1",
      blurb: "Height data that rises and falls. Why a quadratic curve fits better than a line.",
      level: 2,
      passage: "<p>" + N(1) + "A physics class launched a water rocket and used a video to measure its height every half second. " + N(2) + "Plotted on a scatterplot, the points rise, level off and fall. " + N(3) + "Using technology, the class compared a linear fit and a quadratic fit and chose the <strong>quadratic curve of best fit</strong> h = −4.9t² + 19.6t + 0.5.</p>" +
        "<table><tr><th>t (s)</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th></tr><tr><th>h (m)</th><td>0.5</td><td>15.1</td><td>20.3</td><td>15.4</td><td>0.6</td></tr></table>",
      claims: [
        {
          id: "why-quadratic",
          sol: "A.ST.1.e",
          stem: "Why is a quadratic curve a better model than a line for these data?",
          choices: [
            { letter: "A", text: "The points rise and then fall, and a line cannot change direction." },
            { letter: "B", text: "There are five data points, and a quadratic always fits five points exactly." },
            { letter: "C", text: "The heights are measured in meters." },
            { letter: "D", text: "A line would have a negative slope." }
          ],
          correct: "A"
        },
        {
          id: "predict",
          sol: "A.ST.1.g",
          stem: "Using the curve, what height is predicted at t = 2 seconds?",
          choices: [
            { letter: "A", text: "39.7 m" },
            { letter: "B", text: "20.1 m" },
            { letter: "C", text: "10.3 m" },
            { letter: "D", text: "29.9 m" }
          ],
          correct: "B"
        },
        {
          id: "peak",
          sol: "A.ST.1.g",
          stem: "About when does the model say the rocket reaches its greatest height?",
          choices: [
            { letter: "A", text: "t = 4 s, when it lands" },
            { letter: "B", text: "t = 0 s, at launch" },
            { letter: "C", text: "t = 2 s, at the vertex" },
            { letter: "D", text: "t = 19.6 s, from the middle term" }
          ],
          correct: "C"
        },
        {
          id: "outside",
          sol: "A.ST.1.h",
          stem: "The curve gives h = −24 at t = 5 seconds. What should the class conclude?",
          choices: [
            { letter: "A", text: "The rocket goes underground after landing." },
            { letter: "B", text: "The model does not apply after the rocket lands at about t = 4 s." },
            { letter: "C", text: "The quadratic fit is wrong and a line should be used." },
            { letter: "D", text: "The rocket was launched from 24 m below the ground." }
          ],
          correct: "B"
        },
        {
          id: "collect",
          sol: "A.ST.1.d",
          stem: "Which variable belongs on the horizontal axis of the scatterplot?",
          choices: [
            { letter: "A", text: "height, because it is what the class measured" },
            { letter: "B", text: "the number of launches" },
            { letter: "C", text: "the video frame rate" },
            { letter: "D", text: "time, because height depends on time" }
          ],
          correct: "D"
        }
      ]
    },

    /* ---------- tiny · level 1 · A.ST.1 a–c ---------- */
    {
      id: "st-sleep-survey",
      family: "ST",
      title: "Planning a Sleep Survey",
      kind: "Statistics · A.ST.1",
      blurb: "The student council wants bivariate data on sleep. What should they ask and whom?",
      level: 1,
      passage: "<p>" + N(1) + "The student council wants to know whether students who ride the bus longer get less sleep. " + N(2) + "The school has 1,200 students in grades 9 through 12. " + N(3) + "The council can survey about 100 of them and wants results that represent the whole school.</p>",
      claims: [
        {
          id: "question",
          sol: "A.ST.1.a",
          stem: "Which question requires bivariate data?",
          choices: [
            { letter: "A", text: "How many minutes do students spend on the bus?" },
            { letter: "B", text: "How many students ride the bus?" },
            { letter: "C", text: "Is bus ride time related to hours of sleep?" },
            { letter: "D", text: "Do seniors sleep more than freshmen?" }
          ],
          correct: "C"
        },
        {
          id: "variables",
          sol: "A.ST.1.b",
          stem: "Which two variables should each surveyed student report?",
          choices: [
            { letter: "A", text: "grade level and favorite subject" },
            { letter: "B", text: "minutes on the bus and hours of sleep last night" },
            { letter: "C", text: "bus number and homeroom teacher" },
            { letter: "D", text: "hours of sleep and hours of homework" }
          ],
          correct: "B"
        },
        {
          id: "sample",
          sol: "A.ST.1.c",
          stem: "Which sampling method is most likely to represent the whole school?",
          choices: [
            { letter: "A", text: "surveying the first 100 students who arrive on one bus" },
            { letter: "B", text: "surveying the entire football team" },
            { letter: "C", text: "surveying 100 students whose names are drawn at random from the school roster" },
            { letter: "D", text: "posting the survey online and using whoever answers first" }
          ],
          correct: "C"
        },
        {
          id: "bias",
          sol: "A.ST.1.c",
          stem: "Why would surveying only students on one bus route give a poor sample?",
          choices: [
            { letter: "A", text: "Riders on one route have similar ride times, so bus time barely varies." },
            { letter: "B", text: "One bus cannot hold 100 students at a time." },
            { letter: "C", text: "Students who ride the bus never get enough sleep." },
            { letter: "D", text: "The survey would take too long to hand out." }
          ],
          correct: "A"
        },
        {
          id: "display",
          sol: "A.ST.1.d",
          stem: "After collecting the data, which display best shows whether the two variables are related?",
          choices: [
            { letter: "A", text: "a bar graph of the number of students in each grade" },
            { letter: "B", text: "a scatterplot of bus minutes against sleep hours" },
            { letter: "C", text: "a circle graph of favorite bus routes" },
            { letter: "D", text: "a list of the 100 names" }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- medium · level 2 · A.ST.1 e–h ---------- */
    {
      id: "st-fertilizer-plants",
      family: "ST",
      title: "How Much Fertilizer?",
      kind: "Statistics · A.ST.1",
      blurb: "Plant growth rises with fertilizer, then drops. Choosing and using a quadratic fit.",
      level: 2,
      passage: "<p>" + N(1) + "An agriculture class grew tomato seedlings with different amounts of fertilizer, in grams per pot, and measured each plant's height after four weeks. " + N(2) + "The scatterplot rose at first, peaked, then fell as heavy fertilizer burned the roots. " + N(3) + "The class chose the quadratic curve of best fit <strong>h = −0.5g² + 6g + 12</strong>, where g is grams and h is height in centimeters. " + N(4) + "The data ran from 0 to 12 grams.</p>" +
        "<table><tr><th>g</th><th>0</th><th>2</th><th>4</th><th>6</th><th>8</th><th>10</th><th>12</th></tr><tr><th>h (cm)</th><td>11</td><td>23</td><td>27</td><td>30</td><td>29</td><td>21</td><td>13</td></tr></table>",
      claims: [
        {
          id: "shape",
          sol: "A.ST.1.f",
          stem: "Which description of the relationship fits the data?",
          choices: [
            { letter: "A", text: "a linear positive association: more fertilizer, taller plants at every level" },
            { letter: "B", text: "no association between fertilizer and height" },
            { letter: "C", text: "a quadratic relationship: height rises to a peak near 6 grams and then falls" },
            { letter: "D", text: "a linear negative association: more fertilizer, shorter plants" }
          ],
          correct: "C"
        },
        {
          id: "predict",
          sol: "A.ST.1.g",
          stem: "What height does the curve predict for 5 grams of fertilizer?",
          choices: [
            { letter: "A", text: "29.5 cm" },
            { letter: "B", text: "42 cm" },
            { letter: "C", text: "24.5 cm" },
            { letter: "D", text: "54.5 cm" }
          ],
          correct: "A"
        },
        {
          id: "best",
          sol: "A.ST.1.g",
          stem: "According to the model, which amount of fertilizer gives the greatest predicted height?",
          choices: [
            { letter: "A", text: "12 grams, the most fertilizer" },
            { letter: "B", text: "6 grams, at the vertex of the curve" },
            { letter: "C", text: "0 grams, because fertilizer burns roots" },
            { letter: "D", text: "3 grams, half of 6" }
          ],
          correct: "B"
        },
        {
          id: "extrapolate",
          sol: "A.ST.1.h",
          stem: "A student uses the curve to predict the height for 20 grams and gets −68 cm. What is the best response?",
          choices: [
            { letter: "A", text: "The plant would grow 68 cm downward." },
            { letter: "B", text: "The data stop at 12 grams; 20 grams is far outside the model's range." },
            { letter: "C", text: "The class should have used a line of best fit." },
            { letter: "D", text: "Negative heights are fine because the curve is quadratic." }
          ],
          correct: "B"
        },
        {
          id: "intercept",
          sol: "A.ST.1.e",
          stem: "What does the constant 12 in the model represent?",
          choices: [
            { letter: "A", text: "the predicted height of a plant given no fertilizer" },
            { letter: "B", text: "the most fertilizer used in the study" },
            { letter: "C", text: "the number of plants in the study" },
            { letter: "D", text: "the height gained per gram of fertilizer" }
          ],
          correct: "A"
        },
        {
          id: "variables",
          sol: "A.ST.1.b",
          stem: "Which other variable should the class have kept the same for every pot?",
          choices: [
            { letter: "A", text: "the amount of fertilizer" },
            { letter: "B", text: "the final height" },
            { letter: "C", text: "the sunlight and water each pot received" },
            { letter: "D", text: "the number of weeks, which should vary by pot" }
          ],
          correct: "C"
        }
      ]
    },

    /* ---------- medium · level 2 · A.ST.1 e–h ---------- */
    {
      id: "st-screen-time",
      family: "ST",
      title: "Screen Time and Sleep",
      kind: "Statistics · A.ST.1",
      blurb: "A negative line of best fit, its meaning, and the difference between correlation and cause.",
      level: 2,
      passage: "<p>" + N(1) + "A health class asked 40 students how many hours they used screens after school and how many hours they slept that night. " + N(2) + "The scatterplot shows a moderate negative association. " + N(3) + "The line of best fit is <strong>y = −0.5x + 9.5</strong>, where x is screen hours and y is sleep hours. " + N(4) + "Screen time in the data ranged from 0 to 6 hours. " + N(5) + "One student concludes that screens cause students to lose sleep.</p>",
      claims: [
        {
          id: "slope",
          sol: "A.ST.1.e",
          stem: "What does the slope −0.5 mean in context?",
          choices: [
            { letter: "A", text: "Each extra hour of screen time is associated with about half an hour less sleep." },
            { letter: "B", text: "Students sleep half as long as they use screens." },
            { letter: "C", text: "Half of the students use screens after school." },
            { letter: "D", text: "Each extra hour of sleep causes half an hour less screen time." }
          ],
          correct: "A"
        },
        {
          id: "predict",
          sol: "A.ST.1.g",
          stem: "How many hours of sleep does the line predict for a student with 3 hours of screen time?",
          choices: [
            { letter: "A", text: "9 hours" },
            { letter: "B", text: "6.5 hours" },
            { letter: "C", text: "8 hours" },
            { letter: "D", text: "11 hours" }
          ],
          correct: "C"
        },
        {
          id: "interpolate",
          sol: "A.ST.1.g",
          stem: "Which prediction from the line is most trustworthy?",
          choices: [
            { letter: "A", text: "sleep for 15 hours of screen time" },
            { letter: "B", text: "sleep for 4 hours of screen time" },
            { letter: "C", text: "sleep for 19 hours of screen time, when the line reaches 0" },
            { letter: "D", text: "screen time for a student who slept 12 hours" }
          ],
          correct: "B"
        },
        {
          id: "causation",
          sol: "A.ST.1.h",
          stem: "Why is the student's conclusion in sentence 5 too strong?",
          choices: [
            { letter: "A", text: "The slope is negative, which means there is no relationship." },
            { letter: "B", text: "A survey cannot measure how long students sleep." },
            { letter: "C", text: "An association shows the variables move together, not that one causes the other." },
            { letter: "D", text: "Forty students is too many for a valid survey result." }
          ],
          correct: "C"
        },
        {
          id: "explanatory",
          sol: "A.ST.1.b",
          stem: "Which variable did the class treat as the explanatory variable?",
          choices: [
            { letter: "A", text: "hours of sleep" },
            { letter: "B", text: "hours of screen time" },
            { letter: "C", text: "the number of students" },
            { letter: "D", text: "the y-intercept" }
          ],
          correct: "B"
        },
        {
          id: "y-int",
          sol: "A.ST.1.e",
          stem: "What does the y-intercept 9.5 represent?",
          choices: [
            { letter: "A", text: "the most sleep any student reported" },
            { letter: "B", text: "the number of hours of screen time when sleep is 0" },
            { letter: "C", text: "the average screen time of the class" },
            { letter: "D", text: "the predicted sleep, in hours, for a student with no screen time" }
          ],
          correct: "D"
        }
      ]
    },

    /* ---------- short · level 2 · A.ST.1 f ---------- */
    {
      id: "st-four-plots",
      family: "ST",
      title: "Four Scatterplots",
      kind: "Statistics · A.ST.1",
      blurb: "Match each described scatterplot to its association: positive, negative, none, or curved.",
      level: 2,
      passage: "<p>" + N(1) + "Four scatterplots are described. " + N(2) + "Plot 1: shoe size against score on a history test; the points are scattered evenly with no pattern. " + N(3) + "Plot 2: years of experience against hourly pay for 25 electricians; the points climb steadily from lower left to upper right and lie close to a line. " + N(4) + "Plot 3: outdoor temperature against heating cost; the points fall from upper left to lower right. " + N(5) + "Plot 4: seconds after a bounce against a ball's height; the points rise and then fall.</p>",
      claims: [
        {
          id: "none",
          sol: "A.ST.1.f",
          stem: "Which plot shows no association?",
          choices: [
            { letter: "A", text: "Plot 1" },
            { letter: "B", text: "Plot 2" },
            { letter: "C", text: "Plot 3" },
            { letter: "D", text: "Plot 4" }
          ],
          correct: "A"
        },
        {
          id: "strong-positive",
          sol: "A.ST.1.f",
          stem: "Which plot shows a strong positive linear association?",
          choices: [
            { letter: "A", text: "Plot 1" },
            { letter: "B", text: "Plot 2" },
            { letter: "C", text: "Plot 3" },
            { letter: "D", text: "Plot 4" }
          ],
          correct: "B"
        },
        {
          id: "negative",
          sol: "A.ST.1.f",
          stem: "For Plot 3, which line of best fit is possible?",
          choices: [
            { letter: "A", text: "y = 3x + 40" },
            { letter: "B", text: "y = 3x² + 40" },
            { letter: "C", text: "y = −3x + 240" },
            { letter: "D", text: "y = x² − 40" }
          ],
          correct: "C"
        },
        {
          id: "curve",
          sol: "A.ST.1.e",
          stem: "Which plot calls for a quadratic curve of best fit rather than a line?",
          choices: [
            { letter: "A", text: "Plot 1" },
            { letter: "B", text: "Plot 2" },
            { letter: "C", text: "Plot 3" },
            { letter: "D", text: "Plot 4" }
          ],
          correct: "D"
        },
        {
          id: "meaning",
          sol: "A.ST.1.h",
          stem: "What can be concluded from Plot 1?",
          choices: [
            { letter: "A", text: "Larger shoes cause lower history scores." },
            { letter: "B", text: "Shoe size is not useful for predicting a history score." },
            { letter: "C", text: "The line of best fit has a steep positive slope." },
            { letter: "D", text: "Students with the same shoe size have the same score." }
          ],
          correct: "B"
        }
      ]
    },

    /* ---------- medium · level 3 · A.ST.1 e–h ---------- */
    {
      id: "st-concession-price",
      family: "ST",
      title: "Pricing the Concession Stand",
      kind: "Statistics · A.ST.1",
      blurb: "Price against revenue: a quadratic model tells the boosters what to charge.",
      level: 3,
      passage: "<p>" + N(1) + "The booster club tried a different price for a hot dog at each of eight home games and recorded the revenue. " + N(2) + "As the price rose, revenue rose at first and then fell as fewer fans bought. " + N(3) + "Using technology, the club found the quadratic curve of best fit <strong>R = −20p² + 200p</strong>, where p is the price in dollars and R the revenue. " + N(4) + "Prices in the data ranged from $1 to $8.</p>" +
        "<table><tr><th>p ($)</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr><tr><th>R ($)</th><td>185</td><td>315</td><td>425</td><td>475</td><td>505</td><td>470</td><td>395</td><td>330</td></tr></table>",
      claims: [
        {
          id: "question",
          sol: "A.ST.1.a",
          stem: "Which investigative question did the club set out to answer?",
          choices: [
            { letter: "A", text: "How many hot dogs were sold at the third game?" },
            { letter: "B", text: "How is hot dog price related to revenue, and which price earns the most?" },
            { letter: "C", text: "Which home game had the largest crowd this season?" },
            { letter: "D", text: "Do fans prefer hot dogs or nachos at the stand?" }
          ],
          correct: "B"
        },
        {
          id: "best-price",
          sol: "A.ST.1.g",
          stem: "According to the model, which price maximizes revenue?",
          choices: [
            { letter: "A", text: "$8" },
            { letter: "B", text: "$10" },
            { letter: "C", text: "$5" },
            { letter: "D", text: "$2.50" }
          ],
          correct: "C"
        },
        {
          id: "predict",
          sol: "A.ST.1.g",
          stem: "What revenue does the model predict at a price of $3?",
          choices: [
            { letter: "A", text: "$420" },
            { letter: "B", text: "$540" },
            { letter: "C", text: "$180" },
            { letter: "D", text: "$600" }
          ],
          correct: "A"
        },
        {
          id: "linear-wrong",
          sol: "A.ST.1.e",
          stem: "Why would a line of best fit be a poor model for these data?",
          choices: [
            { letter: "A", text: "The revenue values are too large for a line." },
            { letter: "B", text: "There are eight points, and a line needs exactly two." },
            { letter: "C", text: "The data rise and then fall, so no single slope describes them." },
            { letter: "D", text: "Prices are whole dollars." }
          ],
          correct: "C"
        },
        {
          id: "zero",
          sol: "A.ST.1.h",
          stem: "The model gives R = 0 at p = 10. What is the most reasonable interpretation?",
          choices: [
            { letter: "A", text: "Few would buy at $10, but $10 is outside the tested prices, so be cautious." },
            { letter: "B", text: "At $10 the club would earn its greatest revenue of the season." },
            { letter: "C", text: "The model is wrong, because revenue can never be zero." },
            { letter: "D", text: "At $10 each fan would buy exactly one hot dog." }
          ],
          correct: "A"
        },
        {
          id: "limits",
          sol: "A.ST.1.h",
          stem: "Which factor most limits the conclusions the club can draw?",
          choices: [
            { letter: "A", text: "Each price was tried at one game, so crowd size and weather also varied." },
            { letter: "B", text: "The prices were listed in dollars instead of cents." },
            { letter: "C", text: "A quadratic model can only be used for projectiles." },
            { letter: "D", text: "Revenue is not a numerical variable." }
          ],
          correct: "A"
        }
      ]
    },

    /* ---------- long · level 3 · A.ST.1 a–h ---------- */
    {
      id: "st-oyster-harvest",
      family: "ST",
      title: "Oysters on the Rappahannock",
      kind: "Statistics · A.ST.1",
      blurb: "Years of oyster harvest data from Virginia reefs: a full pass through the data cycle.",
      level: 3,
      passage: "<p>" + N(1) + "A marine science club studied how the oyster harvest on restored reefs in the Rappahannock River has changed. " + N(2) + "Each fall they sampled 10 reefs chosen at random from the 60 restored reefs and recorded the harvest in bushels per reef. " + N(3) + "Let x be years since 2015 and y the average bushels per reef. " + N(4) + "Technology gave the line of best fit <strong>y = 12.5x + 40</strong>. " + N(5) + "The 2018 value, 55 bushels, sits well below the line because a tropical storm buried part of the reefs that summer. " + N(6) + "A club member wants to use the line to predict the harvest in 2050. " + N(7) + "Another argues that the restoration work caused the increase.</p>" +
        "<table><tr><th>Year</th><th>2015</th><th>2016</th><th>2017</th><th>2018</th><th>2019</th><th>2020</th><th>2021</th></tr><tr><th>Bushels</th><td>42</td><td>50</td><td>68</td><td>55</td><td>92</td><td>101</td><td>117</td></tr></table>",
      claims: [
        {
          id: "question",
          sol: "A.ST.1.a",
          stem: "Which investigative question best matches the club's study?",
          choices: [
            { letter: "A", text: "How many oysters live in the Rappahannock River?" },
            { letter: "B", text: "How has the average harvest per restored reef changed over the years since 2015?" },
            { letter: "C", text: "Which reef had the largest harvest in 2021?" },
            { letter: "D", text: "Are oysters more common in rivers or in the Chesapeake Bay?" }
          ],
          correct: "B"
        },
        {
          id: "sample",
          sol: "A.ST.1.c",
          stem: "Why did the club choose 10 reefs at random each year instead of the 10 reefs closest to the dock?",
          choices: [
            { letter: "A", text: "Random reefs are easier to reach." },
            { letter: "B", text: "The reefs near the dock have no oysters." },
            { letter: "C", text: "A random sample better represents all 60 reefs, near and far." },
            { letter: "D", text: "Ten is the largest number of reefs a boat can visit." }
          ],
          correct: "C"
        },
        {
          id: "slope",
          sol: "A.ST.1.e",
          stem: "What does the slope 12.5 mean in context?",
          choices: [
            { letter: "A", text: "The average harvest per reef grew about 12.5 bushels a year." },
            { letter: "B", text: "Each reef produced 12.5 bushels in 2015." },
            { letter: "C", text: "The club sampled 12.5 reefs per year." },
            { letter: "D", text: "The harvest doubled every 12.5 years." }
          ],
          correct: "A"
        },
        {
          id: "predict",
          sol: "A.ST.1.g",
          stem: "What harvest does the line predict for 2025?",
          choices: [
            { letter: "A", text: "125 bushels per reef" },
            { letter: "B", text: "165 bushels per reef" },
            { letter: "C", text: "290 bushels per reef" },
            { letter: "D", text: "52.5 bushels per reef" }
          ],
          correct: "B"
        },
        {
          id: "storm",
          sol: "A.ST.1.f",
          stem: "How should the club treat the 2018 data point?",
          choices: [
            { letter: "A", text: "Delete it, because it proves the line is wrong." },
            { letter: "B", text: "Keep it, and report it as an outlier with a known cause." },
            { letter: "C", text: "Move it up to the line so the fit looks better." },
            { letter: "D", text: "Use it as the y-intercept." }
          ],
          correct: "B"
        },
        {
          id: "extrapolate",
          sol: "A.ST.1.h",
          stem: "Which statement best evaluates the 2050 prediction and the causation claim?",
          choices: [
            { letter: "A", text: "Both are sound: the line is a good fit, so it works for any year, and the increase proves restoration caused it." },
            { letter: "B", text: "The 2050 prediction is reliable, but restoration cannot have caused the increase." },
            { letter: "C", text: "2050 is too far out to trust; restoration is plausible, but the data show only an association." },
            { letter: "D", text: "Neither can be discussed without more reefs." }
          ],
          correct: "C"
        }
      ]
    },

    /* ---------- medium · level 2 · A.ST.1 c–g ---------- */
    {
      id: "st-heart-rate",
      family: "ST",
      title: "Exercise and Heart Rate",
      kind: "Statistics · A.ST.1",
      blurb: "Minutes on the treadmill against heart rate, and where a line stops being sensible.",
      level: 2,
      passage: "<p>" + N(1) + "A P.E. class measured each student's heart rate after 0, 2, 4, 6, 8 and 10 minutes on a treadmill at a steady jog. " + N(2) + "For the class averages, the line of best fit is <strong>y = 8x + 70</strong>, where x is minutes and y is beats per minute. " + N(3) + "The teacher points out that no one jogged longer than 10 minutes, and that a healthy heart rate rarely goes above about 200 beats per minute.</p>" +
        "<table><tr><th>Minutes</th><th>0</th><th>2</th><th>4</th><th>6</th><th>8</th><th>10</th></tr><tr><th>Avg. bpm</th><td>72</td><td>84</td><td>104</td><td>116</td><td>136</td><td>148</td></tr></table>",
      claims: [
        {
          id: "direction",
          sol: "A.ST.1.f",
          stem: "Which statement describes the association?",
          choices: [
            { letter: "A", text: "strong positive: heart rate rises steadily with minutes jogged" },
            { letter: "B", text: "strong negative: heart rate falls as minutes increase" },
            { letter: "C", text: "no association between minutes and heart rate" },
            { letter: "D", text: "quadratic: heart rate rises then falls" }
          ],
          correct: "A"
        },
        {
          id: "predict",
          sol: "A.ST.1.g",
          stem: "What heart rate does the line predict after 5 minutes?",
          choices: [
            { letter: "A", text: "75 bpm" },
            { letter: "B", text: "110 bpm" },
            { letter: "C", text: "120 bpm" },
            { letter: "D", text: "40 bpm" }
          ],
          correct: "B"
        },
        {
          id: "extrapolate",
          sol: "A.ST.1.g",
          stem: "The line predicts 550 bpm after 60 minutes. Why is this prediction not reasonable?",
          choices: [
            { letter: "A", text: "The slope should be negative for long runs." },
            { letter: "B", text: "Sixty minutes is far beyond the data; heart rate levels off well below 550." },
            { letter: "C", text: "Heart rate is not related to exercise." },
            { letter: "D", text: "The line of best fit only works for even numbers of minutes." }
          ],
          correct: "B"
        },
        {
          id: "intercept",
          sol: "A.ST.1.e",
          stem: "What does the y-intercept 70 represent?",
          choices: [
            { letter: "A", text: "the increase in heart rate each minute" },
            { letter: "B", text: "the number of students measured" },
            { letter: "C", text: "the predicted resting heart rate, before jogging begins" },
            { letter: "D", text: "the number of minutes to reach 148 bpm" }
          ],
          correct: "C"
        },
        {
          id: "sample",
          sol: "A.ST.1.c",
          stem: "The teacher wants results that apply to all ninth graders at the school. Which change would most improve the sample?",
          choices: [
            { letter: "A", text: "measuring the same class again the next day" },
            { letter: "B", text: "a random selection from every ninth-grade P.E. class" },
            { letter: "C", text: "measuring only students on the track team" },
            { letter: "D", text: "using a longer treadmill" }
          ],
          correct: "B"
        }
      ]
    }
  ];

  for (var i = 0; i < PACKS.length; i++) P.push(PACKS[i]);
})(typeof window !== "undefined" ? window : global);
