(function(){
"use strict";
/* ========= 1. 聯盟連結設定：把 Travelpayouts 的 tpk.ro 短網址貼進來 =========
   留空的品牌不會顯示按鈕；之後拿到連結再貼上即可。 */
var LINKS = window.KHP_LINKS || {};
var HUB = "/tools/travel-deals/";
var SAILY_REVIEW = "https://knittinghiyori.com/saily-ultra-esim-review-coupon/";
/* ======================================================================= */

var root = document.getElementById("khp");
if (!root) return;
var $ = function(id){ return document.getElementById(id); };
function track(name, params){ try{ if (typeof window.gtag === "function") window.gtag("event", name, params || {}); }catch(e){} }
function esc(s){ return String(s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]; }); }

var AFF = {
  saily:   {n:"Saily eSIM",        extra:{n:"Saily Ultra 評測＋折扣碼", u:SAILY_REVIEW}},
  airalo:  {n:"Airalo eSIM"},
  esimpicker:{n:"先比方案：eSIM 選擇器", url:"https://knittinghiyori.com/tools/esim-plan-picker/", internal:1},
  welcome: {n:"Welcome Pickups"},
  klook:   {n:"Klook 接送"},
  kkday:   {n:"KKday 接送"},
  airhelp: {n:"AirHelp 查賠償"},
  qeeq:    {n:"QEEQ 比價租車"},
  klookski:{n:"Klook 雪具／課程", key:"klook"}
};

