// organic-monthly/module-payrate.js
// 模块 2：D0 / D7 付费率
// 口径：D0_unique_purchase / registration；D7_unique_purchase / registration

(function () {
  'use strict';

  const MODULE_ID = 'payrate';
  const TITLE = 'D0 / D7 付费率';
  const SUBTITLE = '自然量注册 cohort 的 D0/D7 付费率（D0_unique_purchase/registration；D7_unique_purchase/registration）';

  const COUNTRY_ORDER = ['GH', 'KE', 'NG', 'TZ', 'UG'];
  const METRIC_DEFS = [
    { key: 'D0', field: 'D0_unique_purchase', label: 'D0' },
    { key: 'D7', field: 'D7_unique_purchase', label: 'D7' },
  ];

  function uniq(arr) {
    return Array.from(new Set((Array.isArray(arr) ? arr : []).map(String)));
  }

  function safeNum(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function monthLabel(ym) {
    // "2025-09" -> "9月"
    const m = String(ym || '').slice(5, 7);
    const mi = Number(m);
    return Number.isFinite(mi) && mi > 0 ? `${mi}月` : String(ym || '');
  }

  function ensureStyle() {
    if (document.getElementById('ovp-style-payrate')) return;
    const style = document.createElement('style');
    style.id = 'ovp-style-payrate';
    style.textContent = `
      .ovp-payrate{ display:flex; flex-direction:column; gap:12px; }
      .ovp-payrate-filters{
        display:flex; flex-wrap:wrap; gap:12px;
        padding:12px;
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background: rgba(249, 250, 251, 0.85);
      }
      .ovp-payrate-group{ min-width: 220px; flex: 1 1 240px; }
      .ovp-payrate-group-title{
        font-size:11px; color: var(--muted);
        margin:0 0 8px;
        display:flex; align-items:center; justify-content:space-between; gap:8px;
      }
      .ovp-payrate-options{ display:flex; flex-wrap:wrap; gap:8px; }
      .ovp-payrate-pill{
        display:inline-flex; align-items:center; gap:6px;
        padding:6px 10px;
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:999px;
        background: rgba(255,255,255,0.95);
        font-size:12px;
        color: var(--text);
        cursor:pointer;
        user-select:none;
      }
      .ovp-payrate-pill input{ transform: translateY(0.5px); accent-color: #2563eb; }
      .ovp-payrate-pill.is-disabled{ opacity:0.55; cursor:not-allowed; }
      .ovp-payrate-help{ font-size:11px; color: var(--muted); line-height:1.55; margin-top:6px; }
      .ovp-payrate-table-wrap{
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background: rgba(249, 250, 251, 0.90);
        overflow:auto;
      }
      table.ovp-payrate-table{
        width:100%;
        border-collapse:separate;
        border-spacing:0;
        font-size:12px;
        min-width: 760px;
      }
      table.ovp-payrate-table thead th{
        position: sticky;
        top: 0;
        z-index: 2;
        background: rgba(255,255,255,0.98);
        color: var(--text);
        text-align:right;
        padding:10px 10px;
        border-bottom:1px solid rgba(148, 163, 184, 0.60);
        white-space:nowrap;
      }
      table.ovp-payrate-table thead th:first-child,
      table.ovp-payrate-table tbody td:first-child{
        position: sticky;
        left: 0;
        z-index: 3;
        background: rgba(255,255,255,0.98);
        text-align:left;
      }
      table.ovp-payrate-table tbody td{
        padding:9px 10px;
        border-bottom:1px solid rgba(148, 163, 184, 0.30);
        text-align:right;
        white-space:nowrap;
        color: var(--text);
      }
      table.ovp-payrate-table tbody tr:last-child td{ border-bottom:none; }
      .ovp-payrate-empty{
        padding:12px;
        color: var(--muted);
        font-size:11px;
        line-height:1.6;
      }
    `;
    document.head.appendChild(style);
  }

  function buildCheckboxPills({ name, options, selectedSet, type = 'checkbox' }) {
    // options: [{value,label}]
    return options
      .map((opt) => {
        const id = `${name}-${String(opt.value).replace(/[^\w-]/g, '_')}`;
        const checked = selectedSet.has(String(opt.value)) ? 'checked' : '';
        return `
          <label class="ovp-payrate-pill" for="${id}">
            <input id="${id}" type="${type}" name="${name}" value="${String(opt.value)}" ${checked} />
            <span>${opt.label}</span>
          </label>
        `;
      })
      .join('');
  }

  function calcMonthlyRates(rawByMonth, month, countries) {
    // returns: { country: { reg, D0_purchase, D7_purchase, D0_rate, D7_rate } }
    const rows = Array.isArray(rawByMonth && rawByMonth[month]) ? rawByMonth[month] : [];
    const out = {};
    for (const c of countries) {
      out[c] = { reg: 0, D0_purchase: 0, D7_purchase: 0, D0_rate: null, D7_rate: null };
    }
    for (const r of rows) {
      const c = String(r && r.country);
      if (!out[c]) continue;
      out[c].reg += safeNum(r.registration);
      out[c].D0_purchase += safeNum(r.D0_unique_purchase);
      out[c].D7_purchase += safeNum(r.D7_unique_purchase);
    }
    for (const c of Object.keys(out)) {
      const reg = out[c].reg;
      out[c].D0_rate = reg > 0 ? out[c].D0_purchase / reg : null;
      out[c].D7_rate = reg > 0 ? out[c].D7_purchase / reg : null;
    }
    return out;
  }

  function buildDailyAgg(rawByMonth, months, countries) {
    // returns: { [country]: { [date]: {reg,d0,d7} } }, allDatesSorted[]
    const monthsSorted = (window.OVP && OVP.utils && typeof OVP.utils.sortMonths === 'function')
      ? OVP.utils.sortMonths(months)
      : (Array.isArray(months) ? months.slice().sort() : []);

    const allowed = new Set(countries.map(String));
    const byC = {};
    const dateSet = new Set();

    for (const c of countries) byC[c] = {};

    for (const m of monthsSorted) {
      const rows = Array.isArray(rawByMonth && rawByMonth[m]) ? rawByMonth[m] : [];
      for (const r of rows) {
        const c = String(r && r.country);
        if (!allowed.has(c)) continue;
        const d = String(r && r.date);
        if (!d) continue;

        dateSet.add(d);
        const bucket = byC[c][d] || (byC[c][d] = { reg: 0, d0: 0, d7: 0 });
        bucket.reg += safeNum(r.registration);
        bucket.d0 += safeNum(r.D0_unique_purchase);
        bucket.d7 += safeNum(r.D7_unique_purchase);
      }
    }

    const dates = Array.from(dateSet).sort(); // YYYY-MM-DD lexical == chronological
    return { byC, dates };
  }

  function pickColors() {
    // 5 国家的固定配色（同国家 D0/D7 共用）
    return {
      GH: '#2563eb', // blue
      KE: '#16a34a', // green
      NG: '#f97316', // orange
      TZ: '#7c3aed', // purple
      UG: '#0ea5e9', // sky
    };
  }

  function getThemeColor(varName, fallback) {
    try {
      const v = getComputedStyle(document.documentElement).getPropertyValue(varName);
      return (v || '').trim() || fallback;
    } catch (_e) {
      return fallback;
    }
  }

  function fmtPct(utils, v) {
    if (!utils || typeof utils.fmtPct !== 'function') {
      return (v === null || v === undefined || !Number.isFinite(Number(v))) ? '—' : `${(Number(v) * 100).toFixed(2)}%`;
    }
    return utils.fmtPct(v, 2);
  }

  function renderModule(ctx) {
    ensureStyle();

    const mountEl = ctx && ctx.mountEl;
    const rawByMonth = (ctx && ctx.rawByMonth) || {};
    const monthsAll = Array.isArray(ctx && ctx.months) ? ctx.months.slice() : [];
    const latestMonth = (ctx && ctx.latestMonth) || (monthsAll.length ? monthsAll[monthsAll.length - 1] : null);
    const utils = ctx && ctx.utils;

    const countriesAll = COUNTRY_ORDER.filter((c) => true); // 固定国家顺序

    if (!mountEl) return;

    const monthOptions = (monthsAll.length ? monthsAll : (latestMonth ? [latestMonth] : []))
      .map((m) => ({ value: m, label: monthLabel(m) }));

    const countryOptions = countriesAll.map((c) => ({ value: c, label: c }));
    const metricOptions = METRIC_DEFS.map((m) => ({ value: m.key, label: m.key }));
    const viewOptions = [
      { value: 'bar', label: '月度柱状图' },
      { value: 'line', label: '日级折线图' },
    ];

    // Default state
    const state = {
      months: latestMonth ? [String(latestMonth)] : (monthsAll.length ? [String(monthsAll[monthsAll.length - 1])] : []),
      countries: countriesAll.slice(),
      metrics: ['D0', 'D7'],
      view: 'bar',
    };

    const moduleUid = `ovp-${MODULE_ID}-${Math.random().toString(16).slice(2)}`;

    mountEl.innerHTML = `
      <div class="ovp-payrate" id="${moduleUid}">
        <div class="ovp-payrate-filters">
          <div class="ovp-payrate-group">
            <div class="ovp-payrate-group-title"><span>月份</span><span class="ovp-payrate-help" id="hint-month-${MODULE_ID}"></span></div>
            <div class="ovp-payrate-options" id="filters-month-${MODULE_ID}">
              ${buildCheckboxPills({ name: `${moduleUid}-month`, options: monthOptions, selectedSet: new Set(state.months), type: 'checkbox' })}
            </div>
          </div>

          <div class="ovp-payrate-group">
            <div class="ovp-payrate-group-title"><span>国家</span></div>
            <div class="ovp-payrate-options" id="filters-country-${MODULE_ID}">
              ${buildCheckboxPills({ name: `${moduleUid}-country`, options: countryOptions, selectedSet: new Set(state.countries), type: 'checkbox' })}
            </div>
          </div>

          <div class="ovp-payrate-group">
            <div class="ovp-payrate-group-title"><span>图表</span></div>
            <div class="ovp-payrate-options" id="filters-view-${MODULE_ID}">
              ${buildCheckboxPills({ name: `${moduleUid}-view`, options: viewOptions, selectedSet: new Set([state.view]), type: 'radio' })}
            </div>
          </div>

          <div class="ovp-payrate-group">
            <div class="ovp-payrate-group-title"><span>口径</span></div>
            <div class="ovp-payrate-options" id="filters-metric-${MODULE_ID}">
              ${buildCheckboxPills({ name: `${moduleUid}-metric`, options: metricOptions, selectedSet: new Set(state.metrics), type: 'checkbox' })}
            </div>
            <div class="ovp-payrate-help">D0：首日付费人数/注册；D7：7 日内付费人数/注册</div>
          </div>
        </div>

        <div class="ovp-chart" id="chart-${moduleUid}" style="height:360px;"></div>
        <div class="ovp-chart-note" id="chart-note-${moduleUid}"></div>

        <div class="ovp-payrate-table-wrap" id="table-wrap-${moduleUid}">
          <div class="ovp-payrate-empty" id="table-empty-${moduleUid}" style="display:none;"></div>
          <table class="ovp-payrate-table" id="table-${moduleUid}"></table>
        </div>

        <div class="ovp-insight is-empty" id="insight-${moduleUid}">文案待填写：./insights.js</div>
      </div>
    `;

    const rootEl = mountEl.querySelector(`#${moduleUid}`);
    const chartEl = mountEl.querySelector(`#chart-${moduleUid}`);
    const chartNoteEl = mountEl.querySelector(`#chart-note-${moduleUid}`);
    const tableEl = mountEl.querySelector(`#table-${moduleUid}`);
    const tableEmptyEl = mountEl.querySelector(`#table-empty-${moduleUid}`);
    const insightEl = mountEl.querySelector(`#insight-${moduleUid}`);
    const hintMonthEl = mountEl.querySelector(`#hint-month-${MODULE_ID}`);

    // ECharts init
    const canChart = !!(window.echarts && chartEl);
    const chart = canChart ? echarts.init(chartEl) : null;

    const countryColors = pickColors();
    const barBaseColor = getThemeColor('--ovp-blue', '#2563eb');

    function readCheckedValues(selector) {
      return Array.from(rootEl.querySelectorAll(selector))
        .filter((el) => el && el.checked)
        .map((el) => String(el.value));
    }

    function syncInputs(groupName, valuesSet) {
      const nodes = rootEl.querySelectorAll(`input[name="${groupName}"]`);
      for (const n of nodes) n.checked = valuesSet.has(String(n.value));
    }

    function renderInsight(selectedMonthsSorted) {
      const src = (window.OVP && OVP.insights) ? OVP.insights : {};
      const monthSpecific = [];
      for (const m of selectedMonthsSorted) {
        const t = (src[m] && src[m][MODULE_ID]) ? String(src[m][MODULE_ID]).trim() : '';
        if (t) monthSpecific.push({ m, t });
      }

      let out = '';
      if (monthSpecific.length) {
        out = monthSpecific
          .map(({ m, t }) => `${monthLabel(m)}：\n${t}`.trim())
          .join('\n\n');
      } else {
        const def = (src.__default__ && src.__default__[MODULE_ID]) ? String(src.__default__[MODULE_ID]).trim() : '';
        out = def;
      }

      if (!out) {
        insightEl.textContent = '文案待填写：./insights.js';
        insightEl.classList.add('is-empty');
        return;
      }

      insightEl.textContent = out;
      insightEl.classList.remove('is-empty');
    }

    function renderTable(selectedMonthsSorted, selectedCountriesOrdered, selectedMetricsOrdered) {
      if (!selectedMonthsSorted.length) {
        tableEl.innerHTML = '';
        tableEmptyEl.style.display = '';
        tableEmptyEl.textContent = '未选择月份：请至少勾选 1 个月份。';
        return;
      }
      if (!selectedCountriesOrdered.length) {
        tableEl.innerHTML = '';
        tableEmptyEl.style.display = '';
        tableEmptyEl.textContent = '未选择国家：请至少勾选 1 个国家。';
        return;
      }
      if (!selectedMetricsOrdered.length) {
        tableEl.innerHTML = '';
        tableEmptyEl.style.display = '';
        tableEmptyEl.textContent = '未选择口径：请至少勾选 D0 或 D7。';
        return;
      }

      tableEmptyEl.style.display = 'none';

      // Pre-calc per month once
      const byMonth = {};
      for (const m of selectedMonthsSorted) {
        byMonth[m] = calcMonthlyRates(rawByMonth, m, countriesAll);
      }

      const ths = [];
      ths.push('<th>国家</th>');
      for (const m of selectedMonthsSorted) {
        for (const k of selectedMetricsOrdered) {
          ths.push(`<th>${monthLabel(m)}自然量${k} 付费率</th>`);
        }
      }

      const rowsHtml = [];
      for (const c of selectedCountriesOrdered) {
        const tds = [];
        tds.push(`<td>${c}</td>`);
        for (const m of selectedMonthsSorted) {
          const agg = (byMonth[m] && byMonth[m][c]) ? byMonth[m][c] : null;
          const d0 = agg ? agg.D0_rate : null;
          const d7 = agg ? agg.D7_rate : null;
          for (const k of selectedMetricsOrdered) {
            const v = (k === 'D0') ? d0 : d7;
            tds.push(`<td>${fmtPct(utils, v)}</td>`);
          }
        }
        rowsHtml.push(`<tr>${tds.join('')}</tr>`);
      }

      tableEl.innerHTML = `
        <thead><tr>${ths.join('')}</tr></thead>
        <tbody>${rowsHtml.join('')}</tbody>
      `;
    }

    function renderBar(focusMonth, selectedCountriesOrdered, selectedMetricsOrdered) {
      if (!chart) return;

      const agg = calcMonthlyRates(rawByMonth, focusMonth, countriesAll);

      const x = selectedCountriesOrdered;
      const d0 = x.map((c) => (agg[c] ? agg[c].D0_rate : null));
      const d7 = x.map((c) => (agg[c] ? agg[c].D7_rate : null));

      const series = [];
      const showD0 = selectedMetricsOrdered.includes('D0');
      const showD7 = selectedMetricsOrdered.includes('D7');

      if (showD0) {
        series.push({
          name: 'D0',
          type: 'bar',
          barMaxWidth: 36,
          itemStyle: { color: barBaseColor },
          emphasis: { focus: 'series' },
          data: d0,
        });
      }

      if (showD7) {
        series.push({
          name: 'D7',
          type: 'bar',
          barMaxWidth: 36,
          itemStyle: {
            color: barBaseColor,
            decal: {
              symbol: 'rect',
              symbolSize: 2,
              dashArrayX: [1, 0],
              dashArrayY: [2, 0],
              rotation: Math.PI / 4,
              color: 'rgba(255,255,255,0.55)',
            },
          },
          emphasis: { focus: 'series' },
          data: d7,
        });
      }

      chart.setOption(
        {
          grid: { left: 44, right: 18, top: 44, bottom: 44, containLabel: true },
          legend: { top: 10, left: 0, icon: 'roundRect' },
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            valueFormatter: (v) => (Number.isFinite(Number(v)) ? `${(Number(v) * 100).toFixed(2)}%` : '—'),
          },
          xAxis: {
            type: 'category',
            data: x,
            axisTick: { alignWithLabel: true },
            axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.75)' } },
          },
          yAxis: {
            type: 'value',
            axisLabel: { formatter: (v) => `${(Number(v) * 100).toFixed(0)}%` },
            splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.25)' } },
          },
          series,
        },
        { notMerge: true, lazyUpdate: true }
      );
    }

    function renderLine(selectedMonthsSorted, selectedCountriesOrdered, selectedMetricsOrdered) {
      if (!chart) return;

      const showD0 = selectedMetricsOrdered.includes('D0');
      const showD7 = selectedMetricsOrdered.includes('D7');

      const { byC, dates } = buildDailyAgg(rawByMonth, selectedMonthsSorted, selectedCountriesOrdered);

      const series = [];
      for (const c of selectedCountriesOrdered) {
        const color = countryColors[c] || barBaseColor;
        const dayMap = byC[c] || {};

        if (showD0) {
          const data = dates.map((d) => {
            const b = dayMap[d];
            if (!b || b.reg <= 0) return [d, null];
            return [d, b.d0 / b.reg];
          });
          series.push({
            name: `${c} D0`,
            type: 'line',
            showSymbol: false,
            connectNulls: true,
            itemStyle: { color },
            lineStyle: { color, width: 2, type: 'dashed' },
            data,
          });
        }

        if (showD7) {
          const data = dates.map((d) => {
            const b = dayMap[d];
            if (!b || b.reg <= 0) return [d, null];
            return [d, b.d7 / b.reg];
          });
          series.push({
            name: `${c} D7`,
            type: 'line',
            showSymbol: false,
            connectNulls: true,
            itemStyle: { color },
            lineStyle: { color, width: 2, type: 'solid' },
            data,
          });
        }
      }

      chart.setOption(
        {
          grid: { left: 54, right: 18, top: 44, bottom: 56, containLabel: true },
          legend: { top: 10, left: 0, icon: 'roundRect' },
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'line' },
            valueFormatter: (v) => (Number.isFinite(Number(v)) ? `${(Number(v) * 100).toFixed(2)}%` : '—'),
          },
          xAxis: {
            type: 'time',
            axisLabel: {
              formatter: (value) => {
                // value is timestamp
                const d = new Date(value);
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                return `${mm}-${dd}`;
              },
            },
            axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.75)' } },
            splitLine: { show: false },
          },
          yAxis: {
            type: 'value',
            axisLabel: { formatter: (v) => `${(Number(v) * 100).toFixed(0)}%` },
            splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.25)' } },
          },
          dataZoom: [
            { type: 'inside', throttle: 50 },
            { type: 'slider', height: 18, bottom: 18 },
          ],
          series,
        },
        { notMerge: true, lazyUpdate: true }
      );
    }

    function rerender() {
      const selectedMonths = readCheckedValues(`input[name="${moduleUid}-month"]`);
      const selectedCountries = readCheckedValues(`input[name="${moduleUid}-country"]`);
      const selectedMetrics = readCheckedValues(`input[name="${moduleUid}-metric"]`);
      const selectedView = readCheckedValues(`input[name="${moduleUid}-view"]`);

      // Enforce >=1 for months/countries/metrics
      const monthsFixed = selectedMonths.length ? uniq(selectedMonths) : (state.months.length ? state.months.slice() : (latestMonth ? [String(latestMonth)] : []));
      const countriesFixed = selectedCountries.length ? uniq(selectedCountries) : countriesAll.slice();
      const metricsFixed = selectedMetrics.length ? uniq(selectedMetrics) : ['D0', 'D7'];
      const viewFixed = selectedView.length ? String(selectedView[0]) : state.view;

      // Sync UI if any auto-fix happened
      syncInputs(`${moduleUid}-month`, new Set(monthsFixed));
      syncInputs(`${moduleUid}-country`, new Set(countriesFixed));
      syncInputs(`${moduleUid}-metric`, new Set(metricsFixed));
      syncInputs(`${moduleUid}-view`, new Set([viewFixed]));

      state.months = monthsFixed;
      state.countries = countriesFixed;
      state.metrics = metricsFixed;
      state.view = viewFixed;

      const monthsSorted = (utils && typeof utils.sortMonths === 'function') ? utils.sortMonths(monthsFixed) : monthsFixed.slice().sort();
      const countriesOrdered = COUNTRY_ORDER.filter((c) => countriesFixed.includes(c));
      const metricsOrdered = METRIC_DEFS.map((m) => m.key).filter((k) => metricsFixed.includes(k));

      // Small hint: bar chart uses latest selected month
      const focusMonth = monthsSorted.length ? monthsSorted[monthsSorted.length - 1] : latestMonth;
      if (hintMonthEl) {
        hintMonthEl.textContent = (state.view === 'bar' && focusMonth)
          ? `柱状图展示：${monthLabel(focusMonth)}`
          : '';
      }

      // Chart
      if (!chart) {
        chartEl.classList.add('is-empty');
        chartEl.innerHTML = `
          <div class="ovp-payrate-empty">
            未检测到 echarts：请确认 index.html 已加载图表库。
          </div>
        `;
      } else if (!focusMonth) {
        chart.clear();
        chartNoteEl.textContent = '未检测到可用月份 key：请检查 data.js 的 RAW_ORGANIC_BY_MONTH。';
      } else if (state.view === 'bar') {
        renderBar(focusMonth, countriesOrdered, metricsOrdered);
        chartNoteEl.textContent = `柱状图口径：${monthLabel(focusMonth)} 月聚合付费率；D7 柱用斜线阴影区分。`;
      } else {
        renderLine(monthsSorted, countriesOrdered, metricsOrdered);
        chartNoteEl.textContent = `折线图口径：所选月份的日级付费率；D0 为虚线、D7 为实线；同国家共用颜色。`;
      }

      // Table
      renderTable(monthsSorted, countriesOrdered, metricsOrdered);

      // Insight
      renderInsight(monthsSorted);
    }

    // Wire events
    rootEl.addEventListener('change', (e) => {
      const t = e && e.target;
      if (!t || !t.name) return;
      if (
        t.name === `${moduleUid}-month` ||
        t.name === `${moduleUid}-country` ||
        t.name === `${moduleUid}-metric` ||
        t.name === `${moduleUid}-view`
      ) {
        rerender();
      }
    });

    // Resize
    if (chart) {
      const onResize = () => chart.resize();
      window.addEventListener('resize', onResize, { passive: true });
    }

    // First render
    rerender();
  }

  // Register
  if (window.OVP && typeof OVP.registerModule === 'function') {
    OVP.registerModule({
      id: MODULE_ID,
      title: TITLE,
      subtitle: SUBTITLE,
      render: renderModule,
    });
  }
})();
