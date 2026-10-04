# esim-picker

| 項目 | 內容 |
|---|---|
| 網址 | https://knittinghiyori.com/tools/esim-plan-picker/ |
| SEO 標題 | （檔頭沒寫；JSON-LD name：eSIM 選購小幫手） |
| Meta 描述 | （檔頭沒寫；JSON-LD description：輸入目的地、旅遊天數與每日流量，自動比較 Saily、Airalo、Yesim 的 eSIM 方案價格並推薦最划算的買法。） |
| JSON-LD 網址 | https://knittinghiyori.com/tools/esim-plan-picker/ |
| 主程式寫法 | 一般 script（main.js 直接放回） |

## 怎麼改

1. 改 `main.js`／`style.css`／`body.html`（`<!--@@STYLE@@-->`、`<!--@@MAIN@@-->` 是產生時放回樣式與主程式的位置，不要刪）。
2. `python3 wp-src/wp_build.py esim-picker` → 產生 `wp-src/esim-picker-wordpress.html`，整段貼回 WordPress「自訂 HTML」區塊。
3. 貼上前確認：base64 載入器那段不能有和號、小於、大於符號（blog.md §1）。

## 檔頭註解（產生時原樣放回，要改 SEO 設定說明就改這裡）

~~~~html
<!-- ===== eSIM 選購小幫手 by knittinghiyori.com｜貼到 WordPress「自訂 HTML」區塊 ===== -->
~~~~
