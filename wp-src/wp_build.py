#!/usr/bin/env python3
"""從 wp-src/<名稱>/ 的原始碼，產生 WordPress「自訂 HTML」區塊用的檔案（含 base64 載入器）。

用法：
  python3 wp-src/wp_build.py              → 產生全部，寫到 wp-src/<名稱>-wordpress.html
  python3 wp-src/wp_build.py bill-split   → 只產生一個
  python3 wp-src/wp_build.py --check      → 不寫檔，只檢查產生結果和現有的 *-wordpress.html 是否逐字相同

原始碼：body.html（含 <!--@@STYLE@@-->、<!--@@MAIN@@--> 標記）、style.css、main.js、NOTES.md（檔頭註解）。
base64 載入器的工具：main.js 會重新編碼成 base64 放回載入器（WordPress 不會改動 base64 字串）。
"""
import base64, re, sys, pathlib

HERE = pathlib.Path(__file__).parent
STYLE = '<!--@@STYLE@@-->'
MAIN = '<!--@@MAIN@@-->'
HEADER_RE = re.compile(r'## 檔頭註解[^\n]*\n\n~~~~html\n(.*?)~~~~\n', re.S)


def assemble(folder):
    body = (folder / 'body.html').read_text(encoding='utf-8')
    style = (folder / 'style.css').read_text(encoding='utf-8')
    main = (folder / 'main.js').read_text(encoding='utf-8')
    m = HEADER_RE.search((folder / 'NOTES.md').read_text(encoding='utf-8'))
    header = m.group(1) if m else ''
    if '"' + MAIN + '"' in body:   # 標記包在引號裡＝base64 載入器
        main = base64.b64encode(main.encode('utf-8')).decode('ascii')
    assert body.count(STYLE) == 1 and body.count(MAIN) == 1, f'{folder.name}：body.html 的標記不見了'
    return header + body.replace(STYLE, style).replace(MAIN, main)


def check_loader(name, html):
    """載入器（含 base64 字串那一段 script）不能出現和號、小於、大於（blog.md §1）"""
    m = re.search(r'<script[^>]*>((?:(?!</script>).)*?(?:var b=|b=window\.atob\()"[A-Za-z0-9+/=]{200,}"(?:(?!</script>).)*)</script>', html, re.S)
    if not m:
        return []
    bad = [c for c in '&<>' if c in m.group(1)]
    return [f'{name}：載入器出現 {"".join(bad)}'] if bad else []


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    check = '--check' in sys.argv
    folders = [HERE / n for n in args] if args else sorted(p for p in HERE.iterdir() if (p / 'body.html').exists())
    bad = 0
    for f in folders:
        html = assemble(f)
        out = HERE / f'{f.name}-wordpress.html'
        warn = check_loader(f.name, html)
        if check:
            same = out.exists() and out.read_text(encoding='utf-8') == html
            print(('✅ 一致' if same else '❌ 不一致'), f.name, *warn)
            bad += (not same) + len(warn)
        else:
            out.write_text(html, encoding='utf-8')
            print('寫入', out.name, *warn)
            bad += len(warn)
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
