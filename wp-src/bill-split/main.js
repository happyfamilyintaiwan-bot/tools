(function(){
'use strict';
try{
/* ▼ 聯盟連結：只改這裡 */
var AFF=window.BS_AFF||{
  klook:'https://klook.tpk.ro/yPdA5Iyi',
  kkday:'https://kkday.tpk.ro/NXjHmyP7'
};
var ROOT=document.getElementById('bs-app');
var $=function(s){var el=ROOT?ROOT.querySelector(s):null;if(!el)if(window.console)console.warn('[bill-split] 找不到元素',s);return el||document.createElement('span')};
if(!ROOT){if(window.console)console.warn('[bill-split] 找不到 #bs-app，工具未啟動');return}
/* 注意：WordPress 會把「和號」轉成 HTML 代碼，所以程式裡一律用 String.fromCharCode(38) 產生 */
var AMP=String.fromCharCode(38);
var ESCMAP={'<':AMP+'lt;','>':AMP+'gt;','"':AMP+'quot;',"'":AMP+'#39;'};ESCMAP[AMP]=AMP+'amp;';
var ESCRE=new RegExp('['+AMP+'<>"\']','g');
function esc(s){return String(s).replace(ESCRE,function(c){return ESCMAP[c]})}

/* ▼ 介面語言：中文靜態文字直接取自頁面 HTML（SEO 以中文為主），這裡放英文、日文與動態文字 */
var I18N={
zh:{
"rm":"移除",
"memHint":"先新增至少兩個人（記得把自己也加進來）。",
"svcNone":"不收",
"payNone":"各自付，不用轉帳",
"freeHint":"新增名單後可以選。",
"whoHint":"先在上面新增一起吃飯的人。",
"shareAll":"全桌共享",
"selNone":"全部取消",
"bAddItem":"＋ 加入品項",
"bUpdate":"更新品項",
"whoUn":"尚未指定誰點的（暫時全桌平分）",
"whoAll":"全桌共享",
"whoSplit":"{l} 平分",
"sep":"、",
"itemsEmpty":"還沒有品項",
"itemsEmptyS":"輸入品項、單價，點選誰點的，再按「加入品項」",
"unbar":"有 {n} 個品項還沒指定誰點的，目前先由全桌平分。",
"bNext":"開始指定",
"itemN":"品項 {n}",
"itemDef":"品項",
"itemsSum":"共 {n} 項，未含服務費",
"fabPer":"{n} 人・每人約 {v}",
"fabNone":"還沒開始記帳",
"resNeed2":"新增至少兩個人，再記下點了什麼，這裡會算出每個人要付多少。",
"resEmptyItem":"加入第一個品項後，這裡會即時算出每個人要付多少。",
"resEmptyEven":"輸入帳單總額後，這裡會算出每個人要付多少。",
"sTotal":"帳單總額",
"sAvg":"平均每人",
"sPayers":"人要付",
"feeSvc":"服務費 {p}% {v}",
"feeDc":"折扣 −{v}",
"feeLine":"品項 {v}＋{l}",
"billGapLow":"和帳單總額 {b} 相差 {d}，可能漏記品項，或服務費比例不同。",
"billGapHigh":"和帳單總額 {b} 相差 {d}，可能多記了品項，或帳單已含折扣。",
"billOk":"和帳單總額 {b} 一致。",
"rdMore":"取整後合計 {s}，比帳單多 {d}（歸先結帳的人）。",
"rdLess":"取整後合計 {s}，比帳單少 {d}（先結帳的人自行吸收）。",
"allGot":"{n} 已經收齊 {k} 個人的錢了！",
"progGot":"已收 <b>{a}</b>／{b} 人",
"progLeft":"還差 <b>{v}</b>",
"stPaidV":"✓ 已付款",
"stLeftV":"還沒付",
"stPaidO":"✓ 已收款",
"bUnmark":"取消標記",
"stLeftO":"還沒收到",
"bMark":"收到了，打勾",
"noTr":"不需要轉帳！",
"noPayer":"還沒選誰先結帳，以下是每個人各自要付的金額。",
"perPerson":"每人明細",
"tagPay":"先結帳",
"tagFree":"不用付",
"tagPaid":"已付",
"shareK":"（{k} 人分）",
"adjSvc":"服務費分攤",
"adjSvcDc":"服務費與折扣分攤",
"evenLine":"總額平分",
"freeBy":"由其他人分擔",
"freeAdd":"分擔不用付的人",
"dupe":"「{n}」已經在名單中",
"hasItems":"{n} 有點餐紀錄，請先修改相關品項",
"errNeed2":"請先新增至少兩個人",
"errPrice":"請輸入單價",
"errWho":"請點選誰點的，大家一起吃就按「全桌共享」",
"tNext":"下一項：{n}，點選誰點的",
"tAdded":"已加入：{n}",
"tAllDone":"全部指定完成！",
"tUpdated":"已更新",
"tDeleted":"已刪除品項",
"photoBtn":"拍帳單／選照片",
"photoAgain":"換一張照片",
"photoNote":"用手機內建的文字辨識複製帳單文字，貼上後品名和價格會自動變成品項；也可以拍照放在這裡對照輸入。照片和文字都只在你的手機上處理，不會上傳。",
"photoNote2":"點照片可以放大。照片只留在這支手機，不會上傳。",
"xPh":"把帳單文字貼在這裡，例如：\n牛肉麵 180\n滷味拼盤 x2 240\n服務費 10%\n合計 462",
"xOk":"加入品項",
"xNone":"還沒找到「品名＋價格」的行，請確認貼上的是帳單文字。",
"xSvc":"套用服務費 {p}%",
"xDc":"折扣",
"xTot":"帳單總額（填入核對欄）",
"xCount":"找到 {n} 個品項，合計 {v}",
"xOkN":"加入 {n} 個品項（{v}）",
"xPasteHint":"請長按上面的輸入框，選「貼上」",
"xNoneSel":"沒有勾選任何品項",
"xAddedNext":"已加入 {n} 個品項，接著點選「{i}」是誰點的",
"xAddedNoMem":"已加入 {n} 個品項，新增名單後再指定誰點的",
"tplLoaded":"已載入範例：{t}",
"askTplT":"載入範例？",
"askTplP":"載入範例會取代目前的帳（會先自動備份，可以按「還原上一筆帳」找回）。",
"bLoadTpl":"載入範例",
"askResetT":"清空重新開始？",
"askResetP":"目前的帳會先自動備份，可以按「還原上一筆帳」找回。",
"bClear":"清空",
"tCleared":"已清空",
"tRestored":"已還原上一筆帳",
"rtHead":"【{t}】分帳結果",
"rtDefault":"聚餐",
"rtTotal":"帳單總額：{v}",
"rtSvc":"（含服務費 {p}%）",
"rtEven":"（總額平分）",
"rtPayer":"由 {n} 先結帳，請轉帳：",
"rtLine":"・{f} → {t}：{v}",
"rtPaidMark":"（已付 ✓）",
"rtNoTr":"・不需要轉帳",
"rtProg":"已收 {a}／{b} 人，還沒付：{l}",
"rtAll":"全部收齊了，謝謝大家！",
"rtDue":"・{n}：{v}",
"rtFree":"（{l} 不用付）",
"rtLink":"明細：",
"rNeed2":"先新增至少兩個人",
"rNeedItem":"先加入品項再分享吧",
"rNeedTotal":"先輸入帳單總額",
"shareTitle":"{t} 分帳",
"linkCopied":"連結已複製，貼到 LINE 群組給大家吧",
"copyFailLink":"複製失敗，請改按「複製結算文字」",
"textCopied":"結算文字已複製",
"copyFail":"複製失敗",
"tPaidLeft":"{n} 已付款。按「分享結果給大家」更新群組，就不會再催到他",
"tPaidAll":"全部收齊了！再分享一次讓大家知道",
"tUnpaid":"已取消 {n} 的付款標記",
"ownCopied":"發起人專用連結已複製：請自己保存，不要傳到群組",
"roTitle":"《{t}》的分帳結果（只能查看）",
"thanks":"太好了！下次結帳直接從桌面打開",
"urlCopied":"網址已複製，貼給朋友吧",
"toolText":"聚餐分帳推薦這個免費工具：拍帳單、點選誰點了什麼，服務費自動按比例分，壽星也能設定不用付。",
"toolTitle":"聚餐分帳計算機",
"toolCopied":"已複製推薦文字＋網址",
"badLink":"連結無法讀取，已開啟你自己的帳",
"ownLatest":"這是你發起的帳，顯示的是最新版本",
"ownClaimed":"已設定為發起人，這支手機也可以編輯了",
"ownOpened":"已開啟你發起的帳",
"askOwnT":"開啟你發起的帳？",
"askOwnP":"這是《{t2}》，開啟後會取代目前的《{t1}》。目前的帳會先自動備份，之後可以按「還原上一筆帳」找回。",
"bOpenThis":"開啟這筆帳",
"bKeepCur":"保留目前的帳",
"tKeptCur":"已保留目前的帳",
"untitled":"未命名",
"tipAsk":"",
"tipBtn":"",
"tpl":{"dinner": {"t": "週五聚餐（範例）", "m": ["小明", "阿華", "小美", "阿傑"], "d": ["肋眼牛排", "青醬義大利麵", "松露燉飯", "起司漢堡", "松露薯條", "生啤酒"]}, "birthday": {"t": "小美生日燒肉（範例）", "m": ["小明", "阿華", "小美", "阿傑", "阿芳"], "d": ["雙人燒肉套餐", "雙人燒肉套餐", "單人燒肉套餐", "生日蛋糕", "啤酒塔"]}, "ktv": {"t": "KTV 包廂（範例）", "m": ["小明", "阿華", "小美", "阿傑", "阿芳"], "d": []}, "drinks": {"t": "下午茶飲料團購（範例）", "m": ["小明", "阿華", "小美", "阿傑"], "d": ["珍珠奶茶", "四季春青茶", "楊枝甘露", "紅茶拿鐵", "外送費"]}, "rent": {"t": "9 月水電網路（範例）", "m": ["小明", "阿華", "小美"], "d": []}}
},
en:{
"kick":"Everyday tool · Updated 2026-09-25",
"h2":"<span class='hl'>Bill Splitter</span>: paste the receipt, tap who ordered what, and see what everyone owes",
"lead":"<strong>In short:</strong> a free tool for splitting a restaurant bill. Log each dish and tap who ordered it. Shared dishes are split evenly, and <strong>the service charge and discounts are shared in proportion to what each person ordered</strong>. You can also let the birthday person eat for free. Share the result as a link or text so everyone can pay back whoever covered the bill.",
"pills":"<span>By item or split evenly</span><span>Proportional service charge</span><span>Birthday person pays nothing</span><span>Paste a receipt to add items</span><a href='#bs-install'>Add to home screen ↓</a>",
"roP":"Only the person who started this bill can edit it. Payment status reflects the latest link they shared.",
"roBack":"Back to my own bill",
"tplL":"Common situations — tap to see an example:",
"tpl_dinner":"<b>Dinner with friends</b><small>Own dishes + shared plates</small>",
"tpl_birthday":"<b>Birthday dinner</b><small>Birthday person eats free</small>",
"tpl_ktv":"<b>Karaoke room</b><small>Split the total evenly</small>",
"tpl_drinks":"<b>Group drink order</b><small>Share the delivery fee</small>",
"tpl_rent":"<b>Shared utilities</b><small>Split every month</small>",
"c1":"Who's eating?",
"lTitle":"Name",
"pTitle":"e.g. Friday BBQ night",
"lCur":"Currency",
"lName":"Name",
"pName":"Enter names (comma-separated for several)",
"bAdd":"+ Add",
"c2":"What was ordered?",
"aModes":"Split method",
"mItem":"Split by item",
"mEven":"Split evenly",
"aPhoto":"Receipt photo",
"bXopen":"Paste receipt text to add items",
"bPrm":"Remove photo",
"lItem":"Item",
"pItem":"e.g. Ribeye steak",
"lPrice":"Price",
"lQty":"Qty",
"aQm":"Decrease quantity",
"aQp":"Increase quantity",
"lWho":"Who ordered it? (pick several to split)",
"bDel":"Delete",
"bCancel":"Cancel",
"lTotal":"Bill total (incl. service charge)",
"pTotal":"e.g. 3600",
"evenNote":"The total is split among everyone who pays. Set a birthday person or guest in the next step.",
"c3":"Fees and payment",
"lSvc":"Service charge",
"pSvcin":"Custom %",
"aSvcin":"Custom service charge percentage",
"lDc":"Discount or coupon (amount)",
"lBill":"Total on the receipt (optional, to double-check)",
"pBill":"e.g. 3280",
"lFree":"Who doesn't pay? (birthday person, guest)",
"lPay":"Who paid the bill? (everyone pays them back)",
"lRd":"Rounding",
"rdX":"Exact (most precise)",
"rdR10":"Round to the nearest 10",
"rdC10":"Round up to 10 (the payer never loses out)",
"bRestore":"Restore previous bill",
"bReset":"Clear and start over",
"c4":"What everyone owes",
"bShare":"Share with the group",
"bCopy":"Copy summary",
"ownP":"<b>Only you (the organizer) can edit this bill.</b> Friends who open the link can only view it. When someone pays you, tap “Got it” above, then “Share with the group” so everyone can see who has paid.",
"bOwnLink":"Switching phones? Copy your organizer link",
"privacy":"Your bill lives only in your browser and in the share link. Receipt photos are never uploaded or added to the link.",
"c5":"Planning the next meal? Check these deals",
"klook_b":"Restaurant and buffet deals",
"klook_s":"Buffets, afternoon tea and view restaurants, often discounted",
"klook_e":"See dining deals →",
"kkday_b":"Food experiences and vouchers",
"kkday_s":"Themed restaurants, cooking classes, food tours",
"kkday_e":"Find food experiences →",
"disc":"These are affiliate links: I may earn a small commission at no extra cost to you. — Zoe",
"artnote":"The how-to guide and FAQ on this page are in Chinese. Tap 中文 at the top to read them.",
"insH":"Add the bill splitter to your home screen for next time",
"insP":"Once added, it opens like an app from your home screen — nothing to download, no storage used. Open it when the bill arrives.",
"insTabs":"Choose your device",
"tabPc":"Computer",
"bPwa":"Install to home screen in one tap",
"pIos":"<p class='os-t'>iPhone: add to Home Screen (Safari)</p><ol class='steps'><li>Open this page in <strong>Safari</strong></li><li>Tap the <strong>Share</strong> icon next to the address bar (a square with an up arrow; on newer iOS, tap “⋯” first)</li><li>Scroll down and tap <strong>“Add to Home Screen”</strong></li><li>Rename it if you like, then tap <strong>“Add”</strong></li></ol><p class='os-t'>iPhone: add to Favorites</p><ol class='steps'><li>Tap the <strong>Share</strong> icon again</li><li>Tap <strong>“Add to Favorites”</strong> — it will show up on Safari's start page</li></ol>",
"pIosC":"<p class='os-t'>iPhone: add to Home Screen (Chrome)</p><ol class='steps'><li>Open this page in <strong>Chrome</strong></li><li>Tap the <strong>Share</strong> icon on the right of the address bar (or tap “⋯” at the bottom right, then “Share”)</li><li>Scroll down and tap <strong>“Add to Home Screen”</strong></li><li>Tap <strong>“Add”</strong> — the icon appears on your home screen</li></ol><p class='os-t'>iPhone: add a Chrome bookmark</p><ol class='steps'><li>Tap <strong>“⋯”</strong> at the bottom right</li><li>Tap <strong>“Add to Bookmarks”</strong> (shown as a ☆ in some versions)</li></ol><p class='note'>“Add to Home Screen” in Chrome needs iOS 16.4 or later. If you don't see it, do it once in Safari.</p>",
"pAnd":"<p class='os-t'>Android: add to home screen (Chrome)</p><ol class='steps'><li>Open this page in <strong>Chrome</strong></li><li>Tap the <strong>“⋮”</strong> menu at the top right</li><li>Tap <strong>“Add to home screen”</strong>, then <strong>“Add”</strong> or <strong>“Create shortcut”</strong></li></ol><p class='os-t'>Android: bookmark it</p><ol class='steps'><li>Tap <strong>“⋮”</strong> at the top right</li><li>Tap the <strong>☆ star</strong> in the top row</li></ol><p class='note'>Samsung Internet: tap “≡” at the bottom → “Add page to” → “Home screen”.</p>",
"pPc":"<p class='os-t'>Computer: bookmark it</p><ol class='steps'><li>Press <strong>Ctrl+D</strong> (Windows) or <strong>⌘+D</strong> (Mac)</li><li>Save it to your bookmarks bar for one-click access</li></ol>",
"insNote":"For security, websites can't add themselves for you — the steps above take about 10 seconds.",
"bDone":"Done, I added it",
"invite":"<strong>Find it useful?</strong> Share it with the friends you eat out with — no more passing a calculator around the table.",
"bTShare":"Share with friends",
"bLine":"Send via LINE",
"bTCopy":"Copy link",
"bRes":"Results",
"bAddShort":"+ Add item",
"aClose":"Close",
"xTitle":"Paste receipt text",
"howto":"<summary>How do I copy text from a receipt photo?</summary><div><p><strong>iPhone:</strong> open the receipt in Photos, tap the Live Text icon at the bottom right (or press and hold the text) → Select All → Copy.</p><p><strong>Android:</strong> open the receipt in Google Photos, tap Lens → Text → Select all → Copy text.</p><p>You can also point your camera at the receipt and tap the text frame when it appears.</p></div>",
"lXtext":"Receipt text",
"bXpaste":"Paste from clipboard",
"xHint":"Untick anything that's wrong. After adding, tap an item to edit it and choose who ordered it.",
"rm":"Remove",
"memHint":"Add at least two people (include yourself).",
"svcNone":"None",
"payNone":"Everyone pays their own",
"freeHint":"Add people first.",
"whoHint":"Add the people you're eating with above first.",
"shareAll":"Whole table",
"selNone":"Clear all",
"bAddItem":"+ Add item",
"bUpdate":"Update item",
"whoUn":"Not assigned yet (split by everyone for now)",
"whoAll":"Whole table",
"whoSplit":"split by {l}",
"sep":", ",
"itemsEmpty":"No items yet",
"itemsEmptyS":"Enter an item and price, tap who ordered it, then tap “Add item”",
"unbar":"{n} item(s) not assigned yet — split by everyone for now.",
"bNext":"Assign now",
"itemN":"Item {n}",
"itemDef":"Item",
"itemsSum":"{n} item(s), before service charge",
"fabPer":"{n} people · about {v} each",
"fabNone":"Nothing added yet",
"resNeed2":"Add at least two people and what was ordered, and each person's share appears here.",
"resEmptyItem":"Add the first item and each person's share appears here instantly.",
"resEmptyEven":"Enter the bill total and each person's share appears here.",
"sTotal":"Bill total",
"sAvg":"Per person",
"sPayers":"paying",
"feeSvc":"service {p}% {v}",
"feeDc":"discount −{v}",
"feeLine":"Items {v} + {l}",
"billGapLow":"{d} off from the receipt total of {b} — an item may be missing, or the service charge is different.",
"billGapHigh":"{d} off from the receipt total of {b} — an item may be counted twice, or the receipt already includes a discount.",
"billOk":"Matches the receipt total of {b}.",
"rdMore":"After rounding the total is {s}, {d} more than the bill (goes to whoever paid).",
"rdLess":"After rounding the total is {s}, {d} less than the bill (whoever paid covers it).",
"allGot":"{n} has been paid back by all {k}!",
"progGot":"<b>{a}</b> of {b} paid",
"progLeft":"<b>{v}</b> to go",
"stPaidV":"✓ Paid",
"stLeftV":"Not paid yet",
"stPaidO":"✓ Received",
"bUnmark":"Undo",
"stLeftO":"Not received yet",
"bMark":"Got it ✓",
"noTr":"No transfers needed!",
"noPayer":"No one is set as the payer yet, so here is what each person owes.",
"perPerson":"By person",
"tagPay":"Paid bill",
"tagFree":"Free",
"tagPaid":"Paid",
"shareK":" (split {k} ways)",
"adjSvc":"Service charge share",
"adjSvcDc":"Service charge and discount share",
"evenLine":"Even share of the total",
"freeBy":"Covered by others",
"freeAdd":"Share of free diners",
"dupe":"“{n}” is already on the list",
"hasItems":"{n} has ordered items — edit those first",
"errNeed2":"Add at least two people first",
"errPrice":"Enter a price",
"errWho":"Tap who ordered it, or “Whole table” if everyone shared",
"tNext":"Next: {n} — tap who ordered it",
"tAdded":"Added: {n}",
"tAllDone":"All items assigned!",
"tUpdated":"Updated",
"tDeleted":"Item deleted",
"photoBtn":"Take or choose a photo",
"photoAgain":"Choose another photo",
"photoNote":"Copy the receipt text with your phone's built-in text recognition and paste it — names and prices become items automatically. You can also keep a photo here for reference. Photos and text stay on your phone and are never uploaded.",
"photoNote2":"Tap the photo to enlarge it. It stays on this phone and is never uploaded.",
"xPh":"Paste the receipt text here, e.g.\nBurger 12.50\nFries x2 9.00\nService 10%\nTotal 23.65",
"xOk":"Add items",
"xNone":"No “item + price” lines found yet. Make sure you pasted the receipt text.",
"xSvc":"Apply service charge / tax / tip {p}%",
"xDc":"Discount",
"xTot":"Bill total (for checking)",
"xCount":"Found {n} item(s), {v} in total",
"xOkN":"Add {n} item(s) ({v})",
"xPasteHint":"Press and hold the box above, then choose “Paste”",
"xNoneSel":"No items selected",
"xAddedNext":"Added {n} item(s). Now tap who ordered “{i}”",
"xAddedNoMem":"Added {n} item(s). Add people, then assign who ordered what",
"tplLoaded":"Sample loaded: {t}",
"askTplT":"Load the sample?",
"askTplP":"This replaces your current bill. It's backed up first — tap “Restore previous bill” to get it back.",
"bLoadTpl":"Load sample",
"askResetT":"Clear and start over?",
"askResetP":"Your current bill is backed up first — tap “Restore previous bill” to get it back.",
"bClear":"Clear",
"tCleared":"Cleared",
"tRestored":"Previous bill restored",
"rtHead":"[{t}] Bill split",
"rtDefault":"Dinner",
"rtTotal":"Bill total: {v}",
"rtSvc":" (incl. {p}% service)",
"rtEven":" (split evenly)",
"rtPayer":"{n} paid the bill. Please pay back:",
"rtLine":"• {f} → {t}: {v}",
"rtPaidMark":" (paid ✓)",
"rtNoTr":"• No transfers needed",
"rtProg":"{a} of {b} paid. Still to pay: {l}",
"rtAll":"Everyone has paid — thanks!",
"rtDue":"• {n}: {v}",
"rtFree":"({l} pays nothing)",
"rtLink":"Details: ",
"rNeed2":"Add at least two people first",
"rNeedItem":"Add some items before sharing",
"rNeedTotal":"Enter the bill total first",
"shareTitle":"{t} — bill split",
"linkCopied":"Link copied — paste it in your group chat",
"copyFailLink":"Copy failed — try “Copy summary” instead",
"textCopied":"Summary copied",
"copyFail":"Copy failed",
"tPaidLeft":"{n} has paid. Tap “Share with the group” so nobody chases them again",
"tPaidAll":"Everyone has paid! Share once more to let the group know",
"tUnpaid":"Removed {n}'s paid mark",
"ownCopied":"Organizer link copied — keep it to yourself, don't post it in the group",
"roTitle":"“{t}” — shared bill (view only)",
"thanks":"Nice! Open it from your home screen next time",
"urlCopied":"Link copied — send it to a friend",
"toolText":"A free bill splitter: paste the receipt, tap who ordered what, and the service charge is shared fairly. The birthday person can even eat free.",
"toolTitle":"Bill Splitter",
"toolCopied":"Text and link copied",
"badLink":"Couldn't read that link — opened your own bill",
"ownLatest":"This is your bill — showing the latest version",
"ownClaimed":"You're set as the organizer — you can edit on this phone too",
"ownOpened":"Opened your bill",
"askOwnT":"Open your bill?",
"askOwnP":"This is “{t2}”. Opening it replaces your current “{t1}”, which is backed up first — tap “Restore previous bill” to get it back.",
"bOpenThis":"Open this bill",
"bKeepCur":"Keep my current bill",
"tKeptCur":"Kept your current bill",
"untitled":"Untitled",
"tipAsk":"Prefer English?",
"tipBtn":"Switch",
"cur":{"TWD": "Taiwan dollar", "JPY": "Japanese yen", "KRW": "Korean won", "USD": "US dollar", "HKD": "Hong Kong dollar", "CNY": "Chinese yuan", "SGD": "Singapore dollar", "THB": "Thai baht", "MYR": "Malaysian ringgit", "VND": "Vietnamese dong", "EUR": "Euro", "GBP": "British pound", "AUD": "Australian dollar"},
"tpl":{"dinner": {"t": "Friday dinner (sample)", "m": ["Alex", "Ben", "Chloe", "Dan"], "d": ["Ribeye steak", "Pesto pasta", "Truffle risotto", "Cheeseburger", "Truffle fries", "Draft beer"]}, "birthday": {"t": "Chloe's birthday BBQ (sample)", "m": ["Alex", "Ben", "Chloe", "Dan", "Emma"], "d": ["BBQ set for two", "BBQ set for two", "BBQ set for one", "Birthday cake", "Beer tower"]}, "ktv": {"t": "Karaoke room (sample)", "m": ["Alex", "Ben", "Chloe", "Dan", "Emma"], "d": []}, "drinks": {"t": "Afternoon bubble tea run (sample)", "m": ["Alex", "Ben", "Chloe", "Dan"], "d": ["Bubble milk tea", "Four Seasons oolong", "Mango pomelo sago", "Black tea latte", "Delivery fee"]}, "rent": {"t": "September utilities (sample)", "m": ["Alex", "Ben", "Chloe"], "d": []}}
},
ja:{
"kick":"生活ツール・2026-09-25 更新",
"h2":"<span class='hl'>割り勘</span>計算機：レシートを貼り付けて、誰が何を頼んだかタップするだけで一人あたりの金額がわかる",
"lead":"<strong>ひとことで：</strong>食事代を割り勘する無料ツールです。料理ごとに誰が頼んだかをタップすると、シェアした料理は均等に割り、<strong>サービス料や割引は注文額に応じて按分</strong>します。誕生日の人を支払いなしにする設定もできます。結果はリンクやテキストで共有して、立て替えた人に送金してもらいましょう。",
"pills":"<span>品目ごと／均等割り</span><span>サービス料は按分</span><span>誕生日の人は支払いなし</span><span>レシートを貼って自動入力</span><a href='#bs-install'>ホーム画面に追加 ↓</a>",
"roP":"編集できるのはこの割り勘を作成した人だけです。支払い状況は作成者が最後に共有したリンクの内容です。",
"roBack":"自分の割り勘に戻る",
"tplL":"よくあるシーン（タップで例を表示）：",
"tpl_dinner":"<b>友だちと食事</b><small>各自の注文＋シェア料理</small>",
"tpl_birthday":"<b>誕生日会</b><small>主役は支払いなし</small>",
"tpl_ktv":"<b>カラオケ</b><small>総額を均等割り</small>",
"tpl_drinks":"<b>ドリンクまとめ注文</b><small>配送料はみんなで</small>",
"tpl_rent":"<b>光熱費のシェア</b><small>毎月均等割り</small>",
"c1":"誰と食べた？",
"lTitle":"名前",
"pTitle":"例：金曜の焼肉",
"lCur":"通貨",
"lName":"名前",
"pName":"名前を入力（カンマ区切りで複数可）",
"bAdd":"＋ 追加",
"c2":"何を頼んだ？",
"aModes":"割り方",
"mItem":"品目ごとに割る",
"mEven":"均等割り",
"aPhoto":"レシート写真",
"bXopen":"レシートの文字を貼って自動入力",
"bPrm":"写真を削除",
"lItem":"品目",
"pItem":"例：リブロースステーキ",
"lPrice":"単価",
"lQty":"数量",
"aQm":"数量を減らす",
"aQp":"数量を増やす",
"lWho":"誰が頼んだ？（複数選ぶと均等割り）",
"bDel":"削除",
"bCancel":"キャンセル",
"lTotal":"合計金額（サービス料込み）",
"pTotal":"例：3600",
"evenNote":"合計は支払う人で均等に割ります。誕生日の人やおごられる人は次のステップで設定できます。",
"c3":"料金と支払い",
"lSvc":"サービス料",
"pSvcin":"指定 %",
"aSvcin":"サービス料の割合を指定",
"lDc":"割引・クーポン（金額）",
"lBill":"レシートの合計（任意・照合用）",
"pBill":"例：3280",
"lFree":"支払わない人は？（誕生日の人・おごられる人）",
"lPay":"誰が立て替えた？（ほかの人はその人に送金）",
"lRd":"端数処理",
"rdX":"そのまま（最も正確）",
"rdR10":"10単位で四捨五入",
"rdC10":"10単位で切り上げ（立て替えた人が損しない）",
"bRestore":"前の割り勘に戻す",
"bReset":"リセットして最初から",
"c4":"一人あたりの金額",
"bShare":"結果をみんなに共有",
"bCopy":"精算テキストをコピー",
"ownP":"<b>この割り勘を編集できるのは作成者のあなただけです。</b>リンクを開いた友だちは閲覧のみです。送金を受け取ったら上の「受け取った」をタップし、「結果をみんなに共有」を押すと、誰が支払い済みかがグループに伝わります。",
"bOwnLink":"機種変更後も編集したい？作成者用リンクをコピー",
"privacy":"データはブラウザと共有リンクの中だけに保存されます。レシート写真はアップロードされず、リンクにも含まれません。",
"c5":"次の食事はお得に",
"klook_b":"レストラン・ビュッフェ割引",
"klook_s":"ビュッフェ、アフタヌーンティー、眺めのいいレストランのクーポン",
"klook_e":"グルメ割引を見る →",
"kkday_b":"グルメ体験・食事券",
"kkday_s":"テーマレストラン、料理教室、グルメツアー",
"kkday_e":"グルメ体験を探す →",
"disc":"アフィリエイトリンクを含みます。リンク経由でご購入いただくと少額の報酬を受け取りますが、お支払い額は変わりません。— Zoe",
"artnote":"このページの使い方とよくある質問は中国語のみです。上の「中文」で表示できます。",
"insH":"割り勘計算機をホーム画面に追加して、次の食事ですぐ使おう",
"insP":"ホーム画面に追加すると、アプリのように開けます。ダウンロード不要で容量もとりません。会計のときにすぐ使えます。",
"insTabs":"端末を選択",
"tabPc":"パソコン",
"bPwa":"ワンタップでホーム画面に追加",
"pIos":"<p class='os-t'>iPhone：ホーム画面に追加（Safari）</p><ol class='steps'><li><strong>Safari</strong> でこのページを開く</li><li>アドレスバー横の<strong>「共有」</strong>アイコンをタップ（四角と上向き矢印。新しい iOS では先に「⋯」をタップ）</li><li>下にスクロールして<strong>「ホーム画面に追加」</strong>をタップ</li><li>名前を変更して<strong>「追加」</strong>をタップ</li></ol><p class='os-t'>iPhone：お気に入りに追加</p><ol class='steps'><li>同じく<strong>「共有」</strong>アイコンをタップ</li><li><strong>「お気に入りに追加」</strong>をタップすると、Safari の新規タブからすぐ開けます</li></ol>",
"pIosC":"<p class='os-t'>iPhone：ホーム画面に追加（Chrome）</p><ol class='steps'><li><strong>Chrome</strong> でこのページを開く</li><li>アドレスバー右側の<strong>「共有」</strong>アイコンをタップ（見つからない場合は右下の「⋯」→「共有」）</li><li>下にスクロールして<strong>「ホーム画面に追加」</strong>をタップ</li><li><strong>「追加」</strong>をタップするとホーム画面にアイコンが表示されます</li></ol><p class='os-t'>iPhone：Chrome のブックマークに追加</p><ol class='steps'><li>右下の<strong>「⋯」</strong>をタップ</li><li><strong>「ブックマークに追加」</strong>をタップ（☆アイコンの場合もあります）</li></ol><p class='note'>Chrome の「ホーム画面に追加」は iOS 16.4 以降が必要です。表示されない場合は Safari で一度追加してください。</p>",
"pAnd":"<p class='os-t'>Android：ホーム画面に追加（Chrome）</p><ol class='steps'><li><strong>Chrome</strong> でこのページを開く</li><li>右上の<strong>「⋮」</strong>メニューをタップ</li><li><strong>「ホーム画面に追加」</strong>をタップし、<strong>「追加」</strong>または<strong>「ショートカットを作成」</strong>を選択</li></ol><p class='os-t'>Android：ブックマークに追加</p><ol class='steps'><li>右上の<strong>「⋮」</strong>をタップ</li><li>上段の<strong>☆</strong>をタップ</li></ol><p class='note'>Samsung Internet：下部の「≡」→「ページを追加」→「ホーム画面」。</p>",
"pPc":"<p class='os-t'>パソコン：ブックマークに追加</p><ol class='steps'><li>Windows は <strong>Ctrl＋D</strong>、Mac は <strong>⌘＋D</strong></li><li>保存先を「ブックマークバー」にすると、ワンクリックで開けます</li></ol>",
"insNote":"セキュリティ上、ウェブサイトから自動で追加することはできません。上の手順なら約10秒で完了します。",
"bDone":"追加しました",
"invite":"<strong>便利だと思ったら</strong>、よく一緒に食事する友だちにシェアしてください。会計のたびに電卓をたたく必要がなくなります。",
"bTShare":"友だちにシェア",
"bLine":"LINE で送る",
"bTCopy":"URLをコピー",
"bRes":"結果を見る",
"bAddShort":"＋ 追加",
"aClose":"閉じる",
"xTitle":"レシートの文字を貼り付け",
"howto":"<summary>レシート写真から文字をコピーするには？</summary><div><p><strong>iPhone：</strong>「写真」でレシートを開き、右下の「テキスト認識表示」アイコンをタップ（または文字を長押し）→「すべてを選択」→「コピー」。</p><p><strong>Android：</strong>Google フォトでレシートを開き、「レンズ」→「テキスト」→「すべて選択」→「テキストをコピー」。</p><p>カメラをレシートに向けて、文字の枠が出たらタップしてコピーすることもできます。</p></div>",
"lXtext":"レシートの文字",
"bXpaste":"クリップボードから貼り付け",
"xHint":"不要な行はチェックを外せます。追加後に品目をタップすると修正でき、誰が頼んだかを選べます。",
"rm":"削除",
"memHint":"2人以上追加してください（自分も忘れずに）。",
"svcNone":"なし",
"payNone":"各自で支払う（送金なし）",
"freeHint":"先に名前を追加してください。",
"whoHint":"先に上で一緒に食べる人を追加してください。",
"shareAll":"全員でシェア",
"selNone":"すべて解除",
"bAddItem":"＋ 品目を追加",
"bUpdate":"品目を更新",
"whoUn":"未指定（いまは全員で割り勘）",
"whoAll":"全員でシェア",
"whoSplit":"{l}で割り勘",
"sep":"、",
"itemsEmpty":"まだ品目がありません",
"itemsEmptyS":"品目と単価を入力し、誰が頼んだかを選んで「品目を追加」",
"unbar":"誰が頼んだか未指定の品目が {n} 件あります。いまは全員で割っています。",
"bNext":"指定する",
"itemN":"品目 {n}",
"itemDef":"品目",
"itemsSum":"{n} 品目（サービス料別）",
"fabPer":"{n}人・1人あたり約 {v}",
"fabNone":"まだ記録がありません",
"resNeed2":"2人以上と注文を入力すると、ここに一人あたりの金額が表示されます。",
"resEmptyItem":"最初の品目を追加すると、ここに一人あたりの金額がすぐ表示されます。",
"resEmptyEven":"合計金額を入力すると、ここに一人あたりの金額が表示されます。",
"sTotal":"合計",
"sAvg":"1人あたり",
"sPayers":"人が支払い",
"feeSvc":"サービス料 {p}% {v}",
"feeDc":"割引 −{v}",
"feeLine":"品目 {v}＋{l}",
"billGapLow":"レシートの合計 {b} と {d} 違います。品目の入力漏れか、サービス料の割合が違う可能性があります。",
"billGapHigh":"レシートの合計 {b} と {d} 違います。品目の重複か、レシートに割引が含まれている可能性があります。",
"billOk":"レシートの合計 {b} と一致しています。",
"rdMore":"端数処理後の合計は {s} で、会計より {d} 多くなります（立て替えた人の分）。",
"rdLess":"端数処理後の合計は {s} で、会計より {d} 少なくなります（立て替えた人が負担）。",
"allGot":"{n}さんは{k}人全員から受け取りました！",
"progGot":"<b>{a}</b>／{b}人 受け取り済み",
"progLeft":"残り <b>{v}</b>",
"stPaidV":"✓ 支払い済み",
"stLeftV":"未払い",
"stPaidO":"✓ 受け取り済み",
"bUnmark":"取り消す",
"stLeftO":"未受け取り",
"bMark":"受け取った ✓",
"noTr":"送金は不要です！",
"noPayer":"立て替えた人がまだ選ばれていないため、各自の支払額を表示しています。",
"perPerson":"メンバー別",
"tagPay":"立て替え",
"tagFree":"支払いなし",
"tagPaid":"支払い済み",
"shareK":"（{k}人で割り勘）",
"adjSvc":"サービス料の按分",
"adjSvcDc":"サービス料と割引の按分",
"evenLine":"総額の均等割り",
"freeBy":"ほかの人が負担",
"freeAdd":"支払いなしの人の分",
"dupe":"「{n}」はすでに追加されています",
"hasItems":"{n}さんには注文があります。先に該当する品目を修正してください",
"errNeed2":"先に2人以上追加してください",
"errPrice":"単価を入力してください",
"errWho":"誰が頼んだかを選んでください。みんなで食べたなら「全員でシェア」",
"tNext":"次：{n}（誰が頼んだかを選択）",
"tAdded":"追加しました：{n}",
"tAllDone":"すべて指定できました！",
"tUpdated":"更新しました",
"tDeleted":"品目を削除しました",
"photoBtn":"レシートを撮影／選択",
"photoAgain":"別の写真を選ぶ",
"photoNote":"スマホの文字認識でレシートの文字をコピーして貼り付けると、品名と金額が自動で品目になります。写真を置いて見ながら入力することもできます。写真も文字もスマホの中だけで処理され、アップロードされません。",
"photoNote2":"写真をタップすると拡大できます。写真はこのスマホにだけ残り、アップロードされません。",
"xPh":"ここにレシートの文字を貼り付け。例：\n生ビール x2 1100\n唐揚げ 680\nサービス料 10%\n合計 1958",
"xOk":"品目を追加",
"xNone":"「品名＋金額」の行が見つかりません。レシートの文字を貼り付けたか確認してください。",
"xSvc":"サービス料 {p}% を適用",
"xDc":"割引",
"xTot":"合計金額（照合欄に入力）",
"xCount":"{n} 品目、合計 {v}",
"xOkN":"{n} 品目を追加（{v}）",
"xPasteHint":"上の入力欄を長押しして「ペースト」を選んでください",
"xNoneSel":"品目が選ばれていません",
"xAddedNext":"{n} 品目を追加しました。次に「{i}」を誰が頼んだか選んでください",
"xAddedNoMem":"{n} 品目を追加しました。名前を追加してから、誰が頼んだかを指定してください",
"tplLoaded":"サンプルを読み込みました：{t}",
"askTplT":"サンプルを読み込みますか？",
"askTplP":"現在の割り勘は置き換わります（自動でバックアップされ、「前の割り勘に戻す」で復元できます）。",
"bLoadTpl":"サンプルを読み込む",
"askResetT":"リセットしますか？",
"askResetP":"現在の割り勘は自動でバックアップされ、「前の割り勘に戻す」で復元できます。",
"bClear":"リセット",
"tCleared":"リセットしました",
"tRestored":"前の割り勘に戻しました",
"rtHead":"【{t}】割り勘結果",
"rtDefault":"食事会",
"rtTotal":"合計：{v}",
"rtSvc":"（サービス料 {p}% 込み）",
"rtEven":"（均等割り）",
"rtPayer":"{n}さんが立て替えました。送金してください：",
"rtLine":"・{f} → {t}：{v}",
"rtPaidMark":"（支払い済み ✓）",
"rtNoTr":"・送金は不要",
"rtProg":"{b}人中{a}人が支払い済み。未払い：{l}",
"rtAll":"全員の支払いが済みました。ありがとう！",
"rtDue":"・{n}：{v}",
"rtFree":"（{l}は支払いなし）",
"rtLink":"明細：",
"rNeed2":"先に2人以上追加してください",
"rNeedItem":"品目を追加してから共有しましょう",
"rNeedTotal":"先に合計金額を入力してください",
"shareTitle":"{t} 割り勘",
"linkCopied":"リンクをコピーしました。グループに貼り付けてください",
"copyFailLink":"コピーに失敗しました。「精算テキストをコピー」を使ってください",
"textCopied":"精算テキストをコピーしました",
"copyFail":"コピーに失敗しました",
"tPaidLeft":"{n}さんは支払い済みです。「結果をみんなに共有」でグループに知らせましょう",
"tPaidAll":"全員支払い済みです！もう一度共有してみんなに知らせましょう",
"tUnpaid":"{n}さんの支払い済みを取り消しました",
"ownCopied":"作成者用リンクをコピーしました。自分で保管し、グループには送らないでください",
"roTitle":"「{t}」の割り勘結果（閲覧のみ）",
"thanks":"ありがとうございます！次回はホーム画面から開けます",
"urlCopied":"URLをコピーしました。友だちに送ってください",
"toolText":"食事の割り勘におすすめの無料ツール：レシートを貼って誰が何を頼んだかをタップするだけ。サービス料は按分、誕生日の人は支払いなしにもできます。",
"toolTitle":"割り勘計算機",
"toolCopied":"テキストとURLをコピーしました",
"badLink":"リンクを読み込めませんでした。自分の割り勘を開きます",
"ownLatest":"あなたが作成した割り勘です。最新の内容を表示しています",
"ownClaimed":"作成者として設定しました。このスマホでも編集できます",
"ownOpened":"あなたの割り勘を開きました",
"askOwnT":"あなたの割り勘を開きますか？",
"askOwnP":"これは「{t2}」です。開くと現在の「{t1}」と置き換わります。現在の割り勘は自動でバックアップされ、「前の割り勘に戻す」で復元できます。",
"bOpenThis":"この割り勘を開く",
"bKeepCur":"現在の割り勘を残す",
"tKeptCur":"現在の割り勘を残しました",
"untitled":"無題",
"tipAsk":"日本語で表示しますか？",
"tipBtn":"切り替える",
"cur":{"TWD": "台湾ドル", "JPY": "日本円", "KRW": "韓国ウォン", "USD": "米ドル", "HKD": "香港ドル", "CNY": "人民元", "SGD": "シンガポールドル", "THB": "タイバーツ", "MYR": "マレーシアリンギット", "VND": "ベトナムドン", "EUR": "ユーロ", "GBP": "英ポンド", "AUD": "豪ドル"},
"tpl":{"dinner": {"t": "金曜ディナー（サンプル）", "m": ["たくや", "けん", "ゆい", "さき"], "d": ["リブロースステーキ", "ジェノベーゼ", "トリュフリゾット", "チーズバーガー", "トリュフフライ", "生ビール"]}, "birthday": {"t": "ゆいの誕生日焼肉（サンプル）", "m": ["たくや", "けん", "ゆい", "さき", "はるか"], "d": ["焼肉ペアセット", "焼肉ペアセット", "焼肉ひとりセット", "バースデーケーキ", "ビアタワー"]}, "ktv": {"t": "カラオケ（サンプル）", "m": ["たくや", "けん", "ゆい", "さき", "はるか"], "d": []}, "drinks": {"t": "午後のドリンク注文（サンプル）", "m": ["たくや", "けん", "ゆい", "さき"], "d": ["タピオカミルクティー", "四季春茶", "楊枝甘露", "紅茶ラテ", "配送料"]}, "rent": {"t": "9月の光熱費・ネット（サンプル）", "m": ["たくや", "けん", "ゆい"], "d": []}}
}
};
var LANGS=['zh','en','ja'],LOCALE={zh:'zh-TW',en:'en-US',ja:'ja-JP'},HTMLLANG={zh:'zh-Hant-TW',en:'en',ja:'ja'};
var LS_LANG=null;try{LS_LANG=localStorage.getItem('bs-lang')}catch(e){}
if(LANGS.indexOf(LS_LANG)<0)LS_LANG=null;
var HASH_L=(location.hash.match(new RegExp('[#'+AMP+']l=(zh|en|ja)\\b'))||[])[1]||null;
var IS_SHARED=new RegExp('[#'+AMP+']d=').test(location.hash);
var BROWSER=(function(){var l=String((navigator.languages||[])[0]||navigator.language||'zh').toLowerCase();return l.indexOf('zh')===0?'zh':(l.indexOf('ja')===0?'ja':'en')})();
var LANG=LS_LANG||HASH_L||(IS_SHARED?BROWSER:'zh');
var LANG_SRC=LS_LANG?'saved':(HASH_L?'link':(IS_SHARED?'browser':'default'));
function t(k,v){var d=I18N[LANG],s=(d[k]!==undefined)?d[k]:I18N.zh[k];if(s===undefined)s=k;if(v)Object.keys(v).forEach(function(x){s=String(s).split('{'+x+'}').join(v[x])});return s}
function L(k){var v=I18N[LANG][k];return v!==undefined?v:I18N.zh[k]}
function langHash(){return LANG==='zh'?'':AMP+'l='+LANG}
[].forEach.call(ROOT.querySelectorAll('[data-t]'),function(el){var k=el.getAttribute('data-t');if(I18N.zh[k]===undefined)I18N.zh[k]=el.innerHTML});
[].forEach.call(ROOT.querySelectorAll('[data-tp]'),function(el){var k=el.getAttribute('data-tp');if(I18N.zh[k]===undefined)I18N.zh[k]=el.getAttribute('placeholder')||''});
[].forEach.call(ROOT.querySelectorAll('[data-ta]'),function(el){var k=el.getAttribute('data-ta');if(I18N.zh[k]===undefined)I18N.zh[k]=el.getAttribute('aria-label')||''});
/* ===== 編織日和工具｜GA4 統一追蹤 v1.2 =====
   各工具完全相同，只改最上面三行。規範：tools-ga4-guideline
   注意：整段不含「和號」字元（WordPress 會轉碼導致程式失效），新增程式時請維持 */
var HY_TOOL_ID = 'bill_split';    /* 工具登記表的 tool_id */
var HY_TOOL_ROOT = '#bs-app';  /* 工具最外層的選擇器 */
var HY_TOOL_LANG = function(){ return LANG; };/* 單語工具改成 function(){ return 'zh'; } */

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
        if (typeof v === 'string') v = v.slice(0, 100);   /* GA4 參數值上限 100 字元 */
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
    /* 任何事件 */
    event: send,
    /* 每次載入頁面只送一次 */
    once: function(name, params){ if (sent[name]) return; sent[name] = 1; send(name, params); },
    /* 開始使用：entry = direct／shared／saved */
    start: function(entry){
      if (sent.tool_start) return;
      startAt = Date.now();
      api.once('tool_start', { entry_point: entry || 'direct' });
    },
    /* 第一次得到結果：必須在 start 之後才算 */
    result: function(params){
      if (!sent.tool_start || sent.tool_result) return;
      params = params || {};
      params.duration_sec = Math.round((Date.now() - startAt) / 1000);
      api.once('tool_result', params);
    },
    /* 分享：method 見值域表，type = result／tool */
    share: function(method, type, extra){
      var p = {}, k; extra = extra || {};
      for (k in extra) p[k] = extra[k];
      p.method = method; p.content_type = type;
      send('share', p);
    },
    /* 選填：工具可覆寫，替 cta_click 補參數，例如 destination */
    ctaExtra: null
  };

  function inRoot(t){ if (!t || !t.closest) return null; return t.closest(HY_TOOL_ROOT); }

  /* 第一次在工具區點擊或輸入 → 自動 tool_start（點 CTA 不算；只捲動不算） */
  function autoStart(e){
    if (sent.tool_start) return;
    var t = e.target;
    if (!inRoot(t)) return;
    if (t.closest('[data-cta]')) return;
    api.start('direct');
  }
  document.addEventListener('click', autoStart, true);
  document.addEventListener('input', autoStart, true);

  /* 點任何 [data-cta] → cta_click（與故事頁同一個事件） */
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
/* 範例帳不算 tool_result；cta_click 補上帳的規模 */
function isDemo(){return /（範例）$|\(sample\)$|（サンプル）$/.test(S.t)}
function itemCount(){return S.mode==='item'?S.items.length:0}
hyTool.ctaExtra=function(){return{item_count:itemCount(),people_count:S.m.length,option:S.mode}};

var CUR={TWD:['新台幣','NT$',0],JPY:['日圓','¥',0],KRW:['韓元','₩',0],USD:['美元','US$',2],HKD:['港幣','HK$',1],CNY:['人民幣','CN¥',2],SGD:['新加坡幣','S$',2],THB:['泰銖','฿',0],MYR:['馬幣','RM',2],VND:['越南盾','₫',0],EUR:['歐元','€',2],GBP:['英鎊','£',2],AUD:['澳幣','A$',2]};
var AVC=['#111111','#D9533A','#2F6FD6','#8E5AB5','#C98410','#1F9A8A','#C2417A','#5D6D7E','#6E8F24','#A5602A'];
var KEY='bs-split-v1',PREV=KEY+'-prev';
function newId(){return(Math.random().toString(36).slice(2,8)+Date.now().toString(36).slice(-4))}
function blank(){return{i:newId(),t:'',c:'TWD',m:[],free:[],mode:'item',items:[],total:0,sv:10,dc:0,pay:-1,rd:'x',bill:0,ow:'',paid:[]}}
/* ---------- 發起人：只有建立這筆帳的裝置（或拿到發起人專用連結的裝置）可以修改，其他人打開連結只能查看 ---------- */
var OWN='bs-own';
function hk(s){var a=5381,b=52711,i,c;s=String(s);for(i=0;i!==s.length;i++){c=s.charCodeAt(i);a=((a*33)^c)>>>0;b=((b*31)+c)>>>0}return a.toString(36)+b.toString(36)}
function getOwn(){try{return JSON.parse(localStorage.getItem(OWN)||'{}')||{}}catch(e){return{}}}
function ownKey(id){return getOwn()[id]||''}
function setOwn(id,k){var o=getOwn();o[id]=k;var ks=Object.keys(o);if(ks.length>60)delete o[ks[0]];try{localStorage.setItem(OWN,JSON.stringify(o))}catch(e){}}
function isOwner(L){L=L||S;if(!L.ow)return false;var k=ownKey(L.i);return k?hk(k)===L.ow:false}
function ensureOwner(){if(S.ow)return;var k=newId()+newId();setOwn(S.i,k);S.ow=hk(k)}
var VIEW=false,MINE=null;
function isPaid(i){return S.paid.indexOf(i)>=0}
var S=blank();

function dec(){return(CUR[S.c]||CUR.TWD)[2]}
function curName(c){var m=I18N[LANG].cur;return m?(m[c]||CUR[c][0]):CUR[c][0]}
function fmt(v){var d=dec(),s=(CUR[S.c]||CUR.TWD)[1];return(v<0?'−':'')+s+Math.abs(v).toLocaleString(LOCALE[LANG],{minimumFractionDigits:d,maximumFractionDigits:d})}
function num(v){var n=parseFloat(String(v||'').replace(/[,，\s]/g,''));return n>0?n:0}
function allIdx(){return S.m.map(function(_,i){return i})}
function isFree(i){return S.free.indexOf(i)>=0}

/* ---------- 計算 ---------- */
function compute(){
  var n=S.m.length,sub=[],lines=[],i,itemsTotal=0,svc=0,grand=0,raw=[];
  for(i=0;i<n;i++){sub.push(0);lines.push([])}
  if(S.mode==='item'){
    S.items.forEach(function(it){var amt=it.p*it.q;itemsTotal+=amt;var w=it.w.length?it.w:allIdx();if(!w.length)return;var sh=amt/w.length;
      w.forEach(function(j){if(j<n){sub[j]+=sh;lines[j].push({n:it.n+(it.q>1?' ×'+it.q:''),a:sh,k:w.length})}})});
    svc=itemsTotal*S.sv/100;grand=Math.max(0,itemsTotal+svc-S.dc);
    var ratio=itemsTotal?grand/itemsTotal:0;raw=sub.map(function(v){return v*ratio});
  }else{
    grand=S.total;itemsTotal=grand;raw=sub.map(function(){return n?grand/n:0});
  }
  var payers=allIdx().filter(function(j){return !isFree(j)});if(!payers.length)payers=allIdx();
  var freeSum=0;raw.forEach(function(v,j){if(isFree(j))if(payers.length<n)freeSum+=v});
  var due=raw.map(function(v,j){return(isFree(j)?(payers.length<n?0:v):v+freeSum/payers.length)});
  due=roundAll(due,grand);
  var sum=due.reduce(function(a,b){return a+b},0);
  var tr=[];if(S.pay>=0)if(S.pay<n)due.forEach(function(v,j){if(j!==S.pay)if(v>0)tr.push({f:j,t:S.pay,v:v})});
  return{sub:sub,raw:raw,due:due,grand:grand,svc:svc,itemsTotal:itemsTotal,lines:lines,sum:sum,diff:sum-grand,tr:tr,payers:payers.length,freeSum:freeSum};
}
/* 取整：算到元時，其他人各自四捨五入、零頭由先結帳的人吸收（沒選付款人時用最大餘數法），總和剛好等於帳單；10 元取整則顯示差額 */
function roundAll(due,grand){
  if(S.rd==='r10')return due.map(function(v){return Math.round(v/10)*10});
  if(S.rd==='c10')return due.map(function(v){return v>0?Math.ceil(v/10-1e-9)*10:0});
  var sc=Math.pow(10,dec()),target=Math.round(grand*sc);
  if(S.pay>=0)if(S.pay<due.length){var r=due.map(function(v){return Math.round(v*sc)}),others=0;r.forEach(function(v,j){if(j!==S.pay)others+=v});r[S.pay]=target-others;return r.map(function(v){return v/sc})}
  var fl=due.map(function(v){return Math.floor(v*sc+1e-9)}),left=target-fl.reduce(function(a,b){return a+b},0);
  var order=due.map(function(v,j){return[j,v*sc-fl[j]]}).filter(function(x){return due[x[0]]>0}).sort(function(a,b){return b[1]-a[1]});
  for(var k=0;k<order.length;k++){if(left<=0)break;fl[order[k][0]]++;left--}
  return fl.map(function(v){return v/sc});
}

/* ---------- 分享連結 ---------- */
function pack(){return{v:1,i:S.i,t:S.t,c:S.c,m:S.m,f:S.free,o:S.mode,it:S.items.map(function(it){return[it.n,it.p,it.q,it.w,it.x]}),tt:S.total,sv:S.sv,dc:S.dc,py:S.pay,rd:S.rd,bl:S.bill,ow:S.ow,pd:S.paid}}
function unpack(o){
  var s=blank();if(o.i)s.i=String(o.i).slice(0,24);s.t=String(o.t||'').slice(0,40);s.c=CUR[o.c]?o.c:'TWD';
  s.m=(o.m||[]).map(function(x){return String(x).slice(0,16)}).slice(0,30);var n=s.m.length;
  s.free=(o.f||[]).map(function(x){return x|0}).filter(function(x){return x<n});
  s.mode=o.o==='even'?'even':'item';
  s.items=(o.it||[]).map(function(a){return{n:String(a[0]||'').slice(0,30),p:+a[1]||0,q:Math.max(1,a[2]|0),w:(a[3]||[]).map(function(x){return x|0}).filter(function(x){return x<n}),x:a[4]?String(a[4]):newId()}}).filter(function(it){return it.p>0});
  s.total=+o.tt||0;s.sv=o.sv===undefined?10:Math.max(0,+o.sv||0);s.dc=Math.max(0,+o.dc||0);s.pay=(o.py===undefined)?-1:(o.py|0);if(s.pay>=n)s.pay=-1;
  s.rd=['x','r10','c10'].indexOf(o.rd)>=0?o.rd:'x';s.bill=Math.max(0,+o.bl||0);
  s.ow=o.ow?String(o.ow).slice(0,24):'';s.paid=[];(o.pd||[]).forEach(function(x){x=x|0;if(x>=0)if(x<n)if(s.paid.indexOf(x)<0)s.paid.push(x)});if(s.pay<0)s.paid=[];return s;
}
function b64u(u8){var s='';for(var i=0;i<u8.length;i+=8192)s+=String.fromCharCode.apply(null,u8.subarray(i,i+8192));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function ub64u(s){s=s.replace(/-/g,'+').replace(/_/g,'/');var b=atob(s),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}
async function encode(){var raw=new TextEncoder().encode(JSON.stringify(pack()));
  if('CompressionStream' in window){try{var buf=await new Response(new Blob([raw]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer();return'z'+b64u(new Uint8Array(buf))}catch(e){}}
  return'j'+b64u(raw)}
async function decode(str){var bytes=ub64u(str.slice(1)),txt;
  if(str[0]==='z')txt=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text();else txt=new TextDecoder().decode(bytes);
  return unpack(JSON.parse(txt))}
var TOOL_URL=location.origin+location.pathname;
async function shareUrl(){return TOOL_URL+location.search+'#d='+await encode()+langHash()}

function save(){if(VIEW)return;if(!isOwner())S.ow='';ensureOwner();try{localStorage.setItem(KEY,JSON.stringify(pack()))}catch(e){}}
function load(){try{var x=localStorage.getItem(KEY);if(x){S=unpack(JSON.parse(x));return true}}catch(e){}return false}
function hasData(){return S.mode==='item'?S.items.length>0:S.total>0}
function backup(){try{if(hasData())localStorage.setItem(PREV,JSON.stringify(pack()))}catch(e){}showRestore()}
function showRestore(){var has=false;try{has=!!localStorage.getItem(PREV)}catch(e){}$('#bs-restore').hidden=!has}

var toastT;
function toast(m){var tt=$('#bs-toast');tt.textContent=m;tt.classList.add('on');clearTimeout(toastT);toastT=setTimeout(function(){tt.classList.remove('on')},String(m).length>18?3500:2200)}
function av(i,sz){return'<span class="av" style="background:'+AVC[i%AVC.length]+(sz?';width:'+sz+'px;height:'+sz+'px;font-size:'+(sz*.5)+'px':'')+'">'+esc((S.m[i]||'?').slice(0,1))+'</span>'}
function pick(el,items,isOn){el.innerHTML=items.map(function(it){return'<button type="button" data-v="'+it[0]+'" aria-pressed="'+(isOn(it[0])?'true':'false')+'">'+(it[2]||'')+esc(it[1])+'</button>'}).join('')}

/* ---------- 畫面 ---------- */
var F={w:[],q:1,edit:-1};
function render(){
  if(document.activeElement!==$('#bs-title'))$('#bs-title').value=S.t;
  $('#bs-cur').innerHTML=Object.keys(CUR).map(function(c){return'<option value="'+c+'"'+(c===S.c?' selected':'')+'>'+c+' '+esc(curName(c))+'</option>'}).join('');
  $('#bs-members').innerHTML=S.m.length?S.m.map(function(n,i){return'<span class="mchip">'+av(i)+esc(n)+'<button type="button" data-rm="'+i+'" aria-label="'+esc(t('rm'))+' '+esc(n)+'">×</button></span>'}).join('')
    :'<span class="note" style="margin:0">'+esc(t('memHint'))+'</span>';
  [].forEach.call(ROOT.querySelectorAll('[data-mode]'),function(b){b.setAttribute('aria-pressed',b.dataset.mode===S.mode?'true':'false')});
  $('#bs-itemmode').hidden=S.mode!=='item';$('#bs-evenmode').hidden=S.mode!=='even';$('#bs-feebox').hidden=S.mode!=='item';
  if(document.activeElement!==$('#bs-total'))$('#bs-total').value=S.total||'';
  drawForm();drawItems();
  pick($('#bs-svc'),[[0,t('svcNone')],[5,'5%'],[10,'10%'],[15,'15%']],function(v){return +v===S.sv});
  if(document.activeElement!==$('#bs-svcin'))$('#bs-svcin').value=[0,5,10,15].indexOf(S.sv)>=0?'':S.sv;
  if(document.activeElement!==$('#bs-dc'))$('#bs-dc').value=S.dc||'';
  if(document.activeElement!==$('#bs-bill'))$('#bs-bill').value=S.bill||'';
  pick($('#bs-free'),S.m.map(function(n,i){return[i,n,av(i,20)]}),function(v){return isFree(+v)});
  pick($('#bs-pay'),S.m.map(function(n,i){return[i,n,av(i,20)]}).concat([[-1,t('payNone')]]),function(v){return +v===S.pay});
  $('#bs-rd').value=S.rd;
  if(!S.m.length){$('#bs-free').innerHTML='<span class="note" style="margin:0">'+esc(t('freeHint'))+'</span>';}
  $('#bs-itemcard').hidden=VIEW?S.mode!=='item':false;
  renderResult();
}
function drawForm(){
  pick($('#bs-iwho'),S.m.map(function(n,i){return[i,n,av(i,20)]}),function(v){return F.w.indexOf(+v)>=0});
  if(!S.m.length)$('#bs-iwho').innerHTML='<span class="note" style="margin:0">'+esc(t('whoHint'))+'</span>';
  $('#bs-qv').textContent=F.q;
  $('#bs-iall').textContent=(S.m.length?F.w.length===S.m.length:false)?t('selNone'):t('shareAll');
  $('#bs-iadd').textContent=F.edit>=0?t('bUpdate'):t('bAddItem');
  $('#bs-idel').hidden=F.edit<0;$('#bs-icancel').hidden=F.edit<0;
}
function whoText(w){if(!w.length)return t('whoUn');if(w.length===S.m.length)return t('whoAll');var l=w.map(function(j){return S.m[j]}).join(t('sep'));return w.length>1?t('whoSplit',{l:l}):l}
function drawItems(){
  var box=$('#bs-items');
  if(!S.items.length){box.innerHTML='<div class="empty">'+esc(t('itemsEmpty'))+'<br><small>'+esc(t('itemsEmptyS'))+'</small></div>';return}
  var tot=0;S.items.forEach(function(it){tot+=it.p*it.q});
  var un=S.items.filter(function(it){return !it.w.length}).length;
  box.innerHTML=(un?'<div class="warn unbar"><span>'+esc(t('unbar',{n:un}))+'</span><button type="button" class="btn sm" data-next="1">'+esc(t('bNext'))+'</button></div>':'')+S.items.map(function(it,i){return'<div class="item'+(i===F.edit?' on':'')+(it.w.length?'':' un')+'" role="button" tabindex="0" data-ed="'+i+'"><div class="item-m"><div class="item-t">'+esc(it.n||t('itemN',{n:i+1}))+(it.q>1?' ×'+it.q:'')+'</div><div class="item-s">'+esc(whoText(it.w))+'</div></div><div class="item-a">'+fmt(it.p*it.q)+'</div></div>'}).join('')+
    '<div class="row" style="justify-content:space-between;padding:10px 4px 0;font-size:.9em"><span class="lbl">'+esc(t('itemsSum',{n:S.items.length}))+'</span><b>'+fmt(tot)+'</b></div>';
}
function renderResult(){
  var R=compute(),box=$('#bs-result'),n=S.m.length;
  var per=R.payers?R.grand/R.payers:0;
  $('#bs-fab-l').textContent=hasData()?t('fabPer',{n:n,v:fmt(per)}):t('fabNone');
  $('#bs-fab-v').textContent=fmt(R.grand);
  if(n<2){box.innerHTML='<div class="empty">'+esc(t('resNeed2'))+'</div>';return}
  if(!hasData()){box.innerHTML='<div class="empty">'+esc(S.mode==='item'?t('resEmptyItem'):t('resEmptyEven'))+'</div>';return}
  var h='<div class="stats"><div class="stat"><b>'+fmt(R.grand)+'</b><span>'+esc(t('sTotal'))+'</span></div><div class="stat"><b>'+fmt(per)+'</b><span>'+esc(t('sAvg'))+'</span></div><div class="stat"><b>'+R.payers+'</b><span>'+esc(t('sPayers'))+'</span></div></div>';
  if(S.mode==='item'){
    var fees=[];if(R.svc)fees.push(t('feeSvc',{p:S.sv,v:fmt(R.svc)}));if(S.dc)fees.push(t('feeDc',{v:fmt(S.dc)}));
    if(fees.length)h+='<p class="note" style="margin:-6px 0 10px">'+esc(t('feeLine',{v:fmt(R.itemsTotal),l:fees.join(t('sep'))}))+'</p>';
    if(S.bill){var gap=R.grand-S.bill;if(Math.abs(gap)>=Math.pow(10,-dec())*0.5)h+='<p class="warn">'+esc(t(gap<0?'billGapLow':'billGapHigh',{b:fmt(S.bill),d:fmt(Math.abs(gap))}))+'</p>';else h+='<p class="ok">'+esc(t('billOk',{b:fmt(S.bill)}))+'</p>'}
  }
  if(S.rd!=='x'){var d=R.diff;if(Math.abs(d)>1e-9)h+='<p class="note" style="margin:0 0 10px">'+esc(t(d>0?'rdMore':'rdLess',{s:fmt(R.sum),d:fmt(Math.abs(d))}))+'</p>'}
  if(S.pay>=0){
    if(R.tr.length){
      var got=0,gotV=0,allV=0;R.tr.forEach(function(x){allV+=x.v;if(isPaid(x.f)){got++;gotV+=x.v}});
      h+=got===R.tr.length?'<p class="ok">'+esc(t('allGot',{n:S.m[S.pay],k:R.tr.length}))+'</p>'
        :'<div class="prog"><span>'+t('progGot',{a:got,b:R.tr.length})+'</span><span>'+t('progLeft',{v:fmt(allV-gotV)})+'</span></div><div class="pgb"><i style="width:'+(allV?gotV/allV*100:0)+'%"></i></div>';
      h+=R.tr.map(function(x,k){var pd=isPaid(x.f);
        var st=VIEW?(pd?'<span class="pds on">'+esc(t('stPaidV'))+'</span>':'<span class="pds">'+esc(t('stLeftV'))+'</span>')
          :(pd?'<span class="pds on">'+esc(t('stPaidO'))+'</span><button type="button" class="pdb" data-paid="'+x.f+'" aria-pressed="true">'+esc(t('bUnmark'))+'</button>':'<span class="pds">'+esc(t('stLeftO'))+'</span><button type="button" class="pdb" data-paid="'+x.f+'" aria-pressed="false">'+esc(t('bMark'))+'</button>');
        return'<div class="tr'+(pd?' paid':'')+'" style="animation-delay:'+(k*50)+'ms"><span class="who">'+av(x.f,24)+'<span>'+esc(S.m[x.f])+'</span></span><span class="arw">→</span><span class="who">'+av(x.t,24)+'<span>'+esc(S.m[x.t])+'</span></span><span class="amt">'+fmt(x.v)+'</span><div class="trs">'+st+'</div></div>'}).join('');
    }else h+='<div class="done">'+esc(t('noTr'))+'</div>';
  }else h+='<p class="note" style="margin:0 0 10px">'+esc(t('noPayer'))+'</p>';
  h+='<p class="h4">'+esc(t('perPerson'))+'</p>'+S.m.map(function(nm,i){
    var tags=(i===S.pay?'<span class="tag pay">'+esc(t('tagPay'))+'</span>':'')+(isFree(i)?'<span class="tag free">'+esc(t('tagFree'))+'</span>':'')+(S.pay>=0?(i!==S.pay?(isPaid(i)?'<span class="tag paid">'+esc(t('tagPaid'))+'</span>':''):''):'');
    var li='';
    if(S.mode==='item'){
      li=R.lines[i].map(function(l){return'<li><span>'+esc(l.n)+(l.k>1?t('shareK',{k:l.k}):'')+'</span><span>'+fmt(l.a)+'</span></li>'}).join('');
      var adj=R.raw[i]-R.sub[i];if(Math.abs(adj)>0.004)li+='<li><span>'+esc(t(S.dc?'adjSvcDc':'adjSvc'))+'</span><span>'+(adj<0?'−':'＋')+fmt(Math.abs(adj))+'</span></li>';
    }else li='<li><span>'+esc(t('evenLine'))+'</span><span>'+fmt(R.raw[i])+'</span></li>';
    if(isFree(i))li+='<li><span>'+esc(t('freeBy'))+'</span><span>−'+fmt(R.raw[i])+'</span></li>';
    else if(R.freeSum>0)li+='<li><span>'+esc(t('freeAdd'))+'</span><span>＋'+fmt(R.freeSum/R.payers)+'</span></li>';
    return'<details class="per"><summary>'+av(i)+'<span>'+esc(nm)+'</span>'+tags+'<span class="amt">'+fmt(R.due[i])+'</span></summary><ul>'+li+'</ul></details>'}).join('');
  box.innerHTML=h;
  $('#bs-owner').hidden=VIEW;
  if(!isDemo())hyTool.result({item_count:itemCount(),people_count:n,option:S.mode});
}

/* ---------- 名單與基本設定 ---------- */
$('#bs-title').addEventListener('input',function(e){S.t=e.target.value.trim();save()});
$('#bs-cur').addEventListener('change',function(e){S.c=e.target.value;save();render();ga('bill_currency',{currency:S.c})});
function addMembers(){var inp=$('#bs-mname'),added=0;
  inp.value.split(/[,，、\s]+/).map(function(s){return s.trim()}).filter(Boolean).forEach(function(nm){if(S.m.length>=30)return;nm=nm.slice(0,16);if(S.m.indexOf(nm)>=0){toast(t('dupe',{n:nm}));return}S.m.push(nm);added++});
  inp.value='';if(added){save();render()}inp.focus()}
$('#bs-madd').addEventListener('click',addMembers);
$('#bs-mname').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();addMembers()}});
$('#bs-members').addEventListener('click',function(e){var b=e.target.closest('[data-rm]');if(!b)return;var i=+b.dataset.rm;
  if(S.items.some(function(it){return it.w.indexOf(i)>=0})){toast(t('hasItems',{n:S.m[i]}));return}
  S.m.splice(i,1);
  function fix(j){return j>i?j-1:j}
  S.items.forEach(function(it){it.w=it.w.map(fix)});S.free=S.free.filter(function(j){return j!==i}).map(fix);S.paid=S.paid.filter(function(j){return j!==i}).map(fix);
  if(S.pay===i)S.pay=-1;else S.pay=fix(S.pay);F.w=F.w.filter(function(j){return j!==i}).map(fix);
  save();render()});
ROOT.addEventListener('click',function(e){var b=e.target.closest('[data-mode]');if(!b)return;if(S.mode===b.dataset.mode)return;S.mode=b.dataset.mode;save();render();ga('bill_mode',{option:S.mode})});
$('#bs-total').addEventListener('input',function(e){S.total=num(e.target.value);save();renderResult()});

/* ---------- 品項 ---------- */
function resetForm(){F={w:[],q:1,edit:-1};$('#bs-iname').value='';$('#bs-iprice').value='';$('#bs-ierr').textContent=''}
$('#bs-qm').addEventListener('click',function(){if(F.q>1){F.q--;drawForm()}});
$('#bs-qp').addEventListener('click',function(){if(F.q<99){F.q++;drawForm()}});
$('#bs-iwho').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var v=+b.dataset.v;
  F.w=F.w.indexOf(v)>=0?F.w.filter(function(x){return x!==v}):F.w.concat([v]).sort(function(a,c){return a-c});drawForm()});
