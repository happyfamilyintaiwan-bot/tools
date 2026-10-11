# japanese-quest

| 項目 | 內容 |
|---|---|
| 網址 | https://knittinghiyori.com/tools/japanese-learning-quest/ |
| SEO 標題 | （檔頭沒寫；JSON-LD name：日文修行圖鑑） |
| Meta 描述 | （檔頭沒寫；JSON-LD description：測出日文起點、選擇 30 天闖關路線，並收集 32 個免費的日文 podcast、YouTube 頻道、漫畫閱讀網站與工具，目標是看懂原文漫畫並開口說。） |
| JSON-LD 網址 | https://knittinghiyori.com/tools/japanese-learning-quest/ |
| 主程式寫法 | 一般 script（main.js 直接放回） |

## 怎麼改

1. 改 `main.js`／`style.css`／`body.html`（`<!--@@STYLE@@-->`、`<!--@@MAIN@@-->` 是產生時放回樣式與主程式的位置，不要刪）。
2. `python3 wp-src/wp_build.py japanese-quest` → 產生 `wp-src/japanese-quest-wordpress.html`，整段貼回 WordPress「自訂 HTML」區塊。
3. 貼上前確認：base64 載入器那段不能有和號、小於、大於符號（blog.md §1）。

## 檔頭註解（產生時原樣放回，要改 SEO 設定說明就改這裡）

~~~~html
<!-- ===== 日文修行圖鑑 by knittinghiyori.com｜貼到 WordPress「自訂 HTML」區塊 ===== -->
~~~~
