
(function(){
'use strict';
/* ▼ 聯盟連結：只改這裡 */
var AFF={
  trip:'https://trip.tpk.ro/4JCNKu4q',
  agoda:'https://agoda.tpk.ro/BjCNFyqy',
  booking:'https://booking.tpk.ro/RcBdtiWX',
  klook:'https://klook.tpk.ro/yPdA5Iyi',
  kkday:'https://kkday.tpk.ro/NXjHmyP7'
};
var ROOT=document.getElementById('tp-app');
var $=function(s){return ROOT.querySelector(s)};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var ga=function(n,p){try{if(window.gtag)gtag('event',n,p||{})}catch(e){}};
var CATS=[['see','景點','#2F6FD6'],['food','美食','#D9533A'],['shop','購物','#C98410'],['fun','體驗','#8E5AB5'],['stay','住宿','#1F9A8A'],['move','交通','#5D6D7E'],['misc','其他','#888888']];
var AVC=['#111111','#D9533A','#2F6FD6','#8E5AB5','#C98410','#1F9A8A','#C2417A','#5D6D7E','#6E8F24','#A5602A'];
var WK='日一二三四五六';
var KEY='tp-trips-v1';
function uid(){return Math.random().toString(36).slice(2,8)+Date.now().toString(36).slice(-3)}
function now(){return Date.now()}
function blank(){return{id:uid(),t:'',dst:'',sd:'',nd:5,m:[],P:[],D:{},mt:0,me:''}}
var DB={cur:'',trips:{}},S=blank(),TAB='pool',FILT='all',MDAY=1,MSEL=null;

/* 工具函式 */
function cat(k){for(var i=0;i<CATS.length;i++)if(CATS[i][0]===k)return CATS[i];return CATS[6]}
function mi(n){var i=S.m.indexOf(n);return i<0?S.m.length:i}
function av(n,sz){var i=mi(n);return'<span class="av" title="'+esc(n)+'" style="background:'+AVC[i%AVC.length]+(sz?';width:'+sz+'px;height:'+sz+'px;font-size:'+(sz*.5)+'px':'')+'">'+esc((n||'?').slice(0,1))+'</span>'}
function live(){return S.P.filter(function(p){return!p.x})}
function dayOf(p){return p.d>0&&p.d<=S.nd?p.d:0}
function daySpots(d){return live().filter(function(p){return dayOf(p)===d}).sort(function(a,b){return a.o-b.o})}
function dateOf(d){if(!S.sd)return null;var x=new Date(S.sd+'T00:00:00');if(isNaN(x))return null;x.setDate(x.getDate()+d-1);return x}
function dlabel(d){var x=dateOf(d);return x?(x.getMonth()+1)+'/'+x.getDate()+'（'+WK[x.getDay()]+'）':''}
function q(p){return[p.n,p.a||S.dst].filter(Boolean).join(' ')}
function isGmap(u){return/^https?:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.google\.|maps\.app\.goo\.gl|goo\.gl\/maps)/i.test(u||'')}
function gSearch(p){return isGmap(p.l)?p.l:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q(p))}
function gDir(list,mode){if(list.length<2)return list.length?gSearch(list[0]):'';var l=list.slice(0,10);
  var u='https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(q(l[0]))+'&destination='+encodeURIComponent(q(l[l.length-1]));
  if(l.length>2)u+='&waypoints='+l.slice(1,-1).map(function(p){return encodeURIComponent(q(p))}).join('%7C');
  return u+(mode?'&travelmode='+mode:'')}
