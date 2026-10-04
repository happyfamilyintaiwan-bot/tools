
(function(){
"use strict";
var root=document.getElementById("kyt");
if(!root) return;
var $=function(id){return document.getElementById(id);};
function track(n,p){try{if(typeof window.gtag==="function")window.gtag("event",n,p||{});}catch(e){}}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c];});}

/* ========= 1. 語言與規則 ========= */
var LN={zh:"中文",ja:"日文",en:"英文"};
var NATIVE={zh:"中文",ja:"日本語",en:"English"};
var READ={zh:"漢語拼音",ja:"假名讀音",en:"KK 音標"};
var CJK="぀-ヿ㐀-䶿一-鿿豈-﫿";
var RE_CJK_SP=new RegExp("(["+CJK+"])\\s+(?=["+CJK+"])","g");
var RE_CJK_CH=new RegExp("["+CJK+"]","g");
var RE_TS=/^[\[(（]?((?:\d{1,2}:)?\d{1,2}:\d{2})(?:[.,]\d+)?[\])）]?$/;
var RE_TS_LINE=/^[\[(（]?((?:\d{1,2}:)?\d{1,2}:\d{2})(?:[.,]\d+)?[\])）]?\s*[-–—:：|]?\s+(\S.*)$/;
var RE_DUR=/^(?:\d+\s*(?:hours?|minutes?|seconds?|hrs?|mins?|secs?|小時|小时|時間|分鐘|分钟|分|秒鐘|秒钟|秒)\s*[,，、]?\s*)+$/i;
var RE_UI=/^(?:transcript|文字記錄|文字记录|轉錄稿|转录稿|文字起こし|search in video|在影片中搜尋|show transcript|顯示轉錄稿|显示转录稿|follow along using the transcript\.?|no results found)$/i;
var RE_TAG=/[\[［(（]\s*(?:music|applause|laughter|laughs|laughing|cheering|cheers|inaudible|silence|foreign|音樂|音乐|掌聲|掌声|笑聲|笑声|笑|歡呼|欢呼|音楽|拍手|笑い|歓声|外国語|♪+)\s*[\]］)）]/gi;
var RE_END=/[。！？!?]+[」』”’"'）)]*|(?:\.{1,3}|…+)[」』”’"'）)]*(?=\s)/;

var SAMPLES={
  en:"0:00\n[Music]\n0:04\nHi everyone, and welcome back to the channel.\n0:07\nToday I want to share three small habits that\n0:10\ncompletely changed the way I learn languages.\n0:14\nThe first one is listening before reading.\n0:17\nWhen you watch a video, try to catch the main idea\n0:21\nwithout looking at the subtitles first.\n0:25\nThe second habit is shadowing.\n0:28\nPause after each sentence and repeat it out loud,\n0:32\ncopying the rhythm, not just the words.\n0:36\nAnd the third one? Keep a tiny notebook of phrases,\n0:40\nnot single words. Phrases are what you actually use.\n0:45\nTry this for one week and let me know how it goes.\n0:49\nSee you in the next video!",
  ja:"0:00 皆さん、こんにちは。\n0:03 今日は、私の朝のルーティンを紹介したいと思います。\n0:07 まず、起きたらすぐにカーテンを開けて、\n0:11 日の光を浴びるようにしています。\n0:14 それから、白湯を一杯飲みます。\n0:18 体が温まって、頭もすっきりするんですよね。\n0:23 次に、五分だけ日記を書きます。\n0:27 書く内容は、今日やりたいことを三つだけ。\n0:31 たくさん書こうとすると続かないので、\n0:35 短くていいんです。\n0:38 小さな習慣でも、毎日続けると大きな変化になります。\n0:43 ぜひ試してみてください。",
  zh:"0:00\n大家好 歡迎來到我的頻道\n0:03\n今天想跟大家分享 我怎麼用 AI 整理讀書筆記\n0:08\n以前我看完一支教學影片\n0:11\n常常過幾天就忘記內容了\n0:14\n後來我開始先把影片轉成逐字稿\n0:18\n再請 AI 幫我抓重點 做成問答\n0:22\n這樣複習的時候只要看筆記就好\n0:26\n而且可以直接回到影片的時間點\n0:30\n如果你也常常覺得學了就忘\n0:33\n可以試試看這個方法\n0:36\n我們下支影片見 拜拜"
};

/* ========= 2. 狀態 ========= */
var KEY="kyt_transcript_v1";
var S={url:"",src:"",key:"",lang:"auto",clean:true,ts:true,fs:17,tab:"learn",dict:false,starOnly:false,stars:{},task:"learn",reply:"zh",custom:"",rate:1,follow:false,mini:false,mode:"paste",model:"",trad:true};
var R=null;
function load(){try{var x=JSON.parse(localStorage.getItem(KEY)||"null");if(x&&typeof x==="object")Object.keys(S).forEach(function(k){if(x[k]!==undefined)S[k]=x[k];});}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}

/* ========= 3. 解析 ========= */
function toSec(s){var p=s.split(":").map(Number);return p.length===3?p[0]*3600+p[1]*60+p[2]:p[0]*60+p[1];}
function fmt(t){t=Math.floor(t);var h=Math.floor(t/3600),m=Math.floor(t%3600/60),s=t%60;return (h?h+":"+String(m).padStart(2,"0"):m)+":"+String(s).padStart(2,"0");}
function vidOf(u){var m=String(u||"").match(/(?:youtu\.be\/|[?&]v=|\/(?:embed|shorts|live|v)\/)([A-Za-z0-9_-]{11})/);return m?m[1]:"";}
function parseSub(raw){
  var out=[],prev=[];
  raw.split(/\n\s*\n/).forEach(function(b){
    var ls=b.split("\n").map(function(x){return x.trim();}).filter(Boolean);
    var i=-1; ls.forEach(function(x,k){if(i<0&&x.indexOf("-->")>-1)i=k;});
    if(i<0) return;
    var m=ls[i].match(/((?:\d+:)?\d{1,2}:\d{2})[.,]?\d*\s*-->/); if(!m) return;
    var lines=ls.slice(i+1).map(function(x){return x.replace(/<[^>]+>/g,"").replace(/\{\\[^}]*\}/g,"").trim();}).filter(Boolean);
    var fresh=lines.filter(function(x){return prev.indexOf(x)<0;});
    prev=lines;
    if(fresh.length) out.push({t:toSec(m[1]),text:fresh.join("\n")});
  });
  return out;
}
function parse(raw){
  raw=String(raw||"").replace(/^﻿/,"").replace(/\r\n?/g,"\n");
  if(/\d\s*-->\s*\d/.test(raw)) return parseSub(raw);
  var segs=[],cur=null;
  raw.split("\n").forEach(function(l){
    l=l.trim(); if(!l||RE_UI.test(l)) return;
    var m;
    if((m=l.match(RE_TS))){cur={t:toSec(m[1]),text:""};segs.push(cur);return;}
    if(cur&&!cur.text&&RE_DUR.test(l)) return;
    if((m=l.match(RE_TS_LINE))){cur={t:toSec(m[1]),text:m[2]};segs.push(cur);return;}
    if(cur) cur.text=cur.text?cur.text+"\n"+l:l;
    else segs.push({t:null,text:l});
  });
  return segs.filter(function(s){return s.text;});
}
function detect(s){
  var kana=(s.match(/[぀-ヿ]/g)||[]).length,han=(s.match(/[㐀-鿿]/g)||[]).length,lat=(s.match(/[A-Za-z]/g)||[]).length;
  if(kana>=3&&kana>=(kana+han)*0.12) return "ja";
  if(han>=10&&han*3>=lat) return "zh";
  return han>lat?"zh":"en";
}
function joinT(a,b,lang){
  if(lang==="en"||(/[A-Za-z0-9,.;:!?'"’)]$/.test(a)&&/^[A-Za-z0-9("'‘]/.test(b))) return a+" "+b;
  return a+b;
}
function cleanText(s,lang){
  var out="";
  s.split("\n").forEach(function(l){l=l.trim();if(l)out=out?joinT(out,l,lang):l;});
  if(S.clean) out=out.replace(RE_TAG,"").replace(/[♪♫🎵]+/g,"");
  out=out.replace(/\s+/g," ").trim();
  if(lang!=="en") out=out.replace(RE_CJK_SP,"$1　");
  return out;
}
function isPunct(segs,lang){
  var txt=segs.map(function(s){return s.text;}).join(" ");
  var enders=(txt.match(/[。！？!?]|\.(?=\s|$)/g)||[]).length;
  var size=lang==="en"?txt.split(/\s+/).length/25:txt.length/60;
  return enders>=Math.max(2,size*0.5);
}
function splitSent(segs,lang){
  var out=[],buf="",bt=null,MAX=lang==="en"?320:140;
  segs.forEach(function(sg){
    if(!buf) bt=sg.t;
    buf=buf?joinT(buf,sg.text,lang):sg.text;
    var m;
    while((m=buf.match(RE_END))){
      var e=m.index+m[0].length,sent=buf.slice(0,e).trim();
      if(sent) out.push({t:bt,text:sent});
      buf=buf.slice(e).trim(); bt=sg.t;
    }
    if(buf.length>MAX){out.push({t:bt,text:buf});buf="";}
  });
  if(buf) out.push({t:bt,text:buf});
  return out;
}
function buildParas(units,lang,punct){
  var T=lang==="en"?420:140,sep=punct?null:(lang==="en"?" ":"　"),out=[],cur=null;
  units.forEach(function(u,i){
    if(!cur) cur={t:u.t,text:u.text,i:i};
    else cur.text=sep===null?joinT(cur.text,u.text,lang):cur.text+sep+u.text;
    if(cur.text.length>=T){out.push(cur);cur=null;}
  });
  if(cur){
    var prev=out[out.length-1];
    if(prev&&cur.text.length<T*0.35) prev.text=sep===null?joinT(prev.text,cur.text,lang):prev.text+sep+cur.text;
    else out.push(cur);
  }
  return out;
}
function count(txt,lang){
  if(lang==="en") return (txt.match(/[A-Za-z0-9'’-]+/g)||[]).length;
  return (txt.match(RE_CJK_CH)||[]).length+(txt.match(/[A-Za-z0-9]+/g)||[]).length;
}
function process(){
  var segs=parse(S.src);
  if(!segs.length) return null;
  var lang=S.lang==="auto"?detect(segs.map(function(s){return s.text;}).join(" ")):S.lang;
  segs=segs.map(function(s){return {t:s.t,text:cleanText(s.text,lang)};}).filter(function(s){return s.text;});
  if(!segs.length) return null;
  var hasT=segs.some(function(s){return s.t!==null;});
  var punct=isPunct(segs,lang);
  var units=punct?splitSent(segs,lang):segs.slice();
  var last=segs[segs.length-1].t;
  return {lang:lang,auto:S.lang==="auto",units:units,paras:buildParas(units,lang,punct),punct:punct,hasT:hasT,vid:vidOf(S.url),dur:hasT&&last!==null?last:null};
}

/* ========= 4. 畫面 ========= */
function chip(t){
  if(t===null||t===undefined) return "";
  if(R.vid) return '<a class="kyt-t" href="https://www.youtube.com/watch?v='+R.vid+'&amp;t='+Math.floor(t)+'s" target="_blank" rel="noopener" data-seek="'+t+'">'+fmt(t)+'</a>';
  if(R.local) return '<button type="button" class="kyt-t" data-seek="'+t+'">'+fmt(t)+'</button>';
  return '<span class="kyt-t">'+fmt(t)+'</span>';
}
function renderAll(){
  root.style.setProperty("--fs",S.fs+"px");
  renderStats(); renderRead(); renderLearn(); renderAI(); setupPlayer(); setTab(S.tab);
}
function renderStats(){
  var n=count(R.units.map(function(u){return u.text;}).join(" "),R.lang);
  var min=Math.max(1,Math.round(n/(R.lang==="en"?230:R.lang==="ja"?500:400)));
  $("kyt-stats").innerHTML=
    '<div><span>語言</span><b>'+LN[R.lang]+(R.auto?' <small>自動判斷</small>':'')+'</b></div>'+
    '<div><span>'+(R.lang==="en"?"單字數":"字數")+'</span><b>'+n.toLocaleString()+'</b></div>'+
    '<div><span>長度</span><b>'+(R.dur!==null?"約 "+fmt(R.dur):"—")+'</b></div>'+
    '<div><span>閱讀時間</span><b>約 '+min+' 分鐘</b></div>';
  var note=$("kyt-note");
  if(!R.punct&&R.units.length>3){note.hidden=false;note.innerHTML='這份逐字稿幾乎沒有標點（YouTube 自動字幕很常見），逐句模式會以字幕行為單位。想要通順好讀的版本，可以用 <button type="button" data-act="gotidy">AI 補標點・分段</button>。';}
  else note.hidden=true;
}
function renderRead(){
  $("kyt-read-out").innerHTML=R.paras.map(function(p,k){return '<p class="kyt-p" data-p="'+k+'">'+(S.ts?chip(p.t):"")+esc(p.text)+'</p>';}).join("");
  $("kyt-ts").hidden=!R.hasT;
  $("kyt-ts").setAttribute("aria-pressed",String(S.ts));
}
function renderLearn(){
  var canPlay=!!((R.vid||R.local)&&R.hasT), canSay=!canPlay&&HAS_TTS;
  $("kyt-units").innerHTML=R.units.map(function(u,i){
    var st=!!S.stars[i];
    return '<li data-i="'+i+'" class="'+(st?"star":"")+'"><div class="kyt-u-top">'+chip(u.t)+'<span class="kyt-u-n">#'+(i+1)+'</span><span class="sp"></span>'+
      (canPlay&&u.t!==null?'<button type="button" class="kyt-ib play" data-play="'+i+'">▶ 播這句</button>':'')+
      (canSay?'<button type="button" class="kyt-ib tts" data-say="'+i+'" title="用裝置內建語音朗讀（機器聲音）">🔊 聽這句</button>':'')+
      '<button type="button" class="kyt-ib" data-star="'+i+'" aria-pressed="'+st+'" aria-label="收藏這句">'+(st?"★":"☆")+'</button>'+
      '<button type="button" class="kyt-ib" data-copy="'+i+'">複製</button></div><p class="kyt-u-txt">'+esc(u.text)+'</p></li>';
  }).join("");
  $("kyt-learn-tip").textContent=canPlay?(R.local?"按「▶ 播這句」會播完這句自動暫停，換你跟著唸。":"按「▶ 播這句」會播完這句自動暫停，換你跟著唸。第一次請先按一下影片的播放鍵。"):(canSay?"「🔊 聽這句」是裝置內建的機器語音，適合確認念法；想聽原聲，請在上方填入影片網址。":(R.hasT?"在上方填入影片網址，就能一句一句播放、跟讀。":""));
  $("kyt-learn-tip").hidden=!$("kyt-learn-tip").textContent;
  root.classList.toggle("dict",S.dict); $("kyt-dict").setAttribute("aria-pressed",String(S.dict));
  updStars();
}
function updStars(){
  var n=Object.keys(S.stars).filter(function(k){return S.stars[k]&&R.units[k];}).length;
  root.classList.toggle("staronly",S.starOnly);
  $("kyt-staronly").setAttribute("aria-pressed",String(S.starOnly));
  $("kyt-staronly").textContent="★ 只看收藏（"+n+"）";
  $("kyt-starempty").hidden=!(S.starOnly&&n===0);
}
var TASKS=[["learn","語言學習筆記","單字、文法、跟讀句"],["sum","重點摘要","一句話總結＋重點＋時間碼"],["quiz","理解測驗","選擇題＋簡答，答案放最後"],["outline","心智圖大綱","階層式 Markdown 大綱"],["tidy","補標點・分段","不翻譯、不改字，只整理"],["custom","自訂指令","寫下你想問 AI 的"]];
function instr(){
  var src=R.lang,L=S.reply==="orig"?LN[src]:"繁體中文";
  switch(S.task){
    case "sum": return "請閱讀下面這支 YouTube 影片的逐字稿，用"+L+"回覆：\n1. 用一句話說明這支影片在講什麼\n2. 列出 3–7 個重點，每個重點附上對應的時間碼\n3. 如果影片提到具體的方法或建議，整理成可以直接照做的清單\n請只根據逐字稿內容回答，逐字稿沒有提到的不要自行補充。";
    case "learn": return "我正在學"+LN[src]+"，下面是一支"+LN[src]+"影片的逐字稿。請用"+L+"幫我整理學習筆記：\n1. 挑 10–15 個值得學的單字或片語，用表格列出：原文｜"+READ[src]+"｜意思｜影片中的原句\n2. 整理 3–5 個文法或常用句型，說明用法，並附上影片中的例句\n3. 挑 5 句適合跟讀練習（shadowing）的句子，保留原文並附上時間碼\n請優先挑日常生活用得到、中級程度的內容。";
    case "quiz": return "請根據下面這支 YouTube 影片的逐字稿，用"+L+"出一份理解測驗：\n1. 5 題單選題（每題 4 個選項）\n2. 3 題簡答題\n請把所有答案與簡短解析集中放在最後，並標出答案出自影片的哪個時間點，讓我可以先作答再對答案。";
    case "outline": return "請把下面這支 YouTube 影片的逐字稿整理成心智圖大綱，用"+L+"回覆：\n- 使用 Markdown 階層清單（最多三層）\n- 第一層是影片主題，第二層是主要段落，第三層是細節或例子\n- 每個第二層加上開始的時間碼\n完成後我會貼到心智圖工具使用。";
    case "tidy": return "請把下面的逐字稿整理成通順好讀的文章：補上標點符號、適當分段，並在段落前加上簡短的小標題。\n重要規則：不要翻譯、不要摘要、不要改寫原本的用字，全文保留原本的語言（"+NATIVE[src]+"），小標題也使用"+NATIVE[src]+"。逐字稿中的 [時間碼] 可以刪除。";
    default: return S.custom.trim()?S.custom.trim()+"\n請用"+L+"回覆，並根據下面的 YouTube 影片逐字稿回答。":"（請在上方輸入你的指令）";
  }
}
function transcriptText(withTs){return R.paras.map(function(p){return (withTs&&p.t!==null?"["+fmt(p.t)+"] ":"")+p.text;}).join("\n\n");}
function buildPrompt(){
  var head=instr()+"\n\n";
  if(S.url.trim()) head+="影片網址："+S.url.trim()+"\n";
  head+="逐字稿語言："+LN[R.lang]+"\n\n=== 逐字稿開始 ===\n";
  return head+transcriptText(true)+"\n=== 逐字稿結束 ===";
}
function renderAI(){
  $("kyt-tasks").innerHTML=TASKS.map(function(t){return '<button type="button" class="kyt-task" data-task="'+t[0]+'" aria-pressed="'+(S.task===t[0])+'">'+t[1]+'<small>'+t[2]+'</small></button>';}).join("");
  $("kyt-custom").hidden=S.task!=="custom";
  $("kyt-custom").value=S.custom;
  $("kyt-reply-wrap").hidden=S.task==="tidy";
  $("kyt-reply-orig").textContent=R.lang==="zh"?"影片原語言（中文）":"影片原語言（"+NATIVE[R.lang]+"）";
  Array.prototype.forEach.call($("kyt-reply").children,function(b){b.setAttribute("aria-pressed",String(b.dataset.reply===S.reply));});
  updPreview();
}
function updPreview(){
  var p=buildPrompt(),len=p.length;
  $("kyt-preview-sum").textContent="預覽提示詞（共 "+len.toLocaleString()+" 字元）";
  $("kyt-preview").textContent=len>3000?p.slice(0,3000)+"\n…（預覽只顯示前段，複製時會包含完整逐字稿）":p;
  var w=$("kyt-warn");
  if(len>40000){w.hidden=false;w.textContent="這份逐字稿很長，部分 AI 的免費版可能一次貼不下。可以先試「重點摘要」，或把逐字稿分成兩段各問一次。";}
  else w.hidden=true;
}
function setTab(tab){
  S.tab=tab;
  Array.prototype.forEach.call(root.querySelectorAll("[data-tab]"),function(b){b.setAttribute("aria-selected",String(b.dataset.tab===tab));});
  $("kyt-player").classList.toggle("off",tab==="ai");
  $("kyt-p-read").hidden=tab!=="read"; $("kyt-p-learn").hidden=tab!=="learn"; $("kyt-p-ai").hidden=tab!=="ai";
}

/* ========= 5. 播放器：YouTube（postMessage，不需載入外部 API）或本機音檔 ========= */
var ifr=null,LOCAL=null,MEDIA=null,infoOK=false,stopAt=null,stopTimer=null,lastNow=-2,tries=0;
function cmd(func,args){try{if(ifr&&ifr.contentWindow)ifr.contentWindow.postMessage(JSON.stringify({event:"command",func:func,args:args||[]}),"*");}catch(e){}}
function pPlayAt(t){if(LOCAL){var L=LOCAL;if(L.readyState<1)L.addEventListener("loadedmetadata",function(){try{L.currentTime=t;}catch(e){}},{once:true});else try{L.currentTime=t;}catch(e){}var pr=LOCAL.play();if(pr&&pr.catch)pr.catch(function(){});}else{cmd("seekTo",[t,true]);cmd("playVideo");}}
function pPause(){if(LOCAL)LOCAL.pause();else cmd("pauseVideo");}
function pRate(r){if(LOCAL)LOCAL.playbackRate=r;else cmd("setPlaybackRate",[r]);}
function pbarHTML(){
  return '<div class="kyt-pbar"><span>速度</span>'+[0.5,0.75,1,1.25].map(function(r){return '<button type="button" data-rate="'+r+'" aria-pressed="'+(S.rate===r)+'">'+r+'×</button>';}).join("")+
    '<button type="button" data-act="follow" aria-pressed="'+S.follow+'">跟隨</button><button type="button" data-act="mini" aria-pressed="'+S.mini+'">縮小</button></div>';
}
function setupPlayer(){
  var w=$("kyt-player");
  var want=R.hasT?(R.vid?"yt:"+R.vid:(R.local&&MEDIA?"local:"+MEDIA.url:"")):"";
  if(!want){w.hidden=true;w.innerHTML="";w.dataset.key="";ifr=null;LOCAL=null;return;}
  w.hidden=false; w.classList.toggle("mini",S.mini);
  if(w.dataset.key===want) return;
  w.dataset.key=want; infoOK=false; lastNow=-2; ifr=null; LOCAL=null; stopAt=null;
  if(R.vid){
    w.innerHTML='<div class="kyt-frame"><iframe id="kyt-yt" src="https://www.youtube.com/embed/'+R.vid+'?enablejsapi=1&amp;playsinline=1&amp;rel=0&amp;origin='+encodeURIComponent(location.origin)+'" title="YouTube 影片播放器" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>'+pbarHTML();
    ifr=$("kyt-yt");
    ifr.addEventListener("load",function(){tries=0;listen();});
  }else{
    var tag=MEDIA.video?"video":"audio";
    w.innerHTML=(MEDIA.video?'<div class="kyt-frame">':'<div class="kyt-aud">')+'<'+tag+' id="kyt-local" src="'+MEDIA.url+'" controls playsinline preload="metadata"></'+tag+'></div>'+pbarHTML();
    LOCAL=$("kyt-local"); LOCAL.playbackRate=S.rate;
    LOCAL.addEventListener("timeupdate",function(){var ct=LOCAL.currentTime;if(stopAt!==null&&ct>=stopAt-0.1){LOCAL.pause();stopAt=null;}markNow(ct);});
    LOCAL.addEventListener("loadedmetadata",function(){LOCAL.playbackRate=S.rate;});
  }
}
function listen(){
  if(!ifr||infoOK||tries++>12) return;
  try{ifr.contentWindow.postMessage(JSON.stringify({event:"listening",id:"kyt",channel:"widget"}),"*");}catch(e){}
  setTimeout(listen,800);
}
window.addEventListener("message",function(e){
  if(!ifr||e.source!==ifr.contentWindow) return;
  var d; try{d=typeof e.data==="string"?JSON.parse(e.data):e.data;}catch(x){return;}
  if(!d||!d.event) return;
  infoOK=true;
  if(d.event==="onReady"&&S.rate!==1) cmd("setPlaybackRate",[S.rate]);
  var info=d.info; if(!info||typeof info.currentTime!=="number") return;
  var ct=info.currentTime;
  if(stopAt!==null&&ct>=stopAt-0.1){cmd("pauseVideo");stopAt=null;}
  markNow(ct);
});
function markNow(ct){
  if(!R) return;
  var lo=0,hi=R.units.length-1,idx=-1;
  while(lo<=hi){var m=(lo+hi)>>1,t=R.units[m].t;if(t!==null&&t<=ct+0.25){idx=m;lo=m+1;}else hi=m-1;}
  if(idx===lastNow) return; lastNow=idx;
  Array.prototype.forEach.call(root.querySelectorAll(".now"),function(n){n.classList.remove("now");});
  if(idx<0) return;
  var li=$("kyt-units").children[idx]; if(li) li.classList.add("now");
  var pk=-1; R.paras.forEach(function(p,k){if(p.i<=idx)pk=k;});
  var pe=$("kyt-read-out").children[pk]; if(pe) pe.classList.add("now");
  if(S.follow){var tgt=S.tab==="learn"?li:(S.tab==="read"?pe:null);if(tgt)tgt.scrollIntoView({behavior:"smooth",block:"center"});}
}
function watchStop(){if(!LOCAL||stopAt===null)return;if(LOCAL.currentTime>=stopAt-0.05){LOCAL.pause();stopAt=null;return;}requestAnimationFrame(watchStop);}
function seek(t){stopAt=null;pPlayAt(t);}
function playOne(i){
  var u=R.units[i],end=u.t+6;
  for(var k=i+1;k<R.units.length;k++){if(R.units[k].t!==null&&R.units[k].t>u.t){end=R.units[k].t;break;}}
  pPlayAt(u.t); stopAt=end;
  if(LOCAL){requestAnimationFrame(watchStop);}
  clearTimeout(stopTimer);
  stopTimer=setTimeout(function(){if(stopAt===end){pPause();stopAt=null;}},(end-u.t)/S.rate*1000+900);
  track("kyt_play_sentence",{lang:R.lang,local:!!LOCAL});
}

/* ========= 5b. 沒有影片時：用裝置內建語音朗讀（Web Speech API） ========= */
var HAS_TTS=!!(window.speechSynthesis&&window.SpeechSynthesisUtterance);
var TTS_LANG={ja:"ja-JP",en:"en-US",zh:"zh-TW"};
function pickVoice(code){
  try{
    var vs=window.speechSynthesis.getVoices()||[],pre=code.slice(0,2).toLowerCase();
    var norm=function(v){return String(v.lang||"").replace("_","-").toLowerCase();};
    return vs.filter(function(v){return norm(v)===code.toLowerCase();})[0]||vs.filter(function(v){return norm(v).indexOf(pre)===0;})[0]||null;
  }catch(e){return null;}
}
function say(i){
  if(!HAS_TTS||!R) return;
  var u=R.units[i]; if(!u) return;
  var ss=window.speechSynthesis; ss.cancel();
  var code=TTS_LANG[R.lang]||"en-US",v=pickVoice(code);
  if(!v&&(ss.getVoices()||[]).length) toast("你的裝置沒有"+LN[R.lang]+"語音，可能念得不標準");
  var ut=new SpeechSynthesisUtterance(u.text.replace(/　/g," "));
  ut.lang=code; if(v) ut.voice=v; ut.rate=Math.max(0.5,Math.min(1.5,S.rate||1));
  var li=$("kyt-units").children[i];
  Array.prototype.forEach.call(root.querySelectorAll(".kyt-units .now"),function(n){n.classList.remove("now");});
  if(li) li.classList.add("now");
  ut.onend=ut.onerror=function(){if(li)li.classList.remove("now");};
  ss.speak(ut);
  track("kyt_tts",{lang:R.lang});
}
if(HAS_TTS){try{window.speechSynthesis.getVoices();}catch(e){}}

/* ========= 6. 工具函式 ========= */
var toastTimer;
function toast(msg){var t=$("kyt-toast");t.textContent=msg;t.classList.add("on");clearTimeout(toastTimer);toastTimer=setTimeout(function(){t.classList.remove("on");},2200);}
function copy(text,okMsg){
  function fallback(){var ta=document.createElement("textarea");ta.value=text;ta.setAttribute("readonly","");ta.style.cssText="position:fixed;top:0;left:0;opacity:0";document.body.appendChild(ta);ta.select();try{document.execCommand("copy");toast(okMsg);}catch(e){toast("複製失敗，請手動選取複製");}document.body.removeChild(ta);}
  if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(function(){toast(okMsg);},fallback);}else fallback();
}
function dl(name,text,type){
  var b=new Blob([text],{type:type+";charset=utf-8"}),a=document.createElement("a");
  a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();
  setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},800);
}
function fileBase(){return "transcript-"+(R.vid||"youtube");}
function mdText(){
  var h="# 逐字稿\n\n"+(S.url.trim()?"- 影片：<"+S.url.trim()+">\n":"")+"- 語言："+LN[R.lang]+"\n\n";
  return h+R.paras.map(function(p){
    var ts="";
    if(S.ts&&p.t!==null) ts=(R.vid?"[**"+fmt(p.t)+"**](https://youtu.be/"+R.vid+"?t="+Math.floor(p.t)+")":"**"+fmt(p.t)+"**")+" ";
    return ts+p.text;
  }).join("\n\n")+"\n";
}

