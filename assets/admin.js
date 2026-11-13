import { firebaseConfig, SDK, VERSION } from './config.js';
import { SHOPS, SHOP_IDS, ITEM_BY_ID, specText, shopTitle } from './shops.js';

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
$('#ver').textContent = VERSION;

const [{ initializeApp }, A, F] = await Promise.all([
  import(`${SDK}/firebase-app.js`),
  import(`${SDK}/firebase-auth.js`),
  import(`${SDK}/firebase-firestore.js`),
]);
const app = initializeApp(firebaseConfig);
const auth = A.getAuth(app);
const db = F.getFirestore(app);

let orders = [];
let unsub = null;
let branches = {};
const order = Object.fromEntries(Object.keys(ITEM_BY_ID).map((id, i) => [id, i]));
const shopOf = (o) => (SHOPS[o.shop] ? o.shop : 'presotea'); // 舊訂單沒有 shop 欄位＝鮮茶道

// ---------- 登入 ----------
$('#loginBtn').addEventListener('click', async () => {
  $('#loginMsg').textContent = '';
  try {
    await A.signInWithPopup(auth, new A.GoogleAuthProvider());
  } catch (err) {
    console.error(err);
    if (err.code === 'auth/popup-blocked' || err.code === 'auth/operation-not-supported-in-this-environment') {
      $('#loginMsg').textContent = '登入視窗被擋住了：請允許這個網站「彈出式視窗」後再按一次；若在 LINE 裡開啟，請改用 Chrome 或 Safari 開啟此網址。';
      return;
    }
    if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
      $('#loginMsg').textContent = `登入失敗（${err.code || err.message}）。若在 LINE 裡開啟，請改用 Chrome 或 Safari。`;
    }
  }
});
$('#logoutBtn').addEventListener('click', () => A.signOut(auth));

A.onAuthStateChanged(auth, async (user) => {
  unsub?.(); unsub = null;
  $('#logoutBtn').classList.toggle('hidden', !user);
  if (!user) {
    $('#who').textContent = '請先登入';
    $('#loginCard').classList.remove('hidden');
    $('#app').classList.add('hidden');
    return;
  }
  $('#who').textContent = `已登入：${user.email}`;
  let ok = false;
  try { ok = (await F.getDoc(F.doc(db, 'admins', user.email))).exists(); } catch { ok = false; }
  if (!ok) {
    $('#loginCard').classList.remove('hidden');
    $('#app').classList.add('hidden');
    $('#loginMsg').textContent = `這個帳號（${user.email}）沒有後台權限，請換負責人的帳號登入。`;
    return;
  }
  $('#loginCard').classList.add('hidden');
  $('#app').classList.remove('hidden');
  loadSettings();
  unsub = F.onSnapshot(F.query(F.collection(db, 'orders'), F.orderBy('createdAt', 'asc')), (snap) => {
    orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    render();
  }, (err) => { console.error(err); toast('讀取訂單失敗：' + (err.code || err.message)); });
});

// ---------- 設定 ----------
async function loadSettings() {
  const s = (await F.getDoc(F.doc(db, 'settings', 'main'))).data() || {};
  $('#setOpen').checked = s.open !== false;
  $('#setShop').value = s.shopMode === 'both' || SHOPS[s.shopMode] ? s.shopMode : 'presotea';
  branches = s.branches || {};
  $('#setBranchPresotea').value = branches.presotea ?? SHOPS.presotea.branch;
  $('#setBranchTptea').value = branches.tptea ?? SHOPS.tptea.branch;
  $('#setTitle').value = s.title || '';
  $('#setDeadline').value = s.deadline || '';
  $('#setNote').value = s.note || '';
  render();
}
$('#saveSettings').addEventListener('click', async () => {
  const mode = $('#setShop').value;
  branches = { presotea: $('#setBranchPresotea').value.trim(), tptea: $('#setBranchTptea').value.trim() };
  try {
    await F.setDoc(F.doc(db, 'settings', 'main'), {
      open: $('#setOpen').checked,
      shopMode: mode,
      branches,
      title: $('#setTitle').value.trim(),
      deadline: $('#setDeadline').value.trim(),
      note: $('#setNote').value.trim(),
      updatedAt: F.serverTimestamp(),
    }, { merge: true });
    const label = mode === 'both' ? '兩家都開放' : SHOPS[mode].brand;
    toast(`已儲存：${label}・${$('#setOpen').checked ? '開放點單中' : '點單已截止'}`);
    render();
  } catch (err) { toast('儲存失敗：' + (err.code || err.message)); }
});