function safeUrl(u){u=String(u||'').trim();return/^https?:\/\//i.test(u)?u:''}
function touch(p){p.ts=now()}
function votes(p){return(p.v||[]).filter(function(n){return S.m.indexOf(n)>=0})}

/* 資料打包：deflate＋base64url，放在 # 後面 */
function pack(withMe){return{v:1,id:S.id,t:S.t,dst:S.dst,sd:S.sd,nd:S.nd,m:S.m,mt:S.mt,f:withMe?S.me:undefined,
  P:S.P.map(function(p){return p.x?[p.i,0,0,0,0,0,0,0,0,0,0,p.ts,1]:[p.i,p.n,p.a,p.k,p.no,p.l,p.by,p.v,p.d,p.o,p.tm,p.ts]}),D:S.D}}
function str(x,n){return String(x||'').slice(0,n)}
function unpack(o){
  var s=blank();s.id=str(o.id,20)||uid();s.t=str(o.t,40);s.dst=str(o.dst,30);
  s.sd=/^\d{4}-\d{2}-\d{2}$/.test(o.sd||'')?o.sd:'';s.nd=Math.min(Math.max(o.nd|0,1),30);
  s.m=(o.m||[]).map(function(x){return str(x,16)}).filter(Boolean).slice(0,20);s.mt=+o.mt||0;
  s.P=(o.P||[]).map(function(a){if(a[12])return{i:str(a[0],20),ts:+a[11]||0,x:1};
    return{i:str(a[0],20),n:str(a[1],60),a:str(a[2],100),k:cat(a[3])[0],no:str(a[4],300),l:safeUrl(str(a[5],500)),by:str(a[6],16),
      v:(a[7]||[]).map(function(x){return str(x,16)}),d:a[8]|0,o:+a[9]||0,tm:/^\d{2}:\d{2}$/.test(a[10]||'')?a[10]:'',ts:+a[11]||0}})
    .filter(function(p){return p.i&&(p.x||p.n)}).slice(0,400);
  Object.keys(o.D||{}).forEach(function(k){var d=o.D[k];if(d&&+k>0)s.D[k|0]={t:str(d.t,40),h:str(d.h,60),ts:+d.ts||0}});
  s.from=str(o.f,16);return s;
}
function b64u(u8){var s='';for(var i=0;i<u8.length;i+=8192)s+=String.fromCharCode.apply(null,u8.subarray(i,i+8192));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function ub64u(s){s=s.replace(/-/g,'+').replace(/_/g,'/');var b=atob(s),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}
async function encode(){var raw=new TextEncoder().encode(JSON.stringify(pack(true)));
  if('CompressionStream' in window){try{var buf=await new Response(new Blob([raw]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer();return'z'+b64u(new Uint8Array(buf))}catch(e){}}
  return'j'+b64u(raw)}
async function decode(s){var bytes=ub64u(s.slice(1)),txt;
  if(s[0]==='z')txt=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text();
  else txt=new TextDecoder().decode(bytes);return unpack(JSON.parse(txt))}
async function shareUrl(){return location.origin+location.pathname+location.search+'#trip='+await encode()}

/* 合併：以景點為單位，最後修改者勝 */
function merge(A,B){var add=0,upd=0,map={};
  A.P.forEach(function(p){map[p.i]=p});
  B.P.forEach(function(p){var a=map[p.i];if(!a){A.P.push(p);map[p.i]=p;if(!p.x)add++}
    else if(p.ts>a.ts){A.P[A.P.indexOf(a)]=p;map[p.i]=p;upd++}});
  B.m.forEach(function(n){if(A.m.indexOf(n)<0&&A.m.length<20)A.m.push(n)});
  if(B.mt>A.mt){A.t=B.t;A.dst=B.dst;A.sd=B.sd;A.nd=B.nd;A.mt=B.mt}
  Object.keys(B.D).forEach(function(k){if(!A.D[k]||B.D[k].ts>A.D[k].ts)A.D[k]=B.D[k]});
  return{add:add,upd:upd}}

/* 儲存 */
var saveT;
function save(){DB.trips[S.id]=S;DB.cur=S.id;clearTimeout(saveT);saveT=setTimeout(function(){
  try{var o={cur:DB.cur,trips:{}};Object.keys(DB.trips).forEach(function(k){var t=DB.trips[k];var p=(function(){var s=S;S=t;var r=pack(false);S=s;return r})();p.me=t.me;o.trips[k]=p});
    localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}},250)}
function loadDB(){try{var o=JSON.parse(localStorage.getItem(KEY)||'null');if(!o||!o.trips)return;
  Object.keys(o.trips).forEach(function(k){var t=unpack(o.trips[k]);t.me=str(o.trips[k].me,16);DB.trips[t.id]=t});
  DB.cur=o.cur;if(DB.trips[DB.cur])S=DB.trips[DB.cur];else{var ks=Object.keys(DB.trips);if(ks.length)S=DB.trips[ks[0]]}}catch(e){}
  try{TAB=localStorage.getItem('tp-tab')||'pool'}catch(e){}}

var toastT;
function toast(m){var t=$('#tp-toast');t.textContent=m;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove('on')},2600)}

/* ===== 畫面 ===== */
function render(){
  var ae=document.activeElement;
  if(ae!==$('#tp-title'))$('#tp-title').value=S.t;
  if(ae!==$('#tp-dst'))$('#tp-dst').value=S.dst;
  $('#tp-sd').value=S.sd;$('#tp-nd').textContent=S.nd+' 天';
  $('#tp-members').innerHTML=S.m.length?S.m.map(function(n,i){return'<span class="mchip">'+av(n)+esc(n)+'<button type="button" data-rm="'+i+'" aria-label="移除 '+esc(n)+'">×</button></span>'}).join('')
    :'<span class="note" style="margin:0">先加自己，再加旅伴，投票和提議才知道是誰。</span>';
  var me=$('#tp-me');
  if(!S.m.length)me.hidden=true;
  else{me.hidden=false;me.className='me'+(S.me&&S.m.indexOf(S.me)>=0?'':' need');
    me.innerHTML='<div style="margin-bottom:6px"><b>我是誰？</b>'+(S.me&&S.m.indexOf(S.me)>=0?'':'<span style="color:var(--sub)">（選了才能投票，旅伴也看得到是你加的景點）</span>')+'</div><div class="pick">'+
    S.m.map(function(n){return'<button type="button" data-me="'+esc(n)+'" aria-pressed="'+(n===S.me)+'">'+av(n,20)+esc(n)+'</button>'}).join('')+'</div>'}
  var trips=Object.keys(DB.trips).map(function(k){return DB.trips[k]});
  $('#tp-trips').innerHTML=(trips.length>1?'<label class="lbl" style="display:flex;align-items:center;gap:6px;flex:1;min-width:0">我的行程<select class="mini" id="tp-tsel" style="flex:1;max-width:none">'+
    trips.map(function(t){return'<option value="'+t.id+'"'+(t.id===S.id?' selected':'')+'>'+esc(t.t||'未命名行程')+'</option>'}).join('')+'</select></label>':'<span></span>')+
    '<span><button class="lnk" type="button" id="tp-demo">載入範例</button><button class="lnk" type="button" id="tp-new">＋ 新行程</button></span>';
  var L=live(),sched=L.filter(function(p){return dayOf(p)>0}).length;
  $('#tp-c-pool').textContent=L.length;$('#tp-c-plan').textContent=sched+'／'+L.length;
  $('#tp-fab-l').textContent=L.length?(S.t||'未命名行程'):'還沒有景點';
  $('#tp-fab-v').textContent=L.length?L.length+' 個景點・已排 '+sched+'・'+S.nd+' 天':'開始規劃';
  [].forEach.call($('#tp-tabs').children,function(b){b.setAttribute('aria-selected',b.dataset.tab===TAB)});
  ['pool','plan','map','guide'].forEach(function(t){$('#tp-p-'+t).hidden=t!==TAB});
  $('#tp-dest').textContent=S.dst?S.dst+'的門票和住宿':'門票和住宿';
  if(TAB==='pool')renderPool();else if(TAB==='plan')renderPlan();else if(TAB==='map')renderMap();else renderGuide();
}

function dayOpts(sel){var h='<option value="0"'+(sel?'':' selected')+'>候選（未排入）</option>';
  for(var d=1;d<=S.nd;d++)h+='<option value="'+d+'"'+(sel===d?' selected':'')+'>Day '+d+(dlabel(d)?' '+dlabel(d):'')+'</option>';return h}
function catBadge(p){var c=cat(p.k);return'<span class="cat" style="background:'+c[2]+'1f;color:'+c[2]+'">'+c[1]+'</span>'}

function renderPool(){
  [].forEach.call($('#tp-filt').children,function(b){b.setAttribute('aria-pressed',b.dataset.f===FILT)});
  var L=live();
  if(FILT==='un')L=L.filter(function(p){return!dayOf(p)});
  if(FILT==='mine')L=L.filter(function(p){return votes(p).indexOf(S.me)>=0});
  L.sort(function(a,b){return(!!dayOf(a))-(!!dayOf(b))||votes(b).length-votes(a).length||a.o-b.o});
  var box=$('#tp-pool');
  if(!L.length){box.innerHTML='<div class="empty">'+(live().length?'這個篩選沒有景點':'還沒有候選景點<br><small>輸入想去的地方，或按上方「載入範例」看看</small>')+'</div>';return}
  box.innerHTML=L.map(function(p){var v=votes(p),on=v.indexOf(S.me)>=0,d=dayOf(p);
    return'<div class="spot">'+catBadge(p)+'<div class="sm-m"><div class="sm-t">'+esc(p.n)+(d?'<span class="tag">Day '+d+'</span>':'')+'</div>'+
    (p.a?'<div class="sm-s">'+esc(p.a)+'</div>':'')+(p.no?'<div class="sm-n">'+esc(p.no)+'</div>':'')+
    (p.by?'<div class="by">'+esc(p.by)+' 提議</div>':'')+
    '<div class="sm-a"><button type="button" class="vote" data-vote="'+p.i+'" aria-pressed="'+on+'" aria-label="投票，目前 '+v.length+' 票"><i>'+(on?'♥':'♡')+'</i>'+v.length+'</button>'+
    (v.length?'<span class="avs">'+v.slice(0,5).map(function(n){return av(n)}).join('')+'</span>':'')+
    '<select class="mini" data-mv="'+p.i+'" aria-label="排入哪一天">'+dayOpts(d)+'</select>'+
    '<button type="button" class="mini" data-ed="'+p.i+'">編輯</button>'+
    '<a class="mini" style="display:inline-flex;align-items:center;text-decoration:none;color:var(--ink)" href="'+esc(gSearch(p))+'" target="_blank" rel="noopener">地圖</a></div></div></div>'}).join('');
}

function renderPlan(){
  var h='';
  for(var d=1;d<=S.nd;d++){var L=daySpots(d),dd=S.D[d]||{};
    h+='<div class="day"><div class="day-h"><div class="day-top"><span class="day-n">Day '+d+'</span><span class="day-d">'+dlabel(d)+'</span>'+
      (L.length>1?'<a class="lnk" style="margin-left:auto;font-size:.8em;color:var(--ink)" href="'+esc(gDir(L))+'" target="_blank" rel="noopener">整天路線</a>':'')+'</div>'+
      '<input class="in" data-dt="'+d+'" value="'+esc(dd.t||'')+'" placeholder="這天的主題，例如：淺草・晴空塔" maxlength="40" aria-label="Day '+d+' 主題">'+
      '<input class="in" data-dh="'+d+'" value="'+esc(dd.h||'')+'" placeholder="今晚住宿（可不填）" maxlength="60" aria-label="Day '+d+' 住宿"></div><div class="day-b">';
    if(!L.length)h+='<div class="empty" style="margin-top:10px;padding:14px 8px">這天還沒有安排</div>';
    L.forEach(function(p,k){
      if(k>0)h+='<div class="seg"><a href="'+esc(gDir([L[k-1],p],'transit'))+'" target="_blank" rel="noopener">↓ 查 '+esc(L[k-1].n)+' → '+esc(p.n)+' 交通</a></div>';
      h+='<div class="it"><span class="it-no">'+(k+1)+'</span><div class="sm-m"><div class="row" style="gap:8px;flex-wrap:nowrap"><input type="time" class="in it-tm" data-tm="'+p.i+'" value="'+esc(p.tm)+'" aria-label="'+esc(p.n)+' 時間">'+
        '<div style="min-width:0"><div class="sm-t">'+esc(p.n)+'</div><div class="sm-s">'+cat(p.k)[1]+(p.a?'・'+esc(p.a):'')+'</div></div></div>'+
        (p.no?'<div class="sm-n">'+esc(p.no)+'</div>':'')+
        '<div class="sm-a"><select class="mini" data-mv="'+p.i+'" aria-label="移到哪一天">'+dayOpts(d)+'</select><button type="button" class="mini" data-ed="'+p.i+'">編輯</button>'+
        '<a class="mini" style="display:inline-flex;align-items:center;text-decoration:none;color:var(--ink)" href="'+esc(gSearch(p))+'" target="_blank" rel="noopener">地圖</a></div></div>'+
        '<div class="it-ctl"><button type="button" data-up="'+p.i+'" aria-label="往前"'+(k?'':' disabled')+'>▲</button><button type="button" data-dn="'+p.i+'" aria-label="往後"'+(k<L.length-1?'':' disabled')+'>▼</button></div></div>'});
    h+='<div class="day-f"><button type="button" class="btn sm" data-from="'+d+'">＋ 從候選加入</button><button type="button" class="btn ghost sm" data-new="'+d+'">＋ 新景點</button>'+
      (L.some(function(p){return p.tm})?'<button type="button" class="lnk" data-sort="'+d+'">依時間排序</button>':'')+'</div></div></div>'}
  var un=live().filter(function(p){return!dayOf(p)}).length;
  h+='<p class="note" style="text-align:center">'+(un?'還有 '+un+' 個候選景點沒排進去':'候選景點都排好了')+'。天數可在上方調整。</p>';
  $('#tp-days').innerHTML=h;
}

function mapList(){return MDAY>0?daySpots(MDAY):live().filter(function(p){return!dayOf(p)}).sort(function(a,b){return votes(b).length-votes(a).length})}
function renderMap(){
  var h='<button type="button" data-md="0" aria-pressed="'+(MDAY===0)+'">候選</button>';
  for(var d=1;d<=S.nd;d++)h+='<button type="button" data-md="'+d+'" aria-pressed="'+(MDAY===d)+'">Day '+d+'</button>';
  $('#tp-mday').innerHTML=h;
  var L=mapList();
  if(!L.some(function(p){return p.i===MSEL}))MSEL=L.length?L[0].i:null;
  $('#tp-mlist').innerHTML=L.length?L.map(function(p,k){return'<li data-ms="'+p.i+'" aria-current="'+(p.i===MSEL)+'"><span class="it-no">'+(k+1)+'</span><span class="t">'+esc(p.n)+
    '<small>'+(p.tm?p.tm+'・':'')+cat(p.k)[1]+(p.a?'・'+esc(p.a):'')+'</small></span><a href="'+esc(gSearch(p))+'" target="_blank" rel="noopener">開啟 ↗</a></li>'}).join('')
    :'<li style="cursor:default;color:var(--sub);justify-content:center">'+(MDAY?'這天還沒有排景點':'沒有未排入的候選景點')+'</li>';
  var sel=L.filter(function(p){return p.i===MSEL})[0],w=$('#tp-mapw'),src;
  if(sel)src='https://maps.google.com/maps?q='+encodeURIComponent(q(sel))+'&hl=zh-TW&z=15&output=embed';
  else if(S.dst)src='https://maps.google.com/maps?q='+encodeURIComponent(S.dst)+'&hl=zh-TW&z=11&output=embed';
  var fr=w.querySelector('iframe');
  if(src){if(!fr||fr.dataset.src!==src)w.innerHTML='<iframe loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Google 地圖" data-src="'+esc(src)+'" src="'+esc(src)+'"></iframe>'}
  else w.innerHTML='<div class="ph">加入景點後，這裡會顯示地圖</div>';
  var r=$('#tp-route');
  if(MDAY>0&&L.length>=2){r.hidden=false;r.href=gDir(L);r.textContent='在 Google 地圖開啟 Day '+MDAY+' 路線'+(L.length>10?'（前 10 站）':'')}
  else if(L.length===1){r.hidden=false;r.href=gSearch(L[0]);r.textContent='在 Google 地圖開啟'}
  else r.hidden=true;
}

function guideData(){var days=[];for(var d=1;d<=S.nd;d++)days.push({d:d,L:daySpots(d),dd:S.D[d]||{}});return days}
function dateRange(){var a=dateOf(1),b=dateOf(S.nd);if(!a)return S.nd+' 天';
  var f=function(x){return x.getFullYear()+'/'+(x.getMonth()+1)+'/'+x.getDate()+'（'+WK[x.getDay()]+'）'};return f(a)+' – '+f(b)+'・'+S.nd+' 天'}
function renderGuide(){
  var days=guideData(),L=live(),sched=L.filter(function(p){return dayOf(p)>0}),back=L.filter(function(p){return!dayOf(p)});
  var h='<div class="g-cover"><div class="k">TRAVEL GUIDEBOOK</div><h4>'+esc(S.t||'我的旅行')+'</h4><p>'+(S.dst?esc(S.dst)+'・':'')+dateRange()+'</p>'+
    (S.m.length?'<p>旅伴：'+S.m.map(esc).join('、')+'</p>':'')+
    '<div class="g-sum"><div><b>'+S.nd+'</b>天</div><div><b>'+sched.length+'</b>個行程</div><div><b>'+S.m.length+'</b>位旅伴</div></div></div>';
  if(!sched.length)h+='<div class="empty">把景點排進「每日行程」後，這裡會自動變成旅遊手冊。</div>';
  days.forEach(function(x){if(!x.L.length&&!x.dd.t&&!x.dd.h)return;
    h+='<div class="g-day"><h5>Day '+x.d+(x.dd.t?'・'+esc(x.dd.t):'')+'<span>'+dlabel(x.d)+'</span></h5>'+(x.dd.h?'<div class="g-hotel">今晚住宿：'+esc(x.dd.h)+'</div>':'');
    x.L.forEach(function(p,k){h+='<div class="g-it"><div class="g-tm">'+(p.tm||'—')+'</div><div class="g-nm">'+esc(p.n)+'<small>'+cat(p.k)[1]+'</small></div><div class="g-ds">'+
      (p.a?'<div class="ad">'+esc(p.a)+'</div>':'')+(p.no?'<div>'+esc(p.no)+'</div>':'')+
      '<a href="'+esc(gSearch(p))+'" target="_blank" rel="noopener">Google 地圖</a>'+(k<x.L.length-1?'・<a href="'+esc(gDir([p,x.L[k+1]],'transit'))+'" target="_blank" rel="noopener">到下一站交通</a>':'')+
      (p.l&&!isGmap(p.l)?'・<a href="'+esc(p.l)+'" target="_blank" rel="noopener">相關連結</a>':'')+'</div></div>'});
    if(x.L.length>1)h+='<div class="g-ds" style="grid-column:auto;margin-top:4px"><a href="'+esc(gDir(x.L))+'" target="_blank" rel="noopener">開啟 Day '+x.d+' 整天路線 ↗</a></div>';
    h+='</div>'});
  if(back.length)h+='<div class="g-day"><h5>備案清單<span>時間多出來可以去</span></h5>'+back.map(function(p){return'<div class="g-it"><div class="g-tm">♡'+votes(p).length+'</div><div class="g-nm">'+esc(p.n)+'<small>'+cat(p.k)[1]+'</small></div><div class="g-ds">'+(p.a?'<span class="ad">'+esc(p.a)+'</span>・':'')+'<a href="'+esc(gSearch(p))+'" target="_blank" rel="noopener">Google 地圖</a></div></div>'}).join('')+'</div>';
  h+='<div class="g-foot">用 knittinghiyori.com 旅遊行程共編工具製作</div>';
  $('#tp-guide').innerHTML=h;
}
function guideText(url){var t='【'+(S.t||'我的旅行')+'】'+(S.dst?S.dst+'・':'')+dateRange()+'\n';
  if(S.m.length)t+='旅伴：'+S.m.join('、')+'\n';
  guideData().forEach(function(x){if(!x.L.length)return;t+='\n■ Day '+x.d+(dlabel(x.d)?' '+dlabel(x.d):'')+(x.dd.t?'｜'+x.dd.t:'')+'\n';
    x.L.forEach(function(p){t+='・'+(p.tm?p.tm+' ':'')+p.n+(p.no?'（'+p.no+'）':'')+'\n'});
    if(x.dd.h)t+='  住宿：'+x.dd.h+'\n';
    if(x.L.length>1)t+='  路線：'+gDir(x.L)+'\n'});
  var back=live().filter(function(p){return!dayOf(p)});if(back.length)t+='\n■ 備案：'+back.map(function(p){return p.n}).join('、')+'\n';
  return t+(url?'\n一起編輯：'+url:'')}

/* ===== 操作 ===== */
function find(i){for(var k=0;k<S.P.length;k++)if(S.P[k].i===i)return S.P[k]}
function maxO(d){var L=daySpots(d);return L.length?L[L.length-1].o+1:1}
function commit(){save();render()}
function addSpot(o){var p={i:uid(),n:o.n,a:o.a||'',k:o.k||'see',no:o.no||'',l:o.l||'',by:S.me||'',v:S.me?[S.me]:[],d:o.d||0,o:0,tm:o.tm||'',ts:now()};
  p.o=maxO(p.d);S.P.push(p);ga('tp_add_spot',{count:live().length});return p}

$('#tp-title').addEventListener('input',function(e){S.t=e.target.value.trim();S.mt=now();save();$('#tp-fab-l').textContent=S.t||'未命名行程'});
$('#tp-dst').addEventListener('input',function(e){S.dst=e.target.value.trim();S.mt=now();save()});
$('#tp-dst').addEventListener('change',render);
$('#tp-sd').addEventListener('change',function(e){S.sd=e.target.value;S.mt=now();commit()});
function setDays(n){n=Math.min(Math.max(n,1),30);if(n===S.nd)return;
  if(n<S.nd&&S.P.some(function(p){return!p.x&&p.d>n})){if(!confirm('Day '+(n+1)+' 之後的景點會移回候選清單，確定嗎？'))return;
    S.P.forEach(function(p){if(!p.x&&p.d>n){p.d=0;touch(p)}})}
  S.nd=n;S.mt=now();commit()}
$('#tp-dminus').addEventListener('click',function(){setDays(S.nd-1)});
$('#tp-dplus').addEventListener('click',function(){setDays(S.nd+1)});
$('#tp-mform').addEventListener('submit',function(e){e.preventDefault();var inp=$('#tp-mname'),added=0;
  inp.value.split(/[,，、\s]+/).map(function(s){return s.trim().slice(0,16)}).filter(Boolean).forEach(function(n){if(S.m.length>=20)return;if(S.m.indexOf(n)>=0){toast('「'+n+'」已經在名單中');return}
    S.m.push(n);added++;if(!S.me)S.me=n});
  inp.value='';if(added){commit()}inp.focus()});
ROOT.addEventListener('click',function(e){var t=e.target.closest('button,li[data-ms]');if(!t||!ROOT.contains(t))return;var ds=t.dataset,p;
  if(ds.rm!=null){var n=S.m[+ds.rm];if(S.P.some(function(p){return!p.x&&(p.by===n||votes(p).indexOf(n)>=0)})&&!confirm('移除 '+n+' 會一併拿掉他的投票，確定嗎？'))return;
    S.m.splice(+ds.rm,1);if(S.me===n)S.me='';S.P.forEach(function(p){if(p.v&&p.v.indexOf(n)>=0){p.v=p.v.filter(function(x){return x!==n});touch(p)}});commit();return}
  if(ds.me!=null){S.me=ds.me;commit();toast('嗨，'+ds.me+'！');return}
  if(ds.tab){TAB=ds.tab;try{localStorage.setItem('tp-tab',TAB)}catch(e){}render();ga('tp_tab',{tab:TAB});
    if(innerWidth<900)$('#tp-tabs').scrollIntoView({behavior:'smooth',block:'start'});return}
  if(ds.f){FILT=ds.f;renderPool();return}
  if(ds.vote){if(!S.me||S.m.indexOf(S.me)<0){toast('先在上方選「我是誰」才能投票');$('#tp-me').scrollIntoView({behavior:'smooth',block:'center'});return}
    p=find(ds.vote);var v=votes(p),k=v.indexOf(S.me);if(k>=0)v.splice(k,1);else v.push(S.me);p.v=v;touch(p);commit();ga('tp_vote');return}
  if(ds.ed){openForm(ds.ed);return}
  if(ds.new){openForm(null,+ds.new);return}
  if(ds.up||ds.dn){p=find(ds.up||ds.dn);var L=daySpots(dayOf(p)),i=L.indexOf(p),j=ds.up?i-1:i+1;if(j<0||j>=L.length)return;
    var o=p.o;p.o=L[j].o;L[j].o=o;if(p.o===L[j].o)p.o+=ds.up?-.5:.5;touch(p);touch(L[j]);commit();return}
  if(ds.sort){var d=+ds.sort;daySpots(d).sort(function(a,b){return(a.tm||'99')<(b.tm||'99')?-1:(a.tm||'99')>(b.tm||'99')?1:a.o-b.o}).forEach(function(p,k){if(p.o!==k+1){p.o=k+1;touch(p)}});commit();toast('已依時間排序');return}
  if(ds.from){openPicker(+ds.from);return}
  if(ds.pick){p=find(ds.pick);p.d=PDAY;p.o=maxO(PDAY);touch(p);save();render();drawPicker();toast('已排入 Day '+PDAY);return}
  if(ds.md!=null){MDAY=+ds.md;MSEL=null;renderMap();return}
  if(ds.ms){MSEL=ds.ms;renderMap();return}
});
ROOT.addEventListener('change',function(e){var t=e.target,ds=t.dataset,p;
  if(ds.mv){p=find(ds.mv);p.d=+t.value;p.o=maxO(p.d);touch(p);commit();toast(p.d?'已排入 Day '+p.d:'已移回候選');ga('tp_schedule');return}
  if(ds.tm){p=find(ds.tm);p.tm=t.value;touch(p);save();return}
  if(t.id==='tp-tsel'){S=DB.trips[t.value];MSEL=null;MDAY=1;commit();return}
});
ROOT.addEventListener('input',function(e){var t=e.target,ds=t.dataset;
  if(ds.dt||ds.dh){var d=+(ds.dt||ds.dh),x=S.D[d]||(S.D[d]={t:'',h:'',ts:0});x[ds.dt?'t':'h']=t.value.trim();x.ts=now();save()}});
ROOT.addEventListener('click',function(e){var b=e.target.closest('#tp-demo,#tp-new');if(!b)return;
  if(b.id==='tp-new'){if(!live().length&&!S.t){toast('這已經是空白行程了');return}S=blank();S.me='';MSEL=null;commit();toast('已開新行程，舊的在「我的行程」選單');$('#tp-title').focus();return}
  loadDemo()});

/* 快速新增 */
$('#tp-qform').addEventListener('submit',function(e){e.preventDefault();var n=$('#tp-qname').value.trim().slice(0,60);
  if(!n){$('#tp-qname').focus();return}addSpot({n:n});$('#tp-qname').value='';commit();toast('已加入候選'+(S.me?'，也幫你投了一票':''));$('#tp-qname').focus()});
$('#tp-qmore').addEventListener('click',function(){openForm(null,0,$('#tp-qname').value.trim())});
$('#tp-fab-add').addEventListener('click',function(){openForm(null,TAB==='plan'?1:0)});

/* 編輯表單 */
var dlg=$('#tp-dlg'),EID=null,EK='see';
function drawK(){$('#tp-ek').innerHTML=CATS.map(function(c){return'<button type="button" data-k="'+c[0]+'" aria-pressed="'+(c[0]===EK)+'"><i style="width:8px;height:8px;border-radius:50%;background:'+c[2]+'"></i>'+c[1]+'</button>'}).join('')}
$('#tp-ek').addEventListener('click',function(e){var b=e.target.closest('[data-k]');if(b){e.stopPropagation();EK=b.dataset.k;drawK()}});
function openForm(id,day,name){var p=id?find(id):null;EID=id;EK=p?p.k:'see';
  $('#tp-dlg-t').textContent=p?'編輯景點':'新增景點';$('#tp-en').value=p?p.n:(name||'');$('#tp-ea').value=p?p.a:'';
  $('#tp-ed').innerHTML=dayOpts(p?dayOf(p):(day||0));$('#tp-et').value=p?p.tm:'';$('#tp-eno').value=p?p.no:'';$('#tp-el').value=p?p.l:'';
  $('#tp-edel').hidden=!p;$('#tp-eerr').textContent='';drawK();dlg.showModal();setTimeout(function(){$('#tp-en').focus()},60)}
$('#tp-close').addEventListener('click',function(){dlg.close()});
dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});
$('#tp-eform').addEventListener('submit',function(e){e.preventDefault();var n=$('#tp-en').value.trim(),l=$('#tp-el').value.trim();
  if(!n){$('#tp-eerr').textContent='請輸入名稱';$('#tp-en').focus();return}
  if(l&&!safeUrl(l)){$('#tp-eerr').textContent='連結請用 https:// 開頭';return}
  var d=+$('#tp-ed').value,o={n:n.slice(0,60),a:$('#tp-ea').value.trim().slice(0,100),k:EK,no:$('#tp-eno').value.trim().slice(0,300),l:safeUrl(l),d:d,tm:$('#tp-et').value};
  if(EID){var p=find(EID);if(p.d!==d)p.o=maxO(d);Object.assign(p,o);touch(p)}else{addSpot(o);$('#tp-qname').value=''}
  commit();dlg.close();toast(EID?'已更新':'已加入'+(d?' Day '+d:'候選'))});
