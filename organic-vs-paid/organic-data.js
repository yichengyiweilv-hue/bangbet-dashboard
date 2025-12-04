/* organic-data.js
   约定：必须在 window 上定义 RAW_ORGANIC_BY_MONTH
   结构：{ "YYYY-MM": [ { date:"YYYY-MM-DD", country:"GH", registration:..., ... } ] }
*/

window.RAW_ORGANIC_BY_MONTH = window.RAW_ORGANIC_BY_MONTH || {
  "2025-10": [
    {
      date: "2025-10-01",
      country: "GH",

      // 注册与付费
      registration: 100,
      D0_unique_purchase: 10,
      D7_unique_purchase: 18,
      D0_PURCHASE_VALUE: 120.0,
      D7_PURCHASE_VALUE: 310.0,

      // 下注用户（用于人均流水）
      D0_TOTAL_BET_PLACED_USER: 30,
      D7_TOTAL_BET_PLACED_USER: 48,
      D0_SPORTS_BET_PLACED_USER: 12,
      D0_GAMES_BET_PLACED_USER: 18,
      D7_SPORTS_BET_PLACED_USER: 19,
      D7_GAMES_BET_PLACED_USER: 29,

      // 流水
      D0_SPORTS_BET_FLOW: 240.0,
      D0_GAMES_BET_FLOW: 360.0,
      D0_TOTAL_BET_FLOW: 600.0,
      D7_SPORTS_BET_FLOW: 800.0,
      D7_GAMES_BET_FLOW: 1200.0,
      D7_TOTAL_BET_FLOW: 2000.0,

      // 留存
      D1_retained_users: 40,
      D7_retained_users: 15,
    },

    {
      date: "2025-10-01",
      country: "KE",

      registration: 80,
      D0_unique_purchase: 6,
      D7_unique_purchase: 12,
      D0_PURCHASE_VALUE: 72.0,
      D7_PURCHASE_VALUE: 190.0,

      D0_TOTAL_BET_PLACED_USER: 22,
      D7_TOTAL_BET_PLACED_USER: 36,
      D0_SPORTS_BET_PLACED_USER: 9,
      D0_GAMES_BET_PLACED_USER: 13,
      D7_SPORTS_BET_PLACED_USER: 14,
      D7_GAMES_BET_PLACED_USER: 22,

      D0_SPORTS_BET_FLOW: 150.0,
      D0_GAMES_BET_FLOW: 260.0,
      D0_TOTAL_BET_FLOW: 410.0,
      D7_SPORTS_BET_FLOW: 520.0,
      D7_GAMES_BET_FLOW: 980.0,
      D7_TOTAL_BET_FLOW: 1500.0,

      D1_retained_users: 30,
      D7_retained_users: 10,
    },
  ],
};