/* ========= 2. 目的地資料 ========= */
// cl: temperate / tropical / southern / cool；ad: 1 需要、0 不用、2 視插頭；pk: w=Welcome Pickups 優先
var DESTS = [
  {id:"jp",f:"🇯🇵",n:"日本",plug:"A / B",v:100,ad:0,cl:"temperate",entry:"Visit Japan Web（入境＋海關 QR Code）",card:"Suica / ICOCA（可綁 Apple Pay）"},
  {id:"kr",f:"🇰🇷",n:"韓國",plug:"C / F",v:220,ad:1,cl:"temperate",entry:"K-ETA 或入境卡（出發前確認最新規定）",card:"T-money 交通卡"},
  {id:"th",f:"🇹🇭",n:"泰國",plug:"A / B / C / O",v:220,ad:1,cl:"tropical",entry:"TDAC 泰國數位入境卡",card:"Rabbit 卡（BTS 捷運）"},
  {id:"vn",f:"🇻🇳",n:"越南",plug:"A / C / F",v:220,ad:1,cl:"tropical",entry:"越南電子簽證 e-Visa",card:""},
  {id:"sg",f:"🇸🇬",n:"新加坡",plug:"G",v:230,ad:1,cl:"tropical",entry:"SG Arrival Card（抵達前 3 天內填）",card:"感應式信用卡 / EZ-Link"},
  {id:"hk",f:"🇭🇰",n:"港澳",plug:"G",v:220,ad:1,cl:"temperate",entry:"港澳網上預辦入境登記",card:"八達通 / 澳門通"},
  {id:"cn",f:"🇨🇳",n:"中國",plug:"A / C / I",v:220,ad:2,cl:"temperate",entry:"台胞證（確認效期）",card:"支付寶 / 微信支付綁卡"},
  {id:"my",f:"🇲🇾",n:"馬來西亞",plug:"G",v:240,ad:1,cl:"tropical",entry:"MDAC 數位入境卡",card:"Touch ’n Go 卡"},
  {id:"ph",f:"🇵🇭",n:"菲律賓",plug:"A / B / C",v:220,ad:0,cl:"tropical",entry:"eTravel 線上入境登記",card:""},
  {id:"id",f:"🇮🇩",n:"峇里島",plug:"C / F",v:230,ad:1,cl:"tropical",entry:"落地簽 e-VOA＋入境申報",card:""},
  {id:"uk",f:"🇬🇧",n:"英國",plug:"G",v:230,ad:1,cl:"cool",entry:"UK ETA 電子旅行許可",card:"感應式信用卡（倫敦地鐵直接刷）",long:1,pk:"w",eu:1},
  {id:"eu",f:"🇪🇺",n:"歐洲",plug:"C / F（義 L、瑞 J）",v:230,ad:1,cl:"temperate",entry:"申根免簽（ETIAS 依上路時程確認）",card:"感應式信用卡",long:1,pk:"w",eu:1},
  {id:"us",f:"🇺🇸",n:"美國",plug:"A / B",v:120,ad:0,cl:"temperate",entry:"ESTA 旅行授權",card:"感應式信用卡",long:1,pk:"w"},
  {id:"ca",f:"🇨🇦",n:"加拿大",plug:"A / B",v:120,ad:0,cl:"temperate",entry:"eTA 電子旅行證",card:"",long:1,pk:"w"},
  {id:"au",f:"🇦🇺",n:"澳洲",plug:"I",v:230,ad:1,cl:"southern",entry:"澳洲 ETA 電子旅行授權",card:"Opal / Myki（依城市）",long:1,pk:"w"},
  {id:"nz",f:"🇳🇿",n:"紐西蘭",plug:"I",v:230,ad:1,cl:"southern",entry:"NZeTA 電子旅行授權",card:"",long:1,pk:"w"}
];
var PLUGS={"A": {"s": "<svg class=\"khp-plugsvg\" viewBox=\"0 0 40 40\" width=\"34\" height=\"34\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"3\" y=\"3\" width=\"34\" height=\"34\" rx=\"9\" fill=\"#F4F0E9\" stroke=\"#CFC7BA\" stroke-width=\"1.2\"/><g fill=\"currentColor\"><rect x=\"13\" y=\"13\" width=\"3\" height=\"13\" rx=\"1\"/><rect x=\"24\" y=\"13\" width=\"3\" height=\"13\" rx=\"1\"/></g></svg>", "d": "兩片扁腳"}, "B": {"s": "<svg class=\"khp-plugsvg\" viewBox=\"0 0 40 40\" width=\"34\" height=\"34\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"3\" y=\"3\" width=\"34\" height=\"34\" rx=\"9\" fill=\"#F4F0E9\" stroke=\"#CFC7BA\" stroke-width=\"1.2\"/><g fill=\"currentColor\"><rect x=\"13\" y=\"10\" width=\"3\" height=\"11\" rx=\"1\"/><rect x=\"24\" y=\"10\" width=\"3\" height=\"11\" rx=\"1\"/><circle cx=\"20\" cy=\"28.5\" r=\"2.6\"/></g></svg>", "d": "兩扁腳＋圓形接地"}, "C": {"s": "<svg class=\"khp-plugsvg\" viewBox=\"0 0 40 40\" width=\"34\" height=\"34\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"3\" y=\"3\" width=\"34\" height=\"34\" rx=\"9\" fill=\"#F4F0E9\" stroke=\"#CFC7BA\" stroke-width=\"1.2\"/><g fill=\"currentColor\"><circle cx=\"14\" cy=\"20\" r=\"2.3\"/><circle cx=\"26\" cy=\"20\" r=\"2.3\"/></g></svg>", "d": "兩根細圓腳"}, "F": {"s": "<svg class=\"khp-plugsvg\" viewBox=\"0 0 40 40\" width=\"34\" height=\"34\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"3\" y=\"3\" width=\"34\" height=\"34\" rx=\"9\" fill=\"#F4F0E9\" stroke=\"#CFC7BA\" stroke-width=\"1.2\"/><g fill=\"currentColor\"><circle cx=\"13\" cy=\"20\" r=\"3\"/><circle cx=\"27\" cy=\"20\" r=\"3\"/><rect x=\"18\" y=\"4.5\" width=\"4\" height=\"3.5\" rx=\"1\"/><rect x=\"18\" y=\"32\" width=\"4\" height=\"3.5\" rx=\"1\"/></g></svg>", "d": "兩根粗圓腳＋側邊接地片"}, "G": {"s": "<svg class=\"khp-plugsvg\" viewBox=\"0 0 40 40\" width=\"34\" height=\"34\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"3\" y=\"3\" width=\"34\" height=\"34\" rx=\"9\" fill=\"#F4F0E9\" stroke=\"#CFC7BA\" stroke-width=\"1.2\"/><g fill=\"currentColor\"><rect x=\"18.5\" y=\"9\" width=\"3\" height=\"10\" rx=\"1\"/><rect x=\"10\" y=\"25\" width=\"8\" height=\"3\" rx=\"1\"/><rect x=\"22\" y=\"25\" width=\"8\" height=\"3\" rx=\"1\"/></g></svg>", "d": "三根方腳（英式）"}, "I": {"s": "<svg class=\"khp-plugsvg\" viewBox=\"0 0 40 40\" width=\"34\" height=\"34\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"3\" y=\"3\" width=\"34\" height=\"34\" rx=\"9\" fill=\"#F4F0E9\" stroke=\"#CFC7BA\" stroke-width=\"1.2\"/><g fill=\"currentColor\"><rect x=\"12.5\" y=\"10\" width=\"3\" height=\"11\" rx=\"1\" transform=\"rotate(30 14 15.5)\"/><rect x=\"24.5\" y=\"10\" width=\"3\" height=\"11\" rx=\"1\" transform=\"rotate(-30 26 15.5)\"/><rect x=\"18.5\" y=\"24\" width=\"3\" height=\"9\" rx=\"1\"/></g></svg>", "d": "八字斜插＋直腳"}, "O": {"s": "<svg class=\"khp-plugsvg\" viewBox=\"0 0 40 40\" width=\"34\" height=\"34\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"3\" y=\"3\" width=\"34\" height=\"34\" rx=\"9\" fill=\"#F4F0E9\" stroke=\"#CFC7BA\" stroke-width=\"1.2\"/><g fill=\"currentColor\"><circle cx=\"13\" cy=\"16\" r=\"2.6\"/><circle cx=\"27\" cy=\"16\" r=\"2.6\"/><circle cx=\"20\" cy=\"27\" r=\"2.6\"/></g></svg>", "d": "三根圓腳（泰式）"}, "L": {"s": "<svg class=\"khp-plugsvg\" viewBox=\"0 0 40 40\" width=\"34\" height=\"34\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"3\" y=\"3\" width=\"34\" height=\"34\" rx=\"9\" fill=\"#F4F0E9\" stroke=\"#CFC7BA\" stroke-width=\"1.2\"/><g fill=\"currentColor\"><circle cx=\"11\" cy=\"20\" r=\"2.3\"/><circle cx=\"20\" cy=\"20\" r=\"2.3\"/><circle cx=\"29\" cy=\"20\" r=\"2.3\"/></g></svg>", "d": "三根圓腳一直排"}, "J": {"s": "<svg class=\"khp-plugsvg\" viewBox=\"0 0 40 40\" width=\"34\" height=\"34\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"3\" y=\"3\" width=\"34\" height=\"34\" rx=\"9\" fill=\"#F4F0E9\" stroke=\"#CFC7BA\" stroke-width=\"1.2\"/><g fill=\"currentColor\"><circle cx=\"12.5\" cy=\"15\" r=\"2.3\"/><circle cx=\"27.5\" cy=\"15\" r=\"2.3\"/><circle cx=\"20\" cy=\"22\" r=\"2.3\"/></g></svg>", "d": "三根圓腳（中間偏下）"}, "D": {"s": "<svg class=\"khp-plugsvg\" viewBox=\"0 0 40 40\" width=\"34\" height=\"34\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"3\" y=\"3\" width=\"34\" height=\"34\" rx=\"9\" fill=\"#F4F0E9\" stroke=\"#CFC7BA\" stroke-width=\"1.2\"/><g fill=\"currentColor\"><circle cx=\"14\" cy=\"14\" r=\"3\"/><circle cx=\"26\" cy=\"14\" r=\"3\"/><circle cx=\"20\" cy=\"27\" r=\"4\"/></g></svg>", "d": "三根大圓腳（舊英式）"}};
function plugLetters(p){ return (p.split("（")[0].match(/\b[A-O]\b/g)||[]); }
function plugIcons(list){ return '<div class="khp-plugicons">'+list.map(function(k){ return PLUGS[k]?'<figure title="'+k+' 型：'+PLUGS[k].d+'">'+PLUGS[k].s+k+'</figure>':''; }).join("")+'</div>'; }
var DMAP = {}; DESTS.forEach(function(d){ DMAP[d.id]=d; });
var SEASONS = {spring:"春季",summer:"夏季",autumn:"秋季",winter:"冬季"};
var FLIP = {spring:"autumn",summer:"winter",autumn:"spring",winter:"summer"};
var STYLES = [["biz","商務出差"],["kid","親子"],["beach","海島玩水"],["ski","滑雪"],["hike","登山健行"],["shop","購物血拚"],["drive","自駕"]];
var SMAP = {}; STYLES.forEach(function(s){ SMAP[s[0]]=s[1]; });