$('#tp-edel').addEventListener('click',function(){if(!EID||!confirm('刪除這個景點？旅伴合併後也會一起刪除。'))return;var p=find(EID);
  Object.keys(p).forEach(function(k){if(k!=='i')delete p[k]});p.x=1;touch(p);commit();dlg.close();toast('已刪除')});

/* 從候選加入 */
var pdlg=$('#tp-pdlg'),PDAY=1;
function openPicker(d){PDAY=d;$('#tp-pdlg-t').textContent='加入 Day '+d+(dlabel(d)?' '+dlabel(d):'');drawPicker();pdlg.showModal()}
function drawPicker(){var L=live().filter(function(p){return!dayOf(p)}).sort(function(a,b){return votes(b).length-votes(a).length});
  $('#tp-plist').innerHTML=L.length?L.map(function(p){return'<div class="spot">'+catBadge(p)+'<div class="sm-m"><div class="sm-t">'+esc(p.n)+'</div><div class="sm-s">♥ '+votes(p).length+(p.a?'・'+esc(p.a):'')+'</div></div><button type="button" class="btn sm" data-pick="'+p.i+'">加入</button></div>'}).join('')
    :'<div class="empty">候選清單空了<br><small>可以按「＋ 新景點」直接加進這天</small></div>'}
