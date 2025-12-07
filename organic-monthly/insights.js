// ===========================
// 自然量看板 · 模块解读文案
// ===========================
//
// 使用方式：
// 1) 默认文案写在 __default__ 里（所有月份通用）；
// 2) 如果某个月要单独写，在对应 "YYYY-MM" 下覆盖同名模块即可；
// 3) 支持换行：用模板字符串（反引号）写多行更省事。
//
// 模块 id 对照：
// - registration  自然量注册数
// - payrate       D0/D7 付费率
// - arppu         D0/D7 ARPPU
// - betflow       D0/D7 人均流水（总/体育/游戏）
// - playerMix     体育玩家/游戏玩家占比
// - retention     次留/七留
//
// 注意：这只是文案文件，不参与计算。

const INSIGHTS_ORGANIC_MONTHLY = {
  __default__: {
    registration: ``,
    payrate: ``,
    arppu: ``,
    betflow: ``,
    playerMix: ``,
    retention: ``,
  },

  // 示例：给某个月写“定制文案”，会覆盖 __default__
  // "2025-12": {
  //   registration: `12 月注册环比 +x%（单位：人）。\n主要拉动：GH、NG。\n异常：KE 在 12-18 有一次渠道波动。`,
  // }
};
