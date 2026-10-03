(function(){
'use strict';
try{
/* ▼ 聯盟連結：只改這裡 */
var AFF=window.TS_AFF||{
  trip:'https://trip.tpk.ro/4JCNKu4q',
  agoda:'https://agoda.tpk.ro/BjCNFyqy',
  booking:'https://booking.tpk.ro/RcBdtiWX',
  klook:'https://klook.tpk.ro/yPdA5Iyi',
  kkday:'https://kkday.tpk.ro/NXjHmyP7'
};
var ROOT=document.getElementById('ts-app');
var $=function(s){var el=ROOT?ROOT.querySelector(s):null;if(!el)if(window.console)console.warn('[travel-split] 找不到元素',s);return el||document.createElement('span')};
if(!ROOT){if(window.console)console.warn('[travel-split] 找不到 #ts-app，工具未啟動');return}
var esc=function(s){return String(s).replace(/[\u0026<>"']/g,function(c){return{'\u0026':'\u0026amp;','<':'\u0026lt;','>':'\u0026gt;','"':'\u0026quot;',"'":'\u0026#39;'}[c]})};

/* ▼ 介面翻譯：中文靜態文字直接取自頁面 HTML（SEO 以中文為主），這裡放英文、日文與動態文字 */
var I18N={
zh:{
memHint:"先新增至少兩位旅伴（記得把自己也加進來）。",rm:"移除",dupe:"「{n}」已經在名單中",hasExp:"{n} 已有支出紀錄，請先修改相關支出",
emptyList:"還沒有支出紀錄",emptyA:"新增旅伴後，",emptyB:"按「記一筆」開始",paidBy:"{n} 先付",splitAll:"全員分攤",splitSome:"{l}分攤",sep:"、",dot:"・",
rateAria:"1 {c} 兌換 {b}",rateTime:"匯率時間：{t}",rateDefault:"使用預設參考匯率",fabNone:"尚未記帳",fabCount:"{e} 筆・{m} 人",fabCount1:"{e} 筆・{m} 人",prevOrig:"（{v}）",
resEmpty:"記下第一筆支出後，這裡會即時算出誰該轉給誰。",total:"總花費",avg:"平均每人",trs:"筆轉帳",even:"大家付的剛好一樣，不用轉帳！",
perPerson:"每人明細",recv:"應收 ",pay:"應付 ",paidOwe:"先付 {p}・應分攤 {o}",catDist:"花費分布",
destNext:"下一趟{d}旅行",destAny:"下一趟旅行",recoH:"帳算清了，{x}也先準備起來",
badRate:"請輸入大於 0 的匯率",rateUpd:"已更新 {c} 匯率",ratesLive:"已更新為最新參考匯率",ratesFail:"暫時無法取得即時匯率，可以手動輸入",
need2:"請先新增至少兩位旅伴",dlgEdit:"編輯支出",dlgNew:"記一筆支出",selNone:"全部取消",selAll:"全選",preview:"{n} 人分攤，每人約 {v}",
errAmt:"請輸入金額",errSplit:"請至少選一位分攤的人",added:"已記下一筆",updated:"已更新",deleted:"已刪除",
shareFirst:"先記幾筆支出再分享吧",shareTitle:"{t} 分帳",tripDefault:"旅費",linkCopied:"連結已複製，貼到 LINE 群組給旅伴吧",copyFail:"複製失敗，請手動複製網址列",
noExp:"還沒有支出紀錄",textCopied:"結算文字已複製",copyFail2:"複製失敗",
rtHead:"【{t}】分帳結果",rtTotal:"總花費：{v}（{m} 人，{e} 筆）",rtTotal1:"總花費：{v}（{m} 人，{e} 筆）",rtLine:"・{f} → {t}：{v}",rtEven:"・大家付的剛好一樣，不用轉帳",rtLink:"明細與計算：",
thanks:"太好了！下次從桌面點開就能直接記帳",urlCopied:"網址已複製，貼給朋友吧",
toolText:"出國分帳推薦這個免費工具：記下誰先付，自動換匯、算出誰該轉給誰，不用下載 App。",toolTitle:"旅費分帳計算機",toolCopied:"已複製推薦文字＋網址",
demoConfirm:"載入範例會覆蓋目前的帳本，確定嗎？",demoLoaded:"已載入範例帳本",resetConfirm:"確定清空目前帳本？（已分享出去的連結不受影響）",resetDone:"已開新帳本",
openShared:"已開啟旅伴分享的帳本，可以直接繼續編輯",badLink:"連結無法讀取，已開啟你自己的帳本",
tipAsk:"",tipBtn:"",
mTitleSame:"合併旅伴的帳本？",mTextSame:"你手上也有《{t}》這本帳。旅伴的版本有 {n} 筆你沒有的支出，你的版本有 {m} 筆對方沒有的。",mNote:"合併後按「分享連結給旅伴」傳回群組，大家就會拿到同一份帳本。",
bMerge:"合併兩邊的支出（推薦）",bUseTheirs:"改用旅伴的版本",bKeepMine:"保留我的版本",
mTitleOther:"開啟旅伴分享的帳本？",mTextOther:"這是另一本帳《{t2}》，開啟後會取代你目前的《{t1}》（{k} 筆支出）。你的帳本會先自動備份，之後可以按「還原上一本帳本」找回。",
bOpenTheirs:"開啟旅伴的帳本",bKeepMine2:"保留我的帳本",
tMerged:"已合併：新增 {n} 筆支出",tUpToDate:"你的帳本已經是最新版本",tMineNewer:"你的帳本比連結裡的更新，已保留你的版本",tKept:"已保留你的帳本",tUpdated:"已更新旅伴新增或修改的支出",tRestored:"已還原上一本帳本",untitled:"未命名",
rSub:"結算幣別：{b}。以下是換算用的匯率，可以改成你實際刷卡或換匯的匯率，按「確認匯率」後才會套用。",rRef:"參考 {v}",rAdd:"＋ 加入其他幣別",rLiveFilled:"已填入即時參考匯率（{t}），按「確認匯率」後套用",rErr:"請把每個匯率填成大於 0 的數字",rApplied:"已套用匯率",
markPaid:"標記已付款",undoPaid:"取消",stLeft:"還沒付",stPaid:"✓ 已付款",paidH:"已付款",prog:"已付清 {a}／{b} 筆",progLeft:"還差 {v}",allSettled:"全部付清了！",tPaid:"已記下：{f} 付給 {t} {v}",tUnpaid:"已取消這筆付款紀錄",rtPaidH:"已付款：",rtPaidLine:"・{f} → {t}：{v} ✓",rtLeft:"還沒付：{l}",rtAll:"全部付清了，謝謝大家！",
demo:{t:"東京五日遊（範例）",m:["小明","阿華","小美","阿傑"],d:["新宿飯店四晚","機場快線","燒肉晚餐","迪士尼門票","居酒屋（小美沒喝）","桃園機場停車"]},
cats:{food:"餐飲",stay:"住宿",move:"交通",fun:"門票",shop:"購物",misc:"其他",pay:"付款"}
},
en:{
kick:"Travel tool · Updated 2026-09-25",
h2:"<span class='hl'>Trip Expense</span> Splitter: log who paid, see who owes whom",
lead:"<strong>In short:</strong> a free tool for splitting travel costs with friends. Log every expense someone paid for, in any currency. It converts everything to one currency and settles up with the <strong>fewest transfers</strong> (at most N−1 for N people). Share one link and everyone sees the same ledger.",
pills:"<span>20 currencies</span><span>Fewest transfers</span><span>Share by link</span><span>No sign-up</span><a data-google-vignette='false' href='#ts-install'>Add to home screen ↓</a>",
c1:"Trip and travelers",lTitle:"Trip name",pTitle:"e.g. Tokyo 5-day trip",lBase:"Settle in",lName:"Traveler name",pName:"Enter names (comma-separated for several)",bAdd:"+ Add",
c2:"Expenses",bAddExp:"+ Add expense",rates:"Exchange rates",bFetch:"Use live rates",
bDemo:"Try a sample",bReset:"Clear and start over",
c3:"Settle up",bShare:"Share link with the group",bCopy:"Copy summary",privacy:"Your ledger lives only in your browser and in the share link. Nothing is stored on our server.",
trip_b:"Flights + hotels",trip_s:"Compare flights and stays together, often with bundle deals",trip_e:"Search flights and hotels →",
agoda_b:"Asia hotel deals",agoda_s:"Big choice in Japan, Korea, Thailand and Vietnam, with member prices",agoda_e:"See stays →",
booking_b:"Free cancellation",booking_s:"Lock in a room before plans are final",booking_e:"Find free cancellation →",
klook_b:"Tickets and transport",klook_s:"Theme parks, rail passes, airport transfers",klook_e:"See top activities →",
kkday_b:"Day trips and experiences",kkday_s:"Private drivers, guided tours, classes",kkday_e:"Find day trips →",
disc:"These are affiliate links: I may earn a small commission at no extra cost to you. — Zoe",
artnote:"The how-to guide and FAQ on this page are in Chinese. Tap 中文 at the top to read them.",
insH:"Add the splitter to your home screen for your next trip",
insP:"Once added, it opens like an app from your home screen — nothing to download. Your ledger stays saved in that phone's browser, so you can pick up where you left off.",
insTabs:"Choose your device",tabPc:"Computer",bPwa:"Install to home screen in one tap",
pIos:"<p class='os-t'>iPhone: add to Home Screen (Safari)</p><ol class='steps'><li>Open this page in <strong>Safari</strong></li><li>Tap the <strong>Share</strong> icon next to the address bar (a square with an up arrow; on newer iOS, tap “⋯” first)</li><li>Scroll down and tap <strong>“Add to Home Screen”</strong></li><li>Rename it if you like, then tap <strong>“Add”</strong></li></ol><p class='os-t'>iPhone: add to Favorites</p><ol class='steps'><li>Tap the <strong>Share</strong> icon again</li><li>Tap <strong>“Add to Favorites”</strong> — it will show up on Safari's start page</li></ol>",
pIosC:"<p class='os-t'>iPhone: add to Home Screen (Chrome)</p><ol class='steps'><li>Open this page in <strong>Chrome</strong></li><li>Tap the <strong>Share</strong> icon on the right of the address bar (or tap “⋯” at the bottom right, then “Share”)</li><li>Scroll down and tap <strong>“Add to Home Screen”</strong></li><li>Tap <strong>“Add”</strong> — the icon opens in Chrome</li></ol><p class='os-t'>iPhone: add a Chrome bookmark</p><ol class='steps'><li>Tap <strong>“⋯”</strong> at the bottom right</li><li>Tap <strong>“Add to Bookmarks”</strong> (shown as a ☆ in some versions)</li></ol><p class='note'>“Add to Home Screen” in Chrome needs iOS 16.4 or later. If you don't see it, do it once in Safari.</p>",
pAnd:"<p class='os-t'>Android: add to home screen (Chrome)</p><ol class='steps'><li>Open this page in <strong>Chrome</strong></li><li>Tap the <strong>“⋮”</strong> menu at the top right</li><li>Tap <strong>“Add to home screen”</strong>, then <strong>“Add”</strong> or <strong>“Create shortcut”</strong></li><li>The icon now appears on your home screen</li></ol><p class='os-t'>Android: bookmark it</p><ol class='steps'><li>Tap <strong>“⋮”</strong> at the top right</li><li>Tap the <strong>☆ star</strong> in the top row</li></ol><p class='note'>Samsung Internet: tap “≡” at the bottom → “Add page to” → “Home screen”.</p>",
pPc:"<p class='os-t'>Computer: bookmark it</p><ol class='steps'><li>Press <strong>Ctrl+D</strong> (Windows) or <strong>⌘+D</strong> (Mac)</li><li>Save it to your bookmarks bar for one-click access</li></ol><p class='note'>Started on your computer? Tap “Share link with the group”, open the link on your phone, and keep going there.</p>",
insNote:"For security, websites can't add themselves for you — the steps above take about 10 seconds.",bDone:"Done, I added it",
invite:"<strong>Find it useful?</strong> Send it to the friends you travel with, before the trip — no more hours of reconciling receipts after.",
bTShare:"Share with friends",bLine:"Send via LINE",bTCopy:"Copy link",
bRes:"Results",bAddShort:"+ Add",aClose:"Close",lAmt:"Amount",lCur:"Currency",lDesc:"What for",pDesc:"e.g. Ichiran ramen, 2 hotel nights",lCat:"Category",lPayer:"Who paid?",lSplit:"Split between",bDel:"Delete",bSave:"Save",
memHint:"Add at least two travelers (include yourself).",rm:"Remove",dupe:"“{n}” is already on the list",hasExp:"{n} has expenses — edit those first",
emptyList:"No expenses yet",emptyA:"Add travelers, then ",emptyB:"tap “Add expense”",paidBy:"Paid by {n}",splitAll:"split by everyone",splitSome:"split by {l}",sep:", ",dot:" · ",
rateAria:"1 {c} in {b}",rateTime:"Rates as of {t}",rateDefault:"Using default reference rates",fabNone:"No expenses yet",fabCount:"{e} expenses · {m} people",fabCount1:"{e} expense · {m} people",prevOrig:" ({v})",
resEmpty:"Add your first expense and the settlement appears here instantly.",total:"Total",avg:"Per person",trs:"transfers",even:"All even — no transfers needed!",
perPerson:"By person",recv:"Gets back ",pay:"Owes ",paidOwe:"Paid {p} · Share {o}",catDist:"Spending by category",
destNext:"your next trip to {d}",destAny:"your next trip",recoH:"All settled? Start planning {x}",
badRate:"Enter a rate above 0",rateUpd:"{c} rate updated",ratesLive:"Updated to live reference rates",ratesFail:"Couldn't load live rates — enter them manually",
need2:"Add at least two travelers first",dlgEdit:"Edit expense",dlgNew:"Add an expense",selNone:"Clear all",selAll:"Select all",preview:"Split {n} ways, about {v} each",
errAmt:"Enter an amount",errSplit:"Choose at least one person",added:"Expense added",updated:"Updated",deleted:"Deleted",
shareFirst:"Add some expenses before sharing",shareTitle:"{t} — split",tripDefault:"Trip",linkCopied:"Link copied — paste it in your group chat",copyFail:"Copy failed — copy the address bar instead",
noExp:"No expenses yet",textCopied:"Summary copied",copyFail2:"Copy failed",
rtHead:"[{t}] Split summary",rtTotal:"Total: {v} ({m} people, {e} expenses)",rtTotal1:"Total: {v} ({m} people, {e} expense)",rtLine:"• {f} → {t}: {v}",rtEven:"• All even — no transfers needed",rtLink:"Details: ",
thanks:"Nice! Open it from your home screen next time",urlCopied:"Link copied — send it to a friend",
toolText:"A free trip expense splitter: log who paid, convert currencies automatically, and see who owes whom. No app needed.",toolTitle:"Trip Expense Splitter",toolCopied:"Text and link copied",
demoConfirm:"Loading the sample replaces your current ledger. Continue?",demoLoaded:"Sample loaded",resetConfirm:"Clear this ledger? (Links you already shared won't change.)",resetDone:"New ledger started",
openShared:"Opened a shared ledger — you can keep editing",badLink:"Couldn't read that link — opened your own ledger",
tipAsk:"Prefer English?",tipBtn:"Switch",
mTitleSame:"Merge your friend's ledger?",mTextSame:"You also have “{t}” on this device. Their version has {n} expense(s) you don't have, and yours has {m} they don't.",mNote:"After merging, tap “Share link with the group” so everyone gets the same version.",
bMerge:"Merge both (recommended)",bUseTheirs:"Use their version",bKeepMine:"Keep mine",
mTitleOther:"Open the shared ledger?",mTextOther:"This is a different ledger (“{t2}”). Opening it replaces your current “{t1}” ({k} expenses). Yours is backed up first — tap “Restore previous ledger” to get it back.",
bOpenTheirs:"Open shared ledger",bKeepMine2:"Keep my ledger",bRestore:"Restore previous ledger",
tMerged:"Merged: {n} expense(s) added",tUpToDate:"Your ledger is already up to date",tMineNewer:"Your ledger is newer than the link — kept yours",tKept:"Kept your ledger",tUpdated:"Added your friend's new or edited expenses",tRestored:"Previous ledger restored",untitled:"Untitled",
rTitle:"Confirm exchange rates",rSub:"Settling in {b}. These are the rates used for conversion — change them to your card's actual rate if you like. Nothing changes until you tap “Confirm rates”.",rRef:"Ref. {v}",rAdd:"+ Add another currency",rAddL:"Add another currency",rLiveFilled:"Filled in live reference rates ({t}). Tap “Confirm rates” to apply.",rErr:"Enter every rate as a number above 0",rApplied:"Rates applied",bCancel:"Cancel",bConfirm:"Confirm rates",bAdjust:"Adjust rates",rateNote:"Tap “Adjust rates” to use your card's actual rate. Rates are saved in the share link, so everyone sees the same numbers.",
markPaid:"Mark as paid",undoPaid:"Undo",stLeft:"Not paid yet",stPaid:"✓ Paid",paidH:"Paid",prog:"{a} of {b} paid",progLeft:"{v} to go",allSettled:"Everyone has paid!",tPaid:"Recorded: {f} paid {t} {v}",tUnpaid:"Payment record removed",rtPaidH:"Already paid:",rtPaidLine:"• {f} → {t}: {v} ✓",rtLeft:"Still to pay: {l}",rtAll:"Everyone has paid — thanks!",
payNote:"When a friend pays you back, tap “Mark as paid”. The next link or summary you share shows who has already paid.",
demo:{t:"Tokyo 5-day trip (sample)",m:["Alex","Ben","Chloe","Dan"],d:["Shinjuku hotel, 4 nights","Airport express","Yakiniku dinner","Disney tickets","Izakaya (Chloe skipped drinks)","Airport parking (Taipei)"]},
cats:{food:"Food",stay:"Stay",move:"Transport",fun:"Tickets",shop:"Shopping",misc:"Other",pay:"Payment"},
cur:{TWD:"Taiwan dollar",JPY:"Japanese yen",KRW:"Korean won",USD:"US dollar",EUR:"Euro",THB:"Thai baht",HKD:"Hong Kong dollar",CNY:"Chinese yuan",SGD:"Singapore dollar",GBP:"British pound",VND:"Vietnamese dong",MYR:"Malaysian ringgit",PHP:"Philippine peso",IDR:"Indonesian rupiah",AUD:"Australian dollar",NZD:"New Zealand dollar",CAD:"Canadian dollar",CHF:"Swiss franc",MOP:"Macau pataca",TRY:"Turkish lira"},
dest:{JPY:"Japan",KRW:"Korea",THB:"Thailand",HKD:"Hong Kong",SGD:"Singapore",VND:"Vietnam",MYR:"Malaysia",PHP:"the Philippines",IDR:"Bali",EUR:"Europe",GBP:"the UK",USD:"the US",AUD:"Australia",NZD:"New Zealand",CAD:"Canada",CHF:"Switzerland",MOP:"Macau",CNY:"China",TRY:"Turkey"}
},
ja:{
kick:"旅行ツール・2026-09-25 更新",
h2:"<span class='hl'>旅行の割り勘</span>計算機：立て替えを記録して、誰が誰にいくら払うか自動計算",
lead:"<strong>ひとことで：</strong>旅行費用を割り勘する無料ツールです。誰が何を立て替えたかを記録すると、通貨を自動で換算し、<strong>送金回数が最も少なくなる</strong>精算方法を出します（N人なら最大N−1回）。リンクを共有すれば、全員が同じ帳簿を見られます。",
pills:"<span>20通貨に対応</span><span>送金回数を最小化</span><span>リンクで共有</span><span>登録不要</span><a data-google-vignette='false' href='#ts-install'>ホーム画面に追加 ↓</a>",
c1:"旅行とメンバー",lTitle:"旅行名",pTitle:"例：東京5日間",lBase:"精算通貨",lName:"メンバー名",pName:"名前を入力（カンマ区切りで複数可）",bAdd:"＋ 追加",
c2:"支出",bAddExp:"＋ 支出を追加",rates:"為替レート",bFetch:"最新レートに更新",
bDemo:"サンプルを見る",bReset:"リセットして新規作成",
c3:"精算結果",bShare:"リンクをメンバーに共有",bCopy:"精算テキストをコピー",privacy:"帳簿はブラウザと共有リンクの中だけに保存され、サーバーには一切保存されません。",
trip_b:"航空券＋ホテル",trip_s:"航空券と宿をまとめて比較、セット割も",trip_e:"航空券とホテルを探す →",
agoda_b:"アジアのホテル比較",agoda_s:"日本・韓国・タイ・ベトナムの宿が豊富、会員価格あり",agoda_e:"宿を見る →",
booking_b:"無料キャンセル可の部屋",booking_s:"予定が未定でも先に押さえられる",booking_e:"無料キャンセルを探す →",
klook_b:"チケットと交通",klook_s:"テーマパーク、周遊パス、空港送迎",klook_e:"人気プランを見る →",
kkday_b:"日帰りツアーと体験",kkday_s:"貸切車、ガイドツアー、体験教室",kkday_e:"日帰りツアーを探す →",
disc:"アフィリエイトリンクを含みます。予約いただくと少額の報酬を受け取りますが、お支払い額は変わりません。— Zoe",
artnote:"このページの使い方ガイドとよくある質問は中国語のみです。上の「中文」で表示できます。",
insH:"割り勘計算機をホーム画面に追加して、次の旅行ですぐ使おう",
insP:"ホーム画面に追加すると、アプリのように開けます。ダウンロード不要で容量もとりません。帳簿はそのスマホのブラウザに保存されるので、続きからすぐ記録できます。",
insTabs:"端末を選択",tabPc:"パソコン",bPwa:"ワンタップでホーム画面に追加",
pIos:"<p class='os-t'>iPhone：ホーム画面に追加（Safari）</p><ol class='steps'><li><strong>Safari</strong> でこのページを開く</li><li>アドレスバー横の<strong>「共有」</strong>アイコンをタップ（四角と上向き矢印。新しい iOS では先に「⋯」をタップ）</li><li>下にスクロールして<strong>「ホーム画面に追加」</strong>をタップ</li><li>名前を変更して<strong>「追加」</strong>をタップ</li></ol><p class='os-t'>iPhone：お気に入りに追加</p><ol class='steps'><li>同じく<strong>「共有」</strong>アイコンをタップ</li><li><strong>「お気に入りに追加」</strong>をタップすると、Safari の新規タブからすぐ開けます</li></ol>",
pIosC:"<p class='os-t'>iPhone：ホーム画面に追加（Chrome）</p><ol class='steps'><li><strong>Chrome</strong> でこのページを開く</li><li>アドレスバー右側の<strong>「共有」</strong>アイコンをタップ（見つからない場合は右下の「⋯」→「共有」）</li><li>下にスクロールして<strong>「ホーム画面に追加」</strong>をタップ</li><li><strong>「追加」</strong>をタップ。アイコンから Chrome で開きます</li></ol><p class='os-t'>iPhone：Chrome のブックマークに追加</p><ol class='steps'><li>右下の<strong>「⋯」</strong>をタップ</li><li><strong>「ブックマークに追加」</strong>をタップ（☆アイコンの場合もあります）</li></ol><p class='note'>Chrome の「ホーム画面に追加」は iOS 16.4 以降が必要です。表示されない場合は Safari で一度追加してください。</p>",
pAnd:"<p class='os-t'>Android：ホーム画面に追加（Chrome）</p><ol class='steps'><li><strong>Chrome</strong> でこのページを開く</li><li>右上の<strong>「⋮」</strong>メニューをタップ</li><li><strong>「ホーム画面に追加」</strong>をタップし、<strong>「追加」</strong>または<strong>「ショートカットを作成」</strong>を選択</li><li>ホーム画面にアイコンが表示されます</li></ol><p class='os-t'>Android：ブックマークに追加</p><ol class='steps'><li>右上の<strong>「⋮」</strong>をタップ</li><li>上段の<strong>☆</strong>をタップ</li></ol><p class='note'>Samsung Internet：下部の「≡」→「ページを追加」→「ホーム画面」。</p>",
pPc:"<p class='os-t'>パソコン：ブックマークに追加</p><ol class='steps'><li>Windows は <strong>Ctrl＋D</strong>、Mac は <strong>⌘＋D</strong></li><li>保存先を「ブックマークバー」にすると、ワンクリックで開けます</li></ol><p class='note'>パソコンで記録した帳簿は「リンクをメンバーに共有」でスマホに送れば、スマホで続きを記録できます。</p>",
insNote:"セキュリティ上、ウェブサイトから自動で追加することはできません。上の手順なら約10秒で完了します。",bDone:"追加しました",
invite:"<strong>便利だと思ったら</strong>、一緒に旅行する友だちにシェアしてください。出発前にグループに送っておけば、帰国後の精算がぐっと楽になります。",
bTShare:"友だちにシェア",bLine:"LINE で送る",bTCopy:"URLをコピー",
bRes:"精算を見る",bAddShort:"＋ 追加",aClose:"閉じる",lAmt:"金額",lCur:"通貨",lDesc:"内容",pDesc:"例：一蘭ラーメン、ホテル2泊",lCat:"カテゴリ",lPayer:"誰が立て替えた？",lSplit:"誰で割る？",bDel:"削除",bSave:"保存",
memHint:"メンバーを2人以上追加してください（自分も忘れずに）。",rm:"削除",dupe:"「{n}」はすでに追加されています",hasExp:"{n}さんには支出の記録があります。先に該当する支出を編集してください",
emptyList:"まだ支出がありません",emptyA:"メンバーを追加したら、",emptyB:"「支出を追加」から始めましょう",paidBy:"{n}が立て替え",splitAll:"全員で割り勘",splitSome:"{l}で割り勘",sep:"、",dot:"・",
rateAria:"1 {c} あたりの {b}",rateTime:"レート更新：{t}",rateDefault:"既定の参考レートを使用中",fabNone:"まだ記録なし",fabCount:"{e}件・{m}人",fabCount1:"{e}件・{m}人",prevOrig:"（{v}）",
resEmpty:"最初の支出を記録すると、ここに精算結果がすぐ表示されます。",total:"合計",avg:"1人あたり",trs:"回の送金",even:"全員同額なので送金は不要です！",
perPerson:"メンバー別",recv:"受け取り ",pay:"支払い ",paidOwe:"立て替え {p}・負担額 {o}",catDist:"カテゴリ別の支出",
destNext:"次の{d}旅行",destAny:"次の旅行",recoH:"精算が済んだら、{x}の準備も",
badRate:"0より大きいレートを入力してください",rateUpd:"{c}のレートを更新しました",ratesLive:"最新の参考レートに更新しました",ratesFail:"最新レートを取得できません。手動で入力してください",
need2:"先にメンバーを2人以上追加してください",dlgEdit:"支出を編集",dlgNew:"支出を追加",selNone:"すべて解除",selAll:"全員選択",preview:"{n}人で割って1人あたり約{v}",
errAmt:"金額を入力してください",errSplit:"割り勘する人を1人以上選んでください",added:"追加しました",updated:"更新しました",deleted:"削除しました",
shareFirst:"支出を記録してから共有しましょう",shareTitle:"{t} 割り勘",tripDefault:"旅行",linkCopied:"リンクをコピーしました。グループに貼り付けてください",copyFail:"コピーに失敗しました。アドレスバーからコピーしてください",
noExp:"まだ支出がありません",textCopied:"精算テキストをコピーしました",copyFail2:"コピーに失敗しました",
rtHead:"【{t}】精算結果",rtTotal:"合計：{v}（{m}人・{e}件）",rtTotal1:"合計：{v}（{m}人・{e}件）",rtLine:"・{f} → {t}：{v}",rtEven:"・全員同額なので送金は不要",rtLink:"明細：",
thanks:"ありがとうございます！次回はホーム画面から開けます",urlCopied:"URLをコピーしました。友だちに送ってください",
toolText:"旅行の割り勘におすすめの無料ツール：立て替えを記録するだけで、通貨の換算と精算を自動計算。アプリ不要です。",toolTitle:"旅行の割り勘計算機",toolCopied:"テキストとURLをコピーしました",
demoConfirm:"サンプルを読み込むと、現在の帳簿は上書きされます。よろしいですか？",demoLoaded:"サンプルを読み込みました",resetConfirm:"帳簿をリセットしますか？（共有済みのリンクは影響を受けません）",resetDone:"新しい帳簿を作成しました",
openShared:"共有された帳簿を開きました。そのまま編集できます",badLink:"リンクを読み込めませんでした。自分の帳簿を開きます",
tipAsk:"日本語で表示しますか？",tipBtn:"切り替える",
mTitleSame:"メンバーの帳簿と統合しますか？",mTextSame:"この端末にも「{t}」があります。相手の版にはあなたにない支出が{n}件、あなたの版には相手にない支出が{m}件あります。",mNote:"統合したら「リンクをメンバーに共有」でグループに送り直すと、全員が同じ帳簿になります。",
bMerge:"両方の支出を統合（おすすめ）",bUseTheirs:"相手の版を使う",bKeepMine:"自分の版を残す",
mTitleOther:"共有された帳簿を開きますか？",mTextOther:"別の帳簿「{t2}」です。開くと現在の「{t1}」（{k}件）と置き換わります。現在の帳簿は自動でバックアップされ、「前の帳簿に戻す」で復元できます。",
bOpenTheirs:"共有された帳簿を開く",bKeepMine2:"自分の帳簿を残す",bRestore:"前の帳簿に戻す",
tMerged:"統合しました：{n}件追加",tUpToDate:"帳簿はすでに最新です",tMineNewer:"お使いの帳簿の方が新しいため、そのまま残しました",tKept:"自分の帳簿を残しました",tUpdated:"相手が追加・編集した支出を反映しました",tRestored:"前の帳簿に戻しました",untitled:"無題",
rTitle:"為替レートの確認",rSub:"精算通貨：{b}。換算に使うレートです。カードや両替の実際のレートに変更できます。「レートを確定」を押すまで反映されません。",rRef:"参考 {v}",rAdd:"＋ 通貨を追加",rAddL:"通貨を追加",rLiveFilled:"最新の参考レート（{t}）を入力しました。「レートを確定」で反映されます。",rErr:"すべてのレートを0より大きい数値で入力してください",rApplied:"レートを反映しました",bCancel:"キャンセル",bConfirm:"レートを確定",bAdjust:"レートを調整",rateNote:"「レートを調整」でカードや両替の実際のレートに変更できます。レートは共有リンクに含まれるので、全員が同じ金額を見られます。",
markPaid:"支払い済みにする",undoPaid:"取り消す",stLeft:"未払い",stPaid:"✓ 支払い済み",paidH:"支払い済み",prog:"{b}件中 {a}件 支払い済み",progLeft:"残り {v}",allSettled:"全員の支払いが終わりました！",tPaid:"記録しました：{f} → {t} {v}",tUnpaid:"支払い記録を取り消しました",rtPaidH:"支払い済み：",rtPaidLine:"・{f} → {t}：{v} ✓",rtLeft:"未払い：{l}",rtAll:"全員支払い済みです。ありがとう！",
payNote:"友だちから送金されたら「支払い済みにする」をタップ。次に共有するリンクや精算テキストに、誰が支払い済みかが表示されます。",
demo:{t:"東京5日間（サンプル）",m:["たくや","けん","ゆい","さき"],d:["新宿ホテル4泊","空港特急","焼肉ディナー","ディズニーチケット","居酒屋（ゆいは飲まず）","桃園空港の駐車場"]},
cats:{food:"食事",stay:"宿泊",move:"交通",fun:"チケット",shop:"買い物",misc:"その他",pay:"支払い"},
cur:{TWD:"台湾ドル",JPY:"日本円",KRW:"韓国ウォン",USD:"米ドル",EUR:"ユーロ",THB:"タイバーツ",HKD:"香港ドル",CNY:"人民元",SGD:"シンガポールドル",GBP:"英ポンド",VND:"ベトナムドン",MYR:"マレーシアリンギット",PHP:"フィリピンペソ",IDR:"インドネシアルピア",AUD:"豪ドル",NZD:"NZドル",CAD:"カナダドル",CHF:"スイスフラン",MOP:"マカオパタカ",TRY:"トルコリラ"},
dest:{JPY:"日本",KRW:"韓国",THB:"タイ",HKD:"香港",SGD:"シンガポール",VND:"ベトナム",MYR:"マレーシア",PHP:"フィリピン",IDR:"バリ島",EUR:"ヨーロッパ",GBP:"イギリス",USD:"アメリカ",AUD:"オーストラリア",NZD:"ニュージーランド",CAD:"カナダ",CHF:"スイス",MOP:"マカオ",CNY:"中国",TRY:"トルコ"}
}
};


/* ---------- 語言 ---------- */
var LANGS=['zh','en','ja'],LOCALE={zh:'zh-TW',en:'en-US',ja:'ja-JP'},HTMLLANG={zh:'zh-Hant-TW',en:'en',ja:'ja'};
var LS_LANG=null;try{LS_LANG=localStorage.getItem('ts-lang')}catch(e){}
if(LANGS.indexOf(LS_LANG)<0)LS_LANG=null;
var HASH_L=(location.hash.match(/[#\u0026]l=(zh|en|ja)\b/)||[])[1]||null;
var IS_SHARED=/[#\u0026]d=/.test(location.hash);
var BROWSER=(function(){var l=String((navigator.languages||[])[0]||navigator.language||'zh').toLowerCase();return l.indexOf('zh')===0?'zh':(l.indexOf('ja')===0?'ja':'en')})();
/* tools 子網域：語言由網址決定（/、/en/、/ja/），不再用 localStorage 切換 */
var PAGE_LANG=LANGS.indexOf(window.TS_PAGE_LANG)>=0?window.TS_PAGE_LANG:'zh';
/* 舊版分享連結帶 l=en／ja：轉到該語言的網址，# 後面的帳本保留 */
if(HASH_L)if(HASH_L!==PAGE_LANG)if(window.TS_PATHS)if(window.TS_PATHS[HASH_L]){location.replace(window.TS_PATHS[HASH_L]+location.search+location.hash.replace(/[#\u0026]l=(zh|en|ja)\b/,''));return}
var LANG=PAGE_LANG;
var LANG_SRC='url';
function t(k,v){var d=I18N[LANG],s=(d[k]!==undefined)?d[k]:I18N.zh[k];if(s===undefined)s=k;if(v)Object.keys(v).forEach(function(x){s=String(s).split('{'+x+'}').join(v[x])});return s}
function L(k){return I18N[LANG][k]||I18N.zh[k]}
function langHash(){return ''}

/* ===== 編織日和工具｜GA4 統一追蹤 v1.2 =====
   各工具完全相同，只改最上面三行。規範：tools-ga4-guideline
   注意：整段不含「和號」字元（WordPress 會轉碼導致程式失效），新增程式時請維持 */
var HY_TOOL_ID = 'travel_split';  /* 工具登記表的 tool_id */
var HY_TOOL_ROOT = '#ts-app';  /* 工具最外層的選擇器 */
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
/* 幣別 → 目的地國碼（GA4 destination 參數，全站統一用 ISO 兩碼小寫） */
var CC={JPY:'jp',KRW:'kr',THB:'th',HKD:'hk',SGD:'sg',VND:'vn',MYR:'my',PHP:'ph',IDR:'id',EUR:'eu',GBP:'gb',USD:'us',AUD:'au',NZD:'nz',CAD:'ca',CHF:'ch',MOP:'mo',CNY:'cn',TRY:'tr'};
function destCode(){return CC[topCur()]||'none'}
function isDemo(){return['zh','en','ja'].some(function(l){return I18N[l].demo.t===S.t})}
/* cta_click 補上目的地與帳本規模 */
hyTool.ctaExtra=function(){return{destination:destCode(),item_count:expCount(),people_count:S.m.length}};

/* 中文靜態文字直接從 HTML 讀取，切回中文時還原 */
[].forEach.call(ROOT.querySelectorAll('[data-t]'),function(el){var k=el.getAttribute('data-t');if(I18N.zh[k]===undefined)I18N.zh[k]=el.innerHTML});
[].forEach.call(ROOT.querySelectorAll('[data-tp]'),function(el){var k=el.getAttribute('data-tp');if(I18N.zh[k]===undefined)I18N.zh[k]=el.getAttribute('placeholder')||''});
[].forEach.call(ROOT.querySelectorAll('[data-ta]'),function(el){var k=el.getAttribute('data-ta');if(I18N.zh[k]===undefined)I18N.zh[k]=el.getAttribute('aria-label')||''});

var CUR={TWD:['新台幣','NT$',0],JPY:['日圓','¥',0],KRW:['韓元','₩',0],USD:['美元','US$',2],EUR:['歐元','€',2],THB:['泰銖','฿',2],HKD:['港幣','HK$',2],CNY:['人民幣','CN¥',2],SGD:['新加坡幣','S$',2],GBP:['英鎊','£',2],VND:['越南盾','₫',0],MYR:['馬幣','RM',2],PHP:['菲律賓披索','₱',2],IDR:['印尼盾','Rp',0],AUD:['澳幣','A$',2],NZD:['紐幣','NZ$',2],CAD:['加幣','C$',2],CHF:['瑞士法郎','CHF',2],MOP:['澳門幣','MOP$',2],TRY:['土耳其里拉','₺',2]};
var DEF={TWD:32.2,JPY:147,KRW:1385,USD:1,EUR:.86,THB:32.4,HKD:7.8,CNY:7.15,SGD:1.29,GBP:.75,VND:26300,MYR:4.22,PHP:57,IDR:16400,AUD:1.52,NZD:1.69,CAD:1.38,CHF:.8,MOP:8.03,TRY:41};
var DEST={JPY:'日本',KRW:'韓國',THB:'泰國',HKD:'香港',SGD:'新加坡',VND:'越南',MYR:'馬來西亞',PHP:'菲律賓',IDR:'峇里島',EUR:'歐洲',GBP:'英國',USD:'美國',AUD:'澳洲',NZD:'紐西蘭',CAD:'加拿大',CHF:'瑞士',MOP:'澳門',CNY:'中國',TRY:'土耳其'};
var CATS=[['food','#D9533A'],['stay','#2F6FD6'],['move','#1F9A8A'],['fun','#8E5AB5'],['shop','#D69A12'],['misc','#888888']];
var AVC=['#111111','#D9533A','#2F6FD6','#8E5AB5','#C98410','#1F9A8A','#C2417A','#5D6D7E','#6E8F24','#A5602A'];
var KEY='ts-split-v1';
function newId(){return(Math.random().toString(36).slice(2,8)+Date.now().toString(36).slice(-4))}
function blank(){return{i:newId(),t:'',b:(CUR[window.TS_BASE]?window.TS_BASE:'TWD'),m:[],e:[],r:Object.assign({},DEF),u:0,lc:'JPY',del:[]}}
var S=blank();

function dec(c){return(CUR[c]||[0,0,2])[2]}
function fmt(v,c){var d=dec(c),s=(CUR[c]||['',c+' '])[1];return(v<0?'−':'')+s+Math.abs(v).toLocaleString(LOCALE[LANG],{minimumFractionDigits:d,maximumFractionDigits:d})}
function conv(a,f,tt){return a/(S.r[f]||1)*(S.r[tt]||1)}
function curName(c){var m=I18N[LANG].cur;return m?(m[c]||CUR[c][0]):CUR[c][0]}
function destName(c){var m=I18N[LANG].dest;return m?(m[c]||''):(DEST[c]||'')}
function catName(k){return L('cats')[k]||L('cats').misc}
/* 付款紀錄：旅伴轉帳還錢時記一筆 k='pay'（付款人＝還錢的人、分攤＝收錢的人），餘額自動扣掉；不算進總花費，也會跟著分享連結與合併帳本 */
function isPay(e){return e.k==='pay'}
function expCount(){var n=0;S.e.forEach(function(e){if(!isPay(e))n++});return n}

/* 計算：淨額法＋貪婪配對 */
function compute(){
  var n=S.m.length,b=S.b,sc=Math.pow(10,dec(b)),paid=[],owe=[],cats={},total=0,i;
  for(i=0;i<n;i++){paid.push(0);owe.push(0)}
  var adj=[],pays=[];for(i=0;i<n;i++)adj.push(0);
  S.e.forEach(function(e,ix){var v=conv(e.a,e.c,b);
    if(isPay(e)){adj[e.p]+=v;e.s.forEach(function(j){adj[j]-=v/e.s.length});pays.push({f:e.p,t:e.s[0],v:v,ix:ix});return}
    total+=v;paid[e.p]+=v;var sh=v/e.s.length;e.s.forEach(function(j){owe[j]+=sh});cats[e.k]=(cats[e.k]||0)+v});
  var net=paid.map(function(p,j){return Math.round((p-owe[j]+adj[j])*sc)});
  var diff=net.reduce(function(a,c){return a+c},0);
  if(diff)if(n){var k=0;net.forEach(function(v,j){if(Math.abs(v)>Math.abs(net[k]))k=j});net[k]-=diff}
  var cr=[],db=[];net.forEach(function(v,j){if(v>0)cr.push([j,v]);else if(v<0)db.push([j,-v])});
  cr.sort(function(x,y){return y[1]-x[1]});db.sort(function(x,y){return y[1]-x[1]});
  var tr=[],a=0,c=0;
  while(!(a>=db.length||c>=cr.length)){var x=Math.min(db[a][1],cr[c][1]);if(x>0)tr.push({f:db[a][0],t:cr[c][0],v:x/sc});db[a][1]-=x;cr[c][1]-=x;if(!db[a][1])a++;if(!cr[c][1])c++}
  return{paid:paid,owe:owe,net:net.map(function(v){return v/sc}),tr:tr,total:total,cats:cats,pays:pays};
}

/* 分享連結：deflate＋base64url，放在 # 後面 */
function usedRates(){var r={};[S.b].concat(S.e.map(function(e){return e.c})).forEach(function(c){r[c]=+(+S.r[c]).toPrecision(8)});return r}
function pack(){return{v:2,i:S.i,t:S.t,b:S.b,m:S.m,e:S.e.map(function(e){return[e.d,e.a,e.c,e.p,e.s,e.k,e.x,e.t||0]}),r:usedRates(),u:S.u,dl:(S.del||[]).slice(-200)}}
function unpack(o){
  var s=blank();s.t=String(o.t||'').slice(0,40);s.b=CUR[o.b]?o.b:'TWD';
  s.m=(o.m||[]).map(function(x){return String(x).slice(0,16)}).slice(0,30);
  Object.keys(o.r||{}).forEach(function(c){if(CUR[c])if(+o.r[c]>0)s.r[c]=+o.r[c]});
  s.e=(o.e||[]).map(function(a){return{d:String(a[0]||'').slice(0,40),a:+a[1],c:CUR[a[2]]?a[2]:s.b,p:a[3]|0,s:(a[4]||[]).map(function(x){return x|0}),k:a[5]||'misc',x:a[6]?String(a[6]).slice(0,20):newId(),t:+a[7]||0}})
    .filter(function(e){if(!(e.a>0))return false;if(e.p>=s.m.length)return false;if(!e.s.length)return false;return e.s.every(function(j){return j<s.m.length})});
  s.u=+o.u||0;s.legacy=!o.i;if(o.i)s.i=String(o.i).slice(0,24);
  s.del=(o.dl||[]).map(function(x){return String(x).slice(0,20)}).slice(-200);
  return s;
}
/* 合併兩本同一趟旅行的帳本：以旅伴名字對應，支出以編號（舊資料用內容）去重，較新的修改優先，雙方刪除的都移除 */
function mergeLedgers(A,B){
  var names=A.m.slice();B.m.forEach(function(n){if(names.indexOf(n)<0)names.push(n)});
  var delA={},delB={},del={};(A.del||[]).forEach(function(x){delA[x]=1;del[x]=1});(B.del||[]).forEach(function(x){delB[x]=1;del[x]=1});
  function named(Lg,e){return{x:e.x,d:e.d,a:e.a,c:e.c,p:Lg.m[e.p],s:e.s.map(function(i){return Lg.m[i]}),k:e.k,t:e.t||0}}
  function sig(n){return[n.d,n.a,n.c,n.p,n.s.slice().sort().join('|'),n.k].join('~')}
  var list=[],byId={},bySig={},seenB={},added=0,changed=0,mine=0;
  A.e.forEach(function(e){var n=named(A,e);list.push(n);byId[n.x]=n;bySig[sig(n)]=n});
  B.e.forEach(function(e){var n=named(B,e);if(delA[n.x])return;var cur=byId[n.x]||bySig[sig(n)];
    if(cur){seenB[cur.x]=1;if(cur.x===n.x)if(n.t>cur.t){list[list.indexOf(cur)]=n;byId[n.x]=n;changed++}return}
    list.push(n);byId[n.x]=n;bySig[sig(n)]=n;seenB[n.x]=1;added++});
  A.e.forEach(function(e){if(delB[e.x])changed++;else if(!seenB[e.x])mine++});
  list=list.filter(function(n){return !del[n.x]});
  var R=blank();R.i=A.i;R.t=A.t||B.t;R.b=A.b;R.m=names;R.lc=A.lc;R.u=Math.max(A.u||0,B.u||0);
  R.r=Object.assign({},A.r);var usedA={};usedA[A.b]=1;A.e.forEach(function(e){usedA[e.c]=1});B.e.forEach(function(e){if(!usedA[e.c])if(B.r[e.c])R.r[e.c]=B.r[e.c]});
  R.e=list.map(function(n){return{x:n.x,d:n.d,a:n.a,c:n.c,p:names.indexOf(n.p),s:n.s.map(function(x){return names.indexOf(x)}),k:n.k,t:n.t}});
  R.del=Object.keys(del).slice(-200);
  return{S:R,added:added,changed:changed,mine:mine};
}
function looksSame(A,B){if(A.t)if(A.t===B.t)return true;var common=A.m.filter(function(n){return B.m.indexOf(n)>=0}).length;return common>=2?common>=Math.min(A.m.length,B.m.length)/2:false}
function b64u(u8){var s='';for(var i=0;i<u8.length;i+=8192)s+=String.fromCharCode.apply(null,u8.subarray(i,i+8192));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function ub64u(s){s=s.replace(/-/g,'+').replace(/_/g,'/');var b=atob(s),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}
async function encode(){
  var raw=new TextEncoder().encode(JSON.stringify(pack()));
  if('CompressionStream' in window){try{var buf=await new Response(new Blob([raw]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer();return'z'+b64u(new Uint8Array(buf))}catch(e){}}
  return'j'+b64u(raw);
}
async function decode(str){
  var bytes=ub64u(str.slice(1)),txt;
  if(str[0]==='z')txt=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text();
  else txt=new TextDecoder().decode(bytes);
  return unpack(JSON.parse(txt));
}
/* 分享連結會帶上目前語言（中文不帶），對方沒有自己的語言設定時會用這個語言開啟 */
async function shareUrl(){return location.origin+location.pathname+location.search+'#d='+await encode()+langHash()}

var saveT;
function save(){clearTimeout(saveT);try{localStorage.setItem(KEY,JSON.stringify(pack()))}catch(e){}}
function load(){try{var x=localStorage.getItem(KEY);if(x){S=unpack(JSON.parse(x));return true}}catch(e){}return false}

var toastT;
function toast(m){var tt=$('#ts-toast');tt.textContent=m;tt.classList.add('on');clearTimeout(toastT);toastT=setTimeout(function(){tt.classList.remove('on')},String(m).length>18?3500:2200)}
function av(i,sz){return'<span class="av" style="background:'+AVC[i%AVC.length]+(sz?';width:'+sz+'px;height:'+sz+'px;font-size:'+(sz*.5)+'px':'')+'">'+esc((S.m[i]||'?').slice(0,1))+'</span>'}
function cat(k){for(var i=0;i<CATS.length;i++)if(CATS[i][0]===k)return CATS[i];return CATS[5]}
function curOpts(sel){return Object.keys(CUR).map(function(c){return'<option value="'+c+'"'+(c===sel?' selected':'')+'>'+c+' '+esc(curName(c))+'</option>'}).join('')}

function render(){
  if(document.activeElement!==$('#ts-title'))$('#ts-title').value=S.t;
  $('#ts-base').innerHTML=curOpts(S.b);
  $('#ts-members').innerHTML=S.m.length?S.m.map(function(n,i){return'<span class="mchip">'+av(i)+esc(n)+'<button type="button" data-rm="'+i+'" aria-label="'+esc(t('rm'))+' '+esc(n)+'">×</button></span>'}).join('')
    :'<span class="note" style="margin:0">'+esc(t('memHint'))+'</span>';
  var Lst=$('#ts-list');
  if(!expCount())Lst.innerHTML='<div class="empty">'+esc(t('emptyList'))+'<br><small>'+(S.m.length<2?esc(t('emptyA')):'')+esc(t('emptyB'))+'</small></div>';
  else Lst.innerHTML=S.e.map(function(e,i){var c=cat(e.k),all=e.s.length===S.m.length;
    var who=all?t('splitAll'):t('splitSome',{l:e.s.map(function(x){return S.m[x]}).join(t('sep'))});
    return'<div class="exp" role="button" tabindex="0" data-ed="'+i+'"><span class="cat" style="background:'+c[1]+'1f;color:'+c[1]+'">'+esc(catName(e.k))+'</span>'+
    '<div class="exp-m"><div class="exp-t">'+esc(e.d||catName(e.k))+'</div><div class="exp-s">'+esc(t('paidBy',{n:S.m[e.p]}))+esc(t('dot'))+esc(who)+'</div></div>'+
    '<div class="exp-a"><b>'+fmt(e.a,e.c)+'</b>'+(e.c!==S.b?'<small>≈ '+fmt(conv(e.a,e.c,S.b),S.b)+'</small>':'')+'</div></div>'}).filter(function(x,i){return !isPay(S.e[i])}).reverse().join('');
  var used=[];S.e.forEach(function(e){if(!isPay(e))if(e.c!==S.b)if(used.indexOf(e.c)<0)used.push(e.c)});
  $('#ts-ratebox').hidden=!used.length;
  $('#ts-rates').innerHTML=used.map(function(c){return'<div class="rate"><span>1 '+c+' =</span><b>'+fmtRate(conv(1,c,S.b))+'</b><span>'+S.b+'</span></div>'}).join('');
  $('#ts-rnote').textContent=S.u?t('rateTime',{t:new Date(S.u).toLocaleString(LOCALE[LANG],{dateStyle:'medium',timeStyle:'short'})}):t('rateDefault');
  renderResult();
}

function renderResult(){
  var R=compute(),b=S.b,box=$('#ts-result');
  var EC=expCount();$('#ts-fab-l').textContent=EC?t(EC===1?'fabCount1':'fabCount',{e:EC,m:S.m.length}):t('fabNone');
  $('#ts-fab-v').textContent=fmt(R.total,b);
  if(!EC){box.innerHTML='<div class="empty">'+esc(t('resEmpty'))+'</div>';setDest();return}
  var h='<div class="stats"><div class="stat"><b>'+fmt(R.total,b)+'</b><span>'+esc(t('total'))+'</span></div><div class="stat"><b>'+fmt(R.total/Math.max(S.m.length,1),b)+'</b><span>'+esc(t('avg'))+'</span></div><div class="stat"><b>'+R.tr.length+'</b><span>'+esc(t('trs'))+'</span></div></div>';
  function trRow(x,k,st){return'<div class="tr'+(st?' paid':'')+'" style="animation-delay:'+(k*60)+'ms"><span class="who">'+av(x.f,24)+'<span>'+esc(S.m[x.f])+'</span></span><span class="arw">→</span><span class="who">'+av(x.t,24)+'<span>'+esc(S.m[x.t])+'</span></span><span class="amt">'+fmt(x.v,b)+'</span><div class="trs">'+
    (st?'<span class="pds on">'+esc(t('stPaid'))+'</span><button type="button" class="pdb" data-unpay="'+x.ix+'" aria-pressed="true">'+esc(t('undoPaid'))+'</button>'
       :'<span class="pds">'+esc(t('stLeft'))+'</span><button type="button" class="pdb" data-pay="'+k+'" aria-pressed="false">'+esc(t('markPaid'))+'</button>')+'</div></div>'}
  if(R.pays.length){var pv=0,lv=0;R.pays.forEach(function(x){pv+=x.v});R.tr.forEach(function(x){lv+=x.v});
    h+=R.tr.length?'<div class="prog"><span>'+esc(t('prog',{a:R.pays.length,b:R.pays.length+R.tr.length}))+'</span><span>'+esc(t('progLeft',{v:fmt(lv,b)}))+'</span></div><div class="pgb"><i style="width:'+(pv/(pv+lv)*100)+'%"></i></div>'
      :'<p class="ok">'+esc(t('allSettled'))+'</p>'}
  h+=R.tr.length?R.tr.map(function(x,k){return trRow(x,k,false)}).join(''):(R.pays.length?'':'<div class="done">'+esc(t('even'))+'</div>');
  if(R.pays.length)h+='<p class="h4">'+esc(t('paidH'))+'</p>'+R.pays.map(function(x,k){return trRow(x,k,true)}).join('');
  var mx=Math.max.apply(null,R.paid.concat([1]));
  h+='<p class="h4">'+esc(t('perPerson'))+'</p>'+S.m.map(function(n,i){var nt=R.net[i];
    return'<div class="p">'+av(i)+'<span class="p-n">'+esc(n)+'</span><span class="p-v '+(nt>0?'pos':nt<0?'neg':'')+'">'+(nt>0?esc(t('recv')):nt<0?esc(t('pay')):'')+fmt(Math.abs(nt),b)+'</span>'+
    '<div class="pbar"><i style="width:'+(R.paid[i]/mx*100)+'%"></i></div><div class="p-s">'+esc(t('paidOwe',{p:fmt(R.paid[i],b),o:fmt(R.owe[i],b)}))+'</div></div>'}).join('');
  var ck=Object.keys(R.cats).sort(function(x,y){return R.cats[y]-R.cats[x]});
  h+='<p class="h4">'+esc(t('catDist'))+'</p><div class="cbar">'+ck.map(function(k){return'<i style="width:'+(R.cats[k]/R.total*100)+'%;background:'+cat(k)[1]+'"></i>'}).join('')+'</div><div class="lgd">'+
    ck.map(function(k){return'<span style="--c:'+cat(k)[1]+'">'+esc(catName(k))+' '+Math.round(R.cats[k]/R.total*100)+'%</span>'}).join('')+'</div>';
  box.innerHTML=h;setDest();
  /* 第一次看到結算（範例帳本不算，範例另有 tool_demo） */
  if(S.m.length>1)if(!isDemo())hyTool.result({item_count:EC,people_count:S.m.length,destination:destCode()});
}
function topCur(){var fc={};S.e.forEach(function(e){if(!isPay(e))if(e.c!=='TWD')fc[e.c]=(fc[e.c]||0)+conv(e.a,e.c,'USD')});return Object.keys(fc).sort(function(x,y){return fc[y]-fc[x]})[0]||''}
function setDest(){var c=topCur(),d=c?destName(c):'';$('#ts-h4').innerHTML=esc(t('recoH',{x:'\u0001'})).split('\u0001').join('<span id="ts-dest">'+esc(d?t('destNext',{d:d}):t('destAny'))+'</span>')}

/* 旅伴 */
$('#ts-title').addEventListener('input',function(e){S.t=e.target.value.trim();save()});
$('#ts-base').addEventListener('change',function(e){openRates(e.target.value,'base')});
function addMembers(){var inp=$('#ts-mname'),added=0;
  inp.value.split(/[,，、\s]+/).map(function(s){return s.trim()}).filter(Boolean).forEach(function(n){if(S.m.length>=30)return;n=n.slice(0,16);if(S.m.indexOf(n)>=0){toast(t('dupe',{n:n}));return}S.m.push(n);added++});
  inp.value='';if(added){save();render()}inp.focus()}
$('#ts-madd').addEventListener('click',addMembers);
$('#ts-mname').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();addMembers()}});
$('#ts-members').addEventListener('click',function(e){var b=e.target.closest('[data-rm]');if(!b)return;var i=+b.dataset.rm;
  if(S.e.some(function(x){return x.p===i||x.s.indexOf(i)>=0})){toast(t('hasExp',{n:S.m[i]}));return}
  S.m.splice(i,1);S.e.forEach(function(x){if(x.p>i)x.p--;x.s=x.s.map(function(j){return j>i?j-1:j})});save();render()});

/* 匯率 */
var LIVE=null;
function fetchLive(){return fetch('https://open.er-api.com/v6/latest/USD').then(function(r){return r.json()}).then(function(j){if(j.result!=='success')throw 0;
  var r={};Object.keys(CUR).forEach(function(c){if(j.rates[c])r[c]=j.rates[c]});LIVE={r:r,u:(j.time_last_update_unix||Date.now()/1000)*1000};return LIVE})}
function fetchRates(silent){fetchLive().then(function(Lv){Object.keys(Lv.r).forEach(function(c){S.r[c]=Lv.r[c]});S.u=Lv.u;save();render();if(!silent)toast(t('ratesLive'))}).catch(function(){if(!silent)toast(t('ratesFail'))})}
function fmtRate(v){return String(+(+v).toPrecision(5))}
function fmtTime(u){return new Date(u).toLocaleString(LOCALE[LANG],{dateStyle:'medium',timeStyle:'short'})}

/* ---------- 匯率確認視窗：選結算幣別或按「調整匯率」時跳出，按「確認匯率」才套用 ---------- */
var rdlg=$('#ts-rdlg'),RT=null;
function refRate(c,b){var r=LIVE?LIVE.r:DEF;return(r[b]||DEF[b])/(r[c]||DEF[c])}
function rateCurs(b){var list=[];S.e.forEach(function(e){if(e.c!==b)if(list.indexOf(e.c)<0)list.push(e.c)});
  if(S.lc)if(S.lc!==b)if(list.indexOf(S.lc)<0)list.push(S.lc);
  if(!list.length)['JPY','USD','KRW'].forEach(function(c){if(!list.length)if(c!==b)list.push(c)});return list}
function drawRates(){
  var b=RT.b;
  $('#ts-r-sub').textContent=t('rSub',{b:b+' '+curName(b)});
  $('#ts-r-list').innerHTML=RT.list.map(function(c){var v=fmtRate(RT.r[b]/RT.r[c]);
    return'<div class="rate"><span>1 '+c+' =</span><input class="in" inputmode="decimal" data-rc="'+c+'" data-orig="'+v+'" value="'+v+'" aria-label="'+esc(t('rateAria',{c:c,b:b}))+'"><span>'+b+'</span><small class="ref">'+esc(t('rRef',{v:fmtRate(refRate(c,b))}))+'</small></div>'}).join('');
  $('#ts-r-add').innerHTML='<option value="">'+esc(t('rAdd'))+'</option>'+Object.keys(CUR).filter(function(c){return c===b?false:RT.list.indexOf(c)<0}).map(function(c){return'<option value="'+c+'">'+c+' '+esc(curName(c))+'</option>'}).join('');
  $('#ts-r-note').textContent=RT.note||(RT.u?t('rateTime',{t:fmtTime(RT.u)}):t('rateDefault'));
  $('#ts-r-err').textContent='';
}
/* 只有使用者改過的欄位才更新，避免四捨五入造成誤差 */
function readInputs(){var ok=true;
  [].forEach.call(ROOT.querySelectorAll('#ts-r-list [data-rc]'),function(inp){var raw=inp.value.trim();if(raw===inp.dataset.orig)return;
    var v=parseFloat(raw.replace(/,/g,''));if(v>0){RT.r[inp.dataset.rc]=RT.r[RT.b]/v;RT.edited[inp.dataset.rc]=1}else ok=false});return ok}
function openRates(b,trigger){
  RT={b:b,r:Object.assign({},S.r),list:rateCurs(b),u:S.u,live:false,trigger:trigger,note:'',edited:{}};
  drawRates();openD(rdlg);ga('split_rate_open',{source:trigger,currency:b});
}
$('#ts-r-add').addEventListener('change',function(e){var c=e.target.value;if(!c)return;if(!readInputs()){$('#ts-r-err').textContent=t('rErr');e.target.value='';return}RT.list.push(c);drawRates()});
$('#ts-r-live').addEventListener('click',function(){if(!readInputs()){$('#ts-r-err').textContent=t('rErr');return}
  fetchLive().then(function(Lv){Object.keys(Lv.r).forEach(function(c){RT.r[c]=Lv.r[c]});RT.list.forEach(function(c){RT.edited[c]=1});RT.u=Lv.u;RT.live=true;RT.note=t('rLiveFilled',{t:fmtTime(Lv.u)});drawRates();ga('split_fetch_rates')})
  .catch(function(){toast(t('ratesFail'))})});
function cancelRates(){closeD(rdlg);if(RT)ga('split_rate_cancel',{source:RT.trigger,currency:RT.b});RT=null;render()}
$('#ts-r-cancel').addEventListener('click',cancelRates);$('#ts-r-x').addEventListener('click',cancelRates);
rdlg.addEventListener('cancel',function(e){e.preventDefault();cancelRates()});
function confirmRates(){
  if(!readInputs()){$('#ts-r-err').textContent=t('rErr');return}
  var edited=Object.keys(RT.edited).length,baseChanged=S.b!==RT.b;
  S.b=RT.b;S.r=RT.r;if(edited)S.u=RT.live?RT.u:Date.now();
  closeD(rdlg);save();render();toast(t('rApplied'));
  ga('split_rate_confirm',{source:RT.trigger,currency:S.b,option:RT.live?'live':'manual',result:baseChanged?'base_changed':'same_base',edited:edited});
  if(baseChanged)ga('split_change_base',{currency:S.b});
  RT=null;
}
$('#ts-r-ok').addEventListener('click',confirmRates);
$('#ts-r-list').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();confirmRates()}});
$('#ts-radj').addEventListener('click',function(){openRates(S.b,'adjust')});

/* 支出表單 */
var dlg=$('#ts-dlg'),editIdx=-1,F={};
function openD(d){if(d.showModal){try{d.showModal();return}catch(e){}}d.classList.add('fb');d.setAttribute('open','')}
function openDlg(){openD(dlg)}
function closeD(d){if(d.classList.contains('fb')){d.classList.remove('fb');d.removeAttribute('open');return}try{d.close()}catch(e){d.removeAttribute('open')}}
function closeDlg(){closeD(dlg)}
function isOpen(){return dlg.hasAttribute('open')}
function pick(el,items,sel,multi){el.innerHTML=items.map(function(it){var on=multi?sel.indexOf(it[0])>=0:sel===it[0];return'<button type="button" data-v="'+it[0]+'" aria-pressed="'+on+'">'+(it[2]||'')+esc(it[1])+'</button>'}).join('')}
function drawForm(){
  pick($('#ts-ecat'),CATS.map(function(c){return[c[0],catName(c[0]),'<i style="width:8px;height:8px;border-radius:50%;background:'+c[1]+'"></i>']}),F.k);
  pick($('#ts-epay'),S.m.map(function(n,i){return[i,n,av(i,20)]}),F.p);
  pick($('#ts-esplit'),S.m.map(function(n,i){return[i,n,av(i,20)]}),F.s,true);
  $('#ts-eall').textContent=F.s.length===S.m.length?t('selNone'):t('selAll');
  $('#ts-dlg-t').textContent=editIdx>=0?t('dlgEdit'):t('dlgNew');
  preview();
}
function preview(){var a=parseFloat(($('#ts-eamt').value||'').replace(/,/g,'')),c=$('#ts-ecur').value,p=$('#ts-epre');
  if(a>0?!F.s.length:true){p.hidden=true}else{p.hidden=false;p.textContent=t('preview',{n:F.s.length,v:fmt(conv(a,c,S.b)/F.s.length,S.b)})+(c!==S.b?t('prevOrig',{v:fmt(a/F.s.length,c)}):'')}}
function openForm(i){
  if(S.m.length<2){toast(t('need2'));$('#ts-mname').focus();return}
  editIdx=i;var e=i>=0?S.e[i]:null;
  F=e?{k:e.k,p:e.p,s:e.s.slice()}:{k:'food',p:0,s:S.m.map(function(_,j){return j})};
  $('#ts-eamt').value=e?e.a:'';$('#ts-edesc').value=e?e.d:'';
  $('#ts-ecur').innerHTML=curOpts(e?e.c:(S.lc||S.b));$('#ts-edel').hidden=!e;$('#ts-eerr').textContent='';
  drawForm();openDlg();setTimeout(function(){$('#ts-eamt').focus()},60);
}
$('#ts-ecat').addEventListener('click',function(e){var b=e.target.closest('button');if(b){F.k=b.dataset.v;drawForm()}});
$('#ts-epay').addEventListener('click',function(e){var b=e.target.closest('button');if(b){F.p=+b.dataset.v;drawForm()}});
$('#ts-esplit').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var v=+b.dataset.v;
  F.s=F.s.indexOf(v)>=0?F.s.filter(function(x){return x!==v}):F.s.concat([v]).sort(function(x,y){return x-y});drawForm()});
$('#ts-eall').addEventListener('click',function(){F.s=F.s.length===S.m.length?[]:S.m.map(function(_,j){return j});drawForm()});
$('#ts-eamt').addEventListener('input',preview);$('#ts-ecur').addEventListener('change',preview);
$('#ts-close').addEventListener('click',function(){closeDlg()});
dlg.addEventListener('click',function(e){if(e.target===dlg)closeDlg()});
function saveExpense(){
  var a=parseFloat($('#ts-eamt').value.replace(/,/g,'')),c=$('#ts-ecur').value,err=$('#ts-eerr');
  if(!(a>0)){err.textContent=t('errAmt');$('#ts-eamt').focus();return}
  if(!F.s.length){err.textContent=t('errSplit');return}
  var x={d:$('#ts-edesc').value.trim(),a:Math.round(a*100)/100,c:c,p:F.p,s:F.s.slice(),k:F.k,x:editIdx>=0?S.e[editIdx].x:newId(),t:Date.now()};
  var isNew=editIdx<0;if(isNew){S.e.push(x);ga('split_add_expense',{currency:c,item_count:S.e.length})}else S.e[editIdx]=x;
  S.lc=c;save();render();closeDlg();toast(isNew?t('added'):t('updated'));
  if(S.e.length===1)if(!S.u)fetchRates(true);
}
$('#ts-esave').addEventListener('click',saveExpense);
['#ts-eamt','#ts-edesc'].forEach(function(id){$(id).addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();saveExpense()}})});
$('#ts-edel').addEventListener('click',function(){if(editIdx<0)return;S.del=(S.del||[]).concat([S.e[editIdx].x]).slice(-200);S.e.splice(editIdx,1);save();render();closeDlg();toast(t('deleted'))});
$('#ts-add').addEventListener('click',function(){openForm(-1)});
$('#ts-fab-add').addEventListener('click',function(){openForm(-1)});
$('#ts-fab-res').addEventListener('click',function(){$('#ts-res-anchor').scrollIntoView({behavior:'smooth'})});
$('#ts-list').addEventListener('click',function(e){var r=e.target.closest('[data-ed]');if(r)openForm(+r.dataset.ed)});
$('#ts-list').addEventListener('keydown',function(e){if(e.key==='Enter'){var r=e.target.closest('[data-ed]');if(r)openForm(+r.dataset.ed)}});

/* 付款打勾：誰都可以按（旅伴合併帳本時一起合併）；取消時留下刪除紀錄，合併後不會再跑回來 */
$('#ts-result').addEventListener('click',function(e){
  var b=e.target.closest('[data-pay]'),u=e.target.closest('[data-unpay]');if(!(b||u))return;
  if(b){var R=compute(),x=R.tr[+b.dataset.pay];if(!x)return;
    var dec10=Math.pow(10,dec(S.b));S.e.push({d:'',a:Math.round(x.v*dec10)/dec10,c:S.b,p:x.f,s:[x.t],k:'pay',x:newId(),t:Date.now()});
    save();render();var left=compute().tr.length;toast(t('tPaid',{f:S.m[x.f],t:S.m[x.t],v:fmt(x.v,S.b)}));ga('split_mark_paid',{option:'paid',paid_count:compute().pays.length,people_count:left})}
  else{var ix=+u.dataset.unpay,ex=S.e[ix];if(!ex)return;if(!isPay(ex))return;S.del=(S.del||[]).concat([ex.x]).slice(-200);S.e.splice(ix,1);save();render();toast(t('tUnpaid'));ga('split_mark_paid',{option:'unpaid',paid_count:compute().pays.length})}
});

/* 分享試算結果 */
function copy(tx){if(navigator.clipboard)if(window.isSecureContext)return navigator.clipboard.writeText(tx).then(function(){return true},fb);return Promise.resolve(fb());
  function fb(){var a=document.createElement('textarea');a.value=tx;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();var ok=false;try{ok=document.execCommand('copy')}catch(e){}document.body.removeChild(a);return ok}}
function resultText(url){var R=compute(),b=S.b;
  var EC=expCount(),tx=t('rtHead',{t:S.t||t('tripDefault')})+'\n'+t(EC===1?'rtTotal1':'rtTotal',{v:fmt(R.total,b),m:S.m.length,e:EC})+'\n';
  tx+=R.tr.length?R.tr.map(function(x){return t('rtLine',{f:S.m[x.f],t:S.m[x.t],v:fmt(x.v,b)})}).join('\n'):(R.pays.length?'':t('rtEven'));
  if(R.pays.length){tx+=(R.tr.length?'\n\n':'')+t('rtPaidH')+'\n'+R.pays.map(function(x){return t('rtPaidLine',{f:S.m[x.f],t:S.m[x.t],v:fmt(x.v,b)})}).join('\n');
    var lf=[];R.tr.forEach(function(x){if(lf.indexOf(S.m[x.f])<0)lf.push(S.m[x.f])});
    tx+='\n'+(lf.length?t('rtLeft',{l:lf.join(t('sep'))}):t('rtAll'))}
  return tx+(url?'\n\n'+t('rtLink')+url:'')}
$('#ts-share').addEventListener('click',async function(){
  if(!expCount()){toast(t('shareFirst'));return}
  var url=await shareUrl(),info={item_count:expCount(),people_count:S.m.length};
  if(navigator.share)if(matchMedia('(pointer:coarse)').matches){try{await navigator.share({title:t('shareTitle',{t:S.t||t('tripDefault')}),text:resultText(''),url:url});hyTool.share('native','result',info);return}catch(e){if(e.name==='AbortError'){info.method='native';info.content_type='result';ga('share_cancel',info);return}}}
  var ok=await copy(url);toast(ok?t('linkCopied'):t('copyFail'));hyTool.share('copy_link','result',info);
});
$('#ts-copytext').addEventListener('click',async function(){if(!expCount()){toast(t('noExp'));return}
  var ok=await copy(resultText(await shareUrl()));toast(ok?t('textCopied'):t('copyFail2'));hyTool.share('copy_text','result',{item_count:expCount(),people_count:S.m.length,transfers:compute().tr.length})});

/* 聯盟連結 */
[].forEach.call(ROOT.querySelectorAll('[data-aff]'),function(a){
  var k=a.dataset.aff;if(AFF[k])a.href=AFF[k];
  /* 點擊追蹤由統一追蹤碼的 [data-cta] 自動送 cta_click */
});

/* 加到桌面教學：依裝置自動選分頁 */
var tabs=ROOT.querySelectorAll('[data-os]');
function showOS(os){[].forEach.call(tabs,function(x){x.setAttribute('aria-selected',x.dataset.os===os?'true':'false')});[].forEach.call(ROOT.querySelectorAll('[data-panel]'),function(p){p.hidden=p.dataset.panel!==os})}
var ua=navigator.userAgent||'',isIOS=/iPhone|iPad|iPod/.test(ua)||(/Macintosh/.test(ua)?navigator.maxTouchPoints>1:false);
var OS=/CriOS/.test(ua)?'ioschrome':(isIOS?'ios':(/Android/.test(ua)?'android':'pc'));
showOS(OS);
[].forEach.call(tabs,function(x){x.addEventListener('click',function(){showOS(x.dataset.os);ga('install_help',{option:x.dataset.os})})});

/* 追蹤「加到桌面／我的最愛」：
   1. 看到教學區時，把網址改成 …/#app，之後從桌面或書籤打開都會帶著 #app → open_saved_shortcut
   2. 「我加好了」按鈕 → install_done（自行回報）
   3. 電腦按 Ctrl／⌘＋D → bookmark_shortcut */
var TOOL_URL=location.origin+location.pathname;
var SAVED=/^#app/.test(location.hash);try{if(sessionStorage.getItem('ts-sess'))SAVED=false;sessionStorage.setItem('ts-sess','1')}catch(e){}
function markSavable(){var h='#app'+langHash();if(history.replaceState)if(location.hash!==h)history.replaceState(null,'',TOOL_URL+location.search+h)}
var seen=false;
if('IntersectionObserver' in window){new IntersectionObserver(function(es,ob){es.forEach(function(e){if(e.isIntersecting)if(!seen){seen=true;ga('install_view');markSavable();ob.disconnect()}})},{threshold:.3}).observe($('#ts-install'))}
ROOT.addEventListener('click',function(e){var a=e.target.closest('a[href="#ts-install"]');if(a)ga('install_jump')});
$('#ts-installed').addEventListener('click',function(){ga('install_done',{option:ROOT.querySelector('[data-os][aria-selected="true"]').dataset.os});markSavable();toast(t('thanks'))});
document.addEventListener('keydown',function(e){if(e.key)if(e.key.toLowerCase()==='d')if(e.ctrlKey||e.metaKey){markSavable();ga('bookmark_shortcut')}});
if(SAVED){ga('open_saved_shortcut',{option:(window.matchMedia?matchMedia('(display-mode: standalone)').matches:false)||!!navigator.standalone?'standalone':'browser'});hyTool.start('saved')}

/* 若網站之後啟用 PWA（manifest＋service worker），Android／電腦 Chrome 會出現真正的一鍵安裝 */
var deferred=null;
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferred=e;$('#ts-pwa').hidden=false;ga('pwa_available')});
$('#ts-pwa').addEventListener('click',function(){if(!deferred)return;deferred.prompt();deferred.userChoice.then(function(c){ga('pwa_prompt',{result:c.outcome});deferred=null;$('#ts-pwa').hidden=true})});
window.addEventListener('appinstalled',function(){ga('pwa_installed')});

/* 分享工具本身（不含帳本）；外語介面時連結帶語言 */
function toolLink(){return TOOL_URL}
function setLine(){$('#ts-tline').href='https://social-plugins.line.me/lineit/share?url='+encodeURIComponent(toolLink())}
$('#ts-tline').addEventListener('click',function(){hyTool.share('line','tool')});
$('#ts-tcopy').addEventListener('click',function(){copy(toolLink()).then(function(ok){toast(ok?t('urlCopied'):t('copyFail'))});hyTool.share('copy_link','tool')});
$('#ts-tshare').addEventListener('click',function(){
  var tx=t('toolText'),u=toolLink();
  if(navigator.share){navigator.share({title:t('toolTitle'),text:tx,url:u}).then(function(){hyTool.share('native','tool')}).catch(function(){ga('share_cancel',{method:'native',content_type:'tool'})});return}
  hyTool.share('copy_text','tool');
  copy(tx+' '+u).then(function(ok){toast(ok?t('toolCopied'):t('copyFail2'))});
});

/* 範例／重設 */
$('#ts-demo').addEventListener('click',function(){
  if(S.e.length)if(!confirm(t('demoConfirm')))return;
  var D=L('demo');
  backup();S=blank();S.t=D.t;S.m=D.m.slice();
  S.e=[{d:D.d[0],a:96000,c:'JPY',p:0,s:[0,1,2,3],k:'stay'},{d:D.d[1],a:12400,c:'JPY',p:1,s:[0,1,2,3],k:'move'},
    {d:D.d[2],a:28800,c:'JPY',p:2,s:[0,1,2,3],k:'food'},{d:D.d[3],a:31600,c:'JPY',p:3,s:[1,2,3],k:'fun'},
    {d:D.d[4],a:14700,c:'JPY',p:0,s:[0,1,3],k:'food'},{d:D.d[5],a:1800,c:'TWD',p:1,s:[0,1,2,3],k:'move'}];
  S.e.forEach(function(e){e.x=newId();e.t=Date.now()});save();render();toast(t('demoLoaded'));ga('tool_demo');
  if(innerWidth<900)$('#ts-res-anchor').scrollIntoView({behavior:'smooth'});
});
$('#ts-reset').addEventListener('click',function(){if(!confirm(t('resetConfirm')))return;backup();S=blank();save();render();if(history.replaceState)history.replaceState(null,'',location.pathname+location.search);toast(t('resetDone'));ga('tool_reset')});

/* ---------- 備份與還原（取代帳本前自動備份一份） ---------- */
var PREV=KEY+'-prev';
function backup(){try{if(S.e.length)localStorage.setItem(PREV,JSON.stringify(pack()))}catch(e){}showRestore()}
function showRestore(){var has=false;try{has=!!localStorage.getItem(PREV)}catch(e){}$('#ts-restore').hidden=!has}
$('#ts-restore').addEventListener('click',function(){var x=null;try{x=localStorage.getItem(PREV)}catch(e){}if(!x)return;
  var cur=S.e.length?JSON.stringify(pack()):null;S=unpack(JSON.parse(x));
  try{if(cur)localStorage.setItem(PREV,cur);else localStorage.removeItem(PREV)}catch(e){}
  save();render();showRestore();toast(t('tRestored'));ga('restore_ledger')});

/* ---------- 詢問對話框（合併／取代） ---------- */
var mdlg=$('#ts-mdlg');
mdlg.addEventListener('cancel',function(e){e.preventDefault()});
function ask(title,text,note,btns){
  $('#ts-m-t').textContent=title;$('#ts-m-p').textContent=text;$('#ts-m-n').textContent=note||'';$('#ts-m-n').hidden=!note;
  var box=$('#ts-m-b');box.innerHTML='';
  btns.forEach(function(b,i){var el=document.createElement('button');el.type='button';el.className='btn'+(i?' ghost':'');el.textContent=b[0];
    el.addEventListener('click',function(){closeD(mdlg);b[1]()});box.appendChild(el)});
  openD(mdlg);
}
function scrollRes(){setTimeout(function(){$('#ts-res-anchor').scrollIntoView({behavior:'smooth',block:'start'})},300)}
function clearLinkHash(){if(history.replaceState)history.replaceState(null,'',TOOL_URL+location.search+(LANG==='zh'?'':'#l='+LANG))}
function useLedger(n,msg){S=n;save();render();showRestore();if(msg)toast(msg);scrollRes()}
function handleIncoming(I){
  hyTool.start('shared');ga('open_shared',{people_count:I.m.length,item_count:I.e.length});
  var Lc=S;I.lc=Lc.lc;
  if(!Lc.e.length){useLedger(I,t('openShared'));return}
  var same=Lc.i===I.i;if(!same)if(I.legacy||Lc.legacy)same=looksSame(Lc,I);
  if(same){
    var r=mergeLedgers(Lc,I);
    if(!(r.added||r.changed)){toast(r.mine?t('tMineNewer'):t('tUpToDate'));ga('merge_auto',{result:r.mine?'mine_newer':'same'});return}
    if(!r.mine){useLedger(r.S,r.added?t('tMerged',{n:r.added}):t('tUpdated'));ga('merge_auto',{result:'theirs_newer',added:r.added,changed:r.changed});return}
    ga('merge_prompt',{option:'same',added:r.added,mine:r.mine});
    ask(t('mTitleSame'),t('mTextSame',{t:Lc.t||t('untitled'),n:r.added,m:r.mine}),t('mNote'),[
      [t('bMerge'),function(){useLedger(r.S,t('tMerged',{n:r.added}));ga('merge_choice',{option:'merge'})}],
      [t('bUseTheirs'),function(){backup();I.i=Lc.i;useLedger(I,t('openShared'));ga('merge_choice',{option:'theirs'})}],
      [t('bKeepMine'),function(){toast(t('tKept'));ga('merge_choice',{option:'mine'})}]]);
    return;
  }
  ga('merge_prompt',{option:'other'});
  ask(t('mTitleOther'),t('mTextOther',{t1:Lc.t||t('untitled'),t2:I.t||t('untitled'),k:Lc.e.length}),'',[
    [t('bOpenTheirs'),function(){backup();useLedger(I,t('openShared'));ga('merge_choice',{option:'open'})}],
    [t('bKeepMine2'),function(){toast(t('tKept'));ga('merge_choice',{option:'keep'})}]]);
}

/* ---------- 套用語言 ---------- */
function applyLang(){
  ROOT.setAttribute('lang',HTMLLANG[LANG]);
  [].forEach.call(ROOT.querySelectorAll('[data-t]'),function(el){var k=el.getAttribute('data-t'),v=L(k);if(v!==undefined)if(el.innerHTML!==v)el.innerHTML=v});
  [].forEach.call(ROOT.querySelectorAll('[data-tp]'),function(el){el.setAttribute('placeholder',L(el.getAttribute('data-tp')))});
  [].forEach.call(ROOT.querySelectorAll('[data-ta]'),function(el){el.setAttribute('aria-label',L(el.getAttribute('data-ta')))});
  [].forEach.call(ROOT.querySelectorAll('[data-lang]'),function(b){b.setAttribute('aria-pressed',b.dataset.lang===LANG?'true':'false')});
  /* 每個語言各有自己的網址與文章，不再收起文章區 */
  setLine();render();
  if(isOpen())drawForm();
}
ROOT.addEventListener('click',function(e){var b=e.target.closest('[data-lang]');if(!b)return;var nl=b.dataset.lang;if(LANGS.indexOf(nl)<0)return;
  var from=LANG;var via=b.closest('#ts-langtip')?'tip':'switch';LANG=nl;LS_LANG=nl;try{localStorage.setItem('ts-lang',nl)}catch(err){}
  applyLang();ga('lang_switch',{source:via,from_lang:from});
  if(/^#app/.test(location.hash))markSavable();
});

/* 啟動 */
(async function(){
  var m=location.hash.match(/[#\u0026]d=([\w-]+)/),incoming=null,bad=false;
  load();if(S.legacy){S.legacy=false;save()}
  if(m){try{incoming=await decode(m[1])}catch(e){bad=true}}
  applyLang();showRestore();
  if(bad)toast(t('badLink'));
  if(incoming){handleIncoming(incoming);clearLinkHash()}
  else if(!S.u)fetchRates(true);
})();
/* 工具已經開著時再貼上旅伴的連結（只改 # 後面），也要讀進來 */
window.addEventListener('hashchange',async function(){var m=location.hash.match(/[#\u0026]d=([\w-]+)/);if(!m)return;var inc=null;
  try{inc=await decode(m[1])}catch(e){toast(t('badLink'));return}if(inc){handleIncoming(inc);clearLinkHash()}});
}catch(err){if(window.console)console.error('[travel-split] 初始化失敗：',err)}
})();