$('#bs-iall').addEventListener('click',function(){F.w=F.w.length===S.m.length?[]:allIdx();drawForm()});
function addItem(){
  var p=num($('#bs-iprice').value),err=$('#bs-ierr');
  if(S.m.length<2){err.textContent=t('errNeed2');$('#bs-mname').focus();return}
  if(!p){err.textContent=t('errPrice');$('#bs-iprice').focus();return}
  if(!F.w.length){err.textContent=t('errWho');return}
  var it={n:$('#bs-iname').value.trim().slice(0,30),p:Math.round(p*100)/100,q:F.q,w:F.w.slice(),x:F.edit>=0?S.items[F.edit].x:newId()};
  var isNew=F.edit<0,wasUn=isNew?false:!S.items[F.edit].w.length;if(isNew)S.items.push(it);else S.items[F.edit]=it;
  ga(isNew?'bill_add_item':'bill_edit_item',{item_count:S.items.length,option:it.w.length>1?'shared':'single'});
  resetForm();save();render();
  var nx=wasUn?nextUn():-1;
  if(nx>=0){loadItem(nx);toast(t('tNext',{n:S.items[nx].n||t('itemDef')}));ga('bill_assign_next')}
  else{toast(isNew?t('tAdded',{n:it.n||t('itemDef')}):(wasUn?t('tAllDone'):t('tUpdated')));if(isNew)$('#bs-iname').focus()}
}
$('#bs-iadd').addEventListener('click',addItem);
['#bs-iname','#bs-iprice'].forEach(function(id){$(id).addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();if(id==='#bs-iname')$('#bs-iprice').focus();else addItem()}})});
function nextUn(){for(var i=0;i<S.items.length;i++)if(!S.items[i].w.length)return i;return -1}
function loadItem(i){var it=S.items[i];F={w:it.w.slice(),q:it.q,edit:i};$('#bs-iname').value=it.n;$('#bs-iprice').value=it.p;$('#bs-ierr').textContent='';drawForm();drawItems();
  $('#bs-addf').scrollIntoView({behavior:'smooth',block:'center'})}
