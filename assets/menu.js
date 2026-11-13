// 鮮茶道 中南部菜單（適用：彰化・南投・雲林・嘉義・台南・高雄・屏東）
// 資料來源：鮮茶道 2026 中南部菜單圖（所有品項與價格以鮮茶道總部公告為準）
// hot: 可做熱飲（菜單上的火焰標示）；rec: 熱賣推薦；bottle: 瓶裝價；season: [起月, 迄月]；fixedIce: 冰沙類無法調冰

export const SHOP = {
  brand: '鮮茶道',
  branch: '嘉義民雄中正店',
};

export const SUGAR = ['全糖', '7分糖', '5分糖', '3分糖', '1分糖', '無糖'];
export const ICE = ['正常冰', '少冰', '薄冰', '去冰', '常溫', '溫', '溫熱'];
export const HOT_ICE = ['溫', '溫熱'];

export const TOPPINGS = [
  { name: '珍珠', price: 10 },
  { name: '椰果', price: 10 },
  { name: '寒天', price: 10 },
  { name: 'QQ（珍珠＋椰果）', price: 10 },
  { name: '荔枝QQ', price: 10 },
  { name: '仙草凍', price: 10 },
  { name: '小紫蘇', price: 10 },
  { name: '熊貓（珍珠＋寒天）', price: 15 },
  { name: '統一布丁', price: 15 },
];

const d = (name, price, opt = {}) => ({ name, price, ...opt });

