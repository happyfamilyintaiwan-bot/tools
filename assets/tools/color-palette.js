/* 照片配色色票產生器（tool_id=color_palette，前綴 pal_）
   照片只在瀏覽器裡分析：Lab 色彩空間 k-means，取最接近中心的真實像素當代表色。
   追蹤一律呼叫頁面上的 window.palTrack（core §3-1），這裡不直接碰 gtag。 */
(function () {
  "use strict";
  var CFG = window.PAL || {};
  var URL_FULL = CFG.url || "https://tools.knittinghiyori.com/color-palette-from-photo/";
  var URL_SHORT = CFG.short || "tools.knittinghiyori.com/color-palette-from-photo";
  function track(n, p) { try { if (window.palTrack) window.palTrack(n, p); } catch (e) {} }
  function $(id) { return document.getElementById(id); }

  var view = $("pal-view");
  if (!view) return;
  var src = document.createElement("canvas");
  var palette = [];
  var selected = -1;
  var isDemo = true;
  var startSent = false, resultSent = false;

  /* ---------- 色彩換算 ---------- */
  var LIN = new Float32Array(256);
  for (var i = 0; i < 256; i++) { var c = i / 255; LIN[i] = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
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
  function cmyk(c) {
    var r = c.r / 255, g = c.g / 255, b = c.b / 255, k = 1 - Math.max(r, g, b);
    if (k >= 1) return [0, 0, 0, 100];
    return [(1 - r - k) / (1 - k), (1 - g - k) / (1 - k), (1 - b - k) / (1 - k), k].map(function (v) { return Math.round(v * 100); });
  }
  function lum(c) { return 0.2126 * LIN[c.r] + 0.7152 * LIN[c.g] + 0.0722 * LIN[c.b]; }
  function textOn(c) { return lum(c) > 0.32 ? "#16120f" : "#ffffff"; }
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  /* ---------- 抓主色 ---------- */
  function extract(k, vivid) {
    var S = 200, sc = Math.min(1, S / Math.max(src.width, src.height));
    var w = Math.max(1, Math.round(src.width * sc)), h = Math.max(1, Math.round(src.height * sc));
    var t = document.createElement("canvas"); t.width = w; t.height = h;
    var tc = t.getContext("2d"); tc.drawImage(src, 0, 0, w, h);
    var d = tc.getImageData(0, 0, w, h).data, n = w * h;
    var L = new Float32Array(n * 3), W = new Float32Array(n), P = new Uint8Array(n * 3), m = 0, i, j;
    for (i = 0; i < n; i++) {
      if (d[i * 4 + 3] < 128) continue;
      var r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2], lab = toLab(r, g, b);
      L[m * 3] = lab[0]; L[m * 3 + 1] = lab[1]; L[m * 3 + 2] = lab[2];
      P[m * 3] = r; P[m * 3 + 1] = g; P[m * 3 + 2] = b;
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
      for (i = 0; i < m; i++) {
        var dd = Math.pow(L[i * 3] - cc[0], 2) + Math.pow(L[i * 3 + 1] - cc[1], 2) + Math.pow(L[i * 3 + 2] - cc[2], 2);
        if (dd < dist[i]) dist[i] = dd;
        sum += dist[i] * W[i];
      }
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
        for (j = 0; j < K; j++) {
          var q = C[j], e = Math.pow(L[i * 3] - q[0], 2) + Math.pow(L[i * 3 + 1] - q[1], 2) + Math.pow(L[i * 3 + 2] - q[2], 2);
          if (e < bd) { bd = e; best = j; }
        }
        if (as[i] !== best) { as[i] = best; moved++; }
        var u = s[best]; u[0] += L[i * 3] * W[i]; u[1] += L[i * 3 + 1] * W[i]; u[2] += L[i * 3 + 2] * W[i]; u[3] += W[i];
      }
      for (j = 0; j < K; j++) if (s[j][3]) C[j] = [s[j][0] / s[j][3], s[j][1] / s[j][3], s[j][2] / s[j][3]];
      if (it > 0 ? moved < m * 0.002 : false) break;
    }
    var out = [];
    for (j = 0; j < K; j++) out.push({ bd: Infinity, i: 0, count: 0 });
    for (i = 0; i < m; i++) {
      var o = out[as[i]], z = C[as[i]];
      o.count++;
      var f2 = Math.pow(L[i * 3] - z[0], 2) + Math.pow(L[i * 3 + 1] - z[1], 2) + Math.pow(L[i * 3 + 2] - z[2], 2);
      if (f2 < o.bd) { o.bd = f2; o.i = i; }
    }
    return out.filter(function (o) { return o.count; }).map(function (o) { return { r: P[o.i * 3], g: P[o.i * 3 + 1], b: P[o.i * 3 + 2], share: o.count / m }; });
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

  /* ---------- 畫面 ---------- */
  function render() {
    var strip = $("pal-strip"), list = $("pal-list");
    strip.textContent = ""; list.textContent = "";
    palette.forEach(function (c, i) {
      var hx = hex(c);
      var b = document.createElement("button");
      b.type = "button"; b.style.background = hx; b.style.color = textOn(c);
      b.setAttribute("aria-pressed", String(i === selected));
      b.setAttribute("aria-label", "第 " + (i + 1) + " 格 " + hx);
      var sp = document.createElement("span"); sp.textContent = hx.slice(1); b.appendChild(sp);
      b.addEventListener("click", function () { select(i); });
      strip.appendChild(b);

      var li = document.createElement("li"); if (i === selected) li.className = "sel";
      var sw = document.createElement("button"); sw.type = "button"; sw.className = "sw"; sw.style.background = hx;
      sw.setAttribute("aria-label", "選第 " + (i + 1) + " 格來換色");
      sw.addEventListener("click", function () { select(i); });
      var meta = document.createElement("div"); meta.className = "meta";
      var t = document.createElement("b"); t.textContent = hx;
      var k = cmyk(c), sub = document.createElement("span");
      sub.textContent = "RGB " + c.r + "," + c.g + "," + c.b + "　CMYK " + k.join(",") + (c.share != null ? "　" + Math.round(c.share * 100) + "%" : "");
      meta.appendChild(t); meta.appendChild(sub);
      var cp = document.createElement("button"); cp.type = "button"; cp.className = "btn sm"; cp.textContent = "複製";
      cp.addEventListener("click", function () { copy(hx, "已複製 " + hx); track("export", { method: "copy_text", option: "one_color" }); });
      var rm = document.createElement("button"); rm.type = "button"; rm.className = "x"; rm.textContent = "×";
      rm.setAttribute("aria-label", "刪除 " + hx);
      rm.addEventListener("click", function () { palette.splice(i, 1); selected = -1; render(); });
      li.appendChild(sw); li.appendChild(meta); li.appendChild(cp); li.appendChild(rm);
      list.appendChild(li);
    });
    $("pal-hint").textContent = selected >= 0
      ? "已選第 " + (selected + 1) + " 格：點照片任一處，換成那裡的顏色（再點一次同一格取消）"
      : "點一格色票，再點照片，就能換成照片上那一點的顏色；沒選格子時點照片會加一色";
    $("pal-count-n").textContent = palette.length;
  }
  function select(i) { selected = selected === i ? -1 : i; render(); }
  function analyze() {
    var k = +$("pal-k").value; $("pal-k-out").textContent = k;
    palette = sorted(extract(k, $("pal-vivid").checked)); selected = -1; render();
    if (!isDemo) {
      if (!resultSent) { resultSent = true; track("tool_result", { item_count: palette.length, option: $("pal-sort").value }); }
    }
  }

  /* ---------- 讀照片 ---------- */
  function useSource(img, w, h, demo) {
    var s = Math.min(1, 1600 / Math.max(w, h));
    src = document.createElement("canvas"); src.width = Math.round(w * s); src.height = Math.round(h * s);
    src.getContext("2d").drawImage(img, 0, 0, src.width, src.height);
    view.width = src.width; view.height = src.height;
    view.getContext("2d").drawImage(src, 0, 0);
    isDemo = !!demo;
    $("pal-badge").hidden = !demo;
    analyze();
  }
  function loadFile(f, how) {
    if (!f) return;
    if (!/^image\//.test(f.type || "")) { toast("請選擇圖片檔（JPG、PNG、WebP）"); track("pal_error", { option: "not_image" }); return; }
    sendStart();
    var url = URL.createObjectURL(f), img = new Image();
    img.onload = function () { useSource(img, img.naturalWidth, img.naturalHeight, false); URL.revokeObjectURL(url); track("pal_upload", { source: how }); };
    img.onerror = function () { toast("這張圖片讀不出來，換一張試試"); URL.revokeObjectURL(url); track("pal_error", { option: "decode" }); };
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

  view.addEventListener("click", function (e) {
    var r = view.getBoundingClientRect();
    var x = Math.floor((e.clientX - r.left) / r.width * view.width), y = Math.floor((e.clientY - r.top) / r.height * view.height);
    var d = src.getContext("2d").getImageData(Math.max(0, x - 2), Math.max(0, y - 2), 5, 5).data, R = 0, G = 0, B = 0, n = 0;
    for (var i = 0; i < d.length; i += 4) { R += d[i]; G += d[i + 1]; B += d[i + 2]; n++; }
    if (!n) return;
    var c = { r: Math.round(R / n), g: Math.round(G / n), b: Math.round(B / n), share: null };
    sendStart();
    if (selected >= 0) { palette[selected] = c; toast("第 " + (selected + 1) + " 格換成 " + hex(c)); track("pal_pick", { option: "replace" }); }
    else if (palette.length < 30) { palette.push(c); toast("加入 " + hex(c)); track("pal_pick", { option: "add" }); }
    else { toast("最多 30 色（Procreate 一份色票的上限）"); return; }
    render();
  });
  $("pal-k").addEventListener("input", function () { $("pal-k-out").textContent = $("pal-k").value; });
  $("pal-k").addEventListener("change", function () { sendStart(); analyze(); track("pal_setting", { option: "count", item_count: +$("pal-k").value }); });
  $("pal-vivid").addEventListener("change", function () { sendStart(); analyze(); track("pal_setting", { option: "vivid", result: $("pal-vivid").checked ? "on" : "off" }); });
  $("pal-sort").addEventListener("change", function () { palette = sorted(palette); selected = -1; render(); track("pal_setting", { option: "sort", result: $("pal-sort").value }); });
  $("pal-demo").addEventListener("click", function () { sample(); track("tool_demo"); });

  /* ---------- 匯出 ---------- */
  var toastT;
  function toast(msg) { var el = $("toast"); el.textContent = msg; el.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove("on"); }, 2400); }
  function copy(text, okMsg) {
    function fallback() {
      var ta = document.createElement("textarea"); ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select(); var ok = false; try { ok = document.execCommand("copy"); } catch (e) {} ta.remove();
      toast(ok ? okMsg : "複製失敗，請長按色碼手動複製");
    }
    try { if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { toast(okMsg); }, fallback); else fallback(); } catch (e) { fallback(); }
  }
  function fileBase() { var d = new Date(); function z(n) { return (n < 10 ? "0" : "") + n; } return "palette-" + d.getFullYear() + z(d.getMonth() + 1) + z(d.getDate()) + "-" + z(d.getHours()) + z(d.getMinutes()); }
  function paletteName() { return ($("pal-name").value || "").trim() || "我的配色"; }
  function download(blob, name) {
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
    a.setAttribute("data-google-vignette", "false");
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
  }

  $("pal-copy").addEventListener("click", function () {
    if (!palette.length) return;
    copy(palette.map(hex).join("\n") + "\n\n" + paletteName() + "｜照片配色色票產生器 " + URL_FULL, "已複製 " + palette.length + " 個色碼");
    track("export", { method: "copy_text", option: "all_colors", item_count: palette.length });
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
  $("pal-procreate").addEventListener("click", function () {
    if (!palette.length) return;
    var sw = palette.slice(0, 30).map(function (c) { var q = hsb(c); return { hue: +q.h.toFixed(5), saturation: +q.s.toFixed(5), brightness: +q.v.toFixed(5), alpha: 1, colorSpace: 0 }; });
    var json = JSON.stringify([{ name: paletteName(), swatches: sw }]);
    download(zipStore("Swatches.json", new TextEncoder().encode(json)), fileBase() + ".swatches");
    track("export", { method: "file", option: "procreate", item_count: sw.length });
    toast("已下載 Procreate 色票");
  });

  /* 色票卡圖片：照片＋色條＋色碼＋工具網址（core §3-2 匯出要附出處） */
  function cardBlob(cb) {
    var W = 1600, ih = Math.round(src.height * W / src.width), sh = 380, foot = 96;
    var c = document.createElement("canvas"); c.width = W; c.height = ih + sh + foot;
    var x = c.getContext("2d");
    x.fillStyle = "#ffffff"; x.fillRect(0, 0, c.width, c.height);
    x.drawImage(src, 0, 0, W, ih);
    var n = palette.length, bw = W / n;
    palette.forEach(function (p, i) {
      x.fillStyle = hex(p); x.fillRect(Math.floor(i * bw), ih, Math.ceil(bw) + 1, sh);
      x.save(); x.translate(i * bw + bw / 2, ih + sh - 28); x.rotate(-Math.PI / 2);
      x.fillStyle = textOn(p); x.font = "500 " + Math.round(Math.min(bw * 0.34, 34)) + "px \"IBM Plex Mono\", Menlo, monospace";
      x.textBaseline = "middle"; x.fillText(hex(p).slice(1), 0, 0); x.restore();
    });
    x.fillStyle = "#16120f"; x.font = "700 30px -apple-system, \"PingFang TC\", \"Noto Sans TC\", sans-serif"; x.textBaseline = "middle";
    x.fillText(paletteName(), 40, ih + sh + foot / 2);
    x.fillStyle = "#c8341e"; x.font = "500 26px \"IBM Plex Mono\", Menlo, monospace"; x.textAlign = "right";
    x.fillText(URL_SHORT, W - 40, ih + sh + foot / 2);
    c.toBlob(function (b) { cb(b); }, "image/png");
  }
  $("pal-png").addEventListener("click", function () {
    if (!palette.length) return;
    cardBlob(function (b) {
      if (!b) { toast("產生圖片失敗，請再試一次"); return; }
      download(b, fileBase() + ".png");
      track("export", { method: "image", option: "palette_card", item_count: palette.length });
      toast("已下載色票卡");
    });
  });
  $("pal-share").addEventListener("click", function () {
    if (!palette.length) return;
    cardBlob(function (b) {
      if (!b) return;
      var f = null, can = false;
      try { f = new File([b], fileBase() + ".png", { type: "image/png" }); } catch (e) {}
      if (f) { if (navigator.canShare) { try { can = navigator.canShare({ files: [f] }); } catch (e) {} } }
      if (!can) { $("pal-png").click(); toast("這個瀏覽器不能直接分享圖片，已改成下載"); return; }
      navigator.share({ files: [f], title: paletteName(), text: paletteName() + "｜照片配色色票產生器 " + URL_FULL })
        .then(function () { track("share", { method: "native", content_type: "result" }); })
        .catch(function (err) { if (err) { if (err.name === "AbortError") track("share_cancel", { method: "native", content_type: "result" }); } });
    });
  });

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
