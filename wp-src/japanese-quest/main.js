
(function(){
var R=document.getElementById('njq'),KEY='njq_v1';
var $=function(id){return document.getElementById(id)};
function ga(n,p){try{if(window.gtag)gtag('event',n,p||{})}catch(e){}}
function toast(t){var el=$('njq-toast');el.textContent=t;el.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(function(){el.classList.remove('on')},1900)}
function today(){var d=new Date(),m=d.getMonth()+1,n=d.getDate();return d.getFullYear()+'-'+(m<10?'0':'')+m+'-'+(n<10?'0':'')+n}
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return{}}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
var S=load();
S.got=S.got||{};S.days=S.days||{};S.doneDays=S.doneDays||{};S.route=S.route||'a';S.quiz=S.quiz||{};

/* ---- 路線資料 ---- */
var ROUTES={
 a:{name:'初級路線',sub:'五十音～N5・每天 10–15 分鐘',goal:'30 天後：讀完一本 Level 0–1 的分級讀本，並唸得出 30 句日文。',
  weeks:[
   {t:'第 1 週｜讓耳朵先開機',l:'聽 Sakura Tips 或 Teppei 初級 1 集',r:'讀 たどく Level 0 讀本 1 篇',s:'跟讀今天最短的 1 句，錄音'},
   {t:'第 2 週｜認識工具',l:'看 Comprehensible Japanese 1 支',r:'裝好 Yomitan，在 NHK Easy 查 3 個字',s:'練自我介紹第 1 句'},
   {t:'第 3 週｜踏進漫畫',l:'聽 Japanese with Shun 1 集',r:'在カドコミ讀四格漫畫 1 頁',s:'把漫畫裡的 1 句台詞唸出來'},
   {t:'第 4 週｜串起來',l:'聽 あかね的日本語教室 1 支',r:'讀 たどく Level 1 讀本 1 篇',s:'跟 AI 語音對話 3 分鐘'}
  ]},
 b:{name:'中級路線',sub:'N5～N4・每天 20 分鐘',goal:'30 天後：看完第一話原文漫畫，並和真人或 AI 完成一次 5 分鐘對話。',
  weeks:[
   {t:'第 1 週｜把語速拉上來',l:'聽 Let\'s Talk in Japanese（N4）1 集',r:'NHK Easy 新聞 1 篇，查 5 個字',s:'影子跟讀 3 句'},
   {t:'第 2 週｜挑對作品',l:'看 Onomappu 1 支，記 3 個擬聲詞',r:'用 jpdb 挑一部漫畫，讀 2 頁',s:'把 3 句台詞錄下來比對語調'},
   {t:'第 3 週｜開始開口',l:'聽 Bite Size Japanese 1 集',r:'讀漫畫 3 頁，只查看不懂就卡住的字',s:'跟 AI 語音對話 5 分鐘'},
   {t:'第 4 週｜連續戰',l:'聽 Japanese with Noriko 1 集',r:'讀完一整話漫畫',s:'在 HelloTalk 傳 1 則語音訊息'}
  ]},
 c:{name:'進階路線',sub:'N3 以上・每天 30–40 分鐘',goal:'30 天後：讀完一整本漫畫，並能就一個主題說滿 3 分鐘。',
  weeks:[
   {t:'第 1 週｜換成母語者素材',l:'聽 Japanese with Noriko 1 集，不看逐字稿',r:'少年ジャンプ＋ 讀 1 話',s:'用日文口頭摘要今天聽的內容'},
   {t:'第 2 週｜建立單字流程',l:'Language Reactor 看日劇 1 段',r:'Mokuro 處理 1 本漫畫，讀 10 頁',s:'影子跟讀 1 分鐘不間斷'},
   {t:'第 3 週｜輸出為主',l:'聽 Miku Real Japanese 1 支',r:'讀漫畫 20 頁，Anki 加 5 張句子卡',s:'跟 AI 或語言交換對象聊 10 分鐘'},
   {t:'第 4 週｜收尾',l:'聽 podcast 1 集並寫 3 句日文心得',r:'把這本漫畫讀完',s:'錄一段 3 分鐘的日文獨白'}
  ]}
};
var ORDER=['l','r','s','l','r','s','rev'];
var REV={a:'回顧日：翻出這週錄的音檔，挑一句重錄一次。',b:'回顧日：複習這週 Anki 的卡片，並重讀最難的那一頁。',c:'回顧日：用日文寫 5 句這週的心得，不查字典。'};
function taskOf(route,day){
  var Rt=ROUTES[route];
  if(day===29)return'自由日：從下面的圖鑑挑一張還沒試過的卡片，試 10 分鐘。';
  if(day===30)return'畢業任務：把這 30 天最有感的 3 句日文錄成一段語音，存起來當作起點紀錄。';
  var w=Rt.weeks[Math.min(3,Math.floor((day-1)/7))],k=ORDER[(day-1)%7];
  if(k==='rev')return REV[route];
  return(k==='l'?'【聽】':k==='r'?'【讀】':'【說】')+w[k];
}

/* ---- 等級與徽章 ---- */
var LV=[[0,'見習'],[50,'修行中'],[120,'一人前'],[220,'達人'],[350,'師匠']];
var BADGES=[
 {id:'b1',n:'初試啼聲',f:function(s){return s.n>=1}},
 {id:'b2',n:'耳朵開機',f:function(s){return s.listen>=3}},
 {id:'b3',n:'漫畫入門',f:function(s){return s.read>=3}},
 {id:'b4',n:'開口了',f:function(s){return s.speak>=2}},
 {id:'b5',n:'道具屋',f:function(s){return s.tool>=3}},
 {id:'b6',n:'七日坊主脫出',f:function(s){return s.streak>=7}},
 {id:'b7',n:'圖鑑收藏家',f:function(s){return s.n>=15}},
 {id:'b8',n:'皆勤賞',f:function(s){return s.days>=30}}
];
function stat(){
  var n=0,c={listen:0,read:0,speak:0,tool:0};
  [].forEach.call(R.querySelectorAll('.rc'),function(el){if(S.got[el.dataset.id]){n++;c[el.dataset.goal]++}});
  var days=0;for(var k in S.doneDays){if(S.doneDays[k]&&k.indexOf(S.route+'-')===0)days++}
  var streak=0,d=new Date();
  for(var i=0;i<400;i++){
    var m=d.getMonth()+1,dd=d.getDate(),key=d.getFullYear()+'-'+(m<10?'0':'')+m+'-'+(dd<10?'0':'')+dd;
    if(S.days[key]){streak++}
    else if(i>0){break}
    d.setDate(d.getDate()-1);
  }
  return{n:n,listen:c.listen,read:c.read,speak:c.speak,tool:c.tool,days:days,streak:streak,xp:n*10+days*5};
}
function renderHud(){
  var s=stat(),i=0;
  for(var j=0;j<LV.length;j++){if(s.xp>=LV[j][0])i=j}
  var next=LV[i+1]?LV[i+1][0]:LV[i][0],base=LV[i][0];
  $('njq-rank').innerHTML=LV[i][1]+'<small>Lv.'+(i+1)+'</small>';
  $('njq-xpn').textContent=LV[i+1]?s.xp+' / '+next+' XP':s.xp+' XP・已滿等';
  $('njq-xpb').style.width=(LV[i+1]?Math.min(100,(s.xp-base)/(next-base)*100):100)+'%';
  $('njq-s1').textContent=s.n;$('njq-s2').textContent=s.days;$('njq-s3').textContent=s.streak;
  var h='';BADGES.forEach(function(b){h+='<span class="bg'+(b.f(s)?' on':'')+'">'+b.n+'</span>'});
  $('njq-badges').innerHTML=h;
  return s;
}

/* ---- 圖鑑 ---- */
var F={goal:'all',lv:'all'};
function renderCards(){
  var vis=0;
  [].forEach.call(R.querySelectorAll('.rc'),function(el){
    var ok=(F.goal==='all'||el.dataset.goal===F.goal)&&(F.lv==='all'||el.dataset.lv===F.lv);
    el.classList.toggle('hide',!ok);if(ok)vis++;
    var got=!!S.got[el.dataset.id];
    el.classList.toggle('got',got);
    el.querySelector('.col').textContent=got?'✓ 已收集':'＋10 我試過了';
  });
  $('njq-empty').hidden=vis>0;
}
R.addEventListener('click',function(e){
  var c=e.target.closest('.col');
  if(c){
    var card=c.closest('.rc'),id=card.dataset.id;
    if(S.got[id]){delete S.got[id];toast('已從圖鑑移除')}
    else{S.got[id]=1;toast('＋10 XP・'+card.querySelector('h4').textContent+' 已收集');ga('njq_collect',{njq_res:id,njq_goal:card.dataset.goal})}
    save();renderCards();renderHud();return;
  }
  var f=e.target.closest('.filt button');
  if(f){var g=f.parentNode.dataset.f;F[g]=f.dataset.v;
    [].forEach.call(f.parentNode.children,function(b){b.setAttribute('aria-pressed',b===f)});
    renderCards();ga('njq_filter',{njq_type:g,njq_value:f.dataset.v});return;}
  var a=e.target.closest('.rc a');
  if(a){ga('njq_res_click',{njq_res:a.closest('.rc').dataset.id})}
});

/* ---- 路線與打卡 ---- */
function renderRoute(){
  var r=ROUTES[S.route],t=today();
  [].forEach.call($('njq-tabs').children,function(b){b.setAttribute('aria-selected',b.dataset.r===S.route)});
  $('njq-rinfo').innerHTML='<b>'+r.name+'</b>｜'+r.sub+'　'+r.goal;
  $('njq-weeks').innerHTML=r.weeks.map(function(w){
    return'<div class="wk"><b>'+w.t+'</b><ul><li>聽：'+w.l+'</li><li>讀：'+w.r+'</li><li>說：'+w.s+'</li></ul></div>'}).join('');
  var done=0,g='';
  for(var i=1;i<=30;i++){
    var pressed=!!S.doneDays[S.route+'-'+i];
    if(pressed)done++;
    g+='<button type="button" class="day'+(i%7===0?' mile':'')+'" data-d="'+i+'" aria-pressed="'+pressed+'">'+i+'</button>';
  }
  $('njq-grid').innerHTML=g;
  var cur=Math.min(30,done+1);
  $('njq-task').innerHTML='<b>Day '+cur+'</b>　'+taskOf(S.route,cur)+
    '<div class="tbtn"><button type="button" id="njq-done">完成今天，打卡 ＋5 XP</button></div>';
}
S.doneDays=S.doneDays||{};
$('njq-tabs').addEventListener('click',function(e){
  var b=e.target.closest('[data-r]');if(!b)return;
  S.route=b.dataset.r;save();renderRoute();ga('njq_route',{njq_route:S.route});
});
$('njq-grid').addEventListener('click',function(e){
  var b=e.target.closest('[data-d]');if(!b)return;
  var k=S.route+'-'+b.dataset.d;
  if(S.doneDays[k]){delete S.doneDays[k]}else{S.doneDays[k]=1;S.days[today()]=1;toast('Day '+b.dataset.d+' 完成，＋5 XP')}
  save();renderRoute();renderHud();
});
$('njq-task').addEventListener('click',function(e){
  if(!e.target.closest('#njq-done'))return;
  var done=0;for(var i=1;i<=30;i++){if(S.doneDays[S.route+'-'+i])done++}
  var cur=Math.min(30,done+1);
  S.doneDays[S.route+'-'+cur]=1;S.days[today()]=1;save();renderRoute();renderHud();
  toast('Day '+cur+' 完成，＋5 XP');ga('njq_day',{njq_route:S.route,njq_day:cur});
});

/* ---- 測驗 ---- */
var TYPES={
 read:{t:'漫畫派',d:'你的動力來自看得懂故事。先把查字工具裝好，再挑一部「簡單到有點無聊」的作品開始，比硬啃名作有效太多。'},
 speak:{t:'開口派',d:'你的瓶頸多半是心理成本，不是實力。先跟 AI 語音練膽，再進到語言交換；每天一句影子跟讀就夠。'},
 all:{t:'全能派',d:'你想兩邊都要，那就用「聽 → 讀 → 說」的輪替節奏，每天只做一種，30 天剛好各練 10 次。'}
};
var PAIN={bored:'你怕枯燥：別背單字表，只記你在漫畫裡真的遇到的句子。',shy:'你怕開口：前兩週先對著 AI 和手機錄音，不用面對真人。',busy:'你怕中斷：把門檻壓到一天 5 分鐘，連續比份量重要。',hard:'你怕太難：材料難度要低到一頁查不超過 5 個字，看不懂就換一本，不是你的問題。'};
$('njq-quiz').addEventListener('click',function(e){
  var b=e.target.closest('.opt');if(!b)return;
  var q=b.closest('.q').dataset.q;
  S.quiz[q]=b.dataset.v;
  [].forEach.call(b.parentNode.children,function(x){x.setAttribute('aria-checked',x===b)});
  save();quizResult();
});
function quizResult(){
  var q=S.quiz,keys=['lv','gr','goal','time','pain'],i;
  for(i=0;i<keys.length;i++){if(typeof q[keys[i]]==='undefined')return}
  var score=(+q.lv)+(+q.gr),route=score<=1?'a':score<=3?'b':'c',ty=TYPES[q.goal]||TYPES.all;
  var mins=q.time;
  S.route=route;save();renderRoute();
  var el=$('njq-qres');
  el.innerHTML='<b class="t">你是「'+ty.t+'」，建議走 '+ROUTES[route].name+'</b><p>'+ty.d+'</p><p>'+PAIN[q.pain]+'</p>'+
   '<p>每天 '+mins+' 分鐘的話，順序這樣排：'+(mins==='10'?'只做當天那一個任務就好。':mins==='20'?'當天任務 ＋ 多聽一集 podcast。':'當天任務 ＋ 一集 podcast ＋ 10 分鐘口說。')+'</p>'+
   '<a class="go" href="#njq-route-anchor" id="njq-goroute">看我的 30 天任務 →</a>';
  el.classList.add('on');
  ga('njq_quiz',{njq_type:q.goal,njq_route:route,njq_pain:q.pain});
  var go=document.getElementById('njq-goroute');
  go.onclick=function(ev){ev.preventDefault();$('njq-tabs').scrollIntoView({behavior:'smooth',block:'center'})};
}
function restoreQuiz(){
  [].forEach.call(R.querySelectorAll('.q'),function(qe){
    var v=S.quiz[qe.dataset.q];if(typeof v==='undefined')return;
    [].forEach.call(qe.querySelectorAll('.opt'),function(b){b.setAttribute('aria-checked',b.dataset.v===String(v))});
  });
  quizResult();
}

/* ---- 分享 ---- */
function summary(){
  var s=stat(),i=0;for(var j=0;j<LV.length;j++){if(s.xp>=LV[j][0])i=j}
  var done=0;for(var d=1;d<=30;d++){if(S.doneDays[S.route+'-'+d])done++}
  return'【我的日文修行進度】\n等級：'+LV[i][1]+' Lv.'+(i+1)+'（'+s.xp+' XP）\n'+ROUTES[S.route].name+'：30 天完成 '+done+' 天\n收集資源：'+s.n+' 個\n一起來闖關：'+location.origin+location.pathname;
}
function copy(t,ok){function done(){toast(ok)}
  if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(t).then(done,fb)}else fb();
  function fb(){var a=document.createElement('textarea');a.value=t;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();try{document.execCommand('copy');done()}catch(e){}document.body.removeChild(a)}}
$('njq-sh').onclick=function(){var t=summary();ga('njq_share',{method:'native'});
  if(navigator.share){navigator.share({title:'我的日文修行進度',text:t}).catch(function(){})}else copy(t,'已複製進度')};
$('njq-cp').onclick=function(){copy(summary(),'已複製，貼給學伴吧');ga('njq_share',{method:'copy'})};
$('njq-line').href='https://social-plugins.line.me/lineit/share?url='+encodeURIComponent(location.origin+location.pathname);
$('njq-line').addEventListener('click',function(){ga('njq_share',{method:'line'})});
$('njq-reset').onclick=function(){
  S={got:{},days:{},doneDays:{},quiz:{},route:S.route};save();
  [].forEach.call(R.querySelectorAll('.opt'),function(b){b.setAttribute('aria-checked','false')});
  $('njq-qres').classList.remove('on');
  renderCards();renderRoute();renderHud();toast('已清空，重新開始');
};

renderCards();renderRoute();renderHud();restoreQuiz();
})();
