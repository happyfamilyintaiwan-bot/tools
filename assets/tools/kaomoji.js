/* 大型顏文字產生器（kaomoji）三語
   由 WordPress 線上版搬來（2026-10-25）：中文、英文沿用原本的程式，日文依原版翻譯。
   頁面語言由 window.TS_PAGE_LANG 決定（tool_pages.py 產生）。 */
(function(){
const RUN={
zh:function(){
  const $=s=>document.querySelector(s);

  
  /* ---------- 頁面設定 ---------- */
  const PAGE="";            // 子頁代號，GA 的區塊名稱會加上這個前綴；主頁留空以延續既有數據
  const FONT_AT="read";     // 特殊字型區塊插在哪個分類之前；空字串＝放在最後
  const FONT_T="特殊英文字型";
  const FONT_N="Unicode 字型只吃英文和數字，中文會保持原樣。建議用在裝飾性句子，帳號名稱留正常字體，不然平台搜尋會找不到你。";
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
    {id:"border", en:"DIVIDERS", t:"IG 分隔線・邊框", link:{href:"/ig-symbols/",text:"IG 專用整理：自介排版、分隔線、限動裝飾、名字字型都在這一頁"}, s:"IG 貼文、限動、簡介用的分隔線和邊框，框住重點或把段落隔開。這區最吃字元，用之前先看一下額度。", wide:1, items:[
      "୨୧┈┈┈┈┈┈┈┈┈୨୧","୨୧⌒⌒⌒⌒⌒⌒⌒⌒୨୧","ꔫ･–･ꔫ･–･ꔫ･–･ꔫ","･･⋈･-･･–･⋈･-･･–･⋈･･",
      "∴∵∴ ୨୧ ∴∵∴ ୨୧ ∴∵∴","꙳✧˖°⌖꙳✧˖°⌖꙳✧˖°⌖꙳","╭┈┈┈┈┈┈┈┈┈╮","╰┈┈┈┈┈┈┈┈┈╯",
      "✿ ⋆ ✿ ⋆ ✿ ⋆ ✿","♡ ⋆｡˚ ♡ ⋆｡˚ ♡","‧₊˚ ✧ ˚₊‧ ✧ ‧₊˚","─── ⋆⋅☆⋅⋆ ───",
      "꒰ ꒱ ꒰ ꒱ ꒰ ꒱","˚ · . ˚ · . ˚ · .","▸▸▸▸▸▸▸▸▸","━━━━━━━━━",
      "⋆ ˚｡⋆୨୧˚ ⋆ ˚｡⋆","·˚ ༘ ⋆｡˚ ⋆｡˚ ༘ ·","♪♫*•♪♪♫*•♪♫*•♪","˚₊‧ ✩ ‧₊˚ ✩ ‧₊˚"
    ]},
    {id:"story", en:"IG STORY", t:"IG 限動裝飾", s:"放在限動文字上下、照片角落或貼文開頭，一整串直接貼就很有氛圍。", wide:1, items:[
      "✩ ♬ ₊.🎧⋆☾⋆⁺₊✧ *ੈ✩‧₊˚","✩ ♬ ₊.⋆☾⋆⁺₊✧ *ੈ✩‧₊˚","₊·.°.⋆🫧•˚₊‧⋆.","⋆｡☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆",
      "⋆.˚✮🎧✮˚.⋆","₊·.°.⋆✮⋆.°.‧₊","๋࣭ ⭑⚝๋࣭ ⭑⚝","⫘⫘⫘⫘⫘⫘"
    ], risky:[
      "⋆.𐙚 ̊. ⋆˚𝜗𝜚˚⋆ 𝜗ৎ ^ྀི","୨ৎ ⋆𐙚 ̊. ⋆⑅°₊ ⋆౨ৎ°⟡˖ ࣪",".˚₊⊹♡ ♫ ⋅˚₊‧ 𐙚 ‧₊˚ ⋅","⋅°₊ • ୨୧ ‧₊° ⋅  𓆝 𓆟 𓆞 𓆝 𓆟",
      "𓆉𓆝 𓆟 𓆞 𓆝 𓆟𓇼","⊹ ࣪ ﹏𓊝﹏𓂁﹏⊹ ࣪ ˖","🫧𓇼𓏲*ੈ✩·🐚ᝰ.ᐟ","✮ ⋆ ˚｡𖦹 ⋆｡°✩",
      "ִׄ˚ • 𖥔 ࣪˖ ⭑ ₊ ⭒ *ೃ༄"
    ]},
    {id:"star", en:"STARS", t:"星星・閃光", s:"放在句尾或名字旁邊，一到兩個字元就有效果。", items:[
      "★","☆","✦","✧","⋆","✩","✪","✫",
      "✬","✭","✮","✯","✰","⍟","࿐","˚₊·",
      "⁺˖","⊹","✵","✶","✷","✸","❋","✺",
      "｡･:*:･ﾟ★","˚ ✦","⋆｡°✩","· ˚ ✧","༄˖°","꙳","☄","⭑"
    ]},
    {id:"deco", en:"ORNAMENTS", t:"愛心・花朵", s:"單顆放在句尾最好用，只花一到兩個字元。", items:[
      "♡","♥","❤︎","ღ","꒰ ♡ ꒱","⸝⸝ ♡ ⸝⸝","♡̶","♡⃛",
      "ෆ","❥","♡*｡","˗ˏˋ ♡ ˎˊ˗","✿","❀","ꕥ","❁",
      "✾","♧","☘","༄","☾","☁︎","៚","⌇",
      "ᐝ","ᰔ","𖤣","⑅","◞♡","♡‧₊˚","⋆⑅˚₊","꒰♡꒱"
    ]},
    {id:"bracket", en:"BRACKETS", t:"括號・裝飾框", s:"包住標題或分類名稱。", items:[
      "꒰ ꒱","「 」","『 』","【 】","〔 〕","〖 〗","《 》","〈 〉",
      "≡ ≡","༺ ༻","꧁ ꧂","⟢ ⟣","⌜ ⌝","⌞ ⌟","▛ ▟","┌ ┐"
    ]},
    {id:"music", en:"MUSIC", t:"音樂符號", s:"寫歌單、貼歌詞、限動配樂都用得到。前面幾排是各系統都穩定的；最後八個是社群流行的風格款，用到比較冷門的文字區塊，iPhone 大多沒問題，部分 Android 可能顯示不出來，貼之前先自己看一次。", items:[
      "♪","♫","♬","♩","♭","♮","♯","🎵",
      "🎶","🎼","🎧","🎤","🎸","🎹","🥁","🎺",
      "♪♫","♫♪","♪⋆","✧♬","˚♪ ₊","♫*•","♪~","･ﾟ♪",
      "୨♪୧","⌒♪⌒","♪♪♪","˖♬°","♩‧₊˚","₊˚♪","♬⋆｡˚","˚♫₊·",
      "ᕷ˖°♪.¸","¸♬•*✩","¨*•.♫","⸝♬ ͟͟͞͞➳❥⁎",
      "♪ .⩇⩇:⩇⩇","ıllıılıılı ♫♪ ༘⋆","˖ ࣪⊹♫⸝⸝꙳","🎧𖥦 ♪ ༘",
      "♪ 𓂃 𓈒𓏸","♪⨾ 𓂃 ࣪⋆","၊၊||၊ ♪⊹","♪⨾ ᡣ𐭩"
    ]},
    {id:"number", en:"NUMBERS", t:"圓圈數字符號", s:"排清單、標步驟、寫規則用的數字符號。圓圈、方框、括號、羅馬數字都在這裡。", items:[
      "①","②","③","④","⑤","⑥","⑦","⑧","⑨","⑩",
      "⓵","⓶","⓷","⓸","⓹","⓺","⓻","⓼","⓽","⓾",
      "❶","❷","❸","❹","❺","❻","❼","❽","❾","❿",
      "⑴","⑵","⑶","⑷","⑸","⑹","⑺","⑻","⑼","⑽",
      "⒈","⒉","⒊","⒋","⒌","⒍","⒎","⒏","⒐","⒑",
      "🄁","🄂","🄃","🄄","🄅","🄆","🄇","🄈","🄉","🄊",
      "Ⅰ","Ⅱ","Ⅲ","Ⅳ","Ⅴ","Ⅵ","Ⅶ","Ⅷ","Ⅸ","Ⅹ",
      "㊀","㊁","㊂","㊃","㊄","㊅","㊆","㊇","㊈","㊉"
    ]},
    {id:"dot", en:"DOTS & LINES", t:"點・線・幾何", s:"排清單、時間軸、營業時間都用得上。", items:[
      "·","•","◦","‧","⋅","∙","◌","○",
      "▪︎","▫︎","◆","◇","▸","▹","➤","→",
      "︙","⋮","│","┊","┆","╎","⌁","〰"
    ]},
    {id:"read", en:"AWKWARD", t:"已讀不回的時候", s:"尷尬・無言・等待", items:[
      "(´・ω・｀)","(・_・;)","( ˘•ω•˘ )","(；´д｀)","(．．;)","(´-ω-｀)","( ˇωˇ )","(・∀・;)"
    ]},
    {id:"ask", en:"PLEASE", t:"想拜託人家的時候", s:"撒嬌・請求", items:[
      "(＞人＜;)","(っ˘ω˘ς )","(人◕‿◕)","(´･ω･｀)ﾉ","(つ✧ω✧)つ","(๑•̀ㅂ•́)ﾉ","(人´∀｀)","( ˘ ³˘)♡"
    ]},
    {id:"sorry", en:"SORRY", t:"需要道歉的時候", s:"認錯・鞠躬", items:[
      "m(_ _)m","<(_ _)>","(*_ _)人","(⌒_⌒;)","(´；ω；｀)","(・_・;)ゞ","ｍ(￣ ￣)ｍ","(＿ ＿*)"
    ]},
    {id:"tired", en:"EXHAUSTED", t:"今天真的累了", s:"厭世・放空・耍廢", items:[
      "(´-ω-｀)","( ˘_˘ )","_(:3」∠)_","(=____=)","(＿ ＿)zzz","( ×ω× )","(￣ω￣;)","o(_ _)o"
    ]},
    {id:"happy", en:"JOY", t:"開心到想轉圈", s:"興奮・慶祝", items:[
      "(≧▽≦)","٩(◕‿◕)۶","＼(^o^)／","(๑>ᴗ<๑)","ヽ(´▽｀)/","(*^▽^*)","♪(´▽｀)","o(≧∀≦)o"
    ]},
    {id:"thanks", en:"THANK YOU", t:"想好好說謝謝", s:"感謝・溫柔", items:[
      "(*´꒳｀*)","(ღ˘⌣˘ღ)","(´｡• ᵕ •｡｀)","(o´∀｀o)","♡( ◡‿◡ )","(*ᴗ͈ˬᴗ͈)","( ´ ▽ ` )ﾉ","(⁄ ⁄•⁄ω⁄•⁄ ⁄)"
    ]},
    {id:"angry", en:"ANNOYED", t:"生氣但還是要可愛", s:"傲嬌・不爽", items:[
      "(｀^´)","(・`ω´・)","(¬､¬)","(＃`д´)","(｀ε´)","(╬ Ò﹏Ó)","ヽ(`Д´)ﾉ","(╯°□°）╯︵ ┻━┻"
    ]},
    {id:"shy", en:"BLUSH", t:"有點害羞的時候", s:"心動・臉紅", items:[
      "(⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄)","(*/ω＼*)","(〃▽〃)","(♡ω♡ )","(*ﾉ▽ﾉ)","(´,,•ω•,,)♡","(///▽///)","(⁄ ⁄◕⁄ω⁄◕⁄ ⁄)"
    ]},
    {id:"cry", en:"TEARS", t:"想哭一下下", s:"委屈・難過", items:[
      "(ಥ﹏ಥ)","(｡•́︿•̀｡)","(´；ω；｀)","(╥﹏╥)","(っ˘̩╭╮˘̩)っ","ﾟ(つд｀)ﾟ","(个_个)","(TдT)"
    ]},
    {id:"speechless", en:"SPEECHLESS", t:"我沒有話說了", s:"傻眼・無語", items:[
      "¯\\_(ツ)_/¯","(¬_¬)","( ˙-˙ )","(・_・)","( ಠ ʖ̯ ಠ)","(-_-;)","(￣▽￣)\"","(・∀・)"
    ]},
    {id:"sleep", en:"GOOD NIGHT", t:"早安・晚安・想睡", s:"睡覺・問候", items:[
      "(´-ω-｀)zZ","(∪｡∪)｡｡｡zzz","( ˘ω˘ )ｽﾔｧ","(=˘ω˘=)","(-, - )~zZ","☆.｡.:*(*´꒳｀*)","(u_u)","(o´ω｀o)ﾉ"
    ]},
    {id:"eat", en:"CAFE", t:"吃東西喝咖啡", s:"美食・下午茶", items:[
      "(っ˘ڡ˘ς)","( ˘ ³˘)☕","（｀・ω・´）旦","( ￣▽￣)旦~~","٩(๑´3｀๑)۶","(*´ч｀*)","☕(๑´ڡ｀๑)","(๑´ㅂ｀๑)"
    ]},
    {id:"go", en:"CHEER UP", t:"幫你加油", s:"打氣・衝刺", items:[
      "(๑•̀ㅂ•́)و✧","٩( 'ω' )و","(ง •̀_•́)ง","o(*￣▽￣*)ブ","(ﾉ>ω<)ﾉ","＼(๑❛ᴗ❛๑)⁄","(*•̀ᴗ•́*)و","ᕦ(ò_óˇ)ᕤ"
    ]},
    {id:"animal", en:"CREATURES", t:"各種動物", s:"貓、狗、熊、鳥、魚、企鵝⋯⋯用括號和符號畫出來的小動物。", wide:1, items:[
      "(=^･ω･^=)","(=^･ｪ･^=)","ฅ(^•ω•^ฅ)","ฅ^•ﻌ•^ฅ","/ᐠ｡ꞈ｡ᐟ\\","≽^•⩊•^≼","(=①ω①=)","(=`ω´=)",
      "ʕ•ᴥ•ʔ","ʕ ᵔᴥᵔ ʔ","ʕ·ᴥ·ʔ","ʕ￫ᴥ￩ʔ","ʕ；•`ᴥ•´ʔ","ʕ•ᴥ•ʔﾉ♡","U^ェ^U","▽･ω･▽",
      "ᐡ ᐧ ﻌ ᐧ ᐡ","૮ ˶ᵔ ᵕ ᵔ˶ ა","(・θ・)","(･ө･)","ᕕ( ᐛ )ᕗ","(๑･ө･๑)","＜(￣︶￣)＞","(・_・)ゞ",
      ">°))))彡","ϵ( 'Θ' )϶","><(((*>","≧🐟≦","(°ㅅ°)","ˏ₍•ɞ•₎ˎ","(｡･ω･｡)","(＾• ω •＾)",
      "( ˘ ³˘)","(・ω・)ﾉ","ʕ￫ᴥ￩ʔ♡","(=ﾟωﾟ)ﾉ","(ↀᴥↀ)","(ΦωΦ)","(ф ω ф)","(=✧ω✧=)"
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
    const done=()=>{
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
  const secs=[{id:"sec-gen",t:"排版產生器"}];
  const mk=(id,en,t,note)=>{
    const s=document.createElement("section"); s.id=id;
    s.innerHTML=`<div class="sec-en">${en}</div><h2>${t}</h2><p class="sec-note">${note}</p>`;
    body.appendChild(s); secs.push({id,t}); return s;
  };

  /* 兔兔合成器 */
  const mixSec=mk("sec-mix","BIG KAOMOJI","大型顏文字產生器・兔兔拿東西",
    "大型顏文字就是這種要用好幾行才畫得完的顏文字。先選手上要拿什麼，下面十八隻兔兔會自己換好，點一下直接複製，不用再按第二次。");
  const emoWrap=document.createElement("div");
  emoWrap.innerHTML=`<span class="lbl" style="margin-top:24px">手上的東西</span><div class="emo-grid" id="k-emo"></div>`;
  mixSec.appendChild(emoWrap);
  const poseWrap=document.createElement("div");
  poseWrap.className="pose-grid"; poseWrap.id="k-pose";
  mixSec.appendChild(poseWrap);

  function drawMix(){
    $("#k-emo").querySelectorAll("button").forEach((b,i)=>b.setAttribute("aria-pressed",i===emo));
    $("#k-pose").querySelectorAll(".pose").forEach((b,i)=>{
      b.querySelector("pre").textContent=POSES[i].f(EMOS[emo]);
    });
  }
  EMOS.forEach((e,i)=>{
    const b=document.createElement("button");
    b.className="emo"; b.textContent=e; b.title="換成 "+e;
    b.onclick=()=>{emo=i;drawMix();};
    $("#k-emo").appendChild(b);
  });
  POSES.forEach((p,i)=>{
    const b=document.createElement("button");
    b.className="pose"; b.title="點一下複製";
    b.innerHTML=`<pre></pre><span class="nm"></span>`;
    b.querySelector(".nm").textContent=p.n;
    b.onclick=()=>copy(POSES[i].f(EMOS[emo]),p.n,"大型顏文字-兔兔拿東西");
    poseWrap.appendChild(b);
  });
  drawMix();

  /* 兔兔圖鑑：不拿東西、單純可愛的兔子 */
  const BUNNIES=[
    " ꒰\\_/꒱\n ꒰•ᵕ•꒱"," ꒰\\⑅/꒱ ✧\n ꒰◔ᵕ◔꒱"," ꒰\\_/꒱\n ꒰•᷄ࡇ•᷅꒱"," /꒱/꒱\n｡･×･꒱ ♡",
    " /꒱/꒱\n꒰-`д´-꒱"," /) /)\n(-`д´-)"," /) /) ♡\n*( ･×･)"," /) /)\n(>д<)",
    " /) /)\n(ฅ• . •ฅ)"," (\\_(\\\n(=･ω･)"," (\\＿(\\*゜\n (ÒㅅÓ)"," /) ＿ /)\n(ฅ・×･)ฅ",
    " (\\♚/)\n (ฅ×ฅ)"," (\\ ♚ /)\n(◍ ′⅄‵ ◍)"," (\\_(\\\n(; ›ω‹)"," (\\_(\\\n (•- •)",
    " /)/)\n( . .)"," /)/) (\\(\\\n( . .)(. . )"," (\\(\\\n( -.-)"," (\\_/)\n( •_•)",
    " {\\__/}\n ( • ᴗ•)"," (\\__ /)\n(⁎˃ᴗ˂⁎)◞♡","*(\\_/)｡ﾟ{\\_/}*⋈\n( •×•)♡(•×• )"," ꒰\\_/꒱\n꒰ ˶• ᴗ •˶ ꒱"
  ];
  const bunSec=mk("sec-bunny","BUNNY","大型兔兔顏文字圖鑑",
    "不拿東西、單純可愛的兔子。兩行的大型顏文字，用括號和斜線畫出來，貼在句子後面或當作段落開頭都很好看。點一下直接複製。");
  const bunGrid=document.createElement("div");
  bunGrid.className="pose-grid";
  BUNNIES.forEach(b=>{
    const btn=document.createElement("button");
    btn.className="pose"; btn.title="點一下複製";
    btn.style.minHeight="96px";
    btn.innerHTML=`<pre></pre>`;
    btn.querySelector("pre").textContent=b;
    btn.onclick=()=>copy(b,b.replace(/\s+/g," ").trim(),"大型顏文字-兔兔圖鑑");
    bunGrid.appendChild(btn);
  });
  bunSec.appendChild(bunGrid);

  /* 表情組合器：眼睛 × 嘴巴 */
  const EYES=[
    ["ˊ","ˋ"],["ˇ","ˇ"],["⏑","⏑"],["´","｀"],
    ["◞","◟"],["◜","◝"],["◝","◜"],["-᷅","-᷄"],
    [".ܸ",".ܸ"],["◡","◡"],["_","_"],[".","."],
    ["•","•"],["•̀","•́"],["•́","•̀"],["߹","߹"],
    ["›","‹"],["^","^"],["⊳","⊲"],["՞","՞"],
    ["o̴̶̷᷄","o̴̶̷̥᷅"],["ᵒ̴̶̷̥́","ᵒ̴̶̷̣̥̀"],["o̴̶̷̤","o̴̶̷̤"],["ಠ","ಠ"],
    ["≧","≦"],["ꈍ","ꈍ"],["˃̶̤́","˂̶̤̀"],["ᴗ͈","ᴗ͈"],
    ["≻","≺"],["➤","◄"],["˃","˂"],["˃̵","˂̵"],
    ["=˃","˂="],["ˋ◔","◔ˊ"],["◕","◕"],["ㅇ","ㅇ"]
  ];
  const MOUTHS=["ᵕ","⤙","ᴖ","Ⱉ","△","࿁","ꕀ","‸",
                "༝","‿","⌓","⩊","⌑","｡","ㅁ","⇀",
                "̫","֊","᎔","ᗜ","Д","³","ᯅ","ˬ",
                "▬","∩","ʌ","ᴥ","ω","ᗢ","▭","ᨓ"];
  let eye=12;
  const face=(i,m)=>"("+EYES[i][0]+m+EYES[i][1]+")";

  const faceSec=mk("sec-face","MIX A FACE","表情組合器",
    "單行的顏文字產生器。上面選一組眼睛，下面所有嘴巴會自動配好，點臉直接複製。三十六組眼睛乘以三十二張嘴，可以組出一千一百多種表情。想要多行的大型顏文字，往下看兔兔那兩區。");
  const fWrap=document.createElement("div");
  fWrap.innerHTML=`<span class="lbl" style="margin-top:24px">眼睛</span><div class="eye-grid" id="k-eye"></div>
                   <span class="lbl" style="margin-top:26px">配上嘴巴　點一下複製</span><div class="grid" id="k-face"></div>`;
  faceSec.appendChild(fWrap);

  function drawFace(){
    $("#k-eye").querySelectorAll("button").forEach((b,i)=>b.setAttribute("aria-pressed",i===eye));
    $("#k-face").querySelectorAll("button").forEach((b,i)=>{
      const t=face(eye,MOUTHS[i]);
      b.textContent=t; b.onclick=()=>copy(t,t,"表情組合器");
    });
  }
  EYES.forEach((e,i)=>{
    const b=document.createElement("button");
    b.className="eye"; b.textContent=e[0]+"　"+e[1]; b.title="用這組眼睛";
    b.onclick=()=>{eye=i;drawFace();};
    $("#k-eye").appendChild(b);
  });
  MOUTHS.forEach(()=>{
    const b=document.createElement("button");
    b.className="cell"; b.title="點一下複製";
    $("#k-face").appendChild(b);
  });
  drawFace();

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
  const blankSec=mk("sec-blank","INVISIBLE","看不見的空白格",
    "Instagram、Facebook、Threads 都會把貼文開頭和連續的空行自動刪掉，直接按 Enter 排的段落貼上去就會擠成一團。解法是插入一個「看起來是空白、但系統不認為是空白」的字元。三個平台都適用，Dcard 和 LINE 通常不需要，但想把排版做得更精準時一樣能用。");
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
    <li>X 和 Dcard 對換行比較寬容，通常直接按 Enter 就可以。</li></ul>`;
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
    f.innerHTML=`<div class="field" style="margin-top:24px;max-width:340px"><input type="text" id="k-fin" value="hiyori" maxlength="30" placeholder="輸入英文或數字"></div><div id="k-fout"></div>`;
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
    const v=$("#k-fin").value||"hiyori";
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
  const genSec=document.getElementById("sec-gen"), afterSec=document.getElementById("sec-face"), blankSec2=document.getElementById("sec-blank");
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
  const PAGE="EN";            // 子頁代號，GA 的區塊名稱會加上這個前綴；主頁留空以延續既有數據
  const FONT_AT="read";     // 特殊字型區塊插在哪個分類之前；空字串＝放在最後
  const FONT_T="Fancy fonts for your Instagram name";
  const FONT_N="These are Unicode maths alphanumerics, which only cover A to Z and 0 to 9, so Japanese, Chinese, Korean and accented letters pass through unchanged. They work in your Instagram name field, not your username, and search may not match them.";
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
    {n:"Stardust", f:(a,b,c)=>`‧₊˚ ${a} ˚₊‧\n✧ ${b}\n${c} ⋆`},
    {n:"Divider", f:(a,b,c)=>`${a}\n୨୧┈┈┈┈┈୨୧\n${b}\n${c}`},
    {n:"Hearts", f:(a,b,c)=>`♡ ${a}\n⸝⸝ ${b} ⸝⸝\n${c} ♡`},
    {n:"Minimal", f:(a,b,c)=>`${a}\n· ${b} ·\n${c}`},
    {n:"Botanical", f:(a,b,c)=>`ꕥ ${a} ꕥ\n${b}\n✿ ${c}`},
    {n:"Cafe", f:(a,b,c)=>`${a}\n☕ ${b}\n୨୧⌒⌒⌒⌒୨୧\n${c}`},
    {n:"Dangle", f:(a,b,c)=>`${a}\n　⌇\n${b}\n　⌇\n${c}`},
    {n:"Music", f:(a,b,c)=>`♪ ${a}\n${b}\n${c} ♫`}
  ];
  let tpl=0, fnt=1;

  /* ---------- 兔兔圖 ----------
     台日韓網路社群流傳的兔子顏文字，{E} 為手上物品的插入點       */
  const POSES=[
    {n:"Classic",   f:e=>` (\\_/)\n( •_•)\n/> ${e} >`},
    {n:"Long ears", f:e=>`  {\\__/}\n  ( • - •)\nc /> ${e} <\\`},
    {n:"Here, take it", f:e=>`  {\\__/}\n  ( • - •)\nc /> ${e} >`},
    {n:"Starry eyes", f:e=>`  {\\__/}\n (⌯¤̴̶̷̀ω¤̴̶̷́)\nc />　　> ${e}`},
    {n:"Little angel", f:e=>`  {\\_/}\n  (*ˊᵕˋ)\n*ଘ/ ੭${e}੭*✩‧₊˚`},
    {n:"Kiss", f:e=>` (\\_(\\\n (๑´³\`) ෆ\n /> ${e} >`},
    {n:"So happy", f:e=>` (\\__ /)\n (⁎˃ᴗ˂⁎)◞♡\n />  ${e} <\\`},
    {n:"Wanna play", f:e=>` {\\___/}\n (๑❛ᴗ❛๑)\nc / >${e}>`},
    {n:"Panic", f:e=>`  {\\__/}\n꜆꜄꜆( ´O\`)꜆꜄꜆\n  < ${e} <\\ ɔ`},
    {n:"Startled", f:e=>` {\\__/}\nΣ(ʘ△ʘ)|||\n  <${e}<\\ ɔ`},
    {n:"Shocked", f:e=>` (\\___/)\n (◔ д◔)\nc /> ${e} >`},
    {n:"Grumpy", f:e=>` /) /)\n(-\`д´-)\n /> ${e} >`},
    {n:"Paws", f:e=>`  /) /)\n(ฅ• . •ฅ)\n /> ${e} >`},
    {n:"Shy", f:e=>` (\\_(\\\n (; ›ω‹)\n /> ${e} >`},
    {n:"Crowned", f:e=>` (\\ ♚ /)\n (ฅ×ฅ)\n /> ${e} >`},
    {n:"Round face", f:e=>` ꒰\\_/꒱\n ꒰•ᵕ•꒱\n /> ${e} >`},
    {n:"Squinting", f:e=>` ꒰\\⑅/꒱ ✧\n ꒰◔ᵕ◔꒱\n /> ${e} >`},
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
    {id:"border", en:"DIVIDERS", t:"Text dividers & borders", s:"Frame a line or split two paragraphs. This is the hungriest section. A full divider runs about 13 characters, so check your budget first.", wide:1, items:[
      "୨୧┈┈┈┈┈┈┈┈┈୨୧","୨୧⌒⌒⌒⌒⌒⌒⌒⌒୨୧","ꔫ･–･ꔫ･–･ꔫ･–･ꔫ","･･⋈･-･･–･⋈･-･･–･⋈･･",
      "∴∵∴ ୨୧ ∴∵∴ ୨୧ ∴∵∴","꙳✧˖°⌖꙳✧˖°⌖꙳✧˖°⌖꙳","╭┈┈┈┈┈┈┈┈┈╮","╰┈┈┈┈┈┈┈┈┈╯",
      "✿ ⋆ ✿ ⋆ ✿ ⋆ ✿","♡ ⋆｡˚ ♡ ⋆｡˚ ♡","‧₊˚ ✧ ˚₊‧ ✧ ‧₊˚","─── ⋆⋅☆⋅⋆ ───",
      "꒰ ꒱ ꒰ ꒱ ꒰ ꒱","˚ · . ˚ · . ˚ · .","▸▸▸▸▸▸▸▸▸","━━━━━━━━━",
      "⋆ ˚｡⋆୨୧˚ ⋆ ˚｡⋆","·˚ ༘ ⋆｡˚ ⋆｡˚ ༘ ·","♪♫*•♪♪♫*•♪♫*•♪","˚₊‧ ✩ ‧₊˚ ✩ ‧₊˚"
    ]},
    {id:"story", en:"STORY", t:"Instagram story decorations", s:"Scatter above or below story text, in a photo corner, or at the top of a caption. Paste the whole string.", wide:1, items:[
      "✩ ♬ ₊.🎧⋆☾⋆⁺₊✧ *ੈ✩‧₊˚","✩ ♬ ₊.⋆☾⋆⁺₊✧ *ੈ✩‧₊˚","₊·.°.⋆🫧•˚₊‧⋆.","⋆｡☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆",
      "⋆.˚✮🎧✮˚.⋆","₊·.°.⋆✮⋆.°.‧₊","๋࣭ ⭑⚝๋࣭ ⭑⚝","⫘⫘⫘⫘⫘⫘"
    ], risky:[
      "⋆.𐙚 ̊. ⋆˚𝜗𝜚˚⋆ 𝜗ৎ ^ྀི","୨ৎ ⋆𐙚 ̊. ⋆⑅°₊ ⋆౨ৎ°⟡˖ ࣪",".˚₊⊹♡ ♫ ⋅˚₊‧ 𐙚 ‧₊˚ ⋅","⋅°₊ • ୨୧ ‧₊° ⋅  𓆝 𓆟 𓆞 𓆝 𓆟",
      "𓆉𓆝 𓆟 𓆞 𓆝 𓆟𓇼","⊹ ࣪ ﹏𓊝﹏𓂁﹏⊹ ࣪ ˖","🫧𓇼𓏲*ੈ✩·🐚ᝰ.ᐟ","✮ ⋆ ˚｡𖦹 ⋆｡°✩",
      "ִׄ˚ • 𖥔 ࣪˖ ⭑ ₊ ⭒ *ೃ༄"
    ]},
    {id:"star", en:"STARS", t:"Star symbols & sparkles", s:"One or two characters at the end of a line does most of the work.", items:[
      "★","☆","✦","✧","⋆","✩","✪","✫",
      "✬","✭","✮","✯","✰","⍟","࿐","˚₊·",
      "⁺˖","⊹","✵","✶","✷","✸","❋","✺",
      "｡･:*:･ﾟ★","˚ ✦","⋆｡°✩","· ˚ ✧","༄˖°","꙳","☄","⭑"
    ]},
    {id:"deco", en:"ORNAMENTS", t:"Heart symbols & flowers", s:"Cheapest decoration there is. One character, whole different mood.", items:[
      "♡","♥","❤︎","ღ","꒰ ♡ ꒱","⸝⸝ ♡ ⸝⸝","♡̶","♡⃛",
      "ෆ","❥","♡*｡","˗ˏˋ ♡ ˎˊ˗","✿","❀","ꕥ","❁",
      "✾","♧","☘","༄","☾","☁︎","៚","⌇",
      "ᐝ","ᰔ","𖤣","⑅","◞♡","♡‧₊˚","⋆⑅˚₊","꒰♡꒱"
    ]},
    {id:"bracket", en:"BRACKETS", t:"Brackets & frames", s:"Wrap a heading or a category name.", items:[
      "꒰ ꒱","「 」","『 』","【 】","〔 〕","〖 〗","《 》","〈 〉",
      "≡ ≡","༺ ༻","꧁ ꧂","⟢ ⟣","⌜ ⌝","⌞ ⌟","▛ ▟","┌ ┐"
    ]},
    {id:"music", en:"MUSIC", t:"Music note symbols", s:"For playlists, lyrics and now-playing posts. The first rows render everywhere. The last eight are the trendy ones. They borrow from rare Unicode blocks, so iPhones handle them but some Android devices will show boxes. Check before you post.", items:[
      "♪","♫","♬","♩","♭","♮","♯","🎵",
      "🎶","🎼","🎧","🎤","🎸","🎹","🥁","🎺",
      "♪♫","♫♪","♪⋆","✧♬","˚♪ ₊","♫*•","♪~","･ﾟ♪",
      "୨♪୧","⌒♪⌒","♪♪♪","˖♬°","♩‧₊˚","₊˚♪","♬⋆｡˚","˚♫₊·",
      "ᕷ˖°♪.¸","¸♬•*✩","¨*•.♫","⸝♬ ͟͟͞͞➳❥⁎",
      "♪ .⩇⩇:⩇⩇","ıllıılıılı ♫♪ ༘⋆","˖ ࣪⊹♫⸝⸝꙳","🎧𖥦 ♪ ༘",
      "♪ 𓂃 𓈒𓏸","♪⨾ 𓂃 ࣪⋆","၊၊||၊ ♪⊹","♪⨾ ᡣ𐭩"
    ]},
    {id:"number", en:"NUMBERS", t:"Circled numbers", s:"For lists, steps and rules: circled, filled, bracketed, Roman numerals and more.", items:[
      "①","②","③","④","⑤","⑥","⑦","⑧","⑨","⑩",
      "⓵","⓶","⓷","⓸","⓹","⓺","⓻","⓼","⓽","⓾",
      "❶","❷","❸","❹","❺","❻","❼","❽","❾","❿",
      "⑴","⑵","⑶","⑷","⑸","⑹","⑺","⑻","⑼","⑽",
      "⒈","⒉","⒊","⒋","⒌","⒍","⒎","⒏","⒐","⒑",
      "🄁","🄂","🄃","🄄","🄅","🄆","🄇","🄈","🄉","🄊",
      "Ⅰ","Ⅱ","Ⅲ","Ⅳ","Ⅴ","Ⅵ","Ⅶ","Ⅷ","Ⅸ","Ⅹ",
      "㊀","㊁","㊂","㊃","㊄","㊅","㊆","㊇","㊈","㊉"
    ]},
    {id:"dot", en:"DOTS & LINES", t:"Dots, lines & shapes", s:"For lists, timelines, opening hours.", items:[
      "·","•","◦","‧","⋅","∙","◌","○",
      "▪︎","▫︎","◆","◇","▸","▹","➤","→",
      "︙","⋮","│","┊","┆","╎","⌁","〰"
    ]},
    {id:"read", en:"AWKWARD", t:"Left on read", s:"Awkward, waiting, no reply", items:[
      "(´・ω・｀)","(・_・;)","( ˘•ω•˘ )","(；´д｀)","(．．;)","(´-ω-｀)","( ˇωˇ )","(・∀・;)"
    ]},
    {id:"ask", en:"PLEASE", t:"Asking a favour", s:"Please, pretty please", items:[
      "(＞人＜;)","(っ˘ω˘ς )","(人◕‿◕)","(´･ω･｀)ﾉ","(つ✧ω✧)つ","(๑•̀ㅂ•́)ﾉ","(人´∀｀)","( ˘ ³˘)♡"
    ]},
    {id:"sorry", en:"SORRY", t:"Apologising", s:"Sorry, bowing, my fault", items:[
      "m(_ _)m","<(_ _)>","(*_ _)人","(⌒_⌒;)","(´；ω；｀)","(・_・;)ゞ","ｍ(￣ ￣)ｍ","(＿ ＿*)"
    ]},
    {id:"tired", en:"EXHAUSTED", t:"Completely done", s:"Drained, blank, over it", items:[
      "(´-ω-｀)","( ˘_˘ )","_(:3」∠)_","(=____=)","(＿ ＿)zzz","( ×ω× )","(￣ω￣;)","o(_ _)o"
    ]},
    {id:"happy", en:"JOY", t:"Too happy to sit still", s:"Excited, celebrating", items:[
      "(≧▽≦)","٩(◕‿◕)۶","＼(^o^)／","(๑>ᴗ<๑)","ヽ(´▽｀)/","(*^▽^*)","♪(´▽｀)","o(≧∀≦)o"
    ]},
    {id:"thanks", en:"THANK YOU", t:"Meaning the thank you", s:"Grateful, soft", items:[
      "(*´꒳｀*)","(ღ˘⌣˘ღ)","(´｡• ᵕ •｡｀)","(o´∀｀o)","♡( ◡‿◡ )","(*ᴗ͈ˬᴗ͈)","( ´ ▽ ` )ﾉ","(⁄ ⁄•⁄ω⁄•⁄ ⁄)"
    ]},
    {id:"angry", en:"ANNOYED", t:"Angry but still cute", s:"Grumpy, sulking, tsundere", items:[
      "(｀^´)","(・`ω´・)","(¬､¬)","(＃`д´)","(｀ε´)","(╬ Ò﹏Ó)","ヽ(`Д´)ﾉ","(╯°□°）╯︵ ┻━┻"
    ]},
    {id:"shy", en:"BLUSH", t:"A little flustered", s:"Blushing, shy, caught out", items:[
      "(⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄)","(*/ω＼*)","(〃▽〃)","(♡ω♡ )","(*ﾉ▽ﾉ)","(´,,•ω•,,)♡","(///▽///)","(⁄ ⁄◕⁄ω⁄◕⁄ ⁄)"
    ]},
    {id:"cry", en:"TEARS", t:"Need a small cry", s:"Sad, hurt, sniffling", items:[
      "(ಥ﹏ಥ)","(｡•́︿•̀｡)","(´；ω；｀)","(╥﹏╥)","(っ˘̩╭╮˘̩)っ","ﾟ(つд｀)ﾟ","(个_个)","(TдT)"
    ]},
    {id:"speechless", en:"SPEECHLESS", t:"No words", s:"Deadpan, done, speechless", items:[
      "¯\\_(ツ)_/¯","(¬_¬)","( ˙-˙ )","(・_・)","( ಠ ʖ̯ ಠ)","(-_-;)","(￣▽￣)\"","(・∀・)"
    ]},
    {id:"sleep", en:"GOOD NIGHT", t:"Sleepy, morning, goodnight", s:"Dozing, greetings", items:[
      "(´-ω-｀)zZ","(∪｡∪)｡｡｡zzz","( ˘ω˘ )ｽﾔｧ","(=˘ω˘=)","(-, - )~zZ","☆.｡.:*(*´꒳｀*)","(u_u)","(o´ω｀o)ﾉ"
    ]},
    {id:"eat", en:"CAFE", t:"Coffee & snacks", s:"Eating, drinking, afternoon tea", items:[
      "(っ˘ڡ˘ς)","( ˘ ³˘)☕","（｀・ω・´）旦","( ￣▽￣)旦~~","٩(๑´3｀๑)۶","(*´ч｀*)","☕(๑´ڡ｀๑)","(๑´ㅂ｀๑)"
    ]},
    {id:"go", en:"CHEER UP", t:"Cheering you on", s:"Go, fight, you can do it", items:[
      "(๑•̀ㅂ•́)و✧","٩( 'ω' )و","(ง •̀_•́)ง","o(*￣▽￣*)ブ","(ﾉ>ω<)ﾉ","＼(๑❛ᴗ❛๑)⁄","(*•̀ᴗ•́*)و","ᕦ(ò_óˇ)ᕤ"
    ]},
    {id:"animal", en:"CREATURES", t:"Animal kaomoji", s:"Cats, dogs, bears, birds, fish, penguins. Drawn from brackets and punctuation.", wide:1, items:[
      "(=^･ω･^=)","(=^･ｪ･^=)","ฅ(^•ω•^ฅ)","ฅ^•ﻌ•^ฅ","/ᐠ｡ꞈ｡ᐟ\\","≽^•⩊•^≼","(=①ω①=)","(=`ω´=)",
      "ʕ•ᴥ•ʔ","ʕ ᵔᴥᵔ ʔ","ʕ·ᴥ·ʔ","ʕ￫ᴥ￩ʔ","ʕ；•`ᴥ•´ʔ","ʕ•ᴥ•ʔﾉ♡","U^ェ^U","▽･ω･▽",
      "ᐡ ᐧ ﻌ ᐧ ᐡ","૮ ˶ᵔ ᵕ ᵔ˶ ა","(・θ・)","(･ө･)","ᕕ( ᐛ )ᕗ","(๑･ө･๑)","＜(￣︶￣)＞","(・_・)ゞ",
      ">°))))彡","ϵ( 'Θ' )϶","><(((*>","≧🐟≦","(°ㅅ°)","ˏ₍•ɞ•₎ˎ","(｡･ω･｡)","(＾• ω •＾)",
      "( ˘ ³˘)","(・ω・)ﾉ","ʕ￫ᴥ￩ʔ♡","(=ﾟωﾟ)ﾉ","(ↀᴥↀ)","(ΦωΦ)","(ф ω ф)","(=✧ω✧=)"
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
    const done=()=>{
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
      note.textContent="No tight limit here. Decorate freely. Line breaks still count as characters.";
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
  const secs=[{id:"sec-gen",t:"Instagram bio layout & character counter"}];
  const mk=(id,en,t,note)=>{
    const s=document.createElement("section"); s.id=id;
    s.innerHTML=`<div class="sec-en">${en}</div><h2>${t}</h2><p class="sec-note">${note}</p>`;
    body.appendChild(s); secs.push({id,t}); return s;
  };

  /* 兔兔合成器 */
  const mixSec=mk("sec-mix","BUNNY TEXT ART","Bunny text art. Pick what it holds",
    "The copy-and-paste bunny holding a heart, a coffee or a gift. Pick the item once and all 18 bunnies swap it in. Tap a bunny to copy; there is no second button.");
  const emoWrap=document.createElement("div");
  emoWrap.innerHTML=`<span class="lbl" style="margin-top:24px">What it holds</span><div class="emo-grid" id="k-emo"></div>`;
  mixSec.appendChild(emoWrap);
  const poseWrap=document.createElement("div");
  poseWrap.className="pose-grid"; poseWrap.id="k-pose";
  mixSec.appendChild(poseWrap);

  function drawMix(){
    $("#k-emo").querySelectorAll("button").forEach((b,i)=>b.setAttribute("aria-pressed",i===emo));
    $("#k-pose").querySelectorAll(".pose").forEach((b,i)=>{
      b.querySelector("pre").textContent=POSES[i].f(EMOS[emo]);
    });
  }
  EMOS.forEach((e,i)=>{
    const b=document.createElement("button");
    b.className="emo"; b.textContent=e; b.title="Hold a "+e;
    b.onclick=()=>{emo=i;drawMix();};
    $("#k-emo").appendChild(b);
  });
  POSES.forEach((p,i)=>{
    const b=document.createElement("button");
    b.className="pose"; b.title="Tap to copy";
    b.innerHTML=`<pre></pre><span class="nm"></span>`;
    b.querySelector(".nm").textContent=p.n;
    b.onclick=()=>copy(POSES[i].f(EMOS[emo]),p.n,"Bunny text art");
    poseWrap.appendChild(b);
  });
  drawMix();

  /* 兔兔圖鑑：不拿東西、單純可愛的兔子 */
  const BUNNIES=[
    " ꒰\\_/꒱\n ꒰•ᵕ•꒱"," ꒰\\⑅/꒱ ✧\n ꒰◔ᵕ◔꒱"," ꒰\\_/꒱\n ꒰•᷄ࡇ•᷅꒱"," /꒱/꒱\n｡･×･꒱ ♡",
    " /꒱/꒱\n꒰-`д´-꒱"," /) /)\n(-`д´-)"," /) /) ♡\n*( ･×･)"," /) /)\n(>д<)",
    " /) /)\n(ฅ• . •ฅ)"," (\\_(\\\n(=･ω･)"," (\\＿(\\*゜\n (ÒㅅÓ)"," /) ＿ /)\n(ฅ・×･)ฅ",
    " (\\♚/)\n (ฅ×ฅ)"," (\\ ♚ /)\n(◍ ′⅄‵ ◍)"," (\\_(\\\n(; ›ω‹)"," (\\_(\\\n (•- •)",
    " /)/)\n( . .)"," /)/) (\\(\\\n( . .)(. . )"," (\\(\\\n( -.-)"," (\\_/)\n( •_•)",
    " {\\__/}\n ( • ᴗ•)"," (\\__ /)\n(⁎˃ᴗ˂⁎)◞♡","*(\\_/)｡ﾟ{\\_/}*⋈\n( •×•)♡(•×• )"," ꒰\\_/꒱\n꒰ ˶• ᴗ •˶ ꒱"
  ];
  const bunSec=mk("sec-bunny","BUNNY","Plain bunny kaomoji",
    "Two-line bunnies with empty paws, drawn from brackets and slashes. Good at the end of a sentence or the top of a paragraph. Tap to copy.");
  const bunGrid=document.createElement("div");
  bunGrid.className="pose-grid";
  BUNNIES.forEach(b=>{
    const btn=document.createElement("button");
    btn.className="pose"; btn.title="Tap to copy";
    btn.style.minHeight="96px";
    btn.innerHTML=`<pre></pre>`;
    btn.querySelector("pre").textContent=b;
    btn.onclick=()=>copy(b,b.replace(/\s+/g," ").trim(),"Plain bunnies");
    bunGrid.appendChild(btn);
  });
  bunSec.appendChild(bunGrid);

  /* 表情組合器：眼睛 × 嘴巴 */
  const EYES=[
    ["ˊ","ˋ"],["ˇ","ˇ"],["⏑","⏑"],["´","｀"],
    ["◞","◟"],["◜","◝"],["◝","◜"],["-᷅","-᷄"],
    [".ܸ",".ܸ"],["◡","◡"],["_","_"],[".","."],
    ["•","•"],["•̀","•́"],["•́","•̀"],["߹","߹"],
    ["›","‹"],["^","^"],["⊳","⊲"],["՞","՞"],
    ["o̴̶̷᷄","o̴̶̷̥᷅"],["ᵒ̴̶̷̥́","ᵒ̴̶̷̣̥̀"],["o̴̶̷̤","o̴̶̷̤"],["ಠ","ಠ"],
    ["≧","≦"],["ꈍ","ꈍ"],["˃̶̤́","˂̶̤̀"],["ᴗ͈","ᴗ͈"],
    ["≻","≺"],["➤","◄"],["˃","˂"],["˃̵","˂̵"],
    ["=˃","˂="],["ˋ◔","◔ˊ"],["◕","◕"],["ㅇ","ㅇ"]
  ];
  const MOUTHS=["ᵕ","⤙","ᴖ","Ⱉ","△","࿁","ꕀ","‸",
                "༝","‿","⌓","⩊","⌑","｡","ㅁ","⇀",
                "̫","֊","᎔","ᗜ","Д","³","ᯅ","ˬ",
                "▬","∩","ʌ","ᴥ","ω","ᗢ","▭","ᨓ"];
  let eye=12;
  const face=(i,m)=>"("+EYES[i][0]+m+EYES[i][1]+")";

  const faceSec=mk("sec-face","MIX A FACE","Kaomoji face mixer",
    "Western emoticons carry the feeling in the mouth: :) becomes :( . Kaomoji carry it in the eyes: (^_^) becomes (;_;). That is why a kaomoji comes apart into swappable pieces. Pick a pair of eyes and all 32 mouths reshuffle underneath. 36 × 32 = 1,152 faces. Tap one to copy.");
  const fWrap=document.createElement("div");
  fWrap.innerHTML=`<span class="lbl" style="margin-top:24px">Eyes</span><div class="eye-grid" id="k-eye"></div>
                   <span class="lbl" style="margin-top:26px">With every mouth　tap to copy</span><div class="grid" id="k-face"></div>`;
  faceSec.appendChild(fWrap);

  function drawFace(){
    $("#k-eye").querySelectorAll("button").forEach((b,i)=>b.setAttribute("aria-pressed",i===eye));
    $("#k-face").querySelectorAll("button").forEach((b,i)=>{
      const t=face(eye,MOUTHS[i]);
      b.textContent=t; b.onclick=()=>copy(t,t,"Face mixer");
    });
  }
  EYES.forEach((e,i)=>{
    const b=document.createElement("button");
    b.className="eye"; b.textContent=e[0]+"　"+e[1]; b.title="Use these eyes";
    b.onclick=()=>{eye=i;drawFace();};
    $("#k-eye").appendChild(b);
  });
  MOUTHS.forEach(()=>{
    const b=document.createElement("button");
    b.className="cell"; b.title="Tap to copy";
    $("#k-face").appendChild(b);
  });
  drawFace();

  /* 隱形空白
     U+3164 韓文填充、U+2800 點字空方都不被判定為空白字元，
     所以能通過 Instagram 的空白修剪。全形空白 U+3000 會被吃掉。 */
  const FILL="\u3164", BR="\u2800";
  const BLANKS=[
    {l:"One blank", v:FILL,                          d:"An invisible character"},
    {l:"Indent",    v:FILL.repeat(4),                d:"Four spaces of nothing"},
    {l:"Line break",v:"\n"+FILL,                     d:"The one you want"},
    {l:"Paragraph", v:"\n"+FILL+"\n"+FILL,           d:"Between paragraphs"},
    {l:"Big gap",   v:"\n"+FILL+"\n"+FILL+"\n"+FILL, d:"To bury your hashtags"},
    {l:"Braille blank", v:BR,                        d:"Backup. Steadier in some apps"},
    {l:"Braille break", v:"\n"+BR,                   d:"When the filler gets stripped"},
    {l:"Zero width", v:"\u200B",                     d:"No width at all. Breaks long URLs"}
  ];
  const blankSec=mk("sec-blank","INVISIBLE","Invisible characters for Instagram line breaks",
    "Instagram, Facebook and Threads strip leading spaces and collapse empty lines, so paragraphs you typed with Enter arrive as one solid block. The fix is a character that looks blank but is not classified as whitespace. The Hangul Filler (U+3164) or the Braille Blank (U+2800). So the trimmer leaves it alone.");
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
    <li>Screen readers may announce them oddly or skip the line. Go easy if accessibility matters to you.</li>
    <li>If it still gets stripped, try “Braille break”. The two characters behave differently app to app.</li>
    <li>X and Discord are relaxed about line breaks; plain Enter is usually enough there.</li></ul>`;
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
    f.innerHTML=`<div class="field" style="margin-top:24px;max-width:340px"><input type="text" id="k-fin" value="hiyori" maxlength="30" placeholder="Type letters or digits"></div><div id="k-fout"></div>`;
    fs.appendChild(f);
  }
  let moodSec=null;
  DATA.forEach(d=>{
    if(FONT_AT && d.id===FONT_AT) addFont();

    /* 情境顏文字：十三類收進同一區，點開才展開，手機不用滑那麼長 */
    if(MOODS.includes(d.id)){
      if(!moodSec) moodSec=mk("sec-mood","MOODS","Kaomoji by mood","Left on read, apologising, exhausted, need a small cry. 13 moods. Tap one to open it.");
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
    const v=$("#k-fin").value||"hiyori";
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
  const genSec=document.getElementById("sec-gen"), afterSec=document.getElementById("sec-face");
  if(genSec&&afterSec){ afterSec.after(genSec); genSec.style.paddingTop=""; }
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
  const PAGE="JA";            // 子頁代號，GA 的區塊名稱會加上這個前綴；主頁留空以延續既有數據
  const FONT_AT="read";     // 特殊字型區塊插在哪個分類之前；空字串＝放在最後
  const FONT_T="英字の特殊フォント";
  const FONT_N="変わるのはアルファベットと数字だけで、日本語はそのままです。飾りの一言に使い、アカウント名はふつうの文字にしておくと、検索で見つけてもらいやすくなります。";
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
    {id:"border", en:"DIVIDERS", t:"区切り線・枠", link:{href:"/ja/ig-symbols/",text:"インスタ専用のまとめ：プロフィール整形・区切り線・ストーリーの飾り・名前のフォント"}, s:"インスタの投稿、ストーリー、プロフィールに使える区切り線と枠。文字数を一番使うので、先に残りの文字数を確認してね。", wide:1, items:[
      "୨୧┈┈┈┈┈┈┈┈┈୨୧","୨୧⌒⌒⌒⌒⌒⌒⌒⌒୨୧","ꔫ･–･ꔫ･–･ꔫ･–･ꔫ","･･⋈･-･･–･⋈･-･･–･⋈･･",
      "∴∵∴ ୨୧ ∴∵∴ ୨୧ ∴∵∴","꙳✧˖°⌖꙳✧˖°⌖꙳✧˖°⌖꙳","╭┈┈┈┈┈┈┈┈┈╮","╰┈┈┈┈┈┈┈┈┈╯",
      "✿ ⋆ ✿ ⋆ ✿ ⋆ ✿","♡ ⋆｡˚ ♡ ⋆｡˚ ♡","‧₊˚ ✧ ˚₊‧ ✧ ‧₊˚","─── ⋆⋅☆⋅⋆ ───",
      "꒰ ꒱ ꒰ ꒱ ꒰ ꒱","˚ · . ˚ · . ˚ · .","▸▸▸▸▸▸▸▸▸","━━━━━━━━━",
      "⋆ ˚｡⋆୨୧˚ ⋆ ˚｡⋆","·˚ ༘ ⋆｡˚ ⋆｡˚ ༘ ·","♪♫*•♪♪♫*•♪♫*•♪","˚₊‧ ✩ ‧₊˚ ✩ ‧₊˚"
    ]},
    {id:"story", en:"IG STORY", t:"ストーリーの飾り", s:"ストーリーの文字の上下や写真の角、投稿の書き出しに。まるごと貼るだけで雰囲気が出ます。", wide:1, items:[
      "✩ ♬ ₊.🎧⋆☾⋆⁺₊✧ *ੈ✩‧₊˚","✩ ♬ ₊.⋆☾⋆⁺₊✧ *ੈ✩‧₊˚","₊·.°.⋆🫧•˚₊‧⋆.","⋆｡☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆",
      "⋆.˚✮🎧✮˚.⋆","₊·.°.⋆✮⋆.°.‧₊","๋࣭ ⭑⚝๋࣭ ⭑⚝","⫘⫘⫘⫘⫘⫘"
    ], risky:[
      "⋆.𐙚 ̊. ⋆˚𝜗𝜚˚⋆ 𝜗ৎ ^ྀི","୨ৎ ⋆𐙚 ̊. ⋆⑅°₊ ⋆౨ৎ°⟡˖ ࣪",".˚₊⊹♡ ♫ ⋅˚₊‧ 𐙚 ‧₊˚ ⋅","⋅°₊ • ୨୧ ‧₊° ⋅  𓆝 𓆟 𓆞 𓆝 𓆟",
      "𓆉𓆝 𓆟 𓆞 𓆝 𓆟𓇼","⊹ ࣪ ﹏𓊝﹏𓂁﹏⊹ ࣪ ˖","🫧𓇼𓏲*ੈ✩·🐚ᝰ.ᐟ","✮ ⋆ ˚｡𖦹 ⋆｡°✩",
      "ִׄ˚ • 𖥔 ࣪˖ ⭑ ₊ ⭒ *ೃ༄"
    ]},
    {id:"star", en:"STARS", t:"星・きらきら", s:"文末や名前の横に。1〜2文字で効果があります。", items:[
      "★","☆","✦","✧","⋆","✩","✪","✫",
      "✬","✭","✮","✯","✰","⍟","࿐","˚₊·",
      "⁺˖","⊹","✵","✶","✷","✸","❋","✺",
      "｡･:*:･ﾟ★","˚ ✦","⋆｡°✩","· ˚ ✧","༄˖°","꙳","☄","⭑"
    ]},
    {id:"deco", en:"ORNAMENTS", t:"ハート・お花", s:"文末にひとつ置くのが一番使いやすい。1〜2文字で済みます。", items:[
      "♡","♥","❤︎","ღ","꒰ ♡ ꒱","⸝⸝ ♡ ⸝⸝","♡̶","♡⃛",
      "ෆ","❥","♡*｡","˗ˏˋ ♡ ˎˊ˗","✿","❀","ꕥ","❁",
      "✾","♧","☘","༄","☾","☁︎","៚","⌇",
      "ᐝ","ᰔ","𖤣","⑅","◞♡","♡‧₊˚","⋆⑅˚₊","꒰♡꒱"
    ]},
    {id:"bracket", en:"BRACKETS", t:"かっこ・飾り枠", s:"見出しやカテゴリー名を囲むのに。", items:[
      "꒰ ꒱","「 」","『 』","【 】","〔 〕","〖 〗","《 》","〈 〉",
      "≡ ≡","༺ ༻","꧁ ꧂","⟢ ⟣","⌜ ⌝","⌞ ⌟","▛ ▟","┌ ┐"
    ]},
    {id:"music", en:"MUSIC", t:"音楽記号", s:"プレイリスト、歌詞、BGM紹介に。最後の8個は流行りのスタイル系で、iPhoneではほぼ表示されますが、一部のAndroidでは四角になることがあります。貼る前に一度確認してね。", items:[
      "♪","♫","♬","♩","♭","♮","♯","🎵",
      "🎶","🎼","🎧","🎤","🎸","🎹","🥁","🎺",
      "♪♫","♫♪","♪⋆","✧♬","˚♪ ₊","♫*•","♪~","･ﾟ♪",
      "୨♪୧","⌒♪⌒","♪♪♪","˖♬°","♩‧₊˚","₊˚♪","♬⋆｡˚","˚♫₊·",
      "ᕷ˖°♪.¸","¸♬•*✩","¨*•.♫","⸝♬ ͟͟͞͞➳❥⁎",
      "♪ .⩇⩇:⩇⩇","ıllıılıılı ♫♪ ༘⋆","˖ ࣪⊹♫⸝⸝꙳","🎧𖥦 ♪ ༘",
      "♪ 𓂃 𓈒𓏸","♪⨾ 𓂃 ࣪⋆","၊၊||၊ ♪⊹","♪⨾ ᡣ𐭩"
    ]},
    {id:"number", en:"NUMBERS", t:"丸数字・記号数字", s:"リスト、手順、ルールに使える数字記号。丸、四角、かっこ、ローマ数字もここに。", items:[
      "①","②","③","④","⑤","⑥","⑦","⑧","⑨","⑩",
      "⓵","⓶","⓷","⓸","⓹","⓺","⓻","⓼","⓽","⓾",
      "❶","❷","❸","❹","❺","❻","❼","❽","❾","❿",
      "⑴","⑵","⑶","⑷","⑸","⑹","⑺","⑻","⑼","⑽",
      "⒈","⒉","⒊","⒋","⒌","⒍","⒎","⒏","⒐","⒑",
      "🄁","🄂","🄃","🄄","🄅","🄆","🄇","🄈","🄉","🄊",
      "Ⅰ","Ⅱ","Ⅲ","Ⅳ","Ⅴ","Ⅵ","Ⅶ","Ⅷ","Ⅸ","Ⅹ",
      "㊀","㊁","㊂","㊃","㊄","㊅","㊆","㊇","㊈","㊉"
    ]},
    {id:"dot", en:"DOTS & LINES", t:"点・線・図形", s:"リスト、タイムライン、営業時間に。", items:[
      "·","•","◦","‧","⋅","∙","◌","○",
      "▪︎","▫︎","◆","◇","▸","▹","➤","→",
      "︙","⋮","│","┊","┆","╎","⌁","〰"
    ]},
    {id:"read", en:"AWKWARD", t:"既読スルーされた時", s:"気まずい・無言・待つ", items:[
      "(´・ω・｀)","(・_・;)","( ˘•ω•˘ )","(；´д｀)","(．．;)","(´-ω-｀)","( ˇωˇ )","(・∀・;)"
    ]},
    {id:"ask", en:"PLEASE", t:"お願いしたい時", s:"甘える・おねだり", items:[
      "(＞人＜;)","(っ˘ω˘ς )","(人◕‿◕)","(´･ω･｀)ﾉ","(つ✧ω✧)つ","(๑•̀ㅂ•́)ﾉ","(人´∀｀)","( ˘ ³˘)♡"
    ]},
    {id:"sorry", en:"SORRY", t:"謝りたい時", s:"反省・おじぎ", items:[
      "m(_ _)m","<(_ _)>","(*_ _)人","(⌒_⌒;)","(´；ω；｀)","(・_・;)ゞ","ｍ(￣ ￣)ｍ","(＿ ＿*)"
    ]},
    {id:"tired", en:"EXHAUSTED", t:"今日はもう疲れた", s:"ぐったり・ぼーっと・だらだら", items:[
      "(´-ω-｀)","( ˘_˘ )","_(:3」∠)_","(=____=)","(＿ ＿)zzz","( ×ω× )","(￣ω￣;)","o(_ _)o"
    ]},
    {id:"happy", en:"JOY", t:"うれしくて回りたい", s:"わくわく・お祝い", items:[
      "(≧▽≦)","٩(◕‿◕)۶","＼(^o^)／","(๑>ᴗ<๑)","ヽ(´▽｀)/","(*^▽^*)","♪(´▽｀)","o(≧∀≦)o"
    ]},
    {id:"thanks", en:"THANK YOU", t:"ちゃんとありがとう", s:"感謝・やさしい", items:[
      "(*´꒳｀*)","(ღ˘⌣˘ღ)","(´｡• ᵕ •｡｀)","(o´∀｀o)","♡( ◡‿◡ )","(*ᴗ͈ˬᴗ͈)","( ´ ▽ ` )ﾉ","(⁄ ⁄•⁄ω⁄•⁄ ⁄)"
    ]},
    {id:"angry", en:"ANNOYED", t:"怒ってるけどかわいく", s:"ツンデレ・むすっ", items:[
      "(｀^´)","(・`ω´・)","(¬､¬)","(＃`д´)","(｀ε´)","(╬ Ò﹏Ó)","ヽ(`Д´)ﾉ","(╯°□°）╯︵ ┻━┻"
    ]},
    {id:"shy", en:"BLUSH", t:"ちょっと照れる時", s:"ときめき・赤面", items:[
      "(⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄)","(*/ω＼*)","(〃▽〃)","(♡ω♡ )","(*ﾉ▽ﾉ)","(´,,•ω•,,)♡","(///▽///)","(⁄ ⁄◕⁄ω⁄◕⁄ ⁄)"
    ]},
    {id:"cry", en:"TEARS", t:"ちょっと泣きたい", s:"しょんぼり・悲しい", items:[
      "(ಥ﹏ಥ)","(｡•́︿•̀｡)","(´；ω；｀)","(╥﹏╥)","(っ˘̩╭╮˘̩)っ","ﾟ(つд｀)ﾟ","(个_个)","(TдT)"
    ]},
    {id:"speechless", en:"SPEECHLESS", t:"もう言葉が出ない", s:"ぽかん・無言", items:[
      "¯\\_(ツ)_/¯","(¬_¬)","( ˙-˙ )","(・_・)","( ಠ ʖ̯ ಠ)","(-_-;)","(￣▽￣)\"","(・∀・)"
    ]},
    {id:"sleep", en:"GOOD NIGHT", t:"おはよう・おやすみ・眠い", s:"ねんね・あいさつ", items:[
      "(´-ω-｀)zZ","(∪｡∪)｡｡｡zzz","( ˘ω˘ )ｽﾔｧ","(=˘ω˘=)","(-, - )~zZ","☆.｡.:*(*´꒳｀*)","(u_u)","(o´ω｀o)ﾉ"
    ]},
    {id:"eat", en:"CAFE", t:"ごはん・カフェ", s:"グルメ・おやつ", items:[
      "(っ˘ڡ˘ς)","( ˘ ³˘)☕","（｀・ω・´）旦","( ￣▽￣)旦~~","٩(๑´3｀๑)۶","(*´ч｀*)","☕(๑´ڡ｀๑)","(๑´ㅂ｀๑)"
    ]},
    {id:"go", en:"CHEER UP", t:"応援してる", s:"がんばれ・ファイト", items:[
      "(๑•̀ㅂ•́)و✧","٩( 'ω' )و","(ง •̀_•́)ง","o(*￣▽￣*)ブ","(ﾉ>ω<)ﾉ","＼(๑❛ᴗ❛๑)⁄","(*•̀ᴗ•́*)و","ᕦ(ò_óˇ)ᕤ"
    ]},
    {id:"animal", en:"CREATURES", t:"いろいろな動物", s:"猫、犬、くま、鳥、魚、ペンギン。かっこと記号で描いた小さな動物たち。", wide:1, items:[
      "(=^･ω･^=)","(=^･ｪ･^=)","ฅ(^•ω•^ฅ)","ฅ^•ﻌ•^ฅ","/ᐠ｡ꞈ｡ᐟ\\","≽^•⩊•^≼","(=①ω①=)","(=`ω´=)",
      "ʕ•ᴥ•ʔ","ʕ ᵔᴥᵔ ʔ","ʕ·ᴥ·ʔ","ʕ￫ᴥ￩ʔ","ʕ；•`ᴥ•´ʔ","ʕ•ᴥ•ʔﾉ♡","U^ェ^U","▽･ω･▽",
      "ᐡ ᐧ ﻌ ᐧ ᐡ","૮ ˶ᵔ ᵕ ᵔ˶ ა","(・θ・)","(･ө･)","ᕕ( ᐛ )ᕗ","(๑･ө･๑)","＜(￣︶￣)＞","(・_・)ゞ",
      ">°))))彡","ϵ( 'Θ' )϶","><(((*>","≧🐟≦","(°ㅅ°)","ˏ₍•ɞ•₎ˎ","(｡･ω･｡)","(＾• ω •＾)",
      "( ˘ ³˘)","(・ω・)ﾉ","ʕ￫ᴥ￩ʔ♡","(=ﾟωﾟ)ﾉ","(ↀᴥↀ)","(ΦωΦ)","(ф ω ф)","(=✧ω✧=)"
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
    const done=()=>{
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
  $("#k-copy").onclick=()=>copy(build(),"まとめて整形","整形ジェネレーター");
  render();

  /* ---------- 組裝 ---------- */
  const body=$("#k-body"), nav=$("#k-nav");
  const secs=[{id:"sec-gen",t:"整形ジェネレーター"}];
  const mk=(id,en,t,note)=>{
    const s=document.createElement("section"); s.id=id;
    s.innerHTML=`<div class="sec-en">${en}</div><h2>${t}</h2><p class="sec-note">${note}</p>`;
    body.appendChild(s); secs.push({id,t}); return s;
  };

  /* 兔兔合成器 */
  const mixSec=mk("sec-mix","BIG KAOMOJI","何か持ってるうさぎのAA",
    "何行かにわたって描く大きな顔文字（AA）です。先にうさぎに持たせるものを選ぶと、下の18匹がまとめて切り替わります。タップするとそのままコピーされます。");
  const emoWrap=document.createElement("div");
  emoWrap.innerHTML=`<span class="lbl" style="margin-top:24px">持たせるもの</span><div class="emo-grid" id="k-emo"></div>`;
  mixSec.appendChild(emoWrap);
  const poseWrap=document.createElement("div");
  poseWrap.className="pose-grid"; poseWrap.id="k-pose";
  mixSec.appendChild(poseWrap);

  function drawMix(){
    $("#k-emo").querySelectorAll("button").forEach((b,i)=>b.setAttribute("aria-pressed",i===emo));
    $("#k-pose").querySelectorAll(".pose").forEach((b,i)=>{
      b.querySelector("pre").textContent=POSES[i].f(EMOS[emo]);
    });
  }
  EMOS.forEach((e,i)=>{
    const b=document.createElement("button");
    b.className="emo"; b.textContent=e; b.title=e+" に替える";
    b.onclick=()=>{emo=i;drawMix();};
    $("#k-emo").appendChild(b);
  });
  POSES.forEach((p,i)=>{
    const b=document.createElement("button");
    b.className="pose"; b.title="タップしてコピー";
    b.innerHTML=`<pre></pre><span class="nm"></span>`;
    b.querySelector(".nm").textContent=p.n;
    b.onclick=()=>copy(POSES[i].f(EMOS[emo]),p.n,"AA-何か持ってるうさぎ");
    poseWrap.appendChild(b);
  });
  drawMix();

  /* 兔兔圖鑑：不拿東西、單純可愛的兔子 */
  const BUNNIES=[
    " ꒰\\_/꒱\n ꒰•ᵕ•꒱"," ꒰\\⑅/꒱ ✧\n ꒰◔ᵕ◔꒱"," ꒰\\_/꒱\n ꒰•᷄ࡇ•᷅꒱"," /꒱/꒱\n｡･×･꒱ ♡",
    " /꒱/꒱\n꒰-`д´-꒱"," /) /)\n(-`д´-)"," /) /) ♡\n*( ･×･)"," /) /)\n(>д<)",
    " /) /)\n(ฅ• . •ฅ)"," (\\_(\\\n(=･ω･)"," (\\＿(\\*゜\n (ÒㅅÓ)"," /) ＿ /)\n(ฅ・×･)ฅ",
    " (\\♚/)\n (ฅ×ฅ)"," (\\ ♚ /)\n(◍ ′⅄‵ ◍)"," (\\_(\\\n(; ›ω‹)"," (\\_(\\\n (•- •)",
    " /)/)\n( . .)"," /)/) (\\(\\\n( . .)(. . )"," (\\(\\\n( -.-)"," (\\_/)\n( •_•)",
    " {\\__/}\n ( • ᴗ•)"," (\\__ /)\n(⁎˃ᴗ˂⁎)◞♡","*(\\_/)｡ﾟ{\\_/}*⋈\n( •×•)♡(•×• )"," ꒰\\_/꒱\n꒰ ˶• ᴗ •˶ ꒱"
  ];
  const bunSec=mk("sec-bunny","BUNNY","うさぎのAA図鑑",
    "何も持っていない、ただかわいいうさぎ。かっことスラッシュで描いた2行のAAで、文の後ろや段落の頭に置くとかわいく決まります。タップでそのままコピー。");
  const bunGrid=document.createElement("div");
  bunGrid.className="pose-grid";
  BUNNIES.forEach(b=>{
    const btn=document.createElement("button");
    btn.className="pose"; btn.title="タップしてコピー";
    btn.style.minHeight="96px";
    btn.innerHTML=`<pre></pre>`;
    btn.querySelector("pre").textContent=b;
    btn.onclick=()=>copy(b,b.replace(/\s+/g," ").trim(),"AA-うさぎ図鑑");
    bunGrid.appendChild(btn);
  });
  bunSec.appendChild(bunGrid);

  /* 表情組合器：眼睛 × 嘴巴 */
  const EYES=[
    ["ˊ","ˋ"],["ˇ","ˇ"],["⏑","⏑"],["´","｀"],
    ["◞","◟"],["◜","◝"],["◝","◜"],["-᷅","-᷄"],
    [".ܸ",".ܸ"],["◡","◡"],["_","_"],[".","."],
    ["•","•"],["•̀","•́"],["•́","•̀"],["߹","߹"],
    ["›","‹"],["^","^"],["⊳","⊲"],["՞","՞"],
    ["o̴̶̷᷄","o̴̶̷̥᷅"],["ᵒ̴̶̷̥́","ᵒ̴̶̷̣̥̀"],["o̴̶̷̤","o̴̶̷̤"],["ಠ","ಠ"],
    ["≧","≦"],["ꈍ","ꈍ"],["˃̶̤́","˂̶̤̀"],["ᴗ͈","ᴗ͈"],
    ["≻","≺"],["➤","◄"],["˃","˂"],["˃̵","˂̵"],
    ["=˃","˂="],["ˋ◔","◔ˊ"],["◕","◕"],["ㅇ","ㅇ"]
  ];
  const MOUTHS=["ᵕ","⤙","ᴖ","Ⱉ","△","࿁","ꕀ","‸",
                "༝","‿","⌓","⩊","⌑","｡","ㅁ","⇀",
                "̫","֊","᎔","ᗜ","Д","³","ᯅ","ˬ",
                "▬","∩","ʌ","ᴥ","ω","ᗢ","▭","ᨓ"];
  let eye=12;
  const face=(i,m)=>"("+EYES[i][0]+m+EYES[i][1]+")";

  const faceSec=mk("sec-face","MIX A FACE","顔文字メーカー",
    "1行の顔文字を組み立てるメーカーです。上で目を選ぶと、下の口がすべて自動で組み合わさり、顔をタップするとコピーできます。目36種類×口32種類で、1,100種類以上の顔が作れます。何行もある大きな顔文字は、うさぎのコーナーへどうぞ。");
  const fWrap=document.createElement("div");
  fWrap.innerHTML=`<span class="lbl" style="margin-top:24px">目</span><div class="eye-grid" id="k-eye"></div>
                   <span class="lbl" style="margin-top:26px">口と組み合わせ　タップでコピー</span><div class="grid" id="k-face"></div>`;
  faceSec.appendChild(fWrap);

  function drawFace(){
    $("#k-eye").querySelectorAll("button").forEach((b,i)=>b.setAttribute("aria-pressed",i===eye));
    $("#k-face").querySelectorAll("button").forEach((b,i)=>{
      const t=face(eye,MOUTHS[i]);
      b.textContent=t; b.onclick=()=>copy(t,t,"顔文字メーカー");
    });
  }
  EYES.forEach((e,i)=>{
    const b=document.createElement("button");
    b.className="eye"; b.textContent=e[0]+"　"+e[1]; b.title="この目にする";
    b.onclick=()=>{eye=i;drawFace();};
    $("#k-eye").appendChild(b);
  });
  MOUTHS.forEach(()=>{
    const b=document.createElement("button");
    b.className="cell"; b.title="タップしてコピー";
    $("#k-face").appendChild(b);
  });
  drawFace();

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
  const blankSec=mk("sec-blank","INVISIBLE","見えない空白（改行用）",
    "Instagram、Facebook、Threads は、投稿の先頭や連続した空行を自動で消してしまうので、Enter で空けた段落がくっついてしまいます。そこで「空白に見えるけれど、システムは空白と判定しない文字」を入れます。3つのSNSすべてで使えます。X や LINE ではふだん不要ですが、細かく整えたい時にも便利です。");
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
    <li>X や LINE は改行が消えにくいので、ふつうは Enter だけで大丈夫です。</li></ul>`;
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
    f.innerHTML=`<div class="field" style="margin-top:24px;max-width:340px"><input type="text" id="k-fin" value="hiyori" maxlength="30" placeholder="英字か数字を入力"></div><div id="k-fout"></div>`;
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
    const v=$("#k-fin").value||"hiyori";
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
  const genSec=document.getElementById("sec-gen"), afterSec=document.getElementById("sec-face"), blankSec2=document.getElementById("sec-blank");
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
