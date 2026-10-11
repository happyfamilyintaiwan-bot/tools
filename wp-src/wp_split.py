#!/usr/bin/env python3
"""把 WordPress 工具原始檔拆成看得懂的原始碼（只在第一次拆、或 Zoe 放進新的 *-wordpress.html 時用）。

用法：python3 wp-src/wp_split.py            → 拆全部 wp-src/*-wordpress.html
      python3 wp-src/wp_split.py bill-split → 只拆一個

每個 wp-src/<名稱>-wordpress.html 拆到 wp-src/<名稱>/：
  body.html  頁面 HTML（樣式與主程式的位置用 <!--@@STYLE@@-->、<!--@@MAIN@@--> 標記）
  style.css  <style> 裡的 CSS
  main.js    主程式（base64 載入器的會解開成看得懂的 JS）
  NOTES.md   檔頭註解裡的網址、SEO 標題、描述，以及原樣保存的檔頭註解（產生時放回）
拆完會用 wp_build.py 的方法重組一次，確認和原檔逐字相同。
"""
import base64, json, re, sys, pathlib

HERE = pathlib.Path(__file__).parent
sys.path.insert(0, str(HERE))
import wp_build  # noqa: E402

STYLE_RE = re.compile(r'(<style[^>]*>)(.*?)(</style>)', re.S)
SCRIPT_RE = re.compile(r'(<script(?![^>]*application/ld\+json)[^>]*>)(.*?)(</script>)', re.S)
B64_RE = re.compile(r'(?:var b=|b=window\.atob\()"([A-Za-z0-9+/=]{200,})"')  # 兩種載入器寫法


def split(src):
    name = src.name[:-len('-wordpress.html')]
    text = src.read_text(encoding='utf-8')
    out = HERE / name
    out.mkdir(exist_ok=True)

    # 1) 檔頭註解（檔案最前面的 <!-- … -->）
    header = ''
    if text.startswith('<!--'):
        end = text.index('-->') + 3
        if text[end:end + 1] == '\n':
            end += 1
        header, text = text[:end], text[end:]

    # 2) 第一個 <style>
    m = STYLE_RE.search(text)
    style = m.group(2)
    text = text[:m.start(2)] + wp_build.STYLE + text[m.end(2):]

    # 3) 主程式：有 base64 載入器就解開；沒有就取最大的一段 inline script
    mode = 'plain'
    m = B64_RE.search(text)
    if m:
        mode = 'base64'
        main = base64.b64decode(m.group(1)).decode('utf-8')
        text = text[:m.start(1)] + wp_build.MAIN + text[m.end(1):]
    else:
        scripts = [s for s in SCRIPT_RE.finditer(text) if s.group(2).strip()]
        s = max(scripts, key=lambda x: len(x.group(2)))
        main = s.group(2)
        text = text[:s.start(2)] + wp_build.MAIN + text[s.end(2):]

    (out / 'body.html').write_text(text, encoding='utf-8')
    (out / 'style.css').write_text(style, encoding='utf-8')
    (out / 'main.js').write_text(main, encoding='utf-8')
    (out / 'NOTES.md').write_text(notes(name, header, text, mode), encoding='utf-8')

    rebuilt = wp_build.assemble(out)
    ok = rebuilt == src.read_text(encoding='utf-8')
    print(('✅' if ok else '❌'), name, mode, f'main.js {len(main):,} 字', '' if ok else '（重組後和原檔不同）')
    return ok


def notes(name, header, body, mode):
    def pick(label):
        m = re.search(r'・' + label + r'[^：]*：(.+)', header)
        return m.group(1).strip() if m else ''
    url = pick('網址')
    ld = {}
    m = re.search(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', body, re.S)
    if m:
        try:
            data = json.loads(m.group(1))
            items = data.get('@graph', [data])
            ld = next((x for x in items if x.get('@type') == 'WebApplication'), items[0])
        except Exception:
            pass
    title = pick('SEO 標題')
    desc = pick('Meta 描述')
    rows = [
        ('網址', url or ld.get('url', '')),
        ('SEO 標題', title or '（檔頭沒寫；JSON-LD name：' + ld.get('name', '—') + '）'),
        ('Meta 描述', desc or ('（檔頭沒寫；JSON-LD description：' + ld.get('description', '—') + '）')),
        ('JSON-LD 網址', ld.get('url', '—')),
        ('主程式寫法', 'base64 載入器（main.js 是解開後的原始碼）' if mode == 'base64' else '一般 script（main.js 直接放回）'),
    ]
    table = '\n'.join(f'| {k} | {v} |' for k, v in rows)
    fence = '~~~~'
    return f'''# {name}

| 項目 | 內容 |
|---|---|
{table}

## 怎麼改

1. 改 `main.js`／`style.css`／`body.html`（`<!--@@STYLE@@-->`、`<!--@@MAIN@@-->` 是產生時放回樣式與主程式的位置，不要刪）。
2. `python3 wp-src/wp_build.py {name}` → 產生 `wp-src/{name}-wordpress.html`，整段貼回 WordPress「自訂 HTML」區塊。
3. 貼上前確認：base64 載入器那段不能有和號、小於、大於符號（blog.md §1）。

## 檔頭註解（產生時原樣放回，要改 SEO 設定說明就改這裡）

{fence}html
{header}{fence}
'''


def main():
    names = sys.argv[1:]
    files = [HERE / f'{n}-wordpress.html' for n in names] if names else sorted(HERE.glob('*-wordpress.html'))
    bad = sum(not split(f) for f in files)
    print(f'\n{len(files)} 個檔案，{bad} 個重組不一致')
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
