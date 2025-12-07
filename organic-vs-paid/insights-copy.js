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
    '.ovp-analysis{margin-top:12px;padding:12px;border:1px solid var(--border, rgba(255,255,255,.12));',
    'border-radius:12px;background:rgba(255,255,255,.04)}',

    // 元信息（月份/模块名）仍保持灰色；如果你也想黑色，把这里的 var(--muted...) 改成 var(--text...)
    '.ovp-analysis .meta{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;',
    'font-size:12px;color:var(--muted, rgba(255,255,255,.62));margin-bottom:8px}',

    '.ovp-analysis .top{font-size:13px;color:var(--text, rgba(255,255,255,.92));font-weight:600;',
    'margin:0 0 8px;line-height:1.45}',

    // ✅ 正文列表改为黑色（跟随全局 --text）
    '.ovp-analysis ul{margin:0;padding-left:18px;color:var(--text, rgba(255,255,255,.92));',
    'font-size:12px;line-height:1.6}',

    // ✅ actions 区正文也改为黑色（跟随全局 --text）
    '.ovp-analysis .actions{margin-top:10px;padding-top:10px;border-top:1px dashed var(--border, rgba(255,255,255,.12));',
    'color:var(--text, rgba(255,255,255,.92));font-size:12px;line-height:1.6}',
    '.ovp-analysis .actions .row{display:flex;flex-wrap:wrap;gap:8px}',
    '.ovp-analysis .actions .pill{border:1px solid var(--border, rgba(255,255,255,.12));',
    'border-radius:999px;padding:2px 8px;background:rgba(255,255,255,.03)}'
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
        'm1-registration': 'N/A',
        'm2-payrate': 'N/A',
        'm3-arppu': 'N/A',
        'm4-betflow-percapita': 'N/A',
        'm5-player-mix': 'N/A',
        'm6-retention': 'N/A'
      },
      '2025-10': {
        'm1-registration': '尼日利亚自然与买量注册规模相当，每日均超过 1 500 人。自然用户在 10 月上半月略占优势，买量在下半月略有反超。\n 坦桑尼亚自然注册数约 500–1 000 人/日，买量注册约 1 000–1 800 人/日，月末因坦桑大选量级归零。',
        'm2-payrate': '只有加纳自然用户的付费率高于买量用户。加纳自然 D7 付费率高达 61.5%，买量仅 40.9%；尼日利亚自然 45.9%，买量 50.5%。总体来看，自然用户自 D0 至 D7 的付费率增长率约为 23–55%，买量提升幅度偏小（21–24%）。这表明自然用户更易转化为付费用户。',
        'm3-arppu': '在KE和NG，自然用户的 ARPPU 在 D0 及 D7 均明显高于买量。加纳自然 D7 ARPPU 为 17.9 美元，而买量更是高达 23.3 美元，但买量受极少数大额用户影响，体现了加纳大R多的特性；坦桑尼亚的自然 ARPPU 较买量类似。从ARPPU的增长率看，买量与自然量的增长率类似，买量用户的价值增长斜率更高一些。根据乌干达的自然量数据分析，应该又是一个和加纳一样的高回报市场。',
        'm4-betflow-percapita': '自然用户在体育投注的深度普遍高于买量,加纳和坦桑的差异不如另两国显著。\n 自然用户在游戏投注上也部分领先：肯尼亚自然 D7 人均游戏投注 44.3 美元，买量仅 22.2 美元；尼日利亚自然 36.3 美元，买量 17.8 美元。加纳买量受大户影响 D7 高达 185 美元。',
        'm5-player-mix': '自然用户在大多数市场更偏好体育玩法，这也与买量大部分是游戏素材相关,从整体市场看，肯尼亚用户普遍更喜欢游戏，尼日正相反。',
        'm6-retention': '自然用户的次日留存率在 31%–46%之间，买量多在 29%–37%；第七日留存率自然也明显优于买量。 \n流失率=次日留存率 – 七日留存率，反映从第 2 天到第 7 天的留存损失。整体看自然用户流失率略高于买量，但根据投注深度和ARPPU数据看，可能存在部分买量用户虽登录但并不付费；自然用户虽流失高些，但留存下用户价值更高。'
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
