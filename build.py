#!/usr/bin/env python3
"""產生 tools.knittinghiyori.com 的中／英／日首頁。
用法：改 tools.json 或下面的 GA_ID／文字 → python3 build.py → git push。
"""
import json, html, datetime, pathlib, re
from urllib.parse import quote

ROOT = pathlib.Path(__file__).parent
SITE = 'https://tools.knittinghiyori.com'
BLOG = 'https://knittinghiyori.com/'
GAMES = 'https://games.knittinghiyori.com/'
PRIVACY = 'https://knittinghiyori.com/privacy-policy/'
GA_ID = 'G-ZQZHTYTRMQ'   # GA4 評估 ID
ADS_CLIENT = 'ca-pub-2022028565680247'   # AdSense 發布商 ID（全站共用）
ADS_SLOT = '3114811513'                  # AdSense 廣告單元「tools」
DRIVE = 'https://emrld.ltd/NTc5OTI2.js?t=579926'   # Travelpayouts Drive（tools 專屬）
VER = datetime.date.today().strftime('%Y%m%d')  # 改版時更新快取
YEAR = datetime.date.today().year

DATA = json.loads((ROOT / 'tools.json').read_text(encoding='utf-8'))['tools']
CATS = ['travel', 'learn', 'life', 'social', 'money', 'work']
ORDER = ['zh', 'en', 'ja']
E = lambda s: html.escape(s, quote=True)

# 每個工具的線條圖示（24×24，stroke 繪製）
ICONS = {
  'kaomoji': '<path d="M9 9.6C7.6 6.4 7.7 2.6 9.1 2.6s2.4 3.6 2 6.7"/><path d="M15 9.6c1.4-3.2 1.3-7-.1-7s-2.4 3.6-2 6.7"/><ellipse cx="12" cy="15.2" rx="7.2" ry="6"/><path d="M9.3 14.4h.01M14.7 14.4h.01" stroke-width="2.6"/><path d="M10.8 17.3q1.2.9 2.4 0"/>',
  'travel_split': '<path d="M3.6 8.4h15.6M15.6 4.8l3.6 3.6-3.6 3.6"/><path d="M20.4 15.6H4.8M8.4 12l-3.6 3.6 3.6 3.6"/>',
  'bill_split': '<path d="M6 2.8h12v18.6l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3z"/><path d="M9 7.5h6M9 11h6M9 14.5h3.5"/>',
  'jr_pass': '<rect x="5" y="2.6" width="14" height="15" rx="4.2"/><path d="M5 10.2h14M10 6h4"/><path d="M8.8 13.9h.01M15.2 13.9h.01" stroke-width="2.4"/><path d="M8.5 21.4l1.8-3.8M15.5 21.4l-1.8-3.8"/>',
  'esim': '<path d="M6.5 2.6h7.6l4.4 4.4v14.4h-12z"/><rect x="9" y="10.8" width="6" height="7.2" rx="1.2"/><path d="M12 10.8v7.2M9 14.4h6"/>',
  'packing_list': '<rect x="3.5" y="7" width="17" height="13.4" rx="2.6"/><path d="M9 7V4.4h6V7M8 7v13.4M16 7v13.4"/>',
  'travel_deals': '<path d="M3 7.6c0-.6.4-1 1-1h16c.6 0 1 .4 1 1V10a2 2 0 0 0 0 4v2.4c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1V14a2 2 0 0 0 0-4z"/><path d="M15.2 6.8v10.4" stroke-dasharray="1.4 2.2"/><path d="M6.8 10.5h5M6.8 13.5h3"/>',
  'japanese_quest': '<path d="M2.8 5.2q9.2 1.8 18.4 0"/><path d="M4.8 9.2h14.4M7 6v15.2M17 6v15.2M12 6.6v2.6"/>',
  'japan_stock': '<path d="M3.5 3.5v17h17"/><path d="M7 15.2l4-4 3 3 5.6-6.4"/><path d="M15.6 7.8h4v4"/>',
  'dca': '<ellipse cx="9" cy="5.8" rx="5.6" ry="2.4"/><path d="M3.4 5.8v4.1c0 1.3 2.5 2.4 5.6 2.4s5.6-1.1 5.6-2.4V5.8M3.4 9.9V14c0 1.3 2.5 2.4 5.6 2.4M3.4 14v4.1c0 1.3 2.5 2.4 5.6 2.4"/><path d="M14.4 20.8l6-6M16.6 14.8h3.8v3.8"/>',
  'youtube_transcript': '<rect x="2.6" y="3.6" width="13" height="10" rx="2.6"/><path d="M8 6.6v4l3.4-2z"/><path d="M2.6 17.6h18.8M2.6 21h11.4M18.6 4.6h2.8M18.6 8.6h2.8M18.6 12.6h2.8"/>',
  'qr_code': '<rect x="3" y="3" width="7" height="7" rx="1.4"/><rect x="14" y="3" width="7" height="7" rx="1.4"/><rect x="3" y="14" width="7" height="7" rx="1.4"/><path d="M14 14h3v3h-3zM20.6 14v.01M17 20.6h3.6V17M14 20.6v.01M6.5 6.5h.01M17.5 6.5h.01M6.5 17.5h.01"/>',
  'business_card_qr': '<rect x="2.5" y="5" width="19" height="14" rx="2.6"/><path d="M6 10h5.6M6 13.4h3.6"/><rect x="14.4" y="9" width="4.2" height="4.2" rx=".6"/>',
  'utm_builder': '<path d="M10 14a4.6 4.6 0 0 0 6.5 0l3-3a4.6 4.6 0 0 0-6.5-6.5l-1 1"/><path d="M14 10a4.6 4.6 0 0 0-6.5 0l-3 3a4.6 4.6 0 0 0 6.5 6.5l1-1"/>',
  'ig_symbols': '<path d="M11 2.8c.5 4.6 1.6 6 6.2 6.6-4.6.5-5.7 2-6.2 6.6-.5-4.6-1.6-6.1-6.2-6.6 4.6-.6 5.7-2 6.2-6.6z"/><path d="M18.4 14.6c.2 1.9.7 2.4 2.6 2.6-1.9.2-2.4.7-2.6 2.6-.2-1.9-.7-2.4-2.6-2.6 1.9-.2 2.4-.7 2.6-2.6z"/>',
  'post_formatter': '<path d="M3.6 5.6h16.8M3.6 10h10.4M3.6 14.4h6.4"/><path d="M13.2 20.8l.8-3.2 5.4-5.4a1.6 1.6 0 0 1 2.3 2.3l-5.4 5.4z"/>',
}
ICONS.update({
  'concert_trip': '<path d="M3 7.5a1.5 1.5 0 0 1 1.5-1.5h15A1.5 1.5 0 0 1 21 7.5v2a2.5 2.5 0 0 0 0 5v2a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 16.5v-2a2.5 2.5 0 0 0 0-5z"/><path d="M15 6v12" stroke-dasharray="1.4 2.2"/><path d="M9 9.6l.9 1.8 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2L6.1 11.7l2-.3z"/>',
  'parking_timer': '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M9.5 17V7.5h3.2a2.9 2.9 0 0 1 0 5.8H9.5"/>',
  'knitting_needles': '<circle cx="9" cy="15" r="5.8"/><path d="M4.4 12.2c2.8 1.3 6.2 1.3 9 0M3.6 16.4c3.2 1.4 7 1.4 10.4-.2"/><path d="M13 10.6 20.8 2.8M15.6 13.6l5.8-5.8"/>',
  'cube_miles': '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  'instant_camera': '<rect x="3" y="3.6" width="18" height="16.8" rx="3"/><circle cx="12" cy="11" r="3.8"/><path d="M3 16.6h18M6.4 7h2.2M16.6 7h.01"/>',
})
FLOWER = '<g fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="24" cy="13" r="8"/><circle cx="34.5" cy="20.6" r="8"/><circle cx="30.5" cy="33" r="8"/><circle cx="17.5" cy="33" r="8"/><circle cx="13.5" cy="20.6" r="8"/></g><circle cx="24" cy="24" r="4.2" fill="currentColor"/>'