var CATS = [
  ["docs","證件與金錢","#B89B7A"],["net","網路與通訊","#8C9DAE"],["ins","保險","#C9A9A6"],
  ["elec","電子與充電","#9A8FB0"],["trans","交通與接送","#7E9786"],["wear","衣物鞋子","#B7A68C"],
  ["care","盥洗保養","#9FB5B0"],["med","藥品與健康","#C4A0A0"],["style","旅行型態加碼","#A3B08F"],
  ["misc","其他小物","#A8A29A"],["mine","我的自訂","#6F8278"]
];

/* ========= 3. 物品規則 ========= */
function T(c,k){ return c.t.indexOf(k) > -1; }
var ITEMS = [
  // 證件與金錢
  {id:"passport",c:"docs",t:"護照（效期 6 個月以上）",must:1,note:"拍一張照片存雲端備份"},
  {id:"entry",c:"docs",t:function(c){return "入境手續："+c.d.entry;},must:1,note:"規定常更新，出發前以官方公告為準"},
  {id:"nhi",c:"docs",t:"健保卡",note:"海外就醫可回台申請核退，記得保留收據與診斷書"},
  {id:"ticket",c:"docs",t:"電子機票／登機證（截圖存離線）"},
  {id:"hotel",c:"docs",t:"住宿確認信＋當地語言地址",note:"給計程車司機看最快"},
  {id:"card",c:"docs",t:"信用卡 2 張（不同卡組織）",must:1,note:"開啟海外刷卡，記下掛失電話"},
  {id:"cash",c:"docs",t:"少量當地貨幣現金",note:"機場匯率通常較差，可先在台灣換好"},
  {id:"transit",c:"docs",t:function(c){return "交通卡／支付："+c.d.card;},if:function(c){return !!c.d.card;}},
  // 網路
  {id:"esim",c:"net",t:"eSIM 上網卡（出發前安裝，落地再開）",must:1,aff:["esimpicker","saily","airalo"],note:function(c){return c.d.id==="cn"?"中國地區請選擇標示可使用 Google、LINE 的方案":"先確認手機支援 eSIM；台灣門號保留收簡訊驗證碼";}},
  {id:"sms",c:"net",t:"台灣門號關閉數據漫遊、保留收簡訊",note:"收 OTP 驗證碼用，避免漫遊爆表"},
  {id:"offline",c:"net",t:"下載離線地圖＋翻譯 App"},
  // 保險
  {id:"ins",c:"ins",t:"旅平險＋海外突發疾病醫療",must:1,hub:1,note:"信用卡附贈的多為不便險，海外生病的醫療保障通常不夠"},
  {id:"inconv",c:"ins",t:"旅遊不便險（班機延誤、行李遺失）",note:"刷卡買機票可能已附贈，確認理賠條件與需要的證明"},
  {id:"airhelp",c:"ins",t:"航班延誤／取消可申請賠償",aff:["airhelp"],if:function(c){return !!c.d.eu;},note:"歐盟 EC261：抵達延誤 3 小時以上可能獲賠，保留登機證"},
  // 電子
  {id:"adapter",c:"elec",must:function(c){return c.d.id!=="jp";},if:function(c){return c.d.ad!==0 || c.d.id==="jp";},t:function(c){
      if (c.d.id==="jp") return "三孔轉兩孔轉接頭（筆電用）";
      if (c.d.ad===2) return "轉接頭（三孔或圓孔插頭才需要）";
      return "轉接頭（Type "+c.d.plug.replace(/（.*）/,"")+"）";
    },note:function(c){ return c.d.id==="jp" ? "日本很多插座只有兩孔" : (c.d.id==="eu" ? "瑞士、義大利插座不同，帶萬用轉接頭最省事" : ""); }},
  {id:"volt",c:"elec",if:function(c){return c.d.v>=200;},t:"吹風機、離子夾確認支援 110–240V",note:function(c){return "當地電壓 "+c.d.v+"V，只標 110V 的電器會燒壞";}},
  {id:"charger",c:"elec",t:"手機充電器＋充電線",must:1},
  {id:"powerbank",c:"elec",t:"行動電源（只能放隨身行李）",note:"嚴禁托運；多數航空公司禁止機上使用或替其充電"},
  {id:"usbhub",c:"elec",t:"多孔 USB 充電頭",note:"一個轉接頭就能同時充手機、手錶、耳機"},
  {id:"earphone",c:"elec",t:"耳機"},
  {id:"camera",c:"elec",t:"相機＋記憶卡＋電池",if:function(c){return c.n>=3;}},
  // 交通
  {id:"pickup",c:"trans",t:"預約機場接送",must:function(c){return !!c.d.long;},aff:function(c){return c.d.pk==="w"?["welcome","klook"]:["klook","kkday"];},
    note:function(c){return c.d.pk==="w"?"司機舉牌接機、固定價格；長途航班深夜抵達最安心":"預約接送或機場快線票，落地不用排隊找車";}},
  {id:"backhome",c:"trans",t:"回台灣的機場交通先安排好"},
  // 衣物
  {id:"under",c:"wear",t:"內衣褲",q:function(c){return Math.min(c.n+1,8);},must:1},
  {id:"socks",c:"wear",t:"襪子",q:function(c){return Math.min(c.n+1,8);}},
  {id:"tops",c:"wear",t:function(c){return c.hot?"短袖上衣":"上衣";},q:function(c){return Math.min(c.n,7);}},
  {id:"bottoms",c:"wear",t:function(c){return c.hot?"短褲／長褲／裙子":"長褲／裙子";},q:function(c){return Math.max(1,Math.min(Math.ceil(c.n/2),4));}},
  {id:"pajama",c:"wear",t:"睡衣",q:function(){return 1;}},
  {id:"laundry",c:"wear",t:"洗衣袋＋旅行用洗衣精",if:function(c){return c.n>7;},note:"超過 7 天：衣物帶 7 天份，訂有洗衣機的住宿就好"},
  {id:"coat",c:"wear",t:function(c){return c.d.cl==="cool"?"保暖大衣（英國冬天濕冷）":"羽絨外套／大衣";},if:function(c){return c.s==="winter";},must:1},
  {id:"heat",c:"wear",t:"發熱衣褲",q:function(c){return Math.min(Math.ceil(c.n/2),4);},if:function(c){return c.s==="winter";}},
  {id:"scarf",c:"wear",t:"圍巾、手套、毛帽",if:function(c){return c.s==="winter";}},
  {id:"kairo",c:"wear",t:"暖暖包",q:function(c){return Math.min(c.n*2,20);},if:function(c){return c.s==="winter";}},
  {id:"layer",c:"wear",t:"薄外套／針織衫（洋蔥式穿搭）",if:function(c){return c.s==="spring"||c.s==="autumn";}},
  {id:"windbreaker",c:"wear",t:"防風防潑水外套",if:function(c){return c.d.cl==="cool"&&c.s!=="winter";},note:"英國夏天早晚也涼，天氣說變就變"},
  {id:"aircon",c:"wear",t:"薄外套（室內冷氣很強）",if:function(c){return c.hot;}},
  {id:"sunhat",c:"wear",t:"遮陽帽＋太陽眼鏡",if:function(c){return c.hot||c.s==="summer";}},
  {id:"shoes",c:"wear",t:"好走的鞋",must:1,note:"新鞋先穿幾天再出門，避免磨腳"},
  {id:"slippers",c:"wear",t:"室內拖鞋"},
  // 盥洗
  {id:"tooth",c:"care",t:"牙刷牙膏",note:"環保規定下，許多飯店已不主動提供"},
  {id:"skincare",c:"care",t:"洗面乳、保養品（分裝 100ml 以下）"},
  {id:"sunscreen",c:"care",t:"防曬乳",if:function(c){return c.hot||c.s==="summer"||T(c,"ski")||T(c,"beach");}},
  {id:"lip",c:"care",t:"護唇膏、身體乳",if:function(c){return c.s==="winter";},note:"冬天乾燥，特別是日韓、歐美"},
  {id:"razor",c:"care",t:"刮鬍刀"},
  {id:"lens",c:"care",t:"隱形眼鏡＋藥水（或備用眼鏡）"},
  {id:"period",c:"care",t:"生理用品（如需要）"},
  {id:"comb",c:"care",t:"梳子、髮圈"},
  // 藥品
  {id:"meds",c:"med",t:"常備藥：感冒、止痛、腸胃",must:1},
  {id:"rx",c:"med",t:"個人處方藥（放隨身）",note:"長期用藥可請醫師開英文處方箋"},
  {id:"aid",c:"med",t:"OK 繃、小護理包"},
  {id:"motion",c:"med",t:"暈車暈機藥"},
  {id:"mask",c:"med",t:"口罩"},
  {id:"mosquito",c:"med",t:"防蚊液",if:function(c){return c.d.cl==="tropical"||c.s==="summer";}},
  // 其他
  {id:"ecobag",c:"misc",t:"折疊購物袋"},
  {id:"umbrella",c:"misc",t:"折疊傘",note:function(c){return c.d.cl==="tropical"?"熱帶午後雷陣雨多":"";}},
  {id:"pen",c:"misc",t:"原子筆（填入境卡、海關單）"},
  {id:"zip",c:"misc",t:"透明夾鏈袋（裝液體過安檢）"},
  {id:"bottle",c:"misc",t:"空水壺（過安檢後再裝水）"},
  {id:"pillow",c:"misc",t:"頸枕、眼罩",if:function(c){return !!c.d.long;}},
  {id:"scale",c:"misc",t:"行李秤",if:function(c){return !!c.d.long||T(c,"shop");}},
  {id:"tsa",c:"misc",t:"TSA 海關鎖",if:function(c){return c.d.id==="us"||c.d.id==="ca";},note:"美國安檢可能開箱，非 TSA 鎖會被剪斷"},
  // 旅行型態
  {id:"b_suit",c:"style",t:"正式服裝＋皮鞋",if:function(c){return T(c,"biz");}},
  {id:"b_card",c:"style",t:"名片",if:function(c){return T(c,"biz");}},
  {id:"b_pc",c:"style",t:"筆電＋充電器＋HDMI 轉接頭",if:function(c){return T(c,"biz");}},
  {id:"k_doc",c:"style",t:"小孩護照／證件",if:function(c){return T(c,"kid");},must:1},
  {id:"k_med",c:"style",t:"兒童退燒藥、常備藥",if:function(c){return T(c,"kid");}},
  {id:"k_snack",c:"style",t:"零食、小玩具、平板（機上用）",if:function(c){return T(c,"kid");}},
  {id:"k_cart",c:"style",t:"推車或揹巾",if:function(c){return T(c,"kid");}},
  {id:"k_wipe",c:"style",t:"濕紙巾、尿布（如需要）",if:function(c){return T(c,"kid");}},
  {id:"s_swim",c:"style",t:"泳衣",if:function(c){return T(c,"beach");}},
  {id:"s_bag",c:"style",t:"防水手機袋",if:function(c){return T(c,"beach");}},
  {id:"s_flip",c:"style",t:"夾腳拖",if:function(c){return T(c,"beach");}},
  {id:"s_after",c:"style",t:"曬後修護凝膠",if:function(c){return T(c,"beach");}},
  {id:"ski_wear",c:"style",t:"雪衣雪褲（或當地租）",if:function(c){return T(c,"ski");},aff:["klookski"]},
  {id:"ski_goggle",c:"style",t:"雪鏡、防水手套",if:function(c){return T(c,"ski");}},
  {id:"ski_mid",c:"style",t:"保暖中層衣（刷毛）",if:function(c){return T(c,"ski");}},
  {id:"h_shoe",c:"style",t:"登山鞋",if:function(c){return T(c,"hike");}},
  {id:"h_dry",c:"style",t:"排汗衣",if:function(c){return T(c,"hike");},q:function(c){return Math.min(c.n,4);}},
  {id:"h_lamp",c:"style",t:"頭燈",if:function(c){return T(c,"hike");}},
  {id:"h_rain",c:"style",t:"輕量雨衣",if:function(c){return T(c,"hike");}},
  {id:"shop_bag",c:"style",t:"可折疊行李袋（預留戰利品空間）",if:function(c){return T(c,"shop");}},
  {id:"shop_tax",c:"style",t:"退稅：購物時出示護照",if:function(c){return T(c,"shop");}},
  {id:"d_idp",c:"style",t:"國際駕照＋台灣駕照正本",if:function(c){return T(c,"drive");},must:1,aff:["qeeq"],note:function(c){return c.d.id==="jp"?"日本需另備駕照日文譯本":"";}},
  {id:"d_mount",c:"style",t:"手機車架＋車用充電",if:function(c){return T(c,"drive");}}
];

