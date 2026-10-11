# travel-split

| 項目 | 內容 |
|---|---|
| 網址 | /tools/travel-split-calculator/（slug：travel-split-calculator） |
| SEO 標題 | 旅費分帳計算機｜出國多幣別分帳，自動算出誰該轉給誰（免費） |
| Meta 描述 | 出國旅費怎麼分最公平？免費旅費分帳計算機，記錄誰先付了什麼，支援日圓、韓元等 20 種幣別自動換匯，一鍵算出最少轉帳次數，產生連結直接傳到 LINE 給旅伴。免註冊、手機好用。 |
| JSON-LD 網址 | https://knittinghiyori.com/tools/travel-split-calculator/ |
| 主程式寫法 | base64 載入器（main.js 是解開後的原始碼） |

## 怎麼改

1. 改 `main.js`／`style.css`／`body.html`（`<!--@@STYLE@@-->`、`<!--@@MAIN@@-->` 是產生時放回樣式與主程式的位置，不要刪）。
2. `python3 wp-src/wp_build.py travel-split` → 產生 `wp-src/travel-split-wordpress.html`，整段貼回 WordPress「自訂 HTML」區塊。
3. 貼上前確認：base64 載入器那段不能有和號、小於、大於符號（blog.md §1）。

## 檔頭註解（產生時原樣放回，要改 SEO 設定說明就改這裡）

~~~~html
<!-- ===== 旅費分帳計算機 by knittinghiyori.com｜貼到 WordPress「自訂 HTML」區塊 =====
建議設定（Rank Math）
・網址：/tools/travel-split-calculator/（slug：travel-split-calculator）
・SEO 標題：旅費分帳計算機｜出國多幣別分帳，自動算出誰該轉給誰（免費）
・Meta 描述：出國旅費怎麼分最公平？免費旅費分帳計算機，記錄誰先付了什麼，支援日圓、韓元等 20 種幣別自動換匯，一鍵算出最少轉帳次數，產生連結直接傳到 LINE 給旅伴。免註冊、手機好用。
・聯盟連結改最下方載入器裡的 window.TS_AFF（網址裡不可以有和號）
・主程式以 base64 編碼放在載入器裡，避免 WordPress 與快取外掛改動程式碼；要修改請改原始檔後重新產生
・介面語言：預設中文（Google 收錄的版本），右上角可切換 EN／日本語；英日翻譯在 script 裡的 I18N 物件
-->
~~~~
