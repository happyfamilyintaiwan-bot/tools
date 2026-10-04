"""工具頁產生器：把 _src/<工具>/ 的原始檔組成中／英／日三個網址。
由 build.py 呼叫，不用單獨執行。

_src/<工具>/ 需要的檔案：
  meta.json   網址、三語標題與描述、相關工具、延伸閱讀
  top.html    工具上半部（標題、說明、操作區），中文
  art.zh.html／art.en.html／art.ja.html   教學與 FAQ（各語言各一份；<!--AD--> 是廣告位置）
  install.html  收藏＆分享區（放在頁面最下面），中文
  tail.html   浮動按鈕、對話框等，中文
  i18n.json   工具介面的英日翻譯（data-t／data-tp／data-ta 對應的字串）
  style.css、main.js
"""
import json, html, re, shutil, datetime
from urllib.parse import quote
from bs4 import BeautifulSoup

SHELL = {
  'zh': dict(tools='小工具', more_l='More tools', more_h='旅行時也用得到', blog_l='From the blog', blog_h='編織日和部落格・延伸閱讀',
             blog_note='', blog_more='看更多部落格文章', hub_l='All tools', hub_t='看全部 {n} 個免費小工具', hub_s='分帳、比價、QR Code、顏文字，一頁找齊。',
             games_l='Games', games_t='休息一下：邊玩邊學日文', games_s='ひより花店：選假名、學花語、練羅馬拼音。', go='前往 →',
             keep_l='Save & share', updated='更新', ui_ok='', ui_zh='', ad='廣告', crumb='麵包屑導覽'),
  'en': dict(tools='Tools', more_l='More tools', more_h='Also handy for your trip', blog_l='From the blog', blog_h='Further reading on knittinghiyori',
             blog_note='Blog articles are written in Traditional Chinese.', blog_more='More articles on the blog', hub_l='All tools', hub_t='See all {n} free tools', hub_s='Bill splitting, price comparisons, QR codes, kaomoji and more.',
             games_l='Games', games_t='Take a break: learn Japanese with mini games', games_s='Hiyori Flower Shop: kana, flower names and romaji typing.', go='Open →',
             keep_l='Save & share', updated='Updated', ui_ok='English inside', ui_zh='Chinese UI', ad='Advertisement', crumb='Breadcrumb'),
  'ja': dict(tools='ツール', more_l='More tools', more_h='旅行で役立つほかのツール', blog_l='From the blog', blog_h='ブログ「編織日和」の関連記事',
             blog_note='ブログ記事は繁体字中国語で書かれています。', blog_more='ブログの記事をもっと見る', hub_l='All tools', hub_t='無料ツール全{n}種類を見る', hub_s='割り勘・料金比較・QRコード・顔文字などを1ページに。',
             games_l='Games', games_t='ひと休み：ゲームで日本語をまなぶ', games_s='ひより花店：かな選び・花言葉・ローマ字タイピング。', go='開く →',
             keep_l='Save & share', updated='更新', ui_ok='日本語対応', ui_zh='中国語UI', ad='広告', crumb='パンくずリスト'),
}


def _frag(s):
    return BeautifulSoup(s, 'html.parser')


def translate(fragment, lang, I18N):
    """把 data-t／data-tp／data-ta 換成該語言的字串（中文維持原樣）。"""
    if lang == 'zh':
        return fragment
    d = I18N[lang]
    soup = _frag(fragment)
    for el in soup.select('[data-t]'):
        k = el['data-t']
        if k in d:
            el.clear()
            el.append(_frag(d[k]))
    for el in soup.select('[data-tp]'):
        if el['data-tp'] in d:
            el['placeholder'] = d[el['data-tp']]
    for el in soup.select('[data-ta]'):
        if el['data-ta'] in d:
            el['aria-label'] = d[el['data-ta']]
    # 執行時才填入、沒有 data-t 的幾個預設字
    fixes = {'#ts-dlg-t': 'dlgNew', '#ts-eall': 'selAll', '#ts-fab-l': 'fabNone', '#ts-close': None}
    for sel, k in fixes.items():
        el = soup.select_one(sel)
        if el is not None and k and k in d:
            el.string = d[k]
    h4 = soup.select_one('#ts-h4')
    if h4 is not None and 'recoH' in d:
        h4.clear()
        h4.append(_frag(html.escape(d['recoH']).replace('{x}', '<span id="ts-dest">' + html.escape(d['destAny']) + '</span>')))
    return str(soup)


