// 买量源数据：按 “日 × 国家 × 媒体 × 产品形态” 一条记录
const RAW_PAID = [
  {
    date: "2025-10-01",
    country: "GH",
    media: "FB",
    productType: "app", // 或 web、mweb 等
    spent: 500.0,
    registration: 200,
    D0_unique_purchase: 45,
    D7_unique_purchase: 70,
    D0_PURCHASE_VALUE: 220.0,
    D7_PURCHASE_VALUE: 780.0,
    D0_TOTAL_BET_PLACED_USER: 60,
    D7_TOTAL_BET_PLACED_USER: 90,
    D0_SPORTS_BET_PLACED_USER: 25,
    D0_GAMES_BET_PLACED_USER: 50,
    D7_SPORTS_BET_PLACED_USER: 32,
    D7_GAMES_BET_PLACED_USER: 72,
    D0_SPORTS_BET_FLOW: 160.0,
    D0_GAMES_BET_FLOW: 330.0,
    D0_TOTAL_BET_FLOW: 490.0,
    D7_SPORTS_BET_FLOW: 420.0,
    D7_GAMES_BET_FLOW: 1830.0,
    D7_TOTAL_BET_FLOW: 2250.0,
    D1_retained_users: 80,
    D7_retained_users: 44,
  },
  // 继续追加...
];
