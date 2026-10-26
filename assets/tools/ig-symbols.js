/* IG 特殊符號（ig_symbols）三語
   由 WordPress 線上版搬來（2026-10-25）：中文、英文沿用原本的程式，日文依原版翻譯。
   頁面語言由 window.TS_PAGE_LANG 決定（tool_pages.py 產生）。 */
(function(){
const RUN={
zh:function(){
  const $=s=>document.querySelector(s);

  /* ---------- 頁面設定 ---------- */
  const PAGE="IG頁";            // 子頁代號，GA 的區塊名稱會加上這個前綴；主頁留空以延續既有數據
  const FONT_AT="";     // 特殊字型區塊插在哪個分類之前；空字串＝放在最後
  const FONT_T="IG 名字特殊字型";
  const FONT_N="可以貼在 IG 的「名字」欄，但「用戶名稱」只接受英文字母、數字、句點和底線，特殊字型貼不進去。另外特殊字型只吃英文和數字，中文會保持原樣。";
  const MOODS=["read","ask","sorry","tired","happy","thanks","angry","shy","cry","speechless","sleep","eat","go"];

  /* ---------- 字型對照表（每組須為 62 字：26+26+10） ---------- */
  const U="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const UA=[...U];
  const FONTS=[
    {n:"原本",  m:null},
    {n:"花體",  m:"𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃0123456789"},
    {n:"斜體",  m:"𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧0123456789"},
    {n:"粗體",  m:"𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗"},
    {n:"雙線",  m:"𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡"},
    {n:"哥德",  m:"𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟0123456789"},
    {n:"小大寫",m:"ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ0123456789"},
    {n:"圓圈",  m:"ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ⓪①②③④⑤⑥⑦⑧⑨"},
    {n:"方框",  m:"🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉0123456789"},
    {n:"全形",  m:"ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ０１２３４５６７８９"},
    {n:"迷你",  m:"ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻ⁰¹²³⁴⁵⁶⁷⁸⁹"}
  ];
  const conv=(t,f)=>{if(!f.m)return t;const M=[...f.m];return [...t].map(c=>{const i=UA.indexOf(c);return i<0?c:M[i];}).join("");};

  /* ---------- 版型 ---------- */
  const TPL=[
    {n:"蝴蝶結", f:(a,b,c)=>`୨୧ ${a} ୨୧\n${b}\n${c}`},
    {n:"星塵",   f:(a,b,c)=>`‧₊˚ ${a} ˚₊‧\n✧ ${b}\n${c} ⋆`},
    {n:"分隔線", f:(a,b,c)=>`${a}\n୨୧┈┈┈┈┈୨୧\n${b}\n${c}`},
    {n:"心心",   f:(a,b,c)=>`♡ ${a}\n⸝⸝ ${b} ⸝⸝\n${c} ♡`},
    {n:"極簡",   f:(a,b,c)=>`${a}\n· ${b} ·\n${c}`},
    {n:"花草",   f:(a,b,c)=>`ꕥ ${a} ꕥ\n${b}\n✿ ${c}`},
    {n:"咖啡",   f:(a,b,c)=>`${a}\n☕ ${b}\n୨୧⌒⌒⌒⌒୨୧\n${c}`},
    {n:"垂綴",   f:(a,b,c)=>`${a}\n　⌇\n${b}\n　⌇\n${c}`},
    {n:"音符",   f:(a,b,c)=>`♪ ${a}\n${b}\n${c} ♫`}
  ];
  let tpl=0, fnt=1;

  /* ---------- 兔兔圖 ----------
     台日韓網路社群流傳的兔子顏文字，{E} 為手上物品的插入點       */
  const POSES=[
    {n:"經典兔",   f:e=>` (\\_/)\n( •_•)\n/> ${e} >`},
    {n:"尾巴兔",   f:e=>`  {\\__/}\n  ( • - •)\nc /> ${e} <\\`},
    {n:"遞給你",   f:e=>`  {\\__/}\n  ( • - •)\nc /> ${e} >`},
    {n:"星星眼",   f:e=>`  {\\__/}\n (⌯¤̴̶̷̀ω¤̴̶̷́)\nc />　　> ${e}`},
    {n:"小天使",   f:e=>`  {\\_/}\n  (*ˊᵕˋ)\n*ଘ/ ੭${e}੭*✩‧₊˚`},
    {n:"親一下",   f:e=>` (\\_(\\\n (๑´³\`) ෆ\n /> ${e} >`},
    {n:"好開心",   f:e=>` (\\__ /)\n (⁎˃ᴗ˂⁎)◞♡\n />  ${e} <\\`},
    {n:"要玩火嗎", f:e=>` {\\___/}\n (๑❛ᴗ❛๑)\nc / >${e}>`},
    {n:"怎麼辦",   f:e=>`  {\\__/}\n꜆꜄꜆( ´O\`)꜆꜄꜆\n  < ${e} <\\ ɔ`},
    {n:"嚇一跳",   f:e=>` {\\__/}\nΣ(ʘ△ʘ)|||\n  <${e}<\\ ɔ`},
    {n:"震驚",     f:e=>` (\\___/)\n (◔ д◔)\nc /> ${e} >`},
    {n:"生氣兔",   f:e=>` /) /)\n(-\`д´-)\n /> ${e} >`},
    {n:"貓爪兔",   f:e=>`  /) /)\n(ฅ• . •ฅ)\n /> ${e} >`},
    {n:"害羞",     f:e=>` (\\_(\\\n (; ›ω‹)\n /> ${e} >`},
    {n:"戴皇冠",   f:e=>` (\\ ♚ /)\n (ฅ×ฅ)\n /> ${e} >`},
    {n:"圓臉兔",   f:e=>` ꒰\\_/꒱\n ꒰•ᵕ•꒱\n /> ${e} >`},
    {n:"瞇瞇眼",   f:e=>` ꒰\\⑅/꒱ ✧\n ꒰◔ᵕ◔꒱\n /> ${e} >`},
    {n:"兩隻一起", f:e=>`*(\\_/)｡ﾟ{\\_/}*⋈\n( •×•)${e}(•×• )`}
  ];
  const EMOS=[
    "♥️","🎁","💌","✨","🌙","⭐","🔥","☂️","🎀","🫧",
    "☕","🍵","🧋","🍷","🍺","🍶","🥂","🍾","🥤","🍹",
    "🍰","🎂","🍪","🍩","🍫","🍡","🍓","🍎","🍌","🥐",
    "🍞","🍟","🌭","🍜","🍙","📚","📖","📕","📗","📓",
    "✏️","🖊️","🧶","🧵","🪡","✈️","🧳","📷","🎧","🌸"
  ];
  let emo=0;

  /* ---------- 符號資料 ---------- */
  const DATA=[
    {id:"igdiv", en:"DIVIDERS", t:"IG 分隔線", s:"依照實際複製次數排序，最多人用的排最前面。一條完整分隔線大約佔 13 個字元，放在自介前先看一下上面的額度。", wide:1, items:[
      "⋆ ˚｡⋆୨୧˚ ⋆ ˚｡⋆","♪♫*•♪♪♫*•♪♫*•♪","∴∵∴ ୨୧ ∴∵∴ ୨୧ ∴∵∴","─── ⋆⋅☆⋅⋆ ───",
      "˚₊‧ ✩ ‧₊˚ ✩ ‧₊˚","୨୧┈┈┈┈┈┈┈┈┈୨୧","╭┈┈┈┈┈┈┈┈┈╮","╰┈┈┈┈┈┈┈┈┈╯",
      "‧₊˚ ✧ ˚₊‧ ✧ ‧₊˚","✿ ⋆ ✿ ⋆ ✿ ⋆ ✿","ꔫ･–･ꔫ･–･ꔫ･–･ꔫ","꙳✧˖°⌖꙳✧˖°⌖꙳✧˖°⌖꙳",
      "·˚ ༘ ⋆｡˚ ⋆｡˚ ༘ ·","୨୧⌒⌒⌒⌒⌒⌒⌒⌒୨୧","━━━━━━━━━","▸▸▸▸▸▸▸▸▸",
      "･･⋈･-･･–･⋈･-･･–･⋈･･","♡ ⋆｡˚ ♡ ⋆｡˚ ♡","˚ · . ˚ · . ˚ · .","꒰ ꒱ ꒰ ꒱ ꒰ ꒱"
    ]},
    {id:"igkao", en:"KAOMOJI", t:"IG 顏文字", s:"單行的顏文字貼到 IG 最穩，任何地方都不會跑版。", items:[
      "(•⩊•)","(•ᵕ•)","(•ᗢ•)","(•⇀•)","(•▬•)","(˃ᵕ˂)","(≧ᵕ≦)","(՞ᗜ՞)",
      "(ˋ◔ᗢ◔ˊ)","(ㅇᗜㅇ)","(๑>ᴗ<๑)","(*´꒳｀*)","(´｡• ᵕ •｡｀)","٩(◕‿◕)۶","(*•̀ᴗ•́*)و","(っ˘ڡ˘ς)",
      "ʕ•ᴥ•ʔ","૮ ˶ᵔ ᵕ ᵔ˶ ა","≽^•⩊•^≼","ᐡ ᐧ ﻌ ᐧ ᐡ","ฅ^•ﻌ•^ฅ","(=^･ω･^=)","(･ө･)","ʕ￫ᴥ￩ʔ"
    ], more:[
      {tag:"兔兔", lbl:"兔兔顏文字　IG 用的是比例字型，多行的圖可能會稍微錯位，貼之前先預覽", items:[
        " ꒰\\_/꒱\n ꒰•ᵕ•꒱"," /) /)\n(ฅ• . •ฅ)"," (\\_/)\n( •_•)"," /)/)\n( . .)",
        " (\\_(\\\n(=･ω･)"," /)/) (\\(\\\n( . .)(. . )",
        " (\\__ /)\n (⁎˃ᴗ˂⁎)◞♡\n />  ♥️ <\\","  {\\_/}\n  (*ˊᵕˋ)\n*ଘ/ ੭♥️੭*✩‧₊˚"
      ]}
    ], link:{href:"/kaomoji-symbols/",text:"想自己組表情、或要更多兔兔：大型顏文字產生器有 18 隻兔兔和一千多種表情組合"}},
    {id:"igdeco", en:"TINY SYMBOLS", t:"IG 自介小符號", s:"放在自介每一行的開頭或名字旁邊，一個字元就有效果，最省額度。", items:[
      "♡","⋆","✦","✧","☾","☁︎","✿","ꕥ",
      "⑅","ᰔ","࿐","˚₊·","⊹","✩","☆","❥",
      "📍","☕","✈︎","📷","🎧","🧶","📖","💌",
      "①","②","③","→","▸","┊","⌇","·"
    ]},
    {id:"igstory", en:"STORY", t:"IG 限動裝飾", s:"放在限動文字上下、照片角落，或當作貼文的開場。一整串直接貼就有氛圍。", wide:1, items:[
      "✩ ♬ ₊.🎧⋆☾⋆⁺₊✧ *ੈ✩‧₊˚","✩ ♬ ₊.⋆☾⋆⁺₊✧ *ੈ✩‧₊˚","₊·.°.⋆🫧•˚₊‧⋆.","⋆｡☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆",
      "⋆.˚✮🎧✮˚.⋆","₊·.°.⋆✮⋆.°.‧₊","๋࣭ ⭑⚝๋࣭ ⭑⚝","⫘⫘⫘⫘⫘⫘"
    ], risky:[
      "⋆.𐙚 ̊. ⋆˚𝜗𝜚˚⋆ 𝜗ৎ ^ྀི","୨ৎ ⋆𐙚 ̊. ⋆⑅°₊ ⋆౨ৎ°⟡˖ ࣪",".˚₊⊹♡ ♫ ⋅˚₊‧ 𐙚 ‧₊˚ ⋅","⋅°₊ • ୨୧ ‧₊° ⋅  𓆝 𓆟 𓆞 𓆝 𓆟",
      "𓆉𓆝 𓆟 𓆞 𓆝 𓆟𓇼","⊹ ࣪ ﹏𓊝﹏𓂁﹏⊹ ࣪ ˖","🫧𓇼𓏲*ੈ✩·🐚ᝰ.ᐟ","✮ ⋆ ˚｡𖦹 ⋆｡°✩",
      "ִׄ˚ • 𖥔 ࣪˖ ⭑ ₊ ⭒ *ೃ༄"
    ]}
  ];

  /* ---------- 複製 ---------- */
  /* 複製事件追蹤：對複製工具來說，「複製」才是真正的成功指標。
     沒有這行，GA 只看得到停留時間，分不出「找到了就走」和「找不到就走」。 */
  function track(item,section){
    if(PAGE) section=PAGE+"-"+section;
    try{
      if(window.gtag) gtag("event","copy_symbol",{symbol_item:item,symbol_section:section});
      if(window.dataLayer) window.dataLayer.push({event:"copy_symbol",symbol_item:item,symbol_section:section});
    }catch(e){}
  }

  let tid;
  function toast(msg){
    const t=$("#k-toast"); t.textContent=msg; t.classList.add("on");
    clearTimeout(tid); tid=setTimeout(()=>t.classList.remove("on"),1500);
  }
  function copy(txt,label,section){
    const done=()=>{window.dispatchEvent(new CustomEvent("km-copy",{detail:{txt:txt,label:label,section:section}}));
      toast(label?"已複製　"+label:"已複製");
      track(label||txt.slice(0,20), section||"其他");
    };
    if(navigator.clipboard&&window.isSecureContext){
      navigator.clipboard.writeText(txt).then(done).catch(fb);
    } else fb();
    function fb(){
      const ta=document.createElement("textarea");
      ta.value=txt; ta.style.cssText="position:fixed;opacity:0";
      document.body.appendChild(ta); ta.select();
      try{document.execCommand("copy");done();}catch(e){toast("複製失敗，請手動選取");}
      ta.remove();
    }
  }

  /* ---------- 產生器 ---------- */
  const build=()=>TPL[tpl].f(conv($("#k-l1").value,FONTS[fnt]),$("#k-l2").value,$("#k-l3").value);
  function render(){
    const out=build();
    $("#k-pv").textContent=out;
    const n=Array.from(out).length;          // 避免補充平面字元被算成兩個
    const max=+$("#k-plat").value;
    $("#k-cnt").textContent=n;
    const m=$("#k-meter"), note=$("#k-note");
    if(!max){                                 // Dcard、LINE、FB 沒有短上限
      $("#k-max").textContent="字元";
      m.style.visibility="hidden";
      note.classList.remove("over");
      note.textContent="這幾個平台的貼文長度很寬鬆，排版可以放心加。換行也算一個字元。";
      return;
    }
    m.style.visibility="visible";
    $("#k-max").textContent="/ "+max;
    m.querySelector("i").style.width=Math.min(100,n/max*100)+"%";
    m.classList.toggle("over",n>max);
    note.classList.toggle("over",n>max);
    note.textContent = n>max
      ? `超出 ${n-max} 個字元，這樣存不進去。刪一行框線大約可以省回 13 個。`
      : `還剩 ${max-n} 個字元。換行也算一個字元。`;
  }
  function chipset(host,arr,get,set){
    arr.forEach((o,i)=>{
      const b=document.createElement("button");
      b.className="chip"; b.textContent=o.n; b.setAttribute("aria-pressed",i===get());
      b.onclick=()=>{set(i);host.querySelectorAll(".chip").forEach((x,j)=>x.setAttribute("aria-pressed",j===i));render();};
      host.appendChild(b);
    });
  }
  chipset($("#k-tpl"),TPL,()=>tpl,i=>tpl=i);
  chipset($("#k-fnt"),FONTS,()=>fnt,i=>fnt=i);
  ["#k-l1","#k-l2","#k-l3"].forEach(s=>$(s).addEventListener("input",render));
  $("#k-plat").addEventListener("change",render);
  $("#k-copy").onclick=()=>copy(build(),"整段排版","排版產生器");
  render();

  /* ---------- 組裝 ---------- */
  const body=$("#k-body"), nav=$("#k-nav");
  const secs=[{id:"sec-gen",t:"IG 自介排版"}];
  const mk=(id,en,t,note)=>{
    const s=document.createElement("section"); s.id=id;
    s.innerHTML=`<div class="sec-en">${en}</div><h2>${t}</h2><p class="sec-note">${note}</p>`;
    body.appendChild(s); secs.push({id,t}); return s;
  };

  /* 隱形空白
     U+3164 韓文填充、U+2800 點字空方都不被判定為空白字元，
     所以能通過 Instagram 的空白修剪。全形空白 U+3000 會被吃掉。 */
  const FILL="\u3164", BR="\u2800";
  const BLANKS=[
    {l:"一格空白", v:FILL,                          d:"當作看不見的字"},
    {l:"縮排",     v:FILL.repeat(4),                d:"句子開頭空四格"},
    {l:"換一行",   v:"\n"+FILL,                     d:"最常用"},
    {l:"隔一段",   v:"\n"+FILL+"\n"+FILL,           d:"段落之間"},
    {l:"隔很開",   v:"\n"+FILL+"\n"+FILL+"\n"+FILL, d:"藏結尾標籤用"},
    {l:"點字空方", v:BR,                            d:"備用款，某些 App 較穩"},
    {l:"點字換行", v:"\n"+BR,                       d:"填充字元失效時改用"},
    {l:"零寬空格", v:"\u200B",                      d:"完全不佔寬度，斷網址用"}
  ];
  const blankSec=mk("sec-blank","LINE BREAK","IG 換行空白格","IG 自介和貼文會把連續的空行、段落開頭的空白自動刪掉，所以在 App 裡按 Enter 排好的段落，發出去就擠成一團。貼一個「看起來是空白、但 IG 不認為是空白」的字元進去，段落就留得住。");
  const bg2=document.createElement("div");
  bg2.className="grid wide";
  BLANKS.forEach(b=>{
    const btn=document.createElement("button");
    btn.className="cell blank-cell";
    btn.innerHTML=`<span class="bl-l"></span><span class="bl-d"></span>`;
    btn.querySelector(".bl-l").textContent=b.l;
    btn.querySelector(".bl-d").textContent=b.d;
    btn.title="點一下複製（複製到的是看不見的字元）";
    btn.onclick=()=>copy(b.v,b.l,"隱形空白");
    bg2.appendChild(btn);
  });
  blankSec.appendChild(bg2);
  const guide=document.createElement("div");
  guide.className="guide";
  guide.innerHTML=`<div class="g-title">怎麼用</div>
    <ol><li>先在上面點一下「換一行」，複製起來。</li>
    <li>回到 Instagram、Facebook 或 Threads 的輸入框，在想要分行的位置貼上。</li>
    <li>想空更大就貼兩次，或直接用「隔一段」。</li>
    <li>整篇排完再送出。已發布的貼文改成編輯模式一樣可以貼。</li></ol>
    <div class="g-title">要注意的事</div>
    <ul><li>這些字元一樣佔字數。個人簡介只有 150 字元，三個「隔一段」就吃掉將近 20 個。</li>
    <li>讀螢幕軟體可能會唸成奇怪的東西或整段跳過，大量使用會影響無障礙。</li>
    <li>貼上後還是被吃掉的話，換成「點字換行」試試，兩種字元在不同 App 表現不一樣。</li>
    <li>Threads 對換行比較寬容，通常直接按 Enter 就可以；IG 自介和貼文才需要這一招。</li></ul>`;
  blankSec.appendChild(guide);

  /* 符號與顏文字 */
  function grid(items,wide,section){
    const g=document.createElement("div");
    g.className="grid"+(wide?" wide":"");
    items.forEach(it=>{
      const b=document.createElement("button");
      b.className="cell"+(it.includes("\n")?" art":"");
      b.textContent=it; b.title="點一下複製";
      b.onclick=()=>copy(it,it.replace(/\s+/g," ").trim(),section);
      g.appendChild(b);
    });
    return g;
  }
  function sub(s,label,items,section){
    const lb=document.createElement("span");
    lb.className="lbl"; lb.style.marginTop="26px"; lb.textContent=label;
    s.appendChild(lb);
    const g=grid(items,true,section); g.style.marginTop="10px";
    s.appendChild(g);
  }
  let fontDone=false;
  function addFont(){
    if(fontDone) return; fontDone=true;
    const fs=mk("sec-font","FONT",FONT_T,FONT_N);
    const f=document.createElement("div");
    f.innerHTML=`<div class="field" style="margin-top:24px;max-width:340px"><input type="text" id="k-fin" value="Knitting Hiyori" maxlength="30" placeholder="輸入英文或數字"></div><div id="k-fout"></div>`;
    fs.appendChild(f);
  }
  let moodSec=null;
  DATA.forEach(d=>{
    if(FONT_AT && d.id===FONT_AT) addFont();

    /* 情境顏文字：十三類收進同一區，點開才展開，手機不用滑那麼長 */
    if(MOODS.includes(d.id)){
      if(!moodSec) moodSec=mk("sec-mood","MOODS","情境顏文字","已讀不回、想道歉、累了、想哭⋯⋯十三種情境，點開就能複製。");
      const det=document.createElement("details"); det.className="mood";
      const sm=document.createElement("summary");
      sm.innerHTML=`<span class="m-t"></span><span class="m-s"></span><span class="m-p"></span>`;
      sm.querySelector(".m-t").textContent=d.t;
      sm.querySelector(".m-s").textContent=d.s;
      sm.querySelector(".m-p").textContent=d.items.slice(0,2).join("　");
      det.appendChild(sm);
      const g=grid(d.items,false,d.t); g.style.marginTop="14px";
      det.appendChild(g);
      moodSec.appendChild(det);
      return;
    }

    const s=mk("sec-"+d.id,d.en,d.t,d.s);
    s.appendChild(grid(d.items,d.wide,d.t));
    if(d.risky) sub(s,"風格款　iPhone 多半正常，部分 Android 可能顯示成方框，貼之前先預覽",d.risky,d.t+"-風格款");
    (d.more||[]).forEach(m=>sub(s,m.lbl,m.items,d.t+"-"+m.tag));
    if(d.link){
      const a=document.createElement("a");
      a.className="xlink"; a.href=d.link.href; a.textContent=d.link.text+"　→";
      s.appendChild(a);
    }
  });
  addFont();

  function renderFonts(){
    const v=$("#k-fin").value||"Knitting Hiyori";
    const out=$("#k-fout"); out.innerHTML="";
    const row=(name,txt)=>{
      const r=document.createElement("button");
      r.className="font-row";
      r.innerHTML=`<b>${name}</b><span></span><em>COPY</em>`;
      r.querySelector("span").textContent=txt;
      r.onclick=()=>copy(txt,name,"特殊英文字型");
      out.appendChild(r);
    };
    FONTS.slice(1).forEach(f=>row(f.n,conv(v,f)));
    [["刪除線","\u0336"],["底線","\u0332"]].forEach(([n,c])=>row(n,[...v].map(ch=>ch+c).join("")));
  }
  $("#k-fin").addEventListener("input",renderFonts);
  renderFonts();

  /* 版面順序：八成以上的搜尋是衝著大型顏文字來的，所以兔兔放最前面；
     排版產生器只有少數人用，移到表情組合器之後。 */
  const genSec=document.getElementById("sec-gen"), afterSec=document.getElementById("sec-igstory"), blankSec2=document.getElementById("sec-blank");
  if(genSec&&afterSec){ afterSec.after(genSec); genSec.style.paddingTop=""; if(blankSec2) genSec.after(blankSec2); }
  secs.sort((x,y)=>document.getElementById(x.id).compareDocumentPosition(document.getElementById(y.id))&Node.DOCUMENT_POSITION_FOLLOWING?-1:1);

  /* 導覽 */
  secs.forEach(s=>{
    const b=document.createElement("button");
    b.textContent=s.t;
    b.onclick=()=>document.getElementById(s.id).scrollIntoView({behavior:"smooth",block:"start"});
    nav.appendChild(b);
  });
  const io=new IntersectionObserver(es=>{
    es.forEach(e=>{
      if(e.isIntersecting){
        const i=secs.findIndex(s=>s.id===e.target.id);
        nav.querySelectorAll("button").forEach((b,j)=>b.setAttribute("aria-current",j===i));
      }
    });
  },{rootMargin:"-15% 0px -75% 0px"});
  secs.forEach(s=>io.observe(document.getElementById(s.id)));
},
en:function(){
  const $=s=>document.querySelector(s);

  /* ---------- 頁面設定 ---------- */
  const PAGE="IG頁-EN";            // 子頁代號，GA 的區塊名稱會加上這個前綴；主頁留空以延續既有數據
  const FONT_AT="";     // 特殊字型區塊插在哪個分類之前；空字串＝放在最後
  const FONT_T="Fancy fonts for your Instagram name";
  const FONT_N="These work in your Instagram name field, but not in your username, which only takes letters, numbers, periods and underscores. Only A to Z and 0 to 9 change; other characters pass through as they are.";
  const MOODS=["read","ask","sorry","tired","happy","thanks","angry","shy","cry","speechless","sleep","eat","go"];

  /* ---------- 字型對照表（每組須為 62 字：26+26+10） ---------- */
  const U="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const UA=[...U];
  const FONTS=[
    {n:"Plain",  m:null},
    {n:"Script",  m:"𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃0123456789"},
    {n:"Italic",  m:"𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧0123456789"},
    {n:"Bold",  m:"𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗"},
    {n:"Outline",  m:"𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡"},
    {n:"Gothic",  m:"𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟0123456789"},
    {n:"Small caps",m:"ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ0123456789"},
    {n:"Circled",  m:"ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ⓪①②③④⑤⑥⑦⑧⑨"},
    {n:"Squared",  m:"🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉0123456789"},
    {n:"Wide",  m:"ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ０１２３４５６７８９"},
    {n:"Tiny",  m:"ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻ⁰¹²³⁴⁵⁶⁷⁸⁹"}
  ];
  const conv=(t,f)=>{if(!f.m)return t;const M=[...f.m];return [...t].map(c=>{const i=UA.indexOf(c);return i<0?c:M[i];}).join("");};

  /* ---------- 版型 ---------- */
  const TPL=[
    {n:"Ribbon", f:(a,b,c)=>`୨୧ ${a} ୨୧\n${b}\n${c}`},
    {n:"Stardust",   f:(a,b,c)=>`‧₊˚ ${a} ˚₊‧\n✧ ${b}\n${c} ⋆`},
    {n:"Divider", f:(a,b,c)=>`${a}\n୨୧┈┈┈┈┈୨୧\n${b}\n${c}`},
    {n:"Hearts",   f:(a,b,c)=>`♡ ${a}\n⸝⸝ ${b} ⸝⸝\n${c} ♡`},
    {n:"Minimal",   f:(a,b,c)=>`${a}\n· ${b} ·\n${c}`},
    {n:"Botanical",   f:(a,b,c)=>`ꕥ ${a} ꕥ\n${b}\n✿ ${c}`},
    {n:"Cafe",   f:(a,b,c)=>`${a}\n☕ ${b}\n୨୧⌒⌒⌒⌒୨୧\n${c}`},
    {n:"Dangle",   f:(a,b,c)=>`${a}\n　⌇\n${b}\n　⌇\n${c}`},
    {n:"Music",   f:(a,b,c)=>`♪ ${a}\n${b}\n${c} ♫`}
  ];
  let tpl=0, fnt=1;

  /* ---------- 兔兔圖 ----------
     台日韓網路社群流傳的兔子顏文字，{E} 為手上物品的插入點       */
  const POSES=[
    {n:"Classic",   f:e=>` (\\_/)\n( •_•)\n/> ${e} >`},
    {n:"Long ears",   f:e=>`  {\\__/}\n  ( • - •)\nc /> ${e} <\\`},
    {n:"Here, take it",   f:e=>`  {\\__/}\n  ( • - •)\nc /> ${e} >`},
    {n:"Starry eyes",   f:e=>`  {\\__/}\n (⌯¤̴̶̷̀ω¤̴̶̷́)\nc />　　> ${e}`},
    {n:"Little angel",   f:e=>`  {\\_/}\n  (*ˊᵕˋ)\n*ଘ/ ੭${e}੭*✩‧₊˚`},
    {n:"Kiss",   f:e=>` (\\_(\\\n (๑´³\`) ෆ\n /> ${e} >`},
    {n:"So happy",   f:e=>` (\\__ /)\n (⁎˃ᴗ˂⁎)◞♡\n />  ${e} <\\`},
    {n:"Wanna play", f:e=>` {\\___/}\n (๑❛ᴗ❛๑)\nc / >${e}>`},
    {n:"Panic",   f:e=>`  {\\__/}\n꜆꜄꜆( ´O\`)꜆꜄꜆\n  < ${e} <\\ ɔ`},
    {n:"Startled",   f:e=>` {\\__/}\nΣ(ʘ△ʘ)|||\n  <${e}<\\ ɔ`},
    {n:"Shocked",     f:e=>` (\\___/)\n (◔ д◔)\nc /> ${e} >`},
    {n:"Grumpy",   f:e=>` /) /)\n(-\`д´-)\n /> ${e} >`},
    {n:"Paws",   f:e=>`  /) /)\n(ฅ• . •ฅ)\n /> ${e} >`},
    {n:"Shy",     f:e=>` (\\_(\\\n (; ›ω‹)\n /> ${e} >`},
    {n:"Crowned",   f:e=>` (\\ ♚ /)\n (ฅ×ฅ)\n /> ${e} >`},
    {n:"Round face",   f:e=>` ꒰\\_/꒱\n ꒰•ᵕ•꒱\n /> ${e} >`},
    {n:"Squinting",   f:e=>` ꒰\\⑅/꒱ ✧\n ꒰◔ᵕ◔꒱\n /> ${e} >`},
    {n:"Together", f:e=>`*(\\_/)｡ﾟ{\\_/}*⋈\n( •×•)${e}(•×• )`}
  ];
  const EMOS=[
    "♥️","🎁","💌","✨","🌙","⭐","🔥","☂️","🎀","🫧",
    "☕","🍵","🧋","🍷","🍺","🍶","🥂","🍾","🥤","🍹",
    "🍰","🎂","🍪","🍩","🍫","🍡","🍓","🍎","🍌","🥐",
    "🍞","🍟","🌭","🍜","🍙","📚","📖","📕","📗","📓",
    "✏️","🖊️","🧶","🧵","🪡","✈️","🧳","📷","🎧","🌸"
  ];
  let emo=0;

  /* ---------- 符號資料 ---------- */
  const DATA=[
    {id:"igdiv", en:"DIVIDERS", t:"Instagram dividers", s:"Sorted by how often people actually copy them, most popular first. A full divider costs about 13 characters, so check the counter above before it goes in your bio.", wide:1, items:[
      "⋆ ˚｡⋆୨୧˚ ⋆ ˚｡⋆","♪♫*•♪♪♫*•♪♫*•♪","∴∵∴ ୨୧ ∴∵∴ ୨୧ ∴∵∴","─── ⋆⋅☆⋅⋆ ───",
      "˚₊‧ ✩ ‧₊˚ ✩ ‧₊˚","୨୧┈┈┈┈┈┈┈┈┈୨୧","╭┈┈┈┈┈┈┈┈┈╮","╰┈┈┈┈┈┈┈┈┈╯",
      "‧₊˚ ✧ ˚₊‧ ✧ ‧₊˚","✿ ⋆ ✿ ⋆ ✿ ⋆ ✿","ꔫ･–･ꔫ･–･ꔫ･–･ꔫ","꙳✧˖°⌖꙳✧˖°⌖꙳✧˖°⌖꙳",
      "·˚ ༘ ⋆｡˚ ⋆｡˚ ༘ ·","୨୧⌒⌒⌒⌒⌒⌒⌒⌒୨୧","━━━━━━━━━","▸▸▸▸▸▸▸▸▸",
      "･･⋈･-･･–･⋈･-･･–･⋈･･","♡ ⋆｡˚ ♡ ⋆｡˚ ♡","˚ · . ˚ · . ˚ · .","꒰ ꒱ ꒰ ꒱ ꒰ ꒱"
    ]},
    {id:"igkao", en:"KAOMOJI", t:"Kaomoji for Instagram", s:"Single-line kaomoji are the safest choice on Instagram. They never break, wherever you paste them.", items:[
      "(•⩊•)","(•ᵕ•)","(•ᗢ•)","(•⇀•)","(•▬•)","(˃ᵕ˂)","(≧ᵕ≦)","(՞ᗜ՞)",
      "(ˋ◔ᗢ◔ˊ)","(ㅇᗜㅇ)","(๑>ᴗ<๑)","(*´꒳｀*)","(´｡• ᵕ •｡｀)","٩(◕‿◕)۶","(*•̀ᴗ•́*)و","(っ˘ڡ˘ς)",
      "ʕ•ᴥ•ʔ","૮ ˶ᵔ ᵕ ᵔ˶ ა","≽^•⩊•^≼","ᐡ ᐧ ﻌ ᐧ ᐡ","ฅ^•ﻌ•^ฅ","(=^･ω･^=)","(･ө･)","ʕ￫ᴥ￩ʔ"
    ], more:[
      {tag:"bunny", lbl:"Bunny text art　Instagram uses a proportional font, so multi-line art may shift a little. Preview before posting", items:[
        " ꒰\\_/꒱\n ꒰•ᵕ•꒱"," /) /)\n(ฅ• . •ฅ)"," (\\_/)\n( •_•)"," /)/)\n( . .)",
        " (\\_(\\\n(=･ω･)"," /)/) (\\(\\\n( . .)(. . )",
        " (\\__ /)\n (⁎˃ᴗ˂⁎)◞♡\n />  ♥️ <\\","  {\\_/}\n  (*ˊᵕˋ)\n*ଘ/ ੭♥️੭*✩‧₊˚"
      ]}
    ], link:{href:"/en/kaomoji-symbols/",text:"Want to build your own face or need more bunnies? The kaomoji generator has 18 bunnies and over a thousand face combinations"}},
    {id:"igdeco", en:"TINY SYMBOLS", t:"Tiny bio symbols", s:"Put one at the start of each bio line or next to your name. One character does the job and saves your budget.", items:[
      "♡","⋆","✦","✧","☾","☁︎","✿","ꕥ",
      "⑅","ᰔ","࿐","˚₊·","⊹","✩","☆","❥",
      "📍","☕","✈︎","📷","🎧","🧶","📖","💌",
      "①","②","③","→","▸","┊","⌇","·"
    ]},
    {id:"igstory", en:"STORY", t:"Instagram story decorations", s:"Scatter above or below story text, in a photo corner, or at the top of a caption. Paste the whole string.", wide:1, items:[
      "✩ ♬ ₊.🎧⋆☾⋆⁺₊✧ *ੈ✩‧₊˚","✩ ♬ ₊.⋆☾⋆⁺₊✧ *ੈ✩‧₊˚","₊·.°.⋆🫧•˚₊‧⋆.","⋆｡☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆",
      "⋆.˚✮🎧✮˚.⋆","₊·.°.⋆✮⋆.°.‧₊","๋࣭ ⭑⚝๋࣭ ⭑⚝","⫘⫘⫘⫘⫘⫘"
    ], risky:[
      "⋆.𐙚 ̊. ⋆˚𝜗𝜚˚⋆ 𝜗ৎ ^ྀི","୨ৎ ⋆𐙚 ̊. ⋆⑅°₊ ⋆౨ৎ°⟡˖ ࣪",".˚₊⊹♡ ♫ ⋅˚₊‧ 𐙚 ‧₊˚ ⋅","⋅°₊ • ୨୧ ‧₊° ⋅  𓆝 𓆟 𓆞 𓆝 𓆟",
      "𓆉𓆝 𓆟 𓆞 𓆝 𓆟𓇼","⊹ ࣪ ﹏𓊝﹏𓂁﹏⊹ ࣪ ˖","🫧𓇼𓏲*ੈ✩·🐚ᝰ.ᐟ","✮ ⋆ ˚｡𖦹 ⋆｡°✩",
      "ִׄ˚ • 𖥔 ࣪˖ ⭑ ₊ ⭒ *ೃ༄"
    ]}
  ];

  /* ---------- 複製 ---------- */
  /* 複製事件追蹤：對複製工具來說，「複製」才是真正的成功指標。
     沒有這行，GA 只看得到停留時間，分不出「找到了就走」和「找不到就走」。 */
  function track(item,section){
    if(PAGE) section=PAGE+"-"+section;
    try{
      if(window.gtag) gtag("event","copy_symbol",{symbol_item:item,symbol_section:section});
      if(window.dataLayer) window.dataLayer.push({event:"copy_symbol",symbol_item:item,symbol_section:section});
    }catch(e){}
  }

  let tid;
  function toast(msg){
    const t=$("#k-toast"); t.textContent=msg; t.classList.add("on");
    clearTimeout(tid); tid=setTimeout(()=>t.classList.remove("on"),1500);
  }
  function copy(txt,label,section){
    const done=()=>{window.dispatchEvent(new CustomEvent("km-copy",{detail:{txt:txt,label:label,section:section}}));
      toast(label?"Copied　"+label:"Copied");
      track(label||txt.slice(0,20), section||"Other");
    };
    if(navigator.clipboard&&window.isSecureContext){
      navigator.clipboard.writeText(txt).then(done).catch(fb);
    } else fb();
    function fb(){
      const ta=document.createElement("textarea");
      ta.value=txt; ta.style.cssText="position:fixed;opacity:0";
      document.body.appendChild(ta); ta.select();
      try{document.execCommand("copy");done();}catch(e){toast("Copy failed. Select it manually");}
      ta.remove();
    }
  }

  /* ---------- 產生器 ---------- */
  const build=()=>TPL[tpl].f(conv($("#k-l1").value,FONTS[fnt]),$("#k-l2").value,$("#k-l3").value);
  function render(){
    const out=build();
    $("#k-pv").textContent=out;
    const n=Array.from(out).length;          // 避免補充平面字元被算成兩個
    const max=+$("#k-plat").value;
    $("#k-cnt").textContent=n;
    const m=$("#k-meter"), note=$("#k-note");
    if(!max){                                 // Dcard、LINE、FB 沒有短上限
      $("#k-max").textContent="chars";
      m.style.visibility="hidden";
      note.classList.remove("over");
      note.textContent="No tight limit here, so decorate freely. Line breaks still count as characters.";
      return;
    }
    m.style.visibility="visible";
    $("#k-max").textContent="/ "+max;
    m.querySelector("i").style.width=Math.min(100,n/max*100)+"%";
    m.classList.toggle("over",n>max);
    note.classList.toggle("over",n>max);
    note.textContent = n>max
      ? `${n-max} over. It will not save. Dropping one divider line gives back about 13.`
      : `${max-n} characters left. Line breaks count too.`;
  }
  function chipset(host,arr,get,set){
    arr.forEach((o,i)=>{
      const b=document.createElement("button");
      b.className="chip"; b.textContent=o.n; b.setAttribute("aria-pressed",i===get());
      b.onclick=()=>{set(i);host.querySelectorAll(".chip").forEach((x,j)=>x.setAttribute("aria-pressed",j===i));render();};
      host.appendChild(b);
    });
  }
  chipset($("#k-tpl"),TPL,()=>tpl,i=>tpl=i);
  chipset($("#k-fnt"),FONTS,()=>fnt,i=>fnt=i);
  ["#k-l1","#k-l2","#k-l3"].forEach(s=>$(s).addEventListener("input",render));
  $("#k-plat").addEventListener("change",render);
  $("#k-copy").onclick=()=>copy(build(),"Whole block","Bio layout");
  render();

  /* ---------- 組裝 ---------- */
  const body=$("#k-body"), nav=$("#k-nav");
  const secs=[{id:"sec-gen",t:"Bio layout"}];
  const mk=(id,en,t,note)=>{
    const s=document.createElement("section"); s.id=id;
    s.innerHTML=`<div class="sec-en">${en}</div><h2>${t}</h2><p class="sec-note">${note}</p>`;
    body.appendChild(s); secs.push({id,t}); return s;
  };

  /* 隱形空白
     U+3164 韓文填充、U+2800 點字空方都不被判定為空白字元，
     所以能通過 Instagram 的空白修剪。全形空白 U+3000 會被吃掉。 */
  const FILL="\u3164", BR="\u2800";
  const BLANKS=[
    {l:"One blank", v:FILL,                          d:"An invisible character"},
    {l:"Indent",     v:FILL.repeat(4),                d:"Four spaces of nothing"},
    {l:"Line break",   v:"\n"+FILL,                     d:"The one you want"},
    {l:"Paragraph",   v:"\n"+FILL+"\n"+FILL,           d:"Between paragraphs"},
    {l:"Big gap",   v:"\n"+FILL+"\n"+FILL+"\n"+FILL, d:"To bury your hashtags"},
    {l:"Braille blank", v:BR,                            d:"Backup. Steadier in some apps"},
    {l:"Braille break", v:"\n"+BR,                       d:"When the filler gets stripped"},
    {l:"Zero width", v:"\u200B",                      d:"No width at all. Breaks long URLs"}
  ];
  const blankSec=mk("sec-blank","LINE BREAK","Invisible characters for Instagram line breaks","Instagram deletes repeated blank lines and spaces at the start of a paragraph, so paragraphs you lay out with Enter get squashed together once you post. Paste a character that looks blank but that Instagram does not treat as blank, and your paragraphs stay put.");
  const bg2=document.createElement("div");
  bg2.className="grid wide";
  BLANKS.forEach(b=>{
    const btn=document.createElement("button");
    btn.className="cell blank-cell";
    btn.innerHTML=`<span class="bl-l"></span><span class="bl-d"></span>`;
    btn.querySelector(".bl-l").textContent=b.l;
    btn.querySelector(".bl-d").textContent=b.d;
    btn.title="Tap to copy. What you get is invisible";
    btn.onclick=()=>copy(b.v,b.l,"Invisible characters");
    bg2.appendChild(btn);
  });
  blankSec.appendChild(bg2);
  const guide=document.createElement("div");
  guide.className="guide";
  guide.innerHTML=`<div class="g-title">How to use it</div>
    <ol><li>Tap “Line break” above to copy it.</li>
    <li>Go back to Instagram, Facebook or Threads and paste it where you want the break.</li>
    <li>Paste twice for a wider gap, or use “Paragraph” instead.</li>
    <li>Lay out the whole thing before you post. Editing an existing post works the same way.</li></ol>
    <div class="g-title">Worth knowing</div>
    <ul><li>They still count. A bio is 150 characters and three paragraph gaps eat nearly 20 of them.</li>
    <li>Screen readers may announce them oddly or skip the line, so go easy if accessibility matters to you.</li>
    <li>If it still gets stripped, try “Braille break”. The two characters behave differently from app to app.</li>
    <li>Threads is relaxed about line breaks, so plain Enter is usually enough there. You only need this trick for Instagram bios and captions.</li></ul>`;
  blankSec.appendChild(guide);

  /* 符號與顏文字 */
  function grid(items,wide,section){
    const g=document.createElement("div");
    g.className="grid"+(wide?" wide":"");
    items.forEach(it=>{
      const b=document.createElement("button");
      b.className="cell"+(it.includes("\n")?" art":"");
      b.textContent=it; b.title="Tap to copy";
      b.onclick=()=>copy(it,it.replace(/\s+/g," ").trim(),section);
      g.appendChild(b);
    });
    return g;
  }
  function sub(s,label,items,section){
    const lb=document.createElement("span");
    lb.className="lbl"; lb.style.marginTop="26px"; lb.textContent=label;
    s.appendChild(lb);
    const g=grid(items,true,section); g.style.marginTop="10px";
    s.appendChild(g);
  }
  let fontDone=false;
  function addFont(){
    if(fontDone) return; fontDone=true;
    const fs=mk("sec-font","FONT",FONT_T,FONT_N);
    const f=document.createElement("div");
    f.innerHTML=`<div class="field" style="margin-top:24px;max-width:340px"><input type="text" id="k-fin" value="Knitting Hiyori" maxlength="30" placeholder="Type letters or digits"></div><div id="k-fout"></div>`;
    fs.appendChild(f);
  }
  let moodSec=null;
  DATA.forEach(d=>{
    if(FONT_AT && d.id===FONT_AT) addFont();

    /* 情境顏文字：十三類收進同一區，點開才展開，手機不用滑那麼長 */
    if(MOODS.includes(d.id)){
      if(!moodSec) moodSec=mk("sec-mood","MOODS","Kaomoji by mood","Left on read, apologising, exhausted, need a small cry: 13 moods. Tap one to open it.");
      const det=document.createElement("details"); det.className="mood";
      const sm=document.createElement("summary");
      sm.innerHTML=`<span class="m-t"></span><span class="m-s"></span><span class="m-p"></span>`;
      sm.querySelector(".m-t").textContent=d.t;
      sm.querySelector(".m-s").textContent=d.s;
      sm.querySelector(".m-p").textContent=d.items.slice(0,2).join("　");
      det.appendChild(sm);
      const g=grid(d.items,false,d.t); g.style.marginTop="14px";
      det.appendChild(g);
      moodSec.appendChild(det);
      return;
    }

    const s=mk("sec-"+d.id,d.en,d.t,d.s);
    s.appendChild(grid(d.items,d.wide,d.t));
    if(d.risky) sub(s,"Trendy set　fine on most iPhones, some Android phones show boxes. Preview before posting",d.risky,d.t+"-trendy");
    (d.more||[]).forEach(m=>sub(s,m.lbl,m.items,d.t+"-"+m.tag));
    if(d.link){
      const a=document.createElement("a");
      a.className="xlink"; a.href=d.link.href; a.textContent=d.link.text+"　→";
      s.appendChild(a);
    }
  });
  addFont();

  function renderFonts(){
    const v=$("#k-fin").value||"Knitting Hiyori";
    const out=$("#k-fout"); out.innerHTML="";
    const row=(name,txt)=>{
      const r=document.createElement("button");
      r.className="font-row";
      r.innerHTML=`<b>${name}</b><span></span><em>COPY</em>`;
      r.querySelector("span").textContent=txt;
      r.onclick=()=>copy(txt,name,"Fancy fonts");
      out.appendChild(r);
    };
    FONTS.slice(1).forEach(f=>row(f.n,conv(v,f)));
    [["Strikethrough","\u0336"],["Underline","\u0332"]].forEach(([n,c])=>row(n,[...v].map(ch=>ch+c).join("")));
  }
  $("#k-fin").addEventListener("input",renderFonts);
  renderFonts();

  /* 版面順序：八成以上的搜尋是衝著大型顏文字來的，所以兔兔放最前面；
     排版產生器只有少數人用，移到表情組合器之後。 */
  const genSec=document.getElementById("sec-gen"), afterSec=document.getElementById("sec-igstory"), blankSec2=document.getElementById("sec-blank");
  if(genSec&&afterSec){ afterSec.after(genSec); genSec.style.paddingTop=""; if(blankSec2) genSec.after(blankSec2); }
  secs.sort((x,y)=>document.getElementById(x.id).compareDocumentPosition(document.getElementById(y.id))&Node.DOCUMENT_POSITION_FOLLOWING?-1:1);

  /* 導覽 */
  secs.forEach(s=>{
    const b=document.createElement("button");
    b.textContent=s.t;
    b.onclick=()=>document.getElementById(s.id).scrollIntoView({behavior:"smooth",block:"start"});
    nav.appendChild(b);
  });
  const io=new IntersectionObserver(es=>{
    es.forEach(e=>{
      if(e.isIntersecting){
        const i=secs.findIndex(s=>s.id===e.target.id);
        nav.querySelectorAll("button").forEach((b,j)=>b.setAttribute("aria-current",j===i));
      }
    });
  },{rootMargin:"-15% 0px -75% 0px"});
  secs.forEach(s=>io.observe(document.getElementById(s.id)));
},
ja:function(){
  const $=s=>document.querySelector(s);

  /* ---------- 頁面設定 ---------- */
  const PAGE="IG頁-JA";            // 子頁代號，GA 的區塊名稱會加上這個前綴；主頁留空以延續既有數據
  const FONT_AT="";     // 特殊字型區塊插在哪個分類之前；空字串＝放在最後
  const FONT_T="インスタの名前に使える特殊フォント";
  const FONT_N="インスタの「名前」欄には貼れますが、「ユーザーネーム」は英字・数字・ピリオド・アンダーバーしか使えないので、特殊フォントは入りません。変わるのはアルファベットと数字だけで、日本語はそのままです。";
  const MOODS=["read","ask","sorry","tired","happy","thanks","angry","shy","cry","speechless","sleep","eat","go"];

  /* ---------- 字型對照表（每組須為 62 字：26+26+10） ---------- */
  const U="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const UA=[...U];
  const FONTS=[
    {n:"そのまま",  m:null},
    {n:"筆記体",  m:"𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃0123456789"},
    {n:"斜体",  m:"𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧0123456789"},
    {n:"太字",  m:"𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗"},
    {n:"袋文字",  m:"𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡"},
    {n:"ゴシック",  m:"𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟0123456789"},
    {n:"スモールキャップ",m:"ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ0123456789"},
    {n:"丸囲み",  m:"ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ⓪①②③④⑤⑥⑦⑧⑨"},
    {n:"四角囲み",  m:"🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉0123456789"},
    {n:"全角",  m:"ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ０１２３４５６７８９"},
    {n:"ミニ",  m:"ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻ⁰¹²³⁴⁵⁶⁷⁸⁹"}
  ];
  const conv=(t,f)=>{if(!f.m)return t;const M=[...f.m];return [...t].map(c=>{const i=UA.indexOf(c);return i<0?c:M[i];}).join("");};

  /* ---------- 版型 ---------- */
  const TPL=[
    {n:"リボン", f:(a,b,c)=>`୨୧ ${a} ୨୧\n${b}\n${c}`},
    {n:"星くず",   f:(a,b,c)=>`‧₊˚ ${a} ˚₊‧\n✧ ${b}\n${c} ⋆`},
    {n:"区切り線", f:(a,b,c)=>`${a}\n୨୧┈┈┈┈┈୨୧\n${b}\n${c}`},
    {n:"ハート",   f:(a,b,c)=>`♡ ${a}\n⸝⸝ ${b} ⸝⸝\n${c} ♡`},
    {n:"シンプル",   f:(a,b,c)=>`${a}\n· ${b} ·\n${c}`},
    {n:"草花",   f:(a,b,c)=>`ꕥ ${a} ꕥ\n${b}\n✿ ${c}`},
    {n:"カフェ",   f:(a,b,c)=>`${a}\n☕ ${b}\n୨୧⌒⌒⌒⌒୨୧\n${c}`},
    {n:"つり飾り",   f:(a,b,c)=>`${a}\n　⌇\n${b}\n　⌇\n${c}`},
    {n:"音符",   f:(a,b,c)=>`♪ ${a}\n${b}\n${c} ♫`}
  ];
  let tpl=0, fnt=1;

  /* ---------- 兔兔圖 ----------
     台日韓網路社群流傳的兔子顏文字，{E} 為手上物品的插入點       */
  const POSES=[
    {n:"定番",   f:e=>` (\\_/)\n( •_•)\n/> ${e} >`},
    {n:"しっぽ",   f:e=>`  {\\__/}\n  ( • - •)\nc /> ${e} <\\`},
    {n:"どうぞ",   f:e=>`  {\\__/}\n  ( • - •)\nc /> ${e} >`},
    {n:"キラキラ目",   f:e=>`  {\\__/}\n (⌯¤̴̶̷̀ω¤̴̶̷́)\nc />　　> ${e}`},
    {n:"天使",   f:e=>`  {\\_/}\n  (*ˊᵕˋ)\n*ଘ/ ੭${e}੭*✩‧₊˚`},
    {n:"ちゅっ",   f:e=>` (\\_(\\\n (๑´³\`) ෆ\n /> ${e} >`},
    {n:"うれしい",   f:e=>` (\\__ /)\n (⁎˃ᴗ˂⁎)◞♡\n />  ${e} <\\`},
    {n:"遊ぶ？", f:e=>` {\\___/}\n (๑❛ᴗ❛๑)\nc / >${e}>`},
    {n:"どうしよう",   f:e=>`  {\\__/}\n꜆꜄꜆( ´O\`)꜆꜄꜆\n  < ${e} <\\ ɔ`},
    {n:"びっくり",   f:e=>` {\\__/}\nΣ(ʘ△ʘ)|||\n  <${e}<\\ ɔ`},
    {n:"がーん",     f:e=>` (\\___/)\n (◔ д◔)\nc /> ${e} >`},
    {n:"おこ",   f:e=>` /) /)\n(-\`д´-)\n /> ${e} >`},
    {n:"ねこの手",   f:e=>`  /) /)\n(ฅ• . •ฅ)\n /> ${e} >`},
    {n:"てれ",     f:e=>` (\\_(\\\n (; ›ω‹)\n /> ${e} >`},
    {n:"王冠",   f:e=>` (\\ ♚ /)\n (ฅ×ฅ)\n /> ${e} >`},
    {n:"まるがお",   f:e=>` ꒰\\_/꒱\n ꒰•ᵕ•꒱\n /> ${e} >`},
    {n:"にっこり目",   f:e=>` ꒰\\⑅/꒱ ✧\n ꒰◔ᵕ◔꒱\n /> ${e} >`},
    {n:"ふたりで", f:e=>`*(\\_/)｡ﾟ{\\_/}*⋈\n( •×•)${e}(•×• )`}
  ];
  const EMOS=[
    "♥️","🎁","💌","✨","🌙","⭐","🔥","☂️","🎀","🫧",
    "☕","🍵","🧋","🍷","🍺","🍶","🥂","🍾","🥤","🍹",
    "🍰","🎂","🍪","🍩","🍫","🍡","🍓","🍎","🍌","🥐",
    "🍞","🍟","🌭","🍜","🍙","📚","📖","📕","📗","📓",
    "✏️","🖊️","🧶","🧵","🪡","✈️","🧳","📷","🎧","🌸"
  ];
  let emo=0;

  /* ---------- 符號資料 ---------- */
  const DATA=[
    {id:"igdiv", en:"DIVIDERS", t:"インスタの区切り線", s:"実際にコピーされた回数の多い順に並べています。区切り線は1本で約13文字使うので、プロフィールに入れる前に上の残り文字数を確認してね。", wide:1, items:[
      "⋆ ˚｡⋆୨୧˚ ⋆ ˚｡⋆","♪♫*•♪♪♫*•♪♫*•♪","∴∵∴ ୨୧ ∴∵∴ ୨୧ ∴∵∴","─── ⋆⋅☆⋅⋆ ───",
      "˚₊‧ ✩ ‧₊˚ ✩ ‧₊˚","୨୧┈┈┈┈┈┈┈┈┈୨୧","╭┈┈┈┈┈┈┈┈┈╮","╰┈┈┈┈┈┈┈┈┈╯",
      "‧₊˚ ✧ ˚₊‧ ✧ ‧₊˚","✿ ⋆ ✿ ⋆ ✿ ⋆ ✿","ꔫ･–･ꔫ･–･ꔫ･–･ꔫ","꙳✧˖°⌖꙳✧˖°⌖꙳✧˖°⌖꙳",
      "·˚ ༘ ⋆｡˚ ⋆｡˚ ༘ ·","୨୧⌒⌒⌒⌒⌒⌒⌒⌒୨୧","━━━━━━━━━","▸▸▸▸▸▸▸▸▸",
      "･･⋈･-･･–･⋈･-･･–･⋈･･","♡ ⋆｡˚ ♡ ⋆｡˚ ♡","˚ · . ˚ · . ˚ · .","꒰ ꒱ ꒰ ꒱ ꒰ ꒱"
    ]},
    {id:"igkao", en:"KAOMOJI", t:"インスタ向け顔文字", s:"1行の顔文字はインスタで一番安定。どこに貼っても崩れません。", items:[
      "(•⩊•)","(•ᵕ•)","(•ᗢ•)","(•⇀•)","(•▬•)","(˃ᵕ˂)","(≧ᵕ≦)","(՞ᗜ՞)",
      "(ˋ◔ᗢ◔ˊ)","(ㅇᗜㅇ)","(๑>ᴗ<๑)","(*´꒳｀*)","(´｡• ᵕ •｡｀)","٩(◕‿◕)۶","(*•̀ᴗ•́*)و","(っ˘ڡ˘ς)",
      "ʕ•ᴥ•ʔ","૮ ˶ᵔ ᵕ ᵔ˶ ა","≽^•⩊•^≼","ᐡ ᐧ ﻌ ᐧ ᐡ","ฅ^•ﻌ•^ฅ","(=^･ω･^=)","(･ө･)","ʕ￫ᴥ￩ʔ"
    ], more:[
      {tag:"うさぎ", lbl:"うさぎのAA　インスタはプロポーショナルフォントなので、複数行の絵は少しずれることがあります。貼る前に確認してね", items:[
        " ꒰\\_/꒱\n ꒰•ᵕ•꒱"," /) /)\n(ฅ• . •ฅ)"," (\\_/)\n( •_•)"," /)/)\n( . .)",
        " (\\_(\\\n(=･ω･)"," /)/) (\\(\\\n( . .)(. . )",
        " (\\__ /)\n (⁎˃ᴗ˂⁎)◞♡\n />  ♥️ <\\","  {\\_/}\n  (*ˊᵕˋ)\n*ଘ/ ੭♥️੭*✩‧₊˚"
      ]}
    ], link:{href:"/ja/kaomoji-symbols/",text:"自分で顔を組み立てたい、もっとうさぎがほしい時は：顔文字ジェネレーターに18匹のうさぎと1,000種類以上の顔があります"}},
    {id:"igdeco", en:"TINY SYMBOLS", t:"プロフィール用の小さな記号", s:"プロフィールの各行の頭や名前の横に。1文字で効果があり、文字数も節約できます。", items:[
      "♡","⋆","✦","✧","☾","☁︎","✿","ꕥ",
      "⑅","ᰔ","࿐","˚₊·","⊹","✩","☆","❥",
      "📍","☕","✈︎","📷","🎧","🧶","📖","💌",
      "①","②","③","→","▸","┊","⌇","·"
    ]},
    {id:"igstory", en:"STORY", t:"ストーリーの飾り", s:"ストーリーの文字の上下や写真の角、投稿の書き出しに。まるごと貼るだけで雰囲気が出ます。", wide:1, items:[
      "✩ ♬ ₊.🎧⋆☾⋆⁺₊✧ *ੈ✩‧₊˚","✩ ♬ ₊.⋆☾⋆⁺₊✧ *ੈ✩‧₊˚","₊·.°.⋆🫧•˚₊‧⋆.","⋆｡☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆",
      "⋆.˚✮🎧✮˚.⋆","₊·.°.⋆✮⋆.°.‧₊","๋࣭ ⭑⚝๋࣭ ⭑⚝","⫘⫘⫘⫘⫘⫘"
    ], risky:[
      "⋆.𐙚 ̊. ⋆˚𝜗𝜚˚⋆ 𝜗ৎ ^ྀི","୨ৎ ⋆𐙚 ̊. ⋆⑅°₊ ⋆౨ৎ°⟡˖ ࣪",".˚₊⊹♡ ♫ ⋅˚₊‧ 𐙚 ‧₊˚ ⋅","⋅°₊ • ୨୧ ‧₊° ⋅  𓆝 𓆟 𓆞 𓆝 𓆟",
      "𓆉𓆝 𓆟 𓆞 𓆝 𓆟𓇼","⊹ ࣪ ﹏𓊝﹏𓂁﹏⊹ ࣪ ˖","🫧𓇼𓏲*ੈ✩·🐚ᝰ.ᐟ","✮ ⋆ ˚｡𖦹 ⋆｡°✩",
      "ִׄ˚ • 𖥔 ࣪˖ ⭑ ₊ ⭒ *ೃ༄"
    ]}
  ];

  /* ---------- 複製 ---------- */
  /* 複製事件追蹤：對複製工具來說，「複製」才是真正的成功指標。
     沒有這行，GA 只看得到停留時間，分不出「找到了就走」和「找不到就走」。 */
  function track(item,section){
    if(PAGE) section=PAGE+"-"+section;
    try{
      if(window.gtag) gtag("event","copy_symbol",{symbol_item:item,symbol_section:section});
      if(window.dataLayer) window.dataLayer.push({event:"copy_symbol",symbol_item:item,symbol_section:section});
    }catch(e){}
  }

  let tid;
  function toast(msg){
    const t=$("#k-toast"); t.textContent=msg; t.classList.add("on");
    clearTimeout(tid); tid=setTimeout(()=>t.classList.remove("on"),1500);
  }
  function copy(txt,label,section){
    const done=()=>{window.dispatchEvent(new CustomEvent("km-copy",{detail:{txt:txt,label:label,section:section}}));
      toast(label?"コピーしました　"+label:"コピーしました");
      track(label||txt.slice(0,20), section||"その他");
    };
    if(navigator.clipboard&&window.isSecureContext){
      navigator.clipboard.writeText(txt).then(done).catch(fb);
    } else fb();
    function fb(){
      const ta=document.createElement("textarea");
      ta.value=txt; ta.style.cssText="position:fixed;opacity:0";
      document.body.appendChild(ta); ta.select();
      try{document.execCommand("copy");done();}catch(e){toast("コピーできませんでした。手動で選択してください");}
      ta.remove();
    }
  }

  /* ---------- 產生器 ---------- */
  const build=()=>TPL[tpl].f(conv($("#k-l1").value,FONTS[fnt]),$("#k-l2").value,$("#k-l3").value);
  function render(){
    const out=build();
    $("#k-pv").textContent=out;
    const n=Array.from(out).length;          // 避免補充平面字元被算成兩個
    const max=+$("#k-plat").value;
    $("#k-cnt").textContent=n;
    const m=$("#k-meter"), note=$("#k-note");
    if(!max){                                 // Dcard、LINE、FB 沒有短上限
      $("#k-max").textContent="文字";
      m.style.visibility="hidden";
      note.classList.remove("over");
      note.textContent="ここは文字数の上限がゆるいので、飾りを気にせず足せます。改行も1文字に数えます。";
      return;
    }
    m.style.visibility="visible";
    $("#k-max").textContent="/ "+max;
    m.querySelector("i").style.width=Math.min(100,n/max*100)+"%";
    m.classList.toggle("over",n>max);
    note.classList.toggle("over",n>max);
    note.textContent = n>max
      ? `${n-max} 文字オーバーで、このままでは保存できません。枠線を1行消すと約13文字減らせます。`
      : `あと ${max-n} 文字。改行も1文字に数えます。`;
  }
  function chipset(host,arr,get,set){
    arr.forEach((o,i)=>{
      const b=document.createElement("button");
      b.className="chip"; b.textContent=o.n; b.setAttribute("aria-pressed",i===get());
      b.onclick=()=>{set(i);host.querySelectorAll(".chip").forEach((x,j)=>x.setAttribute("aria-pressed",j===i));render();};
      host.appendChild(b);
    });
  }
  chipset($("#k-tpl"),TPL,()=>tpl,i=>tpl=i);
  chipset($("#k-fnt"),FONTS,()=>fnt,i=>fnt=i);
  ["#k-l1","#k-l2","#k-l3"].forEach(s=>$(s).addEventListener("input",render));
  $("#k-plat").addEventListener("change",render);
  $("#k-copy").onclick=()=>copy(build(),"まとめて整形","プロフィール整形");
  render();

  /* ---------- 組裝 ---------- */
  const body=$("#k-body"), nav=$("#k-nav");
  const secs=[{id:"sec-gen",t:"プロフィール整形"}];
  const mk=(id,en,t,note)=>{
    const s=document.createElement("section"); s.id=id;
    s.innerHTML=`<div class="sec-en">${en}</div><h2>${t}</h2><p class="sec-note">${note}</p>`;
    body.appendChild(s); secs.push({id,t}); return s;
  };

  /* 隱形空白
     U+3164 韓文填充、U+2800 點字空方都不被判定為空白字元，
     所以能通過 Instagram 的空白修剪。全形空白 U+3000 會被吃掉。 */
  const FILL="\u3164", BR="\u2800";
  const BLANKS=[
    {l:"ひとマス空白", v:FILL,                          d:"見えない文字として"},
    {l:"字下げ",     v:FILL.repeat(4),                d:"行頭に4マス空ける"},
    {l:"改行",   v:"\n"+FILL,                     d:"一番よく使う"},
    {l:"段落を空ける",   v:"\n"+FILL+"\n"+FILL,           d:"段落と段落の間に"},
    {l:"大きく空ける",   v:"\n"+FILL+"\n"+FILL+"\n"+FILL, d:"最後のハッシュタグを隠す"},
    {l:"点字の空白", v:BR,                            d:"予備。アプリによってはこちらが安定"},
    {l:"点字の改行", v:"\n"+BR,                       d:"通常の空白が消される時に"},
    {l:"ゼロ幅スペース", v:"\u200B",                      d:"幅ゼロ。長いURLを区切る時に"}
  ];
  const blankSec=mk("sec-blank","LINE BREAK","インスタ改行用の見えない空白","インスタのプロフィールや投稿は、連続した空行や段落の先頭の空白を自動で消してしまうので、アプリで Enter を押して空けた段落も、投稿するとくっついてしまいます。「空白に見えるけれど、インスタは空白と判定しない文字」を入れると、段落がちゃんと残ります。");
  const bg2=document.createElement("div");
  bg2.className="grid wide";
  BLANKS.forEach(b=>{
    const btn=document.createElement("button");
    btn.className="cell blank-cell";
    btn.innerHTML=`<span class="bl-l"></span><span class="bl-d"></span>`;
    btn.querySelector(".bl-l").textContent=b.l;
    btn.querySelector(".bl-d").textContent=b.d;
    btn.title="タップしてコピー（コピーされるのは見えない文字です）";
    btn.onclick=()=>copy(b.v,b.l,"見えない空白");
    bg2.appendChild(btn);
  });
  blankSec.appendChild(bg2);
  const guide=document.createElement("div");
  guide.className="guide";
  guide.innerHTML=`<div class="g-title">使い方</div>
    <ol><li>上の「改行」をタップしてコピーします。</li>
    <li>Instagram、Facebook、Threads の入力欄に戻り、改行したい位置に貼り付けます。</li>
    <li>もっと空けたい時は2回貼るか、「段落を空ける」を使います。</li>
    <li>全体を整えてから投稿します。投稿済みでも、編集画面で同じように貼れます。</li></ol>
    <div class="g-title">注意すること</div>
    <ul><li>見えなくても文字数に数えられます。プロフィールは150文字までなので、「段落を空ける」を3回使うと20文字近く減ります。</li>
    <li>読み上げソフトでは変な音で読まれたり、飛ばされたりすることがあります。使いすぎるとアクセシビリティに影響します。</li>
    <li>貼っても消える時は「点字の改行」を試してください。アプリによって残りやすい文字が違います。</li>
    <li>Threads は改行が消えにくいので、ふつうは Enter だけで大丈夫。この方法が必要なのはインスタのプロフィールと投稿です。</li></ul>`;
  blankSec.appendChild(guide);

  /* 符號與顏文字 */
  function grid(items,wide,section){
    const g=document.createElement("div");
    g.className="grid"+(wide?" wide":"");
    items.forEach(it=>{
      const b=document.createElement("button");
      b.className="cell"+(it.includes("\n")?" art":"");
      b.textContent=it; b.title="タップしてコピー";
      b.onclick=()=>copy(it,it.replace(/\s+/g," ").trim(),section);
      g.appendChild(b);
    });
    return g;
  }
  function sub(s,label,items,section){
    const lb=document.createElement("span");
    lb.className="lbl"; lb.style.marginTop="26px"; lb.textContent=label;
    s.appendChild(lb);
    const g=grid(items,true,section); g.style.marginTop="10px";
    s.appendChild(g);
  }
  let fontDone=false;
  function addFont(){
    if(fontDone) return; fontDone=true;
    const fs=mk("sec-font","FONT",FONT_T,FONT_N);
    const f=document.createElement("div");
    f.innerHTML=`<div class="field" style="margin-top:24px;max-width:340px"><input type="text" id="k-fin" value="Knitting Hiyori" maxlength="30" placeholder="英字か数字を入力"></div><div id="k-fout"></div>`;
    fs.appendChild(f);
  }
  let moodSec=null;
  DATA.forEach(d=>{
    if(FONT_AT && d.id===FONT_AT) addFont();

    /* 情境顏文字：十三類收進同一區，點開才展開，手機不用滑那麼長 */
    if(MOODS.includes(d.id)){
      if(!moodSec) moodSec=mk("sec-mood","MOODS","気持ち別の顔文字","既読スルー、謝りたい、疲れた、泣きたい⋯⋯13のシーン別。開くとすぐコピーできます。");
      const det=document.createElement("details"); det.className="mood";
      const sm=document.createElement("summary");
      sm.innerHTML=`<span class="m-t"></span><span class="m-s"></span><span class="m-p"></span>`;
      sm.querySelector(".m-t").textContent=d.t;
      sm.querySelector(".m-s").textContent=d.s;
      sm.querySelector(".m-p").textContent=d.items.slice(0,2).join("　");
      det.appendChild(sm);
      const g=grid(d.items,false,d.t); g.style.marginTop="14px";
      det.appendChild(g);
      moodSec.appendChild(det);
      return;
    }

    const s=mk("sec-"+d.id,d.en,d.t,d.s);
    s.appendChild(grid(d.items,d.wide,d.t));
    if(d.risky) sub(s,"スタイル系　iPhoneではほぼ表示されますが、一部のAndroidでは四角になることがあります。貼る前に確認してね",d.risky,d.t+"-スタイル系");
    (d.more||[]).forEach(m=>sub(s,m.lbl,m.items,d.t+"-"+m.tag));
    if(d.link){
      const a=document.createElement("a");
      a.className="xlink"; a.href=d.link.href; a.textContent=d.link.text+"　→";
      s.appendChild(a);
    }
  });
  addFont();

  function renderFonts(){
    const v=$("#k-fin").value||"Knitting Hiyori";
    const out=$("#k-fout"); out.innerHTML="";
    const row=(name,txt)=>{
      const r=document.createElement("button");
      r.className="font-row";
      r.innerHTML=`<b>${name}</b><span></span><em>COPY</em>`;
      r.querySelector("span").textContent=txt;
      r.onclick=()=>copy(txt,name,"英字の特殊フォント");
      out.appendChild(r);
    };
    FONTS.slice(1).forEach(f=>row(f.n,conv(v,f)));
    [["取り消し線","\u0336"],["下線","\u0332"]].forEach(([n,c])=>row(n,[...v].map(ch=>ch+c).join("")));
  }
  $("#k-fin").addEventListener("input",renderFonts);
  renderFonts();

  /* 版面順序：八成以上的搜尋是衝著大型顏文字來的，所以兔兔放最前面；
     排版產生器只有少數人用，移到表情組合器之後。 */
  const genSec=document.getElementById("sec-gen"), afterSec=document.getElementById("sec-igstory"), blankSec2=document.getElementById("sec-blank");
  if(genSec&&afterSec){ afterSec.after(genSec); genSec.style.paddingTop=""; if(blankSec2) genSec.after(blankSec2); }
  secs.sort((x,y)=>document.getElementById(x.id).compareDocumentPosition(document.getElementById(y.id))&Node.DOCUMENT_POSITION_FOLLOWING?-1:1);

  /* 導覽 */
  secs.forEach(s=>{
    const b=document.createElement("button");
    b.textContent=s.t;
    b.onclick=()=>document.getElementById(s.id).scrollIntoView({behavior:"smooth",block:"start"});
    nav.appendChild(b);
  });
  const io=new IntersectionObserver(es=>{
    es.forEach(e=>{
      if(e.isIntersecting){
        const i=secs.findIndex(s=>s.id===e.target.id);
        nav.querySelectorAll("button").forEach((b,j)=>b.setAttribute("aria-current",j===i));
      }
    });
  },{rootMargin:"-15% 0px -75% 0px"});
  secs.forEach(s=>io.observe(document.getElementById(s.id)));
}
};
(RUN[window.TS_PAGE_LANG]||RUN.zh)();
})();

