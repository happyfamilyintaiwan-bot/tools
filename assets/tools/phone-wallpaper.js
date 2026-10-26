(function(){
'use strict';
try{
var ROOT=document.getElementById('pw-app');
if(!ROOT){if(window.console)console.warn('[phone-wallpaper] 找不到 #pw-app，工具未啟動');return}
var $=function(s){var el=ROOT.querySelector(s);if(!el)if(window.console)console.warn('[phone-wallpaper] 找不到元素',s);return el||document.createElement('span')};
var TOOL_URL=location.origin+location.pathname;

/* ▼ 手寫字體：Google Fonts（OFL 授權，可商用）。只載入這四款 */
var FONT_CSS=new Promise(function(res){var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Sacramento&family=Allura&family=Homemade+Apple&family=Caveat:wght@500&family=Klee+One&family=LXGW+WenKai+TC&display=swap';l.onload=res;l.onerror=res;document.head.appendChild(l);setTimeout(res,4000)});

/* ▼ 預設鼓勵語（英文，三語介面共用） */
var PHRASES=['stay gold','you are enough','little by little','bloom where you are','one day at a time','be kind to yourself','good things take time',"you've got this",'today is a good day','breathe','love yourself','keep going','choose joy','slow down','you are doing great'];

/* ▼ 動態文字（靜態文字在頁面 HTML，英日由 build 換好） */
var I18N={
zh:{
"devAuto":"這支手機（{w}×{h}）",
"dim":"{w} × {h} px・PNG",
"tSaved":"已存好，到相簿把它設成桌布吧","tDownloaded":"已下載 {f}",
"tLink":"設定連結已複製，傳給朋友就能做出同一張","tCopyFail":"複製失敗",
"tOpened":"已套用朋友分享的設定","tBad":"這個連結的設定讀不到，先用預設值",
"tRand":"換了一組：{p}・{f}・{a}",
"imgText":"用「編織日和・手機桌布產生器」做的桌布，你也可以做一張：",
"setText":"我用這組設定做了手機桌布，點開就能做出同一張：",
"toolTitle":"編織日和・手機桌布產生器",
"toolText":"免費的手機桌布產生器：日系小花＋英文手寫字，尺寸自動配合手機，沒有浮水印。",
"urlCopied":"網址已複製","toolCopied":"介紹文字與網址已複製","thanks":"謝謝！下次想換桌布就從桌面打開",
"imgAlt":"做好的桌布","custom":"自訂","date":"zh-TW",
"pal":{"milk":"牛奶白","hai":"霧灰","oat":"燕麥","butter":"奶油黃","peach":"蜜桃","sakura":"櫻花粉","azuki":"豆沙","lilac":"香芋紫","fuji":"藤紫","sky":"霧藍","seiji":"青磁","sage":"鼠尾草"},
"fl":{"wild":"小野花","carnation":"康乃馨","magnolia":"玉蘭","daisy":"雛菊","lavender":"薰衣草","gyp":"滿天星","rose":"玫瑰","pingpong":"乒乓菊","sunflower":"向日葵","mix":"綜合"},
"ar":{"stem":"一枝","taped":"紙膠帶","tied":"手綁緞帶","wrapped":"包裝花束","pot":"小盆栽","branch":"斜枝","none":"只放字"},
"tone":{"auto":"自動搭配","peach":"蜜桃","pink":"櫻粉","butter":"奶油黃","white":"白色","lilac":"藤紫","coral":"珊瑚","lime":"淺綠","mixed":"混色"},
"font":{"sacramento":"細線","allura":"優雅","apple":"手寫筆跡","caveat":"隨性"}
},
en:{
"devAuto":"This phone ({w}×{h})",
"dim":"{w} × {h} px · PNG",
"tSaved":"Saved. Now set it as your wallpaper from your photos","tDownloaded":"Downloaded {f}",
"tLink":"Link copied. Send it to a friend to make the same wallpaper","tCopyFail":"Couldn't copy",
"tOpened":"Loaded your friend's settings","tBad":"Couldn't read this link, so we started fresh",
"tRand":"New mix: {p} · {f} · {a}",
"imgText":"Made with the Phone Wallpaper Maker by Knitting Hiyori. Make your own:",
"setText":"Here are the settings for my phone wallpaper. Open the link to make the same one:",
"toolTitle":"Phone Wallpaper Maker by Knitting Hiyori",
"toolText":"A free phone wallpaper maker: little flowers in soft colors and handwritten words, sized for your phone, no watermark.",
"urlCopied":"Link copied","toolCopied":"Text and link copied","thanks":"Thanks! Open it from your home screen next time",
"imgAlt":"Your wallpaper","custom":"Custom","date":"en-US",
"pal":{"milk":"Milk","hai":"Mist","oat":"Oat","butter":"Butter","peach":"Peach","sakura":"Sakura","azuki":"Rose taupe","lilac":"Lilac","fuji":"Wisteria","sky":"Sky","seiji":"Celadon","sage":"Sage"},
"fl":{"wild":"Wildflower","carnation":"Carnation","magnolia":"Magnolia","daisy":"Daisy","lavender":"Lavender","gyp":"Baby's breath","rose":"Rose","pingpong":"Ping pong mum","sunflower":"Sunflower","mix":"Mixed"},
"ar":{"stem":"Single stem","taped":"Taped","tied":"Ribbon-tied","wrapped":"Wrapped","pot":"Potted","branch":"Branch","none":"Text only"},
"tone":{"auto":"Auto","peach":"Peach","pink":"Pink","butter":"Butter","white":"White","lilac":"Lilac","coral":"Coral","lime":"Lime","mixed":"Mixed"},
"font":{"sacramento":"Fine line","allura":"Elegant","apple":"Handwritten","caveat":"Casual"}
},
ja:{
"devAuto":"このスマホ（{w}×{h}）",
"dim":"{w} × {h} px・PNG",
"tSaved":"保存しました。写真アプリから壁紙に設定してください","tDownloaded":"{f} をダウンロードしました",
"tLink":"リンクをコピーしました。友だちに送ると同じ壁紙を作れます","tCopyFail":"コピーできませんでした",
"tOpened":"友だちの設定を読み込みました","tBad":"リンクの設定を読み込めなかったので、初期設定で表示しています",
"tRand":"おまかせ：{p}・{f}・{a}",
"imgText":"編織日和の「スマホ壁紙メーカー」で作った壁紙です。あなたも作ってみて：",
"setText":"この設定でスマホの壁紙を作りました。リンクを開くと同じ壁紙が作れます：",
"toolTitle":"編織日和・スマホ壁紙メーカー",
"toolText":"無料のスマホ壁紙メーカー。くすみカラーに小さな花と英語の手書き文字、機種にぴったりのサイズで透かしなし。",
"urlCopied":"URLをコピーしました","toolCopied":"紹介文とURLをコピーしました","thanks":"ありがとう！次はホーム画面から開いてください",
"imgAlt":"作成した壁紙","custom":"カスタム","date":"ja-JP",
"pal":{"milk":"ミルク","hai":"霧グレー","oat":"オーツ","butter":"バター","peach":"ピーチ","sakura":"さくら","azuki":"あずき","lilac":"ライラック","fuji":"藤","sky":"空色","seiji":"青磁","sage":"セージ"},
"fl":{"wild":"野の花","carnation":"カーネーション","magnolia":"木蓮","daisy":"デイジー","lavender":"ラベンダー","gyp":"かすみ草","rose":"バラ","pingpong":"ピンポンマム","sunflower":"ひまわり","mix":"ミックス"},
"ar":{"stem":"一輪","taped":"マステ留め","tied":"リボン結び","wrapped":"ラッピング","pot":"鉢植え","branch":"枝もの","none":"文字だけ"},
"tone":{"auto":"おまかせ","peach":"ピーチ","pink":"ピンク","butter":"バター","white":"白","lilac":"藤色","coral":"コーラル","lime":"ライム","mixed":"ミックス"},
"font":{"sacramento":"細い線","allura":"エレガント","apple":"手書き","caveat":"ラフ"}
}
};
var LANG=['zh','en','ja'].indexOf(window.TS_PAGE_LANG)>=0?window.TS_PAGE_LANG:'zh';
function t(k,v){var s=I18N[LANG][k];if(s===undefined)s=I18N.zh[k];if(s===undefined)s=k;if(v)Object.keys(v).forEach(function(x){s=String(s).split('{'+x+'}').join(v[x])});return s}
function nm(g,id){return (I18N[LANG][g]||I18N.zh[g])[id]||id}

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

/* ===== 花卉插畫引擎：全部用程式畫，原創、無外部素材 ===== */
function rng(seed){var a=seed>>>0;return function(){a=(a+0x6D2B79F5)>>>0;var t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
function hex2rgb(h){h=String(h).replace('#','');var n=parseInt(h,16);return [(n>>16)&255,(n>>8)&255,n&255]}
function rgb2hex(c){return '#'+c.map(function(v){v=Math.max(0,Math.min(255,Math.round(v)));return (v<16?'0':'')+v.toString(16)}).join('')}
function mix(a,b,p){var x=hex2rgb(a),y=hex2rgb(b);return rgb2hex([0,1,2].map(function(i){return x[i]+(y[i]-x[i])*p}))}
function lum(h){var c=hex2rgb(h).map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]}

/* 底色：日系低彩度 */
var PALS=[
  ['milk','#f4efe9'],['hai','#e9e4e1'],['oat','#e8dccd'],['butter','#efe4c6'],
  ['peach','#efd5c9'],['sakura','#ead0d0'],['azuki','#d5b4aa'],['lilac','#ddd1e0'],
  ['fuji','#c9c1d6'],['sky','#cbd6e0'],['seiji','#b8cdca'],['sage','#b7c3b5']
];
/* 花色：主色、副色 */
var TONES={
  peach:['#f2b7a0','#f6cdb9'],pink:['#eeb1b6','#f5cbcf'],butter:['#f1c56a','#f6d995'],
  white:['#fbf8f2','#efe9df'],lilac:['#b8a5d4','#cfc2e3'],coral:['#e48f78','#efb3a1'],
  mixed:['#f2b7a0','#f1c56a'],lime:['#d9e3a6','#e6edc2']
};
var AUTO_TONE={milk:'mixed',hai:'mixed',oat:'peach',butter:'coral',peach:'white',sakura:'white',azuki:'white',lilac:'butter',fuji:'white',sky:'butter',seiji:'white',sage:'peach'};
var FLOWERS=['wild','carnation','magnolia','daisy','lavender','gyp','rose','pingpong','sunflower','mix'];
var ARRS=['stem','taped','tied','wrapped','pot','branch','none'];
var FONTS={sacramento:'Sacramento',allura:'Allura',apple:'Homemade Apple',caveat:'Caveat'};

/* 自動花色：先看花本來的顏色（薰衣草＝紫、玫瑰＝粉），白花放在很淺的底上會看不見，就換成有顏色的 */
var NAT={carnation:'coral',magnolia:'white',daisy:'white',lavender:'lilac',gyp:'white',rose:'pink',pingpong:'white',sunflower:'butter'};
function autoTone(S,bg){
  var n=NAT[S.flower];if(!n)return AUTO_TONE[S.bg]||'mixed';
  if(n==='white'&&lum(bg)>.72&&S.flower!=='magnolia')return S.flower==='daisy'?'butter':(S.flower==='pingpong'?'lime':'pink');
  return n;
}
function colorsFor(S){
  var bg=S.bgHex||'#e8e4e0',dark=lum(bg)<.2;
  var toneId=S.tone==='auto'?autoTone(S,bg):S.tone;
  var tone=TONES[toneId]||TONES.mixed;
  return {
    bg:bg,dark:dark,toneId:toneId,tone:tone,
    ink:dark?'#d8d1c6':'#3a302a',
    leaf:dark?['#93a894','#9fb1bd']:['#4b6550','#7f97a6'],
    text:S.fg||(S.tcol==='white'?'#fdfaf6':(S.tcol==='brown'?'#5a4840':(lum(bg)>.6?'#5a4840':'#fdfaf6'))),
    paper:dark?mix(bg,'#ffffff',.1):mix(bg,'#ffffff',.68)
  };
}

/* ---------- 小零件 ---------- */
function ell(ctx,x,y,rx,ry,a,fill){ctx.beginPath();ctx.ellipse(x,y,Math.max(rx,.1),Math.max(ry,.1),a||0,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill()}
function leaf(ctx,x,y,len,ang,col,round){
  ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.beginPath();ctx.moveTo(0,0);
  var w=len*(round?.5:.3);
  ctx.quadraticCurveTo(len*.45,-w,len,0);ctx.quadraticCurveTo(len*.45,w,0,0);
  ctx.fillStyle=col;ctx.fill();ctx.restore();
}
function qp(a,c,b,t){var m=1-t;return {x:m*m*a.x+2*m*t*c.x+t*t*b.x,y:m*m*a.y+2*m*t*c.y+t*t*b.y}}
function qa(a,c,b,t){var m=1-t,dx=2*m*(c.x-a.x)+2*t*(b.x-c.x),dy=2*m*(c.y-a.y)+2*t*(b.y-c.y);return Math.atan2(dy,dx)}
function stroke(ctx,a,c,b,w,col){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo(c.x,c.y,b.x,b.y);ctx.lineWidth=w;ctx.strokeStyle=col;ctx.lineCap='round';ctx.stroke()}

/* ---------- 花頭：(x,y) 是花萼位置，ang 是花朝向（-π/2＝朝上） ---------- */
var HEAD={
  wild:function(ctx,x,y,r,ang,col,C,R){
    var rot=R()*6.28,i,a;
    for(i=0;i<5;i++){a=rot+i*1.2566+(R()-.5)*.25;ell(ctx,x+Math.cos(a)*r*.52,y+Math.sin(a)*r*.52,r*.5,r*.42,a,col)}
    var d=r*.13,dot=C.dark?'#2b2622':'#4a3a30';
    [[0,-1],[1,0],[0,1],[-1,0]].forEach(function(o){ell(ctx,x+o[0]*d,y+o[1]*d,r*.075,r*.075,0,dot)});
  },
  carnation:function(ctx,x,y,r,ang,col,C,R){
    ctx.save();ctx.translate(x,y);ctx.rotate(ang+Math.PI/2);
    ell(ctx,0,-r*.05,r*.2,r*.34,0,C.leaf[0]);
    ctx.beginPath();ctx.moveTo(-r*.18,-r*.25);
    ctx.bezierCurveTo(-r*.55,-r*.5,-r*.85,-r*.85,-r*.82,-r*1.12);
    var n=7,i;for(i=0;i<=n;i++){var px=-r*.82+i*(r*1.64/n),py=-r*1.12-(i%2?r*.22:0)-(i>0&&i<n?r*.12:0)-R()*r*.08;ctx.lineTo(px,py)}
    ctx.bezierCurveTo(r*.85,-r*.85,r*.55,-r*.5,r*.18,-r*.25);ctx.closePath();ctx.fillStyle=col;ctx.fill();
    ctx.strokeStyle=mix(col,'#8a4a3a',.25);ctx.lineWidth=r*.05;ctx.lineCap='round';
    [-.4,0,.4].forEach(function(k){ctx.beginPath();ctx.moveTo(k*r*.3,-r*.3);ctx.quadraticCurveTo(k*r*.9,-r*.7,k*r*1.25,-r*1.1);ctx.globalAlpha=.35;ctx.stroke();ctx.globalAlpha=1});
    ctx.restore();
  },
  magnolia:function(ctx,x,y,r,ang,col,C,R){
    ctx.save();ctx.translate(x,y);ctx.rotate(ang+Math.PI/2);
    var line=mix(col,C.ink,.3);
    function petal(a,len,w){ctx.save();ctx.rotate(a);ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-w,-len*.35,-w*.7,-len*.85,0,-len);ctx.bezierCurveTo(w*.7,-len*.85,w,-len*.35,0,0);
      ctx.fillStyle=col;ctx.fill();ctx.lineWidth=r*.045;ctx.strokeStyle=line;ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,-len*.15);ctx.quadraticCurveTo(w*.15,-len*.5,0,-len*.8);ctx.globalAlpha=.4;ctx.stroke();ctx.globalAlpha=1;ctx.restore()}
    var open=R();
    petal(-.55-open*.4,r*1.25,r*.42);petal(.55+open*.4,r*1.25,r*.42);petal(0,r*1.45,r*.45);
    petal(-.25,r*1.2,r*.4);petal(.3,r*1.15,r*.4);
    ell(ctx,0,r*.02,r*.22,r*.16,0,C.leaf[0]);
    ctx.restore();
  },
  daisy:function(ctx,x,y,r,ang,col,C,R){
    var n=12,i,a,rot=R();
    for(i=0;i<n;i++){a=rot+i*Math.PI*2/n;ell(ctx,x+Math.cos(a)*r*.55,y+Math.sin(a)*r*.55*.85,r*.48,r*.13,a,col)}
    ell(ctx,x,y,r*.27,r*.25,0,C.toneId==='butter'?'#c98a2e':'#e2b04a');
  },
  lavender:function(ctx,x,y,r,ang,col,C,R){
    var i,n=11,dx=Math.cos(ang),dy=Math.sin(ang),px=-dy,py=dx;
    for(i=0;i<n;i++){var s=1-i/(n+4),d=(i-2)*r*.4,side=i%2?1:-1;
      ell(ctx,x+dx*d+px*side*r*.17,y+dy*d+py*side*r*.17,r*.26*s+r*.06,r*.15*s+r*.05,ang+side*.55,i%3===0?mix(col,'#4a3a70',.22):col)}
  },
  gyp:function(ctx,x,y,r,ang,col,C,R){
    var i,n=6;ctx.lineCap='round';
    for(i=0;i<n;i++){var a=ang+(i/(n-1)-.5)*1.9+(R()-.5)*.3,l=r*(.7+R()*.7),ex=x+Math.cos(a)*l,ey=y+Math.sin(a)*l;
      ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(ex,ey);ctx.lineWidth=r*.06;ctx.strokeStyle=C.ink;ctx.stroke();
      ell(ctx,ex,ey,r*.2,r*.2,0,col);if(R()<.6)ell(ctx,ex+Math.cos(a+1)*r*.28,ey+Math.sin(a+1)*r*.28,r*.14,r*.14,0,col)}
  },
  rose:function(ctx,x,y,r,ang,col,C,R){
    ctx.save();ctx.translate(x,y);ctx.rotate(ang+Math.PI/2);
    leaf(ctx,0,0,r*.7,-Math.PI/2-.8,C.leaf[0]);leaf(ctx,0,0,r*.7,-Math.PI/2+.8,C.leaf[0]);
    ctx.beginPath();ctx.moveTo(-r*.55,-r*.55);ctx.bezierCurveTo(-r*.7,-r*1.2,r*.7,-r*1.25,r*.55,-r*.55);ctx.quadraticCurveTo(0,-r*.05,-r*.55,-r*.55);
    ctx.fillStyle=col;ctx.fill();
    ctx.strokeStyle=mix(col,'#7a3a3a',.35);ctx.lineWidth=r*.06;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(-r*.3,-r*.75);ctx.quadraticCurveTo(0,-r*1.05,r*.28,-r*.8);ctx.quadraticCurveTo(r*.05,-r*.5,-r*.18,-r*.72);ctx.stroke();
    ctx.restore();
  },
  /* 乒乓菊：圓球，外圈一層層細小花瓣（用小弧形排成同心圈） */
  pingpong:function(ctx,x,y,r,ang,col,C,R){
    var cy=y-r*.55,R0=r*.95,dk=mix(col,C.dark?'#000000':'#6b6040',.16),i,k;
    ctx.save();ctx.beginPath();ctx.arc(x,cy,R0,0,Math.PI*2);ctx.fillStyle=col;ctx.fill();
    ctx.clip();ctx.strokeStyle=dk;ctx.lineCap='round';
    for(k=0;k<4;k++){var rr=R0*(1-k*.24),n=Math.max(5,Math.round(16-k*3.2)),w=r*.05;ctx.lineWidth=w;
      for(i=0;i<n;i++){var a=i/n*Math.PI*2+k*.4+R()*.2,px=x+Math.cos(a)*rr*.82,py=cy+Math.sin(a)*rr*.82;
        ctx.beginPath();ctx.arc(px,py,r*.17,a+Math.PI*.6,a+Math.PI*1.4);ctx.stroke()}}
    ctx.restore();
    ctx.beginPath();ctx.arc(x-R0*.3,cy-R0*.32,R0*.28,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,.22)';ctx.fill();
    ell(ctx,x,y-r*.02,r*.24,r*.14,0,C.leaf[0]);
  },
  /* 向日葵：兩層尖花瓣＋大大的咖啡色花心（點點紋路） */
  sunflower:function(ctx,x,y,r,ang,col,C,R){
    var n=14,i,a,rot=R(),pt=mix(col,'#d9902a',.25);
    function petal(a,len,w,c){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.beginPath();ctx.moveTo(r*.3,0);
      ctx.quadraticCurveTo(r*.3+len*.5,-w,r*.3+len,0);ctx.quadraticCurveTo(r*.3+len*.5,w,r*.3,0);ctx.fillStyle=c;ctx.fill();ctx.restore()}
    for(i=0;i<n;i++)petal(rot+(i+.5)*Math.PI*2/n,r*.72,r*.2,pt);
    for(i=0;i<n;i++)petal(rot+i*Math.PI*2/n,r*.78,r*.22,col);
    ell(ctx,x,y,r*.42,r*.42,0,'#7a4e2d');
    for(i=0;i<16;i++){a=i*2.4;var d=Math.sqrt(i/16)*r*.34;ell(ctx,x+Math.cos(a)*d,y+Math.sin(a)*d,r*.04,r*.04,0,'#4a2e1a')}
  },
  sprig:function(){}
};
var HSIZE={wild:3.1,carnation:3.4,magnolia:3.5,daisy:3.3,lavender:2.9,gyp:2.2,rose:3.5,pingpong:3.1,sunflower:3.6,sprig:0};

/* ---------- 一根花莖 ---------- */
function stem(ctx,u,a,c,b,type,col,C,R,opt){
  opt=opt||{};
  stroke(ctx,a,c,b,u*(opt.w||.3),opt.twig?mix(C.ink,'#6b4a35',.35):C.ink);
  var i,lv=type==='sprig'?7:(opt.leaves===0?0:3);
  for(i=0;i<lv;i++){
    var t=type==='sprig'?.25+i*.11:.3+i*.18+(R()-.5)*.06,p=qp(a,c,b,t),an=qa(a,c,b,t),side=i%2?1:-1;
    if(type!=='sprig'&&R()<.25)continue;
    var lc=type==='sprig'?C.leaf[1]:C.leaf[R()<.6?0:1];
    if(type==='sprig'){leaf(ctx,p.x,p.y,u*2.2,an+side*1.1,lc,true);leaf(ctx,p.x,p.y,u*2,an-side*1.1,lc,true)}
    else leaf(ctx,p.x,p.y,u*(opt.leafLen||2.4)*(.8+R()*.4),an+side*(.75+R()*.25),lc);
  }
  return {x:b.x,y:b.y,ang:qa(a,c,b,1)};
}
function head(ctx,type,p,ang,u,col,C,R,k){
  if(!HEAD[type]||type==='sprig')return;
  HEAD[type](ctx,p.x,p.y,u*HSIZE[type]*(k||1)*(.85+R()*.3),ang,col,C,R);
}
function pickCol(C,R,i){return C.toneId==='mixed'?[C.tone[0],C.tone[1],'#eeb1b6','#fbf8f2'][i%4]:(R()<.65?C.tone[0]:C.tone[1])}
function typeAt(flower,i){
  if(flower!=='mix')return flower;
  return ['wild','gyp','daisy','sprig','pingpong','rose','gyp','lavender','wild','sunflower'][i%10];
}

/* ---------- 擺法 ---------- */
function fanStems(ctx,u,bind,n,spread,lenA,lenB,S,C,R,heads){
  var list=[],i;
  for(i=0;i<n;i++){
    var f=n===1?0:i/(n-1)-.5,ang=-Math.PI/2+f*spread+(R()-.5)*.12;
    var len=u*(lenA+(lenB-lenA)*(1-Math.abs(f)*1.6)+R()*3);
    var tip={x:bind.x+Math.cos(ang)*len,y:bind.y+Math.sin(ang)*len};
    var bend=(R()-.5)*u*5+f*u*3,ctl={x:bind.x+Math.cos(ang)*len*.5-Math.sin(ang)*bend,y:bind.y+Math.sin(ang)*len*.5+Math.cos(ang)*bend};
    var type=typeAt(S.flower,i);
    if(S.flower!=='mix'&&(i===1||i===n-2)&&n>4)type='sprig';
    list.push({a:{x:bind.x+(R()-.5)*u*.6,y:bind.y},c:ctl,b:tip,type:type,i:i});
  }
  list.forEach(function(s){
    s.end=stem(ctx,u,s.a,s.c,s.b,s.type,null,C,R);heads.push(s);
    /* 小分枝：每枝多一朵小花，花束才不會只有一根根棍子 */
    if(s.type!=='sprig'&&s.type!=='lavender'&&R()<.6){
      var t=.55+R()*.2,p=qp(s.a,s.c,s.b,t),an=qa(s.a,s.c,s.b,t)+(R()<.5?-1:1)*(.4+R()*.2),l=Math.hypot(s.b.x-s.a.x,s.b.y-s.a.y)*(.25+R()*.12);
      var tip={x:p.x+Math.cos(an)*l,y:p.y+Math.sin(an)*l},ctl={x:p.x+Math.cos(an)*l*.5,y:p.y+Math.sin(an)*l*.5};
      heads.push({type:s.type,end:stem(ctx,u,p,ctl,tip,s.type,null,C,R,{w:.22,leaves:0}),small:1});
    }
  });
}
function lowerStems(ctx,u,bind,n,len,C,R,lean){
  lean=lean||0;
  for(var i=0;i<n;i++){var f=n===1?0:i/(n-1)-.5;
    stroke(ctx,{x:bind.x+f*u*.8,y:bind.y},{x:bind.x+f*u*1.4+lean*len*.25,y:bind.y+len*.5},{x:bind.x+f*u*2.4+lean*len*.6+(R()-.5)*u*.8,y:bind.y+len*(.88+R()*.12)},u*(n>3?.28:.32),C.ink)}
}
/* 緞帶：用兩條邊線圍成帶子，寬度忽寬忽窄像在翻轉，尾端剪成 V 字 */
function ribbon(ctx,pts,w,col){
  var L=[],Rr=[],i,n=pts.length;
  for(i=0;i<n;i++){
    var a=pts[Math.max(0,i-1)],b=pts[Math.min(n-1,i+1)],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1;
    var k=w*(.55+.45*Math.abs(Math.cos(i/n*Math.PI*2.2)));
    L.push({x:pts[i].x-dy/d*k/2,y:pts[i].y+dx/d*k/2});Rr.push({x:pts[i].x+dy/d*k/2,y:pts[i].y-dx/d*k/2});
  }
  var e=pts[n-1],pe=pts[n-2],ex=e.x-pe.x,ey=e.y-pe.y,ed=Math.hypot(ex,ey)||1;
  ctx.beginPath();ctx.moveTo(L[0].x,L[0].y);for(i=1;i<n;i++)ctx.lineTo(L[i].x,L[i].y);
  ctx.lineTo(e.x-ex/ed*w*.55,e.y-ey/ed*w*.55);
  for(i=n-1;i>=0;i--)ctx.lineTo(Rr[i].x,Rr[i].y);ctx.closePath();ctx.fillStyle=col;ctx.fill();
}
function tailPts(x,y,len,s,u,R){
  var p=[],i,n=26,sw=(1.5+R())*u;
  for(i=0;i<=n;i++){var t=i/n;p.push({x:x+s*(t*u*2.2+Math.sin(t*Math.PI*1.6+(s>0?.6:0))*sw),y:y+t*len})}
  return p;
}
function ribbonCol(C){var t=C.toneId;return t==='white'||t==='mixed'?['#fbf7f0',mix(C.bg,C.ink,.32)]:[mix(C.tone[1],'#ffffff',.2),mix(C.tone[0],C.ink,.3)]}
function wrapCol(C){return C.toneId==='white'?'#e9ddd0':(lum(C.bg)>.75?'#dcc6a8':'#f3ece4')}
function drawHeads(ctx,u,heads,C,R){heads.forEach(function(s,j){head(ctx,s.type,s.end,s.end.ang,u,pickCol(C,R,j),C,R,s.small?.68:1)})}

function bow(ctx,x,y,u,col,line,tail,R){
  var shade=mix(col,line,.35);
  if(tail){R=R||Math.random;ribbon(ctx,tailPts(x-u*.3,y+u*.4,tail,-1,u,R),u*1.25,shade);ribbon(ctx,tailPts(x+u*.3,y+u*.4,tail*.82,1,u,R),u*1.25,col)}
  ctx.save();ctx.translate(x,y);ctx.lineWidth=u*.16;ctx.strokeStyle=line;ctx.fillStyle=col;ctx.lineJoin='round';
  function loop(s){ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(s*u*2.4,-u*3.8,s*u*6.6,-u*2,s*u*5.2,u*.5);ctx.bezierCurveTo(s*u*4,u*1.9,s*u*1.4,u*.9,0,0);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*u*1.2,-u*.3);ctx.quadraticCurveTo(s*u*3,-u*1.6,s*u*4.4,-u*.2);ctx.globalAlpha=.45;ctx.stroke();ctx.globalAlpha=1}
  loop(-1);loop(1);ell(ctx,0,0,u*.9,u*.8,0,col);ctx.beginPath();ctx.ellipse(0,0,u*.9,u*.8,0,0,6.29);ctx.stroke();
  ctx.restore();
}
function tape(ctx,x,y,w,h,ang,col){
  ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.beginPath();
  var i,z=6;ctx.moveTo(-w/2,-h/2);ctx.lineTo(w/2,-h/2);
  for(i=0;i<=z;i++)ctx.lineTo(w/2+(i%2?-h*.08:0),-h/2+h*i/z);
  ctx.lineTo(-w/2,h/2);for(i=z;i>=0;i--)ctx.lineTo(-w/2+(i%2?h*.08:0),-h/2+h*i/z);
  ctx.closePath();ctx.fillStyle=col;ctx.globalAlpha=.88;ctx.fill();ctx.globalAlpha=1;ctx.restore();
}

var ARR={
  stem:function(ctx,cx,cy,u,S,C,R){
    var a={x:cx+u,y:cy+19*u},c={x:cx-u*1.5,y:cy+4*u},b={x:cx,y:cy-11*u},heads=[];
    var type=S.flower==='mix'?'wild':S.flower,main=stem(ctx,u,a,c,b,type,null,C,R);
    heads.push({type:type,end:main});
    [.42,.56,.7].forEach(function(t,i){
      var p=qp(a,c,b,t),side=i%2?1:-1,ang=-Math.PI/2+side*(.42+R()*.2),len=u*(8+R()*3);
      var tip={x:p.x+Math.cos(ang)*len,y:p.y+Math.sin(ang)*len},ctl={x:p.x+Math.cos(ang)*len*.4+side*u,y:p.y+Math.sin(ang)*len*.6};
      var ty=S.flower==='mix'?typeAt('mix',i+1):type;if(ty==='sprig')ty='gyp';
      heads.push({type:ty,end:stem(ctx,u,p,ctl,tip,ty,null,C,R,{w:.26,leafLen:2})});
    });
    drawHeads(ctx,u,heads,C,R);
  },
  taped:function(ctx,cx,cy,u,S,C,R){
    ctx.fillStyle=C.paper;ctx.fillRect(cx-31*u,cy-7*u,62*u,26*u);
    var bind={x:cx-2*u,y:cy+19*u},heads=[];
    lowerStems(ctx,u,bind,3,u*30,C,R,-.18);
    fanStems(ctx,u,bind,9,1.3,22,33,S,C,R,heads);
    drawHeads(ctx,u,heads,C,R);
    tape(ctx,bind.x,bind.y+u*1.2,u*15,u*4.6,-.42,C.dark?'#b49a72':'#d8b886');
  },
  tied:function(ctx,cx,cy,u,S,C,R){
    var bind={x:cx,y:cy+12*u},heads=[];
    lowerStems(ctx,u,bind,7,u*20,C,R);
    fanStems(ctx,u,bind,9,1.45,18,28,S,C,R,heads);
    drawHeads(ctx,u,heads,C,R);
    var rc=ribbonCol(C);bow(ctx,bind.x,bind.y+u*1.5,u,rc[0],rc[1],u*24,R);
  },
  wrapped:function(ctx,cx,cy,u,S,C,R){
    var bind={x:cx,y:cy+10*u},heads=[],paper=wrapCol(C),pl=mix(paper,'#ffffff',.45),pd=mix(paper,'#6b4a30',.12),line=mix(paper,'#5a3a20',.28);
    var bot=cy+35*u;
    /* 後面那張紙：上緣微微波浪，從花後面露出來 */
    ctx.fillStyle=pl;ctx.beginPath();ctx.moveTo(cx-16*u,cy-3*u);
    ctx.bezierCurveTo(cx-10*u,cy-10*u,cx-4*u,cy-6*u,cx,cy-10*u);ctx.bezierCurveTo(cx+5*u,cy-13*u,cx+11*u,cy-7*u,cx+17*u,cy-5*u);
    ctx.quadraticCurveTo(cx+11*u,cy+15*u,cx+2*u,bot);ctx.lineTo(cx-2*u,bot);ctx.quadraticCurveTo(cx-11*u,cy+15*u,cx-16*u,cy-3*u);ctx.fill();
    lowerStems(ctx,u,bind,5,u*29,C,R);
    fanStems(ctx,u,bind,11,1.35,16,24,S,C,R,heads);
    drawHeads(ctx,u,heads,C,R);
    /* 前面兩片：左片在下、右片在上，上緣往外翻一點摺邊 */
    function flap(pts,fill,fold){
      ctx.fillStyle=fill;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);ctx.quadraticCurveTo(pts[1][0],pts[1][1],pts[2][0],pts[2][1]);
      ctx.quadraticCurveTo(pts[3][0],pts[3][1],pts[4][0],pts[4][1]);ctx.lineTo(pts[5][0],pts[5][1]);ctx.quadraticCurveTo(pts[6][0],pts[6][1],pts[0][0],pts[0][1]);ctx.fill();
      ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);ctx.quadraticCurveTo(pts[1][0],pts[1][1],pts[2][0],pts[2][1]);ctx.lineWidth=u*1.1;ctx.strokeStyle=fold;ctx.stroke();
    }
    flap([[cx-19*u,cy+1*u],[cx-7*u,cy-2*u],[cx+6*u,cy+6*u],[cx+3*u,cy+21*u],[cx+1.6*u,bot],[cx-1.6*u,bot],[cx-11*u,cy+15*u]],paper,pl);
    flap([[cx+19*u,cy-1*u],[cx+8*u,cy+1*u],[cx-5*u,cy+9*u],[cx-1.5*u,cy+22*u],[cx-1*u,bot],[cx+2*u,bot],[cx+11*u,cy+14*u]],pd,mix(pd,'#ffffff',.35));
    ctx.strokeStyle=line;ctx.lineWidth=u*.14;ctx.globalAlpha=.35;
    [[cx-12*u,cy+4*u,cx-6*u,cy+16*u,cx-1.5*u,cy+30*u],[cx+12*u,cy+3*u,cx+6*u,cy+15*u,cx+1*u,cy+29*u]].forEach(function(c){ctx.beginPath();ctx.moveTo(c[0],c[1]);ctx.quadraticCurveTo(c[2],c[3],c[4],c[5]);ctx.stroke()});
    ctx.globalAlpha=1;
    var by=cy+21*u,rc=ribbonCol(C);
    ctx.fillStyle=rc[0];ctx.beginPath();ctx.moveTo(cx-4.4*u,by-.9*u);ctx.quadraticCurveTo(cx,by-.2*u,cx+4.6*u,by-1.2*u);ctx.lineTo(cx+4.4*u,by+.8*u);ctx.quadraticCurveTo(cx,by+1.5*u,cx-4.2*u,by+.9*u);ctx.closePath();ctx.fill();
    bow(ctx,cx,by,u*.8,rc[0],rc[1],u*17,R);
  },
  pot:function(ctx,cx,cy,u,S,C,R){
    var top=cy+14*u,heads=[],potC=C.dark?'#b88a6e':'#c98d6e',rim=mix(potC,'#000000',.08);
    fanStems(ctx,u,{x:cx,y:top+1.5*u},7,1.45,14,22,S,C,R,heads);
    drawHeads(ctx,u,heads,C,R);
    ctx.fillStyle=potC;ctx.beginPath();ctx.moveTo(cx-10*u,top+2.6*u);ctx.lineTo(cx+10*u,top+2.6*u);ctx.lineTo(cx+7*u,top+16*u);ctx.lineTo(cx-7*u,top+16*u);ctx.closePath();ctx.fill();
    ctx.fillStyle=rim;ctx.fillRect(cx-11.2*u,top,22.4*u,3.2*u);
    ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(cx-7*u,top+5*u,2*u,9*u);
  },
  branch:function(ctx,cx,cy,u,S,C,R){
    var a={x:-2*u,y:cy+20*u},c={x:cx-10*u,y:cy+12*u},b={x:cx+20*u,y:cy-2*u},heads=[];
    var type=S.flower==='mix'?'wild':S.flower;
    stem(ctx,u,a,c,b,'x',null,C,R,{w:.55,twig:true,leaves:0});
    heads.push({type:type,end:{x:b.x,y:b.y,ang:-Math.PI/2+.5}});
    [.25,.42,.6,.78].forEach(function(t,i){
      var p=qp(a,c,b,t),up=i%2===0,ang=up?-Math.PI/2+.25+R()*.3:-.2+R()*.4,len=u*(8+R()*6);
      var tip={x:p.x+Math.cos(ang)*len,y:p.y+Math.sin(ang)*len},ctl={x:p.x+Math.cos(ang)*len*.5,y:p.y+Math.sin(ang)*len*.5-u};
      var e=stem(ctx,u,p,ctl,tip,'x',null,C,R,{w:.35,twig:true,leaves:0});
      var ty=S.flower==='mix'?typeAt('mix',i):type;if(ty==='sprig')ty='wild';
      heads.push({type:ty,end:{x:e.x,y:e.y,ang:-Math.PI/2+(R()-.5)*.8}});
      var mid=qp(p,ctl,tip,.55);heads.push({type:ty,end:{x:mid.x,y:mid.y,ang:-Math.PI/2+(R()-.5)*.9},small:1});
      if(R()<.6){leaf(ctx,mid.x,mid.y,u*2.2,ang-1.2,C.leaf[0])}
    });
    heads.forEach(function(h,j){head(ctx,h.type,h.end,h.end.ang,u,pickCol(C,R,j),C,R,h.small?.75:1)});
  },
  none:function(){}
};

/* ---------- 手寫字 ---------- */
function heartPath(ctx,x,y,s){ctx.beginPath();ctx.moveTo(x,y+s*.35);ctx.bezierCurveTo(x-s*.9,y-s*.2,x-s*.45,y-s*.85,x,y-s*.35);ctx.bezierCurveTo(x+s*.45,y-s*.85,x+s*.9,y-s*.2,x,y+s*.35);ctx.closePath()}
function drawText(ctx,W,H,S,C,ty){
  var tx=String(S.txt||'').trim();if(!tx)return;
  var fam=FONTS[S.font]||'Sacramento',fs=W*({sacramento:.16,allura:.135,apple:.085,caveat:.12}[S.font]||.14);
  var cjk=isCjk(tx);
  /* 中日文：有假名用 Klee One（日文手寫），其他用霞鶩文楷 TC（繁中手寫）；字身比較飽滿，另外換算成畫面寬度的固定比例 */
  var stack=cjk?'"'+cjkFamily(tx)+'","Hiragino Mincho ProN","Songti TC",serif':'"'+fam+'",cursive';
  var cjkK=CJK_SCALE/({sacramento:.16,allura:.135,apple:.085,caveat:.12}[S.font]||.14);
  ctx.font=(cjk?fs*cjkK:fs)+'px '+stack;
  var w=ctx.measureText(tx).width,maxW=W*(S.flourish?.7:.86);
  if(w>maxW){fs*=maxW/w;ctx.font=(cjk?fs*cjkK:fs)+'px '+stack;w=ctx.measureText(tx).width}
  ctx.fillStyle=C.text;ctx.strokeStyle=C.text;ctx.textAlign='center';ctx.textBaseline='alphabetic';
  var by=ty+fs*.18;
  ctx.fillText(tx,W/2,by);
  if(S.flourish){
    var lw=Math.max(1,fs*.028),yl=by-fs*.12,xl=W/2-w/2-fs*.06,xr=W/2+w/2+fs*.06;
    ctx.lineWidth=lw;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(-lw,yl-fs*.12);ctx.bezierCurveTo(xl*.35,yl-fs*.3,xl*.6,yl+fs*.12,xl,yl);ctx.stroke();
    ctx.beginPath();ctx.moveTo(xr,yl);ctx.bezierCurveTo(xr+(W-xr)*.4,yl-fs*.14,xr+(W-xr)*.65,yl+fs*.22,W+lw,yl+fs*.05);ctx.stroke();
  }
  if(S.heart){heartPath(ctx,W/2,by+fs*.62,fs*.24);ctx.fill()}
}

function draw(cv,W,H,S){
  var ctx=cv.getContext('2d'),C=colorsFor(S),R=rng(S.seed||1);
  ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
  /* 紙張顆粒：非常淡，讓底色不死板 */
  var g=rng(7),i,n=Math.round(W*H/1800);ctx.fillStyle=C.dark?'rgba(255,255,255,.035)':'rgba(70,50,40,.035)';
  for(i=0;i<n;i++)ctx.fillRect(g()*W,g()*H,Math.max(1,W/500),Math.max(1,W/500));
  var hasTxt=String(S.txt||'').trim().length>0,arr=ARR[S.arr]?S.arr:'stem';
  var k=.75+(S.size==null?50:S.size)/100*.5,u=W/100*k;
  /* 每種擺法的最低點（以花的中心 cy 為準，單位 u），字排在它下面 */
  var BOT={stem:20,taped:50,tied:39,wrapped:39,pot:31,branch:21,none:0}[arr];
  var fs=fontSize(W,S),cy,ty;
  if(arr==='none'){ty=H*.5}
  else if(!hasTxt){cy=H*.5-(BOT-24)*u*.3}
  else if(S.tpos==='top'){ty=H*.33;cy=Math.max(H*.47+34*u,ty+fs*.9+36*u);cy=Math.min(cy,H*.9-BOT*u)}
  else{cy=H*.44-(BOT-24)*u*.45;ty=Math.min(H*.86,cy+BOT*u+3*u+fs*.55)}
  if(arr==='branch'&&cy!=null)cy+=H*.03;
  ctx.lineJoin='round';
  if(arr!=='none')ARR[arr](ctx,W/2,cy,u,S,C,R);
  if(hasTxt)drawText(ctx,W,H,S,C,ty);
}
/* 中日文字大小（畫面寬度的比例）；App 版 BloomsCore 的 cjkScale 要一樣 */
var CJK_SCALE=.085;
function isCjk(t){return /[\u3000-\u9fff\uff00-\uffef]/.test(t)}
function cjkFamily(t){return /[\u3040-\u30ff]/.test(t)?'Klee One':'LXGW WenKai TC'}
function fontSize(W,S){return W*({sacramento:.16,allura:.135,apple:.085,caveat:.12}[S.font]||.14)}

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
  ['px10','Google Pixel 10／9／9a',1080,2424],
  ['px10p','Google Pixel 10 Pro／9 Pro',1280,2856],
  ['px10xl','Google Pixel 10 Pro XL／9 Pro XL／8 Pro',1344,2992],
  ['px8','Google Pixel 8／8a／7／7a',1080,2400],
  ['px7p','Google Pixel 7 Pro',1440,3120],
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
function isHex(s){return /^#[0-9a-f]{6}$/i.test(String(s))}
function palHex(id){for(var i=0;i<PALS.length;i++)if(PALS[i][0]===id)return PALS[i][1];return null}
var TONE_IDS=['auto','peach','pink','butter','white','lilac','coral','lime','mixed'];
var FONT_IDS=['sacramento','allura','apple','caveat'];

/* ---------- 狀態 ---------- */
var DEF={dev:'auto',bg:'sakura',cbg:'',flower:'mix',arr:'tied',tone:'auto',size:50,seed:20261020,txt:'stay gold',font:'allura',flourish:1,heart:1,tcol:'auto',tpos:'bot'};
var S={},KEY='pw-wall-v3';
function setS(o){S={};Object.keys(DEF).forEach(function(k){S[k]=(o&&o[k]!==undefined)?o[k]:DEF[k]})}
function clean(){
  if(S.dev!=='auto'&&!DEVS.some(function(d){return d[0]===S.dev}))S.dev='auto';
  if(S.dev==='auto'&&!AUTO)S.dev='ip16';
  if(S.bg==='custom'?!isHex(S.cbg):!palHex(S.bg))S.bg=DEF.bg;
  if(FLOWERS.indexOf(S.flower)<0)S.flower=DEF.flower;
  if(ARRS.indexOf(S.arr)<0)S.arr=DEF.arr;
  if(TONE_IDS.indexOf(S.tone)<0)S.tone='auto';
  if(FONT_IDS.indexOf(S.font)<0)S.font=DEF.font;
  if(['auto','white','brown'].indexOf(S.tcol)<0)S.tcol='auto';
  if(S.tpos!=='top')S.tpos='bot';
  S.size=Math.max(0,Math.min(100,+S.size||0));S.seed=(+S.seed>>>0)||1;
  S.flourish=S.flourish?1:0;S.heart=S.heart?1:0;
  S.txt=String(S.txt==null?'':S.txt).slice(0,28);
}
function bgHex(){return S.bg==='custom'?S.cbg:palHex(S.bg)}
function paint(cv,W,H,o){var x={},k;for(k in S)x[k]=S[k];if(o)for(k in o)x[k]=o[k];x.bgHex=x.bg==='custom'?x.cbg:palHex(x.bg);draw(cv,W,H,x)}

/* ---------- 字體載入：載好才畫，不然會先用系統字 ---------- */
var FONT_OK={};
var TXT_TRY={},TXT_BUSY={};
/* 中日文字型很大，Google Fonts 會切成很多小包，只下載畫面上用到的字；所以要用實際的字去載，載好再畫。
   每次畫之前都直接問瀏覽器「這幾個字準備好了沒」（不靠自己記），字型清單被重新整理時也不會退回系統字 */
function cjkFont(tx){return '40px "'+cjkFamily(tx)+'"'}
/* 注意：字型的 CSS 還沒下載完時，瀏覽器找不到這個字型，check() 會直接回答 true，所以要先等 CSS */
var CSS_DONE=false;FONT_CSS.then(function(){CSS_DONE=true});
function textReady(tx){if(!CSS_DONE)return false;try{return document.fonts.check(cjkFont(tx),tx)}catch(e){return true}}
function loadText(cb){
  var tx=String(S.txt||'').trim();
  if(!isCjk(tx)){loadFont(S.font,cb);return}
  if(!document.fonts||!document.fonts.load||textReady(tx)){cb&&cb();return}
  var key=cjkFamily(tx)+'|'+tx;
  /* 同一句最多試 3 次，載不到就用系統字，避免一直重試 */
  if(TXT_BUSY[key]||(TXT_TRY[key]||0)>=3){if(!TXT_BUSY[key])cb&&cb();return}
  TXT_BUSY[key]=1;TXT_TRY[key]=(TXT_TRY[key]||0)+1;
  FONT_CSS.then(function(){return document.fonts.load(cjkFont(tx),tx)}).then(function(){TXT_BUSY[key]=0;cb&&cb()},function(){TXT_BUSY[key]=0;cb&&cb()});
}
function needText(){var tx=String(S.txt||'').trim();if(!isCjk(tx)||!document.fonts)return false;var key=cjkFamily(tx)+'|'+tx;return !textReady(tx)&&!TXT_BUSY[key]&&(TXT_TRY[key]||0)<3}
function loadFont(id,cb){
  var fam=FONTS[id];if(FONT_OK[id]||!document.fonts||!document.fonts.load){cb&&cb();return}
  /* 先等字體的 CSS 載好，不然 fonts.load 會找不到這個字體、直接回報完成 */
  FONT_CSS.then(function(){return document.fonts.load('40px "'+fam+'"','stay gold')}).then(function(r){if(r&&r.length)FONT_OK[id]=1;cb&&cb()},function(){cb&&cb()});
}

/* ---------- 畫面 ---------- */
var cv=$('#pw-cv'),pv=$('#pw-pv'),mini=$('#pw-mini');
function sizeNow(){return devSize(S.dev)}
function render(){
  var sz=sizeNow(),W=sz[0],H=sz[1],dpr=Math.min(window.devicePixelRatio||1,2);
  pv.style.setProperty('--ar',W+'/'+H);
  var cw=Math.round((pv.clientWidth||240)*dpr);if(cw<100)cw=480;
  cv.width=cw;cv.height=Math.round(cw*H/W);paint(cv,cv.width,cv.height);
  mini.width=72;mini.height=Math.round(72*H/W);paint(mini,mini.width,mini.height);
  if(needText())loadText(render);
  $('#pw-dim').textContent=t('dim',{w:W,h:H});
  pv.style.setProperty('--cc',lum(bgHex())>.6?'#4a403a':'#ffffff');
  $('#pw-fab-v').textContent=palName()+'・'+nm('fl',S.flower);
  syncUI();save();
}
function palName(){return S.bg==='custom'?t('custom'):nm('pal',S.bg)}
function press(box,attr,val){[].forEach.call(box.querySelectorAll('['+attr+']'),function(b){b.setAttribute('aria-pressed',String(b.getAttribute(attr)===String(val)))})}
function syncUI(){
  $('#pw-dev').value=S.dev;
  press($('#pw-pals'),'data-bg',S.bg);press($('#pw-flowers'),'data-fl',S.flower);press($('#pw-arrs'),'data-ar',S.arr);
  press($('#pw-tones'),'data-tone',S.tone);press($('#pw-fonts'),'data-font',S.font);
  press($('#pw-tcol'),'data-v',S.tcol);press($('#pw-tpos'),'data-v',S.tpos);
  press($('#pw-phrases'),'data-ph',S.txt);
  $('#pw-flourish').checked=!!S.flourish;$('#pw-heart').checked=!!S.heart;
  $('#pw-size').value=S.size;
  if(document.activeElement!==$('#pw-txt'))$('#pw-txt').value=S.txt;
  $('#pw-tones').hidden=S.arr==='none';$('#pw-reseed').hidden=S.arr==='none';
}
/* 選項的小縮圖：花＝一枝、擺法＝目前的花 */
var thumbT=0;
function thumbs(){
  clearTimeout(thumbT);thumbT=setTimeout(function(){
    /* 先畫在一張手機比例的暫存圖上，再裁中間那一塊放大，縮圖才看得清楚 */
    var tmp=document.createElement('canvas');tmp.width=300;tmp.height=650;
    function crop(c,o,x,y,w,h){paint(tmp,300,650,o);var g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);g.drawImage(tmp,x,y,w,h,0,0,c.width,c.height)}
    [].forEach.call($('#pw-flowers').querySelectorAll('canvas'),function(c){flowerThumb(c,c.dataset.v)});
    [].forEach.call($('#pw-arrs').querySelectorAll('canvas'),function(c){crop(c,{arr:c.dataset.v,txt:c.dataset.v==='none'?'abc':'',font:'sacramento',size:60,heart:0,flourish:0,tpos:'bot'},37,150,226,400)});
  },60);
}
/* 花的縮圖：近拍，一根短莖＋一朵（綜合＝三朵） */
function flowerThumb(c,f){
  var g=c.getContext('2d'),W=c.width,H=c.height,o={},k;for(k in S)o[k]=S[k];o.flower=f;o.bgHex=bgHex();
  var C=colorsFor(o),R=rng(9),u=W/14;
  g.fillStyle=C.bg;g.fillRect(0,0,W,H);g.lineJoin='round';
  var list=f==='mix'?[['wild',-2.6,.2],['gyp',2.4,-.15],['daisy',0,0]]:[[f,0,0]];
  list.forEach(function(it,i){
    var x=W/2+it[1]*u,top={x:x+it[2]*u*4,y:H*(f==='mix'?.36+i*.04:.4)};
    if(it[0]==='lavender')top.y=H*.62;
    var e=stem(g,u,{x:W/2,y:H*.98},{x:x,y:H*.7},top,it[0],null,C,R,{w:.32,leafLen:2.6});
    var col=pickCol(C,R,i),sz=f==='mix'?.95:1.35;
    if(it[0]==='lavender')HEAD.lavender(g,e.x,e.y,u*2.6,e.ang,col,C,R);
    else HEAD[it[0]](g,e.x,e.y,u*HSIZE[it[0]]*sz,e.ang,col,C,R);
  });
}
var saveT=0;
function save(){clearTimeout(saveT);saveT=setTimeout(function(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}},300)}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')}

/* 選單內容 */
(function(){
  var h='';
  if(AUTO)h+='<option value="auto">'+esc(t('devAuto',{w:AUTO[0],h:AUTO[1]}))+'</option>';
  h+=DEVS.map(function(d){return '<option value="'+d[0]+'">'+esc(d[1])+'（'+d[2]+'×'+d[3]+'）</option>'}).join('');
  $('#pw-dev').innerHTML=h;
  $('#pw-pals').innerHTML=PALS.map(function(p){return '<button type="button" data-bg="'+p[0]+'" aria-pressed="false"><span class="sw" style="background:'+p[1]+'"></span><span>'+esc(nm('pal',p[0]))+'</span></button>'}).join('');
  $('#pw-flowers').innerHTML=FLOWERS.map(function(f){return '<button type="button" data-fl="'+f+'" aria-pressed="false"><canvas width="96" height="120" data-v="'+f+'"></canvas><span>'+esc(nm('fl',f))+'</span></button>'}).join('');
  $('#pw-arrs').innerHTML=ARRS.map(function(a){return '<button type="button" data-ar="'+a+'" aria-pressed="false"><canvas width="96" height="170" data-v="'+a+'"></canvas><span>'+esc(nm('ar',a))+'</span></button>'}).join('');
  $('#pw-tones').innerHTML=TONE_IDS.map(function(id){var c=id==='auto'?'conic-gradient(#f2b7a0,#f1c56a,#b8a5d4,#eeb1b6,#f2b7a0)':(id==='mixed'?'linear-gradient(135deg,#f2b7a0 50%,#f1c56a 50%)':TONES[id][0]);return '<button type="button" data-tone="'+id+'" aria-pressed="false"><i style="background:'+c+'"></i>'+esc(nm('tone',id))+'</button>'}).join('');
  $('#pw-fonts').innerHTML=FONT_IDS.map(function(id){return '<button type="button" data-font="'+id+'" aria-pressed="false"><b style="font-family:\''+FONTS[id]+'\',cursive">stay gold</b><small>'+esc(nm('font',id))+'</small></button>'}).join('');
  $('#pw-phrases').innerHTML=PHRASES.map(function(p){return '<button type="button" data-ph="'+esc(p)+'" aria-pressed="false">'+esc(p)+'</button>'}).join('');
  $('#pw-img').alt=t('imgAlt');
  try{$('#pw-clk-d').textContent=new Date().toLocaleDateString(t('date'),{month:'long',day:'numeric',weekday:'long'})}catch(e){}
})();

/* ---------- 操作 ---------- */
function on(sel,ev,fn){$(sel).addEventListener(ev,fn)}
function pick(box,attr,fn){on(box,'click',function(e){var b=e.target.closest('['+attr+']');if(b)fn(b.getAttribute(attr))})}
on('#pw-dev','change',function(){S.dev=this.value;render();ga('wall_device',{option:S.dev})});
pick('#pw-pals','data-bg',function(v){S.bg=v;render();thumbs()});
on('#pw-cbg','input',function(){S.bg='custom';S.cbg=this.value;render();thumbs()});
pick('#pw-flowers','data-fl',function(v){S.flower=v;if(S.arr==='none')S.arr='tied';render();thumbs()});
pick('#pw-arrs','data-ar',function(v){S.arr=v;render()});
pick('#pw-tones','data-tone',function(v){S.tone=v;render();thumbs()});
pick('#pw-fonts','data-font',function(v){S.font=v;loadFont(v,render);render()});
pick('#pw-phrases','data-ph',function(v){S.txt=v;render();ga('wall_phrase',{option:String(PHRASES.indexOf(v)+1),source:'list'})});
pick('#pw-tcol','data-v',function(v){S.tcol=v;render()});
pick('#pw-tpos','data-v',function(v){S.tpos=v;render()});
on('#pw-phr','click',function(){var i=PHRASES.indexOf(S.txt),j;do{j=Math.floor(Math.random()*PHRASES.length)}while(j===i);S.txt=PHRASES[j];render();ga('wall_phrase',{option:String(j+1),source:'shuffle'})});
on('#pw-flourish','change',function(){S.flourish=this.checked?1:0;render()});
on('#pw-heart','change',function(){S.heart=this.checked?1:0;render()});
var rT=0;
on('#pw-size','input',function(){S.size=+this.value;cancelAnimationFrame(rT);rT=requestAnimationFrame(render)});
on('#pw-reseed','click',function(){S.seed=(Math.random()*4294967295)>>>0;render()});
on('#pw-txt','input',function(){S.txt=this.value.slice(0,28);cancelAnimationFrame(rT);rT=requestAnimationFrame(render)});
on('#pw-clock','change',function(){pv.classList.toggle('noclk',!this.checked)});
$('#pw-cust').addEventListener('toggle',function(){if(this.open&&S.bg!=='custom')$('#pw-cbg').value=bgHex()});

function any(a){return a[Math.floor(Math.random()*a.length)]}
function randomize(src){
  S.bg=any(PALS)[0];S.flower=any(FLOWERS);S.arr=any(ARRS.slice(0,6));S.tone='auto';
  S.size=30+Math.round(Math.random()*40);S.seed=(Math.random()*4294967295)>>>0;
  render();thumbs();toast(t('tRand',{p:palName(),f:nm('fl',S.flower),a:nm('ar',S.arr)}));
  ga('wall_random',{option:S.arr,source:src});
}
on('#pw-rand','click',function(){randomize('preview')});
on('#pw-fab-rand','click',function(){randomize('fab')});
on('#pw-fab-pv','click',function(){$('#pw-pvc').scrollIntoView({behavior:'smooth',block:'start'})});

/* ---------- 存圖 ---------- */
var busy=false;
function makeBlob(){
  var sz=sizeNow(),c=document.createElement('canvas');c.width=sz[0];c.height=sz[1];
  paint(c,sz[0],sz[1]);
  return new Promise(function(res){c.toBlob(function(b){res(b)},'image/png')});
}
function fileName(){var sz=sizeNow();return 'knittinghiyori-wallpaper-'+sz[0]+'x'+sz[1]+'.png'}
/* 每次存圖送 export（core §3-2，method=image）；第一次另外算 tool_result */
function track(how){
  hyTool.result({option:S.arr,source:S.bg});
  ga('export',{method:'image',option:S.arr,source:S.bg,result:how});
}
function saveImg(){
  if(busy)return;busy=true;hyTool.start('direct');
  loadText(async function(){
    try{
      var blob=await makeBlob();if(!blob)throw new Error('blob');
      var name=fileName(),file=null;
      try{file=new File([blob],name,{type:'image/png'})}catch(e){}
      if(TOUCH&&file&&navigator.canShare&&navigator.canShare({files:[file]})){
        try{await navigator.share({files:[file],title:t('toolTitle'),text:t('imgText')+' '+TOOL_URL});track('share');toast(t('tSaved'));return}
        catch(e){if(e&&e.name==='AbortError'){ga('share_cancel',{method:'native',content_type:'result'});return}}
      }
      var url=URL.createObjectURL(blob);
      if(TOUCH){$('#pw-img').src=url;openDlg($('#pw-idlg'));track('long_press');return}
      var a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
      setTimeout(function(){URL.revokeObjectURL(url)},4000);
      track('download');toast(t('tDownloaded',{f:name}));
    }catch(e){if(window.console)console.warn('[phone-wallpaper] 存圖失敗',e)}
    finally{busy=false}
  });
}
on('#pw-save','click',saveImg);on('#pw-fab-save','click',saveImg);
function openDlg(d){if(d.showModal){try{d.showModal();return}catch(e){}}d.setAttribute('open','')}
function closeDlg(d){if(d.close)d.close();else d.removeAttribute('open')}
on('#pw-iclose','click',function(){closeDlg($('#pw-idlg'))});
on('#pw-idlg','click',function(e){if(e.target===this)closeDlg(this)});

/* ---------- 分享設定連結（# 後面帶設定，朋友打開看到同一張；不帶手機型號） ---------- */
function b64e(s){return btoa(unescape(encodeURIComponent(s))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function b64d(s){s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return decodeURIComponent(escape(atob(s)))}
function setLink(){var o={};Object.keys(DEF).forEach(function(k){if(k!=='dev'&&S[k]!==DEF[k])o[k]=S[k]});return TOOL_URL+'#w='+b64e(JSON.stringify(o))}
async function copy(s){try{await navigator.clipboard.writeText(s);return true}catch(e){
  var ta=document.createElement('textarea');ta.value=s;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();
  var ok=false;try{ok=document.execCommand('copy')}catch(x){}ta.remove();return ok}}
on('#pw-shareset','click',async function(){
  var url=setLink(),info={option:S.arr,source:S.bg};
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
  if(inc&&typeof inc==='object'){var keepDev=S.dev,o={},k;for(k in DEF)o[k]=inc[k]!==undefined?inc[k]:DEF[k];setS(o);S.dev=keepDev;hyTool.start('shared');ga('open_shared',{option:S.arr,source:S.bg});setTimeout(function(){toast(t('tOpened'))},400)}
  else setTimeout(function(){toast(t('tBad'))},400);
}
clean();
render();thumbs();
loadText(function(){render();thumbs()});
FONT_IDS.forEach(function(f){loadFont(f)});
window.addEventListener('resize',function(){cancelAnimationFrame(rT);rT=requestAnimationFrame(render)});
}catch(err){if(window.console)console.error('[phone-wallpaper]',err)}
})();
