# tools.knittinghiyori.com

knittinghiyori 免費小工具總覽（中文／English／日本語）。純靜態 HTML，部署在 GitHub Pages。

## 網址
- 中文：https://tools.knittinghiyori.com/
- English：https://tools.knittinghiyori.com/en/
- 日本語：https://tools.knittinghiyori.com/ja/

## 新增或修改工具
1. 編輯 `tools.json`（名稱、說明、網址、分類、介面語言）。
2. 執行 `python3 build.py`，會重新產生三個語言的 index.html、404、sitemap。
3. `git add . && git commit -m "update tools" && git push`。

## 第一次上線
1. GitHub 新增 repo（例如 `knittinghiyori-tools`），把整個資料夾推上去。
2. repo → Settings → Pages → Source 選 `Deploy from a branch`，Branch 選 `main`／`/ (root)`。
3. Custom domain 填 `tools.knittinghiyori.com`（repo 裡已有 CNAME 檔），勾 Enforce HTTPS。
4. Cloudflare DNS 新增：Type `CNAME`、Name `tools`、Target `<你的帳號>.github.io`、Proxy 先設 **DNS only（灰雲）**，等 GitHub 憑證核發完成再視需要改橘雲（設定方式同 games 子網域）。
5. GA4 評估 ID 已設定為 G-ZQZHTYTRMQ（在 `build.py` 最上面）。
6. Google Search Console 新增 `tools.knittinghiyori.com` 資源，提交 `sitemap.xml`。

## GA4 事件（統一追蹤 v1.2，tool_id=tools_hub、content_group=hub）
| 事件 | 參數 |
|---|---|
| cta_click | cta_id（hub_card／hub_feature／hub_recent／hub_omikuji／hub_games／hub_blog）、cta_type（tool／games／article）、option（點了哪個工具 id）、link_url |
| hub_search | search_term、result_count（停止輸入 1.2 秒後送出） |
| hub_filter | option（分類） |
| hub_omikuji | option（抽到的工具 id）、result（大吉…） |
| lang_switch | source（header／tip）、from_lang |
| share／share_cancel | method（native／line／facebook／threads／x／copy_link）、content_type=tool |

網址加 `?hy_debug=1` 會在 Console 印出事件。

## 設計
- 白底黑字＋朱紅（#e5412d）單一強調色；標題用 Noto Serif TC／JP（中日）與 Instrument Serif（英文、數字），標籤用 IBM Plex Mono。
- 圖示是 build.py 裡的 ICONS（24×24 線條 SVG）；新增工具時記得在 ICONS 補一個同 id 的圖示。
- 支援「減少動態效果」設定；篩選切換在支援的瀏覽器會有 View Transitions 動畫。