$('#tp-pclose').addEventListener('click',function(){pdlg.close()});
pdlg.addEventListener('click',function(e){if(e.target===pdlg)pdlg.close()});

/* 匯出 CSV（Google My Maps） */
function csvCell(s){s=String(s==null?'':s);return/[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s}
$('#tp-csv').addEventListener('click',function(){var L=live();if(!L.length){toast('還沒有景點可以匯出');return}
  var rows=[['名稱','地點','天數','日期','時間','順序','分類','備註','投票數','連結']];
  L.slice().sort(function(a,b){return(dayOf(a)||99)-(dayOf(b)||99)||a.o-b.o}).forEach(function(p){var d=dayOf(p),L2=d?daySpots(d):[];
    rows.push([p.n,q(p),d?'Day '+d:'候選',d?dlabel(d):'',p.tm,d?L2.indexOf(p)+1:'',cat(p.k)[1],p.no,votes(p).length,p.l||gSearch(p)])});
  var blob=new Blob(['﻿'+rows.map(function(r){return r.map(csvCell).join(',')}).join('\r\n')],{type:'text/csv;charset=utf-8'});
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(S.t||'trip').replace(/[\\/:*?"<>|]/g,'')+'-mymaps.csv';document.body.appendChild(a);a.click();
  setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500);toast('已下載 CSV，照下方步驟匯入 My Maps');ga('tp_export_csv',{spots:L.length});
  var dt=$('#tp-p-map details');if(dt)dt.open=true});
$('#tp-route').addEventListener('click',function(){ga('tp_open_route',{day:MDAY})});

/* 手冊 */
$('#tp-print').addEventListener('click',function(){renderGuide();ga('tp_print');window.print()});
$('#tp-gcopy').addEventListener('click',async function(){if(!live().length){toast('還沒有行程');return}var ok=await copy(guideText(await shareUrl()));toast(ok?'已複製文字版，可以貼到 LINE 記事本':'複製失敗');ga('share',{method:'copy_text',tool:'trip_planner'})});

/* 分享 */
function copy(t){if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(t).then(function(){return true},fb);return Promise.resolve(fb());
  function fb(){var a=document.createElement('textarea');a.value=t;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();var ok=false;try{ok=document.execCommand('copy')}catch(e){}document.body.removeChild(a);return ok}}
async function doShare(){if(!live().length&&!S.m.length){toast('先加入旅伴或景點再分享吧');return}
  var url=await shareUrl(),txt='一起來排【'+(S.t||'旅行')+'】行程！點連結加入想去的景點、按愛心投票，改完再把連結傳回來：';
  ga('share',{method:'link',tool:'trip_planner',members:S.m.length,spots:live().length});
  if(navigator.share&&matchMedia('(pointer:coarse)').matches){try{await navigator.share({title:(S.t||'旅行')+' 行程',text:txt,url:url});return}catch(e){if(e.name==='AbortError')return}}
  var ok=await copy(txt+'\n'+url);toast(ok?'連結已複製，貼到 LINE 群組給旅伴吧':'複製失敗，請稍後再試')}
$('#tp-share').addEventListener('click',doShare);$('#tp-fab-share').addEventListener('click',doShare);
$('#tp-copytext').addEventListener('click',async function(){if(!live().length){toast('還沒有行程');return}var ok=await copy(guideText(''));toast(ok?'行程文字已複製':'複製失敗')});

/* 聯盟連結 */
[].forEach.call(ROOT.querySelectorAll('[data-aff]'),function(a){var k=a.dataset.aff;if(AFF[k])a.href=AFF[k];
  a.addEventListener('click',function(){ga('affiliate_click',{platform:k,link_url:a.href,tool:'trip_planner',destination:S.dst||'none',spots:live().length})})});

/* 範例 */
function loadDemo(){if(live().length&&!confirm('範例會開成一份新行程，你目前的行程會保留在「我的行程」選單，確定嗎？'))return;
  S=blank();S.t='東京五日遊（範例）';S.dst='東京';S.nd=5;S.m=['小明','阿華','小美'];S.me='小明';S.mt=now();
  var sp=[['淺草寺','台東區浅草2-3-1','see','早上 8 點前人少好拍照',1,'08:30',['小明','小美']],['晴空塔','墨田区押上1-1-2','see','天望甲板門票先在網路買',1,'11:00',['小明','阿華','小美']],
    ['一蘭拉麵 淺草店','台東區','food','',1,'13:00',['阿華']],['上野阿美橫町','台東區上野','shop','買零食、藥妝',1,'16:00',['小美']],
    ['明治神宮','澀谷區代々木神園町','see','',2,'09:30',['小明']],['表參道・原宿竹下通','澀谷區','shop','',2,'11:30',['小美','阿華']],
    ['澀谷 SKY','澀谷區渋谷2-24-12','fun','日落時段要提前 4 週預約',2,'17:00',['小明','阿華','小美']],['築地場外市場','中央區築地','food','玉子燒、海鮮丼',3,'09:00',['阿華','小明']],
    ['teamLab Planets','江東區豊洲6-1-16','fun','穿短褲，要涉水',3,'13:00',['小美','小明']],['台場 獨角獸鋼彈','江東區青海','see','',3,'17:30',['阿華']],
    ['新宿御苑','新宿區内藤町11','see','週一休園',0,'',['小美']],['吉卜力美術館','三鷹市下連雀1-1-83','fun','每月 10 號開放下個月門票',0,'',['小美','小明']],
    ['燒肉 敘敘苑','新宿區','food','',0,'',['阿華']]];
  var t=now()-60000;sp.forEach(function(x,k){S.P.push({i:uid(),n:x[0],a:x[1],k:x[2],no:x[3],l:'',by:S.m[k%3],v:x[6],d:x[4],o:k,tm:x[5],ts:t+k})});
  S.D={1:{t:'淺草・晴空塔・上野',h:'上野站附近飯店',ts:t},2:{t:'原宿・澀谷',h:'',ts:t},3:{t:'築地・豐洲・台場',h:'',ts:t}};
  TAB='plan';commit();toast('已載入範例行程');ga('tp_demo')}

/* 啟動 */
async function importHash(){
  var m=location.hash.match(/[#&]trip=([\w-]+)/);
  if(m){try{var inc=await decode(m[1]),ex=DB.trips[inc.id];
      if(ex){S=ex;var r=merge(S,inc);toast((inc.from?'已合併 '+inc.from+' 的修改':'已合併旅伴的修改')+'：新增 '+r.add+'、更新 '+r.upd+' 個景點');ga('tp_merge',{added:r.add,updated:r.upd})}
      else{S=inc;S.me='';toast((inc.from?inc.from+' 邀你一起排行程':'已開啟旅伴分享的行程')+'，先選「我是誰」吧');ga('tp_open_shared')}
      delete S.from;save();if(history.replaceState)history.replaceState(null,'',location.pathname+location.search)}
    catch(e){toast('連結無法讀取，已開啟你自己的行程')}}
  return!!m}
window.addEventListener('hashchange',async function(){if(await importHash()){MSEL=null;render()}});
(async function(){
  loadDB();
  var m=await importHash();
  if(!DB.trips[S.id]&&(live().length||S.m.length))save();
  render();
  if(m&&(!S.me||S.m.indexOf(S.me)<0))setTimeout(function(){$('#tp-me').scrollIntoView({behavior:'smooth',block:'center'})},400);
})();
})();