/* ========= 4. 狀態 ========= */
var KEY = "khp_packing_v1";
var S = {d:"jp",s:guessSeason(),n:5,t:[],checked:{},hidden:[],custom:[],closed:[]};
function guessSeason(){ var m=new Date().getMonth()+1; return m>=3&&m<=5?"spring":m>=6&&m<=8?"summer":m>=9&&m<=11?"autumn":"winter"; }
function load(){ try{ var x=JSON.parse(localStorage.getItem(KEY)||"null"); if(x&&typeof x==="object"){ for(var k in S){ if(x[k]!==undefined) S[k]=x[k]; } } }catch(e){} }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }
function fromURL(){
  try{
    var p=new URLSearchParams(location.search), used=false;
    if(p.get("d")&&DMAP[p.get("d")]){ S.d=p.get("d"); used=true; }
    if(p.get("s")&&SEASONS[p.get("s")]){ S.s=p.get("s"); used=true; }
    var n=parseInt(p.get("n"),10); if(n>=1&&n<=30){ S.n=n; used=true; }
    if(p.get("t")!==null){ S.t=p.get("t").split(",").filter(function(k){return SMAP[k];}); used=true; }
    if(p.get("x")){ p.get("x").split("|").slice(0,30).forEach(function(txt){ txt=txt.trim().slice(0,40); if(txt && !S.custom.some(function(o){return o.t===txt;})) S.custom.push({id:"c"+Math.random().toString(36).slice(2,8),t:txt}); }); used=true; }
    if(used) track("packing_open_shared",{destination:S.d});
    return used;
  }catch(e){ return false; }
}
function ctx(){
  var d=DMAP[S.d], s=S.s;
  if(d.cl==="southern") s=FLIP[s];
  if(d.cl==="tropical") s="summer";
  return {d:d,s:s,n:S.n,t:S.t,hot:d.cl==="tropical"||(s==="summer"&&d.cl!=="cool")};
}
function val(v,c){ return typeof v==="function"?v(c):v; }
function buildList(){
  var c=ctx(), out=[];
  ITEMS.forEach(function(it){
    if(it.if && !it.if(c)) return;
    var text=val(it.t,c);
    if(!text) return;
    out.push({id:it.id,cat:it.c,t:text,q:it.q?it.q(c):0,must:!!val(it.must,c),note:val(it.note,c)||"",aff:val(it.aff,c)||[],hub:!!it.hub});
  });
  S.custom.forEach(function(o){ out.push({id:o.id,cat:"mine",t:o.t,q:0,must:false,note:"",aff:[],custom:1}); });
  return out;
}