$('#bs-items').addEventListener('click',function(e){if(VIEW)return;if(e.target.closest('[data-next]')){var nx=nextUn();if(nx>=0)loadItem(nx);return}var r=e.target.closest('[data-ed]');if(!r)return;loadItem(+r.dataset.ed)});
$('#bs-items').addEventListener('keydown',function(e){if(e.key==='Enter'){var r=e.target.closest('[data-ed]');if(r)r.click()}});
$('#bs-icancel').addEventListener('click',function(){resetForm();drawForm();drawItems()});
$('#bs-idel').addEventListener('click',function(){if(F.edit<0)return;S.items.splice(F.edit,1);resetForm();save();render();toast(t('tDeleted'))});

/* ---------- 費用與付款 ---------- */
$('#bs-svc').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;S.sv=+b.dataset.v;save();render();ga('bill_service',{option:String(S.sv)})});
$('#bs-svcin').addEventListener('input',function(e){var v=parseFloat(e.target.value);if(v>=0)if(v<=100){S.sv=v;save();pick($('#bs-svc'),[[0,t('svcNone')],[5,'5%'],[10,'10%'],[15,'15%']],function(x){return +x===S.sv});renderResult()}});
$('#bs-dc').addEventListener('input',function(e){S.dc=num(e.target.value);save();renderResult()});
$('#bs-bill').addEventListener('input',function(e){S.bill=num(e.target.value);save();renderResult()});
$('#bs-free').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var v=+b.dataset.v;
  S.free=isFree(v)?S.free.filter(function(x){return x!==v}):S.free.concat([v]);save();render();ga('bill_free',{free_count:S.free.length})});
