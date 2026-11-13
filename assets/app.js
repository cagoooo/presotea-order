import { firebaseConfig, SDK, VERSION } from './config.js';
import { MENU, ALL_ITEMS, SUGAR, ICE, HOT_ICE, TOPPINGS, inSeason, seasonLabel, toppingPrice, specText } from './menu.js';

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* 私密模式 */ } },
};

$('#ver').textContent = VERSION;

// ---------- 狀態 ----------
let cups = [];           // 每一杯（或同口味多杯）的設定
let isOpen = true;
let seq = 0;
const byId = Object.fromEntries(ALL_ITEMS.map((it) => [it.id, it]));

const nameInput = $('#name');
nameInput.value = store.get('presotea-name', '');

// ---------- 菜單 ----------
function renderCats() {
  $('#cats').innerHTML = MENU.map((c, i) =>
    `<button class="cat-btn${i === 0 ? ' active' : ''}" data-cat="${c.id}">${esc(c.name)}</button>`).join('');
}

function unitPrice(c) {
  const it = byId[c.itemId];
  return (c.size === '瓶' ? it.bottle : it.price) + toppingPrice(c.toppings);
}

function pills(group, cupId, options, selected, { disabled = [], multi = false, need = false } = {}) {
  return options.map((o) => {
    const val = typeof o === 'string' ? o : o.name;
    const label = typeof o === 'string' ? o : `${o.name} +${o.price}`;
    const sel = multi ? selected.includes(val) : selected === val;
    return `<button type="button" class="pill${sel ? ' sel' : ''}${need && !selected ? ' need' : ''}" data-act="${group}" data-cup="${cupId}" data-val="${esc(val)}"${disabled.includes(val) ? ' disabled' : ''}>${esc(label)}</button>`;
  }).join('');
}

function cupHTML(c, idx, total) {
  const it = byId[c.itemId];
  const iceOpts = it.fixedIce ? ['冰沙（固定）'] : ICE;
  const iceDisabled = it.hot ? [] : HOT_ICE;
  return `<div class="cup" data-cupbox="${c.uid}">
    <div class="cup-label"><span>${total > 1 ? `第 ${idx + 1} 種口味` : '口味設定'}・$${unitPrice(c)}／杯</span>
      ${total > 1 ? `<button type="button" class="link-btn danger" data-act="del" data-cup="${c.uid}">移除</button>` : ''}</div>
    ${it.bottle ? `<div class="opt-row"><span>容量</span><div class="pills">${pills('size', c.uid, ['L', '瓶'], c.size)}</div></div>` : ''}
    <div class="opt-row"><span>甜度</span><div class="pills">${pills('sugar', c.uid, SUGAR, c.sugar, { need: c.showNeed })}</div></div>
    <div class="opt-row"><span>冰塊</span><div class="pills">${pills('ice', c.uid, iceOpts, c.ice, { disabled: iceDisabled, need: c.showNeed })}</div></div>
    <div class="opt-row"><span>加料</span><div class="pills">${pills('top', c.uid, TOPPINGS, c.toppings, { multi: true })}</div></div>
    <div class="opt-row"><span>杯數</span><div class="qty"><button type="button" data-act="minus" data-cup="${c.uid}" aria-label="少一杯">－</button><output>${c.qty}</output><button type="button" data-act="plus" data-cup="${c.uid}" aria-label="多一杯">＋</button></div></div>
    <div class="opt-row"><span>備註</span><input class="small-input" maxlength="40" data-act="note" data-cup="${c.uid}" value="${esc(c.note)}" placeholder="可不填"></div>
  </div>`;
}

function drinkHTML(it) {
  const mine = cups.filter((c) => c.itemId === it.id);
  const ok = inSeason(it);
  const on = mine.length > 0;
  const tags = `${it.hot ? '<span class="tag" title="可做熱飲">🔥</span>' : ''}${it.rec ? '<span class="tag" title="熱賣推薦">👍</span>' : ''}`;
  const sub = [!ok ? `非供應期間（${seasonLabel(it)}）` : seasonLabel(it), it.fixedIce ? '冰沙無法調冰' : ''].filter(Boolean).join('・');
  return `<div class="drink${on ? ' on' : ''}${ok ? '' : ' off'}" data-item="${it.id}">
    <div class="drink-head" role="checkbox" aria-checked="${on}" tabindex="${ok ? 0 : -1}" data-act="toggle" data-id="${it.id}">
      <span class="check"></span>
      <span class="drink-name">${esc(it.name)}${tags}${sub ? `<small>${esc(sub)}</small>` : ''}</span>
      <span class="price">$${it.price}${it.bottle ? `<small>／瓶${it.bottle}</small>` : ''}</span>
    </div>
    ${on ? `<div class="cups">${mine.map((c, i) => cupHTML(c, i, mine.length)).join('')}
      <button type="button" class="link-btn" data-act="more" data-id="${it.id}">＋ 再一杯不同口味</button></div>` : ''}
  </div>`;
}

