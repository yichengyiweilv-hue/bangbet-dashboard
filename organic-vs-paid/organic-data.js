// 自然量源数据：按 “日 × 国家” 一条记录
// 约定：
// - date: "YYYY-MM-DD"
// - month 从 date 自动切 "YYYY-MM"
// - currency: USD, 人数单位: 人
const RAW_ORGANIC = [
  // 2025-10 GH 举例
  {
    date: "2025-10-01",
    country: "GH",
    registration: 100,
    D0_unique_purchase: 20,
    D7_unique_purchase: 28,
    D0_PURCHASE_VALUE: 150.0,
    D7_PURCHASE_VALUE: 380.0,
    D0_TOTAL_BET_PLACED_USER: 35,
    D7_TOTAL_BET_PLACED_USER: 48,
    D0_SPORTS_BET_PLACED_USER: 12,
    D0_GAMES_BET_PLACED_USER: 30,
    D7_SPORTS_BET_PLACED_USER: 16,
    D7_GAMES_BET_PLACED_USER: 40,
    D0_SPORTS_BET_FLOW: 90.0,
    D0_GAMES_BET_FLOW: 210.0,
    D0_TOTAL_BET_FLOW: 300.0,
    D7_SPORTS_BET_FLOW: 260.0,
    D7_GAMES_BET_FLOW: 1220.0,
    D7_TOTAL_BET_FLOW: 1480.0,
    D1_retained_users: 60,
    D7_retained_users: 32,
  },
  // 继续追加其他日期 / 国家...
];