/* ========= 5. 畫面 ========= */
var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
var CHEV = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
function affHTML(k, itemId){
  var a=AFF[k]; if(!a) return "";
  if(a.internal) return '<a class="khp-aff int" href="'+esc(a.url)+'" data-aff="'+k+'" data-item="'+itemId+'">'+esc(a.n)+'</a>';
  var key=a.key||k, url=LINKS[key];
  if(!url) return "";
  var h='<a class="khp-aff" href="'+esc(url)+'" target="_blank" rel="sponsored nofollow noopener" data-aff="'+k+'" data-item="'+itemId+'">'+esc(a.n)+' ↗</a>';
  if(a.extra) h+='<a class="khp-aff int" href="'+esc(a.extra.u)+'" data-aff="'+k+'_review" data-item="'+itemId+'">'+esc(a.extra.n)+'</a>';
  return h;
}
function renderForm(){
  Array.prototype.forEach.call(root.querySelectorAll("#khp-dests [data-d]"),function(b){ b.setAttribute("aria-pressed", String(b.getAttribute("data-d")===S.d)); });
  Array.prototype.forEach.call(root.querySelectorAll("#khp-season [data-s]"),function(b){ b.setAttribute("aria-pressed", String(b.getAttribute("data-s")===S.s)); });
  Array.prototype.forEach.call(root.querySelectorAll("#khp-tags [data-t]"),function(b){ b.setAttribute("aria-pressed", String(S.t.indexOf(b.getAttribute("data-t"))>-1)); });
  $("khp-range").value=S.n; $("khp-dayval").textContent=S.n;
  $("khp-range").style.setProperty("--p", ((S.n-1)/29*100)+"%");
  var d=DMAP[S.d], hint=$("khp-shint");
  if(d.cl==="tropical"){ hint.textContent="※ "+d.n+"屬熱帶氣候，全年以夏季衣物為主，已自動調整。"; hint.classList.add("on"); }
  else if(d.cl==="southern"){ hint.textContent="※ 南半球季節相反：台灣"+SEASONS[S.s]+"出發，"+d.n+"是"+SEASONS[FLIP[S.s]]+"，已自動調整衣物。"; hint.classList.add("on"); }
  else hint.classList.remove("on");
}
var LIST=[];
function render(){
  renderForm();
  var c=ctx(), d=c.d;
  LIST=buildList().filter(function(i){ return S.hidden.indexOf(i.id)<0; });
  var adTxt = d.ad===1?"要帶":(d.ad===2?"看插頭":(d.id==="jp"?"不用（三孔需轉）":"不用"));
  $("khp-info").innerHTML=
    '<div class="khp-plugcard '+(d.ad===1?"warn":(d.ad===0?"ok":""))+'">'+
      '<div class="khp-plugside"><em>台灣插頭</em>'+plugIcons(["A","B"])+'</div><span class="khp-plugarrow">→</span>'+
      '<div class="khp-plugside"><em>'+esc(d.n)+'插座</em>'+plugIcons(plugLetters(d.plug))+'</div>'+
      '<div class="khp-plugverdict"><span>轉接頭</span><b>'+adTxt+'</b>'+(d.id==="eu"?'<span style="font-size:11.5px">義大利 L、瑞士 J 型不同</span>':'')+'</div></div>'+
    '<div class="'+(d.v>=200?"warn":"")+'"><span>電壓</span><b>'+d.v+'V'+(d.v>=200?"（台灣 110V）":"・可直接用")+'</b></div>'+
    '<div><span>當地季節</span><b>'+SEASONS[c.s]+(d.cl==="tropical"?"・熱帶":"")+'</b></div>'+
    '<div class="khp-entry"><span>入境手續</span><b style="font-size:13px">'+esc(d.entry)+'</b></div>';
  var html="";
  CATS.forEach(function(cat){
    var items=LIST.filter(function(i){return i.cat===cat[0];});
    if(!items.length && cat[0]!=="mine") return;
    var done=items.filter(function(i){return S.checked[i.id];}).length;
    var closed=S.closed.indexOf(cat[0])>-1;
    html+='<section class="khp-cat'+(closed?" closed":"")+(items.length&&done===items.length?" alldone":"")+'" data-cat="'+cat[0]+'">'+
      '<button type="button" class="khp-cat-h" data-toggle="'+cat[0]+'" aria-expanded="'+(!closed)+'"><span class="khp-dot" style="background:'+cat[2]+'"></span>'+cat[1]+'<em>'+done+' / '+items.length+'</em>'+CHEV+'</button><ul>';
    items.forEach(function(i){
      var on=!!S.checked[i.id], sub="";
      var affs=i.aff.map(function(k){return affHTML(k,i.id);}).join("");
      if(i.note||affs) sub='<div class="khp-sub">'+esc(i.note)+(affs?'<div class="khp-affs">'+affs+'</div>':'')+'</div>';
      html+='<li class="khp-item'+(on?" done":"")+'" data-id="'+i.id+'"><label><input type="checkbox" '+(on?"checked":"")+' data-check="'+i.id+'"><span class="khp-box">'+CHECK+'</span><span class="khp-txt">'+esc(i.t)+(i.q?'<span class="khp-qty">×'+i.q+'</span>':'')+(i.must?'<span class="khp-must">必帶</span>':'')+'</span></label>'+sub+
        '<button type="button" class="khp-x" data-hide="'+i.id+'" aria-label="'+(i.custom?"刪除":"不需要，略過")+'：'+esc(i.t)+'">×</button></li>';
    });
    html+='</ul>';
    if(cat[0]==="mine") html+='<div class="khp-add"><input type="text" id="khp-addin" maxlength="40" placeholder="加入自己的物品，例如：伴手禮" enterkeyhint="done"><button type="button" data-act="add">新增</button></div>';
    html+='</section>';
  });
  $("khp-list").innerHTML=html;
  var hiddenBuiltIn=S.hidden.length;
  $("khp-hidden").innerHTML=hiddenBuiltIn?'已略過 '+hiddenBuiltIn+' 項・<button type="button" data-act="unhide">全部復原</button>':'';
  updateProgress();
  save();
}
function updateProgress(){
  var total=LIST.length, done=LIST.filter(function(i){return S.checked[i.id];}).length;
  var pct=total?Math.round(done/total*100):0, d=DMAP[S.d];
  $("khp-ring").style.setProperty("--v",pct);
  $("khp-ring").style.background="conic-gradient(var(--sage) "+pct+"%, var(--line) 0)";
  $("khp-pct").textContent=pct+"%";
  $("khp-title").textContent=d.n+" "+S.n+" 天行李清單";
  $("khp-sub").textContent=SEASONS[S.s]+"出發"+(S.t.length?"・"+S.t.map(function(k){return SMAP[k];}).join("、"):"")+"｜已打包 "+done+" / "+total+" 項";
  $("khp-float-t").textContent="已打包 "+done+"/"+total;
  Array.prototype.forEach.call(root.querySelectorAll(".khp-cat"),function(sec){
    var items=LIST.filter(function(i){return i.cat===sec.dataset.cat;});
    var dn=items.filter(function(i){return S.checked[i.id];}).length;
    sec.querySelector("em").textContent=dn+" / "+items.length;
    sec.classList.toggle("alldone", items.length>0 && dn===items.length);
  });
  return {done:done,total:total};
}

