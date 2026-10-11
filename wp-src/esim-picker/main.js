
var ESIM = (function () {
  var P = {
    tw: { name: '台灣', en: 'Taiwan',
      saily:  { f: [[1,7,3.99],[3,30,8.99],[5,30,11.99],[10,30,19.99],[20,30,30.99]], u: {5:18.99,10:34.99,15:48.99,20:59.99,25:65.99,30:71.99}, cap: 5 },
      airalo: { f: [[1,3,4],[3,3,8.5],[3,7,9],[5,7,11],[5,15,11.5],[5,30,12],[10,7,17.5],[10,15,18],[10,30,19],[20,15,28],[20,30,29],[50,30,49]], u: {3:11.5,5:19,7:26,10:35,15:49,30:73.5}, cap: 3 },
      yesim:  { f: [[1,30,2.92],[3,30,5.84],[5,30,10.51],[10,30,14.01],[20,30,18.68],[30,30,23.35]], u: {7:22.18,15:33.85,30:45.53}, cap: 0 } },
    jp: { name: '日本', en: 'Japan',
      saily:  { f: [[1,7,3.99],[3,30,7.99],[5,30,10.99],[10,30,17.99],[20,30,24.99]], u: {5:18.99,7:28.99,10:34.99,15:48.99,20:59.99,25:65.99,30:71.99}, cap: 5 },
      airalo: { f: [[1,3,4],[3,3,7.5],[3,7,8],[5,7,10],[5,15,10.5],[5,30,11],[10,7,17],[10,15,17.5],[10,30,18],[20,15,24],[20,30,25],[50,30,59]], u: {3:11.5,5:17,7:26,10:34.5,15:48,30:69}, cap: 3 },
      yesim:  { f: [[1,30,4.24],[5,30,10.09],[10,30,18.35],[20,30,28.44],[30,30,37.85]], u: {1:4.01,2:8.03,3:12.04,4:16.06,5:20.07,6:24.09,7:28.10,8:29.75,9:31.40,10:33.04,12:36.35,15:41.29,20:48.55,25:55.82,30:63.08}, cap: 0 } },
    kr: { name: '韓國', en: 'South Korea',
      saily:  { f: [[1,7,3.99],[3,30,8.99],[5,30,10.99],[10,30,18.99],[20,30,29.99]], u: {5:18.99,10:34.99,15:48.99,20:59.99,25:65.99,30:71.99}, cap: 5 },
      airalo: { f: [[1,3,4],[1,7,8.5],[3,3,8],[3,7,9],[5,7,10],[5,15,10.5],[5,30,11],[10,7,18],[10,15,18.5],[10,30,19],[20,15,29],[20,30,30],[50,30,49]], u: {3:12,5:20,7:29,10:35,15:49,30:69}, cap: 3 },
      yesim:  { f: [[1,30,2.90],[10,30,18.57],[20,30,27.04],[30,30,33.88]], u: {5:20.31,7:28.43,10:34.74,15:45.25,30:66.14}, cap: 0 } },
    th: { name: '泰國', en: 'Thailand',
      saily:  { f: [[1,7,2.99],[3,30,5.99],[5,30,7.99],[10,30,10.99],[20,30,19.99]], u: {5:18.99,7:28.99,10:34.99,15:48.99,20:59.99,25:65.99,30:71.99}, cap: 5 },
      airalo: { f: [[1,3,4],[3,3,5.5],[3,7,6],[5,7,7],[5,15,7.5],[5,30,8],[10,7,10],[10,15,10.5],[10,30,11],[20,15,17.5],[20,30,18],[50,30,27.5]], u: {5:15,7:21,15:39,30:49}, cap: 5 },
      yesim:  { f: [[1,30,3.00],[5,30,8.08],[10,30,12.69],[20,30,19.61],[30,30,26.54],[50,30,39.23]], u: {5:18.46,7:25.84,10:29.54,15:35.77,30:48.46}, cap: 0 } },
    vn: { name: '越南', en: 'Vietnam',
      saily:  { f: [[1,7,3.99],[3,30,7.99],[5,30,10.99],[10,30,17.99],[20,30,28.99]], u: {5:18.99,10:34.99,15:48.99,20:59.99,25:65.99,30:71.99}, cap: 5 },
      airalo: { f: [[1,3,4],[3,3,7.5],[5,7,10],[10,7,17],[20,15,28],[50,30,49]], u: {3:11.5,7:26,30:69}, cap: 3 },
      yesim:  { f: [[1,30,2.87],[3,30,8.03],[5,30,11.02],[10,30,18.36],[20,30,25.25],[30,30,32.13]], u: {5:20.08,7:28.12,10:34.36,15:44.76,30:65.41}, cap: 0 } },
    hk: { name: '香港', en: 'Hong Kong',
      saily:  { f: [[1,7,3.99],[3,30,8.99],[5,30,11.99],[10,30,19.99],[20,30,36.99]], u: {5:18.99,10:34.99,15:48.99,20:59.99,25:65.99,30:71.99}, cap: 5 },
      airalo: { f: [[1,3,4],[3,3,8],[3,7,8.5],[5,7,11],[5,15,11.5],[5,30,12],[10,7,17],[10,15,17.5],[10,30,18],[20,15,28],[20,30,29],[50,30,49]], u: {3:11.5,5:19,7:26,30:71}, cap: 3 },
      yesim:  { f: [[1,30,2.87],[5,30,11.02],[10,30,18.36],[20,30,25.25],[30,30,32.13]], u: {5:20.08,7:28.12,10:34.36,15:44.76,30:65.41}, cap: 0 } },
    sg: { name: '新加坡', en: 'Singapore',
      saily:  { f: [[1,7,3.99],[3,30,6.99],[5,30,9.99],[10,30,15.99],[20,30,22.99]], u: {5:18.99,10:34.99,15:48.99,20:59.99,25:65.99,30:71.99}, cap: 5 },
      airalo: { f: [[1,3,4],[3,3,6.5],[3,7,7],[5,7,9],[5,15,9.5],[5,30,10],[10,7,15],[10,15,15.5],[10,30,16],[20,15,22],[20,30,23],[50,30,48]], u: {3:11.5,5:18.5,7:26,30:69}, cap: 3 },
      yesim:  { f: [[1,30,2.90],[5,30,11.15],[10,30,18.58],[20,30,25.55],[30,30,32.52]], u: {5:20.32,7:28.45,10:34.77,15:45.29,30:66.20}, cap: 0 } },
    cn: { name: '中國', en: 'China',
      saily:  { f: [[1,7,4.49],[3,30,10.99],[5,30,15.99],[10,30,26.99],[20,30,45.99]], u: {5:18.99,10:34.99,15:48.99,20:59.99,25:65.99,30:71.99}, cap: 5 },
      airalo: { f: [[1,3,4],[3,3,9.5],[5,7,14.5],[5,15,15],[5,30,15.5],[10,7,24.5],[10,15,25.5],[10,30,26.5],[20,15,39],[20,30,40],[50,30,49]], u: {3:11.5,5:19,7:27,10:35,15:49,30:69}, cap: 3 },
      yesim:  { f: [[1,30,3.25],[3,30,8.12],[5,30,12.76],[10,30,21.58],[20,30,34.58],[30,30,44.09]], u: {5:20.89,7:29.24,10:36.12,15:47.57,30:73.10}, cap: 0 } },
    us: { name: '美國', en: 'USA',
      saily:  { f: [[1,7,3.99],[3,30,8.99],[5,30,13.99],[10,30,22.99],[20,30,36.99]], u: {5:18.99,7:28.99,10:34.99,15:48.99,20:59.99,25:65.99,30:71.99}, cap: 5 },
      airalo: { f: [[1,3,4],[1,7,8.5],[3,3,8.5],[3,7,9],[5,7,12.5],[5,15,13],[5,30,13.5],[10,7,21.5],[10,15,22],[10,30,22.5],[20,15,36],[20,30,36.5],[50,30,42]], u: {3:11.5,5:18.5,7:25,10:34,15:46,30:68}, cap: 5 },
      yesim:  { f: [[1,30,3.56],[5,30,10.33],[10,30,16.07],[20,30,24.10],[30,30,30.53]], u: {5:16.64,7:23.30,10:27.04,15:33.28,30:51.64}, cap: 0 } },
    uk: { name: '英國', en: 'UK',
      saily:  { f: [[1,7,4.49],[3,30,8.99],[5,30,12.99],[10,30,18.99],[20,30,30.99]], u: {7:28.99,10:34.99,15:48.99,20:59.99,25:65.99,30:71.99}, cap: 5 },
      airalo: { f: [[1,3,4],[3,3,8],[3,7,9],[5,7,12],[5,15,13],[5,30,14],[10,7,18],[10,15,18.5],[10,30,19],[20,15,30],[20,30,31],[50,30,39]], u: {3:10,5:16.5,7:23.5,10:28,15:39,30:58}, cap: 3 },
      yesim:  { f: [[1,30,2.90],[5,30,11.14],[10,30,18.57],[20,30,25.53],[30,30,32.49]], u: {5:20.31,7:28.43,10:34.74,15:45.25,30:66.14}, cap: 0 } },
    eu: { name: '歐洲多國', en: 'Europe',
      saily:  { f: [[1,7,4.99],[3,30,12.49],[5,30,19.49],[10,30,35.99],[50,90,95.99]], u: {7:28.99,10:35.99,15:49.99,20:59.99,25:65.99,30:71.99}, cap: 5 },
      airalo: { f: [[1,3,5],[3,3,10],[3,7,11],[5,7,18.5],[5,15,19],[5,30,19.5],[10,7,26],[10,15,28],[10,30,31],[20,15,47],[20,30,48],[50,30,70]], u: {3:11.5,5:19.5,7:27,10:35,15:49,30:71}, cap: 5 },
      yesim:  { f: [[1,30,2.87],[5,30,11.02],[10,30,18.36],[20,30,25.25],[30,30,32.13]], u: {7:24.10,15:37.87,30:64.26}, cap: 0 } }
  };
  var USAGE = {
    l: { gb: 0.5, label: '輕度', desc: '地圖、LINE、查餐廳', el: 'Light', ed: 'Maps, messaging, looking things up' },
    m: { gb: 1,   label: '一般', desc: '再加 IG／FB、傳照片', el: 'Normal', ed: 'Plus social feeds and photo uploads' },
    h: { gb: 2,   label: '重度', desc: '常看短影音、視訊通話', el: 'Heavy', ed: 'Short videos and video calls' },
    x: { gb: 4,   label: '狂用', desc: '追劇、開熱點給旅伴', el: 'Max', ed: 'Streaming, or hotspot for others' }
  };
  var BRANDS = ['saily', 'airalo', 'yesim'];
  var BRAND_NAME = { saily: 'Saily', airalo: 'Airalo', yesim: 'Yesim' };
  var CODE_OFF = 5;
  function need(days, u) { return Math.ceil(days * USAGE[u].gb * 10) / 10; }
  function bestFor(country, brand, days, u, useCode) {
    var d = P[country][brand], n = need(days, u), perDay = USAGE[u].gb, opts = [];
    d.f.forEach(function (p) {
      if (p[1] < days) return;
      var k = Math.ceil(n / p[0]);
      if (k > 3) return;
      opts.push({ type: 'fixed', gb: p[0], qty: k, days: p[1], price: +(p[2] * k).toFixed(2) });
    });
    Object.keys(d.u).forEach(function (k) {
      k = +k; if (k < days) return;
      opts.push({ type: 'unl', days: k, price: d.u[k], cap: d.cap, capWarn: d.cap > 0 ? perDay > d.cap : false });
    });
    if (!opts.length) return null;
    function score(o) { return o.price + (o.capWarn ? o.price * 0.2 + 3 : 0) + (o.qty > 1 ? (o.qty - 1) * 1.5 : 0); }
    opts.sort(function (a, b) { return score(a) - score(b); });
    var best = opts[0];
    var upg = null;
    if (best.type === 'fixed') {
      opts.forEach(function (o) {
        if (o.type !== 'unl') return;
        if (o.capWarn) return;
        if (upg) { if (o.price >= upg.price) return; }
        upg = o;
      });
      if (upg) { if (upg.price - best.price > Math.max(8, best.price * 0.35)) upg = null; }
    }
    var eff = best.price;
    if (brand === 'saily') { if (useCode) eff = Math.max(0, +(best.price - CODE_OFF).toFixed(2)); }
    return { brand: brand, plan: best, eff: eff, upgrade: upg, need: n };
  }
  function rank(country, days, u, useCode) {
    return BRANDS.map(function (b) { return bestFor(country, b, days, u, useCode); })
      .filter(Boolean).sort(function (a, b) { return pen(a) - pen(b); });
    function pen(x) { return x.eff + (x.plan.capWarn ? x.eff * 0.2 + 3 : 0); }
  }
  function planLabel(p) {
    if (p.type === 'unl') return '吃到飽 ' + p.days + ' 天' + (p.cap ? '（每日高速 ' + p.cap + 'GB）' : '');
    return p.gb + 'GB／' + p.days + ' 天' + (p.qty > 1 ? ' ×' + p.qty + ' 張' : '');
  }
  function planLabelEn(p) {
    if (p.type === 'unl') return 'Unlimited, ' + p.days + ' days' + (p.cap ? ' (' + p.cap + 'GB/day at full speed)' : '');
    return p.gb + 'GB / ' + p.days + ' days' + (p.qty > 1 ? ' x' + p.qty : '');
  }
  return { P: P, USAGE: USAGE, BRANDS: BRANDS, BRAND_NAME: BRAND_NAME, CODE_OFF: CODE_OFF, need: need, rank: rank, planLabel: planLabel, planLabelEn: planLabelEn };
})();
(function(){
var E=ESIM,R=document.getElementById('esp'),RATE=32,CODE='ZOEEHA9323';
var L={saily:'https://saily.tpk.ro/C78NyEnq',airalo:'https://airalo.tpk.ro/kJJeVxlV',yesim:'https://yesim.tpk.ro/mjE4mscH'};
var TIP={"jp":"日本電信訊號穩定，5 天內、一般用量買固定流量最省；每天看很多短影音再考慮吃到飽。交通票券也先算一下：<a href=\"https://knittinghiyori.com/tools/jr-pass-calculator/\">JR Pass 試算器</a>。","kr":"Naver Map、Kakao Map 很吃流量，別買太小的方案；韓國 5G 普及，三家都有支援。","th":"泰國是流量最便宜的國家之一，同樣預算可以買到比日韓多一倍的流量。出發前可以先用<a href=\"https://knittinghiyori.com/tools/packing-list-generator/\">行李清單產生器</a>備齊東西。","vn":"越南城市訊號好，但山區、下龍灣船上訊號較弱，重度使用前先看吃到飽的每日上限。","hk":"只買香港方案通常不含澳門與深圳；要順遊的話改選多國或中港澳方案。","sg":"新加坡範圍小、訊號穩，3–5 天輕度使用買 3GB 左右就很夠。","cn":"海外 eSIM 在中國多半走境外線路，通常不用另開 VPN 就能用 Google、LINE、IG；出發前仍請確認方案說明。","us":"美國幅員大，國家公園與郊區訊號弱；自駕記得先下載 Google 離線地圖。","uk":"只去英國的話，單國方案通常比歐洲區域方案便宜；倫敦地鐵大部分路段都有訊號。","eu":"一張歐洲區域方案可以跨國使用；行程若包含英國、瑞士，購買前確認方案有涵蓋。"};
var ORDER=['jp','kr','th','vn','hk','sg','cn','us','uk','eu'];
var st={c:'jp',d:5,u:'m',code:true};
function $(id){return document.getElementById(id)}
function ga(n,p){try{if(window.gtag)gtag('event',n,p||{})}catch(e){}}
function toast(t){var el=$('esp-toast');el.textContent=t;el.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(function(){el.classList.remove('on')},1800)}
function flash(btn,label){if(!btn)return;if(btn.dataset.busy==='1')return;btn.dataset.busy='1';var old=btn.innerHTML;btn.innerHTML=label;btn.classList.add('done');setTimeout(function(){btn.innerHTML=old;btn.classList.remove('done');btn.dataset.busy='0'},1800)}
function copy(t,ok,btn,label){function done(){toast(ok);flash(btn,label||'已複製 ✓')}var ok2=navigator.clipboard?window.isSecureContext:false;if(ok2){navigator.clipboard.writeText(t).then(done,fb)}else fb();function fb(){var a=document.createElement('textarea');a.value=t;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();try{document.execCommand('copy');done()}catch(e){}document.body.removeChild(a)}}
function ntd(u){return Math.round(u*RATE).toLocaleString('zh-TW')}
function usd(u){return 'US$'+(Math.round(u*100)/100).toFixed(2)}
var cBox=$('esp-c');
ORDER.forEach(function(k){var b=document.createElement('button');b.type='button';b.className='chip';b.setAttribute('role','radio');b.dataset.c=k;b.textContent=E.P[k].name;cBox.appendChild(b)});
var uBox=$('esp-u');
Object.keys(E.USAGE).forEach(function(k){var u=E.USAGE[k],b=document.createElement('button');b.type='button';b.className='uc';b.setAttribute('role','radio');b.dataset.u=k;b.innerHTML='<b>'+u.label+'</b><em>約 '+u.gb+'GB／天</em><span>'+u.desc+'</span>';uBox.appendChild(b)});
function readHash(){var m=(location.hash||'').match(/^#esim-([a-z]{2})-(\d{1,2})-([lmhx])$/);if(m?E.P[m[1]]:false){st.c=m[1];st.d=Math.min(30,Math.max(1,+m[2]));st.u=m[3];return true}return false}
function shareUrl(){return location.origin+location.pathname+'#esim-'+st.c+'-'+st.d+'-'+st.u}
function summary(r){var t='【'+E.P[st.c].name+' '+st.d+' 天・每天約 '+E.USAGE[st.u].gb+'GB】eSIM 比價結果\n';r.forEach(function(x,i){t+=(i+1)+'. '+E.BRAND_NAME[x.brand]+'：'+E.planLabel(x.plan)+' '+usd(x.eff)+'（約 NT$'+ntd(x.eff)+'）'+(x.brand==='saily'?(st.code?'｜折扣碼 '+CODE:''):'')+'\n'});return t+'自己試算：'+shareUrl()}
var timer;
function render(push){
  [].forEach.call(cBox.children,function(b){b.setAttribute('aria-checked',b.dataset.c===st.c)});
  [].forEach.call(uBox.children,function(b){b.setAttribute('aria-checked',b.dataset.u===st.u)});
  $('esp-d').value=st.d;$('esp-dv').innerHTML=st.d+'<small>天</small>';
  var r=E.rank(st.c,st.d,st.u,st.code),max=Math.max.apply(null,r.map(function(x){return x.eff}))||1;
  var h='<p class="need">你大約需要 <b>'+r[0].need+'GB</b>（'+st.d+' 天 × '+E.USAGE[st.u].gb+'GB），以下是三家最划算的買法：</p>';
  r.forEach(function(x,i){
    var p=x.plan,disc=false;if(x.brand==='saily'){if(st.code){disc=x.eff<p.price}}
    var per=x.eff/st.d;
    h+='<div class="card'+(i===0?' top':'')+'" style="animation-delay:'+(i*.06)+'s">'+(i===0?'<span class="badge">最划算</span>':'')+
    '<div class="row"><div><div class="bn">'+E.BRAND_NAME[x.brand]+'</div><div class="pl">'+E.planLabel(p)+'</div></div>'+
    '<div class="pr">'+(disc?'<s>'+usd(p.price)+'</s>':'')+'<b>'+usd(x.eff)+'</b><small>約 NT$'+ntd(x.eff)+'・每天 NT$'+ntd(per)+'</small></div></div>'+
    '<div class="bar"><span style="width:'+Math.max(8,x.eff/max*100)+'%"></span></div>';
    if(p.type==='fixed'?p.qty>1:false)h+='<p class="note">單張 '+p.gb+'GB 不夠用，買 1 張後在 App 內再加購 '+(p.qty-1)+' 張同方案。</p>';
    if(p.type==='fixed'?p.days>st.d+5:false)h+='<p class="note">效期 '+p.days+' 天，用不完的流量下趟不能延用，但不用擔心提早到期。</p>';
    if(p.type==='unl'?!p.cap:false)h+='<p class="note">吃到飽採公平使用原則，極大量使用時可能降速。</p>';
    if(p.capWarn)h+='<p class="warn">你每天約用 '+E.USAGE[st.u].gb+'GB，超過此方案每日高速 '+p.cap+'GB 後會降到 1Mbps（還能用 LINE、地圖，但看影片會卡）。</p>';
    if(x.upgrade)h+='<p class="tip">小提醒：再多 '+usd(x.upgrade.price-p.price)+' 就能升級「'+E.planLabel(x.upgrade)+'」，不用算流量。</p>';
    if(x.brand==='saily')h+='<div class="code"><span>折扣碼</span><code>'+CODE+'</code><button type="button" data-copy="1">複製</button></div>';
    h+='<a class="cta" href="'+L[x.brand]+'" target="_blank" rel="sponsored nofollow noopener" data-b="'+x.brand+'" data-rank="'+(i+1)+'">去 '+E.BRAND_NAME[x.brand]+' 看'+E.P[st.c].name+'方案 →</a></div>';
  });
  $('esp-res').innerHTML=h;
  $('esp-tip').innerHTML='<strong>'+E.P[st.c].name+'小叮嚀：</strong>'+TIP[st.c];
  $('esp-line').href='https://social-plugins.line.me/lineit/share?url='+encodeURIComponent(shareUrl());
  if(push?history.replaceState:false)history.replaceState(null,'','#esim-'+st.c+'-'+st.d+'-'+st.u);
  clearTimeout(timer);timer=setTimeout(function(){ga('esim_calc',{esim_country:st.c,esim_days:st.d,esim_usage:st.u,esim_top:r[0].brand})},1200);
}
cBox.addEventListener('click',function(e){var b=e.target.closest('[data-c]');if(b){st.c=b.dataset.c;render(1)}});
uBox.addEventListener('click',function(e){var b=e.target.closest('[data-u]');if(b){st.u=b.dataset.u;render(1)}});
$('esp-d').addEventListener('input',function(){st.d=+this.value;render(1)});
$('esp-dm').onclick=function(){if(st.d>1){st.d--;render(1)}};
$('esp-dp').onclick=function(){if(st.d<30){st.d++;render(1)}};
[].forEach.call(R.querySelectorAll('.quick [data-d]'),function(b){b.onclick=function(){st.d=+b.dataset.d;render(1)}});
$('esp-code').onchange=function(){st.code=this.checked;render(1)};
R.addEventListener('click',function(e){
  var c=e.target.closest('[data-copy]');if(c){copy(CODE,'已複製折扣碼 '+CODE,c,'已複製 ✓');ga('esim_copy_code',{esim_country:st.c});return}
  var a=e.target.closest('a[data-b]');if(a){ga('esim_click',{esim_brand:a.dataset.b,esim_rank:a.dataset.rank||'section',esim_country:st.c,esim_days:st.d})}
  var t=e.target.closest('[data-t]');if(t){[].forEach.call(R.querySelectorAll('[data-t]'),function(x){x.setAttribute('aria-selected',x===t)});[].forEach.call(R.querySelectorAll('[data-p]'),function(p){p.hidden=p.dataset.p!==t.dataset.t})}
});
$('esp-sh').onclick=function(){var r=E.rank(st.c,st.d,st.u,st.code),txt=summary(r);ga('esim_share',{method:'native'});if(navigator.share){navigator.share({title:'eSIM 比價結果',text:txt.split('\n自己試算')[0],url:shareUrl()}).catch(function(){})}else copy(txt,'已複製結果＋連結',this,'已複製結果 ✓')};
$('esp-cp').onclick=function(){copy(summary(E.rank(st.c,st.d,st.u,st.code)),'已複製，貼上就能傳給旅伴',this,'已複製 ✓');ga('esim_share',{method:'copy'})};
$('esp-line').addEventListener('click',function(){ga('esim_share',{method:'line'})});
try{document.body.appendChild($('esp-toast'))}catch(e){}
var fromHash=readHash();render(0);
if(fromHash){setTimeout(function(){$('esp-tool').scrollIntoView({behavior:'smooth',block:'start'})},300)}
window.addEventListener('hashchange',function(){if(readHash())render(0)});
})();
