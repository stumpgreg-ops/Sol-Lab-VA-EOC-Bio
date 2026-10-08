/* After Hours — PeerJS class host/student. Opaque peer ids only. No names/email/SIS. */
(function (global) {
  "use strict";

  var ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  var PREFIX = "ah9-";
  var ERR = "Both devices need Chrome + internet. Stay on this page.";
  var OPEN_MS = 16000;

  function makeCode() {
    var c = "", i;
    for (i = 0; i < 4; i++) c += ALPHA.charAt(Math.floor(Math.random() * ALPHA.length));
    return c;
  }

  function peerAvailable() {
    return typeof global.Peer === "function";
  }

  function parseMsg(data) {
    try {
      var msg = typeof data === "string" ? JSON.parse(data) : data;
      if (!msg || !msg.type) return null;
      if (msg.v !== 1) return null;
      return msg;
    } catch (e) {
      return null;
    }
  }

  function cleanNick(s) {
    s = String(s || "").replace(/\s+/g, " ").trim().slice(0, 16);
    s = s.replace(/[^\w \-]/g, "");
    return s.slice(0, 16);
  }

  function wireSend(conn, msg) {
    if (!conn || !conn.open) return false;
    try {
      conn.send(JSON.stringify(msg));
      return true;
    } catch (e) {
      return false;
    }
  }

  function newPeer(id) {
    var opts = { debug: 0 };
    if (id) return new global.Peer(id, opts);
    return new global.Peer(opts);
  }

  function host(opts) {
    opts = opts || {};
    var onReady = opts.onReady || function () {};
    var onError = opts.onError || function () {};
    var onPing = opts.onPing || function () {};
    var onClose = opts.onClose || function () {};
    var wantCode = String(opts.code || makeCode()).toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4);
    if (wantCode.length < 4) wantCode = makeCode();
    var destroyed = false;
    var peer = null;
    var conns = {};
    var openTimer = null;

    function fail(msg) {
      if (destroyed) return;
      cleanup();
      onError(msg || ERR);
    }

    function cleanup() {
      destroyed = true;
      if (openTimer) { clearTimeout(openTimer); openTimer = null; }
      try { if (peer) peer.destroy(); } catch (e) {}
      peer = null;
      conns = {};
    }

    function attachConn(conn) {
      var id = conn.peer;
      conns[id] = conn;
      conn.on("data", function (data) {
        if (destroyed) return;
        var msg = parseMsg(data);
        if (!msg) return;
        if (msg.type === "hello" || msg.type === "ping") {
          onPing({
            peerId: id,
            nick: cleanNick(msg.nick),
            night: parseInt(msg.night, 10) || 1,
            extracts: parseInt(msg.extracts, 10) || 0,
            strikes: parseInt(msg.strikes, 10) || 0,
            status: msg.status === "cleared" || msg.status === "stuck" ? msg.status : "playing",
            ts: Date.now()
          });
        }
      });
      conn.on("close", function () {
        delete conns[id];
        if (!destroyed) onClose(id);
      });
      conn.on("error", function () {
        delete conns[id];
        if (!destroyed) onClose(id);
      });
    }

    try {
      peer = newPeer(PREFIX + wantCode.toLowerCase());
    } catch (e) {
      fail(ERR);
      return { destroy: function () {} };
    }

    openTimer = setTimeout(function () { fail(ERR); }, OPEN_MS);

    peer.on("open", function () {
      if (destroyed) return;
      if (openTimer) { clearTimeout(openTimer); openTimer = null; }
      onReady({
        role: "host",
        code: wantCode,
        destroy: cleanup
      });
    });

    peer.on("connection", function (conn) {
      if (destroyed) return;
      attachConn(conn);
    });

    peer.on("error", function (err) {
      if (destroyed) return;
      var type = err && err.type;
      if (type === "unavailable-id") {
        fail("That class code is already live in another tab. Close the extra Teacher tab.");
        return;
      }
      fail(ERR);
    });

    peer.on("disconnected", function () {
      if (destroyed) return;
      try { peer.reconnect(); } catch (e) { fail(ERR); }
    });

    return { destroy: cleanup };
  }

  function join(opts) {
    opts = opts || {};
    var onReady = opts.onReady || function () {};
    var onError = opts.onError || function () {};
    var code = String(opts.code || "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4);
    var nick = cleanNick(opts.nick);
    var destroyed = false;
    var peer = null;
    var conn = null;
    var openTimer = null;

    function fail(msg) {
      if (destroyed) return;
      cleanup();
      onError(msg || ERR);
    }

    function cleanup() {
      destroyed = true;
      if (openTimer) { clearTimeout(openTimer); openTimer = null; }
      try { if (conn) conn.close(); } catch (e) {}
      try { if (peer) peer.destroy(); } catch (e) {}
      peer = null;
      conn = null;
    }

    if (!code || code.length < 4 || !nick) {
      onError("Need class code + nickname (not a legal name).");
      return { destroy: function () {}, send: function () { return false; } };
    }
    if (!peerAvailable()) {
      onError(ERR);
      return { destroy: function () {}, send: function () { return false; } };
    }

    try {
      peer = newPeer();
    } catch (e) {
      fail(ERR);
      return { destroy: function () {}, send: function () { return false; } };
    }

    openTimer = setTimeout(function () { fail(ERR); }, OPEN_MS);

    peer.on("open", function () {
      if (destroyed) return;
      conn = peer.connect(PREFIX + code.toLowerCase(), { reliable: true });
      conn.on("open", function () {
        if (destroyed) return;
        if (openTimer) { clearTimeout(openTimer); openTimer = null; }
        wireSend(conn, { v: 1, type: "hello", nick: nick, night: 1, extracts: 0, strikes: 0, status: "playing" });
        onReady({
          send: function (payload) {
            payload = payload || {};
            return wireSend(conn, {
              v: 1,
              type: "ping",
              nick: nick,
              night: payload.night || 1,
              extracts: payload.extracts || 0,
              strikes: payload.strikes || 0,
              status: payload.status || "playing"
            });
          },
          destroy: cleanup
        });
      });
      conn.on("error", function () { fail(ERR); });
      conn.on("close", function () { if (!destroyed) fail(ERR); });
    });

    peer.on("error", function () { fail(ERR); });
    peer.on("disconnected", function () {
      if (destroyed) return;
      try { peer.reconnect(); } catch (e) { fail(ERR); }
    });

    return { destroy: cleanup, send: function () { return false; } };
  }

  global.AfterHoursNet = {
    makeCode: makeCode,
    cleanNick: cleanNick,
    peerAvailable: peerAvailable,
    host: host,
    join: join
  };
})(window);