def icon(tid, cls='ico'):
    return (f'<svg class="{cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICONS.get(tid, "")}</svg>')


LANGS = {
  'zh': dict(
    path='/', html_lang='zh-Hant-TW', hreflang='zh-Hant', ga_lang='zh-Hant', og_locale='zh_TW', cls='l-zh',
    fonts='family=Noto+Serif+TC:wght@600;900',
    title='免費線上小工具總整理｜分帳計算機、JR Pass、eSIM 比價、QR Code、顏文字',
    desc='{n} 個免費、免註冊、手機好用的線上小工具：旅費與聚餐分帳、JR Pass 與 eSIM 比價、行李清單、織女安檢查詢、小樹點換哩程、拍立得選擇、QR Code、顏文字與 IG 符號，一頁找齊。',
    brand_sub='小工具', label='Free tools — Vol.{y}',
    h1='生活裡<br class="m">用得到的<br class="d"><em>小工具</em>，<br class="m">都在這。',
    lead='出國分帳、比價、做 QR Code、找顏文字。打開就能用，不用註冊，資料留在你自己的手機裡。',
    draw='抽一支今日工具', see_all='看全部工具',
    stats=[('{n}', '個小工具'), ('0', '元，全部免費'), ('0', '次註冊'), ('3', '種語言')],
    hot_l='Popular', hot_h='大家最常打開的三個',
    idx_l='Index', idx_h='全部工具', idx_sub='共 <b id="count">{n}</b> 個',
    search='找工具：分帳、QR、日本…', search_label='搜尋工具',
    cats=dict(all='全部', travel='旅行與出國', learn='學習與語言', life='生活與興趣', social='文字與社群排版', money='理財與投資', work='工作與行銷'),
    recent='最近用過', empty='找不到符合的工具，換個關鍵字試試。', clear='清除搜尋',
    open='打開工具', hot='人氣', ui_ok='', ui_zh='', note='',
    promo_l='Also from Hiyori', promo_t='邊玩邊學日文的小遊戲', promo_s='ひより花店：選假名、學花語、練羅馬拼音。', promo_cta='去玩玩看',
    faq_l='FAQ', faq_h='常見問題',
    faq=[('這些工具要付費或註冊嗎？', '全部免費，也不用註冊或登入，打開網頁就能直接使用。'),
         ('我輸入的資料會被上傳嗎？', '大部分工具都在你的瀏覽器裡計算，分帳、清單這類資料只存在你自己的手機或電腦。需要連網的功能（例如匯率）會在工具頁說明。'),
         ('怎麼把常用的工具放到手機桌面？', 'iPhone 用 Safari 打開工具後按「分享」→「加入主畫面」；Android 用 Chrome 按右上角「⋮」→「加到主畫面」，之後就能像 App 一樣一鍵打開。')],
    share_h='覺得好用，<br>傳給一起出門的朋友。', share_native='分享這一頁', share_copy='複製連結', copied='已複製連結',
    share_text='這裡有一整頁免費小工具：分帳、比價、QR Code、顏文字都有',
    ad_label='廣告', legal='本站使用 Cookie 進行流量分析（Google Analytics）與顯示廣告（Google AdSense），部分連結為旅遊聯盟連結。',
    back='回到部落格', games='小遊戲', privacy='隱私權政策',
    omi=dict(title='今日の道具', sub='搖一搖，抽一支今天適合用的工具。', shake='搖籤中…', luck=['大吉', '中吉', '小吉', '吉', '末吉'],
             pick='今天適合用', go='打開這個工具', again='再抽一次', close='關閉'),
    lang_names=('中', 'EN', '日')),
  'en': dict(
    path='/en/', html_lang='en', hreflang='en', ga_lang='en', og_locale='en_US', cls='l-en', fonts='family=Noto+Serif+TC:wght@900',
    title='Free Online Tools for Travel & Japan | Bill Splitter, JR Pass, eSIM, QR Codes',
    desc='{n} free tools with no sign-up that work well on your phone: split trip and restaurant bills, check whether a JR Pass is worth it, compare eSIM prices, pick an instant camera, make QR codes, copy kaomoji and more.',
    brand_sub='tools', label='Free tools — Vol.{y}',
    h1='Small tools for <em>trips</em> &amp; everyday life.',
    lead='Split costs abroad, compare prices, make a QR code or find the right kaomoji. Free, no account, and your data stays on your phone.',
    draw='Draw today’s tool', see_all='See every tool',
    stats=[('{n}', 'small tools'), ('0', 'cost, all free'), ('0', 'sign-ups'), ('3', 'languages')],
    hot_l='Popular', hot_h='The three people open most',
    idx_l='Index', idx_h='Every tool', idx_sub='<b id="count">{n}</b> tools',
    search='Find a tool: split, QR, Japan…', search_label='Search tools',
    cats=dict(all='All', travel='Travel', learn='Learning', life='Lifestyle', social='Text & social', money='Money', work='Work & marketing'),
    recent='Recently used', empty='No tools match. Try another word.', clear='Clear search',
    open='Open tool', hot='Popular', ui_ok='English inside', ui_zh='Chinese UI',
    note='Most tools are written in Traditional Chinese, but the numbers and buttons are easy to follow. Tools marked “English inside” can switch language in the tool’s top-right corner.',
    promo_l='Also from Hiyori', promo_t='Learn Japanese through small games', promo_s='Hiyori Flower Shop: kana, flower names and romaji typing.', promo_cta='Play',
    faq_l='FAQ', faq_h='Questions',
    faq=[('Are these tools free?', 'Yes. Every tool is free and there is nothing to sign up for. Open the page and start.'),
         ('Is my data uploaded anywhere?', 'Most tools run entirely in your browser, so things like expense lists stay on your own phone or computer. Features that need the internet, such as exchange rates, say so on the tool page.'),
         ('Can I add a tool to my home screen?', 'On iPhone, open the tool in Safari and tap Share → Add to Home Screen. On Android, open it in Chrome and tap ⋮ → Add to Home screen. It will then open like an app.')],
    share_h='Useful? Send it to<br>the friend you travel with.', share_native='Share this page', share_copy='Copy link', copied='Link copied',
    share_text='A page of free tools: bill splitting, price comparisons, QR codes and kaomoji',
    ad_label='Advertisement', legal='This site uses cookies for analytics (Google Analytics) and ads (Google AdSense), and some links are travel affiliate links.',
    back='Back to the blog', games='Games', privacy='Privacy',
    omi=dict(title='Today’s tool', sub='Shake the box and draw a tool for today, omikuji style.', shake='Shaking…', luck=['Great luck', 'Good luck', 'Small luck', 'Luck', 'Late luck'],
             pick='Today, try', go='Open this tool', again='Draw again', close='Close'),
    lang_names=('中', 'EN', '日')),
  'ja': dict(
    path='/ja/', html_lang='ja', hreflang='ja', ga_lang='ja', og_locale='ja_JP', cls='l-ja',
    fonts='family=Noto+Serif+JP:wght@600;900',
    title='無料オンラインツール集｜割り勘計算・JRパス・eSIM比較・QRコード・顔文字',
    desc='登録不要・スマホで使いやすい無料ツール{n}種類。旅行や飲み会の割り勘計算、JRパスの損得計算、eSIMの料金比較、チェキ選び、QRコード作成、顔文字コピーなどを1ページにまとめました。',
    brand_sub='ツール', label='Free tools — Vol.{y}',
    h1='暮らしと旅に<br>効く、<em>小さな道具</em>。',
    lead='海外旅行の割り勘、料金比較、QRコード作成、顔文字さがし。登録なしですぐ使えて、データはあなたのスマホに残ります。',
    draw='今日の道具をひく', see_all='すべて見る',
    stats=[('{n}', 'の小さな道具'), ('0', '円・すべて無料'), ('0', '回の登録'), ('3', 'つの言語')],
    hot_l='Popular', hot_h='いちばん使われている3つ',
    idx_l='Index', idx_h='すべての道具', idx_sub='全 <b id="count">{n}</b> 種類',
    search='ツールを検索：割り勘、QR、日本…', search_label='ツールを検索',
    cats=dict(all='すべて', travel='旅行・海外', learn='学習・語学', life='暮らし・趣味', social='文字・SNS', money='お金・投資', work='仕事・マーケ'),
    recent='最近使った道具', empty='該当するツールがありません。別のキーワードでお試しください。', clear='検索をクリア',
    open='ツールを開く', hot='人気', ui_ok='日本語対応', ui_zh='中国語UI',
    note='多くのツールは繁体字中国語で書かれていますが、数字やボタンは直感的に使えます。「日本語対応」のツールは、画面右上で日本語に切り替えられます。',
    promo_l='Also from Hiyori', promo_t='あそびながら日本語をまなぶゲーム', promo_s='ひより花店：かな選び・花言葉・ローマ字タイピング。', promo_cta='あそぶ',
    faq_l='FAQ', faq_h='よくある質問',
    faq=[('料金や会員登録は必要ですか？', 'すべて無料で、登録やログインも不要です。ページを開けばすぐに使えます。'),
         ('入力したデータはアップロードされますか？', 'ほとんどのツールはブラウザの中だけで計算するため、割り勘や持ち物リストのデータはご自身のスマホやパソコンに保存されます。為替レートなど通信が必要な機能は、各ツールのページで説明しています。'),
         ('よく使うツールをホーム画面に追加できますか？', 'iPhoneはSafariでツールを開き「共有」→「ホーム画面に追加」。AndroidはChromeで「⋮」→「ホーム画面に追加」。アプリのようにワンタップで開けます。')],
    share_h='便利だったら、<br>旅の相棒にシェア。', share_native='このページをシェア', share_copy='リンクをコピー', copied='リンクをコピーしました',
    share_text='割り勘・料金比較・QRコード・顔文字がそろった無料ツール集',
    ad_label='広告', legal='当サイトはアクセス解析（Google Analytics）と広告配信（Google AdSense）のためにCookieを使用し、一部に旅行系アフィリエイトリンクを含みます。',
    back='ブログへ戻る', games='ゲーム', privacy='プライバシーポリシー',
    omi=dict(title='今日の道具', sub='箱をふって、今日のおすすめツールをひこう。', shake='ふっています…', luck=['大吉', '中吉', '小吉', '吉', '末吉'],
             pick='今日のおすすめ', go='このツールを開く', again='もう一度ひく', close='閉じる'),
    lang_names=('中', 'EN', '日')),
}


