/* organic-data.js — 自然量（日粒度，按月分组）
 * 必填字段：date(YYYY-MM-DD), country(如 "GH"), registration(人数)
 * 可选字段：D0_unique_purchase / D7_unique_purchase / D0_PURCHASE_VALUE ...（后续模块用）
 */
(function () {
  "use strict";

  const root = window;
  root.RAW_ORGANIC_BY_MONTH = root.RAW_ORGANIC_BY_MONTH || {};

  // =========================
  // 2025-09（把这里替换成你9月全量日数据）
  // =========================
  root.RAW_ORGANIC_BY_MONTH["2025-09"] = [
    // 建议：每行 = 1 天 × 1 国家；没数据可以写 0 或者不写该行（不写会导致折线断点）
    { date: "2025-09-01", country: "GH", registration: 123 },
    { date: "2025-09-01", country: "KE", registration: 45 },
    { date: "2025-09-02", country: "GH", registration: 110 },
    { date: "2025-09-02", country: "KE", registration: 40 }
    // ...一直到 2025-09-30（或 09-31）
  ];

  // =========================
  // 2025-10（把这里替换成你10月全量日数据）
  // =========================
  root.RAW_ORGANIC_BY_MONTH["2025-10"] = [
    { date: "2025-10-01", country: "GH", registration: 100 },
    { date: "2025-10-01", country: "KE", registration: 80 }
    // ...一直到 2025-10-31
  ];

  // =========================
  // 未来新增月份：复制一段，改 key + date 前缀（不要改上面历史月份）
  // =========================
  // root.RAW_ORGANIC_BY_MONTH["2025-11"] = [
  //   { date: "2025-11-01", country: "GH", registration: 0 },
  //   { date: "2025-11-01", country: "KE", registration: 0 }
  // ];
})();
