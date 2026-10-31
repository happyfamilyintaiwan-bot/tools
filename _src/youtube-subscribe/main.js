(function(){
'use strict';
try{
var ROOT=document.getElementById('ys-app');
if(!ROOT){if(window.console)console.warn('[youtube-subscribe] 找不到 #ys-app，工具未啟動');return}
var $=function(s){var el=ROOT.querySelector(s);if(!el)if(window.console)console.warn('[youtube-subscribe] 找不到元素',s);return el||document.createElement('span')};
var TOOL_URL=location.origin+location.pathname;

/* ▼ 動態文字（靜態文字在 top.<語言>.html） */
var I18N={
zh:{
"eEmpty":"",
"eUrl":"這看起來不是網址。請從瀏覽器網址列整段複製頻道網址再貼上。",
"eVideo":"這是影片連結。請打開你的頻道首頁，複製 @帳號 那種網址再貼上。",
"eHost":"這不是 YouTube 網址。請貼 youtube.com 開頭的頻道網址。",
"eNoCh":"找不到頻道名稱。頻道網址通常長這樣：https://www.youtube.com/@你的帳號",
"tCopied":"已複製，可以貼到說明欄、簡介或 LINE 了","tCopyFail":"複製失敗，請長按連結自己複製",
"tQr":"QR code 已下載","tQrHold":"長按 QR code 圖片就能存到相簿",
"toolTitle":"編織日和・YouTube 訂閱連結產生器",
"toolText":"免費的 YouTube 訂閱連結產生器：貼上頻道網址，做出點開就跳出訂閱確認框的連結和 QR code。",
"urlCopied":"網址已複製","toolCopied":"介紹文字與網址已複製","thanks":"謝謝！下次要貼連結就從桌面打開"
},
en:{
"eEmpty":"",
"eUrl":"That doesn't look like a URL. Copy the full channel address from your browser bar and paste it again.",
"eVideo":"That's a video link. Open your channel page, copy the @handle URL and paste it here.",
"eHost":"That isn't a YouTube URL. Paste a channel URL that starts with youtube.com.",
"eNoCh":"We couldn't find a channel in that URL. Channel URLs usually look like https://www.youtube.com/@yourhandle",
"tCopied":"Copied. Paste it into your description, bio or newsletter","tCopyFail":"Couldn't copy. Press and hold the link to copy it",
"tQr":"QR code downloaded","tQrHold":"Press and hold the QR code to save it",
"toolTitle":"YouTube Subscribe Link Generator by Knitting Hiyori",
"toolText":"A free YouTube subscribe link generator: paste your channel URL and get a link and QR code that open a Subscribe prompt.",
"urlCopied":"Link copied","toolCopied":"Text and link copied","thanks":"Thanks! Open it from your home screen next time"
},
ja:{
"eEmpty":"",
"eUrl":"URL ではないようです。ブラウザのアドレスバーからチャンネルの URL をまるごとコピーして貼り直してください。",
"eVideo":"これは動画のリンクです。チャンネルページを開いて、@ハンドルの URL をコピーして貼ってください。",
"eHost":"YouTube の URL ではありません。youtube.com で始まるチャンネルの URL を貼ってください。",
"eNoCh":"チャンネルが見つかりません。チャンネルの URL はふつう https://www.youtube.com/@ハンドル の形です。",
"tCopied":"コピーしました。概要欄やプロフィールに貼れます","tCopyFail":"コピーできませんでした。リンクを長押ししてコピーしてください",
"tQr":"QR コードを保存しました","tQrHold":"QR コードの画像を長押しすると保存できます",
"toolTitle":"編織日和・YouTube 登録リンクメーカー",
"toolText":"無料の YouTube 登録リンクメーカー。チャンネル URL を貼ると、開くとすぐ登録の確認が出るリンクと QR コードを作れます。",
"urlCopied":"URLをコピーしました","toolCopied":"紹介文とURLをコピーしました","thanks":"ありがとう！次はホーム画面から開いてください"
}
};
var LANG=['zh','en','ja'].indexOf(window.TS_PAGE_LANG)>=0?window.TS_PAGE_LANG:'zh';
function t(k){var s=I18N[LANG][k];if(s===undefined)s=I18N.zh[k];return s===undefined?k:s}

/* ===== 編織日和工具｜GA4 統一追蹤 v1.2 =====
   各工具完全相同，只改最上面三行。規範：tools-ga4-guideline */
var HY_TOOL_ID = 'yt_subscribe';    /* 工具登記表的 tool_id */
var HY_TOOL_ROOT = '#ys-app';  /* 工具最外層的選擇器 */
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

/* ---------- 網址轉換（純函式：輸入任何頻道網址，回傳標準訂閱連結或錯誤代號） ---------- */
function build(raw){
  var s=String(raw||'').trim();
  if(!s)return {error:'empty'};
  if(/^@[^\s\/?#]+$/.test(s))s='https://www.youtube.com/'+s;
  if(!/^https?:\/\//i.test(s))s='https://'+s;
  var u;try{u=new URL(s)}catch(e){return {error:'url'}}
  var host=u.hostname.toLowerCase();
  if(host==='youtu.be')return {error:'video'};
  if(!/(^|\.)youtube\.com$/.test(host))return {error:'host'};
  var seg=u.pathname.split('/').filter(Boolean),base=null,kind='';
  if(seg[0]&&seg[0].charAt(0)==='@'&&seg[0].length>1){base=seg[0];kind='handle'}
  else if(seg[0]==='channel'&&/^UC[\w-]{10,}$/.test(seg[1]||'')){base='channel/'+seg[1];kind='channel'}
  else if((seg[0]==='c'||seg[0]==='user')&&seg[1]){base=seg[0]+'/'+seg[1];kind=seg[0]}
  if(!base)return {error:['watch','shorts','live','playlist','embed'].indexOf(seg[0])>=0?'video':'nochannel'};
  return {url:'https://www.youtube.com/'+base+'?sub_confirmation=1',base:base,kind:kind,cleaned:u.href.replace(/\/$/,'')!=='https://www.youtube.com/'+base};
}
var ERR={url:'eUrl',video:'eVideo',host:'eHost',nochannel:'eNoCh'};

/* ---------- 畫面 ---------- */
var input=$('#ys-in'),out=$('#ys-out'),err=$('#ys-err'),res=$('#ys-res'),copyBtn=$('#ys-copy'),test=$('#ys-test');
var qrBox=$('#ys-qrbox'),qrImg=$('#ys-qr'),PH=out.innerHTML,current=null,lastErr='',errT=0,src='paste';
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function setReady(on){
  res.classList.toggle('ok',on);copyBtn.disabled=!on;test.setAttribute('aria-disabled',String(!on));
  ['#ys-uses','#ys-uses-l'].forEach(function(s){$(s).hidden=!on});
  if(!on)qrBox.hidden=true;
}
function render(){
  var r=build(input.value);
  clearTimeout(errT);
  if(r.error){
    current=null;out.innerHTML=PH;setReady(false);test.href='https://www.youtube.com/';
    if(r.error==='empty'){err.hidden=true;return}
    /* 打字中不立刻跳錯，停 0.6 秒再顯示 */
    errT=setTimeout(function(){err.textContent=t(ERR[r.error]);err.hidden=false;
      if(lastErr!==r.error){lastErr=r.error;ga('ysub_error',{option:r.error,source:src})}},src==='example'?0:600);
    return;
  }
  err.hidden=true;lastErr='';
  if(current&&current.url===r.url)return;
  current=r;
  out.innerHTML='https://www.youtube.com/'+esc(r.base)+'<span class="add">?sub_confirmation=1</span>';
  test.href=r.url;setReady(true);drawQr(r.url);
  hyTool.result({option:r.kind,source:src,result:r.cleaned?'cleaned':'as_is'});
}

/* QR code：qrcodejs（cdnjs，MIT），用到才載入 */
var qrLib=null;
function loadQr(){
  if(qrLib)return qrLib;
  qrLib=new Promise(function(ok,no){
    if(window.QRCode)return ok();
    var s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    s.onload=function(){ok()};s.onerror=function(){qrLib=null;no(new Error('qr lib'))};document.head.appendChild(s);
  });
  return qrLib;
}
function drawQr(url){
  loadQr().then(function(){
    if(!current||current.url!==url)return;
    var box=document.createElement('div');
    new window.QRCode(box,{text:url,width:480,height:480,colorDark:'#111111',colorLight:'#ffffff',correctLevel:window.QRCode.CorrectLevel.M});
    var c=box.querySelector('canvas');
    qrImg.src=c?c.toDataURL('image/png'):(box.querySelector('img')||{}).src||'';
    qrBox.hidden=!qrImg.src;
  }).catch(function(e){qrBox.hidden=true;if(window.console)console.warn('[youtube-subscribe] QR code 載入失敗',e)});
}

/* ---------- 操作 ---------- */
var TOUCH=matchMedia('(hover:none)').matches;
async function copy(s){try{await navigator.clipboard.writeText(s);return true}catch(e){
  var ta=document.createElement('textarea');ta.value=s;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();
  var ok=false;try{ok=document.execCommand('copy')}catch(x){}ta.remove();return ok}}
input.addEventListener('input',function(){src='paste';render()});
$('#ys-ex').addEventListener('click',function(e){var b=e.target.closest('[data-ex]');if(!b)return;input.value=b.getAttribute('data-ex');src='example';render();
  ga('tool_demo',{option:String([].indexOf.call(this.querySelectorAll('[data-ex]'),b)+1)})});
copyBtn.addEventListener('click',function(){if(!current)return;var r=current;
  copy(r.url).then(function(ok){toast(ok?t('tCopied'):t('tCopyFail'));if(ok)ga('export',{method:'copy_text',option:r.kind})})});
$('#ys-qrsave').addEventListener('click',function(){if(!current||!qrImg.src)return;
  if(TOUCH){toast(t('tQrHold'));ga('export',{method:'image',option:current.kind,result:'long_press'});return}
  var a=document.createElement('a');a.href=qrImg.src;a.download='youtube-subscribe-qr.png';document.body.appendChild(a);a.click();a.remove();
  toast(t('tQr'));ga('export',{method:'image',option:current.kind,result:'download'})});
hyTool.ctaExtra=function(a){return a.id==='ys-test'&&current?{option:current.kind}:null};

/* ---------- 收藏＆分享工具 ---------- */
var tabs=ROOT.querySelectorAll('[data-os]');
function showOs(os){[].forEach.call(tabs,function(b){b.setAttribute('aria-selected',String(b.dataset.os===os))});[].forEach.call(ROOT.querySelectorAll('[data-panel]'),function(p){p.hidden=p.dataset.panel!==os})}
[].forEach.call(tabs,function(b){b.addEventListener('click',function(){showOs(b.dataset.os)})});
(function(){var u=navigator.userAgent;showOs(/iPhone|iPad|iPod/.test(u)?(/CriOS/.test(u)?'ioschrome':'ios'):(/Android/.test(u)?'android':'pc'))})();
var seen=false;
if('IntersectionObserver' in window){new IntersectionObserver(function(es,ob){es.forEach(function(e){if(e.isIntersecting)if(!seen){seen=true;ga('install_view');ob.disconnect()}})},{threshold:.3}).observe($('#ys-install'))}
ROOT.addEventListener('click',function(e){if(e.target.closest('a[href="#ys-install"]'))ga('install_jump')});
$('#ys-installed').addEventListener('click',function(){ga('install_done',{option:(ROOT.querySelector('[data-os][aria-selected="true"]')||{dataset:{}}).dataset.os});toast(t('thanks'))});
var deferred=null;
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferred=e;$('#ys-pwa').hidden=false;ga('pwa_available')});
$('#ys-pwa').addEventListener('click',function(){if(!deferred)return;deferred.prompt();deferred.userChoice.then(function(c){ga('pwa_prompt',{result:c.outcome});deferred=null;$('#ys-pwa').hidden=true})});
window.addEventListener('appinstalled',function(){ga('pwa_installed')});
$('#ys-tline').href='https://social-plugins.line.me/lineit/share?url='+encodeURIComponent(TOOL_URL);
$('#ys-tline').addEventListener('click',function(){hyTool.share('line','tool')});
$('#ys-tcopy').addEventListener('click',function(){copy(TOOL_URL).then(function(ok){toast(ok?t('urlCopied'):t('tCopyFail'))});hyTool.share('copy_link','tool')});
$('#ys-tshare').addEventListener('click',function(){var tx=t('toolTitle')+'：'+t('toolText');
  if(navigator.share){navigator.share({title:t('toolTitle'),text:tx,url:TOOL_URL}).then(function(){hyTool.share('native','tool')}).catch(function(){ga('share_cancel',{method:'native',content_type:'tool'})});return}
  hyTool.share('copy_text','tool');copy(tx+' '+TOOL_URL).then(function(ok){toast(ok?t('toolCopied'):t('tCopyFail'))})});

var tT=0;
function toast(s){var el=$('#ys-toast');el.textContent=s;el.classList.add('on');clearTimeout(tT);tT=setTimeout(function(){el.classList.remove('on')},2600)}

/* ---------- 啟動 ---------- */
if(input.value)render();
}catch(err){if(window.console)console.error('[youtube-subscribe]',err)}
})();
