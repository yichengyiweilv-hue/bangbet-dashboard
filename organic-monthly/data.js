
      // ===========================
      // 0. 源数据入口：RAW_ORGANIC_BY_MONTH
      // ===========================
      //
      // 使用说明：
      // 1）按月份分组，每个 key 是 "YYYY-MM"。
      // 2）value 是这个月份每天 × 国家的一组对象。
      // 3）每月更新时，只在这个常量最后面追加一个新的 "YYYY-MM": [...] 区块即可，
      //    不需要改动任何后面的图表/逻辑代码。
      //
      // 字段说明（全部为当日自然注册当日 / 7 日内表现）：
      // - registration                         注册人数
      // - D0_unique_purchase / D7_unique_purchase      首日/7 日内付费人数
      // - D0_PURCHASE_VALUE / D7_PURCHASE_VALUE       首日/7 日内付费金额
      // - D0_TOTAL_BET_PLACED_USER / D7_TOTAL_BET_PLACED_USER   有投注用户数（总）
      // - D0_SPORTS_BET_PLACED_USER / D7_SPORTS_BET_PLACED_USER 体育有投注用户数
      // - D0_GAMES_BET_PLACED_USER / D7_GAMES_BET_PLACED_USER  游戏有投注用户数
      // - D0_SPORTS_BET_FLOW / D7_SPORTS_BET_FLOW             体育流水
      // - D0_GAMES_BET_FLOW / D7_GAMES_BET_FLOW               游戏流水
      // - D0_TOTAL_BET_FLOW / D7_TOTAL_BET_FLOW               总流水
      // - D1_retained_users / D7_retained_users               次日/7 日留存用户数
      //
      // 下面只放一个简单示例，你上线前用真实数据整体替换即可。

      const RAW_ORGANIC_BY_MONTH = {
        "2025-09": [
          {
            date: "2025-09-01", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 302,
            D0_unique_purchase: 138,
            D0_PURCHASE_VALUE: 561.46,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 139,
            D0_SPORTS_BET_PLACED_USER: 64,
            D0_GAMES_BET_PLACED_USER: 104,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 93.48,
            D0_GAMES_BET_FLOW: 2211.0,
            D0_TOTAL_BET_FLOW: 2304.49,

            // 付费 & 投注（D7）
            D7_unique_purchase: 172,
            D7_PURCHASE_VALUE: 3002.0,
            D7_TOTAL_BET_PLACED_USER: 177,
            D7_SPORTS_BET_PLACED_USER: 108,
            D7_GAMES_BET_PLACED_USER: 138,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 532.02,
            D7_GAMES_BET_FLOW: 16393.33,
            D7_TOTAL_BET_FLOW: 16925.36,

            // 留存
            D1_retained_users: 139,
            D7_retained_users: 61,
          },

          {
            date: "2025-09-01", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 923,
            D0_unique_purchase: 238,
            D0_PURCHASE_VALUE: 641.65,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 242,
            D0_SPORTS_BET_PLACED_USER: 48,
            D0_GAMES_BET_PLACED_USER: 217,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 31.08,
            D0_GAMES_BET_FLOW: 4469.74,
            D0_TOTAL_BET_FLOW: 4500.83,

            // 付费 & 投注（D7）
            D7_unique_purchase: 298,
            D7_PURCHASE_VALUE: 2211.02,
            D7_TOTAL_BET_PLACED_USER: 327,
            D7_SPORTS_BET_PLACED_USER: 108,
            D7_GAMES_BET_PLACED_USER: 281,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 68.42,
            D7_GAMES_BET_FLOW: 18860.97,
            D7_TOTAL_BET_FLOW: 18929.39,

            // 留存
            D1_retained_users: 247,
            D7_retained_users: 66,
          },

          {
            date: "2025-09-01", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1491,
            D0_unique_purchase: 520,
            D0_PURCHASE_VALUE: 1014.7,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 480,
            D0_SPORTS_BET_PLACED_USER: 290,
            D0_GAMES_BET_PLACED_USER: 299,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 120.89,
            D0_GAMES_BET_FLOW: 4413.8,
            D0_TOTAL_BET_FLOW: 4534.69,

            // 付费 & 投注（D7）
            D7_unique_purchase: 650,
            D7_PURCHASE_VALUE: 5317.37,
            D7_TOTAL_BET_PLACED_USER: 654,
            D7_SPORTS_BET_PLACED_USER: 436,
            D7_GAMES_BET_PLACED_USER: 434,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1943.4,
            D7_GAMES_BET_FLOW: 23051.72,
            D7_TOTAL_BET_FLOW: 24995.13,

            // 留存
            D1_retained_users: 569,
            D7_retained_users: 132,
          },

          {
            date: "2025-09-01", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 773,
            D0_unique_purchase: 161,
            D0_PURCHASE_VALUE: 295.23,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 160,
            D0_SPORTS_BET_PLACED_USER: 74,
            D0_GAMES_BET_PLACED_USER: 116,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 21.66,
            D0_GAMES_BET_FLOW: 1137.43,
            D0_TOTAL_BET_FLOW: 1159.09,

            // 付费 & 投注（D7）
            D7_unique_purchase: 265,
            D7_PURCHASE_VALUE: 886.79,
            D7_TOTAL_BET_PLACED_USER: 273,
            D7_SPORTS_BET_PLACED_USER: 163,
            D7_GAMES_BET_PLACED_USER: 179,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 72.41,
            D7_GAMES_BET_FLOW: 6326.34,
            D7_TOTAL_BET_FLOW: 6398.75,

            // 留存
            D1_retained_users: 206,
            D7_retained_users: 58,
          },

          {
            date: "2025-09-01", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 113,
            D0_unique_purchase: 44,
            D0_PURCHASE_VALUE: 138.48,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 46,
            D0_SPORTS_BET_PLACED_USER: 27,
            D0_GAMES_BET_PLACED_USER: 29,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 39.42,
            D0_GAMES_BET_FLOW: 543.3,
            D0_TOTAL_BET_FLOW: 582.73,

            // 付费 & 投注（D7）
            D7_unique_purchase: 54,
            D7_PURCHASE_VALUE: 289.57,
            D7_TOTAL_BET_PLACED_USER: 56,
            D7_SPORTS_BET_PLACED_USER: 40,
            D7_GAMES_BET_PLACED_USER: 39,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 100.55,
            D7_GAMES_BET_FLOW: 1167.12,
            D7_TOTAL_BET_FLOW: 1267.67,

            // 留存
            D1_retained_users: 38,
            D7_retained_users: 16,
          },

          {
            date: "2025-09-02", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 307,
            D0_unique_purchase: 145,
            D0_PURCHASE_VALUE: 1019.46,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 131,
            D0_SPORTS_BET_PLACED_USER: 62,
            D0_GAMES_BET_PLACED_USER: 99,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 51.93,
            D0_GAMES_BET_FLOW: 4991.94,
            D0_TOTAL_BET_FLOW: 5043.87,

            // 付费 & 投注（D7）
            D7_unique_purchase: 184,
            D7_PURCHASE_VALUE: 5129.96,
            D7_TOTAL_BET_PLACED_USER: 185,
            D7_SPORTS_BET_PLACED_USER: 119,
            D7_GAMES_BET_PLACED_USER: 146,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 238.07,
            D7_GAMES_BET_FLOW: 24524.29,
            D7_TOTAL_BET_FLOW: 24762.36,

            // 留存
            D1_retained_users: 143,
            D7_retained_users: 58,
          },

          {
            date: "2025-09-02", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1045,
            D0_unique_purchase: 262,
            D0_PURCHASE_VALUE: 1071.22,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 249,
            D0_SPORTS_BET_PLACED_USER: 46,
            D0_GAMES_BET_PLACED_USER: 230,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 22.53,
            D0_GAMES_BET_FLOW: 2413.07,
            D0_TOTAL_BET_FLOW: 2435.6,

            // 付费 & 投注（D7）
            D7_unique_purchase: 343,
            D7_PURCHASE_VALUE: 1730.71,
            D7_TOTAL_BET_PLACED_USER: 416,
            D7_SPORTS_BET_PLACED_USER: 198,
            D7_GAMES_BET_PLACED_USER: 299,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 199.73,
            D7_GAMES_BET_FLOW: 6206.09,
            D7_TOTAL_BET_FLOW: 6405.82,

            // 留存
            D1_retained_users: 306,
            D7_retained_users: 62,
          },

          {
            date: "2025-09-02", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1495,
            D0_unique_purchase: 545,
            D0_PURCHASE_VALUE: 2193.78,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 495,
            D0_SPORTS_BET_PLACED_USER: 264,
            D0_GAMES_BET_PLACED_USER: 343,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 1822.87,
            D0_GAMES_BET_FLOW: 4601.32,
            D0_TOTAL_BET_FLOW: 6424.19,

            // 付费 & 投注（D7）
            D7_unique_purchase: 661,
            D7_PURCHASE_VALUE: 6233.58,
            D7_TOTAL_BET_PLACED_USER: 665,
            D7_SPORTS_BET_PLACED_USER: 412,
            D7_GAMES_BET_PLACED_USER: 471,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 7601.56,
            D7_GAMES_BET_FLOW: 10569.32,
            D7_TOTAL_BET_FLOW: 18170.88,

            // 留存
            D1_retained_users: 534,
            D7_retained_users: 143,
          },

          {
            date: "2025-09-02", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 729,
            D0_unique_purchase: 179,
            D0_PURCHASE_VALUE: 210.95,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 170,
            D0_SPORTS_BET_PLACED_USER: 68,
            D0_GAMES_BET_PLACED_USER: 136,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 29.2,
            D0_GAMES_BET_FLOW: 1046.6,
            D0_TOTAL_BET_FLOW: 1075.8,

            // 付费 & 投注（D7）
            D7_unique_purchase: 292,
            D7_PURCHASE_VALUE: 811.38,
            D7_TOTAL_BET_PLACED_USER: 311,
            D7_SPORTS_BET_PLACED_USER: 170,
            D7_GAMES_BET_PLACED_USER: 213,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 106.57,
            D7_GAMES_BET_FLOW: 4036.67,
            D7_TOTAL_BET_FLOW: 4143.24,

            // 留存
            D1_retained_users: 210,
            D7_retained_users: 40,
          },

          {
            date: "2025-09-02", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 95,
            D0_unique_purchase: 44,
            D0_PURCHASE_VALUE: 363.32,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 42,
            D0_SPORTS_BET_PLACED_USER: 20,
            D0_GAMES_BET_PLACED_USER: 27,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 48.98,
            D0_GAMES_BET_FLOW: 1514.56,
            D0_TOTAL_BET_FLOW: 1563.54,

            // 付费 & 投注（D7）
            D7_unique_purchase: 52,
            D7_PURCHASE_VALUE: 843.62,
            D7_TOTAL_BET_PLACED_USER: 52,
            D7_SPORTS_BET_PLACED_USER: 31,
            D7_GAMES_BET_PLACED_USER: 32,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 290.67,
            D7_GAMES_BET_FLOW: 2879.62,
            D7_TOTAL_BET_FLOW: 3170.29,

            // 留存
            D1_retained_users: 33,
            D7_retained_users: 18,
          },

          {
            date: "2025-09-03", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 330,
            D0_unique_purchase: 150,
            D0_PURCHASE_VALUE: 686.77,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 143,
            D0_SPORTS_BET_PLACED_USER: 68,
            D0_GAMES_BET_PLACED_USER: 105,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 46.37,
            D0_GAMES_BET_FLOW: 2167.62,
            D0_TOTAL_BET_FLOW: 2213.99,

            // 付费 & 投注（D7）
            D7_unique_purchase: 181,
            D7_PURCHASE_VALUE: 1722.77,
            D7_TOTAL_BET_PLACED_USER: 185,
            D7_SPORTS_BET_PLACED_USER: 110,
            D7_GAMES_BET_PLACED_USER: 136,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 206.52,
            D7_GAMES_BET_FLOW: 6572.9,
            D7_TOTAL_BET_FLOW: 6779.42,

            // 留存
            D1_retained_users: 151,
            D7_retained_users: 47,
          },

          {
            date: "2025-09-03", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 587,
            D0_unique_purchase: 231,
            D0_PURCHASE_VALUE: 549.44,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 232,
            D0_SPORTS_BET_PLACED_USER: 43,
            D0_GAMES_BET_PLACED_USER: 203,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 26.29,
            D0_GAMES_BET_FLOW: 3637.58,
            D0_TOTAL_BET_FLOW: 3663.87,

            // 付费 & 投注（D7）
            D7_unique_purchase: 296,
            D7_PURCHASE_VALUE: 1433.4,
            D7_TOTAL_BET_PLACED_USER: 316,
            D7_SPORTS_BET_PLACED_USER: 89,
            D7_GAMES_BET_PLACED_USER: 282,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 78.01,
            D7_GAMES_BET_FLOW: 8935.2,
            D7_TOTAL_BET_FLOW: 9013.21,

            // 留存
            D1_retained_users: 224,
            D7_retained_users: 69,
          },

          {
            date: "2025-09-03", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1392,
            D0_unique_purchase: 444,
            D0_PURCHASE_VALUE: 869.44,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 427,
            D0_SPORTS_BET_PLACED_USER: 239,
            D0_GAMES_BET_PLACED_USER: 286,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 157.75,
            D0_GAMES_BET_FLOW: 2106.67,
            D0_TOTAL_BET_FLOW: 2264.42,

            // 付费 & 投注（D7）
            D7_unique_purchase: 572,
            D7_PURCHASE_VALUE: 3872.53,
            D7_TOTAL_BET_PLACED_USER: 578,
            D7_SPORTS_BET_PLACED_USER: 361,
            D7_GAMES_BET_PLACED_USER: 398,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1502.4,
            D7_GAMES_BET_FLOW: 14967.31,
            D7_TOTAL_BET_FLOW: 16469.71,

            // 留存
            D1_retained_users: 514,
            D7_retained_users: 119,
          },

          {
            date: "2025-09-03", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 505,
            D0_unique_purchase: 182,
            D0_PURCHASE_VALUE: 267.88,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 169,
            D0_SPORTS_BET_PLACED_USER: 63,
            D0_GAMES_BET_PLACED_USER: 132,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 35.64,
            D0_GAMES_BET_FLOW: 1056.85,
            D0_TOTAL_BET_FLOW: 1092.49,

            // 付费 & 投注（D7）
            D7_unique_purchase: 246,
            D7_PURCHASE_VALUE: 1453.33,
            D7_TOTAL_BET_PLACED_USER: 251,
            D7_SPORTS_BET_PLACED_USER: 135,
            D7_GAMES_BET_PLACED_USER: 181,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 133.52,
            D7_GAMES_BET_FLOW: 14727.47,
            D7_TOTAL_BET_FLOW: 14860.99,

            // 留存
            D1_retained_users: 185,
            D7_retained_users: 51,
          },

          {
            date: "2025-09-03", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 170,
            D0_unique_purchase: 41,
            D0_PURCHASE_VALUE: 73.2,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 40,
            D0_SPORTS_BET_PLACED_USER: 24,
            D0_GAMES_BET_PLACED_USER: 21,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 36.18,
            D0_GAMES_BET_FLOW: 265.44,
            D0_TOTAL_BET_FLOW: 301.62,

            // 付费 & 投注（D7）
            D7_unique_purchase: 52,
            D7_PURCHASE_VALUE: 386.21,
            D7_TOTAL_BET_PLACED_USER: 53,
            D7_SPORTS_BET_PLACED_USER: 34,
            D7_GAMES_BET_PLACED_USER: 29,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 190.41,
            D7_GAMES_BET_FLOW: 1532.62,
            D7_TOTAL_BET_FLOW: 1723.03,

            // 留存
            D1_retained_users: 39,
            D7_retained_users: 14,
          },

          {
            date: "2025-09-04", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 355,
            D0_unique_purchase: 180,
            D0_PURCHASE_VALUE: 1038.54,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 155,
            D0_SPORTS_BET_PLACED_USER: 85,
            D0_GAMES_BET_PLACED_USER: 96,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 82.93,
            D0_GAMES_BET_FLOW: 5539.53,
            D0_TOTAL_BET_FLOW: 5622.46,

            // 付费 & 投注（D7）
            D7_unique_purchase: 218,
            D7_PURCHASE_VALUE: 1854.77,
            D7_TOTAL_BET_PLACED_USER: 217,
            D7_SPORTS_BET_PLACED_USER: 136,
            D7_GAMES_BET_PLACED_USER: 140,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 257.34,
            D7_GAMES_BET_FLOW: 8897.55,
            D7_TOTAL_BET_FLOW: 9154.89,

            // 留存
            D1_retained_users: 169,
            D7_retained_users: 52,
          },

          {
            date: "2025-09-04", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 691,
            D0_unique_purchase: 233,
            D0_PURCHASE_VALUE: 461.8,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 248,
            D0_SPORTS_BET_PLACED_USER: 62,
            D0_GAMES_BET_PLACED_USER: 212,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 24.44,
            D0_GAMES_BET_FLOW: 2599.7,
            D0_TOTAL_BET_FLOW: 2624.14,

            // 付费 & 投注（D7）
            D7_unique_purchase: 308,
            D7_PURCHASE_VALUE: 1560.67,
            D7_TOTAL_BET_PLACED_USER: 344,
            D7_SPORTS_BET_PLACED_USER: 127,
            D7_GAMES_BET_PLACED_USER: 289,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 213.2,
            D7_GAMES_BET_FLOW: 8851.4,
            D7_TOTAL_BET_FLOW: 9064.6,

            // 留存
            D1_retained_users: 233,
            D7_retained_users: 63,
          },

          {
            date: "2025-09-04", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1594,
            D0_unique_purchase: 559,
            D0_PURCHASE_VALUE: 2361.41,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 518,
            D0_SPORTS_BET_PLACED_USER: 304,
            D0_GAMES_BET_PLACED_USER: 351,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 179.5,
            D0_GAMES_BET_FLOW: 2606.47,
            D0_TOTAL_BET_FLOW: 2785.97,

            // 付费 & 投注（D7）
            D7_unique_purchase: 694,
            D7_PURCHASE_VALUE: 5068.62,
            D7_TOTAL_BET_PLACED_USER: 692,
            D7_SPORTS_BET_PLACED_USER: 458,
            D7_GAMES_BET_PLACED_USER: 474,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1414.32,
            D7_GAMES_BET_FLOW: 18563.85,
            D7_TOTAL_BET_FLOW: 19978.17,

            // 留存
            D1_retained_users: 538,
            D7_retained_users: 146,
          },

          {
            date: "2025-09-04", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 477,
            D0_unique_purchase: 173,
            D0_PURCHASE_VALUE: 408.51,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 174,
            D0_SPORTS_BET_PLACED_USER: 62,
            D0_GAMES_BET_PLACED_USER: 133,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 32.5,
            D0_GAMES_BET_FLOW: 2113.82,
            D0_TOTAL_BET_FLOW: 2146.32,

            // 付费 & 投注（D7）
            D7_unique_purchase: 218,
            D7_PURCHASE_VALUE: 2984.46,
            D7_TOTAL_BET_PLACED_USER: 222,
            D7_SPORTS_BET_PLACED_USER: 100,
            D7_GAMES_BET_PLACED_USER: 168,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 100.57,
            D7_GAMES_BET_FLOW: 9989.85,
            D7_TOTAL_BET_FLOW: 10090.43,

            // 留存
            D1_retained_users: 168,
            D7_retained_users: 44,
          },

          {
            date: "2025-09-04", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 107,
            D0_unique_purchase: 36,
            D0_PURCHASE_VALUE: 94.28,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 38,
            D0_SPORTS_BET_PLACED_USER: 23,
            D0_GAMES_BET_PLACED_USER: 20,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 31.44,
            D0_GAMES_BET_FLOW: 322.88,
            D0_TOTAL_BET_FLOW: 354.32,

            // 付费 & 投注（D7）
            D7_unique_purchase: 46,
            D7_PURCHASE_VALUE: 369.58,
            D7_TOTAL_BET_PLACED_USER: 49,
            D7_SPORTS_BET_PLACED_USER: 37,
            D7_GAMES_BET_PLACED_USER: 27,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 372.76,
            D7_GAMES_BET_FLOW: 1139.9,
            D7_TOTAL_BET_FLOW: 1512.66,

            // 留存
            D1_retained_users: 36,
            D7_retained_users: 14,
          },

          {
            date: "2025-09-05", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 333,
            D0_unique_purchase: 162,
            D0_PURCHASE_VALUE: 455.31,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 154,
            D0_SPORTS_BET_PLACED_USER: 82,
            D0_GAMES_BET_PLACED_USER: 102,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 69.62,
            D0_GAMES_BET_FLOW: 2465.23,
            D0_TOTAL_BET_FLOW: 2534.85,

            // 付费 & 投注（D7）
            D7_unique_purchase: 193,
            D7_PURCHASE_VALUE: 3045.0,
            D7_TOTAL_BET_PLACED_USER: 196,
            D7_SPORTS_BET_PLACED_USER: 124,
            D7_GAMES_BET_PLACED_USER: 144,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 584.3,
            D7_GAMES_BET_FLOW: 15304.37,
            D7_TOTAL_BET_FLOW: 15888.66,

            // 留存
            D1_retained_users: 157,
            D7_retained_users: 54,
          },

          {
            date: "2025-09-05", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 637,
            D0_unique_purchase: 278,
            D0_PURCHASE_VALUE: 650.94,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 271,
            D0_SPORTS_BET_PLACED_USER: 69,
            D0_GAMES_BET_PLACED_USER: 242,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 317.36,
            D0_GAMES_BET_FLOW: 1515.81,
            D0_TOTAL_BET_FLOW: 1833.17,

            // 付费 & 投注（D7）
            D7_unique_purchase: 341,
            D7_PURCHASE_VALUE: 1607.8,
            D7_TOTAL_BET_PLACED_USER: 351,
            D7_SPORTS_BET_PLACED_USER: 121,
            D7_GAMES_BET_PLACED_USER: 311,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1377.2,
            D7_GAMES_BET_FLOW: 3809.71,
            D7_TOTAL_BET_FLOW: 5186.91,

            // 留存
            D1_retained_users: 261,
            D7_retained_users: 71,
          },

          {
            date: "2025-09-05", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1726,
            D0_unique_purchase: 598,
            D0_PURCHASE_VALUE: 1256.99,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 545,
            D0_SPORTS_BET_PLACED_USER: 310,
            D0_GAMES_BET_PLACED_USER: 354,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 1656.88,
            D0_GAMES_BET_FLOW: 2695.82,
            D0_TOTAL_BET_FLOW: 4352.7,

            // 付费 & 投注（D7）
            D7_unique_purchase: 744,
            D7_PURCHASE_VALUE: 3423.04,
            D7_TOTAL_BET_PLACED_USER: 739,
            D7_SPORTS_BET_PLACED_USER: 469,
            D7_GAMES_BET_PLACED_USER: 495,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 3183.89,
            D7_GAMES_BET_FLOW: 12843.45,
            D7_TOTAL_BET_FLOW: 16027.34,

            // 留存
            D1_retained_users: 597,
            D7_retained_users: 181,
          },

          {
            date: "2025-09-05", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 626,
            D0_unique_purchase: 220,
            D0_PURCHASE_VALUE: 418.18,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 211,
            D0_SPORTS_BET_PLACED_USER: 81,
            D0_GAMES_BET_PLACED_USER: 166,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 46.49,
            D0_GAMES_BET_FLOW: 31156.15,
            D0_TOTAL_BET_FLOW: 31202.64,

            // 付费 & 投注（D7）
            D7_unique_purchase: 263,
            D7_PURCHASE_VALUE: 754.62,
            D7_TOTAL_BET_PLACED_USER: 267,
            D7_SPORTS_BET_PLACED_USER: 123,
            D7_GAMES_BET_PLACED_USER: 208,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 143.63,
            D7_GAMES_BET_FLOW: 33574.87,
            D7_TOTAL_BET_FLOW: 33718.5,

            // 留存
            D1_retained_users: 192,
            D7_retained_users: 59,
          },

          {
            date: "2025-09-05", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 120,
            D0_unique_purchase: 52,
            D0_PURCHASE_VALUE: 168.11,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 51,
            D0_SPORTS_BET_PLACED_USER: 36,
            D0_GAMES_BET_PLACED_USER: 24,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 55.74,
            D0_GAMES_BET_FLOW: 224.85,
            D0_TOTAL_BET_FLOW: 280.59,

            // 付费 & 投注（D7）
            D7_unique_purchase: 62,
            D7_PURCHASE_VALUE: 492.01,
            D7_TOTAL_BET_PLACED_USER: 63,
            D7_SPORTS_BET_PLACED_USER: 48,
            D7_GAMES_BET_PLACED_USER: 37,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 177.04,
            D7_GAMES_BET_FLOW: 1597.15,
            D7_TOTAL_BET_FLOW: 1774.19,

            // 留存
            D1_retained_users: 46,
            D7_retained_users: 15,
          },

          {
            date: "2025-09-06", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 302,
            D0_unique_purchase: 142,
            D0_PURCHASE_VALUE: 1403.38,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 130,
            D0_SPORTS_BET_PLACED_USER: 67,
            D0_GAMES_BET_PLACED_USER: 97,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 38.65,
            D0_GAMES_BET_FLOW: 8323.89,
            D0_TOTAL_BET_FLOW: 8362.55,

            // 付费 & 投注（D7）
            D7_unique_purchase: 166,
            D7_PURCHASE_VALUE: 7302.46,
            D7_TOTAL_BET_PLACED_USER: 168,
            D7_SPORTS_BET_PLACED_USER: 103,
            D7_GAMES_BET_PLACED_USER: 130,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 193.32,
            D7_GAMES_BET_FLOW: 54499.61,
            D7_TOTAL_BET_FLOW: 54692.94,

            // 留存
            D1_retained_users: 131,
            D7_retained_users: 64,
          },

          {
            date: "2025-09-06", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 651,
            D0_unique_purchase: 280,
            D0_PURCHASE_VALUE: 563.64,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 283,
            D0_SPORTS_BET_PLACED_USER: 54,
            D0_GAMES_BET_PLACED_USER: 252,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 20.64,
            D0_GAMES_BET_FLOW: 4344.03,
            D0_TOTAL_BET_FLOW: 4364.67,

            // 付费 & 投注（D7）
            D7_unique_purchase: 350,
            D7_PURCHASE_VALUE: 1426.59,
            D7_TOTAL_BET_PLACED_USER: 369,
            D7_SPORTS_BET_PLACED_USER: 116,
            D7_GAMES_BET_PLACED_USER: 330,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 67.37,
            D7_GAMES_BET_FLOW: 11053.61,
            D7_TOTAL_BET_FLOW: 11120.98,

            // 留存
            D1_retained_users: 246,
            D7_retained_users: 94,
          },

          {
            date: "2025-09-06", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1669,
            D0_unique_purchase: 550,
            D0_PURCHASE_VALUE: 1052.93,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 501,
            D0_SPORTS_BET_PLACED_USER: 290,
            D0_GAMES_BET_PLACED_USER: 304,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 610.15,
            D0_GAMES_BET_FLOW: 3607.96,
            D0_TOTAL_BET_FLOW: 4218.11,

            // 付费 & 投注（D7）
            D7_unique_purchase: 714,
            D7_PURCHASE_VALUE: 3687.16,
            D7_TOTAL_BET_PLACED_USER: 720,
            D7_SPORTS_BET_PLACED_USER: 470,
            D7_GAMES_BET_PLACED_USER: 478,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2218.4,
            D7_GAMES_BET_FLOW: 13346.99,
            D7_TOTAL_BET_FLOW: 15565.39,

            // 留存
            D1_retained_users: 589,
            D7_retained_users: 191,
          },

          {
            date: "2025-09-06", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 615,
            D0_unique_purchase: 207,
            D0_PURCHASE_VALUE: 305.54,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 190,
            D0_SPORTS_BET_PLACED_USER: 81,
            D0_GAMES_BET_PLACED_USER: 144,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 33.89,
            D0_GAMES_BET_FLOW: 1532.35,
            D0_TOTAL_BET_FLOW: 1566.24,

            // 付费 & 投注（D7）
            D7_unique_purchase: 283,
            D7_PURCHASE_VALUE: 1059.37,
            D7_TOTAL_BET_PLACED_USER: 288,
            D7_SPORTS_BET_PLACED_USER: 150,
            D7_GAMES_BET_PLACED_USER: 208,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 188.25,
            D7_GAMES_BET_FLOW: 5319.61,
            D7_TOTAL_BET_FLOW: 5507.86,

            // 留存
            D1_retained_users: 234,
            D7_retained_users: 90,
          },

          {
            date: "2025-09-06", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 130,
            D0_unique_purchase: 50,
            D0_PURCHASE_VALUE: 157.63,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 53,
            D0_SPORTS_BET_PLACED_USER: 39,
            D0_GAMES_BET_PLACED_USER: 23,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 103.44,
            D0_GAMES_BET_FLOW: 287.53,
            D0_TOTAL_BET_FLOW: 390.96,

            // 付费 & 投注（D7）
            D7_unique_purchase: 56,
            D7_PURCHASE_VALUE: 406.86,
            D7_TOTAL_BET_PLACED_USER: 65,
            D7_SPORTS_BET_PLACED_USER: 54,
            D7_GAMES_BET_PLACED_USER: 32,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 274.85,
            D7_GAMES_BET_FLOW: 987.79,
            D7_TOTAL_BET_FLOW: 1262.64,

            // 留存
            D1_retained_users: 51,
            D7_retained_users: 25,
          },

          {
            date: "2025-09-07", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 554,
            D0_unique_purchase: 297,
            D0_PURCHASE_VALUE: 1793.54,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 287,
            D0_SPORTS_BET_PLACED_USER: 212,
            D0_GAMES_BET_PLACED_USER: 105,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 8957.44,
            D0_GAMES_BET_FLOW: 2830.34,
            D0_TOTAL_BET_FLOW: 11787.78,

            // 付费 & 投注（D7）
            D7_unique_purchase: 398,
            D7_PURCHASE_VALUE: 3137.38,
            D7_TOTAL_BET_PLACED_USER: 403,
            D7_SPORTS_BET_PLACED_USER: 324,
            D7_GAMES_BET_PLACED_USER: 174,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 26268.65,
            D7_GAMES_BET_FLOW: 8949.45,
            D7_TOTAL_BET_FLOW: 35218.1,

            // 留存
            D1_retained_users: 230,
            D7_retained_users: 50,
          },

          {
            date: "2025-09-07", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 870,
            D0_unique_purchase: 286,
            D0_PURCHASE_VALUE: 530.74,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 302,
            D0_SPORTS_BET_PLACED_USER: 100,
            D0_GAMES_BET_PLACED_USER: 237,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 88.85,
            D0_GAMES_BET_FLOW: 2074.55,
            D0_TOTAL_BET_FLOW: 2163.4,

            // 付费 & 投注（D7）
            D7_unique_purchase: 338,
            D7_PURCHASE_VALUE: 1199.14,
            D7_TOTAL_BET_PLACED_USER: 396,
            D7_SPORTS_BET_PLACED_USER: 178,
            D7_GAMES_BET_PLACED_USER: 298,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 194.58,
            D7_GAMES_BET_FLOW: 4872.04,
            D7_TOTAL_BET_FLOW: 5066.62,

            // 留存
            D1_retained_users: 267,
            D7_retained_users: 113,
          },

          {
            date: "2025-09-07", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1591,
            D0_unique_purchase: 503,
            D0_PURCHASE_VALUE: 3052.31,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 482,
            D0_SPORTS_BET_PLACED_USER: 280,
            D0_GAMES_BET_PLACED_USER: 314,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 388.94,
            D0_GAMES_BET_FLOW: 15402.92,
            D0_TOTAL_BET_FLOW: 15791.86,

            // 付费 & 投注（D7）
            D7_unique_purchase: 661,
            D7_PURCHASE_VALUE: 4977.33,
            D7_TOTAL_BET_PLACED_USER: 677,
            D7_SPORTS_BET_PLACED_USER: 434,
            D7_GAMES_BET_PLACED_USER: 459,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1617.81,
            D7_GAMES_BET_FLOW: 24184.23,
            D7_TOTAL_BET_FLOW: 25802.04,

            // 留存
            D1_retained_users: 584,
            D7_retained_users: 177,
          },

          {
            date: "2025-09-07", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1181,
            D0_unique_purchase: 197,
            D0_PURCHASE_VALUE: 415.67,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 248,
            D0_SPORTS_BET_PLACED_USER: 123,
            D0_GAMES_BET_PLACED_USER: 157,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 50.91,
            D0_GAMES_BET_FLOW: 2108.18,
            D0_TOTAL_BET_FLOW: 2159.08,

            // 付费 & 投注（D7）
            D7_unique_purchase: 361,
            D7_PURCHASE_VALUE: 1121.19,
            D7_TOTAL_BET_PLACED_USER: 391,
            D7_SPORTS_BET_PLACED_USER: 243,
            D7_GAMES_BET_PLACED_USER: 226,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 218.39,
            D7_GAMES_BET_FLOW: 5082.48,
            D7_TOTAL_BET_FLOW: 5300.87,

            // 留存
            D1_retained_users: 219,
            D7_retained_users: 89,
          },

          {
            date: "2025-09-07", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 112,
            D0_unique_purchase: 49,
            D0_PURCHASE_VALUE: 275.14,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 53,
            D0_SPORTS_BET_PLACED_USER: 32,
            D0_GAMES_BET_PLACED_USER: 30,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 40.57,
            D0_GAMES_BET_FLOW: 1286.44,
            D0_TOTAL_BET_FLOW: 1327.0,

            // 付费 & 投注（D7）
            D7_unique_purchase: 64,
            D7_PURCHASE_VALUE: 679.97,
            D7_TOTAL_BET_PLACED_USER: 70,
            D7_SPORTS_BET_PLACED_USER: 47,
            D7_GAMES_BET_PLACED_USER: 41,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 147.9,
            D7_GAMES_BET_FLOW: 3820.54,
            D7_TOTAL_BET_FLOW: 3968.45,

            // 留存
            D1_retained_users: 50,
            D7_retained_users: 23,
          },

          {
            date: "2025-09-08", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 528,
            D0_unique_purchase: 275,
            D0_PURCHASE_VALUE: 768.77,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 267,
            D0_SPORTS_BET_PLACED_USER: 207,
            D0_GAMES_BET_PLACED_USER: 97,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 187.82,
            D0_GAMES_BET_FLOW: 8614.43,
            D0_TOTAL_BET_FLOW: 8802.26,

            // 付费 & 投注（D7）
            D7_unique_purchase: 368,
            D7_PURCHASE_VALUE: 1806.46,
            D7_TOTAL_BET_PLACED_USER: 371,
            D7_SPORTS_BET_PLACED_USER: 305,
            D7_GAMES_BET_PLACED_USER: 150,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 806.97,
            D7_GAMES_BET_FLOW: 11156.48,
            D7_TOTAL_BET_FLOW: 11963.44,

            // 留存
            D1_retained_users: 259,
            D7_retained_users: 50,
          },

          {
            date: "2025-09-08", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 906,
            D0_unique_purchase: 223,
            D0_PURCHASE_VALUE: 459.99,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 236,
            D0_SPORTS_BET_PLACED_USER: 79,
            D0_GAMES_BET_PLACED_USER: 185,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 31.06,
            D0_GAMES_BET_FLOW: 1988.23,
            D0_TOTAL_BET_FLOW: 2019.29,

            // 付费 & 投注（D7）
            D7_unique_purchase: 310,
            D7_PURCHASE_VALUE: 931.15,
            D7_TOTAL_BET_PLACED_USER: 432,
            D7_SPORTS_BET_PLACED_USER: 246,
            D7_GAMES_BET_PLACED_USER: 256,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 135.83,
            D7_GAMES_BET_FLOW: 4286.41,
            D7_TOTAL_BET_FLOW: 4422.24,

            // 留存
            D1_retained_users: 319,
            D7_retained_users: 60,
          },

          {
            date: "2025-09-08", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1594,
            D0_unique_purchase: 615,
            D0_PURCHASE_VALUE: 840.67,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 564,
            D0_SPORTS_BET_PLACED_USER: 364,
            D0_GAMES_BET_PLACED_USER: 332,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 416.68,
            D0_GAMES_BET_FLOW: 1866.04,
            D0_TOTAL_BET_FLOW: 2282.72,

            // 付费 & 投注（D7）
            D7_unique_purchase: 754,
            D7_PURCHASE_VALUE: 5550.19,
            D7_TOTAL_BET_PLACED_USER: 748,
            D7_SPORTS_BET_PLACED_USER: 504,
            D7_GAMES_BET_PLACED_USER: 480,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1380.6,
            D7_GAMES_BET_FLOW: 55682.13,
            D7_TOTAL_BET_FLOW: 57062.72,

            // 留存
            D1_retained_users: 603,
            D7_retained_users: 161,
          },

          {
            date: "2025-09-08", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 727,
            D0_unique_purchase: 203,
            D0_PURCHASE_VALUE: 416.92,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 278,
            D0_SPORTS_BET_PLACED_USER: 160,
            D0_GAMES_BET_PLACED_USER: 143,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 44.64,
            D0_GAMES_BET_FLOW: 1862.7,
            D0_TOTAL_BET_FLOW: 1907.34,

            // 付费 & 投注（D7）
            D7_unique_purchase: 329,
            D7_PURCHASE_VALUE: 1356.58,
            D7_TOTAL_BET_PLACED_USER: 346,
            D7_SPORTS_BET_PLACED_USER: 212,
            D7_GAMES_BET_PLACED_USER: 222,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 148.82,
            D7_GAMES_BET_FLOW: 7479.49,
            D7_TOTAL_BET_FLOW: 7628.31,

            // 留存
            D1_retained_users: 199,
            D7_retained_users: 58,
          },

          {
            date: "2025-09-08", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 124,
            D0_unique_purchase: 52,
            D0_PURCHASE_VALUE: 153.68,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 53,
            D0_SPORTS_BET_PLACED_USER: 42,
            D0_GAMES_BET_PLACED_USER: 22,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 68.62,
            D0_GAMES_BET_FLOW: 1103.71,
            D0_TOTAL_BET_FLOW: 1172.33,

            // 付费 & 投注（D7）
            D7_unique_purchase: 66,
            D7_PURCHASE_VALUE: 368.57,
            D7_TOTAL_BET_PLACED_USER: 72,
            D7_SPORTS_BET_PLACED_USER: 59,
            D7_GAMES_BET_PLACED_USER: 35,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 203.1,
            D7_GAMES_BET_FLOW: 1613.2,
            D7_TOTAL_BET_FLOW: 1816.3,

            // 留存
            D1_retained_users: 53,
            D7_retained_users: 18,
          },

          {
            date: "2025-09-09", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 333,
            D0_unique_purchase: 152,
            D0_PURCHASE_VALUE: 1137.23,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 147,
            D0_SPORTS_BET_PLACED_USER: 93,
            D0_GAMES_BET_PLACED_USER: 91,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 92.87,
            D0_GAMES_BET_FLOW: 6837.69,
            D0_TOTAL_BET_FLOW: 6930.56,

            // 付费 & 投注（D7）
            D7_unique_purchase: 182,
            D7_PURCHASE_VALUE: 3180.54,
            D7_TOTAL_BET_PLACED_USER: 186,
            D7_SPORTS_BET_PLACED_USER: 135,
            D7_GAMES_BET_PLACED_USER: 121,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 233.28,
            D7_GAMES_BET_FLOW: 18882.53,
            D7_TOTAL_BET_FLOW: 19115.81,

            // 留存
            D1_retained_users: 150,
            D7_retained_users: 59,
          },

          {
            date: "2025-09-09", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 951,
            D0_unique_purchase: 238,
            D0_PURCHASE_VALUE: 250.07,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 244,
            D0_SPORTS_BET_PLACED_USER: 71,
            D0_GAMES_BET_PLACED_USER: 208,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 34.91,
            D0_GAMES_BET_FLOW: 1298.15,
            D0_TOTAL_BET_FLOW: 1333.06,

            // 付费 & 投注（D7）
            D7_unique_purchase: 300,
            D7_PURCHASE_VALUE: 735.24,
            D7_TOTAL_BET_PLACED_USER: 358,
            D7_SPORTS_BET_PLACED_USER: 157,
            D7_GAMES_BET_PLACED_USER: 285,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 242.98,
            D7_GAMES_BET_FLOW: 4532.46,
            D7_TOTAL_BET_FLOW: 4775.44,

            // 留存
            D1_retained_users: 308,
            D7_retained_users: 182,
          },

          {
            date: "2025-09-09", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1602,
            D0_unique_purchase: 593,
            D0_PURCHASE_VALUE: 1119.12,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 531,
            D0_SPORTS_BET_PLACED_USER: 311,
            D0_GAMES_BET_PLACED_USER: 338,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 192.68,
            D0_GAMES_BET_FLOW: 4065.0,
            D0_TOTAL_BET_FLOW: 4257.68,

            // 付费 & 投注（D7）
            D7_unique_purchase: 745,
            D7_PURCHASE_VALUE: 3984.14,
            D7_TOTAL_BET_PLACED_USER: 743,
            D7_SPORTS_BET_PLACED_USER: 486,
            D7_GAMES_BET_PLACED_USER: 490,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2042.38,
            D7_GAMES_BET_FLOW: 24164.02,
            D7_TOTAL_BET_FLOW: 26206.4,

            // 留存
            D1_retained_users: 584,
            D7_retained_users: 173,
          },

          {
            date: "2025-09-09", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 763,
            D0_unique_purchase: 222,
            D0_PURCHASE_VALUE: 338.33,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 231,
            D0_SPORTS_BET_PLACED_USER: 112,
            D0_GAMES_BET_PLACED_USER: 177,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 47.88,
            D0_GAMES_BET_FLOW: 1494.85,
            D0_TOTAL_BET_FLOW: 1542.73,

            // 付费 & 投注（D7）
            D7_unique_purchase: 322,
            D7_PURCHASE_VALUE: 1460.19,
            D7_TOTAL_BET_PLACED_USER: 340,
            D7_SPORTS_BET_PLACED_USER: 184,
            D7_GAMES_BET_PLACED_USER: 259,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1193.92,
            D7_GAMES_BET_FLOW: 4057.18,
            D7_TOTAL_BET_FLOW: 5251.1,

            // 留存
            D1_retained_users: 246,
            D7_retained_users: 74,
          },

          {
            date: "2025-09-09", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 130,
            D0_unique_purchase: 49,
            D0_PURCHASE_VALUE: 91.54,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 48,
            D0_SPORTS_BET_PLACED_USER: 33,
            D0_GAMES_BET_PLACED_USER: 23,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 18.57,
            D0_GAMES_BET_FLOW: 360.21,
            D0_TOTAL_BET_FLOW: 378.78,

            // 付费 & 投注（D7）
            D7_unique_purchase: 63,
            D7_PURCHASE_VALUE: 317.13,
            D7_TOTAL_BET_PLACED_USER: 71,
            D7_SPORTS_BET_PLACED_USER: 53,
            D7_GAMES_BET_PLACED_USER: 38,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 130.97,
            D7_GAMES_BET_FLOW: 1049.29,
            D7_TOTAL_BET_FLOW: 1180.26,

            // 留存
            D1_retained_users: 45,
            D7_retained_users: 18,
          },

          {
            date: "2025-09-10", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 405,
            D0_unique_purchase: 215,
            D0_PURCHASE_VALUE: 785.62,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 190,
            D0_SPORTS_BET_PLACED_USER: 117,
            D0_GAMES_BET_PLACED_USER: 105,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 80.4,
            D0_GAMES_BET_FLOW: 2532.06,
            D0_TOTAL_BET_FLOW: 2612.47,

            // 付费 & 投注（D7）
            D7_unique_purchase: 256,
            D7_PURCHASE_VALUE: 2057.77,
            D7_TOTAL_BET_PLACED_USER: 261,
            D7_SPORTS_BET_PLACED_USER: 188,
            D7_GAMES_BET_PLACED_USER: 160,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 356.13,
            D7_GAMES_BET_FLOW: 7455.12,
            D7_TOTAL_BET_FLOW: 7811.24,

            // 留存
            D1_retained_users: 190,
            D7_retained_users: 53,
          },

          {
            date: "2025-09-10", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 840,
            D0_unique_purchase: 263,
            D0_PURCHASE_VALUE: 631.71,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 275,
            D0_SPORTS_BET_PLACED_USER: 69,
            D0_GAMES_BET_PLACED_USER: 236,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 45.47,
            D0_GAMES_BET_FLOW: 2310.31,
            D0_TOTAL_BET_FLOW: 2355.78,

            // 付费 & 投注（D7）
            D7_unique_purchase: 350,
            D7_PURCHASE_VALUE: 1155.1,
            D7_TOTAL_BET_PLACED_USER: 408,
            D7_SPORTS_BET_PLACED_USER: 187,
            D7_GAMES_BET_PLACED_USER: 306,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 129.75,
            D7_GAMES_BET_FLOW: 5816.35,
            D7_TOTAL_BET_FLOW: 5946.1,

            // 留存
            D1_retained_users: 261,
            D7_retained_users: 76,
          },

          {
            date: "2025-09-10", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1439,
            D0_unique_purchase: 548,
            D0_PURCHASE_VALUE: 740.06,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 493,
            D0_SPORTS_BET_PLACED_USER: 299,
            D0_GAMES_BET_PLACED_USER: 306,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 204.27,
            D0_GAMES_BET_FLOW: 3122.93,
            D0_TOTAL_BET_FLOW: 3327.21,

            // 付费 & 投注（D7）
            D7_unique_purchase: 671,
            D7_PURCHASE_VALUE: 3256.07,
            D7_TOTAL_BET_PLACED_USER: 655,
            D7_SPORTS_BET_PLACED_USER: 434,
            D7_GAMES_BET_PLACED_USER: 425,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 825.14,
            D7_GAMES_BET_FLOW: 21903.62,
            D7_TOTAL_BET_FLOW: 22728.76,

            // 留存
            D1_retained_users: 508,
            D7_retained_users: 166,
          },

          {
            date: "2025-09-10", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 519,
            D0_unique_purchase: 164,
            D0_PURCHASE_VALUE: 283.05,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 158,
            D0_SPORTS_BET_PLACED_USER: 59,
            D0_GAMES_BET_PLACED_USER: 127,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 33.1,
            D0_GAMES_BET_FLOW: 1421.86,
            D0_TOTAL_BET_FLOW: 1454.97,

            // 付费 & 投注（D7）
            D7_unique_purchase: 207,
            D7_PURCHASE_VALUE: 1052.66,
            D7_TOTAL_BET_PLACED_USER: 215,
            D7_SPORTS_BET_PLACED_USER: 110,
            D7_GAMES_BET_PLACED_USER: 168,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 200.93,
            D7_GAMES_BET_FLOW: 5597.48,
            D7_TOTAL_BET_FLOW: 5798.41,

            // 留存
            D1_retained_users: 158,
            D7_retained_users: 62,
          },

          {
            date: "2025-09-10", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 147,
            D0_unique_purchase: 39,
            D0_PURCHASE_VALUE: 153.11,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 37,
            D0_SPORTS_BET_PLACED_USER: 28,
            D0_GAMES_BET_PLACED_USER: 19,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 95.24,
            D0_GAMES_BET_FLOW: 351.02,
            D0_TOTAL_BET_FLOW: 446.26,

            // 付费 & 投注（D7）
            D7_unique_purchase: 50,
            D7_PURCHASE_VALUE: 480.48,
            D7_TOTAL_BET_PLACED_USER: 56,
            D7_SPORTS_BET_PLACED_USER: 47,
            D7_GAMES_BET_PLACED_USER: 28,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 205.01,
            D7_GAMES_BET_FLOW: 2034.93,
            D7_TOTAL_BET_FLOW: 2239.93,

            // 留存
            D1_retained_users: 39,
            D7_retained_users: 15,
          },

          {
            date: "2025-09-11", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 373,
            D0_unique_purchase: 202,
            D0_PURCHASE_VALUE: 797.0,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 190,
            D0_SPORTS_BET_PLACED_USER: 117,
            D0_GAMES_BET_PLACED_USER: 94,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 67.77,
            D0_GAMES_BET_FLOW: 5053.69,
            D0_TOTAL_BET_FLOW: 5121.46,

            // 付费 & 投注（D7）
            D7_unique_purchase: 244,
            D7_PURCHASE_VALUE: 4931.92,
            D7_TOTAL_BET_PLACED_USER: 242,
            D7_SPORTS_BET_PLACED_USER: 174,
            D7_GAMES_BET_PLACED_USER: 141,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 585.57,
            D7_GAMES_BET_FLOW: 27011.67,
            D7_TOTAL_BET_FLOW: 27597.24,

            // 留存
            D1_retained_users: 162,
            D7_retained_users: 56,
          },

          {
            date: "2025-09-11", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 808,
            D0_unique_purchase: 248,
            D0_PURCHASE_VALUE: 873.19,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 235,
            D0_SPORTS_BET_PLACED_USER: 63,
            D0_GAMES_BET_PLACED_USER: 200,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 29.81,
            D0_GAMES_BET_FLOW: 22131.82,
            D0_TOTAL_BET_FLOW: 22161.63,

            // 付费 & 投注（D7）
            D7_unique_purchase: 317,
            D7_PURCHASE_VALUE: 2015.27,
            D7_TOTAL_BET_PLACED_USER: 348,
            D7_SPORTS_BET_PLACED_USER: 154,
            D7_GAMES_BET_PLACED_USER: 272,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 189.8,
            D7_GAMES_BET_FLOW: 35796.46,
            D7_TOTAL_BET_FLOW: 35986.25,

            // 留存
            D1_retained_users: 257,
            D7_retained_users: 70,
          },

          {
            date: "2025-09-11", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1600,
            D0_unique_purchase: 581,
            D0_PURCHASE_VALUE: 1451.72,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 517,
            D0_SPORTS_BET_PLACED_USER: 294,
            D0_GAMES_BET_PLACED_USER: 327,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 348.67,
            D0_GAMES_BET_FLOW: 2494.96,
            D0_TOTAL_BET_FLOW: 2843.63,

            // 付费 & 投注（D7）
            D7_unique_purchase: 742,
            D7_PURCHASE_VALUE: 4492.19,
            D7_TOTAL_BET_PLACED_USER: 731,
            D7_SPORTS_BET_PLACED_USER: 472,
            D7_GAMES_BET_PLACED_USER: 473,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 4276.09,
            D7_GAMES_BET_FLOW: 13842.39,
            D7_TOTAL_BET_FLOW: 18118.48,

            // 留存
            D1_retained_users: 607,
            D7_retained_users: 168,
          },

          {
            date: "2025-09-11", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 587,
            D0_unique_purchase: 181,
            D0_PURCHASE_VALUE: 433.91,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 169,
            D0_SPORTS_BET_PLACED_USER: 61,
            D0_GAMES_BET_PLACED_USER: 132,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 21.81,
            D0_GAMES_BET_FLOW: 2029.43,
            D0_TOTAL_BET_FLOW: 2051.24,

            // 付费 & 投注（D7）
            D7_unique_purchase: 255,
            D7_PURCHASE_VALUE: 1584.46,
            D7_TOTAL_BET_PLACED_USER: 258,
            D7_SPORTS_BET_PLACED_USER: 128,
            D7_GAMES_BET_PLACED_USER: 206,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 107.63,
            D7_GAMES_BET_FLOW: 8284.9,
            D7_TOTAL_BET_FLOW: 8392.53,

            // 留存
            D1_retained_users: 160,
            D7_retained_users: 59,
          },

          {
            date: "2025-09-11", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 156,
            D0_unique_purchase: 45,
            D0_PURCHASE_VALUE: 289.65,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 46,
            D0_SPORTS_BET_PLACED_USER: 29,
            D0_GAMES_BET_PLACED_USER: 25,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 51.32,
            D0_GAMES_BET_FLOW: 2079.44,
            D0_TOTAL_BET_FLOW: 2130.77,

            // 付费 & 投注（D7）
            D7_unique_purchase: 68,
            D7_PURCHASE_VALUE: 640.6,
            D7_TOTAL_BET_PLACED_USER: 76,
            D7_SPORTS_BET_PLACED_USER: 58,
            D7_GAMES_BET_PLACED_USER: 36,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 254.77,
            D7_GAMES_BET_FLOW: 4205.61,
            D7_TOTAL_BET_FLOW: 4460.38,

            // 留存
            D1_retained_users: 57,
            D7_retained_users: 28,
          },

          {
            date: "2025-09-12", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 383,
            D0_unique_purchase: 204,
            D0_PURCHASE_VALUE: 1182.46,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 194,
            D0_SPORTS_BET_PLACED_USER: 134,
            D0_GAMES_BET_PLACED_USER: 108,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 712.26,
            D0_GAMES_BET_FLOW: 2229.22,
            D0_TOTAL_BET_FLOW: 2941.48,

            // 付费 & 投注（D7）
            D7_unique_purchase: 240,
            D7_PURCHASE_VALUE: 3479.77,
            D7_TOTAL_BET_PLACED_USER: 236,
            D7_SPORTS_BET_PLACED_USER: 179,
            D7_GAMES_BET_PLACED_USER: 144,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1935.17,
            D7_GAMES_BET_FLOW: 10839.65,
            D7_TOTAL_BET_FLOW: 12774.82,

            // 留存
            D1_retained_users: 178,
            D7_retained_users: 54,
          },

          {
            date: "2025-09-12", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 769,
            D0_unique_purchase: 307,
            D0_PURCHASE_VALUE: 397.58,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 308,
            D0_SPORTS_BET_PLACED_USER: 111,
            D0_GAMES_BET_PLACED_USER: 240,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 139.74,
            D0_GAMES_BET_FLOW: 1339.56,
            D0_TOTAL_BET_FLOW: 1479.3,

            // 付费 & 投注（D7）
            D7_unique_purchase: 384,
            D7_PURCHASE_VALUE: 1062.17,
            D7_TOTAL_BET_PLACED_USER: 405,
            D7_SPORTS_BET_PLACED_USER: 185,
            D7_GAMES_BET_PLACED_USER: 315,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 372.97,
            D7_GAMES_BET_FLOW: 4509.17,
            D7_TOTAL_BET_FLOW: 4882.14,

            // 留存
            D1_retained_users: 335,
            D7_retained_users: 74,
          },

          {
            date: "2025-09-12", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1394,
            D0_unique_purchase: 497,
            D0_PURCHASE_VALUE: 631.19,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 462,
            D0_SPORTS_BET_PLACED_USER: 296,
            D0_GAMES_BET_PLACED_USER: 273,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 203.34,
            D0_GAMES_BET_FLOW: 2004.48,
            D0_TOTAL_BET_FLOW: 2207.82,

            // 付费 & 投注（D7）
            D7_unique_purchase: 654,
            D7_PURCHASE_VALUE: 2842.41,
            D7_TOTAL_BET_PLACED_USER: 659,
            D7_SPORTS_BET_PLACED_USER: 457,
            D7_GAMES_BET_PLACED_USER: 417,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1598.5,
            D7_GAMES_BET_FLOW: 10372.48,
            D7_TOTAL_BET_FLOW: 11970.97,

            // 留存
            D1_retained_users: 523,
            D7_retained_users: 144,
          },

          {
            date: "2025-09-12", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 629,
            D0_unique_purchase: 187,
            D0_PURCHASE_VALUE: 489.36,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 205,
            D0_SPORTS_BET_PLACED_USER: 107,
            D0_GAMES_BET_PLACED_USER: 131,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 68.75,
            D0_GAMES_BET_FLOW: 1626.73,
            D0_TOTAL_BET_FLOW: 1695.48,

            // 付费 & 投注（D7）
            D7_unique_purchase: 296,
            D7_PURCHASE_VALUE: 1661.24,
            D7_TOTAL_BET_PLACED_USER: 306,
            D7_SPORTS_BET_PLACED_USER: 165,
            D7_GAMES_BET_PLACED_USER: 231,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 376.77,
            D7_GAMES_BET_FLOW: 7794.23,
            D7_TOTAL_BET_FLOW: 8171.0,

            // 留存
            D1_retained_users: 192,
            D7_retained_users: 61,
          },

          {
            date: "2025-09-12", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 147,
            D0_unique_purchase: 63,
            D0_PURCHASE_VALUE: 522.11,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 62,
            D0_SPORTS_BET_PLACED_USER: 40,
            D0_GAMES_BET_PLACED_USER: 31,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 27.72,
            D0_GAMES_BET_FLOW: 1406.35,
            D0_TOTAL_BET_FLOW: 1434.08,

            // 付费 & 投注（D7）
            D7_unique_purchase: 82,
            D7_PURCHASE_VALUE: 1215.29,
            D7_TOTAL_BET_PLACED_USER: 90,
            D7_SPORTS_BET_PLACED_USER: 68,
            D7_GAMES_BET_PLACED_USER: 43,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 179.19,
            D7_GAMES_BET_FLOW: 4812.33,
            D7_TOTAL_BET_FLOW: 4991.51,

            // 留存
            D1_retained_users: 80,
            D7_retained_users: 30,
          },

          {
            date: "2025-09-13", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 443,
            D0_unique_purchase: 235,
            D0_PURCHASE_VALUE: 714.31,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 234,
            D0_SPORTS_BET_PLACED_USER: 178,
            D0_GAMES_BET_PLACED_USER: 94,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 576.46,
            D0_GAMES_BET_FLOW: 2079.48,
            D0_TOTAL_BET_FLOW: 2655.95,

            // 付费 & 投注（D7）
            D7_unique_purchase: 288,
            D7_PURCHASE_VALUE: 4284.54,
            D7_TOTAL_BET_PLACED_USER: 289,
            D7_SPORTS_BET_PLACED_USER: 222,
            D7_GAMES_BET_PLACED_USER: 149,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 7292.16,
            D7_GAMES_BET_FLOW: 8018.12,
            D7_TOTAL_BET_FLOW: 15310.28,

            // 留存
            D1_retained_users: 194,
            D7_retained_users: 84,
          },

          {
            date: "2025-09-13", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 870,
            D0_unique_purchase: 368,
            D0_PURCHASE_VALUE: 1655.63,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 367,
            D0_SPORTS_BET_PLACED_USER: 172,
            D0_GAMES_BET_PLACED_USER: 252,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 1953.65,
            D0_GAMES_BET_FLOW: 1552.17,
            D0_TOTAL_BET_FLOW: 3505.81,

            // 付费 & 投注（D7）
            D7_unique_purchase: 431,
            D7_PURCHASE_VALUE: 2131.91,
            D7_TOTAL_BET_PLACED_USER: 467,
            D7_SPORTS_BET_PLACED_USER: 248,
            D7_GAMES_BET_PLACED_USER: 342,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 11230.98,
            D7_GAMES_BET_FLOW: 3696.19,
            D7_TOTAL_BET_FLOW: 14927.17,

            // 留存
            D1_retained_users: 325,
            D7_retained_users: 120,
          },

          {
            date: "2025-09-13", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1520,
            D0_unique_purchase: 570,
            D0_PURCHASE_VALUE: 890.26,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 528,
            D0_SPORTS_BET_PLACED_USER: 335,
            D0_GAMES_BET_PLACED_USER: 298,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 492.92,
            D0_GAMES_BET_FLOW: 2822.21,
            D0_TOTAL_BET_FLOW: 3315.13,

            // 付费 & 投注（D7）
            D7_unique_purchase: 730,
            D7_PURCHASE_VALUE: 3462.62,
            D7_TOTAL_BET_PLACED_USER: 732,
            D7_SPORTS_BET_PLACED_USER: 498,
            D7_GAMES_BET_PLACED_USER: 445,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1447.8,
            D7_GAMES_BET_FLOW: 11288.19,
            D7_TOTAL_BET_FLOW: 12735.99,

            // 留存
            D1_retained_users: 597,
            D7_retained_users: 192,
          },

          {
            date: "2025-09-13", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 885,
            D0_unique_purchase: 221,
            D0_PURCHASE_VALUE: 361.33,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 228,
            D0_SPORTS_BET_PLACED_USER: 139,
            D0_GAMES_BET_PLACED_USER: 135,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 171.78,
            D0_GAMES_BET_FLOW: 1386.77,
            D0_TOTAL_BET_FLOW: 1558.55,

            // 付费 & 投注（D7）
            D7_unique_purchase: 376,
            D7_PURCHASE_VALUE: 1260.06,
            D7_TOTAL_BET_PLACED_USER: 408,
            D7_SPORTS_BET_PLACED_USER: 265,
            D7_GAMES_BET_PLACED_USER: 235,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 453.94,
            D7_GAMES_BET_FLOW: 6047.66,
            D7_TOTAL_BET_FLOW: 6501.59,

            // 留存
            D1_retained_users: 302,
            D7_retained_users: 91,
          },

          {
            date: "2025-09-13", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 179,
            D0_unique_purchase: 94,
            D0_PURCHASE_VALUE: 122.19,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 91,
            D0_SPORTS_BET_PLACED_USER: 75,
            D0_GAMES_BET_PLACED_USER: 35,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 58.24,
            D0_GAMES_BET_FLOW: 324.03,
            D0_TOTAL_BET_FLOW: 382.26,

            // 付费 & 投注（D7）
            D7_unique_purchase: 108,
            D7_PURCHASE_VALUE: 504.61,
            D7_TOTAL_BET_PLACED_USER: 111,
            D7_SPORTS_BET_PLACED_USER: 95,
            D7_GAMES_BET_PLACED_USER: 47,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 325.62,
            D7_GAMES_BET_FLOW: 1466.19,
            D7_TOTAL_BET_FLOW: 1791.81,

            // 留存
            D1_retained_users: 77,
            D7_retained_users: 44,
          },

          {
            date: "2025-09-14", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 358,
            D0_unique_purchase: 155,
            D0_PURCHASE_VALUE: 573.46,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 150,
            D0_SPORTS_BET_PLACED_USER: 90,
            D0_GAMES_BET_PLACED_USER: 97,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 80.63,
            D0_GAMES_BET_FLOW: 2145.68,
            D0_TOTAL_BET_FLOW: 2226.3,

            // 付费 & 投注（D7）
            D7_unique_purchase: 194,
            D7_PURCHASE_VALUE: 1888.69,
            D7_TOTAL_BET_PLACED_USER: 198,
            D7_SPORTS_BET_PLACED_USER: 139,
            D7_GAMES_BET_PLACED_USER: 141,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 337.76,
            D7_GAMES_BET_FLOW: 7494.8,
            D7_TOTAL_BET_FLOW: 7832.56,

            // 留存
            D1_retained_users: 153,
            D7_retained_users: 66,
          },

          {
            date: "2025-09-14", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 846,
            D0_unique_purchase: 399,
            D0_PURCHASE_VALUE: 706.65,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 398,
            D0_SPORTS_BET_PLACED_USER: 174,
            D0_GAMES_BET_PLACED_USER: 269,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 326.6,
            D0_GAMES_BET_FLOW: 2427.43,
            D0_TOTAL_BET_FLOW: 2754.03,

            // 付费 & 投注（D7）
            D7_unique_purchase: 450,
            D7_PURCHASE_VALUE: 1839.34,
            D7_TOTAL_BET_PLACED_USER: 466,
            D7_SPORTS_BET_PLACED_USER: 250,
            D7_GAMES_BET_PLACED_USER: 337,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 893.65,
            D7_GAMES_BET_FLOW: 9466.89,
            D7_TOTAL_BET_FLOW: 10360.54,

            // 留存
            D1_retained_users: 341,
            D7_retained_users: 135,
          },

          {
            date: "2025-09-14", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1447,
            D0_unique_purchase: 506,
            D0_PURCHASE_VALUE: 930.77,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 459,
            D0_SPORTS_BET_PLACED_USER: 274,
            D0_GAMES_BET_PLACED_USER: 268,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 259.39,
            D0_GAMES_BET_FLOW: 4121.18,
            D0_TOTAL_BET_FLOW: 4380.57,

            // 付费 & 投注（D7）
            D7_unique_purchase: 659,
            D7_PURCHASE_VALUE: 2930.76,
            D7_TOTAL_BET_PLACED_USER: 652,
            D7_SPORTS_BET_PLACED_USER: 439,
            D7_GAMES_BET_PLACED_USER: 387,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 853.47,
            D7_GAMES_BET_FLOW: 13595.93,
            D7_TOTAL_BET_FLOW: 14449.4,

            // 留存
            D1_retained_users: 488,
            D7_retained_users: 172,
          },

          {
            date: "2025-09-14", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 552,
            D0_unique_purchase: 211,
            D0_PURCHASE_VALUE: 325.02,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 211,
            D0_SPORTS_BET_PLACED_USER: 141,
            D0_GAMES_BET_PLACED_USER: 122,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 82.26,
            D0_GAMES_BET_FLOW: 1024.83,
            D0_TOTAL_BET_FLOW: 1107.09,

            // 付费 & 投注（D7）
            D7_unique_purchase: 270,
            D7_PURCHASE_VALUE: 745.54,
            D7_TOTAL_BET_PLACED_USER: 268,
            D7_SPORTS_BET_PLACED_USER: 186,
            D7_GAMES_BET_PLACED_USER: 160,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 255.27,
            D7_GAMES_BET_FLOW: 2843.96,
            D7_TOTAL_BET_FLOW: 3099.23,

            // 留存
            D1_retained_users: 206,
            D7_retained_users: 93,
          },

          {
            date: "2025-09-14", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 173,
            D0_unique_purchase: 64,
            D0_PURCHASE_VALUE: 239.85,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 66,
            D0_SPORTS_BET_PLACED_USER: 58,
            D0_GAMES_BET_PLACED_USER: 27,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 101.08,
            D0_GAMES_BET_FLOW: 365.99,
            D0_TOTAL_BET_FLOW: 467.07,

            // 付费 & 投注（D7）
            D7_unique_purchase: 75,
            D7_PURCHASE_VALUE: 403.71,
            D7_TOTAL_BET_PLACED_USER: 85,
            D7_SPORTS_BET_PLACED_USER: 77,
            D7_GAMES_BET_PLACED_USER: 41,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 253.77,
            D7_GAMES_BET_FLOW: 608.28,
            D7_TOTAL_BET_FLOW: 862.05,

            // 留存
            D1_retained_users: 60,
            D7_retained_users: 30,
          },

          {
            date: "2025-09-15", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 364,
            D0_unique_purchase: 185,
            D0_PURCHASE_VALUE: 1032.77,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 181,
            D0_SPORTS_BET_PLACED_USER: 133,
            D0_GAMES_BET_PLACED_USER: 108,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 164.22,
            D0_GAMES_BET_FLOW: 2696.99,
            D0_TOTAL_BET_FLOW: 2861.21,

            // 付费 & 投注（D7）
            D7_unique_purchase: 230,
            D7_PURCHASE_VALUE: 2338.38,
            D7_TOTAL_BET_PLACED_USER: 234,
            D7_SPORTS_BET_PLACED_USER: 191,
            D7_GAMES_BET_PLACED_USER: 150,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 591.08,
            D7_GAMES_BET_FLOW: 10353.99,
            D7_TOTAL_BET_FLOW: 10945.07,

            // 留存
            D1_retained_users: 163,
            D7_retained_users: 47,
          },

          {
            date: "2025-09-15", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 809,
            D0_unique_purchase: 284,
            D0_PURCHASE_VALUE: 544.26,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 293,
            D0_SPORTS_BET_PLACED_USER: 126,
            D0_GAMES_BET_PLACED_USER: 202,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 270.26,
            D0_GAMES_BET_FLOW: 1067.09,
            D0_TOTAL_BET_FLOW: 1337.35,

            // 付费 & 投注（D7）
            D7_unique_purchase: 343,
            D7_PURCHASE_VALUE: 1188.11,
            D7_TOTAL_BET_PLACED_USER: 397,
            D7_SPORTS_BET_PLACED_USER: 207,
            D7_GAMES_BET_PLACED_USER: 267,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 448.51,
            D7_GAMES_BET_FLOW: 4289.2,
            D7_TOTAL_BET_FLOW: 4737.71,

            // 留存
            D1_retained_users: 313,
            D7_retained_users: 62,
          },

          {
            date: "2025-09-15", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1574,
            D0_unique_purchase: 537,
            D0_PURCHASE_VALUE: 796.14,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 483,
            D0_SPORTS_BET_PLACED_USER: 278,
            D0_GAMES_BET_PLACED_USER: 296,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 267.69,
            D0_GAMES_BET_FLOW: 2658.01,
            D0_TOTAL_BET_FLOW: 2925.7,

            // 付费 & 投注（D7）
            D7_unique_purchase: 693,
            D7_PURCHASE_VALUE: 3214.08,
            D7_TOTAL_BET_PLACED_USER: 672,
            D7_SPORTS_BET_PLACED_USER: 427,
            D7_GAMES_BET_PLACED_USER: 437,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 909.34,
            D7_GAMES_BET_FLOW: 10935.75,
            D7_TOTAL_BET_FLOW: 11845.1,

            // 留存
            D1_retained_users: 662,
            D7_retained_users: 149,
          },

          {
            date: "2025-09-15", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 589,
            D0_unique_purchase: 226,
            D0_PURCHASE_VALUE: 411.35,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 207,
            D0_SPORTS_BET_PLACED_USER: 83,
            D0_GAMES_BET_PLACED_USER: 160,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 103.5,
            D0_GAMES_BET_FLOW: 1943.27,
            D0_TOTAL_BET_FLOW: 2046.77,

            // 付费 & 投注（D7）
            D7_unique_purchase: 288,
            D7_PURCHASE_VALUE: 1313.49,
            D7_TOTAL_BET_PLACED_USER: 286,
            D7_SPORTS_BET_PLACED_USER: 148,
            D7_GAMES_BET_PLACED_USER: 214,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 294.91,
            D7_GAMES_BET_FLOW: 5751.49,
            D7_TOTAL_BET_FLOW: 6046.39,

            // 留存
            D1_retained_users: 251,
            D7_retained_users: 60,
          },

          {
            date: "2025-09-15", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 99,
            D0_unique_purchase: 36,
            D0_PURCHASE_VALUE: 83.31,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 37,
            D0_SPORTS_BET_PLACED_USER: 22,
            D0_GAMES_BET_PLACED_USER: 20,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 41.25,
            D0_GAMES_BET_FLOW: 200.71,
            D0_TOTAL_BET_FLOW: 241.97,

            // 付费 & 投注（D7）
            D7_unique_purchase: 46,
            D7_PURCHASE_VALUE: 423.87,
            D7_TOTAL_BET_PLACED_USER: 50,
            D7_SPORTS_BET_PLACED_USER: 39,
            D7_GAMES_BET_PLACED_USER: 25,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 519.69,
            D7_GAMES_BET_FLOW: 707.99,
            D7_TOTAL_BET_FLOW: 1227.67,

            // 留存
            D1_retained_users: 39,
            D7_retained_users: 11,
          },

          {
            date: "2025-09-16", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 464,
            D0_unique_purchase: 266,
            D0_PURCHASE_VALUE: 1459.54,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 262,
            D0_SPORTS_BET_PLACED_USER: 208,
            D0_GAMES_BET_PLACED_USER: 90,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 846.53,
            D0_GAMES_BET_FLOW: 1830.92,
            D0_TOTAL_BET_FLOW: 2677.45,

            // 付费 & 投注（D7）
            D7_unique_purchase: 305,
            D7_PURCHASE_VALUE: 5055.31,
            D7_TOTAL_BET_PLACED_USER: 308,
            D7_SPORTS_BET_PLACED_USER: 256,
            D7_GAMES_BET_PLACED_USER: 147,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2347.0,
            D7_GAMES_BET_FLOW: 15891.6,
            D7_TOTAL_BET_FLOW: 18238.6,

            // 留存
            D1_retained_users: 172,
            D7_retained_users: 64,
          },

          {
            date: "2025-09-16", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 904,
            D0_unique_purchase: 279,
            D0_PURCHASE_VALUE: 1228.21,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 279,
            D0_SPORTS_BET_PLACED_USER: 110,
            D0_GAMES_BET_PLACED_USER: 200,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 66.32,
            D0_GAMES_BET_FLOW: 6065.06,
            D0_TOTAL_BET_FLOW: 6131.39,

            // 付费 & 投注（D7）
            D7_unique_purchase: 368,
            D7_PURCHASE_VALUE: 2689.91,
            D7_TOTAL_BET_PLACED_USER: 459,
            D7_SPORTS_BET_PLACED_USER: 251,
            D7_GAMES_BET_PLACED_USER: 294,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 192.53,
            D7_GAMES_BET_FLOW: 13949.23,
            D7_TOTAL_BET_FLOW: 14141.76,

            // 留存
            D1_retained_users: 399,
            D7_retained_users: 81,
          },

          {
            date: "2025-09-16", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1539,
            D0_unique_purchase: 548,
            D0_PURCHASE_VALUE: 1318.95,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 516,
            D0_SPORTS_BET_PLACED_USER: 351,
            D0_GAMES_BET_PLACED_USER: 278,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 1007.7,
            D0_GAMES_BET_FLOW: 2470.07,
            D0_TOTAL_BET_FLOW: 3477.77,

            // 付费 & 投注（D7）
            D7_unique_purchase: 702,
            D7_PURCHASE_VALUE: 4458.37,
            D7_TOTAL_BET_PLACED_USER: 711,
            D7_SPORTS_BET_PLACED_USER: 513,
            D7_GAMES_BET_PLACED_USER: 436,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 5065.38,
            D7_GAMES_BET_FLOW: 8246.52,
            D7_TOTAL_BET_FLOW: 13311.9,

            // 留存
            D1_retained_users: 612,
            D7_retained_users: 184,
          },

          {
            date: "2025-09-16", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 541,
            D0_unique_purchase: 192,
            D0_PURCHASE_VALUE: 232.82,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 180,
            D0_SPORTS_BET_PLACED_USER: 93,
            D0_GAMES_BET_PLACED_USER: 122,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 65.09,
            D0_GAMES_BET_FLOW: 664.27,
            D0_TOTAL_BET_FLOW: 729.37,

            // 付费 & 投注（D7）
            D7_unique_purchase: 260,
            D7_PURCHASE_VALUE: 875.81,
            D7_TOTAL_BET_PLACED_USER: 263,
            D7_SPORTS_BET_PLACED_USER: 149,
            D7_GAMES_BET_PLACED_USER: 187,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 332.14,
            D7_GAMES_BET_FLOW: 3240.71,
            D7_TOTAL_BET_FLOW: 3572.85,

            // 留存
            D1_retained_users: 172,
            D7_retained_users: 65,
          },

          {
            date: "2025-09-16", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 198,
            D0_unique_purchase: 76,
            D0_PURCHASE_VALUE: 126.58,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 75,
            D0_SPORTS_BET_PLACED_USER: 68,
            D0_GAMES_BET_PLACED_USER: 25,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 78.82,
            D0_GAMES_BET_FLOW: 181.22,
            D0_TOTAL_BET_FLOW: 260.04,

            // 付费 & 投注（D7）
            D7_unique_purchase: 87,
            D7_PURCHASE_VALUE: 226.72,
            D7_TOTAL_BET_PLACED_USER: 91,
            D7_SPORTS_BET_PLACED_USER: 83,
            D7_GAMES_BET_PLACED_USER: 35,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 229.61,
            D7_GAMES_BET_FLOW: 380.09,
            D7_TOTAL_BET_FLOW: 609.71,

            // 留存
            D1_retained_users: 69,
            D7_retained_users: 24,
          },

          {
            date: "2025-09-17", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 434,
            D0_unique_purchase: 238,
            D0_PURCHASE_VALUE: 1102.23,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 223,
            D0_SPORTS_BET_PLACED_USER: 171,
            D0_GAMES_BET_PLACED_USER: 89,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 192.28,
            D0_GAMES_BET_FLOW: 3740.16,
            D0_TOTAL_BET_FLOW: 3932.44,

            // 付费 & 投注（D7）
            D7_unique_purchase: 286,
            D7_PURCHASE_VALUE: 3027.46,
            D7_TOTAL_BET_PLACED_USER: 284,
            D7_SPORTS_BET_PLACED_USER: 231,
            D7_GAMES_BET_PLACED_USER: 137,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 543.41,
            D7_GAMES_BET_FLOW: 13276.61,
            D7_TOTAL_BET_FLOW: 13820.01,

            // 留存
            D1_retained_users: 178,
            D7_retained_users: 59,
          },

          {
            date: "2025-09-17", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 754,
            D0_unique_purchase: 289,
            D0_PURCHASE_VALUE: 752.65,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 282,
            D0_SPORTS_BET_PLACED_USER: 107,
            D0_GAMES_BET_PLACED_USER: 226,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 29.93,
            D0_GAMES_BET_FLOW: 3174.9,
            D0_TOTAL_BET_FLOW: 3204.84,

            // 付费 & 投注（D7）
            D7_unique_purchase: 361,
            D7_PURCHASE_VALUE: 2791.83,
            D7_TOTAL_BET_PLACED_USER: 424,
            D7_SPORTS_BET_PLACED_USER: 226,
            D7_GAMES_BET_PLACED_USER: 300,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 126.2,
            D7_GAMES_BET_FLOW: 15832.76,
            D7_TOTAL_BET_FLOW: 15958.96,

            // 留存
            D1_retained_users: 321,
            D7_retained_users: 85,
          },

          {
            date: "2025-09-17", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1370,
            D0_unique_purchase: 502,
            D0_PURCHASE_VALUE: 1241.02,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 480,
            D0_SPORTS_BET_PLACED_USER: 302,
            D0_GAMES_BET_PLACED_USER: 279,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 675.94,
            D0_GAMES_BET_FLOW: 5277.43,
            D0_TOTAL_BET_FLOW: 5953.37,

            // 付费 & 投注（D7）
            D7_unique_purchase: 661,
            D7_PURCHASE_VALUE: 5395.19,
            D7_TOTAL_BET_PLACED_USER: 686,
            D7_SPORTS_BET_PLACED_USER: 467,
            D7_GAMES_BET_PLACED_USER: 438,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2179.89,
            D7_GAMES_BET_FLOW: 31074.18,
            D7_TOTAL_BET_FLOW: 33254.07,

            // 留存
            D1_retained_users: 581,
            D7_retained_users: 145,
          },

          {
            date: "2025-09-17", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 975,
            D0_unique_purchase: 244,
            D0_PURCHASE_VALUE: 521.47,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 232,
            D0_SPORTS_BET_PLACED_USER: 116,
            D0_GAMES_BET_PLACED_USER: 160,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 100.77,
            D0_GAMES_BET_FLOW: 1693.22,
            D0_TOTAL_BET_FLOW: 1793.99,

            // 付费 & 投注（D7）
            D7_unique_purchase: 416,
            D7_PURCHASE_VALUE: 1415.51,
            D7_TOTAL_BET_PLACED_USER: 422,
            D7_SPORTS_BET_PLACED_USER: 258,
            D7_GAMES_BET_PLACED_USER: 249,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 353.84,
            D7_GAMES_BET_FLOW: 4890.04,
            D7_TOTAL_BET_FLOW: 5243.89,

            // 留存
            D1_retained_users: 280,
            D7_retained_users: 71,
          },

          {
            date: "2025-09-17", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 141,
            D0_unique_purchase: 55,
            D0_PURCHASE_VALUE: 71.46,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 55,
            D0_SPORTS_BET_PLACED_USER: 41,
            D0_GAMES_BET_PLACED_USER: 25,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 37.39,
            D0_GAMES_BET_FLOW: 247.12,
            D0_TOTAL_BET_FLOW: 284.51,

            // 付费 & 投注（D7）
            D7_unique_purchase: 67,
            D7_PURCHASE_VALUE: 302.56,
            D7_TOTAL_BET_PLACED_USER: 72,
            D7_SPORTS_BET_PLACED_USER: 57,
            D7_GAMES_BET_PLACED_USER: 39,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 196.29,
            D7_GAMES_BET_FLOW: 1045.11,
            D7_TOTAL_BET_FLOW: 1241.4,

            // 留存
            D1_retained_users: 71,
            D7_retained_users: 20,
          },

          {
            date: "2025-09-18", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 544,
            D0_unique_purchase: 312,
            D0_PURCHASE_VALUE: 813.85,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 227,
            D0_SPORTS_BET_PLACED_USER: 172,
            D0_GAMES_BET_PLACED_USER: 102,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 155.51,
            D0_GAMES_BET_FLOW: 3705.77,
            D0_TOTAL_BET_FLOW: 3861.28,

            // 付费 & 投注（D7）
            D7_unique_purchase: 371,
            D7_PURCHASE_VALUE: 2502.92,
            D7_TOTAL_BET_PLACED_USER: 375,
            D7_SPORTS_BET_PLACED_USER: 321,
            D7_GAMES_BET_PLACED_USER: 162,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 956.9,
            D7_GAMES_BET_FLOW: 8861.9,
            D7_TOTAL_BET_FLOW: 9818.79,

            // 留存
            D1_retained_users: 297,
            D7_retained_users: 76,
          },

          {
            date: "2025-09-18", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 768,
            D0_unique_purchase: 266,
            D0_PURCHASE_VALUE: 558.75,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 281,
            D0_SPORTS_BET_PLACED_USER: 109,
            D0_GAMES_BET_PLACED_USER: 223,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 30.9,
            D0_GAMES_BET_FLOW: 2214.7,
            D0_TOTAL_BET_FLOW: 2245.6,

            // 付费 & 投注（D7）
            D7_unique_purchase: 345,
            D7_PURCHASE_VALUE: 1620.54,
            D7_TOTAL_BET_PLACED_USER: 376,
            D7_SPORTS_BET_PLACED_USER: 180,
            D7_GAMES_BET_PLACED_USER: 294,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 94.28,
            D7_GAMES_BET_FLOW: 8401.76,
            D7_TOTAL_BET_FLOW: 8496.04,

            // 留存
            D1_retained_users: 279,
            D7_retained_users: 83,
          },

          {
            date: "2025-09-18", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1652,
            D0_unique_purchase: 583,
            D0_PURCHASE_VALUE: 918.92,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 562,
            D0_SPORTS_BET_PLACED_USER: 358,
            D0_GAMES_BET_PLACED_USER: 312,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 314.05,
            D0_GAMES_BET_FLOW: 2777.79,
            D0_TOTAL_BET_FLOW: 3091.84,

            // 付费 & 投注（D7）
            D7_unique_purchase: 751,
            D7_PURCHASE_VALUE: 3155.33,
            D7_TOTAL_BET_PLACED_USER: 781,
            D7_SPORTS_BET_PLACED_USER: 544,
            D7_GAMES_BET_PLACED_USER: 457,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1735.79,
            D7_GAMES_BET_FLOW: 12761.28,
            D7_TOTAL_BET_FLOW: 14497.07,

            // 留存
            D1_retained_users: 655,
            D7_retained_users: 189,
          },

          {
            date: "2025-09-18", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 756,
            D0_unique_purchase: 218,
            D0_PURCHASE_VALUE: 620.97,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 225,
            D0_SPORTS_BET_PLACED_USER: 119,
            D0_GAMES_BET_PLACED_USER: 144,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 91.67,
            D0_GAMES_BET_FLOW: 8935.95,
            D0_TOTAL_BET_FLOW: 9027.62,

            // 付费 & 投注（D7）
            D7_unique_purchase: 344,
            D7_PURCHASE_VALUE: 1749.0,
            D7_TOTAL_BET_PLACED_USER: 347,
            D7_SPORTS_BET_PLACED_USER: 213,
            D7_GAMES_BET_PLACED_USER: 210,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 435.49,
            D7_GAMES_BET_FLOW: 13416.54,
            D7_TOTAL_BET_FLOW: 13852.03,

            // 留存
            D1_retained_users: 254,
            D7_retained_users: 66,
          },

          {
            date: "2025-09-18", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 160,
            D0_unique_purchase: 51,
            D0_PURCHASE_VALUE: 126.95,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 54,
            D0_SPORTS_BET_PLACED_USER: 39,
            D0_GAMES_BET_PLACED_USER: 25,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 29.74,
            D0_GAMES_BET_FLOW: 349.29,
            D0_TOTAL_BET_FLOW: 379.03,

            // 付费 & 投注（D7）
            D7_unique_purchase: 71,
            D7_PURCHASE_VALUE: 598.97,
            D7_TOTAL_BET_PLACED_USER: 80,
            D7_SPORTS_BET_PLACED_USER: 64,
            D7_GAMES_BET_PLACED_USER: 36,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 217.92,
            D7_GAMES_BET_FLOW: 4498.89,
            D7_TOTAL_BET_FLOW: 4716.81,

            // 留存
            D1_retained_users: 53,
            D7_retained_users: 17,
          },

          {
            date: "2025-09-19", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 466,
            D0_unique_purchase: 282,
            D0_PURCHASE_VALUE: 695.85,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 273,
            D0_SPORTS_BET_PLACED_USER: 222,
            D0_GAMES_BET_PLACED_USER: 101,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 468.94,
            D0_GAMES_BET_FLOW: 1698.94,
            D0_TOTAL_BET_FLOW: 2167.88,

            // 付费 & 投注（D7）
            D7_unique_purchase: 320,
            D7_PURCHASE_VALUE: 2017.0,
            D7_TOTAL_BET_PLACED_USER: 322,
            D7_SPORTS_BET_PLACED_USER: 266,
            D7_GAMES_BET_PLACED_USER: 150,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1237.26,
            D7_GAMES_BET_FLOW: 9698.04,
            D7_TOTAL_BET_FLOW: 10935.3,

            // 留存
            D1_retained_users: 209,
            D7_retained_users: 83,
          },

          {
            date: "2025-09-19", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 715,
            D0_unique_purchase: 262,
            D0_PURCHASE_VALUE: 268.24,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 260,
            D0_SPORTS_BET_PLACED_USER: 83,
            D0_GAMES_BET_PLACED_USER: 202,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 21.8,
            D0_GAMES_BET_FLOW: 1275.12,
            D0_TOTAL_BET_FLOW: 1296.91,

            // 付费 & 投注（D7）
            D7_unique_purchase: 331,
            D7_PURCHASE_VALUE: 629.59,
            D7_TOTAL_BET_PLACED_USER: 364,
            D7_SPORTS_BET_PLACED_USER: 148,
            D7_GAMES_BET_PLACED_USER: 302,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 80.57,
            D7_GAMES_BET_FLOW: 3792.68,
            D7_TOTAL_BET_FLOW: 3873.26,

            // 留存
            D1_retained_users: 265,
            D7_retained_users: 66,
          },

          {
            date: "2025-09-19", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1669,
            D0_unique_purchase: 610,
            D0_PURCHASE_VALUE: 987.69,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 559,
            D0_SPORTS_BET_PLACED_USER: 384,
            D0_GAMES_BET_PLACED_USER: 307,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 721.23,
            D0_GAMES_BET_FLOW: 1567.01,
            D0_TOTAL_BET_FLOW: 2288.23,

            // 付费 & 投注（D7）
            D7_unique_purchase: 777,
            D7_PURCHASE_VALUE: 2453.2,
            D7_TOTAL_BET_PLACED_USER: 780,
            D7_SPORTS_BET_PLACED_USER: 575,
            D7_GAMES_BET_PLACED_USER: 453,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 3094.4,
            D7_GAMES_BET_FLOW: 14039.34,
            D7_TOTAL_BET_FLOW: 17133.74,

            // 留存
            D1_retained_users: 691,
            D7_retained_users: 188,
          },

          {
            date: "2025-09-19", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 623,
            D0_unique_purchase: 225,
            D0_PURCHASE_VALUE: 306.0,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 232,
            D0_SPORTS_BET_PLACED_USER: 136,
            D0_GAMES_BET_PLACED_USER: 148,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 59.61,
            D0_GAMES_BET_FLOW: 1440.7,
            D0_TOTAL_BET_FLOW: 1500.31,

            // 付费 & 投注（D7）
            D7_unique_purchase: 307,
            D7_PURCHASE_VALUE: 1608.3,
            D7_TOTAL_BET_PLACED_USER: 311,
            D7_SPORTS_BET_PLACED_USER: 180,
            D7_GAMES_BET_PLACED_USER: 221,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 318.95,
            D7_GAMES_BET_FLOW: 8391.88,
            D7_TOTAL_BET_FLOW: 8710.83,

            // 留存
            D1_retained_users: 276,
            D7_retained_users: 79,
          },

          {
            date: "2025-09-19", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 162,
            D0_unique_purchase: 68,
            D0_PURCHASE_VALUE: 206.58,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 65,
            D0_SPORTS_BET_PLACED_USER: 48,
            D0_GAMES_BET_PLACED_USER: 33,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 57.98,
            D0_GAMES_BET_FLOW: 451.01,
            D0_TOTAL_BET_FLOW: 508.99,

            // 付费 & 投注（D7）
            D7_unique_purchase: 81,
            D7_PURCHASE_VALUE: 589.61,
            D7_TOTAL_BET_PLACED_USER: 88,
            D7_SPORTS_BET_PLACED_USER: 71,
            D7_GAMES_BET_PLACED_USER: 45,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 392.23,
            D7_GAMES_BET_FLOW: 1774.01,
            D7_TOTAL_BET_FLOW: 2166.24,

            // 留存
            D1_retained_users: 79,
            D7_retained_users: 21,
          },

          {
            date: "2025-09-20", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 439,
            D0_unique_purchase: 215,
            D0_PURCHASE_VALUE: 1000.08,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 197,
            D0_SPORTS_BET_PLACED_USER: 134,
            D0_GAMES_BET_PLACED_USER: 120,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 289.78,
            D0_GAMES_BET_FLOW: 4584.4,
            D0_TOTAL_BET_FLOW: 4874.18,

            // 付费 & 投注（D7）
            D7_unique_purchase: 262,
            D7_PURCHASE_VALUE: 3006.77,
            D7_TOTAL_BET_PLACED_USER: 265,
            D7_SPORTS_BET_PLACED_USER: 202,
            D7_GAMES_BET_PLACED_USER: 160,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 922.1,
            D7_GAMES_BET_FLOW: 12266.4,
            D7_TOTAL_BET_FLOW: 13188.5,

            // 留存
            D1_retained_users: 234,
            D7_retained_users: 89,
          },

          {
            date: "2025-09-20", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1082,
            D0_unique_purchase: 434,
            D0_PURCHASE_VALUE: 525.98,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 436,
            D0_SPORTS_BET_PLACED_USER: 226,
            D0_GAMES_BET_PLACED_USER: 275,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 204.41,
            D0_GAMES_BET_FLOW: 2193.17,
            D0_TOTAL_BET_FLOW: 2397.58,

            // 付费 & 投注（D7）
            D7_unique_purchase: 520,
            D7_PURCHASE_VALUE: 1457.16,
            D7_TOTAL_BET_PLACED_USER: 580,
            D7_SPORTS_BET_PLACED_USER: 325,
            D7_GAMES_BET_PLACED_USER: 386,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 341.4,
            D7_GAMES_BET_FLOW: 6968.38,
            D7_TOTAL_BET_FLOW: 7309.78,

            // 留存
            D1_retained_users: 453,
            D7_retained_users: 114,
          },

          {
            date: "2025-09-20", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1692,
            D0_unique_purchase: 597,
            D0_PURCHASE_VALUE: 1178.73,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 547,
            D0_SPORTS_BET_PLACED_USER: 377,
            D0_GAMES_BET_PLACED_USER: 282,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 751.29,
            D0_GAMES_BET_FLOW: 2873.16,
            D0_TOTAL_BET_FLOW: 3624.44,

            // 付费 & 投注（D7）
            D7_unique_purchase: 767,
            D7_PURCHASE_VALUE: 5509.35,
            D7_TOTAL_BET_PLACED_USER: 773,
            D7_SPORTS_BET_PLACED_USER: 562,
            D7_GAMES_BET_PLACED_USER: 461,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 4635.12,
            D7_GAMES_BET_FLOW: 17615.67,
            D7_TOTAL_BET_FLOW: 22250.79,

            // 留存
            D1_retained_users: 652,
            D7_retained_users: 219,
          },

          {
            date: "2025-09-20", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 851,
            D0_unique_purchase: 287,
            D0_PURCHASE_VALUE: 423.33,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 259,
            D0_SPORTS_BET_PLACED_USER: 158,
            D0_GAMES_BET_PLACED_USER: 149,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 119.44,
            D0_GAMES_BET_FLOW: 1492.83,
            D0_TOTAL_BET_FLOW: 1612.26,

            // 付费 & 投注（D7）
            D7_unique_purchase: 391,
            D7_PURCHASE_VALUE: 1499.95,
            D7_TOTAL_BET_PLACED_USER: 384,
            D7_SPORTS_BET_PLACED_USER: 241,
            D7_GAMES_BET_PLACED_USER: 249,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 495.91,
            D7_GAMES_BET_FLOW: 5599.64,
            D7_TOTAL_BET_FLOW: 6095.55,

            // 留存
            D1_retained_users: 341,
            D7_retained_users: 121,
          },

          {
            date: "2025-09-20", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 213,
            D0_unique_purchase: 92,
            D0_PURCHASE_VALUE: 250.35,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 91,
            D0_SPORTS_BET_PLACED_USER: 77,
            D0_GAMES_BET_PLACED_USER: 33,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 130.44,
            D0_GAMES_BET_FLOW: 746.05,
            D0_TOTAL_BET_FLOW: 876.49,

            // 付费 & 投注（D7）
            D7_unique_purchase: 109,
            D7_PURCHASE_VALUE: 559.02,
            D7_TOTAL_BET_PLACED_USER: 122,
            D7_SPORTS_BET_PLACED_USER: 105,
            D7_GAMES_BET_PLACED_USER: 57,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 537.66,
            D7_GAMES_BET_FLOW: 1230.16,
            D7_TOTAL_BET_FLOW: 1767.82,

            // 留存
            D1_retained_users: 105,
            D7_retained_users: 39,
          },

          {
            date: "2025-09-21", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 474,
            D0_unique_purchase: 247,
            D0_PURCHASE_VALUE: 612.78,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 236,
            D0_SPORTS_BET_PLACED_USER: 164,
            D0_GAMES_BET_PLACED_USER: 115,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 117.58,
            D0_GAMES_BET_FLOW: 2260.34,
            D0_TOTAL_BET_FLOW: 2377.92,

            // 付费 & 投注（D7）
            D7_unique_purchase: 290,
            D7_PURCHASE_VALUE: 3833.78,
            D7_TOTAL_BET_PLACED_USER: 287,
            D7_SPORTS_BET_PLACED_USER: 221,
            D7_GAMES_BET_PLACED_USER: 158,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 616.83,
            D7_GAMES_BET_FLOW: 10766.05,
            D7_TOTAL_BET_FLOW: 11382.88,

            // 留存
            D1_retained_users: 185,
            D7_retained_users: 73,
          },

          {
            date: "2025-09-21", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 944,
            D0_unique_purchase: 416,
            D0_PURCHASE_VALUE: 630.84,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 403,
            D0_SPORTS_BET_PLACED_USER: 196,
            D0_GAMES_BET_PLACED_USER: 265,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 166.1,
            D0_GAMES_BET_FLOW: 2795.46,
            D0_TOTAL_BET_FLOW: 2961.56,

            // 付费 & 投注（D7）
            D7_unique_purchase: 492,
            D7_PURCHASE_VALUE: 1577.39,
            D7_TOTAL_BET_PLACED_USER: 528,
            D7_SPORTS_BET_PLACED_USER: 295,
            D7_GAMES_BET_PLACED_USER: 340,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 363.32,
            D7_GAMES_BET_FLOW: 8321.2,
            D7_TOTAL_BET_FLOW: 8684.52,

            // 留存
            D1_retained_users: 426,
            D7_retained_users: 123,
          },

          {
            date: "2025-09-21", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1672,
            D0_unique_purchase: 557,
            D0_PURCHASE_VALUE: 677.42,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 532,
            D0_SPORTS_BET_PLACED_USER: 344,
            D0_GAMES_BET_PLACED_USER: 299,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 215.67,
            D0_GAMES_BET_FLOW: 2324.0,
            D0_TOTAL_BET_FLOW: 2539.67,

            // 付费 & 投注（D7）
            D7_unique_purchase: 709,
            D7_PURCHASE_VALUE: 2068.47,
            D7_TOTAL_BET_PLACED_USER: 725,
            D7_SPORTS_BET_PLACED_USER: 501,
            D7_GAMES_BET_PLACED_USER: 435,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1491.94,
            D7_GAMES_BET_FLOW: 7412.25,
            D7_TOTAL_BET_FLOW: 8904.19,

            // 留存
            D1_retained_users: 623,
            D7_retained_users: 174,
          },

          {
            date: "2025-09-21", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 696,
            D0_unique_purchase: 273,
            D0_PURCHASE_VALUE: 473.77,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 287,
            D0_SPORTS_BET_PLACED_USER: 172,
            D0_GAMES_BET_PLACED_USER: 163,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 104.91,
            D0_GAMES_BET_FLOW: 2226.08,
            D0_TOTAL_BET_FLOW: 2330.99,

            // 付费 & 投注（D7）
            D7_unique_purchase: 362,
            D7_PURCHASE_VALUE: 1460.79,
            D7_TOTAL_BET_PLACED_USER: 371,
            D7_SPORTS_BET_PLACED_USER: 237,
            D7_GAMES_BET_PLACED_USER: 233,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 488.93,
            D7_GAMES_BET_FLOW: 6465.35,
            D7_TOTAL_BET_FLOW: 6954.29,

            // 留存
            D1_retained_users: 285,
            D7_retained_users: 110,
          },

          {
            date: "2025-09-21", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 199,
            D0_unique_purchase: 72,
            D0_PURCHASE_VALUE: 292.56,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 72,
            D0_SPORTS_BET_PLACED_USER: 54,
            D0_GAMES_BET_PLACED_USER: 33,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 46.33,
            D0_GAMES_BET_FLOW: 850.48,
            D0_TOTAL_BET_FLOW: 896.81,

            // 付费 & 投注（D7）
            D7_unique_purchase: 85,
            D7_PURCHASE_VALUE: 642.73,
            D7_TOTAL_BET_PLACED_USER: 95,
            D7_SPORTS_BET_PLACED_USER: 75,
            D7_GAMES_BET_PLACED_USER: 45,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 98.52,
            D7_GAMES_BET_FLOW: 2654.27,
            D7_TOTAL_BET_FLOW: 2752.79,

            // 留存
            D1_retained_users: 70,
            D7_retained_users: 44,
          },

          {
            date: "2025-09-22", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 560,
            D0_unique_purchase: 180,
            D0_PURCHASE_VALUE: 732.69,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 168,
            D0_SPORTS_BET_PLACED_USER: 99,
            D0_GAMES_BET_PLACED_USER: 108,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 81.47,
            D0_GAMES_BET_FLOW: 2260.58,
            D0_TOTAL_BET_FLOW: 2342.05,

            // 付费 & 投注（D7）
            D7_unique_purchase: 381,
            D7_PURCHASE_VALUE: 3517.0,
            D7_TOTAL_BET_PLACED_USER: 387,
            D7_SPORTS_BET_PLACED_USER: 323,
            D7_GAMES_BET_PLACED_USER: 163,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2310.47,
            D7_GAMES_BET_FLOW: 11747.92,
            D7_TOTAL_BET_FLOW: 14058.39,

            // 留存
            D1_retained_users: 228,
            D7_retained_users: 82,
          },

          {
            date: "2025-09-22", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 787,
            D0_unique_purchase: 233,
            D0_PURCHASE_VALUE: 1120.98,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 221,
            D0_SPORTS_BET_PLACED_USER: 75,
            D0_GAMES_BET_PLACED_USER: 172,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 43.88,
            D0_GAMES_BET_FLOW: 1636.12,
            D0_TOTAL_BET_FLOW: 1680.0,

            // 付费 & 投注（D7）
            D7_unique_purchase: 345,
            D7_PURCHASE_VALUE: 5256.78,
            D7_TOTAL_BET_PLACED_USER: 440,
            D7_SPORTS_BET_PLACED_USER: 245,
            D7_GAMES_BET_PLACED_USER: 273,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 22389.62,
            D7_GAMES_BET_FLOW: 14397.66,
            D7_TOTAL_BET_FLOW: 36787.27,

            // 留存
            D1_retained_users: 352,
            D7_retained_users: 102,
          },

          {
            date: "2025-09-22", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1593,
            D0_unique_purchase: 524,
            D0_PURCHASE_VALUE: 653.44,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 487,
            D0_SPORTS_BET_PLACED_USER: 305,
            D0_GAMES_BET_PLACED_USER: 274,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 161.19,
            D0_GAMES_BET_FLOW: 4069.62,
            D0_TOTAL_BET_FLOW: 4230.81,

            // 付费 & 投注（D7）
            D7_unique_purchase: 671,
            D7_PURCHASE_VALUE: 2682.26,
            D7_TOTAL_BET_PLACED_USER: 692,
            D7_SPORTS_BET_PLACED_USER: 484,
            D7_GAMES_BET_PLACED_USER: 418,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 865.52,
            D7_GAMES_BET_FLOW: 38635.18,
            D7_TOTAL_BET_FLOW: 39500.7,

            // 留存
            D1_retained_users: 595,
            D7_retained_users: 158,
          },

          {
            date: "2025-09-22", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 587,
            D0_unique_purchase: 219,
            D0_PURCHASE_VALUE: 261.01,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 209,
            D0_SPORTS_BET_PLACED_USER: 97,
            D0_GAMES_BET_PLACED_USER: 146,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 39.73,
            D0_GAMES_BET_FLOW: 941.61,
            D0_TOTAL_BET_FLOW: 981.34,

            // 付费 & 投注（D7）
            D7_unique_purchase: 294,
            D7_PURCHASE_VALUE: 1003.78,
            D7_TOTAL_BET_PLACED_USER: 299,
            D7_SPORTS_BET_PLACED_USER: 171,
            D7_GAMES_BET_PLACED_USER: 212,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 217.22,
            D7_GAMES_BET_FLOW: 4379.78,
            D7_TOTAL_BET_FLOW: 4597.0,

            // 留存
            D1_retained_users: 236,
            D7_retained_users: 55,
          },

          {
            date: "2025-09-22", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 131,
            D0_unique_purchase: 38,
            D0_PURCHASE_VALUE: 83.68,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 37,
            D0_SPORTS_BET_PLACED_USER: 25,
            D0_GAMES_BET_PLACED_USER: 16,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 68.23,
            D0_GAMES_BET_FLOW: 180.82,
            D0_TOTAL_BET_FLOW: 249.06,

            // 付费 & 投注（D7）
            D7_unique_purchase: 51,
            D7_PURCHASE_VALUE: 172.76,
            D7_TOTAL_BET_PLACED_USER: 57,
            D7_SPORTS_BET_PLACED_USER: 43,
            D7_GAMES_BET_PLACED_USER: 26,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 180.25,
            D7_GAMES_BET_FLOW: 719.48,
            D7_TOTAL_BET_FLOW: 899.73,

            // 留存
            D1_retained_users: 53,
            D7_retained_users: 17,
          },

          {
            date: "2025-09-23", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 415,
            D0_unique_purchase: 214,
            D0_PURCHASE_VALUE: 697.38,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 202,
            D0_SPORTS_BET_PLACED_USER: 137,
            D0_GAMES_BET_PLACED_USER: 105,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 158.74,
            D0_GAMES_BET_FLOW: 4680.31,
            D0_TOTAL_BET_FLOW: 4839.05,

            // 付费 & 投注（D7）
            D7_unique_purchase: 260,
            D7_PURCHASE_VALUE: 3219.69,
            D7_TOTAL_BET_PLACED_USER: 264,
            D7_SPORTS_BET_PLACED_USER: 189,
            D7_GAMES_BET_PLACED_USER: 153,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 545.78,
            D7_GAMES_BET_FLOW: 18617.83,
            D7_TOTAL_BET_FLOW: 19163.61,

            // 留存
            D1_retained_users: 184,
            D7_retained_users: 74,
          },

          {
            date: "2025-09-23", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1157,
            D0_unique_purchase: 277,
            D0_PURCHASE_VALUE: 460.84,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 345,
            D0_SPORTS_BET_PLACED_USER: 174,
            D0_GAMES_BET_PLACED_USER: 201,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 89.57,
            D0_GAMES_BET_FLOW: 1884.31,
            D0_TOTAL_BET_FLOW: 1973.89,

            // 付费 & 投注（D7）
            D7_unique_purchase: 397,
            D7_PURCHASE_VALUE: 1092.44,
            D7_TOTAL_BET_PLACED_USER: 582,
            D7_SPORTS_BET_PLACED_USER: 372,
            D7_GAMES_BET_PLACED_USER: 303,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 232.08,
            D7_GAMES_BET_FLOW: 5357.63,
            D7_TOTAL_BET_FLOW: 5589.71,

            // 留存
            D1_retained_users: 348,
            D7_retained_users: 80,
          },

          {
            date: "2025-09-23", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1674,
            D0_unique_purchase: 599,
            D0_PURCHASE_VALUE: 1371.9,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 551,
            D0_SPORTS_BET_PLACED_USER: 341,
            D0_GAMES_BET_PLACED_USER: 316,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 626.85,
            D0_GAMES_BET_FLOW: 7009.83,
            D0_TOTAL_BET_FLOW: 7636.69,

            // 付费 & 投注（D7）
            D7_unique_purchase: 757,
            D7_PURCHASE_VALUE: 7551.59,
            D7_TOTAL_BET_PLACED_USER: 766,
            D7_SPORTS_BET_PLACED_USER: 521,
            D7_GAMES_BET_PLACED_USER: 481,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 8133.03,
            D7_GAMES_BET_FLOW: 29400.83,
            D7_TOTAL_BET_FLOW: 37533.86,

            // 留存
            D1_retained_users: 620,
            D7_retained_users: 190,
          },

          {
            date: "2025-09-23", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 699,
            D0_unique_purchase: 228,
            D0_PURCHASE_VALUE: 528.56,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 222,
            D0_SPORTS_BET_PLACED_USER: 119,
            D0_GAMES_BET_PLACED_USER: 142,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 94.3,
            D0_GAMES_BET_FLOW: 2042.78,
            D0_TOTAL_BET_FLOW: 2137.07,

            // 付费 & 投注（D7）
            D7_unique_purchase: 303,
            D7_PURCHASE_VALUE: 2837.07,
            D7_TOTAL_BET_PLACED_USER: 306,
            D7_SPORTS_BET_PLACED_USER: 188,
            D7_GAMES_BET_PLACED_USER: 209,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 502.13,
            D7_GAMES_BET_FLOW: 10245.59,
            D7_TOTAL_BET_FLOW: 10747.72,

            // 留存
            D1_retained_users: 297,
            D7_retained_users: 88,
          },

          {
            date: "2025-09-23", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 120,
            D0_unique_purchase: 52,
            D0_PURCHASE_VALUE: 106.64,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 52,
            D0_SPORTS_BET_PLACED_USER: 40,
            D0_GAMES_BET_PLACED_USER: 23,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 53.11,
            D0_GAMES_BET_FLOW: 310.59,
            D0_TOTAL_BET_FLOW: 363.69,

            // 付费 & 投注（D7）
            D7_unique_purchase: 59,
            D7_PURCHASE_VALUE: 239.28,
            D7_TOTAL_BET_PLACED_USER: 66,
            D7_SPORTS_BET_PLACED_USER: 57,
            D7_GAMES_BET_PLACED_USER: 29,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 160.68,
            D7_GAMES_BET_FLOW: 853.02,
            D7_TOTAL_BET_FLOW: 1013.71,

            // 留存
            D1_retained_users: 61,
            D7_retained_users: 21,
          },

          {
            date: "2025-09-24", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 398,
            D0_unique_purchase: 209,
            D0_PURCHASE_VALUE: 1575.85,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 201,
            D0_SPORTS_BET_PLACED_USER: 137,
            D0_GAMES_BET_PLACED_USER: 102,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 472.38,
            D0_GAMES_BET_FLOW: 1226.41,
            D0_TOTAL_BET_FLOW: 1698.79,

            // 付费 & 投注（D7）
            D7_unique_purchase: 248,
            D7_PURCHASE_VALUE: 2773.38,
            D7_TOTAL_BET_PLACED_USER: 251,
            D7_SPORTS_BET_PLACED_USER: 188,
            D7_GAMES_BET_PLACED_USER: 161,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 922.75,
            D7_GAMES_BET_FLOW: 5006.14,
            D7_TOTAL_BET_FLOW: 5928.89,

            // 留存
            D1_retained_users: 178,
            D7_retained_users: 74,
          },

          {
            date: "2025-09-24", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 983,
            D0_unique_purchase: 216,
            D0_PURCHASE_VALUE: 578.71,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 218,
            D0_SPORTS_BET_PLACED_USER: 74,
            D0_GAMES_BET_PLACED_USER: 179,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 21.59,
            D0_GAMES_BET_FLOW: 6792.9,
            D0_TOTAL_BET_FLOW: 6814.49,

            // 付费 & 投注（D7）
            D7_unique_purchase: 337,
            D7_PURCHASE_VALUE: 1903.79,
            D7_TOTAL_BET_PLACED_USER: 430,
            D7_SPORTS_BET_PLACED_USER: 263,
            D7_GAMES_BET_PLACED_USER: 258,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 184.26,
            D7_GAMES_BET_FLOW: 17712.16,
            D7_TOTAL_BET_FLOW: 17896.42,

            // 留存
            D1_retained_users: 382,
            D7_retained_users: 92,
          },

          {
            date: "2025-09-24", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1740,
            D0_unique_purchase: 587,
            D0_PURCHASE_VALUE: 1314.13,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 541,
            D0_SPORTS_BET_PLACED_USER: 351,
            D0_GAMES_BET_PLACED_USER: 317,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 813.62,
            D0_GAMES_BET_FLOW: 2763.34,
            D0_TOTAL_BET_FLOW: 3576.97,

            // 付费 & 投注（D7）
            D7_unique_purchase: 747,
            D7_PURCHASE_VALUE: 4019.99,
            D7_TOTAL_BET_PLACED_USER: 747,
            D7_SPORTS_BET_PLACED_USER: 523,
            D7_GAMES_BET_PLACED_USER: 471,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 3006.09,
            D7_GAMES_BET_FLOW: 18886.59,
            D7_TOTAL_BET_FLOW: 21892.68,

            // 留存
            D1_retained_users: 634,
            D7_retained_users: 169,
          },

          {
            date: "2025-09-24", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 841,
            D0_unique_purchase: 250,
            D0_PURCHASE_VALUE: 355.36,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 248,
            D0_SPORTS_BET_PLACED_USER: 132,
            D0_GAMES_BET_PLACED_USER: 164,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 121.26,
            D0_GAMES_BET_FLOW: 1354.13,
            D0_TOTAL_BET_FLOW: 1475.38,

            // 付费 & 投注（D7）
            D7_unique_purchase: 380,
            D7_PURCHASE_VALUE: 1059.38,
            D7_TOTAL_BET_PLACED_USER: 402,
            D7_SPORTS_BET_PLACED_USER: 286,
            D7_GAMES_BET_PLACED_USER: 224,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 354.29,
            D7_GAMES_BET_FLOW: 4706.33,
            D7_TOTAL_BET_FLOW: 5060.61,

            // 留存
            D1_retained_users: 267,
            D7_retained_users: 105,
          },

          {
            date: "2025-09-24", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 123,
            D0_unique_purchase: 46,
            D0_PURCHASE_VALUE: 101.81,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 44,
            D0_SPORTS_BET_PLACED_USER: 30,
            D0_GAMES_BET_PLACED_USER: 27,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 29.71,
            D0_GAMES_BET_FLOW: 446.38,
            D0_TOTAL_BET_FLOW: 476.08,

            // 付费 & 投注（D7）
            D7_unique_purchase: 60,
            D7_PURCHASE_VALUE: 235.11,
            D7_TOTAL_BET_PLACED_USER: 63,
            D7_SPORTS_BET_PLACED_USER: 51,
            D7_GAMES_BET_PLACED_USER: 37,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 76.88,
            D7_GAMES_BET_FLOW: 1139.19,
            D7_TOTAL_BET_FLOW: 1216.07,

            // 留存
            D1_retained_users: 47,
            D7_retained_users: 18,
          },

          {
            date: "2025-09-25", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 402,
            D0_unique_purchase: 204,
            D0_PURCHASE_VALUE: 590.54,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 204,
            D0_SPORTS_BET_PLACED_USER: 145,
            D0_GAMES_BET_PLACED_USER: 106,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 143.47,
            D0_GAMES_BET_FLOW: 1801.38,
            D0_TOTAL_BET_FLOW: 1944.85,

            // 付费 & 投注（D7）
            D7_unique_purchase: 246,
            D7_PURCHASE_VALUE: 1725.92,
            D7_TOTAL_BET_PLACED_USER: 259,
            D7_SPORTS_BET_PLACED_USER: 199,
            D7_GAMES_BET_PLACED_USER: 152,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 706.03,
            D7_GAMES_BET_FLOW: 6758.22,
            D7_TOTAL_BET_FLOW: 7464.25,

            // 留存
            D1_retained_users: 189,
            D7_retained_users: 64,
          },

          {
            date: "2025-09-25", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 876,
            D0_unique_purchase: 341,
            D0_PURCHASE_VALUE: 411.2,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 286,
            D0_SPORTS_BET_PLACED_USER: 117,
            D0_GAMES_BET_PLACED_USER: 208,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 57.25,
            D0_GAMES_BET_FLOW: 1386.27,
            D0_TOTAL_BET_FLOW: 1443.52,

            // 付费 & 投注（D7）
            D7_unique_purchase: 405,
            D7_PURCHASE_VALUE: 2443.45,
            D7_TOTAL_BET_PLACED_USER: 438,
            D7_SPORTS_BET_PLACED_USER: 255,
            D7_GAMES_BET_PLACED_USER: 281,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 142.98,
            D7_GAMES_BET_FLOW: 8057.98,
            D7_TOTAL_BET_FLOW: 8200.97,

            // 留存
            D1_retained_users: 348,
            D7_retained_users: 126,
          },

          {
            date: "2025-09-25", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1917,
            D0_unique_purchase: 676,
            D0_PURCHASE_VALUE: 954.69,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 644,
            D0_SPORTS_BET_PLACED_USER: 430,
            D0_GAMES_BET_PLACED_USER: 352,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 421.56,
            D0_GAMES_BET_FLOW: 2503.49,
            D0_TOTAL_BET_FLOW: 2925.05,

            // 付费 & 投注（D7）
            D7_unique_purchase: 874,
            D7_PURCHASE_VALUE: 6431.43,
            D7_TOTAL_BET_PLACED_USER: 891,
            D7_SPORTS_BET_PLACED_USER: 642,
            D7_GAMES_BET_PLACED_USER: 509,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 21972.65,
            D7_GAMES_BET_FLOW: 8859.34,
            D7_TOTAL_BET_FLOW: 30831.99,

            // 留存
            D1_retained_users: 764,
            D7_retained_users: 192,
          },

          {
            date: "2025-09-25", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 624,
            D0_unique_purchase: 231,
            D0_PURCHASE_VALUE: 396.43,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 264,
            D0_SPORTS_BET_PLACED_USER: 162,
            D0_GAMES_BET_PLACED_USER: 155,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 82.93,
            D0_GAMES_BET_FLOW: 1783.41,
            D0_TOTAL_BET_FLOW: 1866.34,

            // 付费 & 投注（D7）
            D7_unique_purchase: 325,
            D7_PURCHASE_VALUE: 1306.94,
            D7_TOTAL_BET_PLACED_USER: 339,
            D7_SPORTS_BET_PLACED_USER: 227,
            D7_GAMES_BET_PLACED_USER: 236,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 300.9,
            D7_GAMES_BET_FLOW: 7538.26,
            D7_TOTAL_BET_FLOW: 7839.17,

            // 留存
            D1_retained_users: 310,
            D7_retained_users: 79,
          },

          {
            date: "2025-09-25", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 107,
            D0_unique_purchase: 45,
            D0_PURCHASE_VALUE: 134.02,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 49,
            D0_SPORTS_BET_PLACED_USER: 38,
            D0_GAMES_BET_PLACED_USER: 17,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 65.24,
            D0_GAMES_BET_FLOW: 331.96,
            D0_TOTAL_BET_FLOW: 397.21,

            // 付费 & 投注（D7）
            D7_unique_purchase: 55,
            D7_PURCHASE_VALUE: 278.17,
            D7_TOTAL_BET_PLACED_USER: 62,
            D7_SPORTS_BET_PLACED_USER: 51,
            D7_GAMES_BET_PLACED_USER: 28,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 231.06,
            D7_GAMES_BET_FLOW: 672.08,
            D7_TOTAL_BET_FLOW: 903.15,

            // 留存
            D1_retained_users: 47,
            D7_retained_users: 29,
          },

          {
            date: "2025-09-26", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 328,
            D0_unique_purchase: 171,
            D0_PURCHASE_VALUE: 491.15,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 166,
            D0_SPORTS_BET_PLACED_USER: 100,
            D0_GAMES_BET_PLACED_USER: 110,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 57.06,
            D0_GAMES_BET_FLOW: 1688.81,
            D0_TOTAL_BET_FLOW: 1745.88,

            // 付费 & 投注（D7）
            D7_unique_purchase: 198,
            D7_PURCHASE_VALUE: 1986.23,
            D7_TOTAL_BET_PLACED_USER: 198,
            D7_SPORTS_BET_PLACED_USER: 137,
            D7_GAMES_BET_PLACED_USER: 150,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 293.98,
            D7_GAMES_BET_FLOW: 8333.86,
            D7_TOTAL_BET_FLOW: 8627.84,

            // 留存
            D1_retained_users: 180,
            D7_retained_users: 53,
          },

          {
            date: "2025-09-26", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 852,
            D0_unique_purchase: 319,
            D0_PURCHASE_VALUE: 387.05,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 329,
            D0_SPORTS_BET_PLACED_USER: 138,
            D0_GAMES_BET_PLACED_USER: 240,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 83.98,
            D0_GAMES_BET_FLOW: 1832.07,
            D0_TOTAL_BET_FLOW: 1916.05,

            // 付费 & 投注（D7）
            D7_unique_purchase: 403,
            D7_PURCHASE_VALUE: 1202.52,
            D7_TOTAL_BET_PLACED_USER: 440,
            D7_SPORTS_BET_PLACED_USER: 224,
            D7_GAMES_BET_PLACED_USER: 318,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 165.87,
            D7_GAMES_BET_FLOW: 6160.46,
            D7_TOTAL_BET_FLOW: 6326.34,

            // 留存
            D1_retained_users: 377,
            D7_retained_users: 93,
          },

          {
            date: "2025-09-26", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1799,
            D0_unique_purchase: 643,
            D0_PURCHASE_VALUE: 1283.98,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 604,
            D0_SPORTS_BET_PLACED_USER: 374,
            D0_GAMES_BET_PLACED_USER: 367,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 281.56,
            D0_GAMES_BET_FLOW: 3823.5,
            D0_TOTAL_BET_FLOW: 4105.06,

            // 付费 & 投注（D7）
            D7_unique_purchase: 833,
            D7_PURCHASE_VALUE: 4040.72,
            D7_TOTAL_BET_PLACED_USER: 852,
            D7_SPORTS_BET_PLACED_USER: 589,
            D7_GAMES_BET_PLACED_USER: 527,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 940.48,
            D7_GAMES_BET_FLOW: 15008.93,
            D7_TOTAL_BET_FLOW: 15949.4,

            // 留存
            D1_retained_users: 751,
            D7_retained_users: 194,
          },

          {
            date: "2025-09-26", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 933,
            D0_unique_purchase: 241,
            D0_PURCHASE_VALUE: 466.15,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 226,
            D0_SPORTS_BET_PLACED_USER: 114,
            D0_GAMES_BET_PLACED_USER: 158,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 71.05,
            D0_GAMES_BET_FLOW: 4112.67,
            D0_TOTAL_BET_FLOW: 4183.72,

            // 付费 & 投注（D7）
            D7_unique_purchase: 410,
            D7_PURCHASE_VALUE: 1487.38,
            D7_TOTAL_BET_PLACED_USER: 415,
            D7_SPORTS_BET_PLACED_USER: 266,
            D7_GAMES_BET_PLACED_USER: 233,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 286.3,
            D7_GAMES_BET_FLOW: 9945.28,
            D7_TOTAL_BET_FLOW: 10231.58,

            // 留存
            D1_retained_users: 264,
            D7_retained_users: 74,
          },

          {
            date: "2025-09-26", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 182,
            D0_unique_purchase: 66,
            D0_PURCHASE_VALUE: 188.36,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 65,
            D0_SPORTS_BET_PLACED_USER: 50,
            D0_GAMES_BET_PLACED_USER: 34,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 38.26,
            D0_GAMES_BET_FLOW: 858.44,
            D0_TOTAL_BET_FLOW: 896.7,

            // 付费 & 投注（D7）
            D7_unique_purchase: 81,
            D7_PURCHASE_VALUE: 1000.4,
            D7_TOTAL_BET_PLACED_USER: 95,
            D7_SPORTS_BET_PLACED_USER: 74,
            D7_GAMES_BET_PLACED_USER: 50,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 170.03,
            D7_GAMES_BET_FLOW: 3758.21,
            D7_TOTAL_BET_FLOW: 3928.24,

            // 留存
            D1_retained_users: 69,
            D7_retained_users: 32,
          },

          {
            date: "2025-09-27", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 396,
            D0_unique_purchase: 202,
            D0_PURCHASE_VALUE: 1259.77,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 193,
            D0_SPORTS_BET_PLACED_USER: 129,
            D0_GAMES_BET_PLACED_USER: 104,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 753.09,
            D0_GAMES_BET_FLOW: 3048.05,
            D0_TOTAL_BET_FLOW: 3801.14,

            // 付费 & 投注（D7）
            D7_unique_purchase: 254,
            D7_PURCHASE_VALUE: 2778.38,
            D7_TOTAL_BET_PLACED_USER: 253,
            D7_SPORTS_BET_PLACED_USER: 176,
            D7_GAMES_BET_PLACED_USER: 168,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2261.11,
            D7_GAMES_BET_FLOW: 11398.59,
            D7_TOTAL_BET_FLOW: 13659.7,

            // 留存
            D1_retained_users: 189,
            D7_retained_users: 88,
          },

          {
            date: "2025-09-27", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1059,
            D0_unique_purchase: 493,
            D0_PURCHASE_VALUE: 1185.23,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 493,
            D0_SPORTS_BET_PLACED_USER: 231,
            D0_GAMES_BET_PLACED_USER: 343,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 170.88,
            D0_GAMES_BET_FLOW: 7000.62,
            D0_TOTAL_BET_FLOW: 7171.5,

            // 付费 & 投注（D7）
            D7_unique_purchase: 572,
            D7_PURCHASE_VALUE: 7559.41,
            D7_TOTAL_BET_PLACED_USER: 604,
            D7_SPORTS_BET_PLACED_USER: 329,
            D7_GAMES_BET_PLACED_USER: 451,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 11354.77,
            D7_GAMES_BET_FLOW: 15204.07,
            D7_TOTAL_BET_FLOW: 26558.83,

            // 留存
            D1_retained_users: 434,
            D7_retained_users: 152,
          },

          {
            date: "2025-09-27", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1762,
            D0_unique_purchase: 647,
            D0_PURCHASE_VALUE: 1544.4,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 589,
            D0_SPORTS_BET_PLACED_USER: 399,
            D0_GAMES_BET_PLACED_USER: 314,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 1978.51,
            D0_GAMES_BET_FLOW: 5931.31,
            D0_TOTAL_BET_FLOW: 7909.81,

            // 付费 & 投注（D7）
            D7_unique_purchase: 805,
            D7_PURCHASE_VALUE: 3528.22,
            D7_TOTAL_BET_PLACED_USER: 811,
            D7_SPORTS_BET_PLACED_USER: 588,
            D7_GAMES_BET_PLACED_USER: 470,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2398.78,
            D7_GAMES_BET_FLOW: 15974.71,
            D7_TOTAL_BET_FLOW: 18373.49,

            // 留存
            D1_retained_users: 662,
            D7_retained_users: 197,
          },

          {
            date: "2025-09-27", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 759,
            D0_unique_purchase: 283,
            D0_PURCHASE_VALUE: 555.44,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 279,
            D0_SPORTS_BET_PLACED_USER: 165,
            D0_GAMES_BET_PLACED_USER: 153,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 133.49,
            D0_GAMES_BET_FLOW: 4262.66,
            D0_TOTAL_BET_FLOW: 4396.15,

            // 付费 & 投注（D7）
            D7_unique_purchase: 385,
            D7_PURCHASE_VALUE: 2160.02,
            D7_TOTAL_BET_PLACED_USER: 387,
            D7_SPORTS_BET_PLACED_USER: 259,
            D7_GAMES_BET_PLACED_USER: 223,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 648.96,
            D7_GAMES_BET_FLOW: 21778.9,
            D7_TOTAL_BET_FLOW: 22427.86,

            // 留存
            D1_retained_users: 316,
            D7_retained_users: 98,
          },

          {
            date: "2025-09-27", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 154,
            D0_unique_purchase: 75,
            D0_PURCHASE_VALUE: 211.83,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 76,
            D0_SPORTS_BET_PLACED_USER: 60,
            D0_GAMES_BET_PLACED_USER: 31,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 105.9,
            D0_GAMES_BET_FLOW: 502.84,
            D0_TOTAL_BET_FLOW: 608.75,

            // 付费 & 投注（D7）
            D7_unique_purchase: 89,
            D7_PURCHASE_VALUE: 585.27,
            D7_TOTAL_BET_PLACED_USER: 95,
            D7_SPORTS_BET_PLACED_USER: 82,
            D7_GAMES_BET_PLACED_USER: 44,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 359.29,
            D7_GAMES_BET_FLOW: 1631.55,
            D7_TOTAL_BET_FLOW: 1990.84,

            // 留存
            D1_retained_users: 78,
            D7_retained_users: 43,
          },

          {
            date: "2025-09-28", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 378,
            D0_unique_purchase: 184,
            D0_PURCHASE_VALUE: 584.85,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 180,
            D0_SPORTS_BET_PLACED_USER: 124,
            D0_GAMES_BET_PLACED_USER: 108,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 108.48,
            D0_GAMES_BET_FLOW: 1583.22,
            D0_TOTAL_BET_FLOW: 1691.7,

            // 付费 & 投注（D7）
            D7_unique_purchase: 231,
            D7_PURCHASE_VALUE: 5227.15,
            D7_TOTAL_BET_PLACED_USER: 235,
            D7_SPORTS_BET_PLACED_USER: 171,
            D7_GAMES_BET_PLACED_USER: 156,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2839.67,
            D7_GAMES_BET_FLOW: 13811.25,
            D7_TOTAL_BET_FLOW: 16650.92,

            // 留存
            D1_retained_users: 177,
            D7_retained_users: 88,
          },

          {
            date: "2025-09-28", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 933,
            D0_unique_purchase: 309,
            D0_PURCHASE_VALUE: 728.47,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 297,
            D0_SPORTS_BET_PLACED_USER: 117,
            D0_GAMES_BET_PLACED_USER: 232,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 54.82,
            D0_GAMES_BET_FLOW: 10453.23,
            D0_TOTAL_BET_FLOW: 10508.05,

            // 付费 & 投注（D7）
            D7_unique_purchase: 457,
            D7_PURCHASE_VALUE: 2003.75,
            D7_TOTAL_BET_PLACED_USER: 505,
            D7_SPORTS_BET_PLACED_USER: 307,
            D7_GAMES_BET_PLACED_USER: 305,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 174.98,
            D7_GAMES_BET_FLOW: 22476.5,
            D7_TOTAL_BET_FLOW: 22651.49,

            // 留存
            D1_retained_users: 347,
            D7_retained_users: 189,
          },

          {
            date: "2025-09-28", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 2013,
            D0_unique_purchase: 701,
            D0_PURCHASE_VALUE: 1168.59,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 630,
            D0_SPORTS_BET_PLACED_USER: 397,
            D0_GAMES_BET_PLACED_USER: 366,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 1048.78,
            D0_GAMES_BET_FLOW: 2566.82,
            D0_TOTAL_BET_FLOW: 3615.6,

            // 付费 & 投注（D7）
            D7_unique_purchase: 901,
            D7_PURCHASE_VALUE: 5970.66,
            D7_TOTAL_BET_PLACED_USER: 893,
            D7_SPORTS_BET_PLACED_USER: 612,
            D7_GAMES_BET_PLACED_USER: 545,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 4751.76,
            D7_GAMES_BET_FLOW: 15270.01,
            D7_TOTAL_BET_FLOW: 20021.77,

            // 留存
            D1_retained_users: 643,
            D7_retained_users: 199,
          },

          {
            date: "2025-09-28", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 578,
            D0_unique_purchase: 230,
            D0_PURCHASE_VALUE: 410.59,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 218,
            D0_SPORTS_BET_PLACED_USER: 129,
            D0_GAMES_BET_PLACED_USER: 147,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 79.36,
            D0_GAMES_BET_FLOW: 1031.53,
            D0_TOTAL_BET_FLOW: 1110.89,

            // 付费 & 投注（D7）
            D7_unique_purchase: 300,
            D7_PURCHASE_VALUE: 1344.3,
            D7_TOTAL_BET_PLACED_USER: 304,
            D7_SPORTS_BET_PLACED_USER: 205,
            D7_GAMES_BET_PLACED_USER: 203,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 324.87,
            D7_GAMES_BET_FLOW: 4803.96,
            D7_TOTAL_BET_FLOW: 5128.83,

            // 留存
            D1_retained_users: 251,
            D7_retained_users: 89,
          },

          {
            date: "2025-09-28", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 148,
            D0_unique_purchase: 58,
            D0_PURCHASE_VALUE: 113.3,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 61,
            D0_SPORTS_BET_PLACED_USER: 41,
            D0_GAMES_BET_PLACED_USER: 31,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 51.6,
            D0_GAMES_BET_FLOW: 229.5,
            D0_TOTAL_BET_FLOW: 281.1,

            // 付费 & 投注（D7）
            D7_unique_purchase: 71,
            D7_PURCHASE_VALUE: 288.46,
            D7_TOTAL_BET_PLACED_USER: 84,
            D7_SPORTS_BET_PLACED_USER: 61,
            D7_GAMES_BET_PLACED_USER: 46,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 162.42,
            D7_GAMES_BET_FLOW: 631.25,
            D7_TOTAL_BET_FLOW: 793.67,

            // 留存
            D1_retained_users: 55,
            D7_retained_users: 31,
          },

          {
            date: "2025-09-29", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 371,
            D0_unique_purchase: 177,
            D0_PURCHASE_VALUE: 591.38,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 170,
            D0_SPORTS_BET_PLACED_USER: 115,
            D0_GAMES_BET_PLACED_USER: 84,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 171.23,
            D0_GAMES_BET_FLOW: 2647.24,
            D0_TOTAL_BET_FLOW: 2818.47,

            // 付费 & 投注（D7）
            D7_unique_purchase: 222,
            D7_PURCHASE_VALUE: 2085.85,
            D7_TOTAL_BET_PLACED_USER: 226,
            D7_SPORTS_BET_PLACED_USER: 168,
            D7_GAMES_BET_PLACED_USER: 132,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 545.88,
            D7_GAMES_BET_FLOW: 8175.63,
            D7_TOTAL_BET_FLOW: 8721.51,

            // 留存
            D1_retained_users: 182,
            D7_retained_users: 53,
          },

          {
            date: "2025-09-29", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1062,
            D0_unique_purchase: 290,
            D0_PURCHASE_VALUE: 1502.43,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 285,
            D0_SPORTS_BET_PLACED_USER: 93,
            D0_GAMES_BET_PLACED_USER: 238,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 729.63,
            D0_GAMES_BET_FLOW: 3903.57,
            D0_TOTAL_BET_FLOW: 4633.2,

            // 付费 & 投注（D7）
            D7_unique_purchase: 384,
            D7_PURCHASE_VALUE: 3948.47,
            D7_TOTAL_BET_PLACED_USER: 525,
            D7_SPORTS_BET_PLACED_USER: 304,
            D7_GAMES_BET_PLACED_USER: 317,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 15499.53,
            D7_GAMES_BET_FLOW: 7325.5,
            D7_TOTAL_BET_FLOW: 22825.04,

            // 留存
            D1_retained_users: 316,
            D7_retained_users: 73,
          },

          {
            date: "2025-09-29", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1609,
            D0_unique_purchase: 607,
            D0_PURCHASE_VALUE: 1472.7,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 568,
            D0_SPORTS_BET_PLACED_USER: 359,
            D0_GAMES_BET_PLACED_USER: 338,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 1329.03,
            D0_GAMES_BET_FLOW: 3922.04,
            D0_TOTAL_BET_FLOW: 5251.06,

            // 付费 & 投注（D7）
            D7_unique_purchase: 790,
            D7_PURCHASE_VALUE: 4457.96,
            D7_TOTAL_BET_PLACED_USER: 781,
            D7_SPORTS_BET_PLACED_USER: 534,
            D7_GAMES_BET_PLACED_USER: 484,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2456.22,
            D7_GAMES_BET_FLOW: 18161.91,
            D7_TOTAL_BET_FLOW: 20618.13,

            // 留存
            D1_retained_users: 617,
            D7_retained_users: 162,
          },

          {
            date: "2025-09-29", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 633,
            D0_unique_purchase: 220,
            D0_PURCHASE_VALUE: 338.95,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 217,
            D0_SPORTS_BET_PLACED_USER: 136,
            D0_GAMES_BET_PLACED_USER: 128,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 83.8,
            D0_GAMES_BET_FLOW: 989.81,
            D0_TOTAL_BET_FLOW: 1073.61,

            // 付费 & 投注（D7）
            D7_unique_purchase: 318,
            D7_PURCHASE_VALUE: 1048.28,
            D7_TOTAL_BET_PLACED_USER: 330,
            D7_SPORTS_BET_PLACED_USER: 200,
            D7_GAMES_BET_PLACED_USER: 214,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 430.18,
            D7_GAMES_BET_FLOW: 3115.79,
            D7_TOTAL_BET_FLOW: 3545.97,

            // 留存
            D1_retained_users: 253,
            D7_retained_users: 71,
          },

          {
            date: "2025-09-29", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 153,
            D0_unique_purchase: 35,
            D0_PURCHASE_VALUE: 246.31,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 37,
            D0_SPORTS_BET_PLACED_USER: 25,
            D0_GAMES_BET_PLACED_USER: 19,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 8.66,
            D0_GAMES_BET_FLOW: 584.45,
            D0_TOTAL_BET_FLOW: 593.12,

            // 付费 & 投注（D7）
            D7_unique_purchase: 55,
            D7_PURCHASE_VALUE: 482.3,
            D7_TOTAL_BET_PLACED_USER: 59,
            D7_SPORTS_BET_PLACED_USER: 49,
            D7_GAMES_BET_PLACED_USER: 25,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 106.22,
            D7_GAMES_BET_FLOW: 1177.63,
            D7_TOTAL_BET_FLOW: 1283.86,

            // 留存
            D1_retained_users: 73,
            D7_retained_users: 11,
          },

          {
            date: "2025-09-30", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 411,
            D0_unique_purchase: 206,
            D0_PURCHASE_VALUE: 328.84,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 194,
            D0_SPORTS_BET_PLACED_USER: 126,
            D0_GAMES_BET_PLACED_USER: 99,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 292.72,
            D0_GAMES_BET_FLOW: 821.23,
            D0_TOTAL_BET_FLOW: 1113.95,

            // 付费 & 投注（D7）
            D7_unique_purchase: 239,
            D7_PURCHASE_VALUE: 1535.54,
            D7_TOTAL_BET_PLACED_USER: 233,
            D7_SPORTS_BET_PLACED_USER: 167,
            D7_GAMES_BET_PLACED_USER: 137,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2769.6,
            D7_GAMES_BET_FLOW: 4170.7,
            D7_TOTAL_BET_FLOW: 6940.3,

            // 留存
            D1_retained_users: 166,
            D7_retained_users: 62,
          },

          {
            date: "2025-09-30", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1097,
            D0_unique_purchase: 300,
            D0_PURCHASE_VALUE: 625.14,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 296,
            D0_SPORTS_BET_PLACED_USER: 108,
            D0_GAMES_BET_PLACED_USER: 223,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 28.69,
            D0_GAMES_BET_FLOW: 2063.63,
            D0_TOTAL_BET_FLOW: 2092.32,

            // 付费 & 投注（D7）
            D7_unique_purchase: 384,
            D7_PURCHASE_VALUE: 1388.5,
            D7_TOTAL_BET_PLACED_USER: 531,
            D7_SPORTS_BET_PLACED_USER: 311,
            D7_GAMES_BET_PLACED_USER: 308,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 167.17,
            D7_GAMES_BET_FLOW: 6337.06,
            D7_TOTAL_BET_FLOW: 6504.23,

            // 留存
            D1_retained_users: 392,
            D7_retained_users: 75,
          },

          {
            date: "2025-09-30", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1850,
            D0_unique_purchase: 678,
            D0_PURCHASE_VALUE: 805.47,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 630,
            D0_SPORTS_BET_PLACED_USER: 409,
            D0_GAMES_BET_PLACED_USER: 369,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 231.58,
            D0_GAMES_BET_FLOW: 3169.64,
            D0_TOTAL_BET_FLOW: 3401.21,

            // 付费 & 投注（D7）
            D7_unique_purchase: 850,
            D7_PURCHASE_VALUE: 2454.6,
            D7_TOTAL_BET_PLACED_USER: 846,
            D7_SPORTS_BET_PLACED_USER: 586,
            D7_GAMES_BET_PLACED_USER: 523,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1545.29,
            D7_GAMES_BET_FLOW: 7392.75,
            D7_TOTAL_BET_FLOW: 8938.03,

            // 留存
            D1_retained_users: 687,
            D7_retained_users: 150,
          },

          {
            date: "2025-09-30", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 807,
            D0_unique_purchase: 311,
            D0_PURCHASE_VALUE: 531.29,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 293,
            D0_SPORTS_BET_PLACED_USER: 172,
            D0_GAMES_BET_PLACED_USER: 186,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 116.47,
            D0_GAMES_BET_FLOW: 1206.39,
            D0_TOTAL_BET_FLOW: 1322.86,

            // 付费 & 投注（D7）
            D7_unique_purchase: 396,
            D7_PURCHASE_VALUE: 1266.5,
            D7_TOTAL_BET_PLACED_USER: 406,
            D7_SPORTS_BET_PLACED_USER: 277,
            D7_GAMES_BET_PLACED_USER: 245,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 349.86,
            D7_GAMES_BET_FLOW: 4288.36,
            D7_TOTAL_BET_FLOW: 4638.22,

            // 留存
            D1_retained_users: 325,
            D7_retained_users: 71,
          },

          {
            date: "2025-09-30", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 167,
            D0_unique_purchase: 71,
            D0_PURCHASE_VALUE: 209.65,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 73,
            D0_SPORTS_BET_PLACED_USER: 62,
            D0_GAMES_BET_PLACED_USER: 32,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 147.75,
            D0_GAMES_BET_FLOW: 787.17,
            D0_TOTAL_BET_FLOW: 934.93,

            // 付费 & 投注（D7）
            D7_unique_purchase: 93,
            D7_PURCHASE_VALUE: 605.42,
            D7_TOTAL_BET_PLACED_USER: 102,
            D7_SPORTS_BET_PLACED_USER: 88,
            D7_GAMES_BET_PLACED_USER: 48,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 579.57,
            D7_GAMES_BET_FLOW: 1519.12,
            D7_TOTAL_BET_FLOW: 2098.69,

            // 留存
            D1_retained_users: 100,
            D7_retained_users: 18,
          },

          // TODO：按同样格式补齐 2025-09-01 的 KE/NG/TZ/UG，
          // 再补 2025-09-02 ~ 2025-09-30 的各国数据
        ],

        "2025-10": [
          {
            date: "2025-10-01", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 423,
            D0_unique_purchase: 223,
            D0_PURCHASE_VALUE: 613.92,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 207,
            D0_SPORTS_BET_PLACED_USER: 152,
            D0_GAMES_BET_PLACED_USER: 98,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 136.63,
            D0_GAMES_BET_FLOW: 2917.15,
            D0_TOTAL_BET_FLOW: 3053.78,

            // 付费 & 投注（D7）
            D7_unique_purchase: 262,
            D7_PURCHASE_VALUE: 1822.38,
            D7_TOTAL_BET_PLACED_USER: 266,
            D7_SPORTS_BET_PLACED_USER: 204,
            D7_GAMES_BET_PLACED_USER: 143,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 458.34,
            D7_GAMES_BET_FLOW: 6317.89,
            D7_TOTAL_BET_FLOW: 6776.23,

            // 留存
            D1_retained_users: 187,
            D7_retained_users: 62,
          },

          {
            date: "2025-10-01", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1108,
            D0_unique_purchase: 356,
            D0_PURCHASE_VALUE: 1952.74,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 358,
            D0_SPORTS_BET_PLACED_USER: 141,
            D0_GAMES_BET_PLACED_USER: 270,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 4655.66,
            D0_GAMES_BET_FLOW: 4170.82,
            D0_TOTAL_BET_FLOW: 8826.49,

            // 付费 & 投注（D7）
            D7_unique_purchase: 444,
            D7_PURCHASE_VALUE: 8491.7,
            D7_TOTAL_BET_PLACED_USER: 552,
            D7_SPORTS_BET_PLACED_USER: 312,
            D7_GAMES_BET_PLACED_USER: 360,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 14236.87,
            D7_GAMES_BET_FLOW: 21481.15,
            D7_TOTAL_BET_FLOW: 35718.02,

            // 留存
            D1_retained_users: 352,
            D7_retained_users: 90,
          },

          {
            date: "2025-10-01", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1871,
            D0_unique_purchase: 689,
            D0_PURCHASE_VALUE: 931.79,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 631,
            D0_SPORTS_BET_PLACED_USER: 403,
            D0_GAMES_BET_PLACED_USER: 360,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 334.39,
            D0_GAMES_BET_FLOW: 2947.08,
            D0_TOTAL_BET_FLOW: 3281.48,

            // 付费 & 投注（D7）
            D7_unique_purchase: 874,
            D7_PURCHASE_VALUE: 2521.91,
            D7_TOTAL_BET_PLACED_USER: 869,
            D7_SPORTS_BET_PLACED_USER: 592,
            D7_GAMES_BET_PLACED_USER: 539,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1077.95,
            D7_GAMES_BET_FLOW: 9801.54,
            D7_TOTAL_BET_FLOW: 10879.49,

            // 留存
            D1_retained_users: 684,
            D7_retained_users: 176,
          },

          {
            date: "2025-10-01", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 757,
            D0_unique_purchase: 227,
            D0_PURCHASE_VALUE: 333.18,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 219,
            D0_SPORTS_BET_PLACED_USER: 149,
            D0_GAMES_BET_PLACED_USER: 120,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 92.44,
            D0_GAMES_BET_FLOW: 851.02,
            D0_TOTAL_BET_FLOW: 943.45,

            // 付费 & 投注（D7）
            D7_unique_purchase: 335,
            D7_PURCHASE_VALUE: 1037.24,
            D7_TOTAL_BET_PLACED_USER: 376,
            D7_SPORTS_BET_PLACED_USER: 273,
            D7_GAMES_BET_PLACED_USER: 222,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 353.73,
            D7_GAMES_BET_FLOW: 3589.62,
            D7_TOTAL_BET_FLOW: 3943.35,

            // 留存
            D1_retained_users: 253,
            D7_retained_users: 98,
          },

          {
            date: "2025-10-01", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 160,
            D0_unique_purchase: 68,
            D0_PURCHASE_VALUE: 131.16,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 66,
            D0_SPORTS_BET_PLACED_USER: 55,
            D0_GAMES_BET_PLACED_USER: 22,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 140.5,
            D0_GAMES_BET_FLOW: 208.15,
            D0_TOTAL_BET_FLOW: 348.64,

            // 付费 & 投注（D7）
            D7_unique_purchase: 78,
            D7_PURCHASE_VALUE: 267.03,
            D7_TOTAL_BET_PLACED_USER: 87,
            D7_SPORTS_BET_PLACED_USER: 75,
            D7_GAMES_BET_PLACED_USER: 38,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 240.13,
            D7_GAMES_BET_FLOW: 409.76,
            D7_TOTAL_BET_FLOW: 649.89,

            // 留存
            D1_retained_users: 79,
            D7_retained_users: 22,
          },

          {
            date: "2025-10-02", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 406,
            D0_unique_purchase: 240,
            D0_PURCHASE_VALUE: 609.0,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 233,
            D0_SPORTS_BET_PLACED_USER: 160,
            D0_GAMES_BET_PLACED_USER: 122,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 295.35,
            D0_GAMES_BET_FLOW: 1452.9,
            D0_TOTAL_BET_FLOW: 1748.25,

            // 付费 & 投注（D7）
            D7_unique_purchase: 277,
            D7_PURCHASE_VALUE: 6501.15,
            D7_TOTAL_BET_PLACED_USER: 277,
            D7_SPORTS_BET_PLACED_USER: 204,
            D7_GAMES_BET_PLACED_USER: 156,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 6033.49,
            D7_GAMES_BET_FLOW: 23328.56,
            D7_TOTAL_BET_FLOW: 29362.05,

            // 留存
            D1_retained_users: 170,
            D7_retained_users: 56,
          },

          {
            date: "2025-10-02", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 818,
            D0_unique_purchase: 286,
            D0_PURCHASE_VALUE: 827.03,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 280,
            D0_SPORTS_BET_PLACED_USER: 85,
            D0_GAMES_BET_PLACED_USER: 242,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 25.95,
            D0_GAMES_BET_FLOW: 4683.62,
            D0_TOTAL_BET_FLOW: 4709.56,

            // 付费 & 投注（D7）
            D7_unique_purchase: 351,
            D7_PURCHASE_VALUE: 1837.18,
            D7_TOTAL_BET_PLACED_USER: 414,
            D7_SPORTS_BET_PLACED_USER: 189,
            D7_GAMES_BET_PLACED_USER: 317,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 151.11,
            D7_GAMES_BET_FLOW: 10274.11,
            D7_TOTAL_BET_FLOW: 10425.22,

            // 留存
            D1_retained_users: 332,
            D7_retained_users: 82,
          },

          {
            date: "2025-10-02", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1981,
            D0_unique_purchase: 811,
            D0_PURCHASE_VALUE: 1619.1,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 738,
            D0_SPORTS_BET_PLACED_USER: 472,
            D0_GAMES_BET_PLACED_USER: 427,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 812.93,
            D0_GAMES_BET_FLOW: 4530.52,
            D0_TOTAL_BET_FLOW: 5343.45,

            // 付费 & 投注（D7）
            D7_unique_purchase: 997,
            D7_PURCHASE_VALUE: 6401.97,
            D7_TOTAL_BET_PLACED_USER: 984,
            D7_SPORTS_BET_PLACED_USER: 694,
            D7_GAMES_BET_PLACED_USER: 593,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 3036.67,
            D7_GAMES_BET_FLOW: 38588.4,
            D7_TOTAL_BET_FLOW: 41625.07,

            // 留存
            D1_retained_users: 736,
            D7_retained_users: 203,
          },

          {
            date: "2025-10-02", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 673,
            D0_unique_purchase: 239,
            D0_PURCHASE_VALUE: 490.64,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 234,
            D0_SPORTS_BET_PLACED_USER: 119,
            D0_GAMES_BET_PLACED_USER: 163,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 56.04,
            D0_GAMES_BET_FLOW: 2743.16,
            D0_TOTAL_BET_FLOW: 2799.21,

            // 付费 & 投注（D7）
            D7_unique_purchase: 313,
            D7_PURCHASE_VALUE: 1786.62,
            D7_TOTAL_BET_PLACED_USER: 338,
            D7_SPORTS_BET_PLACED_USER: 206,
            D7_GAMES_BET_PLACED_USER: 222,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 257.99,
            D7_GAMES_BET_FLOW: 8342.55,
            D7_TOTAL_BET_FLOW: 8600.54,

            // 留存
            D1_retained_users: 231,
            D7_retained_users: 73,
          },

          {
            date: "2025-10-02", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 134,
            D0_unique_purchase: 44,
            D0_PURCHASE_VALUE: 160.97,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 48,
            D0_SPORTS_BET_PLACED_USER: 32,
            D0_GAMES_BET_PLACED_USER: 24,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 74.28,
            D0_GAMES_BET_FLOW: 285.83,
            D0_TOTAL_BET_FLOW: 360.11,

            // 付费 & 投注（D7）
            D7_unique_purchase: 55,
            D7_PURCHASE_VALUE: 514.58,
            D7_TOTAL_BET_PLACED_USER: 65,
            D7_SPORTS_BET_PLACED_USER: 49,
            D7_GAMES_BET_PLACED_USER: 34,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 235.98,
            D7_GAMES_BET_FLOW: 2109.62,
            D7_TOTAL_BET_FLOW: 2345.59,

            // 留存
            D1_retained_users: 48,
            D7_retained_users: 16,
          },

          {
            date: "2025-10-03", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 386,
            D0_unique_purchase: 210,
            D0_PURCHASE_VALUE: 536.46,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 184,
            D0_SPORTS_BET_PLACED_USER: 125,
            D0_GAMES_BET_PLACED_USER: 95,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 97.79,
            D0_GAMES_BET_FLOW: 1892.06,
            D0_TOTAL_BET_FLOW: 1989.85,

            // 付费 & 投注（D7）
            D7_unique_purchase: 250,
            D7_PURCHASE_VALUE: 1242.15,
            D7_TOTAL_BET_PLACED_USER: 246,
            D7_SPORTS_BET_PLACED_USER: 184,
            D7_GAMES_BET_PLACED_USER: 132,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 334.69,
            D7_GAMES_BET_FLOW: 4711.82,
            D7_TOTAL_BET_FLOW: 5046.51,

            // 留存
            D1_retained_users: 183,
            D7_retained_users: 43,
          },

          {
            date: "2025-10-03", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 941,
            D0_unique_purchase: 342,
            D0_PURCHASE_VALUE: 347.77,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 342,
            D0_SPORTS_BET_PLACED_USER: 109,
            D0_GAMES_BET_PLACED_USER: 269,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 36.86,
            D0_GAMES_BET_FLOW: 1680.76,
            D0_TOTAL_BET_FLOW: 1717.63,

            // 付费 & 投注（D7）
            D7_unique_purchase: 428,
            D7_PURCHASE_VALUE: 963.76,
            D7_TOTAL_BET_PLACED_USER: 457,
            D7_SPORTS_BET_PLACED_USER: 191,
            D7_GAMES_BET_PLACED_USER: 362,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 183.53,
            D7_GAMES_BET_FLOW: 4888.01,
            D7_TOTAL_BET_FLOW: 5071.55,

            // 留存
            D1_retained_users: 347,
            D7_retained_users: 90,
          },

          {
            date: "2025-10-03", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1805,
            D0_unique_purchase: 702,
            D0_PURCHASE_VALUE: 1120.07,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 647,
            D0_SPORTS_BET_PLACED_USER: 400,
            D0_GAMES_BET_PLACED_USER: 371,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 1312.52,
            D0_GAMES_BET_FLOW: 2134.57,
            D0_TOTAL_BET_FLOW: 3447.09,

            // 付费 & 投注（D7）
            D7_unique_purchase: 853,
            D7_PURCHASE_VALUE: 4224.13,
            D7_TOTAL_BET_PLACED_USER: 852,
            D7_SPORTS_BET_PLACED_USER: 580,
            D7_GAMES_BET_PLACED_USER: 524,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 5220.45,
            D7_GAMES_BET_FLOW: 6523.6,
            D7_TOTAL_BET_FLOW: 11744.05,

            // 留存
            D1_retained_users: 681,
            D7_retained_users: 161,
          },

          {
            date: "2025-10-03", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 640,
            D0_unique_purchase: 199,
            D0_PURCHASE_VALUE: 276.99,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 193,
            D0_SPORTS_BET_PLACED_USER: 91,
            D0_GAMES_BET_PLACED_USER: 141,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 88.37,
            D0_GAMES_BET_FLOW: 1078.11,
            D0_TOTAL_BET_FLOW: 1166.48,

            // 付费 & 投注（D7）
            D7_unique_purchase: 287,
            D7_PURCHASE_VALUE: 589.38,
            D7_TOTAL_BET_PLACED_USER: 302,
            D7_SPORTS_BET_PLACED_USER: 158,
            D7_GAMES_BET_PLACED_USER: 225,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 209.73,
            D7_GAMES_BET_FLOW: 2504.59,
            D7_TOTAL_BET_FLOW: 2714.32,

            // 留存
            D1_retained_users: 181,
            D7_retained_users: 105,
          },

          {
            date: "2025-10-03", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 212,
            D0_unique_purchase: 62,
            D0_PURCHASE_VALUE: 1163.18,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 63,
            D0_SPORTS_BET_PLACED_USER: 47,
            D0_GAMES_BET_PLACED_USER: 27,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 37.22,
            D0_GAMES_BET_FLOW: 8528.62,
            D0_TOTAL_BET_FLOW: 8565.84,

            // 付费 & 投注（D7）
            D7_unique_purchase: 85,
            D7_PURCHASE_VALUE: 2240.68,
            D7_TOTAL_BET_PLACED_USER: 98,
            D7_SPORTS_BET_PLACED_USER: 79,
            D7_GAMES_BET_PLACED_USER: 49,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 109.87,
            D7_GAMES_BET_FLOW: 14289.15,
            D7_TOTAL_BET_FLOW: 14399.02,

            // 留存
            D1_retained_users: 78,
            D7_retained_users: 27,
          },

          {
            date: "2025-10-04", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 417,
            D0_unique_purchase: 227,
            D0_PURCHASE_VALUE: 1382.23,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 218,
            D0_SPORTS_BET_PLACED_USER: 148,
            D0_GAMES_BET_PLACED_USER: 114,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 217.58,
            D0_GAMES_BET_FLOW: 7775.06,
            D0_TOTAL_BET_FLOW: 7992.65,

            // 付费 & 投注（D7）
            D7_unique_purchase: 263,
            D7_PURCHASE_VALUE: 3728.15,
            D7_TOTAL_BET_PLACED_USER: 268,
            D7_SPORTS_BET_PLACED_USER: 197,
            D7_GAMES_BET_PLACED_USER: 154,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 462.32,
            D7_GAMES_BET_FLOW: 19719.25,
            D7_TOTAL_BET_FLOW: 20181.57,

            // 留存
            D1_retained_users: 185,
            D7_retained_users: 70,
          },

          {
            date: "2025-10-04", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 945,
            D0_unique_purchase: 451,
            D0_PURCHASE_VALUE: 726.48,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 427,
            D0_SPORTS_BET_PLACED_USER: 187,
            D0_GAMES_BET_PLACED_USER: 315,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 96.14,
            D0_GAMES_BET_FLOW: 2607.32,
            D0_TOTAL_BET_FLOW: 2703.46,

            // 付费 & 投注（D7）
            D7_unique_purchase: 522,
            D7_PURCHASE_VALUE: 2113.53,
            D7_TOTAL_BET_PLACED_USER: 529,
            D7_SPORTS_BET_PLACED_USER: 254,
            D7_GAMES_BET_PLACED_USER: 416,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 433.37,
            D7_GAMES_BET_FLOW: 9133.46,
            D7_TOTAL_BET_FLOW: 9566.83,

            // 留存
            D1_retained_users: 392,
            D7_retained_users: 110,
          },

          {
            date: "2025-10-04", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1822,
            D0_unique_purchase: 686,
            D0_PURCHASE_VALUE: 858.34,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 625,
            D0_SPORTS_BET_PLACED_USER: 425,
            D0_GAMES_BET_PLACED_USER: 337,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 494.76,
            D0_GAMES_BET_FLOW: 2795.19,
            D0_TOTAL_BET_FLOW: 3289.95,

            // 付费 & 投注（D7）
            D7_unique_purchase: 844,
            D7_PURCHASE_VALUE: 2102.65,
            D7_TOTAL_BET_PLACED_USER: 830,
            D7_SPORTS_BET_PLACED_USER: 586,
            D7_GAMES_BET_PLACED_USER: 493,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2941.05,
            D7_GAMES_BET_FLOW: 10556.97,
            D7_TOTAL_BET_FLOW: 13498.02,

            // 留存
            D1_retained_users: 684,
            D7_retained_users: 167,
          },

          {
            date: "2025-10-04", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 885,
            D0_unique_purchase: 291,
            D0_PURCHASE_VALUE: 540.8,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 295,
            D0_SPORTS_BET_PLACED_USER: 185,
            D0_GAMES_BET_PLACED_USER: 178,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 107.36,
            D0_GAMES_BET_FLOW: 2508.65,
            D0_TOTAL_BET_FLOW: 2616.0,

            // 付费 & 投注（D7）
            D7_unique_purchase: 382,
            D7_PURCHASE_VALUE: 2515.03,
            D7_TOTAL_BET_PLACED_USER: 395,
            D7_SPORTS_BET_PLACED_USER: 269,
            D7_GAMES_BET_PLACED_USER: 245,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 268.65,
            D7_GAMES_BET_FLOW: 10088.03,
            D7_TOTAL_BET_FLOW: 10356.68,

            // 留存
            D1_retained_users: 351,
            D7_retained_users: 109,
          },

          {
            date: "2025-10-04", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 207,
            D0_unique_purchase: 98,
            D0_PURCHASE_VALUE: 232.68,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 104,
            D0_SPORTS_BET_PLACED_USER: 87,
            D0_GAMES_BET_PLACED_USER: 36,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 180.56,
            D0_GAMES_BET_FLOW: 164.4,
            D0_TOTAL_BET_FLOW: 344.96,

            // 付费 & 投注（D7）
            D7_unique_purchase: 113,
            D7_PURCHASE_VALUE: 417.61,
            D7_TOTAL_BET_PLACED_USER: 125,
            D7_SPORTS_BET_PLACED_USER: 105,
            D7_GAMES_BET_PLACED_USER: 49,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 518.07,
            D7_GAMES_BET_FLOW: 362.15,
            D7_TOTAL_BET_FLOW: 880.22,

            // 留存
            D1_retained_users: 89,
            D7_retained_users: 29,
          },

          {
            date: "2025-10-05", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 374,
            D0_unique_purchase: 193,
            D0_PURCHASE_VALUE: 706.85,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 184,
            D0_SPORTS_BET_PLACED_USER: 124,
            D0_GAMES_BET_PLACED_USER: 104,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 431.4,
            D0_GAMES_BET_FLOW: 986.41,
            D0_TOTAL_BET_FLOW: 1417.82,

            // 付费 & 投注（D7）
            D7_unique_purchase: 226,
            D7_PURCHASE_VALUE: 1769.0,
            D7_TOTAL_BET_PLACED_USER: 226,
            D7_SPORTS_BET_PLACED_USER: 161,
            D7_GAMES_BET_PLACED_USER: 150,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 684.86,
            D7_GAMES_BET_FLOW: 5128.78,
            D7_TOTAL_BET_FLOW: 5813.64,

            // 留存
            D1_retained_users: 157,
            D7_retained_users: 80,
          },

          {
            date: "2025-10-05", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 931,
            D0_unique_purchase: 396,
            D0_PURCHASE_VALUE: 472.16,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 387,
            D0_SPORTS_BET_PLACED_USER: 158,
            D0_GAMES_BET_PLACED_USER: 293,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 182.41,
            D0_GAMES_BET_FLOW: 2116.32,
            D0_TOTAL_BET_FLOW: 2298.74,

            // 付费 & 投注（D7）
            D7_unique_purchase: 479,
            D7_PURCHASE_VALUE: 1331.29,
            D7_TOTAL_BET_PLACED_USER: 491,
            D7_SPORTS_BET_PLACED_USER: 214,
            D7_GAMES_BET_PLACED_USER: 405,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 832.99,
            D7_GAMES_BET_FLOW: 6401.71,
            D7_TOTAL_BET_FLOW: 7234.7,

            // 留存
            D1_retained_users: 310,
            D7_retained_users: 102,
          },

          {
            date: "2025-10-05", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1673,
            D0_unique_purchase: 582,
            D0_PURCHASE_VALUE: 947.4,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 555,
            D0_SPORTS_BET_PLACED_USER: 366,
            D0_GAMES_BET_PLACED_USER: 314,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 1805.29,
            D0_GAMES_BET_FLOW: 7896.61,
            D0_TOTAL_BET_FLOW: 9701.9,

            // 付费 & 投注（D7）
            D7_unique_purchase: 741,
            D7_PURCHASE_VALUE: 1963.96,
            D7_TOTAL_BET_PLACED_USER: 755,
            D7_SPORTS_BET_PLACED_USER: 530,
            D7_GAMES_BET_PLACED_USER: 464,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2378.34,
            D7_GAMES_BET_FLOW: 13511.94,
            D7_TOTAL_BET_FLOW: 15890.28,

            // 留存
            D1_retained_users: 591,
            D7_retained_users: 158,
          },

          {
            date: "2025-10-05", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 840,
            D0_unique_purchase: 227,
            D0_PURCHASE_VALUE: 432.27,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 242,
            D0_SPORTS_BET_PLACED_USER: 153,
            D0_GAMES_BET_PLACED_USER: 130,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 84.02,
            D0_GAMES_BET_FLOW: 1887.4,
            D0_TOTAL_BET_FLOW: 1971.41,

            // 付费 & 投注（D7）
            D7_unique_purchase: 329,
            D7_PURCHASE_VALUE: 1217.34,
            D7_TOTAL_BET_PLACED_USER: 362,
            D7_SPORTS_BET_PLACED_USER: 250,
            D7_GAMES_BET_PLACED_USER: 204,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 224.23,
            D7_GAMES_BET_FLOW: 5304.92,
            D7_TOTAL_BET_FLOW: 5529.14,

            // 留存
            D1_retained_users: 258,
            D7_retained_users: 124,
          },

          {
            date: "2025-10-05", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 148,
            D0_unique_purchase: 60,
            D0_PURCHASE_VALUE: 109.21,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 61,
            D0_SPORTS_BET_PLACED_USER: 50,
            D0_GAMES_BET_PLACED_USER: 21,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 59.31,
            D0_GAMES_BET_FLOW: 248.75,
            D0_TOTAL_BET_FLOW: 308.06,

            // 付费 & 投注（D7）
            D7_unique_purchase: 73,
            D7_PURCHASE_VALUE: 497.0,
            D7_TOTAL_BET_PLACED_USER: 78,
            D7_SPORTS_BET_PLACED_USER: 64,
            D7_GAMES_BET_PLACED_USER: 32,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 134.55,
            D7_GAMES_BET_FLOW: 2021.76,
            D7_TOTAL_BET_FLOW: 2156.31,

            // 留存
            D1_retained_users: 52,
            D7_retained_users: 25,
          },

          {
            date: "2025-10-06", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 427,
            D0_unique_purchase: 157,
            D0_PURCHASE_VALUE: 1086.69,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 144,
            D0_SPORTS_BET_PLACED_USER: 70,
            D0_GAMES_BET_PLACED_USER: 106,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 130.66,
            D0_GAMES_BET_FLOW: 4015.54,
            D0_TOTAL_BET_FLOW: 4146.2,

            // 付费 & 投注（D7）
            D7_unique_purchase: 279,
            D7_PURCHASE_VALUE: 6379.31,
            D7_TOTAL_BET_PLACED_USER: 277,
            D7_SPORTS_BET_PLACED_USER: 204,
            D7_GAMES_BET_PLACED_USER: 163,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 382.66,
            D7_GAMES_BET_FLOW: 62820.71,
            D7_TOTAL_BET_FLOW: 63203.38,

            // 留存
            D1_retained_users: 228,
            D7_retained_users: 56,
          },

          {
            date: "2025-10-06", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1035,
            D0_unique_purchase: 294,
            D0_PURCHASE_VALUE: 452.8,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 294,
            D0_SPORTS_BET_PLACED_USER: 74,
            D0_GAMES_BET_PLACED_USER: 253,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 20.82,
            D0_GAMES_BET_FLOW: 3003.21,
            D0_TOTAL_BET_FLOW: 3024.03,

            // 付费 & 投注（D7）
            D7_unique_purchase: 372,
            D7_PURCHASE_VALUE: 2598.65,
            D7_TOTAL_BET_PLACED_USER: 461,
            D7_SPORTS_BET_PLACED_USER: 194,
            D7_GAMES_BET_PLACED_USER: 347,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 89.89,
            D7_GAMES_BET_FLOW: 13216.37,
            D7_TOTAL_BET_FLOW: 13306.27,

            // 留存
            D1_retained_users: 349,
            D7_retained_users: 86,
          },

          {
            date: "2025-10-06", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1537,
            D0_unique_purchase: 556,
            D0_PURCHASE_VALUE: 780.97,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 491,
            D0_SPORTS_BET_PLACED_USER: 271,
            D0_GAMES_BET_PLACED_USER: 326,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 508.54,
            D0_GAMES_BET_FLOW: 4497.1,
            D0_TOTAL_BET_FLOW: 5005.64,

            // 付费 & 投注（D7）
            D7_unique_purchase: 695,
            D7_PURCHASE_VALUE: 1585.75,
            D7_TOTAL_BET_PLACED_USER: 690,
            D7_SPORTS_BET_PLACED_USER: 436,
            D7_GAMES_BET_PLACED_USER: 460,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1164.7,
            D7_GAMES_BET_FLOW: 7829.36,
            D7_TOTAL_BET_FLOW: 8994.06,

            // 留存
            D1_retained_users: 518,
            D7_retained_users: 120,
          },

          {
            date: "2025-10-06", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 644,
            D0_unique_purchase: 211,
            D0_PURCHASE_VALUE: 405.01,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 200,
            D0_SPORTS_BET_PLACED_USER: 75,
            D0_GAMES_BET_PLACED_USER: 161,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 69.25,
            D0_GAMES_BET_FLOW: 1493.91,
            D0_TOTAL_BET_FLOW: 1563.15,

            // 付费 & 投注（D7）
            D7_unique_purchase: 297,
            D7_PURCHASE_VALUE: 1092.33,
            D7_TOTAL_BET_PLACED_USER: 316,
            D7_SPORTS_BET_PLACED_USER: 174,
            D7_GAMES_BET_PLACED_USER: 216,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 224.5,
            D7_GAMES_BET_FLOW: 6284.2,
            D7_TOTAL_BET_FLOW: 6508.7,

            // 留存
            D1_retained_users: 206,
            D7_retained_users: 51,
          },

          {
            date: "2025-10-06", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 165,
            D0_unique_purchase: 41,
            D0_PURCHASE_VALUE: 59.29,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 42,
            D0_SPORTS_BET_PLACED_USER: 24,
            D0_GAMES_BET_PLACED_USER: 27,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 14.29,
            D0_GAMES_BET_FLOW: 290.18,
            D0_TOTAL_BET_FLOW: 304.47,

            // 付费 & 投注（D7）
            D7_unique_purchase: 59,
            D7_PURCHASE_VALUE: 125.8,
            D7_TOTAL_BET_PLACED_USER: 76,
            D7_SPORTS_BET_PLACED_USER: 55,
            D7_GAMES_BET_PLACED_USER: 48,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 75.53,
            D7_GAMES_BET_FLOW: 555.37,
            D7_TOTAL_BET_FLOW: 630.9,

            // 留存
            D1_retained_users: 59,
            D7_retained_users: 23,
          },

          {
            date: "2025-10-07", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 393,
            D0_unique_purchase: 218,
            D0_PURCHASE_VALUE: 1111.85,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 153,
            D0_SPORTS_BET_PLACED_USER: 96,
            D0_GAMES_BET_PLACED_USER: 91,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 140.63,
            D0_GAMES_BET_FLOW: 4317.97,
            D0_TOTAL_BET_FLOW: 4458.6,

            // 付费 & 投注（D7）
            D7_unique_purchase: 255,
            D7_PURCHASE_VALUE: 4940.92,
            D7_TOTAL_BET_PLACED_USER: 260,
            D7_SPORTS_BET_PLACED_USER: 203,
            D7_GAMES_BET_PLACED_USER: 162,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 449.37,
            D7_GAMES_BET_FLOW: 27419.04,
            D7_TOTAL_BET_FLOW: 27868.4,

            // 留存
            D1_retained_users: 236,
            D7_retained_users: 55,
          },

          {
            date: "2025-10-07", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 963,
            D0_unique_purchase: 284,
            D0_PURCHASE_VALUE: 766.44,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 265,
            D0_SPORTS_BET_PLACED_USER: 61,
            D0_GAMES_BET_PLACED_USER: 232,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 102.72,
            D0_GAMES_BET_FLOW: 2870.49,
            D0_TOTAL_BET_FLOW: 2973.21,

            // 付费 & 投注（D7）
            D7_unique_purchase: 432,
            D7_PURCHASE_VALUE: 2758.32,
            D7_TOTAL_BET_PLACED_USER: 449,
            D7_SPORTS_BET_PLACED_USER: 221,
            D7_GAMES_BET_PLACED_USER: 300,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 186.26,
            D7_GAMES_BET_FLOW: 14216.21,
            D7_TOTAL_BET_FLOW: 14402.47,

            // 留存
            D1_retained_users: 215,
            D7_retained_users: 160,
          },

          {
            date: "2025-10-07", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1685,
            D0_unique_purchase: 599,
            D0_PURCHASE_VALUE: 534.58,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 541,
            D0_SPORTS_BET_PLACED_USER: 338,
            D0_GAMES_BET_PLACED_USER: 332,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 343.67,
            D0_GAMES_BET_FLOW: 4194.98,
            D0_TOTAL_BET_FLOW: 4538.65,

            // 付费 & 投注（D7）
            D7_unique_purchase: 751,
            D7_PURCHASE_VALUE: 2973.51,
            D7_TOTAL_BET_PLACED_USER: 733,
            D7_SPORTS_BET_PLACED_USER: 483,
            D7_GAMES_BET_PLACED_USER: 461,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1609.42,
            D7_GAMES_BET_FLOW: 14997.92,
            D7_TOTAL_BET_FLOW: 16607.34,

            // 留存
            D1_retained_users: 592,
            D7_retained_users: 157,
          },

          {
            date: "2025-10-07", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 866,
            D0_unique_purchase: 213,
            D0_PURCHASE_VALUE: 421.49,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 196,
            D0_SPORTS_BET_PLACED_USER: 65,
            D0_GAMES_BET_PLACED_USER: 155,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 32.11,
            D0_GAMES_BET_FLOW: 1601.95,
            D0_TOTAL_BET_FLOW: 1634.06,

            // 付费 & 投注（D7）
            D7_unique_purchase: 336,
            D7_PURCHASE_VALUE: 1397.96,
            D7_TOTAL_BET_PLACED_USER: 354,
            D7_SPORTS_BET_PLACED_USER: 161,
            D7_GAMES_BET_PLACED_USER: 256,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 195.46,
            D7_GAMES_BET_FLOW: 6527.54,
            D7_TOTAL_BET_FLOW: 6723.0,

            // 留存
            D1_retained_users: 269,
            D7_retained_users: 97,
          },

          {
            date: "2025-10-07", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 112,
            D0_unique_purchase: 37,
            D0_PURCHASE_VALUE: 197.07,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 35,
            D0_SPORTS_BET_PLACED_USER: 21,
            D0_GAMES_BET_PLACED_USER: 21,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 20.31,
            D0_GAMES_BET_FLOW: 825.97,
            D0_TOTAL_BET_FLOW: 846.29,

            // 付费 & 投注（D7）
            D7_unique_purchase: 46,
            D7_PURCHASE_VALUE: 335.38,
            D7_TOTAL_BET_PLACED_USER: 49,
            D7_SPORTS_BET_PLACED_USER: 35,
            D7_GAMES_BET_PLACED_USER: 29,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 55.0,
            D7_GAMES_BET_FLOW: 1659.41,
            D7_TOTAL_BET_FLOW: 1714.41,

            // 留存
            D1_retained_users: 41,
            D7_retained_users: 10,
          },

          {
            date: "2025-10-08", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 356,
            D0_unique_purchase: 197,
            D0_PURCHASE_VALUE: 1021.46,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 192,
            D0_SPORTS_BET_PLACED_USER: 116,
            D0_GAMES_BET_PLACED_USER: 113,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 167.02,
            D0_GAMES_BET_FLOW: 4057.87,
            D0_TOTAL_BET_FLOW: 4224.88,

            // 付费 & 投注（D7）
            D7_unique_purchase: 234,
            D7_PURCHASE_VALUE: 2303.38,
            D7_TOTAL_BET_PLACED_USER: 244,
            D7_SPORTS_BET_PLACED_USER: 164,
            D7_GAMES_BET_PLACED_USER: 154,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 296.61,
            D7_GAMES_BET_FLOW: 9821.43,
            D7_TOTAL_BET_FLOW: 10118.04,

            // 留存
            D1_retained_users: 173,
            D7_retained_users: 62,
          },

          {
            date: "2025-10-08", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1203,
            D0_unique_purchase: 305,
            D0_PURCHASE_VALUE: 543.06,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 314,
            D0_SPORTS_BET_PLACED_USER: 98,
            D0_GAMES_BET_PLACED_USER: 256,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 125.16,
            D0_GAMES_BET_FLOW: 2351.28,
            D0_TOTAL_BET_FLOW: 2476.43,

            // 付费 & 投注（D7）
            D7_unique_purchase: 618,
            D7_PURCHASE_VALUE: 1164.86,
            D7_TOTAL_BET_PLACED_USER: 671,
            D7_SPORTS_BET_PLACED_USER: 424,
            D7_GAMES_BET_PLACED_USER: 322,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 260.74,
            D7_GAMES_BET_FLOW: 5055.41,
            D7_TOTAL_BET_FLOW: 5316.15,

            // 留存
            D1_retained_users: 318,
            D7_retained_users: 287,
          },

          {
            date: "2025-10-08", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1553,
            D0_unique_purchase: 568,
            D0_PURCHASE_VALUE: 541.71,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 514,
            D0_SPORTS_BET_PLACED_USER: 286,
            D0_GAMES_BET_PLACED_USER: 351,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 164.03,
            D0_GAMES_BET_FLOW: 2241.12,
            D0_TOTAL_BET_FLOW: 2405.15,

            // 付费 & 投注（D7）
            D7_unique_purchase: 697,
            D7_PURCHASE_VALUE: 3420.81,
            D7_TOTAL_BET_PLACED_USER: 710,
            D7_SPORTS_BET_PLACED_USER: 433,
            D7_GAMES_BET_PLACED_USER: 506,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 4443.53,
            D7_GAMES_BET_FLOW: 8580.41,
            D7_TOTAL_BET_FLOW: 13023.94,

            // 留存
            D1_retained_users: 541,
            D7_retained_users: 136,
          },

          {
            date: "2025-10-08", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 821,
            D0_unique_purchase: 216,
            D0_PURCHASE_VALUE: 453.21,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 215,
            D0_SPORTS_BET_PLACED_USER: 111,
            D0_GAMES_BET_PLACED_USER: 152,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 59.23,
            D0_GAMES_BET_FLOW: 1721.02,
            D0_TOTAL_BET_FLOW: 1780.25,

            // 付费 & 投注（D7）
            D7_unique_purchase: 302,
            D7_PURCHASE_VALUE: 1692.74,
            D7_TOTAL_BET_PLACED_USER: 357,
            D7_SPORTS_BET_PLACED_USER: 225,
            D7_GAMES_BET_PLACED_USER: 251,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 535.48,
            D7_GAMES_BET_FLOW: 8077.34,
            D7_TOTAL_BET_FLOW: 8612.82,

            // 留存
            D1_retained_users: 219,
            D7_retained_users: 190,
          },

          {
            date: "2025-10-08", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 146,
            D0_unique_purchase: 30,
            D0_PURCHASE_VALUE: 104.23,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 35,
            D0_SPORTS_BET_PLACED_USER: 25,
            D0_GAMES_BET_PLACED_USER: 14,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 69.41,
            D0_GAMES_BET_FLOW: 190.66,
            D0_TOTAL_BET_FLOW: 260.07,

            // 付费 & 投注（D7）
            D7_unique_purchase: 46,
            D7_PURCHASE_VALUE: 183.4,
            D7_TOTAL_BET_PLACED_USER: 61,
            D7_SPORTS_BET_PLACED_USER: 47,
            D7_GAMES_BET_PLACED_USER: 30,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 116.84,
            D7_GAMES_BET_FLOW: 449.66,
            D7_TOTAL_BET_FLOW: 566.49,

            // 留存
            D1_retained_users: 42,
            D7_retained_users: 9,
          },

          {
            date: "2025-10-09", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 272,
            D0_unique_purchase: 136,
            D0_PURCHASE_VALUE: 932.77,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 134,
            D0_SPORTS_BET_PLACED_USER: 77,
            D0_GAMES_BET_PLACED_USER: 91,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 442.46,
            D0_GAMES_BET_FLOW: 643.35,
            D0_TOTAL_BET_FLOW: 1085.81,

            // 付费 & 投注（D7）
            D7_unique_purchase: 164,
            D7_PURCHASE_VALUE: 1765.08,
            D7_TOTAL_BET_PLACED_USER: 171,
            D7_SPORTS_BET_PLACED_USER: 114,
            D7_GAMES_BET_PLACED_USER: 125,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 687.74,
            D7_GAMES_BET_FLOW: 5021.14,
            D7_TOTAL_BET_FLOW: 5708.88,

            // 留存
            D1_retained_users: 142,
            D7_retained_users: 43,
          },

          {
            date: "2025-10-09", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 740,
            D0_unique_purchase: 245,
            D0_PURCHASE_VALUE: 810.82,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 259,
            D0_SPORTS_BET_PLACED_USER: 84,
            D0_GAMES_BET_PLACED_USER: 200,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 25.49,
            D0_GAMES_BET_FLOW: 3743.93,
            D0_TOTAL_BET_FLOW: 3769.42,

            // 付费 & 投注（D7）
            D7_unique_purchase: 288,
            D7_PURCHASE_VALUE: 1507.94,
            D7_TOTAL_BET_PLACED_USER: 328,
            D7_SPORTS_BET_PLACED_USER: 140,
            D7_GAMES_BET_PLACED_USER: 251,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 77.96,
            D7_GAMES_BET_FLOW: 9472.07,
            D7_TOTAL_BET_FLOW: 9550.02,

            // 留存
            D1_retained_users: 232,
            D7_retained_users: 51,
          },

          {
            date: "2025-10-09", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1724,
            D0_unique_purchase: 633,
            D0_PURCHASE_VALUE: 1408.34,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 576,
            D0_SPORTS_BET_PLACED_USER: 352,
            D0_GAMES_BET_PLACED_USER: 366,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 220.86,
            D0_GAMES_BET_FLOW: 5073.37,
            D0_TOTAL_BET_FLOW: 5294.24,

            // 付费 & 投注（D7）
            D7_unique_purchase: 790,
            D7_PURCHASE_VALUE: 5278.09,
            D7_TOTAL_BET_PLACED_USER: 778,
            D7_SPORTS_BET_PLACED_USER: 516,
            D7_GAMES_BET_PLACED_USER: 496,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 745.92,
            D7_GAMES_BET_FLOW: 22451.38,
            D7_TOTAL_BET_FLOW: 23197.3,

            // 留存
            D1_retained_users: 650,
            D7_retained_users: 163,
          },

          {
            date: "2025-10-09", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 810,
            D0_unique_purchase: 216,
            D0_PURCHASE_VALUE: 401.45,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 251,
            D0_SPORTS_BET_PLACED_USER: 121,
            D0_GAMES_BET_PLACED_USER: 162,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 31.69,
            D0_GAMES_BET_FLOW: 1809.26,
            D0_TOTAL_BET_FLOW: 1840.95,

            // 付费 & 投注（D7）
            D7_unique_purchase: 312,
            D7_PURCHASE_VALUE: 3500.34,
            D7_TOTAL_BET_PLACED_USER: 361,
            D7_SPORTS_BET_PLACED_USER: 215,
            D7_GAMES_BET_PLACED_USER: 208,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 133.88,
            D7_GAMES_BET_FLOW: 15115.73,
            D7_TOTAL_BET_FLOW: 15249.6,

            // 留存
            D1_retained_users: 243,
            D7_retained_users: 55,
          },

          {
            date: "2025-10-09", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 126,
            D0_unique_purchase: 34,
            D0_PURCHASE_VALUE: 62.27,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 41,
            D0_SPORTS_BET_PLACED_USER: 34,
            D0_GAMES_BET_PLACED_USER: 19,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 19.19,
            D0_GAMES_BET_FLOW: 149.95,
            D0_TOTAL_BET_FLOW: 169.13,

            // 付费 & 投注（D7）
            D7_unique_purchase: 49,
            D7_PURCHASE_VALUE: 430.13,
            D7_TOTAL_BET_PLACED_USER: 64,
            D7_SPORTS_BET_PLACED_USER: 53,
            D7_GAMES_BET_PLACED_USER: 36,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 90.51,
            D7_GAMES_BET_FLOW: 1397.68,
            D7_TOTAL_BET_FLOW: 1488.18,

            // 留存
            D1_retained_users: 43,
            D7_retained_users: 14,
          },

          {
            date: "2025-10-10", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 289,
            D0_unique_purchase: 124,
            D0_PURCHASE_VALUE: 909.92,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 119,
            D0_SPORTS_BET_PLACED_USER: 59,
            D0_GAMES_BET_PLACED_USER: 86,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 390.05,
            D0_GAMES_BET_FLOW: 2983.07,
            D0_TOTAL_BET_FLOW: 3373.12,

            // 付费 & 投注（D7）
            D7_unique_purchase: 167,
            D7_PURCHASE_VALUE: 3082.62,
            D7_TOTAL_BET_PLACED_USER: 168,
            D7_SPORTS_BET_PLACED_USER: 104,
            D7_GAMES_BET_PLACED_USER: 123,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2363.74,
            D7_GAMES_BET_FLOW: 10045.06,
            D7_TOTAL_BET_FLOW: 12408.8,

            // 留存
            D1_retained_users: 144,
            D7_retained_users: 46,
          },

          {
            date: "2025-10-10", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 976,
            D0_unique_purchase: 304,
            D0_PURCHASE_VALUE: 1838.52,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 277,
            D0_SPORTS_BET_PLACED_USER: 65,
            D0_GAMES_BET_PLACED_USER: 243,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 684.75,
            D0_GAMES_BET_FLOW: 2965.5,
            D0_TOTAL_BET_FLOW: 3650.25,

            // 付费 & 投注（D7）
            D7_unique_purchase: 374,
            D7_PURCHASE_VALUE: 3865.17,
            D7_TOTAL_BET_PLACED_USER: 479,
            D7_SPORTS_BET_PLACED_USER: 251,
            D7_GAMES_BET_PLACED_USER: 318,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 11176.83,
            D7_GAMES_BET_FLOW: 8333.64,
            D7_TOTAL_BET_FLOW: 19510.47,

            // 留存
            D1_retained_users: 264,
            D7_retained_users: 110,
          },

          {
            date: "2025-10-10", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1560,
            D0_unique_purchase: 560,
            D0_PURCHASE_VALUE: 722.44,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 513,
            D0_SPORTS_BET_PLACED_USER: 308,
            D0_GAMES_BET_PLACED_USER: 323,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 130.48,
            D0_GAMES_BET_FLOW: 2141.12,
            D0_TOTAL_BET_FLOW: 2271.61,

            // 付费 & 投注（D7）
            D7_unique_purchase: 699,
            D7_PURCHASE_VALUE: 2271.55,
            D7_TOTAL_BET_PLACED_USER: 688,
            D7_SPORTS_BET_PLACED_USER: 471,
            D7_GAMES_BET_PLACED_USER: 443,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 311.92,
            D7_GAMES_BET_FLOW: 15048.36,
            D7_TOTAL_BET_FLOW: 15360.28,

            // 留存
            D1_retained_users: 568,
            D7_retained_users: 139,
          },

          {
            date: "2025-10-10", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 543,
            D0_unique_purchase: 236,
            D0_PURCHASE_VALUE: 450.49,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 224,
            D0_SPORTS_BET_PLACED_USER: 114,
            D0_GAMES_BET_PLACED_USER: 158,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 98.22,
            D0_GAMES_BET_FLOW: 1334.08,
            D0_TOTAL_BET_FLOW: 1432.31,

            // 付费 & 投注（D7）
            D7_unique_purchase: 293,
            D7_PURCHASE_VALUE: 1216.97,
            D7_TOTAL_BET_PLACED_USER: 300,
            D7_SPORTS_BET_PLACED_USER: 179,
            D7_GAMES_BET_PLACED_USER: 216,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 173.46,
            D7_GAMES_BET_FLOW: 6040.14,
            D7_TOTAL_BET_FLOW: 6213.59,

            // 留存
            D1_retained_users: 230,
            D7_retained_users: 75,
          },

          {
            date: "2025-10-10", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 110,
            D0_unique_purchase: 42,
            D0_PURCHASE_VALUE: 188.64,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 40,
            D0_SPORTS_BET_PLACED_USER: 23,
            D0_GAMES_BET_PLACED_USER: 22,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 26.72,
            D0_GAMES_BET_FLOW: 795.65,
            D0_TOTAL_BET_FLOW: 822.37,

            // 付费 & 投注（D7）
            D7_unique_purchase: 49,
            D7_PURCHASE_VALUE: 353.79,
            D7_TOTAL_BET_PLACED_USER: 57,
            D7_SPORTS_BET_PLACED_USER: 42,
            D7_GAMES_BET_PLACED_USER: 33,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 129.56,
            D7_GAMES_BET_FLOW: 1374.62,
            D7_TOTAL_BET_FLOW: 1504.17,

            // 留存
            D1_retained_users: 45,
            D7_retained_users: 16,
          },

          {
            date: "2025-10-11", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 315,
            D0_unique_purchase: 142,
            D0_PURCHASE_VALUE: 668.31,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 145,
            D0_SPORTS_BET_PLACED_USER: 78,
            D0_GAMES_BET_PLACED_USER: 109,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 224.57,
            D0_GAMES_BET_FLOW: 4307.68,
            D0_TOTAL_BET_FLOW: 4532.25,

            // 付费 & 投注（D7）
            D7_unique_purchase: 177,
            D7_PURCHASE_VALUE: 3951.46,
            D7_TOTAL_BET_PLACED_USER: 188,
            D7_SPORTS_BET_PLACED_USER: 112,
            D7_GAMES_BET_PLACED_USER: 146,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 775.44,
            D7_GAMES_BET_FLOW: 20312.13,
            D7_TOTAL_BET_FLOW: 21087.57,

            // 留存
            D1_retained_users: 157,
            D7_retained_users: 55,
          },

          {
            date: "2025-10-11", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 913,
            D0_unique_purchase: 293,
            D0_PURCHASE_VALUE: 453.52,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 298,
            D0_SPORTS_BET_PLACED_USER: 74,
            D0_GAMES_BET_PLACED_USER: 264,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 19.98,
            D0_GAMES_BET_FLOW: 2097.72,
            D0_TOTAL_BET_FLOW: 2117.7,

            // 付费 & 投注（D7）
            D7_unique_purchase: 348,
            D7_PURCHASE_VALUE: 1095.71,
            D7_TOTAL_BET_PLACED_USER: 423,
            D7_SPORTS_BET_PLACED_USER: 164,
            D7_GAMES_BET_PLACED_USER: 329,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 98.72,
            D7_GAMES_BET_FLOW: 6157.32,
            D7_TOTAL_BET_FLOW: 6256.04,

            // 留存
            D1_retained_users: 273,
            D7_retained_users: 99,
          },

          {
            date: "2025-10-11", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1529,
            D0_unique_purchase: 538,
            D0_PURCHASE_VALUE: 547.86,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 479,
            D0_SPORTS_BET_PLACED_USER: 292,
            D0_GAMES_BET_PLACED_USER: 297,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 378.64,
            D0_GAMES_BET_FLOW: 1291.2,
            D0_TOTAL_BET_FLOW: 1669.84,

            // 付费 & 投注（D7）
            D7_unique_purchase: 669,
            D7_PURCHASE_VALUE: 2106.59,
            D7_TOTAL_BET_PLACED_USER: 657,
            D7_SPORTS_BET_PLACED_USER: 436,
            D7_GAMES_BET_PLACED_USER: 419,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1475.46,
            D7_GAMES_BET_FLOW: 6547.72,
            D7_TOTAL_BET_FLOW: 8023.18,

            // 留存
            D1_retained_users: 540,
            D7_retained_users: 179,
          },

          {
            date: "2025-10-11", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 789,
            D0_unique_purchase: 202,
            D0_PURCHASE_VALUE: 433.31,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 208,
            D0_SPORTS_BET_PLACED_USER: 104,
            D0_GAMES_BET_PLACED_USER: 138,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 67.32,
            D0_GAMES_BET_FLOW: 1162.2,
            D0_TOTAL_BET_FLOW: 1229.51,

            // 付费 & 投注（D7）
            D7_unique_purchase: 296,
            D7_PURCHASE_VALUE: 1536.14,
            D7_TOTAL_BET_PLACED_USER: 314,
            D7_SPORTS_BET_PLACED_USER: 188,
            D7_GAMES_BET_PLACED_USER: 200,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 160.72,
            D7_GAMES_BET_FLOW: 6172.6,
            D7_TOTAL_BET_FLOW: 6333.32,

            // 留存
            D1_retained_users: 265,
            D7_retained_users: 83,
          },

          {
            date: "2025-10-11", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 150,
            D0_unique_purchase: 54,
            D0_PURCHASE_VALUE: 421.78,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 55,
            D0_SPORTS_BET_PLACED_USER: 41,
            D0_GAMES_BET_PLACED_USER: 23,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 81.95,
            D0_GAMES_BET_FLOW: 920.38,
            D0_TOTAL_BET_FLOW: 1002.33,

            // 付费 & 投注（D7）
            D7_unique_purchase: 66,
            D7_PURCHASE_VALUE: 779.38,
            D7_TOTAL_BET_PLACED_USER: 76,
            D7_SPORTS_BET_PLACED_USER: 59,
            D7_GAMES_BET_PLACED_USER: 39,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 204.56,
            D7_GAMES_BET_FLOW: 3046.92,
            D7_TOTAL_BET_FLOW: 3251.48,

            // 留存
            D1_retained_users: 63,
            D7_retained_users: 32,
          },

          {
            date: "2025-10-12", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 332,
            D0_unique_purchase: 161,
            D0_PURCHASE_VALUE: 662.0,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 158,
            D0_SPORTS_BET_PLACED_USER: 94,
            D0_GAMES_BET_PLACED_USER: 101,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 42.99,
            D0_GAMES_BET_FLOW: 4037.8,
            D0_TOTAL_BET_FLOW: 4080.79,

            // 付费 & 投注（D7）
            D7_unique_purchase: 193,
            D7_PURCHASE_VALUE: 1756.69,
            D7_TOTAL_BET_PLACED_USER: 197,
            D7_SPORTS_BET_PLACED_USER: 128,
            D7_GAMES_BET_PLACED_USER: 139,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 144.47,
            D7_GAMES_BET_FLOW: 9607.03,
            D7_TOTAL_BET_FLOW: 9751.5,

            // 留存
            D1_retained_users: 148,
            D7_retained_users: 64,
          },

          {
            date: "2025-10-12", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 925,
            D0_unique_purchase: 319,
            D0_PURCHASE_VALUE: 930.08,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 319,
            D0_SPORTS_BET_PLACED_USER: 141,
            D0_GAMES_BET_PLACED_USER: 209,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 963.47,
            D0_GAMES_BET_FLOW: 3597.11,
            D0_TOTAL_BET_FLOW: 4560.57,

            // 付费 & 投注（D7）
            D7_unique_purchase: 401,
            D7_PURCHASE_VALUE: 4216.62,
            D7_TOTAL_BET_PLACED_USER: 438,
            D7_SPORTS_BET_PLACED_USER: 232,
            D7_GAMES_BET_PLACED_USER: 281,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 16410.11,
            D7_GAMES_BET_FLOW: 10380.59,
            D7_TOTAL_BET_FLOW: 26790.69,

            // 留存
            D1_retained_users: 227,
            D7_retained_users: 171,
          },

          {
            date: "2025-10-12", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1600,
            D0_unique_purchase: 612,
            D0_PURCHASE_VALUE: 1339.29,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 557,
            D0_SPORTS_BET_PLACED_USER: 340,
            D0_GAMES_BET_PLACED_USER: 355,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 183.65,
            D0_GAMES_BET_FLOW: 5350.56,
            D0_TOTAL_BET_FLOW: 5534.21,

            // 付费 & 投注（D7）
            D7_unique_purchase: 758,
            D7_PURCHASE_VALUE: 3857.67,
            D7_TOTAL_BET_PLACED_USER: 767,
            D7_SPORTS_BET_PLACED_USER: 520,
            D7_GAMES_BET_PLACED_USER: 509,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1439.52,
            D7_GAMES_BET_FLOW: 17653.09,
            D7_TOTAL_BET_FLOW: 19092.61,

            // 留存
            D1_retained_users: 540,
            D7_retained_users: 181,
          },

          {
            date: "2025-10-12", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 876,
            D0_unique_purchase: 202,
            D0_PURCHASE_VALUE: 350.73,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 220,
            D0_SPORTS_BET_PLACED_USER: 118,
            D0_GAMES_BET_PLACED_USER: 141,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 67.65,
            D0_GAMES_BET_FLOW: 1231.09,
            D0_TOTAL_BET_FLOW: 1298.73,

            // 付费 & 投注（D7）
            D7_unique_purchase: 350,
            D7_PURCHASE_VALUE: 1703.81,
            D7_TOTAL_BET_PLACED_USER: 405,
            D7_SPORTS_BET_PLACED_USER: 272,
            D7_GAMES_BET_PLACED_USER: 261,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 200.32,
            D7_GAMES_BET_FLOW: 14580.89,
            D7_TOTAL_BET_FLOW: 14781.21,

            // 留存
            D1_retained_users: 221,
            D7_retained_users: 84,
          },

          {
            date: "2025-10-12", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 127,
            D0_unique_purchase: 46,
            D0_PURCHASE_VALUE: 137.31,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 50,
            D0_SPORTS_BET_PLACED_USER: 34,
            D0_GAMES_BET_PLACED_USER: 28,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 29.27,
            D0_GAMES_BET_FLOW: 405.71,
            D0_TOTAL_BET_FLOW: 434.97,

            // 付费 & 投注（D7）
            D7_unique_purchase: 57,
            D7_PURCHASE_VALUE: 295.76,
            D7_TOTAL_BET_PLACED_USER: 67,
            D7_SPORTS_BET_PLACED_USER: 48,
            D7_GAMES_BET_PLACED_USER: 39,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 99.61,
            D7_GAMES_BET_FLOW: 1030.07,
            D7_TOTAL_BET_FLOW: 1129.68,

            // 留存
            D1_retained_users: 54,
            D7_retained_users: 28,
          },

          {
            date: "2025-10-13", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 268,
            D0_unique_purchase: 121,
            D0_PURCHASE_VALUE: 1392.23,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 112,
            D0_SPORTS_BET_PLACED_USER: 61,
            D0_GAMES_BET_PLACED_USER: 79,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 148.9,
            D0_GAMES_BET_FLOW: 10162.16,
            D0_TOTAL_BET_FLOW: 10311.06,

            // 付费 & 投注（D7）
            D7_unique_purchase: 151,
            D7_PURCHASE_VALUE: 4894.46,
            D7_TOTAL_BET_PLACED_USER: 148,
            D7_SPORTS_BET_PLACED_USER: 92,
            D7_GAMES_BET_PLACED_USER: 104,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 768.96,
            D7_GAMES_BET_FLOW: 34474.13,
            D7_TOTAL_BET_FLOW: 35243.09,

            // 留存
            D1_retained_users: 116,
            D7_retained_users: 39,
          },

          {
            date: "2025-10-13", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 994,
            D0_unique_purchase: 269,
            D0_PURCHASE_VALUE: 415.06,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 320,
            D0_SPORTS_BET_PLACED_USER: 113,
            D0_GAMES_BET_PLACED_USER: 229,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 33.11,
            D0_GAMES_BET_FLOW: 3033.14,
            D0_TOTAL_BET_FLOW: 3066.25,

            // 付费 & 投注（D7）
            D7_unique_purchase: 345,
            D7_PURCHASE_VALUE: 1463.08,
            D7_TOTAL_BET_PLACED_USER: 413,
            D7_SPORTS_BET_PLACED_USER: 165,
            D7_GAMES_BET_PLACED_USER: 309,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 70.01,
            D7_GAMES_BET_FLOW: 9102.2,
            D7_TOTAL_BET_FLOW: 9172.21,

            // 留存
            D1_retained_users: 278,
            D7_retained_users: 70,
          },

          {
            date: "2025-10-13", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1413,
            D0_unique_purchase: 509,
            D0_PURCHASE_VALUE: 637.89,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 460,
            D0_SPORTS_BET_PLACED_USER: 274,
            D0_GAMES_BET_PLACED_USER: 284,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 144.08,
            D0_GAMES_BET_FLOW: 2662.1,
            D0_TOTAL_BET_FLOW: 2806.18,

            // 付费 & 投注（D7）
            D7_unique_purchase: 640,
            D7_PURCHASE_VALUE: 2492.45,
            D7_TOTAL_BET_PLACED_USER: 646,
            D7_SPORTS_BET_PLACED_USER: 435,
            D7_GAMES_BET_PLACED_USER: 414,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 529.05,
            D7_GAMES_BET_FLOW: 11201.3,
            D7_TOTAL_BET_FLOW: 11730.35,

            // 留存
            D1_retained_users: 499,
            D7_retained_users: 128,
          },

          {
            date: "2025-10-13", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1092,
            D0_unique_purchase: 193,
            D0_PURCHASE_VALUE: 421.04,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 233,
            D0_SPORTS_BET_PLACED_USER: 135,
            D0_GAMES_BET_PLACED_USER: 141,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 31.71,
            D0_GAMES_BET_FLOW: 1646.4,
            D0_TOTAL_BET_FLOW: 1678.11,

            // 付费 & 投注（D7）
            D7_unique_purchase: 394,
            D7_PURCHASE_VALUE: 1038.48,
            D7_TOTAL_BET_PLACED_USER: 426,
            D7_SPORTS_BET_PLACED_USER: 284,
            D7_GAMES_BET_PLACED_USER: 254,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 142.42,
            D7_GAMES_BET_FLOW: 4968.02,
            D7_TOTAL_BET_FLOW: 5110.45,

            // 留存
            D1_retained_users: 298,
            D7_retained_users: 65,
          },

          {
            date: "2025-10-13", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 135,
            D0_unique_purchase: 44,
            D0_PURCHASE_VALUE: 415.33,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 43,
            D0_SPORTS_BET_PLACED_USER: 21,
            D0_GAMES_BET_PLACED_USER: 30,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 220.77,
            D0_GAMES_BET_FLOW: 1297.59,
            D0_TOTAL_BET_FLOW: 1518.36,

            // 付费 & 投注（D7）
            D7_unique_purchase: 58,
            D7_PURCHASE_VALUE: 1107.41,
            D7_TOTAL_BET_PLACED_USER: 62,
            D7_SPORTS_BET_PLACED_USER: 39,
            D7_GAMES_BET_PLACED_USER: 39,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 604.98,
            D7_GAMES_BET_FLOW: 4056.76,
            D7_TOTAL_BET_FLOW: 4661.75,

            // 留存
            D1_retained_users: 62,
            D7_retained_users: 22,
          },

          {
            date: "2025-10-14", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 322,
            D0_unique_purchase: 142,
            D0_PURCHASE_VALUE: 1992.54,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 130,
            D0_SPORTS_BET_PLACED_USER: 59,
            D0_GAMES_BET_PLACED_USER: 102,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 708.35,
            D0_GAMES_BET_FLOW: 2304.91,
            D0_TOTAL_BET_FLOW: 3013.26,

            // 付费 & 投注（D7）
            D7_unique_purchase: 170,
            D7_PURCHASE_VALUE: 4624.62,
            D7_TOTAL_BET_PLACED_USER: 165,
            D7_SPORTS_BET_PLACED_USER: 95,
            D7_GAMES_BET_PLACED_USER: 134,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1249.48,
            D7_GAMES_BET_FLOW: 11316.27,
            D7_TOTAL_BET_FLOW: 12565.75,

            // 留存
            D1_retained_users: 137,
            D7_retained_users: 52,
          },

          {
            date: "2025-10-14", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 772,
            D0_unique_purchase: 264,
            D0_PURCHASE_VALUE: 441.31,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 257,
            D0_SPORTS_BET_PLACED_USER: 79,
            D0_GAMES_BET_PLACED_USER: 209,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 39.18,
            D0_GAMES_BET_FLOW: 2061.42,
            D0_TOTAL_BET_FLOW: 2100.6,

            // 付费 & 投注（D7）
            D7_unique_purchase: 347,
            D7_PURCHASE_VALUE: 1966.45,
            D7_TOTAL_BET_PLACED_USER: 371,
            D7_SPORTS_BET_PLACED_USER: 167,
            D7_GAMES_BET_PLACED_USER: 280,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 100.74,
            D7_GAMES_BET_FLOW: 10932.83,
            D7_TOTAL_BET_FLOW: 11033.57,

            // 留存
            D1_retained_users: 254,
            D7_retained_users: 71,
          },

          {
            date: "2025-10-14", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1472,
            D0_unique_purchase: 514,
            D0_PURCHASE_VALUE: 684.26,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 469,
            D0_SPORTS_BET_PLACED_USER: 277,
            D0_GAMES_BET_PLACED_USER: 293,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 355.94,
            D0_GAMES_BET_FLOW: 2397.85,
            D0_TOTAL_BET_FLOW: 2753.79,

            // 付费 & 投注（D7）
            D7_unique_purchase: 647,
            D7_PURCHASE_VALUE: 2828.71,
            D7_TOTAL_BET_PLACED_USER: 643,
            D7_SPORTS_BET_PLACED_USER: 429,
            D7_GAMES_BET_PLACED_USER: 412,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 839.29,
            D7_GAMES_BET_FLOW: 13437.64,
            D7_TOTAL_BET_FLOW: 14276.93,

            // 留存
            D1_retained_users: 491,
            D7_retained_users: 150,
          },

          {
            date: "2025-10-14", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1146,
            D0_unique_purchase: 213,
            D0_PURCHASE_VALUE: 795.22,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 203,
            D0_SPORTS_BET_PLACED_USER: 83,
            D0_GAMES_BET_PLACED_USER: 145,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 443.83,
            D0_GAMES_BET_FLOW: 1616.98,
            D0_TOTAL_BET_FLOW: 2060.81,

            // 付费 & 投注（D7）
            D7_unique_purchase: 384,
            D7_PURCHASE_VALUE: 2327.53,
            D7_TOTAL_BET_PLACED_USER: 410,
            D7_SPORTS_BET_PLACED_USER: 237,
            D7_GAMES_BET_PLACED_USER: 267,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1423.05,
            D7_GAMES_BET_FLOW: 9008.22,
            D7_TOTAL_BET_FLOW: 10431.26,

            // 留存
            D1_retained_users: 274,
            D7_retained_users: 84,
          },

          {
            date: "2025-10-14", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 118,
            D0_unique_purchase: 46,
            D0_PURCHASE_VALUE: 111.89,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 44,
            D0_SPORTS_BET_PLACED_USER: 25,
            D0_GAMES_BET_PLACED_USER: 27,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 22.55,
            D0_GAMES_BET_FLOW: 388.83,
            D0_TOTAL_BET_FLOW: 411.38,

            // 付费 & 投注（D7）
            D7_unique_purchase: 52,
            D7_PURCHASE_VALUE: 301.74,
            D7_TOTAL_BET_PLACED_USER: 53,
            D7_SPORTS_BET_PLACED_USER: 34,
            D7_GAMES_BET_PLACED_USER: 35,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 55.04,
            D7_GAMES_BET_FLOW: 1184.22,
            D7_TOTAL_BET_FLOW: 1239.25,

            // 留存
            D1_retained_users: 52,
            D7_retained_users: 19,
          },

          {
            date: "2025-10-15", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 340,
            D0_unique_purchase: 160,
            D0_PURCHASE_VALUE: 781.69,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 143,
            D0_SPORTS_BET_PLACED_USER: 76,
            D0_GAMES_BET_PLACED_USER: 91,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 76.12,
            D0_GAMES_BET_FLOW: 3753.46,
            D0_TOTAL_BET_FLOW: 3829.58,

            // 付费 & 投注（D7）
            D7_unique_purchase: 194,
            D7_PURCHASE_VALUE: 3531.25,
            D7_TOTAL_BET_PLACED_USER: 197,
            D7_SPORTS_BET_PLACED_USER: 116,
            D7_GAMES_BET_PLACED_USER: 132,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 348.92,
            D7_GAMES_BET_FLOW: 14589.05,
            D7_TOTAL_BET_FLOW: 14937.97,

            // 留存
            D1_retained_users: 143,
            D7_retained_users: 53,
          },

          {
            date: "2025-10-15", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 667,
            D0_unique_purchase: 270,
            D0_PURCHASE_VALUE: 630.24,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 272,
            D0_SPORTS_BET_PLACED_USER: 52,
            D0_GAMES_BET_PLACED_USER: 248,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 26.59,
            D0_GAMES_BET_FLOW: 2054.81,
            D0_TOTAL_BET_FLOW: 2081.39,

            // 付费 & 投注（D7）
            D7_unique_purchase: 328,
            D7_PURCHASE_VALUE: 1455.65,
            D7_TOTAL_BET_PLACED_USER: 365,
            D7_SPORTS_BET_PLACED_USER: 111,
            D7_GAMES_BET_PLACED_USER: 326,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 65.12,
            D7_GAMES_BET_FLOW: 9670.63,
            D7_TOTAL_BET_FLOW: 9735.75,

            // 留存
            D1_retained_users: 252,
            D7_retained_users: 76,
          },

          {
            date: "2025-10-15", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1459,
            D0_unique_purchase: 526,
            D0_PURCHASE_VALUE: 1187.12,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 462,
            D0_SPORTS_BET_PLACED_USER: 266,
            D0_GAMES_BET_PLACED_USER: 287,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 877.56,
            D0_GAMES_BET_FLOW: 3110.06,
            D0_TOTAL_BET_FLOW: 3987.62,

            // 付费 & 投注（D7）
            D7_unique_purchase: 671,
            D7_PURCHASE_VALUE: 5254.38,
            D7_TOTAL_BET_PLACED_USER: 663,
            D7_SPORTS_BET_PLACED_USER: 425,
            D7_GAMES_BET_PLACED_USER: 432,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 14029.72,
            D7_GAMES_BET_FLOW: 11920.61,
            D7_TOTAL_BET_FLOW: 25950.33,

            // 留存
            D1_retained_users: 501,
            D7_retained_users: 162,
          },

          {
            date: "2025-10-15", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 908,
            D0_unique_purchase: 179,
            D0_PURCHASE_VALUE: 385.74,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 170,
            D0_SPORTS_BET_PLACED_USER: 71,
            D0_GAMES_BET_PLACED_USER: 132,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 21.35,
            D0_GAMES_BET_FLOW: 2992.49,
            D0_TOTAL_BET_FLOW: 3013.84,

            // 付费 & 投注（D7）
            D7_unique_purchase: 325,
            D7_PURCHASE_VALUE: 974.02,
            D7_TOTAL_BET_PLACED_USER: 337,
            D7_SPORTS_BET_PLACED_USER: 186,
            D7_GAMES_BET_PLACED_USER: 213,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 124.08,
            D7_GAMES_BET_FLOW: 7387.77,
            D7_TOTAL_BET_FLOW: 7511.85,

            // 留存
            D1_retained_users: 212,
            D7_retained_users: 97,
          },

          {
            date: "2025-10-15", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 144,
            D0_unique_purchase: 50,
            D0_PURCHASE_VALUE: 276.03,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 49,
            D0_SPORTS_BET_PLACED_USER: 34,
            D0_GAMES_BET_PLACED_USER: 24,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 73.3,
            D0_GAMES_BET_FLOW: 1940.73,
            D0_TOTAL_BET_FLOW: 2014.03,

            // 付费 & 投注（D7）
            D7_unique_purchase: 60,
            D7_PURCHASE_VALUE: 338.56,
            D7_TOTAL_BET_PLACED_USER: 68,
            D7_SPORTS_BET_PLACED_USER: 55,
            D7_GAMES_BET_PLACED_USER: 31,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 130.46,
            D7_GAMES_BET_FLOW: 2204.07,
            D7_TOTAL_BET_FLOW: 2334.53,

            // 留存
            D1_retained_users: 64,
            D7_retained_users: 36,
          },

          {
            date: "2025-10-16", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 322,
            D0_unique_purchase: 155,
            D0_PURCHASE_VALUE: 1025.08,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 147,
            D0_SPORTS_BET_PLACED_USER: 76,
            D0_GAMES_BET_PLACED_USER: 113,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 441.71,
            D0_GAMES_BET_FLOW: 2273.71,
            D0_TOTAL_BET_FLOW: 2715.42,

            // 付费 & 投注（D7）
            D7_unique_purchase: 194,
            D7_PURCHASE_VALUE: 4052.85,
            D7_TOTAL_BET_PLACED_USER: 198,
            D7_SPORTS_BET_PLACED_USER: 132,
            D7_GAMES_BET_PLACED_USER: 143,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2426.89,
            D7_GAMES_BET_FLOW: 19932.75,
            D7_TOTAL_BET_FLOW: 22359.64,

            // 留存
            D1_retained_users: 157,
            D7_retained_users: 61,
          },

          {
            date: "2025-10-16", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 683,
            D0_unique_purchase: 242,
            D0_PURCHASE_VALUE: 2758.48,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 245,
            D0_SPORTS_BET_PLACED_USER: 47,
            D0_GAMES_BET_PLACED_USER: 217,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 186.93,
            D0_GAMES_BET_FLOW: 15339.12,
            D0_TOTAL_BET_FLOW: 15526.05,

            // 付费 & 投注（D7）
            D7_unique_purchase: 292,
            D7_PURCHASE_VALUE: 3789.22,
            D7_TOTAL_BET_PLACED_USER: 321,
            D7_SPORTS_BET_PLACED_USER: 112,
            D7_GAMES_BET_PLACED_USER: 271,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 247.3,
            D7_GAMES_BET_FLOW: 21994.57,
            D7_TOTAL_BET_FLOW: 22241.87,

            // 留存
            D1_retained_users: 188,
            D7_retained_users: 70,
          },

          {
            date: "2025-10-16", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1658,
            D0_unique_purchase: 553,
            D0_PURCHASE_VALUE: 935.26,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 504,
            D0_SPORTS_BET_PLACED_USER: 324,
            D0_GAMES_BET_PLACED_USER: 287,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 190.85,
            D0_GAMES_BET_FLOW: 7685.5,
            D0_TOTAL_BET_FLOW: 7876.35,

            // 付费 & 投注（D7）
            D7_unique_purchase: 709,
            D7_PURCHASE_VALUE: 6786.29,
            D7_TOTAL_BET_PLACED_USER: 713,
            D7_SPORTS_BET_PLACED_USER: 493,
            D7_GAMES_BET_PLACED_USER: 425,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1817.35,
            D7_GAMES_BET_FLOW: 55910.47,
            D7_TOTAL_BET_FLOW: 57727.82,

            // 留存
            D1_retained_users: 584,
            D7_retained_users: 172,
          },

          {
            date: "2025-10-16", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 592,
            D0_unique_purchase: 158,
            D0_PURCHASE_VALUE: 609.42,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 152,
            D0_SPORTS_BET_PLACED_USER: 66,
            D0_GAMES_BET_PLACED_USER: 111,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 36.59,
            D0_GAMES_BET_FLOW: 2256.84,
            D0_TOTAL_BET_FLOW: 2293.43,

            // 付费 & 投注（D7）
            D7_unique_purchase: 233,
            D7_PURCHASE_VALUE: 1981.52,
            D7_TOTAL_BET_PLACED_USER: 263,
            D7_SPORTS_BET_PLACED_USER: 169,
            D7_GAMES_BET_PLACED_USER: 161,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 235.35,
            D7_GAMES_BET_FLOW: 7749.58,
            D7_TOTAL_BET_FLOW: 7984.93,

            // 留存
            D1_retained_users: 180,
            D7_retained_users: 72,
          },

          {
            date: "2025-10-16", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 163,
            D0_unique_purchase: 25,
            D0_PURCHASE_VALUE: 82.79,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 32,
            D0_SPORTS_BET_PLACED_USER: 26,
            D0_GAMES_BET_PLACED_USER: 13,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 66.88,
            D0_GAMES_BET_FLOW: 202.36,
            D0_TOTAL_BET_FLOW: 269.23,

            // 付费 & 投注（D7）
            D7_unique_purchase: 34,
            D7_PURCHASE_VALUE: 542.7,
            D7_TOTAL_BET_PLACED_USER: 57,
            D7_SPORTS_BET_PLACED_USER: 52,
            D7_GAMES_BET_PLACED_USER: 22,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 297.4,
            D7_GAMES_BET_FLOW: 1762.28,
            D7_TOTAL_BET_FLOW: 2059.68,

            // 留存
            D1_retained_users: 59,
            D7_retained_users: 25,
          },

          {
            date: "2025-10-17", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 311,
            D0_unique_purchase: 164,
            D0_PURCHASE_VALUE: 520.77,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 160,
            D0_SPORTS_BET_PLACED_USER: 118,
            D0_GAMES_BET_PLACED_USER: 71,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 91.05,
            D0_GAMES_BET_FLOW: 764.3,
            D0_TOTAL_BET_FLOW: 855.35,

            // 付费 & 投注（D7）
            D7_unique_purchase: 195,
            D7_PURCHASE_VALUE: 1558.08,
            D7_TOTAL_BET_PLACED_USER: 199,
            D7_SPORTS_BET_PLACED_USER: 153,
            D7_GAMES_BET_PLACED_USER: 111,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 344.86,
            D7_GAMES_BET_FLOW: 3979.37,
            D7_TOTAL_BET_FLOW: 4324.23,

            // 留存
            D1_retained_users: 138,
            D7_retained_users: 51,
          },

          {
            date: "2025-10-17", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 796,
            D0_unique_purchase: 277,
            D0_PURCHASE_VALUE: 497.5,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 275,
            D0_SPORTS_BET_PLACED_USER: 68,
            D0_GAMES_BET_PLACED_USER: 242,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 20.45,
            D0_GAMES_BET_FLOW: 2356.73,
            D0_TOTAL_BET_FLOW: 2377.18,

            // 付费 & 投注（D7）
            D7_unique_purchase: 316,
            D7_PURCHASE_VALUE: 1755.64,
            D7_TOTAL_BET_PLACED_USER: 390,
            D7_SPORTS_BET_PLACED_USER: 185,
            D7_GAMES_BET_PLACED_USER: 298,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 85.17,
            D7_GAMES_BET_FLOW: 12841.72,
            D7_TOTAL_BET_FLOW: 12926.88,

            // 留存
            D1_retained_users: 243,
            D7_retained_users: 70,
          },

          {
            date: "2025-10-17", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1532,
            D0_unique_purchase: 534,
            D0_PURCHASE_VALUE: 1401.23,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 493,
            D0_SPORTS_BET_PLACED_USER: 289,
            D0_GAMES_BET_PLACED_USER: 291,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 563.45,
            D0_GAMES_BET_FLOW: 4414.11,
            D0_TOTAL_BET_FLOW: 4977.55,

            // 付费 & 投注（D7）
            D7_unique_purchase: 671,
            D7_PURCHASE_VALUE: 5079.22,
            D7_TOTAL_BET_PLACED_USER: 671,
            D7_SPORTS_BET_PLACED_USER: 441,
            D7_GAMES_BET_PLACED_USER: 424,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2198.61,
            D7_GAMES_BET_FLOW: 20979.32,
            D7_TOTAL_BET_FLOW: 23177.92,

            // 留存
            D1_retained_users: 561,
            D7_retained_users: 142,
          },

          {
            date: "2025-10-17", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 946,
            D0_unique_purchase: 185,
            D0_PURCHASE_VALUE: 430.78,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 221,
            D0_SPORTS_BET_PLACED_USER: 142,
            D0_GAMES_BET_PLACED_USER: 118,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 69.39,
            D0_GAMES_BET_FLOW: 1291.0,
            D0_TOTAL_BET_FLOW: 1360.4,

            // 付费 & 投注（D7）
            D7_unique_purchase: 383,
            D7_PURCHASE_VALUE: 2199.55,
            D7_TOTAL_BET_PLACED_USER: 435,
            D7_SPORTS_BET_PLACED_USER: 300,
            D7_GAMES_BET_PLACED_USER: 221,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1057.69,
            D7_GAMES_BET_FLOW: 3454.4,
            D7_TOTAL_BET_FLOW: 4512.08,

            // 留存
            D1_retained_users: 290,
            D7_retained_users: 97,
          },

          {
            date: "2025-10-17", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 141,
            D0_unique_purchase: 35,
            D0_PURCHASE_VALUE: 136.79,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 37,
            D0_SPORTS_BET_PLACED_USER: 25,
            D0_GAMES_BET_PLACED_USER: 14,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 25.93,
            D0_GAMES_BET_FLOW: 101.47,
            D0_TOTAL_BET_FLOW: 127.4,

            // 付费 & 投注（D7）
            D7_unique_purchase: 42,
            D7_PURCHASE_VALUE: 412.54,
            D7_TOTAL_BET_PLACED_USER: 52,
            D7_SPORTS_BET_PLACED_USER: 39,
            D7_GAMES_BET_PLACED_USER: 23,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 191.29,
            D7_GAMES_BET_FLOW: 1520.47,
            D7_TOTAL_BET_FLOW: 1711.76,

            // 留存
            D1_retained_users: 68,
            D7_retained_users: 21,
          },

          {
            date: "2025-10-18", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 321,
            D0_unique_purchase: 203,
            D0_PURCHASE_VALUE: 802.23,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 196,
            D0_SPORTS_BET_PLACED_USER: 141,
            D0_GAMES_BET_PLACED_USER: 91,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 198.35,
            D0_GAMES_BET_FLOW: 1967.87,
            D0_TOTAL_BET_FLOW: 2166.22,

            // 付费 & 投注（D7）
            D7_unique_purchase: 241,
            D7_PURCHASE_VALUE: 2168.77,
            D7_TOTAL_BET_PLACED_USER: 244,
            D7_SPORTS_BET_PLACED_USER: 190,
            D7_GAMES_BET_PLACED_USER: 128,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 643.28,
            D7_GAMES_BET_FLOW: 6495.81,
            D7_TOTAL_BET_FLOW: 7139.09,

            // 留存
            D1_retained_users: 140,
            D7_retained_users: 48,
          },

          {
            date: "2025-10-18", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 875,
            D0_unique_purchase: 388,
            D0_PURCHASE_VALUE: 328.44,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 376,
            D0_SPORTS_BET_PLACED_USER: 168,
            D0_GAMES_BET_PLACED_USER: 277,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 73.74,
            D0_GAMES_BET_FLOW: 1312.89,
            D0_TOTAL_BET_FLOW: 1386.63,

            // 付费 & 投注（D7）
            D7_unique_purchase: 445,
            D7_PURCHASE_VALUE: 1187.72,
            D7_TOTAL_BET_PLACED_USER: 463,
            D7_SPORTS_BET_PLACED_USER: 240,
            D7_GAMES_BET_PLACED_USER: 353,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 231.09,
            D7_GAMES_BET_FLOW: 6616.75,
            D7_TOTAL_BET_FLOW: 6847.84,

            // 留存
            D1_retained_users: 348,
            D7_retained_users: 115,
          },

          {
            date: "2025-10-18", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1558,
            D0_unique_purchase: 593,
            D0_PURCHASE_VALUE: 1031.03,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 547,
            D0_SPORTS_BET_PLACED_USER: 365,
            D0_GAMES_BET_PLACED_USER: 277,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 1074.18,
            D0_GAMES_BET_FLOW: 2296.58,
            D0_TOTAL_BET_FLOW: 3370.76,

            // 付费 & 投注（D7）
            D7_unique_purchase: 744,
            D7_PURCHASE_VALUE: 3800.67,
            D7_TOTAL_BET_PLACED_USER: 758,
            D7_SPORTS_BET_PLACED_USER: 548,
            D7_GAMES_BET_PLACED_USER: 443,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 3582.82,
            D7_GAMES_BET_FLOW: 9154.63,
            D7_TOTAL_BET_FLOW: 12737.45,

            // 留存
            D1_retained_users: 582,
            D7_retained_users: 199,
          },

          {
            date: "2025-10-18", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1006,
            D0_unique_purchase: 229,
            D0_PURCHASE_VALUE: 304.27,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 222,
            D0_SPORTS_BET_PLACED_USER: 148,
            D0_GAMES_BET_PLACED_USER: 125,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 107.59,
            D0_GAMES_BET_FLOW: 943.24,
            D0_TOTAL_BET_FLOW: 1050.83,

            // 付费 & 投注（D7）
            D7_unique_purchase: 353,
            D7_PURCHASE_VALUE: 2567.86,
            D7_TOTAL_BET_PLACED_USER: 378,
            D7_SPORTS_BET_PLACED_USER: 275,
            D7_GAMES_BET_PLACED_USER: 215,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 403.51,
            D7_GAMES_BET_FLOW: 9541.37,
            D7_TOTAL_BET_FLOW: 9944.88,

            // 留存
            D1_retained_users: 284,
            D7_retained_users: 181,
          },

          {
            date: "2025-10-18", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 216,
            D0_unique_purchase: 56,
            D0_PURCHASE_VALUE: 293.92,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 60,
            D0_SPORTS_BET_PLACED_USER: 52,
            D0_GAMES_BET_PLACED_USER: 17,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 90.08,
            D0_GAMES_BET_FLOW: 1684.23,
            D0_TOTAL_BET_FLOW: 1774.31,

            // 付费 & 投注（D7）
            D7_unique_purchase: 69,
            D7_PURCHASE_VALUE: 1276.35,
            D7_TOTAL_BET_PLACED_USER: 93,
            D7_SPORTS_BET_PLACED_USER: 82,
            D7_GAMES_BET_PLACED_USER: 35,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 323.54,
            D7_GAMES_BET_FLOW: 7719.05,
            D7_TOTAL_BET_FLOW: 8042.59,

            // 留存
            D1_retained_users: 89,
            D7_retained_users: 46,
          },

          {
            date: "2025-10-19", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 334,
            D0_unique_purchase: 197,
            D0_PURCHASE_VALUE: 1119.23,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 189,
            D0_SPORTS_BET_PLACED_USER: 127,
            D0_GAMES_BET_PLACED_USER: 97,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 731.27,
            D0_GAMES_BET_FLOW: 1221.66,
            D0_TOTAL_BET_FLOW: 1952.92,

            // 付费 & 投注（D7）
            D7_unique_purchase: 232,
            D7_PURCHASE_VALUE: 2722.46,
            D7_TOTAL_BET_PLACED_USER: 231,
            D7_SPORTS_BET_PLACED_USER: 166,
            D7_GAMES_BET_PLACED_USER: 136,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1878.17,
            D7_GAMES_BET_FLOW: 3008.99,
            D7_TOTAL_BET_FLOW: 4887.16,

            // 留存
            D1_retained_users: 126,
            D7_retained_users: 69,
          },

          {
            date: "2025-10-19", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 750,
            D0_unique_purchase: 295,
            D0_PURCHASE_VALUE: 485.38,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 280,
            D0_SPORTS_BET_PLACED_USER: 98,
            D0_GAMES_BET_PLACED_USER: 230,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 41.83,
            D0_GAMES_BET_FLOW: 2512.5,
            D0_TOTAL_BET_FLOW: 2554.34,

            // 付费 & 投注（D7）
            D7_unique_purchase: 371,
            D7_PURCHASE_VALUE: 2293.2,
            D7_TOTAL_BET_PLACED_USER: 391,
            D7_SPORTS_BET_PLACED_USER: 186,
            D7_GAMES_BET_PLACED_USER: 314,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 160.92,
            D7_GAMES_BET_FLOW: 33532.71,
            D7_TOTAL_BET_FLOW: 33693.62,

            // 留存
            D1_retained_users: 250,
            D7_retained_users: 105,
          },

          {
            date: "2025-10-19", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1472,
            D0_unique_purchase: 560,
            D0_PURCHASE_VALUE: 1379.97,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 519,
            D0_SPORTS_BET_PLACED_USER: 350,
            D0_GAMES_BET_PLACED_USER: 295,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 658.91,
            D0_GAMES_BET_FLOW: 4367.6,
            D0_TOTAL_BET_FLOW: 5026.51,

            // 付费 & 投注（D7）
            D7_unique_purchase: 723,
            D7_PURCHASE_VALUE: 4054.3,
            D7_TOTAL_BET_PLACED_USER: 719,
            D7_SPORTS_BET_PLACED_USER: 520,
            D7_GAMES_BET_PLACED_USER: 446,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2379.1,
            D7_GAMES_BET_FLOW: 12960.98,
            D7_TOTAL_BET_FLOW: 15340.09,

            // 留存
            D1_retained_users: 555,
            D7_retained_users: 187,
          },

          {
            date: "2025-10-19", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1169,
            D0_unique_purchase: 265,
            D0_PURCHASE_VALUE: 472.32,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 340,
            D0_SPORTS_BET_PLACED_USER: 249,
            D0_GAMES_BET_PLACED_USER: 156,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 132.73,
            D0_GAMES_BET_FLOW: 1933.6,
            D0_TOTAL_BET_FLOW: 2066.33,

            // 付费 & 投注（D7）
            D7_unique_purchase: 492,
            D7_PURCHASE_VALUE: 1309.19,
            D7_TOTAL_BET_PLACED_USER: 520,
            D7_SPORTS_BET_PLACED_USER: 400,
            D7_GAMES_BET_PLACED_USER: 235,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 474.28,
            D7_GAMES_BET_FLOW: 5424.69,
            D7_TOTAL_BET_FLOW: 5898.97,

            // 留存
            D1_retained_users: 381,
            D7_retained_users: 114,
          },

          {
            date: "2025-10-19", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 161,
            D0_unique_purchase: 40,
            D0_PURCHASE_VALUE: 67.66,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 46,
            D0_SPORTS_BET_PLACED_USER: 40,
            D0_GAMES_BET_PLACED_USER: 12,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 59.76,
            D0_GAMES_BET_FLOW: 66.96,
            D0_TOTAL_BET_FLOW: 126.72,

            // 付费 & 投注（D7）
            D7_unique_purchase: 51,
            D7_PURCHASE_VALUE: 152.71,
            D7_TOTAL_BET_PLACED_USER: 66,
            D7_SPORTS_BET_PLACED_USER: 59,
            D7_GAMES_BET_PLACED_USER: 20,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 539.81,
            D7_GAMES_BET_FLOW: 147.68,
            D7_TOTAL_BET_FLOW: 687.48,

            // 留存
            D1_retained_users: 49,
            D7_retained_users: 31,
          },

          {
            date: "2025-10-20", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 429,
            D0_unique_purchase: 135,
            D0_PURCHASE_VALUE: 490.77,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 131,
            D0_SPORTS_BET_PLACED_USER: 76,
            D0_GAMES_BET_PLACED_USER: 90,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 133.03,
            D0_GAMES_BET_FLOW: 1824.03,
            D0_TOTAL_BET_FLOW: 1957.06,

            // 付费 & 投注（D7）
            D7_unique_purchase: 256,
            D7_PURCHASE_VALUE: 3599.85,
            D7_TOTAL_BET_PLACED_USER: 258,
            D7_SPORTS_BET_PLACED_USER: 202,
            D7_GAMES_BET_PLACED_USER: 136,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 810.29,
            D7_GAMES_BET_FLOW: 22033.2,
            D7_TOTAL_BET_FLOW: 22843.5,

            // 留存
            D1_retained_users: 156,
            D7_retained_users: 42,
          },

          {
            date: "2025-10-20", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 744,
            D0_unique_purchase: 288,
            D0_PURCHASE_VALUE: 392.65,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 279,
            D0_SPORTS_BET_PLACED_USER: 66,
            D0_GAMES_BET_PLACED_USER: 236,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 22.0,
            D0_GAMES_BET_FLOW: 1601.31,
            D0_TOTAL_BET_FLOW: 1623.31,

            // 付费 & 投注（D7）
            D7_unique_purchase: 363,
            D7_PURCHASE_VALUE: 968.86,
            D7_TOTAL_BET_PLACED_USER: 400,
            D7_SPORTS_BET_PLACED_USER: 158,
            D7_GAMES_BET_PLACED_USER: 341,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 142.91,
            D7_GAMES_BET_FLOW: 4976.17,
            D7_TOTAL_BET_FLOW: 5119.08,

            // 留存
            D1_retained_users: 328,
            D7_retained_users: 82,
          },

          {
            date: "2025-10-20", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1567,
            D0_unique_purchase: 564,
            D0_PURCHASE_VALUE: 1265.39,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 514,
            D0_SPORTS_BET_PLACED_USER: 297,
            D0_GAMES_BET_PLACED_USER: 311,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 417.5,
            D0_GAMES_BET_FLOW: 12423.14,
            D0_TOTAL_BET_FLOW: 12840.63,

            // 付费 & 投注（D7）
            D7_unique_purchase: 705,
            D7_PURCHASE_VALUE: 4627.52,
            D7_TOTAL_BET_PLACED_USER: 715,
            D7_SPORTS_BET_PLACED_USER: 485,
            D7_GAMES_BET_PLACED_USER: 445,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1630.65,
            D7_GAMES_BET_FLOW: 26382.79,
            D7_TOTAL_BET_FLOW: 28013.44,

            // 留存
            D1_retained_users: 578,
            D7_retained_users: 136,
          },

          {
            date: "2025-10-20", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 989,
            D0_unique_purchase: 180,
            D0_PURCHASE_VALUE: 283.45,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 252,
            D0_SPORTS_BET_PLACED_USER: 165,
            D0_GAMES_BET_PLACED_USER: 108,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 45.8,
            D0_GAMES_BET_FLOW: 1414.24,
            D0_TOTAL_BET_FLOW: 1460.04,

            // 付费 & 投注（D7）
            D7_unique_purchase: 434,
            D7_PURCHASE_VALUE: 1077.02,
            D7_TOTAL_BET_PLACED_USER: 523,
            D7_SPORTS_BET_PLACED_USER: 376,
            D7_GAMES_BET_PLACED_USER: 257,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 309.24,
            D7_GAMES_BET_FLOW: 5919.04,
            D7_TOTAL_BET_FLOW: 6228.28,

            // 留存
            D1_retained_users: 301,
            D7_retained_users: 54,
          },

          {
            date: "2025-10-20", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 155,
            D0_unique_purchase: 35,
            D0_PURCHASE_VALUE: 96.01,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 38,
            D0_SPORTS_BET_PLACED_USER: 31,
            D0_GAMES_BET_PLACED_USER: 13,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 28.8,
            D0_GAMES_BET_FLOW: 265.18,
            D0_TOTAL_BET_FLOW: 293.98,

            // 付费 & 投注（D7）
            D7_unique_purchase: 38,
            D7_PURCHASE_VALUE: 306.98,
            D7_TOTAL_BET_PLACED_USER: 52,
            D7_SPORTS_BET_PLACED_USER: 45,
            D7_GAMES_BET_PLACED_USER: 22,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 91.85,
            D7_GAMES_BET_FLOW: 755.55,
            D7_TOTAL_BET_FLOW: 847.4,

            // 留存
            D1_retained_users: 53,
            D7_retained_users: 17,
          },

          {
            date: "2025-10-21", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 381,
            D0_unique_purchase: 194,
            D0_PURCHASE_VALUE: 3561.38,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 187,
            D0_SPORTS_BET_PLACED_USER: 116,
            D0_GAMES_BET_PLACED_USER: 125,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 81.21,
            D0_GAMES_BET_FLOW: 19194.27,
            D0_TOTAL_BET_FLOW: 19275.48,

            // 付费 & 投注（D7）
            D7_unique_purchase: 233,
            D7_PURCHASE_VALUE: 15173.46,
            D7_TOTAL_BET_PLACED_USER: 237,
            D7_SPORTS_BET_PLACED_USER: 163,
            D7_GAMES_BET_PLACED_USER: 174,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 376.7,
            D7_GAMES_BET_FLOW: 92649.83,
            D7_TOTAL_BET_FLOW: 93026.53,

            // 留存
            D1_retained_users: 208,
            D7_retained_users: 70,
          },

          {
            date: "2025-10-21", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1107,
            D0_unique_purchase: 340,
            D0_PURCHASE_VALUE: 1176.13,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 333,
            D0_SPORTS_BET_PLACED_USER: 123,
            D0_GAMES_BET_PLACED_USER: 258,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 65.6,
            D0_GAMES_BET_FLOW: 7615.47,
            D0_TOTAL_BET_FLOW: 7681.07,

            // 付费 & 投注（D7）
            D7_unique_purchase: 428,
            D7_PURCHASE_VALUE: 4874.22,
            D7_TOTAL_BET_PLACED_USER: 513,
            D7_SPORTS_BET_PLACED_USER: 272,
            D7_GAMES_BET_PLACED_USER: 344,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 206.79,
            D7_GAMES_BET_FLOW: 107365.99,
            D7_TOTAL_BET_FLOW: 107572.77,

            // 留存
            D1_retained_users: 368,
            D7_retained_users: 83,
          },

          {
            date: "2025-10-21", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1653,
            D0_unique_purchase: 621,
            D0_PURCHASE_VALUE: 2262.16,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 567,
            D0_SPORTS_BET_PLACED_USER: 371,
            D0_GAMES_BET_PLACED_USER: 339,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 3655.43,
            D0_GAMES_BET_FLOW: 2633.54,
            D0_TOTAL_BET_FLOW: 6288.97,

            // 付费 & 投注（D7）
            D7_unique_purchase: 782,
            D7_PURCHASE_VALUE: 6065.49,
            D7_TOTAL_BET_PLACED_USER: 784,
            D7_SPORTS_BET_PLACED_USER: 571,
            D7_GAMES_BET_PLACED_USER: 474,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 7544.99,
            D7_GAMES_BET_FLOW: 14607.23,
            D7_TOTAL_BET_FLOW: 22152.22,

            // 留存
            D1_retained_users: 648,
            D7_retained_users: 168,
          },

          {
            date: "2025-10-21", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1042,
            D0_unique_purchase: 199,
            D0_PURCHASE_VALUE: 276.28,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 300,
            D0_SPORTS_BET_PLACED_USER: 221,
            D0_GAMES_BET_PLACED_USER: 122,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 74.73,
            D0_GAMES_BET_FLOW: 1129.57,
            D0_TOTAL_BET_FLOW: 1204.3,

            // 付费 & 投注（D7）
            D7_unique_purchase: 369,
            D7_PURCHASE_VALUE: 1234.17,
            D7_TOTAL_BET_PLACED_USER: 428,
            D7_SPORTS_BET_PLACED_USER: 313,
            D7_GAMES_BET_PLACED_USER: 218,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 407.04,
            D7_GAMES_BET_FLOW: 5151.89,
            D7_TOTAL_BET_FLOW: 5558.93,

            // 留存
            D1_retained_users: 352,
            D7_retained_users: 93,
          },

          {
            date: "2025-10-21", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 221,
            D0_unique_purchase: 50,
            D0_PURCHASE_VALUE: 255.15,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 59,
            D0_SPORTS_BET_PLACED_USER: 46,
            D0_GAMES_BET_PLACED_USER: 23,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 69.16,
            D0_GAMES_BET_FLOW: 2840.79,
            D0_TOTAL_BET_FLOW: 2909.95,

            // 付费 & 投注（D7）
            D7_unique_purchase: 79,
            D7_PURCHASE_VALUE: 2122.1,
            D7_TOTAL_BET_PLACED_USER: 92,
            D7_SPORTS_BET_PLACED_USER: 79,
            D7_GAMES_BET_PLACED_USER: 38,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 579.97,
            D7_GAMES_BET_FLOW: 11720.96,
            D7_TOTAL_BET_FLOW: 12300.93,

            // 留存
            D1_retained_users: 72,
            D7_retained_users: 26,
          },

          {
            date: "2025-10-22", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 424,
            D0_unique_purchase: 203,
            D0_PURCHASE_VALUE: 2673.54,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 190,
            D0_SPORTS_BET_PLACED_USER: 119,
            D0_GAMES_BET_PLACED_USER: 112,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 384.14,
            D0_GAMES_BET_FLOW: 8470.48,
            D0_TOTAL_BET_FLOW: 8854.62,

            // 付费 & 投注（D7）
            D7_unique_purchase: 237,
            D7_PURCHASE_VALUE: 10090.85,
            D7_TOTAL_BET_PLACED_USER: 237,
            D7_SPORTS_BET_PLACED_USER: 164,
            D7_GAMES_BET_PLACED_USER: 157,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1125.65,
            D7_GAMES_BET_FLOW: 45836.27,
            D7_TOTAL_BET_FLOW: 46961.92,

            // 留存
            D1_retained_users: 196,
            D7_retained_users: 68,
          },

          {
            date: "2025-10-22", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1194,
            D0_unique_purchase: 354,
            D0_PURCHASE_VALUE: 409.99,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 345,
            D0_SPORTS_BET_PLACED_USER: 168,
            D0_GAMES_BET_PLACED_USER: 242,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 71.49,
            D0_GAMES_BET_FLOW: 1427.58,
            D0_TOTAL_BET_FLOW: 1499.07,

            // 付费 & 投注（D7）
            D7_unique_purchase: 451,
            D7_PURCHASE_VALUE: 1194.41,
            D7_TOTAL_BET_PLACED_USER: 548,
            D7_SPORTS_BET_PLACED_USER: 311,
            D7_GAMES_BET_PLACED_USER: 354,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 278.93,
            D7_GAMES_BET_FLOW: 5206.89,
            D7_TOTAL_BET_FLOW: 5485.82,

            // 留存
            D1_retained_users: 384,
            D7_retained_users: 103,
          },

          {
            date: "2025-10-22", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1604,
            D0_unique_purchase: 578,
            D0_PURCHASE_VALUE: 1037.78,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 536,
            D0_SPORTS_BET_PLACED_USER: 357,
            D0_GAMES_BET_PLACED_USER: 294,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 117.1,
            D0_GAMES_BET_FLOW: 4847.48,
            D0_TOTAL_BET_FLOW: 4964.58,

            // 付费 & 投注（D7）
            D7_unique_purchase: 716,
            D7_PURCHASE_VALUE: 3921.59,
            D7_TOTAL_BET_PLACED_USER: 709,
            D7_SPORTS_BET_PLACED_USER: 514,
            D7_GAMES_BET_PLACED_USER: 414,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 432.1,
            D7_GAMES_BET_FLOW: 27265.71,
            D7_TOTAL_BET_FLOW: 27697.81,

            // 留存
            D1_retained_users: 594,
            D7_retained_users: 145,
          },

          {
            date: "2025-10-22", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 745,
            D0_unique_purchase: 240,
            D0_PURCHASE_VALUE: 546.86,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 245,
            D0_SPORTS_BET_PLACED_USER: 165,
            D0_GAMES_BET_PLACED_USER: 132,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 121.81,
            D0_GAMES_BET_FLOW: 1592.39,
            D0_TOTAL_BET_FLOW: 1714.2,

            // 付费 & 投注（D7）
            D7_unique_purchase: 318,
            D7_PURCHASE_VALUE: 1319.1,
            D7_TOTAL_BET_PLACED_USER: 333,
            D7_SPORTS_BET_PLACED_USER: 240,
            D7_GAMES_BET_PLACED_USER: 194,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 494.24,
            D7_GAMES_BET_FLOW: 11027.55,
            D7_TOTAL_BET_FLOW: 11521.78,

            // 留存
            D1_retained_users: 302,
            D7_retained_users: 48,
          },

          {
            date: "2025-10-22", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 186,
            D0_unique_purchase: 46,
            D0_PURCHASE_VALUE: 139.15,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 50,
            D0_SPORTS_BET_PLACED_USER: 40,
            D0_GAMES_BET_PLACED_USER: 20,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 98.19,
            D0_GAMES_BET_FLOW: 504.84,
            D0_TOTAL_BET_FLOW: 603.03,

            // 付费 & 投注（D7）
            D7_unique_purchase: 65,
            D7_PURCHASE_VALUE: 538.27,
            D7_TOTAL_BET_PLACED_USER: 81,
            D7_SPORTS_BET_PLACED_USER: 70,
            D7_GAMES_BET_PLACED_USER: 29,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 198.18,
            D7_GAMES_BET_FLOW: 1914.24,
            D7_TOTAL_BET_FLOW: 2112.42,

            // 留存
            D1_retained_users: 74,
            D7_retained_users: 28,
          },

          {
            date: "2025-10-23", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 379,
            D0_unique_purchase: 153,
            D0_PURCHASE_VALUE: 758.46,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 150,
            D0_SPORTS_BET_PLACED_USER: 91,
            D0_GAMES_BET_PLACED_USER: 94,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 93.29,
            D0_GAMES_BET_FLOW: 4974.9,
            D0_TOTAL_BET_FLOW: 5068.19,

            // 付费 & 投注（D7）
            D7_unique_purchase: 207,
            D7_PURCHASE_VALUE: 4206.31,
            D7_TOTAL_BET_PLACED_USER: 212,
            D7_SPORTS_BET_PLACED_USER: 153,
            D7_GAMES_BET_PLACED_USER: 128,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 530.89,
            D7_GAMES_BET_FLOW: 21757.17,
            D7_TOTAL_BET_FLOW: 22288.06,

            // 留存
            D1_retained_users: 169,
            D7_retained_users: 47,
          },

          {
            date: "2025-10-23", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 821,
            D0_unique_purchase: 317,
            D0_PURCHASE_VALUE: 363.12,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 296,
            D0_SPORTS_BET_PLACED_USER: 94,
            D0_GAMES_BET_PLACED_USER: 243,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 36.46,
            D0_GAMES_BET_FLOW: 1864.63,
            D0_TOTAL_BET_FLOW: 1901.08,

            // 付费 & 投注（D7）
            D7_unique_purchase: 392,
            D7_PURCHASE_VALUE: 1357.87,
            D7_TOTAL_BET_PLACED_USER: 399,
            D7_SPORTS_BET_PLACED_USER: 179,
            D7_GAMES_BET_PLACED_USER: 322,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 88.11,
            D7_GAMES_BET_FLOW: 8504.14,
            D7_TOTAL_BET_FLOW: 8592.25,

            // 留存
            D1_retained_users: 307,
            D7_retained_users: 90,
          },

          {
            date: "2025-10-23", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1717,
            D0_unique_purchase: 627,
            D0_PURCHASE_VALUE: 749.97,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 562,
            D0_SPORTS_BET_PLACED_USER: 361,
            D0_GAMES_BET_PLACED_USER: 319,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 158.21,
            D0_GAMES_BET_FLOW: 3379.42,
            D0_TOTAL_BET_FLOW: 3537.62,

            // 付费 & 投注（D7）
            D7_unique_purchase: 784,
            D7_PURCHASE_VALUE: 2057.54,
            D7_TOTAL_BET_PLACED_USER: 767,
            D7_SPORTS_BET_PLACED_USER: 529,
            D7_GAMES_BET_PLACED_USER: 444,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1002.93,
            D7_GAMES_BET_FLOW: 11633.33,
            D7_TOTAL_BET_FLOW: 12636.26,

            // 留存
            D1_retained_users: 601,
            D7_retained_users: 137,
          },

          {
            date: "2025-10-23", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 731,
            D0_unique_purchase: 240,
            D0_PURCHASE_VALUE: 471.33,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 224,
            D0_SPORTS_BET_PLACED_USER: 131,
            D0_GAMES_BET_PLACED_USER: 145,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 166.76,
            D0_GAMES_BET_FLOW: 1450.83,
            D0_TOTAL_BET_FLOW: 1617.59,

            // 付费 & 投注（D7）
            D7_unique_purchase: 334,
            D7_PURCHASE_VALUE: 1639.67,
            D7_TOTAL_BET_PLACED_USER: 344,
            D7_SPORTS_BET_PLACED_USER: 229,
            D7_GAMES_BET_PLACED_USER: 211,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 367.25,
            D7_GAMES_BET_FLOW: 7942.36,
            D7_TOTAL_BET_FLOW: 8309.61,

            // 留存
            D1_retained_users: 231,
            D7_retained_users: 9,
          },

          {
            date: "2025-10-23", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 143,
            D0_unique_purchase: 31,
            D0_PURCHASE_VALUE: 90.95,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 32,
            D0_SPORTS_BET_PLACED_USER: 26,
            D0_GAMES_BET_PLACED_USER: 14,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 31.24,
            D0_GAMES_BET_FLOW: 240.43,
            D0_TOTAL_BET_FLOW: 271.66,

            // 付费 & 投注（D7）
            D7_unique_purchase: 38,
            D7_PURCHASE_VALUE: 258.37,
            D7_TOTAL_BET_PLACED_USER: 54,
            D7_SPORTS_BET_PLACED_USER: 46,
            D7_GAMES_BET_PLACED_USER: 23,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 296.89,
            D7_GAMES_BET_FLOW: 595.57,
            D7_TOTAL_BET_FLOW: 892.46,

            // 留存
            D1_retained_users: 44,
            D7_retained_users: 17,
          },

          {
            date: "2025-10-24", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 368,
            D0_unique_purchase: 226,
            D0_PURCHASE_VALUE: 1006.46,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 219,
            D0_SPORTS_BET_PLACED_USER: 156,
            D0_GAMES_BET_PLACED_USER: 98,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 135.75,
            D0_GAMES_BET_FLOW: 3969.37,
            D0_TOTAL_BET_FLOW: 4105.12,

            // 付费 & 投注（D7）
            D7_unique_purchase: 257,
            D7_PURCHASE_VALUE: 4915.54,
            D7_TOTAL_BET_PLACED_USER: 261,
            D7_SPORTS_BET_PLACED_USER: 197,
            D7_GAMES_BET_PLACED_USER: 132,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 557.75,
            D7_GAMES_BET_FLOW: 24623.59,
            D7_TOTAL_BET_FLOW: 25181.34,

            // 留存
            D1_retained_users: 156,
            D7_retained_users: 52,
          },

          {
            date: "2025-10-24", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 786,
            D0_unique_purchase: 309,
            D0_PURCHASE_VALUE: 4523.7,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 294,
            D0_SPORTS_BET_PLACED_USER: 96,
            D0_GAMES_BET_PLACED_USER: 237,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 145.26,
            D0_GAMES_BET_FLOW: 21868.43,
            D0_TOTAL_BET_FLOW: 22013.68,

            // 付费 & 投注（D7）
            D7_unique_purchase: 399,
            D7_PURCHASE_VALUE: 6425.08,
            D7_TOTAL_BET_PLACED_USER: 406,
            D7_SPORTS_BET_PLACED_USER: 178,
            D7_GAMES_BET_PLACED_USER: 333,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 262.54,
            D7_GAMES_BET_FLOW: 32380.94,
            D7_TOTAL_BET_FLOW: 32643.48,

            // 留存
            D1_retained_users: 361,
            D7_retained_users: 98,
          },

          {
            date: "2025-10-24", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1735,
            D0_unique_purchase: 633,
            D0_PURCHASE_VALUE: 862.18,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 567,
            D0_SPORTS_BET_PLACED_USER: 348,
            D0_GAMES_BET_PLACED_USER: 324,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 190.65,
            D0_GAMES_BET_FLOW: 3458.06,
            D0_TOTAL_BET_FLOW: 3648.71,

            // 付费 & 投注（D7）
            D7_unique_purchase: 776,
            D7_PURCHASE_VALUE: 3702.1,
            D7_TOTAL_BET_PLACED_USER: 756,
            D7_SPORTS_BET_PLACED_USER: 530,
            D7_GAMES_BET_PLACED_USER: 457,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2034.78,
            D7_GAMES_BET_FLOW: 12414.14,
            D7_TOTAL_BET_FLOW: 14448.92,

            // 留存
            D1_retained_users: 616,
            D7_retained_users: 173,
          },

          {
            date: "2025-10-24", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 815,
            D0_unique_purchase: 250,
            D0_PURCHASE_VALUE: 1431.68,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 247,
            D0_SPORTS_BET_PLACED_USER: 152,
            D0_GAMES_BET_PLACED_USER: 135,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 990.44,
            D0_GAMES_BET_FLOW: 1187.81,
            D0_TOTAL_BET_FLOW: 2178.24,

            // 付费 & 投注（D7）
            D7_unique_purchase: 375,
            D7_PURCHASE_VALUE: 2038.11,
            D7_TOTAL_BET_PLACED_USER: 416,
            D7_SPORTS_BET_PLACED_USER: 307,
            D7_GAMES_BET_PLACED_USER: 201,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1205.0,
            D7_GAMES_BET_FLOW: 4496.26,
            D7_TOTAL_BET_FLOW: 5701.26,

            // 留存
            D1_retained_users: 343,
            D7_retained_users: 3,
          },

          {
            date: "2025-10-24", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 224,
            D0_unique_purchase: 56,
            D0_PURCHASE_VALUE: 86.93,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 59,
            D0_SPORTS_BET_PLACED_USER: 43,
            D0_GAMES_BET_PLACED_USER: 24,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 52.11,
            D0_GAMES_BET_FLOW: 224.15,
            D0_TOTAL_BET_FLOW: 276.26,

            // 付费 & 投注（D7）
            D7_unique_purchase: 70,
            D7_PURCHASE_VALUE: 3791.09,
            D7_TOTAL_BET_PLACED_USER: 89,
            D7_SPORTS_BET_PLACED_USER: 74,
            D7_GAMES_BET_PLACED_USER: 37,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 756.87,
            D7_GAMES_BET_FLOW: 38837.8,
            D7_TOTAL_BET_FLOW: 39594.67,

            // 留存
            D1_retained_users: 73,
            D7_retained_users: 29,
          },

          {
            date: "2025-10-25", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 468,
            D0_unique_purchase: 241,
            D0_PURCHASE_VALUE: 1280.08,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 238,
            D0_SPORTS_BET_PLACED_USER: 177,
            D0_GAMES_BET_PLACED_USER: 112,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 137.02,
            D0_GAMES_BET_FLOW: 5075.62,
            D0_TOTAL_BET_FLOW: 5212.63,

            // 付费 & 投注（D7）
            D7_unique_purchase: 287,
            D7_PURCHASE_VALUE: 5075.0,
            D7_TOTAL_BET_PLACED_USER: 288,
            D7_SPORTS_BET_PLACED_USER: 228,
            D7_GAMES_BET_PLACED_USER: 163,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 457.55,
            D7_GAMES_BET_FLOW: 22118.17,
            D7_TOTAL_BET_FLOW: 22575.72,

            // 留存
            D1_retained_users: 206,
            D7_retained_users: 76,
          },

          {
            date: "2025-10-25", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 963,
            D0_unique_purchase: 394,
            D0_PURCHASE_VALUE: 607.32,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 381,
            D0_SPORTS_BET_PLACED_USER: 164,
            D0_GAMES_BET_PLACED_USER: 293,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 72.92,
            D0_GAMES_BET_FLOW: 6214.83,
            D0_TOTAL_BET_FLOW: 6287.75,

            // 付费 & 投注（D7）
            D7_unique_purchase: 479,
            D7_PURCHASE_VALUE: 1552.11,
            D7_TOTAL_BET_PLACED_USER: 504,
            D7_SPORTS_BET_PLACED_USER: 246,
            D7_GAMES_BET_PLACED_USER: 391,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 183.07,
            D7_GAMES_BET_FLOW: 12474.26,
            D7_TOTAL_BET_FLOW: 12657.32,

            // 留存
            D1_retained_users: 335,
            D7_retained_users: 131,
          },

          {
            date: "2025-10-25", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1674,
            D0_unique_purchase: 628,
            D0_PURCHASE_VALUE: 1474.05,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 583,
            D0_SPORTS_BET_PLACED_USER: 395,
            D0_GAMES_BET_PLACED_USER: 306,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 378.11,
            D0_GAMES_BET_FLOW: 7637.37,
            D0_TOTAL_BET_FLOW: 8015.48,

            // 付费 & 投注（D7）
            D7_unique_purchase: 784,
            D7_PURCHASE_VALUE: 7560.77,
            D7_TOTAL_BET_PLACED_USER: 779,
            D7_SPORTS_BET_PLACED_USER: 562,
            D7_GAMES_BET_PLACED_USER: 435,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2991.26,
            D7_GAMES_BET_FLOW: 37237.4,
            D7_TOTAL_BET_FLOW: 40228.66,

            // 留存
            D1_retained_users: 612,
            D7_retained_users: 197,
          },

          {
            date: "2025-10-25", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 941,
            D0_unique_purchase: 286,
            D0_PURCHASE_VALUE: 611.57,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 302,
            D0_SPORTS_BET_PLACED_USER: 200,
            D0_GAMES_BET_PLACED_USER: 154,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 266.28,
            D0_GAMES_BET_FLOW: 2687.5,
            D0_TOTAL_BET_FLOW: 2953.79,

            // 付费 & 投注（D7）
            D7_unique_purchase: 365,
            D7_PURCHASE_VALUE: 1443.38,
            D7_TOTAL_BET_PLACED_USER: 414,
            D7_SPORTS_BET_PLACED_USER: 279,
            D7_GAMES_BET_PLACED_USER: 240,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 917.27,
            D7_GAMES_BET_FLOW: 10406.85,
            D7_TOTAL_BET_FLOW: 11324.11,

            // 留存
            D1_retained_users: 454,
            D7_retained_users: 1,
          },

          {
            date: "2025-10-25", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 246,
            D0_unique_purchase: 71,
            D0_PURCHASE_VALUE: 123.83,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 74,
            D0_SPORTS_BET_PLACED_USER: 62,
            D0_GAMES_BET_PLACED_USER: 25,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 67.37,
            D0_GAMES_BET_FLOW: 253.11,
            D0_TOTAL_BET_FLOW: 320.48,

            // 付费 & 投注（D7）
            D7_unique_purchase: 86,
            D7_PURCHASE_VALUE: 367.59,
            D7_TOTAL_BET_PLACED_USER: 101,
            D7_SPORTS_BET_PLACED_USER: 90,
            D7_GAMES_BET_PLACED_USER: 43,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 177.44,
            D7_GAMES_BET_FLOW: 1088.62,
            D7_TOTAL_BET_FLOW: 1266.06,

            // 留存
            D1_retained_users: 92,
            D7_retained_users: 31,
          },

          {
            date: "2025-10-26", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 505,
            D0_unique_purchase: 284,
            D0_PURCHASE_VALUE: 1445.46,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 186,
            D0_SPORTS_BET_PLACED_USER: 122,
            D0_GAMES_BET_PLACED_USER: 109,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 120.68,
            D0_GAMES_BET_FLOW: 3795.64,
            D0_TOTAL_BET_FLOW: 3916.32,

            // 付费 & 投注（D7）
            D7_unique_purchase: 332,
            D7_PURCHASE_VALUE: 2633.0,
            D7_TOTAL_BET_PLACED_USER: 337,
            D7_SPORTS_BET_PLACED_USER: 267,
            D7_GAMES_BET_PLACED_USER: 179,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 366.44,
            D7_GAMES_BET_FLOW: 8929.74,
            D7_TOTAL_BET_FLOW: 9296.18,

            // 留存
            D1_retained_users: 248,
            D7_retained_users: 57,
          },

          {
            date: "2025-10-26", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1001,
            D0_unique_purchase: 373,
            D0_PURCHASE_VALUE: 593.13,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 384,
            D0_SPORTS_BET_PLACED_USER: 161,
            D0_GAMES_BET_PLACED_USER: 284,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 189.36,
            D0_GAMES_BET_FLOW: 2222.84,
            D0_TOTAL_BET_FLOW: 2412.2,

            // 付费 & 投注（D7）
            D7_unique_purchase: 461,
            D7_PURCHASE_VALUE: 1251.52,
            D7_TOTAL_BET_PLACED_USER: 492,
            D7_SPORTS_BET_PLACED_USER: 245,
            D7_GAMES_BET_PLACED_USER: 382,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 278.2,
            D7_GAMES_BET_FLOW: 6144.83,
            D7_TOTAL_BET_FLOW: 6423.02,

            // 留存
            D1_retained_users: 387,
            D7_retained_users: 119,
          },

          {
            date: "2025-10-26", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1656,
            D0_unique_purchase: 607,
            D0_PURCHASE_VALUE: 581.93,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 550,
            D0_SPORTS_BET_PLACED_USER: 353,
            D0_GAMES_BET_PLACED_USER: 312,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 208.04,
            D0_GAMES_BET_FLOW: 1734.2,
            D0_TOTAL_BET_FLOW: 1942.24,

            // 付费 & 投注（D7）
            D7_unique_purchase: 757,
            D7_PURCHASE_VALUE: 1647.51,
            D7_TOTAL_BET_PLACED_USER: 742,
            D7_SPORTS_BET_PLACED_USER: 505,
            D7_GAMES_BET_PLACED_USER: 450,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 480.3,
            D7_GAMES_BET_FLOW: 10457.28,
            D7_TOTAL_BET_FLOW: 10937.58,

            // 留存
            D1_retained_users: 524,
            D7_retained_users: 192,
          },

          {
            date: "2025-10-26", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 968,
            D0_unique_purchase: 235,
            D0_PURCHASE_VALUE: 359.55,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 262,
            D0_SPORTS_BET_PLACED_USER: 181,
            D0_GAMES_BET_PLACED_USER: 140,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 104.36,
            D0_GAMES_BET_FLOW: 1680.38,
            D0_TOTAL_BET_FLOW: 1784.74,

            // 付费 & 投注（D7）
            D7_unique_purchase: 329,
            D7_PURCHASE_VALUE: 698.58,
            D7_TOTAL_BET_PLACED_USER: 373,
            D7_SPORTS_BET_PLACED_USER: 273,
            D7_GAMES_BET_PLACED_USER: 192,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 176.6,
            D7_GAMES_BET_FLOW: 3411.61,
            D7_TOTAL_BET_FLOW: 3588.21,

            // 留存
            D1_retained_users: 325,
            D7_retained_users: 1,
          },

          {
            date: "2025-10-26", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 167,
            D0_unique_purchase: 34,
            D0_PURCHASE_VALUE: 54.55,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 41,
            D0_SPORTS_BET_PLACED_USER: 31,
            D0_GAMES_BET_PLACED_USER: 15,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 73.51,
            D0_GAMES_BET_FLOW: 115.48,
            D0_TOTAL_BET_FLOW: 188.99,

            // 付费 & 投注（D7）
            D7_unique_purchase: 48,
            D7_PURCHASE_VALUE: 211.58,
            D7_TOTAL_BET_PLACED_USER: 69,
            D7_SPORTS_BET_PLACED_USER: 54,
            D7_GAMES_BET_PLACED_USER: 33,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 402.62,
            D7_GAMES_BET_FLOW: 465.59,
            D7_TOTAL_BET_FLOW: 868.21,

            // 留存
            D1_retained_users: 43,
            D7_retained_users: 39,
          },

          {
            date: "2025-10-27", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 323,
            D0_unique_purchase: 156,
            D0_PURCHASE_VALUE: 679.31,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 151,
            D0_SPORTS_BET_PLACED_USER: 78,
            D0_GAMES_BET_PLACED_USER: 106,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 38.56,
            D0_GAMES_BET_FLOW: 11368.48,
            D0_TOTAL_BET_FLOW: 11407.04,

            // 付费 & 投注（D7）
            D7_unique_purchase: 183,
            D7_PURCHASE_VALUE: 1678.77,
            D7_TOTAL_BET_PLACED_USER: 190,
            D7_SPORTS_BET_PLACED_USER: 122,
            D7_GAMES_BET_PLACED_USER: 129,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 187.17,
            D7_GAMES_BET_FLOW: 16351.33,
            D7_TOTAL_BET_FLOW: 16538.5,

            // 留存
            D1_retained_users: 147,
            D7_retained_users: 48,
          },

          {
            date: "2025-10-27", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 930,
            D0_unique_purchase: 337,
            D0_PURCHASE_VALUE: 442.38,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 328,
            D0_SPORTS_BET_PLACED_USER: 98,
            D0_GAMES_BET_PLACED_USER: 281,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 26.11,
            D0_GAMES_BET_FLOW: 5364.46,
            D0_TOTAL_BET_FLOW: 5390.58,

            // 付费 & 投注（D7）
            D7_unique_purchase: 447,
            D7_PURCHASE_VALUE: 1320.89,
            D7_TOTAL_BET_PLACED_USER: 491,
            D7_SPORTS_BET_PLACED_USER: 212,
            D7_GAMES_BET_PLACED_USER: 398,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 116.22,
            D7_GAMES_BET_FLOW: 10859.16,
            D7_TOTAL_BET_FLOW: 10975.38,

            // 留存
            D1_retained_users: 362,
            D7_retained_users: 108,
          },

          {
            date: "2025-10-27", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1508,
            D0_unique_purchase: 582,
            D0_PURCHASE_VALUE: 1722.79,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 532,
            D0_SPORTS_BET_PLACED_USER: 323,
            D0_GAMES_BET_PLACED_USER: 324,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 721.0,
            D0_GAMES_BET_FLOW: 12292.9,
            D0_TOTAL_BET_FLOW: 13013.91,

            // 付费 & 投注（D7）
            D7_unique_purchase: 724,
            D7_PURCHASE_VALUE: 4544.82,
            D7_TOTAL_BET_PLACED_USER: 735,
            D7_SPORTS_BET_PLACED_USER: 493,
            D7_GAMES_BET_PLACED_USER: 473,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 3704.03,
            D7_GAMES_BET_FLOW: 24276.22,
            D7_TOTAL_BET_FLOW: 27980.24,

            // 留存
            D1_retained_users: 574,
            D7_retained_users: 170,
          },

          {
            date: "2025-10-27", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 657,
            D0_unique_purchase: 180,
            D0_PURCHASE_VALUE: 227.45,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 176,
            D0_SPORTS_BET_PLACED_USER: 91,
            D0_GAMES_BET_PLACED_USER: 118,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 43.27,
            D0_GAMES_BET_FLOW: 938.08,
            D0_TOTAL_BET_FLOW: 981.36,

            // 付费 & 投注（D7）
            D7_unique_purchase: 235,
            D7_PURCHASE_VALUE: 419.55,
            D7_TOTAL_BET_PLACED_USER: 255,
            D7_SPORTS_BET_PLACED_USER: 148,
            D7_GAMES_BET_PLACED_USER: 172,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 122.81,
            D7_GAMES_BET_FLOW: 1993.68,
            D7_TOTAL_BET_FLOW: 2116.49,

            // 留存
            D1_retained_users: 211,
            D7_retained_users: 83,
          },

          {
            date: "2025-10-27", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 107,
            D0_unique_purchase: 30,
            D0_PURCHASE_VALUE: 110.13,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 30,
            D0_SPORTS_BET_PLACED_USER: 24,
            D0_GAMES_BET_PLACED_USER: 11,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 27.13,
            D0_GAMES_BET_FLOW: 205.35,
            D0_TOTAL_BET_FLOW: 232.48,

            // 付费 & 投注（D7）
            D7_unique_purchase: 39,
            D7_PURCHASE_VALUE: 393.49,
            D7_TOTAL_BET_PLACED_USER: 42,
            D7_SPORTS_BET_PLACED_USER: 38,
            D7_GAMES_BET_PLACED_USER: 18,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 297.65,
            D7_GAMES_BET_FLOW: 772.27,
            D7_TOTAL_BET_FLOW: 1069.92,

            // 留存
            D1_retained_users: 46,
            D7_retained_users: 14,
          },

          {
            date: "2025-10-28", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 383,
            D0_unique_purchase: 193,
            D0_PURCHASE_VALUE: 688.0,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 187,
            D0_SPORTS_BET_PLACED_USER: 115,
            D0_GAMES_BET_PLACED_USER: 107,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 136.58,
            D0_GAMES_BET_FLOW: 2841.12,
            D0_TOTAL_BET_FLOW: 2977.71,

            // 付费 & 投注（D7）
            D7_unique_purchase: 229,
            D7_PURCHASE_VALUE: 2545.69,
            D7_TOTAL_BET_PLACED_USER: 234,
            D7_SPORTS_BET_PLACED_USER: 156,
            D7_GAMES_BET_PLACED_USER: 145,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 342.56,
            D7_GAMES_BET_FLOW: 8976.6,
            D7_TOTAL_BET_FLOW: 9319.16,

            // 留存
            D1_retained_users: 148,
            D7_retained_users: 58,
          },

          {
            date: "2025-10-28", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 966,
            D0_unique_purchase: 365,
            D0_PURCHASE_VALUE: 577.28,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 357,
            D0_SPORTS_BET_PLACED_USER: 91,
            D0_GAMES_BET_PLACED_USER: 313,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 88.27,
            D0_GAMES_BET_FLOW: 2861.1,
            D0_TOTAL_BET_FLOW: 2949.37,

            // 付费 & 投注（D7）
            D7_unique_purchase: 467,
            D7_PURCHASE_VALUE: 2153.67,
            D7_TOTAL_BET_PLACED_USER: 503,
            D7_SPORTS_BET_PLACED_USER: 192,
            D7_GAMES_BET_PLACED_USER: 416,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 200.3,
            D7_GAMES_BET_FLOW: 13292.33,
            D7_TOTAL_BET_FLOW: 13492.63,

            // 留存
            D1_retained_users: 373,
            D7_retained_users: 120,
          },

          {
            date: "2025-10-28", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1549,
            D0_unique_purchase: 564,
            D0_PURCHASE_VALUE: 713.41,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 514,
            D0_SPORTS_BET_PLACED_USER: 304,
            D0_GAMES_BET_PLACED_USER: 329,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 444.7,
            D0_GAMES_BET_FLOW: 2644.84,
            D0_TOTAL_BET_FLOW: 3089.54,

            // 付费 & 投注（D7）
            D7_unique_purchase: 726,
            D7_PURCHASE_VALUE: 3325.05,
            D7_TOTAL_BET_PLACED_USER: 724,
            D7_SPORTS_BET_PLACED_USER: 480,
            D7_GAMES_BET_PLACED_USER: 472,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2749.06,
            D7_GAMES_BET_FLOW: 13174.25,
            D7_TOTAL_BET_FLOW: 15923.31,

            // 留存
            D1_retained_users: 570,
            D7_retained_users: 167,
          },

          {
            date: "2025-10-28", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1019,
            D0_unique_purchase: 209,
            D0_PURCHASE_VALUE: 332.99,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 228,
            D0_SPORTS_BET_PLACED_USER: 120,
            D0_GAMES_BET_PLACED_USER: 142,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 63.76,
            D0_GAMES_BET_FLOW: 1339.31,
            D0_TOTAL_BET_FLOW: 1403.08,

            // 付费 & 投注（D7）
            D7_unique_purchase: 328,
            D7_PURCHASE_VALUE: 854.5,
            D7_TOTAL_BET_PLACED_USER: 356,
            D7_SPORTS_BET_PLACED_USER: 244,
            D7_GAMES_BET_PLACED_USER: 198,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 132.0,
            D7_GAMES_BET_FLOW: 3643.34,
            D7_TOTAL_BET_FLOW: 3775.34,

            // 留存
            D1_retained_users: 170,
            D7_retained_users: 232,
          },

          {
            date: "2025-10-28", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 121,
            D0_unique_purchase: 28,
            D0_PURCHASE_VALUE: 207.52,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 31,
            D0_SPORTS_BET_PLACED_USER: 22,
            D0_GAMES_BET_PLACED_USER: 11,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 24.62,
            D0_GAMES_BET_FLOW: 1713.42,
            D0_TOTAL_BET_FLOW: 1738.03,

            // 付费 & 投注（D7）
            D7_unique_purchase: 35,
            D7_PURCHASE_VALUE: 375.82,
            D7_TOTAL_BET_PLACED_USER: 46,
            D7_SPORTS_BET_PLACED_USER: 36,
            D7_GAMES_BET_PLACED_USER: 18,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 65.62,
            D7_GAMES_BET_FLOW: 4176.93,
            D7_TOTAL_BET_FLOW: 4242.55,

            // 留存
            D1_retained_users: 47,
            D7_retained_users: 15,
          },

          {
            date: "2025-10-29", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 355,
            D0_unique_purchase: 175,
            D0_PURCHASE_VALUE: 1007.31,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 159,
            D0_SPORTS_BET_PLACED_USER: 88,
            D0_GAMES_BET_PLACED_USER: 104,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 151.32,
            D0_GAMES_BET_FLOW: 4692.75,
            D0_TOTAL_BET_FLOW: 4844.07,

            // 付费 & 投注（D7）
            D7_unique_purchase: 216,
            D7_PURCHASE_VALUE: 2577.23,
            D7_TOTAL_BET_PLACED_USER: 215,
            D7_SPORTS_BET_PLACED_USER: 146,
            D7_GAMES_BET_PLACED_USER: 161,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 360.57,
            D7_GAMES_BET_FLOW: 12237.12,
            D7_TOTAL_BET_FLOW: 12597.69,

            // 留存
            D1_retained_users: 166,
            D7_retained_users: 66,
          },

          {
            date: "2025-10-29", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 980,
            D0_unique_purchase: 360,
            D0_PURCHASE_VALUE: 810.54,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 355,
            D0_SPORTS_BET_PLACED_USER: 112,
            D0_GAMES_BET_PLACED_USER: 292,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 111.67,
            D0_GAMES_BET_FLOW: 4905.94,
            D0_TOTAL_BET_FLOW: 5017.6,

            // 付费 & 投注（D7）
            D7_unique_purchase: 442,
            D7_PURCHASE_VALUE: 2395.93,
            D7_TOTAL_BET_PLACED_USER: 466,
            D7_SPORTS_BET_PLACED_USER: 198,
            D7_GAMES_BET_PLACED_USER: 385,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 451.62,
            D7_GAMES_BET_FLOW: 15488.02,
            D7_TOTAL_BET_FLOW: 15939.65,

            // 留存
            D1_retained_users: 385,
            D7_retained_users: 109,
          },

          {
            date: "2025-10-29", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1726,
            D0_unique_purchase: 568,
            D0_PURCHASE_VALUE: 749.76,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 532,
            D0_SPORTS_BET_PLACED_USER: 337,
            D0_GAMES_BET_PLACED_USER: 307,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 271.43,
            D0_GAMES_BET_FLOW: 2670.07,
            D0_TOTAL_BET_FLOW: 2941.5,

            // 付费 & 投注（D7）
            D7_unique_purchase: 736,
            D7_PURCHASE_VALUE: 2084.38,
            D7_TOTAL_BET_PLACED_USER: 740,
            D7_SPORTS_BET_PLACED_USER: 514,
            D7_GAMES_BET_PLACED_USER: 461,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1659.64,
            D7_GAMES_BET_FLOW: 9660.35,
            D7_TOTAL_BET_FLOW: 11319.99,

            // 留存
            D1_retained_users: 605,
            D7_retained_users: 175,
          },

          {
            date: "2025-10-29", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 237,
            D0_unique_purchase: 63,
            D0_PURCHASE_VALUE: 89.08,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 55,
            D0_SPORTS_BET_PLACED_USER: 24,
            D0_GAMES_BET_PLACED_USER: 40,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 11.22,
            D0_GAMES_BET_FLOW: 286.65,
            D0_TOTAL_BET_FLOW: 297.86,

            // 付费 & 投注（D7）
            D7_unique_purchase: 83,
            D7_PURCHASE_VALUE: 198.31,
            D7_TOTAL_BET_PLACED_USER: 87,
            D7_SPORTS_BET_PLACED_USER: 59,
            D7_GAMES_BET_PLACED_USER: 54,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 41.5,
            D7_GAMES_BET_FLOW: 1912.18,
            D7_TOTAL_BET_FLOW: 1953.68,

            // 留存
            D1_retained_users: 19,
            D7_retained_users: 56,
          },

          {
            date: "2025-10-29", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 162,
            D0_unique_purchase: 56,
            D0_PURCHASE_VALUE: 747.25,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 55,
            D0_SPORTS_BET_PLACED_USER: 46,
            D0_GAMES_BET_PLACED_USER: 17,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 146.48,
            D0_GAMES_BET_FLOW: 1794.09,
            D0_TOTAL_BET_FLOW: 1940.57,

            // 付费 & 投注（D7）
            D7_unique_purchase: 66,
            D7_PURCHASE_VALUE: 1190.77,
            D7_TOTAL_BET_PLACED_USER: 72,
            D7_SPORTS_BET_PLACED_USER: 62,
            D7_GAMES_BET_PLACED_USER: 29,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 601.58,
            D7_GAMES_BET_FLOW: 2800.88,
            D7_TOTAL_BET_FLOW: 3402.46,

            // 留存
            D1_retained_users: 71,
            D7_retained_users: 32,
          },

          {
            date: "2025-10-30", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 433,
            D0_unique_purchase: 204,
            D0_PURCHASE_VALUE: 542.0,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 150,
            D0_SPORTS_BET_PLACED_USER: 76,
            D0_GAMES_BET_PLACED_USER: 101,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 103.81,
            D0_GAMES_BET_FLOW: 1515.46,
            D0_TOTAL_BET_FLOW: 1619.27,

            // 付费 & 投注（D7）
            D7_unique_purchase: 256,
            D7_PURCHASE_VALUE: 7215.55,
            D7_TOTAL_BET_PLACED_USER: 254,
            D7_SPORTS_BET_PLACED_USER: 169,
            D7_GAMES_BET_PLACED_USER: 159,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 885.86,
            D7_GAMES_BET_FLOW: 44364.2,
            D7_TOTAL_BET_FLOW: 45250.05,

            // 留存
            D1_retained_users: 202,
            D7_retained_users: 55,
          },

          {
            date: "2025-10-30", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 851,
            D0_unique_purchase: 314,
            D0_PURCHASE_VALUE: 351.83,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 307,
            D0_SPORTS_BET_PLACED_USER: 78,
            D0_GAMES_BET_PLACED_USER: 269,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 21.37,
            D0_GAMES_BET_FLOW: 1830.52,
            D0_TOTAL_BET_FLOW: 1851.89,

            // 付费 & 投注（D7）
            D7_unique_purchase: 403,
            D7_PURCHASE_VALUE: 2207.74,
            D7_TOTAL_BET_PLACED_USER: 420,
            D7_SPORTS_BET_PLACED_USER: 162,
            D7_GAMES_BET_PLACED_USER: 359,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 83.65,
            D7_GAMES_BET_FLOW: 12893.78,
            D7_TOTAL_BET_FLOW: 12977.43,

            // 留存
            D1_retained_users: 319,
            D7_retained_users: 82,
          },

          {
            date: "2025-10-30", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1671,
            D0_unique_purchase: 633,
            D0_PURCHASE_VALUE: 998.1,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 573,
            D0_SPORTS_BET_PLACED_USER: 322,
            D0_GAMES_BET_PLACED_USER: 357,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 677.98,
            D0_GAMES_BET_FLOW: 3541.0,
            D0_TOTAL_BET_FLOW: 4218.98,

            // 付费 & 投注（D7）
            D7_unique_purchase: 813,
            D7_PURCHASE_VALUE: 3257.29,
            D7_TOTAL_BET_PLACED_USER: 804,
            D7_SPORTS_BET_PLACED_USER: 516,
            D7_GAMES_BET_PLACED_USER: 523,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 3777.98,
            D7_GAMES_BET_FLOW: 14009.2,
            D7_TOTAL_BET_FLOW: 17787.18,

            // 留存
            D1_retained_users: 587,
            D7_retained_users: 173,
          },

          {
            date: "2025-10-30", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 17,
            D0_unique_purchase: 4,
            D0_PURCHASE_VALUE: 4.32,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 2,
            D0_SPORTS_BET_PLACED_USER: 1,
            D0_GAMES_BET_PLACED_USER: 1,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 1.89,
            D0_GAMES_BET_FLOW: 10.05,
            D0_TOTAL_BET_FLOW: 11.93,

            // 付费 & 投注（D7）
            D7_unique_purchase: 9,
            D7_PURCHASE_VALUE: 15.98,
            D7_TOTAL_BET_PLACED_USER: 9,
            D7_SPORTS_BET_PLACED_USER: 5,
            D7_GAMES_BET_PLACED_USER: 7,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 8.11,
            D7_GAMES_BET_FLOW: 41.94,
            D7_TOTAL_BET_FLOW: 50.05,

            // 留存
            D1_retained_users: 4,
            D7_retained_users: 2,
          },

          {
            date: "2025-10-30", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 110,
            D0_unique_purchase: 37,
            D0_PURCHASE_VALUE: 243.01,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 36,
            D0_SPORTS_BET_PLACED_USER: 26,
            D0_GAMES_BET_PLACED_USER: 16,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 29.39,
            D0_GAMES_BET_FLOW: 1111.61,
            D0_TOTAL_BET_FLOW: 1141.0,

            // 付费 & 投注（D7）
            D7_unique_purchase: 44,
            D7_PURCHASE_VALUE: 482.22,
            D7_TOTAL_BET_PLACED_USER: 52,
            D7_SPORTS_BET_PLACED_USER: 43,
            D7_GAMES_BET_PLACED_USER: 24,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 127.56,
            D7_GAMES_BET_FLOW: 1800.78,
            D7_TOTAL_BET_FLOW: 1928.34,

            // 留存
            D1_retained_users: 49,
            D7_retained_users: 15,
          },

          {
            date: "2025-10-31", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 405,
            D0_unique_purchase: 180,
            D0_PURCHASE_VALUE: 954.31,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 163,
            D0_SPORTS_BET_PLACED_USER: 85,
            D0_GAMES_BET_PLACED_USER: 123,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 77.45,
            D0_GAMES_BET_FLOW: 3342.95,
            D0_TOTAL_BET_FLOW: 3420.4,

            // 付费 & 投注（D7）
            D7_unique_purchase: 227,
            D7_PURCHASE_VALUE: 3819.31,
            D7_TOTAL_BET_PLACED_USER: 228,
            D7_SPORTS_BET_PLACED_USER: 138,
            D7_GAMES_BET_PLACED_USER: 177,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 334.69,
            D7_GAMES_BET_FLOW: 16602.55,
            D7_TOTAL_BET_FLOW: 16937.24,

            // 留存
            D1_retained_users: 186,
            D7_retained_users: 56,
          },

          {
            date: "2025-10-31", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 810,
            D0_unique_purchase: 340,
            D0_PURCHASE_VALUE: 1040.09,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 332,
            D0_SPORTS_BET_PLACED_USER: 91,
            D0_GAMES_BET_PLACED_USER: 281,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 47.81,
            D0_GAMES_BET_FLOW: 5144.44,
            D0_TOTAL_BET_FLOW: 5192.25,

            // 付费 & 投注（D7）
            D7_unique_purchase: 440,
            D7_PURCHASE_VALUE: 2335.24,
            D7_TOTAL_BET_PLACED_USER: 450,
            D7_SPORTS_BET_PLACED_USER: 184,
            D7_GAMES_BET_PLACED_USER: 382,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 439.32,
            D7_GAMES_BET_FLOW: 14609.5,
            D7_TOTAL_BET_FLOW: 15048.82,

            // 留存
            D1_retained_users: 359,
            D7_retained_users: 87,
          },

          {
            date: "2025-10-31", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1728,
            D0_unique_purchase: 642,
            D0_PURCHASE_VALUE: 827.86,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 590,
            D0_SPORTS_BET_PLACED_USER: 358,
            D0_GAMES_BET_PLACED_USER: 351,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 788.81,
            D0_GAMES_BET_FLOW: 3005.95,
            D0_TOTAL_BET_FLOW: 3794.76,

            // 付费 & 投注（D7）
            D7_unique_purchase: 811,
            D7_PURCHASE_VALUE: 3952.49,
            D7_TOTAL_BET_PLACED_USER: 806,
            D7_SPORTS_BET_PLACED_USER: 551,
            D7_GAMES_BET_PLACED_USER: 500,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2825.23,
            D7_GAMES_BET_FLOW: 15753.36,
            D7_TOTAL_BET_FLOW: 18578.59,

            // 留存
            D1_retained_users: 676,
            D7_retained_users: 166,
          },

          {
            date: "2025-10-31", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 2,
            D0_unique_purchase: 1,
            D0_PURCHASE_VALUE: 0.57,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 1,
            D0_SPORTS_BET_PLACED_USER: 1,
            D0_GAMES_BET_PLACED_USER: 1,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 0.38,
            D0_GAMES_BET_FLOW: 0.43,
            D0_TOTAL_BET_FLOW: 0.81,

            // 付费 & 投注（D7）
            D7_unique_purchase: 2,
            D7_PURCHASE_VALUE: 5.47,
            D7_TOTAL_BET_PLACED_USER: 2,
            D7_SPORTS_BET_PLACED_USER: 2,
            D7_GAMES_BET_PLACED_USER: 1,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 4.65,
            D7_GAMES_BET_FLOW: 0.43,
            D7_TOTAL_BET_FLOW: 5.08,

            // 留存
            D1_retained_users: 2,
            D7_retained_users: 1,
          },

          {
            date: "2025-10-31", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 179,
            D0_unique_purchase: 50,
            D0_PURCHASE_VALUE: 631.76,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 53,
            D0_SPORTS_BET_PLACED_USER: 42,
            D0_GAMES_BET_PLACED_USER: 23,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 539.73,
            D0_GAMES_BET_FLOW: 268.3,
            D0_TOTAL_BET_FLOW: 808.03,

            // 付费 & 投注（D7）
            D7_unique_purchase: 61,
            D7_PURCHASE_VALUE: 1346.01,
            D7_TOTAL_BET_PLACED_USER: 69,
            D7_SPORTS_BET_PLACED_USER: 56,
            D7_GAMES_BET_PLACED_USER: 33,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 651.89,
            D7_GAMES_BET_FLOW: 2391.75,
            D7_TOTAL_BET_FLOW: 3043.65,

            // 留存
            D1_retained_users: 70,
            D7_retained_users: 18,
          },
        ],
              "2025-11": [
          {
            date: "2025-11-01", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 506,
            D0_unique_purchase: 263,
            D0_PURCHASE_VALUE: 991.54,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 201,
            D0_SPORTS_BET_PLACED_USER: 136,
            D0_GAMES_BET_PLACED_USER: 109,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 173,
            D0_GAMES_BET_FLOW: 4674.02,
            D0_TOTAL_BET_FLOW: 4847.01,

            // 付费 & 投注（D7）
            D7_unique_purchase: 309,
            D7_PURCHASE_VALUE: 3095.31,
            D7_TOTAL_BET_PLACED_USER: 306,
            D7_SPORTS_BET_PLACED_USER: 233,
            D7_GAMES_BET_PLACED_USER: 179,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 704.34,
            D7_GAMES_BET_FLOW: 14138.78,
            D7_TOTAL_BET_FLOW: 14843.12,

            // 留存
            D1_retained_users: 208,
            D7_retained_users: 81,
          },
          {
            date: "2025-11-01", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 974,
            D0_unique_purchase: 449,
            D0_PURCHASE_VALUE: 728.3,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 435,
            D0_SPORTS_BET_PLACED_USER: 162,
            D0_GAMES_BET_PLACED_USER: 349,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 50.72,
            D0_GAMES_BET_FLOW: 3856.74,
            D0_TOTAL_BET_FLOW: 3907.46,

            // 付费 & 投注（D7）
            D7_unique_purchase: 533,
            D7_PURCHASE_VALUE: 2297.72,
            D7_TOTAL_BET_PLACED_USER: 537,
            D7_SPORTS_BET_PLACED_USER: 242,
            D7_GAMES_BET_PLACED_USER: 437,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 150.21,
            D7_GAMES_BET_FLOW: 11948.75,
            D7_TOTAL_BET_FLOW: 12098.96,

            // 留存
            D1_retained_users: 348,
            D7_retained_users: 133,
          },
          {
            date: "2025-11-01", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1827,
            D0_unique_purchase: 729,
            D0_PURCHASE_VALUE: 1538.85,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 657,
            D0_SPORTS_BET_PLACED_USER: 422,
            D0_GAMES_BET_PLACED_USER: 375,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 835.41,
            D0_GAMES_BET_FLOW: 4352.91,
            D0_TOTAL_BET_FLOW: 5188.32,

            // 付费 & 投注（D7）
            D7_unique_purchase: 893,
            D7_PURCHASE_VALUE: 7261.1,
            D7_TOTAL_BET_PLACED_USER: 883,
            D7_SPORTS_BET_PLACED_USER: 623,
            D7_GAMES_BET_PLACED_USER: 549,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 5560.5,
            D7_GAMES_BET_FLOW: 16188.14,
            D7_TOTAL_BET_FLOW: 21748.64,

            // 留存
            D1_retained_users: 697,
            D7_retained_users: 235,
          },
          {
            date: "2025-11-01", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 6,
            D0_unique_purchase: 5,
            D0_PURCHASE_VALUE: 10.57,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 5,
            D0_SPORTS_BET_PLACED_USER: 3,
            D0_GAMES_BET_PLACED_USER: 3,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 9.03,
            D0_GAMES_BET_FLOW: 40.03,
            D0_TOTAL_BET_FLOW: 49.06,

            // 付费 & 投注（D7）
            D7_unique_purchase: 5,
            D7_PURCHASE_VALUE: 12.38,
            D7_TOTAL_BET_PLACED_USER: 5,
            D7_SPORTS_BET_PLACED_USER: 3,
            D7_GAMES_BET_PLACED_USER: 3,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 10.8,
            D7_GAMES_BET_FLOW: 41.43,
            D7_TOTAL_BET_FLOW: 52.23,

            // 留存
            D1_retained_users: 3,
            D7_retained_users: 2,
          },
          {
            date: "2025-11-01", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 205,
            D0_unique_purchase: 69,
            D0_PURCHASE_VALUE: 189.69,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 71,
            D0_SPORTS_BET_PLACED_USER: 54,
            D0_GAMES_BET_PLACED_USER: 29,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 212.54,
            D0_GAMES_BET_FLOW: 423.82,
            D0_TOTAL_BET_FLOW: 636.36,

            // 付费 & 投注（D7）
            D7_unique_purchase: 77,
            D7_PURCHASE_VALUE: 586.73,
            D7_TOTAL_BET_PLACED_USER: 92,
            D7_SPORTS_BET_PLACED_USER: 77,
            D7_GAMES_BET_PLACED_USER: 39,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 393.32,
            D7_GAMES_BET_FLOW: 2691.7,
            D7_TOTAL_BET_FLOW: 3085.02,

            // 留存
            D1_retained_users: 77,
            D7_retained_users: 38,
          },
          {
            date: "2025-11-02", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 414,
            D0_unique_purchase: 172,
            D0_PURCHASE_VALUE: 608.77,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 164,
            D0_SPORTS_BET_PLACED_USER: 94,
            D0_GAMES_BET_PLACED_USER: 111,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 127.47,
            D0_GAMES_BET_FLOW: 1994.65,
            D0_TOTAL_BET_FLOW: 2122.12,

            // 付费 & 投注（D7）
            D7_unique_purchase: 229,
            D7_PURCHASE_VALUE: 2233.54,
            D7_TOTAL_BET_PLACED_USER: 232,
            D7_SPORTS_BET_PLACED_USER: 157,
            D7_GAMES_BET_PLACED_USER: 158,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 513.81,
            D7_GAMES_BET_FLOW: 7512.82,
            D7_TOTAL_BET_FLOW: 8026.64,

            // 留存
            D1_retained_users: 169,
            D7_retained_users: 68,
          },
          {
            date: "2025-11-02", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 882,
            D0_unique_purchase: 401,
            D0_PURCHASE_VALUE: 911.33,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 392,
            D0_SPORTS_BET_PLACED_USER: 140,
            D0_GAMES_BET_PLACED_USER: 309,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 168.71,
            D0_GAMES_BET_FLOW: 3697.28,
            D0_TOTAL_BET_FLOW: 3866,

            // 付费 & 投注（D7）
            D7_unique_purchase: 477,
            D7_PURCHASE_VALUE: 4359.97,
            D7_TOTAL_BET_PLACED_USER: 486,
            D7_SPORTS_BET_PLACED_USER: 218,
            D7_GAMES_BET_PLACED_USER: 390,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 261.68,
            D7_GAMES_BET_FLOW: 18473.64,
            D7_TOTAL_BET_FLOW: 18735.32,

            // 留存
            D1_retained_users: 324,
            D7_retained_users: 116,
          },
          {
            date: "2025-11-02", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1819,
            D0_unique_purchase: 728,
            D0_PURCHASE_VALUE: 1195.18,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 644,
            D0_SPORTS_BET_PLACED_USER: 383,
            D0_GAMES_BET_PLACED_USER: 404,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 242.58,
            D0_GAMES_BET_FLOW: 4513.82,
            D0_TOTAL_BET_FLOW: 4756.4,

            // 付费 & 投注（D7）
            D7_unique_purchase: 880,
            D7_PURCHASE_VALUE: 6261.64,
            D7_TOTAL_BET_PLACED_USER: 848,
            D7_SPORTS_BET_PLACED_USER: 558,
            D7_GAMES_BET_PLACED_USER: 543,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1093.82,
            D7_GAMES_BET_FLOW: 35760.44,
            D7_TOTAL_BET_FLOW: 36854.26,

            // 留存
            D1_retained_users: 611,
            D7_retained_users: 170,
          },
          {
            date: "2025-11-02", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 4,
            D0_unique_purchase: 1,
            D0_PURCHASE_VALUE: 1.13,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 2,
            D0_SPORTS_BET_PLACED_USER: 1,
            D0_GAMES_BET_PLACED_USER: 1,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 0.04,
            D0_GAMES_BET_FLOW: 0.23,
            D0_TOTAL_BET_FLOW: 0.26,

            // 付费 & 投注（D7）
            D7_unique_purchase: 4,
            D7_PURCHASE_VALUE: 16.42,
            D7_TOTAL_BET_PLACED_USER: 4,
            D7_SPORTS_BET_PLACED_USER: 4,
            D7_GAMES_BET_PLACED_USER: 3,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2.44,
            D7_GAMES_BET_FLOW: 392.6,
            D7_TOTAL_BET_FLOW: 395.04,

            // 留存
            D1_retained_users: 2,
            D7_retained_users: 4,
          },
          {
            date: "2025-11-02", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 192,
            D0_unique_purchase: 62,
            D0_PURCHASE_VALUE: 485.83,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 66,
            D0_SPORTS_BET_PLACED_USER: 47,
            D0_GAMES_BET_PLACED_USER: 30,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 654.53,
            D0_GAMES_BET_FLOW: 613.23,
            D0_TOTAL_BET_FLOW: 1267.76,

            // 付费 & 投注（D7）
            D7_unique_purchase: 67,
            D7_PURCHASE_VALUE: 2476.88,
            D7_TOTAL_BET_PLACED_USER: 97,
            D7_SPORTS_BET_PLACED_USER: 78,
            D7_GAMES_BET_PLACED_USER: 39,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2564.65,
            D7_GAMES_BET_FLOW: 2998.24,
            D7_TOTAL_BET_FLOW: 5562.88,

            // 留存
            D1_retained_users: 62,
            D7_retained_users: 24,
          },
          {
            date: "2025-11-03", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 679,
            D0_unique_purchase: 448,
            D0_PURCHASE_VALUE: 1173.77,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 427,
            D0_SPORTS_BET_PLACED_USER: 361,
            D0_GAMES_BET_PLACED_USER: 111,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 1219.84,
            D0_GAMES_BET_FLOW: 2401.58,
            D0_TOTAL_BET_FLOW: 3621.42,

            // 付费 & 投注（D7）
            D7_unique_purchase: 524,
            D7_PURCHASE_VALUE: 4063.77,
            D7_TOTAL_BET_PLACED_USER: 526,
            D7_SPORTS_BET_PLACED_USER: 463,
            D7_GAMES_BET_PLACED_USER: 157,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 6556.03,
            D7_GAMES_BET_FLOW: 10327.55,
            D7_TOTAL_BET_FLOW: 16883.58,

            // 留存
            D1_retained_users: 267,
            D7_retained_users: 54,
          },
          {
            date: "2025-11-03", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1094,
            D0_unique_purchase: 339,
            D0_PURCHASE_VALUE: 692.45,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 349,
            D0_SPORTS_BET_PLACED_USER: 98,
            D0_GAMES_BET_PLACED_USER: 278,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 33.2,
            D0_GAMES_BET_FLOW: 3444,
            D0_TOTAL_BET_FLOW: 3477.2,

            // 付费 & 投注（D7）
            D7_unique_purchase: 471,
            D7_PURCHASE_VALUE: 1680.73,
            D7_TOTAL_BET_PLACED_USER: 567,
            D7_SPORTS_BET_PLACED_USER: 281,
            D7_GAMES_BET_PLACED_USER: 395,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2419.59,
            D7_GAMES_BET_FLOW: 7996.61,
            D7_TOTAL_BET_FLOW: 10416.19,

            // 留存
            D1_retained_users: 524,
            D7_retained_users: 99,
          },
          {
            date: "2025-11-03", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1651,
            D0_unique_purchase: 661,
            D0_PURCHASE_VALUE: 940.32,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 603,
            D0_SPORTS_BET_PLACED_USER: 374,
            D0_GAMES_BET_PLACED_USER: 355,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 321.37,
            D0_GAMES_BET_FLOW: 4320.57,
            D0_TOTAL_BET_FLOW: 4641.94,

            // 付费 & 投注（D7）
            D7_unique_purchase: 815,
            D7_PURCHASE_VALUE: 4514.36,
            D7_TOTAL_BET_PLACED_USER: 796,
            D7_SPORTS_BET_PLACED_USER: 546,
            D7_GAMES_BET_PLACED_USER: 497,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1495.49,
            D7_GAMES_BET_FLOW: 15255.81,
            D7_TOTAL_BET_FLOW: 16751.31,

            // 留存
            D1_retained_users: 644,
            D7_retained_users: 159,
          },
          {
            date: "2025-11-03", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 270,
            D0_unique_purchase: 81,
            D0_PURCHASE_VALUE: 278.36,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 84,
            D0_SPORTS_BET_PLACED_USER: 54,
            D0_GAMES_BET_PLACED_USER: 51,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 177.14,
            D0_GAMES_BET_FLOW: 657.43,
            D0_TOTAL_BET_FLOW: 834.57,

            // 付费 & 投注（D7）
            D7_unique_purchase: 113,
            D7_PURCHASE_VALUE: 843.14,
            D7_TOTAL_BET_PLACED_USER: 119,
            D7_SPORTS_BET_PLACED_USER: 88,
            D7_GAMES_BET_PLACED_USER: 67,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 306.77,
            D7_GAMES_BET_FLOW: 3992.57,
            D7_TOTAL_BET_FLOW: 4299.34,

            // 留存
            D1_retained_users: 138,
            D7_retained_users: 23,
          },
          {
            date: "2025-11-03", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 136,
            D0_unique_purchase: 33,
            D0_PURCHASE_VALUE: 213.04,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 31,
            D0_SPORTS_BET_PLACED_USER: 21,
            D0_GAMES_BET_PLACED_USER: 15,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 48.39,
            D0_GAMES_BET_FLOW: 923.17,
            D0_TOTAL_BET_FLOW: 971.56,

            // 付费 & 投注（D7）
            D7_unique_purchase: 41,
            D7_PURCHASE_VALUE: 517.74,
            D7_TOTAL_BET_PLACED_USER: 60,
            D7_SPORTS_BET_PLACED_USER: 53,
            D7_GAMES_BET_PLACED_USER: 24,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 125.45,
            D7_GAMES_BET_FLOW: 2311.89,
            D7_TOTAL_BET_FLOW: 2437.35,

            // 留存
            D1_retained_users: 51,
            D7_retained_users: 10,
          },
          {
            date: "2025-11-04", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 917,
            D0_unique_purchase: 589,
            D0_PURCHASE_VALUE: 1257.38,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 557,
            D0_SPORTS_BET_PLACED_USER: 497,
            D0_GAMES_BET_PLACED_USER: 109,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 974.96,
            D0_GAMES_BET_FLOW: 1160.65,
            D0_TOTAL_BET_FLOW: 2135.6,

            // 付费 & 投注（D7）
            D7_unique_purchase: 717,
            D7_PURCHASE_VALUE: 3964.38,
            D7_TOTAL_BET_PLACED_USER: 711,
            D7_SPORTS_BET_PLACED_USER: 644,
            D7_GAMES_BET_PLACED_USER: 174,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1436.29,
            D7_GAMES_BET_FLOW: 11022.8,
            D7_TOTAL_BET_FLOW: 12459.1,

            // 留存
            D1_retained_users: 390,
            D7_retained_users: 69,
          },
          {
            date: "2025-11-04", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 942,
            D0_unique_purchase: 387,
            D0_PURCHASE_VALUE: 749.38,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 367,
            D0_SPORTS_BET_PLACED_USER: 154,
            D0_GAMES_BET_PLACED_USER: 277,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 63.49,
            D0_GAMES_BET_FLOW: 5003.76,
            D0_TOTAL_BET_FLOW: 5067.25,

            // 付费 & 投注（D7）
            D7_unique_purchase: 489,
            D7_PURCHASE_VALUE: 2147.13,
            D7_TOTAL_BET_PLACED_USER: 496,
            D7_SPORTS_BET_PLACED_USER: 245,
            D7_GAMES_BET_PLACED_USER: 379,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 162.64,
            D7_GAMES_BET_FLOW: 18009.44,
            D7_TOTAL_BET_FLOW: 18172.08,

            // 留存
            D1_retained_users: 358,
            D7_retained_users: 90,
          },
          {
            date: "2025-11-04", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1776,
            D0_unique_purchase: 749,
            D0_PURCHASE_VALUE: 873.81,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 686,
            D0_SPORTS_BET_PLACED_USER: 439,
            D0_GAMES_BET_PLACED_USER: 404,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 316.27,
            D0_GAMES_BET_FLOW: 3195.32,
            D0_TOTAL_BET_FLOW: 3511.59,

            // 付费 & 投注（D7）
            D7_unique_purchase: 918,
            D7_PURCHASE_VALUE: 2775.11,
            D7_TOTAL_BET_PLACED_USER: 888,
            D7_SPORTS_BET_PLACED_USER: 623,
            D7_GAMES_BET_PLACED_USER: 546,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2050.99,
            D7_GAMES_BET_FLOW: 11560.71,
            D7_TOTAL_BET_FLOW: 13611.7,

            // 留存
            D1_retained_users: 661,
            D7_retained_users: 132,
          },
          {
            date: "2025-11-04", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1119,
            D0_unique_purchase: 284,
            D0_PURCHASE_VALUE: 734.55,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 303,
            D0_SPORTS_BET_PLACED_USER: 214,
            D0_GAMES_BET_PLACED_USER: 156,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 131.05,
            D0_GAMES_BET_FLOW: 3156.81,
            D0_TOTAL_BET_FLOW: 3287.86,

            // 付费 & 投注（D7）
            D7_unique_purchase: 412,
            D7_PURCHASE_VALUE: 2553.49,
            D7_TOTAL_BET_PLACED_USER: 441,
            D7_SPORTS_BET_PLACED_USER: 312,
            D7_GAMES_BET_PLACED_USER: 246,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 455.44,
            D7_GAMES_BET_FLOW: 11469.07,
            D7_TOTAL_BET_FLOW: 11924.51,

            // 留存
            D1_retained_users: 414,
            D7_retained_users: 148,
          },
          {
            date: "2025-11-04", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 207,
            D0_unique_purchase: 74,
            D0_PURCHASE_VALUE: 180.45,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 72,
            D0_SPORTS_BET_PLACED_USER: 54,
            D0_GAMES_BET_PLACED_USER: 29,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 125.84,
            D0_GAMES_BET_FLOW: 313.33,
            D0_TOTAL_BET_FLOW: 439.18,

            // 付费 & 投注（D7）
            D7_unique_purchase: 83,
            D7_PURCHASE_VALUE: 340.51,
            D7_TOTAL_BET_PLACED_USER: 101,
            D7_SPORTS_BET_PLACED_USER: 81,
            D7_GAMES_BET_PLACED_USER: 43,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 401.83,
            D7_GAMES_BET_FLOW: 748.01,
            D7_TOTAL_BET_FLOW: 1149.84,

            // 留存
            D1_retained_users: 87,
            D7_retained_users: 19,
          },
          {
            date: "2025-11-05", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 666,
            D0_unique_purchase: 440,
            D0_PURCHASE_VALUE: 1338.62,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 398,
            D0_SPORTS_BET_PLACED_USER: 327,
            D0_GAMES_BET_PLACED_USER: 121,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 651.15,
            D0_GAMES_BET_FLOW: 2676.33,
            D0_TOTAL_BET_FLOW: 3327.48,

            // 付费 & 投注（D7）
            D7_unique_purchase: 474,
            D7_PURCHASE_VALUE: 3950.32,
            D7_TOTAL_BET_PLACED_USER: 468,
            D7_SPORTS_BET_PLACED_USER: 395,
            D7_GAMES_BET_PLACED_USER: 161,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1379.03,
            D7_GAMES_BET_FLOW: 14836.53,
            D7_TOTAL_BET_FLOW: 16215.56,

            // 留存
            D1_retained_users: 286,
            D7_retained_users: 42,
          },
          {
            date: "2025-11-05", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1054,
            D0_unique_purchase: 426,
            D0_PURCHASE_VALUE: 1265.08,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 404,
            D0_SPORTS_BET_PLACED_USER: 134,
            D0_GAMES_BET_PLACED_USER: 321,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 74.13,
            D0_GAMES_BET_FLOW: 8885.5,
            D0_TOTAL_BET_FLOW: 8959.63,

            // 付费 & 投注（D7）
            D7_unique_purchase: 520,
            D7_PURCHASE_VALUE: 5459.23,
            D7_TOTAL_BET_PLACED_USER: 572,
            D7_SPORTS_BET_PLACED_USER: 272,
            D7_GAMES_BET_PLACED_USER: 426,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 411.83,
            D7_GAMES_BET_FLOW: 38878.27,
            D7_TOTAL_BET_FLOW: 39290.1,

            // 留存
            D1_retained_users: 347,
            D7_retained_users: 117,
          },
          {
            date: "2025-11-05", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1767,
            D0_unique_purchase: 695,
            D0_PURCHASE_VALUE: 803.66,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 641,
            D0_SPORTS_BET_PLACED_USER: 395,
            D0_GAMES_BET_PLACED_USER: 373,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 177.06,
            D0_GAMES_BET_FLOW: 4230.41,
            D0_TOTAL_BET_FLOW: 4407.47,

            // 付费 & 投注（D7）
            D7_unique_purchase: 863,
            D7_PURCHASE_VALUE: 2968.2,
            D7_TOTAL_BET_PLACED_USER: 844,
            D7_SPORTS_BET_PLACED_USER: 573,
            D7_GAMES_BET_PLACED_USER: 518,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1257.63,
            D7_GAMES_BET_FLOW: 22875.81,
            D7_TOTAL_BET_FLOW: 24133.44,

            // 留存
            D1_retained_users: 601,
            D7_retained_users: 153,
          },
          {
            date: "2025-11-05", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1116,
            D0_unique_purchase: 218,
            D0_PURCHASE_VALUE: 339.9,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 248,
            D0_SPORTS_BET_PLACED_USER: 150,
            D0_GAMES_BET_PLACED_USER: 142,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 66.92,
            D0_GAMES_BET_FLOW: 1379.55,
            D0_TOTAL_BET_FLOW: 1446.47,

            // 付费 & 投注（D7）
            D7_unique_purchase: 425,
            D7_PURCHASE_VALUE: 1240.78,
            D7_TOTAL_BET_PLACED_USER: 466,
            D7_SPORTS_BET_PLACED_USER: 333,
            D7_GAMES_BET_PLACED_USER: 223,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 188.28,
            D7_GAMES_BET_FLOW: 5978.64,
            D7_TOTAL_BET_FLOW: 6166.93,

            // 留存
            D1_retained_users: 316,
            D7_retained_users: 84,
          },
          {
            date: "2025-11-05", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 162,
            D0_unique_purchase: 45,
            D0_PURCHASE_VALUE: 235.65,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 48,
            D0_SPORTS_BET_PLACED_USER: 35,
            D0_GAMES_BET_PLACED_USER: 21,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 31.97,
            D0_GAMES_BET_FLOW: 761.27,
            D0_TOTAL_BET_FLOW: 793.24,

            // 付费 & 投注（D7）
            D7_unique_purchase: 56,
            D7_PURCHASE_VALUE: 750.28,
            D7_TOTAL_BET_PLACED_USER: 73,
            D7_SPORTS_BET_PLACED_USER: 59,
            D7_GAMES_BET_PLACED_USER: 30,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 70.59,
            D7_GAMES_BET_FLOW: 3405.72,
            D7_TOTAL_BET_FLOW: 3476.31,

            // 留存
            D1_retained_users: 63,
            D7_retained_users: 16,
          },
          {
            date: "2025-11-06", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 611,
            D0_unique_purchase: 321,
            D0_PURCHASE_VALUE: 969.23,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 234,
            D0_SPORTS_BET_PLACED_USER: 150,
            D0_GAMES_BET_PLACED_USER: 113,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 260.99,
            D0_GAMES_BET_FLOW: 3850.37,
            D0_TOTAL_BET_FLOW: 4111.36,

            // 付费 & 投注（D7）
            D7_unique_purchase: 357,
            D7_PURCHASE_VALUE: 1950.23,
            D7_TOTAL_BET_PLACED_USER: 362,
            D7_SPORTS_BET_PLACED_USER: 271,
            D7_GAMES_BET_PLACED_USER: 152,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 586.39,
            D7_GAMES_BET_FLOW: 9586.9,
            D7_TOTAL_BET_FLOW: 10173.29,

            // 留存
            D1_retained_users: 162,
            D7_retained_users: 42,
          },
          {
            date: "2025-11-06", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1247,
            D0_unique_purchase: 306,
            D0_PURCHASE_VALUE: 1221.83,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 290,
            D0_SPORTS_BET_PLACED_USER: 84,
            D0_GAMES_BET_PLACED_USER: 249,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 67.86,
            D0_GAMES_BET_FLOW: 5437.98,
            D0_TOTAL_BET_FLOW: 5505.85,

            // 付费 & 投注（D7）
            D7_unique_purchase: 413,
            D7_PURCHASE_VALUE: 2518.82,
            D7_TOTAL_BET_PLACED_USER: 498,
            D7_SPORTS_BET_PLACED_USER: 244,
            D7_GAMES_BET_PLACED_USER: 365,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 343.59,
            D7_GAMES_BET_FLOW: 13211.77,
            D7_TOTAL_BET_FLOW: 13555.36,

            // 留存
            D1_retained_users: 340,
            D7_retained_users: 126,
          },
          {
            date: "2025-11-06", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1957,
            D0_unique_purchase: 760,
            D0_PURCHASE_VALUE: 839.89,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 659,
            D0_SPORTS_BET_PLACED_USER: 378,
            D0_GAMES_BET_PLACED_USER: 427,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 428.22,
            D0_GAMES_BET_FLOW: 2651.02,
            D0_TOTAL_BET_FLOW: 3079.25,

            // 付费 & 投注（D7）
            D7_unique_purchase: 936,
            D7_PURCHASE_VALUE: 2608.25,
            D7_TOTAL_BET_PLACED_USER: 903,
            D7_SPORTS_BET_PLACED_USER: 595,
            D7_GAMES_BET_PLACED_USER: 574,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1128.31,
            D7_GAMES_BET_FLOW: 14517.37,
            D7_TOTAL_BET_FLOW: 15645.68,

            // 留存
            D1_retained_users: 616,
            D7_retained_users: 183,
          },
          {
            date: "2025-11-06", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1035,
            D0_unique_purchase: 272,
            D0_PURCHASE_VALUE: 453.45,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 310,
            D0_SPORTS_BET_PLACED_USER: 181,
            D0_GAMES_BET_PLACED_USER: 190,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 69.07,
            D0_GAMES_BET_FLOW: 2600.96,
            D0_TOTAL_BET_FLOW: 2670.03,

            // 付费 & 投注（D7）
            D7_unique_purchase: 407,
            D7_PURCHASE_VALUE: 1948.74,
            D7_TOTAL_BET_PLACED_USER: 460,
            D7_SPORTS_BET_PLACED_USER: 280,
            D7_GAMES_BET_PLACED_USER: 300,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 246.81,
            D7_GAMES_BET_FLOW: 9395.85,
            D7_TOTAL_BET_FLOW: 9642.66,

            // 留存
            D1_retained_users: 346,
            D7_retained_users: 86,
          },
          {
            date: "2025-11-06", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 168,
            D0_unique_purchase: 43,
            D0_PURCHASE_VALUE: 135.39,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 51,
            D0_SPORTS_BET_PLACED_USER: 40,
            D0_GAMES_BET_PLACED_USER: 19,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 35.04,
            D0_GAMES_BET_FLOW: 525.03,
            D0_TOTAL_BET_FLOW: 560.07,

            // 付费 & 投注（D7）
            D7_unique_purchase: 62,
            D7_PURCHASE_VALUE: 629.37,
            D7_TOTAL_BET_PLACED_USER: 76,
            D7_SPORTS_BET_PLACED_USER: 63,
            D7_GAMES_BET_PLACED_USER: 30,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 127.6,
            D7_GAMES_BET_FLOW: 2809.59,
            D7_TOTAL_BET_FLOW: 2937.2,

            // 留存
            D1_retained_users: 51,
            D7_retained_users: 16,
          },
          {
            date: "2025-11-07", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 813,
            D0_unique_purchase: 533,
            D0_PURCHASE_VALUE: 1384.92,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 436,
            D0_SPORTS_BET_PLACED_USER: 348,
            D0_GAMES_BET_PLACED_USER: 123,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 680.57,
            D0_GAMES_BET_FLOW: 2165.57,
            D0_TOTAL_BET_FLOW: 2846.14,

            // 付费 & 投注（D7）
            D7_unique_purchase: 583,
            D7_PURCHASE_VALUE: 5182.54,
            D7_TOTAL_BET_PLACED_USER: 579,
            D7_SPORTS_BET_PLACED_USER: 486,
            D7_GAMES_BET_PLACED_USER: 171,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1126.92,
            D7_GAMES_BET_FLOW: 22776.03,
            D7_TOTAL_BET_FLOW: 23902.96,

            // 留存
            D1_retained_users: 312,
            D7_retained_users: 56,
          },
          {
            date: "2025-11-07", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1094,
            D0_unique_purchase: 353,
            D0_PURCHASE_VALUE: 1916.21,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 350,
            D0_SPORTS_BET_PLACED_USER: 92,
            D0_GAMES_BET_PLACED_USER: 297,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 7887.7,
            D0_GAMES_BET_FLOW: 4612.6,
            D0_TOTAL_BET_FLOW: 12500.3,

            // 付费 & 投注（D7）
            D7_unique_purchase: 455,
            D7_PURCHASE_VALUE: 6307.92,
            D7_TOTAL_BET_PLACED_USER: 500,
            D7_SPORTS_BET_PLACED_USER: 209,
            D7_GAMES_BET_PLACED_USER: 385,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 12820.84,
            D7_GAMES_BET_FLOW: 9327.56,
            D7_TOTAL_BET_FLOW: 22148.4,

            // 留存
            D1_retained_users: 373,
            D7_retained_users: 82,
          },
          {
            date: "2025-11-07", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1990,
            D0_unique_purchase: 712,
            D0_PURCHASE_VALUE: 2220.64,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 643,
            D0_SPORTS_BET_PLACED_USER: 384,
            D0_GAMES_BET_PLACED_USER: 403,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 670.12,
            D0_GAMES_BET_FLOW: 9690.17,
            D0_TOTAL_BET_FLOW: 10360.28,

            // 付费 & 投注（D7）
            D7_unique_purchase: 898,
            D7_PURCHASE_VALUE: 7155,
            D7_TOTAL_BET_PLACED_USER: 891,
            D7_SPORTS_BET_PLACED_USER: 588,
            D7_GAMES_BET_PLACED_USER: 573,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1297.75,
            D7_GAMES_BET_FLOW: 63616.38,
            D7_TOTAL_BET_FLOW: 64914.13,

            // 留存
            D1_retained_users: 719,
            D7_retained_users: 150,
          },
          {
            date: "2025-11-07", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 987,
            D0_unique_purchase: 278,
            D0_PURCHASE_VALUE: 498.85,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 303,
            D0_SPORTS_BET_PLACED_USER: 153,
            D0_GAMES_BET_PLACED_USER: 193,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 90.14,
            D0_GAMES_BET_FLOW: 2379.89,
            D0_TOTAL_BET_FLOW: 2470.04,

            // 付费 & 投注（D7）
            D7_unique_purchase: 417,
            D7_PURCHASE_VALUE: 1557.96,
            D7_TOTAL_BET_PLACED_USER: 443,
            D7_SPORTS_BET_PLACED_USER: 256,
            D7_GAMES_BET_PLACED_USER: 298,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 264.77,
            D7_GAMES_BET_FLOW: 9669.89,
            D7_TOTAL_BET_FLOW: 9934.66,

            // 留存
            D1_retained_users: 361,
            D7_retained_users: 66,
          },
          {
            date: "2025-11-07", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 153,
            D0_unique_purchase: 39,
            D0_PURCHASE_VALUE: 239.81,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 39,
            D0_SPORTS_BET_PLACED_USER: 29,
            D0_GAMES_BET_PLACED_USER: 19,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 45.52,
            D0_GAMES_BET_FLOW: 766.49,
            D0_TOTAL_BET_FLOW: 812.02,

            // 付费 & 投注（D7）
            D7_unique_purchase: 51,
            D7_PURCHASE_VALUE: 1068.89,
            D7_TOTAL_BET_PLACED_USER: 59,
            D7_SPORTS_BET_PLACED_USER: 44,
            D7_GAMES_BET_PLACED_USER: 29,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 197.85,
            D7_GAMES_BET_FLOW: 4344.01,
            D7_TOTAL_BET_FLOW: 4541.86,

            // 留存
            D1_retained_users: 55,
            D7_retained_users: 16,
          },
          {
            date: "2025-11-08", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 617,
            D0_unique_purchase: 324,
            D0_PURCHASE_VALUE: 1408.38,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 314,
            D0_SPORTS_BET_PLACED_USER: 263,
            D0_GAMES_BET_PLACED_USER: 98,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 984.01,
            D0_GAMES_BET_FLOW: 2970.4,
            D0_TOTAL_BET_FLOW: 3954.41,

            // 付费 & 投注（D7）
            D7_unique_purchase: 449,
            D7_PURCHASE_VALUE: 3490.54,
            D7_TOTAL_BET_PLACED_USER: 443,
            D7_SPORTS_BET_PLACED_USER: 387,
            D7_GAMES_BET_PLACED_USER: 157,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2048.94,
            D7_GAMES_BET_FLOW: 12813.89,
            D7_TOTAL_BET_FLOW: 14862.83,

            // 留存
            D1_retained_users: 238,
            D7_retained_users: 47,
          },
          {
            date: "2025-11-08", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1020,
            D0_unique_purchase: 424,
            D0_PURCHASE_VALUE: 1321.86,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 427,
            D0_SPORTS_BET_PLACED_USER: 156,
            D0_GAMES_BET_PLACED_USER: 323,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 84.5,
            D0_GAMES_BET_FLOW: 5338.74,
            D0_TOTAL_BET_FLOW: 5423.25,

            // 付费 & 投注（D7）
            D7_unique_purchase: 513,
            D7_PURCHASE_VALUE: 3133.57,
            D7_TOTAL_BET_PLACED_USER: 548,
            D7_SPORTS_BET_PLACED_USER: 239,
            D7_GAMES_BET_PLACED_USER: 422,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 166.02,
            D7_GAMES_BET_FLOW: 17488.47,
            D7_TOTAL_BET_FLOW: 17654.5,

            // 留存
            D1_retained_users: 360,
            D7_retained_users: 100,
          },
          {
            date: "2025-11-08", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1877,
            D0_unique_purchase: 745,
            D0_PURCHASE_VALUE: 1377.06,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 687,
            D0_SPORTS_BET_PLACED_USER: 448,
            D0_GAMES_BET_PLACED_USER: 377,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 871.26,
            D0_GAMES_BET_FLOW: 3564.83,
            D0_TOTAL_BET_FLOW: 4436.09,

            // 付费 & 投注（D7）
            D7_unique_purchase: 902,
            D7_PURCHASE_VALUE: 3735.62,
            D7_TOTAL_BET_PLACED_USER: 891,
            D7_SPORTS_BET_PLACED_USER: 602,
            D7_GAMES_BET_PLACED_USER: 543,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1956.88,
            D7_GAMES_BET_FLOW: 26388.06,
            D7_TOTAL_BET_FLOW: 28344.94,

            // 留存
            D1_retained_users: 628,
            D7_retained_users: 185,
          },
          {
            date: "2025-11-08", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1008,
            D0_unique_purchase: 344,
            D0_PURCHASE_VALUE: 520.28,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 337,
            D0_SPORTS_BET_PLACED_USER: 212,
            D0_GAMES_BET_PLACED_USER: 202,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 120.31,
            D0_GAMES_BET_FLOW: 2166.86,
            D0_TOTAL_BET_FLOW: 2287.17,

            // 付费 & 投注（D7）
            D7_unique_purchase: 467,
            D7_PURCHASE_VALUE: 1413.25,
            D7_TOTAL_BET_PLACED_USER: 484,
            D7_SPORTS_BET_PLACED_USER: 318,
            D7_GAMES_BET_PLACED_USER: 311,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 306.61,
            D7_GAMES_BET_FLOW: 7321.34,
            D7_TOTAL_BET_FLOW: 7627.95,

            // 留存
            D1_retained_users: 389,
            D7_retained_users: 100,
          },
          {
            date: "2025-11-08", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 199,
            D0_unique_purchase: 70,
            D0_PURCHASE_VALUE: 150.31,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 73,
            D0_SPORTS_BET_PLACED_USER: 60,
            D0_GAMES_BET_PLACED_USER: 27,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 57.31,
            D0_GAMES_BET_FLOW: 205.8,
            D0_TOTAL_BET_FLOW: 263.1,

            // 付费 & 投注（D7）
            D7_unique_purchase: 87,
            D7_PURCHASE_VALUE: 202.84,
            D7_TOTAL_BET_PLACED_USER: 100,
            D7_SPORTS_BET_PLACED_USER: 81,
            D7_GAMES_BET_PLACED_USER: 47,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 121.27,
            D7_GAMES_BET_FLOW: 342.12,
            D7_TOTAL_BET_FLOW: 463.39,

            // 留存
            D1_retained_users: 85,
            D7_retained_users: 17,
          },
          {
            date: "2025-11-09", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 684,
            D0_unique_purchase: 498,
            D0_PURCHASE_VALUE: 1852.77,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 487,
            D0_SPORTS_BET_PLACED_USER: 431,
            D0_GAMES_BET_PLACED_USER: 127,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 935.7,
            D0_GAMES_BET_FLOW: 5411.28,
            D0_TOTAL_BET_FLOW: 6346.98,

            // 付费 & 投注（D7）
            D7_unique_purchase: 536,
            D7_PURCHASE_VALUE: 4161.62,
            D7_TOTAL_BET_PLACED_USER: 533,
            D7_SPORTS_BET_PLACED_USER: 468,
            D7_GAMES_BET_PLACED_USER: 180,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1244.75,
            D7_GAMES_BET_FLOW: 26196.54,
            D7_TOTAL_BET_FLOW: 27441.29,

            // 留存
            D1_retained_users: 192,
            D7_retained_users: 54,
          },
          {
            date: "2025-11-09", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 995,
            D0_unique_purchase: 403,
            D0_PURCHASE_VALUE: 604.99,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 406,
            D0_SPORTS_BET_PLACED_USER: 150,
            D0_GAMES_BET_PLACED_USER: 328,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 119.98,
            D0_GAMES_BET_FLOW: 2360.09,
            D0_TOTAL_BET_FLOW: 2480.07,

            // 付费 & 投注（D7）
            D7_unique_purchase: 472,
            D7_PURCHASE_VALUE: 2286.85,
            D7_TOTAL_BET_PLACED_USER: 495,
            D7_SPORTS_BET_PLACED_USER: 201,
            D7_GAMES_BET_PLACED_USER: 410,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 299.71,
            D7_GAMES_BET_FLOW: 11162.84,
            D7_TOTAL_BET_FLOW: 11462.55,

            // 留存
            D1_retained_users: 332,
            D7_retained_users: 101,
          },
          {
            date: "2025-11-09", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1670,
            D0_unique_purchase: 628,
            D0_PURCHASE_VALUE: 1301.89,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 564,
            D0_SPORTS_BET_PLACED_USER: 329,
            D0_GAMES_BET_PLACED_USER: 360,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 353.24,
            D0_GAMES_BET_FLOW: 4842.06,
            D0_TOTAL_BET_FLOW: 5195.3,

            // 付费 & 投注（D7）
            D7_unique_purchase: 774,
            D7_PURCHASE_VALUE: 4242.91,
            D7_TOTAL_BET_PLACED_USER: 759,
            D7_SPORTS_BET_PLACED_USER: 487,
            D7_GAMES_BET_PLACED_USER: 512,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 719.66,
            D7_GAMES_BET_FLOW: 20208.58,
            D7_TOTAL_BET_FLOW: 20928.24,

            // 留存
            D1_retained_users: 534,
            D7_retained_users: 148,
          },
          {
            date: "2025-11-09", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1024,
            D0_unique_purchase: 349,
            D0_PURCHASE_VALUE: 678.35,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 355,
            D0_SPORTS_BET_PLACED_USER: 199,
            D0_GAMES_BET_PLACED_USER: 228,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 117.92,
            D0_GAMES_BET_FLOW: 3006.45,
            D0_TOTAL_BET_FLOW: 3124.38,

            // 付费 & 投注（D7）
            D7_unique_purchase: 453,
            D7_PURCHASE_VALUE: 1703.98,
            D7_TOTAL_BET_PLACED_USER: 473,
            D7_SPORTS_BET_PLACED_USER: 280,
            D7_GAMES_BET_PLACED_USER: 328,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 262.74,
            D7_GAMES_BET_FLOW: 8261.24,
            D7_TOTAL_BET_FLOW: 8523.98,

            // 留存
            D1_retained_users: 425,
            D7_retained_users: 103,
          },
          {
            date: "2025-11-09", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 134,
            D0_unique_purchase: 41,
            D0_PURCHASE_VALUE: 140.77,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 43,
            D0_SPORTS_BET_PLACED_USER: 37,
            D0_GAMES_BET_PLACED_USER: 12,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 86.53,
            D0_GAMES_BET_FLOW: 145.03,
            D0_TOTAL_BET_FLOW: 231.55,

            // 付费 & 投注（D7）
            D7_unique_purchase: 47,
            D7_PURCHASE_VALUE: 366.08,
            D7_TOTAL_BET_PLACED_USER: 54,
            D7_SPORTS_BET_PLACED_USER: 43,
            D7_GAMES_BET_PLACED_USER: 23,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 192.34,
            D7_GAMES_BET_FLOW: 330.65,
            D7_TOTAL_BET_FLOW: 522.99,

            // 留存
            D1_retained_users: 48,
            D7_retained_users: 23,
          },
          {
            date: "2025-11-10", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 733,
            D0_unique_purchase: 315,
            D0_PURCHASE_VALUE: 1991.77,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 220,
            D0_SPORTS_BET_PLACED_USER: 148,
            D0_GAMES_BET_PLACED_USER: 103,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 309.63,
            D0_GAMES_BET_FLOW: 6925.23,
            D0_TOTAL_BET_FLOW: 7234.86,

            // 付费 & 投注（D7）
            D7_unique_purchase: 555,
            D7_PURCHASE_VALUE: 6560.31,
            D7_TOTAL_BET_PLACED_USER: 556,
            D7_SPORTS_BET_PLACED_USER: 485,
            D7_GAMES_BET_PLACED_USER: 183,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 5691.69,
            D7_GAMES_BET_FLOW: 15297.79,
            D7_TOTAL_BET_FLOW: 20989.47,

            // 留存
            D1_retained_users: 352,
            D7_retained_users: 36,
          },
          {
            date: "2025-11-10", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1336,
            D0_unique_purchase: 347,
            D0_PURCHASE_VALUE: 546.11,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 335,
            D0_SPORTS_BET_PLACED_USER: 91,
            D0_GAMES_BET_PLACED_USER: 283,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 35.03,
            D0_GAMES_BET_FLOW: 2746.43,
            D0_TOTAL_BET_FLOW: 2781.46,

            // 付费 & 投注（D7）
            D7_unique_purchase: 482,
            D7_PURCHASE_VALUE: 1360.55,
            D7_TOTAL_BET_PLACED_USER: 561,
            D7_SPORTS_BET_PLACED_USER: 269,
            D7_GAMES_BET_PLACED_USER: 391,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 140.89,
            D7_GAMES_BET_FLOW: 7264.14,
            D7_TOTAL_BET_FLOW: 7405.04,

            // 留存
            D1_retained_users: 758,
            D7_retained_users: 91,
          },
          {
            date: "2025-11-10", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1527,
            D0_unique_purchase: 532,
            D0_PURCHASE_VALUE: 1342.7,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 469,
            D0_SPORTS_BET_PLACED_USER: 231,
            D0_GAMES_BET_PLACED_USER: 333,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 105.62,
            D0_GAMES_BET_FLOW: 9157.81,
            D0_TOTAL_BET_FLOW: 9263.42,

            // 付费 & 投注（D7）
            D7_unique_purchase: 667,
            D7_PURCHASE_VALUE: 6061.98,
            D7_TOTAL_BET_PLACED_USER: 641,
            D7_SPORTS_BET_PLACED_USER: 371,
            D7_GAMES_BET_PLACED_USER: 463,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1796.33,
            D7_GAMES_BET_FLOW: 25373.27,
            D7_TOTAL_BET_FLOW: 27169.6,

            // 留存
            D1_retained_users: 481,
            D7_retained_users: 133,
          },
          {
            date: "2025-11-10", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 966,
            D0_unique_purchase: 275,
            D0_PURCHASE_VALUE: 441.74,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 255,
            D0_SPORTS_BET_PLACED_USER: 90,
            D0_GAMES_BET_PLACED_USER: 214,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 49.09,
            D0_GAMES_BET_FLOW: 2605.98,
            D0_TOTAL_BET_FLOW: 2655.07,

            // 付费 & 投注（D7）
            D7_unique_purchase: 376,
            D7_PURCHASE_VALUE: 1644.42,
            D7_TOTAL_BET_PLACED_USER: 380,
            D7_SPORTS_BET_PLACED_USER: 162,
            D7_GAMES_BET_PLACED_USER: 315,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 149.2,
            D7_GAMES_BET_FLOW: 9347.36,
            D7_TOTAL_BET_FLOW: 9496.57,

            // 留存
            D1_retained_users: 316,
            D7_retained_users: 72,
          },
          {
            date: "2025-11-10", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 228,
            D0_unique_purchase: 34,
            D0_PURCHASE_VALUE: 114,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 31,
            D0_SPORTS_BET_PLACED_USER: 15,
            D0_GAMES_BET_PLACED_USER: 20,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 16.58,
            D0_GAMES_BET_FLOW: 439.4,
            D0_TOTAL_BET_FLOW: 455.98,

            // 付费 & 投注（D7）
            D7_unique_purchase: 48,
            D7_PURCHASE_VALUE: 247.39,
            D7_TOTAL_BET_PLACED_USER: 54,
            D7_SPORTS_BET_PLACED_USER: 31,
            D7_GAMES_BET_PLACED_USER: 36,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 79.03,
            D7_GAMES_BET_FLOW: 875.07,
            D7_TOTAL_BET_FLOW: 954.09,

            // 留存
            D1_retained_users: 44,
            D7_retained_users: 23,
          },
          {
            date: "2025-11-11", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 691,
            D0_unique_purchase: 443,
            D0_PURCHASE_VALUE: 1325.54,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 254,
            D0_SPORTS_BET_PLACED_USER: 159,
            D0_GAMES_BET_PLACED_USER: 127,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 351.15,
            D0_GAMES_BET_FLOW: 3627.72,
            D0_TOTAL_BET_FLOW: 3978.87,

            // 付费 & 投注（D7）
            D7_unique_purchase: 532,
            D7_PURCHASE_VALUE: 2679,
            D7_TOTAL_BET_PLACED_USER: 533,
            D7_SPORTS_BET_PLACED_USER: 432,
            D7_GAMES_BET_PLACED_USER: 178,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1334.15,
            D7_GAMES_BET_FLOW: 8673.65,
            D7_TOTAL_BET_FLOW: 10007.8,

            // 留存
            D1_retained_users: 331,
            D7_retained_users: 55,
          },
          {
            date: "2025-11-11", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1046,
            D0_unique_purchase: 335,
            D0_PURCHASE_VALUE: 824.57,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 326,
            D0_SPORTS_BET_PLACED_USER: 60,
            D0_GAMES_BET_PLACED_USER: 296,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 11.06,
            D0_GAMES_BET_FLOW: 3352.67,
            D0_TOTAL_BET_FLOW: 3363.73,

            // 付费 & 投注（D7）
            D7_unique_purchase: 425,
            D7_PURCHASE_VALUE: 13209.21,
            D7_TOTAL_BET_PLACED_USER: 467,
            D7_SPORTS_BET_PLACED_USER: 160,
            D7_GAMES_BET_PLACED_USER: 387,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 103.29,
            D7_GAMES_BET_FLOW: 57311.49,
            D7_TOTAL_BET_FLOW: 57414.78,

            // 留存
            D1_retained_users: 370,
            D7_retained_users: 73,
          },
          {
            date: "2025-11-11", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1615,
            D0_unique_purchase: 554,
            D0_PURCHASE_VALUE: 1382.4,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 489,
            D0_SPORTS_BET_PLACED_USER: 270,
            D0_GAMES_BET_PLACED_USER: 335,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 95.56,
            D0_GAMES_BET_FLOW: 3408.94,
            D0_TOTAL_BET_FLOW: 3504.5,

            // 付费 & 投注（D7）
            D7_unique_purchase: 697,
            D7_PURCHASE_VALUE: 2287.68,
            D7_TOTAL_BET_PLACED_USER: 666,
            D7_SPORTS_BET_PLACED_USER: 397,
            D7_GAMES_BET_PLACED_USER: 453,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 347.03,
            D7_GAMES_BET_FLOW: 11660.43,
            D7_TOTAL_BET_FLOW: 12007.46,

            // 留存
            D1_retained_users: 489,
            D7_retained_users: 130,
          },
          {
            date: "2025-11-11", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1209,
            D0_unique_purchase: 249,
            D0_PURCHASE_VALUE: 629.92,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 231,
            D0_SPORTS_BET_PLACED_USER: 71,
            D0_GAMES_BET_PLACED_USER: 193,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 26.03,
            D0_GAMES_BET_FLOW: 3941.07,
            D0_TOTAL_BET_FLOW: 3967.11,

            // 付费 & 投注（D7）
            D7_unique_purchase: 346,
            D7_PURCHASE_VALUE: 1528.7,
            D7_TOTAL_BET_PLACED_USER: 350,
            D7_SPORTS_BET_PLACED_USER: 163,
            D7_GAMES_BET_PLACED_USER: 262,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 102.03,
            D7_GAMES_BET_FLOW: 8658.2,
            D7_TOTAL_BET_FLOW: 8760.23,

            // 留存
            D1_retained_users: 248,
            D7_retained_users: 67,
          },
          {
            date: "2025-11-11", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 97,
            D0_unique_purchase: 32,
            D0_PURCHASE_VALUE: 47.71,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 32,
            D0_SPORTS_BET_PLACED_USER: 21,
            D0_GAMES_BET_PLACED_USER: 16,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 11.38,
            D0_GAMES_BET_FLOW: 122.12,
            D0_TOTAL_BET_FLOW: 133.5,

            // 付费 & 投注（D7）
            D7_unique_purchase: 38,
            D7_PURCHASE_VALUE: 179.87,
            D7_TOTAL_BET_PLACED_USER: 41,
            D7_SPORTS_BET_PLACED_USER: 31,
            D7_GAMES_BET_PLACED_USER: 22,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 25.79,
            D7_GAMES_BET_FLOW: 609.04,
            D7_TOTAL_BET_FLOW: 634.83,

            // 留存
            D1_retained_users: 42,
            D7_retained_users: 10,
          },
          {
            date: "2025-11-12", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1727,
            D0_unique_purchase: 1401,
            D0_PURCHASE_VALUE: 4067.92,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 769,
            D0_SPORTS_BET_PLACED_USER: 698,
            D0_GAMES_BET_PLACED_USER: 107,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 1504.64,
            D0_GAMES_BET_FLOW: 3082.79,
            D0_TOTAL_BET_FLOW: 4587.43,

            // 付费 & 投注（D7）
            D7_unique_purchase: 1558,
            D7_PURCHASE_VALUE: 7777.23,
            D7_TOTAL_BET_PLACED_USER: 1539,
            D7_SPORTS_BET_PLACED_USER: 1458,
            D7_GAMES_BET_PLACED_USER: 145,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 4719.9,
            D7_GAMES_BET_FLOW: 21622.6,
            D7_TOTAL_BET_FLOW: 26342.5,

            // 留存
            D1_retained_users: 960,
            D7_retained_users: 41,
          },
          {
            date: "2025-11-12", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 922,
            D0_unique_purchase: 353,
            D0_PURCHASE_VALUE: 782.69,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 363,
            D0_SPORTS_BET_PLACED_USER: 86,
            D0_GAMES_BET_PLACED_USER: 326,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 19.23,
            D0_GAMES_BET_FLOW: 3907.5,
            D0_TOTAL_BET_FLOW: 3926.73,

            // 付费 & 投注（D7）
            D7_unique_purchase: 461,
            D7_PURCHASE_VALUE: 2355.17,
            D7_TOTAL_BET_PLACED_USER: 478,
            D7_SPORTS_BET_PLACED_USER: 148,
            D7_GAMES_BET_PLACED_USER: 435,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 39.8,
            D7_GAMES_BET_FLOW: 14639.59,
            D7_TOTAL_BET_FLOW: 14679.39,

            // 留存
            D1_retained_users: 365,
            D7_retained_users: 102,
          },
          {
            date: "2025-11-12", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1670,
            D0_unique_purchase: 616,
            D0_PURCHASE_VALUE: 640.14,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 554,
            D0_SPORTS_BET_PLACED_USER: 301,
            D0_GAMES_BET_PLACED_USER: 368,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 264.37,
            D0_GAMES_BET_FLOW: 2056.48,
            D0_TOTAL_BET_FLOW: 2320.86,

            // 付费 & 投注（D7）
            D7_unique_purchase: 752,
            D7_PURCHASE_VALUE: 1892.08,
            D7_TOTAL_BET_PLACED_USER: 713,
            D7_SPORTS_BET_PLACED_USER: 442,
            D7_GAMES_BET_PLACED_USER: 485,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 776.59,
            D7_GAMES_BET_FLOW: 8455.1,
            D7_TOTAL_BET_FLOW: 9231.69,

            // 留存
            D1_retained_users: 527,
            D7_retained_users: 129,
          },
          {
            date: "2025-11-12", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1127,
            D0_unique_purchase: 295,
            D0_PURCHASE_VALUE: 494.26,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 287,
            D0_SPORTS_BET_PLACED_USER: 105,
            D0_GAMES_BET_PLACED_USER: 227,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 64.91,
            D0_GAMES_BET_FLOW: 1802.66,
            D0_TOTAL_BET_FLOW: 1867.57,

            // 付费 & 投注（D7）
            D7_unique_purchase: 486,
            D7_PURCHASE_VALUE: 1169.44,
            D7_TOTAL_BET_PLACED_USER: 502,
            D7_SPORTS_BET_PLACED_USER: 302,
            D7_GAMES_BET_PLACED_USER: 308,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 154.46,
            D7_GAMES_BET_FLOW: 5357.23,
            D7_TOTAL_BET_FLOW: 5511.69,

            // 留存
            D1_retained_users: 265,
            D7_retained_users: 66,
          },
          {
            date: "2025-11-12", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 107,
            D0_unique_purchase: 34,
            D0_PURCHASE_VALUE: 42.29,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 32,
            D0_SPORTS_BET_PLACED_USER: 20,
            D0_GAMES_BET_PLACED_USER: 15,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 11.22,
            D0_GAMES_BET_FLOW: 72.41,
            D0_TOTAL_BET_FLOW: 83.63,

            // 付费 & 投注（D7）
            D7_unique_purchase: 45,
            D7_PURCHASE_VALUE: 245.46,
            D7_TOTAL_BET_PLACED_USER: 48,
            D7_SPORTS_BET_PLACED_USER: 31,
            D7_GAMES_BET_PLACED_USER: 27,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 44.71,
            D7_GAMES_BET_FLOW: 867.3,
            D7_TOTAL_BET_FLOW: 912.01,

            // 留存
            D1_retained_users: 45,
            D7_retained_users: 17,
          },
          {
            date: "2025-11-13", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1806,
            D0_unique_purchase: 1533,
            D0_PURCHASE_VALUE: 4340.54,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 1265,
            D0_SPORTS_BET_PLACED_USER: 1172,
            D0_GAMES_BET_PLACED_USER: 123,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 2639.31,
            D0_GAMES_BET_FLOW: 7902.47,
            D0_TOTAL_BET_FLOW: 10541.77,

            // 付费 & 投注（D7）
            D7_unique_purchase: 1648,
            D7_PURCHASE_VALUE: 6819.15,
            D7_TOTAL_BET_PLACED_USER: 1635,
            D7_SPORTS_BET_PLACED_USER: 1536,
            D7_GAMES_BET_PLACED_USER: 232,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 3781.43,
            D7_GAMES_BET_FLOW: 18435.51,
            D7_TOTAL_BET_FLOW: 22216.94,

            // 留存
            D1_retained_users: 815,
            D7_retained_users: 52,
          },
          {
            date: "2025-11-13", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1019,
            D0_unique_purchase: 367,
            D0_PURCHASE_VALUE: 522.92,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 363,
            D0_SPORTS_BET_PLACED_USER: 83,
            D0_GAMES_BET_PLACED_USER: 312,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 42.67,
            D0_GAMES_BET_FLOW: 3286.9,
            D0_TOTAL_BET_FLOW: 3329.57,

            // 付费 & 投注（D7）
            D7_unique_purchase: 488,
            D7_PURCHASE_VALUE: 2415.23,
            D7_TOTAL_BET_PLACED_USER: 508,
            D7_SPORTS_BET_PLACED_USER: 165,
            D7_GAMES_BET_PLACED_USER: 433,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 137.2,
            D7_GAMES_BET_FLOW: 21201.41,
            D7_TOTAL_BET_FLOW: 21338.61,

            // 留存
            D1_retained_users: 401,
            D7_retained_users: 116,
          },
          {
            date: "2025-11-13", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1687,
            D0_unique_purchase: 609,
            D0_PURCHASE_VALUE: 952.2,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 534,
            D0_SPORTS_BET_PLACED_USER: 295,
            D0_GAMES_BET_PLACED_USER: 340,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 301.93,
            D0_GAMES_BET_FLOW: 3688.55,
            D0_TOTAL_BET_FLOW: 3990.49,

            // 付费 & 投注（D7）
            D7_unique_purchase: 752,
            D7_PURCHASE_VALUE: 2554.07,
            D7_TOTAL_BET_PLACED_USER: 713,
            D7_SPORTS_BET_PLACED_USER: 427,
            D7_GAMES_BET_PLACED_USER: 475,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 850.21,
            D7_GAMES_BET_FLOW: 12270.91,
            D7_TOTAL_BET_FLOW: 13121.12,

            // 留存
            D1_retained_users: 520,
            D7_retained_users: 144,
          },
          {
            date: "2025-11-13", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1036,
            D0_unique_purchase: 266,
            D0_PURCHASE_VALUE: 548.43,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 246,
            D0_SPORTS_BET_PLACED_USER: 97,
            D0_GAMES_BET_PLACED_USER: 206,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 38.92,
            D0_GAMES_BET_FLOW: 2454.11,
            D0_TOTAL_BET_FLOW: 2493.03,

            // 付费 & 投注（D7）
            D7_unique_purchase: 454,
            D7_PURCHASE_VALUE: 1783.69,
            D7_TOTAL_BET_PLACED_USER: 463,
            D7_SPORTS_BET_PLACED_USER: 253,
            D7_GAMES_BET_PLACED_USER: 305,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 147.92,
            D7_GAMES_BET_FLOW: 8531.55,
            D7_TOTAL_BET_FLOW: 8679.47,

            // 留存
            D1_retained_users: 357,
            D7_retained_users: 121,
          },
          {
            date: "2025-11-13", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 87,
            D0_unique_purchase: 24,
            D0_PURCHASE_VALUE: 50.65,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 23,
            D0_SPORTS_BET_PLACED_USER: 17,
            D0_GAMES_BET_PLACED_USER: 11,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 30.44,
            D0_GAMES_BET_FLOW: 97.2,
            D0_TOTAL_BET_FLOW: 127.64,

            // 付费 & 投注（D7）
            D7_unique_purchase: 30,
            D7_PURCHASE_VALUE: 78.66,
            D7_TOTAL_BET_PLACED_USER: 39,
            D7_SPORTS_BET_PLACED_USER: 31,
            D7_GAMES_BET_PLACED_USER: 21,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 45.58,
            D7_GAMES_BET_FLOW: 158.8,
            D7_TOTAL_BET_FLOW: 204.38,

            // 留存
            D1_retained_users: 37,
            D7_retained_users: 8,
          },
          {
            date: "2025-11-14", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1882,
            D0_unique_purchase: 1525,
            D0_PURCHASE_VALUE: 4195.15,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 1139,
            D0_SPORTS_BET_PLACED_USER: 1066,
            D0_GAMES_BET_PLACED_USER: 117,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 2420.01,
            D0_GAMES_BET_FLOW: 4199.55,
            D0_TOTAL_BET_FLOW: 6619.56,

            // 付费 & 投注（D7）
            D7_unique_purchase: 1639,
            D7_PURCHASE_VALUE: 6722,
            D7_TOTAL_BET_PLACED_USER: 1629,
            D7_SPORTS_BET_PLACED_USER: 1537,
            D7_GAMES_BET_PLACED_USER: 201,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 3793.87,
            D7_GAMES_BET_FLOW: 16551.05,
            D7_TOTAL_BET_FLOW: 20344.92,

            // 留存
            D1_retained_users: 882,
            D7_retained_users: 77,
          },
          {
            date: "2025-11-14", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1240,
            D0_unique_purchase: 384,
            D0_PURCHASE_VALUE: 549.08,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 366,
            D0_SPORTS_BET_PLACED_USER: 75,
            D0_GAMES_BET_PLACED_USER: 327,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 24.95,
            D0_GAMES_BET_FLOW: 3245.2,
            D0_TOTAL_BET_FLOW: 3270.15,

            // 付费 & 投注（D7）
            D7_unique_purchase: 547,
            D7_PURCHASE_VALUE: 2007.79,
            D7_TOTAL_BET_PLACED_USER: 621,
            D7_SPORTS_BET_PLACED_USER: 246,
            D7_GAMES_BET_PLACED_USER: 469,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 123.66,
            D7_GAMES_BET_FLOW: 30486.07,
            D7_TOTAL_BET_FLOW: 30609.74,

            // 留存
            D1_retained_users: 483,
            D7_retained_users: 100,
          },
          {
            date: "2025-11-14", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1982,
            D0_unique_purchase: 756,
            D0_PURCHASE_VALUE: 664.08,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 674,
            D0_SPORTS_BET_PLACED_USER: 374,
            D0_GAMES_BET_PLACED_USER: 417,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 245.31,
            D0_GAMES_BET_FLOW: 2396.28,
            D0_TOTAL_BET_FLOW: 2641.59,

            // 付费 & 投注（D7）
            D7_unique_purchase: 923,
            D7_PURCHASE_VALUE: 2212.84,
            D7_TOTAL_BET_PLACED_USER: 897,
            D7_SPORTS_BET_PLACED_USER: 546,
            D7_GAMES_BET_PLACED_USER: 591,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 690.34,
            D7_GAMES_BET_FLOW: 9440.58,
            D7_TOTAL_BET_FLOW: 10130.92,

            // 留存
            D1_retained_users: 643,
            D7_retained_users: 187,
          },
          {
            date: "2025-11-14", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1197,
            D0_unique_purchase: 297,
            D0_PURCHASE_VALUE: 466.62,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 293,
            D0_SPORTS_BET_PLACED_USER: 114,
            D0_GAMES_BET_PLACED_USER: 225,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 34.08,
            D0_GAMES_BET_FLOW: 1847.47,
            D0_TOTAL_BET_FLOW: 1881.55,

            // 付费 & 投注（D7）
            D7_unique_purchase: 416,
            D7_PURCHASE_VALUE: 1364.78,
            D7_TOTAL_BET_PLACED_USER: 430,
            D7_SPORTS_BET_PLACED_USER: 208,
            D7_GAMES_BET_PLACED_USER: 345,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 103.4,
            D7_GAMES_BET_FLOW: 7139.46,
            D7_TOTAL_BET_FLOW: 7242.86,

            // 留存
            D1_retained_users: 356,
            D7_retained_users: 123,
          },
          {
            date: "2025-11-14", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 196,
            D0_unique_purchase: 41,
            D0_PURCHASE_VALUE: 62.58,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 43,
            D0_SPORTS_BET_PLACED_USER: 31,
            D0_GAMES_BET_PLACED_USER: 22,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 39.89,
            D0_GAMES_BET_FLOW: 162.2,
            D0_TOTAL_BET_FLOW: 202.09,

            // 付费 & 投注（D7）
            D7_unique_purchase: 54,
            D7_PURCHASE_VALUE: 198.25,
            D7_TOTAL_BET_PLACED_USER: 67,
            D7_SPORTS_BET_PLACED_USER: 45,
            D7_GAMES_BET_PLACED_USER: 37,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 77.86,
            D7_GAMES_BET_FLOW: 615.43,
            D7_TOTAL_BET_FLOW: 693.3,

            // 留存
            D1_retained_users: 62,
            D7_retained_users: 14,
          },
          {
            date: "2025-11-15", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 3398,
            D0_unique_purchase: 2472,
            D0_PURCHASE_VALUE: 5832.23,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 2125,
            D0_SPORTS_BET_PLACED_USER: 2015,
            D0_GAMES_BET_PLACED_USER: 172,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 4575.72,
            D0_GAMES_BET_FLOW: 1659.64,
            D0_TOTAL_BET_FLOW: 6235.36,

            // 付费 & 投注（D7）
            D7_unique_purchase: 2932,
            D7_PURCHASE_VALUE: 9004.15,
            D7_TOTAL_BET_PLACED_USER: 2943,
            D7_SPORTS_BET_PLACED_USER: 2827,
            D7_GAMES_BET_PLACED_USER: 271,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 6556.08,
            D7_GAMES_BET_FLOW: 18266.36,
            D7_TOTAL_BET_FLOW: 24822.44,

            // 留存
            D1_retained_users: 1338,
            D7_retained_users: 74,
          },
          {
            date: "2025-11-15", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1322,
            D0_unique_purchase: 426,
            D0_PURCHASE_VALUE: 1156.82,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 420,
            D0_SPORTS_BET_PLACED_USER: 121,
            D0_GAMES_BET_PLACED_USER: 344,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 50.89,
            D0_GAMES_BET_FLOW: 16732.26,
            D0_TOTAL_BET_FLOW: 16783.15,

            // 付费 & 投注（D7）
            D7_unique_purchase: 571,
            D7_PURCHASE_VALUE: 10806.9,
            D7_TOTAL_BET_PLACED_USER: 654,
            D7_SPORTS_BET_PLACED_USER: 279,
            D7_GAMES_BET_PLACED_USER: 490,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 221.2,
            D7_GAMES_BET_FLOW: 93170.45,
            D7_TOTAL_BET_FLOW: 93391.64,

            // 留存
            D1_retained_users: 484,
            D7_retained_users: 144,
          },
          {
            date: "2025-11-15", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 2154,
            D0_unique_purchase: 750,
            D0_PURCHASE_VALUE: 690.96,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 646,
            D0_SPORTS_BET_PLACED_USER: 385,
            D0_GAMES_BET_PLACED_USER: 403,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 220.75,
            D0_GAMES_BET_FLOW: 3158.14,
            D0_TOTAL_BET_FLOW: 3378.88,

            // 付费 & 投注（D7）
            D7_unique_purchase: 960,
            D7_PURCHASE_VALUE: 2160.63,
            D7_TOTAL_BET_PLACED_USER: 930,
            D7_SPORTS_BET_PLACED_USER: 601,
            D7_GAMES_BET_PLACED_USER: 622,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 990.23,
            D7_GAMES_BET_FLOW: 12536.1,
            D7_TOTAL_BET_FLOW: 13526.33,

            // 留存
            D1_retained_users: 731,
            D7_retained_users: 233,
          },
          {
            date: "2025-11-15", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1086,
            D0_unique_purchase: 268,
            D0_PURCHASE_VALUE: 670.1,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 299,
            D0_SPORTS_BET_PLACED_USER: 154,
            D0_GAMES_BET_PLACED_USER: 196,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 50.31,
            D0_GAMES_BET_FLOW: 2664.27,
            D0_TOTAL_BET_FLOW: 2714.59,

            // 付费 & 投注（D7）
            D7_unique_purchase: 422,
            D7_PURCHASE_VALUE: 2131.55,
            D7_TOTAL_BET_PLACED_USER: 433,
            D7_SPORTS_BET_PLACED_USER: 223,
            D7_GAMES_BET_PLACED_USER: 299,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 142.6,
            D7_GAMES_BET_FLOW: 8832.83,
            D7_TOTAL_BET_FLOW: 8975.43,

            // 留存
            D1_retained_users: 462,
            D7_retained_users: 130,
          },
          {
            date: "2025-11-15", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 184,
            D0_unique_purchase: 52,
            D0_PURCHASE_VALUE: 181.92,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 53,
            D0_SPORTS_BET_PLACED_USER: 35,
            D0_GAMES_BET_PLACED_USER: 24,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 66.05,
            D0_GAMES_BET_FLOW: 412.32,
            D0_TOTAL_BET_FLOW: 478.37,

            // 付费 & 投注（D7）
            D7_unique_purchase: 60,
            D7_PURCHASE_VALUE: 451.87,
            D7_TOTAL_BET_PLACED_USER: 85,
            D7_SPORTS_BET_PLACED_USER: 54,
            D7_GAMES_BET_PLACED_USER: 53,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 97.79,
            D7_GAMES_BET_FLOW: 3784.27,
            D7_TOTAL_BET_FLOW: 3882.06,

            // 留存
            D1_retained_users: 74,
            D7_retained_users: 23,
          },
          {
            date: "2025-11-16", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 2833,
            D0_unique_purchase: 2142,
            D0_PURCHASE_VALUE: 5230,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 1921,
            D0_SPORTS_BET_PLACED_USER: 1826,
            D0_GAMES_BET_PLACED_USER: 164,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 4150.79,
            D0_GAMES_BET_FLOW: 3710.11,
            D0_TOTAL_BET_FLOW: 7860.91,

            // 付费 & 投注（D7）
            D7_unique_purchase: 2441,
            D7_PURCHASE_VALUE: 10732,
            D7_TOTAL_BET_PLACED_USER: 2434,
            D7_SPORTS_BET_PLACED_USER: 2326,
            D7_GAMES_BET_PLACED_USER: 282,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 5687.39,
            D7_GAMES_BET_FLOW: 30575.46,
            D7_TOTAL_BET_FLOW: 36262.85,

            // 留存
            D1_retained_users: 1087,
            D7_retained_users: 60,
          },
          {
            date: "2025-11-16", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1021,
            D0_unique_purchase: 417,
            D0_PURCHASE_VALUE: 886.79,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 403,
            D0_SPORTS_BET_PLACED_USER: 88,
            D0_GAMES_BET_PLACED_USER: 356,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 436.71,
            D0_GAMES_BET_FLOW: 3182.91,
            D0_TOTAL_BET_FLOW: 3619.62,

            // 付费 & 投注（D7）
            D7_unique_purchase: 534,
            D7_PURCHASE_VALUE: 3706.45,
            D7_TOTAL_BET_PLACED_USER: 545,
            D7_SPORTS_BET_PLACED_USER: 161,
            D7_GAMES_BET_PLACED_USER: 490,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 3067.18,
            D7_GAMES_BET_FLOW: 9013.42,
            D7_TOTAL_BET_FLOW: 12080.6,

            // 留存
            D1_retained_users: 331,
            D7_retained_users: 105,
          },
          {
            date: "2025-11-16", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1999,
            D0_unique_purchase: 701,
            D0_PURCHASE_VALUE: 1495.37,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 631,
            D0_SPORTS_BET_PLACED_USER: 375,
            D0_GAMES_BET_PLACED_USER: 395,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 512.5,
            D0_GAMES_BET_FLOW: 4639.52,
            D0_TOTAL_BET_FLOW: 5152.02,

            // 付费 & 投注（D7）
            D7_unique_purchase: 898,
            D7_PURCHASE_VALUE: 6092.52,
            D7_TOTAL_BET_PLACED_USER: 879,
            D7_SPORTS_BET_PLACED_USER: 568,
            D7_GAMES_BET_PLACED_USER: 606,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 5149.72,
            D7_GAMES_BET_FLOW: 13054.18,
            D7_TOTAL_BET_FLOW: 18203.9,

            // 留存
            D1_retained_users: 643,
            D7_retained_users: 204,
          },
          {
            date: "2025-11-16", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1033,
            D0_unique_purchase: 220,
            D0_PURCHASE_VALUE: 488.99,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 264,
            D0_SPORTS_BET_PLACED_USER: 140,
            D0_GAMES_BET_PLACED_USER: 165,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 41.21,
            D0_GAMES_BET_FLOW: 3002.47,
            D0_TOTAL_BET_FLOW: 3043.68,

            // 付费 & 投注（D7）
            D7_unique_purchase: 392,
            D7_PURCHASE_VALUE: 1786.6,
            D7_TOTAL_BET_PLACED_USER: 412,
            D7_SPORTS_BET_PLACED_USER: 205,
            D7_GAMES_BET_PLACED_USER: 298,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 143.59,
            D7_GAMES_BET_FLOW: 12544.14,
            D7_TOTAL_BET_FLOW: 12687.73,

            // 留存
            D1_retained_users: 337,
            D7_retained_users: 66,
          },
          {
            date: "2025-11-16", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 220,
            D0_unique_purchase: 38,
            D0_PURCHASE_VALUE: 72.59,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 38,
            D0_SPORTS_BET_PLACED_USER: 22,
            D0_GAMES_BET_PLACED_USER: 22,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 51.18,
            D0_GAMES_BET_FLOW: 58.85,
            D0_TOTAL_BET_FLOW: 110.03,

            // 付费 & 投注（D7）
            D7_unique_purchase: 55,
            D7_PURCHASE_VALUE: 160.91,
            D7_TOTAL_BET_PLACED_USER: 71,
            D7_SPORTS_BET_PLACED_USER: 40,
            D7_GAMES_BET_PLACED_USER: 45,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 88.56,
            D7_GAMES_BET_FLOW: 487.19,
            D7_TOTAL_BET_FLOW: 575.75,

            // 留存
            D1_retained_users: 71,
            D7_retained_users: 20,
          },
          {
            date: "2025-11-17", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 2495,
            D0_unique_purchase: 1664,
            D0_PURCHASE_VALUE: 3832.23,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 1262,
            D0_SPORTS_BET_PLACED_USER: 1173,
            D0_GAMES_BET_PLACED_USER: 130,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 2614.55,
            D0_GAMES_BET_FLOW: 1299.47,
            D0_TOTAL_BET_FLOW: 3914.02,

            // 付费 & 投注（D7）
            D7_unique_purchase: 1939,
            D7_PURCHASE_VALUE: 5820.69,
            D7_TOTAL_BET_PLACED_USER: 1935,
            D7_SPORTS_BET_PLACED_USER: 1837,
            D7_GAMES_BET_PLACED_USER: 258,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 4225.83,
            D7_GAMES_BET_FLOW: 9080.22,
            D7_TOTAL_BET_FLOW: 13306.05,

            // 留存
            D1_retained_users: 1167,
            D7_retained_users: 49,
          },
          {
            date: "2025-11-17", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 928,
            D0_unique_purchase: 375,
            D0_PURCHASE_VALUE: 1021.89,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 366,
            D0_SPORTS_BET_PLACED_USER: 73,
            D0_GAMES_BET_PLACED_USER: 336,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 67.92,
            D0_GAMES_BET_FLOW: 8014.03,
            D0_TOTAL_BET_FLOW: 8081.95,

            // 付费 & 投注（D7）
            D7_unique_purchase: 456,
            D7_PURCHASE_VALUE: 4414.76,
            D7_TOTAL_BET_PLACED_USER: 477,
            D7_SPORTS_BET_PLACED_USER: 139,
            D7_GAMES_BET_PLACED_USER: 434,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 165.11,
            D7_GAMES_BET_FLOW: 23089.24,
            D7_TOTAL_BET_FLOW: 23254.36,

            // 留存
            D1_retained_users: 363,
            D7_retained_users: 94,
          },
          {
            date: "2025-11-17", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 2064,
            D0_unique_purchase: 751,
            D0_PURCHASE_VALUE: 813.12,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 677,
            D0_SPORTS_BET_PLACED_USER: 389,
            D0_GAMES_BET_PLACED_USER: 443,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 342.51,
            D0_GAMES_BET_FLOW: 3070.97,
            D0_TOTAL_BET_FLOW: 3413.48,

            // 付费 & 投注（D7）
            D7_unique_purchase: 943,
            D7_PURCHASE_VALUE: 11206.05,
            D7_TOTAL_BET_PLACED_USER: 916,
            D7_SPORTS_BET_PLACED_USER: 576,
            D7_GAMES_BET_PLACED_USER: 648,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 15101.35,
            D7_GAMES_BET_FLOW: 13773.18,
            D7_TOTAL_BET_FLOW: 28874.54,

            // 留存
            D1_retained_users: 716,
            D7_retained_users: 176,
          },
          {
            date: "2025-11-17", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 991,
            D0_unique_purchase: 241,
            D0_PURCHASE_VALUE: 462.82,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 230,
            D0_SPORTS_BET_PLACED_USER: 98,
            D0_GAMES_BET_PLACED_USER: 178,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 35.73,
            D0_GAMES_BET_FLOW: 1960.65,
            D0_TOTAL_BET_FLOW: 1996.38,

            // 付费 & 投注（D7）
            D7_unique_purchase: 339,
            D7_PURCHASE_VALUE: 1062.41,
            D7_TOTAL_BET_PLACED_USER: 353,
            D7_SPORTS_BET_PLACED_USER: 183,
            D7_GAMES_BET_PLACED_USER: 273,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 158.82,
            D7_GAMES_BET_FLOW: 5245.12,
            D7_TOTAL_BET_FLOW: 5403.94,

            // 留存
            D1_retained_users: 303,
            D7_retained_users: 86,
          },
          {
            date: "2025-11-17", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 248,
            D0_unique_purchase: 53,
            D0_PURCHASE_VALUE: 209.94,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 52,
            D0_SPORTS_BET_PLACED_USER: 20,
            D0_GAMES_BET_PLACED_USER: 36,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 28.99,
            D0_GAMES_BET_FLOW: 1356.36,
            D0_TOTAL_BET_FLOW: 1385.35,

            // 付费 & 投注（D7）
            D7_unique_purchase: 66,
            D7_PURCHASE_VALUE: 705.38,
            D7_TOTAL_BET_PLACED_USER: 77,
            D7_SPORTS_BET_PLACED_USER: 36,
            D7_GAMES_BET_PLACED_USER: 54,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 105.79,
            D7_GAMES_BET_FLOW: 3856.65,
            D7_TOTAL_BET_FLOW: 3962.44,

            // 留存
            D1_retained_users: 108,
            D7_retained_users: 21,
          },
          {
            date: "2025-11-18", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 2751,
            D0_unique_purchase: 2145,
            D0_PURCHASE_VALUE: 5984.46,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 1723,
            D0_SPORTS_BET_PLACED_USER: 1633,
            D0_GAMES_BET_PLACED_USER: 154,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 3763.45,
            D0_GAMES_BET_FLOW: 8262.12,
            D0_TOTAL_BET_FLOW: 12025.57,

            // 付费 & 投注（D7）
            D7_unique_purchase: 2492,
            D7_PURCHASE_VALUE: 13736.15,
            D7_TOTAL_BET_PLACED_USER: 2491,
            D7_SPORTS_BET_PLACED_USER: 2394,
            D7_GAMES_BET_PLACED_USER: 264,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 5791.08,
            D7_GAMES_BET_FLOW: 75920.07,
            D7_TOTAL_BET_FLOW: 81711.15,

            // 留存
            D1_retained_users: 1137,
            D7_retained_users: 65,
          },
          {
            date: "2025-11-18", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1226,
            D0_unique_purchase: 422,
            D0_PURCHASE_VALUE: 656.05,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 459,
            D0_SPORTS_BET_PLACED_USER: 145,
            D0_GAMES_BET_PLACED_USER: 364,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 58.69,
            D0_GAMES_BET_FLOW: 4604.51,
            D0_TOTAL_BET_FLOW: 4663.2,

            // 付费 & 投注（D7）
            D7_unique_purchase: 546,
            D7_PURCHASE_VALUE: 1810.89,
            D7_TOTAL_BET_PLACED_USER: 625,
            D7_SPORTS_BET_PLACED_USER: 257,
            D7_GAMES_BET_PLACED_USER: 499,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 260.86,
            D7_GAMES_BET_FLOW: 19758.77,
            D7_TOTAL_BET_FLOW: 20019.62,

            // 留存
            D1_retained_users: 479,
            D7_retained_users: 121,
          },
          {
            date: "2025-11-18", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 2092,
            D0_unique_purchase: 736,
            D0_PURCHASE_VALUE: 1518.48,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 680,
            D0_SPORTS_BET_PLACED_USER: 410,
            D0_GAMES_BET_PLACED_USER: 393,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 298.81,
            D0_GAMES_BET_FLOW: 6759.64,
            D0_TOTAL_BET_FLOW: 7058.45,

            // 付费 & 投注（D7）
            D7_unique_purchase: 929,
            D7_PURCHASE_VALUE: 4952.75,
            D7_TOTAL_BET_PLACED_USER: 945,
            D7_SPORTS_BET_PLACED_USER: 634,
            D7_GAMES_BET_PLACED_USER: 599,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1376.08,
            D7_GAMES_BET_FLOW: 36626.69,
            D7_TOTAL_BET_FLOW: 38002.77,

            // 留存
            D1_retained_users: 718,
            D7_retained_users: 223,
          },
          {
            date: "2025-11-18", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1022,
            D0_unique_purchase: 292,
            D0_PURCHASE_VALUE: 526.85,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 295,
            D0_SPORTS_BET_PLACED_USER: 114,
            D0_GAMES_BET_PLACED_USER: 220,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 58.29,
            D0_GAMES_BET_FLOW: 3067.03,
            D0_TOTAL_BET_FLOW: 3125.32,

            // 付费 & 投注（D7）
            D7_unique_purchase: 395,
            D7_PURCHASE_VALUE: 1883.84,
            D7_TOTAL_BET_PLACED_USER: 440,
            D7_SPORTS_BET_PLACED_USER: 230,
            D7_GAMES_BET_PLACED_USER: 350,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 205.72,
            D7_GAMES_BET_FLOW: 10566.43,
            D7_TOTAL_BET_FLOW: 10772.15,

            // 留存
            D1_retained_users: 395,
            D7_retained_users: 83,
          },
          {
            date: "2025-11-18", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 210,
            D0_unique_purchase: 48,
            D0_PURCHASE_VALUE: 100.14,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 51,
            D0_SPORTS_BET_PLACED_USER: 28,
            D0_GAMES_BET_PLACED_USER: 34,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 26.77,
            D0_GAMES_BET_FLOW: 337.64,
            D0_TOTAL_BET_FLOW: 364.41,

            // 付费 & 投注（D7）
            D7_unique_purchase: 62,
            D7_PURCHASE_VALUE: 385.28,
            D7_TOTAL_BET_PLACED_USER: 86,
            D7_SPORTS_BET_PLACED_USER: 51,
            D7_GAMES_BET_PLACED_USER: 64,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 80.84,
            D7_GAMES_BET_FLOW: 1775.14,
            D7_TOTAL_BET_FLOW: 1855.98,

            // 留存
            D1_retained_users: 90,
            D7_retained_users: 19,
          },
          {
            date: "2025-11-19", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 2190,
            D0_unique_purchase: 1601,
            D0_PURCHASE_VALUE: 4469.38,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 1305,
            D0_SPORTS_BET_PLACED_USER: 1253,
            D0_GAMES_BET_PLACED_USER: 78,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 2813.46,
            D0_GAMES_BET_FLOW: 3407.49,
            D0_TOTAL_BET_FLOW: 6220.94,

            // 付费 & 投注（D7）
            D7_unique_purchase: 2021,
            D7_PURCHASE_VALUE: 8425.96,
            D7_TOTAL_BET_PLACED_USER: 2008,
            D7_SPORTS_BET_PLACED_USER: 1954,
            D7_GAMES_BET_PLACED_USER: 183,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 4755.45,
            D7_GAMES_BET_FLOW: 11073.66,
            D7_TOTAL_BET_FLOW: 15829.11,

            // 留存
            D1_retained_users: 982,
            D7_retained_users: 49,
          },
          {
            date: "2025-11-19", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1005,
            D0_unique_purchase: 339,
            D0_PURCHASE_VALUE: 5889.78,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 338,
            D0_SPORTS_BET_PLACED_USER: 61,
            D0_GAMES_BET_PLACED_USER: 311,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 51.8,
            D0_GAMES_BET_FLOW: 40448.46,
            D0_TOTAL_BET_FLOW: 40500.26,

            // 付费 & 投注（D7）
            D7_unique_purchase: 438,
            D7_PURCHASE_VALUE: 8465.04,
            D7_TOTAL_BET_PLACED_USER: 505,
            D7_SPORTS_BET_PLACED_USER: 173,
            D7_GAMES_BET_PLACED_USER: 425,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 310.11,
            D7_GAMES_BET_FLOW: 121189.85,
            D7_TOTAL_BET_FLOW: 121499.95,

            // 留存
            D1_retained_users: 354,
            D7_retained_users: 111,
          },
          {
            date: "2025-11-19", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1758,
            D0_unique_purchase: 567,
            D0_PURCHASE_VALUE: 918.27,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 510,
            D0_SPORTS_BET_PLACED_USER: 282,
            D0_GAMES_BET_PLACED_USER: 346,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 135.64,
            D0_GAMES_BET_FLOW: 2954.86,
            D0_TOTAL_BET_FLOW: 3090.5,

            // 付费 & 投注（D7）
            D7_unique_purchase: 714,
            D7_PURCHASE_VALUE: 3344.85,
            D7_TOTAL_BET_PLACED_USER: 707,
            D7_SPORTS_BET_PLACED_USER: 450,
            D7_GAMES_BET_PLACED_USER: 480,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1245.86,
            D7_GAMES_BET_FLOW: 19989.42,
            D7_TOTAL_BET_FLOW: 21235.28,

            // 留存
            D1_retained_users: 575,
            D7_retained_users: 161,
          },
          {
            date: "2025-11-19", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 726,
            D0_unique_purchase: 165,
            D0_PURCHASE_VALUE: 278.23,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 209,
            D0_SPORTS_BET_PLACED_USER: 98,
            D0_GAMES_BET_PLACED_USER: 139,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 30.49,
            D0_GAMES_BET_FLOW: 1231.98,
            D0_TOTAL_BET_FLOW: 1262.47,

            // 付费 & 投注（D7）
            D7_unique_purchase: 258,
            D7_PURCHASE_VALUE: 753.34,
            D7_TOTAL_BET_PLACED_USER: 281,
            D7_SPORTS_BET_PLACED_USER: 151,
            D7_GAMES_BET_PLACED_USER: 199,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 168.87,
            D7_GAMES_BET_FLOW: 3360.66,
            D7_TOTAL_BET_FLOW: 3529.53,

            // 留存
            D1_retained_users: 205,
            D7_retained_users: 36,
          },
          {
            date: "2025-11-19", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 189,
            D0_unique_purchase: 48,
            D0_PURCHASE_VALUE: 303.78,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 48,
            D0_SPORTS_BET_PLACED_USER: 27,
            D0_GAMES_BET_PLACED_USER: 28,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 39.8,
            D0_GAMES_BET_FLOW: 682.34,
            D0_TOTAL_BET_FLOW: 722.14,

            // 付费 & 投注（D7）
            D7_unique_purchase: 60,
            D7_PURCHASE_VALUE: 406.04,
            D7_TOTAL_BET_PLACED_USER: 73,
            D7_SPORTS_BET_PLACED_USER: 37,
            D7_GAMES_BET_PLACED_USER: 47,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 100.17,
            D7_GAMES_BET_FLOW: 925.09,
            D7_TOTAL_BET_FLOW: 1025.26,

            // 留存
            D1_retained_users: 63,
            D7_retained_users: 11,
          },
          {
            date: "2025-11-20", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 2364,
            D0_unique_purchase: 1737,
            D0_PURCHASE_VALUE: 4391.54,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 1240,
            D0_SPORTS_BET_PLACED_USER: 1163,
            D0_GAMES_BET_PLACED_USER: 97,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 2634.15,
            D0_GAMES_BET_FLOW: 4146.95,
            D0_TOTAL_BET_FLOW: 6781.1,

            // 付费 & 投注（D7）
            D7_unique_purchase: 2178,
            D7_PURCHASE_VALUE: 10036.23,
            D7_TOTAL_BET_PLACED_USER: 2164,
            D7_SPORTS_BET_PLACED_USER: 2091,
            D7_GAMES_BET_PLACED_USER: 258,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 15782.86,
            D7_GAMES_BET_FLOW: 32944.37,
            D7_TOTAL_BET_FLOW: 48727.23,

            // 留存
            D1_retained_users: 1139,
            D7_retained_users: 48,
          },
          {
            date: "2025-11-20", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1038,
            D0_unique_purchase: 333,
            D0_PURCHASE_VALUE: 4071.2,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 337,
            D0_SPORTS_BET_PLACED_USER: 70,
            D0_GAMES_BET_PLACED_USER: 298,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 81.5,
            D0_GAMES_BET_FLOW: 32082.08,
            D0_TOTAL_BET_FLOW: 32163.57,

            // 付费 & 投注（D7）
            D7_unique_purchase: 435,
            D7_PURCHASE_VALUE: 8400.55,
            D7_TOTAL_BET_PLACED_USER: 494,
            D7_SPORTS_BET_PLACED_USER: 162,
            D7_GAMES_BET_PLACED_USER: 414,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 158.94,
            D7_GAMES_BET_FLOW: 112267.6,
            D7_TOTAL_BET_FLOW: 112426.54,

            // 留存
            D1_retained_users: 414,
            D7_retained_users: 96,
          },
          {
            date: "2025-11-20", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1865,
            D0_unique_purchase: 635,
            D0_PURCHASE_VALUE: 1288.74,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 577,
            D0_SPORTS_BET_PLACED_USER: 343,
            D0_GAMES_BET_PLACED_USER: 357,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 346.17,
            D0_GAMES_BET_FLOW: 3948.46,
            D0_TOTAL_BET_FLOW: 4294.63,

            // 付费 & 投注（D7）
            D7_unique_purchase: 786,
            D7_PURCHASE_VALUE: 3940.54,
            D7_TOTAL_BET_PLACED_USER: 777,
            D7_SPORTS_BET_PLACED_USER: 514,
            D7_GAMES_BET_PLACED_USER: 492,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1735.21,
            D7_GAMES_BET_FLOW: 27036.06,
            D7_TOTAL_BET_FLOW: 28771.28,

            // 留存
            D1_retained_users: 627,
            D7_retained_users: 153,
          },
          {
            date: "2025-11-20", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 924,
            D0_unique_purchase: 188,
            D0_PURCHASE_VALUE: 335.35,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 188,
            D0_SPORTS_BET_PLACED_USER: 67,
            D0_GAMES_BET_PLACED_USER: 156,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 28.73,
            D0_GAMES_BET_FLOW: 1862.1,
            D0_TOTAL_BET_FLOW: 1890.83,

            // 付费 & 投注（D7）
            D7_unique_purchase: 319,
            D7_PURCHASE_VALUE: 1197.5,
            D7_TOTAL_BET_PLACED_USER: 344,
            D7_SPORTS_BET_PLACED_USER: 191,
            D7_GAMES_BET_PLACED_USER: 228,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 124.52,
            D7_GAMES_BET_FLOW: 7282.73,
            D7_TOTAL_BET_FLOW: 7407.25,

            // 留存
            D1_retained_users: 258,
            D7_retained_users: 60,
          },
          {
            date: "2025-11-20", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 193,
            D0_unique_purchase: 40,
            D0_PURCHASE_VALUE: 296.05,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 42,
            D0_SPORTS_BET_PLACED_USER: 24,
            D0_GAMES_BET_PLACED_USER: 21,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 17.94,
            D0_GAMES_BET_FLOW: 1861.23,
            D0_TOTAL_BET_FLOW: 1879.17,

            // 付费 & 投注（D7）
            D7_unique_purchase: 58,
            D7_PURCHASE_VALUE: 1854.38,
            D7_TOTAL_BET_PLACED_USER: 73,
            D7_SPORTS_BET_PLACED_USER: 45,
            D7_GAMES_BET_PLACED_USER: 41,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 78.53,
            D7_GAMES_BET_FLOW: 16176.47,
            D7_TOTAL_BET_FLOW: 16255.01,

            // 留存
            D1_retained_users: 80,
            D7_retained_users: 22,
          },
          {
            date: "2025-11-21", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 2528,
            D0_unique_purchase: 1961,
            D0_PURCHASE_VALUE: 6760.38,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 1678,
            D0_SPORTS_BET_PLACED_USER: 1613,
            D0_GAMES_BET_PLACED_USER: 100,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 3780.99,
            D0_GAMES_BET_FLOW: 9613.45,
            D0_TOTAL_BET_FLOW: 13394.44,

            // 付费 & 投注（D7）
            D7_unique_purchase: 2350,
            D7_PURCHASE_VALUE: 12227.46,
            D7_TOTAL_BET_PLACED_USER: 2345,
            D7_SPORTS_BET_PLACED_USER: 2275,
            D7_GAMES_BET_PLACED_USER: 208,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 5357.17,
            D7_GAMES_BET_FLOW: 56711.94,
            D7_TOTAL_BET_FLOW: 62069.11,

            // 留存
            D1_retained_users: 1236,
            D7_retained_users: 38,
          },
          {
            date: "2025-11-21", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1485,
            D0_unique_purchase: 534,
            D0_PURCHASE_VALUE: 987.58,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 525,
            D0_SPORTS_BET_PLACED_USER: 196,
            D0_GAMES_BET_PLACED_USER: 388,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 94.14,
            D0_GAMES_BET_FLOW: 5015.44,
            D0_TOTAL_BET_FLOW: 5109.58,

            // 付费 & 投注（D7）
            D7_unique_purchase: 702,
            D7_PURCHASE_VALUE: 2249.52,
            D7_TOTAL_BET_PLACED_USER: 778,
            D7_SPORTS_BET_PLACED_USER: 395,
            D7_GAMES_BET_PLACED_USER: 553,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 407.45,
            D7_GAMES_BET_FLOW: 24013.79,
            D7_TOTAL_BET_FLOW: 24421.24,

            // 留存
            D1_retained_users: 683,
            D7_retained_users: 191,
          },
          {
            date: "2025-11-21", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1815,
            D0_unique_purchase: 621,
            D0_PURCHASE_VALUE: 1331.06,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 569,
            D0_SPORTS_BET_PLACED_USER: 375,
            D0_GAMES_BET_PLACED_USER: 327,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 946.33,
            D0_GAMES_BET_FLOW: 4247.63,
            D0_TOTAL_BET_FLOW: 5193.96,

            // 付费 & 投注（D7）
            D7_unique_purchase: 790,
            D7_PURCHASE_VALUE: 4387.35,
            D7_TOTAL_BET_PLACED_USER: 795,
            D7_SPORTS_BET_PLACED_USER: 564,
            D7_GAMES_BET_PLACED_USER: 497,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 3080.73,
            D7_GAMES_BET_FLOW: 12632.25,
            D7_TOTAL_BET_FLOW: 15712.98,

            // 留存
            D1_retained_users: 620,
            D7_retained_users: 192,
          },
          {
            date: "2025-11-21", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1175,
            D0_unique_purchase: 264,
            D0_PURCHASE_VALUE: 982.86,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 289,
            D0_SPORTS_BET_PLACED_USER: 125,
            D0_GAMES_BET_PLACED_USER: 199,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 70.44,
            D0_GAMES_BET_FLOW: 3287.58,
            D0_TOTAL_BET_FLOW: 3358.02,

            // 付费 & 投注（D7）
            D7_unique_purchase: 371,
            D7_PURCHASE_VALUE: 2821.63,
            D7_TOTAL_BET_PLACED_USER: 412,
            D7_SPORTS_BET_PLACED_USER: 188,
            D7_GAMES_BET_PLACED_USER: 311,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 245.05,
            D7_GAMES_BET_FLOW: 14245.88,
            D7_TOTAL_BET_FLOW: 14490.93,

            // 留存
            D1_retained_users: 279,
            D7_retained_users: 78,
          },
          {
            date: "2025-11-21", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 209,
            D0_unique_purchase: 54,
            D0_PURCHASE_VALUE: 87.37,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 54,
            D0_SPORTS_BET_PLACED_USER: 32,
            D0_GAMES_BET_PLACED_USER: 29,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 18.39,
            D0_GAMES_BET_FLOW: 286.88,
            D0_TOTAL_BET_FLOW: 305.27,

            // 付费 & 投注（D7）
            D7_unique_purchase: 67,
            D7_PURCHASE_VALUE: 225.79,
            D7_TOTAL_BET_PLACED_USER: 84,
            D7_SPORTS_BET_PLACED_USER: 64,
            D7_GAMES_BET_PLACED_USER: 50,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 157.43,
            D7_GAMES_BET_FLOW: 582.68,
            D7_TOTAL_BET_FLOW: 740.11,

            // 留存
            D1_retained_users: 87,
            D7_retained_users: 22,
          },
          {
            date: "2025-11-22", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 2644,
            D0_unique_purchase: 2245,
            D0_PURCHASE_VALUE: 6022.15,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 1904,
            D0_SPORTS_BET_PLACED_USER: 1841,
            D0_GAMES_BET_PLACED_USER: 125,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 4333.54,
            D0_GAMES_BET_FLOW: 3651.82,
            D0_TOTAL_BET_FLOW: 7985.36,

            // 付费 & 投注（D7）
            D7_unique_purchase: 2475,
            D7_PURCHASE_VALUE: 12284.69,
            D7_TOTAL_BET_PLACED_USER: 2441,
            D7_SPORTS_BET_PLACED_USER: 2377,
            D7_GAMES_BET_PLACED_USER: 272,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 6594.52,
            D7_GAMES_BET_FLOW: 66573.58,
            D7_TOTAL_BET_FLOW: 73168.1,

            // 留存
            D1_retained_users: 1029,
            D7_retained_users: 73,
          },
          {
            date: "2025-11-22", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1226,
            D0_unique_purchase: 450,
            D0_PURCHASE_VALUE: 771.88,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 459,
            D0_SPORTS_BET_PLACED_USER: 168,
            D0_GAMES_BET_PLACED_USER: 355,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 186.52,
            D0_GAMES_BET_FLOW: 2734.5,
            D0_TOTAL_BET_FLOW: 2921.02,

            // 付费 & 投注（D7）
            D7_unique_purchase: 623,
            D7_PURCHASE_VALUE: 2309.1,
            D7_TOTAL_BET_PLACED_USER: 658,
            D7_SPORTS_BET_PLACED_USER: 260,
            D7_GAMES_BET_PLACED_USER: 525,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 468.74,
            D7_GAMES_BET_FLOW: 9316.67,
            D7_TOTAL_BET_FLOW: 9785.41,

            // 留存
            D1_retained_users: 523,
            D7_retained_users: 142,
          },
          {
            date: "2025-11-22", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1684,
            D0_unique_purchase: 605,
            D0_PURCHASE_VALUE: 1024.24,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 546,
            D0_SPORTS_BET_PLACED_USER: 346,
            D0_GAMES_BET_PLACED_USER: 303,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 704.59,
            D0_GAMES_BET_FLOW: 2849.05,
            D0_TOTAL_BET_FLOW: 3553.65,

            // 付费 & 投注（D7）
            D7_unique_purchase: 734,
            D7_PURCHASE_VALUE: 5811.85,
            D7_TOTAL_BET_PLACED_USER: 723,
            D7_SPORTS_BET_PLACED_USER: 480,
            D7_GAMES_BET_PLACED_USER: 449,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 4281.99,
            D7_GAMES_BET_FLOW: 17819.69,
            D7_TOTAL_BET_FLOW: 22101.68,

            // 留存
            D1_retained_users: 563,
            D7_retained_users: 142,
          },
          {
            date: "2025-11-22", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 931,
            D0_unique_purchase: 256,
            D0_PURCHASE_VALUE: 426.06,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 292,
            D0_SPORTS_BET_PLACED_USER: 194,
            D0_GAMES_BET_PLACED_USER: 145,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 175.82,
            D0_GAMES_BET_FLOW: 1550.26,
            D0_TOTAL_BET_FLOW: 1726.08,

            // 付费 & 投注（D7）
            D7_unique_purchase: 347,
            D7_PURCHASE_VALUE: 1448.72,
            D7_TOTAL_BET_PLACED_USER: 372,
            D7_SPORTS_BET_PLACED_USER: 251,
            D7_GAMES_BET_PLACED_USER: 208,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 514.87,
            D7_GAMES_BET_FLOW: 6571.73,
            D7_TOTAL_BET_FLOW: 7086.6,

            // 留存
            D1_retained_users: 296,
            D7_retained_users: 109,
          },
          {
            date: "2025-11-22", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 257,
            D0_unique_purchase: 80,
            D0_PURCHASE_VALUE: 566.19,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 86,
            D0_SPORTS_BET_PLACED_USER: 62,
            D0_GAMES_BET_PLACED_USER: 31,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 176.34,
            D0_GAMES_BET_FLOW: 1090.92,
            D0_TOTAL_BET_FLOW: 1267.27,

            // 付费 & 投注（D7）
            D7_unique_purchase: 92,
            D7_PURCHASE_VALUE: 913.05,
            D7_TOTAL_BET_PLACED_USER: 108,
            D7_SPORTS_BET_PLACED_USER: 81,
            D7_GAMES_BET_PLACED_USER: 44,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 409.72,
            D7_GAMES_BET_FLOW: 2095.37,
            D7_TOTAL_BET_FLOW: 2505.09,

            // 留存
            D1_retained_users: 89,
            D7_retained_users: 34,
          },
          {
            date: "2025-11-23", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 984,
            D0_unique_purchase: 605,
            D0_PURCHASE_VALUE: 2135.31,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 558,
            D0_SPORTS_BET_PLACED_USER: 510,
            D0_GAMES_BET_PLACED_USER: 80,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 1135.04,
            D0_GAMES_BET_FLOW: 4352.63,
            D0_TOTAL_BET_FLOW: 5487.67,

            // 付费 & 投注（D7）
            D7_unique_purchase: 670,
            D7_PURCHASE_VALUE: 6442.53,
            D7_TOTAL_BET_PLACED_USER: 666,
            D7_SPORTS_BET_PLACED_USER: 603,
            D7_GAMES_BET_PLACED_USER: 136,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2253.51,
            D7_GAMES_BET_FLOW: 36585.19,
            D7_TOTAL_BET_FLOW: 38838.7,

            // 留存
            D1_retained_users: 246,
            D7_retained_users: 67,
          },
          {
            date: "2025-11-23", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1188,
            D0_unique_purchase: 385,
            D0_PURCHASE_VALUE: 1274.41,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 382,
            D0_SPORTS_BET_PLACED_USER: 103,
            D0_GAMES_BET_PLACED_USER: 320,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 49.29,
            D0_GAMES_BET_FLOW: 6270.85,
            D0_TOTAL_BET_FLOW: 6320.15,

            // 付费 & 投注（D7）
            D7_unique_purchase: 517,
            D7_PURCHASE_VALUE: 3202.95,
            D7_TOTAL_BET_PLACED_USER: 543,
            D7_SPORTS_BET_PLACED_USER: 173,
            D7_GAMES_BET_PLACED_USER: 472,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 216.62,
            D7_GAMES_BET_FLOW: 17997.38,
            D7_TOTAL_BET_FLOW: 18214.01,

            // 留存
            D1_retained_users: 472,
            D7_retained_users: 123,
          },
          {
            date: "2025-11-23", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1630,
            D0_unique_purchase: 534,
            D0_PURCHASE_VALUE: 1123.6,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 466,
            D0_SPORTS_BET_PLACED_USER: 295,
            D0_GAMES_BET_PLACED_USER: 267,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 1436.1,
            D0_GAMES_BET_FLOW: 4224.13,
            D0_TOTAL_BET_FLOW: 5660.23,

            // 付费 & 投注（D7）
            D7_unique_purchase: 684,
            D7_PURCHASE_VALUE: 6474.75,
            D7_TOTAL_BET_PLACED_USER: 675,
            D7_SPORTS_BET_PLACED_USER: 460,
            D7_GAMES_BET_PLACED_USER: 397,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 8170.6,
            D7_GAMES_BET_FLOW: 12987.23,
            D7_TOTAL_BET_FLOW: 21157.83,

            // 留存
            D1_retained_users: 525,
            D7_retained_users: 159,
          },
          {
            date: "2025-11-23", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 863,
            D0_unique_purchase: 244,
            D0_PURCHASE_VALUE: 661.73,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 257,
            D0_SPORTS_BET_PLACED_USER: 151,
            D0_GAMES_BET_PLACED_USER: 155,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 110.95,
            D0_GAMES_BET_FLOW: 3118.59,
            D0_TOTAL_BET_FLOW: 3229.54,

            // 付费 & 投注（D7）
            D7_unique_purchase: 309,
            D7_PURCHASE_VALUE: 1376.32,
            D7_TOTAL_BET_PLACED_USER: 343,
            D7_SPORTS_BET_PLACED_USER: 216,
            D7_GAMES_BET_PLACED_USER: 217,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 240.69,
            D7_GAMES_BET_FLOW: 6748.51,
            D7_TOTAL_BET_FLOW: 6989.2,

            // 留存
            D1_retained_users: 259,
            D7_retained_users: 90,
          },
          {
            date: "2025-11-23", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 219,
            D0_unique_purchase: 60,
            D0_PURCHASE_VALUE: 498.51,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 60,
            D0_SPORTS_BET_PLACED_USER: 29,
            D0_GAMES_BET_PLACED_USER: 36,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 158.44,
            D0_GAMES_BET_FLOW: 1415.23,
            D0_TOTAL_BET_FLOW: 1573.68,

            // 付费 & 投注（D7）
            D7_unique_purchase: 72,
            D7_PURCHASE_VALUE: 2166.97,
            D7_TOTAL_BET_PLACED_USER: 90,
            D7_SPORTS_BET_PLACED_USER: 45,
            D7_GAMES_BET_PLACED_USER: 63,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 797.68,
            D7_GAMES_BET_FLOW: 6158.71,
            D7_TOTAL_BET_FLOW: 6956.39,

            // 留存
            D1_retained_users: 92,
            D7_retained_users: 24,
          },
          {
            date: "2025-11-24", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 306,
            D0_unique_purchase: 114,
            D0_PURCHASE_VALUE: 1338.54,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 106,
            D0_SPORTS_BET_PLACED_USER: 52,
            D0_GAMES_BET_PLACED_USER: 76,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 193.94,
            D0_GAMES_BET_FLOW: 6548.46,
            D0_TOTAL_BET_FLOW: 6742.4,

            // 付费 & 投注（D7）
            D7_unique_purchase: 155,
            D7_PURCHASE_VALUE: 4105.08,
            D7_TOTAL_BET_PLACED_USER: 153,
            D7_SPORTS_BET_PLACED_USER: 91,
            D7_GAMES_BET_PLACED_USER: 113,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 372.81,
            D7_GAMES_BET_FLOW: 18561.89,
            D7_TOTAL_BET_FLOW: 18934.7,

            // 留存
            D1_retained_users: 127,
            D7_retained_users: 38,
          },
          {
            date: "2025-11-24", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1711,
            D0_unique_purchase: 490,
            D0_PURCHASE_VALUE: 1319.63,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 486,
            D0_SPORTS_BET_PLACED_USER: 67,
            D0_GAMES_BET_PLACED_USER: 451,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 17.43,
            D0_GAMES_BET_FLOW: 4810.03,
            D0_TOTAL_BET_FLOW: 4827.46,

            // 付费 & 投注（D7）
            D7_unique_purchase: 699,
            D7_PURCHASE_VALUE: 2835.66,
            D7_TOTAL_BET_PLACED_USER: 731,
            D7_SPORTS_BET_PLACED_USER: 151,
            D7_GAMES_BET_PLACED_USER: 677,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 107.89,
            D7_GAMES_BET_FLOW: 9914.94,
            D7_TOTAL_BET_FLOW: 10022.83,

            // 留存
            D1_retained_users: 584,
            D7_retained_users: 114,
          },
          {
            date: "2025-11-24", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1469,
            D0_unique_purchase: 517,
            D0_PURCHASE_VALUE: 2018.43,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 473,
            D0_SPORTS_BET_PLACED_USER: 269,
            D0_GAMES_BET_PLACED_USER: 308,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 197.42,
            D0_GAMES_BET_FLOW: 8323.83,
            D0_TOTAL_BET_FLOW: 8521.25,

            // 付费 & 投注（D7）
            D7_unique_purchase: 659,
            D7_PURCHASE_VALUE: 5770.91,
            D7_TOTAL_BET_PLACED_USER: 646,
            D7_SPORTS_BET_PLACED_USER: 412,
            D7_GAMES_BET_PLACED_USER: 440,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 518.81,
            D7_GAMES_BET_FLOW: 27756,
            D7_TOTAL_BET_FLOW: 28274.82,

            // 留存
            D1_retained_users: 526,
            D7_retained_users: 138,
          },
          {
            date: "2025-11-24", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 720,
            D0_unique_purchase: 185,
            D0_PURCHASE_VALUE: 424.29,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 173,
            D0_SPORTS_BET_PLACED_USER: 78,
            D0_GAMES_BET_PLACED_USER: 127,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 44.15,
            D0_GAMES_BET_FLOW: 1920.08,
            D0_TOTAL_BET_FLOW: 1964.22,

            // 付费 & 投注（D7）
            D7_unique_purchase: 237,
            D7_PURCHASE_VALUE: 1450.69,
            D7_TOTAL_BET_PLACED_USER: 244,
            D7_SPORTS_BET_PLACED_USER: 140,
            D7_GAMES_BET_PLACED_USER: 182,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 206.91,
            D7_GAMES_BET_FLOW: 7930.3,
            D7_TOTAL_BET_FLOW: 8137.21,

            // 留存
            D1_retained_users: 226,
            D7_retained_users: 60,
          },
          {
            date: "2025-11-24", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 185,
            D0_unique_purchase: 50,
            D0_PURCHASE_VALUE: 181.64,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 50,
            D0_SPORTS_BET_PLACED_USER: 29,
            D0_GAMES_BET_PLACED_USER: 28,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 21.86,
            D0_GAMES_BET_FLOW: 530.63,
            D0_TOTAL_BET_FLOW: 552.49,

            // 付费 & 投注（D7）
            D7_unique_purchase: 67,
            D7_PURCHASE_VALUE: 399.66,
            D7_TOTAL_BET_PLACED_USER: 72,
            D7_SPORTS_BET_PLACED_USER: 46,
            D7_GAMES_BET_PLACED_USER: 42,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 49.61,
            D7_GAMES_BET_FLOW: 1273.38,
            D7_TOTAL_BET_FLOW: 1322.99,

            // 留存
            D1_retained_users: 68,
            D7_retained_users: 17,
          },
          {
            date: "2025-11-25", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 312,
            D0_unique_purchase: 147,
            D0_PURCHASE_VALUE: 451.69,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 141,
            D0_SPORTS_BET_PLACED_USER: 77,
            D0_GAMES_BET_PLACED_USER: 93,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 98.53,
            D0_GAMES_BET_FLOW: 1774.19,
            D0_TOTAL_BET_FLOW: 1872.72,

            // 付费 & 投注（D7）
            D7_unique_purchase: 171,
            D7_PURCHASE_VALUE: 1126.85,
            D7_TOTAL_BET_PLACED_USER: 173,
            D7_SPORTS_BET_PLACED_USER: 110,
            D7_GAMES_BET_PLACED_USER: 124,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 535.69,
            D7_GAMES_BET_FLOW: 4029.63,
            D7_TOTAL_BET_FLOW: 4565.31,

            // 留存
            D1_retained_users: 126,
            D7_retained_users: 50,
          },
          {
            date: "2025-11-25", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1907,
            D0_unique_purchase: 413,
            D0_PURCHASE_VALUE: 1086.13,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 417,
            D0_SPORTS_BET_PLACED_USER: 130,
            D0_GAMES_BET_PLACED_USER: 334,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 74.93,
            D0_GAMES_BET_FLOW: 5990.46,
            D0_TOTAL_BET_FLOW: 6065.4,

            // 付费 & 投注（D7）
            D7_unique_purchase: 581,
            D7_PURCHASE_VALUE: 3739.44,
            D7_TOTAL_BET_PLACED_USER: 650,
            D7_SPORTS_BET_PLACED_USER: 233,
            D7_GAMES_BET_PLACED_USER: 536,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 289.64,
            D7_GAMES_BET_FLOW: 17487.76,
            D7_TOTAL_BET_FLOW: 17777.4,

            // 留存
            D1_retained_users: 616,
            D7_retained_users: 123,
          },
          {
            date: "2025-11-25", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1640,
            D0_unique_purchase: 529,
            D0_PURCHASE_VALUE: 812.71,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 470,
            D0_SPORTS_BET_PLACED_USER: 297,
            D0_GAMES_BET_PLACED_USER: 264,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 161.18,
            D0_GAMES_BET_FLOW: 5159.67,
            D0_TOTAL_BET_FLOW: 5320.84,

            // 付费 & 投注（D7）
            D7_unique_purchase: 671,
            D7_PURCHASE_VALUE: 4160.75,
            D7_TOTAL_BET_PLACED_USER: 656,
            D7_SPORTS_BET_PLACED_USER: 441,
            D7_GAMES_BET_PLACED_USER: 405,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 629.81,
            D7_GAMES_BET_FLOW: 37484.1,
            D7_TOTAL_BET_FLOW: 38113.91,

            // 留存
            D1_retained_users: 595,
            D7_retained_users: 154,
          },
          {
            date: "2025-11-25", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 863,
            D0_unique_purchase: 217,
            D0_PURCHASE_VALUE: 314.85,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 289,
            D0_SPORTS_BET_PLACED_USER: 201,
            D0_GAMES_BET_PLACED_USER: 131,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 84.98,
            D0_GAMES_BET_FLOW: 1071.89,
            D0_TOTAL_BET_FLOW: 1156.86,

            // 付费 & 投注（D7）
            D7_unique_purchase: 347,
            D7_PURCHASE_VALUE: 1028.71,
            D7_TOTAL_BET_PLACED_USER: 363,
            D7_SPORTS_BET_PLACED_USER: 251,
            D7_GAMES_BET_PLACED_USER: 189,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 271.43,
            D7_GAMES_BET_FLOW: 5372.59,
            D7_TOTAL_BET_FLOW: 5644.01,

            // 留存
            D1_retained_users: 287,
            D7_retained_users: 86,
          },
          {
            date: "2025-11-25", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 231,
            D0_unique_purchase: 68,
            D0_PURCHASE_VALUE: 245.53,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 71,
            D0_SPORTS_BET_PLACED_USER: 58,
            D0_GAMES_BET_PLACED_USER: 27,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 83.2,
            D0_GAMES_BET_FLOW: 555.88,
            D0_TOTAL_BET_FLOW: 639.08,

            // 付费 & 投注（D7）
            D7_unique_purchase: 83,
            D7_PURCHASE_VALUE: 425.53,
            D7_TOTAL_BET_PLACED_USER: 99,
            D7_SPORTS_BET_PLACED_USER: 78,
            D7_GAMES_BET_PLACED_USER: 49,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 125.01,
            D7_GAMES_BET_FLOW: 1273.23,
            D7_TOTAL_BET_FLOW: 1398.24,

            // 留存
            D1_retained_users: 104,
            D7_retained_users: 21,
          },
          {
            date: "2025-11-26", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 315,
            D0_unique_purchase: 153,
            D0_PURCHASE_VALUE: 710.46,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 143,
            D0_SPORTS_BET_PLACED_USER: 87,
            D0_GAMES_BET_PLACED_USER: 86,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 94.46,
            D0_GAMES_BET_FLOW: 866.51,
            D0_TOTAL_BET_FLOW: 960.97,

            // 付费 & 投注（D7）
            D7_unique_purchase: 193,
            D7_PURCHASE_VALUE: 1363.54,
            D7_TOTAL_BET_PLACED_USER: 193,
            D7_SPORTS_BET_PLACED_USER: 122,
            D7_GAMES_BET_PLACED_USER: 133,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 261.97,
            D7_GAMES_BET_FLOW: 5096.9,
            D7_TOTAL_BET_FLOW: 5358.87,

            // 留存
            D1_retained_users: 133,
            D7_retained_users: 46,
          },
          {
            date: "2025-11-26", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1976,
            D0_unique_purchase: 455,
            D0_PURCHASE_VALUE: 1751.92,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 472,
            D0_SPORTS_BET_PLACED_USER: 126,
            D0_GAMES_BET_PLACED_USER: 394,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 321.05,
            D0_GAMES_BET_FLOW: 6412.02,
            D0_TOTAL_BET_FLOW: 6733.07,

            // 付费 & 投注（D7）
            D7_unique_purchase: 713,
            D7_PURCHASE_VALUE: 3973.96,
            D7_TOTAL_BET_PLACED_USER: 767,
            D7_SPORTS_BET_PLACED_USER: 274,
            D7_GAMES_BET_PLACED_USER: 655,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 939.36,
            D7_GAMES_BET_FLOW: 17929.87,
            D7_TOTAL_BET_FLOW: 18869.23,

            // 留存
            D1_retained_users: 662,
            D7_retained_users: 132,
          },
          {
            date: "2025-11-26", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1600,
            D0_unique_purchase: 482,
            D0_PURCHASE_VALUE: 565.79,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 436,
            D0_SPORTS_BET_PLACED_USER: 261,
            D0_GAMES_BET_PLACED_USER: 261,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 272.72,
            D0_GAMES_BET_FLOW: 2258.64,
            D0_TOTAL_BET_FLOW: 2531.36,

            // 付费 & 投注（D7）
            D7_unique_purchase: 639,
            D7_PURCHASE_VALUE: 2687.15,
            D7_TOTAL_BET_PLACED_USER: 625,
            D7_SPORTS_BET_PLACED_USER: 409,
            D7_GAMES_BET_PLACED_USER: 395,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1041.99,
            D7_GAMES_BET_FLOW: 9937.53,
            D7_TOTAL_BET_FLOW: 10979.52,

            // 留存
            D1_retained_users: 525,
            D7_retained_users: 137,
          },
          {
            date: "2025-11-26", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 812,
            D0_unique_purchase: 219,
            D0_PURCHASE_VALUE: 476.24,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 224,
            D0_SPORTS_BET_PLACED_USER: 111,
            D0_GAMES_BET_PLACED_USER: 143,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 45.21,
            D0_GAMES_BET_FLOW: 1765.21,
            D0_TOTAL_BET_FLOW: 1810.42,

            // 付费 & 投注（D7）
            D7_unique_purchase: 307,
            D7_PURCHASE_VALUE: 1383.21,
            D7_TOTAL_BET_PLACED_USER: 320,
            D7_SPORTS_BET_PLACED_USER: 183,
            D7_GAMES_BET_PLACED_USER: 236,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 241.38,
            D7_GAMES_BET_FLOW: 6844.67,
            D7_TOTAL_BET_FLOW: 7086.05,

            // 留存
            D1_retained_users: 236,
            D7_retained_users: 97,
          },
          {
            date: "2025-11-26", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 206,
            D0_unique_purchase: 55,
            D0_PURCHASE_VALUE: 84.58,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 64,
            D0_SPORTS_BET_PLACED_USER: 50,
            D0_GAMES_BET_PLACED_USER: 16,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 54.71,
            D0_GAMES_BET_FLOW: 102.41,
            D0_TOTAL_BET_FLOW: 157.12,

            // 付费 & 投注（D7）
            D7_unique_purchase: 69,
            D7_PURCHASE_VALUE: 172.28,
            D7_TOTAL_BET_PLACED_USER: 88,
            D7_SPORTS_BET_PLACED_USER: 67,
            D7_GAMES_BET_PLACED_USER: 36,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 175.67,
            D7_GAMES_BET_FLOW: 281.55,
            D7_TOTAL_BET_FLOW: 457.22,

            // 留存
            D1_retained_users: 81,
            D7_retained_users: 24,
          },
          {
            date: "2025-11-27", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 279,
            D0_unique_purchase: 112,
            D0_PURCHASE_VALUE: 1288.62,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 104,
            D0_SPORTS_BET_PLACED_USER: 55,
            D0_GAMES_BET_PLACED_USER: 73,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 99.48,
            D0_GAMES_BET_FLOW: 6262.71,
            D0_TOTAL_BET_FLOW: 6362.19,

            // 付费 & 投注（D7）
            D7_unique_purchase: 137,
            D7_PURCHASE_VALUE: 3920.85,
            D7_TOTAL_BET_PLACED_USER: 136,
            D7_SPORTS_BET_PLACED_USER: 89,
            D7_GAMES_BET_PLACED_USER: 95,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 379.67,
            D7_GAMES_BET_FLOW: 17513.31,
            D7_TOTAL_BET_FLOW: 17892.98,

            // 留存
            D1_retained_users: 116,
            D7_retained_users: 41,
          },
          {
            date: "2025-11-27", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 2187,
            D0_unique_purchase: 599,
            D0_PURCHASE_VALUE: 1802.12,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 600,
            D0_SPORTS_BET_PLACED_USER: 147,
            D0_GAMES_BET_PLACED_USER: 528,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 398.28,
            D0_GAMES_BET_FLOW: 7604.85,
            D0_TOTAL_BET_FLOW: 8003.13,

            // 付费 & 投注（D7）
            D7_unique_purchase: 901,
            D7_PURCHASE_VALUE: 5074.65,
            D7_TOTAL_BET_PLACED_USER: 950,
            D7_SPORTS_BET_PLACED_USER: 383,
            D7_GAMES_BET_PLACED_USER: 810,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1217.29,
            D7_GAMES_BET_FLOW: 29746.55,
            D7_TOTAL_BET_FLOW: 30963.85,

            // 留存
            D1_retained_users: 735,
            D7_retained_users: 200,
          },
          {
            date: "2025-11-27", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1669,
            D0_unique_purchase: 513,
            D0_PURCHASE_VALUE: 794.4,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 468,
            D0_SPORTS_BET_PLACED_USER: 272,
            D0_GAMES_BET_PLACED_USER: 283,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 938.6,
            D0_GAMES_BET_FLOW: 2789,
            D0_TOTAL_BET_FLOW: 3727.6,

            // 付费 & 投注（D7）
            D7_unique_purchase: 658,
            D7_PURCHASE_VALUE: 3057.47,
            D7_TOTAL_BET_PLACED_USER: 662,
            D7_SPORTS_BET_PLACED_USER: 435,
            D7_GAMES_BET_PLACED_USER: 416,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 3420.02,
            D7_GAMES_BET_FLOW: 11921.85,
            D7_TOTAL_BET_FLOW: 15341.87,

            // 留存
            D1_retained_users: 576,
            D7_retained_users: 143,
          },
          {
            date: "2025-11-27", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 777,
            D0_unique_purchase: 184,
            D0_PURCHASE_VALUE: 697.96,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 188,
            D0_SPORTS_BET_PLACED_USER: 97,
            D0_GAMES_BET_PLACED_USER: 131,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 73.91,
            D0_GAMES_BET_FLOW: 4138.73,
            D0_TOTAL_BET_FLOW: 4212.64,

            // 付费 & 投注（D7）
            D7_unique_purchase: 264,
            D7_PURCHASE_VALUE: 1380.73,
            D7_TOTAL_BET_PLACED_USER: 307,
            D7_SPORTS_BET_PLACED_USER: 195,
            D7_GAMES_BET_PLACED_USER: 194,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 299.79,
            D7_GAMES_BET_FLOW: 7431.02,
            D7_TOTAL_BET_FLOW: 7730.81,

            // 留存
            D1_retained_users: 235,
            D7_retained_users: 71,
          },
          {
            date: "2025-11-27", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 246,
            D0_unique_purchase: 55,
            D0_PURCHASE_VALUE: 175.26,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 60,
            D0_SPORTS_BET_PLACED_USER: 30,
            D0_GAMES_BET_PLACED_USER: 39,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 27.63,
            D0_GAMES_BET_FLOW: 633.25,
            D0_TOTAL_BET_FLOW: 660.88,

            // 付费 & 投注（D7）
            D7_unique_purchase: 70,
            D7_PURCHASE_VALUE: 536.13,
            D7_TOTAL_BET_PLACED_USER: 88,
            D7_SPORTS_BET_PLACED_USER: 55,
            D7_GAMES_BET_PLACED_USER: 63,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 292.37,
            D7_GAMES_BET_FLOW: 1593.06,
            D7_TOTAL_BET_FLOW: 1885.42,

            // 留存
            D1_retained_users: 76,
            D7_retained_users: 24,
          },
          {
            date: "2025-11-28", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 270,
            D0_unique_purchase: 108,
            D0_PURCHASE_VALUE: 369.46,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 99,
            D0_SPORTS_BET_PLACED_USER: 54,
            D0_GAMES_BET_PLACED_USER: 58,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 151.09,
            D0_GAMES_BET_FLOW: 977.91,
            D0_TOTAL_BET_FLOW: 1129,

            // 付费 & 投注（D7）
            D7_unique_purchase: 130,
            D7_PURCHASE_VALUE: 3403.31,
            D7_TOTAL_BET_PLACED_USER: 128,
            D7_SPORTS_BET_PLACED_USER: 78,
            D7_GAMES_BET_PLACED_USER: 82,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1737.18,
            D7_GAMES_BET_FLOW: 6529.56,
            D7_TOTAL_BET_FLOW: 8266.74,

            // 留存
            D1_retained_users: 108,
            D7_retained_users: 31,
          },
          {
            date: "2025-11-28", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1498,
            D0_unique_purchase: 417,
            D0_PURCHASE_VALUE: 1077.85,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 415,
            D0_SPORTS_BET_PLACED_USER: 102,
            D0_GAMES_BET_PLACED_USER: 354,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 124.09,
            D0_GAMES_BET_FLOW: 4685.66,
            D0_TOTAL_BET_FLOW: 4809.75,

            // 付费 & 投注（D7）
            D7_unique_purchase: 603,
            D7_PURCHASE_VALUE: 3790.71,
            D7_TOTAL_BET_PLACED_USER: 664,
            D7_SPORTS_BET_PLACED_USER: 244,
            D7_GAMES_BET_PLACED_USER: 529,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 574.25,
            D7_GAMES_BET_FLOW: 58613.83,
            D7_TOTAL_BET_FLOW: 59188.07,

            // 留存
            D1_retained_users: 587,
            D7_retained_users: 94,
          },
          {
            date: "2025-11-28", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1591,
            D0_unique_purchase: 505,
            D0_PURCHASE_VALUE: 1035.69,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 460,
            D0_SPORTS_BET_PLACED_USER: 289,
            D0_GAMES_BET_PLACED_USER: 267,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 550.88,
            D0_GAMES_BET_FLOW: 6569.83,
            D0_TOTAL_BET_FLOW: 7120.71,

            // 付费 & 投注（D7）
            D7_unique_purchase: 648,
            D7_PURCHASE_VALUE: 6129.49,
            D7_TOTAL_BET_PLACED_USER: 643,
            D7_SPORTS_BET_PLACED_USER: 435,
            D7_GAMES_BET_PLACED_USER: 404,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1693.6,
            D7_GAMES_BET_FLOW: 27814.97,
            D7_TOTAL_BET_FLOW: 29508.56,

            // 留存
            D1_retained_users: 543,
            D7_retained_users: 147,
          },
          {
            date: "2025-11-28", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 967,
            D0_unique_purchase: 200,
            D0_PURCHASE_VALUE: 464.7,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 197,
            D0_SPORTS_BET_PLACED_USER: 89,
            D0_GAMES_BET_PLACED_USER: 142,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 55.23,
            D0_GAMES_BET_FLOW: 1347,
            D0_TOTAL_BET_FLOW: 1402.23,

            // 付费 & 投注（D7）
            D7_unique_purchase: 322,
            D7_PURCHASE_VALUE: 1525.23,
            D7_TOTAL_BET_PLACED_USER: 355,
            D7_SPORTS_BET_PLACED_USER: 226,
            D7_GAMES_BET_PLACED_USER: 256,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 166.18,
            D7_GAMES_BET_FLOW: 6732.48,
            D7_TOTAL_BET_FLOW: 6898.66,

            // 留存
            D1_retained_users: 239,
            D7_retained_users: 99,
          },
          {
            date: "2025-11-28", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 313,
            D0_unique_purchase: 53,
            D0_PURCHASE_VALUE: 99.66,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 54,
            D0_SPORTS_BET_PLACED_USER: 29,
            D0_GAMES_BET_PLACED_USER: 35,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 12.74,
            D0_GAMES_BET_FLOW: 1037.64,
            D0_TOTAL_BET_FLOW: 1050.38,

            // 付费 & 投注（D7）
            D7_unique_purchase: 71,
            D7_PURCHASE_VALUE: 552.47,
            D7_TOTAL_BET_PLACED_USER: 97,
            D7_SPORTS_BET_PLACED_USER: 54,
            D7_GAMES_BET_PLACED_USER: 73,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 45.69,
            D7_GAMES_BET_FLOW: 5037.63,
            D7_TOTAL_BET_FLOW: 5083.32,

            // 留存
            D1_retained_users: 124,
            D7_retained_users: 12,
          },
          {
            date: "2025-11-29", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 379,
            D0_unique_purchase: 192,
            D0_PURCHASE_VALUE: 2072.46,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 184,
            D0_SPORTS_BET_PLACED_USER: 111,
            D0_GAMES_BET_PLACED_USER: 111,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 170.79,
            D0_GAMES_BET_FLOW: 21436.54,
            D0_TOTAL_BET_FLOW: 21607.33,

            // 付费 & 投注（D7）
            D7_unique_purchase: 222,
            D7_PURCHASE_VALUE: 10754.62,
            D7_TOTAL_BET_PLACED_USER: 223,
            D7_SPORTS_BET_PLACED_USER: 149,
            D7_GAMES_BET_PLACED_USER: 150,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 676.77,
            D7_GAMES_BET_FLOW: 88417.33,
            D7_TOTAL_BET_FLOW: 89094.1,

            // 留存
            D1_retained_users: 161,
            D7_retained_users: 69,
          },
          {
            date: "2025-11-29", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 2140,
            D0_unique_purchase: 552,
            D0_PURCHASE_VALUE: 1453.44,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 584,
            D0_SPORTS_BET_PLACED_USER: 170,
            D0_GAMES_BET_PLACED_USER: 473,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 294.38,
            D0_GAMES_BET_FLOW: 6894.13,
            D0_TOTAL_BET_FLOW: 7188.52,

            // 付费 & 投注（D7）
            D7_unique_purchase: 792,
            D7_PURCHASE_VALUE: 3129.15,
            D7_TOTAL_BET_PLACED_USER: 918,
            D7_SPORTS_BET_PLACED_USER: 377,
            D7_GAMES_BET_PLACED_USER: 700,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 632.84,
            D7_GAMES_BET_FLOW: 14504.03,
            D7_TOTAL_BET_FLOW: 15136.87,

            // 留存
            D1_retained_users: 788,
            D7_retained_users: 131,
          },
          {
            date: "2025-11-29", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1539,
            D0_unique_purchase: 570,
            D0_PURCHASE_VALUE: 761.1,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 526,
            D0_SPORTS_BET_PLACED_USER: 310,
            D0_GAMES_BET_PLACED_USER: 320,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 181.22,
            D0_GAMES_BET_FLOW: 3299.92,
            D0_TOTAL_BET_FLOW: 3481.15,

            // 付费 & 投注（D7）
            D7_unique_purchase: 699,
            D7_PURCHASE_VALUE: 2807.52,
            D7_TOTAL_BET_PLACED_USER: 701,
            D7_SPORTS_BET_PLACED_USER: 466,
            D7_GAMES_BET_PLACED_USER: 441,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 503.6,
            D7_GAMES_BET_FLOW: 15953.81,
            D7_TOTAL_BET_FLOW: 16457.4,

            // 留存
            D1_retained_users: 584,
            D7_retained_users: 174,
          },
          {
            date: "2025-11-29", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 976,
            D0_unique_purchase: 236,
            D0_PURCHASE_VALUE: 622.66,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 235,
            D0_SPORTS_BET_PLACED_USER: 124,
            D0_GAMES_BET_PLACED_USER: 155,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 94.51,
            D0_GAMES_BET_FLOW: 2423.31,
            D0_TOTAL_BET_FLOW: 2517.81,

            // 付费 & 投注（D7）
            D7_unique_purchase: 354,
            D7_PURCHASE_VALUE: 3178.44,
            D7_TOTAL_BET_PLACED_USER: 377,
            D7_SPORTS_BET_PLACED_USER: 217,
            D7_GAMES_BET_PLACED_USER: 255,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 279.74,
            D7_GAMES_BET_FLOW: 22766.96,
            D7_TOTAL_BET_FLOW: 23046.71,

            // 留存
            D1_retained_users: 330,
            D7_retained_users: 89,
          },
          {
            date: "2025-11-29", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 382,
            D0_unique_purchase: 79,
            D0_PURCHASE_VALUE: 129.32,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 85,
            D0_SPORTS_BET_PLACED_USER: 50,
            D0_GAMES_BET_PLACED_USER: 50,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 48.3,
            D0_GAMES_BET_FLOW: 368.76,
            D0_TOTAL_BET_FLOW: 417.06,

            // 付费 & 投注（D7）
            D7_unique_purchase: 96,
            D7_PURCHASE_VALUE: 270.23,
            D7_TOTAL_BET_PLACED_USER: 137,
            D7_SPORTS_BET_PLACED_USER: 79,
            D7_GAMES_BET_PLACED_USER: 92,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 134.52,
            D7_GAMES_BET_FLOW: 1208.52,
            D7_TOTAL_BET_FLOW: 1343.04,

            // 留存
            D1_retained_users: 126,
            D7_retained_users: 48,
          },
          {
            date: "2025-11-30", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 332,
            D0_unique_purchase: 164,
            D0_PURCHASE_VALUE: 762.46,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 164,
            D0_SPORTS_BET_PLACED_USER: 109,
            D0_GAMES_BET_PLACED_USER: 88,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 54.49,
            D0_GAMES_BET_FLOW: 4431.81,
            D0_TOTAL_BET_FLOW: 4486.29,

            // 付费 & 投注（D7）
            D7_unique_purchase: 196,
            D7_PURCHASE_VALUE: 7789.62,
            D7_TOTAL_BET_PLACED_USER: 204,
            D7_SPORTS_BET_PLACED_USER: 143,
            D7_GAMES_BET_PLACED_USER: 127,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 158.27,
            D7_GAMES_BET_FLOW: 101863.79,
            D7_TOTAL_BET_FLOW: 102022.06,

            // 留存
            D1_retained_users: 158,
            D7_retained_users: 56,
          },
          {
            date: "2025-11-30", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 2013,
            D0_unique_purchase: 559,
            D0_PURCHASE_VALUE: 1505.62,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 580,
            D0_SPORTS_BET_PLACED_USER: 215,
            D0_GAMES_BET_PLACED_USER: 441,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 448.19,
            D0_GAMES_BET_FLOW: 7617.89,
            D0_TOTAL_BET_FLOW: 8066.07,

            // 付费 & 投注（D7）
            D7_unique_purchase: 737,
            D7_PURCHASE_VALUE: 3705.42,
            D7_TOTAL_BET_PLACED_USER: 811,
            D7_SPORTS_BET_PLACED_USER: 347,
            D7_GAMES_BET_PLACED_USER: 623,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 606.87,
            D7_GAMES_BET_FLOW: 27489,
            D7_TOTAL_BET_FLOW: 28095.87,

            // 留存
            D1_retained_users: 671,
            D7_retained_users: 140,
          },
          {
            date: "2025-11-30", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1604,
            D0_unique_purchase: 557,
            D0_PURCHASE_VALUE: 5358.37,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 498,
            D0_SPORTS_BET_PLACED_USER: 310,
            D0_GAMES_BET_PLACED_USER: 300,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 493.88,
            D0_GAMES_BET_FLOW: 10688.81,
            D0_TOTAL_BET_FLOW: 11182.69,

            // 付费 & 投注（D7）
            D7_unique_purchase: 697,
            D7_PURCHASE_VALUE: 18268.69,
            D7_TOTAL_BET_PLACED_USER: 678,
            D7_SPORTS_BET_PLACED_USER: 458,
            D7_GAMES_BET_PLACED_USER: 428,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 15196.97,
            D7_GAMES_BET_FLOW: 38455.38,
            D7_TOTAL_BET_FLOW: 53652.36,

            // 留存
            D1_retained_users: 515,
            D7_retained_users: 157,
          },
          {
            date: "2025-11-30", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 844,
            D0_unique_purchase: 227,
            D0_PURCHASE_VALUE: 587.1,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 235,
            D0_SPORTS_BET_PLACED_USER: 141,
            D0_GAMES_BET_PLACED_USER: 144,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 223.23,
            D0_GAMES_BET_FLOW: 1850.58,
            D0_TOTAL_BET_FLOW: 2073.81,

            // 付费 & 投注（D7）
            D7_unique_purchase: 306,
            D7_PURCHASE_VALUE: 1482.83,
            D7_TOTAL_BET_PLACED_USER: 331,
            D7_SPORTS_BET_PLACED_USER: 184,
            D7_GAMES_BET_PLACED_USER: 239,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 341.38,
            D7_GAMES_BET_FLOW: 5822.13,
            D7_TOTAL_BET_FLOW: 6163.51,

            // 留存
            D1_retained_users: 293,
            D7_retained_users: 74,
          },
          {
            date: "2025-11-30", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 193,
            D0_unique_purchase: 48,
            D0_PURCHASE_VALUE: 62.7,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 54,
            D0_SPORTS_BET_PLACED_USER: 40,
            D0_GAMES_BET_PLACED_USER: 21,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 17.71,
            D0_GAMES_BET_FLOW: 203.34,
            D0_TOTAL_BET_FLOW: 221.05,

            // 付费 & 投注（D7）
            D7_unique_purchase: 67,
            D7_PURCHASE_VALUE: 235.79,
            D7_TOTAL_BET_PLACED_USER: 83,
            D7_SPORTS_BET_PLACED_USER: 65,
            D7_GAMES_BET_PLACED_USER: 42,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 69.55,
            D7_GAMES_BET_FLOW: 1268.82,
            D7_TOTAL_BET_FLOW: 1338.37,

            // 留存
            D1_retained_users: 90,
            D7_retained_users: 39,
          },
        ],
            "2025-12": [
          {
            date: "2025-12-01", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 292,
            D0_unique_purchase: 135,
            D0_PURCHASE_VALUE: 472,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 125,
            D0_SPORTS_BET_PLACED_USER: 64,
            D0_GAMES_BET_PLACED_USER: 91,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 103.22,
            D0_GAMES_BET_FLOW: 1718.22,
            D0_TOTAL_BET_FLOW: 1821.44,

            // 付费 & 投注（D7）
            D7_unique_purchase: 165,
            D7_PURCHASE_VALUE: 1476.77,
            D7_TOTAL_BET_PLACED_USER: 164,
            D7_SPORTS_BET_PLACED_USER: 91,
            D7_GAMES_BET_PLACED_USER: 127,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 196.84,
            D7_GAMES_BET_FLOW: 12158.84,
            D7_TOTAL_BET_FLOW: 12355.68,

            // 留存
            D1_retained_users: 125,
            D7_retained_users: 47,
          },
          {
            date: "2025-12-01", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 2284,
            D0_unique_purchase: 747,
            D0_PURCHASE_VALUE: 2727.93,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 670,
            D0_SPORTS_BET_PLACED_USER: 148,
            D0_GAMES_BET_PLACED_USER: 591,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 740.86,
            D0_GAMES_BET_FLOW: 16761.33,
            D0_TOTAL_BET_FLOW: 17502.19,

            // 付费 & 投注（D7）
            D7_unique_purchase: 1017,
            D7_PURCHASE_VALUE: 4865.05,
            D7_TOTAL_BET_PLACED_USER: 1056,
            D7_SPORTS_BET_PLACED_USER: 367,
            D7_GAMES_BET_PLACED_USER: 844,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1274.29,
            D7_GAMES_BET_FLOW: 26672.66,
            D7_TOTAL_BET_FLOW: 27946.96,

            // 留存
            D1_retained_users: 764,
            D7_retained_users: 173,
          },
          {
            date: "2025-12-01", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1641,
            D0_unique_purchase: 541,
            D0_PURCHASE_VALUE: 1009.6,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 475,
            D0_SPORTS_BET_PLACED_USER: 277,
            D0_GAMES_BET_PLACED_USER: 295,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 175.2,
            D0_GAMES_BET_FLOW: 2791.61,
            D0_TOTAL_BET_FLOW: 2966.81,

            // 付费 & 投注（D7）
            D7_unique_purchase: 711,
            D7_PURCHASE_VALUE: 2739.44,
            D7_TOTAL_BET_PLACED_USER: 687,
            D7_SPORTS_BET_PLACED_USER: 442,
            D7_GAMES_BET_PLACED_USER: 435,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 633.07,
            D7_GAMES_BET_FLOW: 15867,
            D7_TOTAL_BET_FLOW: 16500.07,

            // 留存
            D1_retained_users: 662,
            D7_retained_users: 125,
          },
          {
            date: "2025-12-01", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1003,
            D0_unique_purchase: 237,
            D0_PURCHASE_VALUE: 731.52,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 245,
            D0_SPORTS_BET_PLACED_USER: 91,
            D0_GAMES_BET_PLACED_USER: 183,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 65.67,
            D0_GAMES_BET_FLOW: 3590.44,
            D0_TOTAL_BET_FLOW: 3656.12,

            // 付费 & 投注（D7）
            D7_unique_purchase: 348,
            D7_PURCHASE_VALUE: 4526.18,
            D7_TOTAL_BET_PLACED_USER: 377,
            D7_SPORTS_BET_PLACED_USER: 164,
            D7_GAMES_BET_PLACED_USER: 297,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 327.14,
            D7_GAMES_BET_FLOW: 25630.89,
            D7_TOTAL_BET_FLOW: 25958.03,

            // 留存
            D1_retained_users: 303,
            D7_retained_users: 52,
          },
          {
            date: "2025-12-01", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 254,
            D0_unique_purchase: 51,
            D0_PURCHASE_VALUE: 140.39,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 53,
            D0_SPORTS_BET_PLACED_USER: 17,
            D0_GAMES_BET_PLACED_USER: 42,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 30.29,
            D0_GAMES_BET_FLOW: 477.67,
            D0_TOTAL_BET_FLOW: 507.96,

            // 付费 & 投注（D7）
            D7_unique_purchase: 65,
            D7_PURCHASE_VALUE: 655.91,
            D7_TOTAL_BET_PLACED_USER: 81,
            D7_SPORTS_BET_PLACED_USER: 36,
            D7_GAMES_BET_PLACED_USER: 67,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 79.73,
            D7_GAMES_BET_FLOW: 4303.08,
            D7_TOTAL_BET_FLOW: 4382.81,

            // 留存
            D1_retained_users: 71,
            D7_retained_users: 16,
          },
          {
            date: "2025-12-02", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 322,
            D0_unique_purchase: 142,
            D0_PURCHASE_VALUE: 2502.96,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 135,
            D0_SPORTS_BET_PLACED_USER: 70,
            D0_GAMES_BET_PLACED_USER: 98,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 270.13,
            D0_GAMES_BET_FLOW: 16463.88,
            D0_TOTAL_BET_FLOW: 16734.01,

            // 付费 & 投注（D7）
            D7_unique_purchase: 182,
            D7_PURCHASE_VALUE: 13402.42,
            D7_TOTAL_BET_PLACED_USER: 182,
            D7_SPORTS_BET_PLACED_USER: 120,
            D7_GAMES_BET_PLACED_USER: 136,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1264.91,
            D7_GAMES_BET_FLOW: 69355.8,
            D7_TOTAL_BET_FLOW: 70620.71,

            // 留存
            D1_retained_users: 147,
            D7_retained_users: 59,
          },
          {
            date: "2025-12-02", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 3085,
            D0_unique_purchase: 912,
            D0_PURCHASE_VALUE: 5297.87,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 914,
            D0_SPORTS_BET_PLACED_USER: 212,
            D0_GAMES_BET_PLACED_USER: 790,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 925,
            D0_GAMES_BET_FLOW: 41892.89,
            D0_TOTAL_BET_FLOW: 42817.89,

            // 付费 & 投注（D7）
            D7_unique_purchase: 1249,
            D7_PURCHASE_VALUE: 10712.58,
            D7_TOTAL_BET_PLACED_USER: 1295,
            D7_SPORTS_BET_PLACED_USER: 377,
            D7_GAMES_BET_PLACED_USER: 1096,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1873.73,
            D7_GAMES_BET_FLOW: 105805.57,
            D7_TOTAL_BET_FLOW: 107679.3,

            // 留存
            D1_retained_users: 1044,
            D7_retained_users: 143,
          },
          {
            date: "2025-12-02", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1522,
            D0_unique_purchase: 561,
            D0_PURCHASE_VALUE: 747.03,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 504,
            D0_SPORTS_BET_PLACED_USER: 312,
            D0_GAMES_BET_PLACED_USER: 285,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 249.46,
            D0_GAMES_BET_FLOW: 2442.76,
            D0_TOTAL_BET_FLOW: 2692.22,

            // 付费 & 投注（D7）
            D7_unique_purchase: 700,
            D7_PURCHASE_VALUE: 3504.2,
            D7_TOTAL_BET_PLACED_USER: 684,
            D7_SPORTS_BET_PLACED_USER: 469,
            D7_GAMES_BET_PLACED_USER: 408,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2502.53,
            D7_GAMES_BET_FLOW: 10886.05,
            D7_TOTAL_BET_FLOW: 13388.58,

            // 留存
            D1_retained_users: 588,
            D7_retained_users: 146,
          },
          {
            date: "2025-12-02", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1311,
            D0_unique_purchase: 253,
            D0_PURCHASE_VALUE: 3556.18,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 257,
            D0_SPORTS_BET_PLACED_USER: 104,
            D0_GAMES_BET_PLACED_USER: 188,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 86.14,
            D0_GAMES_BET_FLOW: 20760.11,
            D0_TOTAL_BET_FLOW: 20846.25,

            // 付费 & 投注（D7）
            D7_unique_purchase: 387,
            D7_PURCHASE_VALUE: 6059.13,
            D7_TOTAL_BET_PLACED_USER: 429,
            D7_SPORTS_BET_PLACED_USER: 230,
            D7_GAMES_BET_PLACED_USER: 291,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 244.67,
            D7_GAMES_BET_FLOW: 54359.42,
            D7_TOTAL_BET_FLOW: 54604.1,

            // 留存
            D1_retained_users: 307,
            D7_retained_users: 76,
          },
          {
            date: "2025-12-02", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 272,
            D0_unique_purchase: 72,
            D0_PURCHASE_VALUE: 435.54,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 74,
            D0_SPORTS_BET_PLACED_USER: 37,
            D0_GAMES_BET_PLACED_USER: 45,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 36.79,
            D0_GAMES_BET_FLOW: 1721.72,
            D0_TOTAL_BET_FLOW: 1758.51,

            // 付费 & 投注（D7）
            D7_unique_purchase: 85,
            D7_PURCHASE_VALUE: 1810.86,
            D7_TOTAL_BET_PLACED_USER: 110,
            D7_SPORTS_BET_PLACED_USER: 66,
            D7_GAMES_BET_PLACED_USER: 74,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 169.37,
            D7_GAMES_BET_FLOW: 10222.64,
            D7_TOTAL_BET_FLOW: 10392,

            // 留存
            D1_retained_users: 122,
            D7_retained_users: 23,
          },
          {
            date: "2025-12-03", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 232,
            D0_unique_purchase: 96,
            D0_PURCHASE_VALUE: 594,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 90,
            D0_SPORTS_BET_PLACED_USER: 52,
            D0_GAMES_BET_PLACED_USER: 58,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 46.39,
            D0_GAMES_BET_FLOW: 3078.51,
            D0_TOTAL_BET_FLOW: 3124.9,

            // 付费 & 投注（D7）
            D7_unique_purchase: 110,
            D7_PURCHASE_VALUE: 2021.15,
            D7_TOTAL_BET_PLACED_USER: 113,
            D7_SPORTS_BET_PLACED_USER: 72,
            D7_GAMES_BET_PLACED_USER: 85,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 262.24,
            D7_GAMES_BET_FLOW: 8983.6,
            D7_TOTAL_BET_FLOW: 9245.84,

            // 留存
            D1_retained_users: 98,
            D7_retained_users: 43,
          },
          {
            date: "2025-12-03", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 2287,
            D0_unique_purchase: 602,
            D0_PURCHASE_VALUE: 5736.74,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 603,
            D0_SPORTS_BET_PLACED_USER: 172,
            D0_GAMES_BET_PLACED_USER: 521,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 698.34,
            D0_GAMES_BET_FLOW: 36857.69,
            D0_TOTAL_BET_FLOW: 37556.03,

            // 付费 & 投注（D7）
            D7_unique_purchase: 871,
            D7_PURCHASE_VALUE: 8522.44,
            D7_TOTAL_BET_PLACED_USER: 899,
            D7_SPORTS_BET_PLACED_USER: 310,
            D7_GAMES_BET_PLACED_USER: 765,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1674.71,
            D7_GAMES_BET_FLOW: 48111.27,
            D7_TOTAL_BET_FLOW: 49785.98,

            // 留存
            D1_retained_users: 730,
            D7_retained_users: 128,
          },
          {
            date: "2025-12-03", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1494,
            D0_unique_purchase: 570,
            D0_PURCHASE_VALUE: 1666.77,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 522,
            D0_SPORTS_BET_PLACED_USER: 315,
            D0_GAMES_BET_PLACED_USER: 296,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 1226.43,
            D0_GAMES_BET_FLOW: 8735.16,
            D0_TOTAL_BET_FLOW: 9961.6,

            // 付费 & 投注（D7）
            D7_unique_purchase: 711,
            D7_PURCHASE_VALUE: 6973.7,
            D7_TOTAL_BET_PLACED_USER: 707,
            D7_SPORTS_BET_PLACED_USER: 456,
            D7_GAMES_BET_PLACED_USER: 434,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 3506.49,
            D7_GAMES_BET_FLOW: 36271.43,
            D7_TOTAL_BET_FLOW: 39777.92,

            // 留存
            D1_retained_users: 601,
            D7_retained_users: 184,
          },
          {
            date: "2025-12-03", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 809,
            D0_unique_purchase: 224,
            D0_PURCHASE_VALUE: 700.35,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 237,
            D0_SPORTS_BET_PLACED_USER: 127,
            D0_GAMES_BET_PLACED_USER: 150,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 89.93,
            D0_GAMES_BET_FLOW: 2157.27,
            D0_TOTAL_BET_FLOW: 2247.2,

            // 付费 & 投注（D7）
            D7_unique_purchase: 323,
            D7_PURCHASE_VALUE: 2573.88,
            D7_TOTAL_BET_PLACED_USER: 330,
            D7_SPORTS_BET_PLACED_USER: 164,
            D7_GAMES_BET_PLACED_USER: 242,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 209.67,
            D7_GAMES_BET_FLOW: 9320.96,
            D7_TOTAL_BET_FLOW: 9530.63,

            // 留存
            D1_retained_users: 323,
            D7_retained_users: 67,
          },
          {
            date: "2025-12-03", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 275,
            D0_unique_purchase: 74,
            D0_PURCHASE_VALUE: 229.4,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 75,
            D0_SPORTS_BET_PLACED_USER: 41,
            D0_GAMES_BET_PLACED_USER: 40,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 38.24,
            D0_GAMES_BET_FLOW: 1018.48,
            D0_TOTAL_BET_FLOW: 1056.72,

            // 付费 & 投注（D7）
            D7_unique_purchase: 100,
            D7_PURCHASE_VALUE: 1624.13,
            D7_TOTAL_BET_PLACED_USER: 116,
            D7_SPORTS_BET_PLACED_USER: 69,
            D7_GAMES_BET_PLACED_USER: 74,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 678.13,
            D7_GAMES_BET_FLOW: 6470.02,
            D7_TOTAL_BET_FLOW: 7148.14,

            // 留存
            D1_retained_users: 115,
            D7_retained_users: 29,
          },
          {
            date: "2025-12-04", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 244,
            D0_unique_purchase: 121,
            D0_PURCHASE_VALUE: 531.46,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 109,
            D0_SPORTS_BET_PLACED_USER: 57,
            D0_GAMES_BET_PLACED_USER: 77,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 34.64,
            D0_GAMES_BET_FLOW: 2384.14,
            D0_TOTAL_BET_FLOW: 2418.78,

            // 付费 & 投注（D7）
            D7_unique_purchase: 142,
            D7_PURCHASE_VALUE: 1473.77,
            D7_TOTAL_BET_PLACED_USER: 138,
            D7_SPORTS_BET_PLACED_USER: 85,
            D7_GAMES_BET_PLACED_USER: 103,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 123.12,
            D7_GAMES_BET_FLOW: 6421.09,
            D7_TOTAL_BET_FLOW: 6544.22,

            // 留存
            D1_retained_users: 105,
            D7_retained_users: 35,
          },
          {
            date: "2025-12-04", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 2865,
            D0_unique_purchase: 730,
            D0_PURCHASE_VALUE: 5485.46,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 730,
            D0_SPORTS_BET_PLACED_USER: 204,
            D0_GAMES_BET_PLACED_USER: 617,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 1197.12,
            D0_GAMES_BET_FLOW: 20057.08,
            D0_TOTAL_BET_FLOW: 21254.2,

            // 付费 & 投注（D7）
            D7_unique_purchase: 1051,
            D7_PURCHASE_VALUE: 8394.95,
            D7_TOTAL_BET_PLACED_USER: 1086,
            D7_SPORTS_BET_PLACED_USER: 339,
            D7_GAMES_BET_PLACED_USER: 918,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2901.73,
            D7_GAMES_BET_FLOW: 26944.89,
            D7_TOTAL_BET_FLOW: 29846.62,

            // 留存
            D1_retained_users: 975,
            D7_retained_users: 120,
          },
          {
            date: "2025-12-04", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1559,
            D0_unique_purchase: 589,
            D0_PURCHASE_VALUE: 1137.07,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 535,
            D0_SPORTS_BET_PLACED_USER: 319,
            D0_GAMES_BET_PLACED_USER: 311,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 798.1,
            D0_GAMES_BET_FLOW: 5889.96,
            D0_TOTAL_BET_FLOW: 6688.06,

            // 付费 & 投注（D7）
            D7_unique_purchase: 737,
            D7_PURCHASE_VALUE: 3585.86,
            D7_TOTAL_BET_PLACED_USER: 728,
            D7_SPORTS_BET_PLACED_USER: 485,
            D7_GAMES_BET_PLACED_USER: 441,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 4805.46,
            D7_GAMES_BET_FLOW: 14173.85,
            D7_TOTAL_BET_FLOW: 18979.31,

            // 留存
            D1_retained_users: 585,
            D7_retained_users: 152,
          },
          {
            date: "2025-12-04", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1175,
            D0_unique_purchase: 269,
            D0_PURCHASE_VALUE: 546.31,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 266,
            D0_SPORTS_BET_PLACED_USER: 112,
            D0_GAMES_BET_PLACED_USER: 203,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 92.45,
            D0_GAMES_BET_FLOW: 2271.01,
            D0_TOTAL_BET_FLOW: 2363.46,

            // 付费 & 投注（D7）
            D7_unique_purchase: 397,
            D7_PURCHASE_VALUE: 1494.99,
            D7_TOTAL_BET_PLACED_USER: 412,
            D7_SPORTS_BET_PLACED_USER: 205,
            D7_GAMES_BET_PLACED_USER: 328,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 225.62,
            D7_GAMES_BET_FLOW: 6011.74,
            D7_TOTAL_BET_FLOW: 6237.36,

            // 留存
            D1_retained_users: 292,
            D7_retained_users: 97,
          },
          {
            date: "2025-12-04", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 298,
            D0_unique_purchase: 57,
            D0_PURCHASE_VALUE: 141.52,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 62,
            D0_SPORTS_BET_PLACED_USER: 26,
            D0_GAMES_BET_PLACED_USER: 41,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 28.83,
            D0_GAMES_BET_FLOW: 418.29,
            D0_TOTAL_BET_FLOW: 447.13,

            // 付费 & 投注（D7）
            D7_unique_purchase: 77,
            D7_PURCHASE_VALUE: 229.61,
            D7_TOTAL_BET_PLACED_USER: 118,
            D7_SPORTS_BET_PLACED_USER: 57,
            D7_GAMES_BET_PLACED_USER: 88,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 72.83,
            D7_GAMES_BET_FLOW: 744.77,
            D7_TOTAL_BET_FLOW: 817.61,

            // 留存
            D1_retained_users: 117,
            D7_retained_users: 17,
          },
          {
            date: "2025-12-05", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 344,
            D0_unique_purchase: 128,
            D0_PURCHASE_VALUE: 520.38,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 123,
            D0_SPORTS_BET_PLACED_USER: 69,
            D0_GAMES_BET_PLACED_USER: 95,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 68.4,
            D0_GAMES_BET_FLOW: 2294.98,
            D0_TOTAL_BET_FLOW: 2363.38,

            // 付费 & 投注（D7）
            D7_unique_purchase: 157,
            D7_PURCHASE_VALUE: 2515.77,
            D7_TOTAL_BET_PLACED_USER: 160,
            D7_SPORTS_BET_PLACED_USER: 104,
            D7_GAMES_BET_PLACED_USER: 121,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 428.92,
            D7_GAMES_BET_FLOW: 10098.69,
            D7_TOTAL_BET_FLOW: 10527.61,

            // 留存
            D1_retained_users: 129,
            D7_retained_users: 44,
          },
          {
            date: "2025-12-05", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 2545,
            D0_unique_purchase: 596,
            D0_PURCHASE_VALUE: 1702.47,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 582,
            D0_SPORTS_BET_PLACED_USER: 146,
            D0_GAMES_BET_PLACED_USER: 494,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 503.83,
            D0_GAMES_BET_FLOW: 4736.27,
            D0_TOTAL_BET_FLOW: 5240.11,

            // 付费 & 投注（D7）
            D7_unique_purchase: 843,
            D7_PURCHASE_VALUE: 5167.32,
            D7_TOTAL_BET_PLACED_USER: 898,
            D7_SPORTS_BET_PLACED_USER: 348,
            D7_GAMES_BET_PLACED_USER: 708,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1258.98,
            D7_GAMES_BET_FLOW: 16682.04,
            D7_TOTAL_BET_FLOW: 17941.02,

            // 留存
            D1_retained_users: 773,
            D7_retained_users: 137,
          },
          {
            date: "2025-12-05", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1444,
            D0_unique_purchase: 501,
            D0_PURCHASE_VALUE: 738.26,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 447,
            D0_SPORTS_BET_PLACED_USER: 275,
            D0_GAMES_BET_PLACED_USER: 275,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 216.3,
            D0_GAMES_BET_FLOW: 3589.23,
            D0_TOTAL_BET_FLOW: 3805.53,

            // 付费 & 投注（D7）
            D7_unique_purchase: 638,
            D7_PURCHASE_VALUE: 10695.93,
            D7_TOTAL_BET_PLACED_USER: 632,
            D7_SPORTS_BET_PLACED_USER: 441,
            D7_GAMES_BET_PLACED_USER: 395,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 4711.09,
            D7_GAMES_BET_FLOW: 28278.22,
            D7_TOTAL_BET_FLOW: 32989.31,

            // 留存
            D1_retained_users: 567,
            D7_retained_users: 136,
          },
          {
            date: "2025-12-05", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1009,
            D0_unique_purchase: 195,
            D0_PURCHASE_VALUE: 420.84,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 206,
            D0_SPORTS_BET_PLACED_USER: 79,
            D0_GAMES_BET_PLACED_USER: 159,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 31.99,
            D0_GAMES_BET_FLOW: 1981.06,
            D0_TOTAL_BET_FLOW: 2013.05,

            // 付费 & 投注（D7）
            D7_unique_purchase: 343,
            D7_PURCHASE_VALUE: 1361.71,
            D7_TOTAL_BET_PLACED_USER: 371,
            D7_SPORTS_BET_PLACED_USER: 201,
            D7_GAMES_BET_PLACED_USER: 253,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 254.64,
            D7_GAMES_BET_FLOW: 7504.4,
            D7_TOTAL_BET_FLOW: 7759.04,

            // 留存
            D1_retained_users: 283,
            D7_retained_users: 62,
          },
          {
            date: "2025-12-05", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 260,
            D0_unique_purchase: 41,
            D0_PURCHASE_VALUE: 188.35,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 41,
            D0_SPORTS_BET_PLACED_USER: 21,
            D0_GAMES_BET_PLACED_USER: 23,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 14.84,
            D0_GAMES_BET_FLOW: 464.55,
            D0_TOTAL_BET_FLOW: 479.39,

            // 付费 & 投注（D7）
            D7_unique_purchase: 52,
            D7_PURCHASE_VALUE: 420.16,
            D7_TOTAL_BET_PLACED_USER: 77,
            D7_SPORTS_BET_PLACED_USER: 45,
            D7_GAMES_BET_PLACED_USER: 53,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 187.8,
            D7_GAMES_BET_FLOW: 1239.14,
            D7_TOTAL_BET_FLOW: 1426.94,

            // 留存
            D1_retained_users: 116,
            D7_retained_users: 17,
          },
          {
            date: "2025-12-06", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 342,
            D0_unique_purchase: 149,
            D0_PURCHASE_VALUE: 782.15,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 145,
            D0_SPORTS_BET_PLACED_USER: 79,
            D0_GAMES_BET_PLACED_USER: 105,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 158.33,
            D0_GAMES_BET_FLOW: 4036.7,
            D0_TOTAL_BET_FLOW: 4195.03,

            // 付费 & 投注（D7）
            D7_unique_purchase: 185,
            D7_PURCHASE_VALUE: 2797.69,
            D7_TOTAL_BET_PLACED_USER: 186,
            D7_SPORTS_BET_PLACED_USER: 117,
            D7_GAMES_BET_PLACED_USER: 136,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 768.12,
            D7_GAMES_BET_FLOW: 12646.88,
            D7_TOTAL_BET_FLOW: 13415,

            // 留存
            D1_retained_users: 147,
            D7_retained_users: 66,
          },
          {
            date: "2025-12-06", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1878,
            D0_unique_purchase: 455,
            D0_PURCHASE_VALUE: 3607.59,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 461,
            D0_SPORTS_BET_PLACED_USER: 146,
            D0_GAMES_BET_PLACED_USER: 385,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 341.56,
            D0_GAMES_BET_FLOW: 17623.55,
            D0_TOTAL_BET_FLOW: 17965.11,

            // 付费 & 投注（D7）
            D7_unique_purchase: 685,
            D7_PURCHASE_VALUE: 6499.12,
            D7_TOTAL_BET_PLACED_USER: 765,
            D7_SPORTS_BET_PLACED_USER: 296,
            D7_GAMES_BET_PLACED_USER: 621,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 827.16,
            D7_GAMES_BET_FLOW: 35394,
            D7_TOTAL_BET_FLOW: 36221.16,

            // 留存
            D1_retained_users: 720,
            D7_retained_users: 136,
          },
          {
            date: "2025-12-06", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1482,
            D0_unique_purchase: 521,
            D0_PURCHASE_VALUE: 1710.33,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 480,
            D0_SPORTS_BET_PLACED_USER: 313,
            D0_GAMES_BET_PLACED_USER: 262,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 1456.04,
            D0_GAMES_BET_FLOW: 1809.57,
            D0_TOTAL_BET_FLOW: 3265.6,

            // 付费 & 投注（D7）
            D7_unique_purchase: 650,
            D7_PURCHASE_VALUE: 3704.01,
            D7_TOTAL_BET_PLACED_USER: 658,
            D7_SPORTS_BET_PLACED_USER: 443,
            D7_GAMES_BET_PLACED_USER: 402,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 3433.35,
            D7_GAMES_BET_FLOW: 11003.08,
            D7_TOTAL_BET_FLOW: 14436.42,

            // 留存
            D1_retained_users: 541,
            D7_retained_users: 147,
          },
          {
            date: "2025-12-06", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1041,
            D0_unique_purchase: 259,
            D0_PURCHASE_VALUE: 595.92,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 261,
            D0_SPORTS_BET_PLACED_USER: 134,
            D0_GAMES_BET_PLACED_USER: 180,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 179.13,
            D0_GAMES_BET_FLOW: 1629.78,
            D0_TOTAL_BET_FLOW: 1808.91,

            // 付费 & 投注（D7）
            D7_unique_purchase: 393,
            D7_PURCHASE_VALUE: 1620.51,
            D7_TOTAL_BET_PLACED_USER: 408,
            D7_SPORTS_BET_PLACED_USER: 217,
            D7_GAMES_BET_PLACED_USER: 288,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 332.21,
            D7_GAMES_BET_FLOW: 6621.49,
            D7_TOTAL_BET_FLOW: 6953.7,

            // 留存
            D1_retained_users: 339,
            D7_retained_users: 87,
          },
          {
            date: "2025-12-06", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 318,
            D0_unique_purchase: 79,
            D0_PURCHASE_VALUE: 291.04,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 80,
            D0_SPORTS_BET_PLACED_USER: 44,
            D0_GAMES_BET_PLACED_USER: 50,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 81.74,
            D0_GAMES_BET_FLOW: 1037.11,
            D0_TOTAL_BET_FLOW: 1118.85,

            // 付费 & 投注（D7）
            D7_unique_purchase: 97,
            D7_PURCHASE_VALUE: 475.02,
            D7_TOTAL_BET_PLACED_USER: 106,
            D7_SPORTS_BET_PLACED_USER: 75,
            D7_GAMES_BET_PLACED_USER: 72,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 163.89,
            D7_GAMES_BET_FLOW: 1802.27,
            D7_TOTAL_BET_FLOW: 1966.16,

            // 留存
            D1_retained_users: 125,
            D7_retained_users: 28,
          },
          {
            date: "2025-12-07", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 307,
            D0_unique_purchase: 149,
            D0_PURCHASE_VALUE: 765.62,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 143,
            D0_SPORTS_BET_PLACED_USER: 79,
            D0_GAMES_BET_PLACED_USER: 92,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 52.58,
            D0_GAMES_BET_FLOW: 13106.44,
            D0_TOTAL_BET_FLOW: 13159.02,

            // 付费 & 投注（D7）
            D7_unique_purchase: 178,
            D7_PURCHASE_VALUE: 5104.62,
            D7_TOTAL_BET_PLACED_USER: 180,
            D7_SPORTS_BET_PLACED_USER: 115,
            D7_GAMES_BET_PLACED_USER: 125,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 262.91,
            D7_GAMES_BET_FLOW: 39127.15,
            D7_TOTAL_BET_FLOW: 39390.06,

            // 留存
            D1_retained_users: 122,
            D7_retained_users: 60,
          },
          {
            date: "2025-12-07", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1754,
            D0_unique_purchase: 540,
            D0_PURCHASE_VALUE: 1795.14,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 547,
            D0_SPORTS_BET_PLACED_USER: 140,
            D0_GAMES_BET_PLACED_USER: 467,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 326.89,
            D0_GAMES_BET_FLOW: 11762.93,
            D0_TOTAL_BET_FLOW: 12089.82,

            // 付费 & 投注（D7）
            D7_unique_purchase: 745,
            D7_PURCHASE_VALUE: 5356.53,
            D7_TOTAL_BET_PLACED_USER: 793,
            D7_SPORTS_BET_PLACED_USER: 295,
            D7_GAMES_BET_PLACED_USER: 639,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1270.38,
            D7_GAMES_BET_FLOW: 32092.79,
            D7_TOTAL_BET_FLOW: 33363.16,

            // 留存
            D1_retained_users: 638,
            D7_retained_users: 135,
          },
          {
            date: "2025-12-07", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1304,
            D0_unique_purchase: 502,
            D0_PURCHASE_VALUE: 638.11,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 462,
            D0_SPORTS_BET_PLACED_USER: 302,
            D0_GAMES_BET_PLACED_USER: 274,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 165.47,
            D0_GAMES_BET_FLOW: 2111.99,
            D0_TOTAL_BET_FLOW: 2277.46,

            // 付费 & 投注（D7）
            D7_unique_purchase: 631,
            D7_PURCHASE_VALUE: 10681.08,
            D7_TOTAL_BET_PLACED_USER: 622,
            D7_SPORTS_BET_PLACED_USER: 430,
            D7_GAMES_BET_PLACED_USER: 399,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 7407.57,
            D7_GAMES_BET_FLOW: 18167.82,
            D7_TOTAL_BET_FLOW: 25575.39,

            // 留存
            D1_retained_users: 444,
            D7_retained_users: 140,
          },
          {
            date: "2025-12-07", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1069,
            D0_unique_purchase: 241,
            D0_PURCHASE_VALUE: 713.69,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 280,
            D0_SPORTS_BET_PLACED_USER: 133,
            D0_GAMES_BET_PLACED_USER: 193,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 72.06,
            D0_GAMES_BET_FLOW: 2524.77,
            D0_TOTAL_BET_FLOW: 2596.83,

            // 付费 & 投注（D7）
            D7_unique_purchase: 366,
            D7_PURCHASE_VALUE: 1953.72,
            D7_TOTAL_BET_PLACED_USER: 397,
            D7_SPORTS_BET_PLACED_USER: 191,
            D7_GAMES_BET_PLACED_USER: 302,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 233.12,
            D7_GAMES_BET_FLOW: 12847.95,
            D7_TOTAL_BET_FLOW: 13081.07,

            // 留存
            D1_retained_users: 308,
            D7_retained_users: 107,
          },
          {
            date: "2025-12-07", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 247,
            D0_unique_purchase: 71,
            D0_PURCHASE_VALUE: 242.5,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 73,
            D0_SPORTS_BET_PLACED_USER: 50,
            D0_GAMES_BET_PLACED_USER: 41,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 60.54,
            D0_GAMES_BET_FLOW: 407.83,
            D0_TOTAL_BET_FLOW: 468.37,

            // 付费 & 投注（D7）
            D7_unique_purchase: 82,
            D7_PURCHASE_VALUE: 342.75,
            D7_TOTAL_BET_PLACED_USER: 99,
            D7_SPORTS_BET_PLACED_USER: 73,
            D7_GAMES_BET_PLACED_USER: 63,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 147.59,
            D7_GAMES_BET_FLOW: 766.32,
            D7_TOTAL_BET_FLOW: 913.92,

            // 留存
            D1_retained_users: 105,
            D7_retained_users: 32,
          },
          {
            date: "2025-12-08", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 283,
            D0_unique_purchase: 122,
            D0_PURCHASE_VALUE: 2050.08,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 114,
            D0_SPORTS_BET_PLACED_USER: 54,
            D0_GAMES_BET_PLACED_USER: 88,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 102.66,
            D0_GAMES_BET_FLOW: 6789.92,
            D0_TOTAL_BET_FLOW: 6892.58,

            // 付费 & 投注（D7）
            D7_unique_purchase: 160,
            D7_PURCHASE_VALUE: 5037.62,
            D7_TOTAL_BET_PLACED_USER: 163,
            D7_SPORTS_BET_PLACED_USER: 99,
            D7_GAMES_BET_PLACED_USER: 130,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 456.06,
            D7_GAMES_BET_FLOW: 19911.97,
            D7_TOTAL_BET_FLOW: 20368.03,

            // 留存
            D1_retained_users: 139,
            D7_retained_users: 42,
          },
          {
            date: "2025-12-08", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1777,
            D0_unique_purchase: 464,
            D0_PURCHASE_VALUE: 1211.24,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 476,
            D0_SPORTS_BET_PLACED_USER: 118,
            D0_GAMES_BET_PLACED_USER: 417,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 428.68,
            D0_GAMES_BET_FLOW: 5645.71,
            D0_TOTAL_BET_FLOW: 6074.39,

            // 付费 & 投注（D7）
            D7_unique_purchase: 684,
            D7_PURCHASE_VALUE: 4357.77,
            D7_TOTAL_BET_PLACED_USER: 747,
            D7_SPORTS_BET_PLACED_USER: 245,
            D7_GAMES_BET_PLACED_USER: 630,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1161.81,
            D7_GAMES_BET_FLOW: 18522.54,
            D7_TOTAL_BET_FLOW: 19684.36,

            // 留存
            D1_retained_users: 748,
            D7_retained_users: 108,
          },
          {
            date: "2025-12-08", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1493,
            D0_unique_purchase: 472,
            D0_PURCHASE_VALUE: 1026.41,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 421,
            D0_SPORTS_BET_PLACED_USER: 232,
            D0_GAMES_BET_PLACED_USER: 264,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 254.75,
            D0_GAMES_BET_FLOW: 4982.52,
            D0_TOTAL_BET_FLOW: 5237.27,

            // 付费 & 投注（D7）
            D7_unique_purchase: 602,
            D7_PURCHASE_VALUE: 2338.3,
            D7_TOTAL_BET_PLACED_USER: 593,
            D7_SPORTS_BET_PLACED_USER: 380,
            D7_GAMES_BET_PLACED_USER: 391,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 4499.15,
            D7_GAMES_BET_FLOW: 12855.04,
            D7_TOTAL_BET_FLOW: 17354.19,

            // 留存
            D1_retained_users: 508,
            D7_retained_users: 144,
          },
          {
            date: "2025-12-08", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 894,
            D0_unique_purchase: 189,
            D0_PURCHASE_VALUE: 902.15,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 225,
            D0_SPORTS_BET_PLACED_USER: 110,
            D0_GAMES_BET_PLACED_USER: 150,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 83.39,
            D0_GAMES_BET_FLOW: 2081.49,
            D0_TOTAL_BET_FLOW: 2164.88,

            // 付费 & 投注（D7）
            D7_unique_purchase: 314,
            D7_PURCHASE_VALUE: 3486.57,
            D7_TOTAL_BET_PLACED_USER: 355,
            D7_SPORTS_BET_PLACED_USER: 178,
            D7_GAMES_BET_PLACED_USER: 261,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 185.15,
            D7_GAMES_BET_FLOW: 12389.34,
            D7_TOTAL_BET_FLOW: 12574.5,

            // 留存
            D1_retained_users: 349,
            D7_retained_users: 72,
          },
          {
            date: "2025-12-08", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 226,
            D0_unique_purchase: 58,
            D0_PURCHASE_VALUE: 663.54,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 66,
            D0_SPORTS_BET_PLACED_USER: 48,
            D0_GAMES_BET_PLACED_USER: 27,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 363.58,
            D0_GAMES_BET_FLOW: 275.21,
            D0_TOTAL_BET_FLOW: 638.79,

            // 付费 & 投注（D7）
            D7_unique_purchase: 76,
            D7_PURCHASE_VALUE: 937.61,
            D7_TOTAL_BET_PLACED_USER: 91,
            D7_SPORTS_BET_PLACED_USER: 67,
            D7_GAMES_BET_PLACED_USER: 49,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 483.8,
            D7_GAMES_BET_FLOW: 1216.28,
            D7_TOTAL_BET_FLOW: 1700.08,

            // 留存
            D1_retained_users: 92,
            D7_retained_users: 32,
          },
          {
            date: "2025-12-09", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 360,
            D0_unique_purchase: 171,
            D0_PURCHASE_VALUE: 11362.92,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 167,
            D0_SPORTS_BET_PLACED_USER: 72,
            D0_GAMES_BET_PLACED_USER: 128,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 80.01,
            D0_GAMES_BET_FLOW: 10346.29,
            D0_TOTAL_BET_FLOW: 10426.3,

            // 付费 & 投注（D7）
            D7_unique_purchase: 208,
            D7_PURCHASE_VALUE: 22969.69,
            D7_TOTAL_BET_PLACED_USER: 216,
            D7_SPORTS_BET_PLACED_USER: 108,
            D7_GAMES_BET_PLACED_USER: 174,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 504.65,
            D7_GAMES_BET_FLOW: 58173.01,
            D7_TOTAL_BET_FLOW: 58677.66,

            // 留存
            D1_retained_users: 172,
            D7_retained_users: 55,
          },
          {
            date: "2025-12-09", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 2466,
            D0_unique_purchase: 610,
            D0_PURCHASE_VALUE: 1875.09,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 599,
            D0_SPORTS_BET_PLACED_USER: 185,
            D0_GAMES_BET_PLACED_USER: 484,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 750.2,
            D0_GAMES_BET_FLOW: 6122.4,
            D0_TOTAL_BET_FLOW: 6872.6,

            // 付费 & 投注（D7）
            D7_unique_purchase: 827,
            D7_PURCHASE_VALUE: 3990.38,
            D7_TOTAL_BET_PLACED_USER: 898,
            D7_SPORTS_BET_PLACED_USER: 336,
            D7_GAMES_BET_PLACED_USER: 730,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1123.83,
            D7_GAMES_BET_FLOW: 16040.65,
            D7_TOTAL_BET_FLOW: 17164.48,

            // 留存
            D1_retained_users: 942,
            D7_retained_users: 152,
          },
          {
            date: "2025-12-09", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1606,
            D0_unique_purchase: 526,
            D0_PURCHASE_VALUE: 1456.78,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 479,
            D0_SPORTS_BET_PLACED_USER: 284,
            D0_GAMES_BET_PLACED_USER: 292,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 287.01,
            D0_GAMES_BET_FLOW: 2680.36,
            D0_TOTAL_BET_FLOW: 2967.37,

            // 付费 & 投注（D7）
            D7_unique_purchase: 673,
            D7_PURCHASE_VALUE: 3998.52,
            D7_TOTAL_BET_PLACED_USER: 672,
            D7_SPORTS_BET_PLACED_USER: 450,
            D7_GAMES_BET_PLACED_USER: 435,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1321.13,
            D7_GAMES_BET_FLOW: 16704.9,
            D7_TOTAL_BET_FLOW: 18026.03,

            // 留存
            D1_retained_users: 540,
            D7_retained_users: 164,
          },
          {
            date: "2025-12-09", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1239,
            D0_unique_purchase: 277,
            D0_PURCHASE_VALUE: 541.34,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 287,
            D0_SPORTS_BET_PLACED_USER: 139,
            D0_GAMES_BET_PLACED_USER: 202,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 66.7,
            D0_GAMES_BET_FLOW: 1775.55,
            D0_TOTAL_BET_FLOW: 1842.25,

            // 付费 & 投注（D7）
            D7_unique_purchase: 385,
            D7_PURCHASE_VALUE: 1351.03,
            D7_TOTAL_BET_PLACED_USER: 412,
            D7_SPORTS_BET_PLACED_USER: 217,
            D7_GAMES_BET_PLACED_USER: 305,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 176.94,
            D7_GAMES_BET_FLOW: 6325.62,
            D7_TOTAL_BET_FLOW: 6502.56,

            // 留存
            D1_retained_users: 408,
            D7_retained_users: 84,
          },
          {
            date: "2025-12-09", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 256,
            D0_unique_purchase: 67,
            D0_PURCHASE_VALUE: 236.38,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 72,
            D0_SPORTS_BET_PLACED_USER: 58,
            D0_GAMES_BET_PLACED_USER: 27,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 60.27,
            D0_GAMES_BET_FLOW: 560.28,
            D0_TOTAL_BET_FLOW: 620.55,

            // 付费 & 投注（D7）
            D7_unique_purchase: 94,
            D7_PURCHASE_VALUE: 447.85,
            D7_TOTAL_BET_PLACED_USER: 111,
            D7_SPORTS_BET_PLACED_USER: 84,
            D7_GAMES_BET_PLACED_USER: 57,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 241.27,
            D7_GAMES_BET_FLOW: 862.67,
            D7_TOTAL_BET_FLOW: 1103.95,

            // 留存
            D1_retained_users: 117,
            D7_retained_users: 37,
          },
          {
            date: "2025-12-10", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 350,
            D0_unique_purchase: 151,
            D0_PURCHASE_VALUE: 1820.23,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 146,
            D0_SPORTS_BET_PLACED_USER: 87,
            D0_GAMES_BET_PLACED_USER: 97,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 98.96,
            D0_GAMES_BET_FLOW: 2518.81,
            D0_TOTAL_BET_FLOW: 2617.77,

            // 付费 & 投注（D7）
            D7_unique_purchase: 174,
            D7_PURCHASE_VALUE: 2989.31,
            D7_TOTAL_BET_PLACED_USER: 180,
            D7_SPORTS_BET_PLACED_USER: 115,
            D7_GAMES_BET_PLACED_USER: 127,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 513.82,
            D7_GAMES_BET_FLOW: 7152.44,
            D7_TOTAL_BET_FLOW: 7666.26,

            // 留存
            D1_retained_users: 133,
            D7_retained_users: 52,
          },
          {
            date: "2025-12-10", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 2396,
            D0_unique_purchase: 593,
            D0_PURCHASE_VALUE: 4218.48,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 595,
            D0_SPORTS_BET_PLACED_USER: 191,
            D0_GAMES_BET_PLACED_USER: 489,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 692.85,
            D0_GAMES_BET_FLOW: 54318.38,
            D0_TOTAL_BET_FLOW: 55011.23,

            // 付费 & 投注（D7）
            D7_unique_purchase: 765,
            D7_PURCHASE_VALUE: 9675.86,
            D7_TOTAL_BET_PLACED_USER: 840,
            D7_SPORTS_BET_PLACED_USER: 330,
            D7_GAMES_BET_PLACED_USER: 681,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1029.63,
            D7_GAMES_BET_FLOW: 113846.95,
            D7_TOTAL_BET_FLOW: 114876.58,

            // 留存
            D1_retained_users: 756,
            D7_retained_users: 170,
          },
          {
            date: "2025-12-10", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1916,
            D0_unique_purchase: 655,
            D0_PURCHASE_VALUE: 1925.03,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 589,
            D0_SPORTS_BET_PLACED_USER: 373,
            D0_GAMES_BET_PLACED_USER: 331,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 472.2,
            D0_GAMES_BET_FLOW: 3590.89,
            D0_TOTAL_BET_FLOW: 4063.09,

            // 付费 & 投注（D7）
            D7_unique_purchase: 812,
            D7_PURCHASE_VALUE: 4807,
            D7_TOTAL_BET_PLACED_USER: 797,
            D7_SPORTS_BET_PLACED_USER: 548,
            D7_GAMES_BET_PLACED_USER: 487,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1347.39,
            D7_GAMES_BET_FLOW: 35943.18,
            D7_TOTAL_BET_FLOW: 37290.57,

            // 留存
            D1_retained_users: 631,
            D7_retained_users: 180,
          },
          {
            date: "2025-12-10", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1178,
            D0_unique_purchase: 280,
            D0_PURCHASE_VALUE: 2323.17,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 302,
            D0_SPORTS_BET_PLACED_USER: 163,
            D0_GAMES_BET_PLACED_USER: 191,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 823.08,
            D0_GAMES_BET_FLOW: 3491.21,
            D0_TOTAL_BET_FLOW: 4314.28,

            // 付费 & 投注（D7）
            D7_unique_purchase: 416,
            D7_PURCHASE_VALUE: 4353.42,
            D7_TOTAL_BET_PLACED_USER: 451,
            D7_SPORTS_BET_PLACED_USER: 263,
            D7_GAMES_BET_PLACED_USER: 319,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1125.07,
            D7_GAMES_BET_FLOW: 16421.47,
            D7_TOTAL_BET_FLOW: 17546.53,

            // 留存
            D1_retained_users: 352,
            D7_retained_users: 118,
          },
          {
            date: "2025-12-10", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 338,
            D0_unique_purchase: 71,
            D0_PURCHASE_VALUE: 152.82,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 76,
            D0_SPORTS_BET_PLACED_USER: 53,
            D0_GAMES_BET_PLACED_USER: 35,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 45.61,
            D0_GAMES_BET_FLOW: 458.5,
            D0_TOTAL_BET_FLOW: 504.11,

            // 付费 & 投注（D7）
            D7_unique_purchase: 88,
            D7_PURCHASE_VALUE: 307.48,
            D7_TOTAL_BET_PLACED_USER: 112,
            D7_SPORTS_BET_PLACED_USER: 76,
            D7_GAMES_BET_PLACED_USER: 63,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 191.58,
            D7_GAMES_BET_FLOW: 746.77,
            D7_TOTAL_BET_FLOW: 938.36,

            // 留存
            D1_retained_users: 112,
            D7_retained_users: 30,
          },
          {
            date: "2025-12-11", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 306,
            D0_unique_purchase: 142,
            D0_PURCHASE_VALUE: 3647.38,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 138,
            D0_SPORTS_BET_PLACED_USER: 53,
            D0_GAMES_BET_PLACED_USER: 108,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 328.55,
            D0_GAMES_BET_FLOW: 2071.4,
            D0_TOTAL_BET_FLOW: 2399.94,

            // 付费 & 投注（D7）
            D7_unique_purchase: 167,
            D7_PURCHASE_VALUE: 4870.62,
            D7_TOTAL_BET_PLACED_USER: 165,
            D7_SPORTS_BET_PLACED_USER: 82,
            D7_GAMES_BET_PLACED_USER: 134,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1202.03,
            D7_GAMES_BET_FLOW: 7561.16,
            D7_TOTAL_BET_FLOW: 8763.19,

            // 留存
            D1_retained_users: 116,
            D7_retained_users: 43,
          },
          {
            date: "2025-12-11", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1171,
            D0_unique_purchase: 318,
            D0_PURCHASE_VALUE: 678.16,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 337,
            D0_SPORTS_BET_PLACED_USER: 90,
            D0_GAMES_BET_PLACED_USER: 285,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 92.11,
            D0_GAMES_BET_FLOW: 22041.35,
            D0_TOTAL_BET_FLOW: 22133.45,

            // 付费 & 投注（D7）
            D7_unique_purchase: 429,
            D7_PURCHASE_VALUE: 1577.89,
            D7_TOTAL_BET_PLACED_USER: 471,
            D7_SPORTS_BET_PLACED_USER: 160,
            D7_GAMES_BET_PLACED_USER: 403,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 200.37,
            D7_GAMES_BET_FLOW: 27650.16,
            D7_TOTAL_BET_FLOW: 27850.53,

            // 留存
            D1_retained_users: 417,
            D7_retained_users: 106,
          },
          {
            date: "2025-12-11", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1815,
            D0_unique_purchase: 628,
            D0_PURCHASE_VALUE: 3039.65,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 553,
            D0_SPORTS_BET_PLACED_USER: 336,
            D0_GAMES_BET_PLACED_USER: 341,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 881.6,
            D0_GAMES_BET_FLOW: 11096.34,
            D0_TOTAL_BET_FLOW: 11977.95,

            // 付费 & 投注（D7）
            D7_unique_purchase: 784,
            D7_PURCHASE_VALUE: 13291.49,
            D7_TOTAL_BET_PLACED_USER: 745,
            D7_SPORTS_BET_PLACED_USER: 492,
            D7_GAMES_BET_PLACED_USER: 490,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 4979.75,
            D7_GAMES_BET_FLOW: 43600.13,
            D7_TOTAL_BET_FLOW: 48579.88,

            // 留存
            D1_retained_users: 569,
            D7_retained_users: 183,
          },
          {
            date: "2025-12-11", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1447,
            D0_unique_purchase: 376,
            D0_PURCHASE_VALUE: 1268.91,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 373,
            D0_SPORTS_BET_PLACED_USER: 208,
            D0_GAMES_BET_PLACED_USER: 241,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 145.1,
            D0_GAMES_BET_FLOW: 3589.24,
            D0_TOTAL_BET_FLOW: 3734.34,

            // 付费 & 投注（D7）
            D7_unique_purchase: 517,
            D7_PURCHASE_VALUE: 3939.17,
            D7_TOTAL_BET_PLACED_USER: 550,
            D7_SPORTS_BET_PLACED_USER: 365,
            D7_GAMES_BET_PLACED_USER: 340,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 599.58,
            D7_GAMES_BET_FLOW: 15572.51,
            D7_TOTAL_BET_FLOW: 16172.09,

            // 留存
            D1_retained_users: 423,
            D7_retained_users: 100,
          },
          {
            date: "2025-12-11", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 151,
            D0_unique_purchase: 43,
            D0_PURCHASE_VALUE: 157.07,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 49,
            D0_SPORTS_BET_PLACED_USER: 36,
            D0_GAMES_BET_PLACED_USER: 25,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 82.42,
            D0_GAMES_BET_FLOW: 266.94,
            D0_TOTAL_BET_FLOW: 349.36,

            // 付费 & 投注（D7）
            D7_unique_purchase: 52,
            D7_PURCHASE_VALUE: 326.03,
            D7_TOTAL_BET_PLACED_USER: 65,
            D7_SPORTS_BET_PLACED_USER: 54,
            D7_GAMES_BET_PLACED_USER: 37,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 293.57,
            D7_GAMES_BET_FLOW: 568.95,
            D7_TOTAL_BET_FLOW: 862.53,

            // 留存
            D1_retained_users: 60,
            D7_retained_users: 26,
          },
          {
            date: "2025-12-12", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 244,
            D0_unique_purchase: 113,
            D0_PURCHASE_VALUE: 1050.69,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 109,
            D0_SPORTS_BET_PLACED_USER: 63,
            D0_GAMES_BET_PLACED_USER: 70,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 124.08,
            D0_GAMES_BET_FLOW: 2217.64,
            D0_TOTAL_BET_FLOW: 2341.71,

            // 付费 & 投注（D7）
            D7_unique_purchase: 141,
            D7_PURCHASE_VALUE: 5505.08,
            D7_TOTAL_BET_PLACED_USER: 143,
            D7_SPORTS_BET_PLACED_USER: 98,
            D7_GAMES_BET_PLACED_USER: 99,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 295.3,
            D7_GAMES_BET_FLOW: 14764.58,
            D7_TOTAL_BET_FLOW: 15059.88,

            // 留存
            D1_retained_users: 118,
            D7_retained_users: 41,
          },
          {
            date: "2025-12-12", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 984,
            D0_unique_purchase: 271,
            D0_PURCHASE_VALUE: 756.61,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 276,
            D0_SPORTS_BET_PLACED_USER: 64,
            D0_GAMES_BET_PLACED_USER: 244,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 28.62,
            D0_GAMES_BET_FLOW: 8785.9,
            D0_TOTAL_BET_FLOW: 8814.51,

            // 付费 & 投注（D7）
            D7_unique_purchase: 378,
            D7_PURCHASE_VALUE: 3603.26,
            D7_TOTAL_BET_PLACED_USER: 399,
            D7_SPORTS_BET_PLACED_USER: 140,
            D7_GAMES_BET_PLACED_USER: 354,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 129.1,
            D7_GAMES_BET_FLOW: 22857.34,
            D7_TOTAL_BET_FLOW: 22986.44,

            // 留存
            D1_retained_users: 369,
            D7_retained_users: 92,
          },
          {
            date: "2025-12-12", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1539,
            D0_unique_purchase: 599,
            D0_PURCHASE_VALUE: 733.38,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 541,
            D0_SPORTS_BET_PLACED_USER: 311,
            D0_GAMES_BET_PLACED_USER: 338,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 1420.57,
            D0_GAMES_BET_FLOW: 3428.7,
            D0_TOTAL_BET_FLOW: 4849.27,

            // 付费 & 投注（D7）
            D7_unique_purchase: 754,
            D7_PURCHASE_VALUE: 4312.68,
            D7_TOTAL_BET_PLACED_USER: 736,
            D7_SPORTS_BET_PLACED_USER: 474,
            D7_GAMES_BET_PLACED_USER: 473,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 4394.55,
            D7_GAMES_BET_FLOW: 13240.34,
            D7_TOTAL_BET_FLOW: 17634.9,

            // 留存
            D1_retained_users: 526,
            D7_retained_users: 163,
          },
          {
            date: "2025-12-12", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 906,
            D0_unique_purchase: 234,
            D0_PURCHASE_VALUE: 514.5,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 231,
            D0_SPORTS_BET_PLACED_USER: 98,
            D0_GAMES_BET_PLACED_USER: 177,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 118.09,
            D0_GAMES_BET_FLOW: 2326.28,
            D0_TOTAL_BET_FLOW: 2444.38,

            // 付费 & 投注（D7）
            D7_unique_purchase: 340,
            D7_PURCHASE_VALUE: 2557.12,
            D7_TOTAL_BET_PLACED_USER: 366,
            D7_SPORTS_BET_PLACED_USER: 207,
            D7_GAMES_BET_PLACED_USER: 257,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 589.52,
            D7_GAMES_BET_FLOW: 10218.39,
            D7_TOTAL_BET_FLOW: 10807.91,

            // 留存
            D1_retained_users: 304,
            D7_retained_users: 87,
          },
          {
            date: "2025-12-12", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 141,
            D0_unique_purchase: 41,
            D0_PURCHASE_VALUE: 139.4,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 43,
            D0_SPORTS_BET_PLACED_USER: 26,
            D0_GAMES_BET_PLACED_USER: 23,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 21.7,
            D0_GAMES_BET_FLOW: 1400.04,
            D0_TOTAL_BET_FLOW: 1421.74,

            // 付费 & 投注（D7）
            D7_unique_purchase: 47,
            D7_PURCHASE_VALUE: 3595.76,
            D7_TOTAL_BET_PLACED_USER: 56,
            D7_SPORTS_BET_PLACED_USER: 37,
            D7_GAMES_BET_PLACED_USER: 36,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 167.76,
            D7_GAMES_BET_FLOW: 33158.07,
            D7_TOTAL_BET_FLOW: 33325.83,

            // 留存
            D1_retained_users: 55,
            D7_retained_users: 15,
          },
          {
            date: "2025-12-13", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 300,
            D0_unique_purchase: 141,
            D0_PURCHASE_VALUE: 433.38,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 136,
            D0_SPORTS_BET_PLACED_USER: 80,
            D0_GAMES_BET_PLACED_USER: 92,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 59.05,
            D0_GAMES_BET_FLOW: 1302.76,
            D0_TOTAL_BET_FLOW: 1361.82,

            // 付费 & 投注（D7）
            D7_unique_purchase: 170,
            D7_PURCHASE_VALUE: 2479.69,
            D7_TOTAL_BET_PLACED_USER: 172,
            D7_SPORTS_BET_PLACED_USER: 117,
            D7_GAMES_BET_PLACED_USER: 126,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 550.14,
            D7_GAMES_BET_FLOW: 12294.63,
            D7_TOTAL_BET_FLOW: 12844.77,

            // 留存
            D1_retained_users: 153,
            D7_retained_users: 58,
          },
          {
            date: "2025-12-13", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1129,
            D0_unique_purchase: 389,
            D0_PURCHASE_VALUE: 863.04,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 372,
            D0_SPORTS_BET_PLACED_USER: 121,
            D0_GAMES_BET_PLACED_USER: 308,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 335.29,
            D0_GAMES_BET_FLOW: 6982.64,
            D0_TOTAL_BET_FLOW: 7317.93,

            // 付费 & 投注（D7）
            D7_unique_purchase: 499,
            D7_PURCHASE_VALUE: 3722.69,
            D7_TOTAL_BET_PLACED_USER: 534,
            D7_SPORTS_BET_PLACED_USER: 232,
            D7_GAMES_BET_PLACED_USER: 430,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 491,
            D7_GAMES_BET_FLOW: 21150.14,
            D7_TOTAL_BET_FLOW: 21641.14,

            // 留存
            D1_retained_users: 451,
            D7_retained_users: 157,
          },
          {
            date: "2025-12-13", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1532,
            D0_unique_purchase: 594,
            D0_PURCHASE_VALUE: 2141.1,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 543,
            D0_SPORTS_BET_PLACED_USER: 346,
            D0_GAMES_BET_PLACED_USER: 303,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 1712.95,
            D0_GAMES_BET_FLOW: 2951.51,
            D0_TOTAL_BET_FLOW: 4664.46,

            // 付费 & 投注（D7）
            D7_unique_purchase: 726,
            D7_PURCHASE_VALUE: 4925.09,
            D7_TOTAL_BET_PLACED_USER: 716,
            D7_SPORTS_BET_PLACED_USER: 485,
            D7_GAMES_BET_PLACED_USER: 440,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 3527.07,
            D7_GAMES_BET_FLOW: 13392.09,
            D7_TOTAL_BET_FLOW: 16919.16,

            // 留存
            D1_retained_users: 583,
            D7_retained_users: 162,
          },
          {
            date: "2025-12-13", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 943,
            D0_unique_purchase: 272,
            D0_PURCHASE_VALUE: 827.48,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 275,
            D0_SPORTS_BET_PLACED_USER: 158,
            D0_GAMES_BET_PLACED_USER: 171,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 133.5,
            D0_GAMES_BET_FLOW: 2608.38,
            D0_TOTAL_BET_FLOW: 2741.88,

            // 付费 & 投注（D7）
            D7_unique_purchase: 382,
            D7_PURCHASE_VALUE: 1962.45,
            D7_TOTAL_BET_PLACED_USER: 404,
            D7_SPORTS_BET_PLACED_USER: 231,
            D7_GAMES_BET_PLACED_USER: 283,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 303.14,
            D7_GAMES_BET_FLOW: 7160.58,
            D7_TOTAL_BET_FLOW: 7463.72,

            // 留存
            D1_retained_users: 392,
            D7_retained_users: 101,
          },
          {
            date: "2025-12-13", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 203,
            D0_unique_purchase: 62,
            D0_PURCHASE_VALUE: 177.75,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 67,
            D0_SPORTS_BET_PLACED_USER: 50,
            D0_GAMES_BET_PLACED_USER: 26,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 53.48,
            D0_GAMES_BET_FLOW: 901.52,
            D0_TOTAL_BET_FLOW: 955,

            // 付费 & 投注（D7）
            D7_unique_purchase: 77,
            D7_PURCHASE_VALUE: 444.89,
            D7_TOTAL_BET_PLACED_USER: 89,
            D7_SPORTS_BET_PLACED_USER: 66,
            D7_GAMES_BET_PLACED_USER: 48,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 113.86,
            D7_GAMES_BET_FLOW: 3341.96,
            D7_TOTAL_BET_FLOW: 3455.81,

            // 留存
            D1_retained_users: 90,
            D7_retained_users: 21,
          },
          {
            date: "2025-12-14", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 321,
            D0_unique_purchase: 160,
            D0_PURCHASE_VALUE: 1201.54,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 156,
            D0_SPORTS_BET_PLACED_USER: 98,
            D0_GAMES_BET_PLACED_USER: 101,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 149.38,
            D0_GAMES_BET_FLOW: 7248.62,
            D0_TOTAL_BET_FLOW: 7398,

            // 付费 & 投注（D7）
            D7_unique_purchase: 184,
            D7_PURCHASE_VALUE: 3558.69,
            D7_TOTAL_BET_PLACED_USER: 190,
            D7_SPORTS_BET_PLACED_USER: 125,
            D7_GAMES_BET_PLACED_USER: 136,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 536.49,
            D7_GAMES_BET_FLOW: 17333.24,
            D7_TOTAL_BET_FLOW: 17869.73,

            // 留存
            D1_retained_users: 129,
            D7_retained_users: 59,
          },
          {
            date: "2025-12-14", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1369,
            D0_unique_purchase: 389,
            D0_PURCHASE_VALUE: 2535.77,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 402,
            D0_SPORTS_BET_PLACED_USER: 129,
            D0_GAMES_BET_PLACED_USER: 326,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 156.91,
            D0_GAMES_BET_FLOW: 41603.76,
            D0_TOTAL_BET_FLOW: 41760.67,

            // 付费 & 投注（D7）
            D7_unique_purchase: 503,
            D7_PURCHASE_VALUE: 10935.23,
            D7_TOTAL_BET_PLACED_USER: 551,
            D7_SPORTS_BET_PLACED_USER: 185,
            D7_GAMES_BET_PLACED_USER: 470,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 310.74,
            D7_GAMES_BET_FLOW: 108850.65,
            D7_TOTAL_BET_FLOW: 109161.39,

            // 留存
            D1_retained_users: 516,
            D7_retained_users: 136,
          },
          {
            date: "2025-12-14", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1556,
            D0_unique_purchase: 600,
            D0_PURCHASE_VALUE: 1427.18,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 536,
            D0_SPORTS_BET_PLACED_USER: 336,
            D0_GAMES_BET_PLACED_USER: 316,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 463.55,
            D0_GAMES_BET_FLOW: 6789.59,
            D0_TOTAL_BET_FLOW: 7253.14,

            // 付费 & 投注（D7）
            D7_unique_purchase: 730,
            D7_PURCHASE_VALUE: 3831.75,
            D7_TOTAL_BET_PLACED_USER: 732,
            D7_SPORTS_BET_PLACED_USER: 473,
            D7_GAMES_BET_PLACED_USER: 472,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2084.06,
            D7_GAMES_BET_FLOW: 20046.34,
            D7_TOTAL_BET_FLOW: 22130.39,

            // 留存
            D1_retained_users: 551,
            D7_retained_users: 140,
          },
          {
            date: "2025-12-14", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 988,
            D0_unique_purchase: 318,
            D0_PURCHASE_VALUE: 789.15,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 342,
            D0_SPORTS_BET_PLACED_USER: 197,
            D0_GAMES_BET_PLACED_USER: 215,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 113.43,
            D0_GAMES_BET_FLOW: 2796.17,
            D0_TOTAL_BET_FLOW: 2909.59,

            // 付费 & 投注（D7）
            D7_unique_purchase: 419,
            D7_PURCHASE_VALUE: 2756.22,
            D7_TOTAL_BET_PLACED_USER: 452,
            D7_SPORTS_BET_PLACED_USER: 265,
            D7_GAMES_BET_PLACED_USER: 319,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 437.27,
            D7_GAMES_BET_FLOW: 13568.69,
            D7_TOTAL_BET_FLOW: 14005.97,

            // 留存
            D1_retained_users: 373,
            D7_retained_users: 122,
          },
          {
            date: "2025-12-14", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 324,
            D0_unique_purchase: 76,
            D0_PURCHASE_VALUE: 161.15,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 76,
            D0_SPORTS_BET_PLACED_USER: 47,
            D0_GAMES_BET_PLACED_USER: 47,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 51.7,
            D0_GAMES_BET_FLOW: 320.89,
            D0_TOTAL_BET_FLOW: 372.6,

            // 付费 & 投注（D7）
            D7_unique_purchase: 102,
            D7_PURCHASE_VALUE: 514.53,
            D7_TOTAL_BET_PLACED_USER: 127,
            D7_SPORTS_BET_PLACED_USER: 80,
            D7_GAMES_BET_PLACED_USER: 81,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 165.89,
            D7_GAMES_BET_FLOW: 2398.65,
            D7_TOTAL_BET_FLOW: 2564.54,

            // 留存
            D1_retained_users: 109,
            D7_retained_users: 28,
          },
          {
            date: "2025-12-15", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 275,
            D0_unique_purchase: 128,
            D0_PURCHASE_VALUE: 1284.46,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 123,
            D0_SPORTS_BET_PLACED_USER: 69,
            D0_GAMES_BET_PLACED_USER: 93,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 58.63,
            D0_GAMES_BET_FLOW: 6493.64,
            D0_TOTAL_BET_FLOW: 6552.27,

            // 付费 & 投注（D7）
            D7_unique_purchase: 155,
            D7_PURCHASE_VALUE: 4140.92,
            D7_TOTAL_BET_PLACED_USER: 153,
            D7_SPORTS_BET_PLACED_USER: 97,
            D7_GAMES_BET_PLACED_USER: 120,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 278.41,
            D7_GAMES_BET_FLOW: 17231.97,
            D7_TOTAL_BET_FLOW: 17510.38,

            // 留存
            D1_retained_users: 132,
            D7_retained_users: 44,
          },
          {
            date: "2025-12-15", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1827,
            D0_unique_purchase: 471,
            D0_PURCHASE_VALUE: 1525.14,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 456,
            D0_SPORTS_BET_PLACED_USER: 126,
            D0_GAMES_BET_PLACED_USER: 366,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 501.28,
            D0_GAMES_BET_FLOW: 5380.5,
            D0_TOTAL_BET_FLOW: 5881.77,

            // 付费 & 投注（D7）
            D7_unique_purchase: 627,
            D7_PURCHASE_VALUE: 2936.56,
            D7_TOTAL_BET_PLACED_USER: 672,
            D7_SPORTS_BET_PLACED_USER: 211,
            D7_GAMES_BET_PLACED_USER: 563,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 623.96,
            D7_GAMES_BET_FLOW: 14742.97,
            D7_TOTAL_BET_FLOW: 15366.94,

            // 留存
            D1_retained_users: 599,
            D7_retained_users: 122,
          },
          {
            date: "2025-12-15", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1591,
            D0_unique_purchase: 615,
            D0_PURCHASE_VALUE: 1706.23,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 543,
            D0_SPORTS_BET_PLACED_USER: 318,
            D0_GAMES_BET_PLACED_USER: 340,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 296.44,
            D0_GAMES_BET_FLOW: 10883.84,
            D0_TOTAL_BET_FLOW: 11180.28,

            // 付费 & 投注（D7）
            D7_unique_purchase: 737,
            D7_PURCHASE_VALUE: 4350.7,
            D7_TOTAL_BET_PLACED_USER: 721,
            D7_SPORTS_BET_PLACED_USER: 447,
            D7_GAMES_BET_PLACED_USER: 481,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 796.85,
            D7_GAMES_BET_FLOW: 24208.52,
            D7_TOTAL_BET_FLOW: 25005.37,

            // 留存
            D1_retained_users: 574,
            D7_retained_users: 144,
          },
          {
            date: "2025-12-15", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1079,
            D0_unique_purchase: 233,
            D0_PURCHASE_VALUE: 666.64,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 275,
            D0_SPORTS_BET_PLACED_USER: 154,
            D0_GAMES_BET_PLACED_USER: 167,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 62.3,
            D0_GAMES_BET_FLOW: 2866.86,
            D0_TOTAL_BET_FLOW: 2929.16,

            // 付费 & 投注（D7）
            D7_unique_purchase: 359,
            D7_PURCHASE_VALUE: 2026.55,
            D7_TOTAL_BET_PLACED_USER: 440,
            D7_SPORTS_BET_PLACED_USER: 253,
            D7_GAMES_BET_PLACED_USER: 295,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 255.67,
            D7_GAMES_BET_FLOW: 13775.32,
            D7_TOTAL_BET_FLOW: 14030.99,

            // 留存
            D1_retained_users: 363,
            D7_retained_users: 108,
          },
          {
            date: "2025-12-15", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 233,
            D0_unique_purchase: 68,
            D0_PURCHASE_VALUE: 113.83,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 70,
            D0_SPORTS_BET_PLACED_USER: 43,
            D0_GAMES_BET_PLACED_USER: 40,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 60.55,
            D0_GAMES_BET_FLOW: 382.49,
            D0_TOTAL_BET_FLOW: 443.03,

            // 付费 & 投注（D7）
            D7_unique_purchase: 93,
            D7_PURCHASE_VALUE: 319.12,
            D7_TOTAL_BET_PLACED_USER: 112,
            D7_SPORTS_BET_PLACED_USER: 77,
            D7_GAMES_BET_PLACED_USER: 72,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 135.97,
            D7_GAMES_BET_FLOW: 1386.65,
            D7_TOTAL_BET_FLOW: 1522.62,

            // 留存
            D1_retained_users: 93,
            D7_retained_users: 16,
          },
          {
            date: "2025-12-16", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 245,
            D0_unique_purchase: 112,
            D0_PURCHASE_VALUE: 581.31,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 108,
            D0_SPORTS_BET_PLACED_USER: 52,
            D0_GAMES_BET_PLACED_USER: 76,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 69.9,
            D0_GAMES_BET_FLOW: 2917.01,
            D0_TOTAL_BET_FLOW: 2986.91,

            // 付费 & 投注（D7）
            D7_unique_purchase: 148,
            D7_PURCHASE_VALUE: 1717.62,
            D7_TOTAL_BET_PLACED_USER: 148,
            D7_SPORTS_BET_PLACED_USER: 87,
            D7_GAMES_BET_PLACED_USER: 110,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 212.37,
            D7_GAMES_BET_FLOW: 8452.57,
            D7_TOTAL_BET_FLOW: 8664.94,

            // 留存
            D1_retained_users: 119,
            D7_retained_users: 36,
          },
          {
            date: "2025-12-16", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1930,
            D0_unique_purchase: 484,
            D0_PURCHASE_VALUE: 1358.7,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 482,
            D0_SPORTS_BET_PLACED_USER: 124,
            D0_GAMES_BET_PLACED_USER: 421,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 197.69,
            D0_GAMES_BET_FLOW: 13259.83,
            D0_TOTAL_BET_FLOW: 13457.52,

            // 付费 & 投注（D7）
            D7_unique_purchase: 711,
            D7_PURCHASE_VALUE: 4717.89,
            D7_TOTAL_BET_PLACED_USER: 743,
            D7_SPORTS_BET_PLACED_USER: 221,
            D7_GAMES_BET_PLACED_USER: 668,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 482.58,
            D7_GAMES_BET_FLOW: 33523.66,
            D7_TOTAL_BET_FLOW: 34006.24,

            // 留存
            D1_retained_users: 631,
            D7_retained_users: 163,
          },
          {
            date: "2025-12-16", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1397,
            D0_unique_purchase: 564,
            D0_PURCHASE_VALUE: 1211.26,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 509,
            D0_SPORTS_BET_PLACED_USER: 260,
            D0_GAMES_BET_PLACED_USER: 347,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 358.24,
            D0_GAMES_BET_FLOW: 5959.55,
            D0_TOTAL_BET_FLOW: 6317.79,

            // 付费 & 投注（D7）
            D7_unique_purchase: 698,
            D7_PURCHASE_VALUE: 4295.13,
            D7_TOTAL_BET_PLACED_USER: 682,
            D7_SPORTS_BET_PLACED_USER: 385,
            D7_GAMES_BET_PLACED_USER: 479,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1179.94,
            D7_GAMES_BET_FLOW: 24848.71,
            D7_TOTAL_BET_FLOW: 26028.65,

            // 留存
            D1_retained_users: 508,
            D7_retained_users: 134,
          },
          {
            date: "2025-12-16", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1508,
            D0_unique_purchase: 267,
            D0_PURCHASE_VALUE: 1187.22,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 271,
            D0_SPORTS_BET_PLACED_USER: 120,
            D0_GAMES_BET_PLACED_USER: 190,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 63.28,
            D0_GAMES_BET_FLOW: 3138.94,
            D0_TOTAL_BET_FLOW: 3202.23,

            // 付费 & 投注（D7）
            D7_unique_purchase: 562,
            D7_PURCHASE_VALUE: 3342.14,
            D7_TOTAL_BET_PLACED_USER: 594,
            D7_SPORTS_BET_PLACED_USER: 412,
            D7_GAMES_BET_PLACED_USER: 285,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 216.46,
            D7_GAMES_BET_FLOW: 18460.87,
            D7_TOTAL_BET_FLOW: 18677.34,

            // 留存
            D1_retained_users: 408,
            D7_retained_users: 127,
          },
          {
            date: "2025-12-16", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 238,
            D0_unique_purchase: 69,
            D0_PURCHASE_VALUE: 406.95,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 69,
            D0_SPORTS_BET_PLACED_USER: 40,
            D0_GAMES_BET_PLACED_USER: 40,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 115.81,
            D0_GAMES_BET_FLOW: 859.64,
            D0_TOTAL_BET_FLOW: 975.45,

            // 付费 & 投注（D7）
            D7_unique_purchase: 88,
            D7_PURCHASE_VALUE: 805.81,
            D7_TOTAL_BET_PLACED_USER: 103,
            D7_SPORTS_BET_PLACED_USER: 71,
            D7_GAMES_BET_PLACED_USER: 67,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 215.77,
            D7_GAMES_BET_FLOW: 3044.44,
            D7_TOTAL_BET_FLOW: 3260.2,

            // 留存
            D1_retained_users: 105,
            D7_retained_users: 34,
          },
          {
            date: "2025-12-17", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 287,
            D0_unique_purchase: 115,
            D0_PURCHASE_VALUE: 1535.31,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 109,
            D0_SPORTS_BET_PLACED_USER: 48,
            D0_GAMES_BET_PLACED_USER: 78,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 35.56,
            D0_GAMES_BET_FLOW: 2967.89,
            D0_TOTAL_BET_FLOW: 3003.45,

            // 付费 & 投注（D7）
            D7_unique_purchase: 142,
            D7_PURCHASE_VALUE: 10896.92,
            D7_TOTAL_BET_PLACED_USER: 140,
            D7_SPORTS_BET_PLACED_USER: 78,
            D7_GAMES_BET_PLACED_USER: 106,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 154.05,
            D7_GAMES_BET_FLOW: 11764.31,
            D7_TOTAL_BET_FLOW: 11918.36,

            // 留存
            D1_retained_users: 113,
            D7_retained_users: 43,
          },
          {
            date: "2025-12-17", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1555,
            D0_unique_purchase: 398,
            D0_PURCHASE_VALUE: 1910.86,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 400,
            D0_SPORTS_BET_PLACED_USER: 116,
            D0_GAMES_BET_PLACED_USER: 336,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 974.77,
            D0_GAMES_BET_FLOW: 7155.81,
            D0_TOTAL_BET_FLOW: 8130.57,

            // 付费 & 投注（D7）
            D7_unique_purchase: 580,
            D7_PURCHASE_VALUE: 9775.23,
            D7_TOTAL_BET_PLACED_USER: 618,
            D7_SPORTS_BET_PLACED_USER: 194,
            D7_GAMES_BET_PLACED_USER: 536,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 10195.77,
            D7_GAMES_BET_FLOW: 31458.92,
            D7_TOTAL_BET_FLOW: 41654.68,

            // 留存
            D1_retained_users: 643,
            D7_retained_users: 139,
          },
          {
            date: "2025-12-17", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1349,
            D0_unique_purchase: 538,
            D0_PURCHASE_VALUE: 1175.1,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 490,
            D0_SPORTS_BET_PLACED_USER: 247,
            D0_GAMES_BET_PLACED_USER: 322,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 652.7,
            D0_GAMES_BET_FLOW: 3877.53,
            D0_TOTAL_BET_FLOW: 4530.24,

            // 付费 & 投注（D7）
            D7_unique_purchase: 666,
            D7_PURCHASE_VALUE: 2171.84,
            D7_TOTAL_BET_PLACED_USER: 661,
            D7_SPORTS_BET_PLACED_USER: 394,
            D7_GAMES_BET_PLACED_USER: 450,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 875.03,
            D7_GAMES_BET_FLOW: 17993.17,
            D7_TOTAL_BET_FLOW: 18868.2,

            // 留存
            D1_retained_users: 479,
            D7_retained_users: 138,
          },
          {
            date: "2025-12-17", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1372,
            D0_unique_purchase: 223,
            D0_PURCHASE_VALUE: 644.13,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 285,
            D0_SPORTS_BET_PLACED_USER: 173,
            D0_GAMES_BET_PLACED_USER: 163,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 85.58,
            D0_GAMES_BET_FLOW: 2958.11,
            D0_TOTAL_BET_FLOW: 3043.69,

            // 付费 & 投注（D7）
            D7_unique_purchase: 441,
            D7_PURCHASE_VALUE: 2259.19,
            D7_TOTAL_BET_PLACED_USER: 466,
            D7_SPORTS_BET_PLACED_USER: 312,
            D7_GAMES_BET_PLACED_USER: 262,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 209.93,
            D7_GAMES_BET_FLOW: 10389.2,
            D7_TOTAL_BET_FLOW: 10599.13,

            // 留存
            D1_retained_users: 365,
            D7_retained_users: 139,
          },
          {
            date: "2025-12-17", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 247,
            D0_unique_purchase: 69,
            D0_PURCHASE_VALUE: 170.79,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 67,
            D0_SPORTS_BET_PLACED_USER: 40,
            D0_GAMES_BET_PLACED_USER: 39,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 36.59,
            D0_GAMES_BET_FLOW: 361.39,
            D0_TOTAL_BET_FLOW: 397.98,

            // 付费 & 投注（D7）
            D7_unique_purchase: 91,
            D7_PURCHASE_VALUE: 282.62,
            D7_TOTAL_BET_PLACED_USER: 97,
            D7_SPORTS_BET_PLACED_USER: 66,
            D7_GAMES_BET_PLACED_USER: 57,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 92.78,
            D7_GAMES_BET_FLOW: 629.7,
            D7_TOTAL_BET_FLOW: 722.48,

            // 留存
            D1_retained_users: 91,
            D7_retained_users: 26,
          },
          {
            date: "2025-12-18", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 332,
            D0_unique_purchase: 128,
            D0_PURCHASE_VALUE: 476,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 124,
            D0_SPORTS_BET_PLACED_USER: 69,
            D0_GAMES_BET_PLACED_USER: 78,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 49.04,
            D0_GAMES_BET_FLOW: 2408.12,
            D0_TOTAL_BET_FLOW: 2457.16,

            // 付费 & 投注（D7）
            D7_unique_purchase: 161,
            D7_PURCHASE_VALUE: 2484.69,
            D7_TOTAL_BET_PLACED_USER: 160,
            D7_SPORTS_BET_PLACED_USER: 100,
            D7_GAMES_BET_PLACED_USER: 112,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 166.05,
            D7_GAMES_BET_FLOW: 46048.18,
            D7_TOTAL_BET_FLOW: 46214.23,

            // 留存
            D1_retained_users: 123,
            D7_retained_users: 29,
          },
          {
            date: "2025-12-18", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1706,
            D0_unique_purchase: 418,
            D0_PURCHASE_VALUE: 1805.18,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 412,
            D0_SPORTS_BET_PLACED_USER: 89,
            D0_GAMES_BET_PLACED_USER: 359,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 345.07,
            D0_GAMES_BET_FLOW: 12634.46,
            D0_TOTAL_BET_FLOW: 12979.53,

            // 付费 & 投注（D7）
            D7_unique_purchase: 607,
            D7_PURCHASE_VALUE: 4943.86,
            D7_TOTAL_BET_PLACED_USER: 651,
            D7_SPORTS_BET_PLACED_USER: 166,
            D7_GAMES_BET_PLACED_USER: 569,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 3419.66,
            D7_GAMES_BET_FLOW: 22093.71,
            D7_TOTAL_BET_FLOW: 25513.37,

            // 留存
            D1_retained_users: 659,
            D7_retained_users: 98,
          },
          {
            date: "2025-12-18", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1573,
            D0_unique_purchase: 592,
            D0_PURCHASE_VALUE: 1352.06,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 558,
            D0_SPORTS_BET_PLACED_USER: 295,
            D0_GAMES_BET_PLACED_USER: 359,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 257.03,
            D0_GAMES_BET_FLOW: 3801.8,
            D0_TOTAL_BET_FLOW: 4058.83,

            // 付费 & 投注（D7）
            D7_unique_purchase: 738,
            D7_PURCHASE_VALUE: 4051.16,
            D7_TOTAL_BET_PLACED_USER: 743,
            D7_SPORTS_BET_PLACED_USER: 429,
            D7_GAMES_BET_PLACED_USER: 509,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 828.01,
            D7_GAMES_BET_FLOW: 23869.22,
            D7_TOTAL_BET_FLOW: 24697.23,

            // 留存
            D1_retained_users: 558,
            D7_retained_users: 155,
          },
          {
            date: "2025-12-18", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1184,
            D0_unique_purchase: 238,
            D0_PURCHASE_VALUE: 1072.05,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 245,
            D0_SPORTS_BET_PLACED_USER: 106,
            D0_GAMES_BET_PLACED_USER: 178,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 62.12,
            D0_GAMES_BET_FLOW: 2357.65,
            D0_TOTAL_BET_FLOW: 2419.77,

            // 付费 & 投注（D7）
            D7_unique_purchase: 330,
            D7_PURCHASE_VALUE: 2389.64,
            D7_TOTAL_BET_PLACED_USER: 350,
            D7_SPORTS_BET_PLACED_USER: 187,
            D7_GAMES_BET_PLACED_USER: 257,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 460.45,
            D7_GAMES_BET_FLOW: 8991.55,
            D7_TOTAL_BET_FLOW: 9452,

            // 留存
            D1_retained_users: 289,
            D7_retained_users: 80,
          },
          {
            date: "2025-12-18", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 310,
            D0_unique_purchase: 61,
            D0_PURCHASE_VALUE: 193.85,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 61,
            D0_SPORTS_BET_PLACED_USER: 27,
            D0_GAMES_BET_PLACED_USER: 43,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 26.38,
            D0_GAMES_BET_FLOW: 814.31,
            D0_TOTAL_BET_FLOW: 840.7,

            // 付费 & 投注（D7）
            D7_unique_purchase: 88,
            D7_PURCHASE_VALUE: 3504.9,
            D7_TOTAL_BET_PLACED_USER: 102,
            D7_SPORTS_BET_PLACED_USER: 58,
            D7_GAMES_BET_PLACED_USER: 71,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 218.19,
            D7_GAMES_BET_FLOW: 26827.03,
            D7_TOTAL_BET_FLOW: 27045.22,

            // 留存
            D1_retained_users: 127,
            D7_retained_users: 48,
          },
          {
            date: "2025-12-19", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 370,
            D0_unique_purchase: 176,
            D0_PURCHASE_VALUE: 1529,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 146,
            D0_SPORTS_BET_PLACED_USER: 84,
            D0_GAMES_BET_PLACED_USER: 102,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 106.81,
            D0_GAMES_BET_FLOW: 5023.36,
            D0_TOTAL_BET_FLOW: 5130.17,

            // 付费 & 投注（D7）
            D7_unique_purchase: 212,
            D7_PURCHASE_VALUE: 3024.92,
            D7_TOTAL_BET_PLACED_USER: 210,
            D7_SPORTS_BET_PLACED_USER: 146,
            D7_GAMES_BET_PLACED_USER: 149,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 418.68,
            D7_GAMES_BET_FLOW: 13430.05,
            D7_TOTAL_BET_FLOW: 13848.73,

            // 留存
            D1_retained_users: 172,
            D7_retained_users: 43,
          },
          {
            date: "2025-12-19", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1950,
            D0_unique_purchase: 431,
            D0_PURCHASE_VALUE: 1393.67,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 427,
            D0_SPORTS_BET_PLACED_USER: 87,
            D0_GAMES_BET_PLACED_USER: 381,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 154.98,
            D0_GAMES_BET_FLOW: 6495.3,
            D0_TOTAL_BET_FLOW: 6650.29,

            // 付费 & 投注（D7）
            D7_unique_purchase: 674,
            D7_PURCHASE_VALUE: 5909.77,
            D7_TOTAL_BET_PLACED_USER: 711,
            D7_SPORTS_BET_PLACED_USER: 174,
            D7_GAMES_BET_PLACED_USER: 647,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 321.53,
            D7_GAMES_BET_FLOW: 105290.98,
            D7_TOTAL_BET_FLOW: 105612.52,

            // 留存
            D1_retained_users: 758,
            D7_retained_users: 150,
          },
          {
            date: "2025-12-19", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1456,
            D0_unique_purchase: 601,
            D0_PURCHASE_VALUE: 1377.6,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 534,
            D0_SPORTS_BET_PLACED_USER: 294,
            D0_GAMES_BET_PLACED_USER: 339,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 632.46,
            D0_GAMES_BET_FLOW: 4165.99,
            D0_TOTAL_BET_FLOW: 4798.45,

            // 付费 & 投注（D7）
            D7_unique_purchase: 725,
            D7_PURCHASE_VALUE: 4995.04,
            D7_TOTAL_BET_PLACED_USER: 713,
            D7_SPORTS_BET_PLACED_USER: 433,
            D7_GAMES_BET_PLACED_USER: 491,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 3297.25,
            D7_GAMES_BET_FLOW: 17222.4,
            D7_TOTAL_BET_FLOW: 20519.65,

            // 留存
            D1_retained_users: 568,
            D7_retained_users: 148,
          },
          {
            date: "2025-12-19", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1041,
            D0_unique_purchase: 239,
            D0_PURCHASE_VALUE: 1857.21,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 236,
            D0_SPORTS_BET_PLACED_USER: 85,
            D0_GAMES_BET_PLACED_USER: 194,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 48.74,
            D0_GAMES_BET_FLOW: 4223.9,
            D0_TOTAL_BET_FLOW: 4272.64,

            // 付费 & 投注（D7）
            D7_unique_purchase: 323,
            D7_PURCHASE_VALUE: 3568.4,
            D7_TOTAL_BET_PLACED_USER: 346,
            D7_SPORTS_BET_PLACED_USER: 162,
            D7_GAMES_BET_PLACED_USER: 273,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 157.83,
            D7_GAMES_BET_FLOW: 17810.67,
            D7_TOTAL_BET_FLOW: 17968.5,

            // 留存
            D1_retained_users: 327,
            D7_retained_users: 72,
          },
          {
            date: "2025-12-19", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 262,
            D0_unique_purchase: 62,
            D0_PURCHASE_VALUE: 371.42,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 59,
            D0_SPORTS_BET_PLACED_USER: 28,
            D0_GAMES_BET_PLACED_USER: 38,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 18.35,
            D0_GAMES_BET_FLOW: 1366.23,
            D0_TOTAL_BET_FLOW: 1384.58,

            // 付费 & 投注（D7）
            D7_unique_purchase: 75,
            D7_PURCHASE_VALUE: 1212.31,
            D7_TOTAL_BET_PLACED_USER: 82,
            D7_SPORTS_BET_PLACED_USER: 43,
            D7_GAMES_BET_PLACED_USER: 57,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 143.07,
            D7_GAMES_BET_FLOW: 5685.19,
            D7_TOTAL_BET_FLOW: 5828.27,

            // 留存
            D1_retained_users: 101,
            D7_retained_users: 20,
          },
          {
            date: "2025-12-20", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 431,
            D0_unique_purchase: 220,
            D0_PURCHASE_VALUE: 1000.62,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 210,
            D0_SPORTS_BET_PLACED_USER: 137,
            D0_GAMES_BET_PLACED_USER: 129,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 204.56,
            D0_GAMES_BET_FLOW: 6595.32,
            D0_TOTAL_BET_FLOW: 6799.88,

            // 付费 & 投注（D7）
            D7_unique_purchase: 257,
            D7_PURCHASE_VALUE: 3704,
            D7_TOTAL_BET_PLACED_USER: 257,
            D7_SPORTS_BET_PLACED_USER: 176,
            D7_GAMES_BET_PLACED_USER: 171,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 447.49,
            D7_GAMES_BET_FLOW: 24333.46,
            D7_TOTAL_BET_FLOW: 24780.95,

            // 留存
            D1_retained_users: 192,
            D7_retained_users: 65,
          },
          {
            date: "2025-12-20", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1896,
            D0_unique_purchase: 476,
            D0_PURCHASE_VALUE: 3484.5,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 484,
            D0_SPORTS_BET_PLACED_USER: 153,
            D0_GAMES_BET_PLACED_USER: 403,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 129.12,
            D0_GAMES_BET_FLOW: 25146.25,
            D0_TOTAL_BET_FLOW: 25275.37,

            // 付费 & 投注（D7）
            D7_unique_purchase: 676,
            D7_PURCHASE_VALUE: 5991.79,
            D7_TOTAL_BET_PLACED_USER: 752,
            D7_SPORTS_BET_PLACED_USER: 257,
            D7_GAMES_BET_PLACED_USER: 632,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 335.17,
            D7_GAMES_BET_FLOW: 46392.83,
            D7_TOTAL_BET_FLOW: 46728,

            // 留存
            D1_retained_users: 628,
            D7_retained_users: 127,
          },
          {
            date: "2025-12-20", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1410,
            D0_unique_purchase: 577,
            D0_PURCHASE_VALUE: 3155.94,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 526,
            D0_SPORTS_BET_PLACED_USER: 301,
            D0_GAMES_BET_PLACED_USER: 324,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 1501.74,
            D0_GAMES_BET_FLOW: 5626.06,
            D0_TOTAL_BET_FLOW: 7127.8,

            // 付费 & 投注（D7）
            D7_unique_purchase: 719,
            D7_PURCHASE_VALUE: 13700.81,
            D7_TOTAL_BET_PLACED_USER: 709,
            D7_SPORTS_BET_PLACED_USER: 439,
            D7_GAMES_BET_PLACED_USER: 466,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 13733.27,
            D7_GAMES_BET_FLOW: 35146.28,
            D7_TOTAL_BET_FLOW: 48879.54,

            // 留存
            D1_retained_users: 536,
            D7_retained_users: 166,
          },
          {
            date: "2025-12-20", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 929,
            D0_unique_purchase: 273,
            D0_PURCHASE_VALUE: 1186.93,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 283,
            D0_SPORTS_BET_PLACED_USER: 154,
            D0_GAMES_BET_PLACED_USER: 182,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 118.28,
            D0_GAMES_BET_FLOW: 2589.92,
            D0_TOTAL_BET_FLOW: 2708.21,

            // 付费 & 投注（D7）
            D7_unique_purchase: 357,
            D7_PURCHASE_VALUE: 1896.21,
            D7_TOTAL_BET_PLACED_USER: 375,
            D7_SPORTS_BET_PLACED_USER: 215,
            D7_GAMES_BET_PLACED_USER: 282,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 367.57,
            D7_GAMES_BET_FLOW: 6024.51,
            D7_TOTAL_BET_FLOW: 6392.07,

            // 留存
            D1_retained_users: 299,
            D7_retained_users: 97,
          },
          {
            date: "2025-12-20", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 280,
            D0_unique_purchase: 75,
            D0_PURCHASE_VALUE: 206.48,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 81,
            D0_SPORTS_BET_PLACED_USER: 57,
            D0_GAMES_BET_PLACED_USER: 41,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 32.08,
            D0_GAMES_BET_FLOW: 1691.4,
            D0_TOTAL_BET_FLOW: 1723.48,

            // 付费 & 投注（D7）
            D7_unique_purchase: 93,
            D7_PURCHASE_VALUE: 1663.62,
            D7_TOTAL_BET_PLACED_USER: 116,
            D7_SPORTS_BET_PLACED_USER: 80,
            D7_GAMES_BET_PLACED_USER: 64,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 105.89,
            D7_GAMES_BET_FLOW: 12085.8,
            D7_TOTAL_BET_FLOW: 12191.7,

            // 留存
            D1_retained_users: 118,
            D7_retained_users: 26,
          },
          {
            date: "2025-12-21", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 402,
            D0_unique_purchase: 206,
            D0_PURCHASE_VALUE: 1069.31,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 201,
            D0_SPORTS_BET_PLACED_USER: 119,
            D0_GAMES_BET_PLACED_USER: 121,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 115.24,
            D0_GAMES_BET_FLOW: 4055.72,
            D0_TOTAL_BET_FLOW: 4170.97,

            // 付费 & 投注（D7）
            D7_unique_purchase: 255,
            D7_PURCHASE_VALUE: 5024.69,
            D7_TOTAL_BET_PLACED_USER: 257,
            D7_SPORTS_BET_PLACED_USER: 175,
            D7_GAMES_BET_PLACED_USER: 179,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 345.88,
            D7_GAMES_BET_FLOW: 24884.32,
            D7_TOTAL_BET_FLOW: 25230.2,

            // 留存
            D1_retained_users: 178,
            D7_retained_users: 62,
          },
          {
            date: "2025-12-21", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1607,
            D0_unique_purchase: 485,
            D0_PURCHASE_VALUE: 1725.9,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 512,
            D0_SPORTS_BET_PLACED_USER: 135,
            D0_GAMES_BET_PLACED_USER: 437,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 373.6,
            D0_GAMES_BET_FLOW: 5847.44,
            D0_TOTAL_BET_FLOW: 6221.04,

            // 付费 & 投注（D7）
            D7_unique_purchase: 661,
            D7_PURCHASE_VALUE: 3410.68,
            D7_TOTAL_BET_PLACED_USER: 753,
            D7_SPORTS_BET_PLACED_USER: 245,
            D7_GAMES_BET_PLACED_USER: 637,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 545.01,
            D7_GAMES_BET_FLOW: 15313.56,
            D7_TOTAL_BET_FLOW: 15858.58,

            // 留存
            D1_retained_users: 772,
            D7_retained_users: 144,
          },
          {
            date: "2025-12-21", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1410,
            D0_unique_purchase: 617,
            D0_PURCHASE_VALUE: 1369.56,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 568,
            D0_SPORTS_BET_PLACED_USER: 334,
            D0_GAMES_BET_PLACED_USER: 346,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 632,
            D0_GAMES_BET_FLOW: 3841.49,
            D0_TOTAL_BET_FLOW: 4473.48,

            // 付费 & 投注（D7）
            D7_unique_purchase: 754,
            D7_PURCHASE_VALUE: 4810.85,
            D7_TOTAL_BET_PLACED_USER: 756,
            D7_SPORTS_BET_PLACED_USER: 475,
            D7_GAMES_BET_PLACED_USER: 496,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 3347.01,
            D7_GAMES_BET_FLOW: 17855.62,
            D7_TOTAL_BET_FLOW: 21202.63,

            // 留存
            D1_retained_users: 548,
            D7_retained_users: 154,
          },
          {
            date: "2025-12-21", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1231,
            D0_unique_purchase: 280,
            D0_PURCHASE_VALUE: 1016.23,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 331,
            D0_SPORTS_BET_PLACED_USER: 200,
            D0_GAMES_BET_PLACED_USER: 184,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 123.77,
            D0_GAMES_BET_FLOW: 6338.42,
            D0_TOTAL_BET_FLOW: 6462.2,

            // 付费 & 投注（D7）
            D7_unique_purchase: 508,
            D7_PURCHASE_VALUE: 3234.69,
            D7_TOTAL_BET_PLACED_USER: 546,
            D7_SPORTS_BET_PLACED_USER: 363,
            D7_GAMES_BET_PLACED_USER: 304,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 467.15,
            D7_GAMES_BET_FLOW: 19873.38,
            D7_TOTAL_BET_FLOW: 20340.52,

            // 留存
            D1_retained_users: 406,
            D7_retained_users: 102,
          },
          {
            date: "2025-12-21", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 230,
            D0_unique_purchase: 64,
            D0_PURCHASE_VALUE: 260.43,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 72,
            D0_SPORTS_BET_PLACED_USER: 39,
            D0_GAMES_BET_PLACED_USER: 37,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 54.36,
            D0_GAMES_BET_FLOW: 316.44,
            D0_TOTAL_BET_FLOW: 370.79,

            // 付费 & 投注（D7）
            D7_unique_purchase: 95,
            D7_PURCHASE_VALUE: 380.53,
            D7_TOTAL_BET_PLACED_USER: 111,
            D7_SPORTS_BET_PLACED_USER: 77,
            D7_GAMES_BET_PLACED_USER: 51,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 253.15,
            D7_GAMES_BET_FLOW: 781.24,
            D7_TOTAL_BET_FLOW: 1034.39,

            // 留存
            D1_retained_users: 74,
            D7_retained_users: 32,
          },
          {
            date: "2025-12-22", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 302,
            D0_unique_purchase: 137,
            D0_PURCHASE_VALUE: 911.08,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 135,
            D0_SPORTS_BET_PLACED_USER: 68,
            D0_GAMES_BET_PLACED_USER: 98,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 42.43,
            D0_GAMES_BET_FLOW: 25163.03,
            D0_TOTAL_BET_FLOW: 25205.46,

            // 付费 & 投注（D7）
            D7_unique_purchase: 169,
            D7_PURCHASE_VALUE: 22636.77,
            D7_TOTAL_BET_PLACED_USER: 172,
            D7_SPORTS_BET_PLACED_USER: 103,
            D7_GAMES_BET_PLACED_USER: 137,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 162.4,
            D7_GAMES_BET_FLOW: 351027.85,
            D7_TOTAL_BET_FLOW: 351190.25,

            // 留存
            D1_retained_users: 131,
            D7_retained_users: 39,
          },
          {
            date: "2025-12-22", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 2300,
            D0_unique_purchase: 618,
            D0_PURCHASE_VALUE: 2061.38,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 618,
            D0_SPORTS_BET_PLACED_USER: 126,
            D0_GAMES_BET_PLACED_USER: 542,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 455.73,
            D0_GAMES_BET_FLOW: 5921.16,
            D0_TOTAL_BET_FLOW: 6376.89,

            // 付费 & 投注（D7）
            D7_unique_purchase: 860,
            D7_PURCHASE_VALUE: 8896.68,
            D7_TOTAL_BET_PLACED_USER: 927,
            D7_SPORTS_BET_PLACED_USER: 235,
            D7_GAMES_BET_PLACED_USER: 814,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 883.92,
            D7_GAMES_BET_FLOW: 41649.6,
            D7_TOTAL_BET_FLOW: 42533.52,

            // 留存
            D1_retained_users: 797,
            D7_retained_users: 110,
          },
          {
            date: "2025-12-22", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1393,
            D0_unique_purchase: 584,
            D0_PURCHASE_VALUE: 1842.59,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 517,
            D0_SPORTS_BET_PLACED_USER: 301,
            D0_GAMES_BET_PLACED_USER: 317,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 1493.26,
            D0_GAMES_BET_FLOW: 10949.29,
            D0_TOTAL_BET_FLOW: 12442.54,

            // 付费 & 投注（D7）
            D7_unique_purchase: 740,
            D7_PURCHASE_VALUE: 6295.14,
            D7_TOTAL_BET_PLACED_USER: 726,
            D7_SPORTS_BET_PLACED_USER: 470,
            D7_GAMES_BET_PLACED_USER: 455,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 6675.01,
            D7_GAMES_BET_FLOW: 27271.21,
            D7_TOTAL_BET_FLOW: 33946.22,

            // 留存
            D1_retained_users: 567,
            D7_retained_users: 148,
          },
          {
            date: "2025-12-22", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1103,
            D0_unique_purchase: 283,
            D0_PURCHASE_VALUE: 3238.84,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 295,
            D0_SPORTS_BET_PLACED_USER: 129,
            D0_GAMES_BET_PLACED_USER: 206,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 58.6,
            D0_GAMES_BET_FLOW: 3824.56,
            D0_TOTAL_BET_FLOW: 3883.16,

            // 付费 & 投注（D7）
            D7_unique_purchase: 510,
            D7_PURCHASE_VALUE: 5061.1,
            D7_TOTAL_BET_PLACED_USER: 540,
            D7_SPORTS_BET_PLACED_USER: 337,
            D7_GAMES_BET_PLACED_USER: 300,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 213.95,
            D7_GAMES_BET_FLOW: 13523.96,
            D7_TOTAL_BET_FLOW: 13737.91,

            // 留存
            D1_retained_users: 305,
            D7_retained_users: 91,
          },
          {
            date: "2025-12-22", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 340,
            D0_unique_purchase: 90,
            D0_PURCHASE_VALUE: 684.71,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 100,
            D0_SPORTS_BET_PLACED_USER: 37,
            D0_GAMES_BET_PLACED_USER: 79,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 17.07,
            D0_GAMES_BET_FLOW: 1011.23,
            D0_TOTAL_BET_FLOW: 1028.3,

            // 付费 & 投注（D7）
            D7_unique_purchase: 126,
            D7_PURCHASE_VALUE: 1074.75,
            D7_TOTAL_BET_PLACED_USER: 152,
            D7_SPORTS_BET_PLACED_USER: 82,
            D7_GAMES_BET_PLACED_USER: 103,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 137.09,
            D7_GAMES_BET_FLOW: 2528.64,
            D7_TOTAL_BET_FLOW: 2665.73,

            // 留存
            D1_retained_users: 159,
            D7_retained_users: 24,
          },
          {
            date: "2025-12-23", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 371,
            D0_unique_purchase: 182,
            D0_PURCHASE_VALUE: 2740.38,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 173,
            D0_SPORTS_BET_PLACED_USER: 90,
            D0_GAMES_BET_PLACED_USER: 130,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 415.78,
            D0_GAMES_BET_FLOW: 7646.02,
            D0_TOTAL_BET_FLOW: 8061.79,

            // 付费 & 投注（D7）
            D7_unique_purchase: 220,
            D7_PURCHASE_VALUE: 6906.73,
            D7_TOTAL_BET_PLACED_USER: 225,
            D7_SPORTS_BET_PLACED_USER: 134,
            D7_GAMES_BET_PLACED_USER: 170,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 636.92,
            D7_GAMES_BET_FLOW: 24586.36,
            D7_TOTAL_BET_FLOW: 25223.28,

            // 留存
            D1_retained_users: 169,
            D7_retained_users: 62,
          },
          {
            date: "2025-12-23", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 2746,
            D0_unique_purchase: 637,
            D0_PURCHASE_VALUE: 3365.73,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 621,
            D0_SPORTS_BET_PLACED_USER: 113,
            D0_GAMES_BET_PLACED_USER: 561,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 383.54,
            D0_GAMES_BET_FLOW: 7264.11,
            D0_TOTAL_BET_FLOW: 7647.65,

            // 付费 & 投注（D7）
            D7_unique_purchase: 917,
            D7_PURCHASE_VALUE: 6271.92,
            D7_TOTAL_BET_PLACED_USER: 982,
            D7_SPORTS_BET_PLACED_USER: 249,
            D7_GAMES_BET_PLACED_USER: 863,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1032.23,
            D7_GAMES_BET_FLOW: 20519.39,
            D7_TOTAL_BET_FLOW: 21551.62,

            // 留存
            D1_retained_users: 905,
            D7_retained_users: 168,
          },
          {
            date: "2025-12-23", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1387,
            D0_unique_purchase: 582,
            D0_PURCHASE_VALUE: 2718.01,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 523,
            D0_SPORTS_BET_PLACED_USER: 262,
            D0_GAMES_BET_PLACED_USER: 361,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 968.59,
            D0_GAMES_BET_FLOW: 4526.81,
            D0_TOTAL_BET_FLOW: 5495.4,

            // 付费 & 投注（D7）
            D7_unique_purchase: 729,
            D7_PURCHASE_VALUE: 9842.36,
            D7_TOTAL_BET_PLACED_USER: 720,
            D7_SPORTS_BET_PLACED_USER: 410,
            D7_GAMES_BET_PLACED_USER: 499,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 5063.5,
            D7_GAMES_BET_FLOW: 79553.85,
            D7_TOTAL_BET_FLOW: 84617.35,

            // 留存
            D1_retained_users: 546,
            D7_retained_users: 151,
          },
          {
            date: "2025-12-23", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1648,
            D0_unique_purchase: 322,
            D0_PURCHASE_VALUE: 1192.18,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 321,
            D0_SPORTS_BET_PLACED_USER: 142,
            D0_GAMES_BET_PLACED_USER: 239,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 68.27,
            D0_GAMES_BET_FLOW: 3930.78,
            D0_TOTAL_BET_FLOW: 3999.05,

            // 付费 & 投注（D7）
            D7_unique_purchase: 541,
            D7_PURCHASE_VALUE: 2540.06,
            D7_TOTAL_BET_PLACED_USER: 566,
            D7_SPORTS_BET_PLACED_USER: 342,
            D7_GAMES_BET_PLACED_USER: 344,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 201.34,
            D7_GAMES_BET_FLOW: 11159.17,
            D7_TOTAL_BET_FLOW: 11360.51,

            // 留存
            D1_retained_users: 359,
            D7_retained_users: 111,
          },
          {
            date: "2025-12-23", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 369,
            D0_unique_purchase: 116,
            D0_PURCHASE_VALUE: 2418.77,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 117,
            D0_SPORTS_BET_PLACED_USER: 34,
            D0_GAMES_BET_PLACED_USER: 99,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 281.54,
            D0_GAMES_BET_FLOW: 4294.36,
            D0_TOTAL_BET_FLOW: 4575.9,

            // 付费 & 投注（D7）
            D7_unique_purchase: 137,
            D7_PURCHASE_VALUE: 3504.63,
            D7_TOTAL_BET_PLACED_USER: 160,
            D7_SPORTS_BET_PLACED_USER: 61,
            D7_GAMES_BET_PLACED_USER: 128,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 584.95,
            D7_GAMES_BET_FLOW: 11754.69,
            D7_TOTAL_BET_FLOW: 12339.64,

            // 留存
            D1_retained_users: 126,
            D7_retained_users: 37,
          },
          {
            date: "2025-12-24", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 351,
            D0_unique_purchase: 163,
            D0_PURCHASE_VALUE: 2530.09,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 155,
            D0_SPORTS_BET_PLACED_USER: 72,
            D0_GAMES_BET_PLACED_USER: 124,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 66.99,
            D0_GAMES_BET_FLOW: 10518.04,
            D0_TOTAL_BET_FLOW: 10585.02,

            // 付费 & 投注（D7）
            D7_unique_purchase: 201,
            D7_PURCHASE_VALUE: 10090.2,
            D7_TOTAL_BET_PLACED_USER: 199,
            D7_SPORTS_BET_PLACED_USER: 110,
            D7_GAMES_BET_PLACED_USER: 168,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1475.34,
            D7_GAMES_BET_FLOW: 98652.35,
            D7_TOTAL_BET_FLOW: 100127.69,

            // 留存
            D1_retained_users: 145,
            D7_retained_users: 49,
          },
          {
            date: "2025-12-24", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 2386,
            D0_unique_purchase: 589,
            D0_PURCHASE_VALUE: 4620.65,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 592,
            D0_SPORTS_BET_PLACED_USER: 100,
            D0_GAMES_BET_PLACED_USER: 542,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 404.06,
            D0_GAMES_BET_FLOW: 10610.4,
            D0_TOTAL_BET_FLOW: 11014.47,

            // 付费 & 投注（D7）
            D7_unique_purchase: 811,
            D7_PURCHASE_VALUE: 10675.11,
            D7_TOTAL_BET_PLACED_USER: 871,
            D7_SPORTS_BET_PLACED_USER: 210,
            D7_GAMES_BET_PLACED_USER: 790,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 902.47,
            D7_GAMES_BET_FLOW: 46074.4,
            D7_TOTAL_BET_FLOW: 46976.86,

            // 留存
            D1_retained_users: 690,
            D7_retained_users: 127,
          },
          {
            date: "2025-12-24", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1510,
            D0_unique_purchase: 620,
            D0_PURCHASE_VALUE: 1773.66,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 549,
            D0_SPORTS_BET_PLACED_USER: 284,
            D0_GAMES_BET_PLACED_USER: 372,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 583.15,
            D0_GAMES_BET_FLOW: 3831.31,
            D0_TOTAL_BET_FLOW: 4414.46,

            // 付费 & 投注（D7）
            D7_unique_purchase: 766,
            D7_PURCHASE_VALUE: 3737.97,
            D7_TOTAL_BET_PLACED_USER: 740,
            D7_SPORTS_BET_PLACED_USER: 434,
            D7_GAMES_BET_PLACED_USER: 515,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2149.62,
            D7_GAMES_BET_FLOW: 10596.84,
            D7_TOTAL_BET_FLOW: 12746.46,

            // 留存
            D1_retained_users: 569,
            D7_retained_users: 150,
          },
          {
            date: "2025-12-24", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1195,
            D0_unique_purchase: 301,
            D0_PURCHASE_VALUE: 1531.85,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 301,
            D0_SPORTS_BET_PLACED_USER: 118,
            D0_GAMES_BET_PLACED_USER: 228,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 287.32,
            D0_GAMES_BET_FLOW: 2997.14,
            D0_TOTAL_BET_FLOW: 3284.46,

            // 付费 & 投注（D7）
            D7_unique_purchase: 513,
            D7_PURCHASE_VALUE: 4909.14,
            D7_TOTAL_BET_PLACED_USER: 533,
            D7_SPORTS_BET_PLACED_USER: 323,
            D7_GAMES_BET_PLACED_USER: 310,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 621.59,
            D7_GAMES_BET_FLOW: 22919.91,
            D7_TOTAL_BET_FLOW: 23541.5,

            // 留存
            D1_retained_users: 290,
            D7_retained_users: 100,
          },
          {
            date: "2025-12-24", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 209,
            D0_unique_purchase: 69,
            D0_PURCHASE_VALUE: 834.7,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 68,
            D0_SPORTS_BET_PLACED_USER: 19,
            D0_GAMES_BET_PLACED_USER: 58,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 14.74,
            D0_GAMES_BET_FLOW: 1311.85,
            D0_TOTAL_BET_FLOW: 1326.59,

            // 付费 & 投注（D7）
            D7_unique_purchase: 79,
            D7_PURCHASE_VALUE: 1312.16,
            D7_TOTAL_BET_PLACED_USER: 90,
            D7_SPORTS_BET_PLACED_USER: 37,
            D7_GAMES_BET_PLACED_USER: 73,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 80.21,
            D7_GAMES_BET_FLOW: 3054.02,
            D7_TOTAL_BET_FLOW: 3134.24,

            // 留存
            D1_retained_users: 55,
            D7_retained_users: 19,
          },
          {
            date: "2025-12-25", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 425,
            D0_unique_purchase: 239,
            D0_PURCHASE_VALUE: 12437.23,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 230,
            D0_SPORTS_BET_PLACED_USER: 83,
            D0_GAMES_BET_PLACED_USER: 181,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 1662.41,
            D0_GAMES_BET_FLOW: 15894.98,
            D0_TOTAL_BET_FLOW: 17557.38,

            // 付费 & 投注（D7）
            D7_unique_purchase: 291,
            D7_PURCHASE_VALUE: 32146.54,
            D7_TOTAL_BET_PLACED_USER: 292,
            D7_SPORTS_BET_PLACED_USER: 129,
            D7_GAMES_BET_PLACED_USER: 231,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 16221.13,
            D7_GAMES_BET_FLOW: 69804.22,
            D7_TOTAL_BET_FLOW: 86025.35,

            // 留存
            D1_retained_users: 233,
            D7_retained_users: 76,
          },
          {
            date: "2025-12-25", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1761,
            D0_unique_purchase: 404,
            D0_PURCHASE_VALUE: 1672.57,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 396,
            D0_SPORTS_BET_PLACED_USER: 63,
            D0_GAMES_BET_PLACED_USER: 365,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 46.86,
            D0_GAMES_BET_FLOW: 7549.8,
            D0_TOTAL_BET_FLOW: 7596.67,

            // 付费 & 投注（D7）
            D7_unique_purchase: 541,
            D7_PURCHASE_VALUE: 3854.71,
            D7_TOTAL_BET_PLACED_USER: 613,
            D7_SPORTS_BET_PLACED_USER: 197,
            D7_GAMES_BET_PLACED_USER: 502,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 327.51,
            D7_GAMES_BET_FLOW: 21463.7,
            D7_TOTAL_BET_FLOW: 21791.21,

            // 留存
            D1_retained_users: 526,
            D7_retained_users: 89,
          },
          {
            date: "2025-12-25", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1610,
            D0_unique_purchase: 634,
            D0_PURCHASE_VALUE: 1521.1,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 562,
            D0_SPORTS_BET_PLACED_USER: 315,
            D0_GAMES_BET_PLACED_USER: 358,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 341.39,
            D0_GAMES_BET_FLOW: 4900.07,
            D0_TOTAL_BET_FLOW: 5241.46,

            // 付费 & 投注（D7）
            D7_unique_purchase: 798,
            D7_PURCHASE_VALUE: 5856.99,
            D7_TOTAL_BET_PLACED_USER: 764,
            D7_SPORTS_BET_PLACED_USER: 466,
            D7_GAMES_BET_PLACED_USER: 527,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 4138.67,
            D7_GAMES_BET_FLOW: 24828.82,
            D7_TOTAL_BET_FLOW: 28967.49,

            // 留存
            D1_retained_users: 629,
            D7_retained_users: 169,
          },
          {
            date: "2025-12-25", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 947,
            D0_unique_purchase: 217,
            D0_PURCHASE_VALUE: 856.67,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 204,
            D0_SPORTS_BET_PLACED_USER: 73,
            D0_GAMES_BET_PLACED_USER: 168,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 33.61,
            D0_GAMES_BET_FLOW: 2050.89,
            D0_TOTAL_BET_FLOW: 2084.5,

            // 付费 & 投注（D7）
            D7_unique_purchase: 331,
            D7_PURCHASE_VALUE: 1622.99,
            D7_TOTAL_BET_PLACED_USER: 381,
            D7_SPORTS_BET_PLACED_USER: 238,
            D7_GAMES_BET_PLACED_USER: 257,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 170.51,
            D7_GAMES_BET_FLOW: 5174.29,
            D7_TOTAL_BET_FLOW: 5344.8,

            // 留存
            D1_retained_users: 225,
            D7_retained_users: 58,
          },
          {
            date: "2025-12-25", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 158,
            D0_unique_purchase: 47,
            D0_PURCHASE_VALUE: 503.36,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 44,
            D0_SPORTS_BET_PLACED_USER: 19,
            D0_GAMES_BET_PLACED_USER: 31,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 33.64,
            D0_GAMES_BET_FLOW: 544.55,
            D0_TOTAL_BET_FLOW: 578.18,

            // 付费 & 投注（D7）
            D7_unique_purchase: 56,
            D7_PURCHASE_VALUE: 650.65,
            D7_TOTAL_BET_PLACED_USER: 61,
            D7_SPORTS_BET_PLACED_USER: 33,
            D7_GAMES_BET_PLACED_USER: 44,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 114.29,
            D7_GAMES_BET_FLOW: 1270.06,
            D7_TOTAL_BET_FLOW: 1384.35,

            // 留存
            D1_retained_users: 53,
            D7_retained_users: 16,
          },
          {
            date: "2025-12-26", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 434,
            D0_unique_purchase: 264,
            D0_PURCHASE_VALUE: 15157.92,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 252,
            D0_SPORTS_BET_PLACED_USER: 107,
            D0_GAMES_BET_PLACED_USER: 189,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 2863.54,
            D0_GAMES_BET_FLOW: 9611.78,
            D0_TOTAL_BET_FLOW: 12475.32,

            // 付费 & 投注（D7）
            D7_unique_purchase: 294,
            D7_PURCHASE_VALUE: 56136.27,
            D7_TOTAL_BET_PLACED_USER: 288,
            D7_SPORTS_BET_PLACED_USER: 154,
            D7_GAMES_BET_PLACED_USER: 223,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 59734.48,
            D7_GAMES_BET_FLOW: 25116.52,
            D7_TOTAL_BET_FLOW: 84851,

            // 留存
            D1_retained_users: 204,
            D7_retained_users: 74,
          },
          {
            date: "2025-12-26", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1645,
            D0_unique_purchase: 397,
            D0_PURCHASE_VALUE: 6923.87,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 414,
            D0_SPORTS_BET_PLACED_USER: 104,
            D0_GAMES_BET_PLACED_USER: 354,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 204.64,
            D0_GAMES_BET_FLOW: 18128.85,
            D0_TOTAL_BET_FLOW: 18333.49,

            // 付费 & 投注（D7）
            D7_unique_purchase: 579,
            D7_PURCHASE_VALUE: 9259.17,
            D7_TOTAL_BET_PLACED_USER: 678,
            D7_SPORTS_BET_PLACED_USER: 263,
            D7_GAMES_BET_PLACED_USER: 548,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 747.47,
            D7_GAMES_BET_FLOW: 25393.64,
            D7_TOTAL_BET_FLOW: 26141.12,

            // 留存
            D1_retained_users: 676,
            D7_retained_users: 91,
          },
          {
            date: "2025-12-26", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1561,
            D0_unique_purchase: 611,
            D0_PURCHASE_VALUE: 1111.03,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 551,
            D0_SPORTS_BET_PLACED_USER: 308,
            D0_GAMES_BET_PLACED_USER: 347,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 397.75,
            D0_GAMES_BET_FLOW: 3599.76,
            D0_TOTAL_BET_FLOW: 3997.5,

            // 付费 & 投注（D7）
            D7_unique_purchase: 751,
            D7_PURCHASE_VALUE: 3828.17,
            D7_TOTAL_BET_PLACED_USER: 743,
            D7_SPORTS_BET_PLACED_USER: 462,
            D7_GAMES_BET_PLACED_USER: 506,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2665.1,
            D7_GAMES_BET_FLOW: 10220.1,
            D7_TOTAL_BET_FLOW: 12885.21,

            // 留存
            D1_retained_users: 624,
            D7_retained_users: 144,
          },
          {
            date: "2025-12-26", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1423,
            D0_unique_purchase: 279,
            D0_PURCHASE_VALUE: 935.59,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 348,
            D0_SPORTS_BET_PLACED_USER: 202,
            D0_GAMES_BET_PLACED_USER: 195,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 92.88,
            D0_GAMES_BET_FLOW: 3196.57,
            D0_TOTAL_BET_FLOW: 3289.45,

            // 付费 & 投注（D7）
            D7_unique_purchase: 528,
            D7_PURCHASE_VALUE: 2205.08,
            D7_TOTAL_BET_PLACED_USER: 616,
            D7_SPORTS_BET_PLACED_USER: 381,
            D7_GAMES_BET_PLACED_USER: 368,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 448.14,
            D7_GAMES_BET_FLOW: 8382.73,
            D7_TOTAL_BET_FLOW: 8830.88,

            // 留存
            D1_retained_users: 414,
            D7_retained_users: 150,
          },
          {
            date: "2025-12-26", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 150,
            D0_unique_purchase: 52,
            D0_PURCHASE_VALUE: 547.51,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 50,
            D0_SPORTS_BET_PLACED_USER: 34,
            D0_GAMES_BET_PLACED_USER: 22,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 195.52,
            D0_GAMES_BET_FLOW: 845.6,
            D0_TOTAL_BET_FLOW: 1041.12,

            // 付费 & 投注（D7）
            D7_unique_purchase: 65,
            D7_PURCHASE_VALUE: 746.85,
            D7_TOTAL_BET_PLACED_USER: 67,
            D7_SPORTS_BET_PLACED_USER: 44,
            D7_GAMES_BET_PLACED_USER: 36,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 439.01,
            D7_GAMES_BET_FLOW: 1294.64,
            D7_TOTAL_BET_FLOW: 1733.65,

            // 留存
            D1_retained_users: 57,
            D7_retained_users: 15,
          },
          {
            date: "2025-12-27", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 846,
            D0_unique_purchase: 605,
            D0_PURCHASE_VALUE: 60408.69,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 569,
            D0_SPORTS_BET_PLACED_USER: 286,
            D0_GAMES_BET_PLACED_USER: 357,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 5119.73,
            D0_GAMES_BET_FLOW: 21907.76,
            D0_TOTAL_BET_FLOW: 27027.49,

            // 付费 & 投注（D7）
            D7_unique_purchase: 638,
            D7_PURCHASE_VALUE: 175332.69,
            D7_TOTAL_BET_PLACED_USER: 639,
            D7_SPORTS_BET_PLACED_USER: 422,
            D7_GAMES_BET_PLACED_USER: 425,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 144987.59,
            D7_GAMES_BET_FLOW: 32941.07,
            D7_TOTAL_BET_FLOW: 177928.66,

            // 留存
            D1_retained_users: 373,
            D7_retained_users: 107,
          },
          {
            date: "2025-12-27", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1980,
            D0_unique_purchase: 539,
            D0_PURCHASE_VALUE: 14114.98,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 541,
            D0_SPORTS_BET_PLACED_USER: 139,
            D0_GAMES_BET_PLACED_USER: 444,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 357.05,
            D0_GAMES_BET_FLOW: 17281.22,
            D0_TOTAL_BET_FLOW: 17638.27,

            // 付费 & 投注（D7）
            D7_unique_purchase: 787,
            D7_PURCHASE_VALUE: 17094.68,
            D7_TOTAL_BET_PLACED_USER: 838,
            D7_SPORTS_BET_PLACED_USER: 233,
            D7_GAMES_BET_PLACED_USER: 719,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 657.65,
            D7_GAMES_BET_FLOW: 24850.56,
            D7_TOTAL_BET_FLOW: 25508.21,

            // 留存
            D1_retained_users: 743,
            D7_retained_users: 120,
          },
          {
            date: "2025-12-27", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1622,
            D0_unique_purchase: 713,
            D0_PURCHASE_VALUE: 1937.83,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 614,
            D0_SPORTS_BET_PLACED_USER: 331,
            D0_GAMES_BET_PLACED_USER: 398,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 533.59,
            D0_GAMES_BET_FLOW: 4968.26,
            D0_TOTAL_BET_FLOW: 5501.84,

            // 付费 & 投注（D7）
            D7_unique_purchase: 855,
            D7_PURCHASE_VALUE: 4932.79,
            D7_TOTAL_BET_PLACED_USER: 807,
            D7_SPORTS_BET_PLACED_USER: 484,
            D7_GAMES_BET_PLACED_USER: 554,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1311.26,
            D7_GAMES_BET_FLOW: 22838.71,
            D7_TOTAL_BET_FLOW: 24149.97,

            // 留存
            D1_retained_users: 632,
            D7_retained_users: 197,
          },
          {
            date: "2025-12-27", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1030,
            D0_unique_purchase: 284,
            D0_PURCHASE_VALUE: 1967.58,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 299,
            D0_SPORTS_BET_PLACED_USER: 147,
            D0_GAMES_BET_PLACED_USER: 194,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 156.16,
            D0_GAMES_BET_FLOW: 2548.14,
            D0_TOTAL_BET_FLOW: 2704.3,

            // 付费 & 投注（D7）
            D7_unique_purchase: 375,
            D7_PURCHASE_VALUE: 3452.73,
            D7_TOTAL_BET_PLACED_USER: 406,
            D7_SPORTS_BET_PLACED_USER: 223,
            D7_GAMES_BET_PLACED_USER: 290,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 449.76,
            D7_GAMES_BET_FLOW: 11188.75,
            D7_TOTAL_BET_FLOW: 11638.51,

            // 留存
            D1_retained_users: 318,
            D7_retained_users: 68,
          },
          {
            date: "2025-12-27", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 263,
            D0_unique_purchase: 77,
            D0_PURCHASE_VALUE: 705.11,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 81,
            D0_SPORTS_BET_PLACED_USER: 49,
            D0_GAMES_BET_PLACED_USER: 45,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 563.19,
            D0_GAMES_BET_FLOW: 782.08,
            D0_TOTAL_BET_FLOW: 1345.27,

            // 付费 & 投注（D7）
            D7_unique_purchase: 90,
            D7_PURCHASE_VALUE: 1488.15,
            D7_TOTAL_BET_PLACED_USER: 106,
            D7_SPORTS_BET_PLACED_USER: 66,
            D7_GAMES_BET_PLACED_USER: 70,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1143.54,
            D7_GAMES_BET_FLOW: 2919.41,
            D7_TOTAL_BET_FLOW: 4062.95,

            // 留存
            D1_retained_users: 101,
            D7_retained_users: 22,
          },
          {
            date: "2025-12-28", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 477,
            D0_unique_purchase: 240,
            D0_PURCHASE_VALUE: 16848.08,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 216,
            D0_SPORTS_BET_PLACED_USER: 119,
            D0_GAMES_BET_PLACED_USER: 123,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 929.3,
            D0_GAMES_BET_FLOW: 20720.87,
            D0_TOTAL_BET_FLOW: 21650.17,

            // 付费 & 投注（D7）
            D7_unique_purchase: 279,
            D7_PURCHASE_VALUE: 56840.42,
            D7_TOTAL_BET_PLACED_USER: 280,
            D7_SPORTS_BET_PLACED_USER: 180,
            D7_GAMES_BET_PLACED_USER: 177,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 64420.8,
            D7_GAMES_BET_FLOW: 35573.9,
            D7_TOTAL_BET_FLOW: 99994.7,

            // 留存
            D1_retained_users: 207,
            D7_retained_users: 81,
          },
          {
            date: "2025-12-28", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 2599,
            D0_unique_purchase: 565,
            D0_PURCHASE_VALUE: 8943.97,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 569,
            D0_SPORTS_BET_PLACED_USER: 106,
            D0_GAMES_BET_PLACED_USER: 497,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 285.04,
            D0_GAMES_BET_FLOW: 13294.29,
            D0_TOTAL_BET_FLOW: 13579.33,

            // 付费 & 投注（D7）
            D7_unique_purchase: 921,
            D7_PURCHASE_VALUE: 11108.71,
            D7_TOTAL_BET_PLACED_USER: 1009,
            D7_SPORTS_BET_PLACED_USER: 238,
            D7_GAMES_BET_PLACED_USER: 885,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 578.53,
            D7_GAMES_BET_FLOW: 23523.72,
            D7_TOTAL_BET_FLOW: 24102.26,

            // 留存
            D1_retained_users: 917,
            D7_retained_users: 127,
          },
          {
            date: "2025-12-28", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1753,
            D0_unique_purchase: 689,
            D0_PURCHASE_VALUE: 2413.19,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 588,
            D0_SPORTS_BET_PLACED_USER: 301,
            D0_GAMES_BET_PLACED_USER: 393,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 271.37,
            D0_GAMES_BET_FLOW: 2828.03,
            D0_TOTAL_BET_FLOW: 3099.4,

            // 付费 & 投注（D7）
            D7_unique_purchase: 871,
            D7_PURCHASE_VALUE: 7060.14,
            D7_TOTAL_BET_PLACED_USER: 815,
            D7_SPORTS_BET_PLACED_USER: 470,
            D7_GAMES_BET_PLACED_USER: 568,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2421.22,
            D7_GAMES_BET_FLOW: 24531.74,
            D7_TOTAL_BET_FLOW: 26952.96,

            // 留存
            D1_retained_users: 590,
            D7_retained_users: 162,
          },
          {
            date: "2025-12-28", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1138,
            D0_unique_purchase: 292,
            D0_PURCHASE_VALUE: 1580.04,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 297,
            D0_SPORTS_BET_PLACED_USER: 139,
            D0_GAMES_BET_PLACED_USER: 204,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 118.13,
            D0_GAMES_BET_FLOW: 1963.84,
            D0_TOTAL_BET_FLOW: 2081.97,

            // 付费 & 投注（D7）
            D7_unique_purchase: 419,
            D7_PURCHASE_VALUE: 7562.4,
            D7_TOTAL_BET_PLACED_USER: 454,
            D7_SPORTS_BET_PLACED_USER: 262,
            D7_GAMES_BET_PLACED_USER: 290,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 353.89,
            D7_GAMES_BET_FLOW: 27426.52,
            D7_TOTAL_BET_FLOW: 27780.41,

            // 留存
            D1_retained_users: 326,
            D7_retained_users: 69,
          },
          {
            date: "2025-12-28", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 268,
            D0_unique_purchase: 52,
            D0_PURCHASE_VALUE: 152.4,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 53,
            D0_SPORTS_BET_PLACED_USER: 25,
            D0_GAMES_BET_PLACED_USER: 36,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 30.29,
            D0_GAMES_BET_FLOW: 331.97,
            D0_TOTAL_BET_FLOW: 362.27,

            // 付费 & 投注（D7）
            D7_unique_purchase: 65,
            D7_PURCHASE_VALUE: 359.2,
            D7_TOTAL_BET_PLACED_USER: 79,
            D7_SPORTS_BET_PLACED_USER: 36,
            D7_GAMES_BET_PLACED_USER: 59,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 128.79,
            D7_GAMES_BET_FLOW: 974.54,
            D7_TOTAL_BET_FLOW: 1103.33,

            // 留存
            D1_retained_users: 77,
            D7_retained_users: 18,
          },
          {
            date: "2025-12-29", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 431,
            D0_unique_purchase: 253,
            D0_PURCHASE_VALUE: 13987.46,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 237,
            D0_SPORTS_BET_PLACED_USER: 96,
            D0_GAMES_BET_PLACED_USER: 170,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 132.16,
            D0_GAMES_BET_FLOW: 7051.98,
            D0_TOTAL_BET_FLOW: 7184.14,

            // 付费 & 投注（D7）
            D7_unique_purchase: 279,
            D7_PURCHASE_VALUE: 23091.54,
            D7_TOTAL_BET_PLACED_USER: 280,
            D7_SPORTS_BET_PLACED_USER: 131,
            D7_GAMES_BET_PLACED_USER: 210,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2453.07,
            D7_GAMES_BET_FLOW: 45917.42,
            D7_TOTAL_BET_FLOW: 48370.48,

            // 留存
            D1_retained_users: 179,
            D7_retained_users: 47,
          },
          {
            date: "2025-12-29", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 2818,
            D0_unique_purchase: 620,
            D0_PURCHASE_VALUE: 10118.45,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 626,
            D0_SPORTS_BET_PLACED_USER: 124,
            D0_GAMES_BET_PLACED_USER: 541,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 679.15,
            D0_GAMES_BET_FLOW: 14947.83,
            D0_TOTAL_BET_FLOW: 15626.98,

            // 付费 & 投注（D7）
            D7_unique_purchase: 891,
            D7_PURCHASE_VALUE: 15641.4,
            D7_TOTAL_BET_PLACED_USER: 983,
            D7_SPORTS_BET_PLACED_USER: 266,
            D7_GAMES_BET_PLACED_USER: 807,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1241.47,
            D7_GAMES_BET_FLOW: 35511.47,
            D7_TOTAL_BET_FLOW: 36752.94,

            // 留存
            D1_retained_users: 918,
            D7_retained_users: 122,
          },
          {
            date: "2025-12-29", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1706,
            D0_unique_purchase: 688,
            D0_PURCHASE_VALUE: 5095.3,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 596,
            D0_SPORTS_BET_PLACED_USER: 306,
            D0_GAMES_BET_PLACED_USER: 392,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 570.06,
            D0_GAMES_BET_FLOW: 12938.02,
            D0_TOTAL_BET_FLOW: 13508.07,

            // 付费 & 投注（D7）
            D7_unique_purchase: 836,
            D7_PURCHASE_VALUE: 9877.17,
            D7_TOTAL_BET_PLACED_USER: 797,
            D7_SPORTS_BET_PLACED_USER: 444,
            D7_GAMES_BET_PLACED_USER: 539,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1458.53,
            D7_GAMES_BET_FLOW: 38669.95,
            D7_TOTAL_BET_FLOW: 40128.48,

            // 留存
            D1_retained_users: 624,
            D7_retained_users: 138,
          },
          {
            date: "2025-12-29", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1432,
            D0_unique_purchase: 281,
            D0_PURCHASE_VALUE: 2283.4,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 363,
            D0_SPORTS_BET_PLACED_USER: 178,
            D0_GAMES_BET_PLACED_USER: 226,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 89.52,
            D0_GAMES_BET_FLOW: 3824.89,
            D0_TOTAL_BET_FLOW: 3914.41,

            // 付费 & 投注（D7）
            D7_unique_purchase: 480,
            D7_PURCHASE_VALUE: 5233.48,
            D7_TOTAL_BET_PLACED_USER: 517,
            D7_SPORTS_BET_PLACED_USER: 295,
            D7_GAMES_BET_PLACED_USER: 314,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 258.74,
            D7_GAMES_BET_FLOW: 13946.11,
            D7_TOTAL_BET_FLOW: 14204.86,

            // 留存
            D1_retained_users: 469,
            D7_retained_users: 88,
          },
          {
            date: "2025-12-29", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 402,
            D0_unique_purchase: 86,
            D0_PURCHASE_VALUE: 316.84,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 90,
            D0_SPORTS_BET_PLACED_USER: 36,
            D0_GAMES_BET_PLACED_USER: 64,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 65.03,
            D0_GAMES_BET_FLOW: 1038.32,
            D0_TOTAL_BET_FLOW: 1103.35,

            // 付费 & 投注（D7）
            D7_unique_purchase: 105,
            D7_PURCHASE_VALUE: 655.77,
            D7_TOTAL_BET_PLACED_USER: 118,
            D7_SPORTS_BET_PLACED_USER: 46,
            D7_GAMES_BET_PLACED_USER: 89,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 110.82,
            D7_GAMES_BET_FLOW: 2719.39,
            D7_TOTAL_BET_FLOW: 2830.21,

            // 留存
            D1_retained_users: 126,
            D7_retained_users: 23,
          },
          {
            date: "2025-12-30", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 383,
            D0_unique_purchase: 202,
            D0_PURCHASE_VALUE: 2139.38,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 193,
            D0_SPORTS_BET_PLACED_USER: 96,
            D0_GAMES_BET_PLACED_USER: 135,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 957.45,
            D0_GAMES_BET_FLOW: 4810.45,
            D0_TOTAL_BET_FLOW: 5767.9,

            // 付费 & 投注（D7）
            D7_unique_purchase: 237,
            D7_PURCHASE_VALUE: 4673.23,
            D7_TOTAL_BET_PLACED_USER: 236,
            D7_SPORTS_BET_PLACED_USER: 135,
            D7_GAMES_BET_PLACED_USER: 171,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 2148.74,
            D7_GAMES_BET_FLOW: 17884.92,
            D7_TOTAL_BET_FLOW: 20033.66,

            // 留存
            D1_retained_users: 166,
            D7_retained_users: 57,
          },
          {
            date: "2025-12-30", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 2633,
            D0_unique_purchase: 567,
            D0_PURCHASE_VALUE: 9195.95,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 572,
            D0_SPORTS_BET_PLACED_USER: 131,
            D0_GAMES_BET_PLACED_USER: 497,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 390.2,
            D0_GAMES_BET_FLOW: 14914.85,
            D0_TOTAL_BET_FLOW: 15305.05,

            // 付费 & 投注（D7）
            D7_unique_purchase: 737,
            D7_PURCHASE_VALUE: 11187.06,
            D7_TOTAL_BET_PLACED_USER: 845,
            D7_SPORTS_BET_PLACED_USER: 238,
            D7_GAMES_BET_PLACED_USER: 705,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 580.89,
            D7_GAMES_BET_FLOW: 21860.71,
            D7_TOTAL_BET_FLOW: 22441.6,

            // 留存
            D1_retained_users: 623,
            D7_retained_users: 117,
          },
          {
            date: "2025-12-30", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1703,
            D0_unique_purchase: 688,
            D0_PURCHASE_VALUE: 2221.27,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 605,
            D0_SPORTS_BET_PLACED_USER: 367,
            D0_GAMES_BET_PLACED_USER: 370,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 883.55,
            D0_GAMES_BET_FLOW: 8889.96,
            D0_TOTAL_BET_FLOW: 9773.51,

            // 付费 & 投注（D7）
            D7_unique_purchase: 853,
            D7_PURCHASE_VALUE: 10818.2,
            D7_TOTAL_BET_PLACED_USER: 821,
            D7_SPORTS_BET_PLACED_USER: 533,
            D7_GAMES_BET_PLACED_USER: 536,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 17728.56,
            D7_GAMES_BET_FLOW: 17873.11,
            D7_TOTAL_BET_FLOW: 35601.66,

            // 留存
            D1_retained_users: 599,
            D7_retained_users: 163,
          },
          {
            date: "2025-12-30", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1175,
            D0_unique_purchase: 285,
            D0_PURCHASE_VALUE: 800.54,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 334,
            D0_SPORTS_BET_PLACED_USER: 170,
            D0_GAMES_BET_PLACED_USER: 212,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 123.77,
            D0_GAMES_BET_FLOW: 2803.9,
            D0_TOTAL_BET_FLOW: 2927.67,

            // 付费 & 投注（D7）
            D7_unique_purchase: 411,
            D7_PURCHASE_VALUE: 2651.53,
            D7_TOTAL_BET_PLACED_USER: 466,
            D7_SPORTS_BET_PLACED_USER: 274,
            D7_GAMES_BET_PLACED_USER: 315,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 461.82,
            D7_GAMES_BET_FLOW: 12588.71,
            D7_TOTAL_BET_FLOW: 13050.53,

            // 留存
            D1_retained_users: 327,
            D7_retained_users: 91,
          },
          {
            date: "2025-12-30", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 293,
            D0_unique_purchase: 75,
            D0_PURCHASE_VALUE: 202.52,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 72,
            D0_SPORTS_BET_PLACED_USER: 47,
            D0_GAMES_BET_PLACED_USER: 34,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 42.75,
            D0_GAMES_BET_FLOW: 529.73,
            D0_TOTAL_BET_FLOW: 572.48,

            // 付费 & 投注（D7）
            D7_unique_purchase: 88,
            D7_PURCHASE_VALUE: 887.02,
            D7_TOTAL_BET_PLACED_USER: 99,
            D7_SPORTS_BET_PLACED_USER: 64,
            D7_GAMES_BET_PLACED_USER: 52,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 82.65,
            D7_GAMES_BET_FLOW: 5312.27,
            D7_TOTAL_BET_FLOW: 5394.92,

            // 留存
            D1_retained_users: 88,
            D7_retained_users: 28,
          },
          {
            date: "2025-12-31", // YYYY-MM-DD
            country: "GH", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 298,
            D0_unique_purchase: 146,
            D0_PURCHASE_VALUE: 1006.46,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 137,
            D0_SPORTS_BET_PLACED_USER: 61,
            D0_GAMES_BET_PLACED_USER: 98,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 968.05,
            D0_GAMES_BET_FLOW: 2197.93,
            D0_TOTAL_BET_FLOW: 3165.97,

            // 付费 & 投注（D7）
            D7_unique_purchase: 169,
            D7_PURCHASE_VALUE: 3814.85,
            D7_TOTAL_BET_PLACED_USER: 170,
            D7_SPORTS_BET_PLACED_USER: 90,
            D7_GAMES_BET_PLACED_USER: 127,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 1959.04,
            D7_GAMES_BET_FLOW: 15022.28,
            D7_TOTAL_BET_FLOW: 16981.31,

            // 留存
            D1_retained_users: 141,
            D7_retained_users: 46,
          },
          {
            date: "2025-12-31", // YYYY-MM-DD
            country: "KE", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1539,
            D0_unique_purchase: 332,
            D0_PURCHASE_VALUE: 1133.14,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 337,
            D0_SPORTS_BET_PLACED_USER: 69,
            D0_GAMES_BET_PLACED_USER: 296,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 112.8,
            D0_GAMES_BET_FLOW: 14261.67,
            D0_TOTAL_BET_FLOW: 14374.48,

            // 付费 & 投注（D7）
            D7_unique_purchase: 509,
            D7_PURCHASE_VALUE: 2508.82,
            D7_TOTAL_BET_PLACED_USER: 586,
            D7_SPORTS_BET_PLACED_USER: 169,
            D7_GAMES_BET_PLACED_USER: 495,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 287.41,
            D7_GAMES_BET_FLOW: 19992.34,
            D7_TOTAL_BET_FLOW: 20279.76,

            // 留存
            D1_retained_users: 517,
            D7_retained_users: 95,
          },
          {
            date: "2025-12-31", // YYYY-MM-DD
            country: "NG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 1590,
            D0_unique_purchase: 637,
            D0_PURCHASE_VALUE: 1756.42,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 565,
            D0_SPORTS_BET_PLACED_USER: 297,
            D0_GAMES_BET_PLACED_USER: 371,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 164.3,
            D0_GAMES_BET_FLOW: 17767.54,
            D0_TOTAL_BET_FLOW: 17931.84,

            // 付费 & 投注（D7）
            D7_unique_purchase: 784,
            D7_PURCHASE_VALUE: 4879.26,
            D7_TOTAL_BET_PLACED_USER: 753,
            D7_SPORTS_BET_PLACED_USER: 450,
            D7_GAMES_BET_PLACED_USER: 527,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 654.15,
            D7_GAMES_BET_FLOW: 34945.73,
            D7_TOTAL_BET_FLOW: 35599.89,

            // 留存
            D1_retained_users: 569,
            D7_retained_users: 178,
          },
          {
            date: "2025-12-31", // YYYY-MM-DD
            country: "TZ", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 853,
            D0_unique_purchase: 205,
            D0_PURCHASE_VALUE: 757.16,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 219,
            D0_SPORTS_BET_PLACED_USER: 67,
            D0_GAMES_BET_PLACED_USER: 175,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 44.84,
            D0_GAMES_BET_FLOW: 3190.07,
            D0_TOTAL_BET_FLOW: 3234.91,

            // 付费 & 投注（D7）
            D7_unique_purchase: 339,
            D7_PURCHASE_VALUE: 2447.68,
            D7_TOTAL_BET_PLACED_USER: 399,
            D7_SPORTS_BET_PLACED_USER: 205,
            D7_GAMES_BET_PLACED_USER: 290,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 164.02,
            D7_GAMES_BET_FLOW: 8258.46,
            D7_TOTAL_BET_FLOW: 8422.48,

            // 留存
            D1_retained_users: 335,
            D7_retained_users: 66,
          },
          {
            date: "2025-12-31", // YYYY-MM-DD
            country: "UG", // GH / KE / NG / TZ / UG

            // 注册 & 付费（D0）
            registration: 199,
            D0_unique_purchase: 36,
            D0_PURCHASE_VALUE: 194.93,

            // 投注人数（D0）
            D0_TOTAL_BET_PLACED_USER: 36,
            D0_SPORTS_BET_PLACED_USER: 17,
            D0_GAMES_BET_PLACED_USER: 26,

            // 流水（D0）
            D0_SPORTS_BET_FLOW: 8.97,
            D0_GAMES_BET_FLOW: 456.99,
            D0_TOTAL_BET_FLOW: 465.96,

            // 付费 & 投注（D7）
            D7_unique_purchase: 49,
            D7_PURCHASE_VALUE: 561.44,
            D7_TOTAL_BET_PLACED_USER: 61,
            D7_SPORTS_BET_PLACED_USER: 31,
            D7_GAMES_BET_PLACED_USER: 48,

            // 流水（D7）
            D7_SPORTS_BET_FLOW: 33.53,
            D7_GAMES_BET_FLOW: 2077.53,
            D7_TOTAL_BET_FLOW: 2111.05,

            // 留存
            D1_retained_users: 68,
            D7_retained_users: 18,
          },
        ],
        // 在这里继续追加新的月份：
        // "2025-11": [ ... ],
        // "2025-12": [ ... ]
      };