$('#bs-pay').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var np=+b.dataset.v;if(np!==S.pay)S.paid=[];S.pay=np;save();render()});
$('#bs-rd').addEventListener('change',function(e){S.rd=e.target.value;save();renderResult();ga('bill_round',{option:S.rd})});

/* ---------- 帳單照片（只存在這個頁面，不上傳） ---------- */
var photoURL=null,pdlg=$('#bs-pdlg');
function setPhotoUI(){$('#bs-photo').textContent=photoURL?t('photoAgain'):t('photoBtn');$('#bs-pnote').textContent=photoURL?t('photoNote2'):t('photoNote')}
function openD(d){if(d.showModal){try{d.showModal();return}catch(e){}}d.classList.add('fb');d.setAttribute('open','')}
function closeD(d){if(d.classList.contains('fb')){d.classList.remove('fb');d.removeAttribute('open');return}try{d.close()}catch(e){d.removeAttribute('open')}}
$('#bs-photo').addEventListener('click',function(){$('#bs-file').click()});
$('#bs-file').addEventListener('change',function(e){var f=e.target.files[0];if(!f)return;if(photoURL)URL.revokeObjectURL(photoURL);photoURL=URL.createObjectURL(f);
  $('#bs-img').src=photoURL;$('#bs-bigimg').src=photoURL;$('#bs-pv').hidden=false;$('#bs-prm').hidden=false;setPhotoUI();e.target.value='';ga('bill_photo')});
