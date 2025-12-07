// organic-vs-paid/insights-copy.js
// 月度“数据分析文案库”（轻量版）
// 目标：每个月 × 每个模块 = 一段纯文本；页面渲染成灰字白底文本框（支持换行）
//
// 你只需要改 STORE.months 里对应月份/模块的文本即可：
// - 换行：用 \n 或者直接写多行模板字符串（反引号 `）
// - 新增月份：复制一段 'YYYY-MM': {...}，补齐 6 个模块 key

(function () {
  window.OVP = window.OVP || {};
  var OVP = window.OVP;

  var MODULES = [
    { id: 'm1-registration', name: '自然量 vs 买量注册量' },
    { id: 'm2-payrate', name: 'D0 / D7 付费率' },
    { id: 'm3-arppu', name: 'D0 / D7 ARPPU' },
    { id: 'm4-betflow-percapita', name: 'D0 / D7 人均流水（体育 / 游戏 / 总）' },
    { id: 'm5-player-mix', name: 'D0/D7 体育 vs 游戏玩家比例' },
    { id: 'm6-retention', name: '次日 / 7 日留存率' }
  ];

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
    if (!key) return -1;
    var m = String(key).match(/^(\d{4})-(\d{2})$/);
    if (!m) return -1;
    return Number(m[1]) * 100 + Number(m[2]);
  }

  function listMonths(store) {
    var keys = Object.keys((store && store.months) || {});
    keys.sort(function (a, b) { return monthValue(a) - monthValue(b); });
    return keys;
  }

  function latestMonth(store) {
    var keys = listMonths(store);
    return keys.length ? keys[keys.length - 1] : null;
  }

  function ensureInsightStyles() {
    if (document.getElementById('ovp-insights-style')) return;

    var style = document.createElement('style');
    style.id = 'ovp-insights-style';
    style.textContent = [
      '.ovp-analysis{margin-top:12px}',
      '.ovp-analysis .meta{display:flex;justify-content:space-between;align-items:center;',
      'gap:10px;flex-wrap:wrap;font-size:12px;color:var(--muted,#6b7280);margin:0 0 8px}',
      '.ovp-analysis .box{padding:12px;border:1px solid var(--border, rgba(148,163,184,.6));',
      'border-radius:12px;background:rgba(255,255,255,.65);color:var(--muted,#6b7280);',
      'font-size:12px;line-height:1.65;white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere;',
      'min-height:54px}',
      '.ovp-analysis .box.is-empty{color:rgba(107,114,128,.75)}'
    ].join('');
    document.head.appendChild(style);
  }

  // ===== 你主要维护这块：STORE.months =====
  var STORE = {
    schemaVersion: 2,
    updatedAt: '2025-12-07',
    modules: MODULES,
    months: {
      '2025-09': {
        'm1-registration': '尼日利亚自然与买量注册规模相当，每日均超过 1 500 人。自然用户在 10 月上半月略占优势，买量在下半月略有反超。\n 坦桑尼亚自然注册数约 500–1 000 人/日，买量注册约 1 000–1 800 人/日，月末因坦桑大选量级归零。',
        'm2-payrate': '',
        'm3-arppu': '',
        'm4-betflow-percapita': '',
        'm5-player-mix': '',
        'm6-retention': ''
      },
      '2025-10': {
        'm1-registration': '',
        'm2-payrate': '',
        'm3-arppu': '',
        'm4-betflow-percapita': '',
        'm5-player-mix': '',
        'm6-retention': ''
      },
      '2025-11': {
        'm1-registration': '',
        'm2-payrate': '',
        'm3-arppu': '',
        'm4-betflow-percapita': '',
        'm5-player-mix': '',
        'm6-retention': ''
      }
    }
  };

  function coerceText(entry) {
    if (entry == null) return '';
    if (typeof entry === 'string') return entry;

    if (typeof entry === 'object') {
      // 新结构：{ text: '...' }
      if (typeof entry.text === 'string') return entry.text;

      // 兼容旧结构：topLine + bullets（避免你之前写的内容丢）
      var t = '';
      if (typeof entry.topLine === 'string' && entry.topLine.trim()) t += entry.topLine.trim();

      var bullets = Array.isArray(entry.bullets) ? entry.bullets : [];
      if (bullets.length) {
        var b = bullets
          .filter(function (x) { return x != null && String(x).trim(); })
          .map(function (x) { return '• ' + String(x).trim(); })
          .join('\n');

        if (b) t += (t ? '\n' : '') + b;
      }
      return t;
    }

    return String(entry);
  }

  function getInsight(moduleId, month) {
    var mKey = normalizeMonth(month);
    if (!mKey) mKey = latestMonth(STORE);

    var monthObj = (mKey && STORE.months && STORE.months[mKey]) ? STORE.months[mKey] : null;
    var raw = monthObj && moduleId ? monthObj[moduleId] : null;

    return {
      month: mKey,
      moduleId: moduleId,
      text: coerceText(raw)
    };
  }

  function renderInsight(mountEl, moduleId, month, options) {
    if (!mountEl) return;

    ensureInsightStyles();

    var opts = options || {};
    var ins = getInsight(moduleId, month);
    var title = (opts && typeof opts.title === 'string') ? opts.title : '数据分析';

    var wrapper = document.createElement('div');
    wrapper.className = 'ovp-analysis';

    var meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = title + ' · ' + (ins.month ? ins.month : '—');

    var box = document.createElement('div');
    box.className = 'box';

    var text = (ins.text || '').trim();
    if (!text) {
      box.className = 'box is-empty';
      box.textContent = '（留空：在 insights-copy.js 的 STORE.months 里填这个月这个模块的文本）';
    } else {
      // 保留原始换行
      box.textContent = ins.text;
    }

    wrapper.appendChild(meta);
    wrapper.appendChild(box);

    mountEl.innerHTML = '';
    mountEl.appendChild(wrapper);
  }

  function scaffoldMonth(month, options) {
    var mKey = normalizeMonth(month);
    if (!mKey) return null;

    if (!STORE.months) STORE.months = {};
    if (STORE.months[mKey]) return mKey;

    var opts = options || {};
    var lm = latestMonth(STORE);

    var out = {};
    for (var i = 0; i < MODULES.length; i++) {
      var id = MODULES[i].id;
      var seed = (opts.copyFromLatest && lm && STORE.months[lm]) ? STORE.months[lm][id] : '';
      out[id] = (typeof seed === 'string') ? seed : coerceText(seed);
    }

    STORE.months[mKey] = out;
    return mKey;
  }

  // 对外暴露：模块会用到 render / normalizeMonth
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