/* ========= 6. 互動 ========= */
var toastTimer;
function toast(msg, ok){ var t=$("khp-toast"); t.textContent=msg; t.classList.toggle("ok",!!ok); t.classList.add("on"); clearTimeout(toastTimer); toastTimer=setTimeout(function(){t.classList.remove("on");},2400); }
var OKSVG='<svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
function flash(btn, label, cls, ms){
  if(!btn) return;
  if(btn._orig===undefined) btn._orig=btn.innerHTML;
  clearTimeout(btn._t); btn.classList.remove("is-ok","is-warn","is-busy");
  var hasIcon=!!btn.querySelector("svg")||btn.closest(".khp-actions");
  btn.innerHTML=(hasIcon&&cls!=="is-busy"?OKSVG:"")+label;
  if(cls==="is-warn"&&hasIcon) btn.innerHTML=btn._orig.replace(/[^>]*$/,"")+label;
  btn.classList.add(cls||"is-ok");
  btn._t=setTimeout(function(){ restore(btn); }, ms||1800);
}
function restore(btn){ if(!btn||btn._orig===undefined) return; clearTimeout(btn._t); btn.innerHTML=btn._orig; btn.classList.remove("is-ok","is-warn","is-busy"); btn._armed=false; }
function actBtns(act){ return document.querySelectorAll('[data-act="'+act+'"]'); }
function shareURL(){
  var base=location.href.split("#")[0].split("?")[0];
  var q="?d="+S.d+"&s="+S.s+"&n="+S.n;
  if(S.t.length) q+="&t="+S.t.join(",");
  if(S.custom.length) q+="&x="+encodeURIComponent(S.custom.map(function(o){return o.t.replace(/\|/g," ");}).join("|"));
  return base+q+"#khp-result";
}
function listText(){
  var d=DMAP[S.d], lines=["【"+d.n+" "+S.n+" 天行李清單｜"+SEASONS[S.s]+"出發】"];
  CATS.forEach(function(cat){
    var items=LIST.filter(function(i){return i.cat===cat[0];}); if(!items.length) return;
    lines.push("", "■ "+cat[1]);
    items.forEach(function(i){ lines.push((S.checked[i.id]?"☑ ":"☐ ")+i.t+(i.q?" ×"+i.q:"")); });
  });
  lines.push("", "一起用這份清單打包 👉 "+shareURL());
  return lines.join("\n");
}
function copy(text, okMsg, btn, btnLabel){
  function ok(){ toast(okMsg,true); flash(btn, btnLabel||"已複製！"); }
  function fail(){ toast("複製失敗，請改用「存成圖片」"); }
  function fallback(){ var ta=document.createElement("textarea"); ta.value=text; ta.setAttribute("readonly",""); ta.style.cssText="position:fixed;top:0;left:0;opacity:0"; document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0,ta.value.length); var r=false; try{ r=document.execCommand("copy"); }catch(e){} document.body.removeChild(ta); if(r) ok(); else fail(); }
  if(navigator.clipboard&&window.isSecureContext){
    var done=false, timer=setTimeout(function(){ if(!done){ done=true; fallback(); } },1200);
    navigator.clipboard.writeText(text).then(function(){ if(!done){ done=true; clearTimeout(timer); ok(); } },function(){ if(!done){ done=true; clearTimeout(timer); fallback(); } });
  } else fallback();
}
function doShare(btn){
  var d=DMAP[S.d], url=shareURL(), data={title:d.n+" "+S.n+" 天行李清單",text:"我用這個產生了"+d.n+"行李清單，你也用同一份來打包吧！",url:url};
  var mobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.maxTouchPoints>1&&/Mac/.test(navigator.platform));
  track("packing_share",{method:(navigator.share&&mobile)?"native":"copy",destination:S.d});
  if(navigator.share&&mobile){
    flash(btn,"開啟中…","is-busy",1200);
    navigator.share(data).then(function(){ toast("已分享給旅伴",true); flash(btn,"已分享！"); }).catch(function(err){ restore(btn); if(err&&err.name!=="AbortError") copy(data.text+"\n"+url,"分享連結已複製，貼到 LINE 給旅伴吧！",btn,"連結已複製"); });
  } else copy(data.text+"\n"+url, "分享連結已複製，貼到 LINE 給旅伴吧！", btn, "連結已複製");
}
var portal=$("khp-portal");
try{ if(portal&&portal.parentNode!==document.body) document.body.appendChild(portal); }catch(e){}
function onClick(e){
  var el=e.target.closest("[data-d],[data-s],[data-t],[data-toggle],[data-hide],[data-act],[data-aff],[data-img],[data-tool]");
  if(!el||!this.contains(el)) return;
  if(el.dataset.d){ S.d=el.dataset.d; render(); toast("已切換到 "+DMAP[S.d].n+"，清單已更新",true); track("packing_generate",{destination:S.d,season:S.s,days:S.n}); return; }
  if(el.dataset.s&&el.parentNode.id==="khp-season"){ S.s=el.dataset.s; render(); return; }
  if(el.dataset.t){ var k=el.dataset.t, ix=S.t.indexOf(k); if(ix>-1) S.t.splice(ix,1); else S.t.push(k); render(); return; }
  if(el.dataset.toggle){ var c=el.dataset.toggle, j=S.closed.indexOf(c); if(j>-1) S.closed.splice(j,1); else S.closed.push(c); el.parentNode.classList.toggle("closed"); el.setAttribute("aria-expanded", String(j>-1)); save(); return; }
  if(el.dataset.hide){ var id=el.dataset.hide; if(id.charAt(0)==="c"&&S.custom.some(function(o){return o.id===id;})){ S.custom=S.custom.filter(function(o){return o.id!==id;}); } else S.hidden.push(id); delete S.checked[id]; render(); return; }
  if(el.dataset.tool){ track("packing_tool_click",{tool:el.dataset.tool,destination:S.d}); return; }
  if(el.dataset.aff){ track("packing_affiliate_click",{brand:el.dataset.aff,item:el.dataset.item,destination:S.d}); return; }
  if(el.dataset.img){ imgMode=el.dataset.img; Array.prototype.forEach.call($("khp-opt").children,function(b){b.setAttribute("aria-pressed",String(b===el));}); makeImage(); return; }
  var act=el.dataset.act;
  if(act==="image"){ flash(el,"產生中…","is-busy",600); setTimeout(function(){ restore(el); openModal(); },60); }
  else if(act==="share"){ doShare(el); }
  else if(act==="copy"){ copy(listText(),"清單文字已複製，可以貼到 LINE 或備忘錄",el,"已複製！"); track("packing_copy_text",{destination:S.d}); }
  else if(act==="reset"){
    if(!Object.keys(S.checked).length){ flash(el,"還沒有勾選","is-warn",1500); toast("目前沒有勾選的項目"); return; }
    if(!el._armed){ flash(el,"再按確認","is-warn",3000); el._armed=true; return; }
    S.checked={}; render(); restore(el); flash(el,"已清除！"); toast("已清除所有勾選",true); track("packing_reset",{destination:S.d});
  }
  else if(act==="unhide"){ S.hidden=[]; render(); }
  else if(act==="add"){ addCustom(); }
  else if(act==="close"){ closeModal(); }
  else if(act==="download"){ downloadImg(el); }
  else if(act==="shareimg"){ shareImg(el); }
}
root.addEventListener("click", onClick);
if(portal) portal.addEventListener("click", onClick);
root.addEventListener("change", function(e){
  var id=e.target.dataset&&e.target.dataset.check; if(!id) return;
  if(e.target.checked) S.checked[id]=1; else delete S.checked[id];
  e.target.closest(".khp-item").classList.toggle("done", e.target.checked);
  var p=updateProgress(); save();
  if(e.target.checked&&p.done===p.total&&p.total>0){ toast("全部打包完成！旅途愉快 ✈"); track("packing_complete",{destination:S.d,total:p.total}); }
  else if(p.done===1&&e.target.checked) track("packing_first_check",{destination:S.d});
});
root.addEventListener("keydown", function(e){ if(e.key==="Enter"&&e.target.id==="khp-addin"){ e.preventDefault(); addCustom(); } });
document.addEventListener("keydown", function(e){ if(e.key==="Escape") closeModal(); });
function addCustom(){
  var inp=$("khp-addin"), v=(inp&&inp.value||"").trim().slice(0,40); if(!v) return;
  S.custom.push({id:"c"+Date.now().toString(36),t:v}); render(); track("packing_add_custom",{});
  var n=$("khp-addin"); if(n) n.focus();
}
var range=$("khp-range");
range.addEventListener("input", function(){ S.n=+range.value; $("khp-dayval").textContent=S.n; range.style.setProperty("--p",((S.n-1)/29*100)+"%"); clearTimeout(range._t); range._t=setTimeout(render,120); });
$("khp-dminus").addEventListener("click", function(){ if(S.n>1){ S.n--; render(); } });
$("khp-dplus").addEventListener("click", function(){ if(S.n<30){ S.n++; render(); } });
$("khp-go").addEventListener("click", function(){ track("packing_generate",{destination:S.d,season:S.s,days:S.n}); $("khp-result").scrollIntoView({behavior:"smooth",block:"start"}); });
// 手機浮動列：清單在畫面中、但進度卡不在畫面中時顯示
if("IntersectionObserver" in window){
  var vis={list:false,bar:false}, fl=$("khp-float");
  var io=new IntersectionObserver(function(es){ es.forEach(function(en){ vis[en.target.id==="khp-list"?"list":"bar"]=en.isIntersecting; }); var on=vis.list&&!vis.bar; fl.classList.toggle("on",on); fl.setAttribute("aria-hidden",String(!on)); });
  io.observe($("khp-list")); io.observe($("khp-bar"));
}