$('#bs-prm').addEventListener('click',function(){if(photoURL)URL.revokeObjectURL(photoURL);photoURL=null;$('#bs-pv').hidden=true;$('#bs-prm').hidden=true;setPhotoUI();$('#bs-img').removeAttribute('src')});
$('#bs-img').addEventListener('click',function(){openD(pdlg)});
$('#bs-pclose').addEventListener('click',function(){closeD(pdlg)});
pdlg.addEventListener('click',function(e){if(e.target===pdlg)closeD(pdlg)});

/* ---------- 貼上帳單文字，自動拆品項（全部在手機上處理，不上傳） ---------- */
var FW=/[０-９＄％．，：＊￥]/g,FWMAP={'＄':'$','％':'%','．':'.','，':',','：':':','＊':'*','￥':'¥'};
function norm(s){return String(s).replace(FW,function(c){return FWMAP[c]||String.fromCharCode(c.charCodeAt(0)-65248)}).replace(/　/g,' ').replace(/(\d),(\d{3})(?!\d)/g,'$1$2').replace(/(\d),(\d{3})(?!\d)/g,'$1$2')}
var RE_SUBT=/小計|SUB\s?-?TOTAL/i;
var RE_TOTAL=/合計|總計|総計|總額|總金額|應付|應收|實付|實收|お会計|御会計|ご請求|TOTAL|AMOUNT DUE|BALANCE DUE/i;
var RE_SVC=/服務費|服務|サービス料|サービス|SERVICE|GRATUITY|\bTIP\b|\bTAX\b|SALES TAX/i;
var RE_DISC=/折扣|折價|優惠|折抵|折讓|割引|値引|クーポン|DISCOUNT|COUPON|PROMO/i;
var RE_SKIP=/小計|找零|找回|現金|信用卡|刷卡|付款|支付|悠遊|一卡通|LINE\s?PAY|街口|APPLE\s?PAY|載具|統一編號|統編|發票|隨機碼|電話|TEL|地址|桌號|人數|日期|時間|單號|序號|編號|收銀|服務員|謝謝|歡迎|營業稅|稅額|含稅|未稅|お預り|お預かり|お釣り|おつり|釣銭|消費税|内税|外税|税込|税抜|対象|領収|担当|レジ|伝票|テーブル|人数|ありがとう|またのお越し|電子マネー|クレジット|現金|ポイント|登録番号|SUB\s?TOTAL|CASH|CHANGE|VISA|MASTER|CARD|DEBIT|CREDIT|AUTH|APPROV|THANK|SERVER|TABLE|GUEST|RECEIPT|ORDER\s?#|CHECK\s?#|品名|數量|單價|金額|點數|會員|交易|明細|收據|銷售額|機號|店號|列印|WIFI|密碼|光臨|桌|人$/i;
var RE_JUNK=/\d{2,4}[\/.\-]\d{1,2}[\/.\-]\d{1,2}|\d{1,2}:\d{2}|\d{7,}|0\d{1,3}-\d{5,8}/;
var RE_WORD=/[一-鿿ぁ-ヿA-Za-z]/;
function lastNum(s){var m=s.match(/\d+(?:\.\d+)?/g);return m?+m[m.length-1]:0}
function parseLine(s){
  s=s.replace(/^\s*\d{1,2}\s*[.、)）]\s*/,'').replace(/\s+(TX|T)\s*$/i,'');
  var q=0,m=s.match(/[x×*]\s*(\d{1,2})(?!\d)/i);
  if(m){q=+m[1];s=s.replace(m[0],' ')}
  else{m=s.match(/(\d{1,2})\s*(?:人前|[份個杯碗盤瓶客組件串支顆片隻條罐本皿点枚])/);if(m){q=+m[1];s=s.replace(m[0],' ')}}
  /* 只把「獨立的數字」當價格或數量；「10入」「A餐」這類跟文字黏在一起的保留在品名裡 */
  var toks=s.replace(/[|｜@]/g,' ').split(/\s+/).filter(Boolean),nums=[],nameT=[],NUMTOK=/^(?:NT\$?|US\$|\$|¥)?-?\d+(?:\.\d+)?(?:元|円)?$/i;
  toks.forEach(function(t){if(NUMTOK.test(t))nums.push(Math.abs(+t.replace(/NT\$?|US\$|\$|¥|元|円/gi,'')));else nameT.push(t)});
  if(!nums.length)if(nameT.length){var last=nameT[nameT.length-1],mm=last.match(/^(.*?[^\d.])(?:NT\$?|\$|¥)?(\d+(?:\.\d+)?)(?:元|円)?$/i);
    if(mm)if(RE_WORD.test(mm[1])){nameT[nameT.length-1]=mm[1].replace(/NT\$?$|\$$|¥$/i,'');nums.push(+mm[2])}}
  var name=nameT.join(' ').replace(/[:：_—\-.。]+$/,'').replace(/^[:：_—\-.。]+/,'').trim();
  return{name:name,nums:nums,q:q};
}
function toItem(name,nums,q){
  var amt=0,n=nums.length;
  if(n>=3){var a=nums[n-3],b=nums[n-2],c=nums[n-1];if(Math.abs(a*b-c)<0.01){if(!q)q=a;amt=c}else amt=c}
  else if(n===2){var x=nums[0],y=nums[1];
    if(!q){if(x%1===0)if(x<=20)if(y>x){q=x;amt=y}
      if(!amt)if(y%x===0)if(y/x<=20){q=y/x;amt=y}}
    if(!amt)amt=y}
  else amt=nums[0];
  q=q||1;if(!(amt>0))return null;if(amt>=100000)return null;
  return{n:name.slice(0,30),q:q,p:Math.round(amt/q*100)/100};
}
function parseBill(text){
  var items=[],names=[],nums=[],svc=null,total=0,disc=0;
  String(text||'').split(/\r?\n/).forEach(function(raw){
    var s=norm(raw).trim();if(!s)return;
    if(RE_SUBT.test(s))return;
    if(RE_TOTAL.test(s)){var tt=lastNum(s.replace(RE_JUNK,' '));if(tt)total=tt;return}
    if(RE_SVC.test(s)){var pm=s.match(/(\d{1,2}(?:\.\d)?)\s*%/),sa=lastNum(s.replace(/\d{1,2}(?:\.\d)?\s*%/,' '));if(!svc)svc={pct:0,amt:0};if(sa)svc.amt+=sa;else if(pm)svc.pct+=+pm[1];return}
    if(RE_DISC.test(s)){disc+=Math.abs(lastNum(s)||0);return}
    if(RE_SKIP.test(s))return;
    if(RE_JUNK.test(s))return;
    var r=parseLine(s),word=RE_WORD.test(r.name);
    if(word)if(r.nums.length){var it=toItem(r.name,r.nums,r.q);if(it)items.push(it);return}
    if(word)if(!r.nums.length){if(r.name.length<=20)names.push({n:r.name,q:r.q||0});return}
    if(!word)if(r.nums.length)nums.push(r.nums[r.nums.length-1]);
  });
  /* 名稱和價格被拆成兩欄時（先一串品名、再一串數字），依順序配對 */
  if(names.length>=2)if(items.length<names.length)if(nums.length>=names.length){
    var k=names.length,start=0,qs=null;
    if(nums.length>=2*k)if(nums.slice(0,k).every(function(v){return v%1===0?v<=20:false})){qs=nums.slice(0,k);start=k}
    names.forEach(function(nm,i){var amt=nums[start+i],q=nm.q||(qs?qs[i]:1);if(amt>0)items.push({n:nm.n.slice(0,30),q:q,p:Math.round(amt/q*100)/100})});
  }
  var sub=0;items.forEach(function(it){sub+=it.p*it.q});
  if(svc)if(svc.amt)if(sub)svc.pct=Math.round((svc.pct+svc.amt/sub*100)*10)/10;
  if(svc)if(!svc.pct)svc=null;
  return{items:items,svc:svc,total:total,disc:disc,sub:sub};
}
var xdlg=$('#bs-xdlg'),XR=null,xOff={},xT;