export const MENU = [
  {
    id: 'milk', name: '奶茶繽紛樂', color: '#e8772e', items: [
      d('熊貓黑糖珍奶茶', 65, { hot: 1, rec: 1 }),
      d('英倫奶茶', 50, { hot: 1, rec: 1 }),
      d('茉香奶茶', 45, { hot: 1 }),
      d('沖繩黑糖風味奶茶', 50, { hot: 1 }),
      d('伯爵奶茶', 50, { hot: 1 }),
      d('焙茶烤奶', 50, { hot: 1 }),
      d('珍珠奶茶', 55, { hot: 1, rec: 1 }),
      d('仙草凍奶茶', 55),
      d('布丁奶茶', 60),
      d('一番極品抹茶奶綠', 60, { hot: 1 }),
      d('泰式奶茶', 60, { hot: 1 }),
      d('印度香料奶茶', 70, { hot: 1 }),
    ],
  },
  {
    id: 'foam', name: '奶蓋系列', color: '#e8772e', items: [
      d('英倫奶蓋', 50, { hot: 1 }),
      d('桃氣烏龍奶蓋', 55, { hot: 1, rec: 1 }),
      d('茶花綠茶奶蓋', 55, { hot: 1 }),
      d('一番極品抹茶奶蓋', 70, { hot: 1 }),
    ],
  },
  {
    id: 'latte', name: '鮮奶系列', color: '#e8772e', items: [
      d('紅茶拿鐵', 60, { hot: 1 }),
      d('綠茶拿鐵', 60, { hot: 1 }),
      d('伯爵拿鐵', 65, { hot: 1, rec: 1 }),
    ],
  },
  {
    id: 'season', name: '季節限定', color: '#e87b7b', items: [
      d('翡翠檸檬冰鑽', 60, { rec: 1, fixedIce: 1 }),
      d('薑汁撞奶', 65, { hot: 1, season: [11, 2] }),
      d('黑糖薑茶', 55, { hot: 1, season: [11, 2] }),
      d('桂圓紅棗茶', 55, { hot: 1, rec: 1, season: [11, 2] }),
    ],
  },
  {
    id: 'decaf', name: '無咖啡因', color: '#3aa7b9', items: [
      d('黑糖珍珠撞奶', 65, { hot: 1, rec: 1 }),
      d('古早味冬瓜茶', 35),
      d('蕎麥穀物茶', 40, { hot: 1 }),
      d('蕎麥穀物冬瓜', 50),
      d('蕎麥穀奶', 50, { hot: 1 }),
      d('檸檬CC', 40),
      d('藍莓果茶', 45, { hot: 1 }),
      d('鮮桔檸檬飲', 50, { hot: 1 }),
      d('冬瓜檸檬', 55, { rec: 1 }),
      d('蜂蜜檸好', 60),
      d('橙美荔', 65),
      d('洛神打檸', 70, { rec: 1 }),
      d('洛神多多', 65),
      d('洛神汁', 45),
      d('紅心芭樂梅', 65, { season: [5, 9] }),
      d('紅心芭樂汁', 60, { season: [5, 9] }),
      d('鳳梨冰鑽', 60, { fixedIce: 1 }),
      d('青梅冰鑽', 55, { fixedIce: 1 }),
    ],
  },
  {
    id: 'fresh', name: '鮮淬茶', color: '#2f7d4a', note: '可選 L 杯或 1 瓶', items: [
      d('阿里山冰茶', 30, { hot: 1, rec: 1, bottle: 60 }),
      d('頂級茉莉綠茶', 30, { hot: 1, bottle: 60 }),
      d('琥珀紅茶', 30, { hot: 1, bottle: 60 }),
      d('烏龍綠茶', 30, { hot: 1, bottle: 60 }),
      d('文山清茶', 30, { hot: 1, bottle: 60 }),
      d('鮮露金萱茶', 30, { hot: 1, rec: 1, bottle: 60 }),
      d('凍頂烏龍茶', 35, { hot: 1, bottle: 65 }),
      d('日式玄米茶', 35, { hot: 1, bottle: 65 }),
      d('伯爵紅茶', 35, { hot: 1, bottle: 65 }),
      d('茶花綠茶', 35, { hot: 1, bottle: 65 }),
      d('炭燒焙茶', 35, { hot: 1, rec: 1, bottle: 65 }),
      d('白桃風味烏龍茶', 35, { hot: 1, bottle: 65 }),
    ],
  },
  {
    id: 'premium', name: '特等茶', color: '#2f7d4a', items: [
      d('阿里山里佳甘露', 45, { hot: 1 }),
      d('日月潭紅玉', 45, { hot: 1, rec: 1 }),
    ],
  },
  {
    id: 'fruit', name: '果然纖滋味', color: '#3aa7b9', items: [
      d('招牌水果茶', 65, { hot: 1, rec: 1 }),
      d('鮮果雙Q綠茶', 65, { rec: 1 }),
      d('橙香金萱', 65),
      d('鳳梨清茶', 55),
      d('養樂多綠茶', 50),
      d('梅果綠茶', 45),
      d('墾丁冰茶', 45, { hot: 1, rec: 1 }),
      d('荔枝QQ金萱', 40),
      d('芭樂檸檬玉露', 60, { season: [5, 9] }),
    ],
  },
  {
    id: 'rainforest', name: '雨林聯盟認證茶葉', color: '#2f7d4a', items: [
      d('四季春', 35, { hot: 1, rec: 1 }),
      d('蜜香紅茶', 40, { hot: 1 }),
      d('玉露煎茶', 40, { hot: 1 }),
      d('東方美人茶', 40, { hot: 1 }),
      d('蜜香果茶', 50, { hot: 1 }),
      d('寒天四季奶青', 60, { rec: 1 }),
    ],
  },
];

// 每個品項給一個穩定 id
MENU.forEach((cat) => cat.items.forEach((it, i) => { it.id = `${cat.id}-${i}`; it.cat = cat.name; }));

export const ALL_ITEMS = MENU.flatMap((c) => c.items);

export function inSeason(item, month = new Date().getMonth() + 1) {
  if (!item.season) return true;
  const [a, b] = item.season;
  return a <= b ? month >= a && month <= b : month >= a || month <= b;
}

export function seasonLabel(item) {
  return item.season ? `${item.season[0]}月～${item.season[1]}月供應` : '';
}

export function toppingPrice(names) {
  return names.reduce((s, n) => s + (TOPPINGS.find((t) => t.name === n)?.price || 0), 0);
}

// 一杯的說明文字，例如「L・少冰・3分糖・加珍珠」
export function specText(e) {
  const parts = [e.size === '瓶' ? '1瓶' : 'L', e.ice, e.sugar];
  if (e.toppings?.length) parts.push('加' + e.toppings.join('、'));
  return parts.filter(Boolean).join('・');
}
