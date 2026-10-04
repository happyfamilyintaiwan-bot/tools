#!/usr/bin/env python3
"""產生分享預覽圖（og 圖，1200×630）：左上角品牌列（正式 logo＋編織日和・小工具）＋該頁網址＋淡浮水印。
讓分享出去的預覽被縮小或轉傳時，收到的人也看得出是編織日和、知道從哪個網址回來用。

用法（需要 Playwright＋Chromium）：python3 og.py   → 再跑 python3 build.py 把 og 標籤套上
- 總覽頁：assets/og/hub-<語言>.png
- 三語工具（tools.json 有 "src"）：assets/og/<tool_id>-<語言>.png
- 只有中文的工具（tools.json 有 "page"）：<page>/og-2.png（保留原本 og.png 的設計，上方加品牌列）
換圖時改用新檔名（og-3.png…），FB／LINE 才會重抓（games.md §1 同一規則）。
"""
import base64, html, json, os, pathlib
import build as B

ROOT = B.ROOT
LOGO = base64.b64encode((ROOT / 'icons' / 'logo-knitting-240.webp').read_bytes()).decode()
GO = {'zh': '免費使用 →', 'en': 'Free to use →', 'ja': '無料で使う →'}
HUB = {
    'zh': ('免費線上小工具', '分帳、比價、QR Code、顏文字，一頁找齊'),
    'en': ('Free online tools', 'Split bills, compare prices, make QR codes — all in one place'),
    'ja': ('無料オンラインツール', '割り勘・比較・QR コード・顔文字をまとめて'),
}
CSS = '''
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;overflow:hidden;background:#fff;color:#16120f;
 font-family:"Noto Sans CJK TC","Noto Sans TC","PingFang TC",sans-serif;position:relative}
.wm{position:absolute;left:50%;top:56%;transform:translate(-50%,-50%) rotate(-10deg);white-space:nowrap;text-align:center;
 font:900 140px/1.05 "Noto Serif CJK TC","Noto Serif TC",serif;color:#16120f;opacity:.05;letter-spacing:.08em}
.wm small{display:block;font:700 58px/1.3 "Noto Sans CJK TC",sans-serif;letter-spacing:.2em}
.bar{position:absolute;left:0;right:0;top:0;height:104px;display:flex;align-items:center;justify-content:space-between;
 padding:0 56px;border-bottom:1px solid #e4deda;background:#fff}
.brand{display:flex;align-items:center;gap:16px;font-weight:700;font-size:30px;letter-spacing:.04em}
.brand img{width:60px;height:60px;border-radius:12px}
.url{font:500 24px "IBM Plex Mono","DejaVu Sans Mono",monospace;color:#c8341e;letter-spacing:.01em}
.main{position:absolute;left:56px;right:56px;top:150px}
.no{font:500 22px "IBM Plex Mono","DejaVu Sans Mono",monospace;color:#6f6764;letter-spacing:.12em}
h1{font:900 82px/1.15 "Noto Serif CJK TC","Noto Serif TC",serif;margin-top:18px;letter-spacing:.01em}
.sub{font-size:32px;line-height:1.5;color:#5a524e;margin-top:22px;max-width:1040px}
.foot{position:absolute;left:56px;right:56px;bottom:44px;display:flex;justify-content:space-between;align-items:center;
 border-top:2px solid #16120f;padding-top:20px}
.foot .url{color:#16120f;font-size:26px}
.go{font-weight:700;font-size:26px;color:#fff;background:#c8341e;border-radius:999px;padding:10px 26px}
.frame{position:absolute;left:0;right:0;top:104px;bottom:0;background:#f7f4f2;display:flex;align-items:center;justify-content:center}
.frame img{height:100%;width:auto;display:block}
'''


def bar(lang, url):
    return (f'<div class="bar"><div class="brand"><img src="data:image/webp;base64,{LOGO}">'
            f'{html.escape(B.BRAND[lang])}</div><div class="url">{html.escape(url)}</div></div>')


def card(lang, title, sub, url, no=''):
    return (f'<div class="wm">編織日和<small>Knitting Hiyori</small></div>{bar(lang, url)}'
            f'<div class="main">{f"<p class=no>{html.escape(no)}</p>" if no else ""}<h1>{html.escape(title)}</h1>'
            f'<p class="sub">{html.escape(sub)}</p></div>'
            f'<div class="foot"><span class="url">{html.escape(url)}</span><span class="go">{GO[lang]}</span></div>')


def framed(lang, img_path, url):
    data = base64.b64encode(img_path.read_bytes()).decode()
    return f'{bar(lang, url)}<div class="frame"><img src="data:image/png;base64,{data}"></div>'


def jobs():
    host = B.SITE.replace('https://', '')
    for lang in B.ORDER:
        t, s = HUB[lang]
        yield ROOT / 'assets' / 'og' / f'hub-{lang}.png', lang, card(lang, t, s, host + B.LANGS[lang]['path'])
    for t in B.DATA:
        if t.get('src'):
            M = json.loads((ROOT / '_src' / t['src'] / 'meta.json').read_text(encoding='utf-8'))
            for lang in B.ORDER:
                L = M['lang'][lang]
                cat = B.LANGS[lang]['cats'][t['cats'][0]]
                yield (ROOT / 'assets' / 'og' / f'{t["id"]}-{lang}.png', lang,
                       card(lang, L['name'], t[lang][1], host + B.LANGS[lang]['path'] + M['slug'] + '/',
                            f'No.{B.tool_no(t["id"]):02d} · {cat}'))
        elif t.get('page'):
            src = ROOT / t['page'] / 'og.png'
            url = f'{host}/{t["page"]}/'
            if src.exists():
                yield ROOT / t['page'] / 'og-2.png', 'zh', framed('zh', src, url)
            else:
                cat = B.LANGS['zh']['cats'][t['cats'][0]]
                yield ROOT / t['page'] / 'og-2.png', 'zh', card('zh', t['zh'][0], t['zh'][1], url, f'No.{B.tool_no(t["id"]):02d} · {cat}')


def main():
    from playwright.sync_api import sync_playwright
    exe = os.environ.get('CHROMIUM_PATH')  # 本機有裝 Playwright 瀏覽器就不用設定
    with sync_playwright() as p:
        b = p.chromium.launch(**({'executable_path': exe} if exe else {}))
        pg = b.new_page(viewport={'width': 1200, 'height': 630})
        n = 0
        for out, lang, body in jobs():
            out.parent.mkdir(parents=True, exist_ok=True)
            pg.set_content(f'<!doctype html><html lang="{B.LANGS[lang]["html_lang"]}"><head><meta charset="utf-8"><style>{CSS}</style></head><body>{body}</body></html>')
            pg.wait_for_timeout(150)
            pg.screenshot(path=str(out))
            n += 1
            print('og', out.relative_to(ROOT))
        b.close()
    print(n, '張')


if __name__ == '__main__':
    main()
