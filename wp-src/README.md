# wp-src：還沒搬家的 WordPress 工具原始碼

```
wp-src/
├─ <名稱>-wordpress.html   貼到 WordPress「自訂 HTML」區塊的檔案（wp_build.py 產生）
├─ <名稱>/
│   ├─ body.html          頁面 HTML（<!--@@STYLE@@-->、<!--@@MAIN@@--> 是放回樣式與主程式的位置）
│   ├─ style.css          樣式
│   ├─ main.js            主程式（base64 載入器的工具，這裡是解開後看得懂的 JS）
│   └─ NOTES.md           網址、SEO 標題、描述、原樣保存的檔頭註解
├─ wp_split.py            第一次拆檔用（Zoe 放進新的 *-wordpress.html 時再跑）
└─ wp_build.py            從原始碼產生 *-wordpress.html
```

## 改 WordPress 工具的流程

1. 改 `wp-src/<名稱>/` 裡的 `main.js`／`style.css`／`body.html`。
2. `python3 wp-src/wp_build.py <名稱>` → 產生 `wp-src/<名稱>-wordpress.html`。
3. 整段貼回 WordPress 那一頁的「自訂 HTML」區塊 → 清 Autoptimize／Breeze 快取 → 無痕視窗測試（blog.md §1）。

- 檢查產生結果和現有檔案是否一致：`python3 wp-src/wp_build.py --check`
- base64 載入器的工具（bill-split、packing-list、travel-split）：main.js 會自動重新編碼，WordPress 不會改動 base64 字串；載入器那段不能出現和號、小於、大於符號，`wp_build.py` 會檢查。
- 搬到 tools 子網域時（tools.md §7），從這裡的 main.js／style.css／body.html 開始拆成 `_src/<工具>/`。
- 本資料夾 robots.txt 已擋（`Disallow: /wp-src/`），不會被搜尋引擎收錄。
