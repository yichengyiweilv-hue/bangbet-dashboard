(function () {
  'use strict';

  const moduleId = 'betflow';

  // 国家固定顺序
  const COUNTRY_ORDER = ['GH', 'KE', 'NG', 'TZ', 'UG'];

  // 指标定义：人均 = BET_FLOW / BET_PLACED_USER
  const METRIC_DEFS = [
    { key: 'total', label: '人均总流水', flow: 'TOTAL_BET_FLOW', users: 'TOTAL_BET_PLACED_USER' },
    { key: 'sports', label: '人均体育流水', flow: 'SPORTS_BET_FLOW', users: 'SPORTS_BET_PLACED_USER' },
    { key: 'games', label: '人均游戏流水', flow: 'GAMES_BET_FLOW', users: 'GAMES_BET_PLACED_USER' },
  ];

  const WINDOW_ORDER = ['D0', 'D7'];
  const CHART_TYPES = [
    { key: 'bar', label: '月度柱状图' },
    { key: 'line', label: '日级折线图' },
  ];

  const STYLE_ID = 'ovp-style-filter-table-v1';

  function safeNumber(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  function fmtNumber(v, digits = 2) {
    const n = safeNumber(v);
    if (n === null) return '—';
    return n.toLocaleString('en-US', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  }

  function getCssVar(name, fallback) {
    try {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name);
      return (v || '').trim() || fallback;
    } catch (_) {
      return fallback;
    }
  }

  function monthShortLabel(monthKey) {
    const s = String(monthKey || '');
    // 2025-09 -> 9月
    const mm = s.slice(5, 7);
    const n = Number(mm);
    return Number.isFinite(n) ? `${n}月` : s;
  }

  function escapeHtml(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function injectStylesOnce() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* Filters */
      .ovp-filter{
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background: rgba(249, 250, 251, 0.90);
        padding: 10px 12px;
        display:flex;
        flex-wrap:wrap;
        gap: 10px 14px;
      }
      .ovp-filter-group{
        display:flex;
        flex-direction:column;
        gap:8px;
        min-width: 210px;
        flex: 1 1 240px;
      }
      .ovp-filter-label{
        font-size:11px;
        color: var(--muted);
        line-height:1.3;
      }
      .ovp-filter-options{
        display:flex;
        flex-wrap:wrap;
        gap: 8px 10px;
      }
      .ovp-opt{
        display:inline-flex;
        align-items:center;
        gap:6px;
        padding: 4px 8px;
        border-radius: 999px;
        border: 1px solid rgba(148, 163, 184, 0.45);
        background: rgba(255,255,255,0.92);
        color: var(--text);
        font-size:12px;
        line-height: 1.2;
        user-select:none;
      }
      .ovp-opt input{
        accent-color: var(--ovp-blue, ${getCssVar('--ovp-blue', '#2563eb')});
      }
      .ovp-filter-help{
        flex: 1 1 100%;
        margin-top: 2px;
        font-size: 11px;
        color: var(--muted);
        line-height: 1.5;
      }

      /* Table */
      .ovp-table-wrap{
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background: #ffffff;
        overflow:hidden;
      }
      .ovp-table-scroll{
        width:100%;
        overflow:auto;
      }
      table.ovp-table{
        width:100%;
        border-collapse:separate;
        border-spacing:0;
        font-size:12px;
        color: var(--text);
        min-width: 620px;
      }
      table.ovp-table th, table.ovp-table td{
        padding:10px 10px;
        border-bottom:1px solid rgba(148, 163, 184, 0.35);
        vertical-align:middle;
        white-space:nowrap;
      }
      table.ovp-table th{
        position:sticky;
        top:0;
        background: rgba(249, 250, 251, 0.98);
        z-index: 1;
        font-weight:600;
        text-align:left;
      }
      table.ovp-table tr:last-child td{ border-bottom:none; }
      table.ovp-table td.is-num{
        text-align:right;
        font-variant-numeric: tabular-nums;
      }
      table.ovp-table td.is-dim{
        color: var(--muted);
      }
      .ovp-table-caption{
        padding: 10px 12px;
        border-bottom:1px solid rgba(148, 163, 184, 0.35);
        background: rgba(249, 250, 251, 0.90);
        font-size: 11px;
        color: var(--muted);
        line-height: 1.45;
      }
    `;
    document.head.appendChild(style);
  }

  function metricByKey(key) {
    return METRIC_DEFS.find((m) => m.key === key) || METRIC_DEFS[0];
  }

  // 预聚合：月度 sums[month][country][field] = sum
  function buildMonthlySums(rawByMonth) {
    const sums = {};
    const fields = [];
    for (const w of WINDOW_ORDER) {
      for (const m of METRIC_DEFS) {
        fields.push(`${w}_${m.flow}`);
        fields.push(`${w}_${m.users}`);
      }
    }

    const src = rawByMonth && typeof rawByMonth === 'object' ? rawByMonth : {};
    for (const month of Object.keys(src)) {
      const rows = src[month];
      if (!Array.isArray(rows)) continue;
      if (!sums[month]) sums[month] = {};
      for (const r of rows) {
        const c = r && r.country ? String(r.country) : '';
        if (!c) continue;
        if (!sums[month][c]) sums[month][c] = {};
        const bucket = sums[month][c];
        for (const f of fields) {
          const v = safeNumber(r[f]);
          if (v === null) continue;
          bucket[f] = (bucket[f] || 0) + v;
        }
      }
    }
    return sums;
  }

  function monthlyPerCapita(monthlySums, month, country, windowKey, metricKey) {
    const metric = metricByKey(metricKey);
    const bucket = monthlySums?.[month]?.[country];
    if (!bucket) return null;

    const numField = `${windowKey}_${metric.flow}`;
    const denField = `${windowKey}_${metric.users}`;

    const num = safeNumber(bucket[numField]);
    const den = safeNumber(bucket[denField]);
    if (num === null || den === null || den === 0) return null;
    return num / den;
  }

  function dailyPerCapita(row, windowKey, metricKey) {
    const metric = metricByKey(metricKey);
    const numField = `${windowKey}_${metric.flow}`;
    const denField = `${windowKey}_${metric.users}`;

    const num = safeNumber(row?.[numField]);
    const den = safeNumber(row?.[denField]);
    if (num === null || den === null || den === 0) return null;
    return num / den;
  }

  function buildMonthColorMap(months) {
    const base = [
      getCssVar('--ovp-blue', '#2563eb'),
      getCssVar('--ovp-yellow', '#F6C344'),
      '#10b981',
      '#ef4444',
      '#8b5cf6',
      '#0ea5e9',
      '#f97316',
      '#14b8a6',
    ];
    const map = {};
    (months || []).forEach((m, idx) => {
      map[m] = base[idx % base.length];
    });
    return map;
  }

  function buildCountryColorMap() {
    return {
      GH: getCssVar('--ovp-blue', '#2563eb'),
      KE: getCssVar('--ovp-yellow', '#F6C344'),
      NG: '#10b981',
      TZ: '#ef4444',
      UG: '#8b5cf6',
    };
  }

  function ensureAtLeastOneChecked(groupInputs, fallbackInput) {
    const anyChecked = groupInputs.some((el) => el.checked);
    if (!anyChecked && fallbackInput) fallbackInput.checked = true;
  }

  function getCheckedValues(scopeEl, group) {
    return Array.from(scopeEl.querySelectorAll(`input[data-group="${group}"]:checked`)).map((el) => String(el.value));
  }

  function setSingleChecked(scopeEl, group, keepEl) {
    const inputs = Array.from(scopeEl.querySelectorAll(`input[data-group="${group}"]`));
    inputs.forEach((el) => {
      el.checked = el === keepEl;
    });
  }

  OVP.registerModule({
    id: moduleId,
    title: 'D0 / D7 人均流水（总 / 体育 / 游戏）',
    subtitle: '口径：BET_FLOW / BET_PLACED_USER（按月汇总；单位：币种同 data.js）',
    span: 'full',

    render({ mountEl, rawByMonth, months, latestMonth, utils }) {
      injectStylesOnce();

      const u = utils || OVP.utils || {};
      const allMonths = Array.isArray(months) ? months.slice() : (rawByMonth ? Object.keys(rawByMonth) : []);
      const monthList = typeof u.sortMonths === 'function' ? u.sortMonths(allMonths) : allMonths.slice().sort((a, b) => String(a).localeCompare(String(b)));
      const latest = latestMonth || monthList[monthList.length - 1] || '';

      const monthlySums = buildMonthlySums(rawByMonth || {});
      const countryColors = buildCountryColorMap();

      // Layout
      mountEl.innerHTML = `
        <div class="ovp-module-stack">
          <div class="ovp-filter" data-el="filter">
            <div class="ovp-filter-group">
              <div class="ovp-filter-label">图形</div>
              <div class="ovp-filter-options" data-el="chartType"></div>
            </div>

            <div class="ovp-filter-group">
              <div class="ovp-filter-label">月份（多选）</div>
              <div class="ovp-filter-options" data-el="months"></div>
            </div>

            <div class="ovp-filter-group">
              <div class="ovp-filter-label">国家（多选）</div>
              <div class="ovp-filter-options" data-el="countries"></div>
            </div>

            <div class="ovp-filter-group">
              <div class="ovp-filter-label">D窗口（多选）</div>
              <div class="ovp-filter-options" data-el="windows"></div>
            </div>

            <div class="ovp-filter-group">
              <div class="ovp-filter-label">指标（单选）</div>
              <div class="ovp-filter-options" data-el="metric"></div>
            </div>

            <div class="ovp-filter-help" data-el="help"></div>
          </div>

          <div>
            <div class="ovp-chart" data-el="chart" style="height:380px;"></div>
            <div class="ovp-chart-note" data-el="note"></div>
          </div>

          <div class="ovp-table-wrap">
            <div class="ovp-table-caption" data-el="tableCaption"></div>
            <div class="ovp-table-scroll">
              <table class="ovp-table" data-el="table"></table>
            </div>
          </div>

          <div class="ovp-insight" data-el="insight"></div>
        </div>
      `;

      const filterEl = mountEl.querySelector('[data-el="filter"]');
      const chartEl = mountEl.querySelector('[data-el="chart"]');
      const noteEl = mountEl.querySelector('[data-el="note"]');
      const tableEl = mountEl.querySelector('[data-el="table"]');
      const tableCaptionEl = mountEl.querySelector('[data-el="tableCaption"]');
      const insightEl = mountEl.querySelector('[data-el="insight"]');
      const helpEl = mountEl.querySelector('[data-el="help"]');

      // Build options
      const chartTypeBox = mountEl.querySelector('[data-el="chartType"]');
      chartTypeBox.innerHTML = CHART_TYPES.map((t, idx) => {
        const checked = idx === 0 ? 'checked' : '';
        return `
          <label class="ovp-opt" title="${escapeHtml(t.key)}">
            <input type="checkbox" data-group="chartType" value="${escapeHtml(t.key)}" ${checked} />
            <span>${escapeHtml(t.label)}</span>
          </label>
        `;
      }).join('');

      const monthsBox = mountEl.querySelector('[data-el="months"]');
      monthsBox.innerHTML = monthList.map((m) => {
        const checked = m === latest ? 'checked' : '';
        const label = `${monthShortLabel(m)}`;
        return `
          <label class="ovp-opt" title="${escapeHtml(m)}">
            <input type="checkbox" data-group="month" value="${escapeHtml(m)}" ${checked} />
            <span>${escapeHtml(label)}</span>
          </label>
        `;
      }).join('');

      const countriesBox = mountEl.querySelector('[data-el="countries"]');
      countriesBox.innerHTML = COUNTRY_ORDER.map((c) => {
        const checked = 'checked';
        return `
          <label class="ovp-opt" title="${escapeHtml(c)}">
            <input type="checkbox" data-group="country" value="${escapeHtml(c)}" ${checked} />
            <span>${escapeHtml(c)}</span>
          </label>
        `;
      }).join('');

      const windowsBox = mountEl.querySelector('[data-el="windows"]');
      windowsBox.innerHTML = WINDOW_ORDER.map((w) => `
        <label class="ovp-opt" title="${escapeHtml(w)}">
          <input type="checkbox" data-group="window" value="${escapeHtml(w)}" checked />
          <span>${escapeHtml(w)}</span>
        </label>
      `).join('');

      const metricBox = mountEl.querySelector('[data-el="metric"]');
      metricBox.innerHTML = METRIC_DEFS.map((m, idx) => {
        const checked = idx === 0 ? 'checked' : '';
        return `
          <label class="ovp-opt" title="${escapeHtml(m.key)}">
            <input type="checkbox" data-group="metric" value="${escapeHtml(m.key)}" ${checked} />
            <span>${escapeHtml(m.label)}</span>
          </label>
        `;
      }).join('');

      // Default help text
      helpEl.textContent = '提示：柱状图按「月内汇总后再相除」；折线图按「当日相除」。D7 用斜线纹理 / 实线区分。';

      // Init chart
      let chart = null;
      if (window.echarts && typeof window.echarts.init === 'function') {
        chart = window.echarts.init(chartEl);
        window.addEventListener('resize', () => {
          try { chart && chart.resize(); } catch (_) {}
        });
      } else {
        if (noteEl) noteEl.textContent = 'ECharts 未加载：请检查 index.html 里 echarts 脚本是否正常。';
      }

      function getSelections() {
        // chartType / metric 是“单选（checkbox实现）”
        const chartType = getCheckedValues(filterEl, 'chartType')[0] || 'bar';
        const metric = getCheckedValues(filterEl, 'metric')[0] || 'total';

        const monthsSel = getCheckedValues(filterEl, 'month');
        const countriesSel = getCheckedValues(filterEl, 'country');
        const windowsSel = getCheckedValues(filterEl, 'window');

        const monthsSorted = typeof u.sortMonths === 'function' ? u.sortMonths(monthsSel) : monthsSel.slice().sort((a, b) => String(a).localeCompare(String(b)));
        const countriesOrdered = COUNTRY_ORDER.filter((c) => countriesSel.includes(c));
        const windowsOrdered = WINDOW_ORDER.filter((w) => windowsSel.includes(w));

        return { chartType, metric, months: monthsSorted, countries: countriesOrdered, windows: windowsOrdered };
      }

      function renderInsight(sel) {
        if (!insightEl) return;
        const ms = sel.months.length ? sel.months : (latest ? [latest] : []);
        const parts = ms.map((m) => {
          const txt = (typeof OVP.getInsight === 'function') ? (OVP.getInsight(moduleId, m) || '') : '';
          if (!txt) return `【${m}】\n（insights.js 未填写 betflow 文案）`;
          return `【${m}】\n${txt}`;
        });
        const merged = parts.join('\n\n');
        insightEl.textContent = merged || '（insights.js 未填写 betflow 文案）';
        insightEl.classList.toggle('is-empty', !merged || /^\s*（insights\.js/.test(merged));
      }

      function renderTable(sel) {
        if (!tableEl || !tableCaptionEl) return;

        const metricDef = metricByKey(sel.metric);
        const monthsUse = sel.months.length ? sel.months : (latest ? [latest] : []);
        const countriesUse = sel.countries.length ? sel.countries : COUNTRY_ORDER.slice();
        const windowsUse = sel.windows.length ? sel.windows : WINDOW_ORDER.slice();

        const colDefs = [];
        for (const m of monthsUse) {
          for (const w of windowsUse) {
            colDefs.push({ month: m, window: w, key: `${m}|${w}`, label: `${monthShortLabel(m)} ${w}` });
          }
        }

        tableCaptionEl.textContent = `数据表：${metricDef.label}（单位：币种同 data.js；口径：${windowsUse.join('/')} ${metricDef.flow} ÷ ${metricDef.users}）`;

        const thead = `
          <thead>
            <tr>
              <th>国家</th>
              ${colDefs.map((c) => `<th>${escapeHtml(c.label)}</th>`).join('')}
            </tr>
          </thead>
        `;

        const tbodyRows = countriesUse.map((country) => {
          const tds = colDefs.map((c) => {
            const v = monthlyPerCapita(monthlySums, c.month, country, c.window, sel.metric);
            return `<td class="is-num">${escapeHtml(fmtNumber(v, 2))}</td>`;
          }).join('');
          return `<tr><td>${escapeHtml(country)}</td>${tds}</tr>`;
        }).join('');

        tableEl.innerHTML = `${thead}<tbody>${tbodyRows}</tbody>`;
      }

      function buildBarOption(sel) {
        const metricDef = metricByKey(sel.metric);
        const monthsUse = sel.months.length ? sel.months : (latest ? [latest] : []);
        const countriesUse = sel.countries.length ? sel.countries : COUNTRY_ORDER.slice();
        const windowsUse = sel.windows.length ? sel.windows : WINDOW_ORDER.slice();

        const monthColors = buildMonthColorMap(monthsUse);

        const d7Decal = {
          symbol: 'rect',
          symbolSize: 1,
          dashArrayX: [1, 0],
          dashArrayY: [2, 2],
          rotation: Math.PI / 4,
        };

        const series = [];
        for (const m of monthsUse) {
          for (const w of windowsUse) {
            const color = monthColors[m] || getCssVar('--ovp-blue', '#2563eb');
            const name = `${monthShortLabel(m)} ${w}`;
            const data = countriesUse.map((c) => monthlyPerCapita(monthlySums, m, c, w, sel.metric));

            series.push({
              name,
              type: 'bar',
              data,
              barMaxWidth: 18,
              itemStyle: w === 'D7'
                ? { color, decal: d7Decal }
                : { color },
            });
          }
        }

        return {
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: (params) => {
              if (!Array.isArray(params) || !params.length) return '';
              const country = params[0].axisValue;
              const lines = [`${country}`];
              for (const p of params) {
                lines.push(`${p.marker}${p.seriesName}：${fmtNumber(p.data, 2)}`);
              }
              return lines.join('<br/>');
            },
          },
          legend: {
            type: 'scroll',
            top: 8,
            left: 10,
            right: 10,
            textStyle: { color: getCssVar('--text', '#0f172a') },
          },
          grid: { left: 48, right: 18, top: 54, bottom: 36, containLabel: true },
          xAxis: {
            type: 'category',
            data: countriesUse,
            axisLabel: { color: getCssVar('--muted', '#6b7280') },
            axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.55)' } },
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              color: getCssVar('--muted', '#6b7280'),
              formatter: (v) => fmtNumber(v, 0),
            },
            splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.25)' } },
          },
          series,
        };
      }

      function buildLineOption(sel) {
        const metricDef = metricByKey(sel.metric);
        const monthsUse = sel.months.length ? sel.months : (latest ? [latest] : []);
        const countriesUse = sel.countries.length ? sel.countries : COUNTRY_ORDER.slice();
        const windowsUse = sel.windows.length ? sel.windows : WINDOW_ORDER.slice();

        // 收集日期 + 值：按国家（+D窗）聚合为一条线（多月拼接到同一条线里）
        const dateSet = new Set();
        const valueMap = {}; // key: country|window -> {date:value}

        for (const m of monthsUse) {
          const rows = (rawByMonth && rawByMonth[m]) ? rawByMonth[m] : [];
          if (!Array.isArray(rows)) continue;

          for (const r of rows) {
            const c = r?.country ? String(r.country) : '';
            if (!countriesUse.includes(c)) continue;
            const d = r?.date ? String(r.date) : '';
            if (!d) continue;

            dateSet.add(d);

            for (const w of windowsUse) {
              const key = `${c}|${w}`;
              if (!valueMap[key]) valueMap[key] = {};
              valueMap[key][d] = dailyPerCapita(r, w, sel.metric);
            }
          }
        }

        const dates = Array.from(dateSet).sort((a, b) => String(a).localeCompare(String(b)));

        const series = [];
        for (const c of countriesUse) {
          const color = countryColors[c] || getCssVar('--ovp-blue', '#2563eb');
          for (const w of windowsUse) {
            const key = `${c}|${w}`;
            const map = valueMap[key] || {};
            const data = dates.map((d) => (Object.prototype.hasOwnProperty.call(map, d) ? map[d] : null));

            series.push({
              name: `${c} ${w}`,
              type: 'line',
              data,
              showSymbol: false,
              connectNulls: true,
              lineStyle: {
                width: 2,
                type: w === 'D0' ? 'dashed' : 'solid',
                color,
              },
              itemStyle: { color },
              emphasis: { focus: 'series' },
            });
          }
        }

        return {
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'line' },
            formatter: (params) => {
              if (!Array.isArray(params) || !params.length) return '';
              const date = params[0].axisValue;
              const lines = [`${date}`];
              for (const p of params) {
                lines.push(`${p.marker}${p.seriesName}：${fmtNumber(p.data, 2)}`);
              }
              return lines.join('<br/>');
            },
          },
          legend: {
            type: 'scroll',
            top: 8,
            left: 10,
            right: 10,
            textStyle: { color: getCssVar('--text', '#0f172a') },
          },
          grid: { left: 48, right: 18, top: 54, bottom: 46, containLabel: true },
          xAxis: {
            type: 'category',
            data: dates,
            axisLabel: {
              color: getCssVar('--muted', '#6b7280'),
              rotate: 45,
              formatter: (v) => String(v).slice(5), // MM-DD
            },
            axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.55)' } },
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              color: getCssVar('--muted', '#6b7280'),
              formatter: (v) => fmtNumber(v, 0),
            },
            splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.25)' } },
          },
          series,
        };
      }

      function renderChart(sel) {
        const metricDef = metricByKey(sel.metric);
        const monthsUse = sel.months.length ? sel.months : (latest ? [latest] : []);
        const windowsUse = sel.windows.length ? sel.windows : WINDOW_ORDER.slice();

        if (noteEl) {
          const formula = windowsUse.map((w) => `${w}_${metricDef.flow} ÷ ${w}_${metricDef.users}`).join('；');
          noteEl.textContent = `口径：${formula}；柱状图=月内汇总后再相除；折线图=当日相除。单位：币种同 data.js。`;
        }

        if (!chart) return;

        const option = sel.chartType === 'line'
          ? buildLineOption(sel)
          : buildBarOption(sel);

        try {
          chart.clear();
          chart.setOption(option, { notMerge: true, lazyUpdate: false });
          chart.resize();
        } catch (e) {
          if (noteEl) noteEl.textContent = `图表渲染失败：${(e && e.message) ? e.message : 'unknown error'}`;
        }
      }

      function updateAll() {
        const sel = getSelections();
        renderChart(sel);
        renderTable(sel);
        renderInsight(sel);
      }

      // Filter interactions
      filterEl.addEventListener('change', (ev) => {
        const target = ev.target;
        if (!(target instanceof HTMLInputElement)) return;
        const group = target.getAttribute('data-group');
        if (!group) return;

        const inputs = Array.from(filterEl.querySelectorAll(`input[data-group="${group}"]`));
        const checked = inputs.filter((i) => i.checked);

        // 单选组：chartType / metric
        if (group === 'chartType' || group === 'metric') {
          if (target.checked) {
            setSingleChecked(filterEl, group, target);
          } else {
            // 不能全关
            ensureAtLeastOneChecked(inputs, target);
            if (!target.checked && inputs.every((i) => !i.checked)) {
              target.checked = true;
            }
          }
        } else {
          // 多选组：month / country / window
          // 至少保留一个（避免空态）
          if (checked.length === 0) {
            target.checked = true;
          }
        }

        updateAll();
      });

      // 初次渲染：保证单选组只有一个 checked
      (function normalizeDefaults() {
        const ct = Array.from(filterEl.querySelectorAll('input[data-group="chartType"]'));
        const ctChecked = ct.filter((i) => i.checked);
        if (ctChecked.length !== 1) setSingleChecked(filterEl, 'chartType', ctChecked[0] || ct[0]);

        const mt = Array.from(filterEl.querySelectorAll('input[data-group="metric"]'));
        const mtChecked = mt.filter((i) => i.checked);
        if (mtChecked.length !== 1) setSingleChecked(filterEl, 'metric', mtChecked[0] || mt[0]);

        const monthInputs = Array.from(filterEl.querySelectorAll('input[data-group="month"]'));
        if (!monthInputs.some((i) => i.checked)) {
          const fallback = monthInputs.find((i) => i.value === latest) || monthInputs[0];
          if (fallback) fallback.checked = true;
        }
      })();

      updateAll();
    },
  });
})(); 
