# 鮮茶道團購點單（嘉義民雄中正店）

大家線上填名字、勾選飲料、選甜度冰塊送出；負責人在後台一次彙總品項、勾選收款、匯出 Excel。

- 點單頁：`index.html`
- 後台：`admin.html`（Google 登入，帳號需在 Firestore `admins/{email}` 名單內）
- 菜單：`assets/menu.js`（2026 鮮茶道中南部菜單，適用嘉義）
- 資料庫規則：`firestore.rules`

## 部署
push 到 `main` 後由 GitHub Actions 執行 `.github/inject.py`，把 GitHub Secrets 的 Firebase 設定注入 `_site/assets/config.js` 再發布到 GitHub Pages。原始碼不含真實金鑰。

---

Made with ❤️ by [阿凱老師](https://www.smes.tyc.edu.tw/modules/school/index.php?department_id=2&zone_id=0&page_id=2&content_id=11&type=news&from_op=all_news#a5)