for _L in LANGS.values():
    _L['desc'] = _L['desc'].format(n=len(DATA))


def url_for(t, lang):
    return (t.get('alt') or {}).get(lang) or t['url']


def tags_for(t, lang, L, with_hot=True):
    tags = []
    if with_hot and t.get('hot'):
        tags.append(f'<span class="tag hot">{L["hot"]}</span>')
    if t.get('new'):
        tags.append('<span class="tag hot">NEW</span>')
    if lang != 'zh':
        native = lang in t.get('ui', []) or lang in (t.get('alt') or {})
        tags.append(f'<span class="tag ok">{L["ui_ok"]}</span>' if native else f'<span class="tag">{L["ui_zh"]}</span>')
    tags += [f'<span class="tag">{L["cats"][c]}</span>' for c in t['cats']]
    return ''.join(tags)


def row(i, t, lang, L):
    name, desc = t[lang]
    q = ' '.join(t[l][0] + ' ' + t[l][1] for l in ORDER) + ' ' + t['id'] + ' ' + ' '.join(t['cats'])
    return (f'<li class="row" data-id="{t["id"]}" data-cats="{" ".join(t["cats"])}" data-q="{E(q)}" style="view-transition-name:t-{t["id"]}">'
            f'<a href="{E(url_for(t, lang))}">'
            f'<span class="no">{i:02d}</span>{icon(t["id"])}'
            f'<span class="txt"><span class="nm">{E(name)}</span><span class="ds">{E(desc)}</span>'
            f'<span class="tags">{tags_for(t, lang, L)}</span></span>'
            f'<svg class="arr" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></li>')


