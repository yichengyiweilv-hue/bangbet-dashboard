
/**
 * paid-analytics.js
 * -----------------------------------------
 * 用途：存放“买量看板”的数据分析文案（按 模块key × 月份YYYY-MM）
 * - 支持换行：用 \n
 * - 未填写月份：页面会显示“暂未填写该月份的数据分析文案。”
 *
 * 你每月更新只需要改这里：补当月对应模块的文本即可。
 */

window.PAID_ANALYSIS_TEXT = {
  // 1) 买量注册数
  reg: {
    "2025-09": "",
    "2025-10": ""
  },

  // 2) 注册单价（CPA = spent / registration）
  reg_cpa: {
    "2025-09": "",
    "2025-10": ""
  },

  // 3) D0/D7 付费率（D0_unique_purchase/registration；D7_unique_purchase/registration）
  pay_rate: {
    "2025-09": "",
    "2025-10": ""
  },

  // 4) D0/D7 ARPPU（PURCHASE_VALUE / unique_purchase）
  arppu: {
    "2025-09": "",
    "2025-10": ""
  },

  // 5) 充值单价/付费单价（CPP = spent / unique_purchase）
  cpp: {
    "2025-09": "",
    "2025-10": ""
  },

  // 6) D0/D7 充值 ROI（PURCHASE_VALUE / spent）
  roi: {
    "2025-09": "",
    "2025-10": ""
  },

  // 7) D0/D7 人均流水（BET_FLOW / BET_PLACED_USER；含 total/sports/games）
  flow: {
    "2025-09": "",
    "2025-10": ""
  },

  // 8) 留存（次留/七留：D1_retained_users/registration；D7_retained_users/registration）
  retention: {
    "2025-09": "",
    "2025-10": ""
  }
};

// 可选：兼容你 organic 看板里使用的变量名（如果你想复用一套通用函数）
// 页面会优先读 PAID_ANALYSIS_TEXT，但挂个别名不碍事。
window.ANALYSIS_TEXT = window.PAID_ANALYSIS_TEXT;
