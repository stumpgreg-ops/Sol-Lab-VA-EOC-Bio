/* Build the Canvas (LMS) version of SOL Lab Biology: node tools/build-canvas.js
   (run tools/build-appsscript.js first; tools/publish-pages.sh runs both).

   Files a teacher uploads to one folder in Canvas Files and embeds in a Canvas page: nothing is hosted on GitHub
   or any other outside site. Canvas runs the scripts of a small uploaded HTML page but not of a big one (SOL
   Labyrinth's one-file 7 MB build stopped on its first screen), and a small page can read files next to it in its
   folder with a relative <script src>. So the game is:
     SOLLab-VA-Bio.html          the starter page (a few KB): the loading screen and one <script src>
     SOLLab-VA-Bio-game.js       the Apps Script loader, the manifest and the list of data files
     SOLLab-VA-Bio-data-NN.js    the gzip bundle (no music) as base64, in pieces of 576 KB
   Canvas gives each uploaded file its own web address, and the game's saves live with the starter page's: an
   update replaces only the .js files, so the starter page (and every student's progress) stays.

   Writes dist/canvas/BIO/, dist/canvas/SOL Lab VA Bio.zip (the same files, for a first upload, with a READ ME) and
   dist/canvas/SOL Lab VA Bio update.zip (the .js files only, for updating a game already in Canvas).
   v6.4: both zips also carry the teacher progress page, SOLLab-VA-Bio-Teacher.html (tools/build-teacher.js), a copy
   of the Teacher screen that is inside the game, to open on the teacher's own computer. It is not in dist/canvas/BIO/
   (the files the game itself loads) and is never uploaded to Canvas. */
var fs = require("fs"), path = require("path"), cp = require("child_process");
var root = path.join(__dirname, ".."), dist = path.join(root, "dist");
var lo = "bio", st = "BIO";
var src = path.join(dist, "appsscript", lo), outAll = path.join(dist, "canvas"), out = path.join(outAll, st);
if (!fs.existsSync(path.join(src, "manifest.json"))) throw new Error("tools/build-canvas.js: run tools/build-appsscript.js first");

var man = JSON.parse(fs.readFileSync(path.join(src, "manifest.json"), "utf8"));
var gz = Buffer.concat(man.parts.map(function (p) { return fs.readFileSync(path.join(src, p)); }));
if (gz.length !== man.bytes) throw new Error("tools/build-canvas.js: the bundle parts add up to " + gz.length + " bytes, not " + man.bytes);

var page = fs.readFileSync(path.join(src, "loader.html"), "utf8");
var m = page.match(/<script>([\s\S]*)<\/script>/);
if (!m) throw new Error("tools/build-canvas.js: no loader script in loader.html");
var loaderJs = m[1];
var base = "SOLLab-VA-Bio", NAME = "SOL Lab Biology";
var zipFull = "SOL Lab VA Bio.zip", zipUpd = "SOL Lab VA Bio update.zip";

/* ── the data files: 576 KB of bundle each (768 KB of base64; Canvas has served an 800 KB one to a page) ── */
var PIECE = 576 * 1024, files = [];
for (var o = 0, n = 1; o < gz.length; o += PIECE, n++) {
  var name = base + "-data-" + (n < 10 ? "0" : "") + n + ".js";
  files.push(name);
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, name), "/* " + NAME + " v" + man.version + ": game data " + n + " (open " + base + ".html, not this file) */\n" +
    "solPart(" + (n - 1) + "," + JSON.stringify(man.hash) + ',"' + gz.subarray(o, o + PIECE).toString("base64") + '");\n');
}

/* ── the game file: which version, which data files, and the loader ── */
var parts = { manifest: man, files: files };
fs.writeFileSync(path.join(out, base + "-game.js"), "/* " + NAME + " v" + man.version + " (open " + base + ".html, not this file) */\n" +
  "window.SOL_CANVAS_ID = " + JSON.stringify(lo) + ";\nwindow.SOL_PARTS = " + JSON.stringify(parts) + ";\n" + loaderJs + "\n");

/* ── the starter page: what it says when its scripts can't run (a preview that blocks scripts shows only that),
   a first small script that changes it, then the game file ── */
var stuck = '<div class="msg">Loading the game…</div><div class="msg" id="sol-noscript" style="font-size:13px;opacity:.7">' +
  "If this message never changes, the page is not allowed to run the game here (Canvas shows some files as a preview that cannot run games).</div>";
