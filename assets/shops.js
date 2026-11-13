// 兩家店的菜單資料。所有品項與價格以各品牌門市公告為準。
// 共同欄位：hot 可做熱飲；rec 推薦；bottle 瓶裝價；season [起月,迄月]；from 'YYYY-MM-DD' 上市日；
//           fixedIce 冰沙類無法調冰；variants 口味選項（例如「原味／珍珠」）

const d = (name, price, opt = {}) => ({ name, price, ...opt });
const PEARL = ['原味', '珍珠'];
const DEC = '2026-12-01';

// ---------------- 鮮茶道（2026 中南部菜單：彰化・南投・雲林・嘉義・台南・高雄・屏東） ----------------
const presotea = {
  id: 'presotea',
  brand: '鮮茶道',
  branch: '嘉義民雄中正店',
  menuNote: '中南部菜單（適用嘉義）',
  theme: { brand: '#2f7d4a', brand2: '#3aa7b9', soft: '#e3f1e7', grad: 'linear-gradient(135deg,#2f7d4a 0%,#3a9a6a 55%,#3aa7b9 100%)' },
  sugar: ['全糖', '7分糖', '5分糖', '3分糖', '1分糖', '無糖'],
  ice: ['正常冰', '少冰', '薄冰', '去冰', '常溫', '溫', '溫熱'],
  hotIce: ['溫', '溫熱'],
  sizes: (it) => (it.bottle ? ['L', '瓶'] : null),
  sizeOf: (e) => (e.size === '瓶' ? '1瓶' : 'L'),
  defaultSize: 'L',
  toppings: [
    { name: '珍珠', price: 10 }, { name: '椰果', price: 10 }, { name: '寒天', price: 10 },
    { name: 'QQ（珍珠＋椰果）', price: 10 }, { name: '荔枝QQ', price: 10 }, { name: '仙草凍', price: 10 },
    { name: '小紫蘇', price: 10 }, { name: '熊貓（珍珠＋寒天）', price: 15 }, { name: '統一布丁', price: 15 },
  ],
  legend: '🔥 可做熱飲・👍 熱賣推薦',
  cats: [
    { id: 'milk', name: '奶茶繽紛樂', color: '#e8772e', items: [
      d('熊貓黑糖珍奶茶', 65, { hot: 1, rec: 1 }), d('英倫奶茶', 50, { hot: 1, rec: 1 }), d('茉香奶茶', 45, { hot: 1 }),
      d('沖繩黑糖風味奶茶', 50, { hot: 1 }), d('伯爵奶茶', 50, { hot: 1 }), d('焙茶烤奶', 50, { hot: 1 }),
      d('珍珠奶茶', 55, { hot: 1, rec: 1 }), d('仙草凍奶茶', 55), d('布丁奶茶', 60),
      d('一番極品抹茶奶綠', 60, { hot: 1 }), d('泰式奶茶', 60, { hot: 1 }), d('印度香料奶茶', 70, { hot: 1 }),
    ] },
    { id: 'foam', name: '奶蓋系列', color: '#e8772e', items: [
      d('英倫奶蓋', 50, { hot: 1 }), d('桃氣烏龍奶蓋', 55, { hot: 1, rec: 1 }),
      d('茶花綠茶奶蓋', 55, { hot: 1 }), d('一番極品抹茶奶蓋', 70, { hot: 1 }),
    ] },
    { id: 'latte', name: '鮮奶系列', color: '#e8772e', items: [
      d('紅茶拿鐵', 60, { hot: 1 }), d('綠茶拿鐵', 60, { hot: 1 }), d('伯爵拿鐵', 65, { hot: 1, rec: 1 }),
    ] },
    { id: 'season', name: '季節限定', color: '#e87b7b', items: [
      d('翡翠檸檬冰鑽', 60, { rec: 1, fixedIce: 1 }), d('薑汁撞奶', 65, { hot: 1, season: [11, 2] }),
      d('黑糖薑茶', 55, { hot: 1, season: [11, 2] }), d('桂圓紅棗茶', 55, { hot: 1, rec: 1, season: [11, 2] }),
    ] },
    { id: 'decaf', name: '無咖啡因', color: '#3aa7b9', items: [
      d('黑糖珍珠撞奶', 65, { hot: 1, rec: 1 }), d('古早味冬瓜茶', 35), d('蕎麥穀物茶', 40, { hot: 1 }),
      d('蕎麥穀物冬瓜', 50), d('蕎麥穀奶', 50, { hot: 1 }), d('檸檬CC', 40), d('藍莓果茶', 45, { hot: 1 }),
      d('鮮桔檸檬飲', 50, { hot: 1 }), d('冬瓜檸檬', 55, { rec: 1 }), d('蜂蜜檸好', 60), d('橙美荔', 65),
      d('洛神打檸', 70, { rec: 1 }), d('洛神多多', 65), d('洛神汁', 45),
      d('紅心芭樂梅', 65, { season: [5, 9] }), d('紅心芭樂汁', 60, { season: [5, 9] }),
      d('鳳梨冰鑽', 60, { fixedIce: 1 }), d('青梅冰鑽', 55, { fixedIce: 1 }),
    ] },
    { id: 'fresh', name: '鮮淬茶', color: '#2f7d4a', note: '可選 L 杯或 1 瓶', items: [
      d('阿里山冰茶', 30, { hot: 1, rec: 1, bottle: 60 }), d('頂級茉莉綠茶', 30, { hot: 1, bottle: 60 }),
      d('琥珀紅茶', 30, { hot: 1, bottle: 60 }), d('烏龍綠茶', 30, { hot: 1, bottle: 60 }),
      d('文山清茶', 30, { hot: 1, bottle: 60 }), d('鮮露金萱茶', 30, { hot: 1, rec: 1, bottle: 60 }),
      d('凍頂烏龍茶', 35, { hot: 1, bottle: 65 }), d('日式玄米茶', 35, { hot: 1, bottle: 65 }),
      d('伯爵紅茶', 35, { hot: 1, bottle: 65 }), d('茶花綠茶', 35, { hot: 1, bottle: 65 }),
      d('炭燒焙茶', 35, { hot: 1, rec: 1, bottle: 65 }), d('白桃風味烏龍茶', 35, { hot: 1, bottle: 65 }),
    ] },
    { id: 'premium', name: '特等茶', color: '#2f7d4a', items: [
      d('阿里山里佳甘露', 45, { hot: 1 }), d('日月潭紅玉', 45, { hot: 1, rec: 1 }),
    ] },
    { id: 'fruit', name: '果然纖滋味', color: '#3aa7b9', items: [
      d('招牌水果茶', 65, { hot: 1, rec: 1 }), d('鮮果雙Q綠茶', 65, { rec: 1 }), d('橙香金萱', 65),
      d('鳳梨清茶', 55), d('養樂多綠茶', 50), d('梅果綠茶', 45), d('墾丁冰茶', 45, { hot: 1, rec: 1 }),
      d('荔枝QQ金萱', 40), d('芭樂檸檬玉露', 60, { season: [5, 9] }),
    ] },
    { id: 'rainforest', name: '雨林聯盟認證茶葉', color: '#2f7d4a', items: [
      d('四季春', 35, { hot: 1, rec: 1 }), d('蜜香紅茶', 40, { hot: 1 }), d('玉露煎茶', 40, { hot: 1 }),
      d('東方美人茶', 40, { hot: 1 }), d('蜜香果茶', 50, { hot: 1 }), d('寒天四季奶青', 60, { rec: 1 }),
    ] },
  ],
};