function renderMenu() {
  const q = $('#search').value.trim();
  $('#menu').innerHTML = MENU.map((cat) => {
    const items = cat.items.filter((it) => !q || it.name.includes(q) || cat.name.includes(q));
    if (!items.length) return '';
    return `<section class="cat-section" id="cat-${cat.id}">
      <div class="cat-title" style="background:${cat.color}">${esc(cat.name)}<small>${esc(cat.note || 'L 杯')}</small></div>
      <div class="items">${items.map(drinkHTML).join('')}</div></section>`;
  }).join('') || '<p class="hint">找不到符合的飲料，換個關鍵字試試。</p>';
}

function rerenderDrink(itemId) {
  const el = document.querySelector(`[data-item="${itemId}"]`);
  if (el) el.outerHTML = drinkHTML(byId[itemId]);
  renderCart();
}

function newCup(itemId) {
  const it = byId[itemId];
  return { uid: `c${++seq}`, itemId, size: 'L', sugar: '', ice: it.fixedIce ? '冰沙（固定）' : '', toppings: [], qty: 1, note: '' };
}

// ---------- 購物車 ----------
function totals() {
  const cupsN = cups.reduce((s, c) => s + c.qty, 0);
  const price = cups.reduce((s, c) => s + unitPrice(c) * c.qty, 0);
  return { cupsN, price };
}

function renderCart() {
  const { cupsN, price } = totals();
  $('#cartCount').textContent = cupsN ? `${cupsN} 杯・$${price}` : '還沒選飲料';
  $('#cartText').textContent = cupsN ? cups.map((c) => `${byId[c.itemId].name}×${c.qty}`).join('、') : '勾選上方菜單開始點餐';
  $('#submitBtn').disabled = !cupsN || !isOpen;
}

$('#menu').addEventListener('click', (e) => {
  const t = e.target.closest('[data-act]');
  if (!t || t.dataset.act === 'note') return;
  const act = t.dataset.act;
  if (act === 'toggle') {
    const id = t.dataset.id;
    if (!inSeason(byId[id])) return toast('這款目前不在供應期間');
    if (cups.some((c) => c.itemId === id)) cups = cups.filter((c) => c.itemId !== id);
    else cups.push(newCup(id));
    return rerenderDrink(id);
  }
  if (act === 'more') { cups.push(newCup(t.dataset.id)); return rerenderDrink(t.dataset.id); }
  const c = cups.find((x) => x.uid === t.dataset.cup);
  if (!c) return;
  const v = t.dataset.val;
  if (act === 'size') c.size = v;
  if (act === 'sugar') c.sugar = v;
  if (act === 'ice') c.ice = v;
  if (act === 'top') c.toppings = c.toppings.includes(v) ? c.toppings.filter((x) => x !== v) : [...c.toppings, v];
  if (act === 'plus') c.qty = Math.min(20, c.qty + 1);
  if (act === 'minus') c.qty = Math.max(1, c.qty - 1);
  if (act === 'del') cups = cups.filter((x) => x !== c);
  if (c.sugar && c.ice) c.showNeed = false;
  rerenderDrink(c.itemId);
});

$('#menu').addEventListener('keydown', (e) => {
  if ((e.key === ' ' || e.key === 'Enter') && e.target.matches('.drink-head')) { e.preventDefault(); e.target.click(); }
});
$('#menu').addEventListener('input', (e) => {
  if (e.target.dataset.act !== 'note') return;
  const c = cups.find((x) => x.uid === e.target.dataset.cup);
  if (c) c.note = e.target.value;
});