if (page.indexOf('<div class="msg">Loading the game…</div>') < 0) throw new Error("tools/build-canvas.js: loader.html has no loading message");
page = page.replace('<div class="msg">Loading the game…</div>', stuck);
var early = "<script>(function(){var n=document.getElementById('sol-noscript');if(n)n.parentNode.removeChild(n);" +
  /* anything the page refuses to load (a security rule) is named on screen, since a student can't open the console */
  "var blocked=[];document.addEventListener('securitypolicyviolation',function(e){var k=(e.effectiveDirective||e.violatedDirective)+' '+String(e.blockedURI).slice(0,12);" +
  "if(blocked.indexOf(k)>=0)return;blocked.push(k);var d=document.getElementById('sol-blocked');if(!d){d=document.createElement('div');d.id='sol-blocked';" +
  "d.setAttribute('style','position:fixed;left:8px;bottom:8px;z-index:100000;background:#3a1a14;color:#ffd8c8;border:1px solid #ff8b7a;border-radius:8px;padding:6px 10px;font:13px system-ui,sans-serif;max-width:90vw');" +
  "document.body.appendChild(d);}d.textContent='Canvas blocked part of the game: '+blocked.join(', ');});" +
  "window.addEventListener('error',function(e){var m=document.querySelector('#sol-boot .msg');if(m&&document.getElementById('sol-boot'))m.textContent='The game hit an error: '+(e.message||e)+' (line '+(e.lineno||'?')+')';});" +
  "window.solMissing=function(f){var m=document.querySelector('#sol-boot .msg');if(m)m.textContent='Can\\'t find '+f+'. Upload it to the same Canvas folder as this page, with the same name.';};})();</script>\n";
var game = base + "-game.js";
var starter = page.replace(m[0], function () { return early + '<script src="' + game + '" onerror="solMissing(\'' + game + '\')"></script>'; });
if (Buffer.byteLength(starter) > 64 * 1024) throw new Error("tools/build-canvas.js: the starter page is " + Buffer.byteLength(starter) + " bytes; Canvas runs only small pages");
fs.writeFileSync(path.join(out, base + ".html"), starter);

/* the files of an older build that this one doesn't have (fewer data files) */
fs.readdirSync(out).forEach(function (f) { if (f !== base + ".html" && f !== game && files.indexOf(f) < 0) fs.unlinkSync(path.join(out, f)); });
var oldZip = path.join(outAll, base + "-Canvas.zip");
if (fs.existsSync(oldZip)) fs.unlinkSync(oldZip);

