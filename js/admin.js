(function () {
  var K_PIN = "afterHours.v1.admin.pin";
  var K_CODE = "afterHours.v1.admin.code";
  var K_ROSTER = "afterHours.v1.admin.roster";
  var hostHandle = null;

  var EASY = {
    "0000": 1, "1111": 1, "2222": 1, "3333": 1, "4444": 1,
    "5555": 1, "6666": 1, "7777": 1, "8888": 1, "9999": 1,
    "1234": 1, "4321": 1, "0123": 1, "2345": 1, "1212": 1,
    "2580": 1, "1122": 1, "0001": 1, "1000": 1
  };

  function el(id) { return document.getElementById(id); }

  function freshCode() {
    if (window.AfterHoursNet && AfterHoursNet.makeCode) return AfterHoursNet.makeCode();
    var ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    var c = "", i;
    for (i = 0; i < 4; i++) c += ALPHA.charAt(Math.floor(Math.random() * ALPHA.length));
    return c;
  }

  function ensureCode() {
    var code = localStorage.getItem(K_CODE);
    if (!code) {
      code = freshCode();
      localStorage.setItem(K_CODE, code);
    }
    return code;
  }

  function setCode(code) {
    code = String(code || freshCode()).toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4);
    if (code.length < 4) code = freshCode();
    localStorage.setItem(K_CODE, code);
    return code;
  }

  function loadRoster() {
    try {
      var raw = localStorage.getItem(K_ROSTER);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function saveRoster(list) {
    localStorage.setItem(K_ROSTER, JSON.stringify(list));
  }

  function parseToken(s) {
    var m = String(s || "").toUpperCase().replace(/\s+/g, "").match(/N(\d{1,3})E(\d{1,2})S(\d{1,2})/);
    if (!m) return null;
    var night = parseInt(m[1], 10);
    var extracts = parseInt(m[2], 10);
    var strikes = parseInt(m[3], 10);
    if (night < 1 || night > 100) return null;
    return { night: night, extracts: extracts, strikes: strikes };
  }

  function fmtTime(ts) {
    if (!ts) return "—";
    var d = new Date(ts);
    var h = d.getHours(), m = d.getMinutes();
    var am = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (!h) h = 12;
    var mm = m < 10 ? "0" + m : String(m);
    return h + ":" + mm + " " + am;
  }

  function upsert(entry) {
    var nick = (window.AfterHoursNet ? AfterHoursNet.cleanNick(entry.nick) : String(entry.nick || "")).slice(0, 16);
    if (!nick) return;
    var list = loadRoster();
    var i, found = -1;
    for (i = 0; i < list.length; i++) {
      if (list[i].nick.toLowerCase() === nick.toLowerCase()) found = i;
    }
    var row = {
      nick: nick,
      night: entry.night || 1,
      extracts: entry.extracts || 0,
      strikes: entry.strikes || 0,
      status: entry.status || "playing",
      ts: entry.ts || Date.now()
    };
    if (found >= 0) list[found] = row;
    else list.push(row);
    list.sort(function (a, b) {
      return a.nick.toLowerCase() < b.nick.toLowerCase() ? -1 : 1;
    });
    saveRoster(list);
    renderRoster();
  }

  function median(nums) {
    if (!nums.length) return 0;
    var a = nums.slice().sort(function (x, y) { return x - y; });
    var mid = Math.floor(a.length / 2);
    if (a.length % 2) return a[mid];
    return Math.round((a[mid - 1] + a[mid]) / 2);
  }

  function renderRoster() {
    var list = loadRoster();
    var tb = document.querySelector("#roster tbody");
    if (!tb) return;
    tb.innerHTML = "";
    var nights = [];
    var past5 = 0;
    var i;
    for (i = 0; i < list.length; i++) {
      var r = list[i];
      nights.push(r.night || 1);
      if ((r.night || 1) > 5 || (r.night === 5 && r.status === "cleared")) past5 += 1;
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" + escapeHtml(r.nick) + "</td>" +
        "<td>" + (r.night || 1) + "</td>" +
        "<td>" + (r.extracts || 0) + "</td>" +
        "<td>" + (r.strikes || 0) + "</td>" +
        "<td>" + fmtTime(r.ts) + "</td>" +
        "<td>" + escapeHtml(r.status || "playing") + "</td>";
      tb.appendChild(tr);
    }
    var pct = list.length ? Math.round((past5 / list.length) * 100) : 0;
    var agg = el("agg");
    if (agg) {
      agg.textContent = list.length
        ? (list.length + " nicknames · " + pct + "% past level 5 · median level " + median(nights))
        : "No nicknames yet. Students join After Hours with this class code + the nickname you assigned.";
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
    });
  }

  function hideAll() {
    ["admin-setup", "admin-lock", "admin-dash"].forEach(function (id) {
      var n = el(id);
      if (n) n.classList.add("hidden");
    });
  }

  function showSetup() {
    hideAll();
    var code = ensureCode();
    el("admin-setup").classList.remove("hidden");
    el("setup-code").textContent = code;
    el("setup-err").textContent = "";
    el("setup-pin").value = "";
    el("setup-pin2").value = "";
  }

  function showLock() {
    hideAll();
    el("admin-lock").classList.remove("hidden");
    if (el("pin-err")) el("pin-err").textContent = "";
    if (el("pin-in")) el("pin-in").value = "";
    stopHost();
  }

  function showDash() {
    hideAll();
    el("admin-dash").classList.remove("hidden");
    el("class-code").textContent = ensureCode();
    renderRoster();
    startHost();
  }

  function stopHost() {
    if (hostHandle && hostHandle.destroy) {
      try { hostHandle.destroy(); } catch (e) {}
      hostHandle = null;
    }
  }

  function startHost() {
    stopHost();
    var code = ensureCode();
    el("listen-state").textContent = "Starting live…";
    if (!window.AfterHoursNet || !AfterHoursNet.peerAvailable()) {
      el("listen-state").textContent = "Live off — use progress tokens.";
      return;
    }
    hostHandle = AfterHoursNet.host({
      code: code,
      onReady: function (h) {
        localStorage.setItem(K_CODE, h.code);
        el("class-code").textContent = h.code;
        el("listen-state").textContent = "Live on this Chromebook";
      },
      onError: function (msg) {
        el("listen-state").textContent = msg || "Live unavailable — use tokens.";
      },
      onPing: function (row) {
        upsert(row);
      },
      onClose: function () {}
    });
  }

  function rerollCode() {
    var code = setCode(freshCode());
    if (el("setup-code")) el("setup-code").textContent = code;
    if (el("class-code")) el("class-code").textContent = code;
    if (!el("admin-dash").classList.contains("hidden")) startHost();
    return code;
  }

  function wipeThisChromebook() {
    stopHost();
    localStorage.removeItem(K_PIN);
    localStorage.removeItem(K_CODE);
    localStorage.removeItem(K_ROSTER);
    showSetup();
  }

  function boot() {
    if (!el("admin-lock") || !el("admin-dash") || !el("admin-setup")) return;
    if (localStorage.getItem(K_PIN)) showLock();
    else showSetup();
  }

  var setupForm = el("setup-form");
  if (setupForm) {
    setupForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var a = String(el("setup-pin").value || "").replace(/\D/g, "");
      var b = String(el("setup-pin2").value || "").replace(/\D/g, "");
      if (a.length < 4 || a.length > 8) {
        el("setup-err").textContent = "PIN needs 4–8 digits.";
        return;
      }
      if (EASY[a]) {
        el("setup-err").textContent = "Pick a PIN that is not a simple pattern.";
        return;
      }
      if (a !== b) {
        el("setup-err").textContent = "PINs do not match.";
        return;
      }
      localStorage.setItem(K_PIN, a);
      ensureCode();
      showDash();
    });
  }

  var reroll = el("btn-setup-reroll");
  if (reroll) reroll.addEventListener("click", function () { rerollCode(); });

  var pinForm = el("pin-form");
  if (pinForm) {
    pinForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var entered = String(el("pin-in").value || "").replace(/\D/g, "");
      var pin = localStorage.getItem(K_PIN);
      if (entered && entered === pin) showDash();
      else el("pin-err").textContent = "Wrong PIN. Roster stays hidden.";
    });
  }

  var forgot = el("btn-forgot");
  if (forgot) {
    forgot.addEventListener("click", function () {
      if (!window.confirm("Reset teacher PIN, class code, and nickname roster on this Chromebook? This cannot be undone.")) return;
      wipeThisChromebook();
    });
  }

  var lockBtn = el("btn-lock");
  if (lockBtn) lockBtn.addEventListener("click", function () { showLock(); });

  var newCode = el("btn-new-code");
  if (newCode) {
    newCode.addEventListener("click", function () {
      if (!window.confirm("Make a new class code? Students will need the new one to join live.")) return;
      rerollCode();
    });
  }

  var exportBtn = el("btn-export");
  if (exportBtn) {
    exportBtn.addEventListener("click", function () {
      var list = loadRoster();
      var lines = ["nickname,night,extracts,strikes,last_seen"];
      var i;
      for (i = 0; i < list.length; i++) {
        var r = list[i];
        var seen = r.ts ? new Date(r.ts).toISOString() : "";
        lines.push([r.nick, r.night, r.extracts, r.strikes, seen].join(","));
      }
      var blob = new Blob(
        ["# No student names. Map nicknames in your gradebook.\n" + lines.join("\n")],
        { type: "text/csv" }
      );
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "after-hours-nicknames.csv";
      a.click();
    });
  }

  var clearBtn = el("btn-clear");
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      if (!window.confirm("Forget this class roster on this Chromebook? This cannot be undone.")) return;
      saveRoster([]);
      renderRoster();
    });
  }

  var tokenForm = el("token-form");
  if (tokenForm) {
    tokenForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var nick = el("token-nick").value;
      var tok = parseToken(el("token-val").value);
      if (!tok) return;
      upsert({
        nick: nick,
        night: tok.night,
        extracts: tok.extracts,
        strikes: tok.strikes,
        status: "playing",
        ts: Date.now()
      });
      el("token-val").value = "";
    });
  }

  boot();
})();