def feat(i, t, lang, L, k):
    name, desc = t[lang]
    return (f'<li class="feat f{k}" data-id="{t["id"]}"><a href="{E(url_for(t, lang))}" data-src="feat">'
            f'<span class="fbig" aria-hidden="true">{i:02d}</span><span class="fno">No.{i:02d}</span>{icon(t["id"], "fico")}'
            f'<span class="fnm">{E(name)}</span><span class="fds">{E(desc)}</span>'
            f'<span class="tags">{tags_for(t, lang, L, False)}</span>'
            f'<span class="fgo">{L["open"]}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a></li>')


def head(L, title, desc, canonical, extra='', glyphs='', page_title='工具|工具總覽|免費線上小工具'):
    alts = ''.join(f'<link rel="alternate" hreflang="{LANGS[l]["hreflang"]}" href="{SITE}{LANGS[l]["path"]}">' for l in ORDER)
    alts += f'<link rel="alternate" hreflang="x-default" href="{SITE}/">'
    ga = '' if GA_ID.startswith('G-XXXX') else (
        f'<script async src="https://www.googletagmanager.com/gtag/js?id={GA_ID}"></script>'
        f'<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments)}}gtag("js",new Date());'
        f'gtag("set",{{content_group:"tool",tool_id:"hub",page_lang:"{L["ga_lang"]}",page_title:"{page_title}"}});'
        f'gtag("config","{GA_ID}");</script>')
    latin = 'family=Instrument+Serif:ital@0;1&family=IBM+Plex+Mono:wght@400;500'
    cjk = ''
    if L['fonts'] and glyphs:
        # 中日文襯線只載入本頁標題實際用到的字（text= 子集），避免數 MB 字型拖慢 LCP
        cjk = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{L["fonts"]}&text={quote("".join(sorted(set(glyphs))))}&display=swap">'
    return f'''<!doctype html>
<html lang="{L["html_lang"]}" class="{L["cls"]}">
<head>
<meta charset="utf-8">
<script data-cfasync="false" data-cmp-ab="2">(function(){{var s=document.createElement("script");s.async=1;s.setAttribute("data-cmp-ab","2");s.src="{DRIVE}";document.head.appendChild(s)}})();</script>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{E(title)}</title>
<meta name="description" content="{E(desc)}">
<link rel="canonical" href="{canonical}">
{alts}
<meta name="theme-color" content="#ffffff">
<meta name="color-scheme" content="light">
<meta property="og:type" content="website">
<meta property="og:site_name" content="knittinghiyori tools">
<meta property="og:title" content="{E(title)}">
<meta property="og:description" content="{E(desc)}">
<meta property="og:url" content="{canonical}">
<meta property="og:locale" content="{L["og_locale"]}">
<meta name="twitter:card" content="summary">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="https://games.knittinghiyori.com/icons/favicon-32.png">
<link rel="icon" type="image/png" sizes="96x96" href="https://games.knittinghiyori.com/icons/favicon-96.png">
<link rel="icon" type="image/png" sizes="192x192" href="https://games.knittinghiyori.com/icons/icon-192.png">
<link rel="apple-touch-icon" href="https://games.knittinghiyori.com/icons/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{latin}&display=swap">
{cjk}
<link rel="stylesheet" href="/assets/style.css?v={VER}">
<script>document.documentElement.classList.add('js')</script>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" crossorigin="anonymous"></script>
{ga}{extra}
</head>'''