/* ── the READ ME in each zip (steps, the embed code, grading with progress codes) and the teacher page ── */
var gameName = "SOL Lab Biology (Virginia EOC)";
var teacherBuild = require("./build-teacher"), PB = require("../js/progress-code.js").BUILDS[st];
var teacherName = teacherBuild.fileName(st), teacherPath = path.join(outAll, teacherName);
fs.writeFileSync(teacherPath, teacherBuild.build(st, man.version));
var EMBED = '<iframe src="/courses/COURSE/files/NUMBER/preview" width="100%" height="500" allowfullscreen="allowfullscreen"></iframe>';
var RULE = "================================================================================";
var THIN = "--------------------------------------------------------------------------------";
function sec(n, title) { return ["", RULE, "SECTION " + n + "  " + title.toUpperCase(), RULE, ""]; }
function sub(t) { return ["", t, THIN.slice(0, Math.min(80, t.length))]; }
function filesLine(update) { return (update ? "" : base + ".html, ") + game + ", " + files[0] + " ... " + files[files.length - 1]; }
function S_inZip(update) {
  var n = files.length + (update ? 1 : 2);
  return update ? [
    "- " + n + " game files (.js): they replace the ones already in your Canvas folder.",
    "- " + teacherName + ": a copy of the teacher screen to open on your own computer if you ever need it",
    "  (SECTION 4). You don't upload it.",
    "- This READ ME. You don't upload it.",
    "There is no game .html page in this zip on purpose: the page already in Canvas stays, so your embed code keeps",
    "working and students keep their progress."
  ] : [
    "- " + n + " game files: one small page (" + base + ".html) and the .js files it loads.",
    "  All of them go in the SAME Canvas folder.",
    "- " + teacherName + ": a copy of the teacher screen to open on your own computer if you ever need it",
    "  (SECTION 4). You don't upload it.",
    "- This READ ME. You don't upload it."
  ];
}
function S_setup() {
  return [].concat(
    sub("Step 1 - Upload the files"),
    ["1. Unzip this file on your computer.",
     "2. In Canvas, open your course, then Files.",
     "3. Click + Folder and make a new folder for the game (for example: Bio Game).",
     "4. Open that folder, click Upload, and select ALL " + (files.length + 2) + " game files (" + base + ".html and every .js file).",
     "   If Canvas asks, choose Replace."],
    sub("Step 2 - Find your numbers"),
    ["1. In that folder, click " + base + ".html once to open its preview.",
     "2. Look at the address bar. It looks like this:",
     "      https://yourschool.instructure.com/courses/152432/files/60512345?...",
     "   COURSE is the number after /courses/   (in the example: 152432)",
     "   NUMBER is the number after /files/     (in the example: 60512345)",
     "Every file has its own NUMBER. COURSE is the same for all of them."],
    sub("Step 3 - Put the game in an assignment (recommended)"),
    ["In an assignment, the game and the box students turn their progress code in to are on the same page.",
     "1. Assignments > + Assignment. Name it \"" + PB.assignment + "\". Submission type: Online, with Text Entry",
     "   checked (nothing else). Points: whatever you like.",
     "2. In the description box, click the </> button (HTML Editor). On some Canvas versions it is at the bottom right.",
     "3. Paste the embed code (SECTION 3) and replace COURSE and NUMBER with your numbers.",
     "4. Click Save, and Publish when you are ready for students.",
     "(You can put the game on a Page instead with the same embed code; students then turn codes in to a",
     "separate assignment.)"],
    sub("Step 4 - That's it"),
    ["Grading is built into the game: see SECTION 4."]);
}
function S_embed() {
  return [
    "Paste the embed code with the </> button (HTML Editor) while editing an assignment or Page, then Save.",
    "Replace COURSE and NUMBER with your numbers. To find them, click the file once in Canvas Files and look at the",
    "address bar:  https://yourschool.instructure.com/courses/COURSE/files/NUMBER?...",
    "",
    "THE GAME - NUMBER is the number of " + base + ".html:",
    "",
    "   " + EMBED,
    "",
    "   With the example numbers it would be:",
    "   " + EMBED.replace("COURSE", "152432").replace("NUMBER", "60512345"),
    "",
    "Too small or too tall? Change height=\"700\" (try 600 or 800).",
    "",
    "There is no separate embed code for the teacher screen: it is inside the game (the hidden Teacher link,",
    "SECTION 4.0)."
  ];
}
function S_grading() {
  return [].concat(
    ["Students' progress stays on their Chromebooks: the game can't send anything out of Canvas. So each student",
     "taps Submit my progress in the game and turns in a PROGRESS CODE to the assignment, and the TEACHER SCREEN",
     "reads every code at once and suggests a participation grade. The teacher screen is inside the game."],
    sub("4.0  Turn on the Teacher link (once on each of your computers)"),
    ["The Teacher link is HIDDEN, so students never see it. To show it on your computer:",
     "1. Open the game in Canvas (your assignment or Page).",
     "2. On the game's title screen, type the word  teacher  in the nickname box.",
     "3. Click OK when it asks \"Show the Teacher link on this computer?\". The teacher screen opens.",
     "From then on a small \"Teacher\" link shows at the bottom of the title screen, on this computer only (the",
     "nickname box is cleared, so \"teacher\" never becomes your nickname). Do the same on any other computer you",
     "grade on. \"Hide the Teacher link on this computer\" (on the teacher screen) turns it off again.",
     "A student who typed teacher would only see an empty teacher screen: it shows nothing until you drop in the",
     "submissions .zip, which students don't have."],
    sub("4.1  Grading - THE EASIEST WAY: the ZIP download (recommended)"),
    ["1. Open the assignment and click \"Download Submissions\". Canvas saves a .zip file with every student's code.",
     "2. In the same assignment, click the game's \"Teacher\" link (bottom of the title screen; see 4.0).",
     "3. Drag the .zip file onto the teacher screen (or click Choose files and pick it).",
     "That's it: every student appears with their numbers and a suggested grade. Nothing to unzip or type."],
    sub("4.2  Submit codes: only the work since last time counts"),
    ["A student's code is a running total, so the teacher screen always grades the work done SINCE YOUR LAST ROUND:",
     "- The first time, everything students have done so far counts.",
     "- After you have entered the grades in Canvas, click \"Submit codes\" (box 2). The teacher screen keeps each",
     "  student's code (on your computer) as the starting point for the next round.",
     "- Next round, Download Submissions again and drop the new .zip: grades, cards, the leaderboard, the standards",
     "  report and the Canvas import file count only the new minutes, levels, questions and badges. Put each round's",
     "  grades in a new assignment column (for example \"SOL Lab Biology - week 2\").",
     "- Students can keep turning in to the same assignment (New Attempt) or to a new one each round: either works.",
     "- Made a mistake? \"Undo: return to the previous codes\". Grading on a different computer? \"Use an earlier .zip as",
     "  the starting point\" and choose the .zip you graded last time.",
     "- A student whose totals went down (a new Chromebook, or a restore from an older code) is counted from their",
     "  new code alone, and the teacher screen says so."],
    sub("4.3  Real names, who hasn't turned in, and grades straight into Canvas (once a term)"),
    ["1. In Canvas open Grades, click Export, then Export Entire Gradebook. Canvas saves a .csv file.",
     "2. Drop that .csv file on the teacher screen too (with the zip, or on its own).",
     "The teacher screen then shows real names (\"Ann S.\" on the leaderboard), lists who hasn't turned in, and",
     "makes a CANVAS GRADEBOOK IMPORT FILE: click that button, then in Canvas Grades > Import, choose the file,",
     "Upload, check the changes and Save. Every suggested grade goes into the assignment's column at once (if your",
     "gradebook has several assignments, pick this round's column on the teacher screen first).",
     "The class list is kept on your computer only. \"Forget the class list\" removes it. Export again when",
     "students join or leave."],
    sub("4.4  What the teacher screen shows"),
    ["- Students: a card for each student with the suggested grade (green, yellow, red) and their progress.",
     "- Table: every number, sortable, with each standard's unit (BIO.1 to BIO.8). Download the table (CSV), Copy it or Print it.",
     "- Leaderboard: rank by levels won, highest level, questions, accuracy, badges, minutes or best streak.",
     "  Names: First name + last initial (the default, needs the class list), nicknames only, or no names.",
     "  \"Show to the class\" makes it full screen; \"Hide\" leaves a student off it.",
     "- Standards report: a Class total page (every key idea such as BIO.8.a with the class's % right, how many students",
     "  are at 80%+, 60-79% and below 60%, the units in total, and the three weakest key ideas to reteach first) and a",
     "  Student by student page, with its own CSV download."],
    sub("4.5  Scoring criteria and the suggested grade"),
    ["In box 1 of the teacher screen (Scoring criteria) set the goals (minutes played, levels won, questions answered, days, % right),",
     "how much each counts and the points possible. The teacher screen remembers them on your computer."],
    sub("4.6  The other way: copy codes from SpeedGrader"),
    ["Open SpeedGrader, copy each student's code and paste it into \"Or paste codes\" on the teacher screen. Type",
     "the name first if you want it, like:  Ann Smith: SOL3-BIO-...   (Without a name the row shows the nickname.)"],
    sub("4.7  Good to know"),
    ["- A typo or a changed code shows as INVALID. The code stops typos and casual tampering, not a determined student.",
     "- Each code holds everything so far (a running total); the teacher screen subtracts the code from your last",
     "  round (4.2), so nobody gets credit twice. Students can turn in a new code any time (New Attempt); the",
     "  teacher screen keeps each student's newest.",
     "- A student who plays on two Chromebooks has two codes; the teacher screen keeps the newest one.",
     "- Codes from this game start with SOL3-BIO. A code from the reading game (SOL3-VA) shows as \"Other game\".",
     "- If downloads don't work inside Canvas, open " + teacherName + " from this zip on your computer: it is the",
     "  same teacher screen and needs no internet."]);
}
function S_students() {
  return [].concat(
    sub("Turning in progress"),
    ["In the game, students tap \"Submit my progress\" (on the title screen or after a level) and follow the steps",
     "on screen: Copy code, scroll down to the assignment, Start Assignment (or New Attempt), paste with Ctrl+V,",
     "Submit Assignment. The code gets longer as they play, so they should always use Copy code, not type it."],
    sub("Levels, badges and the leaderboard"),
    ["Each game mode keeps its own level (1 to 100), so a student can be on level 40 in one mode and 12 in another.",
     "Students earn badges for levels in each mode, questions, streaks, perfect levels, units, standards, days",
     "and time; \"My badges\" on the title screen shows them all. The Submit window shows the student's nickname, which",
     "is how they find themselves on a nickname leaderboard."],
    sub("Restore my progress (new Chromebook or lost progress)"),
    ["A student's newest code also holds their level and their town or castle. On the game's title screen they tap",
     "Restore my progress, paste their last code (it is in their submission to the assignment), tap Check code,",
     "then Restore. The game brings back their level, town or castle, coins and totals, so their next code goes on",
     "from there, with their badges and every mode's level."]);
}
function S_update(update) {
  return update ? [
    "1. Unzip this file on your computer.",
    "2. In Canvas, open Files and go to the folder that already holds " + base + ".html.",
    "3. Click Upload and select ALL the .js files from the unzipped folder.",
    "4. When Canvas asks, choose Replace for every file.",
    "5. Done. Nothing changes on your assignment or Page. Students may need to refresh the page once.",
    "Setting the game up for the first time? Use the full zip (" + zipFull + ") instead."
  ] : [
    "When you get a new version, use the update zip (" + zipUpd + "): upload its files to the same folder and",
    "choose Replace. Do not replace or delete " + base + ".html - your embed code and the students' saved",
    "progress stay with it."
  ];
}
function S_trouble() {
  return [
    "- The game says \"Can't find ...\": that file is missing from the folder. Upload it with exactly the same name.",
    "- The game never gets past \"Loading the game...\": that spot in Canvas does not run scripts. Upload",
    "  canvas-check.html (https://stumpgreg-ops.github.io/Sol-Lab-VA-EOC-Bio/canvas-check.html) the same way: it",
    "  says whether a page's code can run there and whether progress can be saved.",
    "- The game is too small or too tall: change height=\"700\" in the embed code (try 600 or 800).",
    "- Students want it bigger: the game has its own full-screen button.",
    "- Download CSV or the import file doesn't download inside Canvas: open " + teacherName + " from this zip on your",
    "  computer (double-click it) and drop the files there. It is the same teacher screen.",
    "- A student's code shows INVALID: ask them to copy it again with the Copy code button.",
    "- A student lost their progress: see SECTION 5, Restore my progress."
  ];
}
function readme(update) {
  var order = update
    ? [["What's in this zip", S_inZip], ["Update the game already in Canvas", S_update], ["The embed codes (copy and paste)", S_embed],
       ["Grading with progress codes (easiest: the ZIP download)", S_grading], ["Students: progress codes and Restore", S_students], ["Troubleshooting", S_trouble]]
    : [["What's in this zip", S_inZip], ["Set up the game in Canvas (first time)", S_setup], ["The embed codes (copy and paste)", S_embed],
       ["Grading with progress codes (easiest: the ZIP download)", S_grading], ["Students: progress codes and Restore", S_students],
       ["Updating to a new version", S_update], ["Troubleshooting", S_trouble]];
  var L = [gameName + " - version " + man.version + (update ? " - UPDATE" : " - FIRST-TIME SETUP"), RULE, "",
    update ? "This zip UPDATES a game that is already in Canvas." : "This zip SETS UP the game in Canvas for the first time.",
    "Jump to a section with Ctrl+F (Cmd+F on a Mac) and its name, like SECTION 4.", "", "CONTENTS"];
  order.forEach(function (o, i) { L.push("  SECTION " + (i + 1) + "  " + o[0]); });
  order.forEach(function (o, i) { L = L.concat(sec(i + 1, o[0]), o[1](update)); });
  L.push("", RULE, "Files in the game: " + filesLine(update), "Teacher page (keep it hidden from students): " + teacherName);
  return L.join("\r\n").replace(/(={80}\r\n)\r\n\r\n/g, "$1\r\n") + "\r\n";
}
var tmpDir = fs.mkdtempSync(path.join(outAll, ".readme-"));
var RM_FULL = path.join(tmpDir, "READ ME FIRST - Canvas setup.txt"), RM_UPD = path.join(tmpDir, "READ ME FIRST - Canvas update.txt");
fs.writeFileSync(RM_FULL, readme(false));
fs.writeFileSync(RM_UPD, readme(true));

