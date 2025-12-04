/* paid-data.js
   约定：必须在 window 上定义 RAW_PAID_BY_MONTH
   字段可包含买量专属字段（例如 spent / media 等），但至少要覆盖看板用到的那些指标字段。
*/

window.RAW_PAID_BY_MONTH = window.RAW_PAID_BY_MONTH || {
  "2025-10": [
    {
      date: "2025-10-01",
      country: "GH",

      // 买量可选字段（看板后续如需要可用）
      media: "FB",
      productType: "app",
      spent: 500.0,

      // 注册与付费
      registration: 200,
      D0_unique_purchase: 45,
      D7_unique_purchase: 70,
      D0_PURCHASE_VALUE: 220.0,
      D7_PURCHASE_VALUE: 780.0,

      // 下注用户（用于人均流水）
      D0_TOTAL_BET_PLACED_USER: 60,
      D7_TOTAL_BET_PLACED_USER: 90,
      D0_SPORTS_BET_PLACED_USER: 25,
      D0_GAMES_BET_PLACED_USER: 50,
      D7_SPORTS_BET_PLACED_USER: 32,
      D7_GAMES_BET_PLACED_USER: 72,

      // 流水
      D0_SPORTS_BET_FLOW: 160.0,
      D0_GAMES_BET_FLOW: 330.0,
      D0_TOTAL_BET_FLOW: 490.0,
      D7_SPORTS_BET_FLOW: 420.0,
      D7_GAMES_BET_FLOW: 1830.0,
      D7_TOTAL_BET_FLOW: 2250.0,

      // 留存
      D1_retained_users: 60,
      D7_retained_users: 28,
    },

    {
      date: "2025-10-01",
      country: "KE",
      media: "FB",
      productType: "app",
      spent: 260.0,

      registration: 120,
      D0_unique_purchase: 18,
      D7_unique_purchase: 30,
      D0_PURCHASE_VALUE: 95.0,
      D7_PURCHASE_VALUE: 310.0,

      D0_TOTAL_BET_PLACED_USER: 34,
      D7_TOTAL_BET_PLACED_USER: 52,
      D0_SPORTS_BET_PLACED_USER: 12,
      D0_GAMES_BET_PLACED_USER: 26,
      D7_SPORTS_BET_PLACED_USER: 18,
      D7_GAMES_BET_PLACED_USER: 40,

      D0_SPORTS_BET_FLOW: 90.0,
      D0_GAMES_BET_FLOW: 210.0,
      D0_TOTAL_BET_FLOW: 300.0,
      D7_SPORTS_BET_FLOW: 260.0,
      D7_GAMES_BET_FLOW: 1220.0,
      D7_TOTAL_BET_FLOW: 1480.0,

      D1_retained_users: 36,
      D7_retained_users: 16,
    },
  ],
};