# ---- 工具頁共用頁首（2026-10-04 統一）：logo＋編織日和・小工具／No.XX · 分類／麵包屑 ----
BRAND = {'zh': '編織日和・小工具', 'en': 'Knitting Hiyori · Tools', 'ja': '編織日和・ツール'}
CRUMB_HOME = {'zh': '小工具', 'en': 'Tools', 'ja': 'ツール'}
LOGO = '/assets/logo.webp'


def tool_no(tool_id):
    """工具編號＝總覽頁 tools.json 的順序（和總覽頁卡片上的 No. 一致）"""
    return next(i for i, t in enumerate(DATA, 1) if t['id'] == tool_id)


def brand_link(lang, extra_attrs=''):
    L = LANGS[lang]
    return (f'<a class="brand k-brandlogo" href="{L["path"]}" data-cta="header_hub" data-cta-type="tool" data-google-vignette="false"{extra_attrs} '
            f'style="display:inline-flex;align-items:center;gap:8px;text-decoration:none">'
            f'<img src="{LOGO}" width="28" height="28" alt="" style="width:28px;height:28px;border-radius:6px;flex:none">'
            f'<span>{BRAND[lang]}</span></a>')


def tool_head(lang, tool_id, name, after_crumb=''):
    """工具頁頁首＋麵包屑。after_crumb：放在麵包屑右邊（例：三語工具的語言切換）"""
    L = LANGS[lang]
    t = next(x for x in DATA if x['id'] == tool_id)
    cat = L['cats'][t['cats'][0]]
    return ('<!--k-head:start（build.py 產生，請勿手改）-->\n'
            f'<header class="k-head">{brand_link(lang)}'
            f'<span class="k-label">No.{tool_no(tool_id):02d} · {cat}</span></header>\n'
            f'<div class="k-crumbrow" style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:4px 12px">'
            f'<nav class="k-crumb" aria-label="{"麵包屑" if lang == "zh" else ("Breadcrumb" if lang == "en" else "パンくずリスト")}">'
            f'<a href="{L["path"]}" data-cta="back_hub" data-cta-type="tool" data-google-vignette="false">{CRUMB_HOME[lang]}</a> / {cat} / {E(name)}</nav>'
            f'{after_crumb}</div>\n<!--k-head:end-->')


def stamp_page_heads():
    """只有中文、直接放進 repo 的工具頁（tools.json 有 "page"）：把頁首換成共用版"""
    pat = re.compile(r'(?:<!--k-head:start.*?<!--k-head:end-->|<header class="k-head">.*?</header>\s*<nav class="k-crumb"[^>]*>.*?</nav>)', re.S)
    for t in DATA:
        if not t.get('page'):
            continue
        f = ROOT / t['page'] / 'index.html'
        if not f.exists():
            print('⚠ 找不到', f); continue
        s = f.read_text(encoding='utf-8')
        new, n = pat.subn(lambda m: tool_head('zh', t['id'], t['zh'][0]), s, count=1)
        if n:
            f.write_text(new, encoding='utf-8')
        else:
            print('⚠ 沒找到頁首可替換：', f)


