# 飲料團購點單（鮮茶道・茶湯會）

大家線上填名字、勾選飲料、選甜度冰塊送出；負責人在後台一次彙總品項、勾選收款、匯出 Excel。

- 點單頁：`index.html`
- 後台：`admin.html`（Google 登入，帳號需在 Firestore `admins/{email}` 名單內）
- 菜單：`assets/shops.js`（鮮茶道 2026 中南部菜單、茶湯會官網 2026.11 南區菜單，皆適用嘉義）
- 店家切換：後台「這次訂哪一家」可選只開鮮茶道、只開茶湯會、或兩家都開讓大家自己切換
- 資料庫規則：`firestore.rules`

## 部署
push 到 `main` 後由 GitHub Actions 執行 `.github/inject.py`，把 GitHub Secrets 的 Firebase 設定注入 `_site/assets/config.js` 再發布到 GitHub Pages。原始碼不含真實金鑰。

---

Made with ❤️ by [阿凱老師](https://www.smes.tyc.edu.tw/modules/school/index.php?department_id=2&zone_id=0&page_id=2&content_id=11&type=news&from_op=all_news#a5)
