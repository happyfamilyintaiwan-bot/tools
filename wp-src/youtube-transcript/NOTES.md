# youtube-transcript

| 項目 | 內容 |
|---|---|
| 網址 | https://knittinghiyori.com/tools/youtube-shadowing/ |
| SEO 標題 | （檔頭沒寫；JSON-LD name：YouTube 跟讀練習工具） |
| Meta 描述 | （檔頭沒寫；JSON-LD description：用 YouTube 影片練日文、英文跟讀：貼上轉錄稿，自動切成完整句子，每句可單獨重播、跟讀、聽寫與收藏；沒有字幕的影片或錄音檔，可上傳後用 Whisper 在瀏覽器內轉成文字。不翻譯、保留原文，免費免註冊。） |
| JSON-LD 網址 | https://knittinghiyori.com/tools/youtube-shadowing/ |
| 主程式寫法 | 一般 script（main.js 直接放回） |

## 怎麼改

1. 改 `main.js`／`style.css`／`body.html`（`<!--@@STYLE@@-->`、`<!--@@MAIN@@-->` 是產生時放回樣式與主程式的位置，不要刪）。
2. `python3 wp-src/wp_build.py youtube-transcript` → 產生 `wp-src/youtube-transcript-wordpress.html`，整段貼回 WordPress「自訂 HTML」區塊。
3. 貼上前確認：base64 載入器那段不能有和號、小於、大於符號（blog.md §1）。

## 檔頭註解（產生時原樣放回，要改 SEO 設定說明就改這裡）

~~~~html
<!-- ============================================================
  YouTube 跟讀練習工具 v2.0（原「YouTube 逐字稿產生器」）｜ knittinghiyori.com
  用法：整段貼進 WordPress 頁面的「自訂 HTML」區塊（或 WPCode）。
  全部在讀者的瀏覽器處理：不需要後端、不需要 API 金鑰、不會上傳內容。
  支援：YouTube「顯示轉錄稿」複製內容、.srt / .vtt / .txt 字幕檔。
  v2.0：改版定位為語言學習（逐句跟讀為主）；沒有影片網址時可用裝置內建語音朗讀。
  v1.1：新增「上傳音檔」— Whisper 語音辨識在讀者瀏覽器執行（transformers.js 3.8.1＋Hugging Face 模型，
        opencc-js 轉繁體）。會從 cdn.jsdelivr.net 與 huggingface.co 下載程式與模型，網站若有 CSP 需允許這兩個網域。
  ============================================================ -->
~~~~
