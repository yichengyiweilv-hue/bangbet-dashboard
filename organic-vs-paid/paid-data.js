/* paid-data.js — 买量（日粒度，按月分组）
 * 必填字段：date(YYYY-MM-DD), country, registration
 * 推荐字段：spent(花费), media, productType（后续想按媒体拆会用到）
 */
(function () {
  "use strict";

  const root = window;
  root.RAW_PAID_BY_MONTH = root.RAW_PAID_BY_MONTH || {};

  // =========================
  // 2025-09（替换成你9月全量日数据）
  // =========================
  root.RAW_PAID_BY_MONTH["2025-09"] = [
    {
      date: "2025-09-01",
      country: "GH",
      // 可选：买量拆分字段
      media: "FB",
      productType: "app",
      spent: 500.0,
      // 必填：注册
      registration: 200
    }
    // ...更多国家/日期/媒体
  ];

  // =========================
  // 2025-10（替换成你10月全量日数据）
  // =========================
  root.RAW_PAID_BY_MONTH["2025-10"] = [
    {
      date: "2025-10-01",
      country: "GH",
      media: "FB",
      productType: "app",
      spent: 500.0,
      registration: 200
    },
    {
      date: "2025-10-01",
      country: "KE",
      media: "FB",
      productType: "app",
      spent: 260.0,
      registration: 120
    }
  ];

  // 未来新增月份：同 organic-data.js 的写法复制即可
})();