def header(lang):
    L = LANGS[lang]
    langs = ''.join(
        f'<a href="{LANGS[l]["path"]}" hreflang="{LANGS[l]["hreflang"]}" lang="{LANGS[l]["html_lang"]}"'
        + (' aria-current="page"' if l == lang else '') + f'>{n}</a>'
        for l, n in zip(ORDER, L['lang_names']))
    return (f'<header class="top"><div class="wrap">'
            + brand_link(lang) +
            f'<nav class="langs" aria-label="Language">{langs}</nav></div></header>')


def stamp(cls=''):
    return (f'<svg class="stamp {cls}" viewBox="0 0 160 160" aria-hidden="true"><defs><path id="sc{cls}" d="M80 80m-60 0a60 60 0 1 1 120 0a60 60 0 1 1-120 0"/></defs>'
            f'<g class="spin"><text><textPath href="#sc{cls}" textLength="372" lengthAdjust="spacing">FREE · NO SIGN-UP · ZH / EN / JA · ON YOUR PHONE · </textPath></text></g>'
            '<circle cx="80" cy="80" r="40"/><text class="c" x="80" y="80">道具</text></svg>')


def footer(lang):
    L = LANGS[lang]
    return f'''<footer class="foot"><div class="wrap">
<p class="foot-h reveal">{L["share_h"]}</p>
<div class="share reveal">
<a href="#" class="btn main" data-share="native">{L["share_native"]}</a>
<a href="#" class="btn" data-share="line" target="_blank" rel="noopener">LINE</a>
<a href="#" class="btn" data-share="facebook" target="_blank" rel="noopener">Facebook</a>
<a href="#" class="btn" data-share="threads" target="_blank" rel="noopener">Threads</a>
<a href="#" class="btn" data-share="x" target="_blank" rel="noopener">X</a>
<button type="button" class="btn" data-share="copy">{L["share_copy"]}</button>
</div>
<div class="foot-bar">
<nav class="foot-links"><a href="{BLOG}" data-cta="footer_blog" data-cta-type="article">↖ {L["back"]}</a><a href="{GAMES}" data-cta="footer_games" data-cta-type="game">{L["games"]}</a><a href="{PRIVACY}">{L["privacy"]}</a></nav>
<p class="copy">© {YEAR} knittinghiyori · Zoe</p>
</div>
<p class="kh-legal">{L["legal"]}<a href="{PRIVACY}">{L["privacy"]}</a></p>
</div>
<p class="word" aria-hidden="true">knitting<i>hiyori</i></p>
</footer>
<div class="toast" id="toast" role="status" aria-live="polite"></div>'''


def omikuji(L):
    o = L['omi']
    return f'''<dialog class="omi" id="omi" aria-labelledby="omi-t">
<button type="button" class="omi-x" data-omi="close" aria-label="{o["close"]}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
<p class="lbl">Omikuji</p>
<h2 id="omi-t">{o["title"]}</h2>
<p class="omi-sub" id="omi-sub">{o["sub"]}</p>
<div class="omi-stage">
<svg class="omi-box" viewBox="0 0 120 170" aria-hidden="true">
<rect class="stick" x="55" y="40" width="10" height="70" rx="2"/>
<path class="box" d="M28 52h64l-6 110H34z"/>
<path d="M28 52h64" class="rim"/>
<text x="60" y="104" class="kan">籤</text>
</svg>
<div class="omi-res" id="omi-res" hidden>
<p class="luck" id="omi-luck"></p>
<p class="pick">{o["pick"]}</p>
<div class="omi-card" id="omi-card"></div>
</div>
</div>
<div class="omi-act">
<a class="btn main" id="omi-go" href="#" hidden>{o["go"]}</a>
<button type="button" class="btn" id="omi-again" hidden>{o["again"]}</button>
</div>
</dialog>'''


