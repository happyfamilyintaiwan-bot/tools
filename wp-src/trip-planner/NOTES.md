# trip-planner

| 項目 | 內容 |
|---|---|
| 網址 | /group-trip-planner/ |
| SEO 標題 | 旅遊行程規劃工具｜和旅伴共同編輯，一鍵產出 Google 地圖與旅遊手冊（免費） |
| Meta 描述 | 和朋友一起排出國行程！免費行程規劃工具，旅伴各自丟想去的景點、投票，拖進每日行程，一鍵開啟 Google 地圖路線、匯入 My Maps，還能產出可列印的旅遊手冊 PDF。免註冊、用連結傳 LINE 就能共編。 |
| JSON-LD 網址 | https://knittinghiyori.com/group-trip-planner/ |
| 主程式寫法 | 一般 script（main.js 直接放回） |

## 怎麼改

1. 改 `main.js`／`style.css`／`body.html`（`<!--@@STYLE@@-->`、`<!--@@MAIN@@-->` 是產生時放回樣式與主程式的位置，不要刪）。
2. `python3 wp-src/wp_build.py trip-planner` → 產生 `wp-src/trip-planner-wordpress.html`，整段貼回 WordPress「自訂 HTML」區塊。
3. 貼上前確認：base64 載入器那段不能有和號、小於、大於符號（blog.md §1）。

## 檔頭註解（產生時原樣放回，要改 SEO 設定說明就改這裡）

~~~~html
<!-- ===== 旅遊行程共編工具 by knittinghiyori.com｜貼到 WordPress「自訂 HTML」區塊 =====
建議設定（Rank Math）
・網址 slug：/group-trip-planner/
・SEO 標題：旅遊行程規劃工具｜和旅伴共同編輯，一鍵產出 Google 地圖與旅遊手冊（免費）
・Meta 描述：和朋友一起排出國行程！免費行程規劃工具，旅伴各自丟想去的景點、投票，拖進每日行程，一鍵開啟 Google 地圖路線、匯入 My Maps，還能產出可列印的旅遊手冊 PDF。免註冊、用連結傳 LINE 就能共編。
・聯盟連結統一改 script 開頭的 AFF 物件
-->
~~~~
