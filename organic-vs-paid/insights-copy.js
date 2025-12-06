// organic-vs-paid/insights-copy.js
// 月度“数据分析文案库”：集中维护 6 个模块的解读位（可按月更新）
//
// 使用：
// 1) 在 index.html 引入：<script src="./insights-copy.js"></script>
// 2) 在任一模块里：
//    const ins = OVP.insights.get('m1-registration', '2025-11');
//    OVP.insights.render(mountEl, 'm1-registration', '2025-11');
//
(function () {
  window.OVP = window.OVP || {};

  function pad2(n) {
    var s = String(n);
    return s.length === 1 ? ('0' + s) : s;
  }

  // 支持：'YYYY-MM' / 'YYYY/MM' / 'YYYYMM' / 'YYYY-MM-DD' / Date
  function normalizeMonth(input) {
    if (!input) return null;

    if (input instanceof Date && !isNaN(input.getTime())) {
      return input.getFullYear() + '-' + pad2(input.getMonth() + 1);
    }

    var s = String(input).trim();
    var m;

    // YYYY-MM 或 YYYY/MM
    m = s.match(/^(\d{4})[-\/](\d{1,2})$/);
    if (m) {
      var y1 = Number(m[1]);
      var mm1 = Number(m[2]);
      if (mm1 >= 1 && mm1 <= 12) return y1 + '-' + pad2(mm1);
    }

    // YYYYMM
    m = s.match(/^(\d{4})(\d{2})$/);
    if (m) {
      var y2 = Number(m[1]);
      var mm2 = Number(m[2]);
      if (mm2 >= 1 && mm2 <= 12) return y2 + '-' + pad2(mm2);
    }

    // YYYY-MM-DD / YYYY/MM/DD
    m = s.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
    if (m) {
      var y3 = Number(m[1]);
      var mm3 = Number(m[2]);
      if (mm3 >= 1 && mm3 <= 12) return y3 + '-' + pad2(mm3);
    }

    return null;
  }

  function monthValue(key) {
    // key: YYYY-MM
    if (!key) return -1;
    var m = String(key).match(/^(\d{4})-(\d{2})$/);
    if (!m) return -1;
    return Number(m[1]) * 100 + Number(m[2]);
  }

  function listMonths(store) {
    var keys = Object.keys(store.months || {});
    keys.sort(function (a, b) { return monthValue(a) - monthValue(b); });
    return keys;
  }

  function latestMonth(store) {
    var keys = listMonths(store);
    return keys.length ? keys[keys.length - 1] : null;
  }

  function clone(obj) {
    // 文案对象层级浅，用 JSON 足够（避免引用串改）
    try { return JSON.parse(JSON.stringify(obj)); } catch (_e) { return obj; }
  }

  var MODULES = [
    { id: 'm1-registration', name: '自然量 vs 买量注册量' },
    { id: 'm2-payrate', name: 'D0 / D7 付费率' },
    { id: 'm3-arppu', name: 'D0 / D7 ARPPU' },
    { id: 'm4-betflow-percapita', name: 'D0 / D7 人均流水（体育 / 游戏 / 总）' },
    { id: 'm5-player-mix', name: '体育 vs 游戏玩家比例' },
    { id: 'm6-retention', name: '次日 / 7 日留存率' }
  ];

  // ======== 你主要维护这块：months ========
  // months[月][模块] = { topLine, bullets[], actions[] }
  // actions 结构：{ action, owner, due, impact }
  var STORE = {
    schemaVersion: 1,
    updatedAt: '2025-12-05',
    modules: MODULES,
    months: {
      // 建议：每个月复制这一段，填 6 个模块的文案
     '2025-09': {
  'm1-registration': {
    topLine: '2025-09 总注册 338,826；自然占比 33.2%，买量主力在 NG（占买量 53.3%）。',
    bullets: [
      '自然注册 112,425：NG 48,679（占自然 43.3%）> KE 26,176 > TZ 21,060；UG 4,360（当月无买量）。',
      '买量注册 226,401：NG 120,617（占买量 53.3%）> TZ 48,247 > KE 35,215 > GH 22,322。',
      'NG 总注册 169,296（占全盘 50.0%），但自然占比仅 28.8%，收量结构高度依赖买量。'
    ],
    actions: [
      { action: 'NG 买量注册按 media×productType 拆分，先把 GG-H5 这种大盘单独监控/限额', owner: 'UA', due: '2025-12-15', impact: '预期：注册结构更健康（D0 付费率、7 留不被拖累）' }
    ]
  },

  'm2-payrate': {
    topLine: '2025-09 付费率：自然 D0/D7=36.0%/46.6%，买量 31.0%/43.6%，买量短板在 NG。',
    bullets: [
      '自然 GH 最强：D0 50.6%、D7 62.8%；整体比买量高 +5.0pp（D0）/+3.0pp（D7）。',
      '买量 NG 偏低：D0 25.6%、D7 41.6；主要量来自 GG-H5：D0 19.3%（注册 85,377）。',
      '买量 TZ 相对最好：D0 40.0%、D7 48.6，可作为当月质量标杆。'
    ],
    actions: [
      { action: '买量 NG 设 D0 付费率门槛：GG-H5 低于 25% 先降预算/换素材', owner: 'UA', due: '2025-12-20', impact: '预期：买量 D0 付费率 +1~2pp（结构改善）' }
    ]
  },

  'm3-arppu': {
    topLine: '2025-09 ARPPU：自然 D0/D7=2.49/6.42 USD，买量 1.58/3.90 USD；差距主要由 NG 低客单拉开。',
    bullets: [
      '自然 GH D7 ARPPU 12.25 USD/付费人（当月最高），TZ 4.40（最低）。',
      '买量 NG ARPPU 偏低：D0 0.96、D7 1.77 USD/付费人；同月 GH 达 11.11 USD。',
      '建议 ARPPU 与付费率双看：买量若只追付费人数，容易堆低客单。'
    ],
    actions: [
      { action: 'NG 买量上新手礼包/阶梯充值 AB（拉 D7 ARPPU）', owner: '产品/增长', due: '2025-12-25', impact: '预期：D7 ARPPU +10%（定向渠道，方向性）' }
    ]
  },

  'm4-betflow-percapita': {
    topLine: '2025-09 人均流水（总）：自然 D0/D7=12.0/32.2 USD/下注用户，买量 7.5/20.9；游戏人均是主要贡献。',
    bullets: [
      '自然 D7：游戏人均 43.4 USD/下注用户，体育人均 6.9（差距约 6×）。',
      '买量 D7：NG 总人均 7.07 USD/下注用户，显著低于 KE 31.9、TZ 27.6。',
      '结合玩家结构看：体育型大盘如果留存/付费弱，会直接拖 D7 人均。'
    ],
    actions: [
      { action: '把 D7 总人均流水纳入买量放量 gate（<15 USD/下注用户不扩）', owner: '数据/UA', due: '2025-12-18', impact: '预期：减少低价值扩量（方向性）' }
    ]
  },

  'm5-player-mix': {
    topLine: '2025-09 结构：自然与买量都以“游戏+交叉”居多，但买量有明显体育型大盘。',
    bullets: [
      '自然：D0 体育/游戏占比 55.8%/62.9%，交叉 18.8%；D7 交叉升到 28.0%。',
      '买量：D0 体育/游戏占比 51.4%/63.2%，交叉 14.6%；D7 体育占比 61.8% 高于游戏 57.5%。',
      '买量 NG GG-H5 体育占比 93.3%（D0），但同时付费/留存偏弱，是结构风险点。'
    ],
    actions: [
      { action: '体育型买量入口加“游戏新手任务”导流，提升交叉用户占比', owner: '产品运营', due: '2025-12-28', impact: '预期：D7 交叉用户占比 +2~3pp（方向性）' }
    ]
  },

  'm6-retention': {
    topLine: '2025-09 留存：自然 次留/七留=37.8%/11.4%，买量 29.4%/6.7%；买量 NG 七留最低。',
    bullets: [
      '自然 GH、UG 七留 15.9%/16.1%（2025-09），显著高于整体 11.4%。',
      '买量 NG 七留 4.4%；其中 GG-H5 七留 2.3%（注册 85,377）是主要拖累。',
      '买量要稳质量：优先收敛低留存大盘，再谈拉量；否则 D7 付费与人均一起掉。'
    ],
    actions: [
      { action: 'NG 买量低留存组（GG-H5）做限额+落地页/引导改版测试', owner: 'UA/产品', due: '2025-12-22', impact: '预期：买量 7 留 +1.0pp（结构+体验，方向性）' }
    ]
  }
},

'2025-10': {
  'm1-registration': {
    topLine: '2025-10 总注册 290,534；自然 119,403（41.1%，较 2025-09 +7.9pp），买量主要在 NG 缩量。',
    bullets: [
      '买量注册 171,131，较 2025-09 -24.4%（-55,270）；其中 NG -67,262（120,617 → 53,355）是核心下滑。',
      '自然注册 119,403，较 2025-09 +6.2%（+6,978）；增长在 TZ +3,106、KE +2,012、NG +2,013。',
      '国家结构更均衡：NG 占全盘 35.8%（9 月 50.0%），KE/TZ 占比抬至 25.6%/24.4%。'
    ],
    actions: [
      { action: '复盘 NG 买量缩量原因（预算/媒体/产品形态），确认“量降质升”是否可控', owner: 'UA', due: '2025-12-13', impact: '预期：稳定量级，同时维持高付费率（方向性）' }
    ]
  },

  'm2-payrate': {
    topLine: '2025-10 付费率反转：买量 D0/D7=38.1%/46.4%，已高于自然 35.1%/45.6%。',
    bullets: [
      '买量 NG 拉升明显：D0 41.7%（较 9 月 +16.2pp）、D7 50.5%（+8.9pp）。',
      '结构解释：NG 买量从 9 月 GG-H5（D0 19.3%）转到 app（10 月 FB app D0 42.3%）。',
      '自然侧短板在 TZ/UG：TZ D0 25.6%（较 9 月 -5.7pp），UG D7 37.0%。'
    ],
    actions: [
      { action: '自然 TZ/UG 排查注册来源与新手链路（拉 D0 付费率），按来源做灰度修正', owner: '运营/产品', due: '2025-12-20', impact: '预期：自然 D0 付费率 +1pp（定向国家）' }
    ]
  },

  'm3-arppu': {
    topLine: '2025-10 ARPPU：自然 D0/D7=2.67/7.00 USD，买量 1.82/5.65 USD；买量 D7 客单显著改善。',
    bullets: [
      '买量 D7 ARPPU 较 9 月 +1.74 USD（3.90 → 5.65）；主要由 GH 拉动（23.33 USD/付费人）。',
      '买量 NG 仍偏低：D7 ARPPU 1.98 USD/付费人，和 GH/TZ（23.33/4.43）差距大。',
      '自然 GH 继续高客单：D7 ARPPU 17.93 USD/付费人（2025-10）。'
    ],
    actions: [
      { action: '核对 GH 买量高 ARPPU 是否大额活动/样本偏小，确认可规模化再加预算', owner: '数据/UA', due: '2025-12-18', impact: '预期：买量 D7 ARPPU 稳中提升（方向性）' }
    ]
  },

  'm4-betflow-percapita': {
    topLine: '2025-10 人均流水（总）抬升：自然 D7 37.1 USD/下注用户，买量 D7 37.3，基本追平自然。',
    bullets: [
      '买量 D7 总人均较 9 月 +16.4 USD（20.9 → 37.3）；同期 D7 游戏人均 45.2 USD/下注用户。',
      '极值：买量 GH D7 总人均 155.1 USD/下注用户，需关注异常波动与可复现性。',
      '自然 TZ D7 总人均 19.7 USD/下注用户（较 9 月 25.7 下滑），与 D0 付费率下降一致。'
    ],
    actions: [
      { action: '把 D7 总人均流水作为放量 gate（按国家/媒体），优先扩“高人均且高留存”的组', owner: 'UA', due: '2025-12-25', impact: '预期：提高整体价值密度（方向性）' }
    ]
  },

  'm5-player-mix': {
    topLine: '2025-10 买量玩家更“游戏化”：D0 游戏占比 79.5%（较 9 月 +16.2pp），体育占比降到 40.0%。',
    bullets: [
      '买量：D7 游戏占比 80.7%，交叉用户占比 28.9%（较 9 月 +9.6pp），跨品类更明显。',
      '自然结构相对稳定：D0 体育/游戏占比 54.7%/64.2%，交叉 18.9%；D7 交叉 27.7%。',
      '结构变化与渠道替换一致：9 月体育型 GG-H5 缩量后，整体更偏 app 的游戏用户。'
    ],
    actions: [
      { action: '加强“游戏→体育”交叉引导（任务/推荐位），放大交叉用户价值', owner: '产品运营', due: '2025-12-30', impact: '预期：交叉用户占比 +2pp（方向性）' }
    ]
  },

  'm6-retention': {
    topLine: '2025-10 留存：买量 次留/七留=30.6%/8.5%（较 9 月 +1.2pp/+1.8pp），自然七留 11.1%小幅回落。',
    bullets: [
      '买量 NG 七留 8.8%（较 9 月 4.4% +4.4pp），与付费率/人均提升同步。',
      '自然 GH 七留 15.4%依旧最高；TZ 七留 10.1%（较 9 月 -0.5pp）偏弱。',
      '结构解释：9 月低留存大盘（NG GG-H5 七留 2.3%）大幅收缩后，买量整体七留抬升。'
    ],
    actions: [
      { action: '买量继续对低留存组做限额+新手激励改版，目标七留 ≥9%', owner: 'UA/运营', due: '2025-12-27', impact: '预期：买量七留 +0.5~1.0pp（方向性）' }
    ]
  }
},

        }
      }
    }
  };

  function emptyInsight(moduleId) {
    var meta = null;
    for (var i = 0; i < MODULES.length; i++) if (MODULES[i].id === moduleId) meta = MODULES[i];
    return {
      topLine: '暂无本月文案：请在 insights-copy.js 里补齐。',
      bullets: [
        (meta ? ('模块：' + meta.name) : ('模块：' + moduleId)),
        '建议补充：一句话结论 + 2~3 条关键证据 + 1 条可执行动作。'
      ],
      actions: []
    };
  }

  function getInsight(moduleId, month) {
    var mKey = normalizeMonth(month);
    var months = STORE.months || {};

    // 1) 取指定月
    if (mKey && months[mKey] && months[mKey][moduleId]) {
      return clone(months[mKey][moduleId]);
    }

    // 2) 回退最新月
    var lm = latestMonth(STORE);
    if (lm && months[lm] && months[lm][moduleId]) {
      return clone(months[lm][moduleId]);
    }

    // 3) 空模板
    return emptyInsight(moduleId);
  }

  // 渲染：直接把“数据分析”展示位塞进 mountEl（模块内部自己决定放哪儿）
  function ensureInsightStyles() {
    if (document.getElementById('ovp-insights-style')) return;

    var style = document.createElement('style');
    style.id = 'ovp-insights-style';
    style.textContent = [
      '.ovp-analysis{margin-top:12px;padding:12px;border:1px solid var(--border, rgba(255,255,255,.12));',
      'border-radius:12px;background:rgba(255,255,255,.04)}',
      '.ovp-analysis .meta{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;',
      'font-size:12px;color:var(--muted, rgba(255,255,255,.62));margin-bottom:8px}',
      '.ovp-analysis .top{font-size:13px;color:var(--text, rgba(255,255,255,.92));font-weight:600;',
      'margin:0 0 8px;line-height:1.45}',
      '.ovp-analysis ul{margin:0;padding-left:18px;color:var(--muted, rgba(255,255,255,.62));',
      'font-size:12px;line-height:1.6}',
      '.ovp-analysis .actions{margin-top:10px;padding-top:10px;border-top:1px dashed var(--border, rgba(255,255,255,.12));',
      'color:var(--muted, rgba(255,255,255,.62));font-size:12px;line-height:1.6}',
      '.ovp-analysis .actions .row{display:flex;flex-wrap:wrap;gap:8px}',
      '.ovp-analysis .actions .pill{border:1px solid var(--border, rgba(255,255,255,.12));',
      'border-radius:999px;padding:2px 8px;background:rgba(255,255,255,.03)}'
    ].join('');

    document.head.appendChild(style);
  }

  function renderInsight(mountEl, moduleId, month, options) {
    if (!mountEl) return;

    ensureInsightStyles();

    var opts = options || {};
    var mKey = normalizeMonth(month);
    var ins = getInsight(moduleId, mKey);

    var wrapper = document.createElement('div');
    wrapper.className = 'ovp-analysis';

    var meta = document.createElement('div');
    meta.className = 'meta';
    var left = document.createElement('div');
    left.textContent = (opts.title || '数据分析');
    var right = document.createElement('div');
    right.textContent = (mKey || (latestMonth(STORE) || '—')) + ' · 文案更新时间 ' + (STORE.updatedAt || '—');
    meta.appendChild(left);
    meta.appendChild(right);

    var top = document.createElement('div');
    top.className = 'top';
    top.textContent = ins.topLine || '—';

    var ul = document.createElement('ul');
    var bullets = Array.isArray(ins.bullets) ? ins.bullets : [];
    for (var i = 0; i < bullets.length; i++) {
      var li = document.createElement('li');
      li.textContent = String(bullets[i]);
      ul.appendChild(li);
    }

    wrapper.appendChild(meta);
    wrapper.appendChild(top);
    wrapper.appendChild(ul);

    var actions = Array.isArray(ins.actions) ? ins.actions : [];
    if (!opts.hideActions && actions.length) {
      var act = document.createElement('div');
      act.className = 'actions';
      var title = document.createElement('div');
      title.textContent = '动作建议（Action | Owner | Due | Impact）';
      title.style.marginBottom = '8px';
      act.appendChild(title);

      for (var j = 0; j < actions.length; j++) {
        var a = actions[j] || {};
        var row = document.createElement('div');
        row.className = 'row';
        var p1 = document.createElement('span'); p1.className = 'pill'; p1.textContent = a.action || '—';
        var p2 = document.createElement('span'); p2.className = 'pill'; p2.textContent = a.owner || '—';
        var p3 = document.createElement('span'); p3.className = 'pill'; p3.textContent = a.due || '—';
        var p4 = document.createElement('span'); p4.className = 'pill'; p4.textContent = a.impact || '—';
        row.appendChild(p1); row.appendChild(p2); row.appendChild(p3); row.appendChild(p4);
        act.appendChild(row);
      }

      wrapper.appendChild(act);
    }

    // 清空再挂载，避免重复 append
    while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
    mountEl.appendChild(wrapper);
  }

  function scaffoldMonth(month, options) {
    // 快速生成某个月的 6 模块空模板（可选：copyFromLatest）
    var mKey = normalizeMonth(month);
    if (!mKey) return null;

    if (!STORE.months) STORE.months = {};
    if (STORE.months[mKey]) return mKey;

    var opts = options || {};
    var out = {};
    var lm = latestMonth(STORE);

    for (var i = 0; i < MODULES.length; i++) {
      var id = MODULES[i].id;
      var seed = (opts.copyFromLatest && lm && STORE.months[lm] && STORE.months[lm][id]) ? STORE.months[lm][id] : null;

      out[id] = seed ? clone(seed) : {
        topLine: '待更新：' + mKey + ' 一句话结论。',
        bullets: ['待更新：关键证据 1。', '待更新：关键证据 2。'],
        actions: []
      };
    }

    STORE.months[mKey] = out;
    return mKey;
  }

  // 对外暴露
  OVP.insights = {
    store: STORE,
    normalizeMonth: normalizeMonth,
    listMonths: function () { return listMonths(STORE); },
    latestMonth: function () { return latestMonth(STORE); },
    get: getInsight,
    render: renderInsight,
    scaffoldMonth: scaffoldMonth
  };
})();