/* ========= 7. 轉換 ========= */
function convert(scroll,source,keepMedia){
  if(source&&!keepMedia&&MEDIA){try{URL.revokeObjectURL(MEDIA.url);}catch(e){}MEDIA=null;}
  S.src=$("kyt-src").value; S.url=MEDIA?"":$("kyt-url").value.trim();
  if(!S.src.trim()){toast("請先貼上 YouTube 轉錄稿");$("kyt-src").focus();return;}
  var key=S.src.length+":"+S.src.slice(0,80);
  if(key!==S.key){S.stars={};S.key=key;}
  R=process();
  if(!R){toast("沒有讀到文字內容，請確認貼上的是轉錄稿");return;}
  R.local=!!MEDIA; lastNow=-2;
  $("kyt-result").hidden=false; renderAll(); save();
  if(scroll) $("kyt-result").scrollIntoView({behavior:"smooth",block:"start"});
  if(source) track("kyt_convert",{lang:R.lang,units:R.units.length,has_time:R.hasT,has_video:!!R.vid,punct:R.punct,source:source});
}
function syncLangUI(){Array.prototype.forEach.call($("kyt-lang").children,function(b){b.setAttribute("aria-pressed",String(b.dataset.lang===S.lang));});}

/* ========= 8. 事件 ========= */
root.addEventListener("click",function(e){
  var el=e.target.closest("[data-act],[data-mode],[data-model],[data-sample],[data-lang],[data-tab],[data-seek],[data-play],[data-say],[data-star],[data-copy],[data-task],[data-reply],[data-rate],[data-ai],.kyt-u-txt");
  if(!el||!root.contains(el)) return;
  var d=el.dataset;
  if(el.classList.contains("kyt-u-txt")){if(S.dict)el.classList.toggle("shown");return;}
  if(d.sample){$("kyt-src").value=SAMPLES[d.sample];$("kyt-url").value="";S.lang="auto";S.tab="learn";syncLangUI();convert(true,"sample_"+d.sample);return;}
  if(d.lang){S.lang=d.lang;syncLangUI();if(R)convert(false);else save();return;}
  if(d.tab){setTab(d.tab);save();track("kyt_tab",{tab:d.tab});return;}
  if(d.mode){setMode(d.mode);save();if(d.mode==="audio")track("kyt_mode_audio",{});return;}
  if(d.model){S.model=d.model;renderModels();save();return;}
  if(d.seek!==undefined){if(ifr||LOCAL){e.preventDefault();seek(+d.seek);}track("kyt_timestamp_click",{embedded:!!(ifr||LOCAL)});return;}
  if(d.play!==undefined){playOne(+d.play);return;}
  if(d.say!==undefined){say(+d.say);return;}
  if(d.star!==undefined){var i=d.star;if(S.stars[i])delete S.stars[i];else S.stars[i]=1;var on=!!S.stars[i];el.setAttribute("aria-pressed",String(on));el.textContent=on?"★":"☆";el.closest("li").classList.toggle("star",on);updStars();save();if(on)track("kyt_star",{});return;}
  if(d.copy!==undefined){var u=R.units[+d.copy];copy(u.text,"這句已複製");return;}
  if(d.task){S.task=d.task;renderAI();save();if(d.task==="custom")$("kyt-custom").focus();return;}
  if(d.reply){S.reply=d.reply;renderAI();save();return;}
  if(d.rate){S.rate=+d.rate;pRate(S.rate);Array.prototype.forEach.call(root.querySelectorAll("[data-rate]"),function(b){b.setAttribute("aria-pressed",String(+b.dataset.rate===S.rate));});save();return;}
  if(d.ai){track("kyt_open_ai",{ai:d.ai,task:S.task});return;}
  switch(d.act){
    case "go": if(S.mode==="audio") startASR(); else convert(true,"paste"); break;
    case "cancel": cancelASR(); break;
    case "clear": $("kyt-src").value="";$("kyt-url").value="";$("kyt-src").focus(); break;
    case "ts": S.ts=!S.ts; renderRead(); lastNow=-2; save(); break;
    case "fsm": S.fs=Math.max(14,S.fs-1); root.style.setProperty("--fs",S.fs+"px"); save(); break;
    case "fsp": S.fs=Math.min(26,S.fs+1); root.style.setProperty("--fs",S.fs+"px"); save(); break;
    case "copyall": copy(transcriptText(S.ts),"逐字稿已複製"); track("kyt_export",{type:"copy"}); break;
    case "txt": dl(fileBase()+".txt",(S.url.trim()?S.url.trim()+"\n\n":"")+transcriptText(S.ts)+"\n","text/plain"); track("kyt_export",{type:"txt"}); break;
    case "md": dl(fileBase()+".md",mdText(),"text/markdown"); track("kyt_export",{type:"md"}); break;
    case "print": setTab("read"); track("kyt_export",{type:"print"}); setTimeout(function(){window.print();},100); break;
    case "dict": S.dict=!S.dict; root.classList.toggle("dict",S.dict); el.setAttribute("aria-pressed",String(S.dict)); Array.prototype.forEach.call(root.querySelectorAll(".kyt-u-txt.shown"),function(n){n.classList.remove("shown");}); save(); if(S.dict)track("kyt_dictation",{}); break;
    case "staronly": S.starOnly=!S.starOnly; updStars(); save(); break;
    case "copystar":
      var list=R.units.map(function(u,k){return S.stars[k]?(u.t!==null?"["+fmt(u.t)+"] ":"")+u.text:null;}).filter(Boolean);
      if(!list.length){toast("還沒有收藏的句子，先按 ☆ 收藏");break;}
      copy(list.join("\n"),"已複製 "+list.length+" 句收藏"); track("kyt_export",{type:"stars"}); break;
    case "gotidy": S.task="tidy"; renderAI(); setTab("ai"); save(); $("kyt-p-ai").scrollIntoView({behavior:"smooth",block:"start"}); break;
    case "copyprompt":
      if(S.task==="custom"&&!S.custom.trim()){toast("請先輸入你的指令");$("kyt-custom").focus();break;}
      copy(buildPrompt(),"已複製！打開 AI 直接貼上就好"); track("kyt_copy_prompt",{task:S.task,reply:S.reply,lang:R.lang}); break;
    case "follow": S.follow=!S.follow; el.setAttribute("aria-pressed",String(S.follow)); save(); break;
    case "mini": S.mini=!S.mini; el.setAttribute("aria-pressed",String(S.mini)); $("kyt-player").classList.toggle("mini",S.mini); save(); break;
  }
});
$("kyt-custom").addEventListener("input",function(){S.custom=this.value;updPreview();clearTimeout(this._t);this._t=setTimeout(save,400);});
$("kyt-clean").addEventListener("change",function(){S.clean=this.checked;if(R)convert(false);else save();});
$("kyt-url").addEventListener("change",function(){if(R)convert(false);});
$("kyt-fileinput").addEventListener("change",function(){
  var f=this.files&&this.files[0]; if(!f) return;
  if(f.size>5*1024*1024){toast("檔案太大（上限 5MB）");return;}
  var rd=new FileReader();
  rd.onload=function(){$("kyt-src").value=String(rd.result||"");convert(true,"file");};
  rd.readAsText(f,"utf-8"); this.value="";
});