var zip = path.join(outAll, zipFull);
if (fs.existsSync(zip)) fs.unlinkSync(zip);
cp.execFileSync("zip", ["-q", "-X", "-j", zip].concat([RM_FULL, teacherPath]).concat([base + ".html", game].concat(files).map(function (f) { return path.join(out, f); })));
/* an update: the .js files only, so the starter page already in Canvas (and its saves) stays */
var upd = path.join(outAll, zipUpd);
if (fs.existsSync(upd)) fs.unlinkSync(upd);
cp.execFileSync("zip", ["-q", "-X", "-j", upd].concat([RM_UPD, teacherPath]).concat([game].concat(files).map(function (f) { return path.join(out, f); })));
fs.rmSync(tmpDir, { recursive: true, force: true });

var mb = function (b) { return (b / 1048576).toFixed(1) + " MiB"; };
console.log("Canvas " + NAME + " v" + man.version + ": " + path.relative(root, out) + "/ (" + base + ".html " + (Buffer.byteLength(starter) / 1024).toFixed(1) + " KiB, " + game + ", " +
  files.length + " data files), " + zipFull + " (" + mb(fs.statSync(zip).size) + "), " + zipUpd + "; teacher page " + teacherName + " " + (fs.statSync(teacherPath).size / 1024).toFixed(1) + " KiB");
