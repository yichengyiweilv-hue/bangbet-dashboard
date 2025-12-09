/* organic-monthly/module-retention.js
 * 模块 6：次留 / 七留（自然量）
 * 口径：
 * - 次留 = D1_retained_users / registration
 * - 七留 = D7_retained_users / registration
 */
(function () {
  'use strict';

  const OVP = window.OVP;
  if (!OVP || typeof OVP.registerModule !== 'function') return;

  const MODULE_ID = 'retention';

  // 国家固定顺序（强约束）
  const COUNTRY_ORDER = ['GH', 'KE', 'NG', 'TZ', 'UG'];

  // 指标定义（可多选）
  const METRICS = [
    { key: 'D1', label: '次留', numerator: 'D1_retained_users', lineType: 'dashed', hatch: false },
    { key: 'D7', label: '七留', numerator: 'D7_retained_users', lineType: 'solid', hatch: true },
  ];
  const METRIC_ORDER = METRICS.map((m) => m.key);

  // 国家颜色（折线：同国家次留/七留共用同色）
  const COUNTRY_COLOR = {
    GH: '#2563eb',
    KE: '#f97316',
    NG: '#16a34a',
    TZ: '#7c3aed',
    UG: '#0ea5e9',
  };

  // 月份颜色（柱状：同月同色，不同月不同色）
  const MONTH_PALETTE = [
    '#2563eb',
    '#f97316',
    '#16a34a',
    '#7c3aed',
    '#0ea5e9',
    '#db2777',
    '#a16207',
    '#0f766e',
    '#1f2937',
  ];

  // -----------------------
  // Style (inject once)
  // -----------------------
  function injectStylesOnce() {
    const styleId = 'ovp-retention-style';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .ovp-ret-wrap{ display:flex; flex-direction:column; gap:12px; }

      .ovp-ret-filters{
        display:grid;
        grid-template-columns: 1fr;
        gap:10px;
        padding:10px 12px;
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background: rgba(249, 250, 251, 0.90);
      }
      .ovp-ret-filter-row{
        display:flex;
        flex-wrap:wrap;
        gap:12px;
        align-items:flex-start;
      }
      .ovp-ret-group{
        display:flex;
        flex-direction:column;
        gap:6px;
        min-width: 240px;
      }
      .ovp-ret-label{
        font-size:11px;
        color: var(--muted);
      }
      .ovp-ret-options{
        display:flex;
        flex-wrap:wrap;
        gap:8px 12px;
      }
      .ovp-ret-option{
        display:inline-flex;
        align-items:center;
        gap:6px;
        font-size:12px;
        color: var(--text);
        user-select:none;
        white-space:nowrap;
      }
      .ovp-ret-option input{
        margin:0;
        transform: translateY(0.5px);
      }

      /* Segmented switch */
      .ovp-ret-switch{
        display:inline-flex;
        gap:8px;
        padding:2px;
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:999px;
        background:#fff;
      }
      .ovp-ret-switch label{
        padding:6px 10px;
        border-radius:999px;
        font-size:12px;
        color: var(--muted);
        cursor:pointer;
        user-select:none;
        border:1px solid transparent;
      }
      .ovp-ret-switch label.is-active{
        background: rgba(37,99,235,0.10);
        color: var(--text);
        border-color: rgba(37,99,235,0.25);
      }

      .ovp-ret-help{
        margin-top:8px;
        font-size:11px;
        color:var(--muted);
        line-height:1.5;
      }

      .ovp-ret-table-wrap{ overflow:auto; }
      .ovp-ret-table{
        width:100%;
        min-width: 720px;
        border-collapse:separate;
        border-spacing:0;
        overflow:hidden;
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background:#fff;
      }
      .ovp-ret-table th, .ovp-ret-table td{
        padding:10px 8px;
        font-size:12px;
        line-height:1.2;
        text-align:center;
        border-bottom:1px solid rgba(148, 163, 184, 0.25);
        border-right:1px solid rgba(148, 163, 184, 0.25);
        white-space:nowrap;
      }
      .ovp-ret-table th{
        font-size:11px;
        color: var(--muted);
        background: rgba(249, 250, 251, 0.90);
      }
      .ovp-ret-table tr:last-child td{ border-bottom:none; }
      .ovp-ret-table th:last-child, .ovp-ret-table td:last-child{ border-right:none; }

      .ovp-ret-insights{ display:flex; flex-direction:column; gap:8px; }
      .ovp-ret-insight{
        background:#ffffff;
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        padding:10px 12px;
        color:var(--text);
        font-size:12px;
        line-height:1.65;
        white-space: pre-wrap;
        word-break: break-word;
      }
      .ovp-ret-insight.is-empty{ color: var(--muted); }
      .ovp-ret-insight-title{
        font-size:11px;
        color: var(--muted);
        margin:0 0 6px;
      }
    `;
    document.head.appendChild(style);
  }

  // -----------------------
  // Utils
  // -----------------------
  function safeNum(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function rate(n, d) {
    const dn = safeNum(d);
    if (dn <= 0) return null;
    return safeNum(n) / dn;
  }

  function pctFmt(v) {
    const n = Number(v);
    return Number.isFinite(n) ? `${(n * 100).toFixed(2)}%` : '—';
  }

  function uniq(arr) {
    const out = [];
    const s = new Set();
    for (const x of Array.isArray(arr) ? arr : []) {
      const k = String(x);
      if (s.has(k)) continue;
      s.add(k);
      out.push(k);
    }
    return out;
  }

  function monthParts(m) {
    const s = String(m || '');
    const parts = s.split('-');
    const y = parts[0] || '';
    const mn = Number(parts[1]);
    return { y, mn: Number.isFinite(mn) ? mn : null };
  }

  function fmtMonthCN(m, withYear) {
    const { y, mn } = monthParts(m);
    if (!mn) return String(m || '');
    return withYear ? `${y}年${mn}月` : `${mn}月`;
  }

  function orderedFromSet(order, set) {
    const out = [];
    for (const x of order) if (set.has(x)) out.push(x);
    return out;
  }

  function toggleSet(set, value, on) {
    const next = new Set(set);
    if (on) next.add(value);
    else next.delete(value);
    return next;
  }

  // -----------------------
  // Data index
  // -----------------------
  function buildIndex(rawByMonth) {
    const monthAgg = Object.create(null); // month -> country -> {reg,d1,d7}
    const dayByMonth = Object.create(null); // month -> date -> country -> {reg,d1,d7}

    for (const [month, rows] of Object.entries(rawByMonth || {})) {
      if (!Array.isArray(rows)) continue;
      if (!monthAgg[month]) monthAgg[month] = Object.create(null);
      if (!dayByMonth[month]) dayByMonth[month] = Object.create(null);

      for (const r of rows) {
        const date = String(r.date || '').trim();
        const c = String(r.country || '').trim();
        if (!date || !c) continue;

        const reg = safeNum(r.registration);
        const d1 = safeNum(r.D1_retained_users);
        const d7 = safeNum(r.D7_retained_users);

        const agg = monthAgg[month][c] || { reg: 0, d1: 0, d7: 0 };
        agg.reg += reg;
        agg.d1 += d1;
        agg.d7 += d7;
        monthAgg[month][c] = agg;

        if (!dayByMonth[month][date]) dayByMonth[month][date] = Object.create(null);
        dayByMonth[month][date][c] = { reg, d1, d7 };
      }
    }

    return { monthAgg, dayByMonth };
  }

  // -----------------------
  // Colors / patterns
  // -----------------------
  const patternCache = new Map();

  function stripePattern(baseColor) {
    const key = String(baseColor || '').trim() || '#999999';
    if (patternCache.has(key)) return patternCache.get(key);

    const canvas = document.createElement('canvas');
    canvas.width = 12;
    canvas.height = 12;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = key;
    ctx.fillRect(0, 0, 12, 12);

    ctx.strokeStyle = 'rgba(255,255,255,0.70)';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(-6, 12);
    ctx.lineTo(12, -6);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 18);
    ctx.lineTo(18, 0);
    ctx.stroke();

    const pattern = { image: canvas, repeat: 'repeat' };
    patternCache.set(key, pattern);
    return pattern;
  }

  function monthColor(month, allMonths) {
    const idx = Array.isArray(allMonths) ? allMonths.indexOf(month) : -1;
    const i = idx >= 0 ? idx : 0;
    if (i < MONTH_PALETTE.length) return MONTH_PALETTE[i];
    const hue = (i * 47) % 360;
    return `hsl(${hue}, 70%, 48%)`;
  }

  // -----------------------
  // ECharts option builders
  // -----------------------
  function yMaxFn(val) {
    const mx = Number(val && val.max);
    if (!Number.isFinite(mx) || mx <= 0) return 1;
    const padded = mx * 1.15;
    const step = 0.1;
    return Math.max(step, Math.ceil(padded / step) * step);
  }

  function buildBarOption(state, idx) {
    const months = state.selectedMonths;
    const countries = state.selectedCountries; // already ordered
    const metrics = state.selectedMetrics;

    const years = new Set(months.map((m) => String(m).split('-')[0]).filter(Boolean));
    const withYear = years.size > 1;

    const series = [];
    for (const m of months) {
      const base = monthColor(m, state.allMonths);
      for (const mk of metrics) {
        const meta = METRICS.find((x) => x.key === mk);
        if (!meta) continue;

        const name = `${fmtMonthCN(m, withYear)}${meta.label}`;
        const data = countries.map((c) => {
          const agg = idx.monthAgg[m] && idx.monthAgg[m][c];
          if (!agg) return null;
          return mk === 'D1' ? rate(agg.d1, agg.reg) : rate(agg.d7, agg.reg);
        });

        series.push({
          name,
          type: 'bar',
          barMaxWidth: 26,
          emphasis: { focus: 'series' },
          itemStyle: {
            color: mk === 'D7' ? stripePattern(base) : base,
            borderRadius: [4, 4, 0, 0],
          },
          data,
        });
      }
    }

    return {
      grid: { left: 46, right: 18, top: 38, bottom: 38, containLabel: true },
      legend: { type: 'scroll', top: 0, left: 0, textStyle: { fontSize: 11, color: '#6b7280' } },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        valueFormatter: (v) => (v == null ? '—' : `${(v * 100).toFixed(2)}%`),
      },
      xAxis: {
        type: 'category',
        data: countries,
        axisTick: { alignWithLabel: true },
        axisLabel: { color: '#6b7280', fontSize: 11 },
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.55)' } },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: yMaxFn,
        axisLabel: { formatter: (v) => `${Math.round(v * 100)}%`, color: '#6b7280', fontSize: 11 },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.25)' } },
        axisLine: { show: false },
      },
      series,
    };
  }

  function buildLineOption(state, idx) {
    const months = state.selectedMonths;
    const countries = state.selectedCountries; // already ordered
    const metrics = state.selectedMetrics;

    // dates from selected months
    const dateSet = new Set();
    for (const m of months) {
      const obj = idx.dayByMonth[m];
      if (!obj) continue;
      for (const d of Object.keys(obj)) dateSet.add(d);
    }
    const dates = [...dateSet].sort((a, b) => String(a).localeCompare(String(b)));

    const years = new Set(dates.map((d) => String(d).slice(0, 4)).filter(Boolean));
    const shortLabel = years.size <= 1;
    const axisLabelFormatter = (v) => {
      const s = String(v || '');
      if (s.length < 10) return s;
      return shortLabel ? s.slice(5) : s.slice(2); // MM-DD or YY-MM-DD
    };

    const series = [];
    for (const c of countries) {
      const color = COUNTRY_COLOR[c] || '#2563eb';
      for (const mk of metrics) {
        const meta = METRICS.find((x) => x.key === mk);
        if (!meta) continue;

        const data = dates.map((d) => {
          const m = String(d).slice(0, 7);
          const row = idx.dayByMonth[m] && idx.dayByMonth[m][d] && idx.dayByMonth[m][d][c];
          if (!row) return null;
          return mk === 'D1' ? rate(row.d1, row.reg) : rate(row.d7, row.reg);
        });

        series.push({
          name: `${c} ${meta.label}`,
          type: 'line',
          showSymbol: false,
          connectNulls: false,
          emphasis: { focus: 'series' },
          lineStyle: { width: 2, type: meta.lineType, color },
          itemStyle: { color },
          data,
        });
      }
    }

    return {
      grid: { left: 46, right: 18, top: 38, bottom: 46, containLabel: true },
      legend: { type: 'scroll', top: 0, left: 0, textStyle: { fontSize: 11, color: '#6b7280' } },
      tooltip: {
        trigger: 'axis',
        valueFormatter: (v) => (v == null ? '—' : `${(v * 100).toFixed(2)}%`),
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: { color: '#6b7280', fontSize: 11, formatter: axisLabelFormatter, hideOverlap: true },
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.55)' } },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: yMaxFn,
        axisLabel: { formatter: (v) => `${Math.round(v * 100)}%`, color: '#6b7280', fontSize: 11 },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.25)' } },
        axisLine: { show: false },
      },
      series,
    };
  }

  // -----------------------
  // Render helpers (table/insights/note)
  // -----------------------
  function renderNote(noteEl, state) {
    if (!noteEl) return;
    const kind =
      state.chartType === 'bar'
        ? '月度柱状图：按国家聚合（当月求和后计算留存率）'
        : '日级折线图：按日展示（各国家不加总）';
    const mTxt =
      state.selectedMetrics.length
        ? state.selectedMetrics.map((k) => (k === 'D1' ? '次留' : '七留')).join(' / ')
        : '—';
    noteEl.textContent = `${kind} · 数据：${mTxt} · 口径：次留=D1_retained_users/registration；七留=D7_retained_users/registration`;
  }

  function renderTable(tableEl, state, idx) {
    if (!tableEl) return;

    const months = state.selectedMonths;
    const countries = state.selectedCountries;
    const metrics = state.selectedMetrics;

    const years = new Set(months.map((m) => String(m).split('-')[0]).filter(Boolean));
    const withYear = years.size > 1;

    const thead = document.createElement('thead');
    const trh = document.createElement('tr');
    const th0 = document.createElement('th');
    th0.textContent = '国家';
    trh.appendChild(th0);

    for (const m of months) {
      const mLabel = fmtMonthCN(m, withYear);
      for (const mk of metrics) {
        const meta = METRICS.find((x) => x.key === mk);
        if (!meta) continue;
        const th = document.createElement('th');
        th.textContent = `${mLabel}自然量${meta.label}`;
        trh.appendChild(th);
      }
    }
    thead.appendChild(trh);

    const tbody = document.createElement('tbody');
    for (const c of countries) {
      const tr = document.createElement('tr');
      const td0 = document.createElement('td');
      td0.textContent = c;
      tr.appendChild(td0);

      for (const m of months) {
        const agg = idx.monthAgg[m] && idx.monthAgg[m][c];
        for (const mk of metrics) {
          const td = document.createElement('td');
          if (!agg) td.textContent = '—';
          else {
            const v = mk === 'D1' ? rate(agg.d1, agg.reg) : rate(agg.d7, agg.reg);
            td.textContent = pctFmt(v);
          }
          tr.appendChild(td);
        }
      }
      tbody.appendChild(tr);
    }

    tableEl.innerHTML = '';
    tableEl.appendChild(thead);
    tableEl.appendChild(tbody);
  }

  function renderInsights(wrapEl, months) {
    if (!wrapEl) return;
    wrapEl.innerHTML = '';

    const list = uniq(months).sort((a, b) => String(a).localeCompare(String(b)));

    for (const m of list) {
      const box = document.createElement('div');
      box.className = 'ovp-ret-insight';

      const title = document.createElement('div');
      title.className = 'ovp-ret-insight-title';
      title.textContent = m;

      const text =
        typeof OVP.getInsight === 'function' ? String(OVP.getInsight(MODULE_ID, m) || '').trim() : '';
      const content = document.createElement('div');

      if (!text) {
        box.classList.add('is-empty');
        content.textContent = '文案待填写：./insights.js';
      } else {
        content.textContent = text;
      }

      box.appendChild(title);
      box.appendChild(content);
      wrapEl.appendChild(box);
    }
  }

  // -----------------------
  // UI builders
  // -----------------------
  function mountUI(mountEl) {
    const chartHeight = 360;

    mountEl.innerHTML = `
      <div class="ovp-ret-wrap" id="ovp-ret-${MODULE_ID}">
        <div class="ovp-ret-filters">
          <div class="ovp-ret-filter-row">
            <div class="ovp-ret-group" style="flex:2 1 560px;">
              <div class="ovp-ret-label">月份（多选）</div>
              <div class="ovp-ret-options" id="ovp-ret-months-${MODULE_ID}"></div>
            </div>

            <div class="ovp-ret-group" style="flex:1 1 280px;">
              <div class="ovp-ret-label">国家（多选）</div>
              <div class="ovp-ret-options" id="ovp-ret-countries-${MODULE_ID}"></div>
            </div>
          </div>

          <div class="ovp-ret-filter-row">
            <div class="ovp-ret-group" style="flex:1 1 280px;">
              <div class="ovp-ret-label">图表</div>
              <div class="ovp-ret-options">
                <div class="ovp-ret-switch" id="ovp-ret-chartType-${MODULE_ID}">
                  <label data-value="bar">月度柱状图</label>
                  <label data-value="line">日级折线图</label>
                </div>
              </div>
            </div>

            <div class="ovp-ret-group" style="flex:1 1 280px;">
              <div class="ovp-ret-label">数据（多选）</div>
              <div class="ovp-ret-options" id="ovp-ret-metrics-${MODULE_ID}"></div>
            </div>
          </div>
        </div>

        <div>
          <div class="ovp-chart" id="chart-${MODULE_ID}" style="height:${chartHeight}px;"></div>
          <div class="ovp-ret-help" id="ovp-ret-note-${MODULE_ID}"></div>
        </div>

        <div class="ovp-ret-table-wrap">
          <table class="ovp-ret-table" id="ovp-ret-table-${MODULE_ID}"></table>
        </div>

        <div class="ovp-ret-insights" id="ovp-ret-insights-${MODULE_ID}"></div>
      </div>
    `;

    return {
      monthsEl: mountEl.querySelector(`#ovp-ret-months-${MODULE_ID}`),
      countriesEl: mountEl.querySelector(`#ovp-ret-countries-${MODULE_ID}`),
      metricsEl: mountEl.querySelector(`#ovp-ret-metrics-${MODULE_ID}`),
      chartTypeEl: mountEl.querySelector(`#ovp-ret-chartType-${MODULE_ID}`),
      chartEl: mountEl.querySelector(`#chart-${MODULE_ID}`),
      noteEl: mountEl.querySelector(`#ovp-ret-note-${MODULE_ID}`),
      tableEl: mountEl.querySelector(`#ovp-ret-table-${MODULE_ID}`),
      insightsEl: mountEl.querySelector(`#ovp-ret-insights-${MODULE_ID}`),
    };
  }

  function setActiveSwitch(switchEl, value) {
    if (!switchEl) return;
    const labels = [...switchEl.querySelectorAll('label[data-value]')];
    for (const lb of labels) {
      const v = lb.getAttribute('data-value');
      lb.classList.toggle('is-active', v === value);
    }
  }

  function bindSwitch(switchEl, initialValue, onChange) {
    setActiveSwitch(switchEl, initialValue);
    if (!switchEl) return;
    const labels = [...switchEl.querySelectorAll('label[data-value]')];
    for (const lb of labels) {
      lb.addEventListener('click', () => {
        const v = lb.getAttribute('data-value');
        if (!v) return;
        setActiveSwitch(switchEl, v);
        onChange(v);
      });
    }
  }

  function renderMonthOptions(container, allMonths, withYear, selectedSet, onToggle) {
    if (!container) return;
    container.innerHTML = '';

    for (const m of allMonths) {
      const label = document.createElement('label');
      label.className = 'ovp-ret-option';

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.value = m;
      input.checked = selectedSet.has(m);

      input.addEventListener('change', () => onToggle(m, input.checked, input));

      const span = document.createElement('span');
      span.textContent = fmtMonthCN(m, withYear);

      label.appendChild(input);
      label.appendChild(span);
      container.appendChild(label);
    }
  }

  function renderCountryOptions(container, selectedSet, onToggle) {
    if (!container) return;
    container.innerHTML = '';

    for (const c of COUNTRY_ORDER) {
      const label = document.createElement('label');
      label.className = 'ovp-ret-option';

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.value = c;
      input.checked = selectedSet.has(c);

      input.addEventListener('change', () => onToggle(c, input.checked, input));

      const span = document.createElement('span');
      span.textContent = c;

      label.appendChild(input);
      label.appendChild(span);
      container.appendChild(label);
    }
  }

  function renderMetricOptions(container, selectedSet, onToggle) {
    if (!container) return;
    container.innerHTML = '';

    for (const meta of METRICS) {
      const label = document.createElement('label');
      label.className = 'ovp-ret-option';

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.value = meta.key;
      input.checked = selectedSet.has(meta.key);

      input.addEventListener('change', () => onToggle(meta.key, input.checked, input));

      const span = document.createElement('span');
      span.textContent = meta.label;

      label.appendChild(input);
      label.appendChild(span);
      container.appendChild(label);
    }
  }

  // -----------------------
  // Module registration
  // -----------------------
  OVP.registerModule({
    id: MODULE_ID,
    title: '次留 / 七留',
    subtitle: '自然量 · 次日留存率（D1）/ 7 日留存率（D7）',
    render(ctx) {
      injectStylesOnce();

      const mountEl = ctx && ctx.mountEl;
      if (!mountEl) return;

      const rawByMonth = (ctx && ctx.rawByMonth) || {};
      const allMonths = Array.isArray(ctx && ctx.months)
        ? ctx.months.slice()
        : Object.keys(rawByMonth || {}).sort((a, b) => String(a).localeCompare(String(b)));

      if (!allMonths.length) {
        mountEl.innerHTML = `<div class="ovp-alert">未检测到月份数据：请检查 data.js 是否按 "YYYY-MM": [...] 提供。</div>`;
        return;
      }

      const latestMonth = String((ctx && ctx.latestMonth) || allMonths[allMonths.length - 1]);
      const idx = buildIndex(rawByMonth);
      const ui = mountUI(mountEl);

      // --- default selection ---
      const defaultMonths = allMonths.length <= 2 ? allMonths.slice() : allMonths.slice(-2);

      let monthSet = new Set(defaultMonths.length ? defaultMonths : [latestMonth]);
      let countrySet = new Set(COUNTRY_ORDER);
      let metricSet = new Set(['D1', 'D7']);
      let chartType = 'bar';

      const monthWithYear = new Set(allMonths.map((m) => String(m).split('-')[0]).filter(Boolean)).size > 1;

      // Init ECharts
      let chart = null;
      if (window.echarts && ui.chartEl) {
        chart = window.echarts.init(ui.chartEl);
      } else if (ui.chartEl) {
        ui.chartEl.innerHTML = `<div class="ovp-placeholder">ECharts 未加载：请确认 index.html 已引入 echarts.min.js</div>`;
      }

      function computeState() {
        const selectedMonths = allMonths.filter((m) => monthSet.has(m));
        const selectedCountries = orderedFromSet(COUNTRY_ORDER, countrySet);
        const selectedMetrics = METRIC_ORDER.filter((k) => metricSet.has(k));

        return {
          chartType,
          selectedMonths,
          selectedCountries,
          selectedMetrics,
          allMonths,
        };
      }

      function renderAll() {
        const state = computeState();

        renderNote(ui.noteEl, state);
        renderTable(ui.tableEl, state, idx);
        renderInsights(ui.insightsEl, state.selectedMonths);

        if (chart) {
          const option = state.chartType === 'bar' ? buildBarOption(state, idx) : buildLineOption(state, idx);
          chart.clear();
          chart.setOption(option, { notMerge: true, lazyUpdate: false });
          chart.resize();
        }
      }

      // Build controls
      renderMonthOptions(ui.monthsEl, allMonths, monthWithYear, monthSet, (m, checked, inputEl) => {
        const next = toggleSet(monthSet, m, checked);
        if (next.size === 0) {
          inputEl.checked = true; // prevent empty
          return;
        }
        monthSet = next;
        renderAll();
      });

      renderCountryOptions(ui.countriesEl, countrySet, (c, checked, inputEl) => {
        const next = toggleSet(countrySet, c, checked);
        if (next.size === 0) {
          inputEl.checked = true; // prevent empty
          return;
        }
        countrySet = next;
        renderAll();
      });

      renderMetricOptions(ui.metricsEl, metricSet, (k, checked, inputEl) => {
        const next = toggleSet(metricSet, k, checked);
        if (next.size === 0) {
          inputEl.checked = true; // prevent empty
          return;
        }
        metricSet = next;
        renderAll();
      });

      bindSwitch(ui.chartTypeEl, chartType, (v) => {
        chartType = v === 'line' ? 'line' : 'bar';
        renderAll();
      });

      // Resize handling
      if (chart && ui.chartEl) {
        if (window.ResizeObserver) {
          const ro = new ResizeObserver(() => chart && chart.resize());
          ro.observe(ui.chartEl);
        } else {
          window.addEventListener('resize', () => chart && chart.resize());
        }
      }

      // first paint
      setActiveSwitch(ui.chartTypeEl, chartType);
      renderAll();
    },
  });
})();