function drawX(){
  var txt=$('#bs-xtext').value;XR=parseBill(txt);
  var list=$('#bs-xlist'),ex=$('#bs-xextra');
  if(!txt.trim()){list.innerHTML='';ex.innerHTML='';$('#bs-xcount').textContent='';$('#bs-xok').textContent=t('xOk');return}
  if(!XR.items.length){list.innerHTML='<div class="empty">'+esc(t('xNone'))+'</div>';ex.innerHTML='';$('#bs-xcount').textContent='';$('#bs-xok').textContent=t('xOk');return}
  list.innerHTML=XR.items.map(function(it,i){return'<label class="xrow'+(xOff[i]?' off':'')+'"><input type="checkbox" data-xi="'+i+'"'+(xOff[i]?'':' checked')+'><span class="nm">'+esc(it.n||t('itemDef'))+(it.q>1?' ×'+it.q:'')+'</span><span class="pr">'+fmt(it.p*it.q)+'</span></label>'}).join('');
  var h='';
  if(XR.svc)h+='<label class="xrow"><input type="checkbox" id="bs-xsvc" checked><span class="nm">'+esc(t('xSvc',{p:XR.svc.pct}))+'</span></label>';
  if(XR.disc)h+='<label class="xrow"><input type="checkbox" id="bs-xdc" checked><span class="nm">'+esc(t('xDc'))+'</span><span class="pr">−'+fmt(XR.disc)+'</span></label>';
  if(XR.total)h+='<label class="xrow"><input type="checkbox" id="bs-xtot" checked><span class="nm">'+esc(t('xTot'))+'</span><span class="pr">'+fmt(XR.total)+'</span></label>';
  ex.innerHTML=h;
  var n=XR.items.filter(function(_,i){return !xOff[i]}).length,sum=0;XR.items.forEach(function(it,i){if(!xOff[i])sum+=it.p*it.q});
  $('#bs-xcount').textContent=t('xCount',{n:XR.items.length,v:fmt(XR.sub)});
  $('#bs-xok').textContent=n?t('xOkN',{n:n,v:fmt(sum)}):t('xOk');
}
function openX(){xOff={};$('#bs-xtext').value='';drawX();openD(xdlg);ga('bill_paste_open');setTimeout(function(){$('#bs-xtext').focus()},80)}
$('#bs-xopen').addEventListener('click',openX);
$('#bs-xtext').addEventListener('input',function(){clearTimeout(xT);xOff={};xT=setTimeout(drawX,200)});
$('#bs-xlist').addEventListener('change',function(e){var i=e.target.dataset.xi;if(i===undefined)return;xOff[i]=!e.target.checked;drawX()});
$('#bs-xpaste').addEventListener('click',function(){
  if(navigator.clipboard)if(navigator.clipboard.readText){navigator.clipboard.readText().then(function(t){$('#bs-xtext').value=t;xOff={};drawX();ga('bill_paste_clipboard')}).catch(function(){toast(t('xPasteHint'))});return}
  toast(t('xPasteHint'))});