/* ---------- 左邊的手機畫面（2026-10-26）：點的符號會出現在聊天／IG 自介裡 ---------- */
(function(){
  var toastEl=document.getElementById("k-toast"), tid;
  function toast(m){ if(!toastEl) return; toastEl.textContent=m; toastEl.classList.add("on"); clearTimeout(tid); tid=setTimeout(function(){toastEl.classList.remove("on")},1500); }
  function copyText(t,msg,item){
    var ok=function(){ toast(msg); try{ if(window.gtag) gtag("event","copy_symbol",{symbol_item:item,symbol_section:"手機預覽"}); }catch(e){} };
    if(navigator.clipboard&&window.isSecureContext) navigator.clipboard.writeText(t).then(ok).catch(fb); else fb();
    function fb(){ var a=document.createElement("textarea"); a.value=t; a.style.cssText="position:fixed;opacity:0"; document.body.appendChild(a); a.select(); try{document.execCommand("copy");ok();}catch(e){} a.remove(); }
  }
  var visible=function(t){ return /[^\sㅤ⠀​]/.test(t||""); };
  var chat=document.getElementById("km-chat");
  if(chat){
    var last="";
    var add=function(t){ var b=document.createElement("div"); b.className="bub me"+(t.indexOf("\n")>=0?" ml":""); b.textContent=t; chat.appendChild(b);
      while(chat.children.length>8) chat.removeChild(chat.firstChild); chat.scrollTop=chat.scrollHeight; };
    window.addEventListener("km-copy",function(e){ var t=e.detail&&e.detail.txt; if(!visible(t)) return; last=t; add(t); });
    document.getElementById("km-last").addEventListener("click",function(){ if(last) copyText(last,chat.dataset.copied+"　"+last.replace(/\s+/g," ").trim(),"聊天-最後一個"); });
    document.getElementById("km-clear").addEventListener("click",function(){ while(chat.children.length>1) chat.removeChild(chat.lastChild); last=""; });
  }
  var bio=document.getElementById("km-bio"), pv=document.getElementById("k-pv");
  if(bio&&pv){
    var extra=[], cnt=document.getElementById("km-bio-n");
    var text=function(){ return pv.textContent+(extra.length?" "+extra.join(" "):""); };
    var draw=function(){ var t=text(), n=Array.from(t).length; bio.textContent=t; cnt.textContent=bio.dataset.n.replace("{n}",n); cnt.classList.toggle("over",n>150); };
    new MutationObserver(draw).observe(pv,{childList:true,characterData:true,subtree:true}); draw();
    window.addEventListener("km-copy",function(e){ var t=e.detail&&e.detail.txt; if(!visible(t)||t===pv.textContent||t.indexOf("\n")>=0) return; extra.push(t); if(extra.length>3) extra.shift(); draw(); });
    document.getElementById("km-copybio").addEventListener("click",function(){ copyText(text(),bio.dataset.copied,"IG自介預覽"); });
    document.getElementById("km-undo").addEventListener("click",function(){ extra.pop(); draw(); });
  }
})();