// ---------------- 茶湯會（官網 2026.11 月 S 版，南區：嘉義・台南・高雄・屏東・台東） ----------------
const tptea = {
  id: 'tptea',
  brand: '茶湯會',
  branch: '',
  menuNote: '南區菜單（適用嘉義）',
  theme: { brand: '#8a5a2b', brand2: '#c9a063', soft: '#f4ebde', grad: 'linear-gradient(135deg,#6e4320 0%,#8a5a2b 50%,#c9a063 100%)' },
  sugar: ['標準', '八分糖', '半糖', '微糖', '無糖'],
  ice: ['多冰', '標準冰', '微冰', '去冰', '熱'],
  hotIce: ['熱'],
  sizes: () => null,
  sizeOf: (e) => (e.ice === '熱' ? '16oz' : '22oz'),
  defaultSize: '22oz',
  toppings: [
    { name: '珍珠', price: 10 }, { name: '波霸', price: 10 }, { name: '寒天晶球', price: 10 },
    { name: '紅豆', price: 10 }, { name: '檸檬', price: 10 }, { name: '粉粿', price: 15 }, { name: '燕麥', price: 15 },
  ],
  legend: '🔥 可做熱飲（16oz）・👍 推薦・冷飲 22oz',
  cats: [
    { id: 'top', name: '暢銷排行', color: '#8a5a2b', items: [
      d('粉粿蕎麥四季春', 60), d('翡翠檸檬', 65), d('觀音拿鐵', 70, { hot: 1, variants: PEARL }),
      d('紅豆拿鐵', 75, { hot: 1, variants: PEARL }), d('可可紅茶拿鐵', 80, { hot: 1, rec: 1, variants: PEARL }),
      d('焙茶拿鐵', 85, { hot: 1, rec: 1, variants: PEARL }),
    ] },
    { id: 'cocoa', name: '可可系列', color: '#6e4320', items: [
      d('可可焙茶拿鐵', 85, { hot: 1, rec: 1, variants: PEARL }), d('可可蜜柑觀音拿鐵', 85, { hot: 1, rec: 1 }),
    ] },
    { id: 'strawberry', name: '草莓系列', color: '#c8565b', note: '12月上市・僅冷飲', items: [
      d('草莓翡翠珍珠奶綠', 75, { from: DEC }), d('草莓四季春拿鐵', 80, { rec: 1, from: DEC }),
    ] },
    { id: 'green', name: '清爽綠茶', color: '#6f8a3a', items: [
      d('特級翡翠綠', 40, { hot: 1 }), d('金桂茉莉', 55, { hot: 1 }), d('蜂蜜綠茶', 60), d('百香綠茶', 60),
      d('特級茉莉奶綠', 60, { hot: 1, variants: PEARL }), d('水果茶', 65, { hot: 1 }),
      d('翡翠拿鐵', 70, { hot: 1, variants: PEARL }),
    ] },
    { id: 'oolong', name: '雅韻烏龍', color: '#8a5a2b', items: [
      d('四季春', 40, { hot: 1, variants: PEARL }), d('碳燒鐵觀音', 40, { hot: 1 }), d('冬瓜鐵觀音', 50, { hot: 1 }),
      d('金桂觀音', 55, { hot: 1 }), d('鐵觀音奶茶', 60, { hot: 1, variants: PEARL }), d('冬瓜檸檬鐵觀音', 60),
      d('蜜柑鐵觀音', 65), d('QQ檸檬四季春', 70), d('冬瓜觀音拿鐵', 70, { hot: 1, variants: PEARL }),
      d('金桂觀音拿鐵', 75, { hot: 1, variants: PEARL }), d('蜜柑寒天鐵觀音', 75),
      d('四季春蜂蜜拿鐵', 80, { hot: 1, rec: 1, variants: PEARL }),
    ] },
    { id: 'black', name: '香醇紅茶', color: '#9a4a2e', items: [
      d('蔗香紅茶', 35, { hot: 1, sub: '錫蘭烏瓦紅茶' }), d('功夫紅茶', 40, { hot: 1 }), d('豆漿紅茶', 45, { hot: 1 }),
      d('豆漿奶茶', 55, { hot: 1 }), d('蔗香奶茶', 60, { hot: 1, sub: '錫蘭烏瓦奶茶' }), d('珍珠奶茶', 60, { hot: 1 }),
      d('錫蘭烏瓦檸檬紅茶', 65, { hot: 1 }), d('功夫茶拿鐵', 70, { hot: 1, variants: PEARL }),
      d('紅茶拿鐵', 70, { hot: 1, variants: PEARL }),
    ] },
    { id: 'winter', name: '季節限定', color: '#b07a3a', note: '12月上市・冬季首選', items: [
      d('燕麥鐵觀音／紅茶', 50, { hot: 1, from: DEC, variants: ['鐵觀音', '紅茶'] }),
      d('燕麥觀音拿鐵', 75, { hot: 1, from: DEC }), d('燕麥紅茶拿鐵', 75, { hot: 1, rec: 1, from: DEC }),
    ] },
    { id: 'puer', name: '質樸普洱', color: '#5b4636', note: '12月上市', items: [
      d('普洱茶', 45, { hot: 1, from: DEC }), d('普洱紅／綠／鐵', 50, { hot: 1, from: DEC, variants: ['普洱紅', '普洱綠', '普洱鐵'] }),
      d('普洱拿鐵', 70, { hot: 1, from: DEC, variants: PEARL }), d('厚普洱奶茶', 75, { hot: 1, rec: 1, from: DEC, variants: PEARL }),
    ] },
    { id: 'buckwheat', name: '蕎麥系列', color: '#a07a2c', items: [
      d('黃金蕎麥', 45, { hot: 1, sub: '無茶' }), d('蕎麥四季春', 50, { hot: 1, sub: '含茶' }), d('金桂蕎麥', 55, { hot: 1, sub: '無茶' }),
    ] },
    { id: 'notea', name: '無茶也歡', color: '#c9a063', note: '無茶・僅冷飲', items: [
      d('檸檬冬瓜', 60), d('檸檬蜜', 65), d('拿鐵冬瓜', 70),
    ] },
  ],
};

