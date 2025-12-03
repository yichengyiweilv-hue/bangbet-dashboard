
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

        // 在这里继续追加新的月份：
        // "2025-11": [ ... ],
        // "2025-12": [ ... ]
      };






      // ===========================
      // 0.1 数据分析文案入口（按图表 × 月份）
      // ===========================
      //
      // 用法说明：
      // - key 对应图表：
      //   reg       → 自然注册量 · 月度 / 日度对比（card-registrations）
      //   pay       → 自然用户 D0 / D7 付费率（card-payrate）
      //   arppu     → 自然用户 D0 / D7 ARPPU（card-arppu）
      //   flow      → 自然用户 D0 / D7 人均流水（card-flow）
      //   ratio     → 体育 vs 游戏玩家比例（自然量）（card-ratio）
      //   retention → 自然用户次日 / 7 日留存率（card-retention）
      //
      // - 内层 key 是月份 "YYYY-MM"，例如 "2025-09"。
      // - value 是一整段字符串，可以多行，后续你按月补充即可。

      const ANALYSIS_TEXT = {
        // 1. 自然注册量 · 月度 / 日度对比
        reg: {
          // "2025-09": "这里写 2025-09 的自然注册盘分析……",
          // "2025-10": "这里写 2025-10 的自然注册盘分析……",
        },

        // 2. 自然用户 D0 / D7 付费率
        pay: {
          // "2025-09": "这里写 2025-09 的自然付费率分析……",
        },

        // 3. 自然用户 D0 / D7 ARPPU
        arppu: {
          // "2025-09": "这里写 2025-09 的 ARPPU 分析……",
        },

        // 4. 自然用户 D0 / D7 人均流水（体育 / 游戏 / 总）
        flow: {
          // "2025-09": "这里写 2025-09 的人均流水 / 深度分析……",
        },

        // 5. 体育 vs 游戏玩家比例（自然量）
        ratio: {
          // "2025-09": "这里写 2025-09 的体育 / 游戏结构分析……",
        },

        // 6. 自然用户次日 / 7 日留存率
        retention: {
          // "2025-09": "这里写 2025-09 的留存 & 流失分析……",
        },
      };
