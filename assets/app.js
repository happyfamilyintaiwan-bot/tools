/* ===== tools.knittinghiyori.com 工具總覽頁 =====
   GA4：工具統一追蹤 v1.2（tool_id=hub、content_group=tool），與遊戲規範 v1.0 同一套參數字典
   寫法：全檔不含「和號」字元、註解只用區塊註解，日後搬進 WordPress 或共用元件時不用改 */
(function () {
  var H = window.HUB || {}, L = H.lang || 'zh-Hant', S = H.t || {}, T = H.tools || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var DEBUG = /[?\x26]hy_debug=1/.test(location.search);
  var RM = false;
  try { RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  /* ---------- GA4 ---------- */
  function track(name, params) {
    try {
      var p = {}, k, v;
      params = params || {};
      for (k in params) {
        v = params[k];
        if (v === undefined || v === null || v === '') continue;
        if (typeof v === 'boolean') v = v ? 'yes' : 'no';
        if (typeof v === 'string') v = v.slice(0, 100);
        p[k] = v;
      }
      p.tool_id = 'hub'; p.page_lang = L; p.content_group = 'tool';
      if (DEBUG) { p.debug_mode = true; if (window.console) console.log('[hy-tool]', name, p); }
      if (typeof window.gtag === 'function') { window.gtag('event', name, p); return; }
      window.dataLayer = window.dataLayer || [];
      (function () { window.dataLayer.push(arguments); })('event', name, p);
    } catch (e) {}
  }
  function get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function svg(inner) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + inner + '</svg>'; }
  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function guard(fn) { try { fn(); } catch (err) { if (DEBUG) if (window.console) console.error(err); } }

  /* ---------- 進場動畫 ---------- */
  guard(function () {
    requestAnimationFrame(function () { $('.hero').classList.add('ready'); });
    var els = $$('.reveal');
    if (RM || !('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  });

  /* ---------- 數字跳動 ---------- */
  guard(function () {
    if (RM) return;
    $$('[data-count]').forEach(function (el) {
      var to = +el.dataset.count; if (!to) return;
      var t0 = 0; el.textContent = '0';
      setTimeout(function () {
        requestAnimationFrame(function f(now) {
          if (!t0) t0 = now;
          var k = Math.min(1, (now - t0) / 1100);
          el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
          if (k < 1) requestAnimationFrame(f);
        });
      }, 450);
    });
  });

  /* ---------- 頁首、搜尋列黏住時加細線 ---------- */
  guard(function () {
    var top = $('.top'), ctr = $('#controls');
    function onScroll() {
      top.classList.toggle('stuck', scrollY > 8);
      if (ctr) ctr.classList.toggle('stuck', ctr.getBoundingClientRect().top <= 61);
    }
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
  });

  /* ---------- 篩選與搜尋 ---------- */
  guard(function () {
    var rows = $$('#all .row'), cat = 'all', q = '', box = $('#q'), timer, ind = $('.ind');
    function norm(s) { return (s || '').toLowerCase().replace(/\s+/g, ''); }
    function match(r, nq) {
      if (cat !== 'all') if ((' ' + r.dataset.cats + ' ').indexOf(' ' + cat + ' ') < 0) return false;
      if (nq) if (norm(r.dataset.q).indexOf(nq) < 0) return false;
      return true;
    }
    function apply() {
      var n = 0, nq = norm(q);
      rows.forEach(function (r) { var ok = match(r, nq); r.hidden = !ok; if (ok) n++; });
      $('#empty').hidden = n > 0;
      $('#count').textContent = n;
      return n;
    }
    function animate(fn) {
      if (document.startViewTransition) if (!RM) { document.startViewTransition(fn); return; }
      fn();
    }
    function cur() { return $('.tab[aria-pressed="true"]'); }
    function moveInd(b) {
      if (!ind || !b) return;
      var first = b === b.parentNode.firstElementChild;
      ind.style.width = b.offsetWidth - (first ? 12 : 24) + 'px';
      ind.style.transform = 'translateX(' + (b.offsetLeft + (first ? 0 : 12)) + 'px)';
    }
    function pick(c) {
      cat = c;
      $$('.tab').forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.cat === c); });
      moveInd(cur());
    }
    $$('.tab').forEach(function (b) {
      b.addEventListener('click', function () {
        pick(b.dataset.cat);
        b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: RM ? 'auto' : 'smooth' });
        animate(apply);
        /* 和遊戲主頁一致：點「全部」不送 */
        if (cat !== 'all') track('hub_filter', { option: cat, source: 'category' });
      });
    });
    moveInd(cur());
    addEventListener('resize', function () { moveInd(cur()); });
    if (document.fonts) document.fonts.ready.then(function () { moveInd(cur()); });

    /* 搜尋：不送讀者輸入的文字，只送找到幾個 */
    box.addEventListener('input', function () {
      q = box.value.trim(); var n = apply();
      clearTimeout(timer);
      if (q) timer = setTimeout(function () { track('hub_search', { item_count: n, result: n ? 'hit' : 'miss' }); }, 1200);
    });
    $('#clear').addEventListener('click', function () { box.value = ''; q = ''; pick('all'); apply(); box.focus(); });
    document.addEventListener('keydown', function (e) {
      if (e.key !== '/') return;
      var a = document.activeElement || {};
      if (a === box || /input|textarea/i.test(a.tagName || '')) return;
      e.preventDefault(); box.focus(); box.scrollIntoView({ block: 'center', behavior: RM ? 'auto' : 'smooth' });
    });
  });

  /* ---------- 最近用過 ---------- */
  var RK = 'kh-tools-recent';
  function remember(id) {
    var ids = (get(RK) || []).filter(function (x) { return x !== id; });
    ids.unshift(id); set(RK, ids.slice(0, 8));
  }
  guard(function () {
    var ids = (get(RK) || []).filter(function (id) { return T[id]; }).slice(0, 5);
    $('#recent-list').innerHTML = ids.map(function (id) {
      return '<a data-google-vignette="false" href="' + esc(T[id].u) + '" data-rid="' + id + '">' + svg(T[id].i) + esc(T[id].n) + '</a>';
    }).join('');
    $('#recent').hidden = !ids.length;
  });

  /* ---------- 點擊追蹤 ---------- */
  guard(function () {
    function cardIndex(el, sel) {
      var list = $$(sel).filter(function (x) { return !x.hidden; });
      return list.indexOf(el) + 1;
    }
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a') : null;
      if (!a) return;
      var row = a.closest('.row'), ft = a.closest('.feat'), rid = a.dataset.rid;
      if (row || ft || rid) {
        var id = row ? row.dataset.id : ft ? ft.dataset.id : rid;
        var idx = row ? cardIndex(row, '#all .row') : ft ? cardIndex(ft, '.feat') : cardIndex(a, '#recent-list a');
        track('cta_click', { cta_id: row ? 'hub_card' : ft ? 'hub_feature' : 'hub_recent', cta_type: 'tool', option: id, card_index: idx, link_url: a.href });
        remember(id);
        return;
      }
      if (a.id === 'omi-go') {
        track('cta_click', { cta_id: 'hub_omikuji', cta_type: 'tool', option: a.dataset.id, link_url: a.href });
        remember(a.dataset.id);
        return;
      }
      if (a.dataset.cta) track('cta_click', { cta_id: a.dataset.cta, cta_type: a.dataset.ctaType || 'other', link_url: a.href });
      if (a.closest('.langs')) { set('kh-tools-lang', a.hreflang); track('lang_switch', { source: 'header', from_lang: L }); }
    });
  });

  /* ---------- 語言提示 ---------- */
  guard(function () {
    var tip = $('#langtip');
    if (!tip) return;
    if (get('kh-tools-lang')) return;
    var nav = (navigator.language || '').toLowerCase(), want = nav.indexOf('ja') === 0 ? 'ja' : nav.indexOf('en') === 0 ? 'en' : '';
    if (!want) return;
    var a = tip.querySelector('[data-to="' + want + '"]');
    if (!a) return;
    a.hidden = false; tip.hidden = false;
    a.addEventListener('click', function () { set('kh-tools-lang', want); track('lang_switch', { source: 'tip', from_lang: L }); });
    tip.querySelector('.x').addEventListener('click', function () { tip.hidden = true; set('kh-tools-lang', L); });
  });

  /* ---------- 今日の道具（おみくじ） ---------- */
  guard(function () {
    var dlg = $('#omi');
    if (!dlg || !dlg.showModal) { $$('[data-omi="open"]').forEach(function (b) { b.hidden = true; }); return; }
    var go = $('#omi-go'), again = $('#omi-again'), res = $('#omi-res'), sub = $('#omi-sub'), last = '';
    function draw(src) {
      dlg.classList.remove('done'); res.hidden = true; go.hidden = true; again.hidden = true;
      dlg.classList.add('shaking'); sub.textContent = S.shake;
      setTimeout(function () {
        var ids = Object.keys(T).filter(function (x) { return x !== last; });
        var id = ids[Math.floor(Math.random() * ids.length)], t = T[id];
        last = id;
        dlg.classList.remove('shaking'); dlg.classList.add('done'); sub.textContent = S.sub;
        $('#omi-luck').textContent = S.luck[Math.floor(Math.random() * S.luck.length)];
        $('#omi-card').innerHTML = svg(t.i) + '<div><b>' + esc(t.n) + '</b><span>' + esc(t.d) + '</span></div>';
        go.href = t.u; go.dataset.id = id; res.hidden = false; go.hidden = false; again.hidden = false;
        /* 運勢文字是中日文，不送；只送抽到哪個工具 */
        track('hub_omikuji', { option: id, source: src });
      }, RM ? 50 : 1100);
    }
    $$('[data-omi="open"]').forEach(function (b) { b.addEventListener('click', function () { dlg.showModal(); draw('hero'); }); });
    again.addEventListener('click', function () { draw('again'); });
    $('[data-omi="close"]').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  });

  /* ---------- 分享 ---------- */
  guard(function () {
    var url = location.origin + location.pathname, title = document.title, enc = encodeURIComponent;
    function toast(t) {
      var el = $('#toast'); el.textContent = t; el.classList.add('show');
      clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('show'); }, 1800);
    }
    function copy(text) {
      function fallback() {
        var t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); toast(S.copied); } catch (e) {}
        t.remove();
      }
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { toast(S.copied); }, fallback);
      else fallback();
    }
    var links = {
      line: 'https://social-plugins.line.me/lineit/share?url=' + enc(url),
      facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + enc(url),
      threads: 'https://www.threads.net/intent/post?text=' + enc(S.shareText + ' ' + url),
      x: 'https://twitter.com/intent/tweet?text=' + enc(S.shareText) + '\x26url=' + enc(url)
    };
    $$('[data-share]').forEach(function (b) {
      var m = b.dataset.share;
      if (links[m]) b.href = links[m];
      b.addEventListener('click', function (ev) {
        if (m === 'native') {
          ev.preventDefault();
          if (navigator.share) {
            navigator.share({ title: title, text: S.shareText, url: url }).then(
              function () { track('share', { method: 'native', content_type: 'tool' }); },
              function () { track('share_cancel', { method: 'native', content_type: 'tool' }); });
          } else { copy(url); track('share', { method: 'copy_link', content_type: 'tool' }); }
          return;
        }
        if (m === 'copy') { ev.preventDefault(); copy(url); track('share', { method: 'copy_link', content_type: 'tool' }); return; }
        track('share', { method: m, content_type: 'tool' });
      });
    });
  });
})();
/* ===== /tools 總覽頁 ===== */
