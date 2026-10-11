# packing-list

| 項目 | 內容 |
|---|---|
| 網址 | https://knittinghiyori.com/tools/packing-list-generator/ |
| SEO 標題 | （檔頭沒寫；JSON-LD name：出國行李清單產生器） |
| Meta 描述 | （檔頭沒寫；JSON-LD description：依目的地、季節、天數自動產生可勾選的出國行李清單，含轉接頭與電壓提醒、入境手續、eSIM、旅平險與機場接送建議，可存成圖片或分享給旅伴。） |
| JSON-LD 網址 | https://knittinghiyori.com/tools/packing-list-generator/ |
| 主程式寫法 | base64 載入器（main.js 是解開後的原始碼） |

## 怎麼改

1. 改 `main.js`／`style.css`／`body.html`（`<!--@@STYLE@@-->`、`<!--@@MAIN@@-->` 是產生時放回樣式與主程式的位置，不要刪）。
2. `python3 wp-src/wp_build.py packing-list` → 產生 `wp-src/packing-list-wordpress.html`，整段貼回 WordPress「自訂 HTML」區塊。
3. 貼上前確認：base64 載入器那段不能有和號、小於、大於符號（blog.md §1）。

## 檔頭註解（產生時原樣放回，要改 SEO 設定說明就改這裡）

~~~~html
<!-- 出國行李清單產生器 v2 | knittinghiyori.com | 請放在「自訂 HTML」區塊 -->
~~~~