def faq_and_howto(art):
    soup = _frag(art)
    faq = [(d.summary.get_text(' ', strip=True), d.find('div').get_text(' ', strip=True)) for d in soup.find_all('details')]
    steps = []
    ol = soup.find('ol')
    if ol:
        for i, li in enumerate(ol.find_all('li', recursive=False)):
            st = li.find('strong')
            name = st.get_text(strip=True).rstrip('：:').strip() if st else ''
            if st:
                st.extract()
            steps.append({'@type': 'HowToStep', 'position': i + 1, 'name': name, 'text': li.get_text(' ', strip=True)})
    return faq, steps


def build_all(B):
    """B 是 build.py 模組本身（共用設定、圖示、hub 的語言設定）。回傳 sitemap 用的網址群組。"""
    groups = []
    for t in B.DATA:
        if not t.get('src'):
            continue
        groups.append(build_tool(B, t))
    return groups


def build_tool(B, tool):
    src = B.ROOT / '_src' / tool['src']
    M = json.loads((src / 'meta.json').read_text(encoding='utf-8'))
    I18N = json.loads((src / 'i18n.json').read_text(encoding='utf-8'))
    slug = M['slug']
    paths = {l: (B.LANGS[l]['path'] + slug + '/') for l in B.ORDER}
    asset_dir = B.ROOT / 'assets' / 'tools'
    asset_dir.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(src / 'style.css', asset_dir / f'{tool["src"]}.css')
    shutil.copyfile(src / 'main.js', asset_dir / f'{tool["src"]}.js')
    parts = {k: (src / f'{k}.html').read_text(encoding='utf-8') for k in ('top', 'install', 'tail')}
    n_tools = len(B.DATA)
    by_id = {t['id']: t for t in B.DATA}

    for lang in B.ORDER:
        L, H, S = M['lang'][lang], B.LANGS[lang], SHELL[lang]
        canonical = B.SITE + paths[lang]
        art = (src / f'art.{lang}.html').read_text(encoding='utf-8')
        faq, steps = faq_and_howto(art)
        ad = (f'<aside class="kh-ad-wrap" aria-label="{S["ad"]}"><div class="kh-ad"><p class="kh-ad-l">{S["ad"]}</p>'
              f'<ins class="adsbygoogle" style="display:block" data-ad-client="{B.ADS_CLIENT}" data-ad-slot="{B.ADS_SLOT}" data-ad-format="auto" data-full-width-responsive="true"></ins>'
              f'<script>(adsbygoogle=window.adsbygoogle||[]).push({{}});</script></div></aside>')
        art = art.replace('<!--AD-->', ad)
        top = translate(parts['top'], lang, I18N)
        install = translate(parts['install'], lang, I18N)
        install = install.replace(quote(M['old_url'], safe=''), quote(canonical, safe=''))
        tail = translate(parts['tail'], lang, I18N)

        # 相關工具
        cards = ''
        for rid in M['related']:
            r = by_id.get(rid)
            if not r:
                continue
            tag = ''
            if lang != 'zh':
                native = lang in r.get('ui', []) or lang in (r.get('alt') or {})
                tag = f'<em class="ok">{S["ui_ok"]}</em>' if native else f'<em>{S["ui_zh"]}</em>'
            cards += (f'<a class="k-card" href="{B.E(B.url_for(r, lang))}" data-cta="related" data-cta-type="tool">'
                      f'<svg viewBox="0 0 24 24" aria-hidden="true">{B.ICONS.get(rid, "")}</svg>'
                      f'<span><b>{B.E(r[lang][0])}</b><small>{B.E(r[lang][1])}</small>{tag}</span></a>')
        blog = ''.join(f'<li><a href="{B.E(b["url"])}" data-cta="blog_read" data-cta-type="article">{B.E(b[lang])}</a></li>' for b in M['blog'])
        blog += f'<li><a href="{B.BLOG}" data-cta="blog_home" data-cta-type="article">{S["blog_more"]}</a></li>'
        note = f'<p class="k-note">{S["blog_note"]}</p>' if S['blog_note'] else ''
        cat_name = H['cats'][M['cat']]
        more = f'''<div class="art k-more">
<section class="card"><p class="k-lbl">{S["more_l"]}</p><h2 class="k-h">{S["more_h"]}</h2><div class="k-cards">{cards}</div></section>
<section class="card"><p class="k-lbl">{S["blog_l"]}</p><h2 class="k-h">{S["blog_h"]}</h2><ul class="k-blog">{blog}</ul>{note}</section>
<div class="k-duo">
<a class="k-big hub" href="{H["path"]}" data-cta="back_hub" data-cta-type="tool"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><circle cx="17.25" cy="17.25" r="3.75"/></svg><span class="k-lbl">{S["hub_l"]}</span><b>{S["hub_t"].format(n=n_tools)}</b><small>{S["hub_s"]}</small><span class="go">{S["go"]}</span></a>
<a class="k-big games" href="{B.GAMES}" data-cta="games_hub" data-cta-type="game"><svg viewBox="0 0 48 48" aria-hidden="true">{B.FLOWER}</svg><span class="k-lbl">{S["games_l"]}</span><b>{S["games_t"]}</b><small>{S["games_s"]}</small><span class="go">{S["go"]}</span></a>
</div>
</div>'''
        keep = f'<div class="art k-keep"><p class="k-lbl" style="margin:0">{S["keep_l"]}</p>{install}</div>'

        # 結構化資料
        ld = {'@context': 'https://schema.org', '@graph': [
            {'@type': 'WebApplication', '@id': canonical + '#app', 'name': L['name'], 'url': canonical,
             'applicationCategory': 'TravelApplication', 'operatingSystem': 'Any', 'browserRequirements': 'Requires JavaScript',
             'inLanguage': H['html_lang'], 'description': L['app_desc'], 'featureList': L['features'],
             'offers': {'@type': 'Offer', 'price': '0', 'priceCurrency': 'TWD'}, 'isAccessibleForFree': True,
             'dateModified': datetime.date.today().isoformat(),
             'author': {'@type': 'Person', 'name': 'Zoe', 'url': B.BLOG},
             'isPartOf': {'@type': 'WebSite', 'name': 'knittinghiyori tools', 'url': B.SITE + '/'}},
            {'@type': 'HowTo', 'name': L['howto'], 'totalTime': 'PT2M', 'step': steps},
            {'@type': 'FAQPage', 'mainEntity': [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in faq]},
            {'@type': 'BreadcrumbList', 'itemListElement': [
                {'@type': 'ListItem', 'position': 1, 'name': S['tools'], 'item': B.SITE + H['path']},
                {'@type': 'ListItem', 'position': 2, 'name': cat_name, 'item': B.SITE + H['path'] + '#index'},
                {'@type': 'ListItem', 'position': 3, 'name': L['name'], 'item': canonical}]},
        ]}
        alts = ''.join(f'<link rel="alternate" hreflang="{B.LANGS[l]["hreflang"]}" href="{B.SITE}{paths[l]}">' for l in B.ORDER)
        alts += f'<link rel="alternate" hreflang="x-default" href="{B.SITE}{paths["zh"]}">'
        langs = ''.join(
            f'<a href="{paths[l]}" hreflang="{B.LANGS[l]["hreflang"]}" lang="{B.LANGS[l]["html_lang"]}"' + (' aria-current="page"' if l == lang else '') + f'>{n}</a>'
            for l, n in zip(B.ORDER, H['lang_names']))
        cfg = {'TS_PAGE_LANG': lang, 'TS_PATHS': paths, 'TS_AFF': M.get('aff', {}), 'TS_BASE': M.get('base', {}).get(lang, 'TWD')}
        cfg_js = ''.join(f'window.{k}={json.dumps(v, ensure_ascii=False)};' for k, v in cfg.items())
        page = f'''<!doctype html>
<html lang="{H["html_lang"]}">
<head>
<meta charset="utf-8">
<script data-cfasync="false" data-cmp-ab="2">(function(){{var s=document.createElement("script");s.async=1;s.setAttribute("data-cmp-ab","2");s.src="{B.DRIVE}";document.head.appendChild(s)}})();</script>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{B.E(L["title"])}</title>
<meta name="description" content="{B.E(L["desc"])}">
<link rel="canonical" href="{canonical}">
{alts}
<meta name="theme-color" content="#ffffff">
<meta name="color-scheme" content="light">
<meta property="og:type" content="website">
<meta property="og:site_name" content="knittinghiyori tools">
<meta property="og:title" content="{B.E(L["title"])}">
<meta property="og:description" content="{B.E(L["desc"])}">
<meta property="og:url" content="{canonical}">
<meta property="og:locale" content="{H["og_locale"]}">
<meta name="twitter:card" content="summary">
<meta name="author" content="Zoe">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="https://games.knittinghiyori.com/icons/favicon-32.png">
<link rel="icon" type="image/png" sizes="96x96" href="https://games.knittinghiyori.com/icons/favicon-96.png">
<link rel="icon" type="image/png" sizes="192x192" href="https://games.knittinghiyori.com/icons/icon-192.png">
<link rel="apple-touch-icon" href="https://games.knittinghiyori.com/icons/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=IBM+Plex+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="/assets/tools/{tool["src"]}.css?v={B.VER}">
<link rel="stylesheet" href="/assets/site.css?v={B.VER}">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" crossorigin="anonymous"></script>
<script async src="https://www.googletagmanager.com/gtag/js?id={B.GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments)}}gtag("js",new Date());gtag("set",{{content_group:"tool",tool_id:"{M["tool_id"]}",page_lang:"{H["ga_lang"]}",page_title:"{M["page_title"]}"}});gtag("config","{B.GA_ID}");</script>
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head>
<body>
<div class="k-wrap">{B.tool_head(lang, tool["id"], L["name"], '<nav class="k-langs" aria-label="Language">' + langs + '</nav>')}</div>
<main class="k-wrap">
<div id="ts-app" class="ts" lang="{H["html_lang"]}">
{top}
<div class="art">
{art}
</div>
{more}
{keep}
{tail}
</div>
</main>
<footer class="k-foot"><div class="k-wrap">
<nav><a href="{H["path"]}" data-cta="footer_hub" data-cta-type="tool">{S["hub_t"].format(n=n_tools)}</a><a href="{B.BLOG}" data-cta="footer_blog" data-cta-type="article">{H["back"]}</a><a href="{B.GAMES}" data-cta="footer_games" data-cta-type="game">{H["games"]}</a><a href="{B.PRIVACY}">{H["privacy"]}</a></nav>
<p class="kh-legal">{H["legal"]}<a href="{B.PRIVACY}">{H["privacy"]}</a></p>
<p class="k-copy">© {B.YEAR} knittinghiyori · Zoe</p>
</div><p class="k-word" aria-hidden="true">knitting<i>hiyori</i></p></footer>
<script>{cfg_js}</script>
<script src="/assets/tools/{tool["src"]}.js?v={B.VER}" defer></script>
<script>/* 換語言時保留 # 後面的帳本 */document.querySelectorAll('.k-langs a').forEach(function(a){{a.addEventListener('click',function(){{if(location.hash)a.href=a.getAttribute('href').split('#')[0]+location.hash;if(window.hyTool)window.hyTool.event('lang_switch',{{source:'header',from_lang:'{H["ga_lang"]}'}})}})}});</script>
</body>
</html>
'''
        out = B.ROOT / paths[lang].strip('/') / 'index.html'
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(B.vignette(page), encoding='utf-8')
    return {'paths': paths}
