// organic-vs-paid/module-retention.js
// 模块6：次日 / 7 日留存率（自然量 vs 买量）
(function () {
  window.OVP = window.OVP || {};
  const register = OVP.registerModule || function (m) { (OVP.modules || (OVP.modules = [])).push(m); };

  const MODULE_ID = 'm6-retention';
  const COUNTRIES = ['GH', 'KE', 'NG', 'TZ']; // 固定顺序

  // 图表库：ECharts 5（与模块1保持一致）
  const ECHARTS_SRC = 'https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js';
  const ECHARTS_SCRIPT_ID = 'ovp-echarts-5';

  function injectStylesOnce() {
    const id = 'ovp-m6-ret-style';
    if (document.getElementById(id)) return;

    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      .ovp-m6{display:flex;flex-direction:column;gap:12px}
      .ovp-m6 .row{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end}
      .ovp-m6 .fg{display:flex;flex-direction:column;gap:6px;min-width:180px}
      .ovp-m6 label{font-size:12px;color:var(--muted,#6b7280)}
      .ovp-m6 select{
        height:36px; padding:0 10px; border-radius:10px;
        border:1px solid var(--border, rgba(148,163,184,.6));
        background:rgba(255,255,255,.85); color:var(--text,#0f172a);
        outline:none;
      }
      .ovp-m6 .seg{
        display:inline-flex; gap:6px; padding:4px;
        border:1px solid var(--border, rgba(148,163,184,.6));
        background:rgba(255,255,255,.70); border-radius:12px;
      }
      .ovp-m6 .seg button{
        height:28px; padding:0 10px;
        border:0; border-radius:10px;
        background:transparent; color:var(--muted,#6b7280);
        cursor:pointer;
      }
      .ovp-m6 .seg button[aria-pressed="true"]{
        background:rgba(15,23,42,.06);
        color:var(--text,#0f172a);
      }
      .ovp-m6 .chips{display:flex;flex-wrap:wrap;gap:8px}
      .ovp-m6 .chip{
        display:inline-flex;align-items:center;gap:8px;
        padding:6px 10px;border-radius:999px;
        border:1px solid var(--border, rgba(148,163,184,.6));
        background:rgba(255,255,255,.78);
        font-size:12px;color:var(--text,#0f172a);
        cursor:pointer;user-select:none;
      }
      .ovp-m6 .chip input{margin:0}
      .ovp-m6 .hint{
        margin-top:2px;
        font-size:11px; color:var(--muted,#6b7280);
        line-height:1.5;
      }
      .ovp-m6 .subline{
        display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap;
        font-size:12px; color:var(--muted,#6b7280);
        margin-top:-4px;
      }
      .ovp-m6 .subline .k{display:inline-flex; gap:6px; align-items:center}
      .ovp-m6 .dot{width:8px;height:8px;border-radius:999px;display:inline-block}
      .ovp-m6 .chart{
        height:340px; width:100%;
        border:1px solid var(--border, rgba(148,163,184,.6));
        border-radius:12px;
        background:rgba(255,255,255,.55);
      }
      .ovp-m6 .table-wrap{overflow:auto}
      .ovp-m6 table{
        width:100%;
        border-collapse:separate; border-spacing:0;
        border:1px solid var(--border, rgba(148,163,184,.6));
        border-radius:12px; overflow:hidden;
        background:rgba(255,255,255,.55);
      }
      .ovp-m6 th,.ovp-m6 td{
        padding:10px 12px;
        border-bottom:1px solid rgba(148,163,184,.28);
        font-size:12px;
        white-space:nowrap;
      }
      .ovp-m6 th{color:var(--muted,#6b7280); text-align:left; background:rgba(255,255,255,.55)}
      .ovp-m6 td{color:var(--text,#0f172a); text-align:left}
      .ovp-m6 tr:last-child td{border-bottom:0}
      .ovp-m6 .empty{
        padding:12px; border:1px dashed var(--border, rgba(148,163,184,.6));
        border-radius:12px; color:var(--muted,#6b7280); font-size:12px; line-height:1.6;
        background:rgba(255,255,255,.50);
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

  function isFiniteNumber(x) {
    return typeof x === 'number' && Number.isFinite(x);
  }

  function toNumber(x) {
    if (isFiniteNumber(x)) return x;
    const n = Number(x);
    return Number.isFinite(n) ? n : null;
  }

  function pad2(n) {
    const s = String(n);
    return s.length === 1 ? '0' + s : s;
  }

  function normalizeMonth(input) {
    if (!input) return null;
    if (input instanceof Date && !isNaN(input.getTime())) {
      return input.getFullYear() + '-' + pad2(input.getMonth() + 1);
    }
    const s = String(input).trim();
    let m = s.match(/^(\d{4})[-\/](\d{1,2})$/);
    if (m) {
      const y = Number(m[1]), mm = Number(m[2]);
      if (mm >= 1 && mm <= 12) return y + '-' + pad2(mm);
    }
    m = s.match(/^(\d{4})(\d{2})$/);
    if (m) {
      const y2 = Number(m[1]), mm2 = Number(m[2]);
      if (mm2 >= 1 && mm2 <= 12) return y2 + '-' + pad2(mm2);
    }
    m = s.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
    if (m) {
      const y3 = Number(m[1]), mm3 = Number(m[2]);
      if (mm3 >= 1 && mm3 <= 12) return y3 + '-' + pad2(mm3);
    }
    return null;
  }

  function normalizeDate(input) {
    if (!input) return null;
    if (input instanceof Date && !isNaN(input.getTime())) {
      return input.getFullYear() + '-' + pad2(input.getMonth() + 1) + '-' + pad2(input.getDate());
    }
    const s = String(input).trim();
    let m = s.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
    if (m) {
      const y = Number(m[1]), mm = Number(m[2]), dd = Number(m[3]);
      if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) return y + '-' + pad2(mm) + '-' + pad2(dd);
    }
    return null;
  }

  function monthValue(key) {
    if (!key) return -1;
    const m = String(key).match(/^(\d{4})-(\d{2})$/);
    if (!m) return -1;
    return Number(m[1]) * 100 + Number(m[2]);
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
      const kk = String(keys[i]).toLowerCase();
      if (map[kk]) return map[kk];
    }
    return null;
  }

  function safeDiv(num, den) {
    const n = toNumber(num);
    const d = toNumber(den);
    if (n === null || d === null || d <= 0) return null;
    return n / d;
  }

  function fmtPct(val, digits) {
    digits = typeof digits === 'number' ? digits : 2;
    if (!isFiniteNumber(val)) return '—';
    return (val * 100).toFixed(digits) + '%';
  }

  function normalizeRetentionRecords(raw) {
    const out = [];
    if (!raw) return out;

    const push = (monthMaybe, dateMaybe, countryMaybe, regMaybe, d1Maybe, d7Maybe) => {
      const date = normalizeDate(dateMaybe);
      const month = normalizeMonth(monthMaybe) || normalizeMonth(date);
      const country = String(countryMaybe || '').toUpperCase();
      const reg = toNumber(regMaybe);
      const d1 = toNumber(d1Maybe);
      const d7 = toNumber(d7Maybe);

      if (!date || !month) return;
      if (!COUNTRIES.includes(country)) return;
      if (reg === null) return;

      out.push({
        date,
        month,
        country,
        registration: reg,
        d1_retained: d1 === null ? 0 : d1,
        d7_retained: d7 === null ? 0 : d7
      });
    };

    // wrapper objects
    if (typeof raw === 'object' && !Array.isArray(raw)) {
      const monthsKey = pickKey(raw, ['months', 'byMonth', 'dataByMonth', 'RAW_ORGANIC_BY_MONTH', 'RAW_PAID_BY_MONTH']);
      if (monthsKey && raw[monthsKey] && typeof raw[monthsKey] === 'object' && !Array.isArray(raw[monthsKey])) {
        return normalizeRetentionRecords(raw[monthsKey]);
      }

      const arrKey = pickKey(raw, ['data', 'rows', 'items', 'list']);
      if (arrKey && Array.isArray(raw[arrKey])) return normalizeRetentionRecords(raw[arrKey]);

      // month-keyed object: { "2025-09": [ {...}, ... ] }
      const keys = Object.keys(raw);
      const looksLikeMonthKeyed = keys.some(k => /^\d{4}[-\/]?\d{2}$/.test(k));
      if (looksLikeMonthKeyed) {
        for (const mk of keys) {
          const mNorm = normalizeMonth(mk);
          if (!mNorm) continue;
          const arr = raw[mk];
          if (!Array.isArray(arr)) continue;
          for (const row of arr) {
            if (!row || typeof row !== 'object') continue;
            const dateK = pickKey(row, ['date', 'day', 'dt']);
            const cK = pickKey(row, ['country', 'geo', 'cty']);
            const rK = pickKey(row, ['registration', 'reg', 'registrations']);
            const d1K = pickKey(row, ['D1_retained_users', 'd1_retained_users', 'D1_RETAINED_USERS', 'd1_retained']);
            const d7K = pickKey(row, ['D7_retained_users', 'd7_retained_users', 'D7_RETAINED_USERS', 'd7_retained']);
            push(mNorm, dateK ? row[dateK] : null, cK ? row[cK] : null, rK ? row[rK] : null, d1K ? row[d1K] : null, d7K ? row[d7K] : null);
          }
        }
        return out;
      }
    }

    // array rows
    if (Array.isArray(raw)) {
      for (const row of raw) {
        if (!row || typeof row !== 'object') continue;
        const dateK = pickKey(row, ['date', 'day', 'dt']);
        const monthK = pickKey(row, ['month', 'ym']);
        const cK = pickKey(row, ['country', 'geo', 'cty']);
        const rK = pickKey(row, ['registration', 'reg', 'registrations']);
        const d1K = pickKey(row, ['D1_retained_users', 'd1_retained_users', 'D1_RETAINED_USERS', 'd1_retained']);
        const d7K = pickKey(row, ['D7_retained_users', 'd7_retained_users', 'D7_RETAINED_USERS', 'd7_retained']);
        const monthMaybe = monthK ? row[monthK] : (dateK ? row[dateK] : null);
        push(monthMaybe, dateK ? row[dateK] : null, cK ? row[cK] : null, rK ? row[rK] : null, d1K ? row[d1K] : null, d7K ? row[d7K] : null);
      }
    }

    return out;
  }

  function aggregateMonthly(records) {
    const map = new Map();
    for (const r of records) {
      const key = `${r.month}|${r.country}`;
      const prev = map.get(key) || { reg: 0, d1: 0, d7: 0 };
      prev.reg += toNumber(r.registration) || 0;
      prev.d1 += toNumber(r.d1_retained) || 0;
      prev.d7 += toNumber(r.d7_retained) || 0;
      map.set(key, prev);
    }
    return map;
  }

  function aggregateDaily(records) {
    const map = new Map();
    for (const r of records) {
      const key = `${r.date}|${r.country}`;
      const prev = map.get(key) || { reg: 0, d1: 0, d7: 0, month: r.month };
      prev.reg += toNumber(r.registration) || 0;
      prev.d1 += toNumber(r.d1_retained) || 0;
      prev.d7 += toNumber(r.d7_retained) || 0;
      prev.month = prev.month || r.month;
      map.set(key, prev);
    }
    return map;
  }

  function uniqueMonthsFrom(recordsA, recordsB) {
    const set = new Set();
    for (const r of (recordsA || [])) if (r && r.month) set.add(r.month);
    for (const r of (recordsB || [])) if (r && r.month) set.add(r.month);
    const arr = Array.from(set).filter(Boolean);
    arr.sort((a, b) => monthValue(a) - monthValue(b));
    return arr;
  }

  function getDatesForMonth(recordsA, recordsB, month, countries) {
    const set = new Set();
    for (const r of (recordsA || [])) {
      if (!r || r.month !== month) continue;
      if (countries && countries.length && !countries.includes(r.country)) continue;
      set.add(r.date);
    }
    for (const r of (recordsB || [])) {
      if (!r || r.month !== month) continue;
      if (countries && countries.length && !countries.includes(r.country)) continue;
      set.add(r.date);
    }
    const arr = Array.from(set);
    arr.sort(); // YYYY-MM-DD lexicographic OK
    return arr;
  }

  function getCountryColorMap() {
    // 线图：按国家配色；保持自然/买量同色（用虚/实线区分）。
    return {
      GH: '#2563eb',
      KE: '#16a34a',
      NG: '#f59e0b',
      TZ: '#7c3aed'
    };
  }

  function ensureEcharts() {
    if (window.echarts) return Promise.resolve(window.echarts);

    let script = document.getElementById(ECHARTS_SCRIPT_ID);
    if (!script) {
      script = document.createElement('script');
      script.id = ECHARTS_SCRIPT_ID;
      script.src = ECHARTS_SRC;
      script.async = true;
      document.head.appendChild(script);
    }

    return new Promise((resolve, reject) => {
      const start = Date.now();
      const timeoutMs = 12000;

      const tick = () => {
        if (window.echarts) return resolve(window.echarts);
        if (Date.now() - start > timeoutMs) return reject(new Error('echarts not available'));
        setTimeout(tick, 60);
      };
      tick();
    });
  }

  register({
    id: MODULE_ID,
    title: '次日 / 7 日留存率',
    subtitle: '次留=D1_retained_users/registration；七留=D7_retained_users/registration',
    span: 'half',
    render({ mountEl, organic, paid, utils }) {
      injectStylesOnce();

      // 兜底：如果 index 没把数据传进来，尝试从全局读取
      if (!organic) {
        try { organic = window.organicData || window.ORGANIC_DATA || window.RAW_ORGANIC_BY_MONTH; } catch (_e) {}
      }
      if (!paid) {
        try { paid = window.paidData || window.PAID_DATA || window.RAW_PAID_BY_MONTH; } catch (_e) {}
      }

      const organicRecords = normalizeRetentionRecords(organic);
      const paidRecords = normalizeRetentionRecords(paid);

      const months = uniqueMonthsFrom(organicRecords, paidRecords);
      const latestMonth = months.length ? months[months.length - 1] : null;

      const monthlyOrg = aggregateMonthly(organicRecords);
      const monthlyPaid = aggregateMonthly(paidRecords);
      const dailyOrg = aggregateDaily(organicRecords);
      const dailyPaid = aggregateDaily(paidRecords);

      const uid = `ovp-${MODULE_ID}-${Math.random().toString(16).slice(2)}`;
      const monthId = `${uid}-month`;
      const chartId = `${uid}-chart`;
      const countriesId = `${uid}-countries`;
      const tableId = `${uid}-table`;
      const insightsId = `${uid}-insights`;

      // state
      const state = {
        month: latestMonth,
        chartType: 'bar', // bar | line
        metricMode: 'both', // d1 | d7 | both
        countries: COUNTRIES.slice()
      };

      mountEl.innerHTML = `
        <div class="ovp-m6">
          <div class="row">
            <div class="fg">
              <label for="${monthId}">月份</label>
              <select id="${monthId}"></select>
            </div>

            <div class="fg" style="min-width:220px">
              <label>图表</label>
              <div class="seg" role="group" aria-label="图表类型切换">
                <button type="button" data-chart="bar" aria-pressed="true">月度柱状图</button>
                <button type="button" data-chart="line" aria-pressed="false">日级折线图</button>
              </div>
              <div class="hint">柱图：自然黄 / 买量蓝；七留使用斜线纹理。</div>
            </div>

            <div class="fg" style="min-width:240px">
              <label>留存口径</label>
              <div class="seg" role="group" aria-label="留存口径切换">
                <button type="button" data-metric="d1" aria-pressed="false">次留（D1）</button>
                <button type="button" data-metric="d7" aria-pressed="false">七留（D7）</button>
                <button type="button" data-metric="both" aria-pressed="true">次留 + 七留</button>
              </div>
            </div>
          </div>

          <div class="fg" style="min-width:100%">
            <label>国家（多选）</label>
            <div class="chips" id="${countriesId}"></div>
            <div class="hint">折线图：每个国家同色；自然虚线、买量实线。</div>
          </div>

          <div class="subline" id="${uid}-subline">
            <div class="k"><span class="dot" style="background:${cssVar('--ovp-yellow', '#F6C344')}"></span>自然量</div>
            <div class="k"><span class="dot" style="background:${cssVar('--ovp-blue', '#2563eb')}"></span>买量</div>
          </div>

          <div id="${chartId}" class="chart"></div>

          <div class="table-wrap" id="${tableId}"></div>

          <div id="${insightsId}"></div>
        </div>
      `;

      const monthEl = mountEl.querySelector(`#${monthId}`);
      const countriesEl = mountEl.querySelector(`#${countriesId}`);
      const chartEl = mountEl.querySelector(`#${chartId}`);
      const tableEl = mountEl.querySelector(`#${tableId}`);
      const insightsEl = mountEl.querySelector(`#${insightsId}`);
      const sublineEl = mountEl.querySelector(`#${uid}-subline`);

      // months dropdown
      if (!months.length) {
        monthEl.innerHTML = `<option value="">无可用月份</option>`;
        chartEl.innerHTML = `<div class="empty">未检测到留存数据：请检查 organic-data.js / paid-data.js 是否包含 registration、D1_retained_users、D7_retained_users 字段。</div>`;
        tableEl.innerHTML = '';
        try { if (OVP.insights && OVP.insights.render) OVP.insights.render(insightsEl, MODULE_ID, null); } catch (_e) {}
        return;
      }

      // sort latest on top
      const monthsDesc = months.slice().sort((a, b) => monthValue(b) - monthValue(a));
      monthEl.innerHTML = monthsDesc.map(m => `<option value="${m}">${m}</option>`).join('');
      monthEl.value = state.month;

      // countries chips
      countriesEl.innerHTML = COUNTRIES.map(c => {
        return `
          <label class="chip">
            <input type="checkbox" value="${c}" ${state.countries.includes(c) ? 'checked' : ''} />
            <span>${c}</span>
          </label>
        `;
      }).join('');

      // chart instance
      let chart = null;

      function setSegPressed(segEl, attr, value) {
        const btns = segEl.querySelectorAll('button[' + attr + ']');
        btns.forEach(btn => {
          const pressed = btn.getAttribute(attr) === value;
          btn.setAttribute('aria-pressed', pressed ? 'true' : 'false');
        });
      }

      function readCountries() {
        const checks = Array.from(countriesEl.querySelectorAll('input[type="checkbox"]'));
        const picked = checks.filter(i => i.checked).map(i => String(i.value).toUpperCase());

        // 至少保留一个
        if (!picked.length) {
          checks[0].checked = true;
          return [String(checks[0].value).toUpperCase()];
        }
        // 固定顺序
        return COUNTRIES.filter(c => picked.includes(c));
      }

      function metricLabel(mode) {
        if (mode === 'd1') return '次留（D1）';
        if (mode === 'd7') return '七留（D7）';
        return '次留 + 七留';
      }

      function updateSubline() {
        if (!sublineEl) return;
        const cText = state.countries.join('/');
        sublineEl.innerHTML = `
          <div class="k"><span class="dot" style="background:${cssVar('--ovp-yellow', '#F6C344')}"></span>自然量</div>
          <div class="k"><span class="dot" style="background:${cssVar('--ovp-blue', '#2563eb')}"></span>买量</div>
          <div class="k">月份：${state.month} · 国家：${cText || '—'} · 口径：${metricLabel(state.metricMode)}</div>
        `;
      }

      function getMonthlyAgg(map, month, country) {
        return map.get(`${month}|${country}`) || { reg: 0, d1: 0, d7: 0 };
      }

      function buildBarOption() {
        const colorOrg = cssVar('--ovp-yellow', '#F6C344');
        const colorPaid = cssVar('--ovp-blue', '#2563eb');
        const muted = cssVar('--muted', '#6b7280');
        const border = cssVar('--border', 'rgba(148,163,184,.6)');

        const pickedCountries = state.countries.length ? state.countries : COUNTRIES.slice();
        const metricModes = state.metricMode === 'both' ? ['d1', 'd7'] : [state.metricMode];

        const series = [];
        const mkDecal = () => ({
          symbol: 'rect',
          dashArrayX: [2, 1],
          dashArrayY: [4, 2],
          rotation: Math.PI / 6,
          color: 'rgba(255,255,255,0.55)'
        });

        // order: organic metrics, then paid metrics
        const orderPlan = [];
        for (const m of metricModes) orderPlan.push({ type: 'organic', metric: m });
        for (const m of metricModes) orderPlan.push({ type: 'paid', metric: m });

        for (const plan of orderPlan) {
          const isOrganic = plan.type === 'organic';
          const isD7 = plan.metric === 'd7';

          const data = pickedCountries.map(c => {
            const mAgg = getMonthlyAgg(isOrganic ? monthlyOrg : monthlyPaid, state.month, c);
            const num = isD7 ? mAgg.d7 : mAgg.d1;
            return safeDiv(num, mAgg.reg);
          });

          let name = isOrganic ? '自然量 ' : '买量 ';
          name += isD7 ? '七留(D7)' : '次留(D1)';

          series.push({
            name,
            type: 'bar',
            barWidth: 12,
            itemStyle: {
              color: isOrganic ? colorOrg : colorPaid,
              decal: isD7 ? mkDecal() : null
            },
            emphasis: { focus: 'series' },
            data
          });
        }

        return {
          grid: { left: 36, right: 18, top: 40, bottom: 30, containLabel: true },
          legend: {
            top: 6,
            left: 'center',
            textStyle: { color: muted, fontSize: 11 },
            type: 'scroll'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            valueFormatter: (v) => (isFiniteNumber(v) ? fmtPct(v, 2) : '—')
          },
          xAxis: {
            type: 'category',
            data: pickedCountries,
            axisLabel: { color: muted },
            axisTick: { alignWithLabel: true },
            axisLine: { lineStyle: { color: border } }
          },
          yAxis: {
            type: 'value',
            min: 0,
            max: 1,
            axisLabel: { color: muted, formatter: (v) => (v * 100).toFixed(0) + '%' },
            splitLine: { lineStyle: { color: 'rgba(148,163,184,.20)' } }
          },
          series
        };
      }

      function buildLineOption() {
        const muted = cssVar('--muted', '#6b7280');
        const border = cssVar('--border', 'rgba(148,163,184,.6)');

        const pickedCountries = state.countries.length ? state.countries : COUNTRIES.slice();
        const dates = getDatesForMonth(organicRecords, paidRecords, state.month, pickedCountries);
        if (!dates.length) return null;

        const metricModes = state.metricMode === 'both' ? ['d1', 'd7'] : [state.metricMode];
        const dailyGet = (map, date, country) => map.get(`${date}|${country}`) || null;

        const countryColors = getCountryColorMap();
        const series = [];

        for (const c of pickedCountries) {
          const baseColor = countryColors[c] || '#2563eb';

          for (const metric of metricModes) {
            const isD7 = metric === 'd7';
            const opacity = isD7 && metricModes.length > 1 ? 0.55 : 1;

            // organic series
            series.push({
              name: `${c} 自然 ${isD7 ? '七留' : '次留'}`,
              type: 'line',
              showSymbol: false,
              connectNulls: false,
              lineStyle: { type: 'dashed', width: 2, color: baseColor, opacity },
              itemStyle: { color: baseColor, opacity },
              emphasis: { focus: 'series' },
              data: dates.map(d => {
                const v = dailyGet(dailyOrg, d, c);
                if (!v) return null;
                const num = isD7 ? v.d7 : v.d1;
                return safeDiv(num, v.reg);
              })
            });

            // paid series
            series.push({
              name: `${c} 买量 ${isD7 ? '七留' : '次留'}`,
              type: 'line',
              showSymbol: false,
              connectNulls: false,
              lineStyle: { type: 'solid', width: 2, color: baseColor, opacity },
              itemStyle: { color: baseColor, opacity },
              emphasis: { focus: 'series' },
              data: dates.map(d => {
                const v = dailyGet(dailyPaid, d, c);
                if (!v) return null;
                const num = isD7 ? v.d7 : v.d1;
                return safeDiv(num, v.reg);
              })
            });
          }
        }

        return {
          grid: { left: 36, right: 18, top: 50, bottom: 36, containLabel: true },
          legend: {
            top: 6,
            left: 'center',
            textStyle: { color: muted, fontSize: 11 },
            type: 'scroll'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'line' },
            valueFormatter: (v) => (isFiniteNumber(v) ? fmtPct(v, 2) : '—')
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dates,
            axisLabel: {
              color: muted,
              formatter: (v) => String(v).slice(8) // 仅显示日
            },
            axisLine: { lineStyle: { color: border } }
          },
          yAxis: {
            type: 'value',
            min: 0,
            max: 1,
            axisLabel: { color: muted, formatter: (v) => (v * 100).toFixed(0) + '%' },
            splitLine: { lineStyle: { color: 'rgba(148,163,184,.20)' } }
          },
          series
        };
      }

      function renderTable() {
        const pickedCountries = state.countries.length ? state.countries : COUNTRIES.slice();

        const rows = pickedCountries.map(c => {
          const o = getMonthlyAgg(monthlyOrg, state.month, c);
          const p = getMonthlyAgg(monthlyPaid, state.month, c);

          const oD1 = safeDiv(o.d1, o.reg);
          const oD7 = safeDiv(o.d7, o.reg);
          const pD1 = safeDiv(p.d1, p.reg);
          const pD7 = safeDiv(p.d7, p.reg);

          const fPct = (x) => {
            if (utils && typeof utils.fmtPct === 'function') return utils.fmtPct(x, 2);
            return fmtPct(x, 2);
          };

          return `
            <tr>
              <td>${c}</td>
              <td>${fPct(oD1)}</td>
              <td>${fPct(oD7)}</td>
              <td>${fPct(pD1)}</td>
              <td>${fPct(pD7)}</td>
            </tr>
          `;
        }).join('');

        tableEl.innerHTML = `
          <table>
            <thead>
              <tr>
                <th>国家</th>
                <th>自然量次留</th>
                <th>自然量七留</th>
                <th>买量次留</th>
                <th>买量七留</th>
              </tr>
            </thead>
            <tbody>
              ${rows || `<tr><td colspan="5">—</td></tr>`}
            </tbody>
          </table>
        `;
      }

      function renderInsights() {
        try {
          if (OVP.insights && typeof OVP.insights.render === 'function') {
            OVP.insights.render(insightsEl, MODULE_ID, state.month);
            return;
          }
        } catch (_e) {}
        insightsEl.innerHTML = `<div class="empty">未加载 insights-copy.js（或文案未配置）。</div>`;
      }

      function renderChart() {
        const showEmpty = (msg) => {
          if (chart) { try { chart.dispose(); } catch (_e) {} chart = null; }
          chartEl.innerHTML = `<div class="empty">${msg}</div>`;
        };

        const option = state.chartType === 'bar' ? buildBarOption() : buildLineOption();
        if (!option) {
          showEmpty('当前筛选下无可展示的日级数据。');
          return;
        }

        ensureEcharts().then((echarts) => {
          if (!chart) {
            chartEl.innerHTML = '';
            chart = echarts.init(chartEl);
          }
          chart.setOption(option, true);
          requestAnimationFrame(() => { try { chart.resize(); } catch (_e) {} });
        }).catch((_e) => {
          showEmpty('图表库加载失败：echarts not available');
        });
      }

      function updateAll() {
        updateSubline();
        renderChart();
        renderTable();
        renderInsights();
      }

      // events
      monthEl.addEventListener('change', () => {
        state.month = String(monthEl.value || state.month);
        updateAll();
      });

      countriesEl.addEventListener('change', () => {
        state.countries = readCountries();
        updateAll();
      });

      // chart type seg
      const root = monthEl.closest('.ovp-m6');
      const chartSeg = root.querySelector('[aria-label="图表类型切换"]');
      chartSeg.addEventListener('click', (e) => {
        const btn = e.target && e.target.closest('button[data-chart]');
        if (!btn) return;
        state.chartType = btn.getAttribute('data-chart');
        setSegPressed(chartSeg, 'data-chart', state.chartType);
        updateAll();
      });

      // metric seg
      const metricSeg = root.querySelector('[aria-label="留存口径切换"]');
      metricSeg.addEventListener('click', (e) => {
        const btn = e.target && e.target.closest('button[data-metric]');
        if (!btn) return;
        state.metricMode = btn.getAttribute('data-metric');
        setSegPressed(metricSeg, 'data-metric', state.metricMode);
        updateAll();
      });

      window.addEventListener('resize', () => { if (chart) { try { chart.resize(); } catch (_e) {} } });

      // initial
      updateAll();
    }
  });
})();