/* ========= 9. 上傳音檔 → 語音辨識（Whisper，在讀者瀏覽器的 Web Worker 裡執行） ========= */
var TJS="https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1";
var OPENCC="https://cdn.jsdelivr.net/npm/opencc-js@1.4.2/dist/esm/cn2t.js";
var MODELS={
  base:{id:"onnx-community/whisper-base",n:"快速",size:"約 80MB",gsize:"約 200MB",d:"速度快，適合英文或很清楚的錄音"},
  small:{id:"onnx-community/whisper-small",n:"精準",size:"約 250MB",gsize:"約 590MB",d:"中文、日文建議選這個，速度較慢"}
};
var IS_MOBILE=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.maxTouchPoints>1&&/Mac/.test(navigator.platform||""));
var WORKER_SRC=String.raw`import { pipeline, env } from "${TJS}";
env.allowLocalModels=false;
let asr=null,cur="";
const RE_HALL=/字幕(由|提供|製作|志愿者|志願者)|Amara\.org|明[镜鏡]|[点點][点點][栏欄]目|不吝[点點][赞贊]|[订訂][阅閱].{0,8}([转轉][发發]|打[赏賞])/;
function det(s){const k=(s.match(/[぀-ヿ]/g)||[]).length,h=(s.match(/[㐀-鿿]/g)||[]).length,l=(s.match(/[A-Za-z]/g)||[]).length;if(k>=3&&k>=(k+h)*0.12)return "ja";if(h>=5&&h*3>=l)return "zh";if(l>=20)return "en";return null;}
function tidy(t){return t.replace(/(.{2,24}?)(?:[\s，,、。]*\1){3,}/g,"$1").trim();}
self.onmessage=async(e)=>{
  const m=e.data; if(m.type!=="run") return;
  try{
    const key=m.model+"|"+m.device;
    if(!asr||cur!==key){
      if(asr&&asr.dispose){try{await asr.dispose();}catch(x){}}
      asr=null;
      const cb=(p)=>self.postMessage({type:"load",p:{status:p.status,file:p.file,loaded:p.loaded,total:p.total}});
      if(m.device==="webgpu"){
        try{asr=await pipeline("automatic-speech-recognition",m.model,{device:"webgpu",dtype:{encoder_model:"fp32",decoder_model_merged:"q4"},progress_callback:cb});}
        catch(x){asr=null;self.postMessage({type:"fallback",message:String((x&&x.message)||x)});}
      }
      if(!asr) asr=await pipeline("automatic-speech-recognition",m.model,{device:"wasm",dtype:"q8",progress_callback:cb});
      cur=key;
    }
    self.postMessage({type:"ready"});
    let lang=m.lang,prev="";
    for(let i=0;i<m.bounds.length;i++){
      const a=m.bounds[i][0],b=m.bounds[i][1],off=a/16000,segs=[];
      if(!m.silent[i]&&b-a>8000){
        const opt={task:"transcribe",return_timestamps:true};
        if(lang) opt.language=lang;
        const out=await asr(m.audio.subarray(a,b),opt);
        const cs=(out.chunks&&out.chunks.length)?out.chunks:[{timestamp:[0,null],text:out.text||""}];
        for(const c of cs){
          const tx=tidy(c.text||"");
          if(!tx||RE_HALL.test(tx)||tx===prev) continue;
          prev=tx;
          const st=(c.timestamp&&typeof c.timestamp[0]==="number")?c.timestamp[0]:0;
          segs.push({t:off+st,text:tx});
        }
        if(!lang&&m.autoLock){const d=det(segs.map(x=>x.text).join(""));if(d)lang=d;}
      }
      self.postMessage({type:"chunk",i:i,segs:segs,end:b/16000});
    }
    self.postMessage({type:"done"});
  }catch(err){self.postMessage({type:"error",message:String((err&&err.message)||err)});}
};`;
var W=null,AF=null,BUSY=false,ASR=null,LF={},GPU=false;
if(navigator.gpu&&navigator.gpu.requestAdapter){try{navigator.gpu.requestAdapter().then(function(a){GPU=!!a;renderModels();envNote();}).catch(function(){});}catch(e){}}
function renderModels(){
  if(!MODELS[S.model]) S.model="base";
  $("kyt-models").innerHTML=Object.keys(MODELS).map(function(k){var m=MODELS[k];return '<button type="button" class="kyt-task" data-model="'+k+'" aria-pressed="'+(S.model===k)+'">'+m.n+'・'+(GPU?m.gsize:m.size)+'<small>'+m.d+'</small></button>';}).join("");
}
function setMode(m){
  S.mode=m;
  Array.prototype.forEach.call(root.querySelectorAll("[data-mode]"),function(b){b.setAttribute("aria-selected",String(b.dataset.mode===m));});
  $("kyt-m-paste").hidden=m!=="paste"; $("kyt-m-audio").hidden=m!=="audio";
  $("kyt-clean-wrap").hidden=m!=="paste";
  $("kyt-go").textContent=m==="audio"?"開始轉成逐字稿":"開始跟讀練習";
}
function mb(n){return (n/1048576).toFixed(n>104857600?0:1)+" MB";}
function dur2(sec){sec=Math.max(0,Math.round(sec));var m=Math.floor(sec/60),s=sec%60;return m?(m+" 分"+(s?" "+s+" 秒":"")):s+" 秒";}
function pickFile(f){
  if(!f) return;
  if(!/^(audio|video)\//.test(f.type)&&!/\.(mp3|m4a|wav|aac|flac|ogg|opus|mp4|mov|webm|mkv)$/i.test(f.name)){toast("請選擇音檔或影片檔");return;}
  AF=f;
  $("kyt-drop").classList.add("has");
  $("kyt-drop-t").textContent=f.name;
  $("kyt-drop-s").textContent=mb(f.size)+"・點一下可以換檔案";
  try{
    var el=document.createElement(/^video\//.test(f.type)?"video":"audio"),u=URL.createObjectURL(f);
    el.preload="metadata";
    el.onloadedmetadata=function(){if(isFinite(el.duration)&&el.duration>0){AF._dur=el.duration;$("kyt-drop-s").textContent=mb(f.size)+"・長度 "+fmt(el.duration)+(el.duration>3600?"・超過 1 小時，處理會很久":"");}URL.revokeObjectURL(u);};
    el.onerror=function(){URL.revokeObjectURL(u);};
    el.src=u;
  }catch(e){}
}
function showProg(on){$("kyt-prog").hidden=!on;$("kyt-go").hidden=!!on;}
function setProg(title,pct,sub){
  $("kyt-prog-t").textContent=title;
  $("kyt-bar").classList.toggle("busy",pct===null);
  $("kyt-prog-p").textContent=pct===null?"":Math.floor(pct)+"%";
  if(pct!==null) $("kyt-prog-bar").style.width=Math.min(100,pct)+"%";
  $("kyt-prog-s").textContent=sub||"";
}
function fail(msg,detail){
  BUSY=false; showProg(false); toast(msg);
  var s2=$("kyt-env"); s2.hidden=false; s2.textContent="⚠️ "+msg;
  track("kyt_asr_error",{reason:String(detail||msg).slice(0,90)});
}
function decodeFile(f){
  return f.arrayBuffer().then(function(ab){
    var AC=window.AudioContext||window.webkitAudioContext, ctx;
    try{ctx=new AC({sampleRate:16000});}catch(e){ctx=new AC();}
    return new Promise(function(res,rej){var pr=ctx.decodeAudioData(ab,res,rej);if(pr&&pr.then)pr.then(res,rej);}).then(function(buf){
      try{ctx.close();}catch(e){}
      if(buf.sampleRate===16000){
        var n=buf.numberOfChannels,a=buf.getChannelData(0),out=new Float32Array(a.length);
        if(n===1){out.set(a);return out;}
        for(var c=0;c<n;c++){var ch=buf.getChannelData(c);for(var i=0;i<ch.length;i++)out[i]+=ch[i]/n;}
        return out;
      }
      var OAC=window.OfflineAudioContext||window.webkitOfflineAudioContext;
      var off=new OAC(1,Math.ceil(buf.duration*16000),16000),src=off.createBufferSource();
      src.buffer=buf; src.connect(off.destination); src.start(0);
      return off.startRendering().then(function(r){return new Float32Array(r.getChannelData(0));});
    });
  });
}
function chunkBounds(x){
  var SR=16000,N=x.length,out=[],silent=[],s=0;
  while(s<N){
    var e;
    if(N-s<=30*SR) e=N;
    else{
      var lo=s+22*SR,hi=s+29.5*SR,Wn=SR/10,best=hi,bestE=Infinity;
      for(var p=lo;p+Wn<=hi;p+=Wn/2){var en=0;for(var k=p;k<p+Wn;k+=4)en+=x[k]*x[k];if(en<bestE){bestE=en;best=p+Wn/2;}}
      e=Math.floor(best);
    }
    var sum=0,c=0;for(var j=s;j<e;j+=8){sum+=x[j]*x[j];c++;}
    out.push([s,e]); silent.push(c?Math.sqrt(sum/c)<0.003:true);
    s=e;
  }
  return {bounds:out,silent:silent};
}
function ensureWorker(){
  if(W) return W;
  var url=URL.createObjectURL(new Blob([WORKER_SRC],{type:"text/javascript"}));
  W=new Worker(url,{type:"module"});
  W.onmessage=onWorker;
  W.onerror=function(e){ if(e&&e.preventDefault)e.preventDefault(); W=null; fail("辨識元件載入失敗，請確認網路連線，重新整理頁面再試一次。",e&&e.message); };
  return W;
}
function onWorker(e){
  var d=e.data; if(!ASR) return;
  if(d.type==="load"){
    var p=d.p;
    if(p.file&&(p.status==="progress"||p.status==="download"||p.status==="initiate")){ if(p.total) LF[p.file]={l:p.loaded||0,t:p.total}; }
    else if(p.status==="done"&&p.file&&LF[p.file]) LF[p.file].l=LF[p.file].t;
    var l=0,t=0; for(var k in LF){l+=LF[k].l;t+=LF[k].t;}
    if(t>5e6&&l<t*0.995) setProg("下載辨識模型",l/t*100,mb(l)+" / "+mb(t)+"・第一次使用才需要下載，之後會快很多");
    else setProg("準備辨識模型…",null,"模型載入中，請稍候");
  }else if(d.type==="fallback"){
    GPU=false; ASR.device="wasm"; LF={}; envNote(); renderModels();
    track("kyt_asr_fallback",{reason:String(d.message||"").slice(0,90)});
  }else if(d.type==="ready"){
    ASR.t0=performance.now();
    setProg("辨識中…",0,"第一段通常最久，請稍候");
  }else if(d.type==="chunk"){
    ASR.done++;
    var live=$("kyt-live"),html="";
    d.segs.forEach(function(sg){ASR.segs.push(sg);html+='<li><span class="kyt-t">'+fmt(sg.t)+'</span>'+esc(sg.text)+'</li>';});
    if(html){live.insertAdjacentHTML("beforeend",html);while(live.children.length>60)live.removeChild(live.firstChild);live.scrollTop=live.scrollHeight;}
    var el=(performance.now()-ASR.t0)/1000,left=el/Math.max(d.end,1)*(ASR.dur-d.end);
    setProg("辨識中 "+ASR.done+" / "+ASR.n+" 段",ASR.done/ASR.n*100,"已處理 "+fmt(d.end)+"／"+fmt(ASR.dur)+(ASR.done<ASR.n?"・預估還要 "+dur2(left):""));
  }else if(d.type==="done"){
    finishASR(false);
  }else if(d.type==="error"){
    try{W.terminate();}catch(x){} W=null;
    fail(/fetch|network|Failed to/i.test(d.message)?"模型下載失敗，請確認網路連線後再試一次。":"辨識過程出錯了，可以試試換一個模型，或把檔案轉成 MP3 再試。",d.message);
  }
}
function startASR(){
  if(BUSY) return;
  if(!AF){toast("請先選擇音檔或影片檔");return;}
  if(AF.size>1024*1048576){toast("檔案太大（上限 1GB），請先轉成 MP3 或剪短");return;}
  if(typeof Worker==="undefined"||!window.WebAssembly){fail("這個瀏覽器不支援語音辨識，請改用最新版 Chrome、Edge 或 Safari。");return;}
  BUSY=true; LF={}; envNote();
  $("kyt-live").innerHTML=""; showProg(true); setProg("讀取音訊中…",null,"檔案越大，這一步越久");
  decodeFile(AF).then(function(audio){
    var dur=audio.length/16000;
    if(dur<1){fail("這個檔案沒有讀到聲音內容。");return;}
    if(dur>3*3600){fail("音檔超過 3 小時，請先剪短再試。");return;}
    var cb=chunkBounds(audio), lang=S.lang==="auto"?null:S.lang;
    ASR={segs:[],n:cb.bounds.length,done:0,t0:performance.now(),t00:performance.now(),dur:dur,model:S.model};
    setProg("準備辨識模型…",null,"");
    ASR.device=GPU?"webgpu":"wasm";
    ensureWorker().postMessage({type:"run",model:MODELS[S.model].id,device:ASR.device,lang:lang,autoLock:S.lang==="auto",audio:audio,bounds:cb.bounds,silent:cb.silent},[audio.buffer]);
    track("kyt_asr_start",{model:S.model,minutes:Math.round(dur/60),lang:S.lang,mobile:IS_MOBILE,device:GPU?"webgpu":"wasm"});
  }).catch(function(err){fail("無法讀取這個檔案，請改用 MP3、M4A 或 WAV 再試一次。",err&&err.message);});
}
function cancelASR(){
  if(!BUSY) return;
  if(W){try{W.terminate();}catch(x){} W=null;}
  if(ASR&&ASR.segs.length){toast("已停止，先顯示辨識完成的部分");finishASR(true);}
  else{BUSY=false;ASR=null;showProg(false);toast("已停止辨識");}
}
function finishASR(partial){
  var segs=ASR.segs.slice(), info={device:ASR.device,model:ASR.model,minutes:Math.round(ASR.dur/60),seconds:Math.round((performance.now()-ASR.t00)/1000),partial:!!partial};
  if(!segs.length){ASR=null;fail("沒有辨識到說話的內容。請確認檔案有人聲，或換成「精準」模型再試。");return;}
  var isZh=S.lang==="zh"||(S.lang==="auto"&&detect(segs.map(function(x){return x.text;}).join(""))==="zh");
  var step=Promise.resolve(segs);
  if(isZh&&S.trad){
    setProg("轉換成繁體中文…",null,"");
    step=import(OPENCC).then(function(OC){var cv=OC.Converter({from:"cn",to:"twp"});return segs.map(function(x){return {t:x.t,text:cv(x.text)};});}).catch(function(){toast("繁體轉換沒有成功，先顯示原始結果");return segs;});
  }
  step.then(function(list){
    BUSY=false; ASR=null; showProg(false); $("kyt-env").hidden=true;
    $("kyt-src").value=list.map(function(x){return fmt(x.t)+" "+x.text.replace(/\s*\n\s*/g," ");}).join("\n");
    $("kyt-url").value="";
    if(MEDIA){try{URL.revokeObjectURL(MEDIA.url);}catch(e){}}
    MEDIA={url:URL.createObjectURL(AF),video:/^video\//.test(AF.type)||/\.(mp4|mov|webm|mkv)$/i.test(AF.name)};
    convert(true,"audio",true);
    track("kyt_asr_done",info);
  });
}
function envNote(){
  var el=$("kyt-env"),t=GPU?"⚡ 你的裝置支援 WebGPU，會用顯示卡加速，速度大約是音檔長度的幾分之一。":"🐢 你的瀏覽器不支援顯示卡加速，會改用 CPU 辨識，速度大約和音檔長度差不多，建議先試 10 分鐘以內的音檔。";
  if(IS_MOBILE) t+="手機請保持畫面開著，長音檔建議用電腦。";
  el.hidden=false; el.textContent=t;
}
var drop=$("kyt-drop");
["dragenter","dragover"].forEach(function(ev){drop.addEventListener(ev,function(e){e.preventDefault();drop.classList.add("over");});});
["dragleave","drop"].forEach(function(ev){drop.addEventListener(ev,function(e){e.preventDefault();drop.classList.remove("over");});});
drop.addEventListener("drop",function(e){var f=e.dataTransfer&&e.dataTransfer.files&&e.dataTransfer.files[0];pickFile(f);});
$("kyt-audio").addEventListener("change",function(){pickFile(this.files&&this.files[0]);this.value="";});
$("kyt-trad").addEventListener("change",function(){S.trad=this.checked;save();});
window.addEventListener("beforeunload",function(e){if(BUSY){e.preventDefault();e.returnValue="";}});

/* ========= 10. 啟動 ========= */
load();
$("kyt-url").value=S.url; $("kyt-src").value=S.src; $("kyt-clean").checked=S.clean; $("kyt-trad").checked=S.trad; syncLangUI();
renderModels(); setMode(S.mode==="audio"?"audio":"paste"); envNote();
if(S.src.trim()){R=process();if(R){$("kyt-result").hidden=false;renderAll();}}
})();