function closeX(){closeD(xdlg)}
$('#bs-xclose').addEventListener('click',closeX);$('#bs-xcancel').addEventListener('click',closeX);
$('#bs-xok').addEventListener('click',function(){
  if(!XR)return;var add=XR.items.filter(function(_,i){return !xOff[i]});
  if(!add.length){toast(t('xNoneSel'));return}
  var svcOn=XR.svc?$('#bs-xsvc').checked:false,dcOn=XR.disc?$('#bs-xdc').checked:false,totOn=XR.total?$('#bs-xtot').checked:false;
  add.forEach(function(it){S.items.push({n:it.n,p:it.p,q:it.q,w:[],x:newId()})});
  if(svcOn)S.sv=XR.svc.pct;if(dcOn)S.dc=XR.disc;if(totOn)S.bill=XR.total;
  S.mode='item';resetForm();save();render();closeX();
  ga('bill_paste_import',{item_count:add.length,service_pct:svcOn?XR.svc.pct:0,has_total:totOn?'yes':'no',has_discount:dcOn?'yes':'no'});
  if(S.m.length>=2){var nx=nextUn();if(nx>=0){loadItem(nx);toast(t('xAddedNext',{n:add.length,i:S.items[nx].n||t('itemDef')}))}}
  else toast(t('xAddedNoMem',{n:add.length}));
});

/* ---------- 詢問對話框 ---------- */
var mdlg=$('#bs-mdlg');
mdlg.addEventListener('cancel',function(e){e.preventDefault()});
function ask(title,text,btns){
  $('#bs-m-t').textContent=title;$('#bs-m-p').textContent=text;var box=$('#bs-m-b');box.innerHTML='';
  btns.forEach(function(b,i){var el=document.createElement('button');el.type='button';el.className='btn'+(i?' ghost':'');el.textContent=b[0];el.addEventListener('click',function(){closeD(mdlg);b[1]()});box.appendChild(el)});
  openD(mdlg);
}

/* ---------- 情境範例 ---------- */
var TPL={
  dinner:{mode:'item',sv:10,pay:0,rd:'x',free:[],items:[[680,1,[0]],[380,1,[1]],[360,1,[2]],[420,1,[3]],[180,1,[0,1,2,3]],[150,3,[0,1,3]]]},
  birthday:{mode:'item',sv:10,pay:1,rd:'c10',free:[2],items:[[1580,1,[0,1]],[1580,1,[2,3]],[799,1,[4]],[900,1,[0,1,2,3,4]],[680,1,[0,1,3]]]},
  ktv:{mode:'even',total:3680,pay:0,rd:'c10',free:[]},
  drinks:{mode:'item',sv:0,pay:0,rd:'x',free:[],items:[[65,1,[0]],[45,1,[1]],[85,1,[2]],[60,1,[3]],[30,1,[0,1,2,3]]]},
  rent:{mode:'even',total:3245,pay:0,rd:'x',free:[]}
};
function loadTpl(k){var T=TPL[k],N=L('tpl')[k];
  function go(){backup();S=blank();S.t=N.t;S.m=N.m.slice();S.mode=T.mode;S.sv=T.sv===undefined?10:T.sv;S.pay=T.pay;S.rd=T.rd;S.free=T.free.slice();S.total=T.total||0;
    S.items=(T.items||[]).map(function(a,j){return{n:N.d[j],p:a[0],q:a[1],w:a[2].slice(),x:newId()}});resetForm();save();render();toast(t('tplLoaded',{t:N.t.replace(/\s*[（(](範例|sample|サンプル)[）)]$/,'')}));ga('tool_demo',{option:k});
    if(innerWidth<900)$('#bs-res-anchor').scrollIntoView({behavior:'smooth'})}
  if(hasData())ask(t('askTplT'),t('askTplP'),[[t('bLoadTpl'),go],[t('bCancel'),function(){}]]);else go();
}
$('#bs-tpls').addEventListener('click',function(e){var b=e.target.closest('[data-tpl]');if(b)loadTpl(b.dataset.tpl)});
$('#bs-reset').addEventListener('click',function(){ask(t('askResetT'),t('askResetP'),[[t('bClear'),function(){backup();S=blank();resetForm();save();render();toast(t('tCleared'));ga('tool_reset')}],[t('bCancel'),function(){}]])});
$('#bs-restore').addEventListener('click',function(){var x=null;try{x=localStorage.getItem(PREV)}catch(e){}if(!x)return;var cur=hasData()?JSON.stringify(pack()):null;
  S=unpack(JSON.parse(x));try{if(cur)localStorage.setItem(PREV,cur);else localStorage.removeItem(PREV)}catch(e){}resetForm();save();render();showRestore();toast(t('tRestored'));ga('tool_restore')});

/* ---------- 底部列 ---------- */
$('#bs-fab-res').addEventListener('click',function(){$('#bs-res-anchor').scrollIntoView({behavior:'smooth'})});
$('#bs-fab-add').addEventListener('click',function(){if(S.mode!=='item'){S.mode='item';save();render()}$('#bs-addf').scrollIntoView({behavior:'smooth',block:'center'});setTimeout(function(){$('#bs-iname').focus()},350)});

