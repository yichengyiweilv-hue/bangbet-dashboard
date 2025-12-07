/**
 * paid-analytics.js
 * -----------------------------------------
 * 用途：存放“买量看板”的数据分析文案（按 模块key × 月份YYYY-MM）
 *
 * 规则：
 * - 模块key 必须跟 index.html 里每个模块的 data-analysis-key 一致
 * - 支持换行：推荐用模板字符串 `...` 直接写多行（也可用 \n）
 * - 未填写月份：页面会显示“暂未填写该月份的数据分析文案。”
 *
 * 你每月更新只需要改这里：把对应模块、对应月份的字符串写上即可。
 */

(function () {
  // 你只需要维护这个对象：模块key × 月份
  // 月份示例：已按你 paid-data.js 里现有月份（2025-09 / 2025-10）先占位
  const TEXT = {
    // 1) 买量注册数（registration）
    reg: {
      "2025-09": "",
      "2025-10": "",
    },

    // 2) 注册单价（spent / registration）
    reg_cpa: {
      "2025-09": "",
      "2025-10": "",
    },

    // 3) D0/D7 付费率（D0_unique_purchase/registration；D7_unique_purchase/registration）
    pay_rate: {
      "2025-09": "",
      "2025-10": "",
    },

    // 4) D0/D7 ARPPU（D0_PURCHASE_VALUE/D0_unique_purchase；D7_PURCHASE_VALUE/D7_unique_purchase）
    arppu: {
      "2025-09": "",
      "2025-10": "",
    },

    // 5) D0/D7 充值单价（spent/D0_unique_purchase；spent/D7_unique_purchase）
    cpp: {
      "2025-09": "",
      "2025-10": "",
    },

    // 6) D0/D7 充值 ROI（D0_PURCHASE_VALUE/spent；D7_PURCHASE_VALUE/spent）
    roi: {
      "2025-09": "",
      "2025-10": "",
    },

    // 7) D0/D7 人均流水（总/体育/游戏：BET_FLOW / BET_PLACED_USER）
    flow: {
      "2025-09": "",
      "2025-10": "",
    },

    // 8) 体育玩家/游戏玩家占比（你新增模块 paid-module-sg-share.js）
    // 说明：模块 key 必须是 sg_share（与你模块里 const MODULE_KEY = "sg_share" 一致）
    sg_share: {
      "2025-09": "",
      "2025-10": "",
    },

    // 9) 留存（次留/七留：D1_retained_users/registration；D7_retained_users/registration）
    retention: {
      "2025-09": "",
      "2025-10": "",
    },
  };

  // 自动补齐：当 paid-data.js 新增了月份，这里会自动给每个模块补一个空字符串
  // 这样你只需要“写文案”，不用每月再加 key，降低写错括号/逗号风险
  try {
    const months =
      window.RAW_PAID_BY_MONTH && typeof window.RAW_PAID_BY_MONTH === "object"
        ? Object.keys(window.RAW_PAID_BY_MONTH).sort()
        : [];

    Object.keys(TEXT).forEach((moduleKey) => {
      if (!TEXT[moduleKey] || typeof TEXT[moduleKey] !== "object") {
        TEXT[moduleKey] = {};
      }
      months.forEach((m) => {
        if (!(m in TEXT[moduleKey])) TEXT[moduleKey][m] = "";
      });
    });
  } catch (e) {
    // 忽略：不影响页面运行
  }

  // 页面读取：index.html 的核心脚本使用 window.ANALYSIS_TEXT[key][month]
  window.PAID_ANALYSIS_TEXT = TEXT;
  window.ANALYSIS_TEXT = window.PAID_ANALYSIS_TEXT;
})();
