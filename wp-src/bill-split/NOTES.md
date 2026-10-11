# bill-split

| 項目 | 內容 |
|---|---|
| 網址 | /tools/bill-split-calculator/（slug：bill-split-calculator） |
| SEO 標題 | 聚餐分帳計算機｜拍帳單逐項分餐費，服務費自動按比例分攤（免費） |
| Meta 描述 | 聚餐怎麼分帳最公平？免費聚餐分帳計算機：點選誰點了什麼，共享菜自動平分，服務費與折扣按比例分攤，壽星可設定不用付，一鍵算出每人要轉多少。免註冊、手機好用。 |
| JSON-LD 網址 | https://knittinghiyori.com/tools/bill-split-calculator/ |
| 主程式寫法 | base64 載入器（main.js 是解開後的原始碼） |

## 怎麼改

1. 改 `main.js`／`style.css`／`body.html`（`<!--@@STYLE@@-->`、`<!--@@MAIN@@-->` 是產生時放回樣式與主程式的位置，不要刪）。
2. `python3 wp-src/wp_build.py bill-split` → 產生 `wp-src/bill-split-wordpress.html`，整段貼回 WordPress「自訂 HTML」區塊。
3. 貼上前確認：base64 載入器那段不能有和號、小於、大於符號（blog.md §1）。

## 檔頭註解（產生時原樣放回，要改 SEO 設定說明就改這裡）

~~~~html
<!-- ===== 聚餐分帳計算機 by knittinghiyori.com｜貼到 WordPress「自訂 HTML」區塊 =====
建議設定（Rank Math）
・網址：/tools/bill-split-calculator/（slug：bill-split-calculator）
・SEO 標題：聚餐分帳計算機｜拍帳單逐項分餐費，服務費自動按比例分攤（免費）
・Meta 描述：聚餐怎麼分帳最公平？免費聚餐分帳計算機：點選誰點了什麼，共享菜自動平分，服務費與折扣按比例分攤，壽星可設定不用付，一鍵算出每人要轉多少。免註冊、手機好用。
・聯盟連結改最下方載入器裡的 window.BS_AFF（網址裡不可以有和號）
・主程式以 base64 編碼放在載入器裡，避免 WordPress 與快取外掛改動程式碼；要修改請改原始檔後重新產生
-->
~~~~
