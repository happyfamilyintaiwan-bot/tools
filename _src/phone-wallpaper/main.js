(function(){
'use strict';
try{
var ROOT=document.getElementById('pw-app');
if(!ROOT){if(window.console)console.warn('[phone-wallpaper] 找不到 #pw-app，工具未啟動');return}
var $=function(s){var el=ROOT.querySelector(s);if(!el)if(window.console)console.warn('[phone-wallpaper] 找不到元素',s);return el||document.createElement('span')};
var TOOL_URL=location.origin+location.pathname;

/* ▼ 動態文字（靜態文字在頁面 HTML，英日由 build 換好） */
var I18N={
zh:{
"devAuto":"這支手機（{w}×{h}）","devOther":"其他尺寸",
"dim":"{w} × {h} px・PNG",
"palCustom":"自訂","symNone":"不放符號",
"tSaved":"已存好，到相簿把它設成桌布吧","tDownloaded":"已下載 {f}",
"tLink":"設定連結已複製，傳給朋友就能做出同一張","tCopyFail":"複製失敗",
"tOpened":"已套用朋友分享的設定","tBad":"這個連結的設定讀不到，先用預設值",
"tRand":"換了一組：{p}・{s}",
"imgText":"用「編織日和・手機桌布產生器」做的桌布，你也可以做一張：",
"setText":"我用這組設定做了手機桌布，點開就能做出同一張：",
"toolTitle":"編織日和・手機桌布產生器",
"toolText":"免費的手機桌布產生器：挑流行色和簡約符號，尺寸自動配合手機，沒有浮水印。",
"urlCopied":"網址已複製","toolCopied":"介紹文字與網址已複製","thanks":"謝謝！下次想換桌布就從桌面打開",
"imgAlt":"做好的桌布",
"date":"zh-TW",
"pal":{"mocha":"摩卡奶霜","butter":"奶油黃","sage":"鼠尾草綠","lavender":"薰衣草","dusty":"霧藍","sakura":"櫻花粉","peach":"蜜桃杏","matcha":"抹茶拿鐵","greige":"燕麥灰","cherry":"櫻桃紅","midnight":"午夜藍","charcoal":"石墨黑"},
"sym":{"moon":"月亮","star":"星星","sparkle":"閃光","heart":"愛心","cloud":"雲","sun":"太陽","flower":"花","leaf":"葉子","clover":"幸運草","drop":"水滴","wave":"波浪","mountain":"山","arch":"拱窗","circle":"圓","ring":"圓圈","triangle":"三角形","plus":"十字","yarn":"毛線球","cat":"貓","note":"音符"}
},
en:{
"devAuto":"This phone ({w}×{h})","devOther":"Other sizes",
"dim":"{w} × {h} px · PNG",
"palCustom":"Custom","symNone":"No symbol",
"tSaved":"Saved. Now set it as your wallpaper from your photos","tDownloaded":"Downloaded {f}",
"tLink":"Link copied. Send it to a friend to make the same wallpaper","tCopyFail":"Couldn't copy",
"tOpened":"Loaded your friend's settings","tBad":"Couldn't read this link, so we started fresh",
"tRand":"New mix: {p} · {s}",
"imgText":"Made with the Phone Wallpaper Maker by Knitting Hiyori. Make your own:",
"setText":"Here are the settings for my phone wallpaper. Open the link to make the same one:",
"toolTitle":"Phone Wallpaper Maker by Knitting Hiyori",
"toolText":"A free phone wallpaper maker: trending colors and simple symbols, sized for your phone, no watermark.",
"urlCopied":"Link copied","toolCopied":"Text and link copied","thanks":"Thanks! Open it from your home screen next time",
"imgAlt":"Your wallpaper",
"date":"en-US",
"pal":{"mocha":"Mocha","butter":"Butter","sage":"Sage","lavender":"Lavender","dusty":"Dusty blue","sakura":"Sakura","peach":"Peach","matcha":"Matcha","greige":"Oat","cherry":"Cherry","midnight":"Midnight","charcoal":"Charcoal"},
"sym":{"moon":"Moon","star":"Star","sparkle":"Sparkle","heart":"Heart","cloud":"Cloud","sun":"Sun","flower":"Flower","leaf":"Leaf","clover":"Clover","drop":"Drop","wave":"Waves","mountain":"Mountain","arch":"Arch","circle":"Circle","ring":"Ring","triangle":"Triangle","plus":"Cross","yarn":"Yarn ball","cat":"Cat","note":"Music note"}
},
ja:{
"devAuto":"このスマホ（{w}×{h}）","devOther":"その他のサイズ",
"dim":"{w} × {h} px・PNG",
"palCustom":"カスタム","symNone":"記号なし",
"tSaved":"保存しました。写真アプリから壁紙に設定してください","tDownloaded":"{f} をダウンロードしました",
"tLink":"リンクをコピーしました。友だちに送ると同じ壁紙を作れます","tCopyFail":"コピーできませんでした",
"tOpened":"友だちの設定を読み込みました","tBad":"リンクの設定を読み込めなかったので、初期設定で表示しています",
"tRand":"おまかせ：{p}・{s}",
"imgText":"編織日和の「スマホ壁紙メーカー」で作った壁紙です。あなたも作ってみて：",
"setText":"この設定でスマホの壁紙を作りました。リンクを開くと同じ壁紙が作れます：",
"toolTitle":"編織日和・スマホ壁紙メーカー",
"toolText":"無料のスマホ壁紙メーカー。流行色とシンプルな記号で、機種にぴったりの壁紙を。透かしなし。",
"urlCopied":"URLをコピーしました","toolCopied":"紹介文とURLをコピーしました","thanks":"ありがとう！次はホーム画面から開いてください",
"imgAlt":"作成した壁紙",
"date":"ja-JP",
"pal":{"mocha":"モカ","butter":"バター","sage":"セージ","lavender":"ラベンダー","dusty":"くすみ青","sakura":"さくら","peach":"ピーチ","matcha":"抹茶","greige":"オーツ","cherry":"チェリー","midnight":"ミッドナイト","charcoal":"チャコール"},
"sym":{"moon":"月","star":"星","sparkle":"きらめき","heart":"ハート","cloud":"雲","sun":"太陽","flower":"花","leaf":"葉","clover":"クローバー","drop":"しずく","wave":"波","mountain":"山","arch":"アーチ","circle":"丸","ring":"リング","triangle":"三角","plus":"十字","yarn":"毛糸玉","cat":"ねこ","note":"音符"}
}
};
var LANG=['zh','en','ja'].indexOf(window.TS_PAGE_LANG)>=0?window.TS_PAGE_LANG:'zh';
function t(k,v){var s=I18N[LANG][k];if(s===undefined)s=I18N.zh[k];if(s===undefined)s=k;if(v)Object.keys(v).forEach(function(x){s=String(s).split('{'+x+'}').join(v[x])});return s}

/* ===== 編織日和工具｜GA4 統一追蹤 v1.2 =====
   各工具完全相同，只改最上面三行。規範：tools-ga4-guideline */
var HY_TOOL_ID = 'phone_wallpaper';    /* 工具登記表的 tool_id */
var HY_TOOL_ROOT = '#pw-app';  /* 工具最外層的選擇器 */
var HY_TOOL_LANG = function(){ return LANG; };

(function(){
  var LANG_MAP = { zh:'zh-Hant', 'zh-Hant':'zh-Hant', en:'en', ja:'ja' };
  var DEBUG = /[?\x26]hy_debug=1/.test(location.search);
  var sent = {}, startAt = 0;
  function lang(){ try { return LANG_MAP[HY_TOOL_LANG()] || 'zh-Hant'; } catch(e){ return 'zh-Hant'; } }
  function send(name, params){
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
      p.tool_id = HY_TOOL_ID;
      p.page_lang = lang();
      p.content_group = 'tool';
      if (DEBUG) { p.debug_mode = true; if (window.console) console.log('[hy-tool]', name, p); }
      if (typeof window.gtag === 'function') { window.gtag('event', name, p); return; }
      window.dataLayer = window.dataLayer || [];
      (function(){ window.dataLayer.push(arguments); })('event', name, p);
    } catch(e) {}
  }
  var api = window.hyTool = {
    event: send,
    once: function(name, params){ if (sent[name]) return; sent[name] = 1; send(name, params); },
    start: function(entry){
      if (sent.tool_start) return;
      startAt = Date.now();
      api.once('tool_start', { entry_point: entry || 'direct' });
    },
    result: function(params){
      if (!sent.tool_start || sent.tool_result) return;
      params = params || {};
      params.duration_sec = Math.round((Date.now() - startAt) / 1000);
      api.once('tool_result', params);
    },
    share: function(method, type, extra){
      var p = {}, k; extra = extra || {};
      for (k in extra) p[k] = extra[k];
      p.method = method; p.content_type = type;
      send('share', p);
    },
    ctaExtra: null
  };
  function inRoot(t){ if (!t || !t.closest) return null; return t.closest(HY_TOOL_ROOT); }
  function autoStart(e){
    if (sent.tool_start) return;
    var t = e.target;
    if (!inRoot(t)) return;
    if (t.closest('[data-cta]')) return;
    api.start('direct');
  }
  document.addEventListener('click', autoStart, true);
  document.addEventListener('input', autoStart, true);
  document.addEventListener('click', function(e){
    var t = e.target;
    if (!t || !t.closest) return;
    var a = t.closest('[data-cta]');
    if (!a) return;
    var p = {}, ex = {}, k;
    try { if (typeof api.ctaExtra === 'function') ex = api.ctaExtra(a) || {}; } catch(err) {}
    for (k in ex) p[k] = ex[k];
    p.cta_id = a.getAttribute('data-cta');
    p.cta_type = a.getAttribute('data-cta-type') || 'other';
    p.link_url = a.href || '';
    send('cta_click', p);
  }, true);
})();
/* ===== /GA4 統一追蹤 ===== */
var ga=hyTool.event;

/* ---------- 手機尺寸（直式像素） ---------- */
var DEVS=[
  ['ip17pm','iPhone 17 Pro Max／16 Pro Max',1320,2868],
  ['ip17p','iPhone 17／17 Pro／16 Pro',1206,2622],
  ['ipair','iPhone Air',1260,2736],
  ['ip16pl','iPhone 16 Plus／15 Plus／15 Pro Max',1290,2796],
  ['ip16','iPhone 16／15／15 Pro／14 Pro',1179,2556],
  ['ip13','iPhone 12／13／14／16e',1170,2532],
  ['ipse','iPhone SE',750,1334],
  ['gs','Galaxy S24／S25',1080,2340],
  ['gsu','Galaxy S24 Ultra／S25 Ultra',1440,3120],
  ['px9','Pixel 9',1080,2424],
  ['px9p','Pixel 9 Pro',1280,2856],
  ['fhd','Android 1080 × 2400',1080,2400]
];
var TOUCH=!!(window.matchMedia&&matchMedia('(pointer:coarse)').matches);
/* 只有手機、平板才用「這支手機」的解析度；電腦預設 iPhone 16 */
var AUTO=(function(){
  if(!TOUCH)return null;
  var d=window.devicePixelRatio||1,w=Math.round(Math.min(screen.width,screen.height)*d),h=Math.round(Math.max(screen.width,screen.height)*d);
  if(!(w>=320&&h>=w&&h<=4000))return null;
  return [w,h];
})();
function devSize(id){
  if(id==='auto'&&AUTO)return AUTO;
  for(var i=0;i<DEVS.length;i++)if(DEVS[i][0]===id)return [DEVS[i][2],DEVS[i][3]];
  return [1179,2556];
}

/* ---------- 配色：底色上、底色下、符號與文字 ---------- */
var PALS=[
  ['mocha','#efe4da','#c4a189','#6b4a3a'],
  ['butter','#fff7d9','#f4dc8f','#b58324'],
  ['sage','#e4eadc','#aebda4','#56704f'],
  ['lavender','#ece7f6','#bdb0de','#64559e'],
  ['dusty','#e1e9f1','#a2b8cd','#46627e'],
  ['sakura','#fcebee','#f1b9c7','#b9506f'],
  ['peach','#ffe8db','#f7b896','#c45f3b'],
  ['matcha','#eaeed8','#b8c483','#5d6c31'],
  ['greige','#f2eee9','#d2c9bf','#776c62'],
  ['cherry','#9a2333','#5c1019','#f8d3d6'],
  ['midnight','#24304d','#0f1526','#ecdba8'],
  ['charcoal','#323234','#141415','#ddd6cc']
];
function palById(id){for(var i=0;i<PALS.length;i++)if(PALS[i][0]===id)return PALS[i];return PALS[0]}

/* ---------- 符號：24×24 座標，f＝填色、s＝線條、b＝用底色挖空、bs＝底色線條 ---------- */
function circ(x,y,r){return 'M'+(x-r)+' '+y+'a'+r+' '+r+' 0 1 0 '+(2*r)+' 0a'+r+' '+r+' 0 1 0 '+(-2*r)+' 0z'}
var petals=(function(){var s='',i,a;for(i=0;i<5;i++){a=-Math.PI/2+i*2*Math.PI/5;s+=circ(+(12+4.7*Math.cos(a)).toFixed(2),+(12+4.7*Math.sin(a)).toFixed(2),4.1)}return s})();
var SYMS={
  moon:[['f','M15.2 2.6A9.6 9.6 0 1 0 21.4 17 7.8 7.8 0 0 1 15.2 2.6z']],
  star:[['f','M12 2.2l2.95 6.15 6.75.8-4.98 4.66 1.32 6.69L12 17.2l-6.04 3.3 1.32-6.69L2.3 9.15l6.75-.8z']],
  sparkle:[['f','M12 1.6c.9 6.4 3.2 8.7 10.4 10.4-7.2 1.7-9.5 4-10.4 10.4-.9-6.4-3.2-8.7-10.4-10.4 7.2-1.7 9.5-4 10.4-10.4z']],
  heart:[['f','M12 21.2S2.4 15.4 2.4 8.9A5.1 5.1 0 0 1 12 6.4a5.1 5.1 0 0 1 9.6 2.5c0 6.5-9.6 12.3-9.6 12.3z']],
  cloud:[['f','M6.6 19a4.6 4.6 0 0 1-.7-9.15A6.3 6.3 0 0 1 17.9 8.6 5.2 5.2 0 0 1 17.6 19z']],
  sun:[['f',circ(12,12,4.8)],['s','M12 1.6v2.8M12 19.6v2.8M1.6 12h2.8M19.6 12h2.8M4.65 4.65l2 2M17.35 17.35l2 2M4.65 19.35l2-2M17.35 6.65l2-2']],
  flower:[['f',petals],['b',circ(12,12,2.6)]],
  leaf:[['f','M4.2 19.8C3.6 10.4 9.2 3.6 20.6 3.4c.4 11.2-6.2 17-16.4 16.4z'],['bs','M4.2 19.8 15 9']],
  clover:[['f',circ(8.6,8.6,3.9)+circ(15.4,8.6,3.9)+circ(8.6,15.2,3.9)+circ(15.4,15.2,3.9)],['s','M12 12.6c.4 4.4 2 7.4 4.6 9.6']],
  drop:[['f','M12 2.2S5 10.3 5 15.1a7 7 0 0 0 14 0C19 10.3 12 2.2 12 2.2z']],
  wave:[['s','M1.6 8.6c2.6-3 5.2-3 7.8 0s5.2 3 7.8 0 4.6-2.6 5.6-1.2M1.6 15.4c2.6-3 5.2-3 7.8 0s5.2 3 7.8 0 4.6-2.6 5.6-1.2']],
  mountain:[['f','M1.2 20.2 8.6 7.6l4.3 6.5 2.9-4 7 10.1z']],
  arch:[['f','M5 21.6V10.4a7 7 0 0 1 14 0v11.2z']],
  circle:[['f',circ(12,12,9)]],
  ring:[['s',circ(12,12,8.2)]],
  triangle:[['f','M12 3 21.6 20.2H2.4z']],
  plus:[['s','M12 3.4v17.2M3.4 12h17.2']],
  yarn:[['f',circ(11.2,11.2,8.4)],['bs','M4.6 7.4c4.4.6 9.2 4.4 11.2 11M3.2 12.4c3.8-.2 8 2.4 9.4 7.2M9.6 3.2c3.8 2 6.8 6.6 7.8 12.2'],['s','M18.2 17.8c1.4 1.8 2.8 2.5 4.2 1.9']],
  cat:[['f','M3.6 20.6c0-4.4.3-8.2 1-11.2L5.2 3.2 10 7.2h4l4.8-4 .6 6.2c.7 3 1 6.8 1 11.2z'],['b',circ(9,13.6,1.2)+circ(15,13.6,1.2)]],
  note:[['f','M9.4 17.6a3.2 3.2 0 1 1-2-2.95V5.2l12-2.4v12.1a3.2 3.2 0 1 1-2-2.95V6.9l-8 1.6z']]
};
var SYM_IDS=Object.keys(SYMS);
var P2D={};
function parts(id){
  if(!P2D[id])P2D[id]=(SYMS[id]||[]).map(function(p){return [p[0],new Path2D(p[1])]});
  return P2D[id];
}
/* 在 (x,y) 畫一個寬 size 的符號 */
function drawSym(ctx,id,x,y,size,rot,fg,bg){
  var ps=parts(id);if(!ps.length)return;
  var k=size/24;
  ctx.save();ctx.translate(x,y);if(rot)ctx.rotate(rot);ctx.scale(k,k);ctx.translate(-12,-12);
  ctx.lineCap='round';ctx.lineJoin='round';
  ps.forEach(function(p){
    var m=p[0];
    if(m==='f'||m==='b'){ctx.fillStyle=m==='f'?fg:bg;ctx.fill(p[1])}
    else{ctx.strokeStyle=m==='s'?fg:bg;ctx.lineWidth=m==='s'?2.2:1.4;ctx.stroke(p[1])}
  });
  ctx.restore();
}
function symSvg(id){
  return '<svg viewBox="0 0 24 24" aria-hidden="true">'+(SYMS[id]||[]).map(function(p){
    var m=p[0];
    if(m==='f')return '<path d="'+p[1]+'" fill="currentColor"/>';
    if(m==='s')return '<path d="'+p[1]+'" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>';
    if(m==='b')return '<path d="'+p[1]+'" fill="var(--sbg,#fff)"/>';
    return '<path d="'+p[1]+'" fill="none" stroke="var(--sbg,#fff)" stroke-width="1.4" stroke-linecap="round"/>';
  }).join('')+'</svg>';
}

/* ---------- 亂數（同一個 seed 每次畫一樣，預覽和原尺寸才會一致） ---------- */
function rng(seed){var a=seed>>>0;return function(){a=(a+0x6D2B79F5)>>>0;var t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}

/* ---------- 顏色小工具 ---------- */
function hex2rgb(h){h=String(h).replace('#','');if(h.length===3)h=h.replace(/(.)/g,'$1$1');var n=parseInt(h,16);return [(n>>16)&255,(n>>8)&255,n&255]}
function rgb2hex(c){return '#'+c.map(function(v){v=Math.max(0,Math.min(255,Math.round(v)));return (v<16?'0':'')+v.toString(16)}).join('')}
function mix(a,b,p){var x=hex2rgb(a),y=hex2rgb(b);return rgb2hex([0,1,2].map(function(i){return x[i]+(y[i]-x[i])*p}))}
function lum(h){var c=hex2rgb(h).map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]}
function isHex(s){return /^#[0-9a-f]{6}$/i.test(String(s))}

/* ---------- 狀態 ---------- */
var DEF={dev:'auto',pal:'mocha',cbg:'',cfg:'',grad:1,sym:'moon',lay:'single',size:50,dens:50,seed:20261019,txt:'',font:'sans',tpos:'bot'};
var S={},KEY='pw-wall-v1';
function setS(o){S={};Object.keys(DEF).forEach(function(k){S[k]=(o&&o[k]!==undefined)?o[k]:DEF[k]})}
function clean(){
  if(S.dev!=='auto'&&!DEVS.some(function(d){return d[0]===S.dev}))S.dev='auto';
  if(S.dev==='auto'&&!AUTO)S.dev='ip16';
  if(S.pal!=='custom'&&!PALS.some(function(p){return p[0]===S.pal}))S.pal='mocha';
  if(S.pal==='custom'&&!(isHex(S.cbg)&&isHex(S.cfg)))S.pal='mocha';
  if(S.sym!=='none'&&!SYMS[S.sym])S.sym='moon';
  if(['single','pattern','scatter','corner'].indexOf(S.lay)<0)S.lay='single';
  S.size=Math.max(0,Math.min(100,+S.size||0));S.dens=Math.max(0,Math.min(100,+S.dens||0));
  S.seed=(+S.seed>>>0)||1;S.grad=S.grad?1:0;
  S.txt=String(S.txt||'').slice(0,24);
  if(S.font!=='serif')S.font='sans';
  if(['top','mid','bot'].indexOf(S.tpos)<0)S.tpos='bot';
}
function colors(){
  var bg1,bg2,fg;
  if(S.pal==='custom'){bg1=S.cbg;fg=S.cfg;bg2=lum(bg1)>.4?mix(bg1,'#000000',.2):mix(bg1,'#000000',.45)}
  else{var p=palById(S.pal);bg1=p[1];bg2=p[2];fg=p[3]}
  return {bg1:bg1,bg2:bg2,fg:fg};
}

/* ---------- 畫桌布：所有尺寸都用寬度 W 的比例，預覽和原圖畫出來一樣 ---------- */
var FONTS={sans:'-apple-system,BlinkMacSystemFont,"PingFang TC","Hiragino Sans","Noto Sans CJK TC","Noto Sans TC","Microsoft JhengHei",sans-serif',
  serif:'"Songti TC","Hiragino Mincho ProN","Noto Serif CJK TC","Noto Serif TC","Yu Mincho",serif'};
function textY(H){return S.tpos==='top'?H*.36:(S.tpos==='mid'?H*.52:H*.8)}
function draw(cv,W,H){
  var ctx=cv.getContext('2d'),C=colors(),R=rng(S.seed),s=S.size/100,d=S.dens/100,i;
  /* 底色 */
  if(S.grad||S.lay==='corner'){var g=ctx.createLinearGradient(0,0,W*.35,H);g.addColorStop(0,C.bg1);g.addColorStop(1,C.bg2);ctx.fillStyle=g}
  else ctx.fillStyle=C.bg1;
  ctx.fillRect(0,0,W,H);
  var sym=S.sym!=='none'?S.sym:null,bgAt=function(y){return (S.grad||S.lay==='corner')?mix(C.bg1,C.bg2,Math.max(0,Math.min(1,y/H))):C.bg1};
  if(sym){
    if(S.lay==='single'){
      var sz=W*(.22+s*.5),y=S.txt&&S.tpos!=='bot'?H*.68:H*.6;
      if(S.txt&&S.tpos==='bot')y=H*.56;
      drawSym(ctx,sym,W/2,y,sz,0,C.fg,bgAt(y));
    }else if(S.lay==='pattern'){
      var cell=W*(.3-d*.2),ps=cell*(.28+s*.5),rows=Math.ceil(H/cell)+2,cols=Math.ceil(W/cell)+2,r,c;
      ctx.globalAlpha=.9;
      for(r=-1;r<rows;r++)for(c=-1;c<cols;c++){
        var px=c*cell+(r%2?cell/2:0)+cell/4,py=r*cell+cell/3;
        drawSym(ctx,sym,px,py,ps,0,C.fg,bgAt(py));
      }
      ctx.globalAlpha=1;
    }else if(S.lay==='scatter'){
      var n=Math.round(5+d*22),base=W*(.07+s*.16),pts=[],tries=0;
      while(pts.length<n&&tries<n*40){
        tries++;
        var k=.55+R()*.9,q={x:W*(.04+R()*.92),y:H*(.03+R()*.94),z:base*k,r:(R()-.5)*.7,a:.55+R()*.45};
        if(pts.some(function(p){var dx=p.x-q.x,dy=p.y-q.y;return Math.sqrt(dx*dx+dy*dy)<(p.z+q.z)*.62}))continue;
        pts.push(q);
      }
      pts.forEach(function(p){ctx.globalAlpha=p.a;drawSym(ctx,sym,p.x,p.y,p.z,p.r,C.fg,bgAt(p.y))});
      ctx.globalAlpha=1;
    }else{
      /* 漸層＋小符號：一個柔光圓，右下一個小符號 */
      var rg=ctx.createRadialGradient(W*.3,H*.3,0,W*.3,H*.3,W*.9);
      rg.addColorStop(0,'rgba(255,255,255,.28)');rg.addColorStop(1,'rgba(255,255,255,0)');
      ctx.fillStyle=rg;ctx.fillRect(0,0,W,H);
      var cy=H*.7;drawSym(ctx,sym,W*.76,cy,W*(.08+s*.14),0,C.fg,bgAt(cy));
    }
  }
  /* 短字 */
  var tx=S.txt.trim();
  if(tx){
    var fs=W*.074,ty=textY(H),font=FONTS[S.font],maxW=W*.82,lines=[tx];
    ctx.font='600 '+fs+'px '+font;
    if(ctx.measureText(tx).width>maxW){
      /* 太長：先試著拆成兩行，還放不下就縮小字 */
      var sp=tx.indexOf(' ')>0?tx.split(' '):null,best=null;
      if(sp&&sp.length>1){var h=Math.ceil(sp.length/2);best=[sp.slice(0,h).join(' '),sp.slice(h).join(' ')]}
      else{var m=Math.ceil(Array.from(tx).length/2),ch=Array.from(tx);best=[ch.slice(0,m).join(''),ch.slice(m).join('')]}
      lines=best;
      var wmax=Math.max(ctx.measureText(lines[0]).width,ctx.measureText(lines[1]).width);
      if(wmax>maxW){fs*=maxW/wmax;ctx.font='600 '+fs+'px '+font}
    }
    var lh=fs*1.35,y0=ty-(lines.length-1)*lh/2;
    ctx.textAlign='center';ctx.textBaseline='middle';
    if(sym&&(S.lay==='pattern'||S.lay==='scatter')){
      /* 圖紋上的字加一塊底，才看得清楚 */
      var bw=Math.max.apply(null,lines.map(function(l){return ctx.measureText(l).width}))+fs*1.6,bh=lines.length*lh+fs*.8;
      ctx.fillStyle=bgAt(ty);ctx.globalAlpha=.9;
      rrect(ctx,(W-bw)/2,ty-bh/2,bw,bh,bh/2>fs?fs:bh/2);ctx.fill();ctx.globalAlpha=1;
    }
    ctx.fillStyle=C.fg;
    lines.forEach(function(l,j){ctx.fillText(l,W/2,y0+j*lh)});
  }
}
function rrect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}

/* ---------- 畫面 ---------- */
var cv=$('#pw-cv'),pv=$('#pw-pv'),mini=$('#pw-mini');
function sizeNow(){return devSize(S.dev)}
function render(){
  var sz=sizeNow(),W=sz[0],H=sz[1],dpr=Math.min(window.devicePixelRatio||1,2);
  pv.style.setProperty('--ar',W+'/'+H);
  var cw=Math.round((pv.clientWidth||240)*dpr);if(cw<100)cw=480;
  cv.width=cw;cv.height=Math.round(cw*H/W);
  draw(cv,cv.width,cv.height);
  mini.width=72;mini.height=Math.round(72*H/W);draw(mini,mini.width,mini.height);
  $('#pw-dim').textContent=t('dim',{w:W,h:H});
  var C=colors();pv.style.setProperty('--cc',lum(C.bg1)>.45?'#16120f':'#ffffff');
  $('#pw-fab-v').textContent=palName()+'・'+symName();
  $('#pw-paln').textContent=palName();
  $('#pw-reseed').hidden=S.lay!=='scatter';
  $('#pw-densw').hidden=!(S.lay==='pattern'||S.lay==='scatter');
  syncUI();
  save();
}
function palName(){return S.pal==='custom'?t('palCustom'):I18N[LANG].pal[S.pal]}
function symName(){return S.sym==='none'?t('symNone'):I18N[LANG].sym[S.sym]}
function press(box,attr,val){[].forEach.call(box.querySelectorAll('['+attr+']'),function(b){b.setAttribute('aria-pressed',String(b.getAttribute(attr)===String(val)))})}
function syncUI(){
  $('#pw-dev').value=S.dev;
  press($('#pw-pals'),'data-pal',S.pal);
  press($('#pw-syms'),'data-sym',S.sym);
  press($('#pw-lays'),'data-lay',S.lay);
  press($('#pw-font'),'data-v',S.font);
  press($('#pw-tpos'),'data-v',S.tpos);
  $('#pw-grad').checked=!!S.grad;$('#pw-grad').disabled=S.lay==='corner';
  $('#pw-size').value=S.size;$('#pw-dens').value=S.dens;
  if(document.activeElement!==$('#pw-txt'))$('#pw-txt').value=S.txt;
  var C=colors();$('#pw-syms').style.setProperty('--sbg',C.bg1);
}
var saveT=0;
function save(){clearTimeout(saveT);saveT=setTimeout(function(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}},300)}

/* 選單內容 */
(function(){
  var sel=$('#pw-dev'),h='';
  if(AUTO)h+='<option value="auto">'+esc(t('devAuto',{w:AUTO[0],h:AUTO[1]}))+'</option>';
  h+=DEVS.map(function(d){return '<option value="'+d[0]+'">'+esc(d[1])+'（'+d[2]+'×'+d[3]+'）</option>'}).join('');
  sel.innerHTML=h;
  $('#pw-pals').innerHTML=PALS.map(function(p){return '<button type="button" data-pal="'+p[0]+'" aria-pressed="false"><span class="sw" style="background:linear-gradient(160deg,'+p[1]+','+p[2]+')"><i style="background:'+p[3]+'"></i></span><span>'+esc(I18N[LANG].pal[p[0]])+'</span></button>'}).join('');
  $('#pw-syms').innerHTML=SYM_IDS.map(function(id){return '<button type="button" data-sym="'+id+'" aria-pressed="false" aria-label="'+esc(I18N[LANG].sym[id])+'" title="'+esc(I18N[LANG].sym[id])+'">'+symSvg(id)+'</button>'}).join('')+
    '<button type="button" class="none" data-sym="none" aria-pressed="false">'+esc(t('symNone'))+'</button>';
  $('#pw-img').alt=t('imgAlt');
  try{$('#pw-clk-d').textContent=new Date().toLocaleDateString(t('date'),{month:'long',day:'numeric',weekday:'long'})}catch(e){}
})();
function esc(s){return String(s).replace(/[<>"']/g,function(c){return {'<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]}).replace(/&(?!lt;|gt;|quot;|#39;)/g,'&amp;')}

/* ---------- 操作 ---------- */
$('#pw-dev').addEventListener('change',function(){S.dev=this.value;render();ga('wall_device',{option:S.dev})});
$('#pw-pals').addEventListener('click',function(e){var b=e.target.closest('[data-pal]');if(!b)return;S.pal=b.dataset.pal;render()});
$('#pw-grad').addEventListener('change',function(){S.grad=this.checked?1:0;render()});
function custom(){S.pal='custom';S.cbg=$('#pw-cbg').value;S.cfg=$('#pw-cfg').value;render()}
$('#pw-cbg').addEventListener('input',custom);$('#pw-cfg').addEventListener('input',custom);
$('#pw-cust').addEventListener('toggle',function(){
  if(!this.open||S.pal==='custom')return;
  var C=colors();$('#pw-cbg').value=C.bg1;$('#pw-cfg').value=C.fg;
});
$('#pw-syms').addEventListener('click',function(e){var b=e.target.closest('[data-sym]');if(!b)return;S.sym=b.dataset.sym;render()});
$('#pw-lays').addEventListener('click',function(e){var b=e.target.closest('[data-lay]');if(!b)return;S.lay=b.dataset.lay;render()});
var rT=0;
function slide(){S.size=+$('#pw-size').value;S.dens=+$('#pw-dens').value;cancelAnimationFrame(rT);rT=requestAnimationFrame(render)}
$('#pw-size').addEventListener('input',slide);$('#pw-dens').addEventListener('input',slide);
$('#pw-reseed').addEventListener('click',function(){S.seed=(Math.random()*4294967295)>>>0;render()});
$('#pw-txt').addEventListener('input',function(){S.txt=this.value.slice(0,24);cancelAnimationFrame(rT);rT=requestAnimationFrame(render)});
$('#pw-font').addEventListener('click',function(e){var b=e.target.closest('[data-v]');if(!b)return;S.font=b.dataset.v;render()});
$('#pw-tpos').addEventListener('click',function(e){var b=e.target.closest('[data-v]');if(!b)return;S.tpos=b.dataset.v;render()});
$('#pw-clock').addEventListener('change',function(){pv.classList.toggle('noclk',!this.checked)});

function pick(a){return a[Math.floor(Math.random()*a.length)]}
function randomize(src){
  S.pal=pick(PALS)[0];S.sym=pick(SYM_IDS);S.lay=pick(['single','pattern','scatter','corner']);
  S.size=20+Math.round(Math.random()*60);S.dens=20+Math.round(Math.random()*60);S.grad=Math.random()<.7?1:0;
  S.seed=(Math.random()*4294967295)>>>0;
  render();toast(t('tRand',{p:palName(),s:symName()}));
  ga('wall_random',{option:S.lay,source:src});
}
$('#pw-rand').addEventListener('click',function(){randomize('preview')});
$('#pw-fab-rand').addEventListener('click',function(){randomize('fab')});
$('#pw-fab-pv').addEventListener('click',function(){$('#pw-pvc').scrollIntoView({behavior:'smooth',block:'start'})});

/* ---------- 存圖 ---------- */
var busy=false;
function makeBlob(){
  var sz=sizeNow(),c=document.createElement('canvas');c.width=sz[0];c.height=sz[1];
  draw(c,sz[0],sz[1]);
  return new Promise(function(res){c.toBlob(function(b){res(b)},'image/png')});
}
function fileName(){var sz=sizeNow();return 'knittinghiyori-wallpaper-'+sz[0]+'x'+sz[1]+'.png'}
/* 每次存圖送 export（core §3-2，method=image）；第一次另外算 tool_result */
function track(how){
  hyTool.result({option:S.lay,source:S.pal});
  ga('export',{method:'image',option:S.lay,source:S.pal,result:how});
}
async function saveImg(){
  if(busy)return;busy=true;
  try{
    hyTool.start('direct');
    var blob=await makeBlob();if(!blob)throw new Error('blob');
    var name=fileName(),file=null;
    try{file=new File([blob],name,{type:'image/png'})}catch(e){}
    if(TOUCH&&file&&navigator.canShare&&navigator.canShare({files:[file]})){
      try{await navigator.share({files:[file],title:t('toolTitle'),text:t('imgText')+' '+TOOL_URL});track('share');toast(t('tSaved'));return}
      catch(e){if(e&&e.name==='AbortError'){ga('share_cancel',{method:'native',content_type:'result'});return}}
    }
    var url=URL.createObjectURL(blob);
    if(TOUCH){
      /* 手機不能直接分享檔案時：顯示圖片讓讀者長按存 */
      $('#pw-img').src=url;openDlg($('#pw-idlg'));track('long_press');return;
    }
    var a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
    setTimeout(function(){URL.revokeObjectURL(url)},4000);
    track('download');toast(t('tDownloaded',{f:name}));
  }catch(e){if(window.console)console.warn('[phone-wallpaper] 存圖失敗',e)}
  finally{busy=false}
}
$('#pw-save').addEventListener('click',saveImg);$('#pw-fab-save').addEventListener('click',saveImg);
function openDlg(d){if(d.showModal){try{d.showModal();return}catch(e){}}d.setAttribute('open','')}
function closeDlg(d){if(d.close)d.close();else d.removeAttribute('open')}
$('#pw-iclose').addEventListener('click',function(){closeDlg($('#pw-idlg'))});
$('#pw-idlg').addEventListener('click',function(e){if(e.target===this)closeDlg(this)});

/* ---------- 分享設定連結（# 後面帶設定，朋友打開看到同一張） ---------- */
function b64e(s){return btoa(unescape(encodeURIComponent(s))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function b64d(s){s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return decodeURIComponent(escape(atob(s)))}
/* 手機型號不放進連結：朋友的手機尺寸不一定一樣 */
function setLink(){var o={};Object.keys(DEF).forEach(function(k){if(k!=='dev'&&S[k]!==DEF[k])o[k]=S[k]});return TOOL_URL+'#w='+b64e(JSON.stringify(o))}
async function copy(s){try{await navigator.clipboard.writeText(s);return true}catch(e){
  var ta=document.createElement('textarea');ta.value=s;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();
  var ok=false;try{ok=document.execCommand('copy')}catch(x){}ta.remove();return ok}}
$('#pw-shareset').addEventListener('click',async function(){
  var url=setLink(),info={option:S.lay,source:S.pal};
  if(navigator.share&&TOUCH){try{await navigator.share({title:t('toolTitle'),text:t('setText'),url:url});hyTool.share('native','result',info);return}catch(e){if(e&&e.name==='AbortError'){info.method='native';info.content_type='result';ga('share_cancel',info);return}}}
  var ok=await copy(t('setText')+' '+url);toast(ok?t('tLink'):t('tCopyFail'));hyTool.share('copy_text','result',info);
});

/* ---------- 收藏＆分享工具 ---------- */
var tabs=ROOT.querySelectorAll('[data-os]');
function showOs(os){[].forEach.call(tabs,function(b){b.setAttribute('aria-selected',String(b.dataset.os===os))});[].forEach.call(ROOT.querySelectorAll('[data-panel]'),function(p){p.hidden=p.dataset.panel!==os})}
[].forEach.call(tabs,function(b){b.addEventListener('click',function(){showOs(b.dataset.os)})});
(function(){var u=navigator.userAgent;showOs(/iPhone|iPad|iPod/.test(u)?(/CriOS/.test(u)?'ioschrome':'ios'):(/Android/.test(u)?'android':'pc'))})();
var seen=false;
if('IntersectionObserver' in window){new IntersectionObserver(function(es,ob){es.forEach(function(e){if(e.isIntersecting)if(!seen){seen=true;ga('install_view');ob.disconnect()}})},{threshold:.3}).observe($('#pw-install'))}
ROOT.addEventListener('click',function(e){if(e.target.closest('a[href="#pw-install"]'))ga('install_jump')});
$('#pw-installed').addEventListener('click',function(){ga('install_done',{option:(ROOT.querySelector('[data-os][aria-selected="true"]')||{dataset:{}}).dataset.os});toast(t('thanks'))});
var deferred=null;
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferred=e;$('#pw-pwa').hidden=false;ga('pwa_available')});
$('#pw-pwa').addEventListener('click',function(){if(!deferred)return;deferred.prompt();deferred.userChoice.then(function(c){ga('pwa_prompt',{result:c.outcome});deferred=null;$('#pw-pwa').hidden=true})});
window.addEventListener('appinstalled',function(){ga('pwa_installed')});
$('#pw-tline').href='https://social-plugins.line.me/lineit/share?url='+encodeURIComponent(TOOL_URL);
$('#pw-tline').addEventListener('click',function(){hyTool.share('line','tool')});
$('#pw-tcopy').addEventListener('click',function(){copy(TOOL_URL).then(function(ok){toast(ok?t('urlCopied'):t('tCopyFail'))});hyTool.share('copy_link','tool')});
$('#pw-tshare').addEventListener('click',function(){var tx=t('toolTitle')+'：'+t('toolText');
  if(navigator.share){navigator.share({title:t('toolTitle'),text:tx,url:TOOL_URL}).then(function(){hyTool.share('native','tool')}).catch(function(){ga('share_cancel',{method:'native',content_type:'tool'})});return}
  hyTool.share('copy_text','tool');copy(tx+' '+TOOL_URL).then(function(ok){toast(ok?t('toolCopied'):t('tCopyFail'))})});

var tT=0;
function toast(s){var el=$('#pw-toast');el.textContent=s;el.classList.add('on');clearTimeout(tT);tT=setTimeout(function(){el.classList.remove('on')},2600)}

/* ---------- 啟動 ---------- */
var saved=null;try{saved=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
setS(saved);
var m=location.hash.match(/[#&]w=([\w-]*)/);
if(m){
  var inc=null;try{inc=JSON.parse(b64d(m[1])||'{}')}catch(e){}
  if(history.replaceState)history.replaceState(null,'',TOOL_URL+location.search);
  if(inc&&typeof inc==='object'){var keepDev=S.dev;setS(inc);S.dev=keepDev;hyTool.start('shared');ga('open_shared',{option:S.lay,source:S.pal});setTimeout(function(){toast(t('tOpened'))},400)}
  else{setS(saved);setTimeout(function(){toast(t('tBad'))},400)}
}
clean();
render();
window.addEventListener('resize',function(){cancelAnimationFrame(rT);rT=requestAnimationFrame(render)});
}catch(err){if(window.console)console.error('[phone-wallpaper]',err)}
})();