def page(lang):
    L = LANGS[lang]
    n = len(DATA)
    canonical = SITE + L['path']
    rows = '\n'.join(row(i + 1, t, lang, L) for i, t in enumerate(DATA))
    hots = [(i + 1, t) for i, t in enumerate(DATA) if t.get('hot')][:3]
    feats = '\n'.join(feat(i, t, lang, L, k) for k, (i, t) in enumerate(hots))
    counts = {c: sum(c in t['cats'] for t in DATA) for c in CATS}
    tabs = f'<button type="button" class="tab" data-cat="all" aria-pressed="true">{L["cats"]["all"]}<sup>{n}</sup></button>' + ''.join(
        f'<button type="button" class="tab" data-cat="{c}" aria-pressed="false">{L["cats"][c]}<sup>{counts[c]}</sup></button>' for c in CATS)
    stats = ''.join(f'<li><b data-count="{v.format(n=n)}">{v.format(n=n)}</b><span>{s}</span></li>' for v, s in L['stats'])
    marquee_items = ''.join(f'<span>{E(t[l][0])}</span><i aria-hidden="true">✳</i>' for t in DATA for l in [lang] + [x for x in ORDER if x != lang][:1])
    faq = ''.join(f'<details><summary><span>{E(q)}</span><i aria-hidden="true"></i></summary><div><p>{E(a)}</p></div></details>' for q, a in L['faq'])
    note = f'<p class="note">{E(L["note"])}</p>' if L['note'] else ''
    tip = ''
    if lang == 'zh':
        tip = ('<div class="langtip" id="langtip" hidden><a href="/en/" data-to="en" hidden>Prefer English? <u>Switch</u> →</a>'
               '<a href="/ja/" data-to="ja" hidden>日本語で見る →</a><button type="button" class="x" aria-label="close">×</button></div>')
    ld = {
        '@context': 'https://schema.org',
        '@graph': [
            {'@type': 'CollectionPage', '@id': canonical + '#page', 'url': canonical, 'name': L['title'],
             'description': L['desc'], 'inLanguage': L['html_lang'],
             'isPartOf': {'@type': 'WebSite', 'name': 'knittinghiyori', 'url': BLOG},
             'author': {'@type': 'Person', 'name': 'Zoe', 'url': BLOG},
             'dateModified': datetime.date.today().isoformat(),
             'mainEntity': {'@id': canonical + '#list'}},
            {'@type': 'ItemList', '@id': canonical + '#list', 'numberOfItems': n,
             'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'name': t[lang][0], 'url': url_for(t, lang)}
                                 for i, t in enumerate(DATA)]},
            {'@type': 'FAQPage', 'mainEntity': [{'@type': 'Question', 'name': q,
              'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in L['faq']]},
        ]}
    tools_js = {t['id']: {'n': t[lang][0], 'd': t[lang][1], 'u': url_for(t, lang), 'i': ICONS.get(t['id'], '')} for t in DATA}
    hub = {'lang': L['ga_lang'], 't': {'copied': L['copied'], 'shareText': L['share_text'], 'luck': L['omi']['luck'],
                                         'shake': L['omi']['shake'], 'sub': L['omi']['sub']}, 'tools': tools_js}
    extra = '<script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False) + '</script>'
    other = 'zh' if lang != 'zh' else 'en'
    glyphs = (re.sub('<[^>]+>', '', L['h1'] + L['share_h']) + L['hot_h'] + L['idx_h'] + L['promo_t'] + L['faq_h']
              + L['omi']['title'] + ''.join(L['omi']['luck']) + '道具'
              + ''.join(t[lang][0] + t[other][0] for t in DATA))
    return vignette(f'''{head(L, L["title"], L["desc"], canonical, extra, glyphs)}
<body>
<a class="skip" href="#index">Skip to tools</a>
{header(lang)}
<main>
<section class="hero"><div class="wrap">
<p class="lbl hero-l"><span>{L["label"].format(y=YEAR)}</span><span>No.01—{n:02d}</span></p>
<h1 class="h1">{L["h1"]}</h1>
{stamp('sd')}
<div class="hero-b">
<p class="lead">{L["lead"]}</p>
<div class="hero-cta"><button type="button" class="btn main big" data-omi="open"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 10h11l-1.2 11H7.7z"/><path d="M11 10V3.5h2V10"/><path d="M14.5 5.5l2-2M17 7.5h2"/></svg>{L["draw"]}</button><a class="btn big ghost" href="#index">{L["see_all"]}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg></a></div>
{tip}
</div>
<div class="stw">{stamp('sm')}<ul class="stats">{stats}</ul></div>
</div></section>
<div class="marquee" aria-hidden="true"><div class="mq">{marquee_items}{marquee_items}</div></div>

<section class="sec hot"><div class="wrap">
<div class="sh reveal"><p class="lbl">§ 01 — {L["hot_l"]}</p><h2>{L["hot_h"]}</h2></div>
<ul class="feats">{feats}</ul>
</div></section>

<section class="sec idx" id="index"><div class="wrap">
<div class="sh reveal"><p class="lbl">§ 02 — {L["idx_l"]}</p><h2>{L["idx_h"]} <small>{L["idx_sub"].format(n=n)}</small></h2></div>
<div class="recent" id="recent" hidden><span class="lbl">{L["recent"]}</span><div class="rc" id="recent-list"></div></div>
<div class="controls" id="controls">
<label class="search"><span class="sr">{L["search_label"]}</span>
<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
<input id="q" type="search" placeholder="{E(L["search"])}" autocomplete="off" enterkeyhint="search">
<kbd aria-hidden="true">/</kbd></label>
<div class="tabs" role="group" aria-label="{E(L["search_label"])}">{tabs}<span class="ind" aria-hidden="true"></span></div>
</div>
{note}
<ul class="rows" id="all">
{rows}
</ul>
<div class="empty" id="empty" hidden><p>{L["empty"]}</p><button type="button" class="btn" id="clear">{L["clear"]}</button></div>
</div></section>

<aside class="sec kh-ad-wrap" aria-label="{L["ad_label"]}"><div class="wrap"><div class="kh-ad"><p class="kh-ad-l">{L["ad_label"]}</p>
<ins class="adsbygoogle" style="display:block" data-ad-client="{ADS_CLIENT}" data-ad-slot="{ADS_SLOT}" data-ad-format="auto" data-full-width-responsive="true"></ins>
<script>(adsbygoogle=window.adsbygoogle||[]).push({{}});</script></div></div></aside>

<section class="sec promo"><div class="wrap">
<a class="pcard reveal" href="{GAMES}" data-cta="promo_games" data-cta-type="game">
<span class="lbl">{L["promo_l"]}</span>
<svg class="flower" viewBox="0 0 48 48" aria-hidden="true">{FLOWER}</svg>
<span class="pt">{L["promo_t"]}</span><span class="ps">{L["promo_s"]}</span>
<span class="fgo">{L["promo_cta"]}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
</a>
</div></section>

<section class="sec faq"><div class="wrap">
<div class="sh reveal"><p class="lbl">§ 03 — {L["faq_l"]}</p><h2>{L["faq_h"]}</h2></div>
<div class="qa">{faq}</div>
</div></section>
</main>
{footer(lang)}
{omikuji(L)}
<script>window.HUB={json.dumps(hub, ensure_ascii=False)};</script>
<script src="/assets/app.js?v={VER}" defer></script>
</body>
</html>
''')


def vignette(h):
    # 所有連結標記 data-google-vignette="false"（比照 games／poem：不出現插頁式廣告）
    return h.replace('<a ', '<a data-google-vignette="false" ')


def notfound():
    L = LANGS['zh']
    return vignette(f'''{head(L, '找不到這個頁面｜knittinghiyori 小工具', '這個網址不存在，回到工具總覽看看所有免費小工具。', SITE + '/', '<meta name="robots" content="noindex">', '找不到這個頁面', '工具|找不到頁面|404')}
<body>
{header('zh')}
<main class="nf"><div class="wrap">
<p class="lbl">Error — 404</p>
<p class="nf-big">4<span>0</span>4</p>
<h1>找不到這個頁面</h1>
<p class="lead">Page not found ・ ページが見つかりません</p>
<div class="hero-cta"><a class="btn main big" href="/">看所有工具</a><a class="btn big" href="/en/">English</a><a class="btn big" href="/ja/">日本語</a></div>
</div></main>
</body>
</html>
''')


FAVICON = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#111"/>'
           '<circle cx="32" cy="32" r="17" fill="none" stroke="#e5412d" stroke-width="5"/><circle cx="32" cy="32" r="5" fill="#fff"/></svg>')


def main():
    for lang in ORDER:
        out = ROOT / 'index.html' if lang == 'zh' else ROOT / lang / 'index.html'
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(page(lang), encoding='utf-8')
    (ROOT / '404.html').write_text(notfound(), encoding='utf-8')
    stamp_page_heads()
    import tool_pages, sys
    groups = tool_pages.build_all(sys.modules[__name__])
    today = datetime.date.today().isoformat()

    def url_group(paths, x_default):
        alts = ''.join(f'<xhtml:link rel="alternate" hreflang="{LANGS[l]["hreflang"]}" href="{SITE}{paths[l]}"/>' for l in ORDER)
        alts += f'<xhtml:link rel="alternate" hreflang="x-default" href="{SITE}{x_default}"/>'
        return ''.join(f'<url><loc>{SITE}{paths[l]}</loc><lastmod>{today}</lastmod>{alts}</url>' for l in ORDER)
    urls = url_group({l: LANGS[l]['path'] for l in ORDER}, '/')
    for g in groups:
        urls += url_group(g['paths'], g['paths']['zh'])
    # 只有中文版、直接放進 repo 的工具頁（tools.json 有 "page"）
    for t in DATA:
        if t.get('page'):
            urls += f'<url><loc>{SITE}/{t["page"]}/</loc><lastmod>{today}</lastmod></url>'
    (ROOT / 'sitemap.xml').write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
        'xmlns:xhtml="http://www.w3.org/1999/xhtml">' + urls + '</urlset>\n', encoding='utf-8')

    # llms.txt：給 AI 搜尋與助理讀的網站摘要（GEO）
    names = {'travel': '旅行與出國', 'learn': '學習與語言', 'life': '生活與興趣', 'social': '文字與社群排版', 'money': '理財與投資', 'work': '工作與行銷'}
    lines = ['# knittinghiyori tools（編織日和・免費小工具）', '',
             '> 編織日和（knittinghiyori.com）作者 Zoe 製作的免費線上小工具，全部免註冊、在瀏覽器中執行、手機好用。介面有繁體中文、英文、日文。', '',
             '- 工具總覽（中文）：' + SITE + '/', '- Tools hub (English): ' + SITE + '/en/', '- ツール一覧（日本語）：' + SITE + '/ja/', '']
    for c, cn in names.items():
        items = [t for t in DATA if t['cats'][0] == c]
        if not items:
            continue
        lines.append(f'## {cn}')
        for t in items:
            extra = ''
            if t.get('alt'):
                extra = '（' + '、'.join(f'{k}: {v}' for k, v in t['alt'].items()) + '）'
            lines.append(f"- [{t['zh'][0]}]({t['url']})：{t['zh'][1]}{extra}")
        lines.append('')
    lines += ['## 關於', '- 部落格：' + BLOG, '- 小遊戲：' + GAMES, '- 隱私權政策：' + PRIVACY, '']
    (ROOT / 'llms.txt').write_text('\n'.join(lines), encoding='utf-8')
    (ROOT / 'robots.txt').write_text(f'User-agent: *\nAllow: /\nDisallow: /_src/\nDisallow: /wp-src/\n\nSitemap: {SITE}/sitemap.xml\n', encoding='utf-8')
    (ROOT / 'CNAME').write_text('tools.knittinghiyori.com\n', encoding='utf-8')
    (ROOT / '.nojekyll').write_text('', encoding='utf-8')
    print('built', len(DATA), 'tools ×', len(ORDER), 'languages', '(GA4 未設定)' if GA_ID.startswith('G-XXXX') else '')


if __name__ == '__main__':
    main()
