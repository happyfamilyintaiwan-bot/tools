# esim-picker-en

| 項目 | 內容 |
|---|---|
| 網址 | https://knittinghiyori.com/tools/esim-plan-picker-en/ |
| SEO 標題 | （檔頭沒寫；JSON-LD name：eSIM Plan Picker） |
| Meta 描述 | （檔頭沒寫；JSON-LD description：Pick a destination, trip length and daily data use, and compare Saily, Airalo and Yesim eSIM plans to find the cheapest way to buy data for your trip.） |
| JSON-LD 網址 | https://knittinghiyori.com/tools/esim-plan-picker-en/ |
| 主程式寫法 | 一般 script（main.js 直接放回） |

## 怎麼改

1. 改 `main.js`／`style.css`／`body.html`（`<!--@@STYLE@@-->`、`<!--@@MAIN@@-->` 是產生時放回樣式與主程式的位置，不要刪）。
2. `python3 wp-src/wp_build.py esim-picker-en` → 產生 `wp-src/esim-picker-en-wordpress.html`，整段貼回 WordPress「自訂 HTML」區塊。
3. 貼上前確認：base64 載入器那段不能有和號、小於、大於符號（blog.md §1）。

## 檔頭註解（產生時原樣放回，要改 SEO 設定說明就改這裡）

~~~~html
<!-- ===== eSIM Plan Picker (English) by knittinghiyori.com | paste into a WordPress Custom HTML block ===== -->
~~~~
