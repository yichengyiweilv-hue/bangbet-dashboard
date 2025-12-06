// organic-vs-paid/module-player-mix.js
(function () {
  window.OVP = window.OVP || {};
  const register = OVP.registerModule || function (m) { (OVP.modules || (OVP.modules = [])).push(m); };

  const MODULE_ID = 'm5-player-mix';
  const COUNTRIES = ['GH', 'KE', 'NG', 'TZ']; // 本模块按需求：不含 UG

  const SOURCES = [
    { key: 'organic', label: '自然量' },
    { key: 'paid', label: '买量' },
  ];

  const WINDOWS = [
    { key: 'D0', label: 'D0数据' },
    { key: 'D7', label: 'D7数据' },
  ];

  const CHARTS = [
    { key: 'bar', label: '月度柱状图' },
    { key: 'line', label: '日级折线图' },
  ];

  const ECHARTS_SRC = 'https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js';

  function injectStylesOnce() {
    const id = 'ovp-m5-player-style';
    if (document.getElementById(id)) return;

    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      .ovp-m5{display:flex;flex-direction:column;gap:12px}
      .ovp-m5 .row{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end}
      .ovp-m5 .fg{display:flex;flex-direction:column;gap:6px;min-width:180px}
      .ovp-m5 label{font-size:12px;color:var(--muted, var(--text-sub, #6b7280))}
      .ovp-m5 select{
        height:36px; padding:0 10px; border-radius:10px;
        border:1px solid var(--border, var(--border-subtle, rgba(148,163,184,.45)));
        background:rgba(255,255,255,.82); color:var(--text, var(--text-main, #0f172a));
        outline:none;
      }
      .ovp-m5 .seg{
        display:inline-flex; gap:6px; padding:4px;
        border:1px solid var(--border, var(--border-subtle, rgba(148,163,184,.45)));
        background:rgba(255,255,255,.78); border-radius:12px;
      }
      .ovp-m5 .seg button{
        height:28px; padding:0 10px;
        border:0; border-radius:10px;
        background:transparent; color:var(--muted, var(--text-sub, #6b7280));
        cursor:pointer; transition:all .15s ease-out;
        font-size:12px;
      }
      .ovp-m5 .seg button[aria-pressed="true"]{
        background:rgba(37,99,235,.10);
        color:var(--text, var(--text-main, #0f172a));
      }
      .ovp-m5 .chips{
        display:flex; flex-wrap:wrap; gap:8px;
        padding:8px;
        border:1px solid var(--border, var(--border-subtle, rgba(148,163,184,.45)));
        border-radius:12px;
        background:rgba(255,255,255,.78);
        min-height:36px;
      }
      .ovp-m5 .chip{
        height:26px;
        padding:0 10px;
        border-radius:999px;
        border:1px solid rgba(148,163,184,.55);
        background:rgba(15,23,42,.03);
        color:var(--text, var(--text-main, #0f172a));
        cursor:pointer;
        font-size:12px;
        transition:all .12s ease-out;
      }
      .ovp-m5 .chip[aria-pressed="true"]{
        border-color: rgba(37,99,235,.45);
        background: rgba(37,99,235,.10);
      }
      .ovp-m5 .subline{
        display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap;
        font-size:12px; color:var(--muted, var(--text-sub, #6b7280));
        margin-top:-4px;
      }
      .ovp-m5 .subline .k{display:inline-flex; gap:8px; align-items:center}
      .ovp-m5 .dot{width:8px;height:8px;border-radius:999px;display:inline-block}
      .ovp-m5 .chart{
        height:360px; width:100%;
        border:1px solid var(--border, var(--border-subtle, rgba(148,163,184,.45)));
        border-radius:14px;
        background:rgba(255,255,255,.86);
      }
      .ovp-m5 .table-wrap{overflow:auto}
      .ovp-m5 table{
        width:100%;
        border-collapse:separate; border-spacing:0;
        border:1px solid var(--border, var(--border-subtle, rgba(148,163,184,.45)));
        border-radius:14px; overflow:hidden;
        background:rgba(255,255,255,.86);
      }
      .ovp-m5 th,.ovp-m5 td{
        padding:10px 12px;
        border-bottom:1px solid rgba(148,163,184,.25);
        font-size:12px;
        white-space:nowrap;
      }
      .ovp-m5 th{color:var(--muted, var(--text-sub, #6b7280)); text-align:left; background:rgba(15,23,42,.02)}
      .ovp-m5 td{color:var(--text, var(--text-main, #0f172a)); text-align:left}
      .ovp-m5 tr:last-child td{border-bottom:0}
      .ovp-m5 .empty{
        padding:12px; border:1px dashed rgba(148,163,184,.55);
        border-radius:14px; color:var(--muted, var(--text-sub, #6b7280)); font-size:12px; line-height:1.6;
        background:rgba(255,255,255,.78);
      }
    `;
    document.head.appendChild(style);
  }

  function cssVar(name, fallback) {
    try {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name);
      if (v && String(v).trim()) return String(v).trim();
    } catch (_e) {}
    return fallback;
  }

  function isFiniteNumber(x) { return typeof x === 'number' && Number.isFinite(x); }
  function toNumber(x) {
    if (isFiniteNumber(x)) return x;
    const n = Number(x);
    return Number.isFinite(n) ? n : null;
  }

  function pickKey(obj, keys) {
    if (!obj || typeof obj !== 'object') return null;

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (Object.prototype.hasOwnProperty.call(obj, k)) return k;
    }

    const map = Object.create(null);
    for (const k of Object.keys(obj)) map[String(k).toLowerCase()] = k;
    for (let i = 0; i < keys.length; i++) {
      const want = String(keys[i]).toLowerCase();
      if (map[want]) return map[want];
    }
    return null;
  }

  // 优先复用 insights 的 month 归一化，避免口径不一致
  function normalizeMonth(input) {
    if (window.OVP && OVP.insights && typeof OVP.insights.normalizeMonth === 'function') {
      return OVP.insights.normalizeMonth(input);
    }
    if (!input) return null;

    if (input instanceof Date && !isNaN(input.getTime())) {
      const y = input.getFullYear();
      const m = String(input.getMonth() + 1).padStart(2, '0');
      return `${y}-${m}`;
    }

    const s = String(input).trim();
    const m1 = s.match(/^(\d{4})[-\/](\d{1,2})$/);
    if (m1) {
      const y = Number(m1[1]);
      const m = Number(m1[2]);
      if (m >= 1 && m <= 12) return `${y}-${String(m).padStart(2, '0')}`;
    }

    const m2 = s.match(/^(\d{4})(\d{2})$/);
    if (m2) return `${m2[1]}-${m2[2]}`;

    const m3 = s.match(/^(\d{4})[-\/](\d{2})[-\/](\d{2})/);
    if (m3) return `${m3[1]}-${m3[2]}`;

    return null;
  }

  function normalizeDate(input) {
    if (!input) return null;
    if (input instanceof Date && !isNaN(input.getTime())) {
      const y = input.getFullYear();
      const m = String(input.getMonth() + 1).padStart(2, '0');
      const d = String(input.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
    const s = String(input).trim();
    const m = s.match(/^(\d{4})[-\/](\d{2})[-\/](\d{2})/);
    if (m) return `${m[1]}-${m[2]}-${m[3]}`;
    return null;
  }

  function monthValue(m) {
    const mm = normalizeMonth(m);
    if (!mm) return -1;
    const parts = mm.split('-');
    return Number(parts[0]) * 12 + Number(parts[1]);
  }

  function orderedSubset(allOrder, selected) {
    const set = new Set((selected || []).map(x => String(x).toUpperCase()));
    return allOrder.filter(c => set.has(String(c).toUpperCase()));
  }

  function resolveDataFallback(which, preferVal) {
    if (preferVal) return preferVal;

    const names = which === 'organic'
      ? ['organicData', 'organic_data', 'ORGANIC_DATA', 'organicMonthlyData', 'ORGANIC_MONTHLY_DATA', 'RAW_ORGANIC_BY_MONTH']
      : ['paidData', 'paid_data', 'PAID_DATA', 'paidMonthlyData', 'PAID_MONTHLY_DATA', 'RAW_PAID_BY_MONTH'];

    for (const n of names) {
      if (typeof window !== 'undefined' && window[n] !== undefined) return window[n];
      try {
        const v = Function(`return (typeof ${n} !== "undefined") ? ${n} : undefined;`)();
        if (v !== undefined) return v;
      } catch (_e) {}
    }
    return undefined;
  }

  function normalizePlayerMixRecords(raw) {
    const out = [];
    if (!raw) return out;

    const pushRow = (outerMonth, row) => {
      if (!row || typeof row !== 'object') return;

      const countryKey = pickKey(row, ['country', 'geo', 'ctry']);
      const dateKey = pickKey(row, ['date', 'day', 'dt']);
      const monthKey = pickKey(row, ['month', 'ym']);

      const country = String(countryKey ? row[countryKey] : '').toUpperCase().trim();
      const date = normalizeDate(dateKey ? row[dateKey] : null);
      const month = normalizeMonth(outerMonth || (monthKey ? row[monthKey] : null) || date);

      if (!country || !date || !month) return;
      if (COUNTRIES.indexOf(country) === -1) return;

      const kD0T = pickKey(row, ['D0_TOTAL_BET_PLACED_USER', 'd0_total_bet_placed_user']);
      const kD0S = pickKey(row, ['D0_SPORTS_BET_PLACED_USER', 'd0_sports_bet_placed_user']);
      const kD0G = pickKey(row, ['D0_GAMES_BET_PLACED_USER', 'd0_games_bet_placed_user']);

      const kD7T = pickKey(row, ['D7_TOTAL_BET_PLACED_USER', 'd7_total_bet_placed_user']);
      const kD7S = pickKey(row, ['D7_SPORTS_BET_PLACED_USER', 'd7_sports_bet_placed_user']);
      const kD7G = pickKey(row, ['D7_GAMES_BET_PLACED_USER', 'd7_games_bet_placed_user']);

      const D0_total = toNumber(kD0T ? row[kD0T] : null) || 0;
      const D0_sports = toNumber(kD0S ? row[kD0S] : null) || 0;
      const D0_games = toNumber(kD0G ? row[kD0G] : null) || 0;

      const D7_total = toNumber(kD7T ? row[kD7T] : null) || 0;
      const D7_sports = toNumber(kD7S ? row[kD7S] : null) || 0;
      const D7_games = toNumber(kD7G ? row[kD7G] : null) || 0;

      out.push({
        month, date, country,
        D0_total, D0_sports, D0_games,
        D7_total, D7_sports, D7_games,
      });
    };

    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      const arrKey = pickKey(raw, ['data', 'rows', 'items', 'list']);
      if (arrKey && Array.isArray(raw[arrKey])) return normalizePlayerMixRecords(raw[arrKey]);

      const monthsKey = pickKey(raw, ['months', 'byMonth', 'dataByMonth']);
      if (monthsKey && raw[monthsKey] && typeof raw[monthsKey] === 'object') return normalizePlayerMixRecords(raw[monthsKey]);

      const keys = Object.keys(raw);
      const monthKeys = keys.filter(k => /^\d{4}[-\/]?\d{2}$/.test(String(k)));
      if (monthKeys.length) {
        for (const mk of monthKeys) {
          const arr = raw[mk];
          if (Array.isArray(arr)) {
            for (const row of arr) pushRow(mk, row);
          }
        }
        return out;
      }
    }

    if (Array.isArray(raw)) {
      for (const row of raw) pushRow(null, row);
    }

    return out;
  }

  function buildAgg(records) {
    const monthMap = new Map();        // "YYYY-MM|GH"
    const dayGroupMap = new Map();     // "YYYY-MM|GH" -> Map("YYYY-MM-DD" -> agg)

    const ensureAgg = (obj) => obj || ({
      D0_total: 0, D0_sports: 0, D0_games: 0,
      D7_total: 0, D7_sports: 0, D7_games: 0,
    });

    for (const r of (records || [])) {
      const mcKey = `${r.month}|${r.country}`;

      const mAgg = ensureAgg(monthMap.get(mcKey));
      mAgg.D0_total += toNumber(r.D0_total) || 0;
      mAgg.D0_sports += toNumber(r.D0_sports) || 0;
      mAgg.D0_games += toNumber(r.D0_games) || 0;
      mAgg.D7_total += toNumber(r.D7_total) || 0;
      mAgg.D7_sports += toNumber(r.D7_sports) || 0;
      mAgg.D7_games += toNumber(r.D7_games) || 0;
      monthMap.set(mcKey, mAgg);

      let dayMap = dayGroupMap.get(mcKey);
      if (!dayMap) { dayMap = new Map(); dayGroupMap.set(mcKey, dayMap); }

      const dKey = r.date;
      const dAgg = ensureAgg(dayMap.get(dKey));
      dAgg.D0_total += toNumber(r.D0_total) || 0;
      dAgg.D0_sports += toNumber(r.D0_sports) || 0;
      dAgg.D0_games += toNumber(r.D0_games) || 0;
      dAgg.D7_total += toNumber(r.D7_total) || 0;
      dAgg.D7_sports += toNumber(r.D7_sports) || 0;
      dAgg.D7_games += toNumber(r.D7_games) || 0;
      dayMap.set(dKey, dAgg);
    }

    return { monthMap, dayGroupMap };
  }

  function computeSegments(total, sports, games) {
    const T = Math.max(0, toNumber(total) || 0);
    const S = Math.max(0, toNumber(sports) || 0);
    const G = Math.max(0, toNumber(games) || 0);

    let both = S + G - T;
    if (!Number.isFinite(both) || both < 0) both = 0;
    const cap = Math.min(S, G);
    if (both > cap) both = cap;

    const onlySports = Math.max(0, S - both);
    const onlyGames = Math.max(0, G - both);

    return { total: T, sports: S, games: G, both, onlySports, onlyGames };
  }

  function getMonthAgg(aggMap, month, country) {
    return aggMap.get(`${month}|${country}`) || null;
  }

  function getWindowTriplet(agg, win) {
    if (!agg) return null;
    if (win === 'D7') return { total: agg.D7_total, sports: agg.D7_sports, games: agg.D7_games };
    return { total: agg.D0_total, sports: agg.D0_sports, games: agg.D0_games };
  }

  function hexToRgba(hex, alpha) {
    const h = String(hex || '').trim();
    if (!h) return `rgba(0,0,0,${alpha})`;
    if (h.startsWith('rgba(')) return h;
    if (h.startsWith('rgb(')) {
      const nums = h.replace(/rgba?\(/, '').replace(')', '').split(',').map(s => Number(s.trim()));
      if (nums.length >= 3) return `rgba(${nums[0]},${nums[1]},${nums[2]},${alpha})`;
      return `rgba(0,0,0,${alpha})`;
    }
    const m = h.replace('#', '');
    if (m.length === 3) {
      const r = parseInt(m[0] + m[0], 16);
      const g = parseInt(m[1] + m[1], 16);
      const b = parseInt(m[2] + m[2], 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }
    if (m.length === 6) {
      const r = parseInt(m.slice(0, 2), 16);
      const g = parseInt(m.slice(2, 4), 16);
      const b = parseInt(m.slice(4, 6), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }
    return `rgba(0,0,0,${alpha})`;
  }

  function ensureECharts() {
    if (window.echarts) return Promise.resolve(window.echarts);
    if (window.__OVP_ECHARTS_PROMISE) return window.__OVP_ECHARTS_PROMISE;

    window.__OVP_ECHARTS_PROMISE = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = ECHARTS_SRC;
      s.async = true;
      s.onload = () => window.echarts ? resolve(window.echarts) : reject(new Error('echarts not available'));
      s.onerror = reject;
      document.head.appendChild(s);
    });

    return window.__OVP_ECHARTS_PROMISE;
  }

  register({
    id: MODULE_ID,
    title: 'D0/D7 体育 vs 游戏玩家比例',
    subtitle: '柱状：总投注人数拆分（仅游戏 / 两者皆有 / 仅体育）；表格：体育投注玩家/总投注玩家、游戏投注玩家/总投注玩家',
    span: 'full',

    render({ mountEl, organic, paid, utils }) {
      injectStylesOnce();

      const u = utils || (window.OVP && OVP.utils) || {
        fmtPct: (x, d = 2) => (x === null || x === undefined || !Number.isFinite(Number(x))) ? '—' : `${(Number(x) * 100).toFixed(d)}%`,
        fmtInt: (x) => (x === null || x === undefined || !Number.isFinite(Number(x))) ? '—' : Number(x).toLocaleString('en-US'),
      };

      const organicRaw = resolveDataFallback('organic', organic);
      const paidRaw = resolveDataFallback('paid', paid);

      const organicRecords = normalizePlayerMixRecords(organicRaw);
      const paidRecords = normalizePlayerMixRecords(paidRaw);

      const organicAgg = buildAgg(organicRecords);
      const paidAgg = buildAgg(paidRecords);

      const monthsSet = new Set();
      for (const r of organicRecords) monthsSet.add(r.month);
      for (const r of paidRecords) monthsSet.add(r.month);

      const months = Array.from(monthsSet).filter(Boolean).sort((a, b) => monthValue(a) - monthValue(b));

      if (!months.length) {
        mountEl.innerHTML = `
          <div class="ovp-m5">
            <div class="empty">
              没读到可用月份数据：请检查 organic-data.js / paid-data.js 是否包含字段：
              date、country、D0/D7_TOTAL_BET_PLACED_USER、D0/D7_SPORTS_BET_PLACED_USER、D0/D7_GAMES_BET_PLACED_USER。
            </div>
          </div>
        `;
        return;
      }

      const uid = `ovp-m5-${Math.random().toString(16).slice(2, 10)}`;
      const monthId = `${uid}-month`;
      const countryWrapId = `${uid}-countries`;
      const sourceWrapId = `${uid}-sources`;
      const windowWrapId = `${uid}-windows`;
      const chartSegId = `${uid}-chartseg`;
      const chartId = `${uid}-chart`;
      const tableId = `${uid}-table`;
      const analysisId = `${uid}-analysis`;

      const latestMonth = months[months.length - 1];

      const state = {
        month: latestMonth,
        chart: 'bar', // bar|line
        bar: {
          countries: [...COUNTRIES],
          sources: ['organic', 'paid'],
          windows: ['D0', 'D7'],
        },
        line: {
          country: COUNTRIES[0],
          source: 'organic',
          window: 'D0',
        }
      };

      function labelSource(k) { return (k === 'paid') ? '买量' : '自然量'; }
      function labelWindow(k) { return (k === 'D7') ? 'D7' : 'D0'; }

      function ensureNonEmptyBar() {
        if (!state.bar.countries.length) state.bar.countries = [...COUNTRIES];
        if (!state.bar.sources.length) state.bar.sources = ['organic'];
        if (!state.bar.windows.length) state.bar.windows = ['D0'];
      }

      function syncControls() {
        const monthSel = document.getElementById(monthId);
        if (monthSel) monthSel.value = state.month;

        const seg = document.getElementById(chartSegId);
        if (seg) {
          seg.querySelectorAll('button[data-type]').forEach(btn => {
            btn.setAttribute('aria-pressed', String(btn.dataset.type === state.chart));
          });
        }

        const showBar = state.chart === 'bar';
        syncChips(countryWrapId, showBar ? state.bar.countries : [state.line.country]);
        syncChips(sourceWrapId, showBar ? state.bar.sources : [state.line.source]);
        syncChips(windowWrapId, showBar ? state.bar.windows : [state.line.window]);
      }

      function syncChips(wrapId, selectedArr) {
        const wrap = document.getElementById(wrapId);
        if (!wrap) return;
        const set = new Set((selectedArr || []).map(v => String(v)));
        wrap.querySelectorAll('button.chip[data-value]').forEach(btn => {
          const v = String(btn.dataset.value);
          btn.setAttribute('aria-pressed', set.has(v) ? 'true' : 'false');
        });
      }

      function buildChips(wrapId, items, onPick) {
        const wrap = document.getElementById(wrapId);
        if (!wrap) return;

        wrap.innerHTML = items.map(it => `<button type="button" class="chip" data-value="${it.key || it}">${it.label || it}</button>`).join('');
        wrap.querySelectorAll('button.chip[data-value]').forEach(btn => {
          btn.addEventListener('click', () => onPick(String(btn.dataset.value)));
        });
      }

      function toggleInArray(arr, v) {
        const i = arr.indexOf(v);
        if (i >= 0) arr.splice(i, 1);
        else arr.push(v);
      }

      function getSelectionsForTable() {
        if (state.chart === 'line') {
          return {
            countries: [state.line.country],
            sources: [state.line.source],
            windows: [state.line.window],
          };
        }
        ensureNonEmptyBar();
        return {
          countries: orderedSubset(COUNTRIES, state.bar.countries),
          sources: ['organic', 'paid'].filter(s => state.bar.sources.indexOf(s) >= 0),
          windows: ['D0', 'D7'].filter(w => state.bar.windows.indexOf(w) >= 0),
        };
      }

      mountEl.innerHTML = `
        <div class="ovp-m5">
          <div class="row">
            <div class="fg">
              <label>月份</label>
              <select id="${monthId}">
                ${months.map(m => `<option value="${m}">${m}</option>`).join('')}
              </select>
            </div>

            <div class="fg" style="min-width:260px">
              <label>国家</label>
              <div id="${countryWrapId}" class="chips"></div>
            </div>

            <div class="fg" style="min-width:220px">
              <label>买量 / 自然量</label>
              <div id="${sourceWrapId}" class="chips"></div>
            </div>

            <div class="fg" style="min-width:260px">
              <label>图表</label>
              <div id="${chartSegId}" class="seg" role="group" aria-label="图表类型切换">
                ${CHARTS.map((c, idx) => `<button type="button" data-type="${c.key}" aria-pressed="${idx === 0 ? 'true' : 'false'}">${c.label}</button>`).join('')}
              </div>
            </div>

            <div class="fg" style="min-width:220px">
              <label>D0 / D7</label>
              <div id="${windowWrapId}" class="chips"></div>
            </div>
          </div>

          <div class="subline">
            <div class="k">
              <span class="dot" style="background:${cssVar('--ovp-yellow', '#F6C344')}"></span>自然量
              <span class="dot" style="background:${cssVar('--ovp-blue', '#2563eb')}"></span>买量
              <span class="dot" style="background:${cssVar('--accent-green', '#16a34a')}"></span>两者皆有
            </div>
            <div class="k">
              柱状：底部=仅游戏，中部=两者皆有，顶部=仅体育；斜线= D7｜折线：自动锁单选
            </div>
          </div>

          <div id="${chartId}" class="chart"></div>

          <div class="table-wrap">
            <table id="${tableId}"></table>
          </div>

          <div id="${analysisId}"></div>
        </div>
      `;

      const monthSel = document.getElementById(monthId);
      const chartEl = document.getElementById(chartId);
      const tableEl = document.getElementById(tableId);
      const analysisEl = document.getElementById(analysisId);
      const segEl = document.getElementById(chartSegId);

      buildChips(countryWrapId, COUNTRIES.map(c => ({ key: c, label: c })), (v) => {
        if (state.chart === 'line') {
          state.line.country = v;
        } else {
          toggleInArray(state.bar.countries, v);
          ensureNonEmptyBar();
        }
        syncControls();
        updateView();
      });

      buildChips(sourceWrapId, SOURCES, (v) => {
        if (state.chart === 'line') {
          state.line.source = v;
        } else {
          toggleInArray(state.bar.sources, v);
          ensureNonEmptyBar();
        }
        syncControls();
        updateView();
      });

      buildChips(windowWrapId, WINDOWS, (v) => {
        if (state.chart === 'line') {
          state.line.window = v;
        } else {
          toggleInArray(state.bar.windows, v);
          ensureNonEmptyBar();
        }
        syncControls();
        updateView();
      });

      if (monthSel) {
        monthSel.addEventListener('change', () => {
          state.month = String(monthSel.value || latestMonth);
          syncControls();
          updateView();
        });
      }

      if (segEl) {
        segEl.querySelectorAll('button[data-type]').forEach(btn => {
          btn.addEventListener('click', () => {
            const next = String(btn.dataset.type || 'bar');
            if (next === state.chart) return;

            state.chart = next;

            if (state.chart === 'line') {
              ensureNonEmptyBar();
              state.line.country = orderedSubset(COUNTRIES, state.bar.countries)[0] || COUNTRIES[0];
              state.line.source = (state.bar.sources[0] || 'organic');
              state.line.window = (state.bar.windows[0] || 'D0');
            }

            syncControls();
            updateView();
          });
        });
      }

      let chart = null;
      let chartReady = false;

      function renderAnalysis() {
        if (!analysisEl) return;
        analysisEl.innerHTML = '';
        if (window.OVP && OVP.insights && typeof OVP.insights.render === 'function') {
          OVP.insights.render(analysisEl, MODULE_ID, state.month, { title: '数据分析' });
        } else {
          analysisEl.innerHTML = `<div class="empty">未检测到 insights-copy.js（无法渲染数据分析文案）。</div>`;
        }
      }

      function renderTable() {
        if (!tableEl) return;

        const sel = getSelectionsForTable();
        const countries = sel.countries;
        const sources = sel.sources;
        const windows = sel.windows;

        const combos = [];
        for (const s of sources) for (const w of windows) combos.push({ w, s });

        const ths = ['<th>国家</th>'];
        for (const cb of combos) {
          const wLabel = labelWindow(cb.w);
          const sLabel = labelSource(cb.s);
          ths.push(`<th>${wLabel}${sLabel}体育玩家占比</th>`);
          ths.push(`<th>${wLabel}${sLabel}游戏玩家占比</th>`);
        }

        const rows = [];
        for (const c of countries) {
          const tds = [`<td>${c}</td>`];
          for (const cb of combos) {
            const agg = (cb.s === 'paid') ? getMonthAgg(paidAgg.monthMap, state.month, c) : getMonthAgg(organicAgg.monthMap, state.month, c);
            const tri = getWindowTriplet(agg, cb.w);
            if (!tri || !Number.isFinite(Number(tri.total)) || Number(tri.total) <= 0) {
              tds.push('<td>—</td><td>—</td>');
              continue;
            }
            const sportsShare = Number(tri.sports) / Number(tri.total);
            const gamesShare = Number(tri.games) / Number(tri.total);
            tds.push(`<td>${u.fmtPct(sportsShare, 2)}</td>`);
            tds.push(`<td>${u.fmtPct(gamesShare, 2)}</td>`);
          }
          rows.push(`<tr>${tds.join('')}</tr>`);
        }

        const cols = 1 + combos.length * 2;
        const minW = Math.max(720, cols * 140);

        tableEl.style.minWidth = `${minW}px`;
        tableEl.innerHTML = `
          <thead><tr>${ths.join('')}</tr></thead>
          <tbody>${rows.join('')}</tbody>
        `;
      }

      function renderChartBarOption() {
        const sel = getSelectionsForTable();
        const countries = sel.countries;
        const sources = sel.sources;
        const windows = sel.windows;

        const border = cssVar('--border', cssVar('--border-subtle', 'rgba(148,163,184,.45)'));
        const muted = cssVar('--muted', cssVar('--text-sub', '#6b7280'));
        const text = cssVar('--text', cssVar('--text-main', '#0f172a'));

        const organicBase = cssVar('--ovp-yellow', '#F6C344');
        const paidBase = cssVar('--ovp-blue', '#2563eb');
        const bothGreen = hexToRgba(cssVar('--accent-green', '#16a34a'), 0.30);

        const decal = {
          symbol: 'rect',
          dashArrayX: [2, 2],
          dashArrayY: [2, 2],
          rotation: Math.PI / 4,
          color: 'rgba(15,23,42,0.20)',
        };

        const series = [];
        const orderedStacks = [];
        for (const s of ['organic', 'paid']) {
          if (sources.indexOf(s) < 0) continue;
          for (const w of ['D0', 'D7']) {
            if (windows.indexOf(w) < 0) continue;
            orderedStacks.push({ s, w });
          }
        }

        for (const st of orderedStacks) {
          const base = st.s === 'paid' ? paidBase : organicBase;
          const light = hexToRgba(base, 0.35);
          const dark = base;

          const stackName = `${st.s}_${st.w}`;

          const mkData = (seg) => {
            const arr = [];
            for (const c of countries) {
              const agg = (st.s === 'paid') ? getMonthAgg(paidAgg.monthMap, state.month, c) : getMonthAgg(organicAgg.monthMap, state.month, c);
              const tri = getWindowTriplet(agg, st.w);
              if (!tri) { arr.push(null); continue; }
              const segs = computeSegments(tri.total, tri.sports, tri.games);
              if (seg === 'onlyGames') arr.push(segs.onlyGames);
              else if (seg === 'both') arr.push(segs.both);
              else arr.push(segs.onlySports);
            }
            return arr;
          };

          series.push({
            name: `${labelSource(st.s)} ${labelWindow(st.w)} 仅游戏`,
            type: 'bar',
            stack: stackName,
            barWidth: 14,
            itemStyle: { color: light, decal: st.w === 'D7' ? decal : null },
            emphasis: { focus: 'series' },
            data: mkData('onlyGames'),
          });

          series.push({
            name: `${labelSource(st.s)} ${labelWindow(st.w)} 两者皆有`,
            type: 'bar',
            stack: stackName,
            barWidth: 14,
            itemStyle: { color: bothGreen, decal: st.w === 'D7' ? decal : null },
            emphasis: { focus: 'series' },
            data: mkData('both'),
          });

          series.push({
            name: `${labelSource(st.s)} ${labelWindow(st.w)} 仅体育`,
            type: 'bar',
            stack: stackName,
            barWidth: 14,
            itemStyle: { color: dark, decal: st.w === 'D7' ? decal : null },
            emphasis: { focus: 'series' },
            data: mkData('onlySports'),
          });
        }

        return {
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            backgroundColor: 'rgba(255,255,255,.96)',
            borderColor: border,
            borderWidth: 1,
            textStyle: { color: text },
          },
          legend: { show: false },
          grid: { left: 20, right: 18, top: 14, bottom: 40, containLabel: true },
          xAxis: {
            type: 'category',
            data: countries,
            axisLabel: { color: muted },
            axisLine: { lineStyle: { color: border } },
            axisTick: { lineStyle: { color: border } },
          },
          yAxis: {
            type: 'value',
            name: '投注人数',
            nameTextStyle: { color: muted },
            axisLabel: { color: muted },
            axisLine: { show: false },
            splitLine: { lineStyle: { color: 'rgba(148,163,184,.22)' } },
          },
          series,
        };
      }

      function renderChartLineOption() {
        const border = cssVar('--border', cssVar('--border-subtle', 'rgba(148,163,184,.45)'));
        const muted = cssVar('--muted', cssVar('--text-sub', '#6b7280'));
        const text = cssVar('--text', cssVar('--text-main', '#0f172a'));

        const sportsColor = cssVar('--ovp-yellow', '#F6C344');
        const gamesColor = cssVar('--ovp-blue', '#2563eb');
        const bothColor = cssVar('--accent-green', '#16a34a');

        const source = state.line.source;
        const country = state.line.country;
        const win = state.line.window;

        const groupKey = `${state.month}|${country}`;
        const dayGroup = (source === 'paid') ? paidAgg.dayGroupMap.get(groupKey) : organicAgg.dayGroupMap.get(groupKey);

        const days = dayGroup ? Array.from(dayGroup.keys()).sort() : [];
        const x = days.map(d => d.slice(5)); // MM-DD

        const onlySports = [];
        const onlyGames = [];
        const both = [];

        for (const d of days) {
          const agg = dayGroup.get(d);
          const tri = getWindowTriplet(agg, win);
          const seg = tri ? computeSegments(tri.total, tri.sports, tri.games) : null;
          onlySports.push(seg ? seg.onlySports : null);
          onlyGames.push(seg ? seg.onlyGames : null);
          both.push(seg ? seg.both : null);
        }

        return {
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'line' },
            backgroundColor: 'rgba(255,255,255,.96)',
            borderColor: border,
            borderWidth: 1,
            textStyle: { color: text },
          },
          legend: {
            top: 6,
            left: 8,
            textStyle: { color: muted },
            data: ['仅体育', '仅游戏', '体育+游戏'],
          },
          grid: { left: 20, right: 18, top: 46, bottom: 34, containLabel: true },
          xAxis: {
            type: 'category',
            data: x,
            axisLabel: { color: muted },
            axisLine: { lineStyle: { color: border } },
            axisTick: { lineStyle: { color: border } },
          },
          yAxis: {
            type: 'value',
            name: '投注人数',
            nameTextStyle: { color: muted },
            axisLabel: { color: muted },
            splitLine: { lineStyle: { color: 'rgba(148,163,184,.22)' } },
          },
          series: [
            {
              name: '仅体育',
              type: 'line',
              stack: 'mix',
              smooth: true,
              symbol: 'none',
              lineStyle: { width: 2, color: sportsColor },
              itemStyle: { color: sportsColor },
              areaStyle: { opacity: 0.22 },
              data: onlySports,
            },
            {
              name: '仅游戏',
              type: 'line',
              stack: 'mix',
              smooth: true,
              symbol: 'none',
              lineStyle: { width: 2, color: gamesColor },
              itemStyle: { color: gamesColor },
              areaStyle: { opacity: 0.22 },
              data: onlyGames,
            },
            {
              name: '体育+游戏',
              type: 'line',
              stack: 'mix',
              smooth: true,
              symbol: 'none',
              lineStyle: { width: 2, color: bothColor },
              itemStyle: { color: bothColor },
              areaStyle: { opacity: 0.22 },
              data: both,
            },
          ],
        };
      }

      function renderChart() {
        if (!chart || !chartReady) return;

        const sel = getSelectionsForTable();
        if (!sel.countries.length) {
          chart.clear();
          chart.setOption({ title: { text: '暂无数据', left: 'center', top: 'middle' } });
          return;
        }

        const option = (state.chart === 'line') ? renderChartLineOption() : renderChartBarOption();
        chart.clear();
        chart.setOption(option, true);
      }

      function updateView() {
        renderTable();
        renderAnalysis();
        if (chartReady) renderChart();
      }

      if (chartEl) chartEl.innerHTML = `<div class="empty">图表加载中…</div>`;

      ensureECharts()
        .then((echarts) => {
          if (!chartEl) return;
          chart = echarts.init(chartEl, null, { renderer: 'canvas' });
          chartReady = true;

          const onResize = () => { try { chart && chart.resize(); } catch (_e) {} };
          window.addEventListener('resize', onResize);

          syncControls();
          updateView();
        })
        .catch(() => {
          if (chartEl) chartEl.innerHTML = `<div class="empty">图表库加载失败：echarts not available</div>`;
          syncControls();
          updateView();
        });

      syncControls();
      updateView();
    }
  });
})();