$('#cats').addEventListener('click', (e) => {
  const b = e.target.closest('.cat-btn');
  if (!b) return;
  if ($('#search').value) { $('#search').value = ''; renderMenu(); }
  document.querySelectorAll('.cat-btn').forEach((x) => x.classList.toggle('active', x === b));
  document.getElementById(`cat-${b.dataset.cat}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
$('#search').addEventListener('input', renderMenu);
nameInput.addEventListener('input', () => nameInput.classList.remove('err'));

// ---------- 送出 ----------
function validate() {
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.classList.add('err');
    nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    nameInput.focus({ preventScroll: true });
    toast('請先填寫名字');
    return false;
  }
  const bad = cups.filter((c) => !c.sugar || !c.ice);
  if (bad.length) {
    bad.forEach((c) => { c.showNeed = true; });
    [...new Set(bad.map((c) => c.itemId))].forEach(rerenderDrink);
    document.querySelector(`[data-cupbox="${bad[0].uid}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    toast(`還有 ${bad.length} 杯沒選甜度或冰塊`);
    return false;
  }
  return true;
}

$('#submitBtn').addEventListener('click', () => {
  if (!isOpen) return toast('點單已截止');
  if (!validate()) return;
  const { price } = totals();
  $('#cName').textContent = nameInput.value.trim();
  $('#cList').innerHTML = cups.map((c) => `<li><div>${esc(byId[c.itemId].name)} × ${c.qty}<small>${esc(specText(c))}${c.note ? `・${esc(c.note)}` : ''}</small></div><strong>$${unitPrice(c) * c.qty}</strong></li>`).join('');
  $('#cTotal').textContent = `$${price}`;
  $('#confirmDlg').showModal();
});
$('#cBack').addEventListener('click', () => $('#confirmDlg').close());

let fb = null;
async function firebase() {
  if (fb) return fb;
  const [{ initializeApp }, fs] = await Promise.all([import(`${SDK}/firebase-app.js`), import(`${SDK}/firebase-firestore.js`)]);
  const app = initializeApp(firebaseConfig);
  fb = { ...fs, db: fs.getFirestore(app) };
  return fb;
}

function makeKey() {
  const a = new Uint8Array(18);
  crypto.getRandomValues(a);
  return [...a].map((b) => b.toString(16).padStart(2, '0')).join('');
}

$('#cSend').addEventListener('click', async () => {
  const btn = $('#cSend');
  btn.disabled = true; btn.textContent = '送出中…';
  try {
    const { db, collection, addDoc, serverTimestamp } = await firebase();
    const name = nameInput.value.trim();
    const { cupsN, price } = totals();
    const editKey = makeKey();
    const items = cups.map((c) => {
      const it = byId[c.itemId];
      return { itemId: it.id, name: it.name, cat: it.cat, size: c.size, sugar: c.sugar, ice: c.ice, toppings: c.toppings, qty: c.qty, unitPrice: unitPrice(c), note: c.note.trim() };
    });
    const ref = await addDoc(collection(db, 'orders'), {
      name, items, totalCups: cupsN, totalPrice: price,
      note: $('#orderNote').value.trim(), status: 'active', paid: false, editKey, createdAt: serverTimestamp(),
    });
    store.set('presotea-name', name);
    const mine = store.get('presotea-mine', []);
    mine.unshift({ id: ref.id, editKey, name, text: items.map((i) => `${i.name}×${i.qty}（${specText(i)}）`).join('、'), total: price, at: Date.now() });
    store.set('presotea-mine', mine.slice(0, 20));
    $('#confirmDlg').close();
    $('#successText').textContent = `${name} 的 ${cupsN} 杯飲料（$${price}）已送出，負責人會統一訂購。`;
    $('#successCard').classList.remove('hidden');
    cups = []; $('#orderNote').value = '';
    renderMenu(); renderCart(); renderMine();
    $('#successCard').scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (err) {
    console.error(err);
    toast(err?.code === 'permission-denied' ? '送出失敗：點單可能已截止' : '送出失敗，請檢查網路後再試一次');
  } finally {
    btn.disabled = false; btn.textContent = '送出訂單';
  }
});

$('#againBtn').addEventListener('click', () => {
  $('#successCard').classList.add('hidden');
  nameInput.value = ''; nameInput.focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---------- 我的訂單（可取消） ----------
function renderMine() {
  const mine = store.get('presotea-mine', []);
  $('#mineCard').classList.toggle('hidden', !mine.length);
  $('#mineList').innerHTML = mine.map((m) => `<li><div><strong>${esc(m.name)}</strong>・$${m.total}${m.cancelled ? '（已取消）' : ''}<small>${esc(m.text)}</small></div>
    ${m.cancelled ? '' : `<button class="btn ghost sm" data-cancel="${esc(m.id)}">取消</button>`}</li>`).join('');
}
$('#mineList').addEventListener('click', async (e) => {
  const b = e.target.closest('[data-cancel]');
  if (!b) return;
  const mine = store.get('presotea-mine', []);
  const m = mine.find((x) => x.id === b.dataset.cancel);
  if (!m || !confirm(`確定要取消 ${m.name} 的訂單嗎？`)) return;
  b.disabled = true;
  try {
    const { db, doc, updateDoc, serverTimestamp } = await firebase();
    await updateDoc(doc(db, 'orders', m.id), { status: 'cancelled', cancelledAt: serverTimestamp(), editKey: m.editKey });
    m.cancelled = true; store.set('presotea-mine', mine); renderMine();
    toast('已取消，可以重新點一份');
  } catch (err) {
    console.error(err); b.disabled = false;
    toast('取消失敗，請直接告訴負責人');
  }
});

// ---------- 開放狀態 ----------
async function watchSettings() {
  try {
    const { db, doc, onSnapshot } = await firebase();
    onSnapshot(doc(db, 'settings', 'main'), (snap) => {
      const s = snap.data() || {};
      isOpen = s.open !== false;
      if (s.title) { $('#title').textContent = s.title; document.title = `${s.title}｜鮮茶道團購點單`; }
      if (s.note) $('#note').textContent = s.note;
      $('#status').className = `chip ${isOpen ? 'open' : 'closed'}`;
      $('#status').textContent = isOpen ? '🟢 開放點單中' : '⛔ 已截止';
      $('#deadline').classList.toggle('hidden', !s.deadline);
      $('#deadline').textContent = s.deadline ? `⏰ 截止：${s.deadline}` : '';
      $('#closedNotice').classList.toggle('hidden', isOpen);
      renderCart();
    }, () => { $('#status').textContent = '⚠️ 無法連線'; });
  } catch {
    $('#status').textContent = '⚠️ 無法連線';
  }
}

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

renderCats(); renderMenu(); renderCart(); renderMine(); watchSettings();
