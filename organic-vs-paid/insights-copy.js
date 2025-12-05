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
      '2025-11': {
        'm1-registration': {
          topLine: '待更新：11 月注册结构一句话结论（自然占比、环比变化、主要来源）。',
          bullets: [
            '待更新：自然注册 MoM、买量注册 MoM 的关键变化点。',
            '待更新：自然占比变化（pp）及原因归因（渠道/活动/产品/SEO 等）。'
          ],
          actions: [
            // { action: '示例：复盘买量收量下滑渠道与预算节奏', owner: 'UA', due: '2025-12-10', impact: '预计：稳定注册波动（定性）' }
          ]
        },
        'm2-payrate': {
          topLine: '待更新：D0/D7 付费率一句话结论（自然 vs 买量差异、趋势）。',
          bullets: [
            '待更新：D0 付费率差异（pp）与波动原因。',
            '待更新：D7 付费率差异（pp）与 cohort 质量判断。'
          ],
          actions: []
        },
        'm3-arppu': {
          topLine: '待更新：D0/D7 ARPPU 一句话结论（提升/下滑与结构）。',
          bullets: [
            '待更新：D0 ARPPU 变化与大额玩家/活动影响。',
            '待更新：D7 ARPPU 变化与留存/复购的联动。'
          ],
          actions: []
        },
        'm4-betflow-percapita': {
          topLine: '待更新：D0/D7 人均流水一句话结论（体育/游戏/总的拉动项）。',
          bullets: [
            '待更新：D0 总/体育/游戏人均流水变化与产品/赛事/活动影响。',
            '待更新：D7 总/体育/游戏人均流水变化与用户质量判断。'
          ],
          actions: []
        },
        'm5-player-mix': {
          topLine: '待更新：体育 vs 游戏玩家结构一句话结论（自然 vs 买量）。',
          bullets: [
            '待更新：D0 体育/游戏玩家比例变化与导流/入口影响。',
            '待更新：D7 体育/游戏玩家比例变化与长期偏好判断。'
          ],
          actions: []
        },
        'm6-retention': {
          topLine: '待更新：次留 / 7 留一句话结论（自然 vs 买量）。',
          bullets: [
            '待更新：次留变化（pp）与新手引导/激励影响。',
            '待更新：7 留变化（pp）与产品粘性/复访路径。'
          ],
          actions: []
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
