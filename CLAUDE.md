# tools.knittinghiyori.com：給 Claude Code 的規則

- 免費小工具站，**負責人 Alison**；main 有分支保護，只能經 PR 合併。
- 改總覽頁只改 `tools.json` 或 `build.py`，再跑 `python3 build.py`。
- `wp-src/`：還沒搬家的 WordPress 工具原始檔。

## 每次開工

1. **確認是誰**：Zoe 的桌機預設是 Zoe；網頁版沒說是誰就先問。
2. **讀規範**（knittinghiyori-specs）：`core.md`、`registry.md`、`CHANGELOG.md`＋`tools.md`。
   - 桌機：`~/Sites/knittinghiyori/knittinghiyori-specs` 先 `git pull` 再讀。
   - 網頁版：`https://raw.githubusercontent.com/happyfamilyintaiwan-bot/knittinghiyori-specs/main/<檔名>`
   - 第一句回報各檔版本號與 CHANGELOG 最新一筆；讀不到就停下，不用記憶代替。
3. 分工、不越界、放錯位置、交件 4 項、存檔流程、收工的規範更新包、spec-version，一律照 `core.md` §0。

## 分工（core v1.3）

Alison 只在 claude.ai 寫內容，交件 4 項：放哪、完整 Markdown、英文網址、特別要求；不碰 repo、分支、PR。所有上架由 Zoe 的 Claude Code 處理：從最新的 main 開 `zoe/<主題>` 分支、build 0 問題、驗收、開 PR、squash 合併；內容來自 Alison 時，合併訊息開頭寫「Alison:」。上架只修格式、規範、錯字與技術問題，要改內容的意思先問內容負責人。

本檔由 Zoe 維護；要改請寫在 PR 說明。
