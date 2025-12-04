/* analysis-payrate-vs-paid.js — 文案：D0 / D7 付费率（自然 vs 买量） */
(function () {
  "use strict";

  const root = window;
  root.DASHBOARD_ANALYSIS_TEXT = root.DASHBOARD_ANALYSIS_TEXT || {};

  // 这个 KEY 必须和你模块2里 getAnalysisText("这里的key", month) 完全一致
  const KEY = "payrate_vs_paid";

  root.DASHBOARD_ANALYSIS_TEXT[KEY] = root.DASHBOARD_ANALYSIS_TEXT[KEY] || {};

  // month 必须用下拉筛选器里的值：YYYY-MM（例如 2025-09 / 2025-10）
  root.DASHBOARD_ANALYSIS_TEXT[KEY]["2025-10"] = `
10月测试文案
- 这里可以写多行
- 也可以按国家/渠道拆原因
`.trim();

  root.DASHBOARD_ANALYSIS_TEXT[KEY]["2025-09"] = `
9月测试文案
- 这里也可以写多行
`.trim();
})();
