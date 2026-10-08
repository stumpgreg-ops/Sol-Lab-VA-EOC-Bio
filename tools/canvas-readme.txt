SOL Lab - Virginia Algebra I - version {{VERSION}} - Canvas files
================================================================================

This zip is the whole game for Canvas. Jump to a section with Ctrl+F (Cmd+F on a Mac) and its name.

CONTENTS
  SECTION 1  What's in this zip
  SECTION 2  First time: put the game in Canvas
  SECTION 3  Updating a game already in Canvas
  SECTION 4  The embed code (copy and paste)
  SECTION 5  Grading with progress codes (the Teacher link)
  SECTION 6  Students: progress codes and Restore
  SECTION 7  Troubleshooting

================================================================================
SECTION 1  WHAT'S IN THIS ZIP
================================================================================

- {{NAME}}.html: the small page that starts the game. Link or frame THIS file.
- {{NAME}}-game.js: the loader.
- {{NAME}}-data-01.js ... {{NAME}}-data-{{LAST}}.js: the game itself, in pieces Canvas can serve.
- This READ ME. You don't upload it.

All the .html and .js files go in ONE Canvas folder, names unchanged. Canvas runs the scripts of a small page
but not of a big one, which is why the game travels in data files next to a small page.

================================================================================
SECTION 2  FIRST TIME: PUT THE GAME IN CANVAS
================================================================================

1. Unzip this file on your computer.
2. In Canvas, open Files, make a folder (for example "Algebra Game") and open it.
3. Click Upload and select the .html file and ALL the .js files from the unzipped folder.
4. Add the game to an assignment (recommended: Assignments > + Assignment, submission type Online with Text
   Entry, so the game and the box students paste their progress code into are on one page), or to a Page or a
   module item (SECTION 4).
5. Open it once yourself: a purple loading bar, then the title screen.

================================================================================
SECTION 3  UPDATING A GAME ALREADY IN CANVAS
================================================================================

1. In Canvas, open Files and go to the folder that already holds {{NAME}}.html.
2. Click Upload and select ALL the .js files from the new zip (the .html can stay; it does not change).
3. When Canvas asks, choose Replace for every file.
4. If the new zip has fewer data files than the folder, delete the extra -data-NN.js files.
Nothing changes on your assignment or Page. Students may need to refresh once (Ctrl+Shift+R).

================================================================================
SECTION 4  THE EMBED CODE (COPY AND PASTE)
================================================================================

Paste the embed code with the </> button (HTML Editor) while editing an assignment or Page, then Save.

By folder path - replace COURSE with your course number (the number after /courses/ in the address bar) and
"Algebra%20Game" with your folder's name (a space is written %20):

   <iframe src="/courses/COURSE/file_contents/course%20files/Algebra%20Game/{{NAME}}.html" width="100%" height="500" allowfullscreen="allowfullscreen"></iframe>

Or by file number - click {{NAME}}.html once in Files and read NUMBER from the address bar
(.../courses/COURSE/files/NUMBER?...):

   <iframe src="/courses/COURSE/files/NUMBER/preview" width="100%" height="500" allowfullscreen="allowfullscreen"></iframe>

The game fits a 500-pixel-tall frame; raise height for more room (700 or 800). The game has its own full-screen button.
Keys reach the maze only after the student clicks inside the frame once.

================================================================================
SECTION 5  GRADING WITH PROGRESS CODES (THE TEACHER LINK)
================================================================================

Students' progress stays on their Chromebooks: the game can't send anything out of Canvas. So each student
taps "Submit my progress" in the game and turns in a PROGRESS CODE (it starts with SOL3-ALG-) to an assignment,
and the TEACHER SCREEN inside the game reads every code at once and suggests a participation grade.

5.0  Turn on the Teacher link (once on each of your computers)
   1. Open the game in Canvas.
   2. On the title screen, type the word  teacher  in the nickname box and click OK when it asks.
   From then on a small "Teacher" link shows at the bottom of the title screen on this computer only. The
   teacher screen has "Hide the Teacher link on this computer" to turn it off again. A student who typed
   teacher would only see an empty screen: it shows nothing until you drop in the submissions .zip.

5.1  Grading - the easiest way: the ZIP download
   1. Open the assignment and click "Download Submissions". Canvas saves a .zip with every student's code.
   2. In the same assignment, click the game's "Teacher" link.
   3. Drag the .zip onto the teacher screen (or click Choose files). Every student appears with their numbers
      and a suggested grade.

5.2  Only the new work counts
   A code is a running total. After entering the grades in Canvas click "Submit codes" (box 2): next time, drop
   the new .zip and the page counts only the work done after those codes. Put each round's grades in a new
   column. "Undo: return to the previous codes" takes a round back.

5.3  Real names and grades straight into Canvas
   Grades > Export > Export Entire Gradebook gives a .csv; drop it on the teacher screen too. You then see real
   names, who hasn't turned in, and a Canvas gradebook import file (Grades > Import).

5.4  What the teacher screen shows
   Students (cards with the suggested grade), Table (every number, CSV), Leaderboard (levels, questions,
   accuracy, badges, minutes, streaks), Standards report (% right on the first try for each standard A.EO.1 ...
   A.ST.1 and each lettered skill under it, marked LOTS (lower-order: solve, simplify, graph) or HOTS
   (higher-order: analyze, compare, justify), for the class and each student).

5.5  Scoring criteria and the suggested grade
   Box 1 of the teacher screen (Scoring criteria) sets the goals (minutes, levels, questions, days, % right), how
   much each counts and the points possible; it remembers them on your computer.

================================================================================
SECTION 6  STUDENTS: PROGRESS CODES AND RESTORE
================================================================================

Turning in progress: in the game, tap "Submit my progress" (title screen or after a level), Copy code, then in
the assignment Start Assignment (or New Attempt), paste with Ctrl+V, Submit. Always Copy, never type the code.

Game modes and levels: each game mode (Mixed, Labyrinth, Eagle Swoop, Rune Rocks, Sun Chariot, Wolf Ring,
Root Worms) keeps its own level 1 to 100. "My badges" on the title screen shows the badges earned.

Restore my progress (new Chromebook or lost progress): on the title screen tap Restore my progress, paste the
last code (it is in the student's submission), Check code, Restore. Level, town or castle, coins and totals
come back.

================================================================================
SECTION 7  TROUBLESHOOTING
================================================================================

- "Oops you've found a broken link": the address in the embed code is wrong. Check the folder name and the
  course number (SECTION 4), or use the file-number form.
- "Can't find ...": that file is missing from the folder. Upload it with exactly the same name.
- "The game files don't match each other": the .js files are from different versions. Upload them all again
  from one zip and choose Replace.
- The loading bar never moves: Canvas is showing the page as a preview that cannot run games. Use the other
  embed form in SECTION 4.
- A student's code shows INVALID: ask them to copy it again with the Copy code button.
- Downloads don't work inside Canvas: open teacher/ALG.html from the game's repository on your computer; it
  is the same teacher screen and needs no internet.

Files in the game: {{NAME}}.html, {{NAME}}-game.js, {{NAME}}-data-01.js ... {{NAME}}-data-{{LAST}}.js