/* ========= 7. 存成圖片（Canvas 自繪，不依賴外部套件） ========= */
var imgMode="all", imgBlob=null, imgURL="";
function openModal(){ $("khp-modal").classList.add("on"); document.documentElement.style.overflow="hidden"; makeImage(); track("packing_save_image_open",{destination:S.d}); }
function closeModal(){ $("khp-modal").classList.remove("on"); document.documentElement.style.overflow=""; }
$("khp-modal").addEventListener("click", function(e){ if(e.target.id==="khp-modal") closeModal(); });
function rr(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
function wrap(ctx,text,maxW){ var lines=[],line=""; Array.from(text).forEach(function(ch){ var t=line+ch; if(ctx.measureText(t).width>maxW&&line){ lines.push(line); line=ch; } else line=t; }); if(line) lines.push(line); return lines; }
function makeImage(){
  var FONT='"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif';
  var W=1080,P=64,G=36,colW=(W-P*2-G)/2,LH=44,IF="30px "+FONT,HF="bold 32px "+FONT;
  var cv=document.createElement("canvas"), ctx=cv.getContext("2d");
  var d=DMAP[S.d], c=ctx_(), todo=imgMode==="todo";
  var blocks=[];
  ctx.font=IF;
  CATS.forEach(function(cat){
    var items=LIST.filter(function(i){ return i.cat===cat[0] && (!todo||!S.checked[i.id]); });
    if(!items.length) return;
    var rows=items.map(function(i){ var lines=wrap(ctx,i.t+(i.q?" ×"+i.q:""),colW-92); return {i:i,lines:lines,h:lines.length*LH+12}; });
    blocks.push({cat:cat,rows:rows,h:64+rows.reduce(function(a,r){return a+r.h;},0)+28});
  });
  var cols=[0,0], place=[];
  blocks.forEach(function(b){ var k=cols[0]<=cols[1]?0:1; place.push({b:b,x:P+k*(colW+G),y:cols[k]}); cols[k]+=b.h+G; });
  var HEAD=330, bodyH=Math.max(cols[0],cols[1],120), H=HEAD+bodyH+170;
  cv.width=W; cv.height=H;
  ctx.fillStyle="#F7F4EF"; ctx.fillRect(0,0,W,H);
  // header
  ctx.fillStyle="#7E9786"; rr(ctx,P-24,P-24,W-(P-24)*2,HEAD-P-4,32); ctx.fill();
  ctx.fillStyle="rgba(255,255,255,.75)"; ctx.font="600 22px "+FONT; ctx.fillText("P A C K I N G   L I S T", P+12, P+30);
  ctx.fillStyle="#fff"; ctx.font="bold 62px "+FONT; ctx.fillText(d.n+" "+S.n+" 天行李清單", P+10, P+112);
  var tot=LIST.length, dn=LIST.filter(function(i){return S.checked[i.id];}).length;
  ctx.font="28px "+FONT; ctx.fillStyle="rgba(255,255,255,.92)";
  var meta=SEASONS[S.s]+"出發・當地"+SEASONS[c.s]+(S.t.length?"・"+S.t.map(function(k){return SMAP[k];}).join("、"):"");
  ctx.fillText(meta.length>30?meta.slice(0,30)+"…":meta, P+12, P+166);
  ctx.fillText("插頭 "+d.plug.replace(/（.*）/,"")+"・"+d.v+"V・"+(d.ad===1?"要帶轉接頭":"免轉接頭")+"｜已打包 "+dn+"/"+tot, P+12, P+212);
  // blocks
  place.forEach(function(p){
    var x=p.x, y=HEAD+p.y, b=p.b;
    ctx.fillStyle="#FFFFFF"; rr(ctx,x,y,colW,b.h,24); ctx.fill();
    ctx.strokeStyle="#E6E0D6"; ctx.lineWidth=2; ctx.stroke();
    ctx.fillStyle=b.cat[2]; rr(ctx,x+26,y+26,16,16,4); ctx.fill();
    ctx.fillStyle="#3A3833"; ctx.font=HF; ctx.fillText(b.cat[1], x+54, y+46);
    var yy=y+74; ctx.font=IF;
    b.rows.forEach(function(r){
      var on=!!S.checked[r.i.id];
      rr(ctx,x+26,yy+6,28,28,7);
      if(on){ ctx.fillStyle="#7E9786"; ctx.fill(); ctx.strokeStyle="#fff"; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(x+33,yy+20); ctx.lineTo(x+38,yy+26); ctx.lineTo(x+48,yy+14); ctx.stroke(); }
      else { ctx.strokeStyle="#BDB5A8"; ctx.lineWidth=2.5; ctx.stroke(); }
      ctx.fillStyle=on?"#ABA497":"#3A3833";
      r.lines.forEach(function(l,li){ ctx.fillText(l, x+68, yy+31+li*LH); });
      yy+=r.h;
    });
  });
  if(!blocks.length){ ctx.fillStyle="#7E9786"; ctx.font="bold 40px "+FONT; ctx.fillText("全部打包完成！旅途愉快", P, HEAD+70); }
  // footer
  var fy=H-120;
  ctx.strokeStyle="#E6E0D6"; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(P,fy); ctx.lineTo(W-P,fy); ctx.stroke();
  ctx.fillStyle="#3A3833"; ctx.font="bold 28px "+FONT; ctx.fillText("出國行李清單產生器", P, fy+52);
  ctx.fillStyle="#857F75"; ctx.font="24px "+FONT; ctx.fillText("knittinghiyori.com ・ 選目的地、季節、天數一鍵產生", P, fy+90);
  imgURL=cv.toDataURL("image/png"); $("khp-img").src=imgURL; imgBlob=null;
  if(cv.toBlob) cv.toBlob(function(b){ imgBlob=b; },"image/png");
}
function ctx_(){ return ctx(); }
function fileName(){ return "packing-list-"+S.d+"-"+S.n+"d.png"; }
var INAPP=/Line\/|FBAN|FBAV|Instagram|MicroMessenger/i.test(navigator.userAgent);
function downloadImg(btn){ if(INAPP){ toast("此瀏覽器不支援下載：請長按上方圖片，選「儲存圖片」"); flash(btn,"請長按圖片","is-warn",2500); return; } var a=document.createElement("a"); a.href=imgURL; a.download=fileName(); document.body.appendChild(a); a.click(); a.remove(); flash(btn,"已下載！"); toast("圖片已下載，到「下載」資料夾查看",true); track("packing_save_image",{method:"download",destination:S.d}); }
function shareImg(btn){
  var f=imgBlob&&window.File?new File([imgBlob],fileName(),{type:"image/png"}):null;
  if(f&&navigator.canShare&&navigator.canShare({files:[f]})){
    navigator.share({files:[f],title:"我的行李清單",text:"一起用這份清單打包："+shareURL()}).then(function(){ flash(btn,"已分享！"); track("packing_save_image",{method:"share",destination:S.d}); }).catch(function(){});
  } else { downloadImg(btn); }
}

/* ========= 8. 啟動 ========= */
load();
var shared=fromURL();
render();
if(shared&&location.hash==="#khp-result") setTimeout(function(){ $("khp-result").scrollIntoView({block:"start"}); },300);
})();