// ---------- 計算 ----------
const active = () => orders.filter((o) => o.status !== 'cancelled');
const fmtTime = (ts) => (ts?.toDate ? ts.toDate().toLocaleString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—');

// 依店家分組，再依品項、口味合併
function groupsByShop() {
  const shops = new Map();
  for (const o of active()) {
    const sid = shopOf(o);
    if (!shops.has(sid)) shops.set(sid, { id: sid, cups: 0, price: 0, people: 0, items: new Map() });
    const S = shops.get(sid);
    S.cups += o.totalCups || 0; S.price += o.totalPrice || 0; S.people += 1;
    for (const it of o.items || []) {
      if (!S.items.has(it.itemId)) S.items.set(it.itemId, { id: it.itemId, name: it.name, cat: it.cat, qty: 0, specs: new Map() });
      const g = S.items.get(it.itemId);
      g.qty += it.qty;
      const key = [it.variant || '', it.size, it.ice, it.sugar, [...(it.toppings || [])].sort().join('+'), it.note || ''].join('|');
      if (!g.specs.has(key)) g.specs.set(key, { spec: specText(it, sid), note: it.note, qty: 0, who: [] });
      const s = g.specs.get(key);
      s.qty += it.qty;
      s.who.push(it.qty > 1 ? `${o.name}×${it.qty}` : o.name);
    }
  }
  return SHOP_IDS.filter((id) => shops.has(id)).map((id) => {
    const S = shops.get(id);
    S.list = [...S.items.values()].sort((a, b) => (order[a.id] ?? 999) - (order[b.id] ?? 999));
    return S;
  });
}

function render() {
  const act = active();
  const cups = act.reduce((s, o) => s + (o.totalCups || 0), 0);
  const price = act.reduce((s, o) => s + (o.totalPrice || 0), 0);
  const paid = act.filter((o) => o.paid).reduce((s, o) => s + (o.totalPrice || 0), 0);
  $('#sPeople').textContent = act.length;
  $('#sCups').textContent = cups;
  $('#sPrice').textContent = `$${price}`;
  $('#sPaid').textContent = `$${paid}`;

  const gs = groupsByShop();
  $('#view-sum').innerHTML = gs.length ? gs.map((S) => `
    <div class="shop-head" style="background:${SHOPS[S.id].theme.grad}"><span>${esc(shopTitle(S.id, branches))}</span><span>${S.people} 人・${S.cups} 杯・$${S.price}</span></div>
    ${S.list.map((g) => `<div class="grp">
      <div class="grp-head"><span>${esc(g.name)} <small class="muted">${esc(g.cat)}</small></span><span class="cnt">${g.qty} 杯</span></div>
      ${[...g.specs.values()].map((s) => `<div class="grp-row"><div>${esc(s.spec)}${s.note ? `・<strong>${esc(s.note)}</strong>` : ''}<small>${esc(s.who.join('、'))}</small></div><span class="cnt">× ${s.qty}</span></div>`).join('')}
    </div>`).join('')}`).join('') : '<p class="muted">目前還沒有訂單。把點單網址分享給大家吧！</p>';

  const showC = $('#showCancelled').checked;
  const list = orders.filter((o) => showC || o.status !== 'cancelled');
  $('#view-people').innerHTML = list.length ? `<div class="tbl-wrap"><table>
    <thead><tr><th>#</th><th>姓名</th><th>店家</th><th>飲料</th><th>杯數</th><th>金額</th><th>時間</th><th>收款</th><th class="act-col">操作</th></tr></thead>
    <tbody>${list.map((o, i) => `<tr class="${o.status === 'cancelled' ? 'cancelled' : ''}">
      <td>${i + 1}</td>
      <td><strong>${esc(o.name)}</strong>${o.note ? `<br><small class="muted">📝 ${esc(o.note)}</small>` : ''}</td>
      <td><span class="shop-tag" style="background:${SHOPS[shopOf(o)].theme.brand}">${esc(SHOPS[shopOf(o)].brand)}</span></td>
      <td><ul>${(o.items || []).map((it) => `<li>${esc(it.name)} ×${it.qty}<br><small class="muted">${esc(specText(it, shopOf(o)))}${it.note ? `・${esc(it.note)}` : ''}</small></li>`).join('')}</ul></td>
      <td>${o.totalCups}</td><td>$${o.totalPrice}</td><td>${fmtTime(o.createdAt)}</td>
      <td>${o.status === 'cancelled' ? '已取消' : `<label class="paid-toggle"><input type="checkbox" data-paid="${o.id}" ${o.paid ? 'checked' : ''}>${o.paid ? '已收' : '未收'}</label>`}</td>
      <td class="act-col">${o.status === 'cancelled'
        ? `<button class="btn ghost sm" data-restore="${o.id}">恢復</button>`
        : `<button class="btn ghost sm" data-del="${o.id}">刪除</button>`}</td>
    </tr>`).join('')}</tbody></table></div>` : '<p class="muted">目前還沒有訂單。</p>';

  $('#copyText').textContent = buildText(gs);
  $('#clearN').textContent = orders.length;
}

function buildText(gs) {
  if (!gs.length) return '（目前沒有訂單）';
  const lines = [];
  gs.forEach((S, si) => {
    if (si) lines.push('', '────────', '');
    lines.push(`${shopTitle(S.id, branches)} 訂單`, `共 ${S.cups} 杯，試算 $${S.price}`, '');
    S.list.forEach((g, i) => {
      lines.push(`${i + 1}. ${g.name}　共 ${g.qty} 杯`);
      for (const s of g.specs.values()) lines.push(`　・${s.spec}${s.note ? `（${s.note}）` : ''} × ${s.qty}`);
    });
  });
  return lines.join('\n');
}

// ---------- 操作 ----------
$('#view-people').addEventListener('change', async (e) => {
  const id = e.target.dataset.paid;
  if (!id) return;
  try { await F.updateDoc(F.doc(db, 'orders', id), { paid: e.target.checked }); } catch (err) { toast('更新失敗：' + err.code); }
});
$('#view-people').addEventListener('click', async (e) => {
  const del = e.target.closest('[data-del]');
  const res = e.target.closest('[data-restore]');
  if (del) {
    const o = orders.find((x) => x.id === del.dataset.del);
    if (!confirm(`確定刪除「${o?.name}」的訂單？刪除後無法復原。`)) return;
    try { await F.deleteDoc(F.doc(db, 'orders', del.dataset.del)); toast('已刪除'); } catch (err) { toast('刪除失敗：' + err.code); }
  }
  if (res) {
    try { await F.updateDoc(F.doc(db, 'orders', res.dataset.restore), { status: 'active' }); toast('已恢復'); } catch (err) { toast('恢復失敗：' + err.code); }
  }
});
$('#showCancelled').addEventListener('change', render);

document.querySelector('.tabs').addEventListener('click', (e) => {
  const t = e.target.closest('.tab');
  if (!t) return;
  document.querySelectorAll('.tab').forEach((x) => x.classList.toggle('active', x === t));
  document.querySelectorAll('.view').forEach((v) => v.classList.toggle('hidden', v.id !== `view-${t.dataset.view}`));
});

$('#copyBtn').addEventListener('click', async () => {
  const text = $('#copyText').textContent;
  try { await navigator.clipboard.writeText(text); toast('已複製，可以貼到 LINE 或照著念給店家'); }
  catch { document.querySelector('[data-view="text"]').click(); toast('請手動選取文字清單複製'); }
});

$('#printBtn').addEventListener('click', () => window.print());

$('#csvBtn').addEventListener('click', () => {
  const head = ['時間', '店家', '姓名', '飲料', '分類', '容量', '冰塊', '甜度', '加料', '杯數', '單價', '小計', '飲料備註', '訂單備註', '收款', '狀態'];
  const rows = [head];
  for (const o of orders) {
    for (const it of o.items || []) {
      rows.push([fmtTime(o.createdAt), SHOPS[shopOf(o)].brand, o.name, (it.variant && it.variant !== '原味' ? it.variant + ' ' : '') + it.name, it.cat, it.sizeLabel || it.size, it.ice, it.sugar, (it.toppings || []).join('、'), it.qty, it.unitPrice, it.unitPrice * it.qty, it.note || '', o.note || '', o.paid ? '已收' : '未收', o.status === 'cancelled' ? '已取消' : '有效']);
    }
  }
  const csv = rows.map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  const d = new Date();
  a.href = URL.createObjectURL(blob);
  a.download = `飲料團購訂單_${d.getMonth() + 1}月${d.getDate()}日.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});

$('#clearBtn').addEventListener('click', () => { $('#clearInput').value = ''; $('#clearGo').disabled = true; $('#clearDlg').showModal(); });
$('#clearCancel').addEventListener('click', () => $('#clearDlg').close());
$('#clearInput').addEventListener('input', (e) => { $('#clearGo').disabled = e.target.value.trim() !== '清空'; });
$('#clearGo').addEventListener('click', async () => {
  $('#clearGo').disabled = true;
  try {
    for (let i = 0; i < orders.length; i += 400) {
      const b = F.writeBatch(db);
      orders.slice(i, i + 400).forEach((o) => b.delete(F.doc(db, 'orders', o.id)));
      await b.commit();
    }
    $('#clearDlg').close(); toast('已清空全部訂單');
  } catch (err) { toast('清空失敗：' + err.code); }
});

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}