/* ---------- 分享結果 ---------- */
function copy(tx){if(navigator.clipboard)if(window.isSecureContext)return navigator.clipboard.writeText(tx).then(function(){return true},fb);return Promise.resolve(fb());
  function fb(){var a=document.createElement('textarea');a.value=tx;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();var ok=false;try{ok=document.execCommand('copy')}catch(e){}document.body.removeChild(a);return ok}}
function resultText(url){var R=compute();
  var tx=t('rtHead',{t:S.t||t('rtDefault')})+'\n'+t('rtTotal',{v:fmt(R.grand)})+(S.mode==='item'?(S.sv?t('rtSvc',{p:S.sv}):''):t('rtEven'))+'\n';
  if(S.pay>=0){tx+=t('rtPayer',{n:S.m[S.pay]})+'\n';tx+=R.tr.length?R.tr.map(function(x){return t('rtLine',{f:S.m[x.f],t:S.m[x.t],v:fmt(x.v)})+(isPaid(x.f)?t('rtPaidMark'):'')}).join('\n'):t('rtNoTr');
    var un=R.tr.filter(function(x){return !isPaid(x.f)});
    if(R.tr.length)if(un.length!==R.tr.length)tx+=un.length?'\n\n'+t('rtProg',{a:R.tr.length-un.length,b:R.tr.length,l:un.map(function(x){return S.m[x.f]+' '+fmt(x.v)}).join(t('sep'))}):'\n\n'+t('rtAll')}
  else tx+=S.m.map(function(nm,i){return t('rtDue',{n:nm,v:fmt(R.due[i])})}).join('\n');
  if(S.free.length)tx+='\n'+t('rtFree',{l:S.free.map(function(i){return S.m[i]}).join(t('sep'))});
  return tx+(url?'\n\n'+t('rtLink')+url:'')}
function ready(){if(S.m.length<2){toast(t('rNeed2'));return false}if(!hasData()){toast(S.mode==='item'?t('rNeedItem'):t('rNeedTotal'));return false}return true}
$('#bs-share').addEventListener('click',async function(){if(!ready())return;
  var url=await shareUrl(),info={item_count:itemCount(),people_count:S.m.length,option:S.mode};
  if(navigator.share)if(matchMedia('(pointer:coarse)').matches){try{await navigator.share({title:t('shareTitle',{t:S.t||t('rtDefault')}),text:resultText(''),url:url});hyTool.share('native','result',info);return}catch(e){if(e.name==='AbortError'){info.method='native';info.content_type='result';ga('share_cancel',info);return}}}
  var ok=await copy(url);toast(ok?t('linkCopied'):t('copyFailLink'));hyTool.share('copy_link','result',info)});
$('#bs-copytext').addEventListener('click',async function(){if(!ready())return;var ok=await copy(resultText(await shareUrl()));toast(ok?t('textCopied'):t('copyFail'));hyTool.share('copy_text','result',{item_count:itemCount(),people_count:S.m.length,option:S.mode})});

/* ---------- 收款打勾（只有發起人） ---------- */
$('#bs-result').addEventListener('click',function(e){var b=e.target.closest('[data-paid]');if(!b)return;if(VIEW)return;var i=+b.dataset.paid;
  S.paid=isPaid(i)?S.paid.filter(function(x){return x!==i}):S.paid.concat([i]);save();renderResult();
  var R=compute(),left=R.tr.filter(function(x){return !isPaid(x.f)}).length;
  toast(isPaid(i)?(left?t('tPaidLeft',{n:S.m[i]}):t('tPaidAll')):t('tUnpaid',{n:S.m[i]}));
  ga('bill_mark_paid',{option:isPaid(i)?'paid':'unpaid',paid_count:R.tr.length-left,people_count:R.tr.length})});
$('#bs-ownlink').addEventListener('click',async function(){if(!ready())return;save();var k=ownKey(S.i);if(!k)return;
  var ok=await copy(await shareUrl()+AMP+'k='+k);toast(ok?t('ownCopied'):t('copyFail'));ga('bill_owner_link')});

/* ---------- 朋友打開分享連結：只能查看 ---------- */
function scrollRes(){setTimeout(function(){$('#bs-res-anchor').scrollIntoView({behavior:'smooth',block:'start'})},300)}
function enterView(inc){if(!VIEW)MINE=S;VIEW=true;S=inc;resetForm();ROOT.classList.add('ro');$('#bs-ro').hidden=false;
  $('#bs-ro-t').textContent=t('roTitle',{t:inc.t||t('rtDefault')});render();scrollRes()}
function exitView(){if(!VIEW)return;VIEW=false;S=MINE||blank();MINE=null;ROOT.classList.remove('ro');$('#bs-ro').hidden=true;resetForm();render()}
$('#bs-ro-back').addEventListener('click',function(){exitView();ga('bill_view_exit');ROOT.scrollIntoView({behavior:'smooth',block:'start'})});

/* ---------- 聯盟連結 ---------- */
[].forEach.call(ROOT.querySelectorAll('[data-aff]'),function(a){var k=a.dataset.aff;if(AFF[k])a.href=AFF[k];
  /* 點擊追蹤由統一追蹤碼的 [data-cta] 自動送 cta_click */});

/* ---------- 加到桌面教學與追蹤 ---------- */
var tabs=ROOT.querySelectorAll('[data-os]');
function showOS(os){[].forEach.call(tabs,function(x){x.setAttribute('aria-selected',x.dataset.os===os?'true':'false')});[].forEach.call(ROOT.querySelectorAll('[data-panel]'),function(p){p.hidden=p.dataset.panel!==os})}
var ua=navigator.userAgent||'',isIOS=/iPhone|iPad|iPod/.test(ua)||(/Macintosh/.test(ua)?navigator.maxTouchPoints>1:false);
var OS=/CriOS/.test(ua)?'ioschrome':(isIOS?'ios':(/Android/.test(ua)?'android':'pc'));
showOS(OS);
[].forEach.call(tabs,function(x){x.addEventListener('click',function(){showOS(x.dataset.os);ga('install_help',{option:x.dataset.os})})});
var SAVED=/^#app/.test(location.hash);try{if(sessionStorage.getItem('bs-sess'))SAVED=false;sessionStorage.setItem('bs-sess','1')}catch(e){}
function markSavable(){var h='#app'+langHash();if(history.replaceState)if(location.hash!==h)history.replaceState(null,'',TOOL_URL+location.search+h)}
var seen=false;
if('IntersectionObserver' in window){new IntersectionObserver(function(es,ob){es.forEach(function(e){if(e.isIntersecting)if(!seen){seen=true;ga('install_view');markSavable();ob.disconnect()}})},{threshold:.3}).observe($('#bs-install'))}
ROOT.addEventListener('click',function(e){if(e.target.closest('a[href="#bs-install"]'))ga('install_jump')});
$('#bs-installed').addEventListener('click',function(){ga('install_done',{option:ROOT.querySelector('[data-os][aria-selected="true"]').dataset.os});markSavable();toast(t('thanks'))});
document.addEventListener('keydown',function(e){if(e.key)if(e.key.toLowerCase()==='d')if(e.ctrlKey||e.metaKey){markSavable();ga('bookmark_shortcut')}});
if(SAVED){ga('open_saved_shortcut',{option:(window.matchMedia?matchMedia('(display-mode: standalone)').matches:false)||!!navigator.standalone?'standalone':'browser'});hyTool.start('saved')}
var deferred=null;
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferred=e;$('#bs-pwa').hidden=false;ga('pwa_available')});
$('#bs-pwa').addEventListener('click',function(){if(!deferred)return;deferred.prompt();deferred.userChoice.then(function(c){ga('pwa_prompt',{result:c.outcome});deferred=null;$('#bs-pwa').hidden=true})});
window.addEventListener('appinstalled',function(){ga('pwa_installed')});
function toolLink(){return TOOL_URL+(LANG==='zh'?'':'#l='+LANG)}
function setLine(){$('#bs-tline').href='https://social-plugins.line.me/lineit/share?url='+encodeURIComponent(toolLink())}
$('#bs-tline').addEventListener('click',function(){hyTool.share('line','tool')});
$('#bs-tcopy').addEventListener('click',function(){copy(toolLink()).then(function(ok){toast(ok?t('urlCopied'):t('copyFail'))});hyTool.share('copy_link','tool')});
$('#bs-tshare').addEventListener('click',function(){var tx=t('toolText');
  if(navigator.share){navigator.share({title:t('toolTitle'),text:tx,url:toolLink()}).then(function(){hyTool.share('native','tool')}).catch(function(){ga('share_cancel',{method:'native',content_type:'tool'})});return}
  hyTool.share('copy_text','tool');copy(tx+' '+toolLink()).then(function(ok){toast(ok?t('toolCopied'):t('copyFail'))})});

/* ---------- 啟動：處理分享連結 ---------- */
var LINKRE=new RegExp('[#'+AMP+']d=([\\w-]+)'),KRE=new RegExp('[#'+AMP+']k=([\\w-]+)');
async function handleLink(){
  var m=location.hash.match(LINKRE),km=location.hash.match(KRE),inc=null,bad=false;if(!m)return;
  try{inc=await decode(m[1])}catch(e){bad=true}
  if(history.replaceState)history.replaceState(null,'',TOOL_URL+location.search+(LANG==='zh'?'':'#l='+LANG));
  if(bad){toast(t('badLink'));return}
  if(!inc)return;
  var claimed=false;if(km)if(inc.ow)if(hk(km[1])===inc.ow){setOwn(inc.i,km[1]);claimed=true}
  var own=isOwner(inc);
  hyTool.start('shared');ga('open_shared',{people_count:inc.m.length,item_count:inc.mode==='item'?inc.items.length:0,option:own?'owner':'viewer'});
  if(!own){enterView(inc);return}
  /* 發起人自己打開：本機的版本一定最新，直接顯示；換手機時用發起人專用連結取得編輯權 */
  if(VIEW)exitView();
  if(S.i===inc.i){toast(t('ownLatest'));scrollRes();return}
  var use=function(){backup();S=inc;resetForm();save();render();showRestore();toast(claimed?t('ownClaimed'):t('ownOpened'));scrollRes()};
  if(!hasData())use();
  else ask(t('askOwnT'),t('askOwnP',{t2:inc.t||t('untitled'),t1:S.t||t('untitled')}),[[t('bOpenThis'),function(){use();ga('bill_open_choice',{option:'open'})}],[t('bKeepCur'),function(){toast(t('tKeptCur'));ga('bill_open_choice',{option:'keep'})}]]);
}
/* ---------- 套用語言 ---------- */
function applyLang(){
  ROOT.setAttribute('lang',HTMLLANG[LANG]);
  [].forEach.call(ROOT.querySelectorAll('[data-t]'),function(el){var v=L(el.getAttribute('data-t'));if(v!==undefined)if(el.innerHTML!==v)el.innerHTML=v});
  [].forEach.call(ROOT.querySelectorAll('[data-tp]'),function(el){el.setAttribute('placeholder',L(el.getAttribute('data-tp')))});
  [].forEach.call(ROOT.querySelectorAll('[data-ta]'),function(el){el.setAttribute('aria-label',L(el.getAttribute('data-ta')))});
  [].forEach.call(ROOT.querySelectorAll('[data-tl]'),function(el){el.setAttribute('alt',L(el.getAttribute('data-tl')))});
  [].forEach.call(ROOT.querySelectorAll('[data-lang]'),function(b){b.setAttribute('aria-pressed',b.dataset.lang===LANG?'true':'false')});
  /* 中文以外：收起中文 SEO 文章區，只留加到桌面教學 */
  [].forEach.call(ROOT.querySelectorAll('.art > section'),function(sec){if(sec.id==='bs-install')return;if(sec.id==='bs-artnote'){sec.hidden=LANG==='zh';return}sec.hidden=LANG!=='zh'});
  $('#bs-xtext').setAttribute('placeholder',t('xPh'));
  setPhotoUI();setLine();render();
  if(VIEW)$('#bs-ro-t').textContent=t('roTitle',{t:S.t||t('rtDefault')});
  if(xdlg.hasAttribute('open'))drawX();
  var tip=$('#bs-langtip');
  if(LANG==='zh'){if(BROWSER!=='zh'){if(!LS_LANG){tip.innerHTML=esc(I18N[BROWSER].tipAsk)+' <button type="button" data-lang="'+BROWSER+'">'+esc(I18N[BROWSER].tipBtn)+'</button>';tip.hidden=false}}}else tip.hidden=true;
}
ROOT.addEventListener('click',function(e){var b=e.target.closest('[data-lang]');if(!b)return;var nl=b.dataset.lang;if(LANGS.indexOf(nl)<0)return;if(nl===LANG)return;
  var from=LANG,via=b.closest('#bs-langtip')?'tip':'switch';LANG=nl;LS_LANG=nl;try{localStorage.setItem('bs-lang',nl)}catch(err){}
  applyLang();ga('lang_switch',{source:via,from_lang:from});
  if(/^#app/.test(location.hash))markSavable();
});
load();if(!isOwner())save();applyLang();showRestore();if(LANG!=='zh')ga('lang_auto',{source:LANG_SRC});handleLink();
window.addEventListener('hashchange',function(){if(LINKRE.test(location.hash))handleLink()});
}catch(err){if(window.console)console.error('[bill-split] 初始化失敗：',err)}
})();