export const SHOPS = { presotea, tptea };
export const SHOP_IDS = Object.keys(SHOPS);

// 每個品項給全域唯一 id：店家.分類-序號
for (const s of Object.values(SHOPS)) {
  s.cats.forEach((cat) => cat.items.forEach((it, i) => { it.id = `${s.id}.${cat.id}-${i}`; it.cat = cat.name; it.shop = s.id; }));
  s.items = s.cats.flatMap((c) => c.items);
}
export const ITEM_BY_ID = Object.fromEntries(Object.values(SHOPS).flatMap((s) => s.items.map((it) => [it.id, it])));

export function available(item, now = new Date()) {
  if (item.from && now < new Date(item.from + 'T00:00:00')) return false;
  if (!item.season) return true;
  const m = now.getMonth() + 1;
  const [a, b] = item.season;
  return a <= b ? m >= a && m <= b : m >= a || m <= b;
}

export function availLabel(item) {
  if (item.from) { const dt = new Date(item.from + 'T00:00:00'); return `${dt.getMonth() + 1}月上市`; }
  return item.season ? `${item.season[0]}月～${item.season[1]}月供應` : '';
}

export function toppingPrice(shop, names) {
  return (names || []).reduce((s, n) => s + (shop.toppings.find((t) => t.name === n)?.price || 0), 0);
}

// 一杯的說明文字，例如「22oz・微冰・半糖・珍珠・加粉粿」（舊訂單沒有 shop 欄位時視為鮮茶道）
export function specText(e, shopId = 'presotea') {
  const shop = SHOPS[shopId] || presotea;
  const parts = [e.variant && e.variant !== '原味' ? e.variant : '', e.sizeLabel || shop.sizeOf(e), e.ice, e.sugar];
  if (e.toppings?.length) parts.push('加' + e.toppings.join('、'));
  return parts.filter(Boolean).join('・');
}

export function shopTitle(shopId, branches = {}) {
  const s = SHOPS[shopId] || presotea;
  const br = branches[shopId] ?? s.branch;
  return br ? `${s.brand} ${br}` : s.brand;
}
