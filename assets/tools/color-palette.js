/* 照片配色色票產生器（tool_id=color_palette，前綴 pal_）
   照片只在瀏覽器裡分析：Lab 色彩空間 k-means，取最接近中心的真實像素當代表色。
   每個顏色在照片上有一個圓點，拖曳圓點就換成那裡的顏色（拖曳時顯示放大鏡）。
   追蹤一律呼叫頁面上的 window.palTrack（core §3-1），這裡不直接碰 gtag。 */
(function () {
  "use strict";
  var CFG = window.PAL || {};
  var URL_FULL = CFG.url || "https://tools.knittinghiyori.com/color-palette-from-photo/";
  var URL_SHORT = CFG.short || "tools.knittinghiyori.com/color-palette-from-photo";
  var T = CFG.t || {};
  function tr(k, d) { return T[k] || d; }
  function fmtT(s, o) { return s.replace(/\{(\w+)\}/g, function (_, k) { return o[k] != null ? o[k] : ""; }); }
  function track(n, p) { try { if (window.palTrack) window.palTrack(n, p); } catch (e) {} }
  function $(id) { return document.getElementById(id); }

  var view = $("pal-view");
  if (!view) return;
  var src = document.createElement("canvas");
  var srcCtx = null;
  var palette = [];          /* {r,g,b,share,x,y}；x、y 是在照片上的位置（0–1） */
  var active = -1;           /* 目前選中的圓點 */
  var history = [];
  var isDemo = true, dirty = false;
  var fmt = "hex", ratio = "orig";
  var startSent = false, resultSent = false;
  var MAX = 30;

  /* ---------- 色彩換算 ---------- */
  var LIN = new Float32Array(256);
  for (var i = 0; i < 256; i++) { var c0 = i / 255; LIN[i] = c0 <= 0.04045 ? c0 / 12.92 : Math.pow((c0 + 0.055) / 1.055, 2.4); }
  function toLab(r, g, b) {
    var R = LIN[r], G = LIN[g], B = LIN[b];
    var x = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047, y = R * 0.2126 + G * 0.7152 + B * 0.0722, z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;
    function f(t) { return t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116; }
    x = f(x); y = f(y); z = f(z);
    return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
  }
  function hex(c) { return "#" + [c.r, c.g, c.b].map(function (v) { return (v < 16 ? "0" : "") + v.toString(16); }).join("").toUpperCase(); }
  function hsb(c) {
    var r = c.r / 255, g = c.g / 255, b = c.b / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, h = 0;
    if (d) { if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h /= 6; if (h < 0) h += 1; }
    return { h: h, s: mx ? d / mx : 0, v: mx };
  }
  function hsl(c) {
    var r = c.r / 255, g = c.g / 255, b = c.b / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, l = (mx + mn) / 2, h = 0, s = 0;
    if (d) {
      s = d / (1 - Math.abs(2 * l - 1));
      if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4;
      h *= 60; if (h < 0) h += 360;
    }
    return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
  }
  function cmyk(c) {
    var r = c.r / 255, g = c.g / 255, b = c.b / 255, k = 1 - Math.max(r, g, b);
    if (k >= 1) return [0, 0, 0, 100];
    return [(1 - r - k) / (1 - k), (1 - g - k) / (1 - k), (1 - b - k) / (1 - k), k].map(function (v) { return Math.round(v * 100); });
  }
  function code(c, f) {
    f = f || fmt;
    if (f === "rgb") return "rgb(" + c.r + ", " + c.g + ", " + c.b + ")";
    if (f === "hsl") { var q = hsl(c); return "hsl(" + q[0] + ", " + q[1] + "%, " + q[2] + "%)"; }
    return hex(c);
  }
  function lum(c) { return 0.2126 * LIN[c.r] + 0.7152 * LIN[c.g] + 0.0722 * LIN[c.b]; }
  function contrast(a, b) { var x = Math.max(a, b), y = Math.min(a, b); return (x + 0.05) / (y + 0.05); }
  var INK = { r: 22, g: 18, b: 15 };
  function cWhite(c) { return contrast(lum(c), 1); }
  function cInk(c) { return contrast(lum(c), lum(INK)); }
  function textOn(c) { return cInk(c) >= cWhite(c) ? "#16120f" : "#ffffff"; }
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function d2(L, i, q) { var a = L[i * 3] - q[0], b = L[i * 3 + 1] - q[1], c = L[i * 3 + 2] - q[2]; return a * a + b * b + c * c; }

  /* ---------- 抓主色 ---------- */
  function extract(k, vivid) {
    var S = 200, sc = Math.min(1, S / Math.max(src.width, src.height));
    var w = Math.max(1, Math.round(src.width * sc)), h = Math.max(1, Math.round(src.height * sc));
    var t = document.createElement("canvas"); t.width = w; t.height = h;
    var tc = t.getContext("2d"); tc.drawImage(src, 0, 0, w, h);
    var d = tc.getImageData(0, 0, w, h).data, n = w * h;
    var L = new Float32Array(n * 3), W = new Float32Array(n), P = new Uint8Array(n * 3), POS = new Int32Array(n), m = 0, i, j;
    for (i = 0; i < n; i++) {
      if (d[i * 4 + 3] < 128) continue;
      var r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2], lab = toLab(r, g, b);
      L[m * 3] = lab[0]; L[m * 3 + 1] = lab[1]; L[m * 3 + 2] = lab[2];
      P[m * 3] = r; P[m * 3 + 1] = g; P[m * 3 + 2] = b; POS[m] = i;
      W[m] = vivid ? 1 + 2.2 * Math.min(1, Math.hypot(lab[1], lab[2]) / 80) : 1;
      m++;
    }
    if (!m) return [];
    var rand = rng(1234), C = [], dist = new Float32Array(m).fill(Infinity), tot = 0, acc = 0, first = 0;
    for (i = 0; i < m; i++) tot += W[i];
    var pick = rand() * tot;
    for (i = 0; i < m; i++) { acc += W[i]; if (acc >= pick) { first = i; break; } }
    C.push([L[first * 3], L[first * 3 + 1], L[first * 3 + 2]]);
    while (C.length < k) {
      var cc = C[C.length - 1], sum = 0;
      for (i = 0; i < m; i++) { var dd = d2(L, i, cc); if (dd < dist[i]) dist[i] = dd; sum += dist[i] * W[i]; }
      if (sum <= 0) break;
      var p = rand() * sum, a = 0, idx = m - 1;
      for (i = 0; i < m; i++) { a += dist[i] * W[i]; if (a >= p) { idx = i; break; } }
      C.push([L[idx * 3], L[idx * 3 + 1], L[idx * 3 + 2]]);
    }
    var K = C.length, as = new Int32Array(m);
    for (var it = 0; it < 16; it++) {
      var s = [], moved = 0;
      for (j = 0; j < K; j++) s.push([0, 0, 0, 0]);
      for (i = 0; i < m; i++) {
        var best = 0, bd = Infinity;
        for (j = 0; j < K; j++) { var e = d2(L, i, C[j]); if (e < bd) { bd = e; best = j; } }
        if (as[i] !== best) { as[i] = best; moved++; }
        var u = s[best]; u[0] += L[i * 3] * W[i]; u[1] += L[i * 3 + 1] * W[i]; u[2] += L[i * 3 + 2] * W[i]; u[3] += W[i];
      }
      for (j = 0; j < K; j++) if (s[j][3]) C[j] = [s[j][0] / s[j][3], s[j][1] / s[j][3], s[j][2] / s[j][3]];
      if (it > 0 && moved < m * 0.002) break;
    }
    var out = [];
    for (j = 0; j < K; j++) out.push({ bd: Infinity, i: 0, count: 0 });
    for (i = 0; i < m; i++) {
      var o = out[as[i]]; o.count++;
      var f2 = d2(L, i, C[as[i]]);
      if (f2 < o.bd) { o.bd = f2; o.i = i; }
    }
    return out.filter(function (o) { return o.count; }).map(function (o) {
      var px = POS[o.i] % w, py = Math.floor(POS[o.i] / w);
      return { r: P[o.i * 3], g: P[o.i * 3 + 1], b: P[o.i * 3 + 2], share: o.count / m, x: (px + 0.5) / w, y: (py + 0.5) / h };
    });
  }
  function sorted(p) {
    var mode = $("pal-sort").value, a = p.slice();
    if (mode === "light") a.sort(function (x, y) { return lum(y) - lum(x); });
    else if (mode === "share") a.sort(function (x, y) { return (y.share || 0) - (x.share || 0); });
    else a.sort(function (x, y) {
      var hx = hsb(x), hy = hsb(y), gx = hx.s < 0.12, gy = hy.s < 0.12;
      if (gx !== gy) return gx ? 1 : -1;
      return gx ? lum(y) - lum(x) : hx.h - hy.h;
    });
    return a;
  }
  /* 照片上某一點（0–1）周圍 5×5 的平均色 */
  function sampleAt(nx, ny) {
    var x = Math.min(src.width - 1, Math.max(0, Math.round(nx * src.width))), y = Math.min(src.height - 1, Math.max(0, Math.round(ny * src.height)));
    var d = srcCtx.getImageData(Math.max(0, x - 2), Math.max(0, y - 2), 5, 5).data, R = 0, G = 0, B = 0, n = 0;
    for (var i = 0; i < d.length; i += 4) { R += d[i]; G += d[i + 1]; B += d[i + 2]; n++; }
    return { r: Math.round(R / n), g: Math.round(G / n), b: Math.round(B / n), share: null, x: nx, y: ny };
  }

  /* ---------- 復原 ---------- */
  function snap() {
    history.push(JSON.stringify(palette));
    if (history.length > 40) history.shift();
    $("pal-undo").disabled = false;
  }
  function undo() {
    if (!history.length) return;
    palette = JSON.parse(history.pop());
    active = -1;
    $("pal-undo").disabled = !history.length;
    render();
    track("pal_undo");
  }

  /* ---------- 畫面 ---------- */
  function renderPins() {
    var box = $("pal-pins");
    box.textContent = "";
    palette.forEach(function (c, i) {
      if (c.x == null) return;
      var b = document.createElement("button");
      b.type = "button"; b.className = "pal-pin" + (i === active ? " on" : "");
      b.style.left = (c.x * 100) + "%"; b.style.top = (c.y * 100) + "%"; b.style.background = hex(c);
      b.setAttribute("aria-label", fmtT(tr("pinLabel", "第 {n} 色 {hex}，用方向鍵移動"), { n: i + 1, hex: hex(c) }));
      b.dataset.i = i;
      box.appendChild(b);
    });
  }
  function render() {
    var strip = $("pal-strip"), list = $("pal-list");
    strip.textContent = ""; list.textContent = "";
    palette.forEach(function (c, i) {
      var hx = hex(c);
      var b = document.createElement("button");
      b.type = "button"; b.style.background = hx; b.style.color = textOn(c);
      if (i === active) b.className = "on";
      b.setAttribute("aria-label", fmtT(tr("stripLabel", "複製 {hex}"), { hex: hx }));
      var sp = document.createElement("span"); sp.textContent = hx.slice(1); b.appendChild(sp);
      b.addEventListener("click", function () { setActive(i); copy(code(c), fmtT(tr("copied1", "已複製 {code}"), { code: code(c) })); track("export", { method: "copy_text", option: "one_color", source: "strip" }); });
      strip.appendChild(b);

      var li = document.createElement("li"); if (i === active) li.className = "sel";
      var sw = document.createElement("button"); sw.type = "button"; sw.className = "sw"; sw.style.background = hx;
      sw.setAttribute("aria-label", fmtT(tr("swLabel", "在照片上標出第 {n} 色"), { n: i + 1 }));
      sw.addEventListener("click", function () { setActive(i); });
      var meta = document.createElement("div"); meta.className = "meta";
      var t = document.createElement("b"); t.textContent = code(c);
      var k = cmyk(c), sub = document.createElement("span");
      sub.textContent = (fmt === "hex" ? "RGB " + c.r + "," + c.g + "," + c.b + "　" : hx + "　") + "CMYK " + k.join(",") + (c.share != null ? "　" + Math.round(c.share * 100) + "%" : "");
      var chips = document.createElement("div"); chips.className = "chips";
      [[cWhite(c), tr("onWhite", "白字")], [cInk(c), tr("onInk", "黑字")]].forEach(function (x) {
        if (x[0] < 4.5) return;
        var ch = document.createElement("span"); ch.className = "chip"; ch.textContent = x[1] + " " + x[0].toFixed(1);
        chips.appendChild(ch);
      });
      meta.appendChild(t); meta.appendChild(sub); if (chips.childNodes.length) meta.appendChild(chips);
      var cp = document.createElement("button"); cp.type = "button"; cp.className = "btn sm"; cp.textContent = tr("copy", "複製");
      cp.addEventListener("click", function () { copy(code(c), fmtT(tr("copied1", "已複製 {code}"), { code: code(c) })); track("export", { method: "copy_text", option: "one_color", source: "list" }); });
      var rm = document.createElement("button"); rm.type = "button"; rm.className = "x"; rm.textContent = "×";
      rm.setAttribute("aria-label", fmtT(tr("rmLabel", "刪除 {hex}"), { hex: hx }));
      rm.addEventListener("click", function () { snap(); dirty = true; palette.splice(i, 1); active = -1; render(); track("pal_pick", { option: "remove" }); });
      li.appendChild(sw); li.appendChild(meta); li.appendChild(cp); li.appendChild(rm);
      list.appendChild(li);
    });
    $("pal-count-n").textContent = palette.length;
    $("pal-add").disabled = palette.length >= MAX;
    renderPins();
  }
  function setActive(i) { active = i; render(); }
  function busy(on) { $("pal-busy").hidden = !on; }
  function analyze(keepHistory) {
    var k = +$("pal-k").value; $("pal-k-out").textContent = k;
    if (!keepHistory) { history = []; $("pal-undo").disabled = true; }
    palette = sorted(extract(k, $("pal-vivid").checked)); active = -1; dirty = false; render();
    if (!isDemo) {
      if (!resultSent) { resultSent = true; track("tool_result", { item_count: palette.length, option: $("pal-sort").value }); }
    }
  }
  /* 改設定重新抓色：手動改過的顏色會被蓋掉，提供復原 */
  function reanalyze() {
    var hadEdits = dirty;
    snap();
    busy(true);
    setTimeout(function () {
      try { analyze(true); } finally { busy(false); }
      if (hadEdits) toast(tr("reExtracted", "已重新抓色，手動調整的顏色被換掉了"), true);
    }, 30);
  }

  /* ---------- 圓點拖曳＋放大鏡 ---------- */
  var drag = null, loupe = $("pal-loupe"), lctx = loupe.getContext("2d");
  function posFromEvent(e) {
    var r = view.getBoundingClientRect();
    return { x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)), r: r };
  }
  function drawLoupe(p, touch) {
    var Z = 15, sx = Math.round(p.x * src.width) - (Z >> 1), sy = Math.round(p.y * src.height) - (Z >> 1);
    lctx.imageSmoothingEnabled = false;
    lctx.fillStyle = "#fff"; lctx.fillRect(0, 0, 120, 120);
    lctx.drawImage(src, sx, sy, Z, Z, 0, 0, 120, 120);
    var cell = 120 / Z, cx = (Z >> 1) * cell;
    lctx.strokeStyle = "#fff"; lctx.lineWidth = 2; lctx.strokeRect(cx, cx, cell, cell);
    lctx.strokeStyle = "rgba(22,18,15,.6)"; lctx.lineWidth = 1; lctx.strokeRect(cx - 1, cx - 1, cell + 2, cell + 2);
    var lx = p.x * p.r.width, ly = p.y * p.r.height - (touch ? 95 : 80);
    if (ly < 60) ly = p.y * p.r.height + (touch ? 95 : 80);
    loupe.style.left = lx + "px"; loupe.style.top = ly + "px";
    loupe.hidden = false;
  }
  $("pal-pins").addEventListener("pointerdown", function (e) {
    var pin = e.target.closest ? e.target.closest(".pal-pin") : null;
    if (!pin) return;
    e.preventDefault();
    var i = +pin.dataset.i;
    snap();
    drag = { i: i, id: e.pointerId, touch: e.pointerType !== "mouse", moved: false };
    try { pin.setPointerCapture(e.pointerId); } catch (err) {}
    active = i; pin.classList.add("on", "drag");
    sendStart();
    drawLoupe(posFromEvent(e), drag.touch);
  });
  $("pal-pins").addEventListener("pointermove", function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var p = posFromEvent(e);
    var c = sampleAt(p.x, p.y);
    palette[drag.i] = c; drag.moved = true;
    var pin = $("pal-pins").children[drag.i];
    if (pin) { pin.style.left = (p.x * 100) + "%"; pin.style.top = (p.y * 100) + "%"; pin.style.background = hex(c); }
    var sb = $("pal-strip").children[drag.i];
    if (sb) { sb.style.background = hex(c); sb.style.color = textOn(c); sb.firstChild.textContent = hex(c).slice(1); }
    drawLoupe(p, drag.touch);
  });
  function endDrag(e) {
    if (!drag || e.pointerId !== drag.id) return;
    loupe.hidden = true;
    if (drag.moved) { dirty = true; track("pal_pick", { option: "drag" }); }
    else { history.pop(); $("pal-undo").disabled = !history.length; }
    drag = null;
    render();
  }
  $("pal-pins").addEventListener("pointerup", endDrag);
  $("pal-pins").addEventListener("pointercancel", endDrag);
  /* 鍵盤：方向鍵移動圓點（Shift 一次走多一點） */
  $("pal-pins").addEventListener("keydown", function (e) {
    var pin = e.target.closest ? e.target.closest(".pal-pin") : null;
    if (!pin) return;
    var i = +pin.dataset.i, c = palette[i], st = e.shiftKey ? 0.05 : 0.01, dx = 0, dy = 0;
    if (e.key === "ArrowLeft") dx = -st; else if (e.key === "ArrowRight") dx = st; else if (e.key === "ArrowUp") dy = -st; else if (e.key === "ArrowDown") dy = st; else return;
    e.preventDefault(); snap(); dirty = true;
    palette[i] = sampleAt(Math.min(1, Math.max(0, c.x + dx)), Math.min(1, Math.max(0, c.y + dy)));
    active = i; render();
    var again = $("pal-pins").children[i]; if (again) again.focus();
  });

  /* ---------- 讀照片 ---------- */
  function useSource(img, w, h, demo) {
    var s = Math.min(1, 1600 / Math.max(w, h));
    src = document.createElement("canvas"); src.width = Math.round(w * s); src.height = Math.round(h * s);
    srcCtx = src.getContext("2d", { willReadFrequently: true });
    srcCtx.drawImage(img, 0, 0, src.width, src.height);
    view.width = src.width; view.height = src.height;
    view.getContext("2d").drawImage(src, 0, 0);
    isDemo = !!demo;
    $("pal-badge").hidden = !demo;
    analyze(false);
  }
  function loadFile(f, how) {
    if (!f) return;
    if (!/^image\//.test(f.type || "")) { toast(tr("notImage", "請選擇圖片檔（JPG、PNG、WebP）")); track("pal_error", { option: "not_image" }); return; }
    sendStart();
    busy(true);
    var url = URL.createObjectURL(f), img = new Image();
    img.onload = function () {
      setTimeout(function () {
        try { useSource(img, img.naturalWidth, img.naturalHeight, false); } finally { busy(false); URL.revokeObjectURL(url); }
        track("pal_upload", { source: how });
      }, 20);
    };
    img.onerror = function () { busy(false); toast(tr("decodeErr", "這張圖片讀不出來，換一張試試")); URL.revokeObjectURL(url); track("pal_error", { option: "decode" }); };
    img.src = url;
  }
  function sendStart() { if (startSent) return; startSent = true; track("tool_start", { entry_point: "direct" }); }

  $("pal-file").addEventListener("change", function (e) { loadFile(e.target.files[0], "picker"); e.target.value = ""; });
  var drop = $("pal-drop");
  ["dragenter", "dragover"].forEach(function (t) { drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.add("dragging"); }); });
  ["dragleave", "drop"].forEach(function (t) { drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.remove("dragging"); }); });
  drop.addEventListener("drop", function (e) { if (e.dataTransfer) loadFile(e.dataTransfer.files[0], "drop"); });
  window.addEventListener("paste", function (e) {
    var items = (e.clipboardData ? e.clipboardData.items : null) || [];
    for (var i = 0; i < items.length; i++) if (/^image\//.test(items[i].type)) { loadFile(items[i].getAsFile(), "paste"); break; }
  });

  $("pal-add").addEventListener("click", function () {
    if (palette.length >= MAX) { toast(tr("max", "最多 30 色（Procreate 一份色票的上限）")); return; }
    snap(); dirty = true; sendStart();
    /* 放在離現有圓點最遠的位置，比較不會疊在一起 */
    var best = { x: 0.5, y: 0.5 }, bd = -1;
    for (var gy = 1; gy < 6; gy++) for (var gx = 1; gx < 6; gx++) {
      var x = gx / 6, y = gy / 6, md = Infinity;
      palette.forEach(function (c) { if (c.x != null) md = Math.min(md, Math.pow(c.x - x, 2) + Math.pow(c.y - y, 2)); });
      if (md > bd) { bd = md; best = { x: x, y: y }; }
    }
    palette.push(sampleAt(best.x, best.y));
    active = palette.length - 1; render();
    toast(tr("added", "加了一色，拖曳照片上的新圓點來選顏色"));
    track("pal_pick", { option: "add" });
  });
  $("pal-undo").addEventListener("click", undo);
  $("pal-k").addEventListener("input", function () { $("pal-k-out").textContent = $("pal-k").value; });
  $("pal-k").addEventListener("change", function () { sendStart(); reanalyze(); track("pal_setting", { option: "count", item_count: +$("pal-k").value }); });
  $("pal-vivid").addEventListener("change", function () { sendStart(); reanalyze(); track("pal_setting", { option: "vivid", result: $("pal-vivid").checked ? "on" : "off" }); });
  $("pal-sort").addEventListener("change", function () { snap(); palette = sorted(palette); active = -1; render(); track("pal_setting", { option: "sort", result: $("pal-sort").value }); });
  $("pal-demo").addEventListener("click", function () { sample(); track("tool_demo"); });
  function seg(attr, cb) {
    var bs = document.querySelectorAll("[data-" + attr + "]");
    for (var i = 0; i < bs.length; i++) bs[i].addEventListener("click", function () {
      for (var j = 0; j < bs.length; j++) bs[j].setAttribute("aria-pressed", String(bs[j] === this));
      cb(this.getAttribute("data-" + attr));
    });
  }
  seg("fmt", function (v) { fmt = v; render(); track("pal_setting", { option: "format", result: v }); });
  seg("ratio", function (v) { ratio = v; track("pal_setting", { option: "ratio", result: v }); });

  /* ---------- 提示 ---------- */
  var toastT;
  function toast(msg, withUndo) {
    var el = $("toast"), act = $("toast-act");
    $("toast-t").textContent = msg;
    act.hidden = !withUndo;
    el.classList.add("on"); clearTimeout(toastT);
    toastT = setTimeout(function () { el.classList.remove("on"); act.hidden = true; }, withUndo ? 5000 : 2400);
  }
  $("toast-act").addEventListener("click", function () { undo(); $("toast").classList.remove("on"); this.hidden = true; });
  function copy(text, okMsg) {
    function fallback() {
      var ta = document.createElement("textarea"); ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select(); var ok = false; try { ok = document.execCommand("copy"); } catch (e) {} ta.remove();
      toast(ok ? okMsg : tr("copyFail", "複製失敗，請長按色碼手動複製"));
    }
    try { if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { toast(okMsg); }, fallback); else fallback(); } catch (e) { fallback(); }
  }

  /* ---------- 匯出 ---------- */
  function fileBase() { var d = new Date(); function z(n) { return (n < 10 ? "0" : "") + n; } return "palette-" + d.getFullYear() + z(d.getMonth() + 1) + z(d.getDate()) + "-" + z(d.getHours()) + z(d.getMinutes()); }
  function paletteName() { return ($("pal-name").value || "").trim() || tr("defaultName", "我的配色"); }
  function credit() { return paletteName() + "｜" + tr("toolName", "照片配色色票產生器") + " " + URL_FULL; }
  function download(blob, name) {
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
    a.setAttribute("data-google-vignette", "false");
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
  }
  function canShareFile(f) { try { return !!(f && navigator.canShare && navigator.canShare({ files: [f] })); } catch (e) { return false; } }

  $("pal-copy").addEventListener("click", function () {
    if (!palette.length) return;
    copy(palette.map(function (c) { return code(c); }).join("\n") + "\n\n" + credit(), fmtT(tr("copiedN", "已複製 {n} 個色碼"), { n: palette.length }));
    track("export", { method: "copy_text", option: "all_colors", result: fmt, item_count: palette.length });
  });
  $("pal-css").addEventListener("click", function () {
    if (!palette.length) return;
    var lines = palette.map(function (c, i) { return "  --color-" + (i + 1) + ": " + code(c) + ";"; });
    copy("/* " + credit() + " */\n:root {\n" + lines.join("\n") + "\n}", tr("copiedCss", "已複製 CSS 變數"));
    track("export", { method: "copy_text", option: "css_vars", result: fmt, item_count: palette.length });
  });

  /* Procreate .swatches：ZIP 裡放 Swatches.json（HSB 0–1），不壓縮 */
  var CRC = (function () { var t = new Uint32Array(256); for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); t[n] = c >>> 0; } return t; })();
  function crc32(b) { var c = 0xFFFFFFFF; for (var i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  function zipStore(name, data) {
    var nm = new TextEncoder().encode(name), crc = crc32(data), sz = data.length;
    var lh = new DataView(new ArrayBuffer(30)); lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(12, 33, true);
    lh.setUint32(14, crc, true); lh.setUint32(18, sz, true); lh.setUint32(22, sz, true); lh.setUint16(26, nm.length, true);
    var ch = new DataView(new ArrayBuffer(46)); ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(14, 33, true);
    ch.setUint32(16, crc, true); ch.setUint32(20, sz, true); ch.setUint32(24, sz, true); ch.setUint16(28, nm.length, true);
    var end = new DataView(new ArrayBuffer(22)); end.setUint32(0, 0x06054b50, true); end.setUint16(8, 1, true); end.setUint16(10, 1, true);
    end.setUint32(12, 46 + nm.length, true); end.setUint32(16, 30 + nm.length + sz, true);
    return new Blob([lh, nm, data, ch, nm, end], { type: "application/octet-stream" });
  }
  function isApple() { return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); }
  $("pal-procreate").addEventListener("click", function () {
    if (!palette.length) return;
    var sw = palette.slice(0, MAX).map(function (c) { var q = hsb(c); return { hue: +q.h.toFixed(5), saturation: +q.s.toFixed(5), brightness: +q.v.toFixed(5), alpha: 1, colorSpace: 0 }; });
    var blob = zipStore("Swatches.json", new TextEncoder().encode(JSON.stringify([{ name: paletteName(), swatches: sw }])));
    var name = fileBase() + ".swatches", f = null;
    try { f = new File([blob], name, { type: "application/octet-stream" }); } catch (e) {}
    /* iPad／iPhone：先開分享選單，讓使用者直接點 Procreate；不支援才下載 */
    if (isApple() && canShareFile(f)) {
      navigator.share({ files: [f] })
        .then(function () { track("export", { method: "file", option: "procreate", result: "share_sheet", item_count: sw.length }); })
        .catch(function (err) {
          if (err && err.name === "AbortError") { track("share_cancel", { method: "native", content_type: "result" }); return; }
          download(blob, name); track("export", { method: "file", option: "procreate", result: "download", item_count: sw.length });
        });
      return;
    }
    download(blob, name);
    track("export", { method: "file", option: "procreate", result: "download", item_count: sw.length });
    toast(tr("dlProcreate", "已下載 Procreate 色票，在 iPad 上點一下檔案就會匯入"));
  });

  /* 色票卡：照片＋色條＋色碼＋工具網址（core §3-2 匯出要附出處） */
  var RATIOS = { square: [1080, 1080], portrait: [1080, 1350], story: [1080, 1920] };
  function cardBlob(cb) {
    var c = document.createElement("canvas"), x = c.getContext("2d"), W, H, ih, sh, foot;
    if (RATIOS[ratio]) {
      W = RATIOS[ratio][0]; H = RATIOS[ratio][1]; foot = ratio === "story" ? 0 : 84; sh = Math.round(H * (ratio === "story" ? 0.18 : 0.24));
      var top = ratio === "story" ? 220 : 0, bottom = ratio === "story" ? 200 : 0;
      c.width = W; c.height = H;
      x.fillStyle = "#ffffff"; x.fillRect(0, 0, W, H);
      ih = H - sh - foot - top - bottom;
      var s = Math.max(W / src.width, ih / src.height), dw = src.width * s, dh = src.height * s;
      x.save(); x.beginPath(); x.rect(0, top, W, ih); x.clip();
      x.drawImage(src, (W - dw) / 2, top + (ih - dh) / 2, dw, dh); x.restore();
      drawStrip(x, 0, top + ih, W, sh, 30);
      if (ratio === "story") {
        /* 限動：上下留給 IG 介面，名稱放上方、網址放下方 */
        x.fillStyle = "#16120f"; x.textAlign = "center"; x.textBaseline = "middle";
        x.font = "700 52px -apple-system, \"PingFang TC\", \"Hiragino Sans\", \"Noto Sans TC\", sans-serif";
        x.fillText(paletteName(), W / 2, top / 2 + 20);
        x.fillStyle = "#c8341e"; x.font = "500 26px \"IBM Plex Mono\", Menlo, monospace";
        x.fillText(URL_SHORT, W / 2, top + ih + sh + (H - top - ih - sh) / 2 - 20);
      } else {
        drawFoot(x, W, top + ih + sh, foot, 26, 22);
      }
    } else {
      W = 1600; ih = Math.round(src.height * W / src.width); sh = 380; foot = 96;
      c.width = W; c.height = ih + sh + foot;
      x.fillStyle = "#ffffff"; x.fillRect(0, 0, c.width, c.height);
      x.drawImage(src, 0, 0, W, ih);
      drawStrip(x, 0, ih, W, sh, 34);
      drawFoot(x, W, ih + sh, foot, 30, 26);
    }
    c.toBlob(function (b) { cb(b); }, "image/png");
  }
  function drawStrip(x, x0, y0, W, sh, maxFont) {
    var n = palette.length, bw = W / n;
    palette.forEach(function (p, i) {
      x.fillStyle = hex(p); x.fillRect(Math.floor(x0 + i * bw), y0, Math.ceil(bw) + 1, sh);
      x.save(); x.translate(x0 + i * bw + bw / 2, y0 + sh - 24); x.rotate(-Math.PI / 2);
      x.fillStyle = textOn(p); x.font = "500 " + Math.round(Math.min(bw * 0.34, maxFont)) + "px \"IBM Plex Mono\", Menlo, monospace";
      x.textBaseline = "middle"; x.textAlign = "left"; x.fillText(hex(p).slice(1), 0, 0); x.restore();
    });
  }
  function drawFoot(x, W, y0, foot, nameSize, urlSize) {
    x.fillStyle = "#16120f"; x.font = "700 " + nameSize + "px -apple-system, \"PingFang TC\", \"Hiragino Sans\", \"Noto Sans TC\", sans-serif"; x.textBaseline = "middle"; x.textAlign = "left";
    x.fillText(paletteName(), 36, y0 + foot / 2);
    x.fillStyle = "#c8341e"; x.font = "500 " + urlSize + "px \"IBM Plex Mono\", Menlo, monospace"; x.textAlign = "right";
    x.fillText(URL_SHORT, W - 36, y0 + foot / 2);
  }
  $("pal-png").addEventListener("click", function () {
    if (!palette.length) return;
    cardBlob(function (b) {
      if (!b) { toast(tr("imgFail", "產生圖片失敗，請再試一次")); return; }
      download(b, fileBase() + ".png");
      track("export", { method: "image", option: "palette_card", result: ratio, item_count: palette.length });
      toast(tr("dlCard", "已下載色票卡"));
    });
  });
  $("pal-share").addEventListener("click", function () {
    if (!palette.length) return;
    cardBlob(function (b) {
      if (!b) return;
      var f = null;
      try { f = new File([b], fileBase() + ".png", { type: "image/png" }); } catch (e) {}
      if (!canShareFile(f)) { $("pal-png").click(); toast(tr("noShare", "這個瀏覽器不能直接分享圖片，已改成下載")); return; }
      navigator.share({ files: [f], title: paletteName(), text: credit() })
        .then(function () { track("share", { method: "native", content_type: "result" }); })
        .catch(function (err) { if (err) { if (err.name === "AbortError") track("share_cancel", { method: "native", content_type: "result" }); } });
    });
  });

  /* ---------- 手機底部匯出列：工具區在畫面內才出現 ---------- */
  var bar = $("pal-bar");
  var gos = bar.querySelectorAll("[data-go]");
  for (var gi = 0; gi < gos.length; gi++) gos[gi].addEventListener("click", function () { var t = $(this.getAttribute("data-go")); if (t) t.click(); });
  try {
    var io = new IntersectionObserver(function (en) {
      var on = en[0].isIntersecting;
      bar.hidden = !on; document.body.classList.toggle("has-bar", on);
    }, { threshold: 0.05 });
    io.observe($("tool"));
  } catch (e) {}

  /* ---------- 範例圖（程式畫的，不是照片） ---------- */
  function sample() {
    var W = 1200, H = 760, c = document.createElement("canvas"); c.width = W; c.height = H;
    var x = c.getContext("2d"), r = rng(7);
    var g = x.createLinearGradient(0, 0, 0, H * 0.62); g.addColorStop(0, "#2E3F6B"); g.addColorStop(0.55, "#9AA7CC"); g.addColorStop(1, "#F2C3B0");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.fillStyle = "#FBE3CF"; x.beginPath(); x.arc(W * 0.72, H * 0.5, 46, 0, Math.PI * 2); x.fill();
    function ridge(base, amp, col, seed) {
      var rr = rng(seed), y = base; x.fillStyle = col; x.beginPath(); x.moveTo(0, H);
      for (var i = 0; i <= 60; i++) { y += (rr() - 0.5) * amp; y = Math.min(base + amp * 2, Math.max(base - amp * 3, y)); x.lineTo(i * W / 60, y); }
      x.lineTo(W, H); x.fill();
    }
    ridge(H * 0.47, 34, "#D9B8C4", 3); ridge(H * 0.53, 30, "#8D86A8", 5); ridge(H * 0.6, 22, "#4A4F78", 9);
    g = x.createLinearGradient(0, H * 0.64, 0, H); g.addColorStop(0, "#C9A9B4"); g.addColorStop(1, "#2B3157"); x.fillStyle = g; x.fillRect(0, H * 0.64, W, H);
    for (var i = 0; i < 140; i++) { x.fillStyle = "rgba(255," + (200 + r() * 40 | 0) + "," + (180 + r() * 40 | 0) + "," + (0.12 + r() * 0.2) + ")"; x.fillRect(r() * W, H * 0.66 + r() * H * 0.32, 40 + r() * 140, 2); }
    x.fillStyle = "#C2413A"; x.beginPath(); x.moveTo(W * 0.3, H * 0.83); x.lineTo(W * 0.36, H * 0.83); x.lineTo(W * 0.345, H * 0.86); x.lineTo(W * 0.315, H * 0.86); x.fill();
    x.fillRect(W * 0.332, H * 0.76, 3, H * 0.07);
    useSource(c, W, H, true);
  }
  try { sample(); } catch (e) {}
})();
